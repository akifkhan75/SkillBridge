import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.chatMessage.deleteMany();
  await prisma.chatThread.deleteMany();
  await prisma.jobRequest.deleteMany();
  await prisma.servicePackage.deleteMany();
  await prisma.subscriptionPlan.deleteMany();
  await prisma.worker.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // ── Users ──────────────────────────────────────────────────
  const customers = await Promise.all([
    prisma.user.create({
      data: { id: 'cust1', name: 'Alice Customer', email: 'customer@example.com', password: hashedPassword, type: 'customer', profileImageUrl: 'https://picsum.photos/seed/cust1/100' },
    }),
    prisma.user.create({
      data: { id: 'cust2', name: 'Michael Smith', email: 'msmith@example.com', password: hashedPassword, type: 'customer', profileImageUrl: 'https://picsum.photos/seed/cust2/100' },
    }),
    prisma.user.create({
      data: { id: 'cust3', name: 'Sarah Miller', email: 'smiller@example.com', password: hashedPassword, type: 'customer', profileImageUrl: 'https://picsum.photos/seed/cust3/100' },
    }),
    prisma.user.create({
      data: { id: 'cust4', name: 'John Doe', email: 'johndoe@example.com', password: hashedPassword, type: 'customer', profileImageUrl: 'https://picsum.photos/seed/cust4/100' },
    }),
  ]);

  const workerUsers = await Promise.all([
    prisma.user.create({
      data: { id: 'w1', name: 'Alice Johnson (Worker)', email: 'ajohnson@example.com', password: hashedPassword, type: 'worker', profileImageUrl: 'https://picsum.photos/seed/alice/200' },
    }),
    prisma.user.create({
      data: { id: 'w2', name: 'Bob Williams (Worker)', email: 'worker@example.com', password: hashedPassword, type: 'worker', profileImageUrl: 'https://picsum.photos/seed/bob/200' },
    }),
    prisma.user.create({
      data: { id: 'w3', name: 'Carol Davis (Worker)', email: 'cdavis@example.com', password: hashedPassword, type: 'worker', profileImageUrl: 'https://picsum.photos/seed/carol/200' },
    }),
    prisma.user.create({
      data: { id: 'w4', name: 'David Brown (Worker)', email: 'dbrown@example.com', password: hashedPassword, type: 'worker', profileImageUrl: 'https://picsum.photos/seed/david/200' },
    }),
    prisma.user.create({
      data: { id: 'w5', name: 'Eva Green (Worker)', email: 'egreen@example.com', password: hashedPassword, type: 'worker', profileImageUrl: 'https://picsum.photos/seed/eva/200' },
    }),
    prisma.user.create({
      data: { id: 'w6', name: 'Fiona Stylist (Worker)', email: 'fiona@example.com', password: hashedPassword, type: 'worker', profileImageUrl: 'https://picsum.photos/seed/fiona/200' },
    }),
    prisma.user.create({
      data: { id: 'w7', name: 'George Mechanic (Worker)', email: 'george@example.com', password: hashedPassword, type: 'worker', profileImageUrl: 'https://picsum.photos/seed/george/200' },
    }),
  ]);

  // ── Workers ────────────────────────────────────────────────
  await Promise.all([
    prisma.worker.create({
      data: {
        id: 'w1', skills: ['PLUMBING', 'HVAC'], rating: 4.8, homeAddress: '123 Main St, New York, NY',
        availability: 'Mon-Fri, 8am-6pm', hourlyRateRange: '$60-$80', isVerified: true,
        bio: 'Experienced plumber and HVAC technician with over 10 years in the field.',
        experienceYears: 10, licenseDetails: 'Master Plumber #MP12345', isLicenseVerified: true,
        hasInsurance: true, equipment: ['Professional Drain Snake', 'Pipe Wrench Set', 'HVAC Gauge Manifold Set'],
        isOnline: true, serviceRadius: 20, minimumCallOutFee: 50, activationStatus: 'ACTIVE',
        idVerifiedStatus: 'VERIFIED', backgroundCheckStatus: 'VERIFIED', referencesStatus: 'CHECKED',
      },
    }),
    prisma.worker.create({
      data: {
        id: 'w2', skills: ['ELECTRICAL', 'GENERAL_HANDYMAN'], rating: 4.5,
        homeAddress: '456 Market St, San Francisco, CA', availability: 'Weekends Only',
        hourlyRateRange: '$55-$70', isVerified: true,
        bio: 'Certified electrician specializing in residential wiring and repairs.',
        experienceYears: 7, licenseDetails: 'Licensed Electrician #ELE98765', isLicenseVerified: true,
        equipment: ['Multimeter', 'Wire Strippers', 'Power Drill Kit'],
        isOnline: false, serviceRadius: 30, activationStatus: 'ACTIVE',
        idVerifiedStatus: 'VERIFIED', backgroundCheckStatus: 'SUBMITTED', referencesStatus: 'CHECKED',
      },
    }),
    prisma.worker.create({
      data: {
        id: 'w3', skills: ['CARPENTRY', 'PAINTING'], rating: 4.9,
        homeAddress: '789 Oak Ave, New York, NY', availability: 'Available Now',
        hourlyRateRange: '$50-$65', isVerified: false,
        bio: 'Detail-oriented carpenter and painter. Passionate about transforming spaces.',
        experienceYears: 12, licenseDetails: 'General Contractor #GC54321',
        hasInsurance: true, equipment: ['Circular Saw', 'Nail Gun', 'Paint Sprayer', 'Full Brush Set'],
        isOnline: true, serviceRadius: 15, activationStatus: 'ACTIVE',
        idVerifiedStatus: 'VERIFIED',
      },
    }),
    prisma.worker.create({
      data: {
        id: 'w4', skills: ['CLEANING', 'PLUMBING'], rating: 4.2,
        homeAddress: '101 Pine St, Houston, TX', availability: 'Mon-Sat, 9am-7pm',
        hourlyRateRange: '$70-$90', isVerified: true,
        bio: 'Meticulous cleaning services provider. Also offers basic plumbing fixes.',
        experienceYears: 15, hasInsurance: true,
        equipment: ['Professional Cleaning Supplies', 'Basic Plumbing Tools'],
        isOnline: true, serviceRadius: 50, activationStatus: 'ACTIVE',
        idVerifiedStatus: 'VERIFIED', backgroundCheckStatus: 'VERIFIED', referencesStatus: 'VERIFIED',
      },
    }),
    prisma.worker.create({
      data: {
        id: 'w5', skills: ['PLUMBING', 'ELECTRICAL', 'GENERAL_HANDYMAN'], rating: 4.7,
        homeAddress: '212 Elm St, New York, NY', availability: 'Available Now',
        hourlyRateRange: '$65-$85', isVerified: false,
        bio: 'Versatile professional skilled in plumbing, electrical fixes, and general handyman tasks.',
        experienceYears: 8, licenseDetails: 'Plumbing License #PLM001122',
        isLicenseVerified: true, hasInsurance: true,
        equipment: ['PEX Crimp Tool', 'Voltage Tester', 'Assorted Hand Tools'],
        isOnline: true, serviceRadius: 25, minimumCallOutFee: 25,
        activationStatus: 'PENDING_REVIEW',
      },
    }),
    prisma.worker.create({
      data: {
        id: 'w6', skills: ['SALON'], rating: 4.9,
        homeAddress: '333 Style Ave, Los Angeles, CA', availability: 'By Appointment',
        hourlyRateRange: '$80-$120', isVerified: true,
        bio: 'Professional makeup artist and stylist. Specializing in bridal and event makeup.',
        experienceYears: 6, licenseDetails: 'Licensed Cosmetologist #COS112233',
        isLicenseVerified: true, hasInsurance: true,
        equipment: ['Full Pro Makeup Kit', 'Airbrush Machine'],
        isOnline: true, serviceRadius: 30, activationStatus: 'ACTIVE',
        idVerifiedStatus: 'VERIFIED', backgroundCheckStatus: 'VERIFIED', referencesStatus: 'VERIFIED',
      },
    }),
    prisma.worker.create({
      data: {
        id: 'w7', skills: ['CAR_SERVICES', 'MECHANICS'], rating: 4.6,
        homeAddress: '555 Gear Rd, Detroit, MI', availability: 'Mon-Sat, 9am-6pm',
        hourlyRateRange: '$75-$95', isVerified: true,
        bio: 'ASE certified master mechanic with 20 years of experience.',
        experienceYears: 20, licenseDetails: 'ASE Master Technician Certified',
        isLicenseVerified: true, hasInsurance: true,
        equipment: ['Hydraulic Lift', 'Advanced OBD-II Scanner', 'Full Wrench Set'],
        isOnline: true, serviceRadius: 40, activationStatus: 'ACTIVE',
        idVerifiedStatus: 'VERIFIED', backgroundCheckStatus: 'VERIFIED', referencesStatus: 'VERIFIED',
      },
    }),
  ]);

  // ── Job Requests ───────────────────────────────────────────
  const jr1 = await prisma.jobRequest.create({
    data: {
      id: 'jr1', customerId: 'cust2', customerName: 'Michael Smith',
      description: 'My kitchen faucet is leaking constantly and needs to be fixed urgently.',
      jobType: 'PLUMBING', urgency: 'High', severity: 'Major',
      estimatedDuration: '1-2 hours', priceEstimate: 'Moderate',
      status: 'COMPLETED', location: 'New York, NY', requestedDate: 'ASAP',
      assignedWorkerId: 'w1', paymentAmount: 150,
      paymentDate: new Date(Date.now() - 3600 * 1000 * 48),
    },
  });

  await prisma.jobRequest.create({
    data: {
      id: 'jr2', customerId: 'cust3', customerName: 'Sarah Miller',
      description: 'I need three rooms in my apartment painted by the end of next month.',
      jobType: 'PAINTING', urgency: 'Low', severity: 'Minor',
      estimatedDuration: '2-3 days', priceEstimate: 'Affordable',
      status: 'ACCEPTED', location: 'Chicago, IL', requestedDate: 'By 2024-08-30',
      assignedWorkerId: 'w3',
    },
  });

  await prisma.jobRequest.create({
    data: {
      id: 'jr3', customerId: 'cust4', customerName: 'John Doe',
      description: 'Electrical outlet in the living room is not working. Sparks were seen.',
      jobType: 'ELECTRICAL', urgency: 'Emergency', severity: 'Critical',
      estimatedDuration: '1-2 hours', priceEstimate: 'Moderate',
      status: 'AWAITING_WORKER', location: 'New York, NY',
    },
  });

  await prisma.jobRequest.create({
    data: {
      id: 'jr4', customerId: 'cust1', customerName: 'Alice Customer',
      description: 'Need help assembling a new flat-pack bookshelf.',
      jobType: 'GENERAL_HANDYMAN', urgency: 'Medium', severity: 'Minor',
      estimatedDuration: '2-4 hours', priceEstimate: 'Affordable',
      status: 'COMPLETED', location: 'San Francisco, CA',
      assignedWorkerId: 'w2', paymentAmount: 80,
      paymentDate: new Date(Date.now() - 3600 * 1000 * 24 * 9),
    },
  });

  await prisma.jobRequest.create({
    data: {
      id: 'jr7', customerId: 'cust1', customerName: 'Alice Customer',
      description: 'Fix a running toilet in the main bathroom.',
      jobType: 'PLUMBING', urgency: 'Medium', severity: 'Moderate',
      estimatedDuration: '1 hour', priceEstimate: 'Affordable',
      status: 'MATCHES_FOUND', location: 'New York, NY', requestedDate: 'This week',
    },
  });

  await prisma.jobRequest.create({
    data: {
      id: 'jr8', customerId: 'cust3', customerName: 'Sarah Miller',
      description: 'I need makeup done for a wedding I am attending this Saturday.',
      jobType: 'SALON', urgency: 'High', severity: 'Minor',
      estimatedDuration: '1-2 hours', priceEstimate: 'Premium',
      status: 'MATCHES_FOUND', location: 'Los Angeles, CA', requestedDate: 'This Saturday',
    },
  });

  await prisma.jobRequest.create({
    data: {
      id: 'jr9', customerId: 'cust4', customerName: 'John Doe',
      description: 'My car is making a weird rattling noise from the engine.',
      jobType: 'CAR_SERVICES', urgency: 'High', severity: 'Major',
      estimatedDuration: 'Half a day', priceEstimate: 'Requires Quote',
      status: 'AWAITING_WORKER', location: 'Detroit, MI', requestedDate: 'ASAP',
    },
  });

  // ── Chat Threads & Messages ────────────────────────────────
  const thread1 = await prisma.chatThread.create({
    data: {
      id: 'thread1', jobRequestId: 'jr1',
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 5),
      participants: { connect: [{ id: 'cust1' }, { id: 'w1' }] },
    },
  });

  const thread2 = await prisma.chatThread.create({
    data: {
      id: 'thread2',
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      participants: { connect: [{ id: 'cust2' }, { id: 'w3' }] },
    },
  });

  const thread3 = await prisma.chatThread.create({
    data: {
      id: 'thread3',
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 30),
      participants: { connect: [{ id: 'cust1' }, { id: 'w2' }] },
    },
  });

  await prisma.chatMessage.createMany({
    data: [
      { id: 'msg1', threadId: 'thread1', senderId: 'cust1', receiverId: 'w1', text: 'Hi Alice, thanks for accepting the job! When can you come by?', isRead: true },
      { id: 'msg2', threadId: 'thread1', senderId: 'w1', receiverId: 'cust1', text: 'Hello! I can be there tomorrow morning around 9 AM. Does that work?', isRead: true },
      { id: 'msg3', threadId: 'thread1', senderId: 'cust1', receiverId: 'w1', text: 'Yes, 9 AM is perfect. See you then!', isRead: false },
      { id: 'msg4', threadId: 'thread2', senderId: 'cust2', receiverId: 'w3', text: 'Hi Carol, I saw your profile. Are you available for carpentry work next week?', isRead: true },
      { id: 'msg5', threadId: 'thread2', senderId: 'w3', receiverId: 'cust2', text: 'Hi Michael, yes I have some availability. What did you have in mind?', isRead: false },
      { id: 'msg6', threadId: 'thread3', senderId: 'cust1', receiverId: 'w2', text: 'Hi Bob, I need some electrical work done. Are you free this weekend?', isRead: false },
    ],
  });

  // ── Service Packages ───────────────────────────────────────
  await prisma.servicePackage.createMany({
    data: [
      {
        id: 'pkg_br_remodel', name: 'Basic Bathroom Refresh',
        description: 'Update essentials for a fresh look and feel.',
        categoryName: 'PLUMBING',
        includedFeatures: ['New Faucet Installation', 'Toilet Tune-up', 'Showerhead Replacement', 'Caulking Refresh'],
        indicativePrice: 'From $499', iconName: 'rectangle-stack',
      },
      {
        id: 'pkg_lighting_upgrade', name: 'Smart Lighting Setup',
        description: 'Modernize your home with smart lighting solutions.',
        categoryName: 'ELECTRICAL',
        includedFeatures: ['Consultation & Design', 'Up to 5 Smart Switch/Dimmer Installations', 'Hub Configuration', 'App Setup & Tutorial'],
        indicativePrice: 'From $350 + parts', iconName: 'rectangle-stack',
      },
    ],
  });

  // ── Subscription Plans ─────────────────────────────────────
  await prisma.subscriptionPlan.createMany({
    data: [
      {
        id: 'sub_hvac_monthly', name: 'HVAC Peace of Mind Plan',
        description: 'Regular maintenance to keep your system running smoothly.',
        categoryName: 'HVAC', frequency: 'Monthly', pricePerTerm: '$29/month',
        benefits: ['Monthly Filter Change', 'Seasonal System Check-up (2/year)', 'Priority Scheduling', '10% off Repairs'],
        iconName: 'arrow-path',
      },
      {
        id: 'sub_handyman_quarterly', name: 'Handyman Helper Subscription',
        description: 'Quarterly help with small tasks around the house.',
        categoryName: 'GENERAL_HANDYMAN', frequency: 'Quarterly', pricePerTerm: '$75/quarter',
        benefits: ['2 Hours of Handyman Service', 'Flexible Task List', 'Discount on Additional Hours'],
        iconName: 'arrow-path',
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
