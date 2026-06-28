// api/create-album.js — POST /api/create-album — Create a new Cloudinary folder
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

        await cloudinary.api.create_folder(`${GALLERY_FOLDER}/${name}`);

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('[api/create-album] Error:', err);
        return res.status(500).json({ error: err.message });
    }
}
