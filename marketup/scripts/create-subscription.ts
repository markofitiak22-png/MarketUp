import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createSubscription() {
  const email = process.argv[2] || 'markofitiak22@gmail.com';
  const tier = (process.argv[3] || 'STANDARD') as 'BASIC' | 'STANDARD' | 'PREMIUM';
  
  console.log(`Creating subscription for: ${email}`);
  console.log(`Tier: ${tier}\n`);

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log(`✅ User found: ${user.id}`);

    // Cancel existing active subscriptions
    const canceled = await prisma.subscription.updateMany({
      where: { 
        userId: user.id, 
        status: "ACTIVE" 
      },
      data: { 
        status: "CANCELED", 
        cancelAtPeriodEnd: true 
      },
    });

    console.log(`✅ Canceled ${canceled.count} existing subscriptions`);

    // Create new subscription
    const now = new Date();
    const end = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30); // 30 days

    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        tier: tier,
        status: "ACTIVE",
        currentPeriodStart: now,
        currentPeriodEnd: end,
      },
    });

    console.log(`✅ Subscription created:`);
    console.log(`   ID: ${subscription.id}`);
    console.log(`   Tier: ${subscription.tier}`);
    console.log(`   Status: ${subscription.status}`);
    console.log(`   Period End: ${subscription.currentPeriodEnd}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSubscription();

