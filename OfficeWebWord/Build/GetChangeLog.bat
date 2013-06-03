@ECHO OFF

SET HG_DIR=C:\hg.stable
SET CHANGE_LOG_FILE=change.log

cd /D %HG_DIR%
ECHO Enter last version hg rev:
SET /p HG_REV=""

ECHO Menu changes: > %CHANGE_LOG_FILE% 
hg log -r "%HG_REV%: and ancestors(tip) and not merge()" --template="-{desc}\r\n" >> %CHANGE_LOG_FILE%

%CHANGE_LOG_FILE%