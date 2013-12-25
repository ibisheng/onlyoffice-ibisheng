function CNumFmt()
{
    this.formatCode = null;
    this.sourceLinked = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
CNumFmt.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_NumFmt;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setFormatCode: function(pr)
    {
        History.Add(this, {Type: historyitem_NumFmt_SetFormatCode, oldPr: this.formatCode, newPr: pr});
        this.formatCode = pr;
    },

    setSourceLinked: function(pr)
    {
        History.Add(this, {Type: historyitem_NumFmt_SetSourceLinked, oldPr: this.sourceLinked, newPr: pr});
        this.sourceLinked = pr;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_NumFmt_SetFormatCode:
            {
                this.formatCode = data.oldPr;
                break;
            }
            case historyitem_NumFmt_SetSourceLinked:
            {
                this.sourceLinked = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_NumFmt_SetFormatCode:
            {
                this.formatCode = data.newPr;
                break;
            }
            case historyitem_NumFmt_SetSourceLinked:
            {
                this.sourceLinked = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_NumFmt_SetFormatCode:
            {
                writeString(w, data.newPr);
                break;
            }
            case historyitem_NumFmt_SetSourceLinked:
            {
                writeBool(w, data.newPr);
                break;
            }
        }
    },


    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_NumFmt_SetFormatCode:
            {
                this.formatCode = readString(r);
                break;
            }
            case historyitem_NumFmt_SetSourceLinked:
            {

                this.sourceLinked = readBool(r);
                break;
            }
        }
    }
};