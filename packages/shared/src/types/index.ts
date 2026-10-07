// ============================================================
// Fixli Shared Types
// Used by both API (NestJS) and Mobile (Expo) apps
// ============================================================

// ── Common ───────────────────────────────────────────────────

export interface IMoney {
  amount: number; // Integer minor units (e.g. cents)
  currency: string; // ISO 4217 currency code (e.g. 'USD')
}

// ── User & Auth ──────────────────────────────────────────────

export enum UserType {
  CUSTOMER = 'customer',
  WORKER = 'worker',
  ADMIN = 'admin',
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  type: UserType;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
}

export type AuthFlowState = 'LOGIN' | 'SIGNUP_ROLE_SELECTION' | 'SIGNUP_FORM';

// ── Job Categories ───────────────────────────────────────────

export enum JobCategory {
  PLUMBING = 'PLUMBING',
  ELECTRICAL = 'ELECTRICAL',
  CARPENTRY = 'CARPENTRY',
  MECHANICS = 'MECHANICS',
  PAINTING = 'PAINTING',
  CLEANING = 'CLEANING',
  HVAC = 'HVAC',
  GENERAL_HANDYMAN = 'GENERAL_HANDYMAN',
  SALON = 'SALON',
  CAR_SERVICES = 'CAR_SERVICES',
  OTHER = 'OTHER',
}

export const JOB_CATEGORY_DISPLAY_NAMES: Record<JobCategory, string> = {
  [JobCategory.PLUMBING]: 'Plumbing',
  [JobCategory.ELECTRICAL]: 'Electrical',
  [JobCategory.CARPENTRY]: 'Carpentry',
  [JobCategory.MECHANICS]: 'Mechanics',
  [JobCategory.PAINTING]: 'Painting',
  [JobCategory.CLEANING]: 'Cleaning',
  [JobCategory.HVAC]: 'HVAC',
  [JobCategory.GENERAL_HANDYMAN]: 'General Handyman',
  [JobCategory.SALON]: 'Salon',
  [JobCategory.CAR_SERVICES]: 'Car Services',
  [JobCategory.OTHER]: 'Other',
};

// ── Subcategories ────────────────────────────────────────────

export interface ISubCategory {
  id: string;
  name: string; // Translation key
}

// ── Job / Service Analysis ───────────────────────────────────

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

export type PriceEstimateValue = 'Affordable' | 'Moderate' | 'Premium' | 'Requires Quote';

export interface IServiceAnalysis {
  jobType: JobCategory;
  urgency: UrgencyLevel;
  severity: SeverityLevel;
  estimatedDuration?: string;
  priceEstimate?: PriceEstimateValue;
  isEmergency?: boolean;
}

// ── Job Requests ─────────────────────────────────────────────

export enum JobStatus {
  CREATED = 'CREATED',
  MATCHES_FOUND = 'MATCHES_FOUND',
  AWAITING_WORKER = 'AWAITING_WORKER',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface IJobRequest {
  id: string;
  customerId: string;
  customerName: string;
  description: string;
  jobType: JobCategory;
  urgency?: string;
  severity?: string;
  estimatedDuration?: string;
  priceEstimate?: string;
  isEmergency?: boolean;
  imageUrl?: string;
  status: JobStatus;
  location?: string;
  requestedDate?: string;
  assignedWorkerId?: string;
  paymentAmount?: number;
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Worker ───────────────────────────────────────────────────

export enum ActivationStatus {
  ACTIVE = 'ACTIVE',
  PENDING_REVIEW = 'PENDING_REVIEW',
  INACTIVE = 'INACTIVE',
}

export enum VerificationStatus {
  NONE = 'NONE',
  SUBMITTED = 'SUBMITTED',
  CHECKED = 'CHECKED',
  VERIFIED = 'VERIFIED',
}

export interface IWorkerVerificationDetails {
  idVerifiedStatus: VerificationStatus;
  backgroundCheckStatus: VerificationStatus;
  referencesStatus: VerificationStatus;
}

export interface IDaySchedule {
  isActive: boolean;
  startTime: string;
  endTime: string;
}

export interface IWorkingHours {
  monday: IDaySchedule;
  tuesday: IDaySchedule;
  wednesday: IDaySchedule;
  thursday: IDaySchedule;
  friday: IDaySchedule;
  saturday: IDaySchedule;
  sunday: IDaySchedule;
}

export interface IWorker {
  id: string;
  name: string;
  email?: string;
  skills: JobCategory[];
  rating: number;
  homeAddress?: string;
  workAddress?: string;
  availability?: string;
  profileImageUrl?: string;
  hourlyRateRange?: string;
  isVerified: boolean;
  bio?: string;
  experienceYears: number;
  licenseDetails?: string;
  isLicenseVerified?: boolean;
  hasInsurance?: boolean;
  distance?: number;
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
  workingHours?: IWorkingHours;
  serviceRadius: number;
  notificationPreferences?: {
    newJobAlerts: boolean;
    messageAlerts: boolean;
  };
  minimumCallOutFee?: number;
  activationStatus: ActivationStatus;
  verificationDetails: IWorkerVerificationDetails;
}

// ── Chat ─────────────────────────────────────────────────────

export interface IChatMessage {
  id: string;
  threadId: string;
  senderId: string;
  receiverId: string;
  text: string;
  isRead: boolean;
  createdAt: string;
}

export interface IChatThread {
  id: string;
  jobRequestId?: string;
  lastMessageAt?: string;
  participants: Pick<IUser, 'id' | 'name' | 'profileImageUrl'>[];
  messages?: IChatMessage[];
  createdAt: string;
  updatedAt: string;
}

// ── Service Packages & Subscriptions ─────────────────────────

export interface IServicePackage {
  id: string;
  name: string;
  description?: string;
  categoryName: JobCategory;
  includedFeatures: string[];
  indicativePrice?: string;
  iconName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  categoryName: JobCategory;
  frequency?: string;
  pricePerTerm?: string;
  benefits: string[];
  iconName?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Navigation Types ─────────────────────────────────────────

export type CustomerPage = 'SERVICE_FLOW' | 'BOOKINGS' | 'CHAT' | 'PROFILE' | 'SETTINGS';

export type WorkerPage =
  | 'DASHBOARD'
  | 'JOB_REQUESTS'
  | 'MY_PROFILE'
  | 'PERFORMANCE_ANALYTICS'
  | 'AR_TOOLS'
  | 'SCHEDULING_SYSTEM'
  | 'PROJECTS'
  | 'PAYMENTS'
  | 'CHAT'
  | 'SETTINGS';

export type CustomerFlowState =
  | 'SELECTING_SERVICE'
  | 'AI_ANALYZING'
  | 'SHOWING_MATCHES'
  | 'BROWSING_CATEGORIES'
  | 'VIEWING_WORKER_PROFILE';

export type ProjectsPageTab = 'CURRENT' | 'COMPLETED' | 'PENDING_OFFERS';
export type PaymentTimeFilter = 'ALL_TIME' | 'THIS_YEAR' | 'THIS_MONTH' | 'THIS_WEEK';
