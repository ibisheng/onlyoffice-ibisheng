function CPPTXContentLoader()
{
    this.Reader = null;
    this.Writer = null;

    this.stream = null;
    this.TempMainObject = null;
    this.ParaDrawing = null;
    this.LogicDocument = null;
    this.BaseReader = null;

    this.ImageMapChecker = new Object();

    this.ReadDrawing = function(reader, stream, logicDocument, paraDrawing)
    {
        this.BaseReader = reader;
        if (this.Reader == null)
            this.Reader = new BinaryPPTYLoader();

        if (null != paraDrawing)
        {
            this.ParaDrawing = paraDrawing;
            this.TempMainObject = null;
        }
        this.LogicDocument = logicDocument;

        this.Reader.ImageMapChecker = this.ImageMapChecker;

        if (null == this.stream)
        {
            this.stream = new FileStream();
            this.stream.obj    = stream.obj;
            this.stream.data   = stream.data;
            this.stream.size   = stream.size;
        }

        this.stream.pos    = stream.pos;
        this.stream.cur    = stream.cur;

        this.Reader.stream = this.stream;

        var GrObject = null;

        var s = this.stream;
        var _main_type = s.GetUChar(); // 0!!!

        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;

        s.Skip2(5); // 1 + 4 byte - len

        var _type = s.GetUChar();
        switch (_type)
        {
            case 1:
            {
                GrObject = this.ReadShape();
                break;
            }
            case 2:
            {
                GrObject = this.ReadPic();
                break;
            }
            case 3:
            {
                GrObject = this.ReadCxn();
                break;
            }
            case 4:
            {
                GrObject = this.ReadGroupShape();
                break;
            }
            case 5:
            {
                s.SkipRecord();
                break;
            }
            default:
                break;
        }

        s.Seek2(_end_rec);
        stream.pos = s.pos;
        stream.cur = s.cur;

        return GrObject;
    }

    this.ReadTextBody = function(reader, stream, shape)
    {
        this.BaseReader = reader;
        if (this.Reader == null)
            this.Reader = new BinaryPPTYLoader();

        this.LogicDocument = null;

        this.Reader.ImageMapChecker = this.ImageMapChecker;

        if (null == this.stream)
        {
            this.stream = new FileStream();
            this.stream.obj    = stream.obj;
            this.stream.data   = stream.data;
            this.stream.size   = stream.size;
        }

        this.stream.pos    = stream.pos;
        this.stream.cur    = stream.cur;

        this.Reader.stream = this.stream;

        var s = this.stream;
        var _main_type = s.GetUChar(); // 0!!!

        var txBody = this.Reader.ReadTextBody(shape);

        stream.pos = s.pos;
        stream.cur = s.cur;

        return txBody;
    }

    this.ReadShape = function()
    {
        var s = this.stream;

        var shape = new WordShape(this.TempMainObject == null ? this.ParaDrawing : null, this.LogicDocument, this.LogicDocument.DrawingDocument, this.TempMainObject);

        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;

        s.Skip2(1); // start attributes

        while (true)
        {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd)
                break;

            switch (_at)
            {
                case 0:
                {
                    shape.attrUseBgFill = s.GetBool();
                    break;
                }
                default:
                    break;
            }
        }

        while (s.cur < _end_rec)
        {
            var _at = s.GetUChar();
            switch (_at)
            {
                case 0:
                {
                    s.SkipRecord();
                    break;
                }
                case 1:
                {
                    this.ReadSpPr(shape.spPr);
                    break;
                }
                case 2:
                {
                    shape.style = this.Reader.ReadShapeStyle();
                    break;
                }
                case 3:
                {
                    s.SkipRecord();
                    break;
                }
                case 4:
                {
                    var oThis = this.BaseReader;

                    shape.textBoxContent = new CDocumentContent(shape, this.LogicDocument.DrawingDocument, 0, 0, 0, 0, false, false);

                    var _old_cont = shape.textBoxContent.Content[0];

                    shape.textBoxContent.Content.splice(0, 1);

                    s.Skip2(4); // rec len

                    oThis.stream.pos = s.pos;
                    oThis.stream.cur = s.cur;

                    var oBinary_DocumentTableReader = new Binary_DocumentTableReader(shape.textBoxContent, oThis.oReadResult, null, oThis.stream, false, oThis.oComments);
                    var nDocLength = oThis.stream.GetULongLE();
                    oThis.bcr.Read1(nDocLength, function(t,l){
                        return oBinary_DocumentTableReader.ReadDocumentContent(t,l, shape.textBoxContent.Content);
                    });

                    s.pos = oThis.stream.pos;
                    s.cur = oThis.stream.cur;

                    if (shape.textBoxContent.Content.length == 0)
                        shape.textBoxContent.Content[0] = _old_cont;

                    break;
                }
                case 5:
                {
                    this.Reader.CorrectBodyPr(shape.bodyPr);
                }
                default:
                {
                    break;
                }
            }
        }

        s.Seek2(_end_rec);
        return shape;

    }
    this.ReadCxn = function()
    {
        var s = this.stream;

        var shape = new WordShape(this.TempMainObject == null ? this.ParaDrawing : null, this.LogicDocument, this.LogicDocument.DrawingDocument, this.TempMainObject);

        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;

        s.Skip2(1); // start attributes

        while (true)
        {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd)
                break;

            switch (_at)
            {
                case 0:
                {
                    shape.attrUseBgFill = s.GetBool();
                    break;
                }
                default:
                    break;
            }
        }

        while (s.cur < _end_rec)
        {
            var _at = s.GetUChar();
            switch (_at)
            {
                case 0:
                {
                    s.SkipRecord();
                    break;
                }
                case 1:
                {
                    this.ReadSpPr(shape.spPr);
                    break;
                }
                case 2:
                {
                    shape.style = this.Reader.ReadShapeStyle();
                    break;
                }
                default:
                {
                    break;
                }
            }
        }

        s.Seek2(_end_rec);
        return shape;
    }
    this.ReadPic = function()
    {
        var s = this.stream;

        var pic = new WordImage(this.TempMainObject == null ? this.ParaDrawing : null, this.LogicDocument, this.LogicDocument.DrawingDocument, this.TempMainObject);

        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;

        while (s.cur < _end_rec)
        {
            var _at = s.GetUChar();
            switch (_at)
            {
                case 0:
                {
                    s.SkipRecord();
                    break;
                }
                case 1:
                {
                    var unifill = this.Reader.ReadUniFill();
                    pic.blipFill = unifill.fill;//this.Reader.ReadUniFill();

                    pic.spPr.Fill = new CUniFill();
                    pic.spPr.Fill.fill = pic.blipFill;
                    pic.brush = pic.spPr.Fill;

                    break;
                }
                case 2:
                {
                    this.ReadSpPr(pic.spPr);
                    break;
                }
                case 3:
                {
                    pic.style = this.Reader.ReadShapeStyle();
                    break;
                }
                default:
                {
                    break;
                }
            }
        }

        s.Seek2(_end_rec);
        return pic;
    }
    this.ReadGroupShape = function()
    {
        var s = this.stream;

        var shape = new WordGroupShapes(this.TempMainObject == null ? this.ParaDrawing : null, this.LogicDocument, this.LogicDocument.DrawingDocument, this.TempMainObject);
        this.TempGroupObject = shape;

        var arrGraphicObjects = shape.arrGraphicObjects;

        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;

        while (s.cur < _end_rec)
        {
            var _at = s.GetUChar();
            switch (_at)
            {
                case 0:
                {
                    s.SkipRecord();
                    break;
                }
                case 1:
                {
                    this.ReadSpPr(shape.spPr);
                    break;
                }
                case 2:
                {
                    s.Skip2(4); // len
                    var _c = s.GetULong();
                    for (var i = 0; i < _c; i++)
                    {
                        s.Skip2(1);
                        var __len = s.GetULong();
                        if (__len == 0)
                            continue;

                        var _type = s.GetUChar();

                        switch (_type)
                        {
                            case 1:
                            {
                                arrGraphicObjects[arrGraphicObjects.length] = this.ReadShape();
                                break;
                            }
                            case 2:
                            {
                                arrGraphicObjects[arrGraphicObjects.length] = this.ReadPic();
                                break;
                            }
                            case 3:
                            {
                                arrGraphicObjects[arrGraphicObjects.length] = this.ReadCxn();
                                break;
                            }
                            case 4:
                            {
                                arrGraphicObjects[arrGraphicObjects.length] = this.ReadGroupShape();
                                this.TempGroupObject = shape;
                                break;
                            }
                            case 5:
                            {
                                s.SkipRecord();
                                break;
                            }
                            default:
                                break;
                        }
                    }
                    break;
                }
                default:
                {
                    break;
                }
            }
        }

        s.Seek2(_end_rec);
        this.TempGroupObject = null;
        return shape;
    }

    this.ReadSpPr = function(spPr)
    {
        var s = this.stream;

        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;

        s.Skip2(1); // start attributes

        while (true)
        {
            var _at = s.GetUChar();
            if (_at == g_nodeAttributeEnd)
                break;

            if (0 == _at)
                spPr.bwMode = s.GetUChar();
            else
                break;
        }

        while (s.cur < _end_rec)
        {
            var _at = s.GetUChar();
            switch (_at)
            {
                case 0:
                {
                    spPr.xfrm = this.Reader.ReadXfrm();
                    //this.CorrectXfrm(spPr.xfrm);
                    break;
                }
                case 1:
                {
                    spPr.geometry = this.Reader.ReadGeometry(spPr.xfrm);
                    break;
                }
                case 2:
                {
                    spPr.Fill = this.Reader.ReadUniFill();
                    break;
                }
                case 3:
                {
                    spPr.ln = this.Reader.ReadLn();
                    break;
                }
                case 4:
                {
                    var _len = s.GetULong();
                    s.Skip2(_len);
                    break;
                }
                case 5:
                {
                    var _len = s.GetULong();
                    s.Skip2(_len);
                    break;
                }
                case 6:
                {
                    var _len = s.GetULong();
                    s.Skip2(_len);
                    break;
                }
                default:
                    break;
            }
        }

        s.Seek2(_end_rec);
    }

    this.CorrectXfrm = function(_xfrm)
    {
        if (!_xfrm)
            return;

        if (null == _xfrm.rot)
            return;

        var nInvertRotate = 0;
        if (true === _xfrm.flipH)
            nInvertRotate += 1;
        if (true === _xfrm.flipV)
            nInvertRotate += 1;

        var _rot = _xfrm.rot;
        var _del = 2 * Math.PI;

        if (nInvertRotate)
            _rot = -_rot;

        if (_rot >= _del)
        {
            var _intD = (_rot / _del) >> 0;
            _rot = _rot - _intD * _del;
        }
        else if (_rot < 0)
        {
            var _intD = (-_rot / _del) >> 0;
            _intD = 1 + _intD;
            _rot = _rot + _intD * _del;
        }

        _xfrm.rot = _rot;
    }

    this.ReadTheme = function(reader, stream)
    {
        this.BaseReader = reader;
        if (this.Reader == null)
            this.Reader = new BinaryPPTYLoader();

        if (null == this.stream)
        {
            this.stream = new FileStream();
            this.stream.obj    = stream.obj;
            this.stream.data   = stream.data;
            this.stream.size   = stream.size;
        }

        this.stream.pos    = stream.pos;
        this.stream.cur    = stream.cur;

        this.Reader.stream = this.stream;
        return this.Reader.ReadTheme();
    }

    this.CheckImagesNeeds = function(logicDoc)
    {
        var index = 0;
        logicDoc.ImageMap = new Object();
        for (var i in this.ImageMapChecker)
        {
            logicDoc.ImageMap[index++] = i;
        }
    }
	
	this.Clear = function()
    {
		//вызывается пока только перед вставкой
		this.stream = null;
		this.ImageMapChecker = new Object();
    }
}

