// src/pages/PlacesPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Skeleton,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useSelector, useDispatch } from "react-redux";
import { toggleFavorite } from "../store/userSlice";
// import { toggleCart } from "../store/cartSlice";
import { fetchPlacesById } from "../store/selectionSlice";
import { addToCart, removeFromCart, fetchCart } from "../store/cartSlice";
import axiosInstance from "../api/axiosInstance";
// ---------------- Subcomponent ----------------
function PlaceCard({ p, isWishlisted, isInCart, dispatch, cart }) {
  const userId = useSelector((state) => state.user.id);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const continent = query.get("continent");
  const country = query.get("country");
  const state = query.get("state");
  const city = query.get("city");

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(p._id));
  };

  const handleToggleCart = () => {
    // Check if cart is empty or all items are from the same city
    if (!isInCart(p._id)) {
      if (cart.length > 0) {
        const firstCityId =
          cart[0].cityId?._id ||
          cart[0].cityId ||
          cart[0].city?._id ||
          cart[0].city;
        const currentCityId =
          p.cityId?._id || p.cityId || p.city?._id || p.city;
        if (firstCityId !== currentCityId) {
          alert(
            "You can only add places from the same city to your cart. Please remove other items before adding places from a different city."
          );
          return;
        }
      }
      dispatch(addToCart({ userId, placeId: p._id }));
    } else {
      dispatch(removeFromCart({ userId, placeId: p._id }));
    }
  };

  return (
    <Card sx={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Image with skeleton overlay */}
      <Box sx={{ position: "relative", width: "100%", height: 180 }}>
        <CardMedia
          component="img"
          image={p.image}
          alt={p.name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            transition: "opacity 0.3s ease-in-out",
            opacity: loaded ? 1 : 0,
          }}
          onLoad={() => setLoaded(true)}
        />
        {!loaded && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            sx={{ position: "absolute", top: 0, left: 0 }}
          />
        )}
      </Box>

      {/* Content */}
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={() =>
              navigate(
                `/places?continent=${encodeURIComponent(
                  continent
                )}&country=${encodeURIComponent(
                  country
                )}&state=${encodeURIComponent(
                  state
                )}&city=${encodeURIComponent(city)}&place=${encodeURIComponent(
                  p.name
                )}`
              )
            }
          >
            About {p.name}
          </Button>
          {/* Favorite Icon */}
          {userId && (
            <IconButton
              size="small"
              color={isWishlisted(p._id) ? "error" : "default"}
              onClick={handleToggleFavorite}
            >
              {isWishlisted(p._id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          )}
          {/* Cart Icon */}
          {userId && (
            <IconButton
              size="small"
              color="primary"
              onClick={handleToggleCart}
            >
              {isInCart(p._id) ? (
                <ShoppingCartIcon />
              ) : (
                <ShoppingCartOutlinedIcon />
              )}
            </IconButton>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

// ---------------- Main Page ----------------
export default function PlacesPage() {
  const query = new URLSearchParams(useLocation().search);
  const continent = query.get("continent");
  const country = query.get("country");
  const state = query.get("state");
  const city = query.get("city");
  const cityId = query.get("cityId");

  const dispatch = useDispatch();
  const { list: places, status, error } = useSelector(
    (state) => state.selection
  );
  const user = useSelector((store) => store.user); // ✅ from Redux

  const wishlist = Array.isArray(user?.favorites) ? user.favorites : [];
  const cart = useSelector((state) => state.cart.items);

  const isWishlisted = (id) =>
    wishlist.some((favId) => favId === id || favId._id === id);
  const isInCart = (id) => cart.some((p) => p._id === id || p === id);
  let userId = useSelector((store) => store.user.id);

  // Get city, state, country, continent info from places or query
  let cityName = "";
  let stateName = "";
  let countryName = "";
  let continentName = "";
  if (places?.places?.length > 0) {
    const cityObj = places.places[0].cityId || places.places[0].city;
    cityName = cityObj?.name || city;
    stateName = cityObj?.stateId?.name || state;
    countryName = cityObj?.countryId?.name || country;
    continentName = cityObj?.countryId?.continentId?.name || continent;
  } else {
    cityName = city;
    stateName = state;
    countryName = country;
    continentName = continent;
  }

  useEffect(() => {
    if (cityId) {
      dispatch(fetchPlacesById(cityId));
    }
  }, [cityId, dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [dispatch, userId]);

  if (status === "loading") return <CircularProgress />;
  if (status === "failed")
    return <Typography color="error">{error}</Typography>;

  return (
    <div style={{ padding: 24 }}>
      <Typography variant="h5" gutterBottom fontWeight={700}>
        {stateName} — Top Places to Visit in {cityName}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {continentName} / {countryName} / {stateName} / {cityName}
      </Typography>

      <Grid container spacing={3}>
        {places?.places?.map((p) => (
          <Grid item xs={12} sm={6} md={3} key={p._id}>
            <PlaceCard
              p={p}
              isWishlisted={isWishlisted}
              isInCart={isInCart}
              dispatch={dispatch}
              cart={cart}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
