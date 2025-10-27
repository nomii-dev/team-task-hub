/**
 * Check Invitations in Database
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkInvitations() {
  console.log('🔍 Checking invitations in database...\n');

  try {
    // Get all invitations
    const invitations = await prisma.teamInvitation.findMany({
      include: {
        team: {
          select: {
            name: true,
          },
        },
        inviter: {
          select: {
            name: true,
            email: true,
          },
        },
        invitee: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    console.log(`Found ${invitations.length} invitation(s):\n`);

    if (invitations.length === 0) {
      console.log('❌ No invitations found in database.');
      console.log('\nTo create a test invitation:');
      console.log('1. Log in as a team admin');
      console.log('2. Go to a team page');
      console.log('3. Click "Invite Member"');
      console.log('4. Enter an email of an existing user');
      console.log('5. Click "Send Invitation"\n');
    } else {
      invitations.forEach((inv, index) => {
        console.log(`${index + 1}. Invitation ID: ${inv.id}`);
        console.log(`   Team: ${inv.team.name}`);
        console.log(`   From: ${inv.inviter.name || inv.inviter.email}`);
        console.log(`   To: ${inv.invitee.name || inv.invitee.email}`);
        console.log(`   Role: ${inv.role}`);
        console.log(`   Status: ${inv.status}`);
        console.log(`   Created: ${inv.createdAt}`);
        console.log('');
      });
    }

    // Get all users for reference
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    console.log(`\n📧 Available users in database (${users.length}):`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.name || 'No name'})`);
    });

    // Get all notifications
    const notifications = await prisma.notification.findMany({
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    console.log(`\n🔔 Notifications in database (${notifications.length}):`);
    if (notifications.length > 0) {
      notifications.forEach((notif, index) => {
        console.log(`${index + 1}. ${notif.type} - ${notif.title}`);
        console.log(`   To: ${notif.user.email}`);
        console.log(`   Read: ${notif.read}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkInvitations();
