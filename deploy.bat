@echo off
echo =======================================
echo     AUTO DEPLOY TOOL CHO TECHSTORE
echo =======================================
echo [1/3] Dang gom code moi...
git add .
echo [2/3] Dang luu thay doi...
git commit -m "Auto update and deploy from local"
echo [3/3] Dang day len server de Vercel tu dong build...
git push
echo Hoan tat! Ban co the tat cua so nay.
pause