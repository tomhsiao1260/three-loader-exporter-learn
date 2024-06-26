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
        loader.setResponseType( 'arraybuffer' );
        loader.load( url, function ( data ) {

            onLoad( scope.parse( data ) );

        }, onProgress, onError );

    }

    parse( data ) {

        // this parser is largely inspired from the XTK NRRD parser : https://github.com/xtk/X

        let _data = data;

        // uchar: 1 byte data types
        console.log('ArrayBuffer Length: ', _data.byteLength);
        console.log('ArrayBuffer: ', _data);
        console.log('ArrayBuffer to Uint8Array: ', new Uint8Array(_data));

        const _bytes = new Uint8Array(_data);

        return data
    }
}

export { NRRDLoader };
