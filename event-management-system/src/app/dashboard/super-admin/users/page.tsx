"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Card,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Avatar,
  Tabs,
  Tab,
  Badge,
} from "@mui/material";
import {
  Search,
  Edit,
  Delete,
  Add,
  Person,
  PersonAdd,
  Check,
  Cancel,
  Block,
} from "@mui/icons-material";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "committee_member" | "attendee";
  status: "active" | "inactive" | "pending";
  createdAt: string;
  department?: string;
  avatar?: string;
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
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function UsersPage() {
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "attendee",
    department: "",
  });

  // Sample data for users
  useEffect(() => {
    const sampleUsers: User[] = [
      {
        id: "1",
        name: "John Smith",
        email: "john.smith@example.com",
        role: "super_admin",
        status: "active",
        createdAt: "2023-01-15",
        department: "IT",
        avatar: "/avatars/avatar1.jpg",
      },
      {
        id: "2",
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        role: "admin",
        status: "active",
        createdAt: "2023-02-03",
        department: "Management",
        avatar: "/avatars/avatar2.jpg",
      },
      {
        id: "3",
        name: "Michael Williams",
        email: "michael.williams@example.com",
        role: "committee_member",
        status: "active",
        createdAt: "2023-03-12",
        department: "Technical Committee",
        avatar: "/avatars/avatar3.jpg",
      },
      {
        id: "4",
        name: "Emma Davis",
        email: "emma.davis@example.com",
        role: "committee_member",
        status: "active",
        createdAt: "2023-03-14",
        department: "Cultural Committee",
        avatar: "/avatars/avatar4.jpg",
      },
      {
        id: "5",
        name: "James Brown",
        email: "james.brown@example.com",
        role: "attendee",
        status: "active",
        createdAt: "2023-04-05",
        avatar: "/avatars/avatar5.jpg",
      },
      {
        id: "6",
        name: "Olivia Taylor",
        email: "olivia.taylor@example.com",
        role: "attendee",
        status: "active",
        createdAt: "2023-04-08",
        avatar: "/avatars/avatar6.jpg",
      },
      {
        id: "7",
        name: "Robert Wilson",
        email: "robert.wilson@example.com",
        role: "attendee",
        status: "pending",
        createdAt: "2023-05-01",
        avatar: "/avatars/avatar7.jpg",
      },
      {
        id: "8",
        name: "Sophia Martinez",
        email: "sophia.martinez@example.com",
        role: "admin",
        status: "inactive",
        createdAt: "2023-02-15",
        department: "Operations",
        avatar: "/avatars/avatar8.jpg",
      },
    ];

    setUsers(sampleUsers);
    setFilteredUsers(sampleUsers);
  }, []);

  // Filter users based on search query and tab value
  useEffect(() => {
    let filtered = users;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.department && user.department.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by tab (status)
    if (tabValue === 1) {
      filtered = filtered.filter((user) => user.status === "active");
    } else if (tabValue === 2) {
      filtered = filtered.filter((user) => user.status === "pending");
    } else if (tabValue === 3) {
      filtered = filtered.filter((user) => user.status === "inactive");
    }

    setFilteredUsers(filtered);
  }, [searchQuery, users, tabValue]);

  // Get counts for badges
  const getStatusCount = (status: "active" | "pending" | "inactive") => {
    return users.filter((user) => user.status === status).length;
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedUser(null);
  };

  const handleEditSubmit = () => {
    if (!selectedUser) return;

    // Update user in the list
    const updatedUsers = users.map((user) =>
      user.id === selectedUser.id ? selectedUser : user
    );

    setUsers(updatedUsers);
    toast.success("User updated successfully");
    handleEditDialogClose();
  };

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;

    // Remove user from the list
    const updatedUsers = users.filter((user) => user.id !== userToDelete);
    setUsers(updatedUsers);

    toast.success("User deleted successfully");
    setConfirmDialogOpen(false);
    setUserToDelete(null);
  };

  const handleAddUserDialogOpen = () => {
    setAddUserDialogOpen(true);
  };

  const handleAddUserDialogClose = () => {
    setAddUserDialogOpen(false);
    setNewUser({
      name: "",
      email: "",
      role: "attendee",
      department: "",
    });
  };

  const handleAddUserSubmit = () => {
    // Create new user and add to the list
    const newUserId = (users.length + 1).toString();
    
    const createdUser: User = {
      id: newUserId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as any,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
      department: newUser.department || undefined,
    };

    setUsers([...users, createdUser]);
    toast.success("User added successfully");
    handleAddUserDialogClose();
  };

  const handleToggleUserStatus = (userId: string) => {
    // Toggle user status between active and inactive
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        const newStatus = user.status === "active" ? "inactive" : "active";
        return { ...user, status: newStatus };
      }
      return user;
    });

    setUsers(updatedUsers);
    toast.success("User status updated");
  };

  const handleApproveUser = (userId: string) => {
    // Approve pending user
    const updatedUsers = users.map((user) => {
      if (user.id === userId && user.status === "pending") {
        return { ...user, status: "active" };
      }
      return user;
    });

    setUsers(updatedUsers);
    toast.success("User approved");
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "error";
      case "admin":
        return "warning";
      case "committee_member":
        return "info";
      default:
        return "success";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "inactive":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        User Management
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Manage user accounts and permissions across the platform.
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <TextField
          placeholder="Search users..."
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
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddUserDialogOpen}
        >
          Add User
        </Button>
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab 
              label="All Users" 
              icon={<Person />} 
              iconPosition="start"
              sx={{ minHeight: '64px' }}
            />
            <Tab
              label="Active"
              icon={
                <Badge badgeContent={getStatusCount("active")} color="success">
                  <Check />
                </Badge>
              }
              iconPosition="start"
              sx={{ minHeight: '64px' }}
            />
            <Tab
              label="Pending"
              icon={
                <Badge badgeContent={getStatusCount("pending")} color="warning">
                  <Person />
                </Badge>
              }
              iconPosition="start"
              sx={{ minHeight: '64px' }}
            />
            <Tab
              label="Inactive"
              icon={
                <Badge badgeContent={getStatusCount("inactive")} color="error">
                  <Block />
                </Badge>
              }
              iconPosition="start"
              sx={{ minHeight: '64px' }}
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <UserTable />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <UserTable />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <UserTable />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <UserTable />
        </TabPanel>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedUser && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Name"
                fullWidth
                value={selectedUser.name}
                onChange={(e) => 
                  setSelectedUser({ ...selectedUser, name: e.target.value })
                }
              />
              <TextField
                label="Email"
                fullWidth
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={selectedUser.role}
                  label="Role"
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      role: e.target.value as any,
                    })
                  }
                >
                  <MenuItem value="super_admin">Super Admin</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="committee_member">Committee Member</MenuItem>
                  <MenuItem value="attendee">Attendee</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedUser.status}
                  label="Status"
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      status: e.target.value as any,
                    })
                  }
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
              {(selectedUser.role === "admin" || selectedUser.role === "committee_member") && (
                <TextField
                  label="Department"
                  fullWidth
                  value={selectedUser.department || ""}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      department: e.target.value,
                    })
                  }
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this user? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={addUserDialogOpen} onClose={handleAddUserDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Name"
              fullWidth
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <TextField
              label="Email"
              fullWidth
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={newUser.role}
                label="Role"
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
              >
                <MenuItem value="super_admin">Super Admin</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="committee_member">Committee Member</MenuItem>
                <MenuItem value="attendee">Attendee</MenuItem>
              </Select>
            </FormControl>
            {(newUser.role === "admin" || newUser.role === "committee_member") && (
              <TextField
                label="Department"
                fullWidth
                value={newUser.department}
                onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddUserDialogClose}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAddUserSubmit}
            disabled={!newUser.name || !newUser.email}
          >
            Add User
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Table Component */}
      {function UserTable() {
        return (
          <TableContainer component={Paper} elevation={0}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar 
                            src={user.avatar} 
                            alt={user.name} 
                            sx={{ mr: 2, width: 40, height: 40 }}
                          >
                            {user.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">{user.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={user.role.replace('_', ' ')} 
                          color={getRoleColor(user.role) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={user.status} 
                          color={getStatusColor(user.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{user.department || '-'}</TableCell>
                      <TableCell>{user.createdAt}</TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          {user.status === "pending" && (
                            <IconButton 
                              color="success" 
                              onClick={() => handleApproveUser(user.id)}
                              size="small"
                            >
                              <Check fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton 
                            color="primary" 
                            onClick={() => handleEditUser(user)}
                            size="small"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            color={user.status === "active" ? "error" : "success"}
                            onClick={() => handleToggleUserStatus(user.id)}
                            size="small"
                          >
                            {user.status === "active" ? <Block fontSize="small" /> : <Check fontSize="small" />}
                          </IconButton>
                          <IconButton 
                            color="error" 
                            onClick={() => handleDeleteUser(user.id)}
                            size="small"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <Box sx={{ textAlign: "center" }}>
                        <PersonAdd sx={{ fontSize: 40, color: "text.secondary", mb: 1 }} />
                        <Typography variant="h6">No users found</Typography>
                        <Typography color="text.secondary" variant="body2">
                          {searchQuery ? "Try adjusting your search criteria" : "Add a new user to get started"}
                        </Typography>
                        {!searchQuery && (
                          <Button
                            variant="contained"
                            startIcon={<Add />}
                            sx={{ mt: 2 }}
                            onClick={handleAddUserDialogOpen}
                          >
                            Add User
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        );
      }}
    </Box>
  );
} 