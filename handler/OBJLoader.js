import { Loader } from './Loader';

class OBJLoader extends Loader {

    constructor( manager ) {

        super( manager );

        this.materials = null;

    }

    load( url, onLoad, onProgress, onError ) {

        console.log('url: ', url);

        onLoad( 'onLoad!' );

    }

}

export { OBJLoader };