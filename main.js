import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js' // Import correct OrbitControls
import gsap from "gsap"

// Scene
const scene = new THREE.Scene()

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Camera
const camera = new THREE.PerspectiveCamera(30, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 20
scene.add(camera)

// Renderer
const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio) //This helps to clean the edge

// Orbit Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 4

// Resize Event
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
})

// Lights
const light = new THREE.PointLight("#ffffff", 60 , 100, 1.3)
light.position.set(0, 10, 10)
light.castShadow = true
scene.add(light)
light.shadow.mapSize.width = 512; // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500;
// Create Sphere for Light Source
const lightSphereGeometry = new THREE.SphereGeometry(0.5, 64, 64)
const lightSphereMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff' , roughness: 0.2})
const lightSphere = new THREE.Mesh(lightSphereGeometry, lightSphereMaterial)
lightSphere.position.copy(light.position)
scene.add(lightSphere)

// Create Spheres
const sphereCount = 5 // Number of spheres
const spheres = []

for (let i = 0; i < sphereCount; i++) {
  const radius = Math.random()*2 + 1; // Random radius between 1 and 3
  const geometry = new THREE.SphereGeometry(radius, 32, 32)
  const material = new THREE.MeshStandardMaterial({
    color: "#00ff83",
    roughness: 0.5
  })
  const mesh = new THREE.Mesh(geometry, material)
  
  // Position each sphere at different locations in the scene
  mesh.position.x = Math.random() * 20 - 10
  mesh.position.y = Math.random() * 20 - 10
  mesh.position.z = Math.random() * 0 - 10
  
  scene.add(mesh)
  spheres.push(mesh)
}

// Mouse Interaction
let rgb = []

window.addEventListener('mousedown', () => {
  rgb = [
    Math.random(),
    Math.random(),
    Math.random(),
  ]
})

window.addEventListener('mousemove', (e) => {
  if (rgb.length === 3) {
    for (const sphere of spheres) {
      sphere.material.color.setRGB(rgb[0], rgb[1], rgb[2])
    }
  }
})

// Animation Loop
const animate = () => {
  controls.update()
  lightSphere.position.copy(light.position) // Update position of light sphere to match light
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

animate()
