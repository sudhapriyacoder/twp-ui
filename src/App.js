import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import PlacesPage from "./pages/PlacesPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import PlaceDetail from "./pages/PlaceDetail";
import Admin from "./pages/AdminPage";
import CityPage from "./pages/CityPage";
import { useLocation, Navigate  } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import AuthUI from "./pages/Sign";
import { GoogleLogin } from "@react-oauth/google";
import Dashboard from "./pages/Dashboard";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import axiosInstance from "./api/axiosInstance";
import { useDispatch } from "react-redux";
import { setUser } from "./store/userSlice";

function Home() {
  return (
    <div style={{ padding: 16 }}>
      <h2>Welcome to GhumneChalo</h2>
      <p>Select a continent → country → state from the header to see places.</p>
    </div>
  );
}

function PlacesRouter() {
  const query = new URLSearchParams(useLocation().search);
  const city = query.get("city");
  const place = query.get("place");

  return <PlacesPage />;
}



function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        dispatch(setUser({ id: decoded.id, email: decoded.email }));
        // Fetch latest wishlist and cart
        axiosInstance.get("/api/user/favorites", {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
          dispatch({ type: "user/updateFavorites", payload: res.data || [] });
        });
        axiosInstance.get(`/api/user/${decoded.id}/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
          dispatch({ type: "user/updateCart", payload: res.data || [] });
        });
      } catch (err) {
        localStorage.removeItem("token");
      }
    }
  }, [dispatch]);


  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sign" element={<AuthUI />} />
        <Route path="/city" element={<CityPage />} />
        <Route path="/places" element={<PlacesRouter />} />
        <Route path="/bookings" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
