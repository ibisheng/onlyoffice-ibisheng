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
/**
 * User: Ilja.Kirillov
 * Date: 03.11.2016
 * Time: 11:37
 */

var drawing_Inline = 0x01;
var drawing_Anchor = 0x02;

var WRAPPING_TYPE_NONE           = 0x00;
var WRAPPING_TYPE_SQUARE         = 0x01;
var WRAPPING_TYPE_THROUGH        = 0x02;
var WRAPPING_TYPE_TIGHT          = 0x03;
var WRAPPING_TYPE_TOP_AND_BOTTOM = 0x04;

var WRAP_HIT_TYPE_POINT   = 0x00;
var WRAP_HIT_TYPE_SECTION = 0x01;

/**
 * Оберточный класс для автофигур и картинок. Именно он непосредственно лежит в ране.
 * @constructor
 * @extends {CRunElementBase}
 */
function ParaDrawing(W, H, GraphicObj, DrawingDocument, DocumentContent, Parent)
{
	CRunElementBase.call(this);

	this.Id          = AscCommon.g_oIdCounter.Get_NewId();
	this.DrawingType = drawing_Inline;
	this.GraphicObj  = GraphicObj;

	this.X      = 0;
	this.Y      = 0;
	this.Width  = 0;
	this.Height = 0;

	this.PageNum = 0;
	this.LineNum = 0;
	this.YOffset = 0;

	this.DocumentContent = DocumentContent;
	this.DrawingDocument = DrawingDocument;
	this.Parent          = Parent;

	this.LogicDocument = DrawingDocument ? DrawingDocument.m_oLogicDocument : null;

	// Расстояние до окружающего текста
	this.Distance = {
		T : 0,
		B : 0,
		L : 0,
		R : 0
	};

	// Расположение в таблице
	this.LayoutInCell = true;

	// Z-order
	this.RelativeHeight = undefined;

	//
	this.SimplePos = {
		Use : false,
		X   : 0,
		Y   : 0
	};

	// Ширина и высота
	this.Extent = {
		W : W,
		H : H
	};

	this.EffectExtent = {
		L : 0,
		T : 0,
		R : 0,
		B : 0
	};

	this.docPr = new AscFormat.CNvPr();

	this.SizeRelH = undefined;
	this.SizeRelV = undefined;
	//{RelativeFrom      : c_oAscRelativeFromH.Column, Percent: ST_PositivePercentage}

	this.AllowOverlap = true;

	//привязка к параграфу
	this.Locked = null;

	//скрытые drawing'и
	this.Hidden = null;

	// Позиция по горизонтали
	this.PositionH = {
		RelativeFrom : c_oAscRelativeFromH.Column, // Относительно чего вычисляем координаты
		Align        : false,                      // true : В поле Value лежит тип прилегания, false - в поле Value
												   // лежит точное значени
		Value        : 0,                          //
		Percent      : false                       // Значение Valuе задано в процентах
	};

	// Позиция по горизонтали
	this.PositionV = {
		RelativeFrom : c_oAscRelativeFromV.Paragraph, // Относительно чего вычисляем координаты
		Align        : false,                         // true : В поле Value лежит тип прилегания, false - в поле Value
													  // лежит точное значени
		Value        : 0,                             //
		Percent      : false                          // Значение Valuе задано в процентах
	};

	// Данный поля используются для перемещения Flow-объекта
	this.PositionH_Old = undefined;
	this.PositionV_Old = undefined;

	this.Internal_Position = new CAnchorPosition();

	// Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
	//--------------------------------------------------------
	this.selectX      = 0;
	this.selectY      = 0;
	this.wrappingType = WRAPPING_TYPE_THROUGH;
	this.useWrap      = true;

	if (typeof CWrapPolygon !== "undefined")
		this.wrappingPolygon = new CWrapPolygon(this);

	this.document        = editor.WordControl.m_oLogicDocument;
	this.drawingDocument = DrawingDocument;
	this.graphicObjects  = editor.WordControl.m_oLogicDocument.DrawingObjects;
	this.selected        = false;

	this.behindDoc    = false;
	this.bNoNeedToAdd = false;

	this.pageIndex = -1;
	this.Lock      = new AscCommon.CLock();

	this.ParaMath = null;

	this.SkipOnRecalculate = false;
	//------------------------------------------------------------
	g_oTableId.Add(this, this.Id);

	if (this.graphicObjects)
	{
		this.Set_RelativeHeight(this.graphicObjects.getZIndex());
		if (History.Is_On() && !g_oTableId.m_bTurnOff)
		{
			this.graphicObjects.addGraphicObject(this);
		}
	}
}
ParaDrawing.prototype = Object.create(CRunElementBase.prototype);
ParaDrawing.prototype.constructor = ParaDrawing;

ParaDrawing.prototype.Type = para_Drawing;
ParaDrawing.prototype.Get_Type = function()
{
	return this.Type;
};
ParaDrawing.prototype.Get_Width = function()
{
	return this.Width;
};
ParaDrawing.prototype.Get_WidthVisible = function()
{
	return this.WidthVisible;
};
ParaDrawing.prototype.Set_WidthVisible = function(WidthVisible)
{
	this.WidthVisible = WidthVisible;
};
ParaDrawing.prototype.Get_SelectedContent = function(SelectedContent)
{
	if (this.GraphicObj && this.GraphicObj.Get_SelectedContent)
	{
		this.GraphicObj.Get_SelectedContent(SelectedContent);
	}
};
ParaDrawing.prototype.Search_GetId = function(bNext, bCurrent)
{
	if (isRealObject(this.GraphicObj) && typeof  this.GraphicObj.Search_GetId === "function")
		return this.GraphicObj.Search_GetId(bNext, bCurrent);
	return null;
};

ParaDrawing.prototype.CheckCorrect = function(){
	if(!this.GraphicObj){
		return false;
	}
	if(this.GraphicObj && this.GraphicObj.checkCorrect){
		return this.GraphicObj.checkCorrect();
	}
	return true;
};

