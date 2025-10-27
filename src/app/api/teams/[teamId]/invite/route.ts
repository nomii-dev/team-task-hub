/**
 * Team Invite API Route
 * Handles inviting users to a team (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getCurrentUser, isTeamAdmin } from '@/lib/utils';
import { Role } from '@prisma/client';

const inviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['ADMIN', 'MEMBER']).optional().default('MEMBER'),
});

/**
 * POST /api/teams/[teamId]/invite
 * Invite a user to join the team (admin only)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { teamId } = params;
    
    // Check if user is an admin of the team
    const isAdmin = await isTeamAdmin(user.id, teamId);
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Only team admins can invite members' },
        { status: 403 }
      );
    }
    
    const body = await req.json();
    const validatedData = inviteSchema.parse(body);
    
    // Find the user to invite
    const invitedUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    
    if (!invitedUser) {
      return NextResponse.json(
        { error: 'User with this email does not exist' },
        { status: 404 }
      );
    }
    
    // Check if user is already a member
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: invitedUser.id,
          teamId,
        },
      },
    });
    
    if (existingMember) {
      return NextResponse.json(
        { error: 'User is already a member of this team' },
        { status: 400 }
      );
    }
    
    // Add user to team
    const teamMember = await prisma.teamMember.create({
      data: {
        userId: invitedUser.id,
        teamId,
        role: validatedData.role as Role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
    
    return NextResponse.json(
      {
        success: true,
        message: 'User invited successfully',
        data: teamMember,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    console.error('Invite user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
