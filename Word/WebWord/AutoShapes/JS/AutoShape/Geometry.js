/**
 * Created by JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 2/22/12
 * Time: 11:01 AM
 * To change this template use File | Settings | File Templates.
 */
var multDiv =0,
    plusMinus = 1,
    plusDiv =2,
    ifElse =3,
    abs = 4,
    at2 = 5,
    cat2 = 6,
    cos = 7,
    max =8,
    mod =9,
    pin =10,
    sat2 = 11,
    sin = 12,
    sqrt =13,
    tan =14,
    value =15,
    min =16;

function CalculateGuideValue(name, formula, x, y,z, gdLst)
{
    var xt, yt, zt;

    xt=gdLst[x];
    if(xt===undefined)
        xt=parseInt(x,10);

    yt=gdLst[y];
    if(yt===undefined)
        yt=parseInt(y,10);

    zt=gdLst[z];
    if(zt===undefined)
        zt=parseInt(z,10);

    switch(formula)
    {
        case multDiv:
        {
            gdLst[name]=xt*yt/zt;
            break;
        }
        case plusMinus:
        {
            gdLst[name] = xt+yt-zt;
            break;
        }
        case plusDiv:
        {
            gdLst[name] = (xt+yt)/zt;
            break;
        }
        case ifElse:
        {
            if(xt>0)
                gdLst[name] = yt;
            else
                gdLst[name] = zt;
            break;
        }

        case abs:
        {
            gdLst[name] = Math.abs(xt);
            break;
        }
        case at2:
        {
            gdLst[name] = ATan2(yt, xt);
            break;
        }
        case cat2:
        {
            gdLst[name] = xt*Cos(ATan2(zt, yt));
            break;
        }

        case cos:
        {
            gdLst[name] = xt*Cos(yt);
            break;
        }

        case max:
        {
            gdLst[name] = Math.max(xt, yt);
            break;
        }

        case mod:
        {
            gdLst[name] = Math.sqrt(xt*xt+yt*yt+zt*zt);
            break;
        }

        case pin:
        {
            if (yt < xt)
                gdLst[name] = xt;
            else if (yt > zt)
                gdLst[name] = zt;
            else
                gdLst[name] = yt;
            break;
        }
        case sat2:
        {
            gdLst[name] = xt*Sin(ATan2(zt, yt));
            break;
        }
        case sin:
        {
            gdLst[name] = xt*Sin(yt);
            break;
        }
        case sqrt:
        {
            gdLst[name] = Math.sqrt(xt);
            break;
        }

        case tan:
        {
            gdLst[name] = xt*Tan(yt);
            break;
        }
        case value:
        {
            gdLst[name] = xt;
            break;
        }
        case min:
        {
            gdLst[name] = Math.min(xt, yt);
        }

    }
}

function CalculateGuideLst(gdLstInfo, gdLst)
{
    var info;
    for(var i=0, n=gdLstInfo.length; i<n;i++)
    {
        info=gdLstInfo[i];
        CalculateGuideValue(info.name, info.formula, info.x, info.y, info.z, gdLst);
    }

}

function CalculateCnxLst(cnxLstInfo, cnxLst, gdLst)
{
    var x_, y_, ang_;
    for(var i=0, n=cnxLstInfo.length; i<n;i++)
    {
        ang_=parseInt(cnxLstInfo[i].ang);
        if(isNaN(ang_))
            ang_=gdLst[cnxLstInfo[i].ang];


        x_=gdLst[cnxLstInfo[i].x];
        if(x_===undefined)
            x_=parseInt(cnxLstInfo[i].x);


        y_=gdLst[cnxLstInfo[i].y];
        if(y_===undefined)
            y_=parseInt(cnxLstInfo[i].y);

        if(cnxLst[i]==undefined)
            cnxLst[i]={};

        cnxLst[i].ang=ang_;
        cnxLst[i].x=x_;
        cnxLst[i].y=y_;
    }
}

