// api/delete-album.js — POST /api/delete-album — Delete a Cloudinary folder and all its assets
import { initCloudinary, GALLERY_FOLDER } from './_cloudinary.js';

function checkAuth(req) {
    return req.headers['x-admin-password'] === process.env.ADMIN_PASSWORD;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    if (!checkAuth(req)) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const cloudinary = initCloudinary();
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'name is required' });

        const folderPath = `${GALLERY_FOLDER}/${name}`;

        // Delete all assets in the folder first
        await cloudinary.api.delete_resources_by_prefix(folderPath);
        // Then delete the folder itself
        await cloudinary.api.delete_folder(folderPath);

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('[api/delete-album] Error:', err);
        return res.status(500).json({ error: err.message });
    }
}
