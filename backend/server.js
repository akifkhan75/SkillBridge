
const express = require('express');
const cors = require('cors');
const {
  JobCategory,
  DEFAULT_CUSTOMER_PROFILE_IMAGE,
  DEFAULT_WORKER_PROFILE_IMAGE,
  newWorkerVerificationDetails,
  initialMockUsers,
  initialMockWorkers,
  initialMockJobRequests,
  initialMockChatThreads,
  initialMockChatMessages,
  MOCK_SERVICE_PACKAGES,
  MOCK_SUBSCRIPTION_PLANS,
  defaultWorkingHours
} = require('./data');

const app = express();
const PORT = process.env.PORT || 3002;

// In-memory data stores
let mockUsersStore = JSON.parse(JSON.stringify(initialMockUsers));
let mockWorkersStore = JSON.parse(JSON.stringify(initialMockWorkers));
let mockJobRequestsStore = JSON.parse(JSON.stringify(initialMockJobRequests));
let mockChatThreadsStore = JSON.parse(JSON.stringify(initialMockChatThreads));
let mockChatMessagesStore = JSON.parse(JSON.stringify(initialMockChatMessages));

app.use(cors());
app.use(express.json());

// --- Helper Functions ---
const findUserById = (id) => mockUsersStore.find(u => u.id === id);
const findWorkerById = (id) => mockWorkersStore.find(w => w.id === id);
const findJobRequestById = (id) => mockJobRequestsStore.find(j => j.id === id);
const findChatThreadById = (id) => mockChatThreadsStore.find(t => t.id === id);

