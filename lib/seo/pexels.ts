import { createClient } from "pexels";

const client = createClient(
  process.env.PEXELS_API_KEY || "YOUR_PEXELS_API_KEY"
);

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
}

export interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  url: string;
  image: string;
  duration: number;
  video_files: Array<{
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    link: string;
  }>;
  video_pictures: Array<{
    id: number;
    picture: string;
    nr: number;
  }>;
}

export async function getPexelsPhoto(
  query: string,
  orientation: "landscape" | "portrait" | "square" = "landscape"
): Promise<PexelsPhoto | null> {
  try {
    const date = new Date();
    const dayOfYear = Math.floor(
      (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
        86400000
    );
    const seed = dayOfYear % 100;

    const response = await client.photos.search({
      query,
      per_page: 1,
      page: (seed % 10) + 1,
      orientation,
    });

    if ("photos" in response && response.photos.length > 0) {
      return response.photos[0] as unknown as PexelsPhoto;
    }
    return null;
  } catch (error: any) {
    // Handle rate limiting and other errors gracefully
    if (error?.status === 429 || error?.message?.includes("Too Many Requests")) {
      console.warn("Pexels API rate limit reached, using fallback");
    } else {
      console.error("Error fetching Pexels photo:", error);
    }
    return null;
  }
}

export async function getPexelsPhotos(
  query: string,
  count: number = 6,
  orientation: "landscape" | "portrait" | "square" = "landscape"
): Promise<PexelsPhoto[]> {
  try {
    const date = new Date();
    const dayOfYear = Math.floor(
      (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
        86400000
    );
    const seed = dayOfYear % 100;

    const response = await client.photos.search({
      query,
      per_page: count,
      page: (seed % 10) + 1,
      orientation,
    });

    if ("photos" in response && response.photos.length > 0) {
      return response.photos as unknown as PexelsPhoto[];
    }
    return [];
  } catch (error: any) {
    // Handle rate limiting and other errors gracefully
    if (error?.status === 429 || error?.message?.includes("Too Many Requests")) {
      console.warn("Pexels API rate limit reached, using fallback");
    } else {
      console.error("Error fetching Pexels photos:", error);
    }
    return [];
  }
}

export async function getPexelsVideo(
  query: string
): Promise<PexelsVideo | null> {
  try {
    const date = new Date();
    const dayOfYear = Math.floor(
      (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
        86400000
    );
    const seed = dayOfYear % 100;

    const response = await client.videos.search({
      query,
      per_page: 1,
      page: (seed % 10) + 1,
    });

    if ("videos" in response && response.videos.length > 0) {
      return response.videos[0] as unknown as PexelsVideo;
    }
    return null;
  } catch (error) {
    console.error("Error fetching Pexels video:", error);
    return null;
  }
}

