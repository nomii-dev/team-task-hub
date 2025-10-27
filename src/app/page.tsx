/**
 * Landing Page
 * Redirects to signin or teams based on authentication status
 */

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/signin');
  }

  // Get user's first team
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      teamMembers: {
        take: 1,
        orderBy: { joinedAt: 'desc' },
      },
    },
  });

  if (user?.teamMembers[0]) {
    redirect(`/teams/${user.teamMembers[0].teamId}`);
  }

  // No teams, redirect to teams page to create one
  redirect('/teams/new');
}
