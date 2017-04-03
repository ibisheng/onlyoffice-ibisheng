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

// ---------------------------------------------------------------
function CAscSlideTiming()
{
    this.TransitionType     = undefined;
    this.TransitionOption   = undefined;
    this.TransitionDuration = undefined;

    this.SlideAdvanceOnMouseClick   = undefined;
    this.SlideAdvanceAfter          = undefined;
    this.SlideAdvanceDuration       = undefined;
    this.ShowLoop                   = undefined;
}

CAscSlideTiming.prototype.put_TransitionType = function(v) { this.TransitionType = v; };
CAscSlideTiming.prototype.get_TransitionType = function() { return this.TransitionType; };
CAscSlideTiming.prototype.put_TransitionOption = function(v) { this.TransitionOption = v; };
CAscSlideTiming.prototype.get_TransitionOption = function() { return this.TransitionOption; };
CAscSlideTiming.prototype.put_TransitionDuration = function(v) { this.TransitionDuration = v; };
CAscSlideTiming.prototype.get_TransitionDuration = function() { return this.TransitionDuration; };

CAscSlideTiming.prototype.put_SlideAdvanceOnMouseClick = function(v) { this.SlideAdvanceOnMouseClick = v; };
CAscSlideTiming.prototype.get_SlideAdvanceOnMouseClick = function() { return this.SlideAdvanceOnMouseClick; };
CAscSlideTiming.prototype.put_SlideAdvanceAfter = function(v) { this.SlideAdvanceAfter = v; };
CAscSlideTiming.prototype.get_SlideAdvanceAfter = function() { return this.SlideAdvanceAfter; };
CAscSlideTiming.prototype.put_SlideAdvanceDuration = function(v) { this.SlideAdvanceDuration = v; };
CAscSlideTiming.prototype.get_SlideAdvanceDuration = function() { return this.SlideAdvanceDuration; };
CAscSlideTiming.prototype.put_ShowLoop = function(v) { this.ShowLoop = v; };
CAscSlideTiming.prototype.get_ShowLoop = function() { return this.ShowLoop; };

CAscSlideTiming.prototype.applyProps = function(v)
{
    if (undefined !== v.TransitionType && null !== v.TransitionType)
        this.TransitionType = v.TransitionType;
    if (undefined !== v.TransitionOption && null !== v.TransitionOption)
        this.TransitionOption = v.TransitionOption;
    if (undefined !== v.TransitionDuration && null !== v.TransitionDuration)
        this.TransitionDuration = v.TransitionDuration;

    if (undefined !== v.SlideAdvanceOnMouseClick && null !== v.SlideAdvanceOnMouseClick)
        this.SlideAdvanceOnMouseClick = v.SlideAdvanceOnMouseClick;
    if (undefined !== v.SlideAdvanceAfter && null !== v.SlideAdvanceAfter)
        this.SlideAdvanceAfter = v.SlideAdvanceAfter;
    if (undefined !== v.SlideAdvanceDuration && null !== v.SlideAdvanceDuration)
        this.SlideAdvanceDuration = v.SlideAdvanceDuration;
    if (undefined !== v.ShowLoop && null !== v.ShowLoop)
        this.ShowLoop = v.ShowLoop;
};

CAscSlideTiming.prototype.createDuplicate = function(v)
{
    var _slideT = new CAscSlideTiming();

    _slideT.TransitionType     = this.TransitionType;
    _slideT.TransitionOption   = this.TransitionOption;
    _slideT.TransitionDuration = this.TransitionDuration;

    _slideT.SlideAdvanceOnMouseClick   = this.SlideAdvanceOnMouseClick;
    _slideT.SlideAdvanceAfter          = this.SlideAdvanceAfter;
    _slideT.SlideAdvanceDuration       = this.SlideAdvanceDuration;
    _slideT.ShowLoop                   = this.ShowLoop;

    return _slideT;
};

CAscSlideTiming.prototype.makeDuplicate = function(_slideT)
{
    if (!_slideT)
        return;

    _slideT.TransitionType     = this.TransitionType;
    _slideT.TransitionOption   = this.TransitionOption;
    _slideT.TransitionDuration = this.TransitionDuration;

    _slideT.SlideAdvanceOnMouseClick   = this.SlideAdvanceOnMouseClick;
    _slideT.SlideAdvanceAfter          = this.SlideAdvanceAfter;
    _slideT.SlideAdvanceDuration       = this.SlideAdvanceDuration;
    _slideT.ShowLoop                   = this.ShowLoop;
};

