/*
 * (c) Copyright Ascensio System SIA 2010-2017
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
(
/**
* @param {Window} window
* @param {undefined} undefined
*/
function (window, undefined) {
var AscBrowser = {
    userAgent : "",
    isIE : false,
    isMacOs : false,
    isSafariMacOs : false,
    isAppleDevices : false,
    isAndroid : false,
    isMobile : false,
	isMobileVersion : false,
    isGecko : false,
    isChrome : false,
    isOpera : false,
    isWebkit : false,
    isSafari : false,
    isArm : false,
    isMozilla : false,
	isRetina : false,
    isLinuxOS : false,
	retinaPixelRatio : 1
};

// user agent lower case
AscBrowser.userAgent = navigator.userAgent.toLowerCase();

// ie detect
AscBrowser.isIE =  (AscBrowser.userAgent.indexOf("msie") > -1 ||
                    AscBrowser.userAgent.indexOf("trident") > -1 ||
					AscBrowser.userAgent.indexOf("edge") > -1);

AscBrowser.isIeEdge = (AscBrowser.userAgent.indexOf("edge/") > -1);

AscBrowser.isIE9 =  (AscBrowser.userAgent.indexOf("msie9") > -1 || AscBrowser.userAgent.indexOf("msie 9") > -1);
AscBrowser.isIE10 =  (AscBrowser.userAgent.indexOf("msie10") > -1 || AscBrowser.userAgent.indexOf("msie 10") > -1);

// macOs detect
AscBrowser.isMacOs = (AscBrowser.userAgent.indexOf('mac') > -1);

// chrome detect
AscBrowser.isChrome = !AscBrowser.isIE && (AscBrowser.userAgent.indexOf("chrome") > -1);

// safari detect
AscBrowser.isSafari = !AscBrowser.isIE && !AscBrowser.isChrome && (AscBrowser.userAgent.indexOf("safari") > -1);

// macOs safari detect
AscBrowser.isSafariMacOs = (AscBrowser.isSafari && AscBrowser.isMacOs);

// apple devices detect
AscBrowser.isAppleDevices = (AscBrowser.userAgent.indexOf("ipad") > -1 ||
                             AscBrowser.userAgent.indexOf("iphone") > -1 ||
                             AscBrowser.userAgent.indexOf("ipod") > -1);

// android devices detect
AscBrowser.isAndroid = (AscBrowser.userAgent.indexOf("android") > -1);

// mobile detect
AscBrowser.isMobile = /android|avantgo|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent || navigator.vendor || window.opera);

// gecko detect
AscBrowser.isGecko = (AscBrowser.userAgent.indexOf("gecko/") > -1);

// opera detect
AscBrowser.isOpera = (!!window.opera || AscBrowser.userAgent.indexOf("opr/") > -1);

// webkit detect
AscBrowser.isWebkit = !AscBrowser.isIE && (AscBrowser.userAgent.indexOf("webkit") > -1);

// arm detect
AscBrowser.isArm = (AscBrowser.userAgent.indexOf("arm") > -1);

AscBrowser.isMozilla = !AscBrowser.isIE && (AscBrowser.userAgent.indexOf("firefox") > -1);

AscBrowser.isLinuxOS = (AscBrowser.userAgent.indexOf(" linux ") > -1);

AscBrowser.zoom = 1;

AscBrowser.checkZoom = function()
{
    if (AscBrowser.isAndroid)
	{
		AscBrowser.isRetina = (window.devicePixelRatio >= 1.9);
		AscBrowser.retinaPixelRatio = window.devicePixelRatio;
		return;
	}

	AscBrowser.zoom = 1.0;
	AscBrowser.isRetina = false;
	AscBrowser.retinaPixelRatio = 1;

    if (AscBrowser.isChrome && !AscBrowser.isOpera && !AscBrowser.isMobile && document && document.firstElementChild && document.body)
    {
        if (false)
		{
			// этот код - рабочий, но только если этот ифрейм открыт на весь размер браузера
            // (window.outerWidth и window.innerWidth зависимы)
			if (window.innerWidth > 300)
				AscBrowser.zoom = window.outerWidth / window.innerWidth;

			if (Math.abs(AscBrowser.zoom - 1) < 0.1)
				AscBrowser.zoom = 1;

			AscBrowser.zoom = window.outerWidth / window.innerWidth;

			var _devicePixelRatio = window.devicePixelRatio / AscBrowser.zoom;

			// device pixel ratio: кратно 0.5
			_devicePixelRatio = (5 * (((2.5 + 10 * _devicePixelRatio) / 5) >> 0)) / 10;

			AscBrowser.zoom = window.devicePixelRatio / _devicePixelRatio;
			if (2 == _devicePixelRatio)
				AscBrowser.isRetina = true;

			// chrome 54.x: zoom = "reset" - clear retina zoom (windows)
			//document.firstElementChild.style.zoom = "reset";
			document.firstElementChild.style.zoom = 1.0 / AscBrowser.zoom;
		}
		else
        {
            // делаем простую проверку
            // считаем: 0 < window.devicePixelRatio < 2 => _devicePixelRatio = 1; zoom = window.devicePixelRatio / _devicePixelRatio;
			// считаем: window.devicePixelRatio >= 2 => _devicePixelRatio = 2; zoom = window.devicePixelRatio / _devicePixelRatio;
            if (window.devicePixelRatio > 0.1)
			{
				if (window.devicePixelRatio < 1.99)
				{
					var _devicePixelRatio = 1;
					AscBrowser.zoom = window.devicePixelRatio / _devicePixelRatio;
				}
				else
				{
					var _devicePixelRatio = 2;
					AscBrowser.zoom = window.devicePixelRatio / _devicePixelRatio;
					AscBrowser.isRetina = true;
				}
				// chrome 54.x: zoom = "reset" - clear retina zoom (windows)
				//document.firstElementChild.style.zoom = "reset";
				document.firstElementChild.style.zoom = 1.0 / AscBrowser.zoom;
			}
			else
				document.firstElementChild.style.zoom = "normal";
        }

        if (AscBrowser.isRetina)
        	AscBrowser.retinaPixelRatio = 2;
    }
    else
    {
		AscBrowser.isRetina = (Math.abs(2 - (window.devicePixelRatio / AscBrowser.zoom)) < 0.01);
		if (AscBrowser.isRetina)
			AscBrowser.retinaPixelRatio = 2;

		if (AscBrowser.isMobile)
		{
			AscBrowser.isRetina = (window.devicePixelRatio >= 1.9);
			AscBrowser.retinaPixelRatio = window.devicePixelRatio;
		}
    }
};

AscBrowser.checkZoom();

    //--------------------------------------------------------export----------------------------------------------------
    window['AscCommon'] = window['AscCommon'] || {};
    window['AscCommon'].AscBrowser = AscBrowser; // ToDo убрать window['AscBrowser']
})(window);
