/**
 * Task API Route
 * Handles updating and deleting individual tasks
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getCurrentUser, canAccessBoard } from '@/lib/utils';
import { Status } from '@prisma/client';

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  assigneeId: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  position: z.number().optional(),
});

/**
 * PUT /api/tasks/[taskId]
 * Update a task
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { taskId } = params;
    
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { boardId: true, status: true, position: true },
    });
    
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    // Check if user has access to the board
    const hasAccess = await canAccessBoard(user.id, task.boardId);
    
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to this task' },
        { status: 403 }
      );
    }
    
    const body = await req.json();
    const validatedData = updateTaskSchema.parse(body);
    
    // Handle status change - reposition task
    let updateData: any = { ...validatedData };
    
    if (validatedData.status && validatedData.status !== task.status) {
      // Get the highest position in the new status column
      const lastTask = await prisma.task.findFirst({
        where: {
          boardId: task.boardId,
          status: validatedData.status as Status,
        },
        orderBy: {
          position: 'desc',
        },
      });
      
      updateData.position = lastTask ? lastTask.position + 1 : 0;
    }
    
    // Handle date conversion
    if (validatedData.dueDate !== undefined) {
      updateData.dueDate = validatedData.dueDate ? new Date(validatedData.dueDate) : null;
    }
    
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
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
    
    return NextResponse.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    console.error('Update task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tasks/[taskId]
 * Delete a task
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { taskId } = params;
    
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { boardId: true },
    });
    
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    // Check if user has access to the board
    const hasAccess = await canAccessBoard(user.id, task.boardId);
    
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to this task' },
        { status: 403 }
      );
    }
    
    await prisma.task.delete({
      where: { id: taskId },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
