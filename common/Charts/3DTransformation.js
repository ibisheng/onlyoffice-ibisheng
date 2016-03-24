/** @constructor */
function Processor3D(width, height, left, right, bottom, top, chartSpace, chartsDrawer) {
	this.widthCanvas = width;
	this.heightCanvas = height;
	
	this.left = left ? left : 0;
	this.right = right ? right : 0;
	this.bottom = bottom ?  bottom : 0;
	this.top = top ? top : 0;
	
	this.cameraDiffZ = 0;
	this.cameraDiffX = 0;
	this.cameraDiffY = 0;
	
	this.scaleY = 1;
	this.scaleX = 1;
	this.scaleZ = 1;
	
	this.aspectRatioY = 1;
	this.aspectRatioX = 1;
	this.aspectRatioZ = 1;
	
	this.specialStandardScaleX = 1;
	
	this.view3D = chartSpace.chart.view3D;
	this.chartSpace = chartSpace;
	this.chartsDrawer = chartsDrawer;
	
	this.rPerspective = 0;
	
	this.hPercent = null;
	
	this.angleOx = this.view3D && this.view3D.rotX ? (- this.view3D.rotX / 360) * (Math.PI * 2) : 0;
	this.angleOy = this.view3D && this.view3D.rotY ? (- this.view3D.rotY / 360) * (Math.PI * 2) : 0;
	this.angleOz = this.view3D && this.view3D.rotZ ? (- this.view3D.rotZ / 360) * (Math.PI * 2) : 0;
	
	this.orientationCatAx = null;
	this.orientationValAx = null;
}

Processor3D.prototype.calaculate3DProperties = function(baseDepth, gapDepth, isTest)
{
	this.calculateCommonOptions();
	
	//TODO baseDepth -  не универсальный параметр, позже переделать
	this._calculateAutoHPercent();
	
	//рассчёт коэффициэнта отношения ширины / высоты
	this._calcAspectRatio();
	
	//TODO рассчёт коэффицианты для диаграмм типа standard. позже необходимо отказаться
	//this._calcSpecialStandardScaleX();
	
	//глубина
	this.depthPerspective = this.view3D.rAngAx ? this._calculateDepth() : this._calculateDepthPerspective();;
	
	//угол перспективы
	this._calculatePerspective(this.view3D);
	
	//после рассчета глубины меняются пропорции ширины и высоты
	if(this.view3D.rAngAx)
		this._calculateScaleFromDepth();
	
	//сдвиг камеры для того, чтобы попали все линии
	if(!isTest)
		this._calculateCameraDiff();
	
	if(!isTest && this.view3D.rAngAx)
		this._recalculateScaleWithMaxWidth();
};

Processor3D.prototype.calculateCommonOptions = function()
{
	this.orientationCatAx = this.chartSpace && this.chartSpace.chart.plotArea.catAx ? this.chartSpace.chart.plotArea.catAx.scaling.orientation : ORIENTATION_MIN_MAX;
	this.orientationValAx = this.chartSpace && this.chartSpace.chart.plotArea.valAx ? this.chartSpace.chart.plotArea.valAx.scaling.orientation : ORIENTATION_MIN_MAX;
};

Processor3D.prototype._calculateAutoHPercent = function()
{
	var widthLine = this.widthCanvas - (this.left + this.right);
	var heightLine = this.heightCanvas - (this.top + this.bottom);
	
	if(this.hPercent == null)
	{
		this.hPercent = this.view3D.hPercent === null ? (heightLine / widthLine) : this.view3D.hPercent / 100;
		if(this.chartsDrawer.calcProp.type === "HBar" && this.view3D.hPercent === null)
			this.hPercent = 1 / this.hPercent;
	}
};

Processor3D.prototype._recalculateScaleWithMaxWidth = function()
{	
	var widthLine = this.widthCanvas - (this.left + this.right);
	var heightLine = this.heightCanvas - (this.top + this.bottom);
	
	var subType = this.chartsDrawer.calcProp.subType;
	var isStandardType = subType === "standard" || this.chartsDrawer.calcProp.type === "Line" || this.chartsDrawer.calcProp.type === "Area" && subType === "normal" ? true : false;
	if(!isStandardType)
	{
		var optimalWidth = heightLine * 10;
		var widthCanvas = this.widthCanvas;
		
		this.widthCanvas = optimalWidth + (this.left + this.right);
		this._calculateScaleNStandard();
		var optimalWidthLine = this.depthPerspective * Math.sin(-this.angleOy) + ((this.widthCanvas - (this.left + this.right)) / this.aspectRatioX) / this.scaleX;
		var kF = optimalWidthLine / widthLine;
		
		if(optimalWidthLine < widthLine)
		{
			this.widthCanvas = widthCanvas;
			this._calculateScaleNStandard();
		}
		else
		{
			this.aspectRatioX = widthLine / ((optimalWidthLine - this.depthPerspective*Math.sin(-this.angleOy))/kF);
			this.scaleY = this.scaleY * kF;
			this.scaleZ = this.scaleZ * kF;
			
			this.widthCanvas = widthCanvas;
		}

		this._recalculateCameraDiff();
		return;
	}
	
	//TODO протестировать, и если не будет проблем, то убрать if-else
	if(this.angleOy != 0)
	{
		if(this.depthPerspective * Math.sin(-this.angleOy) + ((this.widthCanvas - (this.left + this.right)) / this.aspectRatioX) / this.scaleX <= widthLine)
			return;
		
		//todo оптимальную ширину нужно пересмотреть
		//оптимальная ширина -  ширина при которой не происходит масштабирования по ширине
		var optimalWidth = heightLine * 10;
		var widthCanvas = this.widthCanvas;
		
		//рассчитываем параметры диаграммы при оптимальной ширине
		this.widthCanvas = optimalWidth + (this.left + this.right);
		this.calaculate3DProperties(null, null, true);
		var optimalWidthLine = this.depthPerspective * Math.sin(-this.angleOy) + ((this.widthCanvas - (this.left + this.right)) / this.aspectRatioX) / this.scaleX;
		var kF = optimalWidthLine / widthLine;
		
		this.aspectRatioX = widthLine / ((optimalWidthLine - this.depthPerspective*Math.sin(-this.angleOy))/kF);
		this.scaleY = this.scaleY * kF;
		this.scaleZ = this.scaleZ * kF;
		
		this.widthCanvas = widthCanvas;
		
		this._recalculateCameraDiff();
	}
	else
	{
		//todo оптимальную ширину нужно пересмотреть
		//оптимальная ширина -  ширина при которой не происходит масштабирования по ширине
		var optimalWidth = heightLine * 10;
		var widthCanvas = this.widthCanvas;
		
		//рассчитываем параметры диаграммы при оптимальной ширине
		this.widthCanvas = optimalWidth + (this.left + this.right);
		var scaleX = this.scaleX;
		var scaleY = this.scaleY;
		var scaleZ = this.scaleZ;
		
		var aspectRatioX = this.aspectRatioX;
		var aspectRatioY = this.aspectRatioY;
		var aspectRatioZ = this.aspectRatioZ;
		
		this.calaculate3DProperties(null, null, true);
		var optimalWidthLine = this.depthPerspective * Math.sin(-this.angleOy) + ((this.widthCanvas - (this.left + this.right)) / this.aspectRatioX) / this.scaleX;
		
		
		if(optimalWidthLine < widthLine)
		{
			this.widthCanvas = widthCanvas;
			this.scaleX = scaleX;
			this.scaleY = scaleY;
			this.scaleZ = scaleZ;
			
			this.aspectRatioX = aspectRatioX;
			this.aspectRatioY = aspectRatioY;
			this.aspectRatioZ = aspectRatioZ;
			
			return;
		}
		
		
		var kF = optimalWidthLine / widthLine;
		this.aspectRatioX = widthLine / ((optimalWidthLine - this.depthPerspective*Math.sin(-this.angleOy))/kF);
		this.scaleY = this.scaleY * kF;
		this.scaleZ = this.scaleZ * kF;
		
		this.widthCanvas = widthCanvas;
		
		this._recalculateCameraDiff();
	}
};

