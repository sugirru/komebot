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
    const png = new PNG({
        width: 500,
        height: 100,
        filterType: -1,
    });

    let xMin = 0;
    let xMax = 100;

    const hexColors = colorsArray[randomIntFromInterval(0, colorsArray.length - 1)];

    for (let square = 0; square < 5; square++) {
        for (let y = 0; y < png.height; y++) {
            for (let x = xMin; x < xMax; x++) {
                const rgb = convertHexToRGB(hexColors[square]);

                const idx = (png.width * y + x) << 2;

                png.data[idx] = rgb[0]; // red
                png.data[idx + 1] = rgb[1]; // green
                png.data[idx + 2] = rgb[2]; // blue
                png.data[idx + 3] = 255; // alpha (0 is transparent)
            }
        }
        xMin += 100;
        xMax += 100;
    }

    // Create directory if it does not exist
    if (!fs.existsSync('./images')) {
        fs.mkdirSync('./images');
    }

    png.pack().pipe(fs.createWriteStream('./images/out.png'));

    const values = { 'hex': hexColors };

    fs.writeFileSync('./images/hexValues.json', JSON.stringify(values));
}

module.exports = { createPaletteImage };