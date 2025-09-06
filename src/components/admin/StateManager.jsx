import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStates,
  createState,
  updateState,
  deleteState,
} from "../../store/stateSlice";
import { fetchCountries } from "../../store/countrySlice";

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
} from "@mui/material";

export default function StateManager() {
  const dispatch = useDispatch();
  const states = useSelector((state) => state.states.list);
  const countries = useSelector((state) => state.countries.list);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [countryId, setCountryId] = useState("");
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
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!countryId) {
      alert("Please select a country");
      return;
    }

    if (editId) {
      dispatch(updateState({ id: editId, state: { name, countryId } }));
    } else {
      dispatch(createState({ name, countryId }));
    }

    handleClose();
  };

  const handleEdit = (state) => {
    setName(state.name);
    setCountryId(state.countryId?._id || "");
    setEditId(state._id);
    setOpen(true);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Manage States
      </Typography>

      {/* Add State Button */}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add State
      </Button>

      {/* States Table */}
      <Table style={{ marginTop: "20px" }}>
        <TableHead>
          <TableRow>
            <TableCell><strong>State Name</strong></TableCell>
            <TableCell><strong>Country</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {states.map((s) => (
            <TableRow key={s._id}>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.countryId?.name}</TableCell>
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
