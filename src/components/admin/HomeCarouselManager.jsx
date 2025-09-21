import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, IconButton, Typography
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function HomeCarouselManager() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [imageName, setImageName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageSequence, setImageSequence] = useState("");

  const fetchItems = () => {
    axios.get("/api/home").then(res => setItems(res.data));
  };
  useEffect(fetchItems, []);

  const handleOpen = (item = null) => {
    if (item) {
      setEditItem(item);
      setImageName(item.imageName);
      setImageUrl(item.imageUrl);
      setImageSequence(item.imageSequence);
    } else {
      setEditItem(null);
      setImageName("");
      setImageUrl("");
      setImageSequence("");
    }
    setOpen(true);
  };

  const handleSave = async () => {
    const data = { imageName, imageUrl, imageSequence };
    if (editItem) {
      await axios.put(`/api/home/${editItem._id}`, data);
    } else {
      await axios.post("/api/home", data);
    }
    setOpen(false);
    fetchItems();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/home/${id}`);
    fetchItems();
  };

  return (
    <div style={{ padding: "20px" }} className="admin-myntra">
      <Typography variant="h5" gutterBottom>Manage Home Carousel</Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>Add Carousel Item</Button>
      <TableContainer component={Paper} className="admin-myntra" style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Image</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Sequence</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(item => (
              <TableRow key={item._id}>
                <TableCell>{item.imageUrl ? <img src={item.imageUrl} alt={item.imageName} style={{width:60, height:40, objectFit:'cover'}} /> : ""}</TableCell>
                <TableCell>{item.imageName}</TableCell>
                <TableCell>{item.imageSequence}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(item)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(item._id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">No carousel items</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editItem ? "Edit Carousel Item" : "Add Carousel Item"}</DialogTitle>
        <DialogContent>
          <TextField label="Image Name" value={imageName} onChange={e => setImageName(e.target.value)} fullWidth margin="normal" required />
          <TextField label="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} fullWidth margin="normal" required />
          <TextField label="Image Sequence" type="number" value={imageSequence} onChange={e => setImageSequence(e.target.value)} fullWidth margin="normal" required />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">{editItem ? "Update" : "Create"}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
