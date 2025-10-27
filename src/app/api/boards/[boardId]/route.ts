/**
 * Board API Route
 * Handles getting, updating, and deleting boards
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getCurrentUser, canAccessBoard, isTeamAdmin } from '@/lib/utils';

const updateBoardSchema = z.object({
  name: z.string().min(2, 'Board name must be at least 2 characters'),
});

/**
 * GET /api/boards/[boardId]
 * Get board details with tasks
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { boardId: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { boardId } = params;
    
    // Check if user has access to this board
    const hasAccess = await canAccessBoard(user.id, boardId);
    
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to this board' },
        { status: 403 }
      );
    }
    
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        team: {
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
          },
        },
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: [
            { status: 'asc' },
            { position: 'asc' },
          ],
        },
      },
    });
    
    if (!board) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: board,
    });
  } catch (error) {
    console.error('Get board error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/boards/[boardId]
 * Update board (admin only)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { boardId: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { boardId } = params;
    
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      select: { teamId: true },
    });
    
    if (!board) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      );
    }
    
    // Check if user is an admin of the team
    const isAdmin = await isTeamAdmin(user.id, board.teamId);
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Only team admins can update boards' },
        { status: 403 }
      );
    }
    
    const body = await req.json();
    const validatedData = updateBoardSchema.parse(body);
    
    const updatedBoard = await prisma.board.update({
      where: { id: boardId },
      data: {
        name: validatedData.name,
      },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Board updated successfully',
      data: updatedBoard,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    console.error('Update board error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/boards/[boardId]
 * Delete board (admin only)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { boardId: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { boardId } = params;
    
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      select: { teamId: true },
    });
    
    if (!board) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      );
    }
    
    // Check if user is an admin of the team
    const isAdmin = await isTeamAdmin(user.id, board.teamId);
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Only team admins can delete boards' },
        { status: 403 }
      );
    }
    
    await prisma.board.delete({
      where: { id: boardId },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Board deleted successfully',
    });
  } catch (error) {
    console.error('Delete board error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
