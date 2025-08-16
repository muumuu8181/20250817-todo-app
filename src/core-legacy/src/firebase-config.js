
// ============================================================
// 🔥 Firebase自動設定 - Google認証必須実装 
// ============================================================
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, set, get } from 'firebase/database';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously, signOut, onAuthStateChanged } from 'firebase/auth';
import { errorCollector } from './error-collector.js';

// 実際のFirebaseプロジェクト設定 (環境変数または直接設定)
const firebaseConfig = {
  "apiKey": "AIzaSyA5PXKChizYDCXF_GJ4KL6Ylq9K5hCPXWE",
  "authDomain": "shares-b1b97.firebaseapp.com",
  "databaseURL": "https://shares-b1b97-default-rtdb.firebaseio.com",
  "projectId": "shares-b1b97",
  "storageBucket": "shares-b1b97.firebasestorage.app",
  "messagingSenderId": "38311063248",
  "appId": "1:38311063248:web:0d2d5726d12b305b24b8d5"
};

// Firebase初期化 (必須・スキップ不可)
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// エラー収集システム初期化
errorCollector.init(database, auth, {
    name: "Universal Template",
    version: "0.2"
});

// Google認証プロバイダー設定 (MANDATORY_REQUIREMENTS.md準拠)
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Google認証関数 (メイン認証方式)
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        console.log('🔥 Google認証成功:', user.displayName || user.email);
        return user;
    } catch (error) {
        console.error('Google認証エラー:', error);
        throw error;
    }
};

// ログアウト関数
export const signOutUser = async () => {
    try {
        await signOut(auth);
        console.log('✅ ログアウト成功');
    } catch (error) {
        console.error('ログアウトエラー:', error);
        throw error;
    }
};

// 認証状態監視関数
export const onAuthStateChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};

// 匿名認証 (フォールバック用・副次的位置)
export const signInAnonymouslyFallback = async () => {
    try {
        const result = await signInAnonymously(auth);
        console.log('⚠️ 匿名認証（フォールバック）:', result.user.uid);
        return result.user;
    } catch (error) {
        console.error('匿名認証エラー:', error);
        throw error;
    }
};

// データベース操作関数 (Firebase強制)
export const saveData = (collection, data) => {
    const dbRef = ref(database, collection);
    return push(dbRef, {
        ...data,
        timestamp: Date.now(),
        source: 'firebase-required' // LocalStorage使用の検出用
    });
};

export const loadData = (collection, callback) => {
    const dbRef = ref(database, collection);
    return onValue(dbRef, callback);
};

// エラー収集システムのエクスポート
export { errorCollector };

// ============================================================
// 🚨 重要: この設定を変更またはLocalStorageに変更すると
//     テンプレートの検証で自動的に検出・報告されます
// ============================================================
