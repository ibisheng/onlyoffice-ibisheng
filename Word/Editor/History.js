"use strict";

/**
 * User: Ilja.Kirillov
 * Date: 11.04.12
 * Time: 14:35
 */

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

    this.RecalculateData =
    {
        Inline : { Pos : -1, PageNum : 0 },
        Flow   : [],
        HdrFtr : [],
        Drawings:
        {
            All:      false,
            Map:      {},
            ThemeInfo: null
        }
    };

	this.TurnOffHistory = 0;
    this.MinorChanges   = false; // Данный параметр нужен, чтобы определить влияют ли добавленные изменения на пересчет

    this.BinaryWriter = new CMemory();

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
            var Class = g_oTableId;

            if (Point.Items.length > 0)
            {
                var FirstItem = Point.Items[0];
                if (FirstItem.Class === Class && historyitem_TableId_Description === FirstItem.Data.Type)
                    Point.Items.splice(0, 1);
            }

            var Data =
            {
                Type         : historyitem_TableId_Description,
                FileCheckSum : this.FileCheckSum,
                FileSize     : this.FileSize,
                Description  : Point.Description,
                ItemsCount   : Point.Items.length,
                PointIndex   : PointIndex,
                StartPoint   : StartPoint,
                LastPoint    : LastPoint,
                SumIndex     : SumIndex,
                DeletedIndex : DeletedIndex
            };

            var Binary_Pos = this.BinaryWriter.GetCurPosition();
            this.BinaryWriter.WriteString2(Class.Get_Id());
            Class.Save_Changes(Data, this.BinaryWriter);

            var Binary_Len = this.BinaryWriter.GetCurPosition() - Binary_Pos;

            var Item =
            {
                Class : Class,
                Data  : Data,
                Binary:
                {
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
            if(isRealNumber(nBottomIndex))
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
                oItem.Class.Undo(oItem.Data);
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
        {
            if (this.Api && this.CollaborativeEditing && true === this.CollaborativeEditing.Is_Fast() && true !== this.CollaborativeEditing.Is_SingleUser())
                this.Api.sync_TryUndoInFastCollaborative();

            return null;
        }

        // Запоминаем самое последнее состояние документа для Redo
        if ( this.Index === this.Points.length - 1 )
            this.LastState = this.Document.Get_SelectionState();
        
        this.Document.Selection_Remove();

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
                    Item.Class.Undo(Item.Data);
                    Item.Class.Refresh_RecalcData(Item.Data);
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
                Item.Class.Undo(Item.Data);
                Item.Class.Refresh_RecalcData(Item.Data);
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

        this.Document.Selection_Remove();
        
        var Point = this.Points[++this.Index];

        this.Internal_RecalcData_Clear();

        // Выполняем все действия в прямом порядке
        for ( var Index = 0; Index < Point.Items.length; Index++ )
        {
            var Item = Point.Items[Index];
            Item.Class.Redo( Item.Data );
            Item.Class.Refresh_RecalcData( Item.Data );
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
        if (RecalcData.Flow.length > 0 || RecalcData.HdrFtr.length > 0 || -1 !== RecalcData.Inline.Pos)
            return true;

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
    Add : function(Class, Data)
    {
		if (0 !== this.TurnOffHistory || this.Index < 0)
            return;

        // Заглушка на случай, если у нас во время создания одной точки в истории, после нескольких изменений идет
        // пересчет, потом снова добавляются изменения и снова запускается пересчет и т.д.
        if ( this.RecIndex >= this.Index )
            this.RecIndex = this.Index - 1;

        var Binary_Pos = this.BinaryWriter.GetCurPosition();

        this.BinaryWriter.WriteString2(Class.Get_Id());
        Class.Save_Changes( Data, this.BinaryWriter );

        var Binary_Len = this.BinaryWriter.GetCurPosition() - Binary_Pos;

        var Item =
        {
            Class : Class,
            Data  : Data,
            Binary:
            {
                Pos : Binary_Pos,
                Len : Binary_Len
            },
            
            NeedRecalc : !this.MinorChanges
        };

        this.Points[this.Index].Items.push( Item );

        if (!this.CollaborativeEditing)
            return;

        var bPresentation = !(typeof CPresentation === "undefined");
        var bSlide = !(typeof Slide === "undefined");
        if ( ( Class instanceof CDocument        && ( historyitem_Document_AddItem        === Data.Type || historyitem_Document_RemoveItem        === Data.Type ) ) ||
            ( Class instanceof CDocumentContent && ( historyitem_DocumentContent_AddItem === Data.Type || historyitem_DocumentContent_RemoveItem === Data.Type ) ) ||
            ( Class instanceof CTable           && ( historyitem_Table_AddRow            === Data.Type || historyitem_Table_RemoveRow            === Data.Type ) ) ||
            ( Class instanceof CTableRow        && ( historyitem_TableRow_AddCell        === Data.Type || historyitem_TableRow_RemoveCell        === Data.Type ) ) ||
            ( Class instanceof Paragraph        && ( historyitem_Paragraph_AddItem       === Data.Type || historyitem_Paragraph_RemoveItem       === Data.Type ) ) ||
            ( Class instanceof ParaHyperlink    && ( historyitem_Hyperlink_AddItem       === Data.Type || historyitem_Hyperlink_RemoveItem       === Data.Type ) ) ||
            ( Class instanceof ParaRun          && ( historyitem_ParaRun_AddItem         === Data.Type || historyitem_ParaRun_RemoveItem         === Data.Type ) ) ||
            ( bPresentation && Class instanceof CPresentation && (historyitem_Presentation_AddSlide === Data.Type || historyitem_Presentation_RemoveSlide === Data.Type)) ||
            ( bSlide && Class instanceof Slide && (historyitem_SlideAddToSpTree === Data.Type || historyitem_SlideRemoveFromSpTree === Data.Type))
            )
        {
            var bAdd = ( ( Class instanceof CDocument        && historyitem_Document_AddItem        === Data.Type ) ||
                ( Class instanceof CDocumentContent && historyitem_DocumentContent_AddItem === Data.Type ) ||
                ( Class instanceof CTable           && historyitem_Table_AddRow            === Data.Type ) ||
                ( Class instanceof CTableRow        && historyitem_TableRow_AddCell        === Data.Type ) ||
                ( Class instanceof Paragraph        && historyitem_Paragraph_AddItem       === Data.Type ) ||
                ( Class instanceof ParaHyperlink    && historyitem_Hyperlink_AddItem       === Data.Type ) ||
                ( Class instanceof ParaRun          && historyitem_ParaRun_AddItem         === Data.Type ) ||
                ( bPresentation && Class instanceof CPresentation && (historyitem_Presentation_AddSlide === Data.Type )) ||
                ( bSlide && Class instanceof Slide && (historyitem_SlideAddToSpTree === Data.Type))
                ) ? true : false;

            var Count = 1;

            if ( ( Class instanceof Paragraph ) ||  ( Class instanceof ParaHyperlink) || ( Class instanceof ParaRun ) ||
                ( Class instanceof CDocument        && historyitem_Document_RemoveItem        === Data.Type ) ||
                ( Class instanceof CDocumentContent && historyitem_DocumentContent_RemoveItem === Data.Type ) )
                Count = Data.Items.length;

            var ContentChanges = new CContentChangesElement( ( bAdd == true ? contentchanges_Add : contentchanges_Remove ), Data.Pos, Count, Item );
            Class.Add_ContentChanges( ContentChanges );
            this.CollaborativeEditing.Add_NewDC( Class );

            if (true === bAdd)
                this.CollaborativeEditing.Update_DocumentPositionsOnAdd(Class, Data.Pos);
            else
                this.CollaborativeEditing.Update_DocumentPositionsOnRemove(Class, Data.Pos, Count);
        }
        if(this.CollaborativeEditing.AddPosExtChanges && Class instanceof CXfrm)
        {
            if(historyitem_Xfrm_SetOffX  === Data.Type ||
                historyitem_Xfrm_SetOffY === Data.Type ||
                historyitem_Xfrm_SetExtX === Data.Type ||
                historyitem_Xfrm_SetExtY === Data.Type ||
                historyitem_Xfrm_SetChOffX === Data.Type ||
                historyitem_Xfrm_SetChOffY === Data.Type ||
                historyitem_Xfrm_SetChExtX === Data.Type ||
                historyitem_Xfrm_SetChExtY  === Data.Type)
            {
                this.CollaborativeEditing.AddPosExtChanges(Item,
                    historyitem_Xfrm_SetOffX  === Data.Type ||
                    historyitem_Xfrm_SetExtX === Data.Type ||
                        historyitem_Xfrm_SetChOffX === Data.Type ||
                        historyitem_Xfrm_SetChExtX === Data.Type );
            }
        }
    },

    Internal_RecalcData_Clear : function()
    {
        this.RecalculateData =
        {
            Inline : { Pos : -1, PageNum : 0 },
            Flow   : [],
            HdrFtr : [],
            Drawings:
            {
                All: false,
                Map: {},
                ThemeInfo: null
            },

            Tables : []
        };
    },

    RecalcData_Add : function(Data)
    {
        if ( "undefined" === typeof(Data) || null === Data )
            return;

        switch ( Data.Type )
        {
            case historyrecalctype_Flow:
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

            case historyrecalctype_HdrFtr:
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

            case historyrecalctype_Inline:
            {
                if ( (Data.Data.Pos < this.RecalculateData.Inline.Pos) || (Data.Data.Pos === this.RecalculateData.Inline.Pos && Data.Data.PageNum < this.RecalculateData.Inline.PageNum) || this.RecalculateData.Inline.Pos < 0 )
                {
                    this.RecalculateData.Inline.Pos     = Data.Data.Pos;
                    this.RecalculateData.Inline.PageNum = Data.Data.PageNum;
                }

                break;
            }
            case historyrecalctype_Drawing:
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
        }
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
            var Table = g_oTableId.Get_ById(TableId);
            if (null !== Table)
            {
                if (true === Table.Check_ChangedTableGrid())
                {
                    Table.Refresh_RecalcData2(0, 0);
                }
            }
        }
    },

    Check_UninonLastPoints : function()
    {
        // Не объединяем точки в истории, когда отключается пересчет.
        // TODO: Неправильно изменяется RecalcIndex
        if (true !== this.Document.Is_OnRecalculate())
            return;

        // Не объединяем точки истории, если на предыдущей точке произошло сохранение
        if (this.Points.length < 2
            || (true !== this.Is_UserSaveMode() && null !== this.SavedIndex && this.SavedIndex >= this.Points.length - 2)
            || (true === this.Is_UserSaveMode() && null !== this.UserSavedIndex && this.UserSavedIndex >= this.Points.length - 2))
            return;

        var Point1 = this.Points[this.Points.length - 2];
        var Point2 = this.Points[this.Points.length - 1];

        // Не объединяем слова больше 63 элементов
        if ( Point1.Items.length > 63 )
            return;

        var StartIndex1 = 0;
        var StartIndex2 = 0;
        if (Point1.Items.length > 0 && Point1.Items[0].Data && historyitem_TableId_Description === Point1.Items[0].Data.Type)
            StartIndex1 = 1;

        if (Point2.Items.length > 0 && Point2.Items[0].Data && historyitem_TableId_Description === Point2.Items[0].Data.Type)
            StartIndex2 = 1;

        var PrevItem = null;
        var Class = null;
        for ( var Index = StartIndex1; Index < Point1.Items.length; Index++ )
        {
            var Item = Point1.Items[Index];

            if ( null === Class )
                Class = Item.Class;
            else if ( Class != Item.Class || "undefined" === typeof(Class.Check_HistoryUninon) || false === Class.Check_HistoryUninon(PrevItem.Data, Item.Data) )
                return;

            PrevItem = Item;
        }

        for ( var Index = StartIndex2; Index < Point2.Items.length; Index++ )
        {
            var Item = Point2.Items[Index];

            if ( Class != Item.Class || "undefined" === typeof(Class.Check_HistoryUninon) || false === Class.Check_HistoryUninon(PrevItem.Data, Item.Data) )
                return;

            PrevItem = Item;
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
            Description: historydescription_Document_AddLetterUnion
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
      this.SavedIndex = this.Index;
      if (true === this.Is_UserSaveMode()) {
        if (true === IsUserSave) {
          this.UserSavedIndex = this.Index;
          this.ForceSave = false;
        }
      } else {
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

    Have_Changes : function(IsUserSave)
    {
      var checkIndex = (this.Is_UserSaveMode() && IsUserSave) ? this.UserSavedIndex : this.SavedIndex;
      if (-1 === this.Index && null === checkIndex && false === this.ForceSave)
        return false;

      if (this.Index != checkIndex || true === this.ForceSave)
        return true;

      return false;
    },

    Get_RecalcData : function()
    {
        if ( this.Index >= 0 )
        {
            this.Internal_RecalcData_Clear();

            for ( var Pos = this.RecIndex + 1; Pos <= this.Index; Pos++ )
            {
                // Считываем изменения, начиная с последней точки, и смотрим что надо пересчитать.
                var Point = this.Points[Pos];

                // Выполняем все действия в прямом порядке
                for ( var Index = 0; Index < Point.Items.length; Index++ )
                {
                    var Item = Point.Items[Index];

                    if ( true === Item.NeedRecalc )
                        Item.Class.Refresh_RecalcData( Item.Data );
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
    }
};

var History = null;

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