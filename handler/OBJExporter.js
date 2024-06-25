import {
    Color,
    Matrix3,
    Vector2,
    Vector3
} from 'three';

class OBJExporter {
    parse( object ) {

        let output = '';

        let indexVertex = 0;
        let indexVertexUvs = 0;
        let indexNormals = 0;

        const vertex = new Vector3();
        const normal = new Vector3();
        const uv = new Vector2();

        function parseMesh( mesh ) {

            let nbVertex = 0;
            let nbNormals = 0;
            let nbVertexUvs = 0;

            const geometry = mesh.geometry;

            const normalMatrixWorld = new Matrix3();

            // shortcuts
            const vertices = geometry.getAttribute( 'position' );
            const normals = geometry.getAttribute( 'normal' );
            const uvs = geometry.getAttribute( 'uv' );
            const indices = geometry.getIndex();

            const face = [];

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

            // faces

            if ( indices !== null ) {

                for ( let i = 0, l = indices.count; i < l; i += 3 ) {

                    for ( let m = 0; m < 3; m ++ ) {

                        const j = indices.getX( i + m ) + 1;

                        face[ m ] = ( indexVertex + j ) + ( normals || uvs ? '/' + ( uvs ? ( indexVertexUvs + j ) : '' ) + ( normals ? '/' + ( indexNormals + j ) : '' ) : '' );

                    }

                    // transform the face to export format
                    output += 'f ' + face.join( ' ' ) + '\n';

                }

            } else {

                for ( let i = 0, l = vertices.count; i < l; i += 3 ) {

                    for ( let m = 0; m < 3; m ++ ) {

                        const j = i + m + 1;

                        face[ m ] = ( indexVertex + j ) + ( normals || uvs ? '/' + ( uvs ? ( indexVertexUvs + j ) : '' ) + ( normals ? '/' + ( indexNormals + j ) : '' ) : '' );

                    }

                    // transform the face to export format
                    output += 'f ' + face.join( ' ' ) + '\n';

                }

            }

            // update index
            indexVertex += nbVertex;
            indexVertexUvs += nbVertexUvs;
            indexNormals += nbNormals;

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
