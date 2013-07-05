@echo on

echo Installation nodejs modules
call npm install node-gyp -g
call npm install jsdom
call npm install canvas
call npm install navigator
call npm install xmlhttprequest

pause
