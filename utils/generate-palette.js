const fs = require('node:fs');
const colorsArray = require('nice-color-palettes/1000');
const PNG = require('pngjs').PNG;

function convertHexToRGB(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return [r, g, b];
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function createPaletteImage() {
    // Create directory if it does not exist
    if (!fs.existsSync('./images')) {
        fs.mkdirSync('./images');
    }

    const png1 = new PNG({
        width: 100,
        height: 100,
        filterType: -1,
    });
    const png2 = new PNG({
        width: 200,
        height: 100,
        filterType: -1,
    });
    const png3 = new PNG({
        width: 300,
        height: 100,
        filterType: -1,
    });
    const png4 = new PNG({
        width: 400,
        height: 100,
        filterType: -1,
    });
    const png5 = new PNG({
        width: 500,
        height: 100,
        filterType: -1,
    });

    const pngs = [png1, png2, png3, png4, png5];

    let xMin = 0;
    let xMax = 100;

    const hexColors = colorsArray[randomIntFromInterval(0, colorsArray.length - 1)];
    // let currentSquare = 0;

    for (let square = 0; square < 5; square++) {
        for (let y = 0; y < png5.height; y++) {
            for (let x = xMin; x < xMax; x++) {
                const rgb = convertHexToRGB(hexColors[square]);

                const idx1 = (png1.width * y + x) << 2;
                const idx2 = (png2.width * y + x) << 2;
                const idx3 = (png3.width * y + x) << 2;
                const idx4 = (png4.width * y + x) << 2;
                const idx5 = (png5.width * y + x) << 2;

                const idxs = [idx1, idx2, idx3, idx4, idx5];

                let current = square;
                while (current < 5) {
                    pngs[current].data[idxs[current]] = rgb[0]; // red
                    pngs[current].data[idxs[current] + 1] = rgb[1]; // green
                    pngs[current].data[idxs[current] + 2] = rgb[2]; // blue
                    pngs[current].data[idxs[current] + 3] = 255; // alpha (0 is transparent)
                    current += 1;
                }
            }
        }

        xMin += 100;
        xMax += 100;
    }

    for (let i = 0; i < 5; i++) {
        const outputLocation = './images/out' + i.toString() + '.png';
        pngs[i].pack().pipe(fs.createWriteStream(outputLocation));
    }

    const values = { 'hex': hexColors };

    fs.writeFileSync('./images/hexValues.json', JSON.stringify(values));
}

module.exports = { createPaletteImage };