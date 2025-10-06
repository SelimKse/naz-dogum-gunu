// Vercel Serverless Function - Feedback
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
    const collection = db.collection('feedback');

    if (req.method === 'GET') {
      // Tüm feedback'leri oku
      const feedbacks = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(feedbacks);
    }

    if (req.method === 'POST') {
      // Yeni feedback kaydet
      const { feedback } = req.body;

      if (!feedback || feedback.trim().length === 0) {
        return res.status(400).json({ error: 'Feedback boş olamaz' });
      }

      const result = await collection.insertOne({
        feedback: feedback.trim(),
        createdAt: new Date(),
      });

      return res.status(200).json({
        success: true,
        message: 'Feedback başarıyla kaydedildi!',
        id: result.insertedId,
      });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('MongoDB Error:', error);
    res.status(500).json({ error: 'Veritabanı hatası', details: error.message });
  }
}
