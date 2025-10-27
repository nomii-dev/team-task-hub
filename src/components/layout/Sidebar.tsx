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
} from '@mui/icons-material';
import { TeamWithMembers } from '@/types';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [teams, setTeams] = useState<TeamWithMembers[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams');
      const data = await response.json();
      
      if (data.success) {
        setTeams(data.data);
        // Auto-expand first team
        if (data.data.length > 0) {
          setExpandedTeams(new Set([data.data[0].id]));
        }
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error);
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
                    
                    {/* This would be populated with actual boards */}
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
