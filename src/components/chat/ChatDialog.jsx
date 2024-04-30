import React, { useContext, useEffect, useState } from "react";
import { Dialog, Box, Button, styled } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Menu from "../Menu";
import Chatbox from "./chat/Chatbox";
import GroupBox from "../Groups/GroupBox";
import { AccountContext } from "../../context/AccountProvider";

const Component = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  borderRadius: '1rem',
  margin: '-2px',
  [theme.breakpoints.down('sm')]: {
    flexDirection: "column",
  }
}));

const Left = styled(Box)(({ theme }) => ({
  minWidth: '250px',
  width: '35vw',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    minWidth: '100%',
  }
}));

const Right = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '65vw',
  minWidth: '300px',
  height: '100%',
  borderLeft: '1px solid rgba(0,0,0,0.14)',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    minWidth: '100%',
    borderTop: '1px solid rgba(0,0,0,0.14)',
    borderLeft: 'none',
  }
}));

const BackButton = styled(Button)({
  position: 'absolute',
  top: '15px',
  left: '0px',
});

export default function ChatDialog() {
  const { userDetails, setActiveUsers, socket, selectedChat } = useContext(AccountContext);
  const [showRightComponent, setShowRightComponent] = useState(true);
  const [isSmallDevice, setIsSmallDevice] = useState(false);

  useEffect(() => {
    const setupSocket = () => {
      if (socket && userDetails._id) {
        socket.emit('login', userDetails._id);
        socket.on('activeUsers', users => {
          setActiveUsers(users);
        });
        socket.on('connect_error', error => {
          console.error('Socket connection error:', error);
        });
        return () => {
          socket.off('activeUsers');
          socket.off('connect_error');
          socket.off('error');
        };
      }
    };

    setupSocket();
  }, [socket, userDetails._id, setActiveUsers]);

  useEffect(() => {
    const handleResize = () => setIsSmallDevice(window.innerWidth <= 650);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    console.log(selectedChat);
    setShowRightComponent(selectedChat && Object.keys(selectedChat).length !== 0 );
  }, [selectedChat]);

  return (
    <Box>
      <Component>
        {isSmallDevice ? (
          showRightComponent ? (
            <Right>
              <BackButton  onClick={() => setShowRightComponent(false)} style={{zIndex:'10',marginBottom:'20px'}}>
                <ArrowBackIcon />
              </BackButton>
              {selectedChat===undefined?<></>: selectedChat?.isGroupChat ? <GroupBox /> : <Chatbox />}
            </Right>
          ) : (
            <Left>
              <Menu />
            </Left>
          )
        ) : (
          <>
            <Left><Menu /></Left>
            {showRightComponent && (
              <Right>
                {selectedChat===undefined?<></>:  selectedChat?.isGroupChat ? <GroupBox /> : <Chatbox />}
              </Right>
            )}
          </>
        )}
      </Component>
    </Box>
  );
}
