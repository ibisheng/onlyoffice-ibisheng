"use strict";

function CPPTXContentLoader()
{
    this.Reader = new BinaryPPTYLoader();
    this.Writer = null;

    this.stream = null;
    this.TempMainObject = null;
    this.ParaDrawing = null;
    this.LogicDocument = null;
    this.BaseReader = null;

    this.ImageMapChecker = {};

    this.Start_UseFullUrl = function()
    {
        this.Reader.Start_UseFullUrl();
    }
    this.End_UseFullUrl = function()
    {
        return this.Reader.End_UseFullUrl();
    }

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
        this.Reader.presentation = logicDocument;

        var GrObject = null;

        var s = this.stream;
        var _main_type = s.GetUChar(); // 0!!!

        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;
		if (s.cur < _end_rec){
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
		}

        s.Seek2(_end_rec);
        stream.pos = s.pos;
        stream.cur = s.cur;

        return GrObject;
    }

    this.ReadGraphicObject = function(stream, presentation)
    {
        if (this.Reader == null)
            this.Reader = new BinaryPPTYLoader();

        if(presentation)
        {
            this.Reader.presentation = presentation;
        }
        var oLogicDocument = this.LogicDocument;
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

        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;

        s.Skip2(5); // 1 + 4 byte - len

        var GrObject = this.Reader.ReadGraphicObject();

        s.Seek2(_end_rec);
        stream.pos = s.pos;
        stream.cur = s.cur;
        this.LogicDocument = oLogicDocument;
        return GrObject;
    }

    this.ReadTextBody = function(reader, stream, shape, presentation)
    {
        this.BaseReader = reader;
        if (this.Reader == null)
            this.Reader = new BinaryPPTYLoader();
        if(presentation)
            this.Reader.presentation = presentation;

        var oLogicDocument = this.LogicDocument;
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
        this.LogicDocument = oLogicDocument;
        return txBody;
    }

    this.ReadTextBodyTxPr = function(reader, stream, shape)
    {
        this.BaseReader = reader;
        if (this.Reader == null)
            this.Reader = new BinaryPPTYLoader();

        var oLogicDocument = this.LogicDocument;
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

        var txBody = this.Reader.ReadTextBodyTxPr(shape);

        stream.pos = s.pos;
        stream.cur = s.cur;
        this.LogicDocument = oLogicDocument;
        return txBody;
    }

    this.ReadShapeProperty = function(stream, type)
    {
        if (this.Reader == null)
            this.Reader = new BinaryPPTYLoader();

        var oLogicDocument = this.LogicDocument;
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

        var oNewSpPr;
		if(0 == type){
			oNewSpPr = this.Reader.ReadLn()
		}
		else if(1 == type){
			oNewSpPr = this.Reader.ReadUniFill();
		}
		else{
			oNewSpPr = new AscFormat.CSpPr();
			this.Reader.ReadSpPr(oNewSpPr);
		}

        stream.pos = s.pos;
        stream.cur = s.cur;

        this.LogicDocument = oLogicDocument;
        return oNewSpPr;
    };

    this.ReadShape = function()
    {
        var s = this.stream;

        var shape = new AscFormat.CShape();
        shape.setWordShape(true);
        shape.setBDeleted(false);
        shape.setParent(this.TempMainObject == null ? this.ParaDrawing : null);
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
                    var spPr = new AscFormat.CSpPr();
                    this.ReadSpPr(spPr);
                    shape.setSpPr(spPr);
                    shape.spPr.setParent(shape);
                    break;
                }
                case 2:
                {
                    shape.setStyle(this.Reader.ReadShapeStyle());
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

                    shape.setTextBoxContent(new CDocumentContent(shape, this.LogicDocument.DrawingDocument, 0, 0, 0, 0, false, false));

                    var _old_cont = shape.textBoxContent.Content[0];

                    shape.textBoxContent.Internal_Content_RemoveAll();

                    s.Skip2(4); // rec len

                    oThis.stream.pos = s.pos;
                    oThis.stream.cur = s.cur;

                    var oBinary_DocumentTableReader = new Binary_DocumentTableReader(shape.textBoxContent, oThis.oReadResult, null, oThis.stream, false, oThis.oComments);
                    var nDocLength = oThis.stream.GetULongLE();
                    var content_arr = [];
                    oThis.bcr.Read1(nDocLength, function(t,l){
                        return oBinary_DocumentTableReader.ReadDocumentContent(t,l, content_arr);
                    });
                    for(var i = 0, length = content_arr.length; i < length; ++i)
                        shape.textBoxContent.Internal_Content_Add(i, content_arr[i]);

                    s.pos = oThis.stream.pos;
                    s.cur = oThis.stream.cur;

                    if (shape.textBoxContent.Content.length == 0)
                        shape.textBoxContent.Internal_Content_Add(0, _old_cont);

                    break;
                }
                case 5:
                {
                    var bodyPr = new AscFormat.CBodyPr();
                    this.Reader.CorrectBodyPr(bodyPr);
                    shape.setBodyPr(bodyPr);
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

        var shape = new AscFormat.CShape( );
        shape.setWordShape(true);
        shape.setParent(this.TempMainObject == null ? this.ParaDrawing : null);
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
                    var spPr = new AscFormat.CSpPr();
                    this.ReadSpPr(spPr);
                    shape.setSpPr(spPr);
                    break;
                }
                case 2:
                {
                    shape.setStyle(this.Reader.ReadShapeStyle());
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

        var pic = new CImageShape();
        pic.setBDeleted(false);
        pic.setParent(this.TempMainObject == null ? this.ParaDrawing : null);

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
                    var unifill = this.Reader.ReadUniFill(null, pic, null);
                    pic.setBlipFill(unifill.fill);//this.Reader.ReadUniFill();

                    //pic.spPr.Fill = new AscFormat.CUniFill();
                    //pic.spPr.Fill.fill = pic.blipFill;
                    //pic.brush = pic.spPr.Fill;

                    break;
                }
                case 2:
                {
                    var spPr = new AscFormat.CSpPr();
                    this.ReadSpPr(spPr);
                    pic.setSpPr(spPr);
                    pic.spPr.setParent(pic);
                    break;
                }
                case 3:
                {
                    pic.setStyle(this.Reader.ReadShapeStyle());
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

        var shape = new CGroupShape();

        shape.setBDeleted(false);
        shape.setParent(this.TempMainObject == null ? this.ParaDrawing : null);
        this.TempGroupObject = shape;

        var oldParaDrawing = this.ParaDrawing;
        this.ParaDrawing = null;

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
                    var spPr = new AscFormat.CSpPr();
                    this.ReadSpPr(spPr);
                    shape.setSpPr(spPr);
                    shape.spPr.setParent(shape);
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

                        var sp;
                        switch (_type)
                        {
                            case 1:
                            {
                                sp = this.ReadShape();
                                sp.setGroup(shape);
                                shape.addToSpTree(shape.spTree.length, sp);
                                break;
                            }
                            case 2:
                            {
                                sp = this.ReadPic();
                                sp.setGroup(shape);
                                shape.addToSpTree(shape.spTree.length, sp);
                                break;
                            }
                            case 3:
                            {
                                sp = this.ReadCxn();
                                sp.setGroup(shape);
                                shape.addToSpTree(shape.spTree.length, sp);
                                break;
                            }
                            case 4:
                            {
                                sp = this.ReadGroupShape();
                                sp.setGroup(shape);
                                shape.addToSpTree(shape.spTree.length, sp);
                                break;
                            }
                            case 5:
                            {
                                var _chart = this.Reader.ReadChartDataInGroup(shape);
                                if (null != _chart)
                                {
                                    _chart.setGroup(shape);
                                    shape.addToSpTree(shape.spTree.length, _chart);
                                }
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

        this.ParaDrawing = oldParaDrawing;
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
                    spPr.setXfrm(this.Reader.ReadXfrm());
                    spPr.xfrm.setParent(spPr);
                    //this.CorrectXfrm(spPr.xfrm);
                    break;
                }
                case 1:
                {
                    var oGeometry = this.Reader.ReadGeometry(spPr.xfrm);
                    if(oGeometry && oGeometry.pathLst.length > 0)
                        spPr.setGeometry(oGeometry);
                    if(spPr.geometry)
                        spPr.geometry.setParent(spPr);
                    break;
                }
                case 2:
                {
                    spPr.setFill(this.Reader.ReadUniFill(spPr, null, null));
                    break;
                }
                case 3:
                {
                    spPr.setLn(this.Reader.ReadLn());
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
        this.Reader.ImageMapChecker = this.ImageMapChecker;
        return this.Reader.ReadTheme();
    }

    this.CheckImagesNeeds = function(logicDoc)
    {
        var index = 0;
        logicDoc.ImageMap = {};
        for (var i in this.ImageMapChecker)
        {
            logicDoc.ImageMap[index++] = i;
        }
    }

    this.Clear = function(bClearStreamOnly)
    {
        //вызывается пока только перед вставкой
        this.Reader.stream = null;
        this.stream = null;
        this.BaseReader = null;
        if(!bClearStreamOnly)
            this.ImageMapChecker = {};
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

    this.Start_UseFullUrl = function()
    {
        this.BinaryFileWriter.Start_UseFullUrl();
    }
    this.Start_UseDocumentOrigin = function(origin)
    {
        this.BinaryFileWriter.Start_UseDocumentOrigin(origin);
    }
    this.End_UseFullUrl = function()
    {
        return this.BinaryFileWriter.End_UseFullUrl();
    }

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
    this.WriteTextBody = function(memory, textBody)
    {
        if (this.BinaryFileWriter.UseContinueWriter)
        {
            this.BinaryFileWriter.ImData = memory.ImData;
            this.BinaryFileWriter.data = memory.data;
            this.BinaryFileWriter.len = memory.len;
            this.BinaryFileWriter.pos = memory.pos;
        }
        else
        {
            this.TreeDrawingIndex++;
            this.arrayStackStarts.push(this.BinaryFileWriter.pos);
        }

        var _writer = this.BinaryFileWriter;
        _writer.StartRecord(0);
        _writer.WriteTxBody(textBody);
        _writer.EndRecord();

        if (this.BinaryFileWriter.UseContinueWriter)
        {
            memory.ImData = this.BinaryFileWriter.ImData;
            memory.data = this.BinaryFileWriter.data;
            memory.len = this.BinaryFileWriter.len;
            memory.pos = this.BinaryFileWriter.pos;
        }
        else
        {
            this.TreeDrawingIndex--;

            var oldPos = this.arrayStackStarts[this.arrayStackStarts.length - 1];
            memory.WriteBuffer(this.BinaryFileWriter.data, oldPos, this.BinaryFileWriter.pos - oldPos);
            this.BinaryFileWriter.pos = oldPos;

            this.arrayStackStarts.splice(this.arrayStackStarts.length - 1, 1);
        }
    }
    this.WriteSpPr = function(memory, spPr, type)
    {
        if (this.BinaryFileWriter.UseContinueWriter)
        {
            this.BinaryFileWriter.ImData = memory.ImData;
            this.BinaryFileWriter.data = memory.data;
            this.BinaryFileWriter.len = memory.len;
            this.BinaryFileWriter.pos = memory.pos;
        }
        else
        {
            this.TreeDrawingIndex++;
            this.arrayStackStarts.push(this.BinaryFileWriter.pos);
        }

        var _writer = this.BinaryFileWriter;
        _writer.StartRecord(0);
		if(0 == type)
			_writer.WriteLn(spPr);
		else if(1 == type)
			_writer.WriteUniFill(spPr);
		else
			_writer.WriteSpPr(spPr);
        _writer.EndRecord();

        if (this.BinaryFileWriter.UseContinueWriter)
        {
            memory.ImData = this.BinaryFileWriter.ImData;
            memory.data = this.BinaryFileWriter.data;
            memory.len = this.BinaryFileWriter.len;
            memory.pos = this.BinaryFileWriter.pos;
        }
        else
        {
            this.TreeDrawingIndex--;

            var oldPos = this.arrayStackStarts[this.arrayStackStarts.length - 1];
            memory.WriteBuffer(this.BinaryFileWriter.data, oldPos, this.BinaryFileWriter.pos - oldPos);
            this.BinaryFileWriter.pos = oldPos;

            this.arrayStackStarts.splice(this.arrayStackStarts.length - 1, 1);
        }
    }
    this.WriteDrawing = function(memory, grObject, Document, oMapCommentId, oNumIdMap, copyParams, saveParams)
    {
        this.TreeDrawingIndex++;

        this.arrayStackStarts.push(this.BinaryFileWriter.pos);

        this.BinaryFileWriter.StartRecord(0);
        this.BinaryFileWriter.StartRecord(1);
        switch(grObject.getObjectType())
        {
            case AscDFH.historyitem_type_Shape:
            {
                if(grObject.bWordShape)
                {
                    this.WriteShape(grObject, Document, oMapCommentId, oNumIdMap, copyParams, saveParams);
                }
                else
                {
                    this.WriteShape2(grObject, Document, oMapCommentId, oNumIdMap, copyParams, saveParams);
                }
                break;
            }
            case AscDFH.historyitem_type_ImageShape:
            {
                this.WriteImage(grObject);
                break;
            }
            case AscDFH.historyitem_type_GroupShape:
            {
                this.WriteGroup(grObject, Document, oMapCommentId, oNumIdMap, copyParams, saveParams);
                break;
            }
        }
        this.BinaryFileWriter.EndRecord();
        this.BinaryFileWriter.EndRecord();

        this.TreeDrawingIndex--;

        var oldPos = this.arrayStackStarts[this.arrayStackStarts.length - 1];
        memory.WriteBuffer(this.BinaryFileWriter.data, oldPos, this.BinaryFileWriter.pos - oldPos);
        this.BinaryFileWriter.pos = oldPos;

        this.arrayStackStarts.splice(this.arrayStackStarts.length - 1, 1);
    }

    this.WriteShape2 = function(shape, Document, oMapCommentId, oNumIdMap, copyParams, saveParams)
    {
        var _writer = this.BinaryFileWriter;
        _writer.WriteShape(shape);
    }

    this.WriteShape = function(shape, Document, oMapCommentId, oNumIdMap, copyParams, saveParams)
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

            var bdtw = new BinaryDocumentTableWriter(memory, Document, oMapCommentId, oNumIdMap, copyParams, saveParams);
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

        var _unifill = null;
        if (image.blipFill instanceof AscFormat.CUniFill)
        {
            _unifill = image.blipFill;
        }
        else
        {
            _unifill = new AscFormat.CUniFill();
            _unifill.fill = image.blipFill;
        }

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

        var spPr = new AscFormat.CSpPr();
        spPr.WriteXfrm = new AscFormat.CXfrm();
        spPr.WriteXfrm.offX = 0;
        spPr.WriteXfrm.offY = 0;
        spPr.WriteXfrm.extX = w;
        spPr.WriteXfrm.extY = h;

        spPr.Geometry = CreateGeometry("rect");

        var _unifill = new AscFormat.CUniFill();
        _unifill.fill = new AscFormat.CBlipFill();
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

    this.WriteGroup = function(group, Document, oMapCommentId, oNumIdMap, copyParams, saveParams)
    {
        var _writer = this.BinaryFileWriter;

        _writer.StartRecord(4);

        group.spPr.WriteXfrm = group.spPr.xfrm;
       //if (group.spPr.WriteXfrm)
       //{
       //    group.spPr.WriteXfrm.chOffX = 0;
       //    group.spPr.WriteXfrm.chOffY = 0;
       //    group.spPr.WriteXfrm.chExtX = group.spPr.WriteXfrm.extX;
       //    group.spPr.WriteXfrm.chExtY = group.spPr.WriteXfrm.extY;
       //}

        //_writer.WriteRecord1(0, group.nvGrpSpPr, oThis.WriteUniNvPr);
        _writer.WriteRecord1(1, group.spPr, _writer.WriteGrpSpPr);

        delete group.spPr.WriteXfrm;

        var spTree = group.spTree;
        var _len = spTree.length;
        if (0 != _len)
        {
            _writer.StartRecord(2);
            _writer.WriteULong(_len);

            for (var i = 0; i < _len; i++)
            {
                _writer.StartRecord(0);

                var elem = spTree[i];
                switch(elem.getObjectType())
                {
                    case AscDFH.historyitem_type_Shape:
                    {
                        if(elem.bWordShape)
                        {
                            this.WriteShape(elem, Document, oMapCommentId, oNumIdMap, copyParams, saveParams);
                        }
                        else
                        {
                            this.WriteShape2(elem, Document, oMapCommentId, oNumIdMap, copyParams, saveParams);
                        }
                        break;
                    }
                    case AscDFH.historyitem_type_ImageShape:
                    {
                        this.WriteImage(elem);
                        break;
                    }
                    case AscDFH.historyitem_type_GroupShape:
                    {
                        this.WriteGroup(elem, Document, oMapCommentId, oNumIdMap, copyParams, saveParams);
                        break;
                    }
                    case AscDFH.historyitem_type_ChartSpace:
                    {
                        this.BinaryFileWriter.WriteChart(elem);
                        break;
                    }
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
window.global_pptx_content_loader;
window.global_pptx_content_writer = new CPPTXContentWriter();
window.global_pptx_content_writer;