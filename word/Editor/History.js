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

(function (window, undefined) {

function CHistory(Document)
{
    this.Index      = -1;
    this.SavedIndex = null;        // Номер точки отката, на которой произошло последнее сохранение
    this.ForceSave  = false;       // Нужно сохранение, случается, когда у нас точка SavedIndex смещается из-за объединения точек, и мы делаем Undo
    this.RecIndex   = -1;          // Номер точки, на которой произошел последний пересчет
    this.Points     = [];          // Точки истории, в каждой хранится массив с изменениями после текущей точки
    this.Document   = Document;
    this.Api                  = null;
    this.CollaborativeEditing = null;
    this.CanNotAddChanges = false;//флаг для отслеживания ошибок добавления изменений без точки:Create_NewPoint->Add->Save_Changes->Add

	this.RecalculateData =
	{
		Inline       : {
			Pos     : -1,
			PageNum : 0
		},
		Flow         : [],
		HdrFtr       : [],
		Drawings     : {
			All       : false,
			Map       : {},
			ThemeInfo : null
		},
		Tables       : [],
		NumPr        : [],
		NotesEnd     : false,
		NotesEndPage : 0,
		Update       : true
	};

	this.TurnOffHistory = 0;
    this.MinorChanges   = false; // Данный параметр нужен, чтобы определить влияют ли добавленные изменения на пересчет

    this.BinaryWriter = new AscCommon.CMemory();

    this.FileCheckSum = 0;
    this.FileSize     = 0;

    // Параметры для специального сохранения для локальной версии редактора
    this.UserSaveMode   = false;
    this.UserSavedIndex = null;  // Номер точки, на которой произошло последнее сохранение пользователем (не автосохранение)
}

CHistory.prototype =
{
    Set_LogicDocument : function(LogicDocument)
    {
        if (!LogicDocument)
            return;

        this.Document             = LogicDocument;
        this.Api                  = LogicDocument.Get_Api();
        this.CollaborativeEditing = LogicDocument.Get_CollaborativeEditing();
    },

    Is_UserSaveMode : function()
    {
        return this.UserSaveMode;
    },

    Update_FileDescription : function(oStream)
    {
        var pData = oStream.data;
        var nSize = oStream.size;

        this.FileCheckSum = g_oCRC32.Calculate_ByByteArray(pData, nSize);
        this.FileSize     = nSize;
    },

	Update_PointInfoItem : function(PointIndex, StartPoint, LastPoint, SumIndex, DeletedIndex)
	{
		var Point = this.Points[PointIndex];
		if (Point)
		{
			// Проверяем первое изменение. Если оно уже нужного типа, тогда мы его удаляем. Добавляем специфическое
			// первое изменение с описанием.
			var Class = AscCommon.g_oTableId;

			if (Point.Items.length > 0)
			{
				var FirstItem = Point.Items[0];
				if (FirstItem.Class === Class && AscDFH.historyitem_TableId_Description === FirstItem.Data.Type)
					Point.Items.splice(0, 1);
			}

			var Data = new AscCommon.CChangesTableIdDescription(Class,
				this.FileCheckSum,
				this.FileSize,
				Point.Description,
				Point.Items.length,
				PointIndex,
				StartPoint,
				LastPoint,
				SumIndex,
				DeletedIndex
			);

			var Binary_Pos = this.BinaryWriter.GetCurPosition();
			this.BinaryWriter.WriteString2(Class.Get_Id());
			this.BinaryWriter.WriteLong(Data.Type);
			Data.WriteToBinary(this.BinaryWriter);

			var Binary_Len = this.BinaryWriter.GetCurPosition() - Binary_Pos;

			var Item = {
				Class  : Class,
				Data   : Data,
				Binary : {
					Pos : Binary_Pos,
					Len : Binary_Len
				},

				NeedRecalc : false
			};

			Point.Items.splice(0, 0, Item);
		}
	},

    Is_Clear : function()
    {
        if ( this.Points.length <= 0 )
            return true;

        return false;
    },

    Clear : function()
    {
        this.Index          = -1;
        this.SavedIndex     = null;
        this.ForceSave      = false;
        this.UserSavedIndex = null;
        this.Points.length  = 0;
		this.TurnOffHistory = 0;
        this.Internal_RecalcData_Clear();
    },

    Can_Undo : function()
    {
        if ( this.Index >= 0 )
            return true;

        return false;
    },

    Can_Redo : function()
    {
        if ( this.Points.length > 0 && this.Index < this.Points.length - 1 )
            return true;

        return false;
    },

    UndoLastPoint : function(nBottomIndex)
    {
        var oPoint = this.Points[this.Index];
        if(oPoint)
        {
            var aItems = oPoint.Items;
            var _bottomIndex;
            if(AscFormat.isRealNumber(nBottomIndex))
            {
                _bottomIndex = nBottomIndex - 1;
            }
            else
            {
                _bottomIndex = -1;
            }
            for (var i = aItems.length - 1; i > _bottomIndex; i--)
            {
                var oItem = aItems[i];
                oItem.Data.Undo();
            }
            oPoint.Items.length = _bottomIndex + 1;
            this.Document.Set_SelectionState( oPoint.State );
        }
    },

    Undo : function(Options)
    {
        this.Check_UninonLastPoints();

        // Проверяем можно ли сделать Undo
        if (true !== this.Can_Undo())
            return null;

        // Запоминаем самое последнее состояние документа для Redo
        if ( this.Index === this.Points.length - 1 )
            this.LastState = this.Document.Get_SelectionState();
        
        this.Document.Selection_Remove(true);

        this.Internal_RecalcData_Clear();

        var Point = null;
        if (undefined !== Options && null !== Options && true === Options.All)
        {
            while (this.Index >= 0)
            {
                Point = this.Points[this.Index--];

                // Откатываем все действия в обратном порядке (относительно их выполенения)
                for (var Index = Point.Items.length - 1; Index >= 0; Index--)
                {
                    var Item = Point.Items[Index];

					if (Item.Data)
					{
						Item.Data.Undo();
						Item.Data.RefreshRecalcData();
					}
                    this.private_UpdateContentChangesOnUndo(Item);
                }
            }
        }
        else
        {
            Point = this.Points[this.Index--];

            // Откатываем все действия в обратном порядке (относительно их выполенения)
            for (var Index = Point.Items.length - 1; Index >= 0; Index--)
            {
                var Item = Point.Items[Index];
				if (Item.Data)
				{
					Item.Data.Undo();
					Item.Data.RefreshRecalcData();
				}
				this.private_UpdateContentChangesOnUndo(Item);
            }
        }

        if (null != Point)
            this.Document.Set_SelectionState( Point.State );

        return this.RecalculateData;
    },

    Redo : function()
    {
        // Проверяем можно ли сделать Redo
        if ( true != this.Can_Redo() )
            return null;

        this.Document.Selection_Remove(true);
        
        var Point = this.Points[++this.Index];

        this.Internal_RecalcData_Clear();

        // Выполняем все действия в прямом порядке
        for ( var Index = 0; Index < Point.Items.length; Index++ )
        {
            var Item = Point.Items[Index];

			if (Item.Data)
			{
				Item.Data.Redo();
				Item.Data.RefreshRecalcData();
			}
			this.private_UpdateContentChangesOnRedo(Item);
        }

        // Восстанавливаем состояние на следующую точку
        var State = null;
        if ( this.Index === this.Points.length - 1 )
            State = this.LastState;
        else
            State = this.Points[this.Index + 1].State;

        this.Document.Set_SelectionState( State );

        return this.RecalculateData;
    },

    Create_NewPoint : function(Description)
    {
		if ( 0 !== this.TurnOffHistory )
			return;

        this.CanNotAddChanges = false;

        if (null !== this.SavedIndex && this.Index < this.SavedIndex)
            this.Set_SavedIndex(this.Index);

        this.Clear_Additional();

        this.Check_UninonLastPoints();
        
        var State = this.Document.Get_SelectionState();
        var Items = [];
        var Time  = new Date().getTime();

        // Создаем новую точку
        this.Points[++this.Index] =
        {
            State      : State, // Текущее состояние документа (курсор, селект)
            Items      : Items, // Массив изменений, начиная с текущего момента
            Time       : Time,  // Текущее время
            Additional : {},    // Дополнительная информация
            Description: Description
        };

        // Удаляем ненужные точки
        this.Points.length = this.Index + 1;
    },

	/**
	 * Специальная функция, для создания точки, чтобы отловить все изменения, которые происходят. После использования
	 * данная точка ДОЛЖНА быть удалена через функцию Remove_LastPoint.
	 */
	CreateNewPointForCollectChanges : function()
	{
		this.Points[++this.Index] = {
			State       : null,
			Items       : [],
			Time        : null,
			Additional  : {},
			Description : -1
		};

		this.Points.length = this.Index + 1;
	},
    
    Remove_LastPoint : function()
    {
        this.Index--;
        this.Points.length = this.Index + 1;
    },

    Is_LastPointEmpty : function()
    {
        if (!this.Points[this.Index] || this.Points[this.Index].Items.length <= 0)
            return true;

        return false;
    },

    Is_LastPointNeedRecalc : function()
    {
        if (!this.Points[this.Index])
            return false;

        var RecalcData = this.Get_RecalcData();
        if (RecalcData.Flow.length > 0 || RecalcData.HdrFtr.length > 0 || -1 !== RecalcData.Inline.Pos || true === RecalcData.Drawings.All)
            return true;

        for(var Key in RecalcData.Drawings.Map)
        {
            if(null != AscCommon.g_oTableId.Get_ById(Key))
            {
                return true;
            }
        }

        return false;
    },

    Clear_Redo : function()
    {
        // Удаляем ненужные точки
        this.Points.length = this.Index + 1;
    },

    // Регистрируем новое изменение:
    // Class - объект, в котором оно произошло
    // Data  - сами изменения
	Add : function(_Class, Data)
	{
		if (0 !== this.TurnOffHistory || this.Index < 0)
			return;

		this._CheckCanNotAddChanges();

		// Заглушка на случай, если у нас во время создания одной точки в истории, после нескольких изменений идет
		// пересчет, потом снова добавляются изменения и снова запускается пересчет и т.д.
		if (this.RecIndex >= this.Index)
			this.RecIndex = this.Index - 1;

		var Binary_Pos = this.BinaryWriter.GetCurPosition();

		var Class;
		if (_Class) {
            Class = _Class.GetClass();
            Data = _Class;

            this.BinaryWriter.WriteString2(Class.Get_Id());
            this.BinaryWriter.WriteLong(_Class.Type);
            _Class.WriteToBinary(this.BinaryWriter);
        }

		var Binary_Len = this.BinaryWriter.GetCurPosition() - Binary_Pos;
		var Item       = {
			Class  : Class,
			Data   : Data,
			Binary : {
				Pos : Binary_Pos,
				Len : Binary_Len
			},

			NeedRecalc : !this.MinorChanges
		};

		this.Points[this.Index].Items.push(Item);

		if (!this.CollaborativeEditing)
			return;

		if (_Class)
		{
			if (_Class.IsContentChange())
			{
				var bAdd  = _Class.IsAdd();
				var Count = _Class.GetItemsCount();

				var ContentChanges = new AscCommon.CContentChangesElement(bAdd == true ? AscCommon.contentchanges_Add : AscCommon.contentchanges_Remove, Data.Pos, Count, Item);
				Class.Add_ContentChanges(ContentChanges);
				this.CollaborativeEditing.Add_NewDC(Class);

				if (true === bAdd)
					this.CollaborativeEditing.Update_DocumentPositionsOnAdd(Class, Data.Pos);
				else
					this.CollaborativeEditing.Update_DocumentPositionsOnRemove(Class, Data.Pos, Count);
			}
		    if(_Class.IsPosExtChange()){
                this.CollaborativeEditing.AddPosExtChanges(Item, _Class);
            }
		}
	},

	Internal_RecalcData_Clear : function()
	{
		// NumPr здесь не обнуляем
		var NumPr            = this.RecalculateData.NumPr;
		this.RecalculateData = {
			Inline   : {
				Pos     : -1,
				PageNum : 0
			},
			Flow     : [],
			HdrFtr   : [],
			Drawings : {
				All       : false,
				Map       : {},
				ThemeInfo : null
			},

			Tables        : [],
			NumPr         : NumPr,
			NotesEnd      : false,
			NotesEndPage  : 0,
			Update        : true,
			ChangedStyles : {},
			ChangedNums   : {},
			AllParagraphs : null
		};
	},

    RecalcData_Add : function(Data)
    {
        if (true !== this.RecalculateData.Update)
            return;

        if ( "undefined" === typeof(Data) || null === Data )
            return;

        switch ( Data.Type )
        {
            case AscDFH.historyitem_recalctype_Flow:
            {
                var bNew = true;
                for ( var Index = 0; Index < this.RecalculateData.Flow.length; Index++ )
                {
                    if ( this.RecalculateData.Flow[Index] === Data.Data )
                    {
                        bNew = false;
                        break;
                    }
                }

                if ( true === bNew )
                    this.RecalculateData.Flow.push( Data.Data );

                break;
            }

            case AscDFH.historyitem_recalctype_HdrFtr:
            {
                if ( null === Data.Data )
                    break;

                var bNew = true;
                for ( var Index = 0; Index < this.RecalculateData.HdrFtr.length; Index++ )
                {
                    if ( this.RecalculateData.HdrFtr[Index] === Data.Data )
                    {
                        bNew = false;
                        break;
                    }
                }

                if ( true === bNew )
                    this.RecalculateData.HdrFtr.push( Data.Data );

                break
            }

            case AscDFH.historyitem_recalctype_Inline:
            {
                if ( (Data.Data.Pos < this.RecalculateData.Inline.Pos) || (Data.Data.Pos === this.RecalculateData.Inline.Pos && Data.Data.PageNum < this.RecalculateData.Inline.PageNum) || this.RecalculateData.Inline.Pos < 0 )
                {
                    this.RecalculateData.Inline.Pos     = Data.Data.Pos;
                    this.RecalculateData.Inline.PageNum = Data.Data.PageNum;
                }

                break;
            }
            case AscDFH.historyitem_recalctype_Drawing:
            {
                if(!this.RecalculateData.Drawings.All)
                {
                    if(Data.All)
                    {
                        this.RecalculateData.Drawings.All = true;
                    }
                    else
                    {
                        if(Data.Theme)
                        {
                            this.RecalculateData.Drawings.ThemeInfo =
                            {
                                Theme: true,
                                ArrInd: Data.ArrInd
                            }
                        }
                        else if(Data.ColorScheme)
                        {
                            this.RecalculateData.Drawings.ThemeInfo =
                            {
                                ColorScheme: true,
                                ArrInd: Data.ArrInd
                            }
                        }
                        else
                        {
                            this.RecalculateData.Drawings.Map[Data.Object.Get_Id()] = Data.Object;
                        }
                    }
                }
                break;
            }

			case AscDFH.historyitem_recalctype_NotesEnd:
			{
				this.RecalculateData.NotesEnd     = true;
				this.RecalculateData.NotesEndPage = Data.PageNum;
				break;
			}
        }
    },

	AddChangedStyleToRecalculateData : function(sId, oStyle)
	{
		if (!this.RecalculateData.ChangedStyles)
			this.RecalculateData.ChangedStyles = {};

		if (this.RecalculateData.ChangedStyles[sId] === oStyle)
			return false;

		this.RecalculateData.ChangedStyles[sId] = oStyle;
		return true;
	},

	AddChangedNumberingToRecalculateData : function(NumId, Lvl, oNum)
	{
		if (!this.RecalculateData.ChangedNums)
			this.RecalculateData.ChangedNums = {};

		if (!this.RecalculateData.ChangedNums[NumId])
			this.RecalculateData.ChangedNums[NumId] = {};

		if (this.RecalculateData.ChangedNums[NumId][Lvl] === oNum)
			return false;

		this.RecalculateData.ChangedNums[NumId][Lvl] = oNum;
		return true;
	},

    Add_RecalcNumPr : function(NumPr)
    {
        if (undefined !== NumPr && null !== NumPr && undefined !== NumPr.NumId)
            this.RecalculateData.NumPr[NumPr.NumId] = true;
    },

    Add_RecalcTableGrid : function(TableId)
    {
        this.RecalculateData.Tables[TableId] = true;
    },

    OnEnd_GetRecalcData : function()
    {
        // Пересчитываем таблицы
        for (var TableId in this.RecalculateData.Tables)
        {
            var Table = AscCommon.g_oTableId.Get_ById(TableId);
            if (null !== Table && Table.Is_UseInDocument())
            {
                if (true === Table.Check_ChangedTableGrid())
                {
                    Table.Refresh_RecalcData2(0, 0);
                }
            }
        }

        // Делаем это, чтобы пересчитались ячейки таблиц, в которых есть заданная нумерация. Но нам не нужно менять
        // начальную точку пересчета здесь, т.к. начальная точка уже рассчитана правильно.
        this.RecalculateData.Update = false;
        for (var NumId in this.RecalculateData.NumPr)
        {
            var NumPr = new CNumPr();
            NumPr.NumId = NumId;
            for (var Lvl = 0; Lvl < 9; ++Lvl)
            {
                NumPr.Lvl = Lvl;
                var AllParagraphs = this.Document.Get_AllParagraphsByNumbering(NumPr);
                var Count = AllParagraphs.length;
                for (var Index = 0; Index < Count; ++Index)
                {
                    var Para = AllParagraphs[Index];
                    Para.Refresh_RecalcData2(0);
                }
            }
        }
        this.RecalculateData.NumPr = [];
        this.RecalculateData.Update = true;
    },

    Check_UninonLastPoints : function()
    {
        // Не объединяем точки в истории, когда отключается пересчет.
        // TODO: Неправильно изменяется RecalcIndex
        if (true !== this.Document.Is_OnRecalculate())
            return false;

        // Не объединяем точки истории, если на предыдущей точке произошло сохранение
        if (this.Points.length < 2
            || (true !== this.Is_UserSaveMode() && null !== this.SavedIndex && this.SavedIndex >= this.Points.length - 2)
            || (true === this.Is_UserSaveMode() && null !== this.UserSavedIndex && this.UserSavedIndex >= this.Points.length - 2))
            return false;

        var Point1 = this.Points[this.Points.length - 2];
        var Point2 = this.Points[this.Points.length - 1];

        // Не объединяем слова больше 63 элементов
        if (Point1.Items.length > 63 && AscDFH.historydescription_Document_AddLetterUnion === Point1.Description)
            return false;

        var StartIndex1 = 0;
        var StartIndex2 = 0;
        if (Point1.Items.length > 0 && Point1.Items[0].Data && AscDFH.historyitem_TableId_Description === Point1.Items[0].Data.Type)
            StartIndex1 = 1;

        if (Point2.Items.length > 0 && Point2.Items[0].Data && AscDFH.historyitem_TableId_Description === Point2.Items[0].Data.Type)
            StartIndex2 = 1;

        var NewDescription;
        if ((AscDFH.historydescription_Document_CompositeInput === Point1.Description || AscDFH.historydescription_Document_CompositeInputReplace === Point1.Description)
            && AscDFH.historydescription_Document_CompositeInputReplace === Point2.Description)
        {
            // Ничего не делаем. Эта ветка означает, что эти две точки можно объединить
            NewDescription = AscDFH.historydescription_Document_CompositeInput;
        }
        else
        {
            var PrevItem = null;
            var Class    = null;
            for (var Index = StartIndex1; Index < Point1.Items.length; Index++)
            {
                var Item = Point1.Items[Index];

                if (null === Class)
                    Class = Item.Class;
                else if (Class != Item.Class || "undefined" === typeof(Class.Check_HistoryUninon) || false === Class.Check_HistoryUninon(PrevItem.Data, Item.Data))
                    return;

                PrevItem = Item;
            }

            for (var Index = StartIndex2; Index < Point2.Items.length; Index++)
            {
                var Item = Point2.Items[Index];

                if (Class != Item.Class || "undefined" === typeof(Class.Check_HistoryUninon) || false === Class.Check_HistoryUninon(PrevItem.Data, Item.Data))
                    return;

                PrevItem = Item;
            }

            NewDescription = AscDFH.historydescription_Document_AddLetterUnion;
        }

        if (0 !== StartIndex1)
            Point1.Items.splice(0, 1);

        if (0 !== StartIndex2)
            Point2.Items.splice(0, 1);

        var NewPoint =
        {
            State      : Point1.State,
            Items      : Point1.Items.concat(Point2.Items),
            Time       : Point1.Time,
            Additional : {},
            Description: NewDescription
        };

		if (null !== this.SavedIndex && this.SavedIndex >= this.Points.length - 2)
            this.Set_SavedIndex(this.Points.length - 3);

        this.Points.splice( this.Points.length - 2, 2, NewPoint );
        if ( this.Index >= this.Points.length )
        {
            var DiffIndex = -this.Index + (this.Points.length - 1);
            this.Index    += DiffIndex;
            this.RecIndex  = Math.max( -1, this.RecIndex + DiffIndex);
        }

        return true;
	},

    CanRemoveLastPoint : function()
    {
        if (this.Points.length <= 0
            || (true !== this.Is_UserSaveMode() && null !== this.SavedIndex && this.SavedIndex >= this.Points.length - 1)
            || (true === this.Is_UserSaveMode() && null !== this.UserSavedIndex && this.UserSavedIndex >= this.Points.length - 1))
            return false;

        return true;
    },

    TurnOff : function()
    {
		this.TurnOffHistory++;
    },

    TurnOn : function()
    {
		this.TurnOffHistory--;
		if(this.TurnOffHistory < 0)
			this.TurnOffHistory = 0;
    },

	/** @returns {boolean} */
    Is_On : function()
    {
		return (0 === this.TurnOffHistory);
    },

	Reset_SavedIndex : function(IsUserSave)
	{
		this.SavedIndex = (null === this.SavedIndex && -1 === this.Index ? null : this.Index);
		if (true === this.Is_UserSaveMode())
		{
			if (true === IsUserSave)
			{
				this.UserSavedIndex = this.Index;
				this.ForceSave      = false;
			}
		}
		else
		{
			this.ForceSave = false;
		}
	},

    Set_SavedIndex : function(Index)
    {
      this.SavedIndex = Index;
      if (true === this.Is_UserSaveMode()) {
        if (null !== this.UserSavedIndex && this.UserSavedIndex > this.SavedIndex) {
          this.UserSavedIndex = Index;
          this.ForceSave = true;
        }
      } else {
        this.ForceSave = true;
      }
    },

    Have_Changes : function(IsNotUserSave)
    {
      var checkIndex = (this.Is_UserSaveMode() && !IsNotUserSave) ? this.UserSavedIndex : this.SavedIndex;
      if (-1 === this.Index && null === checkIndex && false === this.ForceSave)
        return false;

      if (this.Index != checkIndex || true === this.ForceSave)
        return true;

      return false;
    },

    Get_RecalcData : function(RecalcData, arrChanges)
    {
        if (RecalcData)
        {
            this.RecalculateData = RecalcData;
        }
        else if (arrChanges)
		{
			this.Internal_RecalcData_Clear();
			for (var nIndex = 0, nCount = arrChanges.length; nIndex < nCount; ++nIndex)
			{
				var oChange = arrChanges[nIndex];
				oChange.RefreshRecalcData();
			}
		}
        else
        {
            if (this.Index >= 0)
            {
                this.Internal_RecalcData_Clear();

                for (var Pos = this.RecIndex + 1; Pos <= this.Index; Pos++)
                {
                    // Считываем изменения, начиная с последней точки, и смотрим что надо пересчитать.
                    var Point = this.Points[Pos];

                    // Выполняем все действия в прямом порядке
                    for (var Index = 0; Index < Point.Items.length; Index++)
                    {
                        var Item = Point.Items[Index];

                        if (true === Item.NeedRecalc)
                            Item.Class.Refresh_RecalcData(Item.Data);
                    }
                }
            }
        }

        this.OnEnd_GetRecalcData();
        return this.RecalculateData;
    },

    Reset_RecalcIndex : function()
    {
        this.RecIndex = this.Index;
    },

    Is_SimpleChanges : function()
    {
        var Count, Items;
        if (this.Index - this.RecIndex !== 1 && this.RecIndex >= -1)
        {
            Items = [];
            Count = 0;
            for (var PointIndex = this.RecIndex + 1; PointIndex <= this.Index; PointIndex++)
            {
                Items = Items.concat(this.Points[PointIndex].Items);
                Count += this.Points[PointIndex].Items.length;
            }
        }
        else if (this.Index >= 0)
        {
            // Считываем изменения, начиная с последней точки, и смотрим что надо пересчитать.
            var Point = this.Points[this.Index];

            Count = Point.Items.length;
            Items = Point.Items;
        }
        else
            return [];
        

        if (Items.length > 0)
        {
            var Class = Items[0].Class;
            // Смотрим, чтобы класс, в котором произошли все изменения был один и тот же
            for (var Index = 1; Index < Count; Index++)
            {
                var Item = Items[Index];

                if (Class !== Item.Class)
                    return [];
            }

            if (Class instanceof ParaRun && Class.Is_SimpleChanges(Items))
                return [Items[0]];
        }

        return [];
    },

    Is_ParagraphSimpleChanges : function()
    {
        var Count, Items;
        if (this.Index - this.RecIndex !== 1 && this.RecIndex >= -1)
        {
            Items = [];
            Count = 0;
            for (var PointIndex = this.RecIndex + 1; PointIndex <= this.Index; PointIndex++)
            {
                Items = Items.concat(this.Points[PointIndex].Items);
                Count += this.Points[PointIndex].Items.length;
            }
        }
        else if (this.Index >= 0)
        {
            // Считываем изменения, начиная с последней точки, и смотрим что надо пересчитать.
            var Point = this.Points[this.Index];

            Count = Point.Items.length;
            Items = Point.Items;
        }
        else
            return null;


        if (Items.length > 0)
        {
            // Смотрим, чтобы параграф, в котором происходили все изменения был один и тот же. Если есть изменение,
            // которое не возвращает параграф, значит возвращаем null.

            var Para = null;
            var Class = Items[0].Class;
            if (Class instanceof Paragraph)
                Para = Class;
            else if (Class.Get_Paragraph)
                Para = Class.Get_Paragraph();
            else
                return null;

            for (var Index = 1; Index < Count; Index++)
            {
                Class = Items[Index].Class;

                if (Class instanceof Paragraph)
                {
                    if (Para != Class)
                        return null;
                }
                else if (Class.Get_Paragraph)
                {
                    if (Para != Class.Get_Paragraph())
                        return null;
                }
                else
                    return null;
            }

            // Все изменения сделаны в одном параграфе, нам осталось проверить, что каждое из этих изменений
            // влияет только на данный параграф.
            for (var Index = 0; Index < Count; Index++)
            {
                var Item = Items[Index];
                var Class = Item.Class;
                if (!Class.Is_SimpleChanges || !Class.Is_ParagraphSimpleChanges(Item))
                    return null;
            }

            return Para;
        }

        return null;
    },

    Set_Additional_ExtendDocumentToPos : function()
    {
        if ( this.Index >= 0 )
        {
            this.Points[this.Index].Additional.ExtendDocumentToPos = true;
        }
    },

    Is_ExtendDocumentToPos : function()
    {
        if ( undefined === this.Points[this.Index] || undefined === this.Points[this.Index].Additional || undefined === this.Points[this.Index].Additional.ExtendDocumentToPos )
            return false;

        return true;
    },

    Clear_Additional : function()
    {
        if ( this.Index >= 0 )
        {
            this.Points[this.Index].Additional = {};
        }

        if (this.Api && true === this.Api.isMarkerFormat)
            this.Api.sync_MarkerFormatCallback(false);
    },

    Get_EditingTime : function(dTime)
    {
        var Count = this.Points.length;

        var TimeLine = [];
        for ( var Index = 0; Index < Count; Index++ )
        {
            var PointTime = this.Points[Index].Time;
            TimeLine.push( { t0 : PointTime - dTime, t1 : PointTime } );
        }

        Count = TimeLine.length;
        for ( var Index = 1; Index < Count; Index++ )
        {
            var CurrEl = TimeLine[Index];
            var PrevEl = TimeLine[Index - 1];
            if ( CurrEl.t0 <= PrevEl.t1 )
            {
                PrevEl.t1 = CurrEl.t1;
                TimeLine.splice( Index, 1 );
                Index--;
                Count--;
            }
        }

        Count = TimeLine.length;
        var OverallTime = 0;
        for ( var Index = 0; Index < Count; Index++ )
        {
            OverallTime += TimeLine[Index].t1 - TimeLine[Index].t0;
        }

        return OverallTime;
    },

    Get_DocumentPositionBinary : function()
    {
        var PosInfo = this.Document.Get_DocumentPositionInfoForCollaborative();
        if (!PosInfo)
            return null;
        var BinaryPos = this.BinaryWriter.GetCurPosition();
        this.BinaryWriter.WriteString2(PosInfo.Class.Get_Id());
        this.BinaryWriter.WriteLong(PosInfo.Position);
        var BinaryLen = this.BinaryWriter.GetCurPosition() - BinaryPos;
        return  (BinaryLen + ";" + this.BinaryWriter.GetBase64Memory2(BinaryPos, BinaryLen));
    },

    _CheckCanNotAddChanges : function() {
        try {
            if (this.CanNotAddChanges && this.Api) {
                var tmpErr = new Error();
                if (tmpErr.stack) {
                    this.Api.CoAuthoringApi.sendChangesError(tmpErr.stack);
                }
            }
        } catch (e) {
        }
    }
};
CHistory.prototype.private_UpdateContentChangesOnUndo = function(Item)
{
	if (this.private_IsContentChange(Item.Class, Item.Data))
	{
		Item.Class.m_oContentChanges.RemoveByHistoryItem(Item);
	}
};
CHistory.prototype.private_UpdateContentChangesOnRedo = function(Item)
{
	if (this.private_IsContentChange(Item.Class, Item.Data))
	{
		var bAdd  = this.private_IsAddContentChange(Item.Class, Item.Data);
		var Count = this.private_GetItemsCountInContentChange(Item.Class, Item.Data);

		var ContentChanges = new AscCommon.CContentChangesElement(( bAdd == true ? AscCommon.contentchanges_Add : AscCommon.contentchanges_Remove ), Item.Data.Pos, Count, Item);
		Item.Class.Add_ContentChanges(ContentChanges);
		this.CollaborativeEditing.Add_NewDC(Item.Class);
	}
};
CHistory.prototype.private_IsContentChange = function(Class, Data)
{
	var bPresentation = !(typeof CPresentation === "undefined");
	var bSlide = !(typeof Slide === "undefined");
	if ( ( Class instanceof CDocument        && ( AscDFH.historyitem_Document_AddItem        === Data.Type || AscDFH.historyitem_Document_RemoveItem        === Data.Type ) ) ||
		(((Class instanceof CDocumentContent || Class instanceof AscFormat.CDrawingDocContent)) && ( AscDFH.historyitem_DocumentContent_AddItem === Data.Type || AscDFH.historyitem_DocumentContent_RemoveItem === Data.Type ) ) ||
		( Class instanceof CTable           && ( AscDFH.historyitem_Table_AddRow            === Data.Type || AscDFH.historyitem_Table_RemoveRow            === Data.Type ) ) ||
		( Class instanceof CTableRow        && ( AscDFH.historyitem_TableRow_AddCell        === Data.Type || AscDFH.historyitem_TableRow_RemoveCell        === Data.Type ) ) ||
		( Class instanceof Paragraph        && ( AscDFH.historyitem_Paragraph_AddItem       === Data.Type || AscDFH.historyitem_Paragraph_RemoveItem       === Data.Type ) ) ||
		( Class instanceof ParaHyperlink    && ( AscDFH.historyitem_Hyperlink_AddItem       === Data.Type || AscDFH.historyitem_Hyperlink_RemoveItem       === Data.Type ) ) ||
		( Class instanceof ParaRun          && ( AscDFH.historyitem_ParaRun_AddItem         === Data.Type || AscDFH.historyitem_ParaRun_RemoveItem         === Data.Type ) ) ||
		( bPresentation && Class instanceof CPresentation && (AscDFH.historyitem_Presentation_AddSlide === Data.Type || AscDFH.historyitem_Presentation_RemoveSlide === Data.Type)) ||
		( bSlide && Class instanceof Slide && (AscDFH.historyitem_SlideAddToSpTree === Data.Type || AscDFH.historyitem_SlideRemoveFromSpTree === Data.Type))
	)
		return true;

	return false;
};
CHistory.prototype.private_IsAddContentChange = function(Class, Data)
{
	var bPresentation = !(typeof CPresentation === "undefined");
	var bSlide = !(typeof Slide === "undefined");
	return ( ( Class instanceof CDocument        && AscDFH.historyitem_Document_AddItem        === Data.Type ) ||
		( ((Class instanceof CDocumentContent || Class instanceof AscFormat.CDrawingDocContent)) && AscDFH.historyitem_DocumentContent_AddItem === Data.Type ) ||
		( Class instanceof CTable           && AscDFH.historyitem_Table_AddRow            === Data.Type ) ||
		( Class instanceof CTableRow        && AscDFH.historyitem_TableRow_AddCell        === Data.Type ) ||
		( Class instanceof Paragraph        && AscDFH.historyitem_Paragraph_AddItem       === Data.Type ) ||
		( Class instanceof ParaHyperlink    && AscDFH.historyitem_Hyperlink_AddItem       === Data.Type ) ||
		( Class instanceof ParaRun          && AscDFH.historyitem_ParaRun_AddItem         === Data.Type ) ||
		( bPresentation && Class instanceof CPresentation && (AscDFH.historyitem_Presentation_AddSlide === Data.Type )) ||
		( bSlide && Class instanceof Slide && (AscDFH.historyitem_SlideAddToSpTree === Data.Type))
	) ? true : false;
};
CHistory.prototype.private_GetItemsCountInContentChange = function(Class, Data)
{
	if ( ( Class instanceof Paragraph ) ||  ( Class instanceof ParaHyperlink) || ( Class instanceof ParaRun ) ||
		( Class instanceof CDocument        && AscDFH.historyitem_Document_RemoveItem        === Data.Type ) ||
		( ((Class instanceof CDocumentContent || Class instanceof AscFormat.CDrawingDocContent)) && AscDFH.historyitem_DocumentContent_RemoveItem === Data.Type ) )
		return Data.Items.length;

	return 1;
};
CHistory.prototype.GetAllParagraphsForRecalcData = function(Props)
{
	if (!this.RecalculateData.AllParagraphs)
	{
		if (this.Document)
			this.RecalculateData.AllParagraphs = this.Document.Get_AllParagraphs({All : true});
		else
			this.RecalculateData.AllParagraphs = [];
	}

	var arrParagraphs = [];
	if (!Props || true === Props.All)
	{
		return this.RecalculateData.AllParagraphs;
	}
	else if (true === Props.Style)
	{
		var arrStylesId = Props.StylesId;
		for (var nParaIndex = 0, nParasCount = this.RecalculateData.AllParagraphs.length; nParaIndex < nParasCount; ++nParaIndex)
		{
			var oPara = this.RecalculateData.AllParagraphs[nParaIndex];
			for (var nStyleIndex = 0, nStylesCount = arrStylesId.length; nStyleIndex < nStylesCount; ++nStyleIndex)
			{
				if (oPara.Pr.PStyle === arrStylesId[nStyleIndex])
				{
					arrParagraphs.push(oPara);
					break;
				}
			}
		}
	}
	else if (true === Props.Numbering)
	{
		for (var nParaIndex = 0, nParasCount = this.RecalculateData.AllParagraphs.length; nParaIndex < nParasCount; ++nParaIndex)
		{
			var oPara = this.RecalculateData.AllParagraphs[nParaIndex];

			var NumPr  = Props.NumPr;
			var _NumPr = oPara.Numbering_Get();

			if (undefined != _NumPr && _NumPr.NumId === NumPr.NumId && (_NumPr.Lvl === NumPr.Lvl || undefined === NumPr.Lvl))
				arrParagraphs.push(oPara);
		}
	}
	return arrParagraphs;
};
CHistory.prototype.GetRecalculateIndex = function()
{
	return this.RecIndex;
};
CHistory.prototype.SetRecalculateIndex = function(nIndex)
{
	this.RecIndex = Math.min(this.Index, nIndex);
};

function CRC32()
{
    this.m_aTable = [];
    this.private_InitTable();
}
CRC32.prototype.private_InitTable = function()
{
    var CRC_POLY = 0xEDB88320;
    var nChar;
    for(var nIndex = 0; nIndex < 256; nIndex++)
    {
        nChar = nIndex;
        for(var nCounter = 0; nCounter < 8; nCounter++)
        {
            nChar = ((nChar & 1) ? ((nChar >>> 1) ^ CRC_POLY) : (nChar >>> 1));
        }
        this.m_aTable[nIndex] = nChar;
    }
};
CRC32.prototype.Calculate_ByString = function(sStr, nSize)
{
    var CRC_MASK = 0xD202EF8D;
    var nCRC = 0 ^ (-1);

    for (var nIndex = 0; nIndex < nSize; nIndex++)
    {
        nCRC = this.m_aTable[(nCRC ^ sStr.charCodeAt(nIndex)) & 0xFF] ^ (nCRC >>> 8);
        nCRC ^= CRC_MASK;
    }

    return (nCRC ^ (-1)) >>> 0;
};
CRC32.prototype.Calculate_ByByteArray = function(aArray, nSize)
{
    var CRC_MASK = 0xD202EF8D;
    var nCRC = 0 ^ (-1);

    for (var nIndex = 0; nIndex < nSize; nIndex++)
    {
        nCRC = (nCRC >>> 8) ^ this.m_aTable[(nCRC ^ aArray[nIndex]) & 0xFF];
        nCRC ^= CRC_MASK;
    }

    return (nCRC ^ (-1)) >>> 0;
};

var g_oCRC32 = new CRC32();

    //----------------------------------------------------------export--------------------------------------------------
    window['AscCommon'] = window['AscCommon'] || {};
    window['AscCommon'].CHistory = CHistory;
    window['AscCommon'].History = new CHistory();
})(window);
