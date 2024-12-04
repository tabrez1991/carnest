import React, { useState } from "react";
import { useTheme } from '@mui/system';
import { Alert, Box, Button, CircularProgress, MenuItem, Select, Snackbar, TextField, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { usePostRideMutation } from "../services/apiService";
import { useSelector } from "react-redux";

const PostRide = () => {
	const theme = useTheme();

	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState("");
	const [formData, setFormData] = useState({
		goingFrom: "",
		goingFromWithinDistance: "",
		goingTo: "",
		goingToWithinDistance: "",
		dateTime: "",
		pricePerSeat: "",
		availableNoOfSeats: "",
		vehicle: "",
		rideDescription: ""
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
		const data = new FormData(e.currentTarget);
		const actualData = {
			driver: profile?.id,
			going_from: data.get('goingFrom'),
			// goingFromWithinDistance: data.get('goingFromWithinDistance'),
			going_to: data.get('goingTo'),
			// goingToWithinDistance: data.get('goingToWithinDistance'),
			date_time: data.get('dateTime'),
			price_per_seat: data.get('pricePerSeat'),
			// availableNoOfSeats: data.get('availableNoOfSeats'),
			vehicle: 1,
			ride_description: data.get('rideDescription'),
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
						<TextField
							fullWidth
							required
							id="goingFrom"
							name="goingFrom"
							label="Going From"
							variant="outlined"
							margin="normal"
							error={Boolean(serverError.goingFrom)}
							helperText={serverError.goingFrom ? serverError.goingFrom[0] : ''}
						/>
					</Grid>
					<Grid size={6}>
						<TextField
							fullWidth
							id="goingFromWithinDistance"
							name="goingFromWithinDistance"
							label="Within Distance"
							variant="outlined"
							margin="normal"
							error={Boolean(serverError.goingFromWithinDistance)}
							helperText={serverError.goingFromWithinDistance ? serverError.goingFromWithinDistance[0] : ''}
						/>
					</Grid>
				</Grid>
				<Grid container spacing={2}>
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
				</Grid>
				<Grid container spacing={2}>
					<Grid size={6}>
						<TextField
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
						/>
					</Grid>
					<Grid size={6}>
						<TextField
							fullWidth
							required
							id="pricePerSeat"
							name="pricePerSeat"
							label="Price Per Seat"
							variant="outlined"
							margin="normal"
							error={Boolean(serverError.pricePerSeat)}
							helperText={serverError.pricePerSeat ? serverError.pricePerSeat[0] : ''}
						/>
					</Grid>
				</Grid>
				<Grid container spacing={2}>
					<Grid size={6}>
						<TextField
							fullWidth
							required
							id="availableNoOfSeats"
							name="availableNoOfSeats"
							label="Available No. Seats"
							variant="outlined"
							margin="normal"
							error={Boolean(serverError.availableNoOfSeats)}
							helperText={serverError.availableNoOfSeats ? serverError.availableNoOfSeats[0] : ''}
						/>
					</Grid>
					<Grid size={6}>
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