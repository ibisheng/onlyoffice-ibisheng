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
                    AscCommon.CollaborativeEditing.Add_NewImage(Fill.fill.RasterImageId);
                }
            }
        }
    };

    AscDFH.drawingsConstructorsMap[AscDFH.historyitem_NotesSetBg]         = AscFormat.CBg;

    AscDFH.drawingContentChanges[AscDFH.historyitem_NotesAddToSpTree]    = function(oClass){return oClass.cSld.spTree;};
    AscDFH.drawingContentChanges[AscDFH.historyitem_NotesRemoveFromTree] = function(oClass){return oClass.cSld.spTree;};

    //Temporary function
    function GetNotesWidth(){
        return editor.WordControl.m_oDrawingDocument.Notes_GetWidth();
    }

    function CNotes(){
        this.clrMap = null;
        this.cSld = new AscFormat.CSld();
        this.showMasterPhAnim = null;
        this.showMasterSp     = null;
        this.slide            = null;

        this.Master      = null;


        this.m_oContentChanges = new AscCommon.CContentChanges(); // список изменений(добавление/удаление элементов)
        this.kind = AscFormat.TYPE_KIND.NOTES;
        this.Id = AscCommon.g_oIdCounter.Get_NewId();

        this.Lock = new AscCommon.CLock();
        AscCommon.g_oTableId.Add(this, this.Id);


        this.graphicObjects = new AscFormat.DrawingObjectsController(this);
    }


    CNotes.prototype.Clear_ContentChanges = function()
    {
        this.m_oContentChanges.Clear();
    };

    CNotes.prototype.Add_ContentChanges = function(Changes)
    {
        this.m_oContentChanges.Add( Changes );
    };

    CNotes.prototype.Refresh_ContentChanges = function()
    {
        this.m_oContentChanges.Refresh();
    };


    CNotes.prototype.getObjectType = function(){
        return AscDFH.historyitem_type_Notes;
    };

    CNotes.prototype.Get_Id = function () {
        return this.Id;
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


    CNotes.prototype.getAllFonts = function(fonts)
    {
        var i;
        for(i = 0; i < this.cSld.spTree.length; ++i)
        {
            if(typeof  this.cSld.spTree[i].getAllFonts === "function")
                this.cSld.spTree[i].getAllFonts(fonts);
        }
    };

    CNotes.prototype.getDrawingDocument = function()
    {
        return editor.WordControl.m_oDrawingDocument;
    };

    CNotes.prototype.getTheme = function(){
        return this.Master.Theme;
    };

    CNotes.prototype.Refresh_RecalcData = function(){

    };

    CNotes.prototype.Refresh_RecalcData2 = function(){

    };

    CNotes.prototype.createDuplicate = function(IdMap){

        var oIdMap = IdMap || {};
        var copy = new CNotes();
        if(this.clrMap){
            copy.setClMapOverride(this.clrMap.createDuplicate());
        }

        if(typeof this.cSld.name === "string" && this.cSld.name.length > 0)
        {
            copy.setCSldName(this.cSld.name);
        }
        if(this.cSld.Bg)
        {
            copy.changeBackground(this.cSld.Bg.createFullCopy());
        }
        for(var i = 0; i < this.cSld.spTree.length; ++i)
        {
            var _copy;
            if(this.cSld.spTree[i].getObjectType() === AscDFH.historyitem_type_GroupShape){
                _copy = this.cSld.spTree[i].copy(oIdMap);
            }
            else{
                _copy = this.cSld.spTree[i].copy();
            }
            if(AscCommon.isRealObject(oIdMap)){
                oIdMap[this.cSld.spTree[i].Id] = _copy.Id;
            }
            copy.addToSpTreeToPos(copy.cSld.spTree.length, _copy);
            copy.cSld.spTree[copy.cSld.spTree.length - 1].setParent2(copy);
        }
        if(AscFormat.isRealBool(this.showMasterPhAnim))
        {
            copy.setShowMasterPhAnim(this.showMasterPhAnim);
        }
        if(AscFormat.isRealBool(this.showMasterSp))
        {
            copy.setShowMasterSp(this.showMasterSp);
        }
        copy.setNotesMaster(this.Master);

        return copy;
    };


    CNotes.prototype.isEmptyBody = function(){
        var oBodyShape = this.getBodyShape();
        if(!oBodyShape){
            return true;
        }
        return oBodyShape.isEmptyPlaceholder();
    };

    CNotes.prototype.showDrawingObjects = function(){
        var oPresentation = editor.WordControl.m_oLogicDocument;
        if(this.slide){
            if(oPresentation.CurPage === this.slide.num){
                editor.WordControl.m_oDrawingDocument.Notes_OnRecalculate(this.slide.num, this.slide.NotesWidth, this.slide.getNotesHeight());
            }
        }
    };

    CNotes.prototype.OnUpdateOverlay = function()
    {
        editor.WordControl.OnUpdateOverlay();
    };
    CNotes.prototype.getDrawingsForController = function()
    {
        var _ret = [];
        var oBodyShape = this.getBodyShape();
        if(oBodyShape){
            _ret.push(oBodyShape);
        }
        return _ret;
    };
    CNotes.prototype.sendGraphicObjectProps = function()
    {
        editor.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
    };
    CNotes.prototype.isViewerMode = function()
    {
        editor.WordControl.m_oLogicDocument.IsViewMode();
    };
    CNotes.prototype.convertPixToMM = function(pix)
    {
        return editor.WordControl.m_oDrawingDocument.GetMMPerDot(pix);
    };

    CNotes.prototype.Clear_ContentChanges = function()
    {
    };

    CNotes.prototype.Add_ContentChanges = function(Changes)
    {
    };

    CNotes.prototype.Refresh_ContentChanges = function()
    {
    };

    function CreateNotes(){
        var oN = new CNotes();
        var oSp = new AscFormat.CShape();
        oSp.setBDeleted(false);
        var oNvSpPr = new AscFormat.UniNvPr();
        var oCNvPr = oNvSpPr.cNvPr;
        oCNvPr.setId(2);
        oCNvPr.setName("Slide Image Placeholder 1");
        var oPh = new AscFormat.Ph();
        oPh.setType(AscFormat.phType_sldImg);
        oNvSpPr.nvPr.setPh(oPh);
        oSp.setNvSpPr(oNvSpPr);
        oSp.setLockValue(AscFormat.LOCKS_MASKS.noGrp, true);
        oSp.setLockValue(AscFormat.LOCKS_MASKS.noRot, true);
        oSp.setLockValue(AscFormat.LOCKS_MASKS.noChangeAspect, true);
        oSp.setSpPr(new AscFormat.CSpPr());
        oSp.spPr.setParent(oSp);
        oSp.setParent(oN);
        oN.addToSpTreeToPos(0, oSp);

        oSp = new AscFormat.CShape();
        oSp.setBDeleted(false);
        oNvSpPr = new AscFormat.UniNvPr();
        oCNvPr = oNvSpPr.cNvPr;
        oCNvPr.setId(3);
        oCNvPr.setName("Notes Placeholder 2");
        oPh = new AscFormat.Ph();
        oPh.setType(AscFormat.phType_body);
        oPh.setIdx(1 + "");
        oNvSpPr.nvPr.setPh(oPh);
        oSp.setNvSpPr(oNvSpPr);
        oSp.setLockValue(AscFormat.LOCKS_MASKS.noGrp, true);
        oSp.setSpPr(new AscFormat.CSpPr());
        oSp.spPr.setParent(oSp);
        oSp.createTextBody();
        var oBodyPr = new AscFormat.CBodyPr();
        oSp.txBody.setBodyPr(oBodyPr);
        var oTxLstStyle = new AscFormat.TextListStyle();
        oSp.txBody.setLstStyle(oTxLstStyle);
        oSp.setParent(oN);
        oN.addToSpTreeToPos(1, oSp);

        oSp = new AscFormat.CShape();
        oSp.setBDeleted(false);
        oNvSpPr = new AscFormat.UniNvPr();
        oCNvPr = oNvSpPr.cNvPr;
        oCNvPr.setId(4);
        oCNvPr.setName("Slide Number Placeholder 3");
        oPh = new AscFormat.Ph();
        oPh.setType(AscFormat.phType_sldNum);
        oPh.setSz(2);
        oPh.setIdx(10 + "");
        oNvSpPr.nvPr.setPh(oPh);
        oSp.setNvSpPr(oNvSpPr);
        oSp.setLockValue(AscFormat.LOCKS_MASKS.noGrp, true);
        oSp.setSpPr(new AscFormat.CSpPr());
        oSp.spPr.setParent(oSp);
        oSp.createTextBody();
        oBodyPr = new AscFormat.CBodyPr();
        oSp.txBody.setBodyPr(oBodyPr);
        oTxLstStyle = new AscFormat.TextListStyle();
        oSp.txBody.setLstStyle(oTxLstStyle);
        oSp.setParent(oN);
        oN.addToSpTreeToPos(2, oSp);
        return oN;
    }

    window['AscCommonSlide'] = window['AscCommonSlide'] || {};
    window['AscCommonSlide'].CNotes = CNotes;
    window['AscCommonSlide'].GetNotesWidth = GetNotesWidth;
    window['AscCommonSlide'].CreateNotes = CreateNotes;
})();
