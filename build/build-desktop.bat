CD /D %~dp0
call npm install -g grunt-cli
call npm install
call grunt --level=WHITESPACE_ONLY --nomap=true --desktop=true --formatting=PRETTY_PRINT
rem call grunt --level=ADVANCED --nomap=true --desktop=true
pause