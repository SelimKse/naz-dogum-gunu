import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Modal from "../components/Modal";
import { upload } from "@vercel/blob/client";

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

  // Asset URL'leri (Vercel Blob'dan)
  const [assetUrls, setAssetUrls] = useState({});

  // Asset kontrol loading state
  const [isCheckingAssets, setIsCheckingAssets] = useState(true);

  // Upload progress state
  const [uploadProgress, setUploadProgress] = useState({});

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

  // Asset'leri kontrol et - Vercel Blob'dan
  useEffect(() => {
    const checkAssets = async () => {
      setIsCheckingAssets(true);

      try {
        // Vercel Blob'dan asset listesini al
        const response = await fetch("/api/list-assets");

        if (!response.ok) {
          throw new Error("Asset listesi alınamadı");
        }

        const data = await response.json();

        if (data.success) {
          // Asset URL'lerini kaydet
          const newStatus = {};
          const fileNames = [
            "photo1.png",
            "photo2.png",
            "photo3.png",
            "intro.mp4",
            "video.mp4",
            "nazin-kitabi.pdf",
          ];

          fileNames.forEach((filename) => {
            newStatus[filename] = data.assets[filename] !== null;
            console.log(
              `${newStatus[filename] ? "✅" : "❌"} ${filename}: ${
                data.assets[filename] ? "Vercel Blob'da" : "Yok"
              }`
            );
          });

          setAssetStatus(newStatus);
          setAssetUrls(data.assets); // URL'leri kaydet
        } else {
          throw new Error(data.error || "Asset listesi alınamadı");
        }
      } catch (error) {
        console.error("Asset kontrol hatası:", error);
        // Hata durumunda tüm asset'leri yok olarak işaretle
        setAssetStatus({
          "photo1.png": false,
          "photo2.png": false,
          "photo3.png": false,
          "intro.mp4": false,
          "video.mp4": false,
          "nazin-kitabi.pdf": false,
        });
      }

      setIsCheckingAssets(false);
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

  // Asset yükleme fonksiyonu - Vercel Blob Storage
  const handleAssetUpload = async (filename, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Dosya boyutu kontrolü (1GB = 1073741824 bytes)
    const maxSize = 1024 * 1024 * 1024; // 1GB
    if (file.size > maxSize) {
      showModal(
        "Dosya Çok Büyük",
        `${filename} maksimum 1GB olabilir (şu an: ${(file.size / 1024 / 1024).toFixed(2)} MB)`,
        "error"
      );
      return;
    }

    console.log(`📦 ${filename} yükleniyor (${(file.size / 1024 / 1024).toFixed(2)} MB)...`);

    // Progress başlat
    setUploadProgress((prev) => ({ ...prev, [filename]: 0 }));

    try {
      // Vercel Blob'un client-side upload'ı - otomatik multipart (1GB'a kadar)
      const newBlob = await upload(filename, file, {
        access: "public",
        handleUploadUrl: "/api/upload-chunk",
        onUploadProgress: ({ percentage }) => {
          setUploadProgress((prev) => ({
            ...prev,
            [filename]: Math.round(percentage),
          }));
        },
      });

      console.log("✅ Upload tamamlandı:", newBlob.url);

      // Progress'i 100'de tut
      setUploadProgress((prev) => ({ ...prev, [filename]: 100 }));

      // 1 saniye sonra temizle ve güncelle
      setTimeout(() => {
        setUploadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[filename];
          return newProgress;
        });

        // Asset durumunu güncelle
        setAssetStatus((prev) => ({ ...prev, [filename]: true }));
        setAssetUrls((prev) => ({ ...prev, [filename]: newBlob.url }));
      }, 1000);

      showModal("Başarılı", `${filename} Vercel Blob'a yüklendi! (${(file.size / 1024 / 1024).toFixed(2)} MB)`, "success");
    } catch (error) {
      console.error("Upload error:", error);

      // Progress'i temizle
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[filename];
        return newProgress;
      });

      showModal(
        "❌ Hata",
        `Dosya yüklenemedi!\n\nHata: ${error.message}`,
        "error"
      );
    }
  };

  // Asset silme fonksiyonu - Otomatik silme
  const handleAssetDelete = (filename) => {
    showModal(
      "Onay Gerekli",
      `${filename} dosyasını kalıcı olarak silmek istediğinize emin misiniz?\n\nBu işlem geri alınamaz!`,
      "question",
      async () => {
        try {
          const response = await fetch("/api/delete-asset", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ filename }),
          });

          const data = await response.json();

          if (data.success) {
            // Asset durumunu güncelle
            setAssetStatus((prev) => ({ ...prev, [filename]: false }));
            showModal("Başarılı", `${filename} başarıyla silindi!`, "success");
          } else {
            showModal("Hata", `Silme hatası: ${data.error}`, "error");
          }
        } catch (error) {
          console.error("Silme hatası:", error);
          showModal("Hata", "Dosya silinemedi!", "error");
        }
      }
    );
  };

  // Asset görüntüleme fonksiyonu - Yeni sekmede aç
  const handleAssetDownload = (filename) => {
    // Vercel Blob URL'ini kullan
    const url = assetUrls[filename];

    if (url) {
      // Yeni sekmede aç
      window.open(url, "_blank");
    } else {
      showModal("Hata", "Dosya URL'i bulunamadı!", "error");
    }
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
                            transition={{
                              repeat: Infinity,
                              duration: 1,
                              ease: "linear",
                            }}
                            className="text-xl"
                          >
                            ⏳
                          </motion.span>
                        )}
                      </h3>
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
                                    onClick={() =>
                                      handleAssetDownload(filename)
                                    }
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
                                        animate={{
                                          width: `${uploadProgress[filename]}%`,
                                        }}
                                        transition={{ duration: 0.3 }}
                                      />
                                    </div>
                                    <p className="text-xs text-purple-400 text-center">
                                      Yükleniyor... {uploadProgress[filename]}%
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
                                      animate={{
                                        width: `${uploadProgress[file]}%`,
                                      }}
                                      transition={{ duration: 0.3 }}
                                    />
                                  </div>
                                  <p className="text-xs text-blue-400 text-center">
                                    Yükleniyor... {uploadProgress[file]}%
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
                                  animate={{
                                    width: `${uploadProgress["nazin-kitabi.pdf"]}%`,
                                  }}
                                  transition={{ duration: 0.3 }}
                                />
                              </div>
                              <p className="text-xs text-orange-400 text-center">
                                Yükleniyor...{" "}
                                {uploadProgress["nazin-kitabi.pdf"]}%
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
