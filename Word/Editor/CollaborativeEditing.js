"use strict";

/**
 * User: Ilja.Kirillov
 * Date: 25.07.12
 * Time: 12:01
 */

var g_oIdCounter = new CIdCounter();

function CTableId()
{
    this.m_aPairs   = {};
    this.m_bTurnOff = false;

    this.Add = function(Class, Id)
    {
        if ( false === this.m_bTurnOff )
        {
            Class.Id = Id;
            this.m_aPairs[Id] = Class;

            History.Add( this, { Type : historyitem_TableId_Add, Id : Id, Class : Class  } );
        }
    };

    this.Add( this, g_oIdCounter.Get_NewId() );

    this.TurnOff = function()
    {
        this.m_bTurnOff = true;
    };

    this.TurnOn = function()
    {
        this.m_bTurnOff = false;
    };

    // Получаем указатель на класс по Id
    this.Get_ById = function(Id)
    {
        if ( "" === Id )
            return null;

        if ( "undefined" != typeof(this.m_aPairs[Id]) )
            return this.m_aPairs[Id];

        return null;
    };

    // Получаем Id, по классу (вообще, данную функцию лучше не использовать)
    this.Get_ByClass = function(Class)
    {
        if ( "undefined" != typeof( Class.Get_Id ) )
            return Class.Get_Id();

        if ( "undefined" != typeof( Class.GetId() ) )
            return Class.GetId();

        return null;
    };

    this.Reset_Id = function(Class, Id_new, Id_old)
    {
        if ( Class === this.m_aPairs[Id_old] )
        {
            delete this.m_aPairs[Id_old];
            this.m_aPairs[Id_new] = Class;

            History.Add( this, { Type : historyitem_TableId_Reset, Id_new : Id_new, Id_old : Id_old  } );
        }
        else
        {
            this.Add( Class, Id_new );
        }
    };

    this.Get_Id = function()
    {
        return this.Id;
    };

    this.Clear = function()
    {
        this.m_aPairs   = {};
        this.m_bTurnOff = false;
        this.Add(this, g_oIdCounter.Get_NewId());
    };
//-----------------------------------------------------------------------------------
// Функции для работы с Undo/Redo
//-----------------------------------------------------------------------------------
    this.Undo = function(Data)
    {
        // Ничего не делаем (можно удалять/добавлять ссылки на классы в данном классе
        // но это не обяательно, т.к. Id всегда уникальные)
    };

    this.Redo = function(Redo)
    {
        // Ничего не делаем (можно удалять/добавлять ссылки на классы в данном классе
        // но это не обяательно, т.к. Id всегда уникальные)
    };

    this.Refresh_RecalcData = function(Data)
    {
        // Ничего не делаем, добавление/удаление классов не влияет на пересчет
    };
//-----------------------------------------------------------------------------------
// Функции для работы с совместным редактирования
//-----------------------------------------------------------------------------------
    this.Read_Class_FromBinary = function(Reader)
    {
        var ElementType = Reader.GetLong();
        var Element = null;

        // Временно отключаем регистрацию новых классов
        this.m_bTurnOff = true;

        switch( ElementType )
        {
            case historyitem_type_Paragraph                : Element = new Paragraph(); break;
            case historyitem_type_TextPr                   : Element = new ParaTextPr(); break;
            case historyitem_type_Hyperlink                : Element = new ParaHyperlink(); break;
            case historyitem_type_Drawing                  : Element = new ParaDrawing(); break;
            case historyitem_type_Table                    : Element = new CTable(); break;
            case historyitem_type_TableRow                 : Element = new CTableRow(); break;
            case historyitem_type_TableCell                : Element = new CTableCell(); break;
            case historyitem_type_DocumentContent          : Element = new CDocumentContent(); break;
            case historyitem_type_HdrFtr                   : Element = new CHeaderFooter(); break;
            case historyitem_type_AbstractNum              : Element = new CAbstractNum(); break;
            case historyitem_type_Comment                  : Element = new CComment(); break;
            case historyitem_type_Style                    : Element = new CStyle(); break;				
            case historyitem_type_CommentMark              : Element = new ParaComment(); break;
            case historyitem_type_ParaRun                  : Element = new ParaRun(); break;
            case historyitem_type_Section                  : Element = new CSectionPr(); break;
            case historyitem_type_Field                    : Element = new ParaField(); break;

            case historyitem_type_DefaultShapeDefinition   : Element = new DefaultShapeDefinition(); break;
            case historyitem_type_CNvPr                    : Element = new CNvPr(); break;
            case historyitem_type_NvPr                     : Element = new NvPr(); break;
            case historyitem_type_Ph                       : Element = new Ph(); break;
            case historyitem_type_UniNvPr                  : Element = new UniNvPr(); break;
            case historyitem_type_StyleRef                 : Element = new StyleRef(); break;
            case historyitem_type_FontRef                  : Element = new FontRef(); break;
            case historyitem_type_Chart                    : Element = new CChart(); break;
            case historyitem_type_ChartSpace               : Element = new CChartSpace(); break;
            case historyitem_type_Legend                   : Element = new CLegend(); break;
            case historyitem_type_Layout                   : Element = new CLayout(); break;
            case historyitem_type_LegendEntry              : Element = new CLegendEntry(); break;
            case historyitem_type_PivotFmt                 : Element = new CPivotFmt(); break;
            case historyitem_type_DLbl                     : Element = new CDLbl(); break;
            case historyitem_type_Marker                   : Element = new CMarker(); break;
            case historyitem_type_PlotArea                 : Element = new CPlotArea(); break;
            case historyitem_type_NumFmt                   : Element = new CNumFmt(); break;
            case historyitem_type_Scaling                  : Element = new CScaling(); break;
            case historyitem_type_DTable                   : Element = new CDTable(); break;
            case historyitem_type_LineChart                : Element = new CLineChart(); break;
            case historyitem_type_DLbls                    : Element = new CDLbls(); break;
            case historyitem_type_UpDownBars               : Element = new CUpDownBars(); break;
            case historyitem_type_BarChart                 : Element = new CBarChart(); break;
            case historyitem_type_BubbleChart              : Element = new CBubbleChart(); break;
            case historyitem_type_DoughnutChart            : Element = new CDoughnutChart(); break;
            case historyitem_type_OfPieChart               : Element = new COfPieChart(); break;
            case historyitem_type_PieChart                 : Element = new CPieChart(); break;
            case historyitem_type_RadarChart               : Element = new CRadarChart(); break;
            case historyitem_type_ScatterChart             : Element = new CScatterChart(); break;
            case historyitem_type_StockChart               : Element = new CStockChart(); break;
            case historyitem_type_SurfaceChart             : Element = new CSurfaceChart(); break;
            case historyitem_type_BandFmt                  : Element = new CBandFmt(); break;
            case historyitem_type_AreaChart                : Element = new CAreaChart(); break;
            case historyitem_type_ScatterSer               : Element = new CScatterSeries(); break;
            case historyitem_type_DPt                      : Element = new CDPt(); break;
            case historyitem_type_ErrBars                  : Element = new CErrBars(); break;
            case historyitem_type_MinusPlus                : Element = new CMinusPlus(); break;
            case historyitem_type_NumLit                   : Element = new CNumLit(); break;
            case historyitem_type_NumericPoint             : Element = new CNumericPoint(); break;
            case historyitem_type_NumRef                   : Element = new CNumRef(); break;
            case historyitem_type_TrendLine                : Element = new CTrendLine(); break;
            case historyitem_type_Tx                       : Element = new CTx(); break;
            case historyitem_type_StrRef                   : Element = new CStrRef(); break;
            case historyitem_type_StrCache                 : Element = new CStrCache(); break;
            case historyitem_type_StrPoint                 : Element = new CStringPoint(); break;
            case historyitem_type_XVal                     : Element = new CXVal(); break;
            case historyitem_type_MultiLvlStrRef           : Element = new CMultiLvlStrRef(); break;
            case historyitem_type_MultiLvlStrCache         : Element = new CMultiLvlStrCache(); break;
            case historyitem_type_StringLiteral            : Element = new CStringLiteral(); break;
            case historyitem_type_YVal                     : Element = new CYVal(); break;
            case historyitem_type_AreaSeries               : Element = new CAreaSeries(); break;
            case historyitem_type_Cat                      : Element = new CCat(); break;
            case historyitem_type_PictureOptions           : Element = new CPictureOptions(); break;
            case historyitem_type_RadarSeries              : Element = new CRadarSeries(); break;
            case historyitem_type_BarSeries                : Element = new CBarSeries(); break;
            case historyitem_type_LineSeries               : Element = new CLineSeries(); break;
            case historyitem_type_PieSeries                : Element = new CPieSeries(); break;
            case historyitem_type_SurfaceSeries            : Element = new CSurfaceSeries(); break;
            case historyitem_type_BubbleSeries             : Element = new CBubbleSeries(); break;
            case historyitem_type_ExternalData             : Element = new CExternalData(); break;
            case historyitem_type_PivotSource              : Element = new CPivotSource(); break;
            case historyitem_type_Protection               : Element = new CProtection(); break;
            case historyitem_type_ChartWall                : Element = new CChartWall(); break;
            case historyitem_type_View3d                   : Element = new CView3d(); break;
            case historyitem_type_ChartText                : Element = new CChartText(); break;
            case historyitem_type_ShapeStyle               : Element = new CShapeStyle(); break;
            case historyitem_type_Xfrm                     : Element = new CXfrm(); break;
            case historyitem_type_SpPr                     : Element = new CSpPr(); break;
            case historyitem_type_ClrScheme                : Element = new ClrScheme(); break;
            case historyitem_type_ClrMap                   : Element = new ClrMap(); break;
            case historyitem_type_ExtraClrScheme           : Element = new ExtraClrScheme(); break;
            case historyitem_type_FontCollection           : Element = new FontCollection(); break;
            case historyitem_type_FontScheme               : Element = new FontScheme(); break;
            case historyitem_type_FormatScheme             : Element = new FmtScheme(); break;
            case historyitem_type_ThemeElements            : Element = new ThemeElements(); break;
            case historyitem_type_HF                       : Element = new HF(); break;
            case historyitem_type_BgPr                     : Element = new CBgPr(); break;
            case historyitem_type_Bg                       : Element = new CBg(); break;
            case historyitem_type_PrintSettings            : Element = new CPrintSettings(); break;
            case historyitem_type_HeaderFooterChart        : Element = new CHeaderFooterChart(); break;
            case historyitem_type_PageMarginsChart         : Element = new CPageMarginsChart(); break;
            case historyitem_type_PageSetup                : Element = new CPageSetup(); break;
            case historyitem_type_Shape                    : Element = new CShape(); break;
            case historyitem_type_DispUnits                : Element = new CDispUnits(); break;
            case historyitem_type_GroupShape               : Element = new CGroupShape(); break;
            case historyitem_type_ImageShape               : Element = new CImageShape(); break;
            case historyitem_type_Geometry                 : Element = new Geometry(); break;
            case historyitem_type_Path                     : Element = new Path(); break;
            case historyitem_type_TextBody                 : Element = new CTextBody(); break;
            case historyitem_type_CatAx                    : Element = new CCatAx(); break;
            case historyitem_type_ValAx                    : Element = new CValAx(); break;
            case historyitem_type_WrapPolygon              : Element = new CWrapPolygon(); break;
            case historyitem_type_DateAx                   : Element = new CDateAx(); break;
            case historyitem_type_SerAx                    : Element = new CSerAx(); break;
            case historyitem_type_Title                    : Element = new CTitle(); break;

            case historyitem_type_Math						: Element = new ParaMath(false); break;
			case historyitem_type_MathContent				: Element = new CMathContent(); break;			
			case historyitem_type_acc						: Element = new CAccent(); break;
			case historyitem_type_bar						: Element = new CBar(); break;
			case historyitem_type_box						: Element = new CBox(); break;
			case historyitem_type_borderBox					: Element = new CBorderBox(); break;
			case historyitem_type_delimiter					: Element = new CDelimiter(); break;
			case historyitem_type_eqArr						: Element = new CEqArray(); break;
			case historyitem_type_frac                      : Element = new CFraction(); break;
			case historyitem_type_mathFunc					: Element = new CMathFunc(); break;
			case historyitem_type_groupChr					: Element = new CGroupCharacter(); break;															 
			case historyitem_type_lim						: Element = new CLimit(); break;
			case historyitem_type_matrix					: Element = new CMathMatrix(); break;
			case historyitem_type_nary						: Element = new CNary(); break;	
			case historyitem_type_phant						: Element = new CPhantom(); break;
			case historyitem_type_rad						: Element = new CRadical(); break;
			case historyitem_type_deg_subsup				: Element = new CDegreeSubSup(); break;
			case historyitem_type_deg						: Element = new CDegree(); break;
        }
        
        if ( null !== Element )
            Element.Read_FromBinary2(Reader);

        // Включаем назад регистрацию новых классов
        this.m_bTurnOff = false;

        return Element;
    };

    this.Save_Changes = function(Data, Writer)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        Writer.WriteLong( historyitem_type_TableId );

        var Type = Data.Type;

        // Пишем тип
        Writer.WriteLong( Type );
        switch ( Type )
        {
            case historyitem_TableId_Add :
            {
                // String   : Id элемента
                // Varibale : сам элемент

                Writer.WriteString2( Data.Id );
                Data.Class.Write_ToBinary2( Writer );

                break;
            }

            case historyitem_TableId_Reset:
            {
                // String : Id_new
                // String : Id_old

                Writer.WriteString2( Data.Id_new );
                Writer.WriteString2( Data.Id_old );

                break;
            }

            case historyitem_TableId_Description:
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

                Writer.WriteLong(Data.FileCheckSum);
                Writer.WriteLong(Data.FileSize);
                Writer.WriteLong(Data.Description);
                Writer.WriteLong(Data.ItemsCount);
                Writer.WriteLong(Data.PointIndex);
                Writer.WriteLong(Data.StartPoint);
                Writer.WriteLong(Data.LastPoint);
                Writer.WriteLong(Data.SumIndex);
                Writer.WriteLong(null === Data.DeletedIndex ? -10 : Data.DeletedIndex);
                Writer.WriteString2("@@Version.@@Build.@@Rev");

                break;
            }
        }
    };

    this.Save_Changes2 = function(Data, Writer)
    {
        return false;
    };

    this.Load_Changes = function(Reader, Reader2)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        var ClassType = Reader.GetLong();
        if ( historyitem_type_TableId != ClassType )
            return;

        var Type = Reader.GetLong();

        switch ( Type )
        {
            case historyitem_TableId_Add:
            {
                // String   : Id элемента
                // Varibale : сам элемент

                var Id    = Reader.GetString2();
                var Class = this.Read_Class_FromBinary( Reader );

                this.m_aPairs[Id] = Class;

                break;
            }

            case historyitem_TableId_Reset:
            {
                // String : Id_new
                // String : Id_old

                var Id_new = Reader.GetString2();
                var Id_old = Reader.GetString2();

                if ( "undefined" != this.m_aPairs[Id_old] )
                {
                    var Class = this.m_aPairs[Id_old];
                    delete this.m_aPairs[Id_old];
                    this.m_aPairs[Id_new] = Class;
                }

                break;
            }

            case historyitem_TableId_Description:
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

                var FileCheckSum = Reader.GetLong();
                var FileSize     = Reader.GetLong();
                var Description  = Reader.GetLong();
                var ItemsCount   = Reader.GetLong();
                var PointIndex   = Reader.GetLong();
                var StartPoint   = Reader.GetLong();
                var LastPoint    = Reader.GetLong();
                var SumIndex     = Reader.GetLong();
                var DeletedIndex = Reader.GetLong();
                var VersionString= Reader.GetString2();

//                // CollaborativeEditing LOG
//                console.log("ItemsCount2  " + CollaborativeEditing.m_nErrorLog_PointChangesCount);
//                if (CollaborativeEditing.m_nErrorLog_PointChangesCount !== CollaborativeEditing.m_nErrorLog_SavedPCC)
//                    console.log("========================= BAD Changes Count in Point =============================");
//
//                if (CollaborativeEditing.m_nErrorLog_CurPointIndex + 1 !== PointIndex && 0 !== PointIndex)
//                    console.log("========================= BAD Point index ========================================");
//
//                var bBadSumIndex = false;
//                if (0 === PointIndex)
//                {
//                    CollaborativeEditing.m_nErrorLog_SumIndex = 0;
//                }
//                else
//                {
//                    CollaborativeEditing.m_nErrorLog_SumIndex += CollaborativeEditing.m_nErrorLog_SavedPCC + 1; // Потому что мы не учитываем данное изменение
//                    if (PointIndex === StartPoint)
//                    {
//                        if (CollaborativeEditing.m_nErrorLog_SumIndex !== SumIndex)
//                            bBadSumIndex = true;
//
//                        console.log("SumIndex2    " + CollaborativeEditing.m_nErrorLog_SumIndex);
//                        CollaborativeEditing.m_nErrorLog_SumIndex = SumIndex;
//                    }
//                }
//
//                console.log("----------------------------");
//                console.log("FileCheckSum " + FileCheckSum);
//                console.log("FileSize     " + FileSize);
//                console.log("Description  " + Description + " " + Get_HistoryPointStringDescription(Description));
//                console.log("PointIndex   " + PointIndex);
//                console.log("StartPoint   " + StartPoint);
//                console.log("LastPoint    " + LastPoint);
//                console.log("ItemsCount   " + ItemsCount);
//                console.log("SumIndex     " + SumIndex);
//                console.log("DeletedIndex " + (-10 === DeletedIndex ? null : DeletedIndex));
//
//                // -1 Чтобы не учитывалось данное изменение
//                CollaborativeEditing.m_nErrorLog_SavedPCC          = ItemsCount;
//                CollaborativeEditing.m_nErrorLog_PointChangesCount = -1;
//                CollaborativeEditing.m_nErrorLog_CurPointIndex     = PointIndex;
//
//                if (bBadSumIndex)
//                    console.log("========================= BAD Sum index ==========================================");

                break;
            }
        }

        return true;
    };

    this.Unlock = function(Data)
    {
        // Ничего не делаем
    };
}

