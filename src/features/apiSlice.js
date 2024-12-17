import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	vehiclesList: [],
	availableRides: {},
	rideDetails: {},
	bookedRides: []
}

export const apiSlice = createSlice({
	name: 'apiSlice',
	initialState,
	reducers: {
		setVehiclesList: (state, action) => {
			state.vehiclesList = action.payload.data
		},
		setAvailableSeats: (state, action) => {
			state.availableRides = action.payload.data
		},
		setRideDetails: (state, action) => {
			state.rideDetails = action.payload.data
		},
		setBookedRides: (state, action) => {
			state.bookedRides = action.payload.data
		}
	}
})

export const { setVehiclesList, setAvailableSeats, setRideDetails, setBookedRides } = apiSlice.actions

export default apiSlice.reducer