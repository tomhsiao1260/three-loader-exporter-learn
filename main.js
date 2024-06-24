import { OBJLoader } from './handler/OBJLoader'
import { OBJExporter } from './handler/OBJExporter'

async function handle() {
    const loader_data = await new OBJLoader().loadAsync('triangle.obj')
    console.log('Loader: ', loader_data)

    const exporter = new OBJExporter()
    const exporter_data = exporter.parse(loader_data)
    console.log('Exporter: ', exporter_data)
}

handle()

