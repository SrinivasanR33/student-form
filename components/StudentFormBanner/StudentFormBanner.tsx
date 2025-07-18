import { Box, Typography } from "@mui/material";

export default function StudentFormBanner() {
  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" }, // hide on small screens
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f5f5f5",
        padding: 4,
      }}
    >
      <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
        Welcome to Student Portal
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: 300, textAlign: "center" }}>
        Manage your profile, check your progress, and stay updated with the latest student features.
      </Typography>
    </Box>
  );
}
