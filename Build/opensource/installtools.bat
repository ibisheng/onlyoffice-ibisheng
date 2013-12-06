@echo off
cd /D %~dp0
echo Installation grunt and grunt-contrib
call npm install -g grunt@0.3.17 
call npm install grunt-contrib@0.3.0
