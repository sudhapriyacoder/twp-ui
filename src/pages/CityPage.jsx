// src/pages/CityPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Breadcrumbs, Link, Grid, Card, CardContent } from "@mui/material";

export default function CityPage() {
  const query = new URLSearchParams(useLocation().search);
  const continent = query.get("continent");
  const country = query.get("country");
  const state = query.get("state");
  const cities = JSON.parse(query.get("cities") || "[]"); // pass cities as param from navigation
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      {/* <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" onClick={() => navigate("/")}>
          {continent}
        </Link>
        <Link underline="hover" color="inherit" onClick={() => navigate(`/places?continent=${continent}&country=${country}`)}>
          {country}
        </Link>
        <Typography color="text.primary">{state}</Typography>
      </Breadcrumbs> */}

      <Typography variant="h5" fontWeight={600} gutterBottom>
        Cities in {state}
      </Typography>

      {/* Cards grid */}
      <Grid container spacing={2}>
        {cities.map((city) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={city._id}>
            <Card
            onClick={() =>
    navigate(
      `/places?continent=${continent}&country=${country}&state=${state}&city=${city.name}&cityId=${city._id}`
    )
  }
              sx={{
                cursor: "pointer",
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                "&:hover": { boxShadow: "0 6px 18px rgba(0,0,0,0.2)" }
              }}
            >
              <CardContent>
                <Typography variant="h6" align="center">
                  {city.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

    </Box>
  );
}
