CD /D %~dp0
call npm install -g grunt-cli
call npm install
call grunt --level=WHITESPACE_ONLY --desktop=true --formatting=PRETTY_PRINT
rem call grunt --level=ADVANCED --desktop=true
pause