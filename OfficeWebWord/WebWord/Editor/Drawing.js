//var gDrawingCanvasObj = new DrawingCanvas ('canvas');

// Работаем с Канвой
var Canvas =
{
    Width : 597,
    Height: 842,

    GetHtmlElement : function()
    {
        return document.getElementById("canvas");
    },

    Drawing_Init : function()
    {
        var Context = this.GetHtmlElement().getContext("2d");

        Context.fillStyle = "rgb(0,0,0)";
        Context.strokeRect(0, 0, this.Width, this.Height);
    },

    Clear : function()
    {
        var Context = this.GetHtmlElement().getContext("2d");

        Context.clearRect (0, 0, this.Width, this.Height );
        Context.strokeRect(0, 0, this.Width, this.Height);
    },

    Clear2 : function(X, Y, W, H)
    {
        var Context = this.GetHtmlElement().getContext("2d");

        Context.clearRect (X + 1, Y, W - 2, H );
        Context.strokeRect(0, 0, this.Width, this.Height);
    },

    BeginPath : function()
    {
        var Context = this.GetHtmlElement().getContext("2d");
        Context.beginPath();
    },

    MoveTo : function(X,Y)
    {
        var Context = this.GetHtmlElement().getContext("2d");
        Context.moveTo( X, Y );
    },

    LineTo : function(X,Y)
    {
        var Context = this.GetHtmlElement().getContext("2d");
        Context.lineTo( X, Y );
    },

    ClosePath : function()
    {
        var Context = this.GetHtmlElement().getContext("2d");
        Context.closePath();
    },

    Stroke : function()
    {
        var Context = this.GetHtmlElement().getContext("2d");
        Context.stroke();
    },

    SetLineWidth : function(W)
    {
        var Context = this.GetHtmlElement().getContext("2d");
        Context.lineWidth = W;
    },

    GetLineWidth : function()
    {
        var Context = this.GetHtmlElement().getContext("2d");
        return Context.lineWidth;
    },

    FillText : function(X,Y,Text)
    {
        if ( UseFontTest )
            gDrawingCanvasObj.drawChar(Text, X, Y);
        else
        {
            var Context = this.GetHtmlElement().getContext("2d");
            Context.fillText( Text, X, Y );
        }
    },

    Measure : function(Text)
    {
        var Width  = 0;
        var Height = 0;

        if ( UseFontTest )
        {
            var Temp = gDrawingCanvasObj.MeasureChar( Text.charCodeAt(0) );
            Width  = Temp.fAdvanceX;
            Height = 0;//Temp.fHeight;
        }
        else
        {
            var Context = this.GetHtmlElement().getContext("2d");
            Width = Context.measureText( Text ).width;
            Height = 0;
        }

        return { Width : Width, Height : Height };
    },

    GetFont : function()
    {
        return this.GetHtmlElement().getContext("2d").font;
    },

    SetFont : function(font)
    {
        if ( UseFontTest )
        {
            var sName, nSize = 12;
            if ( "string" == typeof(font) )
            {
                sName = font;
                nSize = 12;
            }
            else
            {
                sName = font.FontFamily;
                nSize = font.FontSize;
            }

            var bItalic = true === font.Italic;
            var bBold   = true === font.Bold;

            var oFontStyle = FontStyle.FontStyleRegular;
            if ( !bItalic && bBold )
                oFontStyle = FontStyle.FontStyleBold;
            else if ( bItalic && !bBold )
                oFontStyle = FontStyle.FontStyleItalic;
            else if ( bItalic && bBold )
                oFontStyle = FontStyle.FontStyleBoldItalic;

            if ( -1 != sName.indexOf('Arial') )
                gDrawingCanvasObj.loadFont2("arial", nSize, oFontStyle, 96.0, 96.0);
            else if ( -1 != sName.indexOf('Courier') )
                gDrawingCanvasObj.loadFont2("cour", nSize, oFontStyle, 96.0, 96.0);
            else
                gDrawingCanvasObj.loadFont2("times", nSize, oFontStyle, 96.0, 96.0);
        }
        else
        {
            if ( "string" == typeof(font) )
                this.GetHtmlElement().getContext("2d").font = font;
            else if ( "object" == typeof(font) )
            {
                var sFont = "";
                if ( true === font.Bold )
                    sFont += "bold ";
                if ( true === font.Italic )
                    sFont += "italic ";

                sFont += font.FontSize + "pt" + " " + font.FontFamily;
                this.GetHtmlElement().getContext("2d").font = sFont;
            }

        }
    },

    SetFillStyle : function(style)
    {
        this.GetHtmlElement().getContext("2d").fillStyle = style;
    },

    GetFillStyle : function()
    {
        return this.GetHtmlElement().getContext("2d").fillStyle;
    },

    Focus : function()
    {
        document.getElementById("canvas").focus();
        //document.body["canvas"].focus();
        //this.GetHtmlElement().focus();
    },

    DrawImage : function(Img,X,Y,W,H)
    {
        this.GetHtmlElement().getContext("2d").drawImage(Img, X, Y, W, H);
    }
};