CAscSlideTiming.prototype.setUndefinedOptions = function()
{
    this.TransitionType     = undefined;
    this.TransitionOption   = undefined;
    this.TransitionDuration = undefined;

    this.SlideAdvanceOnMouseClick   = undefined;
    this.SlideAdvanceAfter          = undefined;
    this.SlideAdvanceDuration       = undefined;
    this.ShowLoop                   = undefined;
};

CAscSlideTiming.prototype.setDefaultParams = function()
{
    this.TransitionType     = c_oAscSlideTransitionTypes.None;
    this.TransitionOption   = -1;
    this.TransitionDuration = 2000;

    this.SlideAdvanceOnMouseClick   = true;
    this.SlideAdvanceAfter          = false;
    this.SlideAdvanceDuration       = 10000;
    this.ShowLoop                   = true;
};

CAscSlideTiming.prototype.Write_ToBinary = function(w)
{
    w.WriteBool(AscFormat.isRealNumber(this.TransitionType));
    if(AscFormat.isRealNumber(this.TransitionType))
        w.WriteLong(this.TransitionType);

    w.WriteBool(AscFormat.isRealNumber(this.TransitionOption));
    if(AscFormat.isRealNumber(this.TransitionOption))
        w.WriteLong(this.TransitionOption);

    w.WriteBool(AscFormat.isRealNumber(this.TransitionDuration));
    if(AscFormat.isRealNumber(this.TransitionDuration))
        w.WriteLong(this.TransitionDuration);


    w.WriteBool(AscFormat.isRealBool(this.SlideAdvanceOnMouseClick));
    if(AscFormat.isRealBool(this.SlideAdvanceOnMouseClick))
        w.WriteBool(this.SlideAdvanceOnMouseClick);

    w.WriteBool(AscFormat.isRealBool(this.SlideAdvanceAfter));
    if(AscFormat.isRealBool(this.SlideAdvanceAfter))
        w.WriteBool(this.SlideAdvanceAfter);

    w.WriteBool(AscFormat.isRealNumber(this.SlideAdvanceDuration));
    if(AscFormat.isRealNumber(this.SlideAdvanceDuration))
        w.WriteLong(this.SlideAdvanceDuration);
    AscFormat.writeBool(w, this.ShowLoop);
};

CAscSlideTiming.prototype.Read_FromBinary = function(r)
{

    if(r.GetBool())
        this.TransitionType = r.GetLong();

    if(r.GetBool())
        this.TransitionOption = r.GetLong();


    if(r.GetBool())
        this.TransitionDuration = r.GetLong();


    if(r.GetBool())
        this.SlideAdvanceOnMouseClick = r.GetBool();


    if(r.GetBool())
        this.SlideAdvanceAfter = r.GetBool();

    if(r.GetBool())
        this.SlideAdvanceDuration = r.GetLong();
    this.ShowLoop = AscFormat.readBool(r);
};

AscDFH.drawingsConstructorsMap[AscDFH.historyitem_SlideSetTiming            ] = CAscSlideTiming;


// информация о темах --------------------------------------------

function CAscThemeInfo(themeInfo)
{
    this.ThemeInfo = themeInfo;
    this.Index = -1000;
}
CAscThemeInfo.prototype.get_Name = function() { return this.ThemeInfo.Name; };
CAscThemeInfo.prototype.get_Url = function() { return this.ThemeInfo.Url; };
CAscThemeInfo.prototype.get_Image = function() { return this.ThemeInfo.Thumbnail; };
CAscThemeInfo.prototype.get_Index = function() { return this.Index; };

function CLayoutThumbnail()
{
    this.Index = 0;
    this.Name = "";
    this.Type = 15;
    this.Image = "";

    this.Width = 0;
    this.Height = 0;
}

CLayoutThumbnail.prototype.getIndex = function() { return this.Index; };
CLayoutThumbnail.prototype.getType = function() { return this.Type; };
CLayoutThumbnail.prototype.get_Image = function() { return this.Image; };
CLayoutThumbnail.prototype.get_Name = function() { return this.Name; };
CLayoutThumbnail.prototype.get_Width = function() { return this.Width; };
CLayoutThumbnail.prototype.get_Height = function() { return this.Height; };

function CHyperlinkProperty( obj )
{
    if( obj )
    {
        this.Text    = (undefined != obj.Text   ) ? obj.Text    : null;
        this.Value   = (undefined != obj.Value  ) ? obj.Value   : "";
        this.ToolTip = (undefined != obj.ToolTip) ? obj.ToolTip : null;
    }
    else
    {
        this.Text    = null;
        this.Value   = "";
        this.ToolTip = null;
    }
}

