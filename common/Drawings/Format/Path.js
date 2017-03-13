/*
 * (c) Copyright Ascensio System SIA 2010-2017
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

"use strict";

(
/**
* @param {Window} window
* @param {undefined} undefined
*/
function (window, undefined) {
var moveTo=0,
    lineTo=1,
    arcTo=2,
    bezier3=3,
    bezier4=4,
    close=5;

// Import
var cToRad = AscFormat.cToRad;
var HitToArc = AscFormat.HitToArc;
var ArcToCurvers = AscFormat.ArcToCurvers;
var ArcToOnCanvas = AscFormat.ArcToOnCanvas;
var HitInLine = AscFormat.HitInLine;
var HitInBezier4 = AscFormat.HitInBezier4;
var HitInBezier3 = AscFormat.HitInBezier3;
var MOVE_DELTA = AscFormat.MOVE_DELTA;

    var History = AscCommon.History;

var cToRad2 = (Math.PI/60000)/180;


function CChangesDrawingsAddPathCommand(Class, oCommand, nIndex, bReverse){
    this.Type = AscDFH.historyitem_PathAddPathCommand;
    this.Command = oCommand;
    this.Index = nIndex;
    this.bReverse = bReverse;
	AscDFH.CChangesBase.call(this, Class);
}

	CChangesDrawingsAddPathCommand.prototype = Object.create(AscDFH.CChangesBase.prototype);
	CChangesDrawingsAddPathCommand.prototype.constructor = CChangesDrawingsAddPathCommand;

    CChangesDrawingsAddPathCommand.prototype.Undo = function(){
        if(this.bReverse){
            this.Class.ArrPathCommandInfo.splice(this.Index, 0, this.Command);
        }
        else{
            this.Class.ArrPathCommandInfo.splice(this.Index, 1);
        }
    };
    CChangesDrawingsAddPathCommand.prototype.Redo = function(){
        if(this.bReverse){
            this.Class.ArrPathCommandInfo.splice(this.Index, 1);
        }
        else{
            this.Class.ArrPathCommandInfo.splice(this.Index, 0, this.Command);
        }
    };


    CChangesDrawingsAddPathCommand.prototype.WriteToBinary = function(Writer){
        Writer.WriteLong(this.Index);
        Writer.WriteLong(this.Command.id);
        Writer.WriteBool(!!this.bReverse);
        switch(this.Command.id){
            case moveTo:
            case lineTo:
            {
                Writer.WriteString2(this.Command.X);
                Writer.WriteString2(this.Command.Y);
                break;
            }
            case bezier3:
            {
                Writer.WriteString2(this.Command.X0);
                Writer.WriteString2(this.Command.Y0);
                Writer.WriteString2(this.Command.X1);
                Writer.WriteString2(this.Command.Y1);
                break;
            }
            case bezier4:
            {
                Writer.WriteString2(this.Command.X0);
                Writer.WriteString2(this.Command.Y0);
                Writer.WriteString2(this.Command.X1);
                Writer.WriteString2(this.Command.Y1);
                Writer.WriteString2(this.Command.X2);
                Writer.WriteString2(this.Command.Y2);
                break;
            }
            case arcTo:
            {
                Writer.WriteString2(this.Command.hR);
                Writer.WriteString2(this.Command.wR);
                Writer.WriteString2(this.Command.stAng);
                Writer.WriteString2(this.Command.swAng);
                break;
            }
            case close:
            {
                break;
            }
        }
    };


    CChangesDrawingsAddPathCommand.prototype.ReadFromBinary = function(Reader){
        this.Index = Reader.GetLong();
        this.Command = {};
        this.Command.id = Reader.GetLong();
        this.bReverse = Reader.GetBool();
        switch(this.Command.id){
            case moveTo:
            case lineTo:
            {
                this.Command.X = Reader.GetString2();
                this.Command.Y = Reader.GetString2();
                break;
            }
            case bezier3:
            {
                this.Command.X0 = Reader.GetString2();
                this.Command.Y0 = Reader.GetString2();
                this.Command.X1 = Reader.GetString2();
                this.Command.Y1 = Reader.GetString2();
                break;
            }
            case bezier4:
            {
                this.Command.X0 = Reader.GetString2();
                this.Command.Y0 = Reader.GetString2();
                this.Command.X1 = Reader.GetString2();
                this.Command.Y1 = Reader.GetString2();
                this.Command.X2 = Reader.GetString2();
                this.Command.Y2 = Reader.GetString2();
                break;
            }
            case arcTo:
            {
                this.Command.hR = Reader.GetString2();
                this.Command.wR = Reader.GetString2();
                this.Command.stAng = Reader.GetString2();
                this.Command.swAng = Reader.GetString2();
                break;
            }
            case close:
            {
                break;
            }
        }
    };



    AscDFH.changesFactory[AscDFH.historyitem_PathSetStroke] = AscDFH.CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_PathSetExtrusionOk] = AscDFH.CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_PathSetFill] = AscDFH.CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_PathSetPathH] = AscDFH.CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_PathSetPathW] = AscDFH.CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_PathAddPathCommand] = CChangesDrawingsAddPathCommand;

    AscDFH.drawingsChangesMap[AscDFH.historyitem_PathSetStroke] = function(oClass, value){oClass.stroke = value;};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_PathSetExtrusionOk] = function(oClass, value){oClass.extrusionOk = value;};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_PathSetFill] = function(oClass, value){oClass.fill = value;};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_PathSetPathH] = function(oClass, value){oClass.pathH = value;};
    AscDFH.drawingsChangesMap[AscDFH.historyitem_PathSetPathW] = function(oClass, value){oClass.pathW = value;};


    function Path()
{
    this.stroke      = null;
    this.extrusionOk = null;
    this.fill        = null;
    this.pathH       = null;
    this.pathW       = null;

    this.ArrPathCommandInfo = [];
    this.ArrPathCommand = [];


    this.Id = AscCommon.g_oIdCounter.Get_NewId();
    AscCommon.g_oTableId.Add(this, this.Id);
}

