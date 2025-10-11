"use client";
import { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material';
import MainContainer from '@/components/MainContainer';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import HistoryIcon from '@mui/icons-material/History';
import PendingIcon from '@mui/icons-material/Pending';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
}

export default function DonorDashboard() {
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
        Donor Dashboard
      </Typography>

      <Typography variant="h6" color="text.secondary" gutterBottom>
        Welcome back, {user.firstName}!
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <VolunteerActivismIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">0</Typography>
                  <Typography color="text.secondary">Total Donations</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PendingIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">0</Typography>
                  <Typography color="text.secondary">Pending Sessions</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <HistoryIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">0</Typography>
                  <Typography color="text.secondary">Completed Donations</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Recent Activity
        </Typography>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No donation sessions yet.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Click on &quot;Make Donation&quot; to start your first donation!
          </Typography>
        </Box>
      </Paper>
    </MainContainer>
  );
}

