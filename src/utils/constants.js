/**
 * @fileoverview Application constants and configuration
 */

/**
 * Application configuration constants
 */
export const APP_CONFIG = {
  // Default target date for countdown
  DEFAULT_TARGET_DATE: "2026-04-21",
  
  // Special date for video switching
  SPECIAL_DATE: "2026-04-26",
  
  // Admin password
  ADMIN_PASSWORD: "naz2025",
  
  // Asset file names
  ASSET_FILES: [
    "photo1.png",
    "photo2.png", 
    "photo3.png",
    "intro.mp4",
    "video.mp4",
    "nazin-kitabi.pdf"
  ],
  
  // Page names for protection system
  PAGE_NAMES: {
    HOME: "home",
    TIMELINE: "timeline", 
    ANSIKLOPEDI: "ansiklopedi",
    HAYALLER: "hayaller",
    SURPRIZ: "surpriz",
    HEDIYEN: "hediyen"
  },
  
  // Navigation steps
  NAVIGATION_STEPS: [
    { path: "/", name: "Ana Sayfa", icon: "🏠" },
    { path: "/timeline", name: "Hikayemiz", icon: "📅" },
    { path: "/ansiklopedi", name: "Ansiklopedi", icon: "📖" },
    { path: "/hayaller", name: "Hayaller", icon: "✨" },
    { path: "/surpriz", name: "Sürpriz", icon: "🎁" },
    { path: "/hediyen", name: "Hediye", icon: "💝" },
  ],
  
  // Animation durations
  ANIMATION_DURATIONS: {
    FAST: 0.3,
    NORMAL: 0.5,
    SLOW: 1.0,
    VERY_SLOW: 2.0
  },
  
  // Color themes
  COLOR_THEMES: {
    PURPLE: "purple",
    BLUE: "blue", 
    PINK: "pink",
    CYAN: "cyan",
    GREEN: "green",
    RED: "red"
  },
  
  // Component sizes
  COMPONENT_SIZES: {
    SMALL: "small",
    MEDIUM: "medium",
    LARGE: "large", 
    XLARGE: "xlarge"
  }
};

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  PROTECTION_SETTINGS: "/api/protection-settings",
  TIMELINE: "/api/timeline",
  LIST_ASSETS: "/api/list-assets",
  UPLOAD_CHUNK: "/api/upload-chunk",
  DELETE_ASSET: "/api/delete-asset",
  FEEDBACK: "/api/feedback"
};

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  SETTINGS_LOAD_FAILED: "Ayarlar yüklenemedi",
  TIMELINE_LOAD_FAILED: "Timeline yüklenemedi",
  ASSET_LIST_FAILED: "Asset listesi alınamadı",
  UPLOAD_FAILED: "Dosya yüklenemedi",
  DELETE_FAILED: "Dosya silinemedi",
  FEEDBACK_SAVE_FAILED: "Feedback kaydedilemedi"
};

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  SETTINGS_SAVED: "Ayarlar başarıyla kaydedildi",
  TIMELINE_UPDATED: "Timeline başarıyla güncellendi",
  ASSET_UPLOADED: "Dosya başarıyla yüklendi",
  ASSET_DELETED: "Dosya başarıyla silindi",
  FEEDBACK_SAVED: "Feedback başarıyla kaydedildi"
};
