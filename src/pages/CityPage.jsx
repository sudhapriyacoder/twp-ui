import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Typography, Card } from "@mui/material";

export default function CityPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const continent = query.get("continent") || "";
  const country = query.get("country") || "";
  const state = query.get("state") || "";
  const stateId = query.get("stateId") || "";

  // Get cities from taxonomy data in Redux
  const taxonomy = useSelector(state => state.taxonomy.data || []);
  const continentObj = taxonomy.find(cont => cont.name === continent);
  const countryObj = continentObj?.countries?.find(c => c.name === country);
  const stateObj = countryObj?.states?.find(s => s._id === stateId || s.name === state);
  const cities = stateObj?.cities || [];

  return (
    <Box sx={{ bgcolor: "#F5F5F5", minHeight: "100vh", p: "2em" }}>
      {/* Breadcrumbs */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography
          variant="subtitle2"
          sx={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => navigate('/dashboard')}
        >
          {continent}
        </Typography>
        <Typography sx={{ color: '#888' }}>&gt;</Typography>
        <Typography
          variant="subtitle2"
          sx={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => navigate(`/states?continent=${encodeURIComponent(continent)}&country=${encodeURIComponent(country)}`)}
        >
          {country}
        </Typography>
        <Typography sx={{ color: '#888' }}>&gt;</Typography>
        <Typography
          variant="subtitle2"
          sx={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => navigate(`/city?continent=${encodeURIComponent(continent)}&country=${encodeURIComponent(country)}&state=${encodeURIComponent(state)}&stateId=${stateId}`)}
        >
          {state}
        </Typography>
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 900, color: "#23396c", mb: 3 }}>
        Cities in {state}
      </Typography>
      {cities.length === 0 ? (
        <Typography sx={{ color: "#888", mt: 4 }}>No cities found for this state.</Typography>
      ) : (
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "flex-start" }}>
          {cities.map((city) => (
            <Card
              key={city._id}
              sx={{
                width: '18em',
                height: '12em',
                boxShadow: 3,
                borderRadius: 2,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: city.cityImage ? 'rgba(227,234,252,0.7)' : '#e3eafc',
                p: 2,
                transition: "border 0.2s",
                backgroundImage: city.cityImage ? `url(${city.cityImage})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              onClick={() => {
                navigate(
                  `/places?cityId=${city._id}&cityName=${encodeURIComponent(city.name)}&state=${encodeURIComponent(state)}&country=${encodeURIComponent(country)}&continent=${encodeURIComponent(continent)}`
                );
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#23396c", textAlign: "center", textShadow: city.imageUrl ? '0 2px 8px #fff' : undefined }}>
                <span style={{
                  fontWeight: 700,
                  color: 'white',
                  textAlign: 'center',
                  textShadow: '0 2px 8px #fff',
                  backgroundColor: '#230bd970',
                  padding: '0 10px',
                  fontSize: '25px',
                  borderRadius: '6px',
                  display: 'inline-block',
                }}>{city.name}</span>
              </Typography>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
