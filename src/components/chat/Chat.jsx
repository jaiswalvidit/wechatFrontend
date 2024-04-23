import React, { useContext } from "react";
import { Box, Typography, Avatar, styled } from "@mui/material";
import { AccountContext } from "../../context/AccountProvider";
import { format } from "./utils";
import { otherMember } from "./chat/miscelleanous";

const Component = styled(Box)({
  display: "flex",
  height: "auto",
  padding: "15px 5px",
  cursor: "pointer",
  border: "1px solid #ccc",
  borderRadius: "5px",
  margin: '2px 0px',
  backgroundColor: "#f9f9f9",
  "&:hover": {
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
  flexGrow: 1,
});

const MessageText = styled(Typography)({
  color: "#333",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap", // Changed to 'nowrap' to display content that fits in one row
  maxWidth: "70%",
  marginBottom: "5px",
  display: "block",
  display: "-webkit-box",
  WebkitLineClamp: 1,
  WebkitBoxOrient: "vertical",
  wordBreak: "break-word",
});

const Time = styled(Box)({
  marginLeft: "auto",
  fontSize: "0.75rem", // Reduced font size
  color: "#777",
});

const Name = styled(Typography)({
  fontSize: "1rem",
  textTransform: "capitalize",
  color: "#555",
  fontWeight: 600,
});

const Text = styled(Box)({
  overflow: "hidden",
});

export default function Chat({ user, onClick }) {
  const { messages, isTyping, userDetails, currentMessage } = useContext(AccountContext);
  const other = otherMember(user, userDetails);

  return (
    <Component onClick={onClick}>
      <Image src={`data:image/svg+xml;base64,${other.picture}`} alt={other?.name} />
      <MessageContainer>
        <Box style={{ display: 'flex', alignItems: 'center' }}>
          <Name>{other.name}</Name>
          {/* <Time>{format(user.messages.createdAt)}</Time> */}
          {messages && messages.timestamp && (
            <Time>{format(user.messages.timestamp)}</Time>
          )}
        </Box>
        <MessageText>
          {currentMessage !== undefined && currentMessage.messageId !== undefined && currentMessage.messageId._id === user._id ? (
            <>
              {currentMessage.text} {format(currentMessage.createdAt)}
            </>
          ) :(
            user && user.messages ? (
              <Box style={{ display: 'flex', justifyContent: "space-between", overflow: 'hidden' }}>
                <Text> {user.messages.type === 'text' ? <>
                  {user.messages.text.length > 50 ? `${user.messages.text.slice(0, 50)}...` : user.messages.text}
                </> : 'media'}</Text>
                
              </Box>
            ): (
              <></>
            )
          )}
        </MessageText>
        {isTyping && <Typography variant="body2">Someone is typing...</Typography>}
      </MessageContainer>
    </Component>
  );
}
