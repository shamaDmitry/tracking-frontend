import { useState, type SyntheticEvent } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  FormHelperText,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { useStore } from "../store/RootStore";
import { useNavigate } from "react-router";
import { observer } from "mobx-react-lite";

const Login = observer(() => {
  const [identifier, setIdentifier] = useState("");

  const { authStore } = useStore();

  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (identifier.trim()) {
      authStore.login(identifier);

      navigate("/with-canvas");
    }
  };

  return (
    <Box
      boxSizing={"border-box"}
      component="main"
      sx={{
        bgcolor: "primary.light",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        p: 4,
      }}
    >
      <Container
        maxWidth={"sm"}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={5}
          sx={{
            width: "100%",
            boxSizing: "border-box",
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography
            component="h2"
            variant="h5"
            sx={{
              color: "primary.dark",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            Backend is deployed on Render and need to wake up when accessed
            after a period of inactivity. So, the first login attempt may take a
            few seconds. Please be patient.
          </Typography>
        </Paper>

        <Paper
          elevation={5}
          sx={{
            width: "100%",
            boxSizing: "border-box",
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LoginIcon />
          </Avatar>

          <Typography
            component="h1"
            variant="h5"
            sx={{ color: "primary.main" }}
          >
            Sign In
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="identifier"
              label="Unique Identifier"
              name="identifier"
              autoComplete="identifier"
              autoFocus
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            <FormHelperText>Minimum 6 characters</FormHelperText>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
              disabled={!identifier.trim() || identifier.trim().length < 6}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
});

export default Login;
