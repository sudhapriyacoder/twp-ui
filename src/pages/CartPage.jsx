// src/pages/CartPage.jsx
import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Button,
  Paper,
  TableContainer,
  Box,
  Card,
  CardContent,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart, removeFromCart, clearCart } from "../store/cartSlice";
import axiosInstance from "../api/axiosInstance";

export default function CartPage() {
  const userId = useSelector(state => state.user.id); // hardcoded for now
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const [routes, setRoutes] = useState([]);
  const [itinerary, setItinerary] = useState([]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (cart.length > 0) {
      const cityId = cart[0].cityId;
      axiosInstance
        .get(`/api/routes/${cityId}`)
        .then((res) => setRoutes(res.data))
        .catch((err) => console.error("❌ Error fetching routes:", err));
    }
  }, [cart]);

  useEffect(() => {
    if (cart.length > 1 && routes.length > 0) {
      const steps = [];
      for (let i = 0; i < cart.length - 1; i++) {
        const source = cart[i];
        const destination = cart[i + 1];
        const match = routes.find(
          (r) =>
            r.source?._id === source._id && r.destination?._id === destination._id
        );
        steps.push({
          name: source.name,
          route: match ? match.description : `→ ${destination.name}`,
        });
      }
      steps.push({ name: cart[cart.length - 1].name });
      setItinerary(steps);
    }
  }, [cart, routes]);

  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

  return (
    <>
      <Box sx={{ p: 3, bgcolor: "#f9fafc", minHeight: "50vh" }}>
        <Typography
          variant="h4"
          gutterBottom
          fontWeight={700}
          color="primary"
          sx={{ mb: 3 }}
        >
          🛒 My Cart ({totalItems} items)
        </Typography>

        {cart.length === 0 ? (
          <Typography color="text.secondary">Your cart is empty.</Typography>
        ) : (
          <>
            <TableContainer
              component={Paper}
              sx={{ borderRadius: 4, boxShadow: 4, overflow: "hidden" }}
            >
              <Table>
                <TableHead sx={{ bgcolor: "primary.dark" }}>
                  <TableRow>
                    {/* {["Seq", "Name", "Description", "Type", "Image", "Landmark", "Actions"].map( */}
                    {["Seq", "Name", "Description", "Type", "Image", "Landmark"].map(
                      (header) => (
                        <TableCell
                          key={header}
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          {header}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {cart.map((p, index) => (
                    <TableRow
                      key={p._id || p.id}
                      hover
                      sx={{
                        "&:hover": { bgcolor: "grey.100" },
                        transition: "0.2s",
                      }}
                    >
                      <TableCell align="center">{p.sequence || index + 1}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={p.name}
                          color="primary"
                          variant="outlined"
                          sx={{ fontWeight: "bold" }}
                        />
                      </TableCell>
                      <TableCell align="center">{p.description}</TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="body2"
                          sx={{
                            bgcolor: "primary.light",
                            color: "primary.dark",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            display: "inline-block",
                          }}
                        >
                          {p.type}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {p.image ? (
                          <Avatar
                            src={p.image}
                            alt={p.name}
                            variant="rounded"
                            sx={{ width: 56, height: 56, mx: "auto" }}
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell align="center">{p.landMark || "-"}</TableCell>
                      {/* <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() =>
                            dispatch(
                              removeFromCart({ userId, placeId: p._id || p.id })
                            )
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="error"
                onClick={() => dispatch(clearCart(userId))}
                sx={{ flex: 1, py: 1.5, borderRadius: 3, fontWeight: "bold" }}
              >
                Clear Cart
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  flex: 2,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: "bold",
                  bgcolor: "primary.main",
                }}
              >
                Proceed to Checkout
              </Button>
            </Box> */}
          </>
        )}
      </Box>

      {/* Itinerary Section */}
      {itinerary.length > 0 && (
        <Box sx={{ maxWidth: 800, mx: "auto", mt: 6, mb: 6 }}>
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            fontWeight="bold"
            color="secondary"
          >
            🗺️ Your Itinerary
          </Typography>

          <Card
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow: 5,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(245,247,250,0.95))",
            }}
          >
            <CardContent>
              <Stepper orientation="vertical" activeStep={-1}>
                {itinerary.map((step, index) => (
                  <Step key={index}>
                    <StepLabel>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        color="primary.dark"
                      >
                        {step.name}
                      </Typography>
                      {step.route && (
                        <Typography variant="body2" color="text.secondary">
                          {step.route}
                        </Typography>
                      )}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>

          <Divider sx={{ my: 4 }} />

          <Box textAlign="center">
            {/* <Typography variant="body2" color="text.secondary">
              ✨ Routes are auto-generated based on your cart order.
            </Typography> */}
          </Box>
        </Box>
      )}
    </>
  );
}
