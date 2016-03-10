var TT_Round_Off             = 5;
var TT_Round_To_Half_Grid    = 0;
var TT_Round_To_Grid         = 1;
var TT_Round_To_Double_Grid  = 2;
var TT_Round_Up_To_Grid      = 4;
var TT_Round_Down_To_Grid    = 3;
var TT_Round_Super           = 6;
var TT_Round_Super_45        = 7;

function LibraryHintingParams()
{
    this.TT_USE_BYTECODE_INTERPRETER            = false;
    this.TT_CONFIG_OPTION_SUBPIXEL_HINTING      = false;
    this.TT_CONFIG_OPTION_UNPATENTED_HINTING    = false;

    this.TT_HINTER_FLAG = (this.TT_USE_BYTECODE_INTERPRETER) ? FT_Common.FT_MODULE_DRIVER_HAS_HINTER : 0;
    this.TT_CONFIG_OPTION_INTERPRETER_SWITCH    = false;
}

function TT_CallRec()
{
    this.Caller_Range   = 0;
    this.Caller_IP      = 0;
    this.Cur_Count      = 0;

    this.Def            = null;
}

function SPH_TweakRule()
{
    this.family = "";
    this.ppem = 0;
    this.style = "";
    this.glyph = 0;
}

function SPH_ScaleRule()
{
    this.family = "";
    this.ppem = 0;
    this.style = "";
    this.glyph = 0;
    this.scale = 0;
}

var MAX_NAME_SIZE       = 32;
var MAX_CLASS_MEMBERS   = 100;

function Font_Class()
{
    this.name = "";
    this.member = null;
}
function create_font_class(name, arr)
{
    var fc = new Font_Class();
    fc.name = name;
    fc.member = arr;
    return fc;
}

function FT_UnitVector()
{
    this.x = 0;
    this.y = 0;
}

function TT_GraphicsState()
{
    this.rp0 = 0;
    this.rp1 = 0;
    this.rp2 = 0;

    this.dualVector = new FT_UnitVector();
    this.projVector = new FT_UnitVector();
    this.freeVector = new FT_UnitVector();

    // #ifdef TT_CONFIG_OPTION_UNPATENTED_HINTING
    this.both_x_axis = false;
    // #endif

    this.loop = 0;
    this.minimum_distance = 0;
    this.round_state = 0;

    this.auto_flip = false;
    this.control_value_cutin = 0;
    this.single_width_cutin = 0;
    this.single_width_value = 0;
    this.delta_base = 0;
    this.delta_shift = 0;

    this.instruct_control = 0;
    /* According to Greg Hitchcock from Microsoft, the `scan_control'     */
    /* variable as documented in the TrueType specification is a 32-bit   */
    /* integer; the high-word part holds the SCANTYPE value, the low-word */
    /* part the SCANCTRL value.  We separate it into two fields.          */
    this.scan_control = false;
    this.scan_type = 0;

    this.gep0 = 0;
    this.gep1 = 0;
    this.gep2 = 0;
}
TT_GraphicsState.prototype =
{
    default_tt : function()
    {
        this.rp0 = 0;
        this.rp1 = 0;
        this.rp2 = 0;

        this.dualVector.x = 0x4000; this.dualVector.y = 0;
        this.projVector.x = 0x4000; this.projVector.y = 0;
        this.freeVector.x = 0x4000; this.freeVector.y = 0;

        this.both_x_axis = true;

        this.loop = 1;
        this.minimum_distance = 64;
        this.round_state = 1;

        this.auto_flip = true;
        this.control_value_cutin = 68;
        this.single_width_cutin = 0;
        this.single_width_value = 0;
        this.delta_base = 9;
        this.delta_shift = 3;

        this.instruct_control = 0;
        /* According to Greg Hitchcock from Microsoft, the `scan_control'     */
        /* variable as documented in the TrueType specification is a 32-bit   */
        /* integer; the high-word part holds the SCANTYPE value, the low-word */
        /* part the SCANCTRL value.  We separate it into two fields.          */
        this.scan_control = false;
        this.scan_type = 0;

        this.gep0 = 1;
        this.gep1 = 1;
        this.gep2 = 1;
    },

    Copy : function(dst)
    {
        dst.rp0 = this.rp0;
        dst.rp1 = this.rp1;
        dst.rp2 = this.rp2;

        dst.dualVector.x = this.dualVector.x; dst.dualVector.y = this.dualVector.y;
        dst.projVector.x = this.projVector.x; dst.projVector.y = this.projVector.y;
        dst.freeVector.x = this.freeVector.x; dst.freeVector.y = this.freeVector.y;

        dst.both_x_axis = this.both_x_axis;

        dst.loop = this.loop;
        dst.minimum_distance = this.minimum_distance;
        dst.round_state = this.round_state;

        dst.auto_flip = this.auto_flip;
        dst.control_value_cutin = this.control_value_cutin;
        dst.single_width_cutin = this.single_width_cutin;
        dst.single_width_value = this.single_width_value;
        dst.delta_base = this.delta_base;
        dst.delta_shift = this.delta_shift;

        dst.instruct_control = this.instruct_control;
        /* According to Greg Hitchcock from Microsoft, the `scan_control'     */
        /* variable as documented in the TrueType specification is a 32-bit   */
        /* integer; the high-word part holds the SCANTYPE value, the low-word */
        /* part the SCANCTRL value.  We separate it into two fields.          */
        dst.scan_control = this.scan_control;
        dst.scan_type = this.scan_type;

        dst.gep0 = this.gep0;
        dst.gep1 = this.gep1;
        dst.gep2 = this.gep2;
    }
}

function TT_DefRecord()
{
    this.range = 0;             /* in which code range is it located?     */
    this.start = 0;             /* where does it start?                   */
    this.end   = 0;             /* where does it end?                     */
    this.opc   = 0;             /* function #, or instruction code        */
    this.active = false;        /* is it active?                          */
    this.inline_delta = false;  /* is function that defines inline delta? */
    this.sph_fdef_flags = 0;
}

function TT_CodeRange()
{
    this.base = null;
    this.size = 0;
}
function coderange_copy(d, s)
{
    d.base = dublicate_pointer(s.base);
    d.size = s.size;
}

function TT_ExecContextRec()
{
    this.face   = null;
    this.size   = null;
    this.memory = null;

    /* instructions state */
    this.error  = 0;      /* last execution error */
    this.top    = 0;        /* top of exec. stack   */

    this.stackSize  = 0;  /* size of exec. stack  */
    this.stack      = null;      /* current exec. stack  */

    this.args       = 0;
    this.new_top    = 0;    /* new top after exec.  */

    this.zp0 = new TT_GlyphZoneRec();
    this.zp1 = new TT_GlyphZoneRec();
    this.zp2 = new TT_GlyphZoneRec();
    this.pts = new TT_GlyphZoneRec();
    this.twilight = new TT_GlyphZoneRec();

    this.metrics = new FT_Size_Metrics();
    this.tt_metrics = new TT_Size_Metrics(); /* size metrics */

    this.GS = new TT_GraphicsState();         /* current graphics state */

    this.curRange = 0;  /* current code range number   */
    this.code = null;   /* current code range          */
    this.IP = 0;        /* current instruction pointer */
    this.codeSize = 0;  /* size of current range       */

    this.opcode = 0;    /* current opcode              */
    this.length = 0;    /* length of current opcode    */

    this.step_ins = false;  /* true if the interpreter must */
                            /* increment IP after ins. exec */
    this.cvtSize = 0;
    this.cvt = null;

    this.glyphSize = 0; /* glyph instructions buffer size */
    this.glyphIns = null;  /* glyph instructions buffer */

    this.numFDefs = 0;  /* number of function defs         */
    this.maxFDefs = 0;  /* maximum number of function defs */
    this.FDefs = null;     /* table of FDefs entries          */

    this.numIDefs = 0;  /* number of instruction defs */
    this.maxIDefs = 0;  /* maximum number of ins defs */
    this.IDefs = null;     /* table of IDefs entries     */

    this.maxFunc = 0;   /* maximum function index     */
    this.maxIns = 0;    /* maximum instruction index  */

    this.callTop = 0;    /* top of call stack during execution */
    this.callSize = 0;   /* size of call stack */
    this.callStack = null;  /* call stack */

    this.maxPoints = 0;    /* capacity of this context's `pts' */
    this.maxContours = 0;  /* record, expressed in points and  */
                                     /* contours.                        */

    /* table of valid code ranges */
    /* useful for the debugger   */
    this.codeRangeTable = new Array(FT_Common.TT_MAX_CODE_RANGES);
    for (var i = 0; i < FT_Common.TT_MAX_CODE_RANGES; i++)
        this.codeRangeTable[i] = new TT_CodeRange();
    
    this.storeSize = 0;  /* size of current storage */
    this.storage = null;    /* storage area            */

    this.period = 0;     /* values used for the */
    this.phase = 0;      /* `SuperRounding'     */
    this.threshold = 0;

    //#if 0
    /* this seems to be unused */
    //FT_Int             cur_ppem;   /* ppem along the current proj vector */
    //#endif

    this.instruction_trap = false; /* If `True', the interpreter will */
                                         /* exit after each instruction     */

    this.default_GS = new TT_GraphicsState();       /* graphics state resulting from   */
                                                    /* the prep program                */
    this.is_composite = false;     /* true if the glyph is composite  */
    this.pedantic_hinting = false; /* true if pedantic interpretation */

    /* latest interpreter additions */
    this.F_dot_P = 0;           /* dot product of freedom and projection */
                                /* vectors                               */
    this.func_round = null;     /* current rounding function             */

    this.func_project = null;   /* current projection function */
    this.func_dualproj = null;  /* current dual proj. function */
    this.func_freeProj = null;  /* current freedom proj. func  */

    this.func_move = null;      /* current point move function */
    this.func_move_orig = null; /* move original position function */

    this.func_read_cvt = null;  /* read a cvt entry              */
    this.func_write_cvt = null; /* write a cvt entry (in pixels) */
    this.func_move_cvt = null;  /* incr a cvt entry (in pixels)  */

    this.grayscale = false;      /* are we hinting for grayscale? */

    // #ifdef TT_CONFIG_OPTION_SUBPIXEL_HINTING
    this.func_round_sphn = null;          /* subpixel rounding function */

    this.grayscale_hinting = false;       /* Using grayscale hinting?      */
    this.subpixel_hinting = false;        /* Using subpixel hinting?       */
    this.native_hinting = false;          /* Using native hinting?         */
    this.ignore_x_mode  = false;          /* Standard rendering mode for   */
                                          /* subpixel hinting.  On if gray */
                                          /* or subpixel hinting is on )   */
    this.compatibility_mode = false;      /* Additional exceptions to      */
                                          /* native TT rules for legacy    */
                                          /* fonts.  Implies               */
                                          /* ignore_x_mode.                */

    /* The following 4 aren't fully implemented but here for MS rasterizer */
    /* compatibility.                                                      */
    this.compatible_widths = false;     /* compatible widths?        */
    this.symmetrical_smoothing = false; /* symmetrical_smoothing?    */
    this.bgr = false;                   /* bgr instead of rgb?       */
    this.subpixel_positioned = false;   /* subpixel positioned       */
                                              /* (DirectWrite ClearType)?  */

    this.rasterizer_version = 0;    /* MS rasterizer version */

    this.iup_called = false;            /* IUP called for glyph?  */

    this.sph_tweak_flags = 0;       /* flags to control */
                                    /* hint tweaks      */

    this.sph_in_func_flags = 0;     /* flags to indicate if in   */
                                    /* special functions         */

    // #endif /* TT_CONFIG_OPTION_SUBPIXEL_HINTING */
}

function Init_Context(exec, memory)
{
    exec.memory   = memory;
    exec.callSize = 32;

    exec.callStack = new Array(exec.callSize);
    for (var i = 0; i < exec.callSize; i++)
        exec.callStack[i] = new TT_CallRec();

    /* all values in the context are set to 0 already, but this is */
    /* here as a remainder                                         */
    exec.maxPoints   = 0;
    exec.maxContours = 0;

    exec.stackSize = 0;
    exec.glyphSize = 0;

    exec.stack     = null;
    exec.glyphIns  = null;

    exec.face = null;
    exec.size = null;

    return 0;
}

function TT_New_Context(driver)
{
    if (driver.context == null)
    {
        driver.context = new TT_ExecContextRec();

        /* initialize it; in case of error this deallocates `exec' too */
        var error = Init_Context(driver.context, driver.memory);
        if (error != 0)
            driver.context = null;
    }
    return driver.context;
}

function TT_Done_Context(exec)
{
    /* points zone */
    exec.maxPoints   = 0;
    exec.maxContours = 0;

    /* free stack */
    exec.stack      = null;
    exec.stackSize  = 0;

    /* free call stack */
    exec.callStack  = null;
    exec.callSize   = 0;
    exec.callTop    = 0;

    /* free glyph code range */
    exec.glyphIns   = null;
    exec.glyphSize  = 0;

    exec.size       = null;
    exec.face       = null;

    return 0;
}

function TT_Load_Context(exec, face, size)
{
    exec.face = face;
    var maxp = face.max_profile;
    exec.size = size;

    if (size != null)
    {
        exec.numFDefs   = size.num_function_defs;
        exec.maxFDefs   = size.max_function_defs;
        exec.numIDefs   = size.num_instruction_defs;
        exec.maxIDefs   = size.max_instruction_defs;
        exec.FDefs      = size.function_defs;
        exec.IDefs      = size.instruction_defs;
        exec.tt_metrics.Copy(size.ttmetrics);
        exec.metrics.Copy(size.metrics);

        exec.maxFunc    = size.max_func;
        exec.maxIns     = size.max_ins;

        for (var i = 0; i < FT_Common.TT_MAX_CODE_RANGES; i++)
            coderange_copy(exec.codeRangeTable[i], size.codeRangeTable[i]);

        /* set graphics state */
        size.GS.Copy(exec.GS);

        exec.cvtSize = size.cvt_size;
        exec.cvt     = size.cvt;

        exec.storeSize = size.storage_size;
        exec.storage   = size.storage;

        exec.twilight.Copy(size.twilight);

        /* In case of multi-threading it can happen that the old size object */
        /* no longer exists, thus we must clear all glyph zone references.   */
        exec.zp0.Clear();
        exec.zp1.Clear();
        exec.zp2.Clear();
    }

    /* XXX: We reserve a little more elements on the stack to deal safely */
    /*      with broken fonts like arialbs, courbs, timesbs, etc.         */
    var ret = Update_MaxLONG(exec.memory, exec.stackSize, exec.stack, maxp.maxStackElements + 32);
    if (null != ret)
    {
        exec.stackSize = ret.size;
        exec.stack = ret.block;

        if (ret.err != 0)
            return ret.err;
    }
    
    ret = Update_MaxBYTE(exec.memory, exec.glyphSize, exec.glyphIns, maxp.maxSizeOfInstructions);
    if (ret != null)
    {
        exec.glyphSize = ret.size;
        exec.glyphIns = ret.block;

        if (ret.err != 0)
            return ret.err;
    }

    exec.pts.n_points   = 0;
    exec.pts.n_contours = 0;

    exec.zp1.Copy(exec.pts);
    exec.zp2.Copy(exec.pts);
    exec.zp0.Copy(exec.pts);

    exec.instruction_trap = false;

    return 0;
}

function Update_MaxBYTE(memory, size, buff, new_max)
{
    if (size >= new_max)
        return null;

    return FT_Common.realloc(memory, buff, size, new_max);
}
function Update_MaxLONG(memory, size, buff, new_max)
{
    if (size >= new_max)
        return null;

    return FT_Common.realloc_long(memory, buff, size, new_max);
}

function tt_size_ready_bytecode(size, pedantic)
{
    var error = 0;
    if (!size.bytecode_ready)
    {
        error = tt_size_init_bytecode(size, pedantic);
        if (error != 0)
            return error;
    }

    /* rescale CVT when needed */
    if (!size.cvt_ready)
    {
        var face = size.face;

        /* Scale the cvt values to the new ppem.          */
        /* We use by default the y ppem to scale the CVT. */
        for (var i = 0; i < size.cvt_size; i++)
            size.cvt[i] = FT_MulFix(face.cvt[i], size.ttmetrics.scale);

        /* all twilight points are originally zero */
        for (var i = 0; i < size.twilight.n_points; i++ )
        {
            size.twilight.org[size.twilight._offset_org + i].x = 0;
            size.twilight.org[size.twilight._offset_org + i].y = 0;
            size.twilight.cur[size.twilight._offset_cur + i].x = 0;
            size.twilight.cur[size.twilight._offset_cur + i].y = 0;
        }

        /* clear storage area */
        for (var i = 0; i < size.storage_size; i++)
            size.storage[i] = 0;

        size.GS.default_tt();

        error = tt_size_run_prep(size, pedantic);
        if (error != 0)
            size.cvt_ready = 1;
    }
    return error;
}

function tt_size_init_bytecode(size, pedantic)
{
    var maxp = size.face.max_profile;

    size.bytecode_ready = 1;
    size.cvt_ready      = 0;

    size.max_function_defs    = maxp.maxFunctionDefs;
    size.max_instruction_defs = maxp.maxInstructionDefs;

    size.num_function_defs    = 0;
    size.num_instruction_defs = 0;

    size.max_func = 0;
    size.max_ins  = 0;

    size.cvt_size     = size.face.cvt_size;
    size.storage_size = maxp.maxStorage;

    /* Set default metrics */
    var metrics = size.ttmetrics;
    metrics.rotated   = false;
    metrics.stretched = false;

      /* set default compensation (all 0) */
    for (var i = 0; i < 4; i++)
        metrics.compensations[i] = 0;

    /* allocate function defs, instruction defs, cvt, and storage area */
    size.function_defs = new Array(size.max_function_defs);
    for (var i = 0; i < size.max_function_defs; i++)
        size.function_defs[i] = new TT_DefRecord();

    size.instruction_defs = new Array(size.max_instruction_defs);
    for (var i = 0; i < size.max_instruction_defs; i++)
        size.instruction_defs[i] = new TT_DefRecord();

    size.cvt = new CreateIntArray(size.cvt_size);
    size.storage = new CreateIntArray(size.storage_size);

    /* reserve twilight zone */
    var n_twilight = maxp.maxTwilightPoints;

    /* there are 4 phantom points (do we need this?) */
    n_twilight += 4;

    var error = tt_glyphzone_new(size.face.memory, n_twilight, 0, size.twilight);
    if (error != 0)
    {
        tt_size_done_bytecode(size);
        return error;
    }

    size.twilight.n_points = n_twilight;

    size.GS.default_tt();
    size.face.interpreter = TT_RunIns;

    /* Fine, now run the font program! */
    error = tt_size_run_fpgm(size, pedantic);
    if (error != 0)
        tt_size_done_bytecode(size);

    return error;
}

function tt_size_run_fpgm(size, pedantic)
{
    var face = size.face;
    var exec = null;

    /* debugging instances have their own context */
    if (size.debug)
        exec = size.context;
    else
        exec = face.driver.context;

    if (exec == null)
        return FT_Common.FT_Err_Could_Not_Find_Context;

    TT_Load_Context(exec, face, size);

    exec.callTop = 0;
    exec.top     = 0;

    exec.period    = 64;
    exec.phase     = 0;
    exec.threshold = 0;

    exec.instruction_trap = false;
    exec.F_dot_P          = 0x4000;

    exec.pedantic_hinting = pedantic;

    var metrics = exec.metrics;
    var tt_metrics = exec.tt_metrics;

    metrics.x_ppem   = 0;
    metrics.y_ppem   = 0;
    metrics.x_scale  = 0;
    metrics.y_scale  = 0;

    tt_metrics.ppem  = 0;
    tt_metrics.scale = 0;
    tt_metrics.ratio = 0x10000;

    /* allow font program execution */
    TT_Set_CodeRange(exec, FT_Common.tt_coderange_font, face.font_program, face.font_program_size);

    /* disable CVT and glyph programs coderange */
    TT_Clear_CodeRange(exec, FT_Common.tt_coderange_cvt);
    TT_Clear_CodeRange(exec, FT_Common.tt_coderange_glyph);

    var error = 0;
    if (face.font_program_size > 0)
    {
        error = TT_Goto_CodeRange(exec, FT_Common.tt_coderange_font, 0);
        if (error == 0)
            error = face.interpreter(exec);
    }
    else
        error = 0;

    if (error == 0)
        TT_Save_Context(exec, size);

    return error;
}

function TT_Clear_CodeRange(exec, range)
{
    exec.codeRangeTable[range - 1].base = null;
    exec.codeRangeTable[range - 1].size = 0;

    return 0;
}

function TT_Save_Context(exec, size)
{
    /* XXX: Will probably disappear soon with all the code range */
    /*      management, which is now rather obsolete.            */
    /*                                                           */
    size.num_function_defs    = exec.numFDefs;
    size.num_instruction_defs = exec.numIDefs;

    size.max_func = exec.maxFunc;
    size.max_ins  = exec.maxIns;

    for (var i = 0; i < FT_Common.TT_MAX_CODE_RANGES; i++)
    {
        size.codeRangeTable[i].base = dublicate_pointer(exec.codeRangeTable[i].base);
        size.codeRangeTable[i].size = exec.codeRangeTable[i].size;
    }

    return 0;
}

function tt_size_done_bytecode(size)
{
    if (size.debug)
    {
        /* the debug context must be deleted by the debugger itself */
        size.context = null;
        size.debug   = false;
    }

    size.cvt = null;
    size.cvt_size = 0;

    /* free storage area */
    size.storage = null;
    size.storage_size = 0;

    /* twilight zone */
    tt_glyphzone_done(size.twilight);

    size.function_defs = null;
    size.instruction_defs = null;

    size.num_function_defs    = 0;
    size.max_function_defs    = 0;
    size.num_instruction_defs = 0;
    size.max_instruction_defs = 0;

    size.max_func = 0;
    size.max_ins  = 0;

    size.bytecode_ready = false;
    size.cvt_ready      = false;
}

function tt_glyphzone_done(zone)
{
    if (zone.memory != null)
    {
        zone.contours = null;
        zone.tags = null;
        zone.cur = null;
        zone.org = null;
        zone.orus = null;

        zone.max_points = zone.n_points   = 0;
        zone.max_contours = zone.n_contours = 0;
        zone.memory = null;
    }
}

function tt_glyphzone_new(memory, maxPoints, maxContours, zone)
{
    zone.Clear();
    zone.memory = memory;

    zone.org = new Array(maxPoints);
    FT_CreateVectorArray(zone.org, 0, maxPoints);

    zone.cur = new Array(maxPoints);
    FT_CreateVectorArray(zone.cur, 0, maxPoints);

    zone.orus = new Array(maxPoints);
    FT_CreateVectorArray(zone.orus, 0, maxPoints);

    zone.tags = CreateIntArray(maxPoints);
    zone.contours = CreateIntArray(maxContours);

    zone.max_points   = maxPoints;
    zone.max_contours = maxContours;
    return 0;
}

function TT_Set_CodeRange(exec, range, base, length)
{
    exec.codeRangeTable[range - 1].base = dublicate_pointer(base);
    exec.codeRangeTable[range - 1].size = length;

    return 0;
}

function TT_Goto_CodeRange(exec, range, IP)
{
    var coderange = exec.codeRangeTable[range - 1];

    /* NOTE: Because the last instruction of a program may be a CALL */
    /*       which will return to the first byte *after* the code    */
    /*       range, we test for IP <= Size instead of IP < Size.     */
    /*                                                               */
    exec.code     = dublicate_pointer(coderange.base);
    exec.codeSize = coderange.size;
    exec.IP       = IP;
    exec.curRange = range;

    return 0;
}

function TT_Run_Context(exec, debug)
{
    var error = TT_Goto_CodeRange(exec, FT_Common.tt_coderange_glyph, 0);
    if (error != 0)
        return error;

    exec.zp0.Copy(exec.pts);
    exec.zp1.Copy(exec.pts);
    exec.zp2.Copy(exec.pts);

    exec.GS.gep0 = 1;
    exec.GS.gep1 = 1;
    exec.GS.gep2 = 1;

    exec.GS.projVector.x = 0x4000;
    exec.GS.projVector.y = 0x0000;

    exec.GS.freeVector.x = exec.GS.projVector.x;
    exec.GS.freeVector.y = exec.GS.projVector.y;
    exec.GS.dualVector.x = exec.GS.projVector.x;
    exec.GS.dualVector.y = exec.GS.projVector.y;

    if (exec.face.driver.library.tt_hint_props.TT_CONFIG_OPTION_UNPATENTED_HINTING)//#ifdef TT_CONFIG_OPTION_UNPATENTED_HINTING
    {
        exec.GS.both_x_axis = true;
    }//#endif

    exec.GS.round_state = 1;
    exec.GS.loop        = 1;

    /* some glyphs leave something on the stack. so we clean it */
    /* before a new execution.                                  */
    exec.top     = 0;
    exec.callTop = 0;

    return exec.face.interpreter(exec);
}

//--------------------------------------------------------------//

var opcode_length =
[1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,
1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,
1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,
1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,

-1,-2, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,
1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,
1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,
1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,

1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,
1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,
1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,
2, 3, 4, 5,  6, 7, 8, 9,  3, 5, 7, 9, 11,13,15,17,

1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,
1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,
1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,
1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1,  1, 1, 1, 1];

