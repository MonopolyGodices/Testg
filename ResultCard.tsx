import React from 'react';
import { AnalysisResult, VideoMetadata } from '../types';
import { Download, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../utils/i18n';

interface ResultCardProps {
  metadata: VideoMetadata;
  analysis: AnalysisResult | null;
  onReset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ metadata, analysis, onReset }) => {
  const { t } = useLanguage();

  // Normalize options to ensure we always have a list to map
  const options = metadata.qualityOptions && metadata.qualityOptions.length > 0 
    ? metadata.qualityOptions 
    : (metadata.downloadUrl ? [{ label: t.downloadHD, url: metadata.downloadUrl }] : []);

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 animate-fade-in-up text-right ltr:text-left">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 ring-4 ring-slate-900/5">
        <div className="md:flex h-full">
          {/* Thumbnail Section */}
          <div className="md:w-5/12 relative bg-slate-900 group md:h-auto min-h-[250px]">
            <img 
              src={metadata.thumbnail} 
              alt={metadata.title} 
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity absolute inset-0"
            />
            {/* Overlay Gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            
            {metadata.duration && (
              <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-md border border-white/10 z-10">
                {metadata.duration}
              </div>
            )}
            <div className="absolute bottom-3 left-3 z-10">
               <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-primary-600 text-white shadow-lg">
                  {metadata.platform}
               </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8 md:w-7/12 flex flex-col justify-center bg-white">
            
            <div className="flex items-center gap-2 mb-4 text-emerald-600 font-medium text-sm bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100">
               <CheckCircle2 size={16} />
               <span>{t.foundSuccess}</span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 leading-tight line-clamp-2">
              {metadata.title}
            </h3>
            {metadata.author && (
               <p className="text-sm text-slate-500 mb-6 font-medium">@{metadata.author}</p>
            )}

            {/* AI Insight Section */}
            {analysis && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100 mb-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-200/40 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-indigo-300/50 transition-colors"></div>
                <div className="flex items-start gap-3 relative z-10">
                  <div className="bg-white p-1.5 rounded-lg shadow-sm">
                     <Sparkles className="text-indigo-600" size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wide mb-1">{t.aiAnalysis}</h4>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                      "{analysis.summary}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3 mt-4">
              {options.length > 0 ? (
                <div className="grid grid-cols-1 gap-2.5">
                   {options.slice(0, 3).map((option, idx) => (
                      <a 
                        key={idx}
                        href={option.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group flex items-center justify-between w-full font-bold py-3.5 px-6 rounded-xl transition-all shadow-xl hover:-translate-y-0.5 ${idx === 0 ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-600/20' : 'bg-slate-800 hover:bg-slate-900 text-white shadow-slate-900/10'}`}
                      >
                         <div className="flex items-center gap-3">
                            <Download size={20} className={idx === 0 ? "text-white" : "text-slate-400 group-hover:text-white transition-colors"} />
                            <span>{option.label || t.downloadHD}</span>
                         </div>
                      </a>
                   ))}
                </div>
              ) : (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center border border-red-100">
                    لم يتم العثور على روابط تحميل صالحة
                </div>
              )}
              
              <button 
                onClick={onReset}
                className="w-full text-center text-sm font-medium text-slate-500 hover:text-slate-800 py-2 transition-colors"
              >
                {t.downloadOther}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;