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
        this.path = "";
        this.api = null;

        this.startData = null;
        this.runAndCloseData = null;
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
        runResize   : function(guid, data, width, height)
        {
        },
        close    : function()
        {
            if (!this.current.variations[0].isVisual) {
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
            if (this.current.variations[0].isVisual)
            {
                this.api.asc_fireCallback("asc_onPluginShow", this.current);
            }
            else
            {
                var ifr = document.createElement("iframe");
                ifr.name = "plugin_iframe";
                ifr.id = "plugin_iframe";
                ifr.src = this.path + this.current.variations[0].url;
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
        }
    };

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
                if (value && value != "")
                {
                    try
                    {
                        eval(value);
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

        return window.g_asc_plugins;
    };

    window["Asc"].CPluginData = CPluginData;
})(window, undefined);

// потом удалить!!!
function TEST_PLUGINS()
{
    var _plugins                = [
        {
            name : "chess (fen)",
            guid : "{FFE1F462-1EA2-4391-990D-4CC84940B754}",

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
            guid : "{B631E142-E40B-4B4C-90B9-2D00222A286E}",

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
            guid : "{14E46CC2-5E56-429C-9D55-1032B596D928}",

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
            guid : "{D71C2EF0-F15B-47C7-80E9-86D671F9C595}",

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
            guid : "{38E022EA-AD92-45FC-B22B-49DF39746DB4}",

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

                    isUpdateOleOnResize : true,

                    buttons         : [ { text: "Ok", primary: true },
                        { text: "Cancel", primary: false } ]
                }
            ]
        }
    ];

    var _pluginsNatural = [];
    for (var i = 0; i < _plugins.length; i++)
    {
        var _p = new Asc.CPlugin();

        _p.name = _plugins[i].name;
        _p.guid = _plugins[i].guid;

        for (var j = 0; j < _plugins[i].variations.length; j++)
        {
            var _pv = new Asc.CPluginVariation();

            for (var k in _plugins[i].variations[j])
            {
                _pv[k] = _plugins[i].variations[j][k];
            }

            _p.variations.push(_pv);
        }

        _pluginsNatural.push(_p);
    }

    window.g_asc_plugins.api.asc_pluginsRegister("../../../../sdkjs-plugins/", _pluginsNatural);

    // добавляем кнопки (тест)
    var _elem = document.getElementById("view-left-menu").childNodes[1];

    for (var i = 0; i < _plugins.length; i++)
    {
        var _button = "<button class='btn btn-category' content-target='' data-toggle='tooltip' data-original-title='' title='' " +
            "onclick='window.g_asc_plugins.run(\"" + _plugins[i].guid + "\")'><span>" + (i + 1) + "</span></button>";

        _elem.innerHTML += _button;
    }
}
