import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, List, Divider, CircularProgress, Snackbar, Alert } from "@mui/material";
import { FaCarSide, FaArrowLeft } from "react-icons/fa";
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import { useDispatch, useSelector } from "react-redux";
import { useGetRidesByIdMutation } from "../services/apiService";
import { setRideDetails } from "../features/apiSlice";

// const rides = [
//   {
//     id: 1,
//     from: "Los Angeles",
//     to: "San Francisco",
//     time: "5:00",
//     duration: "6h55",
//     price: "$50.00",
//     driver: "Driver Name",
//     car: "Honda Civic",
//   },
//   {
//     id: 2,
//     from: "Los Angeles",
//     to: "San Francisco",
//     time: "5:00",
//     duration: "6h55",
//     price: "$50.00",
//     driver: "Driver Name",
//     car: "BMW M4",
//   },
//   {
//     id: 3,
//     from: "Los Angeles",
//     to: "San Francisco",
//     time: "5:00",
//     duration: "6h55",
//     price: "$50.00",
//     driver: "Driver Name",
//     car: "Toyota Camry",
//   },
// ];

const center = { lat: 36.7783, lng: -119.4179 }; // California center for initial map view

const AvailableRides = (props) => {
  const { handleBook, handleBack } = props;

  const { access_token } = useSelector((state) => state.auth);
  const { availableRides } = useSelector((state) => state.apiSlice);
  const { rides } = availableRides;

  const [selectedRide, setSelectedRide] = useState(null);
  const [directions, setDirections] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success")

  const [getRidesById, { isLoading }] = useGetRidesByIdMutation();

  const dispatch = useDispatch()

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyA4DgX7hxdOnIKy30hDEi9nzft06J3V6ho", // Replace with your Google Maps API Key
  });

  const handleSelectRide = (ride) => {
    setSelectedRide(ride);

    const directionsService = new window.google.maps.DirectionsService();

    // Create LatLng objects for origin and destination
    const origin = new window.google.maps.LatLng(ride.going_from_lat, ride.going_from_lng);
    const destination = new window.google.maps.LatLng(ride.going_to_lat, ride.going_to_lng);

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`Error fetching directions: ${result}`);
        }
      }
    );
  };

  const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpen(false);
	};

  const getRideDetails = async (id) => {
    const res = await getRidesById({ rideId: id, token: access_token });
    if (res.error) {
      setMessage(res.error.data.errors);
      setOpen(true);
      setSeverity("error")
    } else if (res.data) {
      dispatch(setRideDetails({ data: res.data }));
      handleBook(id)
    }
  }

  useEffect(() => {
    if (rides.length > 0) {
      handleSelectRide(rides[0]); // Automatically select the first ride
    }
  }, [rides]);


  if (!isLoaded) return <Typography>Loading Maps...</Typography>;

  return (
    <Box sx={{ display: "flex", height: "88vh", backgroundColor: "#f9f9f9", marginBottom: "10px" }}>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
      {/* Left Panel */}
      <Box sx={{ width: "40%", padding: 2, overflowY: "auto", borderRight: "1px solid #ddd", backgroundColor: "#fff" }}>
        <Typography onClick={() => handleBack('available')}><FaArrowLeft style={{ marginRight: 5, cursor: "pointer" }} /></Typography>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
          Available Rides
        </Typography>
        <Typography variant="subtitle2" sx={{ mb: 2, textAlign: "left", color: "#888", fontWeight: 700 }}>
          {new Date(selectedRide?.date_time).toDateString()}
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
                border: selectedRide?.id === ride?.id ? "2px solid #FF6436" : "1px solid #ddd",
              }}
              onClick={() => handleSelectRide(ride)}
            >
              <Typography variant="subtitle2">
                {ride.date_time.split('T')[1].replace('Z', '').slice(0, -3)} • {ride.going_from}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                {ride.duration}
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                {ride.going_to}
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "#FF6436", fontWeight: "bold", display: "inline", marginRight: 1 }}
              >
                {ride.price_per_seat}
              </Typography>
              {isLoading ? <CircularProgress /> : <Button
                size="small"
                variant="contained"
                color="warning"
                sx={{ float: "right", textTransform: "capitalize" }}
                onClick={() => getRideDetails(ride.id)}
              >
                Book
              </Button>}
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2">
                <FaCarSide style={{ marginRight: 5 }} />
                {ride.vehicle_name} • {ride.driver_name}
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
