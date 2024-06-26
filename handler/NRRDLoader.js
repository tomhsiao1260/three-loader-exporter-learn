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

        //parse the header
        function parseHeader( header ) {

            console.log('header: ', header);

            let data, field, fn, l, m, _i, _len;
            const lines = header.split( /\r?\n/ );
            for ( _i = 0, _len = lines.length; _i < _len; _i ++ ) {

                l = lines[ _i ];
                if ( l.match( /NRRD\d+/ ) ) {

                    headerObject.isNrrd = true;

                } else if ( ! l.match( /^#/ ) && ( m = l.match( /(.*):(.*)/ ) ) ) {

                    field = m[ 1 ].trim();
                    data = m[ 2 ].trim();
                    fn = _fieldFunctions[ field ];
                    if ( fn ) {

                        fn.call( headerObject, data );

                    } else {

                        headerObject[ field ] = data;

                    }

                }

            }

            if ( ! headerObject.isNrrd ) {

                throw new Error( 'Not an NRRD file' );

            }

            if ( headerObject.encoding === 'bz2' || headerObject.encoding === 'bzip2' ) {

                throw new Error( 'Bzip is not supported' );

            }

            if ( ! headerObject.vectors ) {

                //if no space direction is set, let's use the identity
                headerObject.vectors = [ ];
                headerObject.vectors.push( [ 1, 0, 0 ] );
                headerObject.vectors.push( [ 0, 1, 0 ] );
                headerObject.vectors.push( [ 0, 0, 1 ] );

                //apply spacing if defined
                if ( headerObject.spacings ) {

                    for ( i = 0; i <= 2; i ++ ) {

                        if ( ! isNaN( headerObject.spacings[ i ] ) ) {

                            for ( let j = 0; j <= 2; j ++ ) {

                                headerObject.vectors[ i ][ j ] *= headerObject.spacings[ i ];

                            }

                        }

                    }

                }

            }

            console.log('headerObject: ', headerObject);

        }

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

        // parse the header
        const headerObject = {};
        parseHeader( _header );

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

const _fieldFunctions = {

    type: function ( data ) {

        switch ( data ) {

            case 'uchar':
            case 'uint8':
            case 'uint8_t':
                this.__array = Uint8Array;
                break;
            case 'int16':
            case 'int16_t':
                this.__array = Int16Array;
                break;
            case 'uint16':
            case 'uint16_t':
                this.__array = Uint16Array;
                break;
            default:
                throw new Error( 'Unsupported NRRD data type: ' + data );

        }

        return this.type = data;

    },

    encoding: function ( data ) {

        return this.encoding = data;

    },

    dimension: function ( data ) {

        return this.dim = parseInt( data, 10 );

    },

    sizes: function ( data ) {

        let i;
        return this.sizes = ( function () {

            const _ref = data.split( /\s+/ );
            const _results = [];

            for ( let _i = 0, _len = _ref.length; _i < _len; _i ++ ) {

                i = _ref[ _i ];
                _results.push( parseInt( i, 10 ) );

            }

            return _results;

        } )();

    },

};

export { NRRDLoader };
