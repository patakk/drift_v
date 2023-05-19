precision mediump float;

attribute vec2 a_position;
attribute vec3 a_seed;
attribute float a_index;

varying vec3 v_color;
varying vec3 v_pos;
varying vec3 v_vel;
varying vec3 v_seed;
varying float v_index;

uniform vec2 u_resolution;
uniform vec2 u_iteration;
uniform vec2 u_simulation;
uniform float u_globalseed;
uniform float u_pointsize;
uniform float u_brd;
uniform sampler2D u_texture;
uniform vec3 u_tint1;
uniform vec3 u_tint2;

vec2 pos;
vec2 vel;
vec2 acc;
vec3 originalTextureColor;
float originalLightness;

float scalescale;

#include "utils.glsl"
#include "compute.glsl"

vec3 colorful(vec3 col, vec2 pos){
    return col;
}

vec3 redish(vec3 col, vec2 pos){
    float ph = pow(pos.y, 3.);
    ph = noise(col.rb*1.41);
    ph = smoothstep(.0, .99, ph);
    float redtrans = pow(mod(pos.y + col.r+col.g+col.b, 1.), 3.);
    vec3 redish;
    redish = vec3(.2,.01,.0)*redtrans + (1.-redtrans)*vec3(.09,.0,.0);
    redish = u_tint2*redtrans + (1.-redtrans)*u_tint2*.4;
    col.rgb = vec3(0.);
    col = ph*redish + col*(1.-ph);
    return col;
}

vec3 darkish(vec3 col, vec2 pos){
    float ph = pow(pos.y, 3.);
    ph = 1.*fbm3(col.rb*4.41 + pos.xy*.0, 0.0);
    ph = smoothstep(.19, .81, ph) + .0*hash13(pos.xyx*.31 + mod(hash13(pos.xyx*.45), 1.));
    ph = pow(ph, 3.);
    // ph = smoothstep(.19, .81, ph) + .5*hash13(pos.xyx*.31 + mod(hash13(pos.xyx*.45), 1.));
    float redtrans = pow(mod(pos.y + col.r+col.g+col.b, 1.), 3.);
    vec3 redish;
    redish = vec3(.1,.1,.1)*redtrans + (1.-redtrans)*u_tint2;
    col.rgb = vec3(0.);
    col = ph*vec3(0.05) + col*(1.-ph);
    return col;
}


vec3 greyish(vec3 col, vec2 pos){
    float ph = pow(pos.y, 3.);
    ph = noise(col.rb*1.41);
    ph = smoothstep(.19, .81, ph);
    float redtrans = pow(mod(pos.y + col.r+col.g+col.b, 1.), 3.);
    vec3 redish;
    redish = vec3(.1,.1,.1)*redtrans + (1.-redtrans)*vec3(.05,.05,.05);
    col.rgb = vec3(0.);
    col = .66 + ph*redish + col*(1.-ph);
    return col;
}



vec3 greyishh(vec3 col, vec2 pos){
    float ph = pow(pos.y, 3.);
    ph = noise(col.rb*1.41);
    ph = smoothstep(.19, .81, ph);
    float redtrans = pow(mod(pos.y + col.r+col.g+col.b, 1.), 3.);
    vec3 redish;
    redish = vec3(.1,.1,.1)*redtrans + (1.-redtrans)*vec3(.05,.05,.05);
    col.rgb = vec3(0.55+u_globalseed*.15);
    col = vec3(.45+.15*ph);
    return col;
}

