"use strict";

AscCommon.baseEditorsApi.prototype._onEndPermissions = function()
{
	if (this.isOnFirstConnectEnd && this.isOnLoadLicense)
	{
		var oResult = new AscCommon.asc_CAscEditorPermissions();
		oResult.asc_setCanLicense(true);
		oResult.asc_setCanBranding(true);
		this.sendEvent('asc_onGetEditorPermissions', oResult);
	}
};