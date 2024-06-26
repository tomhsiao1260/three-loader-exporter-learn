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

        // uchar: 1 byte data types
        let _data = data;

        const _bytes = new Uint8Array(_data);
        const _length = _bytes.length;
        let _header = null;
        let _data_start = 0;
        let i;

        for ( i = 1; i < _length; i ++ ) {

            if ( _bytes[ i - 1 ] == 10 && _bytes[ i ] == 10 ) {

                // we found two line breaks in a row
                // now we know what the header is
                _header = this.parseChars( _bytes, 0, i - 2 );
                // this is were the data starts
                _data_start = i + 1;
                break;

            }

        }

        console.log('NRRD header: ', _header);
        console.log('Data Length: ', _bytes.length);
        console.log('Data starting index: ', _data_start);

        return data
    }

    parseChars( array, start, end ) {

        // without borders, use the whole array
        if ( start === undefined ) {

            start = 0;

        }

        if ( end === undefined ) {

            end = array.length;

        }

        let output = '';
        // create and append the chars
        let i = 0;
        for ( i = start; i < end; ++ i ) {

            output += String.fromCharCode( array[ i ] );

        }

        return output;

    }
}

export { NRRDLoader };
