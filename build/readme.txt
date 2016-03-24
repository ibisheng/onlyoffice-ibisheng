Этот документ описывает последовательность шагов для сборки SDK.

1. Установка необходимого ПО.
	- Скачать и установить 32-РАЗРЯДНУЮ версию nodejs (http://nodejs.org/dist/v0.10.28/node-v0.10.28-x86.msi).
	- Скачать и установить Java (http://java.com/ru/download/index.jsp).
	- Скачать и скопировать в рабочий каталог (deploy или opensource) файл compiler.jar (http://dl.google.com/closure-compiler/compiler-latest.zip)
	- Запусть deploy\installtools.bat для установки grunt и его плагинов. ВАЖНО! Grunt устанавливается в текущую папку, в подпапку node_modules. При сборке в другом каталоге необходимо еще раз запустить installtools.bat.
	
2. Сборка.
	- Запустить deploy\build.bat для сборки SDK.