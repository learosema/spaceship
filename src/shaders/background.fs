uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

// just a bunch of sin & cos to generate an interesting pattern
float cheapNoise(vec3 stp) {
  vec3 p = vec3(stp.st, stp.p);
  // tweak these here: https://codepen.io/learosema/pen/mdWJYJM?editors=1010
  vec4 a = vec4(7.3, 18.4, 26.4, 20.5);
  return mix(
    sin(p.z + p.x * a.x + cos(p.y * a.x - p.z)) * 
    cos(p.z + p.y * a.y + cos(p.y * a.x + p.z)),
    sin(2. + p.x * a.z + p.z + cos(p.y * a.w - p.z)) * 
    cos(2. + p.y * a.w + p.z + cos(p.x * a.x + p.z)), 
    .46
  );
}

void main() {
  vec3 p = vec3(vUv.x, vUv.y + time * 0.05, time * .5);
  float n = .125 + .5 * cheapNoise(p * 0.125);
  float m = .5 + .5 * cheapNoise(p * 0.3);
  float o = .5 + .5 * cheapNoise(p * 0.7);
  float bg0 = (.25 + .25 * sin(n * 4. * 3.14159));
  float bg1 = (.25 + .25 * sin(m * 4. * 3.14159));
  float bg2 = (.25 + .25 * sin(o * 4. * 3.14159));
  vec3 bg = vec3(0,0.1,0.2)*bg0 + vec3(0.5,0.1,0.3)*bg1 + vec3(0.1,0.1,0)*bg2;
  gl_FragColor = vec4(bg,1.);
}
