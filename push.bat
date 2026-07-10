@echo off
echo ===================================================
echo Pushing Antigravity Website to GitHub
echo ===================================================

:: Ensure Git command path is added for this session if not registered globally
set "PATH=%PATH%;C:\Program Files\Git\cmd"

:: Verify git is accessible
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Git was not found on this system.
    echo Please make sure Git is installed correctly.
    pause
    exit /b 1
)

echo Executing: git push -u origin main
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo Error: Git push failed. 
    echo Please check your internet connection, remote URL, or GitHub credentials.
    pause
    exit /b 1
)

echo.
echo Success! Your repository has been updated on GitHub.
pause