function CalculateAhXYList(ahXYListInfo, ahXYLst, gdLst)
{
    var  minX, maxX, minY, maxY, posX, posY;
    for(var i=0, n=ahXYListInfo.length; i<n;i++)
    {

        minX=parseInt(ahXYListInfo[i].minX);
        if(isNaN(minX))
            minX=gdLst[ahXYListInfo[i].minX];

        maxX=parseInt(ahXYListInfo[i].maxX);
        if(isNaN(maxX))
            maxX=gdLst[ahXYListInfo[i].maxX];


        minY=parseInt(ahXYListInfo[i].minY);
        if(isNaN(minY))
            minY=gdLst[ahXYListInfo[i].minY];

        maxY=parseInt(ahXYListInfo[i].maxY);
        if(isNaN(maxY))
            maxY=gdLst[ahXYListInfo[i].maxY];


        posX=parseInt(ahXYListInfo[i].posX);
        if(isNaN(posX))
        {
            posX=gdLst[ahXYListInfo[i].posX];
        }

        posY=parseInt(ahXYListInfo[i].posY);
        if(isNaN(posY))
        {
            posY=gdLst[ahXYListInfo[i].posY];
        }


                if(ahXYLst[i]==undefined)
                    ahXYLst[i]={};

                ahXYLst[i].gdRefX=ahXYListInfo[i].gdRefX;
                ahXYLst[i].minX= minX;
                ahXYLst[i].maxX= maxX;

                ahXYLst[i].gdRefY=ahXYListInfo[i].gdRefY;
                ahXYLst[i].minY= minY;
                ahXYLst[i].maxY= maxY;

                ahXYLst[i].posX= posX;
                ahXYLst[i].posY= posY;

    }
}

function CalculateAhPolarList(ahPolarListInfo, ahPolarLst, gdLst)
{
    var  minR, maxR, minAng, maxAng, posX, posY;
    for(var i=0, n=ahPolarListInfo.length; i<n;i++)
    {

        minR=parseInt(ahPolarListInfo[i].minR);
        if(isNaN(minR))
            minR=gdLst[ahPolarListInfo[i].minR];

        maxR=parseInt(ahPolarListInfo[i].maxR);
        if(isNaN(maxR))
            maxR=gdLst[ahPolarListInfo[i].maxR];


        minAng=parseInt(ahPolarListInfo[i].minAng);
        if(isNaN(minAng))
            minAng=gdLst[ahPolarListInfo[i].minAng];

        maxAng=parseInt(ahPolarListInfo[i].maxAng);
        if(isNaN(maxAng))
            maxAng=gdLst[ahPolarListInfo[i].maxAng];


        posX=parseInt(ahPolarListInfo[i].posX);
        if(isNaN(posX))
        {
            posX=gdLst[ahPolarListInfo[i].posX]
        }

        posY=parseInt(ahPolarListInfo[i].posY);
        if(isNaN(posY))
        {
            posY=gdLst[ahPolarListInfo[i].posY];
        }


        if(ahPolarLst[i]==undefined)
        {
            ahPolarLst[i]={};
        }
        ahPolarLst[i].gdRefR=ahPolarListInfo[i].gdRefR;
        ahPolarLst[i].minR = minR;
        ahPolarLst[i].maxR = maxR;

        ahPolarLst[i].gdRefAng = ahPolarListInfo[i].gdRefAng;
        ahPolarLst[i].minAng = minAng;
        ahPolarLst[i].maxAng = maxAng;

        ahPolarLst[i].posX=posX;
        ahPolarLst[i].posY=posY;

    }
}

