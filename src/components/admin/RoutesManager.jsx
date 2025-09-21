import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Button, FormControl,
  InputLabel, Select, MenuItem
} from "@mui/material";
import axiosInstance from "../../api/axiosInstance";
import '../../assets/myntraAdmin.css';

export default function RoutesManager() {
  const [cities, setCities] = useState([]);
  const [cityId, setCityId] = useState("");
  const [places, setPlaces] = useState([]);
  const [routes, setRoutes] = useState([]); // [{source, destination, description}]

  // Load all cities
  useEffect(() => {
    axiosInstance.get("/api/cities").then(res => setCities(res.data));
  }, []);

  // Load places + saved routes when city changes, then merge
  useEffect(() => {
    if (!cityId) return;

    const load = async () => {
      const [placesRes, savedRes] = await Promise.all([
        axiosInstance.get(`/api/place/${cityId}`),
        axiosInstance.get(`/api/routes/${cityId}`),
      ]);

      const cityPlaces = placesRes.data?.places || [];
      const savedRoutes = savedRes.data || [];

      setPlaces(cityPlaces);

      // map of saved descriptions by key "sourceId_destId"
      const savedMap = new Map(
        savedRoutes.map(r => [`${r.source?._id}_${r.destination?._id}`, r.description || ""])
      );

      // generate ALL bi-directional combos
      const combos = [];
      for (let i = 0; i < cityPlaces.length; i++) {
        for (let j = 0; j < cityPlaces.length; j++) {
          if (i === j) continue;
          const s = cityPlaces[i];
          const d = cityPlaces[j];
          const key = `${s._id}_${d._id}`;
          combos.push({
            source: s,
            destination: d,
            description: savedMap.get(key) ?? "", // preserve saved desc if exists
          });
        }
      }

      setRoutes(combos);
    };

    load().catch(console.error);
  }, [cityId]);

  const handleChange = (index, value) => {
    setRoutes(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], description: value };
      return copy;
    });
  };

  const handleSave = async () => {
    const payload = routes.map(r => ({
      source: r.source._id,
      destination: r.destination._id,
      description: (r.description || "").trim(),
    }));

    await axiosInstance.post("/api/routes/bulk", { routes: payload });
    alert("Routes saved!");
  };

  const citySelectDisabled = useMemo(() => !cities?.length, [cities]);

  return (
    <Box className="admin-myntra" sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>🛣 Manage Routes</Typography>

      {/* City Selector */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Select City</InputLabel>
        <Select
          value={cityId}
          onChange={(e) => setCityId(e.target.value)}
          disabled={citySelectDisabled}
          label="Select City"
        >
          {cities.map((c) => (
            <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {routes.length > 0 && (
        <>
      <TableContainer component={Paper} className="admin-myntra">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><b>Source</b></TableCell>
                  {/* <TableCell><b>Landmark</b></TableCell> */}
                  <TableCell><b>Destination</b></TableCell>
                  {/* <TableCell><b>Landmark</b></TableCell> */}
                  <TableCell><b>Description</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {routes.map((r, index) => (
                  <TableRow key={`${r.source._id}_${r.destination._id}`}>
                    <TableCell>{r.source.name}({r.source.landMark})</TableCell>
                    {/* <TableCell>{r.source.landMark}</TableCell> */}
                    <TableCell>{r.destination.name}({r.destination.landMark})</TableCell>
                    {/* <TableCell>{r.destination.landMark}</TableCell> */}
                    <TableCell>
                      <TextField
                        value={r.description}
                        onChange={(e) => handleChange(index, e.target.value)}
                        fullWidth
                        multiline
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Button variant="contained" sx={{ mt: 2 }} onClick={handleSave}>
            Save All Routes
          </Button>
        </>
      )}
    </Box>
  );
}
