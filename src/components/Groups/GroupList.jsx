import React, { useState, useEffect, useContext } from 'react';
import { Box, List } from '@mui/material';
import { getGroups } from '../../services/api';
import { AccountContext } from '../../context/AccountProvider';
import GroupItem from './GroupItem';

export default function GroupList({ text }) {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const { userDetails, setSelectedChat } = useContext(AccountContext);

  useEffect(() => {
    // Function to fetch groups
    const fetchGroups = async () => {
      if (!userDetails || !userDetails._id) {
        console.log('User details are empty or incomplete.');
        return;
      }
      try {
        const response = await getGroups(userDetails._id);
        if (response.groups) {
          setGroups(response.groups);
          // Filter the groups based on the provided text
          const filtered = response.groups.filter(group => group.group.toLowerCase().includes(text.toLowerCase()));
          setFilteredGroups(filtered);
          console.log('Fetched groups:', response.groups);
        }
      } catch (error) {
        console.error('Failed to fetch groups:', error);
      }
    };

    // Calling fetchGroups if userDetails exists and has an _id
    fetchGroups();
  }, [userDetails, text]); // Dependency array, re-run useEffect when userDetails or text changes

  const handleGroupClick = (group) => {
    console.log('Selected group:', group);
    setSelectedChat(group);
    // Optionally emit a socket event if a socket connection exists
    // if (socket) {
    //   socket.emit('joinGroup', group._id);
    // }
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', overflowY: 'scroll' }}>
      <List>
        {filteredGroups.length === 0 ? (
          <Box sx={{ padding: '10px' }}>No groups found</Box>
        ) : (
          filteredGroups.map(group => (
            <GroupItem key={group._id} group={group} onClick={() => handleGroupClick(group)} />
          ))
        )}
      </List>
    </Box>
  );
}
