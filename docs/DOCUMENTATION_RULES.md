# 📚 ドキュメント作成・管理ルール
作成日: 2025-01-10

## 🎯 基本原則
1. **既存ファイルの更新を優先** - 新規ファイル作成は最小限に
2. **適切な場所に配置** - プロジェクトルートに散らかさない
3. **一時的な分析は統合** - 分析完了後は既存ドキュメントに統合

## 📁 ファイル配置ルール

### ❌ やってはいけないこと
```
プロジェクトルート/
├── DOCUMENTATION_REVIEW_REPORT.md     # ❌ ルートに分析レポート
├── DOCUMENTATION_FIX_REPORT.md        # ❌ ルートに修正レポート  
├── GRID_NESTING_ANALYSIS_REPORT.md    # ❌ ルートに問題レポート
└── その他一時的なレポート.md           # ❌ どんどん増える
```

### ✅ 正しい配置
```
プロジェクトルート/
├── README.md                          # ✅ プロジェクト説明（更新のみ）
├── CHANGELOG.md                       # ✅ 変更履歴（あれば更新）
└── docs/
    ├── README.md                      # ✅ ドキュメント一覧
    ├── issues/                        # ✅ 問題・分析レポート
    │   └── YYYYMMDD_issue_name.md
    ├── fixes/                         # ✅ 修正記録
    │   └── YYYYMMDD_fix_name.md
    └── guides/                        # ✅ 永続的なガイド
        └── 各種ガイド.md
```

## 📝 ドキュメント作成フロー

### 1. 分析・調査時
```mermaid
調査開始 → 既存ドキュメントを確認 → 
├─ 関連ドキュメントあり → そこに追記
└─ 関連ドキュメントなし → docs/issues/に作成
```

### 2. 修正実施時
```mermaid
修正開始 → 
├─ README等の更新 → 直接編集
├─ CHANGELOG更新 → 変更内容を追記
└─ 修正レポート → docs/fixes/に作成（必要時のみ）
```

### 3. 完了後
```mermaid
作業完了 → 
├─ 一時ファイルの統合・削除
├─ 関連ドキュメントの相互参照を更新
└─ docs/README.mdのインデックス更新
```

## 🏷️ ファイル命名規則

### 一時的な分析・レポート
- `docs/issues/YYYYMMDD_<issue_name>.md`
- 例: `docs/issues/20250110_grid_nesting_problem.md`

### 修正記録
- `docs/fixes/YYYYMMDD_<fix_name>.md`
- 例: `docs/fixes/20250110_documentation_update.md`

### 恒久的なガイド
- `docs/guides/<GUIDE_NAME>.md`
- 例: `docs/guides/COMPONENT_GUIDE.md`

## 🔄 既存ファイル優先の原則

### 更新すべき既存ファイル
1. **README.md** - プロジェクト概要の変更
2. **CHANGELOG.md** - 変更履歴
3. **docs/guides/内のガイド** - 手順や使い方の更新
4. **package.json** - バージョン情報

### 新規作成が許される場合
1. **新機能のガイド** - docs/guides/に配置
2. **重大な問題の記録** - docs/issues/に配置
3. **大規模修正の記録** - docs/fixes/に配置

## 🗑️ クリーンアップルール

### 統合・削除のタイミング
- 分析完了後、内容を適切な場所に統合
- 一時的なレポートは1週間後に削除検討
- 重要な情報は恒久的なドキュメントに移行

### 統合先の例
```
DOCUMENTATION_REVIEW_REPORT.md の内容
→ docs/issues/20250110_documentation_inconsistencies.md

DOCUMENTATION_FIX_REPORT.md の内容  
→ CHANGELOG.md に要約を追記
→ 詳細は docs/fixes/20250110_documentation_update.md

GRID_NESTING_ANALYSIS_REPORT.md の内容
→ docs/issues/20250110_grid_nesting_problem.md
```

## 📊 チェックリスト

ドキュメント作成前に確認：
- [ ] 既存ファイルで対応できないか？
- [ ] 適切なディレクトリはどこか？
- [ ] ファイル名は規則に従っているか？
- [ ] 一時的なものか恒久的なものか？
- [ ] 他のドキュメントとの関連は？

## 🎯 目標

- **プロジェクトルートは常にクリーン**
- **ドキュメントは整理された状態**
- **情報の重複を避ける**
- **メンテナンスしやすい構造**

## 💡 実践例

### ❌ 悪い例（今回やってしまったこと）
```bash
# プロジェクトルートに直接作成
/DOCUMENTATION_REVIEW_REPORT.md
/DOCUMENTATION_FIX_REPORT.md  
/GRID_NESTING_ANALYSIS_REPORT.md
```

### ✅ 良い例（こうすべきだった）
```bash
# 1. 問題分析は issues ディレクトリへ
/docs/issues/20250110_documentation_inconsistencies.md
/docs/issues/20250110_grid_nesting_problem.md

# 2. 修正内容は CHANGELOG.md を更新
# （既存ファイルがあれば追記）

# 3. 詳細が必要な場合のみ fixes へ
/docs/fixes/20250110_v022_documentation_update.md
```

---

このルールに従うことで、プロジェクトの整理整頓を保ちます。