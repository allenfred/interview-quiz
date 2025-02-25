import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { login } from '../store/slices/authSlice';
import { Role } from '../type';
import { validateContactInfo, validatePassword } from '../util';

function Entrance() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, error } = useSelector((state: RootState) => state.auth);
  const [contactInfo, setContactInfo] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState({ contactInfo: '', password: '' });

  const handleLogin = async (role: Role) => {
    let valid = true;
    const newErrors = { contactInfo: '', password: '' };

    if (!validateContactInfo(contactInfo)) {
      newErrors.contactInfo = 'Invalid contact info (must be a valid email or 11-digit phone number)';
      valid = false;
    }
    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      const result = await dispatch(login({ contactInfo, password, role }));
      if (login.fulfilled.match(result)) {
        navigate('/reservationList');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={5}>
        <Typography variant="h4" gutterBottom>
          Welcome to Hilton Restaurant
        </Typography>
        <TextField
          name="contactInfo"
          label="Contact Info (Phone/Email)"
          variant="outlined"
          fullWidth
          margin="normal"
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
          error={!!errors.contactInfo}
          helperText={errors.contactInfo}
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
        />
        {status === 'failed' && <Typography color="error">{error}</Typography>}
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={() => handleLogin(Role.Guest)} fullWidth>
            Guest Entrance
          </Button>
        </Box>
        <Box mt={2}>
          <Button variant="contained" color="secondary" onClick={() => handleLogin(Role.Employee)} fullWidth>
            Employee Entrance
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Entrance;
