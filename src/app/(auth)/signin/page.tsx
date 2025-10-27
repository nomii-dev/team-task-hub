/**
 * Sign In Page
 * User login with email and password
 */

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Divider,
} from '@mui/material';
import { Dashboard } from '@mui/icons-material';

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Dashboard sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
        <Typography variant="h4" gutterBottom>
          Team Task-Hub
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sign in to your account
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            fullWidth
            autoFocus
          />

          <TextField
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            required
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Box>
      </form>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Don't have an account?{' '}
          <Link href="/signup" style={{ color: 'inherit', fontWeight: 600 }}>
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
}
