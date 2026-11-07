-- ライフログ条件分岐ルール (Phase 5)
-- 役割: 分析時に参照する「条件 → フラグ」のルールを、コードから分離して外部記述する。
--
-- 仕様メモ:
-- - このファイルがルールの「正（仕様）」である。
-- - 現在の分析エンジン (tools/analysis/analyze.py) は Lua を直接実行せず、
--   下記と等価な判定を Python 側に実装している（evaluate_flags）。
-- - ルールを変えるときは、このファイルと Python 実装の両方を揃えて更新し、
--   片方だけ変えた状態で運用しない。
-- - フラグは助言の材料であり、医療的な診断ではない。

rules = {
  {
    id = "low_sleep_streak_3d",
    description = "睡眠6時間未満が3日連続したら警告フラグ",
    when = { field = "health.sleep_hours", op = "<", value = 6, streak_days = 3 },
    flag = "low_sleep_streak_3d",
    advice = "回復を優先する週にするのが安全です。",
  },
  {
    id = "high_stress_streak_4d",
    description = "ストレス度4以上が4日連続したら警告フラグ",
    when = { field = "health.stress_score", op = ">=", value = 4, streak_days = 4 },
    flag = "high_stress_streak_4d",
    advice = "負荷を上げる提案はせず、休養を優先してください。",
  },
  {
    id = "recording_gap_4d",
    description = "記録が4日以上途切れたら再開支援フラグ",
    when = { field = "__gap_days_since_last_record", op = ">=", value = 4 },
    flag = "recording_gap_4d",
    advice = "忙しい日種別では記録が薄くなるのは自然です。再開は1項目だけでも十分です。",
  },
  {
    id = "low_condition_streak_3d",
    description = "体調スコア2以下が3日連続したら受診検討フラグ",
    when = { field = "health.condition_score", op = "<=", value = 2, streak_days = 3 },
    flag = "low_condition_streak_3d",
    advice = "体調不良が続いています。無理をせず、医療機関への相談も検討してください（診断ではありません）。",
  },
}

return rules
