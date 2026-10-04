// ============================================================
// SkillBridge API Service Layer
// Centralized API client with auth token management
// ============================================================

import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import type {
  IUser, IWorker, IJobRequest, IChatThread, IChatMessage,
  IServicePackage, ISubscriptionPlan, IAuthResponse,
} from '@skillbridge/shared';

const API_URL = Constants.expoConfig?.extra?.apiUrl
  || process.env.EXPO_PUBLIC_API_URL
  || 'http://localhost:3002/api';

// ── HTTP Client ──────────────────────────────────────────────

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await SecureStore.getItemAsync('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(Array.isArray(error.message) ? error.message[0] : error.message);
  }

  return response.json();
}

// ── Auth ─────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<IAuthResponse> {
  return request<IAuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function signup(data: {
  name: string; email: string; password: string; type: 'customer' | 'worker';
}): Promise<IAuthResponse> {
  return request<IAuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Users ────────────────────────────────────────────────────

export async function getUsers(): Promise<IUser[]> {
  return request<IUser[]>('/users');
}

// ── Workers ──────────────────────────────────────────────────

export async function getWorkers(filters?: { skill?: string; minRating?: number }): Promise<IWorker[]> {
  const params = new URLSearchParams();
  if (filters?.skill) params.append('skill', filters.skill);
  if (filters?.minRating) params.append('minRating', String(filters.minRating));
  const query = params.toString() ? `?${params.toString()}` : '';
  return request<IWorker[]>(`/workers${query}`);
}

export async function getWorkerById(id: string): Promise<IWorker> {
  return request<IWorker>(`/workers/${id}`);
}

export async function updateWorkerProfile(id: string, data: Partial<IWorker>): Promise<IWorker> {
  return request<IWorker>(`/workers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// ── Jobs ─────────────────────────────────────────────────────

export async function getJobRequests(filters?: { status?: string; jobType?: string }): Promise<IJobRequest[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.jobType) params.append('jobType', filters.jobType);
  const query = params.toString() ? `?${params.toString()}` : '';
  return request<IJobRequest[]>(`/job-requests${query}`);
}

export async function createJobRequest(data: Partial<IJobRequest>): Promise<IJobRequest> {
  return request<IJobRequest>('/job-requests', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateJobRequest(id: string, data: Partial<IJobRequest>): Promise<IJobRequest> {
  return request<IJobRequest>(`/job-requests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// ── AI ───────────────────────────────────────────────────────

export async function analyzeServiceRequest(description: string, imageBase64?: string) {
  return request<{
    jobType: string; urgency: string; severity: string;
    estimatedDuration: string; priceEstimate: string; isEmergency: boolean;
  }>('/ai/analyze', {
    method: 'POST',
    body: JSON.stringify({ description, imageBase64 }),
  });
}

// ── Chat ─────────────────────────────────────────────────────

export async function getChatThreads(userId: string): Promise<IChatThread[]> {
  return request<IChatThread[]>(`/chat/threads/${userId}`);
}

export async function getChatMessages(threadId: string): Promise<IChatMessage[]> {
  return request<IChatMessage[]>(`/chat/messages/${threadId}`);
}

export async function sendChatMessage(data: {
  threadId: string; receiverId: string; text: string;
}): Promise<IChatMessage> {
  return request<IChatMessage>('/chat/messages', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function markMessagesAsRead(threadId: string, userId: string): Promise<boolean> {
  const result = await request<{ success: boolean }>('/chat/mark-read', {
    method: 'POST',
    body: JSON.stringify({ threadId, userId }),
  });
  return result.success;
}

// ── Services ─────────────────────────────────────────────────

export async function getServicePackages(): Promise<IServicePackage[]> {
  return request<IServicePackage[]>('/service-packages');
}

export async function getSubscriptionPlans(): Promise<ISubscriptionPlan[]> {
  return request<ISubscriptionPlan[]>('/subscription-plans');
}
