"use strict";

function FileHandler() {

    this.get = function ( file ) {
        if ( AscBrowser.isAppleDevices ) {
            var downloadWindow = window.open( file, "_parent", "", false );
            downloadWindow.document.title = "Downloading...";
            window.focus();
        }
        else {
			//делаем как docs.google.com, решение с form submit в схеме с socket вызывало ошибку 405 (Method Not Allowed)
            var frmWindow = getIFrameWindow( file );
//            frmWindow.focus();
        }
    }
    var getIFrameWindow = function ( file ) {
        var ifr = document.getElementById( "fileFrame" );
        if ( null != ifr )
            document.body.removeChild( ifr );
        createFrame( file );
        var wnd = window.frames["fileFrame"];
        return wnd;
    }
    var createFrame = function ( file ) {
        var frame = document.createElement( "iframe" );
		frame.src = file;
        frame.name = "fileFrame";
        frame.id = "fileFrame";

        frame.style.width = "0px";
        frame.style.height = "0px";
        frame.style.border = "0px";
        frame.style.display = "none";
		
		document.body.appendChild( frame );
    }
}
function getFile( filePath ) {
    var fh = new FileHandler();
    fh.get( filePath );
}