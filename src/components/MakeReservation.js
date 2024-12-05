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
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { FaArrowLeft, FaCircle, FaSquare } from "react-icons/fa";

const CarpoolBooking = (props) => {
  const { handleBack } = props
  const [selectedSeats, setSelectedSeats] = useState(['front passenger', 'back right']);
  const availableSeats = ['front passenger', 'back left', 'back right'];

  const toggleSeatSelection = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else if (selectedSeats.length < 2) {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  return (
    <Box sx={{ padding: 3, width: "100%", margin: 'auto', fontFamily: 'Roboto' }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography onClick={() => handleBack('reservation')} sx={{ mr: 2 }}><FaArrowLeft style={{ marginRight: 5, cursor: "pointer" }} /></Typography>
        {/* Header */}
        <Typography variant="h6" gutterBottom>
          17 Oct 2024
        </Typography>
      </Box>
      <Box sx={{ display: "flex", width: "100%" }}>
        <Box sx={{ width: "70%" }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>
              <strong>San Francisco</strong>
            </Typography>
            <Typography>
              5h 53m (381 miles)
            </Typography>
            <Typography>
              <strong>Los Angeles</strong>
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', ml: 3, mr: 3, position: 'relative' }}>
            <Typography sx={{ fontWeight: 700 }}>5:00</Typography>
            <Typography sx={{ fontWeight: 700 }}>12:55</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, ml: 1, mr: 1, position: 'relative' }}>
            <Typography sx={{ fontWeight: 400 }}>10 miles from your departure</Typography>
            <Typography sx={{ fontWeight: 400 }}>21 miles away from you arrival</Typography>
          </Box>

          {/* Driver and Trip Info */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ mr: 2 }}>R</Avatar>
                  <Box>
                    <Typography variant="body1">
                      <strong>Robert Jr</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      4.5/5 Rating
                    </Typography>
                  </Box>
                </Box>
                <IconButton color="primary">
                  <ChatIcon />
                </IconButton>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DirectionsCarIcon sx={{ mr: 1, color: 'gray' }} />
                <Typography variant="body2">
                  Honda Civic (2016, White) - $50.00 / Person
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
                      width: "40%", // Ensure two columns
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
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ py: 1.5, fontSize: '1rem', textTransform: 'none' }}
      >
        Make Reservation
      </Button>
    </Box>
  );
};

export default CarpoolBooking;
