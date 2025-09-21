import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCities,
  addCity,
  updateCity,
  deleteCity,
} from "../../store/citySlice";
import { fetchStates } from "../../store/stateSlice";
import { fetchCountries } from "../../store/countrySlice";
import '../../assets/myntraAdmin.css';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  IconButton,
  MenuItem,
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function CityManager() {
  const dispatch = useDispatch();
  const cities = useSelector((state) => state.cities.list);
  const states = useSelector((state) => state.states.list);
  const countries = useSelector((state) => state.countries.list);

  const [open, setOpen] = useState(false);
  const [editCity, setEditCity] = useState(null);
  const [name, setName] = useState("");
  const [stateId, setStateId] = useState("");
  const [countryId, setCountryId] = useState("");
  const [cityImage, setCityImage] = useState("");
  const [trendingSequence, setTrendingSequence] = useState("");

  // ✅ Fetch all on load
  useEffect(() => {
    dispatch(fetchCities());
    console.log(cities)
    dispatch(fetchStates());
    dispatch(fetchCountries());
  }, [dispatch]);


 const handleOpen = (city = null) => {
  if (city) {
    setEditCity(city);
    setName(city.name);
    setStateId(city.stateId?._id || "");
    setCountryId(city.countryId?._id || "");  // ✅ FIXED
  } else {
    setEditCity(null);
    setName("");
    setStateId("");
    setCountryId("");
  }
  setOpen(true);
};

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("countryId", countryId);
    formData.append("stateId", stateId);
    formData.append("trendingSequence", trendingSequence);
    formData.append("cityImage", cityImage);

    if (editCity) {
      dispatch(updateCity({ id: editCity._id, data: formData }));
    } else {
      dispatch(addCity(formData));
    }
    setOpen(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteCity(id));
  };

  // Filter states for selected country
  const filteredStates = states.filter((s) => s.countryId?._id === countryId);

  return (
    <div style={{ padding: "20px" }} className="admin-myntra">
      <Typography variant="h5" gutterBottom>
        Manage Cities
      </Typography>

      {/* Add City Button */}
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add City
      </Button>

      {/* Cities Table */}
      <TableContainer component={Paper} className="admin-myntra" style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>City</strong></TableCell>
              <TableCell><strong>State</strong></TableCell>
              <TableCell><strong>Country</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cities.map((city) => (
              <TableRow key={city._id}>
                <TableCell>{city.name}</TableCell>
                <TableCell>{city.stateId?.name}</TableCell>
                <TableCell>{city.countryId?.name}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(city)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(city._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {cities.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No cities available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Add/Edit */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editCity ? "Edit City" : "Add City"}</DialogTitle>
        <DialogContent>
          <TextField
            label="City Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            select
            label="Country"
            value={countryId}
            onChange={(e) => {
              setCountryId(e.target.value);
              setStateId("");
            }}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="">Select Country</MenuItem>
            {countries.map((c) => (
              <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="State"
            value={stateId}
            onChange={(e) => setStateId(e.target.value)}
            fullWidth
            margin="normal"
            required
            disabled={!countryId}
          >
            <MenuItem value="">Select State</MenuItem>
            {filteredStates.map((s) => (
              <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Trending Sequence"
            type="number"
            value={trendingSequence}
            onChange={(e) => setTrendingSequence(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="City Image URL"
            value={cityImage}
            onChange={e => setCityImage(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {editCity ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
