/**
 * Team Member API Route
 * Handles updating and removing individual team members
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getCurrentUser, isTeamAdmin } from "@/lib/utils";
import { Role } from "@prisma/client";

const updateMemberSchema = z.object({
  role: z.enum(["ADMIN", "MEMBER"]),
});

/**
 * PATCH /api/teams/[teamId]/members/[memberId]
 * Update member role (admin only)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string; memberId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { teamId, memberId } = await params;

    // Check if user is an admin of the team
    const isAdmin = await isTeamAdmin(user.id, teamId);

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Only team admins can update member roles" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { role } = updateMemberSchema.parse(body);

    // Check if member exists
    const member = await prisma.teamMember.findUnique({
      where: { id: memberId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!member || member.teamId !== teamId) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Prevent removing the last admin
    if (member.role === "ADMIN" && role === "MEMBER") {
      const adminCount = await prisma.teamMember.count({
        where: {
          teamId,
          role: "ADMIN",
        },
      });

      if (adminCount <= 1) {
        return NextResponse.json(
          {
            error:
              "Cannot demote the last admin. Promote another member first.",
          },
          { status: 400 }
        );
      }
    }

    const updatedMember = await prisma.teamMember.update({
      where: { id: memberId },
      data: { role: role as Role },
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

    return NextResponse.json({
      success: true,
      message: "Member role updated successfully",
      data: updatedMember,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Update member error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/teams/[teamId]/members/[memberId]
 * Remove member from team (admin only)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string; memberId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { teamId, memberId } = await params;

    // Check if user is an admin of the team
    const isAdmin = await isTeamAdmin(user.id, teamId);

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Only team admins can remove members" },
        { status: 403 }
      );
    }

    // Check if member exists
    const member = await prisma.teamMember.findUnique({
      where: { id: memberId },
    });

    if (!member || member.teamId !== teamId) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Prevent removing the last admin
    if (member.role === "ADMIN") {
      const adminCount = await prisma.teamMember.count({
        where: {
          teamId,
          role: "ADMIN",
        },
      });

      if (adminCount <= 1) {
        return NextResponse.json(
          {
            error:
              "Cannot remove the last admin. Promote another member first.",
          },
          { status: 400 }
        );
      }
    }

    // Prevent self-removal
    if (member.userId === user.id) {
      return NextResponse.json(
        {
          error:
            "You cannot remove yourself from the team. Ask another admin to remove you.",
        },
        { status: 400 }
      );
    }

    await prisma.teamMember.delete({
      where: { id: memberId },
    });

    return NextResponse.json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    console.error("Remove member error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
