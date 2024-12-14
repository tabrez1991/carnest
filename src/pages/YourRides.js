import React, { useState, useEffect } from "react";
import {
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Typography,
	Box,
	Button,
	TableSortLabel,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Tab,
	Tabs,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import ViewRide from "../components/ViewRide";
import { useCancelRideMutation, useGetBookedRidesMutation } from "../services/apiService";
import { setBookedRides, setPostedRides } from "../features/apiSlice";

const YourRides = () => {
	const dispatch = useDispatch();
	const { access_token } = useSelector((state) => state.auth);
	const { bookedRides, postedRides } = useSelector((state) => state.apiSlice);

	const [getBookedRides] = useGetBookedRidesMutation();
	const [cancelRide] = useCancelRideMutation();

	const today = new Date();
	const formatDate = (date) => new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "short", year: "numeric" }).format(date);

	// Tab state
	const [tabValue, setTabValue] = useState(0);

	// States for rides
	const [bookedData, setBookedData] = useState({ upcoming: [], past: [] });
	const [postedData, setPostedData] = useState({ upcoming: [], past: [] });

	// Sort states
	const [bookedSortConfig, setBookedSortConfig] = useState({ column: "date", direction: "asc" });
	const [postedSortConfig, setPostedSortConfig] = useState({ column: "date", direction: "asc" });

	// Modal states
	const [viewRide, setViewRide] = useState(null);
	const [isViewRide, setIsViewRide] = useState(false);
	const [rideToCancel, setRideToCancel] = useState(null);
	const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);

	// Fetch booked rides
	const getBookedRideList = async () => {
		try {
			const res = await getBookedRides(access_token);
			if (res.data) dispatch(setBookedRides({ data: res.data }));
		} catch (error) {
			console.error(error);
		}
	};

	// Handle sorting logic
	const handleSort = (type, column, rides, setRides, sortConfig, setSortConfig) => {
		const newDirection = sortConfig.column === column && sortConfig.direction === "asc" ? "desc" : "asc";
		const sortedData = [...rides].sort((a, b) => {
			if (column === "date") {
				return newDirection === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
			} else if (column === "used") {
				return newDirection === "asc" ? a[column] - b[column] : b[column] - a[column];
			}
			return newDirection === "asc" ? a[column].localeCompare(b[column]) : b[column].localeCompare(a[column]);
		});
		setSortConfig({ column, direction: newDirection });
		setRides(sortedData);
	};

	const handleCancelConfirm = async () => {
		if (rideToCancel) {
			try {
				const res = await cancelRide({ id: rideToCancel.id, access_token });
				if (res.error) {
					console.error(res.error.data.errors);
					return;
				} else if (res.data) {
					getBookedRideList();
				}
			} catch (error) {
				console.error(error);
			} finally {
				setCancelConfirmOpen(false);
				setRideToCancel(null);
			}
		}
	};

	const openCancelConfirm = (ride) => {
		setRideToCancel(ride);
		setCancelConfirmOpen(true);
	};


	// Categorize rides into upcoming and past
	const categorizeRides = (rides, setState) => {
		const upcoming = [];
		const past = [];
		rides.forEach((ride) => {
			const rideDate = new Date(ride.ride_date);
			const rideInfo = {
				date: formatDate(rideDate),
				from: ride.going_from,
				to: ride.going_to,
				rideBy: ride.driver_name,
				used: ride.used || false,
				...ride,
			};
			rideDate >= today ? upcoming.push(rideInfo) : past.push(rideInfo);
		});
		setState({ upcoming, past });
	};

	const handleVeiwRide = (ride) => {
		setViewRide(ride);
		setIsViewRide(true);
	};

	const handleCloseViewRide = () => {
		setViewRide(null);
		setIsViewRide(false);
	};

	useEffect(() => {
		getBookedRideList();
	}, []);

	useEffect(() => categorizeRides(bookedRides, setBookedData), [bookedRides]);
	useEffect(() => categorizeRides(postedRides, setPostedData), [postedRides]);

	const renderTable = (title, rides, sortConfig, setSortConfig, type) => (
		<>
			<Typography variant="h6" sx={{ fontWeight: 700, mb: 2, }}>
				{title}
			</Typography>
			<Box sx={{ overflowX: "auto" }}>
				<Table>
					<TableHead>
						<TableRow>
							{["Date", "From", "To", "Ride by", "Used"].map((col) => (
								<TableCell key={col}>
									<TableSortLabel
										active={sortConfig.column === col.toLowerCase()}
										direction={sortConfig.column === col.toLowerCase() ? sortConfig.direction : "asc"}
										onClick={() => handleSort(type, col.toLowerCase(), rides, setSortConfig, sortConfig)}
									>
										{col}
									</TableSortLabel>
								</TableCell>
							))}
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rides.map((ride, index) => (
							<TableRow key={index}>
								<TableCell>{ride.date}</TableCell>
								<TableCell>{ride.from}</TableCell>
								<TableCell>{ride.to}</TableCell>
								<TableCell>{ride.rideBy}</TableCell>
								<TableCell>{ride.used ? "Yes" : "No"}</TableCell>
								<TableCell>
									<Button
										sx={{ color: "orange", textTransform: "none", fontWeight: 700 }}
										onClick={() => handleVeiwRide(ride)}
									>
										View Ride
									</Button>
									{type === "booked" && ride.status !== "Cancelled" && new Date(ride.ride_date) >= today && (
										<Button
											sx={{ color: "red", textTransform: "none", fontWeight: 700 }}
											onClick={() => openCancelConfirm(ride)}
										>
											Cancel
										</Button>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Box>
		</>
	);

	return (
		<Box sx={{ padding: 2 }}>
			{/* Tabs */}
			<Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
				<Tab label="Booked Rides" />
				<Tab label="Posted Rides" />
			</Tabs>

			{/* Cancel Confirmation */}
			<Dialog open={cancelConfirmOpen} onClose={() => setCancelConfirmOpen(false)}>
				<DialogTitle>Confirm Cancellation</DialogTitle>
				<DialogContent>Are you sure you want to cancel this ride?</DialogContent>
				<DialogActions>
					<Button onClick={() => setCancelConfirmOpen(false)}>No</Button>
					<Button color="error" onClick={() => handleCancelConfirm()}>Yes</Button>
				</DialogActions>
			</Dialog>

			{/* Content based on tab */}
			{tabValue === 0 && (
				<>
					{renderTable("Booked Upcoming Rides", bookedData.upcoming, bookedSortConfig, setBookedSortConfig, "booked")}
					{renderTable("Booked Past Rides", bookedData.past, bookedSortConfig, setBookedSortConfig, "booked")}
				</>
			)}

			{tabValue === 1 && (
				<>
					{renderTable("Posted Upcoming Rides", postedData.upcoming, postedSortConfig, setPostedSortConfig, "posted")}
					{renderTable("Posted Past Rides", postedData.past, postedSortConfig, setPostedSortConfig, "posted")}
				</>
			)}

			{/* View Ride Modal */}
			{isViewRide && <ViewRide ride={viewRide} handleCloseModal={() => setIsViewRide(false)} />}
		</Box>
	);
};

export default YourRides;
