import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ASSET_IMAGES } from '../assets/images';
import { 
  CloudSun, FlaskConical, Wheat, AlertTriangle, 
  ArrowRight, ShieldCheck, Droplets, Leaf, CheckCircle2, ChevronRight 
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { switchDemoAccount } = useAuth();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-[#14532D] rounded-full text-xs font-semibold tracking-wide border border-emerald-200">
                <Leaf className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>Next-Generation Indian Precision Agriculture</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-900 tracking-tight leading-[1.1] text-balance">
                Grow Smarter. <br />
                <span className="text-[#14532D]">Farm Better.</span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 max-w-2xl leading-relaxed">
                {t.appSubhead}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-6 py-3.5 bg-[#14532D] text-white text-sm font-bold rounded-lg hover:bg-[#0f3e22] transition-colors shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>{t.landing.getStarted}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#features"
                  className="px-6 py-3.5 bg-neutral-100 text-neutral-800 text-sm font-semibold rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  {t.landing.exploreFeatures}
                </a>

                {/* Quick 1-Click Mentor Access */}
                <button
                  onClick={() => {
                    switchDemoAccount('usr-farmer-1');
                    onNavigate('dashboard');
                  }}
                  className="px-4 py-2 border border-emerald-300 bg-emerald-50/70 text-[#14532D] text-xs font-semibold rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>{t.landing.viewDemoFarmer}</span>
                </button>
              </div>

              {/* Adjacency Proof Strip */}
              <div className="pt-8 border-t border-neutral-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <div className="text-2xl font-extrabold text-neutral-900 tabular-nums">
                    {t.landing.kpiFarmers}
                  </div>
                  <div className="text-xs text-neutral-500 font-medium">
                    {t.landing.kpiFarmersLabel}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-neutral-900 tabular-nums">
                    {t.landing.kpiAcres}
                  </div>
                  <div className="text-xs text-neutral-500 font-medium">
                    {t.landing.kpiAcresLabel}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-[#2E7D32] tabular-nums">
                    {t.landing.kpiYield}
                  </div>
                  <div className="text-xs text-neutral-500 font-medium">
                    {t.landing.kpiYieldLabel}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-neutral-900 tabular-nums">
                    {t.landing.kpiAccuracy}
                  </div>
                  <div className="text-xs text-neutral-500 font-medium">
                    {t.landing.kpiAccuracyLabel}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Media Display */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-neutral-200 group">
                <img
                  src={ASSET_IMAGES.heroFarm}
                  alt="Modern sustainable Indian farm with precision drip irrigation at sunrise"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 lg:h-[420px] object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="text-xs uppercase tracking-wider font-semibold text-lime-400">
                    Live Case Study: Charotar Agricultural Belt
                  </div>
                  <div className="text-base font-bold">
                    Solar Drip & Balanced Micro-Nutrient Management
                  </div>
                  <div className="text-xs text-neutral-200 mt-1 flex items-center gap-2">
                    <span>Vasad, Gujarat</span>
                    <span>·</span>
                    <span>35% Water Conservation</span>
                    <span>·</span>
                    <span>Verified Organic</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            {t.landing.featuresHeading}
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 mt-2">
            {t.landing.featuresSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Weather */}
          <div 
            onClick={() => onNavigate('weather')}
            className="bg-white p-6 rounded-xl border border-neutral-200 hover:border-emerald-600 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-11 h-11 rounded-lg bg-emerald-50 text-[#14532D] flex items-center justify-center mb-4 group-hover:bg-[#14532D] group-hover:text-white transition-colors">
                <CloudSun className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                {t.landing.featWeatherTitle}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {t.landing.featWeatherDesc}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-[#14532D]">
              <span>Check Live Forecast</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Soil Health */}
          <div 
            onClick={() => onNavigate('soil')}
            className="bg-white p-6 rounded-xl border border-neutral-200 hover:border-emerald-600 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-11 h-11 rounded-lg bg-emerald-50 text-[#14532D] flex items-center justify-center mb-4 group-hover:bg-[#14532D] group-hover:text-white transition-colors">
                <FlaskConical className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                {t.landing.featSoilTitle}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {t.landing.featSoilDesc}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-[#14532D]">
              <span>Log Soil Test</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Crop Management */}
          <div 
            onClick={() => onNavigate('crops')}
            className="bg-white p-6 rounded-xl border border-neutral-200 hover:border-emerald-600 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-11 h-11 rounded-lg bg-emerald-50 text-[#14532D] flex items-center justify-center mb-4 group-hover:bg-[#14532D] group-hover:text-white transition-colors">
                <Wheat className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                {t.landing.featCropTitle}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {t.landing.featCropDesc}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-[#14532D]">
              <span>Manage Crops</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Pest Alerts */}
          <div 
            onClick={() => onNavigate('pests')}
            className="bg-white p-6 rounded-xl border border-neutral-200 hover:border-emerald-600 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-11 h-11 rounded-lg bg-emerald-50 text-[#14532D] flex items-center justify-center mb-4 group-hover:bg-[#14532D] group-hover:text-white transition-colors">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                {t.landing.featPestTitle}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {t.landing.featPestDesc}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-[#14532D]">
              <span>View Regional Alerts</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white border-y border-neutral-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              {t.landing.howItWorksTitle}
            </h2>
            <p className="text-sm text-neutral-600 mt-2">
              Three seamless steps from registration to harvest optimization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-[#F8F7F0] border border-neutral-200 space-y-3">
              <div className="text-2xl font-extrabold text-[#14532D]">01</div>
              <h3 className="text-base font-bold text-neutral-900">{t.landing.step1Title}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">{t.landing.step1Desc}</p>
            </div>

            <div className="p-6 rounded-xl bg-[#F8F7F0] border border-neutral-200 space-y-3">
              <div className="text-2xl font-extrabold text-[#14532D]">02</div>
              <h3 className="text-base font-bold text-neutral-900">{t.landing.step2Title}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">{t.landing.step2Desc}</p>
            </div>

            <div className="p-6 rounded-xl bg-[#F8F7F0] border border-neutral-200 space-y-3">
              <div className="text-2xl font-extrabold text-[#14532D]">03</div>
              <h3 className="text-base font-bold text-neutral-900">{t.landing.step3Title}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">{t.landing.step3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainable Farming & Visual Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#14532D] text-white rounded-2xl overflow-hidden p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-lime-400 text-xs font-bold uppercase tracking-wider">
                <Droplets className="w-4 h-4" />
                <span>Sustainable Agricultural Stewardship</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-snug">
                {t.landing.sustainableTitle}
              </h2>
              <p className="text-sm text-emerald-100 leading-relaxed">
                {t.landing.sustainableDesc}
              </p>
              <div className="pt-2 grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                  <span>Drip Irrigation Scheduling</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                  <span>Soil NPK Overuse Prevention</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                  <span>Bio-Pesticide Biological Control</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                  <span>Zero Groundwater Waste Target</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl overflow-hidden border border-emerald-800 shadow-md">
                <img
                  src={ASSET_IMAGES.wheatGolden}
                  alt="Golden wheat field ready for harvest"
                  referrerPolicy="no-referrer"
                  className="w-full h-44 object-cover"
                />
              </div>
              <div className="rounded-xl overflow-hidden border border-emerald-800 shadow-md">
                <img
                  src={ASSET_IMAGES.soilField}
                  alt="Agronomist conducting soil testing in field"
                  referrerPolicy="no-referrer"
                  className="w-full h-44 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
