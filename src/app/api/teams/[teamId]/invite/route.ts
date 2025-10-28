/**
 * Team Invite API Route
 * Handles inviting users to a team (admin only)
 * Creates an invitation that the user must accept
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getCurrentUser, isTeamAdmin } from '@/lib/utils';
import { Role, NotificationType } from '@prisma/client';

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
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { teamId } = await params;
    
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
    
    // Check if there's already a pending invitation
    const existingInvitation = await prisma.teamInvitation.findUnique({
      where: {
        teamId_invitedUser: {
          teamId,
          invitedUser: invitedUser.id,
        },
      },
    });
    
    if (existingInvitation && existingInvitation.status === 'PENDING') {
      return NextResponse.json(
        { error: 'User already has a pending invitation to this team' },
        { status: 400 }
      );
    }
    
    // Get team details for the notification
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { name: true },
    });
    
    // Create invitation and notification in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create or update the invitation
      const invitation = await tx.teamInvitation.upsert({
        where: {
          teamId_invitedUser: {
            teamId,
            invitedUser: invitedUser.id,
          },
        },
        create: {
          teamId,
          invitedBy: user.id,
          invitedUser: invitedUser.id,
          role: validatedData.role as Role,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
        update: {
          status: 'PENDING',
          role: validatedData.role as Role,
          invitedBy: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          respondedAt: null,
        },
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
        },
      });
      
      // Create notification for the invited user
      await tx.notification.create({
        data: {
          userId: invitedUser.id,
          type: NotificationType.TEAM_INVITATION,
          title: 'Team Invitation',
          message: `${user.name || user.email} invited you to join "${team?.name}"`,
          data: {
            invitationId: invitation.id,
            teamId,
            teamName: team?.name,
            inviterName: user.name || user.email,
            role: validatedData.role,
          },
        },
      });
      
      return invitation;
    });
    
    return NextResponse.json(
      {
        success: true,
        message: 'Invitation sent successfully',
        data: result,
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
