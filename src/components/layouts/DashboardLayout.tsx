import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Event,
  Chat,
  People,
  Assignment,
  AccountCircle,
  Notifications,
  ExitToApp,
  Settings,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { UserRole } from '@/models/User';

const drawerWidth = 280;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const getMenuItems = () => {
    const role = session?.user?.role as UserRole;
    const items = [
      { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    ];

    if (role === UserRole.SUPER_ADMIN) {
      items.push(
        { text: 'Events', icon: <Event />, path: '/dashboard/events' },
        { text: 'Users', icon: <People />, path: '/dashboard/users' },
        { text: 'Permissions', icon: <Settings />, path: '/dashboard/permissions' }
      );
    } else if (role === UserRole.ADMIN) {
      items.push(
        { text: 'Events', icon: <Event />, path: '/dashboard/events' },
        { text: 'Marketing', icon: <Assignment />, path: '/dashboard/marketing' },
        { text: 'Chat', icon: <Chat />, path: '/dashboard/chat' },
        { text: 'Reimbursements', icon: <Assignment />, path: '/dashboard/reimbursements' }
      );
    } else if (role === UserRole.COMMITTEE_MEMBER) {
      items.push(
        { text: 'Tasks', icon: <Assignment />, path: '/dashboard/tasks' },
        { text: 'Chat', icon: <Chat />, path: '/dashboard/chat' },
        { text: 'Reimbursements', icon: <Assignment />, path: '/dashboard/reimbursements' }
      );
    } else if (role === UserRole.ATTENDEE) {
      items.push(
        { text: 'Events', icon: <Event />, path: '/dashboard/events' },
        { text: 'My QR Codes', icon: <Assignment />, path: '/dashboard/qr-codes' },
        { text: 'Quizzes', icon: <Assignment />, path: '/dashboard/quizzes' }
      );
    }

    return items;
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Event Manager
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {getMenuItems().map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => router.push(item.path)}
            selected={router.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit">
            <Notifications />
          </IconButton>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleProfileMenuOpen}
          >
            <Avatar
              alt={session?.user?.name || ''}
              src={session?.user?.image || ''}
            />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
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
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem onClick={() => router.push('/dashboard/profile')}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </MenuItem>
        <MenuItem onClick={() => router.push('/auth/signout')}>
          <ListItemIcon>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Sign Out" />
        </MenuItem>
      </Menu>
    </Box>
  );
} 