/**
 * Common Type Definitions
 * Shared types used across the application
 */

import { User, Team, Board, Task, TeamMember, Role, Status } from '@prisma/client';

// Extended types with relations
export type TeamWithMembers = Team & {
  members: (TeamMember & {
    user: User;
  })[];
  _count?: {
    boards: number;
  };
};

export type BoardWithTasks = Board & {
  tasks: Task[];
  team: Team;
};

export type TaskWithDetails = Task & {
  assignee: User | null;
  createdBy: User;
};

export type TeamMemberWithUser = TeamMember & {
  user: User;
};

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form data types
export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface CreateTeamFormData {
  name: string;
}

export interface CreateBoardFormData {
  name: string;
  teamId: string;
}

export interface CreateTaskFormData {
  title: string;
  description?: string;
  status: Status;
  boardId: string;
  assigneeId?: string;
  dueDate?: string;
}

export interface UpdateTaskFormData {
  title?: string;
  description?: string;
  status?: Status;
  assigneeId?: string;
  dueDate?: string;
  position?: number;
}

export interface UpdateProfileFormData {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

// Re-export Prisma enums for convenience
export { Role, Status };
