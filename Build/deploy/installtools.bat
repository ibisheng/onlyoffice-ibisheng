@echo off
cd /D %~dp0

SET GRUNT_CLI=grunt-cli

echo Installation grunt-cli
call npm list -g %GRUNT_CLI% || call npm install -g %GRUNT_CLI%

call npm install
