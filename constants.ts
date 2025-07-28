import type { FC } from 'react';
import type { SvgProps } from 'react-native-svg';
import { JobCategory, type Worker, type JobRequest, UrgencyLevel, SeverityLevel, type User, type WorkingHours, type DaySchedule, type ServicePackage, type SubscriptionPlan, type WorkerVerificationDetails, type WorkerActivationStatus, type ChatMessage, type ChatThread, type SubCategory } from './types';
import { BriefcaseIcon } from './components/icons/BriefcaseIcon'; 
import { WrenchIcon } from './components/icons/WrenchIcon';
import { BoltIcon } from './components/icons/BoltIcon';
import { PaintBrushIcon } from './components/icons/PaintBrushIcon';
import { HammerIcon } from './components/icons/HammerIcon';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { RectangleStackIcon } from './components/icons/RectangleStackIcon';
import { ArrowPathIcon } from './components/icons/ArrowPathIcon';
import { ChatBubbleLeftRightIcon } from './components/icons/ChatBubbleLeftRightIcon';
import { FaceSmileIcon } from './components/icons/FaceSmileIcon';
import { TruckIcon } from './components/icons/TruckIcon';

export const APP_NAME_KEY = "navbar.appName"; // Key for translation

// MOCK DATA - To be primarily used by apiService.ts
// In a real app, this data would come from a backend.

export const MOCK_USER_CREDENTIALS: User[] = [
  { id: 'cust1', name: 'Alice Customer', email: 'customer@example.com', type: 'customer', password: 'password123', profileImageUrl: 'https://picsum.photos/seed/cust1/100' },
  { id: 'w1', name: 'Alice Johnson (Worker)', email: 'ajohnson@example.com', type: 'worker', password: 'password123', profileImageUrl: 'https://picsum.photos/seed/alice/200' },
  { id: 'w2', name: 'Bob Williams (Worker)', email: 'worker@example.com', type: 'worker', password: 'password123', profileImageUrl: 'https://picsum.photos/seed/bob/200' },
  { id: 'w3', name: 'Carol Davis (Worker)', email: 'cdavis@example.com', type: 'worker', password: 'password123', profileImageUrl: 'https://picsum.photos/seed/carol/200' },
  { id: 'w4', name: 'David Brown (Worker)', email: 'dbrown@example.com', type: 'worker', password: 'password123', profileImageUrl: 'https://picsum.photos/seed/david/200' },
  { id: 'w5', name: 'Eva Green (Worker)', email: 'egreen@example.com', type: 'worker', password: 'password123', profileImageUrl: 'https://picsum.photos/seed/eva/200' },
  { id: 'w6', name: 'Fiona Stylist (Worker)', email: 'fiona@example.com', type: 'worker', password: 'password123', profileImageUrl: 'https://picsum.photos/seed/fiona/200' },
  { id: 'w7', name: 'George Mechanic (Worker)', email: 'george@example.com', type: 'worker', password: 'password123', profileImageUrl: 'https://picsum.photos/seed/george/200' },
  { id: 'cust2', name: 'Michael Smith', email: 'msmith@example.com', type: 'customer', password: 'password123', profileImageUrl: 'https://picsum.photos/seed/cust2/100' },
  { id: 'cust3', name: 'Sarah Miller', email: 'smiller@example.com', type: 'customer', password: 'password123', profileImageUrl: 'https://picsum.photos/seed/cust3/100' },
  { id: 'cust4', name: 'John Doe', email: 'johndoe@example.com', type: 'customer', password: 'password123', profileImageUrl: 'https://picsum.photos/seed/cust4/100' },
];


const defaultDaySchedule: DaySchedule = { isActive: true, startTime: '09:00', endTime: '17:00' };
const weekendOffSchedule: DaySchedule = { isActive: false, startTime: '09:00', endTime: '17:00' };

export const defaultWorkingHours: WorkingHours = {
  monday: { ...defaultDaySchedule },
  tuesday: { ...defaultDaySchedule },
  wednesday: { ...defaultDaySchedule },
  thursday: { ...defaultDaySchedule },
  friday: { ...defaultDaySchedule },
  saturday: { ...weekendOffSchedule },
  sunday: { ...weekendOffSchedule },
};

export const defaultVerificationDetails: WorkerVerificationDetails = { // Export for apiService
  idVerifiedStatus: 'NONE',
  backgroundCheckStatus: 'NONE',
  referencesStatus: 'NONE',
};

