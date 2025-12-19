
import React from 'react';
import { 
  BarChart3, 
  BrainCircuit, 
  Users, 
  Database, 
  Terminal, 
  Settings,
  LogOut,
  DatabaseZap
} from 'lucide-react';
import { AgentType } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const navItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Data Overview' },
    { id: AgentType.REACT, icon: BrainCircuit, label: 'EDA Reasoning' },
    { id: AgentType.MULTI, icon: Users, label: 'Expert Cluster' },
    { id: AgentType.MEMORY, icon: Database, label: 'Schema Store' },
    { id: AgentType.GENERAL, icon: Terminal, label: 'Direct Console' },
  ];

  return (
    <div className="w-64 bg-[#0a0f1d] border-r border-gray-800 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <DatabaseZap className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">DataFlow</h1>
          <p className="text-[10px] text-emerald-500 font-bold tracking-widest uppercase -mt-1">EDA AGENT v1.0</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-600/20' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-emerald-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button 
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-gray-100 hover:bg-gray-800 rounded-lg transition-all"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Configuration</span>
        </button>
        <button 
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Terminate Session</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
