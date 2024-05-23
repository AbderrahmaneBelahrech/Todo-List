import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../assets/logo.jpeg";
import {
  Button,
  CssBaseline,
  TextField,
  Box,
  Container,
  ThemeProvider,
  createTheme,
} from "@mui/material";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email) {
      setEmailError("Email cannot be empty");
      return;
    }
    if (!password) {
      setPasswordError("Password cannot be empty");
      return;
    }

    const loginData = { email, password };
    axios
      .post("http://localhost:8080/api/users/login", loginData)
      .then((response) => {
        localStorage.setItem("username", response.data.name);
        localStorage.setItem("userId", response.data.id);
        navigate("/dashboard");
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setPasswordError("Incorrect email or password");
          setEmailError("");
        } else {
          setPasswordError("Unknown Error");
        }
      });
  };

  return (
    <ThemeProvider theme={createTheme()}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img src={Logo} style={{ maxWidth: "100px" }} alt="logo" />

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={Boolean(emailError)}
              helperText={emailError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={Boolean(passwordError)}
              helperText={passwordError}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Login;
