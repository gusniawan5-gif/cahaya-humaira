import { list, del } from '@vercel/blob';
import { google } from 'googleapis';

export default async function handler(req: any, res: any) {
  try {
    console.log("Robot Cahaya Humaira Jalan! Jam:", new Date().toISOString());

    // 1. Ambil daftar video dari Vercel Blob
    const { blobs } = await list({ prefix: 'videos/' });
    
    if (blobs.length === 0) {
      return res.status(200).json({ message: 'Tidak ada video di Blob, upload lagi via website ya akhi!' });
    }

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

    // 4. JUDUL DARI NAMA FILE - SESUAI DAKWAH ANTUM
    const fileName = videoToUpload.pathname.replace('videos/', '').replace('.mp4','');
    const cleanTitle = fileName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Jadi Title Case
    
    // 5. Upload ke YouTube
    const youtubeResponse = await youtube.videos.insert({
      part: ['snippet,status'],
      requestBody: {
        snippet: {
          title: `${cleanTitle} | Cahaya Humaira`,
          description: `Bismillah.\n\n${cleanTitle} - Kajian Dakwah Islam.\n\nSemoga bermanfaat untuk kita semua. Jangan lupa Subscribe channel Cahaya Humaira untuk dakwah harian jam 5 pagi & 5 sore.\n\nBarakallahu fiikum.\n\n#CahayaHumaira #Dakwah #Adab #Akhlak #KajianIslam`,
          tags: ['cahaya humaira', 'dakwah islam', 'adab', 'akhlak', 'kajian islam', 'ceramah'],
          categoryId: '22',
        },
        status: {
          privacyStatus: 'public',
        },
      },
      media: {
        body: Buffer.from(videoBuffer) as any,
      },
    });

    console.log("Berhasil upload YouTube ID:", youtubeResponse.data.id);

    // 6. Hapus dari Vercel Blob biar hemat
    await del(videoToUpload.url);

    return res.status(200).json({ 
      success: true, 
      youtubeId: youtubeResponse.data.id,
      title: cleanTitle
    });

  } catch (error: any) {
    console.error("Error Robot:", error);
    return res.status(500).json({ error: error.message });
  }
}
