import React, { useState, useEffect } from 'react';
import { Database, LogOut, User, Sparkles, Box, LayoutPanelLeft } from 'lucide-react';
import DataDashboard from './components/DataDashboard';
import VisualExplorer from './components/VisualExplorer';
import AuthForm from './components/AuthForm';
import { authService } from './services/apiService';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<{name: string, email: string} | null>(null);
  const [view, setView] = useState<'dashboard' | 'explorer'>('dashboard');

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

  if (view === 'explorer') {
    return (
      <div className="min-h-screen bg-zinc-900 overflow-auto">
        {/* Simple Back Nav for Explorer */}
        <div className="fixed top-6 left-6 z-[60]">
           <button 
             onClick={() => setView('dashboard')}
             className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-amber-500 px-4 py-2 rounded-xl border border-amber-500/20 transition-all font-bold text-xs uppercase tracking-widest shadow-xl"
           >
              <Box className="w-4 h-4" /> Back to Dashboard
           </button>
        </div>
        <VisualExplorer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative selection:bg-primary/20 overflow-hidden mesh-gradient">
      {/* Premium Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[140px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[140px] animate-blob animation-delay-2000" />
        <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] bg-purple-600/15 rounded-full blur-[140px] animate-blob animation-delay-4000" />
        
        {/* Fine grid overlay */}
        <div className="absolute inset-0 bg-transparent opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      </div>

      {/* Modern Navbar */}
      <nav className="h-20 glass-panel border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setView('dashboard')}>
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 group-hover:rotate-12 transition-transform primary-glow">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-glow">Data<span className="text-primary italic">Flow</span></span>
              <span className="text-[10px] text-primary/60 uppercase tracking-[0.2em] font-black">EDA Intelligence</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
             <div className="text-sm font-medium text-primary flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <Box className="w-4 h-4" /> Workspace
             </div>
             <button 
               onClick={() => setView('explorer')}
               className="text-xs font-bold text-slate-400 hover:text-amber-500 flex items-center gap-2 px-4 py-2 rounded-full hover:bg-amber-500/10 transition-all uppercase tracking-widest"
             >
                <LayoutPanelLeft className="w-4 h-4" /> Visual Explorer
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
           <DataDashboard />
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
