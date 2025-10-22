import { handleUpload } from "@vercel/blob/client";

export const config = {
  maxDuration: 60, // 60 saniye (Hobby plan max, Pro için 300s)
};

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
      console.error("❌ BLOB_READ_WRITE_TOKEN bulunamadı!");
      return res.status(500).json({
        error: "BLOB_READ_WRITE_TOKEN yapılandırılmamış",
      });
    }

    // Body'yi JSON olarak parse et
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    console.log("📝 Upload request body:", body);

    // Vercel Blob'un handleUpload fonksiyonu
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        console.log("🎯 Token oluşturuluyor:", pathname);

        // pathname tam path olarak gelir (örn: "photo1.png")
        const filename = pathname;

        // Güvenlik: Sadece belirlenen dosyalar
        const allowedFiles = {
          "photo1.png": "assets/images/photos/photo1.png",
          "photo2.png": "assets/images/photos/photo2.png",
          "photo3.png": "assets/images/photos/photo3.png",
          "intro.mp4": "assets/videos/intro.mp4",
          "video.mp4": "assets/videos/video.mp4",
          "nazin-kitabi.pdf": "assets/documents/nazin-kitabi.pdf",
          "song.mp3": "assets/music/song.mp3",
          "cover.jpg": "assets/music/cover.jpg",
        };

        const blobPath = allowedFiles[filename];

        if (!blobPath) {
          throw new Error("Geçersiz dosya: " + filename);
        }

        console.log("✅ Token oluşturuldu:", blobPath);

        return {
          allowedContentTypes: [
            "image/png",
            "image/jpeg",
            "image/jpg",
            "video/mp4",
            "application/pdf",
            "audio/mpeg",
            "audio/mp3",
          ],
          maximumSizeInBytes: 500 * 1024 * 1024, // 500MB
          addRandomSuffix: false,
          pathname: blobPath,
          token: token, // Token'ı buraya ekle
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log("🎉 Upload tamamlandı:", blob.url);
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error("❌ Upload hatası:", error);
    return res.status(400).json({ error: error.message });
  }
}
