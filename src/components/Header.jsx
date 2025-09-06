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
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import MenuIcon from "@mui/icons-material/Menu";
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

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logoutUser());
    handleCloseMenu();
    navigate("/sign");
  };

  return (
    <>
      {/* AppBar */}
      <AppBar position="sticky" sx={{ bgcolor: "#fff", color: "text.primary" }}>
        <Toolbar sx={{ gap: 2 }}>
          {/* Logo */}
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <img
              src={Logo}
              alt="Logo"
              style={{ width: 60, height: 60, marginRight: 8 }}
            />
          </Box>

          {/* Desktop: Continents + Search */}
          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                flex: 1,
              }}
            >
              {/* Continent Tabs */}
              <Box sx={{ display: "flex", gap: 3 }}>
                {taxonomy?.map((c) => (
                  <Box
                    key={c._id}
                    sx={{ position: "relative", px: 1 }}
                    onMouseEnter={() => setHoverContinent(c)}
                    onMouseLeave={() => setHoverContinent(null)}
                  >
                    <Typography
                      variant="body1"
                      fontWeight={600}
                      sx={{
                        cursor: "pointer",
                        "&:hover": { color: "primary.main" },
                      }}
                    >
                      {c.name}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Search */}
              <TextField
                placeholder="Search places, states, themes"
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  maxWidth: 460,
                  bgcolor: "#f5f5f6",
                  borderRadius: 1,
                  "& fieldset": { border: "none" },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          )}

          {/* Right icons / Hamburger */}
          {!isMobile ? (
            <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
              <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate("/admin")}
                >
                  Admin
                </Button>
              {!userId ? (
                // If NOT logged in
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate("/sign")}
                >
                  Login
                </Button>
              ) : (
                // If logged in
                <>
                  <IconButton title="Profile" onClick={handleProfileClick}>
                    <AccountCircleIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                  >
                    <MenuItem disabled>{user?.name}</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                  {/* <IconButton
                    title="Wishlist"
                    onClick={() => navigate("/wishlist")}
                  >
                    <FavoriteBorderIcon />
                  </IconButton> */}
                 {userId && <IconButton
                    title="Cart"
                    onClick={() => navigate("/bookings")}
                  >
                    <ShoppingBagIcon />
                  </IconButton>}
                </>
              )}
            </Box>
          ) : (
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

      {/* Mega Menu (Desktop) */}
      {!isMobile && hoverContinent && (
        <Paper
          onMouseEnter={() => setHoverContinent(hoverContinent)}
          onMouseLeave={() => setHoverContinent(null)}
          elevation={6}
          sx={{
            position: "absolute",
            left: "5%",
            right: "10%",
            top: 50,
            width: "80%",
            zIndex: 1300,
            px: 6,
            py: 4,
            bgcolor: "#fff",
            borderRadius: "0 0 12px 12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 4,
          }}
        >
          {hoverContinent.countries?.map((country) => (
            <Box key={country._id}>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                gutterBottom
                sx={{ color: "primary.main" }}
              >
                {country.name}
              </Typography>

              {/* States */}
              {country.states?.map((s) => (
                <Typography
                  key={s._id}
                  variant="body2"
                  sx={{
                    py: 0.5,
                    cursor: "pointer",
                    "&:hover": { color: "secondary.main" },
                  }}
                  onClick={() =>
                    handleStateClick(hoverContinent.name, country.name, s)
                  }
                >
                  {s.name}
                </Typography>
              ))}

              {/* Direct Cities (for countries without states) */}
              {(!country.states || country.states.length === 0) &&
                country.cities?.map((city) => (
                  <Typography
                    key={city._id}
                    variant="body2"
                    sx={{
                      py: 0.5,
                      cursor: "pointer",
                      "&:hover": { color: "secondary.main" },
                    }}
                    onClick={() =>
                      navigate(
                        `/places?continent=${encodeURIComponent(
                          hoverContinent.name
                        )}&country=${encodeURIComponent(
                          country.name
                        )}&city=${encodeURIComponent(city.name)}`
                      )
                    }
                  >
                    {city.name}
                  </Typography>
                ))}
            </Box>
          ))}
        </Paper>
      )}

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 320, p: 2 }}>
          {/* Search */}
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

          {taxonomy?.map((continent) => (
            <Accordion key={continent._id} disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight={700}>{continent.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {continent.countries?.map((country) => (
                  <Accordion key={country._id} disableGutters>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      {country.name}
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {country.states?.map((s) => (
                          <ListItemButton
                            key={s._id}
                            onClick={() => {
                              setDrawerOpen(false);
                              handleStateClick(continent.name, country.name, s);
                            }}
                          >
                            <ListItemText primary={s.name} />
                          </ListItemButton>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Drawer>
    </>
  );
}
