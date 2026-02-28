uniform float time;
varying vec2 vUv;
varying vec3 vPos;
void main() {
  float u = .7 * cos(vPos.y * .44 + vPos.z * 4.);
  float v = .7 * cos(vPos.x * .44 + vPos.z * 4.);
  float z = 1. - clamp(vPos.y * .1, 0., 1.);
  vec3 color = vec3(.9, .7, 1.) * v;
  gl_FragColor = vec4(color * z, 1.); 
}
