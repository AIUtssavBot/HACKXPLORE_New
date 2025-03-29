"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Search,
  Event,
  LocationOn,
  AccessTime,
  People,
  Category,
  CalendarMonth,
  EventAvailable,
  EventBusy,
  CalendarToday,
  Info,
  Close,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { UserRole } from "@/models/User";
import QRCodeGenerator from "@/components/QRCodeGenerator";

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  category: string;
  capacity: number;
  registered: number;
  organizingCommittee: string;
  image: string;
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

export default function AttendeeEventsPage() {
  const { data: session } = useSession();
  const isAttendee = session?.user?.role === UserRole.ATTENDEE;
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventDetailsOpen, setEventDetailsOpen] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]); // IDs of events the user has registered for
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 0,
    comment: "",
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Sample data
  useEffect(() => {
    // In a real app, this would come from an API
    const sampleEvents: Event[] = [
      {
        id: 1,
        title: "Annual Tech Conference",
        description: "A conference showcasing the latest in technology trends and innovations. Join us for presentations, workshops, and networking opportunities with industry leaders.",
        location: "Main Auditorium",
        startDate: new Date("2023-06-15T09:00:00"),
        endDate: new Date("2023-06-15T17:00:00"),
        category: "Technology",
        capacity: 300,
        registered: 245,
        organizingCommittee: "Technical Committee",
        image: "/events/tech-conference.jpg",
      },
      {
        id: 2,
        title: "Cultural Festival",
        description: "A celebration of diverse cultures with performances, food, and activities. Experience traditions from around the world through music, dance, art, and culinary delights.",
        location: "Campus Ground",
        startDate: new Date("2023-05-20T18:00:00"),
        endDate: new Date("2023-05-20T22:00:00"),
        category: "Cultural",
        capacity: 500,
        registered: 320,
        organizingCommittee: "Cultural Committee",
        image: "/events/cultural-festival.jpg",
      },
      {
        id: 3,
        title: "Workshop on AI",
        description: "Interactive workshop on artificial intelligence and machine learning fundamentals. Learn practical skills and gain insights into the future of AI technology.",
        location: "Computer Lab 2",
        startDate: new Date("2023-07-05T14:00:00"),
        endDate: new Date("2023-07-05T17:00:00"),
        category: "Educational",
        capacity: 80,
        registered: 65,
        organizingCommittee: "Technical Committee",
        image: "/events/ai-workshop.jpg",
      },
      {
        id: 4,
        title: "Career Fair",
        description: "Connect with top employers and explore career opportunities. Bring your resume and prepare for on-site interviews with leading companies in various industries.",
        location: "College Gymnasium",
        startDate: new Date("2023-07-12T10:00:00"),
        endDate: new Date("2023-07-12T16:00:00"),
        category: "Career",
        capacity: 400,
        registered: 180,
        organizingCommittee: "Placement Committee",
        image: "/events/career-fair.jpg",
      },
      {
        id: 5,
        title: "Alumni Meet",
        description: "Annual gathering for college alumni to network and reconnect. Share experiences, build relationships, and explore collaboration opportunities with fellow graduates.",
        location: "College Auditorium",
        startDate: new Date("2023-08-05T10:00:00"),
        endDate: new Date("2023-08-05T15:00:00"),
        category: "Networking",
        capacity: 200,
        registered: 85,
        organizingCommittee: "Alumni Association",
        image: "/events/alumni-meet.jpg",
      },
      {
        id: 6,
        title: "Sports Tournament",
        description: "Inter-college sports competition featuring basketball, volleyball, and soccer. Come support your favorite teams or participate in the exciting matchups.",
        location: "Sports Complex",
        startDate: new Date("2023-07-20T09:00:00"),
        endDate: new Date("2023-07-22T18:00:00"),
        category: "Sports",
        capacity: 350,
        registered: 210,
        organizingCommittee: "Sports Committee",
        image: "/events/sports-tournament.jpg",
      },
    ];

    // Simulate registered events (in a real app, this would come from the user's profile)
    setRegisteredEvents([2, 5]);
    setEvents(sampleEvents);
    setFilteredEvents(sampleEvents);
    setIsLoading(false);
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

    // Filter by tab (registered vs upcoming)
    if (tabValue === 1) {
      filtered = filtered.filter((event) => registeredEvents.includes(event.id));
    }

    setFilteredEvents(filtered);
  }, [searchQuery, events, tabValue, registeredEvents]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleOpenEventDetails = (event: Event) => {
    setSelectedEvent(event);
    setEventDetailsOpen(true);
  };

  const handleCloseEventDetails = () => {
    setEventDetailsOpen(false);
  };

  const handleRegisterEvent = (eventId: number) => {
    // Check if already registered
    if (registeredEvents.includes(eventId)) {
      return;
    }

    // Check if event is full
    const event = events.find((e) => e.id === eventId);
    if (event && event.registered >= event.capacity) {
      toast.error("This event is at full capacity");
      return;
    }

    // Update registered events
    setRegisteredEvents([...registeredEvents, eventId]);

    // Update event registration count
    const updatedEvents = events.map((event) => {
      if (event.id === eventId) {
        return { ...event, registered: event.registered + 1 };
      }
      return event;
    });
    setEvents(updatedEvents);

    toast.success("Successfully registered for the event");
    
    // Close dialog if open
    if (eventDetailsOpen) {
      handleCloseEventDetails();
    }
  };

  const handleCancelRegistration = (eventId: number) => {
    // Check if registered
    if (!registeredEvents.includes(eventId)) {
      return;
    }

    // Update registered events
    setRegisteredEvents(registeredEvents.filter((id) => id !== eventId));

    // Update event registration count
    const updatedEvents = events.map((event) => {
      if (event.id === eventId) {
        return { ...event, registered: event.registered - 1 };
      }
      return event;
    });
    setEvents(updatedEvents);

    toast.success("Registration cancelled successfully");

    // Close dialog if open
    if (eventDetailsOpen) {
      handleCloseEventDetails();
    }
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

  const isEventFull = (event: Event) => {
    return event.registered >= event.capacity;
  };

  const getTabCount = (tabIndex: number) => {
    if (tabIndex === 0) return events.length;
    return registeredEvents.length;
  };

  // Open feedback dialog for a specific event
  const handleOpenFeedback = (event: Event) => {
    setSelectedEvent(event);
    setFeedbackForm({
      rating: 0,
      comment: "",
    });
    setFeedbackDialogOpen(true);
  };

  // Close feedback dialog
  const handleCloseFeedback = () => {
    setFeedbackDialogOpen(false);
    setSelectedEvent(null);
  };

  // Open event details dialog
  const handleOpenDetails = (event: Event) => {
    setSelectedEvent(event);
    setDetailsDialogOpen(true);
  };

  // Close event details dialog
  const handleCloseDetails = () => {
    setDetailsDialogOpen(false);
    setSelectedEvent(null);
  };

  // Handle feedback form input changes
  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFeedbackForm({
      ...feedbackForm,
      [name]: value,
    });
  };

  // Handle rating change
  const handleRatingChange = (_event: React.SyntheticEvent, newValue: number | null) => {
    setFeedbackForm({
      ...feedbackForm,
      rating: newValue || 0,
    });
  };

  // Submit feedback form
  const handleSubmitFeedback = async () => {
    if (feedbackForm.rating === 0) {
      return;
    }
    
    try {
      // In a real app, you would send the feedback to an API
      // const response = await fetch(`/api/events/${selectedEvent.id}/feedback`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     rating: feedbackForm.rating,
      //     comment: feedbackForm.comment,
      //   }),
      // });
      
      // Simulate API call with a delay
      setTimeout(() => {
        // Update the event in the state to mark feedback as provided
        setEvents(events.map(e => 
          e.id === selectedEvent?.id 
            ? { ...e, registered: e.registered + 1 } 
            : e
        ));
        
        setSuccessMessage("Thank you for your feedback!");
        handleCloseFeedback();
      }, 1000);
      
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  // Handle registration for an event
  const handleRegister = async (eventId: number) => {
    try {
      // In a real app, you would send the registration request to an API
      // const response = await fetch(`/api/events/${eventId}/register`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      // });
      
      // Simulate API call with a delay
      setTimeout(() => {
        // Update the event in the state to mark as registered
        setEvents(events.map(e => 
          e.id === eventId 
            ? { ...e, registered: e.registered + 1 } 
            : e
        ));
        
        setSuccessMessage("Successfully registered for the event!");
      }, 1000);
      
    } catch (error) {
      console.error("Error registering for event:", error);
    }
  };

  // Close success message snackbar
  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
  };

  // If user is not an attendee, show access denied
  if (!isAttendee) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Access denied. Only Attendees can access this page.
        </Alert>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Explore Events
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Discover and register for upcoming events across campus.
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
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab 
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CalendarToday sx={{ mr: 1 }} />
                <Typography>
                  All Events <Chip size="small" label={getTabCount(0)} color="primary" sx={{ ml: 1 }} />
                </Typography>
              </Box>
            }
          />
          <Tab 
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <EventAvailable sx={{ mr: 1 }} />
                <Typography>
                  My Registrations <Chip size="small" label={getTabCount(1)} color="success" sx={{ ml: 1 }} />
                </Typography>
              </Box>
            }
          />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <EventsGrid />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <EventsGrid />
      </TabPanel>

      {/* Event Details Dialog */}
      <Dialog 
        open={eventDetailsOpen} 
        onClose={handleCloseEventDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedEvent && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6">{selectedEvent.title}</Typography>
                <IconButton onClick={handleCloseEventDetails} size="small">
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                  <Box
                    sx={{
                      width: "100%",
                      height: 250,
                      backgroundColor: "grey.200",
                      mb: 2,
                      borderRadius: 1,
                      backgroundImage: `url(${selectedEvent.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedEvent.description}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Event Details
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                        <CalendarMonth sx={{ color: "text.secondary", mr: 1, mt: 0.5 }} />
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            Date
                          </Typography>
                          <Typography variant="body2">{formatDate(selectedEvent.startDate)}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                        <AccessTime sx={{ color: "text.secondary", mr: 1, mt: 0.5 }} />
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            Time
                          </Typography>
                          <Typography variant="body2">
                            {formatTime(selectedEvent.startDate)} - {formatTime(selectedEvent.endDate)}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                        <LocationOn sx={{ color: "text.secondary", mr: 1, mt: 0.5 }} />
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            Location
                          </Typography>
                          <Typography variant="body2">{selectedEvent.location}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                        <Category sx={{ color: "text.secondary", mr: 1, mt: 0.5 }} />
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            Category
                          </Typography>
                          <Typography variant="body2">{selectedEvent.category}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                        <People sx={{ color: "text.secondary", mr: 1, mt: 0.5 }} />
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            Capacity
                          </Typography>
                          <Typography variant="body2">
                            {selectedEvent.registered} / {selectedEvent.capacity} registered
                          </Typography>
                          <Box
                            sx={{
                              mt: 0.5,
                              height: 4,
                              width: "100%",
                              bgcolor: "grey.200",
                              borderRadius: 2,
                              position: "relative",
                              overflow: "hidden",
                            }}
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                height: "100%",
                                width: `${(selectedEvent.registered / selectedEvent.capacity) * 100}%`,
                                bgcolor: 
                                  isEventFull(selectedEvent) 
                                    ? "error.main" 
                                    : selectedEvent.registered / selectedEvent.capacity > 0.8 
                                      ? "warning.main" 
                                      : "success.main",
                                borderRadius: 2,
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    {registeredEvents.includes(selectedEvent.id) ? (
                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        onClick={() => handleCancelRegistration(selectedEvent.id)}
                        startIcon={<EventBusy />}
                      >
                        Cancel Registration
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => handleRegisterEvent(selectedEvent.id)}
                        startIcon={<EventAvailable />}
                        disabled={isEventFull(selectedEvent)}
                      >
                        {isEventFull(selectedEvent) ? "Event Full" : "Register Now"}
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Events Grid Component */}
      {function EventsGrid() {
        return (
          <Grid container spacing={3}>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event.id}>
                  <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <Box
                      sx={{
                        height: 160,
                        backgroundColor: "grey.200",
                        backgroundImage: `url(${event.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        position: "relative",
                      }}
                    >
                      <Chip
                        label={event.category}
                        size="small"
                        color="primary"
                        sx={{ position: "absolute", top: 10, left: 10 }}
                      />
                      {registeredEvents.includes(event.id) && (
                        <Chip
                          label="Registered"
                          size="small"
                          color="success"
                          sx={{ position: "absolute", top: 10, right: 10 }}
                        />
                      )}
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {event.title}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <CalendarMonth fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(event.startDate)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <AccessTime fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatTime(event.startDate)} - {formatTime(event.endDate)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <LocationOn fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                          {event.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <People fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                          {event.registered} / {event.capacity} registered
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          mt: 1,
                          height: 4,
                          width: "100%",
                          bgcolor: "grey.200",
                          borderRadius: 2,
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            height: "100%",
                            width: `${(event.registered / event.capacity) * 100}%`,
                            bgcolor: 
                              isEventFull(event) 
                                ? "error.main" 
                                : event.registered / event.capacity > 0.8 
                                  ? "warning.main" 
                                  : "success.main",
                            borderRadius: 2,
                          }}
                        />
                      </Box>
                    </CardContent>
                    <Divider />
                    <CardActions>
                      <Button 
                        startIcon={<Info />} 
                        onClick={() => handleOpenDetails(event)}
                        sx={{ ml: 1 }}
                      >
                        Details
                      </Button>
                      {registeredEvents.includes(event.id) ? (
                        <Button
                          color="error"
                          startIcon={<EventBusy />}
                          onClick={() => handleCancelRegistration(event.id)}
                          sx={{ ml: "auto" }}
                        >
                          Cancel
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<EventAvailable />}
                          onClick={() => handleRegisterEvent(event.id)}
                          disabled={isEventFull(event)}
                          sx={{ ml: "auto", mr: 1 }}
                        >
                          {isEventFull(event) ? "Full" : "Register"}
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 5,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                  }}
                >
                  <Event sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    No events found
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {searchQuery
                      ? "Try adjusting your search criteria"
                      : tabValue === 1
                      ? "You haven't registered for any events yet"
                      : "No upcoming events are currently available"}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        );
      }}

      {/* Event Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedEvent && (
          <>
            <DialogTitle sx={{ pr: 6 }}>
              {selectedEvent.title}
              <IconButton
                aria-label="close"
                onClick={handleCloseDetails}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                }}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <img
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    style={{ width: "100%", borderRadius: 8 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Event Details
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">Date & Time</Typography>
                    <Typography variant="body2" gutterBottom>
                      {formatDate(selectedEvent.startDate)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">Location</Typography>
                    <Typography variant="body2" gutterBottom>
                      {selectedEvent.location}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">Organizing Committee</Typography>
                    <Typography variant="body2" gutterBottom>
                      {selectedEvent.organizingCommittee}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">Attendees</Typography>
                    <Typography variant="body2" gutterBottom>
                      {selectedEvent.registered} / {selectedEvent.capacity}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">Status</Typography>
                    <Chip
                      label={registeredEvents.includes(selectedEvent.id) ? "Registered" : "Not Registered"}
                      color={registeredEvents.includes(selectedEvent.id) ? "primary" : "default"}
                      size="small"
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {selectedEvent.description}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetails}>Close</Button>
              
              {!registeredEvents.includes(selectedEvent.id) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleRegisterEvent(selectedEvent.id);
                    handleCloseDetails();
                  }}
                >
                  Register for Event
                </Button>
              )}
              
              {registeredEvents.includes(selectedEvent.id) && (
                <Button
                  variant="contained"
                  color="success"
                  component="span"
                >
                  Show QR Codes
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog
        open={feedbackDialogOpen}
        onClose={handleCloseFeedback}
        maxWidth="sm"
        fullWidth
      >
        {selectedEvent && (
          <>
            <DialogTitle>
              Provide Feedback: {selectedEvent.title}
              <IconButton
                aria-label="close"
                onClick={handleCloseFeedback}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                }}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Your feedback helps us improve future events. Please share your experience.
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography component="legend" gutterBottom>
                  How would you rate this event?
                </Typography>
                <Rating
                  name="feedback-rating"
                  value={feedbackForm.rating}
                  onChange={handleRatingChange}
                  precision={0.5}
                  size="large"
                  sx={{ fontSize: "2rem" }}
                />
              </Box>
              
              <TextField
                name="comment"
                label="Comments (Optional)"
                value={feedbackForm.comment}
                onChange={handleFeedbackChange}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder="Please share your thoughts, suggestions, or any issues you experienced..."
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseFeedback}>Cancel</Button>
              <Button
                onClick={handleSubmitFeedback}
                variant="contained"
                color="primary"
                disabled={feedbackForm.rating === 0}
              >
                Submit Feedback
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Success Message Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
} 