var Canvas2 =
{
    Font : "",
    Elements: [],
    Width : 597,
    Height: 842,

    GetHtmlElement : function()
    {
        return document.getElementById("canvas");
    },

    Drawing_Init : function()
    {
        var Context = this.GetHtmlElement().getContext("2d");

        Context.fillStyle = "rgb(0,0,0)";
        Context.strokeRect(0, 0, this.Width, this.Height);
    },

    Clear : function()
    {
        var Context = this.GetHtmlElement().getContext("2d");

        Context.clearRect (0, 0, this.Width, this.Height );
        Context.strokeRect(0, 0, this.Width, this.Height);

        for ( var Index = 0; Index < this.Elements.length; Index++ )
            document.body.removeChild( this.Elements[Index] );

        this.Elements.length = 0;
    },

    BeginPath : function()
    {
        var Context = this.GetHtmlElement().getContext("2d");
        Context.beginPath();
    },

    MoveTo : function(X,Y)
    {
        var Context = this.GetHtmlElement().getContext("2d");
        Context.moveTo( X, Y );
    },

    LineTo : function(X,Y)
    {
        var Context = this.GetHtmlElement().getContext("2d");
        Context.lineTo( X, Y );
    },

    ClosePath : function()
    {
        var Context = this.GetHtmlElement().getContext("2d");
        Context.closePath();
    },

    Stroke : function()
    {
        var Context = this.GetHtmlElement().getContext("2d");
        Context.stroke();
    },

    SetLineWidth : function(W)
    {
        var Context = this.GetHtmlElement().getContext("2d");
        Context.lineWidth = W;
    },

    FillText : function(X,Y,Text)
    {
        var Div = document.createElement("div");

        Div.innerText = Text;
        Div.style.font     = this.Font;
        Div.style.position = "absolute";
        Div.style.left     = X;
        Div.style.top      = Y;

        document.body.appendChild( Div  );
        this.Elements.push( Div );
    },

    Measure : function(Text)
    {
        var Context = this.GetHtmlElement().getContext("2d");
        var Width = Context.measureText( Text ).width;
        var Height = 0;

        return { Width : Width, Height : Height };
    },

    GetFont : function()
    {
        return this.GetHtmlElement().getContext("2d").font;
    },

    SetFont : function(font)
    {
        if ( "string" == typeof(font) )
        {
            this.Font = font;
        }
        else if ( "object" == typeof(font) )
        {
            var sFont = "";
            if ( true === font.Bold )
                sFont += "bold ";
            if ( true === font.Italic )
                sFont += "italic ";

            sFont += font.FontSize + "pt" + " " + font.FontFamily;
            this.Font = sFont;
        }
    },

    SetFillStyle : function(style)
    {
        this.GetHtmlElement().getContext("2d").fillStyle = style;
    },
    Focus : function()
    {
        document.forms[0].canvas.focus();
        //this.GetHtmlElement().focus();
    }
};

