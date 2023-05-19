import {rand, setColor, rect, map, power, formatColor} from '../utils/utils.js';
import {noise} from '../utils/noise.js';

export function createDrawing(ctx, options){
    let dw = 1024;
    let dh = Math.round(dw*options.resy/options.resx);
    if(options.format === 'landscape'){
        dh = 1024;
        dw = Math.round(dh*options.resx/options.resy);
    }
    let baseDrawing = document.createElement('canvas');
    baseDrawing.width = dw;
    baseDrawing.height = dh;
    baseDrawing.id = 'd'; 
    ctx = baseDrawing.getContext('2d');
    let resetTransform = ctx.resetTransform;
    let translate = ctx.translate;
    let rotate = ctx.rotate;
    let palette = options.palette;

    
    // let ncolors = Math.floor(rand(5, palette.length));
    // ncolors = Math.floor(rand(10, 13));
    // let maxStartIndex = palette.length - ncolors;
    // let startIndex = Math.floor(prng.rand() * (maxStartIndex + 1));
    // palette = palette.slice(startIndex, startIndex + ncolors);

    setColor(ctx, .0, .0, .0);
    ctx.save();
    ctx.translate(dw/2, dh/2);
    rect(ctx, dw, dh);
    ctx.restore();
    
    let r = rand(10, 35);
    let nn = map(power(prng.rand(), 4.), 0, 1, 210, 2200);
    nn = 144;
    let maxdist = Math.sqrt(Math.pow(dw/2, 2)+Math.pow(dh/2, 2));

    let allpoints = [];

    let frq = prng.rand() < .5 ? rand(.008, .015) : rand(.03, .06);
    for(let k = 0; k < options.shapecount; k++){
        let px = prng.rand();
        let py = prng.rand();
        py = Math.pow(py, 1);
        let kk = Math.floor(k/2) + (k%2)*.1;
        kk = k;
        px = power(noise(kk*frq, 13.41), 3);
        py = power(noise(kk*frq, 66.41), 3);
        let x = map(px, 0, 1, 0, dw);
        let y = map(py, 0, 1, 0, dh);
        allpoints.push({x, y});
    }
    // normalize with respect to dw and dh
    let minx, miny, maxx, maxy;
    minx = miny = 1e9;
    maxx = maxy = -1e9;
    for(let k = 0; k < options.shapecount; k++){
        let {x, y} = allpoints[k];
        if(x < minx) minx = x;
        if(x > maxx) maxx = x;
        if(y < miny) miny = y;
        if(y > maxy) maxy = y;
    }
    
    let siize = rand(50, 100);
    let brd = siize*1.4;
    for(let k = 0; k < options.shapecount; k++){
        let {x, y} = allpoints[k];
        x = map(x, minx, maxx, brd, dw-brd);
        y = map(y, miny, maxy, brd, dh-brd);
        allpoints[k] = {x, y};
    }

    let slicedPalette = palette;
    let gradientVisibility = rand(.3, 1.);
    let pidx3 = map(Math.pow(prng.rand(), 2), 0, 1, 0, slicedPalette.length);
    let color3 = slicedPalette[Math.floor(pidx3+slicedPalette.length)%slicedPalette.length];
    for(let k = 0; k < options.shapecount; k++){
        let pidx = map(Math.pow(prng.rand(), 1), 0, 1, 0, slicedPalette.length);
        let pidx2 = map(Math.pow(prng.rand(), 2), 0, 1, 0, slicedPalette.length);
        // chosenindices.push(pidx);
        pidx2 = pidx + 1;
        let color = slicedPalette[Math.floor(pidx+slicedPalette.length)%slicedPalette.length];
        let color2 = [0,0,0];
        color2[0] = color[0]*(1-gradientVisibility);
        color2[1] = color[1]*(1-gradientVisibility);
        color2[2] = color[2]*(1-gradientVisibility);
        color2 = slicedPalette[Math.floor(pidx2+slicedPalette.length)%slicedPalette.length];
        color2[0] = color[0]*(1-gradientVisibility) + gradientVisibility*color2[0];
        color2[1] = color[1]*(1-gradientVisibility) + gradientVisibility*color2[1];
        color2[2] = color[2]*(1-gradientVisibility) + gradientVisibility*color2[2];
        // let px = prng.rand();
        // let py = prng.rand();
        // py = Math.pow(py, 1);
        // let kk = Math.floor(k/2) + (k%2)*.1;
        // kk = k;
        // px = power(noise(kk*.04, 13.41), 3);
        // py = power(noise(kk*.04, 66.41), 3);
        // let x = map(px, 0, 1, 0, dw);
        // let y = map(py, 0, 1, 0, dh);
        let {x, y} = allpoints[k];

        let dist = Math.sqrt(Math.pow(x-dw/2, 2)+Math.pow(y-dh/2, 2));

        // if(k%3 == 0)
        //     setColor(ctx, 0, 0, 0);
        ctx.save();
        ctx.translate(x, y);
        //ctx.rotate(y/dh*Math.PI*1);
        // ctx.rotate(13);
        let ang = rand(0, 110) + y/dh*Math.PI*2
        ctx.rotate(ang);

        //rect(rand(122, 333), rand(35, 37));
        
        // if(k%2==0)
        //rect(rand(188, 366), rand(15, 17));
        //rect(rand(88, 133), rand(188, 333));
        //rect(22, 522);
        r = siize+1*prng.rand();
        r = map(dist, 0, maxdist, 0, 1);
        r = map(Math.pow(r, 3), 0, 1, siize+rand(-30,30), 500+rand(-100, 100));
        r = siize;
        setColor(ctx, color3[0], color3[1], color3[2], 1.);
        rect(ctx, 10.*siize, siize);
        ctx.rotate(.031*rand(-1, 1));
        
        let gradient = ctx.createLinearGradient(2*r*Math.cos(-ang), 2*r*Math.sin(-ang), -2*r*Math.cos(-ang), -2*r*Math.sin(-ang));
        gradient.addColorStop(0, formatColor(color));
        //     gradient.addColorStop(sstop, formatColor(slicedPalette[Math.floor(rand(0,slicedPalette.length))%slicedPalette.length]));
        gradient.addColorStop(1, formatColor(color2));
        if(options.hasGradient)
            ctx.fillStyle = gradient;
        else
            ctx.fillStyle = formatColor(color);
        rect(ctx, 10.*siize, siize);
        // ctx.beginPath();
        // ctx.arc(0, 0, r, 0, 2 * Math.PI);
        //ctx.fill();

        ctx.restore();
    }

    return baseDrawing;
}