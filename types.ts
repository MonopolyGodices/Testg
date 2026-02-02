export interface VideoMetadata {
  title: string;
  thumbnail: string;
  duration?: string;
  platform: string;
  downloadUrl?: string; // Main download link
  author?: string;
  qualityOptions?: { label: string; url: string }[];
}

export interface AnalysisResult {
  summary: string;
  mood: string;
  platformGuess: string;
}

export enum Platform {
  YOUTUBE = 'YouTube',
  INSTAGRAM = 'Instagram',
  TIKTOK = 'TikTok',
  TWITTER = 'X (Twitter)',
  FACEBOOK = 'Facebook',
  UNKNOWN = 'Unknown'
}