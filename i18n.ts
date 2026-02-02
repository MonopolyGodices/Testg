import { useState, useEffect } from 'react';

type Lang = 'ar' | 'en';

const translations = {
  ar: {
    title: "TurboDown",
    heroTitle: "تحميل الفيديو من أي منصة",
    heroSubtitle: "بسرعة وذكاء",
    heroDesc: "أداة تحميل مجانية تدعم يوتيوب، انستقرام، تيك توك (بدون علامة مائية)، وغيرها. مدعومة بالذكاء الاصطناعي.",
    placeholder: "ألصق رابط الفيديو هنا (YouTube, TikTok...)",
    btnDownload: "تحميل",
    btnProcessing: "جاري المعالجة...",
    error: "حدث خطأ أثناء معالجة الرابط. يرجى التأكد من صحة الرابط والمحاولة مرة أخرى.",
    downloadHD: "تحميل الفيديو",
    downloadAudio: "تحميل صوت",
    downloadOther: "تحميل فيديو آخر",
    foundSuccess: "تم العثور عليه بنجاح",
    aiAnalysis: "تحليل الذكاء الاصطناعي",
    mood: "المود",
    features: "المميزات",
    howItWorks: "كيف يعمل؟",
    faq: "الأسئلة الشائعة",
    home: "الرئيسية",
    premium: "اشتراك بريميوم",
    footerText: "أفضل أداة لتحميل الفيديوهات عبر turbodwn.com",
    legal: "قانوني",
    contact: "تواصل معنا",
    rights: "جميع الحقوق محفوظة",
    f_speed: "سرعة فائقة",
    f_speed_desc: "محرك تحميل متطور يضمن لك أقصى سرعة ممكنة.",
    f_safe: "آمن ومحمي",
    f_safe_desc: "لا نحتفظ ببياناتك. خصوصيتك أولويتنا.",
    f_mobile: "متوافق مع الجوال",
    f_mobile_desc: "يعمل بامتياز على جميع الأجهزة.",
    s_1_t: "انسخ الرابط",
    s_1_d: "اذهب إلى الفيديو وانسخ الرابط.",
    s_2_t: "ألصق الرابط",
    s_2_d: "ضعه في خانة البحث بالأعلى.",
    s_3_t: "حمل",
    s_3_d: "اضغط تحميل واستمتع!",
    q_1: "هل الخدمة مجانية؟",
    a_1: "نعم، مجانية تماماً عبر TurboDown.",
    q_2: "ما هي المنصات؟",
    a_2: "تيك توك، يوتيوب، انستقرام، فيسبوك، والمزيد.",
    poweredBy: "مدعوم بـ VidSaver AI",
    // New Keys
    supports: "يدعم المنصات التالية والمزيد",
    mostSearched: "🔥 الأكثر بحثاً:",
    k_tiktok: "تحميل تيك توك بدون حقوق",
    k_youtube: "يوتيوب MP4",
    k_insta: "تحميل ستوري انستقرام",
    k_fb: "فيسبوك HD",
    k_twitter: "تنزيل فيديو تويتر"
  },
  en: {
    title: "TurboDown",
    heroTitle: "Download Video from Any Platform",
    heroSubtitle: "Fast & Smart",
    heroDesc: "Free downloader supporting YouTube, Instagram, TikTok (No Watermark), and more. AI Powered analysis included.",
    placeholder: "Paste video link here (YouTube, TikTok...)",
    btnDownload: "Download",
    btnProcessing: "Processing...",
    error: "Error processing link. Please check the URL and try again.",
    downloadHD: "Download Video",
    downloadAudio: "Download Audio",
    downloadOther: "Download Another Video",
    foundSuccess: "Found Successfully",
    aiAnalysis: "AI Analysis",
    mood: "Mood",
    features: "Features",
    howItWorks: "How it Works",
    faq: "FAQ",
    home: "Home",
    premium: "Go Premium",
    footerText: "Best video downloader tool via turbodwn.com",
    legal: "Legal",
    contact: "Contact",
    rights: "All rights reserved",
    f_speed: "Super Fast",
    f_speed_desc: "Advanced engine ensures maximum download speed.",
    f_safe: "Safe & Secure",
    f_safe_desc: "We don't store your data. Privacy is priority.",
    f_mobile: "Mobile Friendly",
    f_mobile_desc: "Works perfectly on all devices.",
    s_1_t: "Copy Link",
    s_1_d: "Go to the video and copy its link.",
    s_2_t: "Paste Link",
    s_2_d: "Paste it in the search box above.",
    s_3_t: "Download",
    s_3_d: "Click download and enjoy!",
    q_1: "Is it free?",
    a_1: "Yes, completely free via TurboDown.",
    q_2: "Supported Platforms?",
    a_2: "TikTok, YouTube, Instagram, Facebook, and more.",
    poweredBy: "Powered by VidSaver AI",
    // New Keys
    supports: "Supports the following platforms and more",
    mostSearched: "🔥 Trending:",
    k_tiktok: "TikTok No Watermark",
    k_youtube: "YouTube MP4",
    k_insta: "Instagram Story Saver",
    k_fb: "Facebook HD",
    k_twitter: "Twitter Video Download"
  }
};

export const useLanguage = () => {
  // Initialize state based on browser preference immediately (Lazy Initialization)
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language.split('-')[0];
      return browserLang === 'ar' ? 'ar' : 'en';
    }
    return 'ar';
  });

  useEffect(() => {
    // Sync document attributes with state
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  return {
    lang,
    t: translations[lang],
    isRTL: lang === 'ar'
  };
};