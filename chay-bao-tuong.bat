@echo off
chcp 65001 >nul
set "PATH=%~dp0.tools\node;%PATH%"
echo ===============================================================
echo   BAO TUONG DIEN TU 20/11: CHAP CANH UOC MO - CHI DOI 9A3
echo   Truong TH^&THCS Hiep Thanh
echo ===============================================================
echo Dang khoi dong may chu Vite...
npm run dev -- --open

