import React, { useContext, useEffect} from "react";
import { Dialog, Box, styled } from "@mui/material";
import Menu from "../Menu";
import EmptyChat from "./chat/EmptyChat";
import Chatbox from "./chat/Chatbox";
import { AccountContext } from "../../context/AccountProvider";
import GroupBox from "../Groups/GroupBox";
// import { io } from 'socket.io-client';

const dialogStyle = {
  height: "100%",
  width: "100%",
  borderRadius: "none",
  maxWidth: "100%",
  maxHeight: "100%",
  boxShadow: "none",
  overflow: "scroll",
  color: '#131324'
};

const Component = styled(Box)({
  display: "flex",
});

const Left = styled(Box)({
  minWidth: '250px',
  width: '35vw'
});

const Right = styled(Box)({
  width: '65vw',
  minWidth: '300px',
  height: '100%',
  borderLeft: '1px solid rgba(0,0,0,0.14)',
});
export default function ChatDialog() {
  const {groupDetails, userDetails, setActiveUsers, socket, selectedChat,groups} = useContext(AccountContext);

  useEffect(() => {
    if (socket && userDetails) {
      socket.emit('addUser', userDetails._id);
      socket.on('getUsers', (users) => {
        console.log('active users are', users);
        setActiveUsers(users);
      });
    }
    
    // Add error handling for socket connection and event listeners
    if (socket) {
      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        // Handle error (e.g., display error message to user)
      });

      socket.on('error', (error) => {
        console.error('Socket error:', error);
        // Handle error (e.g., display error message to user)
      });

      // Clean up event listeners
      return () => {
        socket.off('connect_error');
        socket.off('error');
      };
    }
  }, [socket, userDetails, setActiveUsers]);
  // console.log('chat is as follo',selectedChat.isGroupChat);
  return (
    <Dialog open={true} PaperProps={{ sx: dialogStyle }} hideBackdrop={true}>
      <Component>
        <Left>
          <Menu />
        </Left>
        <Right>
        {/* // Assuming selectedChat is defined */}
{
 (!selectedChat || Object.keys(selectedChat).length === 0) ?
   <EmptyChat />:(
  (selectedChat.isGroupChat === false)? 
  <Chatbox />:

   <GroupBox />)

}


        </Right>
      </Component>
    </Dialog>
  );
}
