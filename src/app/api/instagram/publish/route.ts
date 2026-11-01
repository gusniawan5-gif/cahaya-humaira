import { NextRequest, NextResponse } from "next/server";
import {
  createReelsContainer,
  checkContainerStatus,
  publishReelsContainer,
} from "@/lib/instagram";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      accessToken,
      instagramBusinessId,
      videoUrl,
      caption,
      shareToFeed = true,
      simulate = false,
    } = body;

    const token = accessToken || process.env.INSTAGRAM_ACCESS_TOKEN;
    const igId = instagramBusinessId || process.env.INSTAGRAM_BUSINESS_ID;

    // Simulation / Sandbox Demo Mode
    if (simulate || !token || !igId || !videoUrl || videoUrl.startsWith("blob:") || videoUrl.startsWith("data:")) {
      // If user is running locally with blob URL or simulation mode
      return NextResponse.json({
        success: true,
        isSimulation: true,
        steps: [
          {
            step: 1,
            title: "Inisiasi Container Reels",
            status: "success",
            message: `Container media Reels berhasil dibuat (ID dummy: 17894291823456789)`,
          },
          {
            step: 2,
            title: "Pengecekan Status Encoding Instagram",
            status: "success",
            message: "Status video: FINISHED (Siap dipublikasikan ke server IG)",
          },
          {
            step: 3,
            title: "Publikasi ke Akun @cahayahumaira",
            status: "success",
            message: "Reels berhasil dipublikasikan ke Instagram Feed & Reels! (ID: 180129384729182)",
          },
        ],
        mediaId: "180129384729182",
        permalink: "https://www.instagram.com/cahayahumaira/",
        notice:
          videoUrl && (videoUrl.startsWith("blob:") || videoUrl.startsWith("data:"))
            ? "Catatan: Instagram Graph API mewajibkan URL video dapat diakses publik oleh server Meta (misal: S3 / Cloudinary / Supabase Storage). Mode simulasi digunakan untuk pratinjau lokal."
            : undefined,
      });
    }

    // REAL INSTAGRAM GRAPH API EXECUTION:
    const logs = [];

    // Step 1: Inisiasi
    const containerResult = await createReelsContainer({
      accessToken: token,
      instagramBusinessId: igId,
      videoUrl,
      caption,
      shareToFeed,
    });
    logs.push({
      step: 1,
      title: "Inisiasi Container Reels",
      status: "success",
      message: `Container media dibuat dengan ID: ${containerResult.containerId}`,
    });

    // Step 2: Tunggu status FINISHED
    await checkContainerStatus(containerResult.containerId, token);
    logs.push({
      step: 2,
      title: "Pengecekan Status Encoding Instagram",
      status: "success",
      message: "Status video telah FINISHED dan siap dipublikasikan.",
    });

    // Step 3: Publish
    const publishResult = await publishReelsContainer(
      containerResult.containerId,
      igId,
      token
    );
    logs.push({
      step: 3,
      title: "Publikasi ke Akun @cahayahumaira",
      status: "success",
      message: `Berhasil terbit dengan Media ID: ${publishResult.mediaId}`,
    });

    return NextResponse.json({
      success: true,
      isSimulation: false,
      steps: logs,
      mediaId: publishResult.mediaId,
      permalink: `https://www.instagram.com/p/${publishResult.mediaId}`,
    });
  } catch (error: any) {
    const errorMsg =
      error?.response?.data?.error?.message ||
      error?.message ||
      "Gagal mempublikasikan ke Instagram Reels.";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
