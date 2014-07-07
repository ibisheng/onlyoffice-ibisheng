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
    this.Points     = []; // Точки истории, в каждой хранится массив с изменениями после текущей точки
    this.Document   = Document;

    this.RecalculateData =
    {
        Inline : { Pos : -1, PageNum : 0 },
        Flow   : [],
        HdrFtr : [],
        Drawings:
        {
            All: false,
            Map: {}
        }
    };

    this.TurnOffHistory = false;
    this.MinorChanges   = false; // Данный параметр нужен, чтобы определить влияют ли добавленные изменения на пересчет

    this.BinaryWriter = new CMemory();
}

CHistory.prototype =
{
    Is_Clear : function()
    {
        if ( this.Points.length <= 0 )
            return true;

        return false;
    },

    Clear : function()
    {
        this.Index         = -1;
        this.SavedIndex    = null;
        this.ForceSave     = false;
        this.Points.length = 0;
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

    Undo : function()
    {
        this.Check_UninonLastPoints();

        // Проверяем можно ли сделать Undo
        if ( true != this.Can_Undo() )
            return null;

        // Запоминаем самое последнее состояние документа для Redo
        if ( this.Index === this.Points.length - 1 )
            this.LastState = this.Document.Get_SelectionState();
        
        this.Document.Selection_Remove();

        var Point = this.Points[this.Index--];

        this.Internal_RecalcData_Clear();

        // Откатываем все действия в обратном порядке (относительно их выполенения)
        for ( var Index = Point.Items.length - 1; Index >= 0; Index-- )
        {
            var Item = Point.Items[Index];
            Item.Class.Undo( Item.Data );
            Item.Class.Refresh_RecalcData( Item.Data );
        }

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

    Create_NewPoint : function()
    {
        if ( this.Index < this.SavedIndex && null !== this.SavedIndex )
        {
            this.SavedIndex = this.Index;
            this.ForceSave  = true;
        }

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
            Additional : {}     // Дополнительная информация
        };

        // Удаляем ненужные точки
        this.Points.length = this.Index + 1;
    },
    
    Remove_LastPoint : function()
    {
        this.Index--;
        this.Points.length = this.Index + 1;
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
        if ( true === this.TurnOffHistory )
            return;

        if ( this.Index < 0 )
            return;

        // Заглушка на случай, если у нас во время создания одной точки в истории, после нескольких изменений идет
        // пересчет, потом снова добавляются изменения и снова запускается пересчет и т.д.
        if ( this.RecIndex >= this.Index )
            this.RecIndex = this.Index - 1;

        var Binary_Pos = this.BinaryWriter.GetCurPosition();

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

        if ( ( Class instanceof CDocument        && ( historyitem_Document_AddItem        === Data.Type || historyitem_Document_RemoveItem        === Data.Type ) ) ||
            ( Class instanceof CDocumentContent && ( historyitem_DocumentContent_AddItem === Data.Type || historyitem_DocumentContent_RemoveItem === Data.Type ) ) ||
            ( Class instanceof CTable           && ( historyitem_Table_AddRow            === Data.Type || historyitem_Table_RemoveRow            === Data.Type ) ) ||
            ( Class instanceof CTableRow        && ( historyitem_TableRow_AddCell        === Data.Type || historyitem_TableRow_RemoveCell        === Data.Type ) ) ||
            ( Class instanceof Paragraph        && ( historyitem_Paragraph_AddItem       === Data.Type || historyitem_Paragraph_RemoveItem       === Data.Type ) ) ||
            ( Class instanceof ParaHyperlink    && ( historyitem_Hyperlink_AddItem       === Data.Type || historyitem_Hyperlink_RemoveItem       === Data.Type ) ) ||
            ( Class instanceof ParaRun          && ( historyitem_ParaRun_AddItem         === Data.Type || historyitem_ParaRun_RemoveItem         === Data.Type ) ) )
        {
            var bAdd = ( ( Class instanceof CDocument        && historyitem_Document_AddItem        === Data.Type ) ||
                ( Class instanceof CDocumentContent && historyitem_DocumentContent_AddItem === Data.Type ) ||
                ( Class instanceof CTable           && historyitem_Table_AddRow            === Data.Type ) ||
                ( Class instanceof CTableRow        && historyitem_TableRow_AddCell        === Data.Type ) ||
                ( Class instanceof Paragraph        && historyitem_Paragraph_AddItem       === Data.Type ) ||
                ( Class instanceof ParaHyperlink    && historyitem_Hyperlink_AddItem       === Data.Type ) ||
                ( Class instanceof ParaRun          && historyitem_ParaRun_AddItem         === Data.Type )
                ) ? true : false;

            var Count = 1;

            if ( ( Class instanceof Paragraph ) ||  ( Class instanceof ParaHyperlink) || ( Class instanceof ParaRun ) ||
                ( Class instanceof CDocument        && historyitem_Document_RemoveItem        === Data.Type ) ||
                ( Class instanceof CDocumentContent && historyitem_DocumentContent_RemoveItem === Data.Type ) )
                Count = Data.Items.length;

            var ContentChanges = new CContentChangesElement( ( bAdd == true ? contentchanges_Add : contentchanges_Remove ), Data.Pos, Count, Item );
            Class.Add_ContentChanges( ContentChanges );
            CollaborativeEditing.Add_NewDC( Class );
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
                Map: {}
            }
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
                if ( Data.Data.Pos < this.RecalculateData.Inline.Pos || this.RecalculateData.Inline.Pos < 0 )
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
                        this.RecalculateData.Drawings.Map[Data.Object.Get_Id()] = Data.Object;
                    }
                }
            }
        }
    },

    Check_UninonLastPoints : function()
    {
        // Не объединяем точки истории, если на предыдущей точке произошло сохранение
        if ( this.Points.length < 2 )
            return;

        var Point1 = this.Points[this.Points.length - 2];
        var Point2 = this.Points[this.Points.length - 1];

        // Не объединяем слова больше 63 элементов
        if ( Point1.Items.length > 63 )
            return;

        var PrevItem = null;
        var Class = null;
        for ( var Index = 0; Index < Point1.Items.length; Index++ )
        {
            var Item = Point1.Items[Index];

            if ( null === Class )
                Class = Item.Class;
            else if ( Class != Item.Class || "undefined" === typeof(Class.Check_HistoryUninon) || false === Class.Check_HistoryUninon(PrevItem.Data, Item.Data) )
                return;

            PrevItem = Item;
        }

        for ( var Index = 0; Index < Point2.Items.length; Index++ )
        {
            var Item = Point2.Items[Index];

            if ( Class != Item.Class || "undefined" === typeof(Class.Check_HistoryUninon) || false === Class.Check_HistoryUninon(PrevItem.Data, Item.Data) )
                return;

            PrevItem = Item;
        }

        var NewPoint =
        {
            State : Point1.State,
            Items : Point1.Items.concat(Point2.Items),
            Time  : Point1.Time,
            Additional : {}
        };

		if ( this.SavedIndex >= this.Points.length - 2 && null !== this.SavedIndex )
        {
			this.SavedIndex = this.Points.length - 3;
            this.ForceSave  = true;
        }

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
        this.TurnOffHistory = true;
    },

    TurnOn : function()
    {
        this.TurnOffHistory = false;
    },

    Is_On : function()
    {
        return ( false === this.TurnOffHistory ? true : false ) ;
    },

    Reset_SavedIndex : function()
    {
        this.SavedIndex = this.Index;
        this.ForceSave   = false;
    },

    Have_Changes : function()
    {
        if ( -1 === this.Index && null === this.SavedIndex && false === this.ForceSave )
            return false;
        
        if ( this.Index != this.SavedIndex || true === this.ForceSave )
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

        return this.RecalculateData;
    },

    Reset_RecalcIndex : function()
    {
        this.RecIndex = this.Index;
    },

    Is_SimpleChanges : function()
    {
        if ( this.Index >= 0 && this.Points[this.Index].Items.length > 0 )
        {
            // Считываем изменения, начиная с последней точки, и смотрим что надо пересчитать.
            var Point = this.Points[this.Index];

            var Class = Point.Items[0].Class;
            var Count = Point.Items.length;

            // Смотрим, чтобы класс, в котором произошли все изменения был один и тот же
            for ( var Index = 1; Index < Count; Index++ )
            {
                var Item = Point.Items[Index];

                if ( Class !== Item.Class )
                    return [];
            }

            if ( Class instanceof ParaRun && Class.Is_SimpleChanges(Point.Items) )
                return Point.Items;
        }

        return [];
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

        if ( true === editor.isMarkerFormat)
            editor.sync_MarkerFormatCallback(false);
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
    }

};

var History = null;