function Pop_Push_PACK(x, y)
{
    return ((x << 4) | y);
}
var Pop_Push_Count =
[
    /* opcodes are gathered in groups of 16 */
    /* please keep the spaces as they are   */

    /*  SVTCA  y  */  Pop_Push_PACK( 0, 0 ),
    /*  SVTCA  x  */  Pop_Push_PACK( 0, 0 ),
    /*  SPvTCA y  */  Pop_Push_PACK( 0, 0 ),
    /*  SPvTCA x  */  Pop_Push_PACK( 0, 0 ),
    /*  SFvTCA y  */  Pop_Push_PACK( 0, 0 ),
    /*  SFvTCA x  */  Pop_Push_PACK( 0, 0 ),
    /*  SPvTL //  */  Pop_Push_PACK( 2, 0 ),
    /*  SPvTL +   */  Pop_Push_PACK( 2, 0 ),
    /*  SFvTL //  */  Pop_Push_PACK( 2, 0 ),
    /*  SFvTL +   */  Pop_Push_PACK( 2, 0 ),
    /*  SPvFS     */  Pop_Push_PACK( 2, 0 ),
    /*  SFvFS     */  Pop_Push_PACK( 2, 0 ),
    /*  GPV       */  Pop_Push_PACK( 0, 2 ),
    /*  GFV       */  Pop_Push_PACK( 0, 2 ),
    /*  SFvTPv    */  Pop_Push_PACK( 0, 0 ),
    /*  ISECT     */  Pop_Push_PACK( 5, 0 ),

    /*  SRP0      */  Pop_Push_PACK( 1, 0 ),
    /*  SRP1      */  Pop_Push_PACK( 1, 0 ),
    /*  SRP2      */  Pop_Push_PACK( 1, 0 ),
    /*  SZP0      */  Pop_Push_PACK( 1, 0 ),
    /*  SZP1      */  Pop_Push_PACK( 1, 0 ),
    /*  SZP2      */  Pop_Push_PACK( 1, 0 ),
    /*  SZPS      */  Pop_Push_PACK( 1, 0 ),
    /*  SLOOP     */  Pop_Push_PACK( 1, 0 ),
    /*  RTG       */  Pop_Push_PACK( 0, 0 ),
    /*  RTHG      */  Pop_Push_PACK( 0, 0 ),
    /*  SMD       */  Pop_Push_PACK( 1, 0 ),
    /*  ELSE      */  Pop_Push_PACK( 0, 0 ),
    /*  JMPR      */  Pop_Push_PACK( 1, 0 ),
    /*  SCvTCi    */  Pop_Push_PACK( 1, 0 ),
    /*  SSwCi     */  Pop_Push_PACK( 1, 0 ),
    /*  SSW       */  Pop_Push_PACK( 1, 0 ),

    /*  DUP       */  Pop_Push_PACK( 1, 2 ),
    /*  POP       */  Pop_Push_PACK( 1, 0 ),
    /*  CLEAR     */  Pop_Push_PACK( 0, 0 ),
    /*  SWAP      */  Pop_Push_PACK( 2, 2 ),
    /*  DEPTH     */  Pop_Push_PACK( 0, 1 ),
    /*  CINDEX    */  Pop_Push_PACK( 1, 1 ),
    /*  MINDEX    */  Pop_Push_PACK( 1, 0 ),
    /*  AlignPTS  */  Pop_Push_PACK( 2, 0 ),
    /*  INS_$28   */  Pop_Push_PACK( 0, 0 ),
    /*  UTP       */  Pop_Push_PACK( 1, 0 ),
    /*  LOOPCALL  */  Pop_Push_PACK( 2, 0 ),
    /*  CALL      */  Pop_Push_PACK( 1, 0 ),
    /*  FDEF      */  Pop_Push_PACK( 1, 0 ),
    /*  ENDF      */  Pop_Push_PACK( 0, 0 ),
    /*  MDAP[0]   */  Pop_Push_PACK( 1, 0 ),
    /*  MDAP[1]   */  Pop_Push_PACK( 1, 0 ),

    /*  IUP[0]    */  Pop_Push_PACK( 0, 0 ),
    /*  IUP[1]    */  Pop_Push_PACK( 0, 0 ),
    /*  SHP[0]    */  Pop_Push_PACK( 0, 0 ),
    /*  SHP[1]    */  Pop_Push_PACK( 0, 0 ),
    /*  SHC[0]    */  Pop_Push_PACK( 1, 0 ),
    /*  SHC[1]    */  Pop_Push_PACK( 1, 0 ),
    /*  SHZ[0]    */  Pop_Push_PACK( 1, 0 ),
    /*  SHZ[1]    */  Pop_Push_PACK( 1, 0 ),
    /*  SHPIX     */  Pop_Push_PACK( 1, 0 ),
    /*  IP        */  Pop_Push_PACK( 0, 0 ),
    /*  MSIRP[0]  */  Pop_Push_PACK( 2, 0 ),
    /*  MSIRP[1]  */  Pop_Push_PACK( 2, 0 ),
    /*  AlignRP   */  Pop_Push_PACK( 0, 0 ),
    /*  RTDG      */  Pop_Push_PACK( 0, 0 ),
    /*  MIAP[0]   */  Pop_Push_PACK( 2, 0 ),
    /*  MIAP[1]   */  Pop_Push_PACK( 2, 0 ),

    /*  NPushB    */  Pop_Push_PACK( 0, 0 ),
    /*  NPushW    */  Pop_Push_PACK( 0, 0 ),
    /*  WS        */  Pop_Push_PACK( 2, 0 ),
    /*  RS        */  Pop_Push_PACK( 1, 1 ),
    /*  WCvtP     */  Pop_Push_PACK( 2, 0 ),
    /*  RCvt      */  Pop_Push_PACK( 1, 1 ),
    /*  GC[0]     */  Pop_Push_PACK( 1, 1 ),
    /*  GC[1]     */  Pop_Push_PACK( 1, 1 ),
    /*  SCFS      */  Pop_Push_PACK( 2, 0 ),
    /*  MD[0]     */  Pop_Push_PACK( 2, 1 ),
    /*  MD[1]     */  Pop_Push_PACK( 2, 1 ),
    /*  MPPEM     */  Pop_Push_PACK( 0, 1 ),
    /*  MPS       */  Pop_Push_PACK( 0, 1 ),
    /*  FlipON    */  Pop_Push_PACK( 0, 0 ),
    /*  FlipOFF   */  Pop_Push_PACK( 0, 0 ),
    /*  DEBUG     */  Pop_Push_PACK( 1, 0 ),

    /*  LT        */  Pop_Push_PACK( 2, 1 ),
    /*  LTEQ      */  Pop_Push_PACK( 2, 1 ),
    /*  GT        */  Pop_Push_PACK( 2, 1 ),
    /*  GTEQ      */  Pop_Push_PACK( 2, 1 ),
    /*  EQ        */  Pop_Push_PACK( 2, 1 ),
    /*  NEQ       */  Pop_Push_PACK( 2, 1 ),
    /*  ODD       */  Pop_Push_PACK( 1, 1 ),
    /*  EVEN      */  Pop_Push_PACK( 1, 1 ),
    /*  IF        */  Pop_Push_PACK( 1, 0 ),
    /*  EIF       */  Pop_Push_PACK( 0, 0 ),
    /*  AND       */  Pop_Push_PACK( 2, 1 ),
    /*  OR        */  Pop_Push_PACK( 2, 1 ),
    /*  NOT       */  Pop_Push_PACK( 1, 1 ),
    /*  DeltaP1   */  Pop_Push_PACK( 1, 0 ),
    /*  SDB       */  Pop_Push_PACK( 1, 0 ),
    /*  SDS       */  Pop_Push_PACK( 1, 0 ),

    /*  ADD       */  Pop_Push_PACK( 2, 1 ),
    /*  SUB       */  Pop_Push_PACK( 2, 1 ),
    /*  DIV       */  Pop_Push_PACK( 2, 1 ),
    /*  MUL       */  Pop_Push_PACK( 2, 1 ),
    /*  ABS       */  Pop_Push_PACK( 1, 1 ),
    /*  NEG       */  Pop_Push_PACK( 1, 1 ),
    /*  FLOOR     */  Pop_Push_PACK( 1, 1 ),
    /*  CEILING   */  Pop_Push_PACK( 1, 1 ),
    /*  ROUND[0]  */  Pop_Push_PACK( 1, 1 ),
    /*  ROUND[1]  */  Pop_Push_PACK( 1, 1 ),
    /*  ROUND[2]  */  Pop_Push_PACK( 1, 1 ),
    /*  ROUND[3]  */  Pop_Push_PACK( 1, 1 ),
    /*  NROUND[0] */  Pop_Push_PACK( 1, 1 ),
    /*  NROUND[1] */  Pop_Push_PACK( 1, 1 ),
    /*  NROUND[2] */  Pop_Push_PACK( 1, 1 ),
    /*  NROUND[3] */  Pop_Push_PACK( 1, 1 ),

    /*  WCvtF     */  Pop_Push_PACK( 2, 0 ),
    /*  DeltaP2   */  Pop_Push_PACK( 1, 0 ),
    /*  DeltaP3   */  Pop_Push_PACK( 1, 0 ),
    /*  DeltaCn[0] */ Pop_Push_PACK( 1, 0 ),
    /*  DeltaCn[1] */ Pop_Push_PACK( 1, 0 ),
    /*  DeltaCn[2] */ Pop_Push_PACK( 1, 0 ),
    /*  SROUND    */  Pop_Push_PACK( 1, 0 ),
    /*  S45Round  */  Pop_Push_PACK( 1, 0 ),
    /*  JROT      */  Pop_Push_PACK( 2, 0 ),
    /*  JROF      */  Pop_Push_PACK( 2, 0 ),
    /*  ROFF      */  Pop_Push_PACK( 0, 0 ),
    /*  INS_$7B   */  Pop_Push_PACK( 0, 0 ),
    /*  RUTG      */  Pop_Push_PACK( 0, 0 ),
    /*  RDTG      */  Pop_Push_PACK( 0, 0 ),
    /*  SANGW     */  Pop_Push_PACK( 1, 0 ),
    /*  AA        */  Pop_Push_PACK( 1, 0 ),

    /*  FlipPT    */  Pop_Push_PACK( 0, 0 ),
    /*  FlipRgON  */  Pop_Push_PACK( 2, 0 ),
    /*  FlipRgOFF */  Pop_Push_PACK( 2, 0 ),
    /*  INS_$83   */  Pop_Push_PACK( 0, 0 ),
    /*  INS_$84   */  Pop_Push_PACK( 0, 0 ),
    /*  ScanCTRL  */  Pop_Push_PACK( 1, 0 ),
    /*  SDPVTL[0] */  Pop_Push_PACK( 2, 0 ),
    /*  SDPVTL[1] */  Pop_Push_PACK( 2, 0 ),
    /*  GetINFO   */  Pop_Push_PACK( 1, 1 ),
    /*  IDEF      */  Pop_Push_PACK( 1, 0 ),
    /*  ROLL      */  Pop_Push_PACK( 3, 3 ),
    /*  MAX       */  Pop_Push_PACK( 2, 1 ),
    /*  MIN       */  Pop_Push_PACK( 2, 1 ),
    /*  ScanTYPE  */  Pop_Push_PACK( 1, 0 ),
    /*  InstCTRL  */  Pop_Push_PACK( 2, 0 ),
    /*  INS_$8F   */  Pop_Push_PACK( 0, 0 ),

    /*  INS_$90  */   Pop_Push_PACK( 0, 0 ),
    /*  INS_$91  */   Pop_Push_PACK( 0, 0 ),
    /*  INS_$92  */   Pop_Push_PACK( 0, 0 ),
    /*  INS_$93  */   Pop_Push_PACK( 0, 0 ),
    /*  INS_$94  */   Pop_Push_PACK( 0, 0 ),
    /*  INS_$95  */   Pop_Push_PACK( 0, 0 ),
    /*  INS_$96  */   Pop_Push_PACK( 0, 0 ),
    /*  INS_$97  */   Pop_Push_PACK( 0, 0 ),
    /*  INS_$98  */   Pop_Push_PACK( 0, 0 ),
    /*  INS_$99  */   Pop_Push_PACK( 0, 0 ),
    /*  INS_$9A  */   Pop_Push_PACK( 0, 0 ),
    /*  INS_$9B  */   Pop_Push_PACK( 0, 0 ),
    /*  INS_$9C  */   Pop_Push_PACK( 0, 0 ),
    /*  INS_$9D  */   Pop_Push_PACK( 0, 0 ),
    /*  INS_$9E  */   Pop_Push_PACK( 0, 0 ),
    /*  INS_$9F  */   Pop_Push_PACK( 0, 0 ),

    /*  INS_$A0  */   Pop_Push_PACK( 0, 0 ),
    /*  INS_$A1  */   Pop_Push_PACK( 0, 0 ),
    /*  INS_$A2  */   Pop_Push_PACK( 0, 0 ),
    /*  INS_$A3  */   Pop_Push_PACK( 0, 0 ),
    /*  INS_$A4  */   Pop_Push_PACK( 0, 0 ),
    /*  INS_$A5  */   Pop_Push_PACK( 0, 0 ),
    /*  INS_$A6  */   Pop_Push_PACK( 0, 0 ),
    /*  INS_$A7  */   Pop_Push_PACK( 0, 0 ),
    /*  INS_$A8  */   Pop_Push_PACK( 0, 0 ),
    /*  INS_$A9  */   Pop_Push_PACK( 0, 0 ),
    /*  INS_$AA  */   Pop_Push_PACK( 0, 0 ),
    /*  INS_$AB  */   Pop_Push_PACK( 0, 0 ),
    /*  INS_$AC  */   Pop_Push_PACK( 0, 0 ),
    /*  INS_$AD  */   Pop_Push_PACK( 0, 0 ),
    /*  INS_$AE  */   Pop_Push_PACK( 0, 0 ),
    /*  INS_$AF  */   Pop_Push_PACK( 0, 0 ),

    /*  PushB[0]  */  Pop_Push_PACK( 0, 1 ),
    /*  PushB[1]  */  Pop_Push_PACK( 0, 2 ),
    /*  PushB[2]  */  Pop_Push_PACK( 0, 3 ),
    /*  PushB[3]  */  Pop_Push_PACK( 0, 4 ),
    /*  PushB[4]  */  Pop_Push_PACK( 0, 5 ),
    /*  PushB[5]  */  Pop_Push_PACK( 0, 6 ),
    /*  PushB[6]  */  Pop_Push_PACK( 0, 7 ),
    /*  PushB[7]  */  Pop_Push_PACK( 0, 8 ),
    /*  PushW[0]  */  Pop_Push_PACK( 0, 1 ),
    /*  PushW[1]  */  Pop_Push_PACK( 0, 2 ),
    /*  PushW[2]  */  Pop_Push_PACK( 0, 3 ),
    /*  PushW[3]  */  Pop_Push_PACK( 0, 4 ),
    /*  PushW[4]  */  Pop_Push_PACK( 0, 5 ),
    /*  PushW[5]  */  Pop_Push_PACK( 0, 6 ),
    /*  PushW[6]  */  Pop_Push_PACK( 0, 7 ),
    /*  PushW[7]  */  Pop_Push_PACK( 0, 8 ),

    /*  MDRP[00]  */  Pop_Push_PACK( 1, 0 ),
    /*  MDRP[01]  */  Pop_Push_PACK( 1, 0 ),
    /*  MDRP[02]  */  Pop_Push_PACK( 1, 0 ),
    /*  MDRP[03]  */  Pop_Push_PACK( 1, 0 ),
    /*  MDRP[04]  */  Pop_Push_PACK( 1, 0 ),
    /*  MDRP[05]  */  Pop_Push_PACK( 1, 0 ),
    /*  MDRP[06]  */  Pop_Push_PACK( 1, 0 ),
    /*  MDRP[07]  */  Pop_Push_PACK( 1, 0 ),
    /*  MDRP[08]  */  Pop_Push_PACK( 1, 0 ),
    /*  MDRP[09]  */  Pop_Push_PACK( 1, 0 ),
    /*  MDRP[10]  */  Pop_Push_PACK( 1, 0 ),
    /*  MDRP[11]  */  Pop_Push_PACK( 1, 0 ),
    /*  MDRP[12]  */  Pop_Push_PACK( 1, 0 ),
    /*  MDRP[13]  */  Pop_Push_PACK( 1, 0 ),
    /*  MDRP[14]  */  Pop_Push_PACK( 1, 0 ),
    /*  MDRP[15]  */  Pop_Push_PACK( 1, 0 ),

    /*  MDRP[16]  */  Pop_Push_PACK( 1, 0 ),
    /*  MDRP[17]  */  Pop_Push_PACK( 1, 0 ),
    /*  MDRP[18]  */  Pop_Push_PACK( 1, 0 ),
    /*  MDRP[19]  */  Pop_Push_PACK( 1, 0 ),
    /*  MDRP[20]  */  Pop_Push_PACK( 1, 0 ),
    /*  MDRP[21]  */  Pop_Push_PACK( 1, 0 ),
    /*  MDRP[22]  */  Pop_Push_PACK( 1, 0 ),
    /*  MDRP[23]  */  Pop_Push_PACK( 1, 0 ),
    /*  MDRP[24]  */  Pop_Push_PACK( 1, 0 ),
    /*  MDRP[25]  */  Pop_Push_PACK( 1, 0 ),
    /*  MDRP[26]  */  Pop_Push_PACK( 1, 0 ),
    /*  MDRP[27]  */  Pop_Push_PACK( 1, 0 ),
    /*  MDRP[28]  */  Pop_Push_PACK( 1, 0 ),
    /*  MDRP[29]  */  Pop_Push_PACK( 1, 0 ),
    /*  MDRP[30]  */  Pop_Push_PACK( 1, 0 ),
    /*  MDRP[31]  */  Pop_Push_PACK( 1, 0 ),

    /*  MIRP[00]  */  Pop_Push_PACK( 2, 0 ),
    /*  MIRP[01]  */  Pop_Push_PACK( 2, 0 ),
    /*  MIRP[02]  */  Pop_Push_PACK( 2, 0 ),
    /*  MIRP[03]  */  Pop_Push_PACK( 2, 0 ),
    /*  MIRP[04]  */  Pop_Push_PACK( 2, 0 ),
    /*  MIRP[05]  */  Pop_Push_PACK( 2, 0 ),
    /*  MIRP[06]  */  Pop_Push_PACK( 2, 0 ),
    /*  MIRP[07]  */  Pop_Push_PACK( 2, 0 ),
    /*  MIRP[08]  */  Pop_Push_PACK( 2, 0 ),
    /*  MIRP[09]  */  Pop_Push_PACK( 2, 0 ),
    /*  MIRP[10]  */  Pop_Push_PACK( 2, 0 ),
    /*  MIRP[11]  */  Pop_Push_PACK( 2, 0 ),
    /*  MIRP[12]  */  Pop_Push_PACK( 2, 0 ),
    /*  MIRP[13]  */  Pop_Push_PACK( 2, 0 ),
    /*  MIRP[14]  */  Pop_Push_PACK( 2, 0 ),
    /*  MIRP[15]  */  Pop_Push_PACK( 2, 0 ),

    /*  MIRP[16]  */  Pop_Push_PACK( 2, 0 ),
    /*  MIRP[17]  */  Pop_Push_PACK( 2, 0 ),
    /*  MIRP[18]  */  Pop_Push_PACK( 2, 0 ),
    /*  MIRP[19]  */  Pop_Push_PACK( 2, 0 ),
    /*  MIRP[20]  */  Pop_Push_PACK( 2, 0 ),
    /*  MIRP[21]  */  Pop_Push_PACK( 2, 0 ),
    /*  MIRP[22]  */  Pop_Push_PACK( 2, 0 ),
    /*  MIRP[23]  */  Pop_Push_PACK( 2, 0 ),
    /*  MIRP[24]  */  Pop_Push_PACK( 2, 0 ),
    /*  MIRP[25]  */  Pop_Push_PACK( 2, 0 ),
    /*  MIRP[26]  */  Pop_Push_PACK( 2, 0 ),
    /*  MIRP[27]  */  Pop_Push_PACK( 2, 0 ),
    /*  MIRP[28]  */  Pop_Push_PACK( 2, 0 ),
    /*  MIRP[29]  */  Pop_Push_PACK( 2, 0 ),
    /*  MIRP[30]  */  Pop_Push_PACK( 2, 0 ),
    /*  MIRP[31]  */  Pop_Push_PACK( 2, 0 )
];

function GUESS_VECTOR(exc, v)
{
    // TODO: unpatented
}

function Ins_SxVTL(exc, aIdx1, aIdx2, aOpc, Vec)
{
    if ((aIdx1 >= exc.zp2.n_points) || (aIdx2 >= exc.zp1.n_points))
    {
        if (exc.pedantic_hinting)
            exc.error = FT_Err_Invalid_Reference;
        return 1;
    }

    var p1 = exc.zp1.cur[exc.zp1._offset_cur + aIdx2];
    var p2 = exc.zp2.cur[exc.zp2._offset_cur + aIdx1];

    var A = p1.x - p2.x;
    var B = p1.y - p2.y;

    /* If p1 == p2, SPVTL and SFVTL behave the same as */
    /* SPVTCA[X] and SFVTCA[X], respectively.          */
    /*                                                 */
    /* Confirmed by Greg Hitchcock.                    */

    if (A == 0 && B == 0)
    {
        A = 0x4000;
        aOpc = 0;
    }

    if ((aOpc & 1) != 0)
    {
        var C =  B;   /* counter clockwise rotation */
        B =  A;
        A = -C;
    }

    Normalize(exc, A, B, Vec);

    return 0;
}

function TT_VecLen(X, Y)
{
    if (X > FT_Common.m_i || Y > FT_Common.m_i)
        alert("error");

    var v = new FT_Vector();
    v.x = X;
    v.y = Y;
    return FT_Vector_Length(v);
}

var FT_Hypot = TT_VecLen;

function FT_DivFix14(a, b)
{
    return FT_DivFix(a, b << 2);
}

function Normalize(exc, Vx, Vy, R)
{
    if (Vx > FT_Common.m_i || Vy > FT_Common.m_i)
        alert("error");

    if (Math.abs(Vx) < 0x4000 && Math.abs(Vy) < 0x4000)
    {
        if (0 == Vx && 0 == Vy)
            return 0;

        Vx *= 0x4000;
        Vy *= 0x4000;
    }

    var W = FT_Hypot(Vx, Vy);

    R.x = FT_Common.UShort_To_Short(FT_DivFix14(Vx, W) & 0xFFFF);   /* Type conversion */
    R.y = FT_Common.UShort_To_Short(FT_DivFix14(Vy, W) & 0xFFFF);   /* Type conversion */

    return 0;
}

// ------
function Compute_Funcs(exc)
{
    // TODO: unpatented
    if (exc.GS.freeVector.x == 0x4000)
        exc.F_dot_P = exc.GS.projVector.x;
    else if (exc.GS.freeVector.y == 0x4000)
        exc.F_dot_P = exc.GS.projVector.y;
    else
        exc.F_dot_P = (exc.GS.projVector.x * exc.GS.freeVector.x + exc.GS.projVector.y * exc.GS.freeVector.y) >> 14;

    if (exc.GS.projVector.x == 0x4000)
        exc.func_project = Project_x;
    else if (exc.GS.projVector.y == 0x4000)
        exc.func_project = Project_y;
    else
        exc.func_project = Project;

    if (exc.GS.dualVector.x == 0x4000)
        exc.func_dualproj = Project_x;
    else if (exc.GS.dualVector.y == 0x4000)
        exc.func_dualproj = Project_y;
    else
        exc.func_dualproj = Dual_Project;

    exc.func_move      = Direct_Move;
    exc.func_move_orig = Direct_Move_Orig;

    if (exc.F_dot_P == 0x4000)
    {
        if ( exc.GS.freeVector.x == 0x4000 )
        {
            exc.func_move      = Direct_Move_X;
            exc.func_move_orig = Direct_Move_Orig_X;
        }
        else if ( exc.GS.freeVector.y == 0x4000 )
        {
            exc.func_move      = Direct_Move_Y;
            exc.func_move_orig = Direct_Move_Orig_Y;
        }
    }

    /* at small sizes, F_dot_P can become too small, resulting   */
    /* in overflows and `spikes' in a number of glyphs like `w'. */
    if (Math.abs(exc.F_dot_P) < 0x400)
        exc.F_dot_P = 0x4000;

    /* Disable cached aspect ratio */
    exc.tt_metrics.ratio = 0;
}

function Project(exc, dx, dy)
{
    if (dx > FT_Common.m_i || dy > FT_Common.m_i)
        alert("error");

    return TT_DotFix14(dx, dy, exc.GS.projVector.x, exc.GS.projVector.y);
}
function Project_x(exc, dx, dy)
{
    if (dx > FT_Common.m_i || dy > FT_Common.m_i)
        alert("error");

    return dx;
}
function Project_y(exc, dx, dy)
{
    if (dx > FT_Common.m_i || dy > FT_Common.m_i)
        alert("error");

    return dy;
}
function Dual_Project(exc, dx, dy)
{
    if (dx > FT_Common.m_i || dy > FT_Common.m_i)
        alert("error");
    
    return TT_DotFix14(dx, dy, exc.GS.dualVector.x, exc.GS.dualVector.y);
}

function Direct_Move(exc, zone, point, distance)
{
    if (point < 0 || point > 0xFFFF || distance > FT_Common.m_i)
        alert("error");

    var v = exc.GS.freeVector.x;
    if (v != 0)
    {
        if (exc.face.driver.library.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING)
        {
            if (!exc.ignore_x_mode || (exc.sph_tweak_flags & FT_Common.SPH_TWEAK_ALLOW_X_DMOVE))
            {
                 zone.cur[zone._offset_cur + point].x += FT_MulDiv(distance, v, exc.F_dot_P);
            }
        }
        else
        {
            zone.cur[zone._offset_cur + point].x += FT_MulDiv(distance, v, exc.F_dot_P);
        }

        zone.tags[zone._offset_tags + point] |= FT_Common.FT_CURVE_TAG_TOUCH_X;
    }

    v = exc.GS.freeVector.y;

    if (v != 0)
    {
        zone.cur[zone._offset_cur + point].y += FT_MulDiv(distance, v, exc.F_dot_P);
        zone.tags[zone._offset_tags + point] |= FT_Common.FT_CURVE_TAG_TOUCH_Y;
    }
}

function Direct_Move_Orig(exc, zone, point, distance)
{
    if (point < 0 || point > 0xFFFF || distance > FT_Common.m_i)
        alert("error");

    var v = exc.GS.freeVector.x;

    if (v != 0)
    {
        zone.org[zone._offset_org + point].x += FT_MulDiv(distance, v, exc.F_dot_P);
    }

    v = exc.GS.freeVector.y;

    if (v != 0)
    {
        zone.org[zone._offset_org + point].y += FT_MulDiv(distance, v, exc.F_dot_P);
    }
}

function Direct_Move_X(exc, zone, point, distance)
{
    if (point < 0 || point > 0xFFFF || distance > FT_Common.m_i)
        alert("error");

    if (exc.face.driver.library.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING)
    {
        if (!exc.ignore_x_mode)
        {
            zone.cur[zone._offset_cur + point].x += distance;
        }
        zone.tags[zone._offset_tags + point] |= FT_Common.FT_CURVE_TAG_TOUCH_X;
    }
    else
    {
        zone.cur[zone._offset_cur + point].x += distance;
        zone.tags[zone._offset_tags + point] |= FT_Common.FT_CURVE_TAG_TOUCH_X;
    }
}

function Direct_Move_Y(exc, zone, point, distance)
{
    if (point < 0 || point > 0xFFFF || distance > FT_Common.m_i)
        alert("error");

    zone.cur[zone._offset_cur + point].y += distance;
    zone.tags[zone._offset_tags + point] |= FT_Common.FT_CURVE_TAG_TOUCH_Y;
}

function Direct_Move_Orig_X(exc, zone, point, distance)
{
    if (point < 0 || point > 0xFFFF || distance > FT_Common.m_i)
        alert("error");

    zone.org[zone._offset_org + point].x += distance;
}

function Direct_Move_Orig_Y(exc, zone, point, distance)
{
    if (point < 0 || point > 0xFFFF || distance > FT_Common.m_i)
        alert("error");
    
    zone.org[zone._offset_org + point].y += distance;
}

// ------

// ------
function Compute_Round(exc, round_mode)
{
    switch (round_mode)
    {
    case TT_Round_Off:
        exc.func_round = Round_None;
        break;

    case TT_Round_To_Grid:
        exc.func_round = Round_To_Grid;
        break;

    case TT_Round_Up_To_Grid:
        exc.func_round = Round_Up_To_Grid;
        break;

    case TT_Round_Down_To_Grid:
        exc.func_round = Round_Down_To_Grid;
        break;

    case TT_Round_To_Half_Grid:
        exc.func_round = Round_To_Half_Grid;
        break;

    case TT_Round_To_Double_Grid:
        exc.func_round = Round_To_Double_Grid;
        break;

    case TT_Round_Super:
        exc.func_round = Round_Super;
        break;

    case TT_Round_Super_45:
        exc.func_round = Round_Super_45;
        break;
    }
}

function Round_None(exc, distance, compensation)
{
    if (distance > FT_Common.m_i || compensation > FT_Common.m_i)
        alert("error");

    var val;
    if (distance >= 0)
    {
        val = distance + compensation;
        if (distance != 0 && val < 0)
            val = 0;
    }
    else
    {
        val = distance - compensation;
        if (val > 0)
            val = 0;
    }
    return val;
}

function Round_To_Grid(exc, distance, compensation)
{
    if (distance > FT_Common.m_i || compensation > FT_Common.m_i)
        alert("error");

    var val;
    if (distance >= 0)
    {
        val = distance + compensation + 32;
        if (distance != 0 && val > 0)
            val &= ~63;
        else
            val = 0;
    }
    else
    {
        val = -FT_PIX_ROUND(compensation - distance);
        if (val > 0)
            val = 0;
    }

    return  val;
}

function Round_Up_To_Grid(exc, distance, compensation)
{
    if (distance > FT_Common.m_i || compensation > FT_Common.m_i)
        alert("error");

    var val;
    if (distance >= 0)
    {
        val = distance + compensation + 63;
        if (distance != 0 && val > 0)
            val &= ~63;
        else
            val = 0;
    }
    else
    {
        val = -FT_PIX_CEIL(compensation - distance);
        if (val > 0)
            val = 0;
    }
    return val;
}

function Round_Down_To_Grid(exc, distance, compensation)
{
    if (distance > FT_Common.m_i || compensation > FT_Common.m_i)
        alert("error");

    var val;
    if (distance >= 0)
    {
        val = distance + compensation;
        if (distance && val > 0)
            val &= ~63;
        else
            val = 0;
    }
    else
    {
        val = -((compensation - distance) & -64);
        if (val > 0)
            val = 0;
    }
    return val;
}

function Round_To_Half_Grid(exc, distance, compensation)
{
    if (distance > FT_Common.m_i || compensation > FT_Common.m_i)
        alert("error");
    
    var val;
    if (distance >= 0)
    {
        val = FT_PIX_FLOOR(distance + compensation) + 32;
        if (distance != 0 && val < 0)
            val = 0;
    }
    else
    {
        val = -(FT_PIX_FLOOR(compensation - distance) + 32);
        if (val > 0)
            val = 0;
    }
    return val;
}

function Round_To_Double_Grid(exc, distance, compensation)
{
    if (distance > FT_Common.m_i || compensation > FT_Common.m_i)
        alert("error");
    
    var val;
    if (distance >= 0)
    {
        val = distance + compensation + 16;
        if (distance != 0 && val > 0)
            val &= ~31;
        else
            val = 0;
    }
    else
    {
        val = -FT_PAD_ROUND(compensation - distance, 32);
        if (val > 0)
            val = 0;
    }

    return val;
}

function Round_Super(exc, distance, compensation)
{
    if (distance > FT_Common.m_i || compensation > FT_Common.m_i)
        alert("error");
    
    var val;
    if (distance >= 0)
    {
        val = (distance - exc.phase + exc.threshold + compensation) & -exc.period;
        if (distance != 0 && val < 0)
            val = 0;
        val += exc.phase;
    }
    else
    {
        val = -((exc.threshold - exc.phase - distance + compensation) & -exc.period);
        if (val > 0)
            val = 0;
        val -= exc.phase;
    }
    return val;
}

function Round_Super_45(exc, distance, compensation)
{
    if (distance > FT_Common.m_i || compensation > FT_Common.m_i)
        alert("error");
    
    var val;
    if (distance >= 0)
    {
        val = (((distance - exc.phase + exc.threshold + compensation) / exc.period) >> 0) * exc.period;
        if (distance != 0 && val < 0)
            val = 0;
        val += exc.phase;
    }
    else
    {
        val = -((((exc.threshold - exc.phase - distance + compensation) / exc.period) >> 0) * exc.period);
        if (val > 0)
            val = 0;
        val -= exc.phase;
    }
    return val;
}

