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
        run      : function(guid, data)
        {
            if (null != this.current)
            {
                if (this.current.guid != guid)
                {
                    this.runAndCloseData = {};
                    this.runAndCloseData.guid = guid;
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

            this.startData = data;
            this.show();
        },
        runResize   : function(guid, data, width, height)
        {
        },
        close    : function()
        {
            var _div = document.getElementById(this.current.isVisual ? "id_plugin_modal" : "plugin_iframe");
            if (_div)
                _div.parentNode.removeChild(_div);
            this.current = null;

            if (this.runAndCloseData)
            {
                this.run(this.runAndCloseData.guid, this.runAndCloseData.data);
                this.runAndCloseData = null;
            }
        },

        show : function()
        {
            if (this.current.isVisual)
            {
                var _div = "" +
                    "<div class='header'>" +
                    "<div class='tool close img-commonctrl' onclick='window.g_asc_plugins.buttonClick(-1);'></div>" +
                    "<span class='title'>" + this.current.name + "</span>" +
                    "</div>" +
                    "<div class='body'>" +
                    "<div id='id_body_plugin' class='box' style='height:615px;'>" +
                    "<iframe id ='plugin_iframe' src='" + this.path + this.current.url + "' width='100%' height='100%' align='top' frameborder='0' name='frameEditor' allowfullscreen='' onmousewheel=''></iframe>" +
                    "</div>" +
                    "<div class='separator horizontal'></div>" +
                    "<div class='footer' style='text-align: center;'>";

                for (var i = 0; i < this.current.buttons.length; i++)
                {
                    _div += "<button id='plugin" + (i + 1) + "' class='btn normal dlg-btn";
                    if (this.current.buttons[i]["primary"])
                        _div += " primary custom' style='margin-right: 10px;' ";
                    else
                        _div += "' ";

                    _div += "onclick='window.g_asc_plugins.buttonClick(" + i + ")'>"
                    _div += this.current.buttons[i]["text"];
                    _div += "</button>";
                }

                _div += "</div></div>";

                var _new_div = document.createElement("div");
                _new_div.setAttribute("id", "id_plugin_modal");
                _new_div.setAttribute("class", "asc-window modal advanced-settings-dlg notransform");
                _new_div.setAttribute("style", "width: 910px; height: 700px; left: 385px; top: 112px; transform: scale(1); opacity: 1; transition: opacity 0.2s, -webkit-transform 0.2s;");
                _new_div.innerHTML = _div;

                document.body.appendChild(_new_div);
            }
            else
            {
                var ifr = document.createElement("iframe");
                ifr.name = "plugin_iframe";
                ifr.id = "plugin_iframe";
                ifr.src = this.path + this.current.url;
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
            switch (this.current.initDataType)
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
    var plugin1                 = new Asc.CPlugin();
    plugin1.name                = "chess (fen)";
    plugin1.guid                = "{FFE1F462-1EA2-4391-990D-4CC84940B754}";
    plugin1.url                 = "chess/index.html";
    plugin1.icons               = ["chess/icon.png", "chess/icon@2x.png"];
    plugin1.isVisual            = true;
    plugin1.initDataType        = Asc.EPluginDataType.ole;
    plugin1.isUpdateOleOnResize = true;
    plugin1.buttons             = [{"text":"Ok","primary":true},{"text":"Cancel","primary":false}];

    var plugin2                 = new Asc.CPlugin();
    plugin2.name                = "glavred";
    plugin2.guid                = "{B631E142-E40B-4B4C-90B9-2D00222A286E}";
    plugin2.url                 = "glavred/index.html";
    plugin2.icons               = ["glavred/icon.png", "glavred/icon@2x.png"];
    plugin2.isVisual            = true;
    plugin2.initDataType        = Asc.EPluginDataType.text;
    plugin2.isUpdateOleOnResize = false;
    plugin2.buttons             = [{"text":"Ok","primary":true}];

    var plugin3                 = new Asc.CPlugin();
    plugin3.name                = "bold";
    plugin3.guid                = "{14E46CC2-5E56-429C-9D55-1032B596D928}";
    plugin3.url                 = "bold/index.html";
    plugin3.icons               = ["bold/icon.png", "bold/icon@2x.png"];
    plugin3.isVisual            = false;
    plugin3.initDataType        = Asc.EPluginDataType.none;
    plugin3.isUpdateOleOnResize = false;
    plugin3.buttons             = [];

    var plugin4                 = new Asc.CPlugin();
    plugin4.name                = "speech";
    plugin4.guid                = "{D71C2EF0-F15B-47C7-80E9-86D671F9C595}";
    plugin4.url                 = "speech/index.html";
    plugin4.icons               = ["speech/icon.png", "speech/icon@2x.png"];
    plugin4.isVisual            = false;
    plugin4.initDataType        = Asc.EPluginDataType.text;
    plugin4.isUpdateOleOnResize = false;
    plugin4.buttons             = [];

    var _plugins = [plugin1, plugin2, plugin3, plugin4];
    window.g_asc_plugins.api.asc_pluginsRegister("../../../../sdkjs-plugins/", _plugins);

    // добавляем кнопки (тест)
    var _elem = document.getElementById("view-left-menu").childNodes[1];

    for (var i = 0; i < _plugins.length; i++)
    {
        var _button = "<button class='btn btn-category' content-target='' data-toggle='tooltip' data-original-title='' title='' " +
            "onclick='window.g_asc_plugins.run(\"" + _plugins[i].guid + "\")'><span>" + (i + 1) + "</span></button>";

        _elem.innerHTML += _button;
    }
}
