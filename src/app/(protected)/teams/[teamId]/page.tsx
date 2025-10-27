/**
 * Team Dashboard Page
 * Shows team overview with boards and members
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import { Add, ViewKanban, Group } from '@mui/icons-material';
import { TeamWithMembers } from '@/types';
import { getInitials, stringToColor } from '@/lib/utils';

export default function TeamDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.teamId as string;
  
  const [team, setTeam] = useState<TeamWithMembers | null>(null);
  const [boards, setBoards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createBoardOpen, setCreateBoardOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    fetchTeamData();
  }, [teamId]);

  const fetchTeamData = async () => {
    try {
      const [teamRes, boardsRes] = await Promise.all([
        fetch(`/api/teams/${teamId}`),
        fetch(`/api/teams/${teamId}/boards`),
      ]);

      const teamData = await teamRes.json();
      const boardsData = await boardsRes.json();

      if (teamData.success) setTeam(teamData.data);
      if (boardsData.success) setBoards(boardsData.data);
    } catch (error) {
      console.error('Failed to fetch team data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async () => {
    try {
      const response = await fetch(`/api/teams/${teamId}/boards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: boardName }),
      });

      if (response.ok) {
        setBoardName('');
        setCreateBoardOpen(false);
        fetchTeamData();
      }
    } catch (error) {
      console.error('Failed to create board:', error);
    }
  };

  const handleInviteMember = async () => {
    try {
      const response = await fetch(`/api/teams/${teamId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setInviteEmail('');
        setInviteDialogOpen(false);
        fetchTeamData();
        alert('Member invited successfully!');
      } else {
        alert(data.error || 'Failed to invite member');
      }
    } catch (error) {
      console.error('Failed to invite member:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!team) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Team not found</Typography>
      </Box>
    );
  }

  const isAdmin = team.members.some((m) => m.role === 'ADMIN');

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            {team.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {team.members.length} members • {boards.length} boards
          </Typography>
        </Box>
        {isAdmin && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Group />}
              onClick={() => setInviteDialogOpen(true)}
            >
              Invite Member
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setCreateBoardOpen(true)}
            >
              Create Board
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Boards Section */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Boards
          </Typography>
          <Grid container spacing={2}>
            {boards.map((board) => (
              <Grid item xs={12} sm={6} key={board.id}>
                <Card>
                  <CardActionArea onClick={() => router.push(`/teams/${teamId}/boards/${board.id}`)}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <ViewKanban sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6">{board.name}</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {board._count?.tasks || 0} tasks
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
            {boards.length === 0 && (
              <Grid item xs={12}>
                <Card sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    No boards yet. Create one to get started!
                  </Typography>
                </Card>
              </Grid>
            )}
          </Grid>
        </Grid>

        {/* Members Section */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Team Members
          </Typography>
          <Card>
            <List>
              {team.members.map((member) => (
                <ListItem key={member.id}>
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
                    secondary={member.user.email}
                  />
                  {member.role === 'ADMIN' && (
                    <Chip label="Admin" size="small" color="primary" />
                  )}
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>
      </Grid>

      {/* Create Board Dialog */}
      <Dialog open={createBoardOpen} onClose={() => setCreateBoardOpen(false)}>
        <DialogTitle>Create New Board</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Board Name"
            fullWidth
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateBoardOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateBoard} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Invite Member Dialog */}
      <Dialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)}>
        <DialogTitle>Invite Team Member</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            helperText="User must have an account to be invited"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleInviteMember} variant="contained">
            Invite
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
