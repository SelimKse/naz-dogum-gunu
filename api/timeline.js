// Vercel Serverless Function - Timeline
import clientPromise from './db.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS request için
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const client = await clientPromise;
    const db = client.db('naz-dogum-gunu');
    const collection = db.collection('timeline');

    if (req.method === 'GET') {
      // Timeline olaylarını oku
      const events = await collection.find({}).sort({ id: 1 }).toArray();
      return res.status(200).json(events);
    }

    if (req.method === 'POST') {
      // Timeline'ı güncelle (tüm olayları değiştir)
      const { events } = req.body;

      if (!Array.isArray(events)) {
        return res.status(400).json({ error: 'Events array bekleniyor' });
      }

      // Tüm eski olayları sil
      await collection.deleteMany({});

      // Yeni olayları ekle
      if (events.length > 0) {
        await collection.insertMany(events);
      }

      return res.status(200).json({
        success: true,
        message: 'Timeline başarıyla güncellendi',
        count: events.length,
      });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('MongoDB Error:', error);
    res.status(500).json({ error: 'Veritabanı hatası', details: error.message });
  }
}
