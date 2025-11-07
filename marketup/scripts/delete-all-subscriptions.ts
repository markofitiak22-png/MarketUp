import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteAllSubscriptions() {
  try {
    console.log('Deleting all subscriptions...\n');

    // Get count before deletion
    const countBefore = await prisma.subscription.count();
    console.log(`Found ${countBefore} subscriptions\n`);

    if (countBefore === 0) {
      console.log('No subscriptions to delete');
      return;
    }

    // Delete all subscriptions
    const result = await prisma.subscription.deleteMany({});

    console.log(`✅ Deleted ${result.count} subscriptions`);

    // Verify deletion
    const countAfter = await prisma.subscription.count();
    console.log(`Remaining subscriptions: ${countAfter}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllSubscriptions();

