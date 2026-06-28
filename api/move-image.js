// api/move-image.js — POST /api/move-image — Move an image from one category folder to another in Cloudinary
import { initCloudinary, GALLERY_FOLDER } from './_cloudinary.js';

function checkAuth(req) {
    return req.headers['x-admin-password'] === process.env.ADMIN_PASSWORD;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    if (!checkAuth(req)) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const cloudinary = initCloudinary();
        const { fromAlbum, toAlbum, filename } = req.body;

        if (!fromAlbum || !toAlbum || !filename) {
            return res.status(400).json({ error: 'fromAlbum, toAlbum, and filename are required' });
        }

        const sourcePublicId = `${GALLERY_FOLDER}/${fromAlbum}/${filename}`;
        const targetPublicId = `${GALLERY_FOLDER}/${toAlbum}/${filename}`;

        // Explicitly create the target folder in Cloudinary so it registers in sub_folders list
        const targetFolder = `${GALLERY_FOLDER}/${toAlbum}`;
        console.log(`[api/move-image] Creating folder if missing: ${targetFolder}`);
        await cloudinary.api.create_folder(targetFolder);

        console.log(`[api/move-image] Moving ${sourcePublicId} to ${targetPublicId}`);
        await cloudinary.uploader.rename(sourcePublicId, targetPublicId, { overwrite: true });

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('[api/move-image] Error:', err);
        return res.status(500).json({ error: err.message });
    }
}
