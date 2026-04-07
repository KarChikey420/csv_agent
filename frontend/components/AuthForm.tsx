import React, { useState, useEffect } from 'react';
import { Mail, Lock, UserPlus, Database, Sparkles, Activity, Eye, EyeOff, Shield } from 'lucide-react';
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
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen w-full flex flex-col md:flex-row font-sans overflow-hidden bg-background">
      {/* Left Side (Visuals) */}
      <div 
        className="w-full md:w-1/2 relative flex flex-col items-center justify-center p-10 lg:p-20 overflow-hidden bg-[#050505] hidden md:flex"
      >
        {/* Animated Mesh Gradient / Radial Glow - Slow Fade In Setup */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none fade-in-delayed">
          <div className="absolute top-[-10%] left-[-20%] w-[70%] h-[70%] bg-primary/20 rounded-full blur-[140px] mix-blend-screen animate-pulse duration-10000" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/15 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-7000" style={{ animationDelay: '2s' }} />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 w-full max-w-md animate-fade-in">
          {/* Glowing DataFlow Logo / Concept */}
          <div className="mb-12 flex items-center gap-3">
             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.4)]">
                 <Database className="w-6 h-6 text-black" />
             </div>
             <span className="text-2xl font-bold text-foreground tracking-tight">DataFlow AI</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-6">
            The intelligent standard for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Data Science.</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-12 max-w-sm">
            Experience real-time exploratory data analysis, powered by a multi-agent AI architecture.
          </p>

          {/* Glassmorphic Mock Card */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-2xl shadow-black/50">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">System Status</span>
              </div>
              <div className="flex items-center gap-2">
                 <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
                  </span>
                  <span className="text-xs text-muted-foreground">All systems nominal</span>
              </div>
            </div>
            
            <div className="space-y-3">
               <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-gradient-to-r from-primary to-accent w-[80%] rounded-full shadow-[0_0_10px_rgba(var(--primary),0.8)]"></div>
               </div>
               <div className="flex justify-between text-xs text-muted-foreground">
                 <span>Agent Network Capacity</span>
                 <span className="text-foreground">80%</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side (Form) */}
      <div className="w-full md:w-1/2 bg-background flex items-center justify-center p-6 sm:p-12 min-h-screen md:min-h-0 relative z-10 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
        <div className="w-full max-w-[400px] animate-slide-in-right opacity-0 [animation-fill-mode:forwards]">
          
          <div className="mb-10 lg:mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-3">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isLogin ? 'Enter your credentials to access your workspace.' : 'Sign up to start analyzing your data intelligently.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
              <Shield className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {isBackendOff && (
            <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
              <span className="text-lg leading-none shrink-0">⚠️</span>
              <p className="text-sm text-amber-200/80">Backend is offline. It might take a moment to spin up.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="group">
                <label 
                  className={`block text-xs font-semibold uppercase tracking-wider mb-2 transition-colors duration-300 ${focusedInput === 'name' ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  Full Name
                </label>
                <div className="relative">
                  <UserPlus className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${focusedInput === 'name' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onFocus={() => setFocusedInput('name')}
                    onBlur={() => setFocusedInput(null)}
                    className="w-full bg-transparent text-foreground rounded-xl border border-white/10 pl-11 pr-4 py-3.5 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-white/20 text-sm"
                    placeholder="John Doe"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="group">
              <label 
                className={`block text-xs font-semibold uppercase tracking-wider mb-2 transition-colors duration-300 ${focusedInput === 'email' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${focusedInput === 'email' ? 'text-primary' : 'text-muted-foreground'}`} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  className="w-full bg-transparent text-foreground rounded-xl border border-white/10 pl-11 pr-4 py-3.5 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-white/20 text-sm"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="group">
              <label 
                className={`block text-xs font-semibold uppercase tracking-wider mb-2 transition-colors duration-300 ${focusedInput === 'password' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${focusedInput === 'password' ? 'text-primary' : 'text-muted-foreground'}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  className="w-full bg-transparent text-foreground rounded-xl border border-white/10 pl-11 pr-12 py-3.5 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-white/20 text-sm"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-black py-3.5 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_20px_0_rgba(var(--primary),0.3)] hover:shadow-[0_6px_25px_rgba(var(--primary),0.4)] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Sign in' : 'Create account'}
                    <Sparkles className="w-4 h-4 opacity-70 ml-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ name: '', email: '', password: '' });
              }}
              className="text-foreground font-medium hover:text-primary transition-colors focus:outline-none focus:underline hover:underline-offset-4"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
          
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInDelayed {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes slideInRight {
          0% { transform: translateX(20px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .fade-in-delayed {
          animation: fadeInDelayed 1.5s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out 0.2s both;
        }
        .animate-slide-in-right {
          animation: slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
        }
        .duration-10000 {
          animation-duration: 10s;
        }
        .duration-7000 {
          animation-duration: 7s;
        }
      `}} />
    </div>
  );
};

export default AuthForm;
