import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Skeleton,
  Box
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { PLACES, DATA } from "../data/places";
import { useSelector, useDispatch } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../store/wishlistSlice";
import {
  addToCart,
  removeFromCart,
} from "../store/cartSlice";


// ---------------- Subcomponent ----------------
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";






// ---------------- Main Page ----------------
export default function PlacesPage() {
 const query = new URLSearchParams(useLocation().search);
const continent = query.get("continent");
const country = query.get("country");
const state = query.get("state");
const city = query.get("city");
const place = query.get("place");

// 👇 get all places inside that city
const places = DATA?.[continent]?.[country]?.[state]?.cities?.[city]?.places || [];

  const wishlist = useSelector((state) => state.wishlist.items);
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const isWishlisted = (id) => wishlist.some((p) => p.id === id);
  const isInCart = (id) => cart.some((p) => p.id === id);

  return (
    <div style={{ padding: 24 }}>
      <Typography variant="h5" gutterBottom fontWeight={700}>
       About Hawa Mahal
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
         {continent} / {country} / {state} / {city} / {place}
      </Typography>

      <Grid container>
        
      </Grid>
    </div>
  );
}
