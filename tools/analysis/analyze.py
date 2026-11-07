#!/usr/bin/env python3
"""ライフログ分析エンジン (Phase 2)

data.json (スキーマ v1) を読み、週次サマリー summary.json / summary.md を生成する。
pandas が使える環境では pandas を使い、無ければ標準ライブラリにフォールバックする。

使い方:
    python3 analyze.py [data.json のパス] [--out 出力ディレクトリ]

相関はすべて「仮説」として表現する。因果関係は断定しない。
サンプル数が少ない相関には必ず注意書きを付ける。
医療的な診断は行わない。
"""

from __future__ import annotations

import argparse
import json
import math
import os
import statistics
import sys
from datetime import date, timedelta

try:
    import pandas as pd  # noqa: F401

    HAS_PANDAS = True
except Exception:
    HAS_PANDAS = False

MIN_N_FOR_CORR = 5  # これ未満の n では相関を出さず「データ不足」とする


# ---------------------------------------------------------------- utilities
def parse_date(s: str) -> date:
    return date.fromisoformat(s)


def pearson(xs, ys):
    pairs = [(x, y) for x, y in zip(xs, ys) if x is not None and y is not None]
    if len(pairs) < MIN_N_FOR_CORR:
        return None, len(pairs)
    xs = [p[0] for p in pairs]
    ys = [p[1] for p in pairs]
    if HAS_PANDAS:
        import pandas as pd

        r = pd.Series(xs).corr(pd.Series(ys))
        return (None if math.isnan(r) else float(r)), len(pairs)
    mx, my = statistics.fmean(xs), statistics.fmean(ys)
    num = sum((x - mx) * (y - my) for x, y in pairs)
    den = math.sqrt(sum((x - mx) ** 2 for x in xs) * sum((y - my) ** 2 for y in ys))
    if den == 0:
        return None, len(pairs)
    return num / den, len(pairs)


def mean_or_none(vals):
    nums = [v for v in vals if v is not None]
    return round(statistics.fmean(nums), 2) if nums else None


def corr_entry(name, xs, ys, note):
    r, n = pearson(xs, ys)
    entry = {"name": name, "n": n, "note": note}
    if r is None:
        entry["r"] = None
        entry["reading"] = (
            f"データ不足（n={n}）。{MIN_N_FOR_CORR}件以上そろうまで相関は出しません。"
        )
    else:
        entry["r"] = round(r, 2)
        strength = "弱い" if abs(r) < 0.3 else ("中程度の" if abs(r) < 0.6 else "比較的強い")
        direction = "正" if r >= 0 else "負"
        entry["reading"] = (
            f"{strength}{direction}の相関が見られます（仮説）。因果関係を断定するものではありません。"
        )
    return entry


# ---------------------------------------------------------------- rules
# rules/rules.lua に外部記述したルールの Python 側実装（Lua が正・仕様）。
def evaluate_flags(records):
    flags = []
    sorted_recs = sorted(records, key=lambda r: r["date"])
    # ルール1: 睡眠6h未満が3日連続
    streak = 0
    for r in sorted_recs:
        s = r["health"].get("sleep_hours")
        if s is not None and s < 6:
            streak += 1
            if streak >= 3:
                flags.append(
                    {
                        "rule": "low_sleep_streak_3d",
                        "date": r["date"],
                        "message": "睡眠6時間未満が3日続いています。回復を優先する週にするのが安全です（助言であり診断ではありません）。",
                    }
                )
                streak = 0
        elif s is not None:
            streak = 0
    # ルール2: ストレス4以上が4日連続
    streak = 0
    for r in sorted_recs:
        st = r["health"].get("stress_score")
        if st is not None and st >= 4:
            streak += 1
            if streak >= 4:
                flags.append(
                    {
                        "rule": "high_stress_streak_4d",
                        "date": r["date"],
                        "message": "ストレス度4以上が4日続いています。負荷を上げる提案はせず、休養と相談先の確認を優先してください。",
                    }
                )
                streak = 0
        elif st is not None:
            streak = 0
    # ルール2.5: 体調スコア2以下が3日連続
    streak = 0
    for r in sorted_recs:
        cs = r["health"].get("condition_score")
        if cs is not None and cs <= 2:
            streak += 1
            if streak >= 3:
                flags.append(
                    {
                        "rule": "low_condition_streak_3d",
                        "date": r["date"],
                        "message": "体調スコア2以下が3日続いています。無理をせず、医療機関への相談も検討してください（診断ではありません）。",
                    }
                )
                streak = 0
        elif cs is not None:
            streak = 0
    # ルール3: 記録が4日以上途切れた
    if sorted_recs:
        last = parse_date(sorted_recs[-1]["date"])
        gap = (date.today() - last).days
        if gap >= 4:
            flags.append(
                {
                    "rule": "recording_gap_4d",
                    "date": sorted_recs[-1]["date"],
                    "message": f"最終記録から{gap}日あいています。忙しい日種別では記録が薄くなるのは自然です。再開は1項目だけでも十分です。",
                }
            )
    return flags


