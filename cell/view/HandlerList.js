"use strict";

(
	/**
	 * @param {Window} window
	 * @param {undefined} undefined
	 */
	function (window, undefined) {

		/*
		 * Import
		 * -----------------------------------------------------------------------------
		*/
		var asc = window["Asc"],
			asc_typeOf = asc.typeOf;


		/** @constructor */
		function asc_CHandlersList(handlers) {
			this.handlers = handlers || {};
			return this;
		}

		asc_CHandlersList.prototype.hasTrigger = function (eventName) {
			return null != this.handlers[eventName];
		};

		asc_CHandlersList.prototype.trigger = function (eventName) {
			var h = this.handlers[eventName], t = asc_typeOf(h), a = Array.prototype.slice.call(arguments, 1), i;
			if (t === "function") {
				return h.apply(this, a);
			}
			if (t === "array") {
				for (i = 0; i < h.length; i += 1) {
					if (asc_typeOf(h[i]) === "function") {h[i].apply(this, a);}
				}
				return true;
			}
			return false;
		};
		asc_CHandlersList.prototype.add = function (eventName, eventHandler, replaceOldHandler) {
			var th = this.handlers, h, old, t;
			if (replaceOldHandler || !th.hasOwnProperty(eventName)) {
				th[eventName] = eventHandler;
			} else {
				old = h = th[eventName];
				t = asc_typeOf(old);
				if (t !== "array") {
					h = th[eventName] = [];
					if (t === "function") {h.push(old);}
				}
				h.push(eventHandler);
			}
		};
		asc_CHandlersList.prototype.remove = function (eventName, eventHandler) {
			var th = this.handlers, h = th[eventName], i;
			if (th.hasOwnProperty(eventName)) {
				if (asc_typeOf(h) !== "array" || asc_typeOf(eventHandler) !== "function") {
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
		};

		//------------------------------------------------------------export---------------------------------------------------
		window['AscCommonExcel'] = window['AscCommonExcel'] || {};
		AscCommonExcel.asc_CHandlersList = asc_CHandlersList;
	}
)(window);