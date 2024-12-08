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
} from "@mui/material";
import { useSelector } from "react-redux";

const YourRides = () => {
	const { bookedRides } = useSelector((state) => state.apiSlice);

	const today = new Date();

	const formatDate = (date) => {
		const options = { day: "2-digit", month: "short", year: "numeric" };
		return new Intl.DateTimeFormat("en-US", options).format(date);
	};

	// State to store rides data
	const [ridesData, setRidesData] = useState({ upcoming: [], past: [] });

	// State to handle sorting configurations
	const [upcomingSortConfig, setUpcomingSortConfig] = useState({
		column: "date",
		direction: "asc",
	});
	const [pastSortConfig, setPastSortConfig] = useState({
		column: "date",
		direction: "asc",
	});

	// Separate sorted data for each table
	const [upcomingSortedData, setUpcomingSortedData] = useState([]);
	const [pastSortedData, setPastSortedData] = useState([]);

	// Classify and sort rides when `bookedRides` changes
	useEffect(() => {
		const upcoming = [];
		const past = [];

		bookedRides.forEach((ride) => {
			const rideDate = new Date(ride.created_at);
			const rideInfo = {
				date: formatDate(rideDate),
				from: ride.going_from, // Placeholder
				to: ride.going_to, // Placeholder
				rideBy: ride.driver_name, // Placeholder
			};

			if (rideDate >= today) {
				upcoming.push(rideInfo);
			} else {
				past.push(rideInfo);
			}
		});

		setRidesData({ upcoming, past });
		setUpcomingSortedData(upcoming);
		setPastSortedData(past);
	}, [bookedRides]);

	// Generic function to handle sorting
	const handleSort = (type, column) => {
		const isUpcoming = type === "upcoming";
		const sortConfig = isUpcoming ? upcomingSortConfig : pastSortConfig;
		const newDirection = sortConfig.column === column && sortConfig.direction === "asc" ? "desc" : "asc";

		const sortedData = [...(isUpcoming ? ridesData.upcoming : ridesData.past)].sort((a, b) => {
			if (column === "date") {
				const dateA = new Date(a[column]);
				const dateB = new Date(b[column]);
				return newDirection === "asc" ? dateA - dateB : dateB - dateA;
			} else {
				return newDirection === "asc"
					? a[column].localeCompare(b[column])
					: b[column].localeCompare(a[column]);
			}
		});

		if (isUpcoming) {
			setUpcomingSortConfig({ column, direction: newDirection });
			setUpcomingSortedData(sortedData);
		} else {
			setPastSortConfig({ column, direction: newDirection });
			setPastSortedData(sortedData);
		}
	};

	// Render a specific table
	const renderTable = (title, rides, sortConfig, onSort, type) => (
		<>
			<Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
				{title}
			</Typography>
			<Table sx={{ marginBottom: 4 }}>
				<TableHead>
					<TableRow>
						<TableCell>
							<TableSortLabel
								active={sortConfig.column === "date"}
								direction={sortConfig.column === "date" ? sortConfig.direction : "asc"}
								onClick={() => onSort(type, "date")}
								sx={{ fontWeight: 700 }}
							>
								Date
							</TableSortLabel>
						</TableCell>
						<TableCell>
							<TableSortLabel
								active={sortConfig.column === "from"}
								direction={sortConfig.column === "from" ? sortConfig.direction : "asc"}
								onClick={() => onSort(type, "from")}
								sx={{ fontWeight: 700 }}
							>
								From
							</TableSortLabel>
						</TableCell>
						<TableCell>
							<TableSortLabel
								active={sortConfig.column === "to"}
								direction={sortConfig.column === "to" ? sortConfig.direction : "asc"}
								onClick={() => onSort(type, "to")}
								sx={{ fontWeight: 700 }}
							>
								To
							</TableSortLabel>
						</TableCell>
						<TableCell>
							<TableSortLabel
								active={sortConfig.column === "rideBy"}
								direction={sortConfig.column === "rideBy" ? sortConfig.direction : "asc"}
								onClick={() => onSort(type, "rideBy")}
								sx={{ fontWeight: 700 }}
							>
								Ride by
							</TableSortLabel>
						</TableCell>
						<TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rides.map((ride, index) => (
						<TableRow key={index}>
							<TableCell>{ride.date}</TableCell>
							<TableCell>{ride.from}</TableCell>
							<TableCell>{ride.to}</TableCell>
							<TableCell>{ride.rideBy}</TableCell>
							<TableCell>
								<Button sx={{ color: "orange", textTransform: "none", fontWeight: 700 }}>View Ride</Button> |{" "}
								<Button sx={{ color: "red", textTransform: "none", fontWeight: 700 }}>Cancel</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);

	return (
		<Box sx={{ padding: 4, backgroundColor: "#f9f9f9" }}>
			{renderTable(
				"Upcoming Rides",
				upcomingSortedData,
				upcomingSortConfig,
				handleSort,
				"upcoming"
			)}
			{renderTable("Past Rides", pastSortedData, pastSortConfig, handleSort, "past")}
		</Box>
	);
};

export default YourRides;
