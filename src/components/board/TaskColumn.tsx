/**
 * Task Column Component
 * Displays a column of tasks for a specific status
 */

'use client';

import { Box, Typography, Paper, IconButton, Chip } from '@mui/material';
import { Add } from '@mui/icons-material';
import { TaskWithDetails, Status, TeamMemberWithUser } from '@/types';
import TaskCard from './TaskCard';

interface TaskColumnProps {
  title: string;
  status: Status;
  color: string;
  tasks: TaskWithDetails[];
  teamMembers: TeamMemberWithUser[];
  onCreateTask: () => void;
  onTaskUpdate: () => void;
}

export default function TaskColumn({
  title,
  status,
  color,
  tasks,
  teamMembers,
  onCreateTask,
  onTaskUpdate,
}: TaskColumnProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 400,
        overflow: 'visible',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Chip label={tasks.length} size="small" />
        </Box>
        <IconButton size="small" onClick={onCreateTask} color="primary">
          <Add />
        </IconButton>
      </Box>

      <Box 
        sx={{ 
          flexGrow: 1, 
          overflowY: 'auto',
          overflowX: 'visible',
          px: 0.5,
          mx: -0.5,
        }}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            teamMembers={teamMembers}
            onUpdate={onTaskUpdate}
          />
        ))}
        
        {tasks.length === 0 && (
          <Box
            sx={{
              p: 3,
              textAlign: 'center',
              color: 'text.secondary',
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Typography variant="body2">No tasks</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
