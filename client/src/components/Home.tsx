import {Box, Button, Container, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={5}>
        <Typography variant="h4" gutterBottom>
          Welcome to Hilton Restaurant
        </Typography>
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => navigate('/signup')}
          >
            Signup
          </Button>
        </Box>
        <Box mt={2}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={() => navigate('/entrance')}
          >
            Signin
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Home;
