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
		function PopUpSelector(element) {
			this.element		= element;
			this.selector		= null;
			this.selectorStyle	= null;
			this.selectorList	= null;

			this._init();
			return this;
		}
		PopUpSelector.prototype._init = function () {
			if (null != this.element) {
				this.selector = document.createElement("div");
				this.selectorStyle = this.selector.style;
				this.selector.id = "apiPopUpSelector";
				this.selector.innerHTML = '<div style="max-height:210px;overflow-y:auto"><ul id="apiPopUpList"></ul></div>';

				this.element.appendChild(this.selector);
				this.selectorList = document.getElementById("apiPopUpList");
			}
		};
		PopUpSelector.prototype.show = function (isFormula, arrItems, cellRect) {
			this._clearList();
			this.setPosition(cellRect);
			this.selectorStyle.display = "block";

			var item;
			for (var i = 0; i < arrItems.length; ++i) {
				item = document.createElement("li");
				if (isFormula) {
					item.innerHTML = arrItems[i].name;
					item.setAttribute("title", arrItems[i].arg);
				} else
					item.innerHTML = arrItems[i];

				/*item.onmouseover = function(e) {
					var nodes = combo.childNodes;
					for ( var i = 0; i < nodes.length; i++ ) {
						if ( nodes[i].style["backgroundColor"] != "" ) {
							nodes[i].style["backgroundColor"] = "";
						}
					}
					this.style["backgroundColor"] = _this.formulaSelectorColor;
				}
				item.onmouseout = function(e) {
					this.style["backgroundColor"] = "";
				}
				item.ondblclick = function(e) {
					if ( e && (e.button === 0) ) {
						var formulaName = this.innerText || this.textContent;
						var insertText = formulaName.substring(_this.input.value.length - 1) + "(";
						_this._addChars(insertText);
						_this._removeFormulaSelector();
					}
				}*/

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
			this.selectorStyle.display = "none";
			this._clearList();
		};
		PopUpSelector.prototype.setPosition = function (cellRect) {
			this.selectorStyle["left"] = (cellRect.asc_getX() + 10) + "px";
			this.selectorStyle["top"] = (cellRect.asc_getY() + cellRect.asc_getHeight()) + "px";
		};
		PopUpSelector.prototype._clearList = function () {
			this.selectorList.innerHTML = "";
		};

		/*
		 * Export
		 * -----------------------------------------------------------------------------
		 */
		window["Asc"].PopUpSelector = PopUpSelector;
	}
)(jQuery, window);
