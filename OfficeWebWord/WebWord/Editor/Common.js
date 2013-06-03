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
        Dst = new Object();

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
                        Dst[p] = new Array();
                    else
                        Dst[p] = new Object();
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
function Common_CmpObj2(Obj1, Obj2)
{
    if(!Obj1 || !Obj2 || typeof(Obj1) != typeof(Obj2))
        return false;
    var p, v1, v2;
    //проверяем чтобы Obj1 имел теже свойства что и Obj2
    for(p in Obj2)
    {
        if(!Obj1.hasOwnProperty(p))
            return false;
    }
    //проверяем чтобы Obj2 имел теже свойства что и Obj1 и сравниваем их
    for(p in Obj1)
    {
        if(Obj2.hasOwnProperty(p))
        {
            v1 = Obj1[p];
            v2 = Obj2[p];
            if(v1 && v2 && 'object' === typeof(v1) && 'object' === typeof(v2) )
            {
                if( false == Common_CmpObj2(v1, v2))
                    return false;
            }
            else
            {
                if(v1 != v2)
                    return false;
            }
        }
        else
            return false;
    }
    return true;
};