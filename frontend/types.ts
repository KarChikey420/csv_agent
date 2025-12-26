
export enum AgentType {
  REACT = 'react',
  MULTI = 'multi',
  MEMORY = 'memory',
  GENERAL = 'general'
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  thinking?: string;
  files?: FileInfo[];
}

export interface FileInfo {
  name: string;
  type: string;
  size: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface SystemStats {
  status: 'online' | 'offline' | 'degraded';
  uptime: string;
  requestsCount: number;
  activeAgents: number;
}
