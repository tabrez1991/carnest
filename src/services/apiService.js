import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const apiService = createApi({
  reducerPath: 'apiService',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://nasinghall.pythonanywhere.com/api/' }),
  endpoints: (builder) => ({
    searchRides: builder.mutation({
      query: ({ seats, from, to, token }) => {
        return {
          url: `rides/?available_seats=${seats}&going_from=${from}&going_to=${to}`,
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

export const { useSearchRidesMutation, useGetRidesMutation, usePostRideMutation, useCreateVehicleMutation, useGetVehicleMutation } = apiService