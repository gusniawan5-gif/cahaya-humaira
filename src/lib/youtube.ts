import { google } from "googleapis";
import { Readable } from "stream";

export interface YouTubeUploadParams {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  title: string;
  description: string;
  tags?: string[];
  privacyStatus?: "public" | "unlisted" | "private";
  isShorts?: boolean;
  videoBuffer?: Buffer;
  videoStream?: Readable;
}

export function getYouTubeOAuth2Client(
  clientId: string,
  clientSecret: string,
  redirectUri = "http://localhost:3000/api/youtube/callback"
) {
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function generateYouTubeAuthUrl(clientId: string, clientSecret: string, redirectUri?: string) {
  const oauth2Client = getYouTubeOAuth2Client(clientId, clientSecret, redirectUri);
  const scopes = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.readonly",
  ];

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });
}

/**
 * Upload Video or Shorts to YouTube Data API v3
 */
export async function uploadVideoToYouTube({
  clientId,
  clientSecret,
  refreshToken,
  title,
  description,
  tags = ["CahayaHumaira", "DakwahMuslimah", "Shorts"],
  privacyStatus = "public",
  isShorts = false,
  videoBuffer,
  videoStream,
}: YouTubeUploadParams) {
  const oauth2Client = getYouTubeOAuth2Client(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const youtube = google.youtube({
    version: "v3",
    auth: oauth2Client,
  });

  // Ensure #Shorts tag in title/description if < 60s
  let finalTitle = title;
  let finalDescription = description;
  let finalTags = [...tags];

  if (isShorts) {
    if (!finalTitle.includes("#Shorts") && !finalTitle.includes("#shorts")) {
      finalTitle = `${finalTitle} #Shorts`;
    }
    if (!finalDescription.includes("#Shorts")) {
      finalDescription = `${finalDescription}\n\n#Shorts #YouTubeShorts #CahayaHumaira`;
    }
    if (!finalTags.includes("Shorts")) {
      finalTags.push("Shorts", "YouTubeShorts");
    }
  }

  // Use either stream or buffer converted to readable
  let mediaStream: Readable;
  if (videoStream) {
    mediaStream = videoStream;
  } else if (videoBuffer) {
    mediaStream = Readable.from(videoBuffer);
  } else {
    throw new Error("Data video (buffer/stream) diperlukan untuk upload ke YouTube.");
  }

  const response = await youtube.videos.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: {
        title: finalTitle.slice(0, 100), // Max 100 chars
        description: finalDescription,
        tags: finalTags,
        categoryId: "22", // People & Blogs
        defaultLanguage: "id",
        defaultAudioLanguage: "id",
      },
      status: {
        privacyStatus: privacyStatus,
        selfDeclaredMadeForKids: false,
      },
    },
    media: {
      body: mediaStream,
    },
  });

  return {
    videoId: response.data.id,
    videoUrl: `https://youtu.be/${response.data.id}`,
    isShorts,
    data: response.data,
  };
}