var g_oTableId = null;

function CCollaborativeChanges()
{
    this.m_pData         = null;
    this.m_oColor        = null;

    this.Set_Data = function(pData)
    {
        this.m_pData = pData;
    };
    
    this.Set_Color = function(oColor)
    {
        this.m_oColor = oColor;
    };

    this.Set_FromUndoRedo = function(Class, Data, Binary)
    {
        if ( "undefined" === typeof(Class.Get_Id) )
            return false;

        // Преобразуем данные в бинарный файл
        this.m_pData  = this.Internal_Save_Data( Class, Data, Binary );

        return true;
    };

    this.Apply_Data = function()
    {
        var LoadData  = this.Internal_Load_Data(this.m_pData);
        var ClassId   = LoadData.Reader.GetString2();
        var ReaderPos = LoadData.Reader.GetCurPos();
        var Type      = LoadData.Reader.GetLong();
        var Class     = null;

        if (historyitem_type_HdrFtr === Type)
            Class = editor.WordControl.m_oLogicDocument.HdrFtr;
        else
            Class = g_oTableId.Get_ById(ClassId);

        LoadData.Reader.Seek2(ReaderPos);

        if (null != Class)
            return Class.Load_Changes(LoadData.Reader, LoadData.Reader2, this.m_oColor);
        else
            return false;
    };

    this.Internal_Load_Data = function(szSrc)
    {
        var srcLen = szSrc.length;
        var index =  -1;

        while (true)
        {
            index++;
            var _c = szSrc.charCodeAt(index);
            if (_c == ";".charCodeAt(0))
            {
                index++;
                break;
            }
        }

        var bPost = false;
        // Ищем следующее вхождение ";"
        while (index < srcLen)
        {
            index++;
            var _c = szSrc.charCodeAt(index);
            if (_c == ";".charCodeAt(0))
            {
                index++;
                bPost = true;
                break;
            }
        }

        if ( true === bPost )
            return { Reader : this.Internal_Load_Data2(szSrc, 0, index - 1), Reader2 : this.Internal_Load_Data2(szSrc, index, srcLen ) };
        else
            return { Reader : this.Internal_Load_Data2(szSrc, 0, szSrc.length), Reader2 : null };
    };

    this.Internal_Load_Data2 = function(szSrc, offset, srcLen)
    {
        var nWritten = 0;

        var index =  -1 + offset;
        var dst_len = "";

        while (true)
        {
            index++;
            var _c = szSrc.charCodeAt(index);
            if (_c == ";".charCodeAt(0))
            {
                index++;
                break;
            }

            dst_len += String.fromCharCode(_c);
        }

        var dstLen = parseInt(dst_len);

        var pointer = g_memory.Alloc(dstLen);
        var stream = new FT_Stream2(pointer.data, dstLen);
        stream.obj = pointer.obj;

        var dstPx = stream.data;

        if (window.chrome)
        {
            while (index < srcLen)
            {
                var dwCurr = 0;
                var i;
                var nBits = 0;
                for (i=0; i<4; i++)
                {
                    if (index >= srcLen)
                        break;
                    var nCh = DecodeBase64Char(szSrc.charCodeAt(index++));
                    if (nCh == -1)
                    {
                        i--;
                        continue;
                    }
                    dwCurr <<= 6;
                    dwCurr |= nCh;
                    nBits += 6;
                }

                dwCurr <<= 24-nBits;
                for (i=0; i<nBits/8; i++)
                {
                    dstPx[nWritten++] = ((dwCurr & 0x00ff0000) >>> 16);
                    dwCurr <<= 8;
                }
            }
        }
        else
        {
            var p = b64_decode;
            while (index < srcLen)
            {
                var dwCurr = 0;
                var i;
                var nBits = 0;
                for (i=0; i<4; i++)
                {
                    if (index >= srcLen)
                        break;
                    var nCh = p[szSrc.charCodeAt(index++)];
                    if (nCh == undefined)
                    {
                        i--;
                        continue;
                    }
                    dwCurr <<= 6;
                    dwCurr |= nCh;
                    nBits += 6;
                }

                dwCurr <<= 24-nBits;
                for (i=0; i<nBits/8; i++)
                {
                    dstPx[nWritten++] = ((dwCurr & 0x00ff0000) >>> 16);
                    dwCurr <<= 8;
                }
            }
        }

        return stream;
    };

    this.Internal_Save_Data = function(Class, Data, Binary)
    {
        var Writer = History.BinaryWriter;
        var Pos = Binary.Pos
        var Len = Binary.Len;

        if ( "undefined" != typeof(Class.Save_Changes2) )
        {
            var Writer2 = CollaborativeEditing.m_oMemory;
            Writer2.Seek(0);
            if ( true === Class.Save_Changes2( Data, Writer2 ) )
                return Len + ";" + Writer.GetBase64Memory2(Pos, Len) + ";" + Writer2.GetCurPosition() + ";" + Writer2.GetBase64Memory();
        }

        return Len + ";" + Writer.GetBase64Memory2(Pos, Len);
    };
}

