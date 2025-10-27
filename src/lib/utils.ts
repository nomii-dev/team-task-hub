/**
 * Utility Functions
 * Helper functions for authorization, validation, and common operations
 */

import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import prisma from './prisma';
import { Role } from '@prisma/client';

/**
 * Get the current authenticated user from session
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  return user;
}

/**
 * Check if user is a member of a team
 */
export async function isTeamMember(userId: string, teamId: string): Promise<boolean> {
  const membership = await prisma.teamMember.findUnique({
    where: {
      userId_teamId: {
        userId,
        teamId,
      },
    },
  });

  return !!membership;
}

/**
 * Check if user is an admin of a team
 */
export async function isTeamAdmin(userId: string, teamId: string): Promise<boolean> {
  const membership = await prisma.teamMember.findUnique({
    where: {
      userId_teamId: {
        userId,
        teamId,
      },
    },
  });

  return membership?.role === Role.ADMIN;
}

/**
 * Get user's role in a team
 */
export async function getUserTeamRole(userId: string, teamId: string): Promise<Role | null> {
  const membership = await prisma.teamMember.findUnique({
    where: {
      userId_teamId: {
        userId,
        teamId,
      },
    },
  });

  return membership?.role || null;
}

/**
 * Check if user has access to a board (via team membership)
 */
export async function canAccessBoard(userId: string, boardId: string): Promise<boolean> {
  const board = await prisma.board.findUnique({
    where: { id: boardId },
    include: {
      team: {
        include: {
          members: {
            where: { userId },
          },
        },
      },
    },
  });

  return !!board && board.team.members.length > 0;
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get initials from name for avatar
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Generate a random color for avatar background
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 65%, 50%)`;
}
