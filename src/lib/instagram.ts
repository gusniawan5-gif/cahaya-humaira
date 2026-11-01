import axios from "axios";

export interface InstagramPublishParams {
  accessToken: string;
  instagramBusinessId: string;
  videoUrl: string; // must be a publicly accessible URL for production IG Graph API
  caption: string;
  shareToFeed?: boolean;
}

export interface InstagramStepResult {
  step: 1 | 2 | 3;
  name: string;
  status: "success" | "error" | "processing";
  data?: any;
  error?: string;
}

const GRAPH_API_VERSION = "v21.0";
const GRAPH_BASE_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

/**
 * Step 1: Create IG Reels Media Container
 */
export async function createReelsContainer({
  accessToken,
  instagramBusinessId,
  videoUrl,
  caption,
  shareToFeed = true,
}: InstagramPublishParams): Promise<{ containerId: string }> {
  const url = `${GRAPH_BASE_URL}/${instagramBusinessId}/media`;

  const response = await axios.post(
    url,
    null,
    {
      params: {
        media_type: "REELS",
        video_url: videoUrl,
        caption: caption,
        share_to_feed: shareToFeed,
        access_token: accessToken,
      },
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (response.data && response.data.id) {
    return { containerId: response.data.id };
  }

  throw new Error("Gagal menginisiasi container media Instagram Reels.");
}

/**
 * Step 2: Check Processing Status of the Container
 */
export async function checkContainerStatus(
  containerId: string,
  accessToken: string,
  maxRetries = 15,
  delayMs = 3000
): Promise<{ status: "FINISHED" | "ERROR" | "EXPIRED" }> {
  const url = `${GRAPH_BASE_URL}/${containerId}`;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const response = await axios.get(url, {
      params: {
        fields: "status_code,status",
        access_token: accessToken,
      },
    });

    const statusCode = response.data?.status_code;

    if (statusCode === "FINISHED") {
      return { status: "FINISHED" };
    }

    if (statusCode === "ERROR" || statusCode === "EXPIRED") {
      throw new Error(`Pemrosesan video Instagram gagal dengan status: ${statusCode}`);
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  throw new Error("Waktu tunggu pemrosesan video Instagram habis (Timeout). Silakan coba lagi.");
}

/**
 * Step 3: Publish the Media Container
 */
export async function publishReelsContainer(
  containerId: string,
  instagramBusinessId: string,
  accessToken: string
): Promise<{ mediaId: string }> {
  const url = `${GRAPH_BASE_URL}/${instagramBusinessId}/media_publish`;

  const response = await axios.post(
    url,
    null,
    {
      params: {
        creation_id: containerId,
        access_token: accessToken,
      },
    }
  );

  if (response.data && response.data.id) {
    return { mediaId: response.data.id };
  }

  throw new Error("Gagal menerbitkan Instagram Reels.");
}

/**
 * Verify Instagram Business Account & Access Token
 */
export async function verifyInstagramCredentials(accessToken: string, igBusinessId: string) {
  const url = `${GRAPH_BASE_URL}/${igBusinessId}`;
  const response = await axios.get(url, {
    params: {
      fields: "id,username,name,profile_picture_url",
      access_token: accessToken,
    },
  });
  return response.data;
}
