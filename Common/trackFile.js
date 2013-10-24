(
	/**
	 * @param {window} window
	 * @param {undefined} undefined
	 */
function(window, undefined) 
{
	var asc = window["Asc"] ? window["Asc"] : (window["Asc"] = {});
	
	    // tracking type by license type
    var c_TrackingType = { 
		TT_USER_COUNT: 0,          // by user count
        TT_ACTIVE_CONNECTION: 1,   // by active connections
        TT_TIME_USAGE: 2,          // by time of editing
        TT_DOCUMENT_SESSION: 3     // by document editing session count
    };
	
	function CTrackFile(obj)
	{
		if ( !(this instanceof CTrackFile) ) {return new CTrackFile(obj);}
		
		this.trackingType = c_TrackingType.TT_USER_COUNT;
		this.licenseId = null;
		this.trackingUrl = g_sTrackingServiceLocalUrl;
		this.isPeriodicalyTracking = false;
		this.isAliveTrackingOnly = false;
		this.isTrackDone = false;
		
		if(undefined != obj && null != obj)
		{
			if(undefined != obj["licenseId"] && null != obj["licenseId"])
				this.licenseId = obj["licenseId"];
				
			if(undefined != obj["trackingType"] && null != obj["trackingType"])
				this.trackingType = obj["trackingType"];
				
			if(undefined != obj["trackingUrl"] && null != obj["trackingUrl"])
				this.trackingUrl = obj["trackingUrl"];
		}
		
		if(c_TrackingType.TT_ACTIVE_CONNECTION == this.trackingType)
			this.isPeriodicalyTracking = true;
			
		if(c_TrackingType.TT_DOCUMENT_SESSION == this.trackingType)
			this.isAliveTrackingOnly = true;
		
		this.sendTrackFunc = null;
		this.isDocumentModifiedFunc = null;
		this.trackingInterval = 300 * 1000;
		this.docId = null;
		this.userId = null;
	}
	
	CTrackFile.prototype = {
		constructor: CTrackFile,
		Start: function()
		{
			var oThis = this;
		
			if(oThis.isPeriodicalyTracking || !oThis.isTrackDone)
			{
				var _OnTrackingTimer = function(){
					oThis.Start();
				};
				
				var _OnSendTrack = function(){
					setTimeout(_OnTrackingTimer, oThis.trackingInterval);
				};
				
				if(oThis.isAliveTrackingOnly && !oThis._isAlive())
				{
					_OnSendTrack();				
				}
				else
				{
					oThis.isTrackDone = true;
					oThis._sendTrack(_OnSendTrack);
				}
			}		
		},
		Stop: function()
		{},
		setInterval: function(inverval)
		{
			this.trackingInterval = inverval * 1000;
		},
		setDocId: function(docId)
		{
			this.docId = docId;
		},
		setUserId: function(userId)
		{
			this.userId = userId;
		},
		setTrackFunc: function(func)
		{
			if(undefined != func)
				this.sendTrackFunc = func;
		},
		setIsDocumentModifiedFunc: function(func)
		{
			if(undefined != func)
				this.isDocumentModifiedFunc = func;
		},
		_isAlive: function()
		{
			var bAlive = false;
			
			if( null != this.isDocumentModifiedFunc)
				bAlive = this.isDocumentModifiedFunc();
				
			return bAlive;
		},
		_sendTrack: function(callback)
		{
			var rData = {
				"docId": this.docId, 
				"clientId": this.userId,
				"isAlive": this._isAlive()? 1: 0
			};
			
			if(this.sendTrackFunc != null)
				this.sendTrackFunc(callback, this.trackingUrl, JSON.stringify(rData));
		}
	};
	
	asc.CTrackFile = CTrackFile;
}
)(window, undefined);