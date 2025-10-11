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

export default function ReceiverRequestsPage() {
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

  if (!user || user.role !== 'RECEIVER') {
    return (
      <MainContainer>
        <Alert severity="error">
          Access denied. This page is only for receivers.
        </Alert>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <Typography variant="h3" gutterBottom>
        Food Requests
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Food Request System Coming Soon
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            This feature will allow you to:
          </Typography>
          <Box component="ul" sx={{ textAlign: 'left', maxWidth: 500, mx: 'auto', mt: 2 }}>
            <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              View available donations from nearby donors
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Request specific food types
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Manage incoming donation requests
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Track donation session status
            </Typography>
          </Box>
        </Box>
      </Paper>
    </MainContainer>
  );
}

