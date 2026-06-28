// api/gallery.js — GET /api/gallery — List all albums and their images from Cloudinary
import { initCloudinary, GALLERY_FOLDER } from './_cloudinary.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const cloudinary = initCloudinary();

        // List all sub-folders = albums
        const foldersResult = await cloudinary.api.sub_folders(GALLERY_FOLDER);
        const folders = foldersResult.folders || [];

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

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
        return res.status(200).json({ albums });

    } catch (err) {
        console.error('[api/gallery] Error:', err);
        return res.status(500).json({ error: err.message });
    }
}
