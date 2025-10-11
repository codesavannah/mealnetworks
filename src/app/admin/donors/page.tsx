"use client";
import { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import MainContainer from '@/components/MainContainer';

interface Donor {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  city: string | null;
  state: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'BLOCKED';
  createdAt: string;
}

export default function DonorsPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        throw new Error('Failed to fetch donors');
      }
      const data = await response.json();
      // Filter only DONOR users
      const donorUsers = data.users.filter((u: { role: string }) => u.role === 'DONOR');
      setDonors(donorUsers);
    } catch {
      setError('Failed to load donors');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'PENDING': return 'warning';
      case 'REJECTED': return 'error';
      case 'BLOCKED': return 'error';
      default: return 'default';
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

  return (
    <MainContainer>
      <Typography variant="h3" gutterBottom>
        Donors Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          All Donors ({donors.length})
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Registered</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {donors.map((donor) => (
                <TableRow key={donor.id}>
                  <TableCell>
                    {donor.firstName} {donor.lastName}
                  </TableCell>
                  <TableCell>{donor.email}</TableCell>
                  <TableCell>{donor.phoneNumber || 'N/A'}</TableCell>
                  <TableCell>
                    {donor.city && donor.state 
                      ? `${donor.city}, ${donor.state}` 
                      : donor.city || donor.state || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={donor.status} 
                      size="small"
                      color={getStatusColor(donor.status) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(donor.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {donors.length === 0 && (
          <Typography variant="body1" sx={{ textAlign: 'center', mt: 3 }}>
            No donors found.
          </Typography>
        )}
      </Paper>
    </MainContainer>
  );
}

