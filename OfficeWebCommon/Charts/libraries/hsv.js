function hsvToRgb(h, s, v) {
	var r, g, b;
	var i;
	var f, p, q, t;
	// Make sure our arguments stay in-range
	h = Math.max(0, Math.min(360, h));
	s = Math.max(0, Math.min(1, s));
	v = Math.max(0, Math.min(1, v));
	if (s == 0) {
		// Achromatic (grey)
		r = g = b = v;
		return new RGBColor('rgb(' + Math.round(r * 255) + ', ' + Math.round(g * 255) + ', ' + Math.round(b * 255) + ')');
	}
	h /= 60; // sector 0 to 5
	i = Math.floor(h);
	f = h - i; // factorial part of h
	p = v * (1 - s);
	q = v * (1 - s * f);
	t = v * (1 - s * (1 - f));
	switch (i) {
		case 0:
			r = v;
			g = t;
			b = p;
			break;
		case 1:
			r = q;
			g = v;
			b = p;
			break;
		case 2:
			r = p;
			g = v;
			b = t;
			break;
		case 3:
			r = p;
			g = q;
			b = v;
			break;
		case 4:
			r = t;
			g = p;
			b = v;
			break;
		default: // case 5:
			r = v;
			g = p;
			b = q;
	}
	return new RGBColor('rgb(' + Math.round(r * 255) + ', ' + Math.round(g * 255) + ', ' + Math.round(b * 255) + ')');
}
function rgbToHsv(r, g, b) {
	var h, s, v;
	var min, max, delta;
	min = Math.min(r, Math.min(g, b));
	max = Math.max(r, Math.max(g, b));
	delta = max - min;
	s = (max == 0) ? 0 : 1.0 - (1.0 * min / max);
	v = max / 255.0;
	if (r == max)
		h = (g - b) / delta; 	// between yellow & magenta
	else if (g == max)
		h = 2 + (b - r) / delta; // between cyan & yellow
	else
		h = 4 + (r - g) / delta; // between magenta & cyan
	h *= 60; 			// degrees
	if (h < 0)
		h += 360;
	var hsv = new Object();
	hsv.hue = h;
	hsv.saturation = s;
	hsv.value = v;
	return hsv;
}
function generateColors(countColors, arrayBaseColors, debug) {
	
	var arrayColors = [];
	var countBase = arrayBaseColors.length;
	var needCreate = parseInt(countColors / countBase) + 1;	
	
	if ( debug ) {
		var pause;
	}
	for (var i = 0; i < needCreate; i++) {
	
		for (var j = 0; j < countBase; j++) {
			
			// Для равномерного затухания: percent = i / needCreate
			var percent = (-70 + 140 * ( (i + 1) / (needCreate + 1) )) / 100.0;		// ECMA-376 Part 1
			var color = changeRgbColor(arrayBaseColors[j], percent);
								
			arrayColors.push( color );
		}
	}
	arrayColors.splice(countColors, arrayColors.length - countColors);
	
	/*var arrayBaseHSV = [];
	for (var i = 0; i < countBase; ++i) {
		var color = new RGBColor(arrayBaseColors[i]);
		var hsv = rgbToHsv(color.r, color.g, color.b)
		if (7 >= hsv.hue)
			hsv.addHue = hsv.hue % 5;
		else
			hsv.addHue = hsv.hue % 10;
		if (hsv.addHue < 2)
			hsv.addHue = 2;
		if (hsv.addHue > 8)
			hsv.addHue = 8;
		var hi = parseInt((hsv.hue / 60) % 6);
		if (0 == hi % 2)
			hsv.addHue *= -1.0;
		hsv.addSaturation = -1.0 * hsv.saturation / 2.0;
		hsv.addValue = (15 + hsv.hue % 4) / 100.0;
		arrayBaseHSV[arrayBaseHSV.length] = hsv;
	}
	var nCountColorsCreate = parseInt(countColors / countBase);
	if (0 > nCountColorsCreate)
		nCountColorsCreate = 0;
	for (var i = 0; i < nCountColorsCreate; ++i) {
		for (var j = 0; j < countBase; ++j) {
			var oHSV = arrayBaseHSV[j];
			arrayColors[arrayColors.length] = hsvToRgb(oHSV.hue, oHSV.saturation, oHSV.value).toHex();
			oHSV.hue = oHSV.hue + oHSV.addHue / nCountColorsCreate;
			if (0 > oHSV.hue)
				oHSV.hue = 0;
			if (360 < oHSV.hue)
				oHSV.hue = 360;
			oHSV.saturation = oHSV.saturation + oHSV.addSaturation / nCountColorsCreate;
			if (0 > oHSV.saturation)
				oHSV.saturation = 0;
			if (1 < oHSV.saturation)
				oHSV.saturation = 1;
			oHSV.value = oHSV.value + oHSV.addValue / nCountColorsCreate;
			if (0 > oHSV.value)
				oHSV.value = 0;
			if (1 < oHSV.value)
				oHSV.value = 1;
			arrayBaseHSV[j] = oHSV;
		}
	}
	for (var i = 0; i < countColors - nCountColorsCreate * countBase; ++i) {
		var oHSV = arrayBaseHSV[i];
		arrayColors[arrayColors.length] = hsvToRgb(oHSV.hue, oHSV.saturation, oHSV.value).toHex();
	}*/
	
	return arrayColors;
}
function changeRgbColor(sColor, percent) {
	
	function calcPart(val, percent) {
	
		// 	Negative outputs are shades, and positive outputs are tints.
		if ( percent >= 0 )
			return Math.min( 255, (255 - val) * percent + val );		
		else
			return Math.max( 0, val * (1 + percent) );
	}
	
	var color = new RGBColor( sColor );
	var hsv = rgbToHsv( calcPart(color.r, percent), calcPart(color.g, percent), calcPart(color.b, percent) );
	
	return hsvToRgb(hsv.hue, hsv.saturation, hsv.value).toHex();
}