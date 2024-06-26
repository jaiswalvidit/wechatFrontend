import React, { useContext, useState } from 'react';
import { Box, Typography, Avatar, styled } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import { AccountContext } from '../../../context/AccountProvider';
import { otherMember } from './miscelleanous';
import SimplePeer from 'simple-peer'; // Import WebRTC library
import { useNavigate } from 'react-router-dom';

const Component = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  backgroundColor: "#f0f0f0",
  color: 'red',
  borderBottom: `1px solid ${theme.palette.divider}`,
  height: '10vh'
}));

const StyledAvatar = styled(Avatar)({
  marginRight: '12px',
  width: 40,
  height: 40
});

const StyledIconBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    margin: '0 8px',
    cursor: 'pointer',
    color: '#B1B3B5'
  }
});

const UserInfo = styled(Box)({
  flexGrow: 1
});

const Text = styled(Typography)({
  fontSize: '1.2rem',
  fontFamily:'cursive',
  fontWeight: 700
});

const Name = styled(Typography)(({ theme, isOnline }) => ({
  fontSize: '1rem',
  fontWeight: 600,
  fontFamily:'cursive',
  color: isOnline ? theme.palette.success.main : theme.palette.error.main
}));

export default function ChatHeader() {
  const { activeUsers, selectedChat, userDetails, socket } = useContext(AccountContext); // Assuming socket is provided by AccountProvider
  const person = otherMember(selectedChat, userDetails);
  const isOnline = activeUsers?.some(user => user === person?._id);
  const navigate=useNavigate();
  // WebRTC State
  const [peers, setPeers] = useState([]);

  // Function to initiate call
  const handleCall = () => {
    // Emit a socket event to initiate the call

    socket.emit("join-roon",{room:selectedChat._id,user:userDetails._id});
    socket.emit('call user', { userId:person._id});
    navigate(`/room/${selectedChat._id}`); // Assuming the server listens for 'call' events and handles call initiation
  }

  return (
    <Component>
      <StyledAvatar src={`data:image/svg+xml;base64,${person?.picture}` } alt={person?.name}  style={{marginLeft:'45px'}}/>
      <UserInfo>
        <Text variant="subtitle1">{person?.name}</Text>
        <Name isOnline={isOnline}>
          {isOnline ? 'Online' : 'Offline'}
        </Name>
      </UserInfo>
      <StyledIconBox>
        {/* <CallIcon onClick={handleCall}/> */}
      </StyledIconBox>
    </Component>
  );
}
