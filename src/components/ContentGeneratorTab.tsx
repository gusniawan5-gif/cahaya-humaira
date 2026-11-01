"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  BookOpen,
  Hash,
  Send,
  RefreshCw,
  Heart,
  Bookmark,
  Share2,
} from "lucide-react";
import { PRESET_THEMES, DEFAULT_HASHTAGS } from "@/lib/islamicTemplates";
import { DakwahTheme } from "@/types";

interface ContentGeneratorTabProps {
  onApplyCaptionToEditor: (caption: string, title: string) => void;
}

export default function ContentGeneratorTab({
  onApplyCaptionToEditor,
}: ContentGeneratorTabProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>("Sabar & Keteguhan Hati");
  const [customTopicInput, setCustomTopicInput] = useState<string>("");
  const [targetAudience, setTargetAudience] = useState<string>("Muslimah Jambi");
  const [title, setTitle] = useState<string>("🌸 Menemukan Ketenangan di Tengah Badai Ujian");
  const [caption, setCaption] = useState<string>(PRESET_THEMES[0].sampleCaption + "\n\n" + DEFAULT_HASHTAGS.join(" "));
  const [currentDalil, setCurrentDalil] = useState(PRESET_THEMES[0].dalil);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [appliedNotice, setAppliedNotice] = useState<boolean>(false);

  // Calculate words and characters
  const wordCount = caption.trim().split(/\s+/).filter(Boolean).length;
  const charCount = caption.length;

  const handleSelectPreset = (theme: DakwahTheme) => {
    setSelectedTopic(theme.name);
    setCustomTopicInput("");
    setTitle(`${theme.emoji} ${theme.name} | Renungan Cahaya Humaira`);
    setCaption(`${theme.sampleCaption}\n\n${DEFAULT_HASHTAGS.join(" ")}`);
    setCurrentDalil(theme.dalil);
  };

  const handleGenerate = async () => {
    const finalTopic = customTopicInput.trim() || selectedTopic;
    if (!finalTopic) return;

    setLoading(true);
    try {
      const response = await fetch("/api/generate-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: finalTopic,
          subAudience: targetAudience,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTitle(data.title || `🌸 Hikmah ${finalTopic} | Cahaya Humaira`);
        setCaption(data.caption);
        if (data.dalil) {
          setCurrentDalil(data.dalil);
        }
      } else {
        // Fallback local synthesis
        const matched = PRESET_THEMES.find((t) =>
          t.name.toLowerCase().includes(finalTopic.toLowerCase())
        );
        if (matched) {
          setTitle(`${matched.emoji} ${matched.name} | Cahaya Humaira`);
          setCaption(`${matched.sampleCaption}\n\n${DEFAULT_HASHTAGS.join(" ")}`);
          setCurrentDalil(matched.dalil);
        }
      }
    } catch (err) {
      console.error("Generator error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleApply = () => {
    onApplyCaptionToEditor(caption, title);
    setAppliedNotice(true);
    setTimeout(() => setAppliedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-humaira-pinkLight via-humaira-cream to-humaira-goldLight/30 rounded-3xl p-6 sm:p-7 border border-humaira-gold/30 shadow-soft">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-humaira-gold/30 text-xs font-semibold text-humaira-goldDark mb-2">
              <Sparkles className="w-3.5 h-3.5 text-humaira-gold" />
              <span>AI & Curated Dakwah Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-humaira-plum">
              Generator Konten Ceramah Muslimah
            </h2>
            <p className="text-xs sm:text-sm text-humaira-plumMuted mt-1 max-w-2xl leading-relaxed">
              Hasilkan caption ~150 kata bernada lembut, hangat, dan keibuan khas muslimah
              Jambi, lengkap dengan dalil Qur&apos;an / Hadits Shahih dan rangkaian hashtag
              resmi @cahayahumaira.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-humaira-sageLight text-humaira-sageDark text-xs font-bold border border-humaira-sage/30 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-humaira-sageDark inline" />
              Gaya Keibuan Lembut
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Preset Themes */}
        <div className="lg:col-span-5 space-y-5">
          {/* Preset Topics Card */}
          <div className="bg-white rounded-3xl p-5 border border-humaira-gold/30 shadow-soft">
            <h3 className="text-sm font-bold text-humaira-plum flex items-center gap-2 mb-3">
              <Bookmark className="w-4 h-4 text-humaira-goldDark" />
              <span>Pilih Tema Siap Pakai (Preset Rekomendasi)</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {PRESET_THEMES.map((theme) => {
                const isSelected = selectedTopic === theme.name && !customTopicInput;
                return (
                  <button
                    key={theme.id}
                    onClick={() => handleSelectPreset(theme)}
                    className={`text-left p-3 rounded-2xl border transition-all text-xs flex flex-col justify-between ${
                      isSelected
                        ? "bg-humaira-pinkLight border-humaira-pinkDark shadow-sm font-bold text-humaira-plum"
                        : "bg-humaira-cream/50 border-humaira-gold/15 hover:bg-humaira-cream text-humaira-plumMuted"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-base">{theme.emoji}</span>
                      <span className="font-semibold truncate">{theme.name}</span>
                    </div>
                    <span className="text-[10px] text-humaira-plumMuted/80 line-clamp-1">
                      {theme.dalil.source}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Topic Generator Input */}
          <div className="bg-white rounded-3xl p-5 border border-humaira-gold/30 shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-humaira-plum flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-humaira-gold" />
              <span>Atau Tulis Tema Kustom Anda</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-humaira-plumMuted mb-1.5">
                Tema / Topik Ceramah:
              </label>
              <input
                type="text"
                value={customTopicInput}
                onChange={(e) => setCustomTopicInput(e.target.value)}
                placeholder="Contoh: Sabar di Kala Difitnah, Menjaga Lisan, Adab Istri Sholehah..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-humaira-gold/30 bg-humaira-cream/30 text-sm focus:outline-none focus:ring-2 focus:ring-humaira-gold/40 text-humaira-plum"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-humaira-plumMuted mb-1.5">
                Target Audiens / Wilayah:
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Muslimah Jambi / Ibu Muda / Pejuang Hijrah"
                className="w-full px-3.5 py-2 rounded-xl border border-humaira-gold/30 bg-humaira-cream/30 text-xs focus:outline-none focus:ring-2 focus:ring-humaira-gold/40 text-humaira-plum"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-humaira-gold to-humaira-goldDark text-white font-bold text-sm shadow-md hover:shadow-glow transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sedang Menenun Nasihat Lembut...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Caption (150 Kata + Dalil)</span>
                </>
              )}
            </button>
          </div>

          {/* Dalil Card Display */}
          {currentDalil && (
            <div className="bg-humaira-sageLight/50 rounded-3xl p-5 border border-humaira-sage/30 shadow-soft">
              <div className="flex items-center gap-2 text-humaira-sageDark text-xs font-bold mb-2">
                <BookOpen className="w-4 h-4" />
                <span>Dalil Al-Qur&apos;an / Hadits Shahih Terpilih:</span>
              </div>
              <p className="font-serif text-sm text-humaira-plum leading-relaxed text-right dir-rtl mb-2 italic">
                {currentDalil.arabic}
              </p>
              <p className="text-xs text-humaira-plum leading-relaxed italic">
                &ldquo;{currentDalil.translation}&rdquo;
              </p>
              <span className="inline-block mt-2 text-[11px] font-bold text-humaira-sageDark bg-white/80 px-2.5 py-0.5 rounded-full border border-humaira-sage/20">
                {currentDalil.source}
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Live Caption Editor & Inspector */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-humaira-gold/30 shadow-soft space-y-4">
            {/* Header of Editor */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-humaira-gold/15">
              <div>
                <span className="text-[11px] font-bold text-humaira-goldDark uppercase tracking-wider">
                  Hasil Siap Posting & Edit
                </span>
                <h3 className="text-base font-bold font-serif text-humaira-plum">
                  Pratinjau & Editor Caption Dakwah
                </h3>
              </div>

              {/* Counters */}
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span
                  className={`px-2.5 py-1 rounded-full ${
                    wordCount >= 130 && wordCount <= 190
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-humaira-cream text-humaira-plumMuted"
                  }`}
                >
                  {wordCount} Kata (~150 kata)
                </span>
                <span className="px-2.5 py-1 rounded-full bg-humaira-cream text-humaira-plumMuted">
                  {charCount} Karakter
                </span>
              </div>
            </div>

            {/* Title field */}
            <div>
              <label className="block text-xs font-semibold text-humaira-plumMuted mb-1">
                Judul Video / Headline Reels & YouTube:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-humaira-gold/30 text-sm font-bold text-humaira-plum bg-humaira-cream/30 focus:outline-none focus:ring-2 focus:ring-humaira-gold/40"
              />
            </div>

            {/* Caption Textarea */}
            <div>
              <label className="block text-xs font-semibold text-humaira-plumMuted mb-1">
                Isi Caption (Dapat diedit bebas):
              </label>
              <textarea
                rows={13}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full p-4 rounded-2xl border border-humaira-gold/30 text-sm leading-relaxed text-humaira-plum bg-humaira-cream/20 focus:outline-none focus:ring-2 focus:ring-humaira-gold/40 font-sans"
                placeholder="Caption dakwah akan tampil di sini..."
              />
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-humaira-cream border border-humaira-gold/30 text-humaira-plum text-xs font-bold hover:bg-humaira-creamDark transition-all active:scale-95 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Tersalin ke Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-humaira-goldDark" />
                    <span>Salin Teks Caption</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleApply}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-humaira-pinkDark text-white text-xs font-bold shadow-md hover:bg-humaira-pinkDark/90 transition-all active:scale-95 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gunakan di Editor Video &rarr;</span>
                </button>
              </div>
            </div>

            {appliedNotice && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 text-center animate-fade-in">
                ✨ Berhasil dikirim ke Editor Video! Silakan lanjut ke tab Upload & Editor Video.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
