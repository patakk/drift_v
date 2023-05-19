import {rand, setColor, rect, map, formatColor, power} from '../utils/utils.js';

function generateRandomPoint(width, height) {
    const x = prng.rand() * width;
    const y = prng.rand() * height;
    return { x, y };
}

function isCircleInsideArea(circle, width, height) {
    return (
        circle.x - circle.radius >= 0 &&
        circle.y - circle.radius >= 0 &&
        circle.x + circle.radius <= width &&
        circle.y + circle.radius <= height
        );
}
    
function circlesOverlap(circleA, circleB) {
    const dx = circleA.x - circleB.x;
    const dy = circleA.y - circleB.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < circleA.radius + circleB.radius;
}

function circlePacking(width, height, N, minr=50, maxr=60) {
    const circles = [];
    const maxAttempts = 1000;
    
    for (let i = 0; i < N; i++) {
        let circle;
        let validCircle = false;
        let attempts = 0;
        
        while (!validCircle && attempts < maxAttempts) {
            let rrr = rand(minr, maxr);
            // rrr = rand(12, 13);
            // if(i == 0)
            //   rrr = 222;
            circle = {
                x: 0,
                y: 0,
                radius: rrr, // Adjust the maximum circle radius as needed
                ...generateRandomPoint(width, height),
            };
            
            validCircle = isCircleInsideArea(circle, width, height) && !circles.some((c) => circlesOverlap(circle, c));
            attempts++;
        }
        
        if (validCircle) {
            circles.push(circle);
        }
    }
    
    return circles;
}

export function createDrawing(ctx, options){
    let dw = 1024;
    let dh = Math.round(dw*options.resy/options.resx);
    let brdx = options.border*dw/options.simx;
    let brdy = options.border*dh/options.simy;
    let baseDrawing = document.createElement('canvas');
    baseDrawing.width = dw;
    baseDrawing.height = dh;
    baseDrawing.id = 'd'; 
    ctx = baseDrawing.getContext('2d');
    let resetTransform = ctx.resetTransform;
    let translate = ctx.translate;
    let rotate = ctx.rotate;
    let palette = options.palette;
    // palette = palettes[31]
    // palette = palettes[Math.floor(prng.rand()*palettes.length)];
    
    setColor(ctx, .0, .0, .0);
    ctx.save();
    ctx.translate(dw/2, dh/2);
    rect(ctx, dw, dh);
    ctx.restore();
    
    let nn = options.shapecount;
    nn = 1666;
    let sq2 = 1/Math.sqrt(2);
    let minr = prng.rand() < -.5 ? rand(10, 20) : rand(100, 200);
    let maxr = prng.rand() < -.15 ? rand(3, 10) : rand(100, 300);
    maxr += minr;
    let circles = circlePacking(dw-2*brdx, dh-2*brdy, nn, minr, maxr);
    // circles = circles.concat(circlePacking(dw, dh, nn/33));
    
    let r = 23+13*prng.rand();
    
    let shapeBias = .5;
    let chc = Math.floor(rand(0, 3));
    if(chc == 0)
    shapeBias = rand(.0, .1);
    else if(chc == 1)
    shapeBias = rand(.9, 1.0);
    else if(chc == 2)
    shapeBias = rand(.1, .9);
    
    for(let k = 0; k < circles.length; k++){
        let pidx = map(Math.pow(prng.rand(), 2), 0, 1, 0, palette.length);
        let pidx2 = map(Math.pow(prng.rand(), 2), 0, 1, 0, palette.length);
        let color = palette[Math.floor(pidx+palette.length)%palette.length];
        let color2 = palette[Math.floor(pidx2+palette.length)%palette.length];
        let px = prng.rand();
        let py = prng.rand();
        py = power(py, 3);
        let x = map(px, 0, 1, 0, dw);
        let y = map(py, 0, 1, 0, dh);
        let ang = y/dh*Math.PI*2;
        ang = rand(0,100);
        r = 22+1*prng.rand();
        
        x = circles[k].x+brdx;
        y = circles[k].y+brdy;
        r = circles[k].radius;
        
        // if(k%3 == 0)
        //     setColor(ctx, 0, 0, 0);
        ctx.save();
        ctx.translate(x, y);
        //ctx.rotate(y/dh*Math.PI*1);
        // ctx.rotate(13);
        ctx.rotate(rand(0, 110));
        
        ctx.rotate(ang);
        //rect(rand(122, 333), rand(35, 37));
        
        
        let gradient = ctx.createLinearGradient(r*Math.cos(-ang), r*Math.sin(-ang), -r*Math.cos(-ang), -r*Math.sin(-ang));
        gradient.addColorStop(0, formatColor(color));
        gradient.addColorStop(1, formatColor(color2));
        if(options.hasGradient)
            ctx.fillStyle = gradient;
        else
            ctx.fillStyle = formatColor(color);
        
        if(prng.rand() < shapeBias){
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, 2 * Math.PI);
            ctx.fill();
        }
        else{
            ctx.fillRect(-sq2*r, -sq2*r, sq2*r*2, sq2*r*1);
        }
        
        ctx.restore();
    }
    
    return baseDrawing;
}