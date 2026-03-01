import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
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
const controls = new OrbitControls(camera, canvas)
const shipTarget = new THREE.Vector3()

// Initialize camera
camera.position.set(1, 6, 6)
controls.target.set(0, 1, 0)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.screenSpacePanning = false
controls.minDistance = 4
controls.maxDistance = 20
controls.maxPolarAngle = Math.PI / 2
controls.update()

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

const objectGroup = new THREE.Group()
scene.add(objectGroup)


const backgroundGeometry = new THREE.SphereGeometry(50, 64, 64)
backgroundShaderMaterial.side = THREE.BackSide
const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundShaderMaterial)
backgroundMesh.position.z = -10
backgroundMesh.frustumCulled = false
scene.add(backgroundMesh)

const groundGeometry = new THREE.PlaneGeometry(64, 64, 400, 400)
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
objectGroup.add(groundMesh)



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
objectGroup.add(ship);
ship.rotation.y = Math.PI / 2; // point forward along +x
ship.scale.set(4, 4, 4);





function animate() {
  requestAnimationFrame(animate)
  ship.position.y = 0.7 + Math.sin(timer.getElapsed() * 4) * 0.1;
  ship.rotation.x = Math.sin(timer.getElapsed()) * 0.1;
  ship.rotation.y = Math.PI / 2 + Math.sin(timer.getElapsed() * 0.5 + .1) * 0.1;
  ship.rotation.z = Math.cos(0.2 * timer.getElapsed()) * 0.05;

  // Update OrbitControls target to follow the ship
  ship.getWorldPosition(shipTarget);
  controls.target.copy(shipTarget);
  
  // Clamp camera to never go below ground
  if (camera.position.y < 3) {
    camera.position.y = 3;
  }

  updateUniforms();
  controls.update();
  renderer.render(scene, camera)
}

animate()

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
