/*
 * (c) Copyright Ascensio System SIA 2010-2018
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

"use strict";

(function (window, undefined)
{
	/**
	 * @param {_start} start range value
	 * @param {_end} end range value
	 * @param {_name} not used range name
	 */
	function CSymbolRange(_start, _end, _name)
	{
		this.Start = _start;
		this.End = _end;
		this.Name = _name;
	}

	function CFontByCharacter()
	{
		this.Ranges = [];
		this.UsedRanges = [];
		this.LastRange = null;

		this.FontsByRange = {};
		this.FontsByRangeCount = 0;
		this.ExtendFontsByRangeCount = 0;

		this.IsUseNoSquaresMode = true;

		this.CallbackObj = { _this : null, _callback : null };
	}

	CFontByCharacter.prototype =
	{
		init : function(infos)
		{
			var fonts = window["__fonts_ranges"];
			if (!fonts)
				return;

            var index = 0;
			var count = fonts.length / 3;
			for (var i = 0; i < count; i++)
			{
				if (!infos[fonts[index + 2]])
				{
					this.Ranges.splice(0, this.Ranges.length);
					return;
				}
				this.Ranges.push(new CSymbolRange(fonts[index], fonts[index + 1], infos[fonts[index + 2]][0]));
				index += 3;
			}

			fonts = null;
			delete window["__fonts_ranges"];
		},

        getRangeBySymbol : function(_char, _array)
		{
			// search range by symbol
			var _start = 0;
			var _end = _array.length - 1;

			var _center = 0;
			var _range = null;

			if (_start > _end)
				return null;

			while (_start < _end)
			{
				_center = (_start + _end) >> 1;
				_range = _array[_center];

				if (_range.Start > _char)
					_end = _center - 1;
				else if (_range.End < _char)
					_start = _center + 1;
				else
					return _array[_center];
			}

			if (_start > _end)
				return null;

			_range = _array[_start];
			if (_range.Start > _char || _range.End < _char)
				return null;

			return _array[_start];
		},

		getFontBySymbol : function(_char)
		{
			if (!this.IsUseNoSquaresMode)
				return "";

			if (undefined === _char || 0 == _char)
				return "";

			if (this.LastRange)
			{
				if (this.LastRange.Start <= _char && _char <= this.LastRange.End)
					return this.LastRange.Name;
			}

			// ищем среди уже найденных
			var _range = this.getRangeBySymbol(_char, this.UsedRanges);
			if (_range != null)
			{
				this.LastRange = _range;
                return _range.Name;
            }

			_range = this.getRangeBySymbol(_char, this.Ranges);
			if (!_range)
				return "";

            this.UsedRanges.push(_range);
            this.LastRange = _range;

            if (!this.FontsByRange[_range.Name])
			{
				this.FontsByRange[_range.Name] = _range.Name;
                this.FontsByRangeCount++;
            }

            return _range.Name;
		},

		getFontsByString : function(_text)
		{
            if (!this.IsUseNoSquaresMode)
                return false;

            if (!_text)
            	return false;

			var oldCount = this.FontsByRangeCount;
            for (var i = _text.getUnicodeIterator(); i.check(); i.next())
            {
                AscFonts.FontPickerByCharacter.getFontBySymbol(i.value());
            }
            return (this.FontsByRangeCount != oldCount);
		},

        getFontsByString2 : function(_array)
        {
            if (!this.IsUseNoSquaresMode)
                return false;

			if (!_array)
				return false;

            var oldCount = this.FontsByRangeCount;
            for (var i = 0; i < _array.length; ++i)
            {
                AscFonts.FontPickerByCharacter.getFontBySymbol(_array[i]);
            }
            return (this.FontsByRangeCount != oldCount);
        },

		isExtendFonts : function()
		{
			return this.ExtendFontsByRangeCount != this.FontsByRangeCount;
		},

		extendFonts : function(fonts, isNoRealExtend)
		{
            if (this.ExtendFontsByRangeCount == this.FontsByRangeCount)
            	return;

            var isFound;
            for (var i in this.FontsByRange)
			{
				isFound = false;
				for (var j in fonts)
				{
					if (fonts[j].name == this.FontsByRange[i])
					{
						isFound = true;
						break;
					}
				}

				if (!isFound)
					fonts[fonts.length] = new AscFonts.CFont(this.FontsByRange[i], 0, "", 0, null);
			}

			if (true !== isNoRealExtend)
				this.ExtendFontsByRangeCount = this.FontsByRangeCount;
		},

		checkTextLight : function(text, isCodes)
		{
			if (isCodes !== true)
			{
				if (!this.getFontsByString(text))
					return false;
			}
			else
			{
				if (!this.getFontsByString2(text))
					return false;
			}

			var fonts = [];
			this.extendFonts(fonts, true);

			if (false === AscCommon.g_font_loader.CheckFontsNeedLoading(fonts))
				return false;

			return true;
		},

		loadFonts : function(_this, _callback)
		{
			var fonts = [];
			this.extendFonts(fonts);

			this.CallbackObj._this = _this;
			this.CallbackObj._callback = _callback;

			var _editor = window["Asc"]["editor"] ? window["Asc"]["editor"] : window.editor;
			_editor.asyncMethodCallback = function() {

				var _t = AscFonts.FontPickerByCharacter.CallbackObj;
				_t._callback.call(_t._this);

				_t._this = null;
				_t._callback = null;

			};

			AscCommon.g_font_loader.LoadDocumentFonts2(fonts);
			return true;
		},

		checkText : function(text, _this, _callback, isCodes, isOnlyAsync, isCheckSymbols)
		{
			if (isCheckSymbols !== false)
			{
				if (isCodes !== true)
				{
					if (!this.getFontsByString(text))
					{
						if (!isOnlyAsync)
							_callback.call(_this);
						return false;
					}
				}
				else
				{
					if (!this.getFontsByString2(text))
					{
						if (!isOnlyAsync)
							_callback.call(_this);
						return false;
					}
				}
			}

			var fonts = [];
			this.extendFonts(fonts);

			if (false === AscCommon.g_font_loader.CheckFontsNeedLoading(fonts))
			{
				if (!isOnlyAsync)
					_callback.call(_this);
				return false;
			}

			this.CallbackObj._this = _this;
			this.CallbackObj._callback = _callback;

			var _editor = window["Asc"]["editor"] ? window["Asc"]["editor"] : window.editor;
			_editor.asyncMethodCallback = function() {

				var _t = AscFonts.FontPickerByCharacter.CallbackObj;
				_t._callback.call(_t._this);

				_t._this = null;
				_t._callback = null;

			};

			AscCommon.g_font_loader.LoadDocumentFonts2(fonts);
			return true;
		}
	};

    window['AscFonts'] = window['AscFonts'] || {};
    window['AscFonts'].IsCheckSymbols = false;
    window['AscFonts'].FontPickerByCharacter = new CFontByCharacter();

})(window);