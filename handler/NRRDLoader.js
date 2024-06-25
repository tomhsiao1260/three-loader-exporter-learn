import { Loader } from './Loader';

import {
    FileLoader,
    Matrix4,
    Vector3
} from 'three';

class NRRDLoader extends Loader {
    constructor( manager ) {

        super( manager );

    }

    load( url, onLoad, onProgress, onError ) {

        const scope = this;

        const loader = new FileLoader( scope.manager );
        loader.load( url, function ( data ) {

            onLoad( scope.parse( data ) );

        }, onProgress, onError );

    }

    parse( data ) {

        return data
    }
}

export { NRRDLoader };