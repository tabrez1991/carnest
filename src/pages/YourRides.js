import React, { useState } from "react";
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

const ridesData = {
	upcoming: [
		{ date: "17 Oct 2024", from: "Los Angeles", to: "San Francisco", rideBy: "Driver Name" },
		{ date: "29 Dec 2024", from: "Los Angeles", to: "San Francisco", rideBy: "Driver Name" },
	],
	past: [
		{ date: "1 Oct 2024", from: "Los Angeles", to: "San Francisco", rideBy: "Driver Name" },
		{ date: "15 Sep 2024", from: "Los Angeles", to: "San Francisco", rideBy: "Driver Name" },
	],
};

const YourRides = () => {
	// Separate sort configurations and sorted data for each table
	const [upcomingSortConfig, setUpcomingSortConfig] = useState({
		column: "date",
		direction: "asc",
	});
	const [pastSortConfig, setPastSortConfig] = useState({
		column: "date",
		direction: "asc",
	});

	const [upcomingSortedData, setUpcomingSortedData] = useState(ridesData.upcoming);
	const [pastSortedData, setPastSortedData] = useState(ridesData.past);

	// Generic function to handle sorting for a specific table
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
				"Up coming",
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
