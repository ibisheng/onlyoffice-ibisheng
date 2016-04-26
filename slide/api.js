"use strict";

// Import
var DownloadType = AscCommon.DownloadType;
var locktype_None = AscCommon.locktype_None;
var locktype_Mine = AscCommon.locktype_Mine;
var locktype_Other = AscCommon.locktype_Other;
var locktype_Other2 = AscCommon.locktype_Other2;
var locktype_Other3 = AscCommon.locktype_Other3;
var changestype_Drawing_Props = AscCommon.changestype_Drawing_Props;
var asc_CSelectedObject = AscCommon.asc_CSelectedObject;
var g_oDocumentUrls = AscCommon.g_oDocumentUrls;
var sendCommand = AscCommon.sendCommand;
var mapAscServerErrorToAscError = AscCommon.mapAscServerErrorToAscError;
var g_oIdCounter = AscCommon.g_oIdCounter;
var g_oTableId = AscCommon.g_oTableId;
var PasteElementsId = AscCommon.PasteElementsId;

var c_oAscError = Asc.c_oAscError;
var c_oAscFileType = Asc.c_oAscFileType;
var c_oAscAsyncAction = Asc.c_oAscAsyncAction;
var c_oAscAsyncActionType = Asc.c_oAscAsyncActionType;
var c_oAscTypeSelectElement = Asc.c_oAscTypeSelectElement;
var c_oAscFill = Asc.c_oAscFill;
var asc_CShapeFill = Asc.asc_CShapeFill;
var asc_CFillBlip = Asc.asc_CFillBlip;

var c_oSerFormat = {
    Version		: 1,
    Signature	: "PPTY"
};

/**
 *
 * @param name
 * @constructor
 * @extends {baseEditorsApi}
 */
function asc_docs_api(name)
{
  asc_docs_api.superclass.constructor.call(this, name);
  this.editorId = AscCommon.c_oEditorId.Presentation;

    History    = new CHistory();
    g_oTableId.init();

	/************ private!!! **************/
    this.WordControl = new CEditorPage(this);
    this.WordControl.Name = this.HtmlElementName;

  this.documentFormatSave = c_oAscFileType.PPTX;

    this.ThemeLoader = new CThemeLoader();
    this.ThemeLoader.Api = this;

    this.DocumentUrl = "";
    this.bNoSendComments = false;

    this.isApplyChangesOnOpen = false;
    this.isApplyChangesOnOpenEnabled = true;

    this.IsSupportEmptyPresentation = true;
        
    this.ShowParaMarks = false;
    this.ShowSnapLines = true;
	this.isAddSpaceBetweenPrg = false;
    this.isPageBreakBefore = false;
    this.isKeepLinesTogether = false;
    this.isPresentationEditor = true;
    this.bAlignBySelected     = false;

    this.isPaintFormat = false;
    this.isViewMode = false;
    this.isShowTableEmptyLine = false;//true;
    this.isShowTableEmptyLineAttack = false;//true;

    this.bInit_word_control = false;
	this.isDocumentModify = false;

    this.isImageChangeUrl = false;
    this.isShapeImageChangeUrl = false;
    this.isSlideImageChangeUrl = false;
	
    this.isPasteFonts_Images = false;

    this.isLoadNoCutFonts = false;

    this.nCurPointItemsLength = -1;

    this.pasteCallback = null;
    this.pasteImageMap = null;
    this.EndActionLoadImages = 0;

    this.isSaveFonts_Images = false;
    this.saveImageMap = null;

    this.ServerImagesWaitComplete = false;

    this.ParcedDocument = false;
	this.isStartCoAuthoringOnEndLoad = false;	// Подсоединились раньше, чем документ загрузился

    this.DocumentOrientation = orientation_Portrait ? true : false;

    this.SelectedObjectsStack = [];

  this.CoAuthoringApi.isPowerPoint = true;

    // объекты, нужные для отправки в тулбар (шрифты, стили)
    this._gui_editor_themes = null;
    this._gui_document_themes = null;
    //выставляем тип copypaste
  PasteElementsId.g_bIsDocumentCopyPaste = false;


    if (window.editor == undefined)
    {
        window.editor = this;
		window.editor;
        window['editor'] = window.editor;
        
        if (window["NATIVE_EDITOR_ENJINE"])
            editor = window.editor;
    }
}
AscCommon.extendClass(asc_docs_api, baseEditorsApi);

asc_docs_api.prototype.sendEvent = function() {
  this.asc_fireCallback.apply(this, arguments);
};

/////////////////////////////////////////////////////////////////////////
///////////////////CoAuthoring and Chat api//////////////////////////////
/////////////////////////////////////////////////////////////////////////
// Init CoAuthoring
asc_docs_api.prototype._coAuthoringSetChange = function(change, oColor)
{
	var oChange = new CCollaborativeChanges();
	oChange.Set_Data( change );
	oChange.Set_Color( oColor );
	CollaborativeEditing.Add_Changes( oChange );
};

asc_docs_api.prototype._coAuthoringSetChanges = function(e, oColor)
{
	var Count = e.length;
	for (var Index = 0; Index < Count; ++Index)
		this._coAuthoringSetChange(e[Index], oColor);
};

asc_docs_api.prototype._coAuthoringInitEnd = function() {
  var t = this;
  this.CoAuthoringApi.onCursor = function(e) {
    if (true === CollaborativeEditing.Is_Fast()) {
      t.WordControl.m_oLogicDocument.Update_ForeignCursor(e[e.length - 1]['cursor'], e[e.length - 1]['user'], true, e[e.length - 1]['useridoriginal']);
    }
  };
  this.CoAuthoringApi.onConnectionStateChanged = function(e) {
    if (true === CollaborativeEditing.Is_Fast() && false === e['state']) {
      editor.WordControl.m_oLogicDocument.Remove_ForeignCursor(e['id']);
    }
    t.asc_fireCallback("asc_onConnectionStateChanged", e);
  };
  this.CoAuthoringApi.onLocksAcquired = function(e) {
    if (t.isApplyChangesOnOpenEnabled) {
      // Пока документ еще не загружен, будем сохранять функцию и аргументы
      t.arrPreOpenLocksObjects.push(function() {
        t.CoAuthoringApi.onLocksAcquired(e);
      });
      return;
    }

    if (2 != e["state"]) {

      var block_value = e["blockValue"];
      var classes = [];
      switch (block_value["type"]) {
        case c_oAscLockTypeElemPresentation.Object:
        {
          classes.push(block_value["objId"]);
          //classes.push(block_value["slideId"]);
          break;
        }
        case c_oAscLockTypeElemPresentation.Slide:
        {
          classes.push(block_value["val"]);
          break;
        }
        case c_oAscLockTypeElemPresentation.Presentation:
        {
          break;
        }
      }

      for (var i = 0; i < classes.length; ++i) {
        var Class = g_oTableId.Get_ById(classes[i]);// g_oTableId.Get_ById( Id );
        if (null != Class) {
          var Lock = Class.Lock;

          var OldType = Class.Lock.Get_Type();
          if (locktype_Other2 === OldType || locktype_Other3 === OldType) {
            Lock.Set_Type(locktype_Other3, true);
          } else {
            Lock.Set_Type(locktype_Other, true);
          }
          if (Class instanceof PropLocker) {
            var object = g_oTableId.Get_ById(Class.objectId);
            if (object instanceof Slide && Class === object.deleteLock) {
              editor.WordControl.m_oLogicDocument.DrawingDocument.LockSlide(object.num);
            }
          }
          // Выставляем ID пользователя, залочившего данный элемент
          Lock.Set_UserId(e["user"]);

          if (Class instanceof PropLocker) {
            var object = g_oTableId.Get_ById(Class.objectId);
            if (object instanceof CPresentation) {
              if (Class === editor.WordControl.m_oLogicDocument.themeLock) {
                editor.asc_fireCallback("asc_onLockDocumentTheme");
              } else if (Class === editor.WordControl.m_oLogicDocument.schemeLock) {
                editor.asc_fireCallback("asc_onLockDocumentSchema");
              } else if (Class === editor.WordControl.m_oLogicDocument.slideSizeLock) {
                editor.asc_fireCallback("asc_onLockDocumentProps");
              }
            }
          }
          if (Class instanceof CComment) {
            editor.sync_LockComment(Class.Get_Id(), e["user"]);
          }

          // TODO: Здесь для ускорения надо сделать проверку, является ли текущим элемент с
          //       заданным Id. Если нет, тогда и не надо обновлять состояние.
          editor.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
        } else {
          if (classes[i].indexOf("new_object") > -1 && block_value["type"] === c_oAscLockTypeElemPresentation.Object) {
            var slide_id = block_value["slideId"];
            var delete_lock = g_oTableId.Get_ById(slide_id);
            if (AscCommon.isRealObject(delete_lock)) {
              var Lock = delete_lock.Lock;
              var OldType = Lock.Get_Type();
              if (locktype_Other2 === OldType || locktype_Other3 === OldType) {
                Lock.Set_Type(locktype_Other3, true);
              } else {
                Lock.Set_Type(locktype_Other, true);
              }
              editor.WordControl.m_oLogicDocument.DrawingDocument.LockSlide(g_oTableId.Get_ById(delete_lock.objectId).num);
            } else {
              CollaborativeEditing.Add_NeedLock(slide_id, e["user"]);
            }
          } else {
            CollaborativeEditing.Add_NeedLock(classes[i], e["user"]);
          }
        }
      }
    }
  };
  this.CoAuthoringApi.onLocksReleased = function(e, bChanges) {
    if (t.isApplyChangesOnOpenEnabled) {
      // Пока документ еще не загружен, будем сохранять функцию и аргументы
      t.arrPreOpenLocksObjects.push(function() {
        t.CoAuthoringApi.onLocksReleased(e, bChanges);
      });
      return;
    }

    var Id;
    var block_value = e["block"];
    var classes = [];
    switch (block_value["type"]) {
      case c_oAscLockTypeElemPresentation.Object:
      {
        classes.push(block_value["objId"]);
        //classes.push(block_value["slideId"]);
        break;
      }
      case c_oAscLockTypeElemPresentation.Slide:
      {
        classes.push(block_value["val"]);
        break;
      }
      case c_oAscLockTypeElemPresentation.Presentation:
      {
        break;
      }
    }
    for (var i = 0; i < classes.length; ++i) {
      Id = classes[i];
      var Class = g_oTableId.Get_ById(Id);
      if (null != Class) {
        var Lock = Class.Lock;

        if ("undefined" != typeof(Lock)) {
          var CurType = Lock.Get_Type();

          var NewType = locktype_None;

          if (CurType === locktype_Other) {
            if (true != bChanges) {
              NewType = locktype_None;
            } else {
              NewType = locktype_Other2;
              CollaborativeEditing.Add_Unlock(Class);
            }
          } else if (CurType === locktype_Mine) {
            // Такого быть не должно
            NewType = locktype_Mine;
          } else if (CurType === locktype_Other2 || CurType === locktype_Other3) {
            NewType = locktype_Other2;
          }

          Lock.Set_Type(NewType, true);
          if (Class instanceof PropLocker) {
            var object = g_oTableId.Get_ById(Class.objectId);
            if (object instanceof Slide && Class === object.deleteLock) {
              if (NewType !== locktype_Mine && NewType !== locktype_None) {
                editor.WordControl.m_oLogicDocument.DrawingDocument.LockSlide(object.num);
              } else {
                editor.WordControl.m_oLogicDocument.DrawingDocument.UnLockSlide(object.num);
              }
            }
            if (object instanceof CPresentation) {
              if (Class === object.themeLock) {
                if (NewType !== locktype_Mine && NewType !== locktype_None) {
                  editor.asc_fireCallback("asc_onLockDocumentTheme");
                } else {
                  editor.asc_fireCallback("asc_onUnLockDocumentTheme");
                }
              }
              if (Class === object.slideSizeLock) {
                if (NewType !== locktype_Mine && NewType !== locktype_None) {
                  editor.asc_fireCallback("asc_onLockDocumentProps");
                } else {
                  editor.asc_fireCallback("asc_onUnLockDocumentProps");
                }
              }
            }

          }

        }
      } else {
        CollaborativeEditing.Remove_NeedLock(Id);
      }
    }
  };
  this.CoAuthoringApi.onSaveChanges = function(e, userId, bFirstLoad) {
    // bSendEvent = false - это означает, что мы загружаем имеющиеся изменения при открытии
    var Changes = new CCollaborativeChanges();
    Changes.Set_Data(e);
    CollaborativeEditing.Add_Changes(Changes);

    // т.е. если bSendEvent не задан, то посылаем  сообщение + когда загрузился документ
    if (!bFirstLoad && t.bInit_word_control) {
      t.sync_CollaborativeChanges();
    }
  };
  this.CoAuthoringApi.onRecalcLocks = function(e) {
    if (e && true === CollaborativeEditing.Is_Fast()) {
      var CursorInfo = JSON.parse(e);
      CollaborativeEditing.Add_ForeignCursorToUpdate(CursorInfo.UserId, CursorInfo.CursorInfo, CursorInfo.UserShortId);
    }
  };
  this.CoAuthoringApi.onStartCoAuthoring = function(isStartEvent) {
    if (t.ParcedDocument) {
      CollaborativeEditing.Start_CollaborationEditing();
      t.WordControl.m_oLogicDocument.DrawingDocument.Start_CollaborationEditing();

      if (true != History.Is_Clear()) {
        CollaborativeEditing.Apply_Changes();
        CollaborativeEditing.Send_Changes();
      } else {
        // Изменений нет, но нужно сбросить lock
        t.CoAuthoringApi.unLockDocument(false);
      }
    } else {
      t.isStartCoAuthoringOnEndLoad = true;
    }
  };
  this.CoAuthoringApi.onEndCoAuthoring = function(isStartEvent) {
    CollaborativeEditing.End_CollaborationEditing();

    if (false != t.WordControl.m_oLogicDocument.DrawingDocument.IsLockObjectsEnable) {
      t.WordControl.m_oLogicDocument.DrawingDocument.IsLockObjectsEnable = false;
      t.WordControl.m_oLogicDocument.DrawingDocument.FirePaint();
    }
  };
};


asc_docs_api.prototype.pre_Save = function(_images)
{
    this.isSaveFonts_Images = true;
    this.saveImageMap = _images;
    this.WordControl.m_oDrawingDocument.CheckFontNeeds();
    this.FontLoader.LoadDocumentFonts2(this.WordControl.m_oLogicDocument.Fonts);
};


asc_docs_api.prototype.asc_SetFastCollaborative = function(isOn)
{
    if (CollaborativeEditing)
        CollaborativeEditing.Set_Fast(isOn);
};

asc_docs_api.prototype.sync_CollaborativeChanges = function()
{
    if (true !== CollaborativeEditing.Is_Fast())
        this.asc_fireCallback("asc_onCollaborativeChanges");
};

asc_docs_api.prototype.asyncServerIdEndLoaded = function () {
    this.ServerIdWaitComplete = true;
    if (true == this.ServerImagesWaitComplete)
        this.OpenDocumentEndCallback();
};

// Эвент о пришедщих изменениях
asc_docs_api.prototype.syncCollaborativeChanges = function () {
	this.asc_fireCallback("asc_onCollaborativeChanges");
};


asc_docs_api.prototype.SetCollaborativeMarksShowType = function(Type)
{
    this.CollaborativeMarksShowType = Type;
};

asc_docs_api.prototype.GetCollaborativeMarksShowType = function(Type)
{
    return this.CollaborativeMarksShowType;
};

asc_docs_api.prototype.Clear_CollaborativeMarks = function()
{
    CollaborativeEditing.Clear_CollaborativeMarks(true);
};

asc_docs_api.prototype._onUpdateDocumentCanSave = function () {
    var CollEditing = CollaborativeEditing;

    // Можно модифицировать это условие на более быстрое (менять самим состояние в аргументах, а не запрашивать каждый раз)
    var isCanSave = this.isDocumentModified() || (true !== CollEditing.Is_SingleUser() && 0 !== CollEditing.getOwnLocksLength());

    if (true === CollEditing.Is_Fast() && true !== CollEditing.Is_SingleUser())
        isCanSave = false;

    if (isCanSave !== this.isDocumentCanSave)
    {
        this.isDocumentCanSave = isCanSave;
        this.asc_fireCallback('asc_onDocumentCanSaveChanged', this.isDocumentCanSave);
    }
};

///////////////////////////////////////////
asc_docs_api.prototype.CheckChangedDocument = function()
{
    if (true === History.Have_Changes())
    {
        // дублирование евента. когда будет undo-redo - тогда
        // эти евенты начнут отличаться
        this.SetDocumentModified(true);
    }
    else
    {
        this.SetDocumentModified(false);
    }

    this._onUpdateDocumentCanSave();
};
asc_docs_api.prototype.SetUnchangedDocument = function()
{
    this.SetDocumentModified(false);
    this._onUpdateDocumentCanSave();
};

asc_docs_api.prototype.SetDocumentModified = function(bValue)
{
    this.isDocumentModify = bValue;
    this.asc_fireCallback("asc_onDocumentModifiedChanged");

    if (undefined !== window["AscDesktopEditor"])
    {
        window["AscDesktopEditor"]["onDocumentModifiedChanged"](bValue);
    }
};

asc_docs_api.prototype.isDocumentModified = function()
{
	if (!this.canSave) {
		// Пока идет сохранение, мы не закрываем документ
		return true;
	}
    return this.isDocumentModify;
};

asc_docs_api.prototype.sync_BeginCatchSelectedElements = function()
{
    if (0 != this.SelectedObjectsStack.length)
        this.SelectedObjectsStack.splice(0, this.SelectedObjectsStack.length);
};
asc_docs_api.prototype.sync_EndCatchSelectedElements = function()
{
    this.asc_fireCallback("asc_onFocusObject", this.SelectedObjectsStack);
};
asc_docs_api.prototype.getSelectedElements = function()
{
    return this.SelectedObjectsStack;
};
asc_docs_api.prototype.sync_ChangeLastSelectedElement = function(type, obj)
{			
	var oUnkTypeObj = null;
			
	switch( type )
	{
		case c_oAscTypeSelectElement.Paragraph: oUnkTypeObj = new Asc.asc_CParagraphProperty( obj );
			break;
		case c_oAscTypeSelectElement.Image: oUnkTypeObj = new Asc.asc_CImgProperty( obj );
			break;
		case c_oAscTypeSelectElement.Table: oUnkTypeObj = new CTableProp( obj );
			break;
		case c_oAscTypeSelectElement.Shape: oUnkTypeObj = obj;
			break;
	}
			
    var _i = this.SelectedObjectsStack.length - 1;
    var bIsFound = false;
    while (_i >= 0)
    {
        if (this.SelectedObjectsStack[_i].Type == type)
        {

            this.SelectedObjectsStack[_i].Value = oUnkTypeObj;
            bIsFound = true;
            break;
        }
        _i--;
    }

    if (!bIsFound)
    {
        this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject ( type, oUnkTypeObj );
    }
};

asc_docs_api.prototype.Init = function() {
  this.WordControl.Init();
};
asc_docs_api.prototype.asc_setLocale = function(val) {
};

asc_docs_api.prototype.SetThemesPath = function(path)
{
    this.ThemeLoader.ThemesUrl = path;
    if (this.documentOrigin) {
        this.ThemeLoader.ThemesUrlAbs = AscCommon.joinUrls(this.documentOrigin + this.documentPathname, path);
    } else {
        this.ThemeLoader.ThemesUrlAbs = path;
    }
};

asc_docs_api.prototype.CreateCSS = function()
{
    if (window["flat_desine"] === true)
    {
        GlobalSkin = GlobalSkinFlat;
    }

    var _head = document.getElementsByTagName('head')[0];

    var style0 = document.createElement('style');
    style0.type = 'text/css';
    style0.innerHTML = ".block_elem { position:absolute;padding:0;margin:0; }";
    _head.appendChild(style0);

    var style1 = document.createElement('style');
    style1.type = 'text/css';
    style1.innerHTML = ".buttonTabs {\
background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAA5CAMAAADjueCuAAAABGdBTUEAALGPC/xhBQAAAEhQTFRFAAAAWFhYZWVlSEhIY2NjV1dXQ0NDYWFhYmJiTk5OVlZWYGBgVFRUS0tLbGxsRERETExMZmZmVVVVXl5eR0dHa2trPj4+u77CpAZQrwAAAAF0Uk5TAEDm2GYAAABwSURBVDjL1dHHDoAgEEVR7NLr4P//qQm6EMaFxtje8oTF5ELIpU35Fstf3GegsPEBG+uwSYpNB1qNKreoDeNw/r6dLr/tnFpbbNZj8wKbk8W/1d6ZPjfrhdHx9c4fbA9wzMYWm3OFhbQmbC2ue6z9DCH/Exf/mU3YAAAAAElFTkSuQmCC);\
background-position: 0px 0px;\
background-repeat: no-repeat;\
}";
    _head.appendChild(style1);

    var style3 = document.createElement('style');
    style3.type = 'text/css';
    style3.innerHTML = ".buttonPrevPage {\
background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAABgBAMAAADm/++TAAAABGdBTUEAALGPC/xhBQAAABJQTFRFAAAA////UVNVu77Cenp62Nrc3x8hMQAAAAF0Uk5TAEDm2GYAAABySURBVCjPY2AgETDBGEoKUAElJcJSxANjKGAwDQWDYAKMIBhDSRXCCFJSIixF0GS4M+AMExcwcCbAcIQxBEUgDEdBQcJSBE2GO4PU6IJHASxS4NGER4p28YWIAlikwKMJjxTt4gsRBbBIgUcTHini4wsAwMmIvYZODL0AAAAASUVORK5CYII=);\
background-position: 0px 0px;\
background-repeat: no-repeat;\
}";
    _head.appendChild(style3);

    var style4 = document.createElement('style');
    style4.type = 'text/css';
    style4.innerHTML = ".buttonNextPage {\
background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAABgBAMAAADm/++TAAAABGdBTUEAALGPC/xhBQAAABJQTFRFAAAA////UVNVu77Cenp62Nrc3x8hMQAAAAF0Uk5TAEDm2GYAAABySURBVCjPY2AgETDBGEoKUAElJcJSxANjKGAwDQWDYAKMIBhDSRXCCFJSIixF0GS4M+AMExcwcCbAcIQxBEUgDEdBQcJSBE2GO4PU6IJHASxS4NGER4p28YWIAlikwKMJjxTt4gsRBbBIgUcTHini4wsAwMmIvYZODL0AAAAASUVORK5CYII=);\
background-position: 0px -48px;\
background-repeat: no-repeat;\
}";
    _head.appendChild(style4);
};

