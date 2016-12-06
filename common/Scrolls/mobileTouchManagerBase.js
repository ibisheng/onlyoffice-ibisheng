/*
 * (c) Copyright Ascensio System SIA 2010-2016
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

(function(window, undefined)
{
	// define after window['AscCommon']
	var AscCommon = window['AscCommon'];

	AscCommon.MobileTouchMode =
		{
			None       : 0,
			Scroll     : 1,
			Zoom       : 2,
			Select     : 3,
			InlineObj  : 4,
			FlowObj    : 5,
			Cursor     : 6,
			TableMove  : 7,
			TableRuler : 8
		};

	AscCommon.MobileTouchContextMenuType =
		{
			None		: 0,
			Target		: 1,
			Select		: 2,
			Object		: 3
		};

	AscCommon.MOBILE_SELECT_TRACK_ROUND = 14;
	AscCommon.MOBILE_TABLE_RULER_DIAMOND = 7;

	function CMobileTouchManagerBase()
	{
		this.Api			= null;
		this.Mode 			= AscCommon.MobileTouchMode.None;

		this.IsTouching		= false;

		this.ReadingGlassTime  = 750;
		this.TimeDown          = 0;
		this.DownPoint         = null;
		this.DownPointOriginal = {X : 0, Y : 0};
		this.MoveAfterDown     = false;
		this.MoveMinDist       = 10;

		/* select text */
		this.SelectEnabled = true;
		this.RectSelect1 = null;
		this.RectSelect2 = null;
		this.PageSelect1 = 0;
		this.PageSelect2 = 0;

		this.TrackTargetEps = 20;

		/* zoom */
		this.ZoomEnabled  = true;
		this.ZoomDistance = 0;
		this.ZoomValue    = 100;
		this.ZoomValueMin = 50;
		this.ZoomValueMax = 300;

		/* table track */
		this.TableTrackEnabled 	   = true;
		this.TableMovePoint        = null;
		this.TableHorRulerPoints   = null;
		this.TableVerRulerPoints   = null;
		this.TableStartTrack_Check = false;

		this.TableRulersRectOffset = 5;
		this.TableRulersRectSize   = 20;

		this.TableCurrentMoveDir      = -1;
		this.TableCurrentMovePos      = -1;
		this.TableCurrentMoveValue    = 0;
		this.TableCurrentMoveValueOld = 0;

		this.TableCurrentMoveValueMin = null;
		this.TableCurrentMoveValueMax = null;

		/* context menu */
		this.ContextMenuLastMode 		= AscCommon.MobileTouchContextMenuType.None;
		this.ContextMenuLastModeCounter = 0;
		this.ContextMenuShowTimerId 	= -1;

		/* scroll object */
		this.iScroll = null;
	}

	CMobileTouchManagerBase.prototype.CreateScrollerDiv = function(_wrapper, _id)
	{
		var _scroller = document.createElement('div');
		var _style = "position: absolute; z-index: 0; margin: 0; padding: 0; -webkit-tap-highlight-color: rgba(0,0,0,0); width: 100%; heigth: 100%; display: block;";
		_style += "-webkit-transform: translateZ(0); -moz-transform: translateZ(0); -ms-transform: translateZ(0); -o-transform: translateZ(0); transform: translateZ(0);";
		_style += "-webkit-touch-callout: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;";
		_style += "-webkit-text-size-adjust: none; -moz-text-size-adjust: none; -ms-text-size-adjust: none; -o-text-size-adjust: none; text-size-adjust: none;";
		_scroller.setAttribute("style", _style);

		_scroller.id = _id;
		_wrapper.appendChild(_scroller);
	};

	CMobileTouchManagerBase.prototype.LoadMobileImages = function()
	{
		window.g_table_track_mobile_move = new Image();
		window.g_table_track_mobile_move.asc_complete = false;
		window.g_table_track_mobile_move.onload       = function()
		{
			window.g_table_track_mobile_move.asc_complete = true;
		};
		window.g_table_track_mobile_move.src          = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAArlJREFUeNqMlc9rWkEQx8ffGqMJBJpSUEIISInxpCfT1krioQQ85xISEKGBkGuhpxwEL4GAoOBJ8V9IxJCQ1l4SkFKxQvEfKEXQ0Nb4IxLtfBefvMeriQPj7ps377Mzu7OjZjgckoYlGo2+tFqtcZ1OFyAiG00nfx8eHj7f3d19SKfTP5g11LBRs7u761lYWPiytbVl9/l8ZDKZpqL1ej0qlUp0enr6p9FovM5kMhU92w02my0OmN/vJ0TcbreJVxZzCH9ARqORQqGQCurxeAC2n52dxfkxDOCMXq9/5fV6aTAYEIc/BkHYkWKx2Ni2ubn5X+j5+fkbweIf5GdFmoAhMkny+TzF43GyWCzi+ejoSIA3NjYUQA4IA5xMmGnhBO33+4rowuEwbW9vKz7Gdtzf36uiHH2n1eJQkCoE0WFeKBTE2O12qdlsKhQ2vLu6uhKjXMHSyuhivLi4oEQiQVLUk/T4+JiKxaLCJtKXQNDLy0tKJpM0NzcnrThR4HNyciLm6+vraiAEB8P1KE9hoqCMzGYzGQwG4asASoZAIEDz8/OUSqWeBGLxg4MDWl1dHe+rKkKUDWpqf3//SeDh4SG5XC5x6nKGYg+lW+J2u6nT6TwKBEzuo0pZPiJSyPX1NWWz2bFdy1UWiUQIt0rykUSe8pDrr837MCMvakgwGCSHw0G5XE487+3t0dLSkip6FDozumABOODVvt3c3PiXl5cVjq1Wi1ZWVmhnZ0dcL6fTqYoMUqlUYP8Klg7dhlNp3N7evuM7a0DZcE9UrL64uEh2u318APJ35XIZl6HN0I/1er2GfmhkfcGb/JYP4/3s7OwaL2Ceph/yvnU5i+/VajVVq9U+semnaLCjTvGM9TkuAaKesmP3WX+z/mKts3Y00l/ACDIzamfa0UKPCU4QR9tDEwIcfwH/BBgAl4G4NBf6Z6AAAAAASUVORK5CYII=";
	};

	//--------------------------------------------------------export----------------------------------------------------
	AscCommon.CMobileTouchManagerBase = CMobileTouchManagerBase;
})(window);