Processor3D.prototype._calculateScaleNStandard = function()
{
	var ptCount = this.chartsDrawer.calcProp.ptCount;
	
	var widthLine = this.widthCanvas - (this.left + this.right);
	var heightLine = this.heightCanvas - (this.top + this.bottom);
	
	var trueDepth = this.depthPerspective * Math.sin(-this.angleOx);
	var mustHeight = heightLine - trueDepth;
	var mustWidth = this.chartsDrawer.calcProp.type === "HBar" ? mustHeight * this.hPercent : mustHeight / this.hPercent;
	
	var areaStackedKf = this.chartsDrawer.calcProp.type === "Area" && this.chartsDrawer.calcProp.subType !== "normal" ?  (ptCount / ((ptCount - 1))) : 1;
	
	//без маштабирования
	if(this.angleOy === 0)
	{
		this.aspectRatioX = ((this.widthCanvas - (this.left + this.right)) / mustWidth) / areaStackedKf;
		this.scaleX = 1;
		this.scaleY = 1;
		this.aspectRatioY = heightLine / mustHeight;
	}
	else
	{
		this.aspectRatioX = ((this.widthCanvas - (this.left + this.right)) / mustWidth) / areaStackedKf;
		this.scaleX = 1;
		this.scaleY = 1;
		this.aspectRatioY = heightLine / mustHeight;
	}
	
	var optimalWidthLine = (widthLine / this.aspectRatioX) / this.scaleX;
	
	
	if(optimalWidthLine < widthLine)
	{
		return;
	}
	
	var kF = optimalWidthLine / (widthLine);
	this.aspectRatioX = kF * this.aspectRatioX;
	this.scaleY = this.scaleY * kF;
	this.scaleZ = this.scaleZ * kF;
};

Processor3D.prototype._recalculateCameraDiff = function()
{
	this.cameraDiffX = 0;
	this.cameraDiffY = 0;
	this.cameraDiffZ = 0;
	
	this._calculateCameraDiff();
};

Processor3D.prototype.calculateZPositionValAxis = function()
{
	var result = 0;
	if(!this.view3D.rAngAx)
	{
		var angleOyAbs = Math.abs(this.angleOy);
		if((angleOyAbs >= Math.PI / 2 && angleOyAbs < Math.PI) ||  (angleOyAbs >= 3 * Math.PI / 2 && angleOyAbs < 2 * Math.PI))
			result = this.depthPerspective;
	}
	else if(this.chartsDrawer.calcProp.type !== "HBar" && this.orientationCatAx !== ORIENTATION_MIN_MAX && this.depthPerspective !== undefined)
	{
		//if(this.chartSpace.chart.plotArea.valAx && this.chartSpace.chart.plotArea.valAx.yPoints && this.chartSpace.chart.plotArea.catAx.posY === this.chartSpace.chart.plotArea.valAx.yPoints[0].pos)
			result = this.depthPerspective;
	}
	else if(this.chartsDrawer.calcProp.type === "HBar" && this.orientationCatAx !== ORIENTATION_MIN_MAX && this.depthPerspective !== undefined)
	{
		//if(this.chartSpace.chart.plotArea.valAx && this.chartSpace.chart.plotArea.valAx.yPoints && this.chartSpace.chart.plotArea.catAx.posY === this.chartSpace.chart.plotArea.valAx.yPoints[0].pos)
			result = this.depthPerspective;
	}
	
	return result;
};

Processor3D.prototype.calculateZPositionCatAxis = function()
{
	var result = 0;
	if(!this.view3D.rAngAx)
	{
		result = Math.cos(this.angleOy) > 0 ? 0 : this.depthPerspective;
	}
	else if(this.chartsDrawer.calcProp.type !== "HBar" && this.orientationValAx !== ORIENTATION_MIN_MAX && this.depthPerspective !== undefined)
	{
		if(this.chartSpace.chart.plotArea.valAx && this.chartSpace.chart.plotArea.valAx.yPoints && this.chartSpace.chart.plotArea.catAx.posY === this.chartSpace.chart.plotArea.valAx.yPoints[0].pos)
			result = this.depthPerspective;
	}
	else if(this.chartsDrawer.calcProp.type === "HBar" && this.orientationValAx !== ORIENTATION_MIN_MAX && this.depthPerspective !== undefined)
	{
		result = this.depthPerspective;
	}
	
	return result;
};

Processor3D.prototype.convertAndTurnPoint = function(x, y, z, cameraDiffZ)
{
	var heightChart = this.heightCanvas - this.top - this.bottom;
	var widthOriginalChart = this.widthCanvas - this.left - this.right;
	var heightOriginalChart = heightChart;			
	var widthChart = heightChart;

	//aspectRatio
	if(this.view3D.rAngAx)
	{
		x = x / this.aspectRatioX;
		y = y / this.aspectRatioY;
	}
	else
	{
		var aspectRatio = (widthOriginalChart) / (heightOriginalChart);
		x = x / aspectRatio;
	}
	

	x = x / this.scaleX;
	y = y / this.scaleY;
	z = z / this.scaleZ;
	
	var point3D = new Point3D(x, y, z, this);
	
	//diff
	var centerXDiff = widthChart / 2 + this.left / 2;
	var centerYDiff = heightChart / 2 + this.top;
	var centerZDiff = this.depthPerspective / 2;
	
	
	point3D.offset(-centerXDiff, -centerYDiff, -centerZDiff);
	
	//rotate
	var matrixRotateAllAxis;
	if(!this.view3D.rAngAx)
		matrixRotateAllAxis = this._getMatrixRotateAllAxis();
	else
		matrixRotateAllAxis = this._shearXY();
		
	point3D.multiplyPointOnMatrix1(matrixRotateAllAxis);
	
	// diff camera for charts write into rect
	point3D.offset(this.cameraDiffX, this.cameraDiffY, this.cameraDiffZ);
	
	//project
	var projectionPoint = point3D;
	if(!this.view3D.rAngAx)
	{
		var projectiveMatrix = this._getPerspectiveProjectionMatrix(1 / (this.rPerspective));
		projectionPoint = point3D.project(projectiveMatrix);
	}
	
	//undiff
	var specialReverseDiff = this.widthCanvas / 2 + (this.left - this.right) / 2;
	projectionPoint.offset(specialReverseDiff, centerYDiff, centerZDiff);
	
	return {x: projectionPoint.x, y: projectionPoint.y};
};

