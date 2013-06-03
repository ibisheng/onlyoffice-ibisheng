@echo off

set CFG_FILE=config.txt

if EXIST "%CFG_FILE%" for /F "usebackq tokens=1,2 delims==" %%a in ("%CFG_FILE%") do set %%a=%%b

exit /b 0
