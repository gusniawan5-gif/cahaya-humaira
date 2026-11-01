export type Platform = "instagram" | "youtube" | "both";

export type ScheduleStatus = "terjadwal" | "dipublikasikan" | "gagal" | "draf";

export interface ScheduledPost {
  id: string;
  title: string;
  caption: string;
  videoUrl?: string; // object URL or data
  videoFileName?: string;
  videoSizeMb?: number;
  videoDurationSeconds?: number;
  thumbnailDataUrl?: string;
  scheduledTime: string; // ISO string
  platforms: Platform;
  status: ScheduleStatus;
  createdAt: string;
  publishedAt?: string;
  errorLog?: string;
  youtubeId?: string;
  instagramMediaId?: string;
}

export interface ApiSettings {
  // Instagram Graph API
  instagramAccessToken: string;
  instagramBusinessId: string;
  facebookPageId: string;
  // YouTube Data API v3
  youtubeApiKey: string;
  youtubeClientId: string;
  youtubeClientSecret: string;
  youtubeRefreshToken: string;
  // Optional Gemini API for dynamic generation
  geminiApiKey?: string;
}

export interface DakwahTheme {
  id: string;
  name: string;
  emoji: string;
  description: string;
  dalil: {
    arabic: string;
    translation: string;
    source: string;
  };
  sampleCaption: string;
}

export interface PublishLog {
  step: number;
  title: string;
  status: "idle" | "loading" | "success" | "error";
  message: string;
  timestamp: string;
}
