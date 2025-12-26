
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X, Loader2, Database, User, Bot, LineChart } from 'lucide-react';
import { Message, AgentType, FileInfo } from '../types';
import { getAgentResponse } from '../services/geminiService';

interface ChatInterfaceProps {
  type: AgentType;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ type }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() && attachedFiles.length === 0) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: Date.now(),
      files: attachedFiles.map(f => ({ name: f.name, size: f.size, type: f.type }))
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setAttachedFiles([]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const file = attachedFiles.length > 0 ? attachedFiles[0] : undefined;
      const response = await getAgentResponse(inputValue || "Run exploratory analysis", type, history, file);

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        thinking: response.thinking,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error(error);
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: "Pipeline error: Analysis cluster failed to process the request. Verify your dataset format.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full glass-panel shadow-2xl rounded-2xl overflow-hidden relative">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-primary/5 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg border border-primary/20">
            <LineChart className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground uppercase tracking-tight">{type} EDA Agent</h2>
            <p className="text-xs text-muted-foreground font-mono">NODE_ENDPOINT: /agent/{type}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-xs font-bold text-primary uppercase tracking-tighter shadow-glow">Cluster Ready</span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-8 z-10"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-60">
            <div className="w-24 h-24 bg-card border-2 border-dashed border-border rounded-3xl flex items-center justify-center relative group">
              <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all rounded-3xl"></div>
              <Database className="w-10 h-10 text-primary relative z-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Awaiting Dataset</h3>
              <p className="max-w-xs text-muted-foreground text-sm mt-2">
                Upload a CSV, Excel or JSON file to initialize the exploratory analysis pipeline.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg ${msg.role === 'user' ? 'bg-primary text-primary-foreground' :
                msg.role === 'system' ? 'bg-destructive/20 text-destructive' : 'bg-card border border-border text-primary'
                }`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-6 h-6" />}
              </div>

              <div className="flex flex-col space-y-2 min-w-0">
                <div className={`px-6 py-4 rounded-3xl shadow-lg backdrop-blur-sm ${msg.role === 'user'
                  ? 'bg-primary/10 text-foreground border border-primary/20 rounded-tr-none'
                  : msg.role === 'system'
                    ? 'bg-destructive/10 text-destructive-foreground border border-destructive/20 rounded-tl-none'
                    : 'glass-panel text-foreground rounded-tl-none border-white/5'
                  }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                  {msg.thinking && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <details className="group">
                        <summary className="text-xs text-muted-foreground cursor-pointer flex items-center gap-2 hover:text-primary transition-colors">
                          <span className="uppercase font-bold tracking-wider">Analysis Trace</span>
                          <div className="h-px bg-border flex-1"></div>
                        </summary>
                        <div className="mt-2 text-xs font-mono text-muted-foreground bg-black/20 p-3 rounded-lg border border-white/5">
                          {msg.thinking}
                        </div>
                      </details>
                    </div>
                  )}

                  {msg.files && msg.files.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.files.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-background/50 rounded-lg text-xs font-mono border border-white/10 text-primary">
                          <Database className="w-3 h-3" />
                          <span>{f.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center shadow-lg">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="h-2 w-24 bg-primary/20 rounded-full overflow-hidden">
                  <div className="h-full bg-primary animate-[shimmer_1s_infinite] w-full origin-left-right"></div>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Processing Data Stream</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-black/20 backdrop-blur-md z-10">
        <div className="flex items-end gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3.5 text-muted-foreground hover:text-primary transition-colors bg-card hover:bg-card/80 rounded-xl border border-border shadow-sm group"
          >
            <Paperclip className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
          <div className="flex-1 relative group">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={`Communicate with ${type} agent cluster...`}
              className="w-full bg-[#1e293b] text-white placeholder-gray-400 rounded-xl py-3.5 px-5 pr-14 border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none resize-none min-h-[56px] max-h-32 transition-all shadow-inner"
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || (!inputValue.trim() && attachedFiles.length === 0)}
              className="absolute right-2 bottom-2 p-2.5 text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:bg-muted disabled:text-muted-foreground rounded-lg transition-all shadow-lg hover:shadow-primary/20 hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        {attachedFiles.length > 0 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {attachedFiles.map((file, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-xs text-primary group">
                <span className="max-w-[150px] truncate">{file.name}</span>
                <button onClick={() => removeFile(i)} className="hover:text-destructive transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