Processor3D.prototype.convertAndTurnPointForPie = function(x, y, z, cameraDiffZ)
{
	var heightChart = this.heightCanvas - this.top - this.bottom;
	var widthOriginalChart = this.widthCanvas - this.left - this.right;
	var heightOriginalChart = heightChart;			
	var widthChart = heightChart;

	//aspectRatio
	/*x = x / this.aspectRatioX;
	y = y / this.aspectRatioY;

	x = x / this.scaleX;
	y = y / this.scaleY;
	z = z / this.scaleZ;*/
	
	var point3D = new Point3D(x, y, z, this);
	
	//diff
	var centerXDiff = widthChart / 2 + this.left / 2;
	var centerYDiff = heightChart / 2 + this.top;
	var centerZDiff = this.depthPerspective / 2;
	
	
	point3D.offset(-centerXDiff, -centerYDiff, -centerZDiff);
	
	//rotate
	var matrixRotateAllAxis;
	if(!this.view3D.rAngAx)
		matrixRotateAllAxis = this._getMatrixRotateAllAxis();
	else
		matrixRotateAllAxis = this._shearXY();
		
	point3D.multiplyPointOnMatrix1(matrixRotateAllAxis);
	
	// diff camera for charts write into rect
	point3D.offset(this.cameraDiffX, this.cameraDiffY, this.cameraDiffZ);
	
	//project
	var projectionPoint = point3D;
	if(!this.view3D.rAngAx)
	{
		var projectiveMatrix = this._getPerspectiveProjectionMatrix(1 / (this.rPerspective));
		projectionPoint = point3D.project(projectiveMatrix);
	}
	
	//undiff
	var specialReverseDiff = this.widthCanvas / 2 + (this.left - this.right) / 2;
	projectionPoint.offset(specialReverseDiff, centerYDiff, centerZDiff);
	
	//console.log(" this.aspectRatioX: " + this.aspectRatioX + " this.aspectRatioY: " + this.aspectRatioY + " this.scaleX: " + this.scaleX + " this.scaleY: " + this.scaleY);
	
	return {x: projectionPoint.x, y: projectionPoint.y};
};

Processor3D.prototype.calculatePropertiesForPieCharts = function()
{
	var sinAngleOx = Math.sin(-this.angleOx);
	var cosAngleOx = Math.cos(-this.angleOx);
	
	var widthCharts = this.widthCanvas - this.left - this.right;
	var heightCharts = this.heightCanvas - this.bottom - this.top;
	var radius1 = widthCharts / 2;
	var radius2 = radius1 * sinAngleOx;
	var depth = ((widthCharts + 4.89) / 8.37) * cosAngleOx;
	
	if((radius2 * 2 + depth ) > heightCharts)
	{
		var kF = (radius2 * 2 + depth ) / heightCharts;
		radius1 = radius1 / kF;
		radius2 = radius2 / kF;
		depth = depth / kF;
	}
	
	return {radius1: radius1, radius2: radius2, depth: depth};
};

Processor3D.prototype._shearXY = function()
{
	//TODO матрица перевёрнута
	return [[1, 0, 0, 0], [0, 1, 0, 0], [Math.sin(-this.angleOy), Math.sin(this.angleOx), 0, 0], [0, 0, 0, 0]];
};

Processor3D.prototype._getMatrixRotateAllAxis = function()
{
	var matrixRotateOY = this._getMatrixRotateOy();
	var matrixRotateOX = this._getMatrixRotateOx();
	
	return Point3D.prototype.multiplyMatrix(matrixRotateOY, matrixRotateOX);
};

Processor3D.prototype._getMatrixRotateOx = function()
{
	return [[1, 0, 0, 0], [0, Math.cos(-this.angleOx), Math.sin(-this.angleOx), 0], [0, - Math.sin(-this.angleOx), Math.cos(-this.angleOx), 1], [0, 0, 0, 1]];
};

Processor3D.prototype._getMatrixRotateOy = function()
{
	return [[Math.cos(-this.angleOy), 0, -Math.sin(-this.angleOy), 0], [0, 1, 0, 0], [Math.sin(-this.angleOy), 0, Math.cos(-this.angleOy), 1], [0, 0, 0, 1]];
};

Processor3D.prototype._getMatrixRotateOz = function()
{
	return [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 0, 1]];
};

Processor3D.prototype.correctPointsPosition = function(chartSpace)
{
	if(this.chartsDrawer.calcProp.type === "Pie")
		return;
	
	var pxToMM = 1 / g_dKoef_pix_to_mm;
	var t = this;
	//коррективы для подписей	
	var xPoints = chartSpace.chart.plotArea && chartSpace.chart.plotArea.catAx ? chartSpace.chart.plotArea.catAx.xPoints : null;
	if(!xPoints)
		xPoints = chartSpace.chart.plotArea && chartSpace.chart.plotArea.valAx ? chartSpace.chart.plotArea.valAx.xPoints : null;
	
	var coordYAxisOx = chartSpace.chart.plotArea.catAx.posY ? chartSpace.chart.plotArea.catAx.posY : chartSpace.chart.plotArea.catAx.yPos;
	if(!coordYAxisOx)
		coordYAxisOx = chartSpace.chart.plotArea.valAx.posY != undefined ? chartSpace.chart.plotArea.valAx.posY : chartSpace.chart.plotArea.valAx.posY;
	
	var yPoints = chartSpace.chart.plotArea && chartSpace.chart.plotArea.valAx ? chartSpace.chart.plotArea.valAx.yPoints : null;
	if(!yPoints)
		yPoints = chartSpace.chart.plotArea && chartSpace.chart.plotArea.catAx ? chartSpace.chart.plotArea.catAx.yPoints : null;
	
	var coordXAxisOy = chartSpace.chart.plotArea.catAx.posX ? chartSpace.chart.plotArea.catAx.posX : chartSpace.chart.plotArea.catAx.xPos;
	if(!coordXAxisOy)
		coordXAxisOy = chartSpace.chart.plotArea.valAx.posX != undefined ? chartSpace.chart.plotArea.valAx.posX : null;
	
	var correctPointsOx = function()
	{
		var z = t.calculateZPositionCatAxis();
		var valCatAx = chartSpace.chart.plotArea.catAx;
		if(!valCatAx.transformXPoints)
			valCatAx.transformXPoints = [];
		
		for(var i = 0; i < xPoints.length; i++)
		{
			var widthText = 0;
			if(valCatAx && valCatAx.labels && t.orientationValAx !== ORIENTATION_MIN_MAX)
				widthText = valCatAx.labels.extY * pxToMM;
			
			var point = t.convertAndTurnPoint(xPoints[i].pos * pxToMM, coordYAxisOx * pxToMM - widthText, z);
				
			valCatAx.transformXPoints[i] = {x: point.x / pxToMM, y: point.y / pxToMM};
		}
	};
	
	var correctPointsOxHBar = function()
	{
		var z = t.calculateZPositionValAxis();
		var valCatAx = chartSpace.chart.plotArea.valAx;
		if(!valCatAx.transformXPoints)
			valCatAx.transformXPoints = [];
		
		for(var i = 0; i < xPoints.length; i++)
		{
			var widthText = 0;
			if(t.chartsDrawer.calcProp.type === "HBar" && valCatAx && valCatAx.labels && t.orientationCatAx !== ORIENTATION_MIN_MAX)
				widthText = valCatAx.labels.extY * pxToMM;
			
			var point = t.convertAndTurnPoint(xPoints[i].pos * pxToMM, coordYAxisOx * pxToMM - widthText, z);
				
			valCatAx.transformXPoints[i] = {x: point.x / pxToMM, y: point.y / pxToMM};
		}
	};
	
	var correctPointsOy = function()
	{
		var zPosition = t.calculateZPositionValAxis();
		var valCatAx = chartSpace.chart.plotArea.valAx;
		
		if(!valCatAx.transformYPoints)
			valCatAx.transformYPoints = [];
		
		for(var i = 0; i < yPoints.length; i++)
		{
			var point = t.convertAndTurnPoint(coordXAxisOy * pxToMM , yPoints[i].pos * (pxToMM), zPosition);
			
			//TODO значения высчитать
			var widthText = 5;
			if(valCatAx && valCatAx.labels)
				widthText = valCatAx.labels.extX * pxToMM;
			
			if(t.orientationCatAx !== ORIENTATION_MIN_MAX)
			{
				widthText = 0;
			}
			
			if(t.view3D.rAngAx)
				diffXText = 0;
			else
				diffXText = 15;
			
			var angleOyAbs = Math.abs(t.angleOy);
			if(!t.view3D.rAngAx && (angleOyAbs >= Math.PI / 2 && angleOyAbs < 3 * Math.PI/2))
				diffXText = - diffXText;	
			
			valCatAx.transformYPoints[i] = {x: (point.x - (diffXText + widthText)) / pxToMM, y: point.y / pxToMM};
		}
	}
	
	var correctPointsOyHBar = function()
	{
		var zPosition = t.calculateZPositionCatAxis();
		var valCatAx = chartSpace.chart.plotArea.catAx;
		if(!valCatAx.transformYPoints)
			valCatAx.transformYPoints = [];
		
		for(var i = 0; i < yPoints.length; i++)
		{
			var point = t.convertAndTurnPoint(coordXAxisOy * pxToMM , yPoints[i].pos * (pxToMM), zPosition);
			
			//TODO значения высчитать
			var widthText = 0;
			if(valCatAx && valCatAx.labels)
				widthText = valCatAx.labels.extX * pxToMM;
			
			if(t.orientationValAx !== ORIENTATION_MIN_MAX)
			{
				widthText -= 10;
			}
			else
			{
				widthText += 5;
			}
			
			valCatAx.transformYPoints[i] = {x: (point.x - widthText) / pxToMM, y: point.y / pxToMM};
		}
	}
	
	
	if(xPoints)
	{	
		if(this.chartsDrawer.calcProp.type !== "HBar")
			correctPointsOx(xPoints);
		else
			correctPointsOxHBar(xPoints);
	}
	
	if(yPoints)
	{
		if(this.chartsDrawer.calcProp.type !== "HBar")
			correctPointsOy(yPoints);
		else
			correctPointsOyHBar(yPoints);
	}
};