function CCollaborativeEditing()
{
    this.m_nUseType     = 1;  // 1 - 1 клиент и мы сохраняем историю, -1 - несколько клиентов, 0 - переход из -1 в 1

    this.m_aUsers       = []; // Список текущих пользователей, редактирующих данный документ
    this.m_aChanges     = []; // Массив с изменениями других пользователей
    this.m_aNeedUnlock  = []; // Массив со списком залоченных объектов(которые были залочены другими пользователями)
    this.m_aNeedUnlock2 = []; // Массив со списком залоченных объектов(которые были залочены на данном клиенте)
    this.m_aNeedLock    = []; // Массив со списком залоченных объектов(которые были залочены, но еще не были добавлены на данном клиенте)

    this.m_aLinkData    = []; // Массив, указателей, которые нам надо выставить при загрузке чужих изменений
    this.m_aEndActions  = []; // Массив действий, которые надо выполнить после принятия чужих изменений

    this.m_bGlobalLock  = false;         // Запрещаем производить любые "редактирующие" действия (т.е. то, что в историю запишется)
    this.m_bGlobalLockSelection = false; // Запрещаем изменять селект и курсор
    this.m_aCheckLocks  = [];    // Массив для проверки залоченности объектов, которые мы собираемся изменять

    this.m_aNewObjects  = []; // Массив со списком чужих новых объектов
    this.m_aNewImages   = []; // Массив со списком картинок, которые нужно будет загрузить на сервере

    this.m_aDC          = {}; // Массив(ассоциативный) классов DocumentContent

    this.m_aChangedClasses = {}; // Массив(ассоциативный) классов, в которых есть изменения выделенные цветом

    this.m_oMemory      = new CMemory(); // Глобальные класс для сохранения

//    // CollaborativeEditing LOG
//    this.m_nErrorLog_PointChangesCount = 0;
//    this.m_nErrorLog_SavedPCC          = 0;
//    this.m_nErrorLog_CurPointIndex     = -1;
//    this.m_nErrorLog_SumIndex          = 0;

    var oThis = this;

    this.Is_SingleUser = function()
    {
        if (1 === this.m_nUseType)
            return true;

        return false;
    };

    this.Start_CollaborationEditing = function()
    {
        this.m_nUseType = -1;
    };
    
    this.End_CollaborationEditing = function()
    {
        if ( this.m_nUseType <= 0 ) 
            this.m_nUseType = 0;
    };

    this.Add_User = function(UserId)
    {
        if ( -1 === this.Find_User(UserId) )
            this.m_aUsers.push( UserId );
    };

    this.Find_User = function(UserId)
    {
        var Len = this.m_aUsers.length;
        for ( var Index = 0; Index < Len; Index++ )
        {
            if ( this.m_aUsers[Index] === UserId )
                return Index;
        }

        return -1;
    };

    this.Remove_User = function(UserId)
    {
        var Pos = this.Find_User( UserId );
        if ( -1 != Pos )
            this.m_aUsers.splice( Pos, 1 );
    };

    this.Add_Changes = function(Changes)
    {
        this.m_aChanges.push( Changes );
    };

    this.Add_Unlock = function(LockClass)
    {
        this.m_aNeedUnlock.push( LockClass );
    };

    this.Add_Unlock2 = function(Lock)
    {
        this.m_aNeedUnlock2.push( Lock );
		editor._onUpdateDocumentCanSave();
    };

    this.Apply_OtherChanges = function()
    {
        // Чтобы заново созданные параграфы не отображались залоченными
        g_oIdCounter.Set_Load( true );

        // Применяем изменения, пока они есть
        var _count = this.m_aChanges.length;
		for (var i = 0; i < _count; i++)
        {
            if (window["NATIVE_EDITOR_ENJINE"] === true && window["native"]["CheckNextChange"])
            {
                if (!window["native"]["CheckNextChange"]())
                    break;
            }
        
            var Changes = this.m_aChanges[i];
            Changes.Apply_Data();
//            // CollaborativeEditing LOG
//            this.m_nErrorLog_PointChangesCount++;
        }
		
		this.m_aChanges = [];

        // У новых элементов выставляем указатели на другие классы
        this.Apply_LinkData();

        // Делаем проверки корректности новых изменений
        this.Check_MergeData();

        this.OnEnd_ReadForeignChanges();

        g_oIdCounter.Set_Load( false );
    };

    this.Get_SelfChanges = function()
    {
        // Генерируем свои изменения
        var aChanges = [];
        var PointsCount = History.Points.length;
        for ( var PointIndex = 0; PointIndex < PointsCount; PointIndex++ )
        {
            var Point = History.Points[PointIndex];
            var LastPoint = Point.Items.length;

            for ( var Index = 0; Index < LastPoint; Index++ )
            {
                var Item = Point.Items[Index];
                var oChanges = new CCollaborativeChanges();
                oChanges.Set_FromUndoRedo( Item.Class, Item.Data, Item.Binary );
                // Изменения могут обрабатываться другим кодом, поэтому здесь
                // явно указываются имена свойств, что бы избежать их последующей
                // минимизации.
                aChanges.push( {"id": oChanges.m_sId, "data": oChanges.m_pData} );
            }
        }
        return aChanges;
    };

    this.Apply_Changes = function()
    {
        var OtherChanges = ( this.m_aChanges.length > 0 ? true : false );

        // Если нет чужих изменений, тогда и делать ничего не надо
        if ( true === OtherChanges )
        {
            editor.WordControl.m_oLogicDocument.Stop_Recalculate();
            editor.WordControl.m_oLogicDocument.EndPreview_MailMergeResult();

            editor.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.ApplyChanges);

            var LogicDocument = editor.WordControl.m_oLogicDocument;
            var DocState = LogicDocument.Get_SelectionState2();

            this.Clear_NewImages();

            this.Apply_OtherChanges();

            // После того как мы приняли чужие изменения, мы должны залочить новые объекты, которые были залочены
            this.Lock_NeedLock();

            LogicDocument.Set_SelectionState2( DocState );
            this.OnStart_Load_Objects();
        }
    };    
    
    this.Send_Changes = function()
    {
        // Пересчитываем позиции
        this.Refresh_DCChanges();

        // Генерируем свои изменения
        var StartPoint = ( null === History.SavedIndex ? 0 : History.SavedIndex + 1 );
        var LastPoint  = -1;
        
        if ( this.m_nUseType <= 0 )
        {
            // (ненужные точки предварительно удаляем)
            History.Clear_Redo();
            LastPoint = History.Points.length - 1;
        }
        else
        {
            LastPoint = History.Index;
        }

        // Просчитаем сколько изменений на сервер пересылать не надо
        var SumIndex = 0;
        var StartPoint2 = Math.min( StartPoint, LastPoint + 1 );
        for ( var PointIndex = 0; PointIndex < StartPoint2; PointIndex++ )
        {
            var Point = History.Points[PointIndex];
            SumIndex += Point.Items.length;
        }
        var deleteIndex = ( null === History.SavedIndex ? null : SumIndex );

        var aChanges = [];
        for ( var PointIndex = StartPoint; PointIndex <= LastPoint; PointIndex++ )
        {
            var Point = History.Points[PointIndex];
            History.Update_PointInfoItem(PointIndex, StartPoint, LastPoint, SumIndex, deleteIndex);

            for ( var Index = 0; Index < Point.Items.length; Index++ )
            {
                var Item = Point.Items[Index];
                var oChanges = new CCollaborativeChanges();
                oChanges.Set_FromUndoRedo( Item.Class, Item.Data, Item.Binary );
                aChanges.push(oChanges.m_pData);
            }
        }

        this.Release_Locks();

        var UnlockCount2 = this.m_aNeedUnlock2.length;
        for ( var Index = 0; Index < UnlockCount2; Index++ )
        {
            var Class = this.m_aNeedUnlock2[Index];
            Class.Lock.Set_Type( locktype_None, false);
            editor.CoAuthoringApi.releaseLocks( Class.Get_Id() );
        }

        this.m_aNeedUnlock.length  = 0;
        this.m_aNeedUnlock2.length = 0;

		var deleteIndex = ( null === History.SavedIndex ? null : SumIndex );
		if (0 < aChanges.length || null !== deleteIndex)
        	editor.CoAuthoringApi.saveChanges(aChanges, deleteIndex);
		else
			editor.CoAuthoringApi.unLockDocument(true);

        if ( -1 === this.m_nUseType )
        {
            // Чистим Undo/Redo только во время совместного редактирования
            History.Clear();
            History.SavedIndex = null;                        
        }
        else if ( 0 === this.m_nUseType )
        {
            // Чистим Undo/Redo только во время совместного редактирования
            History.Clear();
            History.SavedIndex = null;
            
            this.m_nUseType = 1;
        }
        else
        {
            // Обновляем точку последнего сохранения в истории
            History.Reset_SavedIndex();
        }

        // Обновляем интерфейс        
        editor.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
        editor.WordControl.m_oLogicDocument.Document_UpdateUndoRedoState();

        // Перерисовываем документ (для обновления локов)
        editor.WordControl.m_oLogicDocument.DrawingDocument.ClearCachePages();
        editor.WordControl.m_oLogicDocument.DrawingDocument.FirePaint();
    };

    this.Release_Locks = function()
    {
        var UnlockCount = this.m_aNeedUnlock.length;
        for ( var Index = 0; Index < UnlockCount; Index++ )
        {
            var CurLockType = this.m_aNeedUnlock[Index].Lock.Get_Type();
            if  ( locktype_Other3 != CurLockType && locktype_Other != CurLockType )
            {
                this.m_aNeedUnlock[Index].Lock.Set_Type( locktype_None, false);

                if ( this.m_aNeedUnlock[Index] instanceof CHeaderFooterController )
                    editor.sync_UnLockHeaderFooters();
                else if ( this.m_aNeedUnlock[Index] instanceof CDocument )
                    editor.sync_UnLockDocumentProps();
                else if ( this.m_aNeedUnlock[Index] instanceof CComment )
                    editor.sync_UnLockComment( this.m_aNeedUnlock[Index].Get_Id() );
                else if ( this.m_aNeedUnlock[Index] instanceof CGraphicObjects )
                    editor.sync_UnLockDocumentSchema();
            }
            else if ( locktype_Other3 === CurLockType )
            {
                this.m_aNeedUnlock[Index].Lock.Set_Type( locktype_Other, false);
            }
        }
    };

    this.OnStart_Load_Objects = function()
    {
        oThis.m_bGlobalLock = true;
        oThis.m_bGlobalLockSelection = true;

        // Вызываем функцию для загрузки необходимых элементов (новые картинки и шрифты)
        editor.pre_Save(oThis.m_aNewImages);
    };

    this.OnEnd_Load_Objects = function()
    {
        // Данная функция вызывается, когда загрузились внешние объекты (картинки и шрифты)

        // Снимаем лок
        oThis.m_bGlobalLock = false;
        oThis.m_bGlobalLockSelection = false;

        // Запускаем полный пересчет документа
        var LogicDocument = editor.WordControl.m_oLogicDocument;

        var RecalculateData =
        {
            Inline : { Pos : 0, PageNum : 0 },
            Flow   : [],
            HdrFtr : [],
            Drawings: {
                All: true,
                Map:{}
            }
        };        

        LogicDocument.Reset_RecalculateCache();

        LogicDocument.Recalculate( false, false, RecalculateData );
        LogicDocument.Document_UpdateSelectionState();
        LogicDocument.Document_UpdateInterfaceState();
        
		editor.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.ApplyChanges);
    };
