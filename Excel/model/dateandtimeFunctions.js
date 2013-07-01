/**
 * Created with JetBrains WebStorm.
 * User: Dmitry.Shahtanov
 * Date: 27.06.13
 * Time: 13:24
 * To change this template use File | Settings | File Templates.
 */
cFormulaFunction.DateAndTime = {
    'groupName' : "DateAndTime",
        'DATE' : function(){
        var r = new cBaseFunction("DATE");
        r.setArgumentsMin(3);
        r.setArgumentsMax(3);
        r.Calculate = function(arg){
            var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], year, month, day;

            for (var i = 0; i<this.argumentsCurrent;i++){
                var arg0 = arg[i];
                if( arg0 instanceof cArray ){
                    arg0 = arg0.getElement(0);
                }
                else if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
                    arg0 = arg0.cross(arguments[1].first).tocNumber();
                }

                if(arg0 instanceof cError){
                    return this.setCA(arg0,true);
                }
                else if( arg0 instanceof cNumber || arg0 instanceof cBool){
                    if(i==0)year = arg0.tocNumber().getValue();
                    if(i==1)month = arg0.tocNumber().getValue();
                    if(i==2)day = arg0.tocNumber().getValue();
                }
                else if ( arg0 instanceof cRef || arg0 instanceof cRef3D ){
                    var val = arg0.getValue();
                    if(val instanceof cError) return this.setCA(val,true);
                    else if( val instanceof cNumber || val instanceof cBool ){
                        if(i==0)year = arg0.tocNumber().getValue();
                        if(i==1)month = arg0.tocNumber().getValue();
                        if(i==2)day = arg0.tocNumber().getValue();
                    }
                    else{
                        return this.setCA(new cError( cErrorType.wrong_value_type ),true);
                    }
                }
                else if(arg0 instanceof cString || arg0 instanceof cEmpty){
                    var val = arg0.tocNumber();
                    if(val instanceof cError){
                        return this.setCA(val,true);
                    }
                    else {
                        if(i==0)year = arg0.tocNumber().getValue();
                        if(i==1)month = arg0.tocNumber().getValue();
                        if(i==2)day = arg0.tocNumber().getValue();
                    }
                }
            }

            if( year >= 0 && year <= 1899)
                year+=1900;
            if( month == 0 ){
                return this.setCA(new cError( cErrorType.not_numeric ),true);
            }
            this.value = new cNumber( Math.round( ( ( new Date(year, month - 1,  day) ).getTime()/1000 )/c_sPerDay+(c_DateCorrectConst+1) ) )
            this.value.numFormat = 14;
            this.value.ca = true;
            return this.value;
        }
        r.getInfo = function(){
            return {
                name:this.name,
                args:"( year, month, day )"
            };
        }
        return r;
    },
    'DATEDIF' : function(){
        var r = new cBaseFunction("DATEDIF");
        return r;
    },
    'DATEVALUE' : function(){
        var r = new cBaseFunction("DATEVALUE");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function(arg){
            var arg0 = arg[0];

            if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
                arg0 = arg0.cross(arguments[1].first);
            }
            else if( arg0 instanceof cArray ){
                arg0 = arg0.getElementRowCol(0,0);
            }

            arg0 = arg0.tocString();

            if ( arg0 instanceof cError )
                return this.value = arg0;

            if( arg0.tocNumber() instanceof cNumber && arg0.tocNumber().getValue() > 0 )
                return this.value = new cNumber( parseInt(arg0.tocNumber().getValue()) );

            var res = g_oFormatParser.parse(arg0.getValue());

            if( res && res.bDateTime )
                return this.value = new cNumber( parseInt(res.value) );
            else
                return this.value = new cError( cErrorType.wrong_value_type );
        }
        r.getInfo = function(){
            return {
                name:this.name,
                args:"( date-time-string )"
            };
        }
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    'DAY' : function(){
        var r = new cBaseFunction("DAY");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function(arg){
            var arg0 = arg[0],val;
            if( arg0 instanceof cArray ){
                arg0 = arg0.getElement(0);
            }
            else if( arg0 instanceof cArea || arg0 instanceof cArea3D ){
                arg0 = arg0.cross(arguments[1].first).tocNumber();
                val = arg0.tocNumber().getValue();
            }
            if(arg0 instanceof cError) return this.setCA(arg0,true);
            else if( arg0 instanceof cNumber || arg0 instanceof cBool){
                val = arg0.tocNumber().getValue();
            }
            else if ( arg0 instanceof cRef || arg0 instanceof cRef3D ){
                val = arg0.getValue().tocNumber();
                if( val instanceof cNumber || val instanceof cBool ){
                    val = arg0.tocNumber().getValue();
                }
                else{
                    return this.setCA(new cError( cErrorType.wrong_value_type ),true);
                }
            }
            else if(arg0 instanceof cString){
                val = arg0.tocNumber();
                if(val instanceof cError || val instanceof cEmpty ){
                    var d = new Date( arg0.getValue() );
                    if( isNaN(d) ){
                        return this.setCA(new cError( cErrorType.wrong_value_type ),true);
                    }
                    else
                        val = Math.floor( ( d.getTime()/1000 - d.getTimezoneOffset()*60 )/c_sPerDay+( c_DateCorrectConst + (g_bDate1904?0:1) ) );
                }
                else {
                    val = arg0.tocNumber().getValue();
                }
            }
            if(val < 0)
                return this.setCA(new cError( cErrorType.not_numeric ),true);
            else if(!g_bDate1904)
            {
                if( val < 60 )
                    return this.setCA(new cNumber( ( new Date((val-c_DateCorrectConst)*c_msPerDay) ).getUTCDate() ),true,0);
                else if( val == 60 )
                    return this.setCA(new cNumber( ( new Date((val-c_DateCorrectConst-1)*c_msPerDay) ).getUTCDate() +1),true,0);
                else
                    return this.setCA(new cNumber( ( new Date((val-c_DateCorrectConst-1)*c_msPerDay) ).getUTCDate() ),true,0);
            }
            else
                return this.setCA(new cNumber( ( new Date((val-c_DateCorrectConst)*c_msPerDay) ).getUTCDate() ),true,0);
        }
        r.getInfo = function(){
            return {
                name:this.name,
                args:"( date-value )"
            };
        }
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    'DAYS360' : function(){
        var r = new cBaseFunction("DAYS360");
        return r;
    },
    'EDATE' : function(){
        var r = new cBaseFunction("EDATE");
        r.setArgumentsMin(2);
        r.setArgumentsMax(2);
        r.Calculate = function(arg){
            var arg0 = arg[0], arg1 = arg[1];

            if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
                arg0 = arg0.cross(arguments[1].first);
            }
            else if( arg0 instanceof cArray ){
                arg0 = arg0.getElementRowCol(0,0);
            }

            if ( arg1 instanceof cArea || arg1 instanceof cArea3D ){
                arg1 = arg1.cross(arguments[1].first);
            }
            else if( arg1 instanceof cArray ){
                arg1 = arg1.getElementRowCol(0,0);
            }

            arg0 = arg0.tocNumber();
            arg1 = arg1.tocNumber();

            if( arg0 instanceof cError) return this.value = arg0;
            if( arg1 instanceof cError) return this.value = arg1;

            var val = arg0.getValue(), date, _date;

            if(val < 0)
                return this.setCA(new cError( cErrorType.not_numeric ),true);
            else if(!g_bDate1904){
                if( val < 60 )
                    val = new Date((val-c_DateCorrectConst)*c_msPerDay);
                else if( val == 60 )
                    val = new Date((val-c_DateCorrectConst-1)*c_msPerDay);
                else
                    val = new Date((val-c_DateCorrectConst-1)*c_msPerDay);
            }
            else
                val = new Date((val-c_DateCorrectConst)*c_msPerDay);

            date = new Date(val);

            if( 0 <= date.getDate() && 28 >= date.getDate() ){
                val = new Date(val.setMonth(val.getMonth()+arg1.getValue()))
            }
            else if( 29 <= date.getDate() && 31 >= date.getDate() ){
                date.setDate(1);
                date.setMonth(date.getMonth()+arg1.getValue());
                if( val.getDate() > (_date = date.getDaysInMonth()) ){
                    val.setDate( _date );
                }
                val = new Date(val.setMonth(val.getMonth()+arg1.getValue()));
            }

            return this.value = new cNumber( Math.floor( ( val.getTime()/1000 - val.getTimezoneOffset()*60 )/c_sPerDay+(c_DateCorrectConst+1) ) )
        }
        r.getInfo = function(){
            return {
                name:this.name,
                args:"( start-date , month-offset )"
            };
        }
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    'EOMONTH' : function(){
        var r = new cBaseFunction("EOMONTH");
        r.setArgumentsMin(2);
        r.setArgumentsMax(2);
        r.Calculate = function(arg){
            var arg0 = arg[0], arg1 = arg[1];

            if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
                arg0 = arg0.cross(arguments[1].first);
            }
            else if( arg0 instanceof cArray ){
                arg0 = arg0.getElementRowCol(0,0);
            }

            if ( arg1 instanceof cArea || arg1 instanceof cArea3D ){
                arg1 = arg1.cross(arguments[1].first);
            }
            else if( arg1 instanceof cArray ){
                arg1 = arg1.getElementRowCol(0,0);
            }

            arg0 = arg0.tocNumber();
            arg1 = arg1.tocNumber();

            if( arg0 instanceof cError) return this.value = arg0;
            if( arg1 instanceof cError) return this.value = arg1;

            var val = arg0.getValue(), date, _date;

            if(val < 0)
                return this.setCA(new cError( cErrorType.not_numeric ),true);
            else if(!g_bDate1904){
                if( val < 60 )
                    val = new Date((val-c_DateCorrectConst)*c_msPerDay);
                else if( val == 60 )
                    val = new Date((val-c_DateCorrectConst-1)*c_msPerDay);
                else
                    val = new Date((val-c_DateCorrectConst-1)*c_msPerDay);
            }
            else
                val = new Date((val-c_DateCorrectConst)*c_msPerDay);

            date = new Date(val);

            val.setDate(1);
            val.setMonth(val.getMonth()+arg1.getValue());
            val.setDate(val.getDaysInMonth());

            return this.value = new cNumber( Math.floor( ( val.getTime()/1000 - val.getTimezoneOffset()*60 )/c_sPerDay+(c_DateCorrectConst+1) ) );
        }
        r.getInfo = function(){
            return {
                name:this.name,
                args:"( start-date , month-offset )"
            };
        }
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    'HOUR' : function(){
        var r = new cBaseFunction("HOUR");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function(arg){
            var arg0 = arg[0],val;
            if( arg0 instanceof cArray ){
                arg0 = arg0.getElement(0);
            }
            else if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
                arg0 = arg0.cross(arguments[1].first).tocNumber();
            }

            if(arg0 instanceof cError)return this.setCA(arg0,true);
            else if( arg0 instanceof cNumber || arg0 instanceof cBool){
                val = arg0.tocNumber().getValue();
            }
            else if ( arg0 instanceof cRef || arg0 instanceof cRef3D ){
                val = arg0.getValue();
                if(val instanceof cError)return this.setCA(val,true);
                else if( val instanceof cNumber || val instanceof cBool ){
                    val = arg0.tocNumber().getValue();
                }
                else{
                    return this.setCA(new cError( cErrorType.wrong_value_type ),true);
                }
            }
            else if(arg0 instanceof cString){
                val = arg0.tocNumber();
                if(val instanceof cError || val instanceof cEmpty ){
                    var d = new Date( arg0.getValue() );
                    if( isNaN(d) ){
                        d = g_oFormatParser.parseDate(arg0.getValue());
                        if( d == null ){
                            return this.setCA(new cError( cErrorType.wrong_value_type ),true);
                        }
                        val = d.value ;
                    }
                    else
                        val = ( d.getTime()/1000 - d.getTimezoneOffset()*60 )/c_sPerDay+( c_DateCorrectConst + (g_bDate1904?0:1) );
                }
                else {
                    val = arg0.tocNumber().getValue();
                }
            }
            if(val < 0)
                return this.setCA(new cError( cErrorType.not_numeric ),true);
            else							 //1		 2 3 4					   4	3		 	 					2 1
                return this.setCA(  new cNumber( parseInt( ( ( val-Math.floor(val) )*24 ).toFixed(cExcelDateTimeDigits) ) ) ,true,0);
        }
        r.getInfo = function(){
            return {
                name:this.name,
                args:"( time-value )"
            };
        }
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    'MINUTE' : function(){
        var r = new cBaseFunction("MINUTE");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function(arg){
            var arg0 = arg[0],val;
            if( arg0 instanceof cArray ){
                arg0 = arg0.getElement(0);
            }
            else if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
                arg0 = arg0.cross(arguments[1].first).tocNumber();
            }

            if(arg0 instanceof cError) return this.setCA(arg0,true);
            else if( arg0 instanceof cNumber || arg0 instanceof cBool){
                val = arg0.tocNumber().getValue();
            }
            else if ( arg0 instanceof cRef || arg0 instanceof cRef3D ){
                val = arg0.getValue();
                if(val instanceof cError) return this.setCA( val ,true);
                else if( val instanceof cNumber || val instanceof cBool ){
                    val = arg0.tocNumber().getValue();
                }
                else{
                    return this.setCA( new cError( cErrorType.wrong_value_type ) ,true);
                }
            }
            else if(arg0 instanceof cString){
                val = arg0.tocNumber();
                if(val instanceof cError || val instanceof cEmpty ){
                    var d = new Date( arg0.getValue() );
                    if( isNaN(d) ){
                        d = g_oFormatParser.parseDate(arg0.getValue());
                        if( d == null ){
                            return this.setCA( new cError( cErrorType.wrong_value_type ) ,true);
                        }
                        val = d.value ;
                    }
                    else
                        val = ( d.getTime()/1000 - d.getTimezoneOffset()*60 )/c_sPerDay+( c_DateCorrectConst + (g_bDate1904?0:1) );
                }
                else {
                    val = arg0.tocNumber().getValue();
                }
            }
            if(val < 0)
                return this.setCA( new cError( cErrorType.not_numeric ) ,true);
            else{
                val = parseInt(( ( val*24-Math.floor(val*24) ) * 60 ).toFixed(cExcelDateTimeDigits)) % 60;
                return this.setCA( new cNumber( val ) ,true,0);
            }
        }
        r.getInfo = function(){
            return {
                name:this.name,
                args:"( time-value )"
            };
        }
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    'MONTH' : function(){
        var r = new cBaseFunction("MONTH");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function(arg){
            var arg0 = arg[0],val;
            if( arg0 instanceof cArray ){
                arg0 = arg0.getElement(0);
            }
            else if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
                arg0 = arg0.cross(arguments[1].first).tocNumber();
            }

            if(arg0 instanceof cError) return this.setCA( arg0 ,true);
            else if( arg0 instanceof cNumber || arg0 instanceof cBool){
                val = arg0.tocNumber().getValue();
            }
            else if ( arg0 instanceof cRef || arg0 instanceof cRef3D ){
                val = arg0.getValue();
                if(val instanceof cError) return this.setCA( val ,true);
                else if( val instanceof cNumber || val instanceof cBool ){
                    val = arg0.tocNumber().getValue();
                }
                else{
                    return this.setCA( new cError( cErrorType.wrong_value_type ) ,true);
                }
            }
            else if(arg0 instanceof cString){
                val = arg0.tocNumber();
                if(val instanceof cError || val instanceof cEmpty ){
                    var d = new Date( arg0.getValue() );
                    if( isNaN(d) ){
                        return this.setCA( new cError( cErrorType.wrong_value_type ) ,true);
                    }
                    else
                        val = Math.floor( ( d.getTime()/1000 - d.getTimezoneOffset()*60 )/c_sPerDay+( c_DateCorrectConst + (g_bDate1904?0:1) ) );
                }
                else {
                    val = arg0.tocNumber().getValue();
                }
            }
            if(val < 0)
                return this.setCA( new cError( cErrorType.not_numeric ) ,true);
            else
            if(!g_bDate1904){
                if( val == 60 )
                    return this.setCA( new cNumber( 2 ) ,true,0);
                else
                    return this.setCA( new cNumber( ( new Date( ( (val==0?1:val) - c_DateCorrectConst ) * c_msPerDay) ).getUTCMonth() + 1 ) ,true,0);
            }
            else
                return this.setCA( new cNumber( ( new Date( ( (val==0?1:val) - c_DateCorrectConst ) * c_msPerDay) ).getUTCMonth() + 1 ) ,true,0);
        }
        r.getInfo = function(){
            return {
                name:this.name,
                args:"( date-value )"
            };
        }
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    'NETWORKDAYS' : function(){
        var r = new cBaseFunction("NETWORKDAYS");
        r.setArgumentsMin(2);
        r.setArgumentsMax(3);
        r.Calculate = function(arg){
            var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arrDateIncl = [];

            if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
                arg0 = arg0.cross(arguments[1].first);
            }
            else if( arg0 instanceof cArray ){
                arg0 = arg0.getElementRowCol(0,0);
            }

            if ( arg1 instanceof cArea || arg1 instanceof cArea3D ){
                arg1 = arg1.cross(arguments[1].first);
            }
            else if( arg1 instanceof cArray ){
                arg1 = arg1.getElementRowCol(0,0);
            }

            arg0 = arg0.tocNumber();
            arg1 = arg1.tocNumber();

            if( arg0 instanceof cError) return this.value = arg0;
            if( arg1 instanceof cError) return this.value = arg1;

            var val0 = arg0.getValue(), val1 = arg1.getValue(), dif, count = 0;

            if(val0 < 0)
                return this.setCA(new cError( cErrorType.not_numeric ),true);
            else if(!g_bDate1904){
                if( val0 < 60 )
                    val0 = new Date((val0-c_DateCorrectConst)*c_msPerDay);
                else if( val0 == 60 )
                    val0 = new Date((val0-c_DateCorrectConst-1)*c_msPerDay);
                else
                    val0 = new Date((val0-c_DateCorrectConst-1)*c_msPerDay);
            }
            else
                val0 = new Date((val0-c_DateCorrectConst)*c_msPerDay);

            if(val1 < 0)
                return this.setCA(new cError( cErrorType.not_numeric ),true);
            else if(!g_bDate1904){
                if( val1 < 60 )
                    val1 = new Date((val1-c_DateCorrectConst)*c_msPerDay);
                else if( val1 == 60 )
                    val1 = new Date((val1-c_DateCorrectConst-1)*c_msPerDay);
                else
                    val1 = new Date((val1-c_DateCorrectConst-1)*c_msPerDay);
            }
            else
                val1 = new Date((val1-c_DateCorrectConst)*c_msPerDay);

            var holidays = [];

            if( arg2 ){
                if( arg2 instanceof cArea || arg2 instanceof cArea3D ){
                    var arr = arg2.getValue();
                    for(var i = 0; i < arr.length; i++){
                        if( arr[i] instanceof cNumber && arr[i].getValue() >= 0 ){
                            holidays.push(arr[i]);
                        }
                    }
                }
                else if( arg2 instanceof cArray ){
                    arg2.foreach(function(elem,r,c){
                        if( elem instanceof cNumber ){
                            holidays.push(elem);
                        }
                        else if( elem instanceof cString ){
                            var res = g_oFormatParser.parse(elem.getValue());
                            if( res && res.bDateTime && res.value >= 0 )
                                holidays.push( new cNumber(parseInt(res.value)) );
                        }
                    })
                }
            }

            for(var i = 0; i < holidays.length; i++ ){
                if(!g_bDate1904){
                    if( holidays[i].getValue() < 60 )
                        holidays[i] = new Date((holidays[i].getValue()-c_DateCorrectConst)*c_msPerDay);
                    else if( holidays[i] == 60 )
                        holidays[i] = new Date((holidays[i].getValue()-c_DateCorrectConst-1)*c_msPerDay);
                    else
                        holidays[i] = new Date((holidays[i].getValue()-c_DateCorrectConst-1)*c_msPerDay);
                }
                else
                    holidays[i] = new Date((holidays[i].getValue()-c_DateCorrectConst)*c_msPerDay);
            }

            function includeInHolidays(date){
                for(var i = 0; i < holidays.length; i++ ){
                    if( date.getTime() == holidays[i].getTime() )
                        return false;
                }
                return true;
            }

            dif = ( val1 - val0 ) / c_msPerDay;
            for(var i = 0; i < Math.abs(dif); i++ ){
                var date = new Date( val0 );
                date.setDate(val0.getDate()+i) ;
                if( date.getDay() != 5 && date.getDay() != 6 && includeInHolidays(date) )
                    count++;
            }


            return this.value = new cNumber( (dif<0?-1:1)*count );
        }
        r.getInfo = function(){
            return {
                name:this.name,
                args:"( start-date , end-date [ , holidays ] )"
            };
        }
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    'NETWORKDAYS.INTL' : function(){
        var r = new cBaseFunction("NETWORKDAYS.INTL");
        return r;
    },
    'NOW' : function(){
        var r = new cBaseFunction("NOW");
        r.setArgumentsMin(0);
        r.setArgumentsMax(0);
        r.Calculate = function(){
            var d = new Date();
            this.value = new cNumber( Math.floor( ( d.getTime()/1000 - d.getTimezoneOffset()*60 )/c_sPerDay+(c_DateCorrectConst+1) ) + ( (d.getHours()*60*60+d.getMinutes()*60+d.getSeconds())/c_sPerDay ) );
            this.value.numFormat = 22;
            return this.setCA( this.value ,true);
        }
        r.getInfo = function(){
            return {
                name:this.name,
                args:"()"
            };
        }
        return r;
    },
    'SECOND' : function(){
        var r = new cBaseFunction("SECOND");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function(arg){
            var arg0 = arg[0],val;
            if( arg0 instanceof cArray ){
                arg0 = arg0.getElement(0);
            }
            else if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
                arg0 = arg0.cross(arguments[1].first).tocNumber();
            }

            if(arg0 instanceof cError) return this.setCA( arg0 ,true);
            else if( arg0 instanceof cNumber || arg0 instanceof cBool){
                val = arg0.tocNumber().getValue();
            }
            else if ( arg0 instanceof cRef || arg0 instanceof cRef3D ){
                val = arg0.getValue();
                if(val instanceof cError) return this.setCA( val ,true);
                else if( val instanceof cNumber || val instanceof cBool ){
                    val = arg0.tocNumber().getValue();
                }
                else{
                    return this.setCA( new cError( cErrorType.wrong_value_type ) ,true);
                }
            }
            else if(arg0 instanceof cString){
                val = arg0.tocNumber();
                if(val instanceof cError || val instanceof cEmpty ){
                    var d = new Date( arg0.getValue() );
                    if( isNaN(d) ){
                        d = g_oFormatParser.parseDate(arg0.getValue());
                        if( d == null ){
                            return this.setCA( new cError( cErrorType.wrong_value_type ) ,true);
                        }
                        val = d.value ;
                    }
                    else
                        val = ( d.getTime()/1000 - d.getTimezoneOffset()*60 )/c_sPerDay+( c_DateCorrectConst + (g_bDate1904?0:1) );
                }
                else {
                    val = arg0.tocNumber().getValue();
                }
            }
            if(val < 0)
                return this.setCA( new cError( cErrorType.not_numeric ) ,true);
            else{
                val = parseInt((( val*24*60-Math.floor(val*24*60) ) * 60).toFixed(cExcelDateTimeDigits)) % 60;
                return this.setCA( new cNumber( val ) ,true,0);
            }
        }
        r.getInfo = function(){
            return {
                name:this.name,
                args:"( time-value )"
            };
        }
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    'TIME' : function(){
        var r = new cBaseFunction("TIME");
        r.setArgumentsMin(3);
        r.setArgumentsMax(3);
        //to excel (hh*60*60+mm*60+ss)/c_sPerDay (c_sPerDay the number of seconds in a day)
        r.Calculate = function(arg){
            var hour,minute,second;
            for (var i = 0; i<this.argumentsCurrent;i++){
                var arg0 = arg[i];
                if( arg0 instanceof cArray ){
                    arg0 = arg0.getElement(0);
                }
                else if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
                    arg0 = arg0.cross(arguments[1].first).tocNumber();
                }

                if(arg0 instanceof cError) return this.setCA( arg0 ,true);
                else if( arg0 instanceof cNumber || arg0 instanceof cBool){
                    if(i==0)hour = arg0.tocNumber().getValue();
                    if(i==1)minute = arg0.tocNumber().getValue();
                    if(i==2)second = arg0.tocNumber().getValue();
                }
                else if ( arg0 instanceof cRef || arg0 instanceof cRef3D ){
                    var val = arg0.getValue();
                    if(val instanceof cError) return this.setCA( val ,true);
                    else if( val instanceof cNumber || val instanceof cBool ){
                        if(i==0)hour = arg0.tocNumber().getValue();
                        if(i==1)minute = arg0.tocNumber().getValue();
                        if(i==2)second = arg0.tocNumber().getValue();
                    }
                    else{
                        return this.setCA( new cError( cErrorType.wrong_value_type ) ,true);
                    }
                }
                else if(arg0 instanceof cString || arg0 instanceof cEmpty){
                    var val = arg0.tocNumber();
                    if(val instanceof cError) return this.setCA( val ,true);
                    else {
                        if(i==0)hour = arg0.tocNumber().getValue();
                        if(i==1)minute = arg0.tocNumber().getValue();
                        if(i==2)second = arg0.tocNumber().getValue();
                    }
                }
            }
            var v = (hour*60*60+minute*60+second)/c_sPerDay;
            this.setCA( new cNumber( v - Math.floor(v) ) ,true);
            if( arguments[1].getNumFormatStr().toLowerCase() === "general" )
                this.value.numFormat = 18;
            return this.value;
        }
        r.getInfo = function(){
            return {
                name:this.name,
                args:"( hour, minute, second )"
            };
        }
        return r;
    },
    'TIMEVALUE' : function(){
        var r = new cBaseFunction("TIMEVALUE");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function(arg){
            var arg0 = arg[0];

            if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
                arg0 = arg0.cross(arguments[1].first);
            }
            else if( arg0 instanceof cArray ){
                arg0 = arg0.getElementRowCol(0,0);
            }

            arg0 = arg0.tocString();

            if ( arg0 instanceof cError )
                return this.value = arg0;

            if( arg0.tocNumber() instanceof cNumber && arg0.tocNumber().getValue() > 0 )
                return this.value = new cNumber( parseInt(arg0.tocNumber().getValue()) );

            var res = g_oFormatParser.parse(arg0.getValue());

            if( res && res.bDateTime )
                return this.value = new cNumber( res.value - parseInt(res.value) );
            else
                return this.value = new cError( cErrorType.wrong_value_type );
        }
        r.getInfo = function(){
            return {
                name:this.name,
                args:"( date-time-string )"
            };
        }
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    'TODAY' : function(){
        var r = new cBaseFunction("TODAY");
        r.setArgumentsMin(0);
        r.setArgumentsMax(0);
        r.Calculate = function(){
            var d = new Date();
            //						1			2 3												3		4					  5				   5 4 2 1
            this.setCA(  new cNumber( Math.floor( ( d.getTime()/1000 - d.getTimezoneOffset()*60 )/c_sPerDay+( c_DateCorrectConst + (g_bDate1904?0:1) ) ) ) ,true);
            if( arguments[1].getNumFormatStr().toLowerCase() === "general" )
                this.value.numFormat = 14;
            return this.value;
        }
        r.getInfo = function(){
            return {
                name:this.name,
                args:"()"
            };
        }
        return r;
        //Math.floor(((new Date()).getTime()/1000)/c_sPerDay+(c_DateCorrectConst+1)) from UTC-timestamp to excel 2010
    },
    'WEEKDAY' : function(){
        var r = new cBaseFunction("WEEKDAY");
        r.setArgumentsMin(1);
        r.setArgumentsMax(2);
        r.Calculate = function(arg){
            var arg0 = arg[0], arg1 = arg[1] ? arg[1] : new cNumber(1);

            if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
                arg0 = arg0.cross(arguments[1].first);
            }
            else if( arg0 instanceof cArray ){
                arg0 = arg0.getElementRowCol(0,0);
            }

            if ( arg1 instanceof cArea || arg1 instanceof cArea3D ){
                arg1 = arg1.cross(arguments[1].first);
            }
            else if( arg1 instanceof cArray ){
                arg1 = arg1.getElementRowCol(0,0);
            }

            arg0 = arg0.tocNumber();
            arg1 = arg1.tocNumber();

            if ( arg0 instanceof cError )
                return this.value = arg0;

            if ( arg1 instanceof cError )
                return this.value = arg1;

            var weekday;

            switch (arg1.getValue()){
                case 1: /* 1 (Sunday) through 7 (Saturday)  */
                case 17:/* 1 (Sunday) through 7 (Saturday) */
                    weekday = [1, 2, 3, 4, 5, 6, 7];
                    break;
                case 2: /* 1 (Monday) through 7 (Sunday)    */
                case 11:/* 1 (Monday) through 7 (Sunday)    */
                    weekday = [7, 1, 2, 3, 4, 5, 6];
                    break;
                case 3: /* 0 (Monday) through 6 (Sunday)    */
                    weekday = [ 6, 0, 1, 2, 3, 4, 5];
                    break;
                case 12:/* 1 (Tuesday) through 7 (Monday)   */
                    weekday = [6, 7, 1, 2, 3, 4, 5];
                    break;
                case 13:/* 1 (Wednesday) through 7 (Tuesday) */
                    weekday = [5, 6, 7, 1, 2, 3, 4];
                    break;
                case 14:/* 1 (Thursday) through 7 (Wednesday) */
                    weekday = [ 4, 5, 6, 7, 1, 2, 3];
                    break;
                case 15:/* 1 (Friday) through 7 (Thursday) */
                    weekday = [3, 4, 5, 6, 7, 1, 2];
                    break;
                case 16:/* 1 (Saturday) through 7 (Friday) */
                    weekday = [2, 3, 4, 5, 6, 7, 1];
                    break;
                default:
                    return this.value = new cError( cErrorType.not_numeric );
            }
            if( arg0.getValue() < 0 )
                return this.value = new cError( cErrorType.wrong_value_type );

            return this.value = new cNumber( weekday[new Date((arg0.getValue()-(c_DateCorrectConst+1))*c_msPerDay).getDay()] );
        }
        r.getInfo = function(){
            return {
                name:this.name,
                args:"( serial-value [ , weekday-start-flag ] )"
            };
        }
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    'WEEKNUM' : function(){
        var r = new cBaseFunction("WEEKNUM");
        //var d = new Date(), iso = [6,7,8,9,10,4,5]; console.log(d); var b = new Date(d.getFullYear(), 0, 1); var c = ((d-b)/(86400000)+iso[b.getDay()])/7; console.log(c)
        r.setArgumentsMin(1);
        r.setArgumentsMax(2);
        r.Calculate = function(arg){
            var arg0 = arg[0], arg1 = arg[1] ? arg[1] : new cNumber(1), type = 0;
            function WeekNumber(dt,iso,type){
                dt.setHours(0,0,0);
                var startOfYear = new Date(dt.getFullYear(), 0, 1);
                var endOfYear = new Date(dt);
                endOfYear.setMonth(11);
                endOfYear.setDate(31);
                var wk = parseInt(((dt-startOfYear)/c_msPerDay+iso[startOfYear.getDay()])/7);
                if(type)
                    switch (wk){
                        case 0:
                            // Возвращаем номер недели от 31 декабря предыдущего года
                            startOfYear.setDate(0);
                            return WeekNumber(startOfYear,iso,type);
                        case 53:
                            // Если 31 декабря выпадает до четверга 1 недели следующего года
                            if (endOfYear.getDay() < 4)
                                return new cNumber(1);
                            else
                                return new cNumber(wk);
                        default:
                            return new cNumber(wk);
                    }
                else{
                    wk = parseInt(((dt-startOfYear)/c_msPerDay+iso[startOfYear.getDay()]+7)/7);
                    return new cNumber(wk);
                }
            }

            if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
                arg0 = arg0.cross(arguments[1].first);
            }
            else if( arg0 instanceof cArray ){
                arg0 = arg0.getElementRowCol(0,0);
            }

            if ( arg1 instanceof cArea || arg1 instanceof cArea3D ){
                arg1 = arg1.cross(arguments[1].first);
            }
            else if( arg1 instanceof cArray ){
                arg1 = arg1.getElementRowCol(0,0);
            }

            arg0 = arg0.tocNumber();
            arg1 = arg1.tocNumber();

            if ( arg0 instanceof cError )
                return this.value = arg0;

            if ( arg1 instanceof cError )
                return this.value = arg1;

            if( arg0.getValue() < 0 )
                return this.value = new cError( cErrorType.not_numeric );

            var weekdayStartDay;

            switch (arg1.getValue()){
                case 1: /* 1 (Sunday) through 7 (Saturday)  */
                case 17:/* 1 (Sunday) through 7 (Saturday) */
                    weekdayStartDay = [0,1,2,3,4,5,6];
                    break;
                case 2: /* 1 (Monday) through 7 (Sunday)    */
                case 11:/* 1 (Monday) through 7 (Sunday)    */
                      weekdayStartDay = [6,0,1,2,3,4,5];
                    break;
                case 12:/* 1 (Tuesday) through 7 (Monday)   */
                    weekdayStartDay = [5,6,0,1,2,3,4];
                    break;
                case 13:/* 1 (Wednesday) through 7 (Tuesday) */
                    weekdayStartDay = [4,5,6,0,1,2,3];
                    break;
                case 14:/* 1 (Thursday) through 7 (Wednesday) */
                    weekdayStartDay = [3,4,5,6,0,1,2];
                    break;
                case 15:/* 1 (Friday) through 7 (Thursday) */
                    weekdayStartDay = [2,3,4,5,6,0,1];
                    break;
                case 16:/* 1 (Saturday) through 7 (Friday) */
                    weekdayStartDay = [1,2,3,4,5,6,0];
                    break;
                case 21:
                    weekdayStartDay = [6,7,8,9,10,4,5];
//                { 6, 7, 8, 9, 10, 4, 5 }
                    type = 1;
                    break;
                default:
                    return this.value = new cError( cErrorType.not_numeric );
            }

            return this.value = new cNumber(WeekNumber(new Date((arg0.getValue()-(c_DateCorrectConst+1))*c_msPerDay),weekdayStartDay,type));

        }
        r.getInfo = function(){
            return {
                name:this.name,
                args:"( serial-value [ , weekday-start-flag ] )"
            };
        }
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    'WORKDAY' : function(){
        var r = new cBaseFunction("WORKDAY");
        r.setArgumentsMin(2);
        r.setArgumentsMax(3);
        r.Calculate = function(arg){
            var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arrDateIncl = [];

            if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
                arg0 = arg0.cross(arguments[1].first);
            }
            else if( arg0 instanceof cArray ){
                arg0 = arg0.getElementRowCol(0,0);
            }

            if ( arg1 instanceof cArea || arg1 instanceof cArea3D ){
                arg1 = arg1.cross(arguments[1].first);
            }
            else if( arg1 instanceof cArray ){
                arg1 = arg1.getElementRowCol(0,0);
            }

            arg0 = arg0.tocNumber();
            arg1 = arg1.tocNumber();

            if( arg0 instanceof cError) return this.value = arg0;
            if( arg1 instanceof cError) return this.value = arg1;

            var val0 = arg0.getValue(), val1 = arg1.getValue(),  holidays = []

            if(val0 < 0)
                return this.setCA(new cError( cErrorType.not_numeric ),true);
            else if(!g_bDate1904){
                if( val0 < 60 )
                    val0 = new Date((val0-c_DateCorrectConst)*c_msPerDay);
                else if( val0 == 60 )
                    val0 = new Date((val0-c_DateCorrectConst-1)*c_msPerDay);
                else
                    val0 = new Date((val0-c_DateCorrectConst-1)*c_msPerDay);
            }
            else
                val0 = new Date((val0-c_DateCorrectConst)*c_msPerDay);

            if( arg2 ){
                if( arg2 instanceof cArea || arg2 instanceof cArea3D ){
                    var arr = arg2.getValue();
                    for(var i = 0; i < arr.length; i++){
                        if( arr[i] instanceof cNumber && arr[i].getValue() >= 0 ){
                            holidays.push(arr[i]);
                        }
                    }
                }
                else if( arg2 instanceof cArray ){
                    arg2.foreach(function(elem,r,c){
                        if( elem instanceof cNumber ){
                            holidays.push(elem);
                        }
                        else if( elem instanceof cString ){
                            var res = g_oFormatParser.parse(elem.getValue());
                            if( res && res.bDateTime && res.value >= 0 )
                                holidays.push( new cNumber(parseInt(res.value)) );
                        }
                    })
                }
            }

            for(var i = 0; i < holidays.length; i++ ){
                if(!g_bDate1904){
                    if( holidays[i].getValue() < 60 )
                        holidays[i] = new Date((holidays[i].getValue()-c_DateCorrectConst)*c_msPerDay);
                    else if( holidays[i] == 60 )
                        holidays[i] = new Date((holidays[i].getValue()-c_DateCorrectConst-1)*c_msPerDay);
                    else
                        holidays[i] = new Date((holidays[i].getValue()-c_DateCorrectConst-1)*c_msPerDay);
                }
                else
                    holidays[i] = new Date((holidays[i].getValue()-c_DateCorrectConst)*c_msPerDay);
            }

            function notAHolidays(date){
                for(var i = 0; i < holidays.length; i++ ){
                    if( date.getTime() == holidays[i].getTime() )
                        return false;
                }
                return true;
            }

            var dif = arg1.getValue(), count = 1, dif1 = dif>0?1:dif<0?-1:0, val, date = val0;
            while( Math.abs(dif) > count ){
                date = new Date( val0.getTime() + dif1*c_msPerDay );
                if( date.getDay() != 6 && date.getDay() != 0 && notAHolidays(date) )
                    count++;
                dif>=0?dif1++:dif1--;
            }
            date = new Date( val0.getTime() + dif1*c_msPerDay );
            val = parseInt(( date.getTime()/1000 - date.getTimezoneOffset()*60 )/c_sPerDay+( c_DateCorrectConst + (g_bDate1904?0:1) ));

            if( val < 0 )
                return this.setCA(new cError( cErrorType.not_numeric ),true);

            if( arguments[1].getNumFormatStr().toLowerCase() === "general" )
                return this.setCA( new cNumber( val ) ,true,14);
            else
                return this.setCA( new cNumber( val ) ,true);
        }
        r.getInfo = function(){
            return {
                name:this.name,
                args:"( start-date , day-offset [ , holidays ] )"
            };
        }
        // r.setFormat(r.formatType.noneFormat);
        return r;
    },
    'WORKDAY.INTL' : function(){
        var r = new cBaseFunction("WORKDAY.INTL");
        return r;
    },
    'YEAR' : function(){
        var r = new cBaseFunction("YEAR");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function(arg){
            var arg0 = arg[0],val;
            if( arg0 instanceof cArray ){
                arg0 = arg0.getElement(0);
            }
            else if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
                arg0 = arg0.cross(arguments[1].first).tocNumber();
            }

            if(arg0 instanceof cError) return this.setCA( arg0 ,true);
            else if( arg0 instanceof cNumber || arg0 instanceof cBool){
                val = arg0.tocNumber().getValue();
            }
            else if ( arg0 instanceof cArea || arg0 instanceof cArea3D ){
                return this.setCA( new cError( cErrorType.wrong_value_type ) ,true);
            }
            else if ( arg0 instanceof cRef || arg0 instanceof cRef3D ){
                val = arg0.getValue();
                if(val instanceof cError) return this.setCA( val ,true);
                else if( val instanceof cNumber || val instanceof cBool ){
                    val = arg0.tocNumber().getValue();
                }
                else{
                    return this.setCA( new cError( cErrorType.wrong_value_type ) ,true);
                }
            }
            else if(arg0 instanceof cString){
                val = arg0.tocNumber();
                if(val instanceof cError || val instanceof cEmpty ){
                    var d = new Date( arg0.getValue() );
                    if( isNaN(d) ){
                        return this.setCA( new cError( cErrorType.wrong_value_type ) ,true);
                    }
                    else
                        val = Math.floor( ( d.getTime()/1000 - d.getTimezoneOffset()*60 )/c_sPerDay+( c_DateCorrectConst + (g_bDate1904?0:1) ) );
                }
                else {
                    val = arg0.tocNumber().getValue();
                }
            }
            if(val < 0)
                return this.setCA( new cError( cErrorType.not_numeric ) ,true,0);
            else
                return this.setCA( new cNumber( (new Date((val-(c_DateCorrectConst+1))*c_msPerDay)).getUTCFullYear() ) ,true,0);
        }
        r.getInfo = function(){
            return {
                name:this.name,
                args:"( date-value )"
            };
        }
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    'YEARFRAC' : function(){
        var r = new cBaseFunction("YEARFRAC");
        return r;
    }
}