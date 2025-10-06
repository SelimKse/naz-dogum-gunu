import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Raw body parsing için
  },
};

// Multipart form data parser (native implementation)
function parseMultipartFormData(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    
    req.on('data', (chunk) => {
      chunks.push(chunk);
    });
    
    req.on('end', () => {
      try {
        const buffer = Buffer.concat(chunks);
        const boundary = req.headers['content-type']?.split('boundary=')[1];
        
        if (!boundary) {
          return reject(new Error('No boundary found'));
        }
        
        const parts = buffer.toString('binary').split(`--${boundary}`);
        const result = { fields: {}, files: {} };
        
        for (const part of parts) {
          if (part.includes('Content-Disposition')) {
            const nameMatch = part.match(/name="([^"]+)"/);
            const filenameMatch = part.match(/filename="([^"]+)"/);
            
            if (nameMatch) {
              const fieldName = nameMatch[1];
              const contentStart = part.indexOf('\r\n\r\n') + 4;
              const contentEnd = part.lastIndexOf('\r\n');
              
              if (filenameMatch) {
                // File field
                const fileContent = Buffer.from(
                  part.substring(contentStart, contentEnd),
                  'binary'
                );
                result.files[fieldName] = {
                  filename: filenameMatch[1],
                  data: fileContent
                };
              } else {
                // Regular field
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
    
    req.on('error', reject);
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
    console.log("📨 Upload request received");
    console.log("📋 Content-Type:", req.headers['content-type']);
    
    // Parse multipart form data
    const { fields, files } = await parseMultipartFormData(req);
    
    const filename = fields.filename;
    const fileData = files.file;

    console.log("� Filename:", filename);
    console.log("� File data size:", fileData?.data?.length || 0);

    if (!fileData || !filename) {
      console.error("❌ Dosya veya filename eksik");
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

    // Dosyayı kaydet
    console.log("� Dosya kaydediliyor...");
    fs.writeFileSync(targetPath, fileData.data);

    console.log(`✅ Dosya yüklendi: ${targetPath}`);

    res.status(200).json({
      success: true,
      message: `${filename} başarıyla yüklendi!`,
      path: allowedFiles[filename] + filename,
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Dosya yüklenemedi: " + error.message 
    });
  }
}
