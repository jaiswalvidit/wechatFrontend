import React, { useContext, useEffect, useState } from "react";
import { Box, Button, styled, useMediaQuery } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Menu from "../Menu";
import Chatbox from "./chat/Chatbox";
import GroupBox from "../Groups/GroupBox";
import { AccountContext } from "../../context/AccountProvider";

const Component = styled(Box)({
  display: "flex",
  flexDirection: "row",
  borderRadius: '1rem',
  margin: '-2px',
  '@media (max-width: 700px)': {
    flexDirection: "column",
  }
});

const Left = styled(Box)({
  minWidth: '250px',
  width: '35vw',
  '@media (max-width: 700px)': {
    width: '100%',
    minWidth: '100%',
  }
});

const Right = styled(Box)({
  position: 'relative',
  width: '65vw',
  minWidth: '300px',
  height: '100%',
  borderLeft: '1px solid rgba(0,0,0,0.14)',
  '@media (max-width: 700px)': {
    width: '100%',
    minWidth: '100%',
    borderTop: '1px solid rgba(0,0,0,0.14)',
    borderLeft: 'none',
  }
});

const BackButton = styled(Button)({
  position: 'absolute',
  top: '15px',
  left: '0px',
});

export default function ChatDialog() {
  const { userDetails, setActiveUsers, socket, selectedChat } = useContext(AccountContext);
  const isSmallDevice = useMediaQuery('(max-width: 700px)');
  const [showRightComponent, setShowRightComponent] = useState(true);

  useEffect(() => {
    if (!socket || !userDetails._id) return;

    const handleActiveUsers = (users) => {
      setActiveUsers(users);
    };

    socket.emit('login', userDetails._id);
    socket.on('activeUsers', handleActiveUsers);
    socket.on('connect_error', err => console.error('Socket connection error:', err));

    return () => {
      socket.off('activeUsers', handleActiveUsers);
      socket.off('connect_error');
    };
  }, [socket, userDetails._id, setActiveUsers]);

  useEffect(() => {
    setShowRightComponent(selectedChat && Object.keys(selectedChat).length !== 0);
  }, [selectedChat]);

  return (
    <Box>
      <Component>
        {isSmallDevice ? (
          showRightComponent ? (
            <Right>
              <BackButton onClick={() => setShowRightComponent(false)}>
                <ArrowBackIcon />
              </BackButton>
              {selectedChat ? (selectedChat.isGroupChat ? <GroupBox /> : <Chatbox />) : null}
            </Right>
          ) : (
            <Left><Menu /></Left>
          )
        ) : (
          <>
            <Left><Menu /></Left>
            {showRightComponent && (
              <Right>
                {selectedChat ? (selectedChat.isGroupChat ? <GroupBox /> : <Chatbox />) : null}
              </Right>
            )}
          </>
        )}
      </Component>
    </Box>
  );
}