ParaDrawing.prototype.Get_AllDrawingObjects = function(DrawingObjects)
{
	if (null == DrawingObjects)
	{
		DrawingObjects = [];
	}
	if (this.GraphicObj.Get_AllDrawingObjects)
	{
		this.GraphicObj.Get_AllDrawingObjects(DrawingObjects);
	}
};
ParaDrawing.prototype.canRotate = function()
{
	return isRealObject(this.GraphicObj) && typeof this.GraphicObj.canRotate == "function" && this.GraphicObj.canRotate();
};
ParaDrawing.prototype.Get_Paragraph = function()
{
	return this.Parent;
};
ParaDrawing.prototype.Get_Run = function()
{
	if (this.Parent)
		return this.Parent.Get_DrawingObjectRun(this.Id);

	return null;
};
ParaDrawing.prototype.Get_Props = function(OtherProps)
{
	var Props    = {};
	Props.Width  = this.GraphicObj.extX;
	Props.Height = this.GraphicObj.extY;
	if (drawing_Inline === this.DrawingType)
		Props.WrappingStyle = c_oAscWrapStyle2.Inline;
	else if (WRAPPING_TYPE_NONE === this.wrappingType)
		Props.WrappingStyle = ( this.behindDoc === true ? c_oAscWrapStyle2.Behind : c_oAscWrapStyle2.InFront );
	else
	{
		switch (this.wrappingType)
		{
			case WRAPPING_TYPE_SQUARE         :
				Props.WrappingStyle = c_oAscWrapStyle2.Square;
				break;
			case WRAPPING_TYPE_TIGHT          :
				Props.WrappingStyle = c_oAscWrapStyle2.Tight;
				break;
			case WRAPPING_TYPE_THROUGH        :
				Props.WrappingStyle = c_oAscWrapStyle2.Through;
				break;
			case WRAPPING_TYPE_TOP_AND_BOTTOM :
				Props.WrappingStyle = c_oAscWrapStyle2.TopAndBottom;
				break;
			default                           :
				Props.WrappingStyle = c_oAscWrapStyle2.Inline;
				break;
		}
	}

	if (drawing_Inline === this.DrawingType)
	{
		Props.Paddings =
		{
			Left   : AscFormat.DISTANCE_TO_TEXT_LEFTRIGHT,
			Right  : AscFormat.DISTANCE_TO_TEXT_LEFTRIGHT,
			Top    : 0,
			Bottom : 0
		};
	}
	else
	{
		var oDistance  = this.Get_Distance();
		Props.Paddings =
		{
			Left   : oDistance.L,
			Right  : oDistance.R,
			Top    : oDistance.T,
			Bottom : oDistance.B
		};
	}

	Props.AllowOverlap = this.AllowOverlap;

	Props.Position =
	{
		X : this.X,
		Y : this.Y
	};

	Props.PositionH =
	{
		RelativeFrom : this.PositionH.RelativeFrom,
		UseAlign     : this.PositionH.Align,
		Align        : ( true === this.PositionH.Align ? this.PositionH.Value : undefined ),
		Value        : ( true === this.PositionH.Align ? 0 : this.PositionH.Value ),
		Percent      : this.PositionH.Percent
	};

	Props.PositionV =
	{
		RelativeFrom : this.PositionV.RelativeFrom,
		UseAlign     : this.PositionV.Align,
		Align        : ( true === this.PositionV.Align ? this.PositionV.Value : undefined ),
		Value        : ( true === this.PositionV.Align ? 0 : this.PositionV.Value ),
		Percent      : this.PositionV.Percent
	};


	if (this.SizeRelH && this.SizeRelH.Percent > 0)
	{
		Props.SizeRelH =
		{
			RelativeFrom : AscFormat.ConvertRelSizeHToRelPosition(this.SizeRelH.RelativeFrom),
			Value        : (this.SizeRelH.Percent * 100) >> 0
		};
	}

	if (this.SizeRelV && this.SizeRelV.Percent > 0)
	{
		Props.SizeRelV =
		{
			RelativeFrom : AscFormat.ConvertRelSizeVToRelPosition(this.SizeRelV.RelativeFrom),
			Value        : (this.SizeRelV.Percent * 100) >> 0
		};
	}

	Props.Internal_Position = this.Internal_Position;

	Props.Locked        = this.Lock.Is_Locked();
	var ParentParagraph = this.Get_ParentParagraph();
	if (ParentParagraph && undefined !== ParentParagraph.Parent)
	{
		var DocContent = ParentParagraph.Parent;
		if (true === DocContent.Is_DrawingShape() || (DocContent.Get_TopDocumentContent() instanceof CFootEndnote))
			Props.CanBeFlow = false;
	}

    Props.title = this.docPr.title !== null ? this.docPr.title : undefined;
    Props.description = this.docPr.descr !== null ? this.docPr.descr : undefined;

	if (null != OtherProps && undefined != OtherProps)
	{
		// Соединяем
		if (undefined === OtherProps.Width || 0.001 > Math.abs(Props.Width - OtherProps.Width))
			Props.Width = undefined;

		if (undefined === OtherProps.Height || 0.001 > Math.abs(Props.Height - OtherProps.Height))
			Props.Height = undefined;

		if (undefined === OtherProps.WrappingStyle || Props.WrappingStyle != OtherProps.WrappingStyle)
			Props.WrappingStyle = undefined;

		if (undefined === OtherProps.ImageUrl || Props.ImageUrl != OtherProps.ImageUrl)
			Props.ImageUrl = undefined;

		if (undefined === OtherProps.Paddings.Left || 0.001 > Math.abs(Props.Paddings.Left - OtherProps.Paddings.Left))
			Props.Paddings.Left = undefined;

		if (undefined === OtherProps.Paddings.Right || 0.001 > Math.abs(Props.Paddings.Right - OtherProps.Paddings.Right))
			Props.Paddings.Right = undefined;

		if (undefined === OtherProps.Paddings.Top || 0.001 > Math.abs(Props.Paddings.Top - OtherProps.Paddings.Top))
			Props.Paddings.Top = undefined;

		if (undefined === OtherProps.Paddings.Bottom || 0.001 > Math.abs(Props.Paddings.Bottom - OtherProps.Paddings.Bottom))
			Props.Paddings.Bottom = undefined;

		if (undefined === OtherProps.AllowOverlap || Props.AllowOverlap != OtherProps.AllowOverlap)
			Props.AllowOverlap = undefined;

		if (undefined === OtherProps.Position.X || 0.001 > Math.abs(Props.Position.X - OtherProps.Position.X))
			Props.Position.X = undefined;

		if (undefined === OtherProps.Position.Y || 0.001 > Math.abs(Props.Position.Y - OtherProps.Position.Y))
			Props.Position.Y = undefined;

		if (undefined === OtherProps.PositionH.RelativeFrom || Props.PositionH.RelativeFrom != OtherProps.PositionH.RelativeFrom)
			Props.PositionH.RelativeFrom = undefined;

		if (undefined === OtherProps.PositionH.UseAlign || Props.PositionH.UseAlign != OtherProps.PositionH.UseAlign)
			Props.PositionH.UseAlign = undefined;

		if (Props.PositionH.RelativeFrom === OtherProps.PositionH.RelativeFrom && Props.PositionH.UseAlign === OtherProps.PositionH.UseAlign)
		{
			if (true != Props.PositionH.UseAlign && 0.001 > Math.abs(Props.PositionH.Value - OtherProps.PositionH.Value))
				Props.PositionH.Value = undefined;

			if (true === Props.PositionH.UseAlign && Props.PositionH.Align != OtherProps.PositionH.Align)
				Props.PositionH.Align = undefined;
		}

		if (undefined === OtherProps.PositionV.RelativeFrom || Props.PositionV.RelativeFrom != OtherProps.PositionV.RelativeFrom)
			Props.PositionV.RelativeFrom = undefined;

		if (undefined === OtherProps.PositionV.UseAlign || Props.PositionV.UseAlign != OtherProps.PositionV.UseAlign)
			Props.PositionV.UseAlign = undefined;

		if (Props.PositionV.RelativeFrom === OtherProps.PositionV.RelativeFrom && Props.PositionV.UseAlign === OtherProps.PositionV.UseAlign)
		{
			if (true != Props.PositionV.UseAlign && 0.001 > Math.abs(Props.PositionV.Value - OtherProps.PositionV.Value))
				Props.PositionV.Value = undefined;

			if (true === Props.PositionV.UseAlign && Props.PositionV.Align != OtherProps.PositionV.Align)
				Props.PositionV.Align = undefined;
		}


		if (false === OtherProps.Locked)
			Props.Locked = false;

		if (false === OtherProps.CanBeFlow || false === Props.CanBeFlow)
			Props.CanBeFlow = false;
		else
			Props.CanBeFlow = true;

		if(undefined === OtherProps.title || Props.title !== OtherProps.title){
			Props.title = undefined;
		}

		if(undefined === OtherProps.description || Props.description !== OtherProps.description){
			Props.description = undefined;
		}
	}

	return Props;
};
ParaDrawing.prototype.Is_UseInDocument = function()
{
	if (this.Parent)
	{
		var Run = this.Parent.Get_DrawingObjectRun(this.Id);
		if (Run)
		{
			return Run.Is_UseInDocument(this.Get_Id());
		}
	}
	return false;
};
ParaDrawing.prototype.CheckGroupSizes = function()
{
	if (this.GraphicObj && this.GraphicObj.CheckGroupSizes)
	{
		this.GraphicObj.CheckGroupSizes();
	}
};
ParaDrawing.prototype.Set_DrawingType = function(DrawingType)
{
	History.Add(new CChangesParaDrawingDrawingType(this, this.DrawingType, DrawingType));
	this.DrawingType = DrawingType;
};
ParaDrawing.prototype.Set_WrappingType = function(WrapType)
{
	History.Add(new CChangesParaDrawingWrappingType(this, this.wrappingType, WrapType));
	this.wrappingType = WrapType;
};
ParaDrawing.prototype.Set_Distance = function(L, T, R, B)
{
	var oDistance = this.Get_Distance();
	if (!AscFormat.isRealNumber(L))
	{
		L = oDistance.L;
	}
	if (!AscFormat.isRealNumber(T))
	{
		T = oDistance.T;
	}
	if (!AscFormat.isRealNumber(R))
	{
		R = oDistance.R;
	}
	if (!AscFormat.isRealNumber(B))
	{
		B = oDistance.B;
	}

	History.Add(new CChangesParaDrawingDistance(this,
		{
			Left   : this.Distance.L,
			Top    : this.Distance.T,
			Right  : this.Distance.R,
			Bottom : this.Distance.B
		},
		{
			Left   : L,
			Top    : T,
			Right  : R,
			Bottom : B
		}));

	this.Distance.L = L;
	this.Distance.R = R;
	this.Distance.T = T;
	this.Distance.B = B;
};
ParaDrawing.prototype.Set_AllowOverlap = function(AllowOverlap)
{
	History.Add(new CChangesParaDrawingAllowOverlap(this, this.AllowOverlap, AllowOverlap));
	this.AllowOverlap = AllowOverlap;
};
ParaDrawing.prototype.Set_PositionH = function(RelativeFrom, Align, Value, Percent)
{
	History.Add(new CChangesParaDrawingPositionH(this,
		{
			RelativeFrom : this.PositionH.RelativeFrom,
			Align        : this.PositionH.Align,
			Value        : this.PositionH.Value,
			Percent      : this.PositionH.Percent
		},
		{
			RelativeFrom : RelativeFrom,
			Align        : Align,
			Value        : Value,
			Percent      : Percent
		}));
	this.PositionH.RelativeFrom = RelativeFrom;
	this.PositionH.Align        = Align;
	this.PositionH.Value        = Value;
	this.PositionH.Percent      = Percent;
};
ParaDrawing.prototype.Set_PositionV = function(RelativeFrom, Align, Value, Percent)
{
	History.Add(new CChangesParaDrawingPositionV(this,
		{
			RelativeFrom : this.PositionV.RelativeFrom,
			Align        : this.PositionV.Align,
			Value        : this.PositionV.Value,
			Percent      : this.PositionV.Percent
		},
		{
			RelativeFrom : RelativeFrom,
			Align        : Align,
			Value        : Value,
			Percent      : Percent
		}));

	this.PositionV.RelativeFrom = RelativeFrom;
	this.PositionV.Align        = Align;
	this.PositionV.Value        = Value;
	this.PositionV.Percent      = Percent;
};
ParaDrawing.prototype.Set_BehindDoc = function(BehindDoc)
{
	History.Add(new CChangesParaDrawingBehindDoc(this, this.behindDoc, BehindDoc));
	this.behindDoc = BehindDoc;
};
ParaDrawing.prototype.Set_GraphicObject = function(graphicObject)
{
	var oldId = isRealObject(this.GraphicObj) ? this.GraphicObj.Get_Id() : null;
	var newId = isRealObject(graphicObject) ? graphicObject.Get_Id() : null;

	History.Add(new CChangesParaDrawingGraphicObject(this, oldId, newId));

	if (graphicObject && graphicObject.handleUpdateExtents)
		graphicObject.handleUpdateExtents();

	this.GraphicObj = graphicObject;
};
ParaDrawing.prototype.setSimplePos = function(use, x, y)
{
	History.Add(new CChangesParaDrawingSimplePos(this,
		{
			Use : this.SimplePos.Use,
			X   : this.SimplePos.X,
			Y   : this.SimplePos.Y
		},
		{
			Use : use,
			X   : x,
			Y   : y
		}));

	this.SimplePos.Use = use;
	this.SimplePos.X   = x;
	this.SimplePos.Y   = y;
};
ParaDrawing.prototype.setExtent = function(extX, extY)
{
	History.Add(new CChangesParaDrawingExtent(this,
		{
			W : this.Extent.W,
			H : this.Extent.H
		},
		{
			W : extX,
			H : extY
		}));

	this.Extent.W = extX;
	this.Extent.H = extY;
};
ParaDrawing.prototype.addWrapPolygon = function(wrapPolygon)
{
	History.Add(new CChangesParaDrawingWrapPolygon(this, this.wrappingPolygon, wrapPolygon));
	this.wrappingPolygon = wrapPolygon;
};
ParaDrawing.prototype.Set_Locked = function(bLocked)
{
	History.Add(new CChangesParaDrawingLocked(this, this.Locked, bLocked));
	this.Locked = bLocked;
};
ParaDrawing.prototype.Set_RelativeHeight = function(nRelativeHeight)
{
	History.Add(new CChangesParaDrawingRelativeHeight(this, this.RelativeHeight, nRelativeHeight));
	this.Set_RelativeHeight2(nRelativeHeight);
};
ParaDrawing.prototype.Set_RelativeHeight2 = function(nRelativeHeight)
{
	this.RelativeHeight = nRelativeHeight;
	if (this.graphicObjects && AscFormat.isRealNumber(nRelativeHeight) && nRelativeHeight > this.graphicObjects.maximalGraphicObjectZIndex)
	{
		this.graphicObjects.maximalGraphicObjectZIndex = nRelativeHeight;
	}
};
ParaDrawing.prototype.setEffectExtent = function(L, T, R, B)
{
	var oEE = this.EffectExtent;
	History.Add(new CChangesParaDrawingEffectExtent(this,
		{
			L : oEE.L,
			T : oEE.T,
			R : oEE.R,
			B : oEE.B
		},
		{
			L : L,
			T : T,
			R : R,
			B : B
		}));

	this.EffectExtent.L = L;
	this.EffectExtent.T = T;
	this.EffectExtent.R = R;
	this.EffectExtent.B = B;
};
ParaDrawing.prototype.Set_Parent = function(oParent)
{
	History.Add(new CChangesParaDrawingParent(this, this.Parent, oParent));
	this.Parent = oParent;
};
ParaDrawing.prototype.Set_ParaMath = function(ParaMath)
{
	History.Add(new CChangesParaDrawingParaMath(this, this.ParaMath, ParaMath));
	this.ParaMath = ParaMath;
};
ParaDrawing.prototype.Set_LayoutInCell = function(LayoutInCell)
{
	if (this.LayoutInCell === LayoutInCell)
		return;

	History.Add(new CChangesParaDrawingLayoutInCell(this, this.LayoutInCell, LayoutInCell));
	this.LayoutInCell = LayoutInCell;
};
ParaDrawing.prototype.SetSizeRelH = function(oSize)
{
	History.Add(new CChangesParaDrawingSizeRelH(this, this.SizeRelH, oSize));
	this.SizeRelH = oSize;
};
ParaDrawing.prototype.SetSizeRelV  = function(oSize)
{
	History.Add(new CChangesParaDrawingSizeRelV(this, this.SizeRelV, oSize));
	this.SizeRelV = oSize;
};
ParaDrawing.prototype.getXfrmExtX = function()
{
	if (isRealObject(this.GraphicObj) && isRealObject(this.GraphicObj.spPr) && isRealObject(this.GraphicObj.spPr.xfrm))
		return this.GraphicObj.spPr.xfrm.extX;
	if (AscFormat.isRealNumber(this.Extent.W))
		return this.Extent.W;
	return 0;
};
ParaDrawing.prototype.getXfrmExtY = function()
{
	if (isRealObject(this.GraphicObj) && isRealObject(this.GraphicObj.spPr) && isRealObject(this.GraphicObj.spPr.xfrm))
		return this.GraphicObj.spPr.xfrm.extY;
	if (AscFormat.isRealNumber(this.Extent.H))
		return this.Extent.H;
	return 0;
};
ParaDrawing.prototype.Get_Bounds = function()
{
    var W, H;
    W = this.GraphicObj.bounds.w;
    H = this.GraphicObj.bounds.h;
    return {Left : this.X, Top : this.Y, Bottom : this.Y + H, Right : this.X + W};
};
ParaDrawing.prototype.Search = function(Str, Props, SearchEngine, Type)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.Search === "function")
	{
		this.GraphicObj.Search(Str, Props, SearchEngine, Type)
	}
};
ParaDrawing.prototype.Set_Props = function(Props)
{
	var bCheckWrapPolygon = false;
	if (undefined != Props.WrappingStyle)
	{
		if (drawing_Inline === this.DrawingType && c_oAscWrapStyle2.Inline != Props.WrappingStyle && undefined === Props.Paddings)
		{
			this.Set_Distance(3.2, 0, 3.2, 0);
		}

		this.Set_DrawingType(c_oAscWrapStyle2.Inline === Props.WrappingStyle ? drawing_Inline : drawing_Anchor);
		if (c_oAscWrapStyle2.Inline === Props.WrappingStyle)
		{
			if (isRealObject(this.GraphicObj.bounds) && AscFormat.isRealNumber(this.GraphicObj.bounds.w) && AscFormat.isRealNumber(this.GraphicObj.bounds.h))
			{
				this.CheckWH();
			}
		}
		if (c_oAscWrapStyle2.Behind === Props.WrappingStyle || c_oAscWrapStyle2.InFront === Props.WrappingStyle)
		{
			this.Set_WrappingType(WRAPPING_TYPE_NONE);
			this.Set_BehindDoc(c_oAscWrapStyle2.Behind === Props.WrappingStyle ? true : false);
		}
		else
		{
			switch (Props.WrappingStyle)
			{
				case c_oAscWrapStyle2.Square      :
					this.Set_WrappingType(WRAPPING_TYPE_SQUARE);
					break;
				case c_oAscWrapStyle2.Tight       :
				{
					bCheckWrapPolygon = true;
					this.Set_WrappingType(WRAPPING_TYPE_TIGHT);
					break;
				}
				case c_oAscWrapStyle2.Through     :
				{
					this.Set_WrappingType(WRAPPING_TYPE_THROUGH);
					bCheckWrapPolygon = true;
					break;
				}
				case c_oAscWrapStyle2.TopAndBottom:
					this.Set_WrappingType(WRAPPING_TYPE_TOP_AND_BOTTOM);
					break;
				default                           :
					this.Set_WrappingType(WRAPPING_TYPE_SQUARE);
					break;
			}

			this.Set_BehindDoc(false);
		}
	}

	if (undefined != Props.Paddings)
		this.Set_Distance(Props.Paddings.Left, Props.Paddings.Top, Props.Paddings.Right, Props.Paddings.Bottom);

	if (undefined != Props.AllowOverlap)
		this.Set_AllowOverlap(Props.AllowOverlap);

	if (undefined != Props.PositionH)
	{
		this.Set_PositionH(Props.PositionH.RelativeFrom, Props.PositionH.UseAlign, ( true === Props.PositionH.UseAlign ? Props.PositionH.Align : Props.PositionH.Value ), Props.PositionH.Percent);
	}
	if (undefined != Props.PositionV)
	{
		this.Set_PositionV(Props.PositionV.RelativeFrom, Props.PositionV.UseAlign, ( true === Props.PositionV.UseAlign ? Props.PositionV.Align : Props.PositionV.Value ), Props.PositionV.Percent);
	}
	if (undefined != Props.SizeRelH)
	{
		this.SetSizeRelH({
			RelativeFrom : AscFormat.ConvertRelPositionHToRelSize(Props.SizeRelH.RelativeFrom),
			Percent      : Props.SizeRelH.Value / 100.0
		});
	}

	if (undefined != Props.SizeRelV)
	{
		this.SetSizeRelV({
			RelativeFrom : AscFormat.ConvertRelPositionVToRelSize(Props.SizeRelV.RelativeFrom),
			Percent      : Props.SizeRelV.Value / 100.0
		});
	}

	if (this.SizeRelH && !this.SizeRelV)
	{
		this.SetSizeRelV({RelativeFrom : AscCommon.c_oAscSizeRelFromV.sizerelfromvPage, Percent : 0});
	}

	if (this.SizeRelV && !this.SizeRelH)
	{
		this.SetSizeRelH({RelativeFrom : AscCommon.c_oAscSizeRelFromH.sizerelfromhPage, Percent : 0})
	}

	if (bCheckWrapPolygon)
	{
		this.Check_WrapPolygon();
	}

	if(undefined != Props.description){
		this.docPr.setDescr(Props.description);
	}
	if(undefined != Props.title){
		this.docPr.setTitle(Props.title);
	}
};
ParaDrawing.prototype.CheckWH = function()
{
	if (!this.GraphicObj)
		return;
	this.GraphicObj.recalculate();
	var extX, extY, rot;
	if (this.GraphicObj.spPr && this.GraphicObj.spPr.xfrm )
	{
		if(AscFormat.isRealNumber(this.GraphicObj.spPr.xfrm.extX) && AscFormat.isRealNumber(this.GraphicObj.spPr.xfrm.extY))
		{
            extX = this.GraphicObj.spPr.xfrm.extX;
            extY = this.GraphicObj.spPr.xfrm.extY;
		}
		else
		{
			extX = 5;
			extY = 5;
		}
		if(AscFormat.isRealNumber(this.GraphicObj.spPr.xfrm.rot))
		{
			rot = this.GraphicObj.spPr.xfrm.rot;
		}
		else
		{
			rot = 0;
		}
	}
	else
	{
		extX = 5;
		extY = 5;
		rot = 0;
	}
	this.setExtent(extX, extY);

	var xc          = this.GraphicObj.localTransform.TransformPointX(this.GraphicObj.extX / 2, this.GraphicObj.extY / 2);
	var yc          = this.GraphicObj.localTransform.TransformPointY(this.GraphicObj.extX / 2, this.GraphicObj.extY / 2);
	var oBounds     = this.GraphicObj.bounds;
	var LineCorrect = 0;
	if (this.GraphicObj.pen && this.GraphicObj.pen.Fill && this.GraphicObj.pen.Fill.fill)
	{
		LineCorrect = (this.GraphicObj.pen.w == null) ? 12700 : parseInt(this.GraphicObj.pen.w);
		LineCorrect /= 72000.0;
	}
    if(!AscFormat.checkNormalRotate(rot)){
		var t = extX;
        extX = extY;
        extY = t;
	}

	var EEL = (xc - extX / 2) - oBounds.l + LineCorrect;
	var EET = (yc - extY / 2) - oBounds.t + LineCorrect;
	var EER = oBounds.r + LineCorrect - (xc + extX / 2);
	var EEB = oBounds.b + LineCorrect - (yc + extY / 2);
	this.setEffectExtent(EEL, EET, EER, EEB);
	this.Check_WrapPolygon();
};
ParaDrawing.prototype.Check_WrapPolygon = function()
{
	if ((this.wrappingType === WRAPPING_TYPE_TIGHT || this.wrappingType === WRAPPING_TYPE_THROUGH) && this.wrappingPolygon && !this.wrappingPolygon.edited)
	{
		this.GraphicObj.recalculate();
		this.wrappingPolygon.setArrRelPoints(this.wrappingPolygon.calculate(this.GraphicObj));
	}
};
ParaDrawing.prototype.Draw = function( X, Y, pGraphics, pageIndex, align)
{
	if (pGraphics.Start_Command)
	{
		pGraphics.m_aDrawings.push(new AscFormat.ParaDrawingStruct(pageIndex, this));
		return;
	}
	if (this.Is_Inline())
	{
		pGraphics.shapePageIndex = pageIndex;
		this.draw(pGraphics, pageIndex);
		pGraphics.shapePageIndex = null;
	}
	if (pGraphics.End_Command)
	{
		pGraphics.End_Command();
	}
};

