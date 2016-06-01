(function(window, undefined){

    function CPluginData()
    {
        this.privateData = {};
    }
    CPluginData.prototype =
    {
        setAttribute : function(name, value)
        {
            this.privateData[name] = value;
        },

        getAttribute : function(name)
        {
            return this.privateData[name];
        },

        serialize : function()
        {
            var _data = "";
            try
            {
                _data = JSON.stringify(this.privateData);
            }
            catch(err)
            {
                _data = "{ \"data\" : \"\" }";
            }
            return _data;
        },

        deserialize : function(_data)
        {
            try
            {
                this.privateData = JSON.parse(_data);
            }
            catch(err)
            {
                this.privateData = { "data" : "" };
            }
        }
    };

    function CPluginsManager(api)
    {
        this.plugins = [];
        this.current = null;
        this.path = "../../../../sdkjs-plugins/";
        this.api = null;

        this.startData = null;
        this.runAndCloseData = null;

        this.closeAttackTimer = -1; // защита от плагитнов, которые не закрываются
    }

    CPluginsManager.prototype =
    {
        register : function(basePath, plugins)
        {
            this.path = basePath;
            for (var i = 0; i < plugins.length; i++)
                this.plugins.push(plugins[i]);
        },
        run      : function(guid, variation, data)
        {
            if (null != this.current)
            {
                if (this.current.guid != guid)
                {
                    this.runAndCloseData = {};
                    this.runAndCloseData.guid = guid;
                    this.runAndCloseData.variation = variation;
                    this.runAndCloseData.data = data;
                }
                // закрываем
                this.buttonClick(-1);
                return false;
            }

            for (var i = 0; i < this.plugins.length; i++)
            {
                if (this.plugins[i].guid == guid)
                {
                    this.current = this.plugins[i];
                    break;
                }
            }

            if (this.current == null)
                return false;

            this.startData = (data == null || data == "") ? new CPluginData() : data;
            this.startData.setAttribute("guid", guid)
            this.correctData(this.startData);
            this.show();
        },
        runResize   : function(data)
        {
            var guid = data.getAttribute("guid");
            for (var i = 0; i < this.plugins.length; i++)
            {
                if (this.plugins[i].guid == guid)
                {
                    if (this.plugins[i].variations[0].isUpdateOleOnResize !== true)
                        return;
                }
            }

            data.setAttribute("resize", true);
            return this.run(guid, 0, data);
        },
        close    : function()
        {
            if (this.startData.getAttribute("resize") === true)
                this.endLongAction();
            this.startData = null;

            if (true)
            {
                var _div = document.getElementById("plugin_iframe");
                if (_div)
                    _div.parentNode.removeChild(_div);
            }
            this.current = null;

            if (this.runAndCloseData)
            {
                this.run(this.runAndCloseData.guid, this.runAndCloseData.variation, this.runAndCloseData.data);
                this.runAndCloseData = null;
            }
            this.api.asc_fireCallback("asc_onPluginClose");
        },

        show : function()
        {
            if (this.startData.getAttribute("resize") === true)
                this.startLongAction();

            if (this.current.variations[0].isVisual && this.startData.getAttribute("resize") !== true)
            {
                this.api.asc_fireCallback("asc_onPluginShow", this.current);
            }
            else
            {
                var ifr = document.createElement("iframe");
                ifr.name = "plugin_iframe";
                ifr.id = "plugin_iframe";
                var _add = this.current.baseUrl == "" ? this.path : this.current.baseUrl;
                ifr.src = _add + this.current.variations[0].url;
                ifr.style.position = 'absolute';
                ifr.style.top = '-100px';
                ifr.style.left = '0px';
                ifr.style.width = '10000px';
                ifr.style.height = '100px';
                ifr.style.overflow = 'hidden';
                ifr.style.zIndex = -1000;
                document.body.appendChild(ifr);
            }
        },

        buttonClick : function(id)
        {
            if (this.closeAttackTimer != -1)
            {
                clearTimeout(this.closeAttackTimer);
                this.closeAttackTimer = -1;
            }

            if (-1 == id)
            {
                // защита от плохого плагина
                this.closeAttackTimer = setTimeout(function(){ window.g_asc_plugins.close(); }, 5000);
            }
            var _iframe = document.getElementById("plugin_iframe");
            if (_iframe)
            {
                var pluginData = new CPluginData();
                pluginData.setAttribute("guid", this.current.guid);
                pluginData.setAttribute("type", "button");
                pluginData.setAttribute("button", "" + id);
                _iframe.contentWindow.postMessage(pluginData.serialize(), "*");
            }
        },

        init : function()
        {
            switch (this.current.variations[0].initDataType)
            {
                case Asc.EPluginDataType.text:
                {
                    var text_data = {
                        data : "",
                        pushData : function(format, value) { this.data = value; }
                    };
                    
                    this.api.asc_CheckCopy(text_data, 1);
                    this.startData.setAttribute("data", text_data.data);
                    break;
                }
                case Asc.EPluginDataType.ole:
                {
                    // теперь выше задается
                    break;
                }
            }
            
            var _iframe = document.getElementById("plugin_iframe");
            if (_iframe)
            {
                this.startData.setAttribute("type", "init");
                _iframe.contentWindow.postMessage(this.startData.serialize(), "*");
            }
        },
        correctData : function(pluginData)
        {
            pluginData.setAttribute("editorType", this.api._editorNameById());

            var _mmToPx = AscCommon.g_dKoef_mm_to_pix;
            if (this.api.WordControl && this.api.WordControl.m_nZoomValue)
                _mmToPx *= this.api.WordControl.m_nZoomValue / 100;

            pluginData.setAttribute("mmToPx", _mmToPx);

            if (undefined == pluginData.getAttribute("data"))
                pluginData.setAttribute("data", "");
        },
        loadExtensionPlugins : function(_plugins)
        {
            if (!_plugins || _plugins.length < 1)
                return;

            var _map = {};
            for (var i = 0; i < this.plugins.length; i++)
                _map[this.plugins[i].guid] = true;

            for (var i = 0; i < _plugins.length; i++)
            {
                var _p = new Asc.CPlugin();
                _p["deserialize"](_plugins[i]);

                if (_map[_p.guid] === true)
                    continue;

                this.plugins.push(_p);
            }

            var _pluginsInstall = { "url" : this.path, "pluginsData" : [] };
            for (var i = 0; i < this.plugins.length; i++)
            {
                _pluginsInstall["pluginsData"].push(this.plugins[i].serialize());
            }

            this.api.asc_fireCallback("asc_onPluginsInit", _pluginsInstall);
        },

        startLongAction : function()
        {
            console.log("startLongAction");
            this.api.sync_StartAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.SlowOperation);
        },
        endLongAction : function()
        {
            console.log("endLongAction");
            this.api.sync_EndAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.SlowOperation);
        }
    };

    // export
    CPluginsManager.prototype["buttonClick"] = CPluginsManager.prototype.buttonClick;

    function onMessage(event)
    {
        if (!window.g_asc_plugins || !window.g_asc_plugins.current)
            return;

        if (typeof(event.data) == "string")
        {
            var pluginData = new CPluginData();
            pluginData.deserialize(event.data);

            var guid = pluginData.getAttribute("guid");

            if (guid != window.g_asc_plugins.current.guid)
                return;

            var name = pluginData.getAttribute("type");
            var value = pluginData.getAttribute("data");

            if ("initialize" == name)
            {
                window.g_asc_plugins.init();
                return;
            }
            else if ("close" == name)
            {
                if (window.g_asc_plugins.closeAttackTimer != -1)
                {
                    clearTimeout(window.g_asc_plugins.closeAttackTimer);
                    window.g_asc_plugins.closeAttackTimer = -1;
                }

                if (value && value != "")
                {
                    try
                    {
						if (window.g_asc_plugins.api.asc_canPaste())
						{
							var _script = "(function(){ var Api = window.g_asc_plugins.api;\n" + value + "})();";
							eval(_script);

							var oLogicDocument = window.g_asc_plugins.api.WordControl ? window.g_asc_plugins.api.WordControl.m_oLogicDocument : null;
							if (pluginData.getAttribute("recalculate") == true)
							{
								var _fonts = oLogicDocument.Document_Get_AllFontNames();
								var _imagesArray = oLogicDocument.Get_AllImageUrls();
								var _images = {};
								for (var i = 0; i < _imagesArray.length; i++)
								{
									_images[_imagesArray[i]] = _imagesArray[i];
								}
								AscCommon.Check_LoadingDataBeforePrepaste(window.g_asc_plugins.api, _fonts, _images, function()
								{
									window.g_asc_plugins.api.asc_Recalculate();
								});
							}
						}
                    }
                    catch (err)
                    {
                    }
                }

                window.g_asc_plugins.close();
            }
        }
    }

    if (window.addEventListener)
    {
        window.addEventListener("message", onMessage, false);
    }
    else if (window.attachEvent)
    {
        window.attachEvent("onmessage", onMessage);
    }

    window["Asc"] = window["Asc"] ? window["Asc"] : {};
    window["Asc"].createPluginsManager = function(api)
    {
        if (window.g_asc_plugins)
            return window.g_asc_plugins;

        window.g_asc_plugins        = new CPluginsManager(api);
        window["g_asc_plugins"]     = window.g_asc_plugins;
        window.g_asc_plugins.api    = api;
        window.g_asc_plugins["api"] = window.g_asc_plugins.api;

        window.g_asc_plugins.api.asc_registerCallback('asc_onDocumentContentReady', function(){

            setTimeout(function(){
                window.g_asc_plugins.loadExtensionPlugins(window["Asc"]["extensionPlugins"]);
            }, 10);

        });

        return window.g_asc_plugins;
    };

    window["Asc"].CPluginData = CPluginData;
    window["Asc"].CPluginData_wrap = function(obj)
    {
        if (!obj.getAttribute)
            obj.getAttribute = function(name) { return this[name]; }
        if (!obj.setAttribute)
            obj.setAttribute = function(name, value) { return this[name] = value; }
    };
})(window, undefined);

