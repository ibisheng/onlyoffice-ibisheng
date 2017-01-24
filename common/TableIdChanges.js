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
 * Date: 26.10.2016
 * Time: 18:53
 */

(/**
 * @param {Window} window
 * @param {undefined} undefined
 */
	function(window, undefined)
{
	/**
	 * @constructor
	 * @extends {AscDFH.CChangesBase}
	 */
	function CChangesTableIdAdd(Class, Id, NewClass)
	{
		CChangesTableIdAdd.superclass.constructor.call(this, Class);

		this.Id       = Id;
		this.NewClass = NewClass;
	}
	AscCommon.extendClass(CChangesTableIdAdd, AscDFH.CChangesBase);
	CChangesTableIdAdd.prototype.Type = AscDFH.historyitem_TableId_Add;
	CChangesTableIdAdd.prototype.Undo = function()
	{
	};
	CChangesTableIdAdd.prototype.Redo = function()
	{
	};
	CChangesTableIdAdd.prototype.WriteToBinary = function(Writer)
	{
		// String   : Id элемента
		// Varibale : сам элемент

		Writer.WriteString2(this.Id);
		this.NewClass.Write_ToBinary2(Writer);
	};
	CChangesTableIdAdd.prototype.ReadFromBinary = function(Reader)
	{
		// String   : Id элемента
		// Varibale : сам элемент

		this.Id       = Reader.GetString2();
		this.NewClass = this.private_ReadClassFromBinary(Reader);
	};
	CChangesTableIdAdd.prototype.Load = function(Color)
	{
		this.Class.m_aPairs[this.Id] = this.NewClass;
	};
	CChangesTableIdAdd.prototype.RefreshRecalcData = function()
	{
	};
	CChangesTableIdAdd.prototype.private_ReadClassFromBinary = function(Reader)
	{
		var oTableId = this.Class;

		var ElementType = Reader.GetLong();

		oTableId.TurnOff();
		var Element = oTableId.GetClassFromFactory(ElementType);

		if (null !== Element)
			Element.Read_FromBinary2(Reader);

		oTableId.TurnOn();

		return Element;
	};
	CChangesTableIdAdd.prototype.CreateReverseChange = function()
	{
		return null;
	};
	window["AscCommon"].CChangesTableIdAdd = CChangesTableIdAdd;
	/**
	 * @constructor
	 * @extends {AscDFH.CChangesBase}
	 */
	function CChangesTableIdReset(Class, OldId, NewId)
	{
		CChangesTableIdReset.superclass.constructor.call(this, Class);

		this.NewId = NewId;
		this.OldId = OldId;
	}
	AscCommon.extendClass(CChangesTableIdReset, AscDFH.CChangesBase);
	CChangesTableIdReset.prototype.Type = AscDFH.historyitem_TableId_Reset;
	CChangesTableIdReset.prototype.Undo = function()
	{
	};
	CChangesTableIdReset.prototype.Redo = function()
	{
	};
	CChangesTableIdReset.prototype.WriteToBinary = function(Writer)
	{
		// String : New Id
		// String : Old Id

		Writer.WriteString2(this.NewId);
		Writer.WriteString2(this.OldId);
	};
	CChangesTableIdReset.prototype.ReadFromBinary = function(Reader)
	{
		// String : New Id
		// String : Old Id

		this.NewId = Reader.GetString2();
		this.OldId = Reader.GetString2();
	};
	CChangesTableIdReset.prototype.Load = function(Color)
	{
		var oTableId = this.Class;
		if (oTableId.m_aPairs[this.OldId])
		{
			var Class = oTableId.m_aPairs[this.OldId];
			delete oTableId.m_aPairs[this.OldId];
			oTableId.m_aPairs[this.NewId] = Class;

			Class.Id = this.NewId;
		}
	};
	CChangesTableIdReset.prototype.RefreshRecalcData = function()
	{
	};
	CChangesTableIdReset.prototype.CreateReverseChange = function()
	{
		return new CChangesTableIdReset(this.Class, this.NewId, this.OldId);
	};
	window["AscCommon"].CChangesTableIdReset = CChangesTableIdReset;
	/**
	 * @constructor
	 * @extends {AscDFH.CChangesBase}
	 */
	function CChangesTableIdDescription(Class, FileCheckSum, FileSize, Description, ItemsCount, PointIndex, StartPoint, LastPoint, SumIndex, DeletedIndex)
	{
		CChangesTableIdDescription.superclass.constructor.call(this, Class);

		this.FileCheckSum  = FileCheckSum;
		this.FileSize      = FileSize;
		this.Description   = Description;
		this.ItemsCount    = ItemsCount;
		this.PointIndex    = PointIndex;
		this.StartPoint    = StartPoint;
		this.LastPoint     = LastPoint;
		this.SumIndex      = SumIndex;
		this.DeletedIndex  = DeletedIndex;
		this.VersionString = "@@Version.@@Build.@@Rev";
	}
	AscCommon.extendClass(CChangesTableIdDescription, AscDFH.CChangesBase);
	CChangesTableIdDescription.prototype.Type = AscDFH.historyitem_TableId_Description;
	CChangesTableIdDescription.prototype.Undo = function()
	{
	};
	CChangesTableIdDescription.prototype.Redo = function()
	{
	};
	CChangesTableIdDescription.prototype.WriteToBinary = function(Writer)
	{
		// Long : FileCheckSum
		// Long : FileSize
		// Long : Description
		// Long : ItemsCount
		// Long : PointIndex
		// Long : StartPoint
		// Long : LastPoint
		// Long : SumIndex
		// Long : DeletedIndex
		// String : Версия SDK

		Writer.WriteLong(this.FileCheckSum);
		Writer.WriteLong(this.FileSize);
		Writer.WriteLong(this.Description);
		Writer.WriteLong(this.ItemsCount);
		Writer.WriteLong(this.PointIndex);
		Writer.WriteLong(this.StartPoint);
		Writer.WriteLong(this.LastPoint);
		Writer.WriteLong(this.SumIndex);
		Writer.WriteLong(null === this.DeletedIndex ? -10 : this.DeletedIndex);
		Writer.WriteString2(this.VersionString);
	};
	CChangesTableIdDescription.prototype.ReadFromBinary = function(Reader)
	{
		// Long : FileCheckSum
		// Long : FileSize
		// Long : Description
		// Long : ItemsCount
		// Long : PointIndex
		// Long : StartPoint
		// Long : LastPoint
		// Long : SumIndex
		// Long : DeletedIndex
		// String : Версия SDK

		this.FileCheckSum  = Reader.GetLong();
		this.FileSize      = Reader.GetLong();
		this.Description   = Reader.GetLong();
		this.ItemsCount    = Reader.GetLong();
		this.PointIndex    = Reader.GetLong();
		this.StartPoint    = Reader.GetLong();
		this.LastPoint     = Reader.GetLong();
		this.SumIndex      = Reader.GetLong();
		this.DeletedIndex  = Reader.GetLong();
		this.VersionString = Reader.GetString2();
	};
	CChangesTableIdDescription.prototype.Load = function(Color)
	{
		// // CollaborativeEditing LOG
		// console.log("ItemsCount2  " + CollaborativeEditing.m_nErrorLog_PointChangesCount);
		// if (CollaborativeEditing.m_nErrorLog_PointChangesCount !== CollaborativeEditing.m_nErrorLog_SavedPCC)
		// 	console.log("========================= BAD Changes Count in Point =============================");
		// if (CollaborativeEditing.m_nErrorLog_CurPointIndex + 1 !== PointIndex && 0 !== PointIndex)
		// 	console.log("========================= BAD Point index ========================================");
		// var bBadSumIndex = false;
		// if (0 === PointIndex)
		// {
		// 	CollaborativeEditing.m_nErrorLog_SumIndex = 0;
		// }
		// else
		// {
		// 	// Потому что мы не учитываем данное изменение
		// 	CollaborativeEditing.m_nErrorLog_SumIndex += CollaborativeEditing.m_nErrorLog_SavedPCC + 1;
		// 	if (PointIndex === StartPoint)
		// 	{
		// 		if (CollaborativeEditing.m_nErrorLog_SumIndex !== SumIndex)
		// 			bBadSumIndex = true;
		//
		// 		console.log("SumIndex2    " + CollaborativeEditing.m_nErrorLog_SumIndex);
		// 		CollaborativeEditing.m_nErrorLog_SumIndex = SumIndex;
		// 	}
		// }
		//
		// console.log("----------------------------");
		// console.log("FileCheckSum " + FileCheckSum);
		// console.log("FileSize     " + FileSize);
		// console.log("Description  " + Description + " " +
		// 	AscDFH.GetHistoryPointStringDescription(Description));
		// console.log("PointIndex   " + PointIndex);
		// console.log("StartPoint   " + StartPoint);
		// console.log("LastPoint    " + LastPoint);
		// console.log("ItemsCount   " + ItemsCount);
		// console.log("SumIndex     " + SumIndex);
		// console.log("DeletedIndex " + (-10 === DeletedIndex ? null : DeletedIndex));
		// // -1 Чтобы не учитывалось данное изменение
		// CollaborativeEditing.m_nErrorLog_SavedPCC          = ItemsCount;
		// CollaborativeEditing.m_nErrorLog_PointChangesCount = -1;
		// CollaborativeEditing.m_nErrorLog_CurPointIndex     = PointIndex;
		// if (bBadSumIndex)
		// 	console.log("========================= BAD Sum index ==========================================");
	};
	CChangesTableIdDescription.prototype.RefreshRecalcData = function()
	{
	};
	CChangesTableIdDescription.prototype.CreateReverseChange = function()
	{
		return null;
	};
	window["AscCommon"].CChangesTableIdDescription = CChangesTableIdDescription;
	/**
	 * @constructor
	 * @extends {AscDFH.CChangesBase}
	 */
	function CChangesCommonAddWaterMark(Class, Url)
	{
		CChangesCommonAddWaterMark.superclass.constructor.call(this, Class);

		this.Url = Url ? Url : "";
	}
	AscCommon.extendClass(CChangesCommonAddWaterMark, AscDFH.CChangesBase);
	CChangesCommonAddWaterMark.prototype.Type = AscDFH.historyitem_Common_AddWatermark;
	CChangesCommonAddWaterMark.prototype.Undo = function()
	{
	};
	CChangesCommonAddWaterMark.prototype.Redo = function()
	{
	};
	CChangesCommonAddWaterMark.prototype.WriteToBinary = function(Writer)
	{
		Writer.WriteString2(this.Url);
	};
	CChangesCommonAddWaterMark.prototype.ReadFromBinary = function(Reader)
	{
		this.Url = Reader.GetString2();
	};
	CChangesCommonAddWaterMark.prototype.Load = function(Color)
	{
		var sUrl = this.Url;
		if (editor && editor.WordControl && editor.WordControl.m_oLogicDocument)
		{
			var oLogicDocument = editor.WordControl.m_oLogicDocument;
			if (oLogicDocument instanceof AscCommonWord.CDocument)
			{
				var oParaDrawing    = oLogicDocument.DrawingObjects.getTrialImage(sUrl);
				var oFirstParagraph = oLogicDocument.Get_FirstParagraph();
				AscFormat.ExecuteNoHistory(function()
				{
					var oRun = new AscCommonWord.ParaRun();
					oRun.Content.splice(0, 0, oParaDrawing);
					oFirstParagraph.Content.splice(0, 0, oRun);
					oLogicDocument.DrawingObjects.addGraphicObject(oParaDrawing);
				}, this, []);
			}
			else if (oLogicDocument instanceof AscCommonSlide.CPresentation)
			{
				if (oLogicDocument.Slides[0])
				{
					var oDrawing            = oLogicDocument.Slides[0].graphicObjects.createWatermarkImage(sUrl);
					oDrawing.spPr.xfrm.offX = (oLogicDocument.Width - oDrawing.spPr.xfrm.extX) / 2;
					oDrawing.spPr.xfrm.offY = (oLogicDocument.Height - oDrawing.spPr.xfrm.extY) / 2;
					oDrawing.parent         = oLogicDocument.Slides[0];
					oLogicDocument.Slides[0].cSld.spTree.push(oDrawing);
				}
			}
		}
		else
		{
			var oWsModel = window["Asc"]["editor"].wbModel.aWorksheets[0];
			if (oWsModel)
			{
				var objectRender          = new AscFormat.DrawingObjects();
				var oNewDrawing           = objectRender.createDrawingObject(AscCommon.c_oAscCellAnchorType.cellanchorAbsolute);
				var oImage                = AscFormat.DrawingObjectsController.prototype.createWatermarkImage(sUrl);
				oNewDrawing.ext.cx        = oImage.spPr.xfrm.extX;
				oNewDrawing.ext.cy        = oImage.spPr.xfrm.extY;
				oNewDrawing.graphicObject = oImage;
				oWsModel.Drawings.push(oNewDrawing);
			}
		}
	};
	CChangesCommonAddWaterMark.prototype.RefreshRecalcData = function()
	{
	};
	CChangesCommonAddWaterMark.prototype.CreateReverseChange = function()
	{
		return null;
	};
	window["AscCommon"].CChangesCommonAddWaterMark = CChangesCommonAddWaterMark;
})(window);



AscDFH.changesFactory[AscDFH.historyitem_TableId_Add]         = AscCommon.CChangesTableIdAdd;
AscDFH.changesFactory[AscDFH.historyitem_TableId_Reset]       = AscCommon.CChangesTableIdReset;
AscDFH.changesFactory[AscDFH.historyitem_TableId_Description] = AscCommon.CChangesTableIdDescription;

AscDFH.changesFactory[AscDFH.historyitem_Common_AddWatermark] = AscCommon.CChangesCommonAddWaterMark;


//----------------------------------------------------------------------------------------------------------------------
// Карта зависимости изменений
//----------------------------------------------------------------------------------------------------------------------
AscDFH.changesRelationMap[AscDFH.historyitem_TableId_Add]         = [AscDFH.historyitem_TableId_Add];
AscDFH.changesRelationMap[AscDFH.historyitem_TableId_Reset]       = [AscDFH.historyitem_TableId_Reset];
AscDFH.changesRelationMap[AscDFH.historyitem_TableId_Description] = [AscDFH.historyitem_TableId_Description];
AscDFH.changesRelationMap[AscDFH.historyitem_Common_AddWatermark] = [AscDFH.historyitem_Common_AddWatermark];
//----------------------------------------------------------------------------------------------------------------------
