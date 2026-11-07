"use strict";
// ライフログ フロントエンド (TypeScript)
// データは localStorage キー `lifelog.records.v1` にのみ保存する。
// 外部送信は一切しない。入出力は data.json スキーマ v1 形式。
const i18n = {
    ja: {
        site_title: "ライフログ",
        site_lead: "生活サポート＆ライフログ。記録データはこのブラウザの中（localStorage）に保存され、プライベート同期を設定した場合のみ、自分の非公開リポジトリへ送信されます。",
        lang_label: "言語",
        tab_record: "記録",
        tab_analysis: "分析",
        slide_prev: "前のセクションへ",
        slide_next: "次のセクションへ",
        panel_record_title: "1日の記録",
        fs_date: "日付",
        label_date: "日付（必須）",
        fs_context: "生活・環境",
        label_day_type: "スケジュール",
        opt_empty: "未入力",
        opt_school: "学校（通学）",
        opt_online: "オンライン授業",
        opt_work: "バイト・仕事",
        opt_off: "休日",
        label_start_time: "開始時刻",
        label_end_time: "終了時刻",
        label_hours: "時間 (h)",
        label_location: "行動範囲",
        opt_out: "外出",
        opt_home: "在宅",
        opt_mixed: "外出＋在宅",
        label_weather: "天気",
        opt_sunny: "晴れ",
        opt_cloudy: "くもり",
        opt_rain: "雨",
        opt_snow: "雪",
        label_context_note: "環境メモ",
        fs_health: "ヘルスケア",
        label_weight: "体重 (kg)",
        label_sleep: "睡眠時間 (h)",
        label_bath: "入浴",
        opt_yes: "○",
        opt_no: "×",
        label_breakfast: "朝食",
        label_lunch: "昼食",
        label_dinner: "夕食",
        label_condition: "体調スコア (1–5)",
        label_mental: "メンタルスコア (1–5)",
        label_stress: "ストレス度 (1–5)",
        fs_care: "美容・セルフケア",
        label_face_wash: "洗顔",
        label_skincare: "スキンケア",
        label_teeth_morning: "歯磨き（朝）",
        label_teeth_night: "歯磨き（夜）",
        label_water: "水分摂取量 (ml)",
        label_caffeine: "カフェイン (杯)",
        label_snack: "間食",
        opt_snack_yes: "○ あり",
        opt_snack_no: "× なし",
        fs_activity: "運動・支出",
        label_exercise: "運動",
        opt_exercise_yes: "○ した",
        opt_exercise_no: "× しなかった",
        label_abs_video: "腹筋動画 (A–G)",
        opt_none: "なし",
        label_long_walk: "長距離歩行",
        label_spending: "ざっくり支出 (円)",
        label_exercise_detail: "運動の詳細（自由入力）",
        label_spending_tags: "支出タグ（カンマ区切り。例: 食費, 交通, 日用品）",
        fs_diary: "ライフログ日記",
        label_reflection: "1日の振り返り",
        label_mood: "感情メモ",
        btn_save: "保存する",
        btn_new: "新規入力に戻す",
        panel_list_title: "記録一覧",
        th_date: "日付",
        th_day_type: "日種別",
        th_hours: "時間",
        th_weight: "体重",
        th_sleep: "睡眠",
        th_condition: "体調",
        th_mental: "メンタル",
        th_actions: "操作",
        record_empty: "まだ記録がありません。",
        panel_data_title: "データの入出力",
        data_desc: "データは data.json スキーマ v1 形式で書き出し／読み込みできます。実データのファイルは公開リポジトリに置かず、プライベートな場所で管理してください。",
        btn_export: "JSONを書き出す",
        btn_import: "JSONを読み込む",
        btn_sample: "ダミーサンプルを読み込む",
        panel_analysis_title: "分析",
        stat_count_label: "記録日数",
        stat_coverage_label: "記録率（期間内）",
        stat_sleep_label: "平均睡眠時間",
        stat_weight_label: "体重の変化（最初→最後）",
        chart_weight_title: "体重の推移",
        chart_sleep_title: "睡眠時間の推移",
        chart_scores_title: "体調・メンタルスコアの推移",
        chart_scatter_title: "睡眠時間 × 翌日の体調スコア",
        chart_daytype_title: "日種別サマリー",
        footer_text: "このサイトは記録ツールです。医療的な診断は行いません。体調不良が続く場合は医療機関への相談を検討してください。",
        nav_context: "生活・環境",
        nav_health: "ヘルスケア",
        nav_care: "美容・セルフケア",
        nav_activity: "運動・支出",
        nav_diary: "ライフログ日記",
        nav_list: "記録一覧",
        nav_data: "データの入出力",
        nav_today: "今日",
        today_advice_title: "Museからのアドバイス",
        today_advice_none: "まだアドバイスはありません。同期を設定すると、記録をもとに Muse がアドバイスを書きます。",
        today_training_title: "今日のトレーニング",
        today_rest: "今日は通学日（火・木）のため休息日です。ストレッチだけ軽くどうぞ。",
        today_suggest: "今日のおすすめは 動画{video} です。",
        today_suggest_back: "腰の違和感が残っているので、無理のない範囲で。痛みがあれば休んでください。",
        today_week_done: "今週のセッションは目標の4回に到達しています。今日は休んでも、軽くでもOKです。",
        today_week_left: "今週は {count}/4 回（目標まで あと {left} 回）",
        today_stat_streak: "記録の連続日数: {days} 日",
        today_stat_weight: "体重: 最新 {latest} kg（前回比 {delta} kg）",
        today_stat_weight_none: "体重: まだ記録がありません",
        today_training_btn: "運動の記録へ",
        label_soreness: "筋肉痛（翌日・0〜3）",
        label_circuit_sets: "サーキットのセット数",
        today_circuit_menu: "腕立て伏せ 20回 ／ クランチ 20回 ／ 右パンチ 20回 ／ 左パンチ 20回 ／ 右キック 20回 ／ 左キック 20回（1セット）",
        today_circuit_day: "今日はサーキットの日です。まずは1〜2セット、フォーム優先で。",
        label_backpain: "腰の違和感（0〜3）",
        sync_title: "プライベート同期（GitHub・非公開リポジトリ）",
        sync_repo_label: "同期先リポジトリ（owner/repo）",
        sync_token_label: "アクセストークン",
        sync_save_btn: "設定を保存して同期",
        sync_pull_btn: "クラウドから読み込む",
        sync_status_unset: "未設定：トークンを入れると自動同期します",
        sync_status_set: "設定済み：記録の変更は自動で同期されます",
        sync_status_ok: "同期済み（{time}）",
        sync_status_fail: "同期に失敗しました。トークンとリポジトリを確認してください",
        sync_note: "トークンはこのブラウザの中だけに保存されます。記録は life-data.json として送られ、腹筋サイトの記録（data.json）と Muse のアドバイス（advice.json）は同じ非公開リポジトリから読み取ります。",
        sync_pull_confirm: "クラウドの記録 {count} 件を読み込み、この端末のデータを置き換えますか？",
        daytype_school: "学校",
        daytype_online: "オンライン",
        daytype_work: "バイト・仕事",
        daytype_off: "休日",
        daytype_empty: "未入力",
        btn_edit: "編集",
        btn_delete: "削除",
        confirm_delete: "{date} の記録を削除しますか？",
        status_saved: "{date} の記録を保存しました",
        status_loaded: "{date} の記録を読み込みました",
        status_deleted: "{date} の記録を削除しました",
        status_new: "新規入力の状態に戻しました",
        status_exported: "data.json を書き出しました。このファイルはプライベートな場所で管理してください。",
        status_imported: "{count} 件を読み込みました（同日付は上書き）。",
        status_import_error: "読み込みに失敗しました: {msg}",
        status_sample: "ダミーサンプル（2026-10-01〜14、実データではありません）を読み込みました。",
        validation_date: "日付の形式が正しくありません",
        validation_score: "{name}は1〜5で入力してください",
        validation_sleep: "睡眠時間は0〜24で入力してください",
        validation_weight: "体重の値が範囲外です",
        validation_hours: "時間は0〜24で入力してください",
        validation_error: "入力エラー: {msg}",
        score_condition: "体調スコア",
        score_mental: "メンタルスコア",
        score_stress: "ストレス度",
        stat_days: " 日",
        stat_h: " h",
        chart_weight_label: "体重 (kg)",
        chart_sleep_label: "睡眠時間 (h)",
        chart_condition_label: "体調スコア",
        chart_mental_label: "メンタルスコア",
        chart_scatter_label: "睡眠(h) → 翌日の体調",
        chart_scatter_x: "睡眠時間 (h)",
        chart_scatter_y: "翌日の体調スコア",
        correlation_insufficient: "相関を出すには、睡眠と翌日の体調がそろったデータが3件以上必要です（現在 {n} 件）。相関は仮説として読み、因果は断定しません。",
        correlation_result: "睡眠×翌日体調の相関係数 r = {r}（n={n}）。これは仮説レベルの観察で、因果関係を断定するものではありません。",
        daytype_th_type: "日種別",
        daytype_th_count: "日数",
        daytype_th_sleep: "平均睡眠",
        daytype_th_condition: "平均体調",
        daytype_th_mental: "平均メンタル",
    },
    en: {
        site_title: "LifeLog",
        site_lead: "Life Support & Life Logging. Your data is stored in this browser (localStorage) and is sent only to your own private repository, only if you enable private sync.",
        lang_label: "Lang",
        tab_record: "Record",
        tab_analysis: "Analysis",
        slide_prev: "Previous section",
        slide_next: "Next section",
        panel_record_title: "Daily Record",
        fs_date: "Date",
        label_date: "Date (required)",
        fs_context: "Life & Environment",
        label_day_type: "Schedule",
        opt_empty: "Not set",
        opt_school: "School (commute)",
        opt_online: "Online class",
        opt_work: "Part-time / Work",
        opt_off: "Day off",
        label_start_time: "Start time",
        label_end_time: "End time",
        label_hours: "Hours (h)",
        label_location: "Location",
        opt_out: "Out",
        opt_home: "Home",
        opt_mixed: "Out + Home",
        label_weather: "Weather",
        opt_sunny: "Sunny",
        opt_cloudy: "Cloudy",
        opt_rain: "Rain",
        opt_snow: "Snow",
        label_context_note: "Environment note",
        fs_health: "Healthcare",
        label_weight: "Weight (kg)",
        label_sleep: "Sleep (h)",
        label_bath: "Bath",
        opt_yes: "Yes",
        opt_no: "No",
        label_breakfast: "Breakfast",
        label_lunch: "Lunch",
        label_dinner: "Dinner",
        label_condition: "Condition score (1–5)",
        label_mental: "Mental score (1–5)",
        label_stress: "Stress level (1–5)",
        fs_care: "Beauty & Self-care",
        label_face_wash: "Face wash",
        label_skincare: "Skincare",
        label_teeth_morning: "Teeth (morning)",
        label_teeth_night: "Teeth (night)",
        label_water: "Water intake (ml)",
        label_caffeine: "Caffeine (cups)",
        label_snack: "Snacks",
        opt_snack_yes: "Yes",
        opt_snack_no: "No",
        fs_activity: "Exercise & Spending",
        label_exercise: "Exercise",
        opt_exercise_yes: "Yes",
        opt_exercise_no: "No",
        label_abs_video: "Ab video (A–G)",
        opt_none: "None",
        label_long_walk: "Long walk",
        label_spending: "Rough spending (JPY)",
        label_exercise_detail: "Exercise details (free text)",
        label_spending_tags: "Spending tags (comma-separated, e.g. food, transport, daily goods)",
        fs_diary: "Life Log Diary",
        label_reflection: "Daily reflection",
        label_mood: "Mood memo",
        btn_save: "Save",
        btn_new: "New entry",
        panel_list_title: "Record List",
        th_date: "Date",
        th_day_type: "Day type",
        th_hours: "Hours",
        th_weight: "Weight",
        th_sleep: "Sleep",
        th_condition: "Condition",
        th_mental: "Mental",
        th_actions: "Actions",
        record_empty: "No records yet.",
        panel_data_title: "Data Import / Export",
        data_desc: "Data can be exported / imported in data.json schema v1 format. Keep real data files private — do not put them in a public repository.",
        btn_export: "Export JSON",
        btn_import: "Import JSON",
        btn_sample: "Load dummy sample",
        panel_analysis_title: "Analysis",
        stat_count_label: "Days recorded",
        stat_coverage_label: "Coverage (within period)",
        stat_sleep_label: "Average sleep",
        stat_weight_label: "Weight change (first → last)",
        chart_weight_title: "Weight Trend",
        chart_sleep_title: "Sleep Duration Trend",
        chart_scores_title: "Condition & Mental Score Trend",
        chart_scatter_title: "Sleep × Next-day Condition Score",
        chart_daytype_title: "Day-type Summary",
        footer_text: "This site is a logging tool. It does not provide medical diagnoses. If you feel unwell for an extended period, please consider consulting a healthcare professional.",
        nav_context: "Life & Environment",
        nav_health: "Healthcare",
        nav_care: "Beauty & Self-care",
        nav_activity: "Exercise & Spending",
        nav_diary: "Life Log Diary",
        nav_list: "Record List",
        nav_data: "Data I/O",
        nav_today: "Today",
        today_advice_title: "Advice from Muse",
        today_advice_none: "No advice yet. Once sync is set up, Muse will write advice based on your records.",
        today_training_title: "Today's training",
        today_rest: "Today is a school day (Tue/Thu), so it is a rest day. Light stretching only.",
        today_suggest: "Today's pick is Video {video}.",
        today_suggest_back: "Your back still feels off, so keep it easy. Rest if there is pain.",
        today_week_done: "You have reached this week's goal of 4 sessions. Resting or going light today is fine.",
        today_week_left: "This week: {count}/4 sessions ({left} to go)",
        today_stat_streak: "Logging streak: {days} day(s)",
        today_stat_weight: "Weight: latest {latest} kg ({delta} kg vs previous)",
        today_stat_weight_none: "Weight: no records yet",
        today_training_btn: "Go to exercise entry",
        label_soreness: "Soreness (next day, 0-3)",
        label_circuit_sets: "Circuit sets",
        today_circuit_menu: "Push-ups x20 / Crunches x20 / Right punch x20 / Left punch x20 / Right kick x20 / Left kick x20 (per set)",
        today_circuit_day: "Circuit day. Start with 1-2 sets, form first.",
        label_backpain: "Back discomfort (0-3)",
        sync_title: "Private sync (GitHub, private repository)",
        sync_repo_label: "Sync repository (owner/repo)",
        sync_token_label: "Access token",
        sync_save_btn: "Save settings and sync",
        sync_pull_btn: "Load from cloud",
        sync_status_unset: "Not set: enter a token to enable automatic sync",
        sync_status_set: "Set: record changes sync automatically",
        sync_status_ok: "Synced ({time})",
        sync_status_fail: "Sync failed. Check the token and repository",
        sync_note: "The token is stored only in this browser. Records are sent as life-data.json; abs-site records (data.json) and Muse's advice (advice.json) are read from the same private repository.",
        sync_pull_confirm: "Load {count} record(s) from the cloud and replace this device's data?",
        daytype_school: "School",
        daytype_online: "Online",
        daytype_work: "Work",
        daytype_off: "Day off",
        daytype_empty: "Not set",
        btn_edit: "Edit",
        btn_delete: "Delete",
        confirm_delete: "Delete the record for {date}?",
        status_saved: "Saved the record for {date}",
        status_loaded: "Loaded the record for {date}",
        status_deleted: "Deleted the record for {date}",
        status_new: "Reset to new entry",
        status_exported: "Exported data.json. Keep this file in a private location.",
        status_imported: "{count} records imported (same-date records overwritten).",
        status_import_error: "Import failed: {msg}",
        status_sample: "Loaded dummy sample (2026-10-01 to 14, not real data).",
        validation_date: "Date format is invalid",
        validation_score: "{name} must be between 1 and 5",
        validation_sleep: "Sleep hours must be between 0 and 24",
        validation_weight: "Weight value is out of range",
        validation_hours: "Hours must be between 0 and 24",
        validation_error: "Input error: {msg}",
        score_condition: "Condition score",
        score_mental: "Mental score",
        score_stress: "Stress level",
        stat_days: " days",
        stat_h: " h",
        chart_weight_label: "Weight (kg)",
        chart_sleep_label: "Sleep (h)",
        chart_condition_label: "Condition score",
        chart_mental_label: "Mental score",
        chart_scatter_label: "Sleep (h) → Next-day condition",
        chart_scatter_x: "Sleep (h)",
        chart_scatter_y: "Next-day condition score",
        correlation_insufficient: "At least 3 paired data points of sleep and next-day condition are needed to calculate correlation (currently {n}). Correlation is read as a hypothesis, not a proof of causation.",
        correlation_result: "Sleep × next-day condition correlation r = {r} (n={n}). This is a hypothesis-level observation and does not establish causation.",
        daytype_th_type: "Day type",
        daytype_th_count: "Days",
        daytype_th_sleep: "Avg sleep",
        daytype_th_condition: "Avg condition",
        daytype_th_mental: "Avg mental",
    },
    ko: {
        site_title: "LifeLog",
        site_lead: "생활 지원 & 라이프 로깅. 기록 데이터는 이 브라우저(localStorage)에 저장되며, 프라이빗 동기화를 설정한 경우에만 본인의 비공개 저장소로 전송됩니다.",
        lang_label: "언어",
        tab_record: "기록",
        tab_analysis: "분석",
        slide_prev: "이전 섹션",
        slide_next: "다음 섹션",
        panel_record_title: "하루의 기록",
        fs_date: "날짜",
        label_date: "날짜 (필수)",
        fs_context: "생활 및 환경",
        label_day_type: "일정",
        opt_empty: "미입력",
        opt_school: "등교",
        opt_online: "온라인 수업",
        opt_work: "아르바이트 / 직장",
        opt_off: "휴일",
        label_start_time: "시작 시각",
        label_end_time: "종료 시각",
        label_hours: "시간 (h)",
        label_location: "활동 범위",
        opt_out: "외출",
        opt_home: "자택",
        opt_mixed: "외출 + 자택",
        label_weather: "날씨",
        opt_sunny: "맑음",
        opt_cloudy: "흐림",
        opt_rain: "비",
        opt_snow: "눈",
        label_context_note: "환경 메모",
        fs_health: "건강 관리",
        label_weight: "체중 (kg)",
        label_sleep: "수면 시간 (h)",
        label_bath: "입욕",
        opt_yes: "예",
        opt_no: "아니오",
        label_breakfast: "아침",
        label_lunch: "점심",
        label_dinner: "저녁",
        label_condition: "컨디션 점수 (1–5)",
        label_mental: "멘탈 점수 (1–5)",
        label_stress: "스트레스 수준 (1–5)",
        fs_care: "뷰티 및 셀프케어",
        label_face_wash: "세안",
        label_skincare: "스킨케어",
        label_teeth_morning: "양치 (아침)",
        label_teeth_night: "양치 (저녁)",
        label_water: "수분 섭취량 (ml)",
        label_caffeine: "카페인 (잔)",
        label_snack: "간식",
        opt_snack_yes: "예",
        opt_snack_no: "아니오",
        fs_activity: "운동 및 지출",
        label_exercise: "운동",
        opt_exercise_yes: "예",
        opt_exercise_no: "아니오",
        label_abs_video: "복근 운동 영상 (A–G)",
        opt_none: "없음",
        label_long_walk: "장거리 보행",
        label_spending: "대략적 지출 (원)",
        label_exercise_detail: "운동 상세 (자유 입력)",
        label_spending_tags: "지출 태그 (쉼표로 구분. 예: 식비, 교통, 생활용품)",
        fs_diary: "라이프 로그 일기",
        label_reflection: "하루 돌아보기",
        label_mood: "감정 메모",
        btn_save: "저장",
        btn_new: "새 입력",
        panel_list_title: "기록 목록",
        th_date: "날짜",
        th_day_type: "일정 유형",
        th_hours: "시간",
        th_weight: "체중",
        th_sleep: "수면",
        th_condition: "컨디션",
        th_mental: "멘탈",
        th_actions: "작업",
        record_empty: "아직 기록이 없습니다.",
        panel_data_title: "데이터 가져오기 / 내보내기",
        data_desc: "데이터는 data.json 스키마 v1 형식으로 내보내기/가져오기가 가능합니다. 실제 데이터 파일은 공개 저장소에 넣지 말고 비공개로 관리하십시오.",
        btn_export: "JSON 내보내기",
        btn_import: "JSON 가져오기",
        btn_sample: "더미 샘플 로드",
        panel_analysis_title: "분석",
        stat_count_label: "기록 일수",
        stat_coverage_label: "기록률 (기간 내)",
        stat_sleep_label: "평균 수면",
        stat_weight_label: "체중 변화 (처음 → 마지막)",
        chart_weight_title: "체중 추이",
        chart_sleep_title: "수면 시간 추이",
        chart_scores_title: "컨디션 및 멘탈 점수 추이",
        chart_scatter_title: "수면 × 다음 날 컨디션 점수",
        chart_daytype_title: "일정 유형별 요약",
        footer_text: "이 사이트는 기록 도구입니다. 의료적 진단을 제공하지 않습니다. 몸이 좋지 않은 상태가 계속되면 의료 전문가와 상담하십시오.",
        nav_context: "생활 및 환경",
        nav_health: "건강 관리",
        nav_care: "뷰티 및 셀프케어",
        nav_activity: "운동 및 지출",
        nav_diary: "라이프 로그 일기",
        nav_list: "기록 목록",
        nav_data: "데이터 입출력",
        nav_today: "오늘",
        today_advice_title: "Muse의 조언",
        today_advice_none: "아직 조언이 없습니다. 동기화를 설정하면 기록을 바탕으로 Muse가 조언을 작성합니다.",
        today_training_title: "오늘의 트레이닝",
        today_rest: "오늘은 통학일(화·목)이라 휴식일입니다. 가벼운 스트레칭만 하세요.",
        today_suggest: "오늘의 추천은 영상 {video}입니다.",
        today_suggest_back: "허리 불편감이 남아 있으니 무리하지 마세요. 통증이 있으면 쉬세요.",
        today_week_done: "이번 주 세션이 목표 4회에 도달했습니다. 오늘은 쉬거나 가볍게 해도 됩니다.",
        today_week_left: "이번 주 {count}/4회 (목표까지 {left}회)",
        today_stat_streak: "기록 연속 일수: {days}일",
        today_stat_weight: "체중: 최근 {latest} kg (이전 대비 {delta} kg)",
        today_stat_weight_none: "체중: 아직 기록이 없습니다",
        today_training_btn: "운동 기록으로",
        label_soreness: "근육통 (다음 날, 0-3)",
        label_circuit_sets: "서킷 세트 수",
        today_circuit_menu: "팔굽혀펴기 20회 / 크런치 20회 / 오른 펀치 20회 / 왼 펀치 20회 / 오른 킥 20회 / 왼 킥 20회 (1세트)",
        today_circuit_day: "오늘은 서킷 날입니다. 우선 1~2세트, 자세 우선으로.",
        label_backpain: "허리 불편감 (0-3)",
        sync_title: "프라이빗 동기화 (GitHub, 비공개 저장소)",
        sync_repo_label: "동기화 저장소 (owner/repo)",
        sync_token_label: "액세스 토큰",
        sync_save_btn: "설정 저장 후 동기화",
        sync_pull_btn: "클라우드에서 불러오기",
        sync_status_unset: "미설정: 토큰을 입력하면 자동 동기화됩니다",
        sync_status_set: "설정됨: 기록 변경 시 자동으로 동기화됩니다",
        sync_status_ok: "동기화 완료 ({time})",
        sync_status_fail: "동기화에 실패했습니다. 토큰과 저장소를 확인하세요",
        sync_note: "토큰은 이 브라우저에만 저장됩니다. 기록은 life-data.json으로 전송되고, 복근 사이트 기록(data.json)과 Muse의 조언(advice.json)은 같은 비공개 저장소에서 읽어옵니다.",
        sync_pull_confirm: "클라우드의 기록 {count}건을 불러와 이 기기의 데이터를 교체할까요?",
        daytype_school: "등교",
        daytype_online: "온라인",
        daytype_work: "직장",
        daytype_off: "휴일",
        daytype_empty: "미입력",
        btn_edit: "편집",
        btn_delete: "삭제",
        confirm_delete: "{date} 기록을 삭제하시겠습니까?",
        status_saved: "{date} 기록을 저장했습니다",
        status_loaded: "{date} 기록을 불러왔습니다",
        status_deleted: "{date} 기록을 삭제했습니다",
        status_new: "새 입력 상태로 돌아갔습니다",
        status_exported: "data.json을 내보냈습니다. 이 파일은 비공개로 관리하십시오.",
        status_imported: "{count}건을 가져왔습니다 (같은 날짜는 덮어쓰기).",
        status_import_error: "가져오기 실패: {msg}",
        status_sample: "더미 샘플 (2026-10-01~14, 실제 데이터 아님)을 로드했습니다.",
        validation_date: "날짜 형식이 올바르지 않습니다",
        validation_score: "{name}은(는) 1~5 사이여야 합니다",
        validation_sleep: "수면 시간은 0~24 사이여야 합니다",
        validation_weight: "체중 값이 범위를 벗어났습니다",
        validation_hours: "시간은 0~24 사이여야 합니다",
        validation_error: "입력 오류: {msg}",
        score_condition: "컨디션 점수",
        score_mental: "멘탈 점수",
        score_stress: "스트레스 수준",
        stat_days: "일",
        stat_h: " h",
        chart_weight_label: "체중 (kg)",
        chart_sleep_label: "수면 시간 (h)",
        chart_condition_label: "컨디션 점수",
        chart_mental_label: "멘탈 점수",
        chart_scatter_label: "수면(h) → 다음 날 컨디션",
        chart_scatter_x: "수면 시간 (h)",
        chart_scatter_y: "다음 날 컨디션 점수",
        correlation_insufficient: "상관관계를 계산하려면 수면과 다음 날 컨디션이 쌍을 이룰 데이터가 3건 이상 필요합니다 (현재 {n}건). 상관관계는 가설로 읽으며, 인과관계를 단정하지 않습니다.",
        correlation_result: "수면 × 다음 날 컨디션 상관계수 r = {r} (n={n}). 이것은 가설 수준의 관찰이며 인과관계를 단정하지 않습니다.",
        daytype_th_type: "일정 유형",
        daytype_th_count: "일수",
        daytype_th_sleep: "평균 수면",
        daytype_th_condition: "평균 컨디션",
        daytype_th_mental: "평균 멘탈",
    },
};
const LANG_KEY = "lifelog.lang.v1";
const SUPPORTED_LANGS = ["ja", "en", "ko"];
let currentLang = "ja";
function detectLang() {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && SUPPORTED_LANGS.includes(saved))
        return saved;
    const nav = navigator.language.slice(0, 2);
    if (SUPPORTED_LANGS.includes(nav))
        return nav;
    return "ja";
}
function t(key, params) {
    let text = i18n[currentLang][key] || i18n.ja[key] || key;
    if (params) {
        for (const [k, v] of Object.entries(params)) {
            text = text.replace("{" + k + "}", v);
        }
    }
    return text;
}
function applyI18n() {
    document.documentElement.lang = currentLang;
    const title = t("site_title");
    document.title = title + " | " + t("site_lead").split(/[。.]/)[0];
    document.querySelectorAll("[data-i18n]").forEach((elem) => {
        const key = elem.getAttribute("data-i18n");
        const text = t(key);
        if (elem.tagName === "OPTION") {
            elem.textContent = text;
        }
        else if (elem.tagName === "INPUT" ||
            elem.tagName === "TEXTAREA" ||
            elem.tagName === "SELECT") {
            // skip — labels handle text
        }
        else {
            elem.textContent = text;
        }
    });
    // update canvas aria-labels
    const canvasLabels = {
        "chart-weight": t("chart_weight_title"),
        "chart-sleep": t("chart_sleep_title"),
        "chart-scores": t("chart_scores_title"),
        "chart-scatter": t("chart_scatter_title"),
    };
    for (const [id, label] of Object.entries(canvasLabels)) {
        const c = document.getElementById(id);
        if (c)
            c.setAttribute("aria-label", label);
    }
}
// ---------- constants ----------
const STORAGE_KEY = "lifelog.records.v1";
let records = [];
let charts = {};
function dayTypeLabel(key) {
    const map = {
        school: "daytype_school",
        online: "daytype_online",
        work: "daytype_work",
        off: "daytype_off",
        "": "daytype_empty",
    };
    return t(map[key] || "daytype_empty");
}
// ---------- storage ----------
function loadRecords() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    }
    catch {
        return [];
    }
}
function saveRecords() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}
function sortedRecords() {
    return [...records].sort((a, b) => a.date.localeCompare(b.date));
}
// ---------- form helpers ----------
function el(id) {
    return document.getElementById(id);
}
function numVal(id) {
    const v = el(id).value.trim();
    if (v === "")
        return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}
