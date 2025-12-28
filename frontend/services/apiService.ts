import axios from 'axios';
import { AgentType } from '../types';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface ApiResponse {
  response: string;
}

export interface DataPreviewResponse {
  filename: string;
  columns: string[];
  head: any[];
  shape: number[];
}

export const authService = {
  signup: async (name: string, email: string, password: string) => {
    const response = await api.post('/signup', { name, email, password });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/login', { email, password });
    localStorage.setItem('token', response.data.access_token);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export const agentService = {
  chat: async (query: string, file?: File): Promise<string> => {
    const formData = new FormData();
    formData.append('query', query);
    if (file) {
      formData.append('file', file);
    }

    const response = await api.post<ApiResponse>('/chat', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.response;
  },

  reactAgent: async (query: string, file?: File): Promise<string> => {
    const formData = new FormData();
    formData.append('query', query);
    if (file) {
      formData.append('file', file);
    }

    const response = await api.post<ApiResponse>('/agent/react', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.response;
  },

  multiAgent: async (query: string, file?: File): Promise<string> => {
    const formData = new FormData();
    formData.append('query', query);
    if (file) {
      formData.append('file', file);
    }

    const response = await api.post<ApiResponse>('/agent/multi', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.response;
  },

  memoryAgent: async (query: string): Promise<string> => {
    const response = await api.post<ApiResponse>('/agent/memory', { query });
    return response.data.response;
  },

  previewData: async (file: File): Promise<DataPreviewResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<DataPreviewResponse>('/data/preview', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};