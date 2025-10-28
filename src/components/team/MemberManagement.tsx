/**
 * Member Management Component
 * Comprehensive CRUD operations for team members
 */

'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  MoreVert,
  PersonAdd,
  Edit,
  Delete,
  AdminPanelSettings,
  Person,
} from '@mui/icons-material';
import { getInitials, stringToColor } from '@/lib/utils';

interface Member {
  id: string;
  userId: string;
  role: 'ADMIN' | 'MEMBER';
  joinedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

interface MemberManagementProps {
  teamId: string;
  currentUserId: string;
  isAdmin: boolean;
}

export default function MemberManagement({ teamId, currentUserId, isAdmin }: MemberManagementProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  
  // Dialogs
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  
  // Form states
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'ADMIN' | 'MEMBER'>('MEMBER');
  const [newRole, setNewRole] = useState<'ADMIN' | 'MEMBER'>('MEMBER');
  
  // UI states
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMembers();
  }, [teamId]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/teams/${teamId}/members`);
      const data = await response.json();

      if (data.success) {
        setMembers(data.data);
      } else {
        setError(data.error || 'Failed to load members');
      }
    } catch (err) {
      setError('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, member: Member) => {
    setAnchorEl(event.currentTarget);
    setSelectedMember(member);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleInviteClick = () => {
    setInviteDialogOpen(true);
  };

  const handleRoleClick = () => {
    if (selectedMember) {
      setNewRole(selectedMember.role);
      setRoleDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleRemoveClick = () => {
    setRemoveDialogOpen(true);
    handleMenuClose();
  };

  const handleInviteMember = async () => {
    setProcessing(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/teams/${teamId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: inviteEmail,
          role: inviteRole,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Invitation sent successfully!');
        setInviteEmail('');
        setInviteRole('MEMBER');
        setInviteDialogOpen(false);
        // Note: Member will appear after they accept the invitation
      } else {
        setError(data.error || 'Failed to send invitation');
      }
    } catch (err) {
      setError('Failed to send invitation');
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedMember) return;

    setProcessing(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/teams/${teamId}/members/${selectedMember.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Member role updated successfully!');
        setRoleDialogOpen(false);
        setSelectedMember(null);
        fetchMembers();
      } else {
        setError(data.error || 'Failed to update role');
      }
    } catch (err) {
      setError('Failed to update role');
    } finally {
      setProcessing(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!selectedMember) return;

    setProcessing(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/teams/${teamId}/members/${selectedMember.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Member removed successfully!');
        setRemoveDialogOpen(false);
        setSelectedMember(null);
        fetchMembers();
      } else {
        setError(data.error || 'Failed to remove member');
      }
    } catch (err) {
      setError('Failed to remove member');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Team Members ({members.length})
        </Typography>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={handleInviteClick}
          >
            Invite Member
          </Button>
        )}
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Members List */}
      <Card>
        <List>
          {members.map((member, index) => (
            <Box key={member.id}>
              <ListItem
                secondaryAction={
                  isAdmin && member.userId !== currentUserId && (
                    <IconButton
                      edge="end"
                      onClick={(e) => handleMenuOpen(e, member)}
                    >
                      <MoreVert />
                    </IconButton>
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar
                    src={member.user.image || undefined}
                    sx={{ bgcolor: stringToColor(member.user.name || member.user.email) }}
                  >
                    {getInitials(member.user.name)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={member.user.name || member.user.email}
                  secondary={
                    <>
                      {member.user.email}
                      {' • Joined '}
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </>
                  }
                  primaryTypographyProps={{
                    sx: { display: 'flex', alignItems: 'center', gap: 1 }
                  }}
                  secondaryTypographyProps={{
                    component: 'span'
                  }}
                />
                {member.userId === currentUserId && (
                  <Chip 
                    label="You" 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ ml: 1 }}
                  />
                )}
                <Chip
                  icon={member.role === 'ADMIN' ? <AdminPanelSettings /> : <Person />}
                  label={member.role}
                  size="small"
                  color={member.role === 'ADMIN' ? 'primary' : 'default'}
                />
              </ListItem>
              {index < members.length - 1 && <Divider variant="inset" component="li" />}
            </Box>
          ))}
        </List>
      </Card>

      {/* Member Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleRoleClick}>
          <Edit sx={{ mr: 1 }} fontSize="small" />
          Change Role
        </MenuItem>
        <MenuItem onClick={handleRemoveClick}>
          <Delete sx={{ mr: 1 }} fontSize="small" />
          Remove Member
        </MenuItem>
      </Menu>

      {/* Invite Member Dialog */}
      <Dialog
        open={inviteDialogOpen}
        onClose={() => !processing && setInviteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Invite Team Member</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              autoFocus
              label="Email Address"
              type="email"
              fullWidth
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              helperText="User must have an account to be invited"
              disabled={processing}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={inviteRole}
                label="Role"
                onChange={(e) => setInviteRole(e.target.value as 'ADMIN' | 'MEMBER')}
                disabled={processing}
              >
                <MenuItem value="MEMBER">Member - Can view and edit tasks</MenuItem>
                <MenuItem value="ADMIN">Admin - Full team management access</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteDialogOpen(false)} disabled={processing}>
            Cancel
          </Button>
          <Button
            onClick={handleInviteMember}
            variant="contained"
            disabled={processing || !inviteEmail}
          >
            {processing ? 'Sending...' : 'Send Invitation'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog
        open={roleDialogOpen}
        onClose={() => !processing && setRoleDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Member Role</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Change role for <strong>{selectedMember?.user.name || selectedMember?.user.email}</strong>
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={newRole}
                label="Role"
                onChange={(e) => setNewRole(e.target.value as 'ADMIN' | 'MEMBER')}
                disabled={processing}
              >
                <MenuItem value="MEMBER">Member - Can view and edit tasks</MenuItem>
                <MenuItem value="ADMIN">Admin - Full team management access</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleDialogOpen(false)} disabled={processing}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdateRole}
            variant="contained"
            disabled={processing || newRole === selectedMember?.role}
          >
            {processing ? 'Updating...' : 'Update Role'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Remove Member Dialog */}
      <Dialog
        open={removeDialogOpen}
        onClose={() => !processing && setRemoveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Remove Member?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove <strong>{selectedMember?.user.name || selectedMember?.user.email}</strong> from the team?
          </DialogContentText>
          <DialogContentText sx={{ mt: 2, color: 'error.main' }}>
            They will lose access to all team boards and tasks. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveDialogOpen(false)} disabled={processing}>
            Cancel
          </Button>
          <Button
            onClick={handleRemoveMember}
            color="error"
            variant="contained"
            disabled={processing}
          >
            {processing ? 'Removing...' : 'Remove Member'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
