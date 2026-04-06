import React, { useState, useEffect } from 'react';
import { Database, LogOut, User, Sparkles, Activity, ShieldCheck, Box } from 'lucide-react';
import DataDashboard from './components/DataDashboard';
import AuthForm from './components/AuthForm';
import { authService } from './services/apiService';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<{name: string, email: string} | null>(null);
  const [activeTab, setActiveTab] = useState<'workspace' | 'analytics' | 'security'>('workspace');

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = authService.isAuthenticated();
      setIsAuthenticated(authStatus);
      if (authStatus) {
        try {
          const profile = await authService.getProfile();
          setUserProfile(profile);
        } catch (err) {
          console.error('Failed to fetch profile', err);
          handleLogout();
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const handleAuthSuccess = async () => {
    setIsAuthenticated(true);
    try {
      const profile = await authService.getProfile();
      setUserProfile(profile);
    } catch (err) {
       console.error('Profile fetch error', err);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUserProfile(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative selection:bg-primary/20 overflow-hidden mesh-gradient">
      {/* Premium Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[140px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[140px] animate-blob animation-delay-2000" />
        <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] bg-purple-600/15 rounded-full blur-[140px] animate-blob animation-delay-4000" />
        
        {/* Fine grid overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-150 contrast-150 pointer-events-none"></div>
      </div>

      {/* Modern Navbar */}
      <nav className="h-20 glass-panel border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 group-hover:rotate-12 transition-transform primary-glow">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-glow">Data<span className="text-primary italic">Flow</span></span>
              <span className="text-[10px] text-primary/60 uppercase tracking-[0.2em] font-black">EDA Intelligence</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
             <button 
                onClick={() => setActiveTab('workspace')}
                className={`text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'workspace' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Box className="w-4 h-4" /> Workspace
             </button>
             <button 
                onClick={() => setActiveTab('analytics')}
                className={`text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'analytics' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Activity className="w-4 h-4" /> Analytics
             </button>
             <button 
                onClick={() => setActiveTab('security')}
                className={`text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'security' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <ShieldCheck className="w-4 h-4" /> Security
             </button>
          </div>
        </div>

        <div className="flex items-center gap-6">
           {userProfile && (
              <div className="flex items-center gap-4 px-4 py-2 glass-card rounded-full border border-white/5 group hover:border-primary/20 transition-all cursor-pointer">
                 <div className="flex flex-col text-right">
                    <span className="text-xs font-bold text-foreground">{userProfile.name}</span>
                    <span className="text-[9px] text-muted-foreground italic">{userProfile.email}</span>
                 </div>
                 <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent p-[1px]">
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                       <User className="w-4 h-4 text-foreground" />
                    </div>
                 </div>
              </div>
           )}
           <button 
              onClick={handleLogout}
              className="p-2.5 rounded-xl border border-white/5 hover:bg-destructive/10 hover:border-destructive/20 text-muted-foreground hover:text-destructive transition-all"
              title="Logout session"
           >
              <LogOut className="w-5 h-5" />
           </button>
        </div>
      </nav>

      {/* Main Workspace */}
      <main className="flex-1 p-6 relative z-10 overflow-auto">
        <div className="max-w-[1600px] mx-auto w-full h-full">
           {activeTab === 'workspace' && <DataDashboard />}
           
           {activeTab === 'analytics' && (
              <div className="flex flex-col items-center justify-center h-[60vh] glass-panel rounded-3xl border border-white/5 p-12 text-center animate-fade-in">
                 <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 border border-accent/20">
                    <Activity className="w-10 h-10 text-accent" />
                 </div>
                 <h2 className="text-3xl font-bold mb-4 tracking-tight">Advanced Analytics</h2>
                 <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Compute complex correlations, time-series projections, and AI-driven predictive insights. This module is currently processing deep learning weights.
                 </p>
                 <div className="mt-8 flex gap-3">
                    <button onClick={() => setActiveTab('workspace')} className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all">Back to Workspace</button>
                 </div>
              </div>
           )}

           {activeTab === 'security' && (
              <div className="flex flex-col items-center justify-center h-[60vh] glass-panel rounded-3xl border border-white/5 p-12 text-center animate-fade-in">
                 <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
                    <ShieldCheck className="w-10 h-10 text-emerald-500" />
                 </div>
                 <h2 className="text-3xl font-bold mb-4 tracking-tight">System Security</h2>
                 <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Manage API keys, monitor agent execution logs, and audit data access history. Your environment is protected by AES-256 bank-grade encryption.
                 </p>
                 <div className="mt-8 flex gap-3">
                    <button onClick={() => setActiveTab('workspace')} className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all">Back to Workspace</button>
                 </div>
              </div>
           )}
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="h-10 px-8 flex items-center justify-between border-t border-white/5 bg-black/20 relative z-10">
         <div className="flex items-center gap-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-primary animate-pulse" /> Agent Cluster Online</span>
            <span className="flex items-center gap-1.5 opacity-60">Engine: LangGraph 3.0</span>
            <span className="flex items-center gap-1.5 opacity-60">DB: PostgreSQL 16</span>
         </div>
         <div className="text-[10px] text-muted-foreground font-mono">
            &copy; 2026 DataFlow AI Systems
         </div>
      </footer>
    </div>
  );
};

export default App;
