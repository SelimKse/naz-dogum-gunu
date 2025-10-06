import { handleUpload } from "@vercel/blob/client";

export const config = {
  api: {
    bodyParser: false,
  },
  maxDuration: 300, // 5 dakika
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
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Filename, X-Total-Chunks, X-Chunk-Index"
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
    // Vercel Blob'un client upload sistemi - 1GB'a kadar destekler
    const jsonResponse = await handleUpload({
      request: req,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        console.log("📝 Upload request:", pathname);

        // pathname dosya adı olacak (örn: "photo1.png", "intro.mp4")
        const filename = pathname;

        // Güvenlik: Sadece belirlenen dosyalar
        const allowedFiles = {
          "photo1.png": "assets/images/photos/",
          "photo2.png": "assets/images/photos/",
          "photo3.png": "assets/images/photos/",
          "intro.mp4": "assets/videos/",
          "video.mp4": "assets/videos/",
          "nazin-kitabi.pdf": "assets/documents/",
        };

        if (!allowedFiles[filename]) {
          throw new Error("Geçersiz dosya adı: " + filename);
        }

        // Tam path oluştur
        const blobPath = allowedFiles[filename] + filename;

        return {
          allowedContentTypes: [
            "image/png",
            "image/jpeg",
            "video/mp4",
            "application/pdf",
          ],
          maximumSizeInBytes: 1024 * 1024 * 1024, // 1GB
          addRandomSuffix: false,
          pathname: blobPath, // Tam path'i döndür
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("✅ Upload tamamlandı:", blob.url);
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error("❌ Upload error:", error);
    return res.status(400).json({ error: error.message });
  }
}
