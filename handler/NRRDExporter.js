import * as fflate from '../libs/fflate.module.js';

class NRRDExporter {

    parse( volume ) {

        let output;

        const header = volume.header
        const data = volume.data

        // Todo: should save whole header string into header when parsing it
        let headerText = ''

        headerText += 'NRRD0005\n'
        headerText += `type: ${header.type}\n`
        headerText += `dimension: ${header.dim}\n`
        headerText += `sizes: ${header.sizes[0]} ${header.sizes[1]} ${header.sizes[2]}\n`
        headerText += `encoding: ${header.encoding}\n`
        headerText += '\n'

        // write header info into buffer
        const codes = Array.from(headerText, char => char.charCodeAt(0));
        const buffer = new ArrayBuffer(codes.length);
        const bytes1 = new Uint8Array(buffer);
        for ( let i = 0; i < codes.length; i++ ) { bytes1[i] = codes[i]; }

        // write data info into buffer (compress it as well)
        const bytes2 = fflate.gzipSync(data);
        // merge header & data info
        const bytes = mergeUint8Arrays(bytes1, bytes2);
        // save it
        output = new Blob( [ bytes ], { type: 'application/octet-stream' } );

        return output

    }
}

function mergeUint8Arrays(array1, array2) {

    const mergedArray = new Uint8Array(array1.length + array2.length);

    mergedArray.set(array1, 0);
    mergedArray.set(array2, array1.length);

    return mergedArray;

}

export { NRRDExporter };