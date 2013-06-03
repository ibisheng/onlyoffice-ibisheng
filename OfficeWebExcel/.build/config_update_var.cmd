@echo off

set CFG_FILE=config.txt

setlocal

set CFG_FILE_NEW=config.new.txt
set VAR_NAME=%~1
set VAR_VALUE=%~2

if NOT EXIST "%CFG_FILE%" (
	echo ; Build Config>"%CFG_FILE%"
	echo %VAR_NAME%=%VAR_VALUE%>>"%CFG_FILE%"
	goto finish
)

echo ; Build Config>"%CFG_FILE_NEW%"

for /F "usebackq tokens=1,2 delims==" %%a in ("%CFG_FILE%") do (
	if "%%a"=="%VAR_NAME%" (
		echo %VAR_NAME%=%VAR_VALUE%>>"%CFG_FILE_NEW%"
		set DONE=1
	) else (
		echo %%a=%%b>>"%CFG_FILE_NEW%"
	)
)

if NOT DEFINED DONE echo %VAR_NAME%=%VAR_VALUE%>>"%CFG_FILE_NEW%"

del /q "%CFG_FILE%"
ren "%CFG_FILE_NEW%" "%CFG_FILE%"

:finish
endlocal
exit /b 0
