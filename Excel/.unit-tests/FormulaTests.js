$(function () {
	
	var ver = 2;

	var oParser, wb, ws, date1, date2, dif = 1e-9,
		data = getTestWorkbook(),
		sData = data + "";
	if( c_oSerFormat.Signature === sData.substring(0, c_oSerFormat.Signature.length))
	{
		var sUrlPath = "offlinedocs/";
		var wb = new Workbook(sUrlPath, new Asc.asc_CHandlersList(),null);
		wb.initGlobalObjects();
		var oBinaryFileReader = new BinaryFileReader(sUrlPath);
		oBinaryFileReader.Read(sData, wb);
	}
	ws = wb.getWorksheet(wb.getActive());
		
	QUnit.log(function( details ) {
		console.log( "Log: " + details.name + ", result - " + details.result );
	});

	module("Formula");
	
	test("Test: \"Absolute reference\"",function(){
	
		ws.getRange2("A7").setValue("1");
		ws.getRange2("A8").setValue("2");
		ws.getRange2("A9").setValue("3");
		oParser = new parserFormula('A$7+A8',"A1",ws);
		ok(oParser.parse());
        strictEqual(oParser.calculate().getValue(),3);
		
		oParser = new parserFormula('A$7+A$8',"A1",ws);
		ok(oParser.parse());
        strictEqual(oParser.calculate().getValue(),3);
		
		oParser = new parserFormula('$A$7+$A$8',"A1",ws);
		ok(oParser.parse());
        strictEqual(oParser.calculate().getValue(),3);
		
		oParser = new parserFormula('SUM($A$7:$A$9)',"A1",ws);
		ok(oParser.parse());
        strictEqual(oParser.calculate().getValue(),6);
	})
	
	
	test("Test: \"1+3\"",function(){
		oParser = new parserFormula('1+3',"A1",ws);
		ok(oParser.parse());
        strictEqual(oParser.calculate().getValue(),4);
	})
	
	test("Test: \"(1+2)*4+3\"",function(){
		oParser = new parserFormula('(1+2)*4+3',"A1",ws);
		ok(oParser.parse());
        strictEqual(oParser.calculate().getValue(), (1+2)*4+3);
	})
	
    test("Test: \"2^52\"",function(){
		oParser = new parserFormula('2^52',"A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), Math.pow(2,52) );
    })

	test("Test: \"-10\"",function(){
		oParser = new parserFormula('-10',"A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), -10);
	})
	
	test("Test: \"-10*2\"",function (){
		oParser = new parserFormula('-10*2',"A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), -20 );
	})
	
	test("Test: \"-10+10\"",function(){
		oParser = new parserFormula('-10+10',"A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 0 );
	})
	
	test("Test: \"12%\"",function(){
		oParser = new parserFormula('12%',"A1",ws);
		ok(oParser.parse());
		strictEqual( oParser.calculate().getValue(), 0.12 );
	})
	
	test("Test: \"SIN have wrong arguments count\"",function(){
		oParser = new parserFormula('SIN(3.1415926,3.1415926*2)',"A1",ws);
		ok(!oParser.parse());
	})
	
	test("Test: \"sin(3.1415926)\"",function(){
		oParser = new parserFormula('SIN(3.1415926)',"A1",ws);
		ok(oParser.parse());
		strictEqual( oParser.calculate().getValue(), parseFloat(Math.sin(3.1415926).toFixed(15)) );
	})
	
	test("Test: \"COS(PI()/2)\"",function(){
		oParser = new parserFormula('COS(PI()/2)',"A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), parseFloat(Math.cos(Math.PI/2).toFixed(15)) );	
	})

	test("Test: \"SUM(1,2,3)\"",function(){
		oParser = new parserFormula('SUM(1,2,3)',"A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 1+2+3);	
	})

	test("Test: \"-\"12\"+2\"",function(){
		oParser = new parserFormula("-\"12\"+2","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), -10);
	})

	test("Test: \"-TRUE\"",function(){
		oParser = new parserFormula("-TRUE","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), -1);
	})
	
	test("Test: \"\"s\"&5\"",function(){
		oParser = new parserFormula("\"s\"&5","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "s5");	
	})
	
	test("Test: \"2<>\"3\"\"", function(){
		oParser = new parserFormula("2<>\"3\"","A1",ws);
		ok(oParser.parse());
		strictEqual(oParser.calculate().getValue(),"TRUE","2<>\"3\"")
	})
	
	test("Test: \"2=\"3\"\" & \"2>\"3\"\"",function(){
		oParser = new parserFormula("2=\"3\"","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "FALSE", "2=\"3\"" );

		oParser = new parserFormula("2>\"3\"","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "FALSE", "2>\"3\"");
	})
	
	test("Test: \"\"f\">\"3\"\" & \"\"f\">\"3\"\"",function(){
		oParser = new parserFormula("\"f\">\"3\"","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "TRUE" );
		
		oParser = new parserFormula("\"f\"<\"3\"","A1",ws);
		ok(oParser.parse());
        strictEqual( "FALSE", oParser.calculate().getValue(), "FALSE");
	})
	
	test("Test: \"FALSE>=FALSE\"",function(){
		oParser = new parserFormula("FALSE>=FALSE","A1",ws);
		ok(oParser.parse());
        strictEqual(oParser.calculate().getValue(), "TRUE" );
	})

	test("Test: \"\"TRUE\"&\"TRUE\"\"",function(){
		oParser = new parserFormula("\"TRUE\"&\"TRUE\"","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "TRUETRUE");	
	})
	
	test("Test: \"10*\"\"\"",function(){
		oParser = new parserFormula("10*\"\"","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );
	})

	test("Test: \"POWER(2,8)\"",function(){
		oParser = new parserFormula("POWER(2,8)","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), Math.pow(2,8));
	})
	
	test("Test: \"POWER(0,-3)\"",function(){
		oParser = new parserFormula("POWER(0,-3)","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "#DIV/0!");
	})

	test("Test: \"ISNA(A1)\"",function(){
		var r = ws.getRange2("K1");
		ws.getRange2("A1").setValue("#N/A");
		r.setValue("=ISNA(A1)");
		strictEqual( ws.getCell2("K1").getCells()[0].getValue(), "TRUE");
	})
	
	test("Test: \"ROUNDUP(31415.92654;-2)\"",function(){
		oParser = new parserFormula("ROUNDUP(31415.92654;-2)","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 31500);
	})
	
	test("Test: \"ROUNDUP(3.2;0)\"",function(){
		oParser = new parserFormula("ROUNDUP(3.2;0)","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 4);
	})
	
	test("Test: \"ROUNDUP(-3.14159;1)\"",function(){
		oParser = new parserFormula("ROUNDUP(-3.14159;1)","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), -3.2);
	})
	
	test("Test: \"ROUNDUP(3.14159;3)\"",function(){
		oParser = new parserFormula("ROUNDUP(3.14159;3)","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 3.142);
	})
	
	test("Test: \"ROUNDDOWN(31415.92654;-2)\"",function(){
		oParser = new parserFormula("ROUNDDOWN(31415.92654;-2)","A1",ws);
		ok(oParser.parse());
        strictEqual(oParser.calculate().getValue(), 31400);
	})

	test("Test: \"ROUNDDOWN(-3.14159;1)\"",function(){
		oParser = new parserFormula("ROUNDDOWN(-3.14159;1)","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), -3.1);
	})	
	
	test("Test: \"ROUNDDOWN(3.14159;3)\"",function(){
		oParser = new parserFormula("ROUNDDOWN(3.14159;3)","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 3.141);
	})
	
	test("Test: \"ROUNDDOWN(3.2;0)\"",function(){
		oParser = new parserFormula("ROUNDDOWN(3.2;0)","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 3);
	})
  
  	test("Test: \"MROUND(10;3)\"",function(){
		oParser = new parserFormula("MROUND(10;3)","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 9);
	})
	
  	test("Test: \"MROUND(-10;-3)\"",function(){
		oParser = new parserFormula("MROUND(-10;-3)","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(),-9);
	})
	
  	test("Test: \"MROUND(1.3;0.2)\"",function(){
		oParser = new parserFormula("MROUND(1.3;0.2)","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 1.4);
	})
	
	test("Test: \"T(\"HELLO\")\"",function(){
		oParser = new parserFormula("T(\"HELLO\")","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "HELLO");
	})
	
	test("Test: \"T(123)\"",function(){
		oParser = new parserFormula("T(123)","A1",ws);
		ok(oParser.parse());
        ok( !oParser.calculate().getValue(), "123");
	})
	
	test("Test: YEAR",function(){
		oParser = new parserFormula("YEAR(2013)","A1",ws);
		ok(oParser.parse());
		if( g_bDate1904 )
			strictEqual( oParser.calculate().getValue(), 1909);
		else
			strictEqual( oParser.calculate().getValue(), 1905);
	})
	
	test("Test: DAY",function(){
		oParser = new parserFormula("DAY(2013)","A1",ws);
		ok(oParser.parse());
		if( g_bDate1904 )
			strictEqual( oParser.calculate().getValue(), 6);
		else
			strictEqual( oParser.calculate().getValue(), 5);
	})
	
	test("Test: DAY 2",function(){
		oParser = new parserFormula("DAY(\"20 may 2045\")","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 20);
	})
	
	test("Test: MONTH",function(){
		oParser = new parserFormula("MONTH(2013)","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 7);
	})
	
	test("Test: \"10-3\"",function(){
		oParser = new parserFormula("10-3","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 7);
	})

	test("Test: \"SUM\"",function(){
		oParser = new parserFormula("SUM(S5:T5)","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 0);
	})
	
	test("Test: \"MAX\"",function(){
		oParser = new parserFormula("MAX(S5:T5)","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 0);
	})

	test("Test: \"MAXA\"",function(){
		oParser = new parserFormula("MAXA(S5:T5)","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 0);
	})

	test("Test: \"MIN\"",function(){
		oParser = new parserFormula("MIN(S5:T5)","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 0);
	})	
	
	test("Test: \"MINA\"",function(){
		oParser = new parserFormula("MINA(S5:T5)","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 0);
	})
	
	test("Test: SUM(S7:S9,{1,2,3})",function(){
		ws.getRange2("S7").setValue("1");
		ws.getRange2("S8").setValue("2");
		ws.getRange2("S9").setValue("3");
		ws.getRange2("S10").setValue("=SUM(S7:S9,{1,2,3})");
		strictEqual( ws.getCell2("S10").getCells()[0].getValue(), "12");
	})

	test("Test: ISREF",function(){
		oParser = new parserFormula("ISREF(G0)","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "FALSE");
	})
	
	test("Test: MOD",function(){
		oParser = new parserFormula("MOD(7,3)","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 1);
	})
	
	test("Test: rename sheet #1",function(){
		oParser = new parserFormula("Лист2!A2","A1",ws);
		ok(oParser.parse() === true);
		// strictEqual( oParser.parse(), true)
        strictEqual( oParser.changeSheet("Лист2","Лист3").assemble(), "Лист3!A2");
	})
	
	test("Test: rename sheet #2",function(){
		oParser = new parserFormula("Лист2:Лист3!A2","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.changeSheet("Лист2","Лист1").assemble(), "Лист1:Лист3!A2");
	})
	
	test("Test: rename sheet #3",function(){
		oParser = new parserFormula("Лист2!A2:A5","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.changeSheet("Лист2","Лист3").assemble(), "Лист3!A2:A5");
	})
	
	test("Test: rename sheet #4",function(){
		ws = wb.getWorksheetById(1);
		ws.getRange2("S95").setValue("2");
		ws = wb.getWorksheetById(2);
		ws.getRange2("S100").setValue("="+wb.getWorksheetById(1).getName()+"!S95");
		strictEqual( ws.getCell2("S100").getCells()[0].getValue(), "2");
		
		wb.getWorksheetById(1).setName("ЛистTEMP");
		
		strictEqual( ws.getCell2("S100").getCells()[0].getFormula(), wb.getWorksheetById(1).getName()+"!S95", ws.getCell2("S100").getCells()[0].getFormula() + " " + wb.getWorksheetById(1).getName()+"!S95");
		
	})
	
	test("Test: wrong ref",function(){
		oParser = new parserFormula("1+XXX1","A1",ws);
		ok(oParser.parse());
        notStrictEqual( oParser.calculate().getValue(), "1");
	})
	
	test("Test: \"CODE\"",function(){
		oParser = new parserFormula("CODE(\"abc\")","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 97);
	})
	
	test("Test: \"CHAR\"",function(){
		oParser = new parserFormula("CHAR(97)","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "a");
	})
	
	test("Test: \"CHAR(CODE())\"",function(){
		oParser = new parserFormula("CHAR(CODE(\"A\"))","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "A");
	})
	
	test("Test: \"PROPER\"",function(){
		oParser = new parserFormula("PROPER(\"2-cent's worth\")","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "2-Cent'S Worth");
		oParser = new parserFormula("PROPER(\"76BudGet\")","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "76Budget");
		oParser = new parserFormula("PROPER(\"this is a TITLE\")","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "This Is A Title");
	})
	
	test("Test: \"GCD\"",function(){
		oParser = new parserFormula("GCD(10,100,50)","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 10);
		oParser = new parserFormula("GCD(24.6,36.2)","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 12);
		oParser = new parserFormula("GCD(-1,39,52)","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "#NUM!");
	})

	test("Test: \"FIXED\"",function(){
		oParser = new parserFormula("FIXED(1234567,-3)","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "1,235,000");
		oParser = new parserFormula("FIXED(.555555,10)","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "0.5555550000");
		oParser = new parserFormula("FIXED(1234567.555555,4,TRUE)","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "1234567.5556");
		oParser = new parserFormula("FIXED(1234567)","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "1,234,567");
	})

	test("Test: \"COUNTIF\"",function(){

		ws.getRange2("A7").setValue("3");
		ws.getRange2("B7").setValue("10");
		ws.getRange2("C7").setValue("7");
		ws.getRange2("D7").setValue("10");
		
		ws.getRange2("A8").setValue("apples");
		ws.getRange2("B8").setValue("oranges");
		ws.getRange2("C8").setValue("grapes");
		ws.getRange2("D8").setValue("melons");
	
	
		oParser = new parserFormula("COUNTIF(A7:D7,\"=10\")","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 2);

		oParser = new parserFormula("COUNTIF(A7:D7,\">5\")","B1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 3);
		
		oParser = new parserFormula("COUNTIF(A7:D7,\"<>10\")","C1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 2);

		oParser = new parserFormula("COUNTIF(A8:D8,\"*es\")","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 3);
		
		oParser = new parserFormula("COUNTIF(A8:D8,\"??a*\")","B2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 2);
		
		oParser = new parserFormula("COUNTIF(A8:D8,\"*l*\")","C2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 2);
		
	})
	
	test("Test: \"REPLACE\"",function(){

		oParser = new parserFormula("REPLACE(\"abcdefghijk\",3,4,\"XY\")","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "abXYghijk");
		
		oParser = new parserFormula("REPLACE(\"abcdefghijk\",3,1,\"12345\")","B2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "ab12345defghijk");
		
		oParser = new parserFormula("REPLACE(\"abcdefghijk\",15,4,\"XY\")","C2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "abcdefghijkXY");
		
	})
	
	test("Test: \"SEARCH\"",function(){

		oParser = new parserFormula("SEARCH(\"de\",\"abcdEF\")","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 4);
		
		oParser = new parserFormula("SEARCH(\"?c*e\",\"abcdEF\")","B2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 2);
		
		oParser = new parserFormula("SEARCH(\"de\",\"dEFabcdEF\",3)","C2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 7);
		
		oParser = new parserFormula("SEARCH(\"de\",\"dEFabcdEF\",30)","C2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "#VALUE!");
		
	})

	test("Test: \"SUBSTITUTE\"",function(){

		oParser = new parserFormula("SUBSTITUTE(\"abcaAabca\",\"a\",\"xx\")","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "xxbcxxAxxbcxx");
		
		oParser = new parserFormula("SUBSTITUTE(\"abcaaabca\",\"a\",\"xx\")","B2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "xxbcxxxxxxbcxx");
		
		oParser = new parserFormula("SUBSTITUTE(\"abcaaabca\",\"a\",\"\",10)","C2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "bcbc");
		
		oParser = new parserFormula("SUBSTITUTE(\"abcaaabca\",\"a\",\"xx\",3)","C2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "abcaxxabca");
		
	})

	test("Test: \"TRIM\"",function(){
	
		oParser = new parserFormula("TRIM(\"     abc         def      \")","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "abc def");
		
	})
	
	test("Test: \"DOLLAR\"",function(){
	
		oParser = new parserFormula("DOLLAR(1234.567)","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "$1,234.57");
		
		oParser = new parserFormula("DOLLAR(1234.567,-2)","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "$1,200");
		
		oParser = new parserFormula("DOLLAR(-1234.567,4)","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "$-1,234.5670");
		
	})

	test("Test: \"VALUE\"",function(){
	
		oParser = new parserFormula("VALUE(\"123.456\")","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 123.456);
		
		oParser = new parserFormula("VALUE(\"$1,000\")","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "#VALUE!");
		
		oParser = new parserFormula("VALUE(\"23-Mar-2002\")","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 37338);
		
		oParser = new parserFormula("VALUE(\"03-26-2006\")","A2",ws);
		ok(oParser.parse());
        
		if( g_bDate1904 )
			strictEqual( oParser.calculate().getValue(), 37340);
		else
			strictEqual( oParser.calculate().getValue(), 38802);
		
		oParser = new parserFormula("VALUE(\"16:48:00\")-VALUE(\"12:17:12\")","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 0.188055555555556);
		
	})

	test("Test: \"DATEVALUE\"",function(){
	
		oParser = new parserFormula("DATEVALUE(\"10-10-2010 10:26\")","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 40461);
		
		oParser = new parserFormula("DATEVALUE(\"10-10-2010 10:26\")","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 40461);
		
		ws.getRange2("A7").setValue("3-Mar");
		oParser = new parserFormula("DATEVALUE(A7)","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 41336);
		
		oParser = new parserFormula("DATEVALUE(\"$1,000\")","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "#VALUE!");
		
		oParser = new parserFormula("DATEVALUE(\"23-Mar-2002\")","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 37338);
		
		oParser = new parserFormula("DATEVALUE(\"03-26-2006\")","A2",ws);
		ok(oParser.parse());
        
		if( g_bDate1904 )
			strictEqual( oParser.calculate().getValue(), 37340);
		else
			strictEqual( oParser.calculate().getValue(), 38802);
	})

	test("Test: \"EDATE\"",function(){
	
		if( !g_bDate1904 ){
			oParser = new parserFormula("EDATE(DATE(2006,1,31),5)","A2",ws);
			ok(oParser.parse());
			strictEqual( oParser.calculate().getValue(), 38898);
			
			oParser = new parserFormula("EDATE(DATE(2004,2,29),12)","A2",ws);
			ok(oParser.parse());
			strictEqual( oParser.calculate().getValue(), 38411);
			
			ws.getRange2("A7").setValue("02-28-2004");
			oParser = new parserFormula("EDATE(A7,12)","A2",ws);
			ok(oParser.parse());
			strictEqual( oParser.calculate().getValue(), 38411);
			
			oParser = new parserFormula("EDATE(DATE(2004,1,15),-23)","A2",ws);
			ok(oParser.parse());
			strictEqual( oParser.calculate().getValue(), 37302);
        }
		else{
			oParser = new parserFormula("EDATE(DATE(2006,1,31),5)","A2",ws);
			ok(oParser.parse());
			strictEqual( oParser.calculate().getValue(), 37436);
			
			oParser = new parserFormula("EDATE(DATE(2004,2,29),12)","A2",ws);
			ok(oParser.parse());
			strictEqual( oParser.calculate().getValue(), 36949);
			
			ws.getRange2("A7").setValue("02-28-2004");
			oParser = new parserFormula("EDATE(A7,12)","A2",ws);
			ok(oParser.parse());
			strictEqual( oParser.calculate().getValue(), 36949);
			
			oParser = new parserFormula("EDATE(DATE(2004,1,15),-23)","A2",ws);
			ok(oParser.parse());
			strictEqual( oParser.calculate().getValue(), 35840);
		}
	})

	test("Test: \"EOMONTH\"",function(){
	
		if( !g_bDate1904 ){
			oParser = new parserFormula("EOMONTH(DATE(2006,1,31),5)","A2",ws);
			ok(oParser.parse());
			strictEqual( oParser.calculate().getValue(), 38898);
			
			oParser = new parserFormula("EOMONTH(DATE(2004,2,29),12)","A2",ws);
			ok(oParser.parse());
			strictEqual( oParser.calculate().getValue(), 38411);
			
			ws.getRange2("A7").setValue("02-28-2004");
			oParser = new parserFormula("EOMONTH(A7,12)","A2",ws);
			ok(oParser.parse());
			strictEqual( oParser.calculate().getValue(), 38411);
			
			oParser = new parserFormula("EOMONTH(DATE(2004,1,15),-23)","A2",ws);
			ok(oParser.parse());
			strictEqual( oParser.calculate().getValue(), 37315);
        }
		else{
			oParser = new parserFormula("EOMONTH(DATE(2006,1,31),5)","A2",ws);
			ok(oParser.parse());
			strictEqual( oParser.calculate().getValue(), 37436);
			
			oParser = new parserFormula("EOMONTH(DATE(2004,2,29),12)","A2",ws);
			ok(oParser.parse());
			strictEqual( oParser.calculate().getValue(), 36949);
			
			ws.getRange2("A7").setValue("02-28-2004");
			oParser = new parserFormula("EOMONTH(A7,12)","A2",ws);
			ok(oParser.parse());
			strictEqual( oParser.calculate().getValue(), 36949);
			
			oParser = new parserFormula("EOMONTH(DATE(2004,1,15),-23)","A2",ws);
			ok(oParser.parse());
			strictEqual( oParser.calculate().getValue(), 35853);
		}
	})

	test("Test: \"NETWORKDAYS\"",function(){
	
		oParser = new parserFormula("NETWORKDAYS(DATE(2006,1,1),DATE(2006,1,31))","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 22);
		
		oParser = new parserFormula("NETWORKDAYS(DATE(2006,1,31),DATE(2006,1,1))","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), -22);
		
		oParser = new parserFormula("NETWORKDAYS(DATE(2006,1,1),DATE(2006,2,1),{\"01-02-2006\",\"01-16-2006\"})","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 21);

	})

	test("Test: \"PV\"",function(){
	
		oParser = new parserFormula("PV(0.08/12,12*20,500,,0)","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), -59777.14585118638 );
		
		oParser = new parserFormula("PV(0,12*20,500,,0)","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), -120000 );
		
	})

	test("Test: \"NPV\"",function(){
	
		oParser = new parserFormula("NPV(0.1,-10000,3000,4200,6800)","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 1188.4434123352216 );
		
	})

	test("Test: \"SUMIF\"",function(){
	
		ws.getRange2("A2").setValue("100000");
		ws.getRange2("A3").setValue("200000");
		ws.getRange2("A4").setValue("300000");
		ws.getRange2("A5").setValue("400000");
		
		ws.getRange2("B2").setValue("7000");
		ws.getRange2("B3").setValue("14000");
		ws.getRange2("B4").setValue("21000");
		ws.getRange2("B5").setValue("28000");
		
		ws.getRange2("C2").setValue("250000");
		
		oParser = new parserFormula("SUMIF(A2:A5,\">160000\",B2:B5)","A7",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 63000 );
		
		oParser = new parserFormula("SUMIF(A2:A5,\">160000\")","A8",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 900000 );
		
		oParser = new parserFormula("SUMIF(A2:A5,300000,B2:B5)","A9",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 21000 );
		
		oParser = new parserFormula("SUMIF(A2:A5,\">\" & C2,B2:B5)","A10",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 49000 );
		
		
		ws.getRange2("A12").setValue("Vegetables");
		ws.getRange2("A13").setValue("Vegetables");
		ws.getRange2("A14").setValue("Fruits");
		ws.getRange2("A15").setValue("");
		ws.getRange2("A16").setValue("Vegetables");
		ws.getRange2("A17").setValue("Fruits");
		
		ws.getRange2("B12").setValue("Tomatoes");
		ws.getRange2("B13").setValue("Celery");
		ws.getRange2("B14").setValue("Oranges");
		ws.getRange2("B15").setValue("Butter");
		ws.getRange2("B16").setValue("Carrots");
		ws.getRange2("B17").setValue("Apples");
		
		ws.getRange2("C12").setValue("2300");
		ws.getRange2("C13").setValue("5500");
		ws.getRange2("C14").setValue("800");
		ws.getRange2("C15").setValue("400");
		ws.getRange2("C16").setValue("4200");
		ws.getRange2("C17").setValue("1200");
		
		oParser = new parserFormula("SUMIF(A12:A17,\"Fruits\",C12:C17)","A19",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 2000 );
		
		oParser = new parserFormula("SUMIF(A12:A17,\"Vegetables\",C12:C17)","A20",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 12000 );
		
		oParser = new parserFormula("SUMIF(B12:B17,\"*es\",C12:C17)","A21",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 4300 );
		
		oParser = new parserFormula("SUMIF(A12:A17,\"\",C12:C17)","A22",ws);
		ok(oParser.parse());
        notEqual( oParser.calculate().getValue(), 400 );
		
	})

	test("Test: \"TEXT\"",function(){
		
		wb.dependencyFormulas = new DependencyGraph(wb);
		
		oParser = new parserFormula("TEXT(1234.567,\"$0.00\")","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "$1234.57" );	
		
		oParser = new parserFormula("TEXT(0.125,\"0.0%\")","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), "12.5%" );	
		
	})

	test("Test: \"WORKDAY\"",function(){
		
		wb.dependencyFormulas = new DependencyGraph(wb);
		
		oParser = new parserFormula("WORKDAY(DATE(2006,1,1),0)","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 38718 );
		
		oParser = new parserFormula("WORKDAY(DATE(2006,1,1),10)","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 38730 );
		
		oParser = new parserFormula("WORKDAY(DATE(2006,1,1),-10)","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 38705 );
		
		oParser = new parserFormula("WORKDAY(DATE(2006,1,1),20,{\"1-2-2006\",\"1-16-2006\"})","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 38748 );
		
	})

	test("Test: \"FV\"",function(){
	
		function fv( rate, nper, pmt, pv, type ){
			var res;
			if( type === undefined || type === null )
				type = 0;
			
			if( pv === undefined || pv === null )
				pv = 0;
			
			if( rate != 0 ){
				res = -1 * ( pv * Math.pow( 1 + rate, nper ) + pmt * ( 1 + rate * type ) * ( Math.pow( 1 + rate ,nper ) - 1) / rate );
			}
			else{
				res = -1 * ( pv + pmt * nper );
			}
			return res;
		}
	
		oParser = new parserFormula("FV(0.06/12,10,-200,-500,1)","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), fv(0.06/12,10,-200,-500,1) );
		
		oParser = new parserFormula("FV(0.12/12,12,-1000)","A2",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), fv(0.12/12,12,-1000) );
		
		oParser = new parserFormula("FV(0.11/12,35,-2000,,1)","A2",ws);
		ok(oParser.parse());
        ok( Math.abs(oParser.calculate().getValue() - fv(0.11/12,35,-2000,null,1)) < dif );
		
		oParser = new parserFormula("FV(0.06/12,12,-100,-1000,1)","A2",ws);
		ok(oParser.parse());
        ok( Math.abs(oParser.calculate().getValue() - fv(0.06/12,12,-100,-1000,1)) < dif );
		
	})
	
	test("Test: \"STDEV\"",function(){
	
		function stdev(){
			var average = 0, sum = 0, res = 0; 
			for( var i = 0; i < arguments.length; i++){
				average += arguments[i] / arguments.length;
			}
			for( var i = 0; i < arguments.length; i++){
				res += (arguments[i] - average)*(arguments[i] - average);
			}
			return Math.sqrt(res / (arguments.length - 1));
		}
	
		oParser = new parserFormula("STDEV(123,134,143,173,112,109)","A2",ws);
		ok(oParser.parse());
        ok( Math.abs(oParser.calculate().getValue() - stdev(123,134,143,173,112,109)) < dif );
		
	})
	
	test("Test: \"PMT\"",function(){
	
		function pmt( rate, nper, pv, fv, type ){
			var res;
			if( type === undefined || type === null )
				type = 0;
			
			if( fv === undefined || fv === null )
				fv = 0;
			
			if( rate != 0 ){
				res = -1*( pv * Math.pow( 1 + rate, nper ) + fv ) / 
					( ( 1 + rate * type ) * ( Math.pow( 1 + rate, nper ) - 1 ) / rate );
			}
			else{
				res = -1*( pv + fv )/ nper;
			}
			return res;
		}
		
		oParser = new parserFormula("PMT(0.08/12,10,10000)","A2",ws);
		ok(oParser.parse());
        ok( Math.abs(oParser.calculate().getValue() - pmt(0.08/12,10,10000)) < dif );
		
		oParser = new parserFormula("PMT(0.08/12,10,10000,0,1)","A2",ws);
		ok(oParser.parse());
        ok( Math.abs(oParser.calculate().getValue() - pmt(0.08/12,10,10000,0,1)) < dif );
		
	})

    test("Test: \"TIMEVALUE\"",function(){
        oParser = new parserFormula("timevalue(\"10:02:34\")","A2",ws);
        ok(oParser.parse());
        ok( Math.abs(oParser.calculate().getValue() - 0.4184490740740740) < dif );

        oParser = new parserFormula("timevalue(\"02-01-2006 10:15:29 AM\")","A2",ws);
        ok(oParser.parse());
        ok( Math.abs(oParser.calculate().getValue() - 0.4274189814823330) < dif );

        oParser = new parserFormula("timevalue(\"22:02\")","A2",ws);
        ok(oParser.parse());
        ok( Math.abs(oParser.calculate().getValue() - 0.9180555555555560) < dif );
    })

    test("Test: \"DAYS360\"",function(){

        oParser = new parserFormula("DAYS360(DATE(2002,2,3),DATE(2005,5,31))","A2",ws);
        ok(oParser.parse());
        strictEqual(oParser.calculate().getValue(), 1198);

        oParser = new parserFormula("DAYS360(DATE(2005,5,31),DATE(2002,2,3))","A2",ws);
        ok(oParser.parse());
        strictEqual(oParser.calculate().getValue(), -1197);

        oParser = new parserFormula("DAYS360(DATE(2002,2,3),DATE(2005,5,31),FALSE)","A2",ws);
        ok(oParser.parse());
        strictEqual(oParser.calculate().getValue(), 1198);

        oParser = new parserFormula("DAYS360(DATE(2002,2,3),DATE(2005,5,31),TRUE)","A2",ws);
        ok(oParser.parse());
        strictEqual(oParser.calculate().getValue(), 1197);

    })

    test("Test: \"WEEKNUM\"",function(){
        oParser = new parserFormula("WEEKNUM(DATE(2006,1,1))","A2",ws);
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 1);

        oParser = new parserFormula("WEEKNUM(DATE(2006,1,1),17)","A2",ws);
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 1);

        oParser = new parserFormula("WEEKNUM(DATE(2006,1,1),1)","A2",ws);
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 1);

        oParser = new parserFormula("WEEKNUM(DATE(2006,1,1),21)","A2",ws);
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 52);

        oParser = new parserFormula("WEEKNUM(DATE(2006,2,1),1)","A2",ws);
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 5);

        oParser = new parserFormula("WEEKNUM(DATE(2006,2,1),2)","A2",ws);
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 6);

        oParser = new parserFormula("WEEKNUM(DATE(2006,2,1),11)","A2",ws);
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 6);

        oParser = new parserFormula("WEEKNUM(DATE(2007,1,1),15)","A2",ws);//понед
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 1);

        oParser = new parserFormula("WEEKNUM(DATE(2008,1,1),15)","A2",ws);//втор
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 1);

        oParser = new parserFormula("WEEKNUM(DATE(2003,1,1),15)","A2",ws);//сред
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 1);

        oParser = new parserFormula("WEEKNUM(DATE(2009,1,1),15)","A2",ws);//чет
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 1);

        oParser = new parserFormula("WEEKNUM(DATE(2010,1,1),15)","A2",ws);//пят
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 1);

        oParser = new parserFormula("WEEKNUM(DATE(2011,1,1),15)","A2",ws);//суб
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 1);

        oParser = new parserFormula("WEEKNUM(DATE(2012,1,1),11)","A2",ws);//вск
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 1);

        oParser = new parserFormula("WEEKNUM(DATE(2008,1,4),11)","A2",ws);
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 1);

        oParser = new parserFormula("WEEKNUM(DATE(2008,1,10),11)","A2",ws);
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 2);

        oParser = new parserFormula("WEEKNUM(DATE(2008,1,11),11)","A2",ws);
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 2);

        oParser = new parserFormula("WEEKNUM(DATE(2008,1,17),11)","A2",ws);
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 3);

        oParser = new parserFormula("WEEKNUM(DATE(2008,1,18),11)","A2",ws);
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 3);

        oParser = new parserFormula("WEEKNUM(DATE(2008,1,24),11)","A2",ws);
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 4);

        oParser = new parserFormula("WEEKNUM(DATE(2013,1,1),21)","A2",ws);
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 1);

        oParser = new parserFormula("WEEKNUM(DATE(2013,1,7))","A2",ws);
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 2);

    })

    test("Test: \"YEARFRAC\"",function(){
        function okWrapper(a,b){
            ok( Math.abs(a - b) < dif );
        }
        oParser = new parserFormula("YEARFRAC(DATE(2006,1,1),DATE(2006,3,26))","A2",ws);
        ok(oParser.parse());
        okWrapper( oParser.calculate().getValue(), 0.236111111);

        oParser = new parserFormula("YEARFRAC(DATE(2006,3,26),DATE(2006,1,1))","A2",ws);
        ok(oParser.parse());
        okWrapper( oParser.calculate().getValue(), 0.236111111);

        oParser = new parserFormula("YEARFRAC(DATE(2006,1,1),DATE(2006,7,1))","A2",ws);
        ok(oParser.parse());
        okWrapper( oParser.calculate().getValue(), 0.5);

        oParser = new parserFormula("YEARFRAC(DATE(2006,1,1),DATE(2007,9,1))","A2",ws);
        ok(oParser.parse());
        okWrapper( oParser.calculate().getValue(), 1.666666667);

        oParser = new parserFormula("YEARFRAC(DATE(2006,1,1),DATE(2006,7,1),0)","A2",ws);
        ok(oParser.parse());
        okWrapper( oParser.calculate().getValue(), 0.5);

        oParser = new parserFormula("YEARFRAC(DATE(2006,1,1),DATE(2006,7,1),1)","A2",ws);
        ok(oParser.parse());
        okWrapper( oParser.calculate().getValue(), 0.495890411);

        oParser = new parserFormula("YEARFRAC(DATE(2006,1,1),DATE(2006,7,1),2)","A2",ws);
        ok(oParser.parse());
        okWrapper( oParser.calculate().getValue(), 0.502777778);

        oParser = new parserFormula("YEARFRAC(DATE(2006,1,1),DATE(2006,7,1),3)","A2",ws);
        ok(oParser.parse());
        okWrapper( oParser.calculate().getValue(), 0.495890411);

        oParser = new parserFormula("YEARFRAC(DATE(2006,1,1),DATE(2006,7,1),4)","A2",ws);
        ok(oParser.parse());
        okWrapper( oParser.calculate().getValue(), 0.5);

        oParser = new parserFormula("YEARFRAC(DATE(2004,3,1),DATE(2006,3,1),1)","A2",ws);
        ok(oParser.parse());
        okWrapper( oParser.calculate().getValue(), 1.998175182481752);
    })

    test("Test: \"DATEDIF\"",function(){

        oParser = new parserFormula("DATEDIF(DATE(2001,1,1),DATE(2003,1,1),\"Y\")","A2",ws);
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 2);

        oParser = new parserFormula("DATEDIF(DATE(2001,6,1),DATE(2002,8,15),\"D\")","A2",ws);
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 440);

        oParser = new parserFormula("DATEDIF(DATE(2001,6,1),DATE(2002,8,15),\"YD\")","A2",ws);
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 75);

        oParser = new parserFormula("DATEDIF(DATE(2001,6,1),DATE(2002,8,15),\"MD\")","A2",ws);
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 14);
    })

    test("Test: \"SUMPRODUCT\"",function(){

        oParser = new parserFormula("SUMPRODUCT({2,3})","A2",ws);
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 5);

        oParser = new parserFormula("SUMPRODUCT({2,3},{4,5})","A2",ws);
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 23);

        oParser = new parserFormula("SUMPRODUCT({2,3},{4,5},{2,2})","A2",ws);
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 46);

        oParser = new parserFormula("SUMPRODUCT({2,3;4,5},{2,2;3,4})","A2",ws);
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 42);

        ws.getRange2("N44").setValue("1");
        ws.getRange2("N45").setValue("2");
        ws.getRange2("N46").setValue("3");
        ws.getRange2("N47").setValue("4");

        ws.getRange2("O44").setValue("5");
        ws.getRange2("O45").setValue("6");
        ws.getRange2("O46").setValue("7");
        ws.getRange2("O47").setValue("8");

        ws.getRange2("P44").setValue("9");
        ws.getRange2("P45").setValue("10");
        ws.getRange2("P46").setValue("11");
        ws.getRange2("P47").setValue("12");
        oParser = new parserFormula("SUMPRODUCT(N44:N47,O44:O47,P44:P47)","A2",ws);
        ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 780);
    })

});
