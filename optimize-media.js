import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = './public';
const BG_DIR = path.join(PUBLIC_DIR, 'the new Background');

async function optimizeImages() {
    console.log('--- Starting Media Optimization ---');

    try {
        // 1. Optimize heavy background image
        const bgInput = path.join(BG_DIR, 'Title_a_luxurious_2k_202601132212.jpeg');
        const bgOutput = path.join(BG_DIR, 'Title_a_luxurious_2k.webp');

        if (fs.existsSync(bgInput)) {
            console.log(`Optimizing background image: ${bgInput}`);
            await sharp(bgInput)
                .resize({ width: 1920, fit: 'inside', withoutEnlargement: true })
                .webp({ quality: 75 })
                .toFile(bgOutput);
            console.log(`Saved optimized background image: ${bgOutput} (${(fs.statSync(bgOutput).size / 1024).toFixed(2)} KB)`);
        } else {
            console.warn(`Background image not found: ${bgInput}`);
        }

        // 2. Convert heavy PNGs in public folder to WebP
        const pngFiles = ['collection-group.png', 'fabric-detail.png', 'founder.png', 'hero-suit.png'];
        for (const file of pngFiles) {
            const inputPath = path.join(PUBLIC_DIR, file);
            const outputPath = path.join(PUBLIC_DIR, file.replace('.png', '.webp'));

            if (fs.existsSync(inputPath)) {
                console.log(`Optimizing and converting PNG: ${inputPath}`);
                await sharp(inputPath)
                    .webp({ quality: 80 })
                    .toFile(outputPath);
                console.log(`Saved optimized WebP: ${outputPath} (${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB)`);
            } else {
                console.warn(`PNG file not found: ${inputPath}`);
            }
        }

        // 3. Optimize heavy 606KB favicon.ico to a lightweight 32x32 favicon.png
        const faviconInput = path.join(PUBLIC_DIR, 'favicon.ico');
        const faviconOutput = path.join(PUBLIC_DIR, 'favicon.png');

        if (fs.existsSync(faviconInput)) {
            console.log(`Optimizing favicon: ${faviconInput}`);
            await sharp(faviconInput)
                .resize(32, 32)
                .png()
                .toFile(faviconOutput);
            console.log(`Saved optimized favicon: ${faviconOutput} (${(fs.statSync(faviconOutput).size / 1024).toFixed(2)} KB)`);
        } else {
            console.warn(`Favicon not found: ${faviconInput}`);
        }

        console.log('--- Media Optimization Completed Successfully ---');
    } catch (error) {
        console.error('Error during media optimization:', error);
    }
}

optimizeImages();
