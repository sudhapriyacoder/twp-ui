import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Skeleton,
  Box,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosInstance from "../api/axiosInstance";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axiosInstance.get("/api/user/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(res.data || []);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemove = async (placeId) => {
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.post(
        "/api/user/favorites",
        { placeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWishlist((prev) => prev.filter((p) => p._id !== placeId));
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <div style={{ padding: "16px 24px" }}>
      <Typography variant="h5" gutterBottom fontWeight={700}>
        My Wishlist
      </Typography>

      {wishlist.length === 0 ? (
        <Typography color="text.secondary">
          No places in wishlist yet.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {wishlist.map((p) => (
            <Grid item size={{xs: 12,sm: 6, md: 3}}  key={p._id}>
              <Card
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.03)", boxShadow: 3 },
                }}
              >
                <Box sx={{ position: "relative", width: "100%", height: 200 }}>
                  {p.image ? (
                    <CardMedia
                      component="img"
                      image={p.image.startsWith("http") ? p.image : ""}
                      alt={p.name}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderTopLeftRadius: 4,
                        borderTopRightRadius: 4,
                        transition: "opacity 0.3s ease-in-out",
                      }}
                    />
                  ) : (
                    <Skeleton variant="rectangular" width="100%" height="100%" />
                  )}
                </Box>

                <IconButton
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    bgcolor: "rgba(255,255,255,0.9)",
                    "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                    boxShadow: 1,
                  }}
                  size="small"
                  onClick={() => handleRemove(p._id)}
                >
                  <DeleteIcon />
                </IconButton>

                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {p.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {p.description || "No description available"}
                  </Typography>
                  {p.type && (
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 1,
                        display: "inline-block",
                        px: 1.5,
                        py: 0.5,
                        bgcolor: "primary.light",
                        color: "primary.contrastText",
                        borderRadius: 1,
                        fontWeight: 500,
                      }}
                    >
                      {p.type}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
}
