//todo убрать
//классы для открытия параграфов из бинарников презентаций
function PresentationSimpleSerializer()
{
	this.stream = null;
}
PresentationSimpleSerializer.prototype = {
    ReadTextBody: function(stream)
    {
        if (null == this.stream)
        {
            this.stream = new FileStream();
            this.stream.obj    = stream.obj;
            this.stream.data   = stream.data;
            this.stream.size   = stream.size;
        }

        this.stream.pos    = stream.pos;
        this.stream.cur    = stream.cur;
		
        var s = this.stream;
        var _main_type = s.GetUChar(); // 0!!!

        var txBody = this.ReadTextBodyInternal();
		
        stream.pos = s.pos;
        stream.cur = s.cur;

        return txBody;
    },
    ReadTextBodyInternal: function(shape)
    {
        var txbody = {bodyPr: null, lstStyle: null, content: null, textFieldFlag: null};
        var s = this.stream;

        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;

        while (s.cur < _end_rec)
        {
            var _at = s.GetUChar();
            switch (_at)
            {
                case 0:
                {
                    txbody.bodyPr = this.ReadBodyPr();
                    break;
                }
                case 1:
                {
                    txbody.lstStyle = this.ReadTextListStyle();
                    break;
                }
                case 2:
                {
                    s.Skip2(4);
                    var _c = s.GetULong();
                    txbody.content = new Array();
                    if(_c>0)
                    {
                        txbody.content.length = 0;
                    }

                    var _last_field_type = false;
                    for (var i = 0; i < _c; i++)
                    {
                        s.Skip2(1); // type
                        var _paragraph = this.ReadParagraph(txbody.content);
                        txbody.content.push(_paragraph);
                        if(_paragraph.f_type != undefined || _paragraph.f_text != undefined || _paragraph.f_id != undefined)
                        {
                            _last_field_type = true;
                        }
                    }

                    if(_last_field_type)
                    {
                        txbody.textFieldFlag = true;
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
        return txbody;
    },
	ReadBodyPr: function()
	{
        var bodyPr = {flatTx: null, anchor: null, anchorCtr: null, bIns: null, compatLnSpc: null, forceAA: null, fromWordArt: null, horzOverflow: null,
					 lIns: null, numCol: null, rIns: null, rot: null, rtlCol: null, spcCol: null, spcFirstLastPara: null, tIns: null,
					 upright: null, vert: null, vertOverflow: null, wrap: null, textFit: null};
        var s = this.stream;
        var _end_rec = s.cur + s.GetULong() + 4;

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
                    bodyPr.flatTx = s.GetLong();
                    break;
                }
                case 1:
                {
                    bodyPr.anchor = s.GetUChar();
                    break;
                }
                case 2:
                {
                    bodyPr.anchorCtr = s.GetBool();
                    break;
                }
                case 3:
                {
                    bodyPr.bIns = s.GetLong()/36000;
                    break;
                }
                case 4:
                {
                    bodyPr.compatLnSpc = s.GetBool();
                    break;
                }
                case 5:
                {
                    bodyPr.forceAA = s.GetBool();
                    break;
                }
                case 6:
                {
                    bodyPr.fromWordArt = s.GetBool();
                    break;
                }
                case 7:
                {
                    bodyPr.horzOverflow = s.GetUChar();
                    break;
                }
                case 8:
                {
                    bodyPr.lIns = s.GetLong()/36000;
                    break;
                }
                case 9:
                {
                    bodyPr.numCol = s.GetLong();
                    break;
                }
                case 10:
                {
                    bodyPr.rIns = s.GetLong()/36000;
                    break;
                }
                case 11:
                {
                    bodyPr.rot = s.GetLong();
                    break;
                }
                case 12:
                {
                    bodyPr.rtlCol = s.GetBool();
                    break;
                }
                case 13:
                {
                    bodyPr.spcCol = s.GetLong();
                    break;
                }
                case 14:
                {
                    bodyPr.spcFirstLastPara = s.GetBool();
                    break;
                }
                case 15:
                {
                    bodyPr.tIns = s.GetLong()/36000;
                    break;
                }
                case 16:
                {
                    bodyPr.upright = s.GetBool();
                    break;
                }
                case 17:
                {
                    bodyPr.vert = s.GetUChar();
                    break;
                }
                case 18:
                {
                    bodyPr.vertOverflow = s.GetUChar();
                    break;
                }
                case 19:
                {
                    bodyPr.wrap = s.GetUChar();
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
                case 1:
                {
                    var _end_rec2 = s.cur + s.GetULong() + 4;

                    s.Skip2(1); // start attributes

                    var txFit = new CTextFit();
                    txFit.type = -1;

                    while (true)
                    {
                        var _at2 = s.GetUChar();
                        if (_at2 == g_nodeAttributeEnd)
                            break;

                        switch (_at2)
                        {
                            case 0:
                            {
                                txFit.type = s.GetLong() - 1;
                                break;
                            }
                            case 1:
                            {
                                txFit.fontScale = s.GetLong();
                                break;
                            }
                            case 2:
                            {
                                txFit.lnSpcReduction = s.GetLong();
                                break;
                            }
                            default:
                                break;
                        }
                    }

                    if (txFit.type != -1)
                    {
                        bodyPr.textFit = txFit;
                    }

                    s.Seek2(_end_rec2);
                    break;
                }
                default:
                {
                    s.SkipRecord();
                }
            }
        }
        s.Seek2(_end_rec);
        return bodyPr;
	},
	ReadTextListStyle: function()
	{
        var styles = {levels: new Array(10)};
        var s = this.stream;

        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;

        while (s.cur < _end_rec)
        {
            var _at = s.GetUChar();
            styles.levels[_at] = this.ReadTextParagraphPr();
        }

        s.Seek2(_end_rec);
        return styles;
	},
    ReadTextParagraphPr: function()
    {
        var tPr = {
					rPr: null
		};
		var rPr = null;
	
        var s = this.stream;
        var _end_rec = s.cur + s.GetULong() + 4;

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
                    var _align = s.GetUChar();
                    break;
                }
                case 1:
                {
                    var default_tab = s.GetLong()/36000;
                    break;
                }
                case 2:
                {
                    s.Skip2(1); // eaLnBrk
                    break;
                }
                case 3:
                {
                    s.Skip2(1); // font align
                    break;
                }
                case 4:
                {
                    s.Skip2(1); // hangingPunct
                    break;
                }
                case 5:
                {
                    s.GetLong()
                    break;
                }
                case 6:
                {
                    s.Skip2(1); // latinLnBrk
                    break;
                }
                case 7:
                {
                    s.GetLong();
                    break;
                }
                case 8:
                {
                    s.GetLong();
                    break;
                }
                case 9:
                {
                    s.GetLong();
                    break;
                }
                case 10:
                {
                    s.Skip2(1); // rtl
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
                case 8:
                {
                    tPr.rPr = this.ReadRunProperties();
					break;
                }
                default:
                {
					var cur_pos = s.cur;
                    var _len = s.GetULong();
                    s.Seek2(cur_pos + _len + 4);
                }
            }
        }

        // пока записи не поддерживаем
        s.Seek2(_end_rec);
        return tPr;
    },
	ReadRunProperties: function()
	{
        var rPr = new Object();

        var s = this.stream;
        var _end_rec = s.cur + s.GetULong() + 4;

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
                    var altLang = s.GetString2();
                    break;
                }
                case 1:
                {
                    rPr.Bold = s.GetBool();
                    break;
                }
                case 2:
                {
                    var baseline = s.GetLong();
                    break;
                }
                case 3:
                {
                    var bmk = s.GetString2();
                    break;
                }
                case 4:
                {
                    s.Skip2(1); // cap
                    break;
                }
                case 5:
                {
                    s.Skip2(1); // dirty
                    break;
                }
                case 6:
                {
                    s.Skip2(1); // error
                    break;
                }
                case 7:
                {
                    rPr.Italic = s.GetBool();
                    break;
                }
                case 8:
                {
                    s.Skip2(4); // kern
                    break;
                }
                case 9:
                {
                    s.Skip2(1); // kumimoji
                    break;
                }
                case 10:
                {
                    var lang = s.GetString2();
                    break;
                }
                case 11:
                {
                    s.Skip2(1); // noproof
                    break;
                }
                case 12:
                {
                    s.Skip2(1); // normalizeH
                    break;
                }
                case 13:
                {
                    s.Skip2(1); // smtClean
                    break;
                }
                case 14:
                {
                    s.Skip2(4); // smtId
                    break;
                }
                case 15:
                {
                    s.Skip2(4); // spc
                    break;
                }
                case 16:
                {
                    rPr.Strikeout = (s.GetUChar() != 1);
                    break;
                }
                case 17:
                {
                    var _size = s.GetLong() / 100;
                    _size = ((_size * 2) + 0.5) >> 0;
                    _size /= 2;
                    rPr.FontSize = _size;
                    break;
                }
                case 18:
                {
                    rPr.Underline = (s.GetUChar() != 12);
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
                    rPr.unifill = this.ReadUniFill();
                    break;
                }
                case 2:
                {
                    s.SkipRecord();
                    break;
                }
                case 3:
                {
                    var _font_latin = this.ReadTextFontTypeface();
                    rPr.FontFamily = { Name: _font_latin, Index : -1 };
                    break;
                }
                case 4:
                {
                    var ea = this.ReadTextFontTypeface();
                    break;
                }
                case 5:
                {
                    var cs = this.ReadTextFontTypeface();
                    break;
                }
                case 6:
                {
                    var sym = this.ReadTextFontTypeface();
                    break;
                }
                case 7:
                {
                    s.SkipRecord();
                    break;
                }
                case 8:
                {
                    s.SkipRecord();
                }
                default:
                {
                    s.SkipRecord();
                }
            }
        }

        s.Seek2(_end_rec);

        return rPr;
	},
	ReadUniFill: function()
	{
        var s = this.stream;
        var read_start = s.cur;
        var read_end = read_start + s.GetULong() + 4;

        var uni_fill = new CUniFill();

        if (s.cur < read_end)
        {
            var _type = s.GetUChar();
            var _e = s.cur + s.GetULong() + 4;

            switch (_type)
            {
                case FILL_TYPE_SOLID:
                {
                    s.Skip2(1); // type + len

                    uni_fill.fill = new CSolidFill();
                    uni_fill.fill.color = this.ReadUniColor();

                    var mods = uni_fill.fill.color.Mods.Mods;
                    var _len = mods.length;
                    for (var i = 0; i < _len; i++)
                    {
                        if (mods[i].name == "alpha")
                        {
                            uni_fill.transparent = (255 * mods[i].val / 100000) >> 0;
                            mods.splice(i, 1);
                            break;
                        }
                    }

                    break;
                }
				default:
				{
					s.Seek2(_e);
					break;
				}
            }
        }

        s.Seek2(read_end);
        return uni_fill;
	},
	ReadUniColor : function()
    {
        var s = this.stream;
        var _len = s.GetULong();
        var read_start = s.cur;
        var read_end = read_start + _len;

        var uni_color = new CUniColor();

        if (s.cur < read_end)
        {
            var _type = s.GetUChar();

            var _e = s.cur + s.GetULong() + 4;

            switch (_type)
            {
                case COLOR_TYPE_PRST:
                {
                    s.Skip2(2);
                    uni_color.color = new CPrstColor();
                    uni_color.color.id = s.GetString2();
                    s.Skip2(1);

                    if (s.cur < _e)
                    {
                        if (0 == s.GetUChar())
                        {
                            uni_color.Mods.Mods = this.ReadColorModifiers();
                        }
                    }

                    break;
                }
                case COLOR_TYPE_SCHEME:
                {
                    s.Skip2(2);
                    uni_color.color = new CSchemeColor();
                    uni_color.color.id = s.GetUChar();
                    s.Skip2(1);

                    if (s.cur < _e)
                    {
                        if (0 == s.GetUChar())
                        {
                            uni_color.Mods.Mods = this.ReadColorModifiers();
                        }
                    }

                    break;
                }
                case COLOR_TYPE_SRGB:
                {
                    s.Skip2(1);
                    uni_color.color = new CRGBColor();
                    s.Skip2(1);
                    uni_color.color.RGBA.R = s.GetUChar();
                    s.Skip2(1);
                    uni_color.color.RGBA.G = s.GetUChar();
                    s.Skip2(1);
                    uni_color.color.RGBA.B = s.GetUChar();
                    s.Skip2(1);

                    if (s.cur < _e)
                    {
                        if (0 == s.GetUChar())
                        {
                            uni_color.Mods.Mods = this.ReadColorModifiers();
                        }
                    }

                    break;
                }
                case COLOR_TYPE_SYS:
                {
                    s.Skip2(1);
                    uni_color.color = new CSysColor();

                    while (true)
                    {
                        var _at = s.GetUChar();
                        if (_at == g_nodeAttributeEnd)
                            break;

                        switch (_at)
                        {
                            case 0:
                            {
                                uni_color.color.id = s.GetString2();
                                break;
                            }
                            case 1:
                            {
                                uni_color.color.RGBA.R = s.GetUChar();
                                break;
                            }
                            case 2:
                            {
                                uni_color.color.RGBA.G = s.GetUChar();
                                break;
                            }
                            case 3:
                            {
                                uni_color.color.RGBA.B = s.GetUChar();
                                break;
                            }
                            default:
                                break;
                        }
                    }

                    if (s.cur < _e)
                    {
                        if (0 == s.GetUChar())
                        {
                            uni_color.Mods.Mods = this.ReadColorModifiers();
                        }
                    }

                    break;
                }
            }
        }

        s.Seek2(read_end);
        return uni_color;
    },
	ReadColorModifiers : function()
    {
        var s = this.stream;
        var _start = s.cur;
        var _end = _start + s.GetULong() + 4;

        var _ret = null;

        var _count = s.GetULong();
        for (var i = 0; i < _count; i++)
        {
            if (s.cur > _end)
                break;

            s.Skip2(1);

            var _s1 = s.cur;
            var _e1 = _s1 + s.GetULong() + 4;

            if (_s1 < _e1)
            {
                s.Skip2(1);

                if (null == _ret)
                    _ret = new Array();

                var _mod = new CColorMod();
                _ret[_ret.length] = _mod;

                while (true)
                {
                    var _type = s.GetUChar();

                    if (0 == _type)
                    {
                        _mod.name = s.GetString2();
                        var _find = _mod.name.indexOf(":");
                        if (_find >= 0 && _find < (_mod.name.length - 1))
                        _mod.name = _mod.name.substring(_find + 1);
                    }
                    else if (1 == _type)
                        _mod.val = s.GetLong();
                    else if (g_nodeAttributeEnd == _type)
                        break;
                    else
                        break;
                }
            }

            s.Seek2(_e1);
        }

        s.Seek2(_end);
        return _ret;
    },
	ReadTextFontTypeface: function()
	{
        var s = this.stream;

        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;

        var charset = "";
        var panose = "";
        var pitchFamily = "";
        var typeface = "";

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
                    charset = s.GetString2();
                    break;
                }
                case 1:
                {
                    panose = s.GetString2();
                    break;
                }
                case 2:
                {
                    pitchFamily = s.GetString2();
                    break;
                }
                case 3:
                {
                    typeface = s.GetString2();
                    break;
                }
                default:
                    break;
            }
        }

        s.Seek2(_end_rec);

        return typeface;
	}, 
	ReadParagraph: function()
	{
        var par = {rPr: null, text: ""};
		
        var s = this.stream;

        var _rec_start = s.cur;
        var _end_rec = _rec_start + s.GetULong() + 4;

        while (s.cur < _end_rec)
        {
            var _at = s.GetUChar();
            switch (_at)
            {
                case 0:
                {
                    var textProperties = this.ReadTextParagraphPr();
                    if(textProperties.rPr!=undefined)
                    {
                        par.rPr = textProperties.rPr;
                    }
                    break;
                }
				case 1:
                {
                    var endRunPr =  this.ReadRunProperties();
                    break;
                }
                case 2:
                {
                    s.Skip2(4);

                    var _c = s.GetULong();
                    for (var i = 0; i < _c; i++)
                    {
                        s.Skip2(5); // type (0) + len
                        var _type = s.GetUChar();

                        switch (_type)
                        {
                            case PARRUN_TYPE_RUN:
                            {
                                var _end = s.cur + s.GetULong() + 4;

                                s.Skip2(1); // start attr

                                var _text = "";
                                while (true)
                                {
                                    var _at = s.GetUChar();
                                    if (_at == g_nodeAttributeEnd)
                                        break;

                                    if (0 == _at)
                                        _text = s.GetString2();
                                }

                                s.Seek2(_end);

                                var bIsHyper = false;
								
								par.text += _text;
                                break;
                            }
                            case PARRUN_TYPE_BR:
                            {
                                par.text +=  "\r\n";
								var _end = s.cur + s.GetULong() + 4;

                                s.Seek2(_end);
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
				    s.Skip2(4);
                    var _c = s.GetULong();
					s.Seek2(_c);
                    break;
                }
            }
        }
        s.Seek2(_end_rec);
        return par;
	}
};