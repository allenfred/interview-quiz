import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';

interface AuthState {
  email: string;
  password: string;
  role: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  reservations: Reservation[];
  reservation: Reservation | null;
}

interface Reservation {
  id?: string;
  guestName: string;
  contactInfo: string;
  expectedArrivalTime: string;
  tableSize: number;
  status: string;
}

const initialState: AuthState = {
  email: '',
  password: '',
  role: '',
  status: 'idle',
  error: null,
  reservations: [],
  reservation: null,
};

export const signup = createAsyncThunk(
  'auth/signup',
  async ({
    name,
    email,
    password,
    phone,
    role,
  }: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
  }) => {
    const response = await axiosInstance.post(
      'http://localhost:3100/api/users/signup',
      {
        name,
        email,
        password,
        phone,
        role,
      },
    );

    return response.data;
  },
);

export const login = createAsyncThunk(
  'auth/login',
  async (
    {
      email,
      password,
      role,
    }: {
      email: string;
      password: string;
      role: string;
    },
    {rejectWithValue},
  ) => {
    // const response = await axiosInstance.post(
    //   'http://localhost:3100/api/users/login',
    //   {
    //     email,
    //     password,
    //     role,
    //   },
    // );

    // return response.data;
    try {
      const response = await axiosInstance.post(
        'http://localhost:3100/api/users/login',
        {
          email,
          password,
          role,
        },
      );

      return response.data;
    } catch (e: any) {
      if (e.response?.data?.error?.message) {
        return rejectWithValue(e.response.data.error);
      }
      return rejectWithValue(e);
    }
  },
);

export const fetchReservations = createAsyncThunk(
  'auth/fetchReservations',
  async () => {
    const response = await axiosInstance.get('/reservations');
    return response.data;
  },
);

export const createReservation = createAsyncThunk(
  'auth/createReservation',
  async (reservation: Omit<Reservation, 'id'>) => {
    const response = await axiosInstance.post('/reservations', reservation);
    return response.data;
  },
);

export const updateReservation = createAsyncThunk(
  'auth/updateReservation',
  async ({
    id,
    reservation,
  }: {
    id: string;
    reservation: Partial<Reservation>;
  }) => {
    const response = await axiosInstance.patch(
      `/reservations/${id}`,
      reservation,
    );
    return response.data;
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setContactInfo(state, action) {
      state.email = action.payload;
    },
    setVerificationCode(state, action) {
      state.password = action.payload;
    },
    setRole(state, action) {
      state.role = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, state => {
        state.status = 'succeeded';
      })
      .addCase(login.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error =
          (action.payload as {message: string})?.message || 'Failed to login';
      })
      .addCase(fetchReservations.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reservations = action.payload;
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch reservations';
      })
      .addCase(createReservation.pending, state => {
        state.status = 'loading';
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reservations.push(action.payload);
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to create reservation';
      })
      .addCase(updateReservation.pending, state => {
        state.status = 'loading';
      })
      .addCase(updateReservation.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.reservations.findIndex(
          res => res.id === action.payload.id,
        );
        if (index !== -1) {
          state.reservations[index] = action.payload;
        }
      })
      .addCase(updateReservation.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update reservation';
      });
  },
});

export const {setContactInfo, setVerificationCode, setRole} = authSlice.actions;

export default authSlice.reducer;
