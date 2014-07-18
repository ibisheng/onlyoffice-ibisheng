"use strict";

/* PopUpSelector.js
 *
 * Author: Alexander.Trofimov@avsmedia.net
 * Date:   April 7, 2014
 */
(	/**
 	 * @param {jQuery} $
 	 * @param {Window} window
 	 * @param {undefined} undefined
 	 */
	function($, window, undefined) {
		var asc		= window["Asc"];
		var asc_HL	= asc.HandlersList;

		function PopUpSelector(element, handlers) {
			this.handlers		= new asc_HL(handlers);

			this.scrollOptions = {
				wheelPropagation	: false,
				minScrollbarLength	: null,
				useBothWheelAxes	: false,
				useKeyboard			: true,
				suppressScrollX		: false,
				suppressScrollY		: false,
				scrollXMarginOffset	: 5,
				scrollYMarginOffset	: 40,
				includePadding		: false
			};

			this.element		= element;
			this.selector		= null;
			this.selectorStyle	= null;
			this.selectorList	= null;
			this.selectorListEl	= [];
			this.selectorListJQ	= null;
			this.selectElement	= null;
			this.firstElement	= null;

			this.isFormula		= false;
			this.isVisible		= false;

			this.skipClose		= false;

			this.fMouseDown		= null;
			this.fMouseDblClick	= null;
			this.fMouseOver		= null;

			this._init();
			return this;
		}
		PopUpSelector.prototype._init = function () {
			var t = this;
			if (null != this.element) {
				this.selector = document.createElement('div');
				this.selectorStyle = this.selector.style;
				this.selector.id = 'apiPopUpSelector';
				this.selector.className = 'combobox';
				this.selector.innerHTML = '<ul id="apiPopUpList" class="dropdown-menu"></ul>';

				this.element.appendChild(this.selector);
				this.selectorList = document.getElementById('apiPopUpList');

				this.fMouseDown = function (event) {t._onMouseDown(event);};
				this.fMouseDblClick = function (event) {t._onMouseDblClick(event);};
				this.fMouseOver = function (event) {t._onMouseOver(event);};

				if (this.selector.addEventListener) {
					this.selector.addEventListener('mousedown', function () {
						t.skipClose = true;
					}, false);
				}
				if (window.addEventListener) {
					window.addEventListener('mousedown', function () {
						if (t.skipClose) {
							t.skipClose = false;
							return;
						}
						t.hide();
					}, false);
				}

				// Для того, чтобы работал scroll
				this.selectorListJQ = $('#apiPopUpList');
				if (this.selectorListJQ.perfectScrollbar)
					this.selectorListJQ.perfectScrollbar(this.scrollOptions);

				this.setAlwaysVisibleY(true);
			}
		};
		PopUpSelector.prototype.show = function (isFormula, arrItems, cellRect) {
			this._clearList();
			if (!this.isVisible) {
				this.selector.className = 'combobox open';
				this.isVisible = true;
			}
			this.isFormula = isFormula;

			var item, isFirst, value, selectElement = null;
			for (var i = 0; i < arrItems.length; ++i) {
				item = document.createElement('li');
				isFirst = (0 === i);
				if (isFirst)
					this.firstElement = item;

				if (this.isFormula) {
					if (isFirst)
						selectElement = item;

					value = arrItems[i].name;
					item.setAttribute('title', arrItems[i].arg);
				} else
					value = arrItems[i];

				item.innerHTML = '<a>' + value + '</a>';
				item.setAttribute('val', value);

				if (item.addEventListener) {
					item.addEventListener('mousedown'	, this.fMouseDown		, false);
					item.addEventListener('dblclick'	, this.fMouseDblClick	, false);
					if (!this.isFormula) {
						item.addEventListener('mouseover', this.fMouseOver, false);
					}
				}

				this.selectorList.appendChild(item);
				this.selectorListEl.push(item);
			}

			this.setPosition(cellRect);

			// Для того, чтобы работал scroll
			this.selectorListJQ.perfectScrollbar("update");

			this._onChangeSelection(selectElement);
		};
		PopUpSelector.prototype.hide = function () {
			if (this.isVisible) {
				// Чтобы не было непонятных анимаций
				this.selectorListJQ.scrollTop(0);

				this.selector.className = 'combobox';
				this.isVisible = false;

				this._clearList();
			}
		};
		PopUpSelector.prototype.setPosition = function (cellRect) {
			var top = cellRect.asc_getY() + cellRect.asc_getHeight(),
				left = cellRect.asc_getX();
			var diff = top + this.selectorList.offsetHeight - this.element.offsetHeight;
			if (0 < diff) {
				top -= diff;
				left += cellRect.asc_getWidth();
			} else
				left += 10;

			this.selectorStyle['left'] = left + 'px';
			this.selectorStyle['top'] = top + 'px';
		};
		PopUpSelector.prototype.getVisible = function () {
			return this.isVisible;
		};
		PopUpSelector.prototype._clearList = function () {
			var i;
			for (i = 0; i < this.selectorListEl.length; ++i)
				this.selectorList.removeChild(this.selectorListEl[i]);

			this.selectorListEl.length = 0;

			this.selectElement = null;
			this.firstElement = null;
			this.isFormula = false;
		};

		PopUpSelector.prototype.onKeyDown = function (event) {
			var retVal = false;
			switch (event.which) {
				case 9: // Tab
					if (this.isFormula) {
						event.stopPropagation();
						event.preventDefault();
						this._onMouseDblClick();
					} else
						retVal = true;
					break;
				case 13:  // Enter
					if (!this.isFormula && null !== this.selectElement) {
						event.stopPropagation();
						event.preventDefault();
						this._onInsert(this.selectElement.getAttribute('val'));
					} else
						retVal = true;
					break;
				case 27: // Esc
					this.hide();
					break;
				case 38: // Up
					this._onChangeSelection(null !== this.selectElement ?
						this.selectElement.previousSibling : this.firstElement);
					break;
				case 40: // Down
					this._onChangeSelection(null !== this.selectElement ?
						this.selectElement.nextSibling : this.firstElement);
					break;
				case 16: // Shift
					break;
				default:
					retVal = true;
			}
			if (retVal)
				this.hide();
			return retVal;
		};

		PopUpSelector.prototype._onInsert = function (value) {
			this.hide();
			this.handlers.trigger('insert', value);
		};

		PopUpSelector.prototype._onMouseDown = function (event) {
			this.skipClose = true;
			var element = event.currentTarget;
			if (this.isFormula)
				this._onChangeSelection(element);
			else
				this._onInsert(element.getAttribute('val'));
		};
		PopUpSelector.prototype._onMouseDblClick = function (event) {
			if (!this.isVisible)
				return;

			if (!this.isFormula) {
				this._onMouseDown(event);
				return;
			}
			var elementVal = (event ? event.currentTarget : this.selectElement).getAttribute('val') + '(';
			this._onInsert(elementVal);
		};
		PopUpSelector.prototype._onMouseOver = function (event) {
			if (this.isFormula)
				return;

			this._onChangeSelection(event.currentTarget);
		};
		PopUpSelector.prototype._onChangeSelection = function (newElement) {
			if (null === newElement || null === newElement.getAttribute('val'))
				return;

			if (null !== this.selectElement)
				this.selectElement.className = '';

			this.selectElement = newElement;
			this.selectElement.className = 'selected';

			this.scrollToRecord();
		};

		PopUpSelector.prototype.scrollToRecord = function () {
			var innerEl = $(this.selectorList);
			var inner_top = innerEl.offset().top;
			var div = $(this.selectElement);
			var div_top = div.offset().top;

			if (div_top < inner_top || div_top + div.height() > inner_top + innerEl.height()) {
				this.selectorListJQ.scrollTop(this.selectorListJQ.scrollTop() + div_top - inner_top);
			}
		};

		PopUpSelector.prototype.setAlwaysVisibleY = function (flag) {
			if (flag) {
				$(this.selectorList).find('.ps-scrollbar-y-rail').addClass('always-visible-y');
				$(this.selectorList).find('.ps-scrollbar-y').addClass('always-visible-y');
			} else {
				$(this.selectorList).find('.ps-scrollbar-y-rail').removeClass('always-visible-y');
				$(this.selectorList).find('.ps-scrollbar-y').removeClass('always-visible-y');
			}
		};

		/*
		 * Export
		 * -----------------------------------------------------------------------------
		 */
		window["Asc"].PopUpSelector = PopUpSelector;
	}
)(jQuery, window);