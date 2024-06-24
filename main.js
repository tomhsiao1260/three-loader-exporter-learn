import './style.css'
import * as THREE from 'three'
import { OBJLoader } from './handler/OBJLoader'
import { OBJExporter } from './handler/OBJExporter'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

async function handler() {
    const loader_data = await new OBJLoader().loadAsync('triangle.obj')
    console.log('Loader: ', loader_data)

    const exporter = new OBJExporter()
    const exporter_data = exporter.parse(loader_data)
    console.log('Exporter: ', exporter_data)

    const mesh = loader_data.children[0]
    mesh.material = new THREE.MeshNormalMaterial()
    console.log('Mesh: ', mesh)

    return mesh
}

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
})

const scene = new THREE.Scene()

async function init() {
    const mesh = await handler()
    scene.add(mesh)
}
init()

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(sizes.width, sizes.height)

const controls = new OrbitControls(camera, canvas)
controls.target = new THREE.Vector3(0,0,0)
controls.enableDamping = true

const tick = () => {
    controls.update()
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}
tick()
