/**
 * Create Team Page
 * Form for creating a new team
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { Group } from '@mui/icons-material';

export default function NewTeamPage() {
  const router = useRouter();
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: teamName }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/teams/${data.data.id}`);
      } else {
        setError(data.error || 'Failed to create team');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Create New Team
      </Typography>
      
      <Paper sx={{ p: 4, mt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Group sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} />
          <Box>
            <Typography variant="h6">Start Your Team</Typography>
            <Typography variant="body2" color="text.secondary">
              Create a workspace for your team to collaborate
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
              fullWidth
              autoFocus
              placeholder="e.g., Development Team, Marketing Squad"
              helperText="Choose a name that describes your team"
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ flexGrow: 1 }}
              >
                {loading ? 'Creating...' : 'Create Team'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
