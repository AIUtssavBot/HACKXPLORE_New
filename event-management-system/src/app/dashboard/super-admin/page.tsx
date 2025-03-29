'use client';

import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  Event,
  People,
  Assignment,
  Notifications,
  TrendingUp,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function SuperAdminDashboard() {
  // Sample data - replace with actual data from your API
  const stats = {
    totalEvents: 12,
    activeEvents: 3,
    totalUsers: 250,
    pendingApprovals: 5,
    recentActivity: [
      {
        type: 'event_created',
        title: 'Tech Conference 2024',
        timestamp: '2 hours ago',
      },
      {
        type: 'approval_pending',
        title: 'Hackathon Event',
        timestamp: '3 hours ago',
      },
      {
        type: 'user_registered',
        title: 'New Committee Member',
        timestamp: '5 hours ago',
      },
    ],
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              {title}
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Box>
          <IconButton sx={{ backgroundColor: color, color: 'white' }}>
            {icon}
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Super Admin Dashboard</Typography>
          <Button
            variant="contained"
            startIcon={<Event />}
            onClick={() => {/* Navigate to create event */}}
          >
            Create Event
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Events"
              value={stats.totalEvents}
              icon={<Event />}
              color="#1976d2"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Events"
              value={stats.activeEvents}
              icon={<TrendingUp />}
              color="#2e7d32"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={<People />}
              color="#ed6c02"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pending Approvals"
              value={stats.pendingApprovals}
              icon={<Assignment />}
              color="#d32f2f"
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Event Statistics
                </Typography>
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Active Events Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={70}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                {/* Add more statistics here */}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <Box>
                  {stats.recentActivity.map((activity, index) => (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      mt={2}
                      pb={2}
                      borderBottom={
                        index < stats.recentActivity.length - 1
                          ? '1px solid #eee'
                          : 'none'
                      }
                    >
                      <IconButton
                        size="small"
                        sx={{
                          backgroundColor:
                            activity.type === 'event_created'
                              ? '#e3f2fd'
                              : activity.type === 'approval_pending'
                              ? '#fff3e0'
                              : '#e8f5e9',
                          mr: 2,
                        }}
                      >
                        {activity.type === 'event_created' ? (
                          <Event color="primary" />
                        ) : activity.type === 'approval_pending' ? (
                          <Warning color="warning" />
                        ) : (
                          <CheckCircle color="success" />
                        )}
                      </IconButton>
                      <Box>
                        <Typography variant="subtitle2">
                          {activity.title}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {activity.timestamp}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
} 