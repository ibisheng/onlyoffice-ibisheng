/*
 * (c) Copyright Ascensio System SIA 2010-2017
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

"use strict";

(function(window, document)
{

	// Import
	var c_oAscAdvancedOptionsAction = AscCommon.c_oAscAdvancedOptionsAction;
	var DownloadType                = AscCommon.DownloadType;
	var locktype_None               = AscCommon.locktype_None;
	var locktype_Mine               = AscCommon.locktype_Mine;
	var locktype_Other              = AscCommon.locktype_Other;
	var locktype_Other2             = AscCommon.locktype_Other2;
	var locktype_Other3             = AscCommon.locktype_Other3;
	var changestype_Drawing_Props   = AscCommon.changestype_Drawing_Props;
	var asc_CSelectedObject         = AscCommon.asc_CSelectedObject;
	var g_oDocumentUrls             = AscCommon.g_oDocumentUrls;
	var sendCommand                 = AscCommon.sendCommand;
	var mapAscServerErrorToAscError = AscCommon.mapAscServerErrorToAscError;
	var g_oIdCounter                = AscCommon.g_oIdCounter;
	var g_oTableId                  = AscCommon.g_oTableId;
	var PasteElementsId             = null;
	var global_mouseEvent           = null;
	var History                     = null;

	var c_oAscError             = Asc.c_oAscError;
	var c_oAscFileType          = Asc.c_oAscFileType;
	var c_oAscAsyncAction       = Asc.c_oAscAsyncAction;
	var c_oAscAdvancedOptionsID = Asc.c_oAscAdvancedOptionsID;
	var c_oAscAsyncActionType   = Asc.c_oAscAsyncActionType;
	var c_oAscTypeSelectElement = Asc.c_oAscTypeSelectElement;
	var c_oAscFill              = Asc.c_oAscFill;
	var asc_CShapeFill          = Asc.asc_CShapeFill;
	var asc_CFillBlip           = Asc.asc_CFillBlip;

	function CAscSlideProps()
	{
		this.Background     = null;
		this.Timing         = null;
		this.lockDelete     = null;
		this.lockLayout     = null;
		this.lockTiming     = null;
		this.lockBackground = null;
		this.lockTranzition = null;
		this.lockRemove     = null;
	}

	CAscSlideProps.prototype.get_background     = function()
	{
		return this.Background;
	};
	CAscSlideProps.prototype.put_background     = function(v)
	{
		this.Background = v;
	};
	CAscSlideProps.prototype.get_timing         = function()
	{
		return this.Timing;
	};
	CAscSlideProps.prototype.put_timing         = function(v)
	{
		this.Timing = v;
	};
	CAscSlideProps.prototype.get_LockDelete     = function()
	{
		return this.lockDelete;
	};
	CAscSlideProps.prototype.put_LockDelete     = function(v)
	{
		this.lockDelete = v;
	};
	CAscSlideProps.prototype.get_LockLayout     = function()
	{
		return this.lockLayout;
	};
	CAscSlideProps.prototype.put_LockLayout     = function(v)
	{
		this.lockLayout = v;
	};
	CAscSlideProps.prototype.get_LockTiming     = function()
	{
		return this.lockTiming;
	};
	CAscSlideProps.prototype.put_LockTiming     = function(v)
	{
		this.lockTiming = v;
	};
	CAscSlideProps.prototype.get_LockBackground = function()
	{
		return this.lockBackground;
	};
	CAscSlideProps.prototype.put_LockBackground = function(v)
	{
		this.lockBackground = v;
	};
	CAscSlideProps.prototype.get_LockTranzition = function()
	{
		return this.lockTranzition;
	};
	CAscSlideProps.prototype.put_LockTranzition = function(v)
	{
		this.lockTranzition = v;
	};
	CAscSlideProps.prototype.get_LockRemove     = function()
	{
		return this.lockRemove;
	};
	CAscSlideProps.prototype.put_LockRemove     = function(v)
	{
		this.lockRemove = v;
	};

	function CAscChartProp(obj)
	{
		if (obj)
		{

			this.Width    = (undefined != obj.w) ? obj.w : undefined;
			this.Height   = (undefined != obj.h) ? obj.h : undefined;
			this.Position = new Asc.CPosition({X : obj.x, Y : obj.y});

			this.Locked          = (undefined != obj.locked) ? obj.locked : false;
			this.lockAspect      = (undefined != obj.lockAspect) ? obj.lockAspect : false;
			this.ChartProperties = (undefined != obj.chartProps) ? obj.chartProps : null;

			this.severalCharts      = obj.severalCharts != undefined ? obj.severalCharts : false;
			this.severalChartTypes  = obj.severalChartTypes != undefined ? obj.severalChartTypes : undefined;
			this.severalChartStyles = obj.severalChartStyles != undefined ? obj.severalChartStyles : undefined;

			this.title = obj.title != undefined ? obj.title : undefined;
			this.description = obj.description != undefined ? obj.description : undefined;
		}
		else
		{
			this.Width           = undefined;
			this.Height          = undefined;
			this.Position        = undefined;
			this.Locked          = false;
			this.lockAspect      = false;
			this.ChartProperties = new AscCommon.asc_ChartSettings();

			this.severalCharts      = false;
			this.severalChartTypes  = undefined;
			this.severalChartStyles = undefined;
            this.title = undefined;
            this.description = undefined;
		}
	}

	CAscChartProp.prototype.get_ChangeLevel = function()
	{
		return this.ChangeLevel;
	};
	CAscChartProp.prototype.put_ChangeLevel = function(v)
	{
		this.ChangeLevel = v;
	};

	CAscChartProp.prototype.get_CanBeFlow     = function()
	{
		return this.CanBeFlow;
	};
	CAscChartProp.prototype.get_Width         = function()
	{
		return this.Width;
	};
	CAscChartProp.prototype.put_Width         = function(v)
	{
		this.Width = v;
	};
	CAscChartProp.prototype.get_Height        = function()
	{
		return this.Height;
	};
	CAscChartProp.prototype.put_Height        = function(v)
	{
		this.Height = v;
	};
	CAscChartProp.prototype.get_WrappingStyle = function()
	{
		return this.WrappingStyle;
	};
	CAscChartProp.prototype.put_WrappingStyle = function(v)
	{
		this.WrappingStyle = v;
	};
	// Возвращается объект класса Asc.asc_CPaddings
	CAscChartProp.prototype.get_Paddings      = function()
	{
		return this.Paddings;
	};
	// Аргумент объект класса Asc.asc_CPaddings
	CAscChartProp.prototype.put_Paddings      = function(v)
	{
		this.Paddings = v;
	};
	CAscChartProp.prototype.get_AllowOverlap  = function()
	{
		return this.AllowOverlap;
	};
	CAscChartProp.prototype.put_AllowOverlap  = function(v)
	{
		this.AllowOverlap = v;
	};
	// Возвращается объект класса CPosition
	CAscChartProp.prototype.get_Position      = function()
	{
		return this.Position;
	};
	// Аргумент объект класса CPosition
	CAscChartProp.prototype.put_Position      = function(v)
	{
		this.Position = v;
	};
	CAscChartProp.prototype.get_PositionH     = function()
	{
		return this.PositionH;
	};
	CAscChartProp.prototype.put_PositionH     = function(v)
	{
		this.PositionH = v;
	};
	CAscChartProp.prototype.get_PositionV     = function()
	{
		return this.PositionV;
	};
	CAscChartProp.prototype.put_PositionV     = function(v)
	{
		this.PositionV = v;
	};
	CAscChartProp.prototype.get_Value_X       = function(RelativeFrom)
	{
		if (null != this.Internal_Position) return this.Internal_Position.Calculate_X_Value(RelativeFrom);
		return 0;
	};
	CAscChartProp.prototype.get_Value_Y       = function(RelativeFrom)
	{
		if (null != this.Internal_Position) return this.Internal_Position.Calculate_Y_Value(RelativeFrom);
		return 0;
	};

	CAscChartProp.prototype.get_ImageUrl     = function()
	{
		return this.ImageUrl;
	};
	CAscChartProp.prototype.put_ImageUrl     = function(v)
	{
		this.ImageUrl = v;
	};
	CAscChartProp.prototype.get_Group        = function()
	{
		return this.Group;
	};
	CAscChartProp.prototype.put_Group        = function(v)
	{
		this.Group = v;
	};
	CAscChartProp.prototype.asc_getFromGroup = function()
	{
		return this.fromGroup;
	};
	CAscChartProp.prototype.asc_putFromGroup = function(v)
	{
		this.fromGroup = v;
	};

	CAscChartProp.prototype.get_isChartProps = function()
	{
		return this.isChartProps;
	};
	CAscChartProp.prototype.put_isChartPross = function(v)
	{
		this.isChartProps = v;
	};

	CAscChartProp.prototype.get_SeveralCharts     = function()
	{
		return this.severalCharts;
	};
	CAscChartProp.prototype.put_SeveralCharts     = function(v)
	{
		this.severalCharts = v;
	};
	CAscChartProp.prototype.get_SeveralChartTypes = function()
	{
		return this.severalChartTypes;
	};
	CAscChartProp.prototype.put_SeveralChartTypes = function(v)
	{
		this.severalChartTypes = v;
	};

	CAscChartProp.prototype.get_SeveralChartStyles = function()
	{
		return this.severalChartStyles;
	};
	CAscChartProp.prototype.put_SeveralChartStyles = function(v)
	{
		this.severalChartStyles = v;
	};

	CAscChartProp.prototype.get_VerticalTextAlign = function()
	{
		return this.verticalTextAlign;
	};
	CAscChartProp.prototype.put_VerticalTextAlign = function(v)
	{
		this.verticalTextAlign = v;
	};

	CAscChartProp.prototype.get_Locked = function()
	{
		return this.Locked;
	};

	CAscChartProp.prototype.get_ChartProperties = function()
	{
		return this.ChartProperties;
	};

	CAscChartProp.prototype.put_ChartProperties = function(v)
	{
		this.ChartProperties = v;
	};

	CAscChartProp.prototype.get_ShapeProperties = function()
	{
		return this.ShapeProperties;
	};

	CAscChartProp.prototype.put_ShapeProperties = function(v)
	{
		this.ShapeProperties = v;
	};

	CAscChartProp.prototype.asc_getType    = function()
	{
		return this.ChartProperties.asc_getType();
	};
	CAscChartProp.prototype.asc_getSubType = function()
	{
		return this.ChartProperties.asc_getSubType();
	};

	CAscChartProp.prototype.asc_getStyleId = function()
	{
		return this.ChartProperties.asc_getStyleId();
	};

	CAscChartProp.prototype.asc_getHeight = function()
	{
		return this.Height;
	};
	CAscChartProp.prototype.asc_getWidth  = function()
	{
		return this.Width;
	};

	CAscChartProp.prototype.asc_setType    = function(v)
	{
		this.ChartProperties.asc_setType(v);
	};
	CAscChartProp.prototype.asc_setSubType = function(v)
	{
		this.ChartProperties.asc_setSubType(v);
	};

	CAscChartProp.prototype.asc_setStyleId = function(v)
	{
		this.ChartProperties.asc_setStyleId(v);
	};

	CAscChartProp.prototype.asc_setHeight = function(v)
	{
		this.Height = v;
	};
	CAscChartProp.prototype.asc_setWidth  = function(v)
	{
		this.Width = v;
	};

	CAscChartProp.prototype.asc_setTitle = function(v)
	{
		this.title = v;
	};
	CAscChartProp.prototype.asc_setDescription  = function(v)
	{
		this.description = v;
	};

	CAscChartProp.prototype.asc_getTitle = function()
	{
		return this.title;
	};
	CAscChartProp.prototype.asc_getDescription  = function()
	{
		return this.description;
	};

	CAscChartProp.prototype.getType = function()
	{
		return this.ChartProperties && this.ChartProperties.getType();
	};
	CAscChartProp.prototype.putType = function(v)
	{
		return this.ChartProperties && this.ChartProperties.putType(v);
	};

	CAscChartProp.prototype.getStyle      = function()
	{
		return this.ChartProperties && this.ChartProperties.getStyle();
	};
	CAscChartProp.prototype.putStyle      = function(v)
	{
		return this.ChartProperties && this.ChartProperties.putStyle(v);
	};
	CAscChartProp.prototype.getLockAspect = function()
	{
		return this.lockAspect;
	};
	CAscChartProp.prototype.putLockAspect = function(v)
	{
		return this.lockAspect = v;
	};

	CAscChartProp.prototype.changeType = function(v)
	{
		return this.ChartProperties && this.ChartProperties.changeType(v);
	};

	function CDocInfoProp(obj)
	{
		if (obj)
		{
			this.PageCount      = obj.PageCount;
			this.WordsCount     = obj.WordsCount;
			this.ParagraphCount = obj.ParagraphCount;
			this.SymbolsCount   = obj.SymbolsCount;
			this.SymbolsWSCount = obj.SymbolsWSCount;
		}
		else
		{
			this.PageCount      = -1;
			this.WordsCount     = -1;
			this.ParagraphCount = -1;
			this.SymbolsCount   = -1;
			this.SymbolsWSCount = -1;
		}
	}

	CDocInfoProp.prototype.get_PageCount      = function()
	{
		return this.PageCount;
	};
	CDocInfoProp.prototype.put_PageCount      = function(v)
	{
		this.PageCount = v;
	};
	CDocInfoProp.prototype.get_WordsCount     = function()
	{
		return this.WordsCount;
	};
	CDocInfoProp.prototype.put_WordsCount     = function(v)
	{
		this.WordsCount = v;
	};
	CDocInfoProp.prototype.get_ParagraphCount = function()
	{
		return this.ParagraphCount;
	};
	CDocInfoProp.prototype.put_ParagraphCount = function(v)
	{
		this.ParagraphCount = v;
	};
	CDocInfoProp.prototype.get_SymbolsCount   = function()
	{
		return this.SymbolsCount;
	};
	CDocInfoProp.prototype.put_SymbolsCount   = function(v)
	{
		this.SymbolsCount = v;
	};
	CDocInfoProp.prototype.get_SymbolsWSCount = function()
	{
		return this.SymbolsWSCount;
	};
	CDocInfoProp.prototype.put_SymbolsWSCount = function(v)
	{
		this.SymbolsWSCount = v;
	};

	// CSearchResult - returns result of searching
	function CSearchResult(obj)
	{
		this.Object = obj;
	}

	CSearchResult.prototype.get_Text = function()
	{
		return this.Object.text;
	};

	CSearchResult.prototype.get_Navigator = function()
	{
		return this.Object.navigator;
	};

	CSearchResult.prototype.put_Navigator = function(obj)
	{
		this.Object.navigator = obj;
	};
	CSearchResult.prototype.put_Text      = function(obj)
	{
		this.Object.text = obj;
	};

	/**
	 *
	 * @param config
	 * @constructor
	 * @extends {AscCommon.baseEditorsApi}
	 */
	function asc_docs_api(config)
	{
		asc_docs_api.superclass.constructor.call(this, config, AscCommon.c_oEditorId.Presentation);

		/************ private!!! **************/
		this.WordControl = null;

		this.documentFormatSave = c_oAscFileType.PPTX;

		this.ThemeLoader   = null;
		this.tmpThemesPath = null;
		this.tmpIsFreeze   = null;
		this.tmpSlideDiv   = null;
		this.tmpTextArtDiv = null;
		this.tmpViewRulers = null;
		this.tmpZoomType   = null;

		this.DocumentUrl     = "";
		this.bNoSendComments = false;

		this.isApplyChangesOnOpen        = false;
		this.isApplyChangesOnOpenEnabled = true;

		this.IsSupportEmptyPresentation = true;

		this.ShowParaMarks        = false;
		this.ShowSnapLines        = true;
		this.isAddSpaceBetweenPrg = false;
		this.isPageBreakBefore    = false;
		this.isKeepLinesTogether  = false;
		this.isPresentationEditor = true;
		this.bAlignBySelected     = false;

		this.isPaintFormat              = false;
		this.isShowTableEmptyLine       = false;//true;
		this.isShowTableEmptyLineAttack = false;//true;

		this.bInit_word_control = false;
		this.isDocumentModify   = false;

		this.isImageChangeUrl      = false;
		this.isShapeImageChangeUrl = false;
		this.isSlideImageChangeUrl = false;

		this.isPasteFonts_Images = false;

		this.isLoadNoCutFonts = false;

		this.nCurPointItemsLength = -1;

		this.pasteCallback       = null;
		this.pasteImageMap       = null;
		this.EndActionLoadImages = 0;

		this.isSaveFonts_Images = false;
		this.saveImageMap       = null;

		this.ServerImagesWaitComplete = false;

		this.ParcedDocument              = false;
		this.isStartCoAuthoringOnEndLoad = false;	// Подсоединились раньше, чем документ загрузился

		this.DocumentOrientation = false;

		this.SelectedObjectsStack = [];

		this.CoAuthoringApi.isPowerPoint = true;

		// объекты, нужные для отправки в тулбар (шрифты, стили)
		this._gui_editor_themes   = null;
		this._gui_document_themes = null;

		this.EndShowMessage = undefined;

		this.isOnlyDemonstration = false;

		if (window.editor == undefined)
		{
			window.editor = this;
			window.editor;
			window['editor'] = window.editor;

			if (window["NATIVE_EDITOR_ENJINE"])
				editor = window.editor;
		}

		this._init();
	}

	AscCommon.extendClass(asc_docs_api, AscCommon.baseEditorsApi);

	asc_docs_api.prototype.sendEvent = function()
	{
		var name = arguments[0];
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

	/////////////////////////////////////////////////////////////////////////
	///////////////////CoAuthoring and Chat api//////////////////////////////
	/////////////////////////////////////////////////////////////////////////
	// Init CoAuthoring
	asc_docs_api.prototype._coAuthoringSetChange = function(change, oColor)
	{
		var oChange = new AscCommon.CCollaborativeChanges();
		oChange.Set_Data(change);
		oChange.Set_Color(oColor);
		AscCommon.CollaborativeEditing.Add_Changes(oChange);
	};

	asc_docs_api.prototype._coAuthoringSetChanges = function(e, oColor)
	{
		var Count = e.length;
		for (var Index = 0; Index < Count; ++Index)
			this._coAuthoringSetChange(e[Index], oColor);
	};

	asc_docs_api.prototype._coAuthoringInitEnd = function()
	{
		var t                                        = this;
		this.CoAuthoringApi.onCursor                 = function(e)
		{
			if (true === AscCommon.CollaborativeEditing.Is_Fast())
			{
				t.WordControl.m_oLogicDocument.Update_ForeignCursor(e[e.length - 1]['cursor'], e[e.length - 1]['user'], true, e[e.length - 1]['useridoriginal']);
			}
		};
		this.CoAuthoringApi.onConnectionStateChanged = function(e)
		{
			if (true === AscCommon.CollaborativeEditing.Is_Fast() && false === e['state'])
			{
				editor.WordControl.m_oLogicDocument.Remove_ForeignCursor(e['id']);
			}
			t.sendEvent("asc_onConnectionStateChanged", e);
		};
		this.CoAuthoringApi.onLocksAcquired          = function(e)
		{
			if (t.isApplyChangesOnOpenEnabled)
			{
				// Пока документ еще не загружен, будем сохранять функцию и аргументы
				t.arrPreOpenLocksObjects.push(function()
				{
					t.CoAuthoringApi.onLocksAcquired(e);
				});
				return;
			}

			if (2 != e["state"])
			{

				var block_value = e["blockValue"];
				var classes     = [];
				switch (block_value["type"])
				{
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

				for (var i = 0; i < classes.length; ++i)
				{
					var Class = g_oTableId.Get_ById(classes[i]);// g_oTableId.Get_ById( Id );
					if (null != Class)
					{
						var Lock = Class.Lock;

						var OldType = Class.Lock.Get_Type();
						if (locktype_Other2 === OldType || locktype_Other3 === OldType)
						{
							Lock.Set_Type(locktype_Other3, true);
						}
						else
						{
							Lock.Set_Type(locktype_Other, true);
						}
						if (Class instanceof AscCommonSlide.PropLocker)
						{
							var object = g_oTableId.Get_ById(Class.objectId);
							if (object instanceof AscCommonSlide.Slide && Class === object.deleteLock)
							{
								editor.WordControl.m_oLogicDocument.DrawingDocument.LockSlide(object.num);
							}
						}
						// Выставляем ID пользователя, залочившего данный элемент
						Lock.Set_UserId(e["user"]);

						if (Class instanceof AscCommonSlide.PropLocker)
						{
							var object = g_oTableId.Get_ById(Class.objectId);
							if (object instanceof AscCommonSlide.CPresentation)
							{
								if (Class === editor.WordControl.m_oLogicDocument.themeLock)
								{
									editor.sendEvent("asc_onLockDocumentTheme");
								}
								else if (Class === editor.WordControl.m_oLogicDocument.schemeLock)
								{
									editor.sendEvent("asc_onLockDocumentSchema");
								}
								else if (Class === editor.WordControl.m_oLogicDocument.slideSizeLock)
								{
									editor.sendEvent("asc_onLockDocumentProps");
								}
							}
						}
						if (Class instanceof AscCommon.CComment)
						{
							editor.sync_LockComment(Class.Get_Id(), e["user"]);
						}

						// TODO: Здесь для ускорения надо сделать проверку, является ли текущим элемент с
						//       заданным Id. Если нет, тогда и не надо обновлять состояние.
						editor.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
					}
					else
					{
						if (classes[i].indexOf("new_object") > -1 && block_value["type"] === c_oAscLockTypeElemPresentation.Object)
						{
							var slide_id    = block_value["slideId"];
							var delete_lock = g_oTableId.Get_ById(slide_id);
							if (AscCommon.isRealObject(delete_lock))
							{
								var Lock    = delete_lock.Lock;
								var OldType = Lock.Get_Type();
								if (locktype_Other2 === OldType || locktype_Other3 === OldType)
								{
									Lock.Set_Type(locktype_Other3, true);
								}
								else
								{
									Lock.Set_Type(locktype_Other, true);
								}
								editor.WordControl.m_oLogicDocument.DrawingDocument.LockSlide(g_oTableId.Get_ById(delete_lock.objectId).num);
							}
							else
							{
								AscCommon.CollaborativeEditing.Add_NeedLock(slide_id, e["user"]);
							}
						}
						else
						{
							AscCommon.CollaborativeEditing.Add_NeedLock(classes[i], e["user"]);
						}
					}
				}
			}
		};
		this.CoAuthoringApi.onLocksReleased          = function(e, bChanges)
		{
			if (t.isApplyChangesOnOpenEnabled)
			{
				// Пока документ еще не загружен, будем сохранять функцию и аргументы
				t.arrPreOpenLocksObjects.push(function()
				{
					t.CoAuthoringApi.onLocksReleased(e, bChanges);
				});
				return;
			}

			var Id;
			var block_value = e["block"];
			var classes     = [];
			switch (block_value["type"])
			{
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
			for (var i = 0; i < classes.length; ++i)
			{
				Id        = classes[i];
				var Class = g_oTableId.Get_ById(Id);
				if (null != Class)
				{
					var Lock = Class.Lock;

					if ("undefined" != typeof(Lock))
					{
						var CurType = Lock.Get_Type();

						var NewType = locktype_None;

						if (CurType === locktype_Other)
						{
							if (true != bChanges)
							{
								NewType = locktype_None;
							}
							else
							{
								NewType = locktype_Other2;
								AscCommon.CollaborativeEditing.Add_Unlock(Class);
							}
						}
						else if (CurType === locktype_Mine)
						{
							// Такого быть не должно
							NewType = locktype_Mine;
						}
						else if (CurType === locktype_Other2 || CurType === locktype_Other3)
						{
							NewType = locktype_Other2;
						}

						Lock.Set_Type(NewType, true);
						if (Class instanceof AscCommonSlide.PropLocker)
						{
							var object = g_oTableId.Get_ById(Class.objectId);
							if (object instanceof AscCommonSlide.Slide && Class === object.deleteLock)
							{
								if (NewType !== locktype_Mine && NewType !== locktype_None)
								{
									editor.WordControl.m_oLogicDocument.DrawingDocument.LockSlide(object.num);
								}
								else
								{
									editor.WordControl.m_oLogicDocument.DrawingDocument.UnLockSlide(object.num);
								}
							}
							if (object instanceof AscCommonSlide.CPresentation)
							{
								if (Class === object.themeLock)
								{
									if (NewType !== locktype_Mine && NewType !== locktype_None)
									{
										editor.sendEvent("asc_onLockDocumentTheme");
									}
									else
									{
										editor.sendEvent("asc_onUnLockDocumentTheme");
									}
								}
								if (Class === object.slideSizeLock)
								{
									if (NewType !== locktype_Mine && NewType !== locktype_None)
									{
										editor.sendEvent("asc_onLockDocumentProps");
									}
									else
									{
										editor.sendEvent("asc_onUnLockDocumentProps");
									}
								}
							}

						}

					}
				}
				else
				{
					AscCommon.CollaborativeEditing.Remove_NeedLock(Id);
				}
			}
		};
		this.CoAuthoringApi.onSaveChanges            = function(e, userId, bFirstLoad)
		{
			// bSendEvent = false - это означает, что мы загружаем имеющиеся изменения при открытии
			var Changes = new AscCommon.CCollaborativeChanges();
			Changes.Set_Data(e);
			AscCommon.CollaborativeEditing.Add_Changes(Changes);

			// т.е. если bSendEvent не задан, то посылаем  сообщение + когда загрузился документ
			if (!bFirstLoad && t.bInit_word_control)
			{
				t.sync_CollaborativeChanges();
			}
		};
		this.CoAuthoringApi.onRecalcLocks            = function(e)
		{
			if (e && true === AscCommon.CollaborativeEditing.Is_Fast())
			{
				var CursorInfo = JSON.parse(e);
				AscCommon.CollaborativeEditing.Add_ForeignCursorToUpdate(CursorInfo.UserId, CursorInfo.CursorInfo, CursorInfo.UserShortId);
			}
		};
		this.CoAuthoringApi.onStartCoAuthoring       = function(isStartEvent)
		{
			if (t.ParcedDocument) {
				if (isStartEvent) {
					AscCommon.CollaborativeEditing.Start_CollaborationEditing();
					t.asc_setDrawCollaborationMarks(true);
					t.WordControl.m_oLogicDocument.DrawingDocument.Start_CollaborationEditing();
				} else {
					// Сохранять теперь должны на таймере автосохранения. Иначе могли два раза запустить сохранение, не дожидаясь окончания
					t.canUnlockDocument = true;
					t.canStartCoAuthoring = true;
				}
			} else {
				t.isStartCoAuthoringOnEndLoad = true;
				if (!isStartEvent) {
					// Документ еще не подгрузился, но нужно сбросить lock
					t.CoAuthoringApi.unLockDocument(false, true);
				}
			}
		};
		this.CoAuthoringApi.onEndCoAuthoring         = function(isStartEvent)
		{
			AscCommon.CollaborativeEditing.End_CollaborationEditing();

			if (false != t.WordControl.m_oLogicDocument.DrawingDocument.IsLockObjectsEnable)
			{
				t.WordControl.m_oLogicDocument.DrawingDocument.IsLockObjectsEnable = false;
				t.WordControl.m_oLogicDocument.DrawingDocument.FirePaint();
			}
		};
	};


	asc_docs_api.prototype.pre_Save = function(_images)
	{
		this.isSaveFonts_Images = true;
		this.saveImageMap       = _images;
		this.WordControl.m_oDrawingDocument.CheckFontNeeds();
		this.FontLoader.LoadDocumentFonts2(this.WordControl.m_oLogicDocument.Fonts);
	};

    asc_docs_api.prototype.asc_GetRevisionsChangesStack = function()
	{
		return [];
	};

	asc_docs_api.prototype.asc_SetFastCollaborative = function(isOn)
	{
		if (AscCommon.CollaborativeEditing)
			AscCommon.CollaborativeEditing.Set_Fast(isOn);
	};

	asc_docs_api.prototype.sync_CollaborativeChanges = function()
	{
		if (true !== AscCommon.CollaborativeEditing.Is_Fast())
			this.sendEvent("asc_onCollaborativeChanges");
	};

	asc_docs_api.prototype.asyncServerIdEndLoaded = function()
	{
		this.ServerIdWaitComplete = true;
		if (true == this.ServerImagesWaitComplete)
			this.OpenDocumentEndCallback();
	};

	// Эвент о пришедщих изменениях
	asc_docs_api.prototype.syncCollaborativeChanges = function()
	{
		this.sendEvent("asc_onCollaborativeChanges");
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
		AscCommon.CollaborativeEditing.Clear_CollaborativeMarks(true);
	};

	asc_docs_api.prototype._onUpdateDocumentCanSave = function()
	{
		var CollEditing = AscCommon.CollaborativeEditing;

		// Можно модифицировать это условие на более быстрое (менять самим состояние в аргументах, а не запрашивать каждый раз)
		var isCanSave = this.isDocumentModified() || (true !== CollEditing.Is_SingleUser() && 0 !== CollEditing.getOwnLocksLength());

		if (true === CollEditing.Is_Fast() && true !== CollEditing.Is_SingleUser())
			isCanSave = false;

		if (isCanSave !== this.isDocumentCanSave)
		{
			this.isDocumentCanSave = isCanSave;
			this.sendEvent('asc_onDocumentCanSaveChanged', this.isDocumentCanSave);
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
		this.sendEvent("asc_onDocumentModifiedChanged");

		if (undefined !== window["AscDesktopEditor"])
		{
			window["AscDesktopEditor"]["onDocumentModifiedChanged"](bValue);
		}
	};

	asc_docs_api.prototype.isDocumentModified = function()
	{
		if (!this.canSave)
		{
			// Пока идет сохранение, мы не закрываем документ
			return true;
		}
		return this.isDocumentModify;
	};

	asc_docs_api.prototype.asc_getCurrentFocusObject = function()
    {
        if (!this.WordControl || !this.WordControl.Thumbnails)
            return 1;
        return this.WordControl.Thumbnails.FocusObjType;
    };

	asc_docs_api.prototype.sync_BeginCatchSelectedElements = function()
	{
		if (0 != this.SelectedObjectsStack.length)
			this.SelectedObjectsStack.splice(0, this.SelectedObjectsStack.length);
	};
	asc_docs_api.prototype.sync_EndCatchSelectedElements   = function()
	{
		this.sendEvent("asc_onFocusObject", this.SelectedObjectsStack);
	};
	asc_docs_api.prototype.getSelectedElements             = function()
	{
		return this.SelectedObjectsStack;
	};
	asc_docs_api.prototype.sync_ChangeLastSelectedElement  = function(type, obj)
	{
		var oUnkTypeObj = null;

		switch (type)
		{
			case c_oAscTypeSelectElement.Paragraph:
				oUnkTypeObj = new Asc.asc_CParagraphProperty(obj);
				break;
			case c_oAscTypeSelectElement.Image:
				oUnkTypeObj = new Asc.asc_CImgProperty(obj);
				break;
			case c_oAscTypeSelectElement.Table:
				oUnkTypeObj = new Asc.CTableProp(obj);
				break;
			case c_oAscTypeSelectElement.Shape:
				oUnkTypeObj = obj;
				break;
		}

		var _i       = this.SelectedObjectsStack.length - 1;
		var bIsFound = false;
		while (_i >= 0)
		{
			if (this.SelectedObjectsStack[_i].Type == type)
			{

				this.SelectedObjectsStack[_i].Value = oUnkTypeObj;
				bIsFound                            = true;
				break;
			}
			_i--;
		}

		if (!bIsFound)
		{
			this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject(type, oUnkTypeObj);
		}
	};

	asc_docs_api.prototype.Init          = function()
	{
		this.WordControl.Init();
	};
	asc_docs_api.prototype.asc_setLocale = function(val)
	{
	};

	asc_docs_api.prototype.SetThemesPath = function(path)
	{
		if (!this.isLoadFullApi)
		{
			this.tmpThemesPath = path;
			return;
		}

		this.ThemeLoader.ThemesUrl = path;
		if (this.documentOrigin)
		{
			this.ThemeLoader.ThemesUrlAbs = AscCommon.joinUrls(this.documentOrigin + this.documentPathname, path);
		}
		else
		{
			this.ThemeLoader.ThemesUrlAbs = path;
		}
	};

	asc_docs_api.prototype.CreateCSS = function()
	{
		if (window["flat_desine"] === true)
		{
			AscCommonSlide.updateGlobalSkin(AscCommonSlide.GlobalSkinFlat);
		}

		var _head = document.getElementsByTagName('head')[0];

		var style0       = document.createElement('style');
		style0.type      = 'text/css';
		style0.innerHTML = ".block_elem { position:absolute;padding:0;margin:0; }";
		_head.appendChild(style0);

		var style1       = document.createElement('style');
		style1.type      = 'text/css';
		style1.innerHTML = ".buttonTabs {\
background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAA5CAMAAADjueCuAAAABGdBTUEAALGPC/xhBQAAAEhQTFRFAAAAWFhYZWVlSEhIY2NjV1dXQ0NDYWFhYmJiTk5OVlZWYGBgVFRUS0tLbGxsRERETExMZmZmVVVVXl5eR0dHa2trPj4+u77CpAZQrwAAAAF0Uk5TAEDm2GYAAABwSURBVDjL1dHHDoAgEEVR7NLr4P//qQm6EMaFxtje8oTF5ELIpU35Fstf3GegsPEBG+uwSYpNB1qNKreoDeNw/r6dLr/tnFpbbNZj8wKbk8W/1d6ZPjfrhdHx9c4fbA9wzMYWm3OFhbQmbC2ue6z9DCH/Exf/mU3YAAAAAElFTkSuQmCC);\
background-position: 0px 0px;\
background-repeat: no-repeat;\
}";
		_head.appendChild(style1);

		var style3       = document.createElement('style');
		style3.type      = 'text/css';
		style3.innerHTML = ".buttonPrevPage {\
background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAABgBAMAAADm/++TAAAABGdBTUEAALGPC/xhBQAAABJQTFRFAAAA////UVNVu77Cenp62Nrc3x8hMQAAAAF0Uk5TAEDm2GYAAABySURBVCjPY2AgETDBGEoKUAElJcJSxANjKGAwDQWDYAKMIBhDSRXCCFJSIixF0GS4M+AMExcwcCbAcIQxBEUgDEdBQcJSBE2GO4PU6IJHASxS4NGER4p28YWIAlikwKMJjxTt4gsRBbBIgUcTHini4wsAwMmIvYZODL0AAAAASUVORK5CYII=);\
background-position: 0px 0px;\
background-repeat: no-repeat;\
}";
		_head.appendChild(style3);

		var style4       = document.createElement('style');
		style4.type      = 'text/css';
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

		var _main_border_style     = "border-bottom-width: 1px;border-bottom-color:" + AscCommonSlide.GlobalSkin.BorderSplitterColor + "; border-bottom-style: solid;";
		var _thumbnail_style_right = "border-right-width: 1px;border-right-color:" + AscCommonSlide.GlobalSkin.BorderSplitterColor + "; border-right-style: solid;";
		if (!AscCommonSlide.GlobalSkin.SupportNotes)
		{
			_main_border_style     = "";
			_thumbnail_style_right = "";
		}

		var _innerHTML = "<div id=\"id_panel_thumbnails\" class=\"block_elem\" style=\"background-color:" + AscCommonSlide.GlobalSkin.BackgroundColorThumbnails + ";" + _thumbnail_style_right + "\">\
		                            <canvas id=\"id_thumbnails_background\" class=\"block_elem\" style=\"-ms-touch-action: none;-webkit-user-select: none;background-color:#EBEBEB;z-index:1\"></canvas>\
		                            <canvas id=\"id_thumbnails\" class=\"block_elem\" style=\"-ms-touch-action: none;-webkit-user-select: none;z-index:2\"></canvas>\
		                            <div id=\"id_vertical_scroll_thmbnl\" style=\"left:0;top:0;width:1px;overflow:hidden;position:absolute;\">\
									    <div id=\"panel_right_scroll_thmbnl\" class=\"block_elem\" style=\"left:0;top:0;width:1px;height:6000px;\"></div>\
									</div>\
		                        </div>\
                            <div id=\"id_main\" class=\"block_elem\" style=\"-ms-touch-action: none;-moz-user-select:none;-khtml-user-select:none;user-select:none;background-color:" + AscCommonSlide.GlobalSkin.BackgroundColor + ";overflow:hidden;border-left-width: 1px;border-left-color:" + AscCommonSlide.GlobalSkin.BorderSplitterColor + "; border-left-style: solid;" + _main_border_style + "\" UNSELECTABLE=\"on\">\
								<div id=\"id_panel_left\" class=\"block_elem\">\
									<canvas id=\"id_buttonTabs\" class=\"block_elem\"></canvas>\
									<canvas id=\"id_vert_ruler\" class=\"block_elem\"></canvas>\
								</div>\
                                <div id=\"id_panel_top\" class=\"block_elem\">\
									<canvas id=\"id_hor_ruler\" class=\"block_elem\"></canvas>\
                                </div>\
                                <div id=\"id_main_view\" class=\"block_elem\" style=\"overflow:hidden\">\
                                    <canvas id=\"id_viewer\" class=\"block_elem\" style=\"-ms-touch-action: none;-webkit-user-select: none;background-color:#B0B0B0;z-index:1\"></canvas>\
                                    <canvas id=\"id_viewer_overlay\" class=\"block_elem\" style=\"-ms-touch-action: none;-webkit-user-select: none;z-index:2\"></canvas>\
                                    <canvas id=\"id_target_cursor\" class=\"block_elem\" width=\"1\" height=\"1\" style=\"-ms-touch-action: none;-webkit-user-select: none;width:2px;height:13px;display:none;z-index:4;\"></canvas>\
                                </div>\
							    <div id=\"id_panel_right\" class=\"block_elem\" style=\"margin-right:1px;background-color:#F1F1F1;z-index:0;\">\
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
			_innerHTML += "<div id=\"id_panel_notes\" class=\"block_elem\" style=\"background-color:#FFFFFF;border-left-width: 1px;border-left-color:" + AscCommonSlide.GlobalSkin.BorderSplitterColor + "; border-left-style: solid;border-top-width: 1px;border-top-color:" + AscCommonSlide.GlobalSkin.BorderSplitterColor + "; border-top-style: solid;\">\
                                <canvas id=\"id_notes\" class=\"block_elem\" style=\"background-color:#FFFFFF;z-index:1\"></canvas>\
                                <div id=\"id_vertical_scroll_notes\" style=\"left:0;top:0;width:16px;overflow:hidden;position:absolute;\">\
                                    <div id=\"panel_right_scroll_notes\" class=\"block_elem\" style=\"left:0;top:0;width:16px;height:6000px;\"></div>\
                                </div>\
                            </div>";
		}

		if (this.HtmlElement != null)
		{
			if (AscCommonSlide.GlobalSkin.Name == "flat")
				this.HtmlElement.style.backgroundColor = AscCommonSlide.GlobalSkin.BackgroundColorThumbnails;

			this.HtmlElement.innerHTML = _innerHTML;
		}
	};

	asc_docs_api.prototype.InitEditor = function()
	{
		this.WordControl.m_oLogicDocument                    = new AscCommonSlide.CPresentation(this.WordControl.m_oDrawingDocument);
		this.WordControl.m_oDrawingDocument.m_oLogicDocument = this.WordControl.m_oLogicDocument;

		if (this.WordControl.MobileTouchManager)
			this.WordControl.MobileTouchManager.delegate.LogicDocument = this.WordControl.m_oLogicDocument;
	};

	asc_docs_api.prototype.SetInterfaceDrawImagePlaceSlide = function(div_id)
	{
		if (!this.isLoadFullApi)
		{
			this.tmpSlideDiv = div_id;
			return;
		}
		this.WordControl.m_oDrawingDocument.InitGuiCanvasSlide(div_id);
	};

	asc_docs_api.prototype.SetInterfaceDrawImagePlaceTextArt = function(div_id)
	{
		if (!this.isLoadFullApi)
		{
			this.tmpTextArtDiv = div_id;
			return;
		}
		this.WordControl.m_oDrawingDocument.InitGuiCanvasTextArt(div_id);
	};

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
		this.WordControl.m_oDrawingDocument.CheckFontNeeds();
		this.FontLoader.LoadDocumentFonts(this.WordControl.m_oLogicDocument.Fonts, false);

		this.ParcedDocument = true;
		g_oIdCounter.Set_Load(false);
		if (this.isStartCoAuthoringOnEndLoad)
		{
			this.CoAuthoringApi.onStartCoAuthoring(true);
			this.isStartCoAuthoringOnEndLoad = false;
		}

		if (this.isMobileVersion)
		{
			AscCommon.AscBrowser.isSafariMacOs   = false;
			PasteElementsId.PASTE_ELEMENT_ID     = "wrd_pastebin";
			PasteElementsId.ELEMENT_DISPAY_STYLE = "none";
		}

		if (AscCommon.AscBrowser.isSafariMacOs)
			setInterval(AscCommon.SafariIntervalFocus, 10);
	};

	asc_docs_api.prototype._OfflineAppDocumentEndLoad = function()
	{
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

	asc_docs_api.prototype.asc_registerCallback = function(name, callback)
	{
		if (!_callbacks.hasOwnProperty(name))
			_callbacks[name] = [];
		_callbacks[name].push(callback);
	};

	asc_docs_api.prototype.asc_unregisterCallback = function(name, callback)
	{
		if (_callbacks.hasOwnProperty(name))
		{
			for (var i = _callbacks[name].length - 1; i >= 0; --i)
			{
				if (_callbacks[name][i] == callback)
					_callbacks[name].splice(i, 1);
			}
		}
	};

	asc_docs_api.prototype.asc_checkNeedCallback = function(name)
	{
		if (_callbacks.hasOwnProperty(name))
		{
			return true;
		}
		return false;
	};

	// get functions
	asc_docs_api.prototype.get_TextProps = function()
	{
		var Doc    = this.WordControl.m_oLogicDocument;
		var ParaPr = Doc.Get_Paragraph_ParaPr();
		var TextPr = Doc.Get_Paragraph_TextPr();

		// return { ParaPr: ParaPr, TextPr : TextPr };
		return new Asc.CParagraphAndTextProp(ParaPr, TextPr);	// uncomment if this method will be used externally. 20/03/2012 uncommented for testers
	};

	// -------
	// тут методы, замены евентов
	asc_docs_api.prototype.get_PropertyEditorThemes = function()
	{
		var ret = [this._gui_editor_themes, this._gui_document_themes];
		return ret;
	};

	// -------

	asc_docs_api.prototype.UpdateTextPr = function(TextPr)
	{
		if ("undefined" != typeof(TextPr))
		{
			if (TextPr.Color !== undefined)
			{
				this.WordControl.m_oDrawingDocument.TargetCursorColor.R = TextPr.Color.r;
				this.WordControl.m_oDrawingDocument.TargetCursorColor.G = TextPr.Color.g;
				this.WordControl.m_oDrawingDocument.TargetCursorColor.B = TextPr.Color.b;
			}
			if (TextPr.Bold === undefined)
				TextPr.Bold = false;
			if (TextPr.Italic === undefined)
				TextPr.Italic = false;
			if (TextPr.Underline === undefined)
				TextPr.Underline = false;
			if (TextPr.Strikeout === undefined)
				TextPr.Strikeout = false;
			if (TextPr.FontFamily === undefined)
				TextPr.FontFamily = {Index : 0, Name : ""};
			if (TextPr.FontSize === undefined)
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

	asc_docs_api.prototype.sync_TextSpacing      = function(Spacing)
	{
		this.sendEvent("asc_onTextSpacing", Spacing);
	};
	asc_docs_api.prototype.sync_TextDStrikeout   = function(Value)
	{
		this.sendEvent("asc_onTextDStrikeout", Value);
	};
	asc_docs_api.prototype.sync_TextCaps         = function(Value)
	{
		this.sendEvent("asc_onTextCaps", Value);
	};
	asc_docs_api.prototype.sync_TextSmallCaps    = function(Value)
	{
		this.sendEvent("asc_onTextSmallCaps", Value);
	};
	asc_docs_api.prototype.sync_TextPosition     = function(Value)
	{
		this.sendEvent("asc_onTextPosition", Value);
	};
	asc_docs_api.prototype.sync_TextLangCallBack = function(Lang)
	{
		this.sendEvent("asc_onTextLanguage", Lang.Val);
	};

	asc_docs_api.prototype.sync_VerticalTextAlign = function(align)
	{
		this.sendEvent("asc_onVerticalTextAlign", align);
	};
	asc_docs_api.prototype.sync_Vert              = function(vert)
	{
		this.sendEvent("asc_onVert", vert);
	};

	asc_docs_api.prototype.UpdateParagraphProp = function(ParaPr, bParaPr)
	{

		ParaPr.StyleName  = "";
		var TextPr        = editor.WordControl.m_oLogicDocument.Get_Paragraph_TextPr();
		var oDrawingProps = editor.WordControl.m_oLogicDocument.Get_GraphicObjectsProps();
		if (oDrawingProps.shapeProps && oDrawingProps.shapeProps.locked
			|| oDrawingProps.chartProps && oDrawingProps.chartProps.locked
			|| oDrawingProps.tableProps && oDrawingProps.tableProps.Locked)
		{
			ParaPr.Locked = true;
		}
		ParaPr.Subscript   = ( TextPr.VertAlign === AscCommon.vertalign_SubScript ? true : false );
		ParaPr.Superscript = ( TextPr.VertAlign === AscCommon.vertalign_SuperScript ? true : false );
		ParaPr.Strikeout   = TextPr.Strikeout;
		ParaPr.DStrikeout  = TextPr.DStrikeout;
		ParaPr.AllCaps     = TextPr.Caps;
		ParaPr.SmallCaps   = TextPr.SmallCaps;
		ParaPr.TextSpacing = TextPr.Spacing;
		ParaPr.Position    = TextPr.Position;
		if (ParaPr.Bullet)
		{
			var ListType = {
				Type    : -1,
				SubType : -1
			};
			if (ParaPr.Bullet && ParaPr.Bullet.bulletType)
			{
				switch (ParaPr.Bullet.bulletType.type)
				{
					case AscFormat.BULLET_TYPE_BULLET_CHAR:
					{
						ListType.Type    = 0;
						ListType.SubType = undefined;
						switch (ParaPr.Bullet.bulletType.Char)
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
							case  String.fromCharCode(0x0076):
							{
								ListType.SubType = 4;
								break;
							}
							case  String.fromCharCode(0x00D8):
							{
								ListType.SubType = 5;
								break;
							}
							case  String.fromCharCode(0x00FC):
							{
								ListType.SubType = 6;
								break;
							}
							case String.fromCharCode(119):
							{
								ListType.SubType = 7;
								break;
							}
						}
						break;
					}
					case AscFormat.BULLET_TYPE_BULLET_BLIP:
					{
						ListType.Type    = 0;
						ListType.SubType = undefined;
						break;
					}
					case AscFormat.BULLET_TYPE_BULLET_AUTONUM:
					{
						ListType.Type    = 1;
						ListType.SubType = undefined;
						if (AscFormat.isRealNumber(ParaPr.Bullet.bulletType.AutoNumType))
						{
							var AutoNumType = AscCommonWord.g_NumberingArr[ParaPr.Bullet.bulletType.AutoNumType] - 99;
							if (AutoNumType > 0 && AutoNumType < 9)
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
			ParaPr.ListType = {Type : -1, SubType : -1};
		}
		this.sync_ParaSpacingLine(ParaPr.Spacing);
		this.Update_ParaInd(ParaPr.Ind);
		this.sync_PrAlignCallBack(ParaPr.Jc);
		this.sync_ParaStyleName(ParaPr.StyleName);
		this.sync_ListType(ParaPr.ListType);
		if (!(bParaPr === true))
			this.sync_PrPropCallback(ParaPr);
	};
	/*----------------------------------------------------------------*/
	/*functions for working with clipboard, document*/
	/*TODO: Print,Undo,Redo,Copy,Cut,Paste,Share,Save,DownloadAs,ReturnToDocuments(вернуться на предыдущую страницу) & callbacks for these functions*/
	asc_docs_api.prototype.asc_Print      = function(bIsDownloadEvent)
	{

		if (window["AscDesktopEditor"])
		{
			window["AscDesktopEditor"]["Print"]();
			return;
		}
		var options = {downloadType : bIsDownloadEvent ? DownloadType.Print : DownloadType.None};
		this._downloadAs(c_oAscFileType.PDF, c_oAscAsyncAction.Print, options);
	};
	asc_docs_api.prototype.Undo           = function()
	{
		this.WordControl.m_oLogicDocument.Document_Undo();
	};
	asc_docs_api.prototype.Redo           = function()
	{
		this.WordControl.m_oLogicDocument.Document_Redo();
	};
	asc_docs_api.prototype.Copy           = function()
	{
		if (window["AscDesktopEditor"])
		{
		    window["asc_desktop_copypaste"](this, "Copy");
			return true;
		}
		return AscCommon.g_clipboardBase.Button_Copy();
	};
	asc_docs_api.prototype.Update_ParaTab = function(Default_Tab, ParaTabs)
	{
		this.WordControl.m_oDrawingDocument.Update_ParaTab(Default_Tab, ParaTabs);
	};
	asc_docs_api.prototype.Cut            = function()
	{
		if (window["AscDesktopEditor"])
		{
		    window["asc_desktop_copypaste"](this, "Cut");
			return true;
		}
		return AscCommon.g_clipboardBase.Button_Cut();
	};
	asc_docs_api.prototype.Paste          = function()
	{
		if (window["AscDesktopEditor"])
		{
		    window["asc_desktop_copypaste"](this, "Paste");
			return true;
		}
		
		if (!this.WordControl.m_oLogicDocument)
			return false;

		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Drawing_Props))
		{
			if (AscCommon.g_clipboardBase.IsWorking())
				return false;

			return AscCommon.g_clipboardBase.Button_Paste();
		}
	};
	asc_docs_api.prototype.Share          = function()
	{

	};

	asc_docs_api.prototype.asc_CheckCopy = function(_clipboard /* CClipboardData */, _formats)
	{
		if (!this.WordControl.m_oLogicDocument)
		{
			var _text_object = (AscCommon.c_oAscClipboardDataFormat.Text & _formats) ? {Text : ""} : null;
			var _html_data   = this.WordControl.m_oDrawingDocument.m_oDocumentRenderer.Copy(_text_object);

			//TEXT
			if (AscCommon.c_oAscClipboardDataFormat.Text & _formats)
			{
				_clipboard.pushData(AscCommon.c_oAscClipboardDataFormat.Text, _text_object.Text);
			}
			//HTML
			if (AscCommon.c_oAscClipboardDataFormat.Html & _formats)
			{
				_clipboard.pushData(AscCommon.c_oAscClipboardDataFormat.Html, _html_data);
			}
			return;
		}

		var sBase64 = null, _data;

		//TEXT
		if (AscCommon.c_oAscClipboardDataFormat.Text & _formats)
		{
			_data = this.WordControl.m_oLogicDocument.Get_SelectedText(false);
			_clipboard.pushData(AscCommon.c_oAscClipboardDataFormat.Text, _data)
		}
		//HTML
		if (AscCommon.c_oAscClipboardDataFormat.Html & _formats)
		{
			var oCopyProcessor = new AscCommon.CopyProcessor(this);
			sBase64            = oCopyProcessor.Start();
			_data              = oCopyProcessor.getInnerHtml();

			_clipboard.pushData(AscCommon.c_oAscClipboardDataFormat.Html, _data)
		}
		//INTERNAL
		if (AscCommon.c_oAscClipboardDataFormat.Internal & _formats)
		{
			if (sBase64 === null)
			{
				var oCopyProcessor = new AscCommon.CopyProcessor(this);
				sBase64            = oCopyProcessor.Start();
			}

			_data = sBase64;
			_clipboard.pushData(AscCommon.c_oAscClipboardDataFormat.Internal, _data)
		}
	};

	asc_docs_api.prototype.asc_PasteData = function(_format, data1, data2, text_data)
	{
	    if (this.getViewMode())
    	    return;

		this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_PasteHotKey);
		switch (_format)
		{
			case AscCommon.c_oAscClipboardDataFormat.HtmlElement:
				AscCommon.Editor_Paste_Exec(this, data1, data2);
				break;
			case AscCommon.c_oAscClipboardDataFormat.Internal:
				AscCommon.Editor_Paste_Exec(this, null, null, data1);
				break;
			default:
				break;
		}
	};

	asc_docs_api.prototype.asc_IsFocus = function(bIsNaturalFocus)
	{
		var _ret = false;
		if (this.WordControl.IsFocus)
			_ret = true;
		if (_ret && bIsNaturalFocus && this.WordControl.TextBoxInputFocus)
			_ret = false;
		return _ret;
	};

	asc_docs_api.prototype.asc_SelectionCut = function()
	{
	    if (this.getViewMode())
            return;
		var _logicDoc = this.WordControl.m_oLogicDocument;
		if (!_logicDoc)
			return;
		_logicDoc.Remove(1, true, true);
	};

	asc_docs_api.prototype.onSaveCallback = function(e, isUndoRequest)
	{
		var t = this;
		if (false == e["saveLock"])
		{
			if (this.isLongAction())
			{
				// Мы не можем в этот момент сохранять, т.к. попали в ситуацию, когда мы залочили сохранение и успели нажать вставку до ответа
				// Нужно снять lock с сохранения
				this.CoAuthoringApi.onUnSaveLock = function()
				{
					t.canSave    = true;
					t.IsUserSave = false;
				};
				this.CoAuthoringApi.unSaveLock();
				return;
			}
			this.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.Save);

			this.canUnlockDocument2 = this.canUnlockDocument;
			if (this.canUnlockDocument && this.canStartCoAuthoring) {
				this.CoAuthoringApi.onStartCoAuthoring(true);
			}
			this.canStartCoAuthoring = false;
			this.canUnlockDocument = false;

			if (c_oAscCollaborativeMarksShowType.LastChanges === this.CollaborativeMarksShowType)
			{
				AscCommon.CollaborativeEditing.Clear_CollaborativeMarks();
			}

			// Принимаем чужие изменения
			AscCommon.CollaborativeEditing.Apply_Changes();

			this.CoAuthoringApi.onUnSaveLock = function()
			{
				t.CoAuthoringApi.onUnSaveLock = null;
				if (t.isForceSaveOnUserSave && t.IsUserSave) {
					t.forceSave();
				}
				// Выставляем, что документ не модифицирован
				t.CheckChangedDocument();
				t.canSave    = true;
				t.IsUserSave = false;
				t.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.Save);

				// Обновляем состояние возможности сохранения документа
				t._onUpdateDocumentCanSave();

				if (undefined !== window["AscDesktopEditor"])
				{
					window["AscDesktopEditor"]["OnSave"]();
				}
			};
			var CursorInfo                   = null;
			if (true === AscCommon.CollaborativeEditing.Is_Fast())
			{
				CursorInfo = History.Get_DocumentPositionBinary();
			}


			// Пересылаем свои изменения
            if (isUndoRequest)
            {
                AscCommon.CollaborativeEditing.Set_GlobalLock(false);
                AscCommon.CollaborativeEditing.Undo();
            }
            else
			{
                AscCommon.CollaborativeEditing.Send_Changes(this.IsUserSave, {
                    UserId      : this.CoAuthoringApi.getUserConnectionId(),
                    UserShortId : this.DocInfo.get_UserId(),
                    CursorInfo  : CursorInfo
                });
			}
		}
		else
		{
			var nState = this.CoAuthoringApi.get_state();
			if (AscCommon.ConnectionState.ClosedCoAuth === nState || AscCommon.ConnectionState.ClosedAll === nState)
			{
				// Отключаемся от сохранения, соединение потеряно
				this.canSave    = true;
				this.IsUserSave = false;
			}
			else
			{
				var TimeoutInterval = (true === AscCommon.CollaborativeEditing.Is_Fast() ? 1 : 1000);
				setTimeout(function()
				{
					t.CoAuthoringApi.askSaveChanges(function(event)
					{
						t.onSaveCallback(event);
					});
				}, TimeoutInterval);
			}
		}
	};
	asc_docs_api.prototype._autoSave = function () {
		if ((this.canUnlockDocument || this.autoSaveGap != 0) && !this.isViewMode) {
			var _curTime = new Date().getTime();
			if (-1 === this.lastSaveTime) {
				this.lastSaveTime = _curTime;
			}

			if (this.canUnlockDocument) {
				this.asc_Save(true);
				this.lastSaveTime = _curTime;
			} else {
				if (AscCommon.CollaborativeEditing.Is_Fast() && !AscCommon.CollaborativeEditing.Is_SingleUser()) {
					this.WordControl.m_oLogicDocument.Continue_FastCollaborativeEditing();
				} else {
					var _bIsWaitScheme = false;
					if (this.WordControl.m_oDrawingDocument &&
						!this.WordControl.m_oDrawingDocument.TransitionSlide.IsPlaying() && History.Points &&
						History.Index >= 0 && History.Index < History.Points.length) {
						if ((_curTime - History.Points[History.Index].Time) < this.intervalWaitAutoSave) {
							_bIsWaitScheme = true;
						}
					}

					if (!_bIsWaitScheme) {
						var _interval = (AscCommon.CollaborativeEditing.m_nUseType <= 0) ? this.autoSaveGapSlow :
							this.autoSaveGapFast;

						if ((_curTime - this.lastSaveTime) > _interval) {
							if (History.Have_Changes(true) == true) {
								this.asc_Save(true);
							}
							this.lastSaveTime = _curTime;
						}
					}
				}
			}
		}
	};
	asc_docs_api.prototype.asc_Save                     = function(isAutoSave, isUndoRequest)
	{
		this.IsUserSave = !isAutoSave;
		if (true === this.canSave && !this.isLongAction())
		{
			if (this.asc_isDocumentCanSave() || History.Have_Changes() ||
				AscCommon.CollaborativeEditing.Have_OtherChanges() || true === isUndoRequest || this.canUnlockDocument)
			{
				this.canSave = false;

				var t = this;
				this.CoAuthoringApi.askSaveChanges(function(e)
				{
					t.onSaveCallback(e, isUndoRequest);
				});
			}
			else if (this.isForceSaveOnUserSave && this.IsUserSave)
			{
				this.forceSave();
			}
		}
	};
	asc_docs_api.prototype.asc_DownloadAs               = function(typeFile, bIsDownloadEvent)
	{//передаем число соответствующее своему формату.
		var options = {downloadType : bIsDownloadEvent ? DownloadType.Download : DownloadType.None};
		this._downloadAs(typeFile, c_oAscAsyncAction.DownloadAs, options);
	};
	asc_docs_api.prototype.Resize                       = function()
	{
		if (false === this.bInit_word_control)
			return;
		this.WordControl.OnResize(false);
	};
	asc_docs_api.prototype.AddURL                       = function(url)
	{

	};
	asc_docs_api.prototype.Help                         = function()
	{

	};
	/*
	 idOption идентификатор дополнительного параметра, c_oAscAdvancedOptionsID.TXT.
	 option - какие свойства применить, пока массив. для TXT объект asc_CTXTAdvancedOptions(codepage)
	 exp:	asc_setAdvancedOptions(c_oAscAdvancedOptionsID.TXT, new Asc.asc_CCSVAdvancedOptions(1200) );
	 */
	asc_docs_api.prototype.asc_setAdvancedOptions       = function(idOption, option)
	{
		switch (idOption)
		{
			case c_oAscAdvancedOptionsID.DRM:
				var v = {
					"id": this.documentId,
					"userid": this.documentUserId,
					"format": this.documentFormat,
					"c": "reopen",
					"url": this.documentUrl,
					"title": this.documentTitle,
					"embeddedfonts": this.isUseEmbeddedCutFonts,
					"password": option.asc_getPassword()
				};

				sendCommand(this, null, v);
				break;
		}
	};
	asc_docs_api.prototype.startGetDocInfo              = function()
	{
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
	asc_docs_api.prototype.stopGetDocInfo               = function()
	{
		this.sync_GetDocInfoStopCallback();
		this.WordControl.m_oLogicDocument.Statistics_Stop();
	};
	asc_docs_api.prototype.sync_DocInfoCallback         = function(obj)
	{
		this.sendEvent("asc_onDocInfo", new CDocInfoProp(obj));
	};
	asc_docs_api.prototype.sync_GetDocInfoStartCallback = function()
	{
		this.sendEvent("asc_onGetDocInfoStart");
	};
	asc_docs_api.prototype.sync_GetDocInfoStopCallback  = function()
	{
		this.sendEvent("asc_onGetDocInfoStop");
	};
	asc_docs_api.prototype.sync_GetDocInfoEndCallback   = function()
	{
		this.sendEvent("asc_onGetDocInfoEnd");
	};
	asc_docs_api.prototype.sync_CanUndoCallback         = function(bCanUndo)
	{
		this.sendEvent("asc_onCanUndo", bCanUndo);
	};
	asc_docs_api.prototype.sync_CanRedoCallback         = function(bCanRedo)
	{
		if (true === AscCommon.CollaborativeEditing.Is_Fast() && true !== AscCommon.CollaborativeEditing.Is_SingleUser())
			bCanRedo = false;

		this.sendEvent("asc_onCanRedo", bCanRedo);
	};


	/*callbacks*/
	/*asc_docs_api.prototype.sync_CursorLockCallBack = function(isLock){
	 this.sendEvent("asc_onCursorLock",isLock);
	 }*/
	asc_docs_api.prototype.sync_UndoCallBack       = function()
	{
		this.sendEvent("asc_onUndo");
	};
	asc_docs_api.prototype.sync_RedoCallBack       = function()
	{
		this.sendEvent("asc_onRedo");
	};
	asc_docs_api.prototype.sync_CopyCallBack       = function()
	{
		this.sendEvent("asc_onCopy");
	};
	asc_docs_api.prototype.sync_CutCallBack        = function()
	{
		this.sendEvent("asc_onCut");
	};
	asc_docs_api.prototype.sync_PasteCallBack      = function()
	{
		this.sendEvent("asc_onPaste");
	};
	asc_docs_api.prototype.sync_ShareCallBack      = function()
	{
		this.sendEvent("asc_onShare");
	};
	asc_docs_api.prototype.sync_SaveCallBack       = function()
	{
		this.sendEvent("asc_onSave");
	};
	asc_docs_api.prototype.sync_DownloadAsCallBack = function()
	{
		this.sendEvent("asc_onDownload");
	};

	asc_docs_api.prototype.sync_AddURLCallback  = function()
	{
		this.sendEvent("asc_onAddURL");
	};
	asc_docs_api.prototype.sync_ErrorCallback   = function(errorID, errorLevel)
	{
		this.sendEvent("asc_onError", errorID, errorLevel);
	};
	asc_docs_api.prototype.sync_HelpCallback    = function(url)
	{
		this.sendEvent("asc_onHelp", url);
	};
	asc_docs_api.prototype.sync_UpdateZoom      = function(zoom)
	{
		this.sendEvent("asc_onZoom", zoom);
	};
	asc_docs_api.prototype.ClearPropObjCallback = function(prop)
	{//колбэк предшествующий приходу свойств объекта, prop а всякий случай

		this.sendEvent("asc_onClearPropObj", prop);
	};

	// mobile version methods:
	asc_docs_api.prototype.asc_GetDefaultTableStyles = function()
	{
		var logicDoc = this.WordControl.m_oLogicDocument;
		if (!logicDoc)
			return;

		if (logicDoc.CurPage >= logicDoc.Slides.length)
			return;

		if (logicDoc.Slides.length == 0)
		{
			logicDoc.addNextSlide();
		}

		logicDoc.CheckTableStylesDefault(logicDoc.Slides[logicDoc.CurPage]);
	};

	asc_docs_api.prototype.CollectHeaders                  = function()
	{
		this.sync_ReturnHeadersCallback([]);
	};
	asc_docs_api.prototype.GetActiveHeader                 = function()
	{

	};
	asc_docs_api.prototype.gotoHeader                      = function(page, X, Y)
	{
		this.goToPage(page);
	};
	asc_docs_api.prototype.sync_ChangeActiveHeaderCallback = function(position, header)
	{
		this.sendEvent("asc_onChangeActiveHeader", position, new Asc.CHeader(header));
	};
	asc_docs_api.prototype.sync_ReturnHeadersCallback      = function(headers)
	{
		var _headers = [];
		for (var i = 0; i < headers.length; i++)
		{
			_headers[i] = new CHeader(headers[i]);
		}

		this.sendEvent("asc_onReturnHeaders", _headers);
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
	asc_docs_api.prototype.startSearchText = function(what)
	{// "what" means word(s) what we search
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


	asc_docs_api.prototype.gotoSearchResultText = function(navigator)
	{//переход к результату.

		this.WordControl.m_oDrawingDocument.CurrentSearchNavi = navigator;
		this.WordControl.ToSearchResult();
	};
	asc_docs_api.prototype.stopSearchText       = function()
	{
		this.sync_SearchStopCallback();

		this.WordControl.m_oLogicDocument.Search_Stop();
	};
	asc_docs_api.prototype.findText             = function(text, isNext)
	{

		var SearchEngine = editor.WordControl.m_oLogicDocument.Search(text, {MatchCase : false});

		var Id = this.WordControl.m_oLogicDocument.Search_GetId(isNext);

		if (null != Id)
			this.WordControl.m_oLogicDocument.Search_Select(Id);

		return SearchEngine.Count;

		//return this.WordControl.m_oLogicDocument.findText(text, scanForward);
	};

	asc_docs_api.prototype.asc_searchEnabled = function(bIsEnabled)
	{
		// пустой метод
	};

	asc_docs_api.prototype.asc_findText             = function(text, isNext, isMatchCase)
	{
		return this.WordControl.m_oLogicDocument.findText(text, isNext === true);
	};
	// returns: CSearchResult
	asc_docs_api.prototype.sync_SearchFoundCallback = function(obj)
	{
		this.sendEvent("asc_onSearchFound", new CSearchResult(obj));
	};
	asc_docs_api.prototype.sync_SearchStartCallback = function()
	{
		this.sendEvent("asc_onSearchStart");
	};
	asc_docs_api.prototype.sync_SearchStopCallback  = function()
	{
		this.sendEvent("asc_onSearchStop");
	};
	asc_docs_api.prototype.sync_SearchEndCallback   = function()
	{
		this.sendEvent("asc_onSearchEnd");
	};
	/*----------------------------------------------------------------*/
	/*functions for working with font*/
	/*setters*/
	asc_docs_api.prototype.put_TextPrFontName         = function(name)
	{
		var loader   = AscCommon.g_font_loader;
		var fontinfo = AscFonts.g_fontApplication.GetFontInfo(name);
		var isasync  = loader.LoadFont(fontinfo);
		if (false === isasync)
		{
			if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
			{
				History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
				this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr({
					FontFamily : {
						Name  : name,
						Index : -1
					}
				}));
			}
		}
	};
	asc_docs_api.prototype.put_TextPrFontSize         = function(size)
	{
		if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
		{
			History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
			this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr({FontSize : Math.min(size, 100)}));

			// для мобильной версии это важно
			if (this.isMobileVersion)
				this.UpdateInterfaceState();
		}
	};
	asc_docs_api.prototype.put_TextPrBold             = function(value)
	{
		if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
		{
			History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
			this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr({Bold : value}));
		}
	};
	asc_docs_api.prototype.put_TextPrItalic           = function(value)
	{
		if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
		{
			History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
			this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr({Italic : value}));
		}
	};
	asc_docs_api.prototype.put_TextPrUnderline        = function(value)
	{
		if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
		{
			History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
			this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr({Underline : value}));
		}
	};
	asc_docs_api.prototype.put_TextPrStrikeout        = function(value)
	{
		if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
		{
			History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
			this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr({
                Strikeout  : value,
                DStrikeout : false
            }));
		}
	};
	asc_docs_api.prototype.put_PrLineSpacing          = function(Type, Value)
	{
		this.WordControl.m_oLogicDocument.Set_ParagraphSpacing({LineRule : Type, Line : Value});
	};
	asc_docs_api.prototype.put_LineSpacingBeforeAfter = function(type, value)//"type == 0" means "Before", "type == 1" means "After"
	{
		switch (type)
		{
			case 0:
				this.WordControl.m_oLogicDocument.Set_ParagraphSpacing({Before : value});
				break;
			case 1:
				this.WordControl.m_oLogicDocument.Set_ParagraphSpacing({After : value});
				break;
		}
	};
	asc_docs_api.prototype.FontSizeIn                 = function()
	{
		this.WordControl.m_oLogicDocument.Paragraph_IncDecFontSize(true);
	};
	asc_docs_api.prototype.FontSizeOut                = function()
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
	asc_docs_api.prototype.sync_BoldCallBack             = function(isBold)
	{
		this.sendEvent("asc_onBold", isBold);
	};
	asc_docs_api.prototype.sync_ItalicCallBack           = function(isItalic)
	{
		this.sendEvent("asc_onItalic", isItalic);
	};
	asc_docs_api.prototype.sync_UnderlineCallBack        = function(isUnderline)
	{
		this.sendEvent("asc_onUnderline", isUnderline);
	};
	asc_docs_api.prototype.sync_StrikeoutCallBack        = function(isStrikeout)
	{
		this.sendEvent("asc_onStrikeout", isStrikeout);
	};
	asc_docs_api.prototype.sync_TextPrFontFamilyCallBack = function(FontFamily)
	{
		this.sendEvent("asc_onFontFamily", new AscCommon.asc_CTextFontFamily(FontFamily));
	};
	asc_docs_api.prototype.sync_TextPrFontSizeCallBack   = function(FontSize)
	{
		this.sendEvent("asc_onFontSize", FontSize);
	};
	asc_docs_api.prototype.sync_PrLineSpacingCallBack    = function(LineSpacing)
	{
		this.sendEvent("asc_onLineSpacing", new AscCommon.asc_CParagraphSpacing(LineSpacing));
	};

	asc_docs_api.prototype.sync_InitEditorThemes      = function(gui_editor_themes, gui_document_themes)
	{
		this._gui_editor_themes   = gui_editor_themes;
		this._gui_document_themes = gui_document_themes;
		if (!this.isViewMode) {
			this.sendEvent("asc_onInitEditorStyles", [gui_editor_themes, gui_document_themes]);
		}
	};
	asc_docs_api.prototype.sync_InitEditorTableStyles = function(styles)
	{
		if (!this.isViewMode) {
			this.sendEvent("asc_onInitTableTemplates", styles);
		}
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
		if (_presentation.Slides[_presentation.CurPage])
		{
			var graphicObjects = _presentation.Slides[_presentation.CurPage].graphicObjects;
			graphicObjects.checkSelectedObjectsAndCallback(function()
			{

				if ("undefined" != typeof(Props.Ind) && null != Props.Ind)
					graphicObjects.setParagraphIndent(Props.Ind);

				if ("undefined" != typeof(Props.Jc) && null != Props.Jc)
					graphicObjects.setParagraphAlign(Props.Jc);


				if ("undefined" != typeof(Props.Spacing) && null != Props.Spacing)
					graphicObjects.setParagraphSpacing(Props.Spacing);


				if (undefined != Props.Tabs)
				{
					var Tabs = new AscCommonWord.CParaTabs();
					Tabs.Set_FromObject(Props.Tabs.Tabs);
					graphicObjects.setParagraphTabs(Tabs);
				}

				if (undefined != Props.DefaultTab)
				{
					_presentation.Set_DocumentDefaultTab(Props.DefaultTab);
				}
				var TextPr = new AscCommonWord.CTextPr();

				if (true === Props.Subscript)
					TextPr.VertAlign = AscCommon.vertalign_SubScript;
				else if (true === Props.Superscript)
					TextPr.VertAlign = AscCommon.vertalign_SuperScript;
				else if (false === Props.Superscript || false === Props.Subscript)
					TextPr.VertAlign = AscCommon.vertalign_Baseline;

				if (undefined != Props.Strikeout)
				{
					TextPr.Strikeout  = Props.Strikeout;
					TextPr.DStrikeout = false;
				}

				if (undefined != Props.DStrikeout)
				{
					TextPr.DStrikeout = Props.DStrikeout;
					if (true === TextPr.DStrikeout)
						TextPr.Strikeout = false;
				}

				if (undefined != Props.SmallCaps)
				{
					TextPr.SmallCaps = Props.SmallCaps;
					TextPr.AllCaps   = false;
				}

				if (undefined != Props.AllCaps)
				{
					TextPr.Caps = Props.AllCaps;
					if (true === TextPr.AllCaps)
						TextPr.SmallCaps = false;
				}

				if (undefined != Props.TextSpacing)
					TextPr.Spacing = Props.TextSpacing;

				if (undefined != Props.Position)
					TextPr.Position = Props.Position;
				graphicObjects.paragraphAdd(new AscCommonWord.ParaTextPr(TextPr));
				_presentation.Recalculate();
				_presentation.Document_UpdateInterfaceState();
			}, [], false, AscDFH.historydescription_Presentation_ParaApply);
		}
	};

	asc_docs_api.prototype.put_PrAlign        = function(value)
	{
		this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_PutTextPrAlign);
		this.WordControl.m_oLogicDocument.Set_ParagraphAlign(value);
	};
	// 0- baseline, 2-subscript, 1-superscript
	asc_docs_api.prototype.put_TextPrBaseline = function(value)
	{
		if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
		{
			History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
			this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr({VertAlign : value}));
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

		NumberInfo.Type    = type;
		NumberInfo.SubType = subtype;
		this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_PutTextPrListType);
		this.WordControl.m_oLogicDocument.Set_ParagraphNumbering(NumberInfo);
	};

	asc_docs_api.prototype.put_ShowSnapLines = function(isShow)
	{
		this.ShowSnapLines = isShow;
	};
	asc_docs_api.prototype.get_ShowSnapLines = function()
	{
		return this.ShowSnapLines;
	};

	asc_docs_api.prototype.put_ShowParaMarks      = function(isShow)
	{
		this.ShowParaMarks = isShow;
		this.WordControl.OnRePaintAttack();
		return this.ShowParaMarks;
	};
	asc_docs_api.prototype.get_ShowParaMarks      = function()
	{
		return this.ShowParaMarks;
	};
	asc_docs_api.prototype.put_ShowTableEmptyLine = function(isShow)
	{
		this.isShowTableEmptyLine = isShow;
		this.WordControl.OnRePaintAttack();

		return this.isShowTableEmptyLine;
	};
	asc_docs_api.prototype.get_ShowTableEmptyLine = function()
	{
		return this.isShowTableEmptyLine;
	};

	asc_docs_api.prototype.ShapeApply = function(prop)
	{
		// нужно определить, картинка это или нет
		var image_url = "";
		prop.Width    = prop.w;
		prop.Height   = prop.h;

		var bShapeTexture = true;
		if (prop.fill != null)
		{
			if (prop.fill.fill != null && prop.fill.type == c_oAscFill.FILL_TYPE_BLIP)
			{
				image_url = prop.fill.fill.asc_getUrl();

				var _tx_id = prop.fill.fill.asc_getTextureId();
				if (null != _tx_id && 0 <= _tx_id && _tx_id < AscCommon.g_oUserTexturePresets.length)
				{
					image_url = AscCommon.g_oUserTexturePresets[_tx_id];
				}
			}
		}
		var oFill;
		if (prop.textArtProperties)
		{
			oFill = prop.textArtProperties.asc_getFill();
			if (oFill && oFill.fill != null && oFill.type == c_oAscFill.FILL_TYPE_BLIP)
			{
				image_url = oFill.fill.asc_getUrl();

				var _tx_id = oFill.fill.asc_getTextureId();
				if (null != _tx_id && 0 <= _tx_id && _tx_id < AscCommon.g_oUserTexturePresets.length)
				{
					image_url = AscCommon.g_oUserTexturePresets[_tx_id];
				}
				bShapeTexture = false;
			}
		}
		if (!AscCommon.isNullOrEmptyString(image_url))
		{
			var sImageUrl = null;
			if (!g_oDocumentUrls.getImageLocal(image_url))
			{
				sImageUrl = image_url;
			}
			var oApi           = this;
			var fApplyCallback = function()
			{
				var _image   = oApi.ImageLoader.LoadImage(image_url, 1);
				var srcLocal = g_oDocumentUrls.getImageLocal(image_url);
				if (srcLocal)
				{
					image_url = srcLocal;
				}
				if (bShapeTexture)
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
					if (bShapeTexture)
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
					var oProp                 = prop;
					oApi.asyncImageEndLoaded2 = function(_image)
					{
						oApi.WordControl.m_oLogicDocument.ShapeApply(oProp);
						oApi.WordControl.m_oDrawingDocument.DrawImageTextureFillShape(image_url);
						oApi.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);
						oApi.asyncImageEndLoaded2 = null;
					}
				}
			};
			if (!sImageUrl)
			{
				fApplyCallback();
			}
			else
			{

				if (window["AscDesktopEditor"])
				{
					image_url = window["AscDesktopEditor"]["LocalFileGetImageUrl"](sImageUrl);
					image_url = g_oDocumentUrls.getImageUrl(image_url);
					fApplyCallback();
					return;
				}

				this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
				this.fCurCallback = function(input)
				{
					if (null != input && "imgurl" == input["type"])
					{
						if ("ok" == input["status"])
						{
							var data = input["data"];
							var urls = {};
							var firstUrl;
							for (var i = 0; i < data.length; ++i)
							{
								var elem = data[i];
								if (elem.url)
								{
									if (!firstUrl)
									{
										firstUrl = elem.url;
									}
									urls[elem.path] = elem.url;
								}
							}
							g_oDocumentUrls.addUrls(urls);
							if (firstUrl)
							{
								image_url = firstUrl;
								fApplyCallback();
							}
							else
							{
								oApi.sendEvent("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.NoCritical);
							}
						}
						else
						{
							oApi.sendEvent("asc_onError", mapAscServerErrorToAscError(parseInt(input["data"])), c_oAscError.Level.NoCritical);
						}
					}
					else
					{
						oApi.sendEvent("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.NoCritical);
					}
					oApi.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
				};
				var rData         = {
					"id"        : this.documentId,
					"userid"    : this.documentUserId,
					"c"         : "imgurl",
					"saveindex" : g_oDocumentUrls.getMaxIndex(),
					"data"      : sImageUrl
				};
				sendCommand(this, null, rData);
			}
		}
		else
		{
			if (!this.noCreatePoint || this.exucuteHistory)
			{
				if (!this.noCreatePoint && !this.exucuteHistory && this.exucuteHistoryEnd)
				{
					if (-1 !== this.nCurPointItemsLength)
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
					this.exucuteHistoryEnd    = false;
					this.nCurPointItemsLength = -1;
				}
				else
				{
					this.WordControl.m_oLogicDocument.ShapeApply(prop);
				}
				if (this.exucuteHistory)
				{
					var oPoint = History.Points[History.Index];
					if (oPoint)
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
				if (this.WordControl.m_oLogicDocument.Slides[this.WordControl.m_oLogicDocument.CurPage])
				{
					if (-1 !== this.nCurPointItemsLength)
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
						if (oPoint)
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

	asc_docs_api.prototype.setStartPointHistory = function()
	{
		this.noCreatePoint  = true;
		this.exucuteHistory = true;
		this.incrementCounterLongAction();
	};
	asc_docs_api.prototype.setEndPointHistory   = function()
	{
		this.noCreatePoint     = false;
		this.exucuteHistoryEnd = true;
		this.decrementCounterLongAction();
	};
	asc_docs_api.prototype.SetSlideProps        = function(prop)
	{
		if (null == prop)
			return;

		var arr_ind    = this.WordControl.Thumbnails.GetSelectedArray();
		var _back_fill = prop.get_background();

		if (_back_fill)
		{
			if (_back_fill.asc_getType() == c_oAscFill.FILL_TYPE_NOFILL)
			{
				var bg       = new AscFormat.CBg();
				bg.bgPr      = new AscFormat.CBgPr();
				bg.bgPr.Fill = AscFormat.CorrectUniFill(_back_fill, null);

				this.WordControl.m_oLogicDocument.changeBackground(bg, arr_ind);
				return;
			}

			var _old_fill = this.WordControl.m_oLogicDocument.Slides[this.WordControl.m_oLogicDocument.CurPage].backgroundFill;
			if (AscCommon.isRealObject(_old_fill))
				_old_fill = _old_fill.createDuplicate();
			var bg        = new AscFormat.CBg();
			bg.bgPr       = new AscFormat.CBgPr();
			bg.bgPr.Fill  = AscFormat.CorrectUniFill(_back_fill, _old_fill);
			var image_url = "";
			if (_back_fill.asc_getType() == c_oAscFill.FILL_TYPE_BLIP && _back_fill.fill && typeof _back_fill.fill.url === "string" && _back_fill.fill.url.length > 0)
			{
				image_url = _back_fill.fill.url;
			}
			if (image_url != "")
			{
				var _image   = this.ImageLoader.LoadImage(image_url, 1);
				var srcLocal = g_oDocumentUrls.getImageLocal(image_url);
				if (srcLocal)
				{
					image_url                       = srcLocal;
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

					var oProp                 = prop;
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

				if (!this.noCreatePoint || this.exucuteHistory)
				{
					if (!this.noCreatePoint && !this.exucuteHistory && this.exucuteHistoryEnd)
					{
						this.WordControl.m_oLogicDocument.changeBackground(bg, arr_ind, true);
						this.exucuteHistoryEnd = false;
					}
					else
					{
						this.WordControl.m_oLogicDocument.changeBackground(bg, arr_ind);
					}
					if (this.exucuteHistory)
					{
						this.exucuteHistory = false;
					}
				}
				else
				{
					if (this.WordControl.m_oLogicDocument.Slides[this.WordControl.m_oLogicDocument.CurPage])
					{
						AscFormat.ExecuteNoHistory(function()
						{

							this.WordControl.m_oLogicDocument.changeBackground(bg, arr_ind, true);
							for (var i = 0; i < arr_ind.length; ++i)
							{
								this.WordControl.m_oLogicDocument.Slides[arr_ind[i]].recalculateBackground()
							}
							for (i = 0; i < arr_ind.length; ++i)
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

	asc_docs_api.prototype.put_LineCap  = function(_cap)
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
	asc_docs_api.prototype.put_LineBeginSize  = function(_size)
	{
		this.WordControl.m_oLogicDocument.putLineBeginSize(_size);
	};

	asc_docs_api.prototype.put_LineEndStyle = function(_style)
	{
		this.WordControl.m_oLogicDocument.putLineEndStyle(_style);
	};
	asc_docs_api.prototype.put_LineEndSize  = function(_size)
	{
		this.WordControl.m_oLogicDocument.putLineEndSize(_size);
	};

	asc_docs_api.prototype.put_TextColor2 = function(r, g, b)
	{
		if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
		{
			History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
			this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr({
				Color : {
					r : r,
					g : g,
					b : b
				}
			}));
		}
	};
	asc_docs_api.prototype.put_TextColor  = function(color)
	{
		if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
		{
			History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
			var _unifill        = new AscFormat.CUniFill();
			_unifill.fill       = new AscFormat.CSolidFill();
			_unifill.fill.color = AscFormat.CorrectUniColor(color, _unifill.fill.color, 0);
			this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr({Unifill : _unifill}));
		}
	};

	asc_docs_api.prototype.put_PrIndent          = function(value, levelValue)
	{
		this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_PutPrIndent);
		this.WordControl.m_oLogicDocument.Set_ParagraphIndent({Left : value, ChangeLevel : levelValue});
	};
	asc_docs_api.prototype.IncreaseIndent        = function()
	{
		this.WordControl.m_oLogicDocument.Paragraph_IncDecIndent(true);
	};
	asc_docs_api.prototype.DecreaseIndent        = function()
	{
		this.WordControl.m_oLogicDocument.Paragraph_IncDecIndent(false);
	};
	asc_docs_api.prototype.put_PrIndentRight     = function(value)
	{
		this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_PutPrIndentRight);
		this.WordControl.m_oLogicDocument.Set_ParagraphIndent({Right : value});
	};
	asc_docs_api.prototype.put_PrFirstLineIndent = function(value)
	{
		this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_PutPrFirstLineIndent);
		this.WordControl.m_oLogicDocument.Set_ParagraphIndent({FirstLine : value});
	};
	asc_docs_api.prototype.getFocusObject        = function()
	{//возвратит тип элемента - параграф c_oAscTypeSelectElement.Paragraph, изображение c_oAscTypeSelectElement.Image, таблица c_oAscTypeSelectElement.Table, колонтитул c_oAscTypeSelectElement.Header.

	};

	/*callbacks*/
	asc_docs_api.prototype.sync_VerticalAlign           = function(typeBaseline)
	{
		this.sendEvent("asc_onVerticalAlign", typeBaseline);
	};
	asc_docs_api.prototype.sync_PrAlignCallBack         = function(value)
	{
		this.sendEvent("asc_onPrAlign", value);
	};
	asc_docs_api.prototype.sync_ListType                = function(NumPr)
	{
		this.sendEvent("asc_onListType", new AscCommon.asc_CListType(NumPr));
	};
	asc_docs_api.prototype.sync_TextColor               = function(Color)
	{
		this.sendEvent("asc_onTextColor", new AscCommon.CColor(Color.r, Color.g, Color.b));
	};
	asc_docs_api.prototype.sync_TextColor2              = function(unifill)
	{
		var _color;
		if (unifill.fill == null)
			return;
		else if (unifill.fill.type == c_oAscFill.FILL_TYPE_SOLID)
		{
			_color    = unifill.getRGBAColor();
			var color = AscCommon.CreateAscColor(unifill.fill.color);
			color.asc_putR(_color.R);
			color.asc_putG(_color.G);
			color.asc_putB(_color.B);
			this.sendEvent("asc_onTextColor", color);
		}
		else if (unifill.fill.type == c_oAscFill.FILL_TYPE_GRAD)
		{
			_color    = unifill.getRGBAColor();
			var color = AscCommon.CreateAscColor(unifill.fill.colors[0].color);
			color.asc_putR(_color.R);
			color.asc_putG(_color.G);
			color.asc_putB(_color.B);
			this.sendEvent("asc_onTextColor", color);
		}
		else
		{
			_color    = unifill.getRGBAColor();
			var color = new Asc.asc_CColor();
			color.asc_putR(_color.R);
			color.asc_putG(_color.G);
			color.asc_putB(_color.B);
			this.sendEvent("asc_onTextColor", color);
		}
	};
	asc_docs_api.prototype.sync_TextHighLight           = function(HighLight)
	{
		this.sendEvent("asc_onTextHighLight", new AscCommon.CColor(HighLight.r, HighLight.g, HighLight.b));
	};
	asc_docs_api.prototype.sync_ParaStyleName           = function(Name)
	{
		this.sendEvent("asc_onParaStyleName", Name);
	};
	asc_docs_api.prototype.sync_ParaSpacingLine         = function(SpacingLine)
	{
		this.sendEvent("asc_onParaSpacingLine", new AscCommon.asc_CParagraphSpacing(SpacingLine));
	};
	asc_docs_api.prototype.sync_PageBreakCallback       = function(isBreak)
	{
		this.sendEvent("asc_onPageBreak", isBreak);
	};
	asc_docs_api.prototype.sync_KeepLinesCallback       = function(isKeepLines)
	{
		this.sendEvent("asc_onKeepLines", isKeepLines);
	};
	asc_docs_api.prototype.sync_ShowParaMarksCallback   = function()
	{
		this.sendEvent("asc_onShowParaMarks");
	};
	asc_docs_api.prototype.sync_SpaceBetweenPrgCallback = function()
	{
		this.sendEvent("asc_onSpaceBetweenPrg");
	};
	asc_docs_api.prototype.sync_PrPropCallback          = function(prProp)
	{
		var _len = this.SelectedObjectsStack.length;
		if (_len > 0)
		{
			if (this.SelectedObjectsStack[_len - 1].Type == c_oAscTypeSelectElement.Paragraph)
			{
				this.SelectedObjectsStack[_len - 1].Value = new Asc.asc_CParagraphProperty(prProp);
				return;
			}
		}

		this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject(c_oAscTypeSelectElement.Paragraph, new Asc.asc_CParagraphProperty(prProp));
	};

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

	asc_docs_api.prototype.Update_ParaInd                = function(Ind)
	{
		var FirstLine = 0;
		var Left      = 0;
		var Right     = 0;
		if ("undefined" != typeof(Ind))
		{
			if ("undefined" != typeof(Ind.FirstLine))
			{
				FirstLine = Ind.FirstLine;
			}
			if ("undefined" != typeof(Ind.Left))
			{
				Left = Ind.Left;
			}
			if ("undefined" != typeof(Ind.Right))
			{
				Right = Ind.Right;
			}
		}

		this.Internal_Update_Ind_Left(Left);
		this.Internal_Update_Ind_FirstLine(FirstLine, Left);
		this.Internal_Update_Ind_Right(Right);
	};
	asc_docs_api.prototype.Internal_Update_Ind_FirstLine = function(FirstLine, Left)
	{
		if (this.WordControl.m_oHorRuler.m_dIndentLeftFirst != (FirstLine + Left))
		{
			this.WordControl.m_oHorRuler.m_dIndentLeftFirst = (FirstLine + Left);
			this.WordControl.UpdateHorRuler();
		}
	};
	asc_docs_api.prototype.Internal_Update_Ind_Left      = function(Left)
	{
		if (this.WordControl.m_oHorRuler.m_dIndentLeft != Left)
		{
			this.WordControl.m_oHorRuler.m_dIndentLeft = Left;
			this.WordControl.UpdateHorRuler();
		}
	};
	asc_docs_api.prototype.Internal_Update_Ind_Right     = function(Right)
	{
		if (this.WordControl.m_oHorRuler.m_dIndentRight != Right)
		{
			this.WordControl.m_oHorRuler.m_dIndentRight = Right;
			this.WordControl.UpdateHorRuler();
		}
	};


	asc_docs_api.prototype.sync_DocSizeCallback               = function(width, height)
	{
		this.sendEvent("asc_onDocSize", width, height);
	};
	asc_docs_api.prototype.sync_PageOrientCallback            = function(isPortrait)
	{
		this.sendEvent("asc_onPageOrient", isPortrait);
	};
	asc_docs_api.prototype.sync_HeadersAndFootersPropCallback = function(hafProp)
	{
		this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject(c_oAscTypeSelectElement.Header, new CHeaderProp(hafProp));
	};

	/*----------------------------------------------------------------*/
	/*functions for working with table*/
	asc_docs_api.prototype.put_Table               = function(col, row)
	{
		this.WordControl.m_oLogicDocument.Add_FlowTable(col, row);
	};
	asc_docs_api.prototype.addRowAbove             = function(count)
	{
		var doc = this.WordControl.m_oLogicDocument;
		if (doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_AddRowAbove);
			this.WordControl.m_oLogicDocument.Table_AddRow(true);
		}
	};
	asc_docs_api.prototype.addRowBelow             = function(count)
	{
		var doc = this.WordControl.m_oLogicDocument;
		if (doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_AddRowBelow);
			this.WordControl.m_oLogicDocument.Table_AddRow(false);
		}
	};
	asc_docs_api.prototype.addColumnLeft           = function(count)
	{
		var doc = this.WordControl.m_oLogicDocument;
		if (doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_AddColLeft);
			this.WordControl.m_oLogicDocument.Table_AddCol(true);
		}
	};
	asc_docs_api.prototype.addColumnRight          = function(count)
	{
		var doc = this.WordControl.m_oLogicDocument;
		if (doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_AddColRight);
			this.WordControl.m_oLogicDocument.Table_AddCol(false);
		}
	};
	asc_docs_api.prototype.remRow                  = function()
	{
		var doc = this.WordControl.m_oLogicDocument;
		if (doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_RemoveRow);
			this.WordControl.m_oLogicDocument.Table_RemoveRow();
		}
	};
	asc_docs_api.prototype.remColumn               = function()
	{
		var doc = this.WordControl.m_oLogicDocument;
		if (doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_RemoveCol);
			this.WordControl.m_oLogicDocument.Table_RemoveCol();
		}
	};
	asc_docs_api.prototype.remTable                = function()
	{
		var doc = this.WordControl.m_oLogicDocument;
		if (doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_RemoveTable);
			this.WordControl.m_oLogicDocument.Table_RemoveTable();
		}
	};
	asc_docs_api.prototype.selectRow               = function()
	{
		this.WordControl.m_oLogicDocument.Table_Select(c_oAscTableSelectionType.Row);
	};
	asc_docs_api.prototype.selectColumn            = function()
	{
		this.WordControl.m_oLogicDocument.Table_Select(c_oAscTableSelectionType.Column);
	};
	asc_docs_api.prototype.selectCell              = function()
	{
		this.WordControl.m_oLogicDocument.Table_Select(c_oAscTableSelectionType.Cell);
	};
	asc_docs_api.prototype.selectTable             = function()
	{
		this.WordControl.m_oLogicDocument.Table_Select(c_oAscTableSelectionType.Table);
	};
	asc_docs_api.prototype.setColumnWidth          = function(width)
	{

	};
	asc_docs_api.prototype.setRowHeight            = function(height)
	{

	};
	asc_docs_api.prototype.set_TblDistanceFromText = function(left, top, right, bottom)
	{

	};
	asc_docs_api.prototype.CheckBeforeMergeCells   = function()
	{
		return this.WordControl.m_oLogicDocument.Table_CheckMerge();
	};
	asc_docs_api.prototype.CheckBeforeSplitCells   = function()
	{
		return this.WordControl.m_oLogicDocument.Table_CheckSplit();
	};
	asc_docs_api.prototype.MergeCells              = function()
	{
		var doc = this.WordControl.m_oLogicDocument;
		if (doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_MergeCells);
			this.WordControl.m_oLogicDocument.Table_MergeCells();
		}
	};
	asc_docs_api.prototype.SplitCell               = function(Cols, Rows)
	{
		var doc = this.WordControl.m_oLogicDocument;
		if (doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_SplitCells);
			this.WordControl.m_oLogicDocument.Table_SplitCell(Cols, Rows);
		}
	};
	asc_docs_api.prototype.widthTable              = function(width)
	{

	};
	asc_docs_api.prototype.put_CellsMargin         = function(left, top, right, bottom)
	{

	};
	asc_docs_api.prototype.set_TblWrap             = function(type)
	{

	};
	asc_docs_api.prototype.set_TblIndentLeft       = function(spacing)
	{

	};
	asc_docs_api.prototype.set_Borders             = function(typeBorders, size, Color)
	{//если size == 0 то границы нет.

	};
	asc_docs_api.prototype.set_TableBackground     = function(Color)
	{

	};
	asc_docs_api.prototype.set_AlignCell           = function(align)
	{// c_oAscAlignType.RIGHT, c_oAscAlignType.LEFT, c_oAscAlignType.CENTER
		switch (align)
		{
			case c_oAscAlignType.LEFT :
				break;
			case c_oAscAlignType.CENTER :
				break;
			case c_oAscAlignType.RIGHT :
				break;
		}
	};
	asc_docs_api.prototype.set_TblAlign            = function(align)
	{// c_oAscAlignType.RIGHT, c_oAscAlignType.LEFT, c_oAscAlignType.CENTER
		switch (align)
		{
			case c_oAscAlignType.LEFT :
				break;
			case c_oAscAlignType.CENTER :
				break;
			case c_oAscAlignType.RIGHT :
				break;
		}
	};
	asc_docs_api.prototype.set_SpacingBetweenCells = function(isOn, spacing)
	{// c_oAscAlignType.RIGHT, c_oAscAlignType.LEFT, c_oAscAlignType.CENTER
		if (isOn)
		{

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
		if (doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_TblApply);
			if (obj.CellBorders)
			{
				if (obj.CellBorders.Left && obj.CellBorders.Left.Color)
				{
					obj.CellBorders.Left.Unifill = AscFormat.CreateUnifillFromAscColor(obj.CellBorders.Left.Color);
				}
				if (obj.CellBorders.Top && obj.CellBorders.Top.Color)
				{
					obj.CellBorders.Top.Unifill = AscFormat.CreateUnifillFromAscColor(obj.CellBorders.Top.Color);
				}
				if (obj.CellBorders.Right && obj.CellBorders.Right.Color)
				{
					obj.CellBorders.Right.Unifill = AscFormat.CreateUnifillFromAscColor(obj.CellBorders.Right.Color);
				}
				if (obj.CellBorders.Bottom && obj.CellBorders.Bottom.Color)
				{
					obj.CellBorders.Bottom.Unifill = AscFormat.CreateUnifillFromAscColor(obj.CellBorders.Bottom.Color);
				}
				if (obj.CellBorders.InsideH && obj.CellBorders.InsideH.Color)
				{
					obj.CellBorders.InsideH.Unifill = AscFormat.CreateUnifillFromAscColor(obj.CellBorders.InsideH.Color);
				}
				if (obj.CellBorders.InsideV && obj.CellBorders.InsideV.Color)
				{
					obj.CellBorders.InsideV.Unifill = AscFormat.CreateUnifillFromAscColor(obj.CellBorders.InsideV.Color);
				}
			}
			if (obj.CellsBackground && obj.CellsBackground.Color)
			{
				obj.CellsBackground.Unifill = AscFormat.CreateUnifillFromAscColor(obj.CellsBackground.Color);
			}
			this.WordControl.m_oLogicDocument.Set_TableProps(obj);
		}
	};
	/*callbacks*/
	asc_docs_api.prototype.sync_AddTableCallback            = function()
	{
		this.sendEvent("asc_onAddTable");
	};
	asc_docs_api.prototype.sync_AlignCellCallback           = function(align)
	{
		this.sendEvent("asc_onAlignCell", align);
	};
	asc_docs_api.prototype.sync_TblPropCallback             = function(tblProp)
	{
		this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject(c_oAscTypeSelectElement.Table, new Asc.CTableProp(tblProp));
	};
	asc_docs_api.prototype.sync_TblWrapStyleChangedCallback = function(style)
	{
		this.sendEvent("asc_onTblWrapStyleChanged", style);
	};
	asc_docs_api.prototype.sync_TblAlignChangedCallback     = function(style)
	{
		this.sendEvent("asc_onTblAlignChanged", style);
	};

	/*----------------------------------------------------------------*/
	/*functions for working with images*/
	asc_docs_api.prototype.ChangeImageFromFile      = function()
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
	asc_docs_api.prototype.ChangeArtImageFromFile   = function()
	{
		this.isTextArtChangeUrl = true;
		this.asc_addImage();
	};

	asc_docs_api.prototype.AddImage      = function()
	{
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

	asc_docs_api.prototype.asc_addOleObjectAction = function(sLocalUrl, sData, sApplicationId, fWidth, fHeight, nWidthPix, nHeightPix)
	{
		var _image = this.ImageLoader.LoadImage(AscCommon.getFullImageSrc2(sLocalUrl), 1);
		if (null != _image)//картинка уже должна быть загружена
		{
			this.WordControl.m_oLogicDocument.Add_OleObject(fWidth, fHeight, nWidthPix, nHeightPix, sLocalUrl, sData, sApplicationId);
		}
	};

	asc_docs_api.prototype.asc_editOleObjectAction = function(bResize, oOleObject, sImageUrl, sData, nPixWidth, nPixHeight)
	{
		if (oOleObject)
		{
			this.WordControl.m_oLogicDocument.Edit_OleObject(oOleObject, sData, sImageUrl, nPixWidth, nPixHeight);
			this.WordControl.m_oLogicDocument.Recalculate();
		}
	};


    asc_docs_api.prototype.asc_startEditCurrentOleObject = function(){
    	if(this.WordControl.m_oLogicDocument.Slides[this.WordControl.m_oLogicDocument.CurPage])
            this.WordControl.m_oLogicDocument.Slides[this.WordControl.m_oLogicDocument.CurPage].graphicObjects.startEditCurrentOleObject();
    };

	asc_docs_api.prototype.AddTextArt = function(nStyle)
	{
		if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
		{
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

	asc_docs_api.prototype._addImageUrl = function(url)
	{
		// ToDo пока временная функция для стыковки.
		this.AddImageUrl(url);
	};
	asc_docs_api.prototype.AddImageUrl  = function(url)
	{
		if (g_oDocumentUrls.getLocal(url))
		{
			this.AddImageUrlAction(url);
		}
		else
		{
			var rData = {
				"id"        : this.documentId,
				"userid"    : this.documentUserId,
				"c"         : "imgurl",
				"saveindex" : g_oDocumentUrls.getMaxIndex(),
				"data"      : url
			};

			var t = this;
			this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
			this.fCurCallback = function(input)
			{
				if (null != input && "imgurl" == input["type"])
				{
					if ("ok" == input["status"])
					{
						var data = input["data"];
						var urls = {};
						var firstUrl;
						for (var i = 0; i < data.length; ++i)
						{
							var elem = data[i];
							if (elem.url)
							{
								if (!firstUrl)
								{
									firstUrl = elem.url;
								}
								urls[elem.path] = elem.url;
							}
						}
						g_oDocumentUrls.addUrls(urls);
						if (firstUrl)
						{
							t.AddImageUrlAction(firstUrl);
						}
						else
						{
							t.sendEvent("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.NoCritical);
						}
					}
					else
					{
						t.sendEvent("asc_onError", mapAscServerErrorToAscError(parseInt(input["data"])), c_oAscError.Level.NoCritical);
					}
				}
				else
				{
					t.sendEvent("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.NoCritical);
				}
				t.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
			};
			sendCommand(this, null, rData);
		}
	};

	asc_docs_api.prototype.AddImageUrlActionCallback = function(_image)
	{
		var _w = AscCommon.Page_Width - (AscCommon.X_Left_Margin + AscCommon.X_Right_Margin);
		var _h = AscCommon.Page_Height - (AscCommon.Y_Top_Margin + AscCommon.Y_Bottom_Margin);
		if (_image.Image != null)
		{
			var __w = Math.max((_image.Image.width * AscCommon.g_dKoef_pix_to_mm), 1);
			var __h = Math.max((_image.Image.height * AscCommon.g_dKoef_pix_to_mm), 1);
			_w      = Math.max(5, Math.min(_w, __w));
			_h      = Math.max(5, Math.min((_w * __h / __w)));
		}

		var src = _image.src;
		if (this.isShapeImageChangeUrl)
		{
			var AscShapeProp       = new Asc.asc_CShapeProperty();
			AscShapeProp.fill      = new asc_CShapeFill();
			AscShapeProp.fill.type = c_oAscFill.FILL_TYPE_BLIP;
			AscShapeProp.fill.fill = new asc_CFillBlip();
			AscShapeProp.fill.fill.asc_putUrl(src);
			this.ShapeApply(AscShapeProp);
			this.isShapeImageChangeUrl = false;
		}
		else if (this.isSlideImageChangeUrl)
		{
			var AscSlideProp             = new CAscSlideProps();
			AscSlideProp.Background      = new asc_CShapeFill();
			AscSlideProp.Background.type = c_oAscFill.FILL_TYPE_BLIP;
			AscSlideProp.Background.fill = new asc_CFillBlip();
			AscSlideProp.Background.fill.asc_putUrl(src);
			this.SetSlideProps(AscSlideProp);
			this.isSlideImageChangeUrl = false;
		}
		else if (this.isImageChangeUrl)
		{
			var AscImageProp      = new Asc.asc_CImgProperty();
			AscImageProp.ImageUrl = src;
			this.ImgApply(AscImageProp);
			this.isImageChangeUrl = false;
		}
		else if (this.isTextArtChangeUrl)
		{
			var AscShapeProp = new Asc.asc_CShapeProperty();
			var oFill        = new asc_CShapeFill();
			oFill.type       = c_oAscFill.FILL_TYPE_BLIP;
			oFill.fill       = new asc_CFillBlip();
			oFill.fill.asc_putUrl(src);
			AscShapeProp.textArtProperties = new Asc.asc_TextArtProperties();
			AscShapeProp.textArtProperties.asc_putFill(oFill);
			this.ShapeApply(AscShapeProp);
			this.isTextArtChangeUrl = false;
		}
		else
		{
			var srcLocal = g_oDocumentUrls.getImageLocal(src);
			if (srcLocal)
			{
				src = srcLocal;
			}

			this.WordControl.m_oLogicDocument.Add_FlowImage(_w, _h, src);
		}
	};

	asc_docs_api.prototype.AddImageUrlAction = function(url)
	{
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
	asc_docs_api.prototype.ImgApply = function(obj)
	{
		var ImagePr        = {};
		ImagePr.lockAspect = obj.lockAspect;
		ImagePr.Width      = null === obj.Width ? null : parseFloat(obj.Width);
		ImagePr.Height     = null === obj.Height ? null : parseFloat(obj.Height);

		ImagePr.title       = obj.title;
		ImagePr.description = obj.description;

		if (undefined != obj.Position)
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


		if (!AscCommon.isNullOrEmptyString(ImagePr.ImageUrl))
		{
			var sImageUrl = null;
			if (!g_oDocumentUrls.getImageLocal(ImagePr.ImageUrl))
			{
				sImageUrl = ImagePr.ImageUrl;
			}

			var oApi           = this;
			var fApplyCallback = function()
			{
				var _img     = oApi.ImageLoader.LoadImage(ImagePr.ImageUrl, 1);
				var srcLocal = g_oDocumentUrls.getImageLocal(ImagePr.ImageUrl);
				if (srcLocal)
				{
					ImagePr.ImageUrl = srcLocal;
				}
				if (null != _img)
				{
					oApi.WordControl.m_oLogicDocument.Set_ImageProps(ImagePr);
				}
				else
				{
					oApi.asyncImageEndLoaded2 = function(_image)
					{
						oApi.WordControl.m_oLogicDocument.Set_ImageProps(ImagePr);
						oApi.asyncImageEndLoaded2 = null;
					}
				}
			};
			if (!sImageUrl)
			{
				fApplyCallback();
			}
			else
			{
				this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);

				if (window["AscDesktopEditor"])
                {
                    var _url = window["AscDesktopEditor"]["LocalFileGetImageUrl"](sImageUrl);
                    _url     = g_oDocumentUrls.getImageUrl(_url);
                    ImagePr.ImageUrl = _url;
                    fApplyCallback();
                    this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
                    return;
                }

				this.fCurCallback = function(input)
				{
					if (null != input && "imgurl" == input["type"])
					{
						if ("ok" == input["status"])
						{
							var data = input["data"];
							var urls = {};
							var firstUrl;
							for (var i = 0; i < data.length; ++i)
							{
								var elem = data[i];
								if (elem.url)
								{
									if (!firstUrl)
									{
										firstUrl = elem.url;
									}
									urls[elem.path] = elem.url;
								}
							}
							g_oDocumentUrls.addUrls(urls);
							if (firstUrl)
							{
								ImagePr.ImageUrl = firstUrl;
								fApplyCallback();
							}
							else
							{
								oApi.sendEvent("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.NoCritical);
							}
						}
						else
						{
							oApi.sendEvent("asc_onError", mapAscServerErrorToAscError(parseInt(input["data"])), c_oAscError.Level.NoCritical);
						}
					}
					else
					{
						oApi.sendEvent("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.NoCritical);
					}
					oApi.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
				};

				var rData = {
					"id"        : this.documentId,
					"userid"    : this.documentUserId,
					"c"         : "imgurl",
					"saveindex" : g_oDocumentUrls.getMaxIndex(),
					"data"      : sImageUrl
				};
				sendCommand(this, null, rData);
			}
		}
		else
		{
			ImagePr.ImageUrl = null;
			this.WordControl.m_oLogicDocument.Set_ImageProps(ImagePr);
		}
	};

	asc_docs_api.prototype.ChartApply              = function(obj)
	{
		if (obj.ChartProperties && obj.ChartProperties.type === Asc.c_oAscChartTypeSettings.stock && this.WordControl.m_oLogicDocument.Slides[this.WordControl.m_oLogicDocument.CurPage])
		{
			if (!AscFormat.CheckStockChart(this.WordControl.m_oLogicDocument.Slides[this.WordControl.m_oLogicDocument.CurPage].graphicObjects, this))
			{
				return;
			}
		}
		this.WordControl.m_oLogicDocument.ChartApply(obj);
	};
	asc_docs_api.prototype.set_Size                = function(width, height)
	{

	};
	asc_docs_api.prototype.set_ConstProportions    = function(isOn)
	{
		if (isOn)
		{

		}
		else
		{

		}
	};
	asc_docs_api.prototype.set_WrapStyle           = function(type)
	{

	};
	asc_docs_api.prototype.deleteImage             = function()
	{

	};
	asc_docs_api.prototype.set_ImgDistanceFromText = function(left, top, right, bottom)
	{

	};
	asc_docs_api.prototype.set_PositionOnPage      = function(X, Y)
	{//расположение от начала страницы

	};
	asc_docs_api.prototype.get_OriginalSizeImage   = function()
	{
		if (0 == this.SelectedObjectsStack.length)
			return null;
		var obj = this.SelectedObjectsStack[this.SelectedObjectsStack.length - 1];
		if (obj == null)
			return null;
		if (obj.Type == c_oAscTypeSelectElement.Image)
			return obj.Value.asc_getOriginSize(this);
	};
	/*callbacks*/
	asc_docs_api.prototype.sync_AddImageCallback = function()
	{
		this.sendEvent("asc_onAddImage");
	};
	asc_docs_api.prototype.sync_ImgPropCallback  = function(imgProp)
	{
		var type = imgProp.chartProps ? c_oAscTypeSelectElement.Chart : c_oAscTypeSelectElement.Image;
		var objects;
		if (type === c_oAscTypeSelectElement.Chart)
		{
			objects = new CAscChartProp(imgProp);
		}
		else
		{
			objects = new Asc.asc_CImgProperty(imgProp);
		}
		this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject(type, objects);
	};

	asc_docs_api.prototype.sync_MathPropCallback = function(MathProp)
	{
		this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject(c_oAscTypeSelectElement.Math, MathProp);
	};

	asc_docs_api.prototype.SetDrawingFreeze = function(bIsFreeze)
	{
		if (!this.isLoadFullApi)
		{
			this.tmpIsFreeze = bIsFreeze;
			return;
		}

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


	asc_docs_api.prototype.AddShapeOnCurrentPage = function(sPreset){
		if(!this.WordControl.m_oLogicDocument){
			return;
		}
        this.WordControl.m_oLogicDocument.AddShapeOnCurrentPage(sPreset);
	}
	asc_docs_api.prototype.can_CopyCut = function(){
		if(!this.WordControl.m_oLogicDocument){
			return false;
		}
        return this.WordControl.m_oLogicDocument.Can_CopyCut();
	}

	/*----------------------------------------------------------------*/
	/*functions for working with zoom & navigation*/
	asc_docs_api.prototype.zoomIn         = function()
	{
		this.WordControl.zoom_In();
	};
	asc_docs_api.prototype.zoomOut        = function()
	{
		this.WordControl.zoom_Out();
	};
	asc_docs_api.prototype.zoomFitToPage  = function()
	{
		if (!this.isLoadFullApi)
		{
			this.tmpZoomType = AscCommon.c_oZoomType.FitToPage;
			return;
		}
		this.WordControl.zoom_FitToPage();
	};
	asc_docs_api.prototype.zoomFitToWidth = function()
	{
		if (!this.isLoadFullApi)
		{
			this.tmpZoomType = AscCommon.c_oZoomType.FitToWidth;
			return;
		}
		this.WordControl.zoom_FitToWidth();
	};
	asc_docs_api.prototype.zoomCustomMode = function()
	{
		if (!this.isLoadFullApi)
		{
			this.tmpZoomType = AscCommon.c_oZoomType.CustomMode;
			return;
		}
		this.WordControl.m_nZoomType = 0;
		this.WordControl.zoom_Fire();
	};
	asc_docs_api.prototype.zoom100        = function()
	{
		this.WordControl.m_nZoomValue = 100;
		this.WordControl.zoom_Fire();
	};
	asc_docs_api.prototype.zoom           = function(percent)
	{
		this.WordControl.m_nZoomValue = percent;
		this.WordControl.zoom_Fire(0);
	};
	asc_docs_api.prototype.goToPage       = function(number)
	{
		this.WordControl.GoToPage(number);
	};
	asc_docs_api.prototype.getCountPages  = function()
	{
		return this.WordControl.m_oDrawingDocument.SlidesCount;
	};
	asc_docs_api.prototype.getCurrentPage = function()
	{
		return this.WordControl.m_oDrawingDocument.SlideCurrent;
	};
	/*callbacks*/
	asc_docs_api.prototype.sync_zoomChangeCallback  = function(percent, type)
	{	//c_oAscZoomType.Current, c_oAscZoomType.FitWidth, c_oAscZoomType.FitPage
		this.sendEvent("asc_onZoomChange", percent, type);
	};
	asc_docs_api.prototype.sync_countPagesCallback  = function(count)
	{
		this.sendEvent("asc_onCountPages", count);
	};
	asc_docs_api.prototype.sync_currentPageCallback = function(number)
	{
		this.sendEvent("asc_onCurrentPage", number);
	};

	asc_docs_api.prototype.sync_SendThemeColors = function(colors, standart_colors)
	{
		this.sendEvent("asc_onSendThemeColors", colors, standart_colors);
	};

	asc_docs_api.prototype.ChangeColorScheme = function(index_scheme)
	{
		var scheme = AscCommon.getColorThemeByIndex(index_scheme);
		if (!scheme)
		{
			index_scheme -= AscCommon.g_oUserColorScheme.length;
			if (null == this.WordControl.MasterLayouts)
				return;

			var theme = this.WordControl.MasterLayouts.Theme;
			if (null == theme)
				return;

			if (index_scheme < 0 || index_scheme >= theme.extraClrSchemeLst.length)
				return;

			scheme = theme.extraClrSchemeLst[index_scheme].clrScheme;
		}

		this.WordControl.m_oLogicDocument.changeColorScheme(scheme);
		this.WordControl.m_oDrawingDocument.CheckGuiControlColors();
	};

	/*----------------------------------------------------------------*/
	asc_docs_api.prototype.asc_enableKeyEvents = function(value, isFromInput)
	{
		if (!this.isLoadFullApi)
		{
			this.tmpFocus = value;
			return;
		}

		if (this.WordControl.IsFocus != value)
		{
			this.WordControl.IsFocus = value;
			this.sendEvent("asc_onEnableKeyEventsChanged", value);
		}

		if (isFromInput !== true && AscCommon.g_inputContext)
			AscCommon.g_inputContext.setInterfaceEnableKeyEvents(value);
	};


	//-----------------------------------------------------------------
	// Функции для работы с комментариями
	//-----------------------------------------------------------------
	function asc_CCommentData(obj)
	{
		if (obj)
		{
			this.m_sText      = (undefined != obj.m_sText     ) ? obj.m_sText : "";
			this.m_sTime      = (undefined != obj.m_sTime     ) ? obj.m_sTime : "";
			this.m_sUserId    = (undefined != obj.m_sUserId   ) ? obj.m_sUserId : "";
			this.m_sQuoteText = (undefined != obj.m_sQuoteText) ? obj.m_sQuoteText : null;
			this.m_bSolved    = (undefined != obj.m_bSolved   ) ? obj.m_bSolved : false;
			this.m_sUserName  = (undefined != obj.m_sUserName ) ? obj.m_sUserName : "";
			this.m_aReplies   = [];
			if (undefined != obj.m_aReplies)
			{
				var Count = obj.m_aReplies.length;
				for (var Index = 0; Index < Count; Index++)
				{
					var Reply = new asc_CCommentData(obj.m_aReplies[Index]);
					this.m_aReplies.push(Reply);
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

	asc_CCommentData.prototype.asc_getText         = function()
	{
		return this.m_sText;
	};
	asc_CCommentData.prototype.asc_putText         = function(v)
	{
		this.m_sText = v ? v.slice(0, Asc.c_oAscMaxCellOrCommentLength) : v;
	};
	asc_CCommentData.prototype.asc_getTime         = function()
	{
		return this.m_sTime;
	};
	asc_CCommentData.prototype.asc_putTime         = function(v)
	{
		this.m_sTime = v;
	};
	asc_CCommentData.prototype.asc_getUserId       = function()
	{
		return this.m_sUserId;
	};
	asc_CCommentData.prototype.asc_putUserId       = function(v)
	{
		this.m_sUserId = v;
	};
	asc_CCommentData.prototype.asc_getUserName     = function()
	{
		return this.m_sUserName;
	};
	asc_CCommentData.prototype.asc_putUserName     = function(v)
	{
		this.m_sUserName = v;
	};
	asc_CCommentData.prototype.asc_getQuoteText    = function()
	{
		return this.m_sQuoteText;
	};
	asc_CCommentData.prototype.asc_putQuoteText    = function(v)
	{
		this.m_sQuoteText = v;
	};
	asc_CCommentData.prototype.asc_getSolved       = function()
	{
		return this.m_bSolved;
	};
	asc_CCommentData.prototype.asc_putSolved       = function(v)
	{
		this.m_bSolved = v;
	};
	asc_CCommentData.prototype.asc_getReply        = function(i)
	{
		return this.m_aReplies[i];
	};
	asc_CCommentData.prototype.asc_addReply        = function(v)
	{
		this.m_aReplies.push(v);
	};
	asc_CCommentData.prototype.asc_getRepliesCount = function(v)
	{
		return this.m_aReplies.length;
	};


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

		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_MoveComment, Id))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_RemoveComment);
			this.WordControl.m_oLogicDocument.Remove_Comment(Id, true);
		}
	};

	asc_docs_api.prototype.asc_changeComment = function(Id, AscCommentData)
	{
		if (null == this.WordControl.m_oLogicDocument)
			return;

		//if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_MoveComment, Id ) )
		{
			var CommentData = new AscCommon.CCommentData();
			CommentData.Read_FromAscCommentData(AscCommentData);

			this.WordControl.m_oLogicDocument.Change_Comment(Id, CommentData);

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
		this.sendEvent("asc_onRemoveComment", Id);
	};

	asc_docs_api.prototype.sync_AddComment = function(Id, CommentData)
	{
		if (this.bNoSendComments === false)
		{
			var AscCommentData = new asc_CCommentData(CommentData);
			AscCommentData.asc_putQuoteText("");
			this.sendEvent("asc_onAddComment", Id, AscCommentData);
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
		this.sendEvent("asc_onShowComment", [Id], X, Y);
	};

	asc_docs_api.prototype.sync_HideComment = function()
	{
		this.sendEvent("asc_onHideComment");
	};

	asc_docs_api.prototype.sync_UpdateCommentPosition = function(Id, X, Y)
	{
		// TODO: Переделать на нормальный массив
		this.sendEvent("asc_onUpdateCommentPosition", [Id], X, Y);
	};

	asc_docs_api.prototype.sync_ChangeCommentData = function(Id, CommentData)
	{
		var AscCommentData = new asc_CCommentData(CommentData);
		this.sendEvent("asc_onChangeCommentData", Id, AscCommentData);
	};

	asc_docs_api.prototype.sync_LockComment = function(Id, UserId)
	{
		this.sendEvent("asc_onLockComment", Id, UserId);
	};

	asc_docs_api.prototype.sync_UnLockComment = function(Id)
	{
		this.sendEvent("asc_onUnLockComment", Id);
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
			var _progress         = this.OpenDocumentProgress;
			_progress.Type        = c_oAscAsyncAction.LoadDocumentFonts;
			_progress.FontsCount  = this.FontLoader.fonts_loading.length;
			_progress.CurrentFont = 0;

			var _loader_object = this.WordControl.m_oLogicDocument;
			var _count         = 0;
			if (_loader_object !== undefined && _loader_object != null)
			{
				for (var i in _loader_object.ImageMap)
				{
					if (this.DocInfo.get_OfflineApp())
					{
						var localUrl = _loader_object.ImageMap[i];
						g_oDocumentUrls.addImageUrl(localUrl, this.documentUrl + 'media/' + localUrl);
					}
					++_count;
				}
			}

			_progress.ImagesCount  = _count + AscCommon.g_oUserTexturePresets.length;
			_progress.CurrentImage = 0;
		}
	};
	asc_docs_api.prototype.GenerateStyles                = function()
	{
		return;
	};
	asc_docs_api.prototype.asyncFontsDocumentEndLoaded   = function()
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
		var _st_count = AscCommon.g_oUserTexturePresets.length;
		for (var i = 0; i < _st_count; i++)
			_loader_object.ImageMap[_count + i] = AscCommon.g_oUserTexturePresets[i];

		if (_count > 0)
		{
			this.EndActionLoadImages = 1;
			this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadDocumentImages);
		}

		this.ImageLoader.bIsLoadDocumentFirst = true;
		this.ImageLoader.LoadDocumentImages(_loader_object.ImageMap, true);
	};
	asc_docs_api.prototype.asyncImagesDocumentEndLoaded  = function()
	{
		this.ImageLoader.bIsLoadDocumentFirst = false;
		var _bIsOldPaste                      = this.isPasteFonts_Images;

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
			this.pasteImageMap       = null;
			this.decrementCounterLongAction();
			this.pasteCallback();
			this.pasteCallback            = null;
		}
		else if (this.isSaveFonts_Images)
		{
			this.isSaveFonts_Images = false;
			this.saveImageMap       = null;
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

		var _slides      = this.WordControl.m_oLogicDocument.Slides;
		var _slidesCount = _slides.length;
		for (var i = 0; i < _slidesCount; i++)
		{
			var _comments      = _slides[i].slideComments.comments;
			var _commentsCount = _comments.length;

			for (var j = 0; j < _commentsCount; j++)
			{
				var _id             = _comments[j].Get_Id();
				var _ascCommentData = new asc_CCommentData(_comments[j].Data);

				comms.push({"Id" : _id, "Comment" : _ascCommentData});
			}
		}
		return comms;
	};

	asc_docs_api.prototype.OpenDocumentEndCallback = function()
	{
		var bIsScroll = false;

		if (0 == this.DocumentType)
			this.WordControl.m_oLogicDocument.LoadEmptyDocument();
		else
		{
			if (this.LoadedObject)
			{
				if (this.LoadedObject === 1)
				{
					if (this.isApplyChangesOnOpenEnabled)
					{
						this.isApplyChangesOnOpenEnabled = false;
						this.bNoSendComments             = true;
						var OtherChanges                 = AscCommon.CollaborativeEditing.m_aChanges.length > 0;
						AscCommon.CollaborativeEditing.Apply_Changes();
						AscCommon.CollaborativeEditing.Release_Locks();
						this.bNoSendComments      = false;
						this.isApplyChangesOnOpen = true;
						// Применяем все lock-и (ToDo возможно стоит пересмотреть вообще Lock-и)
						for (var i = 0; i < this.arrPreOpenLocksObjects.length; ++i)
						{
							this.arrPreOpenLocksObjects[i]();
						}
						this.arrPreOpenLocksObjects = [];
						if(OtherChanges && this.isSaveFonts_Images){
							return;
						}
					}
				}
				this.WordControl.m_oLogicDocument.Recalculate({Drawings : {All : true, Map : {}}});
				var presentation = this.WordControl.m_oLogicDocument;

				presentation.DrawingDocument.OnEndRecalculate();

				this.WordControl.m_oLayoutDrawer.IsRetina = this.WordControl.bIsRetinaSupport;

				this.WordControl.m_oLayoutDrawer.WidthMM  = presentation.Width;
				this.WordControl.m_oLayoutDrawer.HeightMM = presentation.Height;
				this.WordControl.m_oMasterDrawer.WidthMM  = presentation.Width;
				this.WordControl.m_oMasterDrawer.HeightMM = presentation.Height;

				if(!window['native'])
				{
					this.WordControl.m_oLogicDocument.GenerateThumbnails(this.WordControl.m_oMasterDrawer, this.WordControl.m_oLayoutDrawer);
				}

				var _masters = this.WordControl.m_oLogicDocument.slideMasters;
				for (var i = 0; i < _masters.length; i++)
				{
					if (_masters[i].ThemeIndex < 0)//только темы презентации
					{
						var theme_load_info    = new AscCommonSlide.CThemeLoadInfo();
						theme_load_info.Master = _masters[i];
						theme_load_info.Theme  = _masters[i].Theme;

						var _lay_cnt = _masters[i].sldLayoutLst.length;
						for (var j = 0; j < _lay_cnt; j++)
							theme_load_info.Layouts[j] = _masters[i].sldLayoutLst[j];

						var th_info       = {};
						th_info.Name      = "Doc Theme " + i;
						th_info.Url       = "";
						th_info.Thumbnail = _masters[i].ImageBase64;

						var th                                                                                = new AscCommonSlide.CAscThemeInfo(th_info);
						this.ThemeLoader.Themes.DocumentThemes[this.ThemeLoader.Themes.DocumentThemes.length] = th;
						th.Index                                                                              = -this.ThemeLoader.Themes.DocumentThemes.length;

						this.ThemeLoader.themes_info_document[this.ThemeLoader.Themes.DocumentThemes.length - 1] = theme_load_info;
					}
				}

				this.sync_InitEditorThemes(this.ThemeLoader.Themes.EditorThemes, this.ThemeLoader.Themes.DocumentThemes);

				this.sendEvent("asc_onPresentationSize", presentation.Width, presentation.Height);

				this.WordControl.GoToPage(0);
				bIsScroll = true;
			}
		}


		this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
		this.WordControl.m_oLogicDocument.Document_UpdateRulersState();
		this.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
		this.LoadedObject       = null;
		this.bInit_word_control = true;
		if (!this.bNoSendComments)
		{
			var _slides      = this.WordControl.m_oLogicDocument.Slides;
			var _slidesCount = _slides.length;
			for (var i = 0; i < _slidesCount; i++)
			{
				var slideComments = _slides[i].slideComments;
				if (slideComments)
				{
					var _comments      = slideComments.comments;
					var _commentsCount = _comments.length;
					for (var j = 0; j < _commentsCount; j++)
					{
						this.sync_AddComment(_comments[j].Get_Id(), _comments[j].Data);
					}
				}
			}
		}
		this.sendEvent("asc_onDocumentContentReady");
		this.isApplyChangesOnOpen = false;

		this.WordControl.InitControl();
		if (bIsScroll)
		{
			this.WordControl.OnScroll();
		}

		if (!this.isViewMode)
		{
			this.sendStandartTextures();
			this.sendMathToMenu();
			if (this.shapeElementId)
			{
				this.WordControl.m_oDrawingDocument.InitGuiCanvasShape(this.shapeElementId);
			}
		}

		if (this.isViewMode)
			this.asc_setViewMode(true);

		// Меняем тип состояния (на никакое)
		this.advancedOptionsAction = AscCommon.c_oAscAdvancedOptionsAction.None;
	};


	asc_docs_api.prototype.asc_AddMath = function(Type)
	{
		var loader   = AscCommon.g_font_loader;
		var fontinfo = AscFonts.g_fontApplication.GetFontInfo("Cambria Math");
		var isasync  = loader.LoadFont(fontinfo);
		if (false === isasync)
		{
			return this.asc_AddMath2(Type);
		}
		else
		{
			this.asyncMethodCallback = function()
			{
				return this.asc_AddMath2(Type);
			}
		}
	};

	asc_docs_api.prototype.asc_AddMath2 = function(Type)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Paragraph_Content))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_AddMath);
			var MathElement = new AscCommonWord.MathMenu(Type);
			this.WordControl.m_oLogicDocument.Paragraph_Add(MathElement, false);
		}
	};

	//----------------------------------------------------------------------------------------------------------------------
	// Работаем с формулами
	//----------------------------------------------------------------------------------------------------------------------
	asc_docs_api.prototype.asc_SetMathProps = function(MathProps)
	{
		this.WordControl.m_oLogicDocument.Set_MathProps(MathProps);
	};



	asc_docs_api.prototype.asyncFontEndLoaded = function(fontinfo)
	{
		this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadFont);

		if (undefined !== this.asyncMethodCallback)
		{
			this.asyncMethodCallback();
			this.asyncMethodCallback = undefined;
			return;
		}

		if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
		{
			History.Create_NewPoint(AscDFH.historydescription_Presentation_ParagraphAdd);
			this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr({
				FontFamily : {
					Name  : fontinfo.Name,
					Index : -1
				}
			}));
		}
	};

	asc_docs_api.prototype.asc_replaceLoadImageCallback = function(fCallback)
	{
		this.asyncImageEndLoaded2 = fCallback;
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

	asc_docs_api.prototype.openDocument = function(sData)
	{
		this.OpenDocument2(sData.url, sData.data);
		this.DocumentOrientation = (null == this.WordControl.m_oLogicDocument) ? true : !this.WordControl.m_oLogicDocument.Orientation;
		this.sync_DocSizeCallback(AscCommon.Page_Width, AscCommon.Page_Height);
		this.sync_PageOrientCallback(this.get_DocumentOrientation());
	};

	asc_docs_api.prototype.get_PresentationWidth  = function()
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
			this.pasteCallback            = null;
			return;
		}

		this.isPasteFonts_Images = true;
		this.FontLoader.LoadDocumentFonts2(_fonts);
	};

	asc_docs_api.prototype.pre_SaveCallback = function()
	{
		AscCommon.CollaborativeEditing.OnEnd_Load_Objects();

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
	asc_docs_api.prototype.ViewScrollToX             = function(x)
	{
		this.WordControl.m_oScrollHorApi.scrollToX(x);
	};
	asc_docs_api.prototype.ViewScrollToY             = function(y)
	{
		this.WordControl.m_oScrollVerApi.scrollToY(y);
	};
	asc_docs_api.prototype.GetDocWidthPx             = function()
	{
		return this.WordControl.m_dDocumentWidth;
	};
	asc_docs_api.prototype.GetDocHeightPx            = function()
	{
		return this.WordControl.m_dDocumentHeight;
	};
	asc_docs_api.prototype.ClearSearch               = function()
	{
		return this.WordControl.m_oDrawingDocument.EndSearch(true);
	};
	asc_docs_api.prototype.GetCurrentVisiblePage     = function()
	{
		return this.WordControl.m_oDrawingDocument.SlideCurrent;
	};

	asc_docs_api.prototype.asc_SetDocumentPlaceChangedEnabled = function(bEnabled)
	{
		if (this.WordControl)
			this.WordControl.m_bDocumentPlaceChangedEnabled = bEnabled;
	};

	asc_docs_api.prototype.asc_SetViewRulers       = function(bRulers)
	{
		//if (false === this.bInit_word_control || true === this.isViewMode)
		//    return;

		if (!this.isLoadFullApi)
		{
			this.tmpViewRulers = bRulers;
			return;
		}

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
	asc_docs_api.prototype.asc_GetViewRulers       = function()
	{
		return this.WordControl.m_bIsRuler;
	};
	asc_docs_api.prototype.asc_SetDocumentUnits    = function(_units)
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
		if (/*this.isMobileVersion*/false)
		{
			this.WordControl.bIsRetinaSupport         = false; // ipad имеет проблемы с большими картинками
			this.WordControl.bIsRetinaNoSupportAttack = true;
			this.WordControl.m_bIsRuler               = false;
			this.ShowParaMarks                        = false;
		}
	};

	asc_docs_api.prototype.GoToHeader = function(pageNumber)
	{
		if (this.WordControl.m_oDrawingDocument.IsFreezePage(pageNumber))
			return;

		var oldClickCount            = global_mouseEvent.ClickCount;
		global_mouseEvent.ClickCount = 2;
		this.WordControl.m_oLogicDocument.OnMouseDown(global_mouseEvent, 0, 0, pageNumber);
		this.WordControl.m_oLogicDocument.OnMouseUp(global_mouseEvent, 0, 0, pageNumber);

		this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();

		global_mouseEvent.ClickCount = oldClickCount;
	};

	asc_docs_api.prototype.changeSlideSize = function(width, height)
	{
		if (this.isMobileVersion && this.WordControl.MobileTouchManager)
			this.WordControl.MobileTouchManager.BeginZoomCheck();

		this.WordControl.m_oLogicDocument.changeSlideSize(width, height);

		if (this.isMobileVersion && this.WordControl.MobileTouchManager)
			this.WordControl.MobileTouchManager.EndZoomCheck();
	};

	asc_docs_api.prototype.AddSlide       = function(layoutIndex)
	{
		this.WordControl.m_oLogicDocument.addNextSlide(layoutIndex);
	};
	asc_docs_api.prototype.DeleteSlide    = function()
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
		var drDoc       = this.WordControl.m_oDrawingDocument;
		var slidesCount = drDoc.SlidesCount;

		for (var i = 0; i < slidesCount; i++)
		{
			this.WordControl.Thumbnails.m_arrPages[i].IsSelected = true;
		}
		this.WordControl.Thumbnails.OnUpdateOverlay();
	};

	asc_docs_api.prototype.AddShape        = function(shapetype)
	{
	};
	asc_docs_api.prototype.ChangeShapeType = function(shapetype)
	{
		this.WordControl.m_oLogicDocument.changeShapeType(shapetype);
	};
	asc_docs_api.prototype.AddText         = function()
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
		this.sendEvent("asc_onMouseMoveStart");
	};

	asc_docs_api.prototype.sync_MouseMoveEndCallback = function()
	{
		this.sendEvent("asc_onMouseMoveEnd");
	};

	asc_docs_api.prototype.sync_MouseMoveCallback = function(Data)
	{
		if (Data.Hyperlink && typeof Data.Hyperlink.Value === "string")
		{
			var indAction = Data.Hyperlink.Value.indexOf("ppaction://hlink");
			var Url       = Data.Hyperlink.Value;
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
					var mask     = "ppaction://hlinksldjumpslide";
					var indSlide = Url.indexOf(mask);
					if (0 == indSlide)
					{
						var slideNum         = parseInt(Url.substring(mask.length));
						Data.Hyperlink.Value = "Slide" + slideNum;
					}
				}
			}
		}
		this.sendEvent("asc_onMouseMove", Data);
	};

	asc_docs_api.prototype.sync_ShowForeignCursorLabel = function(UserId, X, Y, Color)
	{

		this.sendEvent("asc_onShowForeignCursorLabel", UserId, X, Y, new AscCommon.CColor(Color.r, Color.g, Color.b, 255));
	};
	asc_docs_api.prototype.sync_HideForeignCursorLabel = function(UserId)
	{
		this.sendEvent("asc_onHideForeignCursorLabel", UserId);
	};

	asc_docs_api.prototype.ShowThumbnails           = function(bIsShow)
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
			var old                       = this.WordControl.OldSplitter1Pos;
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

		this.sendEvent("asc_onThumbnailsShow", bIsShow);
	};


	//-----------------------------------------------------------------
	// Функции для работы с гиперссылками
	//-----------------------------------------------------------------
	asc_docs_api.prototype.can_AddHyperlink = function()
	{
		//if ( true === CollaborativeEditing.Get_GlobalLock() )
		//    return false;

		var bCanAdd = this.WordControl.m_oLogicDocument.Hyperlink_CanAdd();
		if (true === bCanAdd)
			return this.WordControl.m_oLogicDocument.Get_SelectedText(true);

		return false;
	};

	// HyperProps - объект CHyperlinkProperty
	asc_docs_api.prototype.add_Hyperlink = function(HyperProps)
	{
		this.WordControl.m_oLogicDocument.Hyperlink_Add(HyperProps);
	};

	// HyperProps - объект CHyperlinkProperty
	asc_docs_api.prototype.change_Hyperlink = function(HyperProps)
	{
		this.WordControl.m_oLogicDocument.Hyperlink_Modify(HyperProps);
	};

	asc_docs_api.prototype.remove_Hyperlink = function()
	{
		this.WordControl.m_oLogicDocument.Hyperlink_Remove();
	};

	function CHyperlinkProperty(obj)
	{
		if (obj)
		{
			this.Text    = (undefined != obj.Text   ) ? obj.Text : null;
			this.Value   = (undefined != obj.Value  ) ? obj.Value : "";
			this.ToolTip = (undefined != obj.ToolTip) ? obj.ToolTip : null;
		}
		else
		{
			this.Text    = null;
			this.Value   = "";
			this.ToolTip = null;
		}
	}

	CHyperlinkProperty.prototype.get_Value   = function()
	{
		return this.Value;
	};
	CHyperlinkProperty.prototype.put_Value   = function(v)
	{
		this.Value = v;
	};
	CHyperlinkProperty.prototype.get_ToolTip = function()
	{
		return this.ToolTip;
	};
	CHyperlinkProperty.prototype.put_ToolTip = function(v)
	{
		this.ToolTip = v ? v.slice(0, Asc.c_oAscMaxTooltipLength) : v;
	};
	CHyperlinkProperty.prototype.get_Text    = function()
	{
		return this.Text;
	};
	CHyperlinkProperty.prototype.put_Text    = function(v)
	{
		this.Text = v;
	};

	asc_docs_api.prototype.sync_HyperlinkPropCallback = function(hyperProp)
	{
		this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject(c_oAscTypeSelectElement.Hyperlink, new CHyperlinkProperty(hyperProp));
	};

	asc_docs_api.prototype.sync_HyperlinkClickCallback = function(Url)
	{
		this.sendEvent("asc_onHyperlinkClick", Url);
	};

	asc_docs_api.prototype.sync_CanAddHyperlinkCallback = function(bCanAdd)
	{
		//if ( true === CollaborativeEditing.Get_GlobalLock() )
		//    this.sendEvent("asc_onCanAddHyperlink", false);
		//else
		this.sendEvent("asc_onCanAddHyperlink", bCanAdd);
	};

	asc_docs_api.prototype.sync_DialogAddHyperlink = function()
	{
		this.sendEvent("asc_onDialogAddHyperlink");
	};


	asc_docs_api.prototype.GoToFooter             = function(pageNumber)
	{
		if (this.WordControl.m_oDrawingDocument.IsFreezePage(pageNumber))
			return;

		var oldClickCount            = global_mouseEvent.ClickCount;
		global_mouseEvent.ClickCount = 2;
		this.WordControl.m_oLogicDocument.OnMouseDown(global_mouseEvent, 0, AscCommon.Page_Height, pageNumber);
		this.WordControl.m_oLogicDocument.OnMouseUp(global_mouseEvent, 0, AscCommon.Page_Height, pageNumber);

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
		if (oTextArtProperties && oTextArtProperties.Fill && oTextArtProperties.Fill.fill && oTextArtProperties.Fill.fill.type == c_oAscFill.FILL_TYPE_BLIP)
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

		this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject(c_oAscTypeSelectElement.Shape, obj);
	};

	asc_docs_api.prototype.sync_slidePropCallback = function(slide)
	{
		if (!slide)
			return;

		var obj = new CAscSlideProps();

		var bgFill = slide.backgroundFill;
		// if (slide.cSld && slide.cSld.Bg && slide.cSld.Bg.bgPr)
		//     bgFill = slide.cSld.Bg.bgPr.Fill;

		if (!bgFill)
		{
			obj.Background      = new asc_CShapeFill();
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

        if(slide.timing){
            obj.Timing = slide.timing.createDuplicate();
        }
        else{
            obj.Timing = Asc.CAscSlideTiming();
        }
        obj.Timing.ShowLoop = this.WordControl.m_oLogicDocument.isLoopShowMode();

        obj.lockDelete     = !(slide.deleteLock.Lock.Type === locktype_Mine || slide.deleteLock.Lock.Type === locktype_None);
		obj.lockLayout     = !(slide.layoutLock.Lock.Type === locktype_Mine || slide.layoutLock.Lock.Type === locktype_None);
		obj.lockTiming     = !(slide.timingLock.Lock.Type === locktype_Mine || slide.timingLock.Lock.Type === locktype_None);
		obj.lockTranzition = !(slide.transitionLock.Lock.Type === locktype_Mine || slide.transitionLock.Lock.Type === locktype_None);
		obj.lockBackground = !(slide.backgroundLock.Lock.Type === locktype_Mine || slide.backgroundLock.Lock.Type === locktype_None);
		obj.lockRemove     = obj.lockDelete ||
			obj.lockLayout ||
			obj.lockTiming ||
			obj.lockTranzition ||
			obj.lockBackground || slide.isLockedObject();


		var _len = this.SelectedObjectsStack.length;
		if (_len > 0)
		{
			if (this.SelectedObjectsStack[_len - 1].Type == c_oAscTypeSelectElement.Slide)
			{
				this.SelectedObjectsStack[_len - 1].Value = obj;
				return;
			}
		}

		this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject(c_oAscTypeSelectElement.Slide, obj);
	};

	asc_docs_api.prototype.ExitHeader_Footer = function(pageNumber)
	{
		if (this.WordControl.m_oDrawingDocument.IsFreezePage(pageNumber))
			return;

		var oldClickCount            = global_mouseEvent.ClickCount;
		global_mouseEvent.ClickCount = 2;
		this.WordControl.m_oLogicDocument.OnMouseDown(global_mouseEvent, 0, AscCommon.Page_Height / 2, pageNumber);
		this.WordControl.m_oLogicDocument.OnMouseUp(global_mouseEvent, 0, AscCommon.Page_Height / 2, pageNumber);

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
		return this.sendEvent("asc_onPaintFormatChanged", value);
	};
	asc_docs_api.prototype.ClearFormating           = function()
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

			window.ID_KEYBOARD_AREA.onkeypress = function(e)
			{
				if (false === editor.WordControl.IsFocus)
				{
					editor.WordControl.IsFocus = true;
					var ret                    = editor.WordControl.onKeyPress(e);
					editor.WordControl.IsFocus = false;
					return ret;
				}
			};
			window.ID_KEYBOARD_AREA.onkeydown  = function(e)
			{
				if (false === editor.WordControl.IsFocus)
				{
					editor.WordControl.IsFocus = true;
					var ret                    = editor.WordControl.onKeyDown(e);
					editor.WordControl.IsFocus = false;
					return ret;
				}
			};
		}
		window.ID_KEYBOARD_AREA.focus();
	};
	asc_docs_api.prototype.getViewMode            = function()
	{
		return this.isViewMode;
	};
	asc_docs_api.prototype.asc_setViewMode        = function(isViewMode)
	{
		this.isViewMode = !!isViewMode;
		if (!this.isLoadFullApi)
		{
			return;
		}

		if (isViewMode)
		{
			this.ShowParaMarks          = false;
			this.WordControl.m_bIsRuler = false;
			this.WordControl.m_oDrawingDocument.ClearCachePages();
			this.WordControl.HideRulers();

			if (null != this.WordControl.m_oLogicDocument)
			{
				this.WordControl.m_oLogicDocument.viewMode = true;
			}
		}
		else
		{
			if (this.bInit_word_control === true && this.FontLoader.embedded_cut_manager.bIsCutFontsUse)
			{
				this.isLoadNoCutFonts                               = true;
				this.FontLoader.embedded_cut_manager.bIsCutFontsUse = false;
				this.FontLoader.LoadDocumentFonts(this.WordControl.m_oLogicDocument.Fonts, true);
				return;
			}

			if (this.bInit_word_control === true)
			{
				AscCommon.CollaborativeEditing.Apply_Changes();
				AscCommon.CollaborativeEditing.Release_Locks();
			}

			this.isUseEmbeddedCutFonts = false;

			this.WordControl.checkNeedRules();
			this.WordControl.m_oDrawingDocument.ClearCachePages();
			this.WordControl.OnResize(true);

			if (null != this.WordControl.m_oLogicDocument)
			{
				this.WordControl.m_oLogicDocument.viewMode = false;
			}
		}
	};

	asc_docs_api.prototype.SetUseEmbeddedCutFonts = function(bUse)
	{
		this.isUseEmbeddedCutFonts = bUse;
	};

	asc_docs_api.prototype.can_AddHyperlink            = function()
	{
		var bCanAdd = this.WordControl.m_oLogicDocument.Hyperlink_CanAdd();
		if (true === bCanAdd)
			return this.WordControl.m_oLogicDocument.Get_SelectedText(true);

		return false;
	};
	asc_docs_api.prototype.add_Hyperlink               = function(HyperProps)
	{
		this.WordControl.m_oLogicDocument.Hyperlink_Add(HyperProps);
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
				var mask     = "ppaction://hlinksldjumpslide";
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

		this.sendEvent("asc_onHyperlinkClick", Url);
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
		var _e = AscCommon.CreateMouseUpEventObject(x, y);
		AscCommon.Window_OnMouseUp(_e);

		//this.WordControl.onMouseUpExternal(x, y);
	};

	asc_docs_api.prototype.asyncImageEndLoaded2 = null;

	asc_docs_api.prototype.ChangeTheme = function(indexTheme)
	{
		if (true === AscCommon.CollaborativeEditing.Get_GlobalLock())
			return;

		if (!this.isViewMode && this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Theme) === false)
		{
			AscCommon.CollaborativeEditing.Set_GlobalLock(true);
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Presentation_ChangeTheme);
			this.ThemeLoader.StartLoadTheme(indexTheme);
		}
	};

	asc_docs_api.prototype.StartLoadTheme = function()
	{
	};
	asc_docs_api.prototype.EndLoadTheme   = function(theme_load_info)
	{
		AscCommon.CollaborativeEditing.Set_GlobalLock(false);

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

	asc_docs_api.prototype.put_ShapesAlign        = function(type)
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
	asc_docs_api.prototype.DistributeVertically   = function()
	{
		this.WordControl.m_oLogicDocument.distributeVer();
	};
	asc_docs_api.prototype.shapes_alignLeft       = function()
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

	asc_docs_api.prototype.asc_setLoopShow = function(isLoop)
	{
		this.WordControl.m_oLogicDocument.setShowLoop(isLoop);
	};

	asc_docs_api.prototype.sync_endDemonstration          = function()
	{
		this.sendEvent("asc_onEndDemonstration");
	};
	asc_docs_api.prototype.sync_DemonstrationSlideChanged = function(slideNum)
	{
		this.sendEvent("asc_onDemonstrationSlideChanged", slideNum);
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
		if (undefined !== this.EndShowMessage)
		{
			this.WordControl.DemonstrationManager.EndShowMessage = this.EndShowMessage;
			this.EndShowMessage = undefined;
		}
		this.WordControl.DemonstrationManager.Play();
	};

	asc_docs_api.prototype.DemonstrationPause = function()
	{
		this.WordControl.DemonstrationManager.Pause();
	};

	asc_docs_api.prototype.DemonstrationEndShowMessage = function(message)
	{
		if (!this.WordControl)
			this.EndShowMessage = message;
		else
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

	asc_docs_api.prototype.SetDemonstrationModeOnly = function()
	{
		this.isOnlyDemonstration = true;
	};

	asc_docs_api.prototype.ApplySlideTiming      = function(oTiming)
	{
		if (this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_SlideTiming) === false)
		{
			History.Create_NewPoint(AscDFH.historydescription_Presentation_ApplyTiming);
			var _count = this.WordControl.m_oDrawingDocument.SlidesCount;
			var _cur   = this.WordControl.m_oDrawingDocument.SlideCurrent;
			if (_cur < 0 || _cur >= _count)
				return;
			var _curSlide = this.WordControl.m_oLogicDocument.Slides[_cur];
			_curSlide.applyTiming(oTiming);
            if(oTiming){
                if(AscFormat.isRealBool(oTiming.get_ShowLoop()) && oTiming.get_ShowLoop() !== this.WordControl.m_oLogicDocument.isLoopShowMode()){
                    this.WordControl.m_oLogicDocument.setShowLoop(oTiming.get_ShowLoop());
                }
            }
		}
		this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
	};
	asc_docs_api.prototype.SlideTimingApplyToAll = function()
	{

		if (this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_SlideTiming, {All : true}) === false)
		{
			History.Create_NewPoint(AscDFH.historydescription_Presentation_ApplyTimingToAll);
			var _count  = this.WordControl.m_oDrawingDocument.SlidesCount;
			var _cur    = this.WordControl.m_oDrawingDocument.SlideCurrent;
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
	asc_docs_api.prototype.SlideTransitionPlay   = function()
	{
		var _count = this.WordControl.m_oDrawingDocument.SlidesCount;
		var _cur   = this.WordControl.m_oDrawingDocument.SlideCurrent;
		if (_cur < 0 || _cur >= _count)
			return;
		var _timing = this.WordControl.m_oLogicDocument.Slides[_cur].timing;

		var _tr      = this.WordControl.m_oDrawingDocument.TransitionSlide;
		_tr.Type     = _timing.TransitionType;
		_tr.Param    = _timing.TransitionOption;
		_tr.Duration = _timing.TransitionDuration;

		_tr.Start(true);
	};

	asc_docs_api.prototype.sync_EndAddShape = function()
	{
		editor.sendEvent("asc_onEndAddShape");
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
		if (AscFormat.isObject(chartBinary))
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
		if (AscCommon.isRealObject(chartBinary))
		{
			this.WordControl.m_oLogicDocument.Edit_Chart(chartBinary["binary"]);
		}
	};

	asc_docs_api.prototype.sync_closeChartEditor = function()
	{
		this.sendEvent("asc_onCloseChartEditor");
	};
	asc_docs_api.prototype.asc_setDrawCollaborationMarks = function()
	{
	};

	//-----------------------------------------------------------------
	// События контекстного меню
	//-----------------------------------------------------------------

	function CContextMenuData(oData)
	{
		if (AscCommon.isRealObject(oData))
		{
			this.Type          = oData.Type;
			this.X_abs         = oData.X_abs;
			this.Y_abs         = oData.Y_abs;
			this.IsSlideSelect = oData.IsSlideSelect;
		}
		else
		{
			this.Type          = Asc.c_oAscContextMenuTypes.Main;
			this.X_abs         = 0;
			this.Y_abs         = 0;
			this.IsSlideSelect = true;
		}
	}

	CContextMenuData.prototype.get_Type          = function()
	{
		return this.Type;
	};
	CContextMenuData.prototype.get_X             = function()
	{
		return this.X_abs;
	};
	CContextMenuData.prototype.get_Y             = function()
	{
		return this.Y_abs;
	};
	CContextMenuData.prototype.get_IsSlideSelect = function()
	{
		return this.IsSlideSelect;
	};

	asc_docs_api.prototype.sync_ContextMenuCallback = function(Data)
	{
		this.sendEvent("asc_onContextMenu", Data);
	};

	asc_docs_api.prototype._onNeedParams  = function(data, opt_isPassword)
	{
		if (opt_isPassword) {
			this.sendEvent("asc_onAdvancedOptions", new AscCommon.asc_CAdvancedOptions(c_oAscAdvancedOptionsID.DRM), c_oAscAdvancedOptionsAction.Open);
		}
	};

	asc_docs_api.prototype._onOpenCommand = function(data)
	{
		var t = this;
		AscCommon.openFileCommand(data, this.documentUrlChanges, AscCommon.c_oSerFormat.Signature, function(error, result)
		{
			if (error || !result.bSerFormat)
			{
				t.sendEvent("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.Critical);
				return;
			}
			t.onEndLoadFile(result);
		});
	};
	asc_docs_api.prototype._onEndLoadSdk  = function()
	{
		History           = AscCommon.History;
		PasteElementsId   = AscCommon.PasteElementsId;
		global_mouseEvent = AscCommon.global_mouseEvent;

		g_oTableId.init();
		this.WordControl      = new AscCommonSlide.CEditorPage(this);
		this.WordControl.Name = this.HtmlElementName;

		this.ThemeLoader     = new AscCommonSlide.CThemeLoader();
		this.ThemeLoader.Api = this;

		//выставляем тип copypaste
		PasteElementsId.g_bIsDocumentCopyPaste = false;

		this.CreateComponents();
		this.WordControl.Init();

		if (this.tmpThemesPath)
		{
			this.SetThemesPath(this.tmpThemesPath);
		}
		if (null !== this.tmpIsFreeze)
		{
			this.SetDrawingFreeze(this.tmpIsFreeze);
		}
		if (this.tmpSlideDiv)
		{
			this.SetInterfaceDrawImagePlaceSlide(this.tmpSlideDiv);
		}
		if (this.tmpTextArtDiv)
		{
			this.SetInterfaceDrawImagePlaceTextArt(this.tmpTextArtDiv);
		}
		if (null !== this.tmpViewRulers)
		{
			this.asc_SetViewRulers(this.tmpViewRulers);
		}
		if (null !== this.tmpZoomType)
		{
			switch (this.tmpZoomType)
			{
				case AscCommon.c_oZoomType.FitToPage:
					this.zoomFitToPage();
					break;
				case AscCommon.c_oZoomType.FitToWidth:
					this.zoomFitToWidth();
					break;
				case AscCommon.c_oZoomType.CustomMode:
					this.zoomCustomMode();
					break;
			}
		}

		if (this.isMobileVersion)
			this.SetMobileVersion(true);

		this.asc_setViewMode(this.isViewMode);

		asc_docs_api.superclass._onEndLoadSdk.call(this);
	};

	asc_docs_api.prototype._downloadAs = function(filetype, actionType, options)
	{
		var t = this;
		if (!options)
		{
			options = {};
		}
		if (actionType)
		{
			this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, actionType);
		}

		var dataContainer               = {data : null, part : null, index : 0, count : 0};
		var command                     = "save";
		var oAdditionalData             = {};
		oAdditionalData["c"]            = command;
		oAdditionalData["id"]           = this.documentId;
		oAdditionalData["userid"]       = this.documentUserId;
		oAdditionalData["jwt"]         = this.CoAuthoringApi.get_jwt();
		oAdditionalData["outputformat"] = filetype;
		oAdditionalData["title"]        = AscCommon.changeFileExtention(this.documentTitle, AscCommon.getExtentionByFormat(filetype));
		oAdditionalData["savetype"]     = AscCommon.c_oAscSaveTypes.CompleteAll;
		if (DownloadType.Print === options.downloadType)
		{
			oAdditionalData["inline"] = 1;
		}
		if (c_oAscFileType.PDF == filetype)
		{
			var dd             = this.WordControl.m_oDrawingDocument;
			dataContainer.data = dd.ToRendererPart();
		}
		else
			dataContainer.data = this.WordControl.SaveDocument();
		var fCallback     = function(input)
		{
			var error = c_oAscError.ID.Unknown;
			if (null != input && command == input["type"])
			{
				if ('ok' == input["status"])
				{
					var url = input["data"];
					if (url)
					{
						error = c_oAscError.ID.No;
						t.processSavedFile(url, options.downloadType);
					}
				}
				else
				{
					error = mapAscServerErrorToAscError(parseInt(input["data"]),
						AscCommon.c_oAscAdvancedOptionsAction.Save);
				}
			}
			if (c_oAscError.ID.No != error)
			{
				t.sendEvent("asc_onError", error, c_oAscError.Level.NoCritical);
			}
			if (actionType)
			{
				t.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, actionType);
			}
		};
		this.fCurCallback = fCallback;
		AscCommon.saveWithParts(function(fCallback1, oAdditionalData1, dataContainer1)
		{
			sendCommand(t, fCallback1, oAdditionalData1, dataContainer1);
		}, fCallback, null, oAdditionalData, dataContainer);
	};



	asc_docs_api.prototype.asc_Recalculate = function(bIsUpdateInterface)
	{
		if (!this.WordControl.m_oLogicDocument)
			return;
		this.WordControl.m_oLogicDocument.Recalculate({Drawings : {All : true, Map : {}}});
		this.WordControl.m_oLogicDocument.DrawingDocument.OnEndRecalculate();
	};

	asc_docs_api.prototype.asc_canPaste = function()
	{
		if (!this.WordControl ||
			!this.WordControl.m_oLogicDocument ||
			this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Drawing_Props))
			return false;

		this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_AddSectionBreak);
		return true;
	};

	// input
	asc_docs_api.prototype.Begin_CompositeInput = function()
	{
		if (this.WordControl.m_oLogicDocument)
			return this.WordControl.m_oLogicDocument.Begin_CompositeInput();
		return null;
	};
	asc_docs_api.prototype.Add_CompositeText = function(nCharCode)
	{
		if (this.WordControl.m_oLogicDocument)
			return this.WordControl.m_oLogicDocument.Add_CompositeText(nCharCode);
		return null;
	};
	asc_docs_api.prototype.Remove_CompositeText = function(nCount)
	{
		if (this.WordControl.m_oLogicDocument)
			return this.WordControl.m_oLogicDocument.Remove_CompositeText(nCount);
		return null;
	};
	asc_docs_api.prototype.Replace_CompositeText = function(arrCharCodes)
	{
		if (this.WordControl.m_oLogicDocument)
			return this.WordControl.m_oLogicDocument.Replace_CompositeText(arrCharCodes);
		return null;
	};
	asc_docs_api.prototype.Set_CursorPosInCompositeText = function(nPos)
	{
		if (this.WordControl.m_oLogicDocument)
			return this.WordControl.m_oLogicDocument.Set_CursorPosInCompositeText(nPos);
		return null;
	};
	asc_docs_api.prototype.Get_CursorPosInCompositeText = function()
	{
		if (this.WordControl.m_oLogicDocument)
			return this.WordControl.m_oLogicDocument.Get_CursorPosInCompositeText();
		return 0;
	};
	asc_docs_api.prototype.End_CompositeInput = function()
	{
		if (this.WordControl.m_oLogicDocument)
			return this.WordControl.m_oLogicDocument.End_CompositeInput();
		return null;
	};
	asc_docs_api.prototype.Get_MaxCursorPosInCompositeText = function()
	{
		if (this.WordControl.m_oLogicDocument)
			return this.WordControl.m_oLogicDocument.Get_MaxCursorPosInCompositeText();
		return 0;
	};
	asc_docs_api.prototype.Input_UpdatePos = function()
	{
		if (this.WordControl.m_oLogicDocument)
			this.WordControl.m_oDrawingDocument.MoveTargetInInputContext();
	};

	asc_docs_api.prototype.onKeyDown = function(e)
	{
		return this.WordControl.onKeyDown(e);
	};
	asc_docs_api.prototype.onKeyPress = function(e)
	{
		return this.WordControl.onKeyPress(e);
	};
	asc_docs_api.prototype.onKeyUp = function(e)
	{
		return this.WordControl.onKeyUp(e);
	};
	//test
	window["asc_docs_api"]                                 = asc_docs_api;
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
	};

	window["asc_docs_api"].prototype["asc_nativeCalculateFile"] = function()
	{
		this.bNoSendComments = false;
		this.ShowParaMarks   = false;

		var presentation = this.WordControl.m_oLogicDocument;
		presentation.Recalculate({Drawings : {All : true, Map : {}}});
		presentation.DrawingDocument.OnEndRecalculate();
	};

	window["asc_docs_api"].prototype["asc_nativeApplyChanges"] = function(changes)
	{
		var _len = changes.length;
		for (var i = 0; i < _len; i++)
		{
			var Changes = new AscCommon.CCollaborativeChanges();
			Changes.Set_Data(changes[i]);
			AscCommon.CollaborativeEditing.Add_Changes(Changes);
		}
		AscCommon.CollaborativeEditing.Apply_OtherChanges();
	};

	window["asc_docs_api"].prototype["asc_nativeApplyChanges2"] = function(data, isFull)
	{
		// Чтобы заново созданные параграфы не отображались залоченными
		g_oIdCounter.Set_Load(true);

		var stream = new AscCommon.FT_Stream2(data, data.length);
		stream.obj = null;
		var Loader = {Reader : stream, Reader2 : null};
		var _color = new AscCommonWord.CDocumentColor(191, 255, 199);

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

            var nChangeLen = stream.GetLong();
            _pos += 4;
            stream.size = _pos + nChangeLen;

            var ClassId = stream.GetString2();
            var Class   = AscCommon.g_oTableId.Get_ById(ClassId);

            var nReaderPos  = stream.GetCurPos();
            var nChangeType = stream.GetLong();

            if (Class)
            {
                var fChangesClass = AscDFH.changesFactory[nChangeType];
                if (fChangesClass)
                {
                    var oChange = new fChangesClass(Class);
                    oChange.ReadFromBinary(stream);

                    if (true === AscCommon.CollaborativeEditing.private_AddOverallChange(oChange))
                        oChange.Load(_color);
                }
                else
                {
                    AscCommon.CollaborativeEditing.private_AddOverallChange(data);

                    stream.Seek(nReaderPos);
                    stream.Seek2(nReaderPos);

                    Class.Load_Changes(stream, null, _color);
                }
            }

            _pos += nChangeLen;
            stream.Seek2(_pos);
            stream.size = data.length;
		}

		if (isFull)
		{
			AscCommon.CollaborativeEditing.m_aChanges = [];

			// У новых элементов выставляем указатели на другие классы
			AscCommon.CollaborativeEditing.Apply_LinkData();

			// Делаем проверки корректности новых изменений
			AscCommon.CollaborativeEditing.Check_MergeData();

			AscCommon.CollaborativeEditing.OnEnd_ReadForeignChanges();
		}

		g_oIdCounter.Set_Load(false);
	};

	window["asc_docs_api"].prototype["asc_nativeGetFile"] = function()
	{
		var writer = new AscCommon.CBinaryFileWriter();
		this.WordControl.m_oLogicDocument.CalculateComments();
		return writer.WriteDocument(this.WordControl.m_oLogicDocument);
	};

	window["asc_docs_api"].prototype["asc_nativeGetFileData"] = function()
	{
		var writer = new AscCommon.CBinaryFileWriter();
		this.WordControl.m_oLogicDocument.CalculateComments();
		writer.WriteDocument2(this.WordControl.m_oLogicDocument);

		var _header = "PPTY;v1;" + writer.pos + ";";
		window["native"]["Save_End"](_header, writer.pos);

		return writer.ImData.data;
	};

	window["asc_docs_api"].prototype["asc_nativeCheckPdfRenderer"] = function(_memory1, _memory2)
	{
		if (true)
		{
			// pos не должен минимизироваться!!!

			_memory1.Copy          = _memory1["Copy"];
			_memory1.ClearNoAttack = _memory1["ClearNoAttack"];
			_memory1.WriteByte     = _memory1["WriteByte"];
			_memory1.WriteBool     = _memory1["WriteBool"];
			_memory1.WriteLong     = _memory1["WriteLong"];
			_memory1.WriteDouble   = _memory1["WriteDouble"];
			_memory1.WriteString   = _memory1["WriteString"];
			_memory1.WriteString2  = _memory1["WriteString2"];

			_memory2.Copy          = _memory1["Copy"];
			_memory2.ClearNoAttack = _memory1["ClearNoAttack"];
			_memory2.WriteByte     = _memory1["WriteByte"];
			_memory2.WriteBool     = _memory1["WriteBool"];
			_memory2.WriteLong     = _memory1["WriteLong"];
			_memory2.WriteDouble   = _memory1["WriteDouble"];
			_memory2.WriteString   = _memory1["WriteString"];
			_memory2.WriteString2  = _memory1["WriteString2"];
		}

		var _printer                  = new AscCommon.CDocumentRenderer();
		_printer.Memory               = _memory1;
		_printer.VectorMemoryForPrint = _memory2;
		return _printer;
	};

	window["asc_docs_api"].prototype["asc_nativeCalculate"] = function()
	{
	};

	window["asc_docs_api"].prototype["asc_nativePrint"] = function(_printer, _page)
	{
		if (undefined === _printer && _page === undefined)
		{
			if (undefined !== window["AscDesktopEditor"])
			{
				var _drawing_document = this.WordControl.m_oDrawingDocument;
				var pagescount        = _drawing_document.SlidesCount;

				window["AscDesktopEditor"]["Print_Start"](this.DocumentUrl, pagescount, this.ThemeLoader.ThemesUrl, this.getCurrentPage());

				var oDocRenderer                         = new AscCommon.CDocumentRenderer();
				oDocRenderer.VectorMemoryForPrint        = new AscCommon.CMemory();
				var bOldShowMarks                        = this.ShowParaMarks;
				this.ShowParaMarks                       = false;
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
	};

	window["asc_docs_api"].prototype["asc_nativePrintPagesCount"] = function()
	{
		return this.WordControl.m_oDrawingDocument.SlidesCount;
	};

	window["asc_docs_api"].prototype["asc_nativeGetPDF"] = function(_param)
	{
		var pagescount = this["asc_nativePrintPagesCount"]();
		if (0x0100 & _param)
		    pagescount = 1;

		var _renderer                         = new AscCommon.CDocumentRenderer();
		_renderer.VectorMemoryForPrint        = new AscCommon.CMemory();
		var _bOldShowMarks                    = this.ShowParaMarks;
		this.ShowParaMarks                    = false;
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

	//-------------------------------------------------------------export---------------------------------------------------
	window['Asc']                                                 = window['Asc'] || {};
	window['AscCommonSlide']                                      = window['AscCommonSlide'] || {};
	window['Asc']['asc_docs_api']                                 = asc_docs_api;
	asc_docs_api.prototype['asc_GetFontThumbnailsPath']           = asc_docs_api.prototype.asc_GetFontThumbnailsPath;
	asc_docs_api.prototype['pre_Save']                            = asc_docs_api.prototype.pre_Save;
	asc_docs_api.prototype['sync_CollaborativeChanges']           = asc_docs_api.prototype.sync_CollaborativeChanges;
	asc_docs_api.prototype['asc_coAuthoringDisconnect']           = asc_docs_api.prototype.asc_coAuthoringDisconnect;
	asc_docs_api.prototype['asc_coAuthoringChatSendMessage']      = asc_docs_api.prototype.asc_coAuthoringChatSendMessage;
	asc_docs_api.prototype['asc_coAuthoringChatGetMessages']      = asc_docs_api.prototype.asc_coAuthoringChatGetMessages;
	asc_docs_api.prototype['asc_coAuthoringGetUsers']             = asc_docs_api.prototype.asc_coAuthoringGetUsers;
	asc_docs_api.prototype['syncCollaborativeChanges']            = asc_docs_api.prototype.syncCollaborativeChanges;
	asc_docs_api.prototype['SetCollaborativeMarksShowType']       = asc_docs_api.prototype.SetCollaborativeMarksShowType;
	asc_docs_api.prototype['GetCollaborativeMarksShowType']       = asc_docs_api.prototype.GetCollaborativeMarksShowType;
	asc_docs_api.prototype['Clear_CollaborativeMarks']            = asc_docs_api.prototype.Clear_CollaborativeMarks;
	asc_docs_api.prototype['_onUpdateDocumentCanSave']            = asc_docs_api.prototype._onUpdateDocumentCanSave;
	asc_docs_api.prototype['SetUnchangedDocument']                = asc_docs_api.prototype.SetUnchangedDocument;
	asc_docs_api.prototype['SetDocumentModified']                 = asc_docs_api.prototype.SetDocumentModified;
	asc_docs_api.prototype['isDocumentModified']                  = asc_docs_api.prototype.isDocumentModified;
	asc_docs_api.prototype['asc_isDocumentCanSave']               = asc_docs_api.prototype.asc_isDocumentCanSave;
	asc_docs_api.prototype['sync_BeginCatchSelectedElements']     = asc_docs_api.prototype.sync_BeginCatchSelectedElements;
	asc_docs_api.prototype['sync_EndCatchSelectedElements']       = asc_docs_api.prototype.sync_EndCatchSelectedElements;
	asc_docs_api.prototype['getSelectedElements']                 = asc_docs_api.prototype.getSelectedElements;
	asc_docs_api.prototype['sync_ChangeLastSelectedElement']      = asc_docs_api.prototype.sync_ChangeLastSelectedElement;
	asc_docs_api.prototype['asc_getEditorPermissions']            = asc_docs_api.prototype.asc_getEditorPermissions;
	asc_docs_api.prototype['asc_setDocInfo']                      = asc_docs_api.prototype.asc_setDocInfo;
	asc_docs_api.prototype['asc_setLocale']                       = asc_docs_api.prototype.asc_setLocale;
	asc_docs_api.prototype['asc_LoadDocument']                    = asc_docs_api.prototype.asc_LoadDocument;
	asc_docs_api.prototype['SetThemesPath']                       = asc_docs_api.prototype.SetThemesPath;
	asc_docs_api.prototype['InitEditor']                          = asc_docs_api.prototype.InitEditor;
	asc_docs_api.prototype['SetInterfaceDrawImagePlaceSlide']     = asc_docs_api.prototype.SetInterfaceDrawImagePlaceSlide;
	asc_docs_api.prototype['SetInterfaceDrawImagePlaceTextArt']   = asc_docs_api.prototype.SetInterfaceDrawImagePlaceTextArt;
	asc_docs_api.prototype['OpenDocument2']                       = asc_docs_api.prototype.OpenDocument2;
	asc_docs_api.prototype['asc_getDocumentName']                 = asc_docs_api.prototype.asc_getDocumentName;
	asc_docs_api.prototype['asc_registerCallback']                = asc_docs_api.prototype.asc_registerCallback;
	asc_docs_api.prototype['asc_unregisterCallback']              = asc_docs_api.prototype.asc_unregisterCallback;
	asc_docs_api.prototype['asc_checkNeedCallback']               = asc_docs_api.prototype.asc_checkNeedCallback;
	asc_docs_api.prototype['get_TextProps']                       = asc_docs_api.prototype.get_TextProps;
	asc_docs_api.prototype['asc_getPropertyEditorShapes']         = asc_docs_api.prototype.asc_getPropertyEditorShapes;
	asc_docs_api.prototype['asc_getPropertyEditorTextArts']       = asc_docs_api.prototype.asc_getPropertyEditorTextArts;
	asc_docs_api.prototype['get_PropertyEditorThemes']            = asc_docs_api.prototype.get_PropertyEditorThemes;
	asc_docs_api.prototype['get_ContentCount']                    = asc_docs_api.prototype.get_ContentCount;
	asc_docs_api.prototype['UpdateTextPr']                        = asc_docs_api.prototype.UpdateTextPr;
	asc_docs_api.prototype['sync_TextSpacing']                    = asc_docs_api.prototype.sync_TextSpacing;
	asc_docs_api.prototype['sync_TextDStrikeout']                 = asc_docs_api.prototype.sync_TextDStrikeout;
	asc_docs_api.prototype['sync_TextCaps']                       = asc_docs_api.prototype.sync_TextCaps;
	asc_docs_api.prototype['sync_TextSmallCaps']                  = asc_docs_api.prototype.sync_TextSmallCaps;
	asc_docs_api.prototype['sync_TextPosition']                   = asc_docs_api.prototype.sync_TextPosition;
	asc_docs_api.prototype['sync_TextLangCallBack']               = asc_docs_api.prototype.sync_TextLangCallBack;
	asc_docs_api.prototype['sync_VerticalTextAlign']              = asc_docs_api.prototype.sync_VerticalTextAlign;
	asc_docs_api.prototype['sync_Vert']                           = asc_docs_api.prototype.sync_Vert;
	asc_docs_api.prototype['UpdateParagraphProp']                 = asc_docs_api.prototype.UpdateParagraphProp;
	asc_docs_api.prototype['asc_Print']                           = asc_docs_api.prototype.asc_Print;
	asc_docs_api.prototype['Undo']                                = asc_docs_api.prototype.Undo;
	asc_docs_api.prototype['Redo']                                = asc_docs_api.prototype.Redo;
	asc_docs_api.prototype['Copy']                                = asc_docs_api.prototype.Copy;
	asc_docs_api.prototype['Update_ParaTab']                      = asc_docs_api.prototype.Update_ParaTab;
	asc_docs_api.prototype['Cut']                                 = asc_docs_api.prototype.Cut;
	asc_docs_api.prototype['Paste']                               = asc_docs_api.prototype.Paste;
	asc_docs_api.prototype['Share']                               = asc_docs_api.prototype.Share;
	asc_docs_api.prototype['asc_Save']                            = asc_docs_api.prototype.asc_Save;
	asc_docs_api.prototype['forceSave']                           = asc_docs_api.prototype.forceSave;
	asc_docs_api.prototype['asc_setIsForceSaveOnUserSave']        = asc_docs_api.prototype.asc_setIsForceSaveOnUserSave;
	asc_docs_api.prototype['asc_DownloadAs']                      = asc_docs_api.prototype.asc_DownloadAs;
	asc_docs_api.prototype['Resize']                              = asc_docs_api.prototype.Resize;
	asc_docs_api.prototype['AddURL']                              = asc_docs_api.prototype.AddURL;
	asc_docs_api.prototype['Help']                                = asc_docs_api.prototype.Help;
	asc_docs_api.prototype['startGetDocInfo']                     = asc_docs_api.prototype.startGetDocInfo;
	asc_docs_api.prototype['asc_setAdvancedOptions']              = asc_docs_api.prototype.asc_setAdvancedOptions;
	asc_docs_api.prototype['stopGetDocInfo']                      = asc_docs_api.prototype.stopGetDocInfo;
	asc_docs_api.prototype['sync_DocInfoCallback']                = asc_docs_api.prototype.sync_DocInfoCallback;
	asc_docs_api.prototype['sync_GetDocInfoStartCallback']        = asc_docs_api.prototype.sync_GetDocInfoStartCallback;
	asc_docs_api.prototype['sync_GetDocInfoStopCallback']         = asc_docs_api.prototype.sync_GetDocInfoStopCallback;
	asc_docs_api.prototype['sync_GetDocInfoEndCallback']          = asc_docs_api.prototype.sync_GetDocInfoEndCallback;
	asc_docs_api.prototype['sync_CanUndoCallback']                = asc_docs_api.prototype.sync_CanUndoCallback;
	asc_docs_api.prototype['sync_CanRedoCallback']                = asc_docs_api.prototype.sync_CanRedoCallback;
	asc_docs_api.prototype['sync_CursorLockCallBack']             = asc_docs_api.prototype.sync_CursorLockCallBack;
	asc_docs_api.prototype['sync_UndoCallBack']                   = asc_docs_api.prototype.sync_UndoCallBack;
	asc_docs_api.prototype['sync_RedoCallBack']                   = asc_docs_api.prototype.sync_RedoCallBack;
	asc_docs_api.prototype['sync_CopyCallBack']                   = asc_docs_api.prototype.sync_CopyCallBack;
	asc_docs_api.prototype['sync_CutCallBack']                    = asc_docs_api.prototype.sync_CutCallBack;
	asc_docs_api.prototype['sync_PasteCallBack']                  = asc_docs_api.prototype.sync_PasteCallBack;
	asc_docs_api.prototype['sync_ShareCallBack']                  = asc_docs_api.prototype.sync_ShareCallBack;
	asc_docs_api.prototype['sync_SaveCallBack']                   = asc_docs_api.prototype.sync_SaveCallBack;
	asc_docs_api.prototype['sync_DownloadAsCallBack']             = asc_docs_api.prototype.sync_DownloadAsCallBack;
	asc_docs_api.prototype['sync_StartAction']                    = asc_docs_api.prototype.sync_StartAction;
	asc_docs_api.prototype['sync_EndAction']                      = asc_docs_api.prototype.sync_EndAction;
	asc_docs_api.prototype['sync_AddURLCallback']                 = asc_docs_api.prototype.sync_AddURLCallback;
	asc_docs_api.prototype['sync_ErrorCallback']                  = asc_docs_api.prototype.sync_ErrorCallback;
	asc_docs_api.prototype['sync_HelpCallback']                   = asc_docs_api.prototype.sync_HelpCallback;
	asc_docs_api.prototype['sync_UpdateZoom']                     = asc_docs_api.prototype.sync_UpdateZoom;
	asc_docs_api.prototype['ClearPropObjCallback']                = asc_docs_api.prototype.ClearPropObjCallback;
	asc_docs_api.prototype['CollectHeaders']                      = asc_docs_api.prototype.CollectHeaders;
	asc_docs_api.prototype['GetActiveHeader']                     = asc_docs_api.prototype.GetActiveHeader;
	asc_docs_api.prototype['gotoHeader']                          = asc_docs_api.prototype.gotoHeader;
	asc_docs_api.prototype['sync_ChangeActiveHeaderCallback']     = asc_docs_api.prototype.sync_ChangeActiveHeaderCallback;
	asc_docs_api.prototype['sync_ReturnHeadersCallback']          = asc_docs_api.prototype.sync_ReturnHeadersCallback;
	asc_docs_api.prototype['startSearchText']                     = asc_docs_api.prototype.startSearchText;
	asc_docs_api.prototype['goToNextSearchResult']                = asc_docs_api.prototype.goToNextSearchResult;
	asc_docs_api.prototype['gotoSearchResultText']                = asc_docs_api.prototype.gotoSearchResultText;
	asc_docs_api.prototype['stopSearchText']                      = asc_docs_api.prototype.stopSearchText;
	asc_docs_api.prototype['findText']                            = asc_docs_api.prototype.findText;
	asc_docs_api.prototype['asc_searchEnabled']                   = asc_docs_api.prototype.asc_searchEnabled;
	asc_docs_api.prototype['asc_findText']                        = asc_docs_api.prototype.asc_findText;
	asc_docs_api.prototype['sync_SearchFoundCallback']            = asc_docs_api.prototype.sync_SearchFoundCallback;
	asc_docs_api.prototype['sync_SearchStartCallback']            = asc_docs_api.prototype.sync_SearchStartCallback;
	asc_docs_api.prototype['sync_SearchStopCallback']             = asc_docs_api.prototype.sync_SearchStopCallback;
	asc_docs_api.prototype['sync_SearchEndCallback']              = asc_docs_api.prototype.sync_SearchEndCallback;
	asc_docs_api.prototype['put_TextPrFontName']                  = asc_docs_api.prototype.put_TextPrFontName;
	asc_docs_api.prototype['put_TextPrFontSize']                  = asc_docs_api.prototype.put_TextPrFontSize;
	asc_docs_api.prototype['put_TextPrBold']                      = asc_docs_api.prototype.put_TextPrBold;
	asc_docs_api.prototype['put_TextPrItalic']                    = asc_docs_api.prototype.put_TextPrItalic;
	asc_docs_api.prototype['put_TextPrUnderline']                 = asc_docs_api.prototype.put_TextPrUnderline;
	asc_docs_api.prototype['put_TextPrStrikeout']                 = asc_docs_api.prototype.put_TextPrStrikeout;
	asc_docs_api.prototype['put_PrLineSpacing']                   = asc_docs_api.prototype.put_PrLineSpacing;
	asc_docs_api.prototype['put_LineSpacingBeforeAfter']          = asc_docs_api.prototype.put_LineSpacingBeforeAfter;
	asc_docs_api.prototype['FontSizeIn']                          = asc_docs_api.prototype.FontSizeIn;
	asc_docs_api.prototype['FontSizeOut']                         = asc_docs_api.prototype.FontSizeOut;
	asc_docs_api.prototype['put_AlignBySelect']                   = asc_docs_api.prototype.put_AlignBySelect;
	asc_docs_api.prototype['get_AlignBySelect']                   = asc_docs_api.prototype.get_AlignBySelect;
	asc_docs_api.prototype['sync_BoldCallBack']                   = asc_docs_api.prototype.sync_BoldCallBack;
	asc_docs_api.prototype['sync_ItalicCallBack']                 = asc_docs_api.prototype.sync_ItalicCallBack;
	asc_docs_api.prototype['sync_UnderlineCallBack']              = asc_docs_api.prototype.sync_UnderlineCallBack;
	asc_docs_api.prototype['sync_StrikeoutCallBack']              = asc_docs_api.prototype.sync_StrikeoutCallBack;
	asc_docs_api.prototype['sync_TextPrFontFamilyCallBack']       = asc_docs_api.prototype.sync_TextPrFontFamilyCallBack;
	asc_docs_api.prototype['sync_TextPrFontSizeCallBack']         = asc_docs_api.prototype.sync_TextPrFontSizeCallBack;
	asc_docs_api.prototype['sync_PrLineSpacingCallBack']          = asc_docs_api.prototype.sync_PrLineSpacingCallBack;
	asc_docs_api.prototype['sync_InitEditorThemes']               = asc_docs_api.prototype.sync_InitEditorThemes;
	asc_docs_api.prototype['sync_InitEditorTableStyles']          = asc_docs_api.prototype.sync_InitEditorTableStyles;
	asc_docs_api.prototype['paraApply']                           = asc_docs_api.prototype.paraApply;
	asc_docs_api.prototype['put_PrAlign']                         = asc_docs_api.prototype.put_PrAlign;
	asc_docs_api.prototype['put_TextPrBaseline']                  = asc_docs_api.prototype.put_TextPrBaseline;
	asc_docs_api.prototype['put_ListType']                        = asc_docs_api.prototype.put_ListType;
	asc_docs_api.prototype['put_ShowSnapLines']                   = asc_docs_api.prototype.put_ShowSnapLines;
	asc_docs_api.prototype['get_ShowSnapLines']                   = asc_docs_api.prototype.get_ShowSnapLines;
	asc_docs_api.prototype['put_ShowParaMarks']                   = asc_docs_api.prototype.put_ShowParaMarks;
	asc_docs_api.prototype['get_ShowParaMarks']                   = asc_docs_api.prototype.get_ShowParaMarks;
	asc_docs_api.prototype['put_ShowTableEmptyLine']              = asc_docs_api.prototype.put_ShowTableEmptyLine;
	asc_docs_api.prototype['get_ShowTableEmptyLine']              = asc_docs_api.prototype.get_ShowTableEmptyLine;
	asc_docs_api.prototype['ShapeApply']                          = asc_docs_api.prototype.ShapeApply;
	asc_docs_api.prototype['setStartPointHistory']                = asc_docs_api.prototype.setStartPointHistory;
	asc_docs_api.prototype['setEndPointHistory']                  = asc_docs_api.prototype.setEndPointHistory;
	asc_docs_api.prototype['SetSlideProps']                       = asc_docs_api.prototype.SetSlideProps;
	asc_docs_api.prototype['put_LineCap']                         = asc_docs_api.prototype.put_LineCap;
	asc_docs_api.prototype['put_LineJoin']                        = asc_docs_api.prototype.put_LineJoin;
	asc_docs_api.prototype['put_LineBeginStyle']                  = asc_docs_api.prototype.put_LineBeginStyle;
	asc_docs_api.prototype['put_LineBeginSize']                   = asc_docs_api.prototype.put_LineBeginSize;
	asc_docs_api.prototype['put_LineEndStyle']                    = asc_docs_api.prototype.put_LineEndStyle;
	asc_docs_api.prototype['put_LineEndSize']                     = asc_docs_api.prototype.put_LineEndSize;
	asc_docs_api.prototype['put_TextColor2']                      = asc_docs_api.prototype.put_TextColor2;
	asc_docs_api.prototype['put_TextColor']                       = asc_docs_api.prototype.put_TextColor;
	asc_docs_api.prototype['put_PrIndent']                        = asc_docs_api.prototype.put_PrIndent;
	asc_docs_api.prototype['IncreaseIndent']                      = asc_docs_api.prototype.IncreaseIndent;
	asc_docs_api.prototype['DecreaseIndent']                      = asc_docs_api.prototype.DecreaseIndent;
	asc_docs_api.prototype['put_PrIndentRight']                   = asc_docs_api.prototype.put_PrIndentRight;
	asc_docs_api.prototype['put_PrFirstLineIndent']               = asc_docs_api.prototype.put_PrFirstLineIndent;
	asc_docs_api.prototype['getFocusObject']                      = asc_docs_api.prototype.getFocusObject;
	asc_docs_api.prototype['sync_VerticalAlign']                  = asc_docs_api.prototype.sync_VerticalAlign;
	asc_docs_api.prototype['sync_PrAlignCallBack']                = asc_docs_api.prototype.sync_PrAlignCallBack;
	asc_docs_api.prototype['sync_ListType']                       = asc_docs_api.prototype.sync_ListType;
	asc_docs_api.prototype['sync_TextColor']                      = asc_docs_api.prototype.sync_TextColor;
	asc_docs_api.prototype['sync_TextColor2']                     = asc_docs_api.prototype.sync_TextColor2;
	asc_docs_api.prototype['sync_TextHighLight']                  = asc_docs_api.prototype.sync_TextHighLight;
	asc_docs_api.prototype['sync_ParaStyleName']                  = asc_docs_api.prototype.sync_ParaStyleName;
	asc_docs_api.prototype['sync_ParaSpacingLine']                = asc_docs_api.prototype.sync_ParaSpacingLine;
	asc_docs_api.prototype['sync_PageBreakCallback']              = asc_docs_api.prototype.sync_PageBreakCallback;
	asc_docs_api.prototype['sync_KeepLinesCallback']              = asc_docs_api.prototype.sync_KeepLinesCallback;
	asc_docs_api.prototype['sync_ShowParaMarksCallback']          = asc_docs_api.prototype.sync_ShowParaMarksCallback;
	asc_docs_api.prototype['sync_SpaceBetweenPrgCallback']        = asc_docs_api.prototype.sync_SpaceBetweenPrgCallback;
	asc_docs_api.prototype['sync_PrPropCallback']                 = asc_docs_api.prototype.sync_PrPropCallback;
	asc_docs_api.prototype['SetDrawImagePlaceParagraph']          = asc_docs_api.prototype.SetDrawImagePlaceParagraph;
	asc_docs_api.prototype['get_DocumentOrientation']             = asc_docs_api.prototype.get_DocumentOrientation;
	asc_docs_api.prototype['put_AddPageBreak']                    = asc_docs_api.prototype.put_AddPageBreak;
	asc_docs_api.prototype['Update_ParaInd']                      = asc_docs_api.prototype.Update_ParaInd;
	asc_docs_api.prototype['Internal_Update_Ind_FirstLine']       = asc_docs_api.prototype.Internal_Update_Ind_FirstLine;
	asc_docs_api.prototype['Internal_Update_Ind_Left']            = asc_docs_api.prototype.Internal_Update_Ind_Left;
	asc_docs_api.prototype['Internal_Update_Ind_Right']           = asc_docs_api.prototype.Internal_Update_Ind_Right;
	asc_docs_api.prototype['sync_DocSizeCallback']                = asc_docs_api.prototype.sync_DocSizeCallback;
	asc_docs_api.prototype['sync_PageOrientCallback']             = asc_docs_api.prototype.sync_PageOrientCallback;
	asc_docs_api.prototype['sync_HeadersAndFootersPropCallback']  = asc_docs_api.prototype.sync_HeadersAndFootersPropCallback;
	asc_docs_api.prototype['put_Table']                           = asc_docs_api.prototype.put_Table;
	asc_docs_api.prototype['addRowAbove']                         = asc_docs_api.prototype.addRowAbove;
	asc_docs_api.prototype['addRowBelow']                         = asc_docs_api.prototype.addRowBelow;
	asc_docs_api.prototype['addColumnLeft']                       = asc_docs_api.prototype.addColumnLeft;
	asc_docs_api.prototype['addColumnRight']                      = asc_docs_api.prototype.addColumnRight;
	asc_docs_api.prototype['remRow']                              = asc_docs_api.prototype.remRow;
	asc_docs_api.prototype['remColumn']                           = asc_docs_api.prototype.remColumn;
	asc_docs_api.prototype['remTable']                            = asc_docs_api.prototype.remTable;
	asc_docs_api.prototype['selectRow']                           = asc_docs_api.prototype.selectRow;
	asc_docs_api.prototype['selectColumn']                        = asc_docs_api.prototype.selectColumn;
	asc_docs_api.prototype['selectCell']                          = asc_docs_api.prototype.selectCell;
	asc_docs_api.prototype['selectTable']                         = asc_docs_api.prototype.selectTable;
	asc_docs_api.prototype['setColumnWidth']                      = asc_docs_api.prototype.setColumnWidth;
	asc_docs_api.prototype['setRowHeight']                        = asc_docs_api.prototype.setRowHeight;
	asc_docs_api.prototype['set_TblDistanceFromText']             = asc_docs_api.prototype.set_TblDistanceFromText;
	asc_docs_api.prototype['CheckBeforeMergeCells']               = asc_docs_api.prototype.CheckBeforeMergeCells;
	asc_docs_api.prototype['CheckBeforeSplitCells']               = asc_docs_api.prototype.CheckBeforeSplitCells;
	asc_docs_api.prototype['MergeCells']                          = asc_docs_api.prototype.MergeCells;
	asc_docs_api.prototype['SplitCell']                           = asc_docs_api.prototype.SplitCell;
	asc_docs_api.prototype['widthTable']                          = asc_docs_api.prototype.widthTable;
	asc_docs_api.prototype['put_CellsMargin']                     = asc_docs_api.prototype.put_CellsMargin;
	asc_docs_api.prototype['set_TblWrap']                         = asc_docs_api.prototype.set_TblWrap;
	asc_docs_api.prototype['set_TblIndentLeft']                   = asc_docs_api.prototype.set_TblIndentLeft;
	asc_docs_api.prototype['set_Borders']                         = asc_docs_api.prototype.set_Borders;
	asc_docs_api.prototype['set_TableBackground']                 = asc_docs_api.prototype.set_TableBackground;
	asc_docs_api.prototype['set_AlignCell']                       = asc_docs_api.prototype.set_AlignCell;
	asc_docs_api.prototype['set_TblAlign']                        = asc_docs_api.prototype.set_TblAlign;
	asc_docs_api.prototype['set_SpacingBetweenCells']             = asc_docs_api.prototype.set_SpacingBetweenCells;
	asc_docs_api.prototype['tblApply']                            = asc_docs_api.prototype.tblApply;
	asc_docs_api.prototype['sync_AddTableCallback']               = asc_docs_api.prototype.sync_AddTableCallback;
	asc_docs_api.prototype['sync_AlignCellCallback']              = asc_docs_api.prototype.sync_AlignCellCallback;
	asc_docs_api.prototype['sync_TblPropCallback']                = asc_docs_api.prototype.sync_TblPropCallback;
	asc_docs_api.prototype['sync_TblWrapStyleChangedCallback']    = asc_docs_api.prototype.sync_TblWrapStyleChangedCallback;
	asc_docs_api.prototype['sync_TblAlignChangedCallback']        = asc_docs_api.prototype.sync_TblAlignChangedCallback;
	asc_docs_api.prototype['ChangeImageFromFile']                 = asc_docs_api.prototype.ChangeImageFromFile;
	asc_docs_api.prototype['ChangeShapeImageFromFile']            = asc_docs_api.prototype.ChangeShapeImageFromFile;
	asc_docs_api.prototype['ChangeSlideImageFromFile']            = asc_docs_api.prototype.ChangeSlideImageFromFile;
	asc_docs_api.prototype['ChangeArtImageFromFile']              = asc_docs_api.prototype.ChangeArtImageFromFile;
	asc_docs_api.prototype['AddImage']                            = asc_docs_api.prototype.AddImage;
	asc_docs_api.prototype['asc_addImage']                        = asc_docs_api.prototype.asc_addImage;
	asc_docs_api.prototype['StartAddShape']                       = asc_docs_api.prototype.StartAddShape;
	asc_docs_api.prototype['AddTextArt']                          = asc_docs_api.prototype.AddTextArt;
	asc_docs_api.prototype['canGroup']                            = asc_docs_api.prototype.canGroup;
	asc_docs_api.prototype['canUnGroup']                          = asc_docs_api.prototype.canUnGroup;
	asc_docs_api.prototype['AddImageUrl']                         = asc_docs_api.prototype.AddImageUrl;
	asc_docs_api.prototype['AddImageUrlActionCallback']           = asc_docs_api.prototype.AddImageUrlActionCallback;
	asc_docs_api.prototype['AddImageUrlAction']                   = asc_docs_api.prototype.AddImageUrlAction;
	asc_docs_api.prototype['ImgApply']                            = asc_docs_api.prototype.ImgApply;
	asc_docs_api.prototype['asc_setChartTranslate']               = asc_docs_api.prototype.asc_setChartTranslate;
	asc_docs_api.prototype['asc_setTextArtTranslate']             = asc_docs_api.prototype.asc_setTextArtTranslate;
	asc_docs_api.prototype['ChartApply']                          = asc_docs_api.prototype.ChartApply;
	asc_docs_api.prototype['set_Size']                            = asc_docs_api.prototype.set_Size;
	asc_docs_api.prototype['set_ConstProportions']                = asc_docs_api.prototype.set_ConstProportions;
	asc_docs_api.prototype['set_WrapStyle']                       = asc_docs_api.prototype.set_WrapStyle;
	asc_docs_api.prototype['deleteImage']                         = asc_docs_api.prototype.deleteImage;
	asc_docs_api.prototype['set_ImgDistanceFromText']             = asc_docs_api.prototype.set_ImgDistanceFromText;
	asc_docs_api.prototype['set_PositionOnPage']                  = asc_docs_api.prototype.set_PositionOnPage;
	asc_docs_api.prototype['get_OriginalSizeImage']               = asc_docs_api.prototype.get_OriginalSizeImage;
	asc_docs_api.prototype['asc_onCloseChartFrame']               = asc_docs_api.prototype.asc_onCloseChartFrame;
	asc_docs_api.prototype['sync_AddImageCallback']               = asc_docs_api.prototype.sync_AddImageCallback;
	asc_docs_api.prototype['sync_ImgPropCallback']                = asc_docs_api.prototype.sync_ImgPropCallback;
	asc_docs_api.prototype['SetDrawingFreeze']                    = asc_docs_api.prototype.SetDrawingFreeze;
	asc_docs_api.prototype['zoomIn']                              = asc_docs_api.prototype.zoomIn;
	asc_docs_api.prototype['zoomOut']                             = asc_docs_api.prototype.zoomOut;
	asc_docs_api.prototype['zoomFitToPage']                       = asc_docs_api.prototype.zoomFitToPage;
	asc_docs_api.prototype['zoomFitToWidth']                      = asc_docs_api.prototype.zoomFitToWidth;
	asc_docs_api.prototype['zoomCustomMode']                      = asc_docs_api.prototype.zoomCustomMode;
	asc_docs_api.prototype['zoom100']                             = asc_docs_api.prototype.zoom100;
	asc_docs_api.prototype['zoom']                                = asc_docs_api.prototype.zoom;
	asc_docs_api.prototype['goToPage']                            = asc_docs_api.prototype.goToPage;
	asc_docs_api.prototype['getCountPages']                       = asc_docs_api.prototype.getCountPages;
	asc_docs_api.prototype['getCurrentPage']                      = asc_docs_api.prototype.getCurrentPage;
	asc_docs_api.prototype['sync_countPagesCallback']             = asc_docs_api.prototype.sync_countPagesCallback;
	asc_docs_api.prototype['sync_currentPageCallback']            = asc_docs_api.prototype.sync_currentPageCallback;
	asc_docs_api.prototype['sync_SendThemeColors']                = asc_docs_api.prototype.sync_SendThemeColors;
	asc_docs_api.prototype['ChangeColorScheme']                   = asc_docs_api.prototype.ChangeColorScheme;
	asc_docs_api.prototype['asc_enableKeyEvents']                 = asc_docs_api.prototype.asc_enableKeyEvents;
	asc_docs_api.prototype['asc_showComments']                    = asc_docs_api.prototype.asc_showComments;
	asc_docs_api.prototype['asc_hideComments']                    = asc_docs_api.prototype.asc_hideComments;
	asc_docs_api.prototype['asc_addComment']                      = asc_docs_api.prototype.asc_addComment;
	asc_docs_api.prototype['asc_getMasterCommentId']              = asc_docs_api.prototype.asc_getMasterCommentId;
	asc_docs_api.prototype['asc_getAnchorPosition']               = asc_docs_api.prototype.asc_getAnchorPosition;
	asc_docs_api.prototype['asc_removeComment']                   = asc_docs_api.prototype.asc_removeComment;
	asc_docs_api.prototype['asc_changeComment']                   = asc_docs_api.prototype.asc_changeComment;
	asc_docs_api.prototype['asc_selectComment']                   = asc_docs_api.prototype.asc_selectComment;
	asc_docs_api.prototype['asc_showComment']                     = asc_docs_api.prototype.asc_showComment;
	asc_docs_api.prototype['can_AddQuotedComment']                = asc_docs_api.prototype.can_AddQuotedComment;
	asc_docs_api.prototype['sync_RemoveComment']                  = asc_docs_api.prototype.sync_RemoveComment;
	asc_docs_api.prototype['sync_AddComment']                     = asc_docs_api.prototype.sync_AddComment;
	asc_docs_api.prototype['sync_ShowComment']                    = asc_docs_api.prototype.sync_ShowComment;
	asc_docs_api.prototype['sync_HideComment']                    = asc_docs_api.prototype.sync_HideComment;
	asc_docs_api.prototype['sync_UpdateCommentPosition']          = asc_docs_api.prototype.sync_UpdateCommentPosition;
	asc_docs_api.prototype['sync_ChangeCommentData']              = asc_docs_api.prototype.sync_ChangeCommentData;
	asc_docs_api.prototype['sync_LockComment']                    = asc_docs_api.prototype.sync_LockComment;
	asc_docs_api.prototype['sync_UnLockComment']                  = asc_docs_api.prototype.sync_UnLockComment;
	asc_docs_api.prototype['GenerateStyles']                      = asc_docs_api.prototype.GenerateStyles;
	asc_docs_api.prototype['asyncFontsDocumentEndLoaded']         = asc_docs_api.prototype.asyncFontsDocumentEndLoaded;
	asc_docs_api.prototype['asyncImagesDocumentEndLoaded']        = asc_docs_api.prototype.asyncImagesDocumentEndLoaded;
	asc_docs_api.prototype['asc_getComments']                     = asc_docs_api.prototype.asc_getComments;
	asc_docs_api.prototype['OpenDocumentEndCallback']             = asc_docs_api.prototype.OpenDocumentEndCallback;
	asc_docs_api.prototype['asyncFontEndLoaded']                  = asc_docs_api.prototype.asyncFontEndLoaded;
	asc_docs_api.prototype['asyncImageEndLoaded']                 = asc_docs_api.prototype.asyncImageEndLoaded;
	asc_docs_api.prototype['get_PresentationWidth']               = asc_docs_api.prototype.get_PresentationWidth;
	asc_docs_api.prototype['get_PresentationHeight']              = asc_docs_api.prototype.get_PresentationHeight;
	asc_docs_api.prototype['pre_Paste']                           = asc_docs_api.prototype.pre_Paste;
	asc_docs_api.prototype['pre_SaveCallback']                    = asc_docs_api.prototype.pre_SaveCallback;
	asc_docs_api.prototype['initEvents2MobileAdvances']           = asc_docs_api.prototype.initEvents2MobileAdvances;
	asc_docs_api.prototype['ViewScrollToX']                       = asc_docs_api.prototype.ViewScrollToX;
	asc_docs_api.prototype['ViewScrollToY']                       = asc_docs_api.prototype.ViewScrollToY;
	asc_docs_api.prototype['GetDocWidthPx']                       = asc_docs_api.prototype.GetDocWidthPx;
	asc_docs_api.prototype['GetDocHeightPx']                      = asc_docs_api.prototype.GetDocHeightPx;
	asc_docs_api.prototype['ClearSearch']                         = asc_docs_api.prototype.ClearSearch;
	asc_docs_api.prototype['GetCurrentVisiblePage']               = asc_docs_api.prototype.GetCurrentVisiblePage;
	asc_docs_api.prototype['asc_setAutoSaveGap']                  = asc_docs_api.prototype.asc_setAutoSaveGap;
	asc_docs_api.prototype['asc_SetDocumentPlaceChangedEnabled']  = asc_docs_api.prototype.asc_SetDocumentPlaceChangedEnabled;
	asc_docs_api.prototype['asc_SetViewRulers']                   = asc_docs_api.prototype.asc_SetViewRulers;
	asc_docs_api.prototype['asc_SetViewRulersChange']             = asc_docs_api.prototype.asc_SetViewRulersChange;
	asc_docs_api.prototype['asc_GetViewRulers']                   = asc_docs_api.prototype.asc_GetViewRulers;
	asc_docs_api.prototype['asc_SetDocumentUnits']                = asc_docs_api.prototype.asc_SetDocumentUnits;
	asc_docs_api.prototype['SetMobileVersion']                    = asc_docs_api.prototype.SetMobileVersion;
	asc_docs_api.prototype['GoToHeader']                          = asc_docs_api.prototype.GoToHeader;
	asc_docs_api.prototype['changeSlideSize']                     = asc_docs_api.prototype.changeSlideSize;
	asc_docs_api.prototype['AddSlide']                            = asc_docs_api.prototype.AddSlide;
	asc_docs_api.prototype['DeleteSlide']                         = asc_docs_api.prototype.DeleteSlide;
	asc_docs_api.prototype['DublicateSlide']                      = asc_docs_api.prototype.DublicateSlide;
	asc_docs_api.prototype['SelectAllSlides']                     = asc_docs_api.prototype.SelectAllSlides;
	asc_docs_api.prototype['AddShape']                            = asc_docs_api.prototype.AddShape;
	asc_docs_api.prototype['ChangeShapeType']                     = asc_docs_api.prototype.ChangeShapeType;
	asc_docs_api.prototype['AddText']                             = asc_docs_api.prototype.AddText;
	asc_docs_api.prototype['groupShapes']                         = asc_docs_api.prototype.groupShapes;
	asc_docs_api.prototype['unGroupShapes']                       = asc_docs_api.prototype.unGroupShapes;
	asc_docs_api.prototype['setVerticalAlign']                    = asc_docs_api.prototype.setVerticalAlign;
	asc_docs_api.prototype['setVert']                             = asc_docs_api.prototype.setVert;
	asc_docs_api.prototype['sync_MouseMoveStartCallback']         = asc_docs_api.prototype.sync_MouseMoveStartCallback;
	asc_docs_api.prototype['sync_MouseMoveEndCallback']           = asc_docs_api.prototype.sync_MouseMoveEndCallback;
	asc_docs_api.prototype['sync_MouseMoveCallback']              = asc_docs_api.prototype.sync_MouseMoveCallback;
	asc_docs_api.prototype['ShowThumbnails']                      = asc_docs_api.prototype.ShowThumbnails;
	asc_docs_api.prototype['asc_DeleteVerticalScroll']            = asc_docs_api.prototype.asc_DeleteVerticalScroll;
	asc_docs_api.prototype['syncOnThumbnailsShow']                = asc_docs_api.prototype.syncOnThumbnailsShow;
	asc_docs_api.prototype['can_AddHyperlink']                    = asc_docs_api.prototype.can_AddHyperlink;
	asc_docs_api.prototype['add_Hyperlink']                       = asc_docs_api.prototype.add_Hyperlink;
	asc_docs_api.prototype['change_Hyperlink']                    = asc_docs_api.prototype.change_Hyperlink;
	asc_docs_api.prototype['remove_Hyperlink']                    = asc_docs_api.prototype.remove_Hyperlink;
	asc_docs_api.prototype['sync_HyperlinkPropCallback']          = asc_docs_api.prototype.sync_HyperlinkPropCallback;
	asc_docs_api.prototype['sync_HyperlinkClickCallback']         = asc_docs_api.prototype.sync_HyperlinkClickCallback;
	asc_docs_api.prototype['sync_CanAddHyperlinkCallback']        = asc_docs_api.prototype.sync_CanAddHyperlinkCallback;
	asc_docs_api.prototype['sync_DialogAddHyperlink']             = asc_docs_api.prototype.sync_DialogAddHyperlink;
	asc_docs_api.prototype['GoToFooter']                          = asc_docs_api.prototype.GoToFooter;
	asc_docs_api.prototype['sync_shapePropCallback']              = asc_docs_api.prototype.sync_shapePropCallback;
	asc_docs_api.prototype['sync_slidePropCallback']              = asc_docs_api.prototype.sync_slidePropCallback;
	asc_docs_api.prototype['ExitHeader_Footer']                   = asc_docs_api.prototype.ExitHeader_Footer;
	asc_docs_api.prototype['GetCurrentPixOffsetY']                = asc_docs_api.prototype.GetCurrentPixOffsetY;
	asc_docs_api.prototype['SetPaintFormat']                      = asc_docs_api.prototype.SetPaintFormat;
	asc_docs_api.prototype['sync_PaintFormatCallback']            = asc_docs_api.prototype.sync_PaintFormatCallback;
	asc_docs_api.prototype['ClearFormating']                      = asc_docs_api.prototype.ClearFormating;
	asc_docs_api.prototype['SetDeviceInputHelperId']              = asc_docs_api.prototype.SetDeviceInputHelperId;
	asc_docs_api.prototype['asc_setViewMode']                     = asc_docs_api.prototype.asc_setViewMode;
	asc_docs_api.prototype['SetUseEmbeddedCutFonts']              = asc_docs_api.prototype.SetUseEmbeddedCutFonts;
	asc_docs_api.prototype['can_AddHyperlink']                    = asc_docs_api.prototype.can_AddHyperlink;
	asc_docs_api.prototype['add_Hyperlink']                       = asc_docs_api.prototype.add_Hyperlink;
	asc_docs_api.prototype['sync_HyperlinkClickCallback']         = asc_docs_api.prototype.sync_HyperlinkClickCallback;
	asc_docs_api.prototype['UpdateInterfaceState']                = asc_docs_api.prototype.UpdateInterfaceState;
	asc_docs_api.prototype['OnMouseUp']                           = asc_docs_api.prototype.OnMouseUp;
	asc_docs_api.prototype['asyncImageEndLoaded2']                = asc_docs_api.prototype.asyncImageEndLoaded2;
	asc_docs_api.prototype['ChangeTheme']                         = asc_docs_api.prototype.ChangeTheme;
	asc_docs_api.prototype['StartLoadTheme']                      = asc_docs_api.prototype.StartLoadTheme;
	asc_docs_api.prototype['EndLoadTheme']                        = asc_docs_api.prototype.EndLoadTheme;
	asc_docs_api.prototype['ChangeLayout']                        = asc_docs_api.prototype.ChangeLayout;
	asc_docs_api.prototype['put_ShapesAlign']                     = asc_docs_api.prototype.put_ShapesAlign;
	asc_docs_api.prototype['DistributeHorizontally']              = asc_docs_api.prototype.DistributeHorizontally;
	asc_docs_api.prototype['DistributeVertically']                = asc_docs_api.prototype.DistributeVertically;
	asc_docs_api.prototype['shapes_alignLeft']                    = asc_docs_api.prototype.shapes_alignLeft;
	asc_docs_api.prototype['shapes_alignRight']                   = asc_docs_api.prototype.shapes_alignRight;
	asc_docs_api.prototype['shapes_alignTop']                     = asc_docs_api.prototype.shapes_alignTop;
	asc_docs_api.prototype['shapes_alignBottom']                  = asc_docs_api.prototype.shapes_alignBottom;
	asc_docs_api.prototype['shapes_alignCenter']                  = asc_docs_api.prototype.shapes_alignCenter;
	asc_docs_api.prototype['shapes_alignMiddle']                  = asc_docs_api.prototype.shapes_alignMiddle;
	asc_docs_api.prototype['shapes_bringToFront']                 = asc_docs_api.prototype.shapes_bringToFront;
	asc_docs_api.prototype['shapes_bringForward']                 = asc_docs_api.prototype.shapes_bringForward;
	asc_docs_api.prototype['shapes_bringToBack']                  = asc_docs_api.prototype.shapes_bringToBack;
	asc_docs_api.prototype['shapes_bringBackward']                = asc_docs_api.prototype.shapes_bringBackward;
	asc_docs_api.prototype['sync_endDemonstration']               = asc_docs_api.prototype.sync_endDemonstration;
	asc_docs_api.prototype['sync_DemonstrationSlideChanged']      = asc_docs_api.prototype.sync_DemonstrationSlideChanged;
	asc_docs_api.prototype['StartDemonstration']                  = asc_docs_api.prototype.StartDemonstration;
	asc_docs_api.prototype['EndDemonstration']                    = asc_docs_api.prototype.EndDemonstration;
	asc_docs_api.prototype['DemonstrationPlay']                   = asc_docs_api.prototype.DemonstrationPlay;
	asc_docs_api.prototype['DemonstrationPause']                  = asc_docs_api.prototype.DemonstrationPause;
	asc_docs_api.prototype['DemonstrationEndShowMessage']         = asc_docs_api.prototype.DemonstrationEndShowMessage;
	asc_docs_api.prototype['DemonstrationNextSlide']              = asc_docs_api.prototype.DemonstrationNextSlide;
	asc_docs_api.prototype['DemonstrationPrevSlide']              = asc_docs_api.prototype.DemonstrationPrevSlide;
	asc_docs_api.prototype['DemonstrationGoToSlide']              = asc_docs_api.prototype.DemonstrationGoToSlide;
	asc_docs_api.prototype['SetDemonstrationModeOnly']            = asc_docs_api.prototype.SetDemonstrationModeOnly;
	asc_docs_api.prototype['ApplySlideTiming']                    = asc_docs_api.prototype.ApplySlideTiming;
	asc_docs_api.prototype['SlideTimingApplyToAll']               = asc_docs_api.prototype.SlideTimingApplyToAll;
	asc_docs_api.prototype['SlideTransitionPlay']                 = asc_docs_api.prototype.SlideTransitionPlay;
	asc_docs_api.prototype['SetTextBoxInputMode']                 = asc_docs_api.prototype.SetTextBoxInputMode;
	asc_docs_api.prototype['GetTextBoxInputMode']                 = asc_docs_api.prototype.GetTextBoxInputMode;
	asc_docs_api.prototype['sync_EndAddShape']                    = asc_docs_api.prototype.sync_EndAddShape;
	asc_docs_api.prototype['asc_getChartObject']                  = asc_docs_api.prototype.asc_getChartObject;
	asc_docs_api.prototype['asc_addChartDrawingObject']           = asc_docs_api.prototype.asc_addChartDrawingObject;
	asc_docs_api.prototype['asc_editChartDrawingObject']          = asc_docs_api.prototype.asc_editChartDrawingObject;
	asc_docs_api.prototype['asc_getChartPreviews']                = asc_docs_api.prototype.asc_getChartPreviews;
	asc_docs_api.prototype['asc_getTextArtPreviews']              = asc_docs_api.prototype.asc_getTextArtPreviews;
	asc_docs_api.prototype['sync_closeChartEditor']               = asc_docs_api.prototype.sync_closeChartEditor;
	asc_docs_api.prototype['asc_stopSaving']                      = asc_docs_api.prototype.asc_stopSaving;
	asc_docs_api.prototype['asc_continueSaving']                  = asc_docs_api.prototype.asc_continueSaving;
	asc_docs_api.prototype['asc_undoAllChanges']                  = asc_docs_api.prototype.asc_undoAllChanges;
	asc_docs_api.prototype['sync_ContextMenuCallback']            = asc_docs_api.prototype.sync_ContextMenuCallback;
	asc_docs_api.prototype['asc_addComment']                      = asc_docs_api.prototype.asc_addComment;
	asc_docs_api.prototype['asc_SetFastCollaborative']            = asc_docs_api.prototype.asc_SetFastCollaborative;
	asc_docs_api.prototype['asc_isOffline']                       = asc_docs_api.prototype.asc_isOffline;
	asc_docs_api.prototype['asc_getUrlType']                      = asc_docs_api.prototype.asc_getUrlType;
	asc_docs_api.prototype["asc_setInterfaceDrawImagePlaceShape"] = asc_docs_api.prototype.asc_setInterfaceDrawImagePlaceShape;
	asc_docs_api.prototype["asc_nativeInitBuilder"]               = asc_docs_api.prototype.asc_nativeInitBuilder;
	asc_docs_api.prototype["asc_SetSilentMode"]                   = asc_docs_api.prototype.asc_SetSilentMode;
	asc_docs_api.prototype["asc_pluginsRegister"]                 = asc_docs_api.prototype.asc_pluginsRegister;
	asc_docs_api.prototype["asc_pluginRun"]                       = asc_docs_api.prototype.asc_pluginRun;
	asc_docs_api.prototype["asc_pluginResize"]                    = asc_docs_api.prototype.asc_pluginResize;
	asc_docs_api.prototype["asc_pluginButtonClick"]               = asc_docs_api.prototype.asc_pluginButtonClick;
	asc_docs_api.prototype["asc_pluginEnableMouseEvents"]         = asc_docs_api.prototype.asc_pluginEnableMouseEvents;

	asc_docs_api.prototype["asc_addOleObject"]                    = asc_docs_api.prototype.asc_addOleObject;
	asc_docs_api.prototype["asc_editOleObject"]                   = asc_docs_api.prototype.asc_editOleObject;
	asc_docs_api.prototype["asc_startEditCurrentOleObject"]       = asc_docs_api.prototype.asc_startEditCurrentOleObject;
	asc_docs_api.prototype["asc_InputClearKeyboardElement"]       = asc_docs_api.prototype.asc_InputClearKeyboardElement;

	asc_docs_api.prototype["asc_getCurrentFocusObject"]           = asc_docs_api.prototype.asc_getCurrentFocusObject;
	asc_docs_api.prototype["asc_AddMath"]           			  = asc_docs_api.prototype.asc_AddMath;
	asc_docs_api.prototype["asc_SetMathProps"]           		  = asc_docs_api.prototype.asc_SetMathProps;

	// mobile
	asc_docs_api.prototype["asc_GetDefaultTableStyles"]           	= asc_docs_api.prototype.asc_GetDefaultTableStyles;
	asc_docs_api.prototype["asc_Remove"] 							= asc_docs_api.prototype.asc_Remove;
	asc_docs_api.prototype["AddShapeOnCurrentPage"] 				= asc_docs_api.prototype.AddShapeOnCurrentPage;
	asc_docs_api.prototype["can_CopyCut"] 							= asc_docs_api.prototype.can_CopyCut;

	asc_docs_api.prototype["asc_OnHideContextMenu"] 				= asc_docs_api.prototype.asc_OnHideContextMenu;
	asc_docs_api.prototype["asc_OnShowContextMenu"] 				= asc_docs_api.prototype.asc_OnShowContextMenu;


	window['Asc']['asc_CCommentData'] = window['Asc'].asc_CCommentData = asc_CCommentData;
	asc_CCommentData.prototype['asc_getText']         = asc_CCommentData.prototype.asc_getText;
	asc_CCommentData.prototype['asc_putText']         = asc_CCommentData.prototype.asc_putText;
	asc_CCommentData.prototype['asc_getTime']         = asc_CCommentData.prototype.asc_getTime;
	asc_CCommentData.prototype['asc_putTime']         = asc_CCommentData.prototype.asc_putTime;
	asc_CCommentData.prototype['asc_getUserId']       = asc_CCommentData.prototype.asc_getUserId;
	asc_CCommentData.prototype['asc_putUserId']       = asc_CCommentData.prototype.asc_putUserId;
	asc_CCommentData.prototype['asc_getUserName']     = asc_CCommentData.prototype.asc_getUserName;
	asc_CCommentData.prototype['asc_putUserName']     = asc_CCommentData.prototype.asc_putUserName;
	asc_CCommentData.prototype['asc_getQuoteText']    = asc_CCommentData.prototype.asc_getQuoteText;
	asc_CCommentData.prototype['asc_putQuoteText']    = asc_CCommentData.prototype.asc_putQuoteText;
	asc_CCommentData.prototype['asc_getSolved']       = asc_CCommentData.prototype.asc_getSolved;
	asc_CCommentData.prototype['asc_putSolved']       = asc_CCommentData.prototype.asc_putSolved;
	asc_CCommentData.prototype['asc_getReply']        = asc_CCommentData.prototype.asc_getReply;
	asc_CCommentData.prototype['asc_addReply']        = asc_CCommentData.prototype.asc_addReply;
	asc_CCommentData.prototype['asc_getRepliesCount'] = asc_CCommentData.prototype.asc_getRepliesCount;
	window['Asc']['CHyperlinkProperty']               = window['Asc'].CHyperlinkProperty = CHyperlinkProperty;
	CHyperlinkProperty.prototype['get_Value']         = CHyperlinkProperty.prototype.get_Value;
	CHyperlinkProperty.prototype['put_Value']         = CHyperlinkProperty.prototype.put_Value;
	CHyperlinkProperty.prototype['get_ToolTip']       = CHyperlinkProperty.prototype.get_ToolTip;
	CHyperlinkProperty.prototype['put_ToolTip']       = CHyperlinkProperty.prototype.put_ToolTip;
	CHyperlinkProperty.prototype['get_Text']          = CHyperlinkProperty.prototype.get_Text;
	CHyperlinkProperty.prototype['put_Text']          = CHyperlinkProperty.prototype.put_Text;
	CHyperlinkProperty.prototype['get_Value']         = CHyperlinkProperty.prototype.get_Value;
	CHyperlinkProperty.prototype['put_Value']         = CHyperlinkProperty.prototype.put_Value;
	CHyperlinkProperty.prototype['get_ToolTip']       = CHyperlinkProperty.prototype.get_ToolTip;
	CHyperlinkProperty.prototype['put_ToolTip']       = CHyperlinkProperty.prototype.put_ToolTip;
	CHyperlinkProperty.prototype['get_Text']          = CHyperlinkProperty.prototype.get_Text;
	CHyperlinkProperty.prototype['put_Text']          = CHyperlinkProperty.prototype.put_Text;
	window['AscCommonSlide'].CContextMenuData         = CContextMenuData;
	CContextMenuData.prototype['get_Type']            = CContextMenuData.prototype.get_Type;
	CContextMenuData.prototype['get_X']               = CContextMenuData.prototype.get_X;
	CContextMenuData.prototype['get_Y']               = CContextMenuData.prototype.get_Y;
	CContextMenuData.prototype['get_IsSlideSelect']   = CContextMenuData.prototype.get_IsSlideSelect;
	window['Asc']['CAscSlideProps']                   = CAscSlideProps;
	CAscSlideProps.prototype['get_background']        = CAscSlideProps.prototype.get_background;
	CAscSlideProps.prototype['put_background']        = CAscSlideProps.prototype.put_background;
	CAscSlideProps.prototype['get_timing']            = CAscSlideProps.prototype.get_timing;
	CAscSlideProps.prototype['put_timing']            = CAscSlideProps.prototype.put_timing;
	CAscSlideProps.prototype['get_LockDelete']        = CAscSlideProps.prototype.get_LockDelete;
	CAscSlideProps.prototype['put_LockDelete']        = CAscSlideProps.prototype.put_LockDelete;
	CAscSlideProps.prototype['get_LockLayout']        = CAscSlideProps.prototype.get_LockLayout;
	CAscSlideProps.prototype['put_LockLayout']        = CAscSlideProps.prototype.put_LockLayout;
	CAscSlideProps.prototype['get_LockTiming']        = CAscSlideProps.prototype.get_LockTiming;
	CAscSlideProps.prototype['put_LockTiming']        = CAscSlideProps.prototype.put_LockTiming;
	CAscSlideProps.prototype['get_LockBackground']    = CAscSlideProps.prototype.get_LockBackground;
	CAscSlideProps.prototype['put_LockBackground']    = CAscSlideProps.prototype.put_LockBackground;
	CAscSlideProps.prototype['get_LockTranzition']    = CAscSlideProps.prototype.get_LockTranzition;
	CAscSlideProps.prototype['put_LockTranzition']    = CAscSlideProps.prototype.put_LockTranzition;
	CAscSlideProps.prototype['get_LockRemove']        = CAscSlideProps.prototype.get_LockRemove;
	CAscSlideProps.prototype['put_LockRemove']        = CAscSlideProps.prototype.put_LockRemove;
	window['Asc']['CAscChartProp']                    = CAscChartProp;
	CAscChartProp.prototype['get_ChangeLevel']        = CAscChartProp.prototype.get_ChangeLevel;
	CAscChartProp.prototype['put_ChangeLevel']        = CAscChartProp.prototype.put_ChangeLevel;
	CAscChartProp.prototype['get_CanBeFlow']          = CAscChartProp.prototype.get_CanBeFlow;
	CAscChartProp.prototype['get_Width']              = CAscChartProp.prototype.get_Width;
	CAscChartProp.prototype['put_Width']              = CAscChartProp.prototype.put_Width;
	CAscChartProp.prototype['get_Height']             = CAscChartProp.prototype.get_Height;
	CAscChartProp.prototype['put_Height']             = CAscChartProp.prototype.put_Height;
	CAscChartProp.prototype['get_WrappingStyle']      = CAscChartProp.prototype.get_WrappingStyle;
	CAscChartProp.prototype['put_WrappingStyle']      = CAscChartProp.prototype.put_WrappingStyle;
	CAscChartProp.prototype['get_Paddings']           = CAscChartProp.prototype.get_Paddings;
	CAscChartProp.prototype['put_Paddings']           = CAscChartProp.prototype.put_Paddings;
	CAscChartProp.prototype['get_AllowOverlap']       = CAscChartProp.prototype.get_AllowOverlap;
	CAscChartProp.prototype['put_AllowOverlap']       = CAscChartProp.prototype.put_AllowOverlap;
	CAscChartProp.prototype['get_Position']           = CAscChartProp.prototype.get_Position;
	CAscChartProp.prototype['put_Position']           = CAscChartProp.prototype.put_Position;
	CAscChartProp.prototype['get_PositionH']          = CAscChartProp.prototype.get_PositionH;
	CAscChartProp.prototype['put_PositionH']          = CAscChartProp.prototype.put_PositionH;
	CAscChartProp.prototype['get_PositionV']          = CAscChartProp.prototype.get_PositionV;
	CAscChartProp.prototype['put_PositionV']          = CAscChartProp.prototype.put_PositionV;
	CAscChartProp.prototype['get_Value_X']            = CAscChartProp.prototype.get_Value_X;
	CAscChartProp.prototype['get_Value_Y']            = CAscChartProp.prototype.get_Value_Y;
	CAscChartProp.prototype['get_ImageUrl']           = CAscChartProp.prototype.get_ImageUrl;
	CAscChartProp.prototype['put_ImageUrl']           = CAscChartProp.prototype.put_ImageUrl;
	CAscChartProp.prototype['get_Group']              = CAscChartProp.prototype.get_Group;
	CAscChartProp.prototype['put_Group']              = CAscChartProp.prototype.put_Group;
	CAscChartProp.prototype['asc_getFromGroup']       = CAscChartProp.prototype.asc_getFromGroup;
	CAscChartProp.prototype['asc_putFromGroup']       = CAscChartProp.prototype.asc_putFromGroup;
	CAscChartProp.prototype['get_isChartProps']       = CAscChartProp.prototype.get_isChartProps;
	CAscChartProp.prototype['put_isChartPross']       = CAscChartProp.prototype.put_isChartPross;
	CAscChartProp.prototype['get_SeveralCharts']      = CAscChartProp.prototype.get_SeveralCharts;
	CAscChartProp.prototype['put_SeveralCharts']      = CAscChartProp.prototype.put_SeveralCharts;
	CAscChartProp.prototype['get_SeveralChartTypes']  = CAscChartProp.prototype.get_SeveralChartTypes;
	CAscChartProp.prototype['put_SeveralChartTypes']  = CAscChartProp.prototype.put_SeveralChartTypes;
	CAscChartProp.prototype['get_SeveralChartStyles'] = CAscChartProp.prototype.get_SeveralChartStyles;
	CAscChartProp.prototype['put_SeveralChartStyles'] = CAscChartProp.prototype.put_SeveralChartStyles;
	CAscChartProp.prototype['get_VerticalTextAlign']  = CAscChartProp.prototype.get_VerticalTextAlign;
	CAscChartProp.prototype['put_VerticalTextAlign']  = CAscChartProp.prototype.put_VerticalTextAlign;
	CAscChartProp.prototype['get_Locked']             = CAscChartProp.prototype.get_Locked;
	CAscChartProp.prototype['get_ChartProperties']    = CAscChartProp.prototype.get_ChartProperties;
	CAscChartProp.prototype['put_ChartProperties']    = CAscChartProp.prototype.put_ChartProperties;
	CAscChartProp.prototype['get_ShapeProperties']    = CAscChartProp.prototype.get_ShapeProperties;
	CAscChartProp.prototype['put_ShapeProperties']    = CAscChartProp.prototype.put_ShapeProperties;
	CAscChartProp.prototype['asc_getType']            = CAscChartProp.prototype.asc_getType;
	CAscChartProp.prototype['asc_getSubType']         = CAscChartProp.prototype.asc_getSubType;
	CAscChartProp.prototype['asc_getStyleId']         = CAscChartProp.prototype.asc_getStyleId;
	CAscChartProp.prototype['asc_getHeight']          = CAscChartProp.prototype.asc_getHeight;
	CAscChartProp.prototype['asc_getWidth']           = CAscChartProp.prototype.asc_getWidth;
	CAscChartProp.prototype['asc_setType']            = CAscChartProp.prototype.asc_setType;
	CAscChartProp.prototype['asc_setSubType']         = CAscChartProp.prototype.asc_setSubType;
	CAscChartProp.prototype['asc_setStyleId']         = CAscChartProp.prototype.asc_setStyleId;
	CAscChartProp.prototype['asc_setHeight']          = CAscChartProp.prototype.asc_setHeight;
	CAscChartProp.prototype['asc_setWidth']           = CAscChartProp.prototype.asc_setWidth;
	CAscChartProp.prototype['asc_putTitle']           = CAscChartProp.prototype['put_Title']           = CAscChartProp.prototype['asc_setTitle']           = CAscChartProp.prototype.asc_setTitle;
	CAscChartProp.prototype['asc_putDescription']     = CAscChartProp.prototype['put_Description']     = CAscChartProp.prototype['asc_setDescription']     = CAscChartProp.prototype.asc_setDescription;
	CAscChartProp.prototype['asc_getTitle']           = CAscChartProp.prototype.asc_getTitle;
	CAscChartProp.prototype['asc_getDescription']     = CAscChartProp.prototype.asc_getDescription;
	CAscChartProp.prototype['getType']                = CAscChartProp.prototype.getType;
	CAscChartProp.prototype['putType']                = CAscChartProp.prototype.putType;
	CAscChartProp.prototype['getStyle']               = CAscChartProp.prototype.getStyle;
	CAscChartProp.prototype['putStyle']               = CAscChartProp.prototype.putStyle;
	CAscChartProp.prototype['putLockAspect']          = CAscChartProp.prototype['asc_putLockAspect'] = CAscChartProp.prototype.putLockAspect;
	CAscChartProp.prototype['getLockAspect'] = CAscChartProp.prototype['asc_getLockAspect'] = CAscChartProp.prototype.getLockAspect;
	CAscChartProp.prototype['changeType']        = CAscChartProp.prototype.changeType;
	CDocInfoProp.prototype['get_PageCount']      = CDocInfoProp.prototype.get_PageCount;
	CDocInfoProp.prototype['put_PageCount']      = CDocInfoProp.prototype.put_PageCount;
	CDocInfoProp.prototype['get_WordsCount']     = CDocInfoProp.prototype.get_WordsCount;
	CDocInfoProp.prototype['put_WordsCount']     = CDocInfoProp.prototype.put_WordsCount;
	CDocInfoProp.prototype['get_ParagraphCount'] = CDocInfoProp.prototype.get_ParagraphCount;
	CDocInfoProp.prototype['put_ParagraphCount'] = CDocInfoProp.prototype.put_ParagraphCount;
	CDocInfoProp.prototype['get_SymbolsCount']   = CDocInfoProp.prototype.get_SymbolsCount;
	CDocInfoProp.prototype['put_SymbolsCount']   = CDocInfoProp.prototype.put_SymbolsCount;
	CDocInfoProp.prototype['get_SymbolsWSCount'] = CDocInfoProp.prototype.get_SymbolsWSCount;
	CDocInfoProp.prototype['put_SymbolsWSCount'] = CDocInfoProp.prototype.put_SymbolsWSCount;
	CSearchResult.prototype['get_Text']          = CSearchResult.prototype.get_Text;
	CSearchResult.prototype['get_Navigator']     = CSearchResult.prototype.get_Navigator;
	CSearchResult.prototype['put_Navigator']     = CSearchResult.prototype.put_Navigator;
	CSearchResult.prototype['put_Text']          = CSearchResult.prototype.put_Text;
})(window, window.document);
