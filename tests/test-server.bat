@echo off
echo ==================================
echo アプリテンプレート テストサーバー
echo ==================================
echo.
echo HTTPサーバーを起動します...
echo ポート: 8080
echo.
echo テスト用URL:
echo - 互換版: http://localhost:8080/index-compatible.html
echo - ESM版: http://localhost:8080/index-refactored.html
echo - 元版: http://localhost:8080/index.html
echo.
echo Ctrl+C で終了
echo ==================================
echo.

python -m http.server 8080