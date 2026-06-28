// api/gallery.js — GET /api/gallery — List all albums and their suits (with multiple images and metadata) from Cloudinary
import { initCloudinary, GALLERY_FOLDER } from './_cloudinary.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const cloudinary = initCloudinary();

        // 1. Fetch metadata catalog from Cloudinary
        const catalogUrl = cloudinary.url(`${GALLERY_FOLDER}/catalog.json`, { resource_type: 'raw', secure: true });
        let catalog = {};
        try {
            const response = await fetch(catalogUrl);
            if (response.ok) {
                catalog = await response.json();
            }
        } catch (fetchErr) {
            console.warn('[api/gallery] Catalog fetch failed/empty:', fetchErr.message);
        }

        // 2. List all sub-folders = categories
        let foldersResult = await cloudinary.api.sub_folders(GALLERY_FOLDER);
        let folders = foldersResult.folders || [];

        // Self-healing: Ensure all 4 standard folders are explicitly created on Cloudinary
        const requiredFolders = ['Collection', 'Wedding', 'Casual', 'Luxury'];
        let needsRefetch = false;

        for (const reqFolder of requiredFolders) {
            const exists = folders.some(f => f.name.toLowerCase() === reqFolder.toLowerCase());
            if (!exists) {
                console.log(`[api/gallery] Creating missing folder: ${reqFolder}`);
                try {
                    await cloudinary.api.create_folder(`${GALLERY_FOLDER}/${reqFolder}`);
                    needsRefetch = true;
                } catch (err) {
                    console.error(`Failed to create folder ${reqFolder}:`, err.message);
                }
            }
        }

        if (needsRefetch) {
            foldersResult = await cloudinary.api.sub_folders(GALLERY_FOLDER);
            folders = foldersResult.folders || [];
        }

        // 3. Process each category and group images into suits
        const albums = await Promise.all(folders.map(async (folder) => {
            const categoryName = folder.name;
            const categoryPath = `${GALLERY_FOLDER}/${categoryName}`;

            // Get all images in this category prefix recursively
            const resources = await cloudinary.api.resources({
                type: 'upload',
                prefix: categoryPath,
                max_results: 500,
            });

            const allImages = (resources.resources || []).map(r => ({
                publicId: r.public_id,
                url: r.secure_url,
                filename: r.public_id.split('/').pop(),
                width: r.width,
                height: r.height,
                bytes: r.bytes,
            }));

            // Group images by suitId
            const suitMap = {};
            allImages.forEach(img => {
                const parts = img.publicId.split('/');
                let suitId = '';
                let isLegacy = false;

                // Cloudinary path: ibrahim-aliraqi-gallery/<CategoryName>/<SuitID>/<filename>
                // splits into parts: ['', '<CategoryName>', '<SuitID>', '<filename>'] depending on prefix or leading slash
                // Let's filter out empty elements to be safe
                const filteredParts = parts.filter(Boolean);
                // Expected filtered parts: ['ibrahim-aliraqi-gallery', 'Classic', 'suit_123', 'filename'] -> length 4
                
                if (filteredParts.length >= 4) {
                    suitId = filteredParts[2];
                } else {
                    // Legacy image directly in Category folder -> treat image itself as a single-image suit
                    suitId = img.filename.replace(/\.[^/.]+$/, '').trim();
                    isLegacy = true;
                }

                if (!suitMap[suitId]) {
                    suitMap[suitId] = {
                        id: suitId,
                        isLegacy,
                        images: []
                    };
                }
                suitMap[suitId].images.push(img);
            });

            // Build suits array with metadata mapping
            const suits = Object.values(suitMap).map(suit => {
                const key = suit.id.toLowerCase();
                const meta = catalog[key] || {};

                // Find cover image: default is first image, or check if any image starts with "cover"
                const cover = suit.images.find(img => img.filename.toLowerCase().startsWith('cover')) || suit.images[0];

                return {
                    id: suit.id,
                    nameAr: meta.ar?.name || '',
                    nameEn: meta.en?.name || '',
                    descAr: meta.ar?.desc || '',
                    descEn: meta.en?.desc || '',
                    priceAr: meta.ar?.price || '',
                    priceEn: meta.en?.price || '',
                    images: suit.images,
                    coverImage: cover,
                    isLegacy: suit.isLegacy
                };
            });

            // Sort suits: custom suit entries first, then legacy ones
            suits.sort((a, b) => {
                if (a.isLegacy && !b.isLegacy) return 1;
                if (!a.isLegacy && b.isLegacy) return -1;
                return a.id.localeCompare(b.id);
            });

            return { name: categoryName, suits };
        }));

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        return res.status(200).json({ albums, catalog });

    } catch (err) {
        console.error('[api/gallery] Error:', err);
        return res.status(500).json({ error: err.message });
    }
}
