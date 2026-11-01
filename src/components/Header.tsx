"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Instagram, Youtube, Clock, Heart } from "lucide-react";
import { formatWIB } from "@/lib/utils";

export default function Header() {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(formatWIB(new Date()));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="relative bg-white/90 backdrop-blur-md border-b border-humaira-gold/30 shadow-soft sticky top-0 z-50">
      {/* Top Islamic Bar */}
      <div className="bg-gradient-to-r from-humaira-pinkLight via-humaira-cream to-humaira-sageLight border-b border-humaira-gold/20 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-humaira-plumMuted">
          <div className="flex items-center gap-2">
            <span className="font-serif italic text-humaira-goldDark text-sm">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </span>
            <span className="hidden sm:inline text-humaira-plumMuted/60">|</span>
            <span className="hidden sm:inline flex items-center gap-1 text-humaira-plumMuted">
              <Heart className="w-3.5 h-3.5 text-humaira-pinkDark inline fill-humaira-pink" />
              Dedikasi Dakwah Santun Muslimah Ranah Jambi
            </span>
          </div>

          <div className="flex items-center gap-2 font-medium">
            <Clock className="w-3.5 h-3.5 text-humaira-goldDark animate-pulse" />
            <span className="text-humaira-plum">{currentTime || "Memuat waktu..."}</span>
          </div>
        </div>
      </div>

      {/* Main Header Brand */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Brand Name */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-humaira-pink via-humaira-pinkHover to-humaira-goldLight border-2 border-humaira-gold/40 flex items-center justify-center shadow-md shadow-humaira-pink/30 relative">
            <span className="text-2xl select-none">🌸</span>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-humaira-sage rounded-full border-2 border-white"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-humaira-plum font-serif">
                Cahaya Humaira
              </h1>
              <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-humaira-goldLight text-humaira-goldDark border border-humaira-gold/40 rounded-full shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-humaira-gold" />
                Auto Dakwah Video
              </span>
            </div>
            <p className="text-xs text-humaira-plumMuted mt-0.5">
              Platform Otomatisasi Konten & Publikasi Video Instagram & YouTube
            </p>
          </div>
        </div>

        {/* Target Channels Badge */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center">
          <a
            href="https://instagram.com/cahayahumaira783"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-humaira-pinkLight border border-humaira-pinkHover hover:bg-humaira-pink transition-all shadow-sm text-xs font-semibold text-humaira-plum group"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white">
              <Instagram className="w-3 h-3" />
            </div>
            <span>@cahayahumaira783</span>
            <span className="w-1.5 h-1.5 rounded-full bg-humaira-sage animate-ping"></span>
          </a>

          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50/80 border border-red-200 hover:bg-red-100/80 transition-all shadow-sm text-xs font-semibold text-humaira-plum group"
          >
            <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white">
              <Youtube className="w-3 h-3" />
            </div>
            <span>YouTube Dakwah</span>
            <span className="w-1.5 h-1.5 rounded-full bg-humaira-sage animate-ping"></span>
          </a>
        </div>
      </div>
    </header>
  );
}
