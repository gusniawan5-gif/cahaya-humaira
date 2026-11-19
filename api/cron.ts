import { list, del } from '@vercel/blob';
import { google } from 'googleapis';

export default async function handler(req: any, res: any) {
  try {
    console.log("Robot Cahaya Humaira Jalan! Jam:", new Date().toISOString());

    // 1. Ambil daftar video dari Vercel Blob
    const { blobs } = await list({ prefix: 'videos/' });
    
    if (blobs.length === 0) {
      console.log("Tidak ada video di Blob");
      return res.status(200).json({ message: 'Tidak ada video, akhi. Upload lagi via website!' });
    }

    // Ambil video paling lama (antrian)
    const videoToUpload = blobs[0];
    console.log("Mau upload:", videoToUpload.pathname);

    // 2. Setup YouTube API
    const oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
    });

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    // 3. Download video dari Blob
    const videoResponse = await fetch(videoToUpload.url);
    const videoBuffer = await videoResponse.arrayBuffer();

    // 4. Buat judul Islami sesuai jam
    const hour = new Date().getHours();
    const isMorning = hour < 12;
    const judulPrefix = isMorning ? "Mutiara Dakwah Pagi - " : "Mutiara Dakwah Sore - ";
    
    const fileName = videoToUpload.pathname.replace('videos/', '').replace('.mp4','');
    
    // 5. Upload ke YouTube Cahaya Humaira
    const youtubeResponse = await youtube.videos.insert({
      part: ['snippet,status'],
      requestBody: {
        snippet: {
          title: `${judulPrefix}${fileName} | Cahaya Humaira`,
          description: `Bismillah. Video edukasi adab Islami .\n\nCahaya Humaira mengajarkan adab-adab harian sesuai sunnah.\n\nJangan lupa Subscribe, Like, dan Share untuk dakwah.\n\n#adabanakislam #cahayahumaira #edukasiislam #adabislam`,
          tags: ['cahaya humaira', 'adab islam', 'edukasi islam ', 'kartun islami'],
          categoryId: '27', // Education
        },
        status: {
          privacyStatus: 'public',
          selfDeclaredMadeForKids: true,
        },
      },
      media: {
        body: Buffer.from(videoBuffer) as any,
      },
    });

    console.log("Berhasil upload YouTube ID:", youtubeResponse.data.id);

    // 6. Hapus dari Vercel Blob biar hemat 500MB
    await del(videoToUpload.url);
    console.log("Dihapus dari Blob:", videoToUpload.url);

    return res.status(200).json({ 
      success: true, 
      youtubeId: youtubeResponse.data.id,
      message: `Alhamdulillah berhasil upload jam ${isMorning ? '5 Subuh' : '5 Sore'}` 
    });

  } catch (error: any) {
    console.error("Error Robot:", error);
    return res.status(500).json({ error: error.message });
  }
}
