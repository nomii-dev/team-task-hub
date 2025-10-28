/**
 * Invitations Page
 * Displays pending team invitations for the user
 */

import { Box, Container, Typography, Paper } from '@mui/material';
import InvitationsList from '@/components/invitations/InvitationsList';

export default function InvitationsPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Team Invitations
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Review and respond to team invitations you've received
        </Typography>
      </Paper>

      <InvitationsList />
    </Container>
  );
}