CHyperlinkProperty.prototype.get_Value   = function()  { return this.Value; };
CHyperlinkProperty.prototype.put_Value   = function(v) { this.Value = v; };
CHyperlinkProperty.prototype.get_ToolTip = function()  { return this.ToolTip; };
CHyperlinkProperty.prototype.put_ToolTip = function(v) { this.ToolTip = v; };
CHyperlinkProperty.prototype.get_Text    = function()  { return this.Text; };
CHyperlinkProperty.prototype.put_Text    = function(v) { this.Text = v; };


//------------------------------------------------------------export----------------------------------------------------
window['Asc'] = window['Asc'] || {};
window['AscCommonSlide'] = window['AscCommonSlide'] || {};
window['Asc']['CAscSlideTiming'] = CAscSlideTiming;
CAscSlideTiming.prototype['put_TransitionType'] = CAscSlideTiming.prototype.put_TransitionType;
CAscSlideTiming.prototype['get_TransitionType'] = CAscSlideTiming.prototype.get_TransitionType;
CAscSlideTiming.prototype['put_TransitionOption'] = CAscSlideTiming.prototype.put_TransitionOption;
CAscSlideTiming.prototype['get_TransitionOption'] = CAscSlideTiming.prototype.get_TransitionOption;
CAscSlideTiming.prototype['put_TransitionDuration'] = CAscSlideTiming.prototype.put_TransitionDuration;
CAscSlideTiming.prototype['get_TransitionDuration'] = CAscSlideTiming.prototype.get_TransitionDuration;
CAscSlideTiming.prototype['put_SlideAdvanceOnMouseClick'] = CAscSlideTiming.prototype.put_SlideAdvanceOnMouseClick;
CAscSlideTiming.prototype['get_SlideAdvanceOnMouseClick'] = CAscSlideTiming.prototype.get_SlideAdvanceOnMouseClick;
CAscSlideTiming.prototype['put_SlideAdvanceAfter'] = CAscSlideTiming.prototype.put_SlideAdvanceAfter;
CAscSlideTiming.prototype['get_SlideAdvanceAfter'] = CAscSlideTiming.prototype.get_SlideAdvanceAfter;
CAscSlideTiming.prototype['put_SlideAdvanceDuration'] = CAscSlideTiming.prototype.put_SlideAdvanceDuration;
CAscSlideTiming.prototype['get_SlideAdvanceDuration'] = CAscSlideTiming.prototype.get_SlideAdvanceDuration;
CAscSlideTiming.prototype['put_ShowLoop'] = CAscSlideTiming.prototype.put_ShowLoop;
CAscSlideTiming.prototype['get_ShowLoop'] = CAscSlideTiming.prototype.get_ShowLoop;
CAscSlideTiming.prototype['applyProps'] = CAscSlideTiming.prototype.applyProps;
CAscSlideTiming.prototype['createDuplicate'] = CAscSlideTiming.prototype.createDuplicate;
CAscSlideTiming.prototype['makeDuplicate'] = CAscSlideTiming.prototype.makeDuplicate;
CAscSlideTiming.prototype['setUndefinedOptions'] = CAscSlideTiming.prototype.setUndefinedOptions;
CAscSlideTiming.prototype['setDefaultParams'] = CAscSlideTiming.prototype.setDefaultParams;
CAscSlideTiming.prototype['Write_ToBinary'] = CAscSlideTiming.prototype.Write_ToBinary;
CAscSlideTiming.prototype['Read_FromBinary'] = CAscSlideTiming.prototype.Read_FromBinary;

window['AscCommonSlide'].CAscThemeInfo = CAscThemeInfo;
CAscThemeInfo.prototype['get_Name'] = CAscThemeInfo.prototype.get_Name;
CAscThemeInfo.prototype['get_Url'] = CAscThemeInfo.prototype.get_Url;
CAscThemeInfo.prototype['get_Image'] = CAscThemeInfo.prototype.get_Image;
CAscThemeInfo.prototype['get_Index'] = CAscThemeInfo.prototype.get_Index;

CLayoutThumbnail.prototype['getIndex'] = CLayoutThumbnail.prototype.getIndex;
CLayoutThumbnail.prototype['getType'] = CLayoutThumbnail.prototype.getType;
CLayoutThumbnail.prototype['get_Image'] = CLayoutThumbnail.prototype.get_Image;
CLayoutThumbnail.prototype['get_Name'] = CLayoutThumbnail.prototype.get_Name;
CLayoutThumbnail.prototype['get_Width'] = CLayoutThumbnail.prototype.get_Width;
CLayoutThumbnail.prototype['get_Height'] = CLayoutThumbnail.prototype.get_Height;
