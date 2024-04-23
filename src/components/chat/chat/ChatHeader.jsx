import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { Box, Typography, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { AccountContext } from '../../../context/AccountProvider';
import { otherMember } from './miscelleanous';
// import { otherMember } from './miscellaneous'; // Corrected import spelling

const Component = styled(Box)({
  display: 'flex',
  // alignItems: 'center',
  // padding: '10px 16px', // Adjusted padding for better spacing
  backgroundColor: 'grey', // Dark mode friendly color
  height:'10vh',

  color: '#E7E9EB', // Light text for better readability
  borderBottom: '1px solid #43484D' // Added border bottom for separation
});

const StyledAvatar = styled(Avatar)({
  marginRight: '12px', // Slightly more space for separation
  width: 40, // Standardize avatar size
  height: 40
});

const StyledIconBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    margin: '0 8px', // Space between icons
    cursor: 'pointer', // Cursor pointer to indicate interactivity
    color: '#B1B3B5' // Subtle icon color
  }
});

const UserInfo = styled(Box)({
  flexGrow: 1 // Allow user info to take up remaining space
});

const Text = styled(Typography)({
  fontSize: '1.2rem',
  fontWeight: 400,
  fontFamily: 'cursive',
  color: '#E7E9EB', // Light text for better readability
  textShadow: 'none' // Removed text shadow
});

const Name = styled(Typography)({
  fontSize: '1rem',
  fontWeight: 600,
  // fontFamily: 'cursive',
  color: (props) => props.color, // Dynamic color based on user status
  textShadow: 'none' // Removed text shadow
});

export default function ChatHeader() {
  const { activeUsers, selectedChat, userDetails } = useContext(AccountContext);
  const person = otherMember(selectedChat, userDetails);  
  console.log('users',activeUsers);
  return (
    <Component>
      <StyledAvatar src={`data:image/svg+xml;base64,${person.picture}`} alt={person?.name} />
      <UserInfo>
        <Text variant="subtitle1">{person?.name}</Text>
        <Name color={activeUsers?.some(user => user === person._id) ? '#4CAF50' : '#F44336'}> 
          {activeUsers?.some(user => user === person._id) ? 'Online' : 'Offline'}
        </Name>
      </UserInfo>
      <StyledIconBox>
        <SearchIcon />
        <MoreVertIcon />
      </StyledIconBox>
    </Component>
  );
}
