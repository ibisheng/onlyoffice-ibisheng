(function(window, undefined){

    var g_isMouseSendEnabled = false;

    // должны быть методы
    // init(data);
    // button(id)

    window.plugin_sendMessage = function sendMessage(data)
    {
        window.parent.postMessage(data, "*");
    };

    window.plugin_onMessage = function(event)
    {
        if (!window.Asc.plugin)
            return;

        if (typeof(event.data) == "string")
        {
            var pluginData = {};
            try
            {
                pluginData = JSON.parse(event.data);
            }
            catch(err)
            {
                pluginData = {};
            }

            if (pluginData.guid != window.Asc.plugin.guid)
                return;

            var type = pluginData.type;

            if (type == "init")
                window.Asc.plugin.info = pluginData;

            switch (type)
            {
                case "init":
                {
                    window.Asc.plugin.executeCommand = function(type, data)
                    {
                        window.Asc.plugin.info.type = type;
                        window.Asc.plugin.info.data = data;

                        var _message = "";
                        try
                        {
                            _message = JSON.stringify(window.Asc.plugin.info);
                        }
                        catch(err)
                        {
                            _message = JSON.stringify({ type : data });
                        }
                        window.plugin_sendMessage(_message);
                    };

					window.Asc.plugin.executeMethod = function(name, params, callback)
					{
					    if (window.Asc.plugin.isWaitMethod === true)
					        return false;

					    window.Asc.plugin.isWaitMethod = true;
					    window.Asc.plugin.methodCallback = callback;

						window.Asc.plugin.info.type = "method";
						window.Asc.plugin.info.methodName = name;
						window.Asc.plugin.info.data = params;

						var _message = "";
						try
						{
							_message = JSON.stringify(window.Asc.plugin.info);
						}
						catch(err)
						{
							_message = JSON.stringify({ type : data });
						}
						window.plugin_sendMessage(_message);
						return true;
					};

                    window.Asc.plugin.resizeWindow = function(width, height, minW, minH, maxW, maxH)
                    {
                        if (undefined == minW)
                            minW = 0;
                        if (undefined == minH)
                            minH = 0;
                        if (undefined == maxW)
                            maxW = 0;
                        if (undefined == maxH)
                            maxH = 0;

                        var data = JSON.stringify({ width : width, height : height, minw : minW, minh : minH, maxw : maxW, maxh : maxH });

                        window.Asc.plugin.info.type = "resize";
                        window.Asc.plugin.info.data = data;

                        var _message = "";
                        try
                        {
                            _message = JSON.stringify(window.Asc.plugin.info);
                        }
                        catch(err)
                        {
                            _message = JSON.stringify({ type : data });
                        }
                        window.plugin_sendMessage(_message);
                    };

                    window.Asc.plugin.callCommand = function(func, isClose, isCalc)
					{
						var _txtFunc = "var Asc = {}; Asc.scope = " + JSON.stringify(window.Asc.scope) + "; var scope = Asc.scope; (" + func.toString() + ")();";
						var _type = (isClose === true) ? "close" : "command";
						window.Asc.plugin.info.recalculate = (false === isCalc) ? false : true;
						window.Asc.plugin.executeCommand(_type, _txtFunc);
					};

                    window.Asc.plugin.callModule = function(url, callback, isClose)
					{
						var _isClose = isClose;
						var _client = new XMLHttpRequest();
						_client.open("GET", url);

						_client.onreadystatechange = function() {
							if (_client.readyState == 4 && (_client.status == 200 || location.href.indexOf("file:") == 0))
							{
								var _type = (_isClose === true) ? "close" : "command";
								window.Asc.plugin.info.recalculate = true;
								window.Asc.plugin.executeCommand(_type, _client.responseText);
								if (callback)
									callback(_client.responseText);
							}
						};
						_client.send();
					};

					window.Asc.plugin.loadModule = function(url, callback)
					{
						var _client = new XMLHttpRequest();
						_client.open("GET", url);

						_client.onreadystatechange = function() {
							if (_client.readyState == 4 && (_client.status == 200 || location.href.indexOf("file:") == 0))
							{
								if (callback)
									callback(_client.responseText);
							}
						};
						_client.send();
					};

                    window.Asc.plugin.init(window.Asc.plugin.info.data);
                    break;
                }
                case "button":
                {
                    var _buttonId = parseInt(pluginData.button);
                    if (!window.Asc.plugin.button && -1 == _buttonId)
						window.Asc.plugin.executeCommand("close", "");
                    else
                        window.Asc.plugin.button(_buttonId);
                    break;
                }
                case "enableMouseEvent":
                {
                    g_isMouseSendEnabled = pluginData.isEnabled;
					if (window.Asc.plugin.onEnableMouseEvent)
						window.Asc.plugin.onEnableMouseEvent(g_isMouseSendEnabled);
                    break;
                }
                case "onExternalMouseUp":
                {
                    if (window.Asc.plugin.onExternalMouseUp)
                        window.Asc.plugin.onExternalMouseUp();
                    break;
                }
                case "onMethodReturn":
                {
					window.Asc.plugin.isWaitMethod = false;

					if (window.Asc.plugin.methodCallback)
					{
						window.Asc.plugin.methodCallback(pluginData.methodReturnData);
						window.Asc.plugin.methodCallback = null;
					}
					else if (window.Asc.plugin.onMethodReturn)
					{
						window.Asc.plugin.onMethodReturn(pluginData.methodReturnData);
					}
                    break;
                }
				case "onCommandCallback":
				{
					if (window.Asc.plugin.onCommandCallback)
						window.Asc.plugin.onCommandCallback();
					break;
				}
                case "onExternalPluginMessage":
                {
					if (window.Asc.plugin.onExternalPluginMessage && pluginData.data && pluginData.data.type)
						window.Asc.plugin.onExternalPluginMessage(pluginData.data);
                }
                default:
                    break;
            }
        }
    };

    window.onmousemove = function(e)
    {
        if (!g_isMouseSendEnabled || !window.Asc.plugin || !window.Asc.plugin.executeCommand)
            return;

        var _x = (undefined === e.clientX) ? e.pageX : e.clientX;
        var _y = (undefined === e.clientY) ? e.pageY : e.clientY;

        window.Asc.plugin.executeCommand("onmousemove", JSON.stringify({ x : _x, y : _y }));

    };
    window.onmouseup   = function(e)
    {
        if (!g_isMouseSendEnabled || !window.Asc.plugin || !window.Asc.plugin.executeCommand)
            return;

        var _x = (undefined === e.clientX) ? e.pageX : e.clientX;
        var _y = (undefined === e.clientY) ? e.pageY : e.clientY;

        window.Asc.plugin.executeCommand("onmouseup", JSON.stringify({ x : _x, y : _y }));
    };

    window.plugin_sendMessage(JSON.stringify({ guid : window.Asc.plugin.guid, type : "initialize_internal" }));

})(window, undefined);