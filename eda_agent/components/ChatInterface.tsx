
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
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full bg-[#0a0f1d] shadow-2xl rounded-2xl overflow-hidden border border-gray-800">
      {/* Header */}
      <div className="px-6 py-4 bg-[#111827] border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <LineChart className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">{type} EDA Agent</h2>
            <p className="text-xs text-gray-500 font-mono">NODE_ENDPOINT: /agent/{type}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-emerald-500 uppercase tracking-tighter">Cluster Ready</span>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40">
            <div className="w-20 h-20 bg-gray-800 rounded-3xl flex items-center justify-center mb-2">
              <Database className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-white">No Dataset Loaded</h3>
            <p className="max-w-xs text-gray-400 text-sm">
              Upload a CSV, Excel or JSON file to start the exploratory analysis pipeline.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                msg.role === 'user' ? 'bg-emerald-600' : 
                msg.role === 'system' ? 'bg-red-900/40' : 'bg-gray-800 border border-gray-700'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5 text-emerald-400" />}
              </div>
              <div className="flex flex-col space-y-2">
                <div className={`px-4 py-3 rounded-2xl shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : msg.role === 'system'
                    ? 'bg-red-900/20 text-red-200 border border-red-900/50 rounded-tl-none'
                    : 'bg-[#1e293b] text-gray-100 border border-gray-700 rounded-tl-none'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  {msg.files && msg.files.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.files.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded text-[10px] font-mono border border-white/10">
                          <Database className="w-3 h-3 text-emerald-400" />
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
          <div className="flex justify-start">
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-emerald-400 text-xs font-bold uppercase animate-pulse">Processing Data...</span>
                <span className="text-[10px] text-gray-600 font-mono">Inference engine: Gemini 3 Cluster</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#111827] border-t border-gray-800">
        <div className="flex items-end gap-3">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-400 hover:text-emerald-400 transition-colors bg-gray-800 rounded-xl border border-gray-700"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden" 
            multiple
          />
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={`Analyze dataset with ${type} agent...`}
              className="w-full bg-[#0f172a] text-white placeholder-gray-600 rounded-xl py-3 px-4 pr-12 border border-gray-800 focus:border-emerald-500 focus:outline-none resize-none min-h-[52px] max-h-32"
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || (!inputValue.trim() && attachedFiles.length === 0)}
              className="absolute right-2 bottom-2 p-2 text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:bg-gray-700 rounded-lg transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
