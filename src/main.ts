import * as THREE from 'three'
import './style.css'
import backgroundVS from './shaders/background.vs'
import backgroundFS from './shaders/background.fs'
import groundVS from './shaders/ground.vs'
import groundFS from './shaders/ground.fs'

const canvas: HTMLCanvasElement|null = document.querySelector('#canvas') as HTMLCanvasElement

if (! canvas) {
  throw new Error('Canvas element not found')
}

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
renderer.setSize(window.innerWidth, window.innerHeight)

const backgroundShaderMaterial = new THREE.ShaderMaterial({
  vertexShader: backgroundVS,
  fragmentShader: backgroundFS,
  uniforms: {
    time: { value: 0 },
    resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  },
})

const backgroundGeometry = new THREE.PlaneGeometry(50, 50)
const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundShaderMaterial)
backgroundMesh.position.z = -10
backgroundMesh.frustumCulled = false
scene.add(backgroundMesh)

const groundGeometry = new THREE.PlaneGeometry(64, 16, 640, 80)
const groundMaterial = new THREE.ShaderMaterial({
  vertexShader: groundVS,
  fragmentShader: groundFS,
  uniforms: {
    time: { value: 0 },
    resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  },
})
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial)
groundMesh.rotation.x = -Math.PI / 2
groundMesh.position.y = -1
scene.add(groundMesh)



const timer = new THREE.Timer()
timer.connect(document)

function updateUniforms() {
  timer.update()
  backgroundShaderMaterial.uniforms.time.value = timer.getElapsed()
  groundMaterial.uniforms.time.value = timer.getElapsed()
}


function createShip(): THREE.Object3D {
  const mat = new THREE.MeshNormalMaterial();

  const ship = new THREE.Group();

  // fuselage – a short cylinder lying on its side
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 2, 8),
    mat,
  );
  body.rotation.z = Math.PI / 2;          // point forward along +x
  ship.add(body);

  // nose cone
  const nose = new THREE.Mesh(
    new THREE.ConeGeometry(0.3, 0.5, 8),
    mat,
  );
  nose.position.x = 1;                     // attach to front of body
  nose.rotation.z = Math.PI / 2;
  ship.add(nose);

  // simple wings – two thin boxes
  const wingGeom = new THREE.BoxGeometry(1.2, 0.05, 0.4);
  const leftWing = new THREE.Mesh(wingGeom, mat);
  leftWing.position.set(0, 0, 0.4);
  ship.add(leftWing);

  const rightWing = leftWing.clone();
  rightWing.position.z = -0.4;
  ship.add(rightWing);

  return ship;
}

const ship = createShip();
ship.position.y = 0.7;
scene.add(ship);
ship.rotation.y = Math.PI / 2; // point forward along +x
ship.scale.set(2, 2, 2);


camera.position.z = 5

function animate() {
  requestAnimationFrame(animate)
  
  ship.rotation.x = Math.sin(timer.getElapsed()) * 0.26;
  ship.rotation.y = Math.PI / 2 + Math.sin(timer.getElapsed() * 0.5 + .1) * 0.1;
  ship.rotation.z = Math.cos(0.2 * timer.getElapsed()) * 0.05;
  updateUniforms()
  renderer.render(scene, camera)
}

animate()

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})