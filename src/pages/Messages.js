import React, { useEffect, useState } from "react";
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
import { useGetConversationMutation, useGetConvoMessagesMutation, useSendMessageMutation } from "../services/apiService";

const WhatsAppChat = () => {
  const isMobile = useMediaQuery("(max-width:768px)"); // Check if the screen width is mobile-sized
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const { access_token ,profile} = useSelector((state) => state.auth);
  const [conversations, setConversations] = useState([]);
  const [getConversation] = useGetConversationMutation();
  const [getConvoMessages] = useGetConvoMessagesMutation();
  const [sendMessage] = useSendMessageMutation(); // Assuming sendMessage mutation exists
  const {id} = profile;
  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);

    fetchConversationDetails(conversation?.id);
  };
  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  const getConversationList = async () => {
    try {
      const res = await getConversation(access_token);
      if (res.error) {
        console.error(res.error.data.errors); // Display login error
        return; // Exit early on error
      }
      if (res.data) {
        const { data } = res;
        setConversations(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch individual conversation details
  const fetchConversationDetails = async (conversation) => {
    try {
      const res = await getConvoMessages({ token: access_token, conversationId: conversation });// Add this to inspect the response
      if (res.error) {
        console.error(res.error.data.errors); // Display error if API fails
        return;
      }
      if (res.data) {
        setSelectedConversation(res?.data); // Set selected conversation details
      }
    } catch (error) {
      console.error("Error fetching conversation details:", error);
    }
  };

  const handleSendMessage = async () => {
    try {
      const res = await sendMessage({ access_token, conversationId: selectedConversation?.conversation_id, message: newMessage });
      if (res.error) {
        console.error(res.error.data.errors);
        return;
      }
      if (res.data) {
        fetchConversationDetails(selectedConversation?.conversation_id) // Refresh conversation list
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    getConversationList();

    // Fetch conversation list on mount
  }, []);



  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile && selectedConversation ? "column" : "row", // Switch layout on mobile
        height: "100vh",
        backgroundColor: "#f9f9f9",
      }}
    >
      {/* Sidebar */}
      {(!isMobile || !selectedConversation) && (
        <Box
          sx={{
            width: isMobile ? "100%" : "30%", // Full width on mobile, sidebar width on web
            backgroundColor: "#fff",
            borderRadius: isMobile ? "0" : "20px",
            margin: isMobile ? "0" : "15px",
            overflowY: "auto",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              p: 2,
              fontWeight: "bold",
              color: "#FF6436",
              borderBottom: "1px solid #ddd",
            }}
          >
            Conversations
          </Typography>
          <List>
            {conversations?.map((conversation, index) => (
              <ListItem
                button
                key={index}
                onClick={() => handleConversationClick(conversation)}
                sx={{
                  borderBottom: "1px solid #ddd",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                <ListItemText
                  primary={conversation?.second_participant_name}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Chat Panel */}
      {(!isMobile || !selectedConversation) && (
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#fff",
            borderRadius: isMobile ? "0" : "20px",
            margin: isMobile ? "0" : "15px",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "16px",
              borderBottom: "1px solid #ddd",
            }}
          >
            {isMobile && (
              <IconButton onClick={handleBackToList} sx={{ marginRight: 1 }}>
                <ArrowBackIcon />
              </IconButton>
            )}
            <Typography variant="h6">
              {selectedConversation?.participants[0]}
            </Typography>
          </Box>

          {/* Chat Messages */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              padding: 2,
              maxHeight: "calc(100vh - 200px)",
            }}
          >
            {selectedConversation && selectedConversation?.message_count > 0 ? (
              selectedConversation?.result?.map((message, index) => (
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
                    }}
                  >
                    <Typography>{message.content}</Typography>
                    <Typography variant="caption" sx={{ display: "block", marginTop: 0.5 }}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Paper>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary" align="center">
                No messages yet.
              </Typography>
            )}
          </Box>


          {/* Message Input */}
          {selectedConversation && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "16px",
                borderTop: "1px solid #ddd",
              }}
            >
              <TextField
                placeholder="Type a message..."
                variant="outlined"
                fullWidth
                size="small"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
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
          )}
        </Box>
      )}
    </Box>
  );
};

export default WhatsAppChat;
