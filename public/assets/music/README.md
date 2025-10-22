# 🎵 Müzik Klasörü

Bu klasöre müzik dosyalarını ekleyin.

## 📁 Dosya Yapısı

```
public/assets/music/
├── song.mp3           # Çalınacak şarkı (gerekli)
├── cover.jpg          # Kapak resmi (opsiyonel)
└── README.md          # Bu dosya
```

## 🎵 Şarkı Ekleme

1. Şarkını `song.mp3` adıyla bu klasöre kaydet
   - Desteklenen formatlar: .mp3, .wav, .ogg
   - Önerilen format: MP3 (uyumluluk için)

2. (Opsiyonel) Kapak resmini `cover.jpg` adıyla kaydet
   - Desteklenen formatlar: .jpg, .jpeg, .png
   - Önerilen boyut: 300x300 px veya daha büyük
   - Kare format önerilir

## ⚙️ Home.jsx'te Güncelleme

`src/pages/Home.jsx` dosyasında:

```javascript
const track = {
  name: "Şarkının Adı",           // Görünecek şarkı adı
  artist: "Sanatçı Adı",          // Görünecek sanatçı adı
  image: "/assets/music/cover.jpg", // Kapak resmi yolu
  url: "/assets/music/song.mp3",    // Müzik dosyası yolu
};
```

## 🎨 Örnek

```javascript
const track = {
  name: "Happy Birthday",
  artist: "Naz'a Özel",
  image: "/assets/music/birthday-cover.jpg",
  url: "/assets/music/happy-birthday.mp3",
};
```

## 📝 Notlar

- Müzik dosyası **gereklidir**, kapak resmi opsiyoneldir
- Kapak resmi yoksa otomatik olarak gradient arka plan gösterilir
- Şarkı hikaye başladığında otomatik olarak çalar
- Loop (döngü) modunda çalışır
- Play/Pause butonu ile kontrol edilebilir

## 🎵 Müzik Önerileri

- Doğum günü şarkıları
- Özel anlamı olan şarkılar
- Favoriler
- Duygusal şarkılar

---

Müziğini ekledikten sonra `npm run dev` ile uygulamayı başlat!

