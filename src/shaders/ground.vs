varying vec2 vUv;
varying vec3 vPos;
uniform float time;
void main()	{
  vUv = uv;
  vPos = position;
  float s = sin(position.x);
  float c = cos(position.y + time * 2.);
  vec3 p = position + vec3(0, 0, s * (s - c) * s * .7);
  gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );
}