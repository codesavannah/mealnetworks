"use client";
import { Typography, Box, Button } from "@mui/material";
import { useState } from "react";
import MainContainer from "@/components/MainContainer";
import RegistrationModal from "@/components/RegistrationModal";

export default function RegisterNGOPage() {
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);

  return (
    <MainContainer>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 4,
          textAlign: 'center'
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: 700, color: 'primary.main' }}>
          Register Your NGO / Ashram
        </Typography>
        
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px' }}>
          Join our network of food receivers. Register your organization to receive food donations and help feed those in need.
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => setRegistrationModalOpen(true)}
          sx={{ 
            px: 5, 
            py: 2,
            fontSize: '1.2rem',
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: 3,
            '&:hover': {
              boxShadow: 6
            }
          }}
        >
          Apply for Receiver
        </Button>
      </Box>

      {/* Registration Modal */}
      <RegistrationModal 
        open={registrationModalOpen}
        onClose={() => setRegistrationModalOpen(false)}
        onBackToLogin={() => setRegistrationModalOpen(false)}
      />
    </MainContainer>
  );
}
