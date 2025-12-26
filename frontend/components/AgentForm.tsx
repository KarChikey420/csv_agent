import React, { useState, useRef } from 'react';
import { Send, Upload, FileText, Loader2, Sparkles, Terminal, AlertCircle, Play } from 'lucide-react';
import { AgentType } from '../types';
import { agentService } from '../services/apiService';

interface AgentFormProps {
  type: AgentType;
}

const AgentForm: React.FC<AgentFormProps> = ({ type }) => {
  const [query, setQuery] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let response: string;
      switch (type) {
        case AgentType.REACT:
          response = await agentService.reactAgent(query, file || undefined);
          break;
        case AgentType.MULTI:
          response = await agentService.multiAgent(query, file || undefined);
          break;
        case AgentType.MEMORY:
          response = await agentService.memoryAgent(query);
          break;
        default:
          response = await agentService.chat(query, file || undefined);
      }
      setResult(response);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'An error occurred while processing your request.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const getAgentTitle = () => {
    switch (type) {
      case AgentType.REACT: return 'Reasoning Engine';
      case AgentType.MULTI: return 'Expert Cluster';
      case AgentType.MEMORY: return 'Knowledge Store';
      default: return 'General Agent';
    }
  };

  const getAgentDescription = () => {
    switch (type) {
      case AgentType.REACT: return 'Executes multi-step reasoning tasks with file analysis capabilities.';
      case AgentType.MULTI: return 'Collaborative multi-agent system for complex problem solving.';
      case AgentType.MEMORY: return 'Retrieves and interacts with stored knowledge and schemas.';
      default: return 'Standard interaction agent.';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] gap-6 max-w-6xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-3">
             {type === AgentType.REACT && <Sparkles className="w-8 h-8 text-amber-400" />}
             {type === AgentType.MULTI && <Sparkles className="w-8 h-8 text-blue-400" />}
             {type === AgentType.MEMORY && <Sparkles className="w-8 h-8 text-purple-400" />}
             {getAgentTitle()}
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">{getAgentDescription()}</p>
        </div>
        <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-3 border border-primary/20 bg-primary/5">
           <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </div>
          <span className="text-primary text-sm font-bold tracking-wide">SYSTEM READY</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Input Column */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-panel rounded-2xl p-6 shadow-xl border border-white/5 flex flex-col gap-6 relative overflow-hidden">
             {/* Decorative background */}
             <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>

             <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6 h-full">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-primary" />
                    Input Query
                  </label>
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Describe your task or question..."
                    className="w-full bg-black/20 text-foreground placeholder-muted-foreground rounded-xl p-4 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none resize-none min-h-[150px] transition-all"
                  />
                </div>

                {type !== AgentType.MEMORY && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      Data Source (Optional)
                    </label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-white/5 transition-all group ${file ? 'bg-primary/5 border-primary/30' : ''}`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {file ? (
                        <div className="text-center">
                          <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
                          <p className="text-sm font-medium text-foreground">{file.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary mb-2 transition-colors" />
                          <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground">Click to upload file</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-auto">
                  <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground py-4 rounded-xl font-bold tracking-wide transition-all shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        PROCESSING...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 fill-current" />
                        RUN AGENT
                      </>
                    )}
                  </button>
                </div>
             </form>
          </div>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-2 h-full min-h-[500px]">
          <div className="glass-panel rounded-2xl h-full shadow-xl border border-white/5 flex flex-col overflow-hidden bg-[#0f1117]/80">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/5">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Terminal className="w-5 h-5 text-muted-foreground" />
                Execution Output
              </h3>
              {result && (
                <span className="text-xs font-mono text-primary px-2 py-1 rounded bg-primary/10 border border-primary/20">
                  STATUS: COMPLETE
                </span>
              )}
            </div>
            
            <div className="flex-1 overflow-auto p-6 font-mono text-sm">
              {loading ? (
                 <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                    <div className="relative">
                      <div className="w-16 h-16 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-primary/10 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <p className="text-muted-foreground animate-pulse tracking-widest uppercase text-xs">Generating Response...</p>
                 </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in">
                  <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Execution Failed</h3>
                  <p className="text-destructive max-w-md">{error}</p>
                </div>
              ) : result ? (
                <div className="prose prose-invert max-w-none animate-fade-in">
                  <div className="whitespace-pre-wrap leading-relaxed text-gray-300">
                    {result}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                  <Terminal className="w-16 h-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground max-w-sm">
                    Ready to process. Enter a query and run the agent to see results here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentForm;
