/**
 * Team Boards API Route
 * Handles listing and creating boards for a team
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getCurrentUser, isTeamMember, isTeamAdmin } from '@/lib/utils';

const createBoardSchema = z.object({
  name: z.string().min(2, 'Board name must be at least 2 characters'),
});

/**
 * GET /api/teams/[teamId]/boards
 * Get all boards for a team
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
    
    const boards = await prisma.board.findMany({
      where: { teamId },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json({
      success: true,
      data: boards,
    });
  } catch (error) {
    console.error('Get boards error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/teams/[teamId]/boards
 * Create a new board (admin only)
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
        { error: 'Forbidden: Only team admins can create boards' },
        { status: 403 }
      );
    }
    
    const body = await req.json();
    const validatedData = createBoardSchema.parse(body);
    
    const board = await prisma.board.create({
      data: {
        name: validatedData.name,
        teamId,
      },
    });
    
    return NextResponse.json(
      {
        success: true,
        message: 'Board created successfully',
        data: board,
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
    
    console.error('Create board error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
