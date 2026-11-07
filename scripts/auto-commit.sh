#!/usr/bin/env bash
# ライフログ自動化 (Phase 5): 検証 → 分析 → コミット を一括実行する。
#
# 使い方:
#   LIFELOG_DATA=/path/to/data.json LIFELOG_REPO=/path/to/private-repo ./scripts/auto-commit.sh
#   ./scripts/auto-commit.sh --dry-run   # 既定。実際のコミットはしない
#   ./scripts/auto-commit.sh --apply     # 分析結果の生成とコミットまで実行
#   ./scripts/auto-commit.sh --apply --push
#
# 安全デフォルト:
#   - 既定は dry-run
#   - data.json の置き場所は環境変数で差し替える（公開リポジトリ内に実データを置かない）
#   - 検証に失敗したら分析・コミットには進まない
set -euo pipefail

DRY_RUN=1
PUSH=0
for arg in "$@"; do
  case "$arg" in
    --apply) DRY_RUN=0 ;;
    --dry-run) DRY_RUN=1 ;;
    --push) PUSH=1 ;;
    *) echo "unknown option: $arg" >&2; exit 2 ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
DATA_PATH="${LIFELOG_DATA:-$ROOT_DIR/data-private/data.json}"
REPO_PATH="${LIFELOG_REPO:-$ROOT_DIR/data-private}"
OUT_DIR="${LIFELOG_OUT:-$REPO_PATH/analysis}"

if [ ! -f "$DATA_PATH" ]; then
  echo "data.json が見つかりません: $DATA_PATH" >&2
  echo "LIFELOG_DATA 環境変数で実データの場所を指定してください（公開repo内には置かないこと）。" >&2
  exit 1
fi

echo "[1/3] 検証: JSON構文チェック"
python3 -m json.tool "$DATA_PATH" > /dev/null
echo "  OK"

echo "[2/3] 分析: summary.json / summary.md を生成"
if [ "$DRY_RUN" = "1" ]; then
  python3 "$ROOT_DIR/tools/analysis/analyze.py" "$DATA_PATH" --out "$(mktemp -d)"
  echo "  (dry-run: 分析は一時ディレクトリへ出力しました)"
else
  mkdir -p "$OUT_DIR"
  python3 "$ROOT_DIR/tools/analysis/analyze.py" "$DATA_PATH" --out "$OUT_DIR"
fi

echo "[3/3] コミット"
if [ ! -d "$REPO_PATH/.git" ]; then
  echo "  同期先が git リポジトリではないためスキップ: $REPO_PATH"
  exit 0
fi
run() {
  if [ "$DRY_RUN" = "1" ]; then
    echo "  [dry-run] $*"
  else
    "$@"
  fi
}
run git -C "$REPO_PATH" add data.json analysis
run git -C "$REPO_PATH" commit -m "data: lifelog auto sync ($(date +%F))"
if [ "$PUSH" = "1" ]; then
  run git -C "$REPO_PATH" push
fi
if [ "$DRY_RUN" = "1" ]; then
  echo "dry-run のため実際の変更は行っていません。実行するには --apply を付けてください。"
fi
echo "完了"
