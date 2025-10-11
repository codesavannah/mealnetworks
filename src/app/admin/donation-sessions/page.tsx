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

interface DonationSession {
  id: string;
  sessionId: string;
  donorId: string;
  receiverId: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  foodDescription: string | null;
  quantity: string | null;
  createdAt: string;
  completedAt: string | null;
}

export default function DonationSessionsPage() {
  const [sessions, setSessions] = useState<DonationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      // TODO: Create API endpoint for fetching donation sessions
      // For now, show placeholder
      setSessions([]);
    } catch {
      setError('Failed to load donation sessions');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'ACTIVE': return 'info';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'error';
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
        Donation Sessions
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          All Donation Sessions ({sessions.length})
        </Typography>

        {sessions.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Session ID</TableCell>
                  <TableCell>Food Description</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Completed</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{session.sessionId}</TableCell>
                    <TableCell>{session.foodDescription || 'N/A'}</TableCell>
                    <TableCell>{session.quantity || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={session.status} 
                        size="small"
                        color={getStatusColor(session.status) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(session.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {session.completedAt 
                        ? new Date(session.completedAt).toLocaleDateString() 
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No donation sessions found.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Donation sessions will appear here once donors and receivers start interacting.
            </Typography>
          </Box>
        )}
      </Paper>
    </MainContainer>
  );
}

