$( function () {

    function toFixed( n ) {
        return n//.toFixed( cExcelSignificantDigits ) - 0;
    }

    function difBetween( a, b ) {
        return Math.abs( a - b ) < dif
    }

    var ver = 2;

    var oParser, wb, ws, date1, date2, dif = 1e-9,
        data = getTestWorkbook(),
        sData = data + "";
    if ( c_oSerFormat.Signature === sData.substring( 0, c_oSerFormat.Signature.length ) ) {
        var sUrlPath = "offlinedocs/";
        var wb = new Workbook( sUrlPath, new Asc.asc_CHandlersList(), {} );
//        wb.initGlobalObjects();

        History = new CHistory(wb);

        g_oIdCounter = new CIdCounter();
        g_oTableId = new CTableId();
        if ( this.User )
            g_oIdCounter.Set_UserId(this.User.asc_getId());

        g_oUndoRedoCell = new UndoRedoCell(wb);
        g_oUndoRedoWorksheet = new UndoRedoWoorksheet(wb);
        g_oUndoRedoWorkbook = new UndoRedoWorkbook(wb);
        g_oUndoRedoCol = new UndoRedoRowCol(wb, false);
        g_oUndoRedoRow = new UndoRedoRowCol(wb, true);
        g_oUndoRedoComment = new UndoRedoComment(wb);
        g_oUndoRedoAutoFilters = new UndoRedoAutoFilters(wb);
        g_oUndoRedoGraphicObjects = new UndoRedoGraphicObjects(wb);
        g_oIdCounter.Set_Load(false);

        var oBinaryFileReader = new BinaryFileReader( sUrlPath );
        oBinaryFileReader.Read( sData, wb );
    }
    ws = wb.getWorksheet( wb.getActive() );

    /*QUnit.log( function ( details ) {
        console.log( "Log: " + details.name + ", result - " + details.result );
    } );*/

    module( "Formula" );

    test( "Test: \"Absolute reference\"", function () {

        ws.getRange2( "A7" ).setValue( "1" );
        ws.getRange2( "A8" ).setValue( "2" );
        ws.getRange2( "A9" ).setValue( "3" );
        oParser = new parserFormula( 'A$7+A8', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3 );

        oParser = new parserFormula( 'A$7+A$8', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3 );

        oParser = new parserFormula( '$A$7+$A$8', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3 );

        oParser = new parserFormula( 'SUM($A$7:$A$9)', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 6 );
    } )

    test( "Test: \"Arithmetical operations\"", function () {
        oParser = new parserFormula( '1+3', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 4 );

        oParser = new parserFormula( '(1+2)*4+3', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), (1 + 2) * 4 + 3 );

        oParser = new parserFormula( '2^52', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), Math.pow( 2, 52 ) );

        oParser = new parserFormula( '-10', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -10 );

        oParser = new parserFormula( '-10*2', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -20 );

        oParser = new parserFormula( '-10+10', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 0 );

        oParser = new parserFormula( '12%', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 0.12 );

        oParser = new parserFormula( "2<>\"3\"", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "TRUE", "2<>\"3\"" )

        oParser = new parserFormula( "2=\"3\"", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "FALSE", "2=\"3\"" );

        oParser = new parserFormula( "2>\"3\"", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "FALSE", "2>\"3\"" );

        oParser = new parserFormula( "\"f\">\"3\"", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "TRUE" );

        oParser = new parserFormula( "\"f\"<\"3\"", "A1", ws );
        ok( oParser.parse() );
        strictEqual( "FALSE", oParser.calculate().getValue(), "FALSE" );

        oParser = new parserFormula( "FALSE>=FALSE", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "TRUE" );

        oParser = new parserFormula( "\"TRUE\"&\"TRUE\"", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "TRUETRUE" );

        oParser = new parserFormula( "10*\"\"", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

        oParser = new parserFormula( "-TRUE", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -1 );
    } )

    test( "Test: \"SIN have wrong arguments count\"", function () {
        oParser = new parserFormula( 'SIN(3.1415926,3.1415926*2)', "A1", ws );
        ok( !oParser.parse() );
    } )

    test( "Test: \"SIN(3.1415926)\"", function () {
        oParser = new parserFormula( 'SIN(3.1415926)', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), Math.sin( 3.1415926 ) );
    } )

    test( "Test: \"COS(PI()/2)\"", function () {
        oParser = new parserFormula( 'COS(PI()/2)', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), Math.cos( Math.PI / 2 ) );
    } )

    test( "Test: \"SUM(1,2,3)\"", function () {
        oParser = new parserFormula( 'SUM(1,2,3)', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 + 2 + 3 );
    } )

    test( "Test: \"\"s\"&5\"", function () {
        oParser = new parserFormula( "\"s\"&5", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "s5" );
    } )

    test( "Test: \"String+Number\"", function () {
        oParser = new parserFormula( "1+\"099\"", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 100 );

        ws.getRange2( "A1469" ).setValue( "'099" );
        ws.getRange2( "A1470" ).setValue( "\"099\"" );

        oParser = new parserFormula( "1+A1469", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 100 );


        oParser = new parserFormula( "1+A1470", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

    } )

    test( "Test: \"POWER(2,8)\"", function () {
        oParser = new parserFormula( "POWER(2,8)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), Math.pow( 2, 8 ) );
    } )

    test( "Test: \"POWER(0,-3)\"", function () {
        oParser = new parserFormula( "POWER(0,-3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#DIV/0!" );
    } )

    test( "Test: \"ISNA(A1)\"", function () {
        var r = ws.getRange2( "K1" );
        ws.getRange2( "A1" ).setValue( "#N/A" );
        r.setValue( "=ISNA(A1)" );
        strictEqual( ws.getCell2( "K1" ).getCells()[0].getValue(), "TRUE" );
    } )

    test( "Test: \"ROUNDUP(31415.92654;-2)\"", function () {
        oParser = new parserFormula( "ROUNDUP(31415.92654;-2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 31500 );
    } )

    test( "Test: \"ROUNDUP(3.2;0)\"", function () {
        oParser = new parserFormula( "ROUNDUP(3.2;0)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 4 );
    } )

    test( "Test: \"ROUNDUP(-3.14159;1)\"", function () {
        oParser = new parserFormula( "ROUNDUP(-3.14159;1)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -3.2 );
    } )

    test( "Test: \"ROUNDUP(3.14159;3)\"", function () {
        oParser = new parserFormula( "ROUNDUP(3.14159;3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3.142 );
    } )

    test( "Test: \"ROUNDDOWN(31415.92654;-2)\"", function () {
        oParser = new parserFormula( "ROUNDDOWN(31415.92654;-2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 31400 );
    } )

    test( "Test: \"ROUNDDOWN(-3.14159;1)\"", function () {
        oParser = new parserFormula( "ROUNDDOWN(-3.14159;1)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -3.1 );
    } )

    test( "Test: \"ROUNDDOWN(3.14159;3)\"", function () {
        oParser = new parserFormula( "ROUNDDOWN(3.14159;3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3.141 );
    } )

    test( "Test: \"ROUNDDOWN(3.2;0)\"", function () {
        oParser = new parserFormula( "ROUNDDOWN(3.2;0)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3 );
    } )

    test( "Test: \"MROUND\"", function () {
        var multiple;//должен равняться значению второго аргумента
        function mroundHelper( num ) {
            var multiplier = Math.pow( 10, Math.floor( Math.log( Math.abs( num ) ) / Math.log( 10 ) ) - cExcelSignificantDigits + 1 );
            var nolpiat = 0.5 * (num > 0 ? 1 : num < 0 ? -1 : 0) * multiplier;
            var y = (num + nolpiat) / multiplier;
            y = y / Math.abs( y ) * Math.floor( Math.abs( y ) )
            var x = y * multiplier / multiple

            // var x = number / multiple;
            var nolpiat = 5 * (x / Math.abs( x )) * Math.pow( 10, Math.floor( Math.log( Math.abs( x ) ) / Math.log( 10 ) ) - cExcelSignificantDigits );
            x = x + nolpiat;
            x = x | x;

            return x * multiple;
        }


        oParser = new parserFormula( "MROUND(10;3)", "A1", ws );
        ok( oParser.parse() );
        multiple = 3;
        strictEqual( oParser.calculate().getValue(), mroundHelper( 10 + 3 / 2 ) );

        oParser = new parserFormula( "MROUND(-10;-3)", "A1", ws );
        ok( oParser.parse() );
        multiple = -3;
        strictEqual( oParser.calculate().getValue(), mroundHelper( -10 + -3 / 2 ) );

        oParser = new parserFormula( "MROUND(1.3;0.2)", "A1", ws );
        ok( oParser.parse() );
        multiple = 0.2;
        strictEqual( oParser.calculate().getValue(), mroundHelper( 1.3 + 0.2 / 2 ) );
    } )

    test( "Test: \"T(\"HELLO\")\"", function () {
        oParser = new parserFormula( "T(\"HELLO\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "HELLO" );
    } )

    test( "Test: \"T(123)\"", function () {
        oParser = new parserFormula( "T(123)", "A1", ws );
        ok( oParser.parse() );
        ok( !oParser.calculate().getValue(), "123" );
    } )

    test( "Test: YEAR", function () {
        oParser = new parserFormula( "YEAR(2013)", "A1", ws );
        ok( oParser.parse() );
        if ( g_bDate1904 )
            strictEqual( oParser.calculate().getValue(), 1909 );
        else
            strictEqual( oParser.calculate().getValue(), 1905 );
    } )

    test( "Test: DAY", function () {
        oParser = new parserFormula( "DAY(2013)", "A1", ws );
        ok( oParser.parse() );
        if ( g_bDate1904 )
            strictEqual( oParser.calculate().getValue(), 6 );
        else
            strictEqual( oParser.calculate().getValue(), 5 );
    } )

    test( "Test: DAY 2", function () {
        oParser = new parserFormula( "DAY(\"20 may 2045\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 20 );
    } )

    test( "Test: MONTH #1", function () {
        oParser = new parserFormula( "MONTH(2013)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 7 );
    } )

    test( "Test: MONTH #2", function () {
        oParser = new parserFormula( "MONTH(DATE(2013,2,2))", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2 );
    } )

    test( "Test: MONTH #3", function () {
        oParser = new parserFormula( "MONTH(NOW())", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), new Date().getUTCMonth() + 1 );
    } )

    test( "Test: \"10-3\"", function () {
        oParser = new parserFormula( "10-3", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 7 );
    } )

    test( "Test: \"SUM\"", function () {

        ws.getRange2( "S5" ).setValue( "=1" );
        ws.getRange2( "S6" ).setValue( "=-1/Fact(2)" );
        ws.getRange2( "S7" ).setValue( "=1/Fact(4)" );
        ws.getRange2( "S8" ).setValue( "=-1/Fact(6)" );

        oParser = new parserFormula( "SUM(S5:S8)", "A1", ws );
        ok( oParser.parse() );
//        strictEqual( oParser.calculate().getValue(), 1-1/Math.fact(2)+1/Math.fact(4)-1/Math.fact(6) );
        ok( Math.abs( oParser.calculate().getValue() - (1 - 1 / Math.fact( 2 ) + 1 / Math.fact( 4 ) - 1 / Math.fact( 6 )) ) < dif );
    } )

    test( "Test: \"MAX\"", function () {

        ws.getRange2( "S5" ).setValue( "=1" );
        ws.getRange2( "S6" ).setValue( "=-1/Fact(2)" );
        ws.getRange2( "S7" ).setValue( "=1/Fact(4)" );
        ws.getRange2( "S8" ).setValue( "=-1/Fact(6)" );

        oParser = new parserFormula( "MAX(S5:S8)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );
    } )

    test( "Test: \"MAXA\"", function () {

        ws.getRange2( "S5" ).setValue( "=1" );
        ws.getRange2( "S6" ).setValue( "=-1/Fact(2)" );
        ws.getRange2( "S7" ).setValue( "=1/Fact(4)" );
        ws.getRange2( "S8" ).setValue( "=-1/Fact(6)" );

        oParser = new parserFormula( "MAXA(S5:S8)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );
    } )

    test( "Test: \"MIN\"", function () {

        ws.getRange2( "S5" ).setValue( "=1" );
        ws.getRange2( "S6" ).setValue( "=-1/Fact(2)" );
        ws.getRange2( "S7" ).setValue( "=1/Fact(4)" );
        ws.getRange2( "S8" ).setValue( "=-1/Fact(6)" );

        oParser = new parserFormula( "MIN(S5:S8)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -1 / Math.fact( 2 ) );
    } )

    test( "Test: \"MINA\"", function () {

        ws.getRange2( "S5" ).setValue( "=1" );
        ws.getRange2( "S6" ).setValue( "=-1/Fact(2)" );
        ws.getRange2( "S7" ).setValue( "=1/Fact(4)" );
        ws.getRange2( "S8" ).setValue( "=-1/Fact(6)" );

        oParser = new parserFormula( "MINA(S5:S8)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -1 / Math.fact( 2 ) );
    } )

    test( "Test: SUM(S7:S9,{1,2,3})", function () {
        ws.getRange2( "S7" ).setValue( "1" );
        ws.getRange2( "S8" ).setValue( "2" );
        ws.getRange2( "S9" ).setValue( "3" );
        ws.getRange2( "S10" ).setValue( "=SUM(S7:S9,{1,2,3})" );
        strictEqual( ws.getCell2( "S10" ).getCells()[0].getValue(), "12" );
    } )

    test( "Test: ISREF", function () {
        oParser = new parserFormula( "ISREF(G0)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "FALSE" );
    } )

    test( "Test: MOD", function () {
        oParser = new parserFormula( "MOD(7,3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );
    } )

    test( "Test: rename sheet #1", function () {
        oParser = new parserFormula( "Лист2!A2", "A1", ws );
        ok( oParser.parse() === true );
        // strictEqual( oParser.parse(), true)
        strictEqual( oParser.changeSheet( "Лист2", "Лист3" ).assemble(), "Лист3!A2" );
    } )

    test( "Test: rename sheet #2", function () {
        oParser = new parserFormula( "Лист2:Лист3!A2", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.changeSheet( "Лист2", "Лист1" ).assemble(), "Лист1:Лист3!A2" );
    } )

    test( "Test: rename sheet #3", function () {
        oParser = new parserFormula( "Лист2!A2:A5", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.changeSheet( "Лист2", "Лист3" ).assemble(), "Лист3!A2:A5" );
    } )

    test( "Test: rename sheet #4", function () {
        ws = wb.getWorksheetById( 1 );
        ws.getRange2( "S95" ).setValue( "2" );
        ws = wb.getWorksheetById( 2 );
        ws.getRange2( "S100" ).setValue( "=" + wb.getWorksheetById( 1 ).getName() + "!S95" );
        strictEqual( ws.getCell2( "S100" ).getCells()[0].getValue(), "2" );

        wb.getWorksheetById( 1 ).setName( "ЛистTEMP" );

        strictEqual( ws.getCell2( "S100" ).getCells()[0].getFormula(), wb.getWorksheetById( 1 ).getName() + "!S95", ws.getCell2( "S100" ).getCells()[0].getFormula() + " " + wb.getWorksheetById( 1 ).getName() + "!S95" );

    } )

    test( "Test: wrong ref", function () {
        oParser = new parserFormula( "1+XXX1", "A1", ws );
        ok( oParser.parse() );
        notStrictEqual( oParser.calculate().getValue(), "1" );
    } )

    test( "Test: \"CODE\"", function () {
        oParser = new parserFormula( "CODE(\"abc\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 97 );
    } )

    test( "Test: \"CHAR\"", function () {
        oParser = new parserFormula( "CHAR(97)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "a" );
    } )

    test( "Test: \"CHAR(CODE())\"", function () {
        oParser = new parserFormula( "CHAR(CODE(\"A\"))", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "A" );
    } )

    test( "Test: \"PROPER\"", function () {
        oParser = new parserFormula( "PROPER(\"2-cent's worth\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "2-Cent'S Worth" );
        oParser = new parserFormula( "PROPER(\"76BudGet\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "76Budget" );
        oParser = new parserFormula( "PROPER(\"this is a TITLE\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "This Is A Title" );
    } )

    test( "Test: \"GCD\"", function () {
        oParser = new parserFormula( "GCD(10,100,50)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 10 );
        oParser = new parserFormula( "GCD(24.6,36.2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 12 );
        oParser = new parserFormula( "GCD(-1,39,52)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );
    } )

    test( "Test: \"FIXED\"", function () {
        oParser = new parserFormula( "FIXED(1234567,-3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "1,235,000" );
        oParser = new parserFormula( "FIXED(.555555,10)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "0.5555550000" );
        oParser = new parserFormula( "FIXED(1234567.555555,4,TRUE)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "1234567.5556" );
        oParser = new parserFormula( "FIXED(1234567)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "1,234,567.00" );
    } )

    test( "Test: \"REPLACE\"", function () {

        oParser = new parserFormula( "REPLACE(\"abcdefghijk\",3,4,\"XY\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "abXYghijk" );

        oParser = new parserFormula( "REPLACE(\"abcdefghijk\",3,1,\"12345\")", "B2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "ab12345defghijk" );

        oParser = new parserFormula( "REPLACE(\"abcdefghijk\",15,4,\"XY\")", "C2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "abcdefghijkXY" );

    } )

    test( "Test: \"SEARCH\"", function () {

        oParser = new parserFormula( "SEARCH(\"~*\",\"abc*dEF\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 4 );

        oParser = new parserFormula( "SEARCH(\"~\",\"abc~dEF\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 4 );

        oParser = new parserFormula( "SEARCH(\"de\",\"abcdEF\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 4 );

        oParser = new parserFormula( "SEARCH(\"?c*e\",\"abcdEF\")", "B2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2 );

        oParser = new parserFormula( "SEARCH(\"de\",\"dEFabcdEF\",3)", "C2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 7 );

        oParser = new parserFormula( "SEARCH(\"de\",\"dEFabcdEF\",30)", "C2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

    } )

    test( "Test: \"SUBSTITUTE\"", function () {

        oParser = new parserFormula( "SUBSTITUTE(\"abcaAabca\",\"a\",\"xx\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "xxbcxxAxxbcxx" );

        oParser = new parserFormula( "SUBSTITUTE(\"abcaaabca\",\"a\",\"xx\")", "B2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "xxbcxxxxxxbcxx" );

        oParser = new parserFormula( "SUBSTITUTE(\"abcaaabca\",\"a\",\"\",10)", "C2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "bcbc" );

        oParser = new parserFormula( "SUBSTITUTE(\"abcaaabca\",\"a\",\"xx\",3)", "C2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "abcaxxabca" );

    } )

    test( "Test: \"TRIM\"", function () {

        oParser = new parserFormula( "TRIM(\"     abc         def      \")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "abc def" );

    } )

    test( "Test: \"DOLLAR\"", function () {

        oParser = new parserFormula( "DOLLAR(1234.567)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "$1,234.57" );

        oParser = new parserFormula( "DOLLAR(1234.567,-2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "$1,200" );

        oParser = new parserFormula( "DOLLAR(-1234.567,4)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "($1,234.5670)" );

    } )

    test( "Test: \"VALUE\"", function () {

        oParser = new parserFormula( "VALUE(\"123.456\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 123.456 );

        oParser = new parserFormula( "VALUE(\"$1,000\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1000 );

        oParser = new parserFormula( "VALUE(\"23-Mar-2002\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 37338 );

        oParser = new parserFormula( "VALUE(\"03-26-2006\")", "A2", ws );
        ok( oParser.parse() );

        if ( g_bDate1904 )
            strictEqual( oParser.calculate().getValue(), 37340 );
        else
            strictEqual( oParser.calculate().getValue(), 38802 );

        oParser = new parserFormula( "VALUE(\"16:48:00\")-VALUE(\"12:17:12\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), g_oFormatParser.parse( "16:48:00" ).value - g_oFormatParser.parse( "12:17:12" ).value );

    } )

    test( "Test: \"DATEVALUE\"", function () {

        oParser = new parserFormula( "DATEVALUE(\"10-10-2010 10:26\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 40461 );

        oParser = new parserFormula( "DATEVALUE(\"10-10-2010 10:26\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 40461 );

        ws.getRange2( "A7" ).setValue( "3-Mar" );
        oParser = new parserFormula( "DATEVALUE(A7)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 41701 );

        oParser = new parserFormula( "DATEVALUE(\"$1,000\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

        oParser = new parserFormula( "DATEVALUE(\"23-Mar-2002\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 37338 );

        oParser = new parserFormula( "DATEVALUE(\"03-26-2006\")", "A2", ws );
        ok( oParser.parse() );

        if ( g_bDate1904 )
            strictEqual( oParser.calculate().getValue(), 37340 );
        else
            strictEqual( oParser.calculate().getValue(), 38802 );
    } )

    test( "Test: \"EDATE\"", function () {

        if ( !g_bDate1904 ) {
            oParser = new parserFormula( "EDATE(DATE(2006,1,31),5)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 38898 );

            oParser = new parserFormula( "EDATE(DATE(2004,2,29),12)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 38411 );

            ws.getRange2( "A7" ).setValue( "02-28-2004" );
            oParser = new parserFormula( "EDATE(A7,12)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 38411 );

            oParser = new parserFormula( "EDATE(DATE(2004,1,15),-23)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 37302 );
        }
        else {
            oParser = new parserFormula( "EDATE(DATE(2006,1,31),5)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 37436 );

            oParser = new parserFormula( "EDATE(DATE(2004,2,29),12)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 36949 );

            ws.getRange2( "A7" ).setValue( "02-28-2004" );
            oParser = new parserFormula( "EDATE(A7,12)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 36949 );

            oParser = new parserFormula( "EDATE(DATE(2004,1,15),-23)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 35840 );
        }
    } )

    test( "Test: \"EOMONTH\"", function () {

        if ( !g_bDate1904 ) {
            oParser = new parserFormula( "EOMONTH(DATE(2006,1,31),5)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 38898 );

            oParser = new parserFormula( "EOMONTH(DATE(2004,2,29),12)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 38411 );

            ws.getRange2( "A7" ).setValue( "02-28-2004" );
            oParser = new parserFormula( "EOMONTH(A7,12)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 38411 );

            oParser = new parserFormula( "EOMONTH(DATE(2004,1,15),-23)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 37315 );
        }
        else {
            oParser = new parserFormula( "EOMONTH(DATE(2006,1,31),5)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 37436 );

            oParser = new parserFormula( "EOMONTH(DATE(2004,2,29),12)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 36949 );

            ws.getRange2( "A7" ).setValue( "02-28-2004" );
            oParser = new parserFormula( "EOMONTH(A7,12)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 36949 );

            oParser = new parserFormula( "EOMONTH(DATE(2004,1,15),-23)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 35853 );
        }
    } )

    test( "Test: \"NETWORKDAYS\"", function () {

        oParser = new parserFormula( "NETWORKDAYS(DATE(2006,1,1),DATE(2006,1,31))", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 22 );

        oParser = new parserFormula( "NETWORKDAYS(DATE(2006,1,31),DATE(2006,1,1))", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -22 );

        oParser = new parserFormula( "NETWORKDAYS(DATE(2006,1,1),DATE(2006,2,1),{\"01-02-2006\",\"01-16-2006\"})", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 21 );

    } )

    test( "Test: \"PV\"", function () {

        function pv( rate, nper, pmt, fv, type ) {
            if ( rate != 0 ) {
                return -1 * ( fv + pmt * (1 + rate * type) * ( (Math.pow( (1 + rate), nper ) - 1) / rate ) ) / Math.pow( 1 + rate, nper )
            }
            else {
                return -1 * ( fv + pmt * nper );
            }

        }

        oParser = new parserFormula( "PV(0.08/12,12*20,500,,0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), pv( 0.08 / 12, 12 * 20, 500, 0, 0 ) );

        oParser = new parserFormula( "PV(0,12*20,500,,0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), pv( 0, 12 * 20, 500, 0, 0 ) );

    } )

    test( "Test: \"NPV\"", function () {

        oParser = new parserFormula( "NPV(0.1,-10000,3000,4200,6800)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1188.4434123352216 );

    } )

    test( "Test: \"SUMIF\"", function () {

        ws.getRange2( "A2" ).setValue( "100000" );
        ws.getRange2( "A3" ).setValue( "200000" );
        ws.getRange2( "A4" ).setValue( "300000" );
        ws.getRange2( "A5" ).setValue( "400000" );

        ws.getRange2( "B2" ).setValue( "7000" );
        ws.getRange2( "B3" ).setValue( "14000" );
        ws.getRange2( "B4" ).setValue( "21000" );
        ws.getRange2( "B5" ).setValue( "28000" );

        ws.getRange2( "C2" ).setValue( "250000" );

        oParser = new parserFormula( "SUMIF(A2:A5,\">160000\",B2:B5)", "A7", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 63000 );

        oParser = new parserFormula( "SUMIF(A2:A5,\">160000\")", "A8", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 900000 );

        oParser = new parserFormula( "SUMIF(A2:A5,300000,B2:B5)", "A9", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 21000 );

        oParser = new parserFormula( "SUMIF(A2:A5,\">\" & C2,B2:B5)", "A10", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 49000 );


        ws.getRange2( "A12" ).setValue( "Vegetables" );
        ws.getRange2( "A13" ).setValue( "Vegetables" );
        ws.getRange2( "A14" ).setValue( "Fruits" );
        ws.getRange2( "A15" ).setValue( "" );
        ws.getRange2( "A16" ).setValue( "Vegetables" );
        ws.getRange2( "A17" ).setValue( "Fruits" );

        ws.getRange2( "B12" ).setValue( "Tomatoes" );
        ws.getRange2( "B13" ).setValue( "Celery" );
        ws.getRange2( "B14" ).setValue( "Oranges" );
        ws.getRange2( "B15" ).setValue( "Butter" );
        ws.getRange2( "B16" ).setValue( "Carrots" );
        ws.getRange2( "B17" ).setValue( "Apples" );

        ws.getRange2( "C12" ).setValue( "2300" );
        ws.getRange2( "C13" ).setValue( "5500" );
        ws.getRange2( "C14" ).setValue( "800" );
        ws.getRange2( "C15" ).setValue( "400" );
        ws.getRange2( "C16" ).setValue( "4200" );
        ws.getRange2( "C17" ).setValue( "1200" );

        oParser = new parserFormula( "SUMIF(A12:A17,\"Fruits\",C12:C17)", "A19", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2000 );

        oParser = new parserFormula( "SUMIF(A12:A17,\"Vegetables\",C12:C17)", "A20", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 12000 );

        oParser = new parserFormula( "SUMIF(B12:B17,\"*es\",C12:C17)", "A21", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 4300 );

        oParser = new parserFormula( "SUMIF(A12:A17,\"\",C12:C17)", "A22", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 400 );

    } )

    test( "Test: \"TEXT\"", function () {

        wb.dependencyFormulas = new DependencyGraph( wb );

        oParser = new parserFormula( "TEXT(1234.567,\"$0.00\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "$1234.57" );

        oParser = new parserFormula( "TEXT(0.125,\"0.0%\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "12.5%" );

    } )

    test( "Test: \"WORKDAY\"", function () {

        wb.dependencyFormulas = new DependencyGraph( wb );

        oParser = new parserFormula( "WORKDAY(DATE(2006,1,1),0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 38718 );

        oParser = new parserFormula( "WORKDAY(DATE(2006,1,1),10)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 38730 );

        oParser = new parserFormula( "WORKDAY(DATE(2006,1,1),-10)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 38705 );

        oParser = new parserFormula( "WORKDAY(DATE(2006,1,1),20,{\"1-2-2006\",\"1-16-2006\"})", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 38748 );

    } )

    test( "Test: \"FV\"", function () {

        function fv( rate, nper, pmt, pv, type ) {
            var res;
            if ( type === undefined || type === null )
                type = 0;

            if ( pv === undefined || pv === null )
                pv = 0;

            if ( rate != 0 ) {
                res = -1 * ( pv * Math.pow( 1 + rate, nper ) + pmt * ( 1 + rate * type ) * ( Math.pow( 1 + rate, nper ) - 1) / rate );
            }
            else {
                res = -1 * ( pv + pmt * nper );
            }
            return res;
        }

        oParser = new parserFormula( "FV(0.06/12,10,-200,-500,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), fv( 0.06 / 12, 10, -200, -500, 1 ) );

        oParser = new parserFormula( "FV(0.12/12,12,-1000)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), fv( 0.12 / 12, 12, -1000 ) );

        oParser = new parserFormula( "FV(0.11/12,35,-2000,,1)", "A2", ws );
        ok( oParser.parse() );
        ok( Math.abs( oParser.calculate().getValue() - fv( 0.11 / 12, 35, -2000, null, 1 ) ) < dif );

        oParser = new parserFormula( "FV(0.06/12,12,-100,-1000,1)", "A2", ws );
        ok( oParser.parse() );
        ok( Math.abs( oParser.calculate().getValue() - fv( 0.06 / 12, 12, -100, -1000, 1 ) ) < dif );

    } )

    test( "Test: \"PMT\"", function () {

        function pmt( rate, nper, pv, fv, type ) {
            var res;
            if ( type === undefined || type === null )
                type = 0;

            if ( fv === undefined || fv === null )
                fv = 0;

            if ( rate != 0 ) {
                res = -1 * ( pv * Math.pow( 1 + rate, nper ) + fv ) /
                    ( ( 1 + rate * type ) * ( Math.pow( 1 + rate, nper ) - 1 ) / rate );
            }
            else {
                res = -1 * ( pv + fv ) / nper;
            }
            return res;
        }

        oParser = new parserFormula( "PMT(0.08/12,10,10000)", "A2", ws );
        ok( oParser.parse() );
        ok( Math.abs( oParser.calculate().getValue() - pmt( 0.08 / 12, 10, 10000 ) ) < dif );

        oParser = new parserFormula( "PMT(0.08/12,10,10000,0,1)", "A2", ws );
        ok( oParser.parse() );
        ok( Math.abs( oParser.calculate().getValue() - pmt( 0.08 / 12, 10, 10000, 0, 1 ) ) < dif );

    } )

    test( "Test: \"NPER\"", function () {

        function nper(rate,pmt,pv,fv,type){

            if ( rate === undefined || rate === null )
                rate = 0;

            if ( pmt === undefined || pmt === null )
                pmt = 0;

            if ( pv === undefined || pv === null )
                pv = 0;

            if ( type === undefined || type === null )
                type = 0;

            if ( fv === undefined || fv === null )
                fv = 0;

            var res;
            if ( rate != 0 ) {
                res = (-fv * rate + pmt * (1 + rate * type)) / (rate * pv + pmt * (1 + rate * type))
                res = Math.log( res ) / Math.log( 1+rate )
            }
            else {
                res = (- pv - fv )/ pmt ;
            }
            return res;
        }

        oParser = new parserFormula( "NPER(0.12/12,-100,-1000,10000,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), nper(0.12/12,-100,-1000,10000,1) );

        oParser = new parserFormula( "NPER(0.12/12,-100,-1000)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), nper(0.12/12,-100,-1000) );

    } )

    test( "Test: \"TIMEVALUE\"", function () {
        oParser = new parserFormula( "timevalue(\"10:02:34\")", "A2", ws );
        ok( oParser.parse() );
        ok( Math.abs( oParser.calculate().getValue() - 0.4184490740740740 ) < dif );

        oParser = new parserFormula( "timevalue(\"02-01-2006 10:15:29 AM\")", "A2", ws );
        ok( oParser.parse() );
        ok( Math.abs( oParser.calculate().getValue() - 0.4274189814823330 ) < dif );

        oParser = new parserFormula( "timevalue(\"22:02\")", "A2", ws );
        ok( oParser.parse() );
        ok( Math.abs( oParser.calculate().getValue() - 0.9180555555555560 ) < dif );
    } )

    test( "Test: \"DAYS360\"", function () {

        oParser = new parserFormula( "DAYS360(DATE(2002,2,3),DATE(2005,5,31))", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1198 );

        oParser = new parserFormula( "DAYS360(DATE(2005,5,31),DATE(2002,2,3))", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -1197 );

        oParser = new parserFormula( "DAYS360(DATE(2002,2,3),DATE(2005,5,31),FALSE)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1198 );

        oParser = new parserFormula( "DAYS360(DATE(2002,2,3),DATE(2005,5,31),TRUE)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1197 );

    } )

    test( "Test: \"WEEKNUM\"", function () {
        oParser = new parserFormula( "WEEKNUM(DATE(2006,1,1))", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "WEEKNUM(DATE(2006,1,1),17)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "WEEKNUM(DATE(2006,1,1),1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "WEEKNUM(DATE(2006,1,1),21)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 52 );

        oParser = new parserFormula( "WEEKNUM(DATE(2006,2,1),1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 5 );

        oParser = new parserFormula( "WEEKNUM(DATE(2006,2,1),2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 6 );

        oParser = new parserFormula( "WEEKNUM(DATE(2006,2,1),11)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 6 );

        oParser = new parserFormula( "WEEKNUM(DATE(2007,1,1),15)", "A2", ws );//понед
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "WEEKNUM(DATE(2008,1,1),15)", "A2", ws );//втор
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "WEEKNUM(DATE(2003,1,1),15)", "A2", ws );//сред
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "WEEKNUM(DATE(2009,1,1),15)", "A2", ws );//чет
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "WEEKNUM(DATE(2010,1,1),15)", "A2", ws );//пят
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "WEEKNUM(DATE(2011,1,1),15)", "A2", ws );//суб
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "WEEKNUM(DATE(2012,1,1),11)", "A2", ws );//вск
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "WEEKNUM(DATE(2008,1,4),11)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "WEEKNUM(DATE(2008,1,10),11)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2 );

        oParser = new parserFormula( "WEEKNUM(DATE(2008,1,11),11)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2 );

        oParser = new parserFormula( "WEEKNUM(DATE(2008,1,17),11)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3 );

        oParser = new parserFormula( "WEEKNUM(DATE(2008,1,18),11)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3 );

        oParser = new parserFormula( "WEEKNUM(DATE(2008,1,24),11)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 4 );

        oParser = new parserFormula( "WEEKNUM(DATE(2013,1,1),21)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "WEEKNUM(DATE(2013,1,7))", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2 );

    } )

    test( "Test: \"YEARFRAC\"", function () {
        function okWrapper( a, b ) {
            ok( Math.abs( a - b ) < dif );
        }

        oParser = new parserFormula( "YEARFRAC(DATE(2006,1,1),DATE(2006,3,26))", "A2", ws );
        ok( oParser.parse() );
        okWrapper( oParser.calculate().getValue(), 0.236111111 );

        oParser = new parserFormula( "YEARFRAC(DATE(2006,3,26),DATE(2006,1,1))", "A2", ws );
        ok( oParser.parse() );
        okWrapper( oParser.calculate().getValue(), 0.236111111 );

        oParser = new parserFormula( "YEARFRAC(DATE(2006,1,1),DATE(2006,7,1))", "A2", ws );
        ok( oParser.parse() );
        okWrapper( oParser.calculate().getValue(), 0.5 );

        oParser = new parserFormula( "YEARFRAC(DATE(2006,1,1),DATE(2007,9,1))", "A2", ws );
        ok( oParser.parse() );
        okWrapper( oParser.calculate().getValue(), 1.666666667 );

        oParser = new parserFormula( "YEARFRAC(DATE(2006,1,1),DATE(2006,7,1),0)", "A2", ws );
        ok( oParser.parse() );
        okWrapper( oParser.calculate().getValue(), 0.5 );

        oParser = new parserFormula( "YEARFRAC(DATE(2006,1,1),DATE(2006,7,1),1)", "A2", ws );
        ok( oParser.parse() );
        okWrapper( oParser.calculate().getValue(), 0.495890411 );

        oParser = new parserFormula( "YEARFRAC(DATE(2006,1,1),DATE(2006,7,1),2)", "A2", ws );
        ok( oParser.parse() );
        okWrapper( oParser.calculate().getValue(), 0.502777778 );

        oParser = new parserFormula( "YEARFRAC(DATE(2006,1,1),DATE(2006,7,1),3)", "A2", ws );
        ok( oParser.parse() );
        okWrapper( oParser.calculate().getValue(), 0.495890411 );

        oParser = new parserFormula( "YEARFRAC(DATE(2006,1,1),DATE(2006,7,1),4)", "A2", ws );
        ok( oParser.parse() );
        okWrapper( oParser.calculate().getValue(), 0.5 );

        oParser = new parserFormula( "YEARFRAC(DATE(2004,3,1),DATE(2006,3,1),1)", "A2", ws );
        ok( oParser.parse() );
        okWrapper( oParser.calculate().getValue(), 1.998175182481752 );
    } )

    test( "Test: \"DATEDIF\"", function () {

        oParser = new parserFormula( "DATEDIF(DATE(2001,1,1),DATE(2003,1,1),\"Y\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2 );

        oParser = new parserFormula( "DATEDIF(DATE(2001,6,1),DATE(2002,8,15),\"D\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 440 );

        oParser = new parserFormula( "DATEDIF(DATE(2001,6,1),DATE(2002,8,15),\"YD\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 75 );

        oParser = new parserFormula( "DATEDIF(DATE(2001,6,1),DATE(2002,8,15),\"MD\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 14 );
    } )

    test( "Test: \"SUMPRODUCT\"", function () {

        oParser = new parserFormula( "SUMPRODUCT({2,3})", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 5 );

        oParser = new parserFormula( "SUMPRODUCT({2,3},{4,5})", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 23 );

        oParser = new parserFormula( "SUMPRODUCT({2,3},{4,5},{2,2})", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 46 );

        oParser = new parserFormula( "SUMPRODUCT({2,3;4,5},{2,2;3,4})", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 42 );

        ws.getRange2( "N44" ).setValue( "1" );
        ws.getRange2( "N45" ).setValue( "2" );
        ws.getRange2( "N46" ).setValue( "3" );
        ws.getRange2( "N47" ).setValue( "4" );

        ws.getRange2( "O44" ).setValue( "5" );
        ws.getRange2( "O45" ).setValue( "6" );
        ws.getRange2( "O46" ).setValue( "7" );
        ws.getRange2( "O47" ).setValue( "8" );

        ws.getRange2( "P44" ).setValue( "9" );
        ws.getRange2( "P45" ).setValue( "10" );
        ws.getRange2( "P46" ).setValue( "11" );
        ws.getRange2( "P47" ).setValue( "12" );
        oParser = new parserFormula( "SUMPRODUCT(N44:N47,O44:O47,P44:P47)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 780 );
    } )

    test( "Test: \"SINH\"", function () {

        oParser = new parserFormula( "SINH(0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 0 );

        oParser = new parserFormula( "SINH(1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), ((Math.E - 1 / Math.E) / 2) );
    } )

    test( "Test: \"COSH\"", function () {

        oParser = new parserFormula( "COSH(0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "COSH(1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), ((Math.E + 1 / Math.E) / 2) );
    } )

    test( "Test: \"TANH\"", function () {

        oParser = new parserFormula( "TANH(0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 0 );

        oParser = new parserFormula( "TANH(1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), ((Math.E * Math.E - 1) / (Math.E * Math.E + 1)) ), true );
    } )

    test( "Test: \"COMBIN\"", function () {

        oParser = new parserFormula( "COMBIN(8,2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 28 );

        oParser = new parserFormula( "COMBIN(10,4)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 210 );

        oParser = new parserFormula( "COMBIN(6,5)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 6 );

        oParser = new parserFormula( "COMBIN(-6,5)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "COMBIN(3,5)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "COMBIN(6,-5)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );
    } )

    test( "Test: \"FACTDOUBLE\"", function () {

        oParser = new parserFormula( "FACTDOUBLE(8)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2 * 4 * 6 * 8 );

        oParser = new parserFormula( "FACTDOUBLE(9)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 9 * 7 * 5 * 3 );

        oParser = new parserFormula( "FACTDOUBLE(6.5)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 6 * 4 * 2 );

        oParser = new parserFormula( "FACTDOUBLE(-6)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "FACTDOUBLE(600)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );
    } )

    test( "Test: \"GCD\"", function () {
        oParser = new parserFormula( "LCM(5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 5 );

        oParser = new parserFormula( "LCM(24.6,36.2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 72 );

        oParser = new parserFormula( "LCM(-1,39,52)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "LCM(0,39,52)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "LCM(24,36,15)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 360 );
    } )

    test( "Test: \"RANDBETWEEN\"", function () {
        var res;
        oParser = new parserFormula( "RANDBETWEEN(1,6)", "A1", ws );
        ok( oParser.parse() );
        res = oParser.calculate().getValue()
        ok( res >= 1 && res <= 6 );

        oParser = new parserFormula( "RANDBETWEEN(-10,10)", "A1", ws );
        ok( oParser.parse() );
        res = oParser.calculate().getValue()
        ok( res >= -10 && res <= 10 );

        oParser = new parserFormula( "RANDBETWEEN(-25,-3)", "A1", ws );
        ok( oParser.parse() );
        res = oParser.calculate().getValue()
        ok( res >= -25 && res <= -3 );
    } )

    test( "Test: \"QUOTIENT\"", function () {
        oParser = new parserFormula( "QUOTIENT(1,6)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 0 );

        oParser = new parserFormula( "QUOTIENT(-10,3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -3 );

        oParser = new parserFormula( "QUOTIENT(5,3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "QUOTIENT(5,0)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#DIV/0!" );
    } )

    test( "Test: \"TRUNC\"", function () {
        oParser = new parserFormula( "TRUNC(PI())", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3 );

        oParser = new parserFormula( "TRUNC(PI(),3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3.141 );

        oParser = new parserFormula( "TRUNC(PI(),-2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 0 );

        oParser = new parserFormula( "TRUNC(-PI(),2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -3.14 );

    } )

    test( "Test: \"MULTINOMIAL\"", function () {
        oParser = new parserFormula( "MULTINOMIAL(2,3,4)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), Math.fact( 2 + 3 + 4 ) / (Math.fact( 2 ) * Math.fact( 3 ) * Math.fact( 4 )) );

        oParser = new parserFormula( "MULTINOMIAL(2,3,\"r\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

        oParser = new parserFormula( "MULTINOMIAL(150,50)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

    } )

    test( "Test: \"SUMSQ\"", function () {
        oParser = new parserFormula( "SUMSQ(2.5,-3.6,2.4)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2.5 * 2.5 + 3.6 * 3.6 + 2.4 * 2.4 );

        oParser = new parserFormula( "SUMSQ(2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 4 );

        oParser = new parserFormula( "SUMSQ(150,50)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 150 * 150 + 50 * 50 );

        oParser = new parserFormula( "SUMSQ(150,\"f\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

    } )

    test( "Test: \"ROMAN\"", function () {

        oParser = new parserFormula( "ROMAN(499,0)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "CDXCIX" );

        oParser = new parserFormula( "ROMAN(499,1)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "LDVLIV" );

        oParser = new parserFormula( "ROMAN(499,2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "XDIX" );

        oParser = new parserFormula( "ROMAN(499,3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "VDIV" );

        oParser = new parserFormula( "ROMAN(499,4)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "ID" );

        oParser = new parserFormula( "ROMAN(2013,0)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "MMXIII" );

        oParser = new parserFormula( "ROMAN(2013,5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

        oParser = new parserFormula( "ROMAN(-2013,1)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

        oParser = new parserFormula( "ROMAN(2499,1)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "MMLDVLIV" );

    } )

    test( "Test: \"SUMXMY2\"", function () {

        oParser = new parserFormula( "SUMXMY2({2,3,9,1,8,7,5},{6,5,11,7,5,4,4})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 79 );

        oParser = new parserFormula( "SUMXMY2({2,3,9;1,8,7},{6,5,11;7,5,4})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 78 );

        oParser = new parserFormula( "SUMXMY2(7,5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

    } )

    test( "Test: \"SUMX2MY2\"", function () {

        oParser = new parserFormula( "SUMX2MY2({2,3,9,1,8,7,5},{6,5,11,7,5,4,4})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -55 );

        oParser = new parserFormula( "SUMX2MY2({2,3,9;1,8,7},{6,5,11;7,5,4})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -64 );

        oParser = new parserFormula( "SUMX2MY2(7,5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

    } )

    test( "Test: \"SUMX2MY2\"", function () {

        oParser = new parserFormula( "SUMX2PY2({2,3,9,1,8,7,5},{6,5,11,7,5,4,4})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 521 );

        oParser = new parserFormula( "SUMX2PY2({2,3,9;1,8,7},{6,5,11;7,5,4})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 480 );

        oParser = new parserFormula( "SUMX2PY2(7,5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

    } )

    test( "Test: \"SERIESSUM\"", function () {

        ws.getRange2( "A2" ).setValue( "=1" );
        ws.getRange2( "A3" ).setValue( "=-1/Fact(2)" );
        ws.getRange2( "A4" ).setValue( "=1/Fact(4)" );
        ws.getRange2( "A5" ).setValue( "=-1/Fact(6)" );

        oParser = new parserFormula( "SERIESSUM(PI()/4,0,2,A2:A5)", "A7", ws );
        ok( oParser.parse() );
        ok( Math.abs( oParser.calculate().getValue() - (1 - 1 / 2 * Math.pow( Math.PI / 4, 2 ) + 1 / Math.fact( 4 ) * Math.pow( Math.PI / 4, 4 ) - 1 / Math.fact( 6 ) * Math.pow( Math.PI / 4, 6 )) ) < dif );

        ws.getRange2( "B2" ).setValue( "=1" );
        ws.getRange2( "B3" ).setValue( "=-1/Fact(3)" );
        ws.getRange2( "B4" ).setValue( "=1/Fact(5)" );
        ws.getRange2( "B5" ).setValue( "=-1/Fact(7)" );

        oParser = new parserFormula( "SERIESSUM(PI()/4,1,2,B2:B5)", "B7", ws );
        ok( oParser.parse() );
        ok( Math.abs( oParser.calculate().getValue() - (Math.PI / 4 - 1 / Math.fact( 3 ) * Math.pow( Math.PI / 4, 3 ) + 1 / Math.fact( 5 ) * Math.pow( Math.PI / 4, 5 ) - 1 / Math.fact( 7 ) * Math.pow( Math.PI / 4, 7 )) ) < dif );

    } )

    /*
     * Statical Function
     * */
    test( "Test: \"AVEDEV\"", function () {

        oParser = new parserFormula( "AVEDEV(-3.5,1.4,6.9,-4.5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 4.075 );

        oParser = new parserFormula( "AVEDEV({-3.5,1.4,6.9,-4.5})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 4.075 );

        oParser = new parserFormula( "AVEDEV(-3.5,1.4,6.9,-4.5,-0.3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 3.32 ), true );

    } )

    test( "Test: \"AVERAGE\"", function () {

        oParser = new parserFormula( "AVERAGE(1,2,3,4,5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3 );

        oParser = new parserFormula( "AVERAGE({1,2;3,4})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2.5 );

        oParser = new parserFormula( "AVERAGE({1,2,3,4,5},6,\"7\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 4 );

        oParser = new parserFormula( "AVERAGE({1,\"2\",TRUE,4})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2.5 );

    } )

    test( "Test: \"AVERAGEA\"", function () {

        ws.getRange2( "E2" ).setValue( "TRUE" );
        ws.getRange2( "E3" ).setValue( "FALSE" );

        oParser = new parserFormula( "AVERAGEA(10,E1)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 10 );

        oParser = new parserFormula( "AVERAGEA(10,E2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 5.5 );

        oParser = new parserFormula( "AVERAGEA(10,E3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 5 );

    } )

    test( "Test: \"AVERAGEIF\"", function () {

        ws.getRange2( "E2" ).setValue( "10" );
        ws.getRange2( "E3" ).setValue( "20" );
        ws.getRange2( "E4" ).setValue( "28" );
        ws.getRange2( "E5" ).setValue( "30" );

        oParser = new parserFormula( "AVERAGEIF(E2:E5,\">15\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 26 );

    } )

    test( "Test: \"BINOMDIST\"", function () {

        function binomdist( x, n, p ) {
            x = parseInt( x );
            n = parseInt( n );
            return Math.binomCoeff( n, x ) * Math.pow( p, x ) * Math.pow( 1 - p, n - x );
        }

        oParser = new parserFormula( "BINOMDIST(6,10,0.5,FALSE)", "A1", ws );
        ok( oParser.parse() );
        ok( Math.abs( oParser.calculate().getValue() - binomdist( 6, 10, 0.5 ) ) < dif );

        oParser = new parserFormula( "BINOMDIST(6,10,0.5,TRUE)", "A1", ws );
        ok( oParser.parse() );
        ok( Math.abs( oParser.calculate().getValue() - (function () {
            var bm = 0;
            for ( var y = 0; y <= 6; y++ ) {
                bm += binomdist( y, 10, 0.5 )
            }
            return bm;
        })() ) < dif );

        oParser = new parserFormula( "BINOMDIST(11,10,0.5,FALSE)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

    } )

    test( "Test: \"CONFIDENCE\"", function () {

        oParser = new parserFormula( "CONFIDENCE(0.4,5,12)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 1.214775614397568 ), true );

        oParser = new parserFormula( "CONFIDENCE(0.75,9,7)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 1.083909233527114 ), true );

    } )

    test( "Test: \"CORREL\"", function () {

        oParser = new parserFormula( "CORREL({2.532,5.621;2.1,3.4},{5.32,2.765;5.2,\"f\"})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), -0.988112020032211 ), true );

        oParser = new parserFormula( "CORREL({1;2;3},{4;5;\"E\"})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 1 ), true );

        oParser = new parserFormula( "CORREL({1,2},{1,\"e\"})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#DIV/0!" );

    } )

    test( "Test: \"COUNT\"", function () {

        ws.getRange2( "E2" ).setValue( "TRUE" );

        oParser = new parserFormula( "COUNT({1,2,3,4,5})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 5 );

        oParser = new parserFormula( "COUNT(1,2,3,4,5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 5 );

        oParser = new parserFormula( "COUNT({1,2,3,4,5},6,\"7\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 7 );

        oParser = new parserFormula( "COUNT(10,E150)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "COUNT(10,E2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );


    } )

    test( "Test: \"COUNTA\"", function () {

        ws.getRange2( "E2" ).setValue( "TRUE" );

        oParser = new parserFormula( "COUNTA({1,2,3,4,5})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 5 );

        oParser = new parserFormula( "COUNTA(1,2,3,4,5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 5 );

        oParser = new parserFormula( "COUNTA({1,2,3,4,5},6,\"7\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 7 );

        oParser = new parserFormula( "COUNTA(10,E150)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "COUNTA(10,E2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2 );


    } )

    test( "Test: \"COUNTIF\"", function () {

        ws.getRange2( "A7" ).setValue( "3" );
        ws.getRange2( "B7" ).setValue( "10" );
        ws.getRange2( "C7" ).setValue( "7" );
        ws.getRange2( "D7" ).setValue( "10" );

        ws.getRange2( "A8" ).setValue( "apples" );
        ws.getRange2( "B8" ).setValue( "oranges" );
        ws.getRange2( "C8" ).setValue( "grapes" );
        ws.getRange2( "D8" ).setValue( "melons" );


        oParser = new parserFormula( "COUNTIF(A7:D7,\"=10\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2 );

        oParser = new parserFormula( "COUNTIF(A7:D7,\">5\")", "B1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3 );

        oParser = new parserFormula( "COUNTIF(A7:D7,\"<>10\")", "C1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2 );

        oParser = new parserFormula( "COUNTIF(A8:D8,\"*es\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3 );

        oParser = new parserFormula( "COUNTIF(A8:D8,\"??a*\")", "B2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2 );

        oParser = new parserFormula( "COUNTIF(A8:D8,\"*l*\")", "C2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2 );

    } )

    test( "Test: \"COVAR\"", function () {

        oParser = new parserFormula( "COVAR({2.532,5.621;2.1,3.4},{5.32,2.765;5.2,6.7})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), -1.3753740625 ), true );

        oParser = new parserFormula( "COVAR({1,2};{4,5})", "B1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 0.25 ), true );

    } )

    test( "Test: \"CRITBINOM\"", function () {

        oParser = new parserFormula( "CRITBINOM(6,0.5,0.75)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 4 );

        oParser = new parserFormula( "CRITBINOM(12,0.3,0.95)", "B1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 6 );

        oParser = new parserFormula( "CRITBINOM(-12,0.3,0.95)", "B1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "CRITBINOM(-12,1.3,0.95)", "B1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "CRITBINOM(-12,-1.3,0.95)", "B1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "CRITBINOM(-12,0,0.95)", "B1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "CRITBINOM(-12,0.3,1.95)", "B1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

    } )

    test( "Test: \"DEVSQ\"", function () {

        var ws1 = wb.getWorksheet( 1 );

        ws1.getRange2( "A1" ).setValue( "5.6" );
        ws1.getRange2( "A2" ).setValue( "8.2" );
        ws1.getRange2( "A3" ).setValue( "9.2" );

        oParser = new parserFormula( "DEVSQ(5.6,8.2,9.2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 6.906666666666665 ), true );

        oParser = new parserFormula( "DEVSQ({5.6,8.2,9.2})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 6.906666666666665 ), true );

        oParser = new parserFormula( "DEVSQ(5.6,8.2,\"9.2\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 3.379999999999999 ), true );

        oParser = new parserFormula( "DEVSQ(Лист2!A1:A3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 6.906666666666665 ), true );

    } )

    test( "Test: \"EXPONDIST\"", function () {

        oParser = new parserFormula( "EXPONDIST(0.2,10,FALSE)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 1.353352832366127 ), true );

        oParser = new parserFormula( "EXPONDIST(2.3,1.5,TRUE)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 0.968254363621932 ), true );

    } )

    test( "Test: \"FISHER\"", function () {

        function fisher( x ) {
            return toFixed( 0.5 * Math.ln( (1 + x) / (1 - x) ) );
        }

        oParser = new parserFormula( "FISHER(-0.43)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), fisher( -.43 ) );

        oParser = new parserFormula( "FISHER(0.578)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), fisher( 0.578 ) );

        oParser = new parserFormula( "FISHER(1)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "FISHER(-1)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

    } )

    test( "Test: \"FISHERINV\"", function () {

        function fisherInv( x ) {
            return toFixed( ( Math.exp( 2 * x ) - 1 ) / ( Math.exp( 2 * x ) + 1 ) );
        }

        oParser = new parserFormula( "FISHERINV(-0.43)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), fisherInv( -.43 ) );

        oParser = new parserFormula( "FISHERINV(0.578)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), fisherInv( 0.578 ) );

        oParser = new parserFormula( "FISHERINV(1)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), fisherInv( 1 ) );

        oParser = new parserFormula( "FISHERINV(-1)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), fisherInv( -1 ) );

    } )

    test( "Test: \"FORECAST\"", function () {

        function forecast( fx, y, x ) {

            var fSumDeltaXDeltaY = 0, fSumSqrDeltaX = 0, _x = 0, _y = 0, xLength = 0;
            for ( var i = 0; i < x.length; i++ ) {
                _x += x[i];
                _y += y[i];
                xLength++;
            }

            _x /= xLength;
            _y /= xLength;

            for ( var i = 0; i < x.length; i++ ) {

                var fValX = x[i];
                var fValY = y[i];

                fSumDeltaXDeltaY += ( fValX - _x ) * ( fValY - _y );
                fSumSqrDeltaX += ( fValX - _x ) * ( fValX - _x );

            }

            return toFixed( _y + fSumDeltaXDeltaY / fSumSqrDeltaX * ( fx - _x ) );

        }

        oParser = new parserFormula( "FORECAST(30,{6,7,9,15,21},{20,28,31,38,40})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), forecast( 30, [6, 7, 9, 15, 21], [20, 28, 31, 38, 40] ) );

    } )

    test( "Test: \"FREQUENCY\"", function () {

        ws.getRange2( "A202" ).setValue( "79" );
        ws.getRange2( "A203" ).setValue( "85" );
        ws.getRange2( "A204" ).setValue( "78" );
        ws.getRange2( "A205" ).setValue( "85" );
        ws.getRange2( "A206" ).setValue( "50" );
        ws.getRange2( "A207" ).setValue( "81" );
        ws.getRange2( "A208" ).setValue( "95" );
        ws.getRange2( "A209" ).setValue( "88" );
        ws.getRange2( "A210" ).setValue( "97" );

        ws.getRange2( "B202" ).setValue( "70" );
        ws.getRange2( "B203" ).setValue( "89" );
        ws.getRange2( "B204" ).setValue( "79" );

        oParser = new parserFormula( "FREQUENCY(A202:A210,B202:B204)", "A201", ws );
        ok( oParser.parse() );
        var a = oParser.calculate()
        strictEqual( a.getElement( 0 ).getValue(), 1 );
        strictEqual( a.getElement( 1 ).getValue(), 2 );
        strictEqual( a.getElement( 2 ).getValue(), 4 );
        strictEqual( a.getElement( 3 ).getValue(), 2 );

    } )

    test( "Test: \"GAMMALN\"", function () {

        oParser = new parserFormula( "GAMMALN(4.5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue().toFixed( 14 ) - 0, 2.45373657084244 );

        oParser = new parserFormula( "GAMMALN(-4.5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

    } )

    test( "Test: \"GEOMEAN\"", function () {

        function geommean( x ) {

            var s1 = 0, _x = 1, xLength = 0, _tx;
            for ( var i = 0; i < x.length; i++ ) {
                _x *= x[i];
            }

            return  Math.pow( _x, 1 / x.length )
        }

        oParser = new parserFormula( "GEOMEAN(10.5,5.3,2.9)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), geommean( [10.5, 5.3, 2.9] ) );

        oParser = new parserFormula( "GEOMEAN(10.5,{5.3,2.9},\"12\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), geommean( [10.5, 5.3, 2.9, 12] ) );

        oParser = new parserFormula( "GEOMEAN(10.5,{5.3,2.9},\"12\",0)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

    } )

    test( "Test: \"HARMEAN\"", function () {

        function harmmean( x ) {

            var _x = 0, xLength = 0;
            for ( var i = 0; i < x.length; i++ ) {
                _x += 1 / x[i];
                xLength++;
            }
            return xLength / _x;
        }

        oParser = new parserFormula( "HARMEAN(10.5,5.3,2.9)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), harmmean( [10.5, 5.3, 2.9] ) );

        oParser = new parserFormula( "HARMEAN(10.5,{5.3,2.9},\"12\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), harmmean( [10.5, 5.3, 2.9, 12] ) );

        oParser = new parserFormula( "HARMEAN(10.5,{5.3,2.9},\"12\",0)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

    } )

    test( "Test: \"HYPGEOMDIST\"", function () {

        function hypgeomdist( x, n, M, N ) {
            return toFixed( Math.binomCoeff( M, x ) * Math.binomCoeff( N - M, n - x ) / Math.binomCoeff( N, n ) );
        }

        oParser = new parserFormula( "HYPGEOMDIST(1,4,8,20)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), hypgeomdist( 1, 4, 8, 20 ) );

        oParser = new parserFormula( "HYPGEOMDIST(1,4,8,20)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), hypgeomdist( 1, 4, 8, 20 ) );

        oParser = new parserFormula( "HYPGEOMDIST(-1,4,8,20)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "HYPGEOMDIST(5,4,8,20)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

    } )

    test( "Test: \"INTERCEPT\"", function () {

        function intercept( y, x ) {

            var fSumDeltaXDeltaY = 0, fSumSqrDeltaX = 0, _x = 0, _y = 0, xLength = 0;
            for ( var i = 0; i < x.length; i++ ) {
                _x += x[i];
                _y += y[i];
                xLength++;
            }

            _x /= xLength;
            _y /= xLength;

            for ( var i = 0; i < x.length; i++ ) {

                var fValX = x[i];
                var fValY = y[i];

                fSumDeltaXDeltaY += ( fValX - _x ) * ( fValY - _y );
                fSumSqrDeltaX += ( fValX - _x ) * ( fValX - _x );

            }

            return toFixed( _y - fSumDeltaXDeltaY / fSumSqrDeltaX * _x );

        }

        oParser = new parserFormula( "INTERCEPT({6,7,9,15,21},{20,28,31,38,40})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), intercept( [6, 7, 9, 15, 21], [20, 28, 31, 38, 40] ) );

    } )

    test( "Test: \"KURT\"", function () {

        function kurt( x ) {

            var sumSQRDeltaX = 0, _x = 0, xLength = 0, standDev = 0, sumSQRDeltaXDivstandDev = 0;
            for ( var i = 0; i < x.length; i++ ) {
                _x += x[i];
                xLength++;
            }

            _x /= xLength;

            for ( var i = 0; i < x.length; i++ ) {
                sumSQRDeltaX += Math.pow( x[i] - _x, 2 );
            }

            standDev = Math.sqrt( sumSQRDeltaX / ( xLength - 1 ) );

            for ( var i = 0; i < x.length; i++ ) {
                sumSQRDeltaXDivstandDev += Math.pow( (x[i] - _x) / standDev, 4 );
            }

            return toFixed( xLength * (xLength + 1) / (xLength - 1) / (xLength - 2) / (xLength - 3) * sumSQRDeltaXDivstandDev - 3 * (xLength - 1) * (xLength - 1) / (xLength - 2) / (xLength - 3) )

        }

        oParser = new parserFormula( "KURT(10.5,12.4,19.4,23.2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), kurt( [10.5, 12.4, 19.4, 23.2] ) );

        oParser = new parserFormula( "KURT(10.5,{12.4,19.4},23.2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), kurt( [10.5, 12.4, 19.4, 23.2] ) );

        oParser = new parserFormula( "KURT(10.5,12.4,19.4)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

    } )

    test( "Test: \"LARGE\"", function () {

        oParser = new parserFormula( "LARGE({3,5,3,5,4;4,2,4,6,7},3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 5 );

        oParser = new parserFormula( "LARGE({3,5,3,5,4;4,2,4,6,7},7)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 4 );

    } )

    test( "Test: \"MEDIAN\"", function () {

        function median( x ) {

            x.sort( function ( a, b ) {
                return a - b;
            } );

            if ( x.length % 2 )
                return x[(x.length - 1) / 2];
            else
                return (x[x.length / 2 - 1] + x[x.length / 2]) / 2;
        }

        oParser = new parserFormula( "MEDIAN(10.5,12.4,19.4,23.2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), median( [10.5, 12.4, 19.4, 23.2] ) );

        oParser = new parserFormula( "MEDIAN(10.5,{12.4,19.4},23.2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), median( [10.5, 12.4, 19.4, 23.2] ) );

        oParser = new parserFormula( "MEDIAN(-3.5,1.4,6.9,-4.5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), median( [-3.5, 1.4, 6.9, -4.5] ) );

    } )

    test( "Test: \"MODE\"", function () {

        function mode( x ) {

            x.sort( function ( a, b ) {
                return b - a;
            } );

            if ( x.length < 1 )
                return "#VALUE!";
            else {
                var nMaxIndex = 0, nMax = 1, nCount = 1, nOldVal = x[0], i;

                for ( i = 1; i < x.length; i++ ) {
                    if ( x[i] == nOldVal )
                        nCount++;
                    else {
                        nOldVal = x[i];
                        if ( nCount > nMax ) {
                            nMax = nCount;
                            nMaxIndex = i - 1;
                        }
                        nCount = 1;
                    }
                }
                if ( nCount > nMax ) {
                    nMax = nCount;
                    nMaxIndex = i - 1;
                }
                if ( nMax == 1 && nCount == 1 )
                    return "#VALUE!";
                else if ( nMax == 1 )
                    return nOldVal;
                else
                    return x[nMaxIndex];
            }
        }

        oParser = new parserFormula( "MODE(9,1,5,1,9,5,6,6)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), mode( [9, 1, 5, 1, 9, 5, 6, 6] ) );

        oParser = new parserFormula( "MODE(1,9,5,1,9,5,6,6)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), mode( [1, 9, 5, 1, 9, 5, 6, 6] ) );

        oParser = new parserFormula( "MODE(1,9,5,5,9,5,6,6)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), mode( [1, 9, 5, 5, 9, 5, 6, 6] ) );

    } )

    test( "Test: \"NORMDIST\"", function () {

        function normdist( x, mue, sigma, kum ) {
            if ( sigma <= 0 )
                return "#NUM!";
            else if ( kum == false )
                return toFixed( phi( (x - mue) / sigma ) / sigma );
            else
                return toFixed( 0.5 + gauss( (x - mue) / sigma ) );

        }

        oParser = new parserFormula( "NORMDIST(42,40,1.5,TRUE)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), normdist( 42, 40, 1.5, true ) );

        oParser = new parserFormula( "NORMDIST(42,40,1.5,FALSE)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), normdist( 42, 40, 1.5, false ) );

        oParser = new parserFormula( "NORMDIST(42,40,-1.5,TRUE)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), normdist( 42, 40, -1.5, true ) );

        oParser = new parserFormula( "NORMDIST(1,40,-1.5,TRUE)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), normdist( 1, 40, -1.5, true ) );

    } )

    test( "Test: \"NORMSDIST\"", function () {

        function normsdist( x ) {
            return toFixed( 0.5 + gauss( x ) );
        }

        oParser = new parserFormula( "NORMSDIST(1.333333)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), normsdist( 1.333333 ) );

        oParser = new parserFormula( "NORMSDIST(-1.5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), normsdist( -1.5 ) );

    } )

    test( "Test: \"NEGBINOMDIST\"", function () {

        function negbinomdist( x, r, p ) {
            x = parseInt( x );
            r = parseInt( r );
            if ( x < 0 || r < 1 || p < 0 || p > 1 )
                return "#NUM!";
            else
                return toFixed( Math.binomCoeff( x + r - 1, r - 1 ) * Math.pow( p, r ) * Math.pow( 1 - p, x ) );
        }

        oParser = new parserFormula( "NEGBINOMDIST(6,10,0.5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), negbinomdist( 6, 10, 0.5 ) );

        oParser = new parserFormula( "NEGBINOMDIST(6,10,1.5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), negbinomdist( 6, 10, 1.5 ) );

        oParser = new parserFormula( "NEGBINOMDIST(20,10,0.63)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), negbinomdist( 20, 10, 0.63 ) );

    } )

    test( "Test: \"NORMSINV\"", function () {

        function normsinv( x ) {
            if ( x <= 0.0 || x >= 1.0 )
                return "#N/A";
            else
                return toFixed( gaussinv( x ) );
        }

        oParser = new parserFormula( "NORMSINV(0.954)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), normsinv( 0.954 ) );

        oParser = new parserFormula( "NORMSINV(0.13)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), normsinv( 0.13 ) );

        oParser = new parserFormula( "NORMSINV(0.6782136)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), normsinv( 0.6782136 ) );

        oParser = new parserFormula( "NORMSINV(1.6782136)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), normsinv( 1.6782136 ) );

        oParser = new parserFormula( "NORMSINV(-1.6782136)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), normsinv( -1.6782136 ) );

    } )

    test( "Test: \"LOGINV\"", function () {

        function loginv( x, mue, sigma ) {
            if ( sigma <= 0 || x <= 0 || x >= 1 )
                return "#NUM!";
            else
                return toFixed( Math.exp( mue + sigma * ( gaussinv( x ) ) ) );
        }

        oParser = new parserFormula( "LOGINV(0.039084,3.5,1.2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), loginv( 0.039084, 3.5, 1.2 ) );

        oParser = new parserFormula( "LOGINV(0,3.5,1.2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), loginv( 0, 3.5, 1.2 ) );

        oParser = new parserFormula( "LOGINV(0,3.5,1.2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), loginv( 10, 3.5, 1.2 ) );

        oParser = new parserFormula( "LOGINV(0,3.5,1.2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), loginv( -10, 3.5, 1.2 ) );
    } )

    test( "Test: \"NORMINV\"", function () {

        function norminv( x, mue, sigma ) {
            if ( sigma <= 0.0 || x <= 0.0 || x >= 1.0 )
                return "#NUM!";
            else
                return toFixed( gaussinv( x ) * sigma + mue );
        }

        oParser = new parserFormula( "NORMINV(0.954,40,1.5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), norminv( 0.954, 40, 1.5 ) );

        oParser = new parserFormula( "NORMINV(0.13,100,0.5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), norminv( 0.13, 100, 0.5 ) );

        oParser = new parserFormula( "NORMINV(0.6782136,6,0.005)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), norminv( 0.6782136, 6, 0.005 ) );

        oParser = new parserFormula( "NORMINV(-1.6782136,7,0)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), norminv( -1.6782136, 7, 0 ) );

    } )

    test( "Test: \"PEARSON\"", function () {

        function pearson( x, y ) {

            var sumXDeltaYDelta = 0, sqrXDelta = 0, sqrYDelta = 0, _x = 0, _y = 0, xLength = 0;

            if ( x.length != y.length )
                return "#N/A"
            for ( var i = 0; i < x.length; i++ ) {

                _x += x[i]
                _y += y[i]
                xLength++;
            }

            _x /= xLength;
            _y /= xLength;

            for ( var i = 0; i < x.length; i++ ) {

                sumXDeltaYDelta += (x[i] - _x) * (y[i] - _y);
                sqrXDelta += (x[i] - _x) * (x[i] - _x);
                sqrYDelta += (y[i] - _y) * (y[i] - _y);

            }

            if ( sqrXDelta == 0 || sqrYDelta == 0 )
                return "#DIV/0!"
            else
                return toFixed( sumXDeltaYDelta / Math.sqrt( sqrXDelta * sqrYDelta ) );
        }

        oParser = new parserFormula( "PEARSON({9,7,5,3,1},{10,6,1,5,3})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), pearson( [9, 7, 5, 3, 1], [10, 6, 1, 5, 3] ) );

    } )

    test( "Test: \"PERCENTILE\"", function () {

        function percentile( A, k ) {

            A.sort( function ( a, b ) {
                return a - b;
            } )

            var nSize = A.length;
            if ( A.length < 1 || nSize == 0 )
                return new cError( cErrorType.not_available ).toString();
            else {
                if ( nSize == 1 )
                    return toFixed( A[0] );
                else {
                    var nIndex = Math.floor( k * (nSize - 1) );
                    var fDiff = k * (nSize - 1) - Math.floor( k * (nSize - 1) );
                    if ( fDiff == 0.0 )
                        return toFixed( A[nIndex] );
                    else {
                        return toFixed( A[nIndex] +
                            fDiff * (A[nIndex + 1] - A[nIndex]) );
                    }
                }
            }

        }

        oParser = new parserFormula( "PERCENTILE({1,3,2,4},0.3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), percentile( [1, 3, 2, 4], 0.3 ) );

        oParser = new parserFormula( "PERCENTILE({1,3,2,4},0.75)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), percentile( [1, 3, 2, 4], 0.75 ) );

    } )

    test( "Test: \"PERCENTRANK\"", function () {

        function percentrank( A, x, k ) {

            var tA = A, t, fNum = x;

            if ( !k ) k = 3;

            tA.sort( function ( a, b ) {
                return a - b;
            } );

            var nSize = tA.length;
            if ( tA.length < 1 || nSize == 0 )
                return "#N/A";

            else {
                if ( fNum < tA[0] || fNum > tA[nSize - 1] )
                    return "#N/A";
                else if ( nSize == 1 )
                    return 1
                else {
                    var fRes, nOldCount = 0, fOldVal = tA[0], i;
                    for ( i = 1; i < nSize && tA[i] < fNum; i++ ) {
                        if ( tA[i] != fOldVal ) {
                            nOldCount = i;
                            fOldVal = tA[i];
                        }
                    }
                    if ( tA[i] != fOldVal )
                        nOldCount = i;
                    if ( fNum == tA[i] )
                        fRes = nOldCount / (nSize - 1);
                    else {
                        if ( nOldCount == 0 ) {
                            fRes = 0.0;
                        }
                        else {
                            var fFract = ( fNum - tA[nOldCount - 1] ) /
                                ( tA[nOldCount] - tA[nOldCount - 1] );
                            fRes = ( nOldCount - 1 + fFract ) / (nSize - 1);
                        }
                    }
                    return fRes.toString().substr( 0, fRes.toString().indexOf( "." ) + 1 + k ) - 0;
                }
            }
        }

        oParser = new parserFormula( "PERCENTRANK({12,6,7,9,3,8},4)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), percentrank( [12, 6, 7, 9, 3, 8], 4 ) );

        oParser = new parserFormula( "PERCENTRANK({12,6,7,9,3,8},5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), percentrank( [12, 6, 7, 9, 3, 8], 5 ) );

    } )

    test( "Test: \"POISSON\"", function () {

        function poisson( x, l, cumulativeFlag ) {
            var _x = parseInt( x ), _l = l, f = cumulativeFlag;

            if ( f ) {
                var sum = 0;
                for ( var k = 0; k <= x; k++ ) {
                    sum += Math.pow( _l, k ) / Math.fact( k );
                }
                sum *= Math.exp( -_l );
                return toFixed( sum );
            }
            else {
                return toFixed( Math.exp( -_l ) * Math.pow( _l, _x ) / Math.fact( _x ) );
            }

        }

        oParser = new parserFormula( "POISSON(8,2,false)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), poisson( 8, 2, false ) );

        oParser = new parserFormula( "POISSON(8,2,true)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), poisson( 8, 2, true ) );

        oParser = new parserFormula( "POISSON(2.6,5,false)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), poisson( 2, 5, false ) );

        oParser = new parserFormula( "POISSON(2,5.7,true)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), poisson( 2, 5.7, true ) );

        oParser = new parserFormula( "POISSON(-6,5,true)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "POISSON(6,-5,false)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );
    } )

    test( "Test: \"PROB\"", function () {

        oParser = new parserFormula( "PROB({0,1,2,3},{0.2,0.3,0.1,0.4},2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 0.1 );

        oParser = new parserFormula( "PROB({0,1,2,3},{0.2,0.3,0.1,0.4},1,4)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 0.8 );

    } )

    test( "Test: \"PROB\"", function () {

        function quartile( A, k ) {

            var fFlag = k;

            A.sort( function ( a, b ) {
                return a - b;
            } )

            var nSize = A.length;
            if ( A.length < 1 || nSize == 0 )
                return "#N/A"
            else {
                if ( nSize == 1 )
                    return toFixed( A[0] );
                else {

                    if ( fFlag < 0.0 || fFlag > 4 )
                        return "#NUM!";
                    else if ( fFlag == 0.0 )
                        return toFixed( A[0] );
                    else if ( fFlag == 1.0 ) {
                        var nIndex = Math.floor( 0.25 * (nSize - 1) ),
                            fDiff = 0.25 * (nSize - 1) - Math.floor( 0.25 * (nSize - 1) );
                        if ( fDiff == 0.0 )
                            return toFixed( A[nIndex] );
                        else {
                            return toFixed( A[nIndex] +
                                fDiff * (A[nIndex + 1] - A[nIndex]) );
                        }
                    }
                    else if ( fFlag == 2.0 ) {
                        if ( nSize % 2 == 0 )
                            return toFixed( (A[nSize / 2 - 1] + A[nSize / 2]) / 2.0 );
                        else
                            return toFixed( A[(nSize - 1) / 2] );
                    }
                    else if ( fFlag == 3.0 ) {
                        var nIndex = Math.floor( 0.75 * (nSize - 1) ),
                            fDiff = 0.75 * (nSize - 1) - Math.floor( 0.75 * (nSize - 1) );
                        if ( fDiff == 0.0 )
                            return toFixed( A[nIndex] );
                        else {
                            return toFixed( A[nIndex] +
                                fDiff * (A[nIndex + 1] - A[nIndex]) );
                        }
                    }
                    else
                        return toFixed( A[nSize - 1] );

                }
            }

        }

        oParser = new parserFormula( "QUARTILE({1,2,4,7,8,9,10,12},-1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), quartile( [1, 2, 4, 7, 8, 9, 10, 12], -1 ) );

        oParser = new parserFormula( "QUARTILE({1,2,4,7,8,9,10,12},0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), quartile( [1, 2, 4, 7, 8, 9, 10, 12], 0 ) );

        oParser = new parserFormula( "QUARTILE({1,2,4,7,8,9,10,12},1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), quartile( [1, 2, 4, 7, 8, 9, 10, 12], 1 ) );

        oParser = new parserFormula( "QUARTILE({1,2,4,7,8,9,10,12},2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), quartile( [1, 2, 4, 7, 8, 9, 10, 12], 2 ) );

        oParser = new parserFormula( "QUARTILE({1,2,4,7,8,9,10,12},3)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), quartile( [1, 2, 4, 7, 8, 9, 10, 12], 3 ) );

        oParser = new parserFormula( "QUARTILE({1,2,4,7,8,9,10,12},4)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), quartile( [1, 2, 4, 7, 8, 9, 10, 12], 4 ) );

        oParser = new parserFormula( "QUARTILE({1,2,4,7,8,9,10,12},5)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), quartile( [1, 2, 4, 7, 8, 9, 10, 12], 5 ) );

    } )

    test( "Test: \"RSQ\"", function () {

        function rsq( x, y ) {

            var sumXDeltaYDelta = 0, sqrXDelta = 0, sqrYDelta = 0, _x = 0, _y = 0, xLength = 0;

            if ( x.length != y.length )
                return "#N/A"
            for ( var i = 0; i < x.length; i++ ) {

                _x += x[i]
                _y += y[i]
                xLength++;
            }

            _x /= xLength;
            _y /= xLength;

            for ( var i = 0; i < x.length; i++ ) {

                sumXDeltaYDelta += (x[i] - _x) * (y[i] - _y);
                sqrXDelta += (x[i] - _x) * (x[i] - _x);
                sqrYDelta += (y[i] - _y) * (y[i] - _y);

            }

            if ( sqrXDelta == 0 || sqrYDelta == 0 )
                return "#DIV/0!"
            else
                return toFixed( Math.pow( sumXDeltaYDelta / Math.sqrt( sqrXDelta * sqrYDelta ), 2 ) );
        }

        oParser = new parserFormula( "RSQ({9,7,5,3,1},{10,6,1,5,3})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), rsq( [9, 7, 5, 3, 1], [10, 6, 1, 5, 3] ) );

        oParser = new parserFormula( "RSQ({2,3,9,1,8,7,5},{6,5,11,7,5,4,4})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), rsq( [2, 3, 9, 1, 8, 7, 5], [6, 5, 11, 7, 5, 4, 4] ) );

    } )

    test( "Test: \"SKEW\"", function () {

        function skew( x ) {

            var sumSQRDeltaX = 0, _x = 0, xLength = 0, standDev = 0, sumSQRDeltaXDivstandDev = 0;
            for ( var i = 0; i < x.length; i++ ) {

                _x += x[i];
                xLength++;

            }

            if ( xLength <= 2 )
                return "#N/A"

            _x /= xLength;

            for ( var i = 0; i < x.length; i++ ) {

                sumSQRDeltaX += Math.pow( x[i] - _x, 2 );

            }

            standDev = Math.sqrt( sumSQRDeltaX / ( xLength - 1 ) );

            for ( var i = 0; i < x.length; i++ ) {

                sumSQRDeltaXDivstandDev += Math.pow( (x[i] - _x) / standDev, 3 );

            }

            return toFixed( xLength / (xLength - 1) / (xLength - 2) * sumSQRDeltaXDivstandDev )

        }

        oParser = new parserFormula( "SKEW(3,4,5,2,3,4,5,6,4,7)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), skew( [3, 4, 5, 2, 3, 4, 5, 6, 4, 7] ) );

        oParser = new parserFormula( "SKEW({2,3,9,1,8,7,5},{6,5,11,7,5,4,4})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), skew( [2, 3, 9, 1, 8, 7, 5, 6, 5, 11, 7, 5, 4, 4] ) );

    } )

    test( "Test: \"SMALL\"", function () {

        oParser = new parserFormula( "SMALL({3,5,3,5,4;4,2,4,6,7},3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3 );

        oParser = new parserFormula( "SMALL({3,5,3,5,4;4,2,4,6,7},7)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 5 );

    } )

    test( "Test: \"SLOPE\"", function () {

        function slope( y, x ) {

            var sumXDeltaYDelta = 0, sqrXDelta = 0, _x = 0, _y = 0, xLength = 0;

            if ( x.length != y.length )
                return "#N/A"
            for ( var i = 0; i < x.length; i++ ) {

                _x += x[i]
                _y += y[i]
                xLength++;
            }

            _x /= xLength;
            _y /= xLength;

            for ( var i = 0; i < x.length; i++ ) {

                sumXDeltaYDelta += (x[i] - _x) * (y[i] - _y);
                sqrXDelta += (x[i] - _x) * (x[i] - _x);

            }

            if ( sqrXDelta == 0 )
                return "#DIV/0!"
            else
                return toFixed( sumXDeltaYDelta / sqrXDelta );
        }

        oParser = new parserFormula( "SLOPE({9,7,5,3,1},{10,6,1,5,3})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), slope( [9, 7, 5, 3, 1], [10, 6, 1, 5, 3] ) );

        oParser = new parserFormula( "SLOPE({2,3,9,1,8,7,5},{6,5,11,7,5,4,4})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), slope( [2, 3, 9, 1, 8, 7, 5], [6, 5, 11, 7, 5, 4, 4] ) );

    } )

    test( "Test: \"STANDARDIZE\"", function () {

        function STANDARDIZE( x, mean, sigma ) {

            if ( sigma <= 0 )
                return "#NUM!"
            else
                return toFixed( (x - mean) / sigma );
        }

        oParser = new parserFormula( "STANDARDIZE(42,40,1.5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), STANDARDIZE( 42, 40, 1.5 ) );

        oParser = new parserFormula( "STANDARDIZE(22,12,2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), STANDARDIZE( 22, 12, 2 ) );

        oParser = new parserFormula( "STANDARDIZE(22,12,-2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), STANDARDIZE( 22, 12, -2 ) );

    } )

    test( "Test: \"STDEV\"", function () {

        function stdev() {
            var average = 0, res = 0;
            for ( var i = 0; i < arguments.length; i++ ) {
                average += arguments[i];
            }
            average /= arguments.length;
            for ( var i = 0; i < arguments.length; i++ ) {
                res += (arguments[i] - average) * (arguments[i] - average);
            }
            return toFixed( Math.sqrt( res / (arguments.length - 1) ) );
        }

        oParser = new parserFormula( "STDEV(123,134,143,173,112,109)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), stdev( 123, 134, 143, 173, 112, 109 ) );

        ws.getRange2( "E400" ).setValue( "\"123\"" );
        ws.getRange2( "E401" ).setValue( "134" );
        ws.getRange2( "E402" ).setValue( "143" );
        ws.getRange2( "E403" ).setValue( "173" );
        ws.getRange2( "E404" ).setValue( "112" );
        ws.getRange2( "E405" ).setValue( "109" );

        oParser = new parserFormula( "STDEV(E400:E405)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), stdev( 134, 143, 173, 112, 109 ) );

    } )

    test( "Test: \"STDEVA\"", function () {

        ws.getRange2( "E400" ).setValue( "\"123\"" );
        ws.getRange2( "E401" ).setValue( "134" );
        ws.getRange2( "E402" ).setValue( "143" );
        ws.getRange2( "E403" ).setValue( "173" );
        ws.getRange2( "E404" ).setValue( "112" );
        ws.getRange2( "E405" ).setValue( "109" );


        function stdeva() {
            var average = 0, res = 0;
            for ( var i = 0; i < arguments.length; i++ ) {
                average += arguments[i];
            }
            average /= arguments.length;
            for ( var i = 0; i < arguments.length; i++ ) {
                res += (arguments[i] - average) * (arguments[i] - average);
            }
            return toFixed( Math.sqrt( res / (arguments.length - 1) ) );
        }

        oParser = new parserFormula( "STDEVA(123,134,143,173,112,109)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), stdeva( 123, 134, 143, 173, 112, 109 ) );

        oParser = new parserFormula( "STDEVA(123,134,143,173,112,109)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), stdeva( 123, 134, 143, 173, 112, 109 ) );

    } )

    test( "Test: \"VAR\"", function () {

        function _var( x ) {

            var sumSQRDeltaX = 0, _x = 0, xLength = 0, standDev = 0, sumSQRDeltaXDivstandDev = 0;
            for ( var i = 0; i < x.length; i++ ) {
                _x += x[i];
                xLength++;
            }

            _x /= xLength;

            for ( var i = 0; i < x.length; i++ ) {
                sumSQRDeltaX += Math.pow( x[i] - _x, 2 );
            }

            return toFixed( sumSQRDeltaX / (xLength - 1) )

        }

        oParser = new parserFormula( "VAR(10.5,12.4,19.4,23.2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), _var( [10.5, 12.4, 19.4, 23.2] ) );

        oParser = new parserFormula( "VAR(10.5,{12.4,19.4},23.2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), _var( [10.5, 12.4, 19.4, 23.2] ) );

        oParser = new parserFormula( "VAR(10.5,12.4,19.4)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), _var( [10.5, 12.4, 19.4] ) );

    } )
} );
