import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../api/axiosInstance";
import { Box, Typography, Card } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { fetchCities } from "../store/citySlice";
import { fetchPlaces } from "../store/placeSlice";
import { useNavigate } from "react-router-dom";
import "../assets/myntraAdmin.css";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [carouselItems, setCarouselItems] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cities = useSelector((state) => state.cities.list);
  const taxonomy = useSelector((state) => state.taxonomy.data || []);
  const places = useSelector(state => state.places?.list || []);
  console.log('PLACES:', places);

  console.log("Cities in store:", cities);

  useEffect(() => {
    axiosInstance.get("/api/home")
      .then(res => setCarouselItems(res.data))
      .catch(() => setCarouselItems([]));
    dispatch(fetchCities());
    dispatch(fetchPlaces());
  }, [dispatch]);

  // Persist selected continent in localStorage
  const [selectedContinent, setSelectedContinent] = useState(() => {
    return localStorage.getItem("selectedContinent") || taxonomy[0]?._id || "";
  });

  // When continents load, set default selected and restore from localStorage
  useEffect(() => {
    if (taxonomy.length > 0 && !selectedContinent) {
      setSelectedContinent(taxonomy[0]._id);
    }
  }, [taxonomy, selectedContinent]);

  // Save selected continent to localStorage
  useEffect(() => {
    if (selectedContinent) {
      localStorage.setItem("selectedContinent", selectedContinent);
    }
  }, [selectedContinent]);

  // Filter countries by selected continent
  const filteredCountries = taxonomy.find(cont => cont._id === selectedContinent)?.countries || [];
  // Persist selected country, state, city in localStorage
  const [selectedCountryId, setSelectedCountryId] = useState(() => {
    return localStorage.getItem("selectedCountryId") || null;
  });
  const [selectedStateId, setSelectedStateId] = useState(() => {
    return localStorage.getItem("selectedStateId") || null;
  });
  const [selectedCityId, setSelectedCityId] = useState(() => {
    return localStorage.getItem("selectedCityId") || null;
  });

  // Save selected country, state, city to localStorage
  useEffect(() => {
    if (selectedCountryId) {
      localStorage.setItem("selectedCountryId", selectedCountryId);
    }
  }, [selectedCountryId]);
  useEffect(() => {
    if (selectedStateId) {
      localStorage.setItem("selectedStateId", selectedStateId);
    }
  }, [selectedStateId]);
  useEffect(() => {
    if (selectedCityId) {
      localStorage.setItem("selectedCityId", selectedCityId);
    }
  }, [selectedCityId]);

  return (
    <Box className="admin-myntra" sx={{ bgcolor: '#F5F5F5', minHeight: '100vh', p: '1em' }}>
      <Box sx={{ bgcolor: "#fff", margin: "0 auto" }}>
        {carouselItems.length > 0 ? (
          <Carousel
            autoPlay
            animation="slide"
            indicators
            navButtonsAlwaysVisible={false}
            sx={{ width: "100%", maxWidth: "100%", m: 0, p: 0 }}
            indicatorContainerProps={{
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              zIndex: 2,
              pointerEvents: 'none',
            }}
            indicatorIconButtonProps={{
              style: {
                color: '#fff',
                background: 'rgba(0,0,0,0.4)',
                margin: '0 6px',
                pointerEvents: 'auto',
              }
            }}
            activeIndicatorIconButtonProps={{
              style: {
                color: '#ff3f6c',
                background: '#fff',
                pointerEvents: 'auto',
              }
            }}
          >
            {carouselItems.map(item => (
              <Box key={item._id} sx={{ textAlign: "center", bgcolor: "#fff", m: 0, p: 0, position: 'relative' }}>
                <img src={item.imageUrl} alt={item.imageName} style={{ width: "100%", height: "768px", objectFit: "cover", boxSizing: 'border-box', border: 0, margin: 0, padding: 0, borderRadius: '5px' }} />
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', pl: '3em', pointerEvents: 'none' }}>
                  <Box>
                    <Typography variant="h3" sx={{ color: '#fff', fontWeight: 900, fontSize: '2.5rem', textShadow: '0 2px 8px rgba(0,0,0,0.5)', letterSpacing: 1, textAlign: 'left' }}>
                      Your Next Adventure Awaits
                    </Typography>
                    <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '15px', mt: 1, textShadow: '0 1px 4px rgba(0,0,0,0.04)', textAlign: 'left', fontFamily: 'Montserrat, Arial, sans-serif', letterSpacing: 1 }}>
                      We handle Planning. You just choose where to go
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Carousel>
        ) : (
          <Typography variant="h5" align="center" sx={{ mt: 8, color: "#b8860b" }}>
          </Typography>
        )}
      </Box>

  {/* Continent Tabs */}
  <Box sx={{ bgcolor: "#fff", boxShadow: 1, px: 2, mt: '1em', pt: '1em' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-start', borderRadius: 0 }}>
        {taxonomy.map(cont => (
          <Box
            key={cont._id}
            sx={{
              px: 3,
              py: 2,
              cursor: 'pointer',
              fontWeight: selectedContinent === cont._id ? 700 : 500,
              color: selectedContinent === cont._id ? '#23396c' : '#888',
              borderBottom: selectedContinent === cont._id ? '3px solid #23396c' : '3px solid transparent',
              fontSize: 18,
              transition: 'all 0.2s',
            }}
            onClick={() => {
              setSelectedContinent(cont._id);
              setSelectedCountryId(null); // Reset country selection when continent changes
            }}
          >
            {cont.name}
          </Box>
        ))}
      </Box>
      </Box>

      {/* Country Cards for selected continent */}
      <Box sx={{ mt: 4 }}>
        {filteredCountries.length === 0 ? (
          <Typography align="center" sx={{ color: '#888', mt: 4 }}>
            No countries available for this continent.
          </Typography>
        ) : (
          <>
            {/* Country row */}
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'flex-start' }}>
              {filteredCountries.map(country => (
                <Card
                  key={country._id}
                  sx={{
                    width: "25em",
                    height: "18em",
                    position: "relative",
                    boxShadow: 3,
                    overflow: "hidden",
                    border: selectedCountryId === country._id ? "3px solid royalblue" : "none",
                    borderRadius: 2,
                    cursor: "pointer",
                    transition: 'border 0.2s',
                    backgroundImage: country.imageUrl ? `url(${country.imageUrl})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  onClick={() => setSelectedCountryId(country._id)}
                >
                  <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: country.imageUrl ? 'transparent' : '#e3eafc' }}>
                    <Typography variant="h6" sx={{
                      fontWeight: 700,
                      color: 'white',
                      textAlign: 'center',
                      textShadow: '0 2px 8px #fff',
                      backgroundColor: '#230bd970',
                      padding: '0 10px',
                      fontSize: '25px',
                      borderRadius: '6px',
                      display: 'inline-block',
                    }}>{country.name}</Typography>
                    <Box sx={{ position: 'absolute', bottom: 5, left: 0, width: '100%', display: 'flex', justifyContent: 'center' }}>
                      <Link
  to={`/states?continent=${encodeURIComponent(
    taxonomy.find((cont) => cont._id === selectedContinent)?.name || ""
  )}&country=${encodeURIComponent(country.name)}&countryId=${country._id}`}
  style={{
    textDecoration: "none",
    background: "#23396c",
    color: "#fff",
    borderRadius: "4px",
    padding: "6px 16px",
    fontWeight: 600,
    fontSize: "15px",
    display: "inline-block",
  }}
  onClick={(e) => e.stopPropagation()}
>
  View All States
</Link>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>
            {/* States row for selected country */}
            {selectedCountryId && (() => {
              const selectedCountry = filteredCountries.find(c => c._id === selectedCountryId);
              if (!selectedCountry) return null;
              let sections = [];
              // Country name heading
              sections.push(
                <Box sx={{ mt: 3, ml: 1 }} key="selected-country-heading">
                  <Typography variant="h5" sx={{ fontWeight: 900,fontSize:'30px', color: '#5d5415;', mb: 2, letterSpacing: 1 }}>
                    Explore Most Visited Places in {selectedCountry.name}
                  </Typography>
                </Box>
              );
              // States section
              if (!selectedCountry.states || selectedCountry.states.length === 0) {
                sections.push(
                  <Box sx={{ mt: 3, ml: 1 }} key="coming-soon">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#888', mb: 2 }}>
                      Coming Soon
                    </Typography>
                  </Box>
                );
              } else {
                sections.push(
                  <Box sx={{ mt: 3, ml: 1 }} key="states">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#5d5415;', marginBottom: '5px' }}>
                      Most Visited States
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 1 }}>
                      {selectedCountry.states.map(state => (
                        <Card 
                          key={state._id} 
                          sx={{ width: '22em', height: '16em', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: 2, bgcolor: state.imageUrl ? 'rgba(227,234,252,0.7)' : '#e3eafc', borderRadius: 2, p: 1, cursor: 'pointer', backgroundImage: state.imageUrl ? `url(${state.imageUrl})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
                          onClick={() => {
                            setSelectedStateId(state._id);
                            const continentName = taxonomy.find(cont => cont._id === selectedContinent)?.name || '';
                            const countryName = selectedCountry.name || '';
                            const stateName = state.name || '';
                            // Filter cities for this state
                            const stateCities = cities.filter(city => {
                              if (!city.stateId) return false;
                              if (typeof city.stateId === 'object') {
                                return city.stateId._id === state._id;
                              }
                              return city.stateId === state._id;
                            });
                            navigate(`/city?continent=${encodeURIComponent(continentName)}&country=${encodeURIComponent(countryName)}&state=${encodeURIComponent(stateName)}&cities=${encodeURIComponent(JSON.stringify(stateCities))}`);
                          }}
                        >
                          <Typography sx={{
                            fontWeight: 700,
                            color: 'white',
                            textAlign: 'center',
                            textShadow: '0 2px 8px #fff',
                            backgroundColor: '#230bd970',
                            padding: '0 10px',
                            fontSize: '25px',
                            borderRadius: '6px',
                            display: 'inline-block',
                          }}>{state.name}</Typography>
                        </Card>
                      ))}
                    </Box>
                  </Box>
                );
              }
              // Top 10 cities in selected country
              const countryCities = cities.filter(city => city?.countryId?._id === selectedCountry._id);
              const top10Cities = countryCities.slice(0, 10);
              if (top10Cities.length > 0) {
                sections.push(
                  <Box sx={{ mt: 3, ml: 1 }} key="top-10-cities">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#5d5415;', marginBottom: '5px' }}>
                      Most Visited Cities
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 1 }}>
                      {top10Cities.map(city => (
                        <Card 
                          key={city._id} 
                          sx={{ width: '16em', height: '10em', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: 2, bgcolor: city.cityImage ? 'rgba(255,255,255,0.7)' : '#fff', borderRadius: 2, p: 1, cursor: 'pointer', backgroundImage: city.cityImage ? `url(${city.cityImage})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
                          onClick={() => {
                            setSelectedCityId(city._id);
                            const stateName = city.stateId?.name || '';
                            const countryName = city.countryId?.name || '';
                            const continentName = city.countryId?.continentId?.name || '';
                            navigate(`/places?cityId=${city._id}&cityName=${encodeURIComponent(city.name)}&state=${encodeURIComponent(stateName)}&country=${encodeURIComponent(countryName)}&continent=${encodeURIComponent(continentName)}`);
                          }}
                        >
                          <Typography sx={{
                            fontWeight: 700,
                            color: 'white',
                            textAlign: 'center',
                            textShadow: '0 2px 8px #fff',
                            backgroundColor: '#230bd970',
                            padding: '0 10px',
                            fontSize: '25px',
                            borderRadius: '6px',
                            display: 'inline-block',
                          }}>{city.name}</Typography>
                        </Card>
                      ))}
                    </Box>
                  </Box>
                );
              }
              // Category sections: for each category in places, display unique city names
              const countryPlaces = places.filter(place => {
                // Support both _id and direct id for countryId
                if (!place.countryId) return false;
                if (typeof place.countryId === 'object') {
                  return place.countryId._id === selectedCountry._id;
                }
                return place.countryId === selectedCountry._id;
              });
              console.log('COUNTRY PLACES:', countryPlaces);
              const uniqueCategories = [...new Set(countryPlaces.map(place => place.type))].filter(Boolean).slice(0, 5);
              console.log('UNIQUE CATEGORIES:', uniqueCategories);
              uniqueCategories.forEach(category => {
                // Get all places in this category for the selected country
                const categoryPlaces = countryPlaces.filter(place => place?.type === category);
                // Get unique city IDs from these places
                const cityIdSet = new Set(categoryPlaces.map(place => {
                  if (!place.cityId) return null;
                  if (typeof place.cityId === 'object') return place.cityId._id;
                  return place.cityId;
                }).filter(Boolean));
                // Get city objects for these IDs
                const categoryCities = countryCities.filter(city => cityIdSet.has(city._id));
                if (categoryCities.length > 0) {
                  sections.push(
                    <Box sx={{ mt: 3, ml: 1 }} key={category}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#5d5415', marginBottom: '5px' }}>
                       Explore {category.charAt(0).toUpperCase() + category.slice(1)} 
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 1 }}>
                        {categoryCities.map(city => (
                          <Card 
                            key={city._id} 
                            sx={{ width: '16em', height: '10em', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: 2, bgcolor: city.cityImage ? 'rgba(255,255,255,0.7)' : '#fff', borderRadius: 2, p: 1, cursor: 'pointer', backgroundImage: city.cityImage ? `url(${city.cityImage})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
                            onClick={() => {
                              const stateName = city.stateId?.name || '';
                              const countryName = city.countryId?.name || '';
                              const continentName = city.countryId?.continentId?.name || '';
                              navigate(`/places?cityId=${city._id}&cityName=${encodeURIComponent(city.name)}&state=${encodeURIComponent(stateName)}&country=${encodeURIComponent(countryName)}&continent=${encodeURIComponent(continentName)}`);
                            }}
                          >
                            <Typography sx={{
                              fontWeight: 700,
                              color: 'white',
                              textAlign: 'center',
                              textShadow: '0 2px 8px #fff',
                              backgroundColor: '#230bd970',
                              padding: '0 10px',
                              fontSize: '25px',
                              borderRadius: '6px',
                              display: 'inline-block',
                            }}>{city.name}</Typography>
                          </Card>
                        ))}
                      </Box>
                    </Box>
                  );
                }
              });
              return <>{sections}</>;
            })()}
          </>
        )}
      </Box>
    </Box>
  );
}
