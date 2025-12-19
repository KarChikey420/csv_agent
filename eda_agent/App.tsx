
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ChatInterface from './components/ChatInterface';
import AuthForm from './components/AuthForm';
import { AgentType } from './types';
import { authService } from './services/apiService';
import { DatabaseZap } from 'lucide-react';

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
      <div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#030712] flex text-gray-100">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
      />
      <main className="flex-1 ml-64 p-8 min-h-screen flex flex-col bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === AgentType.REACT && <ChatInterface type={AgentType.REACT} />}
          {activeTab === AgentType.MULTI && <ChatInterface type={AgentType.MULTI} />}
          {activeTab === AgentType.MEMORY && <ChatInterface type={AgentType.MEMORY} />}
          {activeTab === AgentType.GENERAL && <ChatInterface type={AgentType.GENERAL} />}
        </div>
      </main>
    </div>
  );
};

export default App;
