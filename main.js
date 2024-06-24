import * as THREE from 'three'
import { OBJLoader } from './handler/OBJLoader'

async function handle() {
    const loader_data = await new OBJLoader().loadAsync('triangle.obj')
    console.log('Loader: ', loader_data)
}

handle()

