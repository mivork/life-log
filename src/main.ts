// ライフログ フロントエンド (TypeScript)
// データは localStorage キー `lifelog.records.v1` にのみ保存する。
// 外部送信は一切しない。入出力は data.json スキーマ v1 形式。

declare const Chart: any;

type TriState = boolean | null;
type DayType = "school" | "online" | "work" | "off" | "";
type LocationKind = "out" | "home" | "mixed" | "";
type WeatherKind = "sunny" | "cloudy" | "rain" | "snow" | "";
type Lang = "en" | "ja" | "ko";

interface LifeRecord {
  date: string;
  context: {
    day_type: DayType;
    location: LocationKind;
    weather: WeatherKind;
    note: string;
    start_time: string | null;
    end_time: string | null;
    hours: number | null;
  };
  health: {
    weight_kg: number | null;
    sleep_hours: number | null;
    bath: TriState;
    meals: { breakfast: TriState; lunch: TriState; dinner: TriState };
    condition_score: number | null;
    mental_score: number | null;
    stress_score: number | null;
  };
  care: {
    face_wash: TriState;
    skincare: TriState;
    teeth: { morning: TriState; night: TriState };
    water_ml: number | null;
    caffeine_cups: number | null;
    snack: TriState;
  };
  activity: {
    exercise: TriState;
    exercise_detail: string;
    abs_video: string | null;
    long_walk: TriState;
  };
  spending: {
    tags: string[];
    rough_total_yen: number | null;
  };
  diary: {
    reflection: string;
    mood_memo: string;
  };
  updated_at: string;
}

interface DataFile {
  version: 1;
  records: LifeRecord[];
}

// ---------- i18n ----------
type I18nDict = Record<string, string>;

const i18n: Record<Lang, I18nDict> = {
  ja: {
    site_title: "ライフログ",
    site_lead: "生活サポート＆ライフログ。記録データはこのブラウザの中（localStorage）だけに保存され、サーバーへは送信されません。",
    lang_label: "言語",
    tab_record: "記録",
    tab_analysis: "分析",
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
    site_lead: "Life Support & Life Logging. Your data is stored only in this browser (localStorage) and is never sent to any server.",
    lang_label: "Lang",
    tab_record: "Record",
    tab_analysis: "Analysis",
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
    site_lead: "생활 지원 & 라이프 로깅. 기록 데이터는 이 브라우저(localStorage)에만 저장되며 서버로는 전송되지 않습니다.",
    lang_label: "언어",
    tab_record: "기록",
    tab_analysis: "분석",
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
const SUPPORTED_LANGS: Lang[] = ["ja", "en", "ko"];
let currentLang: Lang = "ja";

function detectLang(): Lang {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved && SUPPORTED_LANGS.includes(saved as Lang)) return saved as Lang;
  const nav = navigator.language.slice(0, 2);
  if (SUPPORTED_LANGS.includes(nav as Lang)) return nav as Lang;
  return "ja";
}

function t(key: string, params?: Record<string, string>): string {
  let text = i18n[currentLang][key] || i18n.ja[key] || key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace("{" + k + "}", v);
    }
  }
  return text;
}

function applyI18n(): void {
  document.documentElement.lang = currentLang;
  const title = t("site_title");
  document.title = title + " | " + t("site_lead").split(/[。.]/)[0];

  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((elem) => {
    const key = elem.getAttribute("data-i18n")!;
    const text = t(key);
    if (elem.tagName === "OPTION") {
      (elem as HTMLOptionElement).textContent = text;
    } else if (
      elem.tagName === "INPUT" ||
      elem.tagName === "TEXTAREA" ||
      elem.tagName === "SELECT"
    ) {
      // skip — labels handle text
    } else {
      elem.textContent = text;
    }
  });

  // update canvas aria-labels
  const canvasLabels: Record<string, string> = {
    "chart-weight": t("chart_weight_title"),
    "chart-sleep": t("chart_sleep_title"),
    "chart-scores": t("chart_scores_title"),
    "chart-scatter": t("chart_scatter_title"),
  };
  for (const [id, label] of Object.entries(canvasLabels)) {
    const c = document.getElementById(id);
    if (c) c.setAttribute("aria-label", label);
  }
}

