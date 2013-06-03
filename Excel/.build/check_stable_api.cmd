@echo off

if NOT DEFINED STABLE_API_PATH set STABLE_API_PATH=..\..\..\..\..\ASC\Redist\WEB\sdk\OfficeWebExcel
if EXIST "%STABLE_API_PATH%\api.js" exit /b 0
set STABLE_API_PATH=

:read_vars
call config_read_vars.cmd

if NOT "%ERRORLEVEL%"=="0" (
	echo.
	echo Error: Can not read config file
	exit /b 1
)

if NOT DEFINED STABLE_API_PATH (
	call config_set_var.cmd STABLE_API_PATH "%CD%"
	goto enter_path
)

if EXIST "%STABLE_API_PATH%\api.js" exit /b 0

:enter_path
echo.
echo Please enter correct path to Stable API folder (STABLE_API_PATH)
start "" /wait notepad "%CFG_FILE%"
goto read_vars
