/**
 * Sidebar Component
 * Displays teams and boards navigation
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  Collapse,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard,
  Group,
  Add,
  ExpandLess,
  ExpandMore,
  ViewKanban,
  Mail,
} from '@mui/icons-material';
import { TeamWithMembers } from '@/types';

interface TeamWithBoards extends TeamWithMembers {
  boards?: Array<{
    id: string;
    name: string;
  }>;
}

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [teams, setTeams] = useState<TeamWithBoards[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams');
      
      if (!response.ok) {
        console.error('Failed to fetch teams:', response.status);
        setTeams([]);
        return;
      }
      
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        // Fetch boards for each team (only teams user is a member of)
        const teamsWithBoards = await Promise.all(
          data.data.map(async (team: TeamWithMembers) => {
            try {
              const boardsResponse = await fetch(`/api/teams/${team.id}/boards`);
              
              // If user is not a member (403), don't show boards
              if (boardsResponse.status === 403) {
                console.warn(`Access denied to boards for team ${team.id}`);
                return { ...team, boards: [] };
              }
              
              if (!boardsResponse.ok) {
                console.error(`Failed to fetch boards for team ${team.id}:`, boardsResponse.status);
                return { ...team, boards: [] };
              }
              
              const boardsData = await boardsResponse.json();
              return {
                ...team,
                boards: boardsData.success && Array.isArray(boardsData.data) ? boardsData.data : [],
              };
            } catch (error) {
              console.error(`Error fetching boards for team ${team.id}:`, error);
              return { ...team, boards: [] };
            }
          })
        );
        
        setTeams(teamsWithBoards);
        // Auto-expand first team
        if (teamsWithBoards.length > 0) {
          setExpandedTeams(new Set([teamsWithBoards[0].id]));
        }
      } else {
        console.error('Invalid teams data received:', data);
        setTeams([]);
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTeamClick = (teamId: string) => {
    setExpandedTeams((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(teamId)) {
        newSet.delete(teamId);
      } else {
        newSet.add(teamId);
      }
      return newSet;
    });
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose?.();
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar />
      
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<Add />}
          onClick={() => handleNavigation('/teams/new')}
        >
          Create Team
        </Button>
      </Box>

      <Divider />

      {/* Invitations Link */}
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleNavigation('/invitations')}
            selected={pathname === '/invitations'}
          >
            <ListItemIcon>
              <Mail />
            </ListItemIcon>
            <ListItemText primary="Invitations" />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider />

      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : teams.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No teams yet. Create one to get started!
            </Typography>
          </Box>
        ) : (
          <List>
            {teams.map((team) => (
              <Box key={team.id}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleTeamClick(team.id)}
                    selected={pathname.includes(team.id)}
                  >
                    <ListItemIcon>
                      <Group />
                    </ListItemIcon>
                    <ListItemText
                      primary={team.name}
                      secondary={`${team.members.length} members`}
                    />
                    {expandedTeams.has(team.id) ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                
                <Collapse in={expandedTeams.has(team.id)} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton
                      sx={{ pl: 4 }}
                      onClick={() => handleNavigation(`/teams/${team.id}`)}
                    >
                      <ListItemIcon>
                        <Dashboard fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Dashboard" />
                    </ListItemButton>
                    
                    {/* Display actual boards */}
                    {team.boards && team.boards.length > 0 && (
                      <>
                        <ListItem sx={{ pl: 4, py: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            Boards
                          </Typography>
                        </ListItem>
                        {team.boards.map((board) => (
                          <ListItemButton
                            key={board.id}
                            sx={{ pl: 6 }}
                            onClick={() => handleNavigation(`/teams/${team.id}/boards/${board.id}`)}
                            selected={pathname.includes(board.id)}
                          >
                            <ListItemIcon>
                              <ViewKanban fontSize="small" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={board.name}
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItemButton>
                        ))}
                      </>
                    )}
                    
                    {/* Create new board button */}
                    <ListItemButton
                      sx={{ pl: 4 }}
                      onClick={() => handleNavigation(`/teams/${team.id}/boards/new`)}
                    >
                      <ListItemIcon>
                        <Add fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="New Board" />
                    </ListItemButton>
                  </List>
                </Collapse>
              </Box>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}
