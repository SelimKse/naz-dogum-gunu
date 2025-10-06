# naz-dogum-gunu

🎉 Naz için özel doğum günü web sitesi

## 🚀 Deployment (Vercel)

### Environment Variables

Vercel Dashboard'da bu environment variable'ı ekle:

1. Vercel projesine git
2. Settings → Environment Variables
3. Şunu ekle:
   - **Name**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: Vercel otomatik olarak oluşturacak
   - **Veya** Vercel Blob Storage sayfasından token al

### Vercel Blob Storage Setup

1. Vercel Dashboard → Storage sekmesi
2. "Create Database" → "Blob" seç
3. Token otomatik olarak oluşturulacak
4. Proje environment variables'a otomatik eklenecek

## 📋 Features

- ✅ Asset yükleme sistemi (Vercel Blob Storage)
- ✅ Otomatik progress tracking
- ✅ MongoDB ile timeline/settings yönetimi
- ✅ Admin panel
- ✅ Tarih bazlı sayfa koruması

## 🛠️ Local Development

```bash
npm install
npm run dev
```

