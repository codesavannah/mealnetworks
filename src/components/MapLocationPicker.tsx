"use client";
import { useState, useCallback, useRef } from 'react';
import { GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';

interface MapLocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialLat?: number;
  initialLng?: number;
  disabled?: boolean;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px',
};

const defaultCenter = {
  lat: 28.6139, // Delhi, India as default
  lng: 77.2090,
};

export default function MapLocationPicker({
  onLocationSelect,
  initialLat,
  initialLng,
  disabled = false,
}: MapLocationPickerProps) {
  const [selectedPosition, setSelectedPosition] = useState<google.maps.LatLngLiteral | null>(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
  );
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : defaultCenter
  );
  const [address, setAddress] = useState('');
  
  const mapRef = useRef<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (disabled || !e.latLng) return;
      
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      
      setSelectedPosition({ lat, lng });
      
      // Reverse geocode to get address
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          const formattedAddress = results[0].formatted_address;
          setAddress(formattedAddress);
          onLocationSelect(lat, lng, formattedAddress);
        } else {
          onLocationSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }
      });
    },
    [disabled, onLocationSelect]
  );

  const onAutocompleteLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  }, []);

  const onPlaceChanged = useCallback(() => {
    if (!autocompleteRef.current || disabled) return;
    
    const place = autocompleteRef.current.getPlace();
    
    if (place.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const formattedAddress = place.formatted_address || '';
      
      setSelectedPosition({ lat, lng });
      setMapCenter({ lat, lng });
      setAddress(formattedAddress);
      onLocationSelect(lat, lng, formattedAddress);
    }
  }, [disabled, onLocationSelect]);

  const handleUseCurrentLocation = useCallback(() => {
    if (disabled) return;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          setSelectedPosition({ lat, lng });
          setMapCenter({ lat, lng });
          
          // Reverse geocode
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results?.[0]) {
              const formattedAddress = results[0].formatted_address;
              setAddress(formattedAddress);
              onLocationSelect(lat, lng, formattedAddress);
            }
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please select manually on the map.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }, [disabled, onLocationSelect]);

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
        <Autocomplete
          onLoad={onAutocompleteLoad}
          onPlaceChanged={onPlaceChanged}
        >
          <TextField
            fullWidth
            label="Search Location"
            placeholder="Enter an address or place"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={disabled}
          />
        </Autocomplete>
        
        <Button
          variant="outlined"
          onClick={handleUseCurrentLocation}
          disabled={disabled}
          startIcon={<MyLocationIcon />}
          sx={{ whiteSpace: 'nowrap', minWidth: '140px' }}
        >
          Current
        </Button>
      </Box>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={13}
        onClick={onMapClick}
        onLoad={onMapLoad}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        {selectedPosition && <Marker position={selectedPosition} />}
      </GoogleMap>

      {selectedPosition && (
        <Paper elevation={1} sx={{ mt: 2, p: 2, bgcolor: 'success.light' }}>
          <Typography variant="body2" color="success.dark">
            ✓ Location selected: {selectedPosition.lat.toFixed(6)}, {selectedPosition.lng.toFixed(6)}
          </Typography>
          {address && (
            <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
              {address}
            </Typography>
          )}
        </Paper>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        Click on the map to select your pickup location or search for an address above.
      </Typography>
    </Box>
  );
}






