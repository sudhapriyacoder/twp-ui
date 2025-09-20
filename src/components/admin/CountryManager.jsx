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
      setEditId(country._id);
    } else {
      setName("");
      setContinentId("");
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setName("");
    setContinentId("");
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!continentId) {
      alert("Please select a continent");
      return;
    }
    dispatch(createCountry({ name, continentId }));
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
                    <TableCell colSpan={4} align="center">
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
