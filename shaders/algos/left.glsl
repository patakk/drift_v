void compute(float time){
    vec2 acc = vec2(0., 0.);
    float speed = .1;

    ivec2 ipos = ivec2(int(pos.x), int(pos.y));
    vec2 tc =  pos.xy/u_simulation.xy;
    tc.y = 1. - tc.y;
    float texcol = lightness(texture2D(u_texture, tc).rgb);

    float tttime = time*0.0015 + pos.x/u_simulation.x;
    tttime = mod(tttime, 1.0);
    tttime = pow(tttime, 5.);
    tttime = 0.0;
    float ttime = floor(time) + tttime; 
    vec2 posss = pos.xy/u_simulation.x;
    vec3 nzpp = vec3(posss.x, posss.y, ttime*0.02);
    float incx = clamp(4. + floor(power(simplex3d(u_globalseed*12.31+nzpp+vec3(0.2589, 0.4891, 1.131)), 4.)*34.), 2., 34.);
    float incy = clamp(4. + floor(power(simplex3d(u_globalseed*12.31+nzpp+vec3(3.2589, 0.4891, 44.131)), 4.)*34.), 2., 34.);
    vec2 poss = pos.xy/u_simulation.x;
    incx = 1. + 7. * power(clamp(simplex3d_fractal(u_globalseed*12.31+vec3(mod(time*3., 1000.0)*0.001 + pos.y/u_simulation.y*.06)), -1., 1.)/2.+.5, 4.);
    incy = 1. + 2. * power(clamp(simplex3d_fractal(u_globalseed*12.31+vec3(mod(time*3., 1000.0)*0.001 + pos.x/u_simulation.x*.03 + .41)), -1., 1.)/2.+.5, 4.);
    float incxx = 1. + 1. * power(clamp(simplex3d_fractal(u_globalseed*12.31+vec3(mod(time*3., 1000.0)*0.001 + pos.y/u_simulation.y*.06 + .1251)), -1., 1.)/2.+.5, 4.);
    float incyy = 1. + 2. * power(clamp(simplex3d_fractal(u_globalseed*12.31+vec3(mod(time*3., 1000.0)*0.001 + pos.y/u_simulation.y*.06+ .8888)), -1., 1.)/2.+.5, 4.);
    poss.x = floor(incx*poss.x)/incx + floor(incxx)*0.;
    poss.y = floor(incy*poss.y)/incy + floor(incyy)*.0;
    vec3 nzp = vec3(poss.x, poss.y, ttime*0.002)*2.;
    vec2 noisexy = vec2(0., 0.);
    float qq = clamp(simplex3d(u_globalseed*12.31+nzp*0.5+vec3(0.2589, 0.4891, 5.1311)), -1.0, 1.0);

    float r = .6;
    float ang = 17.*simplex3d(u_globalseed*12.31+nzp*0.0527*qq);
    float ang2 = 47.*simplex3d(u_globalseed*12.31+nzp*0.0527*qq);
    ang = u_globalseed*21.313;

    noisexy.x = r*cos(ang)*12.5 + 0.0*r*cos(ang2);
    noisexy.y = r*sin(ang)*12.5 + 0.0*r*sin(ang2);

    float dist = 4.*pow(length(tc-.5)*2./1.414, 4.);

    float tcy = .1*power(2.*abs(tc.y-.5), 2.);
    noisexy.x += tcy*dist*(-1. + 2.*a_seed.x);
    noisexy.y += tcy*dist*(-1. + 2.*a_seed.y);

	vec2 fromMouse = vec2(0.0, 0.0);
	vec2 u_Gravity = vec2(0.0, 0.0);

	ivec2 noise_coord = ivec2(int(pos.x), int(pos.y));

    acc.x = -noisexy.x + fromMouse.x + 0.*u_Gravity.x;
    acc.y = noisexy.y + fromMouse.y + 0.*u_Gravity.y;

    float drag = 0.98 + 0.01 * a_seed.x;
     drag = drag  - texcol*.4;
    vel = vel + .0*vec2(1.,1.)+acc*.991;
    vel = vel * drag;

    pos = pos + vel*speed;
    pos = fixpos(pos, u_brd, u_simulation);
}
