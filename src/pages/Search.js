import React, { useState } from "react";
import { Alert, Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useTheme } from '@mui/system';
import AvailableRides from "../components/AvailableRides";
import MakeReservation from "../components/MakeReservation";
import { useSearchRidesMutation } from "../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import { setAvailableSeats } from "../features/apiSlice";


const Search = () => {
	const theme = useTheme();

	const [serverError, setServerError] = useState('');
	const [showSearch, setShowSearch] = useState(true);
	const [showAvailable, setShowAvailable] = useState(false);
	const [showMakeReservation, setShowMakeReservation] = useState(false);

	const dispatch = useDispatch()

	const { access_token } = useSelector((state) => state.auth);
	const [searchRides, { isLoading }] = useSearchRidesMutation();

	const handleSearch = async (e) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		const actualData = {
			from: data.get('from'),
			to: data.get('goingTo'),
			date: data.get('date'),
			seats: data.get('noOfPassengers'),
			token: access_token
		};

		const res = await searchRides(actualData);
		console.log(res)
		if (res.error) {
			setServerError(res.error.data.message);
		} else if (res.data) {
			const { data } = res
			dispatch(setAvailableSeats({ data }));
			setShowSearch(false);
			setShowAvailable(true)
			setShowMakeReservation(false);
		}

	}

	const handleBook = () => {
		setShowSearch(false);
		setShowAvailable(false);
		setShowMakeReservation(true);
	}

	const handleBack = (path) => {
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

	return (
		<Box sx={{
			height: '90vh',
			backgroundColor: '#f0f2f5',
			padding: theme.spacing(2),
		}}>
			{showAvailable && <AvailableRides handleBook={handleBook} handleBack={handleBack} />}
			{showMakeReservation && <MakeReservation />}
			{showSearch && <Box
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
					id="login-form"
					onSubmit={handleSearch}
				>
					<Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
						Search for a ride
					</Typography>
					<TextField
						fullWidth
						required
						id="from"
						name="from"
						label="From"
						variant="outlined"
						margin="normal"
					/>
					<TextField
						fullWidth
						required
						id="goingTo"
						name="goingTo"
						label="Going To"
						variant="outlined"
						margin="normal"
					/>
					<TextField
						fullWidth
						required
						id="date"
						name="date"
						type='date'
						label="Date"
						variant="outlined"
						margin="normal"

					/>
					<TextField
						fullWidth
						required
						id="noOfPassengers"
						name="noOfPassengers"
						label="No of passengers"
						variant="outlined"
						margin="normal"
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
							Search
						</Button>}
					</Box>

					{serverError && <Alert severity='error'>{serverError}</Alert>}
				</Box>
			</Box>}
		</Box>)
};

export default Search;