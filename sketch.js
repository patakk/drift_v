import { rand, power, map, colorLightness } from './utils/utils.js';
import { noiseSeed } from './utils/noise.js';
import { getShaderSource, createShader, createProgram } from './utils/webglutils.js';

let canvas;
let gl;
let ctx;
let program;
let backgroundProgram;

let palettes;
let bacgkroundPalette;

let frameBuffer;
let framebufferTexture;

let backgroundPositionBuffer;
let positionBuffer;
// let colorBuffer;
let seedBuffer;
let indicesBuffer;
let particles;
let baseDrawingTexture;
let utilsCode;
let computeCode;
let vertexCode;
let textureFragmentCode;

let backgroundFragmentCode;
let backgroundVertexCode;
let backgroundFragmentShader;
let textureFragmentShader;
let backgroundVertexShader;
let backgroundFragmentSource;
let backgroundVertexSource;
let textureFragmentSource;

let renderingDone = false;

let fragmentCode;
let vertexShader;
let fragmentShader;
let baseDrawing;

let quadBuffer;
let keyRenderScale = null;

let shouldSave = false;
let shouldReset = false;

let options;

let monos;
let various;
let combinations;
let combChoice;
let backgroundChoice;
let baseChoice;
let combination;
let createDrawing;
let coloringChoice;
let computeShaderSource;
let simulateShaderSource;
let fragmentShaderSource;
let utilsShaderSource;

let imgElement;
let tempCanvas;

let keyScale = -1;
let u_pointsize;
let u_color1;
let u_color2;
let u_tint1;
let u_tint2;

