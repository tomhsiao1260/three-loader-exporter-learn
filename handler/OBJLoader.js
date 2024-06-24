import { Loader } from './Loader';

import { FileLoader } from 'three';

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
        return text
    }

}

export { OBJLoader };