import { io, Socket } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import { IChatMessage } from '@fixli/shared';

import { SOCKET_URL } from '../config';

class SocketService {
  private socket: Socket | null = null;
  private messageListeners: ((msg: IChatMessage) => void)[] = [];
  private locationListeners: ((data: { workerId: string; latitude: number; longitude: number; heading?: number }) => void)[] = [];
  
  public async connect() {
    if (this.socket) {
      this.socket.disconnect();
    }
    
    // Identity is proven by the access token; the server ignores any user id we might send.
    const token = await SecureStore.getItemAsync('authToken');
    if (!token) return;

    this.socket = io(`${SOCKET_URL}/chat`, {
      auth: { token },
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

  public sendMessage(threadId: string, text: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('sendMessage', { threadId, text });
    }
  }

  public sendLocation(jobId: string, latitude: number, longitude: number, heading?: number) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('locationUpdate', { jobId, latitude, longitude, heading });
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
