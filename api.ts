import { VideoMetadata } from '../types';

const MY_SERVER_API = "https://turbo-saver-api.onrender.com/direct?url=";
const TIKTOK_FREE_API = "https://www.tikwm.com/api/?url=";

const COBALT_INSTANCES = [
    "https://api.cobalt.tools/api/json",
    "https://co.wuk.sh/api/json",
    "https://cobalt.xy24.eu.org/api/json",
    "https://cobalt.api.kwiatekmiki.pl/api/json",
    "https://cobalt.rennel.org/api/json",
    "https://cobalt.save.staff.com.bd/api/json",
    "https://api.server.cobalt.tools/api/json",
    "https://cobalt.root.sx/api/json",
    "https://cobalt.ducks.party/api/json",
    "https://cobalt.e-z.host/api/json",
    "https://cobalt.tools/api/json"
];

const getShuffledInstances = () => {
    const array = [...COBALT_INSTANCES];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// Helper for labels
const getLabels = (lang: 'ar' | 'en') => ({
    downloadVideo: lang === 'ar' ? "تحميل الفيديو (MP4)" : "Download Video (MP4)",
    downloadAudio: lang === 'ar' ? "تحميل صوت (MP3)" : "Download Audio (MP3)",
    download: lang === 'ar' ? "تحميل" : "Download",
    noWatermark: lang === 'ar' ? "بدون علامة مائية (HD)" : "No Watermark (HD)",
    original: lang === 'ar' ? "الأصلي (مع علامة)" : "Original (Watermarked)",
    audioOnly: lang === 'ar' ? "صوت فقط (MP3)" : "Audio Only (MP3)",
    video: lang === 'ar' ? "فيديو" : "Video",
    photo: lang === 'ar' ? "صورة" : "Photo",
    serverError: lang === 'ar' ? "عذراً، لم نتمكن من جلب الفيديو. تأكد أن الرابط صحيح وأن الحساب عام." : "Sorry, could not fetch video. Check link and ensure account is public.",
    networkError: lang === 'ar' ? "خطأ في الشبكة" : "Network Error",
    noLink: lang === 'ar' ? "لم يتم العثور على رابط تحميل" : "No download link found"
});

export const fetchVideoData = async (url: string, lang: 'ar' | 'en' = 'ar'): Promise<VideoMetadata> => {
  const isTikTok = url.includes('tiktok.com');
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  const isInstagram = url.includes('instagram.com');
  const isTwitter = url.includes('x.com') || url.includes('twitter.com');
  const isFacebook = url.includes('facebook.com') || url.includes('fb.watch');
  
  const labels = getLabels(lang);

  try {
      if (isTikTok) {
        return await fetchTikTokData(url, lang);
      } else {
        try {
            return await fetchGeneralData(url, lang);
        } catch (e) {
            console.warn("Main server failed, trying Cobalt fallback...", e);
            const platformName = isYouTube ? 'YouTube' : isInstagram ? 'Instagram' : isTwitter ? 'X (Twitter)' : isFacebook ? 'Facebook' : 'Web';
            return await fetchCobaltData(url, platformName, lang);
        }
      }
  } catch (error: any) {
      console.error("Final Fetch Error:", error);
      throw new Error(labels.serverError);
  }
};

const fetchWithFallbacks = async (targetUrl: string): Promise<any> => {
    try {
        const response = await fetch(targetUrl);
        if (response.ok) return await response.json();
    } catch (e) { /* ignore */ }

    try {
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
        const response = await fetch(proxyUrl);
        if (response.ok) return await response.json();
    } catch (e) { /* ignore */ }

    throw new Error("Network Error");
}

const fetchCobaltData = async (url: string, platform: string, lang: 'ar' | 'en'): Promise<VideoMetadata> => {
    const labels = getLabels(lang);
    let thumbnail = "https://placehold.co/600x400?text=Video";
    
    if (platform === 'YouTube') {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) thumbnail = `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
    }

    const instances = getShuffledInstances();

    for (const apiBase of instances) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 12000);

            const res = await fetch(apiBase, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json' 
                },
                body: JSON.stringify({ 
                    url, 
                    vQuality: '720', 
                    filenamePattern: 'basic'
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                
                if (data.status === 'stream' || data.status === 'redirect' || (data.url && !data.picker)) {
                     return {
                        title: data.filename || `${platform} Video`,
                        thumbnail: thumbnail, 
                        platform: platform,
                        downloadUrl: data.url,
                        qualityOptions: [{ label: labels.downloadVideo, url: data.url }]
                    };
                } else if (data.status === 'picker' && data.picker) {
                     const usefulPicks = data.picker.filter((p:any) => p.url);
                     if (usefulPicks.length === 0) continue;

                     const bestPick = usefulPicks.find((p:any) => p.type === 'video') || usefulPicks[0];
                     
                     return {
                        title: `${platform} Video`,
                        thumbnail: bestPick.thumb || thumbnail,
                        platform: platform,
                        downloadUrl: bestPick.url,
                        qualityOptions: usefulPicks.map((p: any) => ({
                            label: `${labels.download} ${p.type === 'photo' ? labels.photo : labels.video}`, 
                            url: p.url 
                        }))
                    };
                }
            }
        } catch (e) {
            console.warn(`Cobalt instance ${apiBase} failed:`, e);
        }
    }
    
    throw new Error("All generic fallbacks failed");
};

const fetchTikTokData = async (url: string, lang: 'ar' | 'en'): Promise<VideoMetadata> => {
  const targetUrl = `${TIKTOK_FREE_API}${encodeURIComponent(url)}`;
  try {
    const data = await fetchWithFallbacks(targetUrl);
    if (data.code === 0 && data.data) return mapTikTokData(data.data, lang);
  } catch (e) {
      console.warn("TikWM failed, trying Cobalt for TikTok...");
  }
  return await fetchCobaltData(url, 'TikTok', lang);
};

const mapTikTokData = (d: any, lang: 'ar' | 'en'): VideoMetadata => {
  const labels = getLabels(lang);
  return {
    title: d.title || "TikTok Video",
    thumbnail: d.cover || d.origin_cover,
    platform: "TikTok",
    downloadUrl: d.play, 
    author: d.author?.nickname,
    duration: d.duration ? `${d.duration}s` : undefined,
    qualityOptions: [
      { label: labels.noWatermark, url: d.play },
      { label: labels.original, url: d.wmplay },
      { label: labels.audioOnly, url: d.music }
    ]
  };
};

const fetchGeneralData = async (url: string, lang: 'ar' | 'en'): Promise<VideoMetadata> => {
  const targetUrl = `${MY_SERVER_API}${encodeURIComponent(url)}`;
  const data = await fetchWithFallbacks(targetUrl);
  
  if (data.status === 'error') throw new Error(data.message || "Server Error");
  return mapGeneralData(data, url, lang);
};

const mapGeneralData = (data: any, originalUrl: string, lang: 'ar' | 'en'): VideoMetadata => {
  const labels = getLabels(lang);
  const title = data.title || data.text || "Video";
  const thumbnail = data.thumbnail || data.image || data.picture || "https://placehold.co/600x400?text=No+Thumbnail";
  const downloadUrl = data.video_url || data.url || data.link;
  
  let qualityOptions: { label: string; url: string }[] = [];
  
  if (data.video_url) qualityOptions.push({ label: labels.downloadVideo, url: data.video_url });
  if (data.audio_url && data.audio_url !== data.video_url) qualityOptions.push({ label: labels.downloadAudio, url: data.audio_url });

  if (qualityOptions.length === 0 && Array.isArray(data.links)) {
      qualityOptions = data.links.map((l: any) => ({
        label: l.quality || l.format || labels.download,
        url: l.url || l.link
      }));
  }

  if (qualityOptions.length === 0 && downloadUrl) {
      qualityOptions = [{ label: labels.download, url: downloadUrl }];
  }

  if (!downloadUrl && qualityOptions.length === 0) {
      throw new Error(labels.noLink);
  }

  return {
    title,
    thumbnail,
    platform: identifyPlatform(originalUrl),
    downloadUrl,
    qualityOptions: qualityOptions.length > 0 ? qualityOptions : undefined
  };
};

const identifyPlatform = (url: string): string => {
  if (url.includes('youtube') || url.includes('youtu.be')) return 'YouTube';
  if (url.includes('facebook') || url.includes('fb.watch')) return 'Facebook';
  if (url.includes('instagram')) return 'Instagram';
  if (url.includes('twitter') || url.includes('x.com')) return 'X (Twitter)';
  if (url.includes('tiktok')) return 'TikTok';
  return 'Web';
};