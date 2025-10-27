/**
 * Invitation Action API Route
 * Handles accepting or rejecting team invitations
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/utils';

const actionSchema = z.object({
  action: z.enum(['accept', 'reject']),
});

/**
 * POST /api/invitations/[invitationId]
 * Accept or reject a team invitation
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ invitationId: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { invitationId } = await params;
    const body = await req.json();
    const { action } = actionSchema.parse(body);
    
    // Find the invitation
    const invitation = await prisma.teamInvitation.findUnique({
      where: { id: invitationId },
      include: {
        team: {
          select: {
            name: true,
          },
        },
      },
    });
    
    if (!invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }
    
    // Verify the invitation is for the current user
    if (invitation.invitedUser !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden: This invitation is not for you' },
        { status: 403 }
      );
    }
    
    // Check if invitation is still pending
    if (invitation.status !== 'PENDING') {
      return NextResponse.json(
        { error: `Invitation has already been ${invitation.status.toLowerCase()}` },
        { status: 400 }
      );
    }
    
    // Check if invitation has expired
    if (invitation.expiresAt && invitation.expiresAt < new Date()) {
      await prisma.teamInvitation.update({
        where: { id: invitationId },
        data: { status: 'EXPIRED' },
      });
      
      return NextResponse.json(
        { error: 'Invitation has expired' },
        { status: 400 }
      );
    }
    
    if (action === 'accept') {
      // Accept invitation - add user to team and update invitation status
      const result = await prisma.$transaction(async (tx) => {
        // Update invitation status
        const updatedInvitation = await tx.teamInvitation.update({
          where: { id: invitationId },
          data: {
            status: 'ACCEPTED',
            respondedAt: new Date(),
          },
        });
        
        // Add user to team
        const teamMember = await tx.teamMember.create({
          data: {
            userId: user.id,
            teamId: invitation.teamId,
            role: invitation.role,
          },
          include: {
            team: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });
        
        return { invitation: updatedInvitation, teamMember };
      });
      
      return NextResponse.json({
        success: true,
        message: `You have joined "${invitation.team.name}"`,
        data: result,
      });
    } else {
      // Reject invitation
      const updatedInvitation = await prisma.teamInvitation.update({
        where: { id: invitationId },
        data: {
          status: 'REJECTED',
          respondedAt: new Date(),
        },
      });
      
      return NextResponse.json({
        success: true,
        message: 'Invitation rejected',
        data: updatedInvitation,
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    console.error('Invitation action error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
