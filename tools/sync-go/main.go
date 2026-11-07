// lifelogsync: ライフログ data.json の検証とプライベートリポジトリへの同期 CLI (Phase 3)
//
// 役割:
//  1. data.json がスキーマ v1 に適合するかを検証する（ネットワーク送信なし）
//  2. 検証を通った data.json を指定リポジトリへコピーし、git add / commit する
//  3. --push を付けた場合のみ git push する
//
// 安全デフォルト:
//   - デフォルトは dry-run（実際のコピー/コミット/push は行わず、実行内容を表示する）
//   - 実際に書き込むには --apply が必要。push にはさらに --push が必要
//   - トークン類はこのツールに埋め込まない。push の認証は利用者の git 設定に委ねる
//
// 使い方:
//
//	go run . --data ./data.json --repo /path/to/private-repo
//	go run . --data ./data.json --repo /path/to/private-repo --apply
//	go run . --data ./data.json --repo /path/to/private-repo --apply --push
//
// 設定は環境変数でも指定できる: LIFELOG_DATA, LIFELOG_REPO
package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"time"
)

// ---- スキーマ v1 の最小構造（検証に必要な部分のみ） ----

type DataFile struct {
	Version int      `json:"version"`
	Records []Record `json:"records"`
}

type Record struct {
	Date    string `json:"date"`
	Context struct {
		DayType  string `json:"day_type"`
		Location string `json:"location"`
		Weather  string `json:"weather"`
	} `json:"context"`
	Health struct {
		WeightKg       *float64 `json:"weight_kg"`
		SleepHours     *float64 `json:"sleep_hours"`
		ConditionScore *int     `json:"condition_score"`
		MentalScore    *int     `json:"mental_score"`
		StressScore    *int     `json:"stress_score"`
	} `json:"health"`
}

var (
	dayTypes  = map[string]bool{"": true, "school": true, "online": true, "work": true, "off": true}
	locations = map[string]bool{"": true, "out": true, "home": true, "mixed": true}
	weathers  = map[string]bool{"": true, "sunny": true, "cloudy": true, "rain": true, "snow": true}
)

// validate は data.json 全体の検証を行い、問題があればエラーを返す。
func validate(data []byte) (*DataFile, error) {
	var df DataFile
	if err := json.Unmarshal(data, &df); err != nil {
		return nil, fmt.Errorf("JSONとして読めません: %w", err)
	}
	if df.Version != 1 {
		return nil, fmt.Errorf("スキーマ version は 1 である必要があります (got %d)", df.Version)
	}
	seen := map[string]bool{}
	for i, r := range df.Records {
		if _, err := time.Parse("2006-01-02", r.Date); err != nil {
			return nil, fmt.Errorf("records[%d]: 日付が YYYY-MM-DD ではありません: %q", i, r.Date)
		}
		if seen[r.Date] {
			return nil, fmt.Errorf("records[%d]: 日付が重複しています: %s", i, r.Date)
		}
		seen[r.Date] = true
		if !dayTypes[r.Context.DayType] {
			return nil, fmt.Errorf("%s: day_type が不正です: %q", r.Date, r.Context.DayType)
		}
		if !locations[r.Context.Location] {
			return nil, fmt.Errorf("%s: location が不正です: %q", r.Date, r.Context.Location)
		}
		if !weathers[r.Context.Weather] {
			return nil, fmt.Errorf("%s: weather が不正です: %q", r.Date, r.Context.Weather)
		}
		scores := map[string]*int{
			"condition_score": r.Health.ConditionScore,
			"mental_score":    r.Health.MentalScore,
			"stress_score":    r.Health.StressScore,
		}
		for name, v := range scores {
			if v != nil && (*v < 1 || *v > 5) {
				return nil, fmt.Errorf("%s: %s は 1〜5 でなければなりません (got %d)", r.Date, name, *v)
			}
		}
		if r.Health.SleepHours != nil && (*r.Health.SleepHours < 0 || *r.Health.SleepHours > 24) {
			return nil, fmt.Errorf("%s: sleep_hours が範囲外です", r.Date)
		}
		if r.Health.WeightKg != nil && (*r.Health.WeightKg <= 0 || *r.Health.WeightKg > 300) {
			return nil, fmt.Errorf("%s: weight_kg が範囲外です", r.Date)
		}
	}
	return &df, nil
}

func runGit(repo string, dryRun bool, args ...string) error {
	fmt.Printf("[git] (%s) git %v\n", repo, args)
	if dryRun {
		return nil
	}
	cmd := exec.Command("git", args...)
	cmd.Dir = repo
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

func main() {
	dataPath := flag.String("data", os.Getenv("LIFELOG_DATA"), "data.json のパス")
	repoPath := flag.String("repo", os.Getenv("LIFELOG_REPO"), "同期先プライベートリポジトリのパス")
	apply := flag.Bool("apply", false, "実際にコピーとコミットを行う（既定は dry-run）")
	push := flag.Bool("push", false, "--apply と併用した場合に git push も行う")
	message := flag.String("message", "", "コミットメッセージ（既定は自動生成）")
	flag.Parse()

	if *dataPath == "" {
		fmt.Fprintln(os.Stderr, "--data（または環境変数 LIFELOG_DATA）が必要です")
		os.Exit(2)
	}
	raw, err := os.ReadFile(*dataPath)
	if err != nil {
		fmt.Fprintln(os.Stderr, "data.json を読めません:", err)
		os.Exit(1)
	}
	df, err := validate(raw)
	if err != nil {
		fmt.Fprintln(os.Stderr, "検証NG:", err)
		os.Exit(1)
	}
	fmt.Printf("検証OK: version=%d, records=%d 件\n", df.Version, len(df.Records))

	dryRun := !*apply
	if *repoPath == "" {
		fmt.Println("同期先リポジトリが未指定のため、検証のみで終了します。")
		return
	}
	if _, err := os.Stat(filepath.Join(*repoPath, ".git")); err != nil {
		fmt.Fprintln(os.Stderr, "同期先が git リポジトリではありません:", *repoPath)
		os.Exit(1)
	}
	dest := filepath.Join(*repoPath, "data.json")
	fmt.Printf("コピー予定: %s -> %s\n", *dataPath, dest)
	if !dryRun {
		if err := os.WriteFile(dest, raw, 0o644); err != nil {
			fmt.Fprintln(os.Stderr, "コピーに失敗:", err)
			os.Exit(1)
		}
	}
	msg := *message
	if msg == "" {
		msg = fmt.Sprintf("data: sync lifelog records (%d records)", len(df.Records))
	}
	if err := runGit(*repoPath, dryRun, "add", "data.json"); err != nil {
		fmt.Fprintln(os.Stderr, "git add 失敗:", err)
		os.Exit(1)
	}
	if err := runGit(*repoPath, dryRun, "commit", "-m", msg); err != nil {
		fmt.Fprintln(os.Stderr, "git commit 失敗（変更がない場合も含む）:", err)
		os.Exit(1)
	}
	if *push {
		if err := runGit(*repoPath, dryRun, "push"); err != nil {
			fmt.Fprintln(os.Stderr, "git push 失敗:", err)
			os.Exit(1)
		}
	}
	if dryRun {
		fmt.Println("dry-run のため実際の変更は行っていません。実行するには --apply を付けてください。")
	} else {
		fmt.Println("同期が完了しました。")
	}
}
