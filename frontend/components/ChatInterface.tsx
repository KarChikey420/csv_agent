import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Loader2, User, Bot, Paperclip, X } from 'lucide-react';
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
      content: 'Hello! I am DataFlow, your AI data analyst. What would you like to explore about your data?',
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
        content: `**Error:** ${getApiErrorMessage(err)}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent relative z-10"
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in group/msg`}
          >
            <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center border shadow-lg ${
              msg.role === 'user' 
                ? 'bg-[#18181b] border-white/10 text-slate-300' 
                : 'bg-primary/20 border-primary/30 text-primary'
            }`}>
              {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            
            <div className={`max-w-[85%] px-6 py-4 rounded-[1.5rem] text-[15px] leading-relaxed shadow-xl ${
              msg.role === 'user' 
                ? 'bg-primary text-white font-medium shadow-primary/20 rounded-tr-sm' 
                : 'bg-[#18181b]/80 border border-white/10 text-slate-200 rounded-tl-sm backdrop-blur-md'
            }`}>
              <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-a:text-accent prose-sm max-w-none">
                <ReactMarkdown
                   urlTransform={(uri) => uri}
                   components={{
                    img: ({ node, ...props }) => (
                      <div className="my-5 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group/img relative">
                         <img {...props} className="w-full h-auto" />
                         <div className="absolute top-3 right-3 opacity-0 group-hover/img:opacity-100 transition-opacity">
                            <span className="px-3 py-1.5 bg-black/80 backdrop-blur-xl rounded-lg text-[10px] uppercase font-bold tracking-widest text-primary border border-primary/20">Data Visualization</span>
                         </div>
                      </div>
                    )
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
              <div className={`text-[10px] mt-3 font-mono opacity-0 group-hover/msg:opacity-50 transition-opacity ${msg.role === 'user' ? 'text-right text-primary-foreground' : 'text-slate-500'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex gap-4 animate-fade-in items-end">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center animate-pulse">
              <Bot className="w-5 h-5 text-primary/50" />
            </div>
            <div className="bg-[#18181b]/80 border border-white/10 px-6 py-5 rounded-[1.5rem] rounded-tl-sm flex items-center gap-3 backdrop-blur-md max-w-[85%] shadow-xl">
               <div className="flex space-x-1.5 items-center">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
               </div>
               <span className="text-xs text-slate-400 font-medium ml-2">Reasoning...</span>
            </div>
          </div>
        )}
      </div>

      {/* Modern Floating Input Area */}
      <div className="p-4 lg:p-6 bg-transparent relative z-10 w-full mb-2">
        <form onSubmit={handleSend} className="relative flex flex-col items-center">
          {selectedFile && (
            <div className="w-full flex mb-2 px-2 animate-fade-in">
               <div className="flex items-center gap-2 px-3 py-1.5 bg-[#18181b] border border-white/10 rounded-full shadow-lg">
                  <Paperclip className="w-3.5 h-3.5 text-accent" />
                  <span className="text-[11px] font-mono text-slate-300 truncate max-w-[150px] uppercase">{selectedFile.name}</span>
                  <button 
                  type="button" 
                  onClick={onFileRemove}
                  className="w-5 h-5 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors text-slate-500 hover:text-white"
                  >
                  <X className="w-3 h-3" />
                  </button>
               </div>
            </div>
          )}
          
          <div className="w-full relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-[2rem] blur opacity-20 group-focus-within:opacity-50 transition duration-500"></div>
              <div className="relative flex items-center bg-[#0a0515] border border-white/10 rounded-[2rem] shadow-2xl p-1.5">
                 <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Message DataFlow AI..."
                    disabled={loading}
                    className="w-full bg-transparent text-white pl-6 pr-14 py-4 text-[15px] focus:outline-none transition-all placeholder:text-slate-500 font-medium"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                     <button 
                        type="submit"
                        disabled={(!input.trim() && !loading) || loading}
                        className="w-10 h-10 bg-primary/20 hover:bg-primary border border-primary/30 hover:border-primary text-primary hover:text-white rounded-full flex items-center justify-center disabled:opacity-40 disabled:hover:bg-primary/20 disabled:hover:text-primary transition-all duration-300 shadow-lg primary-glow disabled:shadow-none"
                     >
                       {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
                     </button>
                  </div>
              </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
