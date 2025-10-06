// Vercel Serverless Function - Protection Settings
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
    const collection = db.collection('settings');

    if (req.method === 'GET') {
      // Ayarları oku
      let settings = await collection.findOne({ type: 'protection' });
      
      if (!settings) {
        // Varsayılan ayarlar
        settings = {
          type: 'protection',
          protectionEnabled: true,
          targetDate: '2026-04-21',
          pages: {
            home: false,
            timeline: true,
            ansiklopedi: true,
            hayaller: true,
            surpriz: true,
            hediyen: true,
          },
        };
        await collection.insertOne(settings);
      }

      return res.status(200).json({
        protectionEnabled: settings.protectionEnabled,
        targetDate: settings.targetDate,
        pages: settings.pages,
      });
    }

    if (req.method === 'POST') {
      // Ayarları güncelle
      const { protectionEnabled, targetDate, pages } = req.body;

      const result = await collection.updateOne(
        { type: 'protection' },
        {
          $set: {
            protectionEnabled,
            targetDate,
            pages,
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );

      return res.status(200).json({
        success: true,
        message: 'Ayarlar başarıyla güncellendi',
      });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('MongoDB Error:', error);
    res.status(500).json({ error: 'Veritabanı hatası', details: error.message });
  }
}
