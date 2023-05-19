
void compute(float time){
    vec2 acc = vec2(0., 0.);
    // vec2 mouse = vec2(u_Origin.x, u_simulation.y-u_Origin.y);
    float speed = .1;

    ivec2 ipos = ivec2(int(pos.x), int(pos.y));
    vec2 tc =  pos.xy/u_simulation.xy;
    tc.y = 1. - tc.y;
    float texcol = texture2D(u_texture, tc).r*1.;

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
    incx = 1. + 7. * power(clamp(simplex3d_fractal(vec3(mod(time*3., 1000.0)*0.001 + pos.y/u_simulation.y*.06 + u_globalseed*12.13)), -1., 1.)/2.+.5, 4.);
    incy = 1. + 2. * power(clamp(simplex3d_fractal(vec3(mod(time*3., 1000.0)*0.001 + pos.x/u_simulation.x*.03 + .41 + u_globalseed*12.13)), -1., 1.)/2.+.5, 4.);
    float incxx = 1. + 5. * power(clamp(simplex3d_fractal(vec3(mod(time*3., 1000.0)*0.001 + pos.y/u_simulation.y*.06 + .1251 + u_globalseed*12.13)), -1., 1.)/2.+.5, 4.);
    float incyy = 1. + 12. * power(clamp(simplex3d_fractal(vec3(mod(time*3., 1000.0)*0.001 + pos.y/u_simulation.y*.06+ .8888 + u_globalseed*12.13)), -1., 1.)/2.+.5, 4.);
    poss.x = floor(incx*poss.x)/incx + floor(incxx)*0.;
    poss.y = floor(incy*poss.y)/incy + floor(incyy)*.0;
    vec3 nzp = vec3(poss.x, poss.y, ttime*0.002 + u_globalseed*12.13)*2. + u_globalseed*12.13;
    vec2 noisexy = vec2(0., 0.);
    float qq = clamp(simplex3d(nzp*0.5+vec3(0.2589, 0.4891, 5.1311) + u_globalseed*12.13), -1.0, 1.0);

    float r = .6;
    float ang = 12.*simplex3d(nzp*0.0527*qq + u_globalseed*110.31);
    float ang2 = 47.*simplex3d(nzp*0.0527*qq);

    noisexy.x = r*cos(ang)*1.5 + 0.0*r*cos(ang2);
    noisexy.y = r*sin(ang)*1.5 + 0.0*r*sin(ang2);

    float dist = 4.*pow(length(tc-.5)*2./1.414, 4.);
    dist = .1;

    // noisexy.x += dist*(-1. + 2.*a_seed.x);
    // noisexy.y += dist*(-1. + 2.*a_seed.y);

	vec2 fromMouse = vec2(0.0, 0.0);
    vec2 u_Gravity = vec2(0.0, 0.0);

	// vec2 fromMouse = pos - mouse;
	// float tomouselen = length(fromMouse);
	// if(tomouselen < u_simulation.x*0.1){
	// 	fromMouse = fromMouse / tomouselen;
	// 	fromMouse = fromMouse * (1. - tomouselen/u_simulation.x*0.1);
	// 	fromMouse *= 125.;
	// }
	// else{
	// 	fromMouse = vec2(0.0);
	// }

	ivec2 noise_coord = ivec2(int(pos.x), int(pos.y));

    acc.x = -noisexy.x + fromMouse.x + 0.*u_Gravity.x;
    acc.y = noisexy.y + fromMouse.y + 0.*u_Gravity.y;


    
    pos = fixpos(pos, u_brd, u_simulation);


    float drag = 0.98 + 0.01 * a_seed.x;
    // drag = drag  - (.5-abs(texcol-.5))*1.;
    drag = drag  - texcol*.5;
    // drag = 1. - drag;

    //vel = vel + acc*1.05;
    vel = vel + .0*vec2(1.,1.)+acc*.991;
    vel = vel * drag;

    pos = pos + vel*speed;
}
