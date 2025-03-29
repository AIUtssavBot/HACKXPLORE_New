"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Divider,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  Check,
  Close,
  Event,
  EventNote,
  Person,
  Payment,
  CalendarMonth,
  AccountCircle,
  LocationOn,
  Description,
  AttachMoney,
  ReceiptLong,
  Category,
} from "@mui/icons-material";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

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
      id={`permissions-tabpanel-${index}`}
      aria-labelledby={`permissions-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

interface PendingEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  organizer: string;
  description: string;
  attendees: number;
}

interface PendingReimbursement {
  id: number;
  requestedBy: string;
  event: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  billImage: string;
}

export default function PermissionsPage() {
  const { data: session } = useSession();
  const [tabValue, setTabValue] = useState(0);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedReimbursementId, setSelectedReimbursementId] = useState<number | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [itemToReject, setItemToReject] = useState<{ type: "event" | "reimbursement"; id: number } | null>(null);

  // Sample data (in a real app, this would come from an API)
  const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>([
    {
      id: 1,
      title: "Cultural Festival",
      date: "May 20, 2023 (6:00 PM - 10:00 PM)",
      location: "Campus Ground",
      organizer: "John Smith (Cultural Committee)",
      description: "A celebration of diverse cultures with performances, food, and activities",
      attendees: 250,
    },
    {
      id: 2,
      title: "Alumni Meet",
      date: "June 5, 2023 (10:00 AM - 3:00 PM)",
      location: "College Auditorium",
      organizer: "Michael Williams (Alumni Association)",
      description: "Annual gathering of college alumni",
      attendees: 180,
    },
    {
      id: 3,
      title: "Coding Hackathon",
      date: "June 12, 2023 (9:00 AM - 9:00 PM)",
      location: "Computer Science Building",
      organizer: "Emma Davis (Technical Committee)",
      description: "24-hour coding competition for students to showcase their programming skills",
      attendees: 120,
    },
  ]);

  const [pendingReimbursements, setPendingReimbursements] = useState<PendingReimbursement[]>([
    {
      id: 1,
      requestedBy: "David Wilson",
      event: "Tech Conference 2023",
      amount: 120,
      description: "Purchased supplies for event setup",
      category: "Supplies",
      date: "April 30, 2023",
      billImage: "/receipt.jpg",
    },
    {
      id: 2,
      requestedBy: "Sarah Johnson",
      event: "Workshop on AI",
      amount: 85.5,
      description: "Refreshments for workshop participants",
      category: "Food & Beverages",
      date: "May 5, 2023",
      billImage: "/receipt.jpg",
    },
    {
      id: 3,
      requestedBy: "Robert Brown",
      event: "Cultural Festival",
      amount: 250,
      description: "Decoration materials for the festival",
      category: "Decoration",
      date: "May 10, 2023",
      billImage: "/receipt.jpg",
    },
  ]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEventExpand = (id: number) => {
    setSelectedEventId(selectedEventId === id ? null : id);
  };

  const handleReimbursementExpand = (id: number) => {
    setSelectedReimbursementId(selectedReimbursementId === id ? null : id);
  };

  const handleApprove = (type: "event" | "reimbursement", id: number) => {
    if (type === "event") {
      const updatedEvents = pendingEvents.filter((event) => event.id !== id);
      setPendingEvents(updatedEvents);
      toast.success("Event approved successfully");
    } else {
      const updatedReimbursements = pendingReimbursements.filter((reimbursement) => reimbursement.id !== id);
      setPendingReimbursements(updatedReimbursements);
      toast.success("Reimbursement approved successfully");
    }
  };

  const handleOpenRejectDialog = (type: "event" | "reimbursement", id: number) => {
    setItemToReject({ type, id });
    setRejectDialogOpen(true);
  };

  const handleCloseRejectDialog = () => {
    setRejectDialogOpen(false);
    setRejectReason("");
    setItemToReject(null);
  };

  const handleReject = () => {
    if (!itemToReject) return;

    if (itemToReject.type === "event") {
      const updatedEvents = pendingEvents.filter((event) => event.id !== itemToReject.id);
      setPendingEvents(updatedEvents);
      toast.success("Event rejected");
    } else {
      const updatedReimbursements = pendingReimbursements.filter(
        (reimbursement) => reimbursement.id !== itemToReject.id
      );
      setPendingReimbursements(updatedReimbursements);
      toast.success("Reimbursement rejected");
    }

    handleCloseRejectDialog();
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Permission Requests
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Manage event and reimbursement approval requests from admins and committee members.
      </Typography>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
        variant="fullWidth"
      >
        <Tab
          label={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Event sx={{ mr: 1 }} />
              <Typography>
                Event Requests <Chip size="small" label={pendingEvents.length} color="primary" sx={{ ml: 1 }} />
              </Typography>
            </Box>
          }
        />
        <Tab
          label={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Payment sx={{ mr: 1 }} />
              <Typography>
                Reimbursement Requests{" "}
                <Chip size="small" label={pendingReimbursements.length} color="primary" sx={{ ml: 1 }} />
              </Typography>
            </Box>
          }
        />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        {pendingEvents.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: "center", py: 5 }}>
              <EventNote sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6">No Pending Event Requests</Typography>
              <Typography color="text.secondary">All event requests have been processed.</Typography>
            </CardContent>
          </Card>
        ) : (
          pendingEvents.map((event) => (
            <Card key={event.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                    <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                      <Event />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{event.title}</Typography>
                      <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary", mt: 0.5 }}>
                        <CalendarMonth fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">{event.date}</Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<Check />}
                      sx={{ mr: 1 }}
                      onClick={() => handleApprove("event", event.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<Close />}
                      onClick={() => handleOpenRejectDialog("event", event.id)}
                    >
                      Reject
                    </Button>
                  </Box>
                </Box>

                <Button
                  onClick={() => handleEventExpand(event.id)}
                  sx={{ mt: 2, textTransform: "none", color: "text.secondary" }}
                >
                  {selectedEventId === event.id ? "Show Less" : "Show More"}
                </Button>

                {selectedEventId === event.id && (
                  <Box sx={{ mt: 2 }}>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                          <LocationOn sx={{ color: "text.secondary", mr: 1, mt: 0.5 }} />
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Location
                            </Typography>
                            <Typography variant="body2">{event.location}</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                          <Person sx={{ color: "text.secondary", mr: 1, mt: 0.5 }} />
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Expected Attendees
                            </Typography>
                            <Typography variant="body2">{event.attendees} people</Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                          <AccountCircle sx={{ color: "text.secondary", mr: 1, mt: 0.5 }} />
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Organizer
                            </Typography>
                            <Typography variant="body2">{event.organizer}</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                          <Description sx={{ color: "text.secondary", mr: 1, mt: 0.5 }} />
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Description
                            </Typography>
                            <Typography variant="body2">{event.description}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {pendingReimbursements.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: "center", py: 5 }}>
              <Payment sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6">No Pending Reimbursement Requests</Typography>
              <Typography color="text.secondary">All reimbursement requests have been processed.</Typography>
            </CardContent>
          </Card>
        ) : (
          pendingReimbursements.map((reimbursement) => (
            <Card key={reimbursement.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                    <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
                      <Payment />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">Reimbursement Request</Typography>
                      <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary", mt: 0.5 }}>
                        <Person fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">{reimbursement.requestedBy}</Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<Check />}
                      sx={{ mr: 1 }}
                      onClick={() => handleApprove("reimbursement", reimbursement.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<Close />}
                      onClick={() => handleOpenRejectDialog("reimbursement", reimbursement.id)}
                    >
                      Reject
                    </Button>
                  </Box>
                </Box>

                <Button
                  onClick={() => handleReimbursementExpand(reimbursement.id)}
                  sx={{ mt: 2, textTransform: "none", color: "text.secondary" }}
                >
                  {selectedReimbursementId === reimbursement.id ? "Show Less" : "Show More"}
                </Button>

                {selectedReimbursementId === reimbursement.id && (
                  <Box sx={{ mt: 2 }}>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                          <Event sx={{ color: "text.secondary", mr: 1, mt: 0.5 }} />
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Event
                            </Typography>
                            <Typography variant="body2">{reimbursement.event}</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                          <AttachMoney sx={{ color: "text.secondary", mr: 1, mt: 0.5 }} />
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Amount
                            </Typography>
                            <Typography variant="body2">${reimbursement.amount.toFixed(2)}</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                          <CalendarMonth sx={{ color: "text.secondary", mr: 1, mt: 0.5 }} />
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Date
                            </Typography>
                            <Typography variant="body2">{reimbursement.date}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                          <Category sx={{ color: "text.secondary", mr: 1, mt: 0.5 }} />
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Category
                            </Typography>
                            <Typography variant="body2">{reimbursement.category}</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                          <Description sx={{ color: "text.secondary", mr: 1, mt: 0.5 }} />
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Description
                            </Typography>
                            <Typography variant="body2">{reimbursement.description}</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                          <ReceiptLong sx={{ color: "text.secondary", mr: 1, mt: 0.5 }} />
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Bill Image
                            </Typography>
                            <Button size="small" color="primary">
                              View Receipt
                            </Button>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </TabPanel>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={handleCloseRejectDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Reject {itemToReject?.type === "event" ? "Event" : "Reimbursement"}</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Please provide a reason for rejecting this {itemToReject?.type === "event" ? "event" : "reimbursement"}.
          </Typography>
          <TextField
            label="Reason for Rejection"
            fullWidth
            multiline
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectDialog}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleReject}
            disabled={!rejectReason.trim()}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 