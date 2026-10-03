import { io, Socket } from 'socket.io-client';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { IChatMessage } from '@skillbridge/shared';

const API_URL = Constants.expoConfig?.extra?.apiUrl
  || process.env.EXPO_PUBLIC_API_URL
  || 'http://localhost:3002';

class SocketService {
  private socket: Socket | null = null;
  private messageListeners: ((msg: IChatMessage) => void)[] = [];
  
  public async connect(userId: string) {
    if (this.socket) {
      this.socket.disconnect();
    }
    
    this.socket = io(`${API_URL}/chat`, {
      query: { userId },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    this.socket.on('newMessage', (message: IChatMessage) => {
      this.messageListeners.forEach(listener => listener(message));
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
    });
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public sendMessage(threadId: string, receiverId: string, text: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('sendMessage', { threadId, receiverId, text });
    }
  }

  public onNewMessage(callback: (msg: IChatMessage) => void) {
    this.messageListeners.push(callback);
    return () => {
      this.messageListeners = this.messageListeners.filter(l => l !== callback);
    };
  }
}

export const socketService = new SocketService();
