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


        function COleSize(w, h){
            this.w = w;
            this.h = h;
        }
        COleSize.prototype.Write_ToBinary = function(Writer){
            Writer.WriteLong(this.w);
            Writer.WriteLong(this.h);
        };
        COleSize.prototype.Read_FromBinary = function(Reader){
            this.w = Reader.GetLong();
            this.h = Reader.GetLong();
        };

        AscDFH.changesFactory[AscDFH.historyitem_ImageShapeSetData] = AscDFH.CChangesDrawingsString;
        AscDFH.changesFactory[AscDFH.historyitem_ImageShapeSetApplicationId] = AscDFH.CChangesDrawingsString;
        AscDFH.changesFactory[AscDFH.historyitem_ImageShapeSetPixSizes] = AscDFH.CChangesDrawingsObjectNoId;
		AscDFH.changesFactory[AscDFH.historyitem_ImageShapeSetObjectFile] = AscDFH.CChangesDrawingsString;


        AscDFH.drawingsChangesMap[AscDFH.historyitem_ImageShapeSetData] = function(oClass, value){oClass.m_sData = value;};
        AscDFH.drawingsChangesMap[AscDFH.historyitem_ImageShapeSetApplicationId] = function(oClass, value){oClass.m_sApplicationId = value;};
        AscDFH.drawingsChangesMap[AscDFH.historyitem_ImageShapeSetPixSizes] = function(oClass, value){
            if(value){
                oClass.m_nPixWidth = value.w;
                oClass.m_nPixHeight = value.h;
            }
        };
        AscDFH.drawingsConstructorsMap[AscDFH.historyitem_ImageShapeSetPixSizes] = COleSize;
		AscDFH.drawingsChangesMap[AscDFH.historyitem_ImageShapeSetObjectFile] = function(oClass, value){oClass.m_sObjectFile = value;};

    function COleObject()
    {
		AscFormat.CImageShape.call(this);
        this.m_sData = null;
        this.m_sApplicationId = null;
        this.m_nPixWidth = null;
        this.m_nPixHeight = null;
        this.m_fDefaultSizeX = null;
        this.m_fDefaultSizeY = null;
        this.m_sObjectFile = null;//ole object name in OOX
    }

		COleObject.prototype = Object.create(AscFormat.CImageShape.prototype);
		COleObject.prototype.constructor = COleObject;

    COleObject.prototype.getObjectType = function()
    {
        return AscDFH.historyitem_type_OleObject;
    };
    COleObject.prototype.setData = function(sData)
    {
        AscCommon.History.Add(new AscDFH.CChangesDrawingsString(this, AscDFH.historyitem_ImageShapeSetData, this.m_sData, sData));
        this.m_sData = sData;
    };
    COleObject.prototype.setApplicationId = function(sApplicationId)
    {
        AscCommon.History.Add(new AscDFH.CChangesDrawingsString(this, AscDFH.historyitem_ImageShapeSetApplicationId, this.m_sApplicationId, sApplicationId));
        this.m_sApplicationId = sApplicationId;
    };
    COleObject.prototype.setPixSizes = function(nPixWidth, nPixHeight)
    {
        AscCommon.History.Add(new AscDFH.CChangesDrawingsObjectNoId(this, AscDFH.historyitem_ImageShapeSetPixSizes, new COleSize(this.m_nPixWidth, this.m_nPixHeight), new COleSize(nPixWidth, nPixHeight)));
        this.m_nPixWidth = nPixWidth;
        this.m_nPixHeight = nPixHeight;
    };
    COleObject.prototype.setObjectFile = function(sObjectFile)
    {
        AscCommon.History.Add(new AscDFH.CChangesDrawingsString(this, AscDFH.historyitem_ImageShapeSetObjectFile, this.m_sObjectFile, sObjectFile));
        this.m_sObjectFile = sObjectFile;
    };

    COleObject.prototype.canRotate = function () {
        return false;
    };

    COleObject.prototype.copy = function()
    {
        var copy = new COleObject();
        if(this.nvPicPr)
        {
            copy.setNvPicPr(this.nvPicPr.createDuplicate());
        }
        if(this.spPr)
        {
            copy.setSpPr(this.spPr.createDuplicate());
            copy.spPr.setParent(copy);
        }
        if(this.blipFill)
        {
            copy.setBlipFill(this.blipFill.createDuplicate());
        }
        if(this.style)
        {
            copy.setStyle(this.style.createDuplicate());
        }
        copy.setBDeleted(this.bDeleted);
        if(this.fromSerialize)
        {
            copy.setBFromSerialize(true);
        }
        copy.setData(this.m_sData);
        copy.setApplicationId(this.m_sApplicationId);
        copy.setPixSizes(this.m_nPixWidth, this.m_nPixHeight);
        copy.setObjectFile(this.m_sObjectFile);
        copy.cachedImage = this.getBase64Img();
        copy.cachedPixH = this.cachedPixH;
        copy.cachedPixW = this.cachedPixW;
        return copy;
    };


    COleObject.prototype.handleUpdateExtents = function(){
        if(!AscFormat.isRealNumber(this.m_fDefaultSizeX) || !AscFormat.isRealNumber(this.m_fDefaultSizeY)){
            if(this.spPr && this.spPr.xfrm && AscFormat.isRealNumber(this.spPr.xfrm.extX) && AscFormat.isRealNumber(this.spPr.xfrm.extY)){
                this.m_fDefaultSizeX = this.spPr.xfrm.extX;
                this.m_fDefaultSizeY = this.spPr.xfrm.extY;
            }
        }
        if(AscFormat.CImageShape.prototype.handleUpdateExtents){
            AscFormat.CImageShape.prototype.handleUpdateExtents.call(this, []);
        }
    };
    COleObject.prototype.checkTypeCorrect = function(){
        if(!this.m_sData){
            return false;
        }
        if(!this.m_sApplicationId){
            return false;
        }
        if(this.m_nPixHeight === null || this.m_nPixHeight === null){
            return false;
        }
        return true;
    };
        window['AscFormat'] = window['AscFormat'] || {};
        window['AscFormat'].COleObject = COleObject;
})(window);