function rgb2hsv(r, g, b) {
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

function hsv2rgb(h, s, v) {
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

function choicesInit(){
    let aspect = {x: 3, y: 4}
    let formatChoice = 'portrait';

    let simarea = Math.round(1500*2000*2.8*2.8);
    let simx = Math.floor(Math.sqrt(simarea*aspect.x/aspect.y));
    let simy = Math.floor(simarea/simx);
    
    let resarea = Math.round(1500*2000*1.5*1.5);
    let resx = Math.floor(Math.sqrt(resarea*aspect.x/aspect.y));
    let resy = Math.floor(resarea/resx);

    let resx0 = resx;
    let resy0 = resy;

    let aspectRatio = aspect.x/aspect.y;
    
    options = {
        resx: resx,
        resy: resy,
        resx0: resx0,
        resy0: resy0,
        simx: simx,
        simy: simy,
        edgeOffset: 50,
        border: 50,
        pointCount: 40000,
        steps: 100,
        globalseed: 0,
        renderScale: 2000,
        iters: 0,
        aspect: aspect,
        aspectRatio: aspectRatio,
        format: formatChoice,
        hasGradient: true,
    }
    
    various = [
        {base: 'stc', shader: 'dsrd', shapecount: rand(10, 13)},
        {base: 'bc', shader: 'pwdr', shapecount: rand(12,13)},
        {base: 'crwly', shader: 'left', shapecount: rand(30, 100)},
        {base: 'crwly', shader: 'left', shapecount: rand(20, 40)},
        {base: 'ryc', shader: 'pwdr', shapecount: 7},
        {base: 'ryc', shader: 'bdlm', shapecount: 7},
        {base: 'crwly', shader: 'pwdr', shapecount: rand(30, 160)},
        {base: 'bc', shader: 'pwdr', shapecount: rand(5,9)},
        {base: 'sc', shader: 'left', shapecount: rand(133,144)},
        {base: 'sc', shader: 'bdlm', shapecount: rand(30, 160)},
        {base: 'ryc', shader: 'pwdr', shapecount: rand(133, 144)},
        {base: 'ryc', shader: 'pwdr', shapecount: rand(5,6)},
        {base: 'stc', shader: 'pwdr', shapecount: rand(10, 14)},
        {base: 'bc', shader: 'pwdr', shapecount: rand(12, 13)},
        {base: 'crwly', shader: 'pwdr', shapecount: rand(30, 60)},
        {base: 'sc', shader: 'pwdr', shapecount: 0},
        {base: 'sc', shader: 'pwdr', shapecount: 0},
        {base: 'sc', shader: 'left', shapecount: 0},
        {base: 'sc', shader: 'left', shapecount: 0},
        {base: 'ryc', shader: 'pwdr', shapecount: rand(5,6)},
        {base: 'ryc', shader: 'pwdr', shapecount: rand(5,6)},
        {base: 'ryc', shader: 'pwdr', shapecount: rand(5,6)},
        {base: 'sc', shader: 'pwdr', shapecount: 0},
        {base: 'sc', shader: 'pwdr', shapecount: 0},
        {base: 'sc', shader: 'left', shapecount: 0},
        {base: 'sc', shader: 'left', shapecount: 0},
    ]
    options.renderScale = search.get('size');

    combChoice = 'color';
    combinations = various;

    baseChoice = Math.floor(prng.rand()*combinations.length);
    combination = combinations[baseChoice]

    if(prng.rand() < .5 && combination.coloring == 'darkish')
        combination.coloring = 'greyish';
    coloringChoice = combination.coloring;

    if(combination.base == 'ryc' && combination.shapecount > 20
    || combination.base == 'bc'){
        ///
    }
    else{
        if(prng.rand() < .2)
            combination.shader = 'wrp'
    }

    if(combination.shapecount){
        options.shapecount = combination.shapecount;
    }
     combination.shader = 'wrp';
    computeShaderSource =  `./shaders/algos/${combination.shader}.glsl`;
    simulateShaderSource =  `./shaders/simulate.glsl`;
    fragmentShaderSource = './shaders/drawing.glsl';
    utilsShaderSource = './shaders/utils.glsl';
    backgroundFragmentSource = './shaders/bgFragment.glsl';
    textureFragmentSource = './shaders/textureFragment.glsl';
    backgroundVertexSource = './shaders/bgVertex.glsl';

    options.globalseed = prng.rand();
}


function loadAlgoAndLaunch(){
    prng = Random(hash);
    random = prng.rand;

    noiseSeed(Math.floor(prng.rand()*100000));
    choicesInit();
    renderingDone = false;
    if(baseDrawing) baseDrawing.remove();
    if(imgElement) imgElement.remove();
    if(gl) gl.clear(gl.COLOR_BUFFER_BIT);
    import(`./algos/${combination.base}.js`).then(drawingmodule => {
        import(`./utils/palette.js`).then(palettemodule => {
            let gp = palettemodule.getPalette();
            palettes = gp.palettes;
            bacgkroundPalette = gp.bgpalettes[0];
            createDrawing = drawingmodule.createDrawing;
            launch();
        });
    });
}

function initParticles(){

    var positions = [];
    // var colors = [];
    var seeds = [];
    var indices = [];
    let brd = options.border;
    
    for(let k = 0; k < options.pointCount; k++){
        let x = map(prng.rand(), 0, 1, brd, options.simx-brd);
        let y = map(prng.rand(), 0, 1, brd, options.simy-brd);
        positions.push(x, y);
        let p = power(prng.rand(), 4);
        // colors.push(p, 0.1, 1.-p);
        seeds.push(prng.rand(), prng.rand(), prng.rand());
        indices.push(k);
    }
    
    return {
        positions: positions,
        // colors: colors,
        seeds: seeds,
        indices: indices,
        count: options.pointCount,
    }
}


function setupColors(){

    let niceIndices = [
        0, 1, 2, 3, 4, 5, 6,
    ]


    let paletteindex;
    paletteindex = prng.rand() < .66 ? 6 : 7;
    if(prng.rand() < .1)
        paletteindex = niceIndices[Math.floor(prng.rand()*niceIndices.length)];
    options.palette = palettes[paletteindex];
    let greyCanvasCondition = prng.rand() < .5;
    let lighCanvasCondition = prng.rand() < .5;
    let greypwdrCondition = prng.rand() < .5;
    let lighpwdrCondition = prng.rand() < .5;
    let greyMainCondition = prng.rand() < .5;
    let lightMainCondition = prng.rand() < .5;

    if(prng.rand() < .75 && greyCanvasCondition && greypwdrCondition && greyMainCondition && !lighCanvasCondition && !lighpwdrCondition && !lightMainCondition){
        lighCanvasCondition = prng.rand() < .5;
        lighpwdrCondition = prng.rand() < .5;
        lightMainCondition = prng.rand() < .5;
    }

    if(baseChoice == 10){
        while(greyCanvasCondition && greyMainCondition && !lighCanvasCondition && !lightMainCondition){
            lighCanvasCondition = prng.rand() < .5;
            lightMainCondition = prng.rand() < .5;
        }
    }

    if(paletteindex == 6 || paletteindex == 7 || paletteindex == 8){
        while(!greyCanvasCondition && !greyMainCondition && !greypwdrCondition){
            greyCanvasCondition = prng.rand() < .5;
            greyMainCondition = prng.rand() < .5;
            greypwdrCondition = prng.rand() < .5;
        }
    }

    if(greyMainCondition){
        if(lightMainCondition)
            combination.coloring = 'greyish';
        else
            combination.coloring = 'darkish';
    }
    else{
        combination.coloring = 'colorful';
    }

    let bgidx1 = Math.floor(prng.rand()*options.palette.length);
    let bgidx2 = Math.floor(prng.rand()*options.palette.length);
    while(bgidx1 === bgidx2){
        bgidx2 = Math.floor(prng.rand()*options.palette.length);
    }
    
    let bgcolorhsv = rgb2hsv(...options.palette[bgidx2]);
    let bghue = bgcolorhsv[0];
    let bgsat = bgcolorhsv[1]*0+.5;
    if(bghue > .66 && bghue < .93){
        // console.log('hue shift')
        // bgsat = .25;
    }
    
    let brdcolorhsv = rgb2hsv(...options.palette[bgidx2]);
    let brdhue = brdcolorhsv[0];
    let brdsat = brdcolorhsv[1]*0+.4;
    if(brdhue > .66 && brdhue < .93){
        console.log('hue shift')
        brdsat = .25;
    }
    bgsat = brdsat = rand(.1, .23);

    let sidepwdr = options.palette[Math.floor(rand(0, options.palette.length))];
    let backgroundColor = hsv2rgb(bghue, bgsat, rand(.55, .75));
    let borderColor = hsv2rgb(brdhue, brdsat, prng.rand()<.5?rand(.15, .22):rand(.75, .85));
    if(greyCanvasCondition){ //} && coloringChoice === 'colorful'){
        let light = colorLightness(...backgroundColor);
        light = rand(.9, 1.);
        backgroundColor = [.12*light, .12*light, .12*light];
        if(lighCanvasCondition)
            light = rand(.7, .9);
        else
            light = rand(.07, .15);
        backgroundColor = [light, light, light];
        if(lighCanvasCondition)
            light = rand(.7, .9);
        else
            light = rand(.07, .15);
        // borderColor = [light, light, light];
    }

    let mnc = prng.rand();
    let iters = 0;
    // while((mnc > 0.22 && mnc < 0.34 || mnc > 0.7 && mnc < 0.88 && combination.base != 'crwly' && combination.coloring == 'colorful') && iters++ < 100){
    //     mnc = prng.rand();
    // }

    if(greypwdrCondition){
        let light = rand(.9, 1.);
        if(lighpwdrCondition)
            light = rand(.5, .7);
        else
            light = rand(.025, .05);
        sidepwdr = [light, light, light];
    }

    u_color2 = backgroundColor;
    u_color1 = borderColor;
    u_tint1 = [...sidepwdr];
    // u_tint1 = hsv2rgb(rgb2hsv(...u_tint1)[0], .35, prng.rand()<.5?rand(.15, .22):rand(.75, .85))
    u_tint2 = [...options.palette[Math.floor(rand(0, options.palette.length))]];
    // if(prng.rand() < 1.3) u_tint2 = hsv2rgb(rgb2hsv(...u_tint2)[0], .35, prng.rand()<1.5?rand(.15, .22):rand(.75, .85))
    if(prng.rand() < 1.3) u_tint2 = hsv2rgb(rgb2hsv(...u_tint2)[0], .8, prng.rand()<1.5?rand(.15, .22):rand(.75, .85))

    options.coloring = combination.coloring;

    if(options.coloring !== 'colorful') options.palette = palettes[palettes.length-1];
    if(options.coloring === 'darkish') options.hasGradient = false;
    if(options.coloring === 'greyish') options.hasGradient = false;

}

function launch(){
    
    // console.log('hash: ', hash);
    setupColors();

    baseDrawing = createDrawing(ctx, options);
    baseDrawing.style.width = 170+'px';
    baseDrawing.style.height = 170*options.resy/options.resx+'px';
    // if(search.get('debug') === 'true')
    //     document.body.appendChild(baseDrawing);
    baseDrawing.style.position = 'absolute';
    baseDrawing.style.top = options.edgeOffset+'px';
    baseDrawing.style.left = options.edgeOffset+'px';

    if(!canvas){
        canvas = document.createElement('canvas');
        canvas.style.userSelect = 'none';
        canvas.style.webkitUserDrag = 'none';
        canvas.ondragstart = () => false;
        document.body.appendChild(canvas);
    }


    setupEvenets(canvas);
    handleWindowSize();

    const quadVertices = [
        -1, -1,
         1, -1,
        -1,  1,
         1,  1
    ];

    const computedStyle = window.getComputedStyle(canvas);
    const width = parseInt(computedStyle.getPropertyValue('width'), 10);
    const height = parseInt(computedStyle.getPropertyValue('height'), 10);

    if(options.renderScale){
        if(options.format === 'portrait'){
            options.resx = Math.floor(options.aspectRatio * options.renderScale);
            options.resy = options.renderScale;
        }
        else{
            options.resx = options.renderScale;
            options.resy = Math.floor(options.renderScale / options.aspectRatio);
        }
    }
    else{
        // options.resx = width*window.devicePixelRatio*2;
        // options.resy = height*window.devicePixelRatio*2;
        options.resx = width*2;
        options.resy = height*2;
    }

    if(!gl)
        gl = canvas.getContext('webgl', {preserveDrawingBuffer: true, antialias: true});
    gl.canvas.width = options.resx;
    gl.canvas.height = options.resy;

    utilsCode = getShaderSource(utilsShaderSource);
    computeCode = getShaderSource(computeShaderSource);
    
    backgroundVertexCode = getShaderSource(backgroundVertexSource);
    backgroundFragmentCode = getShaderSource(backgroundFragmentSource);
    textureFragmentCode = getShaderSource(textureFragmentSource);

    backgroundFragmentCode = backgroundFragmentCode
        .replace('#include "utils.glsl"', utilsCode);

    vertexCode = getShaderSource(simulateShaderSource);
    vertexCode = vertexCode
        .replace('#include "utils.glsl"', utilsCode)
        .replace('#include "compute.glsl"', computeCode)
        .replace('coloring', combination.coloring);

    fragmentCode = getShaderSource(fragmentShaderSource);
    fragmentCode = fragmentCode
        .replace('#include "utils.glsl"', utilsCode);

    vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode);
    fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode);
    backgroundVertexShader = createShader(gl, gl.VERTEX_SHADER, backgroundVertexCode);
    backgroundFragmentShader = createShader(gl, gl.FRAGMENT_SHADER, backgroundFragmentCode);
    textureFragmentShader = createShader(gl, gl.FRAGMENT_SHADER, textureFragmentCode);

    program = createProgram(gl, vertexShader, fragmentShader);
    backgroundProgram = createProgram(gl, backgroundVertexShader, backgroundFragmentShader);

    positionBuffer = gl.createBuffer();
    seedBuffer = gl.createBuffer();
    indicesBuffer = gl.createBuffer();
    particles = initParticles();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(particles.positions), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, seedBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(particles.seeds), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(particles.indices), gl.STATIC_DRAW);
    backgroundPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, backgroundPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quadVertices), gl.STATIC_DRAW);

    quadBuffer = createQuad(gl);
    
    baseDrawingTexture = gl.createTexture();
    var image = new Image();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, baseDrawingTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
    image.src = baseDrawing.toDataURL('image/png');
    image.addEventListener('load', function(){
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, baseDrawingTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);

        render();
    });
    
}

