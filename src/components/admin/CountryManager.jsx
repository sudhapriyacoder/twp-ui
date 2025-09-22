import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCountries,
  createCountry,
  updateCountry,
  deleteCountry,
} from "../../store/countrySlice";
import { fetchContinents } from "../../store/continentSlice";

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
} from "@mui/material";

import { Edit, Delete } from "@mui/icons-material";
import '../../assets/myntraAdmin.css';

export default function CountryManager() {
  const dispatch = useDispatch();
  const countries = useSelector((state) => state.countries.list);
  const continents = useSelector((state) => state.continents.list);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [continentId, setContinentId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [trendingSequence, setTrendingSequence] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(fetchCountries());
    dispatch(fetchContinents());
  }, [dispatch]);

  // open modal (for add/edit)
  const handleOpen = (country = null) => {
    if (country) {
      setName(country.name);
      setContinentId(country.continentId?._id || "");
      setImageUrl(country.imageUrl || "");
      setTrendingSequence(country.trendingSequence || "");
      setEditId(country._id);
    } else {
      setName("");
      setContinentId("");
      setImageUrl("");
      setTrendingSequence("");
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setName("");
    setContinentId("");
    setImageUrl("");
    setTrendingSequence("");
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!continentId) {
      alert("Please select a continent");
      return;
    }
    const payload = { name, continentId, imageUrl, trendingSequence };
    if (imageUrl) payload.imageUrl = imageUrl;
    if (trendingSequence) payload.trendingSequence = Number(trendingSequence);
    if (editId && typeof editId === 'string' && editId !== 'undefined') {
      dispatch(updateCountry({ id: editId, country: payload }));
    } else if (!editId) {
      dispatch(createCountry(payload));
    } else {
      alert('Invalid country ID for update.');
    }
    handleClose();
  };

  return (
  <Box className="admin-myntra" sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        🏳 Manage Countries
      </Typography>

      {/* Add Country Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpen()}
        sx={{ mb: 2 }}
      >
        + Add Country
      </Button>

      {/* Table */}
  <TableContainer component={Paper} className="admin-myntra" sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>#</b></TableCell>
              <TableCell><b>Country</b></TableCell>
              <TableCell><b>Continent</b></TableCell>
              <TableCell><b>Trending Seq</b></TableCell>
              <TableCell><b>Image</b></TableCell>
              <TableCell align="right"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {countries.length > 0
              ? countries.map((c, index) => (
                  <TableRow key={c._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.continentId?.name || "-"}</TableCell>
                    <TableCell>{c.trendingSequence ?? ""}</TableCell>
                    <TableCell>
                      {c.imageUrl ? (
                        <img src={c.imageUrl} alt="country" style={{ width: 40, height: 28, objectFit: 'cover', borderRadius: 4 }} />
                      ) : ""}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        onClick={() => handleOpen(c)}
                        style={{ marginRight: "8px" }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="secondary"
                        onClick={() => dispatch(deleteCountry(c._id))}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No countries found
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? "Edit Country" : "Add Country"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Country Name"
              type="text"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <FormControl fullWidth margin="dense" required>
              <InputLabel>Continent</InputLabel>
              <Select
                value={continentId}
                onChange={(e) => setContinentId(e.target.value)}
              >
                {continents.map((cont) => (
                  <MenuItem key={cont._id} value={cont._id}>
                    {cont.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Image URL (optional)"
              type="text"
              fullWidth
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Trending Sequence (optional)"
              type="number"
              fullWidth
              value={trendingSequence}
              onChange={(e) => setTrendingSequence(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {editId ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
