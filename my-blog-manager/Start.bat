@echo off
chcp 65001 >nul 2>&1  :: 解决中文乱码问题
cd /d "%~dp0"

echo [调试] 脚本所在目录：%~dp0
echo [调试] 开始检测Python环境...

:: 直接调用默认的 python 命令（不限制具体小版本，只要求 3.10+）
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [状态] 正在调用默认 Python 环境...
    python run_me.py
    if %errorlevel% neq 0 (
        echo ❌ 错误：Python 执行 run_me.py 失败！
        pause
        exit /b 1
    )
    goto end
)

:: 兜底：未找到Python环境
echo ❌ 错误：未找到 Python 环境，请确保已安装并添加到系统PATH！
echo 🔍 排查步骤：
echo    1. 确认安装Python 3.10 或以上版本（官网：https://www.python.org/downloads/）
echo    2. 安装时勾选 "Add Python to PATH"
echo    3. 重启命令行/电脑后重试
pause

:end
echo ✅ 程序执行完成
exit /b 0