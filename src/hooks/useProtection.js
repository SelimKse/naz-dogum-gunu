import { useState, useEffect } from 'react';

export const useProtection = (pageName) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkProtection = async () => {
      try {
        // MongoDB'den ayarları çek
        const response = await fetch("/api/protection-settings");

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Ayarlar yüklenemedi`);
        }

        // Response'un JSON olup olmadığını kontrol et
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("API response JSON değil");
        }

        const settings = await response.json();

        // Koruma kapalıysa veya sayfa korumasız ise kontrol yapma
        if (!settings.protectionEnabled || !settings.pages[pageName]) {
          setIsBlocked(false);
          setIsLoading(false);
          return;
        }

        const currentDate = new Date();
        const targetDate = new Date(settings.targetDate);

        // Bugünün tarihi hedef tarihten önceyse engelle
        if (currentDate < targetDate) {
          setIsBlocked(true);
        } else {
          setIsBlocked(false);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Koruma ayarları yükleme hatası:", error);
        // Hata durumunda default olarak erişime izin ver
        setIsBlocked(false);
        setIsLoading(false);
      }
    };

    checkProtection();
  }, [pageName]);

  return { isBlocked, isLoading };
};
