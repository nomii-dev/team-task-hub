/**
 * Sign Up Page
 * User registration with email and password
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

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Create account
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create account');
        setLoading(false);
        return;
      }

      // Auto sign in after successful registration
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Account created but failed to sign in. Please sign in manually.');
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
          Create your account
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
            label="Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            fullWidth
            autoFocus
          />

          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            required
            fullWidth
            helperText="At least 6 characters"
          />

          <TextField
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
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
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </Box>
      </form>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Link href="/signin" style={{ color: 'inherit', fontWeight: 600 }}>
            Sign In
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
}
