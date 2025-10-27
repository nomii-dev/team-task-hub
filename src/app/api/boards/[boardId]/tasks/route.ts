/**
 * Board Tasks API Route
 * Handles creating tasks on a board
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getCurrentUser, canAccessBoard } from '@/lib/utils';
import { Status } from '@prisma/client';

const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).default('TODO'),
  assigneeId: z.string().optional(),
  dueDate: z.string().optional(),
});

/**
 * POST /api/boards/[boardId]/tasks
 * Create a new task on the board
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { boardId } = await params;
    
    // Check if user has access to this board
    const hasAccess = await canAccessBoard(user.id, boardId);
    
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to this board' },
        { status: 403 }
      );
    }
    
    const body = await req.json();
    const validatedData = createTaskSchema.parse(body);
    
    // Get the highest position for the status column
    const lastTask = await prisma.task.findFirst({
      where: {
        boardId,
        status: validatedData.status as Status,
      },
      orderBy: {
        position: 'desc',
      },
    });
    
    const position = lastTask ? lastTask.position + 1 : 0;
    
    const task = await prisma.task.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        status: validatedData.status as Status,
        boardId,
        assigneeId: validatedData.assigneeId,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
        createdById: user.id,
        position,
      },
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
    });
    
    return NextResponse.json(
      {
        success: true,
        message: 'Task created successfully',
        data: task,
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
    
    console.error('Create task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
