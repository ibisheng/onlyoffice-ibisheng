CD /D %~dp0
call npm install -g grunt-cli
call npm install
call grunt --level=WHITESPACE_ONLY --nomap=true --formatting=PRETTY_PRINT --mobile=true
pause