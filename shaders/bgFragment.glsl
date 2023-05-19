precision mediump float;

uniform float u_globalseed;
uniform vec2 u_resolution;
uniform vec2 u_simulation;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_brd;

#include "utils.glsl"

void main() {
    vec2 uv = gl_FragCoord.xy / 400.;

    float nzx = -1. + 2.*smoothstep(0., 1., fbm3(gl_FragCoord.xy*.2, u_globalseed*332.11));
    float nzy = -1. + 2.*smoothstep(0., 1., fbm3(gl_FragCoord.xy*.2, u_globalseed*111.87));
    vec2 nzpos = gl_FragCoord.xy + 1.3*vec2(nzx, nzy);

    float py = uv.y;

    float factor = fbm3(uv * 310.0, u_globalseed*1234.51);
    factor = smoothstep(.0, 1., factor);
    float rara = hash12(uv*213.31*factor+factor);
    // rara = .5 + .2*(-1.0 + 2.0*rara);

    vec3 color = mix(u_color1, u_color2, rara);

    color = u_color1;
    float brd = u_brd * u_resolution.x/u_simulation.x;
    float brdmask = 1.;
    float trz = 1.5;

    brdmask *= smoothstep(brd-trz, brd+trz, nzpos.x);
    brdmask *= 1. - smoothstep(u_resolution.x-brd-trz, u_resolution.x-brd+trz, nzpos.x);
    brdmask *= smoothstep(brd-trz, brd+trz, nzpos.y);
    brdmask *= 1. - smoothstep(u_resolution.y-brd-trz, u_resolution.y-brd+trz, nzpos.y);

    color = mix(u_color1, u_color2, brdmask);

    color = color + .15*smoothstep(.993, 1., rara) + .1*factor;

    gl_FragColor = vec4(vec3(brdmask), 1.0);
    gl_FragColor = vec4(color, 1.0);
}