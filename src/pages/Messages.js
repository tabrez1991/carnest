import React, { useState } from "react";
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

const conversations = [
	{ name: "John Doe", messages: [{ sender: "John", text: "Are you available?", time: "10:30 AM" }] },
	{ name: "Jane Smith", messages: [{ sender: "Jane", text: "Let's catch up!", time: "11:45 AM" }] },
	{ name: "Sam Wilson", messages: [] },
];

const WhatsAppChat = () => {
	const isMobile = useMediaQuery("(max-width:768px)"); // Check if the screen width is mobile-sized
	const [selectedConversation, setSelectedConversation] = useState(null);
	const [newMessage, setNewMessage] = useState("");

	const handleConversationClick = (conversation) => {
		setSelectedConversation(conversation);
	};

	const handleBackToList = () => {
		setSelectedConversation(null);
	};

	const handleSendMessage = () => {
		if (newMessage.trim() && selectedConversation) {
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
								<ListItemText
									primary={conversation.name}
									secondary={
										conversation.messages.length > 0
											? conversation.messages[conversation.messages.length - 1].text
											: "No messages yet"
									}
								/>
							</ListItem>
						))}
					</List>
				</Box>
			)}

			{/* Chat Panel */}
			{(!isMobile || selectedConversation) && (
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
							{selectedConversation ? selectedConversation.name : "Select a conversation"}
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
						{selectedConversation && selectedConversation.messages.length > 0 ? (
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
