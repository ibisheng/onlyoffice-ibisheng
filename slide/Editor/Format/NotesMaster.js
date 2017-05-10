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


    AscDFH.drawingsChangesMap[AscDFH.historyitem_NotesMasterSetNotesTheme]  = function(oClass, value){oClass.Theme = value;};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_NotesMasterSetHF]          = function(oClass, value){oClass.hf = value;};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_NotesMasterSetNotesStyle]  = function(oClass, value){oClass.txStyles = value;};
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

    AscDFH.drawingsConstructorsMap[AscDFH.historyitem_NotesMasterSetNotesStyle] = AscFormat.TextListStyle;
    AscDFH.drawingsConstructorsMap[AscDFH.historyitem_NotesMasterSetBg]         = AscFormat.CBg;

    AscDFH.drawingContentChanges[AscDFH.historyitem_NotesMasterAddToSpTree]    = function(oClass){return oClass.cSld.spTree;};
    AscDFH.drawingContentChanges[AscDFH.historyitem_NotesMasterRemoveFromTree] = function(oClass){return oClass.cSld.spTree;};
    AscDFH.drawingContentChanges[AscDFH.historyitem_NotesMasterAddToNotesLst]  = function(oClass){return oClass.notesLst;};

    function CNotesMaster(){
        this.clrMap = new AscFormat.ClrMap();
        this.cSld =  new AscFormat.CSld();
        this.hf = null;
        this.txStyles = null;

        this.Theme = null;
        this.kind = AscFormat.TYPE_KIND.NOTES_MASTER;
        this.notesLst = [];

        this.Id = AscCommon.g_oIdCounter.Get_NewId();
        AscCommon.g_oTableId.Add(this, this.Id);
    }


    CNotesMaster.prototype.getObjectType = function(){
        return AscDFH.historyitem_type_NotesMaster;
    };


    CNotesMaster.prototype.Write_ToBinary2 = function(w){
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    };

    CNotesMaster.prototype.Read_FromBinary2 = function(r){
        this.Id = r.GetString();
    };

    CNotesMaster.prototype.setTheme = function(pr){
        History.Add(AscDFH.CChangesDrawingsObject(this, AscDFH.historyitem_NotesMasterSetNotesTheme, this.Theme, pr));
        this.Theme = pr;
    };

    CNotesMaster.prototype.setHF = function(pr){
        History.Add(AscDFH.CChangesDrawingsObject(this, AscDFH.historyitem_NotesMasterSetHF, this.hf, pr));
        this.hf = pr;
    };

    CNotesMaster.prototype.setNotesStyle = function(pr){
        History.Add(new AscDFH.CChangesDrawingsObjectNoId(this, AscDFH.historyitem_NotesMasterSetNotesStyle, this.txStyles, pr));
        this.txStyles = pr;
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


    CNotesMaster.prototype.getMatchingShape = Slide.prototype.getMatchingShape;

    CNotesMaster.prototype.addToNotesLst = function (pr, pos) {
        var _pos = AscFormat.isRealNumber(pos) ? Math.max(0, Math.min(pos, this.notesLst.length)) : this.notesLst.length;
        History.Add(new AscDFH.CChangesDrawingsContentPresentation(this, AscDFH.historyitem_NotesMasterAddToNotesLst, _pos, [pr], true));
        this.notesLst.splice(_pos, 0, pr);
    };


    CNotesMaster.prototype.getAllFonts = function(fonts)
    {
        var i;
        if(this.Theme){
            this.Theme.Document_Get_AllFontNames(fonts);
        }

        if(this.txStyles){
            this.txStyles.Document_Get_AllFontNames(fonts);
        }

        for(i = 0; i < this.notesLst.length; ++i){
            this.notesLst[i].getAllFonts(fonts);
        }

        for(i = 0; i < this.cSld.spTree.length; ++i)
        {
            if(typeof  this.cSld.spTree[i].getAllFonts === "function")
                this.cSld.spTree[i].getAllFonts(fonts);
        }
    };

    function CreateNotesMaster(){
        var oNM = new CNotesMaster();
        var oBG = new AscFormat.CBg();
        var oBgRef = new AscFormat.StyleRef();
        oBgRef.idx = 1001;
        var oUniColor = new AscFormat.CUniColor();
        oUniColor.color = new AscFormat.CSchemeColor();
        oUniColor.color.id = 6;//bg1
        oBgRef.Color = oUniColor;
        oBG.bgRef = oBgRef;
        oNM.changeBackground(oBG);

        var oSp = new AscFormat.CShape();
        var oNvSpPr = new AscFormat.UniNvPr();
        var oCNvPr = oNvSpPr.cNvPr;
        oCNvPr.setId(2);
        oCNvPr.setName("Header Placeholder 1");
        var oPh = new AscFormat.Ph();
        oPh.setType(AscFormat.phType_hdr);
        oPh.setSz(2);
        oNvSpPr.nvPr.setPh(oPh);
        oSp.setNvSpPr(oNvSpPr);
        oSp.setLockValue(AscFormat.LOCKS_MASKS.noGrp, true);
        oSp.setSpPr(new AscFormat.CSpPr());
        oSp.spPr.setParent(oSp);
        oSp.spPr.xfrm.setParent(oSp.spPr);
        oSp.spPr.setXfrm(new AscFormat.CXfrm());
        oSp.spPr.xfrm.setOffX(0);
        oSp.spPr.xfrm.setOffY(0);
        oSp.spPr.xfrm.setExtX(2971800/36000);
        oSp.spPr.xfrm.setExtY(458788/36000);
        oSp.spPr.setGeometry(AscFormat.CreateGeometry("rect"));
        oSp.spPr.geometry.setParent(oSp.spPr);
        oSp.createTextBody();
        var oBodyPr = oSp.txBody.bodyPr.createDuplicate();
        oBodyPr.vert = AscFormat.nVertTThorz;
        oBodyPr.lIns = 91440/36000;
        oBodyPr.tIns = 45720/36000;
        oBodyPr.rIns = 91440/36000;
        oBodyPr.bIns = 45720/36000;
        oBodyPr.rtlCol = false;
        oBodyPr.anchor = 1;
        oSp.txBody.setBodyPr(oBodyPr);
        var oTxLstStyle = new AscFormat.TextListStyle();
        oTxLstStyle.levels[0] =  new CParaPr();
        oTxLstStyle.levels[0].Jc = AscCommon.align_Left;
        oTxLstStyle.levels[0].DefaultRunPr = new AscCommon.CTextPr();
        oTxLstStyle.levels[0].DefaultRunPr.FontSize = 12;
        oSp.txBody.setLstStyle(oTxLstStyle);
        oSp.setParent(oNM);
        oNM.addToSpTreeToPos(0, oSp);
        //endParaPr

        oSp = new AscFormat.CShape();
        oNvSpPr = new AscFormat.UniNvPr();
        oCNvPr = oNvSpPr.cNvPr;
        oCNvPr.setId(3);
        oCNvPr.setName("Date Placeholder 2");
        oPh = new AscFormat.Ph();
        oPh.setType(AscFormat.phType_dt);
        oPh.setIdx(1);
        oNvSpPr.nvPr.setPh(oPh);
        oSp.setNvSpPr(oNvSpPr);
        oSp.setLockValue(AscFormat.LOCKS_MASKS.noGrp, true);
        oSp.setSpPr(new AscFormat.CSpPr());
        oSp.spPr.setParent(oSp);
        oSp.spPr.xfrm.setParent(oSp.spPr);
        oSp.spPr.setXfrm(new AscFormat.CXfrm());
        oSp.spPr.xfrm.setOffX(3884613/36000);
        oSp.spPr.xfrm.setOffY(0);
        oSp.spPr.xfrm.setExtX(2971800/36000);
        oSp.spPr.xfrm.setExtY(458788/36000);
        oSp.spPr.setGeometry(AscFormat.CreateGeometry("rect"));
        oSp.spPr.geometry.setParent(oSp.spPr);
        oSp.createTextBody();
        oBodyPr = oSp.txBody.bodyPr.createDuplicate();
        oBodyPr.vert = AscFormat.nVertTThorz;
        oBodyPr.lIns = 91440/36000;
        oBodyPr.tIns = 45720/36000;
        oBodyPr.rIns = 91440/36000;
        oBodyPr.bIns = 45720/36000;
        oBodyPr.rtlCol = false;
        oBodyPr.anchor = 1;
        oSp.txBody.setBodyPr(oBodyPr);
        oTxLstStyle = new AscFormat.TextListStyle();
        oTxLstStyle.levels[0] =  new CParaPr();
        oTxLstStyle.levels[0].Jc = AscCommon.align_Right;
        oTxLstStyle.levels[0].DefaultRunPr = new AscCommon.CTextPr();
        oTxLstStyle.levels[0].DefaultRunPr.FontSize = 12;
        //endParaPr
        oSp.txBody.setLstStyle(oTxLstStyle);
        oSp.setParent(oNM);
        oNM.addToSpTreeToPos(1, oSp);

        oSp = new AscFormat.CShape();
        oNvSpPr = new AscFormat.UniNvPr();
        oCNvPr = oNvSpPr.cNvPr;
        oCNvPr.setId(3);
        oCNvPr.setName("Date Placeholder 2");
        oPh = new AscFormat.Ph();
        oPh.setType(AscFormat.phType_dt);
        oPh.setIdx(1);
        oNvSpPr.nvPr.setPh(oPh);
        oSp.setNvSpPr(oNvSpPr);
        oSp.setLockValue(AscFormat.LOCKS_MASKS.noGrp, true);
        oSp.setSpPr(new AscFormat.CSpPr());
        oSp.spPr.setParent(oSp);
        oSp.spPr.xfrm.setParent(oSp.spPr);
        oSp.spPr.setXfrm(new AscFormat.CXfrm());
        oSp.spPr.xfrm.setOffX(3884613/36000);
        oSp.spPr.xfrm.setOffY(0);
        oSp.spPr.xfrm.setExtX(2971800/36000);
        oSp.spPr.xfrm.setExtY(458788/36000);
        oSp.spPr.setGeometry(AscFormat.CreateGeometry("rect"));
        oSp.spPr.geometry.setParent(oSp.spPr);
        oSp.createTextBody();
        oBodyPr = oSp.txBody.bodyPr.createDuplicate();
        oBodyPr.vert = AscFormat.nVertTThorz;
        oBodyPr.lIns = 91440/36000;
        oBodyPr.tIns = 45720/36000;
        oBodyPr.rIns = 91440/36000;
        oBodyPr.bIns = 45720/36000;
        oBodyPr.rtlCol = false;
        oBodyPr.anchor = 1;
        oSp.txBody.setBodyPr(oBodyPr);
        oTxLstStyle = new AscFormat.TextListStyle();
        oTxLstStyle.levels[0] =  new CParaPr();
        oTxLstStyle.levels[0].Jc = AscCommon.align_Right;
        oTxLstStyle.levels[0].DefaultRunPr = new AscCommon.CTextPr();
        oTxLstStyle.levels[0].DefaultRunPr.FontSize = 12;
        //endParaPr
        oSp.txBody.setLstStyle(oTxLstStyle);
        oSp.setParent(oNM);
        oNM.addToSpTreeToPos(2, oSp);

        oSp = new AscFormat.CShape();
        oNvSpPr = new AscFormat.UniNvPr();
        oCNvPr = oNvSpPr.cNvPr;
        oCNvPr.setId(5);
        oCNvPr.setName("Notes Placeholder 4");
        oPh = new AscFormat.Ph();
        oPh.setType(AscFormat.phType_body);
        oPh.setIdx(1);
        oPh.setSz(2);
        oNvSpPr.nvPr.setPh(oPh);
        oSp.setNvSpPr(oNvSpPr);
        oSp.setLockValue(AscFormat.LOCKS_MASKS.noGrp, true);
        oSp.setSpPr(new AscFormat.CSpPr());
        oSp.spPr.setParent(oSp);
        oSp.spPr.xfrm.setParent(oSp.spPr);
        oSp.spPr.setXfrm(new AscFormat.CXfrm());
        oSp.spPr.xfrm.setOffX(685800/36000);
        oSp.spPr.xfrm.setOffY(4400550/36000);
        oSp.spPr.xfrm.setExtX(5486400/36000);
        oSp.spPr.xfrm.setExtY(3600450/36000);
        oSp.spPr.setGeometry(AscFormat.CreateGeometry("rect"));
        oSp.spPr.geometry.setParent(oSp.spPr);
        oSp.createTextBody();
        oBodyPr = oSp.txBody.bodyPr.createDuplicate();
        oBodyPr.vert = AscFormat.nVertTThorz;
        oBodyPr.lIns = 91440/36000;
        oBodyPr.tIns = 45720/36000;
        oBodyPr.rIns = 91440/36000;
        oBodyPr.bIns = 45720/36000;
        oBodyPr.rtlCol = false;
        oBodyPr.anchor = 1;
        oSp.txBody.setBodyPr(oBodyPr);
        oTxLstStyle = new AscFormat.TextListStyle();
        //endParaPr
        oSp.txBody.setLstStyle(oTxLstStyle);
        oSp.setParent(oNM);
        oNM.addToSpTreeToPos(3, oSp);

        oSp = new AscFormat.CShape();
        oNvSpPr = new AscFormat.UniNvPr();
        oCNvPr = oNvSpPr.cNvPr;
        oCNvPr.setId(6);
        oCNvPr.setName("Footer Placeholder 5");
        oPh = new AscFormat.Ph();
        oPh.setType(AscFormat.phType_ftr);
        oPh.setIdx(4);
        oPh.setSz(2);
        oNvSpPr.nvPr.setPh(oPh);
        oSp.setNvSpPr(oNvSpPr);
        oSp.setLockValue(AscFormat.LOCKS_MASKS.noGrp, true);
        oSp.setSpPr(new AscFormat.CSpPr());
        oSp.spPr.setParent(oSp);
        oSp.spPr.xfrm.setParent(oSp.spPr);
        oSp.spPr.setXfrm(new AscFormat.CXfrm());
        oSp.spPr.xfrm.setOffX(0);
        oSp.spPr.xfrm.setOffY(8685213/36000);
        oSp.spPr.xfrm.setExtX(2971800/36000);
        oSp.spPr.xfrm.setExtY(458787/36000);
        oSp.spPr.setGeometry(AscFormat.CreateGeometry("rect"));
        oSp.spPr.geometry.setParent(oSp.spPr);
        oSp.createTextBody();
        oBodyPr = oSp.txBody.bodyPr.createDuplicate();
        oBodyPr.vert = AscFormat.nVertTThorz;
        oBodyPr.lIns = 91440/36000;
        oBodyPr.tIns = 45720/36000;
        oBodyPr.rIns = 91440/36000;
        oBodyPr.bIns = 45720/36000;
        oBodyPr.rtlCol = false;
        oBodyPr.anchor = 0;
        oSp.txBody.setBodyPr(oBodyPr);
        oTxLstStyle = new AscFormat.TextListStyle();
        oTxLstStyle.levels[0] =  new CParaPr();
        oTxLstStyle.levels[0].Jc = AscCommon.align_Left;
        oTxLstStyle.levels[0].DefaultRunPr = new AscCommon.CTextPr();
        oTxLstStyle.levels[0].DefaultRunPr.FontSize = 12;
        //endParaPr
        oSp.txBody.setLstStyle(oTxLstStyle);
        oSp.setParent(oNM);
        oNM.addToSpTreeToPos(4, oSp);

        oSp = new AscFormat.CShape();
        oNvSpPr = new AscFormat.UniNvPr();
        oCNvPr = oNvSpPr.cNvPr;
        oCNvPr.setId(7);
        oCNvPr.setName("Slide Number Placeholder 6");
        oPh = new AscFormat.Ph();
        oPh.setType(AscFormat.phType_sldNum);
        oPh.setIdx(5);
        oPh.setSz(2);
        oNvSpPr.nvPr.setPh(oPh);
        oSp.setNvSpPr(oNvSpPr);
        oSp.setLockValue(AscFormat.LOCKS_MASKS.noGrp, true);
        oSp.setSpPr(new AscFormat.CSpPr());
        oSp.spPr.setParent(oSp);
        oSp.spPr.xfrm.setParent(oSp.spPr);
        oSp.spPr.setXfrm(new AscFormat.CXfrm());
        oSp.spPr.xfrm.setOffX(3884613/36000);
        oSp.spPr.xfrm.setOffY(8685213/36000);
        oSp.spPr.xfrm.setExtX(2971800/36000);
        oSp.spPr.xfrm.setExtY(458787/36000);
        oSp.spPr.setGeometry(AscFormat.CreateGeometry("rect"));
        oSp.spPr.geometry.setParent(oSp.spPr);
        oSp.createTextBody();
        oBodyPr = oSp.txBody.bodyPr.createDuplicate();
        oBodyPr.vert = AscFormat.nVertTThorz;
        oBodyPr.lIns = 91440/36000;
        oBodyPr.tIns = 45720/36000;
        oBodyPr.rIns = 91440/36000;
        oBodyPr.bIns = 45720/36000;
        oBodyPr.rtlCol = false;
        oBodyPr.anchor = 0;
        oSp.txBody.setBodyPr(oBodyPr);
        oTxLstStyle = new AscFormat.TextListStyle();
        oTxLstStyle.levels[0] =  new CParaPr();
        oTxLstStyle.levels[0].Jc = AscCommon.align_Right;
        oTxLstStyle.levels[0].DefaultRunPr = new AscCommon.CTextPr();
        oTxLstStyle.levels[0].DefaultRunPr.FontSize = 12;
        //endParaPr
        oSp.txBody.setLstStyle(oTxLstStyle);
        oSp.setParent(oNM);
        oNM.addToSpTreeToPos(5, oSp);

        //clrMap
        oNM.clrMap.setClr(0, 0);
        oNM.clrMap.setClr(1, 1);
        oNM.clrMap.setClr(2, 2);
        oNM.clrMap.setClr(3, 3);
        oNM.clrMap.setClr(4, 4);
        oNM.clrMap.setClr(5, 5);
        oNM.clrMap.setClr(10, 10);
        oNM.clrMap.setClr(11, 11);
        oNM.clrMap.setClr(6, 12);
        oNM.clrMap.setClr(7, 13);
        oNM.clrMap.setClr(15, 8);
        oNM.clrMap.setClr(16, 9);

        oTxLstStyle = new AscFormat.TextListStyle();

        oTxLstStyle.levels[0] =  new CParaPr();
        oTxLstStyle.levels[0].Ind.Left = 0;
        oTxLstStyle.levels[0].Jc = AscCommon.align_Left;
        oTxLstStyle.levels[0].DefaultTabSize = 914400/36000;

        oTxLstStyle.levels[0].DefaultRunPr = new AscCommon.CTextPr();
        oTxLstStyle.levels[0].DefaultRunPr.FontSize = 12;
        oTxLstStyle.levels[0].DefaultRunPr.Unifill = AscFormat.CreateUniFillSchemeColorWidthTint(15, 0);

        oTxLstStyle.levels[0].DefaultRunPr.RFonts.Ascii.Name = "+mn-lt";
        oTxLstStyle.levels[0].DefaultRunPr.RFonts.EastAsia.Name = "+mn-ea";
        oTxLstStyle.levels[0].DefaultRunPr.RFonts.CS.Name = "+mn-cd";

        oTxLstStyle.levels[1] = oTxLstStyle.levels[0].Copy();
        oTxLstStyle.levels[1].Ind.Left = 457200/36000;

        oTxLstStyle.levels[2] = oTxLstStyle.levels[0].Copy();
        oTxLstStyle.levels[2].Ind.Left = 914400/36000;

        oTxLstStyle.levels[3] = oTxLstStyle.levels[0].Copy();
        oTxLstStyle.levels[3].Ind.Left = 1371600/36000;

        oTxLstStyle.levels[4] = oTxLstStyle.levels[0].Copy();
        oTxLstStyle.levels[4].Ind.Left = 1828800/36000;

        oTxLstStyle.levels[5] = oTxLstStyle.levels[0].Copy();
        oTxLstStyle.levels[5].Ind.Left = 2286000/36000;

        oTxLstStyle.levels[6] = oTxLstStyle.levels[0].Copy();
        oTxLstStyle.levels[6].Ind.Left = 2743200/36000;

        oTxLstStyle.levels[7] = oTxLstStyle.levels[0].Copy();
        oTxLstStyle.levels[7].Ind.Left = 3200400/36000;

        oTxLstStyle.levels[8] = oTxLstStyle.levels[0].Copy();
        oTxLstStyle.levels[8].Ind.Left = 3657600/36000;
        oNM.setNotesStyle(oTxLstStyle);
        return oNM;
    }

    window['AscCommonSlide'] = window['AscCommonSlide'] || {};
    window['AscCommonSlide'].CNotesMaster = CNotesMaster;
    window['AscCommonSlide'].CreateNotesMaster = CreateNotesMaster;
})();