// потом удалить!!!
function TEST_PLUGINS()
{
    var _plugins                = [
        {
            name : "chess (fen)",
            guid : "asc.{FFE1F462-1EA2-4391-990D-4CC84940B754}",

            variations : [
                {
                    description : "chess",
                    url         : "chess/index.html",

                    icons           : ["chess/icon.png", "chess/icon@2x.png"],
                    isViewer        : true,
                    EditorsSupport  : ["word", "cell", "slide"],

                    isVisual        : true,
                    isModal         : true,
                    isInsideMode    : false,

                    initDataType    : "ole",
                    initData        : "",

                    isUpdateOleOnResize : true,

                    buttons         : [ { text: "Ok", primary: true },
                        { text: "Cancel", primary: false } ]
                }
            ]
        },
        {
            name : "glavred",
            guid : "asc.{B631E142-E40B-4B4C-90B9-2D00222A286E}",

            variations : [
                {
                    description : "glavred",
                    url         : "glavred/index.html",

                    icons           : ["glavred/icon.png", "glavred/icon@2x.png"],
                    isViewer        : true,
                    EditorsSupport  : ["word", "cell", "slide"],

                    isVisual        : true,
                    isModal         : true,
                    isInsideMode    : false,

                    initDataType    : "text",
                    initData        : "",

                    isUpdateOleOnResize : false,

                    buttons         : [ { text: "Ok", primary: true } ]
                }
            ]
        },
        {
            name : "bold",
            guid : "asc.{14E46CC2-5E56-429C-9D55-1032B596D928}",

            variations : [
                {
                    description : "bold",
                    url         : "bold/index.html",

                    icons           : ["bold/icon.png", "bold/icon@2x.png"],
                    isViewer        : false,
                    EditorsSupport  : ["word", "cell", "slide"],

                    isVisual        : false,
                    isModal         : false,
                    isInsideMode    : false,

                    initDataType    : "none",
                    initData        : "",

                    isUpdateOleOnResize : false,

                    buttons         : []
                }
            ]
        },
        {
            name : "speech",
            guid : "asc.{D71C2EF0-F15B-47C7-80E9-86D671F9C595}",

            variations : [
                {
                    description : "speech",
                    url         : "speech/index.html",

                    icons           : ["speech/icon.png", "speech/icon@2x.png"],
                    isViewer        : true,
                    EditorsSupport  : ["word", "cell", "slide"],

                    isVisual        : false,
                    isModal         : false,
                    isInsideMode    : false,

                    initDataType    : "text",
                    initData        : "",

                    isUpdateOleOnResize : false,

                    buttons         : [ ]
                }
            ]
        },
        {
            name : "youtube",
            guid : "asc.{38E022EA-AD92-45FC-B22B-49DF39746DB4}",

            variations : [
                {
                    description : "youtube",
                    url         : "youtube/index.html",

                    icons           : ["youtube/icon.png", "youtube/icon@2x.png"],
                    isViewer        : true,
                    EditorsSupport  : ["word", "cell", "slide"],

                    isVisual        : true,
                    isModal         : true,
                    isInsideMode    : false,

                    initDataType    : "ole",
                    initData        : "",

                    isUpdateOleOnResize : false,

                    buttons         : [ { text: "Ok", primary: true },
                        { text: "Cancel", primary: false } ]
                }
            ]
        },
        {
            "name" : "cbr",
            "guid" : "asc.{5F9D4EB4-AF61-46EF-AE25-46C96E75E1DD}",

            "variations" : [
                {
                    "description" : "cbr",
                    "url"         : "cbr/index.html",

                    "icons"           : ["cbr/icon.png", "cbr/icon@2x.png"],
        //            "isViewer"        : true,
                    "isViewer"        : false,
                    "EditorsSupport"  : ["word", "cell", "slide"],

        //            "isVisual"        : true,
        //            "isModal"         : true,
                    "isVisual"        : false,
                    "isModal"         : false,
                    "isInsideMode"    : false,

                    "initDataType"    : "none",
                    "initData"        : "",

        //            "isUpdateOleOnResize" : true,
        			"isUpdateOleOnResize" : false,

        //            "buttons"         : [ { "text": "Ok", "primary": true },
        //                                { "text": "Cancel", "primary": false } ]
        			"buttons"         : []
                }
            ]
        },
        {
            "name" : "ocr(Tesseract.js)",
            "guid" : "asc.{440EBF13-9B19-4BD8-8621-05200E58140B}",
            "baseUrl" : "",

            "variations" : [
                {
                    "description" : "ocr",
                    "url"         : "ocr/index.html",

                    "icons"           : ["ocr/icon.png", "ocr/icon@2x.png"],
                    "isViewer"        : false,
                    "EditorsSupport"  : ["word"],

                    "isVisual"        : true,
                    "isModal"         : false,
                    "isInsideMode"    : false,

                    "initDataType"    : "html",
                    "initData"        : "",

                    "isUpdateOleOnResize" : false,

                    "buttons"         : [ { "text": "Insert In Document", "primary": true},
                        { "text": "Cancel", "primary": false } ]
                }
            ]
        }
    ];

    window.g_asc_plugins.loadExtensionPlugins(_plugins);
}
