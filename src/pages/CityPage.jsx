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
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, pb: 2 }}>
        {cities.map((city) => (
          <Card
            key={city._id}
            onClick={() =>
              navigate(
                `/places?continent=${continent}&country=${country}&state=${state}&city=${city.name}&cityId=${city._id}`
              )
            }
            sx={{
              cursor: "pointer",
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              "&:hover": { boxShadow: "0 6px 18px rgba(0,0,0,0.2)" },
              width: { xs: "100%", sm: "48%", md: "30%", lg: "22%" },
              position: "relative",
            }}
          >
            <img
              src={city.cityImage}
              alt={city.name}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                borderTopLeftRadius: "inherit",
                borderTopRightRadius: "inherit",
              }}
            />
            <CardContent
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                color: "#fff",
                p: 0.5,
                pb: 1,
                bgcolor: "rgba(0, 0, 0, 0.7)",
                borderBottomLeftRadius: "inherit",
                borderBottomRightRadius: "inherit",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, textAlign: "center", mb: 0.5 }}
              >
                {city.name}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
