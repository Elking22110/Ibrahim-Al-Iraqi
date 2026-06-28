// api/rename-album.js — POST /api/rename-album — Rename a Cloudinary folder
// Note: Cloudinary doesn't support folder rename natively,
// so we move all assets to a new folder path then delete the old folder.
import { initCloudinary, GALLERY_FOLDER } from './_cloudinary.js';

function checkAuth(req) {
    return req.headers['x-admin-password'] === process.env.ADMIN_PASSWORD;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    if (!checkAuth(req)) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const cloudinary = initCloudinary();
        const { oldName, newName } = req.body;
        if (!oldName || !newName) return res.status(400).json({ error: 'oldName and newName are required' });

        const oldPath = `${GALLERY_FOLDER}/${oldName}`;
        const newPath = `${GALLERY_FOLDER}/${newName}`;

        // Create the new folder
        await cloudinary.api.create_folder(newPath);

        // List all assets in old folder
        const resources = await cloudinary.api.resources({
            type: 'upload',
            prefix: oldPath,
            max_results: 500,
        });

        // Move each asset by renaming its public_id
        for (const asset of resources.resources || []) {
            const filename = asset.public_id.split('/').pop();
            const newPublicId = `${newPath}/${filename}`;
            await cloudinary.uploader.rename(asset.public_id, newPublicId);
        }

        // Delete old folder (now empty)
        try {
            await cloudinary.api.delete_folder(oldPath);
        } catch (_) { /* Ignore if already empty */ }

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('[api/rename-album] Error:', err);
        return res.status(500).json({ error: err.message });
    }
}
