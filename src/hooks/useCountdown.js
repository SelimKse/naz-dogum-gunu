import { useState, useEffect } from "react";

export const useCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const fetchTargetDate = async () => {
      try {
        const response = await fetch("/api/protection-settings");
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Ayarlar yüklenemedi`);
        }

        const settings = await response.json();
        return new Date(settings.targetDate);
      } catch (error) {
        console.error("Hedef tarih alınamadı:", error);
        return new Date("2026-04-21"); // Fallback
      }
    };

    const calculateTimeLeft = async () => {
      const targetDate = await fetchTargetDate();

      const updateCountdown = () => {
        const now = new Date();
        const difference = targetDate - now;

        if (difference > 0) {
          // Tam ay hesaplama
          let months = 0;
          let tempDate = new Date(now);
          while (tempDate < targetDate) {
            tempDate.setMonth(tempDate.getMonth() + 1);
            if (tempDate <= targetDate) months++;
            else break;
          }
          tempDate.setMonth(tempDate.getMonth() - 1);

          // Kalan günler
          const remainingMs = targetDate - tempDate;
          const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (remainingMs % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

          setTimeLeft({ months, days, hours, minutes, seconds });
        }
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    };

    calculateTimeLeft();
  }, []);

  return timeLeft;
};
