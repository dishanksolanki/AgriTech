import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { Sprout, ShoppingCart, Globe, User, LogOut, ChevronDown, Check, Shield, Database } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const { user, isAuthenticated, logout, switchDemoAccount, allDemoUsers } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { cartCount, setIsCartOpen } = useCart();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDemoSwitchOpen, setIsDemoSwitchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* Mentor Review / Demo Mode Notification Ribbon */}
      <div className="bg-[#14532D] text-emerald-100 text-[11px] px-4 py-1.5 flex items-center justify-between border-b border-emerald-900">
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-lime-400 shrink-0" />
          <span>
            <strong>Mentor Review Mode:</strong> Client-Persistent Storage active. Full Express + MongoDB source available in <span className="font-mono text-white">/backend</span>.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setIsDemoSwitchOpen(!isDemoSwitchOpen)}
              className="text-[11px] font-medium text-white hover:text-lime-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Current: <strong>{user?.name || 'Guest'} ({user?.role === 'admin' ? 'Admin' : 'Farmer'})</strong></span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {isDemoSwitchOpen && (
              <div 
                className="absolute right-0 mt-1.5 w-64 bg-white text-neutral-800 rounded-lg shadow-xl border border-neutral-200 py-1.5 z-50 text-xs"
                onMouseLeave={() => setIsDemoSwitchOpen(false)}
              >
                <div className="px-3 py-1 font-semibold text-[10px] text-neutral-400 uppercase tracking-wider">
                  Quick Switch Test Accounts
                </div>
                {allDemoUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchDemoAccount(u.id);
                      setIsDemoSwitchOpen(false);
                      if (u.role === 'admin') {
                        onNavigate('admin');
                      } else {
                        onNavigate('dashboard');
                      }
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-neutral-50 transition-colors ${
                      user?.id === u.id ? 'bg-emerald-50 text-[#14532D] font-semibold' : ''
                    }`}
                  >
                    <div>
                      <div className="font-medium text-neutral-900">{u.name}</div>
                      <div className="text-[10px] text-neutral-500">
                        {u.role === 'admin' ? 'System Administrator' : `${u.district}, ${u.state}`}
                      </div>
                    </div>
                    {user?.id === u.id && <Check className="w-4 h-4 text-[#14532D]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Strict 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 text-left group cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-[#14532D] flex items-center justify-center text-white shadow-xs group-hover:bg-[#0f3e22] transition-colors">
            <Sprout className="w-5 h-5 text-[#84CC16]" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-neutral-900 font-sans">
              AgriTech
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Single-line text links) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
          <button
            onClick={() => onNavigate('landing')}
            className={`whitespace-nowrap hover:text-[#14532D] transition-colors cursor-pointer py-1 ${
              currentTab === 'landing' ? 'text-[#14532D] font-bold border-b-2 border-[#14532D]' : ''
            }`}
          >
            {t.nav.home}
          </button>
          
          {isAuthenticated && (
            <>
              <button
                onClick={() => onNavigate(user?.role === 'admin' ? 'admin' : 'dashboard')}
                className={`whitespace-nowrap hover:text-[#14532D] transition-colors cursor-pointer py-1 ${
                  currentTab === 'dashboard' || currentTab === 'admin' ? 'text-[#14532D] font-bold border-b-2 border-[#14532D]' : ''
                }`}
              >
                {user?.role === 'admin' ? t.nav.admin : t.nav.dashboard}
              </button>
              
              {user?.role === 'farmer' && (
                <>
                  <button
                    onClick={() => onNavigate('farms')}
                    className={`whitespace-nowrap hover:text-[#14532D] transition-colors cursor-pointer py-1 ${
                      currentTab === 'farms' ? 'text-[#14532D] font-bold border-b-2 border-[#14532D]' : ''
                    }`}
                  >
                    {t.nav.farms}
                  </button>
                  <button
                    onClick={() => onNavigate('crops')}
                    className={`whitespace-nowrap hover:text-[#14532D] transition-colors cursor-pointer py-1 ${
                      currentTab === 'crops' ? 'text-[#14532D] font-bold border-b-2 border-[#14532D]' : ''
                    }`}
                  >
                    {t.nav.crops}
                  </button>
                </>
              )}
            </>
          )}

          <button
            onClick={() => onNavigate('weather')}
            className={`whitespace-nowrap hover:text-[#14532D] transition-colors cursor-pointer py-1 ${
              currentTab === 'weather' ? 'text-[#14532D] font-bold border-b-2 border-[#14532D]' : ''
            }`}
          >
            {t.nav.weather}
          </button>

          <button
            onClick={() => onNavigate('market')}
            className={`whitespace-nowrap hover:text-[#14532D] transition-colors cursor-pointer py-1 ${
              currentTab === 'market' ? 'text-[#14532D] font-bold border-b-2 border-[#14532D]' : ''
            }`}
          >
            {t.nav.market}
          </button>

          <button
            onClick={() => onNavigate('docs')}
            className={`whitespace-nowrap hover:text-[#14532D] transition-colors cursor-pointer py-1 ${
              currentTab === 'docs' ? 'text-[#14532D] font-bold border-b-2 border-[#14532D]' : ''
            }`}
          >
            {t.nav.docs}
          </button>
        </nav>

        {/* Zone 3: Actions (Language switcher, Cart button, Profile / Login) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors cursor-pointer"
            title="Switch Language / भाषा बदलें"
          >
            <Globe className="w-3.5 h-3.5 text-neutral-500" />
            <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-neutral-700 hover:text-[#14532D] hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
            title="View Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#14532D] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account / Auth */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors text-xs font-medium cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#14532D] flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:inline font-semibold text-neutral-900">{user.name.split(' ')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-neutral-200 py-1.5 z-50 text-xs"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-neutral-100">
                    <p className="font-bold text-neutral-900">{user.name}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {user.role === 'admin' ? 'Administrator' : 'Verified Farmer'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onNavigate('profile');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center gap-2 text-neutral-700 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-neutral-400" />
                    <span>{t.nav.profile}</span>
                  </button>

                  {user.role === 'admin' ? (
                    <button
                      onClick={() => {
                        onNavigate('admin');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center gap-2 text-neutral-700 cursor-pointer"
                    >
                      <Shield className="w-4 h-4 text-neutral-400" />
                      <span>{t.nav.admin}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onNavigate('dashboard');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center gap-2 text-neutral-700 cursor-pointer"
                    >
                      <Sprout className="w-4 h-4 text-neutral-400" />
                      <span>{t.nav.dashboard}</span>
                    </button>
                  )}

                  <div className="border-t border-neutral-100 mt-1"></div>

                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                      onNavigate('landing');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t.nav.logout}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onNavigate('auth')}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#14532D] rounded-lg hover:bg-[#0f3e22] transition-colors whitespace-nowrap cursor-pointer shadow-xs"
            >
              {t.nav.login}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
