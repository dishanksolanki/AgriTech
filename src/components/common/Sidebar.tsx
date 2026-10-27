import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  LayoutDashboard, MapPin, Wheat, CloudSun, FlaskConical, 
  AlertTriangle, ShoppingBag, Users2, MessageSquare, Bell, 
  User, Shield, Code, ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  unreadNotifsCount?: number;
}

interface NavLinkItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onNavigate, unreadNotifsCount = 0 }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const farmerNav: NavLinkItem[] = [
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'farms', label: t.nav.farms, icon: MapPin },
    { id: 'crops', label: t.nav.crops, icon: Wheat },
    { id: 'weather', label: t.nav.weather, icon: CloudSun },
    { id: 'soil', label: t.nav.soil, icon: FlaskConical },
    { id: 'pests', label: t.nav.pests, icon: AlertTriangle },
    { id: 'market', label: t.nav.market, icon: ShoppingBag },
    { id: 'expert', label: t.nav.expert, icon: Users2 },
    { id: 'forum', label: t.nav.forum, icon: MessageSquare },
    { id: 'notifications', label: t.nav.notifications, icon: Bell, badge: unreadNotifsCount },
    { id: 'profile', label: t.nav.profile, icon: User },
  ];

  const adminNav: NavLinkItem[] = [
    { id: 'admin', label: t.nav.admin, icon: Shield },
    { id: 'farms', label: 'All Farms', icon: MapPin },
    { id: 'crops', label: 'All Crops', icon: Wheat },
    { id: 'weather', label: t.nav.weather, icon: CloudSun },
    { id: 'soil', label: t.nav.soil, icon: FlaskConical },
    { id: 'pests', label: 'Pest Advisory Hub', icon: AlertTriangle },
    { id: 'market', label: 'Market Catalog', icon: ShoppingBag },
    { id: 'expert', label: 'Expert Inquiries', icon: Users2 },
    { id: 'forum', label: 'Moderation Forum', icon: MessageSquare },
    { id: 'profile', label: 'Admin Settings', icon: User },
  ];

  const links = user?.role === 'admin' ? adminNav : farmerNav;

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* User Card Mini */}
      <div className="p-4 border-b border-neutral-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#14532D] text-white flex items-center justify-center font-bold text-sm shrink-0">
          {user?.name.charAt(0) || 'F'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-bold text-xs text-neutral-900 truncate">{user?.name || 'AgriTech User'}</div>
          <div className="text-[11px] text-neutral-500 truncate">
            {user?.role === 'admin' ? 'Administrator' : `${user?.district || 'Anand'}, ${user?.state || 'Gujarat'}`}
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] uppercase font-bold text-neutral-400 px-3 pb-1 tracking-wider">
          {user?.role === 'admin' ? 'Management Modules' : 'Farm Management'}
        </div>

        {links.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? 'bg-emerald-50 text-[#14532D] font-bold shadow-xs'
                  : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#14532D]' : 'text-neutral-500'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className="bg-[#14532D] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                  {item.badge}
                </span>
              ) : isActive ? (
                <ChevronRight className="w-3.5 h-3.5 text-[#14532D] shrink-0" />
              ) : null}
            </button>
          );
        })}

        <div className="pt-4 border-t border-neutral-100 mt-4">
          <div className="text-[10px] uppercase font-bold text-neutral-400 px-3 pb-1 tracking-wider">
            Architecture
          </div>
          <button
            onClick={() => onNavigate('docs')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              currentTab === 'docs'
                ? 'bg-emerald-50 text-[#14532D] font-bold'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Code className="w-4 h-4 text-neutral-500 shrink-0" />
              <span className="truncate">Mentor Review & API</span>
            </div>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-neutral-100 text-[11px] text-neutral-500 bg-neutral-50/50">
        <div className="flex items-center justify-between text-[10px]">
          <span>Role: <strong className="capitalize text-neutral-800">{user?.role}</strong></span>
          <span className="text-[#14532D] font-semibold">v1.2.0-Prod</span>
        </div>
      </div>
    </aside>
  );
};