Path.prototype = {

    Get_Id: function()
    {
        return this.Id;
    },
    getObjectType: function()
    {
        return AscDFH.historyitem_type_Path;
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

    Refresh_RecalcData: function()
    {},

    createDuplicate: function()
    {
        var p = new Path();
        p.setStroke(this.stroke);
        p.setExtrusionOk(this.extrusionOk);
        p.setFill(this.fill);
        p.setPathH(this.pathH);
        p.setPathW(this.pathW);
        for(var i = 0; i < this.ArrPathCommandInfo.length; ++i)
        {
            var command = this.ArrPathCommandInfo[i];
            switch (command.id)
            {
                case moveTo:
                case lineTo:
                {
                    var x = command.X;
                    var y = command.Y;
                    p.addPathCommand({id: command.id, X: x, Y: y});
                    break;
                }
                case bezier3:
                {
                    var X0 = command.X0;
                    var Y0 = command.Y0;
                    var X1 = command.X1;
                    var Y1 = command.Y1;
                    p.addPathCommand({id: bezier3, X0: X0, Y0: Y0, X1: X1, Y1: Y1});
                    break;
                }
                case bezier4:
                {
                    var X0 = command.X0;
                    var Y0 = command.Y0;
                    var X1 = command.X1;
                    var Y1 = command.Y1;
                    var X2 = command.X2;
                    var Y2 = command.Y2;
                    p.addPathCommand({id: bezier4, X0: X0, Y0: Y0, X1: X1, Y1: Y1, X2: X2, Y2: Y2});
                    break;
                }
                case arcTo:
                {
                    var hR    = command.hR;
                    var wR    = command.wR;
                    var stAng = command.stAng;
                    var swAng = command.swAng;
                    p.addPathCommand({id: arcTo, hR: hR, wR: wR, stAng: stAng, swAng: swAng});
                    break;
                }
                case close:
                {
                    p.addPathCommand({id:close});
                    break;
                }
            }
        }
        return p;
    },

    setStroke: function(pr)
    {
        History.Add(new AscDFH.CChangesDrawingsBool(this, AscDFH.historyitem_PathSetStroke, this.stroke, pr));
        this.stroke = pr;
    },

    setExtrusionOk: function(pr)
    {
        History.Add(new AscDFH.CChangesDrawingsBool(this, AscDFH.historyitem_PathSetExtrusionOk, this.extrusionOk, pr));
        this.extrusionOk = pr;
    },

    setFill: function(pr)
    {
        History.Add(new AscDFH.CChangesDrawingsString(this, AscDFH.historyitem_PathSetFill, this.fill, pr));
        this.fill = pr;
    },

    setPathH: function(pr)
    {
        History.Add(new AscDFH.CChangesDrawingsLong(this, AscDFH.historyitem_PathSetPathH, this.pathH, pr));
        this.pathH = pr;
    },

    setPathW: function(pr)
    {
        History.Add(new AscDFH.CChangesDrawingsLong(this, AscDFH.historyitem_PathSetPathW, this.pathW, pr));
        this.pathW = pr;
    },

    addPathCommand: function(cmd)
    {
        History.Add(new CChangesDrawingsAddPathCommand(this, cmd, this.ArrPathCommandInfo.length));
        this.ArrPathCommandInfo.push(cmd);
    },

    moveTo: function(x, y)
    {
        this.addPathCommand({id:moveTo, X:x, Y:y});
    },

    lnTo: function(x, y)
    {
        this.addPathCommand({id:lineTo, X:x, Y:y});
    },

    arcTo: function(wR, hR, stAng, swAng)
    {
        this.addPathCommand({id: arcTo, wR: wR, hR: hR, stAng: stAng, swAng: swAng});
    },

    quadBezTo: function(x0, y0, x1, y1)
    {
        this.addPathCommand({id:bezier3, X0:x0, Y0:y0, X1:x1, Y1:y1});
    },

    cubicBezTo: function(x0, y0, x1, y1, x2, y2)
    {
        this.addPathCommand({id:bezier4, X0:x0, Y0:y0, X1:x1, Y1:y1, X2:x2, Y2:y2});
    },

    close: function()
    {
        this.addPathCommand({id:close});
    },

    recalculate: function(gdLst, bResetPathsInfo)
    {
        var ch, cw;
        if(this.pathW!=undefined)
        {
            if(this.pathW > MOVE_DELTA)
            {
                cw = (gdLst["w"]/this.pathW);
            }
            else
            {
                cw = 0;
            }
        }
        else
        {
            cw=1;
        }
        if(this.pathH!=undefined)
        {
            if(this.pathH > MOVE_DELTA)
            {
                ch = (gdLst["h"]/this.pathH);
            }
            else
            {
                ch = 0;
            }
        }
        else
        {
            ch=1;
        }
        var APCI=this.ArrPathCommandInfo, n = APCI.length, cmd;
        var x0, y0, x1, y1, x2, y2, wR, hR, stAng, swAng, lastX, lastY;
        for(var i=0; i<n; ++i)
        {
            cmd=APCI[i];
            switch(cmd.id)
            {
                case moveTo:
                case lineTo:
                {
                    x0=gdLst[cmd.X];
                    if(x0 === undefined)
                    {
                        x0 = parseInt(cmd.X, 10);
                    }

                    y0=gdLst[cmd.Y];
                    if(y0===undefined)
                    {
                        y0=parseInt(cmd.Y, 10);
                    }

                    this.ArrPathCommand[i] ={id:cmd.id, X:x0*cw, Y:y0*ch};

                    lastX=x0*cw;
                    lastY=y0*ch;

                    break;
                }
                case bezier3:
                {

                    x0=gdLst[cmd.X0];
                    if(x0===undefined)
                    {
                        x0=parseInt(cmd.X0, 10);
                    }

                    y0=gdLst[cmd.Y0];
                    if(y0===undefined)
                    {
                        y0=parseInt(cmd.Y0, 10);
                    }

                    x1=gdLst[cmd.X1];
                    if(x1===undefined)
                    {
                        x1=parseInt(cmd.X1, 10);
                    }

                    y1=gdLst[cmd.Y1];
                    if(y1===undefined)
                    {
                        y1=parseInt(cmd.Y1, 10);
                    }

                    this.ArrPathCommand[i]={id:bezier3, X0:x0*cw, Y0: y0*ch, X1:x1*cw, Y1:y1*ch};

                    lastX=x1*cw;
                    lastY=y1*ch;
                    break;
                }
                case bezier4:
                {
                    x0=gdLst[cmd.X0];
                    if(x0===undefined)
                    {
                        x0=parseInt(cmd.X0, 10);
                    }

                    y0=gdLst[cmd.Y0];
                    if(y0===undefined)
                    {
                        y0=parseInt(cmd.Y0, 10);
                    }

                    x1=gdLst[cmd.X1];
                    if(x1===undefined)
                    {
                        x1=parseInt(cmd.X1, 10);
                    }

                    y1=gdLst[cmd.Y1];
                    if(y1===undefined)
                    {
                        y1=parseInt(cmd.Y1, 10);
                    }

                    x2=gdLst[cmd.X2];
                    if(x2===undefined)
                    {
                        x2=parseInt(cmd.X2, 10);
                    }

                    y2=gdLst[cmd.Y2];
                    if(y2===undefined)
                    {
                        y2=parseInt(cmd.Y2, 10);
                    }


                    this.ArrPathCommand[i]={id:bezier4, X0:x0*cw, Y0: y0*ch, X1:x1*cw, Y1:y1*ch, X2:x2*cw, Y2:y2*ch};

                    lastX=x2*cw;
                    lastY=y2*ch;

                    break;
                }
                case arcTo:
                {
                    hR=gdLst[cmd.hR];

                    if(hR===undefined)
                    {
                        hR=parseInt(cmd.hR, 10);
                    }


                    wR=gdLst[cmd.wR];
                    if(wR===undefined)
                    {
                        wR=parseInt(cmd.wR, 10);
                    }

                    stAng=gdLst[cmd.stAng];
                    if(stAng===undefined)
                    {
                        stAng=parseInt(cmd.stAng, 10);
                    }


                    swAng=gdLst[cmd.swAng];
                    if(swAng===undefined)
                    {
                        swAng=parseInt(cmd.swAng, 10);
                    }


                    var a1 = stAng;
                    var a2 = stAng + swAng;
                    var a3 = swAng;

                    stAng = Math.atan2(ch * Math.sin(a1 * cToRad), cw * Math.cos(a1 * cToRad)) / cToRad;
                    swAng = Math.atan2(ch * Math.sin(a2 * cToRad), cw * Math.cos(a2 * cToRad)) / cToRad - stAng;

                    if((swAng > 0) && (a3 < 0)) swAng -= 21600000;
                    if((swAng < 0) && (a3 > 0)) swAng += 21600000;
                    if(swAng == 0 && a3 != 0) swAng = 21600000;

                    var a = wR*cw;
                    var b = hR*ch;
                    var sin2 = Math.sin(stAng*cToRad);
                    var cos2 = Math.cos(stAng*cToRad);
                    var _xrad = cos2 / a;
                    var _yrad = sin2 / b;
                    var l = 1 / Math.sqrt(_xrad * _xrad + _yrad * _yrad);
                    var xc = lastX - l * cos2;
                    var yc = lastY - l * sin2;

                    var sin1 = Math.sin((stAng+swAng)*cToRad);
                    var cos1 = Math.cos((stAng+swAng)*cToRad);
                    var _xrad1 = cos1 / a;
                    var _yrad1 = sin1 / b;
                    var l1 = 1 / Math.sqrt(_xrad1 * _xrad1 + _yrad1 * _yrad1);

                    this.ArrPathCommand[i]={id: arcTo,
                        stX: lastX,
                        stY: lastY,
                        wR: wR*cw,
                        hR: hR*ch,
                        stAng: stAng*cToRad,
                        swAng: swAng*cToRad};

                    lastX = xc + l1 * cos1;
                    lastY = yc + l1 * sin1;


                    break;
                }
                case close:
                {
                    this.ArrPathCommand[i]={id: close};
                    break;
                }
                default:
                {
                    break;
                }
            }
        }
        if(bResetPathsInfo){
            delete this.ArrPathCommandInfo;
        }
    },
    recalculate2: function(gdLst, bResetPathsInfo)
    {
        var k = 10e-10;
        var APCI=this.ArrPathCommandInfo, n = APCI.length, cmd;
        var stAng, swAng, lastX, lastY;
        for(var i=0; i<n; ++i)
        {
            cmd=APCI[i];
            switch(cmd.id)
            {
                case moveTo:
                case lineTo:
                {

                    lastX=cmd.X*k;
                    lastY=cmd.Y*k;
                    this.ArrPathCommand[i] ={id:cmd.id, X:lastX, Y:lastY};
                    break;
                }
                case bezier3:
                {

                    lastX=cmd.X1;
                    lastY=cmd.Y1;

                    this.ArrPathCommand[i]={id:bezier3, X0: cmd.X0*k, Y0: cmd.Y0*k, X1:lastX, Y1:lastY};

                    break;
                }
                case bezier4:
                {
                    lastX=cmd.X2;
                    lastY=cmd.Y2;

                    this.ArrPathCommand[i]={id:bezier4, X0: cmd.X0*k, Y0: cmd.Y0*k, X1: cmd.X1*k, Y1: cmd.Y1*k, X2:lastX, Y2:lastY};
                    break;
                }
                case arcTo:
                {


                    var a1 = cmd.stAng;
                    var a2 = cmd.stAng + cmd.swAng;
                    var a3 = cmd.swAng;

                    stAng = Math.atan2(k * Math.sin(a1 * cToRad), k * Math.cos(a1 * cToRad)) / cToRad;
                    swAng = Math.atan2(k * Math.sin(a2 * cToRad), k * Math.cos(a2 * cToRad)) / cToRad - cmd.stAng;

                    if((swAng > 0) && (a3 < 0)) swAng -= 21600000;
                    if((swAng < 0) && (a3 > 0)) swAng += 21600000;
                    if(swAng == 0 && a3 != 0) swAng = 21600000;

                    var a = cmd.wR*k;
                    var b = cmd.hR*k;
                    var sin2 = Math.sin(stAng*cToRad);
                    var cos2 = Math.cos(stAng*cToRad);
                    var _xrad = cos2 / a;
                    var _yrad = sin2 / b;
                    var l = 1 / Math.sqrt(_xrad * _xrad + _yrad * _yrad);
                    var xc = lastX - l * cos2;
                    var yc = lastY - l * sin2;

                    var sin1 = Math.sin((stAng+swAng)*cToRad);
                    var cos1 = Math.cos((stAng+swAng)*cToRad);
                    var _xrad1 = cos1 / a;
                    var _yrad1 = sin1 / b;
                    var l1 = 1 / Math.sqrt(_xrad1 * _xrad1 + _yrad1 * _yrad1);

                    this.ArrPathCommand[i]={id: arcTo,
                        stX: lastX,
                        stY: lastY,
                        wR: cmd.wR*k,
                        hR: cmd.hR*k,
                        stAng: stAng*cToRad,
                        swAng: swAng*cToRad};

                    lastX = xc + l1 * cos1;
                    lastY = yc + l1 * sin1;


                    break;
                }
                case close:
                {
                    this.ArrPathCommand[i]={id: close};
                    break;
                }
                default:
                {
                    break;
                }
            }
        }
       // if(bResetPathsInfo)
        {
            delete this.ArrPathCommandInfo;
        }
    },

    draw: function(shape_drawer)
    {
        if (shape_drawer.bIsCheckBounds === true && this.fill == "none")
        {
            // это для текстур
            return;
        }
        var bIsDrawLast = false;
        var path = this.ArrPathCommand;
        shape_drawer._s();
        for(var j = 0, l = path.length; j < l; ++j)
        {
            var cmd=path[j];
            switch(cmd.id)
            {
                case moveTo:
                {
                    bIsDrawLast = true;
                    shape_drawer._m(cmd.X, cmd.Y);
                    break;
                }
                case lineTo:
                {
                    bIsDrawLast = true;
                    shape_drawer._l(cmd.X, cmd.Y);
                    break;
                }
                case bezier3:
                {
                    bIsDrawLast = true;
                    shape_drawer._c2(cmd.X0, cmd.Y0, cmd.X1, cmd.Y1);
                    break;
                }
                case bezier4:
                {
                    bIsDrawLast = true;
                    shape_drawer._c(cmd.X0, cmd.Y0, cmd.X1, cmd.Y1, cmd.X2, cmd.Y2);
                    break;
                }
                case arcTo:
                {
                    bIsDrawLast = true;
                    ArcToCurvers(shape_drawer, cmd.stX, cmd.stY, cmd.wR, cmd.hR, cmd.stAng, cmd.swAng);
                    break;
                }
                case close:
                {
                    shape_drawer._z();
                    break;
                }
            }
        }

        if (bIsDrawLast)
        {
            shape_drawer.drawFillStroke(true, this.fill, this.stroke && !shape_drawer.bIsNoStrokeAttack);
        }

        shape_drawer._e();
    },

    check_bounds: function(checker)
    {
        var path=this.ArrPathCommand;
        for(var j=0, l=path.length; j<l; ++j)
        {
            var cmd=path[j];
            switch(cmd.id)
            {
                case moveTo:
                {
                    checker._m(cmd.X, cmd.Y);
                    break;
                }
                case lineTo:
                {
                    checker._l(cmd.X, cmd.Y);
                    break;
                }
                case bezier3:
                {
                    checker._c2(cmd.X0, cmd.Y0, cmd.X1, cmd.Y1);
                    break;
                }
                case bezier4:
                {
                    checker._c(cmd.X0, cmd.Y0, cmd.X1, cmd.Y1, cmd.X2, cmd.Y2);
                    break;
                }
                case arcTo:
                {
                    ArcToCurvers(checker, cmd.stX, cmd.stY, cmd.wR, cmd.hR, cmd.stAng, cmd.swAng);
                    break;
                }
                case close:
                {
                    checker._z();
                    break;
                }
            }
        }
    },

    hitInInnerArea: function(canvasContext, x, y)
    {
        if(this.fill === "none")
            return false;

        var _arr_commands = this.ArrPathCommand;
        var _commands_count = _arr_commands.length;
        var _command_index;
        var _command;
        canvasContext.beginPath();
        for(_command_index = 0; _command_index < _commands_count; ++_command_index)
        {
            _command = _arr_commands[_command_index];
            switch(_command.id)
            {
                case moveTo:
                {
                    canvasContext.moveTo(_command.X, _command.Y);
                    break;
                }
                case lineTo:
                {
                    canvasContext.lineTo(_command.X, _command.Y);
                    break;
                }
                case arcTo:
                {
                    ArcToOnCanvas(canvasContext, _command.stX, _command.stY, _command.wR, _command.hR, _command.stAng, _command.swAng);
                    break;
                }
                case bezier3:
                {
                    canvasContext.quadraticCurveTo(_command.X0, _command.Y0, _command.X1, _command.Y1);
                    break;
                }
                case bezier4:
                {
                    canvasContext.bezierCurveTo(_command.X0, _command.Y0, _command.X1, _command.Y1, _command.X2, _command.Y2);
                    break;
                }
                case close:
                {
                    canvasContext.closePath();
                    if(canvasContext.isPointInPath(x, y))
                    {
                        return true;
                    }
                }
            }
        }
        return false;
    },

    hitInPath: function(canvasContext, x, y)
    {
        var _arr_commands = this.ArrPathCommand;
        var _commands_count = _arr_commands.length;
        var _command_index;
        var _command;
        var _last_x, _last_y;
        var _begin_x, _begin_y;
        for(_command_index = 0; _command_index< _commands_count; ++_command_index)
        {
            _command = _arr_commands[_command_index];
            switch(_command.id)
            {
                case moveTo:
                {
                    _last_x = _command.X;
                    _last_y = _command.Y;
                    _begin_x = _command.X;
                    _begin_y = _command.Y;
                    break;
                }
                case lineTo:
                {
                    if(HitInLine(canvasContext, x, y, _last_x, _last_y, _command.X, _command.Y))
                        return true;
                    _last_x = _command.X;
                    _last_y = _command.Y;
                    break;
                }
                case arcTo:
                {
                    if(HitToArc(canvasContext, x, y,  _command.stX, _command.stY, _command.wR, _command.hR, _command.stAng, _command.swAng))
                        return true;
                    _last_x=(_command.stX-_command.wR*Math.cos(_command.stAng)+_command.wR*Math.cos(_command.swAng));
                    _last_y=(_command.stY-_command.hR*Math.sin(_command.stAng)+_command.hR*Math.sin(_command.swAng));
                    break;
                }
                case bezier3:
                {
                    if(HitInBezier3(canvasContext, x, y, _last_x, _last_y, _command.X0, _command.Y0, _command.X1, _command.Y1))
                        return true;
                    _last_x=_command.X1;
                    _last_y=_command.Y1;
                    break;
                }
                case bezier4:
                {
                    if(HitInBezier4(canvasContext, x, y, _last_x, _last_y, _command.X0, _command.Y0, _command.X1, _command.Y1, _command.X2, _command.Y2))
                        return true;
                    _last_x=_command.X2;
                    _last_y=_command.Y2;
                    break;
                }
                case close:
                {
                    if(HitInLine(canvasContext, x, y, _last_x, _last_y, _begin_x, _begin_y))
                        return true;
                }
            }
        }
        return false;
    },

    isSmartLine : function()
    {
        if (this.ArrPathCommand.length != 2)
            return false;

        if (this.ArrPathCommand[0].id == moveTo && this.ArrPathCommand[1].id == lineTo)
        {
            if (Math.abs(this.ArrPathCommand[0].X - this.ArrPathCommand[1].X) < 0.0001)
                return true;

            if (Math.abs(this.ArrPathCommand[0].Y - this.ArrPathCommand[1].Y) < 0.0001)
                return true;
        }

        return false;
    },

    isSmartRect : function()
    {
        if (this.ArrPathCommand.length != 5)
            return false;

        if (this.ArrPathCommand[0].id != moveTo ||
            this.ArrPathCommand[1].id != lineTo ||
            this.ArrPathCommand[2].id != lineTo ||
            this.ArrPathCommand[3].id != lineTo ||
            (this.ArrPathCommand[4].id != lineTo && this.ArrPathCommand[4].id != close))
            return false;

        var _float_eps = 0.0001;
        if (Math.abs(this.ArrPathCommand[0].X - this.ArrPathCommand[1].X) < _float_eps)
        {
            if (Math.abs(this.ArrPathCommand[1].Y - this.ArrPathCommand[2].Y) < _float_eps)
            {
                if (Math.abs(this.ArrPathCommand[2].X - this.ArrPathCommand[3].X) < _float_eps &&
                    Math.abs(this.ArrPathCommand[3].Y - this.ArrPathCommand[0].Y) < _float_eps)
                {
                    if (this.ArrPathCommand[4].id == close)
                        return true;

                    if (Math.abs(this.ArrPathCommand[0].X - this.ArrPathCommand[4].X) < _float_eps &&
                        Math.abs(this.ArrPathCommand[0].Y - this.ArrPathCommand[4].Y) < _float_eps)
                    {
                        return true;
                    }
                }
            }
        }
        else if (Math.abs(this.ArrPathCommand[0].Y - this.ArrPathCommand[1].Y) < _float_eps)
        {
            if (Math.abs(this.ArrPathCommand[1].X - this.ArrPathCommand[2].X) < _float_eps)
            {
                if (Math.abs(this.ArrPathCommand[2].Y - this.ArrPathCommand[3].Y) < _float_eps &&
                    Math.abs(this.ArrPathCommand[3].X - this.ArrPathCommand[0].X) < _float_eps)
                {
                    if (this.ArrPathCommand[4].id == close)
                        return true;

                    if (Math.abs(this.ArrPathCommand[0].X - this.ArrPathCommand[4].X) < _float_eps &&
                        Math.abs(this.ArrPathCommand[0].Y - this.ArrPathCommand[4].Y) < _float_eps)
                    {
                        return true;
                    }
                }
            }
        }

        return false;
    },

    drawSmart : function(shape_drawer)
    {
        var _graphics   = shape_drawer.Graphics;
        var _full_trans = _graphics.m_oFullTransform;

        if (!_graphics || !_full_trans || undefined == _graphics.m_bIntegerGrid || true === shape_drawer.bIsNoSmartAttack)
            return this.draw(shape_drawer);

        var bIsTransformed = (_full_trans.shx == 0 && _full_trans.shy == 0) ? false : true;

        if (bIsTransformed)
            return this.draw(shape_drawer);

        var isLine = this.isSmartLine();
        var isRect = false;
        if (!isLine)
            isRect = this.isSmartRect();

        if (window["NATIVE_EDITOR_ENJINE"] || ( !isLine && !isRect))
            return this.draw(shape_drawer);

        var _old_int = _graphics.m_bIntegerGrid;

        if (false == _old_int)
            _graphics.SetIntegerGrid(true);

        var dKoefMMToPx = Math.max(_graphics.m_oCoordTransform.sx, 0.001);

        var _ctx = _graphics.m_oContext;
        var bIsStroke = (shape_drawer.bIsNoStrokeAttack || (this.stroke !== true)) ? false : true;
        var bIsEven = false;
        if (bIsStroke)
        {
            var _lineWidth = Math.max((shape_drawer.StrokeWidth * dKoefMMToPx + 0.5) >> 0, 1);
            _ctx.lineWidth = _lineWidth;

            if (_lineWidth & 0x01 == 0x01)
                bIsEven = true;
        }

        var bIsDrawLast = false;
        var path = this.ArrPathCommand;
        shape_drawer._s();

        if (!isRect)
        {
            for(var j = 0, l = path.length; j < l; ++j)
            {
                var cmd=path[j];
                switch(cmd.id)
                {
                    case moveTo:
                    {
                        bIsDrawLast = true;

                        var _x = (_full_trans.TransformPointX(cmd.X, cmd.Y)) >> 0;
                        var _y = (_full_trans.TransformPointY(cmd.X, cmd.Y)) >> 0;
                        if (bIsEven)
                        {
                            _x -= 0.5;
                            _y -= 0.5;
                        }
                        _ctx.moveTo(_x, _y);
                        break;
                    }
                    case lineTo:
                    {
                        bIsDrawLast = true;

                        var _x = (_full_trans.TransformPointX(cmd.X, cmd.Y)) >> 0;
                        var _y = (_full_trans.TransformPointY(cmd.X, cmd.Y)) >> 0;
                        if (bIsEven)
                        {
                            _x -= 0.5;
                            _y -= 0.5;
                        }
                        _ctx.lineTo(_x, _y);
                        break;
                    }
                    case close:
                    {
                        _ctx.closePath();
                        break;
                    }
                }
            }
        }
        else
        {
            var minX = 100000;
            var minY = 100000;
            var maxX = -100000;
            var maxY = -100000;
            bIsDrawLast = true;
            for(var j = 0, l = path.length; j < l; ++j)
            {
                var cmd=path[j];
                switch(cmd.id)
                {
                    case moveTo:
                    case lineTo:
                    {
                        if (minX > cmd.X)
                            minX = cmd.X;
                        if (minY > cmd.Y)
                            minY = cmd.Y;

                        if (maxX < cmd.X)
                            maxX = cmd.X;
                        if (maxY < cmd.Y)
                            maxY = cmd.Y;

                        break;
                    }
                    default:
                        break;
                }
            }

            var _x1 = (_full_trans.TransformPointX(minX, minY)) >> 0;
            var _y1 = (_full_trans.TransformPointY(minX, minY)) >> 0;
            var _x2 = (_full_trans.TransformPointX(maxX, maxY)) >> 0;
            var _y2 = (_full_trans.TransformPointY(maxX, maxY)) >> 0;

            if (bIsEven)
                _ctx.rect(_x1 + 0.5, _y1 + 0.5, _x2 - _x1, _y2 - _y1);
            else
                _ctx.rect(_x1, _y1, _x2 - _x1, _y2 - _y1);
        }

        if (bIsDrawLast)
        {
            shape_drawer.drawFillStroke(true, this.fill, bIsStroke);
        }

        shape_drawer._e();

        if (false == _old_int)
            _graphics.SetIntegerGrid(false);
    }
};




    function Path2(oPathMemory)
    {
        this.stroke      = null;
        this.extrusionOk = null;
        this.fill        = null;
        this.pathH       = null;
        this.pathW       = null;



        this.startPos = 0;
        this.size = 25;

        this.PathMemory = oPathMemory;
        this.ArrPathCommand = oPathMemory.ArrPathCommand;
        this.curLen = 0;

        this.lastX = null;
        this.lastY = null;
    }

    Path2.prototype = {

        checkArray: function(nSize){
            this.ArrPathCommand[this.startPos] += nSize;
            this.PathMemory.curPos = this.startPos + this.ArrPathCommand[this.startPos];
            if(this.PathMemory.curPos + 1 > this.ArrPathCommand.length){

                var aNewArray = new Float64Array((((3/2)*(this.PathMemory.curPos + 1)) >> 0) + 1);
                for(var i = 0; i < this.ArrPathCommand.length; ++i){
                    aNewArray[i] = this.ArrPathCommand[i];
                }
                this.PathMemory.ArrPathCommand = aNewArray;
                this.ArrPathCommand = aNewArray;
            }
        },


        setStroke: function(pr)
        {

            this.stroke = pr;
        },

        setExtrusionOk: function(pr)
        {

            this.extrusionOk = pr;
        },

        setFill: function(pr)
        {

            this.fill = pr;
        },

        setPathH: function(pr)
        {

            this.pathH = pr;
        },

        setPathW: function(pr)
        {

            this.pathW = pr;
        },

        addPathCommand: function(cmd)
        {

            this.ArrPathCommand.push(cmd);
        },

        moveTo: function(x, y)
        {
            this.lastX = x*10e-10;
            this.lastY = y*10e-10;
            this.checkArray(3);
            this.ArrPathCommand[this.startPos + (this.curLen++) + 1] = moveTo;
            this.ArrPathCommand[this.startPos + (this.curLen++) + 1] = this.lastX;
            this.ArrPathCommand[this.startPos + (this.curLen++) + 1] = this.lastY;
        },

        lnTo: function(x, y)
        {

            this.lastX = x*10e-10;
            this.lastY = y*10e-10;
            this.checkArray(3);
            this.ArrPathCommand[this.startPos + (this.curLen++) + 1] = lineTo;
            this.ArrPathCommand[this.startPos + (this.curLen++) + 1] = this.lastX;
            this.ArrPathCommand[this.startPos + (this.curLen++) + 1] = this.lastY;
        },

        arcTo: function(wR, hR, stAng, swAng)
        {

            var a1 = stAng;
            var a2 = stAng + swAng;
            var a3 = swAng;

            stAng = Math.atan2(10e-10 * Math.sin(a1 * cToRad), 10e-10 * Math.cos(a1 * cToRad)) / cToRad;
            swAng = Math.atan2(10e-10 * Math.sin(a2 * cToRad), 10e-10 * Math.cos(a2 * cToRad)) / cToRad - stAng;

            if((swAng > 0) && (a3 < 0)) swAng -= 21600000;
            if((swAng < 0) && (a3 > 0)) swAng += 21600000;
            if(swAng == 0 && a3 != 0) swAng = 21600000;

            var a = wR*10e-10;
            var b = hR*10e-10;
            var sin2 = Math.sin(stAng*cToRad);
            var cos2 = Math.cos(stAng*cToRad);
            var _xrad = cos2 / a;
            var _yrad = sin2 / b;
            var l = 1 / Math.sqrt(_xrad * _xrad + _yrad * _yrad);
            var xc = this.lastX - l * cos2;
            var yc = this.lastY - l * sin2;

            var sin1 = Math.sin((stAng+swAng)*cToRad);
            var cos1 = Math.cos((stAng+swAng)*cToRad);
            var _xrad1 = cos1 / a;
            var _yrad1 = sin1 / b;
            var l1 = 1 / Math.sqrt(_xrad1 * _xrad1 + _yrad1 * _yrad1);




            this.checkArray(7);
            this.ArrPathCommand[this.startPos + (this.curLen++) + 1] = arcTo;
            this.ArrPathCommand[this.startPos + (this.curLen++) + 1] = this.lastX;
            this.ArrPathCommand[this.startPos + (this.curLen++) + 1] = this.lastY;
            this.ArrPathCommand[this.startPos + (this.curLen++) + 1] = wR*10e-10;
            this.ArrPathCommand[this.startPos + (this.curLen++) + 1] = hR*10e-10;
            this.ArrPathCommand[this.startPos + (this.curLen++) + 1] = stAng*cToRad;
            this.ArrPathCommand[this.startPos + (this.curLen++) + 1] = swAng*cToRad;
        },

        quadBezTo: function(x0, y0, x1, y1)
        {


            this.lastX = x1*10e-10;
            this.lastY = y1*10e-10;


            this.checkArray(5);
            this.ArrPathCommand[this.startPos + (this.curLen++) + 1] = bezier3;
            this.ArrPathCommand[this.startPos + (this.curLen++) + 1] = x0*10e-10;
            this.ArrPathCommand[this.startPos + (this.curLen++) + 1] = y0*10e-10;
            this.ArrPathCommand[this.startPos + (this.curLen++) + 1] = this.lastX;
            this.ArrPathCommand[this.startPos + (this.curLen++) + 1] = this.lastY;
        },

        cubicBezTo: function(x0, y0, x1, y1, x2, y2)
        {


            this.lastX = x2*10e-10;
            this.lastY = y2*10e-10;

            this.checkArray(7);
            this.ArrPathCommand[this.startPos + (this.curLen++) + 1] = bezier4;
            this.ArrPathCommand[this.startPos + (this.curLen++) + 1] = x0*10e-10;
            this.ArrPathCommand[this.startPos + (this.curLen++) + 1] = y0*10e-10;
            this.ArrPathCommand[this.startPos + (this.curLen++) + 1] = y1*10e-10;
            this.ArrPathCommand[this.startPos + (this.curLen++) + 1] = y1*10e-10;
            this.ArrPathCommand[this.startPos + (this.curLen++) + 1] = this.lastX;
            this.ArrPathCommand[this.startPos + (this.curLen++) + 1] = this.lastY;
        },


        close: function()
        {
            this.checkArray(1);
            this.ArrPathCommand.push(close);
        },

        draw: function(shape_drawer)
        {
            if (shape_drawer.bIsCheckBounds === true && this.fill == "none")
            {
                // это для текстур
                return;
            }
            var bIsDrawLast = false;
            var path = this.ArrPathCommand;
            shape_drawer._s();
            var i = 0;
            var len = this.PathMemory.ArrPathCommand[this.startPos];
            while(i < len)
            {
                var cmd=path[this.startPos + i + 1];
                switch(cmd)
                {
                    case moveTo:
                    {
                        bIsDrawLast = true;
                        shape_drawer._m(path[this.startPos + i+2], path[this.startPos + i + 3]);
                        i+=3;
                        break;
                    }
                    case lineTo:
                    {
                        bIsDrawLast = true;
                        shape_drawer._l(path[this.startPos + i+2], path[this.startPos + i + 3]);
                        i+=3;
                        break;
                    }
                    case bezier3:
                    {
                        bIsDrawLast = true;
                        shape_drawer._c2(path[this.startPos + i+2], path[this.startPos + i + 3], path[this.startPos + i+4], path[this.startPos + i + 5]);
                        i+=5;
                        break;
                    }
                    case bezier4:
                    {
                        bIsDrawLast = true;
                        shape_drawer._c(path[this.startPos + i+2], path[this.startPos + i + 3], path[this.startPos + i+4], path[this.startPos + i + 5], path[this.startPos + i+6], path[this.startPos + i + 7]);
                        i+=7;
                        break;
                    }
                    case arcTo:
                    {
                        bIsDrawLast = true;
                        ArcToCurvers(shape_drawer, path[this.startPos + i + 2], path[this.startPos + i + 3], path[this.startPos + i + 4], path[this.startPos + i + 5], path[this.startPos + i + 6], path[this.startPos + i + 7]);
                        i+=7;
                        break;
                    }
                    case close:
                    {
                        shape_drawer._z();
                        i+=1;
                        break;
                    }
                }
            }

            if (bIsDrawLast)
            {
                shape_drawer.drawFillStroke(true, "normal", this.stroke && !shape_drawer.bIsNoStrokeAttack);
            }

            shape_drawer._e();
        },


        getCommandByIndex: function(idx){
            var i = 0;
            var path = this.PathMemory.ArrPathCommand;
            var len = path[this.startPos];
            var commandIndex = 0;
            while(i < len)
            {
                var cmd = path[this.startPos + i + 1];
                switch(cmd)
                {
                    case moveTo:
                    {
                        if(idx === commandIndex){
                            return {id: moveTo, X: path[this.startPos + i + 2], Y: path[this.startPos + i + 3]};
                        }
                        i+=3;
                        break;
                    }
                    case lineTo:
                    {
                        if(idx === commandIndex){
                            return {id: moveTo, X: path[this.startPos + i + 2], Y: path[this.startPos + i + 3]};
                        }
                        i+=3;
                        break;
                    }
                    case bezier3:
                    {
                        if(idx === commandIndex){
                            return {id: bezier3, X0: path[this.startPos + i+2], Y0: path[this.startPos + i + 3], X1: path[this.startPos + i+4], Y1: path[this.startPos + i + 5]};
                        }
                        i+=5;
                        break;
                    }
                    case bezier4:
                    {
                        if(idx === commandIndex){
                            return {id: bezier4, X0: path[this.startPos + i+2], Y0: path[this.startPos + i + 3], X1: path[this.startPos + i+4], Y1: path[this.startPos + i + 5],  X2: path[this.startPos + i+6], Y2: path[this.startPos + i + 7]};
                        }
                        i+=7;
                        break;
                    }
                    case arcTo:
                    {
                        if(idx === commandIndex){
                            return {id: arcTo,
                                stX: path[this.startPos + i + 2],
                                stY: path[this.startPos + i + 3],
                                wR: path[this.startPos + i + 4],
                                hR: path[this.startPos + i + 5],
                                stAng: path[this.startPos + i + 6],
                                swAng: path[this.startPos + i + 7]};
                        }

                        i+=7;
                        break;
                    }
                    case close:
                    {

                        if(idx === commandIndex){
                            return {id: close};
                        }
                        i+=1;
                        break;
                    }
                }
                ++commandIndex;
            }
            return null;
        },

        check_bounds: function(shape_drawer)
        {
            var path = this.ArrPathCommand;

            var i = 0;
            var len = this.PathMemory.ArrPathCommand[this.startPos];
            while(i < len)
            {
                var cmd=path[this.startPos + i + 1];
                switch(cmd)
                {
                    case moveTo:
                    {

                        shape_drawer._m(path[this.startPos + i+2], path[this.startPos + i + 3]);
                        i+=3;
                        break;
                    }
                    case lineTo:
                    {

                        shape_drawer._l(path[this.startPos + i+2], path[this.startPos + i + 3]);
                        i+=3;
                        break;
                    }
                    case bezier3:
                    {

                        shape_drawer._c2(path[this.startPos + i+2], path[this.startPos + i + 3], path[this.startPos + i+4], path[this.startPos + i + 5]);
                        i+=5;
                        break;
                    }
                    case bezier4:
                    {

                        shape_drawer._c(path[this.startPos + i+2], path[this.startPos + i + 3], path[this.startPos + i+4], path[this.startPos + i + 5], path[this.startPos + i+6], path[this.startPos + i + 7]);
                        i+=7;
                        break;
                    }
                    case arcTo:
                    {

                        ArcToCurvers(shape_drawer, path[this.startPos + i + 2], path[this.startPos + i + 3], path[this.startPos + i + 4], path[this.startPos + i + 5], path[this.startPos + i + 6], path[this.startPos + i + 7]);
                        i+=7;
                        break;
                    }
                    case close:
                    {
                        shape_drawer._z();
                        i+=1;
                        break;
                    }
                }
            }

        },


        isSmartLine : function()
        {
            var i = 0;
            var path = this.PathMemory.ArrPathCommand;
            var len = path[this.startPos];
            var commandIndex = 0;
            while(i < len)
            {
                if(commandIndex > 1){
                    return false;
                }
                var cmd = path[this.startPos + i + 1];
                switch(cmd)
                {
                    case moveTo:
                    {
                        if(0 !== commandIndex){
                            return false;
                        }
                        i+=3;
                        break;
                    }
                    case lineTo:
                    {
                        if(1 !== commandIndex){
                            return false;
                        }
                        i+=3;
                        break;
                    }
                    default:
                    {
                        return false;
                    }
                }
                ++commandIndex;
            }

            return true;
        },

        isSmartRect : function()
        {
            var i = 0;
            var path = this.PathMemory.ArrPathCommand;
            var len = path[this.startPos];
            var commandIndex = 0;
            var x0, y0, x1, y1, x2, y2, x3, y3, x4, y4,  isCommand4Close = false;
            while(i < len)
            {
                if(commandIndex > 4){
                    return false;
                }
                var cmd = path[this.startPos + i + 1];
                switch(cmd)
                {
                    case moveTo:
                    {
                        if(0 !== commandIndex){
                            return false;
                        }
                        x0 = path[this.startPos + i + 2];
                        y0 = path[this.startPos + i + 3];
                        i+=3;
                        break;
                    }
                    case lineTo:
                    {
                        if(commandIndex === 1){
                            x1 = path[this.startPos + i + 2];
                            y1 = path[this.startPos + i + 3];
                        }
                        else if(commandIndex === 2){
                            x2 = path[this.startPos + i + 2];
                            y2 = path[this.startPos + i + 3];
                        }
                        else if(commandIndex === 3){
                            x3 = path[this.startPos + i + 2];
                            y3 = path[this.startPos + i + 3];
                        }
                        else if(commandIndex === 4){
                            x4 = path[this.startPos + i + 2];
                            y4 = path[this.startPos + i + 3];
                        }
                        i+=3;
                        break;
                    }
                    case close:
                    {
                        if(4 !== commandIndex){
                            return false;
                        }
                        isCommand4Close = true;
                        break;
                    }
                    default:
                    {
                        return false;
                    }
                }
                ++commandIndex;
            }

            if (AscFormat.fApproxEqual(x0, x1))
            {
                if (AscFormat.fApproxEqual(y1, y2))
                {
                    if (AscFormat.fApproxEqual(x2, x3)&&
                        AscFormat.fApproxEqual(y3, y0))
                    {
                        if (isCommand4Close)
                            return true;

                        if (AscFormat.fApproxEqual(x0, x4) &&
                            AscFormat.fApproxEqual(y0, y4))
                        {
                            return true;
                        }
                    }
                }
            }
            else if (AscFormat.fApproxEqual(y0, y1))
            {
                if (AscFormat.fApproxEqual(x1, x2))
                {
                    if (AscFormat.fApproxEqual(y2, y3) &&
                        AscFormat.fApproxEqual(x3, x0))
                    {
                        if (isCommand4Close)
                            return true;

                        if (AscFormat.fApproxEqual(x0, x4) &&
                            AscFormat.fApproxEqual(y0, y4))
                        {
                            return true;
                        }
                    }
                }
            }

            return false;
        },

        drawSmart : function(shape_drawer)
        {
            var _graphics   = shape_drawer.Graphics;
            var _full_trans = _graphics.m_oFullTransform;

            if (!_graphics || !_full_trans || undefined == _graphics.m_bIntegerGrid || true === shape_drawer.bIsNoSmartAttack)
                return this.draw(shape_drawer);

            var bIsTransformed = (_full_trans.shx == 0 && _full_trans.shy == 0) ? false : true;

            if (bIsTransformed)
                return this.draw(shape_drawer);

            var isLine = this.isSmartLine();
            var isRect = false;
            if (!isLine)
                isRect = this.isSmartRect();

            if (window["NATIVE_EDITOR_ENJINE"] || ( !isLine && !isRect))
                return this.draw(shape_drawer);

            var _old_int = _graphics.m_bIntegerGrid;

            if (false == _old_int)
                _graphics.SetIntegerGrid(true);

            var dKoefMMToPx = Math.max(_graphics.m_oCoordTransform.sx, 0.001);

            var _ctx = _graphics.m_oContext;
            var bIsStroke = (shape_drawer.bIsNoStrokeAttack || (this.stroke !== true)) ? false : true;
            var bIsEven = false;
            if (bIsStroke)
            {
                var _lineWidth = Math.max((shape_drawer.StrokeWidth * dKoefMMToPx + 0.5) >> 0, 1);
                _ctx.lineWidth = _lineWidth;

                if (_lineWidth & 0x01 == 0x01)
                    bIsEven = true;
            }

            var bIsDrawLast = false;
            var path = this.ArrPathCommand;
            shape_drawer._s();

            if (!isRect)
            {
                var i = 0;
                var len = this.PathMemory.ArrPathCommand[this.startPos];
                var X, Y;
                while(i < len)
                {
                    var cmd=path[this.startPos + i + 1];
                    switch(cmd)
                    {
                        case moveTo:
                        {
                            bIsDrawLast = true;
                            X = path[this.startPos + i+2];
                            Y = path[this.startPos + i+3];
                            var _x = (_full_trans.TransformPointX(X, Y)) >> 0;
                            var _y = (_full_trans.TransformPointY(X, Y)) >> 0;
                            if (bIsEven)
                            {
                                _x -= 0.5;
                                _y -= 0.5;
                            }
                            _ctx.moveTo(_x, _y);
                            i+=3;
                            break;
                        }
                        case lineTo:
                        {
                            bIsDrawLast = true;
                            X = path[this.startPos + i+2];
                            Y = path[this.startPos + i+3];
                            var _x = (_full_trans.TransformPointX(X, Y)) >> 0;
                            var _y = (_full_trans.TransformPointY(X, Y)) >> 0;
                            if (bIsEven)
                            {
                                _x -= 0.5;
                                _y -= 0.5;
                            }
                            _ctx.lineTo(_x, _y);

                            i+=3;
                            break;
                        }
                        case bezier3:
                        {
                            bIsDrawLast = true;

                            i+=5;
                            break;
                        }
                        case bezier4:
                        {
                            bIsDrawLast = true;
                            i+=7;
                            break;
                        }
                        case arcTo:
                        {
                            bIsDrawLast = true;
                            i+=7;
                            break;
                        }
                        case close:
                        {
                            _ctx.closePath();
                            i+=1;
                            break;
                        }
                    }
                }
            }
            else
            {
                var minX = 100000;
                var minY = 100000;
                var maxX = -100000;
                var maxY = -100000;
                bIsDrawLast = true;
                var i = 0;
                var len = this.PathMemory.ArrPathCommand[this.startPos], X, Y;
                while(i < len)
                {
                    var cmd=path[this.startPos + i + 1];
                    switch(cmd)
                    {
                        case moveTo:
                        case lineTo:
                        {
                            bIsDrawLast = true;
                            X = path[this.startPos + i + 2];
                            Y = path[this.startPos + i + 3];
                            if (minX > X)
                                minX = X;
                            if (minY > Y)
                                minY = Y;

                            if (maxX < X)
                                maxX = X;
                            if (maxY < Y)
                                maxY = Y;

                            i+=3;
                            break;
                        }
                        case bezier3:
                        {
                            bIsDrawLast = true;
                            i+=5;
                            break;
                        }
                        case bezier4:
                        {
                            bIsDrawLast = true;
                            i+=7;
                            break;
                        }
                        case arcTo:
                        {
                            bIsDrawLast = true;
                            i+=7;
                            break;
                        }
                        case close:
                        {
                            i+=1;
                            break;
                        }
                    }
                }

                var _x1 = (_full_trans.TransformPointX(minX, minY)) >> 0;
                var _y1 = (_full_trans.TransformPointY(minX, minY)) >> 0;
                var _x2 = (_full_trans.TransformPointX(maxX, maxY)) >> 0;
                var _y2 = (_full_trans.TransformPointY(maxX, maxY)) >> 0;

                if (bIsEven)
                    _ctx.rect(_x1 + 0.5, _y1 + 0.5, _x2 - _x1, _y2 - _y1);
                else
                    _ctx.rect(_x1, _y1, _x2 - _x1, _y2 - _y1);
            }

            if (bIsDrawLast)
            {
                shape_drawer.drawFillStroke(true, this.fill, bIsStroke);
            }

            shape_drawer._e();

            if (false == _old_int)
                _graphics.SetIntegerGrid(false);
        }
    };





function partition_bezier3(x0, y0, x1, y1, x2, y2, epsilon)
{
    var dx01 = x1 - x0;
    var dy01 = y1 - y0;
    var dx12 = x2 - x1;
    var dy12 = y2 - y1;

    var r01 = Math.sqrt(dx01*dx01 + dy01*dy01);
    var r12 = Math.sqrt(dx12*dx12 + dy12*dy12);
    if(Math.max(r01, r12) < epsilon)
    {
        return [{x: x0, y: y0}, {x: x1, y: y1}, {x: x2, y: y2}];
    }

    var x01 = (x0 + x1)*0.5;
    var y01 = (y0 + y1)*0.5;

    var x12 = (x1 + x2)*0.5;
    var y12 = (y1 + y2)*0.5;

    var x012 = (x01 + x12)*0.5;
    var y012 = (y01 + y12)*0.5;

    return  partition_bezier3(x0, y0, x01, y01, x012, y012, epsilon).concat(partition_bezier3(x012, y012, x12, y12, x2, y2, epsilon));
}

function partition_bezier4(x0, y0, x1, y1, x2, y2, x3, y3, epsilon)
{
    var dx01 = x1 - x0;
    var dy01 = y1 - y0;
    var dx12 = x2 - x1;
    var dy12 = y2 - y1;
    var dx23 = x3 - x2;
    var dy23 = y3 - y2;

    var r01 = Math.sqrt(dx01*dx01 + dy01*dy01);
    var r12 = Math.sqrt(dx12*dx12 + dy12*dy12);
    var r23 = Math.sqrt(dx23*dx23 + dy23*dy23);

    if(Math.max(r01, r12, r23) < epsilon)
        return [{x: x0, y: y0}, {x: x1, y: y1}, {x: x2, y: y2}, {x: x3, y: y3}];


    var x01 = (x0 + x1)*0.5;
    var y01 = (y0 + y1)*0.5;

    var x12 = (x1 + x2)*0.5;
    var y12 = (y1 + y2)*0.5;

    var x23 = (x2 + x3)*0.5;
    var y23 = (y2 + y3)*0.5;

    var x012 = (x01 + x12)*0.5;
    var y012 = (y01 + y12)*0.5;

    var x123 = (x12 + x23)*0.5;
    var y123 = (y12 + y23)*0.5;

    var x0123 = (x012 + x123)*0.5;
    var y0123 = (y012 + y123)*0.5;

    return partition_bezier4(x0, y0, x01, y01, x012, y012, x0123, y0123, epsilon).concat(partition_bezier4(x0123, y0123, x123, y123, x23, y23, x3, y3, epsilon));
}

    //--------------------------------------------------------export----------------------------------------------------
    window['AscFormat'] = window['AscFormat'] || {};
    window['AscFormat'].moveTo = moveTo;
    window['AscFormat'].lineTo = lineTo;
    window['AscFormat'].arcTo = arcTo;
    window['AscFormat'].bezier3 = bezier3;
    window['AscFormat'].bezier4 = bezier4;
    window['AscFormat'].close = close;
    window['AscFormat'].cToRad2 = cToRad2;
    window['AscFormat'].Path = Path;
    window['AscFormat'].Path2 = Path2;
    window['AscFormat'].partition_bezier3 = partition_bezier3;
    window['AscFormat'].partition_bezier4 = partition_bezier4;
})(window);
