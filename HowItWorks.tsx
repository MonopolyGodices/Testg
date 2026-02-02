import React from 'react';
import { useLanguage } from '../utils/i18n';

const HowItWorks: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    { num: "01", title: t.s_1_t, desc: t.s_1_d },
    { num: "02", title: t.s_2_t, desc: t.s_2_d },
    { num: "03", title: t.s_3_t, desc: t.s_3_d }
  ];

  return (
    <div id="how-it-works" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {t.howItWorks}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
              <div className="relative bg-slate-800 p-8 rounded-2xl border border-slate-700 h-full">
                <span className="text-6xl font-black text-slate-700 absolute top-4 left-4 opacity-50 select-none">
                  {step.num}
                </span>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4 text-primary-400">{step.title}</h3>
                  <p className="text-slate-300 leading-relaxed text-lg">
                    {step.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;