function SetSuperRound(exc, GridPeriod, selector)
{
    switch ((selector & 0xC0))
    {
    case 0:
        exc.period = (GridPeriod / 2) >> 0;
        break;
    case 0x40:
        exc.period = GridPeriod;
        break;
    case 0x80:
        exc.period = GridPeriod * 2;
        break;
    /* This opcode is reserved, but... */
    case 0xC0:
        exc.period = GridPeriod;
        break;
    }

    switch ((selector & 0x30))
    {
    case 0:
        exc.phase = 0;
        break;
    case 0x10:
        exc.phase = exc.period >> 2;
        break;
    case 0x20:
        exc.phase = exc.period >> 1;
        break;
    case 0x30:
        exc.phase = (exc.period * 3) >> 2;
        break;
    }

    if ((selector & 0x0F) == 0)
        exc.threshold = exc.period - 1;
    else
        exc.threshold = (((selector & 0x0F) - 4) * exc.period) >> 3;

    exc.period    >>= 8;
    exc.phase     >>= 8;
    exc.threshold >>= 8;
}

// ------

function SkipCode(exc)
{
    exc.IP += exc.length;

    if (exc.IP < exc.codeSize)
    {
        exc.opcode = exc.code.data[exc.code.pos + exc.IP];

        exc.length = opcode_length[exc.opcode];
        if ( exc.length < 0 )
        {
            if ( exc.IP + 1 >= exc.codeSize )
            {
                exc.error = FT_Common.FT_Err_Code_Overflow;
                return 1;
            }
            exc.length = 2 - exc.length * exc.code.data[exc.code.pos + exc.IP + 1];
        }

        if (exc.IP + exc.length <= exc.codeSize)
            return 0;
    }

    exc.error = FT_Common.FT_Err_Code_Overflow;
    return 1;
}

function Ins_Goto_CodeRange(exc, aRange, aIP)
{
    if (aRange < 1 || aRange > 3)
    {
        exc.error = FT_Common.FT_Err_Bad_Argument;
        return 1;
    }

    var range = exc.codeRangeTable[aRange - 1];

    if (range.base == null)     /* invalid coderange */
    {
        exc.error = FT_Common.FT_Err_Invalid_CodeRange;
        return 1;
    }

    /* NOTE: Because the last instruction of a program may be a CALL */
    /*       which will return to the first byte *after* the code    */
    /*       range, we test for aIP <= Size, instead of aIP < Size.  */

    if (aIP > range.size)
    {
        exc.error = FT_Common.FT_Err_Code_Overflow;
        return 1;
    }

    exc.code     = dublicate_pointer(range.base);
    exc.codeSize = range.size;
    exc.IP       = aIP;
    exc.curRange = aRange;

    return 0;
}

function Compute_Point_Displacement(exc, x, y, zone, refp)
{
    var ret = {x: x, y: y, refp: refp, err: 0};
    var zp = null;
    var p;

    if (exc.opcode & 1)
    {
        zp = exc.zp0;
        p  = exc.GS.rp1;
    }
    else
    {
        zp = exc.zp1;
        p  = exc.GS.rp2;
    }

    if (p >= zp.n_points)
    {
        if (exc.pedantic_hinting )
            exc.error = FT_Common.FT_Err_Invalid_Reference;
        ret.refp = 0;
        ret.err = 1;
        return ret;
    }

    zone.Copy(zp);
    ret.refp = p;

    var v1 = zp.cur[zp._offset_cur + p];
    var v2 = zp.org[zp._offset_org + p];
    var d = exc.func_project(exc, v1.x - v2.x, v1.y - v2.y);

    // TODO : unpatended
    ret.x = FT_MulDiv(d, exc.GS.freeVector.x, exc.F_dot_P);
    ret.y = FT_MulDiv(d, exc.GS.freeVector.y, exc.F_dot_P);

    return ret;
}

function TT_MulFix14(a, b)
{
    a = FT_Common.UintToInt(a);
    b = FT_Common.UintToInt(b);

    var sign = a ^ b;

    if (a < 0)
        a = -a;
    if (b < 0)
        b = -b;

    var ah = ((a >> 16) & 0xFFFF);
    var al = (a & 0xFFFF);

    var lo = FT_Common.IntToUInt((al * b) & 0xFFFFFFFF);
    var mid = FT_Common.IntToUInt((ah * b) & 0xFFFFFFFF);
    var hi = FT_Common.IntToUInt(mid >> 16);
    mid = FT_Common.IntToUInt(((mid << 16) + (1 << 13)) & 0xFFFFFFFF); /* rounding */
    lo += mid;

    lo = FT_Common.IntToUInt(lo & 0xFFFFFFFF);

    if (lo < mid)
        hi += 1;

    mid = FT_Common.IntToUInt(((lo >> 14) | (hi << 18)) & 0xFFFFFFFF);
    return sign >= 0 ? mid : -mid;
}

function TT_DotFix14(ax, ay, bx, by)
{
    ax = FT_Common.UintToInt(ax);
    ay = FT_Common.UintToInt(ay);
    bx = FT_Common.UintToInt(bx);
    by = FT_Common.UintToInt(by);

    /* compute ax*bx as 64-bit value */
    var _l = ((ax & 0xFFFF) * bx) & 0xFFFFFFFF;
    var l = FT_Common.IntToUInt(_l);
    var m = ((ax >> 16) * bx) & 0xFFFFFFFF;

    var lo1 = l + FT_Common.IntToUInt((m << 16) & 0xFFFFFFFF);
    lo1 = FT_Common.IntToUInt(lo1 & 0xFFFFFFFF);

    var hi1 = (m >> 16) + (_l >> 31) + ((lo1 < l) ? 1 : 0);

    /* compute ay*by as 64-bit value */
    _l = ((ay & 0xFFFF) * by) & 0xFFFFFFFF;
    l = FT_Common.IntToUInt(_l);
    m = ((ay >> 16) * by) & 0xFFFFFFFF;

    var lo2 = l + FT_Common.IntToUInt(m << 16);
    lo2 = FT_Common.IntToUInt(lo2 & 0xFFFFFFFF);

    var hi2 = (m >> 16) + (_l >> 31) + ((lo2 < l) ? 1 : 0);

    /* add them */
    var lo = lo1 + lo2;
    lo = FT_Common.IntToUInt(lo & 0xFFFFFFFF);

    var hi = hi1 + hi2 + ((lo < lo1) ? 1 : 0);

    /* divide the result by 2^14 with rounding */
    var s   = hi >> 31;
    l  = lo + FT_Common.IntToUInt(s);
    l = FT_Common.IntToUInt(l & 0xFFFFFFFF);

    hi += s + ((l < lo) ? 1 : 0);
    lo  = l;

    l   = lo + 0x2000;
    l = FT_Common.IntToUInt(l & 0xFFFFFFFF);
    
    hi += ((l < lo) ? 1 : 0);

    return ((hi << 18) | (l >> 14)) & 0xFFFFFFFF;
}

function Move_Zp2_Point(exc, point, dx, dy, touch)
{
    // TODO: unpatented
    if (exc.GS.freeVector.x != 0)
    {
        if (exc.face.driver.library.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING) //#ifdef TT_CONFIG_OPTION_SUBPIXEL_HINTING
        {
            if (!exc.ignore_x_mode || (exc.ignore_x_mode && (exc.sph_tweak_flags & FT_Common.SPH_TWEAK_ALLOW_X_MOVE_ZP2)))
            {
                exc.zp2.cur[exc.zp2._offset_cur + point].x += dx;
            }
        }
        else
        {
            exc.zp2.cur[exc.zp2._offset_cur + point].x += dx;
        }
        if (touch)
            exc.zp2.tags[exc.zp2._offset_tags + point] |= FT_Common.FT_CURVE_TAG_TOUCH_X;
    }

    if (exc.GS.freeVector.y != 0)
    {
        exc.zp2.cur[exc.zp2._offset_cur + point].y += dy;
        if (touch)
            exc.zp2.tags[exc.zp2._offset_tags + point] |= FT_Common.FT_CURVE_TAG_TOUCH_Y;
    }
}
////////////////////////////////////////////////////////
function Ins_SVTCA(exc, args, args_pos)
{
    var A = ;
    var B = 0x4000;
    if ((exc.opcode & 1) == 1)
    {
        A = 0x4000;
        B = 0;
    }

    exc.GS.freeVector.x = A;
    exc.GS.projVector.x = A;
    exc.GS.dualVector.x = A;

    exc.GS.freeVector.y = B;
    exc.GS.projVector.y = B;
    exc.GS.dualVector.y = B;

    Compute_Funcs(exc);
}

function Ins_SPVTCA(exc, args, args_pos)
{
    var A = 0;
    var B = 0x4000;
    if ((exc.opcode & 1) == 1)
    {
        A = 0x4000;
        B = 0;
    }

    exc.GS.projVector.x = A;
    exc.GS.dualVector.x = A;

    exc.GS.projVector.y = B;
    exc.GS.dualVector.y = B;

    GUESS_VECTOR(exc, exc.GS.freeVector);

    Compute_Funcs(exc);
}

function Ins_SFVTCA(exc, args, args_pos)
{
    var A = 0;
    var B = 0x4000;
    if ((exc.opcode & 1) == 1)
    {
        A = 0x4000;
        B = 0;
    }

    exc.GS.freeVector.x = A;
    exc.GS.freeVector.y = B;

    GUESS_VECTOR(exc, exc.projVector);

    Compute_Funcs(exc);
}

function Ins_SPVTL(exc, args, args_pos)
{
    if (Ins_SxVTL(exc, 0xFFFF & args[args_pos + 1], 0xFFFF & args[args_pos], exc.opcode, exc.GS.projVector) == 0)
    {
        exc.GS.dualVector.x = exc.GS.projVector.x;
        exc.GS.dualVector.y = exc.GS.projVector.y;
        GUESS_VECTOR(exc, exc.GS.freeVector);
        Compute_Funcs(exc);
    }
}

function Ins_SFVTL(exc, args, args_pos)
{
    if (Ins_SxVTL(exc, 0xFFFF & args[args_pos + 1], 0xFFFF & args[args_pos], exc.opcode, exc.GS.freeVector) == 0)
    {
        GUESS_VECTOR(exc, exc.GS.projVector );
        Compute_Funcs(exc);
    }
}

function Ins_SPVFS(exc, args, args_pos)
{
    /* Only use low 16bits, then sign extend */
    var Y = FT_Common.UShort_To_Short(0xFFFF & args[args_pos + 1]);
    var X = FT_Common.UShort_To_Short(0xFFFF & args[args_pos]);

    Normalize(exc, X, Y, exc.GS.projVector);

    exc.GS.dualVector.x = exc.GS.projVector.x;
    exc.GS.dualVector.y = exc.GS.projVector.y;
    GUESS_VECTOR(exc, exc.GS.freeVector );
    Compute_Funcs(exc);
}

function Ins_SFVFS(exc, args, args_pos)
{
    /* Only use low 16bits, then sign extend */
    var Y = FT_Common.UShort_To_Short(0xFFFF & args[args_pos + 1]);
    var X = FT_Common.UShort_To_Short(0xFFFF & args[args_pos]);

    Normalize(exc, X, Y, exc.GS.freeVector);
    GUESS_VECTOR(exc, exc.GS.projVector );
    Compute_Funcs(exc);
}

function Ins_GPV(exc, args, args_pos)
{
    // TODO: unpatented
    args[args_pos] = exc.GS.projVector.x;
    args[args_pos + 1] = exc.GS.projVector.y;
}

function Ins_GFV(exc, args, args_pos)
{
    // TODO: unpatented
    args[args_pos] = exc.GS.freeVector.x;
    args[args_pos + 1] = exc.GS.freeVector.y;
}

function Ins_SFVTPV(exc, args, args_pos)
{
    GUESS_VECTOR(exc, exc.GS.projVector);
    exc.GS.freeVector.x = exc.GS.projVector.x;
    exc.GS.freeVector.y = exc.GS.projVector.y;
    Compute_Funcs(exc);
}

function Ins_ISECT(exc, args, args_pos)
{
    var point = 0xFFFF & args[args_pos];

    var a0 = 0xFFFF & args[args_pos + 1];
    var a1 = 0xFFFF & args[args_pos + 2];
    var b0 = 0xFFFF & args[args_pos + 3];
    var b1 = 0xFFFF & args[args_pos + 4];

    if ((b0 >= exc.zp0.n_points)  ||
        (b1 >= exc.zp0.n_points)  ||
        (a0 >= exc.zp1.n_points)  ||
        (a1 >= exc.zp1.n_points)  ||
        (point >= exc.zp2.n_points))
    {
        if (exc.pedantic_hinting)
            exc.error = FT_Common.FT_Err_Invalid_Reference;
        return;
    }

    /* Cramer's rule */

    var off0 = exc.zp0._offset_cur;
    var off1 = exc.zp1._offset_cur;
    var off2 = exc.zp2._offset_cur;

    var dbx = exc.zp0.cur[off0+b1].x - exc.zp0.cur[off0+b0].x;
    var dby = exc.zp0.cur[off0+b1].y - exc.zp0.cur[off0+b0].y;

    var dax = exc.zp1.cur[off1+a1].x - exc.zp1.cur[off1+a0].x;
    var day = exc.zp1.cur[off1+a1].y - exc.zp1.cur[off1+a0].y;

    var dx = exc.zp0.cur[off0+b0].x - exc.zp1.cur[off1+a0].x;
    var dy = exc.zp0.cur[off0+b0].y - exc.zp1.cur[off1+a0].y;

    exc.zp2.tags[exc.zp2._offset_tags + point] |= FT_Common.FT_CURVE_TAG_TOUCH_BOTH;

    var discriminant = FT_MulDiv(dax, -dby, 0x40) + FT_MulDiv(day, dbx, 0x40);
    var dotproduct   = FT_MulDiv(dax, dbx, 0x40) + FT_MulDiv(day, dby, 0x40);

    /* The discriminant above is actually a cross product of vectors     */
    /* da and db. Together with the dot product, they can be used as     */
    /* surrogates for sine and cosine of the angle between the vectors.  */
    /* Indeed,                                                           */
    /*       dotproduct   = |da||db|cos(angle)                           */
    /*       discriminant = |da||db|sin(angle)     .                     */
    /* We use these equations to reject grazing intersections by         */
    /* thresholding abs(tan(angle)) at 1/19, corresponding to 3 degrees. */
    if (19 * Math.abs(discriminant) > Math.abs(dotproduct))
    {
        var val = FT_MulDiv(dx, -dby, 0x40) + FT_MulDiv(dy, dbx, 0x40);

        var __x = FT_MulDiv(val, dax, discriminant);
        var __y = FT_MulDiv(val, day, discriminant);

        exc.zp2.cur[off2 + point].x = exc.zp1.cur[off1 + a0].x + __x;
        exc.zp2.cur[off2 + point].y = exc.zp1.cur[off1 + a0].y + __y;
    }
    else
    {
        /* else, take the middle of the middles of A and B */
        exc.zp2.cur[off2 + point].x = (exc.zp1.cur[off1 + a0].x +
                               exc.zp1.cur[off1 + a1].x +
                               exc.zp0.cur[off0 + b0].x +
                               exc.zp0.cur[off0 + b1].x ) >> 2;
        exc.zp2.cur[off2 + point].y = (exc.zp1.cur[off1 + a0].y +
                               exc.zp1.cur[off1 + a1].y +
                               exc.zp0.cur[off0 + b0].y +
                               exc.zp0.cur[off0 + b1].y ) >> 2;
    }
}

function Ins_SRP0(exc, args, args_pos)
{
    exc.GS.rp0 = 0xFFFF & args[args_pos];
}

function Ins_SRP1(exc, args, args_pos)
{
    exc.GS.rp1 = 0xFFFF & args[args_pos];
}

function Ins_SRP2(exc, args, args_pos)
{
    exc.GS.rp2 = 0xFFFF & args[args_pos];
}

function Ins_SZP0(exc, args, args_pos)
{
    switch (args[args_pos])
    {
    case 0:
        exc.zp0.Copy(exc.twilight);
        break;

    case 1:
        exc.zp0.Copy(exc.pts);
        break;

    default:
        if (exc.pedantic_hinting)
            exc.error = FT_Common.FT_Err_Invalid_Reference;
        return;
    }

    exc.GS.gep0 = 0xFFFF & args[args_pos];
}

function Ins_SZP1(exc, args, args_pos)
{
    switch (args[args_pos])
    {
    case 0:
        exc.zp1.Copy(exc.twilight);
        break;

    case 1:
        exc.zp1.Copy(exc.pts);
        break;

    default:
        if (exc.pedantic_hinting)
            exc.error = FT_Common.FT_Err_Invalid_Reference;
        return;
    }

    exc.GS.gep1 = 0xFFFF & args[args_pos];
}

function Ins_SZP2(exc, args, args_pos)
{
    switch (args[args_pos])
    {
    case 0:
        exc.zp2.Copy(exc.twilight);
        break;

    case 1:
        exc.zp2.Copy(exc.pts);
        break;

    default:
        if (exc.pedantic_hinting)
            exc.error = FT_Common.FT_Err_Invalid_Reference;
        return;
    }

    exc.GS.gep2 = 0xFFFF & args[args_pos];
}

function Ins_SZPS(exc, args, args_pos)
{
    switch (args[args_pos])
    {
    case 0:
        exc.zp0.Copy(exc.twilight);
        break;

    case 1:
        exc.zp0.Copy(exc.pts);
        break;

    default:
        if (exc.pedantic_hinting)
            exc.error = FT_Common.FT_Err_Invalid_Reference;
        return;
    }

    exc.zp1.Copy(exc.zp0);
    exc.zp2.Copy(exc.zp0);

    exc.GS.gep0 = 0xFFFF & args[args_pos];
    exc.GS.gep1 = 0xFFFF & args[args_pos];
    exc.GS.gep2 = 0xFFFF & args[args_pos];
}

function Ins_SLOOP(exc, args, args_pos)
{
    if (args[args_pos] < 0)
        exc.error = FT_Common.FT_Err_Bad_Argument;
    else
        exc.GS.loop = args[args_pos];
}

function Ins_RTG(exc, args, args_pos)
{
    exc.GS.round_state = TT_Round_To_Grid;
    exc.func_round = Round_To_Grid;
}

function Ins_RTHG(exc, args, args_pos)
{
    exc.GS.round_state = TT_Round_To_Half_Grid;
    exc.func_round = Round_To_Half_Grid;
}

function Ins_SMD(exc, args, args_pos)
{
    exc.GS.minimum_distance = args[args_pos];
}

function Ins_ELSE(exc, args, args_pos)
{
    var nIfs = 1;

    do
    {
        if (SkipCode(exc) == 1)
            return;

        switch (exc.opcode)
        {
        case 0x58:    /* IF */
            nIfs++;
            break;

        case 0x59:    /* EIF */
            nIfs--;
            break;
        }
    } while ( nIfs != 0 );
}

function Ins_JMPR(exc, args, args_pos)
{
    if (args[args_pos] == 0 && exc.args == 0)
        exc.error = FT_Common.FT_Err_Bad_Argument;
    exc.IP += args[args_pos];
    if (exc.IP < 0 || (exc.callTop > 0 && exc.IP > exc.callStack[exc.callTop - 1].Def.end))
        exc.error = FT_Common.FT_Err_Bad_Argument;
    exc.step_ins = 0;
}

function Ins_SCVTCI(exc, args, args_pos)
{
    exc.GS.control_value_cutin = args[args_pos];
}

function Ins_SSWCI(exc, args, args_pos)
{
    exc.GS.single_width_cutin = args[args_pos];
}

function Ins_SSW(exc, args, args_pos)
{
    exc.GS.single_width_value = FT_MulFix(args[args_pos], exc.tt_metrics.scale);
}

function Ins_DUP(exc, args, args_pos)
{
    args[args_pos + 1] = args[args_pos];
}

function Ins_POP(exc, args, args_pos)
{
}

function Ins_CLEAR(exc, args, args_pos)
{
    exc.new_top = 0;
}

function Ins_SWAP(exc, args, args_pos)
{
    var L = args[args_pos];
    args[args_pos] = args[args_pos + 1];
    args[args_pos + 1] = L;
}

function Ins_DEPTH(exc, args, args_pos)
{
    args[args_pos] = exc.top;
}

function Ins_CINDEX(exc, args, args_pos)
{
    var L = args[args_pos];

    if (L <= 0 || L > exc.args)
    {
        if (exc.pedantic_hinting)
            exc.error = FT_Common.FT_Err_Invalid_Reference;
        args[args_pos] = 0;
    }
    else
        args[args_pos] = exc.stack[exc.args - L];
}

function Ins_MINDEX(exc, args, args_pos)
{
    var L = args[args_pos];

    if (L <= 0 || L > exc.args)
    {
        if (exc.pedantic_hinting)
            exc.error = FT_Common.FT_Err_Invalid_Reference;
    }
    else
    {
        var K = exc.stack[exc.args - L];

        var _i1 = exc.args - L;
        var _i2 = exc.args - 1;
        for (var i = _i1; i < _i2; i++)
            exc.stack[i] = exc.stack[i + 1];

        exc.stack[exc.args - 1] = K;
    }
}

function Ins_ALIGNPTS(exc, args, args_pos)
{
    var p1 = 0xFFFF & args[args_pos];
    var p2 = 0xFFFF & args[args_pos + 1];

    if ((p1 >= exc.zp1.n_points) || (p2 >= exc.zp0.n_points))
    {
        if (exc.pedantic_hinting)
            exc.error = FT_Common.FT_Err_Invalid_Reference;
        return;
    }

    var v1 = exc.zp0.cur[exc.zp0._offset_cur + p2];
    var v2 = exc.zp1.cur[exc.zp1._offset_cur + p1];

    var distance = exc.func_project(exc, v1.x - v2.x, v1.y - v2.y) >> 1;

    exc.func_move(exc, exc.zp1, p1, distance);
    exc.func_move(exc, exc.zp0, p2, -distance);
}

function Ins_UNKNOWN(exc, args, args_pos)
{
    var defs = exc.IDefs;
    var limit = exc.numIDefs;

    for (var def = 0; def < limit; def++)
    {
        if (defs[def].opc == exc.opcode && defs[def].active)
        {
            if (exc.callTop >= exc.callSize)
            {
                exc.error = FT_Common.FT_Err_Stack_Overflow;
                return;
            }

            var call = exc.callStack[exc.callTop++];

            call.Caller_Range = exc.curRange;
            call.Caller_IP    = exc.IP + 1;
            call.Cur_Count    = 1;
            call.Def = defs[def];

            Ins_Goto_CodeRange(defs[def].range, defs[def].start);

            exc.step_ins = false;
            return;
        }
    }

    exc.error = FT_Common.FT_Err_Invalid_Opcode;
}
function Ins_UTP(exc, args, args_pos)
{
    var point = 0xFFFF & args[args_pos];

    if (point >= exc.zp0.n_points)
    {
        if (exc.pedantic_hinting)
            exc.error = FT_Common.FT_Err_Invalid_Reference;
        return;
    }

    var mask = 0xFF;

    if (exc.GS.freeVector.x != 0)
        mask &= ~FT_Common.FT_CURVE_TAG_TOUCH_X;

    if (exc.GS.freeVector.y != 0)
        mask &= ~FT_Common.FT_CURVE_TAG_TOUCH_Y;

    exc.zp0.tags[exc.zp0._offset_tags + point] &= mask;
}

function Ins_LOOPCALL(exc, args, args_pos)
{
    /* first of all, check the index */
    var F = args[args_pos + 1];
    if (F >= (exc.maxFunc + 1))
    {
        exc.error = FT_Common.FT_Err_Invalid_Reference;
        return;
    }

    /* Except for some old Apple fonts, all functions in a TrueType */
    /* font are defined in increasing order, starting from 0.  This */
    /* means that we normally have                                  */
    /*                                                              */
    /*    CUR.maxFunc+1 == CUR.numFDefs                             */
    /*    CUR.FDefs[n].opc == n for n in 0..CUR.maxFunc             */
    /*                                                              */
    /* If this isn't true, we need to look up the function table.   */
    var defs = exc.FDefs;
    var def = F;
    if (exc.maxFunc + 1 != exc.numFDefs || defs[def].opc != F)
    {
        /* look up the FDefs table */
        def = 0;
        var limit = exc.numFDefs;

        while (def < limit && defs[def].opc != F)
            def++;

        if (def == limit)
        {
            exc.error = FT_Common.FT_Err_Invalid_Reference;
            return;
        }
    }

    /* check that the function is active */
    if (!defs[def].active)
    {
        exc.error = FT_Common.FT_Err_Invalid_Reference;
        return;
    }

    if (exc.face.driver.library.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING)
    {
        if (exc.ignore_x_mode && (defs[def].sph_fdef_flags & FT_Common.SPH_FDEF_VACUFORM_ROUND_1))
            return;

        exc.sph_in_func_flags = defs[def].sph_fdef_flags;
    }

    /* check stack */
    if (exc.callTop >= exc.callSize)
    {
        exc.error = FT_Common.FT_Err_Stack_Overflow;
        return;
    }

    if (args[args_pos] > 0)
    {
        var pCrec = exc.callStack[exc.callTop];

        pCrec.Caller_Range = exc.curRange;
        pCrec.Caller_IP    = exc.IP + 1;
        pCrec.Cur_Count    = args[args_pos];
        pCrec.Def          = defs[def];

        exc.callTop++;

        Ins_Goto_CodeRange(exc, defs[def].range, defs[def].start);
        exc.step_ins = false;
    }
}

function Ins_CALL(exc, args, args_pos)
{
    /* first of all, check the index */
    var F = FT_Common.IntToUInt(args[args_pos]);
    if (F >= (exc.maxFunc + 1))
    {
        exc.error = FT_Common.FT_Err_Invalid_Reference;
        return;
    }

    /* Except for some old Apple fonts, all functions in a TrueType */
    /* font are defined in increasing order, starting from 0.  This */
    /* means that we normally have                                  */
    /*                                                              */
    /*    CUR.maxFunc+1 == CUR.numFDefs                             */
    /*    CUR.FDefs[n].opc == n for n in 0..CUR.maxFunc             */
    /*                                                              */
    /* If this isn't true, we need to look up the function table.   */

    var defs = exc.FDefs;
    var def = F;
    if ((exc.maxFunc + 1) != exc.numFDefs || defs[def].opc != F)
    {
        /* look up the FDefs table */
        def   = 0;
        var limit = exc.numFDefs;

        while (def < limit && defs[def].opc != F)
            def++;

        if (def == limit)
        {
            exc.error = FT_Common.FT_Err_Invalid_Reference;
            return;
        }
    }

    /* check that the function is active */
    if (!defs[def].active)
    {
        exc.error = FT_Common.FT_Err_Invalid_Reference;
        return;
    }

    if (exc.face.driver.library.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING)
    {
        if (exc.ignore_x_mode &&
            ((exc.iup_called && (exc.sph_tweak_flags & FT_Common.SPH_TWEAK_NO_CALL_AFTER_IUP)) ||
                defs[def].sph_fdef_flags & FT_Common.SPH_FDEF_VACUFORM_ROUND_1))
            return;

        exc.sph_in_func_flags = defs[def].sph_fdef_flags;
    }

    /* check the call stack */
    if (exc.callTop >= exc.callSize)
    {
        exc.error = FT_Common.FT_Err_Stack_Overflow;
        return;
    }

    var pCrec = exc.callStack[exc.callTop];

    pCrec.Caller_Range = exc.curRange;
    pCrec.Caller_IP    = exc.IP + 1;
    pCrec.Cur_Count    = 1;
    pCrec.Def = defs[def];

    exc.callTop++;

    Ins_Goto_CodeRange(exc, defs[def].range, defs[def].start);

    exc.step_ins = false;
}