// Работаем с внешим интфейсом
var Interface =
{
    ShowParaMarks : true,

    TextPr :
    {
        Bold      : false,
        Italic    : false,
        Underline : false,
        Strikeout : false,
        FontSize  : 12,
        FontFamily: { Name : "Times New Roman", Index : -1 },
        VertAlign : vertalign_Baseline,
        Color     : { r : 0, g : 0, b : 0},
        HighLight : highlight_None
    },

    ParaPr:
    {
        Ind :
        {
            Line      : null,
            Both      : false,

            Left      : 0,
            Right     : 0,
            FirstLine : 0
        }
    },

    SectPr :
    {
        PgMar :
        {
            Left  : 50,
            Right : 50
        }
    },

    NumPr :
    {
        Bullet : false,
        Number : false
    },

    FlyTextPr :
    {
        Div : null,
        X   : 0,
        Y   : 0,
        W   : 0,
        H   : 0,
        Show: false // показали ли мы полностью уже (контроль первого появления)
    },

    UpdateNumbering : function(NumPr)
    {
        for ( var Item in NumPr )
        {
            this.NumPr[Item] = NumPr[Item];
        }

        if ( this.NumPr.Bullet )
        {
            bulletlistpressed = true;
        }

        if ( this.NumPr.Number )
        {
            numberedlistpressed = true;
        }

        //_api.sync_ListType(NumPr);
    },

    UpdateShowParaMarks : function()
    {
        if ( this.ShowParaMarks )
            document.getElementById("ParaMarks").src = "Images/paragraphMarks_clicked.PNG";
        else
            document.getElementById("ParaMarks").src = "Images/paragraphMarks.PNG";
    },

    UpdateTextPr : function(TextPr)
    {
        if ( "undefined" != typeof(TextPr) )
        {
            if( "undefined" != typeof( TextPr.Bold ) )
            {
                this.TextPr.Bold = TextPr.Bold;
            }
            
            if( "undefined" != typeof( TextPr.Italic ) )
            {
                this.TextPr.Italic = TextPr.Italic;
            }
            
            if( "undefined" != typeof( TextPr.Underline ) )
            {
                this.TextPr.Underline = TextPr.Underline;
            }
            
            if( "undefined" != typeof( TextPr.Strikeout ) )
            {
                this.TextPr.Strikeout = TextPr.Strikeout;
            }
            if( "undefined" != typeof( TextPr.FontSize ) )
            {
                this.TextPr.FontSize = TextPr.FontSize;
            }
            
            if( "undefined" != typeof( TextPr.FontFamily ) )
            {
                this.TextPr.FontFamily = TextPr.FontFamily;
            }
            
            if( "undefined" != typeof( TextPr.VertAlign ) )
            {
                this.TextPr.VertAlign = TextPr.VertAlign;
            }
            
            if( "undefined" != typeof( TextPr.Color ) )
            {
                this.TextPr.Color = TextPr.Color;
            }
            
            if( "undefined" != typeof( TextPr.HighLight ) )
            {
                this.TextPr.HighLight = TextPr.HighLight;
            }            
        }

        this.Internal_UpdateBold();
        this.Internal_UpdateItalic();
        this.Internal_UpdateUnderline();
        this.Internal_UpdateStrikeout();
        this.Internal_UpdateFontSize();
        this.Internal_UpdateFontFamily();
        this.Internal_UpdateVertAlign();
        this.Internal_UpdateColor();
        this.Internal_UpdateHighLight();
    },

    Internal_UpdateVertAlign : function()
    {
        //_api.sync_TextPrBaseline(this.TextPr.VertAlign);
    },

    Internal_UpdateColor : function()
    {
        // this.TextPr.Color = { r : , g : , b:  };
    },

    Internal_UpdateHighLight : function()
    {
        if ( highlight_None === this.TextPr.HighLight )
        {

        }
        else
        {
            // this.TextPr.HighLight = { r : , g : , b:  };
        }
    },

    Internal_UpdateBold : function()
    {
        /*
         if ( this.TextPr.Bold )
         {
         document.getElementById("Text_Bold").src = "Images/bold_clicked.png";
         }
         else
         document.getElementById("Text_Bold").src = "Images/bold.png";


         if ( null != this.FlyTextPr.Div )
         {
         if ( this.TextPr.Bold )
         document.getElementById("FlyTextPr_Text_Bold").src = "Images/bold_clicked.png";
         else
         document.getElementById("FlyTextPr_Text_Bold").src = "Images/bold.png";
         }
         */
        //_api.sync_BoldCallBack(this.TextPr.Bold);
    },
    Internal_UpdateItalic : function()
    {
        /*if ( this.TextPr.Italic )
         {
         document.getElementById("Text_Italic").src = "Images/italic_clicked.png";
         }
         else
         document.getElementById("Text_Italic").src = "Images/italic.png";


         if ( null != this.FlyTextPr.Div )
         {
         if ( this.TextPr.Italic )
         document.getElementById("FlyTextPr_Text_Italic").src = "Images/italic_clicked.png";
         else
         document.getElementById("FlyTextPr_Text_Italic").src = "Images/italic.png";
         }
         */
        //_api.sync_ItalicCallBack(this.TextPr.Italic);
    },
    Internal_UpdateUnderline : function()
    {
        /*if ( this.TextPr.Underline )
         {
         document.getElementById("Text_Underline").src = "Images/underline_clicked.png";
         }
         else
         document.getElementById("Text_Underline").src = "Images/underline.png";


         if ( null != this.FlyTextPr.Div )
         {
         if ( this.TextPr.Underline )
         document.getElementById("FlyTextPr_Text_Underline").src = "Images/underline_clicked.png";
         else
         document.getElementById("FlyTextPr_Text_Underline").src = "Images/underline.png";
         }
         */
        //_api.sync_UnderlineCallBack(this.TextPr.Underline);
    },
    Internal_UpdateStrikeout : function()
    {
        /*if ( this.TextPr.Strikeout )
         document.getElementById("Text_Strikeout").src = "Images/strikeout_clicked.png";
         else
         document.getElementById("Text_Strikeout").src = "Images/strikeout.png";


         if ( null != this.FlyTextPr.Div )
         {
         if ( this.TextPr.Strikeout )
         document.getElementById("FlyTextPr_Text_Strikeout").src = "Images/strikeout_clicked.png";
         else
         document.getElementById("FlyTextPr_Text_Strikeout").src = "Images/strikeout.png";
         }
         */
    },
    Internal_UpdateFontSize : function()
    {
        /*document.getElementById("Input_FontSize").value = this.TextPr.FontSize;


         if ( null != this.FlyTextPr.Div )
         {
         document.getElementById("FlyTextPr_Input_FontSize").value = this.TextPr.FontSize;
         }
         */
    },
    Internal_UpdateFontFamily : function()
    {
        /*document.getElementById("Input_FontFamily").value = this.TextPr.FontFamily;


         if ( null != this.FlyTextPr.Div )
         {
         document.getElementById("FlyTextPr_Input_FontFamily").value = this.TextPr.FontFamily;
         }
         */
    },

    Update_ParaInd : function(Ind)
    {
        if ( "undefined" != typeof(Ind) )
        {
        
            if( "undefined" != typeof(Ind.FirstLine) )
            {
                this.ParaPr.Ind.FirstLine = Ind.FirstLine;
            }
            
            if( "undefined" != typeof(Ind.Left) )
            {
                this.ParaPr.Ind.Left = Ind.Left;
            }
            
            if( "undefined" != typeof(Ind.Right) )
            {
                this.ParaPr.Ind.Right = Ind.Right;
            }
        }

        this.Internal_Update_Ind_Left();
        this.Internal_Update_Ind_FirstLine();
        this.Internal_Update_Ind_Right();
    },

    Internal_Update_Ind_FirstLine : function()
    {
        /*
         if ( UnknownValue != this.ParaPr.Ind.FirstLine )
         document.getElementById("Interface_Ind_FirstLine").style.left = (parseFloat(document.getElementById("Interface_Ind_Left").style.left) + this.ParaPr.Ind.FirstLine) + "px";
         else
         document.getElementById("Interface_Ind_FirstLine").style.left = document.getElementById("Interface_Ind_Left").style.left;
         */

        oWordControl.m_oHorRuler.m_dIndentLeftFirst = (this.ParaPr.Ind.FirstLine + this.ParaPr.Ind.Left);
        oWordControl.UpdateHorRuler();
    },

    Internal_Update_Ind_Left : function()
    {
        /*
         if ( UnknownValue != this.ParaPr.Ind.Left )
         {
         document.getElementById("Interface_Ind_LeftAll").style.left = (this.ParaPr.Ind.Left - 5 + this.SectPr.PgMar.Left) + "px";
         document.getElementById("Interface_Ind_Left").style.left    = (this.ParaPr.Ind.Left - 5 + this.SectPr.PgMar.Left) + "px";
         }
         else
         {
         document.getElementById("Interface_Ind_LeftAll").style.left = (- 5 + this.SectPr.PgMar.Left) + "px";
         document.getElementById("Interface_Ind_Left").style.left    = (- 5 + this.SectPr.PgMar.Left) + "px";
         }
         */

        oWordControl.m_oHorRuler.m_dIndentLeft = this.ParaPr.Ind.Left;
        oWordControl.UpdateHorRuler();
    },
    Internal_Update_Ind_Right : function()
    {
        /*
         if ( UnknownValue != this.ParaPr.Ind.Right )
         document.getElementById("Interface_Ind_Right").style.left  = (597 - this.SectPr.PgMar.Right - this.ParaPr.Ind.Right - 6) + "px";
         else
         document.getElementById("Interface_Ind_Right").style.left  = (597 - this.SectPr.PgMar.Right - 6) + "px";
         */

        oWordControl.m_oHorRuler.m_dIndentRight = this.ParaPr.Ind.Right;
        oWordControl.UpdateHorRuler();
    },
    FlyTextPr_Init : function(X,Y)
    {
        // Если окно уже есть, то удалим его
        this.FlyTextPr_Remove();

        var DivW = 172 + 2 + 4; // width  + border + padding
        var DivH = 54  + 2 + 4; // height + border + padding
        var DivY = Y - 30 - DivH;
        var DivX = X            ;

        var Div = document.createElement("div");

        Div.id = "FlyTextPr";
        Div.style.position = "absolute";
        Div.style.left     = X     +  50; // +  50 - TODO: сдвиг канвы, надо будет переделать понормальному
        Div.style.top      = DivY  + 100; // + 100
        Div.style.width    = 172;
        Div.style.height   = 54;
        Div.style.border   = "1px solid silver";
        Div.style.padding  = 2;
        Div.style.backgroundColor = "#fff";
        Div.style.zIndex   = 100;

        Div.innerHTML = "\<input id=\"FlyTextPr_Input_FontFamily\" style=\"float:left;width:130;height:30;margin-right:2px;margin-bottom: 2px\" type=\"text\" value=\"Arial\" onchange=\"Actions_SetFontFamily( this.value );\"/>\
                          <input id=\"FlyTextPr_Input_FontSize\" style=\"float:left;width:40;height:30;margin-bottom: 2px\" type=\"text\" value=\"10\" onChange=\"Actions_SetFontSize( this.value );\"/>\
                          <img id=\"FlyTextPr_Text_Bold\" style=\"float:left;\" src=\"Images/bold.png\" onclick=\"Actions_TextPr('Bold')\"/>\
                          <img id=\"FlyTextPr_Text_Italic\" style=\"float:left;\" src=\"Images/italic.png\" onclick=\"Actions_TextPr('Italic')\"/>\
                          <img id=\"FlyTextPr_Text_Underline\" style=\"float:left;\" src=\"Images/underline.png\" onclick=\"Actions_TextPr('Underline')\"/>\
                          <img id=\"FlyTextPr_Text_Strikeout\" style=\"float:left;\" src=\"Images/strikeout.png\" onclick=\"Actions_TextPr('Strikeout')\"/>";

        document.body.appendChild( Div );

        this.FlyTextPr.Div  = Div;
        this.FlyTextPr.X    = X;
        this.FlyTextPr.Y    = DivY;
        this.FlyTextPr.W    = DivW;
        this.FlyTextPr.H    = DivH;
        this.FlyTextPr.Show = false;
        this.UpdateTextPr();
    },
    FlyTextPr_Remove : function()
    {
        try
        {
            if ( null != this.FlyTextPr.Div )
            {
                document.body.removeChild( this.FlyTextPr.Div );

                this.FlyTextPr.Div  = null;
                this.FlyTextPr.X    = 0;
                this.FlyTextPr.Y    = 0;
                this.FlyTextPr.W    = 0;
                this.FlyTextPr.H    = 0;
                this.FlyTextPr.Show = false;
            }
        }
        catch(e)
        {

        }
    },
    FlyTextPr_SetOpacity : function(X,Y)
    {
        if ( null != this.FlyTextPr.Div )
        {
            // Вычисляем расстояние до BBox в зависимости от позиции, относительно BBox
            //
            //    1      2       3
            //        _______
            //    4  |   5   |   6
            //       |_______|
            //    7      8       9

            var Diff = -1;

            if ( X < this.FlyTextPr.X )
            {
                if ( Y < this.FlyTextPr.Y )
                    Diff = Math.max( this.FlyTextPr.Y - Y, this.FlyTextPr.X - X );
                else if ( Y > this.FlyTextPr.Y + this.FlyTextPr.H )
                    Diff = Math.max( Y - this.FlyTextPr.Y - this.FlyTextPr.H, this.FlyTextPr.X - X );
                else
                    Diff = this.FlyTextPr.X - X;
            }
            else if ( X > this.FlyTextPr.X + this.FlyTextPr.W )
            {
                if ( Y < this.FlyTextPr.Y )
                    Diff = Math.max( this.FlyTextPr.Y - Y, X - this.FlyTextPr.X - this.FlyTextPr.W );
                else if ( Y > this.FlyTextPr.Y + this.FlyTextPr.H )
                    Diff = Math.max( Y - this.FlyTextPr.Y - this.FlyTextPr.H, X - this.FlyTextPr.X - this.FlyTextPr.W );
                else
                    Diff = X - this.FlyTextPr.X - this.FlyTextPr.W;
            }
            else
            {
                if ( Y < this.FlyTextPr.Y )
                    Diff = this.FlyTextPr.Y - Y;
                else if ( Y > this.FlyTextPr.Y + this.FlyTextPr.H )
                    Diff = Y - this.FlyTextPr.Y - this.FlyTextPr.H;
                else
                    Diff = 0;
            }
            var Div = this.FlyTextPr.Div;
            if ( Diff > 150 )
            {
                // Удаляем элемент
                this.FlyTextPr_Remove();
            }
            else if ( Diff > 0 )
            {
                if ( true == this.FlyTextPr.Show )
                    Div.style.opacity = Math.max( (100 - Diff ) / 100.0, 0 );
                else
                    Div.style.opacity = Math.max( (35 - Diff ) / 35.0, 0 );
            }
            else
            {
                Div.style.opacity = 1;
                this.FlyTextPr.Show = true;
            }
        }
    },
    Ind_Init : function ()
    {
        /*
         Drag.init( document.getElementById("Interface_Ind_FirstLine"), null, -4, 597 - 5, 2, 2 );
         document.getElementById("Interface_Ind_FirstLine").onDragStart = function()
         {
         Interface.Ind_MarginLine_Init( 0, 0, 842 );
         Interface.Ind_MarginLine_Move(parseFloat(document.getElementById("Interface_Ind_FirstLine").style.left) + 5,0);
         };
         document.getElementById("Interface_Ind_FirstLine").onDrag = function(X,Y)
         {
         // Проверяем, чтобы левая граница строки не уходила за правую
         var FL = parseFloat(document.getElementById("Interface_Ind_FirstLine").style.left) + 5;
         var RM = parseFloat(document.getElementById("Interface_Ind_Right").style.left) + 5;
         if ( FL + 62 >= RM )
         {
         document.getElementById("Interface_Ind_FirstLine").style.left = (RM - 62) + "px";
         FL = RM - 62;
         }

         Interface.Ind_MarginLine_Move(parseFloat(document.getElementById("Interface_Ind_FirstLine").style.left) + 5,0);
         };
         document.getElementById("Interface_Ind_FirstLine").onDragEnd = function()
         {
         Interface.Ind_MarginLine_Remove();
         Document.Set_ParagraphIndent( { FirstLine : document.getElementById("Interface_Ind_FirstLine").offsetLeft - document.getElementById("Interface_Ind_Left").offsetLeft } );
         };

         Drag.init( document.getElementById("Interface_Ind_Left"), null, -4, 597 - 5, 10, 10 );
         document.getElementById("Interface_Ind_Left").onDragStart = function()
         {
         Interface.Ind_MarginLine_Init( 0, 0, 842 );
         Interface.Ind_MarginLine_Move(parseFloat(document.getElementById("Interface_Ind_Left").style.left) + 5,0);
         };

         document.getElementById("Interface_Ind_Left").onDrag = function(X,Y)
         {
         var LM = parseFloat(document.getElementById("Interface_Ind_Left").style.left) + 5;
         var RM = parseFloat(document.getElementById("Interface_Ind_Right").style.left) + 5;
         if ( LM + 62 >= RM )
         {
         document.getElementById("Interface_Ind_Left").style.left = (RM - 62) + "px";
         LM = RM - 62;
         }

         document.getElementById("Interface_Ind_LeftAll").style.left = document.getElementById("Interface_Ind_Left").style.left;
         Interface.Ind_MarginLine_Move(parseFloat(document.getElementById("Interface_Ind_Left").style.left) + 5,0);
         };
         document.getElementById("Interface_Ind_Left").onDragEnd = function()
         {
         Interface.Ind_MarginLine_Remove();
         Document.Set_ParagraphIndent( { Left : parseFloat(document.getElementById("Interface_Ind_Left").style.left) - Interface.SectPr.PgMar.Left + 5, FirstLine : document.getElementById("Interface_Ind_FirstLine").offsetLeft - document.getElementById("Interface_Ind_Left").offsetLeft } )
         };

         Drag.init( document.getElementById("Interface_Ind_LeftAll"), null, -4, 597 - 5, 17, 17 );
         document.getElementById("Interface_Ind_LeftAll").onDragStart = function()
         {
         Interface.Ind_MarginLine_Init( 0, 0, 842 );
         document.getElementById("Interface_Ind_FirstLine").style.left = ( parseInt(document.getElementById("Interface_Ind_Left").style.left) + Interface.ParaPr.Ind.FirstLine ) + "px";

         Interface.Ind_MarginLine_Move(parseFloat(document.getElementById("Interface_Ind_Left").style.left) + 5,0);
         };

         document.getElementById("Interface_Ind_LeftAll").onDrag = function(X,Y)
         {
         var LM = parseFloat(document.getElementById("Interface_Ind_LeftAll").style.left) + 5;
         var RM = parseFloat(document.getElementById("Interface_Ind_Right").style.left) + 5;

         var FL = LM + Interface.ParaPr.Ind.FirstLine;

         if ( LM + 62 >= RM )
         {
         document.getElementById("Interface_Ind_LeftAll").style.left = (RM - 62) + "px";
         LM = RM - 62;

         FL = LM + Interface.ParaPr.Ind.FirstLine;
         }

         if ( FL + 62 >= RM )
         {
         document.getElementById("Interface_Ind_LeftAll").style.left = (RM - 62 - Interface.ParaPr.Ind.FirstLine) + "px";
         }

         document.getElementById("Interface_Ind_Left").style.left = document.getElementById("Interface_Ind_LeftAll").style.left;
         document.getElementById("Interface_Ind_FirstLine").style.left = ( parseFloat(document.getElementById("Interface_Ind_Left").style.left) + Interface.ParaPr.Ind.FirstLine ) + "px";

         Interface.Ind_MarginLine_Move(parseFloat(document.getElementById("Interface_Ind_Left").style.left) + 5,0);
         };
         document.getElementById("Interface_Ind_LeftAll").onDragEnd = function()
         {
         Interface.Ind_MarginLine_Remove();
         Document.Set_ParagraphIndent( { Left : parseFloat(document.getElementById("Interface_Ind_Left").style.left) - Interface.SectPr.PgMar.Left + 5, FirstLine : document.getElementById("Interface_Ind_FirstLine").offsetLeft - document.getElementById("Interface_Ind_Left").offsetLeft } )
         };

         Drag.init( document.getElementById("Interface_Ind_Right"), null, -4, 597 - 5, 10, 10 );
         document.getElementById("Interface_Ind_Right").onDragStart = function()
         {
         Interface.Ind_MarginLine_Init( 0, 0, 842 );
         Interface.Ind_MarginLine_Move(parseFloat(document.getElementById("Interface_Ind_Right").style.left) + 5,0);
         };
         document.getElementById("Interface_Ind_Right").onDrag = function(X,Y)
         {
         var LM = parseFloat(document.getElementById("Interface_Ind_LeftAll").style.left);
         var RM = parseFloat(document.getElementById("Interface_Ind_Right").style.left);
         var FL = parseFloat(document.getElementById("Interface_Ind_FirstLine").style.left);

         if ( LM + 62 >= RM )
         {
         document.getElementById("Interface_Ind_Right").style.left = (LM + 62) + "px";
         RM = LM + 62;
         }

         if ( FL + 62 >= RM )
         {
         document.getElementById("Interface_Ind_Right").style.left = (FL + 62) + "px";
         }

         Interface.Ind_MarginLine_Move(parseFloat(document.getElementById("Interface_Ind_Right").style.left) + 5,0);
         };
         document.getElementById("Interface_Ind_Right").onDragEnd = function()
         {
         Interface.Ind_MarginLine_Remove();
         Document.Set_ParagraphIndent( { Right : 597 - Interface.SectPr.PgMar.Right - document.getElementById("Interface_Ind_Right").offsetLeft - 6 } )
         };

         Drag.init( document.getElementById("Interface_Margin_Left_Field"), null, -5, 597 - 30, 5, 5 );
         document.getElementById("Interface_Margin_Left_Field").onDragStart = function()
         {
         Interface.Ind_MarginLine_Init( 0, 0, 842 );
         Interface.Ind_MarginLine_Move(parseFloat(document.getElementById("Interface_Margin_Left_Field").style.left) + 5,0);

         };
         document.getElementById("Interface_Margin_Left_Field").onDrag = function(X,Y)
         {
         var Temp = parseFloat(document.getElementById("Interface_Margin_Left_Field").style.left) + 5;

         document.getElementById("Interface_Ind_LeftAll").style.left   = (Temp - 5 + Interface.ParaPr.Ind.Left)      + "px";
         document.getElementById("Interface_Ind_Left").style.left      = (Temp - 5 + Interface.ParaPr.Ind.Left)      + "px";
         document.getElementById("Interface_Ind_FirstLine").style.left = (Temp - 5 + Interface.ParaPr.Ind.FirstLine + Interface.ParaPr.Ind.Left) + "px";

         Interface.Ind_MarginLine_Move(Temp,0);

         document.getElementById("Interface_Margin_Left").style.width = Temp + "px";
         document.getElementById("Interface_Margin_DocumentSpace").style.width = (597 - parseFloat(document.getElementById("Interface_Margin_Left").style.width) - parseFloat(document.getElementById("Interface_Margin_Right").style.width)) + "px";
         document.getElementById("Interface_Margin_Right_Inner").style.backgroundPosition = -parseFloat(document.getElementById("Interface_Margin_DocumentSpace").style.width);
         };
         document.getElementById("Interface_Margin_Left_Field").onDragEnd = function(X,Y)
         {
         var Temp = parseFloat(document.getElementById("Interface_Margin_Left_Field").style.left) + 5;
         Interface.Ind_MarginLine_Remove();

         Interface.SectPr.PgMar.Left = Temp;
         X_Left_Field = Temp;

         Document.Recalculate();
         Document.Draw();
         };

         Drag.init( document.getElementById("Interface_Margin_Right_Field"), null, 30, 597 - 5, 5, 5 );
         document.getElementById("Interface_Margin_Right_Field").onDragStart = function()
         {
         Interface.Ind_MarginLine_Init( 0, 0, 842 );
         Interface.Ind_MarginLine_Move(parseFloat(document.getElementById("Interface_Margin_Right_Field").style.left) + 5,0);

         };
         document.getElementById("Interface_Margin_Right_Field").onDrag = function(X,Y)
         {
         var Temp = parseFloat(document.getElementById("Interface_Margin_Right_Field").style.left) + 5;

         document.getElementById("Interface_Ind_Right").style.left = (Temp - 5 - Interface.ParaPr.Ind.Right) + "px";

         Interface.Ind_MarginLine_Move(parseFloat(document.getElementById("Interface_Margin_Right_Field").style.left) + 5,0);

         document.getElementById("Interface_Margin_Right").style.width = (597 - Temp) + "px";
         document.getElementById("Interface_Margin_DocumentSpace").style.width = (597 - parseFloat(document.getElementById("Interface_Margin_Left").style.width) - parseFloat(document.getElementById("Interface_Margin_Right").style.width)) + "px";
         document.getElementById("Interface_Margin_Right_Inner").style.backgroundPosition = -parseFloat(document.getElementById("Interface_Margin_DocumentSpace").style.width);
         };
         document.getElementById("Interface_Margin_Right_Field").onDragEnd = function(X,Y)
         {
         var Temp = parseFloat(document.getElementById("Interface_Margin_Right_Field").style.left) + 5;
         Interface.Ind_MarginLine_Remove();

         Interface.SectPr.PgMar.Right = 597 - Temp;
         X_Right_Field = Temp;

         Document.Recalculate();
         Document.Draw();
         };
         */
    },

    Ind_MarginLine_Init : function (X, Y, Height)
    {
        // Удалим линию, если она была
        this.Ind_MarginLine_Remove();

        var DivW = 1;
        var DivH = Height;
        var DivY = Y;
        var DivX = X;

        var Div = document.createElement("div");

        Div.style.position   = "absolute";
        Div.style.left       = DivX  +  50; // +  50 - TODO: сдвиг канвы, надо будет переделать понормальному
        Div.style.top        = DivY  + 100; // + 100
        Div.style.width      = DivW;
        Div.style.height     = DivH;
        Div.style.borderLeft = "1px dashed black";
        Div.style.zIndex     = 100;

        document.body.appendChild( Div );

        this.ParaPr.Ind.Line = Div;
    },

    Ind_MarginLine_Remove : function ()
    {
        if ( null != this.ParaPr.Ind.Line )
        {
            document.body.removeChild( this.ParaPr.Ind.Line );
            this.ParaPr.Ind.Line = null;
        }
    },

    Ind_MarginLine_Move : function (X,Y)
    {
        if ( null != this.ParaPr.Ind.Line )
        {
            var Div = this.ParaPr.Ind.Line;
            Div.style.left     = X  +  50; // +  50 - TODO: сдвиг канвы, надо будет переделать понормальному
            Div.style.top      = Y  + 100; // + 100
        }
    },

    Update_ParaAlign : function(Align)
    {
        /*document.getElementById("ParaAlign_Left").src = "Images/alignLeft.png";
         document.getElementById("ParaAlign_Right").src = "Images/alignRight.png";
         document.getElementById("ParaAlign_Center").src = "Images/alignCenter.png";
         document.getElementById("ParaAlign_Justify").src = "Images/alignJustify.png";*/

        //_api.sync_PrAlignCallBack(Align);

    },

    Update_ParaSpacing : function(Spacing)
    {
        /*
         if ( "number" == typeof(Spacing.Line) && UnknownValue != Spacing.Line )
         document.getElementById("Input_LineSpacing").value = Spacing.Line;
         else
         document.getElementById("Input_LineSpacing").value = "";
         */
    },

    Update_ParaStyleName : function(StyleName)
    {
        //document.getElementById('fontFormatVal').text = StyleName;
    },

    Update_ParaShd : function(Shd)
    {
        switch( Shd.Value )
        {
            case shd_Nil:
            {
                break;
            }
            case shd_Clear:
            {
                // Shd.Color = { r: , g : , b : };
                break;
            }
        }
    }


};
// Работаем с "целью"

