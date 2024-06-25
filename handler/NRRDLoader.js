import { Loader } from './Loader';

class NRRDLoader extends Loader {
    constructor( manager ) {

        super( manager );

    }

    load( url, onLoad, onProgress, onError ) {

        console.log('processing NRRD format here ...')
    }
}

export { NRRDLoader };