//-----------------------------------------------------------------------------------
// Функции для работы с ссылками, у новых объектов
//-----------------------------------------------------------------------------------
    this.Clear_LinkData = function()
    {
        this.m_aLinkData.length = 0;
    };

    this.Add_LinkData = function(Class, LinkData)
    {
        this.m_aLinkData.push( { Class : Class, LinkData : LinkData } );
    };

    this.Apply_LinkData = function()
    {
        var Count = this.m_aLinkData.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Item = this.m_aLinkData[Index];
            Item.Class.Load_LinkData( Item.LinkData );
        }

        this.Clear_LinkData();
    };
//-----------------------------------------------------------------------------------
// Функции для проверки корректности новых изменений
//-----------------------------------------------------------------------------------
    this.Check_MergeData = function()
    {
        var LogicDocument = editor.WordControl.m_oLogicDocument;
        LogicDocument.Comments.Check_MergeData();
    };
//-----------------------------------------------------------------------------------
// Функции для проверки залоченности объектов
//-----------------------------------------------------------------------------------
    this.Get_GlobalLock = function()
    {
        return this.m_bGlobalLock;
    };

    this.OnStart_CheckLock = function()
    {
        this.m_aCheckLocks.length = 0;
    };

    this.Add_CheckLock = function(oItem)
    {
        this.m_aCheckLocks.push( oItem );
    };

    this.OnEnd_CheckLock = function()
    {
        var aIds = [];

        var Count = this.m_aCheckLocks.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var oItem = this.m_aCheckLocks[Index];

            if ( true === oItem ) // сравниваем по значению и типу обязательно
                return true;
            else if ( false !== oItem )
                aIds.push( oItem );
        }

        if ( aIds.length > 0 )
        {
            // Отправляем запрос на сервер со списком Id
            editor.CoAuthoringApi.askLock( aIds, this.OnCallback_AskLock );

            // Ставим глобальный лок, только во время совместного редактирования
            if ( -1 === this.m_nUseType )
                this.m_bGlobalLock = true;
            else
            {
                // Пробегаемся по массиву и проставляем, что залочено нами
                var Count = this.m_aCheckLocks.length;
                for ( var Index = 0; Index < Count; Index++ )
                {
                    var oItem = this.m_aCheckLocks[Index];

                    if ( true !== oItem && false !== oItem ) // сравниваем по значению и типу обязательно
                    {
                        var Class = g_oTableId.Get_ById( oItem );
                        if ( null != Class )
                        {
                            Class.Lock.Set_Type( locktype_Mine, false );
                            this.Add_Unlock2( Class );
                        }
                    }
                }

                this.m_aCheckLocks.length = 0;
            }
        }

        return false;
    };

    this.OnCallback_AskLock = function(result)
    {
        if (true === oThis.m_bGlobalLock)
        {
            if (false == editor.asc_CheckLongActionCallback(oThis.OnCallback_AskLock, result))
                return;

            // Снимаем глобальный лок
            oThis.m_bGlobalLock = false;

            if (result["lock"])
            {
                // Пробегаемся по массиву и проставляем, что залочено нами

                var Count = oThis.m_aCheckLocks.length;
                for ( var Index = 0; Index < Count; Index++ )
                {
                    var oItem = oThis.m_aCheckLocks[Index];

                    if ( true !== oItem && false !== oItem ) // сравниваем по значению и типу обязательно
                    {
                        var Class = g_oTableId.Get_ById( oItem );
                        if ( null != Class )
                        {
                            Class.Lock.Set_Type( locktype_Mine );
                            oThis.Add_Unlock2( Class );
                        }
                    }
                }
            }
            else if (result["error"])
            {
                // Если у нас началось редактирование диаграммы, а вернулось, что ее редактировать нельзя,
                // посылаем сообщение о закрытии редактора диаграмм.
                if ( true === editor.isChartEditor )
                    editor.sync_closeChartEditor();

                // Делаем откат на 1 шаг назад и удаляем из Undo/Redo эту последнюю точку
                editor.WordControl.m_oLogicDocument.Document_Undo();
                History.Clear_Redo();
            }

            editor.isChartEditor = false;
        }
    };
