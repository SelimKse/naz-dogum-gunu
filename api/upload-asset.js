import multer from "multer";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // multer için gerekli
  },
};

// Multer storage konfigürasyonu
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Geçici klasör
    const tempDir = "/tmp";
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    // Geçici dosya adı
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB limit
});

// Multer middleware'i promise'e çevir
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

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
    // Multer ile dosyayı parse et
    await runMiddleware(req, res, upload.single("file"));

    const file = req.file;
    const filename = req.body.filename;

    console.log("📦 Gelen dosya:", file);
    console.log("📝 Dosya adı:", filename);

    if (!file || !filename) {
      console.error("❌ Dosya veya filename eksik:", { file, filename });
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
      console.error("❌ Geçersiz dosya adı:", filename);
      // Geçici dosyayı temizle
      fs.unlinkSync(file.path);
      res.status(400).json({ success: false, error: "Geçersiz dosya adı" });
      return;
    }

    // Hedef klasör ve dosya yolu
    const targetDir = path.join(process.cwd(), allowedFiles[filename]);
    const targetPath = path.join(targetDir, filename);

    console.log("📁 Hedef klasör:", targetDir);
    console.log("📄 Hedef yol:", targetPath);

    // Klasör yoksa oluştur
    if (!fs.existsSync(targetDir)) {
      console.log("📂 Klasör oluşturuluyor:", targetDir);
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Dosyayı hedef konuma taşı
    console.log("🔄 Dosya kopyalanıyor:", file.path, "->", targetPath);
    
    fs.copyFileSync(file.path, targetPath);
    fs.unlinkSync(file.path); // Geçici dosyayı sil

    console.log(`✅ Dosya yüklendi: ${targetPath}`);

    res.status(200).json({
      success: true,
      message: `${filename} başarıyla yüklendi!`,
      path: allowedFiles[filename] + filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, error: "Dosya yüklenemedi: " + error.message });
  }
}
