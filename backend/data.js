
// Adapted from frontend/src/constants.ts and frontend/src/types.ts

const JobCategory = {
  PLUMBING: 'Plumbing',
  ELECTRICAL: 'Electrical',
  CARPENTRY: 'Carpentry',
  MECHANICS: 'Mechanics',
  PAINTING: 'Painting',
  CLEANING: 'Cleaning',
  HVAC: 'HVAC',
  GENERAL_HANDYMAN: 'General Handyman',
  OTHER: 'Other',
};

const DEFAULT_CUSTOMER_PROFILE_IMAGE = 'https://picsum.photos/seed/newcustomer/100';
const DEFAULT_WORKER_PROFILE_IMAGE = 'https://picsum.photos/seed/newworker/200';

const defaultVerificationDetails = {
  idVerifiedStatus: 'NONE',
  backgroundCheckStatus: 'NONE',
  referencesStatus: 'NONE',
};

const activeVerifiedDetails = {
  idVerifiedStatus: 'VERIFIED',
  backgroundCheckStatus: 'VERIFIED',
  referencesStatus: 'CHECKED',
};


const initialMockUsers = [
  { id: 'cust1', name: 'Alice Customer', email: 'customer@example.com', type: 'customer', password: 'password123', profileImageUrl: 'https://picsum.photos/seed/cust1/100' },
  { id: 'w1', name: 'Alice Johnson (Worker)', email: 'ajohnson@example.com', type: 'worker', password: 'password123', profileImageUrl: 'https://picsum.photos/seed/alice/200' },
  { id: 'w2', name: 'Bob Williams (Worker)', email: 'worker@example.com', type: 'worker', password: 'password123', profileImageUrl: 'https://picsum.photos/seed/bob/200' },
  { id: 'w3', name: 'Carol Davis (Worker)', email: 'cdavis@example.com', type: 'worker', password: 'password123', profileImageUrl: 'https://picsum.photos/seed/carol/200' },
  { id: 'w4', name: 'David Brown (Worker)', email: 'dbrown@example.com', type: 'worker', password: 'password123', profileImageUrl: 'https://picsum.photos/seed/david/200' },
  { id: 'w5', name: 'Eva Green (Worker)', email: 'egreen@example.com', type: 'worker', password: 'password123', profileImageUrl: 'https://picsum.photos/seed/eva/200' },
  { id: 'cust2', name: 'Michael Smith', email: 'msmith@example.com', type: 'customer', password: 'password123', profileImageUrl: 'https://picsum.photos/seed/cust2/100' },
  { id: 'cust3', name: 'Sarah Miller', email: 'smiller@example.com', type: 'customer', password: 'password123', profileImageUrl: 'https://picsum.photos/seed/cust3/100' },
  { id: 'cust4', name: 'John Doe', email: 'johndoe@example.com', type: 'customer', password: 'password123', profileImageUrl: 'https://picsum.photos/seed/cust4/100' },
];

const defaultDaySchedule = { isActive: true, startTime: '09:00', endTime: '17:00' };
const weekendOffSchedule = { isActive: false, startTime: '09:00', endTime: '17:00' };

const defaultWorkingHours = {
  monday: { ...defaultDaySchedule },
  tuesday: { ...defaultDaySchedule },
  wednesday: { ...defaultDaySchedule },
  thursday: { ...defaultDaySchedule },
  friday: { ...defaultDaySchedule },
  saturday: { ...weekendOffSchedule },
  sunday: { ...weekendOffSchedule },
};


