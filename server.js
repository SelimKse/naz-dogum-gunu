import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Asset türüne göre yol belirleme fonksiyonu
const getAssetPath = (filename) => {
  const ext = path.extname(filename).toLowerCase();

  // Dosya adına göre özel mapping
  if (filename.startsWith("photo")) {
    return path.join("images", "photos", filename);
  }

  if (
    ["stitch.png", "lilo.png", "hawaii.png", "ohana.png"].includes(filename)
  ) {
    return path.join("images", "icons", filename);
  }

  // Uzantıya göre klasör belirleme
  if ([".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)) {
    return path.join("images", filename);
  }

  if ([".mp4", ".mov", ".avi", ".webm"].includes(ext)) {
    return path.join("videos", filename);
  }

  if ([".pdf", ".doc", ".docx"].includes(ext)) {
    return path.join("documents", filename);
  }

  if ([".json", ".txt"].includes(ext)) {
    return path.join("data", filename);
  }

  // Default: root assets klasörü
  return filename;
};

// Multer ayarları - dosya yükleme için
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const targetName = req.body.targetName || file.originalname;
    const relativePath = getAssetPath(targetName);
    const uploadPath = path.join(
      __dirname,
      "public",
      "assets",
      path.dirname(relativePath)
    );

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const targetName = req.body.targetName || file.originalname;
    cb(null, path.basename(targetName));
  },
});

const upload = multer({ storage: storage });

// Asset varlık kontrolü endpoint'i
app.get("/api/check-asset/:filename", (req, res) => {
  try {
    const { filename } = req.params;
    const relativePath = getAssetPath(filename);
    const filePath = path.join(__dirname, "public", "assets", relativePath);
    const exists = fs.existsSync(filePath);

    res.json({
      exists: exists,
      filename: filename,
      path: exists ? `/assets/${relativePath.replace(/\\/g, "/")}` : null,
    });
  } catch (error) {
    console.error("Asset kontrol hatası:", error);
    res.status(500).json({ error: "Dosya kontrolü yapılamadı" });
  }
});

// Dosya yükleme endpoint'i
app.post("/api/upload-asset", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Dosya yüklenmedi" });
    }

    const targetName = req.body.targetName || req.file.originalname;
    const relativePath = getAssetPath(targetName);

    res.json({
      success: true,
      message: "Dosya başarıyla yüklendi",
      filename: req.file.filename,
      path: `/assets/${relativePath.replace(/\\/g, "/")}`,
    });
  } catch (error) {
    console.error("Dosya yükleme hatası:", error);
    res.status(500).json({ error: "Dosya yüklenemedi" });
  }
});

// Dosya silme endpoint'i
app.delete("/api/delete-asset/:filename", (req, res) => {
  try {
    const { filename } = req.params;
    const relativePath = getAssetPath(filename);
    const filePath = path.join(__dirname, "public", "assets", relativePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Dosya bulunamadı" });
    }

    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: "Dosya başarıyla silindi",
      filename: filename,
    });
  } catch (error) {
    console.error("Dosya silme hatası:", error);
    res.status(500).json({ error: "Dosya silinemedi" });
  }
});

// Timeline JSON okuma endpoint'i
app.get("/api/timeline", (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      "public",
      "assets",
      "data",
      "timeline.json"
    );

    if (!fs.existsSync(filePath)) {
      return res.json([]);
    }

    const data = fs.readFileSync(filePath, "utf8");
    res.json(JSON.parse(data));
  } catch (error) {
    console.error("Timeline okuma hatası:", error);
    res.status(500).json({ error: "Timeline okunamadı" });
  }
});

// Timeline JSON güncelleme endpoint'i
app.post("/api/timeline", (req, res) => {
  try {
    const { events } = req.body;

    if (!Array.isArray(events)) {
      return res.status(400).json({ error: "Geçersiz veri formatı" });
    }

    const filePath = path.join(
      __dirname,
      "public",
      "assets",
      "data",
      "timeline.json"
    );
    fs.writeFileSync(filePath, JSON.stringify(events, null, 2), "utf8");

    res.json({
      success: true,
      message: "Timeline başarıyla güncellendi",
      count: events.length,
    });
  } catch (error) {
    console.error("Timeline güncelleme hatası:", error);
    res.status(500).json({ error: "Timeline güncellenemedi" });
  }
});

// Feedback kaydetme endpoint'i
app.post("/api/save-feedback", (req, res) => {
  try {
    const { feedback } = req.body;

    if (!feedback || feedback.trim().length === 0) {
      return res.status(400).json({ error: "Feedback boş olamaz" });
    }

    // gelennot.txt dosyasının yolu
    const filePath = path.join(
      __dirname,
      "public",
      "assets",
      "data",
      "gelennot.txt"
    );

    // Dosyayı üzerine yaz (varsa silinir, yoksa oluşturulur)
    fs.writeFileSync(filePath, feedback.trim(), "utf8");

    res.json({ success: true, message: "Feedback başarıyla kaydedildi!" });
  } catch (error) {
    console.error("Dosya kaydetme hatası:", error);
    res.status(500).json({ error: "Dosya kaydedilemedi" });
  }
});

// Protection Settings okuma endpoint'i
app.get("/api/protection-settings", (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      "public",
      "assets",
      "data",
      "protection-settings.json"
    );

    if (!fs.existsSync(filePath)) {
      // Dosya yoksa default ayarları döndür
      return res.json({
        protectionEnabled: true,
        targetDate: "2026-04-21",
        pages: {
          home: false,
          timeline: true,
          ansiklopedi: true,
          hayaller: true,
          surpriz: true,
          hediyen: true,
        },
      });
    }

    const data = fs.readFileSync(filePath, "utf8");
    res.json(JSON.parse(data));
  } catch (error) {
    console.error("Protection settings okuma hatası:", error);
    res.status(500).json({ error: "Ayarlar okunamadı" });
  }
});

// Protection Settings güncelleme endpoint'i
app.post("/api/protection-settings", (req, res) => {
  try {
    const { protectionEnabled, targetDate, pages } = req.body;

    if (typeof protectionEnabled !== "boolean") {
      return res
        .status(400)
        .json({ error: "protectionEnabled boolean olmalı" });
    }

    if (!targetDate || typeof targetDate !== "string") {
      return res
        .status(400)
        .json({ error: "targetDate geçerli bir tarih olmalı" });
    }

    if (!pages || typeof pages !== "object") {
      return res.status(400).json({ error: "pages object olmalı" });
    }

    const settings = {
      protectionEnabled,
      targetDate,
      pages,
    };

    const filePath = path.join(
      __dirname,
      "public",
      "assets",
      "data",
      "protection-settings.json"
    );

    // Dizin yoksa oluştur
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), "utf8");

    res.json({
      success: true,
      message: "Koruma ayarları başarıyla güncellendi",
      settings,
    });
  } catch (error) {
    console.error("Protection settings güncelleme hatası:", error);
    res.status(500).json({ error: "Ayarlar güncellenemedi" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server çalışıyor: http://localhost:${PORT}`);
});
