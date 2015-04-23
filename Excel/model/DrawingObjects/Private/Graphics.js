"use strict";

CGraphics.prototype.DrawLockParagraph = function(lock_type, x, y1, y2)
{
	if (lock_type == c_oAscLockTypes.kLockTypeNone || editor.WordControl.m_oDrawingDocument.IsLockObjectsEnable === false || editor.isViewMode)
		return;

	if (lock_type == c_oAscLockTypes.kLockTypeMine)
	{
		this.p_color(22, 156, 0, 255);
		//this.p_color(155, 187, 277, 255);
	}
	else
		this.p_color(238, 53, 37, 255);

	var _x = this.m_oFullTransform.TransformPointX(x, y1) >> 0;
	var _xT = this.m_oFullTransform.TransformPointX(x, y2) >> 0;
	var _y1 = (this.m_oFullTransform.TransformPointY(x, y1) >> 0) + 0.5;
	var _y2 = (this.m_oFullTransform.TransformPointY(x, y2) >> 0) - 1.5;

	var ctx = this.m_oContext;
	if (_x != _xT)
	{
		// значит какой-то трансформ
		var dKoefMMToPx = 1 / Math.max(this.m_oCoordTransform.sx, 0.001);
		this.p_width(1000 * dKoefMMToPx);

		var w_dot = 2 * dKoefMMToPx;
		var w_dist = 1 * dKoefMMToPx;
		var w_len_indent = 3;

		var _interf = editor.WordControl.m_oDrawingDocument.AutoShapesTrack;

		this._s();
		_interf.AddLineDash(ctx, x, y1, x, y2, w_dot, w_dist);
		_interf.AddLineDash(ctx, x, y1, x + w_len_indent, y1, w_dot, w_dist);
		_interf.AddLineDash(ctx, x, y2, x + w_len_indent, y2, w_dot, w_dist);

		this.ds();
		return;
	}

	var bIsInt = this.m_bIntegerGrid;
	if (!bIsInt)
		this.SetIntegerGrid(true);

	ctx.lineWidth = 1;

	var w_dot = 2;
	var w_dist = 1;
	var w_len_indent = (3 * this.m_oCoordTransform.sx) >> 0;

	this._s();

	var y_mem = _y1 - 0.5;
	while (true)
	{
		if ((y_mem + w_dot) > _y2)
			break;
		ctx.moveTo(_x + 0.5,y_mem);
		y_mem+=w_dot;
		ctx.lineTo(_x + 0.5,y_mem);
		y_mem+=w_dist;
	}

	var x_max = _x + w_len_indent;

	var x_mem = _x;
	while (true)
	{
		if (x_mem > x_max)
			break;
		ctx.moveTo(x_mem,_y1);
		x_mem+=w_dot;
		ctx.lineTo(x_mem,_y1);
		x_mem+=w_dist;
	}
	x_mem = _x;
	while (true)
	{
		if (x_mem > x_max)
			break;
		ctx.moveTo(x_mem,_y2);
		x_mem+=w_dot;
		ctx.lineTo(x_mem,_y2);
		x_mem+=w_dist;
	}

	this.ds();

	if (!bIsInt)
		this.SetIntegerGrid(false);
};

CGraphics.prototype.DrawLockObjectRect = function(lock_type, x, y, w, h)
{
	if (lock_type == c_oAscLockTypes.kLockTypeNone)
		return;

	if (lock_type == c_oAscLockTypes.kLockTypeMine)
	{
		this.p_color(22, 156, 0, 255);
		//this.p_color(155, 187, 277, 255);
	}
	else
		this.p_color(238, 53, 37, 255);

	var ctx = this.m_oContext;

	var _m = this.m_oTransform;
	if (_m.sx != 1.0 || _m.shx != 0.0 || _m.shy != 0.0 || _m.sy != 1.0)
	{
		// значит какой-то трансформ
		var dKoefMMToPx = 1 / Math.max(this.m_oCoordTransform.sx, 0.001);
		this.p_width(1000 * dKoefMMToPx);

		var w_dot = 2 * dKoefMMToPx;
		var w_dist = 1 * dKoefMMToPx;

		var _interf = this.m_oAutoShapesTrack;

		var eps = 5 * dKoefMMToPx;
		var _x = x - eps;
		var _y = y - eps;
		var _r = x + w + eps;
		var _b = y + h + eps;

		this._s();
		_interf.AddRectDash(ctx, _x, _y, _r, _y, _x, _b, _r, _b, w_dot, w_dist, true);
		this._s();
		return;
	}

	var bIsInt = this.m_bIntegerGrid;
	if (!bIsInt)
		this.SetIntegerGrid(true);

	ctx.lineWidth = 1;

	var w_dot = 2;
	var w_dist = 2;

	var eps = 5;

	var _x = (this.m_oFullTransform.TransformPointX(x, y) >> 0) - eps + 0.5;
	var _y = (this.m_oFullTransform.TransformPointY(x, y) >> 0) - eps + 0.5;

	var _r = (this.m_oFullTransform.TransformPointX(x+w, y+h) >> 0) + eps + 0.5;
	var _b = (this.m_oFullTransform.TransformPointY(x+w, y+h) >> 0) + eps + 0.5;

	this._s();

	for (var i = _x; i < _r; i += w_dist)
	{
		ctx.moveTo(i, _y);
		i += w_dot;

		if (i > _r)
			i = _r;

		ctx.lineTo(i, _y);
	}
	for (var i = _y; i < _b; i += w_dist)
	{
		ctx.moveTo(_r, i);
		i += w_dot;

		if (i > _b)
			i = _b;

		ctx.lineTo(_r, i);
	}
	for (var i = _r; i > _x; i -= w_dist)
	{
		ctx.moveTo(i, _b);
		i -= w_dot;

		if (i < _x)
			i = _x;

		ctx.lineTo(i, _b);
	}
	for (var i = _b; i > _y; i -= w_dist)
	{
		ctx.moveTo(_x, i);
		i -= w_dot;

		if (i < _y)
			i = _y;

		ctx.lineTo(_x, i);
	}

	this.ds();

	if (!bIsInt)
		this.SetIntegerGrid(false);
};