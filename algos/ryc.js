import {rand, setColor, rect, map, formatColor} from '../utils/utils.js';

export function createDrawing(ctx, options){
    let dw = 1024;
    let dh = Math.round(dw*options.resy/options.resx);
    let baseDrawing = document.createElement('canvas');
    baseDrawing.width = dw;
    baseDrawing.height = dh;
    baseDrawing.id = 'd'; 
    ctx = baseDrawing.getContext('2d');
    let resetTransform = ctx.resetTransform;
    let translate = ctx.translate;
    let rotate = ctx.rotate;
    const palette = options.palette;

    setColor(ctx, .0, .0, .0);
    ctx.save();
    ctx.translate(dw/2, dh/2);
    rect(ctx, dw, dh);
    ctx.restore();

    let gradientVisibility = .5;
    if(prng.rand() < .25){
        gradientVisibility = rand(.2, .3);
    }
    else{
        gradientVisibility = rand(.5, .94);
    }
    let gradientType = Math.floor(2);
    gradientType = 0;
    gradientVisibility = .5;
    gradientVisibility = rand(.05, .1);
    gradientVisibility = rand(.505, .81)*.5;
    

    let r = 123+13*prng.rand();
    let ncolors = Math.floor(rand(5, palette.length));
    let maxStartIndex = palette.length - ncolors;
    let startIndex = Math.floor(prng.rand() * (maxStartIndex + 1));

    // console.log('n colors in palette:', ncolors);
    let shapesBias = prng.rand();
    let biasChoice = Math.floor(prng.rand()*3);
    if(biasChoice == 0)
        shapesBias = 0;
    else if(biasChoice == 1)
        shapesBias = 1;
    else
        shapesBias = prng.rand();

    let overallscale = rand(1,3);
    let rectangular = prng.rand() > .85;
    overallscale = 3;
    // let chosenindices = [];
    let averageColor = [0,0,0];
    let pidx2 = map(Math.pow(prng.rand(), 1), 0, 1, 0, palette.length);
    for(let k = 0; k < options.shapecount; k++){
        let shapeType = prng.rand() > shapesBias ? 0 : 1;
        let pidx = map(Math.pow(prng.rand(), 1), 0, 1, 0, palette.length);
        // chosenindices.push(pidx);
        // pidx2 = map(Math.pow(prng.rand(), 1), 0, 1, 0, palette.length);
        // pidx2 = pidx + 1;
        let pidx3 = map(Math.pow(prng.rand(), 1), 0, 1, 0, palette.length);
        let color = palette[Math.floor(pidx+palette.length)%palette.length];
        let color3 = palette[Math.floor(pidx3+palette.length)%palette.length];
        let color2 = [0,0,0];
        color2[0] = color[0]*(1-gradientVisibility);
        color2[1] = color[1]*(1-gradientVisibility);
        color2[2] = color[2]*(1-gradientVisibility);
        if(gradientType == 0)
            color2 = [...palette[Math.floor(pidx2+palette.length)%palette.length]];
        color2[0] = color[0]*(1-gradientVisibility) + gradientVisibility*color2[0];
        color2[1] = color[1]*(1-gradientVisibility) + gradientVisibility*color2[1];
        color2[2] = color[2]*(1-gradientVisibility) + gradientVisibility*color2[2];
        let px = prng.rand();
        let py = prng.rand();
        py = Math.pow(py, 1);
        let x = map(px, 0, 1, 0, dw);
        let y = map(py, 0, 1, 0, dh);
        let ang = y/dh*Math.PI*2*0;
        let rang = rand(0, 110);
        if(rectangular)
            rang = Math.floor(rand(0, 4))*90/180*Math.PI;


        averageColor[0] += color[0];
        averageColor[1] += color[1];
        averageColor[2] += color[2];
        setColor(ctx, color[0], color[1], color[2], 1.);
        // if(k%3 == 0)
        //     setColor(ctx, 0, 0, 0);
        let rw = rand(122, 433)*overallscale;
        let rh = rand(35, 99)*overallscale;
        let gradient;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rang+rand(-.1,.1));
        ctx.rotate(ang);
        gradient = ctx.createLinearGradient(2*r*Math.cos(-ang+3.14), 2*r*Math.sin(-ang+3.14), -2*r*Math.cos(-ang+3.14), -2*r*Math.sin(-ang+3.14));
        // gradient.addColorStop(0, formatColor([color[0]*1.3, color[1]*1.3, color[2]*1.3]));
        // gradient.addColorStop(0, formatColor(color));
        // gradient.addColorStop(1, formatColor(color2));
        // ctx.fillStyle = gradient;
        ctx.fillStyle = formatColor([color3[0]*1.3, color3[1]*1.3, color3[2]*1.3]);
        ctx.lineWidth = 11;
        if(shapeType == 0){
            ctx.beginPath();
            ctx.arc(0, 0, (rw+rh)/4, 0, 2 * Math.PI);
            // ctx.lineWidth = 11;
            // ctx.stroke();
            ctx.fill();
        }
        else
            ctx.fillRect(-(rw+1)/2, -(rh+1)/2, (rw+1), (rh+1));
        ctx.restore();

        ctx.save();
        ctx.translate(x, y);
        //ctx.rotate(y/dh*Math.PI*1);
        // ctx.rotate(13);
        ctx.rotate(rang);
        ctx.rotate(ang);
        gradient = ctx.createLinearGradient(2*r*Math.cos(-ang), 2*r*Math.sin(-ang), -2*r*Math.cos(-ang), -2*r*Math.sin(-ang));
        gradient.addColorStop(0, formatColor(color));
        // for(let sstop = 1./100; sstop < 1; sstop+=1./100)
        //     gradient.addColorStop(sstop, formatColor(palette[Math.floor(rand(0,palette.length))%palette.length]));
        gradient.addColorStop(1, formatColor(color2));
        if(options.hasGradient)
            ctx.fillStyle = gradient;
        else
            ctx.fillStyle = formatColor(color);
        if(shapeType == 0){
            ctx.beginPath();
            ctx.arc(0, 0, (rw+rh)/4, 0, 2 * Math.PI);
            // ctx.lineWidth = 11;
            // ctx.stroke();
            ctx.fill();
        }
        else{
            ctx.fillRect(-rw/2, -rh/2, rw, rh);
        }
        ctx.restore();
        
        
        // ctx.save();
        // ctx.translate(dw-x, y);
        // ctx.scale(-1, 1);
        // //ctx.rotate(y/dh*Math.PI*1);
        // // ctx.rotate(13);
        // ctx.rotate(rang);
        // ctx.rotate(ang);
        // gradient = ctx.createLinearGradient(2*r*Math.cos(-ang), 2*r*Math.sin(-ang), -2*r*Math.cos(-ang), -2*r*Math.sin(-ang));
        // gradient.addColorStop(0, formatColor(color3));
        // // for(let sstop = 1./100; sstop < 1; sstop+=1./100)
        // //     gradient.addColorStop(sstop, formatColor(palette[Math.floor(rand(0,palette.length))%palette.length]));
        // gradient.addColorStop(1, formatColor(color));
        // ctx.fillStyle = gradient;
        // if(shapeType == 0){
        //     ctx.beginPath();
        //     ctx.arc(0, 0, (rw+rh)/4, 0, 2 * Math.PI);
        //     ctx.fill();
        // }
        // else
        //     ctx.fillRect(-rw/2, -rh/2, rw, rh);
        // ctx.restore();
    }
    // find most common index
    // let mostCommonIndex = 0;
    // let mostCommonOccurences = 0;
    // for(let k = 0; k < chosenindices.length; k++){
    //     let occurences = 0;
    //     for(let j = 0; j < chosenindices.length; j++){
    //         if(chosenindices[j] == chosenindices[k])
    //             occurences++;
    //     }
    //     if(occurences > mostCommonOccurences){
    //         mostCommonOccurences = occurences;
    //         mostCommonIndex = chosenindices[k];
    //     }
    // }
    // options.commonColor = palette[Math.floor(mostCommonIndex+palette.length)%palette.length];
    
    averageColor[0] /= options.shapecount;
    averageColor[1] /= options.shapecount;
    averageColor[2] /= options.shapecount;
    options.commonColor = averageColor;


    return baseDrawing;
}