import clientPromise from "./db.js";

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const client = await clientPromise;
    const db = client.db("naz-dogum-gunu");
    const assetsCollection = db.collection("assets");

    // GET - Tüm asset'leri listele
    if (req.method === "GET") {
      const assets = await assetsCollection.find({}).toArray();
      
      // Asset durumlarını map olarak dön
      const assetStatus = {};
      assets.forEach(asset => {
        assetStatus[asset.filename] = true;
      });

      // Eksik olanları false olarak ekle
      const requiredAssets = [
        "photo1.png",
        "photo2.png", 
        "photo3.png",
        "intro.mp4",
        "video.mp4",
        "nazin-kitabi.pdf"
      ];

      requiredAssets.forEach(filename => {
        if (!assetStatus[filename]) {
          assetStatus[filename] = false;
        }
      });

      res.status(200).json({
        success: true,
        assets: assets,
        assetStatus: assetStatus
      });
      return;
    }

    // POST - Asset yükle (base64)
    if (req.method === "POST") {
      const { filename, data, mimeType, size } = req.body;

      if (!filename || !data) {
        res.status(400).json({ 
          success: false, 
          error: "Dosya adı ve data gerekli" 
        });
        return;
      }

      // Mevcut asset'i kontrol et
      const existingAsset = await assetsCollection.findOne({ filename });

      if (existingAsset) {
        // Güncelle
        await assetsCollection.updateOne(
          { filename },
          {
            $set: {
              data,
              mimeType,
              size,
              updatedAt: new Date()
            }
          }
        );
      } else {
        // Yeni ekle
        await assetsCollection.insertOne({
          filename,
          data,
          mimeType,
          size,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      res.status(200).json({
        success: true,
        message: `${filename} MongoDB'ye yüklendi`
      });
      return;
    }

    // DELETE - Asset sil
    if (req.method === "DELETE") {
      const { filename } = req.body;

      if (!filename) {
        res.status(400).json({ 
          success: false, 
          error: "Dosya adı gerekli" 
        });
        return;
      }

      const result = await assetsCollection.deleteOne({ filename });

      if (result.deletedCount === 0) {
        res.status(404).json({
          success: false,
          error: "Asset bulunamadı"
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: `${filename} silindi`
      });
      return;
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Asset API hatası:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
