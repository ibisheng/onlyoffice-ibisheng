$( function () {

    function toFixed( n ) {
        return n//.toFixed( AscCommonExcel.cExcelSignificantDigits ) - 0;
    }

    function difBetween( a, b ) {
        return Math.abs( a - b ) < dif
    }

    function _getPMT( fZins, fZzr, fBw, fZw, nF ){
        var fRmz;
        if( fZins == 0.0 )
            fRmz = ( fBw + fZw ) / fZzr;
        else{
            var	fTerm = Math.pow( 1.0 + fZins, fZzr );
            if( nF > 0 )
                fRmz = ( fZw * fZins / ( fTerm - 1.0 ) + fBw * fZins / ( 1.0 - 1.0 / fTerm ) ) / ( 1.0 + fZins );
            else
                fRmz = fZw * fZins / ( fTerm - 1.0 ) + fBw * fZins / ( 1.0 - 1.0 / fTerm );
        }

        return -fRmz;
    }

    function _getFV( fZins, fZzr, fRmz, fBw, nF ){
        var fZw;
        if( fZins == 0.0 )
            fZw = fBw + fRmz * fZzr;
        else{
            var fTerm = Math.pow( 1.0 + fZins, fZzr );
            if( nF > 0 )
                fZw = fBw * fTerm + fRmz * ( 1.0 + fZins ) * ( fTerm - 1.0 ) / fZins;
            else
                fZw = fBw * fTerm + fRmz * ( fTerm - 1.0 ) / fZins;
        }

        return -fZw;
    }

    function _getDDB( cost, salvage, life, period, factor ) {
        var ddb, ipmt, oldCost, newCost;
        ipmt = factor / life;
        if ( ipmt >= 1 ) {
            ipmt = 1;
            if ( period == 1 )
                oldCost = cost;
            else
                oldCost = 0;
        }
        else
            oldCost = cost * Math.pow( 1 - ipmt, period - 1 );
        newCost = cost * Math.pow( 1 - ipmt, period );

        if ( newCost < salvage )
            ddb = oldCost - salvage;
        else
            ddb = oldCost - newCost;
        if ( ddb < 0 )
            ddb = 0;
        return ddb;
    }

    function _getIPMT(rate, per, pv, type, pmt) {
        var ipmt;

        if ( per == 1 ) {
            if ( type > 0 )
                ipmt = 0;
            else
                ipmt = -pv;
        }
        else {
            if ( type > 0 )
                ipmt = _getFV( rate, per - 2, pmt, pv, 1 ) - pmt;
            else
                ipmt = _getFV( rate, per - 1, pmt, pv, 0 );
        }
        return ipmt * rate
    }

    function _diffDate(d1, d2, mode){
        var date1 = d1.getDate(),
            month1 = d1.getMonth(),
            year1 = d1.getFullYear(),
            date2 = d2.getDate(),
            month2 = d2.getMonth(),
            year2 = d2.getFullYear();

        switch ( mode ) {
            case 0:
                return Math.abs( GetDiffDate360( date1, month1, year1, date2, month2, year2, true ) );
            case 1:
                var yc = Math.abs( year2 - year1 ),
                    sd = year1 > year2 ? d2 : d1,
                    yearAverage = sd.isLeapYear() ? 366 : 365, dayDiff = Math.abs( d2 - d1 );
                for ( var i = 0; i < yc; i++ ) {
                    sd.addYears( 1 );
                    yearAverage += sd.isLeapYear() ? 366 : 365;
                }
                yearAverage /= (yc + 1);
                dayDiff /= c_msPerDay;
                return dayDiff;
            case 2:
                var dayDiff = Math.abs( d2 - d1 );
                dayDiff /= c_msPerDay;
                return dayDiff;
            case 3:
                var dayDiff = Math.abs( d2 - d1 );
                dayDiff /= c_msPerDay;
                return dayDiff;
            case 4:
                return Math.abs( GetDiffDate360( date1, month1, year1, date2, month2, year2, false ) );
            default:
                return "#NUM!";
        }
    }

    function _yearFrac(d1, d2, mode) {
        var date1 = d1.getDate(),
            month1 = d1.getMonth()+1,
            year1 = d1.getFullYear(),
            date2 = d2.getDate(),
            month2 = d2.getMonth()+1,
            year2 = d2.getFullYear();

        switch ( mode ) {
            case 0:
                return Math.abs( GetDiffDate360( date1, month1, year1, date2, month2, year2, true ) ) / 360;
            case 1:
                var yc = /*Math.abs*/( year2 - year1 ),
                    sd = year1 > year2 ? new Date(d2) : new Date(d1),
                    yearAverage = sd.isLeapYear() ? 366 : 365, dayDiff = /*Math.abs*/( d2 - d1 );
                for ( var i = 0; i < yc; i++ ) {
                    sd.addYears( 1 );
                    yearAverage += sd.isLeapYear() ? 366 : 365;
                }
                yearAverage /= (yc + 1);
                dayDiff /= (yearAverage * c_msPerDay);
                return dayDiff;
            case 2:
                var dayDiff = Math.abs( d2 - d1 );
                dayDiff /= (360 * c_msPerDay);
                return dayDiff;
            case 3:
                var dayDiff = Math.abs( d2 - d1 );
                dayDiff /= (365 * c_msPerDay);
                return dayDiff;
            case 4:
                return Math.abs( GetDiffDate360( date1, month1, year1, date2, month2, year2, false ) ) / 360;
            default:
                return "#NUM!";
        }
    }

    function _lcl_GetCouppcd(settl, matur, freq){
        matur.setFullYear( settl.getFullYear() );
        if( matur < settl )
            matur.addYears( 1 );
        while( matur > settl ){
            matur.addMonths( -12 / freq );
        }
    }

    function _lcl_GetCoupncd( settl, matur, freq ){
        matur.setFullYear( settl.getFullYear() );
        if( matur > settl )
            matur.addYears( -1 );
        while( matur <= settl ){
            matur.addMonths( 12 / freq );
        }
    }

    function _getcoupdaybs( settl, matur, frequency, basis ) {
        _lcl_GetCouppcd( settl, matur, frequency );
        return _diffDate( settl, matur, basis );
    }

    function _getcoupdays( settl, matur, frequency, basis ) {
        _lcl_GetCouppcd( settl, matur, frequency );
        var n = new Date( matur )
        n.addMonths( 12 / frequency );
        return _diffDate( matur, n, basis );
    }

    function _getdiffdate( d1,d2, nMode ){
        var bNeg = d1 > d2;

        if( bNeg )
        {
            var n = d2;
            d2 = d1;
            d1 = n;
        }

        var nRet,pOptDaysIn1stYear

        var nD1 = d1.getDate(),
            nM1 = d1.getMonth(),
            nY1  = d1.getFullYear(),
            nD2 = d2.getDate(),
            nM2 = d2.getMonth(),
            nY2 = d2.getFullYear();

        switch( nMode )
        {
            case 0:			// 0=USA (NASD) 30/360
            case 4:			// 4=Europe 30/360
            {
                var bLeap = d1.isLeapYear()
                var nDays, nMonths/*, nYears*/;

                nMonths = nM2 - nM1;
                nDays = nD2 - nD1;

                nMonths += ( nY2 - nY1 ) * 12;

                nRet = nMonths * 30 + nDays;
                if( nMode == 0 && nM1 == 2 && nM2 != 2 && nY1 == nY2 )
                    nRet -= bLeap? 1 : 2;

                pOptDaysIn1stYear = 360;
            }
                break;
            case 1:			// 1=exact/exact
                pOptDaysIn1stYear = d1.isLeapYear() ? 366 : 365;
                nRet = d2 - d1;
                break;
            case 2:			// 2=exact/360
                nRet = d2 - d1;
                pOptDaysIn1stYear = 360;
                break;
            case 3:			//3=exact/365
                nRet = d2 - d1;
                pOptDaysIn1stYear = 365;
                break;
        }

        return (bNeg ? -nRet : nRet) / c_msPerDay / pOptDaysIn1stYear;
    }

    function _getprice( nSettle, nMat, fRate, fYield, fRedemp, nFreq, nBase ){

        var fdays = AscCommonExcel.getcoupdays( new Date(nSettle), new Date(nMat), nFreq, nBase ),
            fdaybs = AscCommonExcel.getcoupdaybs( new Date(nSettle), new Date(nMat), nFreq, nBase ),
            fnum = AscCommonExcel.getcoupnum( new Date(nSettle), (nMat), nFreq, nBase ),
            fdaysnc = ( fdays - fdaybs ) / fdays,
            fT1 = 100 * fRate / nFreq,
            fT2 = 1 + fYield / nFreq,
            res = fRedemp / ( Math.pow( 1 + fYield / nFreq, fnum - 1 + fdaysnc ) );

        /*var fRet = fRedemp / ( Math.pow( 1.0 + fYield / nFreq, fnum - 1.0 + fdaysnc ) );
        fRet -= 100.0 * fRate / nFreq * fdaybs / fdays;

        var fT1 = 100.0 * fRate / nFreq;
        var fT2 = 1.0 + fYield / nFreq;

        for( var fK = 0.0 ; fK < fnum ; fK++ ){
            fRet += fT1 / Math.pow( fT2, fK + fdaysnc );
        }

        return fRet;*/

        if( fnum == 1){
            return (fRedemp + fT1) / (1 + fdaysnc * fYield / nFreq) - 100 * fRate / nFreq * fdaybs / fdays;
        }

        res -= 100 * fRate / nFreq * fdaybs / fdays;

        for ( var i = 0; i < fnum; i++ ) {
            res += fT1 / Math.pow( fT2, i + fdaysnc );
        }

        return res;
    }

    function _getYield( nSettle, nMat, fCoup, fPrice, fRedemp, nFreq, nBase ){
        var fRate = fCoup, fPriceN = 0.0, fYield1 = 0.0, fYield2 = 1.0;
        var fPrice1 = _getprice( nSettle, nMat, fRate, fYield1, fRedemp, nFreq, nBase );
        var fPrice2 = _getprice( nSettle, nMat, fRate, fYield2, fRedemp, nFreq, nBase );
        var fYieldN = ( fYield2 - fYield1 ) * 0.5;

        for( var nIter = 0 ; nIter < 100 && fPriceN != fPrice ; nIter++ )
        {
            fPriceN = _getprice( nSettle, nMat, fRate, fYieldN, fRedemp, nFreq, nBase );

            if( fPrice == fPrice1 )
                return fYield1;
            else if( fPrice == fPrice2 )
                return fYield2;
            else if( fPrice == fPriceN )
                return fYieldN;
            else if( fPrice < fPrice2 )
            {
                fYield2 *= 2.0;
                fPrice2 = _getprice( nSettle, nMat, fRate, fYield2, fRedemp, nFreq, nBase );

                fYieldN = ( fYield2 - fYield1 ) * 0.5;
            }
            else
            {
                if( fPrice < fPriceN )
                {
                    fYield1 = fYieldN;
                    fPrice1 = fPriceN;
                }
                else
                {
                    fYield2 = fYieldN;
                    fPrice2 = fPriceN;
                }

                fYieldN = fYield2 - ( fYield2 - fYield1 ) * ( ( fPrice - fPrice2 ) / ( fPrice1 - fPrice2 ) );
            }
        }

        if( Math.abs( fPrice - fPriceN ) > fPrice / 100.0 )
            return "#NUM!";		// result not precise enough

        return fYieldN;
    }

    function _getyieldmat( nSettle, nMat, nIssue, fRate, fPrice, nBase ){

        var fIssMat = _yearFrac( nIssue, nMat, nBase );
        var fIssSet = _yearFrac( nIssue, nSettle, nBase );
        var fSetMat = _yearFrac( nSettle, nMat, nBase );

        var y = 1.0 + fIssMat * fRate;
        y /= fPrice / 100.0 + fIssSet * fRate;
        y--;
        y /= fSetMat;

        return y;

    }

    function _coupnum( settlement, maturity, frequency, basis ) {

        basis = ( basis !== undefined ? basis : 0 );

        var n = new Date(maturity);
        _lcl_GetCouppcd( settlement, n, frequency );
        var nMonths = (maturity.getFullYear() - n.getFullYear()) * 12 + maturity.getMonth() - n.getMonth();
        return nMonths * frequency / 12 ;

    }

    function _duration( settlement, maturity, coupon, yld, frequency, basis ){
        var dbc = AscCommonExcel.getcoupdaybs(new Date( settlement ),new Date( maturity ),frequency,basis),
            coupD = AscCommonExcel.getcoupdays(new Date( settlement ),new Date( maturity ),frequency,basis),
            numCoup = AscCommonExcel.getcoupnum(new Date( settlement ),new Date( maturity ),frequency);

        if ( settlement >= maturity || basis < 0 || basis > 4 || ( frequency != 1 && frequency != 2 && frequency != 4 ) || yld < 0 || coupon < 0 ){
            return "#NUM!";
        }

        var duration = 0, p = 0;

        var dsc = coupD - dbc;
        var diff = dsc / coupD - 1;
        yld = yld / frequency + 1;


        coupon *= 100/frequency;

        for(var index = 1; index <= numCoup; index++ ){
            var di = index + diff;

            var yldPOW = Math.pow( yld, di);

            duration += di * coupon / yldPOW;

            p += coupon / yldPOW;
        }

        duration += (diff + numCoup) * 100 / Math.pow( yld, diff + numCoup);
        p += 100 / Math.pow( yld, diff + numCoup);

        return duration / p / frequency ;
    }

    var c_msPerDay = AscCommonExcel.c_msPerDay;
    var parserFormula = AscCommonExcel.parserFormula;
    var GetDiffDate360 = AscCommonExcel.GetDiffDate360;
    var bDate1904 = AscCommon.bDate1904;
    var fSortAscending = AscCommon.fSortAscending;
    var g_oIdCounter = AscCommon.g_oIdCounter;

    var oParser, wb, ws, dif = 1e-9,
        data = getTestWorkbook(),
        sData = data + "", tmp;
    if ( AscCommon.c_oSerFormat.Signature === sData.substring( 0, AscCommon.c_oSerFormat.Signature.length ) ) {
        var sUrlPath = "offlinedocs/";
        wb = new AscCommonExcel.Workbook( new AscCommonExcel.asc_CHandlersList(), {wb:{getWorksheet:function(){}}} );
        AscCommon.History.init(wb);

        AscCommon.g_oTableId.init();
        if ( this.User )
            g_oIdCounter.Set_UserId(this.User.asc_getId());

        AscCommonExcel.g_oUndoRedoCell = new AscCommonExcel.UndoRedoCell(wb);
        AscCommonExcel.g_oUndoRedoWorksheet = new AscCommonExcel.UndoRedoWoorksheet(wb);
        AscCommonExcel.g_oUndoRedoWorkbook = new AscCommonExcel.UndoRedoWorkbook(wb);
        AscCommonExcel.g_oUndoRedoCol = new AscCommonExcel.UndoRedoRowCol(wb, false);
        AscCommonExcel.g_oUndoRedoRow = new AscCommonExcel.UndoRedoRowCol(wb, true);
        AscCommonExcel.g_oUndoRedoComment = new AscCommonExcel.UndoRedoComment(wb);
        AscCommonExcel.g_oUndoRedoAutoFilters = new AscCommonExcel.UndoRedoAutoFilters(wb);
//        g_oUndoRedoGraphicObjects = new UndoRedoGraphicObjects(wb);
        g_oIdCounter.Set_Load(false);

        var oBinaryFileReader = new AscCommonExcel.BinaryFileReader();
        oBinaryFileReader.Read( sData, wb );
        ws = wb.getWorksheet( wb.getActive() );
        AscCommonExcel.getFormulasInfo();
    }

    /*QUnit.log( function ( details ) {
        console.log( "Log: " + details.name + ", result - " + details.result );
    } );*/

    module( "Formula" );

    test( "Test: \"Absolute reference\"", function () {

        ws.getRange2( "A7" ).setValue( "1" );
        ws.getRange2( "A8" ).setValue( "2" );
        ws.getRange2( "A9" ).setValue( "3" );
        oParser = new parserFormula( 'A$7+A8', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3 );

        oParser = new parserFormula( 'A$7+A$8', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3 );

        oParser = new parserFormula( '$A$7+$A$8', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3 );

        oParser = new parserFormula( 'SUM($A$7:$A$9)', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 6 );
    } )

	test( "Test: \"Parse intersection\"", function () {

		ws.getRange2( "A7" ).setValue( "1" );
		ws.getRange2( "A8" ).setValue( "2" );
		ws.getRange2( "A9" ).setValue( "3" );
		oParser = new parserFormula( '1     +    (    A7   +A8   )   *   2', "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.assemble(), "1+(A7+A8)*2" );
		strictEqual( oParser.calculate().getValue(), 7 );

		oParser = new parserFormula( 'sum                    A1:A5', "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.assemble(), "sum A1:A5" );
		strictEqual( oParser.calculate().getValue(), "#VALUE!" );

		oParser = new parserFormula( 'sum(   A1:A5    ,        B1:B5     )     ', "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.assemble(), "SUM(A1:A5,B1:B5)" );
		strictEqual( oParser.calculate().getValue(), 0 );

		oParser = new parserFormula( 'sum(   A1:A5    ,        B1:B5  , "    3 , 14 15 92 6 "   )     ', "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.assemble(), 'SUM(A1:A5,B1:B5,"    3 , 14 15 92 6 ")' );
		strictEqual( oParser.calculate().getValue(), "#VALUE!" );

	} )



    test( "Test: \"Arithmetical operations\"", function () {
        oParser = new parserFormula( '1+3', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 4 );

        oParser = new parserFormula( '(1+2)*4+3', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), (1 + 2) * 4 + 3 );

        oParser = new parserFormula( '2^52', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), Math.pow( 2, 52 ) );

        oParser = new parserFormula( '-10', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -10 );

        oParser = new parserFormula( '-10*2', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -20 );

        oParser = new parserFormula( '-10+10', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 0 );

        oParser = new parserFormula( '12%', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 0.12 );

        oParser = new parserFormula( "2<>\"3\"", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "TRUE", "2<>\"3\"" );

        oParser = new parserFormula( "2=\"3\"", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "FALSE", "2=\"3\"" );

        oParser = new parserFormula( "2>\"3\"", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "FALSE", "2>\"3\"" );

        oParser = new parserFormula( "\"f\">\"3\"", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "TRUE" );

        oParser = new parserFormula( "\"f\"<\"3\"", "A1", ws );
        ok( oParser.parse() );
        strictEqual( "FALSE", oParser.calculate().getValue(), "FALSE" );

        oParser = new parserFormula( "FALSE>=FALSE", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "TRUE" );

        oParser = new parserFormula( "\"TRUE\"&\"TRUE\"", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "TRUETRUE" );

        oParser = new parserFormula( "10*\"\"", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

        oParser = new parserFormula( "-TRUE", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -1 );
    } )

    test( "Test: \"SIN have wrong arguments count\"", function () {
        oParser = new parserFormula( 'SIN(3.1415926,3.1415926*2)', "A1", ws );
        ok( !oParser.parse() );
    } )

    test( "Test: \"SIN(3.1415926)\"", function () {
        oParser = new parserFormula( 'SIN(3.1415926)', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), Math.sin( 3.1415926 ) );
    } )

    test( "Test: \"COS(PI()/2)\"", function () {
        oParser = new parserFormula( 'COS(PI()/2)', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), Math.cos( Math.PI / 2 ) );
    } )

    test( "Test: \"SUM(1,2,3)\"", function () {
        oParser = new parserFormula( 'SUM(1,2,3)', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 + 2 + 3 );
    } )

    test( "Test: \"\"s\"&5\"", function () {
        oParser = new parserFormula( "\"s\"&5", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "s5" );
    } )

    test( "Test: \"String+Number\"", function () {
        oParser = new parserFormula( "1+\"099\"", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 100 );

        ws.getRange2( "A1469" ).setValue( "'099" );
        ws.getRange2( "A1470" ).setValue( "\"099\"" );

        oParser = new parserFormula( "1+A1469", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 100 );


        oParser = new parserFormula( "1+A1470", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

    } )

    test( "Test: \"POWER(2,8)\"", function () {
        oParser = new parserFormula( "POWER(2,8)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), Math.pow( 2, 8 ) );
    } )

    test( "Test: \"POWER(0,-3)\"", function () {
        oParser = new parserFormula( "POWER(0,-3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#DIV/0!" );
    } )

    test( "Test: \"ISNA(A1)\"", function () {
        var r = ws.getRange2( "K1" );
        ws.getRange2( "A1" ).setValue( "#N/A" );
        r.setValue( "=ISNA(A1)" );
        strictEqual( ws.getCell2( "K1" ).getValueWithFormat(), "TRUE" );
    } )

    test( "Test: \"ROUNDUP(31415.92654,-2)\"", function () {
        oParser = new parserFormula( "ROUNDUP(31415.92654,-2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 31500 );
    } )

    test( "Test: \"ROUNDUP(3.2,0)\"", function () {
        oParser = new parserFormula( "ROUNDUP(3.2,0)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 4 );
    } )

    test( "Test: \"ROUNDUP(-3.14159,1)\"", function () {
        oParser = new parserFormula( "ROUNDUP(-3.14159,1)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -3.2 );
    } )

    test( "Test: \"ROUNDUP(3.14159,3)\"", function () {
        oParser = new parserFormula( "ROUNDUP(3.14159,3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3.142 );
    } )

    test( "Test: \"ROUNDDOWN(31415.92654,-2)\"", function () {
        oParser = new parserFormula( "ROUNDDOWN(31415.92654,-2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 31400 );
    } )

    test( "Test: \"ROUNDDOWN(-3.14159,1)\"", function () {
        oParser = new parserFormula( "ROUNDDOWN(-3.14159,1)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -3.1 );
    } )

    test( "Test: \"ROUNDDOWN(3.14159,3)\"", function () {
        oParser = new parserFormula( "ROUNDDOWN(3.14159,3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3.141 );
    } )

    test( "Test: \"ROUNDDOWN(3.2,0)\"", function () {
        oParser = new parserFormula( "ROUNDDOWN(3.2,0)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3 );
    } )

    test( "Test: \"MROUND\"", function () {
        var multiple;//должен равняться значению второго аргумента
        function mroundHelper( num ) {
            var multiplier = Math.pow( 10, Math.floor( Math.log( Math.abs( num ) ) / Math.log( 10 ) ) - AscCommonExcel.cExcelSignificantDigits + 1 );
            var nolpiat = 0.5 * (num > 0 ? 1 : num < 0 ? -1 : 0) * multiplier;
            var y = (num + nolpiat) / multiplier;
            y = y / Math.abs( y ) * Math.floor( Math.abs( y ) )
            var x = y * multiplier / multiple

            // var x = number / multiple;
            var nolpiat = 5 * (x / Math.abs( x )) * Math.pow( 10, Math.floor( Math.log( Math.abs( x ) ) / Math.log( 10 ) ) - AscCommonExcel.cExcelSignificantDigits );
            x = x + nolpiat;
            x = x | x;

            return x * multiple;
        }


        oParser = new parserFormula( "MROUND(10,3)", "A1", ws );
        ok( oParser.parse() );
        multiple = 3;
        strictEqual( oParser.calculate().getValue(), mroundHelper( 10 + 3 / 2 ) );

        oParser = new parserFormula( "MROUND(-10,-3)", "A1", ws );
        ok( oParser.parse() );
        multiple = -3;
        strictEqual( oParser.calculate().getValue(), mroundHelper( -10 + -3 / 2 ) );

        oParser = new parserFormula( "MROUND(1.3,0.2)", "A1", ws );
        ok( oParser.parse() );
        multiple = 0.2;
        strictEqual( oParser.calculate().getValue(), mroundHelper( 1.3 + 0.2 / 2 ) );
    } )

    test( "Test: \"T(\"HELLO\")\"", function () {
        oParser = new parserFormula( "T(\"HELLO\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "HELLO" );
    } )

    test( "Test: \"T(123)\"", function () {
        oParser = new parserFormula( "T(123)", "A1", ws );
        ok( oParser.parse() );
        ok( !oParser.calculate().getValue(), "123" );
    } )

    test( "Test: YEAR", function () {
        oParser = new parserFormula( "YEAR(2013)", "A1", ws );
        ok( oParser.parse() );
        if ( bDate1904 )
            strictEqual( oParser.calculate().getValue(), 1909 );
        else
            strictEqual( oParser.calculate().getValue(), 1905 );
    } )

    test( "Test: DAY", function () {
        oParser = new parserFormula( "DAY(2013)", "A1", ws );
        ok( oParser.parse() );
        if ( bDate1904 )
            strictEqual( oParser.calculate().getValue(), 6 );
        else
            strictEqual( oParser.calculate().getValue(), 5 );
    } )

    test( "Test: DAY 2", function () {
        oParser = new parserFormula( "DAY(\"20 may 2045\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 20 );
    } )

    test( "Test: MONTH #1", function () {
        oParser = new parserFormula( "MONTH(2013)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 7 );
    } )

    test( "Test: MONTH #2", function () {
        oParser = new parserFormula( "MONTH(DATE(2013,2,2))", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2 );
    } )

    test( "Test: MONTH #3", function () {
        oParser = new parserFormula( "MONTH(NOW())", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), new Date().getUTCMonth() + 1 );
    } )

    test( "Test: \"10-3\"", function () {
        oParser = new parserFormula( "10-3", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 7 );
    } )

    test( "Test: \"SUM\"", function () {

        ws.getRange2( "S5" ).setValue( "=1" );
        ws.getRange2( "S6" ).setValue( "=-1/Fact(2)" );
        ws.getRange2( "S7" ).setValue( "=1/Fact(4)" );
        ws.getRange2( "S8" ).setValue( "=-1/Fact(6)" );

        oParser = new parserFormula( "SUM(S5:S8)", "A1", ws );
        ok( oParser.parse() );
//        strictEqual( oParser.calculate().getValue(), 1-1/Math.fact(2)+1/Math.fact(4)-1/Math.fact(6) );
        ok( Math.abs( oParser.calculate().getValue() - (1 - 1 / Math.fact( 2 ) + 1 / Math.fact( 4 ) - 1 / Math.fact( 6 )) ) < dif );
    } )

    test( "Test: \"MAX\"", function () {

        ws.getRange2( "S5" ).setValue( "=1" );
        ws.getRange2( "S6" ).setValue( "=-1/Fact(2)" );
        ws.getRange2( "S7" ).setValue( "=1/Fact(4)" );
        ws.getRange2( "S8" ).setValue( "=-1/Fact(6)" );

        oParser = new parserFormula( "MAX(S5:S8)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );
    } )

    test( "Test: \"MAXA\"", function () {

        ws.getRange2( "S5" ).setValue( "=1" );
        ws.getRange2( "S6" ).setValue( "=-1/Fact(2)" );
        ws.getRange2( "S7" ).setValue( "=1/Fact(4)" );
        ws.getRange2( "S8" ).setValue( "=-1/Fact(6)" );

        oParser = new parserFormula( "MAXA(S5:S8)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );
    } )

    test( "Test: \"MIN\"", function () {

        ws.getRange2( "S5" ).setValue( "=1" );
        ws.getRange2( "S6" ).setValue( "=-1/Fact(2)" );
        ws.getRange2( "S7" ).setValue( "=1/Fact(4)" );
        ws.getRange2( "S8" ).setValue( "=-1/Fact(6)" );

        oParser = new parserFormula( "MIN(S5:S8)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -1 / Math.fact( 2 ) );
    } )

    test( "Test: \"MINA\"", function () {

        ws.getRange2( "S5" ).setValue( "=1" );
        ws.getRange2( "S6" ).setValue( "=-1/Fact(2)" );
        ws.getRange2( "S7" ).setValue( "=1/Fact(4)" );
        ws.getRange2( "S8" ).setValue( "=-1/Fact(6)" );

        oParser = new parserFormula( "MINA(S5:S8)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -1 / Math.fact( 2 ) );
    } )

    test( "Test: SUM(S7:S9,{1,2,3})", function () {
        ws.getRange2( "S7" ).setValue( "1" );
        ws.getRange2( "S8" ).setValue( "2" );
        ws.getRange2( "S9" ).setValue( "3" );
        ws.getRange2( "S10" ).setValue( "=SUM(S7:S9,{1,2,3})" );
        strictEqual( ws.getCell2( "S10" ).getValueWithFormat(), "12" );
    } )

    test( "Test: ISREF", function () {
        oParser = new parserFormula( "ISREF(G0)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "FALSE" );
    } )

    test( "Test: MOD", function () {
        oParser = new parserFormula( "MOD(7,3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );
    } )

    test( "Test: rename sheet #1", function () {
        oParser = new parserFormula( "Лист2!A2", "A1", ws );
        ok( oParser.parse() );
        // strictEqual( oParser.parse(), true)
        strictEqual( oParser.changeSheet( "Лист2", "Лист3" ).assemble(), "Лист3!A2" );

        oParser = new parserFormula( "Лист2:Лист3!A2", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.changeSheet( "Лист2", "Лист1" ).assemble(), "Лист1:Лист3!A2" );

        oParser = new parserFormula( "Лист2!A2:A5", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.changeSheet( "Лист2", "Лист3" ).assemble(), "Лист3!A2:A5" );

        ws = wb.getWorksheet( 0 );
        ws.getRange2( "S95" ).setValue( "2" );
        ws = wb.getWorksheet( 1 );
        ws.getRange2( "S100" ).setValue( "=" + wb.getWorksheet( 0 ).getName() + "!S95" );
        strictEqual( ws.getCell2( "S100" ).getValueWithFormat(), "2" );

        wb.getWorksheet( 0 ).setName( "ЛистTEMP" );

        strictEqual( ws.getCell2( "S100" ).getFormula(), wb.getWorksheet( 0 ).getName() + "!S95" );

    } )

    test( "Test: wrong ref", function () {
        oParser = new parserFormula( "1+XXX1", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NAME?" );
    } )

    test( "Test: \"CODE\"", function () {
        oParser = new parserFormula( "CODE(\"abc\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 97 );
    } )

    test( "Test: \"CHAR\"", function () {
        oParser = new parserFormula( "CHAR(97)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "a" );
    } )

    test( "Test: \"CHAR(CODE())\"", function () {
        oParser = new parserFormula( "CHAR(CODE(\"A\"))", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "A" );
    } )

    test( "Test: \"PROPER\"", function () {
        oParser = new parserFormula( "PROPER(\"2-cent's worth\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "2-Cent'S Worth" );
        oParser = new parserFormula( "PROPER(\"76BudGet\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "76Budget" );
        oParser = new parserFormula( "PROPER(\"this is a TITLE\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "This Is A Title" );
    } )

    test( "Test: \"GCD\"", function () {
        oParser = new parserFormula( "GCD(10,100,50)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 10 );
        oParser = new parserFormula( "GCD(24.6,36.2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 12 );
        oParser = new parserFormula( "GCD(-1,39,52)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );
    } )

    test( "Test: \"FIXED\"", function () {
        oParser = new parserFormula( "FIXED(1234567,-3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "1,235,000" );
        oParser = new parserFormula( "FIXED(.555555,10)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "0.5555550000" );
        oParser = new parserFormula( "FIXED(1234567.555555,4,TRUE)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "1234567.5556" );
        oParser = new parserFormula( "FIXED(1234567)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "1,234,567.00" );
    } )

    test( "Test: \"REPLACE\"", function () {

        oParser = new parserFormula( "REPLACE(\"abcdefghijk\",3,4,\"XY\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "abXYghijk" );

        oParser = new parserFormula( "REPLACE(\"abcdefghijk\",3,1,\"12345\")", "B2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "ab12345defghijk" );

        oParser = new parserFormula( "REPLACE(\"abcdefghijk\",15,4,\"XY\")", "C2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "abcdefghijkXY" );

    } )

    test( "Test: \"SEARCH\"", function () {

        oParser = new parserFormula( "SEARCH(\"~*\",\"abc*dEF\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 4 );

        oParser = new parserFormula( "SEARCH(\"~\",\"abc~dEF\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 4 );

        oParser = new parserFormula( "SEARCH(\"de\",\"abcdEF\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 4 );

        oParser = new parserFormula( "SEARCH(\"?c*e\",\"abcdEF\")", "B2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2 );

        oParser = new parserFormula( "SEARCH(\"de\",\"dEFabcdEF\",3)", "C2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 7 );

        oParser = new parserFormula( "SEARCH(\"de\",\"dEFabcdEF\",30)", "C2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

    } )

    test( "Test: \"SUBSTITUTE\"", function () {

        oParser = new parserFormula( "SUBSTITUTE(\"abcaAabca\",\"a\",\"xx\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "xxbcxxAxxbcxx" );

        oParser = new parserFormula( "SUBSTITUTE(\"abcaaabca\",\"a\",\"xx\")", "B2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "xxbcxxxxxxbcxx" );

        oParser = new parserFormula( "SUBSTITUTE(\"abcaaabca\",\"a\",\"\",10)", "C2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "bcbc" );

        oParser = new parserFormula( "SUBSTITUTE(\"abcaaabca\",\"a\",\"xx\",3)", "C2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "abcaxxabca" );

    } )

    test( "Test: \"TRIM\"", function () {

        oParser = new parserFormula( "TRIM(\"     abc         def      \")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "abc def" );

    } )

    test( "Test: \"DOLLAR\"", function () {

        oParser = new parserFormula( "DOLLAR(1234.567)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "$1,234.57" );

        oParser = new parserFormula( "DOLLAR(1234.567,-2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "$1,200" );

        oParser = new parserFormula( "DOLLAR(-1234.567,4)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "($1,234.5670)" );

    } )

    test( "Test: \"VALUE\"", function () {

        oParser = new parserFormula( "VALUE(\"123.456\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 123.456 );

        oParser = new parserFormula( "VALUE(\"$1,000\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1000 );

        oParser = new parserFormula( "VALUE(\"23-Mar-2002\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 37338 );

        oParser = new parserFormula( "VALUE(\"03-26-2006\")", "A2", ws );
        ok( oParser.parse() );

        if ( bDate1904 )
            strictEqual( oParser.calculate().getValue(), 37340 );
        else
            strictEqual( oParser.calculate().getValue(), 38802 );

        oParser = new parserFormula( "VALUE(\"16:48:00\")-VALUE(\"12:17:12\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), AscCommon.g_oFormatParser.parse( "16:48:00" ).value - AscCommon.g_oFormatParser.parse( "12:17:12" ).value );

    } )

    test( "Test: \"DATEVALUE\"", function () {

        oParser = new parserFormula( "DATEVALUE(\"10-10-2010 10:26\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 40461 );

        oParser = new parserFormula( "DATEVALUE(\"10-10-2010 10:26\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 40461 );

        tmp = ws.getRange2( "A7" );
        tmp.setNumFormat('@');
        tmp.setValue( "3-Mar" );
        oParser = new parserFormula( "DATEVALUE(A7)", "A2", ws );
        ok( oParser.parse() );
        var d = new Date();
        d.setUTCMonth(2);
        d.setUTCDate(3);
        strictEqual( oParser.calculate().getValue(), d.getExcelDate() );

        oParser = new parserFormula( "DATEVALUE(\"$1,000\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

        oParser = new parserFormula( "DATEVALUE(\"23-Mar-2002\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 37338 );

        oParser = new parserFormula( "DATEVALUE(\"03-26-2006\")", "A2", ws );
        ok( oParser.parse() );

        if ( bDate1904 )
            strictEqual( oParser.calculate().getValue(), 37340 );
        else
            strictEqual( oParser.calculate().getValue(), 38802 );
    } )

    test( "Test: \"EDATE\"", function () {

        if ( !bDate1904 ) {
            oParser = new parserFormula( "EDATE(DATE(2006,1,31),5)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 38898 );

            oParser = new parserFormula( "EDATE(DATE(2004,2,29),12)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 38411 );

            ws.getRange2( "A7" ).setValue( "02-28-2004" );
            oParser = new parserFormula( "EDATE(A7,12)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 38411 );

            oParser = new parserFormula( "EDATE(DATE(2004,1,15),-23)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 37302 );
        }
        else {
            oParser = new parserFormula( "EDATE(DATE(2006,1,31),5)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 37436 );

            oParser = new parserFormula( "EDATE(DATE(2004,2,29),12)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 36949 );

            ws.getRange2( "A7" ).setValue( "02-28-2004" );
            oParser = new parserFormula( "EDATE(A7,12)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 36949 );

            oParser = new parserFormula( "EDATE(DATE(2004,1,15),-23)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 35840 );
        }
    } )

    test( "Test: \"EOMONTH\"", function () {

        if ( !bDate1904 ) {
            oParser = new parserFormula( "EOMONTH(DATE(2006,1,31),5)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 38898 );

            oParser = new parserFormula( "EOMONTH(DATE(2004,2,29),12)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 38411 );

            ws.getRange2( "A7" ).setValue( "02-28-2004" );
            oParser = new parserFormula( "EOMONTH(A7,12)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 38411 );

            oParser = new parserFormula( "EOMONTH(DATE(2004,1,15),-23)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 37315 );
        }
        else {
            oParser = new parserFormula( "EOMONTH(DATE(2006,1,31),5)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 37436 );

            oParser = new parserFormula( "EOMONTH(DATE(2004,2,29),12)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 36949 );

            ws.getRange2( "A7" ).setValue( "02-28-2004" );
            oParser = new parserFormula( "EOMONTH(A7,12)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 36949 );

            oParser = new parserFormula( "EOMONTH(DATE(2004,1,15),-23)", "A2", ws );
            ok( oParser.parse() );
            strictEqual( oParser.calculate().getValue(), 35853 );
        }
    } )

    test( "Test: \"NETWORKDAYS\"", function () {

        oParser = new parserFormula( "NETWORKDAYS(DATE(2006,1,1),DATE(2006,1,31))", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 22 );

        oParser = new parserFormula( "NETWORKDAYS(DATE(2006,1,31),DATE(2006,1,1))", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -22 );

        oParser = new parserFormula( "NETWORKDAYS(DATE(2006,1,1),DATE(2006,2,1),{\"01-02-2006\",\"01-16-2006\"})", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 21 );

    } )

    test( "Test: \"SUMIF\"", function () {

        ws.getRange2( "A2" ).setValue( "100000" );
        ws.getRange2( "A3" ).setValue( "200000" );
        ws.getRange2( "A4" ).setValue( "300000" );
        ws.getRange2( "A5" ).setValue( "400000" );

        ws.getRange2( "B2" ).setValue( "7000" );
        ws.getRange2( "B3" ).setValue( "14000" );
        ws.getRange2( "B4" ).setValue( "21000" );
        ws.getRange2( "B5" ).setValue( "28000" );

        ws.getRange2( "C2" ).setValue( "250000" );

        oParser = new parserFormula( "SUMIF(A2:A5,\">160000\",B2:B5)", "A7", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 63000 );

        oParser = new parserFormula( "SUMIF(A2:A5,\">160000\")", "A8", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 900000 );

        oParser = new parserFormula( "SUMIF(A2:A5,300000,B2:B5)", "A9", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 21000 );

        oParser = new parserFormula( "SUMIF(A2:A5,\">\" & C2,B2:B5)", "A10", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 49000 );


        ws.getRange2( "A12" ).setValue( "Vegetables" );
        ws.getRange2( "A13" ).setValue( "Vegetables" );
        ws.getRange2( "A14" ).setValue( "Fruits" );
        ws.getRange2( "A15" ).setValue( "" );
        ws.getRange2( "A16" ).setValue( "Vegetables" );
        ws.getRange2( "A17" ).setValue( "Fruits" );

        ws.getRange2( "B12" ).setValue( "Tomatoes" );
        ws.getRange2( "B13" ).setValue( "Celery" );
        ws.getRange2( "B14" ).setValue( "Oranges" );
        ws.getRange2( "B15" ).setValue( "Butter" );
        ws.getRange2( "B16" ).setValue( "Carrots" );
        ws.getRange2( "B17" ).setValue( "Apples" );

        ws.getRange2( "C12" ).setValue( "2300" );
        ws.getRange2( "C13" ).setValue( "5500" );
        ws.getRange2( "C14" ).setValue( "800" );
        ws.getRange2( "C15" ).setValue( "400" );
        ws.getRange2( "C16" ).setValue( "4200" );
        ws.getRange2( "C17" ).setValue( "1200" );

        oParser = new parserFormula( "SUMIF(A12:A17,\"Fruits\",C12:C17)", "A19", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2000 );

        oParser = new parserFormula( "SUMIF(A12:A17,\"Vegetables\",C12:C17)", "A20", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 12000 );

        oParser = new parserFormula( "SUMIF(B12:B17,\"*es\",C12:C17)", "A21", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 4300 );

        oParser = new parserFormula( "SUMIF(A12:A17,\"\",C12:C17)", "A22", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 400 );

    } )

    test( "Test: \"TEXT\"", function () {

        wb.dependencyFormulas = new AscCommonExcel.DependencyGraph( wb );

        oParser = new parserFormula( "TEXT(1234.567,\"$0.00\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "$1234.57" );

        oParser = new parserFormula( "TEXT(0.125,\"0.0%\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "12.5%" );

    } )

    test( "Test: \"WORKDAY\"", function () {

        wb.dependencyFormulas = new AscCommonExcel.DependencyGraph( wb );

        oParser = new parserFormula( "WORKDAY(DATE(2006,1,1),0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 38718 );

        oParser = new parserFormula( "WORKDAY(DATE(2006,1,1),10)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 38730 );

        oParser = new parserFormula( "WORKDAY(DATE(2006,1,1),-10)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 38705 );

        oParser = new parserFormula( "WORKDAY(DATE(2006,1,1),20,{\"1-2-2006\",\"1-16-2006\"})", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 38748 );

    } )

    test( "Test: \"TIMEVALUE\"", function () {
        oParser = new parserFormula( "timevalue(\"10:02:34\")", "A2", ws );
        ok( oParser.parse() );
        ok( Math.abs( oParser.calculate().getValue() - 0.4184490740740740 ) < dif );

        oParser = new parserFormula( "timevalue(\"02-01-2006 10:15:29 AM\")", "A2", ws );
        ok( oParser.parse() );
        ok( Math.abs( oParser.calculate().getValue() - 0.4274189814823330 ) < dif );

        oParser = new parserFormula( "timevalue(\"22:02\")", "A2", ws );
        ok( oParser.parse() );
        ok( Math.abs( oParser.calculate().getValue() - 0.9180555555555560 ) < dif );
    } )

    test( "Test: \"DAYS360\"", function () {

        oParser = new parserFormula( "DAYS360(DATE(2002,2,3),DATE(2005,5,31))", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1198 );

        oParser = new parserFormula( "DAYS360(DATE(2005,5,31),DATE(2002,2,3))", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -1197 );

        oParser = new parserFormula( "DAYS360(DATE(2002,2,3),DATE(2005,5,31),FALSE)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1198 );

        oParser = new parserFormula( "DAYS360(DATE(2002,2,3),DATE(2005,5,31),TRUE)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1197 );

    } )

    test( "Test: \"WEEKNUM\"", function () {
        oParser = new parserFormula( "WEEKNUM(DATE(2006,1,1))", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "WEEKNUM(DATE(2006,1,1),17)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "WEEKNUM(DATE(2006,1,1),1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "WEEKNUM(DATE(2006,1,1),21)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 52 );

        oParser = new parserFormula( "WEEKNUM(DATE(2006,2,1),1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 5 );

        oParser = new parserFormula( "WEEKNUM(DATE(2006,2,1),2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 6 );

        oParser = new parserFormula( "WEEKNUM(DATE(2006,2,1),11)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 6 );

        oParser = new parserFormula( "WEEKNUM(DATE(2007,1,1),15)", "A2", ws );//понед
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "WEEKNUM(DATE(2008,1,1),15)", "A2", ws );//втор
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "WEEKNUM(DATE(2003,1,1),15)", "A2", ws );//сред
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "WEEKNUM(DATE(2009,1,1),15)", "A2", ws );//чет
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "WEEKNUM(DATE(2010,1,1),15)", "A2", ws );//пят
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "WEEKNUM(DATE(2011,1,1),15)", "A2", ws );//суб
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "WEEKNUM(DATE(2012,1,1),11)", "A2", ws );//вск
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "WEEKNUM(DATE(2008,1,4),11)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "WEEKNUM(DATE(2008,1,10),11)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2 );

        oParser = new parserFormula( "WEEKNUM(DATE(2008,1,11),11)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2 );

        oParser = new parserFormula( "WEEKNUM(DATE(2008,1,17),11)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3 );

        oParser = new parserFormula( "WEEKNUM(DATE(2008,1,18),11)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3 );

        oParser = new parserFormula( "WEEKNUM(DATE(2008,1,24),11)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 4 );

        oParser = new parserFormula( "WEEKNUM(DATE(2013,1,1),21)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "WEEKNUM(DATE(2013,1,7))", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2 );

    } )

    test( "Test: \"YEARFRAC\"", function () {
        function okWrapper( a, b ) {
            ok( Math.abs( a - b ) < dif );
        }

        oParser = new parserFormula( "YEARFRAC(DATE(2006,1,1),DATE(2006,3,26))", "A2", ws );
        ok( oParser.parse() );
        okWrapper( oParser.calculate().getValue(), 0.236111111 );

        oParser = new parserFormula( "YEARFRAC(DATE(2006,3,26),DATE(2006,1,1))", "A2", ws );
        ok( oParser.parse() );
        okWrapper( oParser.calculate().getValue(), 0.236111111 );

        oParser = new parserFormula( "YEARFRAC(DATE(2006,1,1),DATE(2006,7,1))", "A2", ws );
        ok( oParser.parse() );
        okWrapper( oParser.calculate().getValue(), 0.5 );

        oParser = new parserFormula( "YEARFRAC(DATE(2006,1,1),DATE(2007,9,1))", "A2", ws );
        ok( oParser.parse() );
        okWrapper( oParser.calculate().getValue(), 1.666666667 );

        oParser = new parserFormula( "YEARFRAC(DATE(2006,1,1),DATE(2006,7,1),0)", "A2", ws );
        ok( oParser.parse() );
        okWrapper( oParser.calculate().getValue(), 0.5 );

        oParser = new parserFormula( "YEARFRAC(DATE(2006,1,1),DATE(2006,7,1),1)", "A2", ws );
        ok( oParser.parse() );
        okWrapper( oParser.calculate().getValue(), 0.495890411 );

        oParser = new parserFormula( "YEARFRAC(DATE(2006,1,1),DATE(2006,7,1),2)", "A2", ws );
        ok( oParser.parse() );
        okWrapper( oParser.calculate().getValue(), 0.502777778 );

        oParser = new parserFormula( "YEARFRAC(DATE(2006,1,1),DATE(2006,7,1),3)", "A2", ws );
        ok( oParser.parse() );
        okWrapper( oParser.calculate().getValue(), 0.495890411 );

        oParser = new parserFormula( "YEARFRAC(DATE(2006,1,1),DATE(2006,7,1),4)", "A2", ws );
        ok( oParser.parse() );
        okWrapper( oParser.calculate().getValue(), 0.5 );

        oParser = new parserFormula( "YEARFRAC(DATE(2004,3,1),DATE(2006,3,1),1)", "A2", ws );
        ok( oParser.parse() );
        okWrapper( oParser.calculate().getValue(), 1.998175182481752 );
    } )

    test( "Test: \"DATEDIF\"", function () {

        oParser = new parserFormula( "DATEDIF(DATE(2001,1,1),DATE(2003,1,1),\"Y\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2 );

        oParser = new parserFormula( "DATEDIF(DATE(2001,6,1),DATE(2002,8,15),\"D\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 440 );

        oParser = new parserFormula( "DATEDIF(DATE(2001,6,1),DATE(2002,8,15),\"YD\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 75 );

        oParser = new parserFormula( "DATEDIF(DATE(2001,6,1),DATE(2002,8,15),\"MD\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 14 );
    } )

    test( "Test: \"SUMPRODUCT\"", function () {

        oParser = new parserFormula( "SUMPRODUCT({2,3})", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 5 );

        oParser = new parserFormula( "SUMPRODUCT({2,3},{4,5})", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 23 );

        oParser = new parserFormula( "SUMPRODUCT({2,3},{4,5},{2,2})", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 46 );

        oParser = new parserFormula( "SUMPRODUCT({2,3;4,5},{2,2;3,4})", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 42 );

        ws.getRange2( "N44" ).setValue( "1" );
        ws.getRange2( "N45" ).setValue( "2" );
        ws.getRange2( "N46" ).setValue( "3" );
        ws.getRange2( "N47" ).setValue( "4" );

        ws.getRange2( "O44" ).setValue( "5" );
        ws.getRange2( "O45" ).setValue( "6" );
        ws.getRange2( "O46" ).setValue( "7" );
        ws.getRange2( "O47" ).setValue( "8" );

        ws.getRange2( "P44" ).setValue( "9" );
        ws.getRange2( "P45" ).setValue( "10" );
        ws.getRange2( "P46" ).setValue( "11" );
        ws.getRange2( "P47" ).setValue( "12" );
        oParser = new parserFormula( "SUMPRODUCT(N44:N47,O44:O47,P44:P47)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 780 );
    } )

    test( "Test: \"SINH\"", function () {

        oParser = new parserFormula( "SINH(0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 0 );

        oParser = new parserFormula( "SINH(1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), ((Math.E - 1 / Math.E) / 2) );
    } )

    test( "Test: \"COSH\"", function () {

        oParser = new parserFormula( "COSH(0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "COSH(1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), ((Math.E + 1 / Math.E) / 2) );
    } )

    test( "Test: \"TANH\"", function () {

        oParser = new parserFormula( "TANH(0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 0 );

        oParser = new parserFormula( "TANH(1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), ((Math.E * Math.E - 1) / (Math.E * Math.E + 1)) ), true );
    } )

    test( "Test: \"COMBIN\"", function () {

        oParser = new parserFormula( "COMBIN(8,2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 28 );

        oParser = new parserFormula( "COMBIN(10,4)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 210 );

        oParser = new parserFormula( "COMBIN(6,5)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 6 );

        oParser = new parserFormula( "COMBIN(-6,5)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "COMBIN(3,5)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "COMBIN(6,-5)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );
    } )

    test( "Test: \"FACTDOUBLE\"", function () {

        oParser = new parserFormula( "FACTDOUBLE(8)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2 * 4 * 6 * 8 );

        oParser = new parserFormula( "FACTDOUBLE(9)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 9 * 7 * 5 * 3 );

        oParser = new parserFormula( "FACTDOUBLE(6.5)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 6 * 4 * 2 );

        oParser = new parserFormula( "FACTDOUBLE(-6)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "FACTDOUBLE(600)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );
    } )

    test( "Test: \"GCD\"", function () {
        oParser = new parserFormula( "LCM(5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 5 );

        oParser = new parserFormula( "LCM(24.6,36.2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 72 );

        oParser = new parserFormula( "LCM(-1,39,52)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "LCM(0,39,52)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "LCM(24,36,15)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 360 );
    } )

    test( "Test: \"RANDBETWEEN\"", function () {
        var res;
        oParser = new parserFormula( "RANDBETWEEN(1,6)", "A1", ws );
        ok( oParser.parse() );
        res = oParser.calculate().getValue()
        ok( res >= 1 && res <= 6 );

        oParser = new parserFormula( "RANDBETWEEN(-10,10)", "A1", ws );
        ok( oParser.parse() );
        res = oParser.calculate().getValue()
        ok( res >= -10 && res <= 10 );

        oParser = new parserFormula( "RANDBETWEEN(-25,-3)", "A1", ws );
        ok( oParser.parse() );
        res = oParser.calculate().getValue()
        ok( res >= -25 && res <= -3 );
    } )

    test( "Test: \"QUOTIENT\"", function () {
        oParser = new parserFormula( "QUOTIENT(1,6)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 0 );

        oParser = new parserFormula( "QUOTIENT(-10,3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -3 );

        oParser = new parserFormula( "QUOTIENT(5,3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "QUOTIENT(5,0)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#DIV/0!" );
    } )

    test( "Test: \"TRUNC\"", function () {
        oParser = new parserFormula( "TRUNC(PI())", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3 );

        oParser = new parserFormula( "TRUNC(PI(),3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3.141 );

        oParser = new parserFormula( "TRUNC(PI(),-2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 0 );

        oParser = new parserFormula( "TRUNC(-PI(),2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -3.14 );

    } )

    test( "Test: \"MULTINOMIAL\"", function () {
        oParser = new parserFormula( "MULTINOMIAL(2,3,4)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), Math.fact( 2 + 3 + 4 ) / (Math.fact( 2 ) * Math.fact( 3 ) * Math.fact( 4 )) );

        oParser = new parserFormula( "MULTINOMIAL(2,3,\"r\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

        oParser = new parserFormula( "MULTINOMIAL(150,50)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

    } )

    test( "Test: \"SUMSQ\"", function () {
        oParser = new parserFormula( "SUMSQ(2.5,-3.6,2.4)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2.5 * 2.5 + 3.6 * 3.6 + 2.4 * 2.4 );

        oParser = new parserFormula( "SUMSQ(2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 4 );

        oParser = new parserFormula( "SUMSQ(150,50)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 150 * 150 + 50 * 50 );

        oParser = new parserFormula( "SUMSQ(150,\"f\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

    } )

    test( "Test: \"ROMAN\"", function () {

        oParser = new parserFormula( "ROMAN(499,0)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "CDXCIX" );

        oParser = new parserFormula( "ROMAN(499,1)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "LDVLIV" );

        oParser = new parserFormula( "ROMAN(499,2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "XDIX" );

        oParser = new parserFormula( "ROMAN(499,3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "VDIV" );

        oParser = new parserFormula( "ROMAN(499,4)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "ID" );

        oParser = new parserFormula( "ROMAN(2013,0)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "MMXIII" );

        oParser = new parserFormula( "ROMAN(2013,5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

        oParser = new parserFormula( "ROMAN(-2013,1)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

        oParser = new parserFormula( "ROMAN(2499,1)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "MMLDVLIV" );

    } )

    test( "Test: \"SUMXMY2\"", function () {

        oParser = new parserFormula( "SUMXMY2({2,3,9,1,8,7,5},{6,5,11,7,5,4,4})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 79 );

        oParser = new parserFormula( "SUMXMY2({2,3,9;1,8,7},{6,5,11;7,5,4})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 78 );

        oParser = new parserFormula( "SUMXMY2(7,5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

    } )

    test( "Test: \"SUMX2MY2\"", function () {

        oParser = new parserFormula( "SUMX2MY2({2,3,9,1,8,7,5},{6,5,11,7,5,4,4})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -55 );

        oParser = new parserFormula( "SUMX2MY2({2,3,9;1,8,7},{6,5,11;7,5,4})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -64 );

        oParser = new parserFormula( "SUMX2MY2(7,5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

    } )

    test( "Test: \"SUMX2MY2\"", function () {

        oParser = new parserFormula( "SUMX2PY2({2,3,9,1,8,7,5},{6,5,11,7,5,4,4})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 521 );

        oParser = new parserFormula( "SUMX2PY2({2,3,9;1,8,7},{6,5,11;7,5,4})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 480 );

        oParser = new parserFormula( "SUMX2PY2(7,5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

    } )

    test( "Test: \"SERIESSUM\"", function () {

        ws.getRange2( "A2" ).setValue( "=1" );
        ws.getRange2( "A3" ).setValue( "=-1/Fact(2)" );
        ws.getRange2( "A4" ).setValue( "=1/Fact(4)" );
        ws.getRange2( "A5" ).setValue( "=-1/Fact(6)" );

        oParser = new parserFormula( "SERIESSUM(PI()/4,0,2,A2:A5)", "A7", ws );
        ok( oParser.parse() );
        ok( Math.abs( oParser.calculate().getValue() - (1 - 1 / 2 * Math.pow( Math.PI / 4, 2 ) + 1 / Math.fact( 4 ) * Math.pow( Math.PI / 4, 4 ) - 1 / Math.fact( 6 ) * Math.pow( Math.PI / 4, 6 )) ) < dif );

        ws.getRange2( "B2" ).setValue( "=1" );
        ws.getRange2( "B3" ).setValue( "=-1/Fact(3)" );
        ws.getRange2( "B4" ).setValue( "=1/Fact(5)" );
        ws.getRange2( "B5" ).setValue( "=-1/Fact(7)" );

        oParser = new parserFormula( "SERIESSUM(PI()/4,1,2,B2:B5)", "B7", ws );
        ok( oParser.parse() );
        ok( Math.abs( oParser.calculate().getValue() - (Math.PI / 4 - 1 / Math.fact( 3 ) * Math.pow( Math.PI / 4, 3 ) + 1 / Math.fact( 5 ) * Math.pow( Math.PI / 4, 5 ) - 1 / Math.fact( 7 ) * Math.pow( Math.PI / 4, 7 )) ) < dif );

    } )

    /*
    * Mathematical Function
    * */
    test( "Test: \"CEILING\"", function () {

        oParser = new parserFormula( "CEILING(2.5,1)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3 );

        oParser = new parserFormula( "CEILING(-2.5,-2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -4 );

        oParser = new parserFormula( "CEILING(-2.5,2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -2 );

        oParser = new parserFormula( "CEILING(1.5,0.1)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1.5 );

        oParser = new parserFormula( "CEILING(0.234,0.01)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 0.24 );

    } )


    /*
     * Statistical Function
     * */
    test( "Test: \"AVEDEV\"", function () {

        oParser = new parserFormula( "AVEDEV(-3.5,1.4,6.9,-4.5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 4.075 );

        oParser = new parserFormula( "AVEDEV({-3.5,1.4,6.9,-4.5})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 4.075 );

        oParser = new parserFormula( "AVEDEV(-3.5,1.4,6.9,-4.5,-0.3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 3.32 ), true );

    } )

    test( "Test: \"AVERAGE\"", function () {

        oParser = new parserFormula( "AVERAGE(1,2,3,4,5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3 );

        oParser = new parserFormula( "AVERAGE({1,2;3,4})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2.5 );

        oParser = new parserFormula( "AVERAGE({1,2,3,4,5},6,\"7\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 4 );

        oParser = new parserFormula( "AVERAGE({1,\"2\",TRUE,4})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2.5 );

    } )

    test( "Test: \"AVERAGEA\"", function () {

        ws.getRange2( "E2" ).setValue( "TRUE" );
        ws.getRange2( "E3" ).setValue( "FALSE" );

        oParser = new parserFormula( "AVERAGEA(10,E1)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 10 );

        oParser = new parserFormula( "AVERAGEA(10,E2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 5.5 );

        oParser = new parserFormula( "AVERAGEA(10,E3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 5 );

    } )

    test( "Test: \"AVERAGEIF\"", function () {

        ws.getRange2( "E2" ).setValue( "10" );
        ws.getRange2( "E3" ).setValue( "20" );
        ws.getRange2( "E4" ).setValue( "28" );
        ws.getRange2( "E5" ).setValue( "30" );

        oParser = new parserFormula( "AVERAGEIF(E2:E5,\">15\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 26 );

    } )

    test( "Test: \"BINOMDIST\"", function () {

        function binomdist( x, n, p ) {
            x = parseInt( x );
            n = parseInt( n );
            return Math.binomCoeff( n, x ) * Math.pow( p, x ) * Math.pow( 1 - p, n - x );
        }

        oParser = new parserFormula( "BINOMDIST(6,10,0.5,FALSE)", "A1", ws );
        ok( oParser.parse() );
        ok( Math.abs( oParser.calculate().getValue() - binomdist( 6, 10, 0.5 ) ) < dif );

        oParser = new parserFormula( "BINOMDIST(6,10,0.5,TRUE)", "A1", ws );
        ok( oParser.parse() );
        ok( Math.abs( oParser.calculate().getValue() - (function () {
            var bm = 0;
            for ( var y = 0; y <= 6; y++ ) {
                bm += binomdist( y, 10, 0.5 )
            }
            return bm;
        })() ) < dif );

        oParser = new parserFormula( "BINOMDIST(11,10,0.5,FALSE)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

    } )

    test( "Test: \"CONFIDENCE\"", function () {

        oParser = new parserFormula( "CONFIDENCE(0.4,5,12)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 1.214775614397568 ), true );

        oParser = new parserFormula( "CONFIDENCE(0.75,9,7)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 1.083909233527114 ), true );

    } )

    test( "Test: \"CORREL\"", function () {

        oParser = new parserFormula( "CORREL({2.532,5.621;2.1,3.4},{5.32,2.765;5.2,\"f\"})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), -0.988112020032211 ), true );

        oParser = new parserFormula( "CORREL({1;2;3},{4;5;\"E\"})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 1 ), true );

        oParser = new parserFormula( "CORREL({1,2},{1,\"e\"})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#DIV/0!" );

    } )

    test( "Test: \"COUNT\"", function () {

        ws.getRange2( "E2" ).setValue( "TRUE" );

        oParser = new parserFormula( "COUNT({1,2,3,4,5})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 5 );

        oParser = new parserFormula( "COUNT(1,2,3,4,5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 5 );

        oParser = new parserFormula( "COUNT({1,2,3,4,5},6,\"7\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 7 );

        oParser = new parserFormula( "COUNT(10,E150)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "COUNT(10,E2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );


    } )

    test( "Test: \"COUNTA\"", function () {

        ws.getRange2( "E2" ).setValue( "TRUE" );

        oParser = new parserFormula( "COUNTA({1,2,3,4,5})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 5 );

        oParser = new parserFormula( "COUNTA(1,2,3,4,5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 5 );

        oParser = new parserFormula( "COUNTA({1,2,3,4,5},6,\"7\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 7 );

        oParser = new parserFormula( "COUNTA(10,E150)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "COUNTA(10,E2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2 );


    } )

    test( "Test: \"COUNTIF\"", function () {

        ws.getRange2( "A7" ).setValue( "3" );
        ws.getRange2( "B7" ).setValue( "10" );
        ws.getRange2( "C7" ).setValue( "7" );
        ws.getRange2( "D7" ).setValue( "10" );

        ws.getRange2( "A8" ).setValue( "apples" );
        ws.getRange2( "B8" ).setValue( "oranges" );
        ws.getRange2( "C8" ).setValue( "grapes" );
        ws.getRange2( "D8" ).setValue( "melons" );


        oParser = new parserFormula( "COUNTIF(A7:D7,\"=10\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2 );

        oParser = new parserFormula( "COUNTIF(A7:D7,\">5\")", "B1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3 );

        oParser = new parserFormula( "COUNTIF(A7:D7,\"<>10\")", "C1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2 );

        oParser = new parserFormula( "COUNTIF(A8:D8,\"*es\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3 );

        oParser = new parserFormula( "COUNTIF(A8:D8,\"??a*\")", "B2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2 );

        oParser = new parserFormula( "COUNTIF(A8:D8,\"*l*\")", "C2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2 );

    } )

    test( "Test: \"COVAR\"", function () {

        oParser = new parserFormula( "COVAR({2.532,5.621;2.1,3.4},{5.32,2.765;5.2,6.7})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), -1.3753740625 ), true );

        oParser = new parserFormula( "COVAR({1,2},{4,5})", "B1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 0.25 ), true );

    } )

    test( "Test: \"CRITBINOM\"", function () {

        oParser = new parserFormula( "CRITBINOM(6,0.5,0.75)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 4 );

        oParser = new parserFormula( "CRITBINOM(12,0.3,0.95)", "B1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 6 );

        oParser = new parserFormula( "CRITBINOM(-12,0.3,0.95)", "B1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "CRITBINOM(-12,1.3,0.95)", "B1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "CRITBINOM(-12,-1.3,0.95)", "B1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "CRITBINOM(-12,0,0.95)", "B1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "CRITBINOM(-12,0.3,1.95)", "B1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

    } )

    test( "Test: \"DEVSQ\"", function () {

        var ws1 = wb.getWorksheet( 1 );

        ws1.getRange2( "A1" ).setValue( "5.6" );
        ws1.getRange2( "A2" ).setValue( "8.2" );
        ws1.getRange2( "A3" ).setValue( "9.2" );

        oParser = new parserFormula( "DEVSQ(5.6,8.2,9.2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 6.906666666666665 ), true );

        oParser = new parserFormula( "DEVSQ({5.6,8.2,9.2})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 6.906666666666665 ), true );

        oParser = new parserFormula( "DEVSQ(5.6,8.2,\"9.2\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 3.379999999999999 ), true );

        oParser = new parserFormula( "DEVSQ(Лист2!A1:A3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 6.906666666666665 ), true );

    } )

    test( "Test: \"EXPONDIST\"", function () {

        oParser = new parserFormula( "EXPONDIST(0.2,10,FALSE)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 1.353352832366127 ), true );

        oParser = new parserFormula( "EXPONDIST(2.3,1.5,TRUE)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 0.968254363621932 ), true );

    } )

    test( "Test: \"FISHER\"", function () {

        function fisher( x ) {
            return toFixed( 0.5 * Math.ln( (1 + x) / (1 - x) ) );
        }

        oParser = new parserFormula( "FISHER(-0.43)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), fisher( -.43 ) );

        oParser = new parserFormula( "FISHER(0.578)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), fisher( 0.578 ) );

        oParser = new parserFormula( "FISHER(1)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "FISHER(-1)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

    } )

    test( "Test: \"FISHERINV\"", function () {

        function fisherInv( x ) {
            return toFixed( ( Math.exp( 2 * x ) - 1 ) / ( Math.exp( 2 * x ) + 1 ) );
        }

        oParser = new parserFormula( "FISHERINV(-0.43)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), fisherInv( -.43 ) );

        oParser = new parserFormula( "FISHERINV(0.578)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), fisherInv( 0.578 ) );

        oParser = new parserFormula( "FISHERINV(1)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), fisherInv( 1 ) );

        oParser = new parserFormula( "FISHERINV(-1)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), fisherInv( -1 ) );

    } )

    test( "Test: \"FORECAST\"", function () {

        function forecast( fx, y, x ) {

            var fSumDeltaXDeltaY = 0, fSumSqrDeltaX = 0, _x = 0, _y = 0, xLength = 0;
            for ( var i = 0; i < x.length; i++ ) {
                _x += x[i];
                _y += y[i];
                xLength++;
            }

            _x /= xLength;
            _y /= xLength;

            for ( var i = 0; i < x.length; i++ ) {

                var fValX = x[i];
                var fValY = y[i];

                fSumDeltaXDeltaY += ( fValX - _x ) * ( fValY - _y );
                fSumSqrDeltaX += ( fValX - _x ) * ( fValX - _x );

            }

            return toFixed( _y + fSumDeltaXDeltaY / fSumSqrDeltaX * ( fx - _x ) );

        }

        oParser = new parserFormula( "FORECAST(30,{6,7,9,15,21},{20,28,31,38,40})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), forecast( 30, [6, 7, 9, 15, 21], [20, 28, 31, 38, 40] ) );

    } )

    test( "Test: \"FREQUENCY\"", function () {

        ws.getRange2( "A202" ).setValue( "79" );
        ws.getRange2( "A203" ).setValue( "85" );
        ws.getRange2( "A204" ).setValue( "78" );
        ws.getRange2( "A205" ).setValue( "85" );
        ws.getRange2( "A206" ).setValue( "50" );
        ws.getRange2( "A207" ).setValue( "81" );
        ws.getRange2( "A208" ).setValue( "95" );
        ws.getRange2( "A209" ).setValue( "88" );
        ws.getRange2( "A210" ).setValue( "97" );

        ws.getRange2( "B202" ).setValue( "70" );
        ws.getRange2( "B203" ).setValue( "89" );
        ws.getRange2( "B204" ).setValue( "79" );

        oParser = new parserFormula( "FREQUENCY(A202:A210,B202:B204)", "A201", ws );
        ok( oParser.parse() );
        var a = oParser.calculate()
        strictEqual( a.getElement( 0 ).getValue(), 1 );
        strictEqual( a.getElement( 1 ).getValue(), 2 );
        strictEqual( a.getElement( 2 ).getValue(), 4 );
        strictEqual( a.getElement( 3 ).getValue(), 2 );

    } )

    test( "Test: \"GAMMALN\"", function () {

        oParser = new parserFormula( "GAMMALN(4.5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue().toFixed( 14 ) - 0, 2.45373657084244 );

        oParser = new parserFormula( "GAMMALN(-4.5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

    } )

    test( "Test: \"GEOMEAN\"", function () {

        function geommean( x ) {

            var s1 = 0, _x = 1, xLength = 0, _tx;
            for ( var i = 0; i < x.length; i++ ) {
                _x *= x[i];
            }

            return  Math.pow( _x, 1 / x.length )
        }

        oParser = new parserFormula( "GEOMEAN(10.5,5.3,2.9)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), geommean( [10.5, 5.3, 2.9] ) );

        oParser = new parserFormula( "GEOMEAN(10.5,{5.3,2.9},\"12\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), geommean( [10.5, 5.3, 2.9, 12] ) );

        oParser = new parserFormula( "GEOMEAN(10.5,{5.3,2.9},\"12\",0)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

    } )

    test( "Test: \"HARMEAN\"", function () {

        function harmmean( x ) {

            var _x = 0, xLength = 0;
            for ( var i = 0; i < x.length; i++ ) {
                _x += 1 / x[i];
                xLength++;
            }
            return xLength / _x;
        }

        oParser = new parserFormula( "HARMEAN(10.5,5.3,2.9)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), harmmean( [10.5, 5.3, 2.9] ) );

        oParser = new parserFormula( "HARMEAN(10.5,{5.3,2.9},\"12\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), harmmean( [10.5, 5.3, 2.9, 12] ) );

        oParser = new parserFormula( "HARMEAN(10.5,{5.3,2.9},\"12\",0)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

    } )

    test( "Test: \"HYPGEOMDIST\"", function () {

        function hypgeomdist( x, n, M, N ) {
            return toFixed( Math.binomCoeff( M, x ) * Math.binomCoeff( N - M, n - x ) / Math.binomCoeff( N, n ) );
        }

        oParser = new parserFormula( "HYPGEOMDIST(1,4,8,20)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), hypgeomdist( 1, 4, 8, 20 ) );

        oParser = new parserFormula( "HYPGEOMDIST(1,4,8,20)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), hypgeomdist( 1, 4, 8, 20 ) );

        oParser = new parserFormula( "HYPGEOMDIST(-1,4,8,20)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "HYPGEOMDIST(5,4,8,20)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

    } )

    test( "Test: \"INTERCEPT\"", function () {

        function intercept( y, x ) {

            var fSumDeltaXDeltaY = 0, fSumSqrDeltaX = 0, _x = 0, _y = 0, xLength = 0;
            for ( var i = 0; i < x.length; i++ ) {
                _x += x[i];
                _y += y[i];
                xLength++;
            }

            _x /= xLength;
            _y /= xLength;

            for ( var i = 0; i < x.length; i++ ) {

                var fValX = x[i];
                var fValY = y[i];

                fSumDeltaXDeltaY += ( fValX - _x ) * ( fValY - _y );
                fSumSqrDeltaX += ( fValX - _x ) * ( fValX - _x );

            }

            return toFixed( _y - fSumDeltaXDeltaY / fSumSqrDeltaX * _x );

        }

        oParser = new parserFormula( "INTERCEPT({6,7,9,15,21},{20,28,31,38,40})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), intercept( [6, 7, 9, 15, 21], [20, 28, 31, 38, 40] ) );

    } )

    test( "Test: \"KURT\"", function () {

        function kurt( x ) {

            var sumSQRDeltaX = 0, _x = 0, xLength = 0, standDev = 0, sumSQRDeltaXDivstandDev = 0;
            for ( var i = 0; i < x.length; i++ ) {
                _x += x[i];
                xLength++;
            }

            _x /= xLength;

            for ( var i = 0; i < x.length; i++ ) {
                sumSQRDeltaX += Math.pow( x[i] - _x, 2 );
            }

            standDev = Math.sqrt( sumSQRDeltaX / ( xLength - 1 ) );

            for ( var i = 0; i < x.length; i++ ) {
                sumSQRDeltaXDivstandDev += Math.pow( (x[i] - _x) / standDev, 4 );
            }

            return toFixed( xLength * (xLength + 1) / (xLength - 1) / (xLength - 2) / (xLength - 3) * sumSQRDeltaXDivstandDev - 3 * (xLength - 1) * (xLength - 1) / (xLength - 2) / (xLength - 3) )

        }

        oParser = new parserFormula( "KURT(10.5,12.4,19.4,23.2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), kurt( [10.5, 12.4, 19.4, 23.2] ) );

        oParser = new parserFormula( "KURT(10.5,{12.4,19.4},23.2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), kurt( [10.5, 12.4, 19.4, 23.2] ) );

        oParser = new parserFormula( "KURT(10.5,12.4,19.4)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

    } )

    test( "Test: \"LARGE\"", function () {

        oParser = new parserFormula( "LARGE({3,5,3,5,4;4,2,4,6,7},3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 5 );

        oParser = new parserFormula( "LARGE({3,5,3,5,4;4,2,4,6,7},7)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 4 );

    } )

    test( "Test: \"MEDIAN\"", function () {

        function median( x ) {

            x.sort(fSortAscending);

            if ( x.length % 2 )
                return x[(x.length - 1) / 2];
            else
                return (x[x.length / 2 - 1] + x[x.length / 2]) / 2;
        }

        oParser = new parserFormula( "MEDIAN(10.5,12.4,19.4,23.2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), median( [10.5, 12.4, 19.4, 23.2] ) );

        oParser = new parserFormula( "MEDIAN(10.5,{12.4,19.4},23.2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), median( [10.5, 12.4, 19.4, 23.2] ) );

        oParser = new parserFormula( "MEDIAN(-3.5,1.4,6.9,-4.5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), median( [-3.5, 1.4, 6.9, -4.5] ) );

    } )

    test( "Test: \"MODE\"", function () {

        function mode( x ) {

            x.sort(AscCommon.fSortDescending);

            if ( x.length < 1 )
                return "#VALUE!";
            else {
                var nMaxIndex = 0, nMax = 1, nCount = 1, nOldVal = x[0], i;

                for ( i = 1; i < x.length; i++ ) {
                    if ( x[i] == nOldVal )
                        nCount++;
                    else {
                        nOldVal = x[i];
                        if ( nCount > nMax ) {
                            nMax = nCount;
                            nMaxIndex = i - 1;
                        }
                        nCount = 1;
                    }
                }
                if ( nCount > nMax ) {
                    nMax = nCount;
                    nMaxIndex = i - 1;
                }
                if ( nMax == 1 && nCount == 1 )
                    return "#VALUE!";
                else if ( nMax == 1 )
                    return nOldVal;
                else
                    return x[nMaxIndex];
            }
        }

        oParser = new parserFormula( "MODE(9,1,5,1,9,5,6,6)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), mode( [9, 1, 5, 1, 9, 5, 6, 6] ) );

        oParser = new parserFormula( "MODE(1,9,5,1,9,5,6,6)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), mode( [1, 9, 5, 1, 9, 5, 6, 6] ) );

        oParser = new parserFormula( "MODE(1,9,5,5,9,5,6,6)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), mode( [1, 9, 5, 5, 9, 5, 6, 6] ) );

    } )

    test( "Test: \"NORMDIST\"", function () {

        function normdist( x, mue, sigma, kum ) {
            if ( sigma <= 0 )
                return "#NUM!";
            else if ( kum == false )
                return toFixed( AscCommonExcel.phi( (x - mue) / sigma ) / sigma );
            else
                return toFixed( 0.5 + AscCommonExcel.gauss( (x - mue) / sigma ) );

        }

        oParser = new parserFormula( "NORMDIST(42,40,1.5,TRUE)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), normdist( 42, 40, 1.5, true ) );

        oParser = new parserFormula( "NORMDIST(42,40,1.5,FALSE)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), normdist( 42, 40, 1.5, false ) );

        oParser = new parserFormula( "NORMDIST(42,40,-1.5,TRUE)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), normdist( 42, 40, -1.5, true ) );

        oParser = new parserFormula( "NORMDIST(1,40,-1.5,TRUE)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), normdist( 1, 40, -1.5, true ) );

    } )

    test( "Test: \"NORMSDIST\"", function () {

        function normsdist( x ) {
            return toFixed( 0.5 + AscCommonExcel.gauss( x ) );
        }

        oParser = new parserFormula( "NORMSDIST(1.333333)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), normsdist( 1.333333 ) );

        oParser = new parserFormula( "NORMSDIST(-1.5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), normsdist( -1.5 ) );

    } )

    test( "Test: \"NEGBINOMDIST\"", function () {

        function negbinomdist( x, r, p ) {
            x = parseInt( x );
            r = parseInt( r );
            if ( x < 0 || r < 1 || p < 0 || p > 1 )
                return "#NUM!";
            else
                return toFixed( Math.binomCoeff( x + r - 1, r - 1 ) * Math.pow( p, r ) * Math.pow( 1 - p, x ) );
        }

        oParser = new parserFormula( "NEGBINOMDIST(6,10,0.5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), negbinomdist( 6, 10, 0.5 ) );

        oParser = new parserFormula( "NEGBINOMDIST(6,10,1.5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), negbinomdist( 6, 10, 1.5 ) );

        oParser = new parserFormula( "NEGBINOMDIST(20,10,0.63)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), negbinomdist( 20, 10, 0.63 ) );

    } )

    test( "Test: \"NORMSINV\"", function () {

        function normsinv( x ) {
            if ( x <= 0.0 || x >= 1.0 )
                return "#N/A";
            else
                return toFixed( AscCommonExcel.gaussinv( x ) );
        }

        oParser = new parserFormula( "NORMSINV(0.954)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), normsinv( 0.954 ) );

        oParser = new parserFormula( "NORMSINV(0.13)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), normsinv( 0.13 ) );

        oParser = new parserFormula( "NORMSINV(0.6782136)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), normsinv( 0.6782136 ) );

        oParser = new parserFormula( "NORMSINV(1.6782136)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), normsinv( 1.6782136 ) );

        oParser = new parserFormula( "NORMSINV(-1.6782136)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), normsinv( -1.6782136 ) );

    } )

    test( "Test: \"LOGINV\"", function () {

        function loginv( x, mue, sigma ) {
            if ( sigma <= 0 || x <= 0 || x >= 1 )
                return "#NUM!";
            else
                return toFixed( Math.exp( mue + sigma * ( AscCommonExcel.gaussinv( x ) ) ) );
        }

        oParser = new parserFormula( "LOGINV(0.039084,3.5,1.2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), loginv( 0.039084, 3.5, 1.2 ) );

        oParser = new parserFormula( "LOGINV(0,3.5,1.2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), loginv( 0, 3.5, 1.2 ) );

        oParser = new parserFormula( "LOGINV(0,3.5,1.2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), loginv( 10, 3.5, 1.2 ) );

        oParser = new parserFormula( "LOGINV(0,3.5,1.2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), loginv( -10, 3.5, 1.2 ) );
    } )

    test( "Test: \"NORMINV\"", function () {

        function norminv( x, mue, sigma ) {
            if ( sigma <= 0.0 || x <= 0.0 || x >= 1.0 )
                return "#NUM!";
            else
                return toFixed( AscCommonExcel.gaussinv( x ) * sigma + mue );
        }

        oParser = new parserFormula( "NORMINV(0.954,40,1.5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), norminv( 0.954, 40, 1.5 ) );

        oParser = new parserFormula( "NORMINV(0.13,100,0.5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), norminv( 0.13, 100, 0.5 ) );

        oParser = new parserFormula( "NORMINV(0.6782136,6,0.005)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), norminv( 0.6782136, 6, 0.005 ) );

        oParser = new parserFormula( "NORMINV(-1.6782136,7,0)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), norminv( -1.6782136, 7, 0 ) );

    } )

    test( "Test: \"PEARSON\"", function () {

        function pearson( x, y ) {

            var sumXDeltaYDelta = 0, sqrXDelta = 0, sqrYDelta = 0, _x = 0, _y = 0, xLength = 0;

            if ( x.length != y.length )
                return "#N/A"
            for ( var i = 0; i < x.length; i++ ) {

                _x += x[i]
                _y += y[i]
                xLength++;
            }

            _x /= xLength;
            _y /= xLength;

            for ( var i = 0; i < x.length; i++ ) {

                sumXDeltaYDelta += (x[i] - _x) * (y[i] - _y);
                sqrXDelta += (x[i] - _x) * (x[i] - _x);
                sqrYDelta += (y[i] - _y) * (y[i] - _y);

            }

            if ( sqrXDelta == 0 || sqrYDelta == 0 )
                return "#DIV/0!"
            else
                return toFixed( sumXDeltaYDelta / Math.sqrt( sqrXDelta * sqrYDelta ) );
        }

        oParser = new parserFormula( "PEARSON({9,7,5,3,1},{10,6,1,5,3})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), pearson( [9, 7, 5, 3, 1], [10, 6, 1, 5, 3] ) );

    } )

    test( "Test: \"PERCENTILE\"", function () {

        function percentile( A, k ) {

            A.sort(fSortAscending)

            var nSize = A.length;
            if ( A.length < 1 || nSize == 0 )
                return new AscCommonExcel.cError( AscCommonExcel.cErrorType.not_available ).toString();
            else {
                if ( nSize == 1 )
                    return toFixed( A[0] );
                else {
                    var nIndex = Math.floor( k * (nSize - 1) );
                    var fDiff = k * (nSize - 1) - Math.floor( k * (nSize - 1) );
                    if ( fDiff == 0.0 )
                        return toFixed( A[nIndex] );
                    else {
                        return toFixed( A[nIndex] +
                            fDiff * (A[nIndex + 1] - A[nIndex]) );
                    }
                }
            }

        }

        oParser = new parserFormula( "PERCENTILE({1,3,2,4},0.3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), percentile( [1, 3, 2, 4], 0.3 ) );

        oParser = new parserFormula( "PERCENTILE({1,3,2,4},0.75)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), percentile( [1, 3, 2, 4], 0.75 ) );

    } )

    test( "Test: \"PERCENTRANK\"", function () {

        function percentrank( A, x, k ) {

            var tA = A, t, fNum = x;

            if ( !k ) k = 3;

            tA.sort(fSortAscending);

            var nSize = tA.length;
            if ( tA.length < 1 || nSize == 0 )
                return "#N/A";

            else {
                if ( fNum < tA[0] || fNum > tA[nSize - 1] )
                    return "#N/A";
                else if ( nSize == 1 )
                    return 1
                else {
                    var fRes, nOldCount = 0, fOldVal = tA[0], i;
                    for ( i = 1; i < nSize && tA[i] < fNum; i++ ) {
                        if ( tA[i] != fOldVal ) {
                            nOldCount = i;
                            fOldVal = tA[i];
                        }
                    }
                    if ( tA[i] != fOldVal )
                        nOldCount = i;
                    if ( fNum == tA[i] )
                        fRes = nOldCount / (nSize - 1);
                    else {
                        if ( nOldCount == 0 ) {
                            fRes = 0.0;
                        }
                        else {
                            var fFract = ( fNum - tA[nOldCount - 1] ) /
                                ( tA[nOldCount] - tA[nOldCount - 1] );
                            fRes = ( nOldCount - 1 + fFract ) / (nSize - 1);
                        }
                    }
                    return fRes.toString().substr( 0, fRes.toString().indexOf( "." ) + 1 + k ) - 0;
                }
            }
        }

        oParser = new parserFormula( "PERCENTRANK({12,6,7,9,3,8},4)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), percentrank( [12, 6, 7, 9, 3, 8], 4 ) );

        oParser = new parserFormula( "PERCENTRANK({12,6,7,9,3,8},5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), percentrank( [12, 6, 7, 9, 3, 8], 5 ) );

    } )

    test( "Test: \"POISSON\"", function () {

        function poisson( x, l, cumulativeFlag ) {
            var _x = parseInt( x ), _l = l, f = cumulativeFlag;

            if ( f ) {
                var sum = 0;
                for ( var k = 0; k <= x; k++ ) {
                    sum += Math.pow( _l, k ) / Math.fact( k );
                }
                sum *= Math.exp( -_l );
                return toFixed( sum );
            }
            else {
                return toFixed( Math.exp( -_l ) * Math.pow( _l, _x ) / Math.fact( _x ) );
            }

        }

        oParser = new parserFormula( "POISSON(8,2,false)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), poisson( 8, 2, false ) );

        oParser = new parserFormula( "POISSON(8,2,true)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), poisson( 8, 2, true ) );

        oParser = new parserFormula( "POISSON(2.6,5,false)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), poisson( 2, 5, false ) );

        oParser = new parserFormula( "POISSON(2,5.7,true)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), poisson( 2, 5.7, true ) );

        oParser = new parserFormula( "POISSON(-6,5,true)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "POISSON(6,-5,false)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );
    } )

    test( "Test: \"PROB\"", function () {

        oParser = new parserFormula( "PROB({0,1,2,3},{0.2,0.3,0.1,0.4},2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 0.1 );

        oParser = new parserFormula( "PROB({0,1,2,3},{0.2,0.3,0.1,0.4},1,4)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 0.8 );

    } )

    test( "Test: \"PROB\"", function () {

        function quartile( A, k ) {

            var fFlag = k;

            A.sort(fSortAscending);

            var nSize = A.length;
            if ( A.length < 1 || nSize == 0 )
                return "#N/A"
            else {
                if ( nSize == 1 )
                    return toFixed( A[0] );
                else {

                    if ( fFlag < 0.0 || fFlag > 4 )
                        return "#NUM!";
                    else if ( fFlag == 0.0 )
                        return toFixed( A[0] );
                    else if ( fFlag == 1.0 ) {
                        var nIndex = Math.floor( 0.25 * (nSize - 1) ),
                            fDiff = 0.25 * (nSize - 1) - Math.floor( 0.25 * (nSize - 1) );
                        if ( fDiff == 0.0 )
                            return toFixed( A[nIndex] );
                        else {
                            return toFixed( A[nIndex] +
                                fDiff * (A[nIndex + 1] - A[nIndex]) );
                        }
                    }
                    else if ( fFlag == 2.0 ) {
                        if ( nSize % 2 == 0 )
                            return toFixed( (A[nSize / 2 - 1] + A[nSize / 2]) / 2.0 );
                        else
                            return toFixed( A[(nSize - 1) / 2] );
                    }
                    else if ( fFlag == 3.0 ) {
                        var nIndex = Math.floor( 0.75 * (nSize - 1) ),
                            fDiff = 0.75 * (nSize - 1) - Math.floor( 0.75 * (nSize - 1) );
                        if ( fDiff == 0.0 )
                            return toFixed( A[nIndex] );
                        else {
                            return toFixed( A[nIndex] +
                                fDiff * (A[nIndex + 1] - A[nIndex]) );
                        }
                    }
                    else
                        return toFixed( A[nSize - 1] );

                }
            }

        }

        oParser = new parserFormula( "QUARTILE({1,2,4,7,8,9,10,12},-1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), quartile( [1, 2, 4, 7, 8, 9, 10, 12], -1 ) );

        oParser = new parserFormula( "QUARTILE({1,2,4,7,8,9,10,12},0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), quartile( [1, 2, 4, 7, 8, 9, 10, 12], 0 ) );

        oParser = new parserFormula( "QUARTILE({1,2,4,7,8,9,10,12},1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), quartile( [1, 2, 4, 7, 8, 9, 10, 12], 1 ) );

        oParser = new parserFormula( "QUARTILE({1,2,4,7,8,9,10,12},2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), quartile( [1, 2, 4, 7, 8, 9, 10, 12], 2 ) );

        oParser = new parserFormula( "QUARTILE({1,2,4,7,8,9,10,12},3)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), quartile( [1, 2, 4, 7, 8, 9, 10, 12], 3 ) );

        oParser = new parserFormula( "QUARTILE({1,2,4,7,8,9,10,12},4)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), quartile( [1, 2, 4, 7, 8, 9, 10, 12], 4 ) );

        oParser = new parserFormula( "QUARTILE({1,2,4,7,8,9,10,12},5)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), quartile( [1, 2, 4, 7, 8, 9, 10, 12], 5 ) );

    } )

    test( "Test: \"RSQ\"", function () {

        function rsq( x, y ) {

            var sumXDeltaYDelta = 0, sqrXDelta = 0, sqrYDelta = 0, _x = 0, _y = 0, xLength = 0;

            if ( x.length != y.length )
                return "#N/A"
            for ( var i = 0; i < x.length; i++ ) {

                _x += x[i]
                _y += y[i]
                xLength++;
            }

            _x /= xLength;
            _y /= xLength;

            for ( var i = 0; i < x.length; i++ ) {

                sumXDeltaYDelta += (x[i] - _x) * (y[i] - _y);
                sqrXDelta += (x[i] - _x) * (x[i] - _x);
                sqrYDelta += (y[i] - _y) * (y[i] - _y);

            }

            if ( sqrXDelta == 0 || sqrYDelta == 0 )
                return "#DIV/0!"
            else
                return toFixed( Math.pow( sumXDeltaYDelta / Math.sqrt( sqrXDelta * sqrYDelta ), 2 ) );
        }

        oParser = new parserFormula( "RSQ({9,7,5,3,1},{10,6,1,5,3})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), rsq( [9, 7, 5, 3, 1], [10, 6, 1, 5, 3] ) );

        oParser = new parserFormula( "RSQ({2,3,9,1,8,7,5},{6,5,11,7,5,4,4})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), rsq( [2, 3, 9, 1, 8, 7, 5], [6, 5, 11, 7, 5, 4, 4] ) );

    } )

    test( "Test: \"SKEW\"", function () {

        function skew( x ) {

            var sumSQRDeltaX = 0, _x = 0, xLength = 0, standDev = 0, sumSQRDeltaXDivstandDev = 0;
            for ( var i = 0; i < x.length; i++ ) {

                _x += x[i];
                xLength++;

            }

            if ( xLength <= 2 )
                return "#N/A"

            _x /= xLength;

            for ( var i = 0; i < x.length; i++ ) {

                sumSQRDeltaX += Math.pow( x[i] - _x, 2 );

            }

            standDev = Math.sqrt( sumSQRDeltaX / ( xLength - 1 ) );

            for ( var i = 0; i < x.length; i++ ) {

                sumSQRDeltaXDivstandDev += Math.pow( (x[i] - _x) / standDev, 3 );

            }

            return toFixed( xLength / (xLength - 1) / (xLength - 2) * sumSQRDeltaXDivstandDev )

        }

        oParser = new parserFormula( "SKEW(3,4,5,2,3,4,5,6,4,7)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), skew( [3, 4, 5, 2, 3, 4, 5, 6, 4, 7] ) );

        oParser = new parserFormula( "SKEW({2,3,9,1,8,7,5},{6,5,11,7,5,4,4})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), skew( [2, 3, 9, 1, 8, 7, 5, 6, 5, 11, 7, 5, 4, 4] ) );

    } )

    test( "Test: \"SMALL\"", function () {

        oParser = new parserFormula( "SMALL({3,5,3,5,4;4,2,4,6,7},3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3 );

        oParser = new parserFormula( "SMALL({3,5,3,5,4;4,2,4,6,7},7)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 5 );

    } )

    test( "Test: \"SLOPE\"", function () {

        function slope( y, x ) {

            var sumXDeltaYDelta = 0, sqrXDelta = 0, _x = 0, _y = 0, xLength = 0;

            if ( x.length != y.length )
                return "#N/A"
            for ( var i = 0; i < x.length; i++ ) {

                _x += x[i]
                _y += y[i]
                xLength++;
            }

            _x /= xLength;
            _y /= xLength;

            for ( var i = 0; i < x.length; i++ ) {

                sumXDeltaYDelta += (x[i] - _x) * (y[i] - _y);
                sqrXDelta += (x[i] - _x) * (x[i] - _x);

            }

            if ( sqrXDelta == 0 )
                return "#DIV/0!"
            else
                return toFixed( sumXDeltaYDelta / sqrXDelta );
        }

        oParser = new parserFormula( "SLOPE({9,7,5,3,1},{10,6,1,5,3})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), slope( [9, 7, 5, 3, 1], [10, 6, 1, 5, 3] ) );

        oParser = new parserFormula( "SLOPE({2,3,9,1,8,7,5},{6,5,11,7,5,4,4})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), slope( [2, 3, 9, 1, 8, 7, 5], [6, 5, 11, 7, 5, 4, 4] ) );

    } )

    test( "Test: \"STANDARDIZE\"", function () {

        function STANDARDIZE( x, mean, sigma ) {

            if ( sigma <= 0 )
                return "#NUM!"
            else
                return toFixed( (x - mean) / sigma );
        }

        oParser = new parserFormula( "STANDARDIZE(42,40,1.5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), STANDARDIZE( 42, 40, 1.5 ) );

        oParser = new parserFormula( "STANDARDIZE(22,12,2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), STANDARDIZE( 22, 12, 2 ) );

        oParser = new parserFormula( "STANDARDIZE(22,12,-2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), STANDARDIZE( 22, 12, -2 ) );

    } )

    test( "Test: \"STDEV\"", function () {

        function stdev() {
            var average = 0, res = 0;
            for ( var i = 0; i < arguments.length; i++ ) {
                average += arguments[i];
            }
            average /= arguments.length;
            for ( var i = 0; i < arguments.length; i++ ) {
                res += (arguments[i] - average) * (arguments[i] - average);
            }
            return toFixed( Math.sqrt( res / (arguments.length - 1) ) );
        }

        oParser = new parserFormula( "STDEV(123,134,143,173,112,109)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), stdev( 123, 134, 143, 173, 112, 109 ) );

        ws.getRange2( "E400" ).setValue( "\"123\"" );
        ws.getRange2( "E401" ).setValue( "134" );
        ws.getRange2( "E402" ).setValue( "143" );
        ws.getRange2( "E403" ).setValue( "173" );
        ws.getRange2( "E404" ).setValue( "112" );
        ws.getRange2( "E405" ).setValue( "109" );

        oParser = new parserFormula( "STDEV(E400:E405)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), stdev( 134, 143, 173, 112, 109 ) );

    } )

    test( "Test: \"STDEVA\"", function () {

        ws.getRange2( "E400" ).setValue( "\"123\"" );
        ws.getRange2( "E401" ).setValue( "134" );
        ws.getRange2( "E402" ).setValue( "143" );
        ws.getRange2( "E403" ).setValue( "173" );
        ws.getRange2( "E404" ).setValue( "112" );
        ws.getRange2( "E405" ).setValue( "109" );


        function stdeva() {
            var average = 0, res = 0;
            for ( var i = 0; i < arguments.length; i++ ) {
                average += arguments[i];
            }
            average /= arguments.length;
            for ( var i = 0; i < arguments.length; i++ ) {
                res += (arguments[i] - average) * (arguments[i] - average);
            }
            return toFixed( Math.sqrt( res / (arguments.length - 1) ) );
        }

        oParser = new parserFormula( "STDEVA(123,134,143,173,112,109)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), stdeva( 123, 134, 143, 173, 112, 109 ) );

        oParser = new parserFormula( "STDEVA(123,134,143,173,112,109)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), stdeva( 123, 134, 143, 173, 112, 109 ) );

    } )

    test( "Test: \"VAR\"", function () {

        function _var( x ) {

            var sumSQRDeltaX = 0, _x = 0, xLength = 0, standDev = 0, sumSQRDeltaXDivstandDev = 0;
            for ( var i = 0; i < x.length; i++ ) {
                _x += x[i];
                xLength++;
            }

            _x /= xLength;

            for ( var i = 0; i < x.length; i++ ) {
                sumSQRDeltaX += Math.pow( x[i] - _x, 2 );
            }

            return toFixed( sumSQRDeltaX / (xLength - 1) )

        }

        oParser = new parserFormula( "VAR(10.5,12.4,19.4,23.2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), _var( [10.5, 12.4, 19.4, 23.2] ) );

        oParser = new parserFormula( "VAR(10.5,{12.4,19.4},23.2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), _var( [10.5, 12.4, 19.4, 23.2] ) );

        oParser = new parserFormula( "VAR(10.5,12.4,19.4)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), _var( [10.5, 12.4, 19.4] ) );

    } )

    /*
    * Lookup and Reference
    */
    test( "Test: \"HLOOKUP\"", function () {

        ws.getRange2( "A401" ).setValue( "Axles" );ws.getRange2( "B401" ).setValue( "Bearings" );ws.getRange2( "C401" ).setValue( "Bolts" );
        ws.getRange2( "A402" ).setValue( "4" );ws.getRange2( "B402" ).setValue( "6" );ws.getRange2( "C402" ).setValue( "9" );
        ws.getRange2( "A403" ).setValue( "5" );ws.getRange2( "B403" ).setValue( "7" );ws.getRange2( "C403" ).setValue( "10" );
        ws.getRange2( "A404" ).setValue( "6" );ws.getRange2( "B404" ).setValue( "8" );ws.getRange2( "C404" ).setValue( "11" );


        oParser = new parserFormula( "HLOOKUP(\"Axles\",A401:C404,2,TRUE)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 4 );

        oParser = new parserFormula( "HLOOKUP(\"Bearings\",A401:C404,3,FALSE)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 7 );

        oParser = new parserFormula( "HLOOKUP(\"B\",A401:C404,3,TRUE)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 5 );

        oParser = new parserFormula( "HLOOKUP(\"Bolts\",A401:C404,4)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 11 );

        oParser = new parserFormula( "HLOOKUP(3,{1,2,3;\"a\",\"b\",\"c\";\"d\",\"e\",\"f\"},2,TRUE)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "c" );

    } )

    test( "Test: \"VLOOKUP\"", function () {

        ws.getRange2( "A501" ).setValue( "Density" );ws.getRange2( "B501" ).setValue( "Bearings" );ws.getRange2( "C501" ).setValue( "Bolts" );

        ws.getRange2( "A502" ).setValue( "0.457" );ws.getRange2( "B502" ).setValue( "3.55" );ws.getRange2( "C502" ).setValue( "500" );
        ws.getRange2( "A503" ).setValue( "0.525" );ws.getRange2( "B503" ).setValue( "3.25" );ws.getRange2( "C503" ).setValue( "400" );
        ws.getRange2( "A504" ).setValue( "0.616" );ws.getRange2( "B504" ).setValue( "2.93" );ws.getRange2( "C504" ).setValue( "300" );
        ws.getRange2( "A505" ).setValue( "0.675" );ws.getRange2( "B505" ).setValue( "2.75" );ws.getRange2( "C505" ).setValue( "250" );
        ws.getRange2( "A506" ).setValue( "0.746" );ws.getRange2( "B506" ).setValue( "2.57" );ws.getRange2( "C506" ).setValue( "200" );
        ws.getRange2( "A507" ).setValue( "0.835" );ws.getRange2( "B507" ).setValue( "2.38" );ws.getRange2( "C507" ).setValue( "15" );
        ws.getRange2( "A508" ).setValue( "0.946" );ws.getRange2( "B508" ).setValue( "2.17" );ws.getRange2( "C508" ).setValue( "100" );
        ws.getRange2( "A509" ).setValue( "1.09" );ws.getRange2( "B509" ).setValue( "1.95" );ws.getRange2( "C509" ).setValue( "50" );
        ws.getRange2( "A510" ).setValue( "1.29" );ws.getRange2( "B510" ).setValue( "1.71" );ws.getRange2( "C510" ).setValue( "0" );


        oParser = new parserFormula( "VLOOKUP(1,A502:C510,2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2.17 );

        oParser = new parserFormula( "VLOOKUP(1,A502:C510,3,TRUE)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 100.00 );

        oParser = new parserFormula( "VLOOKUP(2,A502:C510,2,TRUE)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1.71 );

    } )

    test( "Test: \"MATCH\"", function () {

        ws.getRange2( "A551" ).setValue( "28" );
        ws.getRange2( "A552" ).setValue( "29" );
        ws.getRange2( "A553" ).setValue( "31" );
        ws.getRange2( "A554" ).setValue( "45" );
        ws.getRange2( "A555" ).setValue( "89" );

        ws.getRange2( "B551" ).setValue( "89" );
        ws.getRange2( "B552" ).setValue( "45" );
        ws.getRange2( "B553" ).setValue( "31" );
        ws.getRange2( "B554" ).setValue( "29" );
        ws.getRange2( "B555" ).setValue( "28" );

        ws.getRange2( "C551" ).setValue( "89" );
        ws.getRange2( "C552" ).setValue( "45" );
        ws.getRange2( "C553" ).setValue( "31" );
        ws.getRange2( "C554" ).setValue( "29" );
        ws.getRange2( "C555" ).setValue( "28" );

        oParser = new parserFormula( "MATCH(30,A551:A555,-1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#N/A" );

        oParser = new parserFormula( "MATCH(30,A551:A555,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2 );

        oParser = new parserFormula( "MATCH(30,A551:A555,0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#N/A" );

        oParser = new parserFormula( "MATCH(30,B551:B555)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#N/A" );

        oParser = new parserFormula( "MATCH(30,B551:B555,-1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3 );

        oParser = new parserFormula( "MATCH(30,B551:B555,0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#N/A" );

        oParser = new parserFormula( "MATCH(31,C551:C555,0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3 );

        oParser = new parserFormula( "MATCH(\"b\",{\"a\";\"b\";\"c\"},0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2 );

    } )

    test( "Test: \"INDEX\"", function () {

        ws.getRange2( "A651" ).setValue( "1" );
        ws.getRange2( "A652" ).setValue( "2" );
        ws.getRange2( "A653" ).setValue( "3" );
        ws.getRange2( "A654" ).setValue( "4" );
        ws.getRange2( "A655" ).setValue( "5" );

        ws.getRange2( "B651" ).setValue( "6" );
        ws.getRange2( "B652" ).setValue( "7" );
        ws.getRange2( "B653" ).setValue( "8" );
        ws.getRange2( "B654" ).setValue( "9" );
        ws.getRange2( "B655" ).setValue( "10" );

        ws.getRange2( "C651" ).setValue( "11" );
        ws.getRange2( "C652" ).setValue( "12" );
        ws.getRange2( "C653" ).setValue( "13" );
        ws.getRange2( "C654" ).setValue( "14" );
        ws.getRange2( "C655" ).setValue( "15" );

        oParser = new parserFormula( "INDEX({\"Apples\",\"Lemons\";\"Bananas\",\"Pears\"},2,2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "Pears" );

        oParser = new parserFormula( "INDEX({\"Apples\",\"Lemons\";\"Bananas\",\"Pears\"},1,2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "Lemons" );

        oParser = new parserFormula( "INDEX(\"Apples\",2,2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

        oParser = new parserFormula( "INDEX({\"Apples\",\"Lemons\"},,2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "Lemons" );

        oParser = new parserFormula( "INDEX(A651:C655,,2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue().getValue(), 6 );

        oParser = new parserFormula( "INDEX(A651:C655,3,2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue().getValue(), 8 );

        oParser = new parserFormula( "INDEX(A651:C655,10,2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#REF!" );

    } )

    test( "Test: \"OFFSET\"", function () {

        ws.getRange2( "C150" ).setValue( "1" );
        ws.getRange2( "D150" ).setValue( "2" );
        ws.getRange2( "E150" ).setValue( "3" );

        ws.getRange2( "C151" ).setValue( "2" );
        ws.getRange2( "D151" ).setValue( "3" );
        ws.getRange2( "E151" ).setValue( "4" );

        ws.getRange2( "C152" ).setValue( "3" );
        ws.getRange2( "D152" ).setValue( "4" );
        ws.getRange2( "E152" ).setValue( "5" );

        oParser = new parserFormula( "OFFSET(C3,2,3,1,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().toString(), "F5" );

        oParser = new parserFormula( "SUM(OFFSET(C151:E155,-1,0,3,3))", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 27 );

        oParser = new parserFormula( "OFFSET(B3, -2, 0, 1, 1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().toString(), "B1" );

    } )

    /*
    * Financial
    */
    test( "Test: \"FV\"", function () {

        function fv( rate, nper, pmt, pv, type ) {
            var res;
            if ( type === undefined || type === null )
                type = 0;

            if ( pv === undefined || pv === null )
                pv = 0;

            if ( rate != 0 ) {
                res = -1 * ( pv * Math.pow( 1 + rate, nper ) + pmt * ( 1 + rate * type ) * ( Math.pow( 1 + rate, nper ) - 1) / rate );
            }
            else {
                res = -1 * ( pv + pmt * nper );
            }
            return res;
        }

        oParser = new parserFormula( "FV(0.06/12,10,-200,-500,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), fv( 0.06 / 12, 10, -200, -500, 1 ) );

        oParser = new parserFormula( "FV(0.12/12,12,-1000)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), fv( 0.12 / 12, 12, -1000 ) );

        oParser = new parserFormula( "FV(0.11/12,35,-2000,,1)", "A2", ws );
        ok( oParser.parse() );
        ok( Math.abs( oParser.calculate().getValue() - fv( 0.11 / 12, 35, -2000, null, 1 ) ) < dif );

        oParser = new parserFormula( "FV(0.06/12,12,-100,-1000,1)", "A2", ws );
        ok( oParser.parse() );
        ok( Math.abs( oParser.calculate().getValue() - fv( 0.06 / 12, 12, -100, -1000, 1 ) ) < dif );

    } )

    test( "Test: \"PMT\"", function () {

        function pmt( rate, nper, pv, fv, type ) {
            var res;
            if ( type === undefined || type === null )
                type = 0;

            if ( fv === undefined || fv === null )
                fv = 0;

            if ( rate != 0 ) {
                res = -1 * ( pv * Math.pow( 1 + rate, nper ) + fv ) /
                    ( ( 1 + rate * type ) * ( Math.pow( 1 + rate, nper ) - 1 ) / rate );
            }
            else {
                res = -1 * ( pv + fv ) / nper;
            }
            return res;
        }

        oParser = new parserFormula( "PMT(0.08/12,10,10000)", "A2", ws );
        ok( oParser.parse() );
        ok( Math.abs( oParser.calculate().getValue() - pmt( 0.08 / 12, 10, 10000 ) ) < dif );

        oParser = new parserFormula( "PMT(0.08/12,10,10000,0,1)", "A2", ws );
        ok( oParser.parse() );
        ok( Math.abs( oParser.calculate().getValue() - pmt( 0.08 / 12, 10, 10000, 0, 1 ) ) < dif );

    } )

    test( "Test: \"NPER\"", function () {

        function nper(rate,pmt,pv,fv,type){

            if ( rate === undefined || rate === null )
                rate = 0;

            if ( pmt === undefined || pmt === null )
                pmt = 0;

            if ( pv === undefined || pv === null )
                pv = 0;

            if ( type === undefined || type === null )
                type = 0;

            if ( fv === undefined || fv === null )
                fv = 0;

            var res;
            if ( rate != 0 ) {
                res = (-fv * rate + pmt * (1 + rate * type)) / (rate * pv + pmt * (1 + rate * type))
                res = Math.log( res ) / Math.log( 1+rate )
            }
            else {
                res = (- pv - fv )/ pmt ;
            }
            return res;
        }

        oParser = new parserFormula( "NPER(0.12/12,-100,-1000,10000,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), nper(0.12/12,-100,-1000,10000,1) );

        oParser = new parserFormula( "NPER(0.12/12,-100,-1000)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), nper(0.12/12,-100,-1000) );

    } )

    test( "Test: \"PV\"", function () {

        function pv( rate, nper, pmt, fv, type ) {
            if ( rate != 0 ) {
                return -1 * ( fv + pmt * (1 + rate * type) * ( (Math.pow( (1 + rate), nper ) - 1) / rate ) ) / Math.pow( 1 + rate, nper )
            }
            else {
                return -1 * ( fv + pmt * nper );
            }

        }

        oParser = new parserFormula( "PV(0.08/12,12*20,500,,0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), pv( 0.08 / 12, 12 * 20, 500, 0, 0 ) );

        oParser = new parserFormula( "PV(0,12*20,500,,0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), pv( 0, 12 * 20, 500, 0, 0 ) );

    } )

    test( "Test: \"NPV\"", function () {

        oParser = new parserFormula( "NPV(0.1,-10000,3000,4200,6800)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1188.4434123352216 );

    } )

    test( "Test: \"EFFECT\"", function () {

        function effect(nr,np){

            if( nr <= 0 || np < 1 ) return "#NUM!"

            return Math.pow( ( 1 + nr/np ), np ) - 1;

        }

        oParser = new parserFormula( "EFFECT(0.0525,4)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), effect(0.0525,4) );

        oParser = new parserFormula( "EFFECT(0.0525,-4)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), effect(0.0525,-4) );

        oParser = new parserFormula( "EFFECT(0.0525,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), effect(0.0525,1) );

        oParser = new parserFormula( "EFFECT(-1,54)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), effect(-1,54) );

    } )

    test( "Test: \"ISPMT\"", function () {

        function ISPMT( rate, per, nper, pv ){

            return pv * rate * (per / nper - 1.0)

        }

        oParser = new parserFormula( "ISPMT(0.1/12,1,3*12,8000000)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), ISPMT(0.1/12,1,3*12,8000000) );

        oParser = new parserFormula( "ISPMT(0.1,1,3,8000000)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), ISPMT(0.1,1,3,8000000) );

    } )

    test( "Test: \"XNPV\"", function () {

        function xnpv( rate, valueArray, dateArray ){
            var res = 0, r = rate;

            var d1 = dateArray[0];

            for( var i = 0; i < dateArray.length; i++ ){

                res += valueArray[i] / ( Math.pow( ( 1 + r ), ( dateArray[i] - d1 ) / 365 ) )
            }

            return res;
        }

        ws.getRange2( "A701" ).setValue( "39448" );
        ws.getRange2( "A702" ).setValue( "39508" );
        ws.getRange2( "A703" ).setValue( "39751" );
        ws.getRange2( "A704" ).setValue( "39859" );
        ws.getRange2( "A705" ).setValue( "39904" );

        oParser = new parserFormula( "XNPV(0.09,{-10000,2750,4250,3250,2750},A701:A705)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), xnpv( 0.09, [-10000,2750,4250,3250,2750], [39448,39508,39751,39859,39904] ) );

        ws.getRange2( "A705" ).setValue( "43191" );

        oParser = new parserFormula( "XNPV(0.09,{-10000,2750,4250,3250,2750},A701:A705)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), xnpv( 0.09, [-10000,2750,4250,3250,2750], [39448,39508,39751,39859,43191] ) );

    } )

    test( "Test: \"IRR\"", function () {

        function irr( costArr, x ){

            if (!x) x = 0.1

            var nC = 0, g_Eps = 1e-7, fEps = 1.0, fZ = 0, fN = 0, xN = 0, nIM = 100, nMC = 0,arr0 = costArr[0], arrI, wasNegative = false, wasPositive = false;

            if( arr0 < 0 )
                wasNegative = true;
            else if( arr0 > 0 )
                wasPositive = true;

            while(fEps > g_Eps && nMC < nIM ){
                nC = 0; fZ = 0; fN = 0;
                fZ += costArr[0]/Math.pow( 1.0 + x, nC );
                fN += -nC * costArr[0]/Math.pow( 1 + x, nC + 1 );
                nC++;
                for(var i = 1; i < costArr.length; i++){
                    arrI = costArr[i];
                    fZ += arrI/Math.pow( 1.0 + x, nC );
                    fN += -nC * arrI/Math.pow( 1 + x, nC + 1 );
                    if( arrI < 0 )
                        wasNegative = true;
                    else if( arrI > 0 )
                        wasPositive = true
                    nC++
                }
                xN = x - fZ / fN;
                nMC ++;
                fEps = Math.abs( xN - x );
                x = xN;
            }


            if( !(wasNegative && wasPositive)  )
                return "#NUM!";

            if (fEps < g_Eps)
                return x;
            else
                return "#NUM!";

        }


        oParser = new parserFormula( "IRR({-70000,12000,15000,18000,21000})", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -0.021244848273410923 );

        ws.getRange2( "A705" ).setValue( "43191" );

        oParser = new parserFormula( "IRR({-70000,12000,15000,18000,21000,26000})", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 0.08663094803653171 );

        oParser = new parserFormula( "IRR({-70000,12000,15000},-0.1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -0.44350694133450463 );

        oParser = new parserFormula( "IRR({-70000},-0.1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

    } )

    test( "Test: \"ACCRINT\"", function () {

        oParser = new parserFormula( "ACCRINT(DATE(2006,3,1),DATE(2006,9,1),DATE(2006,5,1),0.1,1100,2,0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 18.333333333333332 );

        oParser = new parserFormula( "ACCRINT(DATE(2006,3,1),DATE(2006,9,1),DATE(2006,5,1),0.1,,2,0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 16.666666666666664 );

        oParser = new parserFormula( "ACCRINT(DATE(2008,3,1),DATE(2008,8,31),DATE(2010,5,1),0.1,1000,2,0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 216.94444444444444 );

        oParser = new parserFormula( "ACCRINT(DATE(2008,3,1),DATE(2008,8,31),DATE(2010,5,1),0.1,1000,2,0,TRUE)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 216.94444444444444 );

        oParser = new parserFormula( "ACCRINT(DATE(2008,3,1),DATE(2008,8,31),DATE(2010,5,1),0.1,1000,2,0,FALSE)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 216.66666666666666 );

    } )

    test( "Test: \"ACCRINTM\"", function () {

        oParser = new parserFormula( "ACCRINTM(DATE(2006,3,1),DATE(2006,5,1),0.1,1100,0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 18.333333333333332 );

        oParser = new parserFormula( "ACCRINTM(DATE(2006,3,1),DATE(2006,5,1),0.1,,0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 16.666666666666664 )

        oParser = new parserFormula( "ACCRINTM(DATE(2006,3,1),DATE(2006,5,1),0.1,)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 16.666666666666664 );

    } )

    test( "Test: \"AMORDEGRC\"", function () {

        oParser = new parserFormula( "AMORDEGRC(2400,DATE(2008,8,19),DATE(2008,12,31),300,1,0.15,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 776 );

        oParser = new parserFormula( "AMORDEGRC(2400,DATE(2008,8,19),DATE(2008,12,31),300,1,0.50,0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "AMORDEGRC(2400,DATE(2008,8,19),DATE(2008,12,31),300,1,0.20,0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 819 );

        oParser = new parserFormula( "AMORDEGRC(2400,DATE(2008,8,19),DATE(2008,12,31),300,1,0.33,0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 972 );

    } )

    test( "Test: \"AMORLINC\"", function () {

        oParser = new parserFormula( "AMORLINC(2400,DATE(2008,8,19),DATE(2008,12,31),300,1,0.15,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 360 );

        oParser = new parserFormula( "AMORLINC(2400,DATE(2008,8,19),DATE(2008,12,31),300,1,0.70,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1484 );

    } )

    test( "Test: \"CUMIPMT\"", function () {

        function cumipmt(fRate, nNumPeriods, fVal, nStartPer, nEndPer, nPayType){

            var fRmz, fZinsZ;

            if( nStartPer < 1 || nEndPer < nStartPer || fRate <= 0.0 || nEndPer > nNumPeriods  || nNumPeriods <= 0 ||
                fVal <= 0.0 || ( nPayType != 0 && nPayType != 1 ) )
                return "#NUM!"

            fRmz = _getPMT( fRate, nNumPeriods, fVal, 0.0, nPayType );

            fZinsZ = 0.0;

            if( nStartPer == 1 )
            {
                if( nPayType <= 0 )
                    fZinsZ = -fVal;

                nStartPer++;
            }

            for( var i = nStartPer ; i <= nEndPer ; i++ )
            {
                if( nPayType > 0 )
                    fZinsZ += _getFV( fRate, i - 2, fRmz, fVal, 1 ) - fRmz;
                else
                    fZinsZ += _getFV( fRate, i - 1, fRmz, fVal, 0 );
            }

            fZinsZ *= fRate;

            return fZinsZ;

        }

        oParser = new parserFormula( "CUMIPMT(0.09/12,30*12,125000,1,1,0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), cumipmt(0.09/12,30*12,125000,1,1,0) );

        oParser = new parserFormula( "CUMIPMT(0.09/12,30*12,125000,13,24,0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), cumipmt(0.09/12,30*12,125000,13,24,0) );

    } )

    test( "Test: \"CUMPRINC\"", function () {

        function cumpring(fRate, nNumPeriods, fVal, nStartPer, nEndPer, nPayType){

            var fRmz, fKapZ;

            if( nStartPer < 1 || nEndPer < nStartPer || nEndPer < 1  || fRate <= 0 || nNumPeriods <= 0 || fVal <= 0 || ( nPayType != 0 && nPayType != 1 ) )
                return "#NUM!"

            fRmz = _getPMT( fRate, nNumPeriods, fVal, 0.0, nPayType );

            fKapZ = 0.0;

            var nStart = nStartPer;
            var nEnd = nEndPer;

            if( nStart == 1 )
            {
                if( nPayType <= 0 )
                    fKapZ = fRmz + fVal * fRate;
                else
                    fKapZ = fRmz;

                nStart++;
            }

            for( var i = nStart ; i <= nEnd ; i++ )
            {
                if( nPayType > 0 )
                    fKapZ += fRmz - ( _getFV( fRate, i - 2, fRmz, fVal, 1 ) - fRmz ) * fRate;
                else
                    fKapZ += fRmz - _getFV( fRate, i - 1, fRmz, fVal, 0 ) * fRate;
            }

            return fKapZ

        }

        oParser = new parserFormula( "CUMPRINC(0.09/12,30*12,125000,1,1,0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), cumpring(0.09/12,30*12,125000,1,1,0) );

        oParser = new parserFormula( "CUMPRINC(0.09/12,30*12,-125000,1,1,0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), cumpring(0.09/12,30*12,-125000,1,1,0) );

        oParser = new parserFormula( "CUMPRINC(0.09/12,30*12,125000,13,24,0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), cumpring(0.09/12,30*12,125000,13,24,0) );

    } )

    test( "Test: \"NOMINAL\"", function () {

        function nominal(rate,np){

            if( rate <= 0 || np < 1 )
                return "#NUM!"

            return ( Math.pow( rate + 1, 1 / np ) - 1 ) * np;

        }

        oParser = new parserFormula( "NOMINAL(0.053543,4)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), nominal(0.053543,4) );

        oParser = new parserFormula( "NOMINAL(0.053543,-4)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), nominal(0.053543,-4) );

    } )

    test( "Test: \"FVSCHEDULE\"", function () {

        function fvschedule(rate,shedList){

            for( var i = 0; i < shedList.length; i++){
                rate *= 1 + shedList[i]
            }

            return rate;

        }

        oParser = new parserFormula( "FVSCHEDULE(1,{0.09,0.11,0.1})", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), fvschedule(1,[0.09,0.11,0.1]) );

    } )

    test( "Test: \"DISC\"", function () {

        function disc( settlement, maturity, pr, redemption, basis ){

            if( settlement >= maturity || pr <= 0 || redemption <= 0 || basis < 0 || basis > 4 )
                return "#NUM!"

            return ( 1.0 - pr / redemption ) / AscCommonExcel.yearFrac( settlement, maturity, basis );

        }

        oParser = new parserFormula( "DISC(DATE(2007,1,25),DATE(2007,6,15),97.975,100,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), disc( new Date(2007,0,25),new Date(2007,5,15),97.975,100,1 ) );

    } )

    test( "Test: \"DOLLARDE\"", function () {

        function dollarde( fractionalDollar, fraction ){

            if( fraction < 0 )
                return "#NUM!";
            else if( fraction == 0 )
                return "#DIV/0!";

            var fInt = Math.floor( fractionalDollar ), res  = fractionalDollar - fInt;

            res /= fraction;

            res *= Math.pow( 10, Math.ceil( Math.log( fraction ) / Math.log( 10 ) ) );

            res += fInt;

            return res;

        }

        oParser = new parserFormula( "DOLLARDE(1.02,16)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), dollarde( 1.02,16 ) );

        oParser = new parserFormula( "DOLLARDE(1.1,32)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), dollarde( 1.1,32 ) );

    } )

    test( "Test: \"DOLLARFR\"", function () {

        function dollarde( fractionalDollar, fraction ){

            if( fraction < 0 )
                return "#NUM!";
            else if( fraction == 0 )
                return "#DIV/0!";

            var fInt = Math.floor( fractionalDollar ), res  = fractionalDollar - fInt;

            res *= fraction;

            res *= Math.pow( 10.0, -Math.ceil( Math.log( fraction ) / Math.log( 10 ) ) );

            res += fInt;

            return res;

        }

        oParser = new parserFormula( "DOLLARFR(1.125,16)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), dollarde( 1.125,16 ) );

        oParser = new parserFormula( "DOLLARFR(1.125,32)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), dollarde( 1.125,32 ) );

    } )

    test( "Test: \"RECEIVED\"", function () {

        function received( settlement, maturity, investment, discount, basis ){

            if( settlement >= maturity || investment <= 0 || discount <= 0 || basis < 0 || basis > 4 )
                return "#NUM!"

            return investment / ( 1 - ( discount * AscCommonExcel.yearFrac( settlement, maturity, basis) ) )

        }

        oParser = new parserFormula( "RECEIVED(DATE(2008,2,15),DATE(2008,5,15),1000000,0.0575,2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), received( new Date(2008,1,15),new Date(2008,4,15),1000000,0.0575,2 ) );

    } )

    test( "Test: \"RATE\"", function () {

        function RateIteration( fNper, fPayment, fPv, fFv, fPayType, fGuess ) {
            function approxEqual( a, b ) {
                if ( a == b )
                    return true;
                var x = a - b;
                return (x < 0.0 ? -x : x)
                    < ((a < 0.0 ? -a : a) * (1.0 / (16777216.0 * 16777216.0)));
            }

            var bValid = true, bFound = false, fX, fXnew, fTerm, fTermDerivation, fGeoSeries, fGeoSeriesDerivation;
            var nIterationsMax = 150, nCount = 0, fEpsilonSmall = 1.0E-14, SCdEpsilon = 1.0E-7;
            fFv = fFv - fPayment * fPayType;
            fPv = fPv + fPayment * fPayType;
            if ( fNper == Math.round( fNper ) ) {
                fX = fGuess.fGuess;
                var fPowN, fPowNminus1;
                while ( !bFound && nCount < nIterationsMax ) {
                    fPowNminus1 = Math.pow( 1.0 + fX, fNper - 1.0 );
                    fPowN = fPowNminus1 * (1.0 + fX);
                    if ( approxEqual( Math.abs( fX ), 0.0 ) ) {
                        fGeoSeries = fNper;
                        fGeoSeriesDerivation = fNper * (fNper - 1.0) / 2.0;
                    }
                    else {
                        fGeoSeries = (fPowN - 1.0) / fX;
                        fGeoSeriesDerivation = fNper * fPowNminus1 / fX - fGeoSeries / fX;
                    }
                    fTerm = fFv + fPv * fPowN + fPayment * fGeoSeries;
                    fTermDerivation = fPv * fNper * fPowNminus1 + fPayment * fGeoSeriesDerivation;
                    if ( Math.abs( fTerm ) < fEpsilonSmall )
                        bFound = true;
                    else {
                        if ( approxEqual( Math.abs( fTermDerivation ), 0.0 ) )
                            fXnew = fX + 1.1 * SCdEpsilon;
                        else
                            fXnew = fX - fTerm / fTermDerivation;
                        nCount++;
                        bFound = (Math.abs( fXnew - fX ) < SCdEpsilon);
                        fX = fXnew;
                    }
                }
                bValid =(fX >=-1.0);
            }
            else {
                fX = (fGuess.fGuest < -1.0) ? -1.0 : fGuess.fGuest;
                while ( bValid && !bFound && nCount < nIterationsMax ) {
                    if ( approxEqual( Math.abs( fX ), 0.0 ) ) {
                        fGeoSeries = fNper;
                        fGeoSeriesDerivation = fNper * (fNper - 1.0) / 2.0;
                    }
                    else {
                        fGeoSeries = (Math.pow( 1.0 + fX, fNper ) - 1.0) / fX;
                        fGeoSeriesDerivation = fNper * Math.pow( 1.0 + fX, fNper - 1.0 ) / fX - fGeoSeries / fX;
                    }
                    fTerm = fFv + fPv * pow( 1.0 + fX, fNper ) + fPayment * fGeoSeries;
                    fTermDerivation = fPv * fNper * Math.pow( 1.0 + fX, fNper - 1.0 ) + fPayment * fGeoSeriesDerivation;
                    if ( Math.abs( fTerm ) < fEpsilonSmall )
                        bFound = true;
                    else {
                        if ( approxEqual( Math.abs( fTermDerivation ), 0.0 ) )
                            fXnew = fX + 1.1 * SCdEpsilon;
                        else
                            fXnew = fX - fTerm / fTermDerivation;
                        nCount++;
                        bFound = (Math.abs( fXnew - fX ) < SCdEpsilon);
                        fX = fXnew;
                        bValid = (fX >= -1.0);
                    }
                }
            }
            fGuess.fGuess = fX;
            return bValid && bFound;
        }

        function rate(nper, pmt, pv, fv, type, quess){

            if ( fv === undefined ) fv = 0;
            if ( type === undefined ) type = 0;
            if ( quess === undefined ) quess = 0.1;

            var res = {fGuess:0};

            if( RateIteration(nper, pmt, pv, fv, type, res) )
                return res.fGuess;

            return "#VALUE!"
        }

        oParser = new parserFormula( "RATE(4*12,-200,8000)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), rate(4*12,-200,8000) ), true );

        oParser = new parserFormula( "RATE(4*12,-200,8000)*12", "A2", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), rate(4*12,-200,8000)*12 ), true );

    } )

    test( "Test: \"INTRATE\"", function () {

        function intrate( settlement, maturity, investment, redemption, basis ){

            if( settlement >= maturity || investment <= 0 || redemption <= 0 || basis < 0 || basis > 4 )
                return "#NUM!"

            return ( ( redemption / investment ) - 1 ) / AscCommonExcel.yearFrac( settlement, maturity, basis )

        }

        oParser = new parserFormula( "INTRATE(DATE(2008,2,15),DATE(2008,5,15),1000000,1014420,2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), intrate( new Date(2008,1,15),new Date(2008,4,15),1000000,1014420,2 ) );

    } )

    test( "Test: \"TBILLEQ\"", function () {

        function tbilleq( settlement, maturity, discount ){

            maturity = Date.prototype.getDateFromExcel(maturity.getExcelDate() + 1)

            var d1 = settlement, d2 = maturity;
            var date1 = d1.getDate(), month1 = d1.getMonth(), year1 = d1.getFullYear(),
                date2 = d2.getDate(), month2 = d2.getMonth(), year2 = d2.getFullYear();

            var nDiff = GetDiffDate360( date1, month1, year1, date2, month2, year2, true )

            if( settlement >= maturity || discount <= 0 || nDiff > 360 )
                return "#NUM!"

            return ( 365 * discount ) / ( 360 - discount * nDiff );

        }

        oParser = new parserFormula( "TBILLEQ(DATE(2008,3,31),DATE(2008,6,1),0.0914)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), tbilleq( new Date(Date.UTC(2008,2,31)), new Date(Date.UTC(2008,5,1)), 0.0914 ) );

    } )

    test( "Test: \"TBILLPRICE\"", function () {

        function tbillprice( settlement, maturity, discount ){

            maturity = Date.prototype.getDateFromExcel(maturity.getExcelDate() + 1)

            var d1 = settlement
            var d2 = maturity

            var fFraction = AscCommonExcel.yearFrac(d1, d2, 0);

            if( fFraction - Math.floor( fFraction ) == 0 )
                return "#NUM!"

            return 100 * ( 1 - discount * fFraction );

        }

        oParser = new parserFormula( "TBILLPRICE(DATE(2008,3,31),DATE(2008,6,1),0.09)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), tbillprice( new Date(Date.UTC(2008,2,31)), new Date(Date.UTC(2008,5,1)), 0.09 ) );

    } )

    test( "Test: \"TBILLYIELD\"", function () {

        function tbillyield( settlement, maturity, pr ){

            var d1 = settlement
            var d2 = maturity
            var date1 = d1.getDate(), month1 = d1.getMonth(), year1 = d1.getFullYear(),
                date2 = d2.getDate(), month2 = d2.getMonth(), year2 = d2.getFullYear();

            var nDiff = GetDiffDate360( date1, month1, year1, date2, month2, year2, true )
            nDiff++;
            if( settlement >= maturity || pr <= 0 || nDiff > 360 )
                return "#NUM!"

            return ( ( 100 - pr ) / pr) * (360 / nDiff);

        }

        oParser = new parserFormula( "TBILLYIELD(DATE(2008,3,31),DATE(2008,6,1),98.45)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), tbillyield( new Date(2008,2,31), new Date(2008,5,1), 98.45 ) );

    } )

    test( "Test: \"COUPDAYBS\"", function () {

        function coupdaybs( settlement, maturity, frequency, basis ){

            basis = ( basis !== undefined ? basis : 0 );

            return _getcoupdaybs(settlement, maturity, frequency, basis)

        }

        oParser = new parserFormula( "COUPDAYBS(DATE(2007,1,25),DATE(2008,11,15),2,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 71 );

        oParser = new parserFormula( "COUPDAYBS(DATE(2007,1,25),DATE(2008,11,15),2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), coupdaybs( new Date(2007,0,25), new Date(2008,10,15), 2 ) );

    } )

    test( "Test: \"COUPDAYS\"", function () {

        function coupdays( settlement, maturity, frequency, basis ){

            basis = ( basis !== undefined ? basis : 0 );

            return _getcoupdays(settlement, maturity, frequency, basis)

        }

        oParser = new parserFormula( "COUPDAYS(DATE(2007,1,25),DATE(2008,11,15),2,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), coupdays( new Date(2007,0,25), new Date(2008,10,15), 2, 1 ) );

        oParser = new parserFormula( "COUPDAYS(DATE(2007,1,25),DATE(2008,11,15),2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), coupdays( new Date(2007,0,25), new Date(2008,10,15), 2 ) );

    } )

    test( "Test: \"COUPDAYSNC\"", function () {

        function coupdaysnc( settlement, maturity, frequency, basis ) {

            basis = ( basis !== undefined ? basis : 0 );

            if ( (basis != 0) && (basis != 4) ) {

                _lcl_GetCoupncd( settlement, maturity, frequency );
                return _diffDate( settlement, maturity, basis );
            }

            return _getcoupdays( new Date( settlement ), new Date( maturity ), frequency, basis ) - _getcoupdaybs( new Date( settlement ), new Date( maturity ), frequency, basis );

        }

        oParser = new parserFormula( "COUPDAYSNC(DATE(2007,1,25),DATE(2008,11,15),2,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 110 );

        oParser = new parserFormula( "COUPDAYSNC(DATE(2007,1,25),DATE(2008,11,15),2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), coupdaysnc( new Date(2007,0,25), new Date(2008,10,15), 2 ) );

    } )

    test( "Test: \"COUPNCD\"", function () {

        function coupncd( settlement, maturity, frequency, basis ) {

            basis = ( basis !== undefined ? basis : 0 );

            _lcl_GetCoupncd( settlement, maturity, frequency );

            return maturity.getExcelDate();

        }

        oParser = new parserFormula( "COUPNCD(DATE(2007,1,25),DATE(2008,11,15),2,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), coupncd( new Date(Date.UTC(2007,0,25)), new Date(Date.UTC(2008,10,15)), 2, 1 ) );

    } )

    test( "Test: \"COUPNUM\"", function () {

        oParser = new parserFormula( "COUPNUM(DATE(2007,1,25),DATE(2008,11,15),2,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), _coupnum( new Date(2007,0,25), new Date(2008,10,15), 2, 1 ) );

    } )

    test( "Test: \"COUPPCD\"", function () {

        function couppcd( settlement, maturity, frequency, basis ) {

            basis = ( basis !== undefined ? basis : 0 );

            _lcl_GetCouppcd( settlement, maturity, frequency );
            return maturity.getExcelDate();

        }

        oParser = new parserFormula( "COUPPCD(DATE(2007,1,25),DATE(2008,11,15),2,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), couppcd( new Date(Date.UTC(2007,0,25)), new Date(Date.UTC(2008,10,15)), 2, 1 ) );

    } )

    test( "Test: \"PRICE\"", function () {

        oParser = new parserFormula( "PRICE(DATE(2008,2,15),DATE(2017,11,15),0.0575,0.065,100,2,0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), _getprice( new Date( Date.UTC(2008, 1, 15 )), new Date( Date.UTC(2017, 10, 15 )), 0.0575, 0.065, 100, 2, 0 ) );

    } )

    test( "Test: \"PRICEDISC\"", function () {

        function pricedisc(settl, matur, discount, redemption, basis){
            return redemption * ( 1.0 - discount * _getdiffdate( settl, matur, basis ) );
        }

        oParser = new parserFormula( "PRICEDISC(DATE(2008,2,16),DATE(2008,3,1),0.0525,100,2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), pricedisc( new Date(2008,1,16), new Date(2008,2,1),0.0525,100,2 ) );

    } )

    test( "Test: \"PRICEMAT\"", function () {

        function pricemat( settl, matur, iss, rate, yld, basis ) {

            var fIssMat = _yearFrac( new Date(iss), new Date(matur), basis );
            var fIssSet = _yearFrac( new Date(iss), new Date(settl), basis );
            var fSetMat = _yearFrac( new Date(settl), new Date(matur), basis );

            var res = 1.0 + fIssMat * rate;
            res /= 1.0 + fSetMat * yld;
            res -= fIssSet * rate;
            res *= 100.0;

            return res;
        }

        oParser = new parserFormula( "PRICEMAT(DATE(2008,2,15),DATE(2008,4,13),DATE(2007,11,11),0.061,0.061,0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), pricemat( new Date(2008,1,15),new Date(2008,3,13),new Date(2007,10,11),0.061,0.061,0 ) );

    } )

    test( "Test: \"YIELD\"", function () {

        oParser = new parserFormula( "YIELD(DATE(2008,2,15),DATE(2016,11,15),0.0575,95.04287,100,2,0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), _getYield( new Date(Date.UTC(2008,1,15)), new Date(Date.UTC(2016,10,15)),0.0575,95.04287,100,2,0 ) );

    } )

    test( "Test: \"YIELDDISC\"", function () {

        function yielddisc( settlement, maturity, pr, redemption, basis ){

            var fRet = ( redemption / pr ) - 1.0;
            fRet /= _yearFrac( settlement, maturity, basis );
            return fRet;

        }

        oParser = new parserFormula( "YIELDDISC(DATE(2008,2,16),DATE(2008,3,1),99.795,100,2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), yielddisc( new Date( 2008, 1, 16 ), new Date( 2008, 2, 1 ), 99.795, 100, 2 ) );

    } )

    test( "Test: \"YIELDMAT\"", function () {

        oParser = new parserFormula( "YIELDMAT(DATE(2008,3,15),DATE(2008,11,3),DATE(2007,11,8),0.0625,100.0123,0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), _getyieldmat( new Date( 2008, 2, 15 ), new Date( 2008, 10, 3 ), new Date( 2007, 10, 8 ), 0.0625, 100.0123, 0 ) );

    } )

    test( "Test: \"ODDLPRICE\"", function () {

        function oddlprice( settlement, maturity, last_interest, rate, yld, redemption, frequency, basis ){

            var fDCi = _yearFrac( last_interest, maturity, basis ) * frequency;
            var fDSCi = _yearFrac( settlement, maturity, basis ) * frequency;
            var fAi = _yearFrac( last_interest, settlement, basis ) * frequency;

            var res = redemption + fDCi * 100.0 * rate / frequency;
            res /= fDSCi * yld / frequency + 1.0;
            res -= fAi * 100.0 * rate / frequency;

            return res;
        }

        oParser = new parserFormula( "ODDLPRICE(DATE(2008,11,11),DATE(2021,3,1),DATE(2008,10,15),0.0785,0.0625,100,2,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), oddlprice( new Date(Date.UTC(2008,10,11)), new Date(Date.UTC(2021,2,1)), new Date(Date.UTC(2008,9,15)), 0.0785, 0.0625, 100, 2, 1 ) );

    } )

    test( "Test: \"ODDLYIELD\"", function () {

        function oddlyield( settlement, maturity, last_interest, rate, pr, redemption, frequency, basis ){

            var fDCi = _yearFrac( last_interest, maturity, basis ) * frequency;
            var fDSCi = _yearFrac( settlement, maturity, basis ) * frequency;
            var fAi = _yearFrac( last_interest, settlement, basis ) * frequency;

            var res = redemption + fDCi * 100.0 * rate / frequency;
            res /= pr + fAi * 100.0 * rate / frequency;
            res--;
            res *= frequency / fDSCi;

            return res;
        }

        oParser = new parserFormula( "ODDLYIELD(DATE(2008,11,11),DATE(2021,3,1),DATE(2008,10,15),0.0575,84.5,100,2,0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), oddlyield( new Date(2008,10,11), new Date(2021,2,1), new Date(2008,9,15), 0.0575, 84.5, 100, 2, 0 ) );

    } )

    test( "Test: \"DURATION\"", function () {

        oParser = new parserFormula( "DURATION(DATE(2008,1,1),DATE(2016,1,1),0.08,0.09,2,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), _duration( new Date(Date.UTC(2008,0,1)), new Date(Date.UTC(2016,0,1)), 0.08, 0.09, 2, 1 ) );

        oParser = new parserFormula( "DURATION(DATE(2008,1,1),DATE(2016,1,1),-0.08,0.09,2,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), _duration( new Date(Date.UTC(2008,0,1)), new Date(Date.UTC(2016,0,1)), -0.08, 0.09, 2, 1 ) );

        oParser = new parserFormula( "DURATION(DATE(2008,1,1),DATE(2016,1,1),-0.08,0.09,5,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), _duration( new Date(Date.UTC(2008,0,1)), new Date(Date.UTC(2016,0,1)), -0.08, 0.09, 5, 1 ) );

    } )

    test( "Test: \"MDURATION\"", function () {

        function mduration(settl, matur, coupon, yld, frequency, basis){

            return _duration( settl, matur, coupon, yld, frequency, basis ) / (1 + yld/frequency);

        }

        oParser = new parserFormula( "MDURATION(DATE(2008,1,1),DATE(2016,1,1),0.08,0.09,2,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), mduration( new Date(Date.UTC(2008,0,1)), new Date(Date.UTC(2016,0,1)), 0.08, 0.09, 2, 1 ) );

    } )

    test( "Test: \"SYD\"", function () {

        function syd( cost, salvage, life, per ){

            if( life == -1 || life == 0 )
                return "#NUM!";

            var res = 2;
            res *= cost - salvage;
            res *= life+1-per;
            res /= (life+1)*life;

            return res < 0 ? "#NUM!" : res;
        }

        oParser = new parserFormula( "SYD(30000,7500,10,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), syd( 30000,7500,10,1 ) );

        oParser = new parserFormula( "SYD(30000,7500,-1,10)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), syd( 30000,7500,-1,10 ) );

        oParser = new parserFormula( "SYD(30000,7500,-10,10)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), syd( 30000,7500,-10,10 ) );

    } )

    test( "Test: \"PPMT\"", function () {

        function ppmt( rate, per, nper, pv, fv, type ){

            if( fv == undefined ) fv = 0;
            if( type == undefined ) type = 0;

            var fRmz = _getPMT(rate, nper, pv, fv, type);

            return fRmz - _getIPMT(rate, per, pv, type, fRmz);

        }

        oParser = new parserFormula( "PPMT(0.1/12,1,2*12,2000)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), ppmt( 0.1/12,1,2*12,2000 ) );

        oParser = new parserFormula( "PPMT(0.08,10,10,200000)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), ppmt( 0.08,10,10,200000 ) );

    } )

    test( "Test: \"MIRR\"", function () {

        function mirr( valueArray, fRate1_invest, fRate1_reinvest ){

            fRate1_invest = fRate1_invest + 1;
            fRate1_reinvest = fRate1_reinvest + 1;

            var fNPV_reinvest = 0, fPow_reinvest = 1, fNPV_invest = 0, fPow_invest = 1, fCellValue,
                wasNegative = false, wasPositive = false;

            for(var i = 0; i < valueArray.length; i++){
                fCellValue = valueArray[i];

                if( fCellValue > 0 ){
                    wasPositive = true;
                    fNPV_reinvest += fCellValue * fPow_reinvest;
                }
                else if( fCellValue < 0 ){
                    wasNegative = true;
                    fNPV_invest += fCellValue * fPow_invest;
                }
                fPow_reinvest /= fRate1_reinvest;
                fPow_invest /= fRate1_invest;

            }

            if( !( wasNegative && wasPositive ) )
                return "#DIV/0!";

            var fResult = -fNPV_reinvest / fNPV_invest;
            fResult *= Math.pow( fRate1_reinvest, valueArray.length - 1 );
            fResult = Math.pow( fResult, 1 / (valueArray.length - 1) );

            return fResult - 1;

        }

        oParser = new parserFormula( "MIRR({-120000,39000,30000,21000,37000,46000},0.1,0.12)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), mirr( [-120000,39000,30000,21000,37000,46000],0.1,0.12 ) );

        oParser = new parserFormula( "MIRR({-120000,39000,30000,21000},0.1,0.12)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), mirr( [-120000,39000,30000,21000],0.1,0.12 ) );

        oParser = new parserFormula( "MIRR({-120000,39000,30000,21000,37000,46000},0.1,0.14)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), mirr( [-120000,39000,30000,21000,37000,46000],0.1,0.14 ) );

    } )

    test( "Test: \"IPMT\"", function () {

        function ipmt( rate, per, nper, pv, fv, type ){

            if( fv == undefined ) fv = 0;
            if( type == undefined ) type = 0;

            var res = AscCommonExcel.getPMT(rate, nper, pv, fv, type);
            res = AscCommonExcel.getIPMT(rate, per, pv, type, res);

            return res;

        }

        oParser = new parserFormula( "IPMT(0.1/12,1*3,3,8000)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), ipmt( 0.1/12,1*3,3,8000 ) );

        oParser = new parserFormula( "IPMT(0.1,3,3,8000)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), ipmt( 0.1,3,3,8000 ) );


    } )

    test( "Test: \"DB\"", function () {

        function db( cost, salvage, life, period, month ){

            if ( salvage >= cost ) {
                return this.value = new AscCommonExcel.cNumber( 0 );
            }

            if ( month < 1 || month > 12 || salvage < 0 || life <= 0 || period < 0 || life + 1 < period || cost < 0 ) {
                return "#NUM!";
            }

            var nAbRate = 1 - Math.pow( salvage / cost, 1 / life );
            nAbRate = Math.floor( (nAbRate * 1000) + 0.5 ) / 1000;
            var nErsteAbRate = cost * nAbRate * month / 12;

            var res = 0;
            if ( Math.floor( period ) == 1 )
                res = nErsteAbRate;
            else {
                var nSummAbRate = nErsteAbRate, nMin = life;
                if ( nMin > period ) nMin = period;
                var iMax = Math.floor( nMin );
                for ( var i = 2; i <= iMax; i++ ) {
                    res = (cost - nSummAbRate) * nAbRate;
                    nSummAbRate += res;
                }
                if ( period > life )
                    res = ((cost - nSummAbRate) * nAbRate * (12 - month)) / 12;
            }

            return res

        }

        oParser = new parserFormula( "DB(1000000,100000,6,1,7)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), db(1000000,100000,6,1,7) );

        oParser = new parserFormula( "DB(1000000,100000,6,2,7)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), db(1000000,100000,6,2,7) );

        oParser = new parserFormula( "DB(1000000,100000,6,3,7)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), db(1000000,100000,6,3,7) );

        oParser = new parserFormula( "DB(1000000,100000,6,4,7)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), db(1000000,100000,6,4,7) );

        oParser = new parserFormula( "DB(1000000,100000,6,5,7)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), db(1000000,100000,6,5,7) );

        oParser = new parserFormula( "DB(1000000,100000,6,6,7)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), db(1000000,100000,6,6,7) );

        oParser = new parserFormula( "DB(1000000,100000,6,7,7)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), db(1000000,100000,6,7,7) );

    } )

    test( "Test: \"DDB\"", function () {

        function ddb( cost, salvage, life, period, factor ){

            if( factor === undefined || factor === null ) factor = 2;
            return _getDDB(cost, salvage, life, period, factor);
        }

        oParser = new parserFormula( "DDB(2400,300,10*365,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), ddb(2400,300,10*365,1) );

        oParser = new parserFormula( "DDB(2400,300,10*12,1,2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), ddb(2400,300,10*12,1,2) );

        oParser = new parserFormula( "DDB(2400,300,10,1,2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), ddb(2400,300,10,1,2) );

        oParser = new parserFormula( "DDB(2400,300,10,2,1.5)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), ddb(2400,300,10,2,1.5) );

        oParser = new parserFormula( "DDB(2400,300,10,10)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), ddb(2400,300,10,10) );

    } )

    test( "Test: \"SLN\"", function () {

        function sln( cost, salvage, life ){

            if ( life == 0 ) return "#NUM!";

            return ( cost - salvage ) / life;
        }

        oParser = new parserFormula( "SLN(30000,7500,10)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), sln(30000,7500,10) );


    } )

    test( "Test: \"XIRR\"", function () {
        function lcl_sca_XirrResult( rValues, rDates, fRate ) {
            var D_0 = rDates[0];
            var r = fRate + 1;
            var fResult = rValues[0];
            for ( var i = 1, nCount = rValues.length; i < nCount; ++i )
                fResult += rValues[i] / Math.pow( r, (rDates[i] - D_0) / 365 );
            return fResult;
        }

        function lcl_sca_XirrResult_Deriv1( rValues, rDates, fRate ) {
            var D_0 = rDates[0];
            var r = fRate + 1;
            var fResult = 0;
            for ( var i = 1, nCount = rValues.length; i < nCount; ++i ) {
                var E_i = (rDates[i] - D_0) / 365;
                fResult -= E_i * rValues[i] / Math.pow( r, E_i + 1 );
            }
            return fResult;
        }

        function xirr( valueArray, dateArray, rate ) {

            var res = rate
            if ( res <= -1 )
                return "#NUM!"

            var fMaxEps = 1e-6, maxIter = 100;

            var newRate, eps, xirrRes, bContLoop;
            do
             {
                 xirrRes = lcl_sca_XirrResult( valueArray, dateArray, res );
                 newRate = res - xirrRes / lcl_sca_XirrResult_Deriv1( valueArray, dateArray, res );
                 eps = Math.abs( newRate - res );
                 res = newRate;
                 bContLoop = (eps > fMaxEps) && (Math.abs( xirrRes ) > fMaxEps);
             }
             while ( --maxIter && bContLoop );

            if ( bContLoop )
                return "#NUM!";

            return res;

        }

        ws.getRange2( "F100" ).setValue( "1/1/2008" );
        ws.getRange2( "G100" ).setValue( "3/1/2008" );
        ws.getRange2( "H100" ).setValue( "10/30/2008" );
        ws.getRange2( "I100" ).setValue( "2/15/2009" );
        ws.getRange2( "J100" ).setValue( "4/1/2009" );

        oParser = new parserFormula( "XIRR({-10000,2750,4250,3250,2750},F100:J100,0.1)", "A2", ws );
        ok( oParser.parse() );
		ok( difBetween( oParser.calculate().getValue(), 0.3733625335188316 ) );

        ws.getRange2( "F100" ).setValue( 0 );
        ok( oParser.parse() );
		ok( difBetween( oParser.calculate().getValue(), 0.0024114950175866895 ) );

    } )

    test( "Test: \"VDB\"", function () {


        function _getVDB( cost, salvage, life, life1, startperiod, factor){
            var fVdb=0, nLoopEnd = end = Math.ceil(startperiod),
                fTerm, fLia = 0, fRestwert = cost - salvage, bNowLia = false, fGda;

            for ( var i = 1; i <= nLoopEnd; i++){
                if(!bNowLia){

                    fGda = _getDDB(cost, salvage, life, i, factor);
                    fLia = fRestwert/ (life1 - (i-1));

                    if (fLia > fGda){
                        fTerm = fLia;
                        bNowLia = true;
                    }
                    else{
                        fTerm = fGda;
                        fRestwert -= fGda;
                    }

                }
                else{
                    fTerm = fLia;
                }

                if ( i == nLoopEnd)
                    fTerm *= ( startperiod + 1.0 - end );

                fVdb += fTerm;
            }
            return fVdb;
        }

        function vdb( cost, salvage, life, startPeriod, endPeriod, factor, flag ) {

            if( factor === undefined || factor === null ) factor = 2;
            if( flag === undefined || flag === null ) flag = false;

            var start = Math.floor(startPeriod),
                end   = Math.ceil(endPeriod),
                loopStart = start,
                loopEnd   = end;

            var res = 0;
            if ( flag ) {
                for ( var i = loopStart + 1; i <= loopEnd; i++ ) {
                    var ddb = _getDDB( cost, salvage, life, i, factor );

                    if ( i == loopStart + 1 )
                        ddb *= ( Math.min( endPeriod, start + 1 ) - startPeriod );
                    else if ( i == loopEnd )
                        ddb *= ( endPeriod + 1 - end );

                    res += ddb;
                }
            }
            else {

                var life1 = life;

                if ( !Math.approxEqual( startPeriod, Math.floor( startPeriod ) ) ) {
                    if ( factor > 1 ) {
                        if ( startPeriod > life / 2 || Math.approxEqual( startPeriod, life / 2 ) ) {
                            var fPart = startPeriod - life / 2;
                            startPeriod = life / 2;
                            endPeriod -= fPart;
                            life1 += 1;
                        }
                    }
                }

                cost -= _getVDB( cost, salvage, life, life1, startPeriod, factor );
                res = _getVDB( cost, salvage, life, life - startPeriod, endPeriod - startPeriod, factor );
            }

            return res;

        }

        oParser = new parserFormula( "VDB(2400,300,10*365,0,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), vdb(2400,300,10*365,0,1) );

        oParser = new parserFormula( "VDB(2400,300,10*12,0,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), vdb(2400,300,10*12,0,1) );

        oParser = new parserFormula( "VDB(2400,300,10*12,6,18)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), vdb(2400,300,10*12,6,18) );

    } )

    test( "Test: \"ODDFPRICE\"", function () {

        oParser = new parserFormula( "ODDFPRICE(DATE(1999,2,28),DATE(2016,1,1),DATE(1998,2,28),DATE(2015,1,1),7%,0,100,2,1)", "A2", ws );
        ok( oParser.parse() );
        ok( difBetween(oParser.calculate().getValue(), 217.878453038674) );

        oParser = new parserFormula( "ODDFPRICE(DATE(2008,11,11),DATE(2021,3,1),DATE(2008,10,15),DATE(2009,3,1),0.0785,0.0625,100,2,1)", "A2", ws );
        ok( oParser.parse() );
        ok( difBetween(oParser.calculate().getValue(), 113.597717474079) );

        oParser = new parserFormula( "ODDFPRICE(DATE(1990,6,1),DATE(1995,12,31),DATE(1990,1,1),DATE(1990,12,31),6%,5%,1000,1,1)", "A2", ws );
        ok( oParser.parse() );
        ok( difBetween(oParser.calculate().getValue(), 790.11323221867) );

    } )

    test( "Test: \"ODDFYIELD\"", function () {

        oParser = new parserFormula( "ODDFYIELD(DATE(1990,6,1),DATE(1995,12,31),DATE(1990,1,1),DATE(1990,12,31),6%,790,100,1,1)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "ODDFYIELD(DATE(1990,6,1),DATE(1995,12,31),DATE(1990,1,1),DATE(1990,12,31),6%,790,100,1,1)" );
        ok( difBetween(oParser.calculate().getValue(),-0.2889178784774840 ) );

        oParser = new parserFormula( "ODDFYIELD(DATE(2008,11,11),DATE(2021,3,1),DATE(2008,10,15),DATE(2009,3,1),0.0575,84.5,100,2,0)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "ODDFYIELD(DATE(2008,11,11),DATE(2021,3,1),DATE(2008,10,15),DATE(2009,3,1),0.0575,84.5,100,2,0)" );
        ok( difBetween(oParser.calculate().getValue(), 0.0772455415972989 ) );

        oParser = new parserFormula( "ODDFYIELD(DATE(2008,12,11),DATE(2021,4,1),DATE(2008,10,15),DATE(2009,4,1),6%,100,100,4,1)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "ODDFYIELD(DATE(2008,12,11),DATE(2021,4,1),DATE(2008,10,15),DATE(2009,4,1),6%,100,100,4,1)" );
        ok( difBetween(oParser.calculate().getValue(), 0.0599769985558904 ) );

    } )

    /*
    * Engineering
    * */

    test( "Test: \"BIN2DEC\"", function () {

        oParser = new parserFormula( "BIN2DEC(101010)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2DEC(101010)" );
        strictEqual( oParser.calculate().getValue(), 42 );

        oParser = new parserFormula( "BIN2DEC(\"101010\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2DEC(\"101010\")" );
        strictEqual( oParser.calculate().getValue(), 42 );

        oParser = new parserFormula( "BIN2DEC(111111111)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2DEC(111111111)" );
        strictEqual( oParser.calculate().getValue(), 511 );

        oParser = new parserFormula( "BIN2DEC(1000000000)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2DEC(1000000000)" );
        strictEqual( oParser.calculate().getValue(), -512 );

        oParser = new parserFormula( "BIN2DEC(1111111111)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2DEC(1111111111)" );
        strictEqual( oParser.calculate().getValue(), -1 );

        oParser = new parserFormula( "BIN2DEC(1234567890)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2DEC(1234567890)" );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "BIN2DEC(\"Hello World!\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2DEC(\"Hello World!\")" );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

    })

    test( "Test: \"BIN2HEX\"", function () {

        oParser = new parserFormula( "BIN2HEX(101010)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2HEX(101010)" );
        strictEqual( oParser.calculate().getValue(), "2A" );

        oParser = new parserFormula( "BIN2HEX(\"101010\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2HEX(\"101010\")" );
        strictEqual( oParser.calculate().getValue(), "2A" );

        oParser = new parserFormula( "BIN2HEX(111111111)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2HEX(111111111)" );
        strictEqual( oParser.calculate().getValue(), "1FF" );

        oParser = new parserFormula( "BIN2HEX(1000000000)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2HEX(1000000000)" );
        strictEqual( oParser.calculate().getValue(), "FFFFFFFE00" );

        oParser = new parserFormula( "BIN2HEX(1111111111)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2HEX(1111111111)" );
        strictEqual( oParser.calculate().getValue(), "FFFFFFFFFF" );

        oParser = new parserFormula( "BIN2HEX(101010,2)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2HEX(101010,2)" );
        strictEqual( oParser.calculate().getValue(), "2A" );

        oParser = new parserFormula( "BIN2HEX(101010,4)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2HEX(101010,4)" );
        strictEqual( oParser.calculate().getValue(), "002A" );

        oParser = new parserFormula( "BIN2HEX(101010,4.5)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2HEX(101010,4.5)" );
        strictEqual( oParser.calculate().getValue(), "002A" );

        oParser = new parserFormula( "BIN2HEX(1234567890)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2HEX(1234567890)" );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "BIN2HEX(\"Hello World!\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2HEX(\"Hello World!\")" );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "BIN2HEX(101010101010)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2HEX(101010101010)" );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "BIN2HEX(101010,1)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2HEX(101010,1)" );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "BIN2HEX(101010,-4)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2HEX(101010,-4)" );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "BIN2HEX(101010, \"Hello World!\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2HEX(101010,\"Hello World!\")" );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

    })

    test( "Test: \"BIN2OCT\"", function () {

        oParser = new parserFormula( "BIN2OCT(101010)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2OCT(101010)" );
        strictEqual( oParser.calculate().getValue(), "52" );

        oParser = new parserFormula( "BIN2OCT(\"101010\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2OCT(\"101010\")" );
        strictEqual( oParser.calculate().getValue(), "52" );

        oParser = new parserFormula( "BIN2OCT(111111111)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2OCT(111111111)" );
        strictEqual( oParser.calculate().getValue(), "777" );

        oParser = new parserFormula( "BIN2OCT(1000000000)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2OCT(1000000000)" );
        strictEqual( oParser.calculate().getValue(), "7777777000" );

        oParser = new parserFormula( "BIN2OCT(1111111111)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2OCT(1111111111)" );
        strictEqual( oParser.calculate().getValue(), "7777777777" );

        oParser = new parserFormula( "BIN2OCT(101010, 2)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2OCT(101010,2)" );
        strictEqual( oParser.calculate().getValue(), "52" );

        oParser = new parserFormula( "BIN2OCT(101010, 4)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2OCT(101010,4)" );
        strictEqual( oParser.calculate().getValue(), "0052" );

        oParser = new parserFormula( "BIN2OCT(101010, 4.5)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2OCT(101010,4.5)" );
        strictEqual( oParser.calculate().getValue(), "0052" );

        oParser = new parserFormula( "BIN2OCT(\"Hello World!\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2OCT(\"Hello World!\")" );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "BIN2OCT(1234567890)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2OCT(1234567890)" );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "BIN2OCT(101010101010)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2OCT(101010101010)" );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "BIN2OCT(101010, 1)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2OCT(101010,1)" );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "BIN2OCT(101010, -4)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2OCT(101010,-4)" );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "BIN2OCT(101010, \"Hello World!\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "BIN2OCT(101010,\"Hello World!\")" );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

    })

    test( "Test: \"DEC2BIN\"", function () {

        oParser = new parserFormula( "DEC2BIN(42)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2BIN(42)" );
        strictEqual( oParser.calculate().getValue(), "101010" );

        oParser = new parserFormula( "DEC2BIN(\"42\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2BIN(\"42\")" );
        strictEqual( oParser.calculate().getValue(), "101010" );

        oParser = new parserFormula( "DEC2BIN(-512)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2BIN(-512)" );
        strictEqual( oParser.calculate().getValue(), "1000000000" );

        oParser = new parserFormula( "DEC2BIN(-511)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2BIN(-511)" );
        strictEqual( oParser.calculate().getValue(), "1000000001" );

        oParser = new parserFormula( "DEC2BIN(-1)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2BIN(-1)" );
        strictEqual( oParser.calculate().getValue(), "1111111111" );

        oParser = new parserFormula( "DEC2BIN(0)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2BIN(0)" );
        strictEqual( oParser.calculate().getValue(), "0" );

        oParser = new parserFormula( "DEC2BIN(1)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2BIN(1)" );
        strictEqual( oParser.calculate().getValue(), "1" );

        oParser = new parserFormula( "DEC2BIN(510)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2BIN(510)" );
        strictEqual( oParser.calculate().getValue(), "111111110" );

        oParser = new parserFormula( "DEC2BIN(511)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2BIN(511)" );
        strictEqual( oParser.calculate().getValue(), "111111111" );

        oParser = new parserFormula( "DEC2BIN(42, 6)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2BIN(42,6)" );
        strictEqual( oParser.calculate().getValue(), "101010" );

        oParser = new parserFormula( "DEC2BIN(42, 8)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2BIN(42,8)" );
        strictEqual( oParser.calculate().getValue(), "00101010" );

        oParser = new parserFormula( "DEC2BIN(\"Hello World!\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2BIN(\"Hello World!\")" );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

        oParser = new parserFormula( "DEC2BIN(\"2a\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2BIN(\"2a\")" );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

        oParser = new parserFormula( "DEC2BIN(-513)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2BIN(-513)" );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "DEC2BIN(512)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2BIN(512)" );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "DEC2BIN(42, -8)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2BIN(42,-8)" );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

    })

    test( "Test: \"DEC2HEX\"", function () {

        oParser = new parserFormula( "DEC2HEX(42)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2HEX(42)" );
        strictEqual( oParser.calculate().getValue(), "2A" );

        oParser = new parserFormula( "DEC2HEX(\"42\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2HEX(\"42\")" );
        strictEqual( oParser.calculate().getValue(), "2A" );

        oParser = new parserFormula( "DEC2HEX(-549755813888)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2HEX(-549755813888)" );
        strictEqual( oParser.calculate().getValue(), "8000000000" );

        oParser = new parserFormula( "DEC2HEX(-549755813887)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2HEX(-549755813887)" );
        strictEqual( oParser.calculate().getValue(), "8000000001" );

        oParser = new parserFormula( "DEC2HEX(-1)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2HEX(-1)" );
        strictEqual( oParser.calculate().getValue(), "FFFFFFFFFF" );

        oParser = new parserFormula( "DEC2HEX(0)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2HEX(0)" );
        strictEqual( oParser.calculate().getValue(), "0" );

        oParser = new parserFormula( "DEC2HEX(1)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2HEX(1)" );
        strictEqual( oParser.calculate().getValue(), "1" );

        oParser = new parserFormula( "DEC2HEX(549755813886)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2HEX(549755813886)" );
        strictEqual( oParser.calculate().getValue(), "7FFFFFFFFE" );

        oParser = new parserFormula( "DEC2HEX(549755813887)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2HEX(549755813887)" );
        strictEqual( oParser.calculate().getValue(), "7FFFFFFFFF" );

        oParser = new parserFormula( "DEC2HEX(42, 2)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2HEX(42,2)" );
        strictEqual( oParser.calculate().getValue(), "2A" );

        oParser = new parserFormula( "DEC2HEX(42, 4)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2HEX(42,4)" );
        strictEqual( oParser.calculate().getValue(), "002A" );

        oParser = new parserFormula( "DEC2HEX(\"Hello World!\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2HEX(\"Hello World!\")" );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

        oParser = new parserFormula( "DEC2HEX(\"2a\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2HEX(\"2a\")" );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

    })

    test( "Test: \"DEC2OCT\"", function () {

        oParser = new parserFormula( "DEC2OCT(42)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2OCT(42)" );
        strictEqual( oParser.calculate().getValue(), "52" );

        oParser = new parserFormula( "DEC2OCT(\"42\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2OCT(\"42\")" );
        strictEqual( oParser.calculate().getValue(), "52" );

        oParser = new parserFormula( "DEC2OCT(-536870912)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2OCT(-536870912)" );
        strictEqual( oParser.calculate().getValue(), "4000000000" );

        oParser = new parserFormula( "DEC2OCT(-536870911)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2OCT(-536870911)" );
        strictEqual( oParser.calculate().getValue(), "4000000001" );

        oParser = new parserFormula( "DEC2OCT(-1)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2OCT(-1)" );
        strictEqual( oParser.calculate().getValue(), "7777777777" );

        oParser = new parserFormula( "DEC2OCT(0)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2OCT(0)" );
        strictEqual( oParser.calculate().getValue(), "0" );

        oParser = new parserFormula( "DEC2OCT(-0)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2OCT(-0)" );
        strictEqual( oParser.calculate().getValue(), "0" );

        oParser = new parserFormula( "DEC2OCT(1)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2OCT(1)" );
        strictEqual( oParser.calculate().getValue(), "1" );

        oParser = new parserFormula( "DEC2OCT(536870910)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2OCT(536870910)" );
        strictEqual( oParser.calculate().getValue(), "3777777776" );

        oParser = new parserFormula( "DEC2OCT(536870911)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2OCT(536870911)" );
        strictEqual( oParser.calculate().getValue(), "3777777777" );

        oParser = new parserFormula( "DEC2OCT(42, 2)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2OCT(42,2)" );
        strictEqual( oParser.calculate().getValue(), "52" );

        oParser = new parserFormula( "DEC2OCT(42, 4)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2OCT(42,4)" );
        strictEqual( oParser.calculate().getValue(), "0052" );

        oParser = new parserFormula( "DEC2OCT(\"Hello World!\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2OCT(\"Hello World!\")" );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

        oParser = new parserFormula( "DEC2OCT(\"2a\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2OCT(\"2a\")" );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

        oParser = new parserFormula( "DEC2OCT(-536870913)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2OCT(-536870913)" );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "DEC2OCT(536870912)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2OCT(536870912)" );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "DEC2OCT(42, 1)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "DEC2OCT(42,1)" );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

    })

    test( "Test: \"HEX2BIN\"", function () {

        oParser = new parserFormula( "HEX2BIN(\"2a\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2BIN(\"2a\")" );
        strictEqual( oParser.calculate().getValue(), "101010" );

        oParser = new parserFormula( "HEX2BIN(\"fffffffe00\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2BIN(\"fffffffe00\")" );
        strictEqual( oParser.calculate().getValue(), "1000000000" );

        oParser = new parserFormula( "HEX2BIN(\"fffffffe01\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2BIN(\"fffffffe01\")" );
        strictEqual( oParser.calculate().getValue(), "1000000001" );

        oParser = new parserFormula( "HEX2BIN(\"ffffffffff\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2BIN(\"ffffffffff\")" );
        strictEqual( oParser.calculate().getValue(), "1111111111" );

        oParser = new parserFormula( "HEX2BIN(0)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2BIN(0)" );
        strictEqual( oParser.calculate().getValue(), "0" );

        oParser = new parserFormula( "HEX2BIN(1)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2BIN(1)" );
        strictEqual( oParser.calculate().getValue(), "1" );

        oParser = new parserFormula( "HEX2BIN(\"1fe\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2BIN(\"1fe\")" );
        strictEqual( oParser.calculate().getValue(), "111111110" );

        oParser = new parserFormula( "HEX2BIN(\"1ff\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2BIN(\"1ff\")" );
        strictEqual( oParser.calculate().getValue(), "111111111" );

        oParser = new parserFormula( "HEX2BIN(\"2a\",6)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2BIN(\"2a\",6)" );
        strictEqual( oParser.calculate().getValue(), "101010" );

        oParser = new parserFormula( "HEX2BIN(\"2a\",8)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2BIN(\"2a\",8)" );
        strictEqual( oParser.calculate().getValue(), "00101010" );

        oParser = new parserFormula( "HEX2BIN(\"Hello World!\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2BIN(\"Hello World!\")" );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "HEX2BIN(\"fffffffdff\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2BIN(\"fffffffdff\")" );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "HEX2BIN(\"200\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2BIN(\"200\")" );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "HEX2BIN(\"2a\", 5)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2BIN(\"2a\",5)" );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "HEX2BIN(\"2a\", -8)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2BIN(\"2a\",-8)" );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

        oParser = new parserFormula( "HEX2BIN(\"2a\", \"Hello World!\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2BIN(\"2a\",\"Hello World!\")" );
        strictEqual( oParser.calculate().getValue(), "#VALUE!" );

    })

    test( "Test: \"HEX2DEC\"", function () {

        oParser = new parserFormula( "HEX2DEC(\"2a\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2DEC(\"2a\")" );
        strictEqual( oParser.calculate().getValue(), 42);

        oParser = new parserFormula( "HEX2DEC(\"8000000000\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2DEC(\"8000000000\")" );
        strictEqual( oParser.calculate().getValue(), -549755813888);

        oParser = new parserFormula( "HEX2DEC(\"ffffffffff\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2DEC(\"ffffffffff\")" );
        strictEqual( oParser.calculate().getValue(), -1);

        oParser = new parserFormula( "HEX2DEC(\"0\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2DEC(\"0\")" );
        strictEqual( oParser.calculate().getValue(), 0);

        oParser = new parserFormula( "HEX2DEC(\"1\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2DEC(\"1\")" );
        strictEqual( oParser.calculate().getValue(), 1);

        oParser = new parserFormula( "HEX2DEC(0)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2DEC(0)" );
        strictEqual( oParser.calculate().getValue(), 0);

        oParser = new parserFormula( "HEX2DEC(1)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2DEC(1)" );
        strictEqual( oParser.calculate().getValue(), 1);

        oParser = new parserFormula( "HEX2DEC(\"7fffffffff\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2DEC(\"7fffffffff\")" );
        strictEqual( oParser.calculate().getValue(), 549755813887);

    })

    test( "Test: \"HEX2OCT\"", function () {

        oParser = new parserFormula( "HEX2OCT(\"2a\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2OCT(\"2a\")" );
        strictEqual( oParser.calculate().getValue(), "52");

        oParser = new parserFormula( "HEX2OCT(\"ffe0000000\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2OCT(\"ffe0000000\")" );
        strictEqual( oParser.calculate().getValue(), "4000000000");

        oParser = new parserFormula( "HEX2OCT(\"ffe0000001\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2OCT(\"ffe0000001\")" );
        strictEqual( oParser.calculate().getValue(), "4000000001");

        oParser = new parserFormula( "HEX2OCT(0)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2OCT(0)" );
        strictEqual( oParser.calculate().getValue(), "0");

        oParser = new parserFormula( "HEX2OCT(1)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2OCT(1)" );
        strictEqual( oParser.calculate().getValue(), "1");

        oParser = new parserFormula( "HEX2OCT(\"1ffffffe\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2OCT(\"1ffffffe\")" );
        strictEqual( oParser.calculate().getValue(), "3777777776");

        oParser = new parserFormula( "HEX2OCT(\"1fffffff\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2OCT(\"1fffffff\")" );
        strictEqual( oParser.calculate().getValue(), "3777777777");

        oParser = new parserFormula( "HEX2OCT(\"2a\",2)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2OCT(\"2a\",2)" );
        strictEqual( oParser.calculate().getValue(), "52");

        oParser = new parserFormula( "HEX2OCT(\"2a\",4)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2OCT(\"2a\",4)" );
        strictEqual( oParser.calculate().getValue(), "0052");

        oParser = new parserFormula( "HEX2OCT(\"Hello World!\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2OCT(\"Hello World!\")" );
        strictEqual( oParser.calculate().getValue(), "#NUM!");

        oParser = new parserFormula( "HEX2OCT(\"ffdfffffff\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2OCT(\"ffdfffffff\")" );
        strictEqual( oParser.calculate().getValue(), "#NUM!");

        oParser = new parserFormula( "HEX2OCT(\"2a\", 1)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "HEX2OCT(\"2a\",1)" );
        strictEqual( oParser.calculate().getValue(), "#NUM!");

    })

    test( "Test: \"OCT2BIN\"", function () {

        oParser = new parserFormula( "OCT2BIN(\"52\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2BIN(\"52\")" );
        strictEqual( oParser.calculate().getValue(), "101010");

        oParser = new parserFormula( "OCT2BIN(\"7777777000\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2BIN(\"7777777000\")" );
        strictEqual( oParser.calculate().getValue(), "1000000000");

        oParser = new parserFormula( "OCT2BIN(\"7777777001\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2BIN(\"7777777001\")" );
        strictEqual( oParser.calculate().getValue(), "1000000001");

        oParser = new parserFormula( "OCT2BIN(\"7777777777\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2BIN(\"7777777777\")" );
        strictEqual( oParser.calculate().getValue(), "1111111111");

        oParser = new parserFormula( "OCT2BIN(\"0\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2BIN(\"0\")" );
        strictEqual( oParser.calculate().getValue(), "0");

        oParser = new parserFormula( "OCT2BIN(\"1\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2BIN(\"1\")" );
        strictEqual( oParser.calculate().getValue(), "1");

        oParser = new parserFormula( "OCT2BIN(\"776\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2BIN(\"776\")" );
        strictEqual( oParser.calculate().getValue(), "111111110");

        oParser = new parserFormula( "OCT2BIN(\"777\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2BIN(\"777\")" );
        strictEqual( oParser.calculate().getValue(), "111111111");

        oParser = new parserFormula( "OCT2BIN(\"52\", 6)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2BIN(\"52\",6)" );
        strictEqual( oParser.calculate().getValue(), "101010");

        oParser = new parserFormula( "OCT2BIN(\"52\", 8)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2BIN(\"52\",8)" );
        strictEqual( oParser.calculate().getValue(), "00101010");

        oParser = new parserFormula( "OCT2BIN(\"Hello World!\", 8)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2BIN(\"Hello World!\",8)" );
        strictEqual( oParser.calculate().getValue(), "#NUM!");

        oParser = new parserFormula( "OCT2BIN(\"52\",\"Hello World!\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2BIN(\"52\",\"Hello World!\")" );
        strictEqual( oParser.calculate().getValue(), "#VALUE!");

    })

    test( "Test: \"OCT2DEC\"", function () {

        oParser = new parserFormula( "OCT2DEC(\"52\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2DEC(\"52\")" );
        strictEqual( oParser.calculate().getValue(), 42);

        oParser = new parserFormula( "OCT2DEC(\"4000000000\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2DEC(\"4000000000\")" );
        strictEqual( oParser.calculate().getValue(), -536870912);

        oParser = new parserFormula( "OCT2DEC(\"7777777777\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2DEC(\"7777777777\")" );
        strictEqual( oParser.calculate().getValue(), -1);

        oParser = new parserFormula( "OCT2DEC(\"0\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2DEC(\"0\")" );
        strictEqual( oParser.calculate().getValue(), 0);

        oParser = new parserFormula( "OCT2DEC(\"1\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2DEC(\"1\")" );
        strictEqual( oParser.calculate().getValue(), 1);

        oParser = new parserFormula( "OCT2DEC(\"3777777776\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2DEC(\"3777777776\")" );
        strictEqual( oParser.calculate().getValue(), 536870910);

        oParser = new parserFormula( "OCT2DEC(\"3777777777\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2DEC(\"3777777777\")" );
        strictEqual( oParser.calculate().getValue(), 536870911);

        oParser = new parserFormula( "OCT2DEC(\"3777777777\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2DEC(\"3777777777\")" );
        strictEqual( oParser.calculate().getValue(), 536870911);

    })

    test( "Test: \"OCT2HEX\"", function () {

        oParser = new parserFormula( "OCT2HEX(\"52\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2HEX(\"52\")" );
        strictEqual( oParser.calculate().getValue(), "2A");

        oParser = new parserFormula( "OCT2HEX(\"4000000000\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2HEX(\"4000000000\")" );
        strictEqual( oParser.calculate().getValue(), "FFE0000000");

        oParser = new parserFormula( "OCT2HEX(\"4000000001\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2HEX(\"4000000001\")" );
        strictEqual( oParser.calculate().getValue(), "FFE0000001");

        oParser = new parserFormula( "OCT2HEX(\"7777777777\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2HEX(\"7777777777\")" );
        strictEqual( oParser.calculate().getValue(), "FFFFFFFFFF");

        oParser = new parserFormula( "OCT2HEX(\"0\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2HEX(\"0\")" );
        strictEqual( oParser.calculate().getValue(), "0");

        oParser = new parserFormula( "OCT2HEX(\"1\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2HEX(\"1\")" );
        strictEqual( oParser.calculate().getValue(), "1");

        oParser = new parserFormula( "OCT2HEX(\"3777777776\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2HEX(\"3777777776\")" );
        strictEqual( oParser.calculate().getValue(), "1FFFFFFE");

        oParser = new parserFormula( "OCT2HEX(\"3777777777\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2HEX(\"3777777777\")" );
        strictEqual( oParser.calculate().getValue(), "1FFFFFFF");

        oParser = new parserFormula( "OCT2HEX(\"52\", 2)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2HEX(\"52\",2)" );
        strictEqual( oParser.calculate().getValue(), "2A");

        oParser = new parserFormula( "OCT2HEX(\"52\", 4)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2HEX(\"52\",4)" );
        strictEqual( oParser.calculate().getValue(), "002A");

        oParser = new parserFormula( "OCT2HEX(\"Hello World!\", 4)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2HEX(\"Hello World!\",4)" );
        strictEqual( oParser.calculate().getValue(), "#NUM!");

        oParser = new parserFormula( "OCT2HEX(\"52\", -4)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2HEX(\"52\",-4)" );
        strictEqual( oParser.calculate().getValue(), "#NUM!");

        oParser = new parserFormula( "OCT2HEX(\"52\", \"Hello World!\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "OCT2HEX(\"52\",\"Hello World!\")" );
        strictEqual( oParser.calculate().getValue(), "#VALUE!");

    })

    test( "Test: \"COMPLEX\"", function () {

        oParser = new parserFormula( "COMPLEX(-3.5,19.6)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "COMPLEX(-3.5,19.6)" );
        strictEqual( oParser.calculate().getValue(), "-3.5+19.6i");

        oParser = new parserFormula( "COMPLEX(3.5,-19.6,\"j\")", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "COMPLEX(3.5,-19.6,\"j\")" );
        strictEqual( oParser.calculate().getValue(), "3.5-19.6j");

        oParser = new parserFormula( "COMPLEX(3.5,0)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "COMPLEX(3.5,0)" );
        strictEqual( oParser.calculate().getValue(), "3.5");

        oParser = new parserFormula( "COMPLEX(0,2.4)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "COMPLEX(0,2.4)" );
        strictEqual( oParser.calculate().getValue(), "2.4i");

        oParser = new parserFormula( "COMPLEX(0,0)", "A2", ws );
        ok( oParser.parse() );
        ok( oParser.assemble() == "COMPLEX(0,0)" );
        strictEqual( oParser.calculate().getValue(), "0");

    })

    test( "Test: \"DELTA\"", function () {

        oParser = new parserFormula( "DELTA(10.5,10.5)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1);

        oParser = new parserFormula( "DELTA(10.5,10.6)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 0);

        oParser = new parserFormula( "DELTA(10.5)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 0);

        oParser = new parserFormula( "DELTA(0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1);

    })

    test( "Test: \"ERF\"", function () {

        oParser = new parserFormula( "ERF(1.234,4.5432)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue().toFixed(14)-0, 0.08096058291050978.toFixed(14)-0 );

        oParser = new parserFormula( "ERF(1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue().toFixed(14)-0, 0.8427007929497149.toFixed(14)-0 );

        oParser = new parserFormula( "ERF(0,1.345)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue().toFixed(14)-0, 0.9428441710878559.toFixed(14)-0 );

        oParser = new parserFormula( "ERF(1.234)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue().toFixed(14)-0, 0.9190394169576684.toFixed(14)-0 );

    })

    test( "Test: \"ERFC\"", function () {

        oParser = new parserFormula( "ERFC(1.234)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue().toFixed(14)-0, 0.08096058304233157.toFixed(14)-0 );

        oParser = new parserFormula( "ERFC(1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue().toFixed(14)-0, 0.15729920705028513.toFixed(14)-0 );

        oParser = new parserFormula( "ERFC(0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "ERFC(-1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue().toFixed(14)-0, 1.8427007929497148.toFixed(14)-0 );

    })

} );
