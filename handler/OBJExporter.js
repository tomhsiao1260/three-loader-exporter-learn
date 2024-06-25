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
            let nbNormals = 0;
            let nbVertexUvs = 0;

            const normal = new Vector3();
            const uv = new Vector2();

            const geometry = mesh.geometry;

            const normalMatrixWorld = new Matrix3();

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

            // uvs

            if ( uvs !== undefined ) {

                for ( let i = 0, l = uvs.count; i < l; i ++, nbVertexUvs ++ ) {

                    uv.fromBufferAttribute( uvs, i );

                    // transform the uv to export format
                    output += 'vt ' + uv.x + ' ' + uv.y + '\n';

                }

            }

            // normals

            if ( normals !== undefined ) {

                normalMatrixWorld.getNormalMatrix( mesh.matrixWorld );

                for ( let i = 0, l = normals.count; i < l; i ++, nbNormals ++ ) {

                    normal.fromBufferAttribute( normals, i );

                    // transform the normal to world space
                    normal.applyMatrix3( normalMatrixWorld ).normalize();

                    // transform the normal to export format
                    output += 'vn ' + normal.x + ' ' + normal.y + ' ' + normal.z + '\n';

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
