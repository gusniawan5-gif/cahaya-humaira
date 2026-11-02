"use client";
import { useState, useRef } from "react";

export default function YouTubePoster({ videoFile, onPublished }: any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtitleText, setSubtitleText] = useState("Larangan Mengucapkan Salam Dengan Isyarat Tangan");
  const [subtitleStyle, setSubtitleStyle] = useState("tiktok");
  const [isGeneratingSubtitle, setIsGeneratingSubtitle] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // FITUR BARU: Auto Subtitle AI
  const handleAutoSubtitle = async () => {
    setIsGeneratingSubtitle(true);
    // Simulasi AI mendengar suara - nanti bisa sambung ke Whisper API
    setTimeout(() => {
      setSubtitleText("Bismillah... Larangan mengucapkan salam dengan isyarat tangan tanpa ucapan lisan...");
      setIsGeneratingSubtitle(false);
      alert("Alhamdulillah subtitle otomatis berhasil dibuat akhi!");
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* KIRI - VIDEO EDITOR */}
      <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
        <h3 className="text-white font-bold mb-3">📹 Video Editor</h3>
        
        {videoFile && (
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            <video 
              ref={videoRef}
              src={URL.createObjectURL(videoFile)} 
              controls 
              className="w-full h-full"
            />
            {/* SUBTITLE OVERLAY - MUNCUL DI ATAS VIDEO */}
            <div className="absolute bottom-10 left-0 right-0 text-center px-2">
              <span className={`
                inline-block px-3 py-1 rounded font-black text-lg leading-tight
                ${subtitleStyle === 'tiktok' ? 'bg-white text-black text-xl' : ''}
                ${subtitleStyle === 'kajian' ? 'bg-yellow-400 text-black' : ''}
                ${subtitleStyle === 'bayangan' ? 'bg-black/70 text-white border border-white' : ''}
              `}>
                {subtitleText}
              </span>
            </div>
          </div>
        )}

        {/* FITUR BARU - PANEL SUBTITLE */}
        <div className="mt-4 p-3 bg-black rounded-xl border-2 border-green-600">
          <p className="text-sm text-green-400 font-bold mb-2">✨ Fitur Baru - Auto Subtitle AI</p>
          
          <button 
            onClick={handleAutoSubtitle}
            disabled={isGeneratingSubtitle}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-lg font-bold mb-3"
          >
            {isGeneratingSubtitle ? "⏳ AI Sedang Mendengar..." : "✨ Buat Subtitle Otomatis"}
          </button>

          <div className="flex gap-2 mb-3">
            <button onClick={() => setSubtitleStyle('tiktok')} className={`flex-1 py-2 rounded text-xs font-bold ${subtitleStyle==='tiktok' ? 'bg-white text-black' : 'bg-zinc-800 text-white'}`}>Gaya TikTok</button>
            <button onClick={() => setSubtitleStyle('kajian')} className={`flex-1 py-2 rounded text-xs font-bold ${subtitleStyle==='kajian' ? 'bg-yellow-400 text-black' : 'bg-zinc-800 text-white'}`}>Gaya Kajian</button>
            <button onClick={() => setSubtitleStyle('bayangan')} className={`flex-1 py-2 rounded text-xs font-bold ${subtitleStyle==='bayangan' ? 'bg-black text-white border' : 'bg-zinc-800 text-white'}`}>Bayangan</button>
          </div>

          <textarea 
            value={subtitleText}
            onChange={(e) => setSubtitleText(e.target.value)}
            placeholder="Edit subtitle disini akhi..."
            className="w-full p-2 bg-zinc-800 text-white rounded text-sm border border-zinc-700"
            rows={3}
          />
          <p className="text-[10px] text-zinc-400 mt-1">* Subtitle akan otomatis nempel di video Reels 1080x1920</p>
        </div>

        <button className="w-full mt-4 bg-zinc-800 text-white py-2 rounded-lg text-sm">Ambil Frame Ini Jadi Thumbnail 1080x1920</button>
      </div>

      {/* KANAN - FORM POSTING */}
      <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
        <h3 className="text-white font-bold mb-3">📝 Judul & Deskripsi</h3>
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Judul kajian..." className="w-full p-3 bg-black text-white rounded-lg border border-zinc-700 mb-3" />
        <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Deskripsi..." className="w-full p-3 bg-black text-white rounded-lg border border-zinc-700 h-32 mb-3" />
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-lg font-bold">Ke Instagram Reels</button>
          <button className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-bold">Ke YouTube Shorts</button>
        </div>
      </div>
    </div>
  );
}
