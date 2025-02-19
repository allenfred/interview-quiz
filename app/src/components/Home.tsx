import {Box, Button, Container, TextField, Typography} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {AppDispatch, RootState} from '../store';
import {
  login,
  setContactInfo,
  setVerificationCode,
  setRole,
} from '../store/slices/authSlice';

enum Role {
  Guest = 'guest',
  Employee = 'employee',
}

function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {contactInfo, verificationCode, status, error} = useSelector(
    (state: RootState) => state.auth,
  );

  const handleLogin = async (role: Role) => {
    const result = await dispatch(login({contactInfo, verificationCode, role}));
    if (login.fulfilled.match(result)) {
      const token = result.payload.token;
      localStorage.setItem('token', token);
      dispatch(setRole(role));
      navigate('/reservationList');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={5}>
        <Typography variant="h4" gutterBottom>
          Welcome to Hilton Restaurant
        </Typography>
        <TextField
          label="Contact Info (Phone Number/Email)"
          variant="outlined"
          fullWidth
          margin="normal"
          value={contactInfo}
          onChange={e => dispatch(setContactInfo(e.target.value))}
        />
        <TextField
          label="Verification Code (123456)"
          variant="outlined"
          fullWidth
          margin="normal"
          value={verificationCode}
          onChange={e => dispatch(setVerificationCode(e.target.value))}
        />
        {status === 'failed' && <Typography color="error">{error}</Typography>}
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleLogin(Role.Guest)}
            fullWidth
            disabled={status === 'loading'}
          >
            Guest Entrance
          </Button>
        </Box>
        <Box mt={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleLogin(Role.Employee)}
            fullWidth
            disabled={status === 'loading'}
          >
            Employee Entrance
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Home;
