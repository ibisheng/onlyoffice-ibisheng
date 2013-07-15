/* Utils.js
 *
 * Author: Dmitry.Sokolov@avsmedia.net
 * Date:   Jan 25, 2012
 */
(	/**
	 * @param {jQuery} $
	 * @param {Window} window
	 * @param {undefined} undefined
	 */
	function ($, window, undefined) {

		var asc = window["Asc"] ? window["Asc"] : (window["Asc"] = {});
		var prot;


		/** @const */
		var kLeftLim1 = .999999999999999;

		/** @const */
		var kUndefinedL = "undefined";
		/** @const */
		var kNullL = "null";
		/** @const */
		var kObjectL = "object";
		/** @const */
		var kFunctionL = "function";
		/** @const */
		var kNumberL = "number";
		/** @const */
		var kArrayL = "array";


		function typeOf(obj) {
			if (obj === undefined) {return kUndefinedL;}
			if (obj === null) {return kNullL;}
			return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
		}

		function getProperty(name) {
			var n = name.split("."), r = undefined, i;

			function find(prop, obj) {
				if (obj === undefined || obj === null) {return undefined;}
				var ref = obj;
				for (var i = 0; i < prop.length; ++i) {
					var p = ref[ prop[i] ];
					if (p === undefined) {return undefined;}
					ref = p;
				}
				return ref;
			}

			for (i = 1; i < arguments.length; ++i) {
				if ( ( r = find(n, arguments[i]) ) !== undefined ) {break;}
			}
			return r;
		}


		function lastIndexOf(s, regExp, fromIndex) {
			var end = fromIndex >= 0 && fromIndex <= s.length ? fromIndex : s.length;
			for (var i = end - 1; i >= 0; --i) {
				var j = s.slice(i, end).search(regExp);
				if (j >= 0) {return i + j;}
			}
			return -1;
		}

		function search(arr, fn) {
			for (var i = 0; i < arr.length; ++i) {
				if ( fn(arr[i]) ) {return i;}
			}
			return -1;
		}


		function round(x) {
			var y = x + (x >= 0 ? .5 : -.4);
			return y | y;
			//return Math.round(x);
		}

		function floor(x) {
			var y = x | x;
			y -= x < 0 && y > x ? 1 : 0;
			return y + (x - y > kLeftLim1 ? 1 : 0); // to fix float number precision caused by binary presentation
			//return Math.floor(x);
		}

		function ceil(x) {
			var y = x | x;
			y += x > 0 && y < x ? 1 : 0;
			return y - (y - x > kLeftLim1 ? 1 : 0); // to fix float number precision caused by binary presentation
			//return Math.ceil(x);
		}

		function incDecFonSize (bIncrease, oValue) {
			// Закон изменения размеров :
			// Результатом должно быть ближайшее из отрезка [8,72] по следующим числам 8,9,10,11,12,14,16,18,20,22,24,26,28,36,48,72
			// Если значение меньше или равно 8 и мы уменьшаем, то ничего не меняется
			// Если значение больше или равно 72 и мы увеличиваем, то ничего не меняется

			var aSizes = [8,9,10,11,12,14,16,18,20,22,24,26,28,36,48,72];
			var nLength = aSizes.length;
			var i;
			if (true === bIncrease) {
				if (oValue >= aSizes[nLength - 1])
					return null;
				for (i = 0; i < nLength; ++i)
					if (aSizes[i] > oValue)
						break;
			} else {
				if (oValue <= aSizes[0])
					return null;
				for (i = nLength - 1; i >= 0; --i)
					if (aSizes[i] < oValue)
						break;
			}

			return aSizes[i];
		}


		function inherit(child, parent, childProto) {
			parent.prototype.constructor = parent;
			var F = function () {};
			F.prototype = parent.prototype;
			child.prototype = $.extend(true, new F(), childProto);
			child.prototype.constructor = child;
			child.superclass = parent.prototype;
		}

		// Определяет времени работы функции
		function profileTime(fn/*[, arguments]*/) {
			var start, end, arg = [], i;
			if (arguments.length) {
				if (arguments.length > 1) {
					for (i = 1; i < arguments.length; ++i)
						arg.push(arguments[i]);
					start = new Date();
					fn.apply(window, arg);
					end = new Date();
				} else {
					start = new Date();
					fn();
					end = new Date();
				}
				return end.getTime() - start.getTime();
			}
			return undefined;
		}


		/**
		 * Rectangle region of cells
		 * @constructor
		 * @memberOf Asc
		 * @param c1 {Number} Left side of range.
		 * @param r1 {Number} Top side of range.
		 * @param c2 {Number} Right side of range (inclusively).
		 * @param r2 {Number} Bottom side of range (inclusively).
		 * @param normalize {Boolean=} Optional. If true, range will be converted to form (left,top) - (right,bottom).
		 * @return {Range}
		 */
		function Range(c1, r1, c2, r2, normalize) {
			if ( !(this instanceof Range) ) {return new Range(c1, r1, c2, r2, normalize);}

			// if (typeOf(c1) !== kNumberL || typeOf(c2) !== kNumberL ||
			    // typeOf(r1) !== kNumberL || typeOf(r2) !== kNumberL) {
				// throw "Error: Range("+c1+","+r1+","+c2+","+r2+") - numerical args are expected";
			// }

			/** @type Number */
			this.c1 = c1;
			/** @type Number */
			this.r1 = r1;
			/** @type Number */
			this.c2 = c2;
			/** @type Number */
			this.r2 = r2;

			return normalize ? this.normalize() : this;
		}

		Range.prototype = {

			constructor: Range,

			assign: function (c1, r1, c2, r2, normalize) {
				if (typeOf(c1) !== kNumberL || typeOf(c2) !== kNumberL ||
				    typeOf(r1) !== kNumberL || typeOf(r2) !== kNumberL) {
					throw "Error: range.assign("+c1+","+r1+","+c2+","+r2+") - numerical args are expected";
				}
				this.c1 = c1;
				this.r1 = r1;
				this.c2 = c2;
				this.r2 = r2;
				return normalize ? this.normalize() : this;
			},

			clone: function (normalize) {
				return new Range(this.c1, this.r1, this.c2, this.r2, normalize);
			},

			normalize: function () {
				var tmp;
				if (this.c1 > this.c2){
					tmp = this.c1;
					this.c1 = this.c2;
					this.c2 = tmp;
				}
				if (this.r1 > this.r2){
					tmp = this.r1;
					this.r1 = this.r2;
					this.r2 = tmp;
				}
				return this;
			},

			isEqual: function (range) {
				return range && this.c1 === range.c1 && this.r1 === range.r1 && this.c2 === range.c2 && this.r2 === range.r2;
			},

			contains: function (c, r) {
				return this.c1 <= c && c <= this.c2 && this.r1 <= r && r <= this.r2;
			},

			intersection: function (range) {
				var s1 = this.clone(true),
				    s2 = range instanceof Range ? range.clone(true) :
				                                  new Range(range.c1, range.r1, range.c2, range.r2, true);

				if (s2.c1 > s1.c2 || s2.c2 < s1.c1 || s2.r1 > s1.r2 || s2.r2 < s1.r1) {return null;}

				return new Range(
						s2.c1 >= s1.c1 && s2.c1 <= s1.c2 ? s2.c1 : s1.c1,
						s2.r1 >= s1.r1 && s2.r1 <= s1.r2 ? s2.r1 : s1.r1,
						Math.min(s1.c2, s2.c2),
						Math.min(s1.r2, s2.r2));
			},

			union: function (range) {
				var s1 = this.clone(true),
				    s2 = range instanceof Range ? range.clone(true) :
				                                  new Range(range.c1, range.r1, range.c2, range.r2, true);

				return new Range(
						Math.min(s1.c1, s2.c1), Math.min(s1.r1, s2.r1),
						Math.max(s1.c2, s2.c2), Math.max(s1.r2, s2.r2));
			},
			
			union2: function (range) {
				this.c1 = Math.min(this.c1, range.c1);
				this.c2 = Math.max(this.c2, range.c2);
				this.r1 = Math.min(this.r1, range.r1);
				this.r2 = Math.max(this.r2, range.r2);
			}

		};


		/**
		 * @constructor
		 * @memberOf Asc
		 */
		function HandlersList(handlers) {
			if ( !(this instanceof HandlersList) ) {return new HandlersList(handlers);}
			this.handlers = handlers || {};
			return this;
		}

		HandlersList.prototype = {

			constructor: HandlersList,

			trigger: function (eventName) {
				var h = this.handlers[eventName], t = typeOf(h), a = Array.prototype.slice.call(arguments, 1), i;
				if (t === kFunctionL) {
					return h.apply(this, a);
				}
				if (t === kArrayL) {
					for (i = 0; i < h.length; i += 1) {
						if (typeOf(h[i]) === kFunctionL) {h[i].apply(this, a);}
					}
					return true;
				}
				return false;
			},

			add: function (eventName, eventHandler, replaceOldHandler) {
				var th = this.handlers, h, old, t;
				if (replaceOldHandler || !th.hasOwnProperty(eventName)) {
					th[eventName] = eventHandler;
				} else {
					old = h = th[eventName];
					t = typeOf(old);
					if (t !== kArrayL) {
						h = th[eventName] = [];
						if (t === kFunctionL) {h.push(old);}
					}
					h.push(eventHandler);
				}
			},

			remove: function (eventName, eventHandler) {
				var th = this.handlers, h = th[eventName], i;
				if (th.hasOwnProperty(eventName)) {
					if (typeOf(h) !== kArrayL || typeOf(eventHandler) !== kFunctionL) {
						delete th[eventName];
						return true;
					}
					for (i = h.length - 1; i >= 0; i -= 1) {
						if (h[i] === eventHandler) {
							delete h[i];
							return true;
						}
					}
				}
				return false;
			}

		};


		function outputDebugStr(channel) {
			var c = window.console;
			if (asc.g_debug_mode && c && c[channel] && c[channel].apply) {
				c[channel].apply(this, Array.prototype.slice.call(arguments, 1));
			}
		}


		function isEqual(Obj1, Obj2)
		{
			if(null == Obj1 && null == Obj2)
				return true;
		    if(!Obj1 || !Obj2 || typeof(Obj1) != typeof(Obj2))
		        return false;
		    var p, v1, v2;
		    //проверяем чтобы Obj1 имел теже свойства что и Obj2
		    for(p in Obj2)
		    {
		        if(Obj2.hasOwnProperty(p) &&  !Obj1.hasOwnProperty(p))
		            return false;
		    }
		    //проверяем чтобы Obj2 имел теже свойства что и Obj1 и сравниваем их
		    for(p in Obj1)
		    {
		        if(Obj1.hasOwnProperty(p))
				{
					if(!Obj2.hasOwnProperty(p))
						return false;
					
					v1 = Obj1[p];
					v2 = Obj2[p];
					if(v1 && v2 && kObjectL === typeof(v1) && kObjectL === typeof(v2) )
					{
						if( false == isEqual(v1, v2))
							return false;
					}
					else
					{
						if(v1 != v2)
							return false;
					}
				}
		    }
		    return true;
		}

		// $.extend не копирует объекты созданные с помощью конструктора, поэтому используем свою реализацию
		function clone(Obj)
		{
			if( !Obj || !(kObjectL == typeof(Obj) || kArrayL == typeof(Obj)) )
			{
				return Obj;
			}

			var c = kFunctionL === typeof Obj.pop ? [] : {};
			var p, v;
			for(p in Obj)
			{
				if(Obj.hasOwnProperty(p))
				{
					v = Obj[p];
					if(v && kObjectL === typeof v )
					{
						c[p] = clone(v);
					}
					else
					{
						c[p] = v;
					}
				}
			}
			return c;
		}
		
		function trim(val)
		{
			if(!String.prototype.trim)
				return val.trim();
			else
				return val.replace(/^\s+|\s+$/g,'');  
		}
		
		function isNumber(val) {
			var valTrim = trim(val);
			return (valTrim - 0) == valTrim && valTrim.length > 0;
		}

		//-----------------------------------------------------------------
		// События движения мыши
		//-----------------------------------------------------------------
		function asc_CMouseMoveData (obj) {
			if ( !(this instanceof asc_CMouseMoveData) ) {
				return new asc_CMouseMoveData(obj);
			}
			
			if (obj) {
				this.type = obj.type;
				this.x = obj.x;
				this.reverseX = obj.reverseX;	// Отображать комментарий слева от ячейки
				this.y = obj.y;
				this.hyperlink = obj.hyperlink;
				this.aCommentIndexes = obj.aCommentIndexes;
				this.userId = obj.userId;
				this.lockedObjectType = obj.lockedObjectType;
			}

			return this;
		}
		asc_CMouseMoveData.prototype = {
			constructor: asc_CMouseMoveData,
			asc_getType: function () { return this.type; },
			asc_getX: function () { return this.x; },
			asc_getReverseX: function () { return this.reverseX; },
			asc_getY: function () { return this.y; },
			asc_getHyperlink: function () { return this.hyperlink; },
			asc_getCommentIndexes: function () { return this.aCommentIndexes; },
			asc_getUserId: function () { return this.userId; },
			asc_getLockedObjectType: function () { return this.lockedObjectType; }
		};

		// Гиперссылка
		function asc_CHyperlink (obj) {
			if ( !(this instanceof asc_CHyperlink) ) {
				return new asc_CHyperlink(obj);
			}
			
			if (obj) {
				this.type = obj.type;
				this.hyperlinkUrl = obj.hyperlinkUrl;
				this.tooltip = obj.tooltip;
				this.location = obj.location;
				this.sheet = obj.sheet;
				this.range = obj.range;
				this.hyperlinkRange = obj.hyperlinkRange;
				this.text = obj.text;
				this.col = obj.col;
				this.row = obj.row;
			}
			else {
				this.asc_clear();
			}

			return this;
		}
		asc_CHyperlink.prototype = {
			constructor: asc_CHyperlink,
			asc_getType: function () { return this.type; },
			asc_getHyperlinkUrl: function () { return this.hyperlinkUrl; },
			asc_getTooltip: function () { return this.tooltip; },
			asc_getLocation: function () { return this.location; },
			asc_getSheet: function () { return this.sheet; },
			asc_getRange: function () { return this.range; },
			asc_getHyperlinkRange: function () { return this.hyperlinkRange; },
			asc_getText: function () { return this.text; },
			asc_getHyperlinkCol: function () {return this.col;},
			asc_getHyperlinkRow: function () {return this.row;},
			asc_setType: function (val) { this.type = val; },
			asc_setHyperlinkUrl: function (val) { this.hyperlinkUrl = val; },
			asc_setTooltip: function (val) { this.tooltip = val; },
			asc_setLocation: function (val) { this.location = val; },
			asc_setSheet: function (val) { this.sheet = val; },
			asc_setRange: function (val) { this.range = val; },
			asc_setHyperlinkRange: function (val) { this.hyperlinkRange = val; },
			asc_setText: function (val) { this.text = val; },
			asc_setHyperlinkCol: function (val) {this.col = val;},
			asc_setHyperlinkRow: function (val) {this.row = val;},

			asc_clear: function () {
				this.type = null;
				this.hyperlinkUrl = null;
				this.tooltip = null;
				this.location = null;
				this.sheet = null;
				this.range = null;
				this.hyperlinkRange = null;
				this.text = null;
			},
			asc_clone: function () {
				return new asc_CHyperlink(this);
			}
		};

		function asc_CPageMargins (obj) {
			if ( !(this instanceof asc_CPageMargins) ) {
				return new asc_CPageMargins(obj);
			}

			if (obj) {
				this.left = obj.left;
				this.right = obj.right;
				this.top = obj.top;
				this.bottom = obj.bottom;
			}

			return this;
		}
		asc_CPageMargins.prototype = {
			asc_getLeft: function () { return this.left; },
			asc_getRight: function () { return this.right; },
			asc_getTop: function () { return this.top; },
			asc_getBottom: function () { return this.bottom; },
			asc_setLeft: function (val) { this.left = val; },
			asc_setRight: function (val) { this.right = val; },
			asc_setTop: function (val) { this.top = val; },
			asc_setBottom: function (val) { this.bottom = val; }
		};
		function asc_CPageSetup (obj) {
			if ( !(this instanceof asc_CPageSetup) ) {
				return new asc_CPageSetup(obj);
			}

			if (obj) {
				this.orientation = obj.orientation;
				this.width = obj.width;
				this.height = obj.height;
			}

			return this;
		}
		asc_CPageSetup.prototype = {
			asc_getOrientation: function () { return this.orientation; },
			asc_getWidth: function () { return this.width; },
			asc_getHeight: function () { return this.height; },
			asc_setOrientation: function (val) { this.orientation = val; },
			asc_setWidth: function (val) { this.width = val; },
			asc_setHeight: function (val) { this.height = val; }
		};
		function asc_CPageOptions (obj) {
			if ( !(this instanceof asc_CPageOptions) ) {
				return new asc_CPageOptions(obj);
			}

			if (obj) {
				this.pageMargins = obj.pageMargins;
				this.pageSetup = obj.pageSetup;
				this.gridLines = obj.gridLines;
				this.headings = obj.headings;
			}

			return this;
		}
		asc_CPageOptions.prototype = {
			asc_getPageMargins: function () { return this.pageMargins; },
			asc_getPageSetup: function () { return this.pageSetup; },
			asc_getGridLines: function () { return this.gridLines; },
			asc_getHeadings: function () { return this.headings; },
			asc_setPageMargins: function (val) { this.pageMargins = val; },
			asc_setPageSetup: function (val) { this.pageSetup = val; },
			asc_setGridLines: function (val) { this.gridLines = val; },
			asc_setHeadings: function (val) { this.headings = val; }
		};
		function CPagePrint () {
			if ( !(this instanceof CPagePrint) ) {
				return new CPagePrint();
			}

			this.pageWidth = 0;
			this.pageHeight = 0;

			this.pageClipRectLeft = 0;
			this.pageClipRectTop = 0;
			this.pageClipRectWidth = 0;
			this.pageClipRectHeight = 0;

			this.pageRange = null;

			this.leftFieldInPt = 0;
			this.topFieldInPt = 0;
			this.rightFieldInPt = 0;
			this.bottomFieldInPt = 0;

			this.pageGridLines = false;
			this.pageHeadings = false;

			this.indexWorksheet = -1;

			this.startOffset = 0;
			this.startOffsetPt = 0;

			return this;
		}
		function CPrintPagesData () {
			if ( !(this instanceof CPrintPagesData) ) {
				return new CPrintPagesData();
			}
			this.arrPages = null;
			this.currentIndex = 0;
			this.c_maxPagesCount = 10;

			return this;
		}
		function asc_CAdjustPrint () {
			if ( !(this instanceof asc_CAdjustPrint) ) {
				return new asc_CAdjustPrint();
			}
			// Вид печати
			this.printType = c_oAscPrintType.ActiveSheets;
			// Вид печати
			this.layoutPageType = c_oAscLayoutPageType.ActualSize;

			return this;
		}
		asc_CAdjustPrint.prototype = {
			constructor: asc_CAdjustPrint,
			asc_getPrintType: function () { return this.printType; },
			asc_getLayoutPageType: function () { return this.layoutPageType; },
			asc_setPrintType: function (val) { this.printType = val; },
			asc_setLayoutPageType: function (val) { this.layoutPageType = val; }
		};

		function asc_CLockInfo () {
			if (!(this instanceof  asc_CLockInfo)) {
				return new asc_CLockInfo();
			}
			this["sheetId"] = null;
			this["type"] = null;
			this["subType"] = null;
			this["guid"] = null;
			this["rangeOrObjectId"] = null;
		}

		function asc_CCollaborativeRange (c1, r1, c2, r2) {
			if (!(this instanceof asc_CCollaborativeRange)) {
				return new asc_CCollaborativeRange(c1, r1, c2, r2);
			}
			this["c1"] = c1;
			this["r1"] = r1;
			this["c2"] = c2;
			this["r2"] = r2;
		}

		function asc_CSheetViewSettings () {
			if (!(this instanceof asc_CSheetViewSettings)) {
				return new asc_CSheetViewSettings();
			}

			this.Properties = {
				showGridLines		: 0,
				showRowColHeaders	: 1
			};

			// Показывать ли сетку
			this.showGridLines = null;
			// Показывать обозначения строк и столбцов
			this.showRowColHeaders = null;

			return this;
		}

		asc_CSheetViewSettings.prototype = {
			constructor: asc_CSheetViewSettings,
			clone: function () {
				var result = new asc_CSheetViewSettings();
				result.showGridLines = this.showGridLines;
				result.showRowColHeaders = this.showRowColHeaders;
				return result;
			},
			isEqual: function (settings) {
				return this.asc_getShowGridLines() === settings.asc_getShowGridLines() &&
					this.asc_getShowRowColHeaders() === settings.asc_getShowRowColHeaders();
			},
			setSettings: function (settings) {
				this.showGridLines = settings.showGridLines;
				this.showRowColHeaders = settings.showRowColHeaders;
			},
			asc_getShowGridLines: function () { return false !== this.showGridLines; },
			asc_getShowRowColHeaders: function () { return false !== this.showRowColHeaders; },
			asc_setShowGridLines: function (val) { this.showGridLines = val; },
			asc_setShowRowColHeaders: function (val) { this.showRowColHeaders = val; },
			getType : function () {
				return UndoRedoDataTypes.SheetViewSettings;
			},
			getProperties : function () {
				return this.Properties;
			},
			getProperty : function (nType) {
				switch (nType) {
					case this.Properties.showGridLines: return this.showGridLines;break;
					case this.Properties.showRowColHeaders: return this.showRowColHeaders;break;
				}
			},
			setProperty : function (nType, value) {
				switch (nType) {
					case this.Properties.showGridLines: this.showGridLines = value;break;
					case this.Properties.showRowColHeaders: this.sheet = showRowColHeaders;break;
				}
			}
		};

		function RedoObjectParam () {
			if (!(this instanceof RedoObjectParam)) {
				return new RedoObjectParam();
			}

			this.bIsOn = false;
			this.aStartTriggerAction = {};
			this.bIsReInit = false;
		}

		/** @constructor */
		function CBorderUtils () {
			/**
			 * cell border styles
			 * @const
			 */
			this.kcbNone             = "none";
			this.kcbThick            = "thick";
			this.kcbThin             = "thin";
			this.kcbMedium           = "medium";
			this.kcbDashDot          = "dashDot";
			this.kcbDashDotDot       = "dashDotDot";
			this.kcbDashed           = "dashed";
			this.kcbDotted           = "dotted";
			this.kcbDouble           = "double";
			this.kcbHair             = "hair";
			this.kcbMediumDashDot    = "mediumDashDot";
			this.kcbMediumDashDotDot = "mediumDashDotDot";
			this.kcbMediumDashed     = "mediumDashed";
			this.kcbSlantDashDot     = "slantDashDot";

			this.kcbThinBorders      = [this.kcbThin, this.kcbDashDot, this.kcbDashDotDot, this.kcbDashed, this.kcbDotted, this.kcbHair];
			this.kcbMediumBorders    = [this.kcbMedium, this.kcbMediumDashDot, this.kcbMediumDashDotDot, this.kcbMediumDashed, this.kcbSlantDashDot];
			this.kcbThickBorders     = [this.kcbThick, this.kcbDouble];
		}

		CBorderUtils.prototype = {
			_isThinBorder	: function (bs) { return $.inArray(bs, this.kcbThinBorders) >= 0; },
			_isMediumBorder	: function (bs) { return $.inArray(bs, this.kcbMediumBorders) >= 0; },
			_isThickBorder	: function (bs) { return $.inArray(bs, this.kcbThickBorders) >= 0; },
			calcBorderWidth	: function (b) {
				var s = b.s;
				return b === undefined ? 0 : (
					this._isThinBorder(s) ? 1 : (
						this._isMediumBorder(s) ? 2 : (
							this._isThickBorder(s) ? 3 : 0)));
			}
		};

		/** @constructor */
		function asc_CStyleImage(name, thumbnailOffset, type) {
			this.name = name;
			this.thumbnailOffset = thumbnailOffset;
			this.type = type;
		}

		asc_CStyleImage.prototype = {
			constructor: asc_CStyleImage,
			asc_getName: function () { return this.name; },
			asc_getThumbnailOffset: function () { return this.thumbnailOffset; },
			asc_getType: function () { return this.type; }
		};

		/** @constructor */
		function asc_CStylesPainter() {
			// base64 defaultStyles image
			this.defaultStylesImage = "";
			this.defaultStyles = null;

			// base64 docStyles image
			this.docStylesImage = "";
			this.docStyles = null;

			this.styleThumbnailWidth	= 80;
			this.styleThumbnailHeight	= 18;
			this.styleThumbnailWidthPt	= this.styleThumbnailWidth * 72 / 96;
			this.styleThumbnailHeightPt	= this.styleThumbnailHeight * 72 / 96;

			this.oBorderUtils = new CBorderUtils();
		}

		asc_CStylesPainter.prototype = {
			constructor: asc_CStylesPainter,
			asc_getStyleThumbnailWidth: function () { return this.styleThumbnailWidth; },
			asc_getStyleThumbnailHeight: function () { return this.styleThumbnailHeight; },
			asc_getDefaultStyles: function () { return this.defaultStyles; },
			asc_getDocStyles: function () { return this.docStyles; },
			asc_getDefaultStylesImage: function () { return this.defaultStylesImage; },
			asc_getDocStylesImage: function () { return this.docStylesImage; },
			generateStylesAll: function (cellStylesAll, fmgrGraphics, stringRenderer) {
				this.generateDefaultStyles(cellStylesAll, fmgrGraphics, stringRenderer);
				this.generateDocumentStyles(cellStylesAll, fmgrGraphics, stringRenderer);
			},
			generateDefaultStyles: function (cellStylesAll, fmgrGraphics, stringRenderer) {
				var nDefaultStylesCount = cellStylesAll.getDefaultStylesCount();
				var cellStyles = cellStylesAll.DefaultStyles;
				var nLength = cellStyles.length;
				var oCanvas = document.createElement('canvas');
				oCanvas.width = this.styleThumbnailWidth;
				oCanvas.height = nDefaultStylesCount * this.styleThumbnailHeight;
				var ctx = oCanvas.getContext('2d');
				ctx.fillStyle = "#FFFFFF";
				ctx.fillRect(0, 0, oCanvas.width, oCanvas.height);

				var oGraphics = asc.DrawingContext({canvas: oCanvas, units: 1/*pt*/, fmgrGraphics: fmgrGraphics});

				var oStyle = null;
				this.defaultStyles = [];
				for (var i = 0, styleIndex = 0; i < nLength; ++i) {
					oStyle = cellStyles[i];
					if (oStyle.Hidden)
						continue;
					this.defaultStyles[i] = new asc_CStyleImage(oStyle.Name, styleIndex, c_oAscStyleImage.Default);
					this.drawStyle(oGraphics, stringRenderer, oStyle, styleIndex);
					++styleIndex;
				}

				this.defaultStylesImage = oCanvas.toDataURL("image/png");
			},
			generateDocumentStyles: function (cellStylesAll, fmgrGraphics, stringRenderer) {
				var nDocumentStylesCount = cellStylesAll.getCustomStylesCount();
				var cellStyles = cellStylesAll.CustomStyles;
				var nLength = cellStyles.length;
				var oCanvas = document.createElement('canvas');
				oCanvas.width = this.styleThumbnailWidth;
				oCanvas.height = nDocumentStylesCount * this.styleThumbnailHeight;
				var ctx = oCanvas.getContext('2d');
				ctx.fillStyle = "#FFFFFF";
				ctx.fillRect(0, 0, oCanvas.width, oCanvas.height);

				var oGraphics = asc.DrawingContext({canvas: oCanvas, units: 1/*pt*/, fmgrGraphics: fmgrGraphics});

				var oStyle = null;
				this.docStyles = [];
				for (var i = 0, styleIndex = 0; i < nLength; ++i) {
					oStyle = cellStyles[i];
					if (oStyle.Hidden || null != oStyle.BuiltinId)
						continue;
					this.docStyles[styleIndex] = new asc_CStyleImage(oStyle.Name, styleIndex, c_oAscStyleImage.Document);
					this.drawStyle(oGraphics, stringRenderer, oStyle, styleIndex);
					++styleIndex;
				}

				this.docStylesImage = oCanvas.toDataURL("image/png");
			},
			drawStyle: function (oGraphics, stringRenderer, oStyle, nIndex) {
				var nOffsetY = nIndex * this.styleThumbnailHeightPt;

				// Fill cell
				var bg = oStyle.getFill();
				if(null != bg)
					bg = bg.getRgb();
				var oColor = bg !== null ? asc.numberToCSSColor(bg) : "#FFFFFF";
				oGraphics.save().beginPath().setFillStyle(oColor);
				oGraphics.rect(0, nOffsetY, this.styleThumbnailWidthPt, this.styleThumbnailHeightPt).clip();
				oGraphics.fill();

				var bc, bw;
				var t = this;
				var drawBorder = function (b, x1, y1, x2, y2) {
					if (null != b && "none" != b.s) {
						bc = asc.numberToCSSColor(b.c.getRgb());
						oGraphics.setStrokeStyle(bc);

						bw = t.oBorderUtils.calcBorderWidth(b);
						if (0 < bw) {
							oGraphics.setLineWidth(bw).beginPath().moveTo(x1, y1).lineTo(x2, y2).stroke();
						}
					}
				};

				// borders
				var oBorders = oStyle.getBorder();
				drawBorder(oBorders.l, 0, nOffsetY,
					0, nOffsetY + this.styleThumbnailHeightPt);
				drawBorder(oBorders.r, this.styleThumbnailWidthPt, nOffsetY,
					this.styleThumbnailWidthPt, nOffsetY + this.styleThumbnailHeightPt);
				drawBorder(oBorders.t, 0, nOffsetY,
					this.styleThumbnailWidthPt, nOffsetY);
				drawBorder(oBorders.t, 0, nOffsetY + this.styleThumbnailHeightPt,
					this.styleThumbnailWidthPt, nOffsetY + this.styleThumbnailHeightPt);

				// Draw text
				var fc = oStyle.getFontColor();
				if(null != fc)
					fc = fc.getRgb();
				var oFontColor = fc !== null ? asc.numberToCSSColor(fc) : "#000000";
				var format = oStyle.getFont();
				var oFont = new asc.FontProperties(format.fn, format.fs, format.b, format.i, format.u, format.s);

				var tm = stringRenderer.measureString(oStyle.Name);
				oGraphics.setFont(oFont);
				oGraphics.setFillStyle(oFontColor);
				oGraphics.fillText(oStyle.Name, 0, nOffsetY + tm.baseline);
				oGraphics.restore();
			}
		};

		/*
		 * Export
		 * -----------------------------------------------------------------------------
		 */
		window["Asc"].typeOf = typeOf;
		window["Asc"].getProperty = getProperty;
		window["Asc"].lastIndexOf = lastIndexOf;
		window["Asc"].search = search;
		window["Asc"].round = round;
		window["Asc"].floor = floor;
		window["Asc"].ceil = ceil;
		window["Asc"].incDecFonSize = incDecFonSize;
		window["Asc"].inherit = inherit;
		window["Asc"].outputDebugStr = outputDebugStr;
		window["Asc"].isEqual = isEqual;
		window["Asc"].clone = clone;
		window["Asc"].profileTime = profileTime;
		window["Asc"].isNumber = isNumber;
		window["Asc"].trim = trim;

		window["Asc"].Range = Range;
		prot = Range.prototype;
		prot.assign = prot.assign;
		prot.clone = prot.clone;
		prot.normalize = prot.normalize;
		prot.isEqual = prot.isEqual;
		prot.contains = prot.contains;
		prot.intersection = prot.intersection;
		prot.union = prot.union;

		window["Asc"].HandlersList = HandlersList;
		prot = HandlersList.prototype;
		prot.trigger = prot.trigger;
		prot.add = prot.add;
		prot.remove = prot.remove;

		window["Asc"].RedoObjectParam = RedoObjectParam;

		window["Asc"]["asc_CMouseMoveData"] = window["Asc"].asc_CMouseMoveData = asc_CMouseMoveData;
		prot = asc_CMouseMoveData.prototype;
		prot["asc_getType"] = prot.asc_getType;
		prot["asc_getX"] = prot.asc_getX;
		prot["asc_getReverseX"] = prot.asc_getReverseX;
		prot["asc_getY"] = prot.asc_getY;
		prot["asc_getHyperlink"] = prot.asc_getHyperlink;		
		prot["asc_getCommentIndexes"] = prot.asc_getCommentIndexes;
		prot["asc_getUserId"] = prot.asc_getUserId;
		prot["asc_getLockedObjectType"] = prot.asc_getLockedObjectType;

		window["Asc"]["asc_CHyperlink"] = window["Asc"].asc_CHyperlink = asc_CHyperlink;
		prot = asc_CHyperlink.prototype;
		prot["asc_getType"] = prot.asc_getType;
		prot["asc_getHyperlinkUrl"] = prot.asc_getHyperlinkUrl;
		prot["asc_getTooltip"] = prot.asc_getTooltip;
		prot["asc_getLocation"] = prot.asc_getLocation;
		prot["asc_getSheet"] = prot.asc_getSheet;
		prot["asc_getRange"] = prot.asc_getRange;
		prot["asc_getHyperlinkRange"] = prot.asc_getHyperlinkRange;
		prot["asc_getText"] = prot.asc_getText;
		prot["asc_setType"] = prot.asc_setType;
		prot["asc_setHyperlinkUrl"] = prot.asc_setHyperlinkUrl;
		prot["asc_setTooltip"] = prot.asc_setTooltip;
		prot["asc_setLocation"] = prot.asc_setLocation;
		prot["asc_setSheet"] = prot.asc_setSheet;
		prot["asc_setRange"] = prot.asc_setRange;
		prot["asc_setHyperlinkRange"] = prot.asc_setHyperlinkRange;
		prot["asc_setText"] = prot.asc_setText;
		prot["asc_clear"] = prot.asc_clear;
		prot["asc_clone"] = prot.asc_clone;


		window["Asc"]["asc_CPageMargins"] = window["Asc"].asc_CPageMargins = asc_CPageMargins;
		prot = asc_CPageMargins.prototype;
		prot["asc_getLeft"] = prot.asc_getLeft;
		prot["asc_getRight"] = prot.asc_getRight;
		prot["asc_getTop"] = prot.asc_getTop;
		prot["asc_getBottom"] = prot.asc_getBottom;
		prot["asc_setLeft"] = prot.asc_setLeft;
		prot["asc_setRight"] = prot.asc_setRight;
		prot["asc_setTop"] = prot.asc_setTop;
		prot["asc_setBottom"] = prot.asc_setBottom;

		window["Asc"]["asc_CPageSetup"] = window["Asc"].asc_CPageSetup = asc_CPageSetup;
		prot = asc_CPageSetup.prototype;
		prot["asc_getOrientation"] = prot.asc_getOrientation;
		prot["asc_getWidth"] = prot.asc_getWidth;
		prot["asc_getHeight"] = prot.asc_getHeight;
		prot["asc_setOrientation"] = prot.asc_setOrientation;
		prot["asc_setWidth"] = prot.asc_setWidth;
		prot["asc_setHeight"] = prot.asc_setHeight;

		window["Asc"]["asc_CPageOptions"] = window["Asc"].asc_CPageOptions = asc_CPageOptions;
		prot = asc_CPageOptions.prototype;
		prot["asc_getPageMargins"] = prot.asc_getPageMargins;
		prot["asc_getPageSetup"] = prot.asc_getPageSetup;
		prot["asc_getGridLines"] = prot.asc_getGridLines;
		prot["asc_getHeadings"] = prot.asc_getHeadings;
		prot["asc_setPageMargins"] = prot.asc_setPageMargins;
		prot["asc_setPageSetup"] = prot.asc_setPageSetup;
		prot["asc_setGridLines"] = prot.asc_setGridLines;
		prot["asc_setHeadings"] = prot.asc_setHeadings;

		window["Asc"].CPagePrint = CPagePrint;
		window["Asc"].CPrintPagesData = CPrintPagesData;

		window["Asc"]["asc_CAdjustPrint"] = window["Asc"].asc_CAdjustPrint = asc_CAdjustPrint;
		prot = asc_CAdjustPrint.prototype;
		prot["asc_getPrintType"] = prot.asc_getPrintType;
		prot["asc_getLayoutPageType"] = prot.asc_getLayoutPageType;
		prot["asc_setPrintType"] = prot.asc_setPrintType;
		prot["asc_setLayoutPageType"] = prot.asc_setLayoutPageType;

		window["Asc"].asc_CLockInfo = asc_CLockInfo;

		window["Asc"].asc_CCollaborativeRange = asc_CCollaborativeRange;

		window["Asc"]["asc_CSheetViewSettings"] = window["Asc"].asc_CSheetViewSettings = asc_CSheetViewSettings;
		prot = asc_CSheetViewSettings.prototype;
		prot["asc_getShowGridLines"] = prot.asc_getShowGridLines;
		prot["asc_getShowRowColHeaders"] = prot.asc_getShowRowColHeaders;
		prot["asc_setShowGridLines"] = prot.asc_setShowGridLines;
		prot["asc_setShowRowColHeaders"] = prot.asc_setShowRowColHeaders;

		window["Asc"].CBorderUtils = CBorderUtils;
		prot = CBorderUtils.prototype;
		prot["calcBorderWidth"] = prot.calcBorderWidth;

		window["Asc"]["asc_CStyleImage"] = window["Asc"].asc_CStyleImage = asc_CStyleImage;
		prot = asc_CStyleImage.prototype;
		prot["asc_getName"] = prot.asc_getName;
		prot["asc_getThumbnailOffset"] = prot.asc_getThumbnailOffset;
		prot["asc_getType"] = prot.asc_getType;

		window["Asc"]["asc_CStylesPainter"] = window["Asc"].asc_CStylesPainter = asc_CStylesPainter;
		prot = asc_CStylesPainter.prototype;
		prot["asc_getStyleThumbnailWidth"] = prot.asc_getStyleThumbnailWidth;
		prot["asc_getStyleThumbnailHeight"] = prot.asc_getStyleThumbnailHeight;
		prot["asc_getDefaultStyles"] = prot.asc_getDefaultStyles;
		prot["asc_getDocStyles"] = prot.asc_getDocStyles;
		prot["asc_getDefaultStylesImage"] = prot.asc_getDefaultStylesImage;
		prot["asc_getDocStylesImage"] = prot.asc_getDocStylesImage;

}
)(jQuery, window);
