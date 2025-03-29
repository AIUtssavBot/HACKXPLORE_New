"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  IconButton,
  Fade,
  Grow,
} from "@mui/material";
import {
  Event,
  People,
  Analytics,
  EventNote,
  Chat,
  QrCode,
  ArrowForward,
} from "@mui/icons-material";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [animationComplete, setAnimationComplete] = useState(false);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  // Trigger animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      title: "Event Management",
      description: "Create, schedule, and manage events with powerful tools and AI assistance.",
      icon: <Event fontSize="large" sx={{ color: "primary.main" }} />,
    },
    {
      title: "Attendance Tracking",
      description: "Track attendees with QR code check-in/check-out system and real-time statistics.",
      icon: <QrCode fontSize="large" sx={{ color: "secondary.main" }} />,
    },
    {
      title: "Team Collaboration",
      description: "Chat with your team, assign tasks, and coordinate efforts efficiently.",
      icon: <Chat fontSize="large" sx={{ color: "tertiary.main" }} />,
    },
    {
      title: "Analytics & Insights",
      description: "Get AI-powered insights and analytics to improve future events.",
      icon: <Analytics fontSize="large" sx={{ color: "accent.main" }} />,
    },
    {
      title: "Reimbursement System",
      description: "Streamlined process for expense tracking and reimbursement approvals.",
      icon: <EventNote fontSize="large" sx={{ color: "primary.main" }} />,
    },
    {
      title: "Role-Based Access",
      description: "Customized interfaces and permissions for different user roles.",
      icon: <People fontSize="large" sx={{ color: "secondary.main" }} />,
    },
  ];

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)",
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "rgba(37, 99, 235, 0.1)",
          filter: "blur(40px)",
          animation: "float 15s infinite ease-in-out",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "15%",
          right: "10%",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background: "rgba(124, 58, 237, 0.1)",
          filter: "blur(40px)",
          animation: "float 12s infinite ease-in-out reverse",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(5, 150, 105, 0.1)",
          filter: "blur(30px)",
          animation: "float 20s infinite ease-in-out",
          zIndex: 0,
        }}
      />

      {/* Hero section */}
      <Container maxWidth="lg" sx={{ pt: 8, pb: 6, position: "relative", zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={1000}>
              <Box>
                <Typography
                  variant="h2"
                  component="h1"
                  fontWeight={700}
                  gutterBottom
                  sx={{
                    background: "linear-gradient(90deg, #2563eb 0%, #7c3aed 50%, #db2777 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 2,
                  }}
                >
                  AI-Driven Event Management System
                </Typography>
                <Typography variant="h5" color="text.secondary" paragraph>
                  Streamline your event planning, management, and execution with our powerful AI-enhanced platform. 
                  Perfect for committee organizations, clubs, and institutions.
                </Typography>
                <Box sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    component={Link}
                    href="/auth/login"
                    sx={{ mr: 2, px: 4, py: 1.5, fontSize: "1rem", borderRadius: 2 }}
                  >
                    Log In
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    component={Link}
                    href="/auth/register"
                    sx={{ px: 4, py: 1.5, fontSize: "1rem", borderRadius: 2 }}
                  >
                    Sign Up
                  </Button>
                </Box>
              </Box>
            </Fade>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grow in={animationComplete} timeout={1000}>
              <Paper
                elevation={6}
                sx={{
                  height: 400,
                  borderRadius: 4,
                  overflow: "hidden",
                  background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h3" sx={{ color: "white", fontWeight: 600, textAlign: "center", p: 4 }}>
                  Revolutionize Your Events
                </Typography>
              </Paper>
            </Grow>
          </Grid>
        </Grid>
      </Container>

      {/* Features section */}
      <Box sx={{ py: 8, background: "white", position: "relative", zIndex: 1 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom fontWeight={600} sx={{ mb: 6 }}>
            Powerful Features
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Grow in={true} timeout={(index + 1) * 300}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 20px -8px rgba(0,0,0,0.2)",
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h5" component="h3" align="center" gutterBottom fontWeight={600}>
                        {feature.title}
                      </Typography>
                      <Typography align="center" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to action */}
      <Box
        sx={{
          py: 8,
          background: "linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h3" component="h2" gutterBottom fontWeight={600} color="white">
              Ready to Transform Your Events?
            </Typography>
            <Typography variant="h6" paragraph color="white" sx={{ opacity: 0.9, mb: 4 }}>
              Join us today and experience the power of AI-driven event management.
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={Link}
              href="/auth/register"
              sx={{
                bgcolor: "white",
                color: "primary.main",
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                borderRadius: 2,
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.9)",
                },
                fontWeight: 600,
              }}
              endIcon={<ArrowForward />}
            >
              Get Started
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} AI-Driven Event Management System. All rights reserved.
          </Typography>
        </Container>
      </Box>

      {/* CSS for animation */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(30px, 20px) rotate(5deg);
          }
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
        }
      `}</style>
    </Box>
  );
} 