import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Activity, Terminal, Cpu, Database } from 'lucide-react';

interface AdvancedIntelligenceProps {
  isMainStage?: boolean;
}

const AdvancedIntelligence: React.FC<AdvancedIntelligenceProps> = ({ isMainStage }) => {
  const [logs, setLogs] = useState<string[]>([]);
  
  useEffect(() => {
    const messages = [
      "Initializing Deep Learning Engine...",
      "Loading pre-trained weights v4.2.1...",
      "Scanning dataset topology...",
      "Optimizing hyper-parameters...",
      "Detected 14 non-linear correlations.",
      "Computing gradient descent on feature vector...",
      "Calibrating time-series projection model...",
      "Generating AI-driven insights...",
      "Weights synchronized. Engine Ready."
    ];
    
    let current = 0;
    const interval = setInterval(() => {
      if (current < messages.length) {
        setLogs(prev => [...prev.slice(-4), messages[current]]);
        current++;
      } else {
        clearInterval(interval);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative group">
      {/* Decorative pulse blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
      
      <div className="relative z-10 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 primary-glow">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Advanced Intelligence</h3>
              <p className="text-[10px] text-primary font-mono uppercase tracking-[0.2em] opacity-80">Neural Processing Mode</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live Engine</span>
          </div>
        </div>

        {/* The Heartbeat Visual */}
        <div className="flex justify-center py-4">
          <div className="relative">
            <svg className="w-40 h-40" viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="currentColor" 
                className="text-primary/10" 
                strokeWidth="1" 
              />
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="currentColor" 
                className="text-primary animate-ping-slow" 
                strokeWidth="0.5" 
                style={{ animationDuration: '4s' }}
              />
              {/* Spinning Ring */}
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="none" 
                stroke="currentColor" 
                className="text-primary/40" 
                strokeWidth="2" 
                strokeDasharray="20 180"
                style={{ transformOrigin: 'center', animation: 'spin 10s linear infinite' }}
              />
              <circle 
                cx="50" 
                cy="50" 
                r="48" 
                fill="none" 
                stroke="currentColor" 
                className="text-primary/20" 
                strokeWidth="1" 
                strokeDasharray="5 15"
                style={{ transformOrigin: 'center', animation: 'spin 30s linear infinite reverse' }}
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
               <Cpu className="w-12 h-12 text-primary animate-pulse" />
            </div>
          </div>
        </div>

        {/* Live Logs */}
        <div className="bg-black/40 rounded-2xl p-4 border border-white/5 font-mono">
           <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
              <Terminal className="w-3 h-3 text-primary" />
              <span className="text-[9px] uppercase font-bold text-primary/60 tracking-widest">Weight Processing Console</span>
           </div>
           <div className="space-y-1">
              {logs.length === 0 ? (
                <div className="text-[10px] text-muted-foreground animate-pulse">Awaiting data stream...</div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="text-[10px] text-foreground/70 flex gap-2 animate-fade-in">
                    <span className="text-primary opacity-50">$</span>
                    <span className={i === logs.length - 1 ? "text-primary font-bold" : ""}>{log}</span>
                  </div>
                ))
              )}
           </div>
        </div>

        {/* Quick Capabilities */}
        <div className="grid grid-cols-2 gap-3">
           <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3 group/item hover:bg-primary/10 transition-colors">
              <Database className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Projections</span>
           </div>
           <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3 group/item hover:bg-primary/10 transition-colors">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Insights</span>
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-ping-slow {
          animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}} />
    </div>
  );
};

export default AdvancedIntelligence;
