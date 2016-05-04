"use strict";

(function(window, undefined){
CRFonts.prototype.Merge = function(RFonts)
{
    if ( undefined !== RFonts.Ascii )
        this.Ascii = RFonts.Ascii;

    if ( undefined != RFonts.EastAsia )
        this.EastAsia = RFonts.EastAsia;
    else if ( undefined !== RFonts.Ascii )
        this.EastAsia = RFonts.Ascii;

    if ( undefined != RFonts.HAnsi )
        this.HAnsi = RFonts.HAnsi;

    else if ( undefined !== RFonts.Ascii )
        this.HAnsi = RFonts.Ascii;

    if ( undefined != RFonts.CS )
        this.CS = RFonts.CS;

    else if ( undefined !== RFonts.Ascii )
        this.CS = RFonts.Ascii;

    if ( undefined != RFonts.Hint )
        this.Hint = RFonts.Hint;
};
})(window);
