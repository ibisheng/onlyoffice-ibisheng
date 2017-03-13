(function (window, undefined) {
    var drawingsChangesMap = {};
    var drawingConstructorsMap = {};
    var drawingContentChanges = {};
    window['AscDFH'].drawingsChangesMap = drawingsChangesMap;
    window['AscDFH'].drawingsConstructorsMap = drawingConstructorsMap;
    window['AscDFH'].drawingContentChanges = drawingContentChanges;


    var oPosExtMap = {};
    oPosExtMap[AscDFH.historyitem_Xfrm_SetOffX]  = true;
    oPosExtMap[AscDFH.historyitem_Xfrm_SetOffY]  = true;
    oPosExtMap[AscDFH.historyitem_Xfrm_SetExtX]  = true;
    oPosExtMap[AscDFH.historyitem_Xfrm_SetExtY]  = true;
    oPosExtMap[AscDFH.historyitem_Xfrm_SetChOffX]  = true;
    oPosExtMap[AscDFH.historyitem_Xfrm_SetChOffY]  = true;
    oPosExtMap[AscDFH.historyitem_Xfrm_SetChExtX]  = true;
    oPosExtMap[AscDFH.historyitem_Xfrm_SetChExtY]  = true;
    var oPosExtHor = {};
    oPosExtHor[AscDFH.historyitem_Xfrm_SetOffX]  = true;
    oPosExtHor[AscDFH.historyitem_Xfrm_SetExtX]  = true;
    oPosExtHor[AscDFH.historyitem_Xfrm_SetChOffX]  = true;
    oPosExtHor[AscDFH.historyitem_Xfrm_SetChExtX]  = true;
    function private_SetValue(Value) {
        if (!this.Class) {
            return;
        }
        if (AscDFH.drawingsChangesMap[this.Type]) {
            var _Value = Value === undefined ? null : Value;
            AscDFH.drawingsChangesMap[this.Type](this.Class, _Value, this.FromLoad);
        }
    }

    function CChangesDrawingsBool(Class, Type, OldPr, NewPr) {
        this.Type = Type;
        var _OldPr = AscFormat.isRealBool(OldPr) ? OldPr : undefined;
        var _NewPr = AscFormat.isRealBool(NewPr) ? NewPr : undefined;
		AscDFH.CChangesBaseBoolProperty.call(this, Class, _OldPr, _NewPr);
    }

	CChangesDrawingsBool.prototype = Object.create(AscDFH.CChangesBaseBoolProperty.prototype);
	CChangesDrawingsBool.prototype.constructor = CChangesDrawingsBool;
    CChangesDrawingsBool.prototype.private_SetValue = private_SetValue;
    CChangesDrawingsBool.prototype.Load = function(){
        this.Redo();
        this.RefreshRecalcData();
    };
    CChangesDrawingsBool.prototype.CreateReverseChange = function()
    {
        return new this.constructor(this.Class, this.Type, this.New, this.Old, this.Color);
    };

    CChangesDrawingsBool.prototype.ReadFromBinary = function (reader) {
        reader.Seek2(reader.GetCurPos() - 4);
        this.Type = reader.GetLong();
		AscDFH.CChangesBaseBoolProperty.prototype.ReadFromBinary.call(this, reader);
    };
    window['AscDFH'].CChangesDrawingsBool = CChangesDrawingsBool;


    function CChangesDrawingsLong(Class, Type, OldPr, NewPr) {
        this.Type = Type;
        var _OldPr = AscFormat.isRealNumber(OldPr) ? ((OldPr + 0.5) >> 0) : undefined;
        var _NewPr = AscFormat.isRealNumber(NewPr) ? ((NewPr + 0.5) >> 0) : undefined;
		AscDFH.CChangesBaseLongProperty.call(this, Class, _OldPr, _NewPr);
    }

	CChangesDrawingsLong.prototype = Object.create(AscDFH.CChangesBaseLongProperty.prototype);
	CChangesDrawingsLong.prototype.constructor = CChangesDrawingsLong;

    CChangesDrawingsLong.prototype.CreateReverseChange = function()
    {
        return new this.constructor(this.Class, this.Type, this.New, this.Old, this.Color);
    };

    CChangesDrawingsLong.prototype.private_SetValue = private_SetValue;
    CChangesDrawingsLong.prototype.Load = function(){
        this.Redo();
        this.RefreshRecalcData();
    };
    CChangesDrawingsLong.prototype.ReadFromBinary = function (reader) {
        reader.Seek2(reader.GetCurPos() - 4);
        this.Type = reader.GetLong();
		AscDFH.CChangesBaseLongProperty.prototype.ReadFromBinary.call(this, reader);
    };
    window['AscDFH'].CChangesDrawingsLong = CChangesDrawingsLong;

    function CChangesDrawingsDouble(Class, Type, OldPr, NewPr) {
        this.Type = Type;
        var _OldPr = AscFormat.isRealNumber(OldPr) ? OldPr : undefined;
        var _NewPr = AscFormat.isRealNumber(NewPr) ? NewPr : undefined;
		AscDFH.CChangesBaseDoubleProperty.call(this, Class, _OldPr, _NewPr);
    }

	CChangesDrawingsDouble.prototype = Object.create(AscDFH.CChangesBaseDoubleProperty.prototype);
	CChangesDrawingsDouble.prototype.constructor = CChangesDrawingsDouble;

    CChangesDrawingsDouble.prototype.CreateReverseChange = function()
    {
        return new this.constructor(this.Class, this.Type, this.New, this.Old, this.Color);
    };

    CChangesDrawingsDouble.prototype.private_SetValue = private_SetValue;

    CChangesDrawingsDouble.prototype.Load = function(){
        this.Redo();
        this.RefreshRecalcData();
    };
    CChangesDrawingsDouble.prototype.ReadFromBinary = function (reader) {

        reader.Seek2(reader.GetCurPos() - 4);
        this.Type = reader.GetLong();
		AscDFH.CChangesBaseDoubleProperty.prototype.ReadFromBinary.call(this, reader);
    };
    CChangesDrawingsDouble.prototype.IsPosExtChange = function () {
        return !!oPosExtMap[this.Type];
    };
    CChangesDrawingsDouble.prototype.IsHorizontal = function () {
        return !!oPosExtHor[this.Type];
    };
    window['AscDFH'].CChangesDrawingsDouble = CChangesDrawingsDouble;


    function CChangesDrawingsString(Class, Type, OldPr, NewPr) {
        this.Type = Type;
        var _OldPr = typeof OldPr === "string" ? OldPr : undefined;
        var _NewPr = typeof NewPr === "string" ? NewPr : undefined;
		AscDFH.CChangesBaseStringProperty.call(this, Class, _OldPr, _NewPr);
    }

	CChangesDrawingsString.prototype = Object.create(AscDFH.CChangesBaseStringProperty.prototype);
	CChangesDrawingsString.prototype.constructor = CChangesDrawingsString;

    CChangesDrawingsString.prototype.CreateReverseChange = function()
    {
        return new this.constructor(this.Class, this.Type, this.New, this.Old, this.Color);
    };

    CChangesDrawingsString.prototype.private_SetValue = private_SetValue;

    CChangesDrawingsString.prototype.Load = function(){
        this.Redo();
        this.RefreshRecalcData();
    };
    CChangesDrawingsString.prototype.ReadFromBinary = function (reader) {
        reader.Seek2(reader.GetCurPos() - 4);
        this.Type = reader.GetLong();
		AscDFH.CChangesBaseStringProperty.prototype.ReadFromBinary.call(this, reader);
    };
    window['AscDFH'].CChangesDrawingsString = CChangesDrawingsString;


    function CChangesDrawingsObjectNoId(Class, Type, OldPr, NewPr) {
        this.Type = Type;
        this.FromLoad = false;
        var _OldPr = AscCommon.isRealObject(OldPr) ? OldPr : undefined;
        var _NewPr = AscCommon.isRealObject(NewPr) ? NewPr : undefined;
		AscDFH.CChangesBaseObjectProperty.call(this, Class, _OldPr, _NewPr);
    }

	CChangesDrawingsObjectNoId.prototype = Object.create(AscDFH.CChangesBaseObjectProperty.prototype);
	CChangesDrawingsObjectNoId.prototype.constructor = CChangesDrawingsObjectNoId;
    CChangesDrawingsObjectNoId.prototype.CreateReverseChange = function()
    {
        return new this.constructor(this.Class, this.Type, this.New, this.Old, this.Color);
    };
    CChangesDrawingsObjectNoId.prototype.private_SetValue = private_SetValue;
    CChangesDrawingsObjectNoId.prototype.Load = function(){
        this.Redo();
        this.RefreshRecalcData();
    };
    window['AscDFH'].CChangesDrawingsObjectNoId = CChangesDrawingsObjectNoId;
    CChangesDrawingsObjectNoId.prototype.ReadFromBinary = function (reader) {
        reader.Seek2(reader.GetCurPos() - 4);
        var nType = reader.GetLong();
        this.Type = nType;
        this.FromLoad = true;
		AscDFH.CChangesBaseObjectProperty.prototype.ReadFromBinary.call(this, reader);
    };
    CChangesDrawingsObjectNoId.prototype.private_CreateObject = function () {
        if (AscDFH.drawingsConstructorsMap[this.Type]) {
            return new AscDFH.drawingsConstructorsMap[this.Type]();
        }
        return null;
    };


    function CChangesDrawingsObject(Class, Type, OldPr, NewPr) {
        this.Type = Type;
        var _OldPr = OldPr && OldPr.Get_Id ? OldPr.Get_Id() : undefined;
        var _NewPr = NewPr && NewPr.Get_Id ? NewPr.Get_Id() : undefined;
		AscDFH.CChangesBaseStringProperty.call(this, Class, _OldPr, _NewPr);
    }

	CChangesDrawingsObject.prototype = Object.create(AscDFH.CChangesBaseStringProperty.prototype);
	CChangesDrawingsObject.prototype.constructor = CChangesDrawingsObject;

    CChangesDrawingsObject.prototype.CreateReverseChange = function()
    {
        return new this.constructor(this.Class, this.Type, AscCommon.g_oTableId.Get_ById(this.New), AscCommon.g_oTableId.Get_ById(this.Old), this.Color);
    };
    window['AscDFH'].CChangesDrawingsObject = CChangesDrawingsObject;
    CChangesDrawingsObject.prototype.ReadFromBinary = function (reader) {
        reader.Seek2(reader.GetCurPos() - 4);
        this.Type = reader.GetLong();
		AscDFH.CChangesBaseStringProperty.prototype.ReadFromBinary.call(this, reader);
    };
    CChangesDrawingsObject.prototype.private_SetValue = function (Value) {
        var oObject = null;
        if (typeof Value === "string") {
            oObject = AscCommon.g_oTableId.Get_ById(Value);
            if (!oObject) {
                oObject = null;
            }
        }
        if (AscDFH.drawingsChangesMap[this.Type]) {
            AscDFH.drawingsChangesMap[this.Type](this.Class, oObject);
        }
    };
    CChangesDrawingsObject.prototype.Load = function(){
        this.Redo();
        this.RefreshRecalcData();
    };

    CChangesDrawingsObject.prototype.CheckCorrect = function()
    {
        if(this.Old){
            var oObject = AscCommon.g_oTableId.Get_ById(this.Old);
            if(oObject.CheckCorrect){
                if(!oObject.CheckCorrect()){
                    return false;
                }
            }
        }
        return true;
    };

    function CChangesDrawingsContent(Class, Type, Pos, Items, isAdd) {
        this.Type = Type;
		AscDFH.CChangesBaseContentChange.call(this, Class, Pos, Items, isAdd);
    }

	CChangesDrawingsContent.prototype = Object.create(AscDFH.CChangesBaseContentChange.prototype);
	CChangesDrawingsContent.prototype.constructor = CChangesDrawingsContent;
    window['AscDFH'].CChangesDrawingsContent = CChangesDrawingsContent;
    CChangesDrawingsContent.prototype.ReadFromBinary = function (reader) {
        reader.Seek2(reader.GetCurPos() - 4);
        this.Type = reader.GetLong();
        this.Add = reader.GetBool();
        this.Pos = reader.GetLong();
		AscDFH.CChangesBaseContentChange.prototype.ReadFromBinary.call(this, reader);
    };
    CChangesDrawingsContent.prototype.WriteToBinary = function (writer) {
        writer.WriteBool(this.IsAdd());
        writer.WriteLong(this.Pos);
		AscDFH.CChangesBaseContentChange.prototype.WriteToBinary.call(this, writer);
    };

    CChangesDrawingsContent.prototype.private_WriteItem = function (Writer, Item) {
        Writer.WriteString2(Item.Get_Id());
    };
    CChangesDrawingsContent.prototype.private_ReadItem = function (Reader) {
        var Id = Reader.GetString2();
        return AscCommon.g_oTableId.Get_ById(Id);
    };


    CChangesDrawingsContent.prototype.private_GetChangedArray = function () {
        if (drawingContentChanges[this.Type]) {
            return drawingContentChanges[this.Type](this.Class);
        }
        return null;
    };

    CChangesDrawingsContent.prototype.private_GetContentChanges = function () {
        if (this.Class && this.Class.getContentChangesByType) {
            return this.Class.getContentChangesByType(this.Type);
        }
        return null;
    };

    CChangesDrawingsContent.prototype.private_InsertInArrayLoad = function () {
        if (this.Items.length <= 0)
            return;

        var aChangedArray = this.private_GetChangedArray();
        if (null !== aChangedArray) {
            var oContentChanges = this.private_GetContentChanges(), nPos;
            for (var i = 0; i < this.Items.length; ++i) {
                if (oContentChanges) {
                    nPos = oContentChanges.Check(AscCommon.contentchanges_Add, this.Pos + i);
                }
                else {
                    nPos = this.Pos + i;
                }

                var oElement = this.Items[i];

                nPos = Math.min(nPos, aChangedArray.length);
                aChangedArray.splice(nPos, 0, oElement);
            }
        }
    };

    CChangesDrawingsContent.prototype.private_RemoveInArrayLoad = function () {

        var aChangedArray = this.private_GetChangedArray();
        if (null !== aChangedArray) {
            var oContentChanges = this.private_GetContentChanges(), nPos;
            for (var i = 0; i < this.Items.length; ++i) {
                if (oContentChanges) {
                    nPos = oContentChanges.Check(AscCommon.contentchanges_Remove, this.Pos + i);
                }
                else {
                    nPos = this.Pos + i;
                }
                if (false === nPos) {
                    continue;
                }
                aChangedArray.splice(nPos, 1);
            }
        }
    };

    CChangesDrawingsContent.prototype.private_InsertInArrayUndoRedo = function () {
        var aChangedArray = this.private_GetChangedArray();
        if (null !== aChangedArray) {
            var nPos;
            for (var i = 0; i < this.Items.length; ++i) {
                nPos = Math.min(this.Pos + i, aChangedArray.length);
                aChangedArray.splice(nPos, 0, this.Items[i]);
            }
        }
    };

    CChangesDrawingsContent.prototype.private_RemoveInArrayUndoRedo = function () {

        var aChangedArray = this.private_GetChangedArray();
        if (null !== aChangedArray) {
            for (var i = 0; i < this.Items.length; ++i) {
                aChangedArray.splice(this.Pos + i, 1);
            }
        }
    };

    CChangesDrawingsContent.prototype.Load = function () {
        if (this.IsAdd()) {
            this.private_InsertInArrayLoad();
        }
        else {
            this.private_RemoveInArrayLoad();
        }
        this.RefreshRecalcData();
    };

    CChangesDrawingsContent.prototype.Undo = function () {
        if (this.IsAdd()) {
            this.private_RemoveInArrayUndoRedo();
        }
        else {
            this.private_InsertInArrayUndoRedo();
        }
    };

    CChangesDrawingsContent.prototype.Redo = function () {
        if (this.IsAdd()) {
            this.private_InsertInArrayUndoRedo();
        }
        else {
            this.private_RemoveInArrayUndoRedo();
        }
    };
    CChangesDrawingsContent.prototype.IsContentChange = function () {
        return false;
    };
    CChangesDrawingsContent.prototype.Copy = function()
    {
        var oChanges = new this.constructor(this.Class, this.Type, this.Pos, this.Items, this.Add);
        oChanges.UseArray = this.UseArray;
        oChanges.Pos = this.Pos;
        for (var nIndex = 0, nCount = this.PosArray.length; nIndex < nCount; ++nIndex)
            oChanges.PosArray[nIndex] = this.PosArray[nIndex];

        return oChanges;
    };

    CChangesDrawingsContent.prototype.CreateReverseChange = function(){
        var oRet = this.private_CreateReverseChange(this.constructor);
        oRet.Type = this.Type;
        oRet.Pos = this.Pos;
        return oRet;
    };


    function CChangesDrawingsContentPresentation(Class, Type, Pos, Items, isAdd){
		CChangesDrawingsContent.call(this, Class, Type, Pos, Items, isAdd);
    }

	CChangesDrawingsContentPresentation.prototype = Object.create(CChangesDrawingsContent.prototype);
	CChangesDrawingsContentPresentation.prototype.constructor = CChangesDrawingsContentPresentation;
    CChangesDrawingsContentPresentation.prototype.IsContentChange = function(){
        return true;
    };

    CChangesDrawingsContentPresentation.prototype.Load = function(Color)
    {
        var aContent = this.private_GetChangedArray();
        if(!Array.isArray(aContent)){
            return;
        }
        if(this.IsAdd()){
            if (this.PosArray.length <= 0 || this.Items.length <= 0)
                return;
            for (var nIndex = 0, nCount = this.Items.length; nIndex < nCount; ++nIndex){
                var Pos     = this.Class.m_oContentChanges.Check(AscCommon.contentchanges_Add, true !== this.UseArray ? this.Pos + nIndex : this.PosArray[nIndex]);
                var Element = this.Items[nIndex];
                Pos = Math.min(Pos, aContent.length);
                aContent.splice(Pos, 0, Element);
            }
        }
        else{
            for (var nIndex = 0, nCount = this.Items.length; nIndex < nCount; ++nIndex) {
                for(var j = 0; j < aContent.length; ++j){
                    if(aContent[j] === this.Items[nIndex]){
                        aContent.splice(j, 1);
                        break;
                    }
                }
            }
        }
    };

    CChangesDrawingsContentPresentation.prototype.CheckCorrect = function(){
        if(!this.IsAdd()){
            for(var nIndex = 0; nIndex < this.Items.length; ++nIndex){
                if(this.Items[nIndex].CheckCorrect && !this.Items[nIndex].CheckCorrect()){
                    return false;
                }
            }
        }
        return true;
    };

    window['AscDFH'].CChangesDrawingsContentPresentation = CChangesDrawingsContentPresentation;

    function CChangesDrawingsContentNoId(Class, Type, Pos, Items, isAdd){
		AscDFH.CChangesDrawingsContent.call(this, Class, Type, Pos, Items, isAdd);
    }

	CChangesDrawingsContentNoId.prototype = Object.create(AscDFH.CChangesDrawingsContent.prototype);
	CChangesDrawingsContentNoId.prototype.constructor = CChangesDrawingsContentNoId;

    CChangesDrawingsContentNoId.prototype.private_WriteItem = function (Writer, Item) {
        Item.Write_ToBinary(Writer);
    };
    CChangesDrawingsContentNoId.prototype.private_ReadItem = function (Reader) {
        var oItem = null;
        if(drawingConstructorsMap[this.Type]){
            oItem = new drawingConstructorsMap[this.Type]();
            oItem.Read_FromBinary(Reader);
        }
        return oItem;
    };
    window['AscDFH'].CChangesDrawingsContentNoId = CChangesDrawingsContentNoId;

    function CChangesDrawingsContentLong(Class, Type, Pos, Items, isAdd){
		AscDFH.CChangesDrawingsContent.call(this, Class, Type, Pos, Items, isAdd);
    }

	CChangesDrawingsContentLong.prototype = Object.create(AscDFH.CChangesDrawingsContent.prototype);
	CChangesDrawingsContentLong.prototype.constructor = CChangesDrawingsContentLong;

    CChangesDrawingsContentLong.prototype.private_WriteItem = function (Writer, Item) {
        Writer.WriteLong(Item);
    };
    CChangesDrawingsContentLong.prototype.private_ReadItem = function (Reader) {
        return Reader.GetLong();
    };
    window['AscDFH'].CChangesDrawingsContentLong = CChangesDrawingsContentLong;


    function CChangesDrawingsContentLongMap(Class, Type, Pos, Items, isAdd){
		AscDFH.CChangesDrawingsContentLong.call(this, Class, Type, Pos, Items, isAdd);
    }

	CChangesDrawingsContentLongMap.prototype = Object.create(AscDFH.CChangesDrawingsContentLong.prototype);
	CChangesDrawingsContentLongMap.prototype.constructor = CChangesDrawingsContentLongMap;


    CChangesDrawingsContentLongMap.prototype.private_InsertInArrayLoad = function () {
        if (this.Items.length <= 0)
            return;
        var aChangedArray = this.private_GetChangedArray();
        if (null !== aChangedArray) {
            for (var i = 0; i < this.Items.length; ++i) {
                aChangedArray[this.Pos + i] = this.Items[i];
            }
        }
    };

    CChangesDrawingsContentLongMap.prototype.private_RemoveInArrayLoad = function () {

        var aChangedArray = this.private_GetChangedArray();
        if (null !== aChangedArray) {
            for (var i = 0; i < this.Items.length; ++i) {
                aChangedArray[this.Pos + i] = null;
            }
        }
    };

    CChangesDrawingsContentLongMap.prototype.private_InsertInArrayUndoRedo = function () {
        var aChangedArray = this.private_GetChangedArray();
        if (null !== aChangedArray) {
            for (var i = 0; i < this.Items.length; ++i) {
                aChangedArray[this.Pos + i] = this.Items[i];
            }
        }
    };

    CChangesDrawingsContentLongMap.prototype.private_RemoveInArrayUndoRedo = function () {
        var aChangedArray = this.private_GetChangedArray();
        if (null !== aChangedArray) {
            for (var i = 0; i < this.Items.length; ++i) {
                aChangedArray[this.Pos + i] = null;
            }
        }
    };

    window['AscDFH'].CChangesDrawingsContentLongMap = CChangesDrawingsContentLongMap;


    function CChangesDrawingChangeTheme(Class, Type, aIndexes){
        this.Type = Type;
        this.aIndexes = aIndexes;
		AscDFH.CChangesBase.call(this, Class);
    }

	CChangesDrawingChangeTheme.prototype = Object.create(AscDFH.CChangesBase.prototype);
	CChangesDrawingChangeTheme.prototype.constructor = CChangesDrawingChangeTheme;

    CChangesDrawingChangeTheme.prototype.WriteToBinary = function(Writer){
        Writer.WriteLong(this.aIndexes.length);
        for(var i = 0; i < this.aIndexes.length; ++i){
            Writer.WriteLong(this.aIndexes[i]);
        }
    };

    CChangesDrawingChangeTheme.prototype.ReadFromBinary = function(Reader){
        this.aIndexes = [];
        var nLength = Reader.GetLong();
        for(var i = 0; i < nLength; ++i){
            this.aIndexes.push(Reader.GetLong());
        }
    };

    CChangesDrawingChangeTheme.prototype.Do = function () {
        var aSlides = this.Class.Slides;
        for(var i = 0; i < this.aIndexes.length; ++i)
        {
            aSlides[this.aIndexes[i]] && aSlides[this.aIndexes[i]].checkSlideTheme();
        }
    };

    CChangesDrawingChangeTheme.prototype.Undo = function(){
        this.Do();
    };

    CChangesDrawingChangeTheme.prototype.Redo = function(){
        this.Do();
    };

    CChangesDrawingChangeTheme.prototype.Load = function(){
        this.Redo();
        this.RefreshRecalcData();
    };

    CChangesDrawingChangeTheme.prototype.CreateReverseChange = function(){
        return new CChangesDrawingChangeTheme(this.Class, this.Type, this.aIndexes);
    };

    window['AscDFH'].CChangesDrawingChangeTheme = CChangesDrawingChangeTheme;


    function CChangesDrawingTimingLocks(Class, deleteLock, backgroundLock, timingLock, transitionLock, layoutLock){
        this.Type = AscDFH.historyitem_SlideSetLocks;
        this.deleteLock = deleteLock;
        this.backgroundLock = backgroundLock;
        this.timingLock = timingLock;
        this.transitionLock = transitionLock;
        this.layoutLock = layoutLock;
		AscDFH.CChangesBase.call(this, Class);
    }

	CChangesDrawingTimingLocks.prototype = Object.create(AscDFH.CChangesBase.prototype);
	CChangesDrawingTimingLocks.prototype.constructor = CChangesDrawingTimingLocks;

    CChangesDrawingTimingLocks.prototype.WriteToBinary = function(Writer){
        AscFormat.writeObject(Writer, this.deleteLock);
        AscFormat.writeObject(Writer, this.backgroundLock);
        AscFormat.writeObject(Writer, this.timingLock);
        AscFormat.writeObject(Writer, this.transitionLock);
        AscFormat.writeObject(Writer, this.layoutLock);
    };

    CChangesDrawingTimingLocks.prototype.ReadFromBinary = function(Reader){
        this.deleteLock = AscFormat.readObject(Reader);
        this.backgroundLock = AscFormat.readObject(Reader);
        this.timingLock = AscFormat.readObject(Reader);
        this.transitionLock = AscFormat.readObject(Reader);
        this.layoutLock = AscFormat.readObject(Reader);
    };

    CChangesDrawingTimingLocks.prototype.Undo = function(){
        var oSlide = this.Class;
        oSlide.deleteLock = null;
        oSlide.backgroundLock = null;
        oSlide.timingLock = null;
        oSlide.transitionLock = null;
        oSlide.layoutLock = null;
    };

    CChangesDrawingTimingLocks.prototype.Redo = function(){
        var oSlide = this.Class;
         oSlide.deleteLock = this.deleteLock;
         oSlide.backgroundLock = this.backgroundLock;
         oSlide.timingLock = this.timingLock;
         oSlide.transitionLock = this.transitionLock;
         oSlide.layoutLock = this.layoutLock;
    };
    CChangesDrawingTimingLocks.prototype.Load = function(){
        this.Redo();
        this.RefreshRecalcData();
    };
    CChangesDrawingTimingLocks.prototype.CreateReverseChange = function()
    {
        return new this.constructor(this.Class, null, null, null, null, null);
    };

    window['AscDFH'].CChangesDrawingTimingLocks = CChangesDrawingTimingLocks;


    function CChangesSparklinesChangeData(Class, OldPr, NewPr){
        this.Type = AscDFH.historyitem_Sparkline_ChangeData;
        this.OldPr = OldPr;
        this.NewPr = NewPr;
		AscDFH.CChangesBase.call(this, Class);
    }

	CChangesSparklinesChangeData.prototype = Object.create(AscDFH.CChangesBase.prototype);
	CChangesSparklinesChangeData.prototype.constructor = CChangesSparklinesChangeData;

    CChangesSparklinesChangeData.prototype.WritePr = function(Writer, Pr){
        var bIsArray = Array.isArray(Pr) ;
        Writer.WriteBool(bIsArray);
        if(bIsArray){
            Writer.WriteLong(Pr.length);
            for(var i = 0; i < Pr.length; ++i){
                Writer.WriteLong(Pr[i].sqref.c1);
                Writer.WriteLong(Pr[i].sqref.r1);
                Writer.WriteString2(Pr[i].f);
            }
        }
    };

    CChangesSparklinesChangeData.prototype.ReadPr = function(Reader){
        var bIsArray = Reader.GetBool();
        var RetPr = null;
        if(bIsArray){
            var nLength = Reader.GetLong();
            RetPr = [];
            for(var i = 0; i < nLength; ++i){
                var oSparkline = new AscCommonExcel.sparkline();
                var col = Reader.GetLong();
                var row = Reader.GetLong();
                oSparkline.sqref = new Asc.Range(col, row, col, row);
                oSparkline.setF(Reader.GetString2());
                RetPr.push(oSparkline);
            }
        }
        return RetPr;
    };

    CChangesSparklinesChangeData.prototype.WriteToBinary = function(Writer){
        this.WritePr(Writer, this.OldPr);
        this.WritePr(Writer, this.NewPr);
    };

    CChangesSparklinesChangeData.prototype.ReadFromBinary = function(Reader){
        Reader.Seek2(Reader.GetCurPos() - 4);
        var nType = Reader.GetLong();
        this.Type = nType;
        this.OldPr = this.ReadPr(Reader);
        this.NewPr = this.ReadPr(Reader);
    };

    CChangesSparklinesChangeData.prototype.Fill = function(Pr){
        var aSparklines = this.Class.arrSparklines;
        aSparklines.length = 0;
        if(Array.isArray(Pr)){
            for(var i = 0; i < Pr.length; ++i){
                aSparklines.push(Pr[i].clone())
            }
        }
        this.Class.cleanCache();
    };

    CChangesSparklinesChangeData.prototype.Undo = function(){
        this.Fill(this.OldPr);
    };

    CChangesSparklinesChangeData.prototype.Redo = function(){
        this.Fill(this.NewPr);
    };
    CChangesSparklinesChangeData.prototype.Load = function(){
        this.Redo();
        this.RefreshRecalcData();
    };

    CChangesSparklinesChangeData.prototype.CreateReverseChange = function(){
        return new CChangesSparklinesChangeData(this.Class, this.NewPr, this.OldPr);
    };
    window['AscDFH'].CChangesSparklinesChangeData = CChangesSparklinesChangeData;



    function CChangesSparklinesRemoveData(Class, oSparkline, bReverse){
        this.Type = AscDFH.historyitem_Sparkline_RemoveData;
        this.sparkline = oSparkline;
        this.bReverse = bReverse;
		AscDFH.CChangesBase.call(this, Class);
    }

	CChangesSparklinesRemoveData.prototype = Object.create(AscDFH.CChangesBase.prototype);
	CChangesSparklinesRemoveData.prototype.constructor = CChangesSparklinesRemoveData;

    CChangesSparklinesRemoveData.prototype.WriteToBinary = function(Writer){
        var bIsObject = AscCommon.isRealObject(this.sparkline);
        Writer.WriteBool(bIsObject);
        if(bIsObject){
            Writer.WriteLong(this.sparkline.sqref.c1);
            Writer.WriteLong(this.sparkline.sqref.r1);
            Writer.WriteString2(this.sparkline.f);
        }
        Writer.WriteBool(this.bReverse === true);
    };
    CChangesSparklinesRemoveData.prototype.ReadFromBinary = function(Reader){
        var bIsObject = Reader.GetLong();
        if(bIsObject){
            this.sparkline = new AscCommonExcel.sparkline();
            var col = Reader.GetLong();
            var row = Reader.GetLong();
            this.sparkline.sqref = new Asc.Range(col, row, col, row);
            this.sparkline.setF(Reader.GetString2());
        }
        this.bReverse = Reader.GetBool();
    };

    CChangesSparklinesRemoveData.prototype.Undo = function(){
        if(this.bReverse){
            this.Class.remove(this.sparkline.sqref);
        }
        else{
            this.Class.arrSparklines.push(this.sparkline);
        }
        this.Class.cleanCache();
    };
    CChangesSparklinesRemoveData.prototype.Redo = function(){
        if(this.bReverse){
            this.Class.arrSparklines.push(this.sparkline);
        }
        else{
            this.Class.remove(this.sparkline.sqref);
        }
        this.Class.cleanCache();
    };

    CChangesSparklinesRemoveData.prototype.CreateReverseChange = function(){
        return new CChangesSparklinesRemoveData(this.Class, this.sparkline, !this.bReverse);
    };


    window['AscDFH'].CChangesSparklinesRemoveData = CChangesSparklinesRemoveData;

    function CChangesDrawingsExcelColor(Class, Type, OldPr, NewPr){
        this.Type = Type;
        this.OldPr = OldPr;
        this.NewPr = NewPr;
		AscDFH.CChangesBase.call(this, Class);
    }

	CChangesDrawingsExcelColor.prototype = Object.create(AscDFH.CChangesBase.prototype);
	CChangesDrawingsExcelColor.prototype.constructor = CChangesDrawingsExcelColor;

    CChangesDrawingsExcelColor.prototype.WritePr = function(Writer, Pr){
        var bIsObject = AscCommon.isRealObject(Pr) ;
        Writer.WriteBool(bIsObject);
        if(bIsObject){
            Writer.WriteLong(Pr.getType());
            Pr.Write_ToBinary2(Writer);
        }
    };

    CChangesDrawingsExcelColor.prototype.ReadPr = function(Reader){
        var RetPr = null;
        var bIsObject = Reader.GetBool();
        if(bIsObject){
            switch (Reader.GetLong()) {
                case AscCommonExcel.UndoRedoDataTypes.RgbColor:
                    RetPr = new AscCommonExcel.RgbColor();
                    RetPr.Read_FromBinary2(Reader);
                    break;
                case AscCommonExcel.UndoRedoDataTypes.ThemeColor:
                    RetPr = new AscCommonExcel.ThemeColor();
                    RetPr = RetPr.Read_FromBinary2AndReplace(Reader);
                    break;
            }
        }
        return RetPr;
    };

    CChangesDrawingsExcelColor.prototype.WriteToBinary = function(Writer){
        this.WritePr(Writer, this.OldPr);
        this.WritePr(Writer, this.NewPr);
    };
    CChangesDrawingsExcelColor.prototype.ReadFromBinary = function(Reader){
        Reader.Seek2(Reader.GetCurPos() - 4);
        var nType = Reader.GetLong();
        this.Type = nType;
        this.OldPr = this.ReadPr(Reader);
        this.NewPr = this.ReadPr(Reader);
    };

    CChangesDrawingsExcelColor.prototype.Undo = function(){
        this.Fill(this.OldPr);
    };

    CChangesDrawingsExcelColor.prototype.Redo = function(){
        this.Fill(this.NewPr);
    };

    CChangesDrawingsExcelColor.prototype.Load = function(){
        this.Redo();
        this.RefreshRecalcData();
    };
    CChangesDrawingsExcelColor.prototype.Fill = function(Pr){
        var oClass = this.Class;
        switch(this.Type){
            case AscDFH.historyitem_Sparkline_ColorSeries:
                oClass.colorSeries = Pr;
                break;
            case AscDFH.historyitem_Sparkline_ColorNegative:
                oClass.colorNegative = Pr;
                break;
            case AscDFH.historyitem_Sparkline_ColorAxis:
                oClass.colorAxis = Pr;
                break;
            case AscDFH.historyitem_Sparkline_ColorMarkers:
                oClass.colorMarkers = Pr;
                break;
            case AscDFH.historyitem_Sparkline_ColorFirst:
                oClass.colorFirst = Pr;
                break;
            case AscDFH.historyitem_Sparkline_colorLast:
                oClass.colorLast = Pr;
                break;
            case AscDFH.historyitem_Sparkline_ColorHigh:
                oClass.colorHigh = Pr;
                break;
            case AscDFH.historyitem_Sparkline_ColorLow:
                oClass.colorLow = Pr;
                break;
        }
        oClass.cleanCache();
    };


    CChangesDrawingsExcelColor.prototype.CreateReverseChange = function(){
        return new CChangesDrawingsExcelColor(this.Class, this.Type, this.NewPr, this.OldPr);
    };

    AscDFH.CChangesDrawingsExcelColor = CChangesDrawingsExcelColor;

    function CChangesDrawingsSparklinesRemove(Class, bReverse){
        this.Type = AscDFH.historyitem_Sparkline_RemoveSparkline;
        this.bReverse = bReverse;
		AscDFH.CChangesBase.call(this, Class);
    }

	CChangesDrawingsSparklinesRemove.prototype = Object.create(AscDFH.CChangesBase.prototype);
	CChangesDrawingsSparklinesRemove.prototype.constructor = CChangesDrawingsSparklinesRemove;
    CChangesDrawingsSparklinesRemove.prototype.Undo = function(){
        if (this.Class.worksheet) {
            if(this.bReverse){
                this.Class.worksheet.removeSparklineGroup(this.Class.Get_Id());
            }
            else{
                this.Class.worksheet.insertSparklineGroup(this.Class);
            }

        }
        this.Class.cleanCache();
    };
    CChangesDrawingsSparklinesRemove.prototype.Redo = function(){
        if (this.Class.worksheet) {
            if(this.bReverse){
                this.Class.worksheet.insertSparklineGroup(this.Class);
            }
            else{
                this.Class.worksheet.removeSparklineGroup(this.Class.Get_Id());
            }
        }
        this.Class.cleanCache();
    };

    CChangesDrawingsSparklinesRemove.prototype.WriteToBinary = function(Writer){
        Writer.WriteBool(!!this.bReverse);
    };

    CChangesDrawingsSparklinesRemove.prototype.ReadFromBinary = function(Reader){
        this.bReverse = Reader.GetBool();
    };

    CChangesDrawingsSparklinesRemove.prototype.Load = function(){
        this.Redo();
        this.RefreshRecalcData();
    };

    CChangesDrawingsSparklinesRemove.prototype.CreateReverseChange = function(){
        return new CChangesDrawingsSparklinesRemove(this.Class, !this.bReverse);
    };
    window['AscDFH'].CChangesDrawingsSparklinesRemove = CChangesDrawingsSparklinesRemove;




AscDFH.changesFactory[AscDFH.historyitem_Sparkline_Type               ] = AscDFH.CChangesDrawingsLong;
AscDFH.changesFactory[AscDFH.historyitem_Sparkline_LineWeight         ] = AscDFH.CChangesDrawingsDouble;
AscDFH.changesFactory[AscDFH.historyitem_Sparkline_DisplayEmptyCellsAs] = AscDFH.CChangesDrawingsLong;
AscDFH.changesFactory[AscDFH.historyitem_Sparkline_Markers            ] = AscDFH.CChangesDrawingsBool;
AscDFH.changesFactory[AscDFH.historyitem_Sparkline_High               ] = AscDFH.CChangesDrawingsBool;
AscDFH.changesFactory[AscDFH.historyitem_Sparkline_Low                ] = AscDFH.CChangesDrawingsBool;
AscDFH.changesFactory[AscDFH.historyitem_Sparkline_First              ] = AscDFH.CChangesDrawingsBool;
AscDFH.changesFactory[AscDFH.historyitem_Sparkline_Last               ] = AscDFH.CChangesDrawingsBool;
AscDFH.changesFactory[AscDFH.historyitem_Sparkline_Negative           ] = AscDFH.CChangesDrawingsBool;
AscDFH.changesFactory[AscDFH.historyitem_Sparkline_DisplayXAxis       ] = AscDFH.CChangesDrawingsBool;
AscDFH.changesFactory[AscDFH.historyitem_Sparkline_DisplayHidden      ] = AscDFH.CChangesDrawingsBool;
AscDFH.changesFactory[AscDFH.historyitem_Sparkline_MinAxisType        ] = AscDFH.CChangesDrawingsLong;
AscDFH.changesFactory[AscDFH.historyitem_Sparkline_MaxAxisType        ] = AscDFH.CChangesDrawingsLong;
AscDFH.changesFactory[AscDFH.historyitem_Sparkline_RightToLeft        ] = AscDFH.CChangesDrawingsBool;
AscDFH.changesFactory[AscDFH.historyitem_Sparkline_ManualMax          ] = AscDFH.CChangesDrawingsDouble;
AscDFH.changesFactory[AscDFH.historyitem_Sparkline_ManualMin          ] = AscDFH.CChangesDrawingsDouble;
AscDFH.changesFactory[AscDFH.historyitem_Sparkline_DateAxis           ] = AscDFH.CChangesDrawingsBool;
AscDFH.changesFactory[AscDFH.historyitem_Sparkline_F                  ] = AscDFH.CChangesDrawingsString;


AscDFH.changesFactory[AscDFH.historyitem_Sparkline_ColorSeries        ] = AscDFH.CChangesDrawingsExcelColor;
AscDFH.changesFactory[AscDFH.historyitem_Sparkline_ColorNegative      ] = AscDFH.CChangesDrawingsExcelColor;
AscDFH.changesFactory[AscDFH.historyitem_Sparkline_ColorAxis          ] = AscDFH.CChangesDrawingsExcelColor;
AscDFH.changesFactory[AscDFH.historyitem_Sparkline_ColorMarkers       ] = AscDFH.CChangesDrawingsExcelColor;
AscDFH.changesFactory[AscDFH.historyitem_Sparkline_ColorFirst         ] = AscDFH.CChangesDrawingsExcelColor;
AscDFH.changesFactory[AscDFH.historyitem_Sparkline_colorLast          ] = AscDFH.CChangesDrawingsExcelColor;
AscDFH.changesFactory[AscDFH.historyitem_Sparkline_ColorHigh          ] = AscDFH.CChangesDrawingsExcelColor;
AscDFH.changesFactory[AscDFH.historyitem_Sparkline_ColorLow           ] = AscDFH.CChangesDrawingsExcelColor;
AscDFH.changesFactory[AscDFH.historyitem_Sparkline_ChangeData]          = AscDFH.CChangesSparklinesChangeData;
AscDFH.changesFactory[AscDFH.historyitem_Sparkline_RemoveData]          = AscDFH.CChangesSparklinesRemoveData;
AscDFH.changesFactory[AscDFH.historyitem_Sparkline_RemoveSparkline]     = AscDFH.CChangesDrawingsSparklinesRemove;

    AscDFH.drawingsChangesMap[AscDFH.historyitem_Sparkline_Type               ] = function(oClass, value){oClass.type                = value; oClass.cleanCache();};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_Sparkline_LineWeight         ] = function(oClass, value){oClass.lineWeight          = value; oClass.cleanCache();};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_Sparkline_DisplayEmptyCellsAs] = function(oClass, value){oClass.displayEmptyCellsAs = value; oClass.cleanCache();};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_Sparkline_Markers            ] = function(oClass, value){oClass.markers             = value; oClass.cleanCache();};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_Sparkline_High               ] = function(oClass, value){oClass.high                = value; oClass.cleanCache();};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_Sparkline_Low                ] = function(oClass, value){oClass.low                 = value; oClass.cleanCache();};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_Sparkline_First              ] = function(oClass, value){oClass.first               = value; oClass.cleanCache();};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_Sparkline_Last               ] = function(oClass, value){oClass.last                = value; oClass.cleanCache();};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_Sparkline_Negative           ] = function(oClass, value){oClass.negative            = value; oClass.cleanCache();};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_Sparkline_DisplayXAxis       ] = function(oClass, value){oClass.displayXAxis        = value; oClass.cleanCache();};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_Sparkline_DisplayHidden      ] = function(oClass, value){oClass.displayHidden       = value; oClass.cleanCache();};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_Sparkline_MinAxisType        ] = function(oClass, value){oClass.minAxisType         = value; oClass.cleanCache();};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_Sparkline_MaxAxisType        ] = function(oClass, value){oClass.maxAxisType         = value; oClass.cleanCache();};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_Sparkline_RightToLeft        ] = function(oClass, value){oClass.rightToLeft         = value; oClass.cleanCache();};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_Sparkline_ManualMax          ] = function(oClass, value){oClass.manualMax           = value; oClass.cleanCache();};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_Sparkline_ManualMin          ] = function(oClass, value){oClass.manualMin           = value; oClass.cleanCache();};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_Sparkline_DateAxis           ] = function(oClass, value){oClass.dateAxis            = value; oClass.cleanCache();};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_Sparkline_F                  ] = function(oClass, value){oClass.f                   = value; oClass.cleanCache();};

})(window);