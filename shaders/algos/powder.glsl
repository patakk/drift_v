

void compute2(float time){
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
    vec3 nzp = vec3(poss.x, poss.y, ttime*0.002 + u_globalseed*12.13)*2.;
    vec2 noisexy = vec2(0., 0.);
    float qq = clamp(simplex3d(nzp*0.5+vec3(0.2589, 0.4891, 5.1311) + u_globalseed*12.13), -1.0, 1.0);

    float r = .6;
    float ang = 33.*simplex3d(nzp*0.0527*qq);
    float ang2 = 47.*simplex3d(nzp*0.0527*qq);

    noisexy.x = r*cos(ang)*1.5 + 0.0*r*cos(ang2);
    noisexy.y = r*sin(ang)*1.5 + 0.0*r*sin(ang2);

    float dist = 4.*pow(length(tc-.5)*2./1.414, 4.);

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



    float drag = 0.98 + 0.01 * a_seed.x;
     drag = drag  - (.5-abs(texcol-.5))*1.;
    //drag = drag  - texcol*.6;

    // drag = power(noise(vec2(texcol, texcol)*3.), 6.);
    
    float ddist = pow(length(tc-.5)*2./1.314, 5.);
    if(texcol > 0.01)
        drag = drag * (1. + ddist*6.);
    else
        drag = drag * (1. - ddist);
    
    // if(texcol < 0.01){
    //     drag = .9;   
    // }

    //vel = vel + acc*1.05;
    vel = vel + .0*vec2(1.,1.)+acc*.991;
    vel = vel * drag;

    pos = pos + vel*speed;

    // pos = fixpos(pos);
}


void compute(float time){
    vec2 acc = vec2(0., 0.);
    // vec2 mouse = vec2(u_Origin.x, u_simulation.y-u_Origin.y);
    float speed = .034;

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
    incx = 1. + 7. * power(clamp(simplex3d_fractal(vec3(mod(time*3., 1000.0)*0.001 + pos.y/u_simulation.y*.06 + u_globalseed*12.13)), -1., 1.)/2.+.5, 4.);
    incy = 1. + 2. * power(clamp(simplex3d_fractal(vec3(mod(time*3., 1000.0)*0.001 + pos.x/u_simulation.x*.03 + .41 + u_globalseed*12.13)), -1., 1.)/2.+.5, 4.);
    float incxx = 1. + 5. * power(clamp(simplex3d_fractal(vec3(mod(time*3., 1000.0)*0.001 + pos.y/u_simulation.y*.06 + .1251 + u_globalseed*12.13)), -1., 1.)/2.+.5, 4.);
    float incyy = 1. + 12. * power(clamp(simplex3d_fractal(vec3(mod(time*3., 1000.0)*0.001 + pos.y/u_simulation.y*.06+ .8888 + u_globalseed*12.13)), -1., 1.)/2.+.5, 4.);
    poss.x = floor(incx*poss.x)/incx + floor(incxx)*0.;
    poss.y = floor(incy*poss.y)/incy + floor(incyy)*.0;
    vec3 nzp = vec3(poss.x, poss.y, ttime*0.002 + u_globalseed*12.13)*2.;
    vec2 noisexy = vec2(0., 0.);
    float qq = clamp(simplex3d(nzp*0.5+vec3(0.2589, 0.4891, 5.1311) + u_globalseed*12.13), -1.0, 1.0);

    float r = .6;
    float ang = 33.*simplex3d(nzp*0.0527*qq);
    float ang2 = 47.*simplex3d(nzp*0.0527*qq);

    noisexy.x = r*cos(ang)*1.5 + 0.0*r*cos(ang2);
    noisexy.y = r*sin(ang)*1.5 + 0.0*r*sin(ang2);

    float dist = 4.*pow(length(tc-.5)*2./1.414, 4.);

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


    float drag = 0.99 + 0.01 * a_seed.x;
     drag = drag  - (.5-abs(texcol-.5));
    //drag = drag  - texcol*.96;

    // drag = power(noise(vec2(texcol, texcol)*3.), 6.);
    
    vec2 center = vec2(.5, .5); // + .5*(-.5 + power(noise(vec2(u_globalseed)*44.11414), 3.));
    float ddist = pow(length(tc-center)*2./1.314, 5.)*1.6;

    vec2 posq = pos.xy;
    posq = floor(posq/114.)*4.;

    if(texcol > 0.01){
        // ddist = smoothstep(.2, .3, ddist);
         drag = drag * (1. + ddist*(3.+3.*power(noise(pos*.00151+u_globalseed*14.41), 5.)));
        //drag = drag * (1. + ddist*6.);
    }
    else
        drag = drag * (1. - ddist);
    
    // if(texcol < 0.01){
    //     drag = .9;   
    // }

    //vel = vel + acc*1.05;
    vel = vel + .0*vec2(1.,1.)+acc*.991;
    vel = vel * drag;

    pos = pos + vel*speed;

    //  pos = fixpos(pos, u_brd, u_simulation);
}
