import React from 'react';
import { DataPreviewResponse } from '../services/apiService';
import { Check, ClipboardList, Database, Info, Layers, Table as TableIcon, TrendingUp } from 'lucide-react';

interface DataPreviewProps {
  data: DataPreviewResponse;
}

const DataPreview: React.FC<DataPreviewProps> = ({ data }) => {
  const { columns, head, shape, stats } = data;

  return (
    <div className="flex flex-col gap-6 animate-fade-in h-full overflow-hidden">
      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-[-20%] right-[-10%] w-16 h-16 bg-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="flex items-center gap-3 mb-2">
            <Layers className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Observations</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{shape[0].toLocaleString()}</p>
        </div>
        
        <div className="glass-card p-4 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute bottom-[-20%] left-[-10%] w-16 h-16 bg-accent/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="flex items-center gap-3 mb-2">
            <ClipboardList className="w-4 h-4 text-accent" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Features</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{shape[1]}</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-[-20%] right-[-10%] w-16 h-16 bg-blue-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Numeric Col</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {Object.values(stats?.data_types || {}).filter((t: any) => t.includes('int') || t.includes('float')).length}
          </p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute bottom-[-20%] left-[-10%] w-16 h-16 bg-purple-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="flex items-center gap-3 mb-2">
            <Info className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Missing Val</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {(Object.values(stats?.missing_values || {}) as any[]).reduce((a: number, b: any) => a + (Number(b) || 0), 0)}
          </p>
        </div>
      </div>

      {/* Data Table Area */}
      <div className="flex-1 min-h-0 glass-panel rounded-3xl overflow-hidden flex flex-col border border-white/10 shadow-2xl">
        <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <TableIcon className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground">Dataset Workspace</h3>
              <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-mono rounded-full border border-primary/20">PREVIEW (5 ROWS)</span>
           </div>
           <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-primary" /> Parse OK</span>
              <span className="flex items-center gap-1.5"><TrendingUp className="w-3 h-3 text-accent" /> Stats Ready</span>
           </div>
        </div>

        <div className="flex-1 overflow-auto p-0 scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-max">
            <thead className="sticky top-0 bg-[#0f1117] z-10">
              <tr className="border-b border-white/10">
                {columns.map((col, idx) => (
                  <th key={idx} className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-foreground uppercase tracking-tight">{col}</span>
                      <span className="text-[9px] font-mono text-primary/60 uppercase">{stats?.data_types?.[col]?.split('.').pop() || 'unknown'}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {head.map((row, rowIdx) => (
                <tr key={rowIdx} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4 text-sm text-foreground/80 font-medium group-hover:text-primary transition-colors">
                      {row[col] === null || row[col] === undefined ? 
                        <span className="text-destructive font-mono text-[10px] uppercase opacity-70">null</span> : 
                        String(row[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Table (Mini summary) */}
      <div className="glass-panel rounded-2xl p-4 border border-white/5">
         <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
            <TrendingUp className="w-3 h-3" /> Statistical Distribution
         </h4>
         <div className="overflow-x-auto">
            <table className="w-full text-left text-[10px]">
               <thead>
                  <tr className="text-muted-foreground font-mono">
                     <th className="pb-2 pr-4">Metrics</th>
                     {columns.slice(0, 8).filter(col => stats?.summary?.[col]?.mean !== undefined).map((col, i) => (
                        <th key={i} className="pb-2 px-4 whitespace-nowrap">{col}</th>
                     ))}
                  </tr>
               </thead>
               <tbody className="font-mono">
                  <tr className="border-t border-white/5">
                     <td className="py-2 pr-4 text-accent font-bold uppercase">Mean</td>
                     {columns.slice(0, 8).filter(col => stats?.summary?.[col]?.mean !== undefined).map((col, i) => (
                        <td key={i} className="py-2 px-4">{Number(stats?.summary?.[col]?.mean).toFixed(2)}</td>
                     ))}
                  </tr>
                  <tr className="border-t border-white/5 hover:bg-primary/5 transition-colors">
                     <td className="py-2 pr-4 text-primary font-bold uppercase">Median</td>
                     {columns.slice(0, 8).filter(col => stats?.summary?.[col]?.['50%'] !== undefined).map((col, i) => (
                        <td key={i} className="py-2 px-4">{Number(stats?.summary?.[col]?.['50%']).toFixed(2)}</td>
                     ))}
                  </tr>
               </tbody>
            </table>
            {columns.length > 8 && <p className="mt-2 text-[9px] text-muted-foreground italic text-center">* Showing first 8 numeric columns for quick stats</p>}
         </div>
      </div>
    </div>
  );
};

export default DataPreview;
