import React, { useContext } from "react";
import { Box, Typography, Avatar, styled } from "@mui/material";
import { AccountContext } from "../../context/AccountProvider";
import { format } from "./utils";

const Component = styled(Box)({
  display: "flex",
  height: "auto",
  padding: "13px 5px",
  cursor: "pointer",
  border: "1px solid #ccc",
  borderRadius: "5px",
  margin:'4px',
  backgroundColor: "#f9f9f9", // Changed background color
  "&:hover": { // Added hover effect
    backgroundColor: "#e9e9e9",
  },
});

const Image = styled(Avatar)({
  width: "50px",
  height: "50px",
  marginRight: "10px",
});

const MessageContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  flexGrow: 1, // Adjusted to grow flexibly
});

const MessageText = styled(Typography)({
  color: "#333", // Changed text color
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: "70%",
  marginBottom: "5px", // Added margin bottom
});

const Timestamp = styled(Typography)({
  fontSize: "12px",
  color: "#777", // Changed timestamp color
});

const Name = styled(Typography)({
  fontSize: "1rem", // Adjusted font size
  textTransform: "capitalize",
  color: "#555", // Changed name color
  fontWeight: 600,
});

export default function Chat({ user, onClick }) {
  const { messages, isTyping } = useContext(AccountContext);
  console.log(messages);
  return (
    <Component onClick={onClick}>
      <Image src={user?.picture} alt={user?.name} />
      <MessageContainer>
        <Box>
          <Name>{user.name}</Name>
          <Timestamp>{messages && format(messages.timestamp)}</Timestamp>
        </Box>
        <MessageText>
          {messages?.text?.includes("localhost") ? "media" : messages?.text}
        </MessageText>
        {isTyping && <Typography variant="body2">Someone is typing...</Typography>}
      </MessageContainer>
    </Component>
  );
}