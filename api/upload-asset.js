import { put } from "@vercel/blob";

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false, // Büyük dosyalar için
  },
  maxDuration: 60, // 60 saniye (Hobby plan max, Pro için 300s)
};

// Multipart form data parser
function parseMultipartFormData(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    req.on("data", (chunk) => {
      chunks.push(chunk);
    });

    req.on("end", () => {
      try {
        const buffer = Buffer.concat(chunks);
        const boundary = req.headers["content-type"]?.split("boundary=")[1];

        if (!boundary) {
          return reject(new Error("No boundary found"));
        }

        const parts = buffer.toString("binary").split(`--${boundary}`);
        const result = { fields: {}, files: {} };

        for (const part of parts) {
          if (part.includes("Content-Disposition")) {
            const nameMatch = part.match(/name="([^"]+)"/);
            const filenameMatch = part.match(/filename="([^"]+)"/);

            if (nameMatch) {
              const fieldName = nameMatch[1];
              const contentStart = part.indexOf("\r\n\r\n") + 4;
              const contentEnd = part.lastIndexOf("\r\n");

              if (filenameMatch) {
                const fileContent = Buffer.from(
                  part.substring(contentStart, contentEnd),
                  "binary"
                );
                result.files[fieldName] = {
                  filename: filenameMatch[1],
                  data: fileContent,
                };
              } else {
                const fieldValue = part.substring(contentStart, contentEnd);
                result.fields[fieldName] = fieldValue;
              }
            }
          }
        }

        resolve(result);
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
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
    console.log("📨 Vercel Blob upload request received");

    // Parse multipart form data
    const { fields, files } = await parseMultipartFormData(req);

    const filename = fields.filename;
    const fileData = files.file;

    console.log("📝 Filename:", filename);
    console.log("📦 File size:", fileData?.data?.length || 0);

    if (!fileData || !filename) {
      return res.status(400).json({
        success: false,
        error: "Dosya veya dosya adı eksik",
      });
    }

    // Dosya boyutu kontrolü (500MB server-side limit)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (fileData.data.length > maxSize) {
      return res.status(413).json({
        success: false,
        error: `Dosya çok büyük (${(fileData.data.length / 1024 / 1024).toFixed(2)} MB). Maksimum 500MB.`,
      });
    }

    // Güvenlik: Sadece belirlenen dosya adlarına izin ver
    const allowedFiles = {
      "photo1.png": "assets/images/photos/",
      "photo2.png": "assets/images/photos/",
      "photo3.png": "assets/images/photos/",
      "intro.mp4": "assets/videos/",
      "video.mp4": "assets/videos/",
      "nazin-kitabi.pdf": "assets/documents/",
    };

    if (!allowedFiles[filename]) {
      return res.status(400).json({
        success: false,
        error: "Geçersiz dosya adı",
      });
    }

    const blobPath = allowedFiles[filename] + filename;

    console.log("⬆️ Vercel Blob'a yükleniyor:", blobPath);

    // Vercel Blob token'ı environment variable'dan al
    const token = process.env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
      console.error("❌ BLOB_READ_WRITE_TOKEN bulunamadı!");
      console.log(
        "📋 Mevcut env vars:",
        Object.keys(process.env).filter((k) => k.includes("BLOB"))
      );
      return res.status(500).json({
        success: false,
        error: "BLOB_READ_WRITE_TOKEN environment variable yapılandırılmamış",
      });
    }

    console.log("🔑 Token bulundu, yükleme başlıyor...");

    // Vercel Blob'a yükle (token ile)
    // put() otomatik olarak büyük dosyalar için multipart kullanır
    const blob = await put(blobPath, fileData.data, {
      access: "public", // Public erişim
      addRandomSuffix: false, // Dosya adını korumak için
      token: token, // Token'ı manuel olarak geç
      allowOverwrite: true, // Var olan dosyanın üzerine yaz
    });

    console.log("✅ Vercel Blob'a yüklendi:", blob.url);

    res.status(200).json({
      success: true,
      message: `${filename} başarıyla yüklendi!`,
      filename: filename,
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname,
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({
      success: false,
      error: "Dosya yüklenemedi: " + error.message,
    });
  }
}
