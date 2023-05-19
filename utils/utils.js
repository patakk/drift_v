export function power(p, g) {
    if (p < 0.5)
        return 0.5 * Math.pow(2*p, g);
    else
        return 1 - 0.5 * Math.pow(2*(1 - p), g);
}

export function setColor(ctx, r, g, b, a=1){
    ctx.fillStyle = 'rgba(' + Math.round(r*255) + ',' + Math.round(g*255) + ',' + Math.round(b*255) + ',' + a + ')';
    ctx.strokeStyle = 'rgba(' + Math.round(r*255) + ',' + Math.round(g*255) + ',' + Math.round(b*255) + ',' + a + ')';
}

export function formatColor(color){
    return 'rgba(' + Math.round(color[0]*255) + ',' + Math.round(color[1]*255) + ',' + Math.round(color[2]*255) + ',' + 1 + ')';
}

export function rect(ctx, w, h){
    ctx.fillRect(-w/2, -h/2, w, h);
}


export function rand(a, b){
    return a + prng.rand()*(b-a);
}

export function map(x, v1, v2, v3, v4){
    return (x-v1)/(v2-v1)*(v4-v3)+v3;
}
export function colorLightness(r, g, b){
    return 0.2126*r + 0.7152*g + 0.0722*b;
}