function render(){
    // render
    handleWindowSize();

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT);

    let positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    let seedAttributeLocation = gl.getAttribLocation(program, 'a_seed');
    let indexAttributeLocation = gl.getAttribLocation(program, 'a_index');
    
    const backgroundPositionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    gl.useProgram(backgroundProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, backgroundPositionBuffer);
    gl.enableVertexAttribArray(backgroundPositionAttributeLocation);
    gl.vertexAttribPointer(backgroundPositionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.uniform2f(gl.getUniformLocation(backgroundProgram, 'u_resolution'), options.resx, options.resy);
    gl.uniform2f(gl.getUniformLocation(backgroundProgram, 'u_simulation'), options.simx, options.simy);
    gl.uniform1f(gl.getUniformLocation(backgroundProgram, 'u_globalseed'), options.globalseed);
    gl.uniform1f(gl.getUniformLocation(backgroundProgram, 'u_brd'), options.border);
    gl.uniform3f(gl.getUniformLocation(backgroundProgram, 'u_color1'), ...u_color1);
    gl.uniform3f(gl.getUniformLocation(backgroundProgram, 'u_color2'), ...u_color2);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, seedBuffer);
    gl.enableVertexAttribArray(seedAttributeLocation);
    gl.vertexAttribPointer(seedAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, indicesBuffer);
    gl.enableVertexAttribArray(indexAttributeLocation);
    gl.vertexAttribPointer(indexAttributeLocation, 1, gl.FLOAT, false, 0, 0);
    
    let randl = -rand(2, 10);
    let ang = rand(0, 2*Math.PI);
    let rad = rand(2, 10);
    u_pointsize = options.resx/options.simx * ( prng.rand() < .5 ? rand(11, 12) : rand(17, 18)  );
    gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), options.resx, options.resy);
    gl.uniform2f(gl.getUniformLocation(program, 'u_simulation'), options.simx, options.simy);
    gl.uniform3f(gl.getUniformLocation(program, 'u_randomlight'), rad*Math.cos(ang), rad*Math.sin(ang), randl);
    gl.uniform3f(gl.getUniformLocation(program, 'u_tint1'), ...u_tint1);
    gl.uniform3f(gl.getUniformLocation(program, 'u_tint2'), ...u_tint2);
    gl.uniform1f(gl.getUniformLocation(program, 'u_globalseed'), options.globalseed);
    gl.uniform1f(gl.getUniformLocation(program, 'u_pointsize'), u_pointsize);
    gl.uniform1i(gl.getUniformLocation(program, 'u_pure'), combChoice === 'lonli' ? 1 : 0);
    gl.uniform1f(gl.getUniformLocation(program, 'u_brd'), options.border);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, baseDrawingTexture);
    gl.uniform1i(gl.getUniformLocation(program, 'u_texture'), 0);
    
    console.log('\n%crendering at resolution ' + '%c' + options.resx + ' %cx ' + '%c' + options.resy, "color: #fff", "color: #abffbc", "color: white", "color: #abffbc");
    renderLoop();
}

