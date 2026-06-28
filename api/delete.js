// api/delete.js — POST /api/delete — Delete image from Cloudinary
import { initCloudinary, GALLERY_FOLDER } from './_cloudinary.js';

function checkAuth(req) {
    return req.headers['x-admin-password'] === process.env.ADMIN_PASSWORD;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    if (!checkAuth(req)) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const cloudinary = initCloudinary();
        const { album, name } = req.body;
        if (!album || !name) return res.status(400).json({ error: 'album and name are required' });

        const publicId = `${GALLERY_FOLDER}/${album}/${name.replace(/\.[^/.]+$/, '')}`;
        await cloudinary.uploader.destroy(publicId);

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('[api/delete] Error:', err);
        return res.status(500).json({ error: err.message });
    }
}