asc_docs_api.prototype.CreateComponents = function()
{
    this.CreateCSS();

    var _main_border_style = "border-bottom-width: 1px;border-bottom-color:" + GlobalSkin.BorderSplitterColor + "; border-bottom-style: solid;";
    var _thumbnail_style_right = "border-right-width: 1px;border-right-color:" + GlobalSkin.BorderSplitterColor + "; border-right-style: solid;";
    if (!GlobalSkin.SupportNotes)
    {
        _main_border_style = "";
        _thumbnail_style_right = "";
    }

    var _innerHTML = "<div id=\"id_panel_thumbnails\" class=\"block_elem\" style=\"background-color:" + GlobalSkin.BackgroundColorThumbnails + ";" + _thumbnail_style_right + "\">\
		                            <canvas id=\"id_thumbnails_background\" class=\"block_elem\" style=\"-webkit-user-select: none;background-color:#EBEBEB;z-index:1\"></canvas>\
		                            <canvas id=\"id_thumbnails\" class=\"block_elem\" style=\"-webkit-user-select: none;z-index:2\"></canvas>\
		                            <div id=\"id_vertical_scroll_thmbnl\" style=\"left:0;top:0;width:1px;overflow:hidden;position:absolute;\">\
									    <div id=\"panel_right_scroll_thmbnl\" class=\"block_elem\" style=\"left:0;top:0;width:1px;height:6000px;\"></div>\
									</div>\
		                        </div>\
                            <div id=\"id_main\" class=\"block_elem\" style=\"-moz-user-select:none;-khtml-user-select:none;user-select:none;background-color:" + GlobalSkin.BackgroundColor + ";overflow:hidden;border-left-width: 1px;border-left-color:" + GlobalSkin.BorderSplitterColor + "; border-left-style: solid;" + _main_border_style + "\" UNSELECTABLE=\"on\">\
								<div id=\"id_panel_left\" class=\"block_elem\">\
									<canvas id=\"id_buttonTabs\" class=\"block_elem\"></canvas>\
									<canvas id=\"id_vert_ruler\" class=\"block_elem\"></canvas>\
								</div>\
                                <div id=\"id_panel_top\" class=\"block_elem\">\
									<canvas id=\"id_hor_ruler\" class=\"block_elem\"></canvas>\
                                </div>\
                                <div id=\"id_main_view\" class=\"block_elem\" style=\"overflow:hidden\">\
                                    <canvas id=\"id_viewer\" class=\"block_elem\" style=\"-webkit-user-select: none;background-color:#B0B0B0;z-index:1\"></canvas>\
                                    <canvas id=\"id_viewer_overlay\" class=\"block_elem\" style=\"-webkit-user-select: none;z-index:2\"></canvas>\
                                    <canvas id=\"id_target_cursor\" class=\"block_elem\" width=\"1\" height=\"1\" style=\"-webkit-user-select: none;width:2px;height:13px;display:none;z-index:4;\"></canvas>\
                                </div>\
							    <div id=\"id_panel_right\" class=\"block_elem\" style=\"margin-right:1px;background-color:#F1F1F1;\">\
							        <div id=\"id_buttonRulers\" class=\"block_elem buttonRuler\"></div>\
								    <div id=\"id_vertical_scroll\" style=\"left:0;top:0;width:14px;overflow:hidden;position:absolute;\">\
									    <div id=\"panel_right_scroll\" class=\"block_elem\" style=\"left:0;top:0;width:1px;height:6000px;\"></div>\
								    </div>\
								    <div id=\"id_buttonPrevPage\" class=\"block_elem buttonPrevPage\"></div>\
								    <div id=\"id_buttonNextPage\" class=\"block_elem buttonNextPage\"></div>\
                                </div>\
                                <div id=\"id_horscrollpanel\" class=\"block_elem\" style=\"margin-bottom:1px;background-color:#B0B0B0;\">\
                                    <div id=\"id_horizontal_scroll\" style=\"left:0;top:0;height:14px;overflow:hidden;position:absolute;width:100%;\">\
                                        <div id=\"panel_hor_scroll\" class=\"block_elem\" style=\"left:0;top:0;width:6000px;height:1px;\"></div>\
                                    </div>\
                                </div>\
                            </div>";

    if (true)
    {
        _innerHTML += "<div id=\"id_panel_notes\" class=\"block_elem\" style=\"background-color:#FFFFFF;border-left-width: 1px;border-left-color:" + GlobalSkin.BorderSplitterColor + "; border-left-style: solid;border-top-width: 1px;border-top-color:" + GlobalSkin.BorderSplitterColor + "; border-top-style: solid;\">\
                                <canvas id=\"id_notes\" class=\"block_elem\" style=\"background-color:#FFFFFF;z-index:1\"></canvas>\
                                <div id=\"id_vertical_scroll_notes\" style=\"left:0;top:0;width:16px;overflow:hidden;position:absolute;\">\
                                    <div id=\"panel_right_scroll_notes\" class=\"block_elem\" style=\"left:0;top:0;width:16px;height:6000px;\"></div>\
                                </div>\
                            </div>";
    }

	if (this.HtmlElement != null)
    {
        if (GlobalSkin.Name == "flat")
          this.HtmlElement.style.backgroundColor = GlobalSkin.BackgroundColorThumbnails;

      this.HtmlElement.innerHTML = _innerHTML;
    }
};

asc_docs_api.prototype.InitEditor = function()
{
    this.WordControl.m_oLogicDocument   = new CPresentation(this.WordControl.m_oDrawingDocument);
    this.WordControl.m_oDrawingDocument.m_oLogicDocument = this.WordControl.m_oLogicDocument;
};

asc_docs_api.prototype.SetInterfaceDrawImagePlaceShape = function(div_id)
{
    this.WordControl.m_oDrawingDocument.InitGuiCanvasShape(div_id);
};
asc_docs_api.prototype.SetInterfaceDrawImagePlaceSlide = function(div_id)
{
    this.WordControl.m_oDrawingDocument.InitGuiCanvasSlide(div_id);
};

asc_docs_api.prototype.SetInterfaceDrawImagePlaceTextArt = function(div_id)
{
    this.WordControl.m_oDrawingDocument.InitGuiCanvasTextArt(div_id);
};

asc_docs_api.prototype.SetInterfaceDrawImagePlace = function()
{};

asc_docs_api.prototype.OpenDocument2 = function(url, gObject)
{
	this.InitEditor();
	this.DocumentType = 2;

    var _loader = new AscCommon.BinaryPPTYLoader();

    _loader.Api = this;
    g_oIdCounter.Set_Load(true);
    _loader.Load(gObject, this.WordControl.m_oLogicDocument);
    this.WordControl.m_oLogicDocument.Set_FastCollaborativeEditing(true);
    _loader.Check_TextFit();

    if (History && History.Update_FileDescription)
        History.Update_FileDescription(_loader.stream);

	this.LoadedObject = 1;
    g_oIdCounter.Set_Load(false);

    this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Open);

	//this.FontLoader.LoadEmbeddedFonts(this.DocumentUrl, this.WordControl.m_oLogicDocument.EmbeddedFonts);
	this.FontLoader.LoadDocumentFonts(this.WordControl.m_oLogicDocument.Fonts, false);

    this.ParcedDocument = true;
    g_oIdCounter.Set_Load(false);
	if (this.isStartCoAuthoringOnEndLoad) {
		this.CoAuthoringApi.onStartCoAuthoring(true);
		this.isStartCoAuthoringOnEndLoad = false;
	}

    if (this.isMobileVersion)
    {
      AscCommon.AscBrowser.isSafariMacOs = false;
      PasteElementsId.PASTE_ELEMENT_ID = "wrd_pastebin";
      PasteElementsId.ELEMENT_DISPAY_STYLE = "none";
    }

    if (AscCommon.AscBrowser.isSafariMacOs)
        setInterval(AscCommon.SafariIntervalFocus, 10);
};

asc_docs_api.prototype._OfflineAppDocumentEndLoad = function() {
  if (undefined == window["editor_bin"])
    return;

  this.OpenDocument2(this.documentUrl, window["editor_bin"]);
  //callback
  this.DocumentOrientation = (null == this.WordControl.m_oLogicDocument) ? true : !this.WordControl.m_oLogicDocument.Orientation;
};
// Callbacks
/* все имена callback'оф начинаются с On. Пока сделаны: 
	OnBold, 
	OnItalic, 
	OnUnderline, 
	OnTextPrBaseline(возвращается расположение строки - supstring, superstring, baseline), 
	OnPrAlign(выравнивание по ширине, правому краю, левому краю, по центру), 
	OnListType( возвращается AscCommon.asc_CListType )

	фейк-функции ожидающие TODO:
	Print,Undo,Redo,Copy,Cut,Paste,Share,Save,Download & callbacks
	OnFontName, OnFontSize, OnLineSpacing

	OnFocusObject( возвращается массив asc_CSelectedObject )
	OnInitEditorStyles( возвращается CStylesPainter )
	OnSearchFound( возвращается CSearchResult );
	OnParaSpacingLine( возвращается AscCommon.asc_CParagraphSpacing )
	OnLineSpacing( не используется? )
	OnTextColor( возвращается AscCommon.CColor )
	OnTextHightLight( возвращается AscCommon.CColor )
	OnInitEditorFonts( возвращается массив объектов СFont )
	OnFontFamily( возвращается asc_CTextFontFamily )
*/
var _callbacks = {};

asc_docs_api.prototype.asc_registerCallback = function(name, callback) {
	if (!_callbacks.hasOwnProperty(name))
		_callbacks[name] = [];
	_callbacks[name].push(callback);
};

asc_docs_api.prototype.asc_unregisterCallback = function(name, callback) {
	if (_callbacks.hasOwnProperty(name)) {
		for (var i = _callbacks[name].length - 1; i >= 0 ; --i) {
			if (_callbacks[name][i] == callback)
				_callbacks[name].splice(i, 1);
		}
	}
};

asc_docs_api.prototype.asc_fireCallback = function(name)
{
	if (_callbacks.hasOwnProperty(name))
    {
		for (var i = 0; i < _callbacks[name].length; ++i)
        {
			_callbacks[name][i].apply(this || window, Array.prototype.slice.call(arguments, 1));
		}
        return true;
	}
    return false;
};
asc_docs_api.prototype.asc_checkNeedCallback = function(name) {
    if (_callbacks.hasOwnProperty(name))
    {
        return true;
    }
    return false;
};

// get functions
asc_docs_api.prototype.get_TextProps = function()
{
	var Doc = this.WordControl.m_oLogicDocument;
	var ParaPr = Doc.Get_Paragraph_ParaPr();
	var TextPr = Doc.Get_Paragraph_TextPr();

	// return { ParaPr: ParaPr, TextPr : TextPr };
	return new CParagraphAndTextProp (ParaPr, TextPr);	// uncomment if this method will be used externally. 20/03/2012 uncommented for testers
};

// -------
// тут методы, замены евентов
asc_docs_api.prototype.get_PropertyEditorShapes = function()
{
    var ret = [g_oAutoShapesGroups, g_oAutoShapesTypes];
    return ret;
};
asc_docs_api.prototype.get_PropertyEditorTextArts = function()
{
    var ret = [g_oPresetTxWarpGroups, g_PresetTxWarpTypes];
    return ret;
};
asc_docs_api.prototype.get_PropertyStandartTextures = function()
{
    var _count = g_oUserTexturePresets.length;
    var arr = new Array(_count);
    for (var i = 0; i < _count; ++i)
    {
        arr[i] = new AscCommon.asc_CTexture();
        arr[i].Id = i;
        arr[i].Image = g_oUserTexturePresets[i];
    }
    return arr;
};
asc_docs_api.prototype.get_PropertyEditorThemes = function()
{
    var ret = [this._gui_editor_themes, this._gui_document_themes];
    return ret;
};

// -------

// -------
asc_docs_api.prototype.get_ContentCount = function()
{
	return this.WordControl.m_oLogicDocument.Content.length;
};

asc_docs_api.prototype.select_Element = function(Index)
{
	var Document = this.WordControl.m_oLogicDocument;

	if ( true === Document.Selection.Use )
		Document.Selection_Remove();

	Document.DrawingDocument.SelectEnabled(true);
	Document.DrawingDocument.TargetEnd();

	Document.Selection.Use      = true;
	Document.Selection.Start    = false;
	Document.Selection.Flag     = selectionflag_Common;

	Document.Selection.StartPos = Index;
	Document.Selection.EndPos   = Index;

	Document.Content[Index].Selection.Use      = true;
	Document.Content[Index].Selection.StartPos = Document.Content[Index].Internal_GetStartPos();
	Document.Content[Index].Selection.EndPos   = Document.Content[Index].Content.length - 1;

	Document.Selection_Draw();
};

asc_docs_api.prototype.UpdateTextPr = function(TextPr)
{
	if ( "undefined" != typeof(TextPr) )
	{
        if (TextPr.Color !== undefined)
        {
            this.WordControl.m_oDrawingDocument.TargetCursorColor.R = TextPr.Color.r;
            this.WordControl.m_oDrawingDocument.TargetCursorColor.G = TextPr.Color.g;
            this.WordControl.m_oDrawingDocument.TargetCursorColor.B = TextPr.Color.b;
        }
        if(TextPr.Bold === undefined)
            TextPr.Bold = false;
        if(TextPr.Italic === undefined)
            TextPr.Italic = false;
        if(TextPr.Underline === undefined)
            TextPr.Underline = false;
        if(TextPr.Strikeout === undefined)
            TextPr.Strikeout = false;
        if(TextPr.FontFamily === undefined)
            TextPr.FontFamily = {Index : 0, Name : ""};
        if(TextPr.FontSize === undefined)
            TextPr.FontSize = "";

        this.sync_BoldCallBack(TextPr.Bold);
        this.sync_ItalicCallBack(TextPr.Italic);
        this.sync_UnderlineCallBack(TextPr.Underline);
        this.sync_StrikeoutCallBack(TextPr.Strikeout);
        this.sync_TextPrFontSizeCallBack(TextPr.FontSize);
        this.sync_TextPrFontFamilyCallBack(TextPr.FontFamily);

        if (TextPr.VertAlign !== undefined)
            this.sync_VerticalAlign(TextPr.VertAlign);
        if (TextPr.Spacing !== undefined)
            this.sync_TextSpacing(TextPr.Spacing);
        if (TextPr.DStrikeout !== undefined)
            this.sync_TextDStrikeout(TextPr.DStrikeout);
        if (TextPr.Caps !== undefined)
            this.sync_TextCaps(TextPr.Caps);
        if (TextPr.SmallCaps !== undefined)
            this.sync_TextSmallCaps(TextPr.SmallCaps);
        if (TextPr.Position !== undefined)
            this.sync_TextPosition(TextPr.Position);
        if (TextPr.Lang !== undefined)
            this.sync_TextLangCallBack(TextPr.Lang);
		
        if (TextPr.Unifill !== undefined)
        {
            this.sync_TextColor2(TextPr.Unifill);
        }
	}
};

asc_docs_api.prototype.sync_TextSpacing = function(Spacing)
{
    this.asc_fireCallback("asc_onTextSpacing", Spacing );
};
asc_docs_api.prototype.sync_TextDStrikeout = function(Value)
{
    this.asc_fireCallback("asc_onTextDStrikeout", Value );
};
asc_docs_api.prototype.sync_TextCaps = function(Value)
{
    this.asc_fireCallback("asc_onTextCaps", Value );
};
asc_docs_api.prototype.sync_TextSmallCaps = function(Value)
{
    this.asc_fireCallback("asc_onTextSmallCaps", Value );
};
asc_docs_api.prototype.sync_TextPosition = function(Value)
{
    this.asc_fireCallback("asc_onTextPosition", Value );
};
asc_docs_api.prototype.sync_TextLangCallBack = function(Lang)
{
    this.asc_fireCallback("asc_onTextLanguage", Lang.Val );
};

asc_docs_api.prototype.sync_VerticalTextAlign = function(align)
{
    this.asc_fireCallback("asc_onVerticalTextAlign", align);
};
asc_docs_api.prototype.sync_Vert = function(vert)
{
    this.asc_fireCallback("asc_onVert", vert);
};

asc_docs_api.prototype.UpdateParagraphProp = function(ParaPr, bParaPr){

    ParaPr.StyleName = "";
    var TextPr = editor.WordControl.m_oLogicDocument.Get_Paragraph_TextPr();
    ParaPr.Subscript   = ( TextPr.VertAlign === AscCommon.vertalign_SubScript   ? true : false );
    ParaPr.Superscript = ( TextPr.VertAlign === AscCommon.vertalign_SuperScript ? true : false );
    ParaPr.Strikeout   = TextPr.Strikeout;
    ParaPr.DStrikeout  = TextPr.DStrikeout;
    ParaPr.AllCaps     = TextPr.Caps;
    ParaPr.SmallCaps   = TextPr.SmallCaps;
    ParaPr.TextSpacing = TextPr.Spacing;
    ParaPr.Position    = TextPr.Position;
    if(ParaPr.Bullet)
    {
        var ListType = {
            Type: -1,
            SubType: -1
        };
        if(ParaPr.Bullet && ParaPr.Bullet.bulletType)
        {
            switch (ParaPr.Bullet.bulletType.type)
            {
                case AscFormat.BULLET_TYPE_BULLET_CHAR:
                {
                    ListType.Type = 0;
                    ListType.SubType = undefined;
                    switch(ParaPr.Bullet.bulletType.Char)
                    {
                        case "•":
                        {
                            ListType.SubType = 1;
                            break;
                        }
                        case  "o":
                        {
                            ListType.SubType = 2;
                            break;
                        }
                        case  "§":
                        {
                            ListType.SubType = 3;
                            break;
                        }
                        case  String.fromCharCode( 0x0076 ):
                        {
                            ListType.SubType = 4;
                            break;
                        }
                        case  String.fromCharCode( 0x00D8 ):
                        {
                            ListType.SubType = 5;
                            break;
                        }
                        case  String.fromCharCode( 0x00FC ):
                        {
                            ListType.SubType = 6;
                            break;
                        }
                        case String.fromCharCode( 119 ):
                        {
                            ListType.SubType = 7;
                            break;
                        }
                    }
                    break;
                }
                case AscFormat.BULLET_TYPE_BULLET_BLIP:
                {
                    ListType.Type = 0;
                    ListType.SubType = undefined;
                    break;
                }
                case AscFormat.BULLET_TYPE_BULLET_AUTONUM:
                {
                    ListType.Type = 1;
                    ListType.SubType = undefined;
                    if(AscFormat.isRealNumber(ParaPr.Bullet.bulletType.AutoNumType))
                    {
                        var AutoNumType = g_NumberingArr[ParaPr.Bullet.bulletType.AutoNumType] - 99;
                        if(AutoNumType > 0 && AutoNumType < 9)
                        {
                            ListType.SubType = AutoNumType;
                        }
                    }
                    break;
                }
            }
        }
        ParaPr.ListType = ListType;
    }
    else
    {
        ParaPr.ListType = {Type: -1, SubType: -1};
    }
	this.sync_ParaSpacingLine( ParaPr.Spacing );
	this.Update_ParaInd(ParaPr.Ind);
	this.sync_PrAlignCallBack(ParaPr.Jc);
	this.sync_ParaStyleName(ParaPr.StyleName);
	this.sync_ListType(ParaPr.ListType);
    if(!(bParaPr === true))
	    this.sync_PrPropCallback(ParaPr);
};
/*----------------------------------------------------------------*/
/*functions for working with clipboard, document*/
/*TODO: Print,Undo,Redo,Copy,Cut,Paste,Share,Save,DownloadAs,ReturnToDocuments(вернуться на предыдущую страницу) & callbacks for these functions*/
asc_docs_api.prototype.asc_Print = function(bIsDownloadEvent){

    if (window["AscDesktopEditor"])
    {
        window["AscDesktopEditor"]["Print"]();
        return;
    }
    var options = {downloadType: bIsDownloadEvent ? DownloadType.Print: DownloadType.None};
	_downloadAs(this, c_oAscFileType.PDF, c_oAscAsyncAction.Print, options);
};
asc_docs_api.prototype.Undo = function(){
	this.WordControl.m_oLogicDocument.Document_Undo();
};
asc_docs_api.prototype.Redo = function(){
	this.WordControl.m_oLogicDocument.Document_Redo();
};
asc_docs_api.prototype.Copy = function()
{
    if (window["AscDesktopEditor"])
    {
        var _e = new CKeyboardEvent();
        _e.CtrlKey = true;
        _e.KeyCode = 67;

		window["AscDesktopEditorButtonMode"] = true;
        this.WordControl.m_oLogicDocument.OnKeyDown(_e);
		window["AscDesktopEditorButtonMode"] = false;

        return;
    }
	return AscCommon.Editor_Copy_Button(this);
};
asc_docs_api.prototype.Update_ParaTab = function(Default_Tab, ParaTabs){
    this.WordControl.m_oDrawingDocument.Update_ParaTab(Default_Tab, ParaTabs);
};
asc_docs_api.prototype.Cut = function()
{
    if (window["AscDesktopEditor"])
    {
        var _e = new CKeyboardEvent();
        _e.CtrlKey = true;
        _e.KeyCode = 88;

		window["AscDesktopEditorButtonMode"] = true;
        this.WordControl.m_oLogicDocument.OnKeyDown(_e);
		window["AscDesktopEditorButtonMode"] = false;

        return;
    }
	return AscCommon.Editor_Copy_Button(this, true);
};
asc_docs_api.prototype.Paste = function()
{
    if (window["AscDesktopEditor"])
    {
        var _e = new CKeyboardEvent();
        _e.CtrlKey = true;
        _e.KeyCode = 86;

		window["AscDesktopEditorButtonMode"] = true;
        this.WordControl.m_oLogicDocument.OnKeyDown(_e);		
		window["AscDesktopEditorButtonMode"] = false;

        return;
    }
    if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props))
    {
        if (!window.GlobalPasteFlag)
        {
            if (!AscCommon.AscBrowser.isSafariMacOs)
            {
                window.GlobalPasteFlag = true;
                return AscCommon.Editor_Paste_Button(this);
            }
            else
            {
                if (0 === window.GlobalPasteFlagCounter)
                {
                  AscCommon.SafariIntervalFocus();
                    window.GlobalPasteFlag = true;
                    return AscCommon.Editor_Paste_Button(this);
                }
            }
        }
    }
};
asc_docs_api.prototype.Share = function(){

};


