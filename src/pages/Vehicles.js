import React, { useState } from "react";
import {
	Typography,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TextField,
	Box,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useTheme } from '@mui/system';
import { useDispatch, useSelector } from "react-redux";
import { useCreateVehicleMutation } from "../services/apiService";

const Vehicles = () => {
	const theme = useTheme();

	const [vehicles, setVehicles] = useState([]);
	const [newVehicle, setNewVehicle] = useState({
		make: "",
		model: "",
		plateNo: "",
		year: "",
		color: "",
	});

	const { access_token, profile } = useSelector((state) => state.auth);
	const { vehiclesList } = useSelector((state) => state.apiSlice || { vehiclesList: [] });
	const [createVehicle, { isLoading }] = useCreateVehicleMutation();

	console.log(vehiclesList)
	const dispatch = useDispatch();

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewVehicle({ ...newVehicle, [name]: value });
	};

	const handleAddVehicle = async () => {
		try {
			const actualData = {
				owner: profile?.id,
				make: newVehicle?.make,
				model: newVehicle.model,
				year: newVehicle.year,
				plate_number: newVehicle.plateNo,
				color: newVehicle.color,
				number_of_seats: 2
			}

			const res = await createVehicle({ actualData, access_token })
			if (res.error) {
				console.error(res.error.data.errors); // Display login error
				return; // Exit early on error
			}
		} catch (error) {
			console.error(error)
		}
		setNewVehicle({ make: "", model: "", plateNo: "", year: "", color: "" });
	};

	const handleDeleteVehicle = (index) => {
		const updatedVehicles = vehicles.filter((_, i) => i !== index);
		setVehicles(updatedVehicles);
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
				overflowY: 'scroll',
				pt: 8
			}}
		>
			{/* Main Content */}
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
			>
				<Typography variant="h4" align="center" sx={{ p: 2, fontWeight: "bold", color: "#FF6436" }} gutterBottom>
					Vehicles
				</Typography>

				{/* Vehicle Table */}
				<TableContainer component={Paper} sx={{ marginBottom: 4 }}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell><strong>Make</strong></TableCell>
								<TableCell><strong>Model</strong></TableCell>
								<TableCell><strong>Plate No.</strong></TableCell>
								<TableCell><strong>Year</strong></TableCell>
								<TableCell><strong>Color</strong></TableCell>
								<TableCell><strong>Actions</strong></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{vehiclesList.map((vehicle, index) => (
								<TableRow key={index}>
									<TableCell>{vehicle.make}</TableCell>
									<TableCell>{vehicle.model}</TableCell>
									<TableCell>{vehicle.plate_number}</TableCell>
									<TableCell>{vehicle.year}</TableCell>
									<TableCell>{vehicle.color}</TableCell>
									<TableCell sx={{ display: "flex" }}>
										<Button
											color="primary"
											onClick={() => handleDeleteVehicle(index)}
										>
											Edit
										</Button>
										<Button
											color="error"
											onClick={() => handleDeleteVehicle(index)}
										>
											Delete
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>

				{/* Add New Vehicle Form */}
				<Paper elevation={3} sx={{ padding: 3 }}>
					<Typography variant="h6" sx={{ fontWeight: 700, textAlign: "left" }} gutterBottom>
						Add New Vehicle
					</Typography>
					<Grid container spacing={2}>
						<Grid size={6}>
							<TextField
								label="Make"
								name="make"
								value={newVehicle.make}
								onChange={handleInputChange}
								fullWidth
								margin="normal"
							/>
						</Grid>
						<Grid size={6}>
							<TextField
								label="Model"
								name="model"
								value={newVehicle.model}
								onChange={handleInputChange}
								fullWidth
								margin="normal"
							/>
						</Grid>
					</Grid>
					<Grid container spacing={2}>
						<Grid size={6}>
							<TextField
								label="Plate No."
								name="plateNo"
								value={newVehicle.plateNo}
								onChange={handleInputChange}
								fullWidth
								margin="normal"
							/>
						</Grid>
						<Grid size={6}>
							<TextField
								label="State"
								name="state"
								value={newVehicle.state}
								onChange={handleInputChange}
								fullWidth
								margin="normal"
							/>
						</Grid>
					</Grid>
					<Grid container spacing={2}>
						<Grid size={6}>
							<TextField
								label="Year"
								name="year"
								value={newVehicle.year}
								onChange={handleInputChange}
								fullWidth
								margin="normal"
							/>
						</Grid>
						<Grid size={6}>
							<TextField
								label="Color"
								name="color"
								value={newVehicle.color}
								onChange={handleInputChange}
								fullWidth
								margin="normal"
							/>
						</Grid>
					</Grid>
					<Button
						variant="contained"
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
						fullWidth
						onClick={handleAddVehicle}
					>
						Add Vehicle
					</Button>
				</Paper>
			</Box>
		</Box>
	);
};

export default Vehicles;