function Ins_FDEF(exc, args, args_pos)
{
    var bIsSubpix = exc.face.driver.library.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING;

    /* some font programs are broken enough to redefine functions! */
    /* We will then parse the current table.                       */
    var defs = exc.FDefs;
    var rec = 0;
    var limit = exc.numFDefs;
    var n = args[args_pos];

    for ( ; rec < limit; rec++)
    {
        if (defs[rec].opc == n)
            break;
    }

    if (rec == limit)
    {
        /* check that there is enough room for new functions */
        if (exc.numFDefs >= exc.maxFDefs)
        {
            exc.error = FT_Common.FT_Err_Too_Many_Function_Defs;
            return;
        }
        exc.numFDefs++;
    }

    /* Although FDEF takes unsigned 32-bit integer,  */
    /* func # must be within unsigned 16-bit integer */
    if (n > 0xFFFF)
    {
        exc.error = FT_Common.FT_Err_Too_Many_Function_Defs;
        return;
    }

    defs[rec].range        = exc.curRange;
    defs[rec].opc          = 0xFFFF & n;
    defs[rec].start        = exc.IP + 1;
    defs[rec].active       = true;
    defs[rec].inline_delta = false;
    defs[rec].sph_fdef_flags = 0x0000;

    if (n > exc.maxFunc)
        exc.maxFunc = 0xFFFF & n;

    if (bIsSubpix)
    {
        /* We don't know for sure these are typeman functions, */
        /* however they are only active when RS 22 is called   */
        if (n >= 64 && n <= 66)
            defs[rec].sph_fdef_flags |= FT_Common.SPH_FDEF_TYPEMAN_STROKES;
    }

    /* Now skip the whole function definition. */
    /* We don't allow nested IDEFS & FDEFs.    */

    while (SkipCode(exc) == 0)
    {
        if (bIsSubpix)//#ifdef TT_CONFIG_OPTION_SUBPIXEL_HINTING
        {
            var opcode_pattern = [
            /* #0 inline delta function 1 */
            [
                0x4B, /* PPEM    */
                0x53, /* GTEQ    */
                0x23, /* SWAP    */
                0x4B, /* PPEM    */
                0x51, /* LTEQ    */
                0x5A, /* AND     */
                0x58, /* IF      */
                0x38, /*   SHPIX */
                0x1B, /* ELSE    */
                0x21, /*   POP   */
                0x21, /*   POP   */
                0x59  /* EIF     */
            ],
            /* #1 inline delta function 2 */
            [
                0x4B, /* PPEM    */
                0x54, /* EQ      */
                0x58, /* IF      */
                0x38, /*   SHPIX */
                0x1B, /* ELSE    */
                0x21, /*   POP   */
                0x21, /*   POP   */
                0x59  /* EIF     */
            ],
            /* #2 diagonal stroke function */
            [
                0x20, /* DUP     */
                0x20, /* DUP     */
                0xB0, /* PUSHB_1 */
                /*   1     */
                0x60, /* ADD     */
                0x46, /* GC_cur  */
                0xB0, /* PUSHB_1 */
                /*   64    */
                0x23, /* SWAP    */
                0x42  /* WS      */
            ],
            /* #3 VacuFormRound function */
            [
                0x45, /* RCVT    */
                0x23, /* SWAP    */
                0x46, /* GC_cur  */
                0x60, /* ADD     */
                0x20, /* DUP     */
                0xB0  /* PUSHB_1 */
                /*   38    */
            ],
            /* #4 TTFautohint bytecode (old) */
            [
                0x20, /* DUP     */
                0x64, /* ABS     */
                0xB0, /* PUSHB_1 */
                /*   32    */
                0x60, /* ADD     */
                0x66, /* FLOOR   */
                0x23, /* SWAP    */
                0xB0  /* PUSHB_1 */
            ],
            /* #5 spacing function 1 */
            [
                0x01, /* SVTCA_x */
                0xB0, /* PUSHB_1 */
                /*   24    */
                0x43, /* RS      */
                0x58  /* IF      */
            ],
            /* #6 spacing function 2 */
            [
                0x01, /* SVTCA_x */
                0x18, /* RTG     */
                0xB0, /* PUSHB_1 */
                /*   24    */
                0x43, /* RS      */
                0x58  /* IF      */
            ],
            /* #7 TypeMan Talk DiagEndCtrl function */
            [
                0x01, /* SVTCA_x */
                0x20, /* DUP     */
                0xB0, /* PUSHB_1 */
                /*   3     */
                0x25, /* CINDEX  */
            ],
            /* #8 TypeMan Talk Align */
            [
                0x06, /* SPVTL   */
                0x7D, /* RDTG    */
            ]
            ];
            var opcode_patterns = opcode_pattern.length;
            var opcode_pointer = [  0, 0, 0, 0, 0, 0, 0, 0, 0 ];
            var opcode_size    = [ 12, 8, 8, 6, 7, 4, 5, 4, 2 ];

            for (var i = 0; i < opcode_patterns; i++)
            {
                if (opcode_pointer[i] < opcode_size[i] && exc.opcode == opcode_pattern[i][opcode_pointer[i]])
                {
                    opcode_pointer[i] += 1;

                    if (opcode_pointer[i] == opcode_size[i])
                    {
                        switch ( i )
                        {
                            case 0:
                                defs[rec].sph_fdef_flags        |= FT_Common.SPH_FDEF_INLINE_DELTA_1;
                                exc.face.sph_found_func_flags   |= FT_Common.SPH_FDEF_INLINE_DELTA_1;
                                break;

                            case 1:
                                defs[rec].sph_fdef_flags        |= FT_Common.SPH_FDEF_INLINE_DELTA_2;
                                exc.face.sph_found_func_flags   |= FT_Common.SPH_FDEF_INLINE_DELTA_2;
                                break;

                            case 2:
                                switch ( n )
                                {
                                    /* needs to be implemented still */
                                    case 58:
                                        defs[rec].sph_fdef_flags        |= FT_Common.SPH_FDEF_DIAGONAL_STROKE;
                                        exc.face.sph_found_func_flags   |= FT_Common.SPH_FDEF_DIAGONAL_STROKE;
                                }
                                break;

                            case 3:
                                switch ( n )
                                {
                                    case 0:
                                        defs[rec].sph_fdef_flags        |= FT_Common.SPH_FDEF_VACUFORM_ROUND_1;
                                        exc.face.sph_found_func_flags   |= FT_Common.SPH_FDEF_VACUFORM_ROUND_1;
                                }
                                break;

                            case 4:
                                /* probably not necessary to detect anymore */
                                defs[rec].sph_fdef_flags            |= FT_Common.SPH_FDEF_TTFAUTOHINT_1;
                                exc.face.sph_found_func_flags       |= FT_Common.SPH_FDEF_TTFAUTOHINT_1;
                                break;

                            case 5:
                                switch ( n )
                                {
                                    case 0:
                                    case 1:
                                    case 2:
                                    case 4:
                                    case 7:
                                    case 8:
                                        defs[rec].sph_fdef_flags        |= FT_Common.SPH_FDEF_SPACING_1;
                                        exc.face.sph_found_func_flags   |= FT_Common.SPH_FDEF_SPACING_1;
                                }
                                break;

                            case 6:
                                switch ( n )
                                {
                                    case 0:
                                    case 1:
                                    case 2:
                                    case 4:
                                    case 7:
                                    case 8:
                                        defs[rec].sph_fdef_flags        |= FT_Common.SPH_FDEF_SPACING_2;
                                        exc.face.sph_found_func_flags   |= FT_Common.SPH_FDEF_SPACING_2;
                                }
                                break;

                            case 7:
                                defs[rec].sph_fdef_flags        |= FT_Common.SPH_FDEF_TYPEMAN_DIAGENDCTRL;
                                exc.face.sph_found_func_flags   |= FT_Common.SPH_FDEF_TYPEMAN_DIAGENDCTRL;
                                break;

                            case 8:
                                //defs[rec].sph_fdef_flags        |= FT_Common.SPH_FDEF_TYPEMAN_DIAGENDCTRL;
                                //exc.face.sph_found_func_flags   |= FT_Common.SPH_FDEF_TYPEMAN_DIAGENDCTRL;
                                break;
                        }
                        opcode_pointer[i] = 0;
                    }
                }
                else
                    opcode_pointer[i] = 0;
            }

            /* Set sph_compatibility_mode only when deltas are detected */
            exc.face.sph_compatibility_mode = ((exc.face.sph_found_func_flags & FT_Common.SPH_FDEF_INLINE_DELTA_1) |
                                                (exc.face.sph_found_func_flags & FT_Common.SPH_FDEF_INLINE_DELTA_2));
        } //#endif /* TT_CONFIG_OPTION_SUBPIXEL_HINTING */

        switch (exc.opcode)
        {
        case 0x89:    /* IDEF */
        case 0x2C:    /* FDEF */
            exc.error = FT_Common.FT_Err_Nested_DEFS;
            return;
        case 0x2D:   /* ENDF */
            defs[rec].end = exc.IP;
            return;
        default:
            break;
        }
    }
}

function Ins_ENDF(exc, args, args_pos)
{
    var bIsSubpix = exc.face.driver.library.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING;
    if (bIsSubpix)
        exc.sph_in_func_flags = 0x0000;

    if (exc.callTop <= 0)     /* We encountered an ENDF without a call */
    {
        exc.error = FT_Common.FT_Err_ENDF_In_Exec_Stream;
        return;
    }

    exc.callTop--;
    var pRec = exc.callStack[exc.callTop];

    pRec.Cur_Count--;
    exc.step_ins = false;

    if (pRec.Cur_Count > 0)
    {
        exc.callTop++;
        exc.IP = pRec.Def.start;
    }
    else
    {
        /* Loop through the current function */
        Ins_Goto_CodeRange(exc, pRec.Caller_Range, pRec.Caller_IP);
    }

    /* Exit the current call frame.                      */

    /* NOTE: If the last instruction of a program is a   */
    /*       CALL or LOOPCALL, the return address is     */
    /*       always out of the code range.  This is a    */
    /*       valid address, and it is why we do not test */
    /*       the result of Ins_Goto_CodeRange() here!    */
}

function Ins_MDAP(exc, args, args_pos)
{
    var point = 0xFFFF & args[args_pos];

    if (point >= exc.zp0.n_points)
    {
        if (exc.pedantic_hinting)
            exc.error = FT_Common.FT_Err_Invalid_Reference;
        return;
    }

    var distance = 0;
    if ((exc.opcode & 1) != 0)
    {
        var cur_dist = exc.func_project(exc, exc.zp0.cur[exc.zp0._offset_cur + point].x, exc.zp0.cur[exc.zp0._offset_cur + point].y);
        var bIsSubpix = exc.face.driver.library.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING;

        if (bIsSubpix)
        {
            if (exc.ignore_x_mode && exc.GS.freeVector.x != 0)
            {
                distance = Round_None(exc, cur_dist, exc.tt_metrics.compensations[0]) - cur_dist;
            }
            else
            {
                distance = exc.func_round(exc, cur_dist, exc.tt_metrics.compensations[0]) - cur_dist;
            }
        }
        else
        {
            distance = exc.func_round(exc, cur_dist, exc.tt_metrics.compensations[0]) - cur_dist;
        }
    }

    exc.func_move(exc, exc.zp0, point, distance);

    exc.GS.rp0 = point;
    exc.GS.rp1 = point;
}

// --
function IUP_WorkerRec()
{
    this.orgs = null;   /* original and current coordinate */
    this.curs = null;   /* arrays                          */
    this.orus = null;

    this.off_orgs = 0;
    this.off_curs = 0;
    this.off_orus = 0;

    this.max_points = 0;
    this.is_offset_one = false;
}

function _iup_worker_shift(worker, p1, p2, p)
{
    if (!worker.is_offset_one)
    {
        var dx = worker.curs[worker.off_curs + p].x - worker.orgs[worker.off_orgs + p].x;
        if (dx != 0)
        {
            for (var i = p1; i < p; i++)
                worker.curs[worker.off_curs + i].x += dx;

            for (var i = p + 1; i <= p2; i++)
                worker.curs[worker.off_curs + i].x += dx;
        }
    }
    else
    {
        var dy = worker.curs[worker.off_curs + p].y - worker.orgs[worker.off_orgs + p].y;
        if (dy != 0)
        {
            for (var i = p1; i < p; i++)
                worker.curs[worker.off_curs + i].y += dy;

            for (var i = p + 1; i <= p2; i++)
                worker.curs[worker.off_curs + i].y += dy;
        }
    }
}

function _iup_worker_interpolate(worker, p1, p2, ref1, ref2)
{
    if (!worker.is_offset_one)
    {
        if (p1 > p2)
            return;

        if ((ref1 >= worker.max_points) || (ref2 >= worker.max_points))
            return;

        var orus1 = worker.orus[worker.off_orus + ref1].x;
        var orus2 = worker.orus[worker.off_orus + ref2].x;

        if (orus1 > orus2)
        {
            var tmp_o = orus1;
            orus1 = orus2;
            orus2 = tmp_o;

            var tmp_r = ref1;
            ref1  = ref2;
            ref2  = tmp_r;
        }

        var org1   = worker.orgs[worker.off_orgs + ref1].x;
        var org2   = worker.orgs[worker.off_orgs + ref2].x;
        var delta1 = worker.curs[worker.off_curs + ref1].x - org1;
        var delta2 = worker.curs[worker.off_curs + ref2].x - org2;

        if (orus1 == orus2)
        {
            /* simple shift of untouched points */
            for (var i = p1; i <= p2; i++)
            {
                var x = worker.orgs[worker.off_orgs + i].x;
                if ( x <= org1 )
                    x += delta1;
                else
                    x += delta2;

                worker.curs[worker.off_curs + i].x = x;
            }
        }
        else
        {
            var scale = 0;
            var scale_valid = 0;

            /* interpolation */
            for (var i = p1; i <= p2; i++)
            {
                var x = worker.orgs[worker.off_orgs + i].x;

                if ( x <= org1 )
                    x += delta1;
                else if ( x >= org2 )
                    x += delta2;
                else
                {
                    if ( !scale_valid )
                    {
                        scale_valid = 1;
                        scale = FT_DivFix(org2 + delta2 - (org1 + delta1), orus2 - orus1);
                    }

                    x = (org1 + delta1) + FT_MulFix(worker.orus[worker.off_orus + i].x - orus1, scale);
                }
                worker.curs[worker.off_curs + i].x = x;
            }
        }
    }
    else
    {
        if (p1 > p2)
            return;

        if ((ref1 >= worker.max_points) || (ref2 >= worker.max_points))
            return;

        var orus1 = worker.orus[worker.off_orus + ref1].y;
        var orus2 = worker.orus[worker.off_orus + ref2].y;

        if (orus1 > orus2)
        {
            var tmp_o = orus1;
            orus1 = orus2;
            orus2 = tmp_o;

            var tmp_r = ref1;
            ref1  = ref2;
            ref2  = tmp_r;
        }

        var org1   = worker.orgs[worker.off_orgs + ref1].y;
        var org2   = worker.orgs[worker.off_orgs + ref2].y;
        var delta1 = worker.curs[worker.off_curs + ref1].y - org1;
        var delta2 = worker.curs[worker.off_curs + ref2].y - org2;

        if (orus1 == orus2)
        {
            /* simple shift of untouched points */
            for (var i = p1; i <= p2; i++)
            {
                var y = worker.orgs[worker.off_orgs + i].y;
                if (y <= org1)
                    y += delta1;
                else
                    y += delta2;

                worker.curs[worker.off_curs + i].y = y;
            }
        }
        else
        {
            var scale = 0;
            var scale_valid = 0;

            /* interpolation */
            for (var i = p1; i <= p2; i++)
            {
                var y = worker.orgs[worker.off_orgs + i].y;

                if (y <= org1)
                    y += delta1;
                else if (y >= org2)
                    y += delta2;
                else
                {
                    if ( !scale_valid )
                    {
                        scale_valid = 1;
                        scale = FT_DivFix(org2 + delta2 - (org1 + delta1), orus2 - orus1);
                    }

                    y = (org1 + delta1) + FT_MulFix(worker.orus[worker.off_orus + i].y - orus1, scale);
                }
                worker.curs[worker.off_curs + i].y = y;
            }
        }
    }
}
// --

function Ins_IUP(exc, args, args_pos)
{
    var mask;

    /* ignore empty outlines */
    if (exc.pts.n_contours == 0)
        return;

    var V = new IUP_WorkerRec();
    if (exc.opcode & 1)
    {
        mask   = FT_Common.FT_CURVE_TAG_TOUCH_X;
        V.orgs = exc.pts.org;
        V.curs = exc.pts.cur;
        V.orus = exc.pts.orus;

        V.off_orgs = exc.pts._offset_org;
        V.off_curs = exc.pts._offset_cur;
        V.off_orus = exc.pts._offset_orus;
    }
    else
    {
        mask = FT_Common.FT_CURVE_TAG_TOUCH_Y;

        V.orgs = exc.pts.org;
        V.curs = exc.pts.cur;
        V.orus = exc.pts.orus;

        V.off_orgs = exc.pts._offset_org;
        V.off_curs = exc.pts._offset_cur;
        V.off_orus = exc.pts._offset_orus;
        V.is_offset_one = true;
    }
    V.max_points = exc.pts.n_points;

    var contour = 0;
    var point   = 0;

    if (exc.face.driver.library.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING) // #ifdef TT_CONFIG_OPTION_SUBPIXEL_HINTING
    {
        if (exc.ignore_x_mode)
        {
            exc.iup_called = 1;
            if (exc.sph_tweak_flags & FT_Common.SPH_TWEAK_SKIP_IUP)
                return;
        }
    } //#endif /* TT_CONFIG_OPTION_SUBPIXEL_HINTING */

    do
    {
        var end_point   = exc.pts.contours[exc.pts._offset_contours + contour] - exc.pts.first_point;
        var first_point = point;

        if (end_point >= exc.pts.n_points)
            end_point = exc.pts.n_points - 1;

        while (point <= end_point && (exc.pts.tags[exc.pts._offset_tags + point] & mask) == 0)
            point++;

        if ( point <= end_point )
        {
            var first_touched = point;
            var cur_touched   = point;

            point++;

            while ( point <= end_point )
            {
                if ((exc.pts.tags[exc.pts._offset_tags + point] & mask) != 0)
                {
                    _iup_worker_interpolate(V, cur_touched + 1, point - 1, cur_touched, point);
                    cur_touched = point;
                }

                point++;
            }

            if (cur_touched == first_touched)
                _iup_worker_shift(V, first_point, end_point, cur_touched);
            else
            {
                _iup_worker_interpolate(V, 0xFFFF & (cur_touched + 1), end_point, cur_touched, first_touched);

                if (first_touched > 0)
                    _iup_worker_interpolate(V, first_point, first_touched - 1, cur_touched, first_touched);
            }
        }
        contour++;
    } while (contour < exc.pts.n_contours);
}

function Ins_SHP(exc, args, args_pos)
{
    if (exc.top < exc.GS.loop)
    {
        if (exc.pedantic_hinting)
            exc.error = FT_Common.FT_Err_Invalid_Reference;

        exc.GS.loop = 1;
        exc.new_top = exc.args;
    }

    var zp = new TT_GlyphZoneRec();

    var dx, dy, refp;
    var ret = Compute_Point_Displacement(exc, dx, dy, zp, refp);
    if (ret.err == 1)
        return;

    dx = ret.x;
    dy = ret.y;
    refp = ret.refp;
    while (exc.GS.loop > 0)
    {
        exc.args--;
        var point = 0xFFFF & exc.stack[exc.args];

        if (point >= exc.zp2.n_points)
        {
            if (exc.pedantic_hinting)
            {
                exc.error = FT_Common.FT_Err_Invalid_Reference;
                return;
            }
        }
        else
        {
            if (exc.face.driver.library.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING)
            {
                if (exc.ignore_x_mode)
                    Move_Zp2_Point(exc, point, 0, dy, true);
                else
                    Move_Zp2_Point(exc, point, dx, dy, true);
            }
            else
                Move_Zp2_Point(exc, point, dx, dy, true);
        }

        exc.GS.loop--;
    }

    exc.GS.loop = 1;
    exc.new_top = exc.args;
}

function Ins_SHC(exc, args, args_pos)
{
    var contour = 0xFFFF & args[args_pos];
    var bounds  = (exc.GS.gep2 == 0) ? 1 : exc.zp2.n_contours;

    if (contour >= bounds)
    {
        if (exc.pedantic_hinting)
            exc.error = FT_Common.FT_Err_Invalid_Reference;
        return;
    }

    var zp = new TT_GlyphZoneRec();

    var dx, dy, refp;
    var ret = Compute_Point_Displacement(exc, dx, dy, zp, refp);
    if (ret.err == 1)
        return;

    dx = ret.x;
    dy = ret.y;
    refp = ret.refp;

    var start, limit;
    if (contour == 0)
        start = 0;
    else
        start = 0xFFFF & (exc.zp2.contours[exc.zp2._offset_contours + contour - 1] + 1 - exc.zp2.first_point);

    /* we use the number of points if in the twilight zone */
    if (exc.GS.gep2 == 0)
        limit = exc.zp2.n_points;
    else
        limit = 0xFFFF & (exc.zp2.contours[exc.zp2._offset_contours + contour] - exc.zp2.first_point + 1);

    for (var i = start; i < limit; i++)
    {
        if ((zp.cur != exc.zp2.cur || zp._offset_cur != exc.zp2._offset_cur) || refp != i)
            Move_Zp2_Point(exc, i, dx, dy, true);
    }
}

function Ins_SHZ(exc, args, args_pos)
{
    if (args[args_pos] >= 2)
    {
        if (exc.pedantic_hinting)
            exc.error = FT_Common.FT_Err_Invalid_Reference;
        return;
    }

    var zp = new TT_GlyphZoneRec();

    var dx, dy, refp;
    var ret = Compute_Point_Displacement(exc, dx, dy, zp, refp);
    if (ret.err == 1)
        return;

    dx = ret.x;
    dy = ret.y;
    refp = ret.refp;

    /* XXX: UNDOCUMENTED! SHZ doesn't move the phantom points.     */
    /*      Twilight zone has no real contours, so use `n_points'. */
    /*      Normal zone's `n_points' includes phantoms, so must    */
    /*      use end of last contour.                               */
    var limit = 0;
    if (exc.GS.gep2 == 0)
        limit = 0xFFFF & exc.zp2.n_points;
    else if (exc.GS.gep2 == 1 && exc.zp2.n_contours > 0)
        limit = 0xFFFF & (exc.zp2.contours[exc.zp2._offset_contours + exc.zp2.n_contours - 1] + 1);

    /* XXX: UNDOCUMENTED! SHZ doesn't touch the points */
    for (var i = 0; i < limit; i++)
    {
        if ((zp.cur != exc.zp2.cur || zp._offset_cur != exc.zp2._offset_cur) || refp != i)
            Move_Zp2_Point(exc, i, dx, dy, false);
    }
}

function Ins_SHPIX(exc, args, args_pos)
{
    if (exc.top < (exc.GS.loop + 1))
    {
        if (exc.pedantic_hinting)
            exc.error = FT_Common.FT_Err_Invalid_Reference;

        exc.GS.loop = 1;
        exc.new_top = exc.args;
        return;
    }

    // TODO: unpatented
    var dx = TT_MulFix14(args[args_pos], exc.GS.freeVector.x);
    var dy = TT_MulFix14(args[args_pos], exc.GS.freeVector.y);

    while (exc.GS.loop > 0)
    {
        exc.args--;
        var point = 0xFFFF & exc.stack[exc.args];

        if (point >= exc.zp2.n_points)
        {
            if (exc.pedantic_hinting)
            {
                exc.error = FT_Common.FT_Err_Invalid_Reference;
                return;
            }
        }
        else
        {
            if (!exc.face.driver.library.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING)
            {
                Move_Zp2_Point(exc, point, dx, dy, true);
                exc.GS.loop -= 1;
                continue;
            }

            var B1, B2;
            if (exc.ignore_x_mode)
            {
                /* save point for later comparison */
                if (exc.GS.freeVector.y != 0)
                    B1 = exc.zp2.cur[exc.zp2._offset_cur + point].y;
                else
                    B1 = exc.zp2.cur[exc.zp2._offset_cur + point].x;

                if (!exc.face.sph_compatibility_mode && exc.GS.freeVector.y != 0)
                {
                    Move_Zp2_Point(exc, point, dx, dy, true);

                    /* save new point */
                    if (exc.GS.freeVector.y != 0)
                    {
                        B2 = exc.zp2.cur[exc.zp2._offset_cur + point].y;

                        /* reverse any disallowed moves */
                        if ((exc.sph_tweak_flags & FT_Common.SPH_TWEAK_SKIP_NONPIXEL_Y_MOVES) &&
                            (B1 & 63) != 0 &&
                            (B2 & 63) != 0 &&
                            B1 != B2)
                            Move_Zp2_Point(exc, point, -dx, -dy, true);
                    }
                }
                else if (exc.face.sph_compatibility_mode)
                {
                    if (exc.sph_tweak_flags & FT_Common.SPH_TWEAK_ROUND_NONPIXEL_Y_MOVES)
                    {
                        dx = FT_PIX_ROUND(B1 + dx) - B1;
                        dy = FT_PIX_ROUND(B1 + dy) - B1;
                    }

                    /* skip post-iup deltas */
                    if (exc.iup_called &&
                        ((exc.sph_in_func_flags & FT_Common.SPH_FDEF_INLINE_DELTA_1) ||
                        (exc.sph_in_func_flags & FT_Common.SPH_FDEF_INLINE_DELTA_2)))
                    {
                        exc.GS.loop -= 1;
                        continue;
                    }

                    if (!(exc.sph_tweak_flags & FT_Common.SPH_TWEAK_ALWAYS_SKIP_DELTAP) &&
                        ((exc.is_composite && exc.GS.freeVector.y != 0) ||
                        (exc.zp2.tags[exc.zp2._offset_tags + point] & FT_Common.FT_CURVE_TAG_TOUCH_Y) ||
                        (exc.sph_tweak_flags & FT_Common.SPH_TWEAK_DO_SHPIX)))
                        Move_Zp2_Point(exc, point, 0, dy, true);

                    /* save new point */
                    if (exc.GS.freeVector.y != 0)
                    {
                        B2 = exc.zp2.cur[exc.zp2._offset_cur + point].y;

                        /* reverse any disallowed moves */
                        if ((B1 & 63) == 0 &&
                            (B2 & 63) != 0 &&
                            B1 != B2)
                            Move_Zp2_Point(exc, point, 0, -dy, true);
                    }
                }
                else if (exc.sph_in_func_flags & FT_Common.SPH_FDEF_TYPEMAN_DIAGENDCTRL)
                    Move_Zp2_Point(exc, point, dx, dy, true);
            }
            else
                Move_Zp2_Point(exc, point, dx, dy, true);

            exc.GS.loop--;
        }
    }

    exc.GS.loop = 1;
    exc.new_top = exc.args;
}

function Ins_IP(exc, args, args_pos)
{
    if (exc.top < exc.GS.loop)
    {
        if (exc.pedantic_hinting)
            exc.error = FT_Common.FT_Err_Invalid_Reference;

        exc.GS.loop = 1;
        exc.new_top = exc.args;
        return;
    }

    /*
     * We need to deal in a special way with the twilight zone.
     * Otherwise, by definition, the value of CUR.twilight.orus[n] is (0,0),
     * for every n.
     */
    var twilight = (exc.GS.gep0 == 0 || exc.GS.gep1 == 0 || exc.GS.gep2 == 0) ? 1 : 0;

    if (exc.GS.rp1 >= exc.zp0.n_points)
    {
        if (exc.pedantic_hinting)
            exc.error = FT_Common.FT_Err_Invalid_Reference;

        exc.GS.loop = 1;
        exc.new_top = exc.args;
        return;
    }

    var orus_base = null;
    var orus_base_off = 0;
    if (twilight)
    {
        orus_base = exc.zp0.org;
        orus_base_off = exc.zp0._offset_org + exc.GS.rp1;
    }
    else
    {
        orus_base = exc.zp0.orus;
        orus_base_off = exc.zp0._offset_orus + exc.GS.rp1;
    }

    var cur_base = exc.zp0.cur;
    var cur_base_off = exc.zp0._offset_cur + exc.GS.rp1;

    var old_range = 0;
    var cur_range = 0;

    /* XXX: There are some glyphs in some braindead but popular */
    /*      fonts out there (e.g. [aeu]grave in monotype.ttf)   */
    /*      calling IP[] with bad values of rp[12].             */
    /*      Do something sane when this odd thing happens.      */
    if ((exc.GS.rp1 >= exc.zp0.n_points) || (exc.GS.rp2 >= exc.zp1.n_points))
    {
        old_range = 0;
        cur_range = 0;
    }
    else
    {
        var v1, v2;
        if (twilight != 0)
        {
            v1 = exc.zp1.org[exc.zp1._offset_org + exc.GS.rp2];
            v2 = orus_base[orus_base_off];
            old_range = exc.func_dualproj(exc, v1.x - v2.x, v1.y - v2.y);
        }
        else if (exc.metrics.x_scale == exc.metrics.y_scale)
        {
            v1 = exc.zp1.orus[exc.zp1._offset_orus + exc.GS.rp2];
            v2 = orus_base[orus_base_off];
            old_range = exc.func_dualproj(exc, v1.x - v2.x, v1.y - v2.y);
        }
        else
        {
            v1 = exc.zp1.orus[exc.zp1._offset_orus + exc.GS.rp2];
            v2 = orus_base[orus_base_off];

            var _x = FT_MulFix(v1.x - v2.x, exc.metrics.x_scale);
            var _y = FT_MulFix(v1.y - v2.y, exc.metrics.y_scale);

            old_range = exc.func_dualproj(exc, _x, _y);
        }

        v1 = exc.zp1.cur[exc.zp1._offset_cur + exc.GS.rp2];
        v2 = cur_base[cur_base_off];

        cur_range = exc.func_project(exc, v1.x - v2.x, v1.y - v2.y);
    }

    for ( ; exc.GS.loop > 0; --exc.GS.loop )
    {
        var point = exc.stack[--exc.args];
        var org_dist, cur_dist, new_dist;

        /* check point bounds */
        if (point >= exc.zp2.n_points)
        {
            if (exc.pedantic_hinting)
            {
                exc.error = FT_Common.FT_Err_Invalid_Reference;
                return;
            }
            continue;
        }

        var v1, v2;
        if (twilight)
        {
            v1 = exc.zp2.org[exc.zp2._offset_org + point];
            v2 = orus_base[orus_base_off];
            org_dist = exc.func_dualproj(exc, v1.x - v2.x, v1.y - v2.y);
        }
        else if ( exc.metrics.x_scale == exc.metrics.y_scale )
        {
            v1 = exc.zp2.orus[exc.zp2._offset_orus + point];
            v2 = orus_base[orus_base_off];
            org_dist = exc.func_dualproj(exc, v1.x - v2.x, v1.y - v2.y);
        }
        else
        {
            v1 = exc.zp2.orus[exc.zp2._offset_orus + point];
            v2 = orus_base[orus_base_off];

            var _x = FT_MulFix(v1.x - v2.x, exc.metrics.x_scale);
            var _y = FT_MulFix(v1.y - v2.y, exc.metrics.y_scale);

            org_dist = exc.func_dualproj(exc, _x, _y);
        }

        v1 = exc.zp2.cur[exc.zp2._offset_cur + point];
        v2 = cur_base[cur_base_off];
        cur_dist = exc.func_project(exc, v1.x - v2.x, v1.y - v2.y);

        if (org_dist != 0)
        {
            if (old_range != 0)
                new_dist = FT_MulDiv(org_dist, cur_range, old_range);
            else
            {
                /* This is the same as what MS does for the invalid case:  */
                /*                                                         */
                /*   delta = (Original_Pt - Original_RP1) -                */
                /*           (Current_Pt - Current_RP1)                    */
                /*                                                         */
                /* In FreeType speak:                                      */
                /*                                                         */
                /*   new_dist = cur_dist -                                 */
                /*              org_dist - cur_dist;                       */

                new_dist = -org_dist;
            }
        }
        else
            new_dist = 0;

        exc.func_move(exc, exc.zp2, 0xFFFF & point, new_dist - cur_dist);
    }

    exc.GS.loop = 1;
    exc.new_top = exc.args;
}

