// Vercel Serverless Function - Feedback
import clientPromise from './db.js';
import { Resend } from 'resend';
import { put } from '@vercel/blob';

const resend = new Resend(process.env.RESEND_API_KEY);

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
      return res.status(200).json({ feedback: feedbacks });
    }

    if (req.method === 'POST') {
      // Yeni feedback kaydet
      const { feedback } = req.body;

      if (!feedback || feedback.trim().length === 0) {
        return res.status(400).json({ error: 'Feedback boş olamaz' });
      }

      const now = new Date();
      const result = await collection.insertOne({
        feedback: feedback.trim(),
        createdAt: now,
      });

      // 1️⃣ EMAIL BİLDİRİMİ GÖNDER
      try {
        const notificationEmail = process.env.NOTIFICATION_EMAIL;
        if (notificationEmail && process.env.RESEND_API_KEY) {
          await resend.emails.send({
            from: 'Naz Doğum Günü <onboarding@resend.dev>', // Resend test domain
            to: notificationEmail,
            subject: '🎉 Yeni Feedback Geldi!',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
                <h2 style="color: #FF69B4; margin-bottom: 20px;">🎂 Yeni Feedback Alındı!</h2>
                <div style="background-color: white; padding: 20px; border-radius: 8px; border-left: 4px solid #FF69B4;">
                  <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
                    <strong>Tarih:</strong> ${now.toLocaleString('tr-TR')}
                  </p>
                  <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 15px;">
                    ${feedback.trim().replace(/\n/g, '<br>')}
                  </p>
                </div>
                <p style="color: #999; font-size: 12px; margin-top: 20px; text-align: center;">
                  Naz Doğum Günü Feedback Sistemi
                </p>
              </div>
            `,
          });
          console.log('📧 Email bildirim gönderildi:', notificationEmail);
        }
      } catch (emailError) {
        console.error('❌ Email gönderilemedi:', emailError);
        // Email hatası feedback kaydetmeyi engellemez
      }

      // 2️⃣ VERCEL BLOB'A TXT DOSYASI OLARAK KAYDET
      try {
        const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
        if (blobToken) {
          const timestamp = now.toISOString().replace(/:/g, '-').replace(/\..+/, '');
          const filename = `feedback-${timestamp}.txt`;
          const content = `Tarih: ${now.toLocaleString('tr-TR')}\nFeedback ID: ${result.insertedId}\n\n${feedback.trim()}`;
          
          const blob = await put(`feedback/${filename}`, content, {
            access: 'public',
            token: blobToken,
            contentType: 'text/plain; charset=utf-8',
          });
          
          console.log('💾 Blob\'a kaydedildi:', blob.url);
        }
      } catch (blobError) {
        console.error('❌ Blob\'a kaydedilemedi:', blobError);
        // Blob hatası feedback kaydetmeyi engellemez
      }

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
