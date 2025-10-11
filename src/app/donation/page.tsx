"use client";
import { Typography, Box, Button } from "@mui/material";
import { useState } from "react";
import MainContainer from "@/components/MainContainer";
import DonorRegistrationModal from "@/components/DonorRegistrationModal";
import LoginModal from "@/components/LoginModal";

export default function DonationPage() {
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

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
          Donate Food
        </Typography>
        
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px' }}>
          Help us fight hunger by donating surplus food. Register as a donor to start making a difference today.
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
          Apply for Donor
        </Button>
      </Box>

      {/* Donor Registration Modal */}
      <DonorRegistrationModal 
        open={registrationModalOpen}
        onClose={() => setRegistrationModalOpen(false)}
        onBackToLogin={() => {
          setRegistrationModalOpen(false);
          setLoginModalOpen(true);
        }}
      />

      {/* Login Modal */}
      <LoginModal 
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onRegisterClick={() => {
          setLoginModalOpen(false);
          setRegistrationModalOpen(true);
        }}
      />
    </MainContainer>
  );
}