Processor3D.prototype._getIsometricProjectionMatrix = function()
{
	var far = this.depthPerspective;
	var near = 0;
	var right = this.widthCanvas + this.left;
	var left = this.left;
	
	var bottom = this.heightCanvas + this.top;
	var top = this.top;
	
	var m11 = 2 / (right - left);
	var m41 = (right + left) / (right - left);
	var m22 = 2 / (top - bottom);
	var m42 = (top + bottom) / (top - bottom);
	var m33 = -2 / (far - near);
	var m34 = (far + near) / (far - near);
	
	return [[m11, 0, 0, m41], [0, m22, 0, m42], [0, 0, m33, m34], [0, 0, 0, 1]];
};

Processor3D.prototype._getPerspectiveProjectionMatrix = function(fov)
{
	/*var zf = this.rPerspective + this.depthPerspective;
	var zn = this.rPerspective;
	var q = zf / (zf - zn);
	return [[1 / Math.tan(this.rPerspective / 2), 0, 0, 0], [0, 1 / Math.tan(this.rPerspective / 2), 0, 0], [0, 0, q, 1], [0, 0, -q * zn, 0]];*/
	
	return [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1 / fov], [0, 0, 0, 1]];
};

Processor3D.prototype._calculatePerspective = function(view3D)
{
	var widthLine = this.widthCanvas - (this.left + this.right);
	var heightLine = this.heightCanvas - (this.top + this.bottom);
	
	var perspective = view3D && view3D.perspective ? view3D.perspective : global3DPersperctive;
	var alpha = perspective / 4;//в xml проиходит двойной угол(в параметрах ms стоит 40, приходит в xml 80)
	//TODO this.top - this.bottom пересмотреть
	var catt = ((heightLine / 2 + (this.top - this.bottom))) / Math.tan((alpha / 360) * (Math.PI * 2));
	var rPerspective;
	if(catt === 0)
		rPerspective = 0;
	else
		rPerspective = 1 / catt;
	
	this.rPerspective = rPerspective;
};

Processor3D.prototype._calculateDepthClassic = function()
{
	var widthOriginalChart = this.widthCanvas - (this.left + this.right);
	var heightOriginalChart = this.heightCanvas - (this.top + this.bottom);
	var subType = this.chartsDrawer.calcProp.subType;
	var type = this.chartsDrawer.calcProp.type;
	var defaultOverlap = (subType == "stacked" || subType == "stackedPer" || subType == "standard" || type == "Line" || type == "Area") ? 100 : 0;
	var overlap       = this.chartSpace.chart.plotArea.chart.overlap ? (this.chartSpace.chart.plotArea.chart.overlap / 100) : (defaultOverlap / 100);
	var gapWidth = this.chartSpace.chart.plotArea.chart.gapWidth != null ? (this.chartSpace.chart.plotArea.chart.gapWidth / 100) : (150 / 100);
	var gapDepth = this.chartSpace.chart.plotArea.chart.gapDepth != null ? (this.chartSpace.chart.plotArea.chart.gapDepth / 100) : (150 / 100);
	var basePercent = this.view3D && this.view3D.depthPercent ? this.view3D.depthPercent / 100 : globalBasePercent / 100;//процент от базовой глубины
	var seriesCount = this.chartsDrawer.calcProp.seriesCount;
	var ptCount = this.chartsDrawer.calcProp.ptCount;
	var sinOx = Math.sin(-this.angleOx);
	var hPercent = this.view3D.hPercent !== null ? this.view3D.hPercent / 100 :  heightOriginalChart / widthOriginalChart;
	var t = this;
	
	var depth = 0;
	
	
	//STANDARD TYPE
	var calculateDepthForStandardCharts = function()
	{
		var angleOxKf = sinOx === 0 ? 0 : sinOx;
		
		depth = (1 / (angleOxKf + ((ptCount + (Math.floor((seriesCount - ptCount) / 2))) / seriesCount * hPercent))) * (heightOriginalChart);
		
		return depth;
	};
	
	var calculateDepthForAnotherCharts = function()
	{
		//TODO глубина с некоторыми графиками имеет различия, пересчитать!
		var widthChart = (widthOriginalChart / t.aspectRatioX) / t.specialStandardScaleX;
		var width = widthChart / t.chartsDrawer.calcProp.ptCount;
		
		var baseDepth = width / (seriesCount - (seriesCount - 1) * overlap + gapWidth);
		if(subType == "standard" || type == "Line")
			baseDepth = (width / (seriesCount - (seriesCount - 1) * overlap + gapWidth)) * seriesCount;	
		
		var depth;
		if(t.view3D.rAngAx && t.aspectRatioY === 1)
		{
			var b = (seriesCount - (seriesCount - 1) * overlap + gapWidth);
			if(subType == "standard" || type == "Line" || type == "Area")
				b = b / seriesCount;
			
			var sinOx = Math.sin(-t.angleOx);
			var angleOxKf = sinOx === 0 ? 1 : sinOx;
			var a = basePercent / (t.chartsDrawer.calcProp.ptCount * b);
			depth = (widthChart * a +  gapDepth * widthChart * a) / (1 / angleOxKf + (gapDepth) * a + a);
			
			depth = depth / angleOxKf;
		}
		else
		{
			depth = baseDepth * basePercent;
			depth = depth + depth * gapDepth;
		}
		
		return depth;
	};
	
	
	depth = subType === "standard" || this.chartsDrawer.calcProp.type === "Line" ? calculateDepthForStandardCharts() : calculateDepthForAnotherCharts();
	
	return depth;
};