function CPPTXContentWriter()
{
    this.BinaryFileWriter = new CBinaryFileWriter();
    this.BinaryFileWriter.Init();
    //this.BinaryFileWriter.IsWordWriter = true;

    this.TreeDrawingIndex = 0;

    this.ShapeTextBoxContent = null;
    this.arrayStackStartsTextBoxContent = [];

    this.arrayStackStarts = [];

    this._Start = function()
    {
        this.ShapeTextBoxContent = new CMemory();
        this.arrayStackStartsTextBoxContent = [];
        this.arrayStackStarts = [];
    }
    this._End = function()
    {
        this.ShapeTextBoxContent = null;
    }

    this.WriteDrawing = function(memory, grObject, Document, oMapCommentId, oNumIdMap)
    {
        this.TreeDrawingIndex++;

        this.arrayStackStarts.push(this.BinaryFileWriter.pos);

        this.BinaryFileWriter.StartRecord(0);
        this.BinaryFileWriter.StartRecord(1);

        if (grObject instanceof WordShape)
        {
            this.WriteShape(grObject, Document, oMapCommentId, oNumIdMap);
        }
        else if (grObject instanceof WordImage)
        {
            this.WriteImage(grObject);
        }
        else if (grObject instanceof WordGroupShapes)
        {
            this.WriteGroup(grObject, Document, oMapCommentId, oNumIdMap);
        }

        this.BinaryFileWriter.EndRecord();
        this.BinaryFileWriter.EndRecord();

        this.TreeDrawingIndex--;

        var oldPos = this.arrayStackStarts[this.arrayStackStarts.length - 1];
        memory.WriteBuffer(this.BinaryFileWriter.data, oldPos, this.BinaryFileWriter.pos - oldPos);
        this.BinaryFileWriter.pos = oldPos;

        this.arrayStackStarts.splice(this.arrayStackStarts.length - 1, 1);
    }

    this.WriteShape = function(shape, Document, oMapCommentId, oNumIdMap)
    {
        var _writer = this.BinaryFileWriter;
        _writer.StartRecord(1);

        _writer.WriteUChar(g_nodeAttributeStart);
        _writer._WriteBool2(0, shape.attrUseBgFill);
        _writer.WriteUChar(g_nodeAttributeEnd);

        shape.spPr.WriteXfrm = shape.spPr.xfrm;

        shape.spPr.Geometry = shape.spPr.geometry;

        var tmpFill = shape.spPr.Fill;
        var isUseTmpFill = false;
        if (tmpFill !== undefined && tmpFill != null)
        {
            var trans = ((tmpFill.transparent != null) && (tmpFill.transparent != 255)) ? tmpFill.transparent : null;
            if (trans != null)
            {
                if (tmpFill.fill === undefined || tmpFill.fill == null)
                {
                    isUseTmpFill = true;
                    shape.spPr.Fill = shape.brush;
                }
            }
        }

        //_writer.WriteRecord1(0, shape.nvSpPr, _writer.WriteUniNvPr);
        _writer.WriteRecord1(1, shape.spPr, _writer.WriteSpPr);
        _writer.WriteRecord2(2, shape.style, _writer.WriteShapeStyle);
        //_writer.WriteRecord2(3, shape.txBody, _writer.WriteTxBody);

        if (shape.textBoxContent)
        {
            _writer.StartRecord(4);
			
			var memory = this.ShapeTextBoxContent;

            this.arrayStackStartsTextBoxContent.push(memory.pos);

			var bdtw = new BinaryDocumentTableWriter(memory, Document, oMapCommentId, oNumIdMap);
			var bcw = new BinaryCommonWriter(memory);
			bcw.WriteItemWithLength(function(){bdtw.WriteDocumentContent(shape.textBoxContent);});

            var oldPos = this.arrayStackStartsTextBoxContent[this.arrayStackStartsTextBoxContent.length - 1];
            _writer.WriteBuffer(memory.data, oldPos, memory.pos - oldPos);
            memory.pos = oldPos;
            this.arrayStackStartsTextBoxContent.splice(this.arrayStackStartsTextBoxContent.length - 1, 1);
			
            _writer.EndRecord();

            _writer.StartRecord(5);
            _writer.WriteBodyPr(shape.bodyPr);
            _writer.EndRecord();
        }

        delete shape.spPr.Geometry;
        if (isUseTmpFill)
        {
            shape.spPr.Fill = tmpFill;
        }

        delete shape.spPr.WriteXfrm;

        _writer.EndRecord();
    }

    this.WriteImage = function(image)
    {
        var _writer = this.BinaryFileWriter;

        _writer.StartRecord(2);
        //_writer.WriteRecord1(0, image.nvPicPr, _writer.WriteUniNvPr);

        image.spPr.WriteXfrm = image.spPr.xfrm;

        image.spPr.Geometry = image.spPr.geometry;
        if (image.spPr.Geometry === undefined || image.spPr.Geometry == null)
        {
            // powerpoint!
            image.spPr.Geometry = CreateGeometry("rect");
        }

        var _unifill = new CUniFill();
        _unifill.fill = image.blipFill;

        _writer.WriteRecord1(1, _unifill, _writer.WriteUniFill);
        _writer.WriteRecord1(2, image.spPr, _writer.WriteSpPr);
        _writer.WriteRecord2(3, image.style, _writer.WriteShapeStyle);

        delete image.spPr.WriteXfrm;
        delete image.spPr.Geometry;

        _writer.EndRecord();
    }

    this.WriteImageBySrc = function(memory, src, w, h)
    {
        this.arrayStackStarts.push(this.BinaryFileWriter.pos);

        var _writer = this.BinaryFileWriter;

        _writer.StartRecord(0);
        _writer.StartRecord(1);

        _writer.StartRecord(2);
        //_writer.WriteRecord1(0, image.nvPicPr, _writer.WriteUniNvPr);

        var spPr = new CSpPr();
        spPr.WriteXfrm = new CXfrm();
        spPr.WriteXfrm.offX = 0;
        spPr.WriteXfrm.offY = 0;
        spPr.WriteXfrm.extX = w;
        spPr.WriteXfrm.extY = h;

        spPr.Geometry = CreateGeometry("rect");

        var _unifill = new CUniFill();
        _unifill.fill = new CBlipFill();
        _unifill.fill.RasterImageId = src;

        _writer.WriteRecord1(1, _unifill, _writer.WriteUniFill);
        _writer.WriteRecord1(2, spPr, _writer.WriteSpPr);

        _writer.EndRecord();

        _writer.EndRecord();
        _writer.EndRecord();

        var oldPos = this.arrayStackStarts[this.arrayStackStarts.length - 1];
        memory.WriteBuffer(this.BinaryFileWriter.data, oldPos, this.BinaryFileWriter.pos - oldPos);
        this.BinaryFileWriter.pos = oldPos;

        this.arrayStackStarts.splice(this.arrayStackStarts.length - 1, 1);
    }

    this.WriteGroup = function(group, Document, oMapCommentId, oNumIdMap)
    {
        var _writer = this.BinaryFileWriter;

        _writer.StartRecord(4);

        group.spPr.WriteXfrm = group.spPr.xfrm;
        if (group.spPr.WriteXfrm)
        {
            group.spPr.WriteXfrm.chOffX = 0;
            group.spPr.WriteXfrm.chOffY = 0;
            group.spPr.WriteXfrm.chExtX = group.spPr.WriteXfrm.extX;
            group.spPr.WriteXfrm.chExtY = group.spPr.WriteXfrm.extY;
        }

        //_writer.WriteRecord1(0, group.nvGrpSpPr, oThis.WriteUniNvPr);
        _writer.WriteRecord1(1, group.spPr, _writer.WriteGrpSpPr);

        delete group.spPr.WriteXfrm;

        var spTree = group.arrGraphicObjects;
        var _len = spTree.length;
        if (0 != _len)
        {
            _writer.StartRecord(2);
            _writer.WriteULong(_len);

            for (var i = 0; i < _len; i++)
            {
                _writer.StartRecord(0);

                if (spTree[i] instanceof WordShape)
                {
                    this.WriteShape(spTree[i], Document, oMapCommentId, oNumIdMap);
                }
                else if(spTree[i] instanceof WordImage)
                {
                    this.WriteImage(spTree[i]);
                }
                else if (spTree[i] instanceof WordGroupShapes)
                {
                    this.WriteGroup(spTree[i], Document, oMapCommentId, oNumIdMap);
                }

                _writer.EndRecord(0);
            }

            _writer.EndRecord();
        }

        _writer.EndRecord();
    }

    this.WriteTheme = function(memory, theme)
    {
        this.BinaryFileWriter.pos = 0;
        this.BinaryFileWriter.WriteTheme(theme);

        memory.WriteBuffer(this.BinaryFileWriter.data, 0, this.BinaryFileWriter.pos);
        this.BinaryFileWriter.pos = 0;
    }
}

window.global_pptx_content_loader = new CPPTXContentLoader();
window.global_pptx_content_writer = new CPPTXContentWriter();