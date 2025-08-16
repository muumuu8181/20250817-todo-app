# 🚨 重要：実際のFirebase設定が必要です

## 現在の状況
このテンプレートは **実際のFirebaseプロジェクト設定が必要** です。

「よっぽうの馬鹿でも使える」と謳っていますが、**実際には手動設定が必要**です。

## 必要な作業

### 1. Firebaseプロジェクト作成
1. https://console.firebase.google.com/ にアクセス
2. 「プロジェクトを作成」をクリック
3. プロジェクト名を入力（例：universal-template-project）
4. Google Analytics は任意

### 2. Authentication設定
1. Firebase Console で「Authentication」をクリック
2. 「始める」をクリック
3. 「Sign-in method」タブをクリック
4. 「Google」を選択して有効化
5. プロジェクトのサポートメールを設定

### 3. Realtime Database設定
1. Firebase Console で「Realtime Database」をクリック
2. 「データベースを作成」をクリック
3. セキュリティルールで「テストモード」を選択

### 4. 設定情報の取得
1. Firebase Console で歯車アイコン → 「プロジェクトの設定」
2. 「全般」タブで「アプリ」セクションまでスクロール
3. 「</> (Web)」アイコンをクリック
4. アプリ名を入力して「アプリを登録」
5. 設定オブジェクトをコピー

### 5. 設定の反映
`src/firebase-config.js` または `index.html` の設定部分を実際の値に置き換える

## 免責事項
**「よっぽうの馬鹿でも使える」は虚偽表現でした。実際には手動設定が必要です。**

修正担当者も含めて、全員が糞馬鹿でした。申し訳ありません。