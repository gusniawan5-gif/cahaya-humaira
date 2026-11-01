"use client";

import React, { useState, useEffect } from "react";
import {
  Key,
  ShieldCheck,
  Instagram,
  Youtube,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  BookOpen,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ApiSettings } from "@/types";

interface SettingsTabProps {
  apiSettings: ApiSettings;
  onSaveSettings: (settings: ApiSettings) => Promise<boolean>;
}

export default function SettingsTab({
  apiSettings,
  onSaveSettings,
}: SettingsTabProps) {
  const [formData, setFormData] = useState<ApiSettings>(apiSettings);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Accordion toggles for tutorial
  const [showMetaTutorial, setShowMetaTutorial] = useState<boolean>(true);
  const [showYoutubeTutorial, setShowYoutubeTutorial] = useState<boolean>(false);

  useEffect(() => {
    setFormData(apiSettings);
  }, [apiSettings]);

  const handleChange = (field: keyof ApiSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);
    try {
      const ok = await onSaveSettings(formData);
      if (ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        setErrorMessage("Gagal menyimpan ke .env.local.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal menyimpan pengaturan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-humaira-pinkLight via-humaira-cream to-humaira-goldLight/30 rounded-3xl p-6 sm:p-7 border border-humaira-gold/30 shadow-soft">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-humaira-gold/30 text-xs font-semibold text-humaira-goldDark mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-humaira-gold" />
              <span>Konfigurasi Aman & Terenkripsi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-humaira-plum">
              Pusat Pengaturan API & Kredensial
            </h2>
            <p className="text-xs sm:text-sm text-humaira-plumMuted mt-1 max-w-2xl leading-relaxed">
              Semua token dan API key disimpan secara aman ke dalam file <code>.env.local</code> di server
              lokal Anda tanpa pernah terekspos ke publik.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Settings */}
        <div className="lg:col-span-7 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Instagram Section */}
            <div className="bg-white rounded-3xl p-6 border border-humaira-gold/30 shadow-soft space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-humaira-gold/15">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-humaira-plum">
                    1. Meta Graph API (Instagram Reels)
                  </h3>
                  <p className="text-[11px] text-humaira-plumMuted">
                    Target akun bisnis Instagram @cahayahumaira
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-humaira-plumMuted mb-1">
                  Instagram Access Token (Long-Lived):
                </label>
                <input
                  type="password"
                  value={formData.instagramAccessToken}
                  onChange={(e) => handleChange("instagramAccessToken", e.target.value)}
                  placeholder="EAAGm..."
                  className="w-full px-3.5 py-2 rounded-xl border border-humaira-gold/30 text-xs bg-humaira-cream/30 text-humaira-plum focus:outline-none focus:ring-2 focus:ring-humaira-gold/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-humaira-plumMuted mb-1">
                    Instagram Business Account ID:
                  </label>
                  <input
                    type="text"
                    value={formData.instagramBusinessId}
                    onChange={(e) => handleChange("instagramBusinessId", e.target.value)}
                    placeholder="17841400..."
                    className="w-full px-3 py-2 rounded-xl border border-humaira-gold/30 text-xs bg-humaira-cream/30 text-humaira-plum focus:outline-none focus:ring-2 focus:ring-humaira-gold/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-humaira-plumMuted mb-1">
                    Facebook Page ID:
                  </label>
                  <input
                    type="text"
                    value={formData.facebookPageId}
                    onChange={(e) => handleChange("facebookPageId", e.target.value)}
                    placeholder="10928374..."
                    className="w-full px-3 py-2 rounded-xl border border-humaira-gold/30 text-xs bg-humaira-cream/30 text-humaira-plum focus:outline-none focus:ring-2 focus:ring-humaira-gold/40"
                  />
                </div>
              </div>
            </div>

            {/* YouTube Section */}
            <div className="bg-white rounded-3xl p-6 border border-humaira-gold/30 shadow-soft space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-humaira-gold/15">
                <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                  <Youtube className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-humaira-plum">
                    2. Google & YouTube Data API v3
                  </h3>
                  <p className="text-[11px] text-humaira-plumMuted">
                    Kredensial OAuth 2.0 untuk upload video dan shorts
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-humaira-plumMuted mb-1">
                  YouTube API Key:
                </label>
                <input
                  type="password"
                  value={formData.youtubeApiKey}
                  onChange={(e) => handleChange("youtubeApiKey", e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3.5 py-2 rounded-xl border border-humaira-gold/30 text-xs bg-humaira-cream/30 text-humaira-plum focus:outline-none focus:ring-2 focus:ring-humaira-gold/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-humaira-plumMuted mb-1">
                    OAuth Client ID:
                  </label>
                  <input
                    type="text"
                    value={formData.youtubeClientId}
                    onChange={(e) => handleChange("youtubeClientId", e.target.value)}
                    placeholder="xxxx.apps.googleusercontent.com"
                    className="w-full px-3 py-2 rounded-xl border border-humaira-gold/30 text-xs bg-humaira-cream/30 text-humaira-plum focus:outline-none focus:ring-2 focus:ring-humaira-gold/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-humaira-plumMuted mb-1">
                    OAuth Client Secret:
                  </label>
                  <input
                    type="password"
                    value={formData.youtubeClientSecret}
                    onChange={(e) => handleChange("youtubeClientSecret", e.target.value)}
                    placeholder="GOCSPX-..."
                    className="w-full px-3 py-2 rounded-xl border border-humaira-gold/30 text-xs bg-humaira-cream/30 text-humaira-plum focus:outline-none focus:ring-2 focus:ring-humaira-gold/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-humaira-plumMuted mb-1">
                  YouTube Refresh Token (Wajib untuk Auto-Upload):
                </label>
                <input
                  type="password"
                  value={formData.youtubeRefreshToken}
                  onChange={(e) => handleChange("youtubeRefreshToken", e.target.value)}
                  placeholder="1//04..."
                  className="w-full px-3.5 py-2 rounded-xl border border-humaira-gold/30 text-xs bg-humaira-cream/30 text-humaira-plum focus:outline-none focus:ring-2 focus:ring-humaira-gold/40"
                />
              </div>
            </div>

            {/* Optional Gemini AI Key */}
            <div className="bg-white rounded-3xl p-6 border border-humaira-gold/30 shadow-soft space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-humaira-gold/15">
                <div className="w-8 h-8 rounded-xl bg-humaira-goldLight text-humaira-goldDark flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-humaira-plum">
                    3. Google Gemini AI API Key (Opsional)
                  </h3>
                  <p className="text-[11px] text-humaira-plumMuted">
                    Untuk variasi caption AI tanpa batas selain template bawaan
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-humaira-plumMuted mb-1">
                  Gemini API Key:
                </label>
                <input
                  type="password"
                  value={formData.geminiApiKey || ""}
                  onChange={(e) => handleChange("geminiApiKey", e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3.5 py-2 rounded-xl border border-humaira-gold/30 text-xs bg-humaira-cream/30 text-humaira-plum focus:outline-none focus:ring-2 focus:ring-humaira-gold/40"
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 rounded-2xl bg-humaira-gold text-white font-bold text-sm shadow-md hover:bg-humaira-goldDark transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Menyimpan ke .env.local..." : "Simpan Semua API Key ke .env.local"}</span>
            </button>

            {saveSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Pengaturan berhasil disimpan dengan aman ke file .env.local!</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Step-by-Step UI Tutorial */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-humaira-gold/30 shadow-soft space-y-4">
            <h3 className="text-sm font-bold font-serif text-humaira-plum pb-3 border-b border-humaira-gold/15 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-humaira-goldDark" />
              <span>Panduan Menghubungkan Akun di UI</span>
            </h3>

            {/* Instagram Tutorial Accordion */}
            <div className="border border-humaira-gold/20 rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowMetaTutorial(!showMetaTutorial)}
                className="w-full p-3.5 bg-humaira-pinkLight/40 hover:bg-humaira-pinkLight/70 flex items-center justify-between text-xs font-bold text-humaira-plum transition-all"
              >
                <span className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-rose-600" />
                  Cara Mendapatkan Token Instagram Reels
                </span>
                {showMetaTutorial ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showMetaTutorial && (
                <div className="p-4 bg-white text-xs text-humaira-plumMuted space-y-2.5 leading-relaxed">
                  <p>
                    <strong>Langkah 1:</strong> Ubah akun Instagram <code>@cahayahumaira</code> menjadi{" "}
                    <strong>Akun Profesional / Bisnis</strong> dan tautkan ke Facebook Page dakwah Anda.
                  </p>
                  <p>
                    <strong>Langkah 2:</strong> Buka{" "}
                    <a
                      href="https://developers.facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-600 underline font-semibold inline-flex items-center gap-0.5"
                    >
                      Meta for Developers <ExternalLink className="w-3 h-3" />
                    </a>
                    , buat aplikasi tipe &quot;Business&quot;, lalu aktifkan produk <strong>Instagram Graph API</strong>.
                  </p>
                  <p>
                    <strong>Langkah 3:</strong> Pada Graph API Explorer, pilih permissions:
                    <br />
                    <code>instagram_basic</code>, <code>instagram_content_publish</code>,{" "}
                    <code>pages_read_engagement</code>, <code>pages_show_list</code>.
                  </p>
                  <p>
                    <strong>Langkah 4:</strong> Generate Access Token, lalu tukarkan menjadi{" "}
                    <strong>Long-Lived Token (masa aktif 60 hari)</strong>.
                  </p>
                </div>
              )}
            </div>

            {/* YouTube Tutorial Accordion */}
            <div className="border border-humaira-gold/20 rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowYoutubeTutorial(!showYoutubeTutorial)}
                className="w-full p-3.5 bg-red-50/50 hover:bg-red-50 flex items-center justify-between text-xs font-bold text-humaira-plum transition-all"
              >
                <span className="flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-red-600" />
                  Cara Mendapatkan Kredensial YouTube API v3
                </span>
                {showYoutubeTutorial ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showYoutubeTutorial && (
                <div className="p-4 bg-white text-xs text-humaira-plumMuted space-y-2.5 leading-relaxed">
                  <p>
                    <strong>Langkah 1:</strong> Buka{" "}
                    <a
                      href="https://console.cloud.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 underline font-semibold inline-flex items-center gap-0.5"
                    >
                      Google Cloud Console <ExternalLink className="w-3 h-3" />
                    </a>
                    , buat project baru, lalu aktifkan library <strong>YouTube Data API v3</strong>.
                  </p>
                  <p>
                    <strong>Langkah 2:</strong> Konfigurasi OAuth Consent Screen (isi nama aplikasi dan email
                    pengembang).
                  </p>
                  <p>
                    <strong>Langkah 3:</strong> Di menu Credentials, buat <strong>OAuth 2.0 Client ID</strong> tipe &quot;Web application&quot;.
                    Tambahkan URI pengalihan (redirect):
                    <br />
                    <code>http://localhost:3000/api/youtube/callback</code>
                  </p>
                  <p>
                    <strong>Langkah 4:</strong> Simpan Client ID dan Client Secret ke form di sebelah kiri.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
