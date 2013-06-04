//     SectPr  : Настройки секци (размеры, поля)
//               PgSz : размеры страницы
//                     W, H, Orient
//               PgMar: отступы страницы
//                      Top, Left, Right, Bottom, Header, Footer
//

function SectPr()
{

}

SectPr.prototype =
{
    Set_PageSize : function(Width, Height)
    {
        if ( "undefined" == typeof(this.PgSz) )
            this.PgSz = new Object();

        this.PgSz.W = Width;
        this.PgSz.H = Height;
    },

    Set_PageMargins : function(PgMar)
    {
        if ( "undefined" == typeof(this.PgMar) )
            this.PgMar = new Object();

        for ( var Type in PgMar )
        {
            this.PgMar[Type] = PgMar[Type];
        }
    }
}