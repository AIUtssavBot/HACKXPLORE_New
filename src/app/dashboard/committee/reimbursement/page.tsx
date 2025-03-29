"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { UserRole } from "@/models/User";
import toast from "react-hot-toast";

// Mock event data for the dropdown
const MOCK_EVENTS = [
  { id: "e1", name: "Annual Tech Summit 2023", committee: "Technical" },
  { id: "e2", name: "Hackathon Spring 2024", committee: "Technical" },
  { id: "e3", name: "Cultural Night 2023", committee: "Cultural" },
  { id: "e4", name: "Sports Meet 2024", committee: "Sports" },
];

// Mock previous reimbursement requests
const MOCK_REQUESTS = [
  {
    id: "r1",
    eventId: "e1",
    eventName: "Annual Tech Summit 2023",
    amount: 1250.75,
    description: "Catering services for participants",
    billImage: "/mock-images/bill1.jpg",
    status: "approved",
    submittedAt: new Date(2023, 10, 15),
    receiptNumber: "RCPT-001",
  },
  {
    id: "r2",
    eventId: "e2",
    eventName: "Hackathon Spring 2024",
    amount: 850.00,
    description: "T-shirts for participants",
    billImage: "/mock-images/bill2.jpg",
    status: "pending",
    submittedAt: new Date(2023, 11, 5),
  },
  {
    id: "r3",
    eventId: "e3",
    eventName: "Cultural Night 2023",
    amount: 450.50,
    description: "Decoration materials",
    billImage: "/mock-images/bill3.jpg",
    status: "rejected",
    submittedAt: new Date(2023, 9, 20),
    comments: "Please provide a detailed breakdown of expenses",
  },
];

// Department options
const DEPARTMENTS = [
  "Technical",
  "Cultural",
  "Sports",
  "Finance",
  "Marketing",
  "Logistics",
  "Hospitality",
];