const initialMockWorkers = [
   {
    id: 'w1',
    name: 'Alice Johnson (Worker)',
    skills: [JobCategory.PLUMBING, JobCategory.HVAC],
    rating: 4.8,
    homeAddress: 'New York, NY',
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
    homeAddress: 'San Francisco, CA',
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
    homeAddress: 'New York, NY',
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
    skills: [JobCategory.MECHANICS, JobCategory.CLEANING, JobCategory.PLUMBING],
    rating: 4.2,
    homeAddress: 'Houston, TX',
    availability: 'Mon-Sat, 9am-7pm',
    profileImageUrl: 'https://picsum.photos/seed/david/200',
    hourlyRateRange: '$70-$90',
    isVerified: true,
    bio: 'ASE certified mechanic and also offers meticulous cleaning services. Reliable and efficient.',
    experienceYears: 15,
    hasInsurance: true,
    distance: 8.5,
    equipment: ['OBD-II Scanner', 'Professional Cleaning Supplies', 'Basic Plumbing Tools'],
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
    homeAddress: 'New York, NY',
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
];

const initialMockJobRequests = [
  {
    id: 'jr1',
    customerName: 'Michael Smith',
    customerId: 'cust2',
    description: 'My kitchen faucet is leaking constantly and needs to be fixed urgently. It is dripping under the sink as well.',
    serviceAnalysis: {
      jobType: JobCategory.PLUMBING,
      urgency: 'High',
      severity: 'Major',
      estimatedDuration: '1-2 hours',
      priceEstimate: 'Moderate',
    },
    status: 'Completed',
    location: 'New York, NY',
    requestedDate: 'ASAP',
    createdAt: new Date(Date.now() - 3600 * 1000 * 72).toISOString(),
    assignedWorkerId: 'w1',
    paymentDetails: { amount: 150, paidDate: new Date(Date.now() - 3600 * 1000 * 48).toISOString() }
  },
  {
    id: 'jr2',
    customerName: 'Sarah Miller',
    customerId: 'cust3',
    description: 'I need three rooms in my apartment painted by the end of next month. Walls are in good condition, just need a color change.',
    serviceAnalysis: {
      jobType: JobCategory.PAINTING,
      urgency: 'Low',
      severity: 'Minor',
      estimatedDuration: '2-3 days',
      priceEstimate: 'Affordable',
    },
    status: 'Accepted',
    location: 'Chicago, IL',
    requestedDate: 'By 2024-08-30',
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 5).toISOString(),
    assignedWorkerId: 'w3',
  },
  {
    id: 'jr3',
    customerName: 'John Doe',
    customerId: 'cust4',
    description: 'Electrical outlet in the living room is not working. Sparks were seen.',
    serviceAnalysis: {
        jobType: JobCategory.ELECTRICAL,
        urgency: 'Emergency',
        severity: 'Critical',
        estimatedDuration: '1-2 hours',
        priceEstimate: 'Moderate',
    },
    status: 'Awaiting Worker',
    location: 'New York, NY',
    createdAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString(),
  },
  {
    id: 'jr4',
    customerName: 'Alice Customer',
    customerId: 'cust1',
    description: 'Need help assembling a new flat-pack bookshelf.',
    serviceAnalysis: {
        jobType: JobCategory.GENERAL_HANDYMAN,
        urgency: 'Medium',
        severity: 'Minor',
        estimatedDuration: '2-4 hours',
        priceEstimate: 'Affordable',
    },
    status: 'Completed',
    location: 'San Francisco, CA',
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 10).toISOString(),
    assignedWorkerId: 'w2',
    paymentDetails: { amount: 80, paidDate: new Date(Date.now() - 3600 * 1000 * 24 * 9).toISOString() }
  },
   {
    id: 'jr7',
    customerName: 'Alice Customer',
    customerId: 'cust1',
    description: 'Fix a running toilet in the main bathroom.',
    serviceAnalysis: {
      jobType: JobCategory.PLUMBING,
      urgency: 'Medium',
      severity: 'Moderate',
      estimatedDuration: '1 hour',
      priceEstimate: 'Affordable',
    },
    status: 'Matches Found',
    location: 'New York, NY',
    requestedDate: 'This week',
    createdAt: new Date(Date.now() - 3600 * 1000 * 20).toISOString(),
  }
];

