import { create } from 'zustand';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatState {
  sessions: { [sessionId: string]: ChatMessage[] };
  currentSessionId: string | null;
  addMessage: (sessionId: string, message: ChatMessage) => void;
  clearSession: (sessionId: string) => void;
  setCurrentSession: (sessionId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  sessions: {},
  currentSessionId: null,
  
  addMessage: (sessionId, message) =>
    set((state) => ({
      sessions: {
        ...state.sessions,
        [sessionId]: [...(state.sessions[sessionId] || []), message],
      },
    })),
  
  clearSession: (sessionId) =>
    set((state) => {
      const { [sessionId]: removed, ...rest } = state.sessions;
      return { sessions: rest };
    }),
  
  setCurrentSession: (sessionId) => set({ currentSessionId: sessionId }),
}));