function Ins_MSIRP(exc, args, args_pos)
{
    var control_value_cutin = 0;

    if (exc.face.driver.library.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING)
    {
        control_value_cutin = exc.GS.control_value_cutin;
        if (exc.ignore_x_mode && exc.GS.freeVector.x != 0 && ((exc.sph_tweak_flags & FT_Common.SPH_TWEAK_NORMAL_ROUND) == 0))
            control_value_cutin = 0;
    }

    var point = 0xFFFF & args[args_pos];

    if ((point >= exc.zp1.n_points) || (exc.GS.rp0 >= exc.zp0.n_points))
    {
        if (exc.pedantic_hinting)
            exc.error = FT_Common.FT_Err_Invalid_Reference;
        return;
    }

    /* UNDOCUMENTED!  The MS rasterizer does that with */
    /* twilight points (confirmed by Greg Hitchcock)   */
    if (exc.GS.gep1 == 0)
    {
        copy_vector(exc.zp1.org[exc.zp1._offset_org + point], exc.zp0.org[exc.zp0._offset_org + exc.GS.rp0]);
        exc.func_move_orig(exc, exc.zp1, point, args[args_pos + 1]);
        copy_vector(exc.zp1.cur[exc.zp1._offset_cur + point], exc.zp1.org[exc.zp1._offset_org + point]);
    }

    var v1 = exc.zp1.cur[exc.zp1._offset_cur + point];
    var v2 = exc.zp0.cur[exc.zp0._offset_cur + exc.GS.rp0];
    var distance = exc.func_project(exc, v1.x - v2.x, v1.y - v2.y);

    if (exc.face.driver.library.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING) // #ifdef TT_CONFIG_OPTION_SUBPIXEL_HINTING
    {
        if (exc.ignore_x_mode && exc.GS.freeVector.x != 0 && (Math.abs(distance - args[args_pos + 1]) >= control_value_cutin))
            distance = args[args_pos + 1];
    } // #endif

    exc.func_move(exc, exc.zp1, point, args[args_pos + 1] - distance);

    exc.GS.rp1 = exc.GS.rp0;
    exc.GS.rp2 = point;

    if ((exc.opcode & 1 ) != 0)
        exc.GS.rp0 = point;
}

function Ins_ALIGNRP(exc, args, args_pos)
{
    if (exc.face.driver.library.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING)//#ifdef TT_CONFIG_OPTION_SUBPIXEL_HINTING
    {
        if (exc.ignore_x_mode && exc.iup_called && (exc.sph_tweak_flags & FT_Common.SPH_TWEAK_NO_ALIGNRP_AFTER_IUP) != 0)
        {
            exc.error = FT_Common.FT_Err_Invalid_Reference;
            exc.GS.loop = 1;
            exc.new_top = exc.args;
            return;
        }
    } // #endif

    if (exc.top < exc.GS.loop || (exc.GS.rp0 >= exc.zp0.n_points))
    {
        if (exc.pedantic_hinting)
            exc.error = FT_Common.FT_Err_Invalid_Reference;

        exc.GS.loop = 1;
        exc.new_top = exc.args;
        return;
    }

    while (exc.GS.loop > 0)
    {
        exc.args--;
        var point = 0xFFFF & exc.stack[exc.args];

        if (point >= exc.zp1.n_points)
        {
            if (exc.pedantic_hinting)
            {
                exc.error = FT_Common.FT_Err_Invalid_Reference;
                return;
            }
        }
        else
        {
            var v1 = exc.zp1.cur[exc.zp1._offset_cur + point];
            var v2 = exc.zp0.cur[exc.zp0._offset_cur + exc.GS.rp0];
            var distance = exc.func_project(exc, v1.x - v2.x, v1.y - v2.y);

            exc.func_move(exc, exc.zp1, point, -distance);
        }
        exc.GS.loop--;
    }

    exc.GS.loop = 1;
    exc.new_top = exc.args;
}

function Ins_RTDG(exc, args, args_pos)
{
    exc.GS.round_state = TT_Round_To_Double_Grid;
    exc.func_round = Round_To_Double_Grid;
}

function Ins_MIAP(exc, args, args_pos)
{
    var control_value_cutin = exc.GS.control_value_cutin;
    var cvtEntry            = FT_Common.IntToUInt(args[args_pos + 1]);
    var point               = 0xFFFF & args[args_pos];

    var bIsSubpix = exc.face.driver.library.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING;
    if (bIsSubpix) // #ifdef TT_CONFIG_OPTION_SUBPIXEL_HINTING
    {
        if (exc.ignore_x_mode && exc.GS.freeVector.x != 0 && exc.GS.freeVector.y == 0 && (exc.sph_tweak_flags & FT_Common.SPH_TWEAK_NORMAL_ROUND) == 0)
            control_value_cutin = 0;
    } // #endif

    if ((point >= exc.zp0.n_points) || (cvtEntry >= exc.cvtSize))
    {
        if (exc.pedantic_hinting)
            exc.error = FT_Common.FT_Err_Invalid_Reference;

        exc.GS.rp0 = point;
        exc.GS.rp1 = point;
        return;
    }

    /* UNDOCUMENTED!                                                      */
    /*                                                                    */
    /* The behaviour of an MIAP instruction is quite different when used  */
    /* in the twilight zone.                                              */
    /*                                                                    */
    /* First, no control value cut-in test is performed as it would fail  */
    /* anyway.  Second, the original point, i.e. (org_x,org_y) of         */
    /* zp0.point, is set to the absolute, unrounded distance found in the */
    /* CVT.                                                               */
    /*                                                                    */
    /* This is used in the CVT programs of the Microsoft fonts Arial,     */
    /* Times, etc., in order to re-adjust some key font heights.  It      */
    /* allows the use of the IP instruction in the twilight zone, which   */
    /* otherwise would be invalid according to the specification.         */
    /*                                                                    */
    /* We implement it with a special sequence for the twilight zone.     */
    /* This is a bad hack, but it seems to work.                          */
    /*                                                                    */
    /* Confirmed by Greg Hitchcock.                                       */

    var distance = exc.func_read_cvt(exc, cvtEntry);

    if (exc.GS.gep0 == 0)   /* If in twilight zone */
    {
        if (!bIsSubpix)
        {
            exc.zp0.org[exc.zp0._offset_org + point].x = TT_MulFix14(distance, exc.GS.freeVector.x);
        }

        exc.zp0.org[exc.zp0._offset_org + point].y = TT_MulFix14(distance, exc.GS.freeVector.y),
        exc.zp0.cur[exc.zp0._offset_cur + point].x = exc.zp0.org[exc.zp0._offset_org + point].x;
        exc.zp0.cur[exc.zp0._offset_cur + point].y = exc.zp0.org[exc.zp0._offset_org + point].y;
    }

    if (bIsSubpix)
    {
        if (exc.ignore_x_mode && (exc.sph_tweak_flags & FT_Common.SPH_TWEAK_MIAP_HACK) != 0 && distance > 0 && exc.GS.freeVector.y != 0)
            distance = 0;
    }

    var v = exc.zp0.cur[exc.zp0._offset_cur + point];
    var org_dist = exc.func_project(exc, v.x, v.y);

    if ((exc.opcode & 1) != 0)   /* rounding and control cut-in flag */
    {
        if (Math.abs(distance - org_dist) > control_value_cutin)
            distance = org_dist;

        if (bIsSubpix)
        {
            if (exc.ignore_x_mode && exc.GS.freeVector.x != 0)
                distance = Round_None(exc, distance, exc.tt_metrics.compensations[0]);
            else
                distance = exc.func_round(exc, distance, exc.tt_metrics.compensations[0]);
        }
        else
        {
            distance = exc.func_round(exc, distance, exc.tt_metrics.compensations[0]);
        }
    }

    exc.func_move(exc, exc.zp0, point, distance - org_dist);
    
    exc.GS.rp0 = point;
    exc.GS.rp1 = point;
}

function Ins_NPUSHB(exc, args, args_pos)
{
    var L = exc.code.data[exc.code.pos + exc.IP + 1];

    if (L >= (exc.stackSize + 1 - exc.top))
    {
        exc.error = FT_Common.FT_Err_Stack_Overflow;
        return;
    }

    for (var K = 1; K <= L; K++)
        args[args_pos + K - 1] = exc.code.data[exc.code.pos + exc.IP + K + 1];

    exc.new_top += L;
}

// --
function GetShortIns(exc)
{
    /* Reading a byte stream so there is no endianess (DaveP) */
    exc.IP += 2;
    return FT_Common.UShort_To_Short((exc.code.data[exc.code.pos + exc.IP - 2] << 8) + exc.code.data[exc.code.pos + exc.IP - 1]);
}
// --

function Ins_NPUSHW(exc, args, args_pos)
{
    var L = exc.code.data[exc.code.pos + exc.IP + 1];

    if (L >=  (exc.stackSize + 1 - exc.top))
    {
        exc.error = FT_Common.FT_Err_Stack_Overflow;
        return;
    }

    exc.IP += 2;

    for (var K = 0; K < L; K++)
        args[args_pos + K] = GetShortIns(exc);

    exc.step_ins = false;
    exc.new_top += L;
}

function Ins_WS(exc, args, args_pos)
{
    var I = args[args_pos];
    if (I >= exc.storeSize)
    {
        if (exc.pedantic_hinting)
        {
            exc.error = FT_Common.FT_Err_Invalid_Reference;
            return;
        }
    }
    else
        exc.storage[I] = args[args_pos + 1];
}

function Ins_RS(exc, args, args_pos)
{
    if (exc.face.driver.library.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING)
    {
        var I = FT_Common.IntToUInt(args[args_pos]);
        if (I >= exc.storeSize)
        {
            if (exc.pedantic_hinting)
            {
                exc.error = FT_Common.FT_Err_Invalid_Reference;
                return;
            }
            else
                args[args_pos] = 0;
        }
        else
        {
            /* subpixel hinting - avoid Typeman Dstroke and */
            /* IStroke and Vacuform rounds                  */

            if (exc.compatibility_mode &&
                ((I == 24) && (exc.face.sph_found_func_flags & (FT_Common.SPH_FDEF_SPACING_1 | FT_Common.SPH_FDEF_SPACING_2))) ||
                ((I == 22) && (exc.sph_in_func_flags & FT_Common.SPH_FDEF_TYPEMAN_STROKES)) ||
                ((I == 8) && (exc.face.sph_found_func_flags & FT_Common.SPH_FDEF_VACUFORM_ROUND_1) && exc.iup_called))
                args[args_pos] = 0;
            else
                args[args_pos] = exc.storage[I];
        }
    }
    else
    {
        var I = FT_Common.IntToUInt(args[args_pos]);

        if (I >= exc.storeSize)
        {
            if (exc.pedantic_hinting)
            {
                exc.error = FT_Common.FT_Err_Invalid_Reference;
                return;
            }
            else
                args[args_pos] = 0;
        }
        else
            args[args_pos] = exc.storage[I];
    }
}

function Ins_WCVTP(exc, args, args_pos)
{
    var I = args[args_pos];
    if (I >= exc.cvtSize)
    {
        if (exc.pedantic_hinting)
        {
            exc.error = FT_Common.FT_Err_Invalid_Reference;
            return;
        }
    }
    else
        exc.func_write_cvt(exc, I, args[args_pos + 1]);
}

function Ins_RCVT(exc, args, args_pos)
{
    var I = args[args_pos];
    if (I >= exc.cvtSize)
    {
        if (exc.pedantic_hinting)
        {
            exc.error = FT_Common.FT_Err_Invalid_Reference;
            return;
        }
        else
            args[args_pos] = 0;
    }
    else
       args[args_pos] = exc.func_read_cvt(exc, I);
}

function Ins_GC(exc, args, args_pos)
{
    var L = args[args_pos];
    var R = 0;
    if (L >= exc.zp2.n_points)
    {
        if (exc.pedantic_hinting)
            exc.error = FT_Common.FT_Err_Invalid_Reference;
    }
    else
    {
        if (exc.opcode & 1)
            R = exc.func_dualproj(exc, exc.zp2.org[exc.zp2._offset_org + L].x, exc.zp2.org[exc.zp2._offset_org + L].y);
        else
            R = exc.func_project(exc, exc.zp2.cur[exc.zp2._offset_cur + L].x, exc.zp2.cur[exc.zp2._offset_cur + L].y);
    }

    args[args_pos] = R;
}

function Ins_SCFS(exc, args, args_pos)
{
    var L = 0xFFFF & args[args_pos];

    if (L >= exc.zp2.n_points)
    {
        if (exc.pedantic_hinting)
            exc.error = FT_Common.FT_Err_Invalid_Reference;
        return;
    }

    var K = exc.func_project(exc, exc.zp2.cur[exc.zp2._offset_cur + L].x, exc.zp2.cur[exc.zp2._offset_cur + L].y);

    exc.func_move(exc, exc.zp2, L, args[args_pos + 1] - K);

    /* UNDOCUMENTED!  The MS rasterizer does that with */
    /* twilight points (confirmed by Greg Hitchcock)   */
    if (exc.GS.gep2 == 0)
    {
        exc.zp2.org[exc.zp2._offset_org + L].x = exc.zp2.cur[exc.zp2._offset_cur + L].x;
        exc.zp2.org[exc.zp2._offset_org + L].y = exc.zp2.cur[exc.zp2._offset_cur + L].y;
    }
}

function Ins_MD(exc, args, args_pos)
{
    var D = 0;
    var K = 0xFFFF & args[args_pos + 1];
    var L = 0xFFFF & args[args_pos];

    if ((L >= exc.zp0.n_points) || (K >= exc.zp1.n_points))
    {
        if (exc.pedantic_hinting)
            exc.error = FT_Common.FT_Err_Invalid_Reference;
        D = 0;
    }
    else
    {
        if (exc.opcode & 1)
        {
            var vec1 = exc.zp0.cur[exc.zp0._offset_cur + L];
            var vec2 = exc.zp1.cur[exc.zp1._offset_cur + K];

            D = exc.func_project(exc, vec1.x - vec2.x, vec1.y - vec2.y);
        }
        else
        {
            /* XXX: UNDOCUMENTED: twilight zone special case */
            if (exc.GS.gep0 == 0 || exc.GS.gep1 == 0)
            {
                var vec1 = exc.zp0.org[exc.zp0._offset_org + L];
                var vec2 = exc.zp1.org[exc.zp1._offset_org + K];

                D = exc.func_dualproj(exc, vec1.x - vec2.x, vec1.y - vec2.y);
            }
            else
            {
                var vec1 = exc.zp0.orus[exc.zp0._offset_orus + L];
                var vec2 = exc.zp1.orus[exc.zp1._offset_orus + K];

                if ( exc.metrics.x_scale == exc.metrics.y_scale )
                {
                    /* this should be faster */
                    D = exc.func_dualproj(exc, vec1.x - vec2.x, vec1.y - vec2.y);
                    D = FT_MulFix(D, exc.metrics.x_scale);
                }
                else
                {
                    var vec = new FT_Vector();
                    vec.x = FT_MulFix(vec1.x - vec2.x, exc.metrics.x_scale);
                    vec.y = FT_MulFix(vec1.y - vec2.y, exc.metrics.y_scale);

                    D = exc.func_dualproj(exc, vec.x, vec.y);
                }
            }
        }
    }

    if (exc.face.driver.library.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING)//#ifdef TT_CONFIG_OPTION_SUBPIXEL_HINTING
    {
        /* Disable Type 2 Vacuform Rounds - e.g. Arial Narrow */
        if (exc.ignore_x_mode && Math.abs(D) == 64)
            D += 1;
    } //#endif /* TT_CONFIG_OPTION_SUBPIXEL_HINTING */

    args[args_pos] = D;
}

// --
function Current_Ppem(exc)
{
    return FT_MulFix(exc.tt_metrics.ppem, Current_Ratio(exc));
}

function Current_Ratio(exc)
{
    if (!exc.tt_metrics.ratio)
    {
        // TODO: unpatented
        if (exc.GS.projVector.y == 0)
            exc.tt_metrics.ratio = exc.tt_metrics.x_ratio;
        else if (exc.GS.projVector.x == 0)
            exc.tt_metrics.ratio = exc.tt_metrics.y_ratio;
        else
        {
            var x = TT_MulFix14(exc.tt_metrics.x_ratio, exc.GS.projVector.x);
            var y = TT_MulFix14(exc.tt_metrics.y_ratio, exc.GS.projVector.y);
            exc.tt_metrics.ratio = FT_Hypot(x, y);
        }
    }
    return exc.tt_metrics.ratio;
}

function FT_MulDiv_No_Round(a, b, c)
{
    var s = 1;
    if ( a < 0 ) { a = -a; s = -1; }
    if ( b < 0 ) { b = -b; s = -s; }
    if ( c < 0 ) { c = -c; s = -s; }

    var d = (c > 0 ? a * b / c : 0x7FFFFFFF);
    d = d >> 0;

    return ( s > 0 ) ? d : -d;
}
// --

function Ins_MPPEM(exc, args, args_pos)
{
    args[args_pos] = Current_Ppem(exc);
}

function Ins_MPS(exc, args, args_pos)
{
    args[args_pos] = Current_Ppem(exc);
}

function Ins_FLIPON(exc, args, args_pos)
{
    exc.GS.auto_flip = true;
}

function Ins_FLIPOFF(exc, args, args_pos)
{
    exc.GS.auto_flip = false;
}

function Ins_DEBUG(exc, args, args_pos)
{
    exc.error = FT_Common.FT_Err_Debug_OpCode;
}

function Ins_LT(exc, args, args_pos)
{
    args[args_pos] = (args[args_pos] < args[args_pos + 1]) ? 1 : 0;
}
function Ins_LTEQ(exc, args, args_pos)
{
    args[args_pos] = (args[args_pos] <= args[args_pos + 1]) ? 1 : 0;
}
function Ins_GT(exc, args, args_pos)
{
    args[args_pos] = (args[args_pos] > args[args_pos + 1]) ? 1 : 0;
}
function Ins_GTEQ(exc, args, args_pos)
{
    args[args_pos] = (args[args_pos] >= args[args_pos + 1]) ? 1 : 0;
}
function Ins_EQ(exc, args, args_pos)
{
    args[args_pos] = (args[args_pos] == args[args_pos + 1]) ? 1 : 0;
}
function Ins_NEQ(exc, args, args_pos)
{
    args[args_pos] = (args[args_pos] != args[args_pos + 1]) ? 1 : 0;
}
function Ins_ODD(exc, args, args_pos)
{
    args[args_pos] = ((exc.func_round(exc, args[args_pos], 0) & 127) == 64) ? 1 : 0;
}
function Ins_EVEN(exc, args, args_pos)
{
    args[args_pos] = ((exc.func_round(exc, args[args_pos], 0) & 127) == 0) ? 1 : 0;
}
function Ins_IF(exc, args, args_pos)
{
    if (args[args_pos] != 0)
        return;

    var nIfs = 1;
    var Out = 0;

    do
    {
        if (SkipCode(exc) == 1)
            return;

        switch ( exc.opcode )
        {
        case 0x58:      /* IF */
            nIfs++;
            break;
        case 0x1B:      /* ELSE */
            Out = (nIfs == 1) ? 1 : 0;
            break;
        case 0x59:      /* EIF */
            nIfs--;
            Out = (nIfs == 0) ? 1 : 0;
            break;
        }
    } while ( Out == 0 );
}
function Ins_EIF(exc, args, args_pos)
{
    // nothing
}
function Ins_AND(exc, args, args_pos)
{
    args[args_pos] = (args[args_pos] && args[args_pos + 1]) ? 1 : 0;
}
function Ins_OR(exc, args, args_pos)
{
    args[args_pos] = (args[args_pos] || args[args_pos + 1]) ? 1 : 0;
}
function Ins_NOT(exc, args, args_pos)
{
    args[args_pos] = (args[args_pos] != 0) ? 0 : 1;
}
function Ins_SDB(exc, args, args_pos)
{
    exc.GS.delta_base = FT_Common.UShort_To_Short(0xFFFF & args[args_pos]);
}
function Ins_SDS(exc, args, args_pos)
{
    exc.GS.delta_shift = FT_Common.UShort_To_Short(0xFFFF & args[args_pos]);
}

function Ins_ADD(exc, args, args_pos)
{
    args[args_pos] += args[args_pos + 1];
}
function Ins_SUB(exc, args, args_pos)
{
    args[args_pos] -= args[args_pos + 1];
}
function Ins_DIV(exc, args, args_pos)
{
    if (args[args_pos + 1] == 0)
        exc.error = FT_Common.FT_Err_Divide_By_Zero;
    else
        args[args_pos] = FT_MulDiv_No_Round(args[args_pos], 64, args[args_pos + 1]);
}
function Ins_MUL(exc, args, args_pos)
{
    args[args_pos] = FT_MulDiv(args[args_pos], args[args_pos + 1], 64);
}
function Ins_ABS(exc, args, args_pos)
{
    args[args_pos] = Math.abs(args[args_pos]);
}
function Ins_NEG(exc, args, args_pos)
{
    args[args_pos] = -args[args_pos];
}
function Ins_FLOOR(exc, args, args_pos)
{
    args[args_pos] = FT_PIX_FLOOR(args[args_pos]);
}
function Ins_CEILING(exc, args, args_pos)
{
    args[args_pos] = FT_PIX_CEIL(args[args_pos]);
}
function Ins_ROUND(exc, args, args_pos)
{
    args[args_pos] = exc.func_round(exc, args[args_pos], exc.tt_metrics.compensations[exc.opcode - 0x68]);
}
function Ins_NROUND(exc, args, args_pos)
{
    args[args_pos] = Round_None(exc, args[args_pos], exc.tt_metrics.compensations[exc.opcode - 0x6C]);
}

function Ins_WCVTF(exc, args, args_pos)
{
    var I = args[args_pos];
    if (I >= exc.cvtSize)
    {
        if (exc.pedantic_hinting)
        {
            exc.error = FT_Common.FT_Err_Invalid_Reference;
            return;
        }
    }
    else
    {
        exc.cvt[I] = FT_MulFix(args[args_pos + 1], exc.tt_metrics.scale);
    }
}

function Ins_DELTAP(exc, args, args_pos)
{
    var A = 0;
    var C = 0;
    var B = 0;
    var B1 = 0;
    var B2 = 0;

    var bIsSubpix = exc.face.driver.library.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING;

    if (bIsSubpix)
    {
        if (exc.ignore_x_mode && exc.iup_called && (exc.sph_tweak_flags & FT_Common.SPH_TWEAK_NO_DELTAP_AFTER_IUP) != 0)
        {
            exc.new_top = exc.args;
            return;
        }
    }

    // TODO: unpatented

    var nump = args[args_pos];   /* some points theoretically may occur more
                                   than once, thus UShort isn't enough */
    if (nump < 0)
        nump += FT_Common.a_i;

    for (var k = 1; k <= nump; k++)
    {
        if (exc.args < 2)
        {
            if (exc.pedantic_hinting)
                exc.error = FT_Common.FT_Err_Too_Few_Arguments;
            exc.args = 0;
            exc.new_top = exc.args;
            return;
        }

        exc.args -= 2;

        A = 0xFFFF & exc.stack[exc.args + 1];
        B = exc.stack[exc.args];

        /* XXX: Because some popular fonts contain some invalid DeltaP */
        /*      instructions, we simply ignore them when the stacked   */
        /*      point reference is off limit, rather than returning an */
        /*      error.  As a delta instruction doesn't change a glyph  */
        /*      in great ways, this shouldn't be a problem.            */
        if (A < exc.zp0.n_points)
        {
            C = (B & 0xF0) >> 4;

            switch (exc.opcode)
            {
            case 0x5D:
                break;
            case 0x71:
                C += 16;
                break;
            case 0x72:
                C += 32;
                break;
            }

            C += exc.GS.delta_base;
            if (C < 0)
                C += FT_Common.a_i;

            if (Current_Ppem(exc) == C)
            {
                B = (B & 0xF) - 8;
                if (B >= 0)
                    B++;
                B = B * 64 / (1 << exc.GS.delta_shift);
                B = B >> 0;

                if (!bIsSubpix)
                {
                    exc.func_move(exc, exc.zp0, A, B);
                }
                else
                {
                    /*
                    *  Allow delta move if
                    *
                    *  - not using ignore_x_mode rendering
                    *  - glyph is specifically set to allow it
                    *  - glyph is composite and freedom vector is not subpixel vector
                    */
                    if (!exc.ignore_x_mode || (exc.sph_tweak_flags & FT_Common.SPH_TWEAK_ALWAYS_DO_DELTAP) != 0 ||
                        (exc.is_composite && exc.GS.freeVector.y != 0))
                        exc.func_move(exc, exc.zp0, A, B);
                    else if (exc.ignore_x_mode) /* Otherwise apply subpixel hinting and compatibility mode rules */
                    {
                        if (exc.GS.freeVector.y != 0)
                            B1 = exc.zp0.cur[exc.zp0._offset_cur + A].y;
                        else
                            B1 = exc.zp0.cur[exc.zp0._offset_cur + A].x;

                        /*
                        // Standard Subpixel Hinting:  Allow y move
                        if (!exc.face.sph_compatibility_mode && exc.GS.freeVector.y != 0)
                            exc.func_move(exc, exc.zp0, A, B);
                        // Compatibility Mode: Allow x or y move if point touched in Y direction
                        else */if (exc.face.sph_compatibility_mode && (exc.sph_tweak_flags & FT_Common.SPH_TWEAK_ALWAYS_SKIP_DELTAP) == 0)
                        {
                            /* save the y value of the point now; compare after move */
                            B1 = exc.zp0.cur[exc.zp0._offset_cur + A].y;

                            if ((exc.sph_tweak_flags & FT_Common.SPH_TWEAK_ROUND_NONPIXEL_Y_MOVES) != 0)
                                B = FT_PIX_ROUND(B1 + B) - B1;

                            /*
                            *  Allow delta move if using compatibility_mode, IUP has not
                            *  been called, and point is touched on Y.
                            */
                            if (!exc.iup_called && (exc.zp0.tags[exc.zp0._offset_tags + A] & FT_Common.FT_CURVE_TAG_TOUCH_Y) != 0)
                                exc.func_move(exc, exc.zp0, A, B);
                        }

                        B2 = exc.zp0.cur[exc.zp0._offset_cur + A].y;

                        /* Reverse this move if it results in a disallowed move */
                        if (exc.GS.freeVector.y != 0 &&
                            ((exc.face.sph_compatibility_mode && (B1 & 63) == 0 && (B2 & 63) != 0 ) ||
                            ((exc.sph_tweak_flags & FT_Common.SPH_TWEAK_SKIP_NONPIXEL_Y_MOVES_DELTAP) != 0 && (B1 & 63) != 0 && (B2 & 63) != 0)))
                            exc.func_move(exc, exc.zp0, A, -B);
                    }
                }

            }
        }
        else
        {
            if (exc.pedantic_hinting)
                exc.error = FT_Common.FT_Err_Invalid_Reference;
        }
    }

    exc.new_top = exc.args;
}

