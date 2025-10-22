import { del, list } from "@vercel/blob";

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

  if (req.method === "DELETE" || req.method === "POST") {
    try {
      const { filename } = req.body;

      if (!filename) {
        res.status(400).json({
          success: false,
          error: "Dosya adı gerekli",
        });
        return;
      }

      const token = process.env.BLOB_READ_WRITE_TOKEN;

      if (!token) {
        return res.status(500).json({
          success: false,
          error: "BLOB_READ_WRITE_TOKEN yapılandırılmamış",
        });
      }

      // İzin verilen dosyalar
      const allowedFiles = [
        "photo1.png",
        "photo2.png",
        "photo3.png",
        "intro.mp4",
        "video.mp4",
        "nazin-kitabi.pdf",
      ];

      if (!allowedFiles.includes(filename)) {
        res.status(400).json({
          success: false,
          error: "Geçersiz dosya adı",
        });
        return;
      }

      console.log("🔍 Vercel Blob'da dosya aranıyor:", filename);

      // Önce dosyayı bul
      const { blobs } = await list({ token });
      const blob = blobs.find((b) => b.pathname.includes(filename));

      if (!blob) {
        return res.status(404).json({
          success: false,
          error: "Dosya Vercel Blob'da bulunamadı",
        });
      }

      console.log("🗑️ Dosya siliniyor:", blob.url);

      // Vercel Blob'dan sil
      await del(blob.url, { token });

      console.log("✅ Dosya silindi");

      res.status(200).json({
        success: true,
        message: `${filename} başarıyla silindi`,
      });
    } catch (error) {
      console.error("❌ Silme hatası:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
