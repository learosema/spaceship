uniform float time;
varying vec2 vUv;
varying vec3 vPos;
varying vec3 vProjectedPosition;

void main() {
  vec3 p = vProjectedPosition;
  
  float v = .5 + .7 * cos(p.x * .44 + p.z * .25-  time * .5);
  float z = .5 + .25 * sin(p.x * .125 + time * 0.25);
  vec3 color = vec3(.9, .7, 1.) * (.875 + .125 * p.y) * clamp(1. - vProjectedPosition.y * .1, 0. ,1.);
  vec3 finalColor = color * z + 0.4 * color * v;

  // Darken based on world-space Z so areas toward negative Z are darker (camera-independent)
  float backStart = 0.0; // begin darkening at z = 0
  float backEnd = 20.0;  // fully dark at z = -20
  float backFactor = clamp((-p.z - backStart) / (backEnd - backStart), 0.0, 1.0);
  float darkMix = mix(1.0, 0.35, backFactor);
  finalColor *= darkMix;

  gl_FragColor = vec4(finalColor, 1.);
}
