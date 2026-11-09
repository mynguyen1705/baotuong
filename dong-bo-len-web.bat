@echo off
chcp 65001 >nul
echo ========================================================
echo   ĐỒNG BỘ NỘI DUNG TỪ LOCAL LÊN WEB PUBLIC (VERCEL)
echo ========================================================
echo.
echo Đang kiểm tra và đưa các thay đổi lên GitHub...
"C:\Program Files\Git\cmd\git.exe" add .
"C:\Program Files\Git\cmd\git.exe" commit -m "Dong bo cap nhat tu may chu local"
"C:\Program Files\Git\cmd\git.exe" push origin main

echo.
echo ========================================================
echo [OK] ĐÃ ĐẨY DỮ LIỆU LÊN GITHUB THÀNH CÔNG!
echo Hệ thống Vercel sẽ tự động build và cập nhật sau ~20-30 giây.
echo Trang web: https://baotuong2011.vercel.app/
echo ========================================================
echo.
pause

