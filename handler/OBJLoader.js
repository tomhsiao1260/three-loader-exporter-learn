import { Loader } from './Loader';

import { FileLoader } from 'three';

const _face_vertex_data_separator_pattern = /\s+/;

function ParserState() {

    const state = {
        vertices: [],
        normals: [],
        colors: [],
        uvs: [],

        addFace: function ( a, b, c, ua, ub, uc, na, nb, nc ) {
            console.log('f info: ', 'v ', a, b, c, 'vt ', ua, ub, uc, 'vn ', na, nb, nc)
        }
    }

    return state
}

class OBJLoader extends Loader {

    constructor( manager ) {

        super( manager );

        this.materials = null;

    }

    load( url, onLoad, onProgress, onError ) {

        const scope = this;

        const loader = new FileLoader();

        loader.load( url, function ( text ) {

            onLoad( scope.parse( text ) );

        }, onProgress, onError );

    }

    parse( text ) {
        const state = new ParserState();

        const lines = text.split( '\n' );

        for ( let i = 0, l = lines.length; i < l; i ++ ) {

            const line = lines[ i ].trimStart();

            if ( line.length === 0 ) continue;

            const lineFirstChar = line.charAt( 0 );

            // @todo invoke passed in handler if any
            if ( lineFirstChar === '#' ) continue; // skip comments

            if ( lineFirstChar === 'v' ) {
                const data = line.split( _face_vertex_data_separator_pattern );

                switch ( data[ 0 ] ) {
                    case 'v':
                        state.vertices.push(
                            parseFloat( data[ 1 ] ),
                            parseFloat( data[ 2 ] ),
                            parseFloat( data[ 3 ] )
                        );
                        break;
                    case 'vn':
                        state.normals.push(
                            parseFloat( data[ 1 ] ),
                            parseFloat( data[ 2 ] ),
                            parseFloat( data[ 3 ] )
                        );
                        break;
                    case 'vt':
                        state.uvs.push(
                            parseFloat( data[ 1 ] ),
                            parseFloat( data[ 2 ] )
                        );
                        break;
                }
            } else if ( lineFirstChar === 'f' ) {

                const lineData = line.slice( 1 ).trim();
                const vertexData = lineData.split( _face_vertex_data_separator_pattern );
                const faceVertices = [];

                // Parse the face vertex data into an easy to work with format

                for ( let j = 0, jl = vertexData.length; j < jl; j ++ ) {

                    const vertex = vertexData[ j ];

                    if ( vertex.length > 0 ) {

                        const vertexParts = vertex.split( '/' );
                        faceVertices.push( vertexParts );

                    }

                }

                // Draw an edge between the first vertex and all subsequent vertices to form an n-gon

                const v1 = faceVertices[ 0 ];
                const v2 = faceVertices[ 1 ];
                const v3 = faceVertices[ 2 ];

                state.addFace(
                    v1[ 0 ], v2[ 0 ], v3[ 0 ],
                    v1[ 1 ], v2[ 1 ], v3[ 1 ],
                    v1[ 2 ], v2[ 2 ], v3[ 2 ]
                );

            }
        }

        // console.log('state: ', state);

        return text
    }

}

export { OBJLoader };
