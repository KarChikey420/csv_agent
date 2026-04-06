import React, { useState, useRef } from 'react';
import { Upload, Database, Bot, BarChart3, Eraser, Loader2, Sparkles, AlertCircle, Brain } from 'lucide-react';
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
        // We use the specialized upload that also returns stats
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
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-6 animate-fade-in relative">
      {!preview ? (
        <div className="flex-1 flex items-center justify-center">
           <div className="max-w-xl w-full glass-panel p-12 rounded-[2.5rem] border border-white/10 shadow-2xl text-center relative overflow-hidden group">
              {/* Decorative blobs */}
              <div className="absolute top-[-10%] left-[-10%] w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute bottom-[-10%] right-[-10%] w-32 h-32 bg-accent/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              
              <div className="relative z-10">
                 <div className="w-24 h-24 bg-primary/10 border border-primary/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 animate-pulse-slow primary-glow">
                    <Database className="w-12 h-12 text-primary" />
                 </div>
                 <h2 className="text-5xl font-black mb-4 tracking-tighter text-glow">Data<span className="text-primary italic">Flow</span></h2>
                 <p className="text-primary/60 mb-12 text-xl font-medium uppercase tracking-widest opacity-80">Intelligence Engine</p>
                 
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
                   className="px-12 py-6 bg-primary text-primary-foreground rounded-3xl font-black text-2xl shadow-[0_0_50px_-12px_rgba(var(--primary),0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 mx-auto disabled:opacity-50"
                 >
                   {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
                   {loading ? "ANALYZING..." : "INGEST DATASET"}
                 </button>
                
                {error && (
                  <div className="mt-8 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center gap-3 text-destructive animate-fade-in">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                )}
                
                <div className="mt-12 grid grid-cols-3 gap-6 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-40">
                   <div className="flex flex-col items-center gap-2 italic">
                      <BarChart3 className="w-4 h-4" />
                      Visualizations
                   </div>
                   <div className="flex flex-col items-center gap-2 italic">
                      <Sparkles className="w-4 h-4" />
                      Anomalies
                   </div>
                   <div className="flex flex-col items-center gap-2 italic">
                      <Bot className="w-4 h-4" />
                      AI Insights
                   </div>
                </div>
              </div>
           </div>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0">
            {/* Analysis Area (Left/Main) */}
            <div className="lg:col-span-3 h-full flex flex-col min-h-0">
               {/* Premium Tab Switcher */}
               <div className="flex items-center justify-between mb-6 px-2">
                  <div className="flex items-center gap-1 p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
                     <button 
                        onClick={() => setActiveTab('workshop')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                           activeTab === 'workshop' 
                           ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                           : 'hover:bg-white/5 text-muted-foreground'
                        }`}
                     >
                        <Database className="w-4 h-4" />
                        Data Workshop
                     </button>
                     <button 
                        onClick={() => setActiveTab('intelligence')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                           activeTab === 'intelligence' 
                           ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/20' 
                           : 'hover:bg-white/5 text-muted-foreground'
                        }`}
                     >
                        <Brain className="w-4 h-4" />
                        AI Intelligence
                     </button>
                  </div>
                  
                  <button 
                     onClick={handleReset}
                     className="flex items-center gap-2 px-3 py-1.5 glass-panel rounded-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors group"
                  >
                     <Eraser className="w-3 h-3 group-hover:animate-bounce" /> New Session
                  </button>
               </div>

               {/* Tab Content */}
               <div className="flex-1 min-h-0 animate-fade-in" key={activeTab}>
                  {activeTab === 'workshop' ? (
                     <DataPreview data={preview} />
                  ) : (
                     <div className="h-full">
                        <AdvancedIntelligence isMainStage={true} />
                     </div>
                  )}
               </div>
            </div>

            <div className="lg:col-span-2 h-full flex flex-col min-h-0">
               <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex items-center gap-3 mb-4 px-2">
                     <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-primary" />
                     </div>
                     <h2 className="text-xl font-bold">Query Engine</h2>
                  </div>
                  <ChatInterface selectedFile={file} datasetId={datasetId} onFileRemove={handleReset} />
               </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default DataDashboard;
