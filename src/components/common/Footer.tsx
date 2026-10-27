import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Sprout, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-neutral-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & mission */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#14532D] flex items-center justify-center text-white">
                <Sprout className="w-4 h-4 text-[#84CC16]" />
              </div>
              <span className="text-lg font-bold text-neutral-900 tracking-tight">AgriTech</span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {t.landing.footerTagline}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#2E7D32] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>ICAR Aligned Agricultural Protocols</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3">Farm Management</h4>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-[#14532D] transition-colors cursor-pointer">
                  Farmer Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('farms')} className="hover:text-[#14532D] transition-colors cursor-pointer">
                  Farm Plot Registry
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('crops')} className="hover:text-[#14532D] transition-colors cursor-pointer">
                  Crop Stage & Days Since Sowing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('weather')} className="hover:text-[#14532D] transition-colors cursor-pointer">
                  Micro-Climate Weather
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('soil')} className="hover:text-[#14532D] transition-colors cursor-pointer">
                  Soil N-P-K Health Cards
                </button>
              </li>
            </ul>
          </div>

          {/* Resources & Marketplace */}
          <div>
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3">Resources & Community</h4>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li>
                <button onClick={() => onNavigate('pests')} className="hover:text-[#14532D] transition-colors cursor-pointer">
                  Regional Pest & Disease Alerts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('market')} className="hover:text-[#14532D] transition-colors cursor-pointer">
                  Agricultural Supply Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('expert')} className="hover:text-[#14532D] transition-colors cursor-pointer">
                  Agronomist Consultation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('forum')} className="hover:text-[#14532D] transition-colors cursor-pointer">
                  Kisan Community Forum
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('docs')} className="hover:text-[#14532D] transition-colors cursor-pointer flex items-center gap-1">
                  <span>API Docs & Schemas</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </button>
              </li>
            </ul>
          </div>

          {/* Academic & Review Notes */}
          <div className="space-y-2 text-xs text-neutral-600 bg-[#F8F7F0] p-4 rounded-xl border border-neutral-200">
            <h4 className="font-bold text-neutral-900 text-xs">Project & Evaluation Info</h4>
            <p className="text-[11px] leading-relaxed text-neutral-600">
              AgriTech was developed as a comprehensive full-stack individual capstone. Features live Open-Meteo weather APIs, modular Express.js REST API with Mongoose schemas in <span className="font-mono">/backend</span>, and real-time client persistence.
            </p>
            <div className="pt-2 text-[10px] text-neutral-500 border-t border-neutral-200 flex items-center justify-between">
              <span>Stack: React 19 + Express</span>
              <span className="text-[#14532D] font-semibold">Ready for Review</span>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-200 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} AgriTech Smart Farming Management System. {t.landing.footerRights}
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Crafted for Indian farmers with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>and modern web standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
