function CPointer()
{
    this.obj    = null;
    this.data   = null;
    this.pos    = 0;
}
function dublicate_pointer(p)
{
    if (null == p)
        return null;

    var d = new CPointer();
    d.data = p.data;
    d.pos = p.pos;
    return d;
}
function copy_pointer(p, size)
{
    var _p = g_memory.Alloc(size);
    for (var i = 0; i < size; i++)
        _p.data[i] = p.data[p.pos + i];
    return _p;
}

function FT_Memory()
{
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1;
    this.canvas.height = 1;
    this.ctx    = this.canvas.getContext('2d');

    this.Alloc = function(size)
    {
        var p = new CPointer();
        p.obj = this.ctx.createImageData(1,parseInt((size + 3) / 4));
        p.data = p.obj.data;
        p.pos = 0;
        return p;
    }
    this.AllocHeap = function()
    {
        // TODO: 
    }
    this.CreateStream = function(size)
    {
        console.log("not impl");
    }
}
var g_memory = new FT_Memory();

window["ftm"] = FT_Memory;
