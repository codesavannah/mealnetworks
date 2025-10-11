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

export default function DonorHistoryPage() {
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
        My Donation History
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          All Donations (0)
        </Typography>

        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="body1" color="text.secondary">
            No donations yet.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Your donation history will appear here once you start making donations.
          </Typography>
        </Box>
      </Paper>
    </MainContainer>
  );
}

