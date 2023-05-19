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


export function rgb2hsv(r, g, b) {
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, s, v = max;
  
    let d = max - min;
    s = max === 0 ? 0 : d / max;
  
    if (max === min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
  
    return [h, s, v];
}

export function hsv2rgb(h, s, v) {
    let r, g, b;
  
    let i = Math.floor(h * 6);
    let f = h * 6 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);
  
    switch (i % 6) {
        case 0:
            r = v, g = t, b = p;
            break;
        case 1:
            r = q, g = v, b = p;
            break;
        case 2:
            r = p, g = v, b = t;
            break;
        case 3:
            r = p, g = q, b = v;
            break;
        case 4:
            r = t, g = p, b = v;
            break;
        case 5:
            r = v, g = p, b = q;
            break;
    }
  
    return [r, g, b];
}