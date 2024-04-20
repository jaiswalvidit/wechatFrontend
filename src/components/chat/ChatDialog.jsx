import React, { useContext, useEffect, useState } from "react";
import { Dialog, Box, styled, Button } from "@mui/material";
import Menu from "../Menu";

import Chatbox from "./chat/Chatbox";
import { AccountContext } from "../../context/AccountProvider";
import GroupBox from "../Groups/GroupBox";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const dialogStyle = {
  height: "100%",
  width: "100%",
  borderRadius: "none",
  maxWidth: "100%",
  maxHeight: "100%",
  boxShadow: "none",
  // backgroundColor: 'orange'
};

const Component = styled(Box)({
  display: "flex",
  flexDirection: "row",
  borderRadius:'1 rem',
  margin:0,
  '@media (max-width: 600px)': {
    flexDirection: "column",
  }
});

const Left = styled(Box)({
  minWidth: '250px',
  width: '35vw',
  margin:'0px',
  '@media (max-width: 600px)': {
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
  '@media (max-width: 600px)': {
    width: '100%',
    minWidth: '100%',
    borderTop: '1px solid rgba(0,0,0,0.14)',
    borderLeft: 'none',
  }
});

const BackButton = styled(Button)({
  position: 'absolute',
  top: '10px',
  left: '10px',
});

export default function ChatDialog() {
  const { userDetails, setActiveUsers, socket, selectedChat, groups } = useContext(AccountContext);
  const [showRightComponent, setShowRightComponent] = useState(true);
  const [isSmallDevice, setIsSmallDevice] = useState(false);

  useEffect(() => {
    if (socket && userDetails) {
      socket.emit('addUser', userDetails._id);
      socket.on('getUsers', users => {
        setActiveUsers(users);
      });
      socket.on('connect_error', error => {
        console.error('Socket connection error:', error);
      });
      socket.on('error', error => {
        console.error('Socket error:', error);
      });
      return () => {
        socket.off('connect_error');
        socket.off('error');
      };
    }
  }, [socket, userDetails, setActiveUsers]);

  useEffect(() => {
    if (selectedChat && Object.keys(selectedChat).length !== 0 && selectedChat.isGroupChat !== undefined) {
      setShowRightComponent(true);
    } else {
      setShowRightComponent(false);
    }
  }, [selectedChat]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallDevice(window.innerWidth <= 600);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
    <Dialog open={true} PaperProps={{ sx: dialogStyle }} hideBackdrop={true}>
      <Component>
        {isSmallDevice ? (
          showRightComponent ? (
            <Right>
              <BackButton variant="contained" onClick={() => setShowRightComponent(false)}><ArrowBackIcon/></BackButton>
              {
                selectedChat && selectedChat.isGroupChat === false ?
                <Chatbox /> :
                <GroupBox />
              }
            </Right>
          ) : (
            <Left>
              <Menu />
            </Left>
          )
        ) : (
          <>
            <Left>
              <Menu />
            </Left>
            {showRightComponent && (
              <Right>
               
                {
                  selectedChat && selectedChat.isGroupChat === false ?
                  <Chatbox /> :
                  <GroupBox />
                }
              </Right>
            )}
          </>
        )}
      </Component>
    </Dialog>
    </>
  );
}
