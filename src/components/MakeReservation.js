import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Card,
  CardContent,
  IconButton,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { FaArrowLeft, FaCircle, FaSquare } from "react-icons/fa";
import { useBookRideMutation } from '../services/apiService';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { generateSeatList } from '../helper';

const CarpoolBooking = (props) => {
  const { handleBack, rideBookId } = props

  const seatMapping = {
    "front passenger": 1,
    "back right": 2,
    "back left": 3,
    "middle right": 4,
    "middle left": 5,
    "back middle": 6,
  };

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success")

  const { access_token, profile } = useSelector((state) => state.auth);
  const { rideDetails } = useSelector((state) => state.apiSlice);

  const availableSeats = generateSeatList(4);

  const [bookRide, { isLoading }] = useBookRideMutation();

  const toggleSeatSelection = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else if (selectedSeats.length < rideDetails?.available_seats) {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  };

  const calculateStartAndEndTime = (dateTime, withinTime) => {
    // Parse the given date and duration
    const startTime = new Date(dateTime); // Start time
    const minutes = parseInt(withinTime.replace("m", "")); // Extract minutes from "18m"
    const endTime = new Date(startTime.getTime() + minutes * 60 * 1000); // Add minutes to start time

    // Format the time only
    const formatTime = (date) =>
      date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

    return {
      startTime: formatTime(startTime),
      endTime: formatTime(endTime),
    };
  };

  const handleMakeReservation = async () => {
    const bookedSeatNumbers = selectedSeats.map((seat) => seatMapping[seat]);
    try {
      const actualData = {
        ride: rideBookId,
        passenger: profile.id,
        seat_2: false,
        seat_3: true,
        seat_4: true,
        additional_notes: rideDetails.ride_description,
      }
      console.log(actualData)
      const res = await bookRide({ actualData, access_token });
      if (res.error) {
        setMessage(res.error.data.errors);
        setOpen(true);
        setSeverity("error")
      } else if (res.data) {
        console.log(res)
        setMessage("Ride booked successfully");
        setOpen(true);
        setSeverity("success")
        handleBack()
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Box>
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
      <Box sx={{ padding: 3, width: "100%", margin: 'auto', fontFamily: 'Roboto' }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography onClick={() => handleBack('reservation')} sx={{ mr: 2 }}><FaArrowLeft style={{ marginRight: 5, cursor: "pointer" }} /></Typography>
          {/* Header */}
          <Typography variant="h6" gutterBottom>
            {formatDate(rideDetails?.date_time)}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", width: "100%" }}>
          <Box sx={{ width: "70%" }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography>
                <strong>{rideDetails.going_from}</strong>
              </Typography>
              <Typography>
                {rideDetails.within_time} ({rideDetails.within_distance}Km)
              </Typography>
              <Typography>
                <strong>{rideDetails.going_to}</strong>
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', ml: 3, mr: 3, position: 'relative' }}>
              {/* Circle 1 */}
              <Typography>
                <FaCircle />
              </Typography>

              {/* Line */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '39%',
                  left: 0,
                  right: 0,
                  height: '2px',
                  backgroundColor: 'black',
                  zIndex: 0,
                }}
              ></Box>

              {/* Circle 2 */}
              <Typography>
                <FaCircle />
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, ml: 3, mr: 3, position: 'relative' }}>
              <Typography sx={{ fontWeight: 700 }}>{calculateStartAndEndTime(rideDetails.date_time, rideDetails.within_time).startTime}</Typography>
              <Typography sx={{ fontWeight: 700 }}>{calculateStartAndEndTime(rideDetails.date_time, rideDetails.within_time).endTime}</Typography>
            </Box>
            {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, ml: 1, mr: 1, position: 'relative' }}>
              <Typography sx={{ fontWeight: 400 }}>10 miles from your departure</Typography>
              <Typography sx={{ fontWeight: 400 }}>21 miles away from you arrival</Typography>
            </Box> */}

            {/* Driver and Trip Info */}
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{ mr: 2 }}
                      src={`${process.env.REACT_APP_BASE_URL}/${rideDetails.avatar}`}
                    >
                      {rideDetails?.driver_name?.[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="body1">
                        <strong>{rideDetails.driver_name}</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        4.5/5 Rating
                      </Typography>
                    </Box>
                  </Box>
                  <NavLink to={'/Messages'}>
                    <IconButton color="primary">
                      <ChatIcon />
                    </IconButton>
                  </NavLink>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <DirectionsCarIcon sx={{ mr: 1, color: 'gray' }} />
                  <Typography variant="body2">
                    {rideDetails.vehicle_name} (2016, {rideDetails.vehicle_color}) - ${rideDetails.price_per_seat} / Person
                  </Typography>
                </Box>

                {/* Other Passengers */}
                <Box>
                  <Typography variant="body2">
                    Other passengers:
                    <strong> John Cena, Michael J</strong>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
          {/* Seat Picker */}
          <Box sx={{ width: "30%" }}>
            <Box sx={{ m: 3, background: "#fff", borderRadius: "10px", p: 2, textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                Car Seat Picker
              </Typography>
              <Box
                sx={{
                  background: "#dbb16459",
                  borderRadius: "10px",
                  p: "8px 16px",
                }}
              >
                <Box
                  sx={{
                    background: "#FFF",
                    p: 2,
                    border: "1px solid black",
                    borderRadius: "10px",
                    margin: "auto",
                    width: "60%",
                    display: "flex",
                    flexWrap: "wrap", // Wrap items into rows
                    justifyContent: "space-between", // Space between columns
                    gap: 2, // Adjust spacing between items
                  }}
                >
                  {/* Fixed Button */}
                  <Button
                    variant="contained"
                    sx={{
                      textTransform: "capitalize",
                      fontSize: "0.9rem",
                      width: "30%",
                      height: "50px",
                      bgcolor: "#dbb16459",
                      color: "black",
                    }}
                  >
                    <FaCircle />
                  </Button>

                  {/* Iterative Buttons */}
                  {availableSeats.map((seat, index) => (
                    <Button
                      key={index}
                      onClick={() => toggleSeatSelection(seat)}
                      variant={selectedSeats.includes(seat) ? "contained" : "outlined"}
                      sx={{
                        textTransform: "capitalize",
                        fontSize: "0.9rem",
                        width: "40%", // Two columns layout
                        height: "50px",
                        bgcolor: selectedSeats.includes(seat) ? "orange" : "#dbb16459",
                        color: selectedSeats.includes(seat) ? "white" : "black",
                      }}
                    >

                    </Button>
                  ))}
                </Box>
              </Box>

              <Typography variant="body2" sx={{ mt: 1 }}>
                You selected: {selectedSeats.join(', ')}
              </Typography>
              <Button
                variant="contained"
                sx={{ py: 1.5, fontSize: '1rem', textTransform: 'none', background: "orange", mt: 2, mb: 2 }}
              >
                Clear Selection
              </Button>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ color: "#dbb16459" }}><FaSquare /> <span style={{ color: "black" }}>Available</span></Typography>
                <Typography sx={{ color: "orange" }}><FaSquare /> <span style={{ color: "black" }}>Selected</span></Typography>
                <Typography sx={{ color: "grey" }}><FaSquare /> <span style={{ color: "black" }}>Blocked</span></Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Make Reservation Button */}
        <Box>
          {isLoading ? <CircularProgress /> :
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: 1.5, fontSize: '1rem', textTransform: 'none' }}
              onClick={handleMakeReservation}
            >
              Make Reservation
            </Button>}
        </Box>
      </Box>
    </Box>
  );
};

export default CarpoolBooking;
