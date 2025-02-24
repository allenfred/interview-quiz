import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';

interface Reservation {
  id?: string;
  guestName: string;
  contactInfo: string;
  expectedArrivalTime: string;
  tableSize: number;
  status: string;
}

interface ReservationState {
  reservations: Reservation[];
  reservation: Reservation | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ReservationState = {
  reservations: [],
  reservation: null,
  status: 'idle',
  error: null,
};

export const fetchReservations = createAsyncThunk('reservations/fetchReservations', async () => {
  const response = await axiosInstance.get('/reservations');
  return response.data;
});

export const createReservation = createAsyncThunk('reservations/createReservation', async (reservation: Omit<Reservation, 'id'>) => {
  const response = await axiosInstance.post('/reservations', reservation);
  return response.data;
});

export const updateReservation = createAsyncThunk('reservations/updateReservation', async ({ id, reservation }: { id: string; reservation: Partial<Reservation> }) => {
  const response = await axiosInstance.patch(`/reservations/${id}`, reservation);
  return response.data;
});

const reservationSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservations.pending, (state) => {
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
      .addCase(createReservation.pending, (state) => {
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
      .addCase(updateReservation.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateReservation.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.reservations.findIndex((res) => res.id === action.payload.id);
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

export default reservationSlice.reducer;
