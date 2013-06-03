function clone2(obj) {

    if(obj == null || typeof(obj) != 'object') {

        return obj;
    }

    if(obj.constructor == Array) {

        var t=[];
        for(var i=0;i< obj.length; ++i){

            t[i]=clone(obj[i]);
        }
        return t;
    }

    var temp = {};
    for(var key in obj) {

        temp[key] = clone2(obj[key]);
    }

    return temp;
}


function CTableShape(DrawingDocument, Parent, slide) {

    this.DrawingDocument = DrawingDocument;
    this.Parent = Parent;
    this.slide  = slide;

    this.table = null;
    this.pH = 0;
    this.pV = 0;
    this.ext = {cx : 0, cy : 0};
    this.off = {x : 0, y : 0};
    this.rot = 0;
    this.flipH = false;
    this.flipV = false;
    this.text_flag = true;
    this.TransformMatrix = new CMatrix();
}

CTableShape.prototype = clone2(CShape.prototype);
CTableShape.prototype.Draw = function(graphics) {

        if(this.table) {

            this.table.Draw(this.slide.SlideNum, graphics);
        }
};

CTableShape.prototype.init = function(rows, cols) {

    var width = this.Parent.Width*0.75;
    var grid = [];

    for ( var i = 0; i < cols; ++i ) {

        grid[i] = width / cols;
    }

    this.pH = this.Parent.Width*0.125;
    this.pV = 70;
    this.off = {x : 0, y: 0};

    this.ext = {cx : width, cy : 40};
    this.table = new CTable(this.DrawingDocument, this, false, this.slide.SlideNum, this.pH, this.pV , this.pH+width, this.pV+rows*15, rows, cols, grid, 0);
    this.table.Recalculate();
    this.Recalculate();
};

CTableShape.prototype.init2 = function(rows, cols, grid, pH, pV, ext, off) {

    var width = ext.cx;

    this.pH = pH;
    this.pV = pV;
    this.off = off;

    this.ext = ext;
    this.table = new CTable(this.DrawingDocument, this, false, this.slide.SlideNum, this.pH, this.pV , this.pH+width, this.pV+rows*15, rows, cols, grid, 0);
    this.table.Recalculate();
    this.Recalculate();
};

CTableShape.prototype.updateThemeColors = function() {};

CTableShape.prototype.updateThemeFonts = function() {};

CTableShape.prototype.Get_Styles = function() {

    return this.Parent.Get_Styles();
};

CTableShape.prototype.Get_Numbering = function() {

    return this.Parent.Get_Numbering();
} ;

CTableShape.prototype.Get_PageContentStartPos = function() {

    return this.Parent.Get_PageContentStartPos(this.slide.SlideNum);
};


CTableShape.prototype.Select = function(graphics, zoom) {

        if(zoom == undefined)
            zoom = 100;
        var d=100/zoom;

        graphics.SetIntegerGrid(false);
        graphics.reset();
        graphics.transform3(this.TransformMatrix);
        graphics.m_oContext.fillStyle="rgb(202, 233, 236)";
        graphics.p_color(0,0,0,255);
        graphics.m_oContext.lineWidth=25/zoom;

        graphics._s();
        graphics._m(0, 0);
        graphics._l(this.ext.cx, 0);
        graphics._l(this.ext.cx, this.ext.cy);
        graphics._l(0, this.ext.cy);
        graphics._z();
        graphics.ds();
        circle(graphics, 0,0, d);
        circle(graphics, this.ext.cx,0, d);
        circle(graphics, this.ext.cx,this.ext.cy, d);
        circle(graphics, 0,this.ext.cy, d);

        if(this.ext.cx>min_size) {

            square(graphics, this.ext.cx/2,0, d);
            square(graphics, this.ext.cx/2,this.ext.cy, d);
        }

        if(this.ext.cy>min_size) {

            square(graphics, this.ext.cx,this.ext.cy/2, d);
            square(graphics, 0,this.ext.cy/2, d);
        }

        graphics.reset();
    };

CTableShape.prototype.DrawAdj = function (graphics) { };

CTableShape.prototype.HitAdj = function (x, y) {

        return {hit: false}
    };
CTableShape.prototype.updateCursorType  = function(x, y) {

    this.table.Update_CursorType(x, y, this.slide.SlideNum);
};
//CTableShape.prototype.Hit  = CTableShape.prototype.InTextRect;

