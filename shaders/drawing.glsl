precision mediump float;
varying vec3 v_color;
varying vec3 v_pos;
varying vec3 v_vel;
varying vec3 v_seed;
varying float v_index;
uniform float u_globalseed;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform vec2 u_iteration;
uniform vec2 u_simulation;
uniform vec3 u_randomlight;
uniform vec3 u_tint1;
uniform vec3 u_tint2;
uniform int u_pure;

#include "utils.glsl"

vec2 rotate2d(vec2 v, float a) {
    v = v - .5;
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, -s, s, c);
    return m * v + .5;
}

vec2 scale(vec2 v, vec2 s) {
    v = v - .5;
    mat2 m = mat2(s.x, 0., 0., s.y);
    return m * v + .5;
}

float heading(vec2 v) {
    return atan(v.y, v.x);
}

vec2 norm(vec2 v) {
    float l = length(v);
    return v / l;
}

vec3 norm(vec3 v) {
    float l = length(v);
    return v / l;
}

float getz(vec2 v) {
    v = v - .5;
    float maxl = length(vec2(0.,.45));
    float l = length(v);
    float p = l / maxl;
    // p = pow(p, .7);
    // v = v / l;
    // v = v * p * maxl;
    // v = v + .5;
    // p = p * 3.14/2.;
    // p = sin(p);
    // p = 1. - sin((1.-p)*3.14/2.);
    p = sin(acos(p));
    v = v / l;
    v = v * p * maxl + .5;
    return p;

}

