import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import {AppDispatch, RootState} from '../store';
import {
  createReservation,
  updateReservation,
  fetchReservations,
} from '../store/slices/authSlice';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import {Role} from '../type';

// Utility function to format date
const formatDateTimeLocal = (dateString: string) => {
  const date = new Date(dateString);
  const pad = (num: number) => (num < 10 ? '0' + num : num);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

function ReservationForm() {
  const navigate = useNavigate();
  const {id} = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const {reservations, status, error, role} = useSelector(
    (state: RootState) => state.auth,
  );

  const [guestName, setGuestName] = useState('');
  const [contactInfo, setContactInfo] = useState(
    localStorage.getItem('contactInfo') || '',
  );
  const [expectedArrivalTime, setexpectedArrivalTime] = useState('');
  const [tableSize, setTableSize] = useState('');
  const [reservationStatus, setReservationStatus] = useState('confirmed');
  console.log('role', role);
  useEffect(() => {
    if (id && reservations.length === 0) {
      dispatch(fetchReservations());
    }
  }, [dispatch, id, reservations.length]);

  useEffect(() => {
    if (id) {
      const reservation = reservations.find(res => res.id === id);
      if (reservation) {
        setGuestName(reservation.guestName);
        setContactInfo(reservation.contactInfo);
        setexpectedArrivalTime(
          formatDateTimeLocal(reservation.expectedArrivalTime),
        );
        setTableSize(reservation.tableSize.toString());
        setReservationStatus(reservation.status);
      }
    }
  }, [id, reservations]);

  const handleSubmit = (e: {preventDefault: () => void}) => {
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

    if (id) {
      // Update existing reservation
      dispatch(updateReservation({id, reservation})).catch(error => {
        console.error('Error updating reservation:', error);
      });
    } else {
      // Create new reservation
      dispatch(createReservation(reservation))
        .then(() => {
          navigate('/reservationList');
        })
        .catch(error => {
          console.error('Error creating reservation:', error);
        });
    }
  };

  const handleStatusUpdate = (newStatus: string) => {
    if (id) {
      dispatch(updateReservation({id, reservation: {status: newStatus}}))
        .then(() => {
          navigate('/reservationList');
        })
        .catch(error => {
          console.error(`Error updating reservation to ${newStatus}:`, error);
        });
    }
  };

  if (status === 'loading') {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
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
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={guestName}
            onChange={e => setGuestName(e.target.value)}
            required
            disabled={role === Role.Employee}
          />
          <TextField
            disabled
            label="Contact Info"
            variant="outlined"
            fullWidth
            margin="normal"
            value={contactInfo}
            required
          />
          <TextField
            label="Arrival Time"
            type="datetime-local"
            variant="outlined"
            fullWidth
            margin="normal"
            value={expectedArrivalTime}
            onChange={e => setexpectedArrivalTime(e.target.value)}
            required
            disabled={role === Role.Employee}
          />
          <TextField
            label="Table Size"
            select
            variant="outlined"
            fullWidth
            margin="normal"
            value={tableSize}
            onChange={e => setTableSize(e.target.value)}
            required
            disabled={role === Role.Employee}
          >
            <MenuItem value="1">1</MenuItem>
            <MenuItem value="2">2</MenuItem>
            <MenuItem value="3">3</MenuItem>
          </TextField>
          <TextField
            disabled={id && role !== Role.Employee ? false : true}
            label="Status"
            select
            variant="outlined"
            fullWidth
            margin="normal"
            value={reservationStatus}
            onChange={e => setReservationStatus(e.target.value)}
            required
          >
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="canceled">Canceled</MenuItem>
          </TextField>
          {role !== 'employee' && (
            <Box mt={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                {id ? 'Update Reservation' : 'Make Reservation'}
              </Button>
            </Box>
          )}
        </form>
        {role === 'employee' && id && (
          <Box mt={2} display="flex" flexDirection="column" alignItems="center">
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => handleStatusUpdate('canceled')}
              sx={{mb: 1}}
            >
              Mark as Canceled
            </Button>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => handleStatusUpdate('completed')}
            >
              Mark as Completed
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default ReservationForm;
