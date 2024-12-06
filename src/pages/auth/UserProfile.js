import React, { useState } from "react";
import {
	Box,
	TextField,
	Avatar,
	Typography,
	Button,
	Snackbar,
	Alert,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useTheme } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import LocationSearchInput from "../../components/LocationSearchInput";
import { useUpdateUserProfileMutation } from "../../services/userAuthApi";
import { setProfile } from "../../features/authSlice";

const UserProfile = () => {
	const theme = useTheme();
	const { profile, access_token } = useSelector((state) => state.auth);

	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState("");
	const [severity, setSeverity] = useState("success")
	const [user, setUser] = useState({
		avatar: profile.avatar,
		firstName: profile?.first_name,
		lastName: profile?.last_name,
		email: profile?.email,
		phone: profile?.phone_number,
		address: profile?.address,
		addressLat: profile?.addressLat,
		addressLng: profile?.addressLng,
		idType: profile?.idType,
		idNumber: profile?.idNumber,
	});

	const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();

	const dispatch = useDispatch()

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setUser({ ...user, [name]: value });
	};

	const handleAvatarChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setUser((prev) => ({ ...prev, avatar: reader.result }));
			};
			reader.readAsDataURL(file);
		}
	};

	const handleLatLng = (e, name) => {
		if (name === "address") {
			setUser((prev) => ({ ...prev, addressLat: e.lat, addressLng: e.lng }));
		}
	};

	const handleAddress = (e, name) => {
		if (name === "address") {
			setUser((prev) => ({ ...prev, address: e }));
		}
	};

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpen(false);
	};

	const handleSaveChanges = async () => {
		console.log("User Data Saved:", user);
		const { id } = profile

		const res = await updateUserProfile({ actualData: user, access_token, user: id });
		console.log(res)
		if (res.error) {
			setMessage(res.error.data.errors);
			setOpen(true);
			setSeverity("error")
		} else if (res.data) {
			setMessage("Changes saved successfully!");
			setOpen(true);
			setSeverity("success")
			dispatch(setProfile({ profile: res.data }));
		}
	}

	return (
		<Box>
			<Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={6000} onClose={handleClose}>
				<Alert
					onClose={handleClose}
					severity={severity}
					variant="filled"
					sx={{ width: '100%' }}
				>
					{message}
				</Alert>
			</Snackbar>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					height: "100vh",
					backgroundColor: "#f0f2f5",
					padding: theme.spacing(2),
				}}
			>
				<Box
					sx={{
						width: "100%",
						maxWidth: 640,
						padding: theme.spacing(4),
						borderRadius: "8px",
						backgroundColor: "#FFFFFF",
						boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
						textAlign: "center",
					}}
				>
					<Typography
						variant="h4"
						sx={{ fontWeight: "bold", color: "#FF6436" }}
						align="center"
						gutterBottom
					>
						User Profile
					</Typography>
					<Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
						<label htmlFor="avatar-upload">
							<Avatar
								sx={{ width: 100, height: 100, cursor: "pointer" }}
								src={user.avatar}
							>
								{user?.firstName?.[0]}
							</Avatar>
						</label>
						<input
							id="avatar-upload"
							type="file"
							accept="image/*"
							style={{ display: "none" }}
							onChange={handleAvatarChange}
						/>
					</Box>
					<Grid container spacing={2}>
						<Grid item size={6} >
							<TextField
								label="First Name"
								name="firstName"
								value={user.firstName}
								onChange={handleInputChange}
								fullWidth
								margin="normal"
							/>
						</Grid>
						<Grid item size={6}>
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
					<LocationSearchInput
						id="address"
						name="address"
						label="Address"
						value={user.address}
						handleLatLng={handleLatLng}
						handleAddress={handleAddress}
					/>
					<Grid container spacing={2}>
						<Grid item size={6}>
							<TextField
								label="Government ID Type"
								name="idType"
								value={user.idType}
								onChange={handleInputChange}
								fullWidth
								margin="normal"
							/>
						</Grid>
						<Grid item size={6}>
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
							backgroundColor: "#FF6436",
							color: "white",
							marginTop: theme.spacing(2),
							marginBottom: theme.spacing(1),
							"&:hover": {
								backgroundColor: "#36a420",
							},
							textTransform: "none",
						}}
						fullWidth
						onClick={handleSaveChanges}
					>
						Save Changes
					</Button>
				</Box>
			</Box>
		</Box>
	);
};

export default UserProfile;
