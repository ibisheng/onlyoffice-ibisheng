"use strict";

// Функция копирует объект или массив. (Обычное равенство в javascript приравнивает указатели)
function Common_CopyObj(Obj)
{
    if( !Obj || !('object' == typeof(Obj) || 'array' == typeof(Obj)) )
    {
        return Obj;
    }

    var c = 'function' === typeof Obj.pop ? [] : {};
    var p, v;
    for(p in Obj)
    {
        if(Obj.hasOwnProperty(p))
        {
            v = Obj[p];
            if(v && 'object' === typeof v )
            {
                c[p] = Common_CopyObj(v);
            }
            else
            {
                c[p] = v;
            }
        }
    }
    return c;
};

function Common_CopyObj2(Dst, Obj)
{
    if( !Obj || !('object' == typeof(Obj) || 'array' == typeof(Obj)) )
    {
        return;
    }

    if (Dst == null)
        Dst = {};

    var p, v;
    for(p in Obj)
    {
        if(Obj.hasOwnProperty(p))
        {
            v = Obj[p];
            if(v && 'object' === typeof v )
            {
                if ( "object" != typeof(Dst[p]) )
                {
                    if ( "undefined" != typeof(v.splice) )
                        Dst[p] = [];
                    else
                        Dst[p] = {};
                }
                Common_CopyObj2(Dst[p], v);
            }
            else
            {
                Dst[p] = v;
            }
        }
    }
}