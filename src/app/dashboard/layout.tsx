"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Box, CircularProgress } from "@mui/material";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  
  // Show loading indicator while session is loading
  if (status === "loading") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  
  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    redirect("/auth/login");
  }
  
  return <DashboardLayout>{children}</DashboardLayout>;
} 