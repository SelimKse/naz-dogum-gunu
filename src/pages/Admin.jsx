import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import timelineData from "../assets/timeline.json";
import Modal from "../components/Modal";

const Admin = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // LocalStorage'dan oturum kontrolü
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

  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    date: "",
    title: "",
    description: "",
    icon: "📅",
  });

  // Site Koruma Ayarları
  const [isProtectionEnabled, setIsProtectionEnabled] = useState(() => {
    return localStorage.getItem("siteProtectionEnabled") !== "false"; // Default true
  });
  const [targetDate, setTargetDate] = useState(() => {
    return localStorage.getItem("siteTargetDate") || "2026-04-21";
  });

  // Sayfa Bazlı Koruma Ayarları
  const [pageProtections, setPageProtections] = useState(() => {
    const saved = localStorage.getItem("pageProtections");
    return saved
      ? JSON.parse(saved)
      : {
          home: false,
          timeline: true,
          ansiklopedi: true,
          hayaller: true,
          surpriz: true,
          hediyen: true,
        };
  });

  // Asset'leri kontrol et
  useEffect(() => {
    const checkAssets = async () => {
      const assets = [
        "photo1.png",
        "photo2.png",
        "photo3.png",
        "intro.mp4",
        "video.mp4",
        "nazin-kitabi.pdf",
      ];

      const statusChecks = await Promise.all(
        assets.map(async (filename) => {
          try {
            const response = await fetch(
              `http://localhost:3001/api/check-asset/${filename}`
            );
            const data = await response.json();
            return { filename, exists: data.exists };
          } catch (error) {
            console.error(`${filename} kontrol hatası:`, error);
            return { filename, exists: false };
          }
        })
      );

      const newStatus = {};
      statusChecks.forEach(({ filename, exists }) => {
        newStatus[filename] = exists;
      });
      setAssetStatus(newStatus);
    };

    if (isAuthenticated) {
      checkAssets();
    }
  }, [isAuthenticated]);

  // Timeline'ı yükle
  useEffect(() => {
    const loadTimeline = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/timeline");
        const data = await response.json();
        setTimelineEvents(data);
      } catch (error) {
        console.error("Timeline yükleme hatası:", error);
        setTimelineEvents(timelineData);
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

  // Site Koruma Ayarlarını Kaydet
  const handleProtectionToggle = (enabled) => {
    setIsProtectionEnabled(enabled);
    localStorage.setItem("siteProtectionEnabled", enabled.toString());
  };

  const handleTargetDateChange = (date) => {
    setTargetDate(date);
    localStorage.setItem("siteTargetDate", date);
  };

  const handlePageProtectionToggle = (page) => {
    const newProtections = {
      ...pageProtections,
      [page]: !pageProtections[page],
    };
    setPageProtections(newProtections);
    localStorage.setItem("pageProtections", JSON.stringify(newProtections));
  };

  // Asset yükleme fonksiyonu
  const handleAssetUpload = async (filename, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("targetName", filename);

    try {
      const response = await fetch("http://localhost:3001/api/upload-asset", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        showModal("Başarılı", `${filename} başarıyla yüklendi!`, "success");
        // Asset durumunu güncelle
        setAssetStatus((prev) => ({ ...prev, [filename]: true }));
      } else {
        showModal("Hata", `Yükleme hatası: ${data.error}`, "error");
      }
    } catch (error) {
      console.error("Yükleme hatası:", error);
      showModal("Hata", "Dosya yüklenirken bir hata oluştu!", "error");
    }
  };

  // Asset silme fonksiyonu
  const handleAssetDelete = async (filename) => {
    showModal(
      "Onay Gerekli",
      `${filename} dosyasını silmek istediğinize emin misiniz?`,
      "question",
      async () => {
        try {
          const response = await fetch(
            `http://localhost:3001/api/delete-asset/${filename}`,
            {
              method: "DELETE",
            }
          );

          const data = await response.json();

          if (data.success) {
            showModal("Başarılı", `${filename} başarıyla silindi!`, "success");
            // Asset durumunu güncelle
            setAssetStatus((prev) => ({ ...prev, [filename]: false }));
          } else {
            showModal("Hata", `Silme hatası: ${data.error}`, "error");
          }
        } catch (error) {
          console.error("Silme hatası:", error);
          showModal("Hata", "Dosya silinirken bir hata oluştu!", "error");
        }
      }
    );
  };

  // Asset indirme fonksiyonu
  const handleAssetDownload = (filename) => {
    const link = document.createElement("a");
    link.href = `/src/assets/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        const response = await fetch("http://localhost:3001/api/timeline", {
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
          showModal("Başarılı", "Timeline olayı başarıyla eklendi!", "success");
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
          const response = await fetch("http://localhost:3001/api/timeline", {
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
              "Timeline olayı başarıyla silindi!",
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
                <div className="space-y-8">
                  {/* Ana Sayfa Fotoğrafları */}
                  <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl border-2 border-purple-500/30">
                    <h3 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                      <span>🏠</span> Ana Sayfa Fotoğrafları
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-800 p-4 rounded-lg border-2 border-purple-500/30">
                        <h4 className="font-semibold text-purple-300 mb-2">
                          Fotoğraf 1
                        </h4>
                        {assetStatus["photo1.png"] ? (
                          <>
                            <p className="text-xs text-green-400 mb-2">
                              ✅ Mevcut: src/assets/photo1.png
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleAssetDownload("photo1.png")
                                }
                                className="flex-1 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                              >
                                📥 İndir
                              </button>
                              <button
                                onClick={() => handleAssetDelete("photo1.png")}
                                className="flex-1 px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                              >
                                🗑️ Sil
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="text-xs text-red-400 mb-2">
                              ❌ Eksik: src/assets/photo1.png yükleyin
                            </p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleAssetUpload("photo1.png", e)
                              }
                              className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                            />
                          </>
                        )}
                      </div>

                      <div className="bg-gray-800 p-4 rounded-lg border-2 border-purple-500/30">
                        <h4 className="font-semibold text-purple-300 mb-2">
                          Fotoğraf 2
                        </h4>
                        {assetStatus["photo2.png"] ? (
                          <>
                            <p className="text-xs text-green-400 mb-2">
                              ✅ Mevcut: src/assets/photo2.png
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleAssetDownload("photo2.png")
                                }
                                className="flex-1 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                              >
                                📥 İndir
                              </button>
                              <button
                                onClick={() => handleAssetDelete("photo2.png")}
                                className="flex-1 px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                              >
                                🗑️ Sil
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="text-xs text-red-400 mb-2">
                              ❌ Eksik: src/assets/photo2.png yükleyin
                            </p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleAssetUpload("photo2.png", e)
                              }
                              className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                            />
                          </>
                        )}
                      </div>

                      {/* photo3.png */}
                      <div className="bg-gray-800 p-4 rounded-lg border-2 border-purple-500/30">
                        <h4 className="font-semibold text-purple-300 mb-2">
                          Fotoğraf 3
                        </h4>
                        {assetStatus["photo3.png"] ? (
                          <>
                            <p className="text-xs text-green-400 mb-2">
                              ✅ Mevcut: src/assets/photo3.png
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleAssetDownload("photo3.png")
                                }
                                className="flex-1 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                              >
                                📥 İndir
                              </button>
                              <button
                                onClick={() => handleAssetDelete("photo3.png")}
                                className="flex-1 px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                              >
                                🗑️ Sil
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="text-xs text-red-400 mb-2">
                              ❌ Eksik: src/assets/photo3.png yükleyin
                            </p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleAssetUpload("photo3.png", e)
                              }
                              className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Surpriz Sayfası Videoları */}
                  <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl border-2 border-blue-500/30">
                    <h3 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                      <span>🎬</span> Surpriz Sayfası Videoları
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Intro Video */}
                      <div className="bg-gray-800 p-4 rounded-lg border-2 border-blue-500/30">
                        <h4 className="font-semibold text-blue-300 mb-2">
                          intro.mp4
                        </h4>
                        {assetStatus["intro.mp4"] ? (
                          <>
                            <p className="text-xs text-green-400 mb-2">
                              ✅ Mevcut: src/assets/intro.mp4
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAssetDownload("intro.mp4")}
                                className="flex-1 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                              >
                                📥 İndir
                              </button>
                              <button
                                onClick={() => handleAssetDelete("intro.mp4")}
                                className="flex-1 px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                              >
                                🗑️ Sil
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="text-xs text-red-400 mb-2">
                              ❌ Eksik: src/assets/intro.mp4 yükleyin
                            </p>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={(e) =>
                                handleAssetUpload("intro.mp4", e)
                              }
                              className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                            />
                          </>
                        )}
                      </div>

                      {/* Surpriz Video */}
                      <div className="bg-gray-800 p-4 rounded-lg border-2 border-blue-500/30">
                        <h4 className="font-semibold text-blue-300 mb-2">
                          video.mp4
                        </h4>
                        {assetStatus["video.mp4"] ? (
                          <>
                            <p className="text-xs text-green-400 mb-2">
                              ✅ Mevcut: src/assets/video.mp4
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAssetDownload("video.mp4")}
                                className="flex-1 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                              >
                                📥 İndir
                              </button>
                              <button
                                onClick={() => handleAssetDelete("video.mp4")}
                                className="flex-1 px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                              >
                                🗑️ Sil
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="text-xs text-red-400 mb-2">
                              ❌ Eksik: src/assets/video.mp4 yükleyin
                            </p>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={(e) =>
                                handleAssetUpload("video.mp4", e)
                              }
                              className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hediyen Sayfası PDF */}
                  <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl border-2 border-orange-500/30">
                    <h3 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                      <span>📚</span> Hediyen Sayfası Kitabı
                    </h3>
                    <div className="bg-gray-800 p-4 rounded-lg border-2 border-orange-500/30 max-w-md">
                      <h4 className="font-semibold text-orange-300 mb-2">
                        nazin-kitabi.pdf
                      </h4>
                      {assetStatus["nazin-kitabi.pdf"] ? (
                        <>
                          <p className="text-xs text-green-400 mb-2">
                            ✅ Mevcut: src/assets/nazin-kitabi.pdf
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleAssetDownload("nazin-kitabi.pdf")
                              }
                              className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              📥 İndir
                            </button>
                            <button
                              onClick={() =>
                                handleAssetDelete("nazin-kitabi.pdf")
                              }
                              className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              🗑️ Sil
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-xs text-red-400 mb-2">
                            ❌ Eksik: src/assets/nazin-kitabi.pdf yükleyin
                          </p>
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) =>
                              handleAssetUpload("nazin-kitabi.pdf", e)
                            }
                            className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded text-sm"
                          />
                        </>
                      )}
                    </div>
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
                              defaultChecked={
                                localStorage.getItem(
                                  "siteProtectionEnabled"
                                ) !== "false"
                              }
                              onChange={(e) => {
                                localStorage.setItem(
                                  "siteProtectionEnabled",
                                  e.target.checked
                                );
                              }}
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
                            defaultValue={
                              localStorage.getItem("targetDate") || "2026-04-21"
                            }
                            onChange={(e) =>
                              localStorage.setItem("targetDate", e.target.value)
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
                                  defaultChecked={
                                    localStorage.getItem(
                                      `page_${page.key}_protected`
                                    ) !== "false"
                                  }
                                  onChange={(e) => {
                                    localStorage.setItem(
                                      `page_${page.key}_protected`,
                                      e.target.checked
                                    );
                                  }}
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
