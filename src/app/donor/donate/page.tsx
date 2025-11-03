"use client";
import { Typography, Paper, Box, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Button, Chip, OutlinedInput, Switch, Alert, RadioGroup, Radio, FormLabel } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import MainContainer from "@/components/MainContainer";
import CircularProgress from "@mui/material/CircularProgress";
import dynamic from 'next/dynamic';
import GoogleMapsProvider from '@/components/GoogleMapsProvider';

// Dynamic import to avoid SSR issues
const MapLocationPicker = dynamic(
  () => import('@/components/MapLocationPicker'),
  { 
    ssr: false,
    loading: () => <CircularProgress />
  }
);

const donationSchema = z.object({
  // Address/Pickup Location
  address: z.string().min(10, "Complete address is required"),
  taluka: z.string().min(2, "Taluka is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Enter valid 6-digit pincode"),
  latitude: z.number().min(-90).max(90, "Invalid latitude"),
  longitude: z.number().min(-180).max(180, "Invalid longitude"),
  formattedAddress: z.string().optional(),
  
  // Food Details
  foodPackaging: z.enum(["unpacked_bulk", "packed_bulk", "portioned"], { message: "Select food packaging type" }),
  foodTypes: z.array(z.string()).min(1, "Select at least one food type"),
  numberOfItems: z.number().min(1, "Number of items required"),
  foodDescription: z.string().min(5, "Food description is required"),
  quantityServings: z.number().min(1, "Quantity/servings required"),
  preparationDateTime: z.date().optional(),
  expiryDateTime: z.date().optional(),
  
  // Logistics
  preferredPickupTime: z.string().min(1, "Select preferred pickup time"),
  deliveryPossible: z.boolean(),
  specialInstructions: z.string().optional(),
  
  // Verification & Consent
  photoFile: z.any().optional(),
  safetyConfirm: z.boolean().refine(val => val === true, "Safety confirmation required"),
  termsAccept: z.boolean().refine(val => val === true, "Terms acceptance required"),
});

type DonationFormData = z.infer<typeof donationSchema>;

const foodTypeOptions = ["Cooked", "Raw", "Packaged", "Beverages", "Others"];
const pickupTimeOptions = ["Morning (8 AM - 12 PM)", "Afternoon (12 PM - 4 PM)", "Evening (4 PM - 8 PM)", "ASAP"];

