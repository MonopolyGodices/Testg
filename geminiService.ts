import { GoogleGenAI } from "@google/genai";
import { AnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeVideoLink = async (url: string, lang: 'ar' | 'en' = 'ar'): Promise<AnalysisResult> => {
  try {
    const languageName = lang === 'ar' ? 'Arabic' : 'English';
    const prompt = `
      Analyze the following URL text: "${url}".
      1. Identify the social media platform (YouTube, TikTok, Instagram, Facebook, X, etc.).
      2. Based ONLY on the URL structure and common trends for that platform, generate a short, fun, and witty prediction in ${languageName} about what the video might contain.
      3. Predict the "mood" of the video (e.g., Funny, Educational, Serious, Music) in ${languageName}.
      
      Return the result as a JSON object with keys: "platformGuess", "summary", "mood".
      Do not include markdown code blocks. Just the raw JSON string.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const json = JSON.parse(text);
    return {
      platformGuess: json.platformGuess || (lang === 'ar' ? "منصة تواصل" : "Social Platform"),
      summary: json.summary || (lang === 'ar' ? "فيديو رائع يستحق المشاهدة!" : "Great video worth watching!"),
      mood: json.mood || (lang === 'ar' ? "عام" : "General")
    };
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    // Fallback if AI fails
    return {
      platformGuess: lang === 'ar' ? "غير محدد" : "Unknown",
      summary: lang === 'ar' ? "جاري تجهيز الفيديو للتحميل..." : "Preparing video for download...",
      mood: lang === 'ar' ? "غير محدد" : "Unknown"
    };
  }
};