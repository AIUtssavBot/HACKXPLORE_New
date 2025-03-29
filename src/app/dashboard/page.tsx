"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Chip,
  Avatar,
  IconButton,
  Button,
  Paper,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";
import {
  Event,
  People,
  EventNote,
  CalendarMonth,
  ArrowUpward,
  ArrowForward,
  NotificationsActive,
  Check,
  Close,
  AccessTime,
} from "@mui/icons-material";
import Link from "next/link";
import { UserRole } from "@/models/User";

export default function Dashboard() {
  const { data: session } = useSession();
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  
  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
    
    // Format current time
    const now = new Date();
    setCurrentTime(
      now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);
  
  // Demo data (this would normally come from API)
  const stats = {
    totalEvents: 12,
    upcomingEvents: 5,
    totalAttendees: 423,
    pendingApprovals: 3,
  };
  
  const upcomingEvents = [
    {
      id: 1,
      title: "Tech Conference 2023",
      date: "May 15, 2023",
      time: "9:00 AM - 5:00 PM",
      location: "Main Auditorium",
      attendees: 120,
      status: "approved",
    },
    {
      id: 2,
      title: "Cultural Festival",
      date: "May 20, 2023",
      time: "6:00 PM - 10:00 PM",
      location: "Campus Ground",
      attendees: 250,
      status: "pending",
    },
    {
      id: 3,
      title: "Workshop on AI",
      date: "May 25, 2023",
      time: "2:00 PM - 4:00 PM",
      location: "Room 302",
      attendees: 45,
      status: "approved",
    },
  ];
  
  const recentActivities = [
    {
      id: 1,
      action: "Event Approved",
      description: "Tech Conference 2023 was approved",
      time: "2 hours ago",
      icon: <Check sx={{ color: "success.main" }} />,
    },
    {
      id: 2,
      action: "New Reimbursement Request",
      description: "John Doe requested $120 for supplies",
      time: "5 hours ago",
      icon: <NotificationsActive sx={{ color: "warning.main" }} />,
    },
    {
      id: 3,
      action: "Event Rejected",
      description: "Game Night was rejected due to schedule conflict",
      time: "1 day ago",
      icon: <Close sx={{ color: "error.main" }} />,
    },
    {
      id: 4,
      action: "New Event Created",
      description: "Workshop on AI was created and awaiting approval",
      time: "2 days ago",
      icon: <Event sx={{ color: "primary.main" }} />,
    },
  ];
  
  // Function to render role-specific content
  const renderRoleSpecificContent = () => {
    const userRole = session?.user?.role;
    
    switch (userRole) {
      case UserRole.SUPER_ADMIN:
        return (
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Pending Approvals
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <List>
                  {upcomingEvents
                    .filter((event) => event.status === "pending")
                    .map((event) => (
                      <ListItem
                        key={event.id}
                        secondaryAction={
                          <Box>
                            <IconButton color="success" size="small">
                              <Check />
                            </IconButton>
                            <IconButton color="error" size="small">
                              <Close />
                            </IconButton>
                          </Box>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: "primary.main" }}>
                            <Event />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={event.title}
                          secondary={`${event.date} • ${event.location}`}
                        />
                      </ListItem>
                    ))}
                  
                  <ListItem
                    secondaryAction={
                      <Box>
                        <IconButton color="success" size="small">
                          <Check />
                        </IconButton>
                        <IconButton color="error" size="small">
                          <Close />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "warning.main" }}>
                        <NotificationsActive />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Reimbursement Request"
                      secondary="John Doe • $120 for supplies"
                    />
                  </ListItem>
                </List>
                
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Button
                    component={Link}
                    href="/dashboard/super-admin/permissions"
                    endIcon={<ArrowForward />}
                  >
                    View All Approvals
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      
      case UserRole.ADMIN:
        return (
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Committee Performance
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2">Marketing Team</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      85%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={85}
                    sx={{ mb: 2, height: 6, borderRadius: 3 }}
                  />
                  
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2">Technical Team</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      72%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={72}
                    sx={{ mb: 2, height: 6, borderRadius: 3 }}
                  />
                  
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2">Creative Team</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      92%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={92}
                    sx={{ mb: 2, height: 6, borderRadius: 3 }}
                  />
                  
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2">Logistics Team</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      65%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={65}
                    sx={{ mb: 2, height: 6, borderRadius: 3 }}
                  />
                </Box>
                
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Button
                    component={Link}
                    href="/dashboard/admin/committees"
                    endIcon={<ArrowForward />}
                  >
                    Manage Committees
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      
      case UserRole.COMMITTEE_MEMBER:
        return (
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  My Tasks
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <List>
                  <ListItem
                    secondaryAction={
                      <Chip
                        label="High"
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        <AccessTime />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Prepare presentation slides"
                      secondary="Due tomorrow at 5:00 PM"
                    />
                  </ListItem>
                  
                  <ListItem
                    secondaryAction={
                      <Chip
                        label="Medium"
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "secondary.main" }}>
                        <EventNote />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Contact potential sponsors"
                      secondary="Due in 3 days"
                    />
                  </ListItem>
                  
                  <ListItem
                    secondaryAction={
                      <Chip
                        label="Low"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "tertiary.main" }}>
                        <People />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Team meeting preparation"
                      secondary="Due next week"
                    />
                  </ListItem>
                </List>
                
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Button
                    component={Link}
                    href="/dashboard/committee/tasks"
                    endIcon={<ArrowForward />}
                  >
                    View All Tasks
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      
      case UserRole.ATTENDEE:
        return (
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  My Tickets
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {upcomingEvents.map((event) => (
                  <Paper
                    key={event.id}
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 2,
                      bgcolor: "rgba(37, 99, 235, 0.05)",
                      border: "1px solid rgba(37, 99, 235, 0.1)",
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {event.title}
                      </Typography>
                      <Chip
                        size="small"
                        label="Registered"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                    
                    <Box sx={{ display: "flex", gap: 2, color: "text.secondary", fontSize: 14 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CalendarMonth fontSize="small" sx={{ mr: 0.5 }} />
                        {event.date}
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AccessTime fontSize="small" sx={{ mr: 0.5 }} />
                        {event.time}
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1, color: "text.secondary", fontSize: 14 }}>
                      <Event fontSize="small" sx={{ mr: 0.5 }} />
                      {event.location}
                    </Box>
                  </Paper>
                ))}
                
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Button
                    component={Link}
                    href="/dashboard/attendee/events"
                    endIcon={<ArrowForward />}
                  >
                    Explore More Events
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <Box>
      {/* Welcome header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          {greeting}, {session?.user?.name}!
        </Typography>
        <Typography color="text.secondary">{currentTime}</Typography>
      </Box>
      
      {/* Stats cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "primary.main", color: "white" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="subtitle1">Total Events</Typography>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                  <Event />
                </Avatar>
              </Box>
              <Typography variant="h4" fontWeight={600} sx={{ my: 1 }}>
                {stats.totalEvents}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ArrowUpward fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">
                  +12% from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "secondary.main", color: "white" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="subtitle1">Upcoming Events</Typography>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                  <CalendarMonth />
                </Avatar>
              </Box>
              <Typography variant="h4" fontWeight={600} sx={{ my: 1 }}>
                {stats.upcomingEvents}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ArrowUpward fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">
                  +5% from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "tertiary.main", color: "white" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="subtitle1">Total Attendees</Typography>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                  <People />
                </Avatar>
              </Box>
              <Typography variant="h4" fontWeight={600} sx={{ my: 1 }}>
                {stats.totalAttendees}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ArrowUpward fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">
                  +18% from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "accent.main", color: "white" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="subtitle1">Pending Approvals</Typography>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                  <EventNote />
                </Avatar>
              </Box>
              <Typography variant="h4" fontWeight={600} sx={{ my: 1 }}>
                {stats.pendingApprovals}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ArrowUpward fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">
                  +2 new requests
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Main content */}
      <Grid container spacing={3}>
        {/* Upcoming events */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Upcoming Events
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {upcomingEvents.map((event) => (
                <Box
                  key={event.id}
                  sx={{
                    mb: 2,
                    pb: 2,
                    borderBottom: event.id !== upcomingEvents.length ? "1px solid rgba(0,0,0,0.1)" : "none",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {event.title}
                    </Typography>
                    <Chip
                      size="small"
                      label={event.status === "approved" ? "Approved" : "Pending"}
                      color={event.status === "approved" ? "success" : "warning"}
                      variant={event.status === "approved" ? "filled" : "outlined"}
                    />
                  </Box>
                  
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
                      <CalendarMonth fontSize="small" sx={{ mr: 0.5 }} />
                      {event.date}
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
                      <AccessTime fontSize="small" sx={{ mr: 0.5 }} />
                      {event.time}
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
                      <Event fontSize="small" sx={{ mr: 0.5 }} />
                      {event.location}
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
                      <People fontSize="small" sx={{ mr: 0.5 }} />
                      {event.attendees} attendees
                    </Box>
                  </Box>
                </Box>
              ))}
              
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Button
                  component={Link}
                  href={
                    session?.user?.role === UserRole.SUPER_ADMIN
                      ? "/dashboard/super-admin/calendar"
                      : session?.user?.role === UserRole.ADMIN
                      ? "/dashboard/admin/calendar"
                      : session?.user?.role === UserRole.COMMITTEE_MEMBER
                      ? "/dashboard/committee/calendar"
                      : "/dashboard/attendee/events"
                  }
                  endIcon={<ArrowForward />}
                >
                  View All Events
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Role-specific content */}
        {renderRoleSpecificContent()}
        
        {/* Recent activities */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Recent Activities
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                {recentActivities.map((activity) => (
                  <Grid item xs={12} md={6} lg={3} key={activity.id}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "rgba(0,0,0,0.02)",
                        display: "flex",
                        alignItems: "flex-start",
                      }}
                    >
                      <Avatar sx={{ mr: 2, bgcolor: "background.paper" }}>
                        {activity.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {activity.action}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {activity.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {activity.time}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
} 