$(function () {

	module("Utils");

	test("Asc.typeOf", function test_typeOf() {
		strictEqual(Asc.typeOf(1), "number", "Asc.typeOf( 1 )");
		strictEqual(Asc.typeOf(1.1), "number", "Asc.typeOf( 1.1 )");
		strictEqual(Asc.typeOf(new Number(2)), "number", "Asc.typeOf( new Number(2) )");
		strictEqual(Asc.typeOf(new Number(2.2)), "number", "Asc.typeOf( new Number(2.2) )");

		strictEqual(Asc.typeOf('abc'), "string", "Asc.typeOf( 'abc' )");
		strictEqual(Asc.typeOf(new String('def')), "string", "Asc.typeOf( new String('def') )");

		strictEqual(Asc.typeOf([1]), "array", "Asc.typeOf( [1] )");

		strictEqual(Asc.typeOf(function () {}), "function", "Asc.typeOf( function () {} )");
		strictEqual(Asc.typeOf(new Function()), "function", "Asc.typeOf( new Function() )");
	});

	test("Asc.lastIndexOf", function test_lastIndexOf() {
		strictEqual(Asc.lastIndexOf("aabb aa bb bbaa", /a{2}/, 8), 5, 'Asc.lastIndexOf("aabb aa bb bbaa", /a{2}/, 8)');
		strictEqual(Asc.lastIndexOf("aabb aa bb bbaa", /a{2}/, 15), 13, 'Asc.lastIndexOf("aabb aa bb bbaa", /a{2}/, 13)');
		strictEqual(Asc.lastIndexOf("aabb aa bb bbaa", /a[^b]+b/, 15), 6, 'Asc.lastIndexOf("aabb aa bb bbaa", /a[^b]+b/, 15)');
		strictEqual(Asc.lastIndexOf("aabb aa bb bbaa", /c+/, 15), -1, 'Asc.lastIndexOf("aabb aa bb bbaa", /c+/, 15)');
	});

	test("Asc.search", function test_search() {
		strictEqual(Asc.search([1, 2, 3], function (a) {return a === 1}), 0, 'Asc.search([1, 2, 3], function (a) {return a === 1})');
		strictEqual(Asc.search([1, 2, 3], function (a) {return a > 1}), 1, 'Asc.search([1, 2, 3], function (a) {return a > 1})');
		strictEqual(Asc.search([1, 2, 3], function (a) {return a < 0}), -1, 'Asc.search([1, 2, 3], function (a) {return a < 0})');
		strictEqual(Asc.search([], function (a) {return a > 1}), -1, 'Asc.search([], function (a) {return a > 1})');
	});

	test("Asc.floor", function test_floor() {
		strictEqual(Asc.floor(0), Math.floor(0), "Asc.floor(0)");
		strictEqual(Asc.floor(45.0), Math.floor(45.0), "Asc.floor(45.0)");
		strictEqual(Asc.floor(45.4), Math.floor(45.4), "Asc.floor(45.4)");
		strictEqual(Asc.floor(45.5), Math.floor(45.5), "Asc.floor(45.5)");
		strictEqual(Asc.floor(45.6), Math.floor(45.6), "Asc.floor(45.6)");
		strictEqual(Asc.floor(46), Math.floor(46), "Asc.floor(46)");

		strictEqual(Asc.floor(-0), Math.floor(-0), "Asc.floor(-0)");
		strictEqual(Asc.floor(-45.0), Math.floor(-45.0), "Asc.floor(-45.0)");
		strictEqual(Asc.floor(-45.4), Math.floor(-45.4), "Asc.floor(-45.4)");
		strictEqual(Asc.floor(-45.5), Math.floor(-45.5), "Asc.floor(-45.5)");
		strictEqual(Asc.floor(-45.6), Math.floor(-45.6), "Asc.floor(-45.6)");
		strictEqual(Asc.floor(-46), Math.floor(-46), "Asc.floor(-46)");

		strictEqual(Asc.floor(.6+.7+.7), 2, "Asc.floor(.6+.7+.7)"); // 1.99999...
		strictEqual(Asc.floor(-.6-.7-.7), -2, "Asc.floor(-.6-.7-.7)"); // -1.99999...
		strictEqual(Asc.floor(.1+.2-.3), 0, "Asc.floor(.1+.2-.3)"); // 5.5e-17
		strictEqual(Asc.floor(-.1-.2+.3), 0, "Asc.floor(-.1-.2+.3)"); // -5.5e-17
		strictEqual(Asc.floor(.1+.2+.9-.2), 1, "Asc.floor(.1+.2+.9-.2)"); // 1.0000...2
		strictEqual(Asc.floor(-.1-.2-.9+.2), -1, "Asc.floor(.1+.2+.9-.2)"); // -1.0000...2
	});

	test("Asc.ceil", function test_ceil() {
		strictEqual(Asc.ceil(0), Math.ceil(0), "Asc.ceil(0)");
		strictEqual(Asc.ceil(45.0), Math.ceil(45.0), "Asc.ceil(45.0)");
		strictEqual(Asc.ceil(45.4), Math.ceil(45.4), "Asc.ceil(45.4)");
		strictEqual(Asc.ceil(45.5), Math.ceil(45.5), "Asc.ceil(45.5)");
		strictEqual(Asc.ceil(45.6), Math.ceil(45.6), "Asc.ceil(45.6)");
		strictEqual(Asc.ceil(46), Math.ceil(46), "Asc.ceil(46)");

		strictEqual(Asc.ceil(-0), Math.ceil(-0), "Asc.ceil(-0)");
		strictEqual(Asc.ceil(-45.0), Math.ceil(-45.0), "Asc.ceil(-45.0)");
		strictEqual(Asc.ceil(-45.4), Math.ceil(-45.4), "Asc.ceil(-45.4)");
		strictEqual(Asc.ceil(-45.5), Math.ceil(-45.5), "Asc.ceil(-45.5)");
		strictEqual(Asc.ceil(-45.6), Math.ceil(-45.6), "Asc.ceil(-45.6)");
		strictEqual(Asc.ceil(-46), Math.ceil(-46), "Asc.ceil(-46)");

		strictEqual(Asc.ceil(.6+.7+.7), 2, "Asc.ceil(.6+.7+.7)"); // 1.99999...
		strictEqual(Asc.ceil(-.6-.7-.7), -2, "Asc.ceil(-.6-.7-.7)"); // -1.99999...
		strictEqual(Asc.ceil(.1+.2-.3), 0, "Asc.ceil(.1+.2-.3)"); // 5.5e-17
		strictEqual(Asc.ceil(-.1-.2+.3), 0, "Asc.ceil(-.1-.2+.3)"); // -5.5e-17
		strictEqual(Asc.ceil(.1+.2+.9-.2), 1, "Asc.ceil(.1+.2+.9-.2)"); // 1.0000...2
		strictEqual(Asc.ceil(-.1-.2-.9+.2), -1, "Asc.ceil(.1+.2+.9-.2)"); // -1.0000...2
	});

	test("Asc.round", function test_round() {
		strictEqual(Asc.round(0), Math.round(0), "Asc.round(0)");
		strictEqual(Asc.round(45.0), Math.round(45.0), "Asc.round(45.0)");
		strictEqual(Asc.round(45.4), Math.round(45.4), "Asc.round(45.4)");
		strictEqual(Asc.round(45.5), Math.round(45.5), "Asc.round(45.5)");
		strictEqual(Asc.round(45.6), Math.round(45.6), "Asc.round(45.6)");
		strictEqual(Asc.round(46), Math.round(46), "Asc.round(46)");

		strictEqual(Asc.round(-0), Math.round(-0), "Asc.round(-0)");
		strictEqual(Asc.round(-45.0), Math.round(-45.0), "Asc.round(-45.0)");
		strictEqual(Asc.round(-45.4), Math.round(-45.4), "Asc.round(-45.4)");
		strictEqual(Asc.round(-45.5), Math.round(-45.5), "Asc.round(-45.5)");
		strictEqual(Asc.round(-45.6), Math.round(-45.6), "Asc.round(-45.6)");
		strictEqual(Asc.round(-46), Math.round(-46), "Asc.round(-46)");

		strictEqual(Asc.round(.6+.7+.7), 2, "Asc.round(.6+.7+.7)"); // 1.99999...
		strictEqual(Asc.round(-.6-.7-.7), -2, "Asc.round(-.6-.7-.7)"); // -1.99999...
		strictEqual(Asc.round(.1+.2-.3), 0, "Asc.round(.1+.2-.3)"); // 5.5e-17
		strictEqual(Asc.round(-.1-.2+.3), 0, "Asc.round(-.1-.2+.3)"); // -5.5e-17
		strictEqual(Asc.round(.1+.2+.9-.2), 1, "Asc.round(.1+.2+.9-.2)"); // 1.0000...2
		strictEqual(Asc.round(-.1-.2-.9+.2), -1, "Asc.round(.1+.2+.9-.2)"); // -1.0000...2
	});

	test("AscCommon.extendClass", function test_extendClass() {
		function Base(b1) {
			this.b1 = b1;
		}
		Base.prototype.mb1 = function (b1) {this.b1=b1;};

		function Child(b1, c1) {
			Child.superclass.constructor.call(this, b1);
			this.c1 = c1;
		}
		AscCommon.extendClass(Child, Base);
		Child.prototype.mc1 = function (c1) {this.c1=c1;};

		var x = new Child(1, 2);
		ok(x !== undefined, "x = new Child(1, 2)");
		ok(x.mb1 !== undefined, "x.mb1");
		ok(x.mc1 !== undefined, "x.mc1");
		equal(x.b1, 1, "x.b1");
		equal(x.c1, 2, "x.c1");
		x.mb1(3);
		equal(x.b1, 3, "x.b1");
		equal(x.c1, 2, "x.c1");
		x.mc1(4);
		equal(x.b1, 3, "x.b1");
		equal(x.c1, 4, "x.c1");
	});

	test("AscCommon.extendClass with fabric method", function test_extendClass2() {
		function Base(b1) {
			if ( !(this instanceof Base) ) {return new Base(b1);}
			this.b1 = b1;
			return this;
		}
		Base.prototype.mb1 = function (b1) {this.b1=b1;};

		function Child(b1, c1) {
			if ( !(this instanceof Child) ) {return new Child(b1, c1);}
			Child.superclass.constructor.call(this, b1);
			this.c1 = c1;
			return this;
		}
		AscCommon.extendClass(Child, Base);
		Child.prototype.mc1 = function (c1) {this.c1=c1;};

		var x = Child(1, 2);
		ok(x !== undefined, "x = Child(1, 2)");
		ok(x.mb1 !== undefined, "x.mb1");
		ok(x.mc1 !== undefined, "x.mc1");
		equal(x.b1, 1, "x.b1");
		equal(x.c1, 2, "x.c1");
		x.mb1(3);
		equal(x.b1, 3, "x.b1");
		equal(x.c1, 2, "x.c1");
		x.mc1(4);
		equal(x.b1, 3, "x.b1");
		equal(x.c1, 4, "x.c1");
	});

	function check_range(range, c1, r1, c2, r2, msg) {
		strictEqual(range.c1, c1, msg + ", c1");
		strictEqual(range.r1, r1, msg + ", r1");
		strictEqual(range.c2, c2, msg + ", c2");
		strictEqual(range.r2, r2, msg + ", r2");
	}

	test("Asc.Range", function test_Range() {
		raises(function () {Asc.Range();}, 'Asc.Range() must throw error to pass');
		raises(function () {Asc.Range("abc");}, 'Asc.Range("abc") must throw error to pass');
		raises(function () {Asc.Range("1", 2, 3, 4);}, 'Asc.Range("1", 2, 3, 4) must throw error to pass');

		var range = new Asc.Range(1, 2, 3, 4),
		    range2 = Asc.Range(2, 1, 4, 3),
		    range3 = Asc.Range(5, 4, 3, 2, true),
		    range4 = Asc.Range(8, 3, 2, 5),
		    range5 = range4.clone();

		range4.normalize();

		ok(range instanceof Asc.Range, "new Asc.Range(1, 2, 3, 4) instanceof Asc.Range");
		ok(range2 instanceof Asc.Range, "Asc.Range(2, 1, 4, 3) instanceof Asc.Range");
		ok(range3 instanceof Asc.Range, "Asc.Range(5, 4, 3, 2, true) instanceof Asc.Range");
		ok(range5 instanceof Asc.Range, "Asc.Range(8, 3, 2, 5).clone() instanceof Asc.Range");

		check_range(range,  1, 2, 3, 4, "Asc.Range(1, 2, 3, 4)");
		check_range(range2, 2, 1, 4, 3, "Asc.Range(2, 1, 4, 3)");
		check_range(range3, 3, 2, 5, 4, "Asc.Range(5, 4, 3, 2, true)");
		check_range(range4, 2, 3, 8, 5, "Asc.Range(8, 3, 2, 5).normalize()");
		check_range(range5, 8, 3, 2, 5, "Asc.Range(8, 3, 2, 5).clone()");

		ok(range.contains(1, 2), "Asc.Range(1, 2, 3, 4).contains(1, 2)");
		ok(range.contains(2, 2), "Asc.Range(1, 2, 3, 4).contains(2, 2)");
		ok(range.contains(3, 2), "Asc.Range(1, 2, 3, 4).contains(3, 2)");
		ok(range.contains(3, 3), "Asc.Range(1, 2, 3, 4).contains(3, 3)");
		ok(range.contains(3, 4), "Asc.Range(1, 2, 3, 4).contains(3, 4)");
		ok(range.contains(2, 4), "Asc.Range(1, 2, 3, 4).contains(2, 4)");
		ok(range.contains(1, 4), "Asc.Range(1, 2, 3, 4).contains(1, 4)");
		ok(range.contains(1, 3), "Asc.Range(1, 2, 3, 4).contains(1, 3)");
		ok(range.contains(2, 3), "Asc.Range(1, 2, 3, 4).contains(2, 3)");
		ok(!range.contains(2, 1), "!Asc.Range(1, 2, 3, 4).contains(2, 1)");
		ok(!range.contains(4, 3), "!Asc.Range(1, 2, 3, 4).contains(4, 3)");
		ok(!range.contains(2, 5), "!Asc.Range(1, 2, 3, 4).contains(2, 5)");
		ok(!range.contains(0, 3), "!Asc.Range(1, 2, 3, 4).contains(0, 3)");
		ok(!range.contains(4, 1), "!Asc.Range(1, 2, 3, 4).contains(4, 1)");
		ok(!range.contains(4, 5), "!Asc.Range(1, 2, 3, 4).contains(4, 5)");
		ok(!range.contains(0, 5), "!Asc.Range(1, 2, 3, 4).contains(0, 5)");
		ok(!range.contains(0, 1), "!Asc.Range(1, 2, 3, 4).contains(0, 1)");
	});

	test("Asc.Range.intersection", function test_RangeIntersection() {
		var range = new Asc.Range(2,4,10,12), r;

		strictEqual(range.intersection(Asc.Range(1,1,2,2)),     null, "Range(2,4,10,12) & Range(1,1,2,2)");
		strictEqual(range.intersection(Asc.Range(4,1,5,2)),     null, "Range(2,4,10,12) & Range(4,1,5,2)");
		strictEqual(range.intersection(Asc.Range(13,1,14,2)),   null, "Range(2,4,10,12) & Range(13,1,14,2)");
		strictEqual(range.intersection(Asc.Range(13,7,14,8)),   null, "Range(2,4,10,12) & Range(13,7,14,8)");
		strictEqual(range.intersection(Asc.Range(13,15,14,16)), null, "Range(2,4,10,12) & Range(13,15,14,16)");
		strictEqual(range.intersection(Asc.Range(8,15,9,16)),   null, "Range(2,4,10,12) & Range(8,15,9,16)");
		strictEqual(range.intersection(Asc.Range(0,13,1,14)),   null, "Range(2,4,10,12) & Range(0,13,1,14)");
		strictEqual(range.intersection(Asc.Range(0,5,1,6)),     null, "Range(2,4,10,12) & Range(0,5,1,6)");

		r = range.intersection( Asc.Range(1,3,3,5) );
		check_range(r, 2, 4, 3, 5, "Range(2,4,10,12) & Range(1,3,3,5)");
		r = range.intersection( Asc.Range(1,6,3,7) );
		check_range(r, 2, 6, 3, 7, "Range(2,4,10,12) & Range(1,6,3,7)");
		r = range.intersection( Asc.Range(1,11,3,13) );
		check_range(r, 2, 11, 3, 12, "Range(2,4,10,12) & Range(1,11,3,13)");

		r = range.intersection( Asc.Range(4,3,5,5) );
		check_range(r, 4, 4, 5, 5, "Range(2,4,10,12) & Range(4,3,5,5)");
		r = range.intersection( Asc.Range(4,6,5,7) );
		check_range(r, 4, 6, 5, 7, "Range(2,4,10,12) & Range(4,6,5,7)");
		r = range.intersection( Asc.Range(4,11,5,13) );
		check_range(r, 4, 11, 5, 12, "Range(2,4,10,12) & Range(4,11,5,13)");

		r = range.intersection( Asc.Range(9,3,11,5) );
		check_range(r, 9, 4, 10, 5, "Range(2,4,10,12) & Range(9,3,11,5)");
		r = range.intersection( Asc.Range(9,6,11,7) );
		check_range(r, 9, 6, 10, 7, "Range(2,4,10,12) & Range(9,6,11,7)");
		r = range.intersection( Asc.Range(9,11,11,13) );
		check_range(r, 9, 11, 10, 12, "Range(2,4,10,12) & Range(9,11,11,13)");

		r = range.intersection( Asc.Range(1,3,3,13) );
		check_range(r, 2, 4, 3, 12, "Range(2,4,10,12) & Range(1,3,3,13)");
		r = range.intersection( Asc.Range(6,3,7,13) );
		check_range(r, 6, 4, 7, 12, "Range(2,4,10,12) & Range(6,3,7,13)");
		r = range.intersection( Asc.Range(8,2,12,14) );
		check_range(r, 8, 4, 10, 12, "Range(2,4,10,12) & Range(8,2,12,14)");

		r = range.intersection( Asc.Range(1,3,11,5) );
		check_range(r, 2, 4, 10, 5, "Range(2,4,10,12) & Range(1,3,11,5)");
		r = range.intersection( Asc.Range(1,8,11,9) );
		check_range(r, 2, 8, 10, 9, "Range(2,4,10,12) & Range(1,8,11,9)");
		r = range.intersection( Asc.Range(1,11,11,13) );
		check_range(r, 2, 11, 10, 12, "Range(2,4,10,12) & Range(1,11,11,13)");
	});

	test("Asc.Range.union", function test_RangeUnion() {
		var range = new Asc.Range(2,4,10,12), r;

		r = range.union( Asc.Range(2,4,3,5) );
		check_range(r, 2, 4, 10, 12, "Range(2,4,10,12) | Range(2,4,3,5)");
		r = range.union( Asc.Range(9,3,13,5) );
		check_range(r, 2, 3, 13, 12, "Range(2,4,10,12) | Range(9,3,13,5)");
	});

	test("Asc.HandlersList", function test_HandlersList() {
		function handler1(msg) {
			equal(1, 1, msg+", handler1() is called");
		}
		function handler2(msg, p1) {
			equal(p1, "p1", msg+', handler2("p1") is called');
		}
		function handler3(msg) {
			equal(3, 3, msg+", handler3() is called");
		}

		var l1 = new Asc.HandlersList(),
		    l2 = Asc.HandlersList({}),
		    l3 = new Asc.HandlersList({"onEvent1":handler1, "onEvent2":handler2});

		expect(15);

		ok(l1 instanceof Asc.HandlersList, "new Asc.HandlersList() instanceof Asc.HandlersList");  //1
		ok(l2 instanceof Asc.HandlersList, "Asc.HandlersList({}) instanceof Asc.HandlersList");    //2

		l3.trigger("onEvent1", "trigger event without args");                                         //3
		l3.trigger("onEvent2", "trigger event with arg 'p1'", "p1");                                  //4

		l1.add("event3", handler3);
		l1.trigger("event3", "trigger event with handler added by 'add()'");                          //5

		strictEqual(l1.remove("event4"), false, "remove nonexistent event handler");                  //6
		strictEqual(l1.remove("event3"), true, "remove existent event handler");                      //7
		l1.trigger("event3", "trigger event with nonexistent handler");                               //-

		l1.add("event12", [handler1, handler2]);
		l1.trigger("event12", "trigger event with multiple handlers attached by single 'add()'", "p1");  //8,9

		l2.add("event2", handler1);
		l2.add("event2", handler2);
		l2.trigger("event2", "trigger event with 2 attached handlers", "p1");                         //10,11
		l2.remove("event2", handler2);
		l2.trigger("event2", "trigger event with second handler removed by 'remove()'");              //12

		l3.add("onEvent1", handler3);
		l3.trigger("onEvent1", "trigger event with second handler attached by 'add()'");              //13,14
		strictEqual(l3.remove("onEvent1"), true, "remove all handlers by 'remove()'");                //15
		l3.trigger("onEvent1", "trigger event with all handlers removed by 'remove()'");              //-
	});

});
