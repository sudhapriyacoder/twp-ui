import React, { useState } from "react";
import { Box, Tabs, Tab, Typography, Card, CardContent } from "@mui/material";

// Placeholder imports (replace with your real CRUD components later)
import ContinentCRUD from "../components/admin/ContinentManager";
import CountryCRUD from "../components/admin/CountryManager";
import StateCRUD from "../components/admin/StateManager";
import CityCRUD from "../components/admin/CityManager";
import PlacesCRUD from "../components/admin/PlacesManager";
import RoutesManager from "../components/admin/RoutesManager";
import HomeCarouselManager from "../components/admin/HomeCarouselManager";

// Helper component for tab panels
function TabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      style={{ width: "100%" }}
    >
      {value === index && (
        <Card sx={{ mt: 2, p: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {children}
            </Typography>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function Admin() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
     <Tabs
  value={tabIndex}
  onChange={handleChange}
  variant="scrollable"
  scrollButtons="auto"
  aria-label="Admin CRUD Tabs"
  sx={{ borderBottom: 1, borderColor: "divider" }}
>
  <Tab label="Continent" />
  <Tab label="Country" />
  <Tab label="State" />
  <Tab label="City" />
  <Tab label="Places" />
  <Tab label="Routes" />
  <Tab label="Home Carousel" />
</Tabs>

{/* Tab Panels */}
<TabPanel value={tabIndex} index={0}>
  <ContinentCRUD />
</TabPanel>
<TabPanel value={tabIndex} index={1}>
  <CountryCRUD />
</TabPanel>
<TabPanel value={tabIndex} index={2}>
  <StateCRUD />
</TabPanel>
<TabPanel value={tabIndex} index={3}>
  <CityCRUD />
</TabPanel>
<TabPanel value={tabIndex} index={4}>
  <PlacesCRUD />
</TabPanel>
<TabPanel value={tabIndex} index={5}>
  <RoutesManager />
</TabPanel>
<TabPanel value={tabIndex} index={6}>
  <HomeCarouselManager />
</TabPanel>

    </Box>
  );
}
