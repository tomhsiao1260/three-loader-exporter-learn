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

            const data = line.split( _face_vertex_data_separator_pattern );

            console.log('char: ', lineFirstChar, 'line: ', line);
            console.log('split: ', data)
        }

        return text
    }

}

export { OBJLoader };