    if (typeof(window["OfficeExcel"]) == 'undefined') window["OfficeExcel"] = {type:'common'};

    OfficeExcel.background     = {};
    /**
    * Returns five values which are used as a nice scale
    * 
    * @param  max int    The maximum value of the graph
    * @param  obj object The graph object
    * @return     array   An appropriate scale
    */
    OfficeExcel.getScale = function (max, obj, minVal, maxVal,yminVal,ymaxVal)
    {
        var original_max = max;

        var mainObj = obj;
        if(undefined == mainObj)
            mainObj = bar;
        if('auto' == mainObj._otherProps._ylabels_count)
        {
			if(( 'bar' == mainObj.type || 'line' == mainObj.type) && mainObj._otherProps._autoGrouping != undefined && mainObj._otherProps._autoGrouping == 'stackedPer')
            {
                var arrNew =  mainObj.data;
     
                if(typeof(arrNew[0]) == 'object')
                {
                    var arrMin = [];
                    var arrMax = [];
                    for (var j=0; j < arrNew.length; j++) {
                        var newMax = 0;
                        var newMin = 0;
                        if('bar' == mainObj.type)
                        {
                            for (var i=0; i<arrNew[j].length; i++) {
                                if(arrNew[j][i] > 0)
                                    newMax += arrNew[j][i]
                                else
                                    newMin += arrNew[j][i]
                            }
                            arrMin[j] = newMin;
                            arrMax[j] = newMax;
                        }
                        else
                        {
                            min = Math.min.apply(null, arrNew[j]);
                            max = Math.max.apply(null, arrNew[j]);
                            arrMin[j] = min;
                            arrMax[j] = max;
                        }
                       
                    }
                    min = Math.min.apply(null, arrMin);
                    max = Math.max.apply(null, arrMax);
                }
                else
                {
					min = minVal;
                    max = maxVal;
                }

                    var newMin = min;
                    var newMax  = max;
                    
                    //находим максимум после преобразования
                    if('bar' != mainObj.type)
                    {
                         if(typeof(arrNew[0]) == 'object')
                        {
                            var arrMin = [];
                            var arrMax = [];
                            for (var j=0; j < arrNew.length; j++) {
                                newMin = Math.min.apply(null, arrNew[j]);
                                newMax = Math.max.apply(null, arrNew[j]);
                                arrMin[j] = newMin;
                                arrMax[j] = newMax;
                            }
                            newMin = Math.min.apply(null, arrMin);
                            newMax = Math.max.apply(null, arrMax);
                        }
                        else
                        {
                            newMin = Math.min.apply(null, arrNew);
                            newMax = Math.max.apply(null, arrNew);
                        }
                    }
                   
                    
                    
                    if(max <= 0 && min < 0)
                    {
                        var tempVal = Math.abs(newMax)
                        newMax = Math.abs(newMin);
                        newMin = tempVal;
                    }
                    var massRes = [];
                    
                    //шаг нужно высчитывать
                    var step = 10;
                    if(((newMax - newMin)/10) > 11 )
                        step = 20;
                    if('bar' == mainObj.type  && max > 0 && min < 0)
                        step = 20;
                    var maxValue = 100;
                    //находим максимум
                    for (var i=0; i < 11; i++) {
                        if(newMax < 100 - step*i && newMax > 100 - step*(i+1))
                            maxValue = 100 - step*i;
                    }
                    if(maxValue > 100)
                        maxValue = 100;
                    //получаем массив
                    if(max <= 0 && min < 0)
                    {
                        if('bar' == mainObj.type)
                        {
                            for (var j=0; j < 11; j++) {
                                massRes[j] = (maxValue - step*j);
                                if(massRes[j] == step)
                                {
                                    break;
                                }
                            }
                            mainObj._otherProps._xaxispos = 'top';
                            massRes = OfficeExcel.array_reverse(massRes);
                            mainObj._otherProps._ymax = massRes[massRes.length - 1];
                            mainObj._otherProps._ymin = 0;
                        }
                        else
                        {
                            for (var j=0; j < 11; j++) {
                                massRes[j] = -(maxValue - step - step*j);
                                if(massRes[j] == 0)
                                {
                                    break;
                                }
                            }
                            mainObj._otherProps._ymax = 0;
                            mainObj._otherProps._ymin = OfficeExcel.array_exp(massRes[0] - step);
                        }
                        
                    }
                    else if(max > 0 && min > 0)
                    {
                        for (var j=0; j < 11; j++) {
                            massRes[j] = maxValue - step*j;
                            if(massRes[j] - step == 0)
                            {
                                massRes = OfficeExcel.array_reverse(massRes);
                                break;
                            }
                        }
                        mainObj._otherProps._ymax = OfficeExcel.array_exp(maxValue);
                        mainObj._otherProps._ymin = OfficeExcel.array_exp(massRes[0] - step);
                    }
                    else
                    {
                         for (var j=0; j < 11; j++) {
                            massRes[j] = maxValue - step*j;
                            if(massRes[j] - step <= newMin)
                            {
                                massRes = OfficeExcel.array_reverse(massRes);
                                break;
                            }
                        }
                        mainObj._otherProps._ymax = OfficeExcel.array_exp(maxValue);
                        mainObj._otherProps._ymin = massRes[0] - step;
                    }
                   
   
                    return OfficeExcel.array_exp(massRes);
            }
            else if('scatter' == mainObj.type || 'hbar' == mainObj.type)
            {
                var max1;
                var arr = [];

                //находим минимальное значение
                var min;
                var trueOX = false;
                if('hbar' == mainObj.type)
                {
                    trueOX = true;
                    if(typeof(mainObj.data[0]) == 'object')
                    {
                        var arrMin = [];
                        var arrMax = [];
                        for (var j=0; j < mainObj.data.length; j++) {
                            min = Math.min.apply(null, mainObj.data[j]);
                            max = Math.max.apply(null, mainObj.data[j]);
                            arrMin[j] = min;
                            arrMax[j] = max;
                        }
                        min = Math.min.apply(null, arrMin);
                        max = Math.max.apply(null, arrMax);
                    }
                    else
                    {
                        min = Math.min.apply(null, mainObj.data);
                        max = Math.max.apply(null, mainObj.data);
                    }
					//min = minVal;
					//max = maxVal;
                }
                if('scatter' == mainObj.type)
                {
                    //в этом случае определяем значения для оси OX(max == true)
                    if(mainObj._otherProps._type == 'burse2')
                    {
                        var arrTemp = []
                        var k = 0;
                        for (var j=0; j < mainObj.data[0].length; j++) {
                            for (var i=0; i<5; i++)
                            {
                                arrTemp[k] = mainObj.data[0][j][1][i];
                                k++;
                            }
                        }
                        min = Math.min.apply(null, arrTemp);
                        max = Math.max.apply(null, arrTemp);
                        if(min == max && max == 0)
                        {
                            mainObj._otherProps._ymax = 1;
                            mainObj._otherProps._ymin = 0;
                            return [0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1]
                        }
                    }
                    else if(undefined != max && true == max)
                    {
						min  = minVal;
						max  =  maxVal;
                        trueOX = true;
                    }
                    else
                    {
						min = yminVal;
						max = ymaxVal;
                    }
					if((min == 0 && max == 0) ||(isNaN(min) && isNaN(max)))
						return [0,0.2,0.4,0.6,0.8,1,1.2];
                }

				var degreeNum = 1;
				var maxString = max.toExponential();
				var minString = min.toExponential();
				var floatKoff = 1000000000000;
				if(maxString.search('e-') != -1 || minString.search('e-') != -1)
				{
					var partMin  = minString.split('e-');
					var partMax  = maxString.split('e-');
					if(partMin[1] != undefined)
						degreeNum = Math.pow(10, partMin[1])
					if(partMax[1] != undefined && ((parseFloat(partMin[1]) < parseFloat(partMax[1])) || partMin[1] == undefined))
						degreeNum = Math.pow(10, partMax[1])	
					max = OfficeExcel.num_round(max*degreeNum);
					min = OfficeExcel.num_round(min*degreeNum);
				}
				
                var axisXMax;
                var axisXMin;
                var stepOY;
                var checkInput = false;
                var greaterNull;
                var chackBelowNull = false;
                var checkIsMaxMin = false;
                var arrForRealDiff = [];
				if((min == 0 && max == 0) ||(isNaN(min) && isNaN(max)))
				{
					if( mainObj._otherProps._autoGrouping == 'stackedPer')
						return [20,40,60,80,100];
					else
						return [0.2,0.4,0.6,0.8,1,1.2];
				}
						
                //подготовительная работы для дальнейшего вычисления шага
                if(max >= 0 && min >= 0)
                {
                     if(max == min)
                    {
                        checkIsMaxMin = true;
                        min = 0;
                    }
                        
                    var diffPerMaxMin = ((max - min)/max)*100;
                     axisXMax =  max + 0.05 * (max - min);
                    stepOY = (max-min)/4;
                    if(16.667 > diffPerMaxMin)
                    {
                        if(trueOX)
                        {
                            axisXMin = min;
                            greaterNull = (max - min)/4;
                            arrForRealDiff = [1.59595959,3.18181818,7.954545454];
                        }
                        else
                        {
                            axisXMin = min;
                            greaterNull = (max - min)/6;
                            arrForRealDiff = [1.51515151,3.03030303,7.57575757];
                        }
                    }
                    else
                    {
                        if(trueOX)
                        {
                            greaterNull = max/4;
                            arrForRealDiff = [1.66666666,3.33333333,8.33333333];
                            axisXMin = 0;
                        }
                        else
                        {
                            axisXMin = 0;
                        }
                    }
                }
                else if(max <= 0 && min <= 0)
                {
                    if(max == min)
                    {
                        checkIsMaxMin = true;
                        max = 0;
                    }
                    var tempMax = max;
                    if(!trueOX)
                        mainObj._otherProps._xaxispos = 'top';
                    else
                        mainObj._otherProps._yaxispos = 'right';
                    max = Math.abs(min);
                    min = Math.abs(tempMax);
                    checkInput = true;
                    var diffPerMaxMin = Math.abs(((max - min)/max))*100;
                    axisXMax =  max;
                    stepOY = (max-min)/4;
                    chackBelowNull = true;
                    if(16.667 > diffPerMaxMin)
                    {
                        axisXMin = min;
                        greaterNull = Math.abs((Math.abs(max) - Math.abs(min)))/6;
                        arrForRealDiff = [1.51515151,3.03030303,7.57575757];
                    }
                    else
                    {
                        if(trueOX)
                        {
                            greaterNull = max/4;
                            arrForRealDiff = [1.66666666,3.33333333,8.33333333];
                            axisXMin = 0;
                        }
                        else
                        {
                            axisXMin = 0;
                        }
                    }
                }
                else if(max > 0 && min < 0)
                {
                    stepOY = (max + Math.abs(min))/4;
                    axisXMax = max;
                    axisXMin = min;
                    if(trueOX)
                    {
                        greaterNull = (Math.abs(max) + Math.abs(min))/4;
                        arrForRealDiff = [1.59090909,3.18181818,7.954545454]
                    }
                    else
                    {
                        greaterNull = Math.abs((Math.abs(max) + Math.abs(min)))/6;
                        arrForRealDiff = [1.51515151,3.03030303,7.57575757]
                    }
                }
                
                
                
                
                //приводим к первому порядку для дальнейших вычислений
                var secPart = max.toString().split('.');
                var numPow = 1;
				if(secPart[1] && secPart[1].toString().search('e+') != -1 && secPart[0] && secPart[0].toString().length == 1)
				{
					var expNum = secPart[1].toString().split('e+');
					numPow = Math.pow(10, expNum[1]);
				}
                else if(0 != secPart[0])
                    numPow = Math.pow(10, secPart[0].toString().length - 1)
                max = max/numPow;
                if(0 == max.toString().split('.')[0])
                {
                    var tempMax = max;
                    var num = -1;
                    while(0 == tempMax.toString().split('.')[0])
                    {
                        tempMax = max;
                        numPow = Math.pow(10, num);
                        tempMax = tempMax/numPow;
                        num--;
                    }
                    max = tempMax;
                }
                
                
                var stepOYPart = stepOY.toString().split('.');
                var numPowOY;
                var tempVal;
                
                if(0 != stepOYPart[0])
                    numPowOY = Math.pow(10, stepOYPart[0].toString().length - 1)
                if(10 == stepOYPart[0])
                    numPowOY = 1;
                if(0 == stepOYPart[0])
                {
                    var tempMax = stepOY;
                    var num = -1;
                    while(0 == tempMax.toString().split('.')[0])
                    {
                        tempMax = stepOY;
                        numPowOY = Math.pow(10, num);
                        tempMax = tempMax/numPowOY;
                        num--;
                    }
                }
                
                
                //поиск шага
                if(undefined != greaterNull)
                {
                     var greaterNullTemp = greaterNull.toString().split('.'), greaterNullNum;
                    if(0 != greaterNullTemp[0])
                        greaterNullNum = Math.pow(10, greaterNullTemp[0].toString().length - 1)
                    if(0 == greaterNullTemp[0])
                    {
                        var tempMax = greaterNull;
                        var num = -1;
                        while(0 == tempMax.toString().split('.')[0])
                        {
                            tempMax = greaterNull;
                            greaterNullNum = Math.pow(10, num);
                            tempMax = tempMax/greaterNullNum;
                            num--;
                        }
                    }
					else if(greaterNull.toString().indexOf("e+") > -1)
					{
						var splitString = greaterNull.toString().split("e+");
						if(splitString[1])
							greaterNullNum = Math.pow(10, parseFloat(splitString[1]));
					}
                    
                    greaterNull = greaterNull/greaterNullNum;

                         if(1 < greaterNull && arrForRealDiff[0] >= greaterNull)
                            greaterNull = 1;
                        else if(arrForRealDiff[0] < greaterNull && arrForRealDiff[1] >= greaterNull)
                            greaterNull = 2;
                        else if(arrForRealDiff[1] < greaterNull && arrForRealDiff[2] >= greaterNull)
                            greaterNull = 5;
                        else if(arrForRealDiff[2] < greaterNull && 10 >= greaterNull)
                            greaterNull = 10;
                   
                    greaterNull = greaterNull*greaterNullNum;
                    stepOY = greaterNull;
                }
                
                arr[0] = 0;arr[1] = 1;arr[2] = 2;arr[3] = 5;arr[4] = 10;
                //если максимальное значение больше числа из данного массива, меняем диапазон по оси OY
                var arrMaxVal = [0,0.952380952,1.904761904,4.76190476,9.523809523]
                //массив диапазонов
                var arrDiffVal1 = [0,0.2,0.5,1,2]
                if(axisXMin == 0 && undefined == greaterNull)//если разница между min и max такая, что не нужно масштабировать
                {
                    var trueDiff = 1;
					for (var i=0; i<arr.length; i++) {
                        if( max >= arr[i] && max <= arr[i+1])
                        {
                            var max1 = arr[i+1];
                            var trueMax;
                            var diff = max1/10;
                            trueDiff = diff;
                            var maxVal;
                            //проверяем есть ли переход в следующий диапазон
                            if(max > arrMaxVal[i+1])
                            {
                                trueDiff = arrDiffVal1[i+1]
                            }
                        }
                    }
                    stepOY = trueDiff*numPow;
                }
                
                if('hbar' == mainObj.type && mainObj._otherProps._autoGrouping == 'stackedPer')
                {
                    if(axisXMin < 0 && axisXMax > 0)
                    {
                        var summVal = Math.abs(axisXMin) + Math.abs(axisXMax)
                        if(summVal <= 100)
                            stepOY  = 10;
                        else if(summVal > 100 && summVal <= 139)
                            stepOY  = 20;
                        else
                            stepOY  = 50;
                    }
                    else
                    {
                        stepOY  = 20;
                    }
                }
                
                //находим истинные min и max
                var testDiff;
                var axisXMinTest;
                if(axisXMin == 0)
                {
                    testDiff = stepOY/numPow;
                    axisXMinTest = axisXMin/numPow
                }
                else
                {
                    testDiff = stepOY/numPowOY;
                    axisXMinTest = axisXMin/numPowOY;
                }
                var tempNum;
                var countAfterPoint = 1;
                
                if(undefined != axisXMinTest.toString().split('.')[1])
                {
                    countAfterPoint = Math.pow(10, axisXMinTest.toString().split('.')[1].toString().length - 1)
                }
                
                if(1 == testDiff)
                    tempNum = testDiff/4;
                else if(2 == testDiff)
                    tempNum = testDiff/4;
                else if(5 == testDiff)
                    tempNum = testDiff/10;
                else if(10 == testDiff)
                    tempNum = testDiff/20;
                axisXMinTest = Math.floor(axisXMinTest);
                while(0 != axisXMinTest%testDiff)
                {
                    axisXMinTest = axisXMinTest - tempNum;
                }

                
                
                //возвращаем массив
                var varMin = axisXMinTest*numPowOY;
                var massRes = [];
                var tempKoff = 100000000000;
                varMin = OfficeExcel.num_round(varMin);
 
 
                var lengthNum;
                if(!trueOX)
                {
                    
                    if(chackBelowNull)
                    {
                        if(min == varMin && !checkIsMaxMin && min != 0 )
                            varMin = varMin - stepOY ;
						varMin = varMin/degreeNum;
						stepOY = stepOY/degreeNum;
						axisXMax = axisXMax/degreeNum;
						max = max/degreeNum;
                        if(undefined != varMin.toString().split('.')[1])
                            lengthNum = varMin.toString().split('.')[1].length;
                        for (var k=0; k <= 11; k++) {
							massRes[k] = OfficeExcel.num_round(varMin + (k)*(stepOY));
                            if(massRes[k] > axisXMax)
                            {
                                break;
                            }
                        
                        }
                        if(massRes[massRes.length - 1] == max && !checkIsMaxMin)
                            massRes[massRes.length] = massRes[massRes.length - 1] + stepOY;
                        
                        mainObj._otherProps._ymax = -massRes[0];
                        mainObj._otherProps._ymin = -massRes[massRes.length - 1];
                        mainObj.max = -massRes[0];
                    }
                    else
                    {
                        if(min == varMin && !checkIsMaxMin)
                            varMin = varMin - stepOY ;
                        if(undefined != varMin.toString().split('.')[1])
                            lengthNum = varMin.toString().split('.')[1].length;
						
						 varMin = varMin/degreeNum;
						stepOY = stepOY/degreeNum;
						axisXMax = axisXMax/degreeNum;
						max = max/degreeNum;
						
                        if(min == 0 && (mainObj._otherProps._type == 'burse2' || mainObj.type == 'scatter'))
                            varMin = 0;
                        if(max == 0 && mainObj._otherProps._type == 'burse2')
                            axisXMax = 0 + stepOY;
                        for (var k=0; k <= 11; k++) {
							massRes[k] =  OfficeExcel.num_round(varMin + (k)*(stepOY));
                            if(massRes[k] > axisXMax)
                            {
                                break;
                            }
                        
                        }
                        if(massRes[massRes.length - 1] == max && !checkIsMaxMin)
                            massRes[massRes.length] = massRes[massRes.length - 1] + stepOY;
                        mainObj.max =  massRes[massRes.length - 1];
                        mainObj._otherProps._ymax = massRes[massRes.length - 1];
                        mainObj._otherProps._ymin = massRes[0];
                    }
                }
                else
                {
                    if(chackBelowNull)
                    {
                        if(min == varMin && !checkIsMaxMin && min != 0)
                            varMin = varMin - stepOY ; 
                        if(undefined != varMin.toString().split('.')[1])
                            lengthNum = varMin.toString().split('.')[1].length;
						varMin = varMin/degreeNum;
						stepOY = stepOY/degreeNum;
						axisXMax = axisXMax/degreeNum;	
						max = max/degreeNum;
                        for (var k=0; k <= 11; k++) {
							massRes[k] = OfficeExcel.num_round(varMin + (k)*(stepOY));
                            if('hbar' == mainObj.type && mainObj._otherProps._autoGrouping == 'stackedPer')
                            {
                                if(massRes[k] >= original_max)
                                {
                                    break;
                                }
                            }
                            else
                            {
                                if(massRes[k] > axisXMax)
                                {
                                    break;
                                }
                            }
                        
                        }
                        if(massRes[massRes.length - 1] == max && !checkIsMaxMin)
                            massRes[massRes.length] = massRes[massRes.length - 1] + stepOY;
                        
                        mainObj._otherProps._xmax = -massRes[0];
                        mainObj._otherProps._xmin = -massRes[massRes.length - 1];
                    }
                    else
                    {
                        if(min == varMin && !checkIsMaxMin &&  'hbar' != mainObj.type && mainObj._otherProps._autoGrouping != 'stackedPer')
                            varMin = varMin - stepOY ;
                        if(undefined != varMin.toString().split('.')[1])
                            lengthNum = varMin.toString().split('.')[1].length; 
						
						 varMin = varMin/degreeNum;
						stepOY = stepOY/degreeNum;
						axisXMax = axisXMax/degreeNum;
						max = max/degreeNum;
                        for (var k=0; k <= 11; k++) {
							massRes[k] = OfficeExcel.num_round(parseFloat(varMin + (k)*(stepOY)));
                            if('hbar' == mainObj.type && mainObj._otherProps._autoGrouping == 'stackedPer')
                            {
                                if(massRes[k] >= original_max)
                                {
                                    break;
                                }
                            }
                            else
                            {
                                if(massRes[k] > axisXMax)
                                {
                                    break;
                                }
                            }
                        }
                        
                        if(massRes[massRes.length - 1] == max && !checkIsMaxMin)
                            massRes[massRes.length] = massRes[massRes.length - 1] + stepOY;
                        
                        mainObj._otherProps._xmax = massRes[massRes.length - 1];
                        mainObj._otherProps._xmin = massRes[0];
                        mainObj._otherProps._xmax = massRes[massRes.length - 1];
                    }
                }
                if('hbar' == mainObj.type)
                {
                    massRes.splice(0,1);
                }
                return OfficeExcel.array_exp(massRes);
            }
            else
            {
                var max1;
                var arr = [];
                //находим минимальное значение
                var min;
                var max;
                if('bar' == mainObj.type || 'hbar' == mainObj.type || 'radar' == mainObj.type)
                {
                    if(mainObj._otherProps._type == 'accumulative')
                    {
                        //суммируем отрицательные и положительные значения
                        if(typeof(mainObj.data[0]) == 'object')
                        {
                            var arrMin = [];
                            var arrMax = [];
                            for (var j=0; j < mainObj.data.length; j++) {
                                var allHeightAbNull = 0;
                                var allHeightLessNull = 0;
                                for (var i=0; i < mainObj.data[j].length; i++) 
                                    {
                                        
                                        if(mainObj.data[j][i] > 0)
                                            allHeightAbNull += mainObj.data[j][i];
                                        else
                                            allHeightLessNull += mainObj.data[j][i];
                                    }
                                    arrMin[j] = allHeightLessNull;
                                    arrMax[j] = allHeightAbNull;
                            }
                            min = Math.min.apply(null, arrMin);
                            max = Math.max.apply(null, arrMax);
                        }
                        else
                        {
                            min = Math.min.apply(null, mainObj.data);
                            max = Math.max.apply(null, mainObj.data);
                        }
                    }
                    else
                    {
						min = minVal;
						max = maxVal;
                    }
                }
                else
                {
                    if(('line' == mainObj.type && mainObj._otherProps._autoGrouping == 'stacked' ) || 'line' != mainObj.type )
					{
						var arrMin = [];
						var arrMax = [];
						for (var j=0; j<mainObj.data.length; j++) {
							min = Math.min.apply(null, mainObj.data[j]);
							max = Math.max.apply(null, mainObj.data[j]);
							arrMin[j] = min;
							arrMax[j] = max;
						}	
						min = Math.min.apply(null, arrMin);
						max = Math.max.apply(null, arrMax);
                    }
					else
					{	
						min = minVal;
						max = maxVal;
					}
                }
                
                if(max == min)
                {
                    if(max > 0)
                        min = 0;
                    else if(max < 0)
                        max = 0;
                }
				
				var degreeNum = 1;
				var maxString = max.toExponential();
				var minString = min.toExponential();
				var floatKoff = 10000000000;
				if(maxString.search('e-') != -1 || minString.search('e-') != -1)
				{
					var partMin  = minString.split('e-');
					var partMax  = maxString.split('e-');
					if(partMin[1] != undefined)
						degreeNum = Math.pow(10, partMin[1])
					if(partMax[1] != undefined && (parseFloat(partMin[1]) < parseFloat(partMax[1])))
						degreeNum = Math.pow(10, partMax[1])	
					max = OfficeExcel.num_round(max*degreeNum);
					min = OfficeExcel.num_round(min*degreeNum);
				}
				
				
                var axisXMax;
                var axisXMin;
                var stepOY;
                var checkInput = false;
                var greaterNull;
                var firstMax = max;
                var firstMin = min;
                
                
                var arrForRealDiff = [];
                if(max >= 0 && min >= 0)
                {
                    var diffPerMaxMin = ((max - min)/max)*100;
                     axisXMax =  max + 0.05 * (max - min);
                    stepOY = (max-min)/4;
                    if(16.667 > diffPerMaxMin)
                    {
                        axisXMin = min - ((max - min) / 2);
                        greaterNull = (max - min)/4;
                        arrForRealDiff = [1.5873,3.1745,7.93651]
                    }
                    else
                    {
                        axisXMin = 0;
                    }
                }
                else if(max <= 0 && min <= 0)
                {
                    var tempMax = max;
                    mainObj._otherProps._xaxispos = 'top';
                    max = Math.abs(min);
                    min = Math.abs(tempMax);
                    checkInput = true;
                    var diffPerMaxMin = ((max - min)/max)*100;
                     axisXMax =  max + 0.05 * (max - min);
                    stepOY = (max-min)/4;
                    if(16.667 > diffPerMaxMin)
                    {
                        axisXMin = min - ((max - min) / 2);
                        greaterNull = (max - min)/4;
                        arrForRealDiff = [1.5873,3.1745,7.93651]
                    }
                    else
                    {
                        axisXMin = 0;
                    }
                }
                else if(max > 0 && min < 0)
                {
                    stepOY = (max + Math.abs(min))/4;
                    axisXMax = max + 0.05 * (max - min);
                    axisXMin = min + 0.05 * (min - max);
                    greaterNull = (Math.abs(max) + Math.abs(min))/6;
                    arrForRealDiff = [1.51515151,3.03030303,7.57575757]
                }
                
                
                //приведение к первому порядку для дальнейших вычислений
                var secPart = max.toString().split('.');
                var numPow = 1;
				if(secPart[1] && secPart[1].toString().search('e+') != -1 && secPart[0] && secPart[0].toString().length == 1)
				{
					var expNum = secPart[1].toString().split('e+');
					numPow = Math.pow(10, expNum[1]);
				}
                else if(0 != secPart[0])
                    numPow = Math.pow(10, secPart[0].toString().length - 1)
                max = max/numPow;
				if((min == 0 && max == 0) ||(isNaN(min) && isNaN(max)))
						return [0.2,0.4,0.6,0.8,1,1.2];
                if(0 == max.toString().split('.')[0])
                {
                    var tempMax = max;
                    var num = -1;
                    while(0 == tempMax.toString().split('.')[0])
                    {
                        tempMax = max;
                        numPow = Math.pow(10, num);
                        tempMax = tempMax/numPow;
                        num--;
                    }
                    max = tempMax;
                }
                
                
                var stepOYPart = stepOY.toString().split('.');
                var numPowOY;
                var tempVal;
                
                if(0 != stepOYPart[0])
                    numPowOY = Math.pow(10, stepOYPart[0].toString().length - 1)
                if(10 == stepOYPart[0])
                    numPowOY = 1;
                if(0 == stepOYPart[0])
                {
                    var tempMax = stepOY;
                    var num = -1;
                    while(0 == tempMax.toString().split('.')[0])
                    {
                        tempMax = stepOY;
                        numPowOY = Math.pow(10, num);
                        tempMax = tempMax/numPowOY;
                        num--;
                    }
                }
                
                
                //поиск шага
                if(undefined != greaterNull)
                {
                     var greaterNullTemp = greaterNull.toString().split('.');
                    if(0 != greaterNullTemp[0])
                        greaterNullNum = Math.pow(10, greaterNullTemp[0].toString().length - 1)
                    if(0 == greaterNullTemp[0])
                    {
                        var tempMax = greaterNull;
                        var num = -1;
                        while(0 == tempMax.toString().split('.')[0])
                        {
                            tempMax = greaterNull;
                            greaterNullNum = Math.pow(10, num);
                            tempMax = tempMax/greaterNullNum;
                            num--;
                        }
                    }
                    
                    greaterNull = greaterNull/greaterNullNum;
                    if(1 < greaterNull && arrForRealDiff[0] >= greaterNull)
                        greaterNull = 1;
                    else if(arrForRealDiff[0] < greaterNull && arrForRealDiff[1] >= greaterNull)
                        greaterNull = 2;
                    else if(arrForRealDiff[1] < greaterNull && arrForRealDiff[2] >= greaterNull)
                        greaterNull = 5;
                    else if(arrForRealDiff[2] < greaterNull && 10 >= greaterNull)
                        greaterNull = 10;
                    greaterNull = greaterNull*greaterNullNum;
                    stepOY = greaterNull;
                }
                
                arr[0] = 0;arr[1] = 1;arr[2] = 2;arr[3] = 5;arr[4] = 10;
                //если максимальное значение больше числа из данного массива, меняем диапазон по оси OY
                var arrMaxVal = [0,0.952380952,1.904761904,4.76190476,9.523809523]
                //массив диапазонов
                var arrDiffVal1 = [0,0.2,0.5,1,2]
                if(axisXMin == 0)//если разница между min и max такая, что не нужно масштабировать
                {
                    var trueDiff = 1;
					for (var i=0; i<arr.length; i++) {
                        if( max >= arr[i] && max <= arr[i+1])
                        {
                            var max1 = arr[i+1];
                            var trueMax;
                            var diff = max1/10;
                            trueDiff = diff;
                            var maxVal;
                            //проверяем есть ли переход в следующий диапазон
                            if(max > arrMaxVal[i+1])
                            {
                                trueDiff = arrDiffVal1[i+1]
                            }
                        }
                    }
                    stepOY = trueDiff*numPow;
                }
                
                
                stepOY = OfficeExcel.num_round(stepOY);
                
                
                
                //находим истинные min и max
                var testDiff;
                var axisXMinTest;
                if(axisXMin == 0)
                {
                    testDiff = stepOY/numPow;
                    axisXMinTest = axisXMin/numPow
                }
                else
                {
                    testDiff = stepOY/numPowOY;
                    axisXMinTest = axisXMin/numPowOY;
                }
                var tempNum;
                var countAfterPoint = 1;
                
                if(undefined != axisXMinTest.toString().split('.')[1])
                {
                    countAfterPoint = Math.pow(10, axisXMinTest.toString().split('.')[1].toString().length - 1)
                }
                var floatKoff = 10000000000;
                if(0.5 == testDiff)
                    tempNum = testDiff/5;
                else if(1 == testDiff)
                    tempNum = testDiff/4;
                else if(2 == testDiff)
                    tempNum = testDiff/4;
                else if(5 == testDiff)
                    tempNum = testDiff/10;
				else
					tempNum = testDiff/20;
                if(testDiff != 0.5)
					axisXMinTest = Math.floor(axisXMinTest);
				else
				{
					axisXMinTest = Math.round(axisXMinTest*100)/100;
					if(axisXMinTest.toString().split('.')[1] != undefined)
					{
						var lengthAfterPoint = axisXMinTest.toString().split('.')[1].length;
						var l = 0;
						while(axisXMinTest.toString().split('.')[1].length != 1)
						{
							axisXMinTest = axisXMinTest - Math.pow(10,-(lengthAfterPoint));
							if(l > 9)
							{
								axisXMinTest = Math.floor(axisXMinTest);
								break;
							}
							l++;
						}
					}
					
				}
					
                while(0 != axisXMinTest%testDiff)
                {
                    axisXMinTest = axisXMinTest - tempNum;
                    if(testDiff == 0.5)
                    {
                        axisXMinTest = OfficeExcel.num_round(axisXMinTest);
                    }
                }
    
                
                
                //возвращаем массив
                var varMin = axisXMinTest*numPowOY;
                var massRes = [];
                
                var tempKoff = 100000000000000;
                varMin = OfficeExcel.num_round(varMin);
                if(undefined != varMin.toString().split('.')[1])
                    lengthNum = varMin.toString().split('.')[1].length;
                if('radar' == mainObj.type)
                {
                     for (var k=0; k <= 11; k++) {
                        if(undefined != lengthNum)
                            massRes[k] = (varMin + (k)*(stepOY)).toFixed(lengthNum);
                        else
                            massRes[k] = varMin + (k)*(stepOY);
                        if(massRes[k] > axisXMax)
                        {
                            break;
                        }
                    }
                    if(firstMax < 0 && firstMin < 0)
                    {
                        for (var k=0; k < massRes.length; k++) {
                            massRes[k] = - massRes[k];
                        }
                        var tempMax = firstMax;
                        firstMax = firstMin;
                        firstMin = tempMax;
                    }
                    if(firstMax == massRes[massRes.length - 2])
                        massRes.splice(massRes.length - 1,massRes.length - 1);
                    if(firstMin == massRes[1])
                        massRes.splice(0,0);
                    if(firstMin < 0 && firstMax > 0)
                    {
                        for (var i=0; i <= massRes.length; i++) {
                            if(firstMin == massRes[i])
                            {
                                massRes.splice(0,i);
                                break;
                            }
                        }
                    }
                    if(firstMax < 0 && firstMin < 0)
                        massRes =  OfficeExcel.array_reverse(massRes);
                    return [massRes,min,max];
                }
                else if('line' == mainObj.type && max > 0 && min < 0)
                {
                    //varMin  = varMin + stepOY;
					varMin = varMin/degreeNum;
					stepOY = stepOY/degreeNum;
					axisXMax = axisXMax/degreeNum;
                    for (var k=0; k <= 11; k++) {
						massRes[k] = OfficeExcel.num_round((parseFloat(varMin + (k+1)*(stepOY))));
                        if(massRes[k] > axisXMax)
                        {
                            break;
                        }
                
                    }
                }
                else
                {
                    varMin = varMin/degreeNum;
					stepOY = stepOY/degreeNum;
					axisXMax = axisXMax/degreeNum;
					 for (var k=0; k <= 11; k++) {
						massRes[k] = OfficeExcel.num_round((varMin + (k+1)*(stepOY)));
                        if(massRes[k] > axisXMax)
                        {
                            break;
                        }
                
                    }
                }
                if('hbar' == mainObj.type)
                {
                     mainObj._otherProps._xmin = massRes[0] - stepOY;
                     mainObj._otherProps._xmax = massRes[massRes.length - 1];
                }
                else if('line' == mainObj.type && max > 0 && min < 0)
                {
                    mainObj._otherProps._ymax = massRes[massRes.length - 1];
                    mainObj._otherProps._ymin = OfficeExcel.num_round(OfficeExcel.array_exp(massRes[0] - stepOY));
                }
                else
                {
                    mainObj._otherProps._ymax = massRes[massRes.length - 1];
                    mainObj._otherProps._ymin =  OfficeExcel.num_round(OfficeExcel.array_exp(massRes[0] - stepOY));
                }
                return OfficeExcel.array_exp(massRes);
            }
        }
        
        if (max <= 1) {
            if (max > 0.5) {
                return [0.2,0.4,0.6,0.8, Number(1).toFixed(1)];

            } else if (max >= 0.1) {
                return [0.1,0.2,0.3,0.4,0.5];

            } else {

                var tmp = max;
                var exp = 0;

                while (tmp < 1.01) {
                    exp += 1;
                    tmp *= 10;
                }

                var ret = ['2e-' + exp, '4e-' + exp, '6e-' + exp, '8e-' + exp, '10e-' + exp];


                if (max <= ('5e-' + exp)) {
                    ret = ['1e-' + exp, '2e-' + exp, '3e-' + exp, '4e-' + exp, '5e-' + exp];
                }

                return ret;
            }
        }

        // Take off any decimals
        if (String(max).indexOf('.') > 0) {
            max = String(max).replace(/\.\d+$/, '');
        }

        var interval = Math.pow(10, Number(String(Number(max)).length - 1));
        var topValue = interval;

        while (topValue < max) {
            topValue += (interval / 2);
        }

        // Handles cases where the max is (for example) 50.5
        if (Number(original_max) > Number(topValue)) {
            topValue += (interval / 2);
        }

        // Custom if the max is greater than 5 and less than 10
        if (max < 10) {
            topValue = (Number(original_max) <= 5 ? 5 : 10);
        }

        return [topValue * 0.2, topValue * 0.4, topValue * 0.6, topValue * 0.8, topValue];
    }


    /**
    * Returns the maximum numeric value which is in an array
    * 
    * @param  array arr The array (can also be a number, in which case it's returned as-is)
    * @param  int       Whether to ignore signs (ie negative/positive)
    * @return int       The maximum value in the array
    */
    OfficeExcel.array_max = function (arr)
    {
        var max = null;
        
        if (typeof(arr) == 'number') {
            return arr;
        }
        
        for (var i=0; i<arr.length; ++i) {
            if (typeof(arr[i]) == 'number') {

                var val = arguments[1] ? Math.abs(arr[i]) : arr[i];
                
                if (typeof(max) == 'number') {
                    max = Math.max(max, val);
                } else {
                    max = val;
                }
            }
        }
        
        return max;
    }
	
	OfficeExcel.array_exp = function (arr)
    {
		var maxDig = 1000000000;
		var minDig = 0.000000001;
		var floatKoff = 100000000000;
		
		if(typeof(arr) == 'number')
		{
			if(arr < 0)
				maxDig = 100000000;
			if(Math.abs(arr) > maxDig)
			{
				var tmp = Math.abs(arr);
				var exp = 0;
				while (tmp > 9) {
					exp += 1;
					tmp /= 10;
				}
				if(arr < 0)
					tmp *= -1; 
				arr = tmp + "E+" + exp;
			}
		}
		else
		{
			for (var i=0; i<arr.length; ++i) {
			maxDig = 1000000000
			if(arr[i] < 0)
				maxDig = 100000000;
				if(Math.abs(arr[i]) > maxDig)
				{
					var tmp = Math.abs(arr[i]);
					var exp = 0;
					while (tmp > 9) {
						exp += 1;
						tmp /= 10;
					}
					tmp = Math.round(tmp*floatKoff)/floatKoff
					if(arr[i] < 0)
						tmp *= -1; 
					arr[i] = tmp + "E+" + exp;
				}
			}
		}
		return arr;
	}
	
	OfficeExcel.num_round = function (num)
	{
		if(num.toString() && num.toString().indexOf('e+') == -1 && isNaN(parseFloat(num)))
			return num;
		var floatKoff = 100000000000;
		if(num.toString() && num.toString().indexOf('e+') > -1)
		{
			var parseVal = num.toString().split("e+");
			var roundVal = Math.round(parseFloat(parseVal[0])*floatKoff)/floatKoff;
			var changeSymbol = roundVal.toString() + "e+" + parseVal[1];
			num = parseFloat(changeSymbol);
		}
		num =  Math.round(num*floatKoff)/floatKoff ;
		return num;
	}

    /**
    * An array sum function
    * 
    * @param  array arr The  array to calculate the total of
    * @return int       The summed total of the arrays elements
    */
    OfficeExcel.array_sum = function (arr)
    {
        // Allow integers
        if (typeof(arr) == 'number') {
            return arr;
        }

        var i, sum;
        var len = arr.length;

        for(var i=0,sum=0;i<len;sum+=arr[i++]);
        return sum;
    }

	OfficeExcel.Text = function (context, font, size, x, y, text)
    {
		var drwContext = OfficeExcel.drawingCtxCharts;
		var scale = 1;
		if(drwContext)
		{
			scale = drwContext.scaleFactor;
			drwContext.setCanvas(bar.canvas);
			var fontProp = window["Asc"].FontProperties;
			if(!fontProp)
				fontProp = FontProperties;
			
			context = drwContext;
			 // Need these now the angle can be specified, ie defaults for the former two args
			if (typeof(arguments[6]) == null) arguments[6]  = 'bottom'; // Vertical alignment. Default to bottom/baseline
			if (typeof(arguments[7]) == null) arguments[7]  = 'left';   // Horizontal alignment. Default to left
			if (typeof(arguments[8]) == null) arguments[8]  = null;     // Show a bounding box. Useful for positioning during development. Defaults to false
			if (typeof(arguments[9]) == null) arguments[9]  = 0;        // Angle (IN DEGREES) that the text should be drawn at. 0 is middle right, and it goes clockwise
			if (typeof(arguments[12]) == null) arguments[12] = true;    // Whether the bounding box has the placement indicator

			// The alignment is recorded here for purposes of Opera compatibility
			if (navigator.userAgent.indexOf('Opera') != -1) {
				context.canvas.__OfficeExcel_valign__ = arguments[6];
				context.canvas.__OfficeExcel_halign__ = arguments[7];
			}

			// First, translate to x/y coords
			/*context.save();

			context.canvas.__OfficeExcel_originalx__ = x;
			context.canvas.__OfficeExcel_originaly__ = y;
			context.translate(x, y);*/
			var italic = arguments[13] && arguments[13].italic ? arguments[13].italic : false;
			var underline = arguments[13] && arguments[13].underline ? arguments[13].underline : false;
			
			var ascFont = new fontProp(font, size, arguments[11], italic, underline);
			context.setFont(ascFont);
		 
			var width;
			var textSize, size1;
			if(typeof text != 'string')
				text = text.toString();
			if(text != "")
				textSize  = context.measureText(text,1);
			

			// Vertical alignment - defaults to bottom
			if (arguments[6]) {
				var vAlign = arguments[6];
				if(textSize)
					size1 = (textSize.height/0.75)*scale;
				else
					size1 = size;
				if (vAlign == 'center') {
					y = y + size1 / 2;
					//context.translate(0, size / 2);
				} else if (vAlign == 'top') {
					y = y + size1;
					//context.translate(0, size);
				}
			}


			// Hoeizontal alignment - defaults to left
			if (arguments[7] && textSize) {
				var hAlign = arguments[7];
				width = (textSize.width/0.75)*scale;
				if (hAlign) {
					if (hAlign == 'center') {
						//context.translate(-1 * (width / 2), 0)
						x = x - width/2;
					} else if (hAlign == 'right') {
						x = x - width;
						//context.translate(-1 * width, 0)
					}
				}
			}
			if(arguments[13] && arguments[13].color)
				context.setFillStyle(arguments[13].color);
			else
				context.setFillStyle(new CColor(0, 0, 0));
			x = x/(scale);
			y = y/(scale);
			// Rotate the canvas if need be
			if (arguments[9] && textSize) {
				var textOptions = 
				{
					font: ascFont,
					width: textSize.width,
					height: textSize.height,
					x: x*0.75,
					y: y*0.75
				};
				OfficeExcel.drawTurnedText(context,textOptions, text, arguments[9]);
			}
			
			if(!arguments[9])
			{
				 context.fillText(text, x*0.75, y*0.75);
				 context.lineWidth = 1;
			}	
			 //context.restore();
		}
    }
	
	OfficeExcel.drawTurnedText = function(drawingCtx,textOptions, text, angle)
	{
		var cx = textOptions.x;
		var cy = textOptions.y;
		var textWidth = 0;
		var textHeight = 0;
		var font = textOptions.font;
		var size = textOptions.size;
		var asc = window["Asc"]; 
		
		if(!angle)
			angle = 90;
		
		if(window["editor"])
		{
			var m = new CMatrix();
			drawingCtx.setFont(font);
			m.Rotate(angle);
			drawingCtx.transform(m.sx, m.shy, m.shx, m.sy, m.tx, m.ty);
			var invertM = m.CreateDublicate().Invert(); 
			var newX = invertM.TransformPointX(cx,cy);
			var newY = invertM.TransformPointY(cx,cy);
			drawingCtx.fillText(text, newX, newY, 0, 0, angle);
		}
		else
		{
			var m = new asc.Matrix();
			m.rotate(angle, 0);

			var mbt = new asc.Matrix();
			mbt.translate(cx + textWidth, cy + textHeight);

			drawingCtx.setFont(font, angle);
			drawingCtx.setTextTransform(m.sx, m.shy, m.shx, m.sy, m.tx, m.ty);
			drawingCtx.setTransform(mbt.sx, mbt.shy, mbt.shx, mbt.sy, mbt.tx, mbt.ty);
			drawingCtx.updateTransforms();

			drawingCtx.fillText(text, 0, 0, 0, 0, angle);

			drawingCtx.resetTransforms();
		}
	}

    // Clear canvas settings and fill rect
    OfficeExcel.Clear = function (canvas, color)
    {
        var context = canvas.getContext('2d');

        if (OfficeExcel.isIE8() && !color)
            color = 'white';

        // Clear canvas
        if (!color || (color && color == 'transparent')) {

            context.clearRect(0, 0, canvas.width, canvas.height);
            
            // Reset the globalCompositeOperation
            context.globalCompositeOperation = 'source-over';

        } else {
            context.fillStyle = color;
            context = canvas.getContext('2d');
            context.beginPath();

            if (OfficeExcel.isIE8())
                context.fillRect(0, 0, canvas.width, canvas.height);
            else
                context.fillRect(-10, -10, canvas.width + 20, canvas.height + 20);

            context.fill();
        }
    }

    OfficeExcel.background.Draw = function (obj)
    {
        var context      = obj.context;
        var height       = 0;
        var gutterLeft   = obj._chartGutter._left;
        var gutterRight  = obj._chartGutter._right;
        var gutterTop    = obj._chartGutter._top;
        var gutterBottom = obj._chartGutter._bottom;
        
        context.fillStyle = obj._otherProps._text_color;

        obj.context.beginPath();

        // Draw the horizontal bars
        context.fillStyle = obj._otherProps._background_barcolor1;
        height = (OfficeExcel.GetHeight(obj) - gutterBottom);

        for (var i=gutterTop; i < height ; i+=80) {
            obj.context.fillRect(gutterLeft, i, OfficeExcel.GetWidth(obj) - gutterLeft - gutterRight, Math.min(40, OfficeExcel.GetHeight(obj) - gutterBottom - i) );
        }

            context.fillStyle = obj._otherProps._background_barcolor2;
            height = (OfficeExcel.GetHeight(obj) - gutterBottom);
    
            for (var i= (40 + gutterTop); i < height; i+=80) {
                obj.context.fillRect(gutterLeft, i, OfficeExcel.GetWidth(obj) - gutterLeft - gutterRight, i + 40 > (OfficeExcel.GetHeight(obj) - gutterBottom) ? OfficeExcel.GetHeight(obj) - (gutterBottom + i) : 40);
            }
            
            context.stroke();
    

        // Draw the background grid
        if (obj._otherProps._background_grid) {

            // If autofit is specified, use the .numhlines and .numvlines along with the width to work
            // out the hsize and vsize
            if (obj._otherProps._background_grid_autofit) {
                var vsize = ((obj.canvas.width - gutterLeft - gutterRight)) / obj._otherProps._background_grid_autofit_numvlines;
                var hsize = (obj.canvas.height - gutterTop - gutterBottom) / (obj._otherProps._background_grid_autofit_numhlines);
				if(vsize > -1 && vsize < 1)
					vsize = 1;
				if(hsize > -1 && hsize < 1)
					hsize = 1;
                obj._otherProps._background_grid_vsize = vsize;
                obj._otherProps._background_grid_hsize = hsize;
            }

            context.beginPath();
            context.lineWidth   = obj._otherProps._background_grid_width ? obj._otherProps._background_grid_width : 1;
            context.strokeStyle = obj._otherProps._background_grid_color;

            // Draw the horizontal lines
            if (obj._otherProps._background_grid_hlines) {
                height = (OfficeExcel.GetHeight(obj) - gutterBottom - gutterTop);
                for (var y = gutterTop; y <= height + gutterTop + 1; y+=obj._otherProps._background_grid_hsize) {
					if((y + obj._otherProps._background_grid_hsize) > (height + gutterTop + 1))
					{
						y = height + gutterTop;
						context.moveTo(gutterLeft, AA(this, y));
						context.lineTo(OfficeExcel.GetWidth(obj) - gutterRight, AA(this, y));
						break;
					}
					else
					{
						  context.moveTo(gutterLeft, AA(this, y));
						context.lineTo(OfficeExcel.GetWidth(obj) - gutterRight, AA(this, y));
					}
                
                }
        }
            
            
            if (obj._otherProps._background_grid_vlines) {
                // Draw the vertical lines
                var width = (obj.canvas.width - gutterRight - gutterLeft)
                for (var x=gutterLeft; x<=width + gutterLeft + 1; x+=obj._otherProps._background_grid_vsize) {
					if((x + obj._otherProps._background_grid_vsize) > width + gutterLeft + 1)
					{
						x = width + gutterLeft;
						context.moveTo(AA(this, x), gutterTop);
						context.lineTo(AA(this, x), obj.canvas.height - gutterBottom);
						context.stroke();
						break;
					}
                    context.moveTo(AA(this, x), gutterTop);
                    context.lineTo(AA(this, x), obj.canvas.height - gutterBottom);
                    context.stroke();
                }
            }

        context.stroke();
        }
    }


    // Makes a clone of an array
    OfficeExcel.array_clone = function (obj)
    {
        if(obj == null || typeof(obj) != 'object')
            return obj;

        var temp = [];

        for (var i = 0;i < obj.length; ++i) {
            if (typeof(obj[i]) == 'number')
                temp[i] = (function (arg) {return Number(arg);})(obj[i]);
            else if (typeof(obj[i]) == 'string')
                temp[i] = (function (arg) {return String(arg);})(obj[i]);
            else if (typeof(obj[i]) == 'function')
                temp[i] = obj[i];
            else
                temp[i] = OfficeExcel.array_clone(obj[i]);
        }

        return temp;
    }


    /**
    * This function reverses an array
    */
    OfficeExcel.array_reverse = function (arr)
    {
        var newarr = [];

        for (var i=arr.length - 1; i>=0; i--) {
            newarr.push(arr[i]);
        }

        return newarr;
    }

	OfficeExcel.numToFormatText = function (value,format)
    {
        if(format == 'General')
			return value;
		var numFormat = oNumFormatCache.get(format);					
		var aFormatedValue = numFormat.format(value, CellValueType.number, 15);
		if(aFormatedValue[0].t == '#')
			return "";
		return aFormatedValue[0].text;
    }	

    OfficeExcel.number_format = function (obj, num)
    {
        var i;
        var prepend = arguments[2] ? String(arguments[2]) : '';
        var append  = arguments[3] ? String(arguments[3]) : '';
        var output  = '';
        var decimal = '';
        var decimal_seperator  = obj._otherProps._scale_point ? obj._otherProps._scale_point : '.';
        var thousand_seperator = obj._otherProps._scale_thousand ? obj._otherProps._scale_thousand : ',';
        RegExp.$1   = '';
        var i,j;

        // Ignore the preformatted version of "1e-2"
        if (String(num).indexOf('e') > 0) {
            return String(prepend + String(num) + append);
        }

        // We need then number as a string
        num = String(num);
        
        // Take off the decimal part - we re-append it later
        if (num.indexOf('.') > 0) {
            num     = num.replace(/\.(.*)/, '');
            decimal = RegExp.$1;
        }

        // Thousand seperator
        //var seperator = arguments[1] ? String(arguments[1]) : ',';
        var seperator = thousand_seperator;
        
        /**
        * Work backwards adding the thousand seperators
        */
        var foundPoint;
        for (var i=(num.length - 1),j=0; i>=0; j++,i--) {
            var character = num.charAt(i);
            
            if ( j % 3 == 0 && j != 0) {
                output += seperator;
            }
            
            /**
            * Build the output
            */
            output += character;
        }
        
        /**
        * Now need to reverse the string
        */
        var rev = output;
        output = '';
        for (var i=(rev.length - 1); i>=0; i--) {
            output += rev.charAt(i);
        }

        // Tidy up
        //output = output.replace(/^-,/, '-');
        if (output.indexOf('-' + obj._otherProps._scale_thousand) == 0) {
            output = '-' + output.substr(('-' + obj._otherProps._scale_thousand).length);
        }

        // Reappend the decimal
        if (decimal.length) {
            output =  output + decimal_seperator + decimal;
            decimal = '';
            RegExp.$1 = '';
        }

        // Minor bugette
        if (output.charAt(0) == '-') {
            output = output.replace(/-/, '');
            prepend = '-' + prepend;
        }

        return prepend + output + append;
    }


    /**
    * Draws horizontal coloured bars on something like the bar, line or scatter
    */
    OfficeExcel.DrawBars = function (obj)
    {
        var hbars = obj._otherProps._background_hbars;

        /**
        * Draws a horizontal bar
        */
        obj.context.beginPath();
        
        for (var i=0; i<hbars.length; ++i) {
            
            // If null is specified as the "height", set it to the upper max value
            if (hbars[i][1] == null) {
                hbars[i][1] = obj.max;
            
            // If the first index plus the second index is greater than the max value, adjust accordingly
            } else if (hbars[i][0] + hbars[i][1] > obj.max) {
                hbars[i][1] = obj.max - hbars[i][0];
            }


            // If height is negative, and the abs() value is greater than .max, use a negative max instead
            if (Math.abs(hbars[i][1]) > obj.max) {
                hbars[i][1] = -1 * obj.max;
            }


            // If start point is greater than max, change it to max
            if (Math.abs(hbars[i][0]) > obj.max) {
                hbars[i][0] = obj.max;
            }
            
            // If start point plus height is less than negative max, use the negative max plus the start point
            if (hbars[i][0] + hbars[i][1] < (-1 * obj.max) ) {
                hbars[i][1] = -1 * (obj.max + hbars[i][0]);
            }

            var ystart = (obj.grapharea - ((hbars[i][0] / obj.max) * obj.grapharea));
            var height = (Math.min(hbars[i][1], obj.max - hbars[i][0]) / obj.max) * obj.grapharea;

            // Account for the X axis being in the center
            if (obj._otherProps._xaxispos == 'center') {
                ystart /= 2;
                height /= 2;
            }
            
            ystart += obj._chartGutter._top

            var x = obj._chartGutter._left;
            var y = ystart - height;
            var w = obj.canvas.width - obj._chartGutter._left - obj._chartGutter._right;
            var h = height;
            
            // Accommodate Opera :-/
            if (navigator.userAgent.indexOf('Opera') != -1 && obj._otherProps._xaxispos == 'center' && h < 0) {
                h *= -1;
                y = y - h;
            }
            
            /**
            * Account for X axis at the top
            */
            if (obj._otherProps._xaxispos == 'top') {
                y  = obj.canvas.height - y;
                h *= -1;
            }

            obj.context.fillStyle = hbars[i][2];
            obj.context.fillRect(x, y, w, h);
        }

        obj.context.fill();
    }

    // Compatibility canvas browser
    OfficeExcel.CanvasBrowserCompat = function (context)
    {
        if (!context) {
            return;
        }

        if (!context.measureText) {
        
            // This emulates the measureText() function
            context.measureText = function (text)
            {
                var textObj = document.createElement('DIV');
                textObj.innerHTML = text;
                textObj.style.backgroundColor = 'white';
                textObj.style.position = 'absolute';
                textObj.style.top = -100
                textObj.style.left = 0;
                document.body.appendChild(textObj);

                var width = {width: textObj.offsetWidth};
                
                textObj.style.display = 'none';
                
                return width;
            }
        }

        if (!context.fillText) {
            // This emulates the fillText() method
            context.fillText    = function (text, targetX, targetY)
            {
                return false;
            }
        }
        
        // If IE8, add addEventListener()
        if (!context.canvas.addEventListener) {
            window.addEventListener = function (ev, func, bubble)
            {
                return this.attachEvent('on' + ev, func);
            }

            context.canvas.addEventListener = function (ev, func, bubble)
            {
                return this.attachEvent('on' + ev, func);
            }
        }
    }

    // Checks the browser for traces of MSIE8
    OfficeExcel.isIE8 = function ()
    {
        return navigator.userAgent.indexOf('MSIE 8') > 0;
    }
    // Checks the browser for traces of MSIE7
    OfficeExcel.isIE7 = function ()
    {
        return navigator.userAgent.indexOf('MSIE 7') > 0;
    }

    // Checks the browser for traces of MSIE9
    OfficeExcel.isOld = function ()
    {
        return OfficeExcel.isIE7() || OfficeExcel.isIE8();
    }

    /**
    * These are older functions that were used before the move to seperate gutter settings
    */
    OfficeExcel.GetHeight=function(obj){return obj.canvas.height;}
    OfficeExcel.GetWidth=function(obj){return obj.canvas.width;}

    /**
    * This function skirts the annoying canvas anti-aliasing
    *
    * @param object obj The object
    * @param number value The number to round
    */
    function AA (obj, value)
    {            
        var value = String(value).replace(/^(\d+)\.\d+/, '$1');
        var newvalue = Number(value) + 0.5;
        
        return (newvalue - value) >= 0 ? newvalue : Math.floor(value);
    }

	OfficeExcel.background.DrawArea = function (obj)
    {
        // Don't draw the axes?
        if (obj._otherProps._noaxes)
            return;

        obj.context.lineWidth   = 1;
        obj.context.lineCap = 'butt';
        obj.context.strokeStyle = obj._otherProps._axis_color;
        obj.context.beginPath();
        obj.context.fillStyle = obj._otherProps._background_image_color;

		obj.context.fillRect(0,0,obj.canvas.width,obj.canvas.height);
		
		// border
		if ( !g_bChartPreview && obj._otherProps._area_border ) {
			obj.context.beginPath();
			obj.context.rect(0, 0, obj.canvas.width,obj.canvas.height);
			obj.context.strokeStyle = "black";
		}
		
        obj.context.stroke();
    }