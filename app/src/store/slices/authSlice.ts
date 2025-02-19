import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';

interface AuthState {
  contactInfo: string;
  verificationCode: string;
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
  contactInfo: '',
  verificationCode: '',
  role: '',
  status: 'idle',
  error: null,
  reservations: [],
  reservation: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({
    contactInfo,
    verificationCode,
    role,
  }: {
    contactInfo: string;
    verificationCode: string;
    role: string;
  }) => {
    const response = await axiosInstance.post(
      'http://localhost:3100/api/users/login',
      {
        contactInfo,
        verificationCode,
        role,
      },
    );

    return response.data;
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
      state.contactInfo = action.payload;
    },
    setVerificationCode(state, action) {
      state.verificationCode = action.payload;
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
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to login';
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
