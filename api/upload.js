// api/upload.js — POST /api/upload — Upload image to Cloudinary album
import { initCloudinary, GALLERY_FOLDER } from './_cloudinary.js';

export const config = { api: { bodyParser: { sizeLimit: '20mb' } } };

function checkAuth(req) {
    const pw = req.headers['x-admin-password'];
    return pw === process.env.ADMIN_PASSWORD;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    if (!checkAuth(req)) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const cloudinary = initCloudinary();
        const { album, suitId, name, data } = req.body;

        if (!album || !name || !data) {
            return res.status(400).json({ error: 'album, name, and data are required' });
        }

        const folderPath = suitId 
            ? `${GALLERY_FOLDER}/${album}/${suitId}` 
            : `${GALLERY_FOLDER}/${album}`;
        const publicId = `${folderPath}/${name.replace(/\.[^/.]+$/, '')}`;

        // Upload with auto WebP conversion and quality optimization
        const result = await cloudinary.uploader.upload(data, {
            public_id: publicId,
            overwrite: true,
            resource_type: 'image',
            format: 'webp',
            quality: 82,
            transformation: [
                { width: 1920, crop: 'limit' }
            ],
        });

        return res.status(200).json({
            success: true,
            name: result.public_id.split('/').pop(),
            url: result.secure_url,
            originalKB: Math.round(data.length * 0.75 / 1024),
            compressedKB: Math.round(result.bytes / 1024),
        });

    } catch (err) {
        console.error('[api/upload] Error:', err);
        return res.status(500).json({ error: err.message });
    }
}
