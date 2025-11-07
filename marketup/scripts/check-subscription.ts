import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSubscription() {
  const email = process.argv[2] || 'markofitiak22@gmail.com';
  
  console.log(`Checking subscription for: ${email}\n`);

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log(`✅ User found: ${user.name || user.email}`);
    console.log(`   ID: ${user.id}\n`);

    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: 'ACTIVE'
      },
      orderBy: { createdAt: 'desc' }
    });

    if (activeSubscription) {
      console.log('✅ Active subscription found:');
      console.log(`   Tier: ${activeSubscription.tier}`);
      console.log(`   Status: ${activeSubscription.status}`);
      console.log(`   Created: ${activeSubscription.createdAt}`);
      console.log(`   Period End: ${activeSubscription.currentPeriodEnd}`);
    } else {
      console.log('❌ No active subscription found');
      console.log(`\nTotal subscriptions: ${user.subscriptions.length}`);
      
      if (user.subscriptions.length > 0) {
        console.log('\nAll subscriptions:');
        user.subscriptions.forEach((sub, i) => {
          console.log(`   ${i + 1}. ${sub.tier} - ${sub.status} (${sub.createdAt})`);
        });
      }
    }

    // Check payments
    const payments = await prisma.manualPayment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    console.log(`\n📊 Recent payments: ${payments.length}`);
    payments.forEach((payment, i) => {
      console.log(`   ${i + 1}. $${payment.amountCents / 100} - ${payment.status} (${payment.createdAt})`);
      if (payment.note) {
        console.log(`      Note: ${payment.note.split('\n')[0]}`);
      }
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSubscription();

