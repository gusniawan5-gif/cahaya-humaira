"use client";
import React, { useState } from "react";

export default function AutoSubtitle({ videoFile }: { videoFile: File | null }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const generateSubtitle = async () => {
    if (!videoFile) {
      alert("Upload video kajian dulu akhi!");
      return;
    }
    setLoading(true);
    setText("");

    // Simulasi AI - Nanti bisa ganti pakai Whisper AI asli
    // Untuk sekarang, kita buat template dakwah biar langsung bisa dipakai
    setTimeout(() => {
      const fileName = videoFile.name.replace(/\.[^/.]+$/, "");
      const autoText = `Bismillah... Assalamualaikum warahmatullahi wabarakatuh.\n\nAlhamdulillah, pada kajian kali ini kita akan membahas ${fileName}.\n\nSemoga Allah mudahkan kita memahami ilmu ini dan mengamalkannya.\n\n[Subtitle otomatis - Cahaya Humaira]`;
      setText(autoText);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
      <h3 className="font-bold text-green-800 mb-2">✨ Fitur Baru - Auto Subtitle AI</h3>
      <p className="text-xs text-green-700 mb-3">Otomatis jadi teks di bawah video</p>
      
      <button
        onClick={generateSubtitle}
        disabled={loading || !videoFile}
        className="w-full py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-300"
      >
        {loading ? "⏳ Sedang membuat teks..." : "🎙️ Buat Teks Otomatis"}
      </button>

      {text && (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full mt-3 p-3 border rounded-lg h-32 text-sm"
          placeholder="Teks akan muncul di sini..."
        />
      )}
      {text && <p className="text-[11px] text-gray-500 mt-1">*Teks bisa diedit manual akhi, sebelum di-posting ke YouTube Shorts</p>}
    </div>
  );
}
