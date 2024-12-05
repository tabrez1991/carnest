import React, { useState } from "react";
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const DateTimeInput = (props) => {
  const { serverError, id, name, handleDateTime } = props
  const [selectedDateTime, setSelectedDateTime] = useState(null);

  const handleDateTimeChange = (newValue) => {
    setSelectedDateTime(newValue);
    handleDateTime(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        sx={{ width: '100%' }}
        label="Select Date & Time"
        value={selectedDateTime}
        onChange={handleDateTimeChange}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            required
            id={id}
            name={name}
            variant="outlined"
            margin="normal"
            error={Boolean(serverError?.dateTime)}
            helperText={serverError?.dateTime ? serverError.dateTime[0] : ""}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default DateTimeInput;
