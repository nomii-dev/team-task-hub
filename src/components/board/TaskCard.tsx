/**
 * Task Card Component - Minimal Design
 * Simple, clean task card with minimal styling
 */

'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MoreVert,
  CalendarToday,
  Person,
  Edit,
  Delete,
  ArrowForward,
} from '@mui/icons-material';
import { TaskWithDetails, TeamMemberWithUser } from '@/types';
import { formatDate, getInitials, stringToColor } from '@/lib/utils';
import TaskDialog from './TaskDialog';

interface TaskCardProps {
  task: TaskWithDetails;
  teamMembers: TeamMemberWithUser[];
  onUpdate: () => void;
}

export default function TaskCard({ task, teamMembers, onUpdate }: TaskCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    setEditDialogOpen(true);
  };

  const handleDelete = async () => {
    handleMenuClose();
    
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleMoveStatus = async (newStatus: string) => {
    handleMenuClose();

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const assigneeName = task.assignee?.name || 'Unassigned';
  const assigneeInitials = getInitials(task.assignee?.name);
  const avatarColor = task.assignee ? stringToColor(assigneeName) : '#9e9e9e';

  return (
    <>
      <Card
        sx={{
          mb: 2,
          cursor: 'pointer',
          boxShadow: 1,
          overflow: 'visible',
          transition: 'box-shadow 0.2s, border-color 0.2s',
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            boxShadow: 2,
            borderColor: 'primary.main',
          },
        }}
        onClick={handleEdit}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 500,
                flexGrow: 1,
                pr: 1,
              }}
            >
              {task.title}
            </Typography>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleMenuOpen(e);
              }}
            >
              <MoreVert fontSize="small" />
            </IconButton>
          </Box>

          {/* Description */}
          {task.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {task.description}
            </Typography>
          )}

          {/* Footer */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: 1,
          }}>
            {/* Assignee */}
            {task.assignee ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: avatarColor,
                    fontSize: '0.75rem',
                  }}
                  src={task.assignee.image || undefined}
                >
                  {assigneeInitials}
                </Avatar>
                <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                  {task.assignee.name || task.assignee.email}
                </Typography>
              </Box>
            ) : (
              <Chip
                icon={<Person sx={{ fontSize: 16 }} />}
                label="Unassigned"
                size="small"
                variant="outlined"
              />
            )}

            {/* Due Date */}
            {task.dueDate && (
              <Chip
                icon={<CalendarToday sx={{ fontSize: 14 }} />}
                label={formatDate(task.dueDate)}
                size="small"
                color={new Date(task.dueDate) < new Date() ? 'error' : 'default'}
                variant="outlined"
              />
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit} sx={{ gap: 1 }}>
          <Edit fontSize="small" />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleMoveStatus('TODO')} sx={{ gap: 1 }}>
          <ArrowForward fontSize="small" />
          To Do
        </MenuItem>
        <MenuItem onClick={() => handleMoveStatus('IN_PROGRESS')} sx={{ gap: 1 }}>
          <ArrowForward fontSize="small" />
          In Progress
        </MenuItem>
        <MenuItem onClick={() => handleMoveStatus('DONE')} sx={{ gap: 1 }}>
          <ArrowForward fontSize="small" />
          Done
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ gap: 1, color: 'error.main' }}>
          <Delete fontSize="small" />
          Delete
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <TaskDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        boardId={task.boardId}
        task={task}
        teamMembers={teamMembers}
        onSuccess={() => {
          setEditDialogOpen(false);
          onUpdate();
        }}
      />
    </>
  );
}
