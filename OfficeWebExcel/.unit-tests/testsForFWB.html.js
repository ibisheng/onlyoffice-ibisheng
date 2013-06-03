$(function(){
	var fGetFormatedText = function(aFormated)
	{
		var res = "";
		for(var i = 0, length = aFormated.length; i < length; i++)
		{
			res += aFormated[i].t;
		}
		return res;
	}
    module("Formats");
	test("General", function test_date(){
		var form = new CellFormat("General");
		strictEqual(fGetFormatedText(form.format(0)),"0", "number: 0; format: General");
		strictEqual(fGetFormatedText(form.format(1)),"1", "number: 0; format: General");
		strictEqual(fGetFormatedText(form.format(1234567891)),"1234567891", "number: 1234567891; format: General");
		strictEqual(fGetFormatedText(form.format(12345678912)),"12345678912", "number: 12345678912; format: General");
		strictEqual(fGetFormatedText(form.format(123456789123)),"1.23457E+11", "number: 123456789123; format: General");
		strictEqual(fGetFormatedText(form.format(1234567891.123)),"1234567891", "number: 1234567891,123; format: General");
		strictEqual(fGetFormatedText(form.format(12345678912.123)),"12345678912", "number: 12345678912,123; format: General");
		strictEqual(fGetFormatedText(form.format(123456.123456)),"123456.1235", "number: 123456,123456; format: General");
		strictEqual(fGetFormatedText(form.format(0.123456789)),"0.123456789", "number: 0,123456789; format: General");
		strictEqual(fGetFormatedText(form.format(0.12345678912)),"0.123456789", "number: 0,12345678912; format: General");
		strictEqual(fGetFormatedText(form.format(0.000123456798)),"0.000123457", "number: 0,000123456798; format: General");
		strictEqual(fGetFormatedText(form.format(0.0000123456798)),"1.23457E-05", "number: 0,0000123456798; format: General");
		strictEqual(fGetFormatedText(form.format(-123)),"-123", "number: -123; format: General");
		strictEqual(fGetFormatedText(form.format(-0.0000123456879)),"-1.23457E-05", "number: -0,0000123456879; format: General");
		strictEqual(fGetFormatedText(form.format(-123.123456789)),"-123.1234568", "number: -123,123456789; format: General");
		strictEqual(fGetFormatedText(form.format("Text")),"Text", "number: Text; format: General");
	});
    test("Signs: 0, #", function test_format()
    {
        var form = new CellFormat("##.##0");
        strictEqual( fGetFormatedText(form.format(7.2)), "7.20", "number: 7.2 ; formatCode : ##,##0 "  );
        form = new CellFormat("00##.#\\t#\\r0");
        strictEqual( fGetFormatedText(form.format( 879.127894 )), "0879.1t2r8", "number: 879.127894 ; formatCode : 00##,#\\t#\\r0 "  );
        form = new CellFormat("##.##000#");
        strictEqual( fGetFormatedText(form.format( 879.127 )), "879.12700", "number: 879.127 ; formatCode : ##,##000# "  );
        form = new CellFormat("##.##000#0");
        strictEqual( fGetFormatedText(form.format( 879.127 )), "879.127000", "number: 879.127 ; formatCode : ##,##000#0 "  );
        form = new CellFormat("##.##000#0#");
        strictEqual( fGetFormatedText(form.format( 879.127 )), "879.127000", "number: 879.127 ; formatCode : ##,##000#0# "  );
        form = new CellFormat("##.\\h#\"jpt\"");
        strictEqual( fGetFormatedText(form.format( 879.127 )), "879.h1jpt", "number: 879.127 ; formatCode : ##,\\h#\"jpt\""  );
        
        form = new CellFormat("\"tq\"#.##");
        strictEqual( fGetFormatedText(form.format(-1)), "-tq1.", "number: -1 ; formatCode : \"tq\"#.## "  );
        form = new CellFormat(".##");
        strictEqual( fGetFormatedText(form.format(94.1)), "94.1", "number: 94.1 ; formatCode : .## "  );
        form = new CellFormat("#.##.#");
        strictEqual( fGetFormatedText(form.format(94.12567)), "94.12.6", "number: 94.1 ; formatCode : #.##.# "  );
        strictEqual( fGetFormatedText(form.format(627.4)), "627.4.", "number: 627.4 ; formatCode : #.##.# "  );
        form = new CellFormat("#\".\"##");
        strictEqual( fGetFormatedText(form.format(9412.567)), "94.13", "number: 9412.567 ; formatCode : #\".\"## "  );
        strictEqual( fGetFormatedText(form.format(12.567)), ".13", "number: 12.567 ; formatCode : #\",\"##"  );
        form = new CellFormat("#");
        strictEqual( fGetFormatedText(form.format(12.567)), "13", "number: 12.567 ; formatCode : # "  );
        form = new CellFormat(".0");
        strictEqual( fGetFormatedText(form.format(0.982)), "1.0", "number: 0.982; formatcode: .0 " );
        form = new CellFormat("0");
        strictEqual( fGetFormatedText(form.format(-0.1)), "0", "number: -0.1; formatcode: 0 " );
        form = new CellFormat("00,00");
        strictEqual( fGetFormatedText(form.format(12)), "0,012", "number: 12; formatcode: 00,00" );
        form = new CellFormat("000,00");
        strictEqual( fGetFormatedText(form.format(12)), "00,012", "number: 12; formatcode: 000,00" );
		form = new CellFormat("000,00");
        strictEqual( fGetFormatedText(form.format(123)), "00,123", "number: 12; formatcode: 000,00" );
		form = new CellFormat("##00000,00");
        strictEqual( fGetFormatedText(form.format(123)), "0,000,123", "number: 12; formatcode: ##00000,00" );

    });
    test("Sign \\ and \"\" ",function test_format()
    {
        var form = new CellFormat("##.#\\#");
        strictEqual( fGetFormatedText(form.format( 879.127 )), "879.1#", "number: 879.127 ; formatCode : ##.#\\#"  );
        form = new CellFormat("##.#\\n\\u");
        strictEqual( fGetFormatedText(form.format( 879.127 )), "879.1nu", "number: 879.127 ; formatCode : ##.#\\n\\u"  );
        form = new CellFormat("\\##.#\\n0\\u");
        strictEqual( fGetFormatedText(form.format( 879.127 )), "#879.1n3u", "number: 879.127 ; formatCode : \\##.#\\n0\\u"  );
        form = new CellFormat("#\\w#.#\\n0\\u");
        strictEqual( fGetFormatedText(form.format( 879.127 )), "87w9.1n3u", "number: 879.127 ; formatCode : #\\w#.#\\n0\\u"  );
        form = new CellFormat("#\\q\"a\"\\r\"bcd\"\\f#.0");
        strictEqual( fGetFormatedText(form.format( 879.127 )), "87qarbcdf9.1", "number: 879.127 ; formatCode : #\\q\"a\"\\r\"bcd\"\\f#.0"  );
        form = new CellFormat("#\"a\"#\"bc\"\\f#.0");
        strictEqual( fGetFormatedText(form.format( 879.127 )), "8a7bcf9.1", "number: 879.127 ; formatCode : #\"a\"#\"bc\"f#.0 "  );
        form = new CellFormat("#.\"\"#");
        strictEqual( fGetFormatedText(form.format( 879.127 )), "879.1", "number: 879.127 ; formatCode : #.\"\"#"  );
        form = new CellFormat("\"\"#.#");
        strictEqual( fGetFormatedText(form.format( 879.127 )), "879.1", "number: 879.127 ; formatCode : \"\"#.#"  );
        form = new CellFormat("\\t\"\"\\q#.#");
        strictEqual( fGetFormatedText(form.format( 879.127 )), "tq879.1", "number: 879.127 ; formatCode : t\"\"q#.#"  );
        form = new CellFormat("\"t\\xt\"#");
        strictEqual( fGetFormatedText(form.format(56.45)), "t\\xt56", "number: 56.45; formatCode: \"t\\xt\"# " );

    });
    test("For \"space\" and %", function test_format()
    {
        var form = new CellFormat("#.###,%", "n");
        strictEqual( fGetFormatedText(form.format(45)), "4.5%", "number: 45 ; formatCode : #.###,%"  );
        form = new CellFormat("#\"txt\"%.###,", "n");
        strictEqual( fGetFormatedText(form.format(45)), "4txt%.5", "number: 45 ; formatCode : #txt%,###,"  );
        form = new CellFormat("#%%", "n");
        strictEqual( fGetFormatedText(form.format(0.45)), "4500%%", "number: 0.45 ; formatCode : #%%"  );
        form = new CellFormat("###.##,", "n");
        strictEqual( fGetFormatedText(form.format(1234.45)), "1.23", "number: 1234,45 ; formatCode : ###.##,"  );
        form = new CellFormat("#,#", "n");
        strictEqual( fGetFormatedText(form.format(1234.45)), "1,234", "number: 1234,45 ; formatCode : #,#"  );
        form = new CellFormat("#.#,#", "n");
        strictEqual( fGetFormatedText(form.format(1234.45)), "1234.45", "number: 1234,45 ; formatCode : #.#,#"  );
        form = new CellFormat("#,#.##", "n");
        strictEqual( fGetFormatedText(form.format(1234.45)), "1,234.45", "number: 1234,45 ; formatCode : #,#.##"  );
        form = new CellFormat("#,#,#.##", "n");
        strictEqual( fGetFormatedText(form.format(200000.45)), "200,000.45", "number: 200000.45 ; formatCode : #,#,#.##"  );

        form = new CellFormat("#\"txt\"#,#", "n");
        strictEqual( fGetFormatedText(form.format(1000000.00)), "1,000,0txt00", "number: 1000000.00 ; formatCode : #\"txt\"#,#"  );
        form = new CellFormat("#,#\"txt\"##", "n");
        strictEqual( fGetFormatedText(form.format(1000000.00)), "1,000,0txt00", "number: 1000000.00 ; formatCode : #,#\"txt\"##"  );
        form = new CellFormat("##,#,", "n");
        strictEqual( fGetFormatedText(form.format(1000000.00)), "1,000", "number: 1000000.00 ; formatCode : ##,#,"  );
        form = new CellFormat("###.##,", "n");
        strictEqual( fGetFormatedText(form.format(1234.45)), "1.23", "number: 1234,45 ; formatCode : ###.##,"  );
        form = new CellFormat("##,#,", "n");
        strictEqual( fGetFormatedText(form.format(1000000.00)), "1,000", "number: 1000000.00 ; formatCode : ##,#,"  );
        
    });
    test("Sign @ for text", function test_format()
    {
        var form = new CellFormat("@\" text \"@", "s" );
        strictEqual(fGetFormatedText(form.format("abc")), "abc text abc", "text: abc; formatCode: @ text @");
        form = new CellFormat("@\" text \"@\" qwerty \"", "s" );
        strictEqual(fGetFormatedText(form.format("abc")), "abc text abc qwerty ", "text: abc; formatCode: @ text @ \"qwerty\"");
        form = new CellFormat("@\\$", "s" );
        strictEqual(fGetFormatedText(form.format("abc")), "abc$", "text: abc; formatCode: @\\$");

    });
    test("Scientific format",function test_format()
    {
        var form = new CellFormat("#E+#");
        strictEqual(fGetFormatedText(form.format(1234)),"1E+3", "number: 1234; format: #E+#");
        form = new CellFormat("##.#E+#");
        strictEqual(fGetFormatedText(form.format(12374)),"1.2E+4", "number: 12374; format: ##,#E+#");
        form = new CellFormat("##.#E+\"tr\"#\\a");
        strictEqual(fGetFormatedText(form.format(12374)),"1.2E+tr4a", "number: 12374; format: ##,#E+tr#a");
        form = new CellFormat("###.###E+###");
        strictEqual(fGetFormatedText(form.format(12374)),"12.374E+3", "number: 12374; format: ###,###E+###");
        strictEqual(fGetFormatedText(form.format(1)),"1.E+0", "number: 1; format: ###,###E+###");
        form = new CellFormat("#E+#");
        strictEqual(fGetFormatedText(form.format(0.3249)),"3E-1", "number: 0.3249; format: #E+#");
        strictEqual(fGetFormatedText(form.format(0.007)),"7E-3", "number: 0.007; format: #E+#");
        form = new CellFormat("##.#E+#");
        strictEqual(fGetFormatedText(form.format(0.3249)),"32.5E-2", "number: 0.3249; format: ##,#E+#");
        strictEqual(fGetFormatedText(form.format(0.00716)),"71.6E-4", "number: 0.00716; format: ##,#E+#");
        form = new CellFormat("#,#.###E+###");
        strictEqual(fGetFormatedText(form.format(123755)),"12.376E+4", "number: 123755; format: # #,###E+###");
        form = new CellFormat("#,###.#E+#");
        strictEqual(fGetFormatedText(form.format(123755)),"12.4E+4", "number: 123755; format: # ###,#E+#");
        form = new CellFormat("#.#e+#");
        strictEqual(fGetFormatedText(form.format(0.00776)),"7.8e-3", "number: 0.00776; format: #,#e+#");
        form = new CellFormat("\"text\"#");
        strictEqual( fGetFormatedText(form.format(56.45)), "text56", "number: 56.45; formatCode: \"text\"# " );
        form = new CellFormat("\"text\"#");
        strictEqual( fGetFormatedText(form.format(56.45)), "text56", "number: 56.45; formatCode: t\\ext#" );
        form = new CellFormat("#E-#");
        strictEqual(fGetFormatedText(form.format(0.3249)),"3E-1", "number: 0.3249; format: #E-#");
        strictEqual(fGetFormatedText(form.format(1234)),"1E3", "number: 1234; format: #E-#");
        form = new CellFormat("0E-0");
        strictEqual(fGetFormatedText(form.format(-9876)),"-1E4", "number: -9876; format: 0E-0");
        form = new CellFormat("0.0E+0");
        strictEqual(fGetFormatedText(form.format(934.1)),"9.3E+2", "number: 934.1; format: 0.0E+0");
        form = new CellFormat("0E+0");
        strictEqual(fGetFormatedText(form.format(-0.969)),"-1E+0", "number: -0.969; format: 0E+0");
        form = new CellFormat(".0E-0");
        strictEqual(fGetFormatedText(form.format(1)),".1E1", "number: 1; format: .0E-0");
        form = new CellFormat("0.00");
        strictEqual(fGetFormatedText(form.format(0.575)),"0.58", "number: 0.575; format: 0.00");
        form = new CellFormat("0.00");
        strictEqual(fGetFormatedText(form.format(0.5751)),"0.58", "number: 0.5751; format: 0.00");

    });

    test("0,00 format",function test_format()
    {
        var form = new CellFormat("_-* #,##0.00_р_._-;\-* #,##0.00_р_._-;_-* \"-\"??_р_._-;_-@_-");
        strictEqual(fGetFormatedText(form.format(0)),"- -00р.-", "number: 0; format: _-* #,##0.00_р_._-;\-* #,##0.00_р_._-;_-* "-"??_р_._-;_-@_-");
		strictEqual(fGetFormatedText(form.format(123)),"- 123.00р.-", "number: 1234; format: _-* #,##0.00_р_._-;\-* #,##0.00_р_._-;_-* "-"??_р_._-;_-@_-");
		strictEqual(fGetFormatedText(form.format(1234560000000)),"- 1,234,560,000,000.00р.-", "number: 1234; format: _-* #,##0.00_р_._-;\-* #,##0.00_р_._-;_-* "-"??_р_._-;_-@_-");
		strictEqual(fGetFormatedText(form.format(123.456)),"- 123.46р.-", "number: 1234; format: _-* #,##0.00_р_._-;\-* #,##0.00_р_._-;_-* "-"??_р_._-;_-@_-");
		strictEqual(fGetFormatedText(form.format(-25.78)),"- 25.78р.-", "number: 1234; format: _-* #,##0.00_р_._-;\-* #,##0.00_р_._-;_-* "-"??_р_._-;_-@_-");
		strictEqual(fGetFormatedText(form.format(-0.256)),"- 0.26р.-", "number: 1234; format: _-* #,##0.00_р_._-;\-* #,##0.00_р_._-;_-* "-"??_р_._-;_-@_-");
		strictEqual(fGetFormatedText(form.format(0.256)),"- 0.26р.-", "number: 1234; format: _-* #,##0.00_р_._-;\-* #,##0.00_р_._-;_-* "-"??_р_._-;_-@_-");
		strictEqual(fGetFormatedText(form.format("Text")),"-Text-", "number: 1234; format: _-* #,##0.00_р_._-;\-* #,##0.00_р_._-;_-* "-"??_р_._-;_-@_-");
		
		form = new CellFormat("0.00000E+00");
		strictEqual(fGetFormatedText(form.format(0)),"0.00000E+00", "number: 0; format: 0.00000E+00");
		strictEqual(fGetFormatedText(form.format(123)),"1.23000E+02", "number: 123; format: 0.00000E+00");
		strictEqual(fGetFormatedText(form.format(1234560000000)),"1.23456E+12", "number: 1234560000000; format: 0.00000E+00");
		strictEqual(fGetFormatedText(form.format(123.456)),"1.23456E+02", "number: 123.456; format: 0.00000E+00");
		strictEqual(fGetFormatedText(form.format(-25.78)),"-2.57800E+01", "number: -25.78; format: 0.00000E+00");
		strictEqual(fGetFormatedText(form.format(-0.256)),"-2.56000E-01", "number: -0.256; format: 0.00000E+00");
		strictEqual(fGetFormatedText(form.format(0.256)),"2.56000E-01", "number: 0.256; format: 0.00000E+00");
		strictEqual(fGetFormatedText(form.format("Text")),"Text", "number: Text; format: 0.00000E+00");
		
		form = new CellFormat("#.0,,");
		strictEqual(fGetFormatedText(form.format(0)),".0", "number: 0; format: #.0,,");
		strictEqual(fGetFormatedText(form.format(123)),".0", "number: 123; format: #.0,,");
		strictEqual(fGetFormatedText(form.format(1234560000000)),"1234560.0", "number: 1234560000000; format: #.0,,");
		strictEqual(fGetFormatedText(form.format(123.456)),".0", "number: 123.456; format: #.0,,");
		strictEqual(fGetFormatedText(form.format(-25.78)),".0", "number: -25.78; format: #.0,,");
		strictEqual(fGetFormatedText(form.format(-0.256)),".0", "number: -0.256; format: #.0,,");
		strictEqual(fGetFormatedText(form.format(0.256)),".0", "number: 0.256; format: #.0,,");
		strictEqual(fGetFormatedText(form.format("Text")),"Text", "number: Text; format: #.0,,");

        form = new CellFormat(",0");
        strictEqual(fGetFormatedText(form.format(5)), ",5", "number: 5, format: ,0");
        form = new CellFormat("#,#00.");
        strictEqual(fGetFormatedText(form.format(1234)), "1,234.", "number: 1234, format: #,#00.");
        form = new CellFormat("0E+,\\q0");
        strictEqual(fGetFormatedText(form.format(0.53)), "5E,q-1", "number: 0.53, format: 0E+,\\q0");
        form = new CellFormat("0,E-0");
        strictEqual(fGetFormatedText(form.format(11)), "1E1", "number: 11, format: 0,E-0");
        form = new CellFormat("#");
        strictEqual(fGetFormatedText(form.format(0.151)), "", "number: 0.151, format: #");
    });
	
	test("00/00", function test_fraction(){
        var form = new CellFormat("??/??");
        strictEqual(fGetFormatedText(form.format(0.256)),"11/43", "number: 0.256; format: ??/?? ");
		form = new CellFormat("#\" \"??/??");
		strictEqual(fGetFormatedText(form.format(0)),"0", "number: 0; format: #\" \"??/??");
		strictEqual(fGetFormatedText(form.format(123)),"123 ", "number: 123; format: #\" \"??/??");
		strictEqual(fGetFormatedText(form.format(1234560000000)),"1234560000000 ", "number: 1234560000000; format: #\" \"??/??");
		strictEqual(fGetFormatedText(form.format(123.456)),"123 26/57", "number: 123.456; format: #\" \"??/??");
		strictEqual(fGetFormatedText(form.format(-25.78)),"-25 39/50", "number: -25.78; format: #\" \"??/??");
		strictEqual(fGetFormatedText(form.format(-0.256)),"-11/43", "number: -0.256; format: #\" \"??/??");
		strictEqual(fGetFormatedText(form.format(0.256))," 11/43", "number: 0.256; format: #\" \"??/??");
		strictEqual(fGetFormatedText(form.format("Text")),"Text", "number: Text; format: #\" \"??/??");

        form = new CellFormat("??/??");
        strictEqual(fGetFormatedText(form.format(456)), "456/01", "number: 456; format: ??/??");
        form = new CellFormat("#/#");
        strictEqual(fGetFormatedText(form.format(45.7)), "320/7", "number: 45.7; format: #/#");
        form = new CellFormat("#/##");
        strictEqual(fGetFormatedText(form.format(27.84)), "696/25", "number: 27.84; format: #/##");
        form = new CellFormat("#/##%");
        strictEqual(fGetFormatedText(form.format(27.84)), "2784/1%", "number: 27.84; format: #/##%");
        form = new CellFormat("?/4");
        strictEqual(fGetFormatedText(form.format(27.84)), "111/4", "number: 27.84; format: ?/4");
        form = new CellFormat("#\" \"?/25");
        strictEqual(fGetFormatedText(form.format(4.7)), "4 18/25", "number: 4.7; format: #\" \"?/25");
        form = new CellFormat("#,#\" \"?/1000");
        strictEqual(fGetFormatedText(form.format(5600.7)), "5,600 700/1000", "number: 5600.7; format: #,#\" \"?/1000");
        
	});
    test("Date", function test_date(){

		var form = new CellFormat("DD/MM/YYYY h:mm AM/PM");
		strictEqual(fGetFormatedText(form.format(0)),"31/12/1899 12:00 AM", "number: 0; format: DD/MM/YYYY h:mm AM/PM");
        strictEqual(fGetFormatedText(form.format(2)),"02/01/1900 12:00 AM", "number: 2; format: DD/MM/YYYY h:mm AM/PM");
		strictEqual(fGetFormatedText(form.format(123)),"02/05/1900 12:00 AM", "number: 123; format: DD/MM/YYYY h:mm AM/PM, date: 02.05.1900  0:00:00");
		strictEqual(fGetFormatedText(form.format(1234560000000)),"#", "number: 1234560000000; format: DD/MM/YYYY h:mm AM/PM");
		strictEqual(fGetFormatedText(form.format(123.456)),"02/05/1900 10:56 AM", "number: 123.456; format: DD/MM/YYYY h:mm AM/PM");
		strictEqual(fGetFormatedText(form.format(-25.78)),"#", "number: -25.78; format: DD/MM/YYYY h:mm AM/PM");
		strictEqual(fGetFormatedText(form.format(-0.256)),"#", "number: -0.256; format: DD/MM/YYYY h:mm AM/PM");
		strictEqual(fGetFormatedText(form.format(0.256)),"31/12/1899 6:08 AM", "number: 0.256; format: DD/MM/YYYY h:mm AM/PM");
		strictEqual(fGetFormatedText(form.format("Text")),"Text", "number: Text; format: DD/MM/YYYY h:mm AM/PM");

		form = new CellFormat("[mm]:ss.00");
		strictEqual(fGetFormatedText(form.format(0)),"00:00.00", "number: 0; format: [mm]:ss.00");
		strictEqual(fGetFormatedText(form.format(123)),"177120:00.00", "number: 123; format: [mm]:ss.00");
		strictEqual(fGetFormatedText(form.format(1234560000000)),"#", "number: 1234560000000; format: [mm]:ss.00");
		strictEqual(fGetFormatedText(form.format(-25.78)),"#", "number: -25.78; format: [mm]:ss.00");
		strictEqual(fGetFormatedText(form.format(-0.256)),"#", "number: -0.256; format: [mm]:ss.00");
		strictEqual(fGetFormatedText(form.format(0.256)),"368:38.40", "number: 0.256; format: [mm]:ss.00");
		strictEqual(fGetFormatedText(form.format("Text")),"Text", "number: Text; format: [mm]:ss.00");

        form = new CellFormat("[mm]:ss.00 hh:mm:ss");
        strictEqual(fGetFormatedText(form.format(123.456)),"177776:38.40 10:56:38", "number: 123.456; format: [mm]:ss.00 hh:mm:ss");
        form = new CellFormat("[mm]:ss.00 hh:MM:ss");
        strictEqual(fGetFormatedText(form.format(123.456)),"177776:38.40 10:56:38", "number: 123.456; format: [mm]:ss.00 hh:MM:ss");

        form = new CellFormat("[h]:mm");
        strictEqual(fGetFormatedText(form.format(123.00695)),"2952:10", "number: 123.00695; format: [h]:mm date: 02.05.1900 0:10:00");
        form = new CellFormat("[ss].000");
        strictEqual(fGetFormatedText(form.format(123.00695)),"10627800.480", "number: 123.00695; format: [ss].000 date: 02.05.1900 0:10:00");
        form = new CellFormat("[ss]");
        strictEqual(fGetFormatedText(form.format(123.00695)),"10627800", "number: 123.00695; format: [ss] date: 02.05.1900 0:10:00");
        form = new CellFormat("ss.000");
        strictEqual(fGetFormatedText(form.format(123.00695)),"00.480", "number: 123.00695; format: ss.000 date: 02.05.1900 0:10:00");

        form = new CellFormat("AM/PM\\ hh\\ hh");
        strictEqual(fGetFormatedText(form.format(1.894)),"PM 09 09", "number: 1,894, format: AM/PM hh hh, date: 01.01.1900  21:27:22");
        form = new CellFormat("DD/MM/YYYY h:mm:ss");
        strictEqual(fGetFormatedText(form.format(59677.5317435185)), "21/05/2063 12:45:43", "format: DD/MM/YYYY h:mm:ss, number: 59677.5316435185");
        strictEqual(fGetFormatedText(form.format(2958465.9999884)), "31/12/9999 23:59:59", "format: DD/MM/YYYY h:mm:ss, number: 2958465.9999884, date: 31.12.9999 23:59:59");
        form = new CellFormat("mm:ss.00");
        strictEqual(fGetFormatedText(form.format(1.894)),"27:21.60", "number: 1,894, format: mm:ss.00, date: 01.01.1900  21:27:22");

        form = new CellFormat("DD/MM/YYYY h:mm AM/PM");
        strictEqual(fGetFormatedText(form.format(1)),"01/01/1900 12:00 AM", "number: 1; format: DD/MM/YYYY h:mm AM/PM");
        strictEqual(fGetFormatedText(form.format(1521)),"29/02/1904 12:00 AM", "number: 1521; format: DD/MM/YYYY h:mm AM/PM");
        strictEqual(fGetFormatedText(form.format(1522)),"01/03/1904 12:00 AM", "number: 1522; format: DD/MM/YYYY h:mm AM/PM");
        form = new CellFormat("DD/MM/YYYY DDDD");
        strictEqual(fGetFormatedText(form.format(41952.4)),"09/11/2014 Sunday", "number: 41952.4; format: DD/MM/YYYY DDDD");
        form = new CellFormat("DD/MM/YYYY DDD");
        strictEqual(fGetFormatedText(form.format(1521)),"29/02/1904 Mon", "number: 1521; format: DD/MM/YYYY DDD");
        strictEqual(fGetFormatedText(form.format(59)),"28/02/1900 Tue", "number: 59; format: DD/MM/YYYY DDD");
        strictEqual(fGetFormatedText(form.format(60)),"29/02/1900 Wed", "number: 60; format: DD/MM/YYYY DDD");
        form = new CellFormat("DD/MMM/YYYY DDD");
        strictEqual(fGetFormatedText(form.format(61)),"01/Mar/1900 Thu", "number: 61; format: DD/MMM/YYYY DDD");
        strictEqual(fGetFormatedText(form.format(0)),"31/Dec/1899 Sat", "number: 0; format: DD/MMM/YYYY DDD");
        strictEqual(fGetFormatedText(form.format(-1)),"#", "number: -1; format: DD/MMM/YYYY DDD");

    });
    test("MonthMinute", function test_date(){
		var form = new CellFormat("mm:ss");
		strictEqual(fGetFormatedText(form.format(123.456)),"56:38", "number: 123.456; format: mm:ss");
		form = new CellFormat("mm");
		strictEqual(fGetFormatedText(form.format(123.456)),"05", "number: 123.456; format: mm");
		form = new CellFormat("mm:hh");
		strictEqual(fGetFormatedText(form.format(123.456)),"05:10", "number: 123.456; format: mm:hh");
		form = new CellFormat("yy:mm:ss");
		strictEqual(fGetFormatedText(form.format(123.456)),"00:56:38", "number: 123.456; format: yy:mm:ss");
		form = new CellFormat("ss:dd:mm");
		strictEqual(fGetFormatedText(form.format(123.456)),"38:02:56", "number: 123.456; format: ss:dd:mm");
		form = new CellFormat("dd:mm:hh");
		strictEqual(fGetFormatedText(form.format(123.456)),"02:05:10", "number: 123.456; format: dd:mm:hh");
		form = new CellFormat("hh:mm:mm:hh");
		strictEqual(fGetFormatedText(form.format(123.456)),"10:56:05:10", "number: 123.456; format: hh:mm:mm:hh");
		form = new CellFormat("mm:hh ss:dd:mm:yyyy dd:mm");
		strictEqual(fGetFormatedText(form.format(123.456)),"05:10 38:02:56:1900 02:05", "number: 123.456; format: mm:hh ss:dd:mm:yyyy dd:mm");
		form = new CellFormat("mm:ss:dd:mm:yyyy dd:mm");
		strictEqual(fGetFormatedText(form.format(123.456)),"56:38:02:05:1900 02:05", "number: 123.456; format: mm:ss:dd:mm:yyyy dd:mm");

    });
    test("Milliseconds", function test_date(){
        
        var form = new CellFormat("DD/MM/YYYY h:mm:ss.00");
        strictEqual(fGetFormatedText(form.format(59677.5317435185)), "21/05/2063 12:45:42.64", "format: DD/MM/YYYY h:mm:ss.00, number: 59677.5316435185");
        form = new CellFormat("DD/MM/YYYY h:mm:ss.000");
        strictEqual(fGetFormatedText(form.format(7540.345311)), "22/08/1920 8:17:14.870", "format: DD/MM/YYYY h:mm:ss.000, number: 7540.345311, date: 22.08.1920 8:17:15");
        strictEqual(fGetFormatedText(form.format(2958465.9999884)), "31/12/9999 23:59:58.998", "format: DD/MM/YYYY h:mm:ss, number: 2958465.9999884, date: 31.12.9999 23:59:59");
        form = new CellFormat("ss.0");
        strictEqual(fGetFormatedText(form.format(7540.345311)), "14.9", "format: ss.0, number: 7540.345311, date: 22.08.1920 8:17:15");
        form = new CellFormat("ss.000");
        strictEqual(fGetFormatedText(form.format(7540.313102)), "52.013", "format: ss.000, number: 7540.313102, date: 22.08.1920 7:30:52");
        strictEqual(fGetFormatedText(form.format(1/(24*60*60*1000))), "00.001", "format: ss.000, number: 1.1574074074074074E-8, date: 30.12.1899 0:00:00");


    });

});