import React, { useState } from "react";
import {
	AppBar,
	Toolbar,
	Typography,
	Box,
	Button,
	List,
	ListItem,
	ListItemText,
	TextField,
	IconButton,
	Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const conversations = [
	{ name: "John Doe", messages: [{ sender: "John", text: "Are you Available?", time: "10:30 AM" }] },
	{ name: "Jane Smith", messages: [] },
	{ name: "Sam Wilson", messages: [] },
];

const Messages = () => {
	const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
	const [newMessage, setNewMessage] = useState("");

	const handleConversationClick = (conversation) => {
		setSelectedConversation(conversation);
	};

	const handleSendMessage = () => {
		if (newMessage.trim()) {
			setSelectedConversation((prev) => ({
				...prev,
				messages: [
					...prev.messages,
					{ sender: "You", text: newMessage, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
				],
			}));
			setNewMessage("");
		}
	};

	return (
		<Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f9f9f9" }}>
			{/* Sidebar */}
			<Box sx={{ width: "25%", backgroundColor: "#fff", borderRadius: "20px", margin: "15px 30px 100px 30px" }}>
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
								backgroundColor: selectedConversation.name === conversation.name ? "#FF6436" : "transparent",
								borderRadius: selectedConversation.name === conversation.name ? "20px" : "0px",
								color: selectedConversation.name === conversation.name ? "#fff" : "#000",
								"&:hover": { backgroundColor: "#FF6436", color: "#fff", borderRadius: "20px" },
							}}
						>
							<ListItemText primary={conversation.name} />
						</ListItem>
					))}
				</List>
			</Box>

			{/* Chat Panel */}
			<Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", backgroundColor: "#fff", borderRadius: "20px", margin:"15px 30px 100px 30px" }}>
			{/* Header */}
			<Box sx={{ borderBottom: "1px solid #ddd", padding: "16px" }}>
				<Typography variant="h6">{selectedConversation.name}</Typography>
			</Box>

			{/* Chat Messages */}
			<Box sx={{ flexGrow: 1, overflowY: "auto", padding: 2 }}>
				{selectedConversation.messages.length > 0 ? (
					selectedConversation.messages.map((message, index) => (
						<Box
							key={index}
							sx={{
								display: "flex",
								flexDirection: message.sender === "You" ? "row-reverse" : "row",
								marginBottom: 2,
							}}
						>
							<Paper
								sx={{
									padding: 1.5,
									backgroundColor: message.sender === "You" ? "#FF6436" : "#f1f1f1",
									color: message.sender === "You" ? "#fff" : "#000",
									maxWidth: "70%",
								}}
							>
								<Typography>{message.text}</Typography>
								<Typography variant="caption" sx={{ display: "block", marginTop: 0.5 }}>
									{message.time}
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
				<IconButton color="primary" onClick={handleSendMessage} sx={{ backgroundColor: "#FF6436", "&:hover": { backgroundColor: "#FF4500" } }}>
					<SendIcon sx={{ color: "#fff" }} />
				</IconButton>
			</Box>
		</Box>
		</Box >
	);
};

export default Messages;
