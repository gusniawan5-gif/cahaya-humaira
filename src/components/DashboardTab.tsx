"use client";

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Video,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Instagram,
  Youtube,
  Send,
  Plus,
} from "lucide-react";
import { ScheduledPost } from "@/types";
import { formatWIB, formatDateWIB } from "@/lib/utils";

interface DashboardTabProps {
  scheduledPosts: ScheduledPost[];
  onNavigate: (tab: any) => void;
  onSelectPostForPublish?: (post: ScheduledPost) => void;
}

export default function DashboardTab({
  scheduledPosts,
  onNavigate,
  onSelectPostForPublish,
}: DashboardTabProps) {
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0);

  // Statistics calculation
  const totalUploaded =
    14 + scheduledPosts.filter((p) => p.status === "dipublikasikan").length;
  const totalViews = (128450 + totalUploaded * 3240).toLocaleString("id-ID");
  const totalScheduled = scheduledPosts.filter(
    (p) => p.status === "terjadwal"
  ).length;

  // Calendar logic for 30 / 31 days
  const today = new Date();
  const currentMonthDate = new Date(
    today.getFullYear(),
    today.getMonth() + currentMonthOffset,
    1
  );
  const monthName = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(currentMonthDate);

  const daysInMonth = new Date(
    currentMonthDate.getFullYear(),
    currentMonthDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayIndex = (currentMonthDate.getDay() + 6) % 7; // Monday = 0

  // Map scheduled posts by day of this month
  const getPostsForDay = (dayNum: number) => {
    return scheduledPosts.filter((post) => {
      const postDate = new Date(post.scheduledTime);
      return (
        postDate.getFullYear() === currentMonthDate.getFullYear() &&
        postDate.getMonth() === currentMonthDate.getMonth() &&
        postDate.getDate() === dayNum
      );
    });
  };

  // Mock past posted days for illustration if offset is 0
  const isPastPostedDay = (dayNum: number) => {
    if (currentMonthOffset === 0) {
      // simulate some previous days of current month had posts
      return [2, 5, 8, 12, 16, 19, 23, 26].includes(dayNum) && dayNum <= today.getDate();
    }
    return false;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-humaira-pinkLight via-humaira-cream to-humaira-goldLight/40 p-6 md:p-8 border border-humaira-gold/30 shadow-soft">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 rounded-full bg-humaira-pink/40 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-40 h-40 rounded-full bg-humaira-goldLight/70 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-humaira-gold/30 text-xs font-semibold text-humaira-goldDark mb-3">
              <Sparkles className="w-3.5 h-3.5 text-humaira-gold" />
              <span>Assalamu&apos;alaikum, Tim Dakwah Cahaya Humaira</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-humaira-plum">
              Jadwal & Efektivitas Dakwah Digital
            </h2>
            <p className="text-sm text-humaira-plumMuted mt-1 max-w-2xl leading-relaxed">
              Pantau jadwal posting 30 hari ke depan untuk Instagram Reels dan YouTube
              Shorts. Sebarkan pesan kebaikan, kehangatan, dan keteladanan muslimah di ranah
              Jambi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate("generator")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-humaira-gold text-white font-semibold text-sm shadow-md hover:bg-humaira-goldDark transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Konten Baru</span>
            </button>
            <button
              onClick={() => onNavigate("editor")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-humaira-pinkHover text-humaira-plum font-semibold text-sm hover:bg-humaira-pinkLight transition-all"
            >
              <Video className="w-4 h-4 text-humaira-pinkDark" />
              <span>Upload Video</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Video Terupload */}
        <div className="bg-white rounded-2xl p-5 border border-humaira-gold/25 shadow-soft hover:shadow-card transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-humaira-plumMuted uppercase tracking-wider">
              Total Video Terupload
            </span>
            <div className="w-9 h-9 rounded-xl bg-humaira-pinkLight text-humaira-pinkDark flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-serif text-humaira-plum">
              {totalUploaded}
            </span>
            <span className="text-xs text-humaira-sage font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5 inline" /> +3 pekan ini
            </span>
          </div>
          <p className="text-xs text-humaira-plumMuted/80 mt-1">
            Instagram Reels & YouTube Shorts
          </p>
        </div>

        {/* Total Views Dummy */}
        <div className="bg-white rounded-2xl p-5 border border-humaira-gold/25 shadow-soft hover:shadow-card transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-humaira-plumMuted uppercase tracking-wider">
              Total Tayangan (Views)
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-serif text-humaira-plum">
              {totalViews}
            </span>
            <span className="text-xs text-amber-600 font-medium">Est. jangkauan</span>
          </div>
          <p className="text-xs text-humaira-plumMuted/80 mt-1">
            Rata-rata 9.1k penonton per video
          </p>
        </div>

        {/* Video Terjadwal */}
        <div className="bg-white rounded-2xl p-5 border border-humaira-gold/25 shadow-soft hover:shadow-card transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-humaira-plumMuted uppercase tracking-wider">
              Video Terjadwal
            </span>
            <div className="w-9 h-9 rounded-xl bg-humaira-sageLight text-humaira-sageDark flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-serif text-humaira-plum">
              {totalScheduled}
            </span>
            <span className="text-xs text-humaira-sageDark font-medium">
              Siap auto-publish
            </span>
          </div>
          <p className="text-xs text-humaira-plumMuted/80 mt-1">
            Waktu default: 05:30 WIB (Subuh Berkah)
          </p>
        </div>

        {/* Status Sinkronisasi Akun */}
        <div className="bg-white rounded-2xl p-5 border border-humaira-gold/25 shadow-soft hover:shadow-card transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-humaira-plumMuted uppercase tracking-wider">
              Status Kanal Dakwah
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-humaira-plum">
                <Instagram className="w-3.5 h-3.5 text-rose-500" /> @cahayahumaira
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
                Terhubung
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-humaira-plum">
                <Youtube className="w-3.5 h-3.5 text-red-600" /> YouTube Shorts
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
                Siap Upload
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 30-Day Interactive Calendar */}
      <div className="bg-white rounded-3xl p-6 border border-humaira-gold/30 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-humaira-gold/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-humaira-pinkLight border border-humaira-pinkHover flex items-center justify-center text-humaira-pinkDark">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-humaira-plum">
                Kalender Posting Dakwah 30 Hari
              </h3>
              <p className="text-xs text-humaira-plumMuted">
                Visualisasi jadwal konten setiap hari: Sudah posting, Terjadwal, dan Belum ada konten.
              </p>
            </div>
          </div>

          {/* Month Controls & Legend */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-humaira-cream rounded-xl p-1 border border-humaira-gold/20">
              <button
                onClick={() => setCurrentMonthOffset((prev) => prev - 1)}
                className="p-1.5 rounded-lg hover:bg-white text-humaira-plum transition-all"
                title="Bulan sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 text-xs font-bold text-humaira-plum min-w-[120px] text-center">
                {monthName}
              </span>
              <button
                onClick={() => setCurrentMonthOffset((prev) => prev + 1)}
                className="p-1.5 rounded-lg hover:bg-white text-humaira-plum transition-all"
                title="Bulan berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 py-3 text-xs font-medium text-humaira-plumMuted border-b border-humaira-creamDark mb-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-emerald-500 shadow-sm"></span>
            <span>Sudah Posting (Published)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-humaira-gold shadow-sm"></span>
            <span>Terjadwal (05:30 WIB)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-slate-200"></span>
            <span>Belum Terjadwal</span>
          </div>
        </div>

        {/* Day Header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-humaira-plumMuted pb-2">
          <span>SEN</span>
          <span>SEL</span>
          <span>RAB</span>
          <span>KAM</span>
          <span>JUM</span>
          <span>SAB</span>
          <span className="text-rose-500">AHAD</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Leading empty days */}
          {Array.from({ length: firstDayIndex }).map((_, idx) => (
            <div
              key={`empty-${idx}`}
              className="h-20 rounded-2xl bg-humaira-cream/30 border border-transparent"
            />
          ))}

          {/* Days of current month */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const isToday =
              currentMonthOffset === 0 && dayNum === today.getDate();
            const postsForDay = getPostsForDay(dayNum);
            const hasScheduled = postsForDay.some((p) => p.status === "terjadwal");
            const hasPublished =
              postsForDay.some((p) => p.status === "dipublikasikan") ||
              isPastPostedDay(dayNum);

            let dayStyle = "bg-humaira-cream/50 border-humaira-gold/15 text-humaira-plum";
            let badgeText = "Belum";
            let badgeClass = "bg-slate-100 text-slate-500";

            if (hasPublished) {
              dayStyle = "bg-emerald-50/70 border-emerald-300 text-emerald-950";
              badgeText = "Selesai";
              badgeClass = "bg-emerald-100 text-emerald-800 font-semibold";
            } else if (hasScheduled) {
              dayStyle = "bg-amber-50/80 border-humaira-gold text-amber-950";
              badgeText = "05:30 WIB";
              badgeClass = "bg-humaira-gold text-white font-semibold";
            }

            return (
              <div
                key={`day-${dayNum}`}
                className={`relative min-h-[85px] p-2 rounded-2xl border transition-all flex flex-col justify-between group hover:border-humaira-gold hover:shadow-sm ${dayStyle} ${
                  isToday ? "ring-2 ring-humaira-pinkDark ring-offset-2" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                      isToday
                        ? "bg-humaira-pinkDark text-white"
                        : "text-humaira-plum"
                    }`}
                  >
                    {dayNum}
                  </span>

                  {isToday && (
                    <span className="text-[9px] uppercase font-bold text-humaira-pinkDark">
                      Hari Ini
                    </span>
                  )}
                </div>

                <div className="mt-1">
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded text-[10px] w-full text-center truncate ${badgeClass}`}
                  >
                    {badgeText}
                  </span>
                  {postsForDay.length > 0 && (
                    <p className="text-[10px] font-medium text-humaira-plum truncate mt-1">
                      {postsForDay[0].title}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Scheduled Queue Preview */}
      <div className="bg-white rounded-3xl p-6 border border-humaira-gold/30 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-humaira-goldDark" />
            <h3 className="text-lg font-bold font-serif text-humaira-plum">
              Antrian Video Terjadwal Terdekat
            </h3>
          </div>
          <button
            onClick={() => onNavigate("scheduler")}
            className="text-xs font-bold text-humaira-goldDark hover:underline"
          >
            Buka Halaman Jadwal Lengkap &rarr;
          </button>
        </div>

        {scheduledPosts.length === 0 ? (
          <div className="text-center py-8 bg-humaira-cream/50 rounded-2xl border border-dashed border-humaira-gold/30">
            <span className="text-3xl">🌸</span>
            <p className="text-sm font-semibold text-humaira-plum mt-2">
              Belum ada video di antrian jadwal
            </p>
            <p className="text-xs text-humaira-plumMuted mt-1">
              Gunakan menu &quot;Generator Konten&quot; dan &quot;Upload Video&quot; untuk menjadwalkan posting otomatis.
            </p>
            <button
              onClick={() => onNavigate("generator")}
              className="mt-3 px-4 py-2 rounded-xl bg-humaira-gold text-white font-semibold text-xs shadow hover:bg-humaira-goldDark transition-all"
            >
              Buat Konten Pertama Sekarang
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scheduledPosts.slice(0, 3).map((post) => (
              <div
                key={post.id}
                className="p-4 rounded-2xl border border-humaira-gold/25 bg-humaira-cream/30 hover:bg-white hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        post.status === "terjadwal"
                          ? "bg-humaira-goldLight text-humaira-goldDark border border-humaira-gold/30"
                          : post.status === "dipublikasikan"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {post.status.toUpperCase()}
                    </span>

                    <span className="text-[11px] text-humaira-plumMuted flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-humaira-goldDark" />
                      {formatWIB(post.scheduledTime)}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-humaira-plum line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-xs text-humaira-plumMuted line-clamp-3 mt-1.5 leading-relaxed">
                    {post.caption}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-humaira-gold/15 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {post.platforms === "instagram" || post.platforms === "both" ? (
                      <span className="p-1 rounded bg-rose-50 text-rose-600" title="Instagram Reels">
                        <Instagram className="w-3.5 h-3.5" />
                      </span>
                    ) : null}
                    {post.platforms === "youtube" || post.platforms === "both" ? (
                      <span className="p-1 rounded bg-red-50 text-red-600" title="YouTube Shorts">
                        <Youtube className="w-3.5 h-3.5" />
                      </span>
                    ) : null}
                  </div>

                  {onSelectPostForPublish && post.status === "terjadwal" && (
                    <button
                      onClick={() => onSelectPostForPublish(post)}
                      className="text-xs font-semibold text-humaira-goldDark hover:text-humaira-gold flex items-center gap-1"
                    >
                      <span>Posting Sekarang</span>
                      <Send className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
