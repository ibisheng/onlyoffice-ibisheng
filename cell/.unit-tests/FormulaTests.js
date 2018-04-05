/*
 * (c) Copyright Ascensio System SIA 2010-2018
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

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

	function numDivFact(num, fact){
		var res = num / Math.fact(fact);
		res = res.toString();
		return res;
	}

    var c_msPerDay = AscCommonExcel.c_msPerDay;
    var parserFormula = AscCommonExcel.parserFormula;
    var GetDiffDate360 = AscCommonExcel.GetDiffDate360;
    var fSortAscending = AscCommon.fSortAscending;
    var g_oIdCounter = AscCommon.g_oIdCounter;

    var oParser, wb, ws, dif = 1e-9, sData = AscCommonExcel.getEmptyWorkbook(), tmp;
    if ( AscCommon.c_oSerFormat.Signature === sData.substring( 0, AscCommon.c_oSerFormat.Signature.length ) ) {
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
		AscCommonExcel.g_DefNameWorksheet = new AscCommonExcel.Worksheet(wb, -1);
        g_oIdCounter.Set_Load(false);

        var oBinaryFileReader = new AscCommonExcel.BinaryFileReader();
        oBinaryFileReader.Read( sData, wb );
        ws = wb.getWorksheet( wb.getActive() );
        AscCommonExcel.getFormulasInfo();
    }

    /*QUnit.log( function ( details ) {
        console.log( "Log: " + details.name + ", result - " + details.result );
    } );*/

	wb.dependencyFormulas.lockRecal();

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
    } );
	
	test( "Test: \"Cross\"", function () {

		ws.getRange2( "A7" ).setValue( "1" );
		ws.getRange2( "A8" ).setValue( "2" );
		ws.getRange2( "A9" ).setValue( "3" );
		oParser = new parserFormula( 'A7:A9', null, ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().cross(new Asc.Range(0, 5, 0, 5), ws.getId()).getValue(), "#VALUE!" );
		strictEqual( oParser.calculate().cross(new Asc.Range(0, 6, 0, 6), ws.getId()).getValue(), 1 );
		strictEqual( oParser.calculate().cross(new Asc.Range(0, 7, 0, 7), ws.getId()).getValue(), 2 );
		strictEqual( oParser.calculate().cross(new Asc.Range(0, 8, 0, 8), ws.getId()).getValue(), 3 );
		strictEqual( oParser.calculate().cross(new Asc.Range(0, 9, 0, 9), ws.getId()).getValue(), "#VALUE!" );

	} );

	test( "Test: \"Defined names cycle\"", function () {

		var newNameQ = new Asc.asc_CDefName("q", "SUM('"+ws.getName()+"'!A2)");
		wb.editDefinesNames(null, newNameQ);
		ws.getRange2( "Q1" ).setValue( "=q" );
		ws.getRange2( "Q2" ).setValue( "=q" );
		ws.getRange2( "Q3" ).setValue( "1" );
		strictEqual( ws.getRange2( "Q1" ).getValueWithFormat(), "1" );
		strictEqual( ws.getRange2( "Q2" ).getValueWithFormat(), "1" );

		var newNameW = new Asc.asc_CDefName("w", "'"+ws.getName()+"'!A1");
		wb.editDefinesNames(null, newNameW);
		ws.getRange2( "Q4" ).setValue( "=w" );
		strictEqual( ws.getRange2( "Q4" ).getValueWithFormat(), "#REF!" );
		//clean up
		ws.getRange2( "Q1:Q4" ).cleanAll();
		wb.delDefinesNames(newNameW);
		wb.delDefinesNames(newNameQ);
	});

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

	} );



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
    } );

    test( "Test: \"SIN have wrong arguments count\"", function () {
        oParser = new parserFormula( 'SIN(3.1415926,3.1415926*2)', "A1", ws );
        ok( !oParser.parse() );
    } );

    test( "Test: \"SIN(3.1415926)\"", function () {
        oParser = new parserFormula( 'SIN(3.1415926)', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), Math.sin( 3.1415926 ) );
    } );

    test( "Test: \"COS(PI()/2)\"", function () {
        oParser = new parserFormula( 'COS(PI()/2)', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), Math.cos( Math.PI / 2 ) );
    } );

	test( "Test: \"ACOT(2)\"", function () {
		oParser = new parserFormula( 'ACOT(2)', "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), Math.PI / 2 - Math.atan(2) );
	} );

	test( "Test: \"ACOTH(6)\"", function () {
		oParser = new parserFormula( 'ACOTH(6)', "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), Math.atanh(1 / 6) );
	} );



	test( "Test: \"COT\"", function () {
		oParser = new parserFormula( 'COT(30)', "A1", ws );
		ok( oParser.parse(), 'COT(30)' );
		strictEqual( oParser.calculate().getValue().toFixed(3) - 0, -0.156, 'COT(30)' );

		oParser = new parserFormula( 'COT(0)', "A1", ws );
		ok( oParser.parse(), 'COT(0)' );
		strictEqual( oParser.calculate().getValue(), "#DIV/0!", 'COT(0)' );

		oParser = new parserFormula( 'COT(1000000000)', "A1", ws );
		ok( oParser.parse(), 'COT(1000000000)' );
		strictEqual( oParser.calculate().getValue(), "#NUM!", 'COT(1000000000)' );

		oParser = new parserFormula( 'COT(-1000000000)', "A1", ws );
		ok( oParser.parse(), 'COT(-1000000000)' );
		strictEqual( oParser.calculate().getValue(), "#NUM!", 'COT(-1000000000)' );

		oParser = new parserFormula( 'COT(test)', "A1", ws );
		ok( oParser.parse(), 'COT(test)' );
		strictEqual( oParser.calculate().getValue(), "#NAME?", 'COT(test)' );

		oParser = new parserFormula( 'COT("test")', "A1", ws );
		ok( oParser.parse(), 'COT("test")' );
		strictEqual( oParser.calculate().getValue(), "#VALUE!", 'COT("test")' );
	} );

	test( "Test: \"COTH\"", function () {
		oParser = new parserFormula( 'COTH(2)', "A1", ws );
		ok( oParser.parse(), 'COTH(2)' );
		strictEqual( oParser.calculate().getValue().toFixed(3) - 0, 1.037, 'COTH(2)' );

		oParser = new parserFormula( 'COTH(0)', "A1", ws );
		ok( oParser.parse(), 'COTH(0)' );
		strictEqual( oParser.calculate().getValue(), "#DIV/0!", 'COTH(0)' );

		oParser = new parserFormula( 'COTH(1000000000)', "A1", ws );
		ok( oParser.parse(), 'COTH(1000000000)' );
		strictEqual( oParser.calculate().getValue(), 1, 'COTH(1000000000)' );

		oParser = new parserFormula( 'COTH(-1000000000)', "A1", ws );
		ok( oParser.parse(), 'COTH(-1000000000)' );
		strictEqual( oParser.calculate().getValue(), -1, 'COTH(-1000000000)' );

		oParser = new parserFormula( 'COTH(test)', "A1", ws );
		ok( oParser.parse(), 'COTH(test)' );
		strictEqual( oParser.calculate().getValue(), "#NAME?", 'COTH(test)' );

		oParser = new parserFormula( 'COTH("test")', "A1", ws );
		ok( oParser.parse(), 'COTH("test")' );
		strictEqual( oParser.calculate().getValue(), "#VALUE!", 'COTH("test")' );
	} );

	test( "Test: \"CSC\"", function () {
		oParser = new parserFormula( 'CSC(15)', "A1", ws );
		ok( oParser.parse(), 'CSC(15)' );
		strictEqual( oParser.calculate().getValue().toFixed(3) - 0, 1.538, 'CSC(15)' );

		oParser = new parserFormula( 'CSC(0)', "A1", ws );
		ok( oParser.parse(), 'CSC(0)' );
		strictEqual( oParser.calculate().getValue(), "#DIV/0!", 'CSC(0)' );

		oParser = new parserFormula( 'CSC(1000000000)', "A1", ws );
		ok( oParser.parse(), 'CSC(1000000000)' );
		strictEqual( oParser.calculate().getValue(), "#NUM!", 'CSC(1000000000)' );

		oParser = new parserFormula( 'CSC(-1000000000)', "A1", ws );
		ok( oParser.parse(), 'CSC(-1000000000)' );
		strictEqual( oParser.calculate().getValue(), "#NUM!", 'CSC(-1000000000)' );

		oParser = new parserFormula( 'CSC(test)', "A1", ws );
		ok( oParser.parse(), 'CSC(test)' );
		strictEqual( oParser.calculate().getValue(), "#NAME?", 'CSC(test)' );

		oParser = new parserFormula( 'CSC("test")', "A1", ws );
		ok( oParser.parse(), 'CSC("test")' );
		strictEqual( oParser.calculate().getValue(), "#VALUE!", 'CSC("test")' );
	} );

	test( "Test: \"CSCH\"", function () {
		oParser = new parserFormula( 'CSCH(1.5)', "A1", ws );
		ok( oParser.parse(), 'CSCH(1.5)' );
		strictEqual( oParser.calculate().getValue().toFixed(4) - 0, 0.4696, 'CSCH(1.5)' );

		oParser = new parserFormula( 'CSCH(0)', "A1", ws );
		ok( oParser.parse(), 'CSCH(0)' );
		strictEqual( oParser.calculate().getValue(), "#DIV/0!", 'CSCH(0)' );

		oParser = new parserFormula( 'CSCH(1000000000)', "A1", ws );
		ok( oParser.parse(), 'CSCH(1000000000)' );
		strictEqual( oParser.calculate().getValue(), 0, 'CSCH(1000000000)' );

		oParser = new parserFormula( 'CSCH(-1000000000)', "A1", ws );
		ok( oParser.parse(), 'CSCH(-1000000000)' );
		strictEqual( oParser.calculate().getValue(), 0, 'CSCH(-1000000000)' );

		oParser = new parserFormula( 'CSCH(test)', "A1", ws );
		ok( oParser.parse(), 'CSCH(test)' );
		strictEqual( oParser.calculate().getValue(), "#NAME?", 'CSCH(test)' );

		oParser = new parserFormula( 'CSCH("test")', "A1", ws );
		ok( oParser.parse(), 'CSCH("test")' );
		strictEqual( oParser.calculate().getValue(), "#VALUE!", 'CSCH("test")' );
	} );

	test( "Test: \"SEC\"", function () {
		oParser = new parserFormula( 'SEC(45)', "A1", ws );
		ok( oParser.parse(), 'SEC(45)' );
		strictEqual( oParser.calculate().getValue().toFixed(5) - 0, 1.90359, 'SEC(45)' );

		oParser = new parserFormula( 'SEC(30)', "A1", ws );
		ok( oParser.parse(), 'SEC(30)' );
		strictEqual( oParser.calculate().getValue().toFixed(5) - 0, 6.48292, 'SEC(30)' );

		oParser = new parserFormula( 'SEC(0)', "A1", ws );
		ok( oParser.parse(), 'SEC(0)' );
		strictEqual( oParser.calculate().getValue(), 1, 'SEC(0)' );

		oParser = new parserFormula( 'SEC(1000000000)', "A1", ws );
		ok( oParser.parse(), 'SEC(1000000000)' );
		strictEqual( oParser.calculate().getValue(), "#NUM!", 'SEC(1000000000)' );

		oParser = new parserFormula( 'SEC(test)', "A1", ws );
		ok( oParser.parse(), 'SEC(test)' );
		strictEqual( oParser.calculate().getValue(), "#NAME?", 'SEC(test)' );

		oParser = new parserFormula( 'SEC("test")', "A1", ws );
		ok( oParser.parse(), 'SEC("test")' );
		strictEqual( oParser.calculate().getValue(), "#VALUE!", 'SEC("test")' );
	} );

	test( "Test: \"SECH\"", function () {
		oParser = new parserFormula( 'SECH(5)', "A1", ws );
		ok( oParser.parse(), 'SECH(5)' );
		strictEqual( oParser.calculate().getValue().toFixed(3) - 0, 0.013, 'SECH(5)' );

		oParser = new parserFormula( 'SECH(0)', "A1", ws );
		ok( oParser.parse(), 'SECH(0)' );
		strictEqual( oParser.calculate().getValue(), 1, 'SECH(0)' );

		oParser = new parserFormula( 'SECH(1000000000)', "A1", ws );
		ok( oParser.parse(), 'SECH(1000000000)' );
		strictEqual( oParser.calculate().getValue(), 0, 'SECH(1000000000)' );

		oParser = new parserFormula( 'SECH(test)', "A1", ws );
		ok( oParser.parse(), 'SECH(test)' );
		strictEqual( oParser.calculate().getValue(), "#NAME?", 'SECH(test)' );

		oParser = new parserFormula( 'SECH("test")', "A1", ws );
		ok( oParser.parse(), 'SECH("test")' );
		strictEqual( oParser.calculate().getValue(), "#VALUE!", 'SECH("test")' );
	} );

	test( "Test: \"FLOOR.PRECISE\"", function () {
		oParser = new parserFormula( 'FLOOR.PRECISE(-3.2, -1)', "A1", ws );
		ok( oParser.parse(), 'FLOOR.PRECISE(-3.2, -1)' );
		strictEqual( oParser.calculate().getValue(), -4, 'FLOOR.PRECISE(-3.2, -1)' );

		oParser = new parserFormula( 'FLOOR.PRECISE(3.2, 1)', "A1", ws );
		ok( oParser.parse(), 'FLOOR.PRECISE(3.2, 1)' );
		strictEqual( oParser.calculate().getValue(), 3, 'FLOOR.PRECISE(3.2, 1)' );

		oParser = new parserFormula( 'FLOOR.PRECISE(-3.2, 1)', "A1", ws );
		ok( oParser.parse(), 'FLOOR.PRECISE(-3.2, 1)' );
		strictEqual( oParser.calculate().getValue(), -4, 'FLOOR.PRECISE(-3.2, 1)' );

		oParser = new parserFormula( 'FLOOR.PRECISE(3.2, -1)', "A1", ws );
		ok( oParser.parse(), 'FLOOR.PRECISE(3.2, -1)' );
		strictEqual( oParser.calculate().getValue(), 3, 'FLOOR.PRECISE(3.2, -1)' );

		oParser = new parserFormula( 'FLOOR.PRECISE(3.2)', "A1", ws );
		ok( oParser.parse(), 'FLOOR.PRECISE(3.2)' );
		strictEqual( oParser.calculate().getValue(), 3, 'FLOOR.PRECISE(3.2)' );

		oParser = new parserFormula( 'FLOOR.PRECISE(test)', "A1", ws );
		ok( oParser.parse(), 'FLOOR.PRECISE(test)' );
		strictEqual( oParser.calculate().getValue(), "#NAME?", 'FLOOR.PRECISE(test)' );
	} );

	test( "Test: \"FLOOR.MATH\"", function () {
		oParser = new parserFormula( 'FLOOR.MATH(24.3, 5)', "A1", ws );
		ok( oParser.parse(), 'FLOOR.MATH(24.3, 5)' );
		strictEqual( oParser.calculate().getValue(), 20, 'FLOOR.MATH(24.3, 5)' );

		oParser = new parserFormula( 'FLOOR.MATH(6.7)', "A1", ws );
		ok( oParser.parse(), 'FLOOR.MATH(6.7)' );
		strictEqual( oParser.calculate().getValue(), 6, 'FLOOR.MATH(6.7)' );

		oParser = new parserFormula( 'FLOOR.MATH(-8.1, 5)', "A1", ws );
		ok( oParser.parse(), 'FLOOR.MATH(-8.1, 5)' );
		strictEqual( oParser.calculate().getValue(), -10, 'FLOOR.MATH(-8.1, 5)' );

		oParser = new parserFormula( 'FLOOR.MATH(-5.5, 2, -1)', "A1", ws );
		ok( oParser.parse(), 'FLOOR.MATH(-5.5, 2, -1)' );
		strictEqual( oParser.calculate().getValue(), -4, 'FLOOR.MATH(-5.5, 2, -1)' );
	} );

	test( "Test: \"CEILING.MATH\"", function () {
		oParser = new parserFormula( 'CEILING.MATH(24.3, 5)', "A1", ws );
		ok( oParser.parse(), 'CEILING.MATH(24.3, 5)' );
		strictEqual( oParser.calculate().getValue(), 25, 'CEILING.MATH(24.3, 5)' );

		oParser = new parserFormula( 'CEILING.MATH(6.7)', "A1", ws );
		ok( oParser.parse(), 'CEILING.MATH(6.7)' );
		strictEqual( oParser.calculate().getValue(), 7, 'CEILING.MATH(6.7)' );

		oParser = new parserFormula( 'CEILING.MATH(-8.1, 2)', "A1", ws );
		ok( oParser.parse(), 'CEILING.MATH(-8.1, 2)' );
		strictEqual( oParser.calculate().getValue(), -8, 'CEILING.MATH(-8.1, 2)' );

		oParser = new parserFormula( 'CEILING.MATH(-5.5, 2, -1)', "A1", ws );
		ok( oParser.parse(), 'CEILING.MATH(-5.5, 2, -1)' );
		strictEqual( oParser.calculate().getValue(), -6, 'CEILING.MATH(-5.5, 2, -1)' );
	} );

	test( "Test: \"CEILING.PRECISE\"", function () {
		oParser = new parserFormula( 'CEILING.PRECISE(4.3)', "A1", ws );
		ok( oParser.parse(), 'CEILING.PRECISE(4.3)' );
		strictEqual( oParser.calculate().getValue(), 5, 'CEILING.PRECISE(4.3)' );

		oParser = new parserFormula( 'CEILING.PRECISE(-4.3)', "A1", ws );
		ok( oParser.parse(), 'CEILING.PRECISE(-4.3)' );
		strictEqual( oParser.calculate().getValue(), -4, 'CEILING.PRECISE(-4.3)' );

		oParser = new parserFormula( 'CEILING.PRECISE(4.3, 2)', "A1", ws );
		ok( oParser.parse(), 'CEILING.PRECISE(4.3, 2)' );
		strictEqual( oParser.calculate().getValue(), 6, 'CEILING.PRECISE(4.3, 2)' );

		oParser = new parserFormula( 'CEILING.PRECISE(4.3,-2)', "A1", ws );
		ok( oParser.parse(), 'CEILING.PRECISE(4.3,-2)' );
		strictEqual( oParser.calculate().getValue(), 6, 'CEILING.PRECISE(4.3,-2)' );

		oParser = new parserFormula( 'CEILING.PRECISE(-4.3,2)', "A1", ws );
		ok( oParser.parse(), 'CEILING.PRECISE(-4.3,2)' );
		strictEqual( oParser.calculate().getValue(), -4, 'CEILING.PRECISE(-4.3,2)' );

		oParser = new parserFormula( 'CEILING.PRECISE(-4.3,-2)', "A1", ws );
		ok( oParser.parse(), 'CEILING.PRECISE(-4.3,-2)' );
		strictEqual( oParser.calculate().getValue(), -4, 'CEILING.PRECISE(-4.3,-2)' );

		oParser = new parserFormula( 'CEILING.PRECISE(test)', "A1", ws );
		ok( oParser.parse(), 'CEILING.PRECISE(test)' );
		strictEqual( oParser.calculate().getValue(), "#NAME?", 'CEILING.PRECISE(test)' );
	} );

	test( "Test: \"ISO.CEILING\"", function () {
		oParser = new parserFormula( 'ISO.CEILING(4.3)', "A1", ws );
		ok( oParser.parse(), 'ISO.CEILING(4.3)' );
		strictEqual( oParser.calculate().getValue(), 5, 'ISO.CEILING(4.3)' );

		oParser = new parserFormula( 'ISO.CEILING(-4.3)', "A1", ws );
		ok( oParser.parse(), 'ISO.CEILING(-4.3)' );
		strictEqual( oParser.calculate().getValue(), -4, 'ISO.CEILING(-4.3)' );

		oParser = new parserFormula( 'ISO.CEILING(4.3, 2)', "A1", ws );
		ok( oParser.parse(), 'ISO.CEILING(4.3, 2)' );
		strictEqual( oParser.calculate().getValue(), 6, 'ISO.CEILING(4.3, 2)' );

		oParser = new parserFormula( 'ISO.CEILING(4.3,-2)', "A1", ws );
		ok( oParser.parse(), 'ISO.CEILING(4.3,-2)' );
		strictEqual( oParser.calculate().getValue(), 6, 'ISO.CEILING(4.3,-2)' );

		oParser = new parserFormula( 'ISO.CEILING(-4.3,2)', "A1", ws );
		ok( oParser.parse(), 'ISO.CEILING(-4.3,2)' );
		strictEqual( oParser.calculate().getValue(), -4, 'ISO.CEILING(-4.3,2)' );

		oParser = new parserFormula( 'ISO.CEILING(-4.3,-2)', "A1", ws );
		ok( oParser.parse(), 'ISO.CEILING(-4.3,-2)' );
		strictEqual( oParser.calculate().getValue(), -4, 'ISO.CEILING(-4.3,-2)' );
	} );

	test( "Test: \"CEILING\"", function () {

		oParser = new parserFormula( 'CEILING(2.5, 1)', "A1", ws );
		ok( oParser.parse(), 'CEILING(2.5, 1)' );
		strictEqual( oParser.calculate().getValue(), 3, 'CEILING(2.5, 1)' );

		oParser = new parserFormula( 'CEILING(-2.5, -2)', "A1", ws );
		ok( oParser.parse(), 'CEILING(-2.5, -2)' );
		strictEqual( oParser.calculate().getValue(), -4, 'CEILING(-2.5, -2)' );

		oParser = new parserFormula( 'CEILING(-2.5, 2)', "A1", ws );
		ok( oParser.parse(), 'CEILING(-2.5, 2)' );
		strictEqual( oParser.calculate().getValue(), -2, 'CEILING(-2.5, 2)' );

		oParser = new parserFormula( 'CEILING(1.5, 0.1)', "A1", ws );
		ok( oParser.parse(), 'CEILING(1.5, 0.1)' );
		strictEqual( oParser.calculate().getValue(), 1.5, 'CEILING(1.5, 0.1)' );

		oParser = new parserFormula( 'CEILING(0.234, 0.01)', "A1", ws );
		ok( oParser.parse(), 'CEILING(0.234, 0.01)' );
		strictEqual( oParser.calculate().getValue(), 0.24, 'CEILING(0.234, 0.01)' );

	} );

	test( "Test: \"ECMA.CEILING\"", function () {

		oParser = new parserFormula( 'ECMA.CEILING(2.5, 1)', "A1", ws );
		ok( oParser.parse(), 'ECMA.CEILING(2.5, 1)' );
		strictEqual( oParser.calculate().getValue(), 3, 'ECMA.CEILING(2.5, 1)' );

		oParser = new parserFormula( 'ECMA.CEILING(-2.5, -2)', "A1", ws );
		ok( oParser.parse(), 'ECMA.CEILING(-2.5, -2)' );
		strictEqual( oParser.calculate().getValue(), -4, 'ECMA.CEILING(-2.5, -2)' );

		oParser = new parserFormula( 'ECMA.CEILING(-2.5, 2)', "A1", ws );
		ok( oParser.parse(), 'ECMA.CEILING(-2.5, 2)' );
		strictEqual( oParser.calculate().getValue(), -2, 'ECMA.CEILING(-2.5, 2)' );

		oParser = new parserFormula( 'ECMA.CEILING(1.5, 0.1)', "A1", ws );
		ok( oParser.parse(), 'ECMA.CEILING(1.5, 0.1)' );
		strictEqual( oParser.calculate().getValue(), 1.5, 'ECMA.CEILING(1.5, 0.1)' );

		oParser = new parserFormula( 'ECMA.CEILING(0.234, 0.01)', "A1", ws );
		ok( oParser.parse(), 'ECMA.CEILING(0.234, 0.01)' );
		strictEqual( oParser.calculate().getValue(), 0.24, 'ECMA.CEILING(0.234, 0.01)' );

	} );

	test( "Test: \"COMBINA\"", function () {
		oParser = new parserFormula( 'COMBINA(4,3)', "A1", ws );
		ok( oParser.parse(), 'COMBINA(4,3)' );
		strictEqual( oParser.calculate().getValue(), 20, 'COMBINA(4,3)' );

		oParser = new parserFormula( 'COMBINA(10,3)', "A1", ws );
		ok( oParser.parse(), 'COMBINA(10,3)' );
		strictEqual( oParser.calculate().getValue(), 220, 'COMBINA(10,3)' );

		oParser = new parserFormula( 'COMBINA(3,10)', "A1", ws );
		ok( oParser.parse(), 'COMBINA(3,10)' );
		strictEqual( oParser.calculate().getValue(), "#NUM!", 'COMBINA(10,3)' );

		oParser = new parserFormula( 'COMBINA(10,-3)', "A1", ws );
		ok( oParser.parse(), 'COMBINA(10,-3)' );
		strictEqual( oParser.calculate().getValue(), "#NUM!", 'COMBINA(10,-3)' );
	} );

	test( "Test: \"DECIMAL\"", function () {
		oParser = new parserFormula( 'DECIMAL("FF",16)', "A1", ws );
		ok( oParser.parse(), 'DECIMAL("FF",16)' );
		strictEqual( oParser.calculate().getValue(), 255, 'DECIMAL("FF",16)' );

		oParser = new parserFormula( 'DECIMAL(111,2)', "A1", ws );
		ok( oParser.parse(), 'DECIMAL(111,2)' );
		strictEqual( oParser.calculate().getValue(), 7, 'DECIMAL(111,2)' );

		oParser = new parserFormula( 'DECIMAL("zap",36)', "A1", ws );
		ok( oParser.parse(), 'DECIMAL("zap",36)' );
		strictEqual( oParser.calculate().getValue(), 45745, 'DECIMAL("zap",36)' );
	} );

	test( "Test: \"BASE\"", function () {
		oParser = new parserFormula( 'BASE(7,2)', "A1", ws );
		ok( oParser.parse(), 'BASE(7,2)' );
		strictEqual( oParser.calculate().getValue(), "111", 'BASE(7,2)' );

		oParser = new parserFormula( 'BASE(100,16)', "A1", ws );
		ok( oParser.parse(), 'BASE(100,16)' );
		strictEqual( oParser.calculate().getValue(), "64", 'BASE(100,16)' );

		oParser = new parserFormula( 'BASE(15,2,10)', "A1", ws );
		ok( oParser.parse(), 'BASE(15,2,10)' );
		strictEqual( oParser.calculate().getValue(), "0000001111", 'BASE(15,2,10)' );
	} );

	test( "Test: \"ARABIC('LVII')\"", function () {
		oParser = new parserFormula( 'ARABIC("LVII")', "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 57 );
	} );

	test( "Test: \"TDIST\"", function () {
		oParser = new parserFormula( "TDIST(60,1,2)", "A1", ws );
		ok( oParser.parse(), "TDIST(60,1,2)" );
		strictEqual( oParser.calculate().getValue().toFixed(9) - 0, 0.010609347, "TDIST(60,1,2)" );

		oParser = new parserFormula( "TDIST(8,3,1)", "A1", ws );
		ok( oParser.parse(), "TDIST(8,3,1)" );
		strictEqual( oParser.calculate().getValue().toFixed(9) - 0, 0.002038289, "TDIST(8,3,1)" );

		ws.getRange2( "A2" ).setValue( "1.959999998" );
		ws.getRange2( "A3" ).setValue( "60" );

		oParser = new parserFormula( "TDIST(A2,A3,2)", "A1", ws );
		ok( oParser.parse(), "TDIST(A2,A3,2)" );
		strictEqual( oParser.calculate().getValue().toFixed(9) - 0, 0.054644930, "TDIST(A2,A3,2)" );

		oParser = new parserFormula( "TDIST(A2,A3,1)", "A1", ws );
		ok( oParser.parse(), "TDIST(A2,A3,1)" );
		strictEqual( oParser.calculate().getValue().toFixed(9) - 0, 0.027322465, "TDIST(A2,A3,1)" );
	} );

	test( "Test: \"T.DIST\"", function () {
		oParser = new parserFormula( "T.DIST(60,1,TRUE)", "A1", ws );
		ok( oParser.parse(), "T.DIST(60,1,TRUE)" );
		strictEqual( oParser.calculate().getValue().toFixed(8) - 0, 0.99469533, "T.DIST(60,1,TRUE)" );

		oParser = new parserFormula( "T.DIST(8,3,FALSE)", "A1", ws );
		ok( oParser.parse(), "T.DIST(8,3,FALSE)" );
		strictEqual( oParser.calculate().getValue().toFixed(8) - 0, 0.00073691, "T.DIST(8,3,FALSE)" );
	} );

	test( "Test: \"T.DIST.2T\"", function () {
		ws.getRange2( "A2" ).setValue( "1.959999998" );
		ws.getRange2( "A3" ).setValue( "60" );

		oParser = new parserFormula( "T.DIST.2T(A2,A3)", "A1", ws );
		ok( oParser.parse(), "T.DIST.2T(A2,A3)" );
		strictEqual( oParser.calculate().getValue().toFixed(9) - 0, 0.054644930, "T.DIST.2T(A2,A3)" );
	} );

	test( "Test: \"T.DIST.RT\"", function () {
		ws.getRange2( "A2" ).setValue( "1.959999998" );
		ws.getRange2( "A3" ).setValue( "60" );

		oParser = new parserFormula( "T.DIST.RT(A2,A3)", "A1", ws );
		ok( oParser.parse(), "T.DIST.RT(A2,A3)" );
		strictEqual( oParser.calculate().getValue().toFixed(6) - 0, 0.027322, "T.DIST.RT(A2,A3)" );
	} );

	test( "Test: \"TTEST\"", function () {
		ws.getRange2( "A2" ).setValue( "3" );
		ws.getRange2( "A3" ).setValue( "4" );
		ws.getRange2( "A4" ).setValue( "5" );
		ws.getRange2( "A5" ).setValue( "8" );
		ws.getRange2( "A6" ).setValue( "9" );
		ws.getRange2( "A7" ).setValue( "1" );
		ws.getRange2( "A8" ).setValue( "2" );
		ws.getRange2( "A9" ).setValue( "4" );
		ws.getRange2( "A10" ).setValue( "5" );

		ws.getRange2( "B2" ).setValue( "6" );
		ws.getRange2( "B3" ).setValue( "19" );
		ws.getRange2( "B4" ).setValue( "3" );
		ws.getRange2( "B5" ).setValue( "2" );
		ws.getRange2( "B6" ).setValue( "14" );
		ws.getRange2( "B7" ).setValue( "4" );
		ws.getRange2( "B8" ).setValue( "5" );
		ws.getRange2( "B9" ).setValue( "17" );
		ws.getRange2( "B10" ).setValue( "1" );

		oParser = new parserFormula( "TTEST(A2:A10,B2:B10,2,1)", "A1", ws );
		ok( oParser.parse(), "TTEST(A2:A10,B2:B10,2,1)" );
		strictEqual( oParser.calculate().getValue().toFixed(6) - 0, 0.196016, "TTEST(A2:A10,B2:B10,2,1)" );
	} );

	test( "Test: \"T.TEST\"", function () {
		ws.getRange2( "A2" ).setValue( "3" );
		ws.getRange2( "A3" ).setValue( "4" );
		ws.getRange2( "A4" ).setValue( "5" );
		ws.getRange2( "A5" ).setValue( "8" );
		ws.getRange2( "A6" ).setValue( "9" );
		ws.getRange2( "A7" ).setValue( "1" );
		ws.getRange2( "A8" ).setValue( "2" );
		ws.getRange2( "A9" ).setValue( "4" );
		ws.getRange2( "A10" ).setValue( "5" );

		ws.getRange2( "B2" ).setValue( "6" );
		ws.getRange2( "B3" ).setValue( "19" );
		ws.getRange2( "B4" ).setValue( "3" );
		ws.getRange2( "B5" ).setValue( "2" );
		ws.getRange2( "B6" ).setValue( "14" );
		ws.getRange2( "B7" ).setValue( "4" );
		ws.getRange2( "B8" ).setValue( "5" );
		ws.getRange2( "B9" ).setValue( "17" );
		ws.getRange2( "B10" ).setValue( "1" );

		oParser = new parserFormula( "T.TEST(A2:A10,B2:B10,2,1)", "A1", ws );
		ok( oParser.parse(), "T.TEST(A2:A10,B2:B10,2,1)" );
		strictEqual( oParser.calculate().getValue().toFixed(5) - 0, 0.19602, "T.TEST(A2:A10,B2:B10,2,1)" );
	} );

	test( "Test: \"ZTEST\"", function () {
		ws.getRange2( "A2" ).setValue( "3" );
		ws.getRange2( "A3" ).setValue( "6" );
		ws.getRange2( "A4" ).setValue( "7" );
		ws.getRange2( "A5" ).setValue( "8" );
		ws.getRange2( "A6" ).setValue( "6" );
		ws.getRange2( "A7" ).setValue( "5" );
		ws.getRange2( "A8" ).setValue( "4" );
		ws.getRange2( "A9" ).setValue( "2" );
		ws.getRange2( "A10" ).setValue( "1" );
		ws.getRange2( "A11" ).setValue( "9" );

		oParser = new parserFormula( "ZTEST(A2:A11,4)", "A1", ws );
		ok( oParser.parse(), "ZTEST(A2:A11,4)" );
		strictEqual( oParser.calculate().getValue().toFixed(6) - 0, 0.090574, "ZTEST(A2:A11,4)" );

		oParser = new parserFormula( "2 * MIN(ZTEST(A2:A11,4), 1 - ZTEST(A2:A11,4))", "A1", ws );
		ok( oParser.parse(), "2 * MIN(ZTEST(A2:A11,4), 1 - ZTEST(A2:A11,4))" );
		strictEqual( oParser.calculate().getValue().toFixed(6) - 0, 0.181148, "2 * MIN(ZTEST(A2:A11,4), 1 - ZTEST(A2:A11,4))" );

		oParser = new parserFormula( "ZTEST(A2:A11,6)", "A1", ws );
		ok( oParser.parse(), "ZTEST(A2:A11,6)" );
		strictEqual( oParser.calculate().getValue().toFixed(6) - 0, 0.863043, "ZTEST(A2:A11,6)" );

		oParser = new parserFormula( "2 * MIN(ZTEST(A2:A11,6), 1 - ZTEST(A2:A11,6))", "A1", ws );
		ok( oParser.parse(), "2 * MIN(ZTEST(A2:A11,6), 1 - ZTEST(A2:A11,6))" );
		strictEqual( oParser.calculate().getValue().toFixed(6) - 0, 0.273913, "2 * MIN(ZTEST(A2:A11,6), 1 - ZTEST(A2:A11,6))" );
	} );

	test( "Test: \"Z.TEST\"", function () {
		ws.getRange2( "A2" ).setValue( "3" );
		ws.getRange2( "A3" ).setValue( "6" );
		ws.getRange2( "A4" ).setValue( "7" );
		ws.getRange2( "A5" ).setValue( "8" );
		ws.getRange2( "A6" ).setValue( "6" );
		ws.getRange2( "A7" ).setValue( "5" );
		ws.getRange2( "A8" ).setValue( "4" );
		ws.getRange2( "A9" ).setValue( "2" );
		ws.getRange2( "A10" ).setValue( "1" );
		ws.getRange2( "A11" ).setValue( "9" );

		oParser = new parserFormula( "Z.TEST(A2:A11,4)", "A1", ws );
		ok( oParser.parse(), "Z.TEST(A2:A11,4)" );
		strictEqual( oParser.calculate().getValue().toFixed(6) - 0, 0.090574, "Z.TEST(A2:A11,4)" );

		oParser = new parserFormula( "2 * MIN(Z.TEST(A2:A11,4), 1 - Z.TEST(A2:A11,4))", "A1", ws );
		ok( oParser.parse(), "2 * MIN(Z.TEST(A2:A11,4), 1 - Z.TEST(A2:A11,4))" );
		strictEqual( oParser.calculate().getValue().toFixed(6) - 0, 0.181148, "2 * MIN(Z.TEST(A2:A11,4), 1 - Z.TEST(A2:A11,4))" );

		oParser = new parserFormula( "Z.TEST(A2:A11,6)", "A1", ws );
		ok( oParser.parse(), "Z.TEST(A2:A11,6)" );
		strictEqual( oParser.calculate().getValue().toFixed(6) - 0, 0.863043, "Z.TEST(A2:A11,6)" );

		oParser = new parserFormula( "2 * MIN(Z.TEST(A2:A11,6), 1 - Z.TEST(A2:A11,6))", "A1", ws );
		ok( oParser.parse(), "2 * MIN(Z.TEST(A2:A11,6), 1 - Z.TEST(A2:A11,6))" );
		strictEqual( oParser.calculate().getValue().toFixed(6) - 0, 0.273913, "2 * MIN(Z.TEST(A2:A11,6), 1 - Z.TEST(A2:A11,6))" );
	} );



	test( "Test: \"F.DIST\"", function () {
		ws.getRange2( "A2" ).setValue( "15.2069" );
		ws.getRange2( "A3" ).setValue( "6" );
		ws.getRange2( "A4" ).setValue( "4" );

		oParser = new parserFormula( "F.DIST(A2,A3,A4,TRUE)", "A1", ws );
		ok( oParser.parse(), "F.DIST(A2,A3,A4,TRUE)" );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 0.99, "F.DIST(A2,A3,A4,TRUE)" );

		oParser = new parserFormula( "F.DIST(A2,A3,A4,FALSE)", "A1", ws );
		ok( oParser.parse(), "F.DIST(A2,A3,A4,FALSE)" );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 0.0012238, "F.DIST(A2,A3,A4,FALSE)" );
	} );

	test( "Test: \"F.DIST.RT\"", function () {
		ws.getRange2( "A2" ).setValue( "15.2069" );
		ws.getRange2( "A3" ).setValue( "6" );
		ws.getRange2( "A4" ).setValue( "4" );

		oParser = new parserFormula( "F.DIST.RT(A2,A3,A4)", "A1", ws );
		ok( oParser.parse(), "F.DIST.RT(A2,A3,A4)" );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 0.01, "F.DIST.RT(A2,A3,A4)" );
	} );

	test( "Test: \"FDIST\"", function () {
		ws.getRange2( "A2" ).setValue( "15.2069" );
		ws.getRange2( "A3" ).setValue( "6" );
		ws.getRange2( "A4" ).setValue( "4" );

		oParser = new parserFormula( "FDIST(A2,A3,A4)", "A1", ws );
		ok( oParser.parse(), "FDIST(A2,A3,A4)" );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 0.01, "FDIST(A2,A3,A4)" );
	} );

	test( "Test: \"FINV\"", function () {
		ws.getRange2( "A2" ).setValue( "0.01" );
		ws.getRange2( "A3" ).setValue( "6" );
		ws.getRange2( "A4" ).setValue( "4" );

		oParser = new parserFormula( "FINV(A2,A3,A4)", "A1", ws );
		ok( oParser.parse(), "FINV(A2,A3,A4)" );
		strictEqual( oParser.calculate().getValue().toFixed(6) - 0, 15.206865, "FINV(A2,A3,A4)" );
	} );

	test( "Test: \"F.INV\"", function () {
		ws.getRange2( "A2" ).setValue( "0.01" );
		ws.getRange2( "A3" ).setValue( "6" );
		ws.getRange2( "A4" ).setValue( "4" );

		oParser = new parserFormula( "F.INV(A2,A3,A4)", "A1", ws );
		ok( oParser.parse(), "F.INV(A2,A3,A4)" );
		strictEqual( oParser.calculate().getValue().toFixed(8) - 0, 0.10930991, "F.INV(A2,A3,A4)" );
	} );

	test( "Test: \"F.INV.RT\"", function () {
		ws.getRange2( "A2" ).setValue( "0.01" );
		ws.getRange2( "A3" ).setValue( "6" );
		ws.getRange2( "A4" ).setValue( "4" );

		oParser = new parserFormula( "F.INV.RT(A2,A3,A4)", "A1", ws );
		ok( oParser.parse(), "F.INV.RT(A2,A3,A4)" );
		strictEqual( oParser.calculate().getValue().toFixed(5) - 0, 15.20686, "F.INV.RT(A2,A3,A4)" );
	} );

	function fTestFormulaTest(){
		ws.getRange2( "A2" ).setValue( "6" );
		ws.getRange2( "A3" ).setValue( "7" );
		ws.getRange2( "A4" ).setValue( "9" );
		ws.getRange2( "A5" ).setValue( "15" );
		ws.getRange2( "A6" ).setValue( "21" );

		ws.getRange2( "B2" ).setValue( "20" );
		ws.getRange2( "B3" ).setValue( "28" );
		ws.getRange2( "B4" ).setValue( "31" );
		ws.getRange2( "B5" ).setValue( "38" );
		ws.getRange2( "B6" ).setValue( "40" );

		oParser = new parserFormula( "FTEST(A2:A6,B2:B6)", "A1", ws );
		ok( oParser.parse(), "FTEST(A2:A6,B2:B6)" );
		strictEqual( oParser.calculate().getValue().toFixed(8) - 0, 0.64831785, "FTEST(A2:A6,B2:B6)" );

		oParser = new parserFormula( "FTEST(A2,B2:B6)", "A1", ws );
		ok( oParser.parse(), "FTEST(A2,B2:B6)" );
		strictEqual( oParser.calculate().getValue(), "#DIV/0!", "FTEST(A2,B2:B6)" );

		oParser = new parserFormula( "FTEST(1,B2:B6)", "A1", ws );
		ok( oParser.parse(), "FTEST(1,B2:B6)" );
		strictEqual( oParser.calculate().getValue(), "#DIV/0!", "FTEST(1,B2:B6)" );

		oParser = new parserFormula( "FTEST({1,2,3},{2,3,4,5})", "A1", ws );
		ok( oParser.parse(), "FTEST({1,2,3},{2,3,4,5})" );
		strictEqual( oParser.calculate().getValue().toFixed(9) - 0, 0.792636779, "FTEST({1,2,3},{2,3,4,5})" );

		oParser = new parserFormula( "FTEST({1,\"test\",\"test\"},{2,3,4,5})", "A1", ws );
		ok( oParser.parse(), "FTEST({1,\"test\",\"test\"},{2,3,4,5})" );
		strictEqual( oParser.calculate().getValue(), "#DIV/0!", "FTEST({1,\"test\",\"test\"},{2,3,4,5})" );
    }
	test( "Test: \"FTEST\"", function () {
		fTestFormulaTest();
	} );

	test( "Test: \"F.TEST\"", function () {
		fTestFormulaTest();
	} );

	test( "Test: \"T.INV\"", function () {
		oParser = new parserFormula( "T.INV(0.75,2)", "A1", ws );
		ok( oParser.parse(), "T.INV(0.75,2)" );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 0.8164966, "T.INV(0.75,2)" );
	} );

	test( "Test: \"T.INV.2T\"", function () {
		ws.getRange2( "A2" ).setValue( "0.546449" );
		ws.getRange2( "A3" ).setValue( "60" );

		oParser = new parserFormula( "T.INV.2T(A2,A3)", "A1", ws );
		ok( oParser.parse(), "T.INV.2T(A2,A3)" );
		strictEqual( oParser.calculate().getValue().toFixed(6) - 0, 0.606533, "T.INV.2T(A2,A3)" );
	} );

	test( "Test: \"RANK\"", function () {
		ws.getRange2( "A2" ).setValue( "7" );
		ws.getRange2( "A3" ).setValue( "3.5" );
		ws.getRange2( "A4" ).setValue( "3.5" );
		ws.getRange2( "A5" ).setValue( "1" );
		ws.getRange2( "A6" ).setValue( "2" );

		oParser = new parserFormula( "RANK(A3,A2:A6,1)", "A1", ws );
		ok( oParser.parse(), "RANK(A3,A2:A6,1)" );
		strictEqual( oParser.calculate().getValue(), 3, "RANK(A3,A2:A6,1)" );

		oParser = new parserFormula( "RANK(A2,A2:A6,1)", "A1", ws );
		ok( oParser.parse(), "RANK(A2,A2:A6,1)" );
		strictEqual( oParser.calculate().getValue(), 5, "RANK(A2,A2:A6,1)" );
	} );

	test( "Test: \"RANK.EQ\"", function () {
		ws.getRange2( "A2" ).setValue( "7" );
		ws.getRange2( "A3" ).setValue( "3.5" );
		ws.getRange2( "A4" ).setValue( "3.5" );
		ws.getRange2( "A5" ).setValue( "1" );
		ws.getRange2( "A6" ).setValue( "2" );

		oParser = new parserFormula( "RANK.EQ(A2,A2:A6,1)", "A1", ws );
		ok( oParser.parse(), "RANK.EQ(A2,A2:A6,1)" );
		strictEqual( oParser.calculate().getValue(), 5, "RANK.EQ(A2,A2:A6,1)" );

		oParser = new parserFormula( "RANK.EQ(A6,A2:A6)", "A1", ws );
		ok( oParser.parse(), "RANK.EQ(A6,A2:A6)" );
		strictEqual( oParser.calculate().getValue(), 4, "RANK.EQ(A6,A2:A6)" );

		oParser = new parserFormula( "RANK.EQ(A3,A2:A6,1)", "A1", ws );
		ok( oParser.parse(), "RANK.EQ(A3,A2:A6,1)" );
		strictEqual( oParser.calculate().getValue(), 3, "RANK.EQ(A3,A2:A6,1)" );
	} );

	test( "Test: \"RANK.AVG\"", function () {
		ws.getRange2( "A2" ).setValue( "89" );
		ws.getRange2( "A3" ).setValue( "88" );
		ws.getRange2( "A4" ).setValue( "92" );
		ws.getRange2( "A5" ).setValue( "101" );
		ws.getRange2( "A6" ).setValue( "94" );
		ws.getRange2( "A7" ).setValue( "97" );
		ws.getRange2( "A8" ).setValue( "95" );

		oParser = new parserFormula( "RANK.AVG(94,A2:A8)", "A1", ws );
		ok( oParser.parse(), "RANK.AVG(94,A2:A8)" );
		strictEqual( oParser.calculate().getValue(), 4, "RANK.AVG(94,A2:A8)" );
	} );

	test( "Test: \"LOGNORM.DIST\"", function () {
		ws.getRange2( "A2" ).setValue( "4" );
		ws.getRange2( "A3" ).setValue( "3.5" );
		ws.getRange2( "A4" ).setValue( "1.2" );

		oParser = new parserFormula( "LOGNORM.DIST(A2,A3,A4,TRUE)", "A1", ws );
		ok( oParser.parse(), "LOGNORM.DIST(A2,A3,A4,TRUE)" );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 0.0390836, "LOGNORM.DIST(A2,A3,A4,TRUE)" );

		oParser = new parserFormula( "LOGNORM.DIST(A2,A3,A4,FALSE)", "A1", ws );
		ok( oParser.parse(), "LOGNORM.DIST(A2,A3,A4,FALSE)" );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 0.0176176, "LOGNORM.DIST(A2,A3,A4,FALSE)" );
	} );

	test( "Test: \"LOGNORM.INV\"", function () {
		ws.getRange2( "A2" ).setValue( "0.039084" );
		ws.getRange2( "A3" ).setValue( "3.5" );
		ws.getRange2( "A4" ).setValue( "1.2" );

		oParser = new parserFormula( "LOGNORM.INV(A2, A3, A4)", "A1", ws );
		ok( oParser.parse(), "LOGNORM.INV(A2, A3, A4)" );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 4.0000252, "LOGNORM.INV(A2, A3, A4)" );
	} );

	test( "Test: \"GAMMA.DIST\"", function () {
		ws.getRange2( "A2" ).setValue( "10.00001131" );
		ws.getRange2( "A3" ).setValue( "9" );
		ws.getRange2( "A4" ).setValue( "2" );

	    oParser = new parserFormula( "GAMMA.DIST(A2,A3,A4,FALSE)", "A1", ws );
		ok( oParser.parse(), "GAMMA.DIST(A2,A3,A4,FALSE)" );
		strictEqual( oParser.calculate().getValue().toFixed(6) - 0, 0.032639, "GAMMA.DIST(A2,A3,A4,FALSE)" );

		oParser = new parserFormula( "GAMMA.DIST(A2,A3,A4,TRUE)", "A1", ws );
		ok( oParser.parse(), "GAMMA.DIST(A2,A3,A4,TRUE)" );
		strictEqual( oParser.calculate().getValue().toFixed(6) - 0, 0.068094, "GAMMA.DIST(A2,A3,A4,TRUE)" );
	} );

	test( "Test: \"GAMMADIST\"", function () {
		ws.getRange2( "A2" ).setValue( "10.00001131" );
		ws.getRange2( "A3" ).setValue( "9" );
		ws.getRange2( "A4" ).setValue( "2" );

		oParser = new parserFormula( "GAMMADIST(A2,A3,A4,FALSE)", "A1", ws );
		ok( oParser.parse(), "GAMMADIST(A2,A3,A4,FALSE)" );
		strictEqual( oParser.calculate().getValue().toFixed(6) - 0, 0.032639, "GAMMADIST(A2,A3,A4,FALSE)" );

		oParser = new parserFormula( "GAMMADIST(A2,A3,A4,TRUE)", "A1", ws );
		ok( oParser.parse(), "GAMMADIST(A2,A3,A4,TRUE)" );
		strictEqual( oParser.calculate().getValue().toFixed(6) - 0, 0.068094, "GAMMADIST(A2,A3,A4,TRUE)" );
	} );

	test( "Test: \"EXPON.DIST\"", function () {
		ws.getRange2( "A2" ).setValue( "0.2" );
		ws.getRange2( "A3" ).setValue( "10" );

		oParser = new parserFormula( "EXPON.DIST(A2,A3,TRUE)", "A1", ws );
		ok( oParser.parse(), "EXPON.DIST(A2,A3,TRUE)" );
		strictEqual( oParser.calculate().getValue().toFixed(8) - 0, 0.86466472, "EXPON.DIST(A2,A3,TRUE)" );

		oParser = new parserFormula( "EXPON.DIST(0.2,10,FALSE)", "A1", ws );
		ok( oParser.parse(), "EXPON.DIST(0.2,10,FALSE)" );
		strictEqual( oParser.calculate().getValue().toFixed(8) - 0, 1.35335283, "EXPON.DIST(0.2,10,FALSE)" );
	} );

	test( "Test: \"CHITEST\"", function () {
		ws.getRange2( "A2" ).setValue( "58" );
		ws.getRange2( "A3" ).setValue( "11" );
		ws.getRange2( "A4" ).setValue( "10" );
		ws.getRange2( "A5" ).setValue( "x" );
		ws.getRange2( "A6" ).setValue( "45.35" );
		ws.getRange2( "A7" ).setValue( "17.56" );
		ws.getRange2( "A8" ).setValue( "16.09" );

		ws.getRange2( "B2" ).setValue( "35" );
		ws.getRange2( "B3" ).setValue( "25" );
		ws.getRange2( "B4" ).setValue( "23" );
		ws.getRange2( "B5" ).setValue( "x" );
		ws.getRange2( "B6" ).setValue( "47.65" );
		ws.getRange2( "B7" ).setValue( "18.44" );
		ws.getRange2( "B8" ).setValue( "16.91" );

		oParser = new parserFormula( "CHITEST(A2:B4,A6:B8)", "A1", ws );
		ok( oParser.parse(), "CHITEST(A2:B4,A6:B8)" );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 0.0003082, "CHITEST(A2:B4,A6:B8)" );
	} );

	test( "Test: \"CHISQ.TEST\"", function () {
		ws.getRange2( "A2" ).setValue( "58" );
		ws.getRange2( "A3" ).setValue( "11" );
		ws.getRange2( "A4" ).setValue( "10" );
		ws.getRange2( "A5" ).setValue( "x" );
		ws.getRange2( "A6" ).setValue( "45.35" );
		ws.getRange2( "A7" ).setValue( "17.56" );
		ws.getRange2( "A8" ).setValue( "16.09" );

		ws.getRange2( "B2" ).setValue( "35" );
		ws.getRange2( "B3" ).setValue( "25" );
		ws.getRange2( "B4" ).setValue( "23" );
		ws.getRange2( "B5" ).setValue( "x" );
		ws.getRange2( "B6" ).setValue( "47.65" );
		ws.getRange2( "B7" ).setValue( "18.44" );
		ws.getRange2( "B8" ).setValue( "16.91" );

		oParser = new parserFormula( "CHISQ.TEST(A2:B4,A6:B8)", "A1", ws );
		ok( oParser.parse(), "CHISQ.TEST(A2:B4,A6:B8)" );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 0.0003082, "CHISQ.TEST(A2:B4,A6:B8)" );
	} );

	test( "Test: \"CHITEST\"", function () {
		ws.getRange2( "A2" ).setValue( "18.307" );
		ws.getRange2( "A3" ).setValue( "10" );

		oParser = new parserFormula( "CHIDIST(A2,A3)", "A1", ws );
		ok( oParser.parse(), "CHIDIST(A2,A3)" );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 0.0500006, "CHIDIST(A2,A3)" );
	} );

	test( "Test: \"GAUSS\"", function () {
		oParser = new parserFormula( "GAUSS(2)", "A1", ws );
		ok( oParser.parse(), "GAUSS(2)" );
		strictEqual( oParser.calculate().getValue().toFixed(5) - 0, 0.47725, "GAUSS(2)" );
	} );

	test( "Test: \"CHISQ.DIST.RT\"", function () {
		ws.getRange2( "A2" ).setValue( "18.307" );
		ws.getRange2( "A3" ).setValue( "10" );

		oParser = new parserFormula( "CHISQ.DIST.RT(A2,A3)", "A1", ws );
		ok( oParser.parse(), "CHISQ.DIST.RT(A2,A3)" );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 0.0500006, "CHISQ.DIST.RT(A2,A3)" );
	} );

	test( "Test: \"CHISQ.INV\"", function () {
		oParser = new parserFormula( "CHISQ.INV(0.93,1)", "A1", ws );
		ok( oParser.parse(), "CHISQ.INV(0.93,1)" );
		strictEqual( oParser.calculate().getValue().toFixed(9) - 0, 3.283020287, "CHISQ.INV(0.93,1)" );

		oParser = new parserFormula( "CHISQ.INV(0.6,2)", "A1", ws );
		ok( oParser.parse(), "CHISQ.INV(0.6,2)" );
		strictEqual( oParser.calculate().getValue().toFixed(9) - 0, 1.832581464, "CHISQ.INV(0.6,2)" );
	} );

	test( "Test: \"CHISQ.DIST\"", function () {
		oParser = new parserFormula( "CHISQ.DIST(0.5,1,TRUE)", "A1", ws );
		ok( oParser.parse(), "CHISQ.DIST(0.5,1,TRUE)" );
		strictEqual( oParser.calculate().getValue().toFixed(8) - 0, 0.52049988, "CHISQ.DIST(0.5,1,TRUE)" );

		oParser = new parserFormula( "CHISQ.DIST(2,3,FALSE)", "A1", ws );
		ok( oParser.parse(), "CHISQ.DIST(2,3,FALSE)" );
		strictEqual( oParser.calculate().getValue().toFixed(8) - 0, 0.20755375, "CHISQ.DIST(2,3,FALSE)" );
	} );

	test( "Test: \"CHIINV\"", function () {
		ws.getRange2( "A2" ).setValue( "0.050001" );
		ws.getRange2( "A3" ).setValue( "10" );

		oParser = new parserFormula( "CHIINV(A2,A3)", "A1", ws );
		ok( oParser.parse(), "CHIINV(A2,A3)" );
		strictEqual( oParser.calculate().getValue().toFixed(6) - 0, 18.306973, "CHIINV(A2,A3)" );
	} );

	test( "Test: \"CHISQ.INV.RT\"", function () {
		ws.getRange2( "A2" ).setValue( "0.050001" );
		ws.getRange2( "A3" ).setValue( "10" );

		oParser = new parserFormula( "CHISQ.INV.RT(A2,A3)", "A1", ws );
		ok( oParser.parse(), "CHISQ.INV.RT(A2,A3)" );
		strictEqual( oParser.calculate().getValue().toFixed(6) - 0, 18.306973, "CHISQ.INV.RT(A2,A3)" );
	} );

	test( "Test: \"BETA.INV\"", function () {
		ws.getRange2( "A2" ).setValue( "0.685470581" );
		ws.getRange2( "A3" ).setValue( "8" );
		ws.getRange2( "A4" ).setValue( "10" );
		ws.getRange2( "A5" ).setValue( "1" );
		ws.getRange2( "A6" ).setValue( "3" );

		oParser = new parserFormula( "BETA.INV(A2,A3,A4,A5,A6)", "A1", ws );
		ok( oParser.parse(), "BETA.INV(A2,A3,A4,A5,A6)" );
		strictEqual( oParser.calculate().getValue().toFixed(1) - 0, 2, "BETA.INV(A2,A3,A4,A5,A6)" );
	} );

	test( "Test: \"BETA.DIST\"", function () {
		ws.getRange2( "A2" ).setValue( "2" );
		ws.getRange2( "A3" ).setValue( "8" );
		ws.getRange2( "A4" ).setValue( "10" );
		ws.getRange2( "A5" ).setValue( "1" );
		ws.getRange2( "A6" ).setValue( "3" );

		oParser = new parserFormula( "BETA.DIST(A2,A3,A4,TRUE,A5,A6)", "A1", ws );
		ok( oParser.parse(), "BETA.DIST(A2,A3,A4,TRUE,A5,A6)" );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 0.6854706, "BETA.DIST(A2,A3,A4,TRUE,A5,A6)" );

		oParser = new parserFormula( "BETA.DIST(A2,A3,A4,FALSE,A5,A6)", "A1", ws );
		ok( oParser.parse(), "BETA.DIST(A2,A3,A4,FALSE,A5,A6)" );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 1.4837646, "BETA.DIST(A2,A3,A4,FALSE,A5,A6)" );
	} );

	test( "Test: \"BETADIST\"", function () {
		ws.getRange2( "A2" ).setValue( "2" );
		ws.getRange2( "A3" ).setValue( "8" );
		ws.getRange2( "A4" ).setValue( "10" );
		ws.getRange2( "A5" ).setValue( "1" );
		ws.getRange2( "A6" ).setValue( "3" );

		oParser = new parserFormula( "BETADIST(A2,A3,A4,A5,A6)", "A1", ws );
		ok( oParser.parse(), "BETADIST(A2,A3,A4,A5,A6)" );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 0.6854706, "BETADIST(A2,A3,A4,A5,A6)" );

		oParser = new parserFormula( "BETADIST(1,2,3,1,6)", "A1", ws );
		ok( oParser.parse(), "BETADIST(1,2,3,1,6)" );
		strictEqual( oParser.calculate().getValue(), 0, "BETADIST(1,2,3,1,6)" );

		oParser = new parserFormula( "BETADIST(6,2,3,1,6)", "A1", ws );
		ok( oParser.parse(), "BETADIST(6,2,3,1,6)" );
		strictEqual( oParser.calculate().getValue(), 1, "BETADIST(6,2,3,1,6)" );
	} );

	test( "Test: \"BESSELJ\"", function () {

		oParser = new parserFormula( "BESSELJ(1.9, 2)", "A1", ws );
		ok( oParser.parse(), "BESSELJ(1.9, 2)" );
		strictEqual( oParser.calculate().getValue().toFixed(9) - 0, 0.329925728, "BESSELJ(1.9, 2)" );

		oParser = new parserFormula( "BESSELJ(1.9, 2.4)", "A1", ws );
		ok( oParser.parse(), "BESSELJ(1.9, 2.4)" );
		strictEqual( oParser.calculate().getValue().toFixed(9) - 0, 0.329925728, "BESSELJ(1.9, 2.4)" );

		oParser = new parserFormula( "BESSELJ(-1.9, 2.4)", "A1", ws );
		ok( oParser.parse(), "BESSELJ(-1.9, 2.4)" );
		strictEqual( oParser.calculate().getValue().toFixed(9) - 0, 0.329925728, "BESSELJ(-1.9, 2.4)" );

		oParser = new parserFormula( "BESSELJ(-1.9, -2.4)", "A1", ws );
		ok( oParser.parse(), "BESSELJ(-1.9, -2.4)" );
		strictEqual( oParser.calculate().getValue(), "#NUM!" );
	} );

	test( "Test: \"BESSELK\"", function () {

		oParser = new parserFormula( "BESSELK(1.5, 1)", "A1", ws );
		ok( oParser.parse(), "BESSELK(1.5, 1)" );
		strictEqual( oParser.calculate().getValue().toFixed(9) - 0, 0.277387804, "BESSELK(1.5, 1)" );

		oParser = new parserFormula( "BESSELK(1, 3)", "A1", ws );
		ok( oParser.parse(), "BESSELK(1, 3)" );
		strictEqual( oParser.calculate().getValue().toFixed(8) - 0, 7.10126281, "BESSELK(1, 3)" );

		oParser = new parserFormula( "BESSELK(-1.123,2)", "A1", ws );
		ok( oParser.parse(), "BESSELK(-1.123,2)" );
		strictEqual( oParser.calculate().getValue(), "#NUM!" );

		oParser = new parserFormula( "BESSELK(1,-2)", "A1", ws );
		ok( oParser.parse(), "BESSELK(1,-2)" );
		strictEqual( oParser.calculate().getValue(), "#NUM!" );

	} );

	test( "Test: \"BESSELY\"", function () {

		oParser = new parserFormula( "BESSELY(2.5, 1)", "A1", ws );
		ok( oParser.parse(), "BESSELY(2.5, 1)" );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 0.1459181, "BESSELY(2.5, 1)" );

		oParser = new parserFormula( "BESSELY(1,-2)", "A1", ws );
		ok( oParser.parse(), "BESSELY(1,-2)" );
		strictEqual( oParser.calculate().getValue(), "#NUM!", "BESSELY(1,-2)" );

		oParser = new parserFormula( "BESSELY(-1,2)", "A1", ws );
		ok( oParser.parse(), "BESSELY(-1,2)" );
		strictEqual( oParser.calculate().getValue(), "#NUM!", "BESSELY(-1,2)" );

	} );

	test( "Test: \"BESSELI\"", function () {
		//есть различия excel в некоторых формулах(неточности в 7 цифре после точки)
		oParser = new parserFormula( "BESSELI(1.5, 1)", "A1", ws );
		ok( oParser.parse(), "BESSELI(1.5, 1)" );
		strictEqual( oParser.calculate().getValue().toFixed(6) - 0, 0.981666, "BESSELI(1.5, 1)" );

		oParser = new parserFormula( "BESSELI(1,2)", "A1", ws );
		ok( oParser.parse(), "BESSELI(1,2)" );
		strictEqual( oParser.calculate().getValue().toFixed(6) - 0, 0.135748, "BESSELI(1,2)" );

		oParser = new parserFormula( "BESSELI(1,-2)", "A1", ws );
		ok( oParser.parse(), "BESSELI(1,-2)" );
		strictEqual( oParser.calculate().getValue(), "#NUM!", "BESSELI(1,-2)" );

		oParser = new parserFormula( "BESSELI(-1,2)", "A1", ws );
		ok( oParser.parse(), "BESSELI(-1,2)" );
		strictEqual( oParser.calculate().getValue().toFixed(6) - 0, 0.135748, "BESSELI(-1,2)" );

	} );

	test( "Test: \"GAMMA.INV\"", function () {
		ws.getRange2( "A2" ).setValue( "0.068094" );
		ws.getRange2( "A3" ).setValue( "9" );
		ws.getRange2( "A4" ).setValue( "2" );

		oParser = new parserFormula( "GAMMA.INV(A2,A3,A4)", "A1", ws );
		ok( oParser.parse(), "GAMMA.INV(A2,A3,A4)" );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 10.0000112, "GAMMA.INV(A2,A3,A4)" );
	} );

	test( "Test: \"GAMMAINV\"", function () {
		ws.getRange2( "A2" ).setValue( "0.068094" );
		ws.getRange2( "A3" ).setValue( "9" );
		ws.getRange2( "A4" ).setValue( "2" );

		oParser = new parserFormula( "GAMMAINV(A2,A3,A4)", "A1", ws );
		ok( oParser.parse(), "GAMMAINV(A2,A3,A4)" );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 10.0000112, "GAMMAINV(A2,A3,A4)" );
	} );
    
	test( "Test: \"SUM(1,2,3)\"", function () {
        oParser = new parserFormula( 'SUM(1,2,3)', "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 + 2 + 3 );
    } );

    test( "Test: \"\"s\"&5\"", function () {
        oParser = new parserFormula( "\"s\"&5", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "s5" );
    } );

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

    } );

    test( "Test: \"POWER(2,8)\"", function () {
        oParser = new parserFormula( "POWER(2,8)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), Math.pow( 2, 8 ) );
    } );

    test( "Test: \"POWER(0,-3)\"", function () {
        oParser = new parserFormula( "POWER(0,-3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#DIV/0!" );
    } );

	test( "Test: \"ISNA(A1)\"", function () {
		ws.getRange2( "A1" ).setValue( "#N/A" );

		oParser = new parserFormula( "ISNA(A1)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "TRUE" );
	} );

    test( "Test: \"ROUNDUP(31415.92654,-2)\"", function () {
        oParser = new parserFormula( "ROUNDUP(31415.92654,-2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 31500 );
    } );

    test( "Test: \"ROUNDUP(3.2,0)\"", function () {
        oParser = new parserFormula( "ROUNDUP(3.2,0)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 4 );
    } );

    test( "Test: \"ROUNDUP(-3.14159,1)\"", function () {
        oParser = new parserFormula( "ROUNDUP(-3.14159,1)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -3.2 );
    } );

    test( "Test: \"ROUNDUP(3.14159,3)\"", function () {
        oParser = new parserFormula( "ROUNDUP(3.14159,3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3.142 );
    } );

    test( "Test: \"ROUNDDOWN(31415.92654,-2)\"", function () {
        oParser = new parserFormula( "ROUNDDOWN(31415.92654,-2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 31400 );
    } );

    test( "Test: \"ROUNDDOWN(-3.14159,1)\"", function () {
        oParser = new parserFormula( "ROUNDDOWN(-3.14159,1)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -3.1 );
    } );

    test( "Test: \"ROUNDDOWN(3.14159,3)\"", function () {
        oParser = new parserFormula( "ROUNDDOWN(3.14159,3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3.141 );
    } );

    test( "Test: \"ROUNDDOWN(3.2,0)\"", function () {
        oParser = new parserFormula( "ROUNDDOWN(3.2,0)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3 );
    } );

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
    } );

    test( "Test: \"T(\"HELLO\")\"", function () {
        oParser = new parserFormula( "T(\"HELLO\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "HELLO" );
    } );

    test( "Test: \"T(123)\"", function () {
        oParser = new parserFormula( "T(123)", "A1", ws );
        ok( oParser.parse() );
        ok( !oParser.calculate().getValue(), "123" );
    } );

    test( "Test: YEAR", function () {
        oParser = new parserFormula( "YEAR(2013)", "A1", ws );
        ok( oParser.parse() );
        if ( AscCommon.bDate1904 )
            strictEqual( oParser.calculate().getValue(), 1909 );
        else
            strictEqual( oParser.calculate().getValue(), 1905 );
    } );

    test( "Test: DAY", function () {
        oParser = new parserFormula( "DAY(2013)", "A1", ws );
        ok( oParser.parse() );
        if ( AscCommon.bDate1904 )
            strictEqual( oParser.calculate().getValue(), 6 );
        else
            strictEqual( oParser.calculate().getValue(), 5 );
    } );

	test( "Test: DAYS", function () {
		ws.getRange2( "A2" ).setValue( "12/31/2011" );
		ws.getRange2( "A3" ).setValue( "1/1/2011" );

	    oParser = new parserFormula( 'DAYS("3/15/11","2/1/11")', "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 42 );

		oParser = new parserFormula( "DAYS(A2,A3)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 364 );
	} );

    test( "Test: DAY 2", function () {
        oParser = new parserFormula( "DAY(\"20 may 2045\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 20 );
    } );

    test( "Test: MONTH #1", function () {
        oParser = new parserFormula( "MONTH(2013)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 7 );
    } );

    test( "Test: MONTH #2", function () {
        oParser = new parserFormula( "MONTH(DATE(2013,2,2))", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2 );
    } );

    test( "Test: MONTH #3", function () {
        oParser = new parserFormula( "MONTH(NOW())", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), new Date().getUTCMonth() + 1 );
    } );

    test( "Test: \"10-3\"", function () {
        oParser = new parserFormula( "10-3", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 7 );
    } );

    test( "Test: \"SUM\"", function () {

		ws.getRange2( "S5" ).setValue( "1" );
		ws.getRange2( "S6" ).setValue( numDivFact(-1, 2) );
		ws.getRange2( "S7" ).setValue( numDivFact(1, 4) );
		ws.getRange2( "S8" ).setValue( numDivFact(-1, 6) );

        oParser = new parserFormula( "SUM(S5:S8)", "A1", ws );
        ok( oParser.parse() );
//        strictEqual( oParser.calculate().getValue(), 1-1/Math.fact(2)+1/Math.fact(4)-1/Math.fact(6) );
        ok( Math.abs( oParser.calculate().getValue() - (1 - 1 / Math.fact( 2 ) + 1 / Math.fact( 4 ) - 1 / Math.fact( 6 )) ) < dif );
    } );

    test( "Test: \"MAX\"", function () {

		ws.getRange2( "S5" ).setValue( "1" );
		ws.getRange2( "S6" ).setValue( numDivFact(-1, 2) );
		ws.getRange2( "S7" ).setValue( numDivFact(1, 4) );
		ws.getRange2( "S8" ).setValue( numDivFact(-1, 6) );

        oParser = new parserFormula( "MAX(S5:S8)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

		ws.getRange2( "S5" ).setValue( "#DIV/0!" );
		ws.getRange2( "S6" ).setValue( "TRUE" );
		ws.getRange2( "S7" ).setValue( "qwe" );
		ws.getRange2( "S8" ).setValue( "" );
		ws.getRange2( "S9" ).setValue( "-1" );
		oParser = new parserFormula( "MAX(S5)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#DIV/0!" );
		oParser = new parserFormula( "MAX(S6)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 0 );
		oParser = new parserFormula( "MAX(S7)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 0 );
		oParser = new parserFormula( "MAX(S8)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 0 );
		oParser = new parserFormula( "MAX(S5:S9)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#DIV/0!" );
		oParser = new parserFormula( "MAX(S6:S9)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), -1 );
		oParser = new parserFormula( "MAX(-1, TRUE)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 1 );
    } );

    test( "Test: \"MAXA\"", function () {

		ws.getRange2( "S5" ).setValue( "1" );
		ws.getRange2( "S6" ).setValue( numDivFact(-1, 2) );
		ws.getRange2( "S7" ).setValue( numDivFact(1, 4) );
		ws.getRange2( "S8" ).setValue( numDivFact(-1, 6) );

        oParser = new parserFormula( "MAXA(S5:S8)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

		ws.getRange2( "S5" ).setValue( "#DIV/0!" );
		ws.getRange2( "S6" ).setValue( "TRUE" );
		ws.getRange2( "S7" ).setValue( "qwe" );
		ws.getRange2( "S8" ).setValue( "" );
		ws.getRange2( "S9" ).setValue( "-1" );
		oParser = new parserFormula( "MAXA(S5)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#DIV/0!" );
		oParser = new parserFormula( "MAXA(S6)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 1 );
		oParser = new parserFormula( "MAXA(S7)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 0 );
		oParser = new parserFormula( "MAXA(S8)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 0 );
		oParser = new parserFormula( "MAXA(S5:S9)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#DIV/0!" );
		oParser = new parserFormula( "MAXA(S6:S9)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 1 );
		oParser = new parserFormula( "MAXA(-1, TRUE)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 1 );
    } );

    test( "Test: \"MIN\"", function () {

		ws.getRange2( "S5" ).setValue( "1" );
		ws.getRange2( "S6" ).setValue( numDivFact(-1, 2) );
		ws.getRange2( "S7" ).setValue( numDivFact(1, 4) );
		ws.getRange2( "S8" ).setValue( numDivFact(-1, 6) );

        oParser = new parserFormula( "MIN(S5:S8)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -1 / Math.fact( 2 ) );

		ws.getRange2( "S5" ).setValue( "#DIV/0!" );
		ws.getRange2( "S6" ).setValue( "TRUE" );
		ws.getRange2( "S7" ).setValue( "qwe" );
		ws.getRange2( "S8" ).setValue( "" );
		ws.getRange2( "S9" ).setValue( "2" );
		oParser = new parserFormula( "MIN(S5)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#DIV/0!" );
		oParser = new parserFormula( "MIN(S6)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 0 );
		oParser = new parserFormula( "MIN(S7)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 0 );
		oParser = new parserFormula( "MIN(S8)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 0 );
		oParser = new parserFormula( "MIN(S5:S9)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#DIV/0!" );
		oParser = new parserFormula( "MIN(S6:S9)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 2 );
		oParser = new parserFormula( "MIN(2, TRUE)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 1 );
    } );

    test( "Test: \"MINA\"", function () {

		ws.getRange2( "S5" ).setValue( "1" );
		ws.getRange2( "S6" ).setValue( numDivFact(-1, 2) );
		ws.getRange2( "S7" ).setValue( numDivFact(1, 4) );
		ws.getRange2( "S8" ).setValue( numDivFact(-1, 6) );

        oParser = new parserFormula( "MINA(S5:S8)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), -1 / Math.fact( 2 ) );

		ws.getRange2( "S5" ).setValue( "#DIV/0!" );
		ws.getRange2( "S6" ).setValue( "TRUE" );
		ws.getRange2( "S7" ).setValue( "qwe" );
		ws.getRange2( "S8" ).setValue( "" );
		ws.getRange2( "S9" ).setValue( "2" );
		oParser = new parserFormula( "MINA(S5)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#DIV/0!" );
		oParser = new parserFormula( "MINA(S6)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 1 );
		oParser = new parserFormula( "MINA(S7)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 0 );
		oParser = new parserFormula( "MINA(S8)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 0 );
		oParser = new parserFormula( "MINA(S5:S9)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#DIV/0!" );
		oParser = new parserFormula( "MINA(S6:S9)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 0 );
		oParser = new parserFormula( "MINA(2, TRUE)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 1 );
    } );

    test( "Test: SUM(S7:S9,{1,2,3})", function () {
        ws.getRange2( "S7" ).setValue( "1" );
        ws.getRange2( "S8" ).setValue( "2" );
        ws.getRange2( "S9" ).setValue( "3" );

		oParser = new parserFormula( "SUM(S7:S9,{1,2,3})", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 12 );
    } );

    test( "Test: ISREF", function () {
        oParser = new parserFormula( "ISREF(G0)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "FALSE" );
    } );

    test( "Test: MOD", function () {
        oParser = new parserFormula( "MOD(7,3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );
    } );

    test( "Test: rename sheet #1", function () {
		wb.dependencyFormulas.unlockRecal();
		ws.getRange2( "S95" ).setValue( "2" );
		ws.getRange2( "S100" ).setValue( "=" + wb.getWorksheet( 0 ).getName() + "!S95" );
		ws.setName( "SheetTmp" );
        strictEqual( ws.getCell2( "S100" ).getFormula(), ws.getName() + "!S95" );
		wb.dependencyFormulas.lockRecal();
    } );

    test( "Test: wrong ref", function () {
        oParser = new parserFormula( "1+XXX1", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NAME?" );
    } );

    test( "Test: \"CODE\"", function () {
        oParser = new parserFormula( "CODE(\"abc\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 97 );
    } );

    test( "Test: \"CHAR\"", function () {
        oParser = new parserFormula( "CHAR(97)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "a" );
    } );

    test( "Test: \"CHAR(CODE())\"", function () {
        oParser = new parserFormula( "CHAR(CODE(\"A\"))", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "A" );
    } );

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
    } );

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
    } );

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
    } );

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

    } );

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

    } );

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

    } );

	test( "Test: \"SHEET\"", function () {

		oParser = new parserFormula( "SHEET(Hi_Temps)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#NAME?" );

	} );

	test( "Test: \"SHEETS\"", function () {

		oParser = new parserFormula( "SHEETS(Hi_Temps)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#NAME?" );

		oParser = new parserFormula( "SHEETS()", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 1 );
	} );

    test( "Test: \"TRIM\"", function () {

        oParser = new parserFormula( "TRIM(\"     abc         def      \")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "abc def" );

		oParser = new parserFormula( "TRIM(\" First Quarter Earnings \")", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "First Quarter Earnings" );

    } );

	test( "Test: \"TRIMMEAN\"", function () {
		ws.getRange2( "A2" ).setValue( "4" );
		ws.getRange2( "A3" ).setValue( "5" );
		ws.getRange2( "A4" ).setValue( "6" );
		ws.getRange2( "A5" ).setValue( "7" );
		ws.getRange2( "A6" ).setValue( "2" );
		ws.getRange2( "A7" ).setValue( "3" );
		ws.getRange2( "A8" ).setValue( "4" );
		ws.getRange2( "A9" ).setValue( "5" );
		ws.getRange2( "A10" ).setValue( "1" );
		ws.getRange2( "A11" ).setValue( "2" );
		ws.getRange2( "A12" ).setValue( "3" );

		oParser = new parserFormula( "TRIMMEAN(A2:A12,0.2)", "A1", ws );
		ok( oParser.parse(), "TRIMMEAN(A2:A12,0.2)" );
		strictEqual( oParser.calculate().getValue().toFixed(3) - 0, 3.778, "TRIMMEAN(A2:A12,0.2)" );
	} );

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

    } );

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

        if ( AscCommon.bDate1904 )
            strictEqual( oParser.calculate().getValue(), 37340 );
        else
            strictEqual( oParser.calculate().getValue(), 38802 );

        oParser = new parserFormula( "VALUE(\"16:48:00\")-VALUE(\"12:17:12\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), AscCommon.g_oFormatParser.parse( "16:48:00" ).value - AscCommon.g_oFormatParser.parse( "12:17:12" ).value );

    } );

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

        if ( AscCommon.bDate1904 )
            strictEqual( oParser.calculate().getValue(), 37340 );
        else
            strictEqual( oParser.calculate().getValue(), 38802 );
    } );

    test( "Test: \"EDATE\"", function () {

        if ( !AscCommon.bDate1904 ) {
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
    } );

    test( "Test: \"EOMONTH\"", function () {

        if ( !AscCommon.bDate1904 ) {
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
    } );

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

    } );

	test( "Test: \"NETWORKDAYS.INTL\"", function () {

		var formulaStr = "NETWORKDAYS.INTL(DATE(2006,1,1),DATE(2006,1,31))";
	    oParser = new parserFormula( formulaStr, "A2", ws );
		ok( oParser.parse(), formulaStr );
		strictEqual( oParser.calculate().getValue(), 22, formulaStr );

		formulaStr = "NETWORKDAYS.INTL(DATE(2006,2,28),DATE(2006,1,31))";
		oParser = new parserFormula( formulaStr, "A2", ws );
		ok( oParser.parse(), formulaStr );
		strictEqual( oParser.calculate().getValue(), -21, formulaStr );

		formulaStr = 'NETWORKDAYS.INTL(DATE(2006,1,1),DATE(2006,2,1),7,{"1/2/2006","1/16/2006"})';
		oParser = new parserFormula( formulaStr, "A2", ws );
		ok( oParser.parse(), formulaStr );
		strictEqual( oParser.calculate().getValue(), 22, formulaStr );

		formulaStr = 'NETWORKDAYS.INTL(DATE(2006,1,1),DATE(2006,2,1),17,{"1/2/2006","1/16/2006"})';
		oParser = new parserFormula( formulaStr, "A2", ws );
		ok( oParser.parse(), formulaStr );
		strictEqual( oParser.calculate().getValue(), 26, formulaStr );

		formulaStr = 'NETWORKDAYS.INTL(DATE(2006,1,1),DATE(2006,2,1),"1111111",{"1/2/2006","1/16/2006"})';
		oParser = new parserFormula( formulaStr, "A2", ws );
		ok( oParser.parse(), formulaStr );
		strictEqual( oParser.calculate().getValue(), 0, formulaStr );

		formulaStr = 'NETWORKDAYS.INTL(DATE(2006,1,1),DATE(2006,2,1),"0010001",{"1/2/2006","1/16/2006"})';
		oParser = new parserFormula( formulaStr, "A2", ws );
		ok( oParser.parse(), formulaStr );
		strictEqual( oParser.calculate().getValue(), 20, formulaStr );

		formulaStr = 'NETWORKDAYS.INTL(DATE(2006,1,1),DATE(2006,2,1),"0000000",{"1/2/2006","1/16/2006"})';
		oParser = new parserFormula( formulaStr, "A2", ws );
		ok( oParser.parse(), formulaStr );
		strictEqual( oParser.calculate().getValue(), 30, formulaStr );

		formulaStr = 'NETWORKDAYS.INTL(DATE(2006,1,1),DATE(2006,2,1),"19",{"1/2/2006","1/16/2006"})';
		oParser = new parserFormula( formulaStr, "A2", ws );
		ok( oParser.parse(), formulaStr );
		strictEqual( oParser.calculate().getValue(), "#VALUE!", formulaStr );

		formulaStr = 'NETWORKDAYS.INTL(DATE(2006,1,1),DATE(2006,2,1),19,{"1/2/2006","1/16/2006"})';
		oParser = new parserFormula( formulaStr, "A2", ws );
		ok( oParser.parse(), formulaStr );
		strictEqual( oParser.calculate().getValue(), "#NUM!", formulaStr );

	} );

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

		oParser = new parserFormula( "SUMIF(A2,\">160000\",B2:B5)", "A7", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 0 );

		oParser = new parserFormula( "SUMIF(A3,\">160000\",B2:B5)", "A7", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 7000 );

		oParser = new parserFormula( "SUMIF(A4,\">160000\",B4:B5)", "A7", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 21000 );

		oParser = new parserFormula( "SUMIF(A4,\">160000\")", "A7", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 300000);


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

    } );

    test( "Test: \"SUMIFS\"", function () {

        ws.getRange2( "A2" ).setValue( "5" );
        ws.getRange2( "A3" ).setValue( "4" );
        ws.getRange2( "A4" ).setValue( "15" );
        ws.getRange2( "A5" ).setValue( "3" );
        ws.getRange2( "A6" ).setValue( "22" );
        ws.getRange2( "A7" ).setValue( "12" );
        ws.getRange2( "A8" ).setValue( "10" );
        ws.getRange2( "A9" ).setValue( "33" );

        ws.getRange2( "B2" ).setValue( "Apples" );
        ws.getRange2( "B3" ).setValue( "Apples" );
        ws.getRange2( "B4" ).setValue( "Artichokes" );
        ws.getRange2( "B5" ).setValue( "Artichokes" );
        ws.getRange2( "B6" ).setValue( "Bananas" );
        ws.getRange2( "B7" ).setValue( "Bananas" );
        ws.getRange2( "B8" ).setValue( "Carrots" );
        ws.getRange2( "B9" ).setValue( "Carrots" );

        ws.getRange2( "C2" ).setValue( "Tom" );
        ws.getRange2( "C3" ).setValue( "Sarah" );
        ws.getRange2( "C4" ).setValue( "Tom" );
        ws.getRange2( "C5" ).setValue( "Sarah" );
        ws.getRange2( "C6" ).setValue( "Tom" );
        ws.getRange2( "C7" ).setValue( "Sarah" );
        ws.getRange2( "C8" ).setValue( "Tom" );
        ws.getRange2( "C9" ).setValue( "Sarah" );

        oParser = new parserFormula( "SUMIFS(A2:A9, B2:B9, \"=A*\", C2:C9, \"Tom\")", "A10", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 20 );

        oParser = new parserFormula( "SUMIFS(A2:A9, B2:B9, \"<>Bananas\", C2:C9, \"Tom\")", "A11", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 30 );

    } );

	test( "Test: \"MAXIFS\"", function () {

		ws.getRange2( "AAA2" ).setValue( "10" );
		ws.getRange2( "AAA3" ).setValue( "1" );
		ws.getRange2( "AAA4" ).setValue( "100" );
		ws.getRange2( "AAA5" ).setValue( "1" );
		ws.getRange2( "AAA6" ).setValue( "1" );
		ws.getRange2( "AAA7" ).setValue( "50" );

		ws.getRange2( "BBB2" ).setValue( "b" );
		ws.getRange2( "BBB3" ).setValue( "a" );
		ws.getRange2( "BBB4" ).setValue( "a" );
		ws.getRange2( "BBB5" ).setValue( "b" );
		ws.getRange2( "BBB6" ).setValue( "a" );
		ws.getRange2( "BBB7" ).setValue( "b" );

		ws.getRange2( "DDD2" ).setValue( "100" );
		ws.getRange2( "DDD3" ).setValue( "100" );
		ws.getRange2( "DDD4" ).setValue( "200" );
		ws.getRange2( "DDD5" ).setValue( "300" );
		ws.getRange2( "DDD6" ).setValue( "100" );
		ws.getRange2( "DDD7" ).setValue( "400" );

		oParser = new parserFormula( 'MAXIFS(AAA2:AAA7,BBB2:BBB7,"b",DDD2:DDD7,">100")', "A22", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 50 );

		oParser = new parserFormula( 'MAXIFS(AAA2:AAA6,BBB2:BBB6,"a",DDD2:DDD6,">200")', "A22", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 0 );
	} );

	test( "Test: \"MINIFS\"", function () {

		ws.getRange2( "AAA2" ).setValue( "10" );
		ws.getRange2( "AAA3" ).setValue( "1" );
		ws.getRange2( "AAA4" ).setValue( "100" );
		ws.getRange2( "AAA5" ).setValue( "1" );
		ws.getRange2( "AAA6" ).setValue( "1" );
		ws.getRange2( "AAA7" ).setValue( "50" );

		ws.getRange2( "BBB2" ).setValue( "b" );
		ws.getRange2( "BBB3" ).setValue( "a" );
		ws.getRange2( "BBB4" ).setValue( "a" );
		ws.getRange2( "BBB5" ).setValue( "b" );
		ws.getRange2( "BBB6" ).setValue( "a" );
		ws.getRange2( "BBB7" ).setValue( "b" );

		ws.getRange2( "DDD2" ).setValue( "100" );
		ws.getRange2( "DDD3" ).setValue( "100" );
		ws.getRange2( "DDD4" ).setValue( "200" );
		ws.getRange2( "DDD5" ).setValue( "300" );
		ws.getRange2( "DDD6" ).setValue( "100" );
		ws.getRange2( "DDD7" ).setValue( "400" );

		oParser = new parserFormula( 'MINIFS(AAA2:AAA7,BBB2:BBB7,"b",DDD2:DDD7,">100")', "A22", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 1 );

		oParser = new parserFormula( 'MINIFS(AAA2:AAA6,BBB2:BBB6,"a",DDD2:DDD6,">200")', "A22", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 0 );
	} );

    test( "Test: \"TEXT\"", function () {

        oParser = new parserFormula( "TEXT(1234.567,\"$0.00\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "$1234.57" );

        oParser = new parserFormula( "TEXT(0.125,\"0.0%\")", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "12.5%" );

    } );

	test( "Test: \"TEXTJOIN\"", function () {

		ws.getRange2( "A2" ).setValue( "Tulsa" );
		ws.getRange2( "A3" ).setValue( "Seattle" );
		ws.getRange2( "A4" ).setValue( "Iselin" );
		ws.getRange2( "A5" ).setValue( "Fort Lauderdale" );
		ws.getRange2( "A6" ).setValue( "Tempe" );
		ws.getRange2( "A7" ).setValue( "end" );

		ws.getRange2( "B2" ).setValue( "OK" );
		ws.getRange2( "B3" ).setValue( "WA" );
		ws.getRange2( "B4" ).setValue( "NJ" );
		ws.getRange2( "B5" ).setValue( "FL" );
		ws.getRange2( "B6" ).setValue( "AZ" );
		ws.getRange2( "B7" ).setValue( "" );

		ws.getRange2( "C2" ).setValue( "74133" );
		ws.getRange2( "C3" ).setValue( "98109" );
		ws.getRange2( "C4" ).setValue( "8830" );
		ws.getRange2( "C5" ).setValue( "33309" );
		ws.getRange2( "C6" ).setValue( "85285" );
		ws.getRange2( "C7" ).setValue( "" );

		ws.getRange2( "D2" ).setValue( "US" );
		ws.getRange2( "D3" ).setValue( "US" );
		ws.getRange2( "D4" ).setValue( "US" );
		ws.getRange2( "D5" ).setValue( "US" );
		ws.getRange2( "D6" ).setValue( "US" );
		ws.getRange2( "D7" ).setValue( "" );

		ws.getRange2( "A9" ).setValue( "," );
		ws.getRange2( "B9" ).setValue( "," );
		ws.getRange2( "C9" ).setValue( "," );
		ws.getRange2( "D9" ).setValue( ";" );


		oParser = new parserFormula( "TEXTJOIN(A9:D9, TRUE, A2:D7)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "Tulsa,OK,74133,US;Seattle,WA,98109,US;Iselin,NJ,8830,US;Fort Lauderdale,FL,33309,US;Tempe,AZ,85285,US;end" );

		oParser = new parserFormula( "TEXTJOIN(A9:D9, FALSE, A2:D7)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "Tulsa,OK,74133,US;Seattle,WA,98109,US;Iselin,NJ,8830,US;Fort Lauderdale,FL,33309,US;Tempe,AZ,85285,US;end,,," );

		oParser = new parserFormula( "TEXTJOIN(A2:D5, 1, B6:D6)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "AZTulsa85285OKUS" );
	} );


	test("Test: \"WORKDAY\"", function () {

		oParser = new parserFormula("WORKDAY(DATE(2006,1,1),0)", "A2", ws);
		ok(oParser.parse());
		strictEqual(oParser.calculate().getValue(), 38718);

		oParser = new parserFormula("WORKDAY(DATE(2006,1,1),10)", "A2", ws);
		ok(oParser.parse());
		strictEqual(oParser.calculate().getValue(), 38730);

		oParser = new parserFormula("WORKDAY(DATE(2006,1,1),-10)", "A2", ws);
		ok(oParser.parse());
		strictEqual(oParser.calculate().getValue(), 38705);

		oParser = new parserFormula("WORKDAY(DATE(2006,1,1),20,{\"1-2-2006\",\"1-16-2006\"})", "A2", ws);
		ok(oParser.parse());
		strictEqual(oParser.calculate().getValue(), 38748);

		oParser = new parserFormula("WORKDAY(DATE(2017,10,6),1,DATE(2017,10,9))", "A2", ws);
		ok(oParser.parse());
		strictEqual(oParser.calculate().getValue(), 43018);

		oParser = new parserFormula("WORKDAY(DATE(2017,10,7),1,DATE(2017,10,9))", "A2", ws);
		ok(oParser.parse());
		strictEqual(oParser.calculate().getValue(), 43018);

		oParser = new parserFormula("WORKDAY(DATE(2017,9,25),-1,DATE(2017,9,10))", "A2", ws);
		ok(oParser.parse());
		strictEqual(oParser.calculate().getValue(), 43000);

		oParser = new parserFormula("WORKDAY(DATE(2017,9,25),-1,DATE(2017,9,10))", "A2", ws);
		ok(oParser.parse());
		strictEqual(oParser.calculate().getValue(), 43000);

		oParser = new parserFormula("WORKDAY(DATE(2017,9,20),-1,DATE(2017,9,10))", "A2", ws);
		ok(oParser.parse());
		strictEqual(oParser.calculate().getValue(), 42997);

		oParser = new parserFormula("WORKDAY(DATE(2017,10,2),-1)", "A2", ws);
		ok(oParser.parse());
		strictEqual(oParser.calculate().getValue(), 43007);

		oParser = new parserFormula("WORKDAY(DATE(2017,10,2),-1)", "A2", ws);
		ok(oParser.parse());
		strictEqual(oParser.calculate().getValue(), 43007);

		oParser = new parserFormula("WORKDAY(DATE(2017,10,3),-3)", "A2", ws);
		ok(oParser.parse());
		strictEqual(oParser.calculate().getValue(), 43006);

		oParser = new parserFormula("WORKDAY(DATE(2017,10,4),-2)", "A2", ws);
		ok(oParser.parse());
		strictEqual(oParser.calculate().getValue(), 43010);

	});

	test( "Test: \"WORKDAY.INTL\"", function () {

		oParser = new parserFormula( "WORKDAY.INTL(DATE(2012,1,1),30,0)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#NUM!" );

		oParser = new parserFormula( "WORKDAY.INTL(DATE(2012,1,1),90,11)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 41013 );

		oParser = new parserFormula( 'TEXT(WORKDAY.INTL(DATE(2012,1,1),30,17),"m/dd/yyyy")', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "2/05/2012" );

		oParser = new parserFormula( 'WORKDAY.INTL(151,8,"0000000")', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 159 );

		oParser = new parserFormula( 'WORKDAY.INTL(151,8,"0000000")', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 159 );

		oParser = new parserFormula( 'WORKDAY.INTL(159,8,"0011100")', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 171 );

		oParser = new parserFormula( 'WORKDAY.INTL(151,-18,"0000000")', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 133 );

		oParser = new parserFormula( 'WORKDAY.INTL(151,8,"1111111")', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#VALUE!" );

		oParser = new parserFormula( 'WORKDAY.INTL(DATE(2006,1,1),20,1,{"1/2/2006","1/16/2006"})', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 38748 );

		oParser = new parserFormula( 'WORKDAY.INTL(DATE(2006,1,1),20,{"1/2/2006","1/16/2006"})', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#NUM!" );

		oParser = new parserFormula( 'WORKDAY.INTL(DATE(2006,1,1),-20,1,{"1/2/2006",,"1/16/2006"})', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 38691 );

	} );

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
    } );

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

    } );

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

    } );

	test( "Test: \"ISOWEEKNUM\"", function () {

		ws.getRange2( "A2" ).setValue( "3/9/2012" );

	    oParser = new parserFormula( "ISOWEEKNUM(A2)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 10 );

		oParser = new parserFormula( "ISOWEEKNUM(123)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 18 );

		oParser = new parserFormula( "ISOWEEKNUM(120003)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 30 );

		oParser = new parserFormula( "ISOWEEKNUM(120003)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 30 );

		oParser = new parserFormula( "ISOWEEKNUM(-100)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#NUM!" );

		oParser = new parserFormula( "ISOWEEKNUM(1203)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 16 );

	} );

	test( "Test: \"WEIBULL\"", function () {

		ws.getRange2( "A2" ).setValue( "105" );
		ws.getRange2( "A3" ).setValue( "20" );
		ws.getRange2( "A4" ).setValue( "100" );

		oParser = new parserFormula( "WEIBULL(A2,A3,A4,TRUE)", "A20", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(6) - 0, 0.929581 );

		oParser = new parserFormula( "WEIBULL(A2,A3,A4,FALSE)", "A20", ws );
		ok( oParser.parse(), "WEIBULL(A2,A3,A4,FALSE)" );
		strictEqual( oParser.calculate().getValue().toFixed(6) - 0, 0.035589 );
	} );

	test( "Test: \"WEIBULL.DIST\"", function () {

		ws.getRange2( "A2" ).setValue( "105" );
		ws.getRange2( "A3" ).setValue( "20" );
		ws.getRange2( "A4" ).setValue( "100" );

		oParser = new parserFormula( "WEIBULL.DIST(A2,A3,A4,TRUE)", "A20", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(6) - 0, 0.929581 );

		oParser = new parserFormula( "WEIBULL.DIST(A2,A3,A4,FALSE)", "A20", ws );
		ok( oParser.parse(), "WEIBULL.DIST(A2,A3,A4,FALSE)" );
		strictEqual( oParser.calculate().getValue().toFixed(6) - 0, 0.035589 );
	} );

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
    } );

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
    } );

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

		oParser = new parserFormula( "SUMPRODUCT(N44:N47*O44:O47)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 70 );

		oParser = new parserFormula( "SUMPRODUCT(SUM(N44:N47*O44:O47))", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 70 );

		oParser = new parserFormula( "SUM(SUMPRODUCT(N44:N47*O44:O47))", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 70 );

		oParser = new parserFormula( "SUMPRODUCT(N44:O47*P44:P47)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 388 );

		oParser = new parserFormula( "SUM(SUMPRODUCT(N44:O47*P44:P47))", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 388 );

		oParser = new parserFormula( "SUM(SUMPRODUCT(N44:O47))", "A2", ws );
		ok( oParser.parse() );
		ok( oParser.assemble() == "SUM(SUMPRODUCT(N44:O47))" );
		strictEqual( oParser.calculate().getValue(), 36 );
    } );

    test( "Test: \"SINH\"", function () {

        oParser = new parserFormula( "SINH(0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 0 );

        oParser = new parserFormula( "SINH(1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), ((Math.E - 1 / Math.E) / 2) );
    } );

    test( "Test: \"COSH\"", function () {

        oParser = new parserFormula( "COSH(0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "COSH(1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), ((Math.E + 1 / Math.E) / 2) );
    } );

	test( "Test: \"IMCOSH\"", function () {
		oParser = new parserFormula( 'IMCOSH("4+3i")', "A2", ws );
		ok( oParser.parse(), 'IMCOSH("4+3i")' );
		strictEqual( oParser.calculate().getValue(), "-27.03494560307422+3.8511533348117766i", 'IMCOSH("4+3i")' );
	} );

	test( "Test: \"IMCOS\"", function () {
		oParser = new parserFormula( 'IMCOS("1+i")', "A2", ws );
		ok( oParser.parse(), 'IMCOS("1+i")' );
		strictEqual( oParser.calculate().getValue(), "0.8337300251311491-0.9888977057628651i", 'IMCOS("1+i")' );
	} );

	test( "Test: \"IMCOT\"", function () {
		oParser = new parserFormula( 'IMCOT("4+3i")', "A2", ws );
		ok( oParser.parse(), 'IMCOT("4+3i")' );
		strictEqual( oParser.calculate().getValue(), "0.004901182394304475-0.9992669278059015i", 'IMCOT("4+3i")' );
	} );

	test( "Test: \"IMCSC\"", function () {
		oParser = new parserFormula( 'IMCSC("4+3i")', "A2", ws );
		ok( oParser.parse(), 'IMCSC("4+3i")' );
		strictEqual( oParser.calculate().getValue(), "-0.0754898329158637+0.06487747137063551i", 'IMCSC("4+3i")' );
	} );

	test( "Test: \"IMCSCH\"", function () {
		oParser = new parserFormula( 'IMCSCH("4+3i")', "A2", ws );
		ok( oParser.parse(), 'IMCSCH("4+3i")' );
		strictEqual( oParser.calculate().getValue(), "-0.03627588962862601-0.0051744731840193976i", 'IMCSCH("4+3i")' );
	} );

	test( "Test: \"IMSINH\"", function () {
		oParser = new parserFormula( 'IMSINH("4+3i")', "A2", ws );
		ok( oParser.parse(), 'IMSINH("4+3i")' );
		strictEqual( oParser.calculate().getValue(), "-27.01681325800393+3.8537380379193764i", 'IMSINH("4+3i")' );
	} );

	test( "Test: \"IMSEC\"", function () {
		oParser = new parserFormula( 'IMSEC("4+3i")', "A2", ws );
		ok( oParser.parse(), 'IMSEC("4+3i")' );
		strictEqual( oParser.calculate().getValue(), "-0.06529402785794705-0.07522496030277323i", 'IMSEC("4+3i")' );
	} );

	test( "Test: \"IMSECH\"", function () {
		oParser = new parserFormula( 'IMSECH("4+3i")', "A2", ws );
		ok( oParser.parse(), 'IMSECH("4+3i")' );
		strictEqual( oParser.calculate().getValue(), "-0.03625349691586888-0.00516434460775318i", 'IMSECH("4+3i")' );
	} );

	test( "Test: \"IMTAN\"", function () {
		oParser = new parserFormula( 'IMTAN("4+3i")', "A2", ws );
		ok( oParser.parse(), 'IMTAN("4+3i")' );
		strictEqual( oParser.calculate().getValue(), "0.004908258067496062+1.000709536067233i", 'IMTAN("4+3i")' );
	} );

    test( "Test: \"TANH\"", function () {

        oParser = new parserFormula( "TANH(0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 0 );

        oParser = new parserFormula( "TANH(1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), ((Math.E * Math.E - 1) / (Math.E * Math.E + 1)) ), true );
    } );

	test( "Test: \"XOR\"", function () {
		oParser = new parserFormula( 'XOR(3>0,2<9)', "A2", ws );
		ok( oParser.parse(), 'XOR(3>0,2<9)' );
		strictEqual( oParser.calculate().getValue(), "FALSE", 'XOR(3>0,2<9)' );

		oParser = new parserFormula( 'XOR(3>12,4>6)', "A2", ws );
		ok( oParser.parse(), 'XOR(3>12,4>6)' );
		strictEqual( oParser.calculate().getValue(), "FALSE", 'XOR(3>12,4>6)' );

		oParser = new parserFormula( 'XOR(3>12,4<6)', "A2", ws );
		ok( oParser.parse(), 'XOR(3>12,4<6)' );
		strictEqual( oParser.calculate().getValue(), "TRUE", 'XOR(3>12,4<6)' );
	} );

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
    } );

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
    } );

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
    } );

    test( "Test: \"RANDBETWEEN\"", function () {
        var res;
        oParser = new parserFormula( "RANDBETWEEN(1,6)", "A1", ws );
        ok( oParser.parse() );
        res = oParser.calculate().getValue();
        ok( res >= 1 && res <= 6 );

        oParser = new parserFormula( "RANDBETWEEN(-10,10)", "A1", ws );
        ok( oParser.parse() );
        res = oParser.calculate().getValue();
        ok( res >= -10 && res <= 10 );

        oParser = new parserFormula( "RANDBETWEEN(-25,-3)", "A1", ws );
        ok( oParser.parse() );
        res = oParser.calculate().getValue();
        ok( res >= -25 && res <= -3 );
    } );

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
    } );

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

    } );

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

    } );

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

    } );

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

    } );

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

    } );

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

    } );

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

    } );

    test( "Test: \"SERIESSUM\"", function () {


		ws.getRange2( "A2" ).setValue( "1" );
		ws.getRange2( "A3" ).setValue( numDivFact(-1, 2) );
		ws.getRange2( "A4" ).setValue( numDivFact(1, 4) );
		ws.getRange2( "A5" ).setValue( numDivFact(-1, 6) );

        oParser = new parserFormula( "SERIESSUM(PI()/4,0,2,A2:A5)", "A7", ws );
        ok( oParser.parse() );
        ok( Math.abs( oParser.calculate().getValue() - (1 - 1 / 2 * Math.pow( Math.PI / 4, 2 ) + 1 / Math.fact( 4 ) * Math.pow( Math.PI / 4, 4 ) - 1 / Math.fact( 6 ) * Math.pow( Math.PI / 4, 6 )) ) < dif );

		ws.getRange2( "B2" ).setValue( "1" );
		ws.getRange2( "B3" ).setValue( numDivFact(-1, 3) );
		ws.getRange2( "B4" ).setValue( numDivFact(1, 5) );
		ws.getRange2( "B5" ).setValue( numDivFact(-1, 7) );

        oParser = new parserFormula( "SERIESSUM(PI()/4,1,2,B2:B5)", "B7", ws );
        ok( oParser.parse() );
        ok( Math.abs( oParser.calculate().getValue() - (Math.PI / 4 - 1 / Math.fact( 3 ) * Math.pow( Math.PI / 4, 3 ) + 1 / Math.fact( 5 ) * Math.pow( Math.PI / 4, 5 ) - 1 / Math.fact( 7 ) * Math.pow( Math.PI / 4, 7 )) ) < dif );

    } );

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

    } );


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

    } );

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

    } );

    test( "Test: \"AVERAGEA\"", function () {

        ws.getRange2( "E2" ).setValue( "TRUE" );
        ws.getRange2( "E3" ).setValue( "FALSE" );

		ws.getRange2( "F2" ).setValue( "10" );
		ws.getRange2( "F3" ).setValue( "7" );
		ws.getRange2( "F4" ).setValue( "9" );
		ws.getRange2( "F5" ).setValue( "2" );
		ws.getRange2( "F6" ).setValue( "Not available" );
		ws.getRange2( "F7" ).setValue( "" );

        oParser = new parserFormula( "AVERAGEA(10,E1)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 10 );

        oParser = new parserFormula( "AVERAGEA(10,E2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 5.5 );

        oParser = new parserFormula( "AVERAGEA(10,E3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 5 );

		oParser = new parserFormula( "AVERAGEA(F2:F6)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 5.6 );

		oParser = new parserFormula( "AVERAGEA(F2:F5,F7)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 7 );

    } );

    test( "Test: \"AVERAGEIF\"", function () {

        ws.getRange2( "E2" ).setValue( "10" );
        ws.getRange2( "E3" ).setValue( "20" );
        ws.getRange2( "E4" ).setValue( "28" );
        ws.getRange2( "E5" ).setValue( "30" );

        oParser = new parserFormula( "AVERAGEIF(E2:E5,\">15\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 26 );

    } );

	test( "Test: \"AVERAGEIFS\"", function () {

		ws.getRange2( "E2" ).setValue( "Quiz" );
		ws.getRange2( "E3" ).setValue( "Grade" );
		ws.getRange2( "E4" ).setValue( "75" );
		ws.getRange2( "E5" ).setValue( "94" );

		ws.getRange2( "F2" ).setValue( "Quiz" );
		ws.getRange2( "F3" ).setValue( "Grade" );
		ws.getRange2( "F4" ).setValue( "85" );
		ws.getRange2( "F5" ).setValue( "80" );

		ws.getRange2( "G2" ).setValue( "Exam" );
		ws.getRange2( "G3" ).setValue( "Grade" );
		ws.getRange2( "G4" ).setValue( "87" );
		ws.getRange2( "G5" ).setValue( "88" );

		oParser = new parserFormula( "AVERAGEIFS(E2:E5,E2:E5,\">70\",E2:E5,\"<90\")", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 75 );

		oParser = new parserFormula( "AVERAGEIFS(F2:F5,F2:F5,\">95\")", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#DIV/0!" );

		oParser = new parserFormula( "AVERAGEIFS(G2:G5,G2:G5,\"<>Incomplete\",G2:G5,\">80\")", "A3", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 87.5 );

	} );

	test( "Test: \"AGGREGATE\"", function () {

		ws.getRange2( "A101" ).setValue( "TEST" );
		ws.getRange2( "A102" ).setValue( "72" );
		ws.getRange2( "A103" ).setValue( "30" );
		ws.getRange2( "A104" ).setValue( "TEST2" );
		ws.getRange2( "A105" ).setValue( "31" );
		ws.getRange2( "A106" ).setValue( "96" );
		ws.getRange2( "A107" ).setValue( "32" );
		ws.getRange2( "A108" ).setValue( "81" );
		ws.getRange2( "A109" ).setValue( "33" );
		ws.getRange2( "A110" ).setValue( "53" );
		ws.getRange2( "A111" ).setValue( "34" );

		ws.getRange2( "B101" ).setValue( "82" );
		ws.getRange2( "B102" ).setValue( "65" );
		ws.getRange2( "B103" ).setValue( "95" );
		ws.getRange2( "B104" ).setValue( "63" );
		ws.getRange2( "B105" ).setValue( "53" );
		ws.getRange2( "B106" ).setValue( "71" );
		ws.getRange2( "B107" ).setValue( "55" );
		ws.getRange2( "B108" ).setValue( "83" );
		ws.getRange2( "B109" ).setValue( "100" );
		ws.getRange2( "B110" ).setValue( "91" );
		ws.getRange2( "B111" ).setValue( "89" );


		oParser = new parserFormula( "AGGREGATE(4, 6, A101:A111)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 96 );

		oParser = new parserFormula( "AGGREGATE(14, 6, A101:A111, 3)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 72 );

		oParser = new parserFormula( "AGGREGATE(15, 6, A101:A111)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#VALUE!" );

		oParser = new parserFormula( "AGGREGATE(12, 6, A101:A111, B101:B111)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 68 );

		oParser = new parserFormula( "AGGREGATE(12, 6, A101:A111, B101:B111)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 68 );

		oParser = new parserFormula( "AGGREGATE(1,1,A101:B105)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 61.375);

		oParser = new parserFormula( "AGGREGATE(2,1,A101:B105)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 8);

		oParser = new parserFormula( "AGGREGATE(3,1,A101:B105)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 10);

		oParser = new parserFormula( "AGGREGATE(4,1,A101:B105)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 95);

		oParser = new parserFormula( "AGGREGATE(5,3,A101:B105)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 30);

		oParser = new parserFormula( "AGGREGATE(6,1,100)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#VALUE!");

		oParser = new parserFormula( "AGGREGATE(7,3,A101:B105)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(8) - 0, 22.87192602);

		oParser = new parserFormula( "AGGREGATE(8,3,A101:B105)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(8) - 0, 21.39472774);

		oParser = new parserFormula( "AGGREGATE(9,3,A101:B105)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 491);

		oParser = new parserFormula( "AGGREGATE(10,3,A101:B105)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 523.125);

		oParser = new parserFormula( "AGGREGATE(11,3,A101:B105)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 457.734375);

		oParser = new parserFormula( "AGGREGATE(12,3,A101:B105)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 64);

		oParser = new parserFormula( "AGGREGATE(13,3,A101:B105,A101:B105)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 30);

		oParser = new parserFormula( "AGGREGATE(14,3,A101:B105,2)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 82);

		oParser = new parserFormula( "AGGREGATE(15,3,A101:B105,2)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 31);

		oParser = new parserFormula( "AGGREGATE(16,3,A101:B105,1)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 95);

		oParser = new parserFormula( "AGGREGATE(17,3,A101:B105,3)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 74.5);

		oParser = new parserFormula( "AGGREGATE(18,3,A101:B105,0.2)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 30.8);

		oParser = new parserFormula( "AGGREGATE(19,3,A101:B105,2)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 64);

	} );

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

    } );

	test( "Test: \"BINOM.DIST\"", function () {

		ws.getRange2( "A2" ).setValue( "6" );
		ws.getRange2( "A3" ).setValue( "10" );
		ws.getRange2( "A4" ).setValue( "0.5" );

	    oParser = new parserFormula( "BINOM.DIST(A2,A3,A4,FALSE)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed( 7 ) - 0, 0.2050781);
	} );

	test( "Test: \"BINOM.DIST.RANGE\"", function () {

		oParser = new parserFormula( "BINOM.DIST.RANGE(60,0.75,48)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed( 3 ) - 0, 0.084);

		oParser = new parserFormula( "BINOM.DIST.RANGE(60,0.75,45,50)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed( 3 ) - 0, 0.524);

	} );

    test( "Test: \"CONFIDENCE\"", function () {

        oParser = new parserFormula( "CONFIDENCE(0.4,5,12)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 1.214775614397568 ), true );

        oParser = new parserFormula( "CONFIDENCE(0.75,9,7)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 1.083909233527114 ), true );

    } );

	test( "Test: \"CONFIDENCE.NORM\"", function () {

		ws.getRange2( "A2" ).setValue( "0.05" );
		ws.getRange2( "A3" ).setValue( "2.5" );
		ws.getRange2( "A4" ).setValue( "50" );

		oParser = new parserFormula( "CONFIDENCE.NORM(A2,A3,A4)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed( 6 ) - 0, 0.692952);
	} );

	test( "Test: \"CONFIDENCE.T\"", function () {

		oParser = new parserFormula( "CONFIDENCE.T(0.05,1,50)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed( 9 ) - 0, 0.284196855);
	} );

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

    } );

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

		ws.getRange2( "S5" ).setValue( "#DIV/0!" );
		ws.getRange2( "S6" ).setValue( "TRUE" );
		ws.getRange2( "S7" ).setValue( "qwe" );
		ws.getRange2( "S8" ).setValue( "" );
		ws.getRange2( "S9" ).setValue( "2" );
		oParser = new parserFormula( "COUNT(S5)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 0 );
		oParser = new parserFormula( "COUNT(S6)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 0 );
		oParser = new parserFormula( "COUNT(S7)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 0 );
		oParser = new parserFormula( "COUNT(S8)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 0 );
		oParser = new parserFormula( "COUNT(S5:S9)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 1 );
		oParser = new parserFormula( "COUNT(S6:S9)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 1 );
    } );

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

		ws.getRange2( "S5" ).setValue( "#DIV/0!" );
		ws.getRange2( "S6" ).setValue( "TRUE" );
		ws.getRange2( "S7" ).setValue( "qwe" );
		ws.getRange2( "S8" ).setValue( "" );
		ws.getRange2( "S9" ).setValue( "2" );
		oParser = new parserFormula( "COUNTA(S5)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 1 );
		oParser = new parserFormula( "COUNTA(S6)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 1 );
		oParser = new parserFormula( "COUNTA(S7)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 1 );
		oParser = new parserFormula( "COUNTA(S8)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 0 );
		oParser = new parserFormula( "COUNTA(S5:S9)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 4 );
		oParser = new parserFormula( "COUNTA(S6:S9)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 3 );
    } );

    test( "Test: \"COUNTIFS\"", function () {

        ws.getRange2( "A15" ).setValue( "Yes" );
        ws.getRange2( "A16" ).setValue( "Yes" );
        ws.getRange2( "A17" ).setValue( "Yes" );
        ws.getRange2( "A18" ).setValue( "No" );

        ws.getRange2( "B15" ).setValue( "No" );
        ws.getRange2( "B16" ).setValue( "Yes" );
        ws.getRange2( "B17" ).setValue( "Yes" );
        ws.getRange2( "B18" ).setValue( "Yes" );

		ws.getRange2( "C15" ).setValue( "No" );
		ws.getRange2( "C16" ).setValue( "No" );
		ws.getRange2( "C17" ).setValue( "Yes" );
		ws.getRange2( "C18" ).setValue( "Yes" );

        oParser = new parserFormula( "COUNTIFS(A15:C15,\"=Yes\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

        oParser = new parserFormula( "COUNTIFS(A15:A18,\"=Yes\",B15:B18,\"=Yes\")", "B1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 2 );

		oParser = new parserFormula( "COUNTIFS(A18:C18,\"=Yes\",A16:C16,\"=Yes\")", "C1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1 );

		ws.getRange2( "D15" ).setValue( "1" );
		ws.getRange2( "D16" ).setValue( "2" );
		ws.getRange2( "D17" ).setValue( "3" );
		ws.getRange2( "D18" ).setValue( "4" );
		ws.getRange2( "D19" ).setValue( "5" );
		ws.getRange2( "D20" ).setValue( "6" );

		ws.getRange2( "E15" ).setValue( "5/1/2011" );
		ws.getRange2( "E16" ).setValue( "5/2/2011" );
		ws.getRange2( "E17" ).setValue( "5/3/2011" );
		ws.getRange2( "E18" ).setValue( "5/4/2011" );
		ws.getRange2( "E19" ).setValue( "5/5/2011" );
		ws.getRange2( "E20" ).setValue( "5/6/2011" );

		oParser = new parserFormula( "COUNTIFS(D15:D20,\"<6\",D15:D20,\">1\")", "D1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 4 );

		oParser = new parserFormula( "COUNTIFS(D15:D20,\"<5\",E15:E20,\"<5/3/2011\")", "E1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 2 );

		oParser = new parserFormula( "COUNTIFS(D15:D20,\"<\" & D19,E15:E20,\"<\" & E17)", "E1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 2 );

    } );

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


		wb.dependencyFormulas.unlockRecal();

		ws.getRange2( "CC1" ).setValue( "1" );
		ws.getRange2( "CC2" ).setValue( "0" );
		ws.getRange2( "CC3" ).setValue( "1" );
		ws.getRange2( "CC4" ).setValue( "true" );
		ws.getRange2( "CC5" ).setValue( "=true" );
		ws.getRange2( "CC6" ).setValue( "=true()" );
		ws.getRange2( "CC7" ).setValue( "'true'" );

		oParser = new parserFormula( "COUNTIF(CC1:CC7, TRUE())", "C2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 3 );

		oParser = new parserFormula( "COUNTIF(CC1:CC7, TRUE)", "C2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 3 );

		oParser = new parserFormula( "COUNTIF(CC1:CC7, 1)", "C2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 2 );

		oParser = new parserFormula( "COUNTIF(CC1:CC7, 0)", "C2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 1 );

		ws.getRange2( "CC8" ).setValue( ">3" );
		oParser = new parserFormula( "COUNTIF(CC8,\">3\")", "C2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 0 );

		ws.getRange2( "CC8" ).setValue( ">3" );
		oParser = new parserFormula( "COUNTIF(CC8,\"=>3\")", "C2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 1 );

		ws.getRange2( "CC9" ).setValue( "=NA()" );
		ws.getRange2( "CC10" ).setValue( "#N/A" );

		oParser = new parserFormula( "COUNTIF(CC9:CC10,\"#N/A\")", "C2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 2 );

		oParser = new parserFormula( "COUNTIF(CC9:CC10, NA())", "C2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 2 );

		oParser = new parserFormula( "COUNTIF(CC9:CC10,\"=NA()\")", "C2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 0 );

		oParser = new parserFormula( "COUNTIF(#REF!, 1)", "C2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#REF!" );

		wb.dependencyFormulas.lockRecal();
	} );

    test( "Test: \"COVAR\"", function () {

        oParser = new parserFormula( "COVAR({2.532,5.621;2.1,3.4},{5.32,2.765;5.2,6.7})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), -1.3753740625 ), true );

        oParser = new parserFormula( "COVAR({1,2},{4,5})", "B1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 0.25 ), true );

    } );
    
	test( "Test: \"COVARIANCE.P\"", function () {

		ws.getRange2( "AA1" ).setValue( "3" );
		ws.getRange2( "AA2" ).setValue( "2" );
		ws.getRange2( "AA4" ).setValue( "4" );
		ws.getRange2( "AA5" ).setValue( "5" );
		ws.getRange2( "AA6" ).setValue( "6" );

		ws.getRange2( "BB1" ).setValue( "9" );
		ws.getRange2( "BB2" ).setValue( "7" );
		ws.getRange2( "BB4" ).setValue( "12" );
		ws.getRange2( "BB5" ).setValue( "15" );
		ws.getRange2( "BB6" ).setValue( "17" );


		oParser = new parserFormula( "COVARIANCE.P(AA1:AA6, BB1:BB6)", "A1", ws );
		ok( oParser.parse() );
		strictEqual(oParser.calculate().getValue(), 5.2 );

	} );

	test( "Test: \"COVARIANCE.S\"", function () {

		ws.getRange2( "AAA1" ).setValue( "2" );
		ws.getRange2( "AAA2" ).setValue( "4" );
		ws.getRange2( "AAA3" ).setValue( "8" );

		ws.getRange2( "BBB1" ).setValue( "5" );
		ws.getRange2( "BBB2" ).setValue( "11" );
		ws.getRange2( "BBB3" ).setValue( "12" );

		oParser = new parserFormula( "COVARIANCE.S({2,4,8},{5,11,12})", "A1", ws );
		ok( oParser.parse() );
		strictEqual(oParser.calculate().getValue().toFixed(9) - 0, 9.666666667 );

		oParser = new parserFormula( "COVARIANCE.S(AAA1:AAA3,BBB1:BBB3)", "A1", ws );
		ok( oParser.parse() );
		strictEqual(oParser.calculate().getValue().toFixed(9) - 0, 9.666666667 );

	} );

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

    } );

	test( "Test: \"CONCAT\"", function () {

		ws.getRange2( "AA1" ).setValue( "a1" );
		ws.getRange2( "AA2" ).setValue( "a2" );
		ws.getRange2( "AA4" ).setValue( "a4" );
		ws.getRange2( "AA5" ).setValue( "a5" );
		ws.getRange2( "AA6" ).setValue( "a6" );
		ws.getRange2( "AA7" ).setValue( "a7" );

		ws.getRange2( "BB1" ).setValue( "b1" );
		ws.getRange2( "BB2" ).setValue( "b2" );
		ws.getRange2( "BB4" ).setValue( "b4" );
		ws.getRange2( "BB5" ).setValue( "b5" );
		ws.getRange2( "BB6" ).setValue( "b6" );
		ws.getRange2( "BB7" ).setValue( "b7" );

		oParser = new parserFormula('CONCAT("The"," ","sun"," ","will"," ","come"," ","up"," ","tomorrow.")', "A3", ws);
		ok(oParser.parse(), "CONCAT(AA:AA, BB:BB)");
		strictEqual(oParser.calculate().getValue(), "The sun will come up tomorrow.", "CONCAT(AA:AA, BB:BB)");

	    oParser = new parserFormula("CONCAT(AA:AA, BB:BB)", "A3", ws);
		ok(oParser.parse(), "CONCAT(AA:AA, BB:BB)");
		strictEqual(oParser.calculate().getValue(), "a1a2a4a5a6a7b1b2b4b5b6b7", "CONCAT(AA:AA, BB:BB)");

		oParser = new parserFormula("CONCAT(AA1:BB7)", "A3", ws);
		ok(oParser.parse(), "CONCAT(AA1:BB7)");
		strictEqual(oParser.calculate().getValue(), "a1b1a2b2a4b4a5b5a6b6a7b7", "CONCAT(AA1:BB7)");
	});

    test( "Test: \"DEVSQ\"", function () {
        ws.getRange2( "A1" ).setValue( "5.6" );
        ws.getRange2( "A2" ).setValue( "8.2" );
        ws.getRange2( "A3" ).setValue( "9.2" );

        oParser = new parserFormula( "DEVSQ(5.6,8.2,9.2)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 6.906666666666665 ), true );

        oParser = new parserFormula( "DEVSQ({5.6,8.2,9.2})", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 6.906666666666665 ), true );

        oParser = new parserFormula( "DEVSQ(5.6,8.2,\"9.2\")", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 3.379999999999999 ), true );

        oParser = new parserFormula( "DEVSQ(" + ws.getName() + "!A1:A3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 6.906666666666665 ), true );

    } );

    test( "Test: \"EXPONDIST\"", function () {

        oParser = new parserFormula( "EXPONDIST(0.2,10,FALSE)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 1.353352832366127 ), true );

        oParser = new parserFormula( "EXPONDIST(2.3,1.5,TRUE)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( difBetween( oParser.calculate().getValue(), 0.968254363621932 ), true );

    } );

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

    } );

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

    } );

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

    } );

	function putDataForForecastEts(){
		ws.getRange2( 'A4' ).setValue( '39814' );
		ws.getRange2( 'A5' ).setValue( '39845' );
		ws.getRange2( 'A6' ).setValue( '39873' );
		ws.getRange2( 'A7' ).setValue( '39904' );
		ws.getRange2( 'A8' ).setValue( '39934' );
		ws.getRange2( 'A9' ).setValue( '39965' );
		ws.getRange2( 'A10' ).setValue( '39995' );
		ws.getRange2( 'A11' ).setValue( '40026' );
		ws.getRange2( 'A12' ).setValue( '40057' );
		ws.getRange2( 'A13' ).setValue( '40087' );
		ws.getRange2( 'A14' ).setValue( '40118' );
		ws.getRange2( 'A15' ).setValue( '40148' );
		ws.getRange2( 'A16' ).setValue( '40179' );
		ws.getRange2( 'A17' ).setValue( '40210' );
		ws.getRange2( 'A18' ).setValue( '40238' );
		ws.getRange2( 'A19' ).setValue( '40269' );
		ws.getRange2( 'A20' ).setValue( '40299' );
		ws.getRange2( 'A21' ).setValue( '40330' );
		ws.getRange2( 'A22' ).setValue( '40360' );
		ws.getRange2( 'A23' ).setValue( '40391' );
		ws.getRange2( 'A24' ).setValue( '40422' );
		ws.getRange2( 'A25' ).setValue( '40452' );
		ws.getRange2( 'A26' ).setValue( '40483' );
		ws.getRange2( 'A27' ).setValue( '40513' );
		ws.getRange2( 'A28' ).setValue( '40544' );
		ws.getRange2( 'A29' ).setValue( '40575' );
		ws.getRange2( 'A30' ).setValue( '40603' );
		ws.getRange2( 'A31' ).setValue( '40634' );
		ws.getRange2( 'A32' ).setValue( '40664' );
		ws.getRange2( 'A33' ).setValue( '40695' );
		ws.getRange2( 'A34' ).setValue( '40725' );
		ws.getRange2( 'A35' ).setValue( '40756' );
		ws.getRange2( 'A36' ).setValue( '40787' );
		ws.getRange2( 'A37' ).setValue( '40817' );
		ws.getRange2( 'A38' ).setValue( '40848' );
		ws.getRange2( 'A39' ).setValue( '40878' );
		ws.getRange2( 'A40' ).setValue( '40909' );
		ws.getRange2( 'A41' ).setValue( '40940' );
		ws.getRange2( 'A42' ).setValue( '40969' );
		ws.getRange2( 'A43' ).setValue( '41000' );
		ws.getRange2( 'A44' ).setValue( '41030' );
		ws.getRange2( 'A45' ).setValue( '41061' );
		ws.getRange2( 'A46' ).setValue( '41091' );
		ws.getRange2( 'A47' ).setValue( '41122' );
		ws.getRange2( 'A48' ).setValue( '41153' );
		ws.getRange2( 'A49' ).setValue( '41183' );
		ws.getRange2( 'A50' ).setValue( '41214' );
		ws.getRange2( 'A51' ).setValue( '41244' );
		ws.getRange2( 'A52' ).setValue( '41275' );
		ws.getRange2( 'A53' ).setValue( '41306' );
		ws.getRange2( 'A54' ).setValue( '41334' );
		ws.getRange2( 'A55' ).setValue( '41365' );
		ws.getRange2( 'A56' ).setValue( '41395' );
		ws.getRange2( 'A57' ).setValue( '41426' );
		ws.getRange2( 'A58' ).setValue( '41456' );
		ws.getRange2( 'A59' ).setValue( '41487' );
		ws.getRange2( 'A60' ).setValue( '41518' );

		ws.getRange2( 'B4' ).setValue( '2644539' );
		ws.getRange2( 'B5' ).setValue( '2359800' );
		ws.getRange2( 'B6' ).setValue( '2925918' );
		ws.getRange2( 'B7' ).setValue( '3024973' );
		ws.getRange2( 'B8' ).setValue( '3177100' );
		ws.getRange2( 'B9' ).setValue( '3419595' );
		ws.getRange2( 'B10' ).setValue( '3649702' );
		ws.getRange2( 'B11' ).setValue( '3650668' );
		ws.getRange2( 'B12' ).setValue( '3191526' );
		ws.getRange2( 'B13' ).setValue( '3249428' );
		ws.getRange2( 'B14' ).setValue( '2971484' );
		ws.getRange2( 'B15' ).setValue( '3074209' );
		ws.getRange2( 'B16' ).setValue( '2785466' );
		ws.getRange2( 'B17' ).setValue( '2515361' );
		ws.getRange2( 'B18' ).setValue( '3105958' );
		ws.getRange2( 'B19' ).setValue( '3139059' );
		ws.getRange2( 'B20' ).setValue( '3380355' );
		ws.getRange2( 'B21' ).setValue( '3612886' );
		ws.getRange2( 'B22' ).setValue( '3765824' );
		ws.getRange2( 'B23' ).setValue( '3771842' );
		ws.getRange2( 'B24' ).setValue( '3356365' );
		ws.getRange2( 'B25' ).setValue( '3490100' );
		ws.getRange2( 'B26' ).setValue( '3163659' );
		ws.getRange2( 'B27' ).setValue( '3167124' );
		ws.getRange2( 'B28' ).setValue( '2883810' );
		ws.getRange2( 'B29' ).setValue( '2610667' );
		ws.getRange2( 'B30' ).setValue( '3129205' );
		ws.getRange2( 'B31' ).setValue( '3200527' );
		ws.getRange2( 'B32' ).setValue( '3547804' );
		ws.getRange2( 'B33' ).setValue( '3766323' );
		ws.getRange2( 'B34' ).setValue( '3935589' );
		ws.getRange2( 'B35' ).setValue( '3917884' );
		ws.getRange2( 'B36' ).setValue( '3564970' );
		ws.getRange2( 'B37' ).setValue( '3602455' );
		ws.getRange2( 'B38' ).setValue( '3326859' );
		ws.getRange2( 'B39' ).setValue( '3441693' );
		ws.getRange2( 'B40' ).setValue( '3211600' );
		ws.getRange2( 'B41' ).setValue( '2998119' );
		ws.getRange2( 'B42' ).setValue( '3472440' );
		ws.getRange2( 'B43' ).setValue( '3563007' );
		ws.getRange2( 'B44' ).setValue( '3820570' );
		ws.getRange2( 'B45' ).setValue( '4107195' );
		ws.getRange2( 'B46' ).setValue( '4284443' );
		ws.getRange2( 'B47' ).setValue( '4356216' );
		ws.getRange2( 'B48' ).setValue( '3819379' );
		ws.getRange2( 'B49' ).setValue( '3844987' );
		ws.getRange2( 'B50' ).setValue( '3478890' );
		ws.getRange2( 'B51' ).setValue( '3443039' );
		ws.getRange2( 'B52' ).setValue( '3204637' );
		ws.getRange2( 'B53' ).setValue( '2966477' );
		ws.getRange2( 'B54' ).setValue( '3593364' );
		ws.getRange2( 'B55' ).setValue( '3604104' );
		ws.getRange2( 'B56' ).setValue( '3933016' );
		ws.getRange2( 'B57' ).setValue( '4146797' );
		ws.getRange2( 'B58' ).setValue( '4176486' );
		ws.getRange2( 'B59' ).setValue( '4347059' );
		ws.getRange2( 'B60' ).setValue( '3781168' );


		ws.getRange2( 'A61' ).setValue( '41548' );
		ws.getRange2( 'A62' ).setValue( '41579' );
		ws.getRange2( 'A63' ).setValue( '41609' );
		ws.getRange2( 'A64' ).setValue( '41640' );
		ws.getRange2( 'A65' ).setValue( '41671' );
		ws.getRange2( 'A66' ).setValue( '41699' );
		ws.getRange2( 'A67' ).setValue( '41730' );
		ws.getRange2( 'A68' ).setValue( '41760' );
		ws.getRange2( 'A69' ).setValue( '41791' );
		ws.getRange2( 'A70' ).setValue( '41821' );
		ws.getRange2( 'A71' ).setValue( '41852' );
		ws.getRange2( 'A72' ).setValue( '41883' );
		ws.getRange2( 'A73' ).setValue( '41913' );
		ws.getRange2( 'A74' ).setValue( '41944' );
		ws.getRange2( 'A75' ).setValue( '41974' );
		ws.getRange2( 'A76' ).setValue( '42005' );
		ws.getRange2( 'A77' ).setValue( '42036' );
		ws.getRange2( 'A78' ).setValue( '42064' );
		ws.getRange2( 'A79' ).setValue( '42095' );
		ws.getRange2( 'A80' ).setValue( '42125' );
		ws.getRange2( 'A81' ).setValue( '42156' );
		ws.getRange2( 'A82' ).setValue( '42186' );
		ws.getRange2( 'A83' ).setValue( '42217' );
		ws.getRange2( 'A84' ).setValue( '42248' );
	}

	test( "Test: \"FORECAST.ETS\"", function () {
		//результаты данного теста соответсвуют результатам LO, но отличаются от MS!!!

		putDataForForecastEts();

		oParser = new parserFormula( "FORECAST.ETS(A61,B4:B60,A4:A60,1,1)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed( 8 ) - 0, 3868499.49723621);

		oParser = new parserFormula( "FORECAST.ETS(A62,B4:B60,A4:A60,1,1)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed( 8 ) - 0, 3560200.99816396);

		oParser = new parserFormula( "FORECAST.ETS(A63,B4:B60,A4:A60,1,1)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed( 8 ) - 0, 3619491.6524986);

		oParser = new parserFormula( "FORECAST.ETS(A64,B4:B60,A4:A60,1,1)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed( 8 ) - 0, 3397521.44972895);

		oParser = new parserFormula( "FORECAST.ETS(A65,B4:B60,A4:A60,1,1)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed( 8 ) - 0, 3152698.4854144);

		oParser = new parserFormula( "FORECAST.ETS(A66,B4:B60,A4:A60,1,1)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed( 8 ) - 0, 3704079.5812005);

		oParser = new parserFormula( "FORECAST.ETS(A67,B4:B60,A4:A60,1,1)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed( 8 ) - 0, 3747546.50043675);

		oParser = new parserFormula( "FORECAST.ETS(A68,B4:B60,A4:A60,1,1)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed( 8 ) - 0, 4042011.75785885);

		oParser = new parserFormula( "FORECAST.ETS(A69,B4:B60,A4:A60,1,1)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed( 8 ) - 0, 4250095.33429725);

		oParser = new parserFormula( "FORECAST.ETS(A70,B4:B60,A4:A60,1,1)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed( 8 ) - 0, 4360538.1411926);

		oParser = new parserFormula( "FORECAST.ETS(A71,B4:B60,A4:A60,1,1)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed( 8 ) - 0, 4463640.2710391);

		oParser = new parserFormula( "FORECAST.ETS(A72,B4:B60,A4:A60,1,1)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed( 8 ) - 0, 3963675.88150212);

		oParser = new parserFormula( "FORECAST.ETS(A73,B4:B60,A4:A60,1,1)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed( 8 ) - 0, 4028087.58056954);

		oParser = new parserFormula( "FORECAST.ETS(A74,B4:B60,A4:A60,1,1)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed( 8 ) - 0, 3719789.0814973);

		oParser = new parserFormula( "FORECAST.ETS(A75,B4:B60,A4:A60,1,1)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed( 8 ) - 0, 3779079.73583193);

		oParser = new parserFormula( "FORECAST.ETS(A76,B4:B60,A4:A60,1,1)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed( 8 ) - 0, 3557109.53306228);

		oParser = new parserFormula( "FORECAST.ETS(A77,B4:B60,A4:A60,1,1)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed( 8 ) - 0, 3312286.56874774);

		oParser = new parserFormula( "FORECAST.ETS(A78,B4:B60,A4:A60,1,1)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed( 8 ) - 0, 3863667.66453383);

		oParser = new parserFormula( "FORECAST.ETS(A79,B4:B60,A4:A60,1,1)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed( 8 ) - 0, 3907134.58377009);

		oParser = new parserFormula( "FORECAST.ETS(A80,B4:B60,A4:A60,1,1)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed( 8 ) - 0, 4201599.84119218);

		oParser = new parserFormula( "FORECAST.ETS(A81,B4:B60,A4:A60,1,1)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed( 8 ) - 0, 4409683.41763059);

		oParser = new parserFormula( "FORECAST.ETS(A82,B4:B60,A4:A60,1,1)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed( 8 ) - 0, 4520126.22452593);

		oParser = new parserFormula( "FORECAST.ETS(A83,B4:B60,A4:A60,1,1)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed( 8 ) - 0, 4623228.35437243);

		oParser = new parserFormula( "FORECAST.ETS(A84,B4:B60,A4:A60,1,1)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed( 8 ) - 0, 4123263.96483545);

	} );

	test( "Test: \"FORECAST.ETS.SEASONALITY\"", function () {
		//результаты данного теста соответсвуют результатам LO, но отличаются от MS!!!

		putDataForForecastEts();

		oParser = new parserFormula("FORECAST.ETS.SEASONALITY(B4:B60,A4:A60,1,1)", "A1", ws);
		ok(oParser.parse());
		strictEqual(oParser.calculate().getValue(), 12);
	} );

	test( "Test: \"FORECAST.ETS.STAT\"", function () {
		//результаты данного теста соответсвуют результатам LO, но отличаются от MS!!!

		putDataForForecastEts();

		oParser = new parserFormula("FORECAST.ETS.STAT(B4:B60,A4:A60,1,1)", "A1", ws);
		ok(oParser.parse());
		strictEqual(oParser.calculate().getValue().toFixed( 8 ) - 0, 0.65234375);
	} );

	test( "Test: \"FORECAST.LINEAR\"", function () {
		oParser = new parserFormula( "FORECAST(30,{6,7,9,15,21},{20,28,31,38,40})", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed( 13 ) - 0, 10.6072530864198);
	} );

	test( "FORMULATEXT", function () {
		wb.dependencyFormulas.unlockRecal();

		ws.getRange2( "S101" ).setValue( "=TODAY()" );
		ws.getRange2( "S102" ).setValue( "" );
		ws.getRange2( "S103" ).setValue( "=1+1" );

		oParser = new parserFormula( "FORMULATEXT(S101)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "=TODAY()" );

		oParser = new parserFormula( "FORMULATEXT(S101:S102)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "=TODAY()" );

		oParser = new parserFormula( "FORMULATEXT(S102)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#N/A" );

		oParser = new parserFormula( "FORMULATEXT(S100:105)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#VALUE!" );

		oParser = new parserFormula( "FORMULATEXT(S103)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "=1+1" );

		wb.dependencyFormulas.lockRecal();
	} );

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
        var a = oParser.calculate();
        strictEqual( a.getElement( 0 ).getValue(), 1 );
        strictEqual( a.getElement( 1 ).getValue(), 2 );
        strictEqual( a.getElement( 2 ).getValue(), 4 );
        strictEqual( a.getElement( 3 ).getValue(), 2 );

    } );

    test( "Test: \"GAMMALN\"", function () {

        oParser = new parserFormula( "GAMMALN(4.5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue().toFixed( 14 ) - 0, 2.45373657084244 );

        oParser = new parserFormula( "GAMMALN(-4.5)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), "#NUM!" );

    } );

	test( "Test: \"GAMMALN.PRECISE\"", function () {

		oParser = new parserFormula( "GAMMALN.PRECISE(4)", "A1", ws );
		ok( oParser.parse(), "GAMMALN.PRECISE(4)" );
		strictEqual( oParser.calculate().getValue().toFixed( 7 ) - 0, 1.7917595, "GAMMALN.PRECISE(4)" );

		oParser = new parserFormula( "GAMMALN.PRECISE(-4.5)", "A1", ws );
		ok( oParser.parse(), "GAMMALN.PRECISE(-4.5)" );
		strictEqual( oParser.calculate().getValue(), "#NUM!", "GAMMALN.PRECISE(-4.5)" );

	} );

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

    } );

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

    } );

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

    } );

	test( "Test: \"HYPGEOM.DIST\"", function () {

		oParser = new parserFormula( "HYPGEOM.DIST(1,4,8,20,TRUE)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(4) - 0, 0.4654 );

		oParser = new parserFormula( "HYPGEOM.DIST(1,4,8,20,FALSE)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(4) - 0, 0.3633 );

		oParser = new parserFormula( "HYPGEOM.DIST(2,2,3,40,0)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(9) - 0, 0.003846154);

		oParser = new parserFormula( "HYPGEOM.DIST(2,3,3,40,5)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(9) - 0, 0.999898785);

		oParser = new parserFormula( "HYPGEOM.DIST(1,2,3,4,5)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue() - 0, 0.5);

	} );

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

    } );

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

    } );

    test( "Test: \"LARGE\"", function () {

        oParser = new parserFormula( "LARGE({3,5,3,5,4;4,2,4,6,7},3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 5 );

        oParser = new parserFormula( "LARGE({3,5,3,5,4;4,2,4,6,7},7)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 4 );

    } );

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

    } );

    test( "Test: \"MODE\"", function () {

        function mode( x ) {

            x.sort(AscCommon.fSortAscending);

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

    } );

	test( "Test: \"MODE.MULT \"", function () {

		ws.getRange2( "F202" ).setValue( "1" );
		ws.getRange2( "F203" ).setValue( "2" );
		ws.getRange2( "F204" ).setValue( "3" );
		ws.getRange2( "F205" ).setValue( "4" );
		ws.getRange2( "F206" ).setValue( "3" );
		ws.getRange2( "F207" ).setValue( "2" );
		ws.getRange2( "F208" ).setValue( "1" );
		ws.getRange2( "F209" ).setValue( "2" );
		ws.getRange2( "F210" ).setValue( "3" );
		ws.getRange2( "F211" ).setValue( "5" );
		ws.getRange2( "F212" ).setValue( "6" );
		ws.getRange2( "F213" ).setValue( "1" );

		oParser = new parserFormula( "MODE.MULT(F202:F213)", "F1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 1 );

	} );

	test( "Test: \"MODE.SNGL \"", function () {

		ws.getRange2( "F202" ).setValue( "5.6" );
		ws.getRange2( "F203" ).setValue( "4" );
		ws.getRange2( "F204" ).setValue( "4" );
		ws.getRange2( "F205" ).setValue( "3" );
		ws.getRange2( "F206" ).setValue( "2" );
		ws.getRange2( "F207" ).setValue( "4" );

		oParser = new parserFormula( "MODE.SNGL(F202:F207)", "F1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 4 );

	} );

	test( "Test: \"NUMBERVALUE\"", function () {
		oParser = new parserFormula( 'NUMBERVALUE("2.500,27",",",".")', "A1", ws );
		ok( oParser.parse(), 'NUMBERVALUE("2.500,27",",",".")');
		strictEqual( oParser.calculate().getValue(), 2500.27, 'NUMBERVALUE("2.500,27",",",".")');

		oParser = new parserFormula( 'NUMBERVALUE("3.5%")', "A1", ws );
		ok( oParser.parse(), 'NUMBERVALUE("3.5%")');
		strictEqual( oParser.calculate().getValue(), 0.035, 'NUMBERVALUE("3.5%")');

		oParser = new parserFormula( 'NUMBERVALUE("3.5%%%")', "A1", ws );
		ok( oParser.parse(), 'NUMBERVALUE("3.5%%%")');
		strictEqual( oParser.calculate().getValue(), 0.0000035, 'NUMBERVALUE("3.5%%%")');

		oParser = new parserFormula( 'NUMBERVALUE(123123,6,6)', "A1", ws );
		ok( oParser.parse(), 'NUMBERVALUE(123123,6,6)');
		strictEqual( oParser.calculate().getValue(), "#VALUE!", 'NUMBERVALUE(123123,6,6)');

	});

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

    } );

	test( "Test: \"NORM.DIST \"", function () {

		ws.getRange2( "F202" ).setValue( "42" );
		ws.getRange2( "F203" ).setValue( "40" );
		ws.getRange2( "F204" ).setValue( "1.5" );

		oParser = new parserFormula( "NORM.DIST(F202,F203,F204,TRUE)", "F1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 0.9087888 );

		oParser = new parserFormula( "NORM.DIST(F202,F203,F204,FALSE)", "F1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(5) - 0, 0.10934 );

	} );

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

    } );

	test( "Test: \"NORM.S.DIST\"", function () {

		oParser = new parserFormula( "NORM.S.DIST(1.333333,TRUE)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(9) - 0, 0.908788726 );

		oParser = new parserFormula( "NORM.S.DIST(1.333333,FALSE)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(9) - 0, 0.164010148 );

	} );
	
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

    } );

	test( "Test: \"NEGBINOM.DIST \"", function () {

		ws.getRange2( "F202" ).setValue( "10" );
		ws.getRange2( "F203" ).setValue( "5" );
		ws.getRange2( "F204" ).setValue( "0.25" );

		oParser = new parserFormula( "NEGBINOM.DIST(F202,F203,F204,TRUE)", "F1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 0.3135141 );

		oParser = new parserFormula( "NEGBINOM.DIST(F202,F203,F204,FALSE)", "F1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 0.0550487 );
	} );

	test( "Test: \"NEGBINOMDIST \"", function () {

		ws.getRange2( "F202" ).setValue( "10" );
		ws.getRange2( "F203" ).setValue( "5" );
		ws.getRange2( "F204" ).setValue( "0.25" );

		oParser = new parserFormula( "NEGBINOMDIST(F202,F203,F204)", "F1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(8) - 0, 0.05504866 );
	} );

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

    } );

	test( "Test: \"NORM.S.INV \"", function () {

		oParser = new parserFormula( "NORM.S.INV(0.908789)", "F1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 1.3333347 );

	} );

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
    } );

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

    } );

	test( "Test: \"NORM.INV \"", function () {

		ws.getRange2( "F202" ).setValue( "0.908789" );
		ws.getRange2( "F203" ).setValue( "40" );
		ws.getRange2( "F204" ).setValue( "1.5" );

		oParser = new parserFormula( "NORM.INV(F202,F203,F204)", "F1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(6) - 0, 42.000002 );
	} );

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

    } );

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

    } );

	test( "Test: \"PERCENTILE.INC\"", function () {
		ws.getRange2( "A2" ).setValue( "1" );
		ws.getRange2( "A3" ).setValue( "2" );
		ws.getRange2( "A4" ).setValue( "3" );
		ws.getRange2( "A5" ).setValue( "4" );

		oParser = new parserFormula( "PERCENTILE.INC(A2:A5,0.3)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 1.9 );
	} );

	test( "Test: \"PERCENTILE.EXC\"", function () {
		ws.getRange2( "A202" ).setValue( "1" );
		ws.getRange2( "A203" ).setValue( "2" );
		ws.getRange2( "A204" ).setValue( "3" );
		ws.getRange2( "A205" ).setValue( "6" );
		ws.getRange2( "A206" ).setValue( "6" );
		ws.getRange2( "A207" ).setValue( "6" );
		ws.getRange2( "A208" ).setValue( "7" );
		ws.getRange2( "A209" ).setValue( "8" );
		ws.getRange2( "A210" ).setValue( "9" );

		oParser = new parserFormula( "PERCENTILE.EXC(A202:A210, 0.25)", "A1", ws );
		ok( oParser.parse(), "PERCENTILE.EXC(A202:A210, 0.25)" );
		strictEqual( oParser.calculate().getValue(), 2.5, "PERCENTILE.EXC(A202:A210, 0.25)" );

		oParser = new parserFormula( "PERCENTILE.EXC(A202:A210, 0)", "A1", ws );
		ok( oParser.parse(), "PERCENTILE.EXC(A202:A210, 0)" );
		strictEqual( oParser.calculate().getValue(), "#NUM!", "PERCENTILE.EXC(A202:A210, 0)" );

		oParser = new parserFormula( "PERCENTILE.EXC(A202:A210, 0.01)", "A1", ws );
		ok( oParser.parse(), "PERCENTILE.EXC(A202:A210, 0.01)" );
		strictEqual( oParser.calculate().getValue(), "#NUM!", "PERCENTILE.EXC(A202:A210, 0.01)" );

		oParser = new parserFormula( "PERCENTILE.EXC(A202:A210, 2)", "A1", ws );
		ok( oParser.parse(), "PERCENTILE.EXC(A202:A210, 2)" );
		strictEqual( oParser.calculate().getValue(), "#NUM!", "PERCENTILE.EXC(A202:A210, 2)" );
	} );

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

    } );

	test( "Test: \"PERCENTRANK.EXC\"", function () {
		ws.getRange2( "A202" ).setValue( "1" );
		ws.getRange2( "A203" ).setValue( "2" );
		ws.getRange2( "A204" ).setValue( "3" );
		ws.getRange2( "A205" ).setValue( "6" );
		ws.getRange2( "A206" ).setValue( "6" );
		ws.getRange2( "A207" ).setValue( "6" );
		ws.getRange2( "A208" ).setValue( "7" );
		ws.getRange2( "A209" ).setValue( "8" );
		ws.getRange2( "A210" ).setValue( "9" );

		oParser = new parserFormula( "PERCENTRANK.EXC(A202:A210, 7)", "A1", ws );
		ok( oParser.parse(), "PERCENTRANK.EXC(A202:A210, 7)" );
		strictEqual( oParser.calculate().getValue(), 0.7, "PERCENTRANK.EXC(A202:A210, 7)" );

		oParser = new parserFormula( "PERCENTRANK.EXC(A202:A210, 5.43)", "A1", ws );
		ok( oParser.parse(), "PERCENTRANK.EXC(A202:A210, 5.43)" );
		strictEqual( oParser.calculate().getValue(), 0.381, "PERCENTRANK.EXC(A202:A210, 5.43)" );

		oParser = new parserFormula( "PERCENTRANK.EXC(A202:A210, 5.43, 1)", "A1", ws );
		ok( oParser.parse(), "PERCENTRANK.EXC(A202:A210, 5.43, 1)" );
		strictEqual( oParser.calculate().getValue(), 0.3, "PERCENTRANK.EXC(A202:A210, 5.43, 1)" );
	} );

	test( "Test: \"PERCENTRANK.INC\"", function () {
		ws.getRange2( "A202" ).setValue( "13" );
		ws.getRange2( "A203" ).setValue( "12" );
		ws.getRange2( "A204" ).setValue( "11" );
		ws.getRange2( "A205" ).setValue( "8" );
		ws.getRange2( "A206" ).setValue( "4" );
		ws.getRange2( "A207" ).setValue( "3" );
		ws.getRange2( "A208" ).setValue( "2" );
		ws.getRange2( "A209" ).setValue( "1" );
		ws.getRange2( "A210" ).setValue( "1" );
		ws.getRange2( "A211" ).setValue( "1" );

		oParser = new parserFormula( "PERCENTRANK.INC(A202:A211, 2)", "A1", ws );
		ok( oParser.parse(), "PERCENTRANK.INC(A202:A211, 2)" );
		strictEqual( oParser.calculate().getValue(), 0.333, "PERCENTRANK.INC(A202:A211, 2)" );

		oParser = new parserFormula( "PERCENTRANK.INC(A202:A211, 4)", "A1", ws );
		ok( oParser.parse(), "PERCENTRANK.INC(A202:A211, 4)" );
		strictEqual( oParser.calculate().getValue(), 0.555, "PERCENTRANK.INC(A202:A211, 4)" );

		oParser = new parserFormula( "PERCENTRANK.INC(A202:A211, 8)", "A1", ws );
		ok( oParser.parse(), "PERCENTRANK.INC(A202:A211, 8)" );
		strictEqual( oParser.calculate().getValue(), 0.666, "PERCENTRANK.INC(A202:A211, 8)" );

		oParser = new parserFormula( "PERCENTRANK.INC(A202:A211, 5)", "A1", ws );
		ok( oParser.parse(), "PERCENTRANK.INC(A202:A211, 5)" );
		strictEqual( oParser.calculate().getValue(), 0.583, "PERCENTRANK.INC(A202:A211, 5)" );
	} );

	test( "Test: \"PERMUT\"", function () {
		ws.getRange2( "A2" ).setValue( "100" );
		ws.getRange2( "A3" ).setValue( "3" );

		oParser = new parserFormula( "PERMUT(A2,A3)", "A1", ws );
		ok( oParser.parse(), "PERMUT(A2,A3)" );
		strictEqual( oParser.calculate().getValue(), 970200, "PERMUT(A2,A3)" );

		oParser = new parserFormula( "PERMUT(3,2)", "A1", ws );
		ok( oParser.parse(), "PERMUT(3,2)" );
		strictEqual( oParser.calculate().getValue(), 6, "PERMUT(3,2)" );
	} );

	test( "Test: \"PERMUTATIONA\"", function () {
		oParser = new parserFormula( "PERMUTATIONA(3,2)", "A1", ws );
		ok( oParser.parse(), "PERMUTATIONA(3,2)" );
		strictEqual( oParser.calculate().getValue(), 9, "PERMUTATIONA(3,2)" );

		oParser = new parserFormula( "PERMUTATIONA(2,2)", "A1", ws );
		ok( oParser.parse(), "PERMUTATIONA(2,2)" );
		strictEqual( oParser.calculate().getValue(), 4, "PERMUTATIONA(2,2)" );
	} );

	test( "Test: \"PHI\"", function () {
		oParser = new parserFormula( "PHI(0.75)", "A1", ws );
		ok( oParser.parse(), "PHI(0.75)" );
		strictEqual( oParser.calculate().getValue().toFixed(9) - 0, 0.301137432, "PHI(0.75)" );
	} );

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
    } );

	test( "Test: \"POISSON.DIST\"", function () {
		ws.getRange2( "A202" ).setValue( "2" );
		ws.getRange2( "A203" ).setValue( "5" );

		oParser = new parserFormula( "POISSON.DIST(A202,A203,TRUE)", "A1", ws );
		ok( oParser.parse(), "POISSON.DIST(A202,A203,TRUE)" );
		strictEqual( oParser.calculate().getValue().toFixed(6) - 0, 0.124652, "POISSON.DIST(A202,A203,TRUE)" );

		oParser = new parserFormula( "POISSON.DIST(A202,A203,FALSE)", "A1", ws );
		ok( oParser.parse(), "POISSON.DIST(A202,A203,FALSE)" );
		strictEqual( oParser.calculate().getValue().toFixed(6) - 0, 0.084224, "POISSON.DIST(A202,A203,FALSE)" );
	} );

    test( "Test: \"PROB\"", function () {

        oParser = new parserFormula( "PROB({0,1,2,3},{0.2,0.3,0.1,0.4},2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 0.1 );

        oParser = new parserFormula( "PROB({0,1,2,3},{0.2,0.3,0.1,0.4},1,4)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 0.8 );

    } );

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

    } );

	test( "Test: \"QUARTILE\"", function () {
		ws.getRange2( "A202" ).setValue( "1" );
		ws.getRange2( "A203" ).setValue( "2" );
		ws.getRange2( "A204" ).setValue( "4" );
		ws.getRange2( "A205" ).setValue( "7" );
		ws.getRange2( "A206" ).setValue( "8" );
		ws.getRange2( "A207" ).setValue( "9" );
		ws.getRange2( "A208" ).setValue( "10" );
		ws.getRange2( "A209" ).setValue( "12" );

		oParser = new parserFormula( "QUARTILE(A202:A209,1)", "A1", ws );
		ok( oParser.parse(), "QUARTILE(A202:A209,1)" );
		strictEqual( oParser.calculate().getValue(), 3.5, "QUARTILE(A202:A209,1)" );
	} );

    test( "Test: \"QUARTILE.INC\"", function () {
		ws.getRange2( "A202" ).setValue( "1" );
		ws.getRange2( "A203" ).setValue( "2" );
		ws.getRange2( "A204" ).setValue( "4" );
		ws.getRange2( "A205" ).setValue( "7" );
		ws.getRange2( "A206" ).setValue( "8" );
		ws.getRange2( "A207" ).setValue( "9" );
		ws.getRange2( "A208" ).setValue( "10" );
		ws.getRange2( "A209" ).setValue( "12" );

		oParser = new parserFormula( "QUARTILE.INC(A202:A209,1)", "A1", ws );
		ok( oParser.parse(), "QUARTILE.INC(A202:A209,1)" );
		strictEqual( oParser.calculate().getValue(), 3.5, "QUARTILE.INC(A202:A209,1)" );
	} );

	test( "Test: \"QUARTILE.EXC\"", function () {
		ws.getRange2( "A202" ).setValue( "6" );
		ws.getRange2( "A203" ).setValue( "7" );
		ws.getRange2( "A204" ).setValue( "15" );
		ws.getRange2( "A205" ).setValue( "36" );
		ws.getRange2( "A206" ).setValue( "39" );
		ws.getRange2( "A207" ).setValue( "40" );
		ws.getRange2( "A208" ).setValue( "41" );
		ws.getRange2( "A209" ).setValue( "42" );
		ws.getRange2( "A210" ).setValue( "43" );
		ws.getRange2( "A211" ).setValue( "47" );
		ws.getRange2( "A212" ).setValue( "49" );

		oParser = new parserFormula( "QUARTILE.EXC(A202:A212,1)", "A1", ws );
		ok( oParser.parse(), "QUARTILE.EXC(A202:A212,1)" );
		strictEqual( oParser.calculate().getValue(), 15, "QUARTILE.EXC(A202:A212,1)" );

		oParser = new parserFormula( "QUARTILE.EXC(A202:A212,3)", "A1", ws );
		ok( oParser.parse(), "QUARTILE.EXC(A202:A212,3)" );
		strictEqual( oParser.calculate().getValue(), 43, "QUARTILE.EXC(A202:A212,3)" );
	} );

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

    } );

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

    } );

	test( "Test: \"SKEW.P\"", function () {
		ws.getRange2( "A202" ).setValue( "3" );
		ws.getRange2( "A203" ).setValue( "4" );
		ws.getRange2( "A204" ).setValue( "5" );
		ws.getRange2( "A205" ).setValue( "2" );
		ws.getRange2( "A206" ).setValue( "3" );
		ws.getRange2( "A207" ).setValue( "4" );
		ws.getRange2( "A208" ).setValue( "5" );
		ws.getRange2( "A209" ).setValue( "6" );
		ws.getRange2( "A210" ).setValue( "4" );
		ws.getRange2( "A211" ).setValue( "7" );

		oParser = new parserFormula( "SKEW.P(A202:A211)", "A1", ws );
		ok( oParser.parse(), "SKEW.P(A202:A211)" );
		strictEqual( oParser.calculate().getValue().toFixed(6) - 0, 0.303193, "SKEW.P(A202:A211)" );
	} );

    test( "Test: \"SMALL\"", function () {

        oParser = new parserFormula( "SMALL({3,5,3,5,4;4,2,4,6,7},3)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 3 );

        oParser = new parserFormula( "SMALL({3,5,3,5,4;4,2,4,6,7},7)", "A1", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 5 );

    } );

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

    } );

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

    } );

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

    } );

	test( "Test: \"STDEV.S\"", function () {
		ws.getRange2( "A202" ).setValue( "1345" );
		ws.getRange2( "A203" ).setValue( "1301" );
		ws.getRange2( "A204" ).setValue( "1368" );
		ws.getRange2( "A205" ).setValue( "1322" );
		ws.getRange2( "A206" ).setValue( "1310" );
		ws.getRange2( "A207" ).setValue( "1370" );
		ws.getRange2( "A208" ).setValue( "1318" );
		ws.getRange2( "A209" ).setValue( "1350" );
		ws.getRange2( "A210" ).setValue( "1303" );
		ws.getRange2( "A211" ).setValue( "1299" );

		oParser = new parserFormula( "STDEV.S(A202:A211)", "A1", ws );
		ok( oParser.parse(), "STDEV.S(A202:A211)" );
		strictEqual( oParser.calculate().getValue().toFixed(8) - 0, 27.46391572, "STDEV.S(A202:A211)" );
	} );

	test( "Test: \"STDEV.P\"", function () {
		ws.getRange2( "A202" ).setValue( "1345" );
		ws.getRange2( "A203" ).setValue( "1301" );
		ws.getRange2( "A204" ).setValue( "1368" );
		ws.getRange2( "A205" ).setValue( "1322" );
		ws.getRange2( "A206" ).setValue( "1310" );
		ws.getRange2( "A207" ).setValue( "1370" );
		ws.getRange2( "A208" ).setValue( "1318" );
		ws.getRange2( "A209" ).setValue( "1350" );
		ws.getRange2( "A210" ).setValue( "1303" );
		ws.getRange2( "A211" ).setValue( "1299" );

		oParser = new parserFormula( "STDEV.P(A202:A211)", "A1", ws );
		ok( oParser.parse(), "STDEV.P(A202:A211)" );
		strictEqual( oParser.calculate().getValue().toFixed(8) - 0, 26.05455814, "STDEV.P(A202:A211)" );
	} );


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

    } );

	test( "Test: \"SWITCH\"", function () {
		ws.getRange2( "A2" ).setValue( "2" );
		ws.getRange2( "A3" ).setValue( "99" );
		ws.getRange2( "A4" ).setValue( "99" );
		ws.getRange2( "A5" ).setValue( "2" );
		ws.getRange2( "A6" ).setValue( "3" );

		oParser = new parserFormula( 'SWITCH(WEEKDAY(A2),1,"Sunday",2,"Monday",3,"Tuesday","No match")', "A1", ws );
		ok( oParser.parse(), 'SWITCH(WEEKDAY(A2),1,"Sunday",2,"Monday",3,"Tuesday","No match")' );
		strictEqual( oParser.calculate().getValue(), "Monday", 'SWITCH(WEEKDAY(A2),1,"Sunday",2,"Monday",3,"Tuesday","No match")' );

		oParser = new parserFormula( 'SWITCH(A3,1,"Sunday",2,"Monday",3,"Tuesday")', "A1", ws );
		ok( oParser.parse(), 'SWITCH(A3,1,"Sunday",2,"Monday",3,"Tuesday")' );
		strictEqual( oParser.calculate().getValue(), "#N/A", 'SWITCH(A3,1,"Sunday",2,"Monday",3,"Tuesday")' );

		oParser = new parserFormula( 'SWITCH(A4,1,"Sunday",2,"Monday",3,"Tuesday","No match")', "A1", ws );
		ok( oParser.parse(), 'SWITCH(A4,1,"Sunday",2,"Monday",3,"Tuesday","No match")' );
		strictEqual( oParser.calculate().getValue(), "No match", 'SWITCH(A4,1,"Sunday",2,"Monday",3,"Tuesday","No match")' );

		oParser = new parserFormula( 'SWITCH(A5,1,"Sunday",7,"Saturday","weekday")', "A1", ws );
		ok( oParser.parse(), 'SWITCH(A5,1,"Sunday",7,"Saturday","weekday")' );
		strictEqual( oParser.calculate().getValue(), "weekday", 'SWITCH(A5,1,"Sunday",7,"Saturday","weekday")' );

		oParser = new parserFormula( 'SWITCH(A6,1,"Sunday",2,"Monday",3,"Tuesday","No match")', "A1", ws );
		ok( oParser.parse(), 'SWITCH(A6,1,"Sunday",2,"Monday",3,"Tuesday","No match")' );
		strictEqual( oParser.calculate().getValue(), "Tuesday", 'SWITCH(A6,1,"Sunday",2,"Monday",3,"Tuesday","No match")' );

		oParser = new parserFormula( 'SWITCH(122,1,"Sunday",2,"Monday",3,"Tuesday","No match")', "A1", ws );
		ok( oParser.parse(), 'SWITCH(122,1,"Sunday",2,"Monday",3,"Tuesday","No match")' );
		strictEqual( oParser.calculate().getValue(), "No match", 'SWITCH(122,1,"Sunday",2,"Monday",3,"Tuesday","No match")' );

		oParser = new parserFormula( 'SWITCH({1,"2asd",3},{12,2,3},{"asd",2,3,4})', "A1", ws );
		ok( oParser.parse(), 'SWITCH({1,"2asd",3},{12,2,3},{"asd",2,3,4})' );
		strictEqual( oParser.calculate().getValue(), "#N/A", 'SWITCH({1,"2asd",3},{12,2,3},{"asd",2,3,4})' );

		oParser = new parserFormula( 'SWITCH({"asd1","2asd",3},{"asd1",1,3},"sdf")', "A1", ws );
		ok( oParser.parse(), 'SWITCH({"asd1","2asd",3},{"asd1",1,3},"sdf")' );
		strictEqual( oParser.calculate().getValue(), "sdf", 'SWITCH({"asd1","2asd",3},{"asd1",1,3},"sdf")' );

	} );

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

    } );

	test( "Test: \"VAR.P\"", function () {

		ws.getRange2( "A202" ).setValue( "1345" );
		ws.getRange2( "A203" ).setValue( "1301" );
		ws.getRange2( "A204" ).setValue( "1368" );
		ws.getRange2( "A205" ).setValue( "1322" );

		ws.getRange2( "A206" ).setValue( "1310" );
		ws.getRange2( "A207" ).setValue( "1370" );
		ws.getRange2( "A208" ).setValue( "1318" );
		ws.getRange2( "A209" ).setValue( "1350" );

		ws.getRange2( "A210" ).setValue( "1303" );
		ws.getRange2( "A211" ).setValue( "1299" );

	    oParser = new parserFormula( "VAR.P(A202:A211)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(2) - 0, 678.84 );

	} );

	test( "Test: \"VAR.S\"", function () {

		ws.getRange2( "A202" ).setValue( "1345" );
		ws.getRange2( "A203" ).setValue( "1301" );
		ws.getRange2( "A204" ).setValue( "1368" );
		ws.getRange2( "A205" ).setValue( "1322" );

		ws.getRange2( "A206" ).setValue( "1310" );
		ws.getRange2( "A207" ).setValue( "1370" );
		ws.getRange2( "A208" ).setValue( "1318" );
		ws.getRange2( "A209" ).setValue( "1350" );

		ws.getRange2( "A210" ).setValue( "1303" );
		ws.getRange2( "A211" ).setValue( "1299" );

		oParser = new parserFormula( "VAR.S(A202:A211)", "A1", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(2) - 0, 754.27 );

	} );

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

    } );

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

    } );

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

    } );

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

    } );

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

    } );

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

    } );

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

    } );

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

    } );

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

    } );

    test( "Test: \"NPV\"", function () {

        oParser = new parserFormula( "NPV(0.1,-10000,3000,4200,6800)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1188.4434123352216 );

    } );

    test( "Test: \"EFFECT\"", function () {

        function effect(nr,np){

            if( nr <= 0 || np < 1 ) return "#NUM!";

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

    } );

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

    } );

	test( "Test: \"ISFORMULA\"", function () {

		ws.getRange2( "C150" ).setValue( "=TODAY()" );
		ws.getRange2( "C151" ).setValue( "7" );
		ws.getRange2( "C152" ).setValue( "Hello, world!" );
		ws.getRange2( "C153" ).setValue( "=3/0" );

		oParser = new parserFormula( "ISFORMULA(C150)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().toString(), "TRUE" );

		oParser = new parserFormula( "ISFORMULA(C151)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().toString(), "FALSE" );

		oParser = new parserFormula( "ISFORMULA(C152)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().toString(), "FALSE" );

		oParser = new parserFormula( "ISFORMULA(C153)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().toString(), "TRUE" );
	} );


	test( "Test: \"IFNA\"", function () {

		oParser = new parserFormula( 'IFNA(MATCH(30,B1:B5,0),"Not found")', "A2", ws );
		ok( oParser.parse(), 'IFNA(MATCH(30,B1:B5,0),"Not found")' );
		strictEqual( oParser.calculate().getValue(), "Not found", 'IFNA(MATCH(30,B1:B5,0),"Not found")' );

	} );

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

    } );

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

    } );

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

    } );

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

    } );

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

    } );

    test( "Test: \"AMORLINC\"", function () {

        oParser = new parserFormula( "AMORLINC(2400,DATE(2008,8,19),DATE(2008,12,31),300,1,0.15,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 360 );

        oParser = new parserFormula( "AMORLINC(2400,DATE(2008,8,19),DATE(2008,12,31),300,1,0.70,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), 1484 );

    } );

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

    } );

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

    } );

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

    } );

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

    } );

    test( "Test: \"DISC\"", function () {

        function disc( settlement, maturity, pr, redemption, basis ){

            if( settlement >= maturity || pr <= 0 || redemption <= 0 || basis < 0 || basis > 4 )
                return "#NUM!"

            return ( 1.0 - pr / redemption ) / AscCommonExcel.yearFrac( settlement, maturity, basis );

        }

        oParser = new parserFormula( "DISC(DATE(2007,1,25),DATE(2007,6,15),97.975,100,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), disc( new Date(2007,0,25),new Date(2007,5,15),97.975,100,1 ) );

    } );

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

    } );

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

    } );

    test( "Test: \"RECEIVED\"", function () {

        function received( settlement, maturity, investment, discount, basis ){

            if( settlement >= maturity || investment <= 0 || discount <= 0 || basis < 0 || basis > 4 )
                return "#NUM!"

            return investment / ( 1 - ( discount * AscCommonExcel.yearFrac( settlement, maturity, basis) ) )

        }

        oParser = new parserFormula( "RECEIVED(DATE(2008,2,15),DATE(2008,5,15),1000000,0.0575,2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), received( new Date(2008,1,15),new Date(2008,4,15),1000000,0.0575,2 ) );

    } );

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

    } );

	test( "Test: \"RRI\"", function () {

		oParser = new parserFormula( "RRI(96, 10000, 11000)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 0.0009933 );

		oParser = new parserFormula( "RRI(0, 10000, 11000)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#NUM!" );

		oParser = new parserFormula( "RRI(-10, 10000, 11000)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#NUM!" );

		oParser = new parserFormula( "RRI(10, 10000, -11000)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#NUM!" );

		oParser = new parserFormula( "RRI(1, 1, -1)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), -2 );

	} );

    test( "Test: \"INTRATE\"", function () {

        function intrate( settlement, maturity, investment, redemption, basis ){

            if( settlement >= maturity || investment <= 0 || redemption <= 0 || basis < 0 || basis > 4 )
                return "#NUM!"

            return ( ( redemption / investment ) - 1 ) / AscCommonExcel.yearFrac( settlement, maturity, basis )

        }

        oParser = new parserFormula( "INTRATE(DATE(2008,2,15),DATE(2008,5,15),1000000,1014420,2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), intrate( new Date(2008,1,15),new Date(2008,4,15),1000000,1014420,2 ) );

    } );

    test( "Test: \"TBILLEQ\"", function () {

        function tbilleq( settlement, maturity, discount ){

            maturity = Date.prototype.getDateFromExcel(maturity.getExcelDate() + 1);

            var d1 = settlement, d2 = maturity;
            var date1 = d1.getDate(), month1 = d1.getMonth(), year1 = d1.getFullYear(),
                date2 = d2.getDate(), month2 = d2.getMonth(), year2 = d2.getFullYear();

            var nDiff = GetDiffDate360( date1, month1, year1, date2, month2, year2, true );

            if( settlement >= maturity || discount <= 0 || nDiff > 360 )
                return "#NUM!";

            return ( 365 * discount ) / ( 360 - discount * nDiff );

        }

        oParser = new parserFormula( "TBILLEQ(DATE(2008,3,31),DATE(2008,6,1),0.0914)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), tbilleq( new Date(Date.UTC(2008,2,31)), new Date(Date.UTC(2008,5,1)), 0.0914 ) );

    } );

    test( "Test: \"TBILLPRICE\"", function () {

        function tbillprice( settlement, maturity, discount ){

            maturity = Date.prototype.getDateFromExcel(maturity.getExcelDate() + 1)

            var d1 = settlement
            var d2 = maturity

            var fFraction = AscCommonExcel.yearFrac(d1, d2, 0);

            if( fFraction - Math.floor( fFraction ) == 0 )
                return "#NUM!";

            return 100 * ( 1 - discount * fFraction );

        }

        oParser = new parserFormula( "TBILLPRICE(DATE(2008,3,31),DATE(2008,6,1),0.09)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), tbillprice( new Date(Date.UTC(2008,2,31)), new Date(Date.UTC(2008,5,1)), 0.09 ) );

    } );

    test( "Test: \"TBILLYIELD\"", function () {

        function tbillyield( settlement, maturity, pr ){

            var d1 = settlement;
            var d2 = maturity;
            var date1 = d1.getDate(), month1 = d1.getMonth(), year1 = d1.getFullYear(),
                date2 = d2.getDate(), month2 = d2.getMonth(), year2 = d2.getFullYear();

            var nDiff = GetDiffDate360( date1, month1, year1, date2, month2, year2, true );
            nDiff++;
            if( settlement >= maturity || pr <= 0 || nDiff > 360 )
                return "#NUM!";

            return ( ( 100 - pr ) / pr) * (360 / nDiff);

        }

        oParser = new parserFormula( "TBILLYIELD(DATE(2008,3,31),DATE(2008,6,1),98.45)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), tbillyield( new Date(2008,2,31), new Date(2008,5,1), 98.45 ) );

    } );

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

    } );

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

    } );

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

    } );

    test( "Test: \"COUPNCD\"", function () {

        function coupncd( settlement, maturity, frequency, basis ) {

            basis = ( basis !== undefined ? basis : 0 );

            _lcl_GetCoupncd( settlement, maturity, frequency );

            return maturity.getExcelDate();

        }

        oParser = new parserFormula( "COUPNCD(DATE(2007,1,25),DATE(2008,11,15),2,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), coupncd( new Date(Date.UTC(2007,0,25)), new Date(Date.UTC(2008,10,15)), 2, 1 ) );

    } );

    test( "Test: \"COUPNUM\"", function () {

        oParser = new parserFormula( "COUPNUM(DATE(2007,1,25),DATE(2008,11,15),2,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), _coupnum( new Date(2007,0,25), new Date(2008,10,15), 2, 1 ) );

    } );

    test( "Test: \"COUPPCD\"", function () {

        function couppcd( settlement, maturity, frequency, basis ) {

            basis = ( basis !== undefined ? basis : 0 );

            _lcl_GetCouppcd( settlement, maturity, frequency );
            return maturity.getExcelDate();

        }

        oParser = new parserFormula( "COUPPCD(DATE(2007,1,25),DATE(2008,11,15),2,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), couppcd( new Date(Date.UTC(2007,0,25)), new Date(Date.UTC(2008,10,15)), 2, 1 ) );

    } );

	test( "Test: \"CONVERT\"", function () {

		oParser = new parserFormula( 'CONVERT(68, "F", "C")', "A2", ws );
		ok( oParser.parse(), 'CONVERT(68, "F", "C")' );
		strictEqual( oParser.calculate().getValue(), 20, 'CONVERT(68, "F", "C")' );

		oParser = new parserFormula( 'CONVERT(2.5, "ft", "sec")', "A2", ws );
		ok( oParser.parse(), 'CONVERT(2.5, "ft", "sec")' );
		strictEqual( oParser.calculate().getValue(), "#N/A", 'CONVERT(2.5, "ft", "sec")' );

		oParser = new parserFormula( 'CONVERT(CONVERT(100,"ft","m"),"ft","m")', "A2", ws );
		ok( oParser.parse(), 'CONVERT(CONVERT(100,"ft","m"),"ft","m")' );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 9.290304, 'CONVERT(CONVERT(100,"ft","m"),"ft","m")' );

		oParser = new parserFormula( 'CONVERT(7,"bit","byte")', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(3) - 0, 0.875 );

		oParser = new parserFormula( 'CONVERT(7,"admkn","kn")', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(14) - 0, 6.99999939524838 );

		oParser = new parserFormula( 'CONVERT(7,"admkn","m/s")', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 3.6011108 );

		oParser = new parserFormula( 'CONVERT(7,"admkn","mph")', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 8.0554554 );

		oParser = new parserFormula( 'CONVERT(7,"m/h","m/sec")', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 0.0019444 );

		oParser = new parserFormula( 'CONVERT(7,"m/hr","mph")', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 0.0043496 );

		oParser = new parserFormula( 'CONVERT(7,"m","mi")', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 0.0043496 );

		oParser = new parserFormula( 'CONVERT(7,"m","Pica")', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 19842.5196850 );

		oParser = new parserFormula( 'CONVERT(7,"m","pica")', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 1653.5433071 );

		oParser = new parserFormula( 'CONVERT(7,"Nmi","pica")', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 3062362.2047251 );

		oParser = new parserFormula( 'CONVERT(7,"yr","day")', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 2556.75 );

		oParser = new parserFormula( 'CONVERT(7,"yr","min")', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 3681720 );

		oParser = new parserFormula( 'CONVERT(7,"day","min")', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 10080 );

		oParser = new parserFormula( 'CONVERT(7,"hr","sec")', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 25200 );

		oParser = new parserFormula( 'CONVERT(7,"min","sec")', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 420 );

		oParser = new parserFormula( 'CONVERT(7,"Pa","mmHg")', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 0.0525043 );

		oParser = new parserFormula( 'CONVERT(7,"Pa","psi")', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 0.0010153 );

		oParser = new parserFormula( 'CONVERT(7,"Pa","Torr")', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 0.0525045 );

		oParser = new parserFormula( 'CONVERT(7,"g","sg")', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 0.0004797 );

		oParser = new parserFormula( 'CONVERT(7,"g","lbm")', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 0.0154324 );

		oParser = new parserFormula( 'CONVERT(1, "lbm", "kg")', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(7) - 0, 0.4535923 );

		oParser = new parserFormula( 'CONVERT(1, "lbm", "mg")', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(0) - 0, 453592 );

		oParser = new parserFormula( 'CONVERT(1, "klbm", "mg")', "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#N/A" );

	} );

    test( "Test: \"PRICE\"", function () {

        oParser = new parserFormula( "PRICE(DATE(2008,2,15),DATE(2017,11,15),0.0575,0.065,100,2,0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), _getprice( new Date( Date.UTC(2008, 1, 15 )), new Date( Date.UTC(2017, 10, 15 )), 0.0575, 0.065, 100, 2, 0 ) );

    } );

    test( "Test: \"PRICEDISC\"", function () {

        function pricedisc(settl, matur, discount, redemption, basis){
            return redemption * ( 1.0 - discount * _getdiffdate( settl, matur, basis ) );
        }

        oParser = new parserFormula( "PRICEDISC(DATE(2008,2,16),DATE(2008,3,1),0.0525,100,2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), pricedisc( new Date(2008,1,16), new Date(2008,2,1),0.0525,100,2 ) );

    } );

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

    } );

    test( "Test: \"YIELD\"", function () {

        oParser = new parserFormula( "YIELD(DATE(2008,2,15),DATE(2016,11,15),0.0575,95.04287,100,2,0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), _getYield( new Date(Date.UTC(2008,1,15)), new Date(Date.UTC(2016,10,15)),0.0575,95.04287,100,2,0 ) );

    } );

    test( "Test: \"YIELDDISC\"", function () {

        function yielddisc( settlement, maturity, pr, redemption, basis ){

            var fRet = ( redemption / pr ) - 1.0;
            fRet /= _yearFrac( settlement, maturity, basis );
            return fRet;

        }

        oParser = new parserFormula( "YIELDDISC(DATE(2008,2,16),DATE(2008,3,1),99.795,100,2)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), yielddisc( new Date( 2008, 1, 16 ), new Date( 2008, 2, 1 ), 99.795, 100, 2 ) );

    } );

    test( "Test: \"YIELDMAT\"", function () {

        oParser = new parserFormula( "YIELDMAT(DATE(2008,3,15),DATE(2008,11,3),DATE(2007,11,8),0.0625,100.0123,0)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), _getyieldmat( new Date( 2008, 2, 15 ), new Date( 2008, 10, 3 ), new Date( 2007, 10, 8 ), 0.0625, 100.0123, 0 ) );

    } );

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

    } );

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

    } );

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

    } );

    test( "Test: \"MDURATION\"", function () {

        function mduration(settl, matur, coupon, yld, frequency, basis){

            return _duration( settl, matur, coupon, yld, frequency, basis ) / (1 + yld/frequency);

        }

        oParser = new parserFormula( "MDURATION(DATE(2008,1,1),DATE(2016,1,1),0.08,0.09,2,1)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), mduration( new Date(Date.UTC(2008,0,1)), new Date(Date.UTC(2016,0,1)), 0.08, 0.09, 2, 1 ) );

    } );

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

    } );

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

    } );

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

    } );

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


    } );

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

    } );

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

    } );

    test( "Test: \"SLN\"", function () {

        function sln( cost, salvage, life ){

            if ( life == 0 ) return "#NUM!";

            return ( cost - salvage ) / life;
        }

        oParser = new parserFormula( "SLN(30000,7500,10)", "A2", ws );
        ok( oParser.parse() );
        strictEqual( oParser.calculate().getValue(), sln(30000,7500,10) );


    } );

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

    } );

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

    } );

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

    } );

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

    } );

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

    });

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

    });

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

    });

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

    });

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

    });

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

    });

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

    });

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

    });

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

    });

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

    });

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

    });

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

    });

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

    });

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

    });

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

    });

	test( "Test: \"ERF.PRECISE\"", function () {

		oParser = new parserFormula( "ERF.PRECISE(1)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(14)-0, 0.8427007929497149.toFixed(14)-0 );

		oParser = new parserFormula( "ERF.PRECISE(1.234)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(14)-0, 0.9190394169576684.toFixed(14)-0 );

		oParser = new parserFormula( "ERF.PRECISE(0.745)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(8) - 0, 0.70792892 );

		oParser = new parserFormula( "ERF.PRECISE(1)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(8) - 0, 0.84270079 );

	});

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

    });

	test( "Test: \"ERFC.PRECISE\"", function () {

		oParser = new parserFormula( "ERFC.PRECISE(1.234)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(14)-0, 0.08096058304233157.toFixed(14)-0 );

		oParser = new parserFormula( "ERFC.PRECISE(1)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(14)-0, 0.15729920705028513.toFixed(14)-0 );

		oParser = new parserFormula( "ERFC.PRECISE(0)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 1 );

		oParser = new parserFormula( "ERFC.PRECISE(-1)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(14)-0, 1.8427007929497148.toFixed(14)-0 );

	});

	test( "Test: \"BITAND\"", function () {

		oParser = new parserFormula( 'BITAND(1,5)', "AA2", ws );
		ok( oParser.parse(), 'BITAND(1,5)' );
		strictEqual( oParser.calculate().getValue(), 1, 'BITAND(1,5)' );

		oParser = new parserFormula( 'BITAND(13,25)', "AA2", ws );
		ok( oParser.parse(), 'BITAND(13,25)' );
		strictEqual( oParser.calculate().getValue(), 9, 'BITAND(13,25)' );

	});

	test( "Test: \"BITOR\"", function () {

		oParser = new parserFormula( 'BITOR(23,10)', "AA2", ws );
		ok( oParser.parse());
		strictEqual( oParser.calculate().getValue(), 31 );

	});

	test( "Test: \"BITXOR\"", function () {

		oParser = new parserFormula( 'BITXOR(5,3)', "AA2", ws );
		ok( oParser.parse());
		strictEqual( oParser.calculate().getValue(), 6 );

	});

	test( "Test: \"BITRSHIFT\"", function () {

		oParser = new parserFormula( 'BITRSHIFT(13,2)', "AA2", ws );
		ok( oParser.parse());
		strictEqual( oParser.calculate().getValue(), 3 );

	});

	test( "Test: \"BITLSHIFT\"", function () {

		oParser = new parserFormula( 'BITLSHIFT(4,2)', "AA2", ws );
		ok( oParser.parse());
		strictEqual( oParser.calculate().getValue(), 16 );

	});

	function putDataForDatabase(){
		ws.getRange2( "A1" ).setValue( "Tree" );
		ws.getRange2( "A2" ).setValue( "Apple" );
		ws.getRange2( "A3" ).setValue( "Pear" );

		ws.getRange2( "A4" ).setValue( "Tree" );

		ws.getRange2( "A5" ).setValue( "Apple" );
		ws.getRange2( "A6" ).setValue( "Pear" );
		ws.getRange2( "A7" ).setValue( "Cherry" );
		ws.getRange2( "A8" ).setValue( "Apple" );
		ws.getRange2( "A9" ).setValue( "Pear" );
		ws.getRange2( "A10" ).setValue( "Apple" );


		ws.getRange2( "B1" ).setValue( "Height" );
		ws.getRange2( "B2" ).setValue( ">10" );
		ws.getRange2( "B3" ).setValue( "" );

		ws.getRange2( "B4" ).setValue( "Height" );

		ws.getRange2( "B5" ).setValue( "18" );
		ws.getRange2( "B6" ).setValue( "12" );
		ws.getRange2( "B7" ).setValue( "13" );
		ws.getRange2( "B8" ).setValue( "14" );
		ws.getRange2( "B9" ).setValue( "9" );
		ws.getRange2( "B10" ).setValue( "8" );


		ws.getRange2( "C1" ).setValue( "Age" );
		ws.getRange2( "C2" ).setValue( "" );
		ws.getRange2( "C3" ).setValue( "" );

		ws.getRange2( "C4" ).setValue( "Age" );

		ws.getRange2( "C5" ).setValue( "20" );
		ws.getRange2( "C6" ).setValue( "12" );
		ws.getRange2( "C7" ).setValue( "14" );
		ws.getRange2( "C8" ).setValue( "15" );
		ws.getRange2( "C9" ).setValue( "8" );
		ws.getRange2( "C10" ).setValue( "9" );


		ws.getRange2( "C1" ).setValue( "Age" );
		ws.getRange2( "C2" ).setValue( "" );
		ws.getRange2( "C3" ).setValue( "" );

		ws.getRange2( "C4" ).setValue( "Age" );

		ws.getRange2( "C5" ).setValue( "20" );
		ws.getRange2( "C6" ).setValue( "12" );
		ws.getRange2( "C7" ).setValue( "14" );
		ws.getRange2( "C8" ).setValue( "15" );
		ws.getRange2( "C9" ).setValue( "8" );
		ws.getRange2( "C10" ).setValue( "9" );


		ws.getRange2( "D1" ).setValue( "Yield" );
		ws.getRange2( "D2" ).setValue( "" );
		ws.getRange2( "D3" ).setValue( "" );

		ws.getRange2( "D4" ).setValue( "Yield" );

		ws.getRange2( "D5" ).setValue( "14" );
		ws.getRange2( "D6" ).setValue( "10" );
		ws.getRange2( "D7" ).setValue( "9" );
		ws.getRange2( "D8" ).setValue( "10" );
		ws.getRange2( "D9" ).setValue( "8" );
		ws.getRange2( "D10" ).setValue( "6" );


		ws.getRange2( "E1" ).setValue( "Profit" );
		ws.getRange2( "E2" ).setValue( "" );
		ws.getRange2( "E3" ).setValue( "" );

		ws.getRange2( "E4" ).setValue( "Profit" );

		ws.getRange2( "E5" ).setValue( "105" );
		ws.getRange2( "E6" ).setValue( "96" );
		ws.getRange2( "E7" ).setValue( "105" );
		ws.getRange2( "E8" ).setValue( "75" );
		ws.getRange2( "E9" ).setValue( "76.8" );
		ws.getRange2( "E10" ).setValue( "45" );

		ws.getRange2( "F1" ).setValue( "Height" );
		ws.getRange2( "F2" ).setValue( "<16" );
		ws.getRange2( "F3" ).setValue( "" );
    }

	//database formulas
	test( "Test: \"DAVERAGE\"", function () {

		putDataForDatabase();

		oParser = new parserFormula( 'DAVERAGE(A4:E10, "Yield", A1:B2)', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 12 );

		oParser = new parserFormula( 'DAVERAGE(A4:E10, 3, A4:E10)', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 13 );

	});

	test( "Test: \"DCOUNT\"", function () {

		putDataForDatabase();

		oParser = new parserFormula( 'DCOUNT(A4:E10, "Age", A1:F2)', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 1 );

		oParser = new parserFormula( 'DCOUNT(A4:E10,, A1:F2)', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 1 );

		oParser = new parserFormula( 'DCOUNT(A4:E10,"", A1:F2)', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#VALUE!" );

	});

	test( "Test: \"DCOUNTA\"", function () {

		putDataForDatabase();

		oParser = new parserFormula( 'DCOUNTA(A4:E10, "Profit", A1:F2)', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 1 );

		oParser = new parserFormula( 'DCOUNTA(A4:E10,, A1:F2)', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 1 );

		oParser = new parserFormula( 'DCOUNTA(A4:E10,"", A1:F2)', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#VALUE!" );

	});

	test( "Test: \"DGET\"", function () {

		putDataForDatabase();

		oParser = new parserFormula( 'DGET(A4:E10, "Yield", A1:A3)', "AA2", ws );
		ok( oParser.parse(), 'DGET(A4:E10, "Yield", A1:A3)' );
		strictEqual( oParser.calculate().getValue(), "#NUM!", 'DGET(A4:E10, "Yield", A1:A3)' );

		oParser = new parserFormula( 'DGET(A4:E10, "Yield", A1:F2)', "AA2", ws );
		ok( oParser.parse(), 'DGET(A4:E10, "Yield", A1:F2)' );
		strictEqual( oParser.calculate().getValue(), 10, 'DGET(A4:E10, "Yield", A1:F2)' );

	});

	test( "Test: \"DMAX\"", function () {

		putDataForDatabase();

		oParser = new parserFormula( 'DMAX(A4:E10, "Profit", A1:F3)', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 96 );

	});

	test( "Test: \"DMIN\"", function () {

		putDataForDatabase();

		oParser = new parserFormula( 'DMIN(A4:E10, "Profit", A1:F3)', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 75 );

	});

	test( "Test: \"DPRODUCT\"", function () {

		putDataForDatabase();

		oParser = new parserFormula( 'DPRODUCT(A4:E10, "Yield", A1:F3)', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 800 );

	});

	test( "Test: \"DSTDEV\"", function () {

		putDataForDatabase();

		oParser = new parserFormula( 'DSTDEV(A4:E10, "Yield", A1:F3)', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(4) - 0, 1.1547);

	});

	test( "Test: \"DSTDEVP\"", function () {

		putDataForDatabase();

		oParser = new parserFormula( 'DSTDEVP(A4:E10, "Yield", A1:F3)', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(6) - 0, 0.942809);

	});

	test( "Test: \"DSUM\"", function () {

		putDataForDatabase();

		oParser = new parserFormula( 'DSUM(A4:E10,"Profit",A1:A2)', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 225);

		oParser = new parserFormula( 'DSUM(A4:E10,"Profit", A1:F3)', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 247.8);

	});

	test( "Test: \"DVAR\"", function () {

		putDataForDatabase();

		oParser = new parserFormula( 'DVAR(A4:E10, "Yield", A1:A3)', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(1) - 0, 8.8);

	});

	test( "Test: \"DVARP\"", function () {

		putDataForDatabase();

		oParser = new parserFormula( 'DVARP(A4:E10, "Yield", A1:A3)', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(2) - 0, 7.04);

	});

	test( "Test: \"UNICODE\"", function () {

		oParser = new parserFormula( 'UNICODE(" ")', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 32);

		oParser = new parserFormula( 'UNICODE("B")', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 66);

		oParser = new parserFormula( 'UNICODE(0)', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 48);

		oParser = new parserFormula( 'UNICODE(1)', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 49);

		oParser = new parserFormula( 'UNICODE("true")', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), 116);

		oParser = new parserFormula( 'UNICODE(#N/A)', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#N/A");

	});

	test( "Test: \"UNICHAR\"", function () {

		oParser = new parserFormula( 'UNICHAR(66)', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "B");

		oParser = new parserFormula( 'UNICHAR(32)', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), " ");

		oParser = new parserFormula( 'UNICHAR(0)', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#VALUE!");

		oParser = new parserFormula( 'UNICHAR(48)', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "0");

		oParser = new parserFormula( 'UNICHAR(49)', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "1");

	});

	test( "Test: \"GROWTH\"", function () {

		ws.getRange2( "A102" ).setValue( "11" );
		ws.getRange2( "A103" ).setValue( "12" );
		ws.getRange2( "A104" ).setValue( "13" );
		ws.getRange2( "A105" ).setValue( "14" );
		ws.getRange2( "A106" ).setValue( "15" );
		ws.getRange2( "A107" ).setValue( "16" );

		ws.getRange2( "B102" ).setValue( "33100" );
		ws.getRange2( "B103" ).setValue( "47300" );
		ws.getRange2( "B104" ).setValue( "69000" );
		ws.getRange2( "B105" ).setValue( "102000" );
		ws.getRange2( "B106" ).setValue( "150000" );
		ws.getRange2( "B107" ).setValue( "220000" );

		ws.getRange2( "C102" ).setValue( "32618" );
		ws.getRange2( "C103" ).setValue( "47729" );
		ws.getRange2( "C104" ).setValue( "69841" );
		ws.getRange2( "C105" ).setValue( "102197" );
		ws.getRange2( "C106" ).setValue( "149542" );
		ws.getRange2( "C107" ).setValue( "218822" );

		ws.getRange2( "A109" ).setValue( "17" );
		ws.getRange2( "A110" ).setValue( "18" );

		oParser = new parserFormula( "GROWTH(B102:B107,A102:A107,A109:A110)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(4) - 0, 320196.7184);

		oParser = new parserFormula( "GROWTH(B102:B107,A102:A107)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(5) - 0, 32618.20377);

		oParser = new parserFormula( "GROWTH(A102:C102,A103:C104,A105:C106,1)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(8) - 0, 11.00782679);

		oParser = new parserFormula( "GROWTH(A102:C102,A103:C104,A105:C106,1)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(8) - 0, 11.00782679);

		oParser = new parserFormula( "GROWTH(A103:C103,A104:C105,A106:C107,1)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(8) - 0, 12.00187209);

		oParser = new parserFormula( "GROWTH(A103:C103,A104:C105,A106:C107,10)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(8) - 0, 12.00187209);

		oParser = new parserFormula( "GROWTH(A103:C103,A104:C105,A106:C107,0)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(8) - 0, 1.0017632);

		oParser = new parserFormula( "GROWTH({1,2,3},A104:C105,A106:C107,1)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(8) - 0, 1.00038318);

		oParser = new parserFormula( "GROWTH({1,2,3},A104:C105,A106:C107,A106:C107)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#VALUE!");

		/*oParser = new parserFormula( "GROWTH({3,4,5,6,7})", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(8) - 0, 3.14681449);*/

	} );

	test( "Test: \"TREND\"", function () {

		ws.getRange2( "A101" ).setValue( "1" );
		ws.getRange2( "A102" ).setValue( "2" );
		ws.getRange2( "A103" ).setValue( "3" );
		ws.getRange2( "A104" ).setValue( "4" );
		ws.getRange2( "A105" ).setValue( "5" );
		ws.getRange2( "A106" ).setValue( "6" );
		ws.getRange2( "A107" ).setValue( "7" );
		ws.getRange2( "A108" ).setValue( "8" );
		ws.getRange2( "A109" ).setValue( "9" );
		ws.getRange2( "A110" ).setValue( "10" );
		ws.getRange2( "A111" ).setValue( "11" );
		ws.getRange2( "A112" ).setValue( "12" );


		ws.getRange2( "B101" ).setValue( "133890" );
		ws.getRange2( "B102" ).setValue( "135000" );
		ws.getRange2( "B103" ).setValue( "135790" );
		ws.getRange2( "B104" ).setValue( "137300" );
		ws.getRange2( "B105" ).setValue( "138130" );
		ws.getRange2( "B106" ).setValue( "139100" );
		ws.getRange2( "B107" ).setValue( "139900" );
		ws.getRange2( "B108" ).setValue( "141120" );
		ws.getRange2( "B109" ).setValue( "141890" );
		ws.getRange2( "B110" ).setValue( "143230" );
		ws.getRange2( "B111" ).setValue( "144000" );
		ws.getRange2( "B112" ).setValue( "145290" );

		ws.getRange2( "A115" ).setValue( "13" );
		ws.getRange2( "A116" ).setValue( "14" );
		ws.getRange2( "A117" ).setValue( "15" );
		ws.getRange2( "A118" ).setValue( "16" );
		ws.getRange2( "A119" ).setValue( "17" );

		oParser = new parserFormula( "TREND(A101:A112,B101:B112)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(9) - 0, 0.947729865);

		oParser = new parserFormula( "TREND(B101:B112,A101:A112,A115:A119)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(4) - 0, 146171.5152);
	} );

	test( "Test: \"PDURATION\"", function () {
		oParser = new parserFormula( "PDURATION(2.5%,2000,2200)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(2) - 0, 3.86);

		oParser = new parserFormula( "PDURATION(0.025/12,1000,1200)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(1) - 0, 87.6);

		oParser = new parserFormula( "PDURATION(0.025,1000,1200)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(2) - 0, 7.38);

		oParser = new parserFormula( "PDURATION(-0.025,1000,1200)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#NUM!");

		oParser = new parserFormula( "PDURATION(0.025,-1000,1200)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#NUM!");

		oParser = new parserFormula( "PDURATION(0.025,1000,-1200)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#NUM!");

		oParser = new parserFormula( "PDURATION({0.025},{1000},{1200})", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue().toFixed(2) - 0, 7.38);

		oParser = new parserFormula( "PDURATION(\"TEST\",1000,-1200)", "A2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#VALUE!");


	});

	test( "Test: \"IFS\"", function () {

		oParser = new parserFormula( 'IFS(1,"TEST")', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "TEST");

		oParser = new parserFormula( 'IFS(0,"TEST",1,"TEST2")', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "TEST2");

		oParser = new parserFormula( 'IFS(2<1,">3")', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#N/A");

		oParser = new parserFormula( 'IFS(2<1,">3",2>1)', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "#N/A");

		oParser = new parserFormula( 'IFS(2<1,"TEST",2<1,2,4>3,"TEST2")', "AA2", ws );
		ok( oParser.parse() );
		strictEqual( oParser.calculate().getValue(), "TEST2");
        
	});

	test( "Test: \"IF\"", function () {

		oParser = new parserFormula('IF(1,"TEST")', "AA2", ws);
		ok(oParser.parse());
		strictEqual(oParser.calculate().getValue(), "TEST");

		oParser = new parserFormula('IF(0,"TEST")', "AA2", ws);
		ok(oParser.parse());
		strictEqual(oParser.calculate().getValue(), "FALSE");

		ws.getRange2( "A101" ).setValue( "1" );

		oParser = new parserFormula('IF(A101=1,"Yes","No")', "AA2", ws);
		ok(oParser.parse());
		strictEqual(oParser.calculate().getValue(), "Yes");

		oParser = new parserFormula('IF(A101=2,"Yes","No")', "AA2", ws);
		ok(oParser.parse());
		strictEqual(oParser.calculate().getValue(), "No");

	});

	test( "Test: \"COLUMN\"", function () {

		oParser = new parserFormula('COLUMN(B6)', "AA2", ws);
		ok(oParser.parse());
		strictEqual(oParser.calculate().getValue(), 2);

		oParser = new parserFormula('COLUMN(C16)', "AA2", ws);
		ok(oParser.parse());
		strictEqual(oParser.calculate().getValue(), 3);

		oParser = new parserFormula('COLUMN()', "AA2", ws);
		ok(oParser.parse());
		strictEqual(oParser.calculate().getValue(), 1);

	});

	test( "Test: \"ROW\"", function () {

		oParser = new parserFormula('ROW(B6)', "AA2", ws);
		ok(oParser.parse());
		strictEqual(oParser.calculate().getValue(), 6);

		oParser = new parserFormula('ROW(C16)', "AA2", ws);
		ok(oParser.parse());
		strictEqual(oParser.calculate().getValue(), 16);

		oParser = new parserFormula('ROW()', "AA2", ws);
		ok(oParser.parse());
		strictEqual(oParser.calculate().getValue(), 1);

	});

	test( "Test: \"SUBTOTAL\"", function () {
		ws.getRange2( "A102" ).setValue( "120" );
		ws.getRange2( "A103" ).setValue( "10" );
		ws.getRange2( "A104" ).setValue( "150" );
		ws.getRange2( "A105" ).setValue( "23" );

		oParser = new parserFormula( "SUBTOTAL(1,A102:A105)", "A2", ws );
		ok( oParser.parse(), "SUBTOTAL(1,A102:A105)" );
		strictEqual( oParser.calculate().getValue().toFixed(2) - 0, 75.75, "SUBTOTAL(1,A102:A105)");

		oParser = new parserFormula( "SUBTOTAL(2,A102:A105)", "A2", ws );
		ok( oParser.parse(), "SUBTOTAL(2,A102:A105)" );
		strictEqual( oParser.calculate().getValue(), 4, "SUBTOTAL(2,A102:A105)");

		oParser = new parserFormula( "SUBTOTAL(3,A102:A105)", "A2", ws );
		ok( oParser.parse(), "SUBTOTAL(3,A102:A105)" );
		strictEqual( oParser.calculate().getValue(), 4, "SUBTOTAL(3,A102:A105)");

		oParser = new parserFormula( "SUBTOTAL(4,A102:A105)", "A2", ws );
		ok( oParser.parse(), "SUBTOTAL(4,A102:A105)" );
		strictEqual( oParser.calculate().getValue(), 150, "SUBTOTAL(4,A102:A105)");

		oParser = new parserFormula( "SUBTOTAL(5,A102:A105)", "A2", ws );
		ok( oParser.parse(), "SUBTOTAL(5,A102:A105)" );
		strictEqual( oParser.calculate().getValue(), 10, "SUBTOTAL(5,A102:A105)");

		oParser = new parserFormula( "SUBTOTAL(6,A102:A105)", "A2", ws );
		ok( oParser.parse(), "SUBTOTAL(6,A102:A105)" );
		strictEqual( oParser.calculate().getValue(), 4140000, "SUBTOTAL(6,A102:A105)");

		oParser = new parserFormula( "SUBTOTAL(7,A102:A105)", "A2", ws );
		ok( oParser.parse(), "SUBTOTAL(7,A102:A105)" );
		strictEqual( oParser.calculate().getValue().toFixed(8) - 0, 69.70592992, "SUBTOTAL(7,A102:A105)");

		oParser = new parserFormula( "SUBTOTAL(8,A102:A105)", "A2", ws );
		ok( oParser.parse(), "SUBTOTAL(8,A102:A105)" );
		strictEqual( oParser.calculate().getValue().toFixed(8) - 0, 60.36710611, "SUBTOTAL(8,A102:A105)");

		oParser = new parserFormula( "SUBTOTAL(9,A102:A105)", "A2", ws );
		ok( oParser.parse(), "SUBTOTAL(9,A102:A105)" );
		strictEqual( oParser.calculate().getValue(), 303, "SUBTOTAL(9,A102:A105)");
	} );

	test( "Test: \"MID\"", function () {
		ws.getRange2( "A101" ).setValue( "Fluid Flow" );

		oParser = new parserFormula( "MID(A101,1,5)", "A2", ws );
		ok( oParser.parse(), "MID(A101,1,5)" );
		strictEqual( oParser.calculate().getValue(), "Fluid", "MID(A101,1,5)");

		oParser = new parserFormula( "MID(A101,7,20)", "A2", ws );
		ok( oParser.parse(), "MID(A101,7,20)" );
		strictEqual( oParser.calculate().getValue(), "Flow", "MID(A101,7,20)");

		oParser = new parserFormula( "MID(A101,20,5)", "A2", ws );
		ok( oParser.parse(), "MID(A101,20,5)" );
		strictEqual( oParser.calculate().getValue(), "", "MID(A101,20,5))");
	} );

	test( "Test: \"MIDB\"", function () {
		ws.getRange2( "A101" ).setValue( "Fluid Flow" );

		oParser = new parserFormula( "MIDB(A101,1,5)", "A2", ws );
		ok( oParser.parse(), "MIDB(A101,1,5)" );
		strictEqual( oParser.calculate().getValue(), "Fluid", "MIDB(A101,1,5)");

		oParser = new parserFormula( "MIDB(A101,7,20)", "A2", ws );
		ok( oParser.parse(), "MIDB(A101,7,20)" );
		strictEqual( oParser.calculate().getValue(), "Flow", "MIDB(A101,7,20)");

		oParser = new parserFormula( "MIDB(A101,20,5)", "A2", ws );
		ok( oParser.parse(), "MIDB(A101,20,5)" );
		strictEqual( oParser.calculate().getValue(), "", "MIDB(A101,20,5))");
	} );

	test( "Test: \"FIND\"", function () {
		ws.getRange2( "A101" ).setValue( "Miriam McGovern" );

		oParser = new parserFormula( 'FIND("M",A101)', "A2", ws );
		ok( oParser.parse(), 'FIND("M",A101)' );
		strictEqual( oParser.calculate().getValue(), 1, 'FIND("M",A101)');

		oParser = new parserFormula( 'FIND("m",A101)', "A2", ws );
		ok( oParser.parse(), 'FIND("m",A101)' );
		strictEqual( oParser.calculate().getValue(), 6, 'FIND("m",A101)');

		oParser = new parserFormula( 'FIND("M",A101,3)', "A2", ws );
		ok( oParser.parse(), 'FIND("M",A101,3)' );
		strictEqual( oParser.calculate().getValue(), 8, 'FIND("M",A101,3)');
	} );

	test( "Test: \"FINDB\"", function () {
		ws.getRange2( "A101" ).setValue( "Miriam McGovern" );

		oParser = new parserFormula( 'FINDB("M",A101)', "A2", ws );
		ok( oParser.parse(), 'FINDB("M",A101)' );
		strictEqual( oParser.calculate().getValue(), 1, 'FINDB("M",A101)');

		oParser = new parserFormula( 'FINDB("m",A101)', "A2", ws );
		ok( oParser.parse(), 'FINDB("m",A101)' );
		strictEqual( oParser.calculate().getValue(), 6, 'FINDB("m",A101)');

		oParser = new parserFormula( 'FINDB("M",A101,3)', "A2", ws );
		ok( oParser.parse(), 'FINDB("M",A101,3)' );
		strictEqual( oParser.calculate().getValue(), 8, 'FINDB("M",A101,3)');
	} );

	test( "Test: \">\"", function () {
		oParser = new parserFormula( '1.123>1.5', "A2", ws );
		ok( oParser.parse(), '1.123>1.5' );
		strictEqual( oParser.calculate().getValue(), "FALSE", '1.123>1.5');

		oParser = new parserFormula( '1.555>1.5', "A2", ws );
		ok( oParser.parse(), '1.555>1.5' );
		strictEqual( oParser.calculate().getValue(), "TRUE", '1.555>1.5');
	} );

	test( "Test: \"<\"", function () {
		oParser = new parserFormula( '1.123<1.5', "A2", ws );
		ok( oParser.parse(), '1.123<1.5' );
		strictEqual( oParser.calculate().getValue(), "TRUE", '1.123<1.5');

		oParser = new parserFormula( '1.555<1.5', "A2", ws );
		ok( oParser.parse(), '1.555<1.5' );
		strictEqual( oParser.calculate().getValue(), "FALSE", '1.555<1.5');
	} );

	test( "Test: \"=\"", function () {
		oParser = new parserFormula( '1.123=1.5', "A2", ws );
		ok( oParser.parse(), '1.123=1.5' );
		strictEqual( oParser.calculate().getValue(), "FALSE", '1.123=1.5');

		oParser = new parserFormula( '1.555=1.555', "A2", ws );
		ok( oParser.parse(), '1.555=1.555' );
		strictEqual( oParser.calculate().getValue(), "TRUE", '1.555=1.555');
	} );

	test( "Test: \"<>\"", function () {
		oParser = new parserFormula( '1.123<>1.5', "A2", ws );
		ok( oParser.parse(), '1.123<>1.5' );
		strictEqual( oParser.calculate().getValue(), "TRUE", '1.123<>1.5');

		oParser = new parserFormula( '1.555<>1.555', "A2", ws );
		ok( oParser.parse(), '1.555<>1.555' );
		strictEqual( oParser.calculate().getValue(), "FALSE", '1.555<>1.555');
	} );

	test( "Test: \">=\"", function () {
		oParser = new parserFormula( '1.123>=1.5', "A2", ws );
		ok( oParser.parse(), '1.123>=1.5' );
		strictEqual( oParser.calculate().getValue(), "FALSE", '1.123>=1.5');

		oParser = new parserFormula( '1.555>=1.555', "A2", ws );
		ok( oParser.parse(), '1.555>=1.555' );
		strictEqual( oParser.calculate().getValue(), "TRUE", '1.555>=1.555');

		oParser = new parserFormula( '1.557>=1.555', "A2", ws );
		ok( oParser.parse(), '1.557>=1.555' );
		strictEqual( oParser.calculate().getValue(), "TRUE", '1.557>=1.555');
	} );

	test( "Test: \"<=\"", function () {
		oParser = new parserFormula( '1.123<=1.5', "A2", ws );
		ok( oParser.parse(), '1.123<=1.5' );
		strictEqual( oParser.calculate().getValue(), "TRUE", '1.123<=1.5');

		oParser = new parserFormula( '1.555<=1.555', "A2", ws );
		ok( oParser.parse(), '1.555<=1.555' );
		strictEqual( oParser.calculate().getValue(), "TRUE", '1.555<=1.555');

		oParser = new parserFormula( '1.557<=1.555', "A2", ws );
		ok( oParser.parse(), '1.557<=1.555' );
		strictEqual( oParser.calculate().getValue(), "FALSE", '1.557<=1.555');
	} );


	test( "Test: \"ADDRESS\"", function () {

		oParser = new parserFormula( "ADDRESS(2,3,2)", "A2", ws );
		ok( oParser.parse(), "ADDRESS(2,3,2)" );
		strictEqual( oParser.calculate().getValue(), "C$2", "ADDRESS(2,3,2)");

		oParser = new parserFormula( "ADDRESS(2,3,2,FALSE)", "A2", ws );
		ok( oParser.parse(), "ADDRESS(2,3,2,FALSE)" );
		strictEqual( oParser.calculate().getValue(), "R2C[3]", "ADDRESS(2,3,2,FALSE)");

		oParser = new parserFormula( 'ADDRESS(2,3,1,FALSE,"[Book1]Sheet1")', "A2", ws );
		ok( oParser.parse(), 'ADDRESS(2,3,1,FALSE,"[Book1]Sheet1")' );
		strictEqual( oParser.calculate().getValue(), "'[Book1]Sheet1'!R2C3", 'ADDRESS(2,3,1,FALSE,"[Book1]Sheet1")');

		oParser = new parserFormula( 'ADDRESS(2,3,1,FALSE,"EXCEL SHEET")', "A2", ws );
		ok( oParser.parse(), 'ADDRESS(2,3,1,FALSE,"EXCEL SHEET")' );
		strictEqual( oParser.calculate().getValue(), "'EXCEL SHEET'!R2C3", 'ADDRESS(2,3,1,FALSE,"EXCEL SHEET")');

		ws.getRange2( "A101" ).setValue( "" );

		oParser = new parserFormula( "ADDRESS(2,3,2,1,A101)", "A2", ws );
		ok( oParser.parse(), "ADDRESS(2,3,2,1,A101" );
		strictEqual( oParser.calculate().getValue(), "!C$2", "ADDRESS(2,3,2,1,A101");

		ws.getRange2( "A101" ).setValue( "'" );

		oParser = new parserFormula( "ADDRESS(2,3,2,1,A101)", "A2", ws );
		ok( oParser.parse(), "ADDRESS(2,3,2,1,A101" );
		strictEqual( oParser.calculate().getValue(), "!C$2", "ADDRESS(2,3,2,1,A101");

		oParser = new parserFormula( 'ADDRESS(2,3,2,1,"")', "A2", ws );
		ok( oParser.parse(), 'ADDRESS(2,3,2,1,"")' );
		strictEqual( oParser.calculate().getValue(), "!C$2", 'ADDRESS(2,3,2,1,"")');

		oParser = new parserFormula( "ADDRESS(2,3,2,1,\"'\")", "A2", ws );
		ok( oParser.parse(), "ADDRESS(2,3,2,1,\"'\")" );
		strictEqual( oParser.calculate().getValue(), "''''!C$2", "ADDRESS(2,3,2,1,\"'\")");

		oParser = new parserFormula( "ADDRESS(2,3,,,1)", "A2", ws );
		ok( oParser.parse(), "ADDRESS(2,3,,,1)" );
		strictEqual( oParser.calculate().getValue(), "'1'!$C$2", "ADDRESS(2,3,,,1)");

		oParser = new parserFormula( "ADDRESS(2,3,1,,1)", "A2", ws );
		ok( oParser.parse(), "ADDRESS(2,3,1,,1)" );
		strictEqual( oParser.calculate().getValue(), "'1'!$C$2", "ADDRESS(2,3,1,,1)");

		oParser = new parserFormula( "ADDRESS(2,3,2,,1)", "A2", ws );
		ok( oParser.parse(), "ADDRESS(2,3,2,,1)" );
		strictEqual( oParser.calculate().getValue(), "'1'!C$2", "ADDRESS(2,3,2,,1)");

		oParser = new parserFormula( "ADDRESS(2,3,,TRUE,1)", "A2", ws );
		ok( oParser.parse(), "ADDRESS(2,3,,TRUE,1)" );
		strictEqual( oParser.calculate().getValue(), "'1'!$C$2", "ADDRESS(2,3,,TRUE,1)");

		oParser = new parserFormula( "ADDRESS(2,3,,FALSE,1)", "A2", ws );
		ok( oParser.parse(), "ADDRESS(2,3,,FALSE,1)" );
		strictEqual( oParser.calculate().getValue(), "'1'!R2C3", "ADDRESS(2,3,,FALSE,1)");

		oParser = new parserFormula( "ADDRESS(2,3,,FALSE,1)", "A2", ws );
		ok( oParser.parse(), "ADDRESS(2,3,,FALSE,1)" );
		strictEqual( oParser.calculate().getValue(), "'1'!R2C3", "ADDRESS(2,3,,FALSE,1)");

		oParser = new parserFormula( "ADDRESS(1,7,,)", "A2", ws );
		ok( oParser.parse(), "ADDRESS(1,7,,)" );
		strictEqual( oParser.calculate().getValue(), "$G$1", "ADDRESS(1,7,,)");

		oParser = new parserFormula( "ADDRESS(1,7,,,)", "A2", ws );
		ok( oParser.parse(), "ADDRESS(1,7,,,)" );
		strictEqual( oParser.calculate().getValue(), "$G$1", "ADDRESS(1,7,,,)");

	} );

	wb.dependencyFormulas.unlockRecal();
} );
