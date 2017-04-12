/**
 * Created by Sergey.Luzyanin on 4/11/2017.
 */
(function(){

    AscDFH.changesFactory[AscDFH.historyitem_NotesMasterSetNotesTheme]  = AscDFH.CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_NotesMasterSetHF]          = AscDFH.CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_NotesMasterSetNotesStyle]  = AscDFH.CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_NotesMasterAddToSpTree]    = AscDFH.CChangesDrawingsContentPresentation;
    AscDFH.changesFactory[AscDFH.historyitem_NotesMasterRemoveFromTree] = AscDFH.CChangesDrawingsContentPresentation;
    AscDFH.changesFactory[AscDFH.historyitem_NotesMasterSetBg]          = AscDFH.CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_NotesMasterAddToNotesLst]  = AscDFH.CChangesDrawingsContentPresentation;
    AscDFH.changesFactory[AscDFH.historyitem_NotesMasterSetName]        = AscDFH.CChangesDrawingsString;


    AscDFH.drawingsChangesMap[AscDFH.historyitem_NotesMasterSetNotesTheme]  = function(oClass, value){oClass.theme = value;};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_NotesMasterSetHF]          = function(oClass, value){oClass.hf = value;};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_NotesMasterSetNotesStyle]  = function(oClass, value){oClass.notesStyle = value;};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_NotesMasterSetName]        = function(oClass, value){oClass.cSld.name = value;};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_NotesMasterSetBg]          = function(oClass, value, FromLoad){
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

    AscDFH.drawingsConstructorsMap[AscDFH.historyitem_NotesMasterSetNotesStyle] = AscFormat.CTextStyles;
    AscDFH.drawingsConstructorsMap[AscDFH.historyitem_NotesMasterSetBg]         = AscFormat.CBg;

    AscDFH.drawingContentChanges[AscDFH.historyitem_NotesMasterAddToSpTree]    = function(oClass){return oClass.cSld.spTree;};
    AscDFH.drawingContentChanges[AscDFH.historyitem_NotesMasterRemoveFromTree] = function(oClass){return oClass.cSld.spTree;};
    AscDFH.drawingContentChanges[AscDFH.historyitem_NotesMasterAddToNotesLst]  = function(oClass){return oClass.notesLst;};

    function CNotesMaster(){
        this.clrMap = new AscFormat.ClrMap();
        this.cSld =  new AscFormat.CSld();
        this.hf = null;
        this.notesStyle = null;

        this.theme = null;
        this.notesLst = [];

        this.Id = AscCommon.g_oIdCounter.Get_NewId();
        AscCommon.g_oTableId.Add(this, this.Id);
    }

    CNotesMaster.prototype.Write_ToBinary2 = function(w){
        w.WriteLong(AscDFH.historyitem_type_NotesMaster);
        w.WriteString2(this.Id);
    };

    CNotesMaster.prototype.Read_FromBinary2 = function(r){
        this.Id = r.GetString();
    };

    CNotesMaster.prototype.setTheme = function(pr){
        History.Add(AscDFH.CChangesDrawingsObject(this, AscDFH.historyitem_NotesMasterSetNotesTheme, this.theme, pr));
        this.theme = pr;
    };

    CNotesMaster.prototype.setHF = function(pr){
        History.Add(AscDFH.CChangesDrawingsObject(this, AscDFH.historyitem_NotesMasterSetHF, this.hf, pr));
        this.hf = pr;
    };

    CNotesMaster.prototype.setNotesStyle = function(pr){
        History.Add(new AscDFH.CChangesDrawingsObjectNoId(this, AscDFH.historyitem_NotesMasterSetNotesStyle, this.notesStyle, pr));
        this.notesStyle = pr;
    };

    CNotesMaster.prototype.addToSpTreeToPos = function(pos, obj){
        var _pos = Math.max(0, Math.min(pos, this.cSld.spTree.length));
        History.Add(new AscDFH.CChangesDrawingsContentPresentation(this, AscDFH.historyitem_NotesMasterAddToSpTree, _pos, [obj], true));
        this.cSld.spTree.splice(_pos, 0, obj);
    };

    CNotesMaster.prototype.removeFromSpTreeByPos = function(pos){
        if(pos > -1 && pos < this.cSld.spTree.length){
            History.Add(new AscDFH.CChangesDrawingsContentPresentation(this, AscDFH.historyitem_NotesMasterRemoveFromTree, pos, this.cSld.spTree.splice(pos, 1), false));
        }
    };

    CNotesMaster.prototype.removeFromSpTreeById = function(id){
        for(var i = this.cSld.spTree.length - 1; i > -1; --i){
            if(this.cSld.spTree[i].Get_Id() === id){
                this.removeFromSpTreeByPos(i);
            }
        }
    };

    CNotesMaster.prototype.changeBackground = function(bg){
        History.Add(new AscDFH.CChangesDrawingsObjectNoId(this, AscDFH.historyitem_NotesMasterSetBg, this.cSld.Bg , bg));
        this.cSld.Bg = bg;
    };

    CNotesMaster.prototype.setCSldName = function(pr){
        History.Add(new AscDFH.CChangesDrawingsString(this, AscDFH.historyitem_NotesMasterSetName, this.cSld.name , pr));
        this.cSld.name = pr;
    };

    CNotesMaster.prototype.addToNotesLst = function (pr, pos) {
        var _pos = AscFormat.isRealNumber(pos) ? Math.max(0, Math.min(pos, this.notesLst.length)) : this.notesLst.length;
        History.Add(new AscDFH.CChangesDrawingsContentPresentation(this, AscDFH.historyitem_NotesMasterAddToNotesLst, _pos, [pr], true));
        this.notesLst.splice(_pos, 0, pr);
    };

    window['AscCommonSlide'] = window['AscCommonSlide'] || {};
    window['AscCommonSlide'].CNotesMaster = CNotesMaster;
})();