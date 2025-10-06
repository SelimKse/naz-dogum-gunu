export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "DELETE") {
    try {
      const { filename } = req.body;

      if (!filename) {
        res.status(400).json({
          success: false,
          error: "Dosya adı gerekli",
        });
        return;
      }

      // Dosya yolu mapping
      const pathMap = {
        "photo1.png": "public/assets/images/photos/photo1.png",
        "photo2.png": "public/assets/images/photos/photo2.png",
        "photo3.png": "public/assets/images/photos/photo3.png",
        "intro.mp4": "public/assets/videos/intro.mp4",
        "video.mp4": "public/assets/videos/video.mp4",
        "nazin-kitabi.pdf": "public/assets/documents/nazin-kitabi.pdf",
      };

      const filePath = pathMap[filename];

      if (!filePath) {
        res.status(400).json({
          success: false,
          error: "Geçersiz dosya adı",
        });
        return;
      }

      // Dosyayı sil
      const fs = require("fs");
      const path = require("path");
      const fullPath = path.join(process.cwd(), filePath);

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        res.status(200).json({
          success: true,
          message: `${filename} başarıyla silindi`,
        });
      } else {
        res.status(404).json({
          success: false,
          error: "Dosya bulunamadı",
        });
      }
    } catch (error) {
      console.error("Silme hatası:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
