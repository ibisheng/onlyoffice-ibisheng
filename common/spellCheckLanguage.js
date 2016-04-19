"use strict";

(	/**
 * @param {Window} window
 * @param {undefined} undefined
 */
	function (window, undefined) {
		/*
		 * Import
		 * -----------------------------------------------------------------------------
		 */
		var prot;

		/**
		 * Класс language для получения списка языков в проверке орфографии
		 * -----------------------------------------------------------------------------
		 * @constructor
		 * @memberOf Asc
		 * @param id
		 * @param name
		 * @return {*}
		 */
		function asc_CLanguage (name, id) {
			this.name	= name;			// имя языка
			this.id		= id;			// уникальный id языка

			return this;
		}

		asc_CLanguage.prototype = {
			constructor: asc_CLanguage,
			asc_getId: function () { return this.id; },
			asc_getName: function () { return this.name; },
			asc_setId: function (val) { this.id = val; },
			asc_setName: function (val) { this.name = val; }
		};

		//---------------------------------------------------------export---------------------------------------------------
		window['AscCommon'] = window['AscCommon'] || {};
		window["AscCommon"].asc_CLanguage = asc_CLanguage;
		prot = asc_CLanguage.prototype;
		prot["asc_getId"]			= prot.asc_getId;
		prot["asc_getName"]			= prot.asc_getName;
		prot["asc_setId"]			= prot.asc_setId;
		prot["asc_setName"]			= prot.asc_setName;
	}
)(window);
