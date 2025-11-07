import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestUsers() {
  try {
    // Get today and yesterday dates
    const today = new Date();
    today.setHours(12, 0, 0, 0); // Set to noon for today
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(12, 0, 0, 0); // Set to noon for yesterday

    console.log('Creating test users...');
    console.log('Today:', today.toISOString());
    console.log('Yesterday:', yesterday.toISOString());

    // Create 2 users for yesterday
    const user1 = await prisma.user.create({
      data: {
        email: `test-user-yesterday-1-${Date.now()}@example.com`,
        name: 'Test User Yesterday 1',
        createdAt: yesterday,
      },
    });
    console.log('✅ Created user 1 (yesterday):', user1.id);

    const user2 = await prisma.user.create({
      data: {
        email: `test-user-yesterday-2-${Date.now()}@example.com`,
        name: 'Test User Yesterday 2',
        createdAt: yesterday,
      },
    });
    console.log('✅ Created user 2 (yesterday):', user2.id);

    // Create 1 user for today
    const user3 = await prisma.user.create({
      data: {
        email: `test-user-today-${Date.now()}@example.com`,
        name: 'Test User Today',
        createdAt: today,
      },
    });
    console.log('✅ Created user 3 (today):', user3.id);

    console.log('\n✅ Successfully created 3 test users!');
    console.log('   - 2 users for yesterday');
    console.log('   - 1 user for today');
  } catch (error) {
    console.error('❌ Error creating test users:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers();

