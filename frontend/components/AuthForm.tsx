import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, LogIn, UserPlus, Database, Sparkles, Brain, BarChart3, Network } from 'lucide-react';
import { authService, getApiErrorMessage } from '../services/apiService';

interface AuthFormProps {
  onAuthSuccess: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isBackendOff, setIsBackendOff] = useState(false);

  useEffect(() => {
    const ping = async () => {
      const ok = await authService.checkHealth();
      setIsBackendOff(!ok);
    };
    ping();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await authService.login(formData.email, formData.password);
      } else {
        await authService.signup(formData.name, formData.email, formData.password);
        await authService.login(formData.email, formData.password);
      }
      onAuthSuccess();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Authentication failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row relative overflow-x-hidden font-sans">
      {/* Immersive Background Effects matching app theme */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-primary/20 rounded-full blur-[100px] animate-blob" style={{ animationDelay: '4s' }} />
      </div>

      {/* Left Panel: Hero & Info */}
      <div className="w-full lg:w-[55%] p-6 lg:p-10 xl:p-16 flex flex-col justify-center relative z-10 order-2 lg:order-1">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wider uppercase mb-6 shadow-lg shadow-primary/10 backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            AI-Powered EDA Platform
          </div>

          <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-4 text-white leading-[1.1]">
            Analyze Data at the speed of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent drop-shadow-[0_0_10px_hsl(var(--primary)/0.4)]">Thought</span>
          </h1>

          <p className="text-muted-foreground text-base lg:text-lg mb-8 leading-relaxed max-w-xl">
            DataFlow is a sophisticated multi-agent platform designed for automated Exploratory Data Analysis, intelligent data interaction, and instant visual reasoning.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 p-4 lg:p-5 rounded-2xl hover:bg-white/[0.06] transition-colors duration-300 group">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3 text-primary group-hover:scale-110 transition-transform">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white mb-1.5 text-base">Expert Cluster</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">Collaborative multi-agent architecture to solve complex data challenges.</p>
            </div>
            
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 p-4 lg:p-5 rounded-2xl hover:bg-white/[0.06] transition-colors duration-300 group">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mb-3 text-accent group-hover:scale-110 transition-transform">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white mb-1.5 text-base">EDA Reasoning</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">Deep analysis, intelligent outlier detection, and automated insight generation.</p>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 p-4 lg:p-5 rounded-2xl hover:bg-white/[0.06] transition-colors duration-300 group">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3 text-primary group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white mb-1.5 text-base">Instant Vis</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">Dynamic, on-the-fly plot generation for immediate visual clarity.</p>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 p-4 lg:p-5 rounded-2xl hover:bg-white/[0.06] transition-colors duration-300 group">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mb-3 text-accent group-hover:scale-110 transition-transform">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white mb-1.5 text-base">Smart Schema</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">RAG-based knowledge retrieval for deep contextual data understanding.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Auth Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 lg:p-8 relative z-10 bg-black/20 lg:border-l border-white/5 backdrop-blur-2xl order-1 lg:order-2">
        <div className="w-full max-w-[420px] bg-white/[0.02] backdrop-blur-3xl rounded-[2rem] p-8 py-10 border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          
          <div className="text-center mb-8 relative z-10">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-primary/30 shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-500 primary-glow">
              <Database className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
              {isLogin ? 'Sign in to access your workspace' : 'Join the EDA intelligence revolution'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Name</label>
                <div className="relative group/input">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black/40 text-white pl-11 pr-4 py-3 rounded-xl border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:outline-none transition-all placeholder-slate-600 text-sm"
                    placeholder="Full name"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-black/40 text-white pl-11 pr-4 py-3 rounded-xl border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:outline-none transition-all placeholder-slate-600 text-sm"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-black/40 text-white pl-11 pr-4 py-3 rounded-xl border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:outline-none transition-all placeholder-slate-600 text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {isBackendOff && (
              <div className="text-amber-400 text-sm bg-amber-950/40 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3 backdrop-blur-md">
                <span className="text-lg leading-none">⚠️</span>
                <p>Backend appears to be offline. The Render service may be spinning up (this can take 30-60s).</p>
              </div>
            )}

            {error && (
              <div className="text-destructive text-sm bg-destructive/20 border border-destructive/30 rounded-xl p-4 backdrop-blur-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98] flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  {isLogin ? <LogIn className="w-4 h-4 ml-1" /> : <UserPlus className="w-4 h-4 ml-1" />}
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center relative z-10">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-muted-foreground hover:text-primary text-sm transition-colors"
            >
              {isLogin ? (
                <>Don't have an account? <span className="text-primary underline underline-offset-4">Sign up</span></>
              ) : (
                <>Already have an account? <span className="text-primary underline underline-offset-4">Sign in</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
