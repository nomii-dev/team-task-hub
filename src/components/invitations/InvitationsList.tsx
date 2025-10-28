/**
 * Invitations List Component
 * Displays pending team invitations with accept/reject actions
 */

'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import { Check, Close, Group } from '@mui/icons-material';

interface Invitation {
  id: string;
  role: string;
  createdAt: string;
  team: {
    id: string;
    name: string;
  };
  inviter: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

export default function InvitationsList() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/invitations');
      const data = await response.json();

      if (data.success) {
        setInvitations(data.data);
      } else {
        setError(data.error || 'Failed to load invitations');
      }
    } catch (err) {
      setError('Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  const handleInvitation = async (invitationId: string, action: 'accept' | 'reject') => {
    try {
      setProcessingId(invitationId);
      setError('');
      setSuccess('');

      const response = await fetch(`/api/invitations/${invitationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        // Remove the invitation from the list
        setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
        
        // Refresh the page after accepting to show new team
        if (action === 'accept') {
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      } else {
        setError(data.error || `Failed to ${action} invitation`);
      }
    } catch (err) {
      setError(`Failed to ${action} invitation`);
    } finally {
      setProcessingId(null);
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

      {invitations.length === 0 ? (
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Group sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No pending invitations
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                You'll see team invitations here when someone invites you
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {invitations.map((invitation) => (
            <Card key={invitation.id}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Avatar
                    src={invitation.inviter.image || undefined}
                    sx={{ width: 48, height: 48 }}
                  >
                    {invitation.inviter.name?.[0] || invitation.inviter.email[0]}
                  </Avatar>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {invitation.team.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>{invitation.inviter.name || invitation.inviter.email}</strong>{' '}
                      invited you to join as{' '}
                      <Chip
                        label={invitation.role}
                        size="small"
                        color={invitation.role === 'ADMIN' ? 'primary' : 'default'}
                        sx={{ ml: 0.5 }}
                      />
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {new Date(invitation.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>

                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<Check />}
                        onClick={() => handleInvitation(invitation.id, 'accept')}
                        disabled={processingId === invitation.id}
                      >
                        {processingId === invitation.id ? 'Processing...' : 'Accept'}
                      </Button>
                      
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<Close />}
                        onClick={() => handleInvitation(invitation.id, 'reject')}
                        disabled={processingId === invitation.id}
                      >
                        Decline
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}
