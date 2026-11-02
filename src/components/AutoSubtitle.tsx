"use client";
import React, { useState, useRef } from "react";

export default function AutoSubtitle() {
  const [text, setText] = useState("Bismillah... Assalamualaikum warahmatullahi wabarakatuh.\n\nAlhamdulillah, pada kajian kali ini kita akan membahas pentingnya akhlak mulia.\n\nSemoga Allah mudahkan kita memahami ilmu ini.");
  const [burning, setBurning] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fungsi bakar subtitle ke video
  const burnSubtitleToVideo = async () => {
    const video = document.querySelector('video') as HTMLVideoElement;
    if (!video) { alert("Upload video dulu akhi!"); return; }
    if (!text) { alert("Isi teks dulu akhi!"); return; }

    setBurning(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks: Blob[] = [];
      recorder.ondataavailable = e => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setBurning(false);
        alert("Alhamdulillah video dengan subtitle sudah jadi akhi! Scroll bawah untuk download");
      };

      recorder.start();
      video.currentTime = 0;
      await video.play();

      const draw = () => {
        if (video.paused || video.ended) { recorder.stop(); return; }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Kotak hitam untuk subtitle
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, canvas.height - 120, canvas.width, 120);
        // Teks putih
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        const lines = text.substring(0, 80).split('\n');
        lines.slice(0,3).forEach((line, i) => {
          ctx.fillText(line.substring(0, 50), canvas.width/2, canvas.height - 80 + (i*25));
        });
        requestAnimationFrame(draw);
      };
      draw();

      setTimeout(() => { if (!video.ended) { video.pause(); recorder.stop(); } }, 15000); // Max 15 detik untuk Reels/Shorts

    } catch (e) { setBurning(false); alert("Error: " + e); }
  };

  return (
    <div className="mt-6 p-4 bg-green-50 border-[3px] border-green-600 rounded-xl shadow-lg">
      <h3 className="font-black text-green-800 text-base mb-1">✨ AUTO SUBTITLE - SIAP UPLOAD</h3>
      <p className="text-[11px] text-green-700 mb-3">Edit teks di bawah, lalu bakar ke video untuk YouTube Shorts & IG Reels</p>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-3 border-2 border-green-300 rounded-lg h-28 text-sm bg-white text-black"
        placeholder="Tulis subtitle kajian di sini akhi..."
      />

      <button
        onClick={burnSubtitleToVideo}
        disabled={burning}
        className="w-full mt-3 py-3 bg-green-600 text-white rounded-xl font-black hover:bg-green-700 disabled:bg-gray-400"
      >
        {burning ? "⏳ Sedang Membakar Subtitle..." : "🔥 Bakar Subtitle Ke Video (Untuk YT & IG)"}
      </button>

      {videoUrl && (
        <div className="mt-4 p-3 bg-white rounded-lg border-2 border-green-500">
          <p className="font-bold text-green-800 text-sm mb-2">✅ Video dengan Subtitle Sudah Jadi!</p>
          <video src={videoUrl} controls className="w-full rounded-lg mb-2" />
          <a href={videoUrl} download="kajian-subtitle.webm" className="block w-full text-center py-2 bg-blue-600 text-white rounded-lg font-bold">⬇️ Download Video Subtitle (Siap Upload IG/YT)</a>
          <p className="text-[10px] text-gray-500 mt-2">*Video ini sudah ada teks di dalam nya, langsung upload ke YouTube Shorts & Instagram Reels akhi</p>
        </div>
      )}
    </div>
  );
}