const activeVerifiedDetails: WorkerVerificationDetails = {
  idVerifiedStatus: 'VERIFIED',
  backgroundCheckStatus: 'VERIFIED',
  referencesStatus: 'CHECKED',
};

// Interface for Category data with translation keys (still used directly by UI)
export interface I18nCategory {
  id: string;
  nameEnum: JobCategory; 
  icon: FC<SvgProps>;
  subCategories: SubCategory[]; 
  color: string;
  textColor: string;
  descriptionKey: string; 
}


export const CATEGORIES_DATA: I18nCategory[] = [
  {
    id: 'cat_plumbing',
    nameEnum: JobCategory.PLUMBING,
    icon: WrenchIcon,
    color: 'bg-blue-500',
    textColor: 'text-white',
    descriptionKey: 'category.plumbing.description',
    subCategories: [ 
      { id: 'sub_faucet_repair', name: 'subcategory.plumbing.faucet_repair' },
      { id: 'sub_toilet_repair', name: 'subcategory.plumbing.toilet_repair' },
      { id: 'sub_drain_cleaning', name: 'subcategory.plumbing.drain_cleaning' },
      { id: 'sub_leak_detection', name: 'subcategory.plumbing.leak_detection' },
      { id: 'sub_water_heater', name: 'subcategory.plumbing.water_heater' },
    ],
  },
  {
    id: 'cat_electrical',
    nameEnum: JobCategory.ELECTRICAL,
    icon: BoltIcon,
    color: 'bg-yellow-500',
    textColor: 'text-white',
    descriptionKey: 'category.electrical.description',
    subCategories: [
      { id: 'sub_lighting_fix', name: 'subcategory.electrical.lighting_installation_repair' }, 
      { id: 'sub_outlet_switch', name: 'subcategory.electrical.outlet_switch_repair_install' },
      { id: 'sub_wiring_issues', name: 'subcategory.electrical.wiring_rewiring_projects' },
      { id: 'sub_panel_upgrade', name: 'subcategory.electrical.electrical_panel_services' },
      { id: 'sub_appliance_wiring', name: 'subcategory.electrical.appliance_wiring' },
    ],
  },
  {
    id: 'cat_salon',
    nameEnum: JobCategory.SALON,
    icon: FaceSmileIcon,
    color: 'bg-pink-500',
    textColor: 'text-white',
    descriptionKey: 'category.salon.description',
    subCategories: [
      { id: 'sub_makeup', name: 'subcategory.salon.makeup_artist' },
      { id: 'sub_waxing', name: 'subcategory.salon.waxing_services' },
      { id: 'sub_mani_pedi', name: 'subcategory.salon.manicure_pedicure' },
      { id: 'sub_facial', name: 'subcategory.salon.facial_treatments' },
    ],
  },
  {
    id: 'cat_car_services',
    nameEnum: JobCategory.CAR_SERVICES,
    icon: TruckIcon,
    color: 'bg-slate-600',
    textColor: 'text-white',
    descriptionKey: 'category.car_services.description',
    subCategories: [
        { id: 'sub_car_detailing', name: 'subcategory.car_services.car_detailing' },
        { id: 'sub_car_service', name: 'subcategory.car_services.routine_car_service' },
        { id: 'sub_car_mechanic', name: 'subcategory.car_services.general_mechanic' },
        { id: 'sub_auto_electrician', name: 'subcategory.car_services.auto_electrician' },
    ],
  },
  {
    id: 'cat_carpentry',
    nameEnum: JobCategory.CARPENTRY,
    icon: HammerIcon,
    color: 'bg-orange-500',
    textColor: 'text-white',
    descriptionKey: 'category.carpentry.description',
    subCategories: [
      { id: 'sub_custom_furniture', name: 'subcategory.carpentry.custom_furniture_building' },
      { id: 'sub_deck_repair', name: 'subcategory.carpentry.deck_fence_repair' },
      { id: 'sub_cabinetry', name: 'subcategory.carpentry.cabinet_installation_repair' },
      { id: 'sub_trim_molding', name: 'subcategory.carpentry.trim_molding_work' },
      { id: 'sub_door_window_frames', name: 'subcategory.carpentry.door_window_framing' },
    ],
  },
  {
    id: 'cat_painting',
    nameEnum: JobCategory.PAINTING,
    icon: PaintBrushIcon,
    color: 'bg-purple-500',
    textColor: 'text-white',
    descriptionKey: 'category.painting.description',
    subCategories: [
      { id: 'sub_interior_paint', name: 'subcategory.painting.interior_room_painting' },
      { id: 'sub_exterior_paint', name: 'subcategory.painting.exterior_house_painting' },
      { id: 'sub_cabinet_paint', name: 'subcategory.painting.cabinet_painting_refinishing' },
      { id: 'sub_wallpaper', name: 'subcategory.painting.wallpaper_removal_installation' },
    ],
  },
  {
    id: 'cat_cleaning',
    nameEnum: JobCategory.CLEANING,
    icon: SparklesIcon,
    color: 'bg-green-500',
    textColor: 'text-white',
    descriptionKey: 'category.cleaning.description',
    subCategories: [
      { id: 'sub_house_cleaning', name: 'subcategory.cleaning.standard_house_cleaning' },
      { id: 'sub_deep_cleaning', name: 'subcategory.cleaning.deep_cleaning_services' },
      { id: 'sub_office_cleaning', name: 'subcategory.cleaning.office_commercial_cleaning' },
      { id: 'sub_window_cleaning', name: 'subcategory.cleaning.window_cleaning' },
    ],
  },
  {
    id: 'cat_hvac',
    nameEnum: JobCategory.HVAC,
    icon: BriefcaseIcon, 
    color: 'bg-teal-500',
    textColor: 'text-white',
    descriptionKey: 'category.hvac.description',
    subCategories: [
      { id: 'sub_ac_repair', name: 'subcategory.hvac.air_conditioner_repair' },
      { id: 'sub_furnace_repair', name: 'subcategory.hvac.heater_furnace_repair' },
      { id: 'sub_hvac_install', name: 'subcategory.hvac.hvac_system_installation' },
      { id: 'sub_hvac_maintenance', name: 'subcategory.hvac.hvac_maintenance' },
    ],
  },
   {
    id: 'cat_general_handyman',
    nameEnum: JobCategory.GENERAL_HANDYMAN,
    icon: BriefcaseIcon, 
    color: 'bg-gray-500',
    textColor: 'text-white',
    descriptionKey: 'category.general_handyman.description',
    subCategories: [
      { id: 'sub_assembly', name: 'subcategory.general_handyman.furniture_assembly' },
      { id: 'sub_mounting', name: 'subcategory.general_handyman.tv_mounting_shelf_installation' },
      { id: 'sub_minor_repairs', name: 'subcategory.general_handyman.minor_home_repairs' },
      { id: 'sub_picture_hanging', name: 'subcategory.general_handyman.picture_mirror_hanging' },
    ],
  },
];


