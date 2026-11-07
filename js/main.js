"use strict";
// ライフログ フロントエンド (TypeScript)
// データは localStorage キー `lifelog.records.v1` にのみ保存する。
// 外部送信は一切しない。入出力は data.json スキーマ v1 形式。
const STORAGE_KEY = "lifelog.records.v1";
const DAY_TYPE_LABELS = {
    school: "学校",
    online: "オンライン",
    work: "バイト・仕事",
    off: "休日",
    "": "未入力",
};
let records = [];
let charts = {};
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
function setTri(id, v) {
    el(id).value =
        v === true ? "true" : v === false ? "false" : "";
}
function emptyRecord(date) {
    return {
        date,
        context: { day_type: "", location: "", weather: "", note: "" },
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
function readForm() {
    const r = emptyRecord(el("f-date").value);
    r.context.day_type = el("f-day-type").value;
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
    const abs = el("f-abs-video").value;
    r.activity.abs_video = abs === "" ? null : abs;
    r.activity.long_walk = triVal("f-long-walk");
    const tagsRaw = el("f-spending-tags").value;
    r.spending.tags = tagsRaw
        .split(/[,、]/)
        .map((t) => t.trim())
        .filter((t) => t !== "");
    r.spending.rough_total_yen = numVal("f-spending-total");
    r.diary.reflection = el("f-reflection").value;
    r.diary.mood_memo = el("f-mood").value;
    r.updated_at = new Date().toISOString();
    return r;
}
function fillForm(r) {
    el("f-date").value = r.date;
    el("f-day-type").value = r.context.day_type || "";
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
    el("f-abs-video").value = r.activity.abs_video || "";
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
        errors.push("日付の形式が正しくありません");
    const scoreFields = [
        ["体調スコア", r.health.condition_score],
        ["メンタルスコア", r.health.mental_score],
        ["ストレス度", r.health.stress_score],
    ];
    for (const [name, v] of scoreFields) {
        if (v !== null && (v < 1 || v > 5))
            errors.push(name + "は1〜5で入力してください");
    }
    if (r.health.sleep_hours !== null && (r.health.sleep_hours < 0 || r.health.sleep_hours > 24))
        errors.push("睡眠時間は0〜24で入力してください");
    if (r.health.weight_kg !== null && (r.health.weight_kg <= 0 || r.health.weight_kg > 300))
        errors.push("体重の値が範囲外です");
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
            DAY_TYPE_LABELS[r.context.day_type || ""] || "未入力",
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
        editBtn.textContent = "編集";
        editBtn.addEventListener("click", () => {
            fillForm(r);
            el("form-status").textContent = r.date + " の記録を読み込みました";
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "button button--small button--danger";
        delBtn.textContent = "削除";
        delBtn.addEventListener("click", () => {
            if (!window.confirm(r.date + " の記録を削除しますか？"))
                return;
            records = records.filter((x) => x.date !== r.date);
            saveRecords();
            renderList();
            el("form-status").textContent = r.date + " の記録を削除しました";
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
    el("stat-count").textContent = String(list.length) + " 日";
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
            ? (sleeps.reduce((a, b) => a + b, 0) / sleeps.length).toFixed(1) + " h"
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
    makeChart("chart-weight", {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: "体重 (kg)",
                    data: list.map((r) => r.health.weight_kg),
                    borderColor: "#084c8d",
                    backgroundColor: "#084c8d",
                    spanGaps: true,
                },
            ],
        },
        options: { responsive: true },
    });
    makeChart("chart-sleep", {
        type: "bar",
        data: {
            labels,
            datasets: [
                {
                    label: "睡眠時間 (h)",
                    data: list.map((r) => r.health.sleep_hours),
                    backgroundColor: "#0b6e4f",
                },
            ],
        },
        options: { responsive: true },
    });
    makeChart("chart-scores", {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: "体調スコア",
                    data: list.map((r) => r.health.condition_score),
                    borderColor: "#084c8d",
                    backgroundColor: "#084c8d",
                    spanGaps: true,
                },
                {
                    label: "メンタルスコア",
                    data: list.map((r) => r.health.mental_score),
                    borderColor: "#8a5a00",
                    backgroundColor: "#8a5a00",
                    spanGaps: true,
                },
            ],
        },
        options: { responsive: true, scales: { y: { min: 0, max: 5 } } },
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
                { label: "睡眠(h) → 翌日の体調", data: pts, backgroundColor: "#084c8d" },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: "睡眠時間 (h)" } },
                y: { min: 0, max: 5, title: { display: true, text: "翌日の体調スコア" } },
            },
        },
    });
    const corr = pearson(pts.map((p) => p.x), pts.map((p) => p.y));
    el("correlation-note").textContent =
        corr === null
            ? "相関を出すには、睡眠と翌日の体調がそろったデータが3件以上必要です（現在 " +
                pts.length +
                " 件）。相関は仮説として読み、因果は断定しません。"
            : "睡眠×翌日体調の相関係数 r = " +
                corr.toFixed(2) +
                "（n=" +
                pts.length +
                "）。これは仮説レベルの観察で、因果関係を断定するものではありません。";
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
    thead.innerHTML =
        "<tr><th scope='col'>日種別</th><th scope='col'>日数</th><th scope='col'>平均睡眠</th><th scope='col'>平均体調</th><th scope='col'>平均メンタル</th></tr>";
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
            DAY_TYPE_LABELS[k] || "未入力",
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
function switchTab(which) {
    const isRecord = which === "record";
    el("tab-record").setAttribute("aria-selected", String(isRecord));
    el("tab-analysis").setAttribute("aria-selected", String(!isRecord));
    el("panel-record").hidden = !isRecord;
    el("panel-analysis").hidden = isRecord;
    if (!isRecord)
        renderAnalysis();
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
    el("data-status").textContent =
        "data.json を書き出しました。このファイルはプライベートな場所で管理してください。";
}
function normalizeRecord(raw) {
    if (!raw || typeof raw.date !== "string")
        return null;
    const base = emptyRecord(raw.date);
    // 欠けたフィールドはデフォルトで補い、既知フィールドだけを取り込む
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
    merged.updated_at = typeof raw.updated_at === "string" ? raw.updated_at : base.updated_at;
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
            el("data-status").textContent =
                incoming.length + " 件を読み込みました（同日付は上書き）。";
        }
        catch (e) {
            el("data-status").textContent =
                "読み込みに失敗しました: " + e.message;
        }
    };
    reader.readAsText(file);
}
// 明確にダミー値だけのサンプル（実データではない）
function loadSample() {
    const sample = [];
    const dayTypes = ["online", "school", "online", "school", "online", "work", "off"];
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
        r.health.weight_kg = Math.round((60 - i * 0.1) * 100) / 100;
        r.health.sleep_hours = 5.5 + (i % 4) * 0.7;
        r.health.bath = i % 2 === 0;
        r.health.meals = { breakfast: true, lunch: true, dinner: i % 5 !== 4 };
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
        r.diary.reflection = "ダミーサンプル記録です（実データではありません）";
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
    el("data-status").textContent =
        "ダミーサンプル（2026-10-01〜14、実データではありません）を読み込みました。";
}
// ---------- init ----------
function init() {
    records = loadRecords();
    resetForm();
    renderList();
    el("record-form").addEventListener("submit", (ev) => {
        ev.preventDefault();
        const r = readForm();
        const errs = validateRecord(r);
        if (errs.length) {
            el("form-status").textContent = "入力エラー: " + errs.join(" / ");
            return;
        }
        const idx = records.findIndex((x) => x.date === r.date);
        if (idx >= 0)
            records[idx] = r;
        else
            records.push(r);
        saveRecords();
        renderList();
        el("form-status").textContent = r.date + " の記録を保存しました";
    });
    el("btn-new").addEventListener("click", () => {
        resetForm();
        el("form-status").textContent = "新規入力の状態に戻しました";
    });
    el("tab-record").addEventListener("click", () => switchTab("record"));
    el("tab-analysis").addEventListener("click", () => switchTab("analysis"));
    el("btn-export").addEventListener("click", exportJson);
    el("btn-sample").addEventListener("click", loadSample);
    el("file-import").addEventListener("change", (ev) => {
        const target = ev.target;
        if (target.files && target.files[0])
            importJson(target.files[0]);
        target.value = "";
    });
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("sw.js").catch(() => {
            // オフライン対応は任意機能。失敗しても記録機能には影響しない
        });
    }
}
document.addEventListener("DOMContentLoaded", init);
