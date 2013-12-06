@echo off
cd /D %~dp0

@echo on
call grunt.cmd build_webword

pause