function OnSave_Callback(e) {
  if (false == e["saveLock"]) {
    if (editor.isLongAction()) {
      // Мы не можем в этот момент сохранять, т.к. попали в ситуацию, когда мы залочили сохранение и успели нажать вставку до ответа
      // Нужно снять lock с сохранения
      editor.CoAuthoringApi.onUnSaveLock = function() {
        editor.canSave = true;
        editor.IsUserSave = false;
      };
      editor.CoAuthoringApi.unSaveLock();
      return;
    }
    editor.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.Save);

    if (c_oAscCollaborativeMarksShowType.LastChanges === editor.CollaborativeMarksShowType) {
      CollaborativeEditing.Clear_CollaborativeMarks();
    }

    // Принимаем чужие изменения
    CollaborativeEditing.Apply_Changes();

    editor.CoAuthoringApi.onUnSaveLock = function() {
      editor.CoAuthoringApi.onUnSaveLock = null;

      // Выставляем, что документ не модифицирован
      editor.CheckChangedDocument();
      editor.canSave = true;
      editor.IsUserSave = false;
      editor.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.Save);

      // Обновляем состояние возможности сохранения документа
      editor._onUpdateDocumentCanSave();

      if (undefined !== window["AscDesktopEditor"]) {
        window["AscDesktopEditor"]["OnSave"]();
      }
    };
      var CursorInfo = null;
      if (true === CollaborativeEditing.Is_Fast()) {
          CursorInfo = History.Get_DocumentPositionBinary();
      }
      // Пересылаем свои изменения
    CollaborativeEditing.Send_Changes(editor.IsUserSave, {UserId: editor.CoAuthoringApi.getUserConnectionId(), UserShortId : editor.DocInfo.get_UserId(), CursorInfo: CursorInfo});
  } else {
    var nState = editor.CoAuthoringApi.get_state();
    if (AscCommon.ConnectionState.ClosedCoAuth === nState || AscCommon.ConnectionState.ClosedAll === nState) {
      // Отключаемся от сохранения, соединение потеряно
      editor.canSave = true;
      editor.IsUserSave = false;
    } else {
      var TimeoutInterval = (true === CollaborativeEditing.Is_Fast() ? 1 : 1000);
      setTimeout(function() {
        editor.CoAuthoringApi.askSaveChanges(OnSave_Callback);
      }, TimeoutInterval);
    }
  }
}

asc_docs_api.prototype.asc_Save = function(isAutoSave) {
  this.IsUserSave = !isAutoSave;
  if (true === this.canSave && !this.isLongAction()) {
    this.canSave = false;
    this.CoAuthoringApi.askSaveChanges(OnSave_Callback);
  }
};
asc_docs_api.prototype.asc_DownloadAs = function(typeFile, bIsDownloadEvent){//передаем число соответствующее своему формату.
	var options = {downloadType: bIsDownloadEvent ? DownloadType.Download: DownloadType.None};
	_downloadAs(this, typeFile, c_oAscAsyncAction.DownloadAs, options);
};
asc_docs_api.prototype.Resize = function(){
	if (false === this.bInit_word_control)
		return;
	this.WordControl.OnResize(false);
};
asc_docs_api.prototype.AddURL = function(url){

};
asc_docs_api.prototype.Help = function(){

};
asc_docs_api.prototype.startGetDocInfo = function(){
	/*
	Возвращаем объект следующего вида:
	{
		PageCount: 12,
		WordsCount: 2321,
		ParagraphCount: 45,
		SymbolsCount: 232345,
		SymbolsWSCount: 34356
	}
	*/
	this.sync_GetDocInfoStartCallback();

    this.WordControl.m_oLogicDocument.Statistics_Start();
};
asc_docs_api.prototype.stopGetDocInfo = function(){
    this.sync_GetDocInfoStopCallback();
    this.WordControl.m_oLogicDocument.Statistics_Stop();
};
asc_docs_api.prototype.sync_DocInfoCallback = function(obj){
	this.asc_fireCallback( "asc_onDocInfo", new CDocInfoProp(obj));
};
asc_docs_api.prototype.sync_GetDocInfoStartCallback = function(){
	this.asc_fireCallback("asc_onGetDocInfoStart");
};
asc_docs_api.prototype.sync_GetDocInfoStopCallback = function(){
	this.asc_fireCallback("asc_onGetDocInfoStop");
};
asc_docs_api.prototype.sync_GetDocInfoEndCallback = function(){
	this.asc_fireCallback("asc_onGetDocInfoEnd");
};
asc_docs_api.prototype.sync_CanUndoCallback = function(bCanUndo)
{
    if (true === CollaborativeEditing.Is_Fast() && true !== CollaborativeEditing.Is_SingleUser())
        bCanUndo = false;

    this.asc_fireCallback("asc_onCanUndo", bCanUndo);
};
asc_docs_api.prototype.sync_CanRedoCallback = function(bCanRedo)
{
    if (true === CollaborativeEditing.Is_Fast() && true !== CollaborativeEditing.Is_SingleUser())
        bCanRedo = false;

    this.asc_fireCallback("asc_onCanRedo", bCanRedo);
};


/*callbacks*/
/*asc_docs_api.prototype.sync_CursorLockCallBack = function(isLock){
	this.asc_fireCallback("asc_onCursorLock",isLock);
}*/
asc_docs_api.prototype.sync_UndoCallBack = function(){
	this.asc_fireCallback("asc_onUndo");
};
asc_docs_api.prototype.sync_RedoCallBack = function(){
	this.asc_fireCallback("asc_onRedo");
};
asc_docs_api.prototype.sync_CopyCallBack = function(){
	this.asc_fireCallback("asc_onCopy");
};
asc_docs_api.prototype.sync_CutCallBack = function(){
	this.asc_fireCallback("asc_onCut");
};
asc_docs_api.prototype.sync_PasteCallBack = function(){
	this.asc_fireCallback("asc_onPaste");
};
asc_docs_api.prototype.sync_ShareCallBack = function(){
	this.asc_fireCallback("asc_onShare");
};
asc_docs_api.prototype.sync_SaveCallBack = function(){
	this.asc_fireCallback("asc_onSave");
};
asc_docs_api.prototype.sync_DownloadAsCallBack = function(){
	this.asc_fireCallback("asc_onDownload");
};

asc_docs_api.prototype.sync_AddURLCallback = function(){
	this.asc_fireCallback("asc_onAddURL");
};
asc_docs_api.prototype.sync_ErrorCallback = function(errorID,errorLevel){
	this.asc_fireCallback("asc_onError",errorID,errorLevel);
};
asc_docs_api.prototype.sync_HelpCallback = function(url){
	this.asc_fireCallback("asc_onHelp",url);
};
asc_docs_api.prototype.sync_UpdateZoom = function(zoom){
	this.asc_fireCallback("asc_onZoom", zoom);
};
asc_docs_api.prototype.sync_StatusMessage = function(message){
	this.asc_fireCallback("asc_onMessage", message);
};
asc_docs_api.prototype.ClearPropObjCallback = function(prop){//колбэк предшествующий приходу свойств объекта, prop а всякий случай

	this.asc_fireCallback("asc_onClearPropObj", prop);
};


asc_docs_api.prototype.CollectHeaders = function(){
	this.sync_ReturnHeadersCallback(_fakeHeaders);
};
asc_docs_api.prototype.GetActiveHeader = function(){
	
};
asc_docs_api.prototype.gotoHeader = function(page, X, Y){
	this.goToPage(page);
};
asc_docs_api.prototype.sync_ChangeActiveHeaderCallback = function (position, header){
	this.asc_fireCallback("asc_onChangeActiveHeader", position, new CHeader (header));
};
asc_docs_api.prototype.sync_ReturnHeadersCallback = function (headers){
	var _headers = [];
	for (var i = 0; i < headers.length; i++)
	{	
		_headers[i] = new CHeader (headers[i]);
	}
	
	this.asc_fireCallback("asc_onReturnHeaders", _headers);
};
/*----------------------------------------------------------------*/
/*functions for working with search*/
/*
	структура поиска, предварительно, выглядит так
	{
		text: "...<b>слово поиска</b>...",
		pageNumber: 0, //содержит номер страницы, где находится искомая последовательность
		X: 0,//координаты по OX начала последовательности на данной страницы
		Y: 0//координаты по OY начала последовательности на данной страницы
	}
*/
asc_docs_api.prototype.startSearchText = function(what){// "what" means word(s) what we search
	this._searchCur = 0;
	this.sync_SearchStartCallback();

    if (null != this.WordControl.m_oLogicDocument)
        this.WordControl.m_oLogicDocument.Search_Start(what);
    else
        this.WordControl.m_oDrawingDocument.m_oDocumentRenderer.StartSearch(what);
};

asc_docs_api.prototype.goToNextSearchResult = function()
{
    this.WordControl.m_oLogicDocument.goToNextSearchResult();
};


asc_docs_api.prototype.gotoSearchResultText = function(navigator){//переход к результату.

    this.WordControl.m_oDrawingDocument.CurrentSearchNavi = navigator;
    this.WordControl.ToSearchResult();
};
asc_docs_api.prototype.stopSearchText = function(){
	this.sync_SearchStopCallback();

    this.WordControl.m_oLogicDocument.Search_Stop();
};
asc_docs_api.prototype.findText = function(text, isNext){

    var SearchEngine = editor.WordControl.m_oLogicDocument.Search(text, {MatchCase: false});

    var Id = this.WordControl.m_oLogicDocument.Search_GetId( isNext );

    if ( null != Id )
        this.WordControl.m_oLogicDocument.Search_Select( Id );

    return SearchEngine.Count;

    //return this.WordControl.m_oLogicDocument.findText(text, scanForward);
};

asc_docs_api.prototype.asc_searchEnabled = function(bIsEnabled)
{
    // пустой метод
};

asc_docs_api.prototype.asc_findText = function(text, isNext, isMatchCase)
{
    return this.WordControl.m_oLogicDocument.findText(text, isNext === true);
};
// returns: CSearchResult
asc_docs_api.prototype.sync_SearchFoundCallback = function(obj){
	this.asc_fireCallback("asc_onSearchFound", new CSearchResult(obj));
};
asc_docs_api.prototype.sync_SearchStartCallback = function(){
	this.asc_fireCallback("asc_onSearchStart");
};
asc_docs_api.prototype.sync_SearchStopCallback = function(){
	this.asc_fireCallback("asc_onSearchStop");
};
asc_docs_api.prototype.sync_SearchEndCallback = function(){
	this.asc_fireCallback("asc_onSearchEnd");
};
/*----------------------------------------------------------------*/
/*functions for working with font*/
/*setters*/
asc_docs_api.prototype.put_TextPrFontName = function(name)
{
	var loader = AscCommon.g_font_loader;
    var fontinfo = AscFonts.g_fontApplication.GetFontInfo(name);
	var isasync = loader.LoadFont(fontinfo);
	if (false === isasync)
    {
        if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
            this.WordControl.m_oLogicDocument.Paragraph_Add(new ParaTextPr({
                FontFamily: {
                    Name: name,
                    Index: -1
                }
            }));
        }
    }
};
asc_docs_api.prototype.put_TextPrFontSize = function(size)
{
    if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
        History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
        this.WordControl.m_oLogicDocument.Paragraph_Add(new ParaTextPr({FontSize: Math.min(size, 100)}));
    }
};
asc_docs_api.prototype.put_TextPrBold = function(value)
{
    if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
        History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
        this.WordControl.m_oLogicDocument.Paragraph_Add(new ParaTextPr({Bold: value}));
    }
};
asc_docs_api.prototype.put_TextPrItalic = function(value)
{
    if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
        History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
        this.WordControl.m_oLogicDocument.Paragraph_Add(new ParaTextPr({Italic: value}));
    }
};
asc_docs_api.prototype.put_TextPrUnderline = function(value)
{
    if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
        History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
        this.WordControl.m_oLogicDocument.Paragraph_Add(new ParaTextPr({Underline: value}));
    }
};
asc_docs_api.prototype.put_TextPrStrikeout = function(value)
{
    if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
        History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
        this.WordControl.m_oLogicDocument.Paragraph_Add(new ParaTextPr({Strikeout: value}));
    }
};
asc_docs_api.prototype.put_PrLineSpacing = function(Type, Value)
{
	this.WordControl.m_oLogicDocument.Set_ParagraphSpacing( { LineRule : Type,  Line : Value } );
};
asc_docs_api.prototype.put_LineSpacingBeforeAfter = function(type,value)//"type == 0" means "Before", "type == 1" means "After"
{
	switch (type)
    {
		case 0:
			this.WordControl.m_oLogicDocument.Set_ParagraphSpacing( {Before : value}); break;
		case 1:
			this.WordControl.m_oLogicDocument.Set_ParagraphSpacing( {After : value}); break;
	}
};
asc_docs_api.prototype.FontSizeIn = function()
{
    this.WordControl.m_oLogicDocument.Paragraph_IncDecFontSize(true);
};
asc_docs_api.prototype.FontSizeOut = function()
{
    this.WordControl.m_oLogicDocument.Paragraph_IncDecFontSize(false);
};

asc_docs_api.prototype.put_AlignBySelect = function(val)
{
    this.bAlignBySelected = val;
};

asc_docs_api.prototype.get_AlignBySelect = function()
{
    return this.bAlignBySelected;
};

/*callbacks*/
asc_docs_api.prototype.sync_BoldCallBack = function(isBold){
	this.asc_fireCallback("asc_onBold",isBold);
};
asc_docs_api.prototype.sync_ItalicCallBack = function(isItalic){
	this.asc_fireCallback("asc_onItalic",isItalic);
};
asc_docs_api.prototype.sync_UnderlineCallBack = function(isUnderline){
	this.asc_fireCallback("asc_onUnderline",isUnderline);
};
asc_docs_api.prototype.sync_StrikeoutCallBack = function(isStrikeout){
	this.asc_fireCallback("asc_onStrikeout",isStrikeout);
};
asc_docs_api.prototype.sync_TextPrFontFamilyCallBack = function(FontFamily){
	this.asc_fireCallback("asc_onFontFamily", new AscCommon.asc_CTextFontFamily( FontFamily ));
};
asc_docs_api.prototype.sync_TextPrFontSizeCallBack = function(FontSize){
	this.asc_fireCallback("asc_onFontSize", FontSize);
};
asc_docs_api.prototype.sync_PrLineSpacingCallBack = function(LineSpacing){
	this.asc_fireCallback("asc_onLineSpacing", new AscCommon.asc_CParagraphSpacing ( LineSpacing ) );
};

asc_docs_api.prototype.sync_InitEditorThemes = function(gui_editor_themes, gui_document_themes){
    this._gui_editor_themes = gui_editor_themes;
    this._gui_document_themes = gui_document_themes;
    this.asc_fireCallback("asc_onInitEditorStyles", [gui_editor_themes, gui_document_themes]);
};
asc_docs_api.prototype.sync_InitEditorTableStyles = function(styles){
    this.asc_fireCallback("asc_onInitTableTemplates",styles);
};

/*----------------------------------------------------------------*/
/*functions for working with paragraph*/
/*setters*/
// Right = 0; Left = 1; Center = 2; Justify = 3; or using enum that written above

/* структура для параграфа
	Ind :
   	{
       	Left      : 0,                    // Левый отступ
       	Right     : 0,                    // Правый отступ
     	FirstLine : 0                     // Первая строка
   	}
   	Spacing :
   	{
       	Line     : 1.15,                  // Расстояние между строками внутри абзаца
       	LineRule : linerule_Auto,         // Тип расстрояния между строками
       	Before   : 0,                     // Дополнительное расстояние до абзаца
       	After    : 10 * g_dKoef_pt_to_mm  // Дополнительное расстояние после абзаца
   	},
   	KeepLines : false,                    // переносить параграф на новую страницу,
                                         // если на текущей он целиком не убирается
   	PageBreakBefore : false
*/

asc_docs_api.prototype.paraApply = function(Props)
{
        var _presentation = editor.WordControl.m_oLogicDocument;
        if(_presentation.Slides[_presentation.CurPage])
        {
            var graphicObjects = _presentation.Slides[_presentation.CurPage].graphicObjects;
            graphicObjects.checkSelectedObjectsAndCallback(function(){

                if ( "undefined" != typeof(Props.Ind) && null != Props.Ind )
                    graphicObjects.setParagraphIndent( Props.Ind );

                if ( "undefined" != typeof(Props.Jc) && null != Props.Jc )
                    graphicObjects.setParagraphAlign( Props.Jc );


                if ( "undefined" != typeof(Props.Spacing) && null != Props.Spacing )
                    graphicObjects.setParagraphSpacing( Props.Spacing );


                if ( undefined != Props.Tabs )
                {
                    var Tabs = new CParaTabs();
                    Tabs.Set_FromObject( Props.Tabs.Tabs );
                    graphicObjects.setParagraphTabs( Tabs );
                }

                if ( undefined != Props.DefaultTab )
                {
                    _presentation.Set_DocumentDefaultTab( Props.DefaultTab );
                }
                var TextPr = new CTextPr();

                if ( true === Props.Subscript )
                    TextPr.VertAlign = AscCommon.vertalign_SubScript;
                else if ( true === Props.Superscript )
                    TextPr.VertAlign = AscCommon.vertalign_SuperScript;
                else if ( false === Props.Superscript || false === Props.Subscript )
                    TextPr.VertAlign = AscCommon.vertalign_Baseline;

                if ( undefined != Props.Strikeout )
                {
                    TextPr.Strikeout  = Props.Strikeout;
                    TextPr.DStrikeout = false;
                }

                if ( undefined != Props.DStrikeout )
                {
                    TextPr.DStrikeout = Props.DStrikeout;
                    if ( true === TextPr.DStrikeout )
                        TextPr.Strikeout = false;
                }

                if ( undefined != Props.SmallCaps )
                {
                    TextPr.SmallCaps = Props.SmallCaps;
                    TextPr.AllCaps   = false;
                }

                if ( undefined != Props.AllCaps )
                {
                    TextPr.Caps = Props.AllCaps;
                    if ( true === TextPr.AllCaps )
                        TextPr.SmallCaps = false;
                }

                if ( undefined != Props.TextSpacing )
                    TextPr.Spacing = Props.TextSpacing;

                if ( undefined != Props.Position )
                    TextPr.Position = Props.Position;
                graphicObjects.paragraphAdd( new ParaTextPr(TextPr) );
                _presentation.Recalculate();
                _presentation.Document_UpdateInterfaceState();
            }, [], false, AscDFH.historydescription_Presentation_ParaApply);
        }
};

asc_docs_api.prototype.put_PrAlign = function(value)
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_PutTextPrAlign);
	this.WordControl.m_oLogicDocument.Set_ParagraphAlign(value);
};
// 0- baseline, 2-subscript, 1-superscript
asc_docs_api.prototype.put_TextPrBaseline = function(value)
{
    if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
        History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
        this.WordControl.m_oLogicDocument.Paragraph_Add(new ParaTextPr({VertAlign: value}));
    }
};
/* 	Маркированный список Type = 0
		нет         - SubType = -1
		черная точка - SubType = 1
		круг         - SubType = 2
		квадрат      - SubType = 3
		картинка     - SubType = -1
		4 ромба      - SubType = 4
		ч/б стрелка  - SubType = 5
		галка        - SubType = 6
	
	Нумерованный список Type = 1
		нет - SubType = -1
		1.  - SubType = 1
		1)  - SubType = 2
		I.  - SubType = 3
		A.  - SubType = 4
		a)  - SubType = 5
		a.  - SubType = 6
		i.  - SubType = 7
	
	Многоуровневый список Type = 2
		нет            - SubType = -1
		1)a)i)        - SubType = 1
		1.1.1         - SubType = 2
		маркированный - SubType = 3 
*/
asc_docs_api.prototype.put_ListType = function(type, subtype)
{
	var NumberInfo =
	{
		Type    : 0,
		SubType : -1
	};

	NumberInfo.Type = type;
	NumberInfo.SubType = subtype;
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_PutTextPrListType);
	this.WordControl.m_oLogicDocument.Set_ParagraphNumbering( NumberInfo );
};

asc_docs_api.prototype.put_ShowSnapLines = function(isShow)
{
    this.ShowSnapLines = isShow;
};
asc_docs_api.prototype.get_ShowSnapLines = function()
{
    return this.ShowSnapLines;
};

asc_docs_api.prototype.put_ShowParaMarks = function(isShow){
	this.ShowParaMarks = isShow;
	this.WordControl.OnRePaintAttack();
	return this.ShowParaMarks;
};
asc_docs_api.prototype.get_ShowParaMarks = function(){
    return this.ShowParaMarks;
};
asc_docs_api.prototype.put_ShowTableEmptyLine = function(isShow)
{
    this.isShowTableEmptyLine = isShow;
    this.WordControl.OnRePaintAttack();

    return this.isShowTableEmptyLine;
};
asc_docs_api.prototype.get_ShowTableEmptyLine = function(){
    return this.isShowTableEmptyLine;
};