void main() {
    pos = a_position;

    float rrrx = hash13(vec3(u_iteration.x, u_iteration.x,a_index*1.31+55.131));
    float rrry = hash13(vec3(u_iteration.x, u_iteration.x,a_index*1.31+22.131));

    pos.x = 3.*u_simulation.x*(fbm3(vec2(u_iteration.x, u_iteration.x), a_index*1.31+22.131+233.13*rrry+233.13*rrrx));
    pos.y = 3.*u_simulation.y*(fbm3(vec2(u_iteration.y, u_iteration.y), a_index*1.31+33.13+233.13*rrry));

    pos = fixpos(pos, u_brd, u_simulation);

    vel = vec2(0.0, 0.0);
    acc = vec2(0.0, 0.0);
    vec2 tc = pos/u_simulation;
    tc.y = 1. - tc.y;
    originalTextureColor = texture2D(u_texture, tc).rgb;
    originalLightness = lightness(originalTextureColor);

    vec3 sampleColor = originalTextureColor;
    float nzz = smoothstep(0., 1., fbm3(sampleColor.xy*22.31, sampleColor.z*8.31));
    nzz = power(lightness(sampleColor), 5.);
    // scalescale = min(u_resolution.x, u_resolution.y)/2900.;
    scalescale = u_pointsize;

    sampleColor = coloring(sampleColor, tc); // changed in js

    // sampleColor = vec3(.0,.0,.0);

    // float ph = pow(tc.y, 3.);
    // ph = noise(sampleColor.rb*1.41);
    // ph = smoothstep(.19, .81, ph);
    // float redtrans = pow(mod(tc.y + sampleColor.r+sampleColor.g+sampleColor.b, 1.), 3.);
    // vec3 redish;
    // redish = vec3(.2,.01,.0)*redtrans + (1.-redtrans)*vec3(.09,.0,.0);
    // redish = vec3(.1,.1,.1)*redtrans + (1.-redtrans)*vec3(.05,.05,.05);
    // sampleColor.rgb = vec3(0.);
    // sampleColor = ph*redish + sampleColor*(1.-ph);

    if(a_seed.z < .007){
        sampleColor = vec3(.2,.0,.0);
    }
    
    // if(mod(a_index, 43.) > .5){
    //     sampleColor.rgb = vec3(0.);
    // }
    v_color = vec3(a_seed.x*.3);
    // v_color = vec3(a_position/u_resolution, 0.0);
    v_color = sampleColor + .1*(-.5+a_seed.x) + .1*(-.5+a_seed.z);
    v_color = sampleColor;

    //float no = fbm3(pos.xy/u_resolution*vec2(4., 22.) + vec2(0.0, 0.0), u_globalseed+38.58+sampleColor.r);
    //no = smoothstep(0.4, .45, no);
    //float mask = smoothstep(0.0, 1.0, no);
    // sampleColor.r += .6*(-.5 + fbm3(pos.xy/u_resolution*22. + vec2(0.0, 0.0), u_globalseed+38.58));
    // sampleColor.g += .6*(-.5 + fbm3(pos.xy/u_resolution*22. + vec2(0.0, 0.0), u_globalseed+63.13));
    // sampleColor.b += .6*(-.5 + fbm3(pos.xy/u_resolution*22. + vec2(0.0, 0.0), u_globalseed+44.66));
    //sampleColor = sampleColor*mask + sampleColor*.2*(1.-mask);

    for(float t = 0.0; t < 133.0; t+=1.0){
        compute(t);
    }

    float vcolorlig = lightness(v_color);
    float ligg = lightness(texture2D(u_texture, tc).rgb)*.66+.34;
    ligg = .4;
    vec2 clipSpace = pos / u_simulation * 2.0 - 1.0;
    gl_Position = vec4(clipSpace, 0., 1.);
    if(vcolorlig < .01)
        scalescale *= (1.2 - .2*smoothstep(0.99, 1.0, a_seed.x));

    float pointsize = scalescale*(1.0 + (1.4*smoothstep(0.995, 1.0, a_seed.x))) * ligg * (1. + 0.*nzz);

    // v_color *= 1. + .2*vec3(smoothstep(0.99, 1.0, a_seed.x));
    // float pointsize = scalescale*14.5*(1.0 + 1.4*smoothstep(0.99, 1.0, a_seed.x)) * ligg;
     //pointsize = 11.;
    //float pointsize = scalescale*8.5*(1.0 + 1.4*smoothstep(0.99, 1.0, a_seed.x));

    // pointsize = (2. + 4.*a_seed.y) + 4.*smoothstep(.9985, .9999999, a_seed.x);
    // pointsize += 1. - 1.*smoothstep(0., 16., length(vel));
    
    // v_color = vec3(nzz);
    vec2 newuv = pos.xy/u_simulation;

    gl_PointSize = pointsize*1.7;

    if(lightness(originalTextureColor) < .1){
            gl_PointSize = pointsize*(1.4 + 0.*pow(clamp(length(newuv-.5), 0.0, 1.0), 3.));
            // v_color = mix(u_tint1, u_tint2, .4 + .2*tc.y);
            v_color = u_tint1;
    }
    // pointsize = 8. + 13.*pow(clamp(length(newuv-.5), 0., 1.), 3.);
    // gl_PointSize = pointsize;
    // else if(lightness(originalTextureColor) < .26){
    //     gl_PointSize = pointsize*1.4;
    //     // v_color = mix(u_tint1, u_tint2, .4 + .2*tc.y);
    //     v_color = u_tint2;
    // }

    if(pos.x < u_brd || pos.x > u_simulation.x-u_brd || pos.y < u_brd || pos.y > u_simulation.y-u_brd)
        gl_PointSize = 0.0;

    v_pos = vec3(pos.xy, pointsize);
    v_vel = vec3(vel.xy, 0.0);
    v_index = a_index;
    v_seed = a_seed;
}