CTableShape.prototype.InTextRect  = function(x, y) {

    return (x >= this.pH && x <=this.pH+this.ext.cx
        && y >= this.pV && y <= this.pV + this.ext.cy);
};

CTableShape.prototype.Move  = function(x, y) {

    this.pH = x;
    this.pV = y;
    this.RecalculateTransformMatrix();
    if(this.table != null) {

        this.table.Move(x, y, this.slide.SlideNum);
    }
};

CTableShape.prototype.Update_Position2 = function(X,Y,PageNum) {

    this.X = X;
    this.Y = Y;
    this.pH = X;
    this.pV = Y;
};

CTableShape.prototype.Rotate = function(rot) {};

CTableShape.prototype.Recalculate = function() {

    if(this.table != null ) {
        this.table.Move(this.pH, this.pV, this.slide.SlideNum);
        this.table.Recalculate();
    }
    this.RecalculateTransformMatrix();
};
CTableShape.prototype.Document_UpdateSelectionState = function() {

    if ( true === this.table.Is_SelectionUse() ) {

        if ( table_Selection_Border === this.table.Selection.Type2
            || table_Selection_Border_InnerTable === this.table.Selection.Type2 ) {

            // Убираем курсор, если он был
            this.DrawingDocument.TargetEnd();
        }
        else {

            this.DrawingDocument.TargetEnd();
            this.DrawingDocument.SelectEnabled(true);
            this.DrawingDocument.SelectClear();
            this.table.Selection_Draw();
            this.DrawingDocument.SelectShow();
        }
    }
    else {

        this.table.RecalculateCurPos();
        this.DrawingDocument.SelectEnabled(false);
        this.DrawingDocument.TargetStart();
        this.DrawingDocument.TargetShow();
        this.DrawingDocument.OnRecalculatePage(this.slide.SlideNum, this.slide);
        this.DrawingDocument.OnEndRecalculate(false, true);
    }
};

CTableShape.prototype.selectionSetStart = function(X,Y, PageIndex, MouseEvent) {

   return  this.table.Selection_SetStart(X,Y, PageIndex, MouseEvent);
};

CTableShape.prototype.selectionSetEnd = function(X,Y, PageIndex, MouseEvent) {

    return  this.table.Selection_SetEnd(X,Y, PageIndex, MouseEvent);
};

CTableShape.prototype.Selection_Is_OneElement = function() {
    return true;
};

CTableShape.prototype.RecalculateCurPos = function()
{
    this.table.RecalculateCurPos();
};

CTableShape.prototype.Paragraph_Add = function(ParaItem, bRecalculate) {

    this.table.Paragraph_Add(ParaItem, bRecalculate);
};

CTableShape.prototype.RecalculateContent = function() {
    this.table.Recalculate();
};

CTableShape.prototype.Select_All = function() {

    if (this.table) {

        this.table.Select_All();
    }
};

CTableShape.prototype.Remove = function(Count, bOnlyText, bRemoveOnlySelection) {

    if(this.table) {

        this.table.Remove(Count, bOnlyText, bRemoveOnlySelection)
    }
};

CTableShape.prototype.Cursor_MoveLeft = function(AddToSelect) {

    if(this.table) {

        this.table.Cursor_MoveLeft(AddToSelect)
    }
};

CTableShape.prototype.Cursor_MoveRight = function(AddToSelect) {

    if(this.table) {

        this.table.Cursor_MoveRight(AddToSelect)
    }
};

CTableShape.prototype.Cursor_MoveUp = function(AddToSelect) {

    if(this.table) {

        this.table.Cursor_MoveUp(AddToSelect)
    }
};

CTableShape.prototype.Cursor_MoveDown = function(AddToSelect) {

    if(this.table) {

        this.table.Cursor_MoveDown(AddToSelect)
    }
};

CTableShape.prototype.Is_TopDocument = function() {

    return true;
};
CTableShape.prototype.updateCursorType = function(x, y) {
    return false;
};
CTableShape.prototype.Add_NewParagraph = function(bRecalculate) {
    this.table.Add_NewParagraph(bRecalculate);
};

CTableShape.prototype.setNumbering = function(numberingInfo) {

    if(this.table ) {

        this.table.Set_ParagraphNumbering(numberingInfo);
    }
};


