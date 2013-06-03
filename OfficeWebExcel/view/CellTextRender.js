/* CellTextRender.js
 *
 * Author: Dmitry.Sokolov@avsmedia.net
 * Date:   May 31, 2012
 */
(	/**
	 * @param {jQuery} $
	 * @param {Window} window
	 * @param {undefined} undefined
	 */
	function ($, window, undefined) {


		/*
		 * Import
		 * -----------------------------------------------------------------------------
		 */
		var asc = window["Asc"];
		var asc_lastindexof = asc.lastIndexOf;
		var asc_inherit = asc.inherit;
		var asc_SR      = asc.StringRender;


		function CharOffset(left, top, height, line) {
			this.left = left;
			this.top = top;
			this.height = height;
			this.lineIndex = line;
		}

		/**
		 * CellTextRender
		 * -----------------------------------------------------------------------------
		 * @param {DrawingContext} drawingCtx  Context for drawing on
		 *
		 * @constructor
		 * @memberOf Asc
		 */
		function CellTextRender(drawingCtx) {
			if ( !(this instanceof CellTextRender) ) {return new CellTextRender(drawingCtx);}

			CellTextRender.superclass.constructor.call(this, drawingCtx);

			return this;
		}

		var CellTextRender_methods = {

			/** @type RegExp */
			reWordBegining: XRegExp("[^\\p{L}\\p{N}][\\p{L}\\p{N}]", "i"),


			getLinesCount: function () {
				return this.lines.length;
			},

			getLineInfo: function (index) {
				return this.lines.length > 0 && index >=0 && index < this.lines.length ? this.lines[index] : null;
			},

			calcLineOffset: function (index) {
				for (var i = 0, h = 0, l = this.lines; i < index; ++i) {
					h += l[i].th;
				}
				return h;
			},


			getPrevChar: function (pos) {
				return pos <= 0 ? 0 : pos <= this.chars.length ? pos - 1 : this.chars.length;
			},

			getNextChar: function (pos) {
				return pos >= this.chars.length ? this.chars.length : pos >= 0 ? pos + 1 : 0;
			},

			getPrevWord: function (pos) {
				var i = asc_lastindexof(this.chars.slice(0, pos), this.reWordBegining);
				return i >= 0 ? i + 1 : 0;
			},

			getNextWord: function (pos) {
				var i = this.chars.slice(pos).search(this.reWordBegining);
				return pos + (i >= 0 ? i + 1 : 0);
			},

			getBeginOfLine: function (pos) {
				pos = pos < 0 ? 0 : Math.min(pos, this.chars.length);

				for (var l = this.lines, i = 0; i < l.length; ++i) {
					if (pos >= l[i].beg && pos <= l[i].end) {return l[i].beg;}
				}

				// pos - в конце текста
				var lastLine = l.length - 1;
				var lastChar = this.chars.length - 1;
				return this.charWidths[lastChar] !== 0 ? l[lastLine].beg : pos;
			},

			getEndOfLine: function (pos) {
				pos = pos < 0 ? 0 : Math.min(pos, this.chars.length);

				var l = this.lines;
				var lastLine = l.length - 1;
				for (var i = 0; i < lastLine; ++i) {
					if (pos >= l[i].beg && pos <= l[i].end) {return l[i].end;}
				}

				// pos - на последней линии
				var lastChar = this.chars.length - 1;
				return pos > lastChar ? pos : lastChar + (this.charWidths[lastChar] !== 0 ? 1 : 0);
			},

			getBeginOfText: function (pos) {
				return 0;
			},

			getEndOfText: function (pos) {
				return this.chars.length;
			},

			getPrevLine: function (pos) {
				pos = pos < 0 ? 0 : Math.min(pos, this.chars.length);

				for (var l = this.lines, i = 0; i < l.length; ++i) {
					if (pos >= l[i].beg && pos <= l[i].end) {
						return i <= 0 ? 0 : Math.min(l[i-1].beg + pos - l[i].beg, l[i-1].end);
					}
				}

				// pos - в конце текста
				var lastLine = l.length - 1;
				var lastChar = this.chars.length - 1;
				return this.charWidths[lastChar] === 0 || l.length < 2 ?
						(0 > lastLine ? 0 : l[lastLine].beg) :
						lastChar > 0 ? Math.min(l[lastLine-1].beg + pos - l[lastLine].beg, l[lastLine-1].end) : 0;
			},

			getNextLine: function (pos) {
				pos = pos < 0 ? 0 : Math.min(pos, this.chars.length);

				var l = this.lines;
				var lastLine = l.length - 1;
				for (var i = 0; i < lastLine; ++i) {
					if (pos >= l[i].beg && pos <= l[i].end) {
						return Math.min(l[i+1].beg + pos - l[i].beg, l[i+1].end);
					}
				}

				// pos - на последней линии
				return this.chars.length;
			},

			calcCharOffset: function (pos) {
				var t = this, l = t.lines, i = 0, h = 0, co;

				function getCharInfo(pos) {
					for (var p = t.charProps[pos]; (!p || !p.font) && pos > 0; --pos) {
						p = t.charProps[pos - 1];
					}
					return {
						fsz: p.font.FontSize,
						dh: p && p.lm && p.lm.bl2 > 0 ? p.lm.bl2 - p.lm.bl : 0
					};
				}

				function charOffset(lineIndex) {
					var ci = getCharInfo(pos);
					var li = l[lineIndex];
					return new CharOffset(
							li.startX + (pos > 0 ? t._calcCharsWidth(li.beg, pos - 1) : 0),
							h + li.bl - ci.fsz + ci.dh,
							ci.fsz,
							lineIndex);
				}

				if (l.length < 1) {return null;}

				if (pos < 0) {pos = 0;}
				if (pos > t.chars.length) {pos = t.chars.length;}

				for (i = 0, h = 0; i < l.length; ++i) {
					if (pos >= l[i].beg && pos <= l[i].end) {
						return charOffset(i);
					}
					if (i !== l.length - 1) {
						h += l[i].th;
					}
				}

				co = charOffset(i - 1);

				// если самый последний символ - это новая строка, то надо сместить еще на одну линию
				if (t.charWidths[t.chars.length - 1] === 0) {
					co.left = null;
					co.top += l[i - 1].th;
					co.lineIndex++;
				}

				return co;
			},

			calcCharHeight: function (pos) {
				var t = this;
				for (var p = t.charProps[pos]; (!p || !p.font) && pos > 0; --pos) {
					p = t.charProps[pos - 1];
				}
				return t._calcLineMetrics(
						p.fsz !== undefined ? p.fsz : p.font.FontSize, p.va, p.fm, t.drawingCtx.getPPIY());
			},


			getCharsCount: function () {
				return this.chars.length;
			},

			getChars: function (pos, len) {
				return this.chars.slice(pos, pos + len);
			},

			getCharWidth: function (pos) {
				return this.charWidths[pos];
			},

			isLastCharNL: function () {
				return this.charWidths[this.chars.length - 1] === 0;
			}

		};

		asc_inherit(CellTextRender, asc_SR, CellTextRender_methods);


		/*
		 * Export
		 * -----------------------------------------------------------------------------
		 */
		window["Asc"].CellTextRender = CellTextRender;


	}
)(jQuery, window);
