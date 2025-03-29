"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  Alert,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Card
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2), 0 10px 10px -5px rgba(0,0,0,0.1)",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
            <Box
              sx={{
                flex: 1,
                background: "linear-gradient(135deg, #059669 0%, #34d399 100%)",
                p: 4,
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                justifyContent: "center",
                color: "white",
              }}
            >
              <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
                Welcome Back!
              </Typography>
              <Typography variant="body1" sx={{ mb: 4 }}>
                Access your account to manage events, track attendance, and collaborate with your team.
              </Typography>
              <Box sx={{ position: "relative", height: 250, width: "100%" }}>
                <Paper
                  elevation={6}
                  sx={{
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <Box 
                    sx={{ 
                      height: "100%", 
                      width: "100%", 
                      bgcolor: "rgba(0,0,0,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Typography variant="h3" sx={{ fontWeight: 600, color: "white" }}>
                      Event Management
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Box>

            <Box
              sx={{
                flex: 1,
                p: 4,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="h4" align="center" sx={{ mb: 3, fontWeight: 600 }}>
                Sign In
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isLoading}
                  sx={{ mt: 3, mb: 2, py: 1.5, fontSize: "1rem" }}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/register" passHref>
                    <Typography component="span" color="primary" sx={{ cursor: "pointer", textDecoration: "underline" }}>
                      Register here
                    </Typography>
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>
      </Container>
    </Box>
  );
} 