function Ins_DELTAC(exc, args, args_pos)
{
    // TODO: unpatented
    var nump = args[args_pos];

    for (var k = 1; k <= nump; k++)
    {
        if (exc.args < 2)
        {
            if (exc.pedantic_hinting)
                exc.error = FT_Common.FT_Err_Too_Few_Arguments;
            exc.args = 0;
            exc.new_top = exc.args;
            return;
        }

        exc.args -= 2;

        var A = FT_Common.IntToUInt(exc.stack[exc.args + 1]);
        var B = exc.stack[exc.args];
        var C = 0;

        if (A >= exc.cvtSize)
        {
            if (exc.pedantic_hinting)
            {
                exc.error = FT_Common.FT_Err_Invalid_Reference;
                return;
            }
        }
        else
        {
            C = (B & 0xF0) >> 4;

            switch (exc.opcode)
            {
            case 0x73:
                break;
            case 0x74:
                C += 16;
                break;
            case 0x75:
                C += 32;
                break;
            }

            C += exc.GS.delta_base;

            if (Current_Ppem(exc) == C)
            {
                B = (B & 0xF) - 8;
                if (B >= 0)
                    B++;
                B = B * 64 / (1 << exc.GS.delta_shift);
                B = B >> 0;

                exc.func_move_cvt(exc, A, B);
            }
        }
    }
    exc.new_top = exc.args;
}

function Ins_SROUND(exc, args, args_pos)
{
    SetSuperRound(exc, 0x4000, args[args_pos]);
    exc.GS.round_state = TT_Round_Super;
    exc.func_round = Round_Super;
}

function Ins_S45ROUND(exc, args, args_pos)
{
    SetSuperRound(exc, 0x2D41, args[args_pos]);
    exc.GS.round_state = TT_Round_Super_45;
    exc.func_round = Round_Super_45;
}

function Ins_JROT(exc, args, args_pos)
{
    if (args[args_pos + 1] != 0)
    {
        if (args[args_pos] == 0 && exc.args == 0)
            exc.error = FT_Common.FT_Err_Bad_Argument;
        exc.IP += args[args_pos];
        if (exc.IP < 0 || (exc.callTop > 0 && exc.IP > exc.callStack[exc.callTop - 1].Def.end))
            exc.error = FT_Common.FT_Err_Bad_Argument;
        exc.step_ins = false;
    }
}

function Ins_JROF(exc, args, args_pos)
{
    if (args[args_pos + 1] == 0)
    {
        if (args[args_pos] == 0 && exc.args == 0)
            exc.error = FT_Common.FT_Err_Bad_Argument;
        exc.IP += args[args_pos];
        if (exc.IP < 0 || (exc.callTop > 0 && exc.IP > exc.callStack[exc.callTop - 1].Def.end))
            exc.error = FT_Common.FT_Err_Bad_Argument;
        exc.step_ins = false;
    }
}

function Ins_ROFF(exc, args, args_pos)
{
    exc.GS.round_state = TT_Round_Off;
    exc.func_round = Round_None;
}

function Ins_RUTG(exc, args, args_pos)
{
    exc.GS.round_state = TT_Round_Up_To_Grid;
    exc.func_round = Round_Up_To_Grid;
}

function Ins_RDTG(exc, args, args_pos)
{
    exc.GS.round_state = TT_Round_Down_To_Grid;
    exc.func_round = Round_Down_To_Grid;
}

function Ins_SANGW(exc, args, args_pos)
{
    /* instruction not supported anymore */
}

function Ins_AA(exc, args, args_pos)
{
    /* intentionally no longer supported */
}

function Ins_FLIPPT(exc, args, args_pos)
{
    if (exc.top < exc.GS.loop)
    {
        if (exc.pedantic_hinting)
            exc.error = FT_Common.FT_Err_Too_Few_Arguments;

        exc.GS.loop = 1;
        exc.new_top = exc.args;
        return;
    }

    while (exc.GS.loop > 0)
    {
        exc.args--;
        var point = 0xFFFF & exc.stack[exc.args];

        if (point >= exc.pts.n_points)
        {
            if (exc.pedantic_hinting)
            {
                exc.error = FT_Common.FT_Err_Invalid_Reference;
                return;
            }
        }
        else
            exc.pts.tags[exc.pts._offset_tags + point] ^= FT_Common.FT_CURVE_TAG_ON;

        exc.GS.loop--;
    }

    exc.GS.loop = 1;
    exc.new_top = exc.args;
}

function Ins_FLIPRGON(exc, args, args_pos)
{
    var K = 0xFFFF & args[args_pos + 1];
    var L = 0xFFFF & args[args_pos];

    if ((K >= exc.pts.n_points) || (L >= exc.pts.n_points))
    {
        if (exc.pedantic_hinting)
            exc.error = FT_Common.FT_Err_Invalid_Reference;
        return;
    }

    for (var I = L; I <= K; I++)
        exc.pts.tags[exc.pts._offset_tags + I] |= FT_Common.FT_CURVE_TAG_ON;
}

function Ins_FLIPRGOFF(exc, args, args_pos)
{
    var K = 0xFFFF & args[args_pos + 1];
    var L = 0xFFFF & args[args_pos];

    if ((K >= exc.pts.n_points) || (L >= exc.pts.n_points))
    {
        if (exc.pedantic_hinting)
            exc.error = FT_Common.FT_Err_Invalid_Reference;
        return;
    }

    for (var I = L; I <= K; I++)
        exc.pts.tags[exc.pts._offset_tags + I] &= ~FT_Common.FT_CURVE_TAG_ON;
}

function Ins_SCANCTRL(exc, args, args_pos)
{
    /* Get Threshold */
    var A = (args[args_pos] & 0xFF);

    if (A == 0xFF)
    {
        exc.GS.scan_control = true;
        return;
    }
    else if (A == 0)
    {
        exc.GS.scan_control = false;
        return;
    }

    if ((args[args_pos] & 0x100 ) != 0 && exc.tt_metrics.ppem <= A)
        exc.GS.scan_control = true;

    if ((args[args_pos] & 0x200 ) != 0 && exc.tt_metrics.rotated)
        exc.GS.scan_control = true;

    if ((args[args_pos] & 0x400 ) != 0 && exc.tt_metrics.stretched)
        exc.GS.scan_control = true;

    if ((args[args_pos] & 0x800 ) != 0 && exc.tt_metrics.ppem > A)
        exc.GS.scan_control = false;

    if ((args[args_pos] & 0x1000 ) != 0 && exc.tt_metrics.rotated)
        exc.GS.scan_control = false;

    if ((args[args_pos] & 0x2000 ) != 0 && exc.tt_metrics.stretched)
        exc.GS.scan_control = false;
}

function Ins_SDPVTL(exc, args, args_pos)
{
    var aOpc = exc.opcode;

    var p1 = 0xFFFF & args[args_pos + 1];
    var p2 = 0xFFFF & args[args_pos];

    if ((p2 >= exc.zp1.n_points) || (p1 >= exc.zp2.n_points))
    {
        if (exc.pedantic_hinting)
            exc.error = FT_Common.FT_Err_Invalid_Reference;
        return;
    }

    var v1 = exc.zp1.org[exc.zp1._offset_org + p2];
    var v2 = exc.zp2.org[exc.zp2._offset_org + p1];

    var A = v1.x - v2.x;
    var B = v1.y - v2.y;

    /* If v1 == v2, SDPVTL behaves the same as */
    /* SVTCA[X], respectively.                 */
    /*                                         */
    /* Confirmed by Greg Hitchcock.            */
    if ( A == 0 && B == 0 )
    {
        A    = 0x4000;
        aOpc = 0;
    }

    if ((aOpc & 1) != 0)
    {
        var C =  B;   /* counter clockwise rotation */
        B =  A;
        A = -C;
    }

    Normalize(exc, A, B, exc.GS.dualVector);

    v1 = exc.zp1.cur[exc.zp1._offset_cur + p2];
    v2 = exc.zp2.cur[exc.zp2._offset_cur + p1];

    A = v1.x - v2.x;
    B = v1.y - v2.y;

    if ( A == 0 && B == 0 )
    {
        A    = 0x4000;
        aOpc = 0;
    }

    if ((aOpc & 1) != 0)
    {
        var C =  B;   /* counter clockwise rotation */
        B =  A;
        A = -C;
    }

    Normalize(exc, A, B, exc.GS.projVector);

    GUESS_VECTOR(exc, exc.GS.freeVector);

    Compute_Funcs(exc);
}

function Ins_GETINFO(exc, args, args_pos)
{
    var K = 0;
    var bIsSubpix = exc.face.driver.library.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING;

    if (bIsSubpix)
    {
        /********************************/
        /* RASTERIZER VERSION           */
        /* Selector Bit:  0             */
        /* Return Bit(s): 0-7           */
        /*                              */
        if ((args[args_pos] & 1) != 0 && exc.ignore_x_mode)
        {
            K = exc.rasterizer_version;
        }
        else
        {
            if ((args[args_pos] & 1) != 0)
                K = FT_Common.TT_INTERPRETER_VERSION_35;
        }
    }
    else
    {
        if ((args[args_pos] & 1) != 0)
            K = FT_Common.TT_INTERPRETER_VERSION_35;
    }

    /********************************/
    /* GLYPH ROTATED                */
    /* Selector Bit:  1             */
    /* Return Bit(s): 8             */
    /*                              */
    if ((args[args_pos] & 2) != 0 && exc.tt_metrics.rotated)
        K |= 0x80;

    /********************************/
    /* GLYPH STRETCHED              */
    /* Selector Bit:  2             */
    /* Return Bit(s): 9             */
    /*                              */
    if ((args[args_pos] & 4) != 0 && exc.tt_metrics.stretched)
        K |= 1 << 8;

    /********************************/
    /* HINTING FOR GRAYSCALE        */
    /* Selector Bit:  5             */
    /* Return Bit(s): 12            */
    /*                              */
    if ((args[args_pos] & 32) != 0 && exc.grayscale)
        K |= 1 << 12;

    if (bIsSubpix) //#ifdef TT_CONFIG_OPTION_SUBPIXEL_HINTING
    {
        if (exc.ignore_x_mode && exc.rasterizer_version >= FT_Common.TT_INTERPRETER_VERSION_35)
        {
            /********************************/
            /* HINTING FOR GRAYSCALE        */
            /* Selector Bit:  5             */
            /* Return Bit(s): 12            */
            /*                              */
            if ((args[args_pos] & 32) != 0 && exc.grayscale_hinting)
                K |= 1 << 12;

            if (exc.rasterizer_version >= 37)
            {
                /********************************/
                /* HINTING FOR SUBPIXEL         */
                /* Selector Bit:  6             */
                /* Return Bit(s): 13            */
                /*                              */
                if ((args[0] & 64) != 0 && exc.subpixel_hinting)
                    K |= 1 << 13;

                /********************************/
                /* COMPATIBLE WIDTHS ENABLED    */
                /* Selector Bit:  7             */
                /* Return Bit(s): 14            */
                /*                              */
                /* Functionality still needs to be added */
                if ((args[0] & 128) != 0 && exc.compatible_widths)
                    K |= 1 << 14;

                /********************************/
                /* SYMMETRICAL SMOOTHING        */
                /* Selector Bit:  8             */
                /* Return Bit(s): 15            */
                /*                              */
                /* Functionality still needs to be added */
                if ((args[0] & 256 ) != 0 && exc.symmetrical_smoothing)
                    K |= 1 << 15;

                /********************************/
                /* HINTING FOR BGR?             */
                /* Selector Bit:  9             */
                /* Return Bit(s): 16            */
                /*                              */
                /* Functionality still needs to be added */
                if ((args[0] & 512) != 0 && exc.bgr)
                    K |= 1 << 16;

                if (exc.rasterizer_version >= 38)
                {
                    /********************************/
                    /* SUBPIXEL POSITIONED?         */
                    /* Selector Bit:  10            */
                    /* Return Bit(s): 17            */
                    /*                              */
                    /* Functionality still needs to be added */
                    if ((args[0] & 1024) != 0 && exc.subpixel_positioned)
                        K |= 1 << 17;
                }
            }
        }
    }//#endif /* TT_CONFIG_OPTION_SUBPIXEL_HINTING */
    args[args_pos] = K;
}

function Ins_IDEF(exc, args, args_pos)
{
    /*  First of all, look for the same function in our table */
    var defs = exc.IDefs;
    var _ind_def = 0;
    var limit = exc.numIDefs;
    var def = defs[_ind_def];

    for ( ; _ind_def < limit; _ind_def++)
    {
        def = defs[_ind_def];
        if (def.opc == args[args_pos])
            break;
    }

    if (_ind_def == limit)
    {
        /* check that there is enough room for a new instruction */
        if (exc.numIDefs >= exc.maxIDefs)
        {
            exc.error = FT_Common.FT_Err_Too_Many_Instruction_Defs;
            return;
        }
        exc.numIDefs++;
    }

    /* opcode must be unsigned 8-bit integer */
    if (0 > args[args_pos] || args[args_pos] > 0x00FF)
    {
        exc.error = FT_Common.FT_Err_Too_Many_Instruction_Defs;
        return;
    }

    def.opc    = 0xFF & args[args_pos];
    def.start  = exc.IP + 1;
    def.range  = exc.curRange;
    def.active = true;

    if (args[args_pos] > exc.maxIns)
        exc.maxIns = 0xFF & args[args_pos];

    /* Now skip the whole function definition. */
    /* We don't allow nested IDEFs & FDEFs.    */

    while (SkipCode(exc) == 0)
    {
        switch (exc.opcode)
        {
        case 0x89:   /* IDEF */
        case 0x2C:   /* FDEF */
            exc.error = FT_Common.FT_Err_Nested_DEFS;
            return;
      case 0x2D:   /* ENDF */
            return;
        }
    }
}

function Ins_ROLL(exc, args, args_pos)
{
    var A = args[args_pos + 2];
    var B = args[args_pos + 1];
    var C = args[args_pos];

    args[args_pos + 2] = C;
    args[args_pos + 1] = A;
    args[args_pos] = B;
}

function Ins_MAX(exc, args, args_pos)
{
    if (args[args_pos + 1] > args[args_pos])
        args[args_pos] = args[args_pos + 1];
}

function Ins_MIN(exc, args, args_pos)
{
    if (args[args_pos + 1] < args[args_pos])
        args[args_pos] = args[args_pos + 1];
}

function Ins_SCANTYPE(exc, args, args_pos)
{
    if (args[args_pos] >= 0)
        exc.GS.scan_type = args[args_pos];
}

function Ins_INSTCTRL(exc, args, args_pos)
{
    var K = args[args_pos + 1];
    var L = args[args_pos];

    if (K < 1 || K > 2)
    {
        if (exc.pedantic_hinting)
            exc.error = FT_Common.FT_Err_Invalid_Reference;
        return;
    }

    if (L != 0)
        L = K;

    exc.GS.instruct_control = ((((0xFF & exc.GS.instruct_control) & ~(K & 0xFF)) | (L & 0xFF)) != 0) ? 1 : 0;
}

function Ins_PUSHB(exc, args, args_pos)
{
    var L = 0xFFFF & (exc.opcode - 0xB0 + 1);

    if (L >= (exc.stackSize + 1 - exc.top))
    {
        exc.error = FT_Common.FT_Err_Stack_Overflow;
        return;
    }

    for (var K = 1; K <= L; K++)
        args[args_pos + K - 1] = exc.code.data[exc.code.pos + exc.IP + K];
}

function Ins_PUSHW(exc, args, args_pos)
{
    var L = 0xFFFF & (exc.opcode - 0xB8 + 1);

    if (L >= (exc.stackSize + 1 - exc.top))
    {
        exc.error = FT_Common.FT_Err_Stack_Overflow;
        return;
    }

    exc.IP++;

    for (var K = 0; K < L; K++)
        args[args_pos + K] = GetShortIns(exc);

    exc.step_ins = false;
}

function Ins_MDRP(exc, args, args_pos)
{
    var org_dist, distance;
    var minimum_distance = exc.GS.minimum_distance;

    var bIsSubpix = exc.face.driver.library.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING;

    if (bIsSubpix)
    {
        if (exc.ignore_x_mode && exc.GS.freeVector.x != 0 && (exc.sph_tweak_flags & FT_Common.SPH_TWEAK_NORMAL_ROUND) == 0)
            minimum_distance = 0;
    }

    var point = 0xFFFF & args[args_pos];

    if ((point >= exc.zp1.n_points) || (exc.GS.rp0 >= exc.zp0.n_points))
    {
        if (exc.pedantic_hinting)
            exc.error = FT_Common.FT_Err_Invalid_Reference;

        exc.GS.rp1 = exc.GS.rp0;
        exc.GS.rp2 = point;
        if ((exc.opcode & 16) != 0)
            exc.GS.rp0 = point;
        return;
    }

    /* XXX: Is there some undocumented feature while in the */
    /*      twilight zone?                                  */

    var v1, v2;
    /* XXX: UNDOCUMENTED: twilight zone special case */
    if (exc.GS.gep0 == 0 || exc.GS.gep1 == 0)
    {
        v1 = exc.zp1.org[exc.zp1._offset_org + point];
        v2 = exc.zp0.org[exc.zp0._offset_org + exc.GS.rp0];
        org_dist = exc.func_dualproj(exc, v1.x - v2.x, v1.y - v2.y);
    }
    else
    {
        v1 = exc.zp1.orus[exc.zp1._offset_orus + point];
        v2 = exc.zp0.orus[exc.zp0._offset_orus + exc.GS.rp0];

        if (exc.metrics.x_scale == exc.metrics.y_scale)
        {
            /* this should be faster */
            org_dist = exc.func_dualproj(exc, v1.x - v2.x, v1.y - v2.y);
            org_dist = FT_MulFix(org_dist, exc.metrics.x_scale);
        }
        else
        {
            var _x = FT_MulFix(v1.x - v2.x, exc.metrics.x_scale);
            var _y = FT_MulFix(v1.y - v2.y, exc.metrics.y_scale);
            org_dist = exc.func_dualproj(exc, _x, _y);
        }
    }

    /* single width cut-in test */
    if (Math.abs(org_dist - exc.GS.single_width_value) < exc.GS.single_width_cutin)
    {
        if (org_dist >= 0)
            org_dist = exc.GS.single_width_value;
        else
            org_dist = -exc.GS.single_width_value;
    }

    /* round flag */
    if ((exc.opcode & 4) != 0)
    {
        if (bIsSubpix)
        {
            if (exc.ignore_x_mode && exc.GS.freeVector.x != 0)
                distance = Round_None(org_dist, exc.tt_metrics.compensations[exc.opcode & 3]);
            else
                distance = exc.func_round(exc, org_dist, exc.tt_metrics.compensations[exc.opcode & 3]);
        }
        else
        {
            distance = exc.func_round(exc, org_dist, exc.tt_metrics.compensations[exc.opcode & 3]);
        }
    }
    else
        distance = Round_None(exc, org_dist, exc.tt_metrics.compensations[exc.opcode & 3]);

    /* minimum distance flag */
    if ((exc.opcode & 8) != 0)
    {
        if (org_dist >= 0)
        {
            if (distance < minimum_distance)
                distance = minimum_distance;
        }
        else
        {
            if (distance > -minimum_distance)
                distance = -minimum_distance;
        }
    }

    /* now move the point */
    v1 = exc.zp1.cur[exc.zp1._offset_cur + point];
    v2 = exc.zp0.cur[exc.zp0._offset_cur + exc.GS.rp0];
    org_dist = exc.func_project(exc, v1.x - v2.x, v1.y - v2.y);
    
    exc.func_move(exc, exc.zp1, point, distance - org_dist);

    exc.GS.rp1 = exc.GS.rp0;
    exc.GS.rp2 = point;
    if ((exc.opcode & 16) != 0)
        exc.GS.rp0 = point;
}

function Ins_MIRP(exc, args, args_pos)
{
    var bIsSubpix = exc.face.driver.library.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING;

    var minimum_distance    = exc.GS.minimum_distance;
    var control_value_cutin = exc.GS.control_value_cutin;
    var point               = 0xFFFF & args[args_pos];
    var cvtEntry            = FT_Common.IntToUInt(args[args_pos + 1] + 1);
    var distance = 0;

    if (bIsSubpix)
    {
        if (exc.ignore_x_mode && exc.GS.freeVector.x != 0 && (exc.sph_tweak_flags & FT_Common.SPH_TWEAK_NORMAL_ROUND) == 0)
            control_value_cutin = minimum_distance = 0;
    }

    /* XXX: UNDOCUMENTED! cvt[-1] = 0 always */
    if ((point >= exc.zp1.n_points) || (cvtEntry >= (exc.cvtSize + 1)) || (exc.GS.rp0 >= exc.zp0.n_points))
    {
        if (exc.pedantic_hinting)
            exc.error = FT_Common.FT_Err_Invalid_Reference;

        exc.GS.rp1 = exc.GS.rp0;
        if ((exc.opcode & 16) != 0)
            exc.GS.rp0 = point;
        exc.GS.rp2 = point;
        return;
    }

    var cvt_dist = 0;
    if (cvtEntry == 0)
        cvt_dist = 0;
    else
        cvt_dist = exc.func_read_cvt(exc, cvtEntry - 1);
        
    /* single width test */
    if (Math.abs(cvt_dist - exc.GS.single_width_value) < exc.GS.single_width_cutin)
    {
        if (cvt_dist >= 0)
            cvt_dist =  exc.GS.single_width_value;
        else
            cvt_dist = -exc.GS.single_width_value;
    }

    /* UNDOCUMENTED!  The MS rasterizer does that with */
    /* twilight points (confirmed by Greg Hitchcock)   */
    if (exc.GS.gep1 == 0)
    {
        var _v = exc.zp0.org[exc.zp0._offset_org + exc.GS.rp0];
        exc.zp1.org[exc.zp1._offset_org + point].x = _v.x + TT_MulFix14(cvt_dist, exc.GS.freeVector.x);
        exc.zp1.org[exc.zp1._offset_org + point].y = _v.y + TT_MulFix14(cvt_dist, exc.GS.freeVector.y);

        copy_vector(exc.zp1.cur[exc.zp1._offset_cur + point], exc.zp1.org[exc.zp1._offset_org + point]);
    }

    var v1 = exc.zp1.org[exc.zp1._offset_org + point];
    var v2 = exc.zp0.org[exc.zp0._offset_org + exc.GS.rp0];

    var org_dist = exc.func_dualproj(exc, v1.x - v2.x, v1.y - v2.y);

    v1 = exc.zp1.cur[exc.zp1._offset_cur + point];
    v2 = exc.zp0.cur[exc.zp0._offset_cur + exc.GS.rp0];

    var cur_dist = exc.func_project(exc, v1.x - v2.x, v1.y - v2.y);

    /* auto-flip test */
    if (exc.GS.auto_flip)
    {
        if ((org_dist ^ cvt_dist) < 0)
            cvt_dist = -cvt_dist;
    }

    if (bIsSubpix) //#ifdef TT_CONFIG_OPTION_SUBPIXEL_HINTING
    {
        if (exc.ignore_x_mode && exc.GS.freeVector.y != 0 && (exc.sph_tweak_flags & FT_Common.SPH_TWEAK_TIMES_NEW_ROMAN_HACK) != 0)
        {
            if (cur_dist < -64)
                cvt_dist -= 16;
            else if (cur_dist > 64 && cur_dist < 84)
                cvt_dist += 32;
        }
    } //#endif /* TT_CONFIG_OPTION_SUBPIXEL_HINTING */
    /* control value cut-in and round */
    if ((exc.opcode & 4) != 0)
    {
        /* XXX: UNDOCUMENTED!  Only perform cut-in test when both points */
        /*      refer to the same zone.                                  */
        if (exc.GS.gep0 == exc.GS.gep1)
        {
            /* XXX: According to Greg Hitchcock, the following wording is */
            /*      the right one:                                        */
            /*                                                            */
            /*        When the absolute difference between the value in   */
            /*        the table [CVT] and the measurement directly from   */
            /*        the outline is _greater_ than the cut_in value, the */
            /*        outline measurement is used.                        */
            /*                                                            */
            /*      This is from `instgly.doc'.  The description in       */
            /*      `ttinst2.doc', version 1.66, is thus incorrect since  */
            /*      it implies `>=' instead of `>'.                       */

            if (Math.abs(cvt_dist - org_dist) > control_value_cutin)
                cvt_dist = org_dist;
        }

        distance = exc.func_round(exc, cvt_dist, exc.tt_metrics.compensations[exc.opcode & 3]);
    }
    else
    {
        if (bIsSubpix)
        {
            /* do cvt cut-in always in MIRP for sph */
            if (exc.ignore_x_mode && exc.GS.gep0 == exc.GS.gep1)
            {
                if (Math.abs(cvt_dist - org_dist) > control_value_cutin)
                    cvt_dist = org_dist;
            }
        }
        distance = Round_None(exc, cvt_dist, exc.tt_metrics.compensations[exc.opcode & 3]);
    }

    /* minimum distance test */
    if ((exc.opcode & 8) != 0)
    {
        if (org_dist >= 0)
        {
            if (distance < minimum_distance)
                distance = minimum_distance;
        }
        else
        {
            if (distance > -minimum_distance)
                distance = -minimum_distance;
        }
    }

    if (!bIsSubpix)
    {
        exc.func_move(exc, exc.zp1, point, distance - cur_dist);
    }
    else
    {
        var B1 = exc.zp1.cur[exc.zp1._offset_cur + point].y;

        /* Round moves if necessary */
        if (exc.ignore_x_mode && exc.GS.freeVector.y != 0 && (exc.sph_tweak_flags & FT_Common.SPH_TWEAK_ROUND_NONPIXEL_Y_MOVES) != 0)
            distance = FT_PIX_ROUND(B1 + distance - cur_dist) - B1 + cur_dist;

        if (exc.ignore_x_mode && exc.GS.freeVector.y != 0 && (exc.opcode & 16) == 0 && (exc.opcode & 8) == 0 && (exc.sph_tweak_flags & FT_Common.SPH_TWEAK_COURIER_NEW_2_HACK) != 0)
            distance += 64;

        exc.func_move(exc, exc.zp1, point, distance - cur_dist);

        var B2 = exc.zp1.cur[exc.zp1._offset_cur + point].y;

        var reverse_move = false;
        /* Reverse move if necessary */
        if (exc.ignore_x_mode)
        {
            if (exc.face.sph_compatibility_mode &&
                exc.GS.freeVector.y != 0 &&
                ( B1 & 63 ) == 0 &&
                ( B2 & 63 ) != 0)
                reverse_move = true;

            if ((exc.sph_tweak_flags & FT_Common.SPH_TWEAK_SKIP_NONPIXEL_Y_MOVES) &&
                exc.GS.freeVector.y != 0 &&
                ( B2 & 63 ) != 0 &&
                ( B1 & 63 ) != 0)
                reverse_move = true;
        }

        if (reverse_move)
            exc.func_move(exc, exc.zp1, point, -(distance - cur_dist));
    }

    exc.GS.rp1 = exc.GS.rp0;
    if ((exc.opcode & 16) != 0)
        exc.GS.rp0 = point;
    exc.GS.rp2 = point;
}

