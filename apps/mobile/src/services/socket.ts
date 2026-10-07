import { io, Socket } from 'socket.io-client';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { IChatMessage } from '@fixli/shared';

const API_URL = Constants.expoConfig?.extra?.apiUrl
  || process.env.EXPO_PUBLIC_API_URL
  || 'http://192.168.100.66:3002';

class SocketService {
  private socket: Socket | null = null;
  private messageListeners: ((msg: IChatMessage) => void)[] = [];
  private locationListeners: ((data: { workerId: string; latitude: number; longitude: number; heading?: number }) => void)[] = [];
  
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

    this.socket.on('locationUpdate', (data: { workerId: string; latitude: number; longitude: number; heading?: number }) => {
      this.locationListeners.forEach(listener => listener(data));
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

  public sendLocation(receiverId: string, latitude: number, longitude: number, heading?: number) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('locationUpdate', { receiverId, latitude, longitude, heading });
    }
  }

  public onNewMessage(callback: (msg: IChatMessage) => void) {
    this.messageListeners.push(callback);
    return () => {
      this.messageListeners = this.messageListeners.filter(l => l !== callback);
    };
  }

  public onLocationUpdate(callback: (data: { workerId: string; latitude: number; longitude: number; heading?: number }) => void) {
    this.locationListeners.push(callback);
    return () => {
      this.locationListeners = this.locationListeners.filter(l => l !== callback);
    };
  }
}

export const socketService = new SocketService();
