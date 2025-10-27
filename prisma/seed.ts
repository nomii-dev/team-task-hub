/**
 * Database Seed Script
 * Populates the database with sample data for testing and demo
 */

import { PrismaClient, Role, Status } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.task.deleteMany();
  await prisma.board.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleared existing data');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 12);

  const alice = await prisma.user.create({
    data: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: hashedPassword,
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: hashedPassword,
    },
  });

  const charlie = await prisma.user.create({
    data: {
      name: 'Charlie Davis',
      email: 'charlie@example.com',
      password: hashedPassword,
    },
  });

  console.log('✅ Created users');

  // Create teams
  const devTeam = await prisma.team.create({
    data: {
      name: 'Development Team',
      members: {
        create: [
          { userId: alice.id, role: Role.ADMIN },
          { userId: bob.id, role: Role.MEMBER },
          { userId: charlie.id, role: Role.MEMBER },
        ],
      },
    },
  });

  const marketingTeam = await prisma.team.create({
    data: {
      name: 'Marketing Team',
      members: {
        create: [
          { userId: bob.id, role: Role.ADMIN },
          { userId: alice.id, role: Role.MEMBER },
        ],
      },
    },
  });

  console.log('✅ Created teams');

  // Create boards
  const sprintBoard = await prisma.board.create({
    data: {
      name: 'Sprint 1 - Q1 2024',
      teamId: devTeam.id,
    },
  });

  const backlogBoard = await prisma.board.create({
    data: {
      name: 'Product Backlog',
      teamId: devTeam.id,
    },
  });

  const campaignBoard = await prisma.board.create({
    data: {
      name: 'Q1 Campaign',
      teamId: marketingTeam.id,
    },
  });

  console.log('✅ Created boards');

  // Create tasks for Sprint Board
  await prisma.task.createMany({
    data: [
      {
        title: 'Set up authentication system',
        description: 'Implement NextAuth.js with credentials and OAuth providers',
        status: Status.DONE,
        boardId: sprintBoard.id,
        assigneeId: alice.id,
        createdById: alice.id,
        position: 0,
        dueDate: new Date('2024-01-15'),
      },
      {
        title: 'Design database schema',
        description: 'Create Prisma schema for users, teams, boards, and tasks',
        status: Status.DONE,
        boardId: sprintBoard.id,
        assigneeId: alice.id,
        createdById: alice.id,
        position: 1,
        dueDate: new Date('2024-01-10'),
      },
      {
        title: 'Build task board UI',
        description: 'Create Kanban board with drag-and-drop functionality using MUI',
        status: Status.IN_PROGRESS,
        boardId: sprintBoard.id,
        assigneeId: bob.id,
        createdById: alice.id,
        position: 0,
        dueDate: new Date('2024-01-25'),
      },
      {
        title: 'Implement team management',
        description: 'Add features for creating teams, inviting members, and role management',
        status: Status.IN_PROGRESS,
        boardId: sprintBoard.id,
        assigneeId: charlie.id,
        createdById: alice.id,
        position: 1,
        dueDate: new Date('2024-01-28'),
      },
      {
        title: 'Add real-time updates',
        description: 'Implement WebSocket or SSE for live task updates across users',
        status: Status.TODO,
        boardId: sprintBoard.id,
        assigneeId: bob.id,
        createdById: alice.id,
        position: 0,
        dueDate: new Date('2024-02-05'),
      },
      {
        title: 'Write API documentation',
        description: 'Document all API endpoints with examples and response formats',
        status: Status.TODO,
        boardId: sprintBoard.id,
        assigneeId: charlie.id,
        createdById: alice.id,
        position: 1,
      },
      {
        title: 'Set up CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment',
        status: Status.TODO,
        boardId: sprintBoard.id,
        createdById: alice.id,
        position: 2,
      },
    ],
  });

  // Create tasks for Backlog Board
  await prisma.task.createMany({
    data: [
      {
        title: 'Add file attachments to tasks',
        description: 'Allow users to upload and attach files to tasks',
        status: Status.TODO,
        boardId: backlogBoard.id,
        createdById: alice.id,
        position: 0,
      },
      {
        title: 'Implement task comments',
        description: 'Add commenting system for task discussions',
        status: Status.TODO,
        boardId: backlogBoard.id,
        createdById: bob.id,
        position: 1,
      },
      {
        title: 'Add task labels/tags',
        description: 'Allow categorizing tasks with custom labels',
        status: Status.TODO,
        boardId: backlogBoard.id,
        createdById: charlie.id,
        position: 2,
      },
    ],
  });

  // Create tasks for Marketing Campaign Board
  await prisma.task.createMany({
    data: [
      {
        title: 'Create social media content calendar',
        description: 'Plan posts for Q1 across all platforms',
        status: Status.IN_PROGRESS,
        boardId: campaignBoard.id,
        assigneeId: bob.id,
        createdById: bob.id,
        position: 0,
        dueDate: new Date('2024-01-20'),
      },
      {
        title: 'Design campaign graphics',
        description: 'Create visual assets for the Q1 campaign',
        status: Status.TODO,
        boardId: campaignBoard.id,
        assigneeId: alice.id,
        createdById: bob.id,
        position: 0,
        dueDate: new Date('2024-01-30'),
      },
      {
        title: 'Launch email campaign',
        description: 'Send out Q1 newsletter to subscribers',
        status: Status.TODO,
        boardId: campaignBoard.id,
        createdById: bob.id,
        position: 1,
        dueDate: new Date('2024-02-01'),
      },
    ],
  });

  console.log('✅ Created tasks');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📝 Demo accounts:');
  console.log('   Email: alice@example.com | Password: password123 (Admin of Dev Team)');
  console.log('   Email: bob@example.com   | Password: password123 (Admin of Marketing Team)');
  console.log('   Email: charlie@example.com | Password: password123 (Member)');
  console.log('\n🚀 You can now sign in and explore the app!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