Processor3D.prototype._calculateDepth = function()
{
	var widthOriginalChart = this.widthCanvas - (this.left + this.right);
	var heightOriginalChart = this.heightCanvas - (this.top + this.bottom);
	var subType = this.chartsDrawer.calcProp.subType;
	var type = this.chartsDrawer.calcProp.type;
	var defaultOverlap = (subType == "stacked" || subType == "stackedPer" || subType == "standard" || type == "Line" || type == "Area") ? 100 : 0;
	var overlap       = this.chartSpace.chart.plotArea.chart.overlap ? (this.chartSpace.chart.plotArea.chart.overlap / 100) : (defaultOverlap / 100);
	var gapWidth = this.chartSpace.chart.plotArea.chart.gapWidth != null ? (this.chartSpace.chart.plotArea.chart.gapWidth / 100) : (150 / 100);
	var gapDepth = this.chartSpace.chart.plotArea.chart.gapDepth != null ? (this.chartSpace.chart.plotArea.chart.gapDepth / 100) : type === "Area" && subType !== "normal" ? 1 : (150 / 100);
	var basePercent = this.view3D && this.view3D.depthPercent ? this.view3D.depthPercent / 100 : globalBasePercent / 100;//процент от базовой глубины
	var seriesCount = this.chartsDrawer.calcProp.seriesCount;
	var ptCount = this.chartsDrawer.calcProp.ptCount;
	var sinOx = Math.sin(-this.angleOx);
	var sinOy = Math.sin(-this.angleOy);
	var hPercent = type == "HBar" ? 1 : this.hPercent;
	var depthPercent = this.view3D.depthPercent !== null ? this.view3D.depthPercent / 100 : 1;
	var t = this;
	
	var areaStackedKf = type === "Area" && subType !== "normal" ?  (ptCount / (2 * (ptCount - 1))) : 1;
	
	var depth = 0;
	var chartWidth = 0;
	
	var standardType = false;
	if(subType == "standard" || type == "Line" || (type == "Area" && subType == "normal"))
		standardType = true;
	
	var heightHPercent = heightOriginalChart / hPercent;
	if(!standardType)
	{
		if(this.angleOx === 0 && this.angleOy === 0)//withoutAngleNoAuto + withoutAngleAuto
		{
			var widthOneBar = ((heightHPercent / seriesCount) / (ptCount - (ptCount - 1) * (overlap) + gapWidth)) * sinOy;//0
			chartWidth = widthOneBar + heightHPercent;
		}
		else if(this.angleOx !== 0/* && this.angleOy !== 0*/)//AngleOYNoAut + AngleOYNoAutPerHeight + (ANGLEOX+ANGLEOY) + AngleOYOXNoAut + ANGLEOXANGLEOYHPerDPer(ANGLEOX+ANGLEOY HPercent)
		{
			//если выставить ширину 255 будет так же, как и в документе с расчётами
			var b = (seriesCount - (seriesCount - 1) * overlap + gapWidth);
			var a = (depthPercent / (ptCount * b)) / hPercent;
			var width = heightOriginalChart * areaStackedKf;
			depth = (width * a +  gapDepth * width * a) / (1 / sinOx + (gapDepth) * a + a);
			
			chartWidth = heightHPercent - depth;
		}
		else if(this.angleOy !== 0)//angleOxNoAuto
		{
			//если выставить ширину = 321.25 будет так же, как и в документе с расчётам
			var widthOneBar = ((heightHPercent / seriesCount) / (ptCount - (ptCount - 1) * (overlap) + gapWidth)) * sinOy;
			chartWidth = widthOneBar + heightHPercent;
			
			
			
			//TODO глубина с некоторыми графиками имеет различия, пересчитать!
			var widthChart = (widthOriginalChart / t.aspectRatioX) / t.specialStandardScaleX;

			var b = (seriesCount - (seriesCount - 1) * overlap + gapWidth);
			if(subType == "standard" || type == "Line" || type == "Area")
				b = b / seriesCount;
			
			var sinOx = Math.sin(-t.angleOx);
			var angleOxKf = sinOx === 0 ? 1 : sinOx;
			var a = basePercent / (t.chartsDrawer.calcProp.ptCount * b);
			depth = (widthChart * a +  gapDepth * widthChart * a) / (1 / angleOxKf + (gapDepth) * a + a);
			
			depth = depth / angleOxKf;
		}
	}
	else//allStandardDepth
	{
		var angleOxKf = sinOx === 0 ? 0 : sinOx;
		
		if(type == "Area")
			depth = (1*depthPercent / (angleOxKf*depthPercent + ((ptCount + (Math.floor((seriesCount - ptCount) / 2 - 0.5))) / seriesCount * hPercent))) * (heightOriginalChart);
		else
			depth = (1*depthPercent / (angleOxKf*depthPercent + ((ptCount + (Math.floor((seriesCount - ptCount) / 2))) / seriesCount * hPercent))) * (heightOriginalChart);
		
		if((this.angleOx !== 0))
			depth = depth * Math.sin(-this.angleOx);
	}
	
	return sinOx !== 0 ? depth / Math.sin(-this.angleOx) : depth;
};


Processor3D.prototype._calculateDepthPerspective = function()
{
	var widthCanvas = this.widthCanvas;
	var heightCanvas = this.heightCanvas;
	var widthOriginalChart = heightCanvas - (this.left + this.right);
	var heightOriginalChart = heightCanvas - (this.top + this.bottom);
	
	var aspectRatio = (widthOriginalChart) / (heightOriginalChart);
	var widthChart = widthOriginalChart / aspectRatio;

	var widthChart = widthChart / this.scaleX;
	
	var seriesCount = this.chartsDrawer.calcProp.seriesCount;
	
	var width = widthChart / this.chartsDrawer.calcProp.ptCount;

	var defaultOverlap = (this.chartsDrawer.calcProp.subType == "stacked" || this.chartsDrawer.calcProp.subType == "stackedPer" || this.chartsDrawer.calcProp.subType == "standard" || this.chartsDrawer.calcProp.type == "Line") ? 100 : 0;
	var overlap       = this.chartSpace.chart.plotArea.chart.overlap ? (this.chartSpace.chart.plotArea.chart.overlap / 100) : (defaultOverlap / 100);
	
	var gapWidth = this.chartSpace.chart.plotArea.chart.gapWidth != null ? (this.chartSpace.chart.plotArea.chart.gapWidth / 100) : (150 / 100);
	var gapDepth = this.chartSpace.chart.plotArea.chart.gapDepth != null ? (this.chartSpace.chart.plotArea.chart.gapDepth / 100) : (150 / 100);
	
	var baseDepth = width / (seriesCount - (seriesCount - 1) * overlap + gapWidth);
	if(this.chartsDrawer.calcProp.subType == "standard" || this.chartsDrawer.calcProp.type == "Line")
		baseDepth = (width / (seriesCount - (seriesCount - 1) * overlap + gapWidth)) * seriesCount;
		
	//РїСЂРѕС†РµРЅС‚ РѕС‚ Р±Р°Р·РѕРІРѕР№ РіР»СѓР±РёРЅС‹
	var basePercent = this.view3D && this.view3D.depthPercent ? this.view3D.depthPercent / 100 : globalBasePercent / 100;
	var depth = baseDepth * basePercent;
	depth = depth + depth * gapDepth;
	
	
	if(this.view3D.rAngAx)
	{
		var b = (seriesCount - (seriesCount - 1) * overlap + gapWidth);
		if(this.chartsDrawer.calcProp.subType == "standard" || this.chartsDrawer.calcProp.type == "Line" || this.chartsDrawer.calcProp.type == "Area")
			b = b / seriesCount;
		
		var sinOx = Math.sin(-this.angleOx);
		var angleOxKf = sinOx === 0 ? 1 : sinOx;
		var a = basePercent / (this.chartsDrawer.calcProp.ptCount * b);
		depth = (widthChart * a +  gapDepth * widthChart * a) / (1 / angleOxKf + (gapDepth) * a + a);
		
		depth = depth / angleOxKf;
	}
	
	return depth;
};

