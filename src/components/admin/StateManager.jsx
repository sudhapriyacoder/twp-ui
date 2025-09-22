import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStates,
  createState,
  updateState,
  deleteState,
} from "../../store/stateSlice";
import { fetchCountries } from "../../store/countrySlice";
import "../../assets/myntraAdmin.css";

import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem,
  Typography,
  TableContainer,
  Paper,
} from "@mui/material";

export default function StateManager() {
  const dispatch = useDispatch();
  const states = useSelector((state) => state.states.list);
  const countries = useSelector((state) => state.countries.list);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [countryId, setCountryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [trendingSequence, setTrendingSequence] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(fetchStates());
    dispatch(fetchCountries());
  }, [dispatch]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setName("");
    setCountryId("");
    setImageUrl("");
    setTrendingSequence("");
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!countryId) {
      alert("Please select a country");
      return;
    }
    const payload = { name, countryId, imageUrl, trendingSequence };
    if (imageUrl) payload.imageUrl = imageUrl;
    if (trendingSequence) payload.trendingSequence = Number(trendingSequence);
    if (editId && typeof editId === 'string' && editId !== 'undefined') {
      dispatch(updateState({ id: editId, state: payload }));
    } else if (!editId) {
      dispatch(createState(payload));
    } else {
      alert('Invalid state ID for update.');
    }
    handleClose();
  };

  const handleEdit = (state) => {
    setName(state.name);
    setCountryId(state.countryId?._id || "");
    setImageUrl(state.imageUrl || "");
    setTrendingSequence(state.trendingSequence || "");
    setEditId(state._id);
    setOpen(true);
  };

  return (
    <div className="admin-myntra" style={{ padding: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Manage States
      </Typography>

      {/* Add State Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ mb: 4 }}
      >
        Add State
      </Button>

      {/* States Table */}
      <TableContainer className="admin-myntra">
        <Table style={{ marginTop: "20px" }}>
          <TableHead>
            <TableRow>
              <TableCell><strong>State Name</strong></TableCell>
              <TableCell><strong>Country</strong></TableCell>
              <TableCell><strong>Trending Seq</strong></TableCell>
              <TableCell><strong>Image</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {states.map((s) => (
              <TableRow key={s._id}>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.countryId?.name}</TableCell>
                <TableCell>{s.trendingSequence ?? ""}</TableCell>
                <TableCell>
                  {s.imageUrl ? (
                    <img src={s.imageUrl} alt="state" style={{ width: 40, height: 28, objectFit: 'cover', borderRadius: 4 }} />
                  ) : ""}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={() => handleEdit(s)}
                    style={{ marginRight: "8px" }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="secondary"
                    onClick={() => dispatch(deleteState(s._id))}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Add/Edit */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? "Edit State" : "Add State"}</DialogTitle>
        <DialogContent>
          <TextField
            label="State Name"
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
            onChange={(e) => setCountryId(e.target.value)}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="">Select Country</MenuItem>
            {countries.map((c) => (
              <MenuItem key={c._id} value={c._id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Image URL (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Trending Sequence (optional)"
            type="number"
            value={trendingSequence}
            onChange={(e) => setTrendingSequence(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editId ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
