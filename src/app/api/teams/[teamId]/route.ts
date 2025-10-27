/**
 * Team Details API Route
 * Handles getting team details and managing team
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, isTeamMember } from '@/lib/utils';

/**
 * GET /api/teams/[teamId]
 * Get team details with members and boards
 */
export async function GET(
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
    
    // Check if user is a member of the team
    const isMember = await isTeamMember(user.id, teamId);
    
    if (!isMember) {
      return NextResponse.json(
        { error: 'Forbidden: You are not a member of this team' },
        { status: 403 }
      );
    }
    
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
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
        },
        boards: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
    
    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: team,
    });
  } catch (error) {
    console.error('Get team error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
