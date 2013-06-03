@echo off

svn help >nul 2>&1

if errorlevel 1 (
	echo.
	echo Can not find subversion command-line client
	exit /b 1
)
exit /b 0
