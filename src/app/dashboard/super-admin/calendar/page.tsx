"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, TextField, MenuItem, Grid, DialogActions } from "@mui/material";
import { Add } from "@mui/icons-material";
import EventCalendar, { CalendarEvent } from "@/components/calendar/EventCalendar";
import { UserRole } from "@/models/User";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

// Sample event data (in a real app, this would come from an API)
const sampleEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "Tech Conference 2023",
    start: new Date(2023, 4, 15, 9, 0),
    end: new Date(2023, 4, 15, 17, 0),
    location: "Main Auditorium",
    description: "Annual technology conference showcasing the latest innovations",
    status: "approved",
    attendees: 120,
    organizingCommittee: "Technical Committee",
    createdBy: "Jane Doe",
  },
  {
    id: 2,
    title: "Cultural Festival",
    start: new Date(2023, 4, 20, 18, 0),
    end: new Date(2023, 4, 20, 22, 0),
    location: "Campus Ground",
    description: "A celebration of diverse cultures with performances, food, and activities",
    status: "pending",
    attendees: 250,
    organizingCommittee: "Cultural Committee",
    createdBy: "John Smith",
  },
  {
    id: 3,
    title: "Workshop on AI",
    start: new Date(2023, 4, 25, 14, 0),
    end: new Date(2023, 4, 25, 16, 0),
    location: "Room 302",
    description: "An introduction to artificial intelligence concepts and applications",
    status: "approved",
    attendees: 45,
    organizingCommittee: "Technical Committee",
    createdBy: "Alex Johnson",
  },
  {
    id: 4,
    title: "Alumni Meet",
    start: new Date(2023, 5, 5, 10, 0),
    end: new Date(2023, 5, 5, 15, 0),
    location: "College Auditorium",
    description: "Annual gathering of college alumni",
    status: "pending",
    attendees: 180,
    organizingCommittee: "Alumni Association",
    createdBy: "Michael Williams",
  },
];

export default function SuperAdminCalendarPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    location: "",
    description: "",
    organizingCommittee: "",
  });

  useEffect(() => {
    // In a real app, you would fetch events from an API
    setEvents(sampleEvents);
  }, []);

  const handleCreateEvent = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
    setIsCreateDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
    setNewEvent({
      title: "",
      location: "",
      description: "",
      organizingCommittee: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name as string]: value,
    });
  };

  const handleSubmit = () => {
    if (!startDate || !endDate) return;

    const newEventObj: CalendarEvent = {
      id: Date.now(), // Use a more robust ID in production
      title: newEvent.title,
      start: startDate,
      end: endDate,
      location: newEvent.location,
      description: newEvent.description,
      status: "approved", // Super admin can directly create approved events
      organizingCommittee: newEvent.organizingCommittee,
      createdBy: session?.user?.name || "Unknown",
    };

    setEvents([...events, newEventObj]);
    toast.success("Event created successfully");
    handleCloseDialog();
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          Event Calendar
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => {
            const now = new Date();
            const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
            handleCreateEvent(now, oneHourLater);
          }}
        >
          Create Event
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Calendar Overview
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            View and manage all events across committees. As a Super Admin, you can approve or reject event
            requests and create new events. Events are color-coded by status:
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: 1,
                  bgcolor: "#10b981",
                  mr: 1,
                }}
              />
              <Typography variant="body2">Approved</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: 1,
                  bgcolor: "#f59e0b",
                  mr: 1,
                }}
              />
              <Typography variant="body2">Pending</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: 1,
                  bgcolor: "#ef4444",
                  mr: 1,
                }}
              />
              <Typography variant="body2">Rejected</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <EventCalendar
        events={events}
        canCreateEvent={true}
        onCreateEvent={handleCreateEvent}
        userRole={UserRole.SUPER_ADMIN}
      />

      {/* Create Event Dialog */}
      <Dialog open={isCreateDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Event Title"
                fullWidth
                required
                value={newEvent.title}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="location"
                label="Location"
                fullWidth
                required
                value={newEvent.location}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="organizingCommittee"
                label="Organizing Committee"
                fullWidth
                required
                value={newEvent.organizingCommittee}
                onChange={handleInputChange}
                select
              >
                <MenuItem value="Technical Committee">Technical Committee</MenuItem>
                <MenuItem value="Cultural Committee">Cultural Committee</MenuItem>
                <MenuItem value="Sports Committee">Sports Committee</MenuItem>
                <MenuItem value="Alumni Association">Alumni Association</MenuItem>
                <MenuItem value="Marketing Team">Marketing Team</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Start Date & Time"
                type="datetime-local"
                fullWidth
                required
                value={startDate ? new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="End Date & Time"
                type="datetime-local"
                fullWidth
                required
                value={endDate ? new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""}
                onChange={(e) => setEndDate(new Date(e.target.value))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={newEvent.description}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!newEvent.title || !newEvent.location || !startDate || !endDate || !newEvent.organizingCommittee}
          >
            Create Event
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 