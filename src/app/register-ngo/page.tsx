"use client";
import { Typography, Paper, Box, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Button, Chip, OutlinedInput, Alert } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import MainContainer from "@/components/MainContainer";
import RegistrationModal from "@/components/RegistrationModal";

const ngoSchema = z.object({
  // Organization Information
  ngoName: z.string().min(2, "NGO/Ashram name is required"),
  registrationNumber: z.string().min(3, "Registration number is required"),
  yearEstablished: z.date().refine(date => date.getFullYear() >= 1800, "Enter valid year"),
  orgType: z.string().min(1, "Select organization type"),
  registrationCertFile: z.any().optional(),
  
  // Contact Details
  contactPersonName: z.string().min(2, "Contact person name is required"),
  contactNumber: z.string().regex(/^[6-9]\d{9}$/, "Enter valid 10-digit mobile number"),
  emailAddress: z.string().email("Enter valid email address"),
  website: z.string().url("Enter valid website URL").optional().or(z.literal("")),
  
  // Location
  fullAddress: z.string().min(10, "Complete address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(1, "Select state"),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Enter valid 6-digit pincode"),
  
  // Operational Details
  serviceAreas: z.array(z.string()).min(1, "Select at least one service area"),
  dailyCapacity: z.number().min(1, "Daily capacity is required"),
  preferredDonations: z.array(z.string()).min(1, "Select at least one donation type"),
  
  // Verification & Consent
  idProofFile: z.any().optional(),
  logoFile: z.any().optional(),
  infoConfirm: z.boolean().refine(val => val === true, "Information confirmation required"),
  termsAccept: z.boolean().refine(val => val === true, "Terms acceptance required"),
});

type NGOFormData = z.infer<typeof ngoSchema>;

const orgTypeOptions = ["NGO", "Ashram", "Charitable Trust", "Other"];
const stateOptions = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh"
];
const serviceAreaOptions = ["Food Distribution", "Shelter", "Education", "Health", "Others"];
const donationTypeOptions = ["Cooked Food", "Raw Food", "Packaged Items", "Others"];

