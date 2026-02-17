
const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

const ICON_DIR = '/Users/davis/Desktop/Vibin/Personal Projects/Mama\'s Birthday/Watercolor Mahjong/public/icons';
const SOURCE_IMAGE = path.join(ICON_DIR, 'logo_tile_icon.png');
const BACKGROUND_COLOR = 0xFDF8F0FF; // Warm Cream (#FDF8F0)

async function processIcons() {
    try {
        console.log(`Reading source image: ${SOURCE_IMAGE}`);
        const image = await Jimp.read(SOURCE_IMAGE);

        // 1. Process the source image to remove pure white if necessary
        // (Keeping original logic but slightly refined for clarity)
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];

            // If it's very close to white, make it transparent
            // This allows us to composite it onto our chosen background color cleanly
            if (r > 250 && g > 250 && b > 250) {
                this.bitmap.data[idx + 3] = 0;
            }
        });

        const sizes = [
            { name: 'icon-512.png', size: 512 },
            { name: 'icon-192.png', size: 192 },
            { name: 'apple-touch-icon.png', size: 180 }
        ];

        for (const { name, size } of sizes) {
            // Create a new solid background image
            const icon = new Jimp(size, size, BACKGROUND_COLOR);

            // Clone and resize the transparent logo
            const logo = image.clone().resize(size, size);

            // Composite the logo onto the solid background
            icon.composite(logo, 0, 0);

            const outputPath = path.join(ICON_DIR, name);
            await icon.writeAsync(outputPath);
            console.log(`Generated ${name} (${size}x${size}) with Warm Cream background`);
        }

        console.log('Icon processing complete!');

    } catch (err) {
        console.error('Error processing icons:', err);
        process.exit(1);
    }
}

processIcons();

