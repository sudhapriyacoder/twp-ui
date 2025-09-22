import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Drawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  useMediaQuery,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchTaxonomy } from "../store/taxonomySlice";
import { jwtDecode } from "jwt-decode";
import {logoutUser} from "../store/userSlice";

export default function Header() {
  const isMobile = useMediaQuery("(max-width:900px)");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hoverContinent, setHoverContinent] = useState(null);
  const dispatch = useDispatch();

  // const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  // const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux taxonomy: continents → countries → states → cities
  const { data: taxonomy } = useSelector((state) => state.taxonomy);
  const user = useSelector(state => state.user);
  const {id: userId} = user;
  const cartItems = useSelector(state => state.cart.items);
  const favorites = useSelector(state => state.user.favorites || []);

  useEffect(() => {
    dispatch(fetchTaxonomy());

    // ✅ Check if user is logged in
    // const token = localStorage.getItem("token");
    // if (token) {
    //   try {
    //     const decoded = jwtDecode(token);
    //     setUser(decoded);
    //   } catch (err) {
    //     console.error("Invalid token:", err);
    //     localStorage.removeItem("token");
    //   }
    // }
  }, [dispatch]);

  const handleStateClick = (continent, country, stateObj) => {
    navigate(
      `/city?continent=${encodeURIComponent(
        continent
      )}&country=${encodeURIComponent(
        country
      )}&state=${encodeURIComponent(stateObj.name)}&cities=${encodeURIComponent(
        JSON.stringify(stateObj.cities || [])
      )}`
    );
  };

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: "#23396c", color: "#fff" }}>
        <Toolbar sx={{ gap: 2 }}>
         
          {/* Logo */}
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <img
              src={Logo}
              alt="Logo"
              style={{ width: '120px',  height: '40px', marginRight: 8 }}
            />
          </Box>
          {/* Right-side buttons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, flex: 1, justifyContent: 'flex-end' }}>
             {/* Home Icon */}
          <IconButton onClick={() => navigate("/dashboard")} sx={{ color: '#fff' }}>
            <HomeIcon fontSize="large" />
          </IconButton>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate("/admin")}
              sx={{ color: '#fff', borderColor: '#fff' }}
            >
              Admin
            </Button>
            {!userId ? (
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate("/sign")}
                sx={{ color: '#fff', borderColor: '#fff' }}
              >
                Login
              </Button>
            ) : (
              <>
                <IconButton title="Profile" onClick={() => setAnchorEl(true)}>
                  <AccountCircleIcon sx={{ color: '#fff' }} />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem disabled>{user?.name}</MenuItem>
                  <MenuItem onClick={() => dispatch(logoutUser())}>Logout</MenuItem>
                </Menu>
                <IconButton
                  title="Cart"
                  onClick={() => navigate("/bookings")}
                  color="inherit"
                  sx={{ position: 'relative' }}
                >
                  <ShoppingBagIcon />
                  {cartItems.length > 0 && (
                    <Box sx={{ position: 'absolute', top: -4, right: -4, bgcolor: '#ff3f6c', color: '#fff', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, border: '2px solid #fff' }}>
                      {cartItems.length}
                    </Box>
                  )}
                </IconButton>
                <IconButton color="inherit" onClick={() => navigate('/wishlist')} sx={{ position: 'relative' }}>
                  {favorites.length > 0 ? <FavoriteIcon sx={{ color: '#212121' }} /> : <FavoriteBorderIcon />}
                  {favorites.length > 0 && (
                    <Box sx={{ position: 'absolute', top: -4, right: -4, bgcolor: '#ff3f6c', color: '#fff', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, border: '2px solid #fff' }}>
                      {favorites.length}
                    </Box>
                  )}
                </IconButton>
              </>
            )}
          </Box>
          {/* Mobile: Hamburger */}
          {isMobile && (
            <IconButton
              sx={{ ml: "auto" }}
              onClick={() => setDrawerOpen(true)}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      {/* Mobile Drawer: Only search and close button */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 320, p: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search"
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Drawer>
    </>
  );
  }
