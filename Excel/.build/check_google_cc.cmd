@echo off

set GOOGLE_CC=com.google.javascript.jscomp.CommandLineRunner

java %GOOGLE_CC% --help >nul 2>&1
if "%ERRORLEVEL%"=="-1" exit /b 0

:read_vars
call config_read_vars.cmd

if NOT "%ERRORLEVEL%"=="0" (
	echo.
	echo Error: Can not read config file
	exit /b 1
)

if NOT DEFINED GOOGLE_CC_PATH (
	call config_set_var.cmd GOOGLE_CC_PATH "%CD%"
	goto enter_path
)

java -cp "%GOOGLE_CC_PATH%" %GOOGLE_CC% --help >nul 2>&1
if "%ERRORLEVEL%"=="-1" goto setup_cp

:enter_path
echo.
echo Please enter correct path to Google Closure Complier (GOOGLE_CC_PATH)
start "" /wait notepad "%CFG_FILE%"
goto read_vars

:setup_cp
if "%CLASSPATH%"=="" (set CLASSPATH=%GOOGLE_CC_PATH%) else (set CLASSPATH=%CLASSPATH%;%GOOGLE_CC_PATH%)
exit /b 0
