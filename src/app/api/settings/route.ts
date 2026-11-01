import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ENV_LOCAL_PATH = path.join(process.cwd(), ".env.local");

export async function GET() {
  try {
    let envContent = "";
    if (fs.existsSync(ENV_LOCAL_PATH)) {
      envContent = fs.readFileSync(ENV_LOCAL_PATH, "utf-8");
    }

    const parseEnv = (key: string): string => {
      const regex = new RegExp(`^${key}=(.*)$`, "m");
      const match = envContent.match(regex);
      return match ? match[1].trim() : process.env[key] || "";
    };

    return NextResponse.json({
      instagramAccessToken: parseEnv("INSTAGRAM_ACCESS_TOKEN"),
      instagramBusinessId: parseEnv("INSTAGRAM_BUSINESS_ID"),
      facebookPageId: parseEnv("FACEBOOK_PAGE_ID"),
      youtubeApiKey: parseEnv("YOUTUBE_API_KEY"),
      youtubeClientId: parseEnv("YOUTUBE_CLIENT_ID"),
      youtubeClientSecret: parseEnv("YOUTUBE_CLIENT_SECRET"),
      youtubeRefreshToken: parseEnv("YOUTUBE_REFRESH_TOKEN"),
      geminiApiKey: parseEnv("GEMINI_API_KEY"),
      exists: fs.existsSync(ENV_LOCAL_PATH),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const envLines = [
      `# Cahaya Humaira Auto Dakwah Video Environment Configurations`,
      `# Updated at: ${new Date().toISOString()}`,
      ``,
      `# --- INSTAGRAM GRAPH API ---`,
      `INSTAGRAM_ACCESS_TOKEN=${data.instagramAccessToken || ""}`,
      `INSTAGRAM_BUSINESS_ID=${data.instagramBusinessId || ""}`,
      `FACEBOOK_PAGE_ID=${data.facebookPageId || ""}`,
      ``,
      `# --- YOUTUBE DATA API V3 ---`,
      `YOUTUBE_API_KEY=${data.youtubeApiKey || ""}`,
      `YOUTUBE_CLIENT_ID=${data.youtubeClientId || ""}`,
      `YOUTUBE_CLIENT_SECRET=${data.youtubeClientSecret || ""}`,
      `YOUTUBE_REFRESH_TOKEN=${data.youtubeRefreshToken || ""}`,
      ``,
      `# --- GOOGLE GEMINI AI (OPTIONAL) ---`,
      `GEMINI_API_KEY=${data.geminiApiKey || ""}`,
      ``,
    ].join("\n");

    fs.writeFileSync(ENV_LOCAL_PATH, envLines, "utf-8");

    // Also update current process.env
    if (data.instagramAccessToken) process.env.INSTAGRAM_ACCESS_TOKEN = data.instagramAccessToken;
    if (data.instagramBusinessId) process.env.INSTAGRAM_BUSINESS_ID = data.instagramBusinessId;
    if (data.facebookPageId) process.env.FACEBOOK_PAGE_ID = data.facebookPageId;
    if (data.youtubeApiKey) process.env.YOUTUBE_API_KEY = data.youtubeApiKey;
    if (data.youtubeClientId) process.env.YOUTUBE_CLIENT_ID = data.youtubeClientId;
    if (data.youtubeClientSecret) process.env.YOUTUBE_CLIENT_SECRET = data.youtubeClientSecret;
    if (data.youtubeRefreshToken) process.env.YOUTUBE_REFRESH_TOKEN = data.youtubeRefreshToken;
    if (data.geminiApiKey) process.env.GEMINI_API_KEY = data.geminiApiKey;

    return NextResponse.json({
      success: true,
      message: "Pengaturan API berhasil disimpan ke file .env.local dengan aman!",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Gagal menyimpan konfigurasi" },
      { status: 500 }
    );
  }
}
