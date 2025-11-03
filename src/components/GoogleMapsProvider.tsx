"use client";
import { useJsApiLoader } from '@react-google-maps/api';
import { ReactNode } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

const libraries: ("places" | "geometry")[] = ["places", "geometry"];

interface GoogleMapsProviderProps {
  children: ReactNode;
}

export default function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  if (loadError) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">Error loading Google Maps. Please check your API key configuration.</Typography>
      </Box>
    );
  }

  if (!isLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}

