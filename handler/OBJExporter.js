import {
    Color,
    Matrix3,
    Vector2,
    Vector3
} from 'three';

class OBJExporter {
    parse( object ) {

        let output = '';

        const vertex = new Vector3();

        function parseMesh( mesh ) {

            let nbVertex = 0;

            const geometry = mesh.geometry;

            // shortcuts
            const vertices = geometry.getAttribute( 'position' );
            const normals = geometry.getAttribute( 'normal' );
            const uvs = geometry.getAttribute( 'uv' );
            const indices = geometry.getIndex();

            console.log('vertices: ', vertices.array);
            console.log('normals: ', normals.array);
            console.log('uvs: ', uvs.array);
            console.log('indices: ', indices);

            // vertices

            if ( vertices !== undefined ) {

                for ( let i = 0, l = vertices.count; i < l; i ++, nbVertex ++ ) {

                    vertex.fromBufferAttribute( vertices, i );

                    // transform the vertex to world space
                    vertex.applyMatrix4( mesh.matrixWorld );

                    // transform the vertex to export format
                    output += 'v ' + vertex.x + ' ' + vertex.y + ' ' + vertex.z + '\n';

                }

            }

        }

        object.traverse( function ( child ) {

            if ( child.isMesh === true ) {

                parseMesh( child );

            }

        } );

        return output
    }
}

export { OBJExporter };