# ---------------------------------------------------------------- main
def analyze(data: dict) -> dict:
    records = sorted(data.get("records", []), key=lambda r: r["date"])
    summary: dict = {
        "schema_version": data.get("version"),
        "engine": "pandas" if HAS_PANDAS else "stdlib-fallback",
        "record_count": len(records),
    }
    if not records:
        summary["period"] = None
        summary["message"] = "レコードがありません。"
        summary["correlations"] = []
        summary["flags"] = []
        return summary

    first, last = parse_date(records[0]["date"]), parse_date(records[-1]["date"])
    span_days = (last - first).days + 1
    summary["period"] = {"from": records[0]["date"], "to": records[-1]["date"], "days": span_days}
    summary["coverage_rate"] = round(len(records) / span_days, 3) if span_days else None

    sleeps = [r["health"].get("sleep_hours") for r in records]
    summary["avg_sleep_hours"] = mean_or_none(sleeps)

    weights = [r for r in records if r["health"].get("weight_kg") is not None]
    if len(weights) >= 2:
        summary["weight_change_kg"] = round(
            weights[-1]["health"]["weight_kg"] - weights[0]["health"]["weight_kg"], 2
        )
    else:
        summary["weight_change_kg"] = None

    summary["avg_condition"] = mean_or_none([r["health"].get("condition_score") for r in records])
    summary["avg_mental"] = mean_or_none([r["health"].get("mental_score") for r in records])
    summary["avg_stress"] = mean_or_none([r["health"].get("stress_score") for r in records])
    summary["avg_caffeine_cups"] = mean_or_none([r["care"].get("caffeine_cups") for r in records])
    summary["avg_water_ml"] = mean_or_none([r["care"].get("water_ml") for r in records])
    ex = [r["activity"].get("exercise") for r in records]
    ex_known = [v for v in ex if v is not None]
    summary["exercise_rate"] = (
        round(sum(1 for v in ex_known if v) / len(ex_known), 3) if ex_known else None
    )

    # 日種別傾向
    by_type: dict[str, list] = {}
    for r in records:
        by_type.setdefault(r["context"].get("day_type") or "", []).append(r)
    summary["by_day_type"] = {
        k: {
            "days": len(v),
            "avg_sleep_hours": mean_or_none([r["health"].get("sleep_hours") for r in v]),
            "avg_condition": mean_or_none([r["health"].get("condition_score") for r in v]),
            "avg_mental": mean_or_none([r["health"].get("mental_score") for r in v]),
        }
        for k, v in by_type.items()
    }

    # 相関（すべて仮説表現）
    next_cond = []
    sleep_for_next = []
    for i in range(len(records) - 1):
        if (parse_date(records[i + 1]["date"]) - parse_date(records[i]["date"])) == timedelta(days=1):
            sleep_for_next.append(records[i]["health"].get("sleep_hours"))
            next_cond.append(records[i + 1]["health"].get("condition_score"))
    mental = [r["health"].get("mental_score") for r in records]
    correlations = [
        corr_entry(
            "睡眠時間 × 翌日の体調スコア",
            sleep_for_next,
            next_cond,
            "連続した2日がそろったペアのみ対象。",
        ),
        corr_entry("睡眠時間 × 同日のメンタルスコア", sleeps, mental, "同日同士の相関。"),
        corr_entry(
            "カフェイン杯数 × 同日の睡眠時間",
            [r["care"].get("caffeine_cups") for r in records],
            sleeps,
            "摂取時刻は記録していないため、時刻要因は分離できません。",
        ),
    ]
    # 運動有無 × メンタル（群間平均差）
    ex_yes = [r["health"].get("mental_score") for r in records if r["activity"].get("exercise") is True]
    ex_no = [r["health"].get("mental_score") for r in records if r["activity"].get("exercise") is False]
    m_yes, m_no = mean_or_none(ex_yes), mean_or_none(ex_no)
    correlations.append(
        {
            "name": "運動有無 × メンタルスコア（群間平均）",
            "n": len([v for v in ex_yes + ex_no if v is not None]),
            "exercise_days_avg_mental": m_yes,
            "rest_days_avg_mental": m_no,
            "reading": (
                "運動した日としない日のメンタル平均の差は観察材料です（仮説）。"
                "体調が良いから運動できた、という逆向きの説明もあり得ます。"
                if m_yes is not None and m_no is not None
                else "どちらかの群のデータが不足しています。"
            ),
        }
    )
    summary["correlations"] = correlations
    summary["flags"] = evaluate_flags(records)
    summary["caveats"] = [
        "相関は因果関係を示しません。すべて仮説として扱ってください。",
        "単日の値で断定せず、7日・28日の傾向で読んでください。",
        "このサマリーは医療的診断ではありません。",
    ]
    return summary


