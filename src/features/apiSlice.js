import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	vehiclesList: [],
	availableRides: {}
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
		}
	}
})

export const { setVehiclesList, setAvailableSeats } = apiSlice.actions

export default apiSlice.reducer