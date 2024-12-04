import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const CarpoolBooking = () => {
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
    <Box sx={{ padding: 3, maxWidth: 800, margin: 'auto', fontFamily: 'Roboto' }}>
      {/* Header */}
      <Typography variant="h6" gutterBottom>
        17 Oct 2024
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography>
          <strong>San Francisco</strong> → <strong>Los Angeles</strong>
        </Typography>
        <Typography>5h 53m (381 miles)</Typography>
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

      {/* Seat Picker */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Car Seat Picker
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
          {availableSeats.map((seat, index) => (
            <Button
              key={index}
              onClick={() => toggleSeatSelection(seat)}
              variant={selectedSeats.includes(seat) ? 'contained' : 'outlined'}
              sx={{
                textTransform: 'capitalize',
                fontSize: '0.9rem',
                p: 1,
                bgcolor: selectedSeats.includes(seat) ? 'orange' : 'white',
                color: selectedSeats.includes(seat) ? 'white' : 'black',
              }}
            >
              {seat}
            </Button>
          ))}
        </Box>
        <Typography variant="body2" sx={{ mt: 1 }}>
          You selected: {selectedSeats.join(', ')}
        </Typography>
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
