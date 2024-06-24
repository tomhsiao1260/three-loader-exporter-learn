import { Loader } from './Loader';

import { FileLoader } from 'three';

const _face_vertex_data_separator_pattern = /\s+/;

function ParserState() {

    const state = {
        vertices: [],
        normals: [],
        colors: [],
        uvs: []
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

        loader.load( 'quad.obj', function ( text ) {

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

                console.log('f line: ', faceVertices)
            }
        }

        console.log('state: ', state);

        return text
    }

}

export { OBJLoader };