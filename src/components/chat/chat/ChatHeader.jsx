import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { Box, Typography, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { AccountContext } from '../../../context/AccountProvider';
import {otherMember} from './miscelleanous'; // Corrected import spelling


const Component = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '10px',
  margin: 'auto',
  backgroundColor: 'grey'
});

const StyledAvatar = styled(Avatar)({
  marginRight: '10px'
});

const Icon = styled(Box)({
  margin: 'auto',
  padding: '0px 10px'
});


export default function ChatHeader() {
  const { activeUsers, selectedChat, userDetails } = useContext(AccountContext);
  const person = otherMember(selectedChat, userDetails);
  console.log('conversation is ',selectedChat);
  console.log('other is',person);
  console.log('active users',activeUsers);
  return (
    <Component>
      <StyledAvatar src={person?.picture} alt={person?.name} />
      <Box>
        <Typography variant="body1">{person?.name}</Typography>
        <Typography variant="body2" color={activeUsers?.find(user => user.user === person._id) ? 'green' : 'red'}>
          {activeUsers?.find(user => user.user === person._id) ? 'Online' : 'Offline'}
        </Typography>
      </Box>
      <Box flexGrow={1} />
      <Icon>
        <SearchIcon />
        <MoreVertIcon />
      </Icon>
    </Component>
  );
}