function Drawing_Target_Draw()
{
    if ( "block" != document.getElementById("Target").style.display )
        document.getElementById("Target").style.display = "block";
    else
        document.getElementById("Target").style.display = "none";
}

var Target =
{
    IntervalId : null,
    Size : 10,
    Show : false,

    GetHtmlElement : function()
    {
        return document.getElementById("Target");
    },

    Update : function(X, Y)
    {
        var Targ = this.GetHtmlElement();
        Targ.style.left = X + 50;
        Targ.style.top  = Y + 100 - this.Size;
    },

    SetSize : function(newSize)
    {
        var Targ = this.GetHtmlElement();

        this.Size = newSize;
        Targ.style.height = (Number(this.Size) + Number(0.3 * this.Size));
    },

    // Добавляем мигающий курсор
    Drawing_Init : function()
    {
        if ( this.IntervalId )
            clearInterval( this.IntervalId );
        this.IntervalId = setInterval( Drawing_Target_Draw, 500 );
        this.Show = true;
    },

    // Убираем мигающий курсор
    Drawing_Remove : function()
    {
        clearInterval( this.IntervalId );
        this.GetHtmlElement().style.display = "none";
        this.Show = false;
    }
};

var Cursor =
{
    Locked : false,

    Set_Type : function(Type)
    {
        if ( true != this.Locked )
            Canvas.GetHtmlElement().style.cursor = Type;
    },

    Lock : function()
    {
        this.Locked = true;
    },

    Unlock : function()
    {
        this.Locked = false;
    }
};

