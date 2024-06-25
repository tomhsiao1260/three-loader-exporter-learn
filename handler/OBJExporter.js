class OBJExporter {
    parse( object ) {

        function parseMesh( mesh ) {

            console.log('traverse & find a mesh', mesh);

        }

        object.traverse( function ( child ) {

            if ( child.isMesh === true ) {

                parseMesh( child );

            }

        } );
    }
}

export { OBJExporter };