Processor3D.prototype._calcSpecialStandardScaleX = function()
{
	if(!(this.chartsDrawer.calcProp.subType == "standard" || this.chartsDrawer.calcProp.type == "Line"))
		return;
	
	//calculate width in 3d standard charts with rAngAx
	var n = Math.floor((this.chartsDrawer.calcProp.seriesCount + this.chartsDrawer.calcProp.ptCount) / 2);
	var kf = this.chartsDrawer.calcProp.ptCount / n;
	
	this.specialStandardScaleX = 1 / kf;
};

Processor3D.prototype._calculateScaleFromDepth = function (/*isSkip*/)
{
	//***Calculate scaleY***
	if(this.view3D.rAngAx && this.aspectRatioY === 1)
	{
		var widthCanvas = this.widthCanvas;
		var originalWidthChart = widthCanvas - this.left - this.right;
		
		var heightCanvas = this.heightCanvas;
		var heightChart = heightCanvas - this.top - this.bottom;
		
		this.scaleY = heightChart / (this.depthPerspective * Math.sin(this.angleOx) + heightChart);
		
		//меняется ширина в зависимости от количества значений
		//if(this.chartsDrawer.calcProp.subType == "standard")
			//this.scaleX += parseInt((this.chartsDrawer.calcProp.seriesCount  + 1) / 2) - 1;
		
		var subType = this.chartsDrawer.calcProp.subType;
		if(subType == "standard" || this.chartsDrawer.calcProp.type === "Line" || (this.chartsDrawer.calcProp.type === "Area" && subType == "normal"))
		{
			var widthStandard = heightChart / this.specialStandardScaleX;
			if(widthStandard > originalWidthChart)
				widthStandard = originalWidthChart;
			
			var newDepth = this.depthPerspective * Math.sin(-this.angleOx);
			var newWidth = widthStandard - newDepth;
			//this.scaleX =  heightChart / newWidth;
		}
		else
		{
			var newDepth = this.depthPerspective * Math.sin(-this.angleOx);
			var newWidth = heightChart - newDepth;
			this.scaleX =  heightChart / newWidth;
		}
	}
};

Processor3D.prototype._calculateCameraDiff = function (/*isSkip*/)
{	
	//глубина по OZ
	var perspectiveDepth = this.depthPerspective;
	
	var widthCanvas = this.widthCanvas;
	var originalWidthChart = widthCanvas - this.left - this.right;
	
	var heightCanvas = this.heightCanvas;
	var heightChart = heightCanvas - this.top - this.bottom;
	
	var perspectiveDepth = this.depthPerspective;
	
	//add test points for parallelepiped rect
	var points = [];
	var faces = [];
	points.push(new Point3D(this.left, this.top, perspectiveDepth, this));
	points.push(new Point3D(this.left, heightChart + this.top, perspectiveDepth, this));
	points.push(new Point3D(originalWidthChart + this.left, heightChart + this.top, perspectiveDepth, this));
	points.push(new Point3D(originalWidthChart + this.left, this.top, perspectiveDepth, this));
	points.push(new Point3D(originalWidthChart + this.left, this.top, 0, this));
	points.push(new Point3D(originalWidthChart + this.left, heightChart + this.top, 0, this));
	points.push(new Point3D(this.left, heightChart + this.top, 0, this));
	points.push(new Point3D(this.left, this.top, 0, this));
	
	faces.push([0,1,2,3]);
	faces.push([2,5,4,3]);
	faces.push([1,6,7,0]);
	faces.push([6,5,4,7]);
	faces.push([7,4,3,0]);
	faces.push([1,6,2,5]);
	
	
	//***Calculate cameraDiffZ***
	if(!this.view3D.rAngAx)
		this._calculateCameraDiffZ(points, faces);
	
	//***Calculate cameraDiffX***
	if(this.view3D.rAngAx)
	{
		var minMaxOx = this._getMinMaxOx(points, faces);
		this._calculateCameraDiffX(minMaxOx);
	}
	
	//***Calculate cameraDiffY***
	var minMaxOy = this._getMinMaxOy(points, faces);
	this._calculateCameraDiffY(minMaxOy.top, minMaxOy.bottom);
};

Processor3D.prototype._calculateCameraDiffZ = function (points, faces)
{
	var widthCanvas = this.widthCanvas;
	var originalWidthChart = widthCanvas - this.left - this.right;
	
	var heightCanvas = this.heightCanvas;
	var heightChart = heightCanvas - this.top - this.bottom;

	var widthChart = originalWidthChart;
	var depthChart = this.depthPerspective;
	
	var minMaxOx = this._getMinMaxOx(points, faces);
	var point1 = this.convertAndTurnPoint(minMaxOx.mostLeftPointX.x, minMaxOx.mostLeftPointX.y, minMaxOx.mostLeftPointX.z, true);
	var point2 = this.convertAndTurnPoint(minMaxOx.mostRightPointX.x, minMaxOx.mostRightPointX.y, minMaxOx.mostRightPointX.z, true);
	var x1 = point1.x;
	var x2 = point2.x;
	var y1 = point1.y;
	var y2 = point2.y;
	var diffX = Math.abs(x1 - x2);
	var diffY = Math.abs(y1 - y2);
	
	//TODO медленная функция, рассчитать сдвиги!
	while(diffX > widthChart || diffY > heightChart)
	{
		var minMaxOx = this._getMinMaxOx(points, faces);
		var point1 = this.convertAndTurnPoint(minMaxOx.mostLeftPointX.x, minMaxOx.mostLeftPointX.y, minMaxOx.mostLeftPointX.z, true);
		var point2 = this.convertAndTurnPoint(minMaxOx.mostRightPointX.x, minMaxOx.mostRightPointX.y, minMaxOx.mostRightPointX.z, true);

		var x1 = point1.x;
		var x2 = point2.x;
		var y1 = point1.y;
		var y2 = point2.y;
		
		var leftMargin = this.left - x1;
		var rightMargin = x2 - (this.left + originalWidthChart);
		
		var topMargin = this.top - y1;
		var bottomMargin = y2 - (this.top + heightChart);
		
		if(leftMargin > rightMargin)
		{
			this.cameraDiffX++;
		}
		else
		{
			this.cameraDiffX--;
		}
		
		var diffX = Math.abs(x1 - x2);
		var diffY = Math.abs(y1 - y2);

		this.cameraDiffZ++;
	}
	
	var minMaxOy = this._getMinMaxOy(points, faces);
	var point1 = this.convertAndTurnPoint(minMaxOy.mostTopPointY.x, minMaxOy.mostTopPointY.y, minMaxOy.mostTopPointY.z, true);
	var point2 = this.convertAndTurnPoint(minMaxOy.mostBottomPointY.x, minMaxOy.mostBottomPointY.y, minMaxOy.mostBottomPointY.z, true);
	var y1 = point1.y;
	var y2 = point2.y;
	
	var minMaxOx = this._getMinMaxOx(points, faces);
	var point1 = this.convertAndTurnPoint(minMaxOx.mostLeftPointX.x, minMaxOx.mostLeftPointX.y, minMaxOx.mostLeftPointX.z, true);
	var point2 = this.convertAndTurnPoint(minMaxOx.mostRightPointX.x, minMaxOx.mostRightPointX.y, minMaxOx.mostRightPointX.z, true);
	var x1 = point1.x;
	var x2 = point2.x;
	
	var diffY = Math.abs(y1 - y2);
	
	//TODO медленная функция, рассчитать сдвиги!
	while(diffY > heightChart)
	{
		var minMaxOy = this._getMinMaxOy(points, faces);
		var point1 = this.convertAndTurnPoint(minMaxOy.mostTopPointY.x, minMaxOy.mostTopPointY.y, minMaxOy.mostTopPointY.z, true);
		var point2 = this.convertAndTurnPoint(minMaxOy.mostBottomPointY.x, minMaxOy.mostBottomPointY.y, minMaxOy.mostBottomPointY.z, true);

		var y1 = point1.y;
		var y2 = point2.y;
		
		var minMaxOx = this._getMinMaxOx(points, faces);
		var point1 = this.convertAndTurnPoint(minMaxOx.mostLeftPointX.x, minMaxOx.mostLeftPointX.y, minMaxOx.mostLeftPointX.z, true);
		var point2 = this.convertAndTurnPoint(minMaxOx.mostRightPointX.x, minMaxOx.mostRightPointX.y, minMaxOx.mostRightPointX.z, true);
		var x1 = point1.x;
		var x2 = point2.x;
		
		var leftMargin = this.left - x1;
		var rightMargin = x2 - (this.left + originalWidthChart);
		
		var topMargin = this.top - y1;
		var bottomMargin = y2 - (this.top + heightChart);
		
		if(leftMargin > rightMargin)
		{
			this.cameraDiffX++;
		}
		else
		{
			this.cameraDiffX--;
		}
		
		var diffY = Math.abs(y1 - y2);

		this.cameraDiffZ++;
	}

},

