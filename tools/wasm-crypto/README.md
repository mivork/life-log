# lifelog-wasm-crypto (Rust / WASM, Phase 4)

ブラウザ側のレコード検証と、パスフレーズ由来キーによるローカル暗号化/復号を行う Rust モジュール。

- 鍵導出: Argon2id（ランダムソルト16 bytes）
- 暗号: AES-256-GCM（ランダムノンス12 bytes、認証付き暗号）
- 出力: base64( salt || nonce || ciphertext )
- XOR 等の玩具実装は使っていない

## 検証状況

- 2026-11-07: 一時取得した Rust ツールチェインで確認済み。
  - `cargo test` 合格（レコード検証、暗号化→復号の往復、パスフレーズ違い・改ざんの検知）
  - `cargo build --target wasm32-unknown-unknown --release` 成功（.wasm 生成まで確認）
- wasm-pack による JS グルー生成とフロント連携は Phase 4 の連携ステップとして未実施（設計は `docs/phase4-wasm.md`）。
  恒常環境に Rust は入っていないため、再ビルド時は下記手順でツールチェインの用意が必要です。

## ビルド再現手順

```bash
# Rust ツールチェイン
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown
cargo install wasm-pack

# ネイティブでのテスト（検証・暗号の往復テストを含む）
cd tools/wasm-crypto
cargo test

# WASM ビルド
wasm-pack build --target web --out-dir pkg
```

フロントエンドとの連携設計は `docs/phase4-wasm.md` を参照。