//-----------------------------------------------------------------------------------
// Функции для работы с залоченными объектами, которые еще не были добавлены
//-----------------------------------------------------------------------------------
    this.Reset_NeedLock = function()
    {
        this.m_aNeedLock = {};
    };

    this.Add_NeedLock = function(Id, sUser)
    {
        this.m_aNeedLock[Id] = sUser;
    };

    this.Remove_NeedLock = function(Id)
    {
        delete this.m_aNeedLock[Id];
    };

    this.Lock_NeedLock = function()
    {
        for ( var Id in this.m_aNeedLock )
        {
            var Class = g_oTableId.Get_ById( Id );

            if ( null != Class )
            {
                var Lock = Class.Lock;
                Lock.Set_Type( locktype_Other, false );
                Lock.Set_UserId( this.m_aNeedLock[Id] );
            }
        }

        this.Reset_NeedLock();
    };
//-----------------------------------------------------------------------------------
// Функции для работы с новыми объектами, созданными на других клиентах
//-----------------------------------------------------------------------------------
    this.Clear_NewObjects = function()
    {
        this.m_aNewObjects.length = 0;
    };

    this.Add_NewObject = function(Class)
    {
        this.m_aNewObjects.push( Class );
        Class.FromBinary = true;
    };

    this.Clear_EndActions = function()
    {
        this.m_aEndActions.length = 0;
    };

    this.Add_EndActions = function(Class, Data)
    {
        this.m_aEndActions.push({Class : Class, Data : Data});
    };

    this.OnEnd_ReadForeignChanges = function()
    {
        var Count = this.m_aNewObjects.length;

        for ( var Index = 0; Index < Count; Index++ )
        {
            var Class = this.m_aNewObjects[Index];
            Class.FromBinary = false;
        }

        Count = this.m_aEndActions.length;
        for (var Index = 0; Index < Count; Index++)
        {
            var Item = this.m_aEndActions[Index];
            Item.Class.Process_EndLoad(Item.Data);
        }

        this.Clear_EndActions();
        this.Clear_NewObjects();
    };
