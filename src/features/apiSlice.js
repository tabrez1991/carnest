import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	vehiclesList: [],
	availableRides: {},
	rideDetails: {},
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
		}
	}
})

export const { setVehiclesList, setAvailableSeats, setRideDetails } = apiSlice.actions

export default apiSlice.reducer