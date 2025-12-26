import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AgentForm from './components/AgentForm';
import AuthForm from './components/AuthForm';
import { AgentType } from './types';
import { authService } from './services/apiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
    setLoading(false);
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden relative selection:bg-primary/20">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[100px] animate-blob animation-delay-4000" />
      </div>

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <main className="flex-1 ml-64 p-6 min-h-screen flex flex-col relative z-10 transition-all duration-300">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col animate-fade-in">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === AgentType.REACT && <AgentForm type={AgentType.REACT} />}
          {activeTab === AgentType.MULTI && <AgentForm type={AgentType.MULTI} />}
          {activeTab === AgentType.MEMORY && <AgentForm type={AgentType.MEMORY} />}
          {activeTab === AgentType.GENERAL && <AgentForm type={AgentType.GENERAL} />}
        </div>
      </main>
    </div>
  );
};

export default App;
