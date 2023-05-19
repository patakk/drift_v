precision mediump float;

uniform sampler2D u_texture;
varying vec2 v_texCoord;

void main() {
    gl_FragColor = vec4(v_texCoord.x, v_texCoord.y, 0., 1.);
    gl_FragColor = texture2D(u_texture, v_texCoord);
}