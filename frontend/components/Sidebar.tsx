
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
  setActiveTab: (tab: AgentType) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const navItems = [
    { id: AgentType.MULTI, icon: Users, label: 'Expert Cluster' },
    { id: AgentType.REACT, icon: BrainCircuit, label: 'EDA Reasoning' },
    { id: AgentType.MEMORY, icon: Database, label: 'Schema Store' },
  ];

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-screen fixed left-0 top-0 glass-panel">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 border border-primary/20">
          <DatabaseZap className="text-primary w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">DataFlow</h1>
          <p className="text-[10px] text-primary font-bold tracking-widest uppercase -mt-1">EDA AGENT v1.0</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as AgentType)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden ${activeTab === item.id
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
          >
            {activeTab === item.id && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
            )}
            <item.icon className={`w-5 h-5 transition-colors ${activeTab === item.id ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Configuration</span>
        </button>
        <button
          className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
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
