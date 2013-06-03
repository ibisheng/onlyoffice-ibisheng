function clone(obj) {

    if(obj == null || typeof(obj) != 'object')
    {
        return obj;
    }

    if(obj.constructor == Array) {

        var clonedArray = [];
        for(var i= 0, length = obj.length; i < length; ++i) {

            clonedArray[i] = clone(obj[i]);
        }
        return clonedArray;
    }

    var clonedObject = {};
	
	var copyFunc = function(obj){return obj;}
	var nullFunc = function(obj){return null;}
	var undefinedFunc = function(obj ){return undefined;}

	var FuncMap = { 
				Parent: copyFunc,
				DrawingDocument: copyFunc,
				Document: copyFunc,
				Container: copyFunc,
				parent: copyFunc, 
				slide: copyFunc,
				slideLayout: copyFunc,
				LogicDocument: copyFunc,
				table: nullFunc,
				txBody: undefinedFunc,
                graphicObject: nullFunc
			};	
    for(var key in obj) 
	{
		if(undefined !== FuncMap[key])
		{
			clonedObject[key] = FuncMap[key](obj[key]);
		}
		else
		{
			clonedObject[key] = clone(obj[key]);
		}
        if(clonedObject.IsGroup && clonedObject.IsGroup())
        {
            for(i = 0; i < clonedObject.ArrGlyph.length; ++i)
            {
                clonedObject.ArrGlyph[i].Container = clonedObject;
            }
        }
	}

    return clonedObject;
}

function cloneDC(obj) {

    if(obj == null || typeof(obj) != 'object') {

        return obj;
    }

    if(obj.constructor == Array) {

        var t=[];
        for(var i=0; i < obj.length; ++i) {

            t[i]=clone(obj[i]);
        }
        return t;
    }

    var temp = {};
	
	var copyFunc = function(obj){return obj;}

	var FuncMap = { 
				Parent: copyFunc,
				DrawingDocument: copyFunc,
				Document: copyFunc,
				DocumentContent: copyFunc,
				Container: copyFunc
			};	
    for( var key in obj ) {

        if(undefined !== FuncMap[key])
		{ 
            temp[key]=FuncMap[key](obj[key]);
        }
        else 
		{
            temp[key] = clone(obj[key]);
        }
    }

    return temp;
}

function clonePrototype(obj) {

    if(obj == null || typeof(obj) != 'object') {

        return obj;
    }

    if(obj.constructor == Array) {

        var clonedArray=[];
        for(var i=0; i < obj.length; ++i) {

            clonedArray[i] = clone(obj[i]);
        }
        return clonedArray;
    }

    var clonedObj = {};
    for( var key in obj ) {

        clonedObj[key] = clone(obj[key]);
    }
    return clonedObj;
}