let animID;
let renderTriggerID;
let previewCaptured = false;
async function renderLoop(){
    if(options.iters == options.steps){
        console.log('rendering done')
        renderingDone = true;
        if(!previewCaptured){
            previewCaptured = true;
            capturePreview();
        }
        if(shouldSave){
            save();
            keyRenderScale = null;
            shouldSave = false;
        }
        return;
    }
    
    u_pointsize = map(options.iters, 0, options.steps, 0, 1);
    u_pointsize = Math.pow(u_pointsize, 2.7);
    u_pointsize = map(u_pointsize, 0, 1, 18, 13);
    u_pointsize = u_pointsize * options.resx/options.simx;
    gl.uniform1f(gl.getUniformLocation(program, 'u_pointsize'), u_pointsize);
    gl.uniform2f(gl.getUniformLocation(program, 'u_iteration'), rand(0,131.131), rand(0,131.31));
    gl.drawArrays(gl.POINTS, 0, particles.count);
    
    options.iters++;
    animID = requestAnimationFrame(renderLoop);
}
  

function createQuad(gl) {
    const vertices = new Float32Array([
        -1.0, -1.0, 0.0, 0.0,
         1.0, -1.0, 1.0, 0.0,
        -1.0,  1.0, 0.0, 1.0,
         1.0,  1.0, 1.0, 1.0
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    return buffer;
}

function handleWindowSize(){
    let clientWidth = window.innerWidth;
    let clientHeight = window.innerHeight;
    let caspect = (clientWidth-options.edgeOffset*2)/(clientHeight-options.edgeOffset*2);
    let aspect = options.resx/options.resy;
    let sw, sh;
    if(caspect > aspect){
        sh = Math.round(clientHeight) - options.edgeOffset*2;
        sw = Math.round(sh * aspect);
    }else{
        sw = Math.round(clientWidth) - options.edgeOffset*2;
        sh = Math.round(sw / aspect);
    }

    if(options.currcanvasheight === 'undefined' || options.currcanvaswidth === 'undefined'){
        options.currcanvaswidth = sw;
        options.currcanvasheight = sh;
    }
    options.prevcanvaswidth = options.currcanvaswidth;
    options.prevcanvasheight = options.currcanvasheight;
    options.currcanvaswidth = sw;
    options.currcanvasheight = sh;

    if(canvas){
        canvas.style.width = sw + 'px';
        canvas.style.height = sh + 'px';
        canvas.style.position = 'absolute';
        canvas.style.left = clientWidth/2 - sw/2 + 'px';
        canvas.style.top = clientHeight/2 - sh/2 + 'px';
    }
    
    if(imgElement){
        imgElement.style.width = sw + 'px';
        imgElement.style.height = sh + 'px';
        imgElement.style.position = 'absolute';
        imgElement.style.left = clientWidth/2 - sw/2 + 'px';
        imgElement.style.top = clientHeight/2 - sh/2 + 'px';
    }
}

function handleZoom(event){
    let clientWidth = window.innerWidth;
    let clientHeight = window.innerHeight;
    let sw = options.resx;
    let sh = options.resy;
    let mx = (event.clientX-clientWidth/2) / clientWidth * sw;
    let my = (event.clientY-clientHeight/2) / clientHeight * sh;
    canvas.style.width = sw + 'px';
    canvas.style.height = sh + 'px';
    canvas.style.position = 'absolute';
    canvas.style.left = clientWidth/2 - sw/2 - mx + 'px';
    canvas.style.top = clientHeight/2 - sh/2 - my + 'px';
    
    if(imgElement){
        imgElement.style.width = sw + 'px';
        imgElement.style.height = sh + 'px';
        imgElement.style.position = 'absolute';
        imgElement.style.left = clientWidth/2 - sw/2 - mx + 'px';
        imgElement.style.top = clientHeight/2 - sh/2 - my + 'px';
    }
}

function save(){
    console.log('preparing canvas for saving...');
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    if(q){
        link.download = 'render_' + q + '.png';
    }else{
        link.download = 'render_' + btoa(JSON.stringify({'hash': hash, 'editionNumber': editionNumber})) + '.png';
    }
    // link.href = imgElement.src;
    link.href = dataURL;
    link.click();
}

document.addEventListener('DOMContentLoaded', () => {
    console.log(`
    
%cUse the "size" URL query parameter (e.g. %c&size=4000%c) to specify the vertical
dimension of the output (width is calculated respecting the aspect ratio).
The upper limit depends on the hardware, and exceeding it will produce strangley
cropped outputs, or crash the browser, so please beware.

Use the "s" key to save the current output as a PNG file.

`, 'color: #fff;', 'color: #aaccff;', 'color: #fff;');

    loadAlgoAndLaunch();
});
document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    if(keyName == 's'){
        if(renderingDone){
            save();
        }
        else{
            console.log('will save after rendering');
            shouldSave = true;
        }
    }
    // if(keyName == 'q'){
    //     if(renderingDone){
    //         loadAlgoAndLaunch();
    //     }
    //     else{
    //         shouldReset = true;
    //         console.log('will reset after rendering');
    //     }
    // }
});

