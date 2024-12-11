import React, { useState } from "react";
import { useTheme } from '@mui/system';
import { Alert, Box, Button, CircularProgress, MenuItem, Select, Snackbar, TextField, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { usePostRideMutation } from "../services/apiService";
import { useSelector } from "react-redux";
import DateTimeInput from "../components/DateTimeInput";
import LocationSearchInput from "../components/LocationSearchInput";

const PostRide = () => {
	const theme = useTheme();

	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState("");
	const [formData, setFormData] = useState({
		goingFrom: "",
		goingFromLat: "",
		goingFromLng: "",
		goingTo: "",
		goingToLat: "",
		goingToLng: "",
		dateTime: "",
		pricePerSeat: "",
		availableNoOfSeats: "",
		vehicle: "",
		rideDescription: "",
		range_in_km: ""
	});
	const [serverError, setServerError] = useState({});

	const { access_token, profile } = useSelector((state) => state.auth);
	const { vehiclesList } = useSelector((state) => state.apiSlice || { vehiclesList: [] });
	const [postRide, { isLoading }] = usePostRideMutation();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpen(false);
	};

	const handlePostRide = async (e) => {
		e.preventDefault();
		console.log(formData)
		const actualData = {
			driver: profile?.id,
			going_from: formData.goingFrom,
			going_from_lat: formData.goingFromLat,
			going_from_lng: formData.goingFromLng,
			going_to: formData.goingTo,
			going_to_lat: formData.goingToLat,
			going_to_lng: formData.goingToLng,
			date_time: formData.dateTime,
			price_per_seat: formData.pricePerSeat,
			vehicle: formData.vehicle,
			ride_description: formData.rideDescription,
		};

		const res = await postRide({ actualData, access_token });
		console.log(res)
		if (res.error) {
			setServerError(res.error.data.errors);
		} else if (res.data) {
			setMessage("Ride post successfully")
			setOpen(true);
			setFormData({
				goingFrom: "",
				goingFromWithinDistance: "",
				goingTo: "",
				goingToWithinDistance: "",
				dateTime: "",
				pricePerSeat: "",
				availableNoOfSeats: "",
				vehicle: "",
				rideDescription: ""
			})
		}
	}

	const handleDateTime = (val) => {
		setFormData((prev) => ({ ...prev, dateTime: val }))
	}

	const handleLatLng = (e, name) => {
		if (name === "goingFrom") {
			setFormData((prev) => ({ ...prev, goingFromLat: e.lat, goingFromLng: e.lng }));
		} else if (name === "goingTo") {
			setFormData((prev) => ({ ...prev, goingToLat: e.lat, goingToLng: e.lng }));
		}
	};

	const handleAddress = (e, name) => {
		if (name === "goingFrom") {
			setFormData((prev) => ({ ...prev, goingFrom: e }));
		} else if (name === "goingTo") {
			setFormData((prev) => ({ ...prev, goingTo: e }));
		}
	};

	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				height: '100vh',
				backgroundColor: '#f0f2f5',
				padding: theme.spacing(2),
			}}
		>
			<Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={6000} onClose={handleClose}>
				<Alert
					onClose={handleClose}
					severity="success"
					variant="filled"
					sx={{ width: '100%' }}
				>
					{message}
				</Alert>
			</Snackbar>
			<Box
				sx={{
					width: '100%',
					maxWidth: 640,
					padding: theme.spacing(4),
					borderRadius: '8px',
					backgroundColor: '#FFFFFF',
					boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
					textAlign: 'center',
				}}
				component="form"
				noValidate
				id="login-form"
				onSubmit={handlePostRide}
			>
				<Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
					Create New Ride
				</Typography>
				<Grid container spacing={2}>
					<Grid size={6}>
						<LocationSearchInput id="goingFrom" name="goingFrom" label="Going From" value={formData.goingFrom} handleLatLng={handleLatLng} handleAddress={handleAddress} />
					</Grid>
					<Grid size={6}>
						<LocationSearchInput id="goingTo" name="goingTo" label="Going To" value={formData.goingTo} handleLatLng={handleLatLng} handleAddress={handleAddress} />
					</Grid>
				</Grid>
				{/* <Grid container spacing={2}>
					<Grid size={6}>
						<TextField
							fullWidth
							required
							id="goingTo"
							name="goingTo"
							label="Going To"
							variant="outlined"
							margin="normal"
							error={Boolean(serverError.goingTo)}
							helperText={serverError.goingTo ? serverError.goingTo[0] : ''}
						/>
					</Grid>
					<Grid size={6}>
						<TextField
							fullWidth
							id="goingToWithinDistance"
							name="goingToWithinDistance"
							label="Within Distance"
							variant="outlined"
							margin="normal"
							error={Boolean(serverError.goingToWithinDistance)}
							helperText={serverError.goingToWithinDistance ? serverError.goingToWithinDistance[0] : ''}
						/>
					</Grid>
				</Grid> */}
				<Grid container spacing={2}>
					<Grid size={6}>
						<Box sx={{ mt: 2, width: "100%" }}>
							<DateTimeInput
								id="dateTime"
								name="dateTime"
								value={formData.dateTime}
								handleDateTime={handleDateTime}
								serverError={Boolean(serverError.dateTime)}
								helperText={serverError.dateTime ? serverError.dateTime[0] : ''}
							/>
						</Box>
						{/* <TextField
							fullWidth
							required
							id="dateTime"
							name="dateTime"
							type='date'
							label="Select Date & Time"
							variant="outlined"
							margin="normal"
							error={Boolean(serverError.dateTime)}
							helperText={serverError.dateTime ? serverError.dateTime[0] : ''}
						/> */}
					</Grid>
					<Grid size={6}>
						<TextField
							fullWidth
							required
							value={formData.pricePerSeat}
							id="pricePerSeat"
							name="pricePerSeat"
							label="Price Per Seat"
							variant="outlined"
							margin="normal"
							onChange={(e) => setFormData((prev) => ({ ...prev, pricePerSeat: e.target.value }))}
							error={Boolean(serverError.pricePerSeat)}
							helperText={serverError.pricePerSeat ? serverError.pricePerSeat[0] : ''}
						/>
					</Grid>
				</Grid>
				<Grid container spacing={2}>
					{/* <Grid size={6}> */}
						{/* <TextField
							fullWidth
							required
							id="availableNoOfSeats"
							name="availableNoOfSeats"
							label="Available No. Seats"
							variant="outlined"
							margin="normal"
							value={formData.availableNoOfSeats}
							onChange={(e) => setFormData((prev) => ({ ...prev, availableNoOfSeats: e.target.value }))}
							error={Boolean(serverError.availableNoOfSeats)}
							helperText={serverError.availableNoOfSeats ? serverError.availableNoOfSeats[0] : ''}
						/> */}
					{/* </Grid> */}
					<Grid size={12}>
						<Select
							fullWidth
							required
							id="vehicle"
							name="vehicle"
							value={formData.vehicle}
							onChange={handleChange}
							displayEmpty
							sx={{ mt: 2, textAlign: "left" }}
							variant="outlined"
							error={Boolean(serverError.availableNoOfSeats)}
							helperText={serverError.availableNoOfSeats ? serverError.availableNoOfSeats[0] : ''}
						>
							<MenuItem value="" disabled>
								Select Vehicle
							</MenuItem>
							{vehiclesList?.map(item => (<MenuItem key={item.id} value={item.id}>{item.model}</MenuItem>))}
						</Select>
					</Grid>
				</Grid>
				{/* <TextField
					fullWidth
					required
					id="rangeInkms"
					name="rangeInkms"
					label="Range in km"
					variant="outlined"
					margin="normal"
					value={formData.range_in_km}
					error={Boolean(serverError.range_in_km)}
					helperText={serverError.rideDescription ? serverError.rideDescription[0] : ''}
					onChange={(e) =>
						setFormData((prev) => ({ ...prev, range_in_km: e.target.value }))
					}
				/> */}
				<TextField
					fullWidth
					multiline
					rows={5}
					required
					id="rideDescription"
					name="rideDescription"
					label="Ride Description"
					variant="outlined"
					margin="normal"
					value={formData.rideDescription}
					onChange={(e) => setFormData((prev) => ({ ...prev, rideDescription: e.target.value }))}
					error={Boolean(serverError.rideDescription)}
					helperText={serverError.rideDescription ? serverError.rideDescription[0] : ''}
				/>
				<Box>
					{isLoading ? <CircularProgress /> : <Button
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
							textTransform: "none"
						}}
					>
						Post Ride
					</Button>}
				</Box>

				{serverError.non_field_errors ? <Alert severity='error'>{serverError.non_field_errors[0]}</Alert> : ''}
			</Box>
		</Box>)
};

export default PostRide;