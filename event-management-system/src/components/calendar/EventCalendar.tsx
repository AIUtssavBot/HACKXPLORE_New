"use client";

import { useState, useCallback } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Box, Paper, Typography, Dialog, DialogTitle, DialogContent, Chip, Button, Grid } from "@mui/material";
import { AccessTime, Event, LocationOn, Person, Check, Pending } from "@mui/icons-material";

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

interface EventCalendarProps {
  events: CalendarEvent[];
  canCreateEvent?: boolean;
  onCreateEvent?: (start: Date, end: Date) => void;
  onSelectEvent?: (event: CalendarEvent) => void;
  userRole?: string;
}

export interface CalendarEvent {
  id: number | string;
  title: string;
  start: Date;
  end: Date;
  location: string;
  description?: string;
  status: "approved" | "pending" | "rejected";
  attendees?: number;
  organizingCommittee?: string;
  createdBy?: string;
}

export default function EventCalendar({
  events,
  canCreateEvent = false,
  onCreateEvent,
  onSelectEvent,
  userRole = "",
}: EventCalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleSelectEvent = useCallback(
    (event: CalendarEvent) => {
      setSelectedEvent(event);
      setOpenDialog(true);
      if (onSelectEvent) {
        onSelectEvent(event);
      }
    },
    [onSelectEvent]
  );

  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      if (canCreateEvent && onCreateEvent) {
        onCreateEvent(start, end);
      }
    },
    [canCreateEvent, onCreateEvent]
  );

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Event style based on status
  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor;
    let borderColor;

    if (event.status === "approved") {
      backgroundColor = "#10b981"; // green
      borderColor = "#059669";
    } else if (event.status === "pending") {
      backgroundColor = "#f59e0b"; // amber
      borderColor = "#d97706";
    } else {
      backgroundColor = "#ef4444"; // red
      borderColor = "#dc2626";
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderRadius: "4px",
        opacity: 0.9,
        color: "white",
        border: "0",
        display: "block",
      },
    };
  };

  return (
    <Box sx={{ height: "700px", p: 0 }}>
      <Paper
        elevation={0}
        sx={{
          height: "100%",
          p: 2,
          borderRadius: 2,
          border: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          selectable={canCreateEvent}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          eventPropGetter={eventStyleGetter}
          tooltipAccessor={(event) => event.title}
          popup
          components={{
            toolbar: CustomToolbar,
          }}
        />
      </Paper>

      {/* Event Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1,
          },
        }}
      >
        {selectedEvent && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h5" fontWeight={600}>
                  {selectedEvent.title}
                </Typography>
                <Chip
                  icon={selectedEvent.status === "approved" ? <Check /> : <Pending />}
                  label={selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1)}
                  color={selectedEvent.status === "approved" ? "success" : "warning"}
                  variant={selectedEvent.status === "approved" ? "filled" : "outlined"}
                  size="small"
                />
              </Box>
            </DialogTitle>
            <DialogContent sx={{ pt: 1 }}>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <AccessTime sx={{ mr: 1, color: "text.secondary" }} fontSize="small" />
                    <Typography variant="body1">
                      {moment(selectedEvent.start).format("MMM D, YYYY h:mm A")} -{" "}
                      {moment(selectedEvent.end).format("h:mm A")}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationOn sx={{ mr: 1, color: "text.secondary" }} fontSize="small" />
                    <Typography variant="body1">{selectedEvent.location}</Typography>
                  </Box>
                  {selectedEvent.organizingCommittee && (
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Event sx={{ mr: 1, color: "text.secondary" }} fontSize="small" />
                      <Typography variant="body1">
                        Organized by: {selectedEvent.organizingCommittee}
                      </Typography>
                    </Box>
                  )}
                  {selectedEvent.attendees !== undefined && (
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Person sx={{ mr: 1, color: "text.secondary" }} fontSize="small" />
                      <Typography variant="body1">{selectedEvent.attendees} Attendees</Typography>
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {selectedEvent.description && (
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                        Description
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedEvent.description}
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                {(userRole === "super_admin" || userRole === "admin") && selectedEvent.status === "pending" && (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      sx={{ mr: 1 }}
                      startIcon={<Check />}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ mr: 1 }}
                    >
                      Reject
                    </Button>
                  </>
                )}
                <Button variant="outlined" onClick={handleCloseDialog}>
                  Close
                </Button>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}

// Custom toolbar component
const CustomToolbar = (props: any) => {
  const { onNavigate, onView, label } = props;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Box>
        <Button onClick={() => onNavigate("TODAY")} sx={{ mr: 1 }}>
          Today
        </Button>
        <Button onClick={() => onNavigate("PREV")} sx={{ mr: 1 }}>
          Back
        </Button>
        <Button onClick={() => onNavigate("NEXT")}>Next</Button>
      </Box>
      <Typography variant="h6" fontWeight={600}>
        {label}
      </Typography>
      <Box>
        <Button onClick={() => onView(Views.MONTH)} sx={{ mr: 1 }}>
          Month
        </Button>
        <Button onClick={() => onView(Views.WEEK)} sx={{ mr: 1 }}>
          Week
        </Button>
        <Button onClick={() => onView(Views.DAY)} sx={{ mr: 1 }}>
          Day
        </Button>
        <Button onClick={() => onView(Views.AGENDA)}>Agenda</Button>
      </Box>
    </Box>
  );
}; 