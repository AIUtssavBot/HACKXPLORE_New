"use client";

import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Badge,
  Tooltip,
} from "@mui/material";
import { Send as SendIcon, AttachFile as AttachFileIcon } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { UserRole } from "@/models/User";

// Mock data for initial development - will be replaced with real API calls
const MOCK_MESSAGES = [
  {
    id: "1",
    text: "Welcome to the event planning chat! Let's coordinate our efforts.",
    sender: {
      id: "admin1",
      name: "Admin User",
      role: UserRole.ADMIN,
      avatar: "/avatars/admin1.png",
    },
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
  },
  {
    id: "2",
    text: "I've updated the event budget. Please review when you have a chance.",
    sender: {
      id: "committee1",
      name: "Marketing Lead",
      role: UserRole.COMMITTEE_MEMBER,
      avatar: "/avatars/committee1.png",
    },
    timestamp: new Date(Date.now() - 43200000), // 12 hours ago
  },
  {
    id: "3",
    text: "The venue has confirmed our booking for next Friday.",
    sender: {
      id: "admin2",
      name: "Event Coordinator",
      role: UserRole.ADMIN,
      avatar: "/avatars/admin2.png",
    },
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
  },
];

interface ChatMessage {
  id: string;
  text: string;
  sender: {
    id: string;
    name: string;
    role: UserRole;
    avatar: string;
  };
  timestamp: Date;
}

interface ChatSystemProps {
  channelId?: string; // Optional channel ID for different chat groups
}

export default function ChatSystem({ channelId = "general" }: ChatSystemProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulate loading initial messages
  useEffect(() => {
    const loadMessages = async () => {
      // In a real app, you would fetch messages from an API
      // const response = await fetch(`/api/chat/${channelId}`);
      // const data = await response.json();
      
      // Using mock data for now
      setTimeout(() => {
        setMessages(MOCK_MESSAGES);
        setIsLoading(false);
      }, 1000);
    };

    loadMessages();
  }, [channelId]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate WebSocket connection for real-time messaging
  // In a real app, you would use Socket.io or a similar library
  useEffect(() => {
    const simulateIncomingMessage = () => {
      // Simulate a random new message every 30-60 seconds
      const timeout = setTimeout(() => {
        const newRandomMessage = {
          id: `random-${Date.now()}`,
          text: "Just checking in on the event preparations. How is everything going?",
          sender: {
            id: "committee2",
            name: "Logistics Coordinator",
            role: UserRole.COMMITTEE_MEMBER,
            avatar: "/avatars/committee2.png",
          },
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, newRandomMessage]);
        
        // Set up the next random message
        simulateIncomingMessage();
      }, Math.floor(Math.random() * 30000) + 30000); // Random time between 30-60 seconds
      
      return timeout;
    };
    
    const timeout = simulateIncomingMessage();
    
    return () => clearTimeout(timeout);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    const message: ChatMessage = {
      id: `user-${Date.now()}`,
      text: newMessage,
      sender: {
        id: session?.user?.id || "current-user",
        name: session?.user?.name || "You",
        role: (session?.user?.role as UserRole) || UserRole.ADMIN,
        avatar: session?.user?.image || "/avatars/default.png",
      },
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage("");
    
    // In a real app, you would send the message to your API/WebSocket
    // socket.emit('message', message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 1) {
      return format(date, "h:mm a");
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else {
      return format(date, "MMM d");
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return "#8E24AA"; // Purple
      case UserRole.ADMIN:
        return "#1976D2"; // Blue
      case UserRole.COMMITTEE_MEMBER:
        return "#388E3C"; // Green
      default:
        return "#757575"; // Grey
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Typography>Loading chat messages...</Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "70vh",
        maxHeight: "700px",
        overflow: "hidden",
        bgcolor: "background.paper",
        borderRadius: 2,
      }}
    >
      {/* Chat Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        <Typography variant="h6">{channelId === "general" ? "Event Planning Chat" : channelId}</Typography>
        <Typography variant="body2">
          {messages.length} messages • {messages.filter(m => m.sender.role === UserRole.ADMIN).length} from admins
        </Typography>
      </Box>

      <Divider />

      {/* Messages Area */}
      <List
        sx={{
          flexGrow: 1,
          overflow: "auto",
          p: 2,
          bgcolor: "#f5f5f5",
        }}
      >
        {messages.map((message) => {
          const isCurrentUser = message.sender.id === (session?.user?.id || "current-user");
          
          return (
            <ListItem
              key={message.id}
              sx={{
                flexDirection: isCurrentUser ? "row-reverse" : "row",
                alignItems: "flex-start",
                mb: 1,
              }}
              disableGutters
            >
              <ListItemAvatar sx={{ minWidth: 40, m: isCurrentUser ? "0 0 0 8px" : "0 8px 0 0" }}>
                <Tooltip title={`${message.sender.name} (${message.sender.role})`}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor: getRoleColor(message.sender.role),
                      },
                    }}
                  >
                    <Avatar
                      src={message.sender.avatar}
                      alt={message.sender.name}
                      sx={{ width: 36, height: 36 }}
                    />
                  </Badge>
                </Tooltip>
              </ListItemAvatar>
              
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  maxWidth: "80%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 0.5,
                    flexDirection: isCurrentUser ? "row-reverse" : "row",
                  }}
                >
                  <Typography variant="subtitle2" color="textPrimary">
                    {isCurrentUser ? "You" : message.sender.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ ml: isCurrentUser ? 0 : 1, mr: isCurrentUser ? 1 : 0 }}
                  >
                    {formatMessageTime(message.timestamp)}
                  </Typography>
                </Box>
                
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    maxWidth: "100%",
                    bgcolor: isCurrentUser ? "primary.light" : "#ffffff",
                    color: isCurrentUser ? "primary.contrastText" : "text.primary",
                    borderBottomLeftRadius: isCurrentUser ? 2 : 0,
                    borderBottomRightRadius: isCurrentUser ? 0 : 2,
                  }}
                >
                  <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {message.text}
                  </Typography>
                </Paper>
              </Box>
            </ListItem>
          );
        })}
        <div ref={messagesEndRef} />
      </List>

      <Divider />

      {/* Message Input Area */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          bgcolor: "background.paper",
        }}
      >
        <IconButton color="primary" aria-label="attach file" component="label">
          <input type="file" hidden />
          <AttachFileIcon />
        </IconButton>
        
        <TextField
          fullWidth
          placeholder="Type a message..."
          variant="outlined"
          size="small"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{ ml: 1, mr: 1 }}
          multiline
          maxRows={4}
        />
        
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={handleSendMessage}
          disabled={newMessage.trim() === ""}
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
} 