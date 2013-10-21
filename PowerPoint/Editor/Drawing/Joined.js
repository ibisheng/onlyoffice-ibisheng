var min_distance_joined=2;
function JoinedH(shape1, shape2)
{
    var l, r, l2, r2;
    l=shape1.x;
    r=l+shape1.extX;

    l2=shape2.x;
    r2=l2+shape2.extX;

    var d=l-l2;
    if(Math.abs(d)<min_distance_joined)
    {
        return d;
    }

    d=l-r2;
    if(Math.abs(d)<min_distance_joined)
    {
        return d;
    }


    d=r-l2;
    if(Math.abs(d)<min_distance_joined)
    {
        return d;
    }

    d=r-r2;
    if(Math.abs(d)<min_distance_joined)
    {
        return d;
    }

    return 0;
}

function JoinedV(shape1, shape2)
{
    var t, b, t2, b2;
    t=shape1.y;
    b=t+shape1.extY;

    t2=shape2.y;
    b2=t2+shape2.extY;

    var d=t-t2;
    if(Math.abs(d)<min_distance_joined)
    {
        return d;
    }

    d=t-b2;
    if(Math.abs(d)<min_distance_joined)
    {
        return d;
    }


    d=b-t2;
    if(Math.abs(d)<min_distance_joined)
    {
        return d;
    }

    d=b-b2;
    if(Math.abs(d)<min_distance_joined)
    {
        return d;
    }

    return 0;
}


function JoinedPointH(X, shape2)
{
    var l2, r2;
    l2=shape2.x;
    r2=l2+shape2.extX;

    var d=X-l2;
    if(Math.abs(d)<min_distance_joined)
    {
        return d;
    }

    d=X-r2;
    if(Math.abs(d)<min_distance_joined)
    {
        return d;
    }

    return 0;
}

function JoinedPointV(Y, shape2)
{
    var t2, b2;
    t2=shape2.y;
    b2=t2+shape2.extY;

    var d=Y-t2;
    if(Math.abs(d)<min_distance_joined)
    {
        return d;
    }

    d=Y-b2;
    if(Math.abs(d)<min_distance_joined)
    {
        return d;
    }

    return 0;
}