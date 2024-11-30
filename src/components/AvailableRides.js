import React, { useState } from "react";
import { Box, Typography, Paper, Button, List, ListItem, ListItemText, Divider } from "@mui/material";
import { FaCarSide } from "react-icons/fa";
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

const rides = [
  {
    id: 1,
    from: "Los Angeles",
    to: "San Francisco",
    time: "5:00",
    duration: "6h55",
    price: "$50.00",
    driver: "Driver Name",
    car: "Honda Civic",
  },
  {
    id: 2,
    from: "Los Angeles",
    to: "San Francisco",
    time: "5:00",
    duration: "6h55",
    price: "$50.00",
    driver: "Driver Name",
    car: "BMW M4",
  },
  {
    id: 3,
    from: "Los Angeles",
    to: "San Francisco",
    time: "5:00",
    duration: "6h55",
    price: "$50.00",
    driver: "Driver Name",
    car: "Toyota Camry",
  },
];

const center = { lat: 36.7783, lng: -119.4179 }; // California center for initial map view

const AvailableRides = (props) => {
  const { handleBook } = props;
  const [selectedRide, setSelectedRide] = useState(rides[0]);
  const [directions, setDirections] = useState(null);
 

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyA4DgX7hxdOnIKy30hDEi9nzft06J3V6ho", // Replace with your Google Maps API Key
  });

  const handleSelectRide = (ride) => {
    setSelectedRide(ride);

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: ride.from,
        destination: ride.to,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };

  if (!isLoaded) return <Typography>Loading Maps...</Typography>;

  return (
    <Box sx={{ display: "flex", height: "88vh", backgroundColor: "#f9f9f9", marginBottom:"10px" }}>
      {/* Left Panel */}
      <Box sx={{ width: "40%", padding: 2, overflowY: "auto", borderRight: "1px solid #ddd", backgroundColor: "#fff" }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
          Available Rides
        </Typography>
        <Typography variant="subtitle2" sx={{ mb: 2, textAlign: "left", color: "#888", fontWeight: 700 }}>
          {new Date().toDateString()}
        </Typography>
        <List>
          {rides.map((ride) => (
            <Paper
              key={ride.id}
              elevation={3}
              sx={{
                padding: 2,
                marginBottom: 2,
                cursor: "pointer",
                border: selectedRide.id === ride.id ? "2px solid #FF6436" : "1px solid #ddd",
              }}
              onClick={() => handleSelectRide(ride)}
            >
              <Typography variant="subtitle2">
                {ride.time} • {ride.from}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                {ride.duration}
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                {ride.to}
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "#FF6436", fontWeight: "bold", display: "inline", marginRight: 1 }}
              >
                {ride.price}
              </Typography>
              <Button
                size="small"
                variant="contained"
                color="warning"
                sx={{ float: "right", textTransform: "capitalize" }}
                onClick={handleBook}
              >
                Book
              </Button>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2">
                <FaCarSide style={{ marginRight: 5 }} />
                {ride.car} • {ride.driver}
              </Typography>
            </Paper>
          ))}
        </List>
      </Box>

      {/* Right Panel */}
      <Box sx={{ width: "60%" }}>
        <GoogleMap
          center={center}
          zoom={6}
          mapContainerStyle={{ width: "100%", height: "100%" }}
        >
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </Box>
    </Box>
  );
};

export default AvailableRides;