var Instruct_Dispatch =
[
    /* Opcodes are gathered in groups of 16. */
    /* Please keep the spaces as they are.   */

    /*  SVTCA  y  */  Ins_SVTCA,
    /*  SVTCA  x  */  Ins_SVTCA,
    /*  SPvTCA y  */  Ins_SPVTCA,
    /*  SPvTCA x  */  Ins_SPVTCA,
    /*  SFvTCA y  */  Ins_SFVTCA,
    /*  SFvTCA x  */  Ins_SFVTCA,
    /*  SPvTL //  */  Ins_SPVTL,
    /*  SPvTL +   */  Ins_SPVTL,
    /*  SFvTL //  */  Ins_SFVTL,
    /*  SFvTL +   */  Ins_SFVTL,
    /*  SPvFS     */  Ins_SPVFS,
    /*  SFvFS     */  Ins_SFVFS,
    /*  GPV       */  Ins_GPV,
    /*  GFV       */  Ins_GFV,
    /*  SFvTPv    */  Ins_SFVTPV,
    /*  ISECT     */  Ins_ISECT,

    /*  SRP0      */  Ins_SRP0,
    /*  SRP1      */  Ins_SRP1,
    /*  SRP2      */  Ins_SRP2,
    /*  SZP0      */  Ins_SZP0,
    /*  SZP1      */  Ins_SZP1,
    /*  SZP2      */  Ins_SZP2,
    /*  SZPS      */  Ins_SZPS,
    /*  SLOOP     */  Ins_SLOOP,
    /*  RTG       */  Ins_RTG,
    /*  RTHG      */  Ins_RTHG,
    /*  SMD       */  Ins_SMD,
    /*  ELSE      */  Ins_ELSE,
    /*  JMPR      */  Ins_JMPR,
    /*  SCvTCi    */  Ins_SCVTCI,
    /*  SSwCi     */  Ins_SSWCI,
    /*  SSW       */  Ins_SSW,

    /*  DUP       */  Ins_DUP,
    /*  POP       */  Ins_POP,
    /*  CLEAR     */  Ins_CLEAR,
    /*  SWAP      */  Ins_SWAP,
    /*  DEPTH     */  Ins_DEPTH,
    /*  CINDEX    */  Ins_CINDEX,
    /*  MINDEX    */  Ins_MINDEX,
    /*  AlignPTS  */  Ins_ALIGNPTS,
    /*  INS_0x28  */  Ins_UNKNOWN,
    /*  UTP       */  Ins_UTP,
    /*  LOOPCALL  */  Ins_LOOPCALL,
    /*  CALL      */  Ins_CALL,
    /*  FDEF      */  Ins_FDEF,
    /*  ENDF      */  Ins_ENDF,
    /*  MDAP[0]   */  Ins_MDAP,
    /*  MDAP[1]   */  Ins_MDAP,

    /*  IUP[0]    */  Ins_IUP,
    /*  IUP[1]    */  Ins_IUP,
    /*  SHP[0]    */  Ins_SHP,
    /*  SHP[1]    */  Ins_SHP,
    /*  SHC[0]    */  Ins_SHC,
    /*  SHC[1]    */  Ins_SHC,
    /*  SHZ[0]    */  Ins_SHZ,
    /*  SHZ[1]    */  Ins_SHZ,
    /*  SHPIX     */  Ins_SHPIX,
    /*  IP        */  Ins_IP,
    /*  MSIRP[0]  */  Ins_MSIRP,
    /*  MSIRP[1]  */  Ins_MSIRP,
    /*  AlignRP   */  Ins_ALIGNRP,
    /*  RTDG      */  Ins_RTDG,
    /*  MIAP[0]   */  Ins_MIAP,
    /*  MIAP[1]   */  Ins_MIAP,

    /*  NPushB    */  Ins_NPUSHB,
    /*  NPushW    */  Ins_NPUSHW,
    /*  WS        */  Ins_WS,
    /*  RS        */  Ins_RS,
    /*  WCvtP     */  Ins_WCVTP,
    /*  RCvt      */  Ins_RCVT,
    /*  GC[0]     */  Ins_GC,
    /*  GC[1]     */  Ins_GC,
    /*  SCFS      */  Ins_SCFS,
    /*  MD[0]     */  Ins_MD,
    /*  MD[1]     */  Ins_MD,
    /*  MPPEM     */  Ins_MPPEM,
    /*  MPS       */  Ins_MPS,
    /*  FlipON    */  Ins_FLIPON,
    /*  FlipOFF   */  Ins_FLIPOFF,
    /*  DEBUG     */  Ins_DEBUG,

    /*  LT        */  Ins_LT,
    /*  LTEQ      */  Ins_LTEQ,
    /*  GT        */  Ins_GT,
    /*  GTEQ      */  Ins_GTEQ,
    /*  EQ        */  Ins_EQ,
    /*  NEQ       */  Ins_NEQ,
    /*  ODD       */  Ins_ODD,
    /*  EVEN      */  Ins_EVEN,
    /*  IF        */  Ins_IF,
    /*  EIF       */  Ins_EIF,
    /*  AND       */  Ins_AND,
    /*  OR        */  Ins_OR,
    /*  NOT       */  Ins_NOT,
    /*  DeltaP1   */  Ins_DELTAP,
    /*  SDB       */  Ins_SDB,
    /*  SDS       */  Ins_SDS,

    /*  ADD       */  Ins_ADD,
    /*  SUB       */  Ins_SUB,
    /*  DIV       */  Ins_DIV,
    /*  MUL       */  Ins_MUL,
    /*  ABS       */  Ins_ABS,
    /*  NEG       */  Ins_NEG,
    /*  FLOOR     */  Ins_FLOOR,
    /*  CEILING   */  Ins_CEILING,
    /*  ROUND[0]  */  Ins_ROUND,
    /*  ROUND[1]  */  Ins_ROUND,
    /*  ROUND[2]  */  Ins_ROUND,
    /*  ROUND[3]  */  Ins_ROUND,
    /*  NROUND[0] */  Ins_NROUND,
    /*  NROUND[1] */  Ins_NROUND,
    /*  NROUND[2] */  Ins_NROUND,
    /*  NROUND[3] */  Ins_NROUND,

    /*  WCvtF     */  Ins_WCVTF,
    /*  DeltaP2   */  Ins_DELTAP,
    /*  DeltaP3   */  Ins_DELTAP,
    /*  DeltaCn[0] */ Ins_DELTAC,
    /*  DeltaCn[1] */ Ins_DELTAC,
    /*  DeltaCn[2] */ Ins_DELTAC,
    /*  SROUND    */  Ins_SROUND,
    /*  S45Round  */  Ins_S45ROUND,
    /*  JROT      */  Ins_JROT,
    /*  JROF      */  Ins_JROF,
    /*  ROFF      */  Ins_ROFF,
    /*  INS_0x7B  */  Ins_UNKNOWN,
    /*  RUTG      */  Ins_RUTG,
    /*  RDTG      */  Ins_RDTG,
    /*  SANGW     */  Ins_SANGW,
    /*  AA        */  Ins_AA,

    /*  FlipPT    */  Ins_FLIPPT,
    /*  FlipRgON  */  Ins_FLIPRGON,
    /*  FlipRgOFF */  Ins_FLIPRGOFF,
    /*  INS_0x83  */  Ins_UNKNOWN,
    /*  INS_0x84  */  Ins_UNKNOWN,
    /*  ScanCTRL  */  Ins_SCANCTRL,
    /*  SDPVTL[0] */  Ins_SDPVTL,
    /*  SDPVTL[1] */  Ins_SDPVTL,
    /*  GetINFO   */  Ins_GETINFO,
    /*  IDEF      */  Ins_IDEF,
    /*  ROLL      */  Ins_ROLL,
    /*  MAX       */  Ins_MAX,
    /*  MIN       */  Ins_MIN,
    /*  ScanTYPE  */  Ins_SCANTYPE,
    /*  InstCTRL  */  Ins_INSTCTRL,
    /*  INS_0x8F  */  Ins_UNKNOWN,

    /*  INS_0x90  */   Ins_UNKNOWN,
    /*  INS_0x91  */   Ins_UNKNOWN,
    /*  INS_0x92  */   Ins_UNKNOWN,
    /*  INS_0x93  */   Ins_UNKNOWN,
    /*  INS_0x94  */   Ins_UNKNOWN,
    /*  INS_0x95  */   Ins_UNKNOWN,
    /*  INS_0x96  */   Ins_UNKNOWN,
    /*  INS_0x97  */   Ins_UNKNOWN,
    /*  INS_0x98  */   Ins_UNKNOWN,
    /*  INS_0x99  */   Ins_UNKNOWN,
    /*  INS_0x9A  */   Ins_UNKNOWN,
    /*  INS_0x9B  */   Ins_UNKNOWN,
    /*  INS_0x9C  */   Ins_UNKNOWN,
    /*  INS_0x9D  */   Ins_UNKNOWN,
    /*  INS_0x9E  */   Ins_UNKNOWN,
    /*  INS_0x9F  */   Ins_UNKNOWN,

    /*  INS_0xA0  */   Ins_UNKNOWN,
    /*  INS_0xA1  */   Ins_UNKNOWN,
    /*  INS_0xA2  */   Ins_UNKNOWN,
    /*  INS_0xA3  */   Ins_UNKNOWN,
    /*  INS_0xA4  */   Ins_UNKNOWN,
    /*  INS_0xA5  */   Ins_UNKNOWN,
    /*  INS_0xA6  */   Ins_UNKNOWN,
    /*  INS_0xA7  */   Ins_UNKNOWN,
    /*  INS_0xA8  */   Ins_UNKNOWN,
    /*  INS_0xA9  */   Ins_UNKNOWN,
    /*  INS_0xAA  */   Ins_UNKNOWN,
    /*  INS_0xAB  */   Ins_UNKNOWN,
    /*  INS_0xAC  */   Ins_UNKNOWN,
    /*  INS_0xAD  */   Ins_UNKNOWN,
    /*  INS_0xAE  */   Ins_UNKNOWN,
    /*  INS_0xAF  */   Ins_UNKNOWN,

    /*  PushB[0]  */  Ins_PUSHB,
    /*  PushB[1]  */  Ins_PUSHB,
    /*  PushB[2]  */  Ins_PUSHB,
    /*  PushB[3]  */  Ins_PUSHB,
    /*  PushB[4]  */  Ins_PUSHB,
    /*  PushB[5]  */  Ins_PUSHB,
    /*  PushB[6]  */  Ins_PUSHB,
    /*  PushB[7]  */  Ins_PUSHB,
    /*  PushW[0]  */  Ins_PUSHW,
    /*  PushW[1]  */  Ins_PUSHW,
    /*  PushW[2]  */  Ins_PUSHW,
    /*  PushW[3]  */  Ins_PUSHW,
    /*  PushW[4]  */  Ins_PUSHW,
    /*  PushW[5]  */  Ins_PUSHW,
    /*  PushW[6]  */  Ins_PUSHW,
    /*  PushW[7]  */  Ins_PUSHW,

    /*  MDRP[00]  */  Ins_MDRP,
    /*  MDRP[01]  */  Ins_MDRP,
    /*  MDRP[02]  */  Ins_MDRP,
    /*  MDRP[03]  */  Ins_MDRP,
    /*  MDRP[04]  */  Ins_MDRP,
    /*  MDRP[05]  */  Ins_MDRP,
    /*  MDRP[06]  */  Ins_MDRP,
    /*  MDRP[07]  */  Ins_MDRP,
    /*  MDRP[08]  */  Ins_MDRP,
    /*  MDRP[09]  */  Ins_MDRP,
    /*  MDRP[10]  */  Ins_MDRP,
    /*  MDRP[11]  */  Ins_MDRP,
    /*  MDRP[12]  */  Ins_MDRP,
    /*  MDRP[13]  */  Ins_MDRP,
    /*  MDRP[14]  */  Ins_MDRP,
    /*  MDRP[15]  */  Ins_MDRP,

    /*  MDRP[16]  */  Ins_MDRP,
    /*  MDRP[17]  */  Ins_MDRP,
    /*  MDRP[18]  */  Ins_MDRP,
    /*  MDRP[19]  */  Ins_MDRP,
    /*  MDRP[20]  */  Ins_MDRP,
    /*  MDRP[21]  */  Ins_MDRP,
    /*  MDRP[22]  */  Ins_MDRP,
    /*  MDRP[23]  */  Ins_MDRP,
    /*  MDRP[24]  */  Ins_MDRP,
    /*  MDRP[25]  */  Ins_MDRP,
    /*  MDRP[26]  */  Ins_MDRP,
    /*  MDRP[27]  */  Ins_MDRP,
    /*  MDRP[28]  */  Ins_MDRP,
    /*  MDRP[29]  */  Ins_MDRP,
    /*  MDRP[30]  */  Ins_MDRP,
    /*  MDRP[31]  */  Ins_MDRP,

    /*  MIRP[00]  */  Ins_MIRP,
    /*  MIRP[01]  */  Ins_MIRP,
    /*  MIRP[02]  */  Ins_MIRP,
    /*  MIRP[03]  */  Ins_MIRP,
    /*  MIRP[04]  */  Ins_MIRP,
    /*  MIRP[05]  */  Ins_MIRP,
    /*  MIRP[06]  */  Ins_MIRP,
    /*  MIRP[07]  */  Ins_MIRP,
    /*  MIRP[08]  */  Ins_MIRP,
    /*  MIRP[09]  */  Ins_MIRP,
    /*  MIRP[10]  */  Ins_MIRP,
    /*  MIRP[11]  */  Ins_MIRP,
    /*  MIRP[12]  */  Ins_MIRP,
    /*  MIRP[13]  */  Ins_MIRP,
    /*  MIRP[14]  */  Ins_MIRP,
    /*  MIRP[15]  */  Ins_MIRP,

    /*  MIRP[16]  */  Ins_MIRP,
    /*  MIRP[17]  */  Ins_MIRP,
    /*  MIRP[18]  */  Ins_MIRP,
    /*  MIRP[19]  */  Ins_MIRP,
    /*  MIRP[20]  */  Ins_MIRP,
    /*  MIRP[21]  */  Ins_MIRP,
    /*  MIRP[22]  */  Ins_MIRP,
    /*  MIRP[23]  */  Ins_MIRP,
    /*  MIRP[24]  */  Ins_MIRP,
    /*  MIRP[25]  */  Ins_MIRP,
    /*  MIRP[26]  */  Ins_MIRP,
    /*  MIRP[27]  */  Ins_MIRP,
    /*  MIRP[28]  */  Ins_MIRP,
    /*  MIRP[29]  */  Ins_MIRP,
    /*  MIRP[30]  */  Ins_MIRP,
    /*  MIRP[31]  */  Ins_MIRP
];

function TT_RunIns(exc)
{
    var ins_counter = 0;  /* executed instructions counter */

    var _tt_hints = exc.face.driver.library.tt_hint_props;
    if (_tt_hints.TT_CONFIG_OPTION_SUBPIXEL_HINTING) //#ifdef TT_CONFIG_OPTION_SUBPIXEL_HINTING
    {
        exc.iup_called = false;
    }//#endif /* TT_CONFIG_OPTION_SUBPIXEL_HINTING */

    var opcode_pattern = [
        [
            0x06, /* SPVTL   */
            0x7D, /* RDTG    */
        ]
    ];
    var opcode_pointer = [ 0 ];
    var opcode_size    = [ 1 ];

    /* set CVT functions */
    exc.tt_metrics.ratio = 0;
    if (exc.metrics.x_ppem != exc.metrics.y_ppem)
    {
        /* non-square pixels, use the stretched routines */
        exc.func_read_cvt  = Read_CVT_Stretched;
        exc.func_write_cvt = Write_CVT_Stretched;
        exc.func_move_cvt  = Move_CVT_Stretched;
    }
    else
    {
        /* square pixels, use normal routines */
        exc.func_read_cvt  = Read_CVT;
        exc.func_write_cvt = Write_CVT;
        exc.func_move_cvt  = Move_CVT;
    }

    Compute_Funcs(exc);
    Compute_Round(exc, exc.GS.round_state);

    do
    {
        exc.opcode = exc.code.data[exc.code.pos + exc.IP];

        exc.length = opcode_length[exc.opcode];
        if (exc.length < 0)
        {
            if (exc.IP + 1 >= exc.codeSize)
                return SetErrorAndReturn(exc, FT_Common.FT_Err_Code_Overflow);

            exc.length = 2 - exc.length * exc.code.data[exc.code.pos + exc.IP + 1];
        }

        if (exc.IP + exc.length > exc.codeSize)
            return SetErrorAndReturn(exc, FT_Common.FT_Err_Code_Overflow);

        /* First, let's check for empty stack and overflow */
        exc.args = exc.top - (Pop_Push_Count[exc.opcode] >> 4);

        /* `args' is the top of the stack once arguments have been popped. */
        /* One can also interpret it as the index of the last argument.    */
        if (exc.args < 0)
        {
            if (exc.pedantic_hinting)
            {
                exc.error = FT_Common.FT_Err_Too_Few_Arguments;
                return SetErrorAndReturn(exc);
            }

            /* push zeroes onto the stack */
            var __l = Pop_Push_Count[exc.opcode] >> 4;
            for (var i = 0; i < __l; i++)
                exc.stack[i] = 0;
            exc.args = 0;
        }

        exc.new_top = exc.args + (Pop_Push_Count[exc.opcode] & 15);

        /* `new_top' is the new top of the stack, after the instruction's */
        /* execution.  `top' will be set to `new_top' after the `switch'  */
        /* statement.                                                     */
        if (exc.new_top > exc.stackSize)
        {
            exc.error = FT_Common.FT_Err_Stack_Overflow;
            return SetErrorAndReturn(exc);
        }

        exc.step_ins = true;
        exc.error    = 0;

        if (_tt_hints.TT_CONFIG_OPTION_SUBPIXEL_HINTING) //#ifdef TT_CONFIG_OPTION_SUBPIXEL_HINTING
        {
            for (var i_patt = 0; i_patt < opcode_pattern.length; i_patt++)
            {
                if (opcode_pointer[i_patt] < opcode_size[i_patt] &&
                    exc.opcode == opcode_pattern[i_patt][opcode_pointer[i_patt]])
                {
                    opcode_pointer[i_patt] += 1;

                    if ( opcode_pointer[i_patt] == opcode_size[i_patt] )
                    {
                        switch ( i_patt )
                        {
                            case 0:
                                break;
                        }
                        opcode_pointer[i_patt] = 0;
                    }
                }
                else
                    opcode_pointer[i_patt] = 0;
            }
        }//#endif /* TT_CONFIG_OPTION_SUBPIXEL_HINTING */

        Instruct_Dispatch[exc.opcode](exc, exc.stack, exc.args);
 
        var bSuiteLabel = false;
        if (exc.error != 0)
        {
            switch (exc.error)
            {
                case FT_Common.FT_Err_Invalid_Opcode: /* looking for redefined instructions */
                {
                    var defs  = exc.IDefs;
                    var limit = exc.numIDefs;

                    for (var def = 0; def < limit; def++)
                    {
                        var _def = defs[def];
                        if (def.active && exc.opcode == def.opc)
                        {
                            if (exc.callTop >= exc.callSize)
                            {
                                exc.error = FT_Common.FT_Err_Invalid_Reference;
                                return SetErrorAndReturn(exc);
                            }

                            var callrec = exc.callStack[exc.callTop];

                            callrec.Caller_Range = exc.curRange;
                            callrec.Caller_IP    = exc.IP + 1;
                            callrec.Cur_Count    = 1;
                            callrec.Def          = _def;

                            if (Ins_Goto_CodeRange(def.range, def.start) == 1)
                                return SetErrorAndReturn(exc);

                            bSuiteLabel = true;
                            break;
                        }
                    }
                }

                if (!bSuiteLabel)
                {
                    exc.error = FT_Common.FT_Err_Invalid_Opcode;
                    return SetErrorAndReturn(exc);
                }

            default:
                if (!bSuiteLabel)
                    return SetErrorAndReturn(exc);
            }
        }

        if (!bSuiteLabel)
        {
            exc.top = exc.new_top;

            if (exc.step_ins)
                exc.IP += exc.length;

            /* increment instruction counter and check if we didn't */
            /* run this program for too long (e.g. infinite loops). */
            if (++ins_counter > FT_Common.MAX_RUNNABLE_OPCODES)
                return FT_Common.FT_Err_Execution_Too_Long;
        }

        if (exc.IP >= exc.codeSize)
        {
            if (exc.callTop > 0)
            {
                exc.error = FT_Common.FT_Err_Code_Overflow;
                return SetErrorAndReturn(exc);
            }
            else
                return 0;
        }

    } while (!exc.instruction_trap);

    return 0;
}

function SetErrorAndReturn(exc, err)
{
    if (undefined !== err)
        exc.error = err;

    if (exc.error != 0 && !exc.instruction_trap)
    {
        exc.size.cvt_ready = false;
    }

    return exc.error;
}

function Read_CVT(exc, idx)
{
    return exc.cvt[idx];
}

function Read_CVT_Stretched(exc, idx)
{
    return FT_MulFix(exc.cvt[idx], Current_Ratio(exc));
}

function Write_CVT(exc, idx, value)
{
    exc.cvt[idx] = value;
}

function Write_CVT_Stretched(exc, idx, value)
{
    exc.cvt[idx] = FT_DivFix(value, Current_Ratio(exc));
}

function Move_CVT(exc, idx, value)
{
    exc.cvt[idx] += value;
}

function Move_CVT_Stretched(exc, idx, value)
{
    exc.cvt[idx] += FT_DivFix(value, Current_Ratio(exc));
}

