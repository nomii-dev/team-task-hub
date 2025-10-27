/**
 * Board View Component
 * Displays Kanban board with task columns
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
} from '@mui/material';
import { Add, MoreVert, Delete, Edit } from '@mui/icons-material';
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
  const router = useRouter();
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status>('TODO');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleCreateTask = (status: Status) => {
    setSelectedStatus(status);
    setTaskDialogOpen(true);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    setError('');

    try {
      const response = await fetch(`/api/boards/${board.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to team page after successful deletion
        router.push(`/teams/${board.team.id}`);
      } else {
        setError(data.error || 'Failed to delete board');
        setDeleting(false);
      }
    } catch (err) {
      setError('Failed to delete board');
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setError('');
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

        {/* Board Actions Menu */}
        <Box>
          <IconButton onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleDeleteClick}>
              <Delete sx={{ mr: 1 }} fontSize="small" />
              Delete Board
            </MenuItem>
          </Menu>
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

      {/* Create Task Dialog */}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Board?</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <DialogContentText>
            Are you sure you want to delete <strong>{board.name}</strong>?
          </DialogContentText>
          <DialogContentText sx={{ mt: 2, color: 'error.main' }}>
            This will permanently delete the board and all {board.tasks.length} task(s) in it. 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleting}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Board'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
