import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { FarmManagement } from './pages/FarmManagement';
import { CropManagement } from './pages/CropManagement';
import { WeatherPage } from './pages/WeatherPage';
import { SoilHealthPage } from './pages/SoilHealthPage';
import { PestAlertsPage } from './pages/PestAlertsPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { ExpertConsultationPage } from './pages/ExpertConsultationPage';
import { CommunityForumPage } from './pages/CommunityForumPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProjectDocsPage } from './pages/ProjectDocsPage';

const AppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('landing');

  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isFullWidthPage = currentTab === 'landing' || currentTab === 'auth';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F0] text-[#1F2937]">
      <Navbar currentTab={currentTab} onNavigate={handleNavigate} />
      <CartDrawer />

      {isFullWidthPage ? (
        <main className="flex-1">
          {currentTab === 'landing' && <LandingPage onNavigate={handleNavigate} />}
          {currentTab === 'auth' && (
            <AuthPage
              onSuccess={() => {
                if (user?.role === 'admin') {
                  setCurrentTab('admin');
                } else {
                  setCurrentTab('dashboard');
                }
              }}
            />
          )}
        </main>
      ) : (
        <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
          <Sidebar currentTab={currentTab} onNavigate={handleNavigate} />
          
          <main className="flex-1 min-w-0">
            {currentTab === 'dashboard' && <FarmerDashboard onNavigate={handleNavigate} />}
            {currentTab === 'farms' && <FarmManagement />}
            {currentTab === 'crops' && <CropManagement />}
            {currentTab === 'weather' && <WeatherPage />}
            {currentTab === 'soil' && <SoilHealthPage />}
            {currentTab === 'pests' && <PestAlertsPage />}
            {currentTab === 'market' && <MarketplacePage />}
            {currentTab === 'expert' && <ExpertConsultationPage />}
            {currentTab === 'forum' && <CommunityForumPage />}
            {currentTab === 'notifications' && <NotificationsPage onNavigate={handleNavigate} />}
            {currentTab === 'profile' && <ProfileSettingsPage />}
            {currentTab === 'admin' && <AdminDashboard />}
            {currentTab === 'docs' && <ProjectDocsPage />}
          </main>
        </div>
      )}

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
