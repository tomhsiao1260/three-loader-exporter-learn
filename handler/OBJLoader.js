import { Loader } from './Loader';

import {
    BufferGeometry,
    FileLoader,
    Float32BufferAttribute,
    Group,
    Mesh,
    MeshPhongMaterial,
    Vector3
} from 'three';

const _face_vertex_data_separator_pattern = /\s+/;

const _vA = new Vector3();
const _vB = new Vector3();
const _vC = new Vector3();

const _ab = new Vector3();
const _cb = new Vector3();

function ParserState() {

    const state = {
        object: {},

        vertices: [],
        normals: [],
        colors: [],
        uvs: [],

        startObject: function () {

            this.object = {
                geometry: {
                    vertices: [],
                    normals: [],
                    colors: [],
                    uvs: [],
                    hasUVIndices: false
                }
            };

        },

        parseVertexIndex: function ( value, len ) {

            const index = parseInt( value, 10 );
            return ( index >= 0 ? index - 1 : index + len / 3 ) * 3;

        },

        parseNormalIndex: function ( value, len ) {

            const index = parseInt( value, 10 );
            return ( index >= 0 ? index - 1 : index + len / 3 ) * 3;

        },

        parseUVIndex: function ( value, len ) {

            const index = parseInt( value, 10 );
            return ( index >= 0 ? index - 1 : index + len / 2 ) * 2;

        },

        addVertex: function ( a, b, c ) {

            const src = this.vertices;
            const dst = this.object.geometry.vertices;

            dst.push( src[ a + 0 ], src[ a + 1 ], src[ a + 2 ] );
            dst.push( src[ b + 0 ], src[ b + 1 ], src[ b + 2 ] );
            dst.push( src[ c + 0 ], src[ c + 1 ], src[ c + 2 ] );

        },

        addNormal: function ( a, b, c ) {

            const src = this.normals;
            const dst = this.object.geometry.normals;

            dst.push( src[ a + 0 ], src[ a + 1 ], src[ a + 2 ] );
            dst.push( src[ b + 0 ], src[ b + 1 ], src[ b + 2 ] );
            dst.push( src[ c + 0 ], src[ c + 1 ], src[ c + 2 ] );

        },

        addFaceNormal: function ( a, b, c ) {

            const src = this.vertices;
            const dst = this.object.geometry.normals;

            _vA.fromArray( src, a );
            _vB.fromArray( src, b );
            _vC.fromArray( src, c );

            _cb.subVectors( _vC, _vB );
            _ab.subVectors( _vA, _vB );
            _cb.cross( _ab );

            _cb.normalize();

            dst.push( _cb.x, _cb.y, _cb.z );
            dst.push( _cb.x, _cb.y, _cb.z );
            dst.push( _cb.x, _cb.y, _cb.z );

        },

        addColor: function ( a, b, c ) {

            const src = this.colors;
            const dst = this.object.geometry.colors;

            if ( src[ a ] !== undefined ) dst.push( src[ a + 0 ], src[ a + 1 ], src[ a + 2 ] );
            if ( src[ b ] !== undefined ) dst.push( src[ b + 0 ], src[ b + 1 ], src[ b + 2 ] );
            if ( src[ c ] !== undefined ) dst.push( src[ c + 0 ], src[ c + 1 ], src[ c + 2 ] );

        },

        addUV: function ( a, b, c ) {

            const src = this.uvs;
            const dst = this.object.geometry.uvs;

            dst.push( src[ a + 0 ], src[ a + 1 ] );
            dst.push( src[ b + 0 ], src[ b + 1 ] );
            dst.push( src[ c + 0 ], src[ c + 1 ] );

        },

        addDefaultUV: function () {

            const dst = this.object.geometry.uvs;

            dst.push( 0, 0 );
            dst.push( 0, 0 );
            dst.push( 0, 0 );

        },

        addFace: function ( a, b, c, ua, ub, uc, na, nb, nc ) {
            const vLen = this.vertices.length;

            let ia = this.parseVertexIndex( a, vLen );
            let ib = this.parseVertexIndex( b, vLen );
            let ic = this.parseVertexIndex( c, vLen );

            this.addVertex( ia, ib, ic );
            this.addColor( ia, ib, ic );

            // normals

            if ( na !== undefined && na !== '' ) {

                const nLen = this.normals.length;

                ia = this.parseNormalIndex( na, nLen );
                ib = this.parseNormalIndex( nb, nLen );
                ic = this.parseNormalIndex( nc, nLen );

                this.addNormal( ia, ib, ic );

            } else {

                this.addFaceNormal( ia, ib, ic );

            }

            // uvs

            if ( ua !== undefined && ua !== '' ) {

                const uvLen = this.uvs.length;

                ia = this.parseUVIndex( ua, uvLen );
                ib = this.parseUVIndex( ub, uvLen );
                ic = this.parseUVIndex( uc, uvLen );

                this.addUV( ia, ib, ic );

                this.object.geometry.hasUVIndices = true;

            } else {

                // add placeholder values (for inconsistent face definitions)

                this.addDefaultUV();

            }
        }
    }

    state.startObject();

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

            console.log('raw input: ', text)

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

        const container = new Group();

        const geometry = state.object.geometry;
        let hasVertexColors = false;

        // Skip o/g line declarations that did not follow with any faces
        if ( geometry.vertices.length === 0 ) container;

        const buffergeometry = new BufferGeometry();

        buffergeometry.setAttribute( 'position', new Float32BufferAttribute( geometry.vertices, 3 ) );

        if ( geometry.normals.length > 0 ) {

            buffergeometry.setAttribute( 'normal', new Float32BufferAttribute( geometry.normals, 3 ) );

        }

        if ( geometry.colors.length > 0 ) {

            hasVertexColors = true;
            buffergeometry.setAttribute( 'color', new Float32BufferAttribute( geometry.colors, 3 ) );

        }

        if ( geometry.hasUVIndices === true ) {

            buffergeometry.setAttribute( 'uv', new Float32BufferAttribute( geometry.uvs, 2 ) );

        }

        // Create mesh

        const mesh = new Mesh( buffergeometry, new MeshPhongMaterial() );
        container.add( mesh );

        return container;
    }

}

export { OBJLoader };
