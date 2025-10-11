"use client";
import { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import MainContainer from '@/components/MainContainer';

interface User {
  role: string;
}

export default function MakeDonationPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch {
      // Handle error
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

  if (!user || user.role !== 'DONOR') {
    return (
      <MainContainer>
        <Alert severity="error">
          Access denied. This page is only for donors.
        </Alert>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <Typography variant="h3" gutterBottom>
        Make a Donation
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Donation Form Coming Soon
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            This feature will allow you to:
          </Typography>
          <Box component="ul" sx={{ textAlign: 'left', maxWidth: 500, mx: 'auto', mt: 2 }}>
            <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Browse nearby receivers on a map
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Select a receiver based on distance
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Provide food details (type, quantity, description)
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Create a donation session
            </Typography>
          </Box>
        </Box>
      </Paper>
    </MainContainer>
  );
}

