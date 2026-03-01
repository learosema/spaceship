uniform sampler2D tDiffuse;
uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

void main() {
  vec4 color = texture2D(tDiffuse, vUv);

  vec2 uv = vUv - 0.5;
  float vignette = smoothstep(0.8, 0.2, length(uv));
  gl_FragColor = vec4(color.rgb * vignette, color.a);
}
