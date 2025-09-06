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
import { updateFavorites } from "../store/userSlice"; // new action in userSlice
// import { toggleCart } from "../store/cartSlice";
import { fetchPlacesById } from "../store/selectionSlice";
import { addToCart, removeFromCart, fetchCart } from "../store/cartSlice";
import axiosInstance from "../api/axiosInstance";
// ---------------- Subcomponent ----------------
function PlaceCard({ p, isWishlisted, isInCart, dispatch }) {
const userId = useSelector(state => state.user.id);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const continent = query.get("continent");
  const country = query.get("country");
  const state = query.get("state");
  const city = query.get("city");


const handleToggleFavorite = async (placeId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axiosInstance.post(
      `/api/user/favorites`,  // ✅ use backend URL
      { placeId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("Updated favorites:", res.data);
    // optionally update redux/user state here
  } catch (err) {
    console.error("Error updating favorites", err);
  }
};

const handleToggleCart = () => {
    if (isInCart(p._id)) {
      dispatch(removeFromCart({ userId, placeId: p._id }));
    } else {
      dispatch(addToCart({ userId, placeId: p._id }));
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

      {/* Wishlist Icon */}
      <IconButton
        sx={{ position: "absolute", top: 8, right: 8, bgcolor: "white" }}
        size="small"
        onClick={() => handleToggleFavorite(p._id)}
      >
        {isWishlisted(p._id) ? (
          <FavoriteIcon color="error" />
        ) : (
          <FavoriteBorderIcon />
        )}
      </IconButton>

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

          {/* Cart Icon */}
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

  const wishlist = user?.favorites || [];
  const cart = useSelector((state) => state.cart.items);

  const isWishlisted = (id) => wishlist.some((favId) => favId === id || favId._id === id);
  const isInCart = (id) => cart.some((p) => p._id === id || p === id);
    let userId = useSelector(store => store.user.id);

  useEffect(() => {
    if (cityId) {
      dispatch(fetchPlacesById(cityId));
    }
  }, [cityId, dispatch]);

   useEffect(() => {
    if (userId ) {
       dispatch(fetchCart(userId)); 
    }
  }, [dispatch, userId]);

  if (status === "loading") return <CircularProgress />;
  if (status === "failed")
    return <Typography color="error">{error}</Typography>;

  return (
    <div style={{ padding: 24 }}>
      <Typography variant="h5" gutterBottom fontWeight={700}>
        {state} — Top Places to Visit in {city}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {continent} / {country} / {state} / {city}
      </Typography>

      <Grid container spacing={3}>
        {places?.places?.map((p) => (
          <Grid item xs={12} sm={6} md={3} key={p._id}>
            <PlaceCard
              p={p}
              isWishlisted={isWishlisted}
              isInCart={isInCart}
              dispatch={dispatch}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
