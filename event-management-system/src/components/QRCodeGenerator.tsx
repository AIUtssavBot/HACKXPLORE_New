"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Tooltip,
  IconButton,
} from "@mui/material";
import QRCode from "qrcode.react";
import { Info as InfoIcon, Download as DownloadIcon } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { UserRole } from "@/models/User";

interface QRCodeGeneratorProps {
  type: "entry" | "exit";
  eventId: string;
  eventName: string;
}

export default function QRCodeGenerator({
  type,
  eventId,
  eventName,
}: QRCodeGeneratorProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [scanned, setScanned] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setScanned(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDownload = () => {
    const canvas = document.getElementById("qr-code") as HTMLCanvasElement;
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `${type}-qrcode-${eventName.replace(/\s+/g, "-").toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // In a real application, this would be a unique code for each user and event
  const generateQRValue = () => {
    const userId = session?.user?.id || "user123";
    const timestamp = Date.now();
    const eventType = type;
    
    // Unique QR code for each user/event/time combination
    return JSON.stringify({
      userId,
      eventId,
      type: eventType,
      timestamp,
      // A secret hash could be added here for security
    });
  };

  // This function would be called when a QR code is scanned in a real app
  const simulateScan = () => {
    setScanned(true);
    
    // In a real app, this would call an API to record the entry/exit
    setTimeout(() => {
      // After recording, we could show a success message
    }, 1500);
  };

  const getQRButtonColor = () => {
    return type === "entry" ? "success" : "info";
  };

  const getQRTitle = () => {
    return type === "entry" ? "Event Entry QR Code" : "Event Exit QR Code";
  };

  const getQRDescription = () => {
    if (type === "entry") {
      return "Show this QR code at the event entrance to record your attendance.";
    } else {
      return "Scan this QR code when leaving the event. You'll be asked to provide feedback about your experience.";
    }
  };

  // Only attendees should see QR codes
  if (session?.user?.role !== UserRole.ATTENDEE) {
    return null;
  }

  return (
    <>
      <Button
        variant="contained"
        color={getQRButtonColor()}
        onClick={handleOpen}
        sx={{
          px: 3,
          py: 1.5,
          borderRadius: 2,
          fontSize: "1rem",
          boxShadow: 3,
          transition: "transform 0.2s",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      >
        {type === "entry" ? "Show Entry QR Code" : "Show Exit QR Code"}
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 10,
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: type === "entry" ? "success.main" : "info.main",
            color: "white",
            textAlign: "center",
          }}
        >
          {getQRTitle()}
        </DialogTitle>
        
        <DialogContent sx={{ textAlign: "center", p: 4 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">{eventName}</Typography>
            <Typography color="text.secondary">{getQRDescription()}</Typography>
          </Box>
          
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: "inline-block",
              position: "relative",
              bgcolor: "#ffffff",
              borderRadius: 2,
              maxWidth: "100%",
            }}
          >
            {scanned && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: "rgba(255, 255, 255, 0.8)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h6"
                  color="success.main"
                  sx={{ fontWeight: "bold" }}
                >
                  Scanned Successfully!
                </Typography>
                {type === "exit" && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Please fill out the feedback form.
                  </Typography>
                )}
              </Box>
            )}
            
            <QRCode
              id="qr-code"
              value={generateQRValue()}
              size={200}
              level="H"
              renderAs="canvas"
              includeMargin
              bgColor="#ffffff"
              fgColor="#000000"
            />
            
            <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
              <Tooltip title="Download QR Code">
                <IconButton color="primary" onClick={handleDownload}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="For demonstration, click to simulate scanning">
                <IconButton color="secondary" onClick={simulateScan}>
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>
          
          <Typography
            variant="caption"
            sx={{ display: "block", mt: 2, color: "text.secondary" }}
          >
            This QR code is unique to you and this event.
            {type === "exit" && " Scanning it will prompt you to provide feedback."}
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, justifyContent: "center" }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            color={type === "entry" ? "success" : "info"}
          >
            Close
          </Button>
          {type === "exit" && !scanned && (
            <Button
              onClick={simulateScan}
              variant="contained"
              color="primary"
            >
              Simulate Scan
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
} 