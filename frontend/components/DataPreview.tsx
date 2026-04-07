import React from 'react';
import { DataPreviewResponse } from '../services/apiService';
import { Check, ClipboardList, Database, Info, Layers, Table as TableIcon, TrendingUp, Hash } from 'lucide-react';

interface DataPreviewProps {
  data: DataPreviewResponse;
}

const DataPreview: React.FC<DataPreviewProps> = ({ data }) => {
  const { columns, head, shape, stats } = data;

  return (
    <div className="flex flex-col gap-6 animate-fade-in h-full overflow-hidden">
      {/* Premium Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/[0.03] backdrop-blur-xl p-5 rounded-2xl border border-white/10 relative overflow-hidden group shadow-lg">
          <div className="absolute top-[-20%] right-[-10%] w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 group-hover:scale-150 transition-all duration-700" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/20 flex items-center justify-center">
               <Layers className="w-4 h-4 text-primary" />
            </div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Observations</span>
          </div>
          <p className="text-4xl font-black text-white relative z-10 tracking-tight">{shape[0].toLocaleString()}</p>
        </div>
        
        <div className="bg-white/[0.03] backdrop-blur-xl p-5 rounded-2xl border border-white/10 relative overflow-hidden group shadow-lg">
          <div className="absolute bottom-[-20%] left-[-10%] w-24 h-24 bg-accent/20 rounded-full blur-2xl group-hover:bg-accent/30 group-hover:scale-150 transition-all duration-700" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/20 flex items-center justify-center">
               <ClipboardList className="w-4 h-4 text-accent" />
            </div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Features</span>
          </div>
          <p className="text-4xl font-black text-white relative z-10 tracking-tight">{shape[1]}</p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl p-5 rounded-2xl border border-white/10 relative overflow-hidden group shadow-lg">
          <div className="absolute top-[-20%] right-[-10%] w-24 h-24 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 group-hover:scale-150 transition-all duration-700" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/20 flex items-center justify-center">
               <Hash className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Numeric Col</span>
          </div>
          <p className="text-4xl font-black text-white relative z-10 tracking-tight">
            {Object.values(stats?.data_types || {}).filter((t: any) => t.includes('int') || t.includes('float')).length}
          </p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl p-5 rounded-2xl border border-white/10 relative overflow-hidden group shadow-lg">
          <div className="absolute bottom-[-20%] left-[-10%] w-24 h-24 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 group-hover:scale-150 transition-all duration-700" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-zinc-500/20 border border-zinc-500/20 flex items-center justify-center">
               <Info className="w-4 h-4 text-zinc-400" />
            </div>
             <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Missing Val</span>
          </div>
          <p className="text-4xl font-black text-white relative z-10 tracking-tight">
            {(Object.values(stats?.missing_values || {}) as any[]).reduce((a: number, b: any) => a + (Number(b) || 0), 0)}
          </p>
        </div>
      </div>

      {/* Main Dataset Table Area */}
      <div className="flex-1 min-h-0 bg-white/[0.02] backdrop-blur-3xl rounded-[2rem] overflow-hidden flex flex-col border border-white/10 shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        <div className="px-6 py-4 border-b border-white/10 bg-black/40 flex items-center justify-between relative z-10">
           <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
                 <TableIcon className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Dataset Workspace</h3>
              <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20">PREVIEW (5 ROWS)</span>
           </div>
           <div className="flex items-center gap-5 text-[11px] text-slate-400 font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-primary" /> Parse OK</span>
              <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-accent" /> Stats Ready</span>
           </div>
        </div>

        <div className="flex-1 overflow-auto p-0 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent relative z-10">
          <table className="w-full text-left border-collapse min-w-max">
            <thead className="sticky top-0 bg-background border-b border-white/10 z-20 shadow-md">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className="px-6 py-4 border-r border-white/5 last:border-r-0">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-bold text-zinc-200 uppercase tracking-widest">{col}</span>
                      <span className="text-[10px] font-mono text-primary/80 uppercase px-2 py-0.5 bg-primary/10 rounded w-max border border-primary/20">
                         {stats?.data_types?.[col]?.split('.').pop() || 'unknown'}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {head.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-white/[0.04] transition-colors group even:bg-white/[0.01]">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4 text-sm text-slate-300 font-medium group-hover:text-white transition-colors border-r border-white/5 last:border-r-0">
                      {row[col] === null || row[col] === undefined ? 
                        <span className="text-destructive font-mono text-[10px] uppercase opacity-70 bg-destructive/10 px-2 py-1 rounded">null</span> : 
                        String(row[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mini Stats Summary */}
      <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-lg">
         <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-slate-500" /> Statistical Distribution
         </h4>
         <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/10">
            <table className="w-full text-left text-[11px]">
               <thead>
                  <tr className="text-slate-500 font-mono border-b border-white/10">
                     <th className="pb-3 pr-6 font-semibold uppercase tracking-widest">Metrics</th>
                     {columns.slice(0, 8).filter(col => stats?.summary?.[col]?.mean !== undefined).map((col, i) => (
                        <th key={i} className="pb-3 px-6 whitespace-nowrap text-white font-bold">{col}</th>
                     ))}
                  </tr>
               </thead>
               <tbody className="font-mono">
                  <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                     <td className="py-3 pr-6 text-accent font-bold uppercase tracking-widest">Mean</td>
                     {columns.slice(0, 8).filter(col => stats?.summary?.[col]?.mean !== undefined).map((col, i) => (
                        <td key={i} className="py-3 px-6 text-slate-300">{Number(stats?.summary?.[col]?.mean).toFixed(2)}</td>
                     ))}
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                     <td className="py-3 pr-6 text-primary font-bold uppercase tracking-widest">Median</td>
                     {columns.slice(0, 8).filter(col => stats?.summary?.[col]?.['50%'] !== undefined).map((col, i) => (
                        <td key={i} className="py-3 px-6 text-slate-300">{Number(stats?.summary?.[col]?.['50%']).toFixed(2)}</td>
                     ))}
                  </tr>
               </tbody>
            </table>
            {columns.length > 8 && <p className="mt-3 text-[10px] text-slate-500 italic text-center">* Showing first 8 numeric columns for quick stats</p>}
         </div>
      </div>
    </div>
  );
};

export default DataPreview;