export const MOCK_WORKERS: Worker[] = [
  {
    id: 'w1',
    name: 'Alice Johnson (Worker)',
    skills: [JobCategory.PLUMBING, JobCategory.HVAC],
    rating: 4.8,
    homeAddress: '123 Main St, New York, NY',
    availability: 'Mon-Fri, 8am-6pm',
    profileImageUrl: 'https://picsum.photos/seed/alice/200',
    hourlyRateRange: '$60-$80',
    isVerified: true, 
    bio: 'Experienced plumber and HVAC technician with over 10 years in the field. Committed to quality work and customer satisfaction.',
    experienceYears: 10,
    licenseDetails: 'Master Plumber #MP12345, HVAC Certified #HVAC67890',
    isLicenseVerified: true,
    hasInsurance: true,
    distance: 5.2,
    equipment: ['Professional Drain Snake', 'Pipe Wrench Set', 'HVAC Gauge Manifold Set'],
    portfolio: { photoCount: 15, videoCount: 3, testimonialCount: 8 },
    performanceMetrics: { averageResponseTime: "1.2 hours", completionRate: 98, rehirePercentage: 40 },
    isOnline: true,
    workingHours: defaultWorkingHours,
    serviceRadius: 20,
    notificationPreferences: { newJobAlerts: true, messageAlerts: true },
    minimumCallOutFee: 50,
    activationStatus: 'ACTIVE',
    verificationDetails: activeVerifiedDetails,
  },
  {
    id: 'w2',
    name: 'Bob Williams (Worker)',
    skills: [JobCategory.ELECTRICAL, JobCategory.GENERAL_HANDYMAN],
    rating: 4.5,
    homeAddress: '456 Market St, San Francisco, CA',
    availability: 'Weekends Only',
    profileImageUrl: 'https://picsum.photos/seed/bob/200',
    hourlyRateRange: '$55-$70',
    isVerified: true, 
    bio: 'Certified electrician specializing in residential wiring and repairs. Also skilled in various handyman tasks.',
    experienceYears: 7,
    licenseDetails: 'Licensed Electrician #ELE98765',
    isLicenseVerified: true,
    hasInsurance: false,
    distance: 15.7,
    equipment: ['Multimeter', 'Wire Strippers', 'Power Drill Kit'],
    portfolio: { photoCount: 8, videoCount: 1, testimonialCount: 5 },
    performanceMetrics: { averageResponseTime: "2.5 hours", completionRate: 92, rehirePercentage: 25 },
    isOnline: false,
    workingHours: {
        ...defaultWorkingHours,
        monday: {...weekendOffSchedule},
        tuesday: {...weekendOffSchedule},
        wednesday: {...weekendOffSchedule},
        thursday: {...weekendOffSchedule},
        friday: {...weekendOffSchedule},
        saturday: {...defaultDaySchedule, startTime: '10:00', endTime: '18:00'},
        sunday: {...defaultDaySchedule, startTime: '10:00', endTime: '16:00'},
    },
    serviceRadius: 30,
    notificationPreferences: { newJobAlerts: true, messageAlerts: false },
    minimumCallOutFee: undefined,
    activationStatus: 'ACTIVE',
    verificationDetails: {...activeVerifiedDetails, backgroundCheckStatus: 'SUBMITTED'},
  },
  {
    id: 'w3',
    name: 'Carol Davis (Worker)',
    skills: [JobCategory.CARPENTRY, JobCategory.PAINTING],
    rating: 4.9,
    homeAddress: '789 Oak Ave, New York, NY', 
    availability: 'Available Now',
    profileImageUrl: 'https://picsum.photos/seed/carol/200',
    hourlyRateRange: '$50-$65',
    isVerified: false, 
    bio: 'Detail-oriented carpenter and painter. Passionate about transforming spaces with craftsmanship and color.',
    experienceYears: 12,
    licenseDetails: 'General Contractor #GC54321',
    isLicenseVerified: false, 
    hasInsurance: true,
    distance: 2.1,
    equipment: ['Circular Saw', 'Nail Gun', 'Paint Sprayer', 'Full Brush Set'],
    portfolio: { photoCount: 25, videoCount: 5, testimonialCount: 12 },
    performanceMetrics: { averageResponseTime: "30 minutes", completionRate: 99, rehirePercentage: 55 },
    isOnline: true,
    workingHours: defaultWorkingHours,
    serviceRadius: 15,
    notificationPreferences: { newJobAlerts: true, messageAlerts: true },
    activationStatus: 'ACTIVE',
    verificationDetails: {...defaultVerificationDetails, idVerifiedStatus: 'VERIFIED'},
  },
  {
    id: 'w4',
    name: 'David Brown (Worker)',
    skills: [JobCategory.CLEANING, JobCategory.PLUMBING], 
    rating: 4.2,
    homeAddress: '101 Pine St, Houston, TX',
    availability: 'Mon-Sat, 9am-7pm',
    profileImageUrl: 'https://picsum.photos/seed/david/200',
    hourlyRateRange: '$70-$90',
    isVerified: true,
    bio: 'Meticulous cleaning services provider. Also offers basic plumbing fixes. Reliable and efficient.',
    experienceYears: 15,
    hasInsurance: true,
    distance: 8.5,
    equipment: ['Professional Cleaning Supplies', 'Basic Plumbing Tools'],
    portfolio: { photoCount: 5, testimonialCount: 3 },
    performanceMetrics: { averageResponseTime: "4 hours", completionRate: 90, rehirePercentage: 15 },
    isOnline: true,
    workingHours: {...defaultWorkingHours, sunday: {...weekendOffSchedule}},
    serviceRadius: 50,
    activationStatus: 'ACTIVE',
    verificationDetails: activeVerifiedDetails,
  },
   {
    id: 'w5',
    name: 'Eva Green (Worker)',
    skills: [JobCategory.PLUMBING, JobCategory.ELECTRICAL, JobCategory.GENERAL_HANDYMAN],
    rating: 4.7,
    homeAddress: '212 Elm St, New York, NY',
    availability: 'Available Now',
    profileImageUrl: 'https://picsum.photos/seed/eva/200',
    hourlyRateRange: '$65-$85',
    isVerified: false,
    bio: 'Versatile professional skilled in plumbing, electrical fixes, and general handyman tasks. Customer-focused and efficient.',
    experienceYears: 8,
    licenseDetails: 'Plumbing License #PLM001122, Electrical Trainee #ET003344',
    isLicenseVerified: true,
    hasInsurance: true,
    distance: 1.5,
    equipment: ['PEX Crimp Tool', 'Voltage Tester', 'Assorted Hand Tools'],
    portfolio: { photoCount: 12, videoCount: 2, testimonialCount: 10 },
    performanceMetrics: { averageResponseTime: "45 minutes", completionRate: 96, rehirePercentage: 35 },
    isOnline: true,
    workingHours: defaultWorkingHours,
    serviceRadius: 25,
    notificationPreferences: { newJobAlerts: false, messageAlerts: true },
    minimumCallOutFee: 25,
    activationStatus: 'PENDING_REVIEW', 
    verificationDetails: defaultVerificationDetails,
  },
  {
    id: 'w6',
    name: 'Fiona Stylist (Worker)',
    skills: [JobCategory.SALON],
    rating: 4.9,
    homeAddress: '333 Style Ave, Los Angeles, CA',
    availability: 'By Appointment',
    profileImageUrl: 'https://picsum.photos/seed/fiona/200',
    hourlyRateRange: '$80-$120',
    isVerified: true,
    bio: 'Professional makeup artist and stylist with a passion for creating beautiful looks. Specializing in bridal and event makeup.',
    experienceYears: 6,
    licenseDetails: 'Licensed Cosmetologist #COS112233',
    isLicenseVerified: true,
    hasInsurance: true,
    distance: 12.0,
    equipment: ['Full Pro Makeup Kit', 'Airbrush Machine'],
    portfolio: { photoCount: 30, videoCount: 8, testimonialCount: 22 },
    performanceMetrics: { averageResponseTime: "3 hours", completionRate: 100, rehirePercentage: 60 },
    isOnline: true,
    workingHours: defaultWorkingHours,
    serviceRadius: 30,
    activationStatus: 'ACTIVE',
    verificationDetails: activeVerifiedDetails,
  },
  {
    id: 'w7',
    name: 'George Mechanic (Worker)',
    skills: [JobCategory.CAR_SERVICES, JobCategory.MECHANICS],
    rating: 4.6,
    homeAddress: '555 Gear Rd, Detroit, MI',
    workAddress: 'George\'s Auto Shop, 10 Industry Way, Detroit, MI',
    availability: 'Mon-Sat, 9am-6pm',
    profileImageUrl: 'https://picsum.photos/seed/george/200',
    hourlyRateRange: '$75-$95',
    isVerified: true,
    bio: 'ASE certified master mechanic with 20 years of experience. From routine service to complex diagnostics, I get you back on the road.',
    experienceYears: 20,
    licenseDetails: 'ASE Master Technician Certified',
    isLicenseVerified: true,
    hasInsurance: true,
    distance: 25.0,
    equipment: ['Hydraulic Lift', 'Advanced OBD-II Scanner', 'Full Wrench Set'],
    portfolio: { photoCount: 10, testimonialCount: 18 },
    performanceMetrics: { averageResponseTime: "5 hours", completionRate: 95, rehirePercentage: 50 },
    isOnline: true,
    workingHours: {...defaultWorkingHours, sunday: {...weekendOffSchedule}},
    serviceRadius: 40,
    activationStatus: 'ACTIVE',
    verificationDetails: activeVerifiedDetails,
  },
];

