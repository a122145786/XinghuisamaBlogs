@echo off
chcp 65001 >nul
title 星辉博客 - 本地启动器
cd /d "%~dp0XHBlogs"

echo ========================================
echo   星辉博客本地网站启动中...
echo   启动后请用浏览器打开 http://localhost:3000
echo   密码：123456
echo ========================================
echo.

start "" http://localhost:3000
npm run dev

pause
