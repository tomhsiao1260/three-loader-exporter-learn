class NRRDExporter {

    parse( volume ) {

        let output;

        const header = volume.header
        const data = volume.data

        console.log(header)
        console.log(data)

        // Todo: should save whole header string into header when parsing it
        let headerText = ''

        headerText += 'NRRD0005\n'
        headerText += `type: ${header.type}\n`
        headerText += `dimension: ${header.dim}\n`
        headerText += `sizes: ${header.sizes[0]} ${header.sizes[1]} ${header.sizes[2]}\n`
        headerText += `encoding: ${header.encoding}\n`
        headerText += '\n\n'

        console.log(headerText)
    }
}

export { NRRDExporter };