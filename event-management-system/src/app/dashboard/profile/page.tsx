"use client";


import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    department: "",
    avatar: "/avatars/default-avatar.jpg",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    // In a real app, you would send this data to an API
    toast.success("Profile updated successfully");
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        My Profile
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        View and update your profile information.
      </Typography>

      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Avatar
                src={user.avatar}
                alt={user.name}
                sx={{ width: 120, height: 120, mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                label="Name"
                name="name"
                fullWidth
                value={user.name}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Email"
                name="email"
                fullWidth
                value={user.email}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                disabled
              />
              <TextField
                label="Department"
                name="department"
                fullWidth
                value={user.department}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Save Changes
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
} 