asc_docs_api.prototype.ShapeApply = function(prop)
{
    // нужно определить, картинка это или нет
    var image_url = "";
    prop.Width = prop.w;
    prop.Height = prop.h;

    var bShapeTexture = true;
    if (prop.fill != null)
    {
        if (prop.fill.fill != null && prop.fill.type == c_oAscFill.FILL_TYPE_BLIP)
        {
            image_url = prop.fill.fill.asc_getUrl();

            var _tx_id = prop.fill.fill.asc_getTextureId();
            if (null != _tx_id && 0 <= _tx_id && _tx_id < g_oUserTexturePresets.length)
            {
                image_url = g_oUserTexturePresets[_tx_id];
            }
        }
    }
    var oFill;
    if(prop.textArtProperties)
    {
        oFill = prop.textArtProperties.asc_getFill();
        if (oFill && oFill.fill != null && oFill.type == c_oAscFill.FILL_TYPE_BLIP)
        {
            image_url = oFill.fill.asc_getUrl();

            var _tx_id = oFill.fill.asc_getTextureId();
            if (null != _tx_id && 0 <= _tx_id && _tx_id < g_oUserTexturePresets.length)
            {
                image_url = g_oUserTexturePresets[_tx_id];
            }
            bShapeTexture = false;
        }
    }
    if (!AscCommon.isNullOrEmptyString(image_url)){
        var sImageUrl = null;
        if(!g_oDocumentUrls.getImageLocal(image_url)){
          sImageUrl = image_url;
        }
      var oApi = this;
        var fApplyCallback = function(){
          var _image = oApi.ImageLoader.LoadImage(image_url, 1);
          var srcLocal = g_oDocumentUrls.getImageLocal(image_url);
          if (srcLocal) {
            image_url = srcLocal;
          }
          if(bShapeTexture)
          {
            prop.fill.fill.asc_putUrl(image_url); // erase documentUrl
          }
          else
          {
            oFill.fill.asc_putUrl(image_url);
          }
          if (null != _image)
          {
            oApi.WordControl.m_oLogicDocument.ShapeApply(prop);
            if(bShapeTexture)
            {
              oApi.WordControl.m_oDrawingDocument.DrawImageTextureFillShape(image_url);
            }
            else
            {
              oApi.WordControl.m_oDrawingDocument.DrawImageTextureFillTextArt(image_url);
            }
          }
          else
          {
            oApi.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);
            var oProp = prop;
            oApi.asyncImageEndLoaded2 = function(_image)
            {
              oApi.WordControl.m_oLogicDocument.ShapeApply(oProp);
              oApi.WordControl.m_oDrawingDocument.DrawImageTextureFillShape(image_url);
              oApi.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);
              oApi.asyncImageEndLoaded2 = null;
            }
          }
        };
        if(!sImageUrl){
          fApplyCallback();
        }
        else{

          if (window["AscDesktopEditor"])
          {
              image_url = window["AscDesktopEditor"]["LocalFileGetImageUrl"](sImageUrl);
			  image_url = g_oDocumentUrls.getImageUrl(image_url);
              fApplyCallback();
              return;
          }

          this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
          this.fCurCallback = function(input) {
            if(null != input && "imgurl" == input["type"]){
              if("ok" ==input["status"]) {
                var data = input["data"];
                var urls = {};
                var firstUrl;
                for(var i = 0; i < data.length; ++i){
                  var elem = data[i];
                  if(elem.url){
                    if(!firstUrl){
                      firstUrl = elem.url;
                    }
                    urls[elem.path] = elem.url;
                  }
                }
                g_oDocumentUrls.addUrls(urls);
                if(firstUrl) {
                  image_url = firstUrl;
                  fApplyCallback();
                } else {
                  oApi.asc_fireCallback("asc_onError",c_oAscError.ID.Unknown,c_oAscError.Level.NoCritical);
                }
              } else {
                oApi.asc_fireCallback("asc_onError", mapAscServerErrorToAscError(parseInt(input["data"])), c_oAscError.Level.NoCritical);
              }
            } else {
              oApi.asc_fireCallback("asc_onError",c_oAscError.ID.Unknown,c_oAscError.Level.NoCritical);
            }
            oApi.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
          };
          var rData = {
            "id":this.documentId,
            "userid": this.documentUserId,
            "vkey": this.documentVKey,
            "c":"imgurl",
            "saveindex": g_oDocumentUrls.getMaxIndex(),
            "data": sImageUrl};
          sendCommand(this, null, rData );
        }
    }
    else
    {
        if(!this.noCreatePoint || this.exucuteHistory)
        {
            if(!this.noCreatePoint && !this.exucuteHistory && this.exucuteHistoryEnd)
            {
                if(-1 !== this.nCurPointItemsLength)
                {
                    History.UndoLastPoint();
                    var slide = this.WordControl.m_oLogicDocument.Slides[this.WordControl.m_oLogicDocument.CurPage];
                    slide.graphicObjects.applyDrawingProps(prop);
                    this.WordControl.m_oLogicDocument.Recalculate();
                    this.WordControl.m_oDrawingDocument.OnRecalculatePage(this.WordControl.m_oLogicDocument.CurPage, slide);
                    this.WordControl.m_oDrawingDocument.OnEndRecalculate();
                }
                else
                {
                    this.WordControl.m_oLogicDocument.ShapeApply(prop);
                }
                this.exucuteHistoryEnd = false;
                this.nCurPointItemsLength = -1;
            }
            else
            {
                this.WordControl.m_oLogicDocument.ShapeApply(prop);
            }
            if(this.exucuteHistory)
            {
                var oPoint = History.Points[History.Index];
                if(oPoint)
                {
                    this.nCurPointItemsLength = oPoint.Items.length;
                }
                else
                {
                    this.nCurPointItemsLength = -1;
                }
                this.exucuteHistory = false;
            }
        }
        else
        {
            if(this.WordControl.m_oLogicDocument.Slides[this.WordControl.m_oLogicDocument.CurPage])
            {
                if(-1 !== this.nCurPointItemsLength)
                {
                    History.UndoLastPoint();
                    var slide = this.WordControl.m_oLogicDocument.Slides[this.WordControl.m_oLogicDocument.CurPage];
                    slide.graphicObjects.applyDrawingProps(prop);
                    this.WordControl.m_oLogicDocument.Recalculate();
                    this.WordControl.m_oDrawingDocument.OnRecalculatePage(this.WordControl.m_oLogicDocument.CurPage, slide);
                    this.WordControl.m_oDrawingDocument.OnEndRecalculate();
                }
                else
                {
                    this.WordControl.m_oLogicDocument.ShapeApply(prop);
                    var oPoint = History.Points[History.Index];
                    if(oPoint)
                    {
                        this.nCurPointItemsLength = oPoint.Items.length;
                    }
                    else
                    {
                        this.nCurPointItemsLength = -1;
                    }
                }
            }
        }
    }
};

asc_docs_api.prototype.setStartPointHistory = function(){
    this.noCreatePoint = true;
    this.exucuteHistory = true;
    this.incrementCounterLongAction();
};
asc_docs_api.prototype.setEndPointHistory   = function(){
    this.noCreatePoint = false;
    this.exucuteHistoryEnd = true;
    this.decrementCounterLongAction();
};
asc_docs_api.prototype.SetSlideProps = function(prop)
{
    if (null == prop)
        return;

    var arr_ind = this.WordControl.Thumbnails.GetSelectedArray();
    var _back_fill = prop.get_background();

    if (_back_fill)
    {
        if (_back_fill.asc_getType() == c_oAscFill.FILL_TYPE_NOFILL)
        {
            var bg = new AscFormat.CBg();
            bg.bgPr = new AscFormat.CBgPr();
            bg.bgPr.Fill = AscFormat.CorrectUniFill(_back_fill, null);

            this.WordControl.m_oLogicDocument.changeBackground(bg, arr_ind);
            return;
        }

        var _old_fill = this.WordControl.m_oLogicDocument.Slides[this.WordControl.m_oLogicDocument.CurPage].backgroundFill;
        if (AscCommon.isRealObject(_old_fill))
            _old_fill = _old_fill.createDuplicate();
        var bg = new AscFormat.CBg();
        bg.bgPr = new AscFormat.CBgPr();
        bg.bgPr.Fill = AscFormat.CorrectUniFill(_back_fill, _old_fill);
        var image_url = "";
        if (_back_fill.asc_getType() == c_oAscFill.FILL_TYPE_BLIP && _back_fill.fill && typeof _back_fill.fill.url === "string" && _back_fill.fill.url.length > 0)
        {
            image_url = _back_fill.fill.url;
        }
        if (image_url != "")
        {
            var _image = this.ImageLoader.LoadImage(image_url, 1);
            var srcLocal = g_oDocumentUrls.getImageLocal(image_url);
            if (srcLocal) {
                image_url = srcLocal;
                bg.bgPr.Fill.fill.RasterImageId = image_url; // erase documentUrl
            }

            if (null != _image)
            {
                if (bg.bgPr.Fill != null && bg.bgPr.Fill.fill != null && bg.bgPr.Fill.fill.type == c_oAscFill.FILL_TYPE_BLIP)
                {
                    this.WordControl.m_oDrawingDocument.DrawImageTextureFillSlide(bg.bgPr.Fill.fill.RasterImageId);
                }

                this.WordControl.m_oLogicDocument.changeBackground(bg, arr_ind);
            }
            else
            {
                this.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);

                var oProp = prop;
                this.asyncImageEndLoaded2 = function(_image)
                {
                    if (bg.bgPr.Fill != null && bg.bgPr.Fill.fill != null && bg.bgPr.Fill.fill.type == c_oAscFill.FILL_TYPE_BLIP)
                    {
                        this.WordControl.m_oDrawingDocument.DrawImageTextureFillSlide(bg.bgPr.Fill.fill.RasterImageId);
                    }

                    this.WordControl.m_oLogicDocument.changeBackground(bg, arr_ind);
                    this.asyncImageEndLoaded2 = null;

                    this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);
                }
            }
        }
        else
        {
            if (bg.bgPr.Fill != null && bg.bgPr.Fill.fill != null && bg.bgPr.Fill.fill.type == c_oAscFill.FILL_TYPE_BLIP)
            {
                this.WordControl.m_oDrawingDocument.DrawImageTextureFillSlide(bg.bgPr.Fill.fill.RasterImageId);
            }

            if(!this.noCreatePoint || this.exucuteHistory)
            {
                if( !this.noCreatePoint && !this.exucuteHistory && this.exucuteHistoryEnd)
                {
                    this.WordControl.m_oLogicDocument.changeBackground(bg, arr_ind, true);
                    this.exucuteHistoryEnd = false;
                }
                else
                {
                    this.WordControl.m_oLogicDocument.changeBackground(bg, arr_ind);
                }
                if(this.exucuteHistory)
                {
                    this.exucuteHistory = false;
                }
            }
            else
            {
                if(this.WordControl.m_oLogicDocument.Slides[this.WordControl.m_oLogicDocument.CurPage])
                {
                    AscFormat.ExecuteNoHistory(function(){

                        this.WordControl.m_oLogicDocument.changeBackground(bg, arr_ind, true);
                        for(var i = 0; i <arr_ind.length; ++i)
                        {
                            this.WordControl.m_oLogicDocument.Slides[arr_ind[i]].recalculateBackground()
                        }
                        for(i = 0; i <arr_ind.length; ++i)
                        {
                            this.WordControl.m_oLogicDocument.DrawingDocument.OnRecalculatePage(arr_ind[i], this.WordControl.m_oLogicDocument.Slides[arr_ind[i]]);
                        }
                        this.WordControl.m_oLogicDocument.DrawingDocument.OnEndRecalculate(true, false);
                    }, this, []);
                }
            }


        }
    }

    var _timing = prop.get_timing();
    if (_timing)
    {
        this.ApplySlideTiming(_timing);
    }
};

asc_docs_api.prototype.put_LineCap = function(_cap)
{
    this.WordControl.m_oLogicDocument.putLineCap(_cap);
};
asc_docs_api.prototype.put_LineJoin = function(_join)
{
    this.WordControl.m_oLogicDocument.putLineJoin(_join);
};

asc_docs_api.prototype.put_LineBeginStyle = function(_style)
{
    this.WordControl.m_oLogicDocument.putLineBeginStyle(_style);
};
asc_docs_api.prototype.put_LineBeginSize = function(_size)
{
    this.WordControl.m_oLogicDocument.putLineBeginSize(_size);
};

asc_docs_api.prototype.put_LineEndStyle = function(_style)
{
    this.WordControl.m_oLogicDocument.putLineEndStyle(_style);
};
asc_docs_api.prototype.put_LineEndSize = function(_size)
{
    this.WordControl.m_oLogicDocument.putLineEndSize(_size);
};

asc_docs_api.prototype.put_TextColor2 = function(r, g, b)
{
    if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
        History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
        this.WordControl.m_oLogicDocument.Paragraph_Add(new ParaTextPr({Color: {r: r, g: g, b: b}}));
    }
};
asc_docs_api.prototype.put_TextColor = function(color)
{
    if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
        History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
        var _unifill = new AscFormat.CUniFill();
        _unifill.fill = new AscFormat.CSolidFill();
        _unifill.fill.color = AscFormat.CorrectUniColor(color, _unifill.fill.color, 0);
        this.WordControl.m_oLogicDocument.Paragraph_Add(new ParaTextPr({Unifill: _unifill}));
    }
};

asc_docs_api.prototype.put_PrIndent = function(value,levelValue)
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_PutPrIndent);
	this.WordControl.m_oLogicDocument.Set_ParagraphIndent( { Left : value, ChangeLevel: levelValue } );
};
asc_docs_api.prototype.IncreaseIndent = function()
{
	this.WordControl.m_oLogicDocument.Paragraph_IncDecIndent( true );
};
asc_docs_api.prototype.DecreaseIndent = function()
{
    this.WordControl.m_oLogicDocument.Paragraph_IncDecIndent( false );
};
asc_docs_api.prototype.put_PrIndentRight = function(value)
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_PutPrIndentRight);
	this.WordControl.m_oLogicDocument.Set_ParagraphIndent( { Right : value } );
};
asc_docs_api.prototype.put_PrFirstLineIndent = function(value)
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_PutPrFirstLineIndent);
	this.WordControl.m_oLogicDocument.Set_ParagraphIndent( { FirstLine : value } );
};
asc_docs_api.prototype.getFocusObject = function(){//возвратит тип элемента - параграф c_oAscTypeSelectElement.Paragraph, изображение c_oAscTypeSelectElement.Image, таблица c_oAscTypeSelectElement.Table, колонтитул c_oAscTypeSelectElement.Header.

};

/*callbacks*/
asc_docs_api.prototype.sync_VerticalAlign = function(typeBaseline){
	this.asc_fireCallback("asc_onVerticalAlign",typeBaseline);
};
asc_docs_api.prototype.sync_PrAlignCallBack = function(value){
	this.asc_fireCallback("asc_onPrAlign",value);
};
asc_docs_api.prototype.sync_ListType = function(NumPr){
	this.asc_fireCallback("asc_onListType", new AscCommon.asc_CListType( NumPr ) );
};
asc_docs_api.prototype.sync_TextColor = function(Color){
	this.asc_fireCallback("asc_onTextColor", new AscCommon.CColor( Color.r, Color.g, Color.b ));
}
asc_docs_api.prototype.sync_TextColor2 = function(unifill)
{
    var _color;
    if (unifill.fill == null)
        return;
    else if (unifill.fill.type == c_oAscFill.FILL_TYPE_SOLID)
    {
        _color = unifill.getRGBAColor();
        var color = AscCommon.CreateAscColor(unifill.fill.color);
        color.asc_putR(_color.R);
        color.asc_putG(_color.G);
        color.asc_putB(_color.B);
        this.asc_fireCallback("asc_onTextColor", color);
    }
    else if (unifill.fill.type == c_oAscFill.FILL_TYPE_GRAD)
    {
        _color = unifill.getRGBAColor();
        var color = AscCommon.CreateAscColor(unifill.fill.colors[0].color);
        color.asc_putR(_color.R);
        color.asc_putG(_color.G);
        color.asc_putB(_color.B);
        this.asc_fireCallback("asc_onTextColor", color);
    }
    else
    {
        _color = unifill.getRGBAColor();
        var color = new Asc.asc_CColor();
        color.asc_putR(_color.R);
        color.asc_putG(_color.G);
        color.asc_putB(_color.B);
        this.asc_fireCallback("asc_onTextColor", color);
    }
}
asc_docs_api.prototype.sync_TextHighLight = function(HighLight){
	this.asc_fireCallback("asc_onTextHighLight", new AscCommon.CColor( HighLight.r, HighLight.g, HighLight.b ) );
}
asc_docs_api.prototype.sync_ParaStyleName = function(Name){
	this.asc_fireCallback("asc_onParaStyleName",Name);
}
asc_docs_api.prototype.sync_ParaSpacingLine = function(SpacingLine){
	this.asc_fireCallback("asc_onParaSpacingLine", new AscCommon.asc_CParagraphSpacing ( SpacingLine ));
}
asc_docs_api.prototype.sync_PageBreakCallback = function(isBreak){
	this.asc_fireCallback("asc_onPageBreak",isBreak);
}
asc_docs_api.prototype.sync_KeepLinesCallback = function(isKeepLines){
	this.asc_fireCallback("asc_onKeepLines",isKeepLines);
}
asc_docs_api.prototype.sync_ShowParaMarksCallback = function(){
	this.asc_fireCallback("asc_onShowParaMarks");
}
asc_docs_api.prototype.sync_SpaceBetweenPrgCallback = function(){
	this.asc_fireCallback("asc_onSpaceBetweenPrg");
}
asc_docs_api.prototype.sync_PrPropCallback = function(prProp){
    var _len = this.SelectedObjectsStack.length;
    if (_len > 0)
    {
        if (this.SelectedObjectsStack[_len - 1].Type == c_oAscTypeSelectElement.Paragraph)
        {
            this.SelectedObjectsStack[_len - 1].Value = new Asc.asc_CParagraphProperty( prProp );
            return;
        }
    }

    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject( c_oAscTypeSelectElement.Paragraph, new Asc.asc_CParagraphProperty( prProp ) );
}

asc_docs_api.prototype.SetDrawImagePlaceParagraph = function(element_id, props)
{
    this.WordControl.m_oDrawingDocument.InitGuiCanvasTextProps(element_id);
    this.WordControl.m_oDrawingDocument.DrawGuiCanvasTextProps(props);
};

/*----------------------------------------------------------------*/

asc_docs_api.prototype.get_DocumentOrientation = function()
{
	return this.DocumentOrientation;
};

asc_docs_api.prototype.Update_ParaInd = function( Ind ){
	var FirstLine = 0;
	var Left = 0;
	var Right = 0;
	if ( "undefined" != typeof(Ind) )
	{
		if("undefined" != typeof(Ind.FirstLine))
		{
			FirstLine = Ind.FirstLine;
		}
		if("undefined" != typeof(Ind.Left))
		{
			Left = Ind.Left;
		}
		if("undefined" != typeof(Ind.Right))
		{
			Right = Ind.Right;
		}
	}

	this.Internal_Update_Ind_Left(Left);
	this.Internal_Update_Ind_FirstLine(FirstLine,Left);
	this.Internal_Update_Ind_Right(Right);
};
asc_docs_api.prototype.Internal_Update_Ind_FirstLine = function(FirstLine,Left){
	if (this.WordControl.m_oHorRuler.m_dIndentLeftFirst != (FirstLine + Left))
    {
        this.WordControl.m_oHorRuler.m_dIndentLeftFirst = (FirstLine + Left);
	    this.WordControl.UpdateHorRuler();
    }
};
asc_docs_api.prototype.Internal_Update_Ind_Left = function(Left){
    if (this.WordControl.m_oHorRuler.m_dIndentLeft != Left)
    {
        this.WordControl.m_oHorRuler.m_dIndentLeft = Left;
        this.WordControl.UpdateHorRuler();
    }
};
asc_docs_api.prototype.Internal_Update_Ind_Right = function(Right){
    if (this.WordControl.m_oHorRuler.m_dIndentRight != Right)
    {
        this.WordControl.m_oHorRuler.m_dIndentRight = Right;
        this.WordControl.UpdateHorRuler();
    }
};


asc_docs_api.prototype.sync_DocSizeCallback = function(width,height){
	this.asc_fireCallback("asc_onDocSize",width,height);
};
asc_docs_api.prototype.sync_PageOrientCallback = function(isPortrait){
	this.asc_fireCallback("asc_onPageOrient",isPortrait);
};
asc_docs_api.prototype.sync_HeadersAndFootersPropCallback = function(hafProp){
    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject( c_oAscTypeSelectElement.Header, new CHeaderProp( hafProp ) );
};

/*----------------------------------------------------------------*/
/*functions for working with table*/
asc_docs_api.prototype.put_Table = function(col,row)
{
    this.WordControl.m_oLogicDocument.Add_FlowTable(col,row);
};
asc_docs_api.prototype.addRowAbove = function(count)
{
    var doc = this.WordControl.m_oLogicDocument;
    if(doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_AddRowAbove);
        this.WordControl.m_oLogicDocument.Table_AddRow(true);
    }
};
asc_docs_api.prototype.addRowBelow = function(count)
{
    var doc = this.WordControl.m_oLogicDocument;
    if(doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_AddRowBelow);
        this.WordControl.m_oLogicDocument.Table_AddRow(false);
    }
};
asc_docs_api.prototype.addColumnLeft = function(count)
{
    var doc = this.WordControl.m_oLogicDocument;
    if(doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_AddColLeft);
        this.WordControl.m_oLogicDocument.Table_AddCol(true);
    }
};
asc_docs_api.prototype.addColumnRight = function(count)
{
    var doc = this.WordControl.m_oLogicDocument;
    if(doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_AddColRight);
        this.WordControl.m_oLogicDocument.Table_AddCol(false);
    }
};
asc_docs_api.prototype.remRow = function()
{
    var doc = this.WordControl.m_oLogicDocument;
    if(doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_RemoveRow);
        this.WordControl.m_oLogicDocument.Table_RemoveRow();
    }
};
asc_docs_api.prototype.remColumn = function()
{
    var doc = this.WordControl.m_oLogicDocument;
    if(doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_RemoveCol);
        this.WordControl.m_oLogicDocument.Table_RemoveCol();
    }
};
asc_docs_api.prototype.remTable = function()
{
    var doc = this.WordControl.m_oLogicDocument;
    if(doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_RemoveTable);
        this.WordControl.m_oLogicDocument.Table_RemoveTable();
    }
};
asc_docs_api.prototype.selectRow = function()
{
    this.WordControl.m_oLogicDocument.Table_Select( c_oAscTableSelectionType.Row );
};
asc_docs_api.prototype.selectColumn = function()
{
    this.WordControl.m_oLogicDocument.Table_Select( c_oAscTableSelectionType.Column );
};
asc_docs_api.prototype.selectCell = function()
{
    this.WordControl.m_oLogicDocument.Table_Select( c_oAscTableSelectionType.Cell );
};
asc_docs_api.prototype.selectTable = function()
{
    this.WordControl.m_oLogicDocument.Table_Select( c_oAscTableSelectionType.Table );
};
asc_docs_api.prototype.setColumnWidth = function(width){

};
asc_docs_api.prototype.setRowHeight = function(height){

};
asc_docs_api.prototype.set_TblDistanceFromText = function(left,top,right,bottom){
	
};
asc_docs_api.prototype.CheckBeforeMergeCells = function()
{
    return this.WordControl.m_oLogicDocument.Table_CheckMerge();
};
asc_docs_api.prototype.CheckBeforeSplitCells = function()
{
    return this.WordControl.m_oLogicDocument.Table_CheckSplit();
};
asc_docs_api.prototype.MergeCells = function()
{
    var doc = this.WordControl.m_oLogicDocument;
    if(doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_MergeCells);
        this.WordControl.m_oLogicDocument.Table_MergeCells();
    }
};
asc_docs_api.prototype.SplitCell = function(Cols, Rows)
{
    var doc = this.WordControl.m_oLogicDocument;
    if(doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_SplitCells);
        this.WordControl.m_oLogicDocument.Table_SplitCell(Cols, Rows);
    }
};
asc_docs_api.prototype.widthTable = function(width){

};
asc_docs_api.prototype.put_CellsMargin = function(left,top,right,bottom){
	
};
asc_docs_api.prototype.set_TblWrap = function(type){

};
asc_docs_api.prototype.set_TblIndentLeft = function(spacing){

};
asc_docs_api.prototype.set_Borders = function(typeBorders,size,Color){//если size == 0 то границы нет.

};
asc_docs_api.prototype.set_TableBackground = function(Color)
{

};
asc_docs_api.prototype.set_AlignCell = function(align){// c_oAscAlignType.RIGHT, c_oAscAlignType.LEFT, c_oAscAlignType.CENTER
	switch(align)
	{
		case c_oAscAlignType.LEFT : break;
		case c_oAscAlignType.CENTER : break;
		case c_oAscAlignType.RIGHT : break;
	}
};
asc_docs_api.prototype.set_TblAlign = function(align){// c_oAscAlignType.RIGHT, c_oAscAlignType.LEFT, c_oAscAlignType.CENTER
	switch(align)
	{
		case c_oAscAlignType.LEFT : break;
		case c_oAscAlignType.CENTER : break;
		case c_oAscAlignType.RIGHT : break;
	}
};
asc_docs_api.prototype.set_SpacingBetweenCells = function(isOn,spacing){// c_oAscAlignType.RIGHT, c_oAscAlignType.LEFT, c_oAscAlignType.CENTER
	if(isOn){
	
	}
};