function strVal(id) {
    const v = el(id).value.trim();
    return v === "" ? null : v;
}
function triVal(id) {
    const v = el(id).value;
    if (v === "true")
        return true;
    if (v === "false")
        return false;
    return null;
}
function setNum(id, v) {
    el(id).value = v === null || v === undefined ? "" : String(v);
}
function setStr(id, v) {
    el(id).value = v === null || v === undefined ? "" : v;
}
function setTri(id, v) {
    el(id).value =
        v === true ? "true" : v === false ? "false" : "";
}
function autoDayType(date) {
    const parts = date.split("-").map((x) => Number(x));
    if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n)))
        return "";
    const dow = new Date(parts[0], parts[1] - 1, parts[2]).getDay();
    if (dow === 2 || dow === 4)
        return "school";
    if (dow === 0 || dow === 6)
        return "work";
    return "online";
}
function emptyRecord(date) {
    return {
        date,
        context: {
            day_type: autoDayType(date),
            location: "",
            weather: "",
            note: "",
            start_time: null,
            end_time: null,
            hours: null,
        },
        health: {
            weight_kg: null,
            sleep_hours: null,
            bath: null,
            meals: { breakfast: null, lunch: null, dinner: null },
            condition_score: null,
            mental_score: null,
            stress_score: null,
        },
        care: {
            face_wash: null,
            skincare: null,
            teeth: { morning: null, night: null },
            water_ml: null,
            caffeine_cups: null,
            snack: null,
        },
        activity: {
            exercise: null,
            exercise_detail: "",
            abs_video: null,
            sets: null,
            soreness: null,
            back_pain: null,
            long_walk: null,
        },
        spending: { tags: [], rough_total_yen: null },
        diary: { reflection: "", mood_memo: "" },
        updated_at: new Date().toISOString(),
    };
}
function readForm() {
    const r = emptyRecord(el("f-date").value);
    r.context.day_type = el("f-day-type").value;
    r.context.start_time = strVal("f-start-time");
    r.context.end_time = strVal("f-end-time");
    r.context.hours = numVal("f-hours");
    r.context.location = el("f-location").value;
    r.context.weather = el("f-weather").value;
    r.context.note = el("f-context-note").value;
    r.health.weight_kg = numVal("f-weight");
    r.health.sleep_hours = numVal("f-sleep");
    r.health.bath = triVal("f-bath");
    r.health.meals.breakfast = triVal("f-meal-breakfast");
    r.health.meals.lunch = triVal("f-meal-lunch");
    r.health.meals.dinner = triVal("f-meal-dinner");
    r.health.condition_score = numVal("f-condition");
    r.health.mental_score = numVal("f-mental");
    r.health.stress_score = numVal("f-stress");
    r.care.face_wash = triVal("f-face-wash");
    r.care.skincare = triVal("f-skincare");
    r.care.teeth.morning = triVal("f-teeth-morning");
    r.care.teeth.night = triVal("f-teeth-night");
    r.care.water_ml = numVal("f-water");
    r.care.caffeine_cups = numVal("f-caffeine");
    r.care.snack = triVal("f-snack");
    r.activity.exercise = triVal("f-exercise");
    r.activity.exercise_detail = el("f-exercise-detail").value;
    const setsVal = el("f-circuit-sets").value;
    r.activity.sets = setsVal === "" ? null : Number(setsVal);
    const sor = el("f-soreness").value;
    r.activity.soreness = sor === "" ? null : Number(sor);
    const bpk = el("f-backpain").value;
    r.activity.back_pain = bpk === "" ? null : Number(bpk);
    r.activity.long_walk = triVal("f-long-walk");
    const tagsRaw = el("f-spending-tags").value;
    r.spending.tags = tagsRaw
        .split(/[,、]/)
        .map((s) => s.trim())
        .filter((s) => s !== "");
    r.spending.rough_total_yen = numVal("f-spending-total");
    r.diary.reflection = el("f-reflection").value;
    r.diary.mood_memo = el("f-mood").value;
    r.updated_at = new Date().toISOString();
    return r;
}
function fillForm(r) {
    el("f-date").value = r.date;
    el("f-day-type").value = r.context.day_type || "";
    setStr("f-start-time", r.context.start_time ?? null);
    setStr("f-end-time", r.context.end_time ?? null);
    setNum("f-hours", r.context.hours ?? null);
    el("f-location").value = r.context.location || "";
    el("f-weather").value = r.context.weather || "";
    el("f-context-note").value = r.context.note || "";
    setNum("f-weight", r.health.weight_kg);
    setNum("f-sleep", r.health.sleep_hours);
    setTri("f-bath", r.health.bath);
    setTri("f-meal-breakfast", r.health.meals.breakfast);
    setTri("f-meal-lunch", r.health.meals.lunch);
    setTri("f-meal-dinner", r.health.meals.dinner);
    setNum("f-condition", r.health.condition_score);
    setNum("f-mental", r.health.mental_score);
    setNum("f-stress", r.health.stress_score);
    setTri("f-face-wash", r.care.face_wash);
    setTri("f-skincare", r.care.skincare);
    setTri("f-teeth-morning", r.care.teeth.morning);
    setTri("f-teeth-night", r.care.teeth.night);
    setNum("f-water", r.care.water_ml);
    setNum("f-caffeine", r.care.caffeine_cups);
    setTri("f-snack", r.care.snack);
    setTri("f-exercise", r.activity.exercise);
    el("f-exercise-detail").value = r.activity.exercise_detail || "";
    el("f-circuit-sets").value =
        r.activity.sets === null || r.activity.sets === undefined
            ? ""
            : String(r.activity.sets);
    el("f-soreness").value =
        r.activity.soreness === null || r.activity.soreness === undefined
            ? ""
            : String(r.activity.soreness);
    el("f-backpain").value =
        r.activity.back_pain === null || r.activity.back_pain === undefined
            ? ""
            : String(r.activity.back_pain);
    setTri("f-long-walk", r.activity.long_walk);
    el("f-spending-tags").value = (r.spending.tags || []).join(", ");
    setNum("f-spending-total", r.spending.rough_total_yen);
    el("f-reflection").value = r.diary.reflection || "";
    el("f-mood").value = r.diary.mood_memo || "";
}
function resetForm() {
    const today = new Date();
    const iso = today.getFullYear() +
        "-" +
        String(today.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(today.getDate()).padStart(2, "0");
    fillForm(emptyRecord(iso));
}
// ---------- validation ----------
function validateRecord(r) {
    const errors = [];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(r.date))
        errors.push(t("validation_date"));
    const scoreFields = [
        [t("score_condition"), r.health.condition_score],
        [t("score_mental"), r.health.mental_score],
        [t("score_stress"), r.health.stress_score],
    ];
    for (const [name, v] of scoreFields) {
        if (v !== null && (v < 1 || v > 5))
            errors.push(t("validation_score", { name }));
    }
    if (r.health.sleep_hours !== null &&
        (r.health.sleep_hours < 0 || r.health.sleep_hours > 24))
        errors.push(t("validation_sleep"));
    if (r.health.weight_kg !== null &&
        (r.health.weight_kg <= 0 || r.health.weight_kg > 300))
        errors.push(t("validation_weight"));
    if (r.context.hours !== null &&
        (r.context.hours < 0 || r.context.hours > 24))
        errors.push(t("validation_hours"));
    return errors;
}
// ---------- list rendering ----------
function fmt(v, suffix) {
    return v === null || v === undefined ? "–" : String(v) + suffix;
}
function renderList() {
    const tbody = el("record-tbody");
    tbody.textContent = "";
    const list = sortedRecords().reverse();
    el("record-empty").hidden = list.length > 0;
    for (const r of list) {
        const tr = document.createElement("tr");
        const cells = [
            r.date,
            dayTypeLabel(r.context.day_type || ""),
            fmt(r.context.hours ?? null, " h"),
            fmt(r.health.weight_kg, " kg"),
            fmt(r.health.sleep_hours, " h"),
            fmt(r.health.condition_score, ""),
            fmt(r.health.mental_score, ""),
        ];
        for (const c of cells) {
            const td = document.createElement("td");
            td.textContent = c;
            tr.appendChild(td);
        }
        const ops = document.createElement("td");
        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.className = "button button--small";
        editBtn.textContent = t("btn_edit");
        editBtn.addEventListener("click", () => {
            fillForm(r);
            el("form-status").textContent = t("status_loaded", {
                date: r.date,
            });
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "button button--small button--danger";
        delBtn.textContent = t("btn_delete");
        delBtn.addEventListener("click", () => {
            if (!window.confirm(t("confirm_delete", { date: r.date })))
                return;
            records = records.filter((x) => x.date !== r.date);
            saveRecords();
            renderList();
            renderToday();
            trySyncPush();
            el("form-status").textContent = t("status_deleted", {
                date: r.date,
            });
        });
        ops.appendChild(editBtn);
        ops.appendChild(document.createTextNode(" "));
        ops.appendChild(delBtn);
        tr.appendChild(ops);
        tbody.appendChild(tr);
    }
}
// ---------- analysis ----------
function pearson(xs, ys) {
    if (xs.length < 3 || xs.length !== ys.length)
        return null;
    const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
    const my = ys.reduce((a, b) => a + b, 0) / ys.length;
    let num = 0;
    let dx = 0;
    let dy = 0;
    for (let i = 0; i < xs.length; i++) {
        num += (xs[i] - mx) * (ys[i] - my);
        dx += (xs[i] - mx) ** 2;
        dy += (ys[i] - my) ** 2;
    }
    if (dx === 0 || dy === 0)
        return null;
    return num / Math.sqrt(dx * dy);
}
// グラフの色は tokens.css の --chart-* を読み、ダークモードにも連動させる
function chartColors() {
    const cs = getComputedStyle(document.documentElement);
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return {
        c1: cs.getPropertyValue("--chart-1").trim() || "#5e6ad2",
        c2: cs.getPropertyValue("--chart-2").trim() || "#9aa3b2",
        grid: dark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)",
        tick: dark ? "#9aa3b2" : "#6f6e69",
    };
}
function makeChart(id, config) {
    if (typeof Chart === "undefined")
        return;
    if (charts[id])
        charts[id].destroy();
    const canvas = el(id);
    charts[id] = new Chart(canvas, config);
}
function renderAnalysis() {
    const list = sortedRecords();
    el("stat-count").textContent =
        String(list.length) + t("stat_days");
    if (list.length > 0) {
        const first = new Date(list[0].date + "T00:00:00");
        const last = new Date(list[list.length - 1].date + "T00:00:00");
        const days = Math.round((last.getTime() - first.getTime()) / 86400000) + 1;
        el("stat-coverage").textContent =
            days > 0 ? Math.round((list.length / days) * 100) + " %" : "–";
    }
    else {
        el("stat-coverage").textContent = "–";
    }
    const sleeps = list
        .map((r) => r.health.sleep_hours)
        .filter((v) => v !== null);
    el("stat-sleep").textContent =
        sleeps.length > 0
            ? (sleeps.reduce((a, b) => a + b, 0) / sleeps.length).toFixed(1) +
                t("stat_h")
            : "–";
    const weights = list.filter((r) => r.health.weight_kg !== null);
    if (weights.length >= 2) {
        const diff = weights[weights.length - 1].health.weight_kg -
            weights[0].health.weight_kg;
        el("stat-weight").textContent =
            (diff > 0 ? "+" : "") + diff.toFixed(2) + " kg";
    }
    else {
        el("stat-weight").textContent = "–";
    }
    const labels = list.map((r) => r.date);
    const cc = chartColors();
    const scaleBase = {
        grid: { color: cc.grid },
        ticks: { color: cc.tick },
        border: { display: false },
    };
    makeChart("chart-weight", {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: t("chart_weight_label"),
                    data: list.map((r) => r.health.weight_kg),
                    borderColor: cc.c1,
                    backgroundColor: cc.c1,
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 3,
                    spanGaps: true,
                },
            ],
        },
        options: {
            responsive: true,
            scales: { x: scaleBase, y: scaleBase },
        },
    });
    makeChart("chart-sleep", {
        type: "bar",
        data: {
            labels,
            datasets: [
                {
                    label: t("chart_sleep_label"),
                    data: list.map((r) => r.health.sleep_hours),
                    backgroundColor: cc.c1,
                },
            ],
        },
        options: {
            responsive: true,
            scales: { x: scaleBase, y: scaleBase },
        },
    });
    makeChart("chart-scores", {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: t("chart_condition_label"),
                    data: list.map((r) => r.health.condition_score),
                    borderColor: cc.c1,
                    backgroundColor: cc.c1,
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 3,
                    spanGaps: true,
                },
                {
                    label: t("chart_mental_label"),
                    data: list.map((r) => r.health.mental_score),
                    borderColor: cc.c2,
                    backgroundColor: cc.c2,
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 3,
                    spanGaps: true,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: scaleBase,
                y: { ...scaleBase, min: 0, max: 5 },
            },
        },
    });
    // 睡眠 × 翌日の体調
    const pts = [];
    for (let i = 0; i + 1 < list.length; i++) {
        const s = list[i].health.sleep_hours;
        const nextCond = list[i + 1].health.condition_score;
        if (s !== null && nextCond !== null)
            pts.push({ x: s, y: nextCond });
    }
    makeChart("chart-scatter", {
        type: "scatter",
        data: {
            datasets: [
                {
                    label: t("chart_scatter_label"),
                    data: pts,
                    backgroundColor: cc.c1,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    ...scaleBase,
                    title: { display: true, text: t("chart_scatter_x"), color: cc.tick },
                },
                y: {
                    ...scaleBase,
                    min: 0,
                    max: 5,
                    title: { display: true, text: t("chart_scatter_y"), color: cc.tick },
                },
            },
        },
    });
    const corr = pearson(pts.map((p) => p.x), pts.map((p) => p.y));
    el("correlation-note").textContent =
        corr === null
            ? t("correlation_insufficient", { n: String(pts.length) })
            : t("correlation_result", {
                r: corr.toFixed(2),
                n: String(pts.length),
            });
    // 日種別サマリー
    const wrap = el("daytype-summary");
    wrap.textContent = "";
    const groups = {};
    for (const r of list) {
        const k = r.context.day_type || "";
        if (!groups[k])
            groups[k] = [];
        groups[k].push(r);
    }
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headTr = document.createElement("tr");
    const headLabels = [
        t("daytype_th_type"),
        t("daytype_th_count"),
        t("daytype_th_sleep"),
        t("daytype_th_condition"),
        t("daytype_th_mental"),
    ];
    for (const label of headLabels) {
        const th = document.createElement("th");
        th.scope = "col";
        th.textContent = label;
        headTr.appendChild(th);
    }
    thead.appendChild(headTr);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    for (const k of Object.keys(groups)) {
        const g = groups[k];
        const avg = (vals) => {
            const nums = vals.filter((v) => v !== null);
            return nums.length
                ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1)
                : "–";
        };
        const tr = document.createElement("tr");
        const vals = [
            dayTypeLabel(k),
            String(g.length),
            avg(g.map((r) => r.health.sleep_hours)),
            avg(g.map((r) => r.health.condition_score)),
            avg(g.map((r) => r.health.mental_score)),
        ];
        for (const v of vals) {
            const td = document.createElement("td");
            td.textContent = v;
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    wrap.appendChild(table);
}
// ---------- slides ----------
const SLIDE_KEYS = [
    "today",
    "context",
    "health",
    "care",
    "activity",
    "diary",
    "list",
    "data",
    "analysis",
];
const SLIDE_NAME_KEYS = [
    "nav_today",
    "nav_context",
    "nav_health",
    "nav_care",
    "nav_activity",
    "nav_diary",
    "nav_list",
    "nav_data",
    "tab_analysis",
];
let currentSlide = 0;
function showSlide(index) {
    currentSlide = Math.max(0, Math.min(SLIDE_KEYS.length - 1, index));
    el("stage-track").style.transform =
        "translateX(-" + currentSlide * 100 + "%)";
    document
        .querySelectorAll(".slide")
        .forEach((s, i) => s.setAttribute("aria-hidden", String(i !== currentSlide)));
    document
        .querySelectorAll(".tree__item")
        .forEach((b) => b.classList.toggle("is-active", Number(b.dataset.slideIndex) === currentSlide));
    el("slide-name").textContent = t(SLIDE_NAME_KEYS[currentSlide]);
    el("slide-prev").disabled = currentSlide === 0;
    el("slide-next").disabled =
        currentSlide === SLIDE_KEYS.length - 1;
    el("slide-prev").setAttribute("aria-label", t("slide_prev"));
    el("slide-next").setAttribute("aria-label", t("slide_next"));
    el("action-form").hidden = currentSlide === 0 || currentSlide > 5;
    if (SLIDE_KEYS[currentSlide] === "analysis")
        renderAnalysis();
}
// ---------- private sync + today ----------
const SYNC_REPO_KEY = "lifelog.sync.repo";
const SYNC_TOKEN_KEY = "lifelog.sync.token";
const SYNC_DEFAULT_REPO = "mivork/abs-training-data";
const ABS_CACHE_KEY = "lifelog.absCache.v1";
const ADVICE_CACHE_KEY = "lifelog.adviceCache.v1";
const VIDEO_ORDER = ["A", "B", "C", "D", "E", "F", "G"];
function loadJsonCache(key) {
    try {
        const raw = localStorage.getItem(key);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    }
    catch {
        return [];
    }
}
let absSessionsCache = loadJsonCache(ABS_CACHE_KEY);
let adviceCache = loadJsonCache(ADVICE_CACHE_KEY);
let currentSuggestion = null;
function syncRepo() {
    return localStorage.getItem(SYNC_REPO_KEY) || SYNC_DEFAULT_REPO;
}
function syncToken() {
    return localStorage.getItem(SYNC_TOKEN_KEY) || "";
}
function setSyncStatus(msg) {
    const node = document.getElementById("life-sync-status");
    if (node)
        node.textContent = msg;
}
function refreshSyncStatus() {
    setSyncStatus(syncToken() ? t("sync_status_set") : t("sync_status_unset"));
}
function syncOkStatus() {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    setSyncStatus(t("sync_status_ok", { time: hh + ":" + mm }));
}
function ghHeaders() {
    return {
        Authorization: "Bearer " + syncToken(),
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    };
}
function ghUrl(file) {
    return "https://api.github.com/repos/" + syncRepo() + "/contents/" + file;
}
function b64encode(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = "";
    bytes.forEach((b) => {
        bin += String.fromCharCode(b);
    });
    return btoa(bin);
}
function b64decode(b64) {
    const bin = atob(b64.replace(/\s/g, ""));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++)
        bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
}
async function ghGetFile(file) {
    const res = await fetch(ghUrl(file), { headers: ghHeaders() });
    if (res.status === 404)
        return null;
    if (!res.ok)
        throw new Error("GET " + res.status);
    const j = await res.json();
    return { sha: j.sha, text: b64decode(j.content) };
}
async function ghPutFile(file, text, message, retry) {
    const cur = await ghGetFile(file).catch(() => null);
    const body = { message: message, content: b64encode(text) };
    if (cur)
        body.sha = cur.sha;
    const res = await fetch(ghUrl(file), {
        method: "PUT",
        headers: ghHeaders(),
        body: JSON.stringify(body),
    });
    if (res.status === 409 && !retry)
        return ghPutFile(file, text, message, true);
    if (!res.ok)
        throw new Error("PUT " + res.status);
}
function pushLifeData() {
    if (!syncToken()) {
        refreshSyncStatus();
        return;
    }
    const payload = { version: 1, records: sortedRecords() };
    ghPutFile("life-data.json", JSON.stringify(payload, null, 2), "Sync life log data", false)
        .then(() => syncOkStatus())
        .catch(() => setSyncStatus(t("sync_status_fail")));
}
function trySyncPush() {
    if (syncToken())
        pushLifeData();
}
async function pullLifeData() {
    if (!syncToken()) {
        refreshSyncStatus();
        return;
    }
    try {
        const f = await ghGetFile("life-data.json");
        if (!f) {
            setSyncStatus(t("sync_status_fail"));
            return;
        }
        const parsed = JSON.parse(f.text);
        if (parsed.version !== 1 || !Array.isArray(parsed.records))
            throw new Error("bad file");
        const incoming = [];
        for (const raw of parsed.records) {
            const rec = normalizeRecord(raw);
            if (rec)
                incoming.push(rec);
        }
        if (!window.confirm(t("sync_pull_confirm", { count: String(incoming.length) })))
            return;
        records = incoming;
        saveRecords();
        renderList();
        renderToday();
        syncOkStatus();
    }
    catch {
        setSyncStatus(t("sync_status_fail"));
    }
}
async function refreshCloudData() {
    if (!syncToken())
        return;
    try {
        const f = await ghGetFile("data.json");
        if (f) {
            const arr = JSON.parse(f.text);
            if (Array.isArray(arr)) {
                absSessionsCache = arr
                    .filter((e) => e &&
                    e.completed === true &&
                    typeof e.date === "string" &&
                    typeof e.sessionType === "string")
                    .map((e) => ({
                    date: e.date,
                    video: String(e.sessionType).replace("video", ""),
                }));
                localStorage.setItem(ABS_CACHE_KEY, JSON.stringify(absSessionsCache));
            }
        }
    }
    catch {
        // オフライン等ではキャッシュを使う
    }
    try {
        const f = await ghGetFile("advice.json");
        if (f) {
            const parsed = JSON.parse(f.text);
            const list = Array.isArray(parsed)
                ? parsed
                : parsed && parsed.text
                    ? [parsed]
                    : [];
            adviceCache = list.filter((a) => a && typeof a.date === "string" && typeof a.text === "string");
            localStorage.setItem(ADVICE_CACHE_KEY, JSON.stringify(adviceCache));
        }
    }
    catch {
        // キャッシュを使う
    }
    renderToday();
}
function fmtDate(d) {
    return (d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getDate()).padStart(2, "0"));
}
function isoToday() {
    return fmtDate(new Date());
}
function allSessions() {
    const map = new Map();
    for (const s of absSessionsCache)
        map.set(s.date + ":" + s.video, s);
    for (const r of records) {
        if (r.activity.sets !== null && r.activity.sets !== undefined && r.activity.sets >= 1) {
            map.set(r.date + ":CIRCUIT", { date: r.date, video: "CIRCUIT" });
        }
        else if (r.activity.abs_video && r.activity.exercise === true) {
            map.set(r.date + ":" + r.activity.abs_video, {
                date: r.date,
                video: r.activity.abs_video,
            });
        }
    }
    return [...map.values()].sort((a, b) => a.date.localeCompare(b.date));
}
function weekRange(dateStr) {
    const parts = dateStr.split("-").map((x) => Number(x));
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    const dow = (d.getDay() + 6) % 7;
    const start = new Date(d);
    start.setDate(d.getDate() - dow);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { start: fmtDate(start), end: fmtDate(end) };
}
function renderToday() {
    const dateLine = document.getElementById("today-date-line");
    if (!dateLine)
        return;
    const today = isoToday();
    const todaysRecord = records.find((r) => r.date === today);
    const typeKey = todaysRecord && todaysRecord.context.day_type
        ? todaysRecord.context.day_type
        : autoDayType(today);
    dateLine.textContent = today + " (" + dayTypeLabel(typeKey) + ")";
    const adviceDate = el("today-advice-date");
    const adviceText = el("today-advice-text");
    if (adviceCache.length > 0) {
        const sorted = [...adviceCache].sort((a, b) => a.date.localeCompare(b.date));
        const latest = sorted[sorted.length - 1];
        adviceDate.textContent = latest.date;
        adviceText.textContent = latest.text;
    }
    else {
        adviceDate.textContent = "";
        adviceText.textContent = t("today_advice_none");
    }
    const sessions = allSessions();
    const range = weekRange(today);
    const weekSessions = sessions.filter((s) => s.date >= range.start && s.date <= range.end);
    const weekCount = weekSessions.length;
    const hardCount = weekSessions.filter((s) => s.video === "F" || s.video === "G").length;
    el("today-week-line").textContent = t("today_week_left", {
        count: String(weekCount),
        left: String(Math.max(0, 4 - weekCount)),
    });
    const trainText = el("today-training-text");
    const trainBtn = el("today-training-btn");
    el("today-circuit-menu").textContent = t("today_circuit_menu");
    const dow = new Date().getDay();
    if (dow === 2 || dow === 4) {
        trainText.textContent = t("today_rest");
        trainBtn.hidden = true;
    }
    else if (weekCount >= 4) {
        trainText.textContent = t("today_week_done");
        trainBtn.hidden = false;
    }
    else {
        let msg = t("today_circuit_day");
        const recent = [...records]
            .filter((r) => r.date <= today)
            .sort((a, b) => a.date.localeCompare(b.date))
            .reverse()
            .find((r) => r.activity.back_pain !== null && r.activity.back_pain !== undefined);
        if (recent && recent.activity.back_pain !== null && recent.activity.back_pain >= 2)
            msg += " " + t("today_suggest_back");
        trainText.textContent = msg;
        trainBtn.hidden = false;
    }
    const dateSet = new Set();
    for (const r of records)
        dateSet.add(r.date);
    for (const s of sessions)
        dateSet.add(s.date);
    let streak = 0;
    const cursor = new Date();
    if (!dateSet.has(fmtDate(cursor)))
        cursor.setDate(cursor.getDate() - 1);
    while (dateSet.has(fmtDate(cursor))) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
    }
    el("today-stat-streak").textContent = t("today_stat_streak", {
        days: String(streak),
    });
    const weights = sortedRecords().filter((r) => r.health.weight_kg !== null);
    if (weights.length > 0) {
        const latest = weights[weights.length - 1];
        const prev = weights.length > 1 ? weights[weights.length - 2] : null;
        let delta = 0;
        if (prev &&
            latest.health.weight_kg !== null &&
            prev.health.weight_kg !== null)
            delta = latest.health.weight_kg - prev.health.weight_kg;
        el("today-stat-weight").textContent = t("today_stat_weight", {
            latest: String(latest.health.weight_kg),
            delta: (delta > 0 ? "+" : "") + delta.toFixed(1),
        });
    }
    else {
        el("today-stat-weight").textContent = t("today_stat_weight_none");
    }
}
function initSyncAndToday() {
    const repoInput = el("life-sync-repo");
    const tokenInput = el("life-sync-token");
    repoInput.value = syncRepo();
    tokenInput.value = syncToken();
    refreshSyncStatus();
    el("life-sync-save").addEventListener("click", () => {
        localStorage.setItem(SYNC_REPO_KEY, repoInput.value.trim() || SYNC_DEFAULT_REPO);
        localStorage.setItem(SYNC_TOKEN_KEY, tokenInput.value.trim());
        if (syncToken()) {
            pushLifeData();
            void refreshCloudData();
        }
        else {
            refreshSyncStatus();
        }
    });
    el("life-sync-pull").addEventListener("click", () => {
        void pullLifeData();
    });
    el("today-training-btn").addEventListener("click", () => {
        showSlide(SLIDE_KEYS.indexOf("activity"));
    });
    renderToday();
    if (syncToken())
        void refreshCloudData();
}
// ---------- import / export ----------
function exportJson() {
    const data = { version: 1, records: sortedRecords() };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
    el("data-status").textContent = t("status_exported");
}
function normalizeRecord(raw) {
    if (!raw || typeof raw.date !== "string")
        return null;
    const base = emptyRecord(raw.date);
    const merged = JSON.parse(JSON.stringify(base));
    const copySection = (name) => {
        if (raw[name] && typeof raw[name] === "object") {
            for (const k of Object.keys(base[name])) {
                if (raw[name][k] !== undefined)
                    merged[name][k] = raw[name][k];
            }
        }
    };
    copySection("context");
    copySection("health");
    copySection("care");
    copySection("activity");
    copySection("spending");
    copySection("diary");
    if (raw.health && raw.health.meals)
        merged.health.meals = { ...base.health.meals, ...raw.health.meals };
    if (raw.care && raw.care.teeth)
        merged.care.teeth = { ...base.care.teeth, ...raw.care.teeth };
    merged.updated_at =
        typeof raw.updated_at === "string" ? raw.updated_at : base.updated_at;
    return merged;
}
function importJson(file) {
    const reader = new FileReader();
    reader.onload = () => {
        try {
            const parsed = JSON.parse(String(reader.result));
            if (parsed.version !== 1 || !Array.isArray(parsed.records)) {
                throw new Error("version 1 の data.json ではありません");
            }
            const incoming = [];
            for (const raw of parsed.records) {
                const rec = normalizeRecord(raw);
                if (!rec)
                    throw new Error("日付のないレコードが含まれています");
                const errs = validateRecord(rec);
                if (errs.length)
                    throw new Error(rec.date + ": " + errs.join(" / "));
                incoming.push(rec);
            }
            const byDate = new Map();
            for (const r of records)
                byDate.set(r.date, r);
            for (const r of incoming)
                byDate.set(r.date, r);
            records = [...byDate.values()];
            saveRecords();
            renderList();
            renderToday();
            trySyncPush();
            el("data-status").textContent = t("status_imported", {
                count: String(incoming.length),
            });
        }
        catch (e) {
            el("data-status").textContent = t("status_import_error", {
                msg: e.message,
            });
        }
    };
    reader.readAsText(file);
}
// 明確にダミー値だけのサンプル（実データではない）
function loadSample() {
    const sample = [];
    const dayTypes = [
        "online",
        "school",
        "online",
        "school",
        "online",
        "work",
        "off",
    ];
    for (let i = 0; i < 14; i++) {
        const d = new Date(2026, 9, 1 + i); // 2026-10-01 からのダミー期間
        const iso = d.getFullYear() +
            "-" +
            String(d.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(d.getDate()).padStart(2, "0");
        const r = emptyRecord(iso);
        r.context.day_type = dayTypes[i % 7];
        r.context.location = r.context.day_type === "online" ? "home" : "out";
        r.context.weather = i % 3 === 0 ? "rain" : "sunny";
        r.context.start_time = r.context.day_type === "off" ? null : "09:00";
        r.context.end_time = r.context.day_type === "off" ? null : "17:00";
        r.context.hours = r.context.day_type === "off" ? null : 8;
        r.health.weight_kg = Math.round((60 - i * 0.1) * 100) / 100;
        r.health.sleep_hours = 5.5 + (i % 4) * 0.7;
        r.health.bath = i % 2 === 0;
        r.health.meals = {
            breakfast: true,
            lunch: true,
            dinner: i % 5 !== 4,
        };
        r.health.condition_score = 2 + (i % 4);
        r.health.mental_score = 2 + ((i + 1) % 4);
        r.health.stress_score = 1 + (i % 5);
        r.care.face_wash = true;
        r.care.skincare = i % 2 === 0;
        r.care.teeth = { morning: true, night: i % 3 !== 2 };
        r.care.water_ml = 1200 + (i % 5) * 200;
        r.care.caffeine_cups = i % 3;
        r.care.snack = i % 4 === 0;
        r.activity.exercise = i % 2 === 0;
        r.activity.exercise_detail = i % 2 === 0 ? "ダミー運動メモ" : "";
        r.activity.long_walk = i % 6 === 0;
        r.spending.tags = ["食費"];
        r.spending.rough_total_yen = 1000 + (i % 4) * 500;
        r.diary.reflection =
            "ダミーサンプル記録です（実データではありません）";
        r.diary.mood_memo = "ダミー";
        sample.push(r);
    }
    const byDate = new Map();
    for (const r of records)
        byDate.set(r.date, r);
    for (const r of sample)
        byDate.set(r.date, r);
    records = [...byDate.values()];
    saveRecords();
    renderList();
    el("data-status").textContent = t("status_sample");
}
// ---------- tree nav + slide controls ----------
function initSlides() {
    document
        .querySelectorAll(".tree__item")
        .forEach((b) => b.addEventListener("click", () => showSlide(Number(b.dataset.slideIndex))));
    const toggle = el("tree-record-toggle");
    const children = el("tree-record-children");
    toggle.addEventListener("click", () => {
        const expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!expanded));
        children.classList.toggle("is-collapsed", expanded);
    });
    el("slide-prev").addEventListener("click", () => showSlide(currentSlide - 1));
    el("slide-next").addEventListener("click", () => showSlide(currentSlide + 1));
}
// ---------- init ----------
function init() {
    currentLang = detectLang();
    el("lang-select").value = currentLang;
    applyI18n();
    el("lang-select").addEventListener("change", () => {
        currentLang = el("lang-select").value;
        localStorage.setItem(LANG_KEY, currentLang);
        applyI18n();
        renderList();
        renderToday();
        showSlide(currentSlide);
    });
    records = loadRecords();
    resetForm();
    renderList();
    initSlides();
    showSlide(0);
    initSyncAndToday();
    el("record-form").addEventListener("submit", (ev) => {
        ev.preventDefault();
        const r = readForm();
        const errs = validateRecord(r);
        if (errs.length) {
            el("form-status").textContent = t("validation_error", {
                msg: errs.join(" / "),
            });
            return;
        }
        const idx = records.findIndex((x) => x.date === r.date);
        if (idx >= 0) {
            r.activity.abs_video = records[idx].activity.abs_video;
            records[idx] = r;
        }
        else
            records.push(r);
        saveRecords();
        renderList();
        renderToday();
        trySyncPush();
        el("form-status").textContent = t("status_saved", {
            date: r.date,
        });
    });
    el("btn-new").addEventListener("click", () => {
        resetForm();
        el("form-status").textContent = t("status_new");
    });
    el("btn-export").addEventListener("click", exportJson);
    el("btn-sample").addEventListener("click", loadSample);
    el("file-import").addEventListener("change", (ev) => {
        const target = ev.target;
        if (target.files && target.files[0])
            importJson(target.files[0]);
        target.value = "";
    });
    // ダーク/ライト切替時に、表示中ならグラフの色を取り直す
    window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", () => {
        if (SLIDE_KEYS[currentSlide] === "analysis")
            renderAnalysis();
    });
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("sw.js").catch(() => {
            // オフライン対応は任意機能。失敗しても記録機能には影響しない
        });
    }
}
document.addEventListener("DOMContentLoaded", init);
