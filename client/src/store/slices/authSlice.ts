import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';
import { AuthStatus } from '../../type';

interface AuthState {
  name: string;
  email: string;
  phone: string;
  role: string;
  status: AuthStatus;
  error: string | null;
}

const initialState: AuthState = {
  name: '',
  email: '',
  phone: '',
  role: '',
  status: AuthStatus.Idle,
  error: null,
};

export const signup = createAsyncThunk('auth/signup', async ({ name, email, password, phone, role }: { name: string; email: string; password: string; phone: string; role: string }) => {
  const response = await axiosInstance.post('http://localhost:3100/api/users/signup', {
    name,
    email,
    password,
    phone,
    role,
  });

  return response.data;
});

export const login = createAsyncThunk(
  'auth/login',
  async (
    {
      contactInfo,
      password,
      role,
    }: {
      contactInfo: string;
      password: string;
      role: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post('http://localhost:3100/api/users/login', {
        contactInfo,
        password,
        role,
      });

      const token = response.data.token;
      localStorage.setItem('token', token);

      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const userResponse = await axiosInstance.get('http://localhost:3100/api/whoAmI');

      return { token, user: userResponse.data };
    } catch (e: any) {
      if (e.response?.data?.error?.message) {
        return rejectWithValue(e.response.data.error);
      }
      return rejectWithValue(e);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = AuthStatus.Loading;
      })
      .addCase(login.fulfilled, (state, action: any) => {
        state.status = AuthStatus.Succeeded;
        state.name = action.payload.user.name;
        state.email = action.payload.user.email;
        state.phone = action.payload.user.phone;
        state.role = action.payload.user.role;
      })
      .addCase(login.rejected, (state, action: any) => {
        state.status = AuthStatus.Failed;
        state.error = (action.payload as { message: string })?.message || 'Failed to login';
      });
  },
});

export default authSlice.reducer;