// --- Auth Routes ---
app.post('/api/auth/login', (req, res) => {
  console.log('login---')
  const { email, password } = req.body;
  // console.log(`Login attempt for email: ${email}`); // Optional: for debugging
  if (!email || !password) {
    // console.log('Login failed: Email or password missing');
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const userRecord = mockUsersStore.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (userRecord && userRecord.password === password) {
    console.log(`Login successful for user: ${email}`);
    // User found and password matches. Omit password from the returned user object.
    const { password: _, ...userToReturn } = userRecord;
    res.json(userToReturn);
  } else {
    // if (userRecord) {
    //   console.log(`Login failed: Password mismatch for user ${email}.`);
    // } else {
    //   console.log(`Login failed: User with email ${email} not found.`);
    // }
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/auth/signup', (req, res) => {
  const formData = req.body;
  if (!formData.name || !formData.email || !formData.password || !formData.type) {
    return res.status(400).json({ message: 'Missing required signup fields' });
  }

  const emailExists = mockUsersStore.some(u => u.email.toLowerCase() === formData.email.toLowerCase());
  if (emailExists) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const newUserId = `user${Date.now()}`;
  const newUser = {
    id: newUserId,
    name: formData.name,
    email: formData.email,
    type: formData.type,
    password: formData.password, // In a real app, hash this password
    profileImageUrl: formData.type === 'customer' ? DEFAULT_CUSTOMER_PROFILE_IMAGE : DEFAULT_WORKER_PROFILE_IMAGE,
    unreadMessagesCount: 0,
  };
  mockUsersStore.push(newUser);

  if (formData.type === 'worker') {
    const newWorker = {
      id: newUserId,
      name: formData.name,
      skills: formData.skills || [JobCategory.GENERAL_HANDYMAN],
      rating: 0,
      homeAddress: formData.homeAddress || 'Default Location',
      availability: 'Offline', // Default for new worker
      profileImageUrl: DEFAULT_WORKER_PROFILE_IMAGE,
      hourlyRateRange: formData.hourlyRateRange || '$20-$50', // Default
      isVerified: false,
      bio: formData.bio || `New ${formData.skills?.[0] || JobCategory.GENERAL_HANDYMAN} professional.`,
      experienceYears: formData.experienceYears || 0,
      licenseDetails: '',
      isLicenseVerified: false,
      hasInsurance: false,
      distance: Math.floor(Math.random() * 20) + 1, // Mock distance
      equipment: [],
      portfolio: { photoCount: 0, videoCount: 0, testimonialCount: 0 },
      performanceMetrics: { averageResponseTime: "N/A", completionRate: 0, rehirePercentage: 0 },
      isOnline: false,
      workingHours: JSON.parse(JSON.stringify(defaultWorkingHours)),
      serviceRadius: 10, // Default
      notificationPreferences: { newJobAlerts: true, messageAlerts: true },
      minimumCallOutFee: undefined,
      activationStatus: 'PENDING_REVIEW',
      verificationDetails: { ...newWorkerVerificationDetails },
    };
    mockWorkersStore.push(newWorker);
  }
  res.status(201).json(newUser);
});

app.get('/api/auth/current-user/:userId', (req, res) => {
  const user = findUserById(req.params.userId);
  if (user) {
    const { password: _, ...userToReturn } = user; // Omit password here too for consistency
    res.json(userToReturn);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// --- User Routes ---
app.get('/api/users', (req, res) => {
  // Omit passwords from all users returned
  const usersToReturn = mockUsersStore.map(user => {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
  res.json(usersToReturn);
});

// --- Worker Routes ---
app.get('/api/workers', (req, res) => {
  res.json(mockWorkersStore);
});

app.get('/api/workers/:workerId', (req, res) => {
  const worker = findWorkerById(req.params.workerId);
  if (worker) {
    res.json(worker);
  } else {
    res.status(404).json({ message: 'Worker not found' });
  }
});

app.put('/api/workers/:workerId', (req, res) => {
  const workerIndex = mockWorkersStore.findIndex(w => w.id === req.params.workerId);
  if (workerIndex === -1) {
    return res.status(404).json({ message: 'Worker not found' });
  }
  mockWorkersStore[workerIndex] = { ...mockWorkersStore[workerIndex], ...req.body };

  // Cascade name/profile image update to user store, ensuring password isn't accidentally added
  const userIndex = mockUsersStore.findIndex(u => u.id === req.params.workerId);
  if (userIndex !== -1) {
    const originalPassword = mockUsersStore[userIndex].password; // Preserve original password
    mockUsersStore[userIndex] = { 
        ...mockUsersStore[userIndex], 
        name: req.body.name !== undefined ? req.body.name : mockUsersStore[userIndex].name,
        profileImageUrl: req.body.profileImageUrl !== undefined ? req.body.profileImageUrl : mockUsersStore[userIndex].profileImageUrl,
    };
    mockUsersStore[userIndex].password = originalPassword; // Ensure password is correct and not lost/overwritten by spread from worker data
  }

  res.json(mockWorkersStore[workerIndex]);
});

// --- Job Request Routes ---
app.get('/api/job-requests', (req, res) => {
  // Dates are already ISO strings from data.js
  res.json(mockJobRequestsStore);
});

app.post('/api/job-requests', (req, res) => {
  const jobData = req.body;
  if (!jobData.customerName || !jobData.customerId || !jobData.description || !jobData.location || !jobData.serviceAnalysis) {
      return res.status(400).json({ message: "Missing required fields for job request." });
  }
  const newJobRequest = {
    ...jobData,
    id: `jr${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'Matches Found', // Default status for new requests via API after analysis
  };
  mockJobRequestsStore.unshift(newJobRequest);
  res.status(201).json(newJobRequest);
});

app.put('/api/job-requests/:jobId', (req, res) => {
  const jobIndex = mockJobRequestsStore.findIndex(j => j.id === req.params.jobId);
  if (jobIndex === -1) {
    return res.status(404).json({ message: 'Job request not found' });
  }
  mockJobRequestsStore[jobIndex] = { ...mockJobRequestsStore[jobIndex], ...req.body };
  if (req.body.paymentDetails && req.body.paymentDetails.paidDate) {
    mockJobRequestsStore[jobIndex].paymentDetails.paidDate = new Date(req.body.paymentDetails.paidDate).toISOString();
  }
  res.json(mockJobRequestsStore[jobIndex]);
});

// --- Chat Routes ---
app.get('/api/chat/threads/:userId', (req, res) => {
  const userThreads = mockChatThreadsStore
    .filter(thread => thread.participantIds.includes(req.params.userId))
    .sort((a,b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
  res.json(userThreads);
});

app.get('/api/chat/messages/:threadId', (req, res) => {
  const threadMessages = mockChatMessagesStore.filter(msg => msg.threadId === req.params.threadId);
  res.json(threadMessages);
});

app.post('/api/chat/messages', (req, res) => {
  const messageData = req.body;
  if (!messageData.threadId || !messageData.senderId || !messageData.receiverId || !messageData.text) {
      return res.status(400).json({ message: "Missing required fields for chat message." });
  }
  const newMessage = {
    ...messageData,
    id: `msg${Date.now()}`,
    timestamp: Date.now(),
    isRead: false,
  };
  mockChatMessagesStore.push(newMessage);

  const threadIndex = mockChatThreadsStore.findIndex(t => t.id === messageData.threadId);
  if (threadIndex !== -1) {
    mockChatThreadsStore[threadIndex].lastMessageId = newMessage.id;
    mockChatThreadsStore[threadIndex].lastMessageTimestamp = newMessage.timestamp;
  } else {
    // Optionally create a new thread if it doesn't exist
    // For now, assume thread exists or is created on frontend/client-side logic before sending message
  }
  res.status(201).json(newMessage);
});

app.post('/api/chat/mark-read', (req, res) => {
  const { threadId, userId } = req.body;
  if (!threadId || !userId) {
    return res.status(400).json({ message: 'threadId and userId are required.' });
  }
  let messagesUpdated = false;
  mockChatMessagesStore = mockChatMessagesStore.map(msg => {
    if (msg.threadId === threadId && msg.receiverId === userId && !msg.isRead) {
      messagesUpdated = true;
      return { ...msg, isRead: true };
    }
    return msg;
  });
  res.json({ success: true, messagesUpdated });
});


// --- Static Data Routes ---
app.get('/api/service-packages', (req, res) => {
  res.json(MOCK_SERVICE_PACKAGES);
});

app.get('/api/subscription-plans', (req, res) => {
  res.json(MOCK_SUBSCRIPTION_PLANS);
});

// --- Server Start ---
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
