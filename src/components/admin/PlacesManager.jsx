import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlaces, addPlace, updatePlace, deletePlace } from "../../store/placeSlice";
import {
  Box, Button, TextField, FormControl, InputLabel, Select, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, Typography, IconButton
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axiosInstance from "../../api/axiosInstance";
import '../../assets/myntraAdmin.css';

export default function PlacesManager() {
  const dispatch = useDispatch();
  const { list: places, status, error } = useSelector((state) => state.places);

  const [continents, setContinents] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [form, setForm] = useState({
    name: "", description: "", image: "", continentId: "", countryId: "", stateId: "", cityId: "", type: "", linkTo:"", sequence: "", landMark:""
  });

  const [editingId, setEditingId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchPlaces());
    fetchContinents();
  }, [dispatch]);

  const fetchContinents = async () => {
    const res = await axiosInstance.get("/api/continents");
    setContinents(res.data);
  };

  const handleContinentChange = async (id) => {
    setForm({ ...form, continentId: id, countryId: "", stateId: "", cityId: "" });
    if (id) {
      const res = await axiosInstance.get(`/api/countries?continentId=${id}`);
      setCountries(res.data);
    } else setCountries([]);
    setStates([]);
    setCities([]);
  };

  const handleCountryChange = async (id) => {
    setForm({ ...form, countryId: id, stateId: "", cityId: "" });
    if (id) {
      const res = await axiosInstance.get(`/api/states?countryId=${id}`);
      setStates(res.data);
    } else setStates([]);
    setCities([]);
  };

  const handleStateChange = async (id) => {
    setForm({ ...form, stateId: id, cityId: "" });
    if (id) {
      const res = await axiosInstance.get(`/api/cities?stateId=${id}`);
      setCities(res.data);
    } else setCities([]);
  };

  const handleCityChange = (id) => setForm({ ...form, cityId: id });

  const handleOpenDialog = () => {
    setForm({ name: "", description: "", image: "", continentId: "", countryId: "", stateId: "", cityId: "", type: "", linkTo: "", sequence: "", landMark:"" });
    setEditingId(null);
    setCountries([]);
    setStates([]);
    setCities([]);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await dispatch(updatePlace({ id: editingId, updatedData: form }));
    } else {
      await dispatch(addPlace(form));
    }
    await dispatch(fetchPlaces());
    handleCloseDialog();
  };

  const handleEdit = async (place) => {
    if (place.continentId?._id) await handleContinentChange(place.continentId._id);
    if (place.countryId?._id) await handleCountryChange(place.countryId._id);
    if (place.stateId?._id) handleStateChange(place.stateId._id);

    setForm({
      name: place.name,
      description: place.description,
      image: place.image,
      continentId: place.continentId?._id || "",
      countryId: place.countryId?._id || "",
      stateId: place.stateId?._id || "",
      cityId: place.cityId?._id || "",
      type: place.type || "",
      linkTo: place.linkTo || "",
      sequence: place.sequence || "",
      landMark: place.landMark || ""
    });
    setEditingId(place._id);
    setOpenDialog(true);
  };

  const handleDelete = (id) => dispatch(deletePlace(id));

  return (
    <Box className="admin-myntra" sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        🏞 Manage Places
      </Typography>

      {/* Add Place Button */}
      <Button variant="contained" color="primary" onClick={handleOpenDialog} sx={{ mb: 2 }}>
        + Add Place
      </Button>

      {/* Table */}
      <TableContainer component={Paper} className="admin-myntra">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>#</b></TableCell>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Description</b></TableCell>
              <TableCell><b>Type</b></TableCell>
              <TableCell><b>Link To</b></TableCell>
              <TableCell><b>Continent</b></TableCell>
              <TableCell><b>Country</b></TableCell>
              <TableCell><b>State</b></TableCell>
              <TableCell><b>City</b></TableCell>
              <TableCell><b>Image</b></TableCell>
              <TableCell><b>Sequence</b></TableCell>
               <TableCell><b>LandMark</b></TableCell>
              <TableCell align="right"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {places.length > 0 ? (
              places.map((p, index) => (
                <TableRow key={p._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.description}</TableCell>
                  <TableCell>{p.type}</TableCell>
                  
                  <TableCell>{p.linkTo}</TableCell>
                  <TableCell>{p.continentId?.name || "-"}</TableCell>
                  <TableCell>{p.countryId?.name || "-"}</TableCell>
                  <TableCell>{p.stateId?.name || "-"}</TableCell>
                  <TableCell>{p.cityId?.name || "-"}</TableCell>
                  <TableCell>
                    {p.image && <img src={p.image} alt={p.name} style={{ width: 50, height: 50 }} />}
                  </TableCell>
                  <TableCell>{p.sequence}</TableCell>
                   <TableCell>{p.landMark}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleEdit(p)}><Edit /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(p._id)}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No places found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? "Edit Place" : "Add Place"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField label="Name" fullWidth margin="dense" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            
            <TextField select label="Type" fullWidth margin="dense" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <MenuItem value="temple">Temple</MenuItem>
              <MenuItem value="park">Park</MenuItem>
              <MenuItem value="museum">Museum</MenuItem>
              <MenuItem value="monument">Monument</MenuItem>
              <MenuItem value="beach">Beach</MenuItem>
            </TextField>


            <TextField label="sequence" fullWidth margin="dense" value={form.sequence} onChange={(e) => setForm({ ...form, sequence: e.target.value })} />
            <TextField label="landMark" fullWidth margin="dense" value={form.landMark} onChange={(e) => setForm({ ...form, landMark: e.target.value })} />

            <TextField label="Description" fullWidth margin="dense" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <TextField label="Image URL" fullWidth margin="dense" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            <TextField select label="LinkTo" fullWidth margin="dense" value={form.linkTo} onChange={(e) => setForm({ ...form, linkTo: e.target.value })}>
              <MenuItem value="country">Country</MenuItem>
              <MenuItem value="state">State</MenuItem>
              <MenuItem value="city">City</MenuItem>
             
            </TextField>
            <FormControl fullWidth margin="dense">
              <InputLabel>Continent</InputLabel>
              <Select value={form.continentId} onChange={(e) => handleContinentChange(e.target.value)}>
                <MenuItem value="">Select Continent</MenuItem>
                {continents.map((c) => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="dense">
              <InputLabel>Country</InputLabel>
              <Select value={form.countryId} onChange={(e) => handleCountryChange(e.target.value)}>
                <MenuItem value="">Select Country</MenuItem>
                {countries.map((c) => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="dense">
              <InputLabel>State</InputLabel>
              <Select value={form.stateId} onChange={(e) => handleStateChange(e.target.value)}>
                <MenuItem value="">Select State</MenuItem>
                {states.map((s) => <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="dense">
              <InputLabel>City</InputLabel>
              <Select value={form.cityId} onChange={(e) => handleCityChange(e.target.value)}>
                <MenuItem value="">Select City</MenuItem>
                {cities.map((c) => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
            <Button type="submit" variant="contained" color="primary">{editingId ? "Update" : "Add"}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
