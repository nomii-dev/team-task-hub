/**
 * Team Dashboard Page
 * Shows team overview with boards and member management
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import { Add, ViewKanban } from '@mui/icons-material';
import { TeamWithMembers } from '@/types';
import MemberManagement from '@/components/team/MemberManagement';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`team-tabpanel-${index}`}
      aria-labelledby={`team-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function TeamDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const teamId = params.teamId as string;
  
  const [team, setTeam] = useState<TeamWithMembers | null>(null);
  const [boards, setBoards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createBoardOpen, setCreateBoardOpen] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [tabValue, setTabValue] = useState(0);

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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

  const currentMember = team.members.find((m) => m.user.email === session?.user?.email);
  const isAdmin = currentMember?.role === 'ADMIN';

  return (
    <Box>
      {/* Header */}
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
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateBoardOpen(true)}
          >
            Create Board
          </Button>
        )}
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Boards" />
          <Tab label="Members" />
        </Tabs>
      </Box>

      {/* Boards Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={2}>
          {boards.map((board) => (
            <Grid item xs={12} sm={6} md={4} key={board.id}>
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
      </TabPanel>

      {/* Members Tab */}
      <TabPanel value={tabValue} index={1}>
        <MemberManagement
          teamId={teamId}
          currentUserId={currentMember?.userId || ''}
          isAdmin={isAdmin}
        />
      </TabPanel>

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
    </Box>
  );
}
