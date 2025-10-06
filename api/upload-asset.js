const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

export const config = {
  api: {
    bodyParser: false, // formidable için gerekli
  },
};

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

  if (req.method !== "POST") {
    res.status(405).json({ success: false, error: "Method not allowed" });
    return;
  }

  try {
    const form = formidable({
      maxFileSize: 200 * 1024 * 1024, // 200MB limit
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Form parse error:", err);
        res.status(500).json({ success: false, error: "Dosya yüklenirken hata oluştu" });
        return;
      }

      const file = files.file;
      const filename = fields.filename;

      if (!file || !filename) {
        res.status(400).json({ success: false, error: "Dosya veya dosya adı eksik" });
        return;
      }

      // Güvenlik: Sadece belirlenen dosya adlarına izin ver
      const allowedFiles = {
        "photo1.png": "public/assets/images/photos/",
        "photo2.png": "public/assets/images/photos/",
        "photo3.png": "public/assets/images/photos/",
        "intro.mp4": "public/assets/videos/",
        "video.mp4": "public/assets/videos/",
        "nazin-kitabi.pdf": "public/assets/documents/",
      };

      if (!allowedFiles[filename]) {
        res.status(400).json({ success: false, error: "Geçersiz dosya adı" });
        return;
      }

      // Hedef klasör ve dosya yolu
      const targetDir = path.join(process.cwd(), allowedFiles[filename]);
      const targetPath = path.join(targetDir, filename);

      // Klasör yoksa oluştur
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Dosyayı hedef konuma taşı
      const tempPath = file.filepath || file.path;
      fs.copyFileSync(tempPath, targetPath);
      fs.unlinkSync(tempPath); // Geçici dosyayı sil

      console.log(`✅ Dosya yüklendi: ${targetPath}`);

      res.status(200).json({
        success: true,
        message: `${filename} başarıyla yüklendi!`,
        path: allowedFiles[filename] + filename,
      });
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, error: "Dosya yüklenemedi" });
  }
}