/*
	{
	    TableWidth   : null - галочка убрана, либо заданное значение в мм
	    TableSpacing : null - галочка убрана, либо заданное значение в мм

	    TableDefaultMargins :  // маргины для всей таблицы(значение по умолчанию)
	    {
	        Left   : 1.9,
	        Right  : 1.9,
	        Top    : 0,
	        Bottom : 0
	    }

	    CellMargins :
        {
            Left   : 1.9, (null - неопределенное значение)
            Right  : 1.9, (null - неопределенное значение)
            Top    : 0,   (null - неопределенное значение)
            Bottom : 0,   (null - неопределенное значение)
            Flag   : 0 - У всех выделенных ячеек значение берется из TableDefaultMargins
                     1 - У выделенных ячеек есть ячейки с дефолтовыми значениями, и есть со своими собственными
                     2 - У всех ячеек свои собственные значения
        }

        TableAlignment : 0, 1, 2 (слева, по центру, справа)
        TableIndent : значение в мм,
        TableWrappingStyle : 0, 1 (inline, flow)
        TablePaddings:
        {
             Left   : 3.2,
             Right  : 3.2,
             Top    : 0,
             Bottom : 0
        }

        TableBorders : // границы таблицы
        {
            Bottom :
            {
                Color : { r : 0, g : 0, b : 0 },
                Value : border_Single,
                Size  : 0.5 * g_dKoef_pt_to_mm
				Space :
            },

            Left :
            {
                Color : { r : 0, g : 0, b : 0 },
                Value : border_Single,
                Size  : 0.5 * g_dKoef_pt_to_mm
				Space :
            },

            Right :
            {
                Color : { r : 0, g : 0, b : 0 },
                Value : border_Single,
                Size  : 0.5 * g_dKoef_pt_to_mm
				Space :
            },

            Top :
            {
                Color : { r : 0, g : 0, b : 0 },
                Value : border_Single,
                Size  : 0.5 * g_dKoef_pt_to_mm
				Space :
            },

            InsideH :
            {
                Color : { r : 0, g : 0, b : 0 },
                Value : border_Single,
                Size  : 0.5 * g_dKoef_pt_to_mm
				Space :
            },

            InsideV :
            {
                Color : { r : 0, g : 0, b : 0 },
                Value : border_Single,
                Size  : 0.5 * g_dKoef_pt_to_mm
				Space :
            }
        }

        CellBorders : // границы выделенных ячеек
        {
			ForSelectedCells : true,
			
            Bottom :
            {
                Color : { r : 0, g : 0, b : 0 },
                Value : border_Single,
                Size  : 0.5 * g_dKoef_pt_to_mm
				Space :
            },

            Left :
            {
                Color : { r : 0, g : 0, b : 0 },
                Value : border_Single,
                Size  : 0.5 * g_dKoef_pt_to_mm
				Space :
            },

            Right :
            {
                Color : { r : 0, g : 0, b : 0 },
                Value : border_Single,
                Size  : 0.5 * g_dKoef_pt_to_mm
				Space :
            },

            Top :
            {
                Color : { r : 0, g : 0, b : 0 },
                Value : border_Single,
                Size  : 0.5 * g_dKoef_pt_to_mm
				Space :
            },

            InsideH : // данного элемента может не быть, если у выделенных ячеек
                      // нет горизонтальных внутренних границ
            {
                Color : { r : 0, g : 0, b : 0 },
                 Value : border_Single,
                Size  : 0.5 * g_dKoef_pt_to_mm
				Space :
            },

            InsideV : // данного элемента может не быть, если у выделенных ячеек
                      // нет вертикальных внутренних границ
            {
                Color : { r : 0, g : 0, b : 0 },
                Value : border_Single,
                Size  : 0.5 * g_dKoef_pt_to_mm
				Space :
            }
        }

        TableBackground :
        {
            Value : тип заливки(прозрачная или нет),
            Color : { r : 0, g : 0, b : 0 }
        }
        CellsBackground : null если заливка не определена для выделенных ячеек
        {
            Value : тип заливки(прозрачная или нет),
            Color : { r : 0, g : 0, b : 0 }
        }
        
		Position:
		{
			X:0,
			Y:0
		}
	}
*/
asc_docs_api.prototype.tblApply = function(obj)
{
    var doc = this.WordControl.m_oLogicDocument;
    if(doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_TblApply);
        if(obj.CellBorders)
        {
            if(obj.CellBorders.Left && obj.CellBorders.Left.Color)
            {
                obj.CellBorders.Left.Unifill = AscFormat.CreateUnifillFromAscColor(obj.CellBorders.Left.Color);
            }
            if(obj.CellBorders.Top && obj.CellBorders.Top.Color)
            {
                obj.CellBorders.Top.Unifill = AscFormat.CreateUnifillFromAscColor(obj.CellBorders.Top.Color);
            }
            if(obj.CellBorders.Right && obj.CellBorders.Right.Color)
            {
                obj.CellBorders.Right.Unifill = AscFormat.CreateUnifillFromAscColor(obj.CellBorders.Right.Color);
            }
            if(obj.CellBorders.Bottom && obj.CellBorders.Bottom.Color)
            {
                obj.CellBorders.Bottom.Unifill = AscFormat.CreateUnifillFromAscColor(obj.CellBorders.Bottom.Color);
            }
            if(obj.CellBorders.InsideH && obj.CellBorders.InsideH.Color)
            {
                obj.CellBorders.InsideH.Unifill = AscFormat.CreateUnifillFromAscColor(obj.CellBorders.InsideH.Color);
            }
            if(obj.CellBorders.InsideV && obj.CellBorders.InsideV.Color)
            {
                obj.CellBorders.InsideV.Unifill = AscFormat.CreateUnifillFromAscColor(obj.CellBorders.InsideV.Color);
            }
        }
        if(obj.CellsBackground && obj.CellsBackground.Color)
        {
            obj.CellsBackground.Unifill = AscFormat.CreateUnifillFromAscColor(obj.CellsBackground.Color);
        }
        this.WordControl.m_oLogicDocument.Set_TableProps(obj);
    }
};
/*callbacks*/
asc_docs_api.prototype.sync_AddTableCallback = function(){
	this.asc_fireCallback("asc_onAddTable");
};
asc_docs_api.prototype.sync_AlignCellCallback = function(align){
	this.asc_fireCallback("asc_onAlignCell",align);
};
asc_docs_api.prototype.sync_TblPropCallback = function(tblProp){
    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject( c_oAscTypeSelectElement.Table, new CTableProp( tblProp ));
};
asc_docs_api.prototype.sync_TblWrapStyleChangedCallback = function(style){
	this.asc_fireCallback("asc_onTblWrapStyleChanged",style);
};
asc_docs_api.prototype.sync_TblAlignChangedCallback = function(style){
	this.asc_fireCallback("asc_onTblAlignChanged",style);
};

/*----------------------------------------------------------------*/
/*functions for working with images*/
asc_docs_api.prototype.ChangeImageFromFile = function()
{
    this.isImageChangeUrl = true;
    this.asc_addImage();
};
asc_docs_api.prototype.ChangeShapeImageFromFile = function()
{
    this.isShapeImageChangeUrl = true;
    this.asc_addImage();
};
asc_docs_api.prototype.ChangeSlideImageFromFile = function()
{
    this.isSlideImageChangeUrl = true;
    this.asc_addImage();
};
asc_docs_api.prototype.ChangeArtImageFromFile = function()
{
    this.isTextArtChangeUrl = true;
    this.asc_addImage();
};

asc_docs_api.prototype.AddImage = function(){
  this.asc_addImage();
};
asc_docs_api.prototype.StartAddShape = function(prst, is_apply)
{
    this.WordControl.m_oLogicDocument.StartAddShape(prst, is_apply);

    if (is_apply)
    {
        this.WordControl.m_oDrawingDocument.LockCursorType("crosshair");
    }
};

asc_docs_api.prototype.AddTextArt = function(nStyle)
{
    if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
        this.WordControl.m_oLogicDocument.Add_TextArt(nStyle);
    }
};


asc_docs_api.prototype.canGroup = function()
{
    return this.WordControl.m_oLogicDocument.canGroup();
};

asc_docs_api.prototype.canUnGroup = function()
{
    return this.WordControl.m_oLogicDocument.canUnGroup();
};

asc_docs_api.prototype._addImageUrl = function(url) {
  // ToDo пока временная функция для стыковки.
  this.AddImageUrl(url);
};
asc_docs_api.prototype.AddImageUrl = function(url){
	if(g_oDocumentUrls.getLocal(url))
	{
		this.AddImageUrlAction(url);
	}
	else
	{
		var rData = {
			"id":this.documentId,
			"userid": this.documentUserId,
			"vkey": this.documentVKey,
			"c":"imgurl",
			"saveindex": g_oDocumentUrls.getMaxIndex(),
			"data": url};
			
		var t = this;
		this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
		this.fCurCallback = function(input) {
			if(null != input && "imgurl" == input["type"]){
				if("ok" ==input["status"]) {
					var data = input["data"];
					var urls = {};
					var firstUrl;
					for(var i = 0; i < data.length; ++i){
						var elem = data[i];
						if(elem.url){
							if(!firstUrl){
								firstUrl = elem.url;
							}
							urls[elem.path] = elem.url;
						}
					}
					g_oDocumentUrls.addUrls(urls);
					if(firstUrl) {
						t.AddImageUrlAction(firstUrl);
					} else {
						t.asc_fireCallback("asc_onError",c_oAscError.ID.Unknown,c_oAscError.Level.NoCritical);
					}
				} else {
					t.asc_fireCallback("asc_onError", mapAscServerErrorToAscError(parseInt(input["data"])), c_oAscError.Level.NoCritical);
				}
			} else {
				t.asc_fireCallback("asc_onError",c_oAscError.ID.Unknown,c_oAscError.Level.NoCritical);
			}
			t.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
		};
		sendCommand(this, null, rData );
	}
};

asc_docs_api.prototype.AddImageUrlActionCallback = function(_image)
{
    var _w = Page_Width - (X_Left_Margin + X_Right_Margin);
    var _h = Page_Height - (Y_Top_Margin + Y_Bottom_Margin);
    if (_image.Image != null)
    {
        var __w = Math.max((_image.Image.width * g_dKoef_pix_to_mm) >> 0, 1);
        var __h = Math.max((_image.Image.height * g_dKoef_pix_to_mm) >> 0, 1);
        _w = Math.max(5, Math.min(_w, __w));
        _h = Math.max(5, Math.min((_w * __h / __w) >> 0));
    }

    var src = _image.src;
    if (this.isShapeImageChangeUrl)
    {
        var AscShapeProp = new Asc.asc_CShapeProperty();
        AscShapeProp.fill = new asc_CShapeFill();
        AscShapeProp.fill.type = c_oAscFill.FILL_TYPE_BLIP;
        AscShapeProp.fill.fill = new asc_CFillBlip();
        AscShapeProp.fill.fill.asc_putUrl(src);
        this.ShapeApply(AscShapeProp);
        this.isShapeImageChangeUrl = false;
    }
    else if (this.isSlideImageChangeUrl)
    {
        var AscSlideProp = new CAscSlideProps();
        AscSlideProp.Background = new asc_CShapeFill();
        AscSlideProp.Background.type = c_oAscFill.FILL_TYPE_BLIP;
        AscSlideProp.Background.fill = new asc_CFillBlip();
        AscSlideProp.Background.fill.asc_putUrl(src);
        this.SetSlideProps(AscSlideProp);
        this.isSlideImageChangeUrl = false;
    }
    else if (this.isImageChangeUrl)
    {
        var AscImageProp = new Asc.asc_CImgProperty();
        AscImageProp.ImageUrl = src;
        this.ImgApply(AscImageProp);
        this.isImageChangeUrl = false;
    }
    else if (this.isTextArtChangeUrl)
    {
        var AscShapeProp = new Asc.asc_CShapeProperty();
        var oFill = new asc_CShapeFill();
        oFill.type = c_oAscFill.FILL_TYPE_BLIP;
        oFill.fill = new asc_CFillBlip();
        oFill.fill.asc_putUrl(src);
        AscShapeProp.textArtProperties = new Asc.asc_TextArtProperties();
        AscShapeProp.textArtProperties.asc_putFill(oFill);
        this.ShapeApply(AscShapeProp);
        this.isTextArtChangeUrl = false;
    }
    else
    {
        var srcLocal = g_oDocumentUrls.getImageLocal(src);
        if (srcLocal) {
            src = srcLocal;
        }

        this.WordControl.m_oLogicDocument.Add_FlowImage(_w, _h, src);
    }
};

asc_docs_api.prototype.AddImageUrlAction = function(url){
    var _image = this.ImageLoader.LoadImage(url, 1);
    if (null != _image)
    {
        this.AddImageUrlActionCallback(_image);
    }
	else
    {
        this.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);
		this.asyncImageEndLoaded2 = function(_image)
        {
            this.AddImageUrlActionCallback(_image);
            this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);

            this.asyncImageEndLoaded2 = null;
		}
	}
};
/* В качестве параметра  передается объект класса Asc.asc_CImgProperty, он же приходит на OnImgProp
 Asc.asc_CImgProperty заменяет пережнюю структуру:
если параметр не имеет значения то передвать следует null, напримере inline-картинок: в качестве left,top,bottom,right,X,Y,ImageUrl необходимо передавать null.
	{
		Width: 0,
		Height: 0,
		WrappingStyle: 0,
		Paddings: { Left : 0, Top : 0, Bottom: 0, Right: 0 },
		Position : {X : 0, Y : 0},
		ImageUrl : ""
	}
*/
asc_docs_api.prototype.ImgApply = function(obj){
    var ImagePr = {};
	
    ImagePr.Width  = null === obj.Width ? null : parseFloat(obj.Width);
    ImagePr.Height = null === obj.Height ? null : parseFloat(obj.Height);

	if( undefined != obj.Position )
	{
		ImagePr.Position =
		{
			X : null === obj.Position.X ? null : parseFloat(obj.Position.X),
			Y : null === obj.Position.Y ? null : parseFloat(obj.Position.Y)
		};
	}
	else
	{
		ImagePr.Position = {X : null, Y : null};	
	}
	
	ImagePr.ImageUrl = obj.ImageUrl;


	if(!AscCommon.isNullOrEmptyString(ImagePr.ImageUrl)){
      var sImageUrl = null;
      if(!g_oDocumentUrls.getImageLocal(ImagePr.ImageUrl)){
        sImageUrl = ImagePr.ImageUrl;
      }

      var oApi = this;
      var fApplyCallback = function(){
        var _img = oApi.ImageLoader.LoadImage(ImagePr.ImageUrl, 1);
        var srcLocal = g_oDocumentUrls.getImageLocal(ImagePr.ImageUrl);
        if (srcLocal){
          ImagePr.ImageUrl = srcLocal;
        }
        if (null != _img){
          oApi.WordControl.m_oLogicDocument.Set_ImageProps( ImagePr );
        }
        else{
            oApi.asyncImageEndLoaded2 = function(_image){
              oApi.WordControl.m_oLogicDocument.Set_ImageProps( ImagePr );
              oApi.asyncImageEndLoaded2 = null;
          }
        }
      };
      if(!sImageUrl){
        fApplyCallback();
      }
      else{
        this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
        this.fCurCallback = function(input) {
          if(null != input && "imgurl" == input["type"]){
            if("ok" ==input["status"]) {
              var data = input["data"];
              var urls = {};
              var firstUrl;
              for(var i = 0; i < data.length; ++i){
                var elem = data[i];
                if(elem.url){
                  if(!firstUrl){
                    firstUrl = elem.url;
                  }
                  urls[elem.path] = elem.url;
                }
              }
              g_oDocumentUrls.addUrls(urls);
              if(firstUrl) {
                ImagePr.ImageUrl = firstUrl;
                fApplyCallback();
              } else {
                oApi.asc_fireCallback("asc_onError",c_oAscError.ID.Unknown,c_oAscError.Level.NoCritical);
              }
            } else {
              oApi.asc_fireCallback("asc_onError", mapAscServerErrorToAscError(parseInt(input["data"])), c_oAscError.Level.NoCritical);
            }
          } else {
            oApi.asc_fireCallback("asc_onError",c_oAscError.ID.Unknown,c_oAscError.Level.NoCritical);
          }
          oApi.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
        };

        var rData = {
          "id":this.documentId,
          "userid": this.documentUserId,
          "vkey": this.documentVKey,
          "c":"imgurl",
          "saveindex": g_oDocumentUrls.getMaxIndex(),
          "data": sImageUrl};
        sendCommand(this, null, rData );
      }
	}
	else
    {
		ImagePr.ImageUrl = null;
		this.WordControl.m_oLogicDocument.Set_ImageProps( ImagePr );
	}
};

asc_docs_api.prototype.ChartApply = function(obj)
{
    if(obj.ChartProperties && obj.ChartProperties.type === Asc.c_oAscChartTypeSettings.stock && this.WordControl.m_oLogicDocument.Slides[this.WordControl.m_oLogicDocument.CurPage])
    {
        if(!AscFormat.CheckStockChart(this.WordControl.m_oLogicDocument.Slides[this.WordControl.m_oLogicDocument.CurPage].graphicObjects, this))
        {
            return;
        }
    }
    this.WordControl.m_oLogicDocument.ChartApply(obj);
};
asc_docs_api.prototype.set_Size = function(width, height){

};
asc_docs_api.prototype.set_ConstProportions = function(isOn){
	if (isOn){
	
	}
	else{
	
	}
};
asc_docs_api.prototype.set_WrapStyle = function(type){

};
asc_docs_api.prototype.deleteImage = function(){

};
asc_docs_api.prototype.set_ImgDistanceFromText = function(left,top,right,bottom){
	
};
asc_docs_api.prototype.set_PositionOnPage = function(X,Y){//расположение от начала страницы
	
};
asc_docs_api.prototype.get_OriginalSizeImage = function(){
	if (0 == this.SelectedObjectsStack.length)
        return null;
    var obj = this.SelectedObjectsStack[this.SelectedObjectsStack.length - 1];
    if (obj == null)
        return null;
    if (obj.Type == c_oAscTypeSelectElement.Image)
        return obj.Value.asc_getOriginSize(this);
};
/*callbacks*/
asc_docs_api.prototype.sync_AddImageCallback = function(){
	this.asc_fireCallback("asc_onAddImage");
};
asc_docs_api.prototype.sync_ImgPropCallback = function(imgProp){
    var type = imgProp.chartProps ? c_oAscTypeSelectElement.Chart : c_oAscTypeSelectElement.Image;
    var objects;
    if(type === c_oAscTypeSelectElement.Chart)
    {
        objects = new CAscChartProp(imgProp);
    }
    else
    {
        objects = new Asc.asc_CImgProperty(imgProp);
    }
    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject( type,  objects);
};

asc_docs_api.prototype.SetDrawingFreeze = function(bIsFreeze)
{
    this.WordControl.DrawingFreeze = bIsFreeze;

    var _elem1 = document.getElementById("id_main");
    if (_elem1)
    {
        var _elem2 = document.getElementById("id_panel_thumbnails");
        var _elem3 = document.getElementById("id_panel_notes");
        if (bIsFreeze)
        {
            _elem1.style.display = "none";
            _elem2.style.display = "none";
            _elem3.style.display = "none";
        }
        else
        {
            _elem1.style.display = "block";
            _elem2.style.display = "block";
            _elem3.style.display = "block";
        }
    }

    if (!bIsFreeze)
        this.WordControl.OnScroll();
};

