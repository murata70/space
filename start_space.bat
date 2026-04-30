@echo off
echo ========================================
echo   🚀 PROJECT: space 起動システム 
echo ========================================
echo.
echo [1/2] ライブラリの更新を確認中...
call npm install
echo.
echo [2/2] 宇宙を起動しています...
npx electron .