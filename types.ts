export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isError?: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  text?: string;
}