//-----------------------------------------------------------------------------------
// Функции для работы с новыми объектами, созданными на других клиентах
//-----------------------------------------------------------------------------------
    this.Clear_NewImages = function()
    {
        this.m_aNewImages.length = 0;
    };

    this.Add_NewImage = function(Url)
    {
        this.m_aNewImages.push( Url );
    };
//-----------------------------------------------------------------------------------
// Функции для работы с массивом m_aDC
//-----------------------------------------------------------------------------------
    this.Add_NewDC = function(Class)
    {
        var Id = Class.Get_Id();
        this.m_aDC[Id] = Class;
    };

    this.Clear_DCChanges = function()
    {
        for ( var Id in this.m_aDC )
        {
            this.m_aDC[Id].Clear_ContentChanges();
        }

        // Очищаем массив
        this.m_aDC = {};
    };

    this.Refresh_DCChanges = function()
    {
        for ( var Id in this.m_aDC )
        {
            this.m_aDC[Id].Refresh_ContentChanges();
        }

        this.Clear_DCChanges();
    };
//-----------------------------------------------------------------------------------
// Функции для работы с отметками изменений
//-----------------------------------------------------------------------------------
    this.Add_ChangedClass = function(Class)
    {
        var Id = Class.Get_Id();
        this.m_aChangedClasses[Id] = Class;
    };

    this.Clear_CollaborativeMarks = function(bRepaint)
    {
        for ( var Id in this.m_aChangedClasses )
        {
            this.m_aChangedClasses[Id].Clear_CollaborativeMarks();
        }

        // Очищаем массив
        this.m_aChangedClasses = {};

        if ( true === bRepaint )
        {
            editor.WordControl.m_oLogicDocument.DrawingDocument.ClearCachePages();
            editor.WordControl.m_oLogicDocument.DrawingDocument.FirePaint();
        }
    };

	this.getOwnLocksLength = function () {
		return this.m_aNeedUnlock2.length;
	};
}