/*********************************************************************/
/*********************************************************************/
/*********************************************************************/
/*********************************************************************/
/*********************************************************************/
/*********************************************************************/
function CSubpixHintingHacks()
{
    this.Correct_Init_Obj = function(_class)
    {
        for (var prop in _class)
        {
            if (!_class.hasOwnProperty(prop))
                continue;

            var _arr = _class[prop];
            var _obj = {};

            var _len = _arr.length;
            for (var i = 0; i < _len; i++)
                _obj[_arr[i]] = true;

            _class[prop] = _obj;
        }
    };

    this.FAMILY_CLASS_Rules =
    {
        "MS Legacy Fonts" : [
            "Aharoni",
            "Andale Mono",
            "Andalus",
            "Angsana New",
            "AngsanaUPC",
            "Arabic Transparent",
            "Arial Black",
            "Arial Narrow",
            "Arial Unicode MS",
            "Arial",
            "Batang",
            "Browallia New",
            "BrowalliaUPC",
            "Comic Sans MS",
            "Cordia New",
            "CordiaUPC",
            "Courier New",
            "DFKai-SB",
            "David Transparent",
            "David",
            "DilleniaUPC",
            "Estrangelo Edessa",
            "EucrosiaUPC",
            "FangSong_GB2312",
            "Fixed Miriam Transparent",
            "FrankRuehl",
            "Franklin Gothic Medium",
            "FreesiaUPC",
            "Garamond",
            "Gautami",
            "Georgia",
            "Gulim",
            "Impact",
            "IrisUPC",
            "JasmineUPC",
            "KaiTi_GB2312",
            "KodchiangUPC",
            "Latha",
            "Levenim MT",
            "LilyUPC",
            "Lucida Console",
            "Lucida Sans Unicode",
            "MS Gothic",
            "MS Mincho",
            "MV Boli",
            "Mangal",
            "Marlett",
            "Microsoft Sans Serif",
            "Mingliu",
            "Miriam Fixed",
            "Miriam Transparent",
            "Miriam",
            "Narkisim",
            "Palatino Linotype",
            "Raavi",
            "Rod Transparent",
            "Rod",
            "Shruti",
            "SimHei",
            "Simplified Arabic Fixed",
            "Simplified Arabic",
            "Simsun",
            "Sylfaen",
            "Symbol",
            "Tahoma",
            "Times New Roman",
            "Traditional Arabic",
            "Trebuchet MS",
            "Tunga",
            "Verdana",
            "Webdings",
            "Wingdings"
        ],
        "Core MS Legacy Fonts" : [
            "Arial Black",
            "Arial Narrow",
            "Arial Unicode MS",
            "Arial",
            "Comic Sans MS",
            "Courier New",
            "Garamond",
            "Georgia",
            "Impact",
            "Lucida Console",
            "Lucida Sans Unicode",
            "Microsoft Sans Serif",
            "Palatino Linotype",
            "Tahoma",
            "Times New Roman",
            "Trebuchet MS",
            "Verdana"
        ],
        "Apple Legacy Fonts" : [
            "Geneva",
            "Times",
            "Monaco",
            "Century",
            "Chalkboard",
            "Lobster",
            "Century Gothic",
            "Optima",
            "Lucida Grande",
            "Gill Sans",
            "Baskerville",
            "Helvetica",
            "Helvetica Neue"
        ],
        "Legacy Sans Fonts" : [
            "Andale Mono",
            "Arial Unicode MS",
            "Arial",
            "Century Gothic",
            "Comic Sans MS",
            "Franklin Gothic Medium",
            "Geneva",
            "Lucida Console",
            "Lucida Grande",
            "Lucida Sans Unicode",
            "Lucida Sans Typewriter",
            "Microsoft Sans Serif",
            "Monaco",
            "Tahoma",
            "Trebuchet MS",
            "Verdana"
        ],
        "Misc Legacy Fonts" : [
            "Dark Courier"
        ],
        "Verdana Clones" : [
            "DejaVu Sans",
            "Bitstream Vera Sans"
        ],
        "Verdana and Clones" : [
            "DejaVu Sans",
            "Bitstream Vera Sans",
            "Verdana"
        ]
    };

    this.Correct_Init_Obj(this.FAMILY_CLASS_Rules);

    this.STYLE_CLASS_Rules =
    {
        "Regular Class" : [
            "Regular",
            "Book",
            "Medium",
            "Roman",
            "Normal"
        ],
        "Regular/Italic Class" : [
            "Regular",
            "Book",
            "Medium",
            "Italic",
            "Oblique",
            "Roman",
            "Normal"
        ],
        "Bold/BoldItalic Class" : [
            "Bold",
            "Bold Italic",
            "Black"
        ],
        "Bold/Italic/BoldItalic Class" : [
            "Bold",
            "Bold Italic",
            "Black",
            "Italic",
            "Oblique"
        ],
        "Regular/Bold Class" : [
            "Regular",
            "Book",
            "Medium",
            "Normal",
            "Roman",
            "Bold",
            "Black"
        ]
    };

    this.Correct_Init_Obj(this.STYLE_CLASS_Rules);

    /***************************************************************/
    /***************************************************************/
    /***************************************************************/
    this._create_SPH_TweakRule = function(family, ppem, style, glyph)
    {
        var _ret = new SPH_TweakRule();
        _ret.family = family;
        _ret.ppem = ppem;
        _ret.style = style;
        _ret.glyph = glyph;
        return _ret;
    };
    this._create_SPH_ScaleRule = function(family, ppem, style, glyph, scale)
    {
        var _ret = new SPH_ScaleRule();
        _ret.family = family;
        _ret.ppem = ppem;
        _ret.style = style;
        _ret.glyph = glyph;
        _ret.scale = scale;
        return _ret;
    };

    /* Force special legacy fixes for fonts.                                 */
    this.COMPATIBILITY_MODE_Rules = [
        this._create_SPH_TweakRule("-", 0, "", 0)
    ];

    /* Don't do subpixel (ignore_x_mode) hinting; do normal hinting.         */
    this.PIXEL_HINTING_Rules = [
        /* these characters are almost always safe */
        this._create_SPH_TweakRule("Courier New", 12, "Italic", "z".charCodeAt(0)),
        this._create_SPH_TweakRule("Courier New", 11, "Italic", "z".charCodeAt(0))
    ];

    /* Subpixel hinting ignores SHPIX rules on X.  Force SHPIX for these.    */
    this.DO_SHPIX_Rules = [
        this._create_SPH_TweakRule("-", 0, "", 0)
    ];

    /* Skip Y moves that start with a point that is not on a Y pixel         */
    /* boundary and don't move that point to a Y pixel boundary.             */
    this.SKIP_NONPIXEL_Y_MOVES_Rules = [
        /* fix vwxyz thinness*/
        this._create_SPH_TweakRule("Consolas", 0, "", 0),
        /* Fix thin middle stems */
        this._create_SPH_TweakRule("Core MS Legacy Fonts", 0, "Regular", 0),
        /* Cyrillic small letter I */
        this._create_SPH_TweakRule("Legacy Sans Fonts", 0, "", 0),
        /* Fix artifacts with some Regular & Bold */
        this._create_SPH_TweakRule("Verdana Clones", 0, "", 0)
    ];

    this.SKIP_NONPIXEL_Y_MOVES_Rules_Exceptions = [
        /* Fixes < and > */
        this._create_SPH_TweakRule("Courier New", 0, "Regular", 0)
    ];

    this.SKIP_NONPIXEL_Y_MOVES_DELTAP_Rules = [
        /* Maintain thickness of diagonal in 'N' */
        this._create_SPH_TweakRule("Times New Roman", 0, "Regular/Bold Class", "N".charCodeAt(0)),
        this._create_SPH_TweakRule("Georgia", 0, "Regular/Bold Class", "N".charCodeAt(0))
    ];

    /* Skip Y moves that move a point off a Y pixel boundary.                */
    this.SKIP_OFFPIXEL_Y_MOVES_Rules = [
        this._create_SPH_TweakRule("-", 0, "", 0)
    ];

    this.SKIP_OFFPIXEL_Y_MOVES_Rules_Exceptions = [
        this._create_SPH_TweakRule("-", 0, "", 0)
    ];

    /* Round moves that don't move a point to a Y pixel boundary.            */
    this.ROUND_NONPIXEL_Y_MOVES_Rules = [
        /* Droid font instructions don't snap Y to pixels */
        this._create_SPH_TweakRule("Droid Sans", 0, "Regular/Italic Class", 0),
        this._create_SPH_TweakRule("Droid Sans Mono", 0, "", 0)
    ];

    this.ROUND_NONPIXEL_Y_MOVES_Rules_Exceptions = [
        this._create_SPH_TweakRule("-", 0, "", 0)
    ];

    /* Allow a Direct_Move along X freedom vector if matched.                */
    this.ALLOW_X_DMOVE_Rules = [
        /* Fixes vanishing diagonal in 4 */
        this._create_SPH_TweakRule("Verdana", 0, "Regular", "4".charCodeAt(0))
    ];

    this.RASTERIZER_35_Rules = [
        /* This seems to be the only way to make these look good */
        this._create_SPH_TweakRule("Times New Roman", 0, "Regular", "i".charCodeAt(0)),
        this._create_SPH_TweakRule("Times New Roman", 0, "Regular", "j".charCodeAt(0)),
        this._create_SPH_TweakRule("Times New Roman", 0, "Regular", "m".charCodeAt(0)),
        this._create_SPH_TweakRule("Times New Roman", 0, "Regular", "r".charCodeAt(0)),
        this._create_SPH_TweakRule("Times New Roman", 0, "Regular", "a".charCodeAt(0)),
        this._create_SPH_TweakRule("Times New Roman", 0, "Regular", "n".charCodeAt(0)),
        this._create_SPH_TweakRule("Times New Roman", 0, "Regular", "p".charCodeAt(0)),
        this._create_SPH_TweakRule("Times", 0, "", 0)
    ];

    /* Don't round to the subpixel grid.  Round to pixel grid.               */
    this.NORMAL_ROUND_Rules = [
        /* Fix serif thickness for certain ppems */
        /* Can probably be generalized somehow   */
        this._create_SPH_TweakRule("Courier New", 0, "", 0)
    ];

    /* Skip IUP instructions if matched.                                     */
    this.SKIP_IUP_Rules = [
        this._create_SPH_TweakRule("Arial", 13, "Regular", "a".charCodeAt(0)),
    ];

    /* Skip MIAP Twilight hack if matched.                                   */
    this.MIAP_HACK_Rules = [
        this._create_SPH_TweakRule("Geneva", 12, "", 0)
    ];

    /* Skip DELTAP instructions if matched.                                  */
    this.ALWAYS_SKIP_DELTAP_Rules = [
        this._create_SPH_TweakRule("Georgia", 0, "Regular", "k".charCodeAt(0)),
        /* fix various problems with e in different versions */
        this._create_SPH_TweakRule("Trebuchet MS", 14, "Regular", "e".charCodeAt(0)),
        this._create_SPH_TweakRule("Trebuchet MS", 13, "Regular", "e".charCodeAt(0)),
        this._create_SPH_TweakRule("Trebuchet MS", 15, "Regular", "e".charCodeAt(0)),
        this._create_SPH_TweakRule("Trebuchet MS", 0, "Italic", "v".charCodeAt(0)),
        this._create_SPH_TweakRule("Trebuchet MS", 0, "Italic", "w".charCodeAt(0)),
        this._create_SPH_TweakRule("Trebuchet MS", 0, "Regular", "Y".charCodeAt(0)),
        this._create_SPH_TweakRule("Arial", 11, "Regular", "s".charCodeAt(0)),
        /* prevent problems with '3' and others */
        this._create_SPH_TweakRule("Verdana", 10, "Regular", 0),
        this._create_SPH_TweakRule("Verdana", 9, "Regular", 0),
        /* Cyrillic small letter short I */
        this._create_SPH_TweakRule("Legacy Sans Fonts", 0, "", 0x438),
        this._create_SPH_TweakRule("Legacy Sans Fonts", 0, "", 0x439),
        this._create_SPH_TweakRule("Arial", 10, "Regular", "6".charCodeAt(0)),
        this._create_SPH_TweakRule("Arial", 0, "Bold/BoldItalic Class", "a".charCodeAt(0)),
        /* Make horizontal stems consistent with the rest */
        this._create_SPH_TweakRule("Arial", 24, "Bold", "a".charCodeAt(0)),
        this._create_SPH_TweakRule("Arial", 25, "Bold", "a".charCodeAt(0)),
        this._create_SPH_TweakRule("Arial", 24, "Bold", "s".charCodeAt(0)),
        this._create_SPH_TweakRule("Arial", 25, "Bold", "s".charCodeAt(0)),
        this._create_SPH_TweakRule("Arial", 34, "Bold", "s".charCodeAt(0)),
        this._create_SPH_TweakRule("Arial", 35, "Bold", "s".charCodeAt(0)),
        this._create_SPH_TweakRule("Arial", 36, "Bold", "s".charCodeAt(0)),
        this._create_SPH_TweakRule("Arial", 25, "Regular", "s".charCodeAt(0)),
        this._create_SPH_TweakRule("Arial", 26, "Regular", "s".charCodeAt(0))
    ];

    /* Always do DELTAP instructions if matched.                             */
    this.ALWAYS_DO_DELTAP_Rules = [
        this._create_SPH_TweakRule("-", 0, "", 0)
    ];

    /* Don't allow ALIGNRP after IUP.                                        */
    this.NO_ALIGNRP_AFTER_IUP_Rules = [
        /* Prevent creation of dents in outline */
        this._create_SPH_TweakRule("-", 0, "", 0)
    ];

    /* Don't allow DELTAP after IUP.                                         */
    this.NO_DELTAP_AFTER_IUP_Rules = [
        this._create_SPH_TweakRule("-", 0, "", 0)
    ];

    /* Don't allow CALL after IUP.                                           */
    this.NO_CALL_AFTER_IUP_Rules = [
        /* Prevent creation of dents in outline */
        this._create_SPH_TweakRule("-", 0, "", 0)
    ];

    /* De-embolden these glyphs slightly.                                    */
    this.DEEMBOLDEN_Rules = [
        this._create_SPH_TweakRule("Courier New", 0, "Bold", "A".charCodeAt(0)),
        this._create_SPH_TweakRule("Courier New", 0, "Bold", "W".charCodeAt(0)),
        this._create_SPH_TweakRule("Courier New", 0, "Bold", "w".charCodeAt(0)),
        this._create_SPH_TweakRule("Courier New", 0, "Bold", "M".charCodeAt(0)),
        this._create_SPH_TweakRule("Courier New", 0, "Bold", "X".charCodeAt(0)),
        this._create_SPH_TweakRule("Courier New", 0, "Bold", "K".charCodeAt(0)),
        this._create_SPH_TweakRule("Courier New", 0, "Bold", "x".charCodeAt(0)),
        this._create_SPH_TweakRule("Courier New", 0, "Bold", "z".charCodeAt(0)),
        this._create_SPH_TweakRule("Courier New", 0, "Bold", "v".charCodeAt(0))
    ];

    /* Embolden these glyphs slightly.                                       */
    this.EMBOLDEN_Rules = [
        this._create_SPH_TweakRule("Courier New", 0, "Regular", 0),
        this._create_SPH_TweakRule("Courier New", 0, "Italic", 0)
    ];

    /* This is a CVT hack that makes thick horizontal stems on 2, 5, 7       */
    /* similar to Windows XP.                                                */
    this.TIMES_NEW_ROMAN_HACK_Rules = [
        this._create_SPH_TweakRule("Times New Roman", 16, "Italic", "2".charCodeAt(0)),
        this._create_SPH_TweakRule("Times New Roman", 16, "Italic", "5".charCodeAt(0)),
        this._create_SPH_TweakRule("Times New Roman", 16, "Italic", "7".charCodeAt(0)),
        this._create_SPH_TweakRule("Times New Roman", 16, "Regular", "2".charCodeAt(0)),
        this._create_SPH_TweakRule("Times New Roman", 16, "Regular", "5".charCodeAt(0)),
        this._create_SPH_TweakRule("Times New Roman", 16, "Regular", "7".charCodeAt(0)),
        this._create_SPH_TweakRule("Times New Roman", 17, "Italic", "2".charCodeAt(0)),
        this._create_SPH_TweakRule("Times New Roman", 17, "Italic", "5".charCodeAt(0)),
        this._create_SPH_TweakRule("Times New Roman", 17, "Italic", "7".charCodeAt(0)),
        this._create_SPH_TweakRule("Times New Roman", 17, "Regular", "2".charCodeAt(0)),
        this._create_SPH_TweakRule("Times New Roman", 17, "Regular", "5".charCodeAt(0)),
        this._create_SPH_TweakRule("Times New Roman", 17, "Regular", "7".charCodeAt(0))
    ];

    /* This fudges distance on 2 to get rid of the vanishing stem issue.     */
    /* A real solution to this is certainly welcome.                         */
    this.COURIER_NEW_2_HACK_Rules = [
        this._create_SPH_TweakRule("Courier New", 10, "Regular", "2".charCodeAt(0)),
        this._create_SPH_TweakRule("Courier New", 11, "Regular", "2".charCodeAt(0)),
        this._create_SPH_TweakRule("Courier New", 12, "Regular", "2".charCodeAt(0)),
        this._create_SPH_TweakRule("Courier New", 13, "Regular", "2".charCodeAt(0)),
        this._create_SPH_TweakRule("Courier New", 14, "Regular", "2".charCodeAt(0)),
        this._create_SPH_TweakRule("Courier New", 15, "Regular", "2".charCodeAt(0)),
        this._create_SPH_TweakRule("Courier New", 16, "Regular", "2".charCodeAt(0)),
        this._create_SPH_TweakRule("Courier New", 17, "Regular", "2".charCodeAt(0)),
        this._create_SPH_TweakRule("Courier New", 18, "Regular", "2".charCodeAt(0)),
        this._create_SPH_TweakRule("Courier New", 19, "Regular", "2".charCodeAt(0)),
        this._create_SPH_TweakRule("Courier New", 20, "Regular", "2".charCodeAt(0)),
        this._create_SPH_TweakRule("Courier New", 21, "Regular", "2".charCodeAt(0)),
        this._create_SPH_TweakRule("Courier New", 22, "Regular", "2".charCodeAt(0)),
        this._create_SPH_TweakRule("Courier New", 23, "Regular", "2".charCodeAt(0)),
        this._create_SPH_TweakRule("Courier New", 24, "Regular", "2".charCodeAt(0))
    ];


    this.FORCE_NATURAL_WIDTHS = false;

    /* Use compatible widths with these glyphs.  Compatible widths is always */
    /* on when doing B/W TrueType instructing, but is used selectively here, */
    /* typically on glyphs with 3 or more vertical stems.                    */
    this.COMPATIBLE_WIDTHS_Rules = [
        this._create_SPH_TweakRule("Arial Unicode MS", 12, "Regular Class", "m".charCodeAt(0)),
        this._create_SPH_TweakRule("Arial Unicode MS", 14, "Regular Class", "m".charCodeAt(0)),
        /* Cyrillic small letter sha */
        this._create_SPH_TweakRule("Arial", 10, "Regular Class", 0x448),
        this._create_SPH_TweakRule("Arial", 11, "Regular Class", "m".charCodeAt(0)),
        this._create_SPH_TweakRule("Arial", 12, "Regular Class", "m".charCodeAt(0)),
        /* Cyrillic small letter sha */
        this._create_SPH_TweakRule("Arial", 12, "Regular Class", 0x448),
        this._create_SPH_TweakRule("Arial", 13, "Regular Class", 0x448),
        this._create_SPH_TweakRule("Arial", 14, "Regular Class", "m".charCodeAt(0)),
        /* Cyrillic small letter sha */
        this._create_SPH_TweakRule("Arial", 14, "Regular Class", 0x448),
        this._create_SPH_TweakRule("Arial", 15, "Regular Class", 0x448),
        this._create_SPH_TweakRule("Arial", 17, "Regular Class", "m".charCodeAt(0)),
        this._create_SPH_TweakRule("DejaVu Sans", 15, "Regular Class", 0),
        this._create_SPH_TweakRule("Microsoft Sans Serif", 11, "Regular Class", 0),
        this._create_SPH_TweakRule("Microsoft Sans Serif", 12, "Regular Class", 0),
        this._create_SPH_TweakRule("Segoe UI", 11, "Regular Class", 0),
        this._create_SPH_TweakRule("Monaco", 0, "Regular Class", 0),
        this._create_SPH_TweakRule("Segoe UI", 12, "Regular Class", "m".charCodeAt(0)),
        this._create_SPH_TweakRule("Segoe UI", 14, "Regular Class", "m".charCodeAt(0)),
        this._create_SPH_TweakRule("Tahoma", 11, "Regular Class", 0),
        this._create_SPH_TweakRule("Times New Roman", 16, "Regular Class", "c".charCodeAt(0)),
        this._create_SPH_TweakRule("Times New Roman", 16, "Regular Class", "m".charCodeAt(0)),
        this._create_SPH_TweakRule("Times New Roman", 16, "Regular Class", "o".charCodeAt(0)),
        this._create_SPH_TweakRule("Times New Roman", 16, "Regular Class", "w".charCodeAt(0)),
        this._create_SPH_TweakRule("Trebuchet MS", 11, "Regular Class", 0),
        this._create_SPH_TweakRule("Trebuchet MS", 12, "Regular Class", 0),
        this._create_SPH_TweakRule("Trebuchet MS", 14, "Regular Class", 0),
        this._create_SPH_TweakRule("Trebuchet MS", 15, "Regular Class", 0),
        this._create_SPH_TweakRule("Ubuntu", 12, "Regular Class", "m".charCodeAt(0)),
        /* Cyrillic small letter sha */
        this._create_SPH_TweakRule("Verdana", 10, "Regular Class", 0x448),
        this._create_SPH_TweakRule("Verdana", 11, "Regular Class", 0x448),
        this._create_SPH_TweakRule("Verdana and Clones", 12, "Regular Class", "i".charCodeAt(0)),
        this._create_SPH_TweakRule("Verdana and Clones", 12, "Regular Class", "j".charCodeAt(0)),
        this._create_SPH_TweakRule("Verdana and Clones", 12, "Regular Class", "l".charCodeAt(0)),
        this._create_SPH_TweakRule("Verdana and Clones", 12, "Regular Class", "m".charCodeAt(0)),
        this._create_SPH_TweakRule("Verdana and Clones", 13, "Regular Class", "i".charCodeAt(0)),
        this._create_SPH_TweakRule("Verdana and Clones", 13, "Regular Class", "j".charCodeAt(0)),
        this._create_SPH_TweakRule("Verdana and Clones", 13, "Regular Class", "l".charCodeAt(0)),
        this._create_SPH_TweakRule("Verdana and Clones", 14, "Regular Class", "m".charCodeAt(0))
    ];


    /* Scaling slightly in the x-direction prior to hinting results in       */
    /* more visually pleasing glyphs in certain cases.                       */
    /* This sometimes needs to be coordinated with compatible width rules.   */
    /* A value of 1000 corresponds to a scaled value of 1.0.                 */
    this.X_SCALING_Rules = [
        this._create_SPH_ScaleRule("DejaVu Sans", 12, "Regular Class", "m".charCodeAt(0), 950),
        this._create_SPH_ScaleRule("Verdana and Clones", 12, "Regular Class", "a".charCodeAt(0), 1100),
        this._create_SPH_ScaleRule("Verdana and Clones", 13, "Regular Class", "a".charCodeAt(0), 1050),
        this._create_SPH_ScaleRule("Arial", 11, "Regular Class", "m".charCodeAt(0), 975),
        this._create_SPH_ScaleRule("Arial", 12, "Regular Class", "m".charCodeAt(0), 1050),
        /* Cyrillic small letter el */
        this._create_SPH_ScaleRule("Arial", 13, "Regular Class", 0x43B, 950),
        this._create_SPH_ScaleRule("Arial", 13, "Regular Class", "o".charCodeAt(0), 950),
        this._create_SPH_ScaleRule("Arial", 13, "Regular Class", "e".charCodeAt(0), 950),
        this._create_SPH_ScaleRule("Arial", 14, "Regular Class", "m".charCodeAt(0), 950),
        /* Cyrillic small letter el */
        this._create_SPH_ScaleRule("Arial", 15, "Regular Class", 0x43B, 925),
        this._create_SPH_ScaleRule("Bitstream Vera Sans", 10, "Regular/Italic Class", 0, 1100),
        this._create_SPH_ScaleRule("Bitstream Vera Sans", 12, "Regular/Italic Class", 0, 1050),
        this._create_SPH_ScaleRule("Bitstream Vera Sans", 16, "Regular Class", 0, 1050),
        this._create_SPH_ScaleRule("Bitstream Vera Sans", 9, "Regular/Italic Class", 0, 1050),
        this._create_SPH_ScaleRule("DejaVu Sans", 12, "Regular Class", "l".charCodeAt(0), 975),
        this._create_SPH_ScaleRule("DejaVu Sans", 12, "Regular Class", "i".charCodeAt(0), 975),
        this._create_SPH_ScaleRule("DejaVu Sans", 12, "Regular Class", "j".charCodeAt(0), 975),
        this._create_SPH_ScaleRule("DejaVu Sans", 13, "Regular Class", "l".charCodeAt(0), 950),
        this._create_SPH_ScaleRule("DejaVu Sans", 13, "Regular Class", "i".charCodeAt(0), 950),
        this._create_SPH_ScaleRule("DejaVu Sans", 13, "Regular Class", "j".charCodeAt(0), 950),
        this._create_SPH_ScaleRule("DejaVu Sans", 10, "Regular/Italic Class", 0, 1100),
        this._create_SPH_ScaleRule("DejaVu Sans", 12, "Regular/Italic Class", 0, 1050),
        this._create_SPH_ScaleRule("Georgia", 10, "", 0, 1050),
        this._create_SPH_ScaleRule("Georgia", 11, "", 0, 1100),
        this._create_SPH_ScaleRule("Georgia", 12, "", 0, 1025),
        this._create_SPH_ScaleRule("Georgia", 13, "", 0, 1050),
        this._create_SPH_ScaleRule("Georgia", 16, "", 0, 1050),
        this._create_SPH_ScaleRule("Georgia", 17, "", 0, 1030),
        this._create_SPH_ScaleRule("Liberation Sans", 12, "Regular Class", "m".charCodeAt(0), 1100),
        this._create_SPH_ScaleRule("Lucida Grande", 11, "Regular Class", "m".charCodeAt(0), 1100),
        this._create_SPH_ScaleRule("Microsoft Sans Serif", 11, "Regular Class", "m".charCodeAt(0), 950),
        this._create_SPH_ScaleRule("Microsoft Sans Serif", 12, "Regular Class", "m".charCodeAt(0), 1050),
        this._create_SPH_ScaleRule("Segoe UI", 12, "Regular Class", "H".charCodeAt(0), 1050),
        this._create_SPH_ScaleRule("Segoe UI", 12, "Regular Class", "m".charCodeAt(0), 1050),
        this._create_SPH_ScaleRule("Segoe UI", 14, "Regular Class", "m".charCodeAt(0), 1050),
        this._create_SPH_ScaleRule("Tahoma", 11, "Regular Class", "i".charCodeAt(0), 975),
        this._create_SPH_ScaleRule("Tahoma", 11, "Regular Class", "l".charCodeAt(0), 975),
        this._create_SPH_ScaleRule("Tahoma", 11, "Regular Class", "j".charCodeAt(0), 900),
        this._create_SPH_ScaleRule("Tahoma", 11, "Regular Class", "m".charCodeAt(0), 918),
        this._create_SPH_ScaleRule("Verdana", 10, "Regular/Italic Class", 0, 1100),
        this._create_SPH_ScaleRule("Verdana", 12, "Regular Class", "m".charCodeAt(0), 975),
        this._create_SPH_ScaleRule("Verdana", 12, "Regular/Italic Class", 0, 1050),
        this._create_SPH_ScaleRule("Verdana", 13, "Regular/Italic Class", "i".charCodeAt(0), 950),
        this._create_SPH_ScaleRule("Verdana", 13, "Regular/Italic Class", "j".charCodeAt(0), 950),
        this._create_SPH_ScaleRule("Verdana", 13, "Regular/Italic Class", "l".charCodeAt(0), 950),
        this._create_SPH_ScaleRule("Verdana", 16, "Regular Class", 0, 1050),
        this._create_SPH_ScaleRule("Verdana", 9, "Regular/Italic Class", 0, 1050),
        this._create_SPH_ScaleRule("Times New Roman", 16, "Regular Class", "m".charCodeAt(0), 918),
        this._create_SPH_ScaleRule("Trebuchet MS", 11, "Regular Class", "m".charCodeAt(0), 800),
        this._create_SPH_ScaleRule("Trebuchet MS", 12, "Regular Class", "m".charCodeAt(0), 800)
    ];

    /*
    this.COMPATIBLE_WIDTHS_Rules = [
        this._create_SPH_TweakRule("-", 0, "", 0)
    ];

    this.X_SCALING_Rules = [
        this._create_SPH_ScaleRule("-", 0, "", 0, 1000)
    ];
    */

    this.TWEAK_RULES = function(_loader, _glyph_index, _rules, _flag)
    {
        var face = _loader.face;
        if (this.sph_test_tweak(face, face.family_name, _loader.size.metrics.x_ppem, face.style_name, _glyph_index, _rules, _rules.length))
            loader.exec.sph_tweak_flags |= _flag;
    };
    this.TWEAK_RULES_EXCEPTIONS = function(_loader, _glyph_index, _rules, _flag)
    {
        var face = _loader.face;
        if (this.sph_test_tweak(face, face.family_name, _loader.size.metrics.x_ppem, face.style_name, _glyph_index, _rules, _rules.length))
            loader.exec.sph_tweak_flags &= ~_flagS;
    };

    this.is_member_of_family_class = function(detected_font_name, rule_font_name)
    {
        /* Does font name match rule family? */
        if (detected_font_name == rule_font_name)
            return true;

        /* Is font name a wildcard ""? */
        if (rule_font_name == "")
            return true;

        var _fcr = this.FAMILY_CLASS_Rules[rule_font_name];
        if (undefined !== _fcr)
        {
            if (undefined !== _fcr[detected_font_name])
                return true;
        }

        return false;
    };

    this.is_member_of_style_class = function(detected_font_style, rule_font_style)
    {
        /* Does font style match rule style? */
        if (detected_font_style == rule_font_style)
            return true;

        /* Is font style a wildcard ""? */
        if (rule_font_style == "")
            return true;

        /* Is font style contained in a class list? */
        var _scr = this.STYLE_CLASS_Rules[rule_font_style];
        if (undefined !== _scr)
        {
            if (undefined !== _scr[detected_font_style])
                return true;
        }

        return false;
    };

    this.sph_test_tweak = function(face, family, ppem, style, glyph_index, rule, num_rules)
    {
        /* rule checks may be able to be optimized further */
        for (var i = 0; i < num_rules; i++)
        {
            if (family != "" && this.is_member_of_family_class(family, rule[i].family))
            {
                if (rule[i].ppem == 0 || rule[i].ppem == ppem)
                {
                    if (style != "" && this.is_member_of_style_class(style, rule[i].style))
                    {
                        if (rule[i].glyph == 0 || FT_Get_Char_Index(face, rule[i].glyph) == glyph_index)
                            return true;
                    }
                }
            }
        }
        return false;
    };

    this.scale_test_tweak = function(face, family, ppem, style, glyph_index, rule, num_rules)
    {
        /* rule checks may be able to be optimized further */
        for (var i = 0; i < num_rules; i++)
        {
            if (family != "" && this.is_member_of_family_class(family, rule[i].family))
            {
                if (rule[i].ppem == 0 || rule[i].ppem == ppem)
                {
                    if (style != "" && this.is_member_of_style_class(style, rule[i].style))
                    {
                        if (rule[i].glyph == 0 || FT_Get_Char_Index(face, rule[i].glyph) == glyph_index)
                            return rule[i].scale;
                    }
                }
            }
        }
        return 1000;
    };

    this.sph_test_tweak_x_scaling = function(face, family, ppem, style, glyph_index)
    {
        return this.scale_test_tweak(face, family, ppem, style, glyph_index, this.X_SCALING_Rules, this.X_SCALING_Rules.length);
    };

    this.sph_set_tweaks = function(loader, glyph_index)
    {
        var face = loader.face;

        /* don't apply rules if style isn't set */
        if (face.style_name == "")
            return;

        this.TWEAK_RULES(loader, glyph_index, this.PIXEL_HINTING_Rules, FT_Common.SPH_TWEAK_PIXEL_HINTING);

        if (loader.exec.sph_tweak_flags & FT_Common.SPH_TWEAK_PIXEL_HINTING)
        {
            loader.exec.ignore_x_mode = false;
            return;
        }

        this.TWEAK_RULES(loader, glyph_index, this.ALLOW_X_DMOVE_Rules, FT_Common.SPH_TWEAK_ALLOW_X_DMOVE);
        this.TWEAK_RULES(loader, glyph_index, this.ALWAYS_DO_DELTAP_Rules, FT_Common.SPH_TWEAK_ALWAYS_DO_DELTAP);
        this.TWEAK_RULES(loader, glyph_index, this.ALWAYS_SKIP_DELTAP_Rules, FT_Common.SPH_TWEAK_ALWAYS_SKIP_DELTAP);
        this.TWEAK_RULES(loader, glyph_index, this.DEEMBOLDEN_Rules, FT_Common.SPH_TWEAK_DEEMBOLDEN);
        this.TWEAK_RULES(loader, glyph_index, this.DO_SHPIX_Rules, FT_Common.SPH_TWEAK_DO_SHPIX);
        this.TWEAK_RULES(loader, glyph_index, this.EMBOLDEN_Rules, FT_Common.SPH_TWEAK_EMBOLDEN);
        this.TWEAK_RULES(loader, glyph_index, this.MIAP_HACK_Rules, FT_Common.SPH_TWEAK_MIAP_HACK);
        this.TWEAK_RULES(loader, glyph_index, this.NORMAL_ROUND_Rules, FT_Common.SPH_TWEAK_NORMAL_ROUND);
        this.TWEAK_RULES(loader, glyph_index, this.NO_ALIGNRP_AFTER_IUP_Rules, FT_Common.SPH_TWEAK_NO_ALIGNRP_AFTER_IUP);
        this.TWEAK_RULES(loader, glyph_index, this.NO_CALL_AFTER_IUP_Rules, FT_Common.SPH_TWEAK_NO_CALL_AFTER_IUP);
        this.TWEAK_RULES(loader, glyph_index, this.NO_DELTAP_AFTER_IUP_Rules, FT_Common.SPH_TWEAK_NO_DELTAP_AFTER_IUP);
        this.TWEAK_RULES(loader, glyph_index, this.RASTERIZER_35_Rules, FT_Common.SPH_TWEAK_RASTERIZER_35);
        this.TWEAK_RULES(loader, glyph_index, this.SKIP_IUP_Rules, FT_Common.SPH_TWEAK_SKIP_IUP);

        this.TWEAK_RULES(loader, glyph_index, this.SKIP_OFFPIXEL_Y_MOVES_Rules, FT_Common.SPH_TWEAK_SKIP_OFFPIXEL_Y_MOVES);
        this.TWEAK_RULES_EXCEPTIONS(loader, glyph_index, this.SKIP_OFFPIXEL_Y_MOVES_Rules_Exceptions, FT_Common.SPH_TWEAK_SKIP_OFFPIXEL_Y_MOVES);

        this.TWEAK_RULES(loader, glyph_index, this.SKIP_NONPIXEL_Y_MOVES_DELTAP_Rules, FT_Common.SPH_TWEAK_SKIP_NONPIXEL_Y_MOVES_DELTAP);

        this.TWEAK_RULES(loader, glyph_index, this.SKIP_NONPIXEL_Y_MOVES_Rules, FT_Common.SPH_TWEAK_SKIP_NONPIXEL_Y_MOVES);
        this.TWEAK_RULES_EXCEPTIONS(loader, glyph_index, this.SKIP_NONPIXEL_Y_MOVES_Rules_Exceptions, FT_Common.SPH_TWEAK_SKIP_NONPIXEL_Y_MOVES);

        this.TWEAK_RULES(loader, glyph_index, this.ROUND_NONPIXEL_Y_MOVES_Rules, FT_Common.SPH_TWEAK_ROUND_NONPIXEL_Y_MOVES);
        this.TWEAK_RULES_EXCEPTIONS(loader, glyph_index, this.ROUND_NONPIXEL_Y_MOVES_Rules_Exceptions, FT_Common.SPH_TWEAK_ROUND_NONPIXEL_Y_MOVES);

        if (loader.exec.sph_tweak_flags & FT_Common.SPH_TWEAK_RASTERIZER_35)
        {
            if (loader.exec.rasterizer_version != FT_Common.TT_INTERPRETER_VERSION_35)
            {
                loader.exec.rasterizer_version  = FT_Common.TT_INTERPRETER_VERSION_35;
                loader.exec.size.cvt_ready      = false;

                tt_size_ready_bytecode(loader.exec.size, (loader.load_flags & FT_Common.FT_LOAD_PEDANTIC) != 0);
            }
            else
                loader.exec.rasterizer_version  = FT_Common.TT_INTERPRETER_VERSION_35;
        }
        else
        {
            if (loader.exec.rasterizer_version != FT_Common.SPH_OPTION_SET_RASTERIZER_VERSION)
            {
                loader.exec.rasterizer_version  = FT_Common.SPH_OPTION_SET_RASTERIZER_VERSION;
                loader.exec.size.cvt_ready      = false;

                tt_size_ready_bytecode(loader.exec.size, (loader.load_flags & FT_Common.FT_LOAD_PEDANTIC) != 0);
            }
            else
                loader.exec.rasterizer_version = FT_Common.SPH_OPTION_SET_RASTERIZER_VERSION;
        }

        if ((loader.load_flags & FT_Common.FT_LOAD_NO_HINTING) == 0)
        {
            this.TWEAK_RULES(loader, glyph_index, this.TIMES_NEW_ROMAN_HACK_Rules, FT_Common.SPH_TWEAK_TIMES_NEW_ROMAN_HACK);
            this.TWEAK_RULES(loader, glyph_index, this.COURIER_NEW_2_HACK_Rules, FT_Common.COURIER_NEW_2_HACK_Rules);
        }

        if (this.sph_test_tweak(face, face.family_name, loader.size.metrics.x_ppem, face.style_name, glyph_index, this.COMPATIBILITY_MODE_Rules, this.COMPATIBILITY_MODE_Rules.length))
            loader.exec.face.sph_compatibility_mode = true;

        if (((loader.load_flags & FT_Common.FT_LOAD_NO_HINTING) == 0) && !loader.exec.compatible_widths)
        {
            if (this.sph_test_tweak(face, face.family_name, loader.size.metrics.x_ppem, face.style_name, glyph_index, this.COMPATIBLE_WIDTHS_Rules, this.COMPATIBLE_WIDTHS_Rules.length))
                loader.exec.face.sph_compatibility_mode = true;
        }
    };
}

var global_SubpixHintingHacks = new CSubpixHintingHacks();