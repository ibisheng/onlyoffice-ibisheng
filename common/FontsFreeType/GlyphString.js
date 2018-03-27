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

(function(window, undefined) {

    function CGlyphRect()
    {
        this.fX = 0;
        this.fY = 0;
        this.fWidth = 0;
        this.fHeight = 0;
    }

    function CGlyphBounds()
    {
        this.fLeft = 0;
        this.fTop = 0;
        this.fRight = 0;
        this.fBottom = 0;
    }
    CGlyphBounds.prototype =
    {
        checkPoint : function(x, y)
        {
            if (x < this.fLeft)
                this.fLeft = x;
            if (x > this.fRight)
                this.fRight = x;
            if (y < this.fTop)
                this.fTop = y;
            if (y > this.fBottom)
                this.fBottom = y;
        }
    };

    function CGlyph()
    {
        this.lUnicode = 0; // Юникод
        this.fX = 0;       // Позиция глифа
        this.fY = 0;       // на BaseLine

        this.fLeft = 0;    //
        this.fTop = 0;     // BBox
        this.fRight = 0;   //
        this.fBottom = 0;  //

        this.oMetrics = null;

        this.eState = AscFonts.EGlyphState.glyphstateNormal;

        this.bBitmap = false;
        this.oBitmap = null;

        this.Clear = function()
        {
            this.bBitmap = false;
            this.eState = AscFonts.EGlyphState.glyphstateNormal;
        };
    }

    function CGlyphString()
    {
        this.m_fX = 0;
        this.m_fY = 0;

        this.m_fEndX = 0;
        this.m_fEndY = 0;

        this.m_nGlyphIndex   = -1;
        this.m_nGlyphsCount  = 0;
        this.m_pGlyphsBuffer = new Array(100);

        this.m_arrCTM = [];
        this.m_dIDet = 1;

        this.m_fTransX = 0;
        this.m_fTransY = 0;

        this.GetFirstGlyph = function()
        {
            if (!this.m_pGlyphsBuffer[0])
                this.m_pGlyphsBuffer[0] = new CGlyph();
            return this.m_pGlyphsBuffer[0];
        };

        this.SetString = function(wsString, fX, fY)
        {
            this.m_fX = fX + this.m_fTransX;
            this.m_fY = fY + this.m_fTransY;

            this.m_nGlyphsCount = wsString.length;
            this.m_nGlyphIndex  = 0;

            for (var nIndex = 0; nIndex < this.m_nGlyphsCount; ++nIndex)
            {
                if (undefined == this.m_pGlyphsBuffer[nIndex])
                    this.m_pGlyphsBuffer[nIndex] = new CGlyph();
                else
                    this.m_pGlyphsBuffer[nIndex].Clear();

                this.m_pGlyphsBuffer[nIndex].lUnicode = wsString.charCodeAt(nIndex);
            }
        };

        this.SetStringGID = function(gid, fX, fY)
        {
            this.m_fX = fX + this.m_fTransX;
            this.m_fY = fY + this.m_fTransY;

            this.m_nGlyphsCount = 1;
            this.m_nGlyphIndex  = 0;

            if (undefined == this.m_pGlyphsBuffer[0])
                this.m_pGlyphsBuffer[0] = new CGlyph();
            else
                this.m_pGlyphsBuffer[0].Clear();

            this.m_pGlyphsBuffer[0].lUnicode = gid;
        };

        this.GetLength = function()
        {
            return this.m_nGlyphsCount;
        };

        this.GetAt = function(nIndex)
        {
            if (this.m_nGlyphsCount <= 0)
                return null;

            var nCurIndex = (nIndex < 0) ? 0 : nIndex;
            if (nCurIndex >= this.m_nGlyphsCount)
                nCurIndex = this.m_nGlyphsCount - 1;

            return this.m_pGlyphsBuffer[nCurIndex];
        };

        this.SetStartPoint = function(nIndex, fX, fY)
        {
            if (this.m_nGlyphsCount <= 0)
                return;

            var nCurIndex = (nIndex < 0) ? 0 : nIndex;
            if (nCurIndex >= this.m_nGlyphsCount)
                nCurIndex = this.m_nGlyphsCount - 1;

            this.m_pGlyphsBuffer[nCurIndex].fX = fX;
            this.m_pGlyphsBuffer[nCurIndex].fY = fY;
        };

        this.SetState = function(nIndex, eState)
        {
            if (this.m_nGlyphsCount <= 0)
                return;

            var nCurIndex = (nIndex < 0) ? 0 : nIndex;
            if (nCurIndex >= this.m_nGlyphsCount)
                nCurIndex = this.m_nGlyphsCount - 1;

            this.m_pGlyphsBuffer[nCurIndex].eState = eState;
        };

        this.SetBBox = function (nIndex, fLeft, fTop, fRight, fBottom)
        {
            if (this.m_nGlyphsCount <= 0)
                return;

            var nCurIndex = (nIndex < 0) ? 0 : nIndex;
            if (nCurIndex >= this.m_nGlyphsCount)
                nCurIndex = this.m_nGlyphsCount - 1;

            var _g = this.m_pGlyphsBuffer[nCurIndex];
            _g.fLeft   = fLeft;
            _g.fTop    = fTop;
            _g.fRight  = fRight;
            _g.fBottom = fBottom;
        };

        this.SetMetrics = function (nIndex, fWidth, fHeight, fHoriAdvance, fHoriBearingX, fHoriBearingY, fVertAdvance, fVertBearingX, fVertBearingY)
        {
            if (this.m_nGlyphsCount <= 0)
                return;

            var nCurIndex = (nIndex < 0) ? 0 : nIndex;
            if (nCurIndex >= this.m_nGlyphsCount)
                nCurIndex = this.m_nGlyphsCount - 1;

            var _g = this.m_pGlyphsBuffer[nCurIndex];
            _g.oMetrics.fHeight       = fHeight;
            _g.oMetrics.fHoriAdvance  = fHoriAdvance;
            _g.oMetrics.fHoriBearingX = fHoriBearingX;
            _g.oMetrics.fHoriBearingY = fHoriBearingY;
            _g.oMetrics.fVertAdvance  = fVertAdvance;
            _g.oMetrics.fVertBearingX = fVertBearingX;
            _g.oMetrics.fVertBearingY = fVertBearingY;
            _g.oMetrics.fWidth        = fWidth;
        };

        this.ResetCTM = function()
        {
            var m = this.m_arrCTM;
            m[0] = 1;
            m[1] = 0;
            m[2] = 0;
            m[3] = 1;
            m[4] = 0;
            m[5] = 0;

            this.m_dIDet      = 1;
        };

        this.GetBBox = function(nIndex, nType)
        {
            var oPoint = new CGlyphBounds();
            if (typeof nIndex == "undefined")
                nIndex = -1;
            if (typeof nType == "undefined")
                nType = 0;

            var nCurIndex = 0;
            if (nIndex < 0)
            {
                if (this.m_nGlyphsCount <= 0 || this.m_nGlyphIndex < 1 || this.m_nGlyphIndex > this.m_nGlyphsCount)
                    return oPoint;

                nCurIndex = this.m_nGlyphIndex - 1;
            }
            else
            {
                if (this.m_nGlyphsCount <= 0)
                    return oPoint;

                nCurIndex = (nIndex < 0) ? 0 : nIndex;
                if (nCurIndex >= this.m_nGlyphsCount)
                    nCurIndex = this.m_nGlyphsCount - 1;
            }

            var _g = this.m_pGlyphsBuffer[nCurIndex];
            var m = this.m_arrCTM;

            var fBottom = -_g.fBottom;
            var fRight  =  _g.fRight;
            var fLeft   =  _g.fLeft;
            var fTop    = -_g.fTop;


            if (0 == nType && !(1 == m[0] && 0 == m[1] && 0 == m[2] && 1 == m[3] && 0 == m[4] && 0 == m[5]))
            {
                // Применяем глобальную матрицу преобразования и пересчитываем BBox
                var arrfX =[fLeft, fLeft, fRight, fRight];
                var arrfY = [fTop, fBottom, fBottom, fTop];

                var fMinX = (arrfX[0] * m[0] + arrfY[0] * m[2]);
                var fMinY = (arrfX[0] * m[1] + arrfY[0] * m[3]);
                var fMaxX = fMinX;
                var fMaxY = fMinY;

                for (var nIndex = 1; nIndex < 4; ++nIndex)
                {
                    var fX = (arrfX[nIndex] * m[0] + arrfY[nIndex] * m[2]);
                    var fY = (arrfX[nIndex] * m[1] + arrfY[nIndex] * m[3]);

                    fMaxX = Math.max(fMaxX, fX);
                    fMinX = Math.min(fMinX, fX);

                    fMaxY = Math.max(fMaxY, fY);
                    fMinY = Math.min(fMinY, fY);
                }

                fLeft   = fMinX;
                fRight  = fMaxX;
                fTop    = fMinY;
                fBottom = fMaxY;
            }

            oPoint.fLeft   = fLeft   + _g.fX + this.m_fX;
            oPoint.fRight  = fRight  + _g.fX + this.m_fX;
            oPoint.fTop    = fTop    + _g.fY + this.m_fY;
            oPoint.fBottom = fBottom + _g.fY + this.m_fY;

            return oPoint;
        };

        this.GetBBox2 = function()
        {
            var oPoint = new CGlyphBounds();
            if (this.m_nGlyphsCount <= 0)
                return oPoint;

            var fBottom = 0;
            var fRight  = 0;
            var fLeft   = 0;
            var fTop    = 0;

            for (var nIndex = 0; nIndex < this.m_nGlyphsCount; ++nIndex)
            {
                fBottom = Math.max(fBottom, -this.m_pGlyphsBuffer[nIndex].fBottom);
                fTop    = Math.min(fTop, -this.m_pGlyphsBuffer[nIndex].fTop);
            }

            var m = this.m_arrCTM;
            if (!(1 == m[0] && 0 == m[1] && 0 == m[2] && 1 == m[3] && 0 == m[4] && 0 == m[5]))
            {
                // Применяем глобальную матрицу преобразования и пересчитываем BBox
                var arrfX = [fLeft, fLeft, fRight, fRight];
                var arrfY = [fTop, fBottom, fBottom, fTop];

                var fMinX = (arrfX[0] * m[0] + arrfY[0] * m[2]);
                var fMinY = (arrfX[0] * m[1] + arrfY[0] * m[3]);
                var fMaxX = fMinX;
                var fMaxY = fMinY;

                for (var nIndex = 1; nIndex < 4; ++nIndex)
                {
                    var fX = (arrfX[nIndex] * m[0] + arrfY[nIndex] * m[2]);
                    var fY = (arrfX[nIndex] * m[1] + arrfY[nIndex] * m[3]);

                    fMaxX = Math.max (fMaxX, fX);
                    fMinX = Math.min (fMinX, fX);

                    fMaxY = Math.max (fMaxY, fY);
                    fMinY = Math.min (fMinY, fY);
                }

                fLeft   = fMinX;
                fRight  = fMaxX;
                fTop    = fMinY;
                fBottom = fMaxY;
            }

            fLeft   += this.m_fX;
            fRight  += this.m_fX;
            fTop    += this.m_fY;
            fBottom += this.m_fY;

            oPoint.fLeft  = Math.min (fLeft, Math.min (this.m_fX, this.m_fEndX));
            oPoint.fRight = Math.max (fRight, Math.max (this.m_fX, this.m_fEndX));
            oPoint.fTop   = Math.min (fTop, Math.min (this.m_fY, this.m_fEndY));
            oPoint.fBottom = Math.max (fBottom, Math.max (this.m_fY, this.m_fEndY));

            return oPoint;
        };

        this.GetNext = function()
        {
            if (this.m_nGlyphIndex >= this.m_nGlyphsCount || this.m_nGlyphIndex < 0)
                return undefined;

            return this.m_pGlyphsBuffer[this.m_nGlyphIndex++];
        };

        this.SetTrans = function(fX, fY)
        {
            var m = this.m_arrCTM;
            this.m_fTransX = this.m_dIDet * (fX * m[3] - m[2] * fY);
            this.m_fTransY = this.m_dIDet * (fY * m[0] - m[1] * fX);
        };

        this.SetCTM = function(fA, fB, fC, fD, fE , fF)
        {
            var m = this.m_arrCTM;
            m[0] = fA;
            m[1] = fB;
            m[2] = fC;
            m[3] = fD;
            m[4] = fE;
            m[5] = fF;

            var dDet = fA * fD - fB * fC;

            if (dDet < 0.001 && dDet >= 0)
                dDet =  0.001;
            else if (dDet > - 0.001 && dDet < 0)
                dDet = -0.001;

            this.m_dIDet = 1 / dDet;
        };
    }

    window['AscFonts'] = window['AscFonts'] || {};
    window['AscFonts'].CGlyphRect = CGlyphRect;
    window['AscFonts'].CGlyphBounds = CGlyphBounds;
    window['AscFonts'].CGlyphString = CGlyphString;

})(window, undefined);