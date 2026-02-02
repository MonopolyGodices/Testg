import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Loader2, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { analyzeVideoLink } from '../services/geminiService';
import { fetchVideoData } from '../services/api';
import ResultCard from './ResultCard';
import { VideoMetadata, AnalysisResult } from '../types';
import { useLanguage } from '../utils/i18n';

// Platform Icons Components (SVGs)
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-10 md:h-10 text-white">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);
const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-10 md:h-10 text-red-500 bg-white rounded-full p-1">
    <path d="M21.58 5.4a2.83 2.83 0 0 0-2-2C17.84 3 12 3 12 3s-5.84 0-7.58.4a2.83 2.83 0 0 0-2 2A29.8 29.8 0 0 0 2 12a29.8 29.8 0 0 0 .42 6.6 2.83 2.83 0 0 0 2 2C5.16 21 12 21 12 21s5.84 0 7.58-.4a2.83 2.83 0 0 0 2-2A29.8 29.8 0 0 0 22 12a29.8 29.8 0 0 0-.42-6.6zM10 15V9l5.2 3-5.2 3z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-10 md:h-10 text-pink-500 bg-white rounded-lg p-1">
    <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-10 md:h-10 text-blue-600 bg-white rounded-full p-0.5">
    <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.15 5.96C15.21 5.96 16.12 6.04 16.12 6.04V8.51H15.01C13.77 8.51 13.38 9.28 13.38 10.07V12.06H16.16L15.72 14.96H13.38V21.96C18.16 21.21 21.82 17.06 21.82 12.06C21.82 6.53 17.32 2.04 12 2.04Z"/>
  </svg>
);
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-10 md:h-10 text-white p-1">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const Hero: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ metadata: VideoMetadata; analysis: AnalysisResult | null } | null>(null);
  
  const { t, lang, isRTL } = useLanguage();

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Parallel execution but prioritize showing video
      // Pass the current language to ensure responses match UI
      const metadataPromise = fetchVideoData(url, lang);
      const analysisPromise = analyzeVideoLink(url, lang).catch(() => null);

      const metadata = await metadataPromise;
      const analysis = await analysisPromise;

      setResult({ metadata, analysis });
    } catch (err: any) {
      console.error(err);
      setError(err.message || t.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUrl('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-dark-900 via-dark-800 to-slate-50 min-h-[90vh]">
      {/* Abstract Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary-600/20 rounded-full blur-3xl opacity-60"></div>
         <div className="absolute top-[20%] right-[0%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center">
        
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-tight drop-shadow-sm">
          {t.heroTitle}
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">
            {t.heroSubtitle}
          </span>
        </h1>
        
        <p className="mt-6 max-w-2xl mx-auto text-xl text-slate-300 mb-12 leading-relaxed">
          {t.heroDesc}
        </p>

        {!result ? (
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <form onSubmit={handleDownload} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-purple-500 to-primary-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500 animate-gradient-x"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl flex items-center p-2">
                <div className="hidden sm:flex items-center justify-center w-14 h-14 text-slate-400">
                  <LinkIcon size={24} />
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={t.placeholder}
                  className="flex-1 w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder-slate-400 text-lg md:text-xl px-4 h-16"
                />
                <button
                  type="submit"
                  disabled={isLoading || !url}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold h-16 px-10 rounded-xl transition-all shadow-lg shadow-primary-600/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-3 min-w-[160px] justify-center text-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      <span>{t.btnProcessing}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.btnDownload}</span>
                      {isRTL ? <ArrowLeft size={24} /> : <ArrowRight size={24} />}
                    </>
                  )}
                </button>
              </div>
            </form>
            
            {error && (
              <div className="mt-6 p-4 bg-red-500/10 backdrop-blur-md text-red-200 border border-red-500/30 rounded-xl flex items-center gap-3 justify-center max-w-2xl mx-auto">
                <AlertTriangle size={20} className="text-red-400" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Platform Icons */}
            <div className="mt-16">
               <p className="text-slate-400 text-sm font-medium mb-6 uppercase tracking-wider">{t.supports}</p>
               <div className="flex flex-wrap justify-center gap-6 md:gap-10 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                  <div className="flex flex-col items-center gap-2 group cursor-pointer transition-transform hover:-translate-y-1">
                     <YouTubeIcon />
                     <span className="text-xs text-slate-400 group-hover:text-white transition-colors">YouTube</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 group cursor-pointer transition-transform hover:-translate-y-1">
                     <TikTokIcon />
                     <span className="text-xs text-slate-400 group-hover:text-white transition-colors">TikTok</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 group cursor-pointer transition-transform hover:-translate-y-1">
                     <InstagramIcon />
                     <span className="text-xs text-slate-400 group-hover:text-white transition-colors">Instagram</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 group cursor-pointer transition-transform hover:-translate-y-1">
                     <FacebookIcon />
                     <span className="text-xs text-slate-400 group-hover:text-white transition-colors">Facebook</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 group cursor-pointer transition-transform hover:-translate-y-1">
                     <TwitterIcon />
                     <span className="text-xs text-slate-400 group-hover:text-white transition-colors">X / Twitter</span>
                  </div>
               </div>
            </div>

            {/* SEO Keywords Block */}
            <div className="mt-16 border-t border-white/5 pt-8 max-w-3xl mx-auto">
                <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-500">
                    <span>{t.mostSearched}</span>
                    <span className="hover:text-primary-400 cursor-pointer transition-colors">{t.k_tiktok}</span>
                    <span className="text-slate-700">•</span>
                    <span className="hover:text-primary-400 cursor-pointer transition-colors">{t.k_youtube}</span>
                    <span className="text-slate-700">•</span>
                    <span className="hover:text-primary-400 cursor-pointer transition-colors">{t.k_insta}</span>
                    <span className="text-slate-700">•</span>
                    <span className="hover:text-primary-400 cursor-pointer transition-colors">{t.k_fb}</span>
                    <span className="text-slate-700">•</span>
                    <span className="hover:text-primary-400 cursor-pointer transition-colors">{t.k_twitter}</span>
                </div>
            </div>

          </div>
        ) : (
          <ResultCard 
            metadata={result.metadata} 
            analysis={result.analysis} 
            onReset={handleReset} 
          />
        )}
      </div>
    </div>
  );
};

export default Hero;