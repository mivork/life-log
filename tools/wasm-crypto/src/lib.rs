//! ライフログ用 Rust/WASM モジュール (Phase 4)
//!
//! 役割:
//! - `validate_record_json`: 1レコード JSON の検証（スキーマ v1 の範囲チェック）
//! - `encrypt_text` / `decrypt_text`: パスフレーズ由来キーによるローカル暗号化/復号
//!   - 鍵導出: Argon2id（ランダムソルト 16 bytes）
//!   - 暗号: AES-256-GCM（ランダムノンス 12 bytes、認証付き）
//!   - 出力形式: base64( salt(16) || nonce(12) || ciphertext )
//!
//! 注意: パスフレーズ自体は保存しない。復号には同じパスフレーズが必要。
//! 実装上の注意: コアロジックは JsValue に依存しない純粋な関数に分け、
//! ネイティブの `cargo test` でも検証できるようにしている
//! （JsValue の生成は非 wasm ターゲットでは panic するため）。

use aes_gcm::aead::rand_core::RngCore;
use aes_gcm::aead::{Aead, KeyInit, OsRng};
use aes_gcm::{Aes256Gcm, Key, Nonce};
use argon2::Argon2;
use base64::engine::general_purpose::STANDARD as B64;
use base64::Engine;
use wasm_bindgen::prelude::*;

const SALT_LEN: usize = 16;
const NONCE_LEN: usize = 12;

/// スキーマ v1 の1レコードを検証し、問題があれば理由を返す（コア実装）。
/// 戻り値: 空文字 = OK、それ以外 = エラーメッセージ。
pub fn validate_record_impl(json: &str) -> String {
    let value: serde_json::Value = match serde_json::from_str(json) {
        Ok(v) => v,
        Err(e) => return format!("JSONとして読めません: {e}"),
    };
    let date = value.get("date").and_then(|d| d.as_str()).unwrap_or("");
    if date.len() != 10
        || !date.chars().enumerate().all(|(i, c)| {
            if i == 4 || i == 7 { c == '-' } else { c.is_ascii_digit() }
        })
    {
        return "date は YYYY-MM-DD 形式である必要があります".to_string();
    }
    for key in ["condition_score", "mental_score", "stress_score"] {
        if let Some(v) = value
            .get("health")
            .and_then(|h| h.get(key))
            .and_then(|s| s.as_i64())
        {
            if !(1..=5).contains(&v) {
                return format!("{key} は 1〜5 である必要があります");
            }
        }
    }
    if let Some(s) = value
        .get("health")
        .and_then(|h| h.get("sleep_hours"))
        .and_then(|s| s.as_f64())
    {
        if !(0.0..=24.0).contains(&s) {
            return "sleep_hours は 0〜24 である必要があります".to_string();
        }
    }
    String::new()
}

/// スキーマ v1 の1レコードを検証する（WASM 公開用ラッパー）。
#[wasm_bindgen]
pub fn validate_record_json(json: &str) -> String {
    validate_record_impl(json)
}

fn derive_key(passphrase: &str, salt: &[u8]) -> Result<[u8; 32], String> {
    let mut key = [0u8; 32];
    Argon2::default()
        .hash_password_into(passphrase.as_bytes(), salt, &mut key)
        .map_err(|e| format!("鍵導出に失敗しました: {e}"))?;
    Ok(key)
}

/// パスフレーズで平文を暗号化し、base64 文字列を返す（コア実装）。
pub fn encrypt_impl(passphrase: &str, plaintext: &str) -> Result<String, String> {
    let mut salt = [0u8; SALT_LEN];
    OsRng.fill_bytes(&mut salt);
    let key_bytes = derive_key(passphrase, &salt)?;
    let cipher = Aes256Gcm::new(Key::<Aes256Gcm>::from_slice(&key_bytes));
    let mut nonce = [0u8; NONCE_LEN];
    OsRng.fill_bytes(&mut nonce);
    let ciphertext = cipher
        .encrypt(Nonce::from_slice(&nonce), plaintext.as_bytes())
        .map_err(|_| "暗号化に失敗しました".to_string())?;
    let mut out = Vec::with_capacity(SALT_LEN + NONCE_LEN + ciphertext.len());
    out.extend_from_slice(&salt);
    out.extend_from_slice(&nonce);
    out.extend_from_slice(&ciphertext);
    Ok(B64.encode(out))
}

/// `encrypt_impl` の出力をパスフレーズで復号する（コア実装）。
/// パスフレーズが違う場合は AES-GCM の認証で失敗する。
pub fn decrypt_impl(passphrase: &str, encoded: &str) -> Result<String, String> {
    let raw = B64
        .decode(encoded.trim())
        .map_err(|_| "base64として読めません".to_string())?;
    if raw.len() < SALT_LEN + NONCE_LEN + 1 {
        return Err("暗号文が短すぎます".to_string());
    }
    let (salt, rest) = raw.split_at(SALT_LEN);
    let (nonce, ciphertext) = rest.split_at(NONCE_LEN);
    let key_bytes = derive_key(passphrase, salt)?;
    let cipher = Aes256Gcm::new(Key::<Aes256Gcm>::from_slice(&key_bytes));
    let plaintext = cipher
        .decrypt(Nonce::from_slice(nonce), ciphertext)
        .map_err(|_| "復号に失敗しました（パスフレーズ違いの可能性）".to_string())?;
    String::from_utf8(plaintext).map_err(|_| "復号結果がUTF-8ではありません".to_string())
}

/// パスフレーズで平文を暗号化する（WASM 公開用ラッパー）。
#[wasm_bindgen]
pub fn encrypt_text(passphrase: &str, plaintext: &str) -> Result<String, JsValue> {
    encrypt_impl(passphrase, plaintext).map_err(|e| JsValue::from_str(&e))
}

/// 暗号文をパスフレーズで復号する（WASM 公開用ラッパー）。
#[wasm_bindgen]
pub fn decrypt_text(passphrase: &str, encoded: &str) -> Result<String, JsValue> {
    decrypt_impl(passphrase, encoded).map_err(|e| JsValue::from_str(&e))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn record_validation_ok_and_ng() {
        let ok = r#"{"date":"2026-11-07","health":{"condition_score":3,"sleep_hours":7.0}}"#;
        assert_eq!(validate_record_impl(ok), "");
        let ng = r#"{"date":"2026/11/07","health":{}}"#;
        assert!(!validate_record_impl(ng).is_empty());
        let bad_score = r#"{"date":"2026-11-07","health":{"mental_score":9}}"#;
        assert!(!validate_record_impl(bad_score).is_empty());
    }

    #[test]
    fn encrypt_decrypt_roundtrip() {
        let enc = encrypt_impl("test-passphrase", "{\"version\":1}").unwrap();
        let dec = decrypt_impl("test-passphrase", &enc).unwrap();
        assert_eq!(dec, "{\"version\":1}");
        // パスフレーズが違えば AES-GCM の認証で必ず失敗する
        assert!(decrypt_impl("wrong-passphrase", &enc).is_err());
        // 暗号文を改変しても認証で失敗する
        let mut chars: Vec<char> = enc.chars().collect();
        let last = chars.len() - 2;
        chars[last] = if chars[last] == 'A' { 'B' } else { 'A' };
        let tampered: String = chars.into_iter().collect();
        assert!(decrypt_impl("test-passphrase", &tampered).is_err());
    }
}
