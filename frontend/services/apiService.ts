/// <reference types="vite/client" />
import axios from 'axios';

const resolveApiBaseUrl = () => {
  const configuredBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL;

  if (typeof window === 'undefined') {
    return configuredBaseUrl || 'https://csv-agent-72hj.onrender.com';
  }

  const browserHost = window.location.hostname || 'localhost';

  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/$/, '');
  }

  // If we're on localhost but no env var is set, default to the production backend 
  // or a local one if the user is developing locally.
  // Given the user's request, we'll default to the Render URL.
  return 'https://csv-agent-72hj.onrender.com';
};

const API_BASE_URL = resolveApiBaseUrl();

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

export const getApiErrorMessage = (error: unknown, fallback = 'Request failed') => {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;

    if (typeof detail === 'string' && detail.trim()) {
      return detail;
    }

    if (Array.isArray(detail) && detail.length > 0) {
      return detail
        .map((item) => {
          if (typeof item === 'string') {
            return item;
          }
          if (item && typeof item.msg === 'string') {
            return item.msg;
          }
          return JSON.stringify(item);
        })
        .join(' ');
    }

    if (typeof error.response?.data === 'string' && error.response.data.trim()) {
      return error.response.data;
    }

    if (!error.response) {
      return `Cannot connect to the backend server at ${API_BASE_URL}.`;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

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
  stats?: any;
}

export const authService = {
  // ... (keep existing)
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
  },

  getProfile: async () => {
    const response = await api.get('/api/me');
    return response.data;
  },

  checkHealth: async () => {
    try {
      // Hit the dedicated health endpoint
      await api.get('/api/health');
      return true;
    } catch (err: any) {
      // If we get a response (even a 404), the server is technically reachable
      if (err.response) return true;
      return false;
    }
  }
};

export const agentService = {
  chat: async (query: string, file?: File, datasetId?: number): Promise<string> => {
    const formData = new FormData();
    formData.append('query', query);
    if (file) {
      formData.append('file', file);
    }
    if (datasetId) {
      formData.append('dataset_id', datasetId.toString());
    }

    const response = await api.post<ApiResponse>('/chat', formData);
    return response.data.response;
  },

  reactAgent: async (query: string, file?: File, datasetId?: number): Promise<string> => {
    const formData = new FormData();
    formData.append('query', query);
    if (file) {
      formData.append('file', file);
    }
    if (datasetId) {
      formData.append('dataset_id', datasetId.toString());
    }

    const response = await api.post<ApiResponse>('/agent/react', formData);
    return response.data.response;
  },

  multiAgent: async (query: string, file?: File, datasetId?: number): Promise<string> => {
    const formData = new FormData();
    formData.append('query', query);
    if (file) {
      formData.append('file', file);
    }
    if (datasetId) {
      formData.append('dataset_id', datasetId.toString());
    }

    const response = await api.post<ApiResponse>('/agent/multi', formData);
    return response.data.response;
  },

  memoryAgent: async (query: string): Promise<string> => {
    const response = await api.post<ApiResponse>('/agent/memory', { query });
    return response.data.response;
  },

  previewData: async (file: File): Promise<DataPreviewResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<DataPreviewResponse>('/data/preview', formData);
    return response.data;
  },

  uploadDataset: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/dataset/upload', formData);
    return response.data;
  }
};