ParaDrawing.prototype.Measure = function()
{
	if (!this.GraphicObj)
	{
		this.Width  = 0;
		this.Height = 0;
		return;
	}
	if (AscFormat.isRealNumber(this.Extent.W) && AscFormat.isRealNumber(this.Extent.H) && (!this.GraphicObj.checkAutofit || !this.GraphicObj.checkAutofit()) && !this.SizeRelH && !this.SizeRelV)
	{
		var oEffectExtent = this.EffectExtent;

		var W, H;
		if(AscFormat.isRealNumber(this.GraphicObj.rot)){
            if(AscFormat.checkNormalRotate(this.GraphicObj.rot))
            {
                W = this.Extent.W;
                H = this.Extent.H;
            }
            else
			{
                W = this.Extent.H;
                H = this.Extent.W;
			}
		}
		else{
			W = this.Extent.W;
			H = this.Extent.H;
		}
		this.Width        = W + AscFormat.getValOrDefault(oEffectExtent.L, 0) + AscFormat.getValOrDefault(oEffectExtent.R, 0);
		this.Height       = H + AscFormat.getValOrDefault(oEffectExtent.T, 0) + AscFormat.getValOrDefault(oEffectExtent.B, 0);
		this.WidthVisible = this.Width;
	}
	else
	{
		this.GraphicObj.recalculate();
		if (this.GraphicObj.recalculateText)
		{
			this.GraphicObj.recalculateText();
		}
		if (this.PositionH.UseAlign || this.Is_Inline())
		{
			this.Width = this.GraphicObj.bounds.w;
		}
		else
		{
			this.Width = this.GraphicObj.extX;
		}
		this.WidthVisible = this.Width;
		if (this.PositionV.UseAlign || this.Is_Inline())
		{
			this.Height = this.GraphicObj.bounds.h;
		}
		else
		{
			this.Height = this.GraphicObj.extY;
		}
	}
};
ParaDrawing.prototype.Save_RecalculateObject = function(Copy)
{
	var DrawingObj = {};

	DrawingObj.Type         = this.Type;
	DrawingObj.DrawingType  = this.DrawingType;
	DrawingObj.WrappingType = this.wrappingType;

	if (drawing_Anchor === this.Get_DrawingType() && true === this.Use_TextWrap())
	{
		var oDistance      = this.Get_Distance();
		DrawingObj.FlowPos =
		{
			X : this.X - oDistance.L,
			Y : this.Y - oDistance.T,
			W : this.Width + oDistance.R,
			H : this.Height + oDistance.B
		}
	}
	DrawingObj.PageNum         = this.PageNum;
	DrawingObj.X               = this.X;
	DrawingObj.Y               = this.Y;
	DrawingObj.spRecaclcObject = this.GraphicObj.getRecalcObject();

	return DrawingObj;
};
ParaDrawing.prototype.Load_RecalculateObject = function(RecalcObj)
{
	this.updatePosition3(RecalcObj.PageNum, RecalcObj.X, RecalcObj.Y);
	this.GraphicObj.setRecalcObject(RecalcObj.spRecaclcObject);
};
ParaDrawing.prototype.Reassign_ImageUrls = function(mapUrls)
{
	if (this.GraphicObj)
	{
		this.GraphicObj.Reassign_ImageUrls(mapUrls);
	}
};
ParaDrawing.prototype.Prepare_RecalculateObject = function()
{
};
ParaDrawing.prototype.Is_RealContent = function()
{
	return true;
};
ParaDrawing.prototype.Can_AddNumbering = function()
{
	if (drawing_Inline === this.DrawingType)
		return true;

	return false;
};
ParaDrawing.prototype.Copy = function()
{
	var c = new ParaDrawing(this.Extent.W, this.Extent.H, null, editor.WordControl.m_oLogicDocument.DrawingDocument, null, null);
	c.Set_DrawingType(this.DrawingType);
	if (isRealObject(this.GraphicObj))
	{
		c.Set_GraphicObject(this.GraphicObj.copy());
		c.GraphicObj.setParent(c);
	}

	var d = this.Distance;
	c.Set_PositionH(this.PositionH.RelativeFrom, this.PositionH.Align, this.PositionH.Value, this.PositionH.Percent);
	c.Set_PositionV(this.PositionV.RelativeFrom, this.PositionV.Align, this.PositionV.Value, this.PositionV.Percent);
	c.Set_Distance(d.L, d.T, d.R, d.B);
	c.Set_AllowOverlap(this.AllowOverlap);
	c.Set_WrappingType(this.wrappingType);
	if (this.wrappingPolygon)
	{
		c.wrappingPolygon.fromOther(this.wrappingPolygon);
	}
	c.Set_BehindDoc(this.behindDoc);
	c.Set_RelativeHeight(this.RelativeHeight);
	if (this.SizeRelH)
	{
		c.SetSizeRelH({RelativeFrom : this.SizeRelH.RelativeFrom, Percent : this.SizeRelH.Percent});
	}
	if (this.SizeRelV)
	{
		c.SetSizeRelV({RelativeFrom : this.SizeRelV.RelativeFrom, Percent : this.SizeRelV.Percent});
	}
	if (AscFormat.isRealNumber(this.Extent.W) && AscFormat.isRealNumber(this.Extent.H))
	{
		c.setExtent(this.Extent.W, this.Extent.H);
	}
	var EE = this.EffectExtent;
	if (EE.L > 0 || EE.T > 0 || EE.R > 0 || EE.B > 0)
	{
		c.setEffectExtent(EE.L, EE.T, EE.R, EE.B);
	}
	c.docPr.setFromOther(this.docPr);
	if (this.ParaMath)
		c.Set_ParaMath(this.ParaMath.Copy());
	return c;
};
ParaDrawing.prototype.Get_Id = function()
{
	return this.Id;
};
ParaDrawing.prototype.setParagraphTabs = function(tabs)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphTabs === "function")
		this.GraphicObj.setParagraphTabs(tabs);
};
ParaDrawing.prototype.IsMovingTableBorder = function()
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.IsMovingTableBorder === "function")
		return this.GraphicObj.IsMovingTableBorder();
	return false;
};
ParaDrawing.prototype.Update_Position = function(Paragraph, ParaLayout, PageLimits, PageLimitsOrigin, LineNum)
{
	if (undefined != this.PositionH_Old)
	{
		this.PositionH.RelativeFrom = this.PositionH_Old.RelativeFrom2;
		this.PositionH.Align        = this.PositionH_Old.Align2;
		this.PositionH.Value        = this.PositionH_Old.Value2;
		this.PositionH.Percent      = this.PositionH_Old.Percent2;
	}

	if (undefined != this.PositionV_Old)
	{
		this.PositionV.RelativeFrom = this.PositionV_Old.RelativeFrom2;
		this.PositionV.Align        = this.PositionV_Old.Align2;
		this.PositionV.Value        = this.PositionV_Old.Value2;
		this.PositionV.Percent      = this.PositionV_Old.Percent2;
	}

	this.Parent          = Paragraph;
	this.DocumentContent = this.Parent.Parent;
	var PageNum          = ParaLayout.PageNum;

	var OtherFlowObjects = editor.WordControl.m_oLogicDocument.DrawingObjects.getAllFloatObjectsOnPage(PageNum, this.Parent.Parent);
	var bInline          = this.Is_Inline();
	var W, H;
	if (this.Is_Inline())
	{
		W = this.GraphicObj.bounds.w;
		H = this.GraphicObj.bounds.h;
	}
	else
	{
		if (this.PositionH.Align)
			W = this.GraphicObj.bounds.w;
		else
			W = this.getXfrmExtX();

		if (this.PositionV.Align)
			H = this.GraphicObj.bounds.h;
		else
			H = this.getXfrmExtY();
	}
	this.Internal_Position.Set(W, H, this.YOffset, ParaLayout, PageLimitsOrigin, this.GraphicObj.bounds.l, this.GraphicObj.bounds.t, this.GraphicObj.bounds.w, this.GraphicObj.bounds.h);
	this.Internal_Position.Calculate_X(bInline, this.PositionH.RelativeFrom, this.PositionH.Align, this.PositionH.Value, this.PositionH.Percent);
	this.Internal_Position.Calculate_Y(bInline, this.PositionV.RelativeFrom, this.PositionV.Align, this.PositionV.Value, this.PositionV.Percent);
	this.Internal_Position.Correct_Values(bInline, PageLimits, this.AllowOverlap, this.Use_TextWrap(), OtherFlowObjects);

	var OldPageNum = this.PageNum;
	this.PageNum   = PageNum;
	this.LineNum   = LineNum;
	this.X         = this.Internal_Position.CalcX;
	this.Y         = this.Internal_Position.CalcY;

	if (undefined != this.PositionH_Old)
	{
		// Восстанови старые значения, чтобы в историю изменений все нормально записалось
		this.PositionH.RelativeFrom = this.PositionH_Old.RelativeFrom;
		this.PositionH.Align        = this.PositionH_Old.Align;
		this.PositionH.Value        = this.PositionH_Old.Value;
		this.PositionH.Percent      = this.PositionH_Old.Percent;

		// Рассчитаем сдвиг с учетом старой привязки
		var Value = this.Internal_Position.Calculate_X_Value(this.PositionH_Old.RelativeFrom);
		this.Set_PositionH(this.PositionH_Old.RelativeFrom, false, Value, false);
		// На всякий случай пересчитаем заново координату
		this.X = this.Internal_Position.Calculate_X(bInline, this.PositionH.RelativeFrom, this.PositionH.Align, this.PositionH.Value, this.PositionH.Percent);
	}

	if (undefined != this.PositionV_Old)
	{
		// Восстанови старые значения, чтобы в историю изменений все нормально записалось
		this.PositionV.RelativeFrom = this.PositionV_Old.RelativeFrom;
		this.PositionV.Align        = this.PositionV_Old.Align;
		this.PositionV.Value        = this.PositionV_Old.Value;
		this.PositionV.Percent      = this.PositionV_Old.Percent;

		// Рассчитаем сдвиг с учетом старой привязки
		var Value = this.Internal_Position.Calculate_Y_Value(this.PositionV_Old.RelativeFrom);
		this.Set_PositionV(this.PositionV_Old.RelativeFrom, false, Value, false);
		// На всякий случай пересчитаем заново координату
		this.Y = this.Internal_Position.Calculate_Y(bInline, this.PositionV.RelativeFrom, this.PositionV.Align, this.PositionV.Value, this.PositionV.Percent);
	}

	this.updatePosition3(this.PageNum, this.X, this.Y, OldPageNum);
	this.useWrap = this.Use_TextWrap();
};
ParaDrawing.prototype.Update_PositionYHeaderFooter = function(TopMarginY, BottomMarginY)
{
	this.Internal_Position.Update_PositionYHeaderFooter(TopMarginY, BottomMarginY);
	this.Internal_Position.Calculate_Y(this.Is_Inline(), this.PositionV.RelativeFrom, this.PositionV.Align, this.PositionV.Value, this.PositionV.Percent);
	this.Y = this.Internal_Position.CalcY;
	this.updatePosition3(this.PageNum, this.X, this.Y, this.PageNum);
};
ParaDrawing.prototype.Reset_SavedPosition = function()
{
	this.PositionV_Old = undefined;
	this.PositionH_Old = undefined;
};
ParaDrawing.prototype.setParagraphBorders = function(val)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphBorders === "function")
		this.GraphicObj.setParagraphBorders(val);
};
ParaDrawing.prototype.deselect = function()
{
	this.selected = false;
	if (this.GraphicObj && this.GraphicObj.deselect)
		this.GraphicObj.deselect();
};
ParaDrawing.prototype.updatePosition3 = function(pageIndex, x, y, oldPageNum)
{
	this.graphicObjects.removeById(pageIndex, this.Get_Id());
	if (AscFormat.isRealNumber(oldPageNum))
	{
		this.graphicObjects.removeById(oldPageNum, this.Get_Id());
	}
	this.setPageIndex(pageIndex);
	if (typeof this.GraphicObj.setStartPage === "function")
	{
		var bIsHfdFtr = this.DocumentContent && this.DocumentContent.Is_HdrFtr();
		this.GraphicObj.setStartPage(pageIndex, bIsHfdFtr, bIsHfdFtr);
	}
	var bInline = this.Is_Inline();
	var _x      = (this.PositionH.Align || bInline) ? x - this.GraphicObj.bounds.x : x;
	var _y      = (this.PositionV.Align || bInline) ? y - this.GraphicObj.bounds.y : y;

	if (!(this.DocumentContent && this.DocumentContent.Is_HdrFtr() && this.DocumentContent.Get_StartPage_Absolute() !== pageIndex))
	{
		this.graphicObjects.addObjectOnPage(pageIndex, this.GraphicObj);
		this.bNoNeedToAdd = false;
	}
	else
	{
		this.bNoNeedToAdd = true;
	}



	if (this.GraphicObj.bNeedUpdatePosition || !(AscFormat.isRealNumber(this.GraphicObj.posX) && AscFormat.isRealNumber(this.GraphicObj.posY)) || !(Math.abs(this.GraphicObj.posX - _x) < MOVE_DELTA && Math.abs(this.GraphicObj.posY - _y) < MOVE_DELTA))
		this.GraphicObj.updatePosition(_x, _y);
	if (this.GraphicObj.bNeedUpdatePosition || !(AscFormat.isRealNumber(this.wrappingPolygon.posX) && AscFormat.isRealNumber(this.wrappingPolygon.posY)) || !(Math.abs(this.wrappingPolygon.posX - _x) < MOVE_DELTA && Math.abs(this.wrappingPolygon.posY - _y) < MOVE_DELTA))
		this.wrappingPolygon.updatePosition(_x, _y);

    this.selectX = this.GraphicObj.bounds.l + _x;
    this.selectY = this.GraphicObj.bounds.t + _y;
	this.calculateSnapArrays();
};
ParaDrawing.prototype.calculateAfterChangeTheme = function()
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.calculateAfterChangeTheme === "function")
	{
		this.GraphicObj.calculateAfterChangeTheme();
	}
};
ParaDrawing.prototype.selectionIsEmpty = function()
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.selectionIsEmpty === "function")
		return this.GraphicObj.selectionIsEmpty();
	return false;
};
ParaDrawing.prototype.recalculateDocContent = function()
{
};
ParaDrawing.prototype.Shift = function(Dx, Dy)
{
	this.X += Dx;
	this.Y += Dy;

	this.updatePosition3(this.PageNum, this.X, this.Y);
};
ParaDrawing.prototype.Is_LayoutInCell = function()
{
	return this.LayoutInCell;
};
ParaDrawing.prototype.Get_Distance = function()
{
	var oDist = this.Distance;
	return new AscFormat.CDistance(AscFormat.getValOrDefault(oDist.L, AscFormat.DISTANCE_TO_TEXT_LEFTRIGHT), AscFormat.getValOrDefault(oDist.T, 0), AscFormat.getValOrDefault(oDist.R, AscFormat.DISTANCE_TO_TEXT_LEFTRIGHT), AscFormat.getValOrDefault(oDist.B, 0));
};
ParaDrawing.prototype.Set_XYForAdd = function(X, Y, NearPos, PageNum)
{
	if (null !== NearPos)
	{
		var Layout = NearPos.Paragraph.Get_Layout(NearPos.ContentPos, this);
		this.private_SetXYByLayout(X, Y, PageNum, Layout, true, true);

		var nRecalcIndex   = null;
		var oLogicDocument = this.document;
		if (oLogicDocument)
		{
			nRecalcIndex = oLogicDocument.Get_History().GetRecalculateIndex();
			this.SetSkipOnRecalculate(true);
            oLogicDocument.TurnOff_InterfaceEvents();
            oLogicDocument.Recalculate();
            oLogicDocument.TurnOn_InterfaceEvents(false)
			this.SetSkipOnRecalculate(false);
		}

		if (null !== nRecalcIndex)
			oLogicDocument.Get_History().SetRecalculateIndex(nRecalcIndex);

		Layout = NearPos.Paragraph.Get_Layout(NearPos.ContentPos, this);
		this.private_SetXYByLayout(X, Y, PageNum, Layout, true, true);
	}
};
ParaDrawing.prototype.SetSkipOnRecalculate = function(isSkip)
{
	this.SkipOnRecalculate = isSkip;
};
ParaDrawing.prototype.IsSkipOnRecalculate = function()
{
	return this.SkipOnRecalculate;
};
ParaDrawing.prototype.Set_XY = function(X, Y, Paragraph, PageNum, bResetAlign)
{
	if (Paragraph)
	{
		var ContentPos = Paragraph.Get_DrawingObjectContentPos(this.Get_Id());
		if (null === ContentPos)
			return;

		var Layout = Paragraph.Get_Layout(ContentPos, this);
		this.private_SetXYByLayout(X, Y, PageNum, Layout, (bResetAlign || true !== this.PositionH.Align ? true : false), (bResetAlign || true !== this.PositionV.Align ? true : false));

		var nRecalcIndex   = null;
		var oLogicDocument = this.document;
		if (oLogicDocument)
		{
			nRecalcIndex = oLogicDocument.Get_History().GetRecalculateIndex();
			this.SetSkipOnRecalculate(true);
			oLogicDocument.Recalculate();
			this.SetSkipOnRecalculate(false);
		}

		if (null !== nRecalcIndex)
			oLogicDocument.Get_History().SetRecalculateIndex(nRecalcIndex);

		Layout = Paragraph.Get_Layout(ContentPos, this);
		this.private_SetXYByLayout(X, Y, PageNum, Layout, (bResetAlign || true !== this.PositionH.Align ? true : false), (bResetAlign || true !== this.PositionV.Align ? true : false));
	}
};
ParaDrawing.prototype.private_SetXYByLayout = function(X, Y, PageNum, Layout, bChangeX, bChangeY)
{
	this.PageNum = PageNum;

	var _W = (this.PositionH.Align ? this.Extent.W : this.getXfrmExtX() );
	var _H = (this.PositionV.Align ? this.Extent.H : this.getXfrmExtY() );

	this.Internal_Position.Set(_W, _H, this.YOffset, Layout.ParagraphLayout, Layout.PageLimitsOrigin, this.GraphicObj.bounds.l, this.GraphicObj.bounds.t, this.GraphicObj.bounds.w, this.GraphicObj.bounds.h);
	this.Internal_Position.Calculate_X(false, c_oAscRelativeFromH.Page, false, X - Layout.PageLimitsOrigin.X, false);
	this.Internal_Position.Calculate_Y(false, c_oAscRelativeFromV.Page, false, Y - Layout.PageLimitsOrigin.Y, false);
	this.Internal_Position.Correct_Values(false, Layout.PageLimits, this.AllowOverlap, this.Use_TextWrap(), []);

	if (true === bChangeX)
	{
		this.X = this.Internal_Position.CalcX;

		// Рассчитаем сдвиг с учетом старой привязки
		var ValueX = this.Internal_Position.Calculate_X_Value(this.PositionH.RelativeFrom);
		this.Set_PositionH(this.PositionH.RelativeFrom, false, ValueX, false);

		// На всякий случай пересчитаем заново координату
		this.X = this.Internal_Position.Calculate_X(false, this.PositionH.RelativeFrom, this.PositionH.Align, this.PositionH.Value, this.PositionH.Percent);
	}

	if (true === bChangeY)
	{
		this.Y = this.Internal_Position.CalcY;

		// Рассчитаем сдвиг с учетом старой привязки
		var ValueY = this.Internal_Position.Calculate_Y_Value(this.PositionV.RelativeFrom);
		this.Set_PositionV(this.PositionV.RelativeFrom, false, ValueY, false);

		// На всякий случай пересчитаем заново координату
		this.Y = this.Internal_Position.Calculate_Y(false, this.PositionV.RelativeFrom, this.PositionV.Align, this.PositionV.Value, this.PositionV.Percent);
	}
};
ParaDrawing.prototype.Get_DrawingType = function()
{
	return this.DrawingType;
};
ParaDrawing.prototype.Is_Inline = function()
{
	if (!this.Parent || !this.Parent.Get_ParentTextTransform || null !== this.Parent.Get_ParentTextTransform())
		return true;

	return ( drawing_Inline === this.DrawingType ? true : false );
};
ParaDrawing.prototype.Use_TextWrap = function()
{
	// Если автофигура привязана к параграфу с рамкой, обтекание не делается
	if (!this.Parent || !this.Parent.Get_FramePr || (null !== this.Parent.Get_FramePr() && undefined !== this.Parent.Get_FramePr()))
		return false;

	// здесь должна быть проверка, нужно ли использовать обтекание относительно данного объекта,
	// или он просто лежит над или под текстом.
	return ( drawing_Anchor === this.DrawingType && !(this.wrappingType === WRAPPING_TYPE_NONE) );
};
ParaDrawing.prototype.Draw_Selection = function()
{
	var Padding = this.DrawingDocument.GetMMPerDot(6);
	this.DrawingDocument.AddPageSelection(this.PageNum, this.selectX - Padding, this.selectY - Padding, this.Width + 2 * Padding, this.Height + 2 * Padding);
};
ParaDrawing.prototype.OnEnd_MoveInline = function(NearPos)
{
	NearPos.Paragraph.Check_NearestPos(NearPos);

	var RunPr = this.Remove_FromDocument(false);

	// При переносе всегда создаем копию, чтобы в совместном редактировании не было проблем
	var NewParaDrawing = this.Copy();
    this.DocumentContent.Select_DrawingObject(NewParaDrawing.Get_Id());
	NewParaDrawing.Add_ToDocument(NearPos, true, RunPr);

};
ParaDrawing.prototype.Get_ParentTextTransform = function()
{
	if (this.Parent)
	{
		return this.Parent.Get_ParentTextTransform();
	}
	return null;
};
ParaDrawing.prototype.GoTo_Text = function(bBefore, bUpdateStates)
{
	if (undefined != this.Parent && null != this.Parent)
	{
		this.Parent.Cursor_MoveTo_Drawing(this.Id, bBefore);
		this.Parent.Document_SetThisElementCurrent(undefined === bUpdateStates ? true : bUpdateStates);
	}
};
ParaDrawing.prototype.Remove_FromDocument = function(bRecalculate)
{
	var Result = null;
	var Run    = this.Parent.Get_DrawingObjectRun(this.Id);

	if (null !== Run)
	{
		Run.Remove_DrawingObject(this.Id);

		if (true === Run.Is_InHyperlink())
			Result = new CTextPr();
		else
			Result = Run.Get_TextPr();
	}

	if (false != bRecalculate)
		editor.WordControl.m_oLogicDocument.Recalculate();

	return Result;
};
ParaDrawing.prototype.Get_ParentParagraph = function()
{
	if (this.Parent instanceof Paragraph)
		return this.Parent;
	if (this.Parent instanceof ParaRun)
		return this.Parent.Paragraph;
	return null;
};
ParaDrawing.prototype.Add_ToDocument = function(NearPos, bRecalculate, RunPr, Run)
{
	NearPos.Paragraph.Check_NearestPos(NearPos);

	var LogicDocument = this.DrawingDocument.m_oLogicDocument;

	var Para       = new Paragraph(this.DrawingDocument, LogicDocument);
	var DrawingRun = new ParaRun(Para);
	DrawingRun.Add_ToContent(0, this);

	if (RunPr)
		DrawingRun.Set_Pr(RunPr.Copy());

	if (Run)
		DrawingRun.Set_ReviewTypeWithInfo(Run.Get_ReviewType(), Run.Get_ReviewInfo());

	Para.Add_ToContent(0, DrawingRun);

	var SelectedElement = new CSelectedElement(Para, false);
	var SelectedContent = new CSelectedContent();
	SelectedContent.Add(SelectedElement);
	SelectedContent.Set_MoveDrawing(true);

	NearPos.Paragraph.Parent.Insert_Content(SelectedContent, NearPos);
	NearPos.Paragraph.Clear_NearestPosArray();
	NearPos.Paragraph.Correct_Content();

	if (false != bRecalculate)
		LogicDocument.Recalculate();
};
ParaDrawing.prototype.Add_ToDocument2 = function(Paragraph)
{
	var DrawingRun = new ParaRun(Paragraph);
	DrawingRun.Add_ToContent(0, this);

	Paragraph.Add_ToContent(0, DrawingRun);
};
ParaDrawing.prototype.Update_CursorType = function(X, Y, PageIndex)
{
	this.DrawingDocument.SetCursorType("move", new AscCommon.CMouseMoveData());

	if (null != this.Parent)
	{
		var Lock = this.Parent.Lock;
		if (true === Lock.Is_Locked())
		{
			var PNum = Math.max(0, Math.min(PageIndex - this.Parent.PageNum, this.Parent.Pages.length - 1));
			var _X   = this.Parent.Pages[PNum].X;
			var _Y   = this.Parent.Pages[PNum].Y;

			var MMData              = new AscCommon.CMouseMoveData();
			var Coords              = this.DrawingDocument.ConvertCoordsToCursorWR(_X, _Y, this.Parent.Get_StartPage_Absolute() + ( PageIndex - this.Parent.PageNum ));
			MMData.X_abs            = Coords.X - 5;
			MMData.Y_abs            = Coords.Y;
			MMData.Type             = AscCommon.c_oAscMouseMoveDataTypes.LockedObject;
			MMData.UserId           = Lock.Get_UserId();
			MMData.HaveChanges      = Lock.Have_Changes();
			MMData.LockedObjectType = c_oAscMouseMoveLockedObjectType.Common;

			editor.sync_MouseMoveCallback(MMData);
		}
	}
};
ParaDrawing.prototype.Get_AnchorPos = function()
{
	return this.Parent.Get_AnchorPos(this);
};
ParaDrawing.prototype.CheckRecalcAutoFit = function(oSectPr)
{
	if (this.GraphicObj && this.GraphicObj.CheckNeedRecalcAutoFit)
	{
		if (this.GraphicObj.CheckNeedRecalcAutoFit(oSectPr))
		{
			if (this.GraphicObj)
			{
				this.GraphicObj.recalcWrapPolygon && this.GraphicObj.recalcWrapPolygon();
			}
			this.Measure();
		}
	}
};
//----------------------------------------------------------------------------------------------------------------------
// Undo/Redo функции
//----------------------------------------------------------------------------------------------------------------------
ParaDrawing.prototype.Get_ParentObject_or_DocumentPos = function()
{
	if (this.Parent != null)
		return this.Parent.Get_ParentObject_or_DocumentPos();
};
ParaDrawing.prototype.Refresh_RecalcData = function(Data)
{
	if (undefined != this.Parent && null != this.Parent)
	{
		if (isRealObject(Data))
		{
			switch (Data.Type)
			{
				case AscDFH.historyitem_Drawing_Distance:
				{
					if (this.GraphicObj)
					{
						this.GraphicObj.recalcWrapPolygon && this.GraphicObj.recalcWrapPolygon();
						this.GraphicObj.addToRecalculate();
					}
					break;
				}

				case AscDFH.historyitem_Drawing_SetExtent:
				{
					var Run = this.Parent.Get_DrawingObjectRun(this.Id);
					if (Run)
					{
						Run.RecalcInfo.Measure = true;
					}
					break;
				}

				case AscDFH.historyitem_Drawing_SetSizeRelH:
				case AscDFH.historyitem_Drawing_SetSizeRelV:
				case AscDFH.historyitem_Drawing_SetGraphicObject:
				{
					if (this.GraphicObj)
					{
						this.GraphicObj.handleUpdateExtents && this.GraphicObj.handleUpdateExtents();
						this.GraphicObj.addToRecalculate();
					}
					var Run = this.Parent.Get_DrawingObjectRun(this.Id);
					if (Run)
					{
						Run.RecalcInfo.Measure = true;
					}
					break;
				}
				case AscDFH.historyitem_Drawing_WrappingType:
				{
					if (this.GraphicObj)
					{
						this.GraphicObj.recalcWrapPolygon && this.GraphicObj.recalcWrapPolygon();
						this.GraphicObj.addToRecalculate()
					}
					break;
				}
			}
		}
		return this.Parent.Refresh_RecalcData2();
	}
};
//----------------------------------------------------------------------------------------------------------------------
// Функции для совместного редактирования
//----------------------------------------------------------------------------------------------------------------------
ParaDrawing.prototype.hyperlinkCheck = function(bCheck)
{
	if (isRealObject(this.GraphicObj) && typeof  this.GraphicObj.hyperlinkCheck === "function")
		return this.GraphicObj.hyperlinkCheck(bCheck);
	return null;
};
ParaDrawing.prototype.hyperlinkCanAdd = function(bCheckInHyperlink)
{
	if (isRealObject(this.GraphicObj) && typeof  this.GraphicObj.hyperlinkCanAdd === "function")
		return this.GraphicObj.hyperlinkCanAdd(bCheckInHyperlink);
	return false;
};
ParaDrawing.prototype.hyperlinkRemove = function()
{
	if (isRealObject(this.GraphicObj) && typeof  this.GraphicObj.hyperlinkCanAdd === "function")
		return this.GraphicObj.hyperlinkRemove();
	return false;
};
ParaDrawing.prototype.hyperlinkModify = function( HyperProps )
{
	if (isRealObject(this.GraphicObj) && typeof  this.GraphicObj.hyperlinkModify === "function")
		return this.GraphicObj.hyperlinkModify(HyperProps);
};
ParaDrawing.prototype.hyperlinkAdd = function( HyperProps )
{
	if (isRealObject(this.GraphicObj) && typeof  this.GraphicObj.hyperlinkAdd === "function")
		return this.GraphicObj.hyperlinkAdd(HyperProps);
};
ParaDrawing.prototype.documentStatistics = function(stat)
{
	if (isRealObject(this.GraphicObj) && typeof  this.GraphicObj.documentStatistics === "function")
		this.GraphicObj.documentStatistics(stat);
};
ParaDrawing.prototype.documentCreateFontCharMap = function(fontMap)
{
	if (isRealObject(this.GraphicObj) && typeof  this.GraphicObj.documentCreateFontCharMap === "function")
		this.GraphicObj.documentCreateFontCharMap(fontMap);
};
ParaDrawing.prototype.documentCreateFontMap = function(fontMap)
{
	if (isRealObject(this.GraphicObj) && typeof  this.GraphicObj.documentCreateFontMap === "function")
		this.GraphicObj.documentCreateFontMap(fontMap);
};
ParaDrawing.prototype.tableCheckSplit = function()
{
	if (isRealObject(this.GraphicObj) && typeof  this.GraphicObj.tableCheckSplit === "function")
		return this.GraphicObj.tableCheckSplit();
	return false;
};
ParaDrawing.prototype.tableCheckMerge = function()
{
	if (isRealObject(this.GraphicObj) && typeof  this.GraphicObj.tableCheckMerge === "function")
		return this.GraphicObj.tableCheckMerge();
	return false;
};
ParaDrawing.prototype.tableSelect = function( Type )
{
	if (isRealObject(this.GraphicObj) && typeof  this.GraphicObj.tableSelect === "function")
		return this.GraphicObj.tableSelect(Type);
};
ParaDrawing.prototype.tableRemoveTable = function()
{
	if (isRealObject(this.GraphicObj) && typeof  this.GraphicObj.tableRemoveTable === "function")
		return this.GraphicObj.tableRemoveTable();
};
ParaDrawing.prototype.tableSplitCell = function(Cols, Rows)
{
	if (isRealObject(this.GraphicObj) && typeof  this.GraphicObj.tableSplitCell === "function")
		return this.GraphicObj.tableSplitCell(Cols, Rows);
};
ParaDrawing.prototype.tableMergeCells = function(Cols, Rows)
{
	if (isRealObject(this.GraphicObj) && typeof  this.GraphicObj.tableMergeCells === "function")
		return this.GraphicObj.tableMergeCells(Cols, Rows);
};
ParaDrawing.prototype.tableRemoveCol = function()
{
	if (isRealObject(this.GraphicObj) && typeof  this.GraphicObj.tableRemoveCol === "function")
		return this.GraphicObj.tableRemoveCol();
};
ParaDrawing.prototype.tableAddCol = function(bBefore)
{
	if (isRealObject(this.GraphicObj) && typeof  this.GraphicObj.tableAddCol === "function")
		return this.GraphicObj.tableAddCol(bBefore);
};
ParaDrawing.prototype.tableRemoveRow = function()
{
	if (isRealObject(this.GraphicObj) && typeof  this.GraphicObj.tableRemoveRow === "function")
		return this.GraphicObj.tableRemoveRow();
};
ParaDrawing.prototype.tableAddRow = function(bBefore)
{
	if (isRealObject(this.GraphicObj) && typeof  this.GraphicObj.tableAddRow === "function")
		return this.GraphicObj.tableAddRow(bBefore);
};
ParaDrawing.prototype.getCurrentParagraph = function()
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.getCurrentParagraph === "function")
		return this.GraphicObj.getCurrentParagraph();

	if (this.Parent instanceof Paragraph)
		return this.Parent;
};
ParaDrawing.prototype.getSelectedText = function(bClearText, oPr)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.getSelectedText === "function")
		return this.GraphicObj.getSelectedText(bClearText, oPr);
	return "";
};
ParaDrawing.prototype.getCurPosXY = function()
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.getCurPosXY === "function")
		return this.GraphicObj.getCurPosXY();
	return {X : 0, Y : 0};
};
ParaDrawing.prototype.setParagraphKeepLines = function(Value)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphKeepLines === "function")
		return this.GraphicObj.setParagraphKeepLines(Value);
};
ParaDrawing.prototype.setParagraphKeepNext = function(Value)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphKeepNext === "function")
		return this.GraphicObj.setParagraphKeepNext(Value);
};
ParaDrawing.prototype.setParagraphWidowControl = function(Value)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphWidowControl === "function")
		return this.GraphicObj.setParagraphWidowControl(Value);
};
ParaDrawing.prototype.setParagraphPageBreakBefore = function(Value)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphPageBreakBefore === "function")
		return this.GraphicObj.setParagraphPageBreakBefore(Value);
};
ParaDrawing.prototype.isTextSelectionUse = function()
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.isTextSelectionUse === "function")
		return this.GraphicObj.isTextSelectionUse();
	return false;
};
ParaDrawing.prototype.paragraphFormatPaste = function( CopyTextPr, CopyParaPr, Bool )
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.isTextSelectionUse === "function")
		return this.GraphicObj.paragraphFormatPaste(CopyTextPr, CopyParaPr, Bool);
};
ParaDrawing.prototype.getNearestPos = function(x, y, pageIndex)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.getNearestPos === "function")
		return this.GraphicObj.getNearestPos(x, y, pageIndex);
	return null;
};
//----------------------------------------------------------------------------------------------------------------------
// Функции для записи/чтения в поток
//----------------------------------------------------------------------------------------------------------------------
ParaDrawing.prototype.Write_ToBinary = function(Writer)
{
	// Long   : Type
	// String : Id

	Writer.WriteLong(this.Type);
	Writer.WriteString2(this.Id);
};
ParaDrawing.prototype.Write_ToBinary2 = function(Writer)
{
	Writer.WriteLong(AscDFH.historyitem_type_Drawing);
	Writer.WriteString2(this.Id);
	AscFormat.writeDouble(Writer, this.Extent.W);
	AscFormat.writeDouble(Writer, this.Extent.H);
	AscFormat.writeObject(Writer, this.GraphicObj);
	AscFormat.writeObject(Writer, this.DocumentContent);
	AscFormat.writeObject(Writer, this.Parent);
	AscFormat.writeObject(Writer, this.wrappingPolygon);
	AscFormat.writeLong(Writer, this.RelativeHeight);
	AscFormat.writeObject(Writer, this.docPr);
};
ParaDrawing.prototype.Read_FromBinary2 = function(Reader)
{
	this.Id              = Reader.GetString2();
	this.DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
	this.LogicDocument   = this.DrawingDocument ? this.DrawingDocument.m_oLogicDocument : null;

	this.Extent.W        = AscFormat.readDouble(Reader);
	this.Extent.H        = AscFormat.readDouble(Reader);
	this.GraphicObj      = AscFormat.readObject(Reader);
	this.DocumentContent = AscFormat.readObject(Reader);
	this.Parent          = AscFormat.readObject(Reader);
	this.wrappingPolygon = AscFormat.readObject(Reader);
	this.RelativeHeight  = AscFormat.readLong(Reader);
	this.docPr = AscFormat.readObject(Reader);
	if (this.wrappingPolygon)
	{
		this.wrappingPolygon.wordGraphicObject = this;
	}

	this.drawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
	this.document        = editor.WordControl.m_oLogicDocument;
	this.graphicObjects  = editor.WordControl.m_oLogicDocument.DrawingObjects;
	this.graphicObjects.addGraphicObject(this);
	g_oTableId.Add(this, this.Id);
};
ParaDrawing.prototype.Load_LinkData = function()
{
};
ParaDrawing.prototype.draw = function(graphics, pageIndex)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.draw === "function")
	{
		graphics.SaveGrState();
		this.GraphicObj.draw(graphics);
		graphics.RestoreGrState();
	}
};
ParaDrawing.prototype.drawAdjustments = function()
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.drawAdjustments === "function")
	{
		this.GraphicObj.drawAdjustments();
	}
};
ParaDrawing.prototype.getTransformMatrix = function()
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.getTransformMatrix === "function")
	{
		return this.GraphicObj.getTransformMatrix();
	}
	return null;
};
ParaDrawing.prototype.getExtensions = function()
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.getExtensions === "function")
	{
		return this.GraphicObj.getExtensions();
	}
	return null;
};
ParaDrawing.prototype.isGroup = function()
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.isGroup === "function")
		return this.GraphicObj.isGroup();
	return false;
};
ParaDrawing.prototype.isShapeChild = function(bRetShape)
{
	if (!this.Is_Inline() || !this.DocumentContent)
		return bRetShape ? null : false;

	var cur_doc_content = this.DocumentContent;
	while (cur_doc_content.Is_TableCellContent())
	{
		cur_doc_content = cur_doc_content.Parent.Row.Table.Parent;
	}

	if (isRealObject(cur_doc_content.Parent) && typeof cur_doc_content.Parent.getObjectType === "function" && cur_doc_content.Parent.getObjectType() === AscDFH.historyitem_type_Shape)
		return bRetShape ? cur_doc_content.Parent : true;

	return bRetShape ? null : false;
};
ParaDrawing.prototype.checkShapeChildAndGetTopParagraph = function(paragraph)
{
	var parent_paragraph   = !paragraph ? this.Get_ParentParagraph() : paragraph;
	var parent_doc_content = parent_paragraph.Parent;
	if (parent_doc_content.Parent instanceof AscFormat.CShape)
	{
		if (!parent_doc_content.Parent.group)
		{
			return parent_doc_content.Parent.parent.Get_ParentParagraph();
		}
		else
		{
			var top_group = parent_doc_content.Parent.group;
			while (top_group.group)
				top_group = top_group.group;
			return top_group.parent.Get_ParentParagraph();
		}
	}
	else if (parent_doc_content.Is_TableCellContent())
	{
		var top_doc_content = parent_doc_content;
		while (top_doc_content.Is_TableCellContent())
		{
			top_doc_content = top_doc_content.Parent.Row.Table.Parent;
		}
		if (top_doc_content.Parent instanceof AscFormat.CShape)
		{
			if (!top_doc_content.Parent.group)
			{
				return top_doc_content.Parent.parent.Get_ParentParagraph();
			}
			else
			{
				var top_group = top_doc_content.Parent.group;
				while (top_group.group)
					top_group = top_group.group;
				return top_group.parent.Get_ParentParagraph();
			}
		}
		else
		{
			return parent_paragraph;
		}

	}
	return parent_paragraph;
};
ParaDrawing.prototype.hit = function(x, y)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.hit === "function")
	{
		return this.GraphicObj.hit(x, y);
	}
	return false;
};
ParaDrawing.prototype.hitToTextRect = function(x, y)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.hitToTextRect === "function")
	{
		return this.GraphicObj.hitToTextRect(x, y);
	}
	return false;
};
ParaDrawing.prototype.cursorGetPos = function()
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.cursorGetPos === "function")
	{
		return this.GraphicObj.cursorGetPos();
	}
	return {X : 0, Y : 0};
};
ParaDrawing.prototype.getResizeCoefficients = function(handleNum, x, y)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.getResizeCoefficients === "function")
	{
		return this.GraphicObj.getResizeCoefficients(handleNum, x, y);
	}
	return {kd1 : 1, kd2 : 1};
};
ParaDrawing.prototype.getParagraphParaPr = function()
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.getParagraphParaPr === "function")
	{
		return this.GraphicObj.getParagraphParaPr();
	}
	return null;
};
ParaDrawing.prototype.getParagraphTextPr = function()
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.getParagraphTextPr === "function")
	{
		return this.GraphicObj.getParagraphTextPr();
	}
	return null;
};
ParaDrawing.prototype.getAngle = function(x, y)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.getAngle === "function")
		return this.GraphicObj.getAngle(x, y);
	return 0;
};
ParaDrawing.prototype.calculateSnapArrays = function()
{
	this.GraphicObj.snapArrayX.length = 0;
	this.GraphicObj.snapArrayY.length = 0;
	if (this.GraphicObj)
		this.GraphicObj.recalculateSnapArrays();

};
ParaDrawing.prototype.recalculateCurPos = function()
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.recalculateCurPos === "function")
	{
		this.GraphicObj.recalculateCurPos();
	}
};
ParaDrawing.prototype.setPageIndex = function(newPageIndex)
{
	this.pageIndex = newPageIndex;
	this.PageNum   = newPageIndex;
};
ParaDrawing.prototype.Get_PageNum = function()
{
	return this.PageNum;
};
ParaDrawing.prototype.GetAllParagraphs = function(Props, ParaArray)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.GetAllParagraphs === "function")
		this.GraphicObj.GetAllParagraphs(Props, ParaArray);
};
ParaDrawing.prototype.getTableProps = function()
{
	if (isRealObject(this.GraphicObj) && typeof  this.GraphicObj.getTableProps === "function")
		return this.GraphicObj.getTableProps();
	return null;
};
ParaDrawing.prototype.canGroup = function()
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.canGroup === "function")
		return this.GraphicObj.canGroup();
	return false;
};
ParaDrawing.prototype.canUnGroup = function()
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.canGroup === "function")
		return this.GraphicObj.canUnGroup();
	return false;
};
ParaDrawing.prototype.select = function(pageIndex)
{
	this.selected = true;
	if (isRealObject(this.GraphicObj) && typeof  this.GraphicObj.select === "function")
		this.GraphicObj.select(pageIndex);

};
ParaDrawing.prototype.paragraphClearFormatting = function()
{
	if (isRealObject(this.GraphicObj) && typeof  this.GraphicObj.paragraphAdd === "function")
		this.GraphicObj.paragraphClearFormatting();
};
ParaDrawing.prototype.paragraphAdd = function(paraItem, bRecalculate)
{
	if (isRealObject(this.GraphicObj) && typeof  this.GraphicObj.paragraphAdd === "function")
		this.GraphicObj.paragraphAdd(paraItem, bRecalculate);
};
ParaDrawing.prototype.setParagraphShd = function(Shd)
{
	if (isRealObject(this.GraphicObj) && typeof  this.GraphicObj.setParagraphShd === "function")
		this.GraphicObj.setParagraphShd(Shd);
};
ParaDrawing.prototype.getArrayWrapPolygons = function()
{
	if ((isRealObject(this.GraphicObj) && typeof this.GraphicObj.getArrayWrapPolygons === "function"))
		return this.GraphicObj.getArrayWrapPolygons();

	return [];
};
ParaDrawing.prototype.getArrayWrapIntervals = function(x0, y0, x1, y1, Y0Sp, Y1Sp, LeftField, RightField, arr_intervals, bMathWrap)
{
	if (this.wrappingType === WRAPPING_TYPE_THROUGH || this.wrappingType === WRAPPING_TYPE_TIGHT)
	{
		y0 = Y0Sp;
		y1 = Y1Sp;
	}

	this.wrappingPolygon.wordGraphicObject = this;
	return this.wrappingPolygon.getArrayWrapIntervals(x0, y0, x1, y1, LeftField, RightField, arr_intervals, bMathWrap);
};
ParaDrawing.prototype.setAllParagraphNumbering = function(numInfo)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.addInlineTable === "function")
		this.GraphicObj.setAllParagraphNumbering(numInfo);
};
ParaDrawing.prototype.addNewParagraph = function(bRecalculate)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.addNewParagraph === "function")
		this.GraphicObj.addNewParagraph(bRecalculate);
};
ParaDrawing.prototype.addInlineTable = function(cols, rows)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.addInlineTable === "function")
		this.GraphicObj.addInlineTable(cols, rows);
};
ParaDrawing.prototype.applyTextPr = function(paraItem, bRecalculate)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.applyTextPr === "function")
		this.GraphicObj.applyTextPr(paraItem, bRecalculate);
};
ParaDrawing.prototype.allIncreaseDecFontSize = function(bIncrease)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.allIncreaseDecFontSize === "function")
		this.GraphicObj.allIncreaseDecFontSize(bIncrease);
};
ParaDrawing.prototype.setParagraphNumbering = function(NumInfo)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.allIncreaseDecFontSize === "function")
		this.GraphicObj.setParagraphNumbering(NumInfo);
};
ParaDrawing.prototype.allIncreaseDecIndent = function(bIncrease)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.allIncreaseDecIndent === "function")
		this.GraphicObj.allIncreaseDecIndent(bIncrease);
};
ParaDrawing.prototype.allSetParagraphAlign = function(align)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.allSetParagraphAlign === "function")
		this.GraphicObj.allSetParagraphAlign(align);
};
ParaDrawing.prototype.paragraphIncreaseDecFontSize = function(bIncrease)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.paragraphIncreaseDecFontSize === "function")
		this.GraphicObj.paragraphIncreaseDecFontSize(bIncrease);
};
ParaDrawing.prototype.paragraphIncreaseDecIndent = function(bIncrease)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.paragraphIncreaseDecIndent === "function")
		this.GraphicObj.paragraphIncreaseDecIndent(bIncrease);
};
ParaDrawing.prototype.setParagraphAlign = function(align)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphAlign === "function")
		this.GraphicObj.setParagraphAlign(align);
};
ParaDrawing.prototype.setParagraphSpacing = function(Spacing)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphSpacing === "function")
		this.GraphicObj.setParagraphSpacing(Spacing);
};
ParaDrawing.prototype.updatePosition = function(x, y)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.updatePosition === "function")
	{
		this.GraphicObj.updatePosition(x, y);
	}
};
ParaDrawing.prototype.updatePosition2 = function(x, y)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.updatePosition === "function")
	{
		this.GraphicObj.updatePosition2(x, y);
	}
};
ParaDrawing.prototype.addInlineImage = function(W, H, Img, chart, bFlow)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.addInlineImage === "function")
		this.GraphicObj.addInlineImage(W, H, Img, chart, bFlow);
};
ParaDrawing.prototype.canAddComment = function()
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.canAddComment === "function")
		return this.GraphicObj.canAddComment();
	return false;
};
ParaDrawing.prototype.addComment = function(commentData)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.addComment === "function")
		return this.GraphicObj.addComment(commentData);
};
ParaDrawing.prototype.selectionSetStart = function(x, y, event, pageIndex)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.selectionSetStart === "function")
		this.GraphicObj.selectionSetStart(x, y, event, pageIndex);
};
ParaDrawing.prototype.selectionSetEnd = function(x, y, event, pageIndex)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.selectionSetEnd === "function")
		this.GraphicObj.selectionSetEnd(x, y, event, pageIndex);
};
ParaDrawing.prototype.selectionRemove = function()
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.selectionRemove === "function")
		this.GraphicObj.selectionRemove();
};
ParaDrawing.prototype.updateSelectionState = function()
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.updateSelectionState === "function")
		this.GraphicObj.updateSelectionState();
};
ParaDrawing.prototype.cursorMoveLeft = function(AddToSelect, Word)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.cursorMoveLeft === "function")
		this.GraphicObj.cursorMoveLeft(AddToSelect, Word);
};
ParaDrawing.prototype.cursorMoveRight = function(AddToSelect, Word)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.cursorMoveRight === "function")
		this.GraphicObj.cursorMoveRight(AddToSelect, Word);
};
ParaDrawing.prototype.cursorMoveUp = function(AddToSelect)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.cursorMoveUp === "function")
		this.GraphicObj.cursorMoveUp(AddToSelect);
};
ParaDrawing.prototype.cursorMoveDown = function(AddToSelect)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.cursorMoveDown === "function")
		this.GraphicObj.cursorMoveDown(AddToSelect);
};
ParaDrawing.prototype.cursorMoveEndOfLine = function(AddToSelect)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.cursorMoveEndOfLine === "function")
		this.GraphicObj.cursorMoveEndOfLine(AddToSelect);
};
ParaDrawing.prototype.cursorMoveStartOfLine = function(AddToSelect)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.cursorMoveStartOfLine === "function")
		this.GraphicObj.cursorMoveStartOfLine(AddToSelect);
};
ParaDrawing.prototype.remove = function(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.remove === "function")
		this.GraphicObj.remove(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd);
};
ParaDrawing.prototype.hitToWrapPolygonPoint = function(x, y)
{
	if (this.wrappingPolygon && this.wrappingPolygon.arrPoints.length > 0)
	{
		var radius      = this.drawingDocument.GetMMPerDot(AscCommon.TRACK_CIRCLE_RADIUS);
		var arr_point   = this.wrappingPolygon.calculatedPoints;
		var point_count = arr_point.length;
		var dx, dy;

		var previous_point;
		for (var i = 0; i < arr_point.length; ++i)
		{
			var cur_point = arr_point[i];
			dx            = x - cur_point.x;
			dy            = y - cur_point.y;
			if (Math.sqrt(dx * dx + dy * dy) < radius)
				return {hit : true, hitType : WRAP_HIT_TYPE_POINT, pointNum : i};
		}

		cur_point      = arr_point[0];
		previous_point = arr_point[arr_point.length - 1];
		var vx, vy;
		vx             = cur_point.x - previous_point.x;
		vy             = cur_point.y - previous_point.y;
		if (Math.abs(vx) > 0 || Math.abs(vy) > 0)
		{
			if (HitInLine(this.drawingDocument.CanvasHitContext, x, y, previous_point.x, previous_point.y, cur_point.x, cur_point.y))
				return {hit : true, hitType : WRAP_HIT_TYPE_SECTION, pointNum1 : arr_point.length - 1, pointNum2 : 0};
		}

		for (var point_index = 1; point_index < point_count; ++point_index)
		{
			cur_point      = arr_point[point_index];
			previous_point = arr_point[point_index - 1];

			vx = cur_point.x - previous_point.x;
			vy = cur_point.y - previous_point.y;

			if (Math.abs(vx) > 0 || Math.abs(vy) > 0)
			{
				if (HitInLine(this.drawingDocument.CanvasHitContext, x, y, previous_point.x, previous_point.y, cur_point.x, cur_point.y))
					return {hit   : true,
						hitType   : WRAP_HIT_TYPE_SECTION,
						pointNum1 : point_index - 1,
						pointNum2 : point_index
					};
			}
		}
	}
	return {hit : false};
};
ParaDrawing.prototype.documentGetAllFontNames = function(AllFonts)
{
	if (isRealObject(this.GraphicObj) && typeof  this.GraphicObj.documentGetAllFontNames === "function")
		this.GraphicObj.documentGetAllFontNames(AllFonts);
};
ParaDrawing.prototype.isCurrentElementParagraph = function()
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.isCurrentElementParagraph === "function")
		return this.GraphicObj.isCurrentElementParagraph();
	return false;
};
ParaDrawing.prototype.isCurrentElementTable = function()
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.isCurrentElementTable === "function")
		return this.GraphicObj.isCurrentElementTable();
	return false;
};
ParaDrawing.prototype.canChangeWrapPolygon = function()
{
	if (this.Is_Inline())
		return false;
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.canChangeWrapPolygon === "function")
		return this.GraphicObj.canChangeWrapPolygon();
	return false;
};
ParaDrawing.prototype.init = function()
{
};
ParaDrawing.prototype.calculateAfterOpen = function()
{
};
ParaDrawing.prototype.getBounds = function()
{

	return this.GraphicObj.bounds;
};
ParaDrawing.prototype.getWrapContour = function()
{
	if (isRealObject(this.wrappingPolygon))
	{
		var kw         = 1 / 36000;
		var kh         = 1 / 36000;
		var rel_points = this.wrappingPolygon.relativeArrPoints;
		var ret        = [];
		for (var i = 0; i < rel_points.length; ++i)
		{
			ret[i] = {x : rel_points[i].x * kw, y : rel_points[i].y * kh};
		}
		return ret;
	}
	return [];
};
ParaDrawing.prototype.getDrawingArrayType = function()
{
	if (this.Is_Inline())
		return DRAWING_ARRAY_TYPE_INLINE;
	if (this.behindDoc === true && this.wrappingType === WRAPPING_TYPE_NONE)
		return DRAWING_ARRAY_TYPE_BEHIND;
	if (this.wrappingType === WRAPPING_TYPE_NONE)
		return DRAWING_ARRAY_TYPE_BEFORE;
	return DRAWING_ARRAY_TYPE_WRAPPING;
};
ParaDrawing.prototype.documentSearch = function(String, search_Common)
{
	if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.documentSearch === "function")
		this.GraphicObj.documentSearch(String, search_Common)
};
ParaDrawing.prototype.setParagraphContextualSpacing = function(Value)
{
	if (isRealObject(this.GraphicObj) && typeof  this.GraphicObj.setParagraphContextualSpacing === "function")
		this.GraphicObj.setParagraphContextualSpacing(Value);
};
ParaDrawing.prototype.setParagraphStyle = function(style)
{
	if (isRealObject(this.GraphicObj) && typeof  this.GraphicObj.setParagraphStyle === "function")
		this.GraphicObj.setParagraphStyle(style);
};
ParaDrawing.prototype.copy = function()
{
	var c = new ParaDrawing(this.Extent.W, this.Extent.H, null, editor.WordControl.m_oLogicDocument.DrawingDocument, null, null);
	c.Set_DrawingType(this.DrawingType);
	if (isRealObject(this.GraphicObj))
	{
		var g = this.GraphicObj.copy(c);
		c.Set_GraphicObject(g);
		g.setParent(c);
	}
	var d = this.Distance;
	c.Set_PositionH(this.PositionH.RelativeFrom, this.PositionH.Align, this.PositionH.Value, this.PositionH.Percent);
	c.Set_PositionV(this.PositionV.RelativeFrom, this.PositionV.Align, this.PositionV.Value, this.PositionV.Percent);
	c.Set_Distance(d.L, d.T, d.R, d.B);
	c.Set_AllowOverlap(this.AllowOverlap);
	c.Set_WrappingType(this.wrappingType);
	c.Set_BehindDoc(this.behindDoc);
	var EE = this.EffectExtent;
	c.setEffectExtent(EE.L, EE.T, EE.R, EE.B);
	return c;
};
ParaDrawing.prototype.OnContentReDraw = function()
{
	if (this.Parent && this.Parent.Parent)
		this.Parent.Parent.OnContentReDraw(this.PageNum, this.PageNum);
};
ParaDrawing.prototype.getBase64Img = function()
{
	if (isRealObject(this.GraphicObj) && typeof  this.GraphicObj.getBase64Img === "function")
		return this.GraphicObj.getBase64Img();
	return null;
};
ParaDrawing.prototype.isPointInObject = function(x, y, pageIndex)
{
	if (this.pageIndex === pageIndex)
	{
		if (isRealObject(this.GraphicObj))
		{
			var hit         = (typeof  this.GraphicObj.hit === "function") ? this.GraphicObj.hit(x, y) : false;
			var hit_to_text = (typeof  this.GraphicObj.hitToTextRect === "function") ? this.GraphicObj.hitToTextRect(x, y) : false;
			return hit || hit_to_text;
		}
	}
	return false;
};
ParaDrawing.prototype.Restart_CheckSpelling = function()
{
	this.GraphicObj && this.GraphicObj.Restart_CheckSpelling && this.GraphicObj.Restart_CheckSpelling();
};
ParaDrawing.prototype.Is_MathEquation = function()
{
	if (undefined !== this.ParaMath && null !== this.ParaMath)
		return true;

	return false;
};
ParaDrawing.prototype.Get_ParaMath = function()
{
	return this.ParaMath;
};
ParaDrawing.prototype.Convert_ToMathObject = function(isOpen)
{
	if (isOpen)
	{
		this.private_ConvertToMathObject(isOpen);
	}
	else
	{
		// TODO: Вообще здесь нужно запрашивать шрифты, которые использовались в старой формуле,
		//      но пока это только 1 шрифт "Cambria Math".
		var loader   = AscCommon.g_font_loader;
		var fontinfo = g_fontApplication.GetFontInfo("Cambria Math");
		var isasync  = loader.LoadFont(fontinfo, ConvertEquationToMathCallback, this);
		if (false === isasync)
		{
			this.private_ConvertToMathObject();
		}
	}
};
ParaDrawing.prototype.private_ConvertToMathObject = function(isOpen)
{
	var Para = this.Get_Paragraph();
	if (undefined === Para || null === Para || !(Para instanceof Paragraph))
		return;

	var ParaContentPos = Para.Get_PosByDrawing(this.Get_Id());
	if (null === ParaContentPos)
		return;

	var Depth = ParaContentPos.Get_Depth();
	var TopElementPos = ParaContentPos.Get(0);
	var BotElementPos = ParaContentPos.Get(Depth);

	var TopElement = Para.Content[TopElementPos];

	// Уменьшаем глубину на 1, чтобы получить позицию родительского класса
	var RunPos = ParaContentPos.Copy();
	RunPos.Decrease_Depth(1);
	var Run = Para.Get_ElementByPos(RunPos);

	if (undefined === TopElement || undefined === TopElement.Content || !(Run instanceof ParaRun))
		return;

	var LogicDocument = editor.WordControl.m_oLogicDocument;
	if (isOpen || false === LogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_None, {
			Type      : AscCommon.changestype_2_Element_and_Type,
			Element   : Para,
			CheckType : AscCommon.changestype_Paragraph_Content
		}))
	{
		if (!isOpen)
		{
			LogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_ConvertOldEquation);
		}

		// Коректируем формулу после конвертации
		this.ParaMath.Correct_AfterConvertFromEquation();

		// Сначала удаляем Drawing из рана
		Run.Remove_FromContent(BotElementPos, 1);

		// TODO: Тут возможно лучше взять настройки предыдущего элемента, но пока просто удалим самое неприятное
		// свойство.
		if (true === Run.Is_Empty())
			Run.Set_Position(undefined);

		// Теперь разделяем параграф по заданной позиции и добавляем туда новую формулу.
		var RightElement = TopElement.Split(ParaContentPos, 1);
		Para.Add_ToContent(TopElementPos + 1, RightElement);
		Para.Add_ToContent(TopElementPos + 1, this.ParaMath);
		Para.Correct_Content(TopElementPos, TopElementPos + 2);

		if (!isOpen)
		{
			// Устанавливаем курсор в начало правого элемента, полученного после Split
			LogicDocument.Selection_Remove();
			RightElement.Cursor_MoveToStartPos();
			Para.CurPos.ContentPos = TopElementPos + 2;
			Para.Document_SetThisElementCurrent(false);

			LogicDocument.Recalculate();
			LogicDocument.Document_UpdateSelectionState();
			LogicDocument.Document_UpdateInterfaceState();
		}
	}
};
ParaDrawing.prototype.Get_RevisionsChangeParagraph = function(SearchEngine)
{
	if (this.GraphicObj && this.GraphicObj.Get_RevisionsChangeParagraph)
		this.GraphicObj.Get_RevisionsChangeParagraph(SearchEngine);
};
ParaDrawing.prototype.Get_ObjectType = function()
{
	if (this.GraphicObj)
		return this.GraphicObj.getObjectType();

	return AscDFH.historyitem_type_Drawing;
};