export const MOCK_JOB_REQUESTS: JobRequest[] = [
  {
    id: 'jr1',
    customerName: 'Michael Smith', 
    customerId: 'cust2',
    description: 'My kitchen faucet is leaking constantly and needs to be fixed urgently. It is dripping under the sink as well.',
    serviceAnalysis: {
      jobType: JobCategory.PLUMBING,
      urgency: UrgencyLevel.HIGH,
      severity: SeverityLevel.MAJOR,
      estimatedDuration: '1-2 hours',
      priceEstimate: 'Moderate',
    },
    status: 'Completed', 
    location: 'New York, NY',
    requestedDate: 'ASAP',
    createdAt: new Date(Date.now() - 3600 * 1000 * 72), 
    assignedWorkerId: 'w1',
    paymentDetails: { amount: 150, paidDate: new Date(Date.now() - 3600 * 1000 * 48) } 
  },
  {
    id: 'jr2',
    customerName: 'Sarah Miller', 
    customerId: 'cust3',
    description: 'I need three rooms in my apartment painted by the end of next month. Walls are in good condition, just need a color change.',
    serviceAnalysis: {
      jobType: JobCategory.PAINTING,
      urgency: UrgencyLevel.LOW,
      severity: SeverityLevel.MINOR,
      estimatedDuration: '2-3 days',
      priceEstimate: 'Affordable',
    },
    status: 'Accepted',
    location: 'Chicago, IL',
    requestedDate: 'By 2024-08-30',
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 5), 
    assignedWorkerId: 'w3',
  },
  {
    id: 'jr3',
    customerName: 'John Doe', 
    customerId: 'cust4',
    description: 'Electrical outlet in the living room is not working. Sparks were seen.',
    serviceAnalysis: {
        jobType: JobCategory.ELECTRICAL,
        urgency: UrgencyLevel.EMERGENCY,
        severity: SeverityLevel.CRITICAL,
        estimatedDuration: '1-2 hours',
        priceEstimate: 'Moderate',
    },
    status: 'Awaiting Worker',
    location: 'New York, NY',
    createdAt: new Date(Date.now() - 3600 * 1000 * 8), 
  },
  {
    id: 'jr4',
    customerName: 'Alice Customer', 
    customerId: 'cust1',
    description: 'Need help assembling a new flat-pack bookshelf.',
    serviceAnalysis: {
        jobType: JobCategory.GENERAL_HANDYMAN,
        urgency: UrgencyLevel.MEDIUM,
        severity: SeverityLevel.MINOR,
        estimatedDuration: '2-4 hours',
        priceEstimate: 'Affordable',
    },
    status: 'Completed',
    location: 'San Francisco, CA',
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 10), 
    assignedWorkerId: 'w2',
    paymentDetails: { amount: 80, paidDate: new Date(Date.now() - 3600 * 1000 * 24 * 9) } 
  },
   {
    id: 'jr7',
    customerName: 'Alice Customer', 
    customerId: 'cust1',
    description: 'Fix a running toilet in the main bathroom.',
    serviceAnalysis: {
      jobType: JobCategory.PLUMBING,
      urgency: UrgencyLevel.MEDIUM,
      severity: SeverityLevel.MODERATE,
      estimatedDuration: '1 hour',
      priceEstimate: 'Affordable',
    },
    status: 'Matches Found', 
    location: 'New York, NY',
    requestedDate: 'This week',
    createdAt: new Date(Date.now() - 3600 * 1000 * 20), 
  },
  {
    id: 'jr8',
    customerName: 'Sarah Miller',
    customerId: 'cust3',
    description: 'I need makeup done for a wedding I am attending this Saturday. Looking for a glamorous evening look.',
    serviceAnalysis: {
      jobType: JobCategory.SALON,
      urgency: UrgencyLevel.HIGH,
      severity: SeverityLevel.MINOR,
      estimatedDuration: '1-2 hours',
      priceEstimate: 'Premium',
    },
    status: 'Matches Found',
    location: 'Los Angeles, CA',
    requestedDate: 'This Saturday',
    createdAt: new Date(Date.now() - 3600 * 1000 * 48),
  },
  {
    id: 'jr9',
    customerName: 'John Doe',
    customerId: 'cust4',
    description: 'My car is making a weird rattling noise from the engine and the check engine light is on.',
    serviceAnalysis: {
      jobType: JobCategory.CAR_SERVICES,
      urgency: UrgencyLevel.HIGH,
      severity: SeverityLevel.MAJOR,
      estimatedDuration: 'Half a day',
      priceEstimate: 'Requires Quote',
    },
    status: 'Awaiting Worker',
    location: 'Detroit, MI',
    requestedDate: 'ASAP',
    createdAt: new Date(Date.now() - 3600 * 1000 * 12),
  }
];