// ---------- constants ----------
const STORAGE_KEY = "lifelog.records.v1";

let records: LifeRecord[] = [];
let charts: Record<string, any> = {};

function dayTypeLabel(key: string): string {
  const map: Record<string, string> = {
    school: "daytype_school",
    online: "daytype_online",
    work: "daytype_work",
    off: "daytype_off",
    "": "daytype_empty",
  };
  return t(map[key] || "daytype_empty");
}

// ---------- storage ----------
function loadRecords(): LifeRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LifeRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRecords(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function sortedRecords(): LifeRecord[] {
  return [...records].sort((a, b) => a.date.localeCompare(b.date));
}

// ---------- form helpers ----------
function el<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}

function numVal(id: string): number | null {
  const v = el<HTMLInputElement>(id).value.trim();
  if (v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function strVal(id: string): string | null {
  const v = el<HTMLInputElement>(id).value.trim();
  return v === "" ? null : v;
}

function triVal(id: string): TriState {
  const v = el<HTMLSelectElement>(id).value;
  if (v === "true") return true;
  if (v === "false") return false;
  return null;
}

function setNum(id: string, v: number | null): void {
  el<HTMLInputElement>(id).value = v === null || v === undefined ? "" : String(v);
}

function setStr(id: string, v: string | null): void {
  el<HTMLInputElement>(id).value = v === null || v === undefined ? "" : v;
}

function setTri(id: string, v: TriState): void {
  el<HTMLSelectElement>(id).value =
    v === true ? "true" : v === false ? "false" : "";
}

function emptyRecord(date: string): LifeRecord {
  return {
    date,
    context: {
      day_type: "",
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
      long_walk: null,
    },
    spending: { tags: [], rough_total_yen: null },
    diary: { reflection: "", mood_memo: "" },
    updated_at: new Date().toISOString(),
  };
}

function readForm(): LifeRecord {
  const r = emptyRecord(el<HTMLInputElement>("f-date").value);
  r.context.day_type = el<HTMLSelectElement>("f-day-type").value as DayType;
  r.context.start_time = strVal("f-start-time");
  r.context.end_time = strVal("f-end-time");
  r.context.hours = numVal("f-hours");
  r.context.location = el<HTMLSelectElement>("f-location").value as LocationKind;
  r.context.weather = el<HTMLSelectElement>("f-weather").value as WeatherKind;
  r.context.note = el<HTMLInputElement>("f-context-note").value;

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
  r.activity.exercise_detail = el<HTMLInputElement>("f-exercise-detail").value;
  const abs = el<HTMLSelectElement>("f-abs-video").value;
  r.activity.abs_video = abs === "" ? null : abs;
  r.activity.long_walk = triVal("f-long-walk");

  const tagsRaw = el<HTMLInputElement>("f-spending-tags").value;
  r.spending.tags = tagsRaw
    .split(/[,、]/)
    .map((s) => s.trim())
    .filter((s) => s !== "");
  r.spending.rough_total_yen = numVal("f-spending-total");

  r.diary.reflection = el<HTMLTextAreaElement>("f-reflection").value;
  r.diary.mood_memo = el<HTMLTextAreaElement>("f-mood").value;
  r.updated_at = new Date().toISOString();
  return r;
}

function fillForm(r: LifeRecord): void {
  el<HTMLInputElement>("f-date").value = r.date;
  el<HTMLSelectElement>("f-day-type").value = r.context.day_type || "";
  setStr("f-start-time", r.context.start_time ?? null);
  setStr("f-end-time", r.context.end_time ?? null);
  setNum("f-hours", r.context.hours ?? null);
  el<HTMLSelectElement>("f-location").value = r.context.location || "";
  el<HTMLSelectElement>("f-weather").value = r.context.weather || "";
  el<HTMLInputElement>("f-context-note").value = r.context.note || "";

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
  el<HTMLInputElement>("f-exercise-detail").value = r.activity.exercise_detail || "";
  el<HTMLSelectElement>("f-abs-video").value = r.activity.abs_video || "";
  setTri("f-long-walk", r.activity.long_walk);

  el<HTMLInputElement>("f-spending-tags").value = (r.spending.tags || []).join(", ");
  setNum("f-spending-total", r.spending.rough_total_yen);

  el<HTMLTextAreaElement>("f-reflection").value = r.diary.reflection || "";
  el<HTMLTextAreaElement>("f-mood").value = r.diary.mood_memo || "";
}

function resetForm(): void {
  const today = new Date();
  const iso =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");
  fillForm(emptyRecord(iso));
}

// ---------- validation ----------
function validateRecord(r: LifeRecord): string[] {
  const errors: string[] = [];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(r.date)) errors.push(t("validation_date"));
  const scoreFields: Array<[string, number | null]> = [
    [t("score_condition"), r.health.condition_score],
    [t("score_mental"), r.health.mental_score],
    [t("score_stress"), r.health.stress_score],
  ];
  for (const [name, v] of scoreFields) {
    if (v !== null && (v < 1 || v > 5))
      errors.push(t("validation_score", { name }));
  }
  if (
    r.health.sleep_hours !== null &&
    (r.health.sleep_hours < 0 || r.health.sleep_hours > 24)
  )
    errors.push(t("validation_sleep"));
  if (
    r.health.weight_kg !== null &&
    (r.health.weight_kg <= 0 || r.health.weight_kg > 300)
  )
    errors.push(t("validation_weight"));
  if (
    r.context.hours !== null &&
    (r.context.hours < 0 || r.context.hours > 24)
  )
    errors.push(t("validation_hours"));
  return errors;
}

// ---------- list rendering ----------
function fmt(v: number | null, suffix: string): string {
  return v === null || v === undefined ? "–" : String(v) + suffix;
}

function renderList(): void {
  const tbody = el<HTMLTableSectionElement>("record-tbody");
  tbody.textContent = "";
  const list = sortedRecords().reverse();
  el<HTMLElement>("record-empty").hidden = list.length > 0;
  for (const r of list) {
    const tr = document.createElement("tr");
    const cells: string[] = [
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
      el<HTMLElement>("form-status").textContent = t("status_loaded", {
        date: r.date,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "button button--small button--danger";
    delBtn.textContent = t("btn_delete");
    delBtn.addEventListener("click", () => {
      if (!window.confirm(t("confirm_delete", { date: r.date }))) return;
      records = records.filter((x) => x.date !== r.date);
      saveRecords();
      renderList();
      el<HTMLElement>("form-status").textContent = t("status_deleted", {
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
function pearson(xs: number[], ys: number[]): number | null {
  if (xs.length < 3 || xs.length !== ys.length) return null;
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
  if (dx === 0 || dy === 0) return null;
  return num / Math.sqrt(dx * dy);
}

// グラフの色は tokens.css の --chart-* を読み、ダークモードにも連動させる
function chartColors(): { c1: string; c2: string; grid: string; tick: string } {
  const cs = getComputedStyle(document.documentElement);
  const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return {
    c1: cs.getPropertyValue("--chart-1").trim() || "#5e6ad2",
    c2: cs.getPropertyValue("--chart-2").trim() || "#9aa3b2",
    grid: dark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)",
    tick: dark ? "#9aa3b2" : "#6f6e69",
  };
}

function makeChart(id: string, config: any): void {
  if (typeof Chart === "undefined") return;
  if (charts[id]) charts[id].destroy();
  const canvas = el<HTMLCanvasElement>(id);
  charts[id] = new Chart(canvas, config);
}

function renderAnalysis(): void {
  const list = sortedRecords();
  el<HTMLElement>("stat-count").textContent =
    String(list.length) + t("stat_days");

  if (list.length > 0) {
    const first = new Date(list[0].date + "T00:00:00");
    const last = new Date(list[list.length - 1].date + "T00:00:00");
    const days =
      Math.round((last.getTime() - first.getTime()) / 86400000) + 1;
    el<HTMLElement>("stat-coverage").textContent =
      days > 0 ? Math.round((list.length / days) * 100) + " %" : "–";
  } else {
    el<HTMLElement>("stat-coverage").textContent = "–";
  }

  const sleeps = list
    .map((r) => r.health.sleep_hours)
    .filter((v): v is number => v !== null);
  el<HTMLElement>("stat-sleep").textContent =
    sleeps.length > 0
      ? (sleeps.reduce((a, b) => a + b, 0) / sleeps.length).toFixed(1) +
        t("stat_h")
      : "–";

  const weights = list.filter((r) => r.health.weight_kg !== null);
  if (weights.length >= 2) {
    const diff =
      (weights[weights.length - 1].health.weight_kg as number) -
      (weights[0].health.weight_kg as number);
    el<HTMLElement>("stat-weight").textContent =
      (diff > 0 ? "+" : "") + diff.toFixed(2) + " kg";
  } else {
    el<HTMLElement>("stat-weight").textContent = "–";
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
  const pts: Array<{ x: number; y: number }> = [];
  for (let i = 0; i + 1 < list.length; i++) {
    const s = list[i].health.sleep_hours;
    const nextCond = list[i + 1].health.condition_score;
    if (s !== null && nextCond !== null) pts.push({ x: s, y: nextCond });
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
  const corr = pearson(
    pts.map((p) => p.x),
    pts.map((p) => p.y)
  );
  el<HTMLElement>("correlation-note").textContent =
    corr === null
      ? t("correlation_insufficient", { n: String(pts.length) })
      : t("correlation_result", {
          r: corr.toFixed(2),
          n: String(pts.length),
        });

  // 日種別サマリー
  const wrap = el<HTMLElement>("daytype-summary");
  wrap.textContent = "";
  const groups: Record<string, LifeRecord[]> = {};
  for (const r of list) {
    const k = r.context.day_type || "";
    if (!groups[k]) groups[k] = [];
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
    const avg = (vals: Array<number | null>): string => {
      const nums = vals.filter((v): v is number => v !== null);
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

// ---------- tabs ----------
function switchTab(which: "record" | "analysis"): void {
  const isRecord = which === "record";
  el<HTMLElement>("panel-record").hidden = !isRecord;
  el<HTMLElement>("panel-analysis").hidden = isRecord;
  if (!isRecord) renderAnalysis();
}

// ---------- import / export ----------
function exportJson(): void {
  const data: DataFile = { version: 1, records: sortedRecords() };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "data.json";
  a.click();
  URL.revokeObjectURL(url);
  el<HTMLElement>("data-status").textContent = t("status_exported");
}

function normalizeRecord(raw: any): LifeRecord | null {
  if (!raw || typeof raw.date !== "string") return null;
  const base = emptyRecord(raw.date);
  const merged: any = JSON.parse(JSON.stringify(base));
  const copySection = (name: string) => {
    if (raw[name] && typeof raw[name] === "object") {
      for (const k of Object.keys(
        base[name as keyof LifeRecord] as object
      )) {
        if (raw[name][k] !== undefined) merged[name][k] = raw[name][k];
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
  return merged as LifeRecord;
}

function importJson(file: File): void {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result)) as DataFile;
      if (parsed.version !== 1 || !Array.isArray(parsed.records)) {
        throw new Error("version 1 の data.json ではありません");
      }
      const incoming: LifeRecord[] = [];
      for (const raw of parsed.records) {
        const rec = normalizeRecord(raw);
        if (!rec)
          throw new Error("日付のないレコードが含まれています");
        const errs = validateRecord(rec);
        if (errs.length)
          throw new Error(rec.date + ": " + errs.join(" / "));
        incoming.push(rec);
      }
      const byDate = new Map<string, LifeRecord>();
      for (const r of records) byDate.set(r.date, r);
      for (const r of incoming) byDate.set(r.date, r);
      records = [...byDate.values()];
      saveRecords();
      renderList();
      el<HTMLElement>("data-status").textContent = t("status_imported", {
        count: String(incoming.length),
      });
    } catch (e) {
      el<HTMLElement>("data-status").textContent = t("status_import_error", {
        msg: (e as Error).message,
      });
    }
  };
  reader.readAsText(file);
}

// 明確にダミー値だけのサンプル（実データではない）
function loadSample(): void {
  const sample: LifeRecord[] = [];
  const dayTypes: DayType[] = [
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
    const iso =
      d.getFullYear() +
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
  const byDate = new Map<string, LifeRecord>();
  for (const r of records) byDate.set(r.date, r);
  for (const r of sample) byDate.set(r.date, r);
  records = [...byDate.values()];
  saveRecords();
  renderList();
  el<HTMLElement>("data-status").textContent = t("status_sample");
}

// ---------- side nav ----------
function initSideNav(): void {
  const navAnalysis = document.getElementById("nav-analysis");
  if (navAnalysis) {
    navAnalysis.addEventListener("click", (ev) => {
      ev.preventDefault();
      switchTab("analysis");
      el<HTMLElement>("panel-analysis").scrollIntoView({ behavior: "smooth" });
    });
  }

  // Record-tab section links: ensure record tab is active, then scroll
  const sideNav = document.getElementById("side-nav");
  if (sideNav) {
    sideNav.querySelectorAll<HTMLAnchorElement>("a.side-nav__link").forEach(
      (link) => {
        if (link.id === "nav-analysis") return;
        link.addEventListener("click", (ev) => {
          ev.preventDefault();
          switchTab("record");
          const target = document.querySelector(
            link.getAttribute("href") || ""
          );
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
        });
      }
    );
  }
}

// ---------- init ----------
function init(): void {
  currentLang = detectLang();
  el<HTMLSelectElement>("lang-select").value = currentLang;
  applyI18n();

  el<HTMLSelectElement>("lang-select").addEventListener("change", () => {
    currentLang = el<HTMLSelectElement>("lang-select").value as Lang;
    localStorage.setItem(LANG_KEY, currentLang);
    applyI18n();
    renderList();
    if (!el<HTMLElement>("panel-analysis").hidden) renderAnalysis();
  });

  records = loadRecords();
  resetForm();
  renderList();
  initSideNav();

  el<HTMLFormElement>("record-form").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const r = readForm();
    const errs = validateRecord(r);
    if (errs.length) {
      el<HTMLElement>("form-status").textContent = t("validation_error", {
        msg: errs.join(" / "),
      });
      return;
    }
    const idx = records.findIndex((x) => x.date === r.date);
    if (idx >= 0) records[idx] = r;
    else records.push(r);
    saveRecords();
    renderList();
    el<HTMLElement>("form-status").textContent = t("status_saved", {
      date: r.date,
    });
  });

  el<HTMLElement>("btn-new").addEventListener("click", () => {
    resetForm();
    el<HTMLElement>("form-status").textContent = t("status_new");
  });
  el<HTMLElement>("btn-export").addEventListener("click", exportJson);
  el<HTMLElement>("btn-sample").addEventListener("click", loadSample);
  el<HTMLInputElement>("file-import").addEventListener("change", (ev) => {
    const target = ev.target as HTMLInputElement;
    if (target.files && target.files[0]) importJson(target.files[0]);
    target.value = "";
  });

  // ダーク/ライト切替時に、表示中ならグラフの色を取り直す
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (!el<HTMLElement>("panel-analysis").hidden) renderAnalysis();
    });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {
      // オフライン対応は任意機能。失敗しても記録機能には影響しない
    });
  }
}

document.addEventListener("DOMContentLoaded", init);
