CD /D %~dp0
call npm install -g grunt-cli
call npm install
rem call grunt --level=WHITESPACE_ONLY --desktop=true --formatting=PRETTY_PRINT
call grunt --level=ADVANCED

pause