export const MOCK_SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: 'pkg_br_remodel',
    name: 'Basic Bathroom Refresh', 
    description: 'Update essentials for a fresh look and feel.', 
    categoryName: JobCategory.PLUMBING,
    includedFeatures: ['New Faucet Installation', 'Toilet Tune-up', 'Showerhead Replacement', 'Caulking Refresh'], 
    indicativePrice: 'From $499',
    icon: RectangleStackIcon,
  },
  {
    id: 'pkg_lighting_upgrade',
    name: 'Smart Lighting Setup', 
    description: 'Modernize your home with smart lighting solutions.', 
    categoryName: JobCategory.ELECTRICAL,
    includedFeatures: ['Consultation & Design', 'Up to 5 Smart Switch/Dimmer Installations', 'Hub Configuration', 'App Setup & Tutorial'], 
    indicativePrice: 'From $350 + parts',
    icon: RectangleStackIcon,
  }
];

export const MOCK_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'sub_hvac_monthly',
    name: 'HVAC Peace of Mind Plan', 
    description: 'Regular maintenance to keep your system running smoothly.', 
    categoryName: JobCategory.HVAC,
    frequency: 'Monthly',
    pricePerTerm: '$29/month',
    benefits: ['Monthly Filter Change', 'Seasonal System Check-up (2/year)', 'Priority Scheduling', '10% off Repairs'], 
    icon: ArrowPathIcon,
  },
  {
    id: 'sub_handyman_quarterly',
    name: 'Handyman Helper Subscription', 
    description: 'Quarterly help with small tasks around the house.', 
    categoryName: JobCategory.GENERAL_HANDYMAN,
    frequency: 'Quarterly',
    pricePerTerm: '$75/quarter',
    benefits: ['2 Hours of Handyman Service', 'Flexible Task List', 'Discount on Additional Hours'], 
    icon: ArrowPathIcon,
  }
];

