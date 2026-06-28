// api/auth.js — POST /api/auth — Validate admin password
export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'Password required' });

    const adminPw = process.env.ADMIN_PASSWORD;

    // If env var not configured, return a clear message
    if (!adminPw) {
        return res.status(503).json({ error: 'ADMIN_PASSWORD not configured on server. Please add it to Vercel Environment Variables.' });
    }

    if (password === adminPw) {
        return res.status(200).json({ success: true });
    } else {
        return res.status(401).json({ error: 'Invalid password' });
    }
}
