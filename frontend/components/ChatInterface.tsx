import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Loader2, User, Bot, Paperclip, X, Image as ImageIcon } from 'lucide-react';
import { agentService, getApiErrorMessage } from '../services/apiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isImage?: boolean;
}

interface ChatInterfaceProps {
  selectedFile: File | null;
  datasetId: number | null;
  onFileRemove: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedFile, datasetId, onFileRemove }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I am DataFlow, your AI data analyst. Upload a CSV to begin our analysis.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() && !loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // If we have a datasetId, we don't need to send the raw file again.
      // This prevents net::ERR_UPLOAD_FILE_CHANGED.
      const response = await agentService.chat(
        input, 
        datasetId ? undefined : (selectedFile || undefined),
        datasetId || undefined
      );
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `Error: ${getApiErrorMessage(err)}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">DataFlow AI</h3>
            <p className="text-[10px] text-primary font-mono uppercase tracking-widest">Active Analysis Session</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}
          >
            <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center border ${
              msg.role === 'user' 
                ? 'bg-secondary border-white/10' 
                : 'bg-primary/10 border-primary/20'
            }`}>
              {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5 text-primary" />}
            </div>
            
            <div className={`max-w-[80%] px-5 py-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/20' 
                : 'glass-card border border-white/5 text-foreground/90'
            }`}>
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown
                   components={{
                    img: ({ node, ...props }) => (
                      <div className="my-4 rounded-xl overflow-hidden border border-white/10 shadow-xl group relative">
                         <img {...props} className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]" />
                         <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] uppercase font-bold tracking-tight">AI Generated Visualize</span>
                         </div>
                      </div>
                    )
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
              <div className={`text-[10px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-right' : ''}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary/40" />
            </div>
            <div className="glass-card border border-white/5 px-6 py-4 rounded-2xl flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Analysing Data...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white/5 border-t border-white/5">
        <form onSubmit={handleSend} className="relative flex items-center gap-3">
          {selectedFile && (
            <div className="absolute -top-12 left-0 flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full animate-fade-in">
              <Paperclip className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-bold text-primary truncate max-w-[150px] uppercase tracking-tight">{selectedFile.name}</span>
              <button 
                type="button" 
                onClick={onFileRemove}
                className="hover:text-destructive transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          
          <div className="flex-1 relative group">
             <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={selectedFile ? "Ask DataFlow about this dataset..." : "Upload a CSV to start..."}
                disabled={loading}
                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-5 pr-12 py-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                 <button 
                    type="submit"
                    disabled={(!input.trim() && !loading) || loading}
                    className="p-2 bg-primary rounded-xl text-primary-foreground shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
                 >
                   <Send className="w-5 h-5" />
                 </button>
              </div>
          </div>
        </form>
        <p className="text-[10px] text-center mt-4 text-muted-foreground uppercase tracking-[0.2em] font-medium opacity-50">
          Powered by DataFlow Reasoning Engine
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
