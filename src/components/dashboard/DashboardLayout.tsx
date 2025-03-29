"use client";

import { useState, ReactNode } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
  useTheme,
  Badge,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  Event,
  EventNote,
  People,
  Analytics,
  Chat,
  CalendarMonth,
  QrCode,
  Notifications,
  Person,
  Logout,
  Settings,
  Email,
  Article,
  AccountBalance,
  Psychology,
  CreditCard,
  SportsEsports,
} from "@mui/icons-material";
import Link from "next/link";
import { UserRole } from "@/models/User";

const drawerWidth = 260;

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
  const { data: session } = useSession();
  const pathname = usePathname();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  // Define navigation based on user role
  const getNavigationItems = () => {
    const userRole = session?.user?.role;
    
    // Common items for all roles
    const commonItems = [
      {
        text: "Dashboard",
        icon: <Dashboard />,
        href: "/dashboard",
      },
    ];
    
    // Role-specific items
    const roleSpecificItems = {
      [UserRole.SUPER_ADMIN]: [
        {
          text: "Calendar",
          icon: <CalendarMonth />,
          href: "/dashboard/super-admin/calendar",
        },
        {
          text: "Permission Requests",
          icon: <EventNote />,
          href: "/dashboard/super-admin/permissions",
        },
        {
          text: "Admin Management",
          icon: <People />,
          href: "/dashboard/super-admin/admins",
        },
        {
          text: "Committee Management",
          icon: <People />,
          href: "/dashboard/super-admin/committees",
        },
        {
          text: "Analytics",
          icon: <Analytics />,
          href: "/dashboard/super-admin/analytics",
        },
      ],
      [UserRole.ADMIN]: [
        {
          text: "Calendar",
          icon: <CalendarMonth />,
          href: "/dashboard/admin/calendar",
        },
        {
          text: "Create Event",
          icon: <Event />,
          href: "/dashboard/admin/create-event",
        },
        {
          text: "Team Chat",
          icon: <Chat />,
          href: "/dashboard/admin/chat",
        },
        {
          text: "PR & Marketing",
          icon: <Email />,
          href: "/dashboard/admin/marketing",
        },
        {
          text: "Reimbursements",
          icon: <CreditCard />,
          href: "/dashboard/admin/reimbursements",
        },
        {
          text: "Committee Management",
          icon: <People />,
          href: "/dashboard/admin/committees",
        },
        {
          text: "Attendees",
          icon: <People />,
          href: "/dashboard/admin/attendees",
        },
        {
          text: "Content Recommendations",
          icon: <Psychology />,
          href: "/dashboard/admin/recommendations",
        },
        {
          text: "Analytics",
          icon: <Analytics />,
          href: "/dashboard/admin/analytics",
        },
      ],
      [UserRole.COMMITTEE_MEMBER]: [
        {
          text: "Calendar",
          icon: <CalendarMonth />,
          href: "/dashboard/committee/calendar",
        },
        {
          text: "Team Chat",
          icon: <Chat />,
          href: "/dashboard/committee/chat",
        },
        {
          text: "Attendees",
          icon: <People />,
          href: "/dashboard/committee/attendees",
        },
        {
          text: "Task Planner",
          icon: <EventNote />,
          href: "/dashboard/committee/tasks",
        },
        {
          text: "Reimbursement Requests",
          icon: <CreditCard />,
          href: "/dashboard/committee/reimbursements",
        },
        {
          text: "PR & Marketing",
          icon: <Email />,
          href: "/dashboard/committee/marketing",
        },
      ],
      [UserRole.ATTENDEE]: [
        {
          text: "QR Codes",
          icon: <QrCode />,
          href: "/dashboard/attendee/qr-codes",
        },
        {
          text: "Events",
          icon: <Event />,
          href: "/dashboard/attendee/events",
        },
        {
          text: "Stalls & Sponsors",
          icon: <AccountBalance />,
          href: "/dashboard/attendee/stalls",
        },
        {
          text: "Activities & Games",
          icon: <SportsEsports />,
          href: "/dashboard/attendee/activities",
        },
      ],
    };
    
    return [
      ...commonItems,
      ...(userRole && roleSpecificItems[userRole as UserRole] ? roleSpecificItems[userRole as UserRole] : []),
    ];
  };

  const navigationItems = getNavigationItems();

  const drawer = (
    <div>
      <Toolbar sx={{ px: 2 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Event Management
        </Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Avatar
            src={session?.user?.image || undefined}
            alt={session?.user?.name || "User"}
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {session?.user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {session?.user?.role === UserRole.SUPER_ADMIN
                ? "Super Admin"
                : session?.user?.role === UserRole.ADMIN
                ? "Admin"
                : session?.user?.role === UserRole.COMMITTEE_MEMBER
                ? "Committee Member"
                : "Attendee"}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider />
      <List sx={{ pt: 1 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              href={item.href}
              selected={pathname === item.href}
              onClick={isMobile ? handleDrawerToggle : undefined}
              sx={{
                borderRadius: 2,
                mx: 1,
                mb: 0.5,
                "&.Mui-selected": {
                  backgroundColor: "primary.light",
                  color: "primary.contrastText",
                  "&:hover": {
                    backgroundColor: "primary.main",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "primary.contrastText",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: pathname === item.href ? "inherit" : "primary.main",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
        elevation={1}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {/* Dynamic title based on pathname */}
            {pathname === "/dashboard"
              ? "Dashboard Overview"
              : pathname.includes("calendar")
              ? "Event Calendar"
              : pathname.includes("create-event")
              ? "Create New Event"
              : pathname.includes("chat")
              ? "Team Chat"
              : pathname.includes("permissions")
              ? "Permission Requests"
              : pathname.includes("marketing")
              ? "PR & Marketing"
              : pathname.includes("reimbursements")
              ? "Reimbursement Management"
              : pathname.includes("committees")
              ? "Committee Management"
              : pathname.includes("admins")
              ? "Admin Management"
              : pathname.includes("recommendations")
              ? "AI Content Recommendations"
              : pathname.includes("attendees")
              ? "Attendee Management"
              : pathname.includes("qr-codes")
              ? "My QR Codes"
              : pathname.includes("events")
              ? "Upcoming Events"
              : pathname.includes("stalls")
              ? "Stalls & Sponsors"
              : pathname.includes("activities")
              ? "Activities & Games"
              : pathname.includes("analytics")
              ? "Analytics & Reports"
              : pathname.includes("tasks")
              ? "Task Planner"
              : "Dashboard"}
          </Typography>
          <Box sx={{ display: "flex" }}>
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                onClick={handleNotificationsOpen}
                size="large"
              >
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Account settings">
              <IconButton
                edge="end"
                onClick={handleProfileMenuOpen}
                color="inherit"
                size="large"
              >
                <Person />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem component={Link} href="/dashboard/profile" onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          My Profile
        </MenuItem>
        <MenuItem component={Link} href="/dashboard/settings" onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      
      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationsClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 },
        }}
      >
        <MenuItem>
          <Box sx={{ width: "100%" }}>
            <Typography variant="subtitle2" fontWeight={600}>
              New Event Approval
            </Typography>
            <Typography variant="body2" color="text.secondary">
              A new event requires your approval
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box sx={{ width: "100%" }}>
            <Typography variant="subtitle2" fontWeight={600}>
              Reimbursement Request
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Someone submitted a new reimbursement request
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box sx={{ width: "100%" }}>
            <Typography variant="subtitle2" fontWeight={600}>
              New Message
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You have a new message in the team chat
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ justifyContent: "center" }}>
          <Typography color="primary" variant="body2">
            View All Notifications
          </Typography>
        </MenuItem>
      </Menu>
      
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRadius: { xs: "0 16px 16px 0" },
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: "1px solid rgba(0, 0, 0, 0.12)",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          backgroundColor: "#f8fafc",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
} 