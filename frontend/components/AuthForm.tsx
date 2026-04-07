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
    <div className="min-h-screen bg-[#020617] text-white flex flex-col lg:flex-row relative overflow-hidden font-sans">
      {/* Immersive Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/20 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-purple-600/20 rounded-full blur-[100px] animate-blob" style={{ animationDelay: '4s' }} />
      </div>

      {/* Left Panel: Hero & Info */}
      <div className="w-full lg:w-[55%] p-8 lg:p-16 xl:p-24 flex flex-col justify-center relative z-10">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-wider uppercase mb-8 shadow-[0_0_15px_rgba(6,182,212,0.15)] backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            AI-Powered EDA Platform
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 text-white leading-[1.1]">
            Analyze Data at the speed of <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 filter drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">Thought</span>
          </h1>

          <p className="text-slate-400 text-lg lg:text-xl mb-12 leading-relaxed max-w-xl">
            DataFlow is a sophisticated multi-agent platform designed for automated Exploratory Data Analysis, intelligent data interaction, and instant visual reasoning.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/[0.06] transition-colors duration-300 group">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform">
                <Network className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white mb-2 text-lg">Expert Cluster</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Collaborative multi-agent architecture to solve complex data challenges.</p>
            </div>
            
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/[0.06] transition-colors duration-300 group">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white mb-2 text-lg">EDA Reasoning</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Deep analysis, intelligent outlier detection, and automated insight generation.</p>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/[0.06] transition-colors duration-300 group">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white mb-2 text-lg">Instant Vis</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Dynamic, on-the-fly plot generation for immediate visual clarity.</p>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/[0.06] transition-colors duration-300 group">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400 group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white mb-2 text-lg">Smart Schema</h3>
              <p className="text-sm text-slate-400 leading-relaxed">RAG-based knowledge retrieval for deep contextual data understanding.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Auth Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 lg:p-12 relative z-10 bg-black/40 lg:border-l border-white/5 backdrop-blur-2xl">
        <div className="w-full max-w-[420px] bg-white/[0.02] backdrop-blur-3xl rounded-[2rem] p-10 py-12 border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
          
          <div className="text-center mb-10 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)] group-hover:scale-105 transition-transform duration-500">
              <Database className="w-8 h-8 text-cyan-400" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              {isLogin ? 'Sign in to access your DataFlow workspace' : 'Join the EDA intelligence revolution today'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                <div className="relative group/input">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-cyan-400 transition-colors" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black/40 text-white pl-12 pr-4 py-3.5 rounded-xl border border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:outline-none transition-all placeholder-slate-600"
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-cyan-400 transition-colors" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-black/40 text-white pl-12 pr-4 py-3.5 rounded-xl border border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:outline-none transition-all placeholder-slate-600"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-cyan-400 transition-colors" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-black/40 text-white pl-12 pr-4 py-3.5 rounded-xl border border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:outline-none transition-all placeholder-slate-600"
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
              <div className="text-red-400 text-sm bg-red-950/40 border border-red-500/30 rounded-xl p-4 backdrop-blur-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-[#020617] py-4 rounded-xl font-bold text-base transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] active:scale-[0.98] flex items-center justify-center gap-2 mt-8"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#020617]/30 border-t-[#020617] rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  {isLogin ? <LogIn className="w-5 h-5 ml-1" /> : <UserPlus className="w-5 h-5 ml-1" />}
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center relative z-10">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-slate-400 hover:text-cyan-400 text-sm transition-colors"
            >
              {isLogin ? (
                <>Don't have an account? <span className="text-cyan-400 underline underline-offset-4">Sign up</span></>
              ) : (
                <>Already have an account? <span className="text-cyan-400 underline underline-offset-4">Sign in</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
