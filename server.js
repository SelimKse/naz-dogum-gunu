import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Multer ayarları - dosya yükleme için
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "src", "assets");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const targetName = req.body.targetName || file.originalname;
    cb(null, targetName);
  },
});

const upload = multer({ storage: storage });

// Asset varlık kontrolü endpoint'i
app.get("/api/check-asset/:filename", (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "src", "assets", filename);
    const exists = fs.existsSync(filePath);

    res.json({
      exists: exists,
      filename: filename,
      path: exists ? `/src/assets/${filename}` : null,
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

    res.json({
      success: true,
      message: "Dosya başarıyla yüklendi",
      filename: req.file.filename,
      path: `/src/assets/${req.file.filename}`,
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
    const filePath = path.join(__dirname, "src", "assets", filename);

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
    const filePath = path.join(__dirname, "src", "assets", "timeline.json");

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

    const filePath = path.join(__dirname, "src", "assets", "timeline.json");
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
    const filePath = path.join(__dirname, "src", "assets", "gelennot.txt");

    // Dosyayı üzerine yaz (varsa silinir, yoksa oluşturulur)
    fs.writeFileSync(filePath, feedback.trim(), "utf8");

    res.json({ success: true, message: "Feedback başarıyla kaydedildi!" });
  } catch (error) {
    console.error("Dosya kaydetme hatası:", error);
    res.status(500).json({ error: "Dosya kaydedilemedi" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server çalışıyor: http://localhost:${PORT}`);
});
