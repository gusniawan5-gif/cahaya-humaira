import { NextRequest, NextResponse } from "next/server";
import { uploadVideoToYouTube } from "@/lib/youtube";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let title = "";
    let description = "";
    let tagsStr = "";
    let privacyStatus: "public" | "unlisted" | "private" = "public";
    let isShorts = false;
    let videoBuffer: Buffer | null = null;
    let simulate = false;

    let clientId = process.env.YOUTUBE_CLIENT_ID || "";
    let clientSecret = process.env.YOUTUBE_CLIENT_SECRET || "";
    let refreshToken = process.env.YOUTUBE_REFRESH_TOKEN || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      title = (formData.get("title") as string) || "Kajian Muslimah Cahaya Humaira";
      description = (formData.get("description") as string) || "";
      tagsStr = (formData.get("tags") as string) || "";
      privacyStatus = (formData.get("privacyStatus") as any) || "public";
      isShorts = formData.get("isShorts") === "true";
      simulate = formData.get("simulate") === "true";

      const file = formData.get("video") as File | null;
      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        videoBuffer = Buffer.from(arrayBuffer);
      }

      if (formData.get("clientId")) clientId = formData.get("clientId") as string;
      if (formData.get("clientSecret")) clientSecret = formData.get("clientSecret") as string;
      if (formData.get("refreshToken")) refreshToken = formData.get("refreshToken") as string;
    } else {
      const body = await req.json();
      title = body.title || "Kajian Muslimah Cahaya Humaira";
      description = body.description || "";
      tagsStr = body.tags || "";
      privacyStatus = body.privacyStatus || "public";
      isShorts = body.isShorts || false;
      simulate = body.simulate || false;
      if (body.clientId) clientId = body.clientId;
      if (body.clientSecret) clientSecret = body.clientSecret;
      if (body.refreshToken) refreshToken = body.refreshToken;
    }

    const tags = tagsStr
      ? tagsStr.split(",").map((t: string) => t.trim())
      : ["Cahaya Humaira", "Dakwah Muslimah", "Jambi Mengaji"];

    // Simulation / Sandbox Mode
    if (simulate || !clientId || !clientSecret || !refreshToken || !videoBuffer) {
      const dummyId = "CH_" + Math.random().toString(36).substring(2, 9);
      return NextResponse.json({
        success: true,
        isSimulation: true,
        videoId: dummyId,
        videoUrl: `https://youtube.com/${isShorts ? "shorts" : "watch?v="}${dummyId}`,
        isShorts,
        title,
        privacyStatus,
        message: isShorts
          ? "Video durasi < 60 detik berhasil disimulasikan sebagai YouTube Shorts!"
          : "Video berhasil disimulasikan terbit ke YouTube Channel!",
        notice:
          !clientId || !refreshToken
            ? "Mode Simulasi Aktif: Untuk upload langsung ke channel YouTube asli, silakan isi YouTube Client ID & Refresh Token di menu Pengaturan API."
            : undefined,
      });
    }

    // REAL YOUTUBE DATA API UPLOAD
    const uploadResult = await uploadVideoToYouTube({
      clientId,
      clientSecret,
      refreshToken,
      title,
      description,
      tags,
      privacyStatus,
      isShorts,
      videoBuffer,
    });

    return NextResponse.json({
      success: true,
      isSimulation: false,
      videoId: uploadResult.videoId,
      videoUrl: uploadResult.videoUrl,
      isShorts: uploadResult.isShorts,
      title,
    });
  } catch (error: any) {
    const errorMsg =
      error?.response?.data?.error?.message ||
      error?.message ||
      "Gagal mengunggah video ke YouTube.";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
