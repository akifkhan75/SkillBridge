import type { FC } from 'react';
import type { SvgProps } from 'react-native-svg';

export enum JobCategory {
  PLUMBING = 'Plumbing',
  ELECTRICAL = 'Electrical',
  CARPENTRY = 'Carpentry',
  MECHANICS = 'Mechanics',
  PAINTING = 'Painting',
  CLEANING = 'Cleaning',
  HVAC = 'HVAC',
  GENERAL_HANDYMAN = 'General Handyman',
  SALON = 'Salon',
  CAR_SERVICES = 'Car Services',
  OTHER = 'Other',
}

export enum UrgencyLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  EMERGENCY = 'Emergency',
}

export enum SeverityLevel {
  MINOR = 'Minor',
  MODERATE = 'Moderate',
  MAJOR = 'Major',
  CRITICAL = 'Critical',
}

export interface User {
  id: string;
  name: string;
  email: string;
  type: 'customer' | 'worker';
  password?: string; // Added for signup, handle securely in a real app
  profileImageUrl?: string; // Added for chat display
  unreadMessagesCount?: number; // For navbar badge
}

export interface SubCategory {
  id:string;
  name: string; // This should be a translation key
}

export interface Category {
  id: string;
  name: JobCategory; // The enum value itself
  icon: FC<SvgProps>;
  subCategories: SubCategory[];
  color: string;
  textColor: string;
  description: string; // The translated string
}

export interface DaySchedule {
  isActive: boolean;
  startTime: string; // e.g., "09:00"
  endTime: string;   // e.g., "17:00"
}

export interface WorkingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export type VerificationStatus = 'NONE' | 'SUBMITTED' | 'IN_PROGRESS' | 'VERIFIED' | 'REJECTED' | 'PENDING_UPLOAD' | 'CHECKED';

export interface WorkerVerificationDetails {
  idVerifiedStatus: VerificationStatus;
  backgroundCheckStatus: VerificationStatus;
  referencesStatus: VerificationStatus;
}

export type WorkerActivationStatus = 'PENDING_REVIEW' | 'ACTIVE' | 'SUSPENDED' | 'NEEDS_VERIFICATION';


export interface Worker {
  id: string; // Should match a User id
  name: string;
  skills: JobCategory[];
  rating: number;
  homeAddress: string;
  workAddress?: string;
  availability: string;
  profileImageUrl: string;
  hourlyRateRange: string;
  isVerified: boolean; // This is the "Verified Pro" badge status
  bio: string;
  experienceYears: number;
  licenseDetails?: string;
  isLicenseVerified?: boolean; // Potentially legacy or specific license verification
  hasInsurance?: boolean;
  distance?: number; // in km, mocked for now
  equipment?: string[];
  portfolio?: {
    photoCount?: number;
    videoCount?: number;
    testimonialCount?: number;
  };
  performanceMetrics?: {
    averageResponseTime: string;
    completionRate: number;
    rehirePercentage: number;
  };
  isOnline: boolean;
  workingHours: WorkingHours;
  serviceRadius: number; // in km
  notificationPreferences?: {
    newJobAlerts: boolean;
    messageAlerts: boolean;
  };
  minimumCallOutFee?: number;
  activationStatus: WorkerActivationStatus;
  verificationDetails: WorkerVerificationDetails;
}

export type PriceEstimateValue = "Affordable" | "Moderate" | "Premium" | "Requires Quote";

export interface ServiceAnalysis {
  jobType: JobCategory;
  urgency: UrgencyLevel;
  severity: SeverityLevel;
  estimatedDuration?: string;
  priceEstimate?: PriceEstimateValue;
}

export type JobRequestStatus = 'Pending' | 'AI Analyzing' | 'Awaiting Worker' | 'Accepted' | 'In Progress' | 'Completed' | 'Cancelled' | 'Matches Found' | 'Declined';

export interface JobRequest {
  id:string;
  customerName: string;
  customerId: string; // Add customerId to link to User
  description: string;
  serviceAnalysis?: ServiceAnalysis;
  status: JobRequestStatus;
  location: string;
  requestedDate?: string;
  assignedWorkerId?: string;
  createdAt: Date;
  paymentDetails?: {
    amount: number;
    paidDate: Date;
  };
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
}

export interface Candidate {
  groundingMetadata?: GroundingMetadata;
}

export type CustomerFlowState =
  | 'SELECTING_SERVICE'
  | 'AI_ANALYZING'
  | 'SHOWING_MATCHES'
  | 'BROWSING_CATEGORIES'
  | 'VIEWING_WORKER_PROFILE';

export type CustomerPage = 'SERVICE_FLOW' | 'PROFILE' | 'SETTINGS';

export type WorkerPage =
  | 'DASHBOARD'
  | 'JOB_REQUESTS'
  | 'MY_PROFILE'
  | 'PERFORMANCE_ANALYTICS'
  | 'AR_TOOLS'
  | 'SCHEDULING_SYSTEM'
  | 'PROJECTS'
  | 'PAYMENTS'
  | 'SETTINGS';

export type ProjectsPageTab = 'CURRENT' | 'COMPLETED' | 'PENDING_OFFERS';

export type PaymentTimeFilter = 'ALL_TIME' | 'THIS_YEAR' | 'THIS_MONTH' | 'THIS_WEEK';

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  categoryName: JobCategory | string;
  includedFeatures: string[];
  indicativePrice: string;
  icon: FC<SvgProps>;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  categoryName: JobCategory | string;
  frequency: 'Monthly' | 'Quarterly' | 'Annually' | string;
  pricePerTerm: string;
  benefits: string[];
  icon: FC<SvgProps>;
}

export type AuthFlowState = 'LOGIN' | 'SIGNUP_ROLE_SELECTION' | 'SIGNUP_FORM';

// Chat Feature Types
export interface ChatMessage {
  id: string;
  threadId: string;
  senderId: string; // User ID of the sender
  receiverId: string; // User ID of the receiver
  text: string;
  timestamp: number; // Unix timestamp
  isRead: boolean;
}

export interface ChatThread {
  id:string;
  participantIds: [string, string]; // Array containing two User IDs
  lastMessageId?: string; // ID of the last message in this thread
  lastMessageTimestamp: number; // Unix timestamp of the last message
  jobRequestId?: string; // Optional: Link chat to a specific job request
}

// React Navigation Param Lists
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  CustomerDashboard: undefined;
  WorkerDashboard: undefined;
};

export type CustomerStackParamList = {
    ServiceFlow: undefined;
    Profile: undefined;
    Settings: undefined;
    WorkerProfile: { workerId: string };
};

export type WorkerDrawerParamList = {
    Dashboard: undefined;
    JobRequests: undefined;
    MyProfile: undefined;
    Settings: undefined;
    Projects: undefined;
    Payments: undefined;
    PerformanceAnalytics: undefined;
    SchedulingSystem: undefined;
    ArTools: undefined;
};
