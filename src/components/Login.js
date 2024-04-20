import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Avatar, Button, CssBaseline, TextField, Box, Typography, Container, ThemeProvider, createTheme
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const loginData = { email, password };
    axios.post('http://localhost:8082/api/users/login', loginData)
  .then(response => {
    console.log('Login successful:', response.data);
    navigate('/home');
  })
  .catch(error => {
    const errorMessage = error.response ? error.response.data : 'Unknown Error';
    alert('Login Failed: ' + errorMessage);
  });

  };

  return (
    <ThemeProvider theme={createTheme()}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign In</Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Login;
