function asc_docs_api()
{
	this.LogicDocument = new CDocument();
}

asc_docs_api.prototype.LoadDocument = function( doc )
{
	this.LoadedObjectDS = Common_CopyObj(this.LogicDocument.Get_Styles().Style);
	var oBinaryFileReader = new BinaryFileReader(this.LogicDocument);
	oBinaryFileReader.Read( doc );
}

asc_docs_api.prototype.CreateFontsCharMap = function()
{
	var _info = new CFontsCharMap();
    _info.StartWork();
    this.LogicDocument.Document_CreateFontCharMap(_info);
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
		CollaborativeEditing.Apply_OtherChanges(false);
	}
}
asc_docs_api.prototype.Save = function()
{
	var oBinaryFileWriter = new BinaryFileWriter(this.LogicDocument);
	return oBinaryFileWriter.Write();
}

exports['asc_docs_api'] = asc_docs_api;
asc_docs_api.prototype['LoadDocument'] = asc_docs_api.prototype.LoadDocument;
asc_docs_api.prototype['CreateFontsCharMap'] = asc_docs_api.prototype.CreateFontsCharMap;
asc_docs_api.prototype['ApplyChanges'] = asc_docs_api.prototype.ApplyChanges;
asc_docs_api.prototype['Save'] = asc_docs_api.prototype.Save;