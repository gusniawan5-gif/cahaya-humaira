"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Navigation, { TabKey } from "@/components/Navigation";
import DashboardTab from "@/components/DashboardTab";
import ContentGeneratorTab from "@/components/ContentGeneratorTab";
import VideoEditorTab from "@/components/VideoEditorTab";
import InstagramPoster from "@/components/InstagramPoster";
import YouTubePoster from "@/components/YouTubePoster";
import SchedulerTab from "@/components/SchedulerTab";
import SettingsTab from "@/components/SettingsTab";
import { ScheduledPost, ApiSettings, Platform } from "@/types";
import { PRESET_THEMES, DEFAULT_HASHTAGS } from "@/lib/islamicTemplates";

const STORAGE_KEY_POSTS = "cahaya_humaira_scheduled_posts";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");

  // Shared Video & Content State across tabs
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState<string>(
    "🌸 Menemukan Ketenangan di Tengah Badai Ujian | Cahaya Humaira"
  );
  const [videoCaption, setVideoCaption] = useState<string>(
    PRESET_THEMES[0].sampleCaption + "\n\n" + DEFAULT_HASHTAGS.join(" ")
  );
  const [thumbnailDataUrl, setThumbnailDataUrl] = useState<string | null>(null);

  // Scheduled Posts State
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);

  // API Settings State
  const [apiSettings, setApiSettings] = useState<ApiSettings>({
    instagramAccessToken: "",
    instagramBusinessId: "",
    facebookPageId: "",
    youtubeApiKey: "",
    youtubeClientId: "",
    youtubeClientSecret: "",
    youtubeRefreshToken: "",
    geminiApiKey: "",
  });

  // Load Initial Data on Mount (localStorage & API settings)
  useEffect(() => {
    // 1. Load scheduled posts from localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY_POSTS);
      if (saved) {
        setScheduledPosts(JSON.parse(saved));
      } else {
        // Initial sample scheduled posts for preview
        const initialMock: ScheduledPost[] = [
          {
            id: "ch-sample-1",
            title: "🌸 Rahasia Keteguhan Hati Muslimah di Tengah Ujian",
            caption: PRESET_THEMES[0].sampleCaption,
            scheduledTime: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
            platforms: "both",
            status: "terjadwal",
            createdAt: new Date().toISOString(),
          },
          {
            id: "ch-sample-2",
            title: "✨ Istiqomah di Jalan Hijrah & Menjaga Tutur Kata",
            caption: PRESET_THEMES[1].sampleCaption,
            scheduledTime: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
            platforms: "instagram",
            status: "terjadwal",
            createdAt: new Date().toISOString(),
          },
        ];
        setScheduledPosts(initialMock);
        localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(initialMock));
      }
    } catch (e) {
      console.warn("Could not read localStorage", e);
    }

    // 2. Load API settings from server
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setApiSettings((prev) => ({ ...prev, ...data }));
        }
      })
      .catch((err) => console.warn("Failed to load settings:", err));
  }, []);

  // Save to localStorage when scheduledPosts changes
  const saveScheduledPosts = (updated: ScheduledPost[]) => {
    setScheduledPosts(updated);
    try {
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not write to localStorage", e);
    }
  };

  const handleAddSchedule = (postData: Omit<ScheduledPost, "id" | "createdAt">) => {
    const newPost: ScheduledPost = {
      ...postData,
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
      thumbnailDataUrl: thumbnailDataUrl || undefined,
    };
    saveScheduledPosts([newPost, ...scheduledPosts]);
  };

  const handleDeleteSchedule = (id: string) => {
    saveScheduledPosts(scheduledPosts.filter((p) => p.id !== id));
  };

  const handleApplyCaptionToEditor = (caption: string, title: string) => {
    setVideoCaption(caption);
    setVideoTitle(title);
    setActiveTab("editor");
  };

  const handleNavigateToPoster = (platform: "instagram" | "youtube" | "both") => {
    if (platform === "instagram") setActiveTab("instagram");
    else if (platform === "youtube") setActiveTab("youtube");
    else setActiveTab("scheduler");
  };

  const handleSelectPostForPublish = (post: ScheduledPost) => {
    setVideoTitle(post.title);
    setVideoCaption(post.caption);
    if (post.platforms === "instagram") {
      setActiveTab("instagram");
    } else if (post.platforms === "youtube") {
      setActiveTab("youtube");
    } else {
      setActiveTab("instagram");
    }
  };

  const handlePostPublished = (platform: "instagram" | "youtube", mediaId: string) => {
    // Update any matching post in scheduled queue
    const updated = scheduledPosts.map((p) => {
      if (p.title === videoTitle) {
        return {
          ...p,
          status: "dipublikasikan" as const,
          publishedAt: new Date().toISOString(),
          ...(platform === "instagram" ? { instagramMediaId: mediaId } : { youtubeId: mediaId }),
        };
      }
      return p;
    });
    saveScheduledPosts(updated);
  };

  const handleSaveApiSettings = async (newSettings: ApiSettings): Promise<boolean> => {
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setApiSettings(newSettings);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-humaira-cream flex flex-col font-sans selection:bg-humaira-pink selection:text-humaira-plum">
      {/* Top Header */}
      <Header />

      {/* Main Tab Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        queueCount={scheduledPosts.filter((p) => p.status === "terjadwal").length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "dashboard" && (
          <DashboardTab
            scheduledPosts={scheduledPosts}
            onNavigate={(tab) => setActiveTab(tab)}
            onSelectPostForPublish={handleSelectPostForPublish}
          />
        )}

        {activeTab === "generator" && (
          <ContentGeneratorTab onApplyCaptionToEditor={handleApplyCaptionToEditor} />
        )}

        {activeTab === "editor" && (
          <VideoEditorTab
            videoFile={videoFile}
            videoUrl={videoUrl}
            videoTitle={videoTitle}
            videoCaption={videoCaption}
            onVideoChange={(file, url) => {
              setVideoFile(file);
              setVideoUrl(url);
            }}
            onTitleChange={(title) => setVideoTitle(title)}
            onThumbnailGenerated={(dataUrl) => setThumbnailDataUrl(dataUrl)}
            onNavigateToPoster={handleNavigateToPoster}
          />
        )}

        {activeTab === "instagram" && (
          <InstagramPoster
            videoFile={videoFile}
            videoUrl={videoUrl}
            videoTitle={videoTitle}
            videoCaption={videoCaption}
            apiSettings={apiSettings}
            onNavigateToSettings={() => setActiveTab("settings")}
            onPostPublished={handlePostPublished}
          />
        )}

        {activeTab === "youtube" && (
          <YouTubePoster
            videoFile={videoFile}
            videoUrl={videoUrl}
            videoTitle={videoTitle}
            videoCaption={videoCaption}
            apiSettings={apiSettings}
            onNavigateToSettings={() => setActiveTab("settings")}
            onPostPublished={handlePostPublished}
          />
        )}

        {activeTab === "scheduler" && (
          <SchedulerTab
            scheduledPosts={scheduledPosts}
            videoTitle={videoTitle}
            videoCaption={videoCaption}
            videoUrl={videoUrl}
            videoFile={videoFile}
            onAddSchedule={handleAddSchedule}
            onDeleteSchedule={handleDeleteSchedule}
            onTriggerPublishNow={handleSelectPostForPublish}
          />
        )}

        {activeTab === "settings" && (
          <SettingsTab
            apiSettings={apiSettings}
            onSaveSettings={handleSaveApiSettings}
          />
        )}
      </main>

      {/* Islamic Aesthetic Footer */}
      <footer className="mt-auto border-t border-humaira-gold/20 bg-white/70 backdrop-blur-sm py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-humaira-plumMuted">
          <div className="flex items-center gap-2">
            <span className="text-base">🌸</span>
            <span className="font-serif font-bold text-humaira-plum">
              Cahaya Humaira - Auto Dakwah Video
            </span>
            <span>&bull;</span>
            <span>Instagram @cahayahumaira & YouTube</span>
          </div>

          <div className="text-center sm:text-right text-[11px]">
            <span>
              Sepucuk Jambi Sembilan Lurah &bull; Menenun Pesan Kebaikan & Santun Muslimah
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