function Geometry()
{
    this.gdLstInfo=[];
    this.gdLst={};

    this.cnxLstInfo=[];
    this.cnxLst=[];

    this.ahXYLstInfo=[];
    this.ahXYLst=[];

    this.ahPolarLstInfo=[];
    this.ahPolarLst=[];

    this.pathLst=[];
}

 Geometry.prototype=
 {
    AddAdj: function(name, formula, x, y, z)
    {
        this.gdLst[name]=parseInt(x);
    },

    AddGuide: function(name, formula, x, y, z)
    {
        this.gdLstInfo.push(
            {
                name: name,
                formula: formula,
                x: x,
                y: y,
                z: z
            });
    },

    AddCnx: function(ang, x, y)
    {
        this.cnxLstInfo.push(
            {
                ang:ang,
                x:x,
                y:y
            });
    },

    AddHandleXY: function(gdRefX, minX, maxX, gdRefY, minY, maxY, posX, posY)
    {
        this.ahXYLstInfo.push(
            {
                gdRefX:gdRefX,
                minX:minX,
                maxX:maxX,

                gdRefY:gdRefY,
                minY:minY,
                maxY:maxY,

                posX:posX,
                posY:posY
            });
    },

    AddHandlePolar: function(gdRefAng, minAng, maxAng, gdRefR, minR, maxR, posX, posY)
    {
         this.ahPolarLstInfo.push(
             {
                 gdRefAng:gdRefAng,
                 minAng:minAng,
                 maxAng:maxAng,

                 gdRefR:gdRefR,
                 minR:minR,
                 maxR:maxR,

                 posX:posX,
                 posY:posY
             })
    },

    AddPathCommand: function(command, x1, y1, x2, y2, x3, y3)
    {
        switch(command)
        {
            case 0:
            {
                this.pathLst[this.pathLst.length] = new Path(x1, y1, x2, y2, x3);
                break;
            }
            case 1:
            {
                this.pathLst[this.pathLst.length-1].moveTo(x1, y1);
                break;
            }
            case 2:
            {
                this.pathLst[this.pathLst.length-1].lnTo(x1, y1);
                break;
            }
            case 3:
            {
                this.pathLst[this.pathLst.length-1].arcTo(x1/*wR*/, y1/*hR*/, x2/*stAng*/, y2/*swAng*/);
                break;
            }
            case 4:
            {
                this.pathLst[this.pathLst.length-1].quadBezTo(x1, y1, x2, y2);
                break;
            }
            case 5:
            {
                this.pathLst[this.pathLst.length-1].cubicBezTo(x1, y1, x2, y2, x3, y3);
                break;
            }
            case 6:
            {
                this.pathLst[this.pathLst.length-1].close();
            }
        }
    },

    AddRect: function(l, t, r, b)
    {
        this.rectS=new Object({l:l, t: t, r: r, b: b});
    },

    Init: function(w, h)
    {
        this.gdLst._3cd4=16200000;
        this.gdLst._3cd8=8100000;
        this.gdLst._5cd8=13500000;
        this.gdLst._7cd8=18900000;
        this.gdLst.cd2=10800000;
        this.gdLst.cd4=5400000;
        this.gdLst.cd8=2700000;
        this.gdLst.l=0;
        this.gdLst.t=0;
        this.gdLst.h=h;
        this.gdLst.b=h;
        this.gdLst.hd2=h/2;
        this.gdLst.hd3=h/3;
        this.gdLst.hd4=h/4;
        this.gdLst.hd6=h/6;
        this.gdLst.hd8=h/8;
        this.gdLst.hd10=h/10;
        this.gdLst.vc=h/2;
        this.gdLst.w=w;
        this.gdLst.r=w;
        this.gdLst.wd2=w/2;
        this.gdLst.wd3=w/3;
        this.gdLst.wd4=w/4;
        this.gdLst.wd6=w/6;
        this.gdLst.wd8=w/8;
        this.gdLst.wd10=w/10;
        this.gdLst.wd12=w/12;
        this.gdLst.wd32=w/32;
        this.gdLst.hc=w/2;
        this.gdLst.ls=Math.max(w,h);
        this.gdLst.ss=Math.min(w,h);
        this.gdLst.ssd2=this.gdLst.ss/2;
        this.gdLst.ssd4=this.gdLst.ss/4;
        this.gdLst.ssd6=this.gdLst.ss/6;
        this.gdLst.ssd8=this.gdLst.ss/8;
        this.gdLst.ssd16=this.gdLst.ss/16;
        this.gdLst.ssd32=this.gdLst.ss/32;
        CalculateGuideLst(this.gdLstInfo, this.gdLst);
        CalculateCnxLst(this.cnxLstInfo, this.cnxLst, this.gdLst);
        CalculateAhXYList(this.ahXYLstInfo, this.ahXYLst, this.gdLst);
        CalculateAhPolarList(this.ahPolarLstInfo, this.ahPolarLst, this.gdLst);
        for(var i=0, n=this.pathLst.length; i<n; i++)
            this.pathLst[i].init(this.gdLst);
        if(this.rectS!=undefined)
        {
            this.rect={};
            this.rect.l=this.gdLst[this.rectS.l];
            if(this.rect.l===undefined)
            {
                this.rect.l=parseInt(this.rectS.l);
            }

            this.rect.t=this.gdLst[this.rectS.t];
            if(this.rect.t===undefined)
            {
                this.rect.t=parseInt(this.rectS.t);
            }

            this.rect.r=this.gdLst[this.rectS.r];
            if(this.rect.r===undefined)
            {
                this.rect.r=parseInt(this.rectS.r);
            }

             this.rect.b=this.gdLst[this.rectS.b];
            if(this.rect.b===undefined)
            {
                this.rect.b=parseInt(this.rectS.b);
            }
        }
    },

     Recalculate: function(w, h)
    {
        this.gdLst.h=h;
        this.gdLst.b=h;
        this.gdLst.hd2=h*0.5;
        this.gdLst.hd3=h*0.3333;
        this.gdLst.hd4=h*0.25;
        this.gdLst.hd6=h*0.1666666;
        this.gdLst.hd8=h*0.125;
        this.gdLst.hd10=h*0.1;
        this.gdLst.vc=h*0.5;
        this.gdLst.w=w;
        this.gdLst.r=w;
        this.gdLst.wd2=w*0.5;
        this.gdLst.wd3=w/3;
        this.gdLst.wd4=w*0.25;
        this.gdLst.wd6=w*0.166666;
        this.gdLst.wd8=w*0.125;
        this.gdLst.wd10=w*0.1;
        this.gdLst.wd12=w/12;
        this.gdLst.wd32=w*0.03125;
        this.gdLst.hc=w*0.5;
        this.gdLst.ls=Math.max(w,h);
        this.gdLst.ss=Math.min(w,h);
        this.gdLst.ssd2=this.gdLst.ss*0.5;
        this.gdLst.ssd4=this.gdLst.ss*0.25;
        this.gdLst.ssd6=this.gdLst.ss*0.166666;
        this.gdLst.ssd8=this.gdLst.ss*0.125;
        this.gdLst.ssd16=this.gdLst.ss*0.0625;
        this.gdLst.ssd32=this.gdLst.ss*0.03125;
        CalculateGuideLst(this.gdLstInfo, this.gdLst);
        CalculateCnxLst(this.cnxLstInfo, this.cnxLst, this.gdLst);
        CalculateAhXYList(this.ahXYLstInfo, this.ahXYLst, this.gdLst);
        CalculateAhPolarList(this.ahPolarLstInfo, this.ahPolarLst, this.gdLst);
        for(var i=0, n=this.pathLst.length; i<n; i++)
             this.pathLst[i].recalculate(this.gdLst);

        if(this.rectS!=undefined)
        {
            this.rect={};
            this.rect.l=this.gdLst[this.rectS.l];
            if(this.rect.l===undefined)
            {
                this.rect.l=parseInt(this.rectS.l);
            }

            this.rect.t=this.gdLst[this.rectS.t];
            if(this.rect.t===undefined)
            {
                this.rect.t=parseInt(this.rectS.t);
            }

            this.rect.r=this.gdLst[this.rectS.r];
            if(this.rect.r===undefined)
            {
                this.rect.r=parseInt(this.rectS.r);
            }

            this.rect.b=this.gdLst[this.rectS.b];
            if(this.rect.b===undefined)
            {
                this.rect.b=parseInt(this.rectS.b);
            }
        }
    },

     Draw: function(graphics, line_color, line_width, fill_color, alpha, shadow, zoom)
     {
         graphics.m_oContext.shadowOffsetX = shadow.length*Math.cos(shadow.angle)*100/(g_dKoef_pix_to_mm*zoom);
         graphics.m_oContext.shadowOffsetY = shadow.length*Math.sin(shadow.angle)*100/(g_dKoef_pix_to_mm*zoom);
         graphics.m_oContext.shadowBlur = shadow.blur;
         graphics.m_oContext.shadowColor = shadow.color.norm(shadow.alpha);
         graphics.p_width(line_width*10000/(g_dKoef_pix_to_mm*zoom));
         for(var i=0, n=this.pathLst.length; i<n;++i)
            this.pathLst[i].draw(graphics, line_color, line_width, fill_color, alpha);
         if(shadow.length>0||shadow.blur>0)
         {
             graphics.m_oContext.shadowOffsetX = 0;
             graphics.m_oContext.shadowOffsetY = 0;
             graphics.m_oContext.shadowBlur = 0;
             graphics.m_oContext.shadowColor = 0;
             graphics.p_width(line_width*10000/(g_dKoef_pix_to_mm*zoom));
             for(i=0; i<n;++i)
                this.pathLst[i].draw(graphics, line_color, line_width, fill_color, alpha);
         }
     }
 };
