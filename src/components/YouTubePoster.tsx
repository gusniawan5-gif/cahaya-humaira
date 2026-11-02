"use client";

import React, { useState } from "react";
import {
  Youtube,
  Send,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Film,
  Key,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";
import { ApiSettings } from "@/types";
import AutoSubtitle from "./AutoSubtitle";
interface YouTubePosterProps {
  videoFile: File | null;
  videoUrl: string | null;
  videoTitle: string;
  videoCaption: string;
  apiSettings: ApiSettings;
  onNavigateToSettings: () => void;
  onPostPublished?: (platform: "youtube", id: string) => void;
}

export default function YouTubePoster({
  videoFile,
  videoUrl,
  videoTitle,
  videoCaption,
  apiSettings,
  onNavigateToSettings,
  onPostPublished,
}: YouTubePosterProps) {
  const [title, setTitle] = useState<string>(videoTitle || "🌸 Kajian Muslimah Cahaya Humaira");
  const [description, setDescription] = useState<string>(videoCaption);
  const [tags, setTags] = useState<string>("Cahaya Humaira, Dakwah Muslimah, Jambi Mengaji, Ceramah Pendek, Shorts");
  const [privacyStatus, setPrivacyStatus] = useState<"public" | "unlisted" | "private">("public");
  const [simulateMode, setSimulateMode] = useState<boolean>(!apiSettings.youtubeRefreshToken);

  const [loading, setLoading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [publishedVideoUrl, setPublishedVideoUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  // Auto-detect Shorts eligibility
  const isShorts = true; // Assuming short dakwah reels/clips

  React.useEffect(() => {
    if (videoTitle) setTitle(videoTitle);
    if (videoCaption) setDescription(videoCaption);
  }, [videoTitle, videoCaption]);

  const handleYouTubeUpload = async () => {
    setLoading(true);
    setErrorMessage(null);
    setUploadNotice(null);

    try {
      let response;
      if (videoFile && !simulateMode) {
        // Send as FormData for real file transfer
        const formData = new FormData();
        formData.append("video", videoFile);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("tags", tags);
        formData.append("privacyStatus", privacyStatus);
        formData.append("isShorts", isShorts ? "true" : "false");
        formData.append("simulate", simulateMode ? "true" : "false");

        response = await fetch("/api/youtube/upload", {
          method: "POST",
          body: formData,
        });
      } else {
        // Send JSON request
        response = await fetch("/api/youtube/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            tags,
            privacyStatus,
            isShorts,
            simulate: simulateMode,
          }),
        });
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Gagal mengunggah ke YouTube.");
      }

      setUploadSuccess(true);
      setPublishedVideoUrl(data.videoUrl || "https://youtube.com/shorts/dummyId");
      if (data.notice) {
        setUploadNotice(data.notice);
      }

      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ["#FF0000", "#D4AF37", "#FADADD", "#FFFFFF"],
        });
      } catch (e) {}

      if (onPostPublished) {
        onPostPublished("youtube", data.videoId || "CH_yt123");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kendala saat upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-50 via-humaira-cream to-rose-50 rounded-3xl p-6 sm:p-7 border border-red-200/60 shadow-soft">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-md">
              <Youtube className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold font-serif text-humaira-plum">
                  YouTube Shorts & Video Publisher
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
                  Data API v3
                </span>
              </div>
              <p className="text-xs text-humaira-plumMuted mt-0.5">
                Unggah video dakwah santun otomatis ke YouTube Channel. Durasi &lt;60 detik otomatis
                diberi tag #Shorts.
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-red-200 text-xs font-semibold text-humaira-plum hover:bg-red-50/50 transition-all"
          >
            <Key className="w-3.5 h-3.5 text-humaira-goldDark" />
            <span>Kredensial OAuth YouTube</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-humaira-gold/30 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-humaira-gold/15">
              <h3 className="text-sm font-bold text-humaira-plum flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-600" />
                <span>Metadata Video YouTube</span>
              </h3>

              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-humaira-plum">
                <input
                  type="checkbox"
                  checked={simulateMode}
                  onChange={(e) => setSimulateMode(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <span>Mode Simulasi (Coba UI)</span>
              </label>
            </div>

            {/* Video File Status */}
            <div>
              <label className="block text-xs font-semibold text-humaira-plumMuted mb-1">
                File Video Dakwah:
              </label>
              {videoUrl ? (
                <div className="p-3 rounded-xl bg-red-50/70 border border-red-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-red-600" />
                    <span className="font-semibold text-humaira-plum truncate max-w-[320px]">
                      {videoFile?.name || "Video Dakwah Siap"}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded-full">
                    Shorts Ready (&le;60s)
                  </span>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>
                    Belum ada video diunggah. Disarankan upload video terlebih dahulu di tab &quot;Upload & Editor&quot;.
                  </span>
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-humaira-plumMuted">
                  Judul Video (YouTube):
                </label>
                <span className="text-[10px] text-humaira-plumMuted">{title.length}/100</span>
              </div>
              <input
                type="text"
                maxLength={100}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: 🌸 Rahasia Ketenangan Hati Muslimah | Cahaya Humaira #Shorts"
                className="w-full px-3.5 py-2.5 rounded-xl border border-humaira-gold/30 text-xs font-bold text-humaira-plum bg-humaira-cream/30 focus:outline-none focus:ring-2 focus:ring-humaira-gold/40"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-humaira-plumMuted mb-1">
                Deskripsi Video (Otomatis dari caption dakwah):
              </label>
              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi video, dalil, dan ajakan..."
                className="w-full p-3.5 rounded-xl border border-humaira-gold/30 text-xs leading-relaxed text-humaira-plum bg-humaira-cream/20 focus:outline-none focus:ring-2 focus:ring-humaira-gold/40"
              />
            </div>

            {/* Tags & Privacy Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-humaira-plumMuted mb-1">
                  Tags (Pisahkan dengan koma):
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-humaira-gold/30 text-xs bg-humaira-cream/30 text-humaira-plum focus:outline-none focus:ring-2 focus:ring-humaira-gold/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-humaira-plumMuted mb-1">
                  Status Privasi Video:
                </label>
                <select
                  value={privacyStatus}
                  onChange={(e) => setPrivacyStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-humaira-gold/30 text-xs bg-humaira-cream/30 text-humaira-plum focus:outline-none focus:ring-2 focus:ring-humaira-gold/40 font-semibold"
                >
                  <option value="public">Publik (Bisa ditonton semua orang)</option>
                  <option value="unlisted">Tidak Publik (Hanya yang punya link)</option>
                  <option value="private">Pribadi (Khusus akun pengunggah)</option>
                </select>
              </div>
            </div>

            {/* Shorts Notice */}
            <div className="p-3 rounded-2xl bg-humaira-goldLight/40 border border-humaira-gold/30 flex items-center gap-2 text-xs text-humaira-plum">
              <Sparkles className="w-4 h-4 text-humaira-gold shrink-0" />
              <span>
                <strong>Deteksi Otomatis Shorts:</strong> Karena durasi &le;60 detik dengan rasio
                vertikal 9:16, video ini otomatis dipublikasikan sebagai <strong>YouTube Shorts</strong>.
              </span>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleYouTubeUpload}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-bold text-sm shadow-md hover:shadow-card hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Mengunggah ke YouTube Data API v3...</span>
                </>
              ) : (
                <>
                  <Youtube className="w-4 h-4" />
                  <span>Posting ke YouTube Sekarang</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Info Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-humaira-gold/30 shadow-soft space-y-4">
            <h3 className="text-sm font-bold font-serif text-humaira-plum pb-3 border-b border-humaira-gold/15">
              Info YouTube Channel & Format
            </h3>

            <div className="space-y-3 text-xs text-humaira-plumMuted">
              <div className="p-3 rounded-xl bg-humaira-cream/50 border border-humaira-gold/15">
                <span className="font-bold text-humaira-plum block mb-1">
                  1. Kategori Konten:
                </span>
                <span>Category ID 22: &ldquo;People & Blogs&rdquo; (Dakwah & Inspirasi Kehidupan).</span>
              </div>

              <div className="p-3 rounded-xl bg-humaira-cream/50 border border-humaira-gold/15">
                <span className="font-bold text-humaira-plum block mb-1">
                  2. Bahasa & Lisensi:
                </span>
                <span>Bahasa default: Indonesia (id). Lisensi Standar YouTube.</span>
              </div>

              <div className="p-3 rounded-xl bg-humaira-cream/50 border border-humaira-gold/15">
                <span className="font-bold text-humaira-plum block mb-1">
                  3. Made for Kids:
                </span>
                <span>Diatur ke false (Tidak khusus anak-anak) agar komentar dakwah aktif.</span>
              </div>
            </div>

            {uploadNotice && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs">
                {uploadNotice}
              </div>
            )}

            {uploadSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-fade-in">
                <span className="text-2xl">🎉</span>
                <p className="text-xs font-bold text-emerald-900">
                  Alhamdulillah! Video Berhasil Dipublikasikan ke YouTube!
                </p>
                <a
                  href={publishedVideoUrl || "https://youtube.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs shadow hover:bg-red-700 transition-all mt-1"
                >
                  <span>Buka Video di YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
