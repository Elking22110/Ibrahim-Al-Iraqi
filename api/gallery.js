// api/gallery.js — GET /api/gallery — List all albums and their images from Cloudinary
import { initCloudinary, GALLERY_FOLDER } from './_cloudinary.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const cloudinary = initCloudinary();

        // List all sub-folders = albums
        let foldersResult = await cloudinary.api.sub_folders(GALLERY_FOLDER);
        let folders = foldersResult.folders || [];

        // Self-healing: Ensure all 4 standard folders are explicitly created on Cloudinary
        const requiredFolders = ['Collection', 'Wedding', 'Casual', 'Luxury'];
        let needsRefetch = false;

        for (const reqFolder of requiredFolders) {
            const exists = folders.some(f => f.name.toLowerCase() === reqFolder.toLowerCase());
            if (!exists) {
                console.log(`[api/gallery] Explicitly creating missing folder on Cloudinary: ${reqFolder}`);
                try {
                    await cloudinary.api.create_folder(`${GALLERY_FOLDER}/${reqFolder}`);
                    needsRefetch = true;
                } catch (err) {
                    console.error(`Failed to create folder ${reqFolder}:`, err.message);
                }
            }
        }

        // Refetch folders if we created any new ones so they are included in the results
        if (needsRefetch) {
            foldersResult = await cloudinary.api.sub_folders(GALLERY_FOLDER);
            folders = foldersResult.folders || [];
        }

        const albums = await Promise.all(folders.map(async (folder) => {
            const albumName = folder.name;
            const folderPath = `${GALLERY_FOLDER}/${albumName}`;

            // Get all images in this album folder
            const resources = await cloudinary.api.resources({
                type: 'upload',
                prefix: folderPath,
                max_results: 500,
            });

            const images = (resources.resources || []).map(r => ({
                publicId: r.public_id,
                url: r.secure_url,
                filename: r.public_id.split('/').pop(),
                width: r.width,
                height: r.height,
                bytes: r.bytes,
            }));

            return { name: albumName, images };
        }));

        // Fetch metadata catalog from Cloudinary
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

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        return res.status(200).json({ albums, catalog });

    } catch (err) {
        console.error('[api/gallery] Error:', err);
        return res.status(500).json({ error: err.message });
    }
}
