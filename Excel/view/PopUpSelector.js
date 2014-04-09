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

			this.element		= element;
			this.selector		= null;
			this.selectorStyle	= null;
			this.selectorList	= null;
			this.selectElement	= null;
			this.firstElement	= null;

			this.isFormula		= false;
			this.isVisible		= false;

			this.fMouseDown		= null;
			this.fMouseDblClick	= null;
			this.fMouseOver		= null;

			this._init();
			return this;
		}
		PopUpSelector.prototype._init = function () {
			var t = this;
			if (null != this.element) {
				this.selector = document.createElement("div");
				this.selectorStyle = this.selector.style;
				this.selector.id = "apiPopUpSelector";
				this.selector.innerHTML = '<div style="max-height:210px;overflow-y:auto"><ul id="apiPopUpList"></ul></div>';

				this.element.appendChild(this.selector);
				this.selectorList = document.getElementById("apiPopUpList");

				this.fMouseDown = function (event) {t._onMouseDown(event);};
				this.fMouseDblClick = function (event) {t._onMouseDblClick(event);};
				this.fMouseOver = function (event) {t._onMouseOver(event);};
			}
		};
		PopUpSelector.prototype.show = function (isFormula, arrItems, cellRect) {
			this._clearList();
			this.setPosition(cellRect);
			if (!this.isVisible) {
				this.selectorStyle.display = "block";
				this.isVisible = true;
			}
			this.isFormula = isFormula;

			var item, isFirst;
			for (var i = 0; i < arrItems.length; ++i) {
				item = document.createElement("li");
				isFirst = (0 === i);
				if (isFirst)
					this.firstElement = item;

				if (this.isFormula) {
					if (isFirst) {
						this.selectElement = item;
						item.className = "selected";
					}
					item.innerHTML = arrItems[i].name;
					item.setAttribute("title", arrItems[i].arg);
				} else
					item.innerHTML = arrItems[i];

				if (item.addEventListener) {
					item.addEventListener("mousedown"	, this.fMouseDown		, false);
					item.addEventListener("dblclick"	, this.fMouseDblClick	, false);
					if (!this.isFormula) {
						item.addEventListener("mouseover", this.fMouseOver, false);
					}
				}

				this.selectorList.appendChild(item);
			}

			// Selection hack
			/*var clearSelection = function() {
				if (document.selection && document.selection.empty) {
					document.selection.empty();
				}
				else if (window.getSelection) {
					var sel = window.getSelection();
					sel.removeAllRanges();
				}
			}*/
			// TODO: В Mozilla избавиться от селекта текста при dblclick
		};
		PopUpSelector.prototype.hide = function () {
			if (this.isVisible) {
				this.selectorStyle.display = "none";
				this.isVisible = false;
			}
			this._clearList();
		};
		PopUpSelector.prototype.setPosition = function (cellRect) {
			this.selectorStyle["left"] = (cellRect.asc_getX() + 10) + "px";
			this.selectorStyle["top"] = (cellRect.asc_getY() + cellRect.asc_getHeight()) + "px";
		};
		PopUpSelector.prototype.getVisible = function () {
			return this.isVisible;
		};
		PopUpSelector.prototype._clearList = function () {
			this.selectorList.innerHTML = "";
			this.selectElement = null;
			this.firstElement = null;
			this.isFormula = false;
		};

		PopUpSelector.prototype.onKeyDown = function (event) {
			var retVal = false;
			switch (event.which) {
				case 9: // Tab
					if (this.isFormula)
						this._onMouseDblClick();
					else
						retVal = true;
					break;
				case 13:  // "enter"
					if (!this.isFormula && null !== this.selectElement)
						this._onInsert(this.selectElement.innerHTML);
					else
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
				default:
					retVal = true;
			}
			return retVal;
		};

		PopUpSelector.prototype._onInsert = function (value) {
			this.hide();
			this.handlers.trigger("insert", value);
		};

		PopUpSelector.prototype._onMouseDown = function (event) {
			var element = (event.target || event.srcElement);
			if (this.isFormula) {
				this._onChangeSelection(element);
			} else {
				this._onInsert(element.innerHTML);
			}
		};
		PopUpSelector.prototype._onMouseDblClick = function (event) {
			if (!this.isVisible)
				return;

			if (!this.isFormula) {
				this._onMouseDown(event);
				return;
			}
			var elementVal = (event ? (event.target || event.srcElement) : this.selectElement).innerHTML + "(";
			this._onInsert(elementVal);
		};
		PopUpSelector.prototype._onMouseOver = function (event) {
			if (this.isFormula)
				return;

			var element = (event.target || event.srcElement);
			this._onChangeSelection(element);
		};
		PopUpSelector.prototype._onChangeSelection = function (newElement) {
			if (null === newElement)
				return;

			if (null !== this.selectElement)
				this.selectElement.className = "";

			this.selectElement = newElement;
			this.selectElement.className = "selected";
		};

		/*
		 * Export
		 * -----------------------------------------------------------------------------
		 */
		window["Asc"].PopUpSelector = PopUpSelector;
	}
)(jQuery, window);
