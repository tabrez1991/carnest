import React, { useState } from "react";
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Box,
	TextField,
	Paper,
	Avatar,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useTheme } from '@mui/system';
import { useSelector } from "react-redux";

const UserProfile = () => {
	const theme = useTheme();
	const { profile } = useSelector((state) => state.auth);

	const [user, setUser] = useState({
		firstName: profile?.first_name,
		lastName: profile?.last_name,
		email: profile?.email,
		phone: profile?.phone_number,
		address: profile?.address,
		idType: profile?.idType,
		idNumber: profile?.idNumber,
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setUser({ ...user, [name]: value });
	};

	const handleSaveChanges = () => {
		console.log("User Data Saved:", user);
		alert("Changes saved successfully!");
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
			{/* Profile Form */}
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
				<Typography variant="h4" sx={{fontWeight: "bold", color: "#FF6436" }} align="center" gutterBottom>
					User Profile
				</Typography>
				<Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
					<Avatar sx={{ width: 100, height: 100 }}>{user?.firstName?.split('')[0]}</Avatar>
				</Box>
				<Grid container spacing={2}>
					<Grid size={6}>
						<TextField
							label="First Name"
							name="firstName"
							value={user.firstName}
							onChange={handleInputChange}
							fullWidth
							margin="normal"
						/>
					</Grid>
					<Grid size={6}>
						<TextField
							label="Last Name"
							name="lastName"
							value={user.lastName}
							onChange={handleInputChange}
							fullWidth
							margin="normal"
						/>
					</Grid>
				</Grid>
				<TextField
					label="Email Address"
					name="email"
					value={user.email}
					onChange={handleInputChange}
					type="email"
					fullWidth
					margin="normal"
				/>
				<TextField
					label="Phone Number"
					name="phone"
					value={user.phone}
					onChange={handleInputChange}
					fullWidth
					margin="normal"
				/>
				<TextField
					label="Address"
					name="address"
					value={user.address}
					onChange={handleInputChange}
					fullWidth
					margin="normal"
				/>
				<Grid container spacing={2}>
					<Grid size={6}>
						<TextField
							label="Government ID Type"
							name="idType"
							value={user.idType}
							onChange={handleInputChange}
							fullWidth
							margin="normal"
						/>
					</Grid>
					<Grid size={6}>
						<TextField
							label="Government ID Number"
							name="idNumber"
							value={user.idNumber}
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
					onClick={handleSaveChanges}
				>
					Save Changes
				</Button>
			</Box>
		</Box>
	);
};

export default UserProfile;
