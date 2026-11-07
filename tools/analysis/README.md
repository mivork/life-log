# ライフログ分析エンジン (Python, Phase 2)

data.json（スキーマ v1）から週次サマリー `summary.json` / `summary.md` を生成します。

```bash
python3 analyze.py /path/to/data.json --out /path/to/output-dir
```

- pandas があれば pandas を使い、無ければ標準ライブラリにフォールバックします（サマリーの `engine` 欄に記録されます）。
- 出力内容: 期間集計（平均睡眠・体重変化・記録率・運動実施率）、日種別傾向、相関（睡眠×翌日体調、睡眠×同日メンタル、カフェイン×睡眠、運動有無×メンタルの群間平均）。
- 相関はすべて「仮説」として表現し、n 数と注意書きを必ず付けます。n が 5 未満の相関は出しません。
- `rules/rules.lua` のルールを Python 側で等価に実装し、フラグとして出力します。
- 同梱の `sample-data.json` は全てダミー値のサンプル（実データではありません）。`summary.json` / `summary.md` はこのサンプルから生成した確認用出力です。
