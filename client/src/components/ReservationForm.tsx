import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { createReservation, updateReservation } from '../store/slices/reservationSlice';
import { Box, Button, CircularProgress, Container, MenuItem, TextField, Typography } from '@mui/material';
import { Role, ReservationStatusEnum } from '../type';
import { formatDateTimeLocal } from '../util';

function ReservationForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { status, error, role, name, phone } = useSelector((state: RootState) => state.auth);

  const [guestName, setGuestName] = useState(name ?? '');
  const [contactInfo, setContactInfo] = useState(phone ?? '');
  const [expectedArrivalTime, setexpectedArrivalTime] = useState('');
  const [tableSize, setTableSize] = useState('');
  const [reservationStatus, setReservationStatus] = useState(ReservationStatusEnum.Confirmed);
  const isEmployee = role === Role.Employee;

  useEffect(() => {
    if (id && location.state?.reservation) {
      const reservation = location.state.reservation;
      setGuestName(reservation.guestName);
      setContactInfo(reservation.contactInfo);
      setexpectedArrivalTime(formatDateTimeLocal(reservation.expectedArrivalTime));
      setTableSize(reservation.tableSize.toString());
      setReservationStatus(reservation.status);
    }
  }, [id, location.state]);

  const canUpdate = useMemo(() => {
    if (!location.state?.reservation) {
      return true;
    }
    return !isEmployee && reservationStatus === ReservationStatusEnum.Confirmed;
  }, [isEmployee, reservationStatus, location.state]);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Ensure expectedArrivalTime is in the correct format
    const formattedArrivalTime = new Date(expectedArrivalTime).toISOString();

    const reservation = {
      guestName,
      contactInfo,
      expectedArrivalTime: formattedArrivalTime,
      tableSize: parseInt(tableSize, 10),
      status: reservationStatus,
    };

    if (id && canUpdate) {
      dispatch(updateReservation({ id, reservation })).catch((error) => {
        console.error('Error updating reservation:', error);
      });
    } else {
      dispatch(createReservation(reservation))
        .then(() => {
          navigate('/reservationList');
        })
        .catch((error) => {
          console.error('Error creating reservation:', error);
        });
    }
  };

  const handleStatusUpdate = (newStatus: string) => {
    if (id) {
      dispatch(updateReservation({ id, reservation: { status: newStatus } }))
        .then(() => {
          navigate('/reservationList');
        })
        .catch((error) => {
          console.error(`Error updating reservation to ${newStatus}:`, error);
        });
    }
  };

  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'failed') {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Box display="flex" justifyContent="center" mb={3}>
          <Typography variant="h4" gutterBottom>
            {id ? 'Update Reservation' : 'Make a Reservation'}
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField disabled label="Name" variant="outlined" fullWidth margin="normal" value={guestName} onChange={(e) => setGuestName(e.target.value)} required />
          <TextField disabled label="Contact Info" variant="outlined" fullWidth margin="normal" value={contactInfo} required />
          <TextField
            disabled={!canUpdate}
            label="Arrival Time"
            type="datetime-local"
            variant="outlined"
            fullWidth
            margin="normal"
            value={expectedArrivalTime}
            onChange={(e) => setexpectedArrivalTime(e.target.value)}
            required
          />
          <TextField disabled={!canUpdate} label="Table Size" select variant="outlined" fullWidth margin="normal" value={tableSize} onChange={(e) => setTableSize(e.target.value)} required>
            <MenuItem value="1">1</MenuItem>
            <MenuItem value="2">2</MenuItem>
            <MenuItem value="3">3</MenuItem>
          </TextField>
          <TextField
            disabled={!canUpdate}
            label="Status"
            select
            variant="outlined"
            fullWidth
            margin="normal"
            value={reservationStatus}
            onChange={(e) => setReservationStatus(e.target.value as ReservationStatusEnum)}
            required
          >
            <MenuItem value={ReservationStatusEnum.Confirmed}>Confirmed</MenuItem>
            <MenuItem value={ReservationStatusEnum.Completed}>Completed</MenuItem>
            <MenuItem value={ReservationStatusEnum.Cancelled}>Cancelled</MenuItem>
          </TextField>
          {!isEmployee && canUpdate && (
            <Box mt={2}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                {id ? 'Update Reservation' : 'Make Reservation'}
              </Button>
            </Box>
          )}
        </form>
        {isEmployee && id && reservationStatus === ReservationStatusEnum.Confirmed && (
          <Box mt={2} display="flex" flexDirection="column" alignItems="center">
            <Button variant="contained" color="secondary" fullWidth onClick={() => handleStatusUpdate(ReservationStatusEnum.Cancelled)} sx={{ mb: 1 }}>
              Mark as Canceled
            </Button>
            <Button variant="contained" color="primary" fullWidth onClick={() => handleStatusUpdate(ReservationStatusEnum.Completed)}>
              Mark as Completed
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default ReservationForm;
