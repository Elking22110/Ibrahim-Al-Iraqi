// api/update-product.js — POST /api/update-product — Update product metadata (name, description, price) in Cloudinary raw catalog JSON file
import { initCloudinary, GALLERY_FOLDER } from './_cloudinary.js';

function checkAuth(req) {
    return req.headers['x-admin-password'] === process.env.ADMIN_PASSWORD;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    if (!checkAuth(req)) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const cloudinary = initCloudinary();
        const { filename, metadata } = req.body;

        if (!filename || !metadata) {
            return res.status(400).json({ error: 'filename and metadata are required' });
        }

        // Fetch current catalog from Cloudinary
        const catalogUrl = cloudinary.url(`${GALLERY_FOLDER}/catalog.json`, { resource_type: 'raw', secure: true });
        let catalog = {};

        try {
            const response = await fetch(catalogUrl);
            if (response.ok) {
                catalog = await response.json();
            }
        } catch (fetchErr) {
            console.warn('[api/update-product] Catalog fetch failed, initializing new one:', fetchErr.message);
        }

        // Normalize filename key (Cloudinary public_id style, case-insensitive)
        const key = filename.toLowerCase().replace(/\.[^/.]+$/, '').trim();

        // Update entry
        catalog[key] = {
            en: {
                name: metadata.nameEn || '',
                desc: metadata.descEn || '',
                price: metadata.priceEn || ''
            },
            ar: {
                name: metadata.nameAr || '',
                desc: metadata.descAr || '',
                price: metadata.priceAr || ''
            }
        };

        // Upload updated catalog back to Cloudinary
        const jsonString = JSON.stringify(catalog, null, 2);
        const base64Data = Buffer.from(jsonString).toString('base64');
        const dataUri = `data:application/json;base64,${base64Data}`;

        console.log(`[api/update-product] Uploading updated catalog.json for key: ${key}`);
        await cloudinary.uploader.upload(dataUri, {
            public_id: `${GALLERY_FOLDER}/catalog.json`,
            resource_type: 'raw',
            overwrite: true,
            invalidate: true
        });

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('[api/update-product] Error:', err);
        return res.status(500).json({ error: err.message });
    }
}
