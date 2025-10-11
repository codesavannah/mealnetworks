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

interface Receiver {
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

export default function ReceiversPage() {
  const [receivers, setReceivers] = useState<Receiver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReceivers();
  }, []);

  const fetchReceivers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        throw new Error('Failed to fetch receivers');
      }
      const data = await response.json();
      // Filter only RECEIVER users
      const receiverUsers = data.users.filter((u: any) => u.role === 'RECEIVER');
      setReceivers(receiverUsers);
    } catch {
      setError('Failed to load receivers');
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
        Receivers Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          All Receivers ({receivers.length})
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
              {receivers.map((receiver) => (
                <TableRow key={receiver.id}>
                  <TableCell>
                    {receiver.firstName} {receiver.lastName}
                  </TableCell>
                  <TableCell>{receiver.email}</TableCell>
                  <TableCell>{receiver.phoneNumber || 'N/A'}</TableCell>
                  <TableCell>
                    {receiver.city && receiver.state 
                      ? `${receiver.city}, ${receiver.state}` 
                      : receiver.city || receiver.state || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={receiver.status} 
                      size="small"
                      color={getStatusColor(receiver.status) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(receiver.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {receivers.length === 0 && (
          <Typography variant="body1" sx={{ textAlign: 'center', mt: 3 }}>
            No receivers found.
          </Typography>
        )}
      </Paper>
    </MainContainer>
  );
}

