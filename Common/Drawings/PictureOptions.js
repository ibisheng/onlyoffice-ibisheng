var PICTURE_FORMAT_STACK = 0;
var PICTURE_FORMAT_STACK_SCALE = 1;
var PICTURE_FORMAT_STACK_STRETCH = 2;

function CPictureOptions()
{
    this.applyToEnd       = null;
    this.applyToFront     = null;
    this.applyToSides     = null;
    this.pictureFormat    = null;
    this.pictureStackUnit = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oIdCounter.Add(this, this.Id);
}

CPictureOptions.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_PictureOptions;
    },

    Write_ToBinary: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setApplyToEnd: function(pr)
    {
        History.Add(this, {Type: historyitem_PictureOptions_SetApplyToEnd, oldPr: this.applyToEnd, newPr: pr});
        this.applyToEnd = pr;
    },
    setApplyToFront: function(pr)
    {
        History.Add(this, {Type: historyitem_PictureOptions_SetApplyToFront, oldPr: this.applyToFront, newPr: pr});
        this.applyToFront = pr;
    },
    setApplyToSides: function(pr)
    {
        History.Add(this, {Type: historyitem_PictureOptions_SetApplyToSides, oldPr: this.applyToSides, newPr: pr});
        this.applyToSides = pr;
    },
    setPictureFormat: function(pr)
    {
        History.Add(this, {Type: historyitem_PictureOptions_SetPictureFormat, oldPr: this.pictureFormat, newPr: pr});
        this.pictureFormat = pr;
    },
    setPictureStackUnit: function(pr)
    {
        History.Add(this, {Type: historyitem_PictureOptions_SetPictureStackUnit, oldPr: this.pictureStackUnit, newPr: pr});
        this.pictureStackUnit = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_PictureOptions_SetApplyToEnd:
            {
                this.applyToEnd = data.oldPr;
                break;
            }
            case historyitem_PictureOptions_SetApplyToFront:
            {
                this.applyToFront = data.oldPr;
                break;
            }
            case historyitem_PictureOptions_SetApplyToSides:
            {
                this.applyToSides = data.oldPr;
                break;
            }
            case historyitem_PictureOptions_SetPictureFormat:
            {
                this.pictureFormat = data.oldPr;
                break;
            }
            case historyitem_PictureOptions_SetPictureStackUnit:
            {
                this.pictureStackUnit = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_PictureOptions_SetApplyToEnd:
            {
                this.applyToEnd = data.newPr;
                break;
            }
            case historyitem_PictureOptions_SetApplyToFront:
            {
                this.applyToFront = data.newPr;
                break;
            }
            case historyitem_PictureOptions_SetApplyToSides:
            {
                this.applyToSides = data.newPr;
                break;
            }
            case historyitem_PictureOptions_SetPictureFormat:
            {
                this.pictureFormat = data.newPr;
                break;
            }
            case historyitem_PictureOptions_SetPictureStackUnit:
            {
                this.pictureStackUnit = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_PictureOptions_SetApplyToEnd:
            case historyitem_PictureOptions_SetApplyToFront:
            case historyitem_PictureOptions_SetApplyToSides:
            {
                writeBool(w, data.newPr);
                break;
            }
            case historyitem_PictureOptions_SetPictureFormat:
            {
                writeLong(w, data.newPr);
                break;
            }
            case historyitem_PictureOptions_SetPictureStackUnit:
            {
                writeDouble(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_PictureOptions_SetApplyToEnd:
            {
                this.applyToEnd = readBool(r);
                break;
            }
            case historyitem_PictureOptions_SetApplyToFront:
            {
                this.applyToFront = readBool(r);
                break;
            }
            case historyitem_PictureOptions_SetApplyToSides:
            {
                this.applyToSides= readBool(r);
                break;
            }
            case historyitem_PictureOptions_SetPictureFormat:
            {
                this.pictureFormat = readLong(r);
                break;
            }
            case historyitem_PictureOptions_SetPictureStackUnit:
            {
                this.pictureStackUnit = readDouble(r);
                break;
            }
        }
    }
};