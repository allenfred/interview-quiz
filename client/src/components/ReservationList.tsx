import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { fetchReservations } from '../store/slices/reservationSlice';
import { Box, CircularProgress, List, ListItem, Typography, Card, CardContent, CardActions, Button } from '@mui/material';
import { AuthStatus } from '../type';

function ReservationList() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { reservations, status, error } = useSelector((state: RootState) => state.reservations);

  useEffect(() => {
    dispatch(fetchReservations());
  }, [dispatch]);

  if (status === AuthStatus.Loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (status === AuthStatus.Failed) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  if (!reservations.length) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        <Typography variant="h6" gutterBottom>
          No reservations
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/reserve')}>
          Add
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="center" my={3}>
        <Typography variant="h4" gutterBottom>
          Reservations
        </Typography>
      </Box>
      <List>
        {reservations.map((reservation) => (
          <ListItem key={reservation.id}>
            <Card variant="outlined" style={{ width: '100%' }}>
              <CardContent>
                <Typography variant="h6">{reservation.guestName}</Typography>
                <Typography color="textSecondary">Status: {reservation.status}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  component={Link}
                  to={`/reservation/${reservation.id}`}
                  onClick={() => {
                    console.log('--------');
                  }}
                  state={{ reservation }}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default ReservationList;
