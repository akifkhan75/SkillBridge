
import {
  type User,
  type Worker,
  type JobRequest,
  type ChatMessage,
  type ChatThread,
  type ServicePackage,
  type SubscriptionPlan,
} from '../types';
import type { SignupFormData } from '../features/auth/SignupPage';

// For Android emulator, use 'http://10.0.2.2:3002/api'. For iOS simulator or physical device on same network, use your machine's local IP.
const API_BASE_URL = 'http://localhost:3002/api';

// --- Auth ---
export const loginUserAPI = async (email: string, password: string): Promise<User | null> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Invalid credentials' }));
    throw new Error(errorData.message);
  }
  return response.json();
};

export const signupUserAPI = async (formData: SignupFormData): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Signup failed' }));
    throw new Error(errorData.message);
  }
  return response.json();
};

// --- Data Fetching ---
export const fetchAllUsersAPI = async (): Promise<User[]> => {
  const response = await fetch(`${API_BASE_URL}/users`);
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};

export const fetchWorkersAPI = async (): Promise<Worker[]> => {
  const response = await fetch(`${API_BASE_URL}/workers`);
  if (!response.ok) throw new Error('Failed to fetch workers');
  return response.json();
};

export const fetchWorkerByIdAPI = async (workerId: string): Promise<Worker | null> => {
    const response = await fetch(`${API_BASE_URL}/workers/${workerId}`);
    if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch worker details');
    }
    return response.json();
};

export const fetchJobRequestsAPI = async (): Promise<JobRequest[]> => {
  const response = await fetch(`${API_BASE_URL}/job-requests`);
  if (!response.ok) throw new Error('Failed to fetch job requests');
  const jobs = await response.json();
  // Ensure dates are Date objects
  return jobs.map((job: any) => ({
    ...job,
    createdAt: new Date(job.createdAt),
    ...(job.paymentDetails && {
      paymentDetails: { ...job.paymentDetails, paidDate: new Date(job.paymentDetails.paidDate) }
    })
  }));
};

export const createJobRequestAPI = async (jobData: Omit<JobRequest, 'id' | 'createdAt' | 'status'>): Promise<JobRequest> => {
    const response = await fetch(`${API_BASE_URL}/job-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
    });
    if (!response.ok) throw new Error('Failed to create job request');
    const newJob = await response.json();
    return { ...newJob, createdAt: new Date(newJob.createdAt) };
};

export const updateJobRequestAPI = async (jobId: string, updates: Partial<JobRequest>): Promise<JobRequest> => {
    const response = await fetch(`${API_BASE_URL}/job-requests/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update job request');
    const updatedJob = await response.json();
    return { ...updatedJob, createdAt: new Date(updatedJob.createdAt) };
};


export const updateWorkerProfileAPI = async (workerId: string, updates: Partial<Worker>): Promise<Worker> => {
    const response = await fetch(`${API_BASE_URL}/workers/${workerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update worker profile');
    return response.json();
};


// --- Chat ---
export const fetchChatThreadsAPI = async (userId: string): Promise<ChatThread[]> => {
  const response = await fetch(`${API_BASE_URL}/chat/threads/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch chat threads');
  return response.json();
};

export const fetchChatMessagesAPI = async (threadId: string): Promise<ChatMessage[]> => {
  const response = await fetch(`${API_BASE_URL}/chat/messages/${threadId}`);
  if (!response.ok) throw new Error('Failed to fetch chat messages');
  return response.json();
};

export const sendChatMessageAPI = async (messageData: Omit<ChatMessage, 'id' | 'timestamp' | 'isRead'>): Promise<ChatMessage> => {
  const response = await fetch(`${API_BASE_URL}/chat/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messageData),
  });
  if (!response.ok) throw new Error('Failed to send message');
  return response.json();
};

export const markMessagesAsReadAPI = async (threadId: string, userId: string): Promise<boolean> => {
    const response = await fetch(`${API_BASE_URL}/chat/mark-read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId, userId }),
    });
    if (!response.ok) {
        console.error('Failed to mark messages as read');
        return false;
    }
    const data = await response.json();
    return data.success;
};

// --- Static Data ---
export const fetchServicePackagesAPI = async (): Promise<ServicePackage[]> => {
  const response = await fetch(`${API_BASE_URL}/service-packages`);
  if (!response.ok) throw new Error('Failed to fetch service packages');
  return response.json();
};

export const fetchSubscriptionPlansAPI = async (): Promise<SubscriptionPlan[]> => {
  const response = await fetch(`${API_BASE_URL}/subscription-plans`);
  if (!response.ok) throw new Error('Failed to fetch subscription plans');
  return response.json();
};
