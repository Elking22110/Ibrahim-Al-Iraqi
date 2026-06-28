// api/set-cover.js — POST /api/set-cover — Designate an image as the cover of an album
import { initCloudinary, GALLERY_FOLDER } from './_cloudinary.js';

function checkAuth(req) {
    return req.headers['x-admin-password'] === process.env.ADMIN_PASSWORD;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    if (!checkAuth(req)) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const cloudinary = initCloudinary();
        const { album, suitId, filename } = req.body;

        if (!album || !filename) {
            return res.status(400).json({ error: 'album and filename are required' });
        }

        // If suitId is provided, work inside the suit's subfolder
        const albumPath = suitId 
            ? `${GALLERY_FOLDER}/${album}/${suitId}` 
            : `${GALLERY_FOLDER}/${album}`;

        // 1. Look for existing cover in Cloudinary
        const resources = await cloudinary.api.resources({
            type: 'upload',
            prefix: `${albumPath}/cover`,
            max_results: 10
        });

        const existingCover = (resources.resources || []).find(r =>
            r.public_id === `${albumPath}/cover`
        );

        if (existingCover) {
            // Rename old cover to a temp timestamped name to prevent conflicts
            const newOldId = `${albumPath}/img_${Date.now()}`;
            await cloudinary.uploader.rename(existingCover.public_id, newOldId);
        }

        // 2. Rename target image to 'cover'
        const sourcePublicId = `${albumPath}/${filename}`;
        const targetPublicId = `${albumPath}/cover`;

        await cloudinary.uploader.rename(sourcePublicId, targetPublicId);

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('[api/set-cover] Error:', err);
        return res.status(500).json({ error: err.message });
    }
}
