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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Grid2 as Grid
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

interface DonorDetails extends Donor {
  aadhaarNumber: string | null;
  address: string | null;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
  approvedAt: string | null;
  updatedAt: string;
}

export default function DonorsPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDonor, setSelectedDonor] = useState<DonorDetails | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

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

  const fetchDonorDetails = async (donorId: string) => {
    setLoadingDetails(true);
    try {
      const response = await fetch(`/api/admin/users/${donorId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch donor details');
      }
      const data = await response.json();
      setSelectedDonor(data.user);
      setModalOpen(true);
    } catch {
      setError('Failed to load donor details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleDonorClick = (donorId: string) => {
    fetchDonorDetails(donorId);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedDonor(null);
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
                    <Box
                      component="span"
                      onClick={() => handleDonorClick(donor.id)}
                      sx={{
                        color: 'primary.main',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        '&:hover': {
                          color: 'primary.dark',
                        },
                      }}
                    >
                      {donor.firstName} {donor.lastName}
                    </Box>
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

      {/* Donor Details Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5">Donor Details</Typography>
        </DialogTitle>
        <DialogContent dividers>
          {loadingDetails ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : selectedDonor ? (
            <Grid container spacing={3}>
              <Grid size={12}>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  First Name
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedDonor.firstName}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Last Name
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedDonor.lastName}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedDonor.email}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Phone Number
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedDonor.phoneNumber || 'N/A'}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Aadhaar Number
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedDonor.aadhaarNumber || 'N/A'}
                </Typography>
              </Grid>

              <Grid size={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Address Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid size={12}>
                <Typography variant="body2" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedDonor.address || 'N/A'}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  City
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedDonor.city || 'N/A'}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  State
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedDonor.state || 'N/A'}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Pincode
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedDonor.pincode || 'N/A'}
                </Typography>
              </Grid>

              {(selectedDonor.latitude && selectedDonor.longitude) && (
                <>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Latitude
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedDonor.latitude}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Longitude
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedDonor.longitude}
                    </Typography>
                  </Grid>
                </>
              )}

              <Grid size={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Account Status
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={selectedDonor.status}
                    color={getStatusColor(selectedDonor.status) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Registered On
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {new Date(selectedDonor.createdAt).toLocaleString()}
                </Typography>
              </Grid>

              {selectedDonor.approvedAt && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Approved On
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {new Date(selectedDonor.approvedAt).toLocaleString()}
                  </Typography>
                </Grid>
              )}

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {new Date(selectedDonor.updatedAt).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </MainContainer>
  );
}

