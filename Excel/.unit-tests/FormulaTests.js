$(function () {
	
	var ver = 2;

	var oParser, wb, ws, date1, date2,
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
        strictEqual( oParser.calculate().getValue(), 1909);
	})
	
	test("Test: DAY",function(){
		oParser = new parserFormula("DAY(2013)","A1",ws);
		ok(oParser.parse());
        strictEqual( oParser.calculate().getValue(), 6);
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
	
});