void main() {

    //vec2 uv = (gl_FragCoord.xy - v_pos.xy) / v_pos.z + .5;
    vec2 uv0 = gl_PointCoord.xy;
    vec2 uv = gl_PointCoord.xy;

    float scalescale = u_resolution.x/2900.;

    float speed = length(v_vel.xy);
    float angle = heading(v_vel.xy);

    // uv = rotate2d(uv, angle);
    // uv = scale(uv, vec2(1., 4.));
    // uv = spherify(uv);
    
    float lele = length(uv-.5)/length(vec2(.5));
    float nzx = -.5+fbm3(uv*v_pos.z*.2 + v_pos.xy*.3, 94.33);
    float nzy = -.5+fbm3(uv*v_pos.z*.2 + v_pos.xy*.3, 52.52);
    uv.x += nzx*.6;
    uv.y += nzy*.6;
    
    // float lele = length(uv-.5)/length(vec2(.5));
    // float nzx = -.5+power(noise(uv*v_pos.z*.1 + v_pos.xy*.3 + 94.33), 3.);
    // float nzy = -.5+power(noise(uv*v_pos.z*.1 + v_pos.xy*.3 + 52.52), 3.);
    // uv.x += nzx*.1;
    // uv.y += nzy*.1;

    float border = .5 - .1*power(noise(uv*v_pos.z*.1 + v_pos.xy*.3+ 91.32), 3.);
    border = .5;
    float dist = distance(uv, vec2(.5));
    if(dist > border) {
        discard;
    }
    
    // nzx = -.5+fbm3(uv*v_pos.z*.9 + v_pos.xy*1.3, 22.88);
    // nzy = -.5+fbm3(uv*v_pos.z*.9 + v_pos.xy*1.32, 33.51);
    // uv.x += nzx*1.;
    // uv.y += nzy*1.;

    float trnz = 3. / v_pos.z * scalescale;
    float alpha = smoothstep(border, border - trnz, dist);

    vec3 lightpos = vec3(1.5, 1.5, 1.0);
    // lightpos.x += 1.6*(power(noise(uv*33.+14.63+v_seed.y*4.), 3.));
    // lightpos.y += 1.6*(power(noise(uv*33.+72.32+v_seed.y*4.), 3.));
    float ddot = dot(norm(vec3(uv, 0.5)-vec3(.5, .5, .5)), lightpos)*.5+.5;
    ddot = max(0., min(1., ddot));
    // ddot += 1.8*(-.75 + smoothstep(.1, .7, fbm3(vec2(dist*37.)+3.*v_seed.y+3.*v_seed.z, u_globalseed*3.)));
    // ddot = max(0., min(1., ddot));
    // vec3 xyz = vec3(uv, getz(uv));
    // float ddot = dot(norm(xyz-.5), norm(u_randomlight))*.5+.5;
    // if(ddot < 0.) ddot = 0.0;
    // if(ddot > 1.) ddot = 1.;
    // ddot = smoothstep(.0, .99, ddot);
    float ddotc = ddot*2.-1.;


    float ddots;
    //ddots = pow(ddot, 6.2);
    ddots = pow(ddot, 2.6);
    // ddots = smoothstep(.3, .36, ddot);
    //float ddots = power(ddot, 3.);
    // ddots = smoothstep(.5, .999, ddots);
    // vec3 light = ddots*vec3(1., 0., 0.) + (1.-ddots)*vec3(0., 0., 1.);
    // light = ddots*u_tint1 + (1.-ddots)*u_tint2;

    vec3 res = 1. - (1.-v_color) * (1.-ddot*.4);
    //  res = v_color + .1*(-.5+v_seed);

    
    vec3 rra = vec3(0.);
    float rrrx = 12.313*hash13(vec3(u_iteration.x, u_iteration.x, v_index*1.31+55.131)) + 56.113;
    float rrry = 12.313*hash13(vec3(u_iteration.x, u_iteration.x, v_index*1.31+22.131)) + 81.113;
    float rrrz = 12.313*hash13(vec3(u_iteration.x, u_iteration.x, v_index*1.31+11.131)) + 93.113;
    rrrx = -1. + 2.*hash13(vec3(rrrx));
    rrry = -1. + 2.*hash13(vec3(rrry));
    rrrz = -1. + 2.*hash13(vec3(rrrz));

    vec3 modulated = v_color;
    vec3 hhh = rgb2hsv(modulated);
    hhh.x = mod(hhh.x + rrrx*.03 + 1., 1.);
    hhh.y = clamp(hhh.y + rrry*.1, 0., 1.);
    // hhh.z = clamp(hhh.z + rrrz*.1, 0., 1.);
    modulated = hsv2rgb(hhh);

    rra.r = rrrx*.1;
    rra.g = rrry*.1;
    rra.b = rrrz*.1;

    // gl_FragColor = vec4(v_color.rgb, .75);
    // gl_FragColor = vec4(vec3(angle/6.28+.5)*alpha, alpha);
    // gl_FragColor = vec4(res*alpha, alpha);
    // gl_FragColor = vec4(uv.x*alpha, uv.y*alpha, 0., alpha);
    // gl_FragColor = vec4(vec3(ddot*(.1 + v_pos.z*.04)+.03)*alpha, alpha);
    // gl_FragColor = vec4((vec3(.1) + ddotc*.1)*alpha, alpha);
    // // gl_FragColor = vec4(light*alpha, alpha);
    // gl_FragColor = vec4(res*alpha, alpha);
    // // if(length(v_vel) < 9.)
    // gl_FragColor = vec4(uv.x, uv.y, 0., 1.);
    // gl_FragColor = vec4(vec3(ddots*.3+.03)*alpha, alpha);
    // gl_FragColor = vec4((v_color + v_seed.x*.2)*alpha, alpha);
    // gl_FragColor = vec4(vec3(ddots)*alpha, alpha);
    // gl_FragColor = vec4(vec3(v_seed.x)*alpha, alpha);
    // gl_FragColor = vec4(vec3(ddots*v_seed.x)*alpha, alpha);
    // gl_FragColor = vec4(vec3(ddots)*alpha, alpha);
    // gl_FragColor = vec4(res*alpha, alpha);
    // gl_FragColor = vec4((v_color + vec3(1.,.95,.9)*vec3(ddots*.85-.13-.0))*alpha, alpha);
    // gl_FragColor = vec4((v_color + vec3(1.,.95,.9)*vec3(ddots*.3+.03))*alpha, alpha);
    // gl_FragColor = vec4((v_color + vec3(1.,.95,.9)*vec3(ddots*.3+.03))*alpha, alpha);
    // gl_FragColor = vec4(res*alpha, alpha);
    //gl_FragColor = vec4((v_color + vec3(1.,.95,.9)*vec3(ddots*.3+.03))*alpha, alpha);

    gl_FragColor = vec4((modulated + vec3(1.,.95,.9)*vec3(ddots*.3+.03))*alpha, alpha);
    
    // ddot = dot(uv-.5, vec2(.5))*.5+.5;
    // gl_FragColor = vec4(vec3(modulated), 1.);
}