"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Card,
  InputAdornment,
  IconButton,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Grid,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Person,
  School,
  Phone,
  Lock,
  Badge,
} from "@mui/icons-material";
import Link from "next/link";
import { UserRole } from "@/models/User";

const steps = ["Account Details", "Role Information", "Confirmation"];

export default function RegisterPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    department: "",
    phoneNumber: "",
    adminPosition: "",
    committeeRole: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value,
    });
  };

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate first step
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError("Please fill in all required fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
    } else if (activeStep === 1) {
      // Validate second step
      if (!formData.role) {
        setError("Please select a role");
        return;
      }
      
      // Additional validation based on role
      if (formData.role === UserRole.ADMIN && !formData.adminPosition) {
        setError("Please specify your position (CP, VCP)");
        return;
      }
      if (formData.role === UserRole.COMMITTEE_MEMBER && !formData.department) {
        setError("Please specify your department");
        return;
      }
    }

    setError("");
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError("");
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          department: formData.department,
          phoneNumber: formData.phoneNumber,
          adminPosition: formData.adminPosition,
          committeeRole: formData.committeeRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Registration successful, redirect to login
      router.push("/auth/login?registered=true");
    } catch (error: any) {
      setError(error.message || "An error occurred during registration");
      setActiveStep(0);
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
        background: "linear-gradient(135deg, #db2777 0%, #7c3aed 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Card
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2), 0 10px 10px -5px rgba(0,0,0,0.1)",
            p: 4,
          }}
        >
          <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 600 }}>
            Create Your Account
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {activeStep === 0 && (
            <Box component="form">
              <TextField
                label="Full Name"
                name="name"
                fullWidth
                margin="normal"
                variant="outlined"
                value={formData.name}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Email Address"
                name="email"
                type="email"
                fullWidth
                margin="normal"
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
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
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                variant="outlined"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          )}

          {activeStep === 1 && (
            <Box component="form">
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Role"
                  startAdornment={
                    <InputAdornment position="start">
                      <Badge color="primary" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value={UserRole.SUPER_ADMIN}>Super Admin (HOD)</MenuItem>
                  <MenuItem value={UserRole.ADMIN}>Admin (CP, VCP)</MenuItem>
                  <MenuItem value={UserRole.COMMITTEE_MEMBER}>Committee Member</MenuItem>
                  <MenuItem value={UserRole.ATTENDEE}>Attendee</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Phone Number"
                name="phoneNumber"
                fullWidth
                margin="normal"
                variant="outlined"
                value={formData.phoneNumber}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              {formData.role === UserRole.ADMIN && (
                <TextField
                  label="Position (CP, VCP)"
                  name="adminPosition"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={formData.adminPosition}
                  onChange={handleChange}
                  required
                />
              )}

              {(formData.role === UserRole.COMMITTEE_MEMBER || formData.role === UserRole.SUPER_ADMIN) && (
                <TextField
                  label="Department"
                  name="department"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={formData.department}
                  onChange={handleChange}
                  required={formData.role === UserRole.COMMITTEE_MEMBER}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <School color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}

              {formData.role === UserRole.COMMITTEE_MEMBER && (
                <TextField
                  label="Committee Role"
                  name="committeeRole"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={formData.committeeRole}
                  onChange={handleChange}
                />
              )}
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Review Your Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Name:
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {formData.name}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Email:
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {formData.email}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Role:
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {formData.role}
                  </Typography>
                </Grid>
                
                {formData.department && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Department:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {formData.department}
                    </Typography>
                  </Grid>
                )}
                
                {formData.phoneNumber && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Phone Number:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {formData.phoneNumber}
                    </Typography>
                  </Grid>
                )}
                
                {formData.adminPosition && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Position:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {formData.adminPosition}
                    </Typography>
                  </Grid>
                )}
                
                {formData.committeeRole && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Committee Role:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {formData.committeeRole}
                    </Typography>
                  </Grid>
                )}
              </Grid>
              
              <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
                By creating an account, you agree to our Terms and Conditions and Privacy Policy.
              </Typography>
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              variant="outlined"
              disabled={activeStep === 0 || isLoading}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isLoading}
                sx={{ minWidth: 120 }}
              >
                {isLoading ? <CircularProgress size={24} /> : "Register"}
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleNext}>
                Next
              </Button>
            )}
          </Box>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Link href="/auth/login" passHref>
                <Typography component="span" color="primary" sx={{ cursor: "pointer", textDecoration: "underline" }}>
                  Sign in
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Card>
      </Container>
    </Box>
  );
} 