/*----------------------------------------------------------------*/
/*functions for working with zoom & navigation*/
asc_docs_api.prototype.zoomIn = function(){
    this.WordControl.zoom_In();
};
asc_docs_api.prototype.zoomOut = function(){
    this.WordControl.zoom_Out();
};
asc_docs_api.prototype.zoomFitToPage = function(){
    this.WordControl.zoom_FitToPage();
};
asc_docs_api.prototype.zoomFitToWidth = function(){
    this.WordControl.zoom_FitToWidth();
};
asc_docs_api.prototype.zoomCustomMode = function(){
    this.WordControl.m_nZoomType = 0;
    this.WordControl.zoom_Fire();
};
asc_docs_api.prototype.zoom100 = function(){
    this.WordControl.m_nZoomValue = 100;
    this.WordControl.zoom_Fire();
};
asc_docs_api.prototype.zoom = function(percent){
    this.WordControl.m_nZoomValue = percent;
    this.WordControl.zoom_Fire(0);
};
asc_docs_api.prototype.goToPage = function(number){
	this.WordControl.GoToPage(number);
};
asc_docs_api.prototype.getCountPages = function(){
	return this.WordControl.m_oDrawingDocument.SlidesCount;
};
asc_docs_api.prototype.getCurrentPage = function(){
	return this.WordControl.m_oDrawingDocument.SlideCurrent;
};
/*callbacks*/
asc_docs_api.prototype.sync_zoomChangeCallback = function(percent,type){	//c_oAscZoomType.Current, c_oAscZoomType.FitWidth, c_oAscZoomType.FitPage
	this.asc_fireCallback("asc_onZoomChange",percent,type);
};
asc_docs_api.prototype.sync_countPagesCallback = function(count){
	this.asc_fireCallback("asc_onCountPages",count);
};
asc_docs_api.prototype.sync_currentPageCallback = function(number){
	this.asc_fireCallback("asc_onCurrentPage",number);
};

asc_docs_api.prototype.sync_SendThemeColors = function(colors,standart_colors)
{
    this.asc_fireCallback("asc_onSendThemeColors",colors,standart_colors);
};

asc_docs_api.prototype.sync_SendThemeColorSchemes = function(param)
{
    this.asc_fireCallback("asc_onSendThemeColorSchemes",param);
};

asc_docs_api.prototype.ChangeColorScheme = function(index_scheme)
{
    var _count_defaults = g_oUserColorScheme.length;
    if (index_scheme < _count_defaults)
    {
        var _obj = g_oUserColorScheme[index_scheme];
        var scheme = new AscFormat.ClrScheme();
		scheme.name = _obj["name"];
        var _c = null;

        _c = _obj["dk1"];
        scheme.colors[8] = AscFormat.CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

        _c = _obj["lt1"];
        scheme.colors[12] = AscFormat.CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

        _c = _obj["dk2"];
        scheme.colors[9] = AscFormat.CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

        _c = _obj["lt2"];
        scheme.colors[13] = AscFormat.CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

        _c = _obj["accent1"];
        scheme.colors[0] = AscFormat.CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

        _c = _obj["accent2"];
        scheme.colors[1] = AscFormat.CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

        _c = _obj["accent3"];
        scheme.colors[2] = AscFormat.CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

        _c = _obj["accent4"];
        scheme.colors[3] = AscFormat.CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

        _c = _obj["accent5"];
        scheme.colors[4] = AscFormat.CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

        _c = _obj["accent6"];
        scheme.colors[5] = AscFormat.CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

        _c = _obj["hlink"];
        scheme.colors[11] = AscFormat.CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

        _c = _obj["folHlink"];
        scheme.colors[10] = AscFormat.CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

        this.WordControl.m_oLogicDocument.changeColorScheme(scheme);
    }
    else
    {
        index_scheme -= _count_defaults;
        if (null == this.WordControl.MasterLayouts)
            return;

        var theme = this.WordControl.MasterLayouts.Theme;
        if (null == theme)
            return;

        if (index_scheme < 0 || index_scheme >= theme.extraClrSchemeLst.length)
            return;

        this.WordControl.m_oLogicDocument.changeColorScheme(theme.extraClrSchemeLst[index_scheme].clrScheme);
    }

    this.WordControl.m_oDrawingDocument.CheckGuiControlColors();
};

/*----------------------------------------------------------------*/
asc_docs_api.prototype.asc_enableKeyEvents = function(value){
	if (this.WordControl.IsFocus != value) {
		this.WordControl.IsFocus = value;
		this.asc_fireCallback("asc_onEnableKeyEventsChanged", value);
	}
}


//-----------------------------------------------------------------
// Функции для работы с комментариями
//-----------------------------------------------------------------
function asc_CCommentData( obj )
{
    if( obj )
    {
        this.m_sText      = (undefined != obj.m_sText     ) ? obj.m_sText      : "";
        this.m_sTime      = (undefined != obj.m_sTime     ) ? obj.m_sTime      : "";
        this.m_sUserId    = (undefined != obj.m_sUserId   ) ? obj.m_sUserId    : "";
        this.m_sQuoteText = (undefined != obj.m_sQuoteText) ? obj.m_sQuoteText : null;
        this.m_bSolved    = (undefined != obj.m_bSolved   ) ? obj.m_bSolved    : false;
        this.m_sUserName  = (undefined != obj.m_sUserName ) ? obj.m_sUserName  : "";
        this.m_aReplies   = [];
        if ( undefined != obj.m_aReplies )
        {
            var Count = obj.m_aReplies.length;
            for ( var Index = 0; Index < Count; Index++ )
            {
                var Reply = new asc_CCommentData( obj.m_aReplies[Index] );
                this.m_aReplies.push( Reply );
            }
        }
    }
    else
    {
        this.m_sText      = "";
        this.m_sTime      = "";
        this.m_sUserId    = "";
        this.m_sQuoteText = null;
        this.m_bSolved    = false;
        this.m_sUserName  = "";
        this.m_aReplies   = [];
    }
}

asc_CCommentData.prototype.asc_getText         = function()  { return this.m_sText; };
asc_CCommentData.prototype.asc_putText         = function(v) { this.m_sText = v ? v.slice(0, Asc.c_oAscMaxCellOrCommentLength) : v; };
asc_CCommentData.prototype.asc_getTime         = function()  { return this.m_sTime; };
asc_CCommentData.prototype.asc_putTime         = function(v) { this.m_sTime = v; };
asc_CCommentData.prototype.asc_getUserId       = function()  { return this.m_sUserId; };
asc_CCommentData.prototype.asc_putUserId       = function(v) { this.m_sUserId = v; };
asc_CCommentData.prototype.asc_getUserName     = function()  { return this.m_sUserName; };
asc_CCommentData.prototype.asc_putUserName     = function(v) { this.m_sUserName = v; };
asc_CCommentData.prototype.asc_getQuoteText    = function()  { return this.m_sQuoteText; };
asc_CCommentData.prototype.asc_putQuoteText    = function(v) { this.m_sQuoteText = v; };
asc_CCommentData.prototype.asc_getSolved       = function()  { return this.m_bSolved; };
asc_CCommentData.prototype.asc_putSolved       = function(v) { this.m_bSolved = v; };
asc_CCommentData.prototype.asc_getReply        = function(i) { return this.m_aReplies[i]; };
asc_CCommentData.prototype.asc_addReply        = function(v) { this.m_aReplies.push( v ); };
asc_CCommentData.prototype.asc_getRepliesCount = function(v) { return this.m_aReplies.length; };


asc_docs_api.prototype.asc_showComments = function()
{
    if (null == this.WordControl.m_oLogicDocument)
        return;

    this.WordControl.m_oLogicDocument.Show_Comments();
};

asc_docs_api.prototype.asc_hideComments = function()
{
    if (null == this.WordControl.m_oLogicDocument)
        return;

    this.WordControl.m_oLogicDocument.Hide_Comments();
    editor.sync_HideComment();
};

asc_docs_api.prototype.asc_addComment = function(AscCommentData)
{
};

asc_docs_api.prototype.asc_getMasterCommentId = function()
{
    return -1;
};

asc_docs_api.prototype.asc_getAnchorPosition = function()
{
    var AnchorPos = this.WordControl.m_oLogicDocument.Get_SelectionAnchorPos();
    return new AscCommon.asc_CRect(AnchorPos.X0, AnchorPos.Y, AnchorPos.X1 - AnchorPos.X0, 0);
};

asc_docs_api.prototype.asc_removeComment = function(Id)
{
    if (null == this.WordControl.m_oLogicDocument)
        return;

    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_MoveComment, Id ) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_RemoveComment);
        this.WordControl.m_oLogicDocument.Remove_Comment( Id, true );
    }
};

asc_docs_api.prototype.asc_changeComment = function(Id, AscCommentData)
{
    if (null == this.WordControl.m_oLogicDocument)
        return;

    //if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_MoveComment, Id ) )
    {
        var CommentData = new CCommentData();
        CommentData.Read_FromAscCommentData(AscCommentData);

        this.WordControl.m_oLogicDocument.Change_Comment( Id, CommentData );

    }
};

asc_docs_api.prototype.asc_selectComment = function(Id)
{
    if (null == this.WordControl.m_oLogicDocument)
        return;

    this.WordControl.m_oLogicDocument.Select_Comment(Id);
};

asc_docs_api.prototype.asc_showComment = function(Id)
{
    this.WordControl.m_oLogicDocument.Show_Comment(Id);
};

asc_docs_api.prototype.can_AddQuotedComment = function()
{
    //if ( true === CollaborativeEditing.Get_GlobalLock() )
    //    return false;

    return this.WordControl.m_oLogicDocument.CanAdd_Comment();
};

asc_docs_api.prototype.sync_RemoveComment = function(Id)
{
    this.asc_fireCallback("asc_onRemoveComment", Id);
};

asc_docs_api.prototype.sync_AddComment = function(Id, CommentData)
{
    if(this.bNoSendComments === false)
    {
        var AscCommentData = new asc_CCommentData(CommentData);
        AscCommentData.asc_putQuoteText("");
        this.asc_fireCallback("asc_onAddComment", Id, AscCommentData);
    }
};

asc_docs_api.prototype.sync_ShowComment = function(Id, X, Y)
{
    /*
    if (this.WordControl.m_oMainContent)
    {
        X -= ((this.WordControl.m_oMainContent.Bounds.L * g_dKoef_mm_to_pix) >> 0);
    }
    */
    // TODO: Переделать на нормальный массив
    this.asc_fireCallback("asc_onShowComment", [ Id ], X, Y);
};

asc_docs_api.prototype.sync_HideComment = function()
{
    this.asc_fireCallback("asc_onHideComment");
};

asc_docs_api.prototype.sync_UpdateCommentPosition = function(Id, X, Y)
{
    // TODO: Переделать на нормальный массив
    this.asc_fireCallback("asc_onUpdateCommentPosition", [ Id ], X, Y);
};

asc_docs_api.prototype.sync_ChangeCommentData = function(Id, CommentData)
{
    var AscCommentData = new asc_CCommentData(CommentData);
    this.asc_fireCallback("asc_onChangeCommentData", Id, AscCommentData);
};

asc_docs_api.prototype.sync_LockComment = function(Id, UserId)
{
    this.asc_fireCallback("asc_onLockComment", Id, UserId);
};

asc_docs_api.prototype.sync_UnLockComment = function(Id)
{
    this.asc_fireCallback("asc_onUnLockComment", Id);
};

// работа с шрифтами
asc_docs_api.prototype.asyncFontsDocumentStartLoaded = function()
{
	// здесь прокинуть евент о заморозке меню
	// и нужно вывести информацию в статус бар
    if (this.isPasteFonts_Images)
        this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadFont);
    else
    {
        this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadDocumentFonts);

        // заполним прогресс
        var _progress = this.OpenDocumentProgress;
        _progress.Type = c_oAscAsyncAction.LoadDocumentFonts;
        _progress.FontsCount = this.FontLoader.fonts_loading.length;
        _progress.CurrentFont = 0;

        var _loader_object = this.WordControl.m_oLogicDocument;
        var _count = 0;
        if (_loader_object !== undefined && _loader_object != null)
        {
			for (var i in _loader_object.ImageMap) {
				if(this.DocInfo.get_OfflineApp()) {
					var localUrl = _loader_object.ImageMap[i];
					g_oDocumentUrls.addImageUrl(localUrl, this.documentUrl + 'media/' + localUrl);
				}
                ++_count;
			}
        }

        _progress.ImagesCount = _count + g_oUserTexturePresets.length;
        _progress.CurrentImage = 0;
    }
};
asc_docs_api.prototype.GenerateStyles = function()
{
    return;
};
asc_docs_api.prototype.asyncFontsDocumentEndLoaded = function()
{
    // все, шрифты загружены. Теперь нужно подгрузить картинки
    if (this.isPasteFonts_Images)
        this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadFont);
    else
        this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadDocumentFonts);

    this.EndActionLoadImages = 0;
    if (this.isPasteFonts_Images)
    {
        var _count = 0;
        for (var i in this.pasteImageMap)
            ++_count;

        if (_count > 0)
        {
            this.EndActionLoadImages = 2;
            this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
        }

        this.ImageLoader.LoadDocumentImages(this.pasteImageMap, false);
        return;
    }
    else if (this.isSaveFonts_Images)
    {
        var _count = 0;
        for (var i in this.saveImageMap)
            ++_count;

        if (_count > 0)
        {
            this.EndActionLoadImages = 2;
            this.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);
        }

        this.ImageLoader.LoadDocumentImages(this.saveImageMap, false);
        return;
    }

    this.GenerateStyles();
    // открытие после загрузки документа

    if (this.isLoadNoCutFonts)
    {
        this.isLoadNoCutFonts = false;
        this.asc_setViewMode(false);
        return;
    }

	var _loader_object = this.WordControl.m_oLogicDocument;
	if (null == _loader_object)
		_loader_object = this.WordControl.m_oDrawingDocument.m_oDocumentRenderer;

    var _count = 0;
	for (var i in _loader_object.ImageMap)
        ++_count;

    // add const textures
    var _st_count = g_oUserTexturePresets.length;
    for (var i = 0; i < _st_count; i++)
        _loader_object.ImageMap[_count + i] = g_oUserTexturePresets[i];

    if (_count > 0)
    {
        this.EndActionLoadImages = 1;
        this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadDocumentImages);
    }

    this.ImageLoader.bIsLoadDocumentFirst = true;
	this.ImageLoader.LoadDocumentImages(_loader_object.ImageMap, true);
};
asc_docs_api.prototype.asyncImagesDocumentEndLoaded = function()
{
    this.ImageLoader.bIsLoadDocumentFirst = false;
    var _bIsOldPaste = this.isPasteFonts_Images;
	
	if (this.EndActionLoadImages == 1)
    {
        this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadDocumentImages);
    }
    else if (this.EndActionLoadImages == 2)
    {
        if (_bIsOldPaste)
            this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
        else
            this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);
    }

    this.EndActionLoadImages = 0;
	
    // размораживаем меню... и начинаем считать документ
    if (this.isPasteFonts_Images)
    {
        this.isPasteFonts_Images = false;
        this.pasteImageMap = null;
        this.decrementCounterLongAction();
        this.pasteCallback();
        window.GlobalPasteFlag = false;
        window.GlobalPasteFlagCounter = 0;
        this.pasteCallback = null;
    }
    else if (this.isSaveFonts_Images)
    {
        this.isSaveFonts_Images = false;
        this.saveImageMap = null;
        this.pre_SaveCallback();
    }
    else
    {
        this.ServerImagesWaitComplete = true;
        if (true == this.ServerIdWaitComplete)
            this.OpenDocumentEndCallback();
    }    
};

asc_docs_api.prototype.asc_getComments = function()
{
    var comms = [];
    if (null == this.WordControl.m_oLogicDocument)
        return comms;

    var _slides = this.WordControl.m_oLogicDocument.Slides;
    var _slidesCount = _slides.length;
    for (var i = 0; i < _slidesCount; i++)
    {
        var _comments = _slides[i].slideComments.comments;
        var _commentsCount = _comments.length;

        for (var j = 0; j < _commentsCount; j++)
        {
            var _id = _comments[j].Get_Id();
            var _ascCommentData = new asc_CCommentData(_comments[j].Data);

            comms.push({ "Id" : _id, "Comment" : _ascCommentData });
        }
    }
    return comms;
};

asc_docs_api.prototype.OpenDocumentEndCallback = function()
{
    var bIsScroll = false;

    if (0 == this.DocumentType)
        this.WordControl.m_oLogicDocument.LoadEmptyDocument();
    else if (1 == this.DocumentType)
    {
        this.WordControl.m_oLogicDocument.LoadTestDocument();
    }
    else
    {
        if(this.LoadedObject)
        {
            if(this.LoadedObject === 1)
            {
                if (this.isApplyChangesOnOpenEnabled)
                {
                    this.isApplyChangesOnOpenEnabled = false;
                    this.isApplyChangesOnOpen = true;
                    this.bNoSendComments = true;
                    var OtherChanges = CollaborativeEditing.m_aChanges.length > 0 ;
                    CollaborativeEditing.Apply_Changes();
                    CollaborativeEditing.Release_Locks();
                    this.bNoSendComments = false;

                    var _slides = this.WordControl.m_oLogicDocument.Slides;
                    var _slidesCount = _slides.length;
                    for (var i = 0; i < _slidesCount; i++)
                    {
                        var slideComments = _slides[i].slideComments;
                        if(slideComments)
                        {
                            var _comments = slideComments.comments;
                            var _commentsCount = _comments.length;
                            for (var j = 0; j < _commentsCount; j++)
                            {
                                this.sync_AddComment(_comments[j].Get_Id(), _comments[j].Data );
                            }
                        }
                    }
                    this.bAddComments = true;
                    if(OtherChanges)
                    {
                        return;
                    }

                  // Применяем все lock-и (ToDo возможно стоит пересмотреть вообще Lock-и)
                  for (var i = 0; i < this.arrPreOpenLocksObjects.length; ++i) {
                    this.arrPreOpenLocksObjects[i]();
                  }
                  this.arrPreOpenLocksObjects = [];
                }
            }
            this.WordControl.m_oLogicDocument.Recalculate({Drawings: {All:true, Map: {}}});
            var presentation = this.WordControl.m_oLogicDocument;

            presentation.DrawingDocument.OnEndRecalculate();

            this.WordControl.m_oLayoutDrawer.IsRetina = this.WordControl.bIsRetinaSupport;

            this.WordControl.m_oLayoutDrawer.WidthMM = presentation.Width;
            this.WordControl.m_oLayoutDrawer.HeightMM = presentation.Height;
            this.WordControl.m_oMasterDrawer.WidthMM = presentation.Width;
            this.WordControl.m_oMasterDrawer.HeightMM = presentation.Height;
            this.WordControl.m_oLogicDocument.GenerateThumbnails(this.WordControl.m_oMasterDrawer, this.WordControl.m_oLayoutDrawer);

            var _masters = this.WordControl.m_oLogicDocument.slideMasters;
            for (var i = 0; i < _masters.length; i++)
            {
                if(_masters[i].ThemeIndex < 0)//только темы презентации
                {
                    var theme_load_info = new CThemeLoadInfo();
                    theme_load_info.Master = _masters[i];
                    theme_load_info.Theme = _masters[i].Theme;

                    var _lay_cnt = _masters[i].sldLayoutLst.length;
                    for (var j = 0; j < _lay_cnt; j++)
                        theme_load_info.Layouts[j] = _masters[i].sldLayoutLst[j];

                    var th_info = {};
                    th_info["Name"] = "Doc Theme " + i;
                    th_info["Url"] = "";
                    th_info["Thumbnail"] = _masters[i].ImageBase64;

                    var th = new CAscThemeInfo(th_info);
                    this.ThemeLoader.Themes.DocumentThemes[this.ThemeLoader.Themes.DocumentThemes.length] = th;
                    th.Index = -this.ThemeLoader.Themes.DocumentThemes.length;

                    this.ThemeLoader.themes_info_document[this.ThemeLoader.Themes.DocumentThemes.length - 1] = theme_load_info;
                }
            }

            this.sync_InitEditorThemes(this.ThemeLoader.Themes.EditorThemes, this.ThemeLoader.Themes.DocumentThemes);

            this.asc_fireCallback("asc_onPresentationSize", presentation.Width, presentation.Height);

            this.WordControl.GoToPage(0);
            bIsScroll = true;
        }
    }


    this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
    this.WordControl.m_oLogicDocument.Document_UpdateRulersState();
    this.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
    this.LoadedObject = null;

    this.bInit_word_control = true;
    if(!(this.bAddComments === true) && !this.bNoSendComments)
    {
        var _slides = this.WordControl.m_oLogicDocument.Slides;
        var _slidesCount = _slides.length;
        for (var i = 0; i < _slidesCount; i++)
        {
            var slideComments = _slides[i].slideComments;
            if(slideComments)
            {
                var _comments = slideComments.comments;
                var _commentsCount = _comments.length;
                for (var j = 0; j < _commentsCount; j++)
                {
                    this.sync_AddComment(_comments[j].Get_Id(), _comments[j].Data );
                }
            }
        }
    }
    this.asc_fireCallback("asc_onDocumentContentReady");
    this.isApplyChangesOnOpen = false;
    this.bAddComments = false;
    this.WordControl.InitControl();
    if (bIsScroll)
    {
        this.WordControl.OnScroll();
    }

    if (this.isViewMode)
        this.asc_setViewMode(true);

	// Меняем тип состояния (на никакое)
	this.advancedOptionsAction = AscCommon.c_oAscAdvancedOptionsAction.None;
};

asc_docs_api.prototype.asyncFontEndLoaded = function(fontinfo)
{
    this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadFont);
    if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
        History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
        this.WordControl.m_oLogicDocument.Paragraph_Add(new ParaTextPr({FontFamily: {Name: fontinfo.Name, Index: -1}}));
    }
};

asc_docs_api.prototype.asyncImageEndLoaded = function(_image)
{
    // отжать заморозку меню
	if (this.asyncImageEndLoaded2)
		this.asyncImageEndLoaded2(_image);
	else
    {
        this.WordControl.m_oLogicDocument.Add_FlowImage(50, 50, _image.src);
	}
};

asc_docs_api.prototype.get_PresentationWidth = function()
{
    if (this.WordControl.m_oLogicDocument == null)
        return 0;
    return this.WordControl.m_oLogicDocument.Width;
};
asc_docs_api.prototype.get_PresentationHeight = function()
{
    if (this.WordControl.m_oLogicDocument == null)
        return 0;
    return this.WordControl.m_oLogicDocument.Height;
};

