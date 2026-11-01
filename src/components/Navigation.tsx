"use client";

import React from "react";
import {
  LayoutDashboard,
  Sparkles,
  Video,
  Instagram,
  Youtube,
  CalendarDays,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type TabKey =
  | "dashboard"
  | "generator"
  | "editor"
  | "instagram"
  | "youtube"
  | "scheduler"
  | "settings";

interface NavigationProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  queueCount: number;
}

export default function Navigation({
  activeTab,
  onTabChange,
  queueCount,
}: NavigationProps) {
  const tabs = [
    {
      key: "dashboard" as TabKey,
      label: "Dashboard & Kalender",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      key: "generator" as TabKey,
      label: "Generator Konten",
      icon: Sparkles,
      badge: "AI 150 Kata",
    },
    {
      key: "editor" as TabKey,
      label: "Upload & Thumbnail",
      icon: Video,
      badge: "Canvas 9:16",
    },
    {
      key: "instagram" as TabKey,
      label: "Instagram Reels",
      icon: Instagram,
      badge: "Graph API",
    },
    {
      key: "youtube" as TabKey,
      label: "YouTube Shorts",
      icon: Youtube,
      badge: "API v3",
    },
    {
      key: "scheduler" as TabKey,
      label: "Jadwal Otomatis",
      icon: CalendarDays,
      badge: queueCount > 0 ? `${queueCount} Antre` : null,
      badgeColor: "bg-humaira-sage text-white",
    },
    {
      key: "settings" as TabKey,
      label: "Pengaturan API",
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none sm:justify-start">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer select-none border",
                isActive
                  ? "bg-white text-humaira-plum border-humaira-gold shadow-sm shadow-humaira-gold/20"
                  : "bg-white/60 text-humaira-plumMuted border-transparent hover:bg-white hover:text-humaira-plum hover:border-humaira-pinkHover"
              )}
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                  isActive
                    ? "bg-humaira-pinkLight text-humaira-pinkDark"
                    : "bg-humaira-cream text-humaira-plumMuted"
                )}
              >
                <Icon className="w-4 h-4" />
              </div>

              <span>{tab.label}</span>

              {tab.badge && (
                <span
                  className={cn(
                    "px-1.5 py-0.5 text-[10px] rounded-full font-medium",
                    tab.badgeColor ||
                      "bg-humaira-goldLight text-humaira-goldDark border border-humaira-gold/30"
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
