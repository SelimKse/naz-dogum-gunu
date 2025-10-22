import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Modal from "../components/Modal";
import { upload } from "@vercel/blob/client";

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("adminAuthenticated") === "true";
  });

  // Path'e göre activeTab'ı belirle
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes("/timeline")) return "timeline";
    if (path.includes("/settings")) return "settings";
    return "assets";
  };

  const activeTab = getActiveTab();

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

  // Feedback state
  const [feedback, setFeedback] = useState([]);

  // Modal fonksiyonları
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

  // Giriş fonksiyonu
  const handleLogin = () => {
    if (password === "ohana") {
      setIsAuthenticated(true);
      localStorage.setItem("adminAuthenticated", "true");
      setPassword("");
    } else {
      showModal(
        "Hata",
        "Yanlış şifre! Stitch'in Hawaii'sine giremezsin! 😤",
        "error"
      );
    }
  };

  // Çıkış fonksiyonu
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminAuthenticated");
    setActiveTab("assets");
  };

  // Asset durumlarını kontrol et
  const checkAssetStatus = async () => {
    setIsCheckingAssets(true);
    try {
      const response = await fetch("/api/list-assets");
      if (response.ok) {
        const data = await response.json();
        const assets = data.assets || [];

        // Asset durumlarını güncelle
        const newStatus = { ...assetStatus };
        const newUrls = { ...assetUrls };

        assets.forEach((asset) => {
          if (newStatus.hasOwnProperty(asset.filename)) {
            newStatus[asset.filename] = true;
            newUrls[asset.filename] = asset.url;
          }
        });

        setAssetStatus(newStatus);
        setAssetUrls(newUrls);
      }
    } catch (error) {
      console.error("Asset durumu kontrol edilemedi:", error);
    } finally {
      setIsCheckingAssets(false);
    }
  };

  // Asset yükleme fonksiyonu
  const handleAssetUpload = async (filename, event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadProgress((prev) => ({ ...prev, [filename]: 0 }));

      const blob = await upload(filename, file, {
        access: "public",
        handleUploadUrl: "/api/upload-asset",
      });

      // Progress'i 100% yap
      setUploadProgress((prev) => ({ ...prev, [filename]: 100 }));

      // Asset durumunu güncelle
      setAssetStatus((prev) => ({ ...prev, [filename]: true }));
      setAssetUrls((prev) => ({ ...prev, [filename]: blob.url }));

      // Progress'i temizle
      setTimeout(() => {
        setUploadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[filename];
          return newProgress;
        });
      }, 1000);

      showModal("Başarılı", `${filename} başarıyla yüklendi! 🎉`, "success");
    } catch (error) {
      console.error("Upload hatası:", error);
      showModal("Hata", "Dosya yüklenirken hata oluştu! 😢", "error");

      // Progress'i temizle
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[filename];
        return newProgress;
      });
    }
  };

  // Asset silme fonksiyonu
  const handleAssetDelete = async (filename) => {
    showModal(
      "Dosyayı Sil",
      `${filename} dosyasını silmek istediğinizden emin misiniz?`,
      "warning",
      async () => {
        try {
          const response = await fetch("/api/delete-asset", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ filename }),
          });

          if (response.ok) {
            setAssetStatus((prev) => ({ ...prev, [filename]: false }));
            setAssetUrls((prev) => {
              const newUrls = { ...prev };
              delete newUrls[filename];
              return newUrls;
            });
            showModal(
              "Başarılı",
              `${filename} başarıyla silindi! 🗑️`,
              "success"
            );
          } else {
            throw new Error("Silme işlemi başarısız");
          }
        } catch (error) {
          console.error("Silme hatası:", error);
          showModal("Hata", "Dosya silinirken hata oluştu! 😢", "error");
        }
      }
    );
  };

  // Asset indirme fonksiyonu
  const handleAssetDownload = (filename) => {
    const url = assetUrls[filename];
    if (url) {
      window.open(url, "_blank");
    }
  };

  // Timeline olaylarını yükle
  const loadTimelineEvents = async () => {
    try {
      const response = await fetch("/api/timeline");
      if (response.ok) {
        const data = await response.json();
        setTimelineEvents(data.events || []);
      }
    } catch (error) {
      console.error("Timeline yüklenemedi:", error);
    }
  };

  // Timeline olayı ekle
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
      setTimelineEvents(updatedEvents);

      // Backend'e kaydet - TÜM olayları gönder
      try {
        const response = await fetch("/api/timeline", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ events: updatedEvents }),
        });

        if (response.ok) {
          showModal(
            "Başarılı",
            "Timeline olayı başarıyla eklendi! 🎉",
            "success"
          );
        } else {
          const errorData = await response.json();
          console.error("API Error:", errorData);
          showModal(
            "Hata",
            "Timeline olayı kaydedilemedi: " +
              (errorData.error || "Bilinmeyen hata"),
            "error"
          );
        }
      } catch (error) {
        console.error("Timeline olayı backend'e kaydedilemedi:", error);
        showModal("Hata", "Bağlantı hatası: " + error.message, "error");
      }

      // Formu temizle
      setNewEvent({ date: "", title: "", description: "", icon: "📅" });
    } else {
      showModal("Hata", "Lütfen tüm alanları doldurun! 📝", "error");
    }
  };

  // Timeline olayı sil
  const handleDeleteEvent = async (eventId) => {
    showModal(
      "Olayı Sil",
      "Bu timeline olayını silmek istediğinizden emin misiniz?",
      "warning",
      async () => {
        try {
          // Silindikten sonraki event listesi
          const updatedEvents = timelineEvents.filter(
            (event) => event.id !== eventId
          );

          // Backend'e güncellenen listeyi gönder
          const response = await fetch("/api/timeline", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ events: updatedEvents }),
          });

          if (response.ok) {
            setTimelineEvents(updatedEvents);
            showModal(
              "Başarılı",
              "Timeline olayı başarıyla silindi! 🗑️",
              "success"
            );
          } else {
            const errorData = await response.json();
            console.error("API Error:", errorData);
            showModal(
              "Hata",
              "Timeline olayı silinemedi: " +
                (errorData.error || "Bilinmeyen hata"),
              "error"
            );
          }
        } catch (error) {
          console.error("Timeline olayı silinemedi:", error);
          showModal("Hata", "Bağlantı hatası: " + error.message, "error");
        }
      }
    );
  };

  // Koruma ayarlarını yükle
  const loadProtectionSettings = async () => {
    try {
      const response = await fetch("/api/protection-settings");
      if (response.ok) {
        const settings = await response.json();
        setIsProtectionEnabled(settings.protectionEnabled);
        setTargetDate(settings.targetDate);
        setPageProtections(settings.pages || pageProtections);
      }
    } catch (error) {
      console.error("Koruma ayarları yükleme hatası:", error);
    }
  };

  // Koruma ayarlarını kaydet
  const saveProtectionSettings = async (settings) => {
    try {
      const response = await fetch("/api/protection-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        showModal(
          "Başarılı",
          "Koruma ayarları başarıyla kaydedildi! 🔒",
          "success"
        );
      } else {
        throw new Error("Ayarlar kaydedilemedi");
      }
    } catch (error) {
      console.error("Koruma ayarları kaydedilemedi:", error);
      showModal(
        "Hata",
        "Koruma ayarları kaydedilirken hata oluştu! 😢",
        "error"
      );
    }
  };

  // Koruma toggle fonksiyonu
  const handleProtectionToggle = (enabled) => {
    setIsProtectionEnabled(enabled);
    saveProtectionSettings({
      protectionEnabled: enabled,
      targetDate: targetDate,
      pages: pageProtections,
    });
  };

  // Hedef tarih değiştirme fonksiyonu
  const handleTargetDateChange = (date) => {
    setTargetDate(date);
    saveProtectionSettings({
      protectionEnabled: isProtectionEnabled,
      targetDate: date,
      pages: pageProtections,
    });
  };

  // Sayfa koruma toggle fonksiyonu
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

  // Feedback yükle
  const loadFeedback = async () => {
    try {
      const response = await fetch("/api/feedback");
      if (response.ok) {
        const data = await response.json();
        setFeedback(data.feedback || []);
      }
    } catch (error) {
      console.error("Feedback yüklenemedi:", error);
    }
  };

  // Feedback sil
  const handleDeleteFeedback = async (feedbackId) => {
    showModal(
      "Feedback Sil",
      "Bu feedback'i silmek istediğinizden emin misiniz?",
      "warning",
      async () => {
        try {
          const response = await fetch("/api/feedback", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: feedbackId }),
          });

          if (response.ok) {
            setFeedback((prev) => prev.filter((f) => f.id !== feedbackId));
            showModal("Başarılı", "Feedback başarıyla silindi! 🗑️", "success");
          } else {
            throw new Error("Silme işlemi başarısız");
          }
        } catch (error) {
          console.error("Feedback silinemedi:", error);
          showModal("Hata", "Feedback silinirken hata oluştu! 😢", "error");
        }
      }
    );
  };

  // Timeline JSON indir
  const handleDownloadTimeline = () => {
    const dataStr = JSON.stringify(timelineEvents, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = "timeline.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // Component mount olduğunda çalışacak
  useEffect(() => {
    if (isAuthenticated) {
      checkAssetStatus();
      loadTimelineEvents();
      loadProtectionSettings();
      loadFeedback();
    }
  }, [isAuthenticated]);

  // Asset durumlarını periyodik olarak kontrol et
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(checkAssetStatus, 30000); // 30 saniyede bir kontrol et
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Giriş yapılmamışsa giriş sayfasını göster
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
          <motion.div
            className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-purple-500/30"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">
                  Admin Girişi
                </h2>
                <p className="text-gray-400">
                  Yönetim paneline erişim için şifre gerekli
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Şifre
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şifrenizi giriniz..."
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  />
                </div>

                <motion.button
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Giriş Yap
                </motion.button>
              </div>
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <motion.div
          className="bg-gray-800 shadow-xl border-b border-gray-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">
                    Admin Panel
                  </h1>
                  <p className="text-sm text-gray-400">
                    Naz'ın Doğum Günü Yönetimi
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-400">Hoş geldin, Admin</div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Çıkış
                </button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex">
            <div className="w-64 bg-gray-900 border-r border-gray-700 min-h-screen">
              <nav className="p-4 space-y-2">
                <button
                  onClick={() => navigate("/admin")}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === "assets"
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Asset'ler
                </button>

                <button
                  onClick={() => navigate("/admin/timeline")}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === "timeline"
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Timeline
                </button>

                <button
                  onClick={() => navigate("/admin/settings")}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === "settings"
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Ayarlar
                </button>
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
              <div className="max-w-7xl mx-auto">
                {activeTab === "assets" && (
                  <div className="space-y-8">
                    {/* Dashboard Overview */}
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-white mb-6">
                        Dashboard
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-400">
                                Hazır Asset'ler
                              </p>
                              <p className="text-3xl font-bold text-green-500">
                                {
                                  Object.values(assetStatus).filter(Boolean)
                                    .length
                                }
                              </p>
                            </div>
                            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-6 h-6 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-400">
                                Eksik Asset'ler
                              </p>
                              <p className="text-3xl font-bold text-red-500">
                                {
                                  Object.values(assetStatus).filter((v) => !v)
                                    .length
                                }
                              </p>
                            </div>
                            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-6 h-6 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-400">
                                Toplam Asset
                              </p>
                              <p className="text-3xl font-bold text-white">6</p>
                            </div>
                            <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-6 h-6 text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-400">
                                Tamamlama
                              </p>
                              <p className="text-3xl font-bold text-purple-500">
                                {Math.round(
                                  (Object.values(assetStatus).filter(Boolean)
                                    .length /
                                    6) *
                                    100
                                )}
                                %
                              </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-6 h-6 text-purple-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Asset Management */}
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-6">
                          Ana Sayfa Fotoğrafları
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {["photo1.png", "photo2.png", "photo3.png"].map(
                            (filename, index) => (
                              <div
                                key={filename}
                                className={`bg-gray-800 rounded-xl border-2 p-6 transition-all ${
                                  assetStatus[filename]
                                    ? "border-green-500/50"
                                    : "border-red-500/50"
                                }`}
                              >
                                <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <h4 className="font-semibold text-white mb-1">
                                      Fotoğraf {index + 1}
                                    </h4>
                                    <p className="text-sm text-gray-400">
                                      {filename}
                                    </p>
                                  </div>
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                      assetStatus[filename]
                                        ? "bg-green-500/20"
                                        : "bg-red-500/20"
                                    }`}
                                  >
                                    {assetStatus[filename] ? (
                                      <svg
                                        className="w-5 h-5 text-green-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    ) : (
                                      <svg
                                        className="w-5 h-5 text-red-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                </div>

                                {assetStatus[filename] ? (
                                  <div className="space-y-3">
                                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg px-3 py-2 text-sm text-green-400">
                                      ✓ Dosya mevcut ve erişilebilir
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() =>
                                          handleAssetDownload(filename)
                                        }
                                        className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                                      >
                                        Görüntüle
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleAssetDelete(filename)
                                        }
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                                      >
                                        Sil
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg px-3 py-2 text-sm text-red-400">
                                      ✗ Dosya bulunamadı
                                    </div>
                                    {uploadProgress[filename] !== undefined ? (
                                      <div className="space-y-2">
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                          <motion.div
                                            className="bg-purple-600 h-2 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{
                                              width: `${uploadProgress[filename]}%`,
                                            }}
                                            transition={{ duration: 0.3 }}
                                          />
                                        </div>
                                        <p className="text-sm text-purple-400 text-center">
                                          Yükleniyor...{" "}
                                          {uploadProgress[filename]}%
                                        </p>
                                      </div>
                                    ) : (
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                          handleAssetUpload(filename, e)
                                        }
                                        className="w-full p-3 border-2 border-dashed border-gray-700 bg-gray-900 rounded-lg text-sm text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white file:cursor-pointer hover:file:bg-purple-700 transition-colors"
                                      />
                                    )}
                                  </div>
                                )}
                              </div>
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
                                  <p className="text-xs text-gray-400">
                                    {file}
                                  </p>
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
                                      onChange={(e) =>
                                        handleAssetUpload(file, e)
                                      }
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
                              {uploadProgress["nazin-kitabi.pdf"] !==
                              undefined ? (
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
                  </div>
                )}

                {activeTab === "timeline" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-white">
                        Timeline Yönetimi
                      </h2>
                      <button
                        onClick={handleDownloadTimeline}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <span>📥</span> JSON İndir
                      </button>
                    </div>

                    {/* Timeline Olay Ekleme Formu */}
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span>➕</span> Yeni Timeline Olayı Ekle
                      </h3>
                      <div className="space-y-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input
                            type="date"
                            value={newEvent.date}
                            onChange={(e) =>
                              setNewEvent((prev) => ({
                                ...prev,
                                date: e.target.value,
                              }))
                            }
                            className="p-3 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors [color-scheme:dark]"
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
                            className="p-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
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
                            className="p-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                          />
                        </div>
                        <textarea
                          placeholder="Açıklama"
                          value={newEvent.description}
                          onChange={(e) =>
                            setNewEvent((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          className="w-full p-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                          rows={4}
                        />
                      </div>
                      <button
                        onClick={addTimelineEvent}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors font-semibold"
                      >
                        Olay Ekle
                      </button>
                    </div>

                    {timelineEvents.length > 0 ? (
                      <div className="space-y-3">
                        {timelineEvents.map((event, index) => (
                          <motion.div
                            key={event.id}
                            className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg"
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div className="flex justify-between items-center mb-4">
                              <div className="flex items-center gap-3">
                                <span className="text-3xl">{event.icon}</span>
                                <h3 className="text-xl font-semibold text-white">
                                  {event.title}
                                </h3>
                                <span className="text-sm text-gray-400">
                                  📅 {event.date}
                                </span>
                              </div>
                              <button
                                onClick={() => handleDeleteEvent(event.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                              >
                                Sil
                              </button>
                            </div>
                            <p className="text-lg text-gray-300 leading-relaxed">
                              {event.description}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
                        <div className="text-6xl mb-4">📅</div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          Henüz timeline olayı yok
                        </h3>
                        <p className="text-gray-400">
                          Yukarıdaki formdan yeni olay ekleyebilirsiniz
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "settings" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">
                      Site Ayarları
                    </h2>

                    {/* Site Koruma Sistemi */}
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span>🛡️</span> Site Koruma Sistemi
                      </h3>

                      <div className="space-y-4">
                        {/* Ana Koruma Ayarı */}
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-semibold text-white">
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
                              <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-600 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
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
                              className="w-full p-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors [color-scheme:dark]"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Bu tarihten önce site erişime kapalı olacak
                            </p>
                          </div>
                        </div>

                        {/* Sayfa Bazlı Koruma */}
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <h4 className="font-semibold text-white mb-3">
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
                                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{page.icon}</span>
                                  <span className="font-medium text-white">
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
                                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-3">
                            💡 Yeşil: Erişime açık | Gri: Tarih koruması aktif
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Admin;