asc_docs_api.prototype.pre_Paste = function(_fonts, _images, callback)
{
    this.pasteCallback = callback;
    this.pasteImageMap = _images;

    var _count = 0;
    for (var i in this.pasteImageMap)
        ++_count;
    if (0 == _count && false === this.FontLoader.CheckFontsNeedLoading(_fonts))
    {
        // никаких евентов. ничего грузить не нужно. сделано для сафари под макОс.
        // там при LongActions теряется фокус и вставляются пробелы
        this.decrementCounterLongAction();
        this.pasteCallback();
        window.GlobalPasteFlag = false;
        window.GlobalPasteFlagCounter = 0;
        this.pasteCallback = null;
        return;
    }

    this.isPasteFonts_Images = true;
    this.FontLoader.LoadDocumentFonts2(_fonts);
};

asc_docs_api.prototype.pre_SaveCallback = function()
{
    CollaborativeEditing.OnEnd_Load_Objects();

    if (this.isApplyChangesOnOpen)
    {
        this.isApplyChangesOnOpen = false;
        this.OpenDocumentEndCallback();
    }

    this.WordControl.SlideDrawer.CheckRecalculateSlide();
};

asc_docs_api.prototype.initEvents2MobileAdvances = function()
{
    this.WordControl.initEvents2MobileAdvances();
};
asc_docs_api.prototype.ViewScrollToX = function(x)
{
    this.WordControl.m_oScrollHorApi.scrollToX(x);
};
asc_docs_api.prototype.ViewScrollToY = function(y)
{
    this.WordControl.m_oScrollVerApi.scrollToY(y);
};
asc_docs_api.prototype.GetDocWidthPx = function()
{
    return this.WordControl.m_dDocumentWidth;
};
asc_docs_api.prototype.GetDocHeightPx = function()
{
    return this.WordControl.m_dDocumentHeight;
};
asc_docs_api.prototype.ClearSearch = function()
{
    return this.WordControl.m_oDrawingDocument.EndSearch(true);
};
asc_docs_api.prototype.GetCurrentVisiblePage = function()
{
    return this.WordControl.m_oDrawingDocument.SlideCurrent;
};

asc_docs_api.prototype.asc_SetDocumentPlaceChangedEnabled = function(bEnabled)
{
    if (this.WordControl)
        this.WordControl.m_bDocumentPlaceChangedEnabled = bEnabled;
};

asc_docs_api.prototype.asc_SetViewRulers = function(bRulers)
{
    //if (false === this.bInit_word_control || true === this.isViewMode)
    //    return;

    if (this.WordControl.m_bIsRuler != bRulers)
    {
        this.WordControl.m_bIsRuler = bRulers;
        this.WordControl.checkNeedRules();
        this.WordControl.OnResize(true);
    }
};
asc_docs_api.prototype.asc_SetViewRulersChange = function()
{
    //if (false === this.bInit_word_control || true === this.isViewMode)
    //    return;

    this.WordControl.m_bIsRuler = !this.WordControl.m_bIsRuler;
    this.WordControl.checkNeedRules();
    this.WordControl.OnResize(true);
    return this.WordControl.m_bIsRuler;
};
asc_docs_api.prototype.asc_GetViewRulers = function()
{
    return this.WordControl.m_bIsRuler;
};
asc_docs_api.prototype.asc_SetDocumentUnits = function(_units)
{
    if (this.WordControl && this.WordControl.m_oHorRuler && this.WordControl.m_oVerRuler)
    {
        this.WordControl.m_oHorRuler.Units = _units;
        this.WordControl.m_oVerRuler.Units = _units;
        this.WordControl.UpdateHorRulerBack(true);
        this.WordControl.UpdateVerRulerBack(true);
    }
};

asc_docs_api.prototype.SetMobileVersion = function(val)
{
    this.isMobileVersion = val;
    if (this.isMobileVersion)
    {
        this.WordControl.bIsRetinaSupport = false; // ipad имеет проблемы с большими картинками
        this.WordControl.bIsRetinaNoSupportAttack = true;
        this.WordControl.m_bIsRuler = false;
		this.ShowParaMarks = false;
    }
};

asc_docs_api.prototype.GoToHeader = function(pageNumber)
{
    if (this.WordControl.m_oDrawingDocument.IsFreezePage(pageNumber))
        return;

    var oldClickCount = global_mouseEvent.ClickCount;
    global_mouseEvent.ClickCount = 2;
    this.WordControl.m_oLogicDocument.OnMouseDown(global_mouseEvent, 0, 0, pageNumber);
    this.WordControl.m_oLogicDocument.OnMouseUp(global_mouseEvent, 0, 0, pageNumber);

    this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();

    global_mouseEvent.ClickCount = oldClickCount;
};

asc_docs_api.prototype.changeSlideSize = function(width, height)
{
    this.WordControl.m_oLogicDocument.changeSlideSize(width, height);
};

asc_docs_api.prototype.AddSlide = function(layoutIndex)
{
    this.WordControl.m_oLogicDocument.addNextSlide(layoutIndex);
};
asc_docs_api.prototype.DeleteSlide = function()
{
    var _delete_array = this.WordControl.Thumbnails.GetSelectedArray();

    if (!this.IsSupportEmptyPresentation)
    {
        if (_delete_array.length == this.WordControl.m_oDrawingDocument.SlidesCount)
            _delete_array.splice(0, 1);
    }

    if (_delete_array.length != 0)
    {
        this.WordControl.m_oLogicDocument.deleteSlides(_delete_array);
    }
};
asc_docs_api.prototype.DublicateSlide = function()
{
    this.WordControl.m_oLogicDocument.DublicateSlide();
};

asc_docs_api.prototype.SelectAllSlides = function(layoutType)
{
    var drDoc = this.WordControl.m_oDrawingDocument;
    var slidesCount = drDoc.SlidesCount;

    for (var i = 0; i < slidesCount; i++)
    {
        this.WordControl.Thumbnails.m_arrPages[i].IsSelected = true;
    }
    this.WordControl.Thumbnails.OnUpdateOverlay();
};

asc_docs_api.prototype.AddShape = function(shapetype)
{
};
asc_docs_api.prototype.ChangeShapeType = function(shapetype)
{
    this.WordControl.m_oLogicDocument.changeShapeType(shapetype);
};
asc_docs_api.prototype.AddText = function()
{
};

asc_docs_api.prototype.groupShapes = function()
{
    this.WordControl.m_oLogicDocument.groupShapes();
};

asc_docs_api.prototype.unGroupShapes = function()
{
    this.WordControl.m_oLogicDocument.unGroupShapes();
};

asc_docs_api.prototype.setVerticalAlign = function(align)
{
    this.WordControl.m_oLogicDocument.setVerticalAlign(align);
};

asc_docs_api.prototype.setVert = function(vert)
{
    this.WordControl.m_oLogicDocument.setVert(vert);
};

asc_docs_api.prototype.sync_MouseMoveStartCallback = function()
{
    this.asc_fireCallback("asc_onMouseMoveStart");
};

asc_docs_api.prototype.sync_MouseMoveEndCallback = function()
{
    this.asc_fireCallback("asc_onMouseMoveEnd");
};

asc_docs_api.prototype.sync_MouseMoveCallback = function(Data)
{
    if(Data.Hyperlink && typeof Data.Hyperlink.Value === "string")
    {
        var indAction = Data.Hyperlink.Value.indexOf("ppaction://hlink");
        var Url = Data.Hyperlink.Value;
        if (0 == indAction)
        {
            if (Url == "ppaction://hlinkshowjump?jump=firstslide")
            {
                Data.Hyperlink.Value = "First Slide";
            }
            else if (Url == "ppaction://hlinkshowjump?jump=lastslide")
            {
                Data.Hyperlink.Value = "Last Slide";
            }
            else if (Url == "ppaction://hlinkshowjump?jump=nextslide")
            {
                Data.Hyperlink.Value = "Next Slide";
            }
            else if (Url == "ppaction://hlinkshowjump?jump=previousslide")
            {
                Data.Hyperlink.Value = "Previous Slide";
            }
            else
            {
                var mask = "ppaction://hlinksldjumpslide";
                var indSlide = Url.indexOf(mask);
                if (0 == indSlide)
                {
                    var slideNum = parseInt(Url.substring(mask.length));
                    Data.Hyperlink.Value = "Slide" + slideNum;
                }
            }
        }
    }
    this.asc_fireCallback("asc_onMouseMove", Data );
};

asc_docs_api.prototype.sync_ShowForeignCursorLabel = function(UserId, X, Y, Color)
{

    this.asc_fireCallback("asc_onShowForeignCursorLabel", UserId, X, Y, new AscCommon.CColor(Color.r, Color.g, Color.b, 255));
};
asc_docs_api.prototype.sync_HideForeignCursorLabel = function(UserId)
{
    this.asc_fireCallback("asc_onHideForeignCursorLabel", UserId);
};

asc_docs_api.prototype.ShowThumbnails = function(bIsShow)
{
    if (bIsShow)
    {
        this.WordControl.Splitter1Pos = this.WordControl.OldSplitter1Pos;
        if (this.WordControl.Splitter1Pos == 0)
            this.WordControl.Splitter1Pos = 70;
        this.WordControl.OnResizeSplitter();
    }
    else
    {
        var old = this.WordControl.OldSplitter1Pos;
        this.WordControl.Splitter1Pos = 0;
        this.WordControl.OnResizeSplitter();
        this.WordControl.OldSplitter1Pos = old;
    }
};
asc_docs_api.prototype.asc_DeleteVerticalScroll = function()
{
    this.WordControl.DeleteVerticalScroll();
};

asc_docs_api.prototype.syncOnThumbnailsShow = function()
{
    var bIsShow = true;
    if (0 == this.WordControl.Splitter1Pos)
        bIsShow = false;

    this.asc_fireCallback("asc_onThumbnailsShow", bIsShow);
};



//-----------------------------------------------------------------
// Функции для работы с гиперссылками
//-----------------------------------------------------------------
asc_docs_api.prototype.can_AddHyperlink = function()
{
    //if ( true === CollaborativeEditing.Get_GlobalLock() )
    //    return false;

    var bCanAdd = this.WordControl.m_oLogicDocument.Hyperlink_CanAdd();
    if ( true === bCanAdd )
        return this.WordControl.m_oLogicDocument.Get_SelectedText(true);

    return false;
};

// HyperProps - объект CHyperlinkProperty
asc_docs_api.prototype.add_Hyperlink = function(HyperProps)
{
    this.WordControl.m_oLogicDocument.Hyperlink_Add( HyperProps );
};

// HyperProps - объект CHyperlinkProperty
asc_docs_api.prototype.change_Hyperlink = function(HyperProps)
{
    this.WordControl.m_oLogicDocument.Hyperlink_Modify( HyperProps );
};

asc_docs_api.prototype.remove_Hyperlink = function()
{
    this.WordControl.m_oLogicDocument.Hyperlink_Remove();
};

function CHyperlinkProperty( obj )
{
    if( obj )
    {
        this.Text    = (undefined != obj.Text   ) ? obj.Text    : null;
        this.Value   = (undefined != obj.Value  ) ? obj.Value   : "";
        this.ToolTip = (undefined != obj.ToolTip) ? obj.ToolTip : null;
    }
    else
    {
        this.Text    = null;
        this.Value   = "";
        this.ToolTip = null;
    }
}

CHyperlinkProperty.prototype.get_Value   = function()  { return this.Value; };
CHyperlinkProperty.prototype.put_Value   = function(v) { this.Value = v; };
CHyperlinkProperty.prototype.get_ToolTip = function()  { return this.ToolTip; };
CHyperlinkProperty.prototype.put_ToolTip = function(v) { this.ToolTip = v ? v.slice(0, Asc.c_oAscMaxTooltipLength) : v; };
CHyperlinkProperty.prototype.get_Text    = function()  { return this.Text; };
CHyperlinkProperty.prototype.put_Text    = function(v) { this.Text = v; };

asc_docs_api.prototype.sync_HyperlinkPropCallback = function(hyperProp)
{
    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject( c_oAscTypeSelectElement.Hyperlink, new CHyperlinkProperty( hyperProp ) );
};

asc_docs_api.prototype.sync_HyperlinkClickCallback = function(Url)
{
    this.asc_fireCallback("asc_onHyperlinkClick", Url);
};

asc_docs_api.prototype.sync_CanAddHyperlinkCallback = function(bCanAdd)
{
    //if ( true === CollaborativeEditing.Get_GlobalLock() )
    //    this.asc_fireCallback("asc_onCanAddHyperlink", false);
    //else
    this.asc_fireCallback("asc_onCanAddHyperlink", bCanAdd);
};

asc_docs_api.prototype.sync_DialogAddHyperlink = function()
{
    this.asc_fireCallback("asc_onDialogAddHyperlink");
};


asc_docs_api.prototype.GoToFooter = function(pageNumber)
{
    if (this.WordControl.m_oDrawingDocument.IsFreezePage(pageNumber))
        return;

    var oldClickCount = global_mouseEvent.ClickCount;
    global_mouseEvent.ClickCount = 2;
    this.WordControl.m_oLogicDocument.OnMouseDown(global_mouseEvent, 0, Page_Height, pageNumber);
    this.WordControl.m_oLogicDocument.OnMouseUp(global_mouseEvent, 0, Page_Height, pageNumber);

    this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();

    global_mouseEvent.ClickCount = oldClickCount;
};
asc_docs_api.prototype.sync_shapePropCallback = function(pr)
{
    var obj = AscFormat.CreateAscShapePropFromProp(pr);
    if (pr.fill != null && pr.fill.fill != null && pr.fill.fill.type == c_oAscFill.FILL_TYPE_BLIP)
    {
        this.WordControl.m_oDrawingDocument.DrawImageTextureFillShape(pr.fill.fill.RasterImageId);
    }
    else
    {
        this.WordControl.m_oDrawingDocument.DrawImageTextureFillShape(null);
    }

    var oTextArtProperties = pr.textArtProperties;
    if(oTextArtProperties && oTextArtProperties.Fill && oTextArtProperties.Fill.fill  && oTextArtProperties.Fill.fill.type == c_oAscFill.FILL_TYPE_BLIP)
    {
        this.WordControl.m_oDrawingDocument.DrawImageTextureFillTextArt(oTextArtProperties.Fill.fill.RasterImageId);
    }
    else
    {
        this.WordControl.m_oDrawingDocument.DrawImageTextureFillTextArt(null);
    }


    var _len = this.SelectedObjectsStack.length;
    if (_len > 0)
    {
        if (this.SelectedObjectsStack[_len - 1].Type == c_oAscTypeSelectElement.Shape)
        {
            this.SelectedObjectsStack[_len - 1].Value = obj;
            return;
        }
    }

    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject( c_oAscTypeSelectElement.Shape, obj );
};

asc_docs_api.prototype.sync_slidePropCallback = function(slide)
{
    if (!slide)
        return;

    var bg = slide.cSld.Bg;
    var obj = new CAscSlideProps();

    var bgFill = slide.backgroundFill;
  // if (slide.cSld && slide.cSld.Bg && slide.cSld.Bg.bgPr)
  //     bgFill = slide.cSld.Bg.bgPr.Fill;

    if(!bgFill)
    {
        obj.Background = new asc_CShapeFill();
        obj.Background.type = c_oAscFill.FILL_TYPE_NOFILL;

        this.WordControl.m_oDrawingDocument.DrawImageTextureFillSlide(null);
    }
    else
    {
        obj.Background = AscFormat.CreateAscFill(bgFill);

        if (bgFill != null && bgFill.fill != null && bgFill.fill.type == c_oAscFill.FILL_TYPE_BLIP)
        {
            this.WordControl.m_oDrawingDocument.DrawImageTextureFillSlide(bgFill.fill.RasterImageId);
        }
        else
        {
            this.WordControl.m_oDrawingDocument.DrawImageTextureFillSlide(null);
        }
    }

    obj.Timing = slide.timing;
    obj.lockDelete = !(slide.deleteLock.Lock.Type === locktype_Mine || slide.deleteLock.Lock.Type === locktype_None);
    obj.lockLayout = !(slide.layoutLock.Lock.Type === locktype_Mine || slide.layoutLock.Lock.Type === locktype_None);
    obj.lockTiming = !(slide.timingLock.Lock.Type === locktype_Mine || slide.timingLock.Lock.Type === locktype_None);
    obj.lockTranzition = !(slide.transitionLock.Lock.Type === locktype_Mine || slide.transitionLock.Lock.Type === locktype_None);
    obj.lockBackground = !(slide.backgroundLock.Lock.Type === locktype_Mine || slide.backgroundLock.Lock.Type === locktype_None);
    obj.lockRemove = obj.lockDelete ||
    obj.lockLayout ||
    obj.lockTiming ||
    obj.lockTranzition ||
        obj.lockBackground ||slide.isLockedObject() ;


    var _len = this.SelectedObjectsStack.length;
    if (_len > 0)
    {
        if (this.SelectedObjectsStack[_len - 1].Type == c_oAscTypeSelectElement.Slide)
        {
            this.SelectedObjectsStack[_len - 1].Value = obj;
            return;
        }
    }

    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject( c_oAscTypeSelectElement.Slide, obj );
};

asc_docs_api.prototype.ExitHeader_Footer = function(pageNumber)
{
    if (this.WordControl.m_oDrawingDocument.IsFreezePage(pageNumber))
        return;

    var oldClickCount = global_mouseEvent.ClickCount;
    global_mouseEvent.ClickCount = 2;
    this.WordControl.m_oLogicDocument.OnMouseDown(global_mouseEvent, 0, Page_Height / 2, pageNumber);
    this.WordControl.m_oLogicDocument.OnMouseUp(global_mouseEvent, 0, Page_Height / 2, pageNumber);

    this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
    
    global_mouseEvent.ClickCount = oldClickCount;
};

asc_docs_api.prototype.GetCurrentPixOffsetY = function()
{
    return this.WordControl.m_dScrollY;
};

asc_docs_api.prototype.SetPaintFormat = function(value)
{
    this.isPaintFormat = value;
    this.WordControl.m_oLogicDocument.Document_Format_Copy();
};

asc_docs_api.prototype.sync_PaintFormatCallback = function(value)
{
    this.isPaintFormat = value;
    return this.asc_fireCallback("asc_onPaintFormatChanged", value);
};
asc_docs_api.prototype.ClearFormating = function()
{
    this.WordControl.m_oLogicDocument.Paragraph_ClearFormatting();
};

window.ID_KEYBOARD_AREA = undefined;
window.ID_KEYBOARD_AREA;
asc_docs_api.prototype.SetDeviceInputHelperId = function(idKeyboard)
{
    if (window.ID_KEYBOARD_AREA === undefined && this.WordControl.m_oMainView != null)
    {
        window.ID_KEYBOARD_AREA = document.getElementById(idKeyboard);

        window.ID_KEYBOARD_AREA.onkeypress = function(e){
            if (false === editor.WordControl.IsFocus)
            {
                editor.WordControl.IsFocus = true;
                var ret = editor.WordControl.onKeyPress(e);
                editor.WordControl.IsFocus = false;
                return ret;
            }
        };
        window.ID_KEYBOARD_AREA.onkeydown = function(e){
            if (false === editor.WordControl.IsFocus)
            {
                editor.WordControl.IsFocus = true;
                var ret = editor.WordControl.onKeyDown(e);
                editor.WordControl.IsFocus = false;
                return ret;
            }
        };
    }
    window.ID_KEYBOARD_AREA.focus();
};
asc_docs_api.prototype.getViewMode = function() {
  return this.isViewMode;
};
asc_docs_api.prototype.asc_setViewMode = function(isViewMode) {
  if (isViewMode) {
    this.isViewMode = true;
    this.ShowParaMarks = false;
    this.WordControl.m_bIsRuler = false;
    this.WordControl.m_oDrawingDocument.ClearCachePages();
    this.WordControl.HideRulers();

    if (null != this.WordControl.m_oLogicDocument) {
      this.WordControl.m_oLogicDocument.viewMode = true;
    }
  } else {
    if (this.bInit_word_control === true && this.FontLoader.embedded_cut_manager.bIsCutFontsUse) {
      this.isLoadNoCutFonts = true;
      this.FontLoader.embedded_cut_manager.bIsCutFontsUse = false;
      this.FontLoader.LoadDocumentFonts(this.WordControl.m_oLogicDocument.Fonts, true);
      return;
    }

    if (this.bInit_word_control === true) {
      CollaborativeEditing.Apply_Changes();
      CollaborativeEditing.Release_Locks();
    }

    this.isUseEmbeddedCutFonts = false;

    this.isViewMode = false;
    this.WordControl.checkNeedRules();
    this.WordControl.m_oDrawingDocument.ClearCachePages();
    this.WordControl.OnResize(true);

    if (null != this.WordControl.m_oLogicDocument) {
      this.WordControl.m_oLogicDocument.viewMode = false;
    }
  }
};

asc_docs_api.prototype.SetUseEmbeddedCutFonts = function(bUse)
{
    this.isUseEmbeddedCutFonts = bUse;
};

asc_docs_api.prototype.can_AddHyperlink = function()
{
    var bCanAdd = this.WordControl.m_oLogicDocument.Hyperlink_CanAdd();
    if ( true === bCanAdd )
        return this.WordControl.m_oLogicDocument.Get_SelectedText(true);

    return false;
};
asc_docs_api.prototype.add_Hyperlink = function(HyperProps)
{
        this.WordControl.m_oLogicDocument.Hyperlink_Add( HyperProps );
};
asc_docs_api.prototype.sync_HyperlinkClickCallback = function(Url)
{
    var indAction = Url.indexOf("ppaction://hlink");
    if (0 == indAction)
    {
        if (Url == "ppaction://hlinkshowjump?jump=firstslide")
        {
            this.WordControl.GoToPage(0);
        }
        else if (Url == "ppaction://hlinkshowjump?jump=lastslide")
        {
            this.WordControl.GoToPage(this.WordControl.m_oDrawingDocument.SlidesCount - 1);
        }
        else if (Url == "ppaction://hlinkshowjump?jump=nextslide")
        {
            this.WordControl.onNextPage();
        }
        else if (Url == "ppaction://hlinkshowjump?jump=previousslide")
        {
            this.WordControl.onPrevPage();
        }
        else
        {
            var mask = "ppaction://hlinksldjumpslide";
            var indSlide = Url.indexOf(mask);
            if (0 == indSlide)
            {
                var slideNum = parseInt(Url.substring(mask.length));
                if (slideNum >= 0 && slideNum < this.WordControl.m_oDrawingDocument.SlidesCount)
                    this.WordControl.GoToPage(slideNum);
            }
        }
        return;
    }

    this.asc_fireCallback("asc_onHyperlinkClick", Url);
};

