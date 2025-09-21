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
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import axiosInstance from "./api/axiosInstance";

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
  // const [user, setUser] = useState(null);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     try {
  //       setUser(jwtDecode(token));
  //     } catch (err) {
  //       console.error("Invalid token:", err);
  //       localStorage.removeItem("token");
  //     }
  //   }
  // }, []);


  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/dashboard" element={<Home />} />
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
