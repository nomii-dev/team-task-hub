/**
 * Task Card Component
 * Displays individual task with details
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
          '&:hover': {
            boxShadow: 3,
          },
        }}
        onClick={handleEdit}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, flexGrow: 1 }}>
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

          {task.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
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

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {task.assignee ? (
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
            ) : (
              <Chip
                icon={<Person />}
                label="Unassigned"
                size="small"
                variant="outlined"
              />
            )}

            {task.dueDate && (
              <Chip
                icon={<CalendarToday />}
                label={formatDate(task.dueDate)}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        </CardContent>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={() => handleMoveStatus('TODO')}>Move to To Do</MenuItem>
        <MenuItem onClick={() => handleMoveStatus('IN_PROGRESS')}>Move to In Progress</MenuItem>
        <MenuItem onClick={() => handleMoveStatus('DONE')}>Move to Done</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Menu>

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
