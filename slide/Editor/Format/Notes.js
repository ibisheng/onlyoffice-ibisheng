/**
 * Created by Sergey.Luzyanin on 4/11/2017.
 */
(function(){
    AscDFH.changesFactory[AscDFH.historyitem_NotesSetClrMap]  = AscDFH.CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_NotesSetShowMasterPhAnim]  = AscDFH.CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_NotesSetShowMasterSp]  = AscDFH.CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_NotesAddToSpTree]  = AscDFH.CChangesDrawingsContentPresentation;
    AscDFH.changesFactory[AscDFH.historyitem_NotesRemoveFromTree]  = AscDFH.CChangesDrawingsContentPresentation;
    AscDFH.changesFactory[AscDFH.historyitem_NotesSetBg]  = AscDFH.CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_NotesSetName]        = AscDFH.CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_NotesSetSlide]        = AscDFH.CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_NotesSetNotesMaster]        = AscDFH.CChangesDrawingsObject;


    AscDFH.drawingsChangesMap[AscDFH.historyitem_NotesSetClrMap]  = function(oClass, value){oClass.clrMap = value;};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_NotesSetShowMasterPhAnim]  = function(oClass, value){oClass.showMasterPhAnim = value;};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_NotesSetShowMasterSp]  = function(oClass, value){oClass.showMasterSp = value;};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_NotesSetName]        = function(oClass, value){oClass.cSld.name = value;};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_NotesSetSlide]        = function(oClass, value){oClass.slide = value;};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_NotesSetNotesMaster]        = function(oClass, value){oClass.Master = value;};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_NotesSetBg]  = function(oClass, value, FromLoad){
        oClass.cSld.Bg = value;
        if(FromLoad){
            var Fill;
            if(oClass.cSld.Bg && oClass.cSld.Bg.bgPr && oClass.cSld.Bg.bgPr.Fill)
            {
                Fill = oClass.cSld.Bg.bgPr.Fill;
            }
            if(typeof AscCommon.CollaborativeEditing !== "undefined")
            {
                if(Fill && Fill.fill && Fill.fill.type === Asc.c_oAscFill.FILL_TYPE_BLIP && typeof Fill.fill.RasterImageId === "string" && Fill.fill.RasterImageId.length > 0)
                {
                    AscCommon.CollaborativeEditing.Add_NewImage(AscCommon.getFullImageSrc2(Fill.fill.RasterImageId));
                }
            }
        }
    };

    AscDFH.drawingsConstructorsMap[AscDFH.historyitem_NotesSetBg]         = AscFormat.CBg;

    AscDFH.drawingContentChanges[AscDFH.historyitem_NotesAddToSpTree]    = function(oClass){return oClass.cSld.spTree;};
    AscDFH.drawingContentChanges[AscDFH.historyitem_NotesRemoveFromTree] = function(oClass){return oClass.cSld.spTree;};

    //Temporary function
    function GetNotesWidth(){
        return editor.WordControl.m_oNotes.HtmlElement.width/g_dKoef_mm_to_pix;
    }

    function CNotes(){
        this.clrMap = null;
        this.cSld = new AscFormat.CSld();
        this.showMasterPhAnim = null;
        this.showMasterSp     = null;
        this.slide            = null;

        this.Master      = null;

        this.kind = AscFormat.TYPE_KIND.NOTES;
        this.Id = AscCommon.g_oIdCounter.Get_NewId();
        AscCommon.g_oTableId.Add(this, this.Id);


        this.graphicObjects = new AscFormat.DrawingObjectsController(this);
    }

    CNotes.prototype.getObjectType = function(){
        return AscDFH.historyitem_type_Notes;
    };

    CNotes.prototype.Write_ToBinary2 = function(w){
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    };

    CNotes.prototype.Read_FromBinary2 = function(r){
        this.Id = r.GetString();
    };

    CNotes.prototype.setClMapOverride = function(pr){
        History.Add(new AscDFH.CChangesDrawingsObject(this, AscDFH.historyitem_NotesSetClrMap, this.clrMap, pr));
        this.clrMap = pr;
    };

    CNotes.prototype.setShowMasterPhAnim = function(pr){
        History.Add(new AscDFH.CChangesDrawingsBool(this, AscDFH.historyitem_NotesSetShowMasterPhAnim, this.showMasterPhAnim, pr));
        this.showMasterPhAnim = pr;
    };

    CNotes.prototype.setShowMasterSp = function (pr) {
        History.Add(new AscDFH.CChangesDrawingsBool(this, AscDFH.historyitem_NotesSetShowMasterSp, this.showMasterSp, pr));
        this.showMasterSp = pr;
    };

    CNotes.prototype.addToSpTreeToPos = function(pos, obj){
        var _pos = Math.max(0, Math.min(pos, this.cSld.spTree.length));
        History.Add(new AscDFH.CChangesDrawingsContentPresentation(this, AscDFH.historyitem_NotesAddToSpTree, _pos, [obj], true));
        this.cSld.spTree.splice(_pos, 0, obj);
    };

    CNotes.prototype.removeFromSpTreeByPos = function(pos){
        if(pos > -1 && pos < this.cSld.spTree.length){
            History.Add(new AscDFH.CChangesDrawingsContentPresentation(this, AscDFH.historyitem_NotesRemoveFromTree, pos, this.cSld.spTree.splice(pos, 1), false));
        }
    };

    CNotes.prototype.removeFromSpTreeById = function(id){
        for(var i = this.cSld.spTree.length - 1; i > -1; --i){
            if(this.cSld.spTree[i].Get_Id() === id){
                this.removeFromSpTreeByPos(i);
            }
        }
    };

    CNotes.prototype.changeBackground = function(bg){
        History.Add(new AscDFH.CChangesDrawingsObjectNoId(this, AscDFH.historyitem_NotesSetBg, this.cSld.Bg , bg));
        this.cSld.Bg = bg;
    };


    CNotes.prototype.setCSldName = function(pr){
        History.Add(new AscDFH.CChangesDrawingsString(this, AscDFH.historyitem_NotesSetName, this.cSld.name , pr));
        this.cSld.name = pr;
    };
    CNotes.prototype.setSlide = function(pr){
        History.Add(new AscDFH.CChangesDrawingsObject(this, AscDFH.historyitem_NotesSetSlide, this.slide , pr));
        this.slide = pr;
    };

    CNotes.prototype.setNotesMaster = function(pr){
        History.Add(new AscDFH.CChangesDrawingsObject(this, AscDFH.historyitem_NotesSetNotesMaster, this.Master , pr));
        this.Master = pr;
    };

    CNotes.prototype.getMatchingShape = Slide.prototype.getMatchingShape;

    CNotes.prototype.getWidth = function(){
        return GetNotesWidth();
    };

    CNotes.prototype.getBodyShape = function(){
        var aSpTree = this.cSld.spTree;
        for(var i = 0; i < aSpTree.length; ++i){
            var sp = aSpTree[i];
            if(sp.isPlaceholder()){
                if(sp.getPlaceholderType() === AscFormat.phType_body){
                    return sp;
                }
            }
        }
        return null;
    };

    CNotes.prototype.recalculate = function(){
    };

    CNotes.prototype.draw = function(graphics){
        var aSpTree = this.cSld.spTree;
        for(var i = 0; i < aSpTree.length; ++i){
            var sp = aSpTree[i];
            if(sp.isPlaceholder()){
                if(sp.getPlaceholderType() === AscFormat.phType_body){
                    sp.draw(graphics);
                    return;
                }
            }
        }
    };


    window['AscCommonSlide'] = window['AscCommonSlide'] || {};
    window['AscCommonSlide'].CNotes = CNotes;
    window['AscCommonSlide'].GetNotesWidth = GetNotesWidth;
})();
