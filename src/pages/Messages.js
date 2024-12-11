import React, { useEffect, useState, useRef } from "react";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  TextField,
  IconButton,
  Paper,
  useMediaQuery,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import {
  useGetConversationMutation,
  useGetConvoMessagesMutation,
  useSendMessageMutation,
} from "../services/apiService";

const WhatsAppChat = () => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const { access_token, profile } = useSelector((state) => state.auth);
  const [conversations, setConversations] = useState([]);
  const [getConversation] = useGetConversationMutation();
  const [getConvoMessages] = useGetConvoMessagesMutation();
  const [sendMessage] = useSendMessageMutation();
  const { id } = profile;
  const [pollingInterval, setPollingInterval] = useState(null); // State for interval ID
  const messagesEndRef = useRef(null); // Ref for scrolling

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
    fetchConversationDetails(conversation?.id);

    // Clear any existing polling interval
    if (pollingInterval) clearInterval(pollingInterval);

    // Start a new polling interval
    const interval = setInterval(() => {
      fetchConversationDetails(conversation?.id);
    }, 3000); // Poll every 3 seconds
    setPollingInterval(interval);
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
    // Clear polling interval when going back
    if (pollingInterval) clearInterval(pollingInterval);
  };

  const getConversationList = async () => {
    try {
      const res = await getConversation(access_token);
      if (res.error) return console.error(res.error.data.errors);
      setConversations(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchConversationDetails = async (conversationId) => {
    try {
      const res = await getConvoMessages({ token: access_token, conversationId });
      if (res.error) return console.error(res.error.data.errors);
      setSelectedConversation(res?.data);
      scrollToBottom(); // Scroll to bottom whenever new messages are loaded
    } catch (error) {
      console.error("Error fetching conversation details:", error);
    }
  };

  const handleSendMessage = async () => {
    try {
      const res = await sendMessage({
        access_token,
        conversationId: selectedConversation?.conversation_id,
        message: newMessage,
      });
      if (res.error) return console.error(res.error.data.errors);
      setNewMessage("");
      fetchConversationDetails(selectedConversation?.conversation_id);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    getConversationList();

    // Clear interval when component unmounts
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom when selectedConversation changes
    scrollToBottom();
  }, [selectedConversation]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile && selectedConversation ? "column" : "row",
        height: "100vh",
        backgroundColor: "#f9f9f9",
      }}
    >
      {/* Sidebar */}
      {(!isMobile || !selectedConversation) && (
        <Box
          sx={{
            width: isMobile ? "100%" : "30%",
            backgroundColor: "#fff",
            borderRight: "1px solid #ddd",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" sx={{ p: 2, fontWeight: "bold", color: "#FF6436" }}>
            Conversations
          </Typography>
          <List>
            {conversations.map((conversation, index) => (
              <ListItem
                button
                key={index}
                onClick={() => handleConversationClick(conversation)}
                sx={{
                  borderBottom: "1px solid #ddd",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                <ListItemText primary={conversation?.second_participant_name} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Chat Panel */}
      {selectedConversation && (
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "16px",
              borderBottom: "1px solid #ddd",
              backgroundColor: "#fff",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            {isMobile && (
              <IconButton onClick={handleBackToList} sx={{ marginRight: 1 }}>
                <ArrowBackIcon />
              </IconButton>
            )}
            <Typography variant="h6">{selectedConversation?.participants[0]}</Typography>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              padding: 2,
              backgroundColor: "#f5f5f5",
              mb: isMobile ? 4 : 0,
            }}
          >
            {selectedConversation?.result?.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: message.sender === id ? "row-reverse" : "row",
                  marginBottom: 2,
                }}
              >
                <Paper
                  sx={{
                    padding: 1.5,
                    backgroundColor: message.sender === id ? "#FF6436" : "#f1f1f1",
                    color: message.sender === id ? "#fff" : "#000",
                    maxWidth: "70%",
                    borderRadius: "15px",
                  }}
                >
                  <Typography>{message.content}</Typography>
                  <Typography variant="caption" sx={{ display: "block", marginTop: 0.5 }}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </Typography>
                </Paper>
              </Box>
            ))}
            <div ref={messagesEndRef} /> {/* Scroll target */}
          </Box>

          {/* Input */}
          {/* Input */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "16px",
              borderTop: "1px solid #ddd",
              backgroundColor: "#fff",
              position: "sticky",
              bottom: isMobile? 50 : 0,
              zIndex: 10,
            }}
          >
            <TextField
              placeholder="Type a message..."
              variant="outlined"
              fullWidth
              size="small"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // Prevents the default action of creating a new line
                  handleSendMessage();
                }
              }}
              sx={{ marginRight: 1 }}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              sx={{ backgroundColor: "#FF6436", "&:hover": { backgroundColor: "#FF4500" } }}
            >
              <SendIcon sx={{ color: "#fff" }} />
            </IconButton>
          </Box>

        </Box>
      )}
    </Box>
  );
};

export default WhatsAppChat;
