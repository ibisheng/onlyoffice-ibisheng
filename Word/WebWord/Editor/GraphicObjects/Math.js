/**
 * Created by JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 2/24/12
 * Time: 10:06 AM
 * To change this template use File | Settings | File Templates.
 */
var cToRad = Math.PI/(60000*180);
var cToDeg = 1/cToRad;

function Cos(angle)
{
    return Math.cos(cToRad*angle);
}

function Sin(angle)
{
    return Math.sin(cToRad*angle);
}

function Tan(angle)
{
    return Math.tan(cToRad*angle);
}

function ATan(x)
{
    return cToDeg*Math.atan(x);
}

function ATan2(y, x)
{
    return  cToDeg*Math.atan2(y, x);
}

function CAt2(x, y, z)
{
    return  x*(Math.cos(Math.atan2(z, y)));
}

function SAt2(x, y, z)
{
    return  x*(Math.sin(Math.atan2(z, y)));
}