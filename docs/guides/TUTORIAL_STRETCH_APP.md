# 📚 チュートリアル：ストレッチ管理アプリの作成

## 🎯 このチュートリアルで学べること
- テンプレートから新しいアプリを作る方法
- GitHubへのアップロード手順
- GitHub Pagesでの公開方法

---

## 📋 作成するアプリの仕様

### ストレッチ管理アプリ
- **30種類のストレッチボタン**
- **タイマー機能**（開始・停止）
- **記録の自動保存**（Firebase使用）
- **1回1-2分の短いストレッチ**を記録

---

## 🚀 作成手順

### ステップ1: テンプレートの準備（5分）

#### 方法A: GitHub経由（推奨）
```bash
1. ブラウザで開く:
   https://github.com/muumuu8181/0000-00-00-project-template

2. 緑の「Code」ボタン → 「Download ZIP」

3. ワークフォルダに解凍:
   work/20250807/stretch-tracker/
```

#### 方法B: ローカルコピー
```bash
1. テンプレートフォルダをコピー:
   0000-00-00-project-template

2. 本日の日付フォルダに貼り付け:
   work/20250807/

3. フォルダ名を変更:
   stretch-tracker
```

---

### ステップ2: 動作確認（2分）

```bash
1. フォルダ内の index.html をダブルクリック
2. ブラウザで開いて現在の画面を確認
3. 「体重管理アプリ」が表示されればOK
```

---

### ステップ3: アプリのカスタマイズ（15分）

#### 3-1. タイトルの変更

**ファイル:** `index.html`  
**場所:** 7行目付近

```html
<!-- 変更前 -->
<title>アプリテンプレート v0.1</title>

<!-- 変更後 -->
<title>ストレッチ管理</title>
```

#### 3-2. 見出しの変更

**場所:** 100行目付近

```html
<!-- 変更前 -->
<h1>体重管理アプリ</h1>

<!-- 変更後 -->
<h1>🏃 ストレッチ管理</h1>
```

#### 3-3. ストレッチボタンの追加

**場所:** 体重入力フォームがある部分（110-150行目付近）

```html
<!-- この部分を全て削除 -->
<div class="weight-input">
    ...体重入力関連のHTML...
</div>

<!-- 以下に置き換え -->
<style>
    .stretch-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 10px;
        margin: 20px 0;
    }
    .stretch-btn {
        padding: 15px 10px;
        font-size: 14px;
        border: none;
        border-radius: 8px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        cursor: pointer;
        transition: transform 0.2s;
    }
    .stretch-btn:hover {
        transform: scale(1.05);
    }
    #timer-display {
        text-align: center;
        padding: 30px;
        background: #f8f9fa;
        border-radius: 15px;
        margin: 20px 0;
    }
    #timer {
        font-size: 48px;
        font-weight: bold;
        color: #2563eb;
        margin: 20px 0;
    }
    .stop-btn {
        padding: 15px 40px;
        font-size: 18px;
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 10px;
        cursor: pointer;
    }
</style>

<div class="stretch-grid">
    <!-- 首・肩のストレッチ -->
    <button class="stretch-btn" onclick="startStretch('首回し')">🔄 首回し</button>
    <button class="stretch-btn" onclick="startStretch('肩回し')">💪 肩回し</button>
    <button class="stretch-btn" onclick="startStretch('肩甲骨')">🦴 肩甲骨</button>
    <button class="stretch-btn" onclick="startStretch('首筋伸ばし')">📏 首筋伸ばし</button>
    <button class="stretch-btn" onclick="startStretch('肩上げ下げ')">⬆️ 肩上げ下げ</button>
    
    <!-- 腕・手のストレッチ -->
    <button class="stretch-btn" onclick="startStretch('手首回し')">🤚 手首回し</button>
    <button class="stretch-btn" onclick="startStretch('腕伸ばし')">🙆 腕伸ばし</button>
    <button class="stretch-btn" onclick="startStretch('指ストレッチ')">🖐️ 指ストレッチ</button>
    <button class="stretch-btn" onclick="startStretch('二の腕')">💪 二の腕</button>
    <button class="stretch-btn" onclick="startStretch('前腕伸ばし')">🦾 前腕伸ばし</button>
    
    <!-- 背中・腰のストレッチ -->
    <button class="stretch-btn" onclick="startStretch('背伸び')">🙌 背伸び</button>
    <button class="stretch-btn" onclick="startStretch('体側伸ばし')">🏹 体側伸ばし</button>
    <button class="stretch-btn" onclick="startStretch('腰ひねり')">🔄 腰ひねり</button>
    <button class="stretch-btn" onclick="startStretch('前屈')">🙇 前屈</button>
    <button class="stretch-btn" onclick="startStretch('後屈')">🤸 後屈</button>
    
    <!-- 脚のストレッチ -->
    <button class="stretch-btn" onclick="startStretch('太もも前')">🦵 太もも前</button>
    <button class="stretch-btn" onclick="startStretch('太もも裏')">🦿 太もも裏</button>
    <button class="stretch-btn" onclick="startStretch('ふくらはぎ')">🦶 ふくらはぎ</button>
    <button class="stretch-btn" onclick="startStretch('股関節')">🤸 股関節</button>
    <button class="stretch-btn" onclick="startStretch('足首回し')">🔄 足首回し</button>
    
    <!-- 全身のストレッチ -->
    <button class="stretch-btn" onclick="startStretch('ラジオ体操')">📻 ラジオ体操</button>
    <button class="stretch-btn" onclick="startStretch('深呼吸')">🫁 深呼吸</button>
    <button class="stretch-btn" onclick="startStretch('全身伸ばし')">🤸 全身伸ばし</button>
    <button class="stretch-btn" onclick="startStretch('バランス')">🧘 バランス</button>
    <button class="stretch-btn" onclick="startStretch('体幹')">💯 体幹</button>
    
    <!-- その他 -->
    <button class="stretch-btn" onclick="startStretch('目の体操')">👁️ 目の体操</button>
    <button class="stretch-btn" onclick="startStretch('顔ヨガ')">😊 顔ヨガ</button>
    <button class="stretch-btn" onclick="startStretch('瞑想')">🧘 瞑想</button>
    <button class="stretch-btn" onclick="startStretch('スクワット')">🏋️ スクワット</button>
    <button class="stretch-btn" onclick="startStretch('プランク')">📐 プランク</button>
</div>

<!-- タイマー表示部分 -->
<div id="timer-display" style="display:none;">
    <h2 id="current-stretch">ストレッチ中...</h2>
    <div id="timer">00:00</div>
    <button class="stop-btn" onclick="stopStretch()">⏹️ 停止</button>
</div>
```

