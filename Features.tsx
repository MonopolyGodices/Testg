import React from 'react';
import { Zap, Shield, Smartphone, Globe, Music, FileVideo } from 'lucide-react';
import { useLanguage } from '../utils/i18n';

const Features: React.FC = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: <Zap className="text-amber-500" size={32} />,
      title: t.f_speed,
      description: t.f_speed_desc
    },
    {
      icon: <Shield className="text-emerald-500" size={32} />,
      title: t.f_safe,
      description: t.f_safe_desc
    },
    {
      icon: <Smartphone className="text-blue-500" size={32} />,
      title: t.f_mobile,
      description: t.f_mobile_desc
    },
    {
      icon: <Globe className="text-indigo-500" size={32} />,
      title: t.heroTitle, // Reusing localized generic title or add new key
      description: t.a_2
    }
  ];

  return (
    <div id="features" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-bold text-primary-600 tracking-wide uppercase">TurboDown</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {t.heroSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-start p-8 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-slate-100">
              <div className="mb-4 bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;