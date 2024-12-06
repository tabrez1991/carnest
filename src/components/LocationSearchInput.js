import { MenuItem, TextField } from '@mui/material';
import React, { useState } from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

const LocationSearchInput = (props) => {
  const { id, name, label, handleLatLng, handleAddress } = props
  const [address, setAddress] = useState('');

  const handleChange = (newAddress) => {
    setAddress(newAddress);
  };

  const handleSelect = (selectedAddress) => {
    setAddress(selectedAddress);
    handleAddress(selectedAddress);
    geocodeByAddress(selectedAddress)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => handleLatLng(latLng, name))
      .catch((error) => console.error('Error', error));
  };

  return (
    <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div style={{ position: 'relative' }}>
          <TextField
            fullWidth
            required
            id={id}
            name={name}
            label={label}
            variant="outlined"
            margin="normal"
            {...getInputProps({
              // placeholder: 'Search Places ...',
              className: 'location-search-input',
            })}
          />
          <div className="autocomplete-dropdown-container" style={{
            position: "absolute",
            zIndex: 1000,
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            maxHeight: "200px",
            overflowY: "auto",
            maxWidth: "396px"
          }}>
            {loading && <MenuItem>Loading...</MenuItem>}
            {suggestions.map((suggestion) => {
              const className = suggestion.active
                ? 'suggestion-item--active'
                : 'suggestion-item';
              const style = suggestion.active
                ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                : { backgroundColor: '#ffffff', cursor: 'pointer' };
              return (
                <MenuItem
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style,
                  })}
                  sx={{
                    whiteSpace: "break-spaces",
                    textAlign: "left"
                  }}
                >
                  <span>{suggestion.description}</span>
                </MenuItem>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
};

export default LocationSearchInput;