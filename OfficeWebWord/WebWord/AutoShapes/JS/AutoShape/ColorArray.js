/**
 * Created by JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 2/24/12
 * Time: 12:41 PM
 * To change this template use File | Settings | File Templates.
 */

/*function ColorToHSV(color)
{
    var  max = Math.max(color.R, Math.max(color.G, color.B));
    var  min = Math.min(color.R, Math.min(color.G, color.B));

    hue = color.GetHue();
    saturation = (max == 0) ? 0 : 1d - (1d * min / max);
    value = max / 255d;
}*/

function CColor1(r, g, b){
    this.r = r;
    this.g = g;
    this.b = b;
    this.darken = function(a){
        return 'rgba('+ Math.round(this.r*0.9) + ', '+ Math.round(this.g*0.9) + ', '+ Math.round(this.b*0.9) + ', '+ a*0.00390625 + ')';
    };
    this.darkenLess = function(a){
        return 'rgba('+ Math.round(this.r*0.85) + ', '+ Math.round(this.g*0.85) + ', '+ Math.round(this.b*0.85) + ', '+ a*0.00390625 + ')';
    };
    this.lighten  = function(a){
        return 'rgba('+ Math.round(this.r*1.1) + ', '+ Math.round(this.g*1.1) + ', '+ Math.round(this.b*1.1) + ', '+ a*0.00390625 + ')';
    };
    this.lightenLess = function(a){
        return 'rgba('+ Math.round(this.r*1.15) + ', '+ Math.round(this.g*1.15) + ', '+ Math.round(this.b*1.15) + ', '+ a*0.00390625 + ')';
    };
    this.norm  = function(a){
        return 'rgba('+ this.r + ', '+ this.g + ', '+ this.b + ', '+  a*0.00390625 + ')';
    };
    this.none = function(){
        return 'rgba('+ 255 + ', '+ 255 + ', '+ 255 + ', '+ 0 + ')';
    };
}


var ArColor = new Array();
ArColor.Black = new CColor1(0, 0, 0);
ArColor.Red = new CColor1(255, 0, 0);
ArColor.Lime = new CColor1(0, 255, 0);
ArColor.Blue = new CColor1(0, 0, 255);
ArColor.SkyBlue = new CColor1(135, 206, 235);
ArColor.White = new CColor1(255, 255, 255);
ArColor.Thistle = new CColor1(216, 191, 216);
ArColor.Plum = new CColor1(221, 160, 221);
ArColor.Violet = new CColor1(238, 130, 238);
ArColor.Orchid = new CColor1(218, 112, 214);
ArColor.Fuchsia = new CColor1(255, 0, 255);
ArColor.Magenta = new CColor1(255, 0, 255);
ArColor.MediumOrchid = new CColor1(186, 85, 211);
ArColor.MediumPurple = new CColor1(147, 112, 219);
ArColor.BlueViolet = new CColor1(138, 43, 226);
ArColor.DarkViolet = new CColor1(148, 0, 211);
ArColor.DarkOrchid = new CColor1(153, 50, 204);
ArColor.DarkMagenta = new CColor1(139, 0, 139);
ArColor.Purple = new CColor1(128, 0, 128);
ArColor.Indigo = new CColor1(75, 0, 130);
ArColor.SlateBlue = new CColor1(106, 90, 205);
ArColor.DarkSlateBlue = new CColor1(72, 61, 139);
ArColor.Aqua = new CColor1(0, 255, 255);
ArColor.Cyan = new CColor1(0, 255, 255);
ArColor.LightCyan = new CColor1(224, 255, 255);
ArColor.PaleTurquoise = new CColor1(175, 238, 238);
ArColor.Aquamarine = new CColor1(127, 255, 212);
ArColor.Turquoise = new CColor1(64, 224, 208);
ArColor.MediumTurquoise = new CColor1(72, 209, 204);
ArColor.DarkTurquoise = new CColor1(0, 206, 209);
ArColor.CadetBlue = new CColor1(95, 158, 160);
ArColor.SteelBlue = new CColor1(70, 130, 180);
ArColor.LightSteelBlue = new CColor1(176, 196, 222);
ArColor.PowderBlue = new CColor1(176, 224, 230);
ArColor.LightBlue = new CColor1(173, 216, 230);
ArColor.SkyBlue = new CColor1(135, 206, 235);
ArColor.LightSkyBlue = new CColor1(135, 206, 250);
ArColor.DeepSkyBlue = new CColor1(0, 191, 255);
ArColor.DodgerBlue = new CColor1(30, 144, 255);
ArColor.CornflowerBlue = new CColor1(100, 149, 237);
ArColor.MediumSlateBlue = new CColor1(123, 104, 238);
ArColor.RoyalBlue = new CColor1(65, 105, 225);
ArColor.MediumBlue = new CColor1(0, 0, 205);
ArColor.DarkBlue = new CColor1(0, 0, 139);
ArColor.Navy = new CColor1(0, 0, 128);
ArColor.MidnightBlue = new CColor1(25, 25, 112);
ArColor.Gold = new CColor1(255, 215, 0);
ArColor.Yellow = new CColor1(255, 255, 0);
ArColor.LightYellow = new CColor1(255, 255, 224);
ArColor.LemonChiffon = new CColor1(255, 250, 205);
ArColor.LightGoldenrodYellow = new CColor1(250, 250, 210);
ArColor.PapayaWhip = new CColor1(255, 239, 213);
ArColor.Moccasin = new CColor1(255, 228, 181);
ArColor.PeachPuff = new CColor1(255, 218, 185);
ArColor.PaleGoldenrod = new CColor1(238, 232, 170);
ArColor.Khaki = new CColor1(240, 230, 140);
ArColor.DarkKhaki = new CColor1(189, 183, 107);