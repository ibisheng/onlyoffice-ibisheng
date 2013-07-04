var editor = undefined;
function asc_docs_api()
{
	if (editor == undefined)
	{
		editor = this;
	}	
	this.WordControl = new CEditorPage(this);
    this.WordControl.m_oLogicDocument   = new CDocument(this.WordControl.m_oDrawingDocument);
    this.WordControl.m_oDrawingDocument.m_oLogicDocument = this.WordControl.m_oLogicDocument;
	
	this.chartStyleManager = new ChartStyleManager();
	this.chartPreviewManager = new ChartPreviewManager();
}

asc_docs_api.prototype.LoadDocument = function( doc )
{
	this.LoadedObjectDS = Common_CopyObj(this.WordControl.m_oLogicDocument.Get_Styles().Style);
	var oBinaryFileReader = new BinaryFileReader(this.WordControl.m_oLogicDocument);
	oBinaryFileReader.Read( doc );
}

asc_docs_api.prototype.CreateFontsCharMap = function()
{
	var _info = new CFontsCharMap();
    _info.StartWork();
    this.WordControl.m_oLogicDocument.Document_CreateFontCharMap(_info);
    return _info.EndWork();
}

asc_docs_api.prototype.ApplyChanges = function(e)
{
	var Count = e.length;
	for (var i = 0; i < Count; i++) 
	{
		var Changes = new CCollaborativeChanges();
		Changes.Set_Id(e[i]["id"]);
		Changes.Set_Data(e[i]["data"]);
		CollaborativeEditing.Add_Changes(Changes);
	}
	if(Count > 0)
		CollaborativeEditing.Apply_OtherChanges();
}
asc_docs_api.prototype.Save = function()
{
	var oBinaryFileWriter = new BinaryFileWriter(this.WordControl.m_oLogicDocument);
	return oBinaryFileWriter.Write();
}

if(window.exports==undefined)
{
	window.exports = {};
}
exports['asc_docs_api'] = asc_docs_api;
asc_docs_api.prototype['LoadDocument'] = asc_docs_api.prototype.LoadDocument;
asc_docs_api.prototype['CreateFontsCharMap'] = asc_docs_api.prototype.CreateFontsCharMap;
asc_docs_api.prototype['ApplyChanges'] = asc_docs_api.prototype.ApplyChanges;
asc_docs_api.prototype['Save'] = asc_docs_api.prototype.Save;