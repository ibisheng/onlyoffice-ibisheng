function CAscEditorPermissions()
{
	this.canEdit = true;
    this.canDownload = true;
    this.canCoAuthoring = true;
    this.canReaderMode = true;
    this.isAutosaveEnable = true;
    this.AutosaveMinInterval = 300;
}
CAscEditorPermissions.prototype.asc_getCanEdit = function(){ return this.canEdit; }
CAscEditorPermissions.prototype.asc_getCanDownload = function(){ return this.canDownload; }
CAscEditorPermissions.prototype.asc_getCanCoAuthoring = function(){ return this.canCoAuthoring; }
CAscEditorPermissions.prototype.asc_getCanReaderMode = function(){ return this.canReaderMode; }
CAscEditorPermissions.prototype.asc_getIsAutosaveEnable = function(){ return this.isAutosaveEnable; }
CAscEditorPermissions.prototype.asc_getAutosaveMinInterval = function(){ return this.AutosaveMinInterval; }

CAscEditorPermissions.prototype.asc_setCanEdit = function(v){ this.canEdit = v; }
CAscEditorPermissions.prototype.asc_setCanDownload = function(v){ this.canDownload = v; }
CAscEditorPermissions.prototype.asc_setCanCoAuthoring = function(v){ this.canCoAuthoring = v; }
CAscEditorPermissions.prototype.asc_setCanReaderMode = function(v){ this.canReaderMode = v; }
CAscEditorPermissions.prototype.asc_setIsAutosaveEnable = function(v){ this.isAutosaveEnable = v; }
CAscEditorPermissions.prototype.asc_setAutosaveMinInterval = function(v){ this.AutosaveMinInterval = v; }