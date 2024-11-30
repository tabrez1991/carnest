import React, { useState } from "react";
import { Alert, Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useTheme } from '@mui/system';
import AvailableRides from "../components/AvailableRides";
import MakeReservation from "../components/MakeReservation";


const Search = () => {
	const theme = useTheme();

	const [serverError, setServerError] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [showSearch, setShowSearch] = useState(true);
	const [showAvailable, setShowAvailable] = useState(false);
	const [showMakeReservation, setShowMakeReservation] = useState(false);

	const handleSearch = async (e) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		const actualData = {
			from: data.get('from'),
			goingTo: data.get('goingTo'),
			date: data.get('date'),
			noOfPassengers: data.get('noOfPassengers'),
		};

		// const res = await searchRides(actualData);
		console.log(actualData)
		setShowSearch(false);
		setShowAvailable(true)
		setShowMakeReservation(false);
		// if (res.error) {
		//   setServerError(res.error.data.errors);
		// } else if (res.data) {
		//   storeToken(res.data.token);
		//   let {access_token} = getToken()
		//   dispatch(setUserToken({access_token:access_token}))
		//   navigate('/search');
		// }

	}

	const handleBook = () => {
		setShowSearch(false);
		setShowAvailable(false);
		setShowMakeReservation(true);
	}

	return (
		<Box sx={{
			height: '90vh',
			backgroundColor: '#f0f2f5',
			padding: theme.spacing(2),
		}}>
			{showAvailable && <AvailableRides handleBook={handleBook} />}
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
						error={Boolean(serverError.from)}
						helperText={serverError.from ? serverError.from[0] : ''}
					/>
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
					<TextField
						fullWidth
						required
						id="date"
						name="date"
						type='date'
						label="Date"
						variant="outlined"
						margin="normal"
						error={Boolean(serverError.date)}
						helperText={serverError.date ? serverError.date[0] : ''}
					/>
					<TextField
						fullWidth
						required
						id="noOfPassengers"
						name="noOfPassengers"
						label="No of passengers"
						variant="outlined"
						margin="normal"
						error={Boolean(serverError.noOfPassengers)}
						helperText={serverError.noOfPassengers ? serverError.noOfPassengers[0] : ''}
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

					{serverError.non_field_errors ? <Alert severity='error'>{serverError.non_field_errors[0]}</Alert> : ''}
				</Box>
			</Box>}
		</Box>)
};

export default Search;