"use client";
import { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import MainContainer from '@/components/MainContainer';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'DONOR' | 'RECEIVER' | 'SUPERADMIN';
  status: string;
  phoneNumber: string | null;
  aadhaarNumber: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      setUser(data.user);
    } catch {
      setError('Failed to load profile. Please login again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </MainContainer>
    );
  }

  if (!user) {
    return (
      <MainContainer>
        <Alert severity="error">
          Please login to view your profile.
        </Alert>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <Typography variant="h3" gutterBottom>
        My Profile
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Account Information
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="First Name"
              value={user.firstName}
              disabled
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Last Name"
              value={user.lastName}
              disabled
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Email"
              value={user.email}
              disabled
              helperText="Email cannot be changed"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Role"
              value={user.role}
              disabled
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Phone Number"
              value={user.phoneNumber || 'Not provided'}
              disabled
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Aadhaar Number"
              value={user.aadhaarNumber || 'Not provided'}
              disabled
              helperText="Aadhaar cannot be changed"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Address"
              value={user.address || 'Not provided'}
              disabled
              multiline
              rows={2}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="City"
              value={user.city || 'Not provided'}
              disabled
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="State"
              value={user.state || 'Not provided'}
              disabled
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="PIN Code"
              value={user.pincode || 'Not provided'}
              disabled
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Profile editing feature will be available soon. For now, please contact support to update your information.
          </Typography>
        </Box>
      </Paper>
    </MainContainer>
  );
}

