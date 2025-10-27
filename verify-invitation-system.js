/**
 * Verification Script for Invitation System
 * Run this to verify the database migration was successful
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verify() {
  console.log('🔍 Verifying Invitation System Setup...\n');

  try {
    // Check if TeamInvitation model exists
    console.log('✓ Checking TeamInvitation model...');
    const invitationCount = await prisma.teamInvitation.count();
    console.log(`  Found ${invitationCount} invitations in database`);

    // Check if Notification model exists
    console.log('✓ Checking Notification model...');
    const notificationCount = await prisma.notification.count();
    console.log(`  Found ${notificationCount} notifications in database`);

    // Check if the models have the correct fields
    console.log('\n✓ Checking model structure...');
    
    // Try to query with all fields
    const testInvitation = await prisma.teamInvitation.findFirst({
      select: {
        id: true,
        teamId: true,
        invitedBy: true,
        invitedUser: true,
        role: true,
        status: true,
        createdAt: true,
        expiresAt: true,
        respondedAt: true,
      },
    });
    console.log('  TeamInvitation model structure: ✓');

    const testNotification = await prisma.notification.findFirst({
      select: {
        id: true,
        userId: true,
        type: true,
        title: true,
        message: true,
        read: true,
        data: true,
        createdAt: true,
      },
    });
    console.log('  Notification model structure: ✓');

    console.log('\n✅ All checks passed! Invitation system is ready to use.\n');
    console.log('Next steps:');
    console.log('1. Restart your dev server: npm run dev');
    console.log('2. Add NotificationBell to your layout');
    console.log('3. Test inviting a user\n');

  } catch (error) {
    console.error('\n❌ Verification failed:', error.message);
    console.error('\nPlease run:');
    console.error('  npx prisma generate');
    console.error('  npx prisma db push\n');
  } finally {
    await prisma.$disconnect();
  }
}

verify();