Processor3D.prototype._calculateCameraDiffX = function (minMaxOx)
{
	//test ровно по центру, но циклом
	var maxLeftPoint = minMaxOx.left;
	var maxRightPoint = minMaxOx.right;
	/*var mostLeftPointX = minMaxOx.mostLeftPointX;
	var mostRightPointX = minMaxOx.mostRightPointX;
	
	var top = this.top;
	var bottom = this.bottom;
	
	var left = this.left;
	var right = this.right;
	var widthCanvas = this.widthCanvas;
	var originalWidthChart = widthCanvas - left - right;
	
	var heightCanvas = this.heightCanvas;
	var heightChart = heightCanvas - top - bottom;

	var widthChart = originalWidthChart;
	var depthChart = this.depthPerspective;
	
	var reverseDiff = false;
	var diffLeft = maxLeftPoint - left;
	var diffRight = (widthChart + right) - maxRightPoint;
	if(diffLeft > 0 && diffRight > 0 && diffRight < diffLeft)
		reverseDiff = true;
	else if(diffLeft > 0 && diffRight < 0)
		reverseDiff = true;
	else if(diffLeft < 0 && diffRight < 0 && diffRight < diffLeft)
		reverseDiff = true;
	
	while(true)
	{
		var point1 = this.convertAndTurnPoint(mostLeftPointX.x, mostLeftPointX.y, mostLeftPointX.z, true);
		var point2 = this.convertAndTurnPoint(mostRightPointX.x, mostRightPointX.y, mostRightPointX.z, true);
		maxLeftPoint = point1.x;
		maxRightPoint = point2.x;
		
		if(((Math.abs(maxLeftPoint - left) + 2) >= Math.abs(maxRightPoint - (widthChart + right)) && Math.abs(maxLeftPoint - left) - 2 <= Math.abs(maxRightPoint - (widthChart + right))) ||  Math.abs(this.cameraDiffX) > 1000)
			break;
		
		if(reverseDiff)
			this.cameraDiffX--;
		else
			this.cameraDiffX++;
	}*/
	
	
	//так ближе к тому, как смещает excel
	var left = this.left;
	var right = this.right;
	var widthCanvas = this.widthCanvas;
	var originalWidthChart = widthCanvas - this.left - this.right;
	
	var diffLeft = maxLeftPoint - this.left;
	var diffRight  = (this.left + originalWidthChart) - maxRightPoint;
	
	this.cameraDiffX = (((diffRight - diffLeft) / 2) * ( 1 / (this.rPerspective) + this.cameraDiffZ)) / ( 1 / (this.rPerspective));
	
	
	//***Calculate cameraDiffX***
	/*var aspectRatio = (originalWidthChart) / (heightChart);
	var minMaxOx = this._getMinMaxOx(points, faces);
	var x = minMaxOx.mostLeftPointX.x / aspectRatio;
	var y = minMaxOx.mostLeftPointX.y;
	var z = minMaxOx.mostLeftPointX.z;
	
	var x1 = minMaxOx.mostRightPointX.x / aspectRatio;
	var y1 = minMaxOx.mostRightPointX.y;
	var z1 = minMaxOx.mostRightPointX.z;
	
	
	var centerXDiff = heightChart / 2 + this.left / 2;
	var centerYDiff = heightChart / 2 + this.top;
	var centerZDiff = this.depthPerspective / 2;
	
	var cosy  = Math.cos(this.angleOy);
	var siny  = Math.sin(this.angleOy);
	var cosx  = Math.cos(this.angleOx);
	var sinx  = Math.sin(this.angleOx);
	var cosz  = Math.cos(this.angleOz);
	var sinz  = Math.sin(this.angleOz);
	
	var right1 = heightChart + left;*/
	
	/*x = x - centerXDiff;
	y = y - centerYDiff;
	z = z - centerZDiff;
	
	x1 = x1 - centerXDiff;
	y1 = y1 - centerYDiff;
	z1 = z1 - centerZDiff;*/
	
	//(cosy * x - siny * z + this.cameraDiffX) / (1 + (cosx * (cosy * z + siny * cosz * x) - sinx * y + this.cameraDiffZ) * (this.rPerspective)) -left = 
	//right - (cosy * x - siny * z + this.cameraDiffX) / (1 + (cosx * (cosy * z + siny * cosz * x) - sinx * y + this.cameraDiffZ) * (this.rPerspective))

	/*var c = cosy * x - siny * z;
	var c1 = cosy * x1 - siny * z1;
	var b = (1 + (cosx * (cosy * z + siny * cosz * x) - sinx * y + this.cameraDiffZ) * (this.rPerspective));
	var b1 = (1 + (cosx * (cosy * z1 + siny * cosz * x1) - sinx * y1 + this.cameraDiffZ) * (this.rPerspective));*/

	//(c + this.cameraDiffX) / b - left = right - (c1 + this.cameraDiffX) / b1;

	//с / b +  this.cameraDiffX / b + c1 / b1 + this.cameraDiffX / b1 = right + left
	//this.cameraDiffX / b + this.cameraDiffX / b1 = right + left - c1 / b1 - c / b

	//this.cameraDiffX = (-c1 / b1 - c / b + left + right1) * ((b * b1) / (b1 + b));
};

Processor3D.prototype._calculateCameraDiffY = function (maxTopPoint, maxBottomPoint)
{
	var top = this.top;
	var bottom = this.bottom;
	var heightCanvas = this.heightCanvas;
	var heightChart = heightCanvas - top - bottom;
	
	var diffTop = maxTopPoint - top;
	var diffBottom = (heightChart + top) - maxBottomPoint;
	
	//this.cameraDiffY = this.top - minMaxOy.top; - для rAngAx
	this.cameraDiffY = (diffBottom - diffTop) / 2;
};

