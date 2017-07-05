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

					window.Asc.plugin.executeMethod = function(name, params)
					{
					    if (window.Asc.plugin.isWaitMethod === true)
					        return false;

					    window.Asc.plugin.isWaitMethod = true;

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

                    window.Asc.plugin.init(window.Asc.plugin.info.data);
                    break;
                }
                case "button":
                {
                    window.Asc.plugin.button(parseInt(pluginData.button));
                    break;
                }
                case "enableMouseEvent":
                {
                    g_isMouseSendEnabled = pluginData.isEnabled;
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
                    if (window.Asc.plugin.onMethodReturn)
                        window.Asc.plugin.onMethodReturn(pluginData.methodReturnData);
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