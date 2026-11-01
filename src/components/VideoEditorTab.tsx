"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  UploadCloud,
  Film,
  Camera,
  Download,
  Scissors,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  Sparkles,
  Send,
  Eye,
} from "lucide-react";

interface VideoEditorTabProps {
  videoFile: File | null;
  videoUrl: string | null;
  videoTitle: string;
  videoCaption: string;
  onVideoChange: (file: File | null, url: string | null) => void;
  onTitleChange: (title: string) => void;
  onThumbnailGenerated: (dataUrl: string) => void;
  onNavigateToPoster: (platform: "instagram" | "youtube" | "both") => void;
}

export default function VideoEditorTab({
  videoFile,
  videoUrl,
  videoTitle,
  videoCaption,
  onVideoChange,
  onTitleChange,
  onThumbnailGenerated,
  onNavigateToPoster,
}: VideoEditorTabProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTrim60s, setIsTrim60s] = useState<boolean>(false);
  const [thumbnailDataUrl, setThumbnailDataUrl] = useState<string | null>(null);
  const [isGeneratingThumb, setIsGeneratingThumb] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isShortsEligible = duration > 0 && duration <= 60;

  // Handle file drop & select
  const handleFileProcess = (file: File) => {
    setErrorMessage(null);
    const validExtensions = ["video/mp4", "video/quicktime", "video/x-m4v"];
    if (!validExtensions.includes(file.type) && !file.name.match(/\.(mp4|mov)$/i)) {
      setErrorMessage("Format file harus berupa MP4 atau MOV.");
      return;
    }

    const maxSizeMb = 500;
    const fileSizeMb = file.size / (1024 * 1024);
    if (fileSizeMb > maxSizeMb) {
      setErrorMessage(`Ukuran file (${fileSizeMb.toFixed(1)}MB) melebihi batas maksimal 500MB.`);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    onVideoChange(file, objectUrl);

    // Auto extract title from filename if empty
    if (!videoTitle || videoTitle.includes("🌸")) {
      const cleanName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[_-]/g, " ")
        .replace(/^\w/, (c) => c.toUpperCase());
      onTitleChange(`🌸 ${cleanName} | Cahaya Humaira`);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  // Video playback metadata
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      setDuration(dur);
      if (dur <= 60) {
        setIsTrim60s(true);
      }
      // Seek a little bit to avoid a pure black initial frame
      videoRef.current.currentTime = Math.min(1.0, dur * 0.25);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (isTrim60s && videoRef.current.currentTime >= 60) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  /**
   * Auto-Generate Gorgeous 1080x1920 (9:16) Thumbnail on HTML5 Canvas
   * Includes video frame capture + title overlay + Cahaya Humaira watermark + Islamic ornaments
   */
  const generateCanvasThumbnail = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    setIsGeneratingThumb(true);

    const targetWidth = 1080;
    const targetHeight = 1920;
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      // 1. Draw video frame filling the 9:16 canvas (cover)
      const vWidth = video.videoWidth || 1080;
      const vHeight = video.videoHeight || 1920;

      const scale = Math.max(targetWidth / vWidth, targetHeight / vHeight);
      const scaledWidth = vWidth * scale;
      const scaledHeight = vHeight * scale;
      const x = (targetWidth - scaledWidth) / 2;
      const y = (targetHeight - scaledHeight) / 2;

      ctx.fillStyle = "#2E2429";
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      ctx.drawImage(video, x, y, scaledWidth, scaledHeight);

      // 2. Add subtle dark gradient overlay at top and bottom for readability
      const topGradient = ctx.createLinearGradient(0, 0, 0, 420);
      topGradient.addColorStop(0, "rgba(46, 36, 41, 0.75)");
      topGradient.addColorStop(1, "rgba(46, 36, 41, 0.0)");
      ctx.fillStyle = topGradient;
      ctx.fillRect(0, 0, targetWidth, 420);

      const bottomGradient = ctx.createLinearGradient(0, targetHeight - 750, 0, targetHeight);
      bottomGradient.addColorStop(0, "rgba(46, 36, 41, 0.0)");
      bottomGradient.addColorStop(0.4, "rgba(46, 36, 41, 0.75)");
      bottomGradient.addColorStop(1, "rgba(46, 36, 41, 0.95)");
      ctx.fillStyle = bottomGradient;
      ctx.fillRect(0, targetHeight - 750, targetWidth, 750);

      // 3. Top Watermark Badge: "Cahaya Humaira"
      ctx.save();
      const badgeY = 120;
      // Draw background pill
      ctx.fillStyle = "rgba(255, 248, 240, 0.95)";
      ctx.beginPath();
      ctx.roundRect(100, badgeY, 880, 110, 55);
      ctx.fill();
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 4;
      ctx.stroke();

      // Islamic Bismillah or brand
      ctx.font = "bold 44px 'Playfair Display', Georgia, serif";
      ctx.fillStyle = "#2E2429";
      ctx.textAlign = "center";
      ctx.fillText("🌸 CAHAYA HUMAIRA 🌸", 540, badgeY + 68);
      ctx.restore();

      // 4. Subtitle tag at top
      ctx.save();
      ctx.font = "bold 28px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#D4AF37";
      ctx.textAlign = "center";
      ctx.fillText("DAKWAH SANTUN MUSLIMAH • RANAH JAMBI", 540, 275);
      ctx.restore();

      // 5. Draw Video Title in Lower Center
      ctx.save();
      const titleText = videoTitle.replace(/^[🌸\s]+/, "") || "Menemukan Ketenangan Jiwa";
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 64px 'Playfair Display', Georgia, serif";
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
      ctx.shadowBlur = 24;

      // Wrap title text into max 3 lines
      const words = titleText.split(" ");
      let line = "";
      const lines = [];
      const maxWidth = 900;

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
          lines.push(line);
          line = words[i] + " ";
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      let textY = targetHeight - 440;
      for (let k = 0; k < Math.min(lines.length, 3); k++) {
        ctx.fillText(lines[k].trim(), 540, textY + k * 80);
      }
      ctx.restore();

      // 6. Gold Ornamental Divider
      ctx.save();
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(340, targetHeight - 190);
      ctx.lineTo(740, targetHeight - 190);
      ctx.stroke();

      // Little diamond in center
      ctx.fillStyle = "#D4AF37";
      ctx.beginPath();
      ctx.arc(540, targetHeight - 190, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();

      // 7. Footer handles: Instagram & YouTube
      ctx.save();
      ctx.font = "bold 32px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#FADADD";
      ctx.textAlign = "center";
      ctx.fillText("IG: @cahayahumaira • YouTube Shorts", 540, targetHeight - 130);
      ctx.restore();

      // Export as PNG
      const dataUrl = canvas.toDataURL("image/png");
      setThumbnailDataUrl(dataUrl);
      onThumbnailGenerated(dataUrl);
    } catch (e: any) {
      console.error("Canvas thumbnail generation error:", e);
      setErrorMessage("Gagal mengambil frame thumbnail (CORS atau video format).");
    } finally {
      setIsGeneratingThumb(false);
    }
  };

  const handleDownloadThumbnail = () => {
    if (!thumbnailDataUrl) return;
    const a = document.createElement("a");
    a.href = thumbnailDataUrl;
    a.download = `cahaya-humaira-thumbnail-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title Card */}
      <div className="bg-gradient-to-r from-humaira-pinkLight via-humaira-cream to-humaira-goldLight/30 rounded-3xl p-6 sm:p-7 border border-humaira-gold/30 shadow-soft">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-humaira-gold/30 text-xs font-semibold text-humaira-goldDark mb-2">
              <Film className="w-3.5 h-3.5 text-humaira-gold" />
              <span>Studio Video Dakwah</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-humaira-plum">
              Upload & Editor Video Reels / Shorts
            </h2>
            <p className="text-xs sm:text-sm text-humaira-plumMuted mt-1 max-w-2xl leading-relaxed">
              Upload rekaman ceramah (MP4/MOV maks 500MB), generate thumbnail vertikal 1080x1920
              otomatis dengan watermark Islami Cahaya Humaira, serta optimalkan durasi untuk
              Instagram Reels dan YouTube Shorts.
            </p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid: Upload & Player vs Thumbnail Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload Area & Player */}
        <div className="lg:col-span-7 space-y-5">
          {/* Upload Drag & Drop Area */}
          {!videoUrl ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-10 rounded-3xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center min-h-[320px] bg-white ${
                isDragging
                  ? "border-humaira-pinkDark bg-humaira-pinkLight/60 scale-[1.01]"
                  : "border-humaira-gold/40 hover:border-humaira-gold hover:bg-humaira-cream/30"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/x-m4v"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileProcess(e.target.files[0]);
                  }
                }}
              />
              <div className="w-16 h-16 rounded-3xl bg-humaira-pinkLight border border-humaira-pinkHover flex items-center justify-center text-humaira-pinkDark shadow-sm mb-4">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-humaira-plum">
                Tarik & Letakkan File Video Dakwah di Sini
              </h3>
              <p className="text-xs text-humaira-plumMuted mt-1 max-w-sm">
                Mendukung format <strong>.MP4</strong> dan <strong>.MOV</strong>. Batas ukuran maksimal
                hingga <strong>500 MB</strong>.
              </p>
              <button
                type="button"
                className="mt-4 px-5 py-2.5 rounded-xl bg-humaira-gold text-white text-xs font-bold shadow hover:bg-humaira-goldDark transition-all"
              >
                Pilih File dari Komputer
              </button>
            </div>
          ) : (
            /* Video Player Preview */
            <div className="bg-white rounded-3xl p-5 border border-humaira-gold/30 shadow-soft space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-humaira-gold/15">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-humaira-pinkDark" />
                  <span className="text-xs font-bold text-humaira-plum truncate max-w-[250px]">
                    {videoFile?.name || "Video Dakwah"}
                  </span>
                  {videoFile && (
                    <span className="text-[10px] text-humaira-plumMuted">
                      ({(videoFile.size / (1024 * 1024)).toFixed(1)} MB)
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    onVideoChange(null, null);
                    setThumbnailDataUrl(null);
                  }}
                  className="text-xs font-semibold text-rose-600 hover:underline"
                >
                  Ganti Video
                </button>
              </div>

              {/* Video Element */}
              <div className="relative rounded-2xl overflow-hidden bg-black max-h-[420px] flex items-center justify-center">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  crossOrigin="anonymous"
                  onLoadedMetadata={handleLoadedMetadata}
                  onTimeUpdate={handleTimeUpdate}
                  className="max-h-[420px] w-auto mx-auto object-contain"
                  controls
                />
              </div>

              {/* Video Info & Trimmer / Duration */}
              <div className="p-3.5 rounded-2xl bg-humaira-cream/50 border border-humaira-gold/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-humaira-plum">
                    Durasi: {duration ? `${duration.toFixed(1)} detik` : "..."}
                  </span>
                  {isShortsEligible ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                      ✓ Format Shorts & Reels (&le;60s)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
                      Format Video Panjang (&gt;60s)
                    </span>
                  )}
                </div>

                {/* 60s Reels Cutter Option */}
                <label className="flex items-center gap-2 cursor-pointer font-medium text-humaira-plum">
                  <input
                    type="checkbox"
                    checked={isTrim60s}
                    onChange={(e) => setIsTrim60s(e.target.checked)}
                    className="rounded text-humaira-gold focus:ring-humaira-gold"
                  />
                  <Scissors className="w-3.5 h-3.5 text-humaira-goldDark" />
                  <span>Potong otomatis 60 detik untuk Reels</span>
                </label>
              </div>

              {/* Video Title Input */}
              <div>
                <label className="block text-xs font-semibold text-humaira-plumMuted mb-1">
                  Judul Video (YouTube & Instagram):
                </label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => onTitleChange(e.target.value)}
                  placeholder="Masukkan judul video yang menarik..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-humaira-gold/30 text-sm font-bold text-humaira-plum bg-humaira-cream/20 focus:outline-none focus:ring-2 focus:ring-humaira-gold/40"
                />
              </div>

              {/* Trigger Thumbnail Generation Button */}
              <button
                type="button"
                onClick={generateCanvasThumbnail}
                disabled={isGeneratingThumb}
                className="w-full py-3 rounded-2xl bg-humaira-gold text-white font-bold text-sm shadow hover:bg-humaira-goldDark transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>
                  {isGeneratingThumb
                    ? "Menangkap Frame Video..."
                    : "Ambil Frame Ini Jadi Thumbnail 1080x1920"}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: 1080x1920 Thumbnail Canvas Preview */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl p-5 border border-humaira-gold/30 shadow-soft flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-3 border-b border-humaira-gold/15 mb-4">
              <div>
                <h3 className="text-sm font-bold font-serif text-humaira-plum">
                  Auto-Thumbnail 1080x1920 (9:16)
                </h3>
                <p className="text-[11px] text-humaira-plumMuted">
                  Canvas overlay judul + watermark &quot;Cahaya Humaira&quot;
                </p>
              </div>

              {thumbnailDataUrl && (
                <button
                  onClick={handleDownloadThumbnail}
                  className="p-1.5 rounded-lg bg-humaira-cream hover:bg-humaira-creamDark text-humaira-plum transition-all"
                  title="Unduh Thumbnail PNG"
                >
                  <Download className="w-4 h-4 text-humaira-goldDark" />
                </button>
              )}
            </div>

            {/* Hidden Canvas Element used for rendering */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Thumbnail Visual Container (9:16 Phone Mockup) */}
            <div className="relative w-[230px] h-[408px] rounded-3xl overflow-hidden border-4 border-humaira-gold/30 shadow-card bg-neutral-900 flex items-center justify-center group">
              {thumbnailDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumbnailDataUrl}
                  alt="Thumbnail Cahaya Humaira"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-6 text-center text-neutral-400">
                  <Camera className="w-10 h-10 mx-auto text-neutral-600 mb-2" />
                  <p className="text-xs font-semibold text-neutral-300">
                    Belum Ada Thumbnail
                  </p>
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Upload video dan klik &quot;Ambil Frame Ini&quot; untuk menghasilkan thumbnail
                    berdesain estetik Islami secara otomatis.
                  </p>
                </div>
              )}

              {/* Watermark badge on canvas is built-in; add preview pill */}
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-[9px] text-white backdrop-blur-sm">
                9:16 Shorts
              </div>
            </div>

            {/* Action Buttons to Post directly */}
            <div className="w-full mt-5 pt-4 border-t border-humaira-gold/15 space-y-2">
              <span className="block text-[11px] font-bold text-humaira-plumMuted text-center uppercase tracking-wider">
                Lanjutkan Publikasi:
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onNavigateToPoster("instagram")}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-bold shadow hover:opacity-95 transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <span>Ke Instagram Reels</span>
                  <Send className="w-3 h-3" />
                </button>

                <button
                  onClick={() => onNavigateToPoster("youtube")}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold shadow hover:opacity-95 transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <span>Ke YouTube Shorts</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