export default function ReimbursementRequestPage() {
  const { data: session } = useSession();
  const isCommitteeMember = session?.user?.role === UserRole.COMMITTEE_MEMBER;
  
  const [formData, setFormData] = useState({
    eventId: "",
    amount: "",
    description: "",
    department: "",
    receiptNumber: "",
  });
  const [billImage, setBillImage] = useState<File | null>(null);
  const [billPreview, setBillPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle select changes
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBillImage(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setBillPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset the form
  const resetForm = () => {
    setFormData({
      eventId: "",
      amount: "",
      description: "",
      department: "",
      receiptNumber: "",
    });
    setBillImage(null);
    setBillPreview(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.eventId || !formData.amount || !formData.description || !formData.department || !billImage) {
      toast.error("Please fill in all the required fields and upload a bill image");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would upload the image and submit the form data to an API
      // const formDataToSend = new FormData();
      // formDataToSend.append('eventId', formData.eventId);
      // formDataToSend.append('amount', formData.amount);
      // formDataToSend.append('description', formData.description);
      // formDataToSend.append('department', formData.department);
      // formDataToSend.append('receiptNumber', formData.receiptNumber);
      // formDataToSend.append('billImage', billImage);
      
      // const response = await fetch('/api/reimbursements', {
      //   method: 'POST',
      //   body: formDataToSend,
      // });
      
      // Simulate API call with a delay
      setTimeout(() => {
        toast.success("Reimbursement request submitted successfully!");
        resetForm();
        setIsSubmitting(false);
      }, 1500);
      
    } catch (error) {
      console.error("Error submitting reimbursement request:", error);
      toast.error("Failed to submit reimbursement request. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Open preview dialog for a request
  const handleOpenPreview = (request: any) => {
    setSelectedRequest(request);
    setPreviewDialogOpen(true);
  };

  // Close preview dialog
  const handleClosePreview = () => {
    setPreviewDialogOpen(false);
    setSelectedRequest(null);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      default:
        return "warning";
    }
  };

  // If user is not a committee member, show access denied
  if (!isCommitteeMember) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Access denied. Only Committee Members can access this page.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Reimbursement Requests <Chip label="Committee" color="secondary" size="small" sx={{ ml: 1 }} />
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Submit and track your expense reimbursement requests
      </Typography>

      <Grid container spacing={3}>
        {/* Reimbursement Form */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                New Reimbursement Request
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <form onSubmit={handleSubmit}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Event</InputLabel>
                  <Select
                    name="eventId"
                    value={formData.eventId}
                    onChange={handleSelectChange}
                    label="Event"
                    required
                  >
                    {MOCK_EVENTS.map((event) => (
                      <MenuItem key={event.id} value={event.id}>
                        {event.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Department</InputLabel>
                  <Select
                    name="department"
                    value={formData.department}
                    onChange={handleSelectChange}
                    label="Department"
                    required
                  >
                    {DEPARTMENTS.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />

                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  multiline
                  rows={3}
                  sx={{ mb: 2 }}
                  placeholder="Provide a detailed description of the expense"
                />

                <TextField
                  label="Receipt Number (Optional)"
                  name="receiptNumber"
                  value={formData.receiptNumber}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{ mb: 2 }}
                  placeholder="Enter the receipt number if available"
                />

                <Box sx={{ mb: 2 }}>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="bill-image-upload"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="bill-image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      sx={{ mb: 1 }}
                      fullWidth
                    >
                      Upload Bill Image
                    </Button>
                  </label>
                  {billPreview && (
                    <Box
                      sx={{
                        mt: 1,
                        p: 1,
                        border: "1px dashed #ccc",
                        borderRadius: 1,
                        textAlign: "center",
                      }}
                    >
                      <img
                        src={billPreview}
                        alt="Bill preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "200px",
                          objectFit: "contain",
                        }}
                      />
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        {billImage?.name} ({Math.round(billImage?.size / 1024)} KB)
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  disabled={isSubmitting}
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Previous Requests */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Recent Requests
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <List sx={{ width: "100%" }}>
                {MOCK_REQUESTS.map((request) => (
                  <Paper
                    key={request.id}
                    elevation={1}
                    sx={{ mb: 2, overflow: "hidden" }}
                  >
                    <ListItem
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="view"
                          onClick={() => handleOpenPreview(request)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <ReceiptIcon color="action" />
                            <Typography variant="subtitle1">
                              {request.eventName}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              ₹{request.amount.toFixed(2)}
                            </Typography>
                            {" — "}
                            {request.description}
                            <Box sx={{ mt: 0.5 }}>
                              <Chip
                                label={request.status}
                                color={getStatusColor(request.status) as any}
                                size="small"
                              />
                              <Typography
                                component="span"
                                variant="caption"
                                sx={{ ml: 1 }}
                              >
                                {new Date(request.submittedAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </>
                        }
                      />
                    </ListItem>
                  </Paper>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Request Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        onClose={handleClosePreview}
        maxWidth="sm"
        fullWidth
      >
        {selectedRequest && (
          <>
            <DialogTitle>
              Reimbursement Request Details
              <Chip
                label={selectedRequest.status}
                color={getStatusColor(selectedRequest.status) as any}
                size="small"
                sx={{ ml: 1 }}
              />
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Event</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {selectedRequest.eventName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Amount</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    ₹{selectedRequest.amount.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Submitted On</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {new Date(selectedRequest.submittedAt).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Receipt Number</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {selectedRequest.receiptNumber || "Not provided"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Description</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {selectedRequest.description}
                  </Typography>
                </Grid>
                {selectedRequest.comments && (
                  <Grid item xs={12}>
                    <Alert severity={selectedRequest.status === "rejected" ? "error" : "info"}>
                      <Typography variant="subtitle2">Comments</Typography>
                      {selectedRequest.comments}
                    </Alert>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Bill Image</Typography>
                  <Box
                    sx={{
                      mt: 1,
                      width: "100%",
                      textAlign: "center",
                      border: "1px solid #eee",
                      borderRadius: 1,
                      p: 1,
                    }}
                  >
                    <img
                      src={selectedRequest.billImage || "/mock-images/default-bill.png"}
                      alt="Bill"
                      style={{ maxWidth: "100%", maxHeight: "300px" }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosePreview}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
} 