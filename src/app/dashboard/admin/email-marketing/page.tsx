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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert,
  Snackbar,
  Paper,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Send as SendIcon,
  Preview as PreviewIcon,
  Save as SaveIcon,
  Add as AddIcon,
  AutoAwesome as AutoAwesomeIcon,
} from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { UserRole } from "@/models/User";

// Sample email templates for demonstration
const EMAIL_TEMPLATES = [
  {
    id: "template1",
    name: "Gold Sponsorship Request",
    subject: "Invitation to Sponsor Our Upcoming Tech Event",
    body: "Dear [Company Name],\n\nWe are excited to invite you to sponsor our upcoming tech event, [Event Name], which will be held on [Event Date] at [Event Location].\n\nAs a Gold Sponsor, you will receive:\n- Prime logo placement on all event materials\n- A dedicated booth in our exhibition area\n- 5 complimentary tickets for your team\n- A 10-minute speaking slot during the main program\n\nWe believe this partnership would benefit [Company Name] by providing excellent exposure to over 500 attendees, including professionals, academics, and students in the tech industry.\n\nPlease let us know if you're interested in this opportunity.\n\nBest regards,\n[Your Name]\n[Your Position]\n[Committee Name]",
  },
  {
    id: "template2",
    name: "Silver Sponsorship Request",
    subject: "Partner with Us for an Exciting Campus Event",
    body: "Dear [Company Name],\n\nI am writing on behalf of [Committee Name] to invite you to become a Silver Sponsor for our upcoming event, [Event Name].\n\nScheduled for [Event Date] at [Event Location], this event will bring together over 300 attendees, providing an excellent opportunity for brand exposure and networking.\n\nAs a Silver Sponsor, your package includes:\n- Logo placement on our event website and program\n- A standard booth in our exhibition area\n- 3 complimentary tickets\n- Acknowledgment during the opening ceremony\n\nWe would be honored to have [Company Name] associated with our event and believe this partnership would be mutually beneficial.\n\nThank you for considering our proposal.\n\nSincerely,\n[Your Name]\n[Your Position]\n[Committee Name]",
  },
];

// Mock list of companies for demonstration
const COMPANIES = [
  { id: "c1", name: "TechCorp Solutions", industry: "Technology", email: "sponsorships@techcorp.com", contactPerson: "Alex Johnson" },
  { id: "c2", name: "InnovateCo", industry: "Software", email: "partnerships@innovateco.com", contactPerson: "Sam Wilson" },
  { id: "c3", name: "NextGen Systems", industry: "Hardware", email: "marketing@nextgensystems.com", contactPerson: "Jamie Smith" },
  { id: "c4", name: "Digital Dynamics", industry: "Digital Services", email: "sponsors@digitaldynamics.com", contactPerson: "Taylor Brown" },
];

// Mock list of committee members for CC'ing
const COMMITTEE_MEMBERS = [
  { id: "m1", name: "Raj Kumar", email: "raj.kumar@committee.org", role: "Marketing Lead" },
  { id: "m2", name: "Priya Singh", email: "priya.singh@committee.org", role: "Event Coordinator" },
  { id: "m3", name: "Akash Patel", email: "akash.patel@committee.org", role: "Finance Manager" },
];

// Sample events for the dropdown
const EVENTS = [
  { id: "e1", name: "Annual Tech Summit 2023", date: "December 15, 2023", location: "Main Auditorium" },
  { id: "e2", name: "Hackathon Spring 2024", date: "March 20-22, 2024", location: "Innovation Hub" },
  { id: "e3", name: "AI Workshop Series", date: "February 5-10, 2024", location: "Computer Science Building" },
];

