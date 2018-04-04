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

(function(window, undefined){

    function CShapeColor(r, g, b){
        this.r = r;
        this.g = g;
        this.b = b;



    }


    function dBoundColor(c) {
        return Math.min(255, Math.max(0, (c + 0.5) >> 0));
    }

    CShapeColor.prototype.getColorData = function (dBrightness)
    {
        if(AscFormat.fApproxEqual(dBrightness, 0.0))
        {
            return this;
        }

        var r, g, b;
        if(dBrightness >= 0.0)
        {
            return new CShapeColor(dBoundColor(this.r*(1.0 - dBrightness) + dBrightness*255.0),
                dBoundColor(this.g*(1.0 - dBrightness) + dBrightness*255.0),
                dBoundColor(this.b*(1.0 - dBrightness) + dBrightness*255.0)
            );
        }
        else
        {
            return new CShapeColor(dBoundColor(this.r*(1.0 + dBrightness)),
                dBoundColor(this.g*(1.0 + dBrightness)),
                dBoundColor(this.b*(1.0 + dBrightness))
            );
        }

    };


    CShapeColor.prototype.darken = function ()
    {
        return this.getColorData(-0.4);
    };

    CShapeColor.prototype.darkenLess = function ()
    {
        return this.getColorData(-0.2);
    };

    CShapeColor.prototype.lighten  = function () {
        return this.getColorData(0.4);
    };

    CShapeColor.prototype.lightenLess = function()
    {
        return this.getColorData(0.2);
    };

    CShapeColor.prototype.norm  = function(a){
        return this;
    };
    //--------------------------------------------------------export----------------------------------------------------
    window['AscFormat'] = window['AscFormat'] || {};
    window['AscFormat'].CShapeColor = CShapeColor;
})(window);
