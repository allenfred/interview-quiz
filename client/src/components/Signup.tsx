import {Box, Button, Container, TextField, Typography} from '@mui/material';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {AppDispatch} from '../store';
import {signup} from '../store/slices/authSlice';

function Signup() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({email: '', phone: '', password: ''});

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    const re = /^\d{11}$/;
    return re.test(phone);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSignup = async () => {
    let valid = true;
    const newErrors = {email: '', phone: '', password: ''};

    if (!validateEmail(email)) {
      newErrors.email = 'Invalid email address';
      valid = false;
    }
    if (!validatePhone(phone)) {
      newErrors.phone = 'Phone number must be 11 digits';
      valid = false;
    }
    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      const result = await dispatch(
        signup({name, email, phone, password, role: 'guest'}),
      );
      if (signup.fulfilled.match(result)) {
        navigate('/reserve');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={5}>
        <Typography variant="h4" gutterBottom>
          Signup
        </Typography>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSignup();
          }}
        >
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            required
          />
          <TextField
            label="Phone"
            variant="outlined"
            fullWidth
            margin="normal"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            error={!!errors.phone}
            helperText={errors.phone}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            required
          />
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Signup
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}

export default Signup;
