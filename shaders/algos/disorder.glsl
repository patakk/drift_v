

void compute(float time){
    float speed = 3.13;
    vec2 acc = vec2(0., 0.);
    ivec2 ipos = ivec2(int(pos.x), int(pos.y));
    vec2 tc =  pos.xy/u_simulation.xy;
    tc.y = 1. - tc.y;
    float texcol = lightness(texture2D(u_texture, tc).rgb);
    texcol = 1. - lightness(originalTextureColor);
    
    // vec2 noise = vec2(simplex3d_fractal(vec3(pos*.002, a_seed.x*0.)), simplex3d_fractal(vec3(pos, a_seed.y + 1.0)));

    vec2 noise = vec2(0.0, 0.0);
    noise.x = 3.*(-.5 + fbm3(pos.xy*0.00031, 0.0 + texcol*12.31));
    noise.y = 3.*(-.5 + fbm3(pos.xy*0.00031, 0.0 + texcol*12.31 + 31.21));

    float dist = 4.*pow(length(tc-.5)*2./1.414, 4.);
    dist = .032;
    noise.x += dist*(-1. + 2.*a_seed.x);
    noise.y += dist*(-1. + 2.*a_seed.y);

    acc = vec2(0.0, 0.0);
    acc += noise * 1.;

    vec3 sampleColor = texture2D(u_texture, tc).rgb;
    float light = (sampleColor.r + sampleColor.g + sampleColor.b)/3.0;
    float drag = 0.98 + 0.01 * a_seed.x - 0.*clamp(map(light, 0.0, 1.0, 0.0, .98), 0., 0.97);
    // float drag = 0.98 + 0.01 * a_seed.x;
    drag -= texcol*.95;

    
    pos = fixpos(pos, u_brd, u_simulation);
    vel = vel + acc*.991;
    vel = vel * drag;

    pos = pos + vel*speed;
}