#### 3-4. JavaScript機能の追加

**場所:** `</body>`タグの直前（scriptタグ内）

```javascript
// タイマー機能の追加
let startTime;
let timerInterval;
let currentStretchName;

function startStretch(name) {
    // 既存のタイマーがあれば停止
    if (timerInterval) {
        stopStretch();
    }
    
    currentStretchName = name;
    startTime = Date.now();
    document.getElementById('current-stretch').textContent = `${name} 実施中`;
    document.getElementById('timer-display').style.display = 'block';
    
    // ボタンを非表示
    document.querySelector('.stretch-grid').style.display = 'none';
    
    // タイマー更新
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 100);
}

function stopStretch() {
    if (!timerInterval) return;
    
    clearInterval(timerInterval);
    const duration = Math.floor((Date.now() - startTime) / 1000);
    
    // 記録を保存（既存のsaveData関数を流用）
    const record = {
        date: new Date().toLocaleDateString('ja-JP'),
        time: new Date().toLocaleTimeString('ja-JP'),
        stretch: currentStretchName,
        duration: duration,
        timestamp: Date.now()
    };
    
    // Firebaseに保存（既存の認証を使用）
    if (currentUser) {
        firebase.database().ref(`users/${currentUser.uid}/stretches`).push(record);
    }
    
    // UIをリセット
    document.getElementById('timer-display').style.display = 'none';
    document.querySelector('.stretch-grid').style.display = 'grid';
    
    // 完了メッセージ
    alert(`${currentStretchName} を ${duration}秒 実施しました！`);
    
    timerInterval = null;
}
```

---

### ステップ4: GitHubへのアップロード（10分）

#### 4-1. GitHubで新規リポジトリ作成

```bash
1. https://github.com にログイン
2. 右上の「+」→「New repository」
3. 設定:
   - Repository name: stretch-tracker
   - Description: ストレッチ管理アプリ
   - Public を選択
   - 他はそのまま
4. 「Create repository」をクリック
```

#### 4-2. ローカルからプッシュ

プロジェクトフォルダで以下のコマンドを実行:

```bash
# Git初期化
git init

# ファイルを追加
git add .

# コミット
git commit -m "Initial commit: ストレッチ管理アプリ"

# リモート設定（URLは自分のものに変更）
git remote add origin https://github.com/[あなたのユーザー名]/stretch-tracker.git

# プッシュ
git push -u origin main
```

#### 4-3. GitHub Pages設定

```bash
1. リポジトリページで「Settings」タブ
2. 左メニューの「Pages」
3. Source: Deploy from a branch
4. Branch: main / root
5. 「Save」をクリック
```

---

### ステップ5: 動作確認（5分）

1. **GitHub Pages URL**:
   ```
   https://[あなたのユーザー名].github.io/stretch-tracker/
   ```

2. **確認項目**:
   - [ ] 30種類のストレッチボタンが表示される
   - [ ] ボタンクリックでタイマー開始
   - [ ] 停止ボタンで記録保存
   - [ ] Googleログインが動作する

---

## 🎉 完成！

これでストレッチ管理アプリが完成しました。

### 次のステップ
- ストレッチの種類を追加・変更
- デザインのカスタマイズ
- 統計機能の追加
- グラフ表示機能

---

## 🆘 よくある質問

### Q: ボタンが表示されない
A: HTMLの置き換え場所を確認。体重入力部分を完全に削除したか確認。

### Q: タイマーが動かない
A: JavaScriptのコードが正しく追加されているか確認。

### Q: GitHub Pagesが404エラー
A: Settings → Pages の設定を確認。5分程度待つ必要があります。

### Q: Firebaseエラーが出る
A: テンプレートのFirebase設定はそのまま使えます。変更不要。

---

## 📚 参考リンク

- [テンプレートリポジトリ](https://github.com/muumuu8181/0000-00-00-project-template)
- [テンプレートのREADME](README.md)
- [GitHub Pages公式ドキュメント](https://pages.github.com/)

---

**作成日**: 2025-08-07  
**難易度**: ★★☆☆☆（初級〜中級）  
**所要時間**: 約30分