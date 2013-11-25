function FileHandler() {

    this.get = function ( file ) {
        if ( AscBrowser.isAppleDevices ) {
            var downloadWindow = window.open( file, "_parent", "", false );
            downloadWindow.document.title = "Downloading...";
            window.focus();
        }
        else {
            var frmWindow = getIFrameWindow( file );
            var frm = frmWindow.document.getElementById( "frmFile" );
            frm.submit();
            frmWindow.focus();
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
        frame.name = "fileFrame";
        frame.id = "fileFrame";

        document.body.appendChild( frame );
        generateIFrameContent( file );
        frame.style.width = "0px";
        frame.style.height = "0px";
        frame.style.border = "0px";
        frame.style.display = "none";
    }
    var generateIFrameContent = function ( file ) {
        var frameWindow = window.frames["fileFrame"];
        var content = "<form id='frmFile' method='post' enctype='application/data' action='" + file + "'></form>";
        frameWindow.document.open();
        frameWindow.document.write( content );
        frameWindow.document.close();
    }
}
function getFile( filePath ) {
    fh = new FileHandler()
    fh.get( filePath );
}