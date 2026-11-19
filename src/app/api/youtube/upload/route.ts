import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

// Ini cuma bikin SESI upload, bukan upload file-nya
// Jadi Vercel gak keberatan walau 500MB
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, tags, privacyStatus, fileSize, fileType } = body;

    const clientId = body.clientId || process.env.YOUTUBE_CLIENT_ID || "";
    const clientSecret = body.clientSecret || process.env.YOUTUBE_CLIENT_SECRET || "";
    const refreshToken = body.refreshToken || process.env.YOUTUBE_REFRESH_TOKEN || "";

    if (!clientId || !clientSecret || !refreshToken) {
      return NextResponse.json({ success: false, error: "API belum diisi" }, { status: 400 });
    }

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    // Minta link resumable ke Google
    const youtube = google.youtube({ version: "v3", auth: oauth2Client });

    // Kita pakai fetch langsung ke Google biar dapat upload URL
    const accessToken = (await oauth2Client.getAccessToken()).token;

    const initRes = await fetch(
      "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Upload-Content-Length": String(fileSize),
          "X-Upload-Content-Type": fileType || "video/mp4",
        },
        body: JSON.stringify({
          snippet: {
            title: title || "Kajian Muslimah Cahaya Humaira",
            description: description || "",
            tags: tags ? tags.split(",").map((t: string) => t.trim()) : ["Cahaya Humaira", "Dakwah Muslimah"],
            categoryId: "27",
          },
          status: { privacyStatus: privacyStatus || "public", selfDeclaredMadeForKids: false },
        }),
      }
    );

    const uploadUrl = initRes.headers.get("location");
    if (!uploadUrl) {
      const errText = await initRes.text();
      return NextResponse.json({ success: false, error: "Gagal buat sesi upload: " + errText }, { status: 500 });
    }

    return NextResponse.json({ success: true, uploadUrl });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
