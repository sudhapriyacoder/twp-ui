import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Typography, Card } from "@mui/material";

export default function StatePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const continent = searchParams.get("continent") || "";
  const country = searchParams.get("country") || "";
  const countryId = searchParams.get("countryId") || "";

  // Get taxonomy data from Redux
  const taxonomy = useSelector(state => state.taxonomy.data || []);

  // Find the continent and country objects
  const continentObj = taxonomy.find(cont => cont.name === continent);
  const countryObj = continentObj?.countries?.find(c => c._id === countryId || c.name === country);
  const states = countryObj?.states || [];

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
          onClick={() => navigate(`/states?continent=${encodeURIComponent(continent)}&country=${encodeURIComponent(country)}&countryId=${countryId}`)}
        >
          {country}
        </Typography>
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 900, color: "#23396c", mb: 3 }}>
        States in {country}
      </Typography>
      {states.length === 0 ? (
        <Typography sx={{ color: "#888", mt: 4 }}>No states found for this country.</Typography>
      ) : (
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "flex-start" }}>
          {states.map((state) => (
            <Card
              key={state._id}
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
                bgcolor: state.imageUrl ? 'rgba(227,234,252,0.7)' : '#e3eafc',
                p: 2,
                transition: "border 0.2s",
                backgroundImage: state.imageUrl ? `url(${state.imageUrl})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              onClick={() => {
                navigate(
                  `/city?continent=${encodeURIComponent(continent)}&country=${encodeURIComponent(country)}&state=${encodeURIComponent(state.name)}&stateId=${state._id}`
                );
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#23396c", textAlign: "center", textShadow: state.imageUrl ? '0 2px 8px #fff' : undefined }}>
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
                }}>{state.name}</span>
              </Typography>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