let mousepressed = false;
function setupEvenets(canvas){
    // canvas.addEventListener('mousedown', function(event) {
    //     handleZoom(event);
    //     mousepressed = true;
    // });
    // canvas.addEventListener("mousemove", function(event) {
    //     if(mousepressed)
    //         handleZoom(event);
    // });
    // canvas.addEventListener('mouseup', function(event) {
    //     handleWindowSize();
    //     mousepressed = false;
    // });
}
  
let resizingTimer = 0;
let shouldRerender = false;

window.onresize = function(event) {
    handleWindowSize();
    
    if(options.prevcanvasheight != options.currcanvasheight || options.prevcanvaswidth != options.currcanvaswidth){
        sizeChangeCheck();
    }
}

function sizeChangeCheck(){
    handleWindowSize();
    clearTimeout(renderTriggerID);
    cancelAnimationFrame(animID);
    
    const computedStyle = window.getComputedStyle(canvas);
    const width = parseInt(computedStyle.getPropertyValue('width'), 10);
    const height = parseInt(computedStyle.getPropertyValue('height'), 10);
    if(options.renderScale){
        //
    }
    else{
        options.resx = width*2;
        options.resy = height*2;

        gl.canvas.width = options.resx;
        gl.canvas.height = options.resy;

        options.iters = 0;
        renderingDone = false;
        renderTriggerID = setTimeout(render, 100);
    }
}