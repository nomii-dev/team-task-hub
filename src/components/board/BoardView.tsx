/**
 * Board View Component
 * Displays Kanban board with task columns
 */

'use client';

import { useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { BoardWithTasks, TaskWithDetails, Status } from '@/types';
import TaskColumn from './TaskColumn';
import TaskDialog from './TaskDialog';

interface BoardViewProps {
  board: BoardWithTasks;
  onTaskUpdate: () => void;
}

const COLUMNS: { status: Status; title: string; color: string }[] = [
  { status: 'TODO', title: 'To Do', color: '#e3f2fd' },
  { status: 'IN_PROGRESS', title: 'In Progress', color: '#fff3e0' },
  { status: 'DONE', title: 'Done', color: '#e8f5e9' },
];

export default function BoardView({ board, onTaskUpdate }: BoardViewProps) {
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status>('TODO');

  const handleCreateTask = (status: Status) => {
    setSelectedStatus(status);
    setTaskDialogOpen(true);
  };

  const getTasksByStatus = (status: Status): TaskWithDetails[] => {
    return board.tasks.filter((task) => task.status === status);
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            {board.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {board.team.name}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(3, 1fr)',
          },
          gap: 2,
          minHeight: '70vh',
        }}
      >
        {COLUMNS.map((column) => (
          <TaskColumn
            key={column.status}
            title={column.title}
            status={column.status}
            color={column.color}
            tasks={getTasksByStatus(column.status)}
            teamMembers={board.team.members}
            onCreateTask={() => handleCreateTask(column.status)}
            onTaskUpdate={onTaskUpdate}
          />
        ))}
      </Box>

      <TaskDialog
        open={taskDialogOpen}
        onClose={() => setTaskDialogOpen(false)}
        boardId={board.id}
        initialStatus={selectedStatus}
        teamMembers={board.team.members}
        onSuccess={() => {
          setTaskDialogOpen(false);
          onTaskUpdate();
        }}
      />
    </Box>
  );
}
