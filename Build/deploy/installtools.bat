@echo off
cd /D %~dp0

SET GRUNT=grunt@0.3.17
SET GRUNT_CONTRIB=grunt-contrib@0.3.0
SET GRUNT_CLOSURE_TOOLS=grunt-closure-tools@0.6.12
SET GRUNT_EXEC=grunt-exec@0.3.0
SET GRUNT_REPLACE=grunt-replace@0.3.2

echo Installation grunt and grunt-contrib
call npm list -g %GRUNT%			|| call npm install -g %GRUNT%
call npm list %GRUNT_CONTRIB%		|| call npm install %GRUNT_CONTRIB%
call npm list %GRUNT_CLOSURE_TOOLS%	|| call npm install %GRUNT_CLOSURE_TOOLS%
call npm list %GRUNT_EXEC%			|| call npm install %GRUNT_EXEC%
call npm list %GRUNT_REPLACE%		|| call npm install %GRUNT_REPLACE%
