$(function () {

	module("FontEngine");


	test("namespace", function test_namespace() {
		ok(window.Asc !== undefined, "window.Asc must be defined");
		ok(window.Asc.FontEngine !== undefined, "window.Asc.FontEngine must be defined");
		ok(window.Asc.FontEngine.loadFontsAsync !== undefined, "window.Asc.FontEngine.loadFontsAsync must be defined");
		ok(window.Asc.FontEngine.FontManager !== undefined, "window.Asc.FontEngine.FontManager must be defined");
	});


	asyncTest("loadFontsAsync(single font)", 1, function test_loadFontsAsync() {
		window.Asc.FontEngine.loadFontsAsync(["arial"], function () {
			equal(1, 1, "single font has been loaded");
			start();
		});
	});

	asyncTest("loadFontsAsync(multiple fonts)", 1, function test_loadFontsAsync() {
		window.Asc.FontEngine.loadFontsAsync(["Calibri", "CAMBRIA"], function () {
			equal(1, 1, "multiple fonts have been loaded");
			start();
		});
	});


	var fm;

	test("FontManager.Initialize", function test_Initialize() {
		fm = new window.Asc.FontEngine.FontManager();

		ok(fm.Initialize !== undefined, "method must be defined: Initialize");
		ok(fm.SetFont !== undefined, "method must be defined: SetFont");
		ok(fm.SetTextMatrix !== undefined, "method must be defined: SetTextMatrix");
		ok(fm.MeasureChar !== undefined, "method must be defined: MeasureChar");
		ok(fm.DrawText !== undefined, "method must be defined: DrawText");

		fm.Initialize();

		ok(fm.m_lAscender !== undefined, "member must be defined: m_lAscender");
		ok(fm.m_lDescender !== undefined, "member must be defined: m_lDescender");
		ok(fm.m_lLineHeight !== undefined, "member must be defined: m_lLineHeight");
		ok(fm.m_lUnits_Per_Em !== undefined, "member must be defined: m_lUnits_Per_Em");
	});

	test("FontManager.SetFont", function test_SetFont() {
		fm.SetFont({FontFamily:{Name:"aial", Index:-1}, FontSize:12, Bold:false, Italic:false});

		equal(fm.m_lAscender, 1854, "Font Arial, 12: ascender");
		equal(fm.m_lDescender, -434, "Font Arial, 12: descender");
		equal(fm.m_lLineHeight, 2355, "Font Arial, 12: line height");
		equal(fm.m_lUnits_Per_Em, 2048, "Font Arial, 12: units per em");
	});

	test("FontManager.MeasureChar", function test_MeasureChar() {
		var w = fm.MeasureChar("A");

		ok(w > 0, "Font Arial, 12: width of letter 'A'");
	});

});
