/**
 * Profile Page
 * User profile and settings
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { getInitials, stringToColor } from '@/lib/utils';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || '',
      }));
    }
  }, [session]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setMessage({ type: '', text: '' });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email,
      };

      // Only include password if changing
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setMessage({ type: 'error', text: 'New passwords do not match' });
          setLoading(false);
          return;
        }
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully' });
        setFormData((prev) => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
        // Update session
        await update();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const userName = session?.user?.name || session?.user?.email || 'User';
  const userInitials = getInitials(session?.user?.name);
  const avatarColor = stringToColor(userName);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Profile Settings
      </Typography>

      <Paper sx={{ p: 4, maxWidth: 600 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          {session?.user?.image ? (
            <Avatar
              src={session.user.image}
              alt={userName}
              sx={{ width: 80, height: 80, mr: 2 }}
            />
          ) : (
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mr: 2,
                bgcolor: avatarColor,
                fontSize: '2rem',
              }}
            >
              {userInitials}
            </Avatar>
          )}
          <Box>
            <Typography variant="h6">{userName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {session?.user?.email}
            </Typography>
          </Box>
        </Box>

        {message.text && (
          <Alert severity={message.type as any} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}

        <form onSubmit={handleUpdateProfile}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h6">Personal Information</Typography>
            
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              fullWidth
            />

            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              fullWidth
            />

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">Change Password</Typography>
            <Typography variant="body2" color="text.secondary">
              Leave blank to keep current password
            </Typography>

            <TextField
              label="Current Password"
              type="password"
              value={formData.currentPassword}
              onChange={(e) => handleChange('currentPassword', e.target.value)}
              fullWidth
            />

            <TextField
              label="New Password"
              type="password"
              value={formData.newPassword}
              onChange={(e) => handleChange('newPassword', e.target.value)}
              fullWidth
              helperText="At least 6 characters"
            />

            <TextField
              label="Confirm New Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
