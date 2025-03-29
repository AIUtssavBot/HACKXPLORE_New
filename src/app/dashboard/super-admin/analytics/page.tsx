"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Divider,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  EventAvailable,
  People,
  AttachMoney,
  TrendingUp,
  CalendarToday,
} from "@mui/icons-material";

// Dummy chart components - in a real app, you would use a library like Recharts, Chart.js, etc.
const LineChart = ({ data = [], title = "", height = 300 }) => (
  <Box sx={{ height, width: "100%", position: "relative" }}>
    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
      {title}
    </Typography>
    <Box
      sx={{
        height: "calc(100% - 25px)",
        background: "linear-gradient(180deg, rgba(25,118,210,0.1) 0%, rgba(25,118,210,0.01) 100%)",
        borderRadius: 1,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2px",
          bgcolor: "primary.main",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "70%",
          background:
            "linear-gradient(180deg, rgba(25,118,210,0.2) 0%, rgba(25,118,210,0) 100%)",
          clipPath: "polygon(0 100%, 10% 80%, 20% 90%, 30% 70%, 40% 85%, 50% 60%, 60% 75%, 70% 55%, 80% 70%, 90% 50%, 100% 60%, 100% 100%, 0 100%)",
        }}
      />
    </Box>
  </Box>
);

const BarChart = ({ data = [], title = "", height = 300 }) => (
  <Box sx={{ height, width: "100%", position: "relative" }}>
    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
      {title}
    </Typography>
    <Box
      sx={{
        height: "calc(100% - 25px)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        px: 2,
      }}
    >
      {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, i) => (
        <Box key={month} sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "14%" }}>
          <Box
            sx={{
              width: "100%",
              bgcolor: "primary.main",
              height: `${30 + Math.random() * 60}%`,
              borderRadius: "4px 4px 0 0",
            }}
          />
          <Typography variant="caption" sx={{ mt: 1 }}>
            {month}
          </Typography>
        </Box>
      ))}
    </Box>
  </Box>
);

const PieChart = ({ data = [], title = "", height = 300 }) => (
  <Box sx={{ height, width: "100%", position: "relative" }}>
    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
      {title}
    </Typography>
    <Box
      sx={{
        height: "calc(100% - 25px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "70%",
          height: "70%",
          borderRadius: "50%",
          position: "relative",
          overflow: "hidden",
          border: "4px solid white",
          boxShadow: "0px 0px 15px rgba(0,0,0,0.1)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: "conic-gradient(#1976d2 0% 45%, #42a5f5 45% 65%, #90caf9 65% 85%, #e3f2fd 85% 100%)",
          }}
        />
      </Box>
    </Box>
  </Box>
);

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: string;
}

const StatCard = ({ title, value, icon, trend, color = "primary.main" }: StatCardProps) => (
  <Card variant="outlined" sx={{ height: "100%" }}>
    <CardContent>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography color="text.secondary" variant="body2" fontWeight={500}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ my: 1, fontWeight: 600 }}>
            {value}
          </Typography>
          {trend && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                component="span"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: trend.isPositive ? "success.main" : "error.main",
                  typography: "body2",
                }}
              >
                <TrendingUp
                  fontSize="small"
                  sx={{
                    mr: 0.5,
                    transform: trend.isPositive ? "none" : "rotate(180deg)",
                  }}
                />
                {trend.value} {trend.isPositive ? "increase" : "decrease"}
              </Box>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            bgcolor: `${color}20`,
            borderRadius: "50%",
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: color,
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("month");
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Analytics Dashboard
          </Typography>
          <Typography color="text.secondary">
            Overview of event metrics and platform statistics
          </Typography>
        </Box>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Timeframe</InputLabel>
          <Select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            label="Timeframe"
          >
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="quarter">This Quarter</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Events"
            value="124"
            icon={<EventAvailable />}
            trend={{ value: "12%", isPositive: true }}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value="1,842"
            icon={<People />}
            trend={{ value: "8%", isPositive: true }}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Revenue"
            value="$24,500"
            icon={<AttachMoney />}
            trend={{ value: "5%", isPositive: true }}
            color="error.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Upcoming Events"
            value="18"
            icon={<CalendarToday />}
            color="warning.main"
          />
        </Grid>
      </Grid>

      {/* Chart Tabs */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Event Metrics" />
            <Tab label="User Analytics" />
            <Tab label="Revenue" />
          </Tabs>
        </Box>
        <CardContent>
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <LineChart 
                  title="Event Registrations Over Time"
                  height={350}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <PieChart 
                  title="Events by Category"
                  height={350}
                />
              </Grid>
            </Grid>
          )}
          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <LineChart 
                  title="New User Registrations" 
                  height={350}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <PieChart 
                  title="Users by Role"
                  height={350}
                />
              </Grid>
            </Grid>
          )}
          {tabValue === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <BarChart 
                  title="Monthly Revenue"
                  height={350}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <PieChart 
                  title="Revenue by Event Type"
                  height={350}
                />
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity & Top Events */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Box sx={{ mt: 2 }}>
                {[
                  {
                    title: "Tech Conference 2023",
                    type: "New Event Created",
                    time: "2 hours ago",
                    user: "Sarah Johnson",
                  },
                  {
                    title: "Workshop on AI",
                    type: "Event Updated",
                    time: "5 hours ago",
                    user: "Michael Williams",
                  },
                  {
                    title: "Robert Wilson",
                    type: "New User Registered",
                    time: "1 day ago",
                    user: "System",
                  },
                  {
                    title: "Cultural Festival",
                    type: "Event Approved",
                    time: "2 days ago",
                    user: "John Smith",
                  },
                  {
                    title: "Reimbursement Request",
                    type: "Payment Approved",
                    time: "3 days ago",
                    user: "John Smith",
                  },
                ].map((activity, i) => (
                  <Box key={i}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", py: 1.5 }}>
                      <Box>
                        <Typography variant="subtitle2">{activity.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {activity.type} by {activity.user}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Box>
                    {i < 4 && <Divider />}
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Performing Events
              </Typography>
              <Box sx={{ mt: 2 }}>
                {[
                  {
                    title: "Annual Tech Conference",
                    attendees: 240,
                    revenue: "$4,800",
                  },
                  {
                    title: "Cultural Festival",
                    attendees: 186,
                    revenue: "$3,720",
                  },
                  {
                    title: "Workshop on AI",
                    attendees: 120,
                    revenue: "$2,400",
                  },
                  {
                    title: "Career Fair",
                    attendees: 95,
                    revenue: "$1,900",
                  },
                ].map((event, i) => (
                  <Box key={i}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", py: 1.5 }}>
                      <Box>
                        <Typography variant="subtitle2">{event.title}</Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <People sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                            {event.attendees} attendees
                          </Typography>
                          <AttachMoney sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary">
                            {event.revenue}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    {i < 3 && <Divider />}
                  </Box>
                ))}
              </Box>
              <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
                View All Events
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}