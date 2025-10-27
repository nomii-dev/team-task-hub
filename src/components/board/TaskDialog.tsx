/**
 * Task Dialog Component
 * Modal for creating and editing tasks
 */

'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';
import { TaskWithDetails, TeamMemberWithUser, Status } from '@/types';

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  boardId: string;
  task?: TaskWithDetails;
  initialStatus?: Status;
  teamMembers: TeamMemberWithUser[];
  onSuccess: () => void;
}

export default function TaskDialog({
  open,
  onClose,
  boardId,
  task,
  initialStatus = 'TODO',
  teamMembers,
  onSuccess,
}: TaskDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: initialStatus,
    assigneeId: '',
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        assigneeId: task.assigneeId || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: initialStatus,
        assigneeId: '',
        dueDate: '',
      });
    }
  }, [task, initialStatus, open]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = task ? `/api/tasks/${task.id}` : `/api/boards/${boardId}/tasks`;
      const method = task ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          assigneeId: formData.assigneeId || null,
          dueDate: formData.dueDate || null,
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to save task');
      }
    } catch (error) {
      console.error('Failed to save task:', error);
      alert('Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
              fullWidth
              autoFocus
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              multiline
              rows={3}
              fullWidth
            />

            <TextField
              label="Status"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              select
              fullWidth
            >
              <MenuItem value="TODO">To Do</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="DONE">Done</MenuItem>
            </TextField>

            <TextField
              label="Assignee"
              value={formData.assigneeId}
              onChange={(e) => handleChange('assigneeId', e.target.value)}
              select
              fullWidth
            >
              <MenuItem value="">Unassigned</MenuItem>
              {teamMembers.map((member) => (
                <MenuItem key={member.userId} value={member.userId}>
                  {member.user.name || member.user.email}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving...' : task ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
