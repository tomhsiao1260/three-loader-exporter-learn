import './style.css'
import * as THREE from 'three'
import { OBJLoader } from './handler/OBJLoader'
import { OBJExporter } from './handler/OBJExporter'
import { NRRDLoader } from './handler/NRRDLoader'
import { NRRDExporter } from './handler/NRRDExporter'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

async function handler() {
    const loader_obj = await new OBJLoader().loadAsync('quad.obj')
    console.log('OBJ Loader: ', loader_obj)

    const exporter_obj = new OBJExporter().parse(loader_obj)
    console.log('OBJ Exporter: ', exporter_obj)

    const mesh = loader_obj.children[0]
    mesh.material = new THREE.MeshNormalMaterial()

    const loader_nrrd = await new NRRDLoader().loadAsync('cube.nrrd')
    console.log('NRRD Loader: ', loader_nrrd)

    const volume = loader_nrrd
    const exporter_nrrd = new NRRDExporter().parse(volume)

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
