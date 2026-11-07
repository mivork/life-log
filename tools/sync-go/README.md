# lifelogsync (Go 同期ツール, Phase 3)

data.json（スキーマ v1）の検証と、プライベートリポジトリへの同期を行う CLI。

## 使い方

```bash
cd tools/sync-go

# 検証＋dry-run（既定）: 実行内容を表示するだけで何も変更しない
go run . --data /path/to/data.json --repo /path/to/private-repo

# 実際にコピー＋git add/commit する
go run . --data /path/to/data.json --repo /path/to/private-repo --apply

# push まで行う
go run . --data /path/to/data.json --repo /path/to/private-repo --apply --push

# ビルドする場合
go build -o lifelogsync .
```

設定は環境変数でも指定できます: `LIFELOG_DATA`, `LIFELOG_REPO`。
接続先リポジトリはフラグ/環境変数で差し替え可能です。

## 安全デフォルト
- 既定は dry-run。`--apply` が無ければコピーもコミットも行いません。
- push は `--push` を明示した場合のみ。
- トークン類は埋め込んでいません。push の認証は利用者の git 設定（SSH鍵など）に委ねます。
- 検証内容: version=1、日付形式と重複、day_type/location/weather の列挙値、スコア1〜5、睡眠0〜24h、体重の範囲。

## 検証状況
- 2026-11-07: 一時取得した Go 1.22.5 ツールチェインで `gofmt` / `go vet ./...` / `go build` が通ることを確認済み。
- サンプルデータでの検証OK・dry-run・`--apply` でのコピー＋コミット、異常系（version 不一致の拒否）まで動作確認済み。
- 恒常環境に Go は入っていないため、再ビルド時はツールチェインの用意が別途必要です。
