import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "../api/axiosInstance";
import { Box, Typography, Card, CardContent } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { fetchCities } from "../store/citySlice";
import { fetchContinents } from "../store/continentSlice";
import { fetchCountries } from "../store/countrySlice";
import { useNavigate } from "react-router-dom";
import "../assets/myntraAdmin.css";

export default function Dashboard() {
  const [carouselItems, setCarouselItems] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cities = useSelector((state) => state.cities.list);
  const continents = useSelector((state) => state.continents.list);
  const countries = useSelector((state) => state.countries.list);

  console.log("Cities in store:", cities);
  console.log("Continents in store:", continents);
  console.log("Countries in store:", countries);

  useEffect(() => {
    axios.get("/api/home")
      .then(res => setCarouselItems(res.data))
      .catch(() => setCarouselItems([]));
    dispatch(fetchCities());
    dispatch(fetchContinents());
    dispatch(fetchCountries());
  }, [dispatch]);

  return (
    <Box className="admin-myntra" sx={{ p: 4, bgcolor: '#f7c873', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom align="center" style={{ fontWeight: 800, color: "#23396c" }}>
        Welcome to GhumneChalo
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom style={{ fontWeight: 800, color: "#fff" }}>
        Welcome! Explore, manage, and discover amazing places, countries, and continents.
      </Typography>
      <Box sx={{  mt: 2, bgcolor: "#fff", margin: "0 auto" }}>
        {carouselItems.length > 0 ? (
          <Carousel
            autoPlay
            animation="slide"
            indicators
            navButtonsAlwaysVisible={false}
            sx={{ width: "100%", maxWidth: "100%" }}
          >
            {carouselItems.map(item => (
              <Box key={item._id} sx={{ textAlign: "center", bgcolor: "#fff"}}>
                <img src={item.imageUrl} alt={item.imageName} style={{ width: "100%", height: "568px", objectFit: "cover", borderRadius: 8, boxSizing: 'border-box', border: 0 }} />
                {/* <Typography variant="h6" sx={{ mt: 1 }}>{item.imageName}</Typography> */}
              </Box>
            ))}
          </Carousel>
        ) : (
          <Typography variant="h5" align="center" sx={{ mt: 8, color: "#b8860b" }}>
          
          </Typography>
        )}
      </Box>
      {/* Country-based city cards below carousel */}
      {countries.map(country => {
        // Get up to 10 cities for this country, sorted by trendingSequence
        const countryCities = cities
          .filter(city => city.countryId?._id === country._id)
          .sort((a, b) => (a.trendingSequence ?? 0) - (b.trendingSequence ?? 0))
          .slice(0, 10);
        if (countryCities.length === 0) return null;
        return (
          <Box key={country._id} sx={{ mt: 6 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "royalblue", mb: 2 }}>
              {country.name}
            </Typography>
            <Box sx={{ display: "flex", gap: 3, overflowX: "auto", pb: 2 }}>
              {countryCities.map(city => (
                <Card key={city._id} sx={{ minWidth: 220, maxWidth: 220, height: 180, position: "relative", boxShadow: 3, overflow: "hidden", border: "4px dashed #FFD700", borderRadius: 0, cursor: "pointer" }}
                  onClick={() => navigate(`/places?continent=${encodeURIComponent(country.continentId?.name || '')}&country=${encodeURIComponent(country.name)}&state=${encodeURIComponent(city.stateId?.name || '')}&city=${encodeURIComponent(city.name)}&cityId=${city._id}`)}>
                  <img src={city.cityImage} alt={city.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <CardContent sx={{ position: "absolute", bottom: 0, left: 0, width: "100%", bgcolor: "rgba(0,0,0,0.5)", color: "#fff", p: 0.5, pb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, textAlign: "center", mb: 0.5 }}>{city.name}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
