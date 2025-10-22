import { useState, useEffect } from 'react';

export const useAssets = () => {
  const [assetStatus, setAssetStatus] = useState({
    "photo1.png": false,
    "photo2.png": false,
    "photo3.png": false,
    "intro.mp4": false,
    "video.mp4": false,
    "nazin-kitabi.pdf": false,
  });
  const [assetUrls, setAssetUrls] = useState({});
  const [isCheckingAssets, setIsCheckingAssets] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAssets = async () => {
      setIsCheckingAssets(true);
      setError(null);

      try {
        // Vercel Blob'dan asset listesini al
        const response = await fetch("/api/list-assets");

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Asset listesi alınamadı`);
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
          });

          setAssetStatus(newStatus);
          setAssetUrls(data.assets); // URL'leri kaydet
        } else {
          throw new Error(data.error || "Asset listesi alınamadı");
        }
      } catch (error) {
        console.error("Asset kontrol hatası:", error);
        setError(error.message);
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

    checkAssets();
    // Her 10 saniyede bir kontrol et
    const interval = setInterval(checkAssets, 10000);
    return () => clearInterval(interval);
  }, []);

  const updateAssetStatus = (filename, exists, url = null) => {
    setAssetStatus(prev => ({ ...prev, [filename]: exists }));
    if (url) {
      setAssetUrls(prev => ({ ...prev, [filename]: url }));
    }
  };

  return {
    assetStatus,
    assetUrls,
    isCheckingAssets,
    error,
    updateAssetStatus,
  };
};
