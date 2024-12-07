import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const apiService = createApi({
  reducerPath: 'apiService',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://nasinghall.pythonanywhere.com/api/' }),
  endpoints: (builder) => ({
    searchRides: builder.mutation({
      query: ({ going_from_lat, going_from_lng, going_to_lat, going_to_lng, date, seats, token }) => {
        return {
          url: `rides/?available_seats=${seats}&going_from_lat=${going_from_lat}&going_from_lng=${going_from_lng}&going_to_lat=${going_to_lat}&going_to_lng=${going_to_lng}&date=${date}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      }
    }),
    getRides: builder.mutation({
      query: (token) => {
        return {
          url: 'rides/',
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      }
    }),
    getRidesById: builder.mutation({
      query: ({ rideId, token }) => {
        return {
          url: `rides/${rideId}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      }
    }),
    postRide: builder.mutation({
      query: ({ actualData, access_token }) => {
        return {
          url: 'rides/',
          method: 'POST',
          body: actualData,
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${access_token}`
          }
        }
      }
    }),
    createVehicle: builder.mutation({
      query: ({ actualData, access_token }) => {
        return {
          url: 'vehicle/',
          method: 'POST',
          body: actualData,
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${access_token}`
          }
        }
      }
    }),
    getVehicle: builder.mutation({
      query: (token) => {
        return {
          url: 'vehicle/',
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      }
    }),
  }),
});

export const { useSearchRidesMutation, useGetRidesMutation, usePostRideMutation, useCreateVehicleMutation, useGetVehicleMutation, useGetRidesByIdMutation } = apiService