"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import {
  Add,
  Search,
  MoreVert,
  Edit,
  Delete,
  Event,
  LocationOn,
  People,
  EventNote,
  CalendarToday,
  AccessTime,
  Category,
} from "@mui/icons-material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import toast from "react-hot-toast";

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  category: string;
  status: "pending" | "approved" | "rejected";
  capacity: number;
  organizingCommittee: string;
  createdBy: string;
  createdAt: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`event-tabpanel-${index}`}
      aria-labelledby={`event-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: "",
    description: "",
    location: "",
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2 hours later
    category: "",
    capacity: 100,
    organizingCommittee: "",
  });

  // Sample data
  useEffect(() => {
    const sampleEvents: Event[] = [
      {
        id: 1,
        title: "Annual Tech Conference",
        description: "A conference showcasing the latest in technology trends and innovations.",
        location: "Main Auditorium",
        startDate: new Date("2023-06-15T09:00:00"),
        endDate: new Date("2023-06-15T17:00:00"),
        category: "Technology",
        status: "approved",
        capacity: 300,
        organizingCommittee: "Technical Committee",
        createdBy: "Sarah Johnson",
        createdAt: "2023-05-01",
      },
      {
        id: 2,
        title: "Cultural Festival",
        description: "A celebration of diverse cultures with performances, food, and activities.",
        location: "Campus Ground",
        startDate: new Date("2023-05-20T18:00:00"),
        endDate: new Date("2023-05-20T22:00:00"),
        category: "Cultural",
        status: "approved",
        capacity: 500,
        organizingCommittee: "Cultural Committee",
        createdBy: "Michael Williams",
        createdAt: "2023-04-10",
      },
      {
        id: 3,
        title: "Workshop on AI",
        description: "Interactive workshop on artificial intelligence and machine learning fundamentals.",
        location: "Computer Lab 2",
        startDate: new Date("2023-07-05T14:00:00"),
        endDate: new Date("2023-07-05T17:00:00"),
        category: "Educational",
        status: "pending",
        capacity: 80,
        organizingCommittee: "Technical Committee",
        createdBy: "Emma Davis",
        createdAt: "2023-05-15",
      },
      {
        id: 4,
        title: "Career Fair",
        description: "Connect with top employers and explore career opportunities.",
        location: "College Gymnasium",
        startDate: new Date("2023-07-12T10:00:00"),
        endDate: new Date("2023-07-12T16:00:00"),
        category: "Career",
        status: "pending",
        capacity: 400,
        organizingCommittee: "Placement Committee",
        createdBy: "Sarah Johnson",
        createdAt: "2023-05-20",
      },
      {
        id: 5,
        title: "Alumni Meet",
        description: "Annual gathering for college alumni to network and reconnect.",
        location: "College Auditorium",
        startDate: new Date("2023-08-05T10:00:00"),
        endDate: new Date("2023-08-05T15:00:00"),
        category: "Networking",
        status: "approved",
        capacity: 200,
        organizingCommittee: "Alumni Association",
        createdBy: "Michael Williams",
        createdAt: "2023-05-25",
      },
    ];

    setEvents(sampleEvents);
    setFilteredEvents(sampleEvents);
  }, []);

  // Filter events based on search query and tab value
  useEffect(() => {
    let filtered = events;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by tab (status)
    if (tabValue === 1) {
      filtered = filtered.filter((event) => event.status === "approved");
    } else if (tabValue === 2) {
      filtered = filtered.filter((event) => event.status === "pending");
    }

    setFilteredEvents(filtered);
  }, [searchQuery, events, tabValue]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedEventId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedEventId(null);
  };

  const handleCreateEvent = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
    setNewEvent({
      title: "",
      description: "",
      location: "",
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
      category: "",
      capacity: 100,
      organizingCommittee: "",
    });
  };

  const handleCreateEventSubmit = () => {
    // Create new event
    const createdEvent: Event = {
      id: events.length + 1,
      ...newEvent as any,
      status: "pending", // New events start as pending
      createdBy: "Admin User", // In a real app, this would be the current user
      createdAt: new Date().toISOString().split("T")[0],
    };

    setEvents([...events, createdEvent]);
    toast.success("Event created successfully and sent for approval");
    handleCreateDialogClose();
  };

  const handleEditEvent = (event: Event) => {
    setEventToEdit(event);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEventToEdit(null);
  };

  const handleEditEventSubmit = () => {
    if (!eventToEdit) return;

    // Update event in the list
    const updatedEvents = events.map((event) =>
      event.id === eventToEdit.id ? eventToEdit : event
    );

    setEvents(updatedEvents);
    toast.success("Event updated successfully");
    handleEditDialogClose();
  };

  const handleDeleteEvent = (id: number) => {
    setEventToDelete(id);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setEventToDelete(null);
  };

  const handleDeleteEventConfirm = () => {
    if (!eventToDelete) return;

    // Remove event from the list
    const updatedEvents = events.filter((event) => event.id !== eventToDelete);
    setEvents(updatedEvents);

    toast.success("Event deleted successfully");
    handleDeleteDialogClose();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const getTabCount = (status: "approved" | "pending" | null) => {
    if (status === null) return events.length;
    return events.filter((event) => event.status === status).length;
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Event Management
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Create, manage and track events across your organization.
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <TextField
          placeholder="Search events..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ width: "350px" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleCreateEvent}
        >
          Create Event
        </Button>
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab 
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Event sx={{ mr: 1 }} />
                  <Typography>
                    All Events <Chip size="small" label={getTabCount(null)} color="primary" sx={{ ml: 1 }} />
                  </Typography>
                </Box>
              }
            />
            <Tab 
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <EventNote sx={{ mr: 1 }} />
                  <Typography>
                    Approved <Chip size="small" label={getTabCount("approved")} color="success" sx={{ ml: 1 }} />
                  </Typography>
                </Box>
              }
            />
            <Tab 
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CalendarToday sx={{ mr: 1 }} />
                  <Typography>
                    Pending <Chip size="small" label={getTabCount("pending")} color="warning" sx={{ ml: 1 }} />
                  </Typography>
                </Box>
              }
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <EventsTable />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <EventsTable />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <EventsTable />
        </TabPanel>
      </Card>

      {/* Create Event Dialog */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Dialog open={createDialogOpen} onClose={handleCreateDialogClose} maxWidth="md" fullWidth>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Event Title"
                  fullWidth
                  required
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Location"
                  fullWidth
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Capacity"
                  type="number"
                  fullWidth
                  value={newEvent.capacity}
                  onChange={(e) => setNewEvent({ ...newEvent, capacity: parseInt(e.target.value) || 0 })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <People fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Start Date & Time"
                  value={newEvent.startDate}
                  onChange={(newValue) => newValue && setNewEvent({ ...newEvent, startDate: newValue })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="End Date & Time"
                  value={newEvent.endDate}
                  onChange={(newValue) => newValue && setNewEvent({ ...newEvent, endDate: newValue })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newEvent.category || ""}
                    label="Category"
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                  >
                    <MenuItem value="Technology">Technology</MenuItem>
                    <MenuItem value="Cultural">Cultural</MenuItem>
                    <MenuItem value="Educational">Educational</MenuItem>
                    <MenuItem value="Sports">Sports</MenuItem>
                    <MenuItem value="Career">Career</MenuItem>
                    <MenuItem value="Networking">Networking</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Organizing Committee</InputLabel>
                  <Select
                    value={newEvent.organizingCommittee || ""}
                    label="Organizing Committee"
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, organizingCommittee: e.target.value })
                    }
                  >
                    <MenuItem value="Technical Committee">Technical Committee</MenuItem>
                    <MenuItem value="Cultural Committee">Cultural Committee</MenuItem>
                    <MenuItem value="Sports Committee">Sports Committee</MenuItem>
                    <MenuItem value="Placement Committee">Placement Committee</MenuItem>
                    <MenuItem value="Alumni Association">Alumni Association</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCreateDialogClose}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleCreateEventSubmit}
              disabled={!newEvent.title}
            >
              Create Event
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>

      {/* Edit Event Dialog */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Dialog open={editDialogOpen} onClose={handleEditDialogClose} maxWidth="md" fullWidth>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogContent dividers>
            {eventToEdit && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Event Title"
                    fullWidth
                    required
                    value={eventToEdit.title}
                    onChange={(e) =>
                      setEventToEdit({ ...eventToEdit, title: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                    value={eventToEdit.description}
                    onChange={(e) =>
                      setEventToEdit({ ...eventToEdit, description: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Location"
                    fullWidth
                    value={eventToEdit.location}
                    onChange={(e) =>
                      setEventToEdit({ ...eventToEdit, location: e.target.value })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Capacity"
                    type="number"
                    fullWidth
                    value={eventToEdit.capacity}
                    onChange={(e) =>
                      setEventToEdit({
                        ...eventToEdit,
                        capacity: parseInt(e.target.value) || 0,
                      })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <People fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DateTimePicker
                    label="Start Date & Time"
                    value={eventToEdit.startDate}
                    onChange={(newValue) => 
                      newValue && setEventToEdit({ ...eventToEdit, startDate: newValue })
                    }
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DateTimePicker
                    label="End Date & Time"
                    value={eventToEdit.endDate}
                    onChange={(newValue) => 
                      newValue && setEventToEdit({ ...eventToEdit, endDate: newValue })
                    }
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={eventToEdit.category}
                      label="Category"
                      onChange={(e) =>
                        setEventToEdit({ ...eventToEdit, category: e.target.value })
                      }
                    >
                      <MenuItem value="Technology">Technology</MenuItem>
                      <MenuItem value="Cultural">Cultural</MenuItem>
                      <MenuItem value="Educational">Educational</MenuItem>
                      <MenuItem value="Sports">Sports</MenuItem>
                      <MenuItem value="Career">Career</MenuItem>
                      <MenuItem value="Networking">Networking</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Organizing Committee</InputLabel>
                    <Select
                      value={eventToEdit.organizingCommittee}
                      label="Organizing Committee"
                      onChange={(e) =>
                        setEventToEdit({
                          ...eventToEdit,
                          organizingCommittee: e.target.value,
                        })
                      }
                    >
                      <MenuItem value="Technical Committee">Technical Committee</MenuItem>
                      <MenuItem value="Cultural Committee">Cultural Committee</MenuItem>
                      <MenuItem value="Sports Committee">Sports Committee</MenuItem>
                      <MenuItem value="Placement Committee">Placement Committee</MenuItem>
                      <MenuItem value="Alumni Association">Alumni Association</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {eventToEdit.status !== "approved" && (
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={eventToEdit.status}
                        label="Status"
                        onChange={(e) =>
                          setEventToEdit({
                            ...eventToEdit,
                            status: e.target.value as any,
                          })
                        }
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="approved">Approved</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditDialogClose}>Cancel</Button>
            <Button variant="contained" onClick={handleEditEventSubmit}>
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>

      {/* Delete Event Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this event? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteEventConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Events Table Component */}
      {function EventsTable() {
        return (
          <TableContainer component={Paper} elevation={0}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Event</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Capacity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <Box sx={{ maxWidth: 250 }}>
                          <Typography variant="subtitle2" noWrap>
                            {event.title}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                              display: '-webkit-box',
                              overflow: 'hidden',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 2,
                            }}
                          >
                            {event.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography variant="body2">
                            {formatDate(event.startDate)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatTime(event.startDate)} - {formatTime(event.endDate)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LocationOn fontSize="small" sx={{ mr: 0.5, color: "text.secondary" }} />
                          <Typography variant="body2">{event.location}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={event.category} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          icon={<Category fontSize="small" />}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <People fontSize="small" sx={{ mr: 0.5, color: "text.secondary" }} />
                          <Typography variant="body2">{event.capacity}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={event.status}
                          size="small"
                          color={getStatusChipColor(event.status) as any}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, event.id)}
                        >
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Box sx={{ textAlign: "center" }}>
                        <EventNote sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                        <Typography variant="h6">No events found</Typography>
                        <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
                          {searchQuery
                            ? "Try adjusting your search criteria"
                            : "Create your first event to get started"}
                        </Typography>
                        {!searchQuery && (
                          <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={handleCreateEvent}
                          >
                            Create Event
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        );
      }}

      {/* Event Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            const eventToEdit = events.find((event) => event.id === selectedEventId);
            if (eventToEdit) handleEditEvent(eventToEdit);
            handleMenuClose();
          }}
        >
          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => selectedEventId && handleDeleteEvent(selectedEventId)}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Box>
  );
} 