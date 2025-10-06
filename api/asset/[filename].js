import clientPromise from "../db.js";

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // GET - Belirli bir asset'i indir
  if (req.method === "GET") {
    try {
      const { filename } = req.query;

      if (!filename) {
        res.status(400).json({ 
          success: false, 
          error: "Dosya adı gerekli" 
        });
        return;
      }

      const client = await clientPromise;
      const db = client.db("naz-dogum-gunu");
      const assetsCollection = db.collection("assets");

      const asset = await assetsCollection.findOne({ filename });

      if (!asset) {
        res.status(404).json({
          success: false,
          error: "Asset bulunamadı"
        });
        return;
      }

      // Base64'ten Buffer'a çevir
      const buffer = Buffer.from(asset.data.split(',')[1], 'base64');

      // MIME type'ı ayarla
      res.setHeader("Content-Type", asset.mimeType || "application/octet-stream");
      res.setHeader("Content-Length", buffer.length);
      res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
      
      res.status(200).send(buffer);
    } catch (error) {
      console.error("Asset download hatası:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
