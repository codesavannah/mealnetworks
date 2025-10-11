"use client";
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CloseIcon from '@mui/icons-material/Close';

interface ReceiverRegistrationModalProps {
  open: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
}

const organizationTypes = [
  "Trust", "Society", "Section 8 Company", "NGO", "Ashram", "Religious Organization", "Others"
];
const serviceAreaOptions = ["Food Distribution", "Shelter", "Education", "Health", "Others"];
const donationTypeOptions = ["Cooked Food", "Raw Food", "Packaged Items", "Others"];

export default function ReceiverRegistrationModal({ open, onClose, onBackToLogin }: ReceiverRegistrationModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'RECEIVER',
    
    // RECEIVER (NGO) fields
    ngoName: '',
    registrationNumber: '',
    yearEstablished: null as Date | null,
    organizationType: '',
    contactPersonName: '',
    contactNumber: '',
    website: '',
    ngoAddress: '',
    ngoCity: '',
    ngoState: '',
    ngoPincode: '',
    serviceAreas: [] as string[],
    dailyCapacity: '',
    preferredDonations: [] as string[],
    verificationFiles: null as File | null,
    infoConfirm: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleDateChange = (field: string) => (date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
  };

  const handleCheckboxChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.checked
    }));
  };

  const handleMultiSelectChange = (field: string) => (event: { target: { value: string | string[] } }) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? value.split(',') : value
    }));
  };

  const handleFileChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setFormData(prev => ({
      ...prev,
      [field]: files ? files[0] : null
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate required fields for RECEIVER
    if (!formData.email || !formData.password || !formData.ngoName || !formData.registrationNumber || !formData.contactPersonName || !formData.contactNumber) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (!formData.infoConfirm) {
      setError('Please confirm that the provided information is accurate');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      setSuccess('Registration successful! Your account is pending approval. You will receive an email once approved.');
      
      // Clear form after successful registration
      setTimeout(() => {
        handleClose();
      }, 3000);

    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      role: 'RECEIVER',
      ngoName: '',
      registrationNumber: '',
      yearEstablished: null,
      organizationType: '',
      contactPersonName: '',
      contactNumber: '',
      website: '',
      ngoAddress: '',
      ngoCity: '',
      ngoState: '',
      ngoPincode: '',
      serviceAreas: [],
      dailyCapacity: '',
      preferredDonations: [],
      verificationFiles: null,
      infoConfirm: false,
    });
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        p: 3,
        pb: 1
      }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          Register as Food Receiver
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
            
            <Grid container spacing={2}>
              {/* Organization Information */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                  Organization Information
                </Typography>
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="NGO / Ashram Name *"
                  value={formData.ngoName}
                  onChange={handleChange('ngoName')}
                  required
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Registration Number *"
                  value={formData.registrationNumber}
                  onChange={handleChange('registrationNumber')}
                  helperText="Trust/Society/80G registration number"
                  required
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <DatePicker
                  label="Year Established"
                  value={formData.yearEstablished}
                  onChange={handleDateChange('yearEstablished')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    }
                  }}
                />
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Organization Type</InputLabel>
                  <Select
                    value={formData.organizationType}
                    onChange={handleChange('organizationType')}
                    label="Organization Type"
                  >
                    {organizationTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Contact Person Details */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" sx={{ mb: 1, mt: 2, fontWeight: 600, color: 'primary.main' }}>
                  Contact Person Details
                </Typography>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Contact Person Name *"
                  value={formData.contactPersonName}
                  onChange={handleChange('contactPersonName')}
                  required
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Contact Number *"
                  value={formData.contactNumber}
                  onChange={handleChange('contactNumber')}
                  required
                />
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Email Address *"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  required
                />
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Website (Optional)"
                  value={formData.website}
                  onChange={handleChange('website')}
                  placeholder="https://example.org"
                />
              </Grid>

              {/* Account Security */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" sx={{ mb: 1, mt: 2, fontWeight: 600, color: 'primary.main' }}>
                  Account Security
                </Typography>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Password *"
                  type="password"
                  value={formData.password}
                  onChange={handleChange('password')}
                  required
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Confirm Password *"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  required
                />
              </Grid>

              {/* Address Details */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" sx={{ mb: 1, mt: 2, fontWeight: 600, color: 'primary.main' }}>
                  Address Details
                </Typography>
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Complete Address"
                  multiline
                  rows={3}
                  value={formData.ngoAddress}
                  onChange={handleChange('ngoAddress')}
                  placeholder="Street, Landmark, Area"
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.ngoCity}
                  onChange={handleChange('ngoCity')}
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="State"
                  value={formData.ngoState}
                  onChange={handleChange('ngoState')}
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="PIN Code"
                  value={formData.ngoPincode}
                  onChange={handleChange('ngoPincode')}
                  placeholder="400001"
                />
              </Grid>

              {/* Service Information */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" sx={{ mb: 1, mt: 2, fontWeight: 600, color: 'primary.main' }}>
                  Service Information
                </Typography>
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Service Areas</InputLabel>
                  <Select
                    multiple
                    value={formData.serviceAreas}
                    onChange={handleMultiSelectChange('serviceAreas')}
                    input={<OutlinedInput label="Service Areas" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {serviceAreaOptions.map((area) => (
                      <MenuItem key={area} value={area}>
                        {area}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Daily Capacity"
                  value={formData.dailyCapacity}
                  onChange={handleChange('dailyCapacity')}
                  placeholder="e.g., 200 people/day"
                  helperText="Number of people you can serve daily"
                />
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Preferred Donation Types</InputLabel>
                  <Select
                    multiple
                    value={formData.preferredDonations}
                    onChange={handleMultiSelectChange('preferredDonations')}
                    input={<OutlinedInput label="Preferred Donation Types" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {donationTypeOptions.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Verification Documents */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" sx={{ mb: 1, mt: 2, fontWeight: 600, color: 'primary.main' }}>
                  Verification Documents
                </Typography>
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  type="file"
                  label="Upload Documents"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ accept: ".pdf,.jpg,.jpeg,.png" }}
                  onChange={handleFileChange('verificationFiles')}
                  helperText="Registration certificate, 80G certificate, or other proof (PDF/Image)"
                />
              </Grid>

              {/* Confirmation */}
              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.infoConfirm}
                      onChange={handleCheckboxChange('infoConfirm')}
                      required
                    />
                  }
                  label="I confirm that all the provided information is accurate and verifiable."
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: 1.5,
                fontSize: '1.1rem',
                position: 'relative'
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Register as Receiver'
              )}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Button
                  variant="text"
                  onClick={onBackToLogin}
                  sx={{ 
                    p: 0,
                    minWidth: 'auto',
                    textTransform: 'none'
                  }}
                >
                  Back to Login
                </Button>
              </Typography>
            </Box>
          </Box>
        </LocalizationProvider>
      </DialogContent>
    </Dialog>
  );
}

