import React, { useState, useRef } from 'react';
import { Upload, Database, Bot, BarChart3, Eraser, Loader2, Sparkles, AlertCircle, Brain, ChevronRight } from 'lucide-react';
import { agentService, DataPreviewResponse, getApiErrorMessage } from '../services/apiService';
import DataPreview from './DataPreview';
import ChatInterface from './ChatInterface';
import AdvancedIntelligence from './AdvancedIntelligence';

const DataDashboard: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<DataPreviewResponse | null>(null);
  const [datasetId, setDatasetId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'workshop' | 'intelligence'>('workshop');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setLoading(true);
      setError(null);

      try {
        const response = await agentService.uploadDataset(selectedFile);
        setPreview(response.preview);
        if (response.dataset_id) {
          setDatasetId(response.dataset_id);
        }
      } catch (err) {
        console.error("Upload failed", err);
        setError(getApiErrorMessage(err, "Failed to analyze data. Please ensure it's a valid CSV."));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setDatasetId(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-6 animate-fade-in relative z-10">
      {!preview ? (
        <div className="flex-1 flex items-center justify-center">
           <div className="max-w-2xl w-full bg-white/[0.02] p-12 rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-2xl text-center relative overflow-hidden group">
              <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-primary/20 rounded-full blur-[100px] group-hover:bg-primary/30 transition-colors duration-700" />
              <div className="absolute bottom-[-20%] right-[-20%] w-64 h-64 bg-accent/20 rounded-full blur-[100px] group-hover:bg-accent/30 transition-colors duration-700" />
              
              <div className="relative z-10">
                 <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(var(--primary),0.2)]">
                    <Database className="w-12 h-12 text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                 </div>
                 
                 <h2 className="text-5xl font-extrabold mb-3 tracking-tighter text-white">
                    Data<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Flow</span>
                 </h2>
                 <p className="text-muted-foreground mb-12 text-sm uppercase tracking-[0.3em] font-medium">Intelligence Engine</p>
                 
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   onChange={handleFileChange} 
                   accept=".csv" 
                   className="hidden" 
                 />
                 
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   disabled={loading}
                   className="group relative px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-bold text-lg shadow-[0_0_30px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-4 mx-auto disabled:opacity-50 overflow-hidden"
                 >
                   <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                   <span className="relative z-10 flex items-center gap-3">
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />}
                      {loading ? "INITIALIZING DATA..." : "INGEST DATASET"}
                   </span>
                 </button>
                
                {error && (
                  <div className="mt-8 p-5 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-start gap-4 text-destructive text-left animate-fade-in backdrop-blur-md">
                    <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    <div>
                       <strong className="block text-sm font-bold mb-1">Ingestion Failed</strong>
                       <span className="text-sm opacity-90">{error}</span>
                    </div>
                  </div>
                )}
                
                <div className="mt-14 flex items-center justify-center gap-8 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                   <div className="flex items-center gap-2"><BarChart3 className="w-4 h-4 text-slate-700" /> Visualizations</div>
                   <div className="w-1 h-1 bg-slate-700 rounded-full" />
                   <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-slate-700" /> Anomalies</div>
                   <div className="w-1 h-1 bg-slate-700 rounded-full" />
                   <div className="flex items-center gap-2"><Bot className="w-4 h-4 text-slate-700" /> AI Insights</div>
                </div>
              </div>
           </div>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
            {/* Analysis Area (Left/Main) - Takes 7 columns */}
            <div className="lg:col-span-7 h-full flex flex-col min-h-0">
               {/* Premium Header / Tab Switcher */}
               <div className="flex items-center justify-between mb-4">
                  <div className="bg-black/40 backdrop-blur-xl p-1.5 rounded-2xl border border-white/5 flex items-center shadow-lg">
                     <button 
                        onClick={() => setActiveTab('workshop')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                           activeTab === 'workshop' 
                           ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-100' 
                           : 'text-slate-400 hover:text-white hover:bg-white/5 scale-95'
                        }`}
                     >
                        <Database className="w-4 h-4" /> Data Workshop
                     </button>
                     <button 
                        onClick={() => setActiveTab('intelligence')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                           activeTab === 'intelligence' 
                           ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/20 scale-100' 
                           : 'text-slate-400 hover:text-white hover:bg-white/5 scale-95'
                        }`}
                     >
                        <Brain className="w-4 h-4" /> AI Intelligence
                     </button>
                  </div>
                  
                  <button 
                     onClick={handleReset}
                     className="group flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 transition-all shadow-md"
                  >
                     <Eraser className="w-4 h-4 group-hover:rotate-12 transition-transform" /> New Session
                  </button>
               </div>

               {/* Tab Content Area */}
               <div className="flex-1 min-h-0 relative animate-fade-in" key={activeTab}>
                  {activeTab === 'workshop' ? (
                     <DataPreview data={preview} />
                  ) : (
                     <div className="h-full w-full bg-white/[0.02] rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl p-2 relative overflow-hidden">
                        <AdvancedIntelligence isMainStage={true} />
                     </div>
                  )}
               </div>
            </div>

            {/* Query Engine (Right/Sidebar) - Takes 5 columns */}
            <div className="lg:col-span-5 h-full flex flex-col min-h-0 relative">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/10">
                     <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                     <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        Query Engine <ChevronRight className="w-4 h-4 text-slate-500" />
                     </h2>
                  </div>
               </div>
               <div className="flex-1 min-h-0">
                  <ChatInterface selectedFile={file} datasetId={datasetId} onFileRemove={handleReset} />
               </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default DataDashboard;