asc_docs_api.prototype.UpdateInterfaceState = function()
{
    if (this.WordControl.m_oLogicDocument != null)
    {
        this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
        this.WordControl.CheckLayouts(true);
    }
};

asc_docs_api.prototype.OnMouseUp = function(x, y)
{
    var _e = CreateMouseUpEventObject(x, y);
    Window_OnMouseUp(_e);

    //this.WordControl.onMouseUpExternal(x, y);
};

asc_docs_api.prototype.asyncImageEndLoaded2 = null;

asc_docs_api.prototype.ChangeTheme = function(indexTheme)
{
    if (true === CollaborativeEditing.Get_GlobalLock())
        return;

    if (!this.isViewMode && this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Theme) === false)
    {
        CollaborativeEditing.m_bGlobalLock = true;
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_ChangeTheme);
        this.ThemeLoader.StartLoadTheme(indexTheme);
    }
};

asc_docs_api.prototype.StartLoadTheme = function()
{
};
asc_docs_api.prototype.EndLoadTheme = function(theme_load_info)
{
    CollaborativeEditing.m_bGlobalLock = false;

    // применение темы
    var _array = this.WordControl.Thumbnails.GetSelectedArray();
    this.WordControl.m_oLogicDocument.changeTheme(theme_load_info, _array.length <= 1 ? null : _array);
    this.WordControl.ThemeGenerateThumbnails(theme_load_info.Master);
    // меняем шаблоны в меню
    this.WordControl.CheckLayouts();

    this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadTheme);
};

asc_docs_api.prototype.ChangeLayout = function(layout_index)
{
    var _array = this.WordControl.Thumbnails.GetSelectedArray();

    var _master = this.WordControl.MasterLayouts;
    this.WordControl.m_oLogicDocument.changeLayout(_array, this.WordControl.MasterLayouts, layout_index);
};

asc_docs_api.prototype.put_ShapesAlign = function(type)
{
    switch (type)
    {
        case c_oAscAlignShapeType.ALIGN_LEFT:
        {
            this.shapes_alignLeft();
            break;
        }
        case c_oAscAlignShapeType.ALIGN_RIGHT:
        {
            this.shapes_alignRight();
            break;
        }
        case c_oAscAlignShapeType.ALIGN_TOP:
        {
            this.shapes_alignTop();
            break;
        }
        case c_oAscAlignShapeType.ALIGN_BOTTOM:
        {
            this.shapes_alignBottom();
            break;
        }
        case c_oAscAlignShapeType.ALIGN_CENTER:
        {
            this.shapes_alignCenter();
            break;
        }
        case c_oAscAlignShapeType.ALIGN_MIDDLE:
        {
            this.shapes_alignMiddle();
            break;
        }
        default:
            break;
    }
};
asc_docs_api.prototype.DistributeHorizontally = function()
{
    this.WordControl.m_oLogicDocument.distributeHor();
};
asc_docs_api.prototype.DistributeVertically = function()
{
    this.WordControl.m_oLogicDocument.distributeVer();
};
asc_docs_api.prototype.shapes_alignLeft = function()
{
    this.WordControl.m_oLogicDocument.alignLeft();
};

asc_docs_api.prototype.shapes_alignRight = function()
{
    this.WordControl.m_oLogicDocument.alignRight();
};

asc_docs_api.prototype.shapes_alignTop = function()
{
    this.WordControl.m_oLogicDocument.alignTop();

};

asc_docs_api.prototype.shapes_alignBottom = function()
{
    this.WordControl.m_oLogicDocument.alignBottom();

};

asc_docs_api.prototype.shapes_alignCenter = function()
{
    this.WordControl.m_oLogicDocument.alignCenter();
};

asc_docs_api.prototype.shapes_alignMiddle = function()
{
    this.WordControl.m_oLogicDocument.alignMiddle();
};

asc_docs_api.prototype.shapes_bringToFront = function()
{
    this.WordControl.m_oLogicDocument.bringToFront();
};

asc_docs_api.prototype.shapes_bringForward = function()
{
    this.WordControl.m_oLogicDocument.bringForward();
};

asc_docs_api.prototype.shapes_bringToBack = function()
{
    this.WordControl.m_oLogicDocument.sendToBack();
};

asc_docs_api.prototype.shapes_bringBackward = function()
{
    this.WordControl.m_oLogicDocument.bringBackward();
};

asc_docs_api.prototype.asc_setLoopShow = function(isLoop){
    this.WordControl.m_oLogicDocument.setShowLoop(isLoop);
};

asc_docs_api.prototype.sync_endDemonstration = function()
{
    this.asc_fireCallback("asc_onEndDemonstration");
};
asc_docs_api.prototype.sync_DemonstrationSlideChanged = function(slideNum)
{
    this.asc_fireCallback("asc_onDemonstrationSlideChanged", slideNum);
};

asc_docs_api.prototype.StartDemonstration = function(div_id, slidestart_num)
{
    this.WordControl.DemonstrationManager.Start(div_id, slidestart_num, true);
};

asc_docs_api.prototype.EndDemonstration = function(isNoUseFullScreen)
{
    this.WordControl.DemonstrationManager.End(isNoUseFullScreen);
};

asc_docs_api.prototype.DemonstrationPlay = function()
{
    this.WordControl.DemonstrationManager.Play();
};

asc_docs_api.prototype.DemonstrationPause = function()
{
    this.WordControl.DemonstrationManager.Pause();
};

asc_docs_api.prototype.DemonstrationEndShowMessage = function(message)
{
    this.WordControl.DemonstrationManager.EndShowMessage = message;
};

asc_docs_api.prototype.DemonstrationNextSlide = function()
{
    this.WordControl.DemonstrationManager.NextSlide();
};

asc_docs_api.prototype.DemonstrationPrevSlide = function()
{
    this.WordControl.DemonstrationManager.PrevSlide();
};

asc_docs_api.prototype.DemonstrationGoToSlide = function(slideNum)
{
    this.WordControl.DemonstrationManager.GoToSlide(slideNum);
};

asc_docs_api.prototype.ApplySlideTiming = function(oTiming)
{
    if(this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_SlideTiming) === false)
    {
        History.Create_NewPoint(AscDFH.historydescription_Presentation_ApplyTiming);
        var _count = this.WordControl.m_oDrawingDocument.SlidesCount;
        var _cur = this.WordControl.m_oDrawingDocument.SlideCurrent;
        if (_cur < 0 || _cur >= _count)
            return;
        var _curSlide = this.WordControl.m_oLogicDocument.Slides[_cur];
        _curSlide.applyTiming(oTiming);
    }
    this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
};
asc_docs_api.prototype.SlideTimingApplyToAll = function()
{

    if(this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_SlideTiming, {All: true}) === false)
    {
        History.Create_NewPoint(AscDFH.historydescription_Presentation_ApplyTimingToAll);
        var _count = this.WordControl.m_oDrawingDocument.SlidesCount;
        var _cur = this.WordControl.m_oDrawingDocument.SlideCurrent;
        var _slides = this.WordControl.m_oLogicDocument.Slides;
        if (_cur < 0 || _cur >= _count)
            return;
        var _curSlide = _slides[_cur];

        _curSlide.timing.makeDuplicate(this.WordControl.m_oLogicDocument.DefaultSlideTiming);
        var _default = this.WordControl.m_oLogicDocument.DefaultSlideTiming;

        for (var i = 0; i < _count; i++)
        {
            if (i == _cur)
                continue;

            _slides[i].applyTiming(_default);
        }
    }
};
asc_docs_api.prototype.SlideTransitionPlay = function()
{
    var _count = this.WordControl.m_oDrawingDocument.SlidesCount;
    var _cur = this.WordControl.m_oDrawingDocument.SlideCurrent;
    if (_cur < 0 || _cur >= _count)
        return;
    var _timing = this.WordControl.m_oLogicDocument.Slides[_cur].timing;

    var _tr     = this.WordControl.m_oDrawingDocument.TransitionSlide;
    _tr.Type    = _timing.TransitionType;
    _tr.Param   = _timing.TransitionOption;
    _tr.Duration = _timing.TransitionDuration;

    _tr.Start(true);
};

asc_docs_api.prototype.SetTextBoxInputMode = function(bIsEA)
{
    this.WordControl.SetTextBoxMode(bIsEA);
};
asc_docs_api.prototype.GetTextBoxInputMode = function()
{
    return this.WordControl.TextBoxInputMode;
};

asc_docs_api.prototype.sync_EndAddShape = function()
{
    editor.asc_fireCallback("asc_onEndAddShape");
    if (this.WordControl.m_oDrawingDocument.m_sLockedCursorType == "crosshair")
    {
        this.WordControl.m_oDrawingDocument.UnlockCursorType();
    }
};

// Вставка диаграмм
asc_docs_api.prototype.asc_getChartObject = function(type)
{
    this.isChartEditor = true;		// Для совместного редактирования
    return this.WordControl.m_oLogicDocument.Get_ChartObject(type);
};

asc_docs_api.prototype.asc_addChartDrawingObject = function(chartBinary)
{
    /**/

    // Приводим бинарик к объекту типа CChartAsGroup и добавляем объект
    if ( AscFormat.isObject(chartBinary) )
    {
        //if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) )
        {
            this.WordControl.m_oLogicDocument.addChart(chartBinary);
        }
    }
};

asc_docs_api.prototype.asc_editChartDrawingObject = function(chartBinary)
{
    /**/

    // Находим выделенную диаграмму и накатываем бинарник
    if ( AscCommon.isRealObject(chartBinary) )
    {
        this.WordControl.m_oLogicDocument.Edit_Chart(chartBinary["binary"]);
    }
};

asc_docs_api.prototype.sync_closeChartEditor = function()
{
    this.asc_fireCallback("asc_onCloseChartEditor");
};

//-----------------------------------------------------------------
// События контекстного меню
//-----------------------------------------------------------------

function CContextMenuData(oData)
{
    if(AscCommon.isRealObject(oData))
    {
        this.Type  = oData.Type;
        this.X_abs = oData.X_abs;
        this.Y_abs = oData.Y_abs;
        this.IsSlideSelect = oData.IsSlideSelect;
    }
    else
    {
        this.Type  = c_oAscContextMenuTypes.Main;
        this.X_abs = 0;
        this.Y_abs = 0;
        this.IsSlideSelect = true;
    }
}

CContextMenuData.prototype.get_Type  = function()  { return this.Type; };
CContextMenuData.prototype.get_X = function()  { return this.X_abs; };
CContextMenuData.prototype.get_Y = function()  { return this.Y_abs; };
CContextMenuData.prototype.get_IsSlideSelect = function()  { return this.IsSlideSelect; };

asc_docs_api.prototype.sync_ContextMenuCallback = function(Data)
{
    this.asc_fireCallback("asc_onContextMenu", Data);
};

asc_docs_api.prototype._onOpenCommand = function(data) {
  var t = this;
  AscCommon.openFileCommand(data, this.documentUrlChanges, c_oSerFormat.Signature, function (error, result) {
		if (error || !result.bSerFormat) {
			t.asc_fireCallback("asc_onError",c_oAscError.ID.Unknown,c_oAscError.Level.Critical);
			return;
		}

		t.OpenDocument2(result.url, result.data);
		t.DocumentOrientation = (null == t.WordControl.m_oLogicDocument) ? true : !t.WordControl.m_oLogicDocument.Orientation;
		t.sync_DocSizeCallback(Page_Width, Page_Height);
		t.sync_PageOrientCallback(t.get_DocumentOrientation());
	});
};
function _downloadAs(editor, filetype, actionType, options)
{
    if (!options) {
      options = {};
    }
    if (actionType) {
      editor.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, actionType);
    }
    
	var dataContainer = {data: null, part: null, index: 0, count: 0};
    var command = "save";
	var oAdditionalData = {};
	oAdditionalData["c"] = command;
	oAdditionalData["id"] = editor.documentId;
	oAdditionalData["userid"] = editor.documentUserId;
	oAdditionalData["vkey"] = editor.documentVKey;
	oAdditionalData["outputformat"] = filetype;
	oAdditionalData["title"] = AscCommon.changeFileExtention(editor.documentTitle, AscCommon.getExtentionByFormat(filetype));
	oAdditionalData["savetype"] = AscCommon.c_oAscSaveTypes.CompleteAll;
    if (DownloadType.Print === options.downloadType) {
      oAdditionalData["inline"] = 1;
    }
	if(c_oAscFileType.PDF == filetype)
	{
		var dd = editor.WordControl.m_oDrawingDocument;
		dataContainer.data = dd.ToRendererPart();
	}
	else
		dataContainer.data = editor.WordControl.SaveDocument();
    var fCallback = function(input) {
      var error = c_oAscError.ID.Unknown;
      if(null != input && command == input["type"]) {
        if('ok' == input["status"]){
          var url = input["data"];
          if(url) {
            error = c_oAscError.ID.No;
            editor.processSavedFile(url, options.downloadType);
          }
        } else {
          error = mapAscServerErrorToAscError(parseInt(input["data"]));
        }
      }
      if (c_oAscError.ID.No != error) {
        editor.asc_fireCallback("asc_onError", error, c_oAscError.Level.NoCritical);
      }
      if (actionType) {
        editor.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, actionType);
      }
    };
	editor.fCurCallback = fCallback;
  AscCommon.saveWithParts(function(fCallback1, oAdditionalData1, dataContainer1){sendCommand(editor, fCallback1, oAdditionalData1, dataContainer1);}, fCallback, null, oAdditionalData, dataContainer);
}

//test
window["asc_docs_api"] = asc_docs_api;
window["asc_docs_api"].prototype["asc_nativeOpenFile"] = function(base64File, version)
{
	this.SpellCheckUrl = '';

	this.User = new AscCommon.asc_CUser();
	this.User.setId("TM");
	this.User.setUserName("native");
	
	this.WordControl.m_bIsRuler = false;
	this.WordControl.Init();
	
	this.InitEditor();
	
	g_oIdCounter.Set_Load(true);

    var _loader = new AscCommon.BinaryPPTYLoader();
    _loader.Api = this;

    if (version === undefined)
    {
        _loader.Load(base64File, this.WordControl.m_oLogicDocument);
        _loader.Check_TextFit();
    }
    else
    {
        _loader.Load2(base64File, this.WordControl.m_oLogicDocument);
        _loader.Check_TextFit();
    }
    
    this.LoadedObject = 1;
    g_oIdCounter.Set_Load(false);
}

window["asc_docs_api"].prototype["asc_nativeCalculateFile"] = function()
{
    this.bNoSendComments = false;
    this.ShowParaMarks = false;
    
    var presentation = this.WordControl.m_oLogicDocument;
    presentation.Recalculate({Drawings: {All: true, Map: {}}});
    presentation.DrawingDocument.OnEndRecalculate();    
}

window["asc_docs_api"].prototype["asc_nativeApplyChanges"] = function(changes)
{
    var _len = changes.length;
	for (var i = 0; i < _len; i++)
	{
	    var Changes = new CCollaborativeChanges();
        Changes.Set_Data( changes[i]);
	    CollaborativeEditing.Add_Changes( Changes );
	}
	CollaborativeEditing.Apply_OtherChanges();
}

window["asc_docs_api"].prototype["asc_nativeApplyChanges2"] = function(data, isFull)
{
    // Чтобы заново созданные параграфы не отображались залоченными
    g_oIdCounter.Set_Load( true );

    var stream = new AscCommon.FT_Stream2(data, data.length);
    stream.obj = null;
    var Loader = { Reader : stream, Reader2 : null };
    var _color = new CDocumentColor( 191, 255, 199 );

    // Применяем изменения, пока они есть
    var _count = Loader.Reader.GetLong();

    var _pos = 4;
    for (var i = 0; i < _count; i++)
    {
        if (window["NATIVE_EDITOR_ENJINE"] === true && window["native"]["CheckNextChange"])
        {
            if (!window["native"]["CheckNextChange"]())
                break;
        }

        var _len = Loader.Reader.GetLong();
        _pos += 4;
        stream.size = _pos + _len;

        var _id  = Loader.Reader.GetString2();
        var _read_pos = Loader.Reader.GetCurPos();

        var Type = Loader.Reader.GetLong();
        var Class = null;

        if ( AscDFH.historyitem_type_HdrFtr === Type )
        {
            Class = editor.WordControl.m_oLogicDocument.HdrFtr;
        }
        else
            Class = g_oTableId.Get_ById( _id );

        stream.Seek(_read_pos);
        stream.Seek2(_read_pos);

        if ( null != Class )
            Class.Load_Changes( Loader.Reader, Loader.Reader2, _color );

        _pos += _len;
        stream.Seek2(_pos);
        stream.size = data.length;
    }

    if (isFull)
    {
        CollaborativeEditing.m_aChanges = [];

        // У новых элементов выставляем указатели на другие классы
        CollaborativeEditing.Apply_LinkData();

        // Делаем проверки корректности новых изменений
        CollaborativeEditing.Check_MergeData();

        CollaborativeEditing.OnEnd_ReadForeignChanges();
    }

    g_oIdCounter.Set_Load( false );
}

window["asc_docs_api"].prototype["asc_nativeGetFile"] = function()
{
	var writer = new CBinaryFileWriter();
    this.WordControl.m_oLogicDocument.CalculateComments();
    return writer.WriteDocument(this.WordControl.m_oLogicDocument);
}

window["asc_docs_api"].prototype["asc_nativeGetFileData"] = function()
{
    var writer = new CBinaryFileWriter();
    this.WordControl.m_oLogicDocument.CalculateComments();
    writer.WriteDocument2(this.WordControl.m_oLogicDocument);

    var _header = "PPTY;v1;" + writer.pos + ";";
    window["native"]["Save_End"](_header, writer.pos);

    return writer.ImData.data;
}

window["asc_docs_api"].prototype["asc_nativeCheckPdfRenderer"] = function(_memory1, _memory2)
{
	if (true)
	{
		// pos не должен минимизироваться!!!

		_memory1.Copy           = _memory1["Copy"];
		_memory1.ClearNoAttack  = _memory1["ClearNoAttack"];
		_memory1.WriteByte      = _memory1["WriteByte"];
		_memory1.WriteBool      = _memory1["WriteBool"];
		_memory1.WriteLong      = _memory1["WriteLong"];
		_memory1.WriteDouble    = _memory1["WriteDouble"];
		_memory1.WriteString    = _memory1["WriteString"];
		_memory1.WriteString2   = _memory1["WriteString2"];
		
		_memory2.Copy           = _memory1["Copy"];
		_memory2.ClearNoAttack  = _memory1["ClearNoAttack"];
		_memory2.WriteByte      = _memory1["WriteByte"];
		_memory2.WriteBool      = _memory1["WriteBool"];
		_memory2.WriteLong      = _memory1["WriteLong"];
		_memory2.WriteDouble    = _memory1["WriteDouble"];
		_memory2.WriteString    = _memory1["WriteString"];
		_memory2.WriteString2   = _memory1["WriteString2"];
	}
	
	var _printer = new AscCommon.CDocumentRenderer();
	_printer.Memory				    = _memory1;
	_printer.VectorMemoryForPrint	= _memory2;
	return _printer;
},

window["asc_docs_api"].prototype["asc_nativeCalculate"] = function()
{
}

window["asc_docs_api"].prototype["asc_nativePrint"] = function(_printer, _page)
{
    if (undefined === _printer && _page === undefined)
    {
        if (undefined !== window["AscDesktopEditor"])
        {
            var _drawing_document = this.WordControl.m_oDrawingDocument;
            var pagescount = _drawing_document.SlidesCount;

            window["AscDesktopEditor"]["Print_Start"](this.DocumentUrl, pagescount, this.ThemeLoader.ThemesUrl, this.getCurrentPage());

            var oDocRenderer = new AscCommon.CDocumentRenderer();
            oDocRenderer.VectorMemoryForPrint = new AscCommon.CMemory();
            var bOldShowMarks = this.ShowParaMarks;
            this.ShowParaMarks = false;
            oDocRenderer.IsNoDrawingEmptyPlaceholder = true;

            for (var i = 0; i < pagescount; i++)
            {
                oDocRenderer.Memory.Seek(0);
                oDocRenderer.VectorMemoryForPrint.ClearNoAttack();

                oDocRenderer.BeginPage(_drawing_document.m_oLogicDocument.Width, _drawing_document.m_oLogicDocument.Height);
                this.WordControl.m_oLogicDocument.DrawPage(i, oDocRenderer);
                oDocRenderer.EndPage();

                window["AscDesktopEditor"]["Print_Page"](oDocRenderer.Memory.GetBase64Memory(), _drawing_document.m_oLogicDocument.Width, _drawing_document.m_oLogicDocument.Height);
            }

            if (0 == pagescount)
            {
                oDocRenderer.BeginPage(_drawing_document.m_oLogicDocument.Width, _drawing_document.m_oLogicDocument.Height);
                oDocRenderer.EndPage();

                window["AscDesktopEditor"]["Print_Page"](oDocRenderer.Memory.GetBase64Memory());
            }

            this.ShowParaMarks = bOldShowMarks;

            window["AscDesktopEditor"]["Print_End"]();
        }
        return;
    }

	var _logic_doc = this.WordControl.m_oLogicDocument;
    _printer.BeginPage(_logic_doc.Width, _logic_doc.Height);
    _logic_doc.DrawPage(_page, _printer);
    _printer.EndPage();
}

window["asc_docs_api"].prototype["asc_nativePrintPagesCount"] = function()
{
	return this.WordControl.m_oDrawingDocument.SlidesCount;
}

window["asc_docs_api"].prototype["asc_nativeGetPDF"] = function()
{
    var pagescount = this["asc_nativePrintPagesCount"]();

    var _renderer = new AscCommon.CDocumentRenderer();
    _renderer.VectorMemoryForPrint = new AscCommon.CMemory();
    var _bOldShowMarks = this.ShowParaMarks;
    this.ShowParaMarks = false;
    _renderer.IsNoDrawingEmptyPlaceholder = true;

    for (var i = 0; i < pagescount; i++)
    {
        this["asc_nativePrint"](_renderer, i);
    }

    this.ShowParaMarks = _bOldShowMarks;

    window["native"]["Save_End"]("", _renderer.Memory.GetCurPosition());

    return _renderer.Memory.data;
};

window["AscDesktopEditor_Save"] = function()
{
    return editor.asc_Save(false);
};