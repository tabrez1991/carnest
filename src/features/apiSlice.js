import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	vehiclesList: [],
	availableRides: {},
	rideDetails: {},
	bookedRides: [],
	postedRides: []
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
		},
		setPostedRides: (state, action) => {
			state.postedRides = action.payload.data
		},
	}
})

export const { setVehiclesList, setAvailableSeats, setRideDetails, setBookedRides, setPostedRides } = apiSlice.actions

export default apiSlice.reducer