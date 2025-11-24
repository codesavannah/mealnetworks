import { Typography, Paper, Box } from "@mui/material";
import MainContainer from "@/components/MainContainer";

export default function ContactPage() {
  return (
    <MainContainer>
      <Typography variant="h3" gutterBottom>
        Contact Us
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
        <Box sx={{ width: "100%" }}>
          <Paper sx={{ p: 2 }}>
            <Typography>CSD Department, MIT College, Beed Bypass Road, Chh. Sambhajinagar, Maharashtra - 431010</Typography>
            <Typography sx={{ mt: 1 }}>Phone:</Typography>
            <Typography>Rutuja B. Bhosle         +91 93736 75683</Typography>
            <Typography>Sanjana S. Nikam       +91 84858 34335</Typography>
            <Typography>Shweta Rathod          +91 73879 85971</Typography>
            <Typography>Amruta Sagre           +91 88568 08106</Typography>
            <Typography>Email: sajhathali@gmail.com</Typography>
          </Paper>
        </Box>
        <Box sx={{ width: "100%" }}>
          <Paper sx={{ p: 2 }}>
            <Typography>Inquiry form placeholder. Google Maps embed will appear here.</Typography>
          </Paper>
        </Box>
      </Box>
    </MainContainer>
  );
}


