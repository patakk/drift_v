
void compute(float time){
    vec2 acc = vec2(0., 0.);
    // vec2 mouse = vec2(u_Origin.x, u_simulation.y-u_Origin.y);
    float speed = .2;

    ivec2 ipos = ivec2(int(pos.x), int(pos.y));
    vec2 tc =  pos.xy/u_simulation.xy;
    tc.y = 1. - tc.y;
    // float texcol = texture2D(u_texture, tc).r*1. + .01;
    float texcol = lightness(texture2D(u_texture, tc).rgb);
    if(texcol < 0.01){
        texcol = 0.0;
    }
    else
        texcol = smoothstep(0.0, 1.0, fbm3(vec2(texcol*1.311), u_globalseed*221.211)) + .01;
    
    float tttime = time*0.0015 + pos.x/u_simulation.x;
    tttime = mod(tttime, 1.0);
    tttime = pow(tttime, 5.);
    tttime = 0.0;
    float ttime = floor(time) + tttime;
    vec2 posss = pos.xy/u_simulation.x;
    vec3 nzpp = vec3(posss.x, posss.y, ttime*0.02 + u_globalseed*12.13);
    float incx = clamp(4. + floor(power(simplex3d(nzpp+vec3(0.2589, 0.4891, 1.131 + u_globalseed*12.13)), 4.)*34.), 2., 34.);
    float incy = clamp(4. + floor(power(simplex3d(nzpp+vec3(3.2589, 0.4891, 44.131 + u_globalseed*12.13)), 4.)*34.), 2., 34.);
    vec2 poss = pos.xy/u_simulation.x;
    incx = 1. + 4. * power(clamp(simplex3d_fractal(vec3(mod(time*3., 1000.0)*0.001 + pos.y/u_simulation.y*.03 + u_globalseed*12.13)), -1., 1.)/2.+.5, 4.);
    incy = 1. + 4. * power(clamp(simplex3d_fractal(vec3(mod(time*3., 1000.0)*0.001 + pos.x/u_simulation.x*.03 + .41 + u_globalseed*12.13)), -1., 1.)/2.+.5, 4.);
    float incxx = 1. + 12. * power(clamp(simplex3d_fractal(vec3(mod(time*3., 1000.0)*0.001 + pos.y/u_simulation.y*.06 + .1251 + u_globalseed*12.13)), -1., 1.)/2.+.5, 4.);
    float incyy = 1. + 5. * power(clamp(simplex3d_fractal(vec3(mod(time*3., 1000.0)*0.001 + pos.y/u_simulation.y*.06+ .8888 + u_globalseed*12.13)), -1., 1.)/2.+.5, 4.);
    poss.x = floor(incx*poss.x)/incx + floor(incxx)*0.;
    poss.y = floor(incy*poss.y)/incy + floor(incyy)*.0;
    vec3 nzp = vec3(poss.x, poss.y, ttime*0.002 + u_globalseed*12.13)*2.;
    vec2 noisexy = vec2(0., 0.);
    float qq = clamp(simplex3d(nzp*0.5+vec3(0.2589, 0.4891, 5.1311) + u_globalseed*12.13), -1.0, 1.0);

    float r = .6;
    vec2 frqnsaf = vec2(1.+power(tc.y, 4.)*.2, 3.*smoothstep(fbm3(vec2(tc)*33., u_globalseed*221.211), 0.0, 1.0));
    float ang = 33.*simplex3d(nzp*0.0527*qq);
    ang = 3.14159*1.*simplex3d(vec3(pos*.0024*frqnsaf, u_globalseed*133.134));
    float ang2 = 47.*simplex3d(nzp*0.0527*qq);

    ang = 3.14159*2.*simplex3d(vec3(pos*.00144*pow(clamp(length(tc-.5), 0., 1.), 3.), u_globalseed*133.134));

    float rrx = -.5 + hash13(vec3(u_globalseed*6.78731+12.112));
    float rry = -.5 + hash13(vec3(u_globalseed*6.78731+4.568));

    ang = atan(tc.y-rrx, tc.x-rry) + 3.14 - 3.14/2. + 3.14 * smoothstep(.499999, .500001, hash13(vec3(u_globalseed*3.68731+2.512)));
    noisexy.x = r*cos(ang)*2.5;
    noisexy.y = r*sin(ang)*2.5;

    float dist = .1+.0*pow(length(tc-vec2(rrx, rry))*2./1.414, 4.);

    noisexy.x += dist*(-1. + 2.*a_seed.x);
    noisexy.y += dist*(-1. + 2.*a_seed.y);

	vec2 fromMouse = vec2(0.0, 0.0);
	vec2 u_Gravity = vec2(0.0, 0.0);

	ivec2 noise_coord = ivec2(int(pos.x), int(pos.y));

    acc.x = -noisexy.x + fromMouse.x + 0.*u_Gravity.x;
    acc.y = noisexy.y + fromMouse.y + 0.*u_Gravity.y;


    float drag = 0.99 + 0.0 * a_seed.x;
    drag = drag  - texcol*.9;

    
    vec2 center = vec2(.5, .5) + .5*(-.5 + power(noise(vec2(u_globalseed)*44.11414), 3.));
    float ddist = pow(length(tc-center)*2./1.314, 5.)*1.7;

    vel = vel + .0*vec2(1.,1.)+acc*.991;
    vel = vel * drag;

    pos = pos + vel*speed;

    pos = fixpos(pos, u_brd, u_simulation);
}