const now = Date.now();
export const MOCK_CHAT_THREADS: ChatThread[] = [
  {
    id: 'thread1',
    participantIds: ['cust1', 'w1'], 
    lastMessageId: 'msg3',
    lastMessageTimestamp: now - 1000 * 60 * 5, 
    jobRequestId: 'jr1'
  },
  {
    id: 'thread2',
    participantIds: ['cust2', 'w3'], 
    lastMessageId: 'msg5',
    lastMessageTimestamp: now - 1000 * 60 * 60 * 2, 
  },
  {
    id: 'thread3',
    participantIds: ['cust1', 'w2'], 
    lastMessageId: 'msg6',
    lastMessageTimestamp: now - 1000 * 60 * 30, 
  }
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'msg1', threadId: 'thread1', senderId: 'cust1', receiverId: 'w1', text: 'Hi Alice, thanks for accepting the job! When can you come by?', timestamp: now - 1000 * 60 * 10, isRead: true },
  { id: 'msg2', threadId: 'thread1', senderId: 'w1', receiverId: 'cust1', text: 'Hello! I can be there tomorrow morning around 9 AM. Does that work?', timestamp: now - 1000 * 60 * 8, isRead: true },
  { id: 'msg3', threadId: 'thread1', senderId: 'cust1', receiverId: 'w1', text: 'Yes, 9 AM is perfect. See you then!', timestamp: now - 1000 * 60 * 5, isRead: false }, 

  { id: 'msg4', threadId: 'thread2', senderId: 'cust2', receiverId: 'w3', text: 'Hi Carol, I saw your profile. Are you available for carpentry work next week?', timestamp: now - 1000 * 60 * 60 * 3, isRead: true },
  { id: 'msg5', threadId: 'thread2', senderId: 'w3', receiverId: 'cust2', text: 'Hi Michael, yes I have some availability. What did you have in mind?', timestamp: now - 1000 * 60 * 60 * 2, isRead: false }, 

  { id: 'msg6', threadId: 'thread3', senderId: 'cust1', receiverId: 'w2', text: 'Hi Bob, I need some electrical work done. Are you free this weekend?', timestamp: now - 1000 * 60 * 30, isRead: false }, 
];


// GENERAL CONSTANTS (still used directly by UI or other services)
export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';
export const MAX_MATCHED_WORKERS_TO_SHOW = 3;
export const DEFAULT_WORKER_PROFILE_IMAGE = 'https://picsum.photos/seed/newworker/200';
export const DEFAULT_CUSTOMER_PROFILE_IMAGE = 'https://picsum.photos/seed/newcustomer/100';
export const ChatIcon = ChatBubbleLeftRightIcon;
// Note: defaultVerificationDetails is exported for apiService to use when creating new workers.