/**
 * Profile API Route
 * Handles user profile operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/utils';

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).optional(),
});

/**
 * GET /api/profile
 * Get current user profile
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        teamMembers: {
          include: {
            team: true,
          },
        },
      },
    });
    
    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/profile
 * Update user profile
 */
export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    const validatedData = updateProfileSchema.parse(body);
    
    const updateData: any = {};
    
    // Update name
    if (validatedData.name) {
      updateData.name = validatedData.name;
    }
    
    // Update email
    if (validatedData.email && validatedData.email !== user.email) {
      // Check if email is already taken
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email is already in use' },
          { status: 400 }
        );
      }
      
      updateData.email = validatedData.email;
    }
    
    // Update password
    if (validatedData.newPassword) {
      if (!validatedData.currentPassword) {
        return NextResponse.json(
          { error: 'Current password is required to set a new password' },
          { status: 400 }
        );
      }
      
      // Verify current password
      if (user.password) {
        const isPasswordValid = await bcrypt.compare(
          validatedData.currentPassword,
          user.password
        );
        
        if (!isPasswordValid) {
          return NextResponse.json(
            { error: 'Current password is incorrect' },
            { status: 400 }
          );
        }
      }
      
      // Hash new password
      updateData.password = await bcrypt.hash(validatedData.newPassword, 12);
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
