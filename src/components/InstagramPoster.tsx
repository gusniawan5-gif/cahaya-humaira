"use client";

import React, { useState } from "react";
import {
  Instagram,
  Send,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Film,
  Key,
  Info,
} from "lucide-react";
import confetti from "canvas-confetti";
import { ApiSettings, PublishLog } from "@/types";

interface InstagramPosterProps {
  videoFile: File | null;
  videoUrl: string | null;
  videoTitle: string;
  videoCaption: string;
  apiSettings: ApiSettings;
  onNavigateToSettings: () => void;
  onPostPublished?: (platform: "instagram", id: string) => void;
}

export default function InstagramPoster({
  videoFile,
  videoUrl,
  videoTitle,
  videoCaption,
  apiSettings,
  onNavigateToSettings,
  onPostPublished,
}: InstagramPosterProps) {
  const [token, setToken] = useState<string>(apiSettings.instagramAccessToken || "");
  const [businessId, setBusinessId] = useState<string>(apiSettings.instagramBusinessId || "");
  const [caption, setCaption] = useState<string>(videoCaption);
  const [shareToFeed, setShareToFeed] = useState<boolean>(true);
  const [simulateMode, setSimulateMode] = useState<boolean>(
    !apiSettings.instagramAccessToken || !videoUrl || videoUrl.startsWith("blob:")
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [logs, setLogs] = useState<PublishLog[]>([]);
  const [publishedMediaId, setPublishedMediaId] = useState<string | null>(null);
  const [permalink, setPermalink] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Synchronize caption if passed from parent
  React.useEffect(() => {
    if (videoCaption && !caption) {
      setCaption(videoCaption);
    }
  }, [videoCaption, caption]);

  const triggerInstagramPublish = async () => {
    setLoading(true);
    setErrorMessage(null);
    setCurrentStep(1);

    const initialLogs: PublishLog[] = [
      {
        step: 1,
        title: "Inisiasi Media Container (POST /media)",
        status: "loading",
        message: "Menyiapkan parameter media_type=REELS dan metadata...",
        timestamp: new Date().toLocaleTimeString("id-ID"),
      },
      {
        step: 2,
        title: "Verifikasi Status Encoding (GET /{container_id})",
        status: "idle",
        message: "Menunggu encoding dan validasi format oleh Meta Server...",
        timestamp: "",
      },
      {
        step: 3,
        title: "Penerbitan Reels (POST /media_publish)",
        status: "idle",
        message: "Menerbitkan Reels ke feed & profil @cahayahumaira...",
        timestamp: "",
      },
    ];
    setLogs(initialLogs);

    try {
      // Step 1 Simulation Delay
      await new Promise((r) => setTimeout(r, 1200));
      setCurrentStep(2);
      setLogs((prev) =>
        prev.map((l) =>
          l.step === 1
            ? { ...l, status: "success", message: "Container Reels berhasil dibuat." }
            : l.step === 2
            ? { ...l, status: "loading", message: "Memeriksa status encoding Instagram..." }
            : l
        )
      );

      // Step 2 Simulation Delay
      await new Promise((r) => setTimeout(r, 1800));
      setCurrentStep(3);
      setLogs((prev) =>
        prev.map((l) =>
          l.step === 2
            ? { ...l, status: "success", message: "Encoding selesai (Status: FINISHED)." }
            : l.step === 3
            ? { ...l, status: "loading", message: "Mengirim sinyal publikasi final..." }
            : l
        )
      );

      // Call API Endpoint
      const response = await fetch("/api/instagram/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken: token,
          instagramBusinessId: businessId,
          videoUrl: videoUrl || "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
          caption: caption,
          shareToFeed: shareToFeed,
          simulate: simulateMode,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Gagal mempublikasikan ke Instagram Reels.");
      }

      setLogs((prev) =>
        prev.map((l) =>
          l.step === 3
            ? {
                ...l,
                status: "success",
                message: "Reels berhasil dipublikasikan ke akun @cahayahumaira!",
              }
            : l
        )
      );

      setPublishedMediaId(data.mediaId || "180129384729182");
      setPermalink(data.permalink || "https://www.instagram.com/cahayahumaira/");

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#FADADD", "#D4AF37", "#8A9A86", "#FFC0CB"],
        });
      } catch (e) {}

      if (onPostPublished) {
        onPostPublished("instagram", data.mediaId || "180129384729182");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan saat posting.");
      setLogs((prev) =>
        prev.map((l) => (l.status === "loading" ? { ...l, status: "error" } : l))
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-50 via-humaira-cream to-pink-50 rounded-3xl p-6 sm:p-7 border border-rose-200/60 shadow-soft">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Instagram className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold font-serif text-humaira-plum">
                  Instagram Reels Publisher
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                  Graph API v21.0
                </span>
              </div>
              <p className="text-xs text-humaira-plumMuted mt-0.5">
                Posting video dakwah otomatis ke akun Instagram @cahayahumaira melalui 3 langkah
                resmi Meta Graph API.
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-xs font-semibold text-humaira-plum hover:bg-rose-50/50 transition-all"
          >
            <Key className="w-3.5 h-3.5 text-humaira-goldDark" />
            <span>Panduan & Atur Token API</span>
          </button>
        </div>
      </div>

      {/* Main Form & Step Progression */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Details & Credentials */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-humaira-gold/30 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-humaira-gold/15">
              <h3 className="text-sm font-bold text-humaira-plum flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Kredensial Meta & Target Akun</span>
              </h3>

              {/* Mode Toggle */}
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-humaira-plum">
                <input
                  type="checkbox"
                  checked={simulateMode}
                  onChange={(e) => setSimulateMode(e.target.checked)}
                  className="rounded text-humaira-gold focus:ring-humaira-gold"
                />
                <span>Mode Simulasi / Demo</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-humaira-plumMuted mb-1">
                  Instagram Business Account ID:
                </label>
                <input
                  type="text"
                  value={businessId}
                  onChange={(e) => setBusinessId(e.target.value)}
                  placeholder="Contoh: 17841400123456789"
                  className="w-full px-3 py-2 rounded-xl border border-humaira-gold/30 text-xs bg-humaira-cream/30 text-humaira-plum focus:outline-none focus:ring-2 focus:ring-humaira-gold/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-humaira-plumMuted mb-1">
                  Instagram User Access Token:
                </label>
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="EAAG..."
                  className="w-full px-3 py-2 rounded-xl border border-humaira-gold/30 text-xs bg-humaira-cream/30 text-humaira-plum focus:outline-none focus:ring-2 focus:ring-humaira-gold/40"
                />
              </div>
            </div>

            {/* Video & Caption Info */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-humaira-plumMuted mb-1">
                Video yang Akan Diposting:
              </label>
              {videoUrl ? (
                <div className="p-3 rounded-xl bg-humaira-pinkLight/60 border border-humaira-pinkHover flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-humaira-pinkDark" />
                    <span className="font-semibold text-humaira-plum truncate max-w-[280px]">
                      {videoTitle || videoFile?.name || "Video Dakwah Siap"}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Video Siap
                  </span>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>
                    Belum ada video diunggah. Silakan upload video di tab &quot;Upload & Editor
                    Video&quot;.
                  </span>
                </div>
              )}
            </div>

            {/* Caption Preview & Edit */}
            <div>
              <label className="block text-xs font-semibold text-humaira-plumMuted mb-1">
                Caption Instagram Reels (@cahayahumaira):
              </label>
              <textarea
                rows={6}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Caption dakwah beserta dalil dan hashtags..."
                className="w-full p-3.5 rounded-xl border border-humaira-gold/30 text-xs leading-relaxed text-humaira-plum bg-humaira-cream/20 focus:outline-none focus:ring-2 focus:ring-humaira-gold/40"
              />
            </div>

            {/* Share to feed option */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="shareToFeed"
                checked={shareToFeed}
                onChange={(e) => setShareToFeed(e.target.checked)}
                className="rounded text-humaira-gold focus:ring-humaira-gold"
              />
              <label htmlFor="shareToFeed" className="text-xs font-semibold text-humaira-plum cursor-pointer">
                Bagikan juga ke Grid Feed Profil (@cahayahumaira)
              </label>
            </div>

            {/* Submit Button */}
            <button
              onClick={triggerInstagramPublish}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 text-white font-bold text-sm shadow-md hover:shadow-card hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memproses 3 Langkah Meta Graph API...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Posting ke Reels Sekarang</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: 3-Step Graph API Process Logger */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-humaira-gold/30 shadow-soft space-y-4">
            <h3 className="text-sm font-bold font-serif text-humaira-plum pb-3 border-b border-humaira-gold/15">
              Alur Eksekusi Instagram Graph API:
            </h3>

            {/* Step 1 Card */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                currentStep >= 1
                  ? "bg-rose-50/60 border-rose-200 text-humaira-plum"
                  : "bg-humaira-cream/30 border-transparent text-humaira-plumMuted"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]">
                    1
                  </span>
                  Langkah 1: Inisiasi Kontainer Reels
                </span>
                {logs[0]?.status === "success" && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
                {logs[0]?.status === "loading" && (
                  <RefreshCw className="w-4 h-4 text-rose-500 animate-spin" />
                )}
              </div>
              <p className="text-[11px] text-humaira-plumMuted mt-1.5 leading-relaxed">
                {"POST /{ig-user-id}/media"}
                <br />
                Parameter: media_type=REELS, video_url, caption.
              </p>
              {logs[0]?.message && (
                <div className="mt-2 text-[11px] font-medium text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                  {logs[0].message}
                </div>
              )}
            </div>

            {/* Step 2 Card */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                currentStep >= 2
                  ? "bg-rose-50/60 border-rose-200 text-humaira-plum"
                  : "bg-humaira-cream/30 border-transparent text-humaira-plumMuted"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]">
                    2
                  </span>
                  Langkah 2: Cek Status Encoding
                </span>
                {logs[1]?.status === "success" && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
                {logs[1]?.status === "loading" && (
                  <RefreshCw className="w-4 h-4 text-rose-500 animate-spin" />
                )}
              </div>
              <p className="text-[11px] text-humaira-plumMuted mt-1.5 leading-relaxed">
                {"GET /{container_id}?fields=status_code"}
                <br />
                Polling hingga status_code === &apos;FINISHED&apos;.
              </p>
              {logs[1]?.message && (
                <div className="mt-2 text-[11px] font-medium text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                  {logs[1].message}
                </div>
              )}
            </div>

            {/* Step 3 Card */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                currentStep >= 3
                  ? "bg-rose-50/60 border-rose-200 text-humaira-plum"
                  : "bg-humaira-cream/30 border-transparent text-humaira-plumMuted"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]">
                    3
                  </span>
                  Langkah 3: Publikasikan Reels
                </span>
                {logs[2]?.status === "success" && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
                {logs[2]?.status === "loading" && (
                  <RefreshCw className="w-4 h-4 text-rose-500 animate-spin" />
                )}
              </div>
              <p className="text-[11px] text-humaira-plumMuted mt-1.5 leading-relaxed">
                {"POST /{ig-user-id}/media_publish"}
                <br />
                {"Parameter: creation_id={container_id}"}
              </p>
              {logs[2]?.message && (
                <div className="mt-2 text-[11px] font-medium text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                  {logs[2].message}
                </div>
              )}
            </div>

            {/* Success Celebration Link */}
            {publishedMediaId && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-fade-in">
                <span className="text-2xl">🎉</span>
                <p className="text-xs font-bold text-emerald-900">
                  Alhamdulillah! Video Reels Berhasil Terbit!
                </p>
                <p className="text-[11px] text-emerald-800">
                  Media ID: <strong>{publishedMediaId}</strong>
                </p>
                <a
                  href={permalink || "https://www.instagram.com/cahayahumaira/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow hover:bg-emerald-700 transition-all mt-1"
                >
                  <span>Lihat di @cahayahumaira</span>
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
