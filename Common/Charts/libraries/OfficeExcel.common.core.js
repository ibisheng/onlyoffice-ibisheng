    if (typeof(OfficeExcel) == 'undefined') OfficeExcel = {isOfficeExcel:true,type:'common'};

    OfficeExcel.Registry       = {};
    OfficeExcel.Registry.store = [];
    OfficeExcel.Registry.store['chart.event.handlers'] = [];
    OfficeExcel.background     = {};
    OfficeExcel.objects        = [];
    OfficeExcel.Resizing       = {};
    OfficeExcel.events         = [];
    

    HALFPI = (Math.PI / 2);
    PI     = Math.PI;
    TWOPI  = PI * 2;
        
    /**
    * Returns five values which are used as a nice scale
    * 
    * @param  max int    The maximum value of the graph
    * @param  obj object The graph object
    * @return     array   An appropriate scale
    */
    OfficeExcel.getScale = function (max, obj, minVal, maxVal,yminVal,ymaxVal)
    {
        /**
        * Special case for 0
        */
        /*if (max == 0 && obj != undefined && obj.type != 'scatter') {
            return ['0.2', '0.4', '0.6', '0.8', '1.0'];
        }*/

        var original_max = max;

        /**
        * Manually do decimals
        */
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
                    //min = Math.min.apply(null, arrNew);
                    //max = Math.max.apply(null, arrNew);
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
                            /*massRes = [10,20,30,40,50,60,70,80,90,100];
                            mainObj._otherProps._ymax = 100;
                            mainObj._otherProps._ymin = 0;*/
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
                /*}
                else if(min < 0 && max < 0)
                {
                    
                }*/
                
                
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
                        /*var arrTemp = []
                        var k = 0;
                        for (var j=0; j < mainObj.data.length; j++) {
                            for (var i=0; i<mainObj.data[j].length; i++)
                            {
                                if(typeof(mainObj.data[j][i]) == 'object')
                                {
                                    arrTemp[k] = mainObj.data[j][i][0];
                                    k++;
                                }
                            }
                        }
                        min = Math.min.apply(null, arrTemp);
                        max = Math.max.apply(null, arrTemp);*/
						min  = minVal;
						max  =  maxVal;
                        trueOX = true;
                    }
                    else
                    {
                        /*var arrTemp = [];
                        var k = 0;
                        for (var j=0; j < mainObj.data.length; j++) {
                            for (var i=0; i<mainObj.data[j].length; i++)
                            {
                                if(typeof(mainObj.data[j][i]) == 'object')
                                {
                                    arrTemp[k] = mainObj.data[j][i][1];
                                    k++;
                                }
                            }
                        }
                        min = Math.min.apply(null, arrTemp);
                        max = Math.max.apply(null, arrTemp);*/
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
                    //mainObj._otherProps._xaxispos = 'center';
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
                   
                    //greaterNull = (max - min)/8;
                }
                
                
                
                
                //приводим к первому порядку для дальнейших вычислений
                var secPart = max.toString().split('.');
                var numPow = 1;
                if(0 != secPart[0])
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
                    //if(axisXMin == 0)
                    //{
                         if(1 < greaterNull && arrForRealDiff[0] >= greaterNull)
                            greaterNull = 1;
                        else if(arrForRealDiff[0] < greaterNull && arrForRealDiff[1] >= greaterNull)
                            greaterNull = 2;
                        else if(arrForRealDiff[1] < greaterNull && arrForRealDiff[2] >= greaterNull)
                            greaterNull = 5;
                        else if(arrForRealDiff[2] < greaterNull && 10 >= greaterNull)
                            greaterNull = 10;
                   // }
                   
                    greaterNull = greaterNull*greaterNullNum;
                    //console.log(greaterNull)
                    stepOY = greaterNull;
                }
                
                arr[0] = 0;arr[1] = 1;arr[2] = 2;arr[3] = 5;arr[4] = 10;
                //если максимальное значение больше числа из данного массива, меняем диапазон по оси OY
                var arrMaxVal = [0,0.952380952,1.904761904,4.76190476,9.523809523]
                //массив диапазонов
                var arrDiffVal1 = [0,0.2,0.5,1,2]
                if(axisXMin == 0 && undefined == greaterNull)//если разница между min и max такая, что не нужно масштабировать
                {
                    for (var i=0; i<arr.length; i++) {
                        if( max >= arr[i] && max <= arr[i+1])
                        {
                            var max1 = arr[i+1];
                            var trueMax;
                            var diff = max1/10;
                            var trueDiff = diff;
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
                /*for (var k=0; k <= 11; k++) {
                    massRes[k] = varMin + (k)*(stepOY);
                    if(massRes[k] > axisXMax)
                    {
                        break;
                    }
                        
                }*/
                var lengthNum;
                if(!trueOX)
                {
                    
                    if(chackBelowNull)
                    {
                        //varMin = varMin - stepOY;
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
                        //if(massRes[0] == max)
                            
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
                        //varMin = varMin - stepOY;
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
                        //mainObj.max = -massRes[0];
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
                //this._otherProps._xmin = xScale[0] - (xScale[1]-xScale[0]);
                //this.xmin = this._otherProps._ymin;
                    }
                   
                    //mainObj._otherProps._ymax = massRes[massRes.length - 1];
                    //mainObj._otherProps._ymin = massRes[0];
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
                         /*if(typeof(mainObj.data[0]) == 'object')
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
                        }*/
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
                    //mainObj._otherProps._xaxispos = 'center';
                    stepOY = (max + Math.abs(min))/4;
                    axisXMax = max + 0.05 * (max - min);
                    axisXMin = min + 0.05 * (min - max);
                    greaterNull = (Math.abs(max) + Math.abs(min))/6;
                    arrForRealDiff = [1.51515151,3.03030303,7.57575757]
                    //greaterNull = (max - min)/8;
                }
                
                
                
                
                //приведение к первому порядку для дальнейших вычислений
                var secPart = max.toString().split('.');
                var numPow = 1;
                if(0 != secPart[0])
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
                    for (var i=0; i<arr.length; i++) {
                        if( max >= arr[i] && max <= arr[i+1])
                        {
                            var max1 = arr[i+1];
                            var trueMax;
                            var diff = max1/10;
                            var trueDiff = diff;
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
                return obj._otherProps._scale_round ? [0.2,0.4,0.6,0.8,1] : [0.1,0.2,0.3,0.4,0.5];

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
        
        /**
        * Added 02/11/2010 to create "nicer" scales
        */
        if (obj && typeof(obj._otherProps._scale_round) == 'boolean' && obj._otherProps._scale_round) {
            topValue = 10 * interval;
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
			/*else if(Math.abs(arr) < minDig && Math.abs(arr) > 0)
			{
				var tmp = Math.abs(arr);
				var exp = 0;
				while (tmp < 9) {
					exp += 1;
					tmp *= 10;
				}
				if(arr < 0)
					tmp *= -1; 
				arr = tmp + "E-" + exp;
			}*/
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
					if(arr[i] < 0)
						tmp *= -1; 
					arr[i] = tmp + "E+" + exp;
				}
				/*else if(Math.abs(arr[i]) < minDig && Math.abs(arr[i]) > 0)
				{
					var tmp = Math.abs(arr[i]);
					var exp = 0;
					while (tmp < 9) {
						exp += 1;
						tmp *= 10;
					}
					if(arr[i] < 0)
						tmp *= -1; 
					arr[i] = tmp + "E-" + exp;
				}*/
			}
		}
		return arr;
	}
	
	OfficeExcel.num_round = function (num)
	{
		/*var partNum = num.toString().split('.');
		var len;
		
		
		if(partNum == undefined ||  num.toString().split('e-')[1] != undefined)
		{
			partNum = num.toString().split('e-');
			len = partNum[1] + 1;
		}
			
		if(partNum[1] != undefined && partNum[1])
		{
			if(!len)
				len = partNum[1].length;
			if(len)
			{
				var floatKoff = Math.pow(10, (len - 1))
				if(floatKoff > 1)
					num =  Math.round(num*floatKoff)/floatKoff ;
			}		
		}*/
		var floatKoff = 100000000000;
		num =  Math.round(num*floatKoff)/floatKoff ;
		return num;
	}
	
    /**
    * Returns the maximum value which is in an array
    * 
    * @param  array arr The array
    * @param  int   len The length to pad the array to
    * @param  mixed     The value to use to pad the array (optional)
    */
    OfficeExcel.array_pad = function (arr, len)
    {
        if (arr.length < len) {
            var val = arguments[2] ? arguments[2] : null;
            
            for (var i=arr.length; i<len; ++i) {
                arr[i] = val;
            }
        }
        
        return arr;
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

        for(i=0,sum=0;i<len;sum+=arr[i++]);
        return sum;
    }



    /**
    * A simple is_array() function
    * 
    * @param  mixed obj The object you want to check
    * @return bool      Whether the object is an array or not
    */
    OfficeExcel.is_array = function (obj)
    {
        return obj != null && obj.constructor.toString().indexOf('Array') != -1;
    }


    /**
    * Converts degrees to radians
    * 
    * @param  int degrees The number of degrees
    * @return float       The number of radians
    */
    OfficeExcel.degrees2Radians = function (degrees)
    {
        return degrees * (Math.PI / 180);
    }


    /**
    * This function draws an angled line. The angle is cosidered to be clockwise
    * 
    * @param obj ctxt   The context object
    * @param int x      The X position
    * @param int y      The Y position
    * @param int angle  The angle in RADIANS
    * @param int length The length of the line
    */
    OfficeExcel.lineByAngle = function (context, x, y, angle, length)
    {
        context.arc(x, y, length, angle, angle, false);
        context.lineTo(x, y);
        context.arc(x, y, length, angle, angle, false);
    }


    /**
    * This is a useful function which is basically a shortcut for drawing left, right, top and bottom alligned text.
    * 
    * @param object context The context
    * @param string font    The font
    * @param int    size    The size of the text
    * @param int    x       The X coordinate
    * @param int    y       The Y coordinate
    * @param string text    The text to draw
    * @parm  string         The vertical alignment. Can be null. "center" gives center aligned  text, "top" gives top aligned text.
    *                       Anything else produces bottom aligned text. Default is bottom.
    * @param  string        The horizontal alignment. Can be null. "center" gives center aligned  text, "right" gives right aligned text.
    *                       Anything else produces left aligned text. Default is left.
    * @param  bool          Whether to show a bounding box around the text. Defaults not to
    * @param int            The angle that the text should be rotate at (IN DEGREES)
    * @param string         Background color for the text
    * @param bool           Whether the text is bold or not
    * @param bool           Whether the bounding box has a placement indicator
    */
	
	OfficeExcel.getFmgrGraphics = function()
	{
		if(!this.fmgrGraphics)
		{
			if(!OfficeExcel.fontManager)
				OfficeExcel.fontManager = new CFontManager();
			
			this.fmgrGraphics = [];	
			this.fmgrGraphics.push(OfficeExcel.fontManager);	
			this.fmgrGraphics.push(OfficeExcel.fontManager);
			
			this.fmgrGraphics[0].Initialize(true); 
			this.fmgrGraphics[1].Initialize(true);
		}
	}
	
	OfficeExcel.getDrwContext = function(canvas)
	{
		if(!this.fmgrGraphics && Asc.DrawingContext)
		{
			this.getFmgrGraphics();
			this.drwContext =  Asc.DrawingContext({canvas: canvas, units: 1/*pt*/, fmgrGraphics: this.fmgrGraphics});
		}
		else if(!this.drwContext && Asc.DrawingContext)
			this.drwContext =  Asc.DrawingContext({canvas: canvas, units: 1/*pt*/, fmgrGraphics: this.fmgrGraphics});
		else if(Asc.DrawingContext)//здесь должна быть передача canvas(setCanvas) 
			this.drwContext =  Asc.DrawingContext({canvas: canvas, units: 1/*pt*/, fmgrGraphics: this.fmgrGraphics});
		else
			return false;
		return this.drwContext;
	}
	
	OfficeExcel.Text = function (context, font, size, x, y, text)
    {		
		var drwContext = OfficeExcel.getDrwContext(bar.canvas);
		if(drwContext)
		{
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
			context.save();

			context.canvas.__OfficeExcel_originalx__ = x;
			context.canvas.__OfficeExcel_originaly__ = y;
			context.translate(x, y);
			var italic = arguments[13] && arguments[13].italic ? arguments[13].italic : false;
			var underline = arguments[13] && arguments[13].underline ? arguments[13].underline : false;
			
			var ascFont = new Asc.FontProperties(font, size, arguments[11], italic, underline);
			context.setFont(ascFont);
		 
			var width;
			var textSize;
			if(typeof text != 'string')
				text = text.toString();
			if(text != "")
				textSize  = context.measureText(text,1);
			

			// Vertical alignment - defaults to bottom
			if (arguments[6]) {
				var vAlign = arguments[6];
				if(textSize)
					size1 = textSize.height/0.75;
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
				width = textSize.width/0.75;
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
				context.setFillStyle("#000000");

			// Rotate the canvas if need be
			if (arguments[9] && textSize) {
				var textOptions = 
				{
					font: ascFont,
					width: textSize.width,
					height: textSize.height,
					x: x*0.75,
					y: y*0.75,
				};
				OfficeExcel.drawTurnedText(context,textOptions, text, 90);
			}
			
			if(!arguments[9])
			{
				 context.fillText(text, x*0.75, y*0.75, undefined, [6.36474609375]);
				 context.lineWidth = 1;
			}	
			 context.restore();
		}
		else
		{
				 /**
			* This calls the text function recursively to accommodate multi-line text
			*/
			
			if (typeof(text) == 'string' && text.match(/\r\n/)) {
				
				var arr = text.split('\r\n');

				text = arr[0];
				arr = OfficeExcel.array_shift(arr);

				var nextline = arr.join('\r\n')

				OfficeExcel.Text(context, font, size, arguments[9] == -90 ? (x + (size * 1.5)) : x, y + (size * 1.5), nextline, arguments[6] ? arguments[6] : null, 'center', arguments[8], arguments[9], arguments[10], arguments[11], arguments[12]);
			}
		
			// Accommodate MSIE
			if (OfficeExcel.isOld()) {
				y += 2;
			}


			context.font = (arguments[11] ? 'Bold ': '') + size + 'pt ' + font;

			var i;
			var origX = x;
			var origY = y;
			var originalFillStyle = context.fillStyle;
			var originalLineWidth = context.lineWidth;

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
			context.save();

				context.canvas.__OfficeExcel_originalx__ = x;
				context.canvas.__OfficeExcel_originaly__ = y;

				context.translate(x, y);
				x = 0;
				y = 0;
				
				// Rotate the canvas if need be
				if (arguments[9]) {
					context.rotate(arguments[9] / 57.3);
				}

				// Vertical alignment - defaults to bottom
				if (arguments[6]) {
					var vAlign = arguments[6];

					if (vAlign == 'center') {
						context.translate(0, size / 2);
					} else if (vAlign == 'top') {
						context.translate(0, size);
					}
				}


				// Hoeizontal alignment - defaults to left
				if (arguments[7]) {
					var hAlign = arguments[7];
					var width  = context.measureText(text).width;
		
					if (hAlign) {
						if (hAlign == 'center') {
							context.translate(-1 * (width / 2), 0)
						} else if (hAlign == 'right') {
							context.translate(-1 * width, 0)
						}
					}
				}
				
				
				context.fillStyle = originalFillStyle;

				/**
				* Draw a bounding box if requested
				*/
				context.save();
					 context.fillText(text,0,0);
					 context.lineWidth = 1;
					
					if (arguments[8]) {

						var width = context.measureText(text).width;
						var ieOffset = OfficeExcel.isIE8() ? 2 : 0;

						context.translate(x, y);
						context.strokeRect(AA(context.canvas.__object__, - 3), AA(context.canvas.__object__, 0 - 3 - size - ieOffset), width + 6, 0 + size + 6);


						/**
						* If requested, draw a background for the text
						*/
						if (arguments[10]) {
			
							var offset = 3;
							var ieOffset = OfficeExcel.isIE8() ? 2 : 0;
							var width = context.measureText(text).width

							//context.strokeStyle = 'gray';
							context.fillStyle = arguments[10];
							context.fillRect(AA(context.canvas.__object__, x - offset),
											 AA(context.canvas.__object__, y - size - offset - ieOffset),
											 width + (2 * offset),
											 size + (2 * offset));
							//context.strokeRect(x - offset, y - size - offset - ieOffset, width + (2 * offset), size + (2 * offset));
						}
						
						/**
						* Do the actual drawing of the text
						*/
						context.fillStyle = originalFillStyle;
						context.fillText(text,0,0);

						if (arguments[12]) {
							context.fillRect(
								arguments[7] == 'left' ? 0 : (arguments[7] == 'center' ? width / 2 : width ) - 2,
								arguments[6] == 'bottom' ? 0 : (arguments[6] == 'center' ? (0 - size) / 2 : 0 - size) - 2,
								4,
								4
							);
						}
					}
				context.restore();
				
				// Reset the lineWidth
				context.lineWidth = originalLineWidth;

			context.restore();
		}
    }
	
	OfficeExcel.drawTurnedText = function(drawingCtx,textOptions, text, angle)
	{
		var cx = textOptions.x; // center offset x
		var cy = textOptions.y; // center offset y
		var textWidth = textOptions.width;  // NOTE: measure text (width * 0.5)
		var textHeight = textOptions.height; // NOTE: measure text (height * 0.5)
		var font = textOptions.font;
		var size = textOptions.size;
		var asc = Asc; 
		
		if(!angle)
			angle = 90;

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
	   
					
    OfficeExcel.TextWithoutFonts = function (context, font, size, x, y, text)
    {
        /**
        * This calls the text function recursively to accommodate multi-line text
        */
		
        if (typeof(text) == 'string' && text.match(/\r\n/)) {
            
            var arr = text.split('\r\n');

            text = arr[0];
            arr = OfficeExcel.array_shift(arr);

            var nextline = arr.join('\r\n')

            OfficeExcel.Text(context, font, size, arguments[9] == -90 ? (x + (size * 1.5)) : x, y + (size * 1.5), nextline, arguments[6] ? arguments[6] : null, 'center', arguments[8], arguments[9], arguments[10], arguments[11], arguments[12]);
        }
	
        // Accommodate MSIE
        if (OfficeExcel.isOld()) {
            y += 2;
        }


        context.font = (arguments[11] ? 'Bold ': '') + size + 'pt ' + font;

        var i;
        var origX = x;
        var origY = y;
        var originalFillStyle = context.fillStyle;
        var originalLineWidth = context.lineWidth;

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
        context.save();

            context.canvas.__OfficeExcel_originalx__ = x;
            context.canvas.__OfficeExcel_originaly__ = y;

            context.translate(x, y);
            x = 0;
            y = 0;
            
            // Rotate the canvas if need be
            if (arguments[9]) {
                context.rotate(arguments[9] / 57.3);
            }

            // Vertical alignment - defaults to bottom
            if (arguments[6]) {
                var vAlign = arguments[6];

                if (vAlign == 'center') {
                    context.translate(0, size / 2);
                } else if (vAlign == 'top') {
                    context.translate(0, size);
                }
            }


            // Hoeizontal alignment - defaults to left
            if (arguments[7]) {
                var hAlign = arguments[7];
                var width  = context.measureText(text).width;
    
                if (hAlign) {
                    if (hAlign == 'center') {
                        context.translate(-1 * (width / 2), 0)
                    } else if (hAlign == 'right') {
                        context.translate(-1 * width, 0)
                    }
                }
            }
            
            
            context.fillStyle = originalFillStyle;

            /**
            * Draw a bounding box if requested
            */
            context.save();
                 context.fillText(text,0,0);
                 context.lineWidth = 1;
                
                if (arguments[8]) {

                    var width = context.measureText(text).width;
                    var ieOffset = OfficeExcel.isIE8() ? 2 : 0;

                    context.translate(x, y);
                    context.strokeRect(AA(context.canvas.__object__, - 3), AA(context.canvas.__object__, 0 - 3 - size - ieOffset), width + 6, 0 + size + 6);


                    /**
                    * If requested, draw a background for the text
                    */
                    if (arguments[10]) {
        
                        var offset = 3;
                        var ieOffset = OfficeExcel.isIE8() ? 2 : 0;
                        var width = context.measureText(text).width

                        //context.strokeStyle = 'gray';
                        context.fillStyle = arguments[10];
                        context.fillRect(AA(context.canvas.__object__, x - offset),
                                         AA(context.canvas.__object__, y - size - offset - ieOffset),
                                         width + (2 * offset),
                                         size + (2 * offset));
                        //context.strokeRect(x - offset, y - size - offset - ieOffset, width + (2 * offset), size + (2 * offset));
                    }
                    
                    /**
                    * Do the actual drawing of the text
                    */
                    context.fillStyle = originalFillStyle;
                    context.fillText(text,0,0);

                    if (arguments[12]) {
                        context.fillRect(
                            arguments[7] == 'left' ? 0 : (arguments[7] == 'center' ? width / 2 : width ) - 2,
                            arguments[6] == 'bottom' ? 0 : (arguments[6] == 'center' ? (0 - size) / 2 : 0 - size) - 2,
                            4,
                            4
                        );
                    }
                }
            context.restore();
            
            // Reset the lineWidth
            context.lineWidth = originalLineWidth;

        context.restore();
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

        if (OfficeExcel.ClearAnnotations)
            OfficeExcel.ClearAnnotations(canvas.id);

        OfficeExcel.FireCustomEvent(canvas.__object__, 'onclear');
    }


    /**
    * Draws the title of the graph
    * 
    * @param object  canvas The canvas object
    * @param string  text   The title to write
    * @param integer gutter The size of the gutter
    * @param integer        The center X point (optional - if not given it will be generated from the canvas width)
    * @param integer        Size of the text. If not given it will be 14
    */
    OfficeExcel.DrawTitle = function (canvas, text, gutterTop)
    {
        var obj          = canvas.__object__;
        var context      = canvas.getContext('2d');
        var gutterLeft   = obj._chartGutter._left;
        var gutterRight  = obj._chartGutter._right;
        var gutterBottom = obj._chartGutter._bottom;
        var size         = arguments[4] ? arguments[4] : 12;
        var bold         = obj._chartTitle._bold;
        var centerx      = (arguments[3] ? arguments[3] : ((obj.canvas.width - gutterLeft - gutterRight) / 2) + gutterLeft);
        var keypos       = obj._otherProps._key_position;
        var vpos         = obj._chartTitle._vpos;
        var hpos         = obj._chartTitle._hpos;
        var bgcolor      = obj._chartTitle._background;
		var textOptions =
		{
			color: obj._chartTitle._color,
			underline: obj._chartTitle._underline,
			italic: obj._chartTitle._italic
		}		
		

        // Account for 3D effect by faking the key position
        if (obj.type == 'bar' && obj._otherProps._variant == '3d') {
            keypos = 'gutter';
        }

        context.beginPath();
        context.fillStyle = obj._otherProps._text_color ? obj._otherProps._text_color : 'black';

        /**
        * Vertically center the text if the key is not present
        */
        if (keypos && keypos != 'gutter') {
            var vCenter = 'center';

        } else if (!keypos) {
            var vCenter = 'center';

        } else {
            var vCenter = 'bottom';
        }

        // if chart title vPos does not equal 0.5, use that
        if (typeof(vpos) == 'number') {
            if (obj._otherProps._xaxispos == 'top')
                vpos = vpos * gutterBottom + gutterTop + (obj.canvas.height - gutterTop - gutterBottom);
            else
                vpos = vpos * gutterTop;
        } else {
            vpos = gutterTop - size - 5;

            if (obj._otherProps._xaxispos == 'top') {
                vpos = obj.canvas.height  - gutterBottom + size + 5;
            }
        }

        // if chart title hPos is a number, use that. It's multiplied with the (entire) canvas width
        if (typeof(hpos) == 'number') {
            centerx = hpos * canvas.width;
        }
        
        // Set the colour
        if (typeof(obj._chartTitle._color != null)) {
            var oldColor = context.fillStyle
            var newColor = obj._chartTitle._color;
            context.fillStyle = newColor ? newColor : 'black';
        }
        
        /**
        * Default font is Verdana
        */
        var font = obj._otherProps._text_font;

        // Get chat title font
        if (typeof(obj._chartTitle._font) == 'string')
            font = obj._chartTitle._font;

        /**
        * Draw the title itself
        */
        if('auto' == obj._otherProps._ylabels_count)
        {
            vpos = obj._chartTitle._vpos;
            vCenter = 'bottom';
        }
        OfficeExcel.Text(context, font, size, centerx, vpos, text, vCenter, 'center', bgcolor != null, null, bgcolor, bold, null, textOptions);
        
        // Reset the fill colour
        context.fillStyle = oldColor;
    }


    /**
    * This function returns the mouse position in relation to the canvas
    * 
    * @param object e The event object.
    */
    OfficeExcel.getMouseXY = function (e)
    {
        var obj = (OfficeExcel.isIE8() ? event.srcElement : e.target);
        var x;
        var y;
        
        if (OfficeExcel.isIE8()) e = event;

        // Browser with offsetX and offsetY
        if (typeof(e.offsetX) == 'number' && typeof(e.offsetY) == 'number') {
            x = e.offsetX;
            y = e.offsetY;

        // FF and other
        } else {
            x = 0;
            y = 0;

            while (obj != document.body && obj) {
                x += obj.offsetLeft;
                y += obj.offsetTop;

                obj = obj.offsetParent;
            }

            x = e.pageX - x;
            y = e.pageY - y;
        }

        return [x, y];
    }
    
    
    /**
    * This function returns a two element array of the canvas x/y position in
    * relation to the page
    * 
    * @param object canvas
    */
    OfficeExcel.getCanvasXY = function (canvas)
    {
        var x   = 0;
        var y   = 0;
        var obj = canvas;

        do {

            x += obj.offsetLeft;
            y += obj.offsetTop;

            obj = obj.offsetParent;

        } while (obj && obj.tagName.toLowerCase() != 'body');

        return [x, y];
    }


    /**
    * Registers a graph object (used when the canvas is redrawn)
    * 
    * @param object obj The object to be registered
    */
    OfficeExcel.Register = function (obj)
    {
        var key = obj.id + '_' + obj.type;

        OfficeExcel.objects[key] = obj;
    }


    /**
    * Causes all registered objects to be redrawn
    * 
    * @param string   An optional string indicating which canvas is not to be redrawn
    * @param string An optional color to use to clear the canvas
    */
    OfficeExcel.Redraw = function ()
    {
        for (i in OfficeExcel.objects) {
            // TODO FIXME Maybe include more intense checking for whether the object is an OfficeExcel object, eg obj.isOfficeExcel == true ...?
            if (
                   typeof(i) == 'string'
                && typeof(OfficeExcel.objects[i]) == 'object'
                && typeof(OfficeExcel.objects[i].type) == 'string'
                && OfficeExcel.objects[i].isOfficeExcel)  {

                if (!arguments[0] || arguments[0] != OfficeExcel.objects[i].id) {
                    OfficeExcel.Clear(OfficeExcel.objects[i].canvas, arguments[1] ? arguments[1] : null);
                    OfficeExcel.objects[i].Draw();
                }
            }
        }
    }


    /**
    * Loosly mimicks the PHP function print_r();
    */
    OfficeExcel.pr = function (obj)
    {
        var str = '';
        var indent = (arguments[2] ? arguments[2] : '');

        switch (typeof(obj)) {
            case 'number':
                if (indent == '') {
                    str+= 'Number: '
                }
                str += String(obj);
                break;
            
            case 'string':
                if (indent == '') {
                    str+= 'String (' + obj.length + '):'
                }
                str += '"' + String(obj) + '"';
                break;

            case 'object':
                // In case of null
                if (obj == null) {
                    str += 'null';
                    break;
                }

                str += 'Object\n' + indent + '(\n';
                for (var i in obj) {
                    if (typeof(i) == 'string' || typeof(i) == 'number') {
                        str += indent + ' ' + i + ' => ' + OfficeExcel.pr(obj[i], true, indent + '    ') + '\n';
                    }
                }
                
                var str = str + indent + ')';
                break;
            
            case 'function':
                str += obj;
                break;
            
            case 'boolean':
                str += 'Boolean: ' + (obj ? 'true' : 'false');
                break;
        }

        /**
        * Finished, now either return if we're in a recursed call, or alert()
        * if we're not.
        */
        if (arguments[1]) {
            return str;
        } else {
            alert(str);
        }
    }


    /**
    * The OfficeExcel registry Set() function
    * 
    * @param  string name  The name of the key
    * @param  mixed  value The value to set
    * @return mixed        Returns the same value as you pass it
    */
    OfficeExcel.Registry.Set = function (name, value)
    {
        // Store the setting
        OfficeExcel.Registry.store[name] = value;
        
        // Don't really need to do this, but ho-hum
        return value;
    }


    /**
    * The OfficeExcel registry Get() function
    * 
    * @param  string name The name of the particular setting to fetch
    * @return mixed       The value if exists, null otherwise
    */
    OfficeExcel.Registry.Get = function (name)
    {
        //return OfficeExcel.Registry.store[name] == null ? null : OfficeExcel.Registry.store[name];
        return OfficeExcel.Registry.store[name];
    }


    /**
    * This function draws the background for the bar chart, line chart and scatter chart.
    * 
    * @param  object obj The graph object
    */
    OfficeExcel.background.Draw = function (obj)
    {
        var canvas       = obj.canvas;
        var context      = obj.context;
        var height       = 0;
        var gutterLeft   = obj._chartGutter._left;
        var gutterRight  = obj._chartGutter._right;
        var gutterTop    = obj._chartGutter._top;
        var gutterBottom = obj._chartGutter._bottom;
        var variant      = obj._otherProps._variant;
        
        context.fillStyle = obj._otherProps._text_color;
        
        // If it's a bar and 3D variant, translate
        if (variant == '3d') {
            context.save();
            context.translate(10, -5);
        }

        // X axis title
        if (typeof(obj._xAxisTitle._text) == 'string' && obj._xAxisTitle._text.length) {
        
            var size = obj._otherProps._text_size + 2;
            var font = obj._otherProps._text_font;
            var bold = obj._xAxisTitle._bold;
			var textOptions =
			{
				color: obj._xAxisTitle._color,
				underline: obj._xAxisTitle._underline,
				italic: obj._xAxisTitle._italic
			}			
			
            if (typeof(obj._xAxisTitle._size) == 'number')
                size = obj._xAxisTitle._size;

            if (typeof(obj._xAxisTitle._font) == 'string')
                font = obj._xAxisTitle._font;
            
            var hpos = ((obj.canvas.width - obj._chartGutter._left - obj._chartGutter._right) / 2) + obj._chartGutter._left;
            var vpos = obj.canvas.height - obj._chartGutter._bottom + 25;
            
            if (typeof(obj._xAxisTitle._vpos) == 'number') {
                vpos = obj.canvas.height - (gutterBottom * obj._xAxisTitle._vpos);
            }
            if (obj._xAxisTitle._vpos != 'null')
                vpos = obj._xAxisTitle._vpos
            if (obj._xAxisTitle._hpos != 'null')
                hpos = obj._xAxisTitle._hpos
            context.beginPath();
            OfficeExcel.Text(context,
                        font,
                        size,
                        hpos,
                        vpos,
                        obj._xAxisTitle._text,
                        'center',
                        'center',
                        false,
                        false,
                        false,
                        bold,
						null,
						textOptions);
            context.fill();
        }

        // Y axis title
        if (typeof(obj._yAxisTitle._text) == 'string' && obj._yAxisTitle._text.length) {

            var size            = obj._otherProps._text_size + 2;
            var font            = obj._otherProps._text_font;
            var angle           = 270;
            var bold = obj._yAxisTitle._bold;
			var textOptions =
			{
				color: obj._yAxisTitle._color,
				underline: obj._yAxisTitle._underline,
				italic: obj._yAxisTitle._italic
			}			
			
            var hpos;
            var vpos = ((obj.canvas.height - obj._chartGutter._top - obj._chartGutter._bottom) / 2) + obj._chartGutter._top;

            if (typeof(obj._yAxisTitle._hpos) == 'number') {
                hpos = obj._yAxisTitle._hpos * obj._chartGutter._left;
            } else {
                hpos = ((obj._chartGutter._left - 25) / obj._chartGutter._left) * obj._chartGutter._left;
            }

            if (typeof(obj._yAxisTitle._size) == 'number')
                size = obj._yAxisTitle._size;

            if (typeof(obj._yAxisTitle._font) == 'string')
                font = obj._yAxisTitle._font;

            if (obj._otherProps._title_yaxis_align == 'right' || obj._otherProps._title_yaxis_position == 'right') {
                angle = 90;
                hpos = obj._yAxisTitle._hpos ? obj._yAxisTitle._hpos * obj._chartGutter._right :
                                                                     obj.canvas.width - obj._chartGutter._right + obj._otherProps._text_size + 5;
            } else
                hpos = hpos;
            if(obj._yAxisTitle._angle != 'null' && obj._yAxisTitle._angle != undefined)
                angle = obj._yAxisTitle._angle;
            if (obj._yAxisTitle._vpos != 'null')
                vpos = obj._yAxisTitle._vpos;
            if (obj._yAxisTitle._hpos != 'null')
                hpos = obj._yAxisTitle._hpos;

            context.beginPath();
            OfficeExcel.Text(context,
                font,
                size,
                hpos,
                vpos,
                obj._yAxisTitle._text,
                'center',
                'right',//change with center
                false,
                angle,
                false,
                bold,
				null,
				textOptions);
            context.fill();
        }

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

                /**
                * Align the grid to the tickmarks
                */
                if (obj._otherProps._background_grid_autofit_align) {
                    // Align the horizontal lines
                    obj._otherProps._background_grid_autofit_numhlines = obj._otherProps._ylabels_count;

                    // Align the vertical lines for the line
                    if (obj.type == 'line') {
                        if (obj._otherProps._labels && obj._otherProps._labels.length) {
                            obj._otherProps._background_grid_autofit_numvlines = obj._otherProps._labels.length - 1;
                        } else {
                            obj._otherProps._background_grid_autofit_numvlines = obj.data[0].length - 1;
                        }

                    // Align the vertical lines for the bar
                    } else if (obj.type == 'bar' && obj._otherProps._labels && obj._otherProps._labels.length) {
                        obj._otherProps._background_grid_autofit_numvlines = obj._otherProps._labels.length;
                    }
                }

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
                height = (OfficeExcel.GetHeight(obj) - gutterBottom - gutterTop)
                //for (y = gutterTop; y <= (height + gutterTop); y+=obj._otherProps._background_grid_hsize) {
                    /*for (n = y; n < y + obj._otherProps._background_grid_hsize; n+=(obj._otherProps._background_grid_hsize/5)) {
                        context.moveTo(gutterLeft, AA(this, n));
                        context.lineTo(OfficeExcel.GetWidth(obj) - gutterRight, AA(this,n));
                    }*/
                height = (OfficeExcel.GetHeight(obj) - gutterBottom - gutterTop)
                for (y = gutterTop; y <= height + gutterTop + 1; y+=obj._otherProps._background_grid_hsize) {
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
           // }
            /*if (obj._otherProps._background_grid_hlines) {
                height = (OfficeExcel.GetHeight(obj) - gutterBottom)
                for (y=gutterTop; y<height; y+=obj._otherProps._background_grid_hsize) {
                    context.moveTo(gutterLeft, AA(this, y));
                    context.lineTo(OfficeExcel.GetWidth(obj) - gutterRight, AA(this, y));
                }
            }*/
        }
            
            
            if (obj._otherProps._background_grid_vlines) {
                // Draw the vertical lines
                var width = (obj.canvas.width - gutterRight - gutterLeft)
                for (x=gutterLeft; x<=width + gutterLeft + 1; x+=obj._otherProps._background_grid_vsize) {
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

            /*if (obj._otherProps._background_grid_border && obj._otherProps._background_grid_vlines) {
                // Make sure a rectangle, the same colour as the grid goes around the graph
                context.strokeStyle = obj._otherProps._background_grid_color;
                context.strokeRect(AA(this, gutterLeft), AA(this, gutterTop), OfficeExcel.GetWidth(obj) - gutterLeft - gutterRight, OfficeExcel.GetHeight(obj) - gutterTop - gutterBottom);
            }*/

        context.stroke();

        // If it's a bar and 3D variant, translate
        if (variant == '3d') {
            context.restore();
        }

        // Draw the title if one is set
        if ( typeof(obj._chartTitle._text) == 'string') {

            if (obj.type == 'gantt') {
                gutterTop -= 10;
            }

            OfficeExcel.DrawTitle(canvas,
                obj._chartTitle._text,
                gutterTop,
                null,
                obj._chartTitle._size ? obj._chartTitle._size : obj._otherProps._text_size + 2);
        }

        context.stroke();
        
        if(obj._otherProps._background_grid_hlines_interim)
        {
            var n = 0;
            context.strokeStyle = obj._otherProps._background_grid_hlines_interim_color;
            for (y = gutterTop; y < (height + gutterTop); y+=(obj._otherProps._background_grid_hsize/5)) {
            
                if(n%5 != 0 && n != 0)
                {
                    context.moveTo(gutterLeft, AA(this, y));
                    context.lineTo(OfficeExcel.GetWidth(obj) - gutterRight, AA(this, y));
                    context.stroke();
                }
                n++;
            }
            context.stroke();
        }
        
  
         if(obj._otherProps._background_grid_vlines_interim)
        {
            var n = 0;
            context.strokeStyle = obj._otherProps._background_grid_vlines_interim_color;
            var width = (obj.canvas.width - gutterRight)
            for (x=gutterLeft; x < width + gutterLeft; x+=obj._otherProps._background_grid_vsize/2) {
                if(n%2 != 0 && n != 0)
                {
                    context.moveTo(AA(this, x), gutterTop);
                    context.lineTo(AA(this, x), obj.canvas.height - gutterBottom);
                }
                n++;
            }
            context.stroke();
        }
        }
    }


    /**
    * Returns the day number for a particular date. Eg 1st February would be 32
    * 
    * @param   object obj A date object
    * @return  int        The day number of the given date
    */
    OfficeExcel.GetDays = function (obj)
    {
        var year  = obj.getFullYear();
        var days  = obj.getDate();
        var month = obj.getMonth();
        
        if (month == 0) return days;
        if (month >= 1) days += 31; 
        if (month >= 2) days += 28;

            // Leap years. Crude, but if this code is still being used
            // when it stops working, then you have my permission to shoot
            // me. Oh, you won't be able to - I'll be dead...
            if (year >= 2008 && year % 4 == 0) days += 1;

        if (month >= 3) days += 31;
        if (month >= 4) days += 30;
        if (month >= 5) days += 31;
        if (month >= 6) days += 30;
        if (month >= 7) days += 31;
        if (month >= 8) days += 31;
        if (month >= 9) days += 30;
        if (month >= 10) days += 31;
        if (month >= 11) days += 30;
        
        return days;
    }

    /**
    * Debug short name functions
    */
    function pd(variable) {OfficeExcel.pr(variable);}
    function p(variable) {OfficeExcel.pr(variable);}
    function a(variable) {alert(variable);}
    
    /**
    * A shortcut for console.log - as used by Firebug and Chromes console
    */
    function cl (variable)
    {
        return console.log(variable);
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
	
    /**
    * Formats a number with thousand seperators so it's easier to read
    * 
    * @param  integer num The number to format
    * @param  string      The (optional) string to prepend to the string
    * @param  string      The (optional) string to ap
    * pend to the string
    * @return string      The formatted number
    */
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

if (typeof(obj._otherProps._scale_formatter) == 'function') {
    return obj._otherProps._scale_formatter(obj, num);
}

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
        for (i=(num.length - 1),j=0; i>=0; j++,i--) {
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
        for (i=(rev.length - 1); i>=0; i--) {
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
        
        for (i=0; i<hbars.length; ++i) {
            
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

            // If the X axis is at the bottom, and a negative max is given, warn the user
            if (obj._otherProps._xaxispos == 'bottom' && (hbars[i][0] < 0 || (hbars[i][1] + hbars[i][1] < 0)) ) {
                alert('[' + obj.type.toUpperCase() + ' (ID: ' + obj.id + ') BACKGROUND HBARS] You have a negative value in one of your background hbars values, whilst the X axis is in the center');
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


    /**
    * Draws in-graph labels.
    * 
    * @param object obj The graph object
    */
    OfficeExcel.DrawInGraphLabels = function (obj)
    {
        var canvas  = obj.canvas;
        var context = obj.context;
        var labels  = obj._otherProps._labels_ingraph;
        var labels_processed = [];

        // Defaults
        var fgcolor   = 'black';
        var bgcolor   = 'white';
        var direction = 1;
		var bold = bar._otherProps._labels_above_bold;
		var textOptions = 
		{
			color: bar._otherProps._labels_above_color,
			italic: bar._otherProps._labels_above_italic,
			underline: bar._otherProps._labels_above_underline
		}

        if (!labels) {
            return;
        }

        /**
        * Preprocess the labels array. Numbers are expanded
        */
        for (var i=0; i<labels.length; ++i) {
            if (typeof(labels[i]) == 'number') {
                for (var j=0; j<labels[i]; ++j) {
                    labels_processed.push(null);
                }
            } else if (typeof(labels[i]) == 'string' || typeof(labels[i]) == 'object') {
                labels_processed.push(labels[i]);
            
            } else {
                labels_processed.push('');
            }
        }

        /**
        * Turn off any shadow
        */
        OfficeExcel.NoShadow(obj);

        if (labels_processed && labels_processed.length > 0) {

            for (var i=0; i<labels_processed.length; ++i) {
                if (labels_processed[i]) {
                    var coords = obj.coords[i];
                    
                    if (coords && coords.length > 0) {
                        var x      = (obj.type == 'bar' ? coords[0] + (coords[2] / 2) : coords[0]);
                        var y      = (obj.type == 'bar' ? coords[1] + (coords[3] / 2) : coords[1]);
                        var length = typeof(labels_processed[i][4]) == 'number' ? labels_processed[i][4] : 25;

    
                        context.beginPath();
                        context.fillStyle   = 'black';
                        context.strokeStyle = 'black';
                        
    
                        if (obj.type == 'bar') {
                        
                            /**
                            * X axis at the top
                            */
                            if (obj._otherProps._xaxispos == 'top') {
                                length *= -1;
                            }
    
                            if (obj._otherProps._variant == 'dot') {
                                context.moveTo(x, obj.coords[i][1] - 5);
                                context.lineTo(x, obj.coords[i][1] - 5 - length);
                                
                                var text_x = x;
                                var text_y = obj.coords[i][1] - 5 - length;
                            
                            } else if (obj._otherProps._variant == 'arrow') {
                                context.moveTo(x, obj.coords[i][1] - 5);
                                context.lineTo(x, obj.coords[i][1] - 5 - length);
                                
                                var text_x = x;
                                var text_y = obj.coords[i][1] - 5 - length;
                            
                            } else {
    
                                context.arc(x, y, 2.5, 0, 6.28, 0);
                                context.moveTo(x, y);
                                context.lineTo(x, y - length);

                                var text_x = x;
                                var text_y = y - length;
                            }

                            context.stroke();
                            context.fill();
                            
    
                        } else if (obj.type == 'line') {
                        
                            if (
                                typeof(labels_processed[i]) == 'object' &&
                                typeof(labels_processed[i][3]) == 'number' &&
                                labels_processed[i][3] == -1
                               ) {

                                context.moveTo(x, y + 5);
                                context.lineTo(x, y + 5 + length);
                                
                                context.stroke();
                                context.beginPath();                                
                                
                                // This draws the arrow
                                context.moveTo(x, y + 5);
                                context.lineTo(x - 3, y + 10);
                                context.lineTo(x + 3, y + 10);
                                context.closePath();
                                
                                var text_x = x;
                                var text_y = y + 5 + length;
                            
                            } else {
                                
                                var text_x = x;
                                var text_y = y - 5 - length;

                                context.moveTo(x, y - 5);
                                context.lineTo(x, y - 5 - length);
                                
                                context.stroke();
                                context.beginPath();
                                
                                // This draws the arrow
                                context.moveTo(x, y - 5);
                                context.lineTo(x - 3, y - 10);
                                context.lineTo(x + 3, y - 10);
                                context.closePath();
                            }
                        
                            context.fill();
                        }

                        // Taken out on the 10th Nov 2010 - unnecessary
                        //var width = context.measureText(labels[i]).width;
                        
                        context.beginPath();
                            
                            // Fore ground color
                            context.fillStyle = (typeof(labels_processed[i]) == 'object' && typeof(labels_processed[i][1]) == 'string') ? labels_processed[i][1] : 'black';

                            OfficeExcel.Text(context,
                                        obj._otherProps._text_font,
                                        obj._otherProps._text_size,
                                        text_x,
                                        text_y,
                                        (typeof(labels_processed[i]) == 'object' && typeof(labels_processed[i][0]) == 'string') ? labels_processed[i][0] : labels_processed[i],
                                        'bottom',
                                        'center',
                                        true,
                                        null,
                                        (typeof(labels_processed[i]) == 'object' && typeof(labels_processed[i][2]) == 'string') ? labels_processed[i][2] : 'white',
										bold,
										null,
										textOptions);
                        context.fill();
                    }
                }
            }
        }
    }


    /**
    * This function "fills in" key missing properties that various implementations lack
    * 
    * @param object e The event object
    */
    OfficeExcel.FixEventObject = function (e)
    {
        if (OfficeExcel.isIE8()) {
            
            var e = event;

            e.pageX  = (event.clientX + document.body.scrollLeft);
            e.pageY  = (event.clientY + document.body.scrollTop);
            e.target = event.srcElement;
            
            if (!document.body.scrollTop && document.documentElement.scrollTop) {
                e.pageX += parseInt(document.documentElement.scrollLeft);
                e.pageY += parseInt(document.documentElement.scrollTop);
            }
        }

        // This is mainly for FF which doesn't provide offsetX
        if (typeof(e.offsetX) == 'undefined' && typeof(e.offsetY) == 'undefined') {
            var coords = OfficeExcel.getMouseXY(e);
            e.offsetX = coords[0];
            e.offsetY = coords[1];
        }
        
        // Any browser that doesn't implement stopPropagation() (MSIE)
        if (!e.stopPropagation) {
            e.stopPropagation = function () {window.event.cancelBubble = true;}
        }
        
        return e;
    }


    /**
    * Draw crosshairs if enabled
    * 
    * @param object obj The graph object (from which we can get the context and canvas as required)
    */
    OfficeExcel.DrawCrosshairs = function (obj)
    {
        if (obj._otherProps._crosshairs) {
            var canvas  = obj.canvas;
            var context = obj.context;
            
            //canvas.onmousemove = function (e)
            var crosshairs_mousemove = function (e)
            {
                var e       = OfficeExcel.FixEventObject(e);
                var canvas  = obj.canvas;
                var context = obj.context;
                var width   = canvas.width;
                var height  = canvas.height;
                var adjustments = obj._tooltip._coords_adjust;
                
                var gutterLeft   = obj._chartGutter._left;
                var gutterRight  = obj._chartGutter._right;
                var gutterTop    = obj._chartGutter._top;
                var gutterBottom = obj._chartGutter._bottom;
    
                var mouseCoords = OfficeExcel.getMouseXY(e);
                var x = mouseCoords[0];
                var y = mouseCoords[1];

                if (typeof(adjustments) == 'object' && adjustments[0] && adjustments[1]) {
                    x = x - adjustments[0];
                    y = y - adjustments[1];
                }

                OfficeExcel.Clear(canvas);
                obj.Draw();

                if (   x >= gutterLeft
                    && y >= gutterTop
                    && x <= (width - gutterRight)
                    && y <= (height - gutterBottom)
                   ) {

                    var linewidth = obj._otherProps._crosshairs_linewidth;
                    context.lineWidth = linewidth ? linewidth : 1;

                    context.beginPath();
                    context.strokeStyle = obj._otherProps._crosshairs_color;

                    // Draw a top vertical line
                    if (obj._otherProps._crosshairs_vline) {
                        context.moveTo(AA(this, x), AA(this, gutterTop));
                        context.lineTo(AA(this, x), AA(this, height - gutterBottom));
                    }

                    // Draw a horizontal line
                    if (obj._otherProps._crosshairs_hline) {
                        context.moveTo(AA(this, gutterLeft), AA(this, y));
                        context.lineTo(AA(this, width - gutterRight), AA(this, y));
                    }

                    context.stroke();
                    
                    
                    /**
                    * Need to show the coords?
                    */
                    if (obj._otherProps._crosshairs_coords) {
                        if (obj.type == 'scatter') {

                            var xCoord = (((x - obj._chartGutter._left) / (obj.canvas.width - gutterLeft - gutterRight)) * (obj._otherProps._xmax - obj._otherProps._xmin)) + obj._otherProps._xmin;
                                xCoord = xCoord.toFixed(obj._otherProps._scale_decimals);
                            var yCoord = obj.max - (((y - obj._chartGutter._top) / (obj.canvas.height - gutterTop - gutterBottom)) * obj.max);

                            if (obj.type == 'scatter' && obj._otherProps._xaxispos == 'center') {
                                yCoord = (yCoord - (obj.max / 2)) * 2;
                            }

                            yCoord = yCoord.toFixed(obj._otherProps._scale_decimals);

                            var div    = OfficeExcelExcel.Registry.Get('chart.coordinates.coords.div');
                            var mouseCoords = OfficeExcel.getMouseXY(e);
                            var canvasXY = OfficeExcel.getCanvasXY(canvas);
                            
                            if (!div) {

                                div = document.createElement('DIV');
                                div.__object__     = obj;
                                div.style.position = 'absolute';
                                div.style.backgroundColor = 'white';
                                div.style.border = '1px solid black';
                                div.style.fontFamily = 'Arial, Verdana, sans-serif';
                                div.style.fontSize = '10pt'
                                div.style.padding = '2px';
                                div.style.opacity = 1;
                                div.style.WebkitBorderRadius = '3px';
                                div.style.borderRadius = '3px';
                                div.style.MozBorderRadius = '3px';
                                document.body.appendChild(div);
                                
                                OfficeExcel.Registry.Set('chart.coordinates.coords.div', div);
                            }
                            
                            // Convert the X/Y pixel coords to correspond to the scale
                            div.style.opacity = 1;
                            div.style.display = 'inline';

                            if (!obj._otherProps._crosshairs_coords_fixed) {
                                div.style.left = Math.max(2, (e.pageX - div.offsetWidth - 3)) + 'px';
                                div.style.top = Math.max(2, (e.pageY - div.offsetHeight - 3))  + 'px';
                            } else {
                                div.style.left = canvasXY[0] + gutterLeft + 3 + 'px';
                                div.style.top  = canvasXY[1] + gutterTop + 3 + 'px';
                            }

                            div.innerHTML = '<span style="color: #666">' + obj._otherProps._crosshairs_coords_labels_x + ':</span> ' + xCoord + '<br><span style="color: #666">' + obj._otherProps._crosshairs_coords_labels_y + ':</span> ' + yCoord;
                            
                            canvas.addEventListener('mouseout', OfficeExcel.HideCrosshairCoords, false);

                            obj.canvas.__crosshairs_labels__ = div;
                            obj.canvas.__crosshairs_x__ = xCoord;
                            obj.canvas.__crosshairs_y__ = yCoord;

                        } else {
                            alert('[OfficeExcel] Showing crosshair coordinates is only supported on the Scatter chart');
                        }
                    }

                    /**
                    * Fire the oncrosshairs custom event
                    */
                    OfficeExcel.FireCustomEvent(obj, 'oncrosshairs');

                } else {
                    OfficeExcel.HideCrosshairCoords();
                }
            }
            canvas.addEventListener('mousemove', crosshairs_mousemove, false);
            OfficeExcel.AddEventListener(obj.id, 'mousemove', crosshairs_mousemove);
        }
    }

    /**
    * Thisz function hides the crosshairs coordinates
    */
    OfficeExcel.HideCrosshairCoords = function ()
    {
        var div = OfficeExcel.Registry.Get('chart.coordinates.coords.div');

        if (   div
            && div.style.opacity == 1
            && div.__object__._otherProps._crosshairs_coords_fadeout
           ) {
            setTimeout(function() {OfficeExcel.Registry.Get('chart.coordinates.coords.div').style.opacity = 0.9;}, 50);
            setTimeout(function() {OfficeExcel.Registry.Get('chart.coordinates.coords.div').style.opacity = 0.8;}, 100);
            setTimeout(function() {OfficeExcel.Registry.Get('chart.coordinates.coords.div').style.opacity = 0.7;}, 150);
            setTimeout(function() {OfficeExcel.Registry.Get('chart.coordinates.coords.div').style.opacity = 0.6;}, 200);
            setTimeout(function() {OfficeExcel.Registry.Get('chart.coordinates.coords.div').style.opacity = 0.5;}, 250);
            setTimeout(function() {OfficeExcel.Registry.Get('chart.coordinates.coords.div').style.opacity = 0.4;}, 300);
            setTimeout(function() {OfficeExcel.Registry.Get('chart.coordinates.coords.div').style.opacity = 0.3;}, 350);
            setTimeout(function() {OfficeExcel.Registry.Get('chart.coordinates.coords.div').style.opacity = 0.2;}, 400);
            setTimeout(function() {OfficeExcel.Registry.Get('chart.coordinates.coords.div').style.opacity = 0.1;}, 450);
            setTimeout(function() {OfficeExcel.Registry.Get('chart.coordinates.coords.div').style.opacity = 0;}, 500);
            setTimeout(function() {OfficeExcel.Registry.Get('chart.coordinates.coords.div').style.display = 'none';}, 550);
        }
    }


    /**
    * Trims the right hand side of a string. Removes SPACE, TAB
    * CR and LF.
    * 
    * @param string str The string to trim
    */
    OfficeExcel.rtrim = function (str)
    {
        return str.replace(/( |\n|\r|\t)+$/, '');
    }


    /**
    * Draws the3D axes/background
    */
    OfficeExcel.Draw3DAxes = function (obj)
    {
        var gutterLeft    = obj._chartGutter._left;
        var gutterRight   = obj._chartGutter._right;
        var gutterTop     = obj._chartGutter._top;
        var gutterBottom  = obj._chartGutter._bottom;

        var context = obj.context;
        var canvas  = obj.canvas;

        context.strokeStyle = '#aaa';
        context.fillStyle = '#ddd';

        // Draw the vertical left side
        context.beginPath();
            context.moveTo(gutterLeft, gutterTop);
            context.lineTo(gutterLeft + 10, gutterTop - 5);
            context.lineTo(gutterLeft + 10, canvas.height - gutterBottom - 5);
            context.lineTo(gutterLeft, canvas.height - gutterBottom);
        context.closePath();
        
        context.stroke();
        context.fill();

        // Draw the bottom floor
        context.beginPath();
            context.moveTo(gutterLeft, canvas.height - gutterBottom);
            context.lineTo(gutterLeft + 10, canvas.height - gutterBottom - 5);
            context.lineTo(canvas.width - gutterRight + 10,  canvas.height - gutterBottom - 5);
            context.lineTo(canvas.width - gutterRight, canvas.height - gutterBottom);
        context.closePath();
        
        context.stroke();
        context.fill();
    }

    // Turns off any shadow
    OfficeExcel.NoShadow = function (obj)
    {
        obj.context.shadowColor   = 'rgba(0,0,0,0)';
        obj.context.shadowBlur    = 0;
        obj.context.shadowOffsetX = 0;
        obj.context.shadowOffsetY = 0;
    }
    
    
    /**
    * Sets the four shadow properties - a shortcut function
    * 
    * @param object obj     Your graph object
    * @param string color   The shadow color
    * @param number offsetx The shadows X offset
    * @param number offsety The shadows Y offset
    * @param number blur    The blurring effect applied to the shadow
    */
    OfficeExcel.SetShadow = function (obj, color, offsetx, offsety, blur)
    {
        obj.context.shadowColor   = color;
        obj.context.shadowOffsetX = offsetx;
        obj.context.shadowOffsetY = offsety;
        obj.context.shadowBlur    = blur;
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



    /**
    * This is a function that can be used to run code asynchronously, which can
    * be used to speed up the loading of you pages.
    * 
    * @param string func This is the code to run. It can also be a function pointer.
    *                    The front page graphs show this function in action. Basically
    *                   each graphs code is made in a function, and that function is
    *                   passed to this function to run asychronously.
    */
    OfficeExcel.Async = function (func)
    {
        return setTimeout(func, arguments[1] ? arguments[1] : 1);
    }


    /**
    * A custom random number function
    * 
    * @param number min The minimum that the number should be
    * @param number max The maximum that the number should be
    * @param number    How many decimal places there should be. Default for this is 0
    */
    OfficeExcel.random = function (min, max)
    {
        var dp = arguments[2] ? arguments[2] : 0;
        var r = Math.random();
        
        return Number((((max - min) * r) + min).toFixed(dp));
    }

    OfficeExcel.degrees2Radians=function(degrees){return degrees*(PI/180);}
    /**
    * Draws a rectangle with curvy corners
    * 
    * @param context object The context
    * @param x       number The X coordinate (top left of the square)
    * @param y       number The Y coordinate (top left of the square)
    * @param w       number The width of the rectangle
    * @param h       number The height of the rectangle
    * @param         number The radius of the curved corners
    * @param         boolean Whether the top left corner is curvy
    * @param         boolean Whether the top right corner is curvy
    * @param         boolean Whether the bottom right corner is curvy
    * @param         boolean Whether the bottom left corner is curvy
    */
    OfficeExcel.strokedCurvyRect = function (context, x, y, w, h)
    {
        // The corner radius
        var r = arguments[5] ? arguments[5] : 3;

        // The corners
        var corner_tl = (arguments[6] || arguments[6] == null) ? true : false;
        var corner_tr = (arguments[7] || arguments[7] == null) ? true : false;
        var corner_br = (arguments[8] || arguments[8] == null) ? true : false;
        var corner_bl = (arguments[9] || arguments[9] == null) ? true : false;

        context.beginPath();

            // Top left side
            context.moveTo(x + (corner_tl ? r : 0), y);
            context.lineTo(x + w - (corner_tr ? r : 0), y);
            
            // Top right corner
            if (corner_tr) {
                context.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2, false);
            }

            // Top right side
            context.lineTo(x + w, y + h - (corner_br ? r : 0) );

            // Bottom right corner
            if (corner_br) {
                context.arc(x + w - r, y - r + h, r, Math.PI * 2, Math.PI * 0.5, false);
            }

            // Bottom right side
            context.lineTo(x + (corner_bl ? r : 0), y + h);

            // Bottom left corner
            if (corner_bl) {
                context.arc(x + r, y - r + h, r, Math.PI * 0.5, Math.PI, false);
            }

            // Bottom left side
            context.lineTo(x, y + (corner_tl ? r : 0) );

            // Top left corner
            if (corner_tl) {
                context.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
            }

        context.stroke();
    }


    /**
    * Draws a filled rectangle with curvy corners
    * 
    * @param context object The context
    * @param x       number The X coordinate (top left of the square)
    * @param y       number The Y coordinate (top left of the square)
    * @param w       number The width of the rectangle
    * @param h       number The height of the rectangle
    * @param         number The radius of the curved corners
    * @param         boolean Whether the top left corner is curvy
    * @param         boolean Whether the top right corner is curvy
    * @param         boolean Whether the bottom right corner is curvy
    * @param         boolean Whether the bottom left corner is curvy
    */
    OfficeExcel.filledCurvyRect = function (context, x, y, w, h)
    {
        // The corner radius
        var r = arguments[5] ? arguments[5] : 3;

        // The corners
        var corner_tl = (arguments[6] || arguments[6] == null) ? true : false;
        var corner_tr = (arguments[7] || arguments[7] == null) ? true : false;
        var corner_br = (arguments[8] || arguments[8] == null) ? true : false;
        var corner_bl = (arguments[9] || arguments[9] == null) ? true : false;

        context.beginPath();

            // First draw the corners

            // Top left corner
            if (corner_tl) {
                context.moveTo(x + r, y + r);
                context.arc(x + r, y + r, r, Math.PI, 1.5 * Math.PI, false);
            } else {
                context.fillRect(x, y, r, r);
            }

            // Top right corner
            if (corner_tr) {
                context.moveTo(x + w - r, y + r);
                context.arc(x + w - r, y + r, r, 1.5 * Math.PI, 0, false);
            } else {
                context.moveTo(x + w - r, y);
                context.fillRect(x + w - r, y, r, r);
            }


            // Bottom right corner
            if (corner_br) {
                context.moveTo(x + w - r, y + h - r);
                context.arc(x + w - r, y - r + h, r, 0, Math.PI / 2, false);
            } else {
                context.moveTo(x + w - r, y + h - r);
                context.fillRect(x + w - r, y + h - r, r, r);
            }

            // Bottom left corner
            if (corner_bl) {
                context.moveTo(x + r, y + h - r);
                context.arc(x + r, y - r + h, r, Math.PI / 2, Math.PI, false);
            } else {
                context.moveTo(x, y + h - r);
                context.fillRect(x, y + h - r, r, r);
            }

            // Now fill it in
            context.fillRect(x + r, y, w - r - r, h);
            context.fillRect(x, y + r, r + 1, h - r - r);
            context.fillRect(x + w - r - 1, y + r, r + 1, h - r - r);

        context.fill();
    }


    /**
    * A crude timing function
    * 
    * @param string label The label to use for the time
    */
    OfficeExcel.Timer = function (label)
    {
        var d = new Date();

        // This uses the Firebug console
        console.log(label + ': ' + d.getSeconds() + '.' + d.getMilliseconds());
    }


    /**
    * Hides the palette if it's visible
    */
    OfficeExcel.HidePalette = function ()
    {
        var div = OfficeExcel.Registry.Get('palette');

        if (typeof(div) == 'object' && div) {
            div.style.visibility = 'hidden';
            div.style.display    = 'none';
            OfficeExcel.Registry.Set('palette', null);
        }
    }


    /**
    * Hides the zoomed canvas
    */
    OfficeExcel.HideZoomedCanvas = function ()
    {
        var interval = 15;
        var frames   = 10;

        if (typeof(__zoomedimage__) == 'object') {
            obj = __zoomedimage__.obj;
        } else {
            return;
        }

        if (obj._zoom._fade_out) {
            for (var i=frames,j=1; i>=0; --i, ++j) {
                if (typeof(__zoomedimage__) == 'object') {
                    setTimeout("__zoomedimage__.style.opacity = " + String(i / 10), j * interval);
                }
            }

            if (typeof(__zoomedbackground__) == 'object') {
                setTimeout("__zoomedbackground__.style.opacity = " + String(i / frames), j * interval);
            }
        }

        if (typeof(__zoomedimage__) == 'object') {
            setTimeout("__zoomedimage__.style.display = 'none'", obj._zoom._fade_out ? (frames * interval) + 10 : 0);
        }

        if (typeof(__zoomedbackground__) == 'object') {
            setTimeout("__zoomedbackground__.style.display = 'none'", obj._zoom._fade_out ? (frames * interval) + 10 : 0);
        }
    }


    /**
    * Adds an event handler
    * 
    * @param object obj   The graph object
    * @param string event The name of the event, eg ontooltip
    * @param object func  The callback function
    */
    OfficeExcel.AddCustomEventListener = function (obj, name, func)
    {
        if (typeof(OfficeExcel.events[obj.id]) == 'undefined') {
            OfficeExcel.events[obj.id] = [];
        }

        OfficeExcel.events[obj.id].push([obj, name, func]);
        
        return OfficeExcel.events[obj.id].length - 1;
    }

    // Fire events
    OfficeExcel.FireCustomEvent = function (obj, name)
    {
        if (obj && obj.isOfficeExcel) {
            var id = obj.id;
    
            if (   typeof(id) == 'string'
                && typeof(OfficeExcel.events) == 'object'
                && typeof(OfficeExcel.events[id]) == 'object'
                && OfficeExcel.events[id].length > 0) {
    
                for(var j=0; j<OfficeExcel.events[id].length; ++j) {
                    if (OfficeExcel.events[id][j] && OfficeExcel.events[id][j][1] == name) {
                        OfficeExcel.events[id][j][2](obj);
                    }
                }
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
    OfficeExcel.isIE9 = function ()
    {
        return navigator.userAgent.indexOf('MSIE 9') > 0;
    }

    // Checks the browser for traces of MSIE9
    OfficeExcel.isOld = function ()
    {
        return OfficeExcel.isIE7() || OfficeExcel.isIE8();
    }

    // Checks the browser for traces of MSIE9
    OfficeExcel.isIE9up = function ()
    {
        navigator.userAgent.match(/MSIE (\d+)/);

        return Number(RegExp.$1) >= 9;
    }

    //Clear all Listeners
    OfficeExcel.ClearEventListeners = function (id)
    {
        for (var i = 0; i < OfficeExcel.Registry.Get('chart.event.handlers').length; ++i) {

            var el = OfficeExcel.Registry.Get('chart.event.handlers')[i];
            if (el && (el[0] == id || el[0] == ('window_' + id))) {
                if (el[0].substring(0, 7) == 'window_')
                    window.removeEventListener(el[1], el[2], false);
                else {
                    if (document.getElementById(id)) {
                        document.getElementById(id).removeEventListener(el[1], el[2], false);
                    }
                }
                
                OfficeExcel.Registry.Get('chart.event.handlers')[i] = null;
            }
        }
    }


    /**
    * 
    */
    OfficeExcel.AddEventListener = function (id, e, func)
    {
        var type = arguments[3] ? arguments[3] : 'unknown';

        OfficeExcel.Registry.Get('chart.event.handlers').push([id, e, func, type]);
    }


    /**
    * This function suggests a gutter size based on the widest left label. Given that the bottom
    * labels may be longer, this may be a little out.
    * 
    * @param object obj  The graph object
    * @param array  data An array of graph data
    * @return int        A suggested gutter setting
    */
    OfficeExcel.getGutterSuggest = function (obj, data)
    {
        var str = OfficeExcel.number_format(obj, OfficeExcel.array_max(OfficeExcel.getScale(OfficeExcel.array_max(data), obj)), obj._otherProps._units_pre, obj._otherProps._units_post);

        // Take into account the HBar
        if (obj.type == 'hbar') {

            var str = '';
            var len = 0;

            for (var i=0; i<obj._otherProps._labels.length; ++i) {
                str = (obj._otherProps._labels.length > str.length ? obj._otherProps._labels[i] : str);
            }
        }

        obj.context.font = obj._otherProps._text_size + 'pt ' + obj._otherProps._text_font;

        len = obj.context.measureText(str).width + 5;

        return (obj.type == 'hbar' ? len / 3 : len);
    }


    /**
    * A basic Array shift gunction
    * 
    * @param  object The numerical array to work on
    * @return        The new array
    */
    OfficeExcel.array_shift = function (arr)
    {
        var ret = [];
        
        for (var i=1; i<arr.length; ++i) ret.push(arr[i]);
        
        return ret;
    }


    /**
    * If you prefer, you can use the SetConfig() method to set the configuration information
    * for your chart. You may find that setting the configuration this way eases reuse.
    * 
    * @param object obj    The graph object
    * @param object config The graph configuration information
    */
    OfficeExcel.SetConfig = function (obj, c)
    {
        for (i in c) {
            if (typeof(i) == 'string') {
                obj.Set(i, c[i]);
            }
        }
        
        return obj;
    }


    /**
    * These are older functions that were used before the move to seperate gutter settings
    */
    OfficeExcel.GetHeight=function(obj){return obj.canvas.height;}
    OfficeExcel.GetWidth=function(obj){return obj.canvas.width;}


    /**
    * Clears all the custom event listeners that have been registered
    * 
    * @param    string Limits the clearing to this object ID
    */
    OfficeExcel.RemoveAllCustomEventListeners = function ()
    {
        var id = arguments[0];

        if (id && OfficeExcel.events[id]) {
            OfficeExcel.events[id] = [];
        } else {
            OfficeExcel.events = [];
        }
    }


    /**
    * Clears a particular custom event listener
    * 
    * @param object obj The graph object
    * @param number i   This is the index that is return by .AddCustomEventListener()
    */
    OfficeExcel.RemoveCustomEventListener = function (obj, i)
    {
        if (   typeof(OfficeExcel.events) == 'object'
            && typeof(OfficeExcel.events[obj.id]) == 'object'
            && typeof(OfficeExcel.events[obj.id][i]) == 'object') {
            
            OfficeExcel.events[obj.id][i] = null;
        }
    }


    
    OfficeExcel.DrawBackgroundImage1 = function (obj)
    {
        var img = new Image();
        img.__object__  = obj;
        img.__canvas__  = obj.canvas;
        img.__context__ = obj.context;
        img.src         = obj._otherProps._background_image;
        img.onload = function ()
        {
            var obj = this.__object__;
            obj.context.drawImage(this, 0, 0, obj.canvas.width, obj.canvas.height);
            obj.__background_image__ = true;
            obj.Draw();
        }
    }
    
    
    
    
    // Draw the background
    OfficeExcel.DrawBackgroundImage = function (obj)
    {
        var img = new Image();
        img.__object__  = obj;
        img.__canvas__  = obj.canvas;
        img.__context__ = obj.context;
        img.src         = obj._otherProps._background_image;
        
        obj.__background_image__ = img;

        img.onload = function ()
        {
            var obj = this.__object__;
            
            var gutterLeft   = obj._chartGutter._left;
            var gutterRight  = obj._chartGutter._right;
            var gutterTop    = obj._chartGutter._top;
            var gutterBottom = obj._chartGutter._bottom;
            var stretch      = obj._otherProps._background_image_stretch;
            var align        = obj._otherProps._background_image_align;

            var x;
            var y;

            if (typeof(align) == 'string') {
                if (align.indexOf('right') != -1)
                    x = obj.canvas.width - this.width - gutterRight;
                else
                    x = gutterLeft;

                if (align.indexOf('bottom') != -1)
                    y = obj.canvas.height - this.height - gutterBottom;
                else
                    y = gutterTop;
            } else {
                x = gutterLeft;
                y = gutterTop;
            }
            
            // X/Y coords take precedence over the align
            x = typeof(obj._otherProps._background_image_x) == 'number' ? obj._otherProps._background_image_x : x;
            y = typeof(obj._otherProps._background_image_y) == 'number' ? obj._otherProps._background_image_y : y;
            
            var w = stretch ? obj.canvas.width - gutterLeft - gutterRight : this.width;
            var h = stretch ? obj.canvas.height - gutterTop - gutterBottom : this.height;

            OfficeExcel.Clear(obj.canvas);

            obj.context.drawImage(this, x, y, w, h);
            
            
            
            // Draw the graph
            obj.Draw();
        }
        
        img.onerror = function ()
        {
            var obj = this.__canvas__.__object__;

            // Show an error alert
            alert('[ERROR] There was an error with the background image that you specified: ' + img.src);
            
            // Draw the graph, because the onload doesn't fire
            obj.Draw();
        }
    }


    /**
    * This resets the canvas. Keep in mind that any translate() that has been performed will also be reset.
    * 
    * @param object canvas The canvas
    */
    OfficeExcel.Reset=function(canvas){canvas.width = canvas.width;}

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

    OfficeExcel.InstallUserClickListener = function (obj, func)
    {
        if (typeof(func) == 'function') {
            function UserClickListener (e)
            {
                var obj   = e.target.__object__;
                var shape = obj.getShape(e);

                if (shape) {
                    func(e, shape);
                }
            }
            obj.canvas.addEventListener('click', UserClickListener, false);
            OfficeExcel.AddEventListener(obj.id, 'click', UserClickListener);
        }
    }

    OfficeExcel.InstallUserMousemoveListener = function (obj, func)
    {
        if (typeof(func) == 'function') {
            function UserMousemoveHandler (e)
            {
                var obj   = e.target.__object__;
                var shape = obj.getShape(e);
                
                /**
                * This bit saves the current pointer style if there isn't one already saved
                */
                if (shape && typeof(func) == 'function') {
                    if (obj._otherProps._events_mousemove_revertto == null) {
                        obj._otherProps._events_mousemove_revertto = e.target.style.cursor;
                    }
                    func(e, shape)

                } else if (typeof(obj._otherProps._events_mousemove_revertto) == 'string') {

                    e.target.style.cursor = obj._otherProps._events_mousemove_revertto;
                    obj._otherProps._events_mousemove_revertto = null;
                }
            }
            obj.canvas.addEventListener('mousemove', UserMousemoveHandler, false);
            OfficeExcel.AddEventListener(obj.id, 'mousemove', UserMousemoveHandler);
        }
    }