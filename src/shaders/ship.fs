varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
void main() {
  // Light direction (from above-back)
  vec3 lightDir = normalize(vec3(0.3, 1.0, -0.5));
  
  // Compute Lambertian diffuse lighting
  float diffuse = max(dot(vNormal, lightDir), 0.0);
  
  // Add ambient light
  float ambient = 0.5;
  float lighting = ambient + diffuse * .8;
  
  // Base color: a subtle cyan/blue
  vec3 baseColor = vec3(
    sin(vUv.x * 1.5) * 0.75 + 0.25, 
    cos(vUv.y * 1.5) * 0.75 + 0.25, 
    1.);
  vec3 finalColor = baseColor * lighting;
  finalColor += pow(finalColor, vec3(32.0)) * 8.; // subtle bloom-like effect
  
  gl_FragColor = vec4(finalColor, 1.0);
}
