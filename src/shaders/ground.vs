varying vec2 vUv;
varying vec3 vPos;
varying vec3 vProjectedPosition;
uniform float time;
void main()	{
  vUv = uv;

  float s = sin(position.x * .25);
  float c = cos(position.y * .25 + time * .5);
  vec3 p = position + vec3(0, 0, s * (s - c) * s * 2.6);
  vec4 projectedPosition = modelMatrix * vec4(p, 1.0);
  vProjectedPosition = projectedPosition.xyz;
  vPos = p;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );
}