def render_md(s: dict) -> str:
    lines = ["# ライフログ週次サマリー", ""]
    if s.get("period"):
        p = s["period"]
        lines.append(f"- 期間: {p['from']} 〜 {p['to']}（{p['days']}日間）")
    lines.append(f"- 記録日数: {s['record_count']}日 / 記録率: {s.get('coverage_rate')}")
    lines.append(f"- 分析エンジン: {s['engine']}")
    lines.append(f"- 平均睡眠: {s.get('avg_sleep_hours')} h")
    lines.append(f"- 体重変化: {s.get('weight_change_kg')} kg")
    lines.append(
        f"- 平均スコア 体調 {s.get('avg_condition')} / メンタル {s.get('avg_mental')} / ストレス {s.get('avg_stress')}"
    )
    lines.append(f"- 運動実施率: {s.get('exercise_rate')}")
    lines.append("")
    lines.append("## 日種別傾向")
    for k, v in (s.get("by_day_type") or {}).items():
        lines.append(
            f"- {k or '未入力'}: {v['days']}日, 平均睡眠 {v['avg_sleep_hours']}h, 平均体調 {v['avg_condition']}, 平均メンタル {v['avg_mental']}"
        )
    lines.append("")
    lines.append("## 相関（すべて仮説）")
    for c in s.get("correlations", []):
        r = c.get("r")
        head = f"- **{c['name']}**（n={c['n']}）"
        if r is not None:
            head += f" r={r}"
        if c.get("exercise_days_avg_mental") is not None:
            head += f" 運動日 {c['exercise_days_avg_mental']} / 休息日 {c['rest_days_avg_mental']}"
        lines.append(head)
        lines.append(f"  - {c['reading']}")
        if c.get("note"):
            lines.append(f"  - 注意: {c['note']}")
    lines.append("")
    lines.append("## フラグ（rules.lua のルール適用結果）")
    if s.get("flags"):
        for f in s["flags"]:
            lines.append(f"- [{f['rule']}] {f['date']}: {f['message']}")
    else:
        lines.append("- 該当なし")
    lines.append("")
    lines.append("## 注意書き")
    for c in s.get("caveats", []):
        lines.append(f"- {c}")
    return "\n".join(lines) + "\n"


def main() -> int:
    ap = argparse.ArgumentParser(description="ライフログ分析エンジン")
    ap.add_argument("data", nargs="?", default="data.json", help="data.json のパス")
    ap.add_argument("--out", default=".", help="summary.json / summary.md の出力先")
    args = ap.parse_args()

    if not os.path.exists(args.data):
        print(f"data file not found: {args.data}", file=sys.stderr)
        return 1
    with open(args.data, encoding="utf-8") as fh:
        data = json.load(fh)
    if data.get("version") != 1:
        print("unsupported schema version (expected 1)", file=sys.stderr)
        return 1

    summary = analyze(data)
    os.makedirs(args.out, exist_ok=True)
    with open(os.path.join(args.out, "summary.json"), "w", encoding="utf-8") as fh:
        json.dump(summary, fh, ensure_ascii=False, indent=2)
    with open(os.path.join(args.out, "summary.md"), "w", encoding="utf-8") as fh:
        fh.write(render_md(summary))
    print(f"summary written to {args.out} (records={summary['record_count']}, engine={summary['engine']})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
