function clone(obj)
{
    if(obj == null || typeof(obj) != 'object')
        return obj;
    if(obj.constructor == Array)
    {
        var t=[];
        for(var i=0;i< obj.length;i++)
            t[i]=clone(obj[i]);
        return t;
    }
    var temp = {};
    for(var key in obj)
        if(key=="Parent"||key=="DrawingDocument"||key=="Document" || key=="Container")//чтобы избежать бесконечной рекурсии копируем просто ссылки
            temp[key]=obj[key];
        else if(key!="DocumentContent")
            temp[key] = clone(obj[key]);
    return temp;
}

function cloneDC(obj)
{
    if(obj == null || typeof(obj) != 'object')
        return obj;
    if(obj.constructor == Array)
    {
        var t=[];
        for(var i=0;i< obj.length;i++)
            t[i]=clone(obj[i]);
        return t;
    }
    var temp = {};
    for(var key in obj)
        if(key=="Parent"||key=="DrawingDocument"||key=="Document"||key=="DocumentContent" || key=="Container")//чтобы избежать бесконечной рекурсии копируем просто ссылки
            temp[key]=obj[key];
        else
            temp[key] = clone(obj[key]);
    return temp;
}