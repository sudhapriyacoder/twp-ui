import React from "react";
import { Box, Typography, Grid, Paper, Button } from "@mui/material";
import { Flight, LocationOn, Favorite, Explore, Star } from "@mui/icons-material";
import "../assets/myntraAdmin.css";

export default function Dashboard() {
  return (
    <Box className="admin-myntra" sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom align="center" style={{ fontWeight: 800 }}>
        🌏 GhumneChalo Travel Dashboard
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        Welcome! Explore, manage, and discover amazing places, countries, and continents.
      </Typography>
      <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
        <Grid item xs={12} md={3}>
          <Paper elevation={4} className="admin-myntra" sx={{ p: 3, textAlign: "center" }}>
            <Flight sx={{ fontSize: 48, color: "#ff3f6c" }} />
            <Typography variant="h6" sx={{ mt: 2 }}>Total Countries</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#ff3f6c" }}>--</Typography>
            <Button variant="outlined" color="primary" sx={{ mt: 2 }} href="/admin/countries">Manage Countries</Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={4} className="admin-myntra" sx={{ p: 3, textAlign: "center" }}>
            <LocationOn sx={{ fontSize: 48, color: "#ee9ca7" }} />
            <Typography variant="h6" sx={{ mt: 2 }}>Total States</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#ee9ca7" }}>--</Typography>
            <Button variant="outlined" color="primary" sx={{ mt: 2 }} href="/admin/states">Manage States</Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={4} className="admin-myntra" sx={{ p: 3, textAlign: "center" }}>
            <Explore sx={{ fontSize: 48, color: "#ff3f6c" }} />
            <Typography variant="h6" sx={{ mt: 2 }}>Total Places</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#ff3f6c" }}>--</Typography>
            <Button variant="outlined" color="primary" sx={{ mt: 2 }} href="/admin/places">Manage Places</Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={4} className="admin-myntra" sx={{ p: 3, textAlign: "center" }}>
            <Star sx={{ fontSize: 48, color: "#ee9ca7" }} />
            <Typography variant="h6" sx={{ mt: 2 }}>Total Continents</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#ee9ca7" }}>--</Typography>
            <Button variant="outlined" color="primary" sx={{ mt: 2 }} href="/admin/continents">Manage Continents</Button>
          </Paper>
        </Grid>
      </Grid>
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#ff3f6c" }}>
          ✈️ Plan your next adventure with GhumneChalo!
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Use the admin panel to add, edit, and explore travel destinations, manage your wishlist, and discover new routes.
        </Typography>
      </Box>
    </Box>
  );
}
