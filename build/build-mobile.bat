CD /D %~dp0
call npm install -g grunt-cli
call npm install
call grunt --nomap=true
pause