Processor3D.prototype._getMinMaxOx = function (points, faces)
{
	var mostLeftPointX;
	var mostRightPointX;
	var xRight;
	var xLeft;
	
	for(var i = 0; i < faces.length - 1; i++){
		for(var k = 0; k <= 3; k++){
			
			var point1 = this.convertAndTurnPoint(points[faces[i][k]].x, points[faces[i][k]].y, points[faces[i][k]].z, true);
			//var point2 = this.convertAndTurnPoint(points[faces[i][k + 1]].x, points[faces[i][k + 1]].y, points[faces[i][k + 1]].z, true);
			var x1 = point1.x;
			//var x2 = point2.x;
			
			if(!xLeft)
			{
				xLeft = x1;
				mostLeftPointX = new Point3D(points[faces[i][k]].x, points[faces[i][k]].y, points[faces[i][k]].z, this.cChartDrawer);
				
				xRight = x1;
				mostRightPointX = new Point3D(points[faces[i][k]].x, points[faces[i][k]].y, points[faces[i][k]].z, this.cChartDrawer);
			}
			else
			{
				if(x1 < xLeft)
				{
					xLeft = x1;
					mostLeftPointX = new Point3D(points[faces[i][k]].x, points[faces[i][k]].y, points[faces[i][k]].z, this.cChartDrawer);
				}
				
				if(x1 > xRight)
				{
					xRight = x1;
					mostRightPointX = new Point3D(points[faces[i][k]].x, points[faces[i][k]].y, points[faces[i][k]].z, this.cChartDrawer);
				}
			}
			
		}
	}
	
	return {left: xLeft, right: xRight, mostLeftPointX: mostLeftPointX, mostRightPointX: mostRightPointX};
};

Processor3D.prototype._getMinMaxOy = function (points, faces)
{
	var mostTopPointY;
	var mostBottomPointY;
	var xTop = this.top + this.heightCanvas;
	var xBottom = 0;
	for(var i = 0; i < faces.length - 1; i++){
		for(var k = 0; k < 3; k++){
			
			var point1 = this.convertAndTurnPoint(points[faces[i][k]].x, points[faces[i][k]].y, points[faces[i][k]].z, true);
			var point2 = this.convertAndTurnPoint(points[faces[i][k + 1]].x, points[faces[i][k + 1]].y, points[faces[i][k + 1]].z, true);
			var x1 = point1.x;
			var x2 = point2.x;
			var y1 = point1.y;
			var y2 = point2.y;
		
			
			if(y1 <= xTop)
			{
				xTop = y1;
				mostTopPointY = new Point3D(points[faces[i][k]].x, points[faces[i][k]].y, points[faces[i][k]].z, this.cChartDrawer);
			}	
			
			if(y2 <= xTop)
			{
				xTop = y2;
				mostTopPointY = new Point3D(points[faces[i][k + 1]].x, points[faces[i][k + 1]].y, points[faces[i][k + 1]].z, this.cChartDrawer);
			}
			
			if(y1 >= xBottom)
			{
				xBottom = y1;
				mostBottomPointY = new Point3D(points[faces[i][k]].x, points[faces[i][k]].y, points[faces[i][k]].z, this.cChartDrawer);
			}	
			
			if(y2 >= xBottom)
			{
				xBottom = y2;
				mostBottomPointY = new Point3D(points[faces[i][k + 1]].x, points[faces[i][k + 1]].y, points[faces[i][k + 1]].z, this.cChartDrawer);
			}

		}
	}
	
	return {top: xTop, bottom: xBottom, mostTopPointY: mostTopPointY, mostBottomPointY: mostBottomPointY};
};

Processor3D.prototype._calcAspectRatio = function()
{
	//return width / height
	var widthOriginalChart = this.widthCanvas - (this.left + this.right);
	var heightOriginalChart = this.heightCanvas - (this.top + this.bottom);
	//auto scale if hPercent == null
	var hPercent = this.hPercent;
	var depthPercent = this.view3D.depthPercent !== null ? this.view3D.depthPercent / 100 : 1;
	
	var aspectRatioX = 1;
	var aspectRatioY = 1;
	
	var sinOx = Math.sin(-this.angleOx);
	var sinOy = Math.sin(-this.angleOy);
	
	var subType = this.chartsDrawer.calcProp.subType;
	if(subType === "standard" || this.chartsDrawer.calcProp.type === "Line" || (this.chartsDrawer.calcProp.type === "Area" && subType == "normal"))
	{
		var seriesCount = this.chartsDrawer.calcProp.seriesCount;
		var ptCount = this.chartsDrawer.calcProp.ptCount;
		
		var depth = this.view3D.rAngAx ? this._calculateDepth() : this._calculateDepthPerspective();
		var width = (depth / depthPercent) * (ptCount / seriesCount);
		
		aspectRatioX = (widthOriginalChart) / width;
	}
	else if(hPercent !== null)//auto scale height
		aspectRatioX = widthOriginalChart / (heightOriginalChart / hPercent);
	
	if(aspectRatioX < 1)
	{
		aspectRatioY = 1 / aspectRatioX;
		aspectRatioX = 1;
	}
	
	this.aspectRatioX = aspectRatioX;
	this.aspectRatioY = aspectRatioY;
};


function Point3D(x, y, z, chartsDrawer)
{
	this.x = x;
	this.y = y;
	this.z = z;
	if(chartsDrawer)
	{
		this.chartProp = chartsDrawer.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;
	}
}

Point3D.prototype = 
{	
	constructor: Point3D,
	
	rotate: function(angleOx, angleOy, angleOz)
	{
		var x = this.x;
		var y = this.y;
		var z = this.z;
		var cosy  = Math.cos(angleOy);
		var siny  = Math.sin(angleOy);
		var cosx  = Math.cos(angleOx);
		var sinx  = Math.sin(angleOx);
		var cosz  = Math.cos(angleOz);
		var sinz  = Math.sin(angleOz);
		
		
		var newX = cosy * (sinz * y + cosz * x) - siny * z;
		var newY = sinx * (cosy * z + siny * (sinz * y + cosz * x)) + cosx * (cosz * y - sinz * x);
		var newZ = cosx * (cosy * z + siny * (sinz * y + cosz * x)) - sinx * (cosz * y - sinz * x);
		
		this.x = newX;
		this.y = newY;
		this.z = newZ;
		
		return this;
	},
	
	project: function(matrix)
	{
		//умножаем
		var projectPoint = this.multiplyPointOnMatrix(matrix);
		
		//делим на 4 коэффициэнт
		var newX = projectPoint[0][0] / projectPoint[0][3];
		var newY = projectPoint[0][1] / projectPoint[0][3];
		
		this.x = newX;
		this.y = newY;
		
		return this;
	},
	
	offset: function(offsetX, offsetY, offsetZ)
	{
		this.x = this.x + offsetX;
		this.y = this.y + offsetY;
		this.z = this.z + offsetZ;
		
		return this;
	},
	
	scale: function(aspectRatioOx, aspectRatioOy, aspectRatioOz)
	{
		this.x = this.x / aspectRatioOx;
		this.y = this.y / aspectRatioOy;
		this.z = this.z / aspectRatioOz;
		
		return this;
	},
	
	multiplyPointOnMatrix: function(matrix)
	{
		var pointMatrix = [[this.x, this.y, this.z, 1]];
		
		return this.multiplyMatrix(pointMatrix , matrix);
	},
	
	multiplyPointOnMatrix1: function(matrix)
	{
		var pointMatrix = [[this.x, this.y, this.z, 1]];
		
		var multiplyMatrix = this.multiplyMatrix(pointMatrix , matrix);
		this.x = multiplyMatrix[0][0];
		this.y = multiplyMatrix[0][1];
		this.z = multiplyMatrix[0][2];
	},
	
	multiplyMatrix: function(A, B)
	{
		var rowsA = A.length, colsA = A[0].length,
			rowsB = B.length, colsB = B[0].length,
			C = [];

		if (colsA != rowsB) return false;

		for (var i = 0; i < rowsA; i++) C[i] = [];

		for (var k = 0; k < colsB; k++)
		 { for (var i = 0; i < rowsA; i++)
			{ var temp = 0;
			  for (var j = 0; j < rowsB; j++) temp += A[i][j]*B[j][k];
			  C[i][k] = temp;
			}
		 }

		return C;
	}
}