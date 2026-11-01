"use client";

import React, { useState } from "react";
import {
  CalendarDays,
  Clock,
  Instagram,
  Youtube,
  Trash2,
  Send,
  Plus,
  CheckCircle2,
  Calendar,
  Sparkles,
  Share2,
} from "lucide-react";
import { ScheduledPost, Platform } from "@/types";
import { formatWIB, formatDateWIB } from "@/lib/utils";

interface SchedulerTabProps {
  scheduledPosts: ScheduledPost[];
  videoTitle: string;
  videoCaption: string;
  videoUrl: string | null;
  videoFile: File | null;
  onAddSchedule: (post: Omit<ScheduledPost, "id" | "createdAt">) => void;
  onDeleteSchedule: (id: string) => void;
  onTriggerPublishNow: (post: ScheduledPost) => void;
}

export default function SchedulerTab({
  scheduledPosts,
  videoTitle,
  videoCaption,
  videoUrl,
  videoFile,
  onAddSchedule,
  onDeleteSchedule,
  onTriggerPublishNow,
}: SchedulerTabProps) {
  // Default to tomorrow 05:30 WIB
  const getDefaultSubuhTime = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    // Format YYYY-MM-DDTHH:mm
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const day = String(tomorrow.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}T05:30`;
  };

  const [scheduleDateTime, setScheduleDateTime] = useState<string>(getDefaultSubuhTime());
  const [platform, setPlatform] = useState<Platform>("both");
  const [customTitle, setCustomTitle] = useState<string>(videoTitle || "🌸 Kajian Subuh Muslimah Jambi");
  const [customCaption, setCustomCaption] = useState<string>(videoCaption);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  React.useEffect(() => {
    if (videoTitle) setCustomTitle(videoTitle);
    if (videoCaption) setCustomCaption(videoCaption);
  }, [videoTitle, videoCaption]);

  const handleCreateSchedule = () => {
    if (!customTitle) return;

    onAddSchedule({
      title: customTitle,
      caption: customCaption || "Renungan dakwah Cahaya Humaira...",
      videoUrl: videoUrl || undefined,
      videoFileName: videoFile?.name,
      videoSizeMb: videoFile ? videoFile.size / (1024 * 1024) : undefined,
      scheduledTime: new Date(scheduleDateTime).toISOString(),
      platforms: platform,
      status: "terjadwal",
    });

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  // Quick preset: Subuh (05:30), Ashar (15:45), Isya (20:00)
  const setQuickTime = (hour: number, minute: number, dayOffset = 1) => {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    d.setHours(hour, minute, 0, 0);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const h = String(hour).padStart(2, "0");
    const m = String(minute).padStart(2, "0");
    setScheduleDateTime(`${year}-${month}-${day}T${h}:${m}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-humaira-pinkLight via-humaira-cream to-humaira-sageLight rounded-3xl p-6 sm:p-7 border border-humaira-gold/30 shadow-soft">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-humaira-gold/30 text-xs font-semibold text-humaira-goldDark mb-2">
              <CalendarDays className="w-3.5 h-3.5 text-humaira-gold" />
              <span>Otomatisasi Penjadwalan Konten</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-humaira-plum">
              Jadwal Otomatis Subuh Berkah (05:30 WIB)
            </h2>
            <p className="text-xs sm:text-sm text-humaira-plumMuted mt-1 max-w-2xl leading-relaxed">
              Atur waktu tayang terbaik saat jama&apos;ah muslimah memulai hari. Video akan
              terposting serentak ke Instagram Reels dan YouTube Shorts.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Add to Schedule */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-humaira-gold/30 shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-humaira-plum flex items-center gap-2 pb-3 border-b border-humaira-gold/15">
              <Clock className="w-4 h-4 text-humaira-goldDark" />
              <span>Form Jadwalkan Video Baru</span>
            </h3>

            {/* Quick Presets for Islamic Golden Hours */}
            <div>
              <label className="block text-xs font-semibold text-humaira-plumMuted mb-1.5">
                Pilihan Waktu Emas Dakwah:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setQuickTime(5, 30, 1)}
                  className="p-2 rounded-xl border border-humaira-gold/30 bg-humaira-goldLight/40 hover:bg-humaira-goldLight text-xs font-bold text-humaira-goldDark text-center transition-all cursor-pointer"
                >
                  <span className="block text-sm">🌅 Subuh</span>
                  <span className="text-[10px]">05:30 WIB</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuickTime(15, 45, 1)}
                  className="p-2 rounded-xl border border-humaira-pinkHover bg-humaira-pinkLight/50 hover:bg-humaira-pinkLight text-xs font-bold text-humaira-pinkDark text-center transition-all cursor-pointer"
                >
                  <span className="block text-sm">☀️ Ashar</span>
                  <span className="text-[10px]">15:45 WIB</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuickTime(20, 0, 1)}
                  className="p-2 rounded-xl border border-humaira-sage/30 bg-humaira-sageLight/50 hover:bg-humaira-sageLight text-xs font-bold text-humaira-sageDark text-center transition-all cursor-pointer"
                >
                  <span className="block text-sm">🌙 Isya</span>
                  <span className="text-[10px]">20:00 WIB</span>
                </button>
              </div>
            </div>

            {/* DateTime Input */}
            <div>
              <label className="block text-xs font-semibold text-humaira-plumMuted mb-1">
                Pilih Tanggal & Waktu Tayang (WIB):
              </label>
              <input
                type="datetime-local"
                value={scheduleDateTime}
                onChange={(e) => setScheduleDateTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-humaira-gold/30 bg-humaira-cream/30 text-xs font-bold text-humaira-plum focus:outline-none focus:ring-2 focus:ring-humaira-gold/40"
              />
            </div>

            {/* Target Platform Selection */}
            <div>
              <label className="block text-xs font-semibold text-humaira-plumMuted mb-1.5">
                Kanal Tujuan Publikasi:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPlatform("both")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                    platform === "both"
                      ? "bg-humaira-gold text-white border-humaira-gold shadow-sm"
                      : "bg-humaira-cream/40 border-humaira-gold/20 text-humaira-plum"
                  }`}
                >
                  Keduanya (IG & YT)
                </button>
                <button
                  type="button"
                  onClick={() => setPlatform("instagram")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center flex items-center justify-center gap-1 ${
                    platform === "instagram"
                      ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                      : "bg-humaira-cream/40 border-humaira-gold/20 text-humaira-plum"
                  }`}
                >
                  <Instagram className="w-3.5 h-3.5" /> IG Reels
                </button>
                <button
                  type="button"
                  onClick={() => setPlatform("youtube")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center flex items-center justify-center gap-1 ${
                    platform === "youtube"
                      ? "bg-red-600 text-white border-red-600 shadow-sm"
                      : "bg-humaira-cream/40 border-humaira-gold/20 text-humaira-plum"
                  }`}
                >
                  <Youtube className="w-3.5 h-3.5" /> YouTube
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-humaira-plumMuted mb-1">
                Judul Video:
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Judul video dakwah..."
                className="w-full px-3.5 py-2 rounded-xl border border-humaira-gold/30 bg-humaira-cream/30 text-xs text-humaira-plum focus:outline-none focus:ring-2 focus:ring-humaira-gold/40"
              />
            </div>

            {/* Caption */}
            <div>
              <label className="block text-xs font-semibold text-humaira-plumMuted mb-1">
                Caption Ringkas:
              </label>
              <textarea
                rows={3}
                value={customCaption}
                onChange={(e) => setCustomCaption(e.target.value)}
                placeholder="Caption dakwah..."
                className="w-full p-2.5 rounded-xl border border-humaira-gold/30 bg-humaira-cream/30 text-xs text-humaira-plum focus:outline-none focus:ring-2 focus:ring-humaira-gold/40"
              />
            </div>

            <button
              onClick={handleCreateSchedule}
              className="w-full py-3 rounded-2xl bg-humaira-gold text-white font-bold text-xs shadow-md hover:bg-humaira-goldDark transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Jadwalkan ke IG & YouTube</span>
            </button>

            {addedNotice && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 text-center animate-fade-in">
                ✨ Berhasil ditambahkan ke antrian jadwal!
              </div>
            )}
          </div>
        </div>

        {/* Right List: Scheduled Queue Items */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-humaira-gold/30 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-humaira-gold/15">
              <div>
                <h3 className="text-base font-bold font-serif text-humaira-plum">
                  Daftar Antrian Video Terjadwal
                </h3>
                <p className="text-xs text-humaira-plumMuted">
                  Tersimpan di penyimpanan lokal (localStorage)
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-humaira-sageLight text-humaira-sageDark text-xs font-bold border border-humaira-sage/20">
                {scheduledPosts.length} Video
              </span>
            </div>

            {scheduledPosts.length === 0 ? (
              <div className="text-center py-12 bg-humaira-cream/40 rounded-2xl border border-dashed border-humaira-gold/30">
                <span className="text-4xl">🌸</span>
                <p className="text-sm font-bold text-humaira-plum mt-2">
                  Belum Ada Jadwal Antrian
                </p>
                <p className="text-xs text-humaira-plumMuted mt-1 max-w-sm mx-auto">
                  Silakan isi form di samping kiri untuk mengatur posting otomatis subuh berkah.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {scheduledPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-2xl border border-humaira-gold/25 bg-humaira-cream/20 hover:bg-white hover:shadow-card transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            post.status === "terjadwal"
                              ? "bg-humaira-goldLight text-humaira-goldDark border border-humaira-gold/30"
                              : post.status === "dipublikasikan"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {post.status.toUpperCase()}
                        </span>

                        <span className="text-xs text-humaira-plumMuted flex items-center gap-1 font-semibold">
                          <Clock className="w-3 h-3 text-humaira-goldDark" />
                          {formatWIB(post.scheduledTime)}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-humaira-plum">
                        {post.title}
                      </h4>

                      <p className="text-xs text-humaira-plumMuted line-clamp-2 leading-relaxed">
                        {post.caption}
                      </p>

                      <div className="flex items-center gap-2 pt-1 text-[11px] text-humaira-plumMuted">
                        <span>Target:</span>
                        {post.platforms === "instagram" || post.platforms === "both" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-semibold">
                            <Instagram className="w-3 h-3" /> IG Reels
                          </span>
                        ) : null}
                        {post.platforms === "youtube" || post.platforms === "both" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-red-700 font-semibold">
                            <Youtube className="w-3 h-3" /> YouTube Shorts
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {post.status === "terjadwal" && (
                        <button
                          onClick={() => onTriggerPublishNow(post)}
                          className="px-3 py-1.5 rounded-xl bg-humaira-gold text-white text-xs font-bold shadow hover:bg-humaira-goldDark transition-all flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>Posting Sekarang</span>
                        </button>
                      )}

                      <button
                        onClick={() => onDeleteSchedule(post.id)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all"
                        title="Hapus dari antrian"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
