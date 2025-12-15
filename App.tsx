
import React, { useState } from 'react';
import { Layout, Camera, MessageSquare, BarChart3, Home, Globe } from 'lucide-react';
import SiteCapture from './components/SiteCapture';
import DesignChat from './components/DesignChat';
import AdminDashboard from './components/AdminDashboard';
import { Screen, SiteData } from './types';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

const AppContent: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('LANDING');
  const [siteData, setSiteData] = useState<SiteData>({
    image: null,
    markers: [],
    description: ''
  });
  
  const { t, language, setLanguage } = useLanguage();

  const handleCaptureComplete = (data: SiteData) => {
    setSiteData(data);
    setCurrentScreen('CHAT');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'LANDING':
        return (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gradient-to-br from-green-50 to-emerald-100 relative">
            {/* Language Switcher on Landing */}
            <button 
              onClick={toggleLanguage}
              className="absolute top-6 right-6 flex items-center gap-1 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full text-sm font-medium text-brand-800 shadow-sm hover:bg-white transition"
            >
              <Globe size={14} /> {language === 'zh' ? 'EN' : '中文'}
            </button>

            <div className="w-20 h-20 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 transform rotate-3">
               <Layout className="text-white w-10 h-10" />
            </div>
            <h1 className="text-3xl font-extrabold text-brand-900 mb-2">{t.app.name}</h1>
            <h2 className="text-lg text-brand-700 mb-8 font-medium">{t.app.subtitle}</h2>
            
            <div className="space-y-4 w-full max-w-xs">
              <button 
                onClick={() => setCurrentScreen('CAPTURE')}
                className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold shadow-md hover:bg-brand-700 transition flex items-center justify-center gap-2"
              >
                <Camera size={20} />
                {t.app.roleResident}
              </button>
              <button 
                onClick={() => setCurrentScreen('ADMIN')}
                className="w-full bg-white text-brand-800 py-4 rounded-xl font-bold shadow-sm border border-brand-200 hover:bg-brand-50 transition flex items-center justify-center gap-2"
              >
                <BarChart3 size={20} />
                {t.app.roleAdmin}
              </button>
            </div>
          </div>
        );
      case 'CAPTURE':
        return <SiteCapture onComplete={handleCaptureComplete} />;
      case 'CHAT':
        return <DesignChat siteData={siteData} onBack={() => setCurrentScreen('CAPTURE')} />;
      case 'ADMIN':
        return <AdminDashboard />;
      default:
        return <div>Error</div>;
    }
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden max-w-md mx-auto border-x border-gray-200 bg-white">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
        {renderScreen()}
      </div>

      {/* Navigation (Only show if not on landing) */}
      {currentScreen !== 'LANDING' && (
        <nav className="h-16 bg-white border-t flex items-center justify-around px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
          <button 
            onClick={() => setCurrentScreen('LANDING')}
            className={`flex flex-col items-center gap-1 ${currentScreen === 'LANDING' ? 'text-brand-600' : 'text-gray-400'}`}
          >
            <Home size={20} />
            <span className="text-[10px]">{t.app.navHome}</span>
          </button>
          <button 
             onClick={() => setCurrentScreen('CAPTURE')}
             className={`flex flex-col items-center gap-1 ${currentScreen === 'CAPTURE' ? 'text-brand-600' : 'text-gray-400'}`}
          >
            <Camera size={20} />
            <span className="text-[10px]">{t.app.navCapture}</span>
          </button>
          <button 
             onClick={() => siteData.image && setCurrentScreen('CHAT')}
             disabled={!siteData.image}
             className={`flex flex-col items-center gap-1 ${currentScreen === 'CHAT' ? 'text-brand-600' : 'text-gray-400'} ${!siteData.image && 'opacity-30'}`}
          >
            <MessageSquare size={20} />
            <span className="text-[10px]">{t.app.navDesign}</span>
          </button>
          <button 
             onClick={() => setCurrentScreen('ADMIN')}
             className={`flex flex-col items-center gap-1 ${currentScreen === 'ADMIN' ? 'text-brand-600' : 'text-gray-400'}`}
          >
            <BarChart3 size={20} />
            <span className="text-[10px]">{t.app.navData}</span>
          </button>
        </nav>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