/**
 * Класс, описывающий текущее положение параграфа при рассчете позиции автофигуры.
 * @constructor
 */
function CParagraphLayout(X, Y, PageNum, LastItemW, ColumnStartX, ColumnEndX, Left_Margin, Right_Margin, Page_W, Top_Margin, Bottom_Margin, Page_H, MarginH, MarginV, LineTop, ParagraphTop)
{
	this.X             = X;
	this.Y             = Y;
	this.PageNum       = PageNum;
	this.LastItemW     = LastItemW;
	this.ColumnStartX  = ColumnStartX;
	this.ColumnEndX    = ColumnEndX;
	this.Left_Margin   = Left_Margin;
	this.Right_Margin  = Right_Margin;
	this.Page_W        = Page_W;
	this.Top_Margin    = Top_Margin;
	this.Bottom_Margin = Bottom_Margin;
	this.Page_H        = Page_H;
	this.Margin_H      = MarginH;
	this.Margin_V      = MarginV;
	this.LineTop       = LineTop;
	this.ParagraphTop  = ParagraphTop;
}
/**
 * Класс, описывающий позицию автофигуры на странице.
 * @constructor
 */
function CAnchorPosition()
{
	// Рассчитанные координаты
	this.CalcX         = 0;
	this.CalcY         = 0;

	// Данные для Inline-объектов
	this.YOffset       = 0;

	// Данные для Flow-объектов
	this.W             = 0;
	this.H             = 0;
	this.BoundsL       = 0;
	this.BoundsT       = 0;
	this.BoundsW       = 0;
	this.BoundsH       = 0;
	this.X             = 0;
	this.Y             = 0;
	this.PageNum       = 0;
	this.LastItemW     = 0;
	this.ColumnStartX  = 0;
	this.ColumnEndX    = 0;
	this.Left_Margin   = 0;
	this.Right_Margin  = 0;
	this.Page_W        = 0;
	this.Top_Margin    = 0;
	this.Bottom_Margin = 0;
	this.Page_H        = 0;
	this.Margin_H      = 0;
	this.Margin_V      = 0;
	this.LineTop       = 0;
	this.ParagraphTop  = 0;
	this.Page_X        = 0;
	this.Page_Y        = 0;
}
CAnchorPosition.prototype.Set = function(W, H, YOffset, ParaLayout, PageLimits, BoundsL, BoundsT, BoundsW, BoundsH)
{
	this.W = W;
	this.H = H;
	this.BoundsL = BoundsL;
	this.BoundsT = BoundsT;
	this.BoundsW = BoundsW;
	this.BoundsH = BoundsH;

	this.YOffset = YOffset;

	this.X             = ParaLayout.X;
	this.Y             = ParaLayout.Y;
	this.PageNum       = ParaLayout.PageNum;
	this.LastItemW     = ParaLayout.LastItemW;
	this.ColumnStartX  = ParaLayout.ColumnStartX;
	this.ColumnEndX    = ParaLayout.ColumnEndX;
	this.Left_Margin   = ParaLayout.Left_Margin;
	this.Right_Margin  = ParaLayout.Right_Margin;
	this.Page_W        = PageLimits.XLimit - PageLimits.X;// ParaLayout.Page_W;
	this.Top_Margin    = ParaLayout.Top_Margin;
	this.Bottom_Margin = ParaLayout.Bottom_Margin;
	this.Page_H        = PageLimits.YLimit - PageLimits.Y;// ParaLayout.Page_H;
	this.Margin_H      = ParaLayout.Margin_H;
	this.Margin_V      = ParaLayout.Margin_V;
	this.LineTop       = ParaLayout.LineTop;
	this.ParagraphTop  = ParaLayout.ParagraphTop;
	this.Page_X        = PageLimits.X;
	this.Page_Y        = PageLimits.Y;
};
CAnchorPosition.prototype.Calculate_X = function(bInline, RelativeFrom, bAlign, Value, bPercent)
{
	if (true === bInline)
	{
		this.CalcX = this.X;
	}
	else
	{
		// Вычисляем координату по X
		switch (RelativeFrom)
		{
			case c_oAscRelativeFromH.Character:
			{
				// Почему то Word при позиционировании относительно символа использует не
				// текущуюю позицию, а позицию предыдущего элемента (именно для этого мы
				// храним параметр LastItemW).

				var _X = this.X - this.LastItemW;

				if (true === bAlign)
				{
					switch (Value)
					{
						case c_oAscAlignH.Center:
						{
							this.CalcX = _X - this.W / 2;
							break;
						}

						case c_oAscAlignH.Inside:
						case c_oAscAlignH.Outside:
						case c_oAscAlignH.Left:
						{
							this.CalcX = _X;
							break;
						}

						case c_oAscAlignH.Right:
						{
							this.CalcX = _X - this.W;
							break;
						}
					}
				}
				else
					this.CalcX = _X + Value;

				break;
			}

			case c_oAscRelativeFromH.Column:
			{
				if (true === bAlign)
				{
					switch (Value)
					{
						case c_oAscAlignH.Center:
						{
							this.CalcX = (this.ColumnEndX + this.ColumnStartX - this.W) / 2;
							break;
						}

						case c_oAscAlignH.Inside:
						case c_oAscAlignH.Outside:
						case c_oAscAlignH.Left:
						{
							this.CalcX = this.ColumnStartX;
							break;
						}

						case c_oAscAlignH.Right:
						{
							this.CalcX = this.ColumnEndX - this.W;
							break;
						}
					}
				}
				else
					this.CalcX = this.ColumnStartX + Value;

				break;
			}

			case c_oAscRelativeFromH.InsideMargin:
			case c_oAscRelativeFromH.LeftMargin:
			case c_oAscRelativeFromH.OutsideMargin:
			{
				if (true === bAlign)
				{
					switch (Value)
					{
						case c_oAscAlignH.Center:
						{
							this.CalcX = (this.Left_Margin - this.W) / 2;
							break;
						}

						case c_oAscAlignH.Inside:
						case c_oAscAlignH.Outside:
						case c_oAscAlignH.Left:
						{
							this.CalcX = 0;
							break;
						}

						case c_oAscAlignH.Right:
						{
							this.CalcX = this.Left_Margin - this.W;
							break;
						}
					}
				}
				else if (true === bPercent)
				{
					this.CalcX = this.Page_X + this.Left_Margin * Value / 100;
				}
				else
				{
					this.CalcX = Value;
				}

				break;
			}

			case c_oAscRelativeFromH.Margin:
			{
				var X_s = this.Page_X + this.Left_Margin;
				var X_e = this.Page_X + this.Page_W - this.Right_Margin;

				if (true === bAlign)
				{
					switch (Value)
					{
						case c_oAscAlignH.Center:
						{
							this.CalcX = (X_e + X_s - this.W) / 2;
							break;
						}

						case c_oAscAlignH.Inside:
						case c_oAscAlignH.Outside:
						case c_oAscAlignH.Left:
						{
							this.CalcX = X_s;
							break;
						}

						case c_oAscAlignH.Right:
						{
							this.CalcX = X_e - this.W;
							break;
						}
					}
				}
				else if (true === bPercent)
				{
					this.CalcX = X_s + (X_e - X_s) * Value / 100;
				}
				else
				{
					this.CalcX = this.Margin_H + Value;
				}

				break;
			}

			case c_oAscRelativeFromH.Page:
			{
				if (true === bAlign)
				{
					switch (Value)
					{
						case c_oAscAlignH.Center:
						{
							this.CalcX = (this.Page_W - this.W) / 2;
							break;
						}

						case c_oAscAlignH.Inside:
						case c_oAscAlignH.Outside:
						case c_oAscAlignH.Left:
						{
							this.CalcX = 0;
							break;
						}

						case c_oAscAlignH.Right:
						{
							this.CalcX = this.Page_W - this.W;
							break;
						}
					}
				}
				else if (true === bPercent)
				{
					this.CalcX = this.Page_X + this.Page_W * Value / 100;
				}
				else
				{
					this.CalcX = Value + this.Page_X;
				}

				break;
			}

			case c_oAscRelativeFromH.RightMargin:
			{
				var X_s = this.Page_X + this.Page_W - this.Right_Margin;
				var X_e = this.Page_X + this.Page_W;

				if (true === bAlign)
				{
					switch (Value)
					{
						case c_oAscAlignH.Center:
						{
							this.CalcX = (X_e + X_s - this.W) / 2;
							break;
						}

						case c_oAscAlignH.Inside:
						case c_oAscAlignH.Outside:
						case c_oAscAlignH.Left:
						{
							this.CalcX = X_s;
							break;
						}

						case c_oAscAlignH.Right:
						{
							this.CalcX = X_e - this.W;
							break;
						}
					}
				}
				else if (true === bPercent)
				{
					this.CalcX = X_s + (X_e - X_s) * Value / 100;
				}
				else
				{
					this.CalcX = X_s + Value;
				}

				break;
			}
		}
	}

	return this.CalcX;
};
CAnchorPosition.prototype.Calculate_Y = function(bInline, RelativeFrom, bAlign, Value, bPercent)
{
	if (true === bInline)
	{
		this.CalcY = this.Y - this.H - this.YOffset;
	}
	else
	{
		// Вычисляем координату по Y
		switch (RelativeFrom)
		{
			case c_oAscRelativeFromV.BottomMargin:
			case c_oAscRelativeFromV.InsideMargin:
			case c_oAscRelativeFromV.OutsideMargin:
			{
				var _Y = this.Page_H - this.Bottom_Margin;

				if (true === bAlign)
				{
					switch (Value)
					{
						case c_oAscAlignV.Bottom:
						case c_oAscAlignV.Outside:
						{
							this.CalcY = this.Page_H - this.H;
							break;
						}
						case c_oAscAlignV.Center:
						{
							this.CalcY = (_Y + this.Page_H - this.H) / 2;
							break;
						}

						case c_oAscAlignV.Inside:
						case c_oAscAlignV.Top:
						{
							this.CalcY = _Y;
							break;
						}
					}
				}
				else if (true === bPercent)
				{
					if (Math.abs(this.Page_Y) > 0.001)
						this.CalcY = this.Margin_V;
					else
						this.CalcY = _Y + this.Bottom_Margin * Value / 100;
				}
				else
				{
					this.CalcY = _Y + Value;
				}

				break;
			}

			case c_oAscRelativeFromV.Line:
			{
				var _Y = this.LineTop;

				if (true === bAlign)
				{
					switch (Value)
					{
						case c_oAscAlignV.Bottom:
						case c_oAscAlignV.Outside:
						{
							this.CalcY = _Y - this.H;
							break;
						}
						case c_oAscAlignV.Center:
						{
							this.CalcY = _Y - this.H / 2;
							break;
						}

						case c_oAscAlignV.Inside:
						case c_oAscAlignV.Top:
						{
							this.CalcY = _Y;
							break;
						}
					}
				}
				else
					this.CalcY = _Y + Value;

				break;
			}

			case c_oAscRelativeFromV.Margin:
			{
				var Y_s = this.Top_Margin;
				var Y_e = this.Page_H - this.Bottom_Margin;

				if (true === bAlign)
				{
					switch (Value)
					{
						case c_oAscAlignV.Bottom:
						case c_oAscAlignV.Outside:
						{
							this.CalcY = Y_e - this.H;
							break;
						}
						case c_oAscAlignV.Center:
						{
							this.CalcY = (Y_s + Y_e - this.H) / 2;
							break;
						}

						case c_oAscAlignV.Inside:
						case c_oAscAlignV.Top:
						{
							this.CalcY = Y_s;
							break;
						}
					}
				}
				else if (true === bPercent)
				{
					if (Math.abs(this.Page_Y) > 0.001)
						this.CalcY = this.Margin_V;
					else
						this.CalcY = Y_s + (Y_e - Y_s) * Value / 100;
				}
				else
				{
					this.CalcY = this.Margin_V + Value;
				}

				break;
			}

			case c_oAscRelativeFromV.Page:
			{
				if (true === bAlign)
				{
					switch (Value)
					{
						case c_oAscAlignV.Bottom:
						case c_oAscAlignV.Outside:
						{
							this.CalcY = this.Page_H - this.H;
							break;
						}
						case c_oAscAlignV.Center:
						{
							this.CalcY = (this.Page_H - this.H) / 2;
							break;
						}

						case c_oAscAlignV.Inside:
						case c_oAscAlignV.Top:
						{
							this.CalcY = 0;
							break;
						}
					}
				}
				else if (true === bPercent)
				{
					if (Math.abs(this.Page_Y) > 0.001)
						this.CalcY = this.Margin_V;
					else
						this.CalcY = this.Page_H * Value / 100;
				}
				else
				{
					this.CalcY = Value + this.Page_Y;
				}

				break;
			}

			case c_oAscRelativeFromV.Paragraph:
			{
				// Почему то Word не дает возможности использовать прилегание
				// относительно абзаца, только абсолютные позиции
				var _Y = this.ParagraphTop;

				if (true === bAlign)
					this.CalcY = _Y;
				else
					this.CalcY = _Y + Value;

				break;
			}

			case c_oAscRelativeFromV.TopMargin:
			{
				var Y_s = 0;
				var Y_e = this.Top_Margin;

				if (true === bAlign)
				{
					switch (Value)
					{
						case c_oAscAlignV.Bottom:
						case c_oAscAlignV.Outside:
						{
							this.CalcY = Y_e - this.H;
							break;
						}
						case c_oAscAlignV.Center:
						{
							this.CalcY = (Y_s + Y_e - this.H) / 2;
							break;
						}

						case c_oAscAlignV.Inside:
						case c_oAscAlignV.Top:
						{
							this.CalcY = Y_s;
							break;
						}
					}
				}
				else if (true === bPercent)
				{
					if (Math.abs(this.Page_Y) > 0.001)
						this.CalcY = this.Margin_V;
					else
						this.CalcY = this.Top_Margin * Value / 100;
				}
				else
					this.CalcY = Y_s + Value;

				break;
			}
		}
	}

	return this.CalcY;
};
CAnchorPosition.prototype.Update_PositionYHeaderFooter = function(TopMarginY, BottomMarginY)
{
	var TopY    = Math.max(this.Page_Y, Math.min(TopMarginY, this.Page_H));
	var BottomY = Math.max(this.Page_Y, Math.min(BottomMarginY, this.Page_H));

	this.Top_Margin    = TopY;
	this.Bottom_Margin = this.Page_H - BottomY;
};
CAnchorPosition.prototype.Correct_Values = function(bInline, PageLimits, AllowOverlap, UseTextWrap, OtherFlowObjects)
{
	if (true != bInline)
	{
		var X_min = PageLimits.X;
		var Y_min = PageLimits.Y;
		var X_max = PageLimits.XLimit;
		var Y_max = PageLimits.YLimit;

		var W = this.W;
		var H = this.H;

		var CurX = this.CalcX;
		var CurY = this.CalcY;

		var bBreak = false;
		while (true != bBreak)
		{
			bBreak = true;
			for (var Index = 0; Index < OtherFlowObjects.length; Index++)
			{
				var Drawing = OtherFlowObjects[Index];
				if (( false === AllowOverlap || false === Drawing.AllowOverlap ) && true === Drawing.Use_TextWrap() && true === UseTextWrap && ( CurX <= Drawing.X + Drawing.W && CurX + W >= Drawing.X && CurY <= Drawing.Y + Drawing.H && CurY + H >= Drawing.Y ))
				{
					// Если убирается справа, размещаем справа от картинки
					if (Drawing.X + Drawing.W < X_max - W - 0.001)
						CurX = Drawing.X + Drawing.W + 0.001;
					else
					{
						CurX = this.CalcX;
						CurY = Drawing.Y + Drawing.H + 0.001;
					}

					bBreak = false;
				}
			}
		}

		// Автофигуры с обтеканием за/перед текстом могут лежать где угодно
		if (true === UseTextWrap)
		{
			// Скорректируем рассчитанную позицию, так чтобы объект не выходил за заданные пределы
			if (CurX + this.BoundsL + this.BoundsW > X_max)
				CurX = X_max - this.BoundsL - this.BoundsW;

			if (CurX + this.BoundsL < X_min)
				CurX = X_min - this.BoundsL;

			// Скорректируем рассчитанную позицию, так чтобы объект не выходил за заданные пределы
			if (CurY + this.BoundsT + this.BoundsH > Y_max)
				CurY = Y_max - this.BoundsT - this.BoundsH;

			if (CurY + this.BoundsT < Y_min)
				CurY = Y_min - this.BoundsT;
		}

		this.CalcX = CurX;
		this.CalcY = CurY;
	}
};
CAnchorPosition.prototype.Calculate_X_Value = function(RelativeFrom)
{
	var Value = 0;
	switch (RelativeFrom)
	{
		case c_oAscRelativeFromH.Character:
		{
			// Почему то Word при позиционировании относительно символа использует не
			// текущуюю позицию, а позицию предыдущего элемента (именно для этого мы
			// храним параметр LastItemW).

			Value = this.CalcX - this.X + this.LastItemW;

			break;
		}

		case c_oAscRelativeFromH.Column:
		{
			Value = this.CalcX - this.ColumnStartX;

			break;
		}

		case c_oAscRelativeFromH.InsideMargin:
		case c_oAscRelativeFromH.LeftMargin:
		case c_oAscRelativeFromH.OutsideMargin:
		{
			Value = this.CalcX;

			break;
		}

		case c_oAscRelativeFromH.Margin:
		{
			Value = this.CalcX - this.Margin_H;

			break;
		}

		case c_oAscRelativeFromH.Page:
		{
			Value = this.CalcX - this.Page_X;

			break;
		}

		case c_oAscRelativeFromH.RightMargin:
		{
			Value = this.CalcX - this.Page_W + this.Right_Margin;

			break;
		}
	}

	return Value;
};
CAnchorPosition.prototype.Calculate_Y_Value = function(RelativeFrom)
{
	var Value = 0;

	switch (RelativeFrom)
	{
		case c_oAscRelativeFromV.BottomMargin:
		case c_oAscRelativeFromV.InsideMargin:
		case c_oAscRelativeFromV.OutsideMargin:
		{
			Value = this.CalcY - this.Page_H + this.Bottom_Margin;

			break;
		}

		case c_oAscRelativeFromV.Line:
		{
			Value = this.CalcY - this.LineTop;

			break;
		}

		case c_oAscRelativeFromV.Margin:
		{
			Value = this.CalcY - this.Margin_V;

			break;
		}

		case c_oAscRelativeFromV.Page:
		{
			Value = this.CalcY - this.Page_Y;

			break;
		}

		case c_oAscRelativeFromV.Paragraph:
		{
			Value = this.CalcY - this.ParagraphTop;

			break;
		}

		case c_oAscRelativeFromV.TopMargin:
		{
			Value = this.CalcY;

			break;
		}
	}

	return Value;
};

function ConvertEquationToMathCallback(ParaDrawing)
{
	ParaDrawing.private_ConvertToMathObject();
}

//--------------------------------------------------------export----------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].ParaDrawing = ParaDrawing;