export default function MakeDonationPage() {
  const [user, setUser] = useState<{role: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFoodTypes, setSelectedFoodTypes] = useState<string[]>([]);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  
  const { control, handleSubmit, formState: { errors }, setValue } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      deliveryPossible: false,
      safetyConfirm: false,
      termsAccept: false,
      foodTypes: [],
      foodPackaging: "unpacked_bulk",
      latitude: 0,
      longitude: 0,
    }
  });

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

  const onSubmit = (data: DonationFormData) => {
    // Validate location is selected
    if (!data.latitude || !data.longitude || data.latitude === 0 || data.longitude === 0) {
      setLocationError('Please select your pickup location on the map');
      return;
    }
    
    console.log("Form submitted:", data);
    setSubmitStatus("Donation submitted successfully! (Frontend only - backend integration pending)");
    setLocationError('');
  };

  const handleFoodTypeChange = (event: { target: { value: string | string[] } }) => {
    const value = event.target.value;
    setSelectedFoodTypes(typeof value === 'string' ? value.split(',') : value);
    setValue('foodTypes', typeof value === 'string' ? value.split(',') : value);
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setValue('latitude', lat);
    setValue('longitude', lng);
    setValue('formattedAddress', address);
    setLocationError('');
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
      
      <Paper sx={{ p: 4, mt: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Address / Pickup Location */}
            <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 3 }}>
              1. Address / Pickup Location
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
              {/* Google Maps Location Picker */}
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                  Select Pickup Location on Map *
                </Typography>
                <GoogleMapsProvider>
                  <MapLocationPicker
                    onLocationSelect={handleLocationSelect}
                  />
                </GoogleMapsProvider>
                {locationError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {locationError}
                  </Alert>
                )}
              </Box>

              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    label="Address / Pickup Location"
                    placeholder="Enter complete pickup address"
                    error={!!errors.address}
                    helperText={errors.address?.message || "This will be auto-filled from the map or you can enter manually"}
                  />
                )}
              />
              
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                <Controller
                  name="taluka"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Taluka"
                      error={!!errors.taluka}
                      helperText={errors.taluka?.message}
                    />
                  )}
                />
                
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
              </Box>

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="State"
                      error={!!errors.state}
                      helperText={errors.state?.message}
                    />
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

            {/* Food Details */}
            <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 3 }}>
              2. Food Details
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
              {/* Food Packaging Type */}
              <Controller
                name="foodPackaging"
                control={control}
                render={({ field }) => (
                  <FormControl component="fieldset" error={!!errors.foodPackaging}>
                    <FormLabel component="legend">Food Packaging Type *</FormLabel>
                    <RadioGroup {...field} row>
                      <FormControlLabel value="unpacked_bulk" control={<Radio />} label="Unpacked / Bulk" />
                      <FormControlLabel value="packed_bulk" control={<Radio />} label="Packed / Bulk" />
                      <FormControlLabel value="portioned" control={<Radio />} label="Portioned" />
                    </RadioGroup>
                    {errors.foodPackaging && (
                      <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                        {errors.foodPackaging.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                <FormControl fullWidth error={!!errors.foodTypes}>
                  <InputLabel>Type of Food</InputLabel>
                  <Select
                    multiple
                    value={selectedFoodTypes}
                    onChange={handleFoodTypeChange}
                    input={<OutlinedInput label="Type of Food" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {foodTypeOptions.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.foodTypes && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                      {errors.foodTypes.message}
                    </Typography>
                  )}
                </FormControl>
                
                <Controller
                  name="numberOfItems"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      fullWidth
                      type="number"
                      label="Number of Food Items"
                      error={!!errors.numberOfItems}
                      helperText={errors.numberOfItems?.message}
                    />
                  )}
                />
              </Box>
              
              <Controller
                name="foodDescription"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    label="Food Description"
                    placeholder="e.g., Rice, Dal, Chapati, Sabji, etc."
                    error={!!errors.foodDescription}
                    helperText={errors.foodDescription?.message}
                  />
                )}
              />
              
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                <Controller
                  name="quantityServings"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      fullWidth
                      type="number"
                      label="Quantity / Servings"
                      placeholder="Number of people it can serve"
                      error={!!errors.quantityServings}
                      helperText={errors.quantityServings?.message}
                    />
                  )}
                />
                
                <Controller
                  name="preparationDateTime"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      {...field}
                      label="Preparation Date & Time"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          helperText: "For cooked items"
                        }
                      }}
                    />
                  )}
                />
              </Box>
              
              <Controller
                name="expiryDateTime"
                control={control}
                render={({ field }) => (
                  <DateTimePicker
                    {...field}
                    label="Expiry / Safe Consumption Time"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      }
                    }}
                  />
                )}
              />
            </Box>

            {/* Logistics */}
            <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 3 }}>
              3. Logistics
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, alignItems: { sm: 'center' } }}>
                <Controller
                  name="preferredPickupTime"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.preferredPickupTime}>
                      <InputLabel>Preferred Pickup Time</InputLabel>
                      <Select {...field} label="Preferred Pickup Time">
                        {pickupTimeOptions.map((time) => (
                          <MenuItem key={time} value={time}>
                            {time}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.preferredPickupTime && (
                        <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                          {errors.preferredPickupTime.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
                
                <Controller
                  name="deliveryPossible"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Is Delivery Possible by Donor?"
                      sx={{ minWidth: 'fit-content' }}
                    />
                  )}
                />
              </Box>
              
              <Controller
                name="specialInstructions"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    label="Special Instructions (Optional)"
                    placeholder="e.g., packed in containers, needs refrigeration, etc."
                  />
                )}
              />
            </Box>

            {/* Verification & Consent */}
            <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 3 }}>
              4. Verification & Consent
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
              <Controller
                name="photoFile"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="file"
                    label="Photo Upload"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ accept: "image/*" }}
                    onChange={(e) => {
                      const files = (e.target as HTMLInputElement).files;
                      onChange(files ? files[0] : null);
                    }}
                    helperText="Upload image of packed food (helps receivers assess quality)"
                  />
                )}
              />
              
              <Box>
                <Controller
                  name="safetyConfirm"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value} />}
                      label="I confirm that the food is safe for consumption and not spoiled."
                      sx={{ 
                        color: errors.safetyConfirm ? 'error.main' : 'inherit',
                        '& .MuiFormControlLabel-label': {
                          fontSize: '0.95rem'
                        }
                      }}
                    />
                  )}
                />
                {errors.safetyConfirm && (
                  <Typography variant="caption" color="error" display="block" sx={{ ml: 4, mt: -1 }}>
                    {errors.safetyConfirm.message}
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
                      label="I agree to the terms & conditions of donation."
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

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ px: 6, py: 1.5, fontSize: '1.1rem' }}
              >
                Submit Donation
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
    </MainContainer>
  );
}
