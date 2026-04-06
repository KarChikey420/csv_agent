import React, { useState, useRef } from 'react';
import { Upload, Database, Bot, BarChart3, Eraser, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { agentService, DataPreviewResponse, getApiErrorMessage } from '../services/apiService';
import DataPreview from './DataPreview';
import ChatInterface from './ChatInterface';

const DataDashboard: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<DataPreviewResponse | null>(null);
  const [datasetId, setDatasetId] = useState<number | null>(null);
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
                <div className="w-20 h-20 bg-primary/10 border border-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse-slow">
                   <Database className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-4xl font-bold mb-4 tracking-tight">DataFlow <span className="text-primary italic">Intelligence</span></h2>
                <p className="text-muted-foreground mb-10 text-lg">Upload your dataset to begin deep EDA analysis, outlier detection, and smart visualizations.</p>
                
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
                  className="px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-bold text-xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                  {loading ? "ANALYZING STRUCTURE..." : "INGEST DATASET"}
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
           {/* Data Preview Section (Left) */}
           <div className="lg:col-span-3 h-full flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-4 px-2">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center">
                       <BarChart3 className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="text-xl font-bold">Analysis Workspace</h2>
                 </div>
                 <button 
                    onClick={handleReset}
                    className="flex items-center gap-2 px-3 py-1.5 glass-panel rounded-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors group"
                 >
                    <Eraser className="w-3 h-3 group-hover:animate-bounce" /> New Session
                 </button>
              </div>
              <DataPreview data={preview} />
           </div>

           {/* Chat Section (Right) */}
           <div className="lg:col-span-2 h-full flex flex-col min-h-0">
              <div className="flex items-center gap-3 mb-4 px-2">
                 <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                 </div>
                 <h2 className="text-xl font-bold">Query Engine</h2>
              </div>
              <ChatInterface selectedFile={file} datasetId={datasetId} onFileRemove={handleReset} />
           </div>
        </div>
      )}
    </div>
  );
};

export default DataDashboard;