export default function EmailMarketingPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === UserRole.ADMIN || session?.user?.role === UserRole.SUPER_ADMIN;
  
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [ccMembers, setCcMembers] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Handle template selection
  const handleTemplateChange = (event: SelectChangeEvent) => {
    const templateId = event.target.value;
    setSelectedTemplate(templateId);
    
    if (templateId) {
      const template = EMAIL_TEMPLATES.find(t => t.id === templateId);
      if (template) {
        setSubject(template.subject);
        setEmailBody(template.body);
      }
    }
  };

  // Handle event selection
  const handleEventChange = (event: SelectChangeEvent) => {
    setSelectedEvent(event.target.value);
    
    // Update email body with event details if a template is selected
    if (selectedTemplate && event.target.value) {
      const eventInfo = EVENTS.find(e => e.id === event.target.value);
      if (eventInfo) {
        let updatedBody = emailBody;
        updatedBody = updatedBody.replace(/\[Event Name\]/g, eventInfo.name);
        updatedBody = updatedBody.replace(/\[Event Date\]/g, eventInfo.date);
        updatedBody = updatedBody.replace(/\[Event Location\]/g, eventInfo.location);
        setEmailBody(updatedBody);
      }
    }
  };

  // Handle company selection
  const handleCompanyChange = (event: SelectChangeEvent<string[]>) => {
    const values = event.target.value as string[];
    setSelectedCompanies(values);
  };

  // Handle committee members selection for CC
  const handleCcChange = (event: SelectChangeEvent<string[]>) => {
    const values = event.target.value as string[];
    setCcMembers(values);
  };

  // Generate email using AI
  const handleGenerateEmail = async () => {
    if (!selectedEvent) {
      setErrorMessage("Please select an event first.");
      return;
    }
    
    setIsGeneratingEmail(true);
    
    try {
      // In a real app, this would call an API endpoint that uses the AI agent
      // const response = await fetch('/api/ai/generate-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     eventId: selectedEvent,
      //     targetCompanies: selectedCompanies.map(id => COMPANIES.find(c => c.id === id)),
      //   }),
      // });
      // const data = await response.json();
      // setEmailBody(data.emailBody);
      // setSubject(data.subject);
      
      // Simulate API call with a delay
      setTimeout(() => {
        const event = EVENTS.find(e => e.id === selectedEvent);
        
        const generatedSubject = `Partnership Opportunity: ${event?.name} - Exclusive Sponsorship Invitation`;
        
        const generatedBody = `Dear [Company Name],

We are excited to invite you to be a valued sponsor for our upcoming event, ${event?.name}, scheduled for ${event?.date} at ${event?.location}.

This prestigious event will bring together industry leaders, innovators, and students for a day of learning, networking, and collaboration. With an expected attendance of over 500 participants, this represents an excellent opportunity for your brand to gain significant visibility within our community.

As a sponsor, you would receive:
• Premium logo placement on all event materials and digital platforms
• Dedicated exhibition space to showcase your products and services
• Speaking opportunities during key sessions
• Direct access to talented students for recruitment purposes
• Inclusion in our post-event marketing materials

We offer several sponsorship tiers (Platinum, Gold, and Silver) to accommodate different levels of involvement and investment. We would be happy to provide you with a detailed sponsorship package outlining the specific benefits of each tier.

${event?.name} aligns perfectly with your company's commitment to innovation and education, and we believe this partnership would be mutually beneficial.

Please let me know if you would be interested in discussing this opportunity further. I would be delighted to schedule a call to provide additional information.

Thank you for your consideration.

Best regards,
${session?.user?.name}
${session?.user?.role === UserRole.ADMIN ? "Admin" : "Event Coordinator"}
[Committee Name]`;
        
        setSubject(generatedSubject);
        setEmailBody(generatedBody);
        setSuccessMessage("Email generated successfully with AI!");
        setIsGeneratingEmail(false);
      }, 2000);
      
    } catch (error) {
      console.error("Error generating email:", error);
      setErrorMessage("Failed to generate email. Please try again.");
      setIsGeneratingEmail(false);
    }
  };

  // Preview the email for a specific company
  const getPreviewForCompany = (companyId: string) => {
    const company = COMPANIES.find(c => c.id === companyId);
    if (!company) return emailBody;
    
    let preview = emailBody;
    preview = preview.replace(/\[Company Name\]/g, company.name);
    preview = preview.replace(/\[Contact Person\]/g, company.contactPerson);
    return preview;
  };

  // Send emails
  const handleSendEmails = async () => {
    if (selectedCompanies.length === 0) {
      setErrorMessage("Please select at least one company.");
      return;
    }
    
    if (!subject || !emailBody) {
      setErrorMessage("Email subject and body cannot be empty.");
      return;
    }
    
    setIsSendingEmail(true);
    
    try {
      // In a real app, this would call an API endpoint that sends emails
      // const response = await fetch('/api/email/send-bulk', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     subject,
      //     body: emailBody,
      //     companies: selectedCompanies.map(id => COMPANIES.find(c => c.id === id)),
      //     ccMembers: ccMembers.map(id => COMMITTEE_MEMBERS.find(m => m.id === id)),
      //     eventId: selectedEvent,
      //   }),
      // });
      
      // Simulate API call with a delay
      setTimeout(() => {
        const companiesCount = selectedCompanies.length;
        setSuccessMessage(`Successfully sent emails to ${companiesCount} companies!`);
        setIsSendingEmail(false);
        
        // Reset form after successful sending
        setSelectedCompanies([]);
      }, 2000);
      
    } catch (error) {
      console.error("Error sending emails:", error);
      setErrorMessage("Failed to send emails. Please try again.");
      setIsSendingEmail(false);
    }
  };

  // Save template
  const handleSaveTemplate = () => {
    if (!subject || !emailBody) {
      setErrorMessage("Email subject and body cannot be empty.");
      return;
    }
    
    // In a real app, this would call an API endpoint to save the template
    setSuccessMessage("Email template saved successfully!");
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  // If user is not an admin, show access denied
  if (!isAdmin) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Access denied. Only Admin and Super Admin users can access this page.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Email Marketing <Chip label="Admin" color="primary" size="small" sx={{ ml: 1 }} />
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Create and send bulk custom emails to sponsors and partners
      </Typography>

      <Grid container spacing={3}>
        {/* Email Configuration Section */}
        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Email Configuration
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Event</InputLabel>
                <Select
                  value={selectedEvent}
                  onChange={handleEventChange}
                  label="Select Event"
                >
                  {EVENTS.map((event) => (
                    <MenuItem key={event.id} value={event.id}>
                      {event.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Template</InputLabel>
                <Select
                  value={selectedTemplate}
                  onChange={handleTemplateChange}
                  label="Select Template"
                >
                  <MenuItem value="">
                    <em>None (Start from scratch)</em>
                  </MenuItem>
                  {EMAIL_TEMPLATES.map((template) => (
                    <MenuItem key={template.id} value={template.id}>
                      {template.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                startIcon={<AutoAwesomeIcon />}
                onClick={handleGenerateEmail}
                disabled={isGeneratingEmail || !selectedEvent}
                fullWidth
                sx={{ mb: 2 }}
              >
                {isGeneratingEmail ? (
                  <>
                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                    Generating...
                  </>
                ) : (
                  "Generate with AI"
                )}
              </Button>

              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Recipients
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Target Companies</InputLabel>
                <Select
                  multiple
                  value={selectedCompanies}
                  onChange={handleCompanyChange}
                  label="Target Companies"
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => {
                        const company = COMPANIES.find((c) => c.id === value);
                        return company ? (
                          <Chip key={value} label={company.name} size="small" />
                        ) : null;
                      })}
                    </Box>
                  )}
                >
                  {COMPANIES.map((company) => (
                    <MenuItem key={company.id} value={company.id}>
                      {company.name} ({company.industry})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>CC Committee Members</InputLabel>
                <Select
                  multiple
                  value={ccMembers}
                  onChange={handleCcChange}
                  label="CC Committee Members"
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => {
                        const member = COMMITTEE_MEMBERS.find(
                          (m) => m.id === value
                        );
                        return member ? (
                          <Chip key={value} label={member.name} size="small" />
                        ) : null;
                      })}
                    </Box>
                  )}
                >
                  {COMMITTEE_MEMBERS.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
                      {member.name} ({member.role})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SendIcon />}
                  onClick={handleSendEmails}
                  disabled={
                    isSendingEmail ||
                    selectedCompanies.length === 0 ||
                    !subject ||
                    !emailBody
                  }
                  fullWidth
                >
                  {isSendingEmail ? (
                    <>
                      <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                      Sending...
                    </>
                  ) : (
                    "Send Emails"
                  )}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveTemplate}
                  disabled={!subject || !emailBody}
                >
                  Save
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Email Editor Section */}
        <Grid item xs={12} md={8}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6">Email Content</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PreviewIcon />}
                  onClick={() => setPreviewMode(!previewMode)}
                >
                  {previewMode ? "Edit Mode" : "Preview Mode"}
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <TextField
                label="Subject"
                variant="outlined"
                fullWidth
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                sx={{ mb: 2 }}
              />

              {previewMode && selectedCompanies.length > 0 ? (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Preview for selected companies:
                  </Typography>
                  {selectedCompanies.map((companyId) => {
                    const company = COMPANIES.find((c) => c.id === companyId);
                    return (
                      <Accordion key={companyId} elevation={1} sx={{ mb: 1 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography>{company?.name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="body2" paragraph>
                              <strong>To:</strong> {company?.email}
                            </Typography>
                            <Typography variant="body2" paragraph>
                              <strong>Subject:</strong> {subject}
                            </Typography>
                            <Divider sx={{ my: 1 }} />
                            <Typography
                              variant="body2"
                              sx={{ whiteSpace: "pre-wrap" }}
                            >
                              {getPreviewForCompany(companyId)}
                            </Typography>
                          </Paper>
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                </Box>
              ) : (
                <TextField
                  label="Email Body"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={20}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  sx={{ mb: 2 }}
                  placeholder="Write your email content here..."
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Success/Error Messages */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" elevation={6}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" elevation={6}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
} 