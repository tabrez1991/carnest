import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  access_token: null,
  profile: {}
}

export const authSlice = createSlice({
  name: 'auth_token',
  initialState,
  reducers: {
    setUserToken: (state, action) => {
      state.access_token = action.payload.access_token
    },
    unSetUserToken: (state, action) => {
      return initialState;
    },
    setProfile: (state, action) => {
      state.profile = action.payload.profile
    }
  }
})

export const { setUserToken, unSetUserToken, setProfile } = authSlice.actions

export default authSlice.reducer