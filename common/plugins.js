(function(window, undefined){

    function CPluginsManager(api)
    {
        this.plugins = [];
        this.current = null;
        this.path = "";
        this.api = null;

        this.startData = "";

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
                }
            }

            if (this.current == null)
                return false;

            this.startData = (data == null) ? "" : data;
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
                _iframe.contentWindow.postMessage(this.current.guid + ";button;" + id, "*");
            }
        },

        init : function()
        {
            var _data = "";
            switch (this.current.variations[0].initDataType)
            {
                case Asc.EPluginDataType.text:
                {
                    var text_data = {
                        data : "",
                        pushData : function(format, value) { this.data = value; }
                    };
                    
                    this.api.asc_CheckCopy(text_data, 1);
                    _data = text_data.data;
                    break;
                }
                case Asc.EPluginDataType.ole:
                {
                    _data = this.startData;
                    break;
                }
            }
            
            var _iframe = document.getElementById("plugin_iframe");
            if (_iframe)
            {
                _iframe.contentWindow.postMessage(this.current.guid + ";init;" + _data, "*");
            }
        }
    };

    function onMessage(event)
    {
        if (!window.g_asc_plugins || !window.g_asc_plugins.current)
            return;

        if (typeof(event.data) == "string")
        {
            var i1 = event.data.indexOf(";");
            if (-1 == i1)
                return;

            var guid = event.data.substr(0, i1);
            if (guid != window.g_asc_plugins.current.guid)
                return;

            var i2 = event.data.indexOf(";", i1 + 1);
            if (-1 == i2)
                return;

            var name = event.data.substr(i1 + 1, i2 - i1 - 1);
            var value = event.data.substr(i2 + 1);

            if ("initialize" == name)
            {
                window.g_asc_plugins.init();
                return;
            }
            else if ("close" == name)
            {
                if (value != "")
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

        for (var j = 0; j < _p.variations.length; j++)
        {
            var _pv = new Asc.CPluginVariation();

            for (var k in _plugins[i].variations[j])
            {
                _pv[k] = _plugins[i].variations[j][k];
            }

            _p.variations.push(_pv);
        }
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
