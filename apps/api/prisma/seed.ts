import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.chatMessage.deleteMany();
  await prisma.chatThread.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.jobEvidence.deleteMany();
  await prisma.changeOrder.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.jobRequest.deleteMany();
  await prisma.servicePackage.deleteMany();
  await prisma.subscriptionPlan.deleteMany();
  await prisma.workerService.deleteMany();
  await prisma.service.deleteMany();
  await prisma.serviceCategory.deleteMany();
  await prisma.worker.deleteMany();
  await prisma.address.deleteMany();
  await prisma.review.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Categories
  const catPlumbing = await prisma.serviceCategory.create({ data: { name: 'PLUMBING' } });
  const catElectrical = await prisma.serviceCategory.create({ data: { name: 'ELECTRICAL' } });
  const catHandyman = await prisma.serviceCategory.create({ data: { name: 'GENERAL_HANDYMAN' } });
  const catPainting = await prisma.serviceCategory.create({ data: { name: 'PAINTING' } });
  const catSalon = await prisma.serviceCategory.create({ data: { name: 'SALON' } });
  const catCar = await prisma.serviceCategory.create({ data: { name: 'CAR_SERVICES' } });

  // Services
  const svcLeak = await prisma.service.create({ data: { name: 'Fix Leak', categoryId: catPlumbing.id } });
  const svcWiring = await prisma.service.create({ data: { name: 'Wiring Repair', categoryId: catElectrical.id } });

  // Users
  const cust1 = await prisma.user.create({
    data: { id: 'cust1', name: 'Alice Customer', email: 'customer@example.com', password: hashedPassword, type: 'customer' },
  });

  const worker1 = await prisma.user.create({
    data: { id: 'w1', name: 'Bob Worker', email: 'worker@example.com', password: hashedPassword, type: 'worker' },
  });

  // Workers
  await prisma.worker.create({
    data: {
      id: 'w1', rating: 4.8, homeAddress: '123 Main St, New York, NY',
      availability: 'Mon-Fri, 8am-6pm', hourlyRateRange: '$60-$80', isVerified: true,
      services: {
        create: [
          { categoryId: catPlumbing.id },
          { categoryId: catElectrical.id }
        ]
      }
    },
  });

  // Jobs
  await prisma.jobRequest.create({
    data: {
      id: 'jr1', customerId: 'cust1', customerName: 'Alice Customer',
      description: 'My kitchen faucet is leaking constantly.',
      serviceId: svcLeak.id, urgency: 'High', severity: 'Major',
      estimatedDuration: '1-2 hours', priceEstimate: 'Moderate',
      status: 'MATCHES_FOUND', location: 'New York, NY'
    },
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