var Drag = {

    obj : null,

    init : function(o, oRoot, minX, maxX, minY, maxY, bSwapHorzRef, bSwapVertRef, fXMapper, fYMapper)
    {
        o.onmousedown   = Drag.start;

        o.hmode         = bSwapHorzRef ? false : true ;
        o.vmode         = bSwapVertRef ? false : true ;

        o.root = oRoot && oRoot != null ? oRoot : o ;

        if (o.hmode  && isNaN(parseInt(o.root.style.left  ))) o.root.style.left   = "0px";
        if (o.vmode  && isNaN(parseInt(o.root.style.top   ))) o.root.style.top    = "350px";
        if (!o.hmode && isNaN(parseInt(o.root.style.right ))) o.root.style.right  = "0px";
        if (!o.vmode && isNaN(parseInt(o.root.style.bottom))) o.root.style.bottom = "0px";

        o.minX  = typeof minX != 'undefined' ? minX : null;
        o.minY  = typeof minY != 'undefined' ? minY : null;
        o.maxX  = typeof maxX != 'undefined' ? maxX : null;
        o.maxY  = typeof maxY != 'undefined' ? maxY : null;

        o.xMapper = fXMapper ? fXMapper : null;
        o.yMapper = fYMapper ? fYMapper : null;

        o.root.onDragStart  = new Function();
        o.root.onDragEnd    = new Function();
        o.root.onDrag       = new Function();
    },

    start : function(e)
    {
        var o = Drag.obj = this;
        e = Drag.fixE(e);
        var y = parseInt(o.vmode ? o.root.style.top  : o.root.style.bottom);
        var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right );
        o.root.onDragStart(x, y);

        o.lastMouseX    = e.clientX;
        o.lastMouseY    = e.clientY;

        if (o.hmode) {
            if (o.minX != null) o.minMouseX = e.clientX - x + o.minX;
            if (o.maxX != null) o.maxMouseX = o.minMouseX + o.maxX - o.minX;
        } else {
            if (o.minX != null) o.maxMouseX = -o.minX + e.clientX + x;
            if (o.maxX != null) o.minMouseX = -o.maxX + e.clientX + x;
        }

        if (o.vmode) {
            if (o.minY != null) o.minMouseY = e.clientY - y + o.minY;
            if (o.maxY != null) o.maxMouseY = o.minMouseY + o.maxY - o.minY;
        } else {
            if (o.minY != null) o.maxMouseY = -o.minY + e.clientY + y;
            if (o.maxY != null) o.minMouseY = -o.maxY + e.clientY + y;
        }

        document.onmousemove    = Drag.drag;
        document.onmouseup      = Drag.end;

        return false;
    },

    drag : function(e)
    {
        e = Drag.fixE(e);
        var o = Drag.obj;

        var ey  = e.clientY;
        var ex  = e.clientX;
        var y = parseInt(o.vmode ? o.root.style.top  : o.root.style.bottom);
        var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right );
        var nx, ny;

        if (o.minX != null) ex = o.hmode ? Math.max(ex, o.minMouseX) : Math.min(ex, o.maxMouseX);
        if (o.maxX != null) ex = o.hmode ? Math.min(ex, o.maxMouseX) : Math.max(ex, o.minMouseX);
        if (o.minY != null) ey = o.vmode ? Math.max(ey, o.minMouseY) : Math.min(ey, o.maxMouseY);
        if (o.maxY != null) ey = o.vmode ? Math.min(ey, o.maxMouseY) : Math.max(ey, o.minMouseY);

        nx = x + ((ex - o.lastMouseX) * (o.hmode ? 1 : -1));
        ny = y + ((ey - o.lastMouseY) * (o.vmode ? 1 : -1));

        if (o.xMapper)      nx = o.xMapper(y)
        else if (o.yMapper) ny = o.yMapper(x)

        if(o.hmode)
        {
            Drag.obj.root.style.left = nx + "px";
        }
        else
        {
            Drag.obj.root.style.right = nx + "px";
        }
        
        if(o.vmode)
        {
            Drag.obj.root.style.top = ny + "px";
        }
        else
        {
            Drag.obj.root.style.bottom = ny + "px";
        }
        
        Drag.obj.lastMouseX = ex;
        Drag.obj.lastMouseY = ey;
        Drag.obj.root.onDrag(nx, ny);

        return false;
    },

    end : function()
    {
        document.onmousemove = null;
        document.onmouseup   = null;
        var x_pos = parseInt( Drag.obj.hmode ? Drag.obj.root.style.left : Drag.obj.root.style.right );
        var y_pos = parseInt( Drag.obj.vmode ? Drag.obj.root.style.top : Drag.obj.root.style.bottom );
        Drag.obj.root.onDragEnd( x_pos, y_pos );
        Drag.obj = null;
    },

    fixE : function(e)
    {
        if (typeof e == 'undefined') e = window.event;
        if (typeof e.layerX == 'undefined') e.layerX = e.offsetX;
        if (typeof e.layerY == 'undefined') e.layerY = e.offsetY;
        return e;
    }
};