var CollaborativeEditing = new CCollaborativeEditing();

var changestype_None                 =  0; // Ничего не происходит с выделенным элементом (проверка идет через дополнительный параметр)
var changestype_Paragraph_Content    =  1; // Добавление/удаление элементов в параграф
var changestype_Paragraph_Properties =  2; // Изменение свойств параграфа
var changestype_Document_Content     = 10; // Добавление/удаление элементов в Document или в DocumentContent
var changestype_Document_Content_Add = 11; // Добавление элемента в класс Document или в класс DocumentContent
var changestype_Document_SectPr      = 12; // Изменения свойств данной секции (размер страницы, поля и ориентация)
var changestype_Table_Properties     = 20; // Любые изменения в таблице
var changestype_Table_RemoveCells    = 21; // Удаление ячеек (строк или столбцов)
var changestype_Image_Properties     = 23; // Изменения настроек картинки
var changestype_HdrFtr               = 30; // Изменения в колонтитуле (любые изменения)
var changestype_Remove               = 40; // Удаление, через кнопку backspace (Удаление назад)
var changestype_Delete               = 41; // Удаление, через кнопку delete (Удаление вперед)
var changestype_Drawing_Props        = 51; // Изменение свойств фигуры
var changestype_ColorScheme          = 60; // Изменение свойств фигуры

