import React, { useState } from 'react';
import { User, Mail, Lock, LogIn, UserPlus, Database } from 'lucide-react';
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

  React.useEffect(() => {
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

    console.log('Attempting authentication...', isLogin ? 'Login' : 'Signup', formData.email);
    try {
      if (isLogin) {
        await authService.login(formData.email, formData.password);
        console.log('Login successful');
      } else {
        await authService.signup(formData.name, formData.email, formData.password);
        console.log('Signup successful');
        await authService.login(formData.email, formData.password);
      }
      console.log('Triggering onAuthSuccess callback');
      onAuthSuccess();
    } catch (err) {
      console.error('Authentication Error Details:', err);
      setError(getApiErrorMessage(err, 'Authentication failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] animate-blob" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-accent/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />
      
      <div className="w-full max-w-md glass-panel rounded-[2.5rem] p-10 relative z-10 border border-white/10 primary-glow overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        
        <div className="text-center mb-10 relative z-10">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-2xl shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
            <Database className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tighter text-glow">Data<span className="text-primary italic">Flow</span></h1>
          <p className="text-primary/60 text-[10px] uppercase tracking-[0.3em] font-bold mt-2">
            AI Intelligence Platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Name</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-background/50 text-foreground pl-10 pr-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all"
                  placeholder="Enter your name"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-background/50 text-foreground pl-10 pr-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-background/50 text-foreground pl-10 pr-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {isBackendOff && (
            <div className="text-amber-500 text-xs bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 animate-pulse">
              ⚠️ Backend appears to be offline. The Render service may be spinning up (this can take 30-60s).
            </div>
          )}

          {error && (
            <div className="text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 mt-8"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
                {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:text-primary/80 text-sm transition-colors hover:underline underline-offset-4"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