const now = Date.now();
const initialMockChatThreads = [
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

const initialMockChatMessages = [
  { id: 'msg1', threadId: 'thread1', senderId: 'cust1', receiverId: 'w1', text: 'Hi Alice, thanks for accepting the job! When can you come by?', timestamp: now - 1000 * 60 * 10, isRead: true },
  { id: 'msg2', threadId: 'thread1', senderId: 'w1', receiverId: 'cust1', text: 'Hello! I can be there tomorrow morning around 9 AM. Does that work?', timestamp: now - 1000 * 60 * 8, isRead: true },
  { id: 'msg3', threadId: 'thread1', senderId: 'cust1', receiverId: 'w1', text: 'Yes, 9 AM is perfect. See you then!', timestamp: now - 1000 * 60 * 5, isRead: false },
  { id: 'msg4', threadId: 'thread2', senderId: 'cust2', receiverId: 'w3', text: 'Hi Carol, I saw your profile. Are you available for carpentry work next week?', timestamp: now - 1000 * 60 * 60 * 3, isRead: true },
  { id: 'msg5', threadId: 'thread2', senderId: 'w3', receiverId: 'cust2', text: 'Hi Michael, yes I have some availability. What did you have in mind?', timestamp: now - 1000 * 60 * 60 * 2, isRead: false },
  { id: 'msg6', threadId: 'thread3', senderId: 'cust1', receiverId: 'w2', text: 'Hi Bob, I need some electrical work done. Are you free this weekend?', timestamp: now - 1000 * 60 * 30, isRead: false },
];

const MOCK_SERVICE_PACKAGES = [
  {
    id: 'pkg_br_remodel',
    name: 'Basic Bathroom Refresh',
    description: 'Update essentials for a fresh look and feel.',
    categoryName: JobCategory.PLUMBING,
    includedFeatures: ['New Faucet Installation', 'Toilet Tune-up', 'Showerhead Replacement', 'Caulking Refresh'],
    indicativePrice: 'From $499',
    iconName: 'RectangleStackIcon', // Storing icon name for simplicity, frontend will map
  },
  {
    id: 'pkg_lighting_upgrade',
    name: 'Smart Lighting Setup',
    description: 'Modernize your home with smart lighting solutions.',
    categoryName: JobCategory.ELECTRICAL,
    includedFeatures: ['Consultation & Design', 'Up to 5 Smart Switch/Dimmer Installations', 'Hub Configuration', 'App Setup & Tutorial'],
    indicativePrice: 'From $350 + parts',
    iconName: 'RectangleStackIcon',
  }
];

const MOCK_SUBSCRIPTION_PLANS = [
  {
    id: 'sub_hvac_monthly',
    name: 'HVAC Peace of Mind Plan',
    description: 'Regular maintenance to keep your system running smoothly.',
    categoryName: JobCategory.HVAC,
    frequency: 'Monthly',
    pricePerTerm: '$29/month',
    benefits: ['Monthly Filter Change', 'Seasonal System Check-up (2/year)', 'Priority Scheduling', '10% off Repairs'],
    iconName: 'ArrowPathIcon',
  },
  {
    id: 'sub_handyman_quarterly',
    name: 'Handyman Helper Subscription',
    description: 'Quarterly help with small tasks around the house.',
    categoryName: JobCategory.GENERAL_HANDYMAN,
    frequency: 'Quarterly',
    pricePerTerm: '$75/quarter',
    benefits: ['2 Hours of Handyman Service', 'Flexible Task List', 'Discount on Additional Hours'],
    iconName: 'ArrowPathIcon',
  }
];


module.exports = {
  JobCategory,
  DEFAULT_CUSTOMER_PROFILE_IMAGE,
  DEFAULT_WORKER_PROFILE_IMAGE,
  newWorkerVerificationDetails: defaultVerificationDetails, // Renamed for export
  initialMockUsers,
  initialMockWorkers,
  initialMockJobRequests,
  initialMockChatThreads,
  initialMockChatMessages,
  MOCK_SERVICE_PACKAGES,
  MOCK_SUBSCRIPTION_PLANS,
  defaultWorkingHours
};
