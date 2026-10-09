import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OfflineAction {
  id: string;
  type: 'POST_REQUEST' | 'STATUS_EVENT' | 'UPLOAD_EVIDENCE' | 'SEND_MESSAGE';
  payload: any;
  timestamp: number;
  retryCount: number;
}

export class OfflineQueueService {
  private static QUEUE_KEY = '@fixli_offline_queue';
  private static CACHE_KEYS = {
    CATALOG: '@fixli_catalog',
    TODAYS_JOBS: '@fixli_todays_jobs',
    JOB_STATES: '@fixli_job_states'
  };

  static async enqueue(action: Omit<OfflineAction, 'id' | 'timestamp' | 'retryCount'>) {
    const queue = await this.getQueue();
    const newAction: OfflineAction = {
      ...action,
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      retryCount: 0
    };
    
    queue.push(newAction);
    await AsyncStorage.setItem(this.QUEUE_KEY, JSON.stringify(queue));
    return newAction;
  }

  static async getQueue(): Promise<OfflineAction[]> {
    const data = await AsyncStorage.getItem(this.QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static async dequeue(id: string) {
    const queue = await this.getQueue();
    const newQueue = queue.filter(item => item.id !== id);
    await AsyncStorage.setItem(this.QUEUE_KEY, JSON.stringify(newQueue));
  }

  static async clearQueue() {
    await AsyncStorage.removeItem(this.QUEUE_KEY);
  }

  // --- Caching ---

  static async cacheData(key: keyof typeof this.CACHE_KEYS, data: any) {
    await AsyncStorage.setItem(this.CACHE_KEYS[key], JSON.stringify(data));
  }

  static async getCachedData(key: keyof typeof this.CACHE_KEYS) {
    const data = await AsyncStorage.getItem(this.CACHE_KEYS[key]);
    return data ? JSON.parse(data) : null;
  }
}
