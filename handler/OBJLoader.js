import { Loader } from './Loader';

import { FileLoader } from 'three';

class OBJLoader extends Loader {

    constructor( manager ) {

        super( manager );

        this.materials = null;

    }

    load( url, onLoad, onProgress, onError ) {

        console.log('url: ', url);

        const loader = new FileLoader();

        loader.load( url, function ( text ) {

            onLoad(text);

        }, onProgress, onError );

    }

}

export { OBJLoader };