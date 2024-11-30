import React, { useState } from "react";
import { useTheme } from '@mui/system';
import { Alert, Box, Button, CircularProgress, MenuItem, Select, TextField, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';

const PostRide = () => {
	const theme = useTheme();

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
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handlePostRide = async (e) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		const actualData = {
			goingFrom: data.get('goingFrom'),
			goingFromWithinDistance: data.get('goingFromWithinDistance'),
			goingTo: data.get('goingTo'),
			goingToWithinDistance: data.get('goingToWithinDistance'),
			dateTime: data.get('dateTime'),
			pricePerSeat: data.get('pricePerSeat'),
			availableNoOfSeats: data.get('availableNoOfSeats'),
			vehicle: data.get('vehicle'),
			rideDescription: data.get('rideDescription'),
		};

		// const res = await searchRides(actualData);
		console.log(actualData)
		// if (res.error) {
		//   setServerError(res.error.data.errors);
		// } else if (res.data) {
		//   storeToken(res.data.token);
		//   let {access_token} = getToken()
		//   dispatch(setUserToken({access_token:access_token}))
		//   navigate('/search');
		// }

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
							<MenuItem value="Lamborghini">Lamborghini</MenuItem>
							<MenuItem value="Rolls Royce">Rolls Royce</MenuItem>
							<MenuItem value="Mercedes">Mercedes</MenuItem>
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