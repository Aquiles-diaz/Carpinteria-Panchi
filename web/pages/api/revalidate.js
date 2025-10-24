// pages/api/revalidate.js
export default async function handler(req, res) {
  const secret = req.query.secret || req.headers['x-revalidate-secret'];
  if (secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  try {
    // Revalidar home
    await res.revalidate('/');
    // opcional: revalidar otras rutas si quieres
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).json({ message: 'Error revalidating', error: err.message });
  }
}
