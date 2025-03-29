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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Assignment,
  AttachMoney,
  Event,
  People,
  Close,
  Add,
  CloudUpload,
} from '@mui/icons-material';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function CommitteeDashboard() {
  const [openReimbursementDialog, setOpenReimbursementDialog] = useState(false);
  const [reimbursementData, setReimbursementData] = useState({
    amount: '',
    description: '',
    category: '',
    billImage: null as File | null,
  });

  // Sample data - replace with actual data from your API
  const stats = {
    assignedTasks: 12,
    completedTasks: 8,
    pendingReimbursements: 3,
    teamMembers: 15,
    tasks: [
      {
        title: 'Contact Sponsors',
        deadline: '2024-04-01',
        priority: 'high',
        status: 'in_progress',
      },
      {
        title: 'Prepare Venue',
        deadline: '2024-04-05',
        priority: 'medium',
        status: 'pending',
      },
    ],
    recentReimbursements: [
      {
        description: 'Marketing Materials',
        amount: 250,
        status: 'approved',
        date: '2024-03-25',
      },
      {
        description: 'Venue Booking Advance',
        amount: 1000,
        status: 'pending',
        date: '2024-03-28',
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

  const handleReimbursementSubmit = async () => {
    // Implement reimbursement submission
    setOpenReimbursementDialog(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setReimbursementData({
        ...reimbursementData,
        billImage: event.target.files[0],
      });
    }
  };

  return (
    <DashboardLayout>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Committee Dashboard</Typography>
          <Button
            variant="contained"
            startIcon={<AttachMoney />}
            onClick={() => setOpenReimbursementDialog(true)}
          >
            Submit Reimbursement
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Assigned Tasks"
              value={stats.assignedTasks}
              icon={<Assignment />}
              color="#1976d2"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Completed Tasks"
              value={stats.completedTasks}
              icon={<Assignment />}
              color="#2e7d32"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pending Reimbursements"
              value={stats.pendingReimbursements}
              icon={<AttachMoney />}
              color="#ed6c02"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Team Members"
              value={stats.teamMembers}
              icon={<People />}
              color="#9c27b0"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Current Tasks
                </Typography>
                <Box>
                  {stats.tasks.map((task, index) => (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      mt={2}
                      pb={2}
                      borderBottom={
                        index < stats.tasks.length - 1
                          ? '1px solid #eee'
                          : 'none'
                      }
                    >
                      <Box>
                        <Typography variant="subtitle2">
                          {task.title}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Due: {task.deadline}
                        </Typography>
                      </Box>
                      <Box display="flex" gap={1}>
                        <Chip
                          label={task.priority}
                          color={
                            task.priority === 'high'
                              ? 'error'
                              : task.priority === 'medium'
                              ? 'warning'
                              : 'default'
                          }
                          size="small"
                        />
                        <Chip
                          label={task.status.replace('_', ' ')}
                          color={
                            task.status === 'completed'
                              ? 'success'
                              : task.status === 'in_progress'
                              ? 'primary'
                              : 'default'
                          }
                          size="small"
                        />
                      </Box>
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
                  Recent Reimbursements
                </Typography>
                <Box>
                  {stats.recentReimbursements.map((reimbursement, index) => (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      mt={2}
                      pb={2}
                      borderBottom={
                        index < stats.recentReimbursements.length - 1
                          ? '1px solid #eee'
                          : 'none'
                      }
                    >
                      <Box>
                        <Typography variant="subtitle2">
                          {reimbursement.description}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          ₹{reimbursement.amount} • {reimbursement.date}
                        </Typography>
                      </Box>
                      <Chip
                        label={reimbursement.status}
                        color={
                          reimbursement.status === 'approved'
                            ? 'success'
                            : reimbursement.status === 'rejected'
                            ? 'error'
                            : 'default'
                        }
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
          open={openReimbursementDialog}
          onClose={() => setOpenReimbursementDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              Submit Reimbursement Request
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => setOpenReimbursementDialog(false)}
                aria-label="close"
              >
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box mt={2} display="flex" flexDirection="column" gap={2}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={reimbursementData.amount}
                onChange={(e) =>
                  setReimbursementData({
                    ...reimbursementData,
                    amount: e.target.value,
                  })
                }
              />
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={reimbursementData.description}
                onChange={(e) =>
                  setReimbursementData({
                    ...reimbursementData,
                    description: e.target.value,
                  })
                }
              />
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={reimbursementData.category}
                  label="Category"
                  onChange={(e) =>
                    setReimbursementData({
                      ...reimbursementData,
                      category: e.target.value,
                    })
                  }
                >
                  <MenuItem value="marketing">Marketing</MenuItem>
                  <MenuItem value="venue">Venue</MenuItem>
                  <MenuItem value="equipment">Equipment</MenuItem>
                  <MenuItem value="refreshments">Refreshments</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUpload />}
                sx={{ mt: 1 }}
              >
                Upload Bill Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              {reimbursementData.billImage && (
                <Typography variant="caption" color="textSecondary">
                  Selected file: {reimbursementData.billImage.name}
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenReimbursementDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleReimbursementSubmit}
              disabled={
                !reimbursementData.amount ||
                !reimbursementData.description ||
                !reimbursementData.category ||
                !reimbursementData.billImage
              }
            >
              Submit Request
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
} 