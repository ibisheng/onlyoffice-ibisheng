/*
 * (c) Copyright Ascensio System SIA 2010-2016
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

var TOK_TYPE_NOOP = "noop";
var TOK_TYPE_OPERAND = "operand";
var TOK_TYPE_FUNCTION = "function";
var TOK_TYPE_SUBEXPR = "subexpression";
var TOK_TYPE_ARGUMENT = "argument";
var TOK_TYPE_OP_PRE = "operator-prefix";
var TOK_TYPE_OP_IN = "operator-infix";
var TOK_TYPE_OP_POST = "operator-postfix";
var TOK_TYPE_WSPACE = "white-space";
var TOK_TYPE_UNKNOWN = "unknown";

var TOK_SUBTYPE_START = "start";
var TOK_SUBTYPE_STOP = "stop";

var TOK_SUBTYPE_TEXT = "text";
var TOK_SUBTYPE_NUMBER = "number";
var TOK_SUBTYPE_LOGICAL = "logical";
var TOK_SUBTYPE_ERROR = "error";
var TOK_SUBTYPE_RANGE = "range";

var TOK_SUBTYPE_MATH = "math";
var TOK_SUBTYPE_CONCAT = "concatenate";
var TOK_SUBTYPE_INTERSECT = "intersect";
var TOK_SUBTYPE_UNION = "union";


function f_token( value, type, subtype, positionStart, positionEnd ) {
    this.value = value;
    this.type = type;
    this.subtype = subtype;
    this.positionStart = positionStart;
    this.positionEnd = positionEnd;
}

function f_tokens() {

    this.items = [];
    this.outStack = [];
    this.index = -1;

}
f_tokens.prototype.add = function ( value, type, subtype, positionStart, positionEnd ) {
    if ( !subtype ) {
        subtype = "";
    }
    token = new f_token( value, type, subtype, positionStart, positionEnd );
    this.addRef( token );
    return token;
};
f_tokens.prototype.addRef = function ( token ) {
    this.items.push( token );
};
f_tokens.prototype.reset = function () {
    this.index = -1;
};
f_tokens.prototype.BOF = function () {
    return (this.index <= 0);
};
f_tokens.prototype.EOF = function () {
    return (this.index >= (this.items.length - 1));
};
f_tokens.prototype.moveNext = function () {
    if ( this.EOF() )
        return false;
    this.index++;
    return true;
};
f_tokens.prototype.current = function () {
    if ( this.index == -1 )
        return null;
    return (this.items[this.index]);
};
f_tokens.prototype.next = function () {
    if ( this.EOF() )
        return null;
    return (this.items[this.index + 1]);
};
f_tokens.prototype.previous = function () {
    if ( this.index < 1 )
        return null;
    return (this.items[this.index - 1]);
};

function f_tokenStack() {

    this.items = [];

}
f_tokenStack.prototype.push = function ( token ) {
    this.items.push( token );
};
f_tokenStack.prototype.pop = function () {
    var token = this.items.pop();
    return (new f_token( "", token.type, TOK_SUBTYPE_STOP ));
};
f_tokenStack.prototype.token = function () {
    return ((this.items.length > 0) ? this.items[this.items.length - 1] : null);
};
f_tokenStack.prototype.value = function () {
    return ((this.token()) ? this.token().value : "");
};
f_tokenStack.prototype.type = function () {
    return ((this.token()) ? this.token().type : "");
};
f_tokenStack.prototype.subtype = function () {
    return ((this.token()) ? this.token().subtype : "");
};

function getTokens( formula ) {

    var tokens = new f_tokens();
    var tokenStack = new f_tokenStack();

    var offset = 0;

    var currentChar = function () {
        return formula.substr( offset, 1 );
    };
    var doubleChar = function () {
        return formula.substr( offset, 2 );
    };
    var nextChar = function () {
        return formula.substr( offset + 1, 1 );
    };
    var EOF = function () {
        return (offset >= formula.length);
    };

    var token = "";

    var inString = false;
    var inPath = false;
    var inRange = false;
    var inError = false;

    var parenthesisCount = 0;

    while ( formula.length > 0 ) {
        if ( formula.substr( 0, 1 ) == " " ){
            formula = formula.substr( 1 );
        }
        else {
            if ( formula.substr( 0, 1 ) == "=" ){
                formula = formula.substr( 1 );
            }
            break;
        }
    }

    var regexSN = /^[1-9]{1}(\.[0-9]+)?E{1}$/;

    while ( !EOF() ) {

        // state-dependent character evaluation (order is important)

        // double-quoted strings
        // embeds are doubled
        // end marks token

        if ( inString ) {
            if ( currentChar() == "\"" ) {
                if ( nextChar() == "\"" ) {
                    token += "\"";
                    offset += 1;
                }
                else {
                    inString = false;
                    tokens.add( token, TOK_TYPE_OPERAND, TOK_SUBTYPE_TEXT, offset-token.length+1, offset );
                    token = "";
                }
            }
            else {
                token += currentChar();
            }
            offset += 1;
            continue;
        }

        // single-quoted strings (links)
        // embeds are double
        // end does not mark a token

        if ( inPath ) {
            if ( currentChar() == "'" ) {
                if ( nextChar() == "'" ) {
                    token += "'";
                    offset += 1;
                }
                else {
                    inPath = false;
                }
            }
            else {
                token += currentChar();
            }
            offset += 1;
            continue;
        }

        // bracked strings (range offset or linked workbook name)
        // no embeds (changed to "()" by Excel)
        // end does not mark a token

        if ( inRange ) {
            if ( currentChar() == "]" ) {
                inRange = false;
            }
            token += currentChar();
            offset += 1;
            continue;
        }

        // error values
        // end marks a token, determined from absolute list of values

        if ( inError ) {
            token += currentChar();
            offset += 1;
            if ( (",#NULL!,#DIV/0!,#VALUE!,#REF!,#NAME?,#NUM!,#N/A,").indexOf( "," + token + "," ) != -1 ) {
                inError = false;
                tokens.add( token, TOK_TYPE_OPERAND, TOK_SUBTYPE_ERROR, offset-token.length+1, offset );
                token = "";
            }
            continue;
        }

        // scientific notation check

        if ( ("+-").indexOf( currentChar() ) != -1 ) {
            if ( token.length > 1 ) {
                if ( token.match( regexSN ) ) {
                    token += currentChar();
                    offset += 1;
                    continue;
                }
            }
        }

        // independent character evaulation (order not important)

        // establish state-dependent character evaluations

        if ( currentChar() == "\"" ) {
            if ( token.length > 0 ) {
                // not expected
                tokens.add( token, TOK_TYPE_UNKNOWN, undefined, offset-token.length+1, offset );
                token = "";
            }
            inString = true;
            offset += 1;
            continue;
        }

        if ( currentChar() == "'" ) {
            if ( token.length > 0 ) {
                // not expected
                tokens.add( token, TOK_TYPE_UNKNOWN, undefined, offset-token.length+1, offset );
                token = "";
            }
            inPath = true;
            offset += 1;
            continue;
        }

        if ( currentChar() == "[" ) {
            inRange = true;
            token += currentChar();
            offset += 1;
            continue;
        }

        if ( currentChar() == "#" ) {
            if ( token.length > 0 ) {
                // not expected
                tokens.add( token, TOK_TYPE_UNKNOWN, undefined, offset-token.length+1, offset );
                token = "";
            }
            inError = true;
            token += currentChar();
            offset += 1;
            continue;
        }

        // mark start and end of arrays and array rows

        if ( currentChar() == "{" ) {
            if ( token.length > 0 ) {
                // not expected
                tokens.add( token, TOK_TYPE_UNKNOWN, undefined, offset-token.length+1, offset );
                token = "";
            }
            tokenStack.push( tokens.add( "ARRAY", TOK_TYPE_FUNCTION, TOK_SUBTYPE_START, offset-token.length+1, offset ) );
            tokenStack.push( tokens.add( "ARRAYROW", TOK_TYPE_FUNCTION, TOK_SUBTYPE_START, offset-token.length+1, offset ) );
            offset += 1;
            continue;
        }

        if ( currentChar() == ";" ) {
            if ( token.length > 0 ) {
                tokens.add( token, TOK_TYPE_OPERAND, undefined, offset-token.length+1, offset );
                token = "";
            }
            tokens.addRef( tokenStack.pop() );
            tokens.add( ",", TOK_TYPE_ARGUMENT, undefined, offset-token.length+1, offset );
            tokenStack.push( tokens.add( "ARRAYROW", TOK_TYPE_FUNCTION, TOK_SUBTYPE_START, offset-token.length+1, offset ) );
            offset += 1;
            continue;
        }

        if ( currentChar() == "}" ) {
            if ( token.length > 0 ) {
                tokens.add( token, TOK_TYPE_OPERAND, undefined, offset-token.length+1, offset );
                token = "";
            }
            tokens.addRef( tokenStack.pop() );
            tokens.addRef( tokenStack.pop() );
            offset += 1;
            continue;
        }

        // trim white-space

        if ( currentChar() == " " ) {
            if ( token.length > 0 ) {
                tokens.add( token, TOK_TYPE_OPERAND, undefined, offset-token.length+1, offset );
                token = "";
            }
            tokens.add( "", TOK_TYPE_WSPACE, undefined, offset-token.length+1, offset );
            offset += 1;
            while ( (currentChar() == " ") && (!EOF()) ) {
                offset += 1;
            }
            continue;
        }

        // multi-character comparators

        if ( (",>=,<=,<>,").indexOf( "," + doubleChar() + "," ) != -1 ) {
            if ( token.length > 0 ) {
                tokens.add( token, TOK_TYPE_OPERAND, undefined, offset-token.length+1, offset );
                token = "";
            }
            tokens.add( doubleChar(), TOK_TYPE_OP_IN, TOK_SUBTYPE_LOGICAL, offset-token.length+1, offset );
            offset += 2;
            continue;
        }

        // standard infix operators

        if ( ("+-*/^&=><").indexOf( currentChar() ) != -1 ) {
            if ( token.length > 0 ) {
                tokens.add( token, TOK_TYPE_OPERAND, undefined, offset-token.length+1, offset );
                token = "";
            }
            tokens.add( currentChar(), TOK_TYPE_OP_IN, undefined, offset-token.length+1, offset );
            offset += 1;
            continue;
        }

        // standard postfix operators

        if ( ("%").indexOf( currentChar() ) != -1 ) {
            if ( token.length > 0 ) {
                tokens.add( token, TOK_TYPE_OPERAND, undefined, offset-token.length+1, offset );
                token = "";
            }
            tokens.add( currentChar(), TOK_TYPE_OP_POST, undefined, offset-token.length+1, offset );
            offset += 1;
            continue;
        }

        // start subexpression or function

        if ( currentChar() == "(" ) {
            if ( token.length > 0 ) {
                tokenStack.push( tokens.add( token, TOK_TYPE_FUNCTION, TOK_SUBTYPE_START, offset-token.length+1, offset ) );
                token = "";
            }
            else {
                tokenStack.push( tokens.add( "", TOK_TYPE_SUBEXPR, TOK_SUBTYPE_START, offset-token.length+1, offset ) );
            }
            offset += 1;
            parenthesisCount++;
            continue;
        }

        // function, subexpression, array parameters

        if ( currentChar() == "," ) {
            if ( token.length > 0 ) {
                tokens.add( token, TOK_TYPE_OPERAND, undefined, offset-token.length+1, offset );
                token = "";
            }
            if ( !(tokenStack.type() == TOK_TYPE_FUNCTION) ) {
                tokens.add( currentChar(), TOK_TYPE_OP_IN, TOK_SUBTYPE_UNION, offset-token.length+1, offset );
            }
            else {
                tokens.add( currentChar(), TOK_TYPE_ARGUMENT, undefined, offset-token.length+1, offset );
            }
            offset += 1;
            continue;
        }

        // stop subexpression

        if ( currentChar() == ")" ) {
            if ( token.length > 0 ) {
                tokens.add( token, TOK_TYPE_OPERAND, undefined, offset-token.length+1, offset );
                token = "";
            }

            parenthesisCount--;

            if( parenthesisCount >= 0 ){
                tokens.addRef( tokenStack.pop() );
            }
            offset += 1;
            continue;
        }

        // token accumulation

        token += currentChar();
        offset += 1;

    }

    // dump remaining accumulation

    if ( token.length > 0 )
        tokens.add( token, TOK_TYPE_OPERAND, undefined, offset-token.length+1, offset );

    // move all tokens to a new collection, excluding all unnecessary white-space tokens

    var tokens2 = new f_tokens();

    while ( tokens.moveNext() ) {

        token = tokens.current();

        if ( token.type == TOK_TYPE_WSPACE ) {
            if ( (tokens.BOF()) || (tokens.EOF()) ) {
            }
            else if ( !(
                ((tokens.previous().type == TOK_TYPE_FUNCTION) && (tokens.previous().subtype == TOK_SUBTYPE_STOP)) ||
                    ((tokens.previous().type == TOK_TYPE_SUBEXPR) && (tokens.previous().subtype == TOK_SUBTYPE_STOP)) ||
                    (tokens.previous().type == TOK_TYPE_OPERAND)
                )
                ) {
            }
            else if ( !(
                ((tokens.next().type == TOK_TYPE_FUNCTION) && (tokens.next().subtype == TOK_SUBTYPE_START)) ||
                    ((tokens.next().type == TOK_TYPE_SUBEXPR) && (tokens.next().subtype == TOK_SUBTYPE_START)) ||
                    (tokens.next().type == TOK_TYPE_OPERAND)
                )
                ) {
            }
            else
                tokens2.add( token.value, TOK_TYPE_OP_IN, TOK_SUBTYPE_INTERSECT );
            continue;
        }

        tokens2.addRef( token );

    }

    // switch infix "-" operator to prefix when appropriate, switch infix "+" operator to noop when appropriate, identify operand
    // and infix-operator subtypes, pull "@" from in front of function names

    while ( tokens2.moveNext() ) {

        token = tokens2.current();

        if ( (token.type == TOK_TYPE_OP_IN) && (token.value == "-") ) {
            if ( tokens2.BOF() ) {
                token.type = TOK_TYPE_OP_PRE;
            }
            else if (
                ((tokens2.previous().type == TOK_TYPE_FUNCTION) && (tokens2.previous().subtype == TOK_SUBTYPE_STOP)) ||
                    ((tokens2.previous().type == TOK_TYPE_SUBEXPR) && (tokens2.previous().subtype == TOK_SUBTYPE_STOP)) ||
                    (tokens2.previous().type == TOK_TYPE_OP_POST) ||
                    (tokens2.previous().type == TOK_TYPE_OPERAND)
                ) {
                token.subtype = TOK_SUBTYPE_MATH;
            }
            else {
                token.type = TOK_TYPE_OP_PRE;
            }
            continue;
        }

        if ( (token.type == TOK_TYPE_OP_IN) && (token.value == "+") ) {
            if ( tokens2.BOF() ) {
                token.type = TOK_TYPE_NOOP;
            }
            else if (
                ((tokens2.previous().type == TOK_TYPE_FUNCTION) && (tokens2.previous().subtype == TOK_SUBTYPE_STOP)) ||
                    ((tokens2.previous().type == TOK_TYPE_SUBEXPR) && (tokens2.previous().subtype == TOK_SUBTYPE_STOP)) ||
                    (tokens2.previous().type == TOK_TYPE_OP_POST) ||
                    (tokens2.previous().type == TOK_TYPE_OPERAND)
                ) {
                token.subtype = TOK_SUBTYPE_MATH;
            }
            else {
                token.type = TOK_TYPE_NOOP;
            }
            continue;
        }

        if ( (token.type == TOK_TYPE_OP_IN) && (token.subtype.length == 0) ) {
            if ( ("<>=").indexOf( token.value.substr( 0, 1 ) ) != -1 ) {
                token.subtype = TOK_SUBTYPE_LOGICAL;
            }
            else if ( token.value == "&" ) {
                token.subtype = TOK_SUBTYPE_CONCAT;
            }
            else {
                token.subtype = TOK_SUBTYPE_MATH;
            }
            continue;
        }

        if ( (token.type == TOK_TYPE_OPERAND) && (token.subtype.length == 0) ) {
            if ( isNaN( parseFloat( token.value ) ) ) {
                if ( (token.value == 'TRUE') || (token.value == 'FALSE') ) {
                    token.subtype = TOK_SUBTYPE_LOGICAL;
                }
                else {

                    token.subtype = TOK_SUBTYPE_RANGE;
                }
            }
            else {
                token.subtype = TOK_SUBTYPE_NUMBER;
            }
            continue;
        }

        if ( token.type == TOK_TYPE_FUNCTION ) {
            if ( token.value.substr( 0, 1 ) == "@" ) {
                token.value = token.value.substr( 1 );
            }
            continue;
        }

    }

    tokens2.reset();

    // move all tokens to a new collection, excluding all noops

    tokens = new f_tokens();

    while ( tokens2.moveNext() ) {
        if ( tokens2.current().type != TOK_TYPE_NOOP ) {
            tokens.addRef( tokens2.current() );
        }
    }

    tokens.reset();

    return tokens;
}