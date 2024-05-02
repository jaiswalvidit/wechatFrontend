import React, { useContext } from "react";
import { Box, Typography, Avatar, styled } from "@mui/material";
import { AccountContext } from "../../context/AccountProvider";
import { format } from "./utils";
import { otherMember } from "./chat/miscelleanous";

const Component = styled(Box)(({ theme }) => ({
  display: "flex",
  height: "auto",
  padding: "15px 5px",
  cursor: "pointer",
  border: "1px solid #ccc",
  borderRadius: "5px",
  margin: '2px 0',
  backgroundColor: theme.palette.background.default,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

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

const MessageText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '0.875rem',
  lineHeight: '1.35em',
  maxWidth: '100%',
  overflowY: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap', // ensures no wrap and text overflow is handled
}));

const Time = styled(Box)(({ theme }) => ({
  marginLeft: "auto",
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
}));

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
  const { messages, isTyping, userDetails, currentMessage} = useContext(AccountContext);
  const other = otherMember(user, userDetails);



  return (
    <Component onClick={onClick}>
      <Image src={`data:image/svg+xml;base64,${other.picture}`} alt={other.name} />
      
      <MessageContainer>
        <MessageText style={{ display: 'flex', alignItems: 'center' }}>
        <Name>{other.name}</Name>
        {!isTyping ? (
    currentMessage ? 
    <Time>{format(currentMessage.createdAt)}</Time> :
    (user.messages && user.messages.createdAt && <Time>{format(user.messages.createdAt)}</Time>)
) : null}
        </MessageText>
        {!isTyping?
        <MessageText>
          {currentMessage?.messageId && currentMessage.messageId._id === user._id ? (
            <Box>{currentMessage.type==="text"?<>{currentMessage.text}</>:'media'}</Box>
          ) : user && user.messages ? (
            <MessageText style={{ display: 'flex', justifyContent: "space-between" }}>
              <Text>{user.messages.type === 'text' ? user.messages.text : 'media'}</Text>
              {/* <Time>{format(user.messages.timestamp)}</Time> */}
            </MessageText>
          ) : null}
        </MessageText>:
        <Typography variant="body2">Someone is typing...</Typography>}
      </MessageContainer>
    </Component>
  );
}
