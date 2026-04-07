import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  Layers, 
  Zap, 
  Terminal, 
  CheckCircle2, 
  Clock, 
  BarChart, 
  Maximize2, 
  Minimize2,
  Brain,
  Network
} from 'lucide-react';

const VisualExplorer: React.FC = () => {
  const [isBordered, setIsBordered] = useState(true);
  const [metrics, setMetrics] = useState({
    throughput: 1240,
    latency: 142,
    memory: 64.2,
    activeAgents: 8
  });

  // Mock real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        throughput: prev.throughput + Math.floor(Math.random() * 10) - 4,
        latency: 140 + Math.floor(Math.random() * 10),
        memory: 64.2 + (Math.random() * 0.5),
        activeAgents: 8
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const cardStyle = `transition-all duration-500 ease-in-out bg-zinc-800 ${
    isBordered ? 'border border-amber-500/20' : 'border-transparent shadow-2xl'
  } rounded-2xl p-6`;

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-6 md:p-12 font-sans overflow-x-hidden selection:bg-amber-500/30">
      
      {/* Floating Control Panel */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => setIsBordered(!isBordered)}
          className="flex items-center gap-3 bg-amber-500 hover:bg-amber-600 text-zinc-900 px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all active:scale-95 group"
        >
          {isBordered ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          <span className="uppercase tracking-widest text-xs">
            {isBordered ? 'Disable Borders' : 'Enable Borders'}
          </span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        
        {/* Header Section */}
        <header className="flex flex-col gap-4 mb-4">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-zinc-900 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                <Brain className="w-7 h-7" />
             </div>
             <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase italic">DataFlow <span className="text-amber-500">Explorer</span></h1>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.4em]">System Telemetry & Reasoning</p>
             </div>
          </div>
        </header>

        {/* Telemetry Stats - Vertical Stack */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-500" /> Operational Metrics
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={cardStyle}>
               <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Real-time</span>
               </div>
               <div className="text-2xl font-bold text-white mb-1">{metrics.throughput.toLocaleString()} <span className="text-xs text-zinc-500">req/s</span></div>
               <div className="text-xs text-zinc-400 font-medium">Global Input Throughput</div>
            </div>

            <div className={cardStyle}>
               <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded uppercase tracking-widest">Nominal</span>
               </div>
               <div className="text-2xl font-bold text-white mb-1">{metrics.latency} <span className="text-xs text-zinc-500">ms</span></div>
               <div className="text-xs text-zinc-400 font-medium">Avg Reasoning Latency</div>
            </div>

            <div className={cardStyle}>
               <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div className="flex gap-1">
                     <div className="w-1 h-3 bg-amber-500 rounded-full"></div>
                     <div className="w-1 h-3 bg-amber-500 rounded-full"></div>
                     <div className="w-1 h-3 bg-zinc-700 rounded-full"></div>
                  </div>
               </div>
               <div className="text-2xl font-bold text-white mb-1">{metrics.memory.toFixed(1)} <span className="text-xs text-zinc-500">GB</span></div>
               <div className="text-xs text-zinc-400 font-medium">Agent Memory Allocation</div>
            </div>

            <div className={cardStyle}>
               <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                    <Network className="w-5 h-5" />
                  </div>
                  <div className="h-2 w-12 bg-zinc-700 rounded-full overflow-hidden self-center">
                     <div className="h-full bg-amber-500 w-[75%] rounded-full"></div>
                  </div>
               </div>
               <div className="text-2xl font-bold text-white mb-1">{metrics.activeAgents} <span className="text-xs text-zinc-500">Clusters</span></div>
               <div className="text-xs text-zinc-400 font-medium">Active Intelligence Nodes</div>
            </div>
          </div>
        </section>

        {/* Performance Chart - SVG */}
        <section className="flex flex-col gap-4">
           <h2 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <BarChart className="w-4 h-4 text-amber-500" /> Response Distribution
          </h2>
          <div className={cardStyle}>
            <div className="h-[200px] w-full flex items-end gap-2 md:gap-3 px-2">
              {[65, 45, 80, 50, 90, 70, 40, 60, 30, 85, 55, 75].map((h, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-zinc-700/50 rounded-t-lg relative group transition-all duration-300 hover:bg-amber-500/20"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg"></div>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {h}%
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 px-2">
               {['00h', '04h', '08h', '12h', '16h', '20h'].map(t => (
                 <span key={t} className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{t}</span>
               ))}
            </div>
          </div>
        </section>

        {/* Reasoning Log - Vertical Flow */}
        <section className="flex flex-col gap-4">
           <h2 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-500" /> AI Reasoning Trace
          </h2>
          <div className="flex flex-col gap-0.5">
             {[
               { step: "INTAKE", msg: "Scanning binary schema for CSV consistency...", status: "completed", time: "0.2ms" },
               { step: "CLUSTERING", msg: "Distributing 4.2M rows across 8 worker shards...", status: "completed", time: "12.4ms" },
               { step: "OUTLIER_DETECTION", msg: "Identified 12 anomaly candidates in column 'Revenue'", status: "completed", time: "45.1ms" },
               { step: "VISUAL_GEN", msg: "Rendering dynamic distribution plot for 'User_Age'", status: "processing", time: "---" }
             ].map((log, i) => (
               <div 
                 key={i} 
                 className={`transition-all duration-500 flex items-center gap-4 py-4 px-6 bg-zinc-800 ${
                   isBordered ? 'border-l-2 border-amber-500/50' : 'border-l-2 border-transparent'
                 } ${i === 0 ? 'rounded-t-2xl' : ''} ${i === 3 ? 'rounded-b-2xl' : ''}`}
               >
                 <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                   log.status === 'completed' ? 'bg-amber-500/10 text-amber-500' : 'bg-zinc-700 text-zinc-500 animate-pulse'
                 }`}>
                   {log.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                 </div>
                 
                 <div className="flex-1">
                   <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{log.step}</span>
                      <span className="text-[10px] text-zinc-600 font-mono">{log.time}</span>
                   </div>
                   <p className="text-xs text-zinc-300 font-medium">{log.msg}</p>
                 </div>

                 {log.status === 'processing' && (
                   <div className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                   </div>
                 )}
               </div>
             ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 pb-12 text-center">
           <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em]">
             Authorized Intelligence Explorer // v4.2.0-stable
           </p>
        </footer>

      </div>
    </div>
  );
};

export default VisualExplorer;
