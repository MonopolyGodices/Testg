import React, { useState, useEffect } from 'react';
import { Menu, X, Download, Zap } from 'lucide-react';
import { useLanguage } from '../utils/i18n';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-dark-900/90 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-primary-500 to-purple-600 text-white p-2 rounded-xl shadow-lg shadow-primary-500/20">
              <Download size={24} />
            </div>
            <span className={`font-bold text-2xl tracking-tight ${scrolled ? 'text-white' : 'text-white'}`}>{t.title}</span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6 rtl:space-x-reverse ltr:space-x-6">
              <a href="#" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">{t.home}</a>
              <a href="#features" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">{t.features}</a>
              <a href="#how-it-works" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">{t.howItWorks}</a>
              <a href="#faq" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">{t.faq}</a>
            </div>
          </div>

          <div className="hidden md:block">
             <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 backdrop-blur-sm">
               <Zap size={16} className="text-yellow-400" />
               <span>{t.premium}</span>
             </button>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-white focus:outline-none transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-dark-800 border-t border-slate-700 absolute w-full left-0">
          <div className="px-4 pt-4 pb-6 space-y-2 text-right ltr:text-left">
            <a href="#" className="text-slate-300 hover:bg-slate-700 hover:text-white block px-3 py-3 rounded-lg text-base font-medium">{t.home}</a>
            <a href="#features" className="text-slate-300 hover:bg-slate-700 hover:text-white block px-3 py-3 rounded-lg text-base font-medium">{t.features}</a>
            <a href="#how-it-works" className="text-slate-300 hover:bg-slate-700 hover:text-white block px-3 py-3 rounded-lg text-base font-medium">{t.howItWorks}</a>
            <a href="#faq" className="text-slate-300 hover:bg-slate-700 hover:text-white block px-3 py-3 rounded-lg text-base font-medium">{t.faq}</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;