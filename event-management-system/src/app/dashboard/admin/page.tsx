'use client';

import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Email,
  Event,
  Chat,
  Assignment,
  TrendingUp,
  AttachMoney,
  Campaign,
  Close,
} from '@mui/icons-material';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function AdminDashboard() {
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('');

  // Sample data - replace with actual data from your API
  const stats = {
    activeEvents: 5,
    pendingReimbursements: 8,
    marketingCampaigns: 3,
    totalAttendees: 450,
    recentEmails: [
      {
        company: 'Tech Corp',
        status: 'sent',
        date: '2024-03-28',
      },
      {
        company: 'Innovation Labs',
        status: 'draft',
        date: '2024-03-27',
      },
    ],
    upcomingEvents: [
      {
        title: 'Tech Summit 2024',
        date: '2024-04-15',
        attendees: 200,
      },
      {
        title: 'Coding Workshop',
        date: '2024-04-20',
        attendees: 50,
      },
    ],
  };

  // Sample companies - replace with actual data
  const companies = [
    { name: 'Tech Corp', industry: 'Technology' },
    { name: 'Innovation Labs', industry: 'Research' },
    { name: 'Digital Solutions', industry: 'Software' },
  ];

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

  const handleGenerateEmail = async () => {
    // Implement email generation using AI agent
    setOpenEmailDialog(false);
  };

  return (
    <DashboardLayout>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Admin Dashboard</Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<Email />}
              onClick={() => setOpenEmailDialog(true)}
              sx={{ mr: 2 }}
            >
              Generate Sponsorship Email
            </Button>
            <Button
              variant="contained"
              startIcon={<Event />}
              onClick={() => {/* Navigate to create event */}}
            >
              Create Event
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Events"
              value={stats.activeEvents}
              icon={<Event />}
              color="#1976d2"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pending Reimbursements"
              value={stats.pendingReimbursements}
              icon={<AttachMoney />}
              color="#2e7d32"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Marketing Campaigns"
              value={stats.marketingCampaigns}
              icon={<Campaign />}
              color="#ed6c02"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Attendees"
              value={stats.totalAttendees}
              icon={<TrendingUp />}
              color="#9c27b0"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Sponsorship Emails
                </Typography>
                <Box>
                  {stats.recentEmails.map((email, index) => (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      mt={2}
                      pb={2}
                      borderBottom={
                        index < stats.recentEmails.length - 1
                          ? '1px solid #eee'
                          : 'none'
                      }
                    >
                      <Box>
                        <Typography variant="subtitle2">
                          {email.company}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {email.date}
                        </Typography>
                      </Box>
                      <Chip
                        label={email.status}
                        color={email.status === 'sent' ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Upcoming Events
                </Typography>
                <Box>
                  {stats.upcomingEvents.map((event, index) => (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      mt={2}
                      pb={2}
                      borderBottom={
                        index < stats.upcomingEvents.length - 1
                          ? '1px solid #eee'
                          : 'none'
                      }
                    >
                      <Box>
                        <Typography variant="subtitle2">
                          {event.title}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {event.date}
                        </Typography>
                      </Box>
                      <Chip
                        label={`${event.attendees} attendees`}
                        color="primary"
                        size="small"
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Dialog
          open={openEmailDialog}
          onClose={() => setOpenEmailDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              Generate Sponsorship Email
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => setOpenEmailDialog(false)}
                aria-label="close"
              >
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box mt={2}>
              <TextField
                select
                fullWidth
                label="Select Company"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                margin="normal"
              >
                {companies.map((company) => (
                  <MenuItem key={company.name} value={company.name}>
                    {company.name} - {company.industry}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEmailDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleGenerateEmail}
              disabled={!selectedCompany}
            >
              Generate Email
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
} 