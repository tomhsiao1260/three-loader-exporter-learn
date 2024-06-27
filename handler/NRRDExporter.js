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
        const headerBytes = new Uint8Array(buffer);
        for ( let i = 0; i < codes.length; i++ ) { headerBytes[i] = codes[i]; }
        // write data info into buffer (compress it as well)
        // Todo: only deal with 'gz' encoding case, should support 'ascii', 'raw' as well
        const dataBytes = fflate.gzipSync(data);
        // merge header & data info
        const bytes = new Uint8Array([ ...headerBytes, ...dataBytes ]);
        // save it
        output = new Blob( [ bytes ], { type: 'application/octet-stream' } );

        return output

    }
}

export { NRRDExporter };