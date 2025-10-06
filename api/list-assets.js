import { list } from '@vercel/blob';

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ success: false, error: "Method not allowed" });
    return;
  }

  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    
    if (!token) {
      return res.status(500).json({ 
        success: false, 
        error: "BLOB_READ_WRITE_TOKEN yapılandırılmamış" 
      });
    }

    console.log("📋 Vercel Blob dosyaları listeleniyor...");

    // Tüm blob'ları listele
    const { blobs } = await list({
      token: token,
    });

    console.log(`✅ ${blobs.length} dosya bulundu`);

    // Asset mapping
    const assetMap = {};
    const fileNames = [
      "photo1.png",
      "photo2.png", 
      "photo3.png",
      "intro.mp4",
      "video.mp4",
      "nazin-kitabi.pdf"
    ];

    // Her dosya için blob URL'ini bul
    fileNames.forEach(filename => {
      const blob = blobs.find(b => b.pathname.includes(filename));
      assetMap[filename] = blob ? blob.url : null;
    });

    res.status(200).json({
      success: true,
      assets: assetMap,
      allBlobs: blobs.map(b => ({
        url: b.url,
        pathname: b.pathname,
        size: b.size,
        uploadedAt: b.uploadedAt,
      })),
    });

  } catch (error) {
    console.error("❌ List error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Dosyalar listelenemedi: " + error.message 
    });
  }
}
