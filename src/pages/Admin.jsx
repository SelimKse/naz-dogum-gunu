import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Modal from "../components/Modal";

const Admin = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("adminAuthenticated") === "true";
  });
  const [activeTab, setActiveTab] = useState("assets");

  // Modal state'leri
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  });

  // Asset durumları (var mı yok mu kontrolü için)
  const [assetStatus, setAssetStatus] = useState({
    "photo1.png": false,
    "photo2.png": false,
    "photo3.png": false,
    "intro.mp4": false,
    "video.mp4": false,
    "nazin-kitabi.pdf": false,
  });

  // Asset kontrol loading state
  const [isCheckingAssets, setIsCheckingAssets] = useState(true);

  // Upload progress state
  const [uploadProgress, setUploadProgress] = useState({});

  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    date: "",
    title: "",
    description: "",
    icon: "📅",
  });

  // Site Koruma Ayarları - Artık backend'den yükleniyor
  const [isProtectionEnabled, setIsProtectionEnabled] = useState(true);
  const [targetDate, setTargetDate] = useState("2026-04-21");

  // Sayfa Bazlı Koruma Ayarları - Artık backend'den yükleniyor
  const [pageProtections, setPageProtections] = useState({
    home: false,
    timeline: true,
    ansiklopedi: true,
    hayaller: true,
    surpriz: true,
    hediyen: true,
  });

  // Koruma ayarlarını MongoDB'den yükle
  useEffect(() => {
    const loadProtectionSettings = async () => {
      try {
        const response = await fetch("/api/protection-settings");
        if (!response.ok) throw new Error("Ayarlar yüklenemedi");

        const settings = await response.json();
        setIsProtectionEnabled(settings.protectionEnabled);
        setTargetDate(settings.targetDate);
        setPageProtections(settings.pages);
      } catch (error) {
        console.error("Koruma ayarları yükleme hatası:", error);
        // Hata durumunda default değerler kalacak
      }
    };

    if (isAuthenticated) {
      loadProtectionSettings();
    }
  }, [isAuthenticated]);

  // Asset'leri kontrol et - Sadece fiziksel dosyalar
  useEffect(() => {
    const checkAssets = async () => {
      setIsCheckingAssets(true);
      const assetPaths = {
        "photo1.png": "/assets/images/photos/photo1.png",
        "photo2.png": "/assets/images/photos/photo2.png",
        "photo3.png": "/assets/images/photos/photo3.png",
        "intro.mp4": "/assets/videos/intro.mp4",
        "video.mp4": "/assets/videos/video.mp4",
        "nazin-kitabi.pdf": "/assets/documents/nazin-kitabi.pdf",
      };

      const newStatus = {};

      // Fiziksel dosyaları kontrol et - GET ile tam içerik iste
      await Promise.all(
        Object.entries(assetPaths).map(async ([filename, path]) => {  
          try {
            const response = await fetch(path, {
              method: "GET",
              cache: "no-cache",
            });
            
            // response.ok kontrolü yeterli değil - content-type'a da bak
            const contentType = response.headers.get("content-type") || "";
            const isHtml = contentType.includes("text/html");
            
            // Eğer HTML döndüyse (404 sayfası) dosya yok demektir
            newStatus[filename] = response.ok && !isHtml;
            
            console.log(`${newStatus[filename] ? "✅" : "❌"} ${filename}: ${path} (${response.status}, ${contentType})`);
          } catch (error) {
            newStatus[filename] = false;
            console.log(`❌ ${filename}: Hata - ${error.message}`);
          }
        })
      );

      setAssetStatus(newStatus);
      setIsCheckingAssets(false);
      console.log("📊 Fiziksel Asset Durumu:", newStatus);
    };

    if (isAuthenticated) {
      checkAssets();
      // Her 10 saniyede bir kontrol et
      const interval = setInterval(checkAssets, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Timeline'ı MongoDB'den yükle
  useEffect(() => {
    const loadTimeline = async () => {
      try {
        const response = await fetch("/api/timeline");
        if (!response.ok)
          throw new Error("Timeline yüklenemedi: " + response.status);
        const data = await response.json();
        setTimelineEvents(data);
      } catch (error) {
        console.error("Timeline yükleme hatası:", error);
        setTimelineEvents([]);
      }
    };

    if (isAuthenticated) {
      loadTimeline();
    }
  }, [isAuthenticated]);

  // Modal helper fonksiyonları
  const showModal = (title, message, type = "info", onConfirm = null) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm,
    });
  };

  const closeModal = () => {
    setModal({
      isOpen: false,
      title: "",
      message: "",
      type: "info",
      onConfirm: null,
    });
  };

  const handleLogin = () => {
    if (password === "naz2025") {
      setIsAuthenticated(true);
      localStorage.setItem("adminAuthenticated", "true");
    } else {
      showModal("Hata", "Yanlış şifre! 🔒", "error");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminAuthenticated");
    setPassword("");
  };

  // Site Koruma Ayarlarını MongoDB'ye Kaydet
  const saveProtectionSettings = async (newSettings) => {
    try {
      const response = await fetch("/api/protection-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSettings),
      });

      const data = await response.json();

      if (data.success) {
        showModal(
          "Başarılı",
          "Koruma ayarları MongoDB'ye kaydedildi!",
          "success"
        );
      } else {
        showModal("Hata", `Kaydetme hatası: ${data.error}`, "error");
      }
    } catch (error) {
      console.error("Koruma ayarları kaydetme hatası:", error);
      showModal("Hata", "Ayarlar kaydedilemedi!", "error");
    }
  };

  const handleProtectionToggle = (enabled) => {
    setIsProtectionEnabled(enabled);
    saveProtectionSettings({
      protectionEnabled: enabled,
      targetDate: targetDate,
      pages: pageProtections,
    });
  };

  const handleTargetDateChange = (date) => {
    setTargetDate(date);
    saveProtectionSettings({
      protectionEnabled: isProtectionEnabled,
      targetDate: date,
      pages: pageProtections,
    });
  };

  const handlePageProtectionToggle = (page) => {
    const newProtections = {
      ...pageProtections,
      [page]: !pageProtections[page],
    };
    setPageProtections(newProtections);
    saveProtectionSettings({
      protectionEnabled: isProtectionEnabled,
      targetDate: targetDate,
      pages: newProtections,
    });
  };

  // Asset yükleme fonksiyonu - Manuel indirme
  const handleAssetUpload = async (filename, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Dosya türüne göre hedef klasör belirle
    const pathMap = {
      "photo1.png": "public/assets/images/photos/",
      "photo2.png": "public/assets/images/photos/",
      "photo3.png": "public/assets/images/photos/",
      "intro.mp4": "public/assets/videos/",
      "video.mp4": "public/assets/videos/",
      "nazin-kitabi.pdf": "public/assets/documents/",
    };

    const targetPath = pathMap[filename] || "public/assets/";

    // Progress başlat
    setUploadProgress((prev) => ({ ...prev, [filename]: 0 }));

    // Simüle edilmiş upload progress (gerçek backend olsa XMLHttpRequest kullanılırdı)
    const simulateProgress = setInterval(() => {
      setUploadProgress((prev) => {
        const current = prev[filename] || 0;
        if (current >= 90) {
          clearInterval(simulateProgress);
          return prev;
        }
        return { ...prev, [filename]: current + 10 };
      });
    }, 100);

    try {
      // Dosyayı indirme linki oluştur (doğru isimle)
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Progress tamamla
      setTimeout(() => {
        setUploadProgress((prev) => ({ ...prev, [filename]: 100 }));
        setTimeout(() => {
          setUploadProgress((prev) => {
            const newProgress = { ...prev };
            delete newProgress[filename];
            return newProgress;
          });
        }, 1000);
      }, 200);

      showModal(
        "Manuel Yükleme",
        `✅ ${filename} indirildi!\n\n📁 Bu dosyayı şu klasöre kopyala:\n${targetPath}\n\nDosya adı: ${filename}`,
        "info"
      );
    } catch (error) {
      clearInterval(simulateProgress);
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[filename];
        return newProgress;
      });
      showModal("Hata", "Dosya indirilemedi!", "error");
    }
  };

  // Asset silme fonksiyonu - Manuel silme talimatı
  const handleAssetDelete = (filename) => {
    // Dosya türüne göre hedef klasör belirle
    const pathMap = {
      "photo1.png": "public/assets/images/photos/",
      "photo2.png": "public/assets/images/photos/",
      "photo3.png": "public/assets/images/photos/",
      "intro.mp4": "public/assets/videos/",
      "video.mp4": "public/assets/videos/",
      "nazin-kitabi.pdf": "public/assets/documents/",
    };

    const targetPath = pathMap[filename] || "public/assets/";

    showModal(
      "Manuel Silme",
      `${filename} dosyasını silmek için:\n\n📁 Klasör: ${targetPath}\n📄 Dosya: ${filename}\n\nBu dosyayı File Explorer'dan manuel olarak sil.`,
      "info"
    );
  };

  // Asset görüntüleme fonksiyonu - Yeni sekmede aç
  const handleAssetDownload = (filename) => {
    const pathMap = {
      "photo1.png": "/assets/images/photos/photo1.png",
      "photo2.png": "/assets/images/photos/photo2.png",
      "photo3.png": "/assets/images/photos/photo3.png",
      "intro.mp4": "/assets/videos/intro.mp4",
      "video.mp4": "/assets/videos/video.mp4",
      "nazin-kitabi.pdf": "/assets/documents/nazin-kitabi.pdf",
    };

    // Yeni sekmede aç
    window.open(pathMap[filename] || `/assets/${filename}`, "_blank");
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    const newPhotos = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file),
      file: file,
      type: "image",
    }));
    setUploadedPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handleVideoUpload = (event) => {
    const files = Array.from(event.target.files);
    const newVideos = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file),
      file: file,
      type: "video",
    }));
    setUploadedVideos((prev) => [...prev, ...newVideos]);
  };

  const removePhoto = (id) => {
    setUploadedPhotos((prev) => prev.filter((file) => file.id !== id));
  };

  const removeVideo = (id) => {
    setUploadedVideos((prev) => prev.filter((file) => file.id !== id));
  };

  const addTimelineEvent = async () => {
    if (newEvent.date && newEvent.title && newEvent.description) {
      // Tarih formatını DD.MM.YYYY'ye çevir
      let formattedDate = newEvent.date;
      if (newEvent.date.includes("-")) {
        // YYYY-MM-DD formatından DD.MM.YYYY'ye çevir
        const [year, month, day] = newEvent.date.split("-");
        formattedDate = `${day}.${month}.${year}`;
      }

      const event = {
        id:
          timelineEvents.length > 0
            ? Math.max(...timelineEvents.map((e) => e.id)) + 1
            : 1,
        ...newEvent,
        date: formattedDate,
      };

      const updatedEvents = [...timelineEvents, event];

      try {
        const response = await fetch("/api/timeline", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ events: updatedEvents }),
        });

        const data = await response.json();

        if (data.success) {
          setTimelineEvents(updatedEvents);
          setNewEvent({ date: "", title: "", description: "", icon: "📅" });
          showModal(
            "Başarılı",
            "Timeline olayı MongoDB'ye eklendi!",
            "success"
          );
        } else {
          showModal("Hata", `Ekleme hatası: ${data.error}`, "error");
        }
      } catch (error) {
        console.error("Timeline ekleme hatası:", error);
        showModal("Hata", "Olay eklenirken bir hata oluştu!", "error");
      }
    }
  };

  const removeTimelineEvent = async (id) => {
    showModal(
      "Onay Gerekli",
      "Bu olayı silmek istediğinize emin misiniz?",
      "question",
      async () => {
        const updatedEvents = timelineEvents.filter((event) => event.id !== id);

        try {
          const response = await fetch("/api/timeline", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ events: updatedEvents }),
          });

          const data = await response.json();

          if (data.success) {
            setTimelineEvents(updatedEvents);
            showModal(
              "Başarılı",
              "Timeline olayı MongoDB'den silindi!",
              "success"
            );
          } else {
            showModal("Hata", `Silme hatası: ${data.error}`, "error");
          }
        } catch (error) {
          console.error("Timeline silme hatası:", error);
          showModal("Hata", "Olay silinirken bir hata oluştu!", "error");
        }
      }
    );
  };

  const downloadTimelineJSON = () => {
    const dataStr = JSON.stringify(timelineEvents, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = "timeline.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const downloadAllPhotos = () => {
    uploadedPhotos.forEach((photo, index) => {
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = photo.url;
        link.download = photo.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 100);
    });
  };

  const downloadAllVideos = () => {
    uploadedVideos.forEach((video, index) => {
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = video.url;
        link.download = video.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 100);
    });
  };

  if (!isAuthenticated) {
    return (
      <>
        <Modal
          isOpen={modal.isOpen}
          onClose={closeModal}
          title={modal.title}
          message={modal.message}
          type={modal.type}
          onConfirm={modal.onConfirm}
        />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
          <motion.div
            className="bg-gray-900 rounded-2xl p-8 shadow-xl shadow-purple-500/20 max-w-md w-full border-2 border-purple-500/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-6">
              <span className="text-4xl mb-4 block">🔐</span>
              <h2 className="text-2xl font-bold text-purple-400 mb-2">
                Admin Girişi
              </h2>
              <p className="text-gray-400">
                Yönetim paneline erişim için şifre gerekli
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifre giriniz..."
                className="w-full px-4 py-3 bg-gray-800 border border-purple-500/30 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-500"
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />

              <motion.button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Giriş Yap
              </motion.button>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="bg-gray-900 rounded-2xl shadow-xl shadow-purple-500/20 overflow-hidden border-2 border-purple-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
              <h1 className="text-3xl font-bold text-white text-center">
                🎉 Naz Admin Panel
              </h1>
              <p className="text-white/80 text-center mt-2">
                Doğum günü içeriklerini yönet
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-700 overflow-x-auto">
              <button
                onClick={() => setActiveTab("assets")}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-colors whitespace-nowrap ${
                  activeTab === "assets"
                    ? "bg-purple-900/50 text-purple-300 border-b-2 border-purple-500"
                    : "text-gray-400 hover:bg-gray-800/50"
                }`}
              >
                🎨 Asset'ler
              </button>
              <button
                onClick={() => setActiveTab("timeline")}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-colors whitespace-nowrap ${
                  activeTab === "timeline"
                    ? "bg-purple-900/50 text-purple-300 border-b-2 border-purple-500"
                    : "text-gray-400 hover:bg-gray-800/50"
                }`}
              >
                📖 Timeline
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-colors whitespace-nowrap ${
                  activeTab === "settings"
                    ? "bg-purple-900/50 text-purple-300 border-b-2 border-purple-500"
                    : "text-gray-400 hover:bg-gray-800/50"
                }`}
              >
                ⚙️ Ayarlar
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === "assets" && (
                <div className="space-y-6">
                  {/* Genel Durum Özeti */}
                  <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-6 rounded-xl border-2 border-purple-500/50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span>📊</span> Asset Durumu
                        {isCheckingAssets && (
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="text-xl"
                          >
                            ⏳
                          </motion.span>
                        )}
                      </h3>
                      <button
                        onClick={() => {
                          console.clear();
                          console.log("🔍 MANUEL ASSET KONTROLÜ");
                          console.log("Current assetStatus:", assetStatus);
                          Object.entries(assetStatus).forEach(([name, status]) => {
                            console.log(`${status ? "✅" : "❌"} ${name}`);
                          });
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                      >
                        🔍 Console'u Kontrol Et
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                        <div className="text-3xl mb-2">
                          {Object.values(assetStatus).filter(Boolean).length}
                        </div>
                        <div className="text-green-400 font-semibold">
                          Hazır
                        </div>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                        <div className="text-3xl mb-2">
                          {Object.values(assetStatus).filter((v) => !v).length}
                        </div>
                        <div className="text-red-400 font-semibold">Eksik</div>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                        <div className="text-3xl mb-2">6</div>
                        <div className="text-gray-400 font-semibold">
                          Toplam
                        </div>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                        <div className="text-3xl mb-2">
                          {Math.round(
                            (Object.values(assetStatus).filter(Boolean).length /
                              6) *
                              100
                          )}
                          %
                        </div>
                        <div className="text-purple-400 font-semibold">
                          Tamamlama
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ana Sayfa Fotoğrafları */}
                  <div className="bg-gray-800/50 p-6 rounded-xl border-2 border-purple-500/30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-purple-300 flex items-center gap-2">
                        <span>📸</span> Ana Sayfa Fotoğrafları
                      </h3>
                      <span className="text-sm text-gray-400">
                        /assets/images/photos/
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {["photo1.png", "photo2.png", "photo3.png"].map(
                        (filename, index) => (
                          <motion.div
                            key={filename}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              assetStatus[filename]
                                ? "bg-green-900/20 border-green-500/50"
                                : "bg-red-900/20 border-red-500/50"
                            }`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-bold text-white mb-1">
                                  Fotoğraf {index + 1}
                                </h4>
                                <p className="text-xs text-gray-400">
                                  {filename}
                                </p>
                              </div>
                              <div className="text-2xl">
                                {assetStatus[filename] ? "✅" : "❌"}
                              </div>
                            </div>

                            {assetStatus[filename] ? (
                              <div className="space-y-2">
                                <div className="bg-green-500/10 border border-green-500/30 rounded px-3 py-2 text-xs text-green-400">
                                  ✓ Dosya mevcut ve erişilebilir
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleAssetDownload(filename)}
                                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                  >
                                    👁️ Görüntüle
                                  </button>
                                  <button
                                    onClick={() => handleAssetDelete(filename)}
                                    className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="bg-red-500/10 border border-red-500/30 rounded px-3 py-2 text-xs text-red-400">
                                  ✗ Dosya bulunamadı
                                </div>
                                {uploadProgress[filename] !== undefined ? (
                                  <div className="space-y-1">
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                      <motion.div
                                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${uploadProgress[filename]}%` }}
                                        transition={{ duration: 0.3 }}
                                      />
                                    </div>
                                    <p className="text-xs text-purple-400 text-center">
                                      İndiriliyor... {uploadProgress[filename]}%
                                    </p>
                                  </div>
                                ) : (
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                      handleAssetUpload(filename, e)
                                    }
                                    className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded text-xs file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-purple-600 file:text-white file:cursor-pointer hover:file:bg-purple-700"
                                  />
                                )}
                              </div>
                            )}
                          </motion.div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Surpriz Sayfası Videoları */}
                  <div className="bg-gray-800/50 p-6 rounded-xl border-2 border-blue-500/30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-blue-300 flex items-center gap-2">
                        <span>🎬</span> Surpriz Sayfası Videoları
                      </h3>
                      <span className="text-sm text-gray-400">
                        /assets/videos/
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { file: "intro.mp4", label: "Giriş Videosu" },
                        { file: "video.mp4", label: "Özel Video" },
                      ].map(({ file, label }, index) => (
                        <motion.div
                          key={file}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            assetStatus[file]
                              ? "bg-green-900/20 border-green-500/50"
                              : "bg-red-900/20 border-red-500/50"
                          }`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-bold text-white mb-1">
                                {label}
                              </h4>
                              <p className="text-xs text-gray-400">{file}</p>
                            </div>
                            <div className="text-2xl">
                              {assetStatus[file] ? "✅" : "❌"}
                            </div>
                          </div>

                          {assetStatus[file] ? (
                            <div className="space-y-2">
                              <div className="bg-green-500/10 border border-green-500/30 rounded px-3 py-2 text-xs text-green-400">
                                ✓ Dosya mevcut ve erişilebilir
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleAssetDownload(file)}
                                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                >
                                  ▶️ Oynat
                                </button>
                                <button
                                  onClick={() => handleAssetDelete(file)}
                                  className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="bg-red-500/10 border border-red-500/30 rounded px-3 py-2 text-xs text-red-400">
                                ✗ Video bulunamadı
                              </div>
                              {uploadProgress[file] !== undefined ? (
                                <div className="space-y-1">
                                  <div className="w-full bg-gray-700 rounded-full h-2">
                                    <motion.div
                                      className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${uploadProgress[file]}%` }}
                                      transition={{ duration: 0.3 }}
                                    />
                                  </div>
                                  <p className="text-xs text-blue-400 text-center">
                                    İndiriliyor... {uploadProgress[file]}%
                                  </p>
                                </div>
                              ) : (
                                <input
                                  type="file"
                                  accept="video/*"
                                  onChange={(e) => handleAssetUpload(file, e)}
                                  className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded text-xs file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700"
                                />
                              )}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Hediyen Sayfası PDF */}
                  <div className="bg-gray-800/50 p-6 rounded-xl border-2 border-orange-500/30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-orange-300 flex items-center gap-2">
                        <span>📚</span> Hediyen Sayfası Kitabı
                      </h3>
                      <span className="text-sm text-gray-400">
                        /assets/documents/
                      </span>
                    </div>
                    <motion.div
                      className={`p-4 rounded-lg border-2 transition-all max-w-md ${
                        assetStatus["nazin-kitabi.pdf"]
                          ? "bg-green-900/20 border-green-500/50"
                          : "bg-red-900/20 border-red-500/50"
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-white mb-1">
                            Naz'ın Kitabı
                          </h4>
                          <p className="text-xs text-gray-400">
                            nazin-kitabi.pdf
                          </p>
                        </div>
                        <div className="text-2xl">
                          {assetStatus["nazin-kitabi.pdf"] ? "✅" : "❌"}
                        </div>
                      </div>

                      {assetStatus["nazin-kitabi.pdf"] ? (
                        <div className="space-y-2">
                          <div className="bg-green-500/10 border border-green-500/30 rounded px-3 py-2 text-xs text-green-400">
                            ✓ Dosya mevcut ve erişilebilir
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleAssetDownload("nazin-kitabi.pdf")
                              }
                              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                            >
                              📄 Aç
                            </button>
                            <button
                              onClick={() =>
                                handleAssetDelete("nazin-kitabi.pdf")
                              }
                              className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="bg-red-500/10 border border-red-500/30 rounded px-3 py-2 text-xs text-red-400">
                            ✗ PDF dosyası bulunamadı
                          </div>
                          {uploadProgress["nazin-kitabi.pdf"] !== undefined ? (
                            <div className="space-y-1">
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <motion.div
                                  className="bg-gradient-to-r from-orange-600 to-red-600 h-2 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${uploadProgress["nazin-kitabi.pdf"]}%` }}
                                  transition={{ duration: 0.3 }}
                                />
                              </div>
                              <p className="text-xs text-orange-400 text-center">
                                İndiriliyor... {uploadProgress["nazin-kitabi.pdf"]}%
                              </p>
                            </div>
                          ) : (
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={(e) =>
                                handleAssetUpload("nazin-kitabi.pdf", e)
                              }
                              className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded text-xs file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-orange-600 file:text-white file:cursor-pointer hover:file:bg-orange-700"
                            />
                          )}
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  {/* Site Koruma Sistemi */}
                  <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl border-2 border-red-500/30">
                    <h3 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                      <span>🛡️</span> Site Koruma Sistemi
                    </h3>

                    <div className="space-y-4">
                      {/* Ana Koruma Ayarı */}
                      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-purple-300">
                              Tarih Koruması
                            </h4>
                            <p className="text-sm text-gray-400">
                              Belirlenen tarihe kadar siteyi kilitler
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isProtectionEnabled}
                              onChange={(e) =>
                                handleProtectionToggle(e.target.checked)
                              }
                              className="sr-only peer"
                            />
                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Hedef Tarih
                          </label>
                          <input
                            type="date"
                            value={targetDate}
                            onChange={(e) =>
                              handleTargetDateChange(e.target.value)
                            }
                            className="w-full p-3 bg-gray-700 border-2 border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            Bu tarihten önce site erişime kapalı olacak
                          </p>
                        </div>
                      </div>

                      {/* Sayfa Bazlı Koruma */}
                      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <h4 className="font-semibold text-purple-300 mb-3">
                          Sayfa Bazlı Erişim Kontrolü
                        </h4>
                        <div className="space-y-3">
                          {[
                            { key: "home", name: "Ana Sayfa", icon: "🏠" },
                            { key: "timeline", name: "Timeline", icon: "📖" },
                            {
                              key: "ansiklopedi",
                              name: "Ansiklopedi",
                              icon: "📚",
                            },
                            { key: "hayaller", name: "Hayaller", icon: "✨" },
                            { key: "surpriz", name: "Sürpriz", icon: "🎁" },
                            { key: "hediyen", name: "Hediyen", icon: "💝" },
                          ].map((page) => (
                            <div
                              key={page.key}
                              className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{page.icon}</span>
                                <span className="font-medium text-gray-200">
                                  {page.name}
                                </span>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={pageProtections[page.key]}
                                  onChange={() =>
                                    handlePageProtectionToggle(page.key)
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-3">
                          💡 Yeşil: Erişime açık | Gri: Tarih koruması aktif
                        </p>
                      </div>

                      {/* Çıkış Butonu */}
                      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <button
                          onClick={handleLogout}
                          className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-colors font-semibold flex items-center justify-center gap-2 shadow-lg shadow-red-500/50"
                        >
                          <span>🚪</span> Admin Panelinden Çıkış Yap
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "photos-old-removed" && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <span>📸</span> Fotoğraf Yükle
                    </h3>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="w-full p-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-naz-purple-500 bg-white"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      💡 Birden fazla fotoğraf seçebilirsiniz (JPEG, PNG, GIF)
                    </p>
                  </div>

                  {uploadedPhotos.length > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">
                          📷 Yüklenen Fotoğraflar ({uploadedPhotos.length})
                        </h3>
                        <button
                          onClick={downloadAllPhotos}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                        >
                          <span>📥</span> Tümünü İndir
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {uploadedPhotos.map((photo) => (
                          <motion.div
                            key={photo.id}
                            className="relative group"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <img
                              src={photo.url}
                              alt={photo.name}
                              className="w-full h-40 object-cover rounded-lg shadow-lg border-2 border-purple-200"
                            />
                            <button
                              onClick={() => removePhoto(photo.id)}
                              className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                            >
                              ×
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="truncate">{photo.name}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {uploadedPhotos.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <span className="text-6xl mb-4 block">📸</span>
                      <p className="text-gray-600 text-lg">
                        Henüz fotoğraf yüklenmedi
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        Yukarıdaki alandan fotoğraf yükleyebilirsiniz
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "videos" && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <span>🎥</span> Video Yükle
                    </h3>
                    <input
                      type="file"
                      multiple
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="w-full p-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-naz-blue-500 bg-white"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      💡 Birden fazla video seçebilirsiniz (MP4, MOV, AVI, WebM)
                    </p>
                  </div>

                  {uploadedVideos.length > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">
                          🎬 Yüklenen Videolar ({uploadedVideos.length})
                        </h3>
                        <button
                          onClick={downloadAllVideos}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                        >
                          <span>📥</span> Tümünü İndir
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {uploadedVideos.map((video) => (
                          <motion.div
                            key={video.id}
                            className="relative group"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <video
                              src={video.url}
                              className="w-full h-48 object-cover rounded-lg shadow-lg border-2 border-blue-200"
                              controls
                            />
                            <button
                              onClick={() => removeVideo(video.id)}
                              className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg z-10"
                            >
                              ×
                            </button>
                            <div className="mt-2 p-2 bg-gray-50 rounded">
                              <p className="text-xs text-gray-600 truncate">
                                {video.name}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {uploadedVideos.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <span className="text-6xl mb-4 block">🎥</span>
                      <p className="text-gray-600 text-lg">
                        Henüz video yüklenmedi
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        Yukarıdaki alandan video yükleyebilirsiniz
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "timeline" && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl border-2 border-orange-500/30">
                    <h3 className="text-xl font-semibold text-purple-300 mb-4 flex items-center gap-2">
                      <span>➕</span> Yeni Timeline Olayı Ekle
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) =>
                          setNewEvent((prev) => ({
                            ...prev,
                            date: e.target.value,
                          }))
                        }
                        className="p-3 bg-gray-700 border-2 border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Tarih"
                      />
                      <input
                        type="text"
                        placeholder="Başlık (örn: İlk Buluşma)"
                        value={newEvent.title}
                        onChange={(e) =>
                          setNewEvent((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        className="p-3 bg-gray-700 border-2 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      <input
                        type="text"
                        placeholder="İkon (örn: ❤️, 🎉, 🌟)"
                        value={newEvent.icon}
                        onChange={(e) =>
                          setNewEvent((prev) => ({
                            ...prev,
                            icon: e.target.value,
                          }))
                        }
                        className="p-3 bg-gray-700 border-2 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      <textarea
                        placeholder="Açıklama"
                        value={newEvent.description}
                        onChange={(e) =>
                          setNewEvent((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className="p-3 bg-gray-700 border-2 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        rows="1"
                      />
                    </div>
                    <button
                      onClick={addTimelineEvent}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-colors font-semibold flex items-center gap-2 shadow-lg shadow-green-500/50"
                    >
                      <span>➕</span> Olayı Ekle
                    </button>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-purple-300 flex items-center gap-2">
                        <span>📖</span> Mevcut Timeline Olayları (
                        {timelineEvents.length})
                      </h3>
                      <button
                        onClick={downloadTimelineJSON}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors flex items-center gap-2 font-semibold shadow-lg shadow-blue-500/50"
                      >
                        <span>📥</span> JSON İndir
                      </button>
                    </div>

                    {timelineEvents.length > 0 ? (
                      <div className="space-y-3">
                        {timelineEvents.map((event, index) => (
                          <motion.div
                            key={event.id}
                            className="bg-gray-800/50 p-5 rounded-lg border-2 border-purple-500/30 hover:border-purple-400/50 hover:shadow-md hover:shadow-purple-500/20 transition-all"
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-2xl">
                                    {event.icon || "📅"}
                                  </span>
                                  <span className="font-bold text-purple-300 bg-gray-900/80 px-3 py-1 rounded-full border border-purple-500/30">
                                    {event.date}
                                  </span>
                                  <span className="text-gray-600">•</span>
                                  <span className="font-semibold text-purple-300 text-lg">
                                    {event.title}
                                  </span>
                                </div>
                                <p className="text-gray-200 ml-11">
                                  {event.description}
                                </p>
                              </div>
                              <button
                                onClick={() => removeTimelineEvent(event.id)}
                                className="ml-4 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-colors flex items-center gap-2 font-semibold shadow-lg shadow-red-500/50"
                              >
                                <span>🗑️</span> Sil
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-700">
                        <span className="text-6xl mb-4 block">📖</span>
                        <p className="text-gray-300 text-lg">
                          Henüz timeline olayı eklenmedi
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                          Yukarıdaki formdan yeni olay ekleyebilirsiniz
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Admin;
