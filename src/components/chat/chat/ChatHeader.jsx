import React, { useContext } from 'react';
import { Box, Typography, Avatar, styled } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { AccountContext } from '../../../context/AccountProvider';
import { otherMember } from './miscelleanous';

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
  const { activeUsers, selectedChat, userDetails } = useContext(AccountContext);
  const person = otherMember(selectedChat, userDetails);
  const isOnline = activeUsers?.some(user => user === person?._id);

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
        <SearchIcon />
        <MoreVertIcon />
      </StyledIconBox>
    </Component>
  );
}