export default function RegisterNGOPage() {
  const [selectedServiceAreas, setSelectedServiceAreas] = useState<string[]>([]);
  const [selectedDonationTypes, setSelectedDonationTypes] = useState<string[]>([]);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
  
  const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm<NGOFormData>({
    resolver: zodResolver(ngoSchema),
    defaultValues: {
      infoConfirm: false,
      termsAccept: false,
      serviceAreas: [],
      preferredDonations: [],
    }
  });

  const onSubmit = (data: NGOFormData) => {
    console.log("NGO Registration submitted:", data);
    setSubmitStatus("Registration submitted successfully! (Frontend only - no backend integration yet)");
  };

  const handleServiceAreaChange = (event: { target: { value: string | string[] } }) => {
    const value = event.target.value;
    const areas = typeof value === 'string' ? value.split(',') : value;
    setSelectedServiceAreas(areas);
    setValue('serviceAreas', areas);
  };

  const handleDonationTypeChange = (event: { target: { value: string | string[] } }) => {
    const value = event.target.value;
    const types = typeof value === 'string' ? value.split(',') : value;
    setSelectedDonationTypes(types);
    setValue('preferredDonations', types);
  };

  const handleReset = () => {
    reset();
    setSelectedServiceAreas([]);
    setSelectedDonationTypes([]);
    setSubmitStatus(null);
  };

  return (
    <MainContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h3" gutterBottom>
          Register Your NGO / Ashram
        </Typography>
        
        {/* Apply for Receiver Button */}
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => setRegistrationModalOpen(true)}
          sx={{ 
            px: 3, 
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: 2,
            '&:hover': {
              boxShadow: 4
            }
          }}
        >
          Apply for Receiver
        </Button>
      </Box>
      
      <Paper sx={{ p: 4, mt: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Organization Information */}
            <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 3 }}>
              1. Organization Information
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                <Controller
                  name="ngoName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="NGO / Ashram Name"
                      error={!!errors.ngoName}
                      helperText={errors.ngoName?.message}
                    />
                  )}
                />
                
                <Controller
                  name="registrationNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Registration Number"
                      error={!!errors.registrationNumber}
                      helperText={errors.registrationNumber?.message}
                    />
                  )}
                />
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                <Controller
                  name="yearEstablished"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Year of Establishment"
                      views={['year']}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.yearEstablished,
                          helperText: errors.yearEstablished?.message
                        }
                      }}
                    />
                  )}
                />
                
                <Controller
                  name="orgType"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.orgType}>
                      <InputLabel>Type of Organization</InputLabel>
                      <Select {...field} label="Type of Organization">
                        {orgTypeOptions.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.orgType && (
                        <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                          {errors.orgType.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Box>
              
              <Controller
                name="registrationCertFile"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="file"
                    label="Upload Registration Certificate"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ accept: ".pdf,.jpg,.jpeg,.png" }}
                    onChange={(e) => {
                      const files = (e.target as HTMLInputElement).files;
                      onChange(files ? files[0] : null);
                    }}
                    helperText="Upload registration certificate (PDF, JPG, PNG)"
                  />
                )}
              />
            </Box>

            {/* Contact Details */}
            <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 3 }}>
              2. Contact Details
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                <Controller
                  name="contactPersonName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Contact Person Name"
                      error={!!errors.contactPersonName}
                      helperText={errors.contactPersonName?.message}
                    />
                  )}
                />
                
                <Controller
                  name="contactNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Contact Number"
                      InputProps={{
                        startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>+91</Box>
                      }}
                      placeholder="9876543210"
                      error={!!errors.contactNumber}
                      helperText={errors.contactNumber?.message}
                    />
                  )}
                />
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                <Controller
                  name="emailAddress"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="email"
                      label="Email Address"
                      error={!!errors.emailAddress}
                      helperText={errors.emailAddress?.message}
                    />
                  )}
                />
                
                <Controller
                  name="website"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Website (Optional)"
                      placeholder="https://www.example.org"
                      error={!!errors.website}
                      helperText={errors.website?.message}
                    />
                  )}
                />
              </Box>
            </Box>

            {/* Location */}
            <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 3 }}>
              3. Location
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
              <Controller
                name="fullAddress"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    label="Full Address"
                    placeholder="Enter complete address"
                    error={!!errors.fullAddress}
                    helperText={errors.fullAddress?.message || "Google Maps integration will be added later"}
                  />
                )}
              />
              
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="City"
                      error={!!errors.city}
                      helperText={errors.city?.message}
                    />
                  )}
                />
                
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.state}>
                      <InputLabel>State</InputLabel>
                      <Select {...field} label="State">
                        {stateOptions.map((state) => (
                          <MenuItem key={state} value={state}>
                            {state}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.state && (
                        <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                          {errors.state.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
                
                <Controller
                  name="pincode"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Pincode"
                      placeholder="400001"
                      error={!!errors.pincode}
                      helperText={errors.pincode?.message}
                    />
                  )}
                />
              </Box>
            </Box>

            {/* Operational Details */}
            <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 3 }}>
              4. Operational Details
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
              <FormControl fullWidth error={!!errors.serviceAreas}>
                <InputLabel>Areas of Service</InputLabel>
                <Select
                  multiple
                  value={selectedServiceAreas}
                  onChange={handleServiceAreaChange}
                  input={<OutlinedInput label="Areas of Service" />}
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
                {errors.serviceAreas && (
                  <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                    {errors.serviceAreas.message}
                  </Typography>
                )}
              </FormControl>
              
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                <Controller
                  name="dailyCapacity"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      fullWidth
                      type="number"
                      label="Daily Capacity (No. of People Served)"
                      placeholder="100"
                      error={!!errors.dailyCapacity}
                      helperText={errors.dailyCapacity?.message}
                    />
                  )}
                />
                
                <FormControl fullWidth error={!!errors.preferredDonations}>
                  <InputLabel>Preferred Donation Types</InputLabel>
                  <Select
                    multiple
                    value={selectedDonationTypes}
                    onChange={handleDonationTypeChange}
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
                  {errors.preferredDonations && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                      {errors.preferredDonations.message}
                    </Typography>
                  )}
                </FormControl>
              </Box>
            </Box>

            {/* Verification & Consent */}
            <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 3 }}>
              5. Verification & Consent
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
              <Controller
                name="idProofFile"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="file"
                    label="Upload ID Proof of Authorized Person"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ accept: ".pdf,.jpg,.jpeg,.png" }}
                    onChange={(e) => {
                      const files = (e.target as HTMLInputElement).files;
                      onChange(files ? files[0] : null);
                    }}
                    helperText="Upload Aadhaar/PAN of contact person (PDF, JPG)"
                  />
                )}
              />
              
              <Controller
                name="logoFile"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="file"
                    label="Upload NGO Logo / Image (Optional)"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ accept: ".jpg,.jpeg,.png,.svg" }}
                    onChange={(e) => {
                      const files = (e.target as HTMLInputElement).files;
                      onChange(files ? files[0] : null);
                    }}
                    helperText="Upload organization logo (JPG, PNG, SVG)"
                  />
                )}
              />
              
              <Box>
                <Controller
                  name="infoConfirm"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value} />}
                      label="I confirm that all provided information is true and valid."
                      sx={{ 
                        color: errors.infoConfirm ? 'error.main' : 'inherit',
                        '& .MuiFormControlLabel-label': {
                          fontSize: '0.95rem'
                        }
                      }}
                    />
                  )}
                />
                {errors.infoConfirm && (
                  <Typography variant="caption" color="error" display="block" sx={{ ml: 4, mt: -1 }}>
                    {errors.infoConfirm.message}
                  </Typography>
                )}
              </Box>
              
              <Box>
                <Controller
                  name="termsAccept"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value} />}
                      label="I agree to the Terms & Conditions."
                      sx={{ 
                        color: errors.termsAccept ? 'error.main' : 'inherit',
                        '& .MuiFormControlLabel-label': {
                          fontSize: '0.95rem'
                        }
                      }}
                    />
                  )}
                />
                {errors.termsAccept && (
                  <Typography variant="caption" color="error" display="block" sx={{ ml: 4, mt: -1 }}>
                    {errors.termsAccept.message}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Form Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
              >
                Submit Registration
              </Button>
              <Button
                type="button"
                variant="outlined"
                size="large"
                onClick={handleReset}
                sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
              >
                Reset
              </Button>
            </Box>

            {/* Status Message */}
            {submitStatus && (
              <Alert severity="success" sx={{ mt: 3 }}>
                {submitStatus}
              </Alert>
            )}
          </form>
        </LocalizationProvider>
      </Paper>

      {/* Registration Modal */}
      <RegistrationModal 
        open={registrationModalOpen}
        onClose={() => setRegistrationModalOpen(false)}
        onBackToLogin={() => setRegistrationModalOpen(false)}
      />
    </MainContainer>
  );
}
