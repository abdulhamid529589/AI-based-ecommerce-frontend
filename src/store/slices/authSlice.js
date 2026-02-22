import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '../../lib/axios'
import { toast } from 'react-toastify'

// Check if user is stored in localStorage
const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
const storedToken = localStorage.getItem('accessToken') // ✅ CHANGED from 'token' to 'accessToken'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser,
    token: storedToken,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isUpdatingPassword: false,
    isRequestingForToken: false,
    isCheckingAuth: false,
    isAuthenticated: !!storedUser && !!storedToken,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      localStorage.setItem('user', JSON.stringify(action.payload.user))
      localStorage.setItem('accessToken', action.payload.token) // ✅ CHANGED from 'token' to 'accessToken'
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('user')
      localStorage.removeItem('accessToken') // ✅ CHANGED from 'token' to 'accessToken'
    },
  },
  extraReducers: (builder) => {},
})

export const { setUser, logout } = authSlice.actions
export default authSlice.reducer
