import React, { useState } from "react";
import { Alert, Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useTheme } from '@mui/system';
import AvailableRides from "../components/AvailableRides";
import MakeReservation from "../components/MakeReservation";
import { useSearchRidesMutation } from "../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import { setAvailableSeats } from "../features/apiSlice";
import LocationSearchInput from "../components/LocationSearchInput";

const Search = () => {
	const theme = useTheme();

	const [formData, setFormData] = useState({
		going_from: "",
		going_from_lat: "",
		going_from_lng: "",
		going_to: "",
		going_to_lat: "",
		going_to_lng: "",
		date: "",
		seats: "",
		range_in_km: "",
	});
	const [serverError, setServerError] = useState('');
	const [validationErrors, setValidationErrors] = useState({});
	const [showSearch, setShowSearch] = useState(true);
	const [showAvailable, setShowAvailable] = useState(false);
	const [showMakeReservation, setShowMakeReservation] = useState(false);
	const [rideBookId, setRideBookId] = useState("");

	const dispatch = useDispatch();

	const { access_token } = useSelector((state) => state.auth);
	const [searchRides, { isLoading }] = useSearchRidesMutation();

	const validateForm = () => {
		const errors = {};
		if (!formData.going_from) errors.going_from = "From location is required.";
		if (!formData.going_to) errors.going_to = "Going to location is required.";
		if (!formData.date) errors.date = "Date is required.";
		if (!formData.seats) errors.seats = "Number of passengers is required.";
		if (!formData.range_in_km) errors.range_in_km = "Range in km is required.";
		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleBook = (id) => {
		setRideBookId(id);
		setShowSearch(false);
		setShowAvailable(false);
		setShowMakeReservation(true);
	}

	const handleBack = (path) => {
		console.log(path)
		if (path === 'available') {
			setShowSearch(true);
			setShowAvailable(false);
			setShowMakeReservation(false);
		} else {
			setShowSearch(false);
			setShowAvailable(true);
			setShowMakeReservation(false);
		}
	}

	const handleSearch = async (e) => {
		e.preventDefault();

		if (!validateForm()) return;

		const actualData = {
			going_from_lat: formData.going_from_lat,
			going_from_lng: formData.going_from_lng,
			going_to_lat: formData.going_to_lat,
			going_to_lng: formData.going_to_lng,
			date: formData.date,
			seats: formData.seats,
			range_in_km: formData.range_in_km,
			token: access_token
		};

		const res = await searchRides(actualData);
		if (res.error) {
			setServerError(res.error.data.message);
		} else if (res.data) {
			const { data } = res;
			dispatch(setAvailableSeats({ data }));
			setShowSearch(false);
			setShowAvailable(true);
			setShowMakeReservation(false);
		}
	};

	const handleLatLng = (e, name) => {
		if (name === 'from') {
			setFormData((prev) => ({ ...prev, going_from_lat: e.lat, going_from_lng: e.lng }));
		} else if (name === 'goingTo') {
			setFormData((prev) => ({ ...prev, going_to_lat: e.lat, going_to_lng: e.lng }));
		}
	};

	const handleAddress = (e, name) => {
		if (name === 'from') {
			setFormData((prev) => ({ ...prev, going_from: e }));
		} else if (name === 'goingTo') {
			setFormData((prev) => ({ ...prev, going_to: e }));
		}
	};

	return (
		<Box
			sx={{
				height: '90vh',
				backgroundColor: '#f0f2f5',
				padding: theme.spacing(2),
			}}
		>
			{showAvailable && <AvailableRides handleBook={handleBook} handleBack={handleBack} />}
			{showMakeReservation && <MakeReservation handleBack={handleBack} rideBookId={rideBookId} />}
			{showSearch && (
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						height: '100%',
						backgroundColor: '#f0f2f5',
						padding: theme.spacing(2),
					}}
				>
					<Box
						sx={{
							width: '100%',
							maxWidth: 460,
							padding: theme.spacing(4),
							borderRadius: '8px',
							backgroundColor: '#FFFFFF',
							boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
							textAlign: 'center',
						}}
						component="form"
						noValidate
						id="search-form"
						onSubmit={handleSearch}
					>
						<Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
							Search for a ride
						</Typography>
						<LocationSearchInput
							id="from"
							name="from"
							label="From"
							error={validationErrors.going_from}
							value={formData.going_from}
							handleLatLng={handleLatLng}
							handleAddress={handleAddress}
						/>
						<LocationSearchInput
							id="goingTo"
							name="goingTo"
							label="Going To"
							error={validationErrors.going_to}
							value={formData.going_to}
							handleLatLng={handleLatLng}
							handleAddress={handleAddress}
						/>
						<TextField
							fullWidth
							required
							id="date"
							name="date"
							type="date"
							data-testid="date-input"
							value={formData.date}
							error={validationErrors.date}
							variant="outlined"
							margin="normal"
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, date: e.target.value }))
							}
						/>
						<TextField
							fullWidth
							required
							id="noOfPassengers"
							name="noOfPassengers"
							label="No of passengers"
							variant="outlined"
							margin="normal"
							error={validationErrors.seats}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, seats: e.target.value }))
							}
						/>
						<TextField
							fullWidth
							required
							id="rangeInkms"
							name="rangeInkms"
							label="Range in km"
							variant="outlined"
							margin="normal"
							error={validationErrors.range_in_km}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, range_in_km: e.target.value }))
							}
						/>
						<Box>
							{isLoading ? (
								<CircularProgress />
							) : (
								<Button
									type="submit"
									variant="contained"
									fullWidth
									sx={{
										backgroundColor: '#FF6436',
										color: 'white',
										marginTop: theme.spacing(2),
										marginBottom: theme.spacing(1),
										'&:hover': {
											backgroundColor: '#36a420',
										},
										textTransform: 'none',
									}}
								>
									Search
								</Button>
							)}
						</Box>

						{serverError && <Alert severity="error">{serverError}</Alert>}
					</Box>
				</Box>
			)}
		</Box>
	);
};

export default Search;
