import { useState, useEffect } from 'react';

export const useTimeline = () => {
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTimeline = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch("/api/timeline");
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Timeline yüklenemedi`);
        }

        const data = await response.json();
        setTimelineEvents(data.events || []);
      } catch (err) {
        console.error("Timeline yükleme hatası:", err);
        setError(err.message);
        setTimelineEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTimeline();
  }, []);

  const addEvent = async (newEvent) => {
    try {
      const event = {
        id: timelineEvents.length > 0
          ? Math.max(...timelineEvents.map((e) => e.id)) + 1
          : 1,
        ...newEvent,
      };

      const updatedEvents = [...timelineEvents, event];

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
        return { success: true };
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Timeline ekleme hatası:", error);
      return { success: false, error: error.message };
    }
  };

  const removeEvent = async (id) => {
    try {
      const updatedEvents = timelineEvents.filter((event) => event.id !== id);

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
        return { success: true };
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Timeline silme hatası:", error);
      return { success: false, error: error.message };
    }
  };

  return {
    timelineEvents,
    isLoading,
    error,
    addEvent,
    removeEvent,
  };
};
