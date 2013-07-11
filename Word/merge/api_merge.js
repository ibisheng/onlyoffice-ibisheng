(function () {
	var prot;
	function asc_docs_merge_api()
	{
		if (typeof editor == 'undefined')
		{
			window['editor'] = window.editor = editor = this;
		}	
			
		this.WordControl = new CEditorPage(this);
		this.WordControl.m_oLogicDocument   = new CDocument(this.WordControl.m_oDrawingDocument);
		this.WordControl.m_oDrawingDocument.m_oLogicDocument = this.WordControl.m_oLogicDocument;
		
		this.chartStyleManager = new ChartStyleManager();
		this.chartPreviewManager = new ChartPreviewManager();
	}
	
	asc_docs_merge_api.prototype = {
		LoadDocument: function( doc )
		{
			this.LoadedObjectDS = Common_CopyObj(this.WordControl.m_oLogicDocument.Get_Styles().Style);
			var oBinaryFileReader = new BinaryFileReader(this.WordControl.m_oLogicDocument);
			oBinaryFileReader.Read( doc );
		},
		ApplyChanges: function(e)
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
		},
		Save: function()
		{
			var oBinaryFileWriter = new BinaryFileWriter(this.WordControl.m_oLogicDocument);
			return oBinaryFileWriter.Write();
		}
	};
		
	exports['asc_docs_merge_api'] = asc_docs_merge_api;
	prot = asc_docs_merge_api.prototype;
	
	prot['LoadDocument'] = prot.LoadDocument;
	prot['ApplyChanges'] = prot.ApplyChanges;
	prot['Save'] = prot.Save;		
})();
