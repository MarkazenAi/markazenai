import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 60000, // 60 seconds for AI operations
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Authentication
  register: async (email: string, password: string, language: string = 'en') => {
    const response = await api.post('/auth/register', { email, password, language });
    return response.data;
  },
  
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', null, { params: { email, password } });
    return response.data;
  },
  
  // AI Chat
  chat: async (message: string, user_id: string, session_id?: string) => {
    const response = await api.post('/ai/chat', { message, user_id, session_id, model: 'gpt-4o' });
    return response.data;
  },
  
  getChatHistory: async (user_id: string, session_id: string) => {
    const response = await api.get(`/ai/chat/history/${user_id}/${session_id}`);
    return response.data;
  },
  
  // Image Generation
  generateImage: async (prompt: string, user_id: string) => {
    const response = await api.post('/ai/image/generate', { prompt, user_id, quality: '8K', model: 'gpt-image-1' });
    return response.data;
  },
  
  // Voice
  voiceToText: async (audio_base64: string, user_id: string) => {
    const response = await api.post('/ai/voice/to-text', { audio_base64, user_id });
    return response.data;
  },
  
  textToSpeech: async (text: string, user_id: string, voice: string = 'alloy') => {
    const response = await api.post('/ai/voice/to-speech', { text, user_id, voice });
    return response.data;
  },
  
  // PDF
  analyzePDF: async (pdf_base64: string, user_id: string, analysis_type: string = 'summary') => {
    const response = await api.post('/ai/pdf/analyze', { pdf_base64, user_id, analysis_type });
    return response.data;
  },
  
  // Creative Tools
  faceSwap: async (source_image_base64: string, target_image_base64: string, user_id: string) => {
    const response = await api.post('/creative/face-swap', { source_image_base64, target_image_base64, user_id });
    return response.data;
  },
  
  removeBackground: async (image_base64: string, user_id: string) => {
    const response = await api.post('/creative/remove-bg', { image_base64, user_id });
    return response.data;
  },
  
  // Business AI
  businessAnalysis: async (data: any, user_id: string, analysis_type: string) => {
    const response = await api.post('/business/analyze', { data, user_id, analysis_type });
    return response.data;
  },
  
  // Manufacturing
  createOrder: async (order: any) => {
    const response = await api.post('/manufacturing/order', order);
    return response.data;
  },
  
  getOrders: async (user_id: string) => {
    const response = await api.get(`/manufacturing/orders/${user_id}`);
    return response.data;
  },
  
  // IoT
  controlDevice: async (device_id: string, command: string, user_id: string, parameters?: any) => {
    const response = await api.post('/iot/control', { device_id, command, user_id, parameters });
    return response.data;
  },
  
  getDevices: async (user_id: string) => {
    const response = await api.get(`/iot/devices/${user_id}`);
    return response.data;
  },
  
  // Social Media
  createPost: async (post: any) => {
    const response = await api.post('/social/post', post);
    return response.data;
  },
  
  getPosts: async (user_id: string) => {
    const response = await api.get(`/social/posts/${user_id}`);
    return response.data;
  },
  
  // Email
  sendEmail: async (email: any) => {
    const response = await api.post('/email/send', email);
    return response.data;
  },
  
  // Education
  educationTutor: async (subject: string, topic: string, question: string, user_id: string) => {
    const response = await api.post('/education/tutor', null, { params: { subject, topic, question, user_id } });
    return response.data;
  },
  
  // Legal
  legalAnalysis: async (document: string, user_id: string, analysis_type: string) => {
    const response = await api.post('/legal/analyze', { document, user_id, analysis_type });
    return response.data;
  },
  
  // Travel
  travelPlan: async (destination: string, start_date: string, end_date: string, budget: number, preferences: string[], user_id: string) => {
    const response = await api.post('/travel/plan', { destination, start_date, end_date, budget, preferences, user_id });
    return response.data;
  },
  
  // Utilities
  generateQR: async (data: string, user_id: string) => {
    const response = await api.post('/utils/qr-generate', { data, user_id });
    return response.data;
  },
  
  // Notes
  createNote: async (note: any) => {
    const response = await api.post('/notes', note);
    return response.data;
  },
  
  getNotes: async (user_id: string) => {
    const response = await api.get(`/notes/${user_id}`);
    return response.data;
  },
  
  // Todos
  createTodo: async (todo: any) => {
    const response = await api.post('/todos', todo);
    return response.data;
  },
  
  getTodos: async (user_id: string) => {
    const response = await api.get(`/todos/${user_id}`);
    return response.data;
  },
  
  // History
  saveHistory: async (item: any) => {
    const response = await api.post('/history', item);
    return response.data;
  },
  
  getHistory: async (user_id: string, module?: string) => {
    const response = await api.get(`/history/${user_id}`, { params: { module } });
    return response.data;
  },
  
  // Health Check
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
