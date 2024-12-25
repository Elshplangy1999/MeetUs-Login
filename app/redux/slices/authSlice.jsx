"use client";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch('https://api-yeshtery.dev.meetusvr.com/v1/yeshtery/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, isEmployee: true }),
      });

      if (!response.ok) {
        return rejectWithValue('Invalid credentials');
      }

      const data = await response.json();
      document.cookie = `auth_token=${data.token}; path=/; HttpOnly; Secure; SameSite=Strict`;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getUserInfo = createAsyncThunk(
  'auth/getUserInfo',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch('https://api-yeshtery.dev.meetusvr.com/v1/user/info', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return rejectWithValue('Failed to fetch user info');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null,
    loading: false,
    error: null,
    validationErrors: {},
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    },
    clearValidationErrors: (state, action) => {
      const field = action.payload;
      if (field) {
        delete state.validationErrors[field];
      } else {
        state.validationErrors = {};
      }
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(getUserInfo.rejected, (state) => {
        state.token = null;
        state.user = null;
      });
  },
});

export const { logout, clearValidationErrors } = authSlice.actions;
export default authSlice.reducer;
