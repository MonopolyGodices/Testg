import React from 'react';
import { Download, Heart } from 'lucide-react';
import { useLanguage } from '../utils/i18n';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-right ltr:text-left">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary-600 text-white p-1 rounded-lg">
                <Download size={20} />
              </div>
              <span className="font-bold text-xl text-slate-800">{t.title}</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              {t.footerText}
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-4">{t.home}</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-primary-600 transition-colors">{t.home}</a></li>
              <li><a href="#features" className="hover:text-primary-600 transition-colors">{t.features}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">{t.legal}</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-primary-600 transition-colors">{t.contact}</a></li>
            </ul>
          </div>

           <div>
            <h4 className="font-bold text-slate-900 mb-4">{t.contact}</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>support@turbodwn.com</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} TurboDown. {t.rights}.
          </p>
          <div className="flex items-center gap-1 text-sm text-slate-400 mt-4 md:mt-0">
            <span>{t.poweredBy}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;