var changestype_2_InlineObjectMove       = 1; // Передвигаем объект в заданную позцию (проверяем место, в которое пытаемся передвинуть)
var changestype_2_HdrFtr                 = 2; // Изменения с колонтитулом
var changestype_2_Comment                = 3; // Работает с комментариями
var changestype_2_Element_and_Type       = 4; // Проверяем возможно ли сделать изменение заданного типа с заданным элементом(а не с текущим)
var changestype_2_ElementsArray_and_Type = 5; // Аналогично предыдущему, только идет массив элементов

function CLock()
{
    this.Type   = locktype_None;
    this.UserId = null;
}

CLock.prototype = 
{
    Get_Type : function()
    {
        return this.Type;
    },

    Set_Type : function(NewType, Redraw)
    {
        if ( NewType === locktype_None )
            this.UserId = null;

        this.Type = NewType;

        if ( false != Redraw )
        {
            // TODO: переделать перерисовку тут
            var DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
            DrawingDocument.ClearCachePages();
            DrawingDocument.FirePaint();
        }
    },

    Check : function(Id)
    {
        if ( this.Type === locktype_Mine )
            CollaborativeEditing.Add_CheckLock( false );
        else if ( this.Type === locktype_Other || this.Type === locktype_Other2 || this.Type === locktype_Other3 )
            CollaborativeEditing.Add_CheckLock( true );
        else
            CollaborativeEditing.Add_CheckLock( Id );
    },

    Lock : function(bMine)
    {
        if ( locktype_None === this.Type )
        {
            if ( true === bMine )
                this.Type = locktype_Mine;
            else
                true.Type = locktype_Other;
        }
    },

    Is_Locked : function()
    {
        if ( locktype_None != this.Type && locktype_Mine != this.Type )
            return true;

        return false;
    },

    Set_UserId : function(UserId)
    {
        this.UserId = UserId;
    },

    Get_UserId : function()
    {
        return this.UserId;
    },

    Have_Changes : function()
    {
        if ( locktype_Other2 === this.Type || locktype_Other3 === this.Type )
            return true;

        return false;
    }
}

var contentchanges_Add    = 1;
var contentchanges_Remove = 2;

function CContentChangesElement(Type, Pos, Count, Data)
{
    this.m_nType  = Type;  // Тип изменений (удаление или добавление)
    this.m_nPos   = Pos;   // Позиция, в которой произошли изменения
    this.m_nCount = Count; // Количество добавленных/удаленных элементов
    this.m_pData  = Data;  // Связанные с данным изменением данные из истории

    // Разбиваем сложное действие на простейшие
    this.m_aPositions = this.Make_ArrayOfSimpleActions( Type, Pos, Count );
}

CContentChangesElement.prototype =
{

    Refresh_BinaryData : function()
    {
        var Binary_Writer = History.BinaryWriter;
        var Binary_Pos = Binary_Writer.GetCurPosition();

        this.m_pData.Data.UseArray = true;
        this.m_pData.Data.PosArray = this.m_aPositions;

        Binary_Writer.WriteString2(this.m_pData.Class.Get_Id());
        this.m_pData.Class.Save_Changes( this.m_pData.Data, Binary_Writer );

        var Binary_Len = Binary_Writer.GetCurPosition() - Binary_Pos;

        this.m_pData.Binary.Pos = Binary_Pos;
        this.m_pData.Binary.Len = Binary_Len;
    },

    Check_Changes : function(Type, Pos)
    {
        var CurPos = Pos;
        if ( contentchanges_Add === Type )
        {
            for ( var Index = 0; Index < this.m_nCount; Index++ )
            {
                if ( false !== this.m_aPositions[Index] )
                {
                    if ( CurPos <= this.m_aPositions[Index] )
                        this.m_aPositions[Index]++;
                    else
                    {
                        if ( contentchanges_Add === this.m_nType )
                            CurPos++;
                        else //if ( contentchanges_Remove === this.m_nType )
                            CurPos--;
                    }
                }
            }
        }
        else //if ( contentchanges_Remove === Type )
        {
            for ( var Index = 0; Index < this.m_nCount; Index++ )
            {
                if ( false !== this.m_aPositions[Index] )
                {
                    if ( CurPos < this.m_aPositions[Index] )
                        this.m_aPositions[Index]--;
                    else if ( CurPos > this.m_aPositions[Index] )
                    {
                        if ( contentchanges_Add === this.m_nType )
                            CurPos++;
                        else //if ( contentchanges_Remove === this.m_nType )
                            CurPos--;
                    }
                    else //if ( CurPos === this.m_aPositions[Index] )
                    {
                        if ( contentchanges_Remove === this.m_nType )
                        {
                            // Отмечаем, что действия совпали
                            this.m_aPositions[Index] = false;
                            return false;
                        }
                        else
                        {
                            CurPos++;
                        }
                    }
                }
            }
        }

        return CurPos;
    },

    Make_ArrayOfSimpleActions : function(Type, Pos, Count)
    {
        // Разбиваем действие на простейшие
        var Positions = [];
        if ( contentchanges_Add === Type )
        {
            for ( var Index = 0; Index < Count; Index++ )
                Positions[Index] = Pos + Index;
        }
        else //if ( contentchanges_Remove === Type )
        {
            for ( var Index = 0; Index < Count; Index++ )
                Positions[Index] = Pos;
        }

        return Positions;
    }
};

function CContentChanges()
{
    this.m_aChanges = [];
}

CContentChanges.prototype =
{
    Add : function(Changes)
    {
        this.m_aChanges.push( Changes );
    },

    Clear : function()
    {
        this.m_aChanges.length = 0;
    },

    Check : function(Type, Pos)
    {
        var CurPos = Pos;
        var Count = this.m_aChanges.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var NewPos = this.m_aChanges[Index].Check_Changes(Type, CurPos);
            if ( false === NewPos )
                return false;

            CurPos = NewPos;
        }

        return CurPos;
    },

    Refresh : function()
    {
        var Count = this.m_aChanges.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            this.m_aChanges[Index].Refresh_BinaryData();
        }
    }
};