import { Box, List, ListItemText, Typography } from '@mui/material';
import GroupItem from './GroupItem';
import { getGroups } from '../../services/api';
import { useContext, useEffect, useState } from 'react';
import { AccountContext } from '../../context/AccountProvider';
export default function GroupList({ text }) {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const { userDetails, setSelectedChat,notification,setNotification } = useContext(AccountContext);

  useEffect(() => {
    const fetchGroups = async () => {
      if (!userDetails || !userDetails._id) {
        console.log('User details are empty or incomplete.');
        return;
      }
      try {
        const response = await getGroups(userDetails._id);
        if (response.groups) {
          setGroups(response.groups);
          const filtered = response.groups.filter(group =>
            group.group.toLowerCase().includes(text.toLowerCase())
          );
          setFilteredGroups(filtered);
        }
      } catch (error) {
        console.error('Failed to fetch groups:', error);
      }
    };

    fetchGroups();
  }, [userDetails, text]);

  const handleGroupClick = group => {
    setSelectedChat(group);
    notification = notification.filter(notif => notif.messageId._id !== group._id);
    setNotification(notification);

  };

  return (
    <Box sx={{ width: '90%', bgcolor: 'background.paper', overflowY: 'auto', padding: 2 }}>
      <Typography variant="h6" sx={{ color: 'primary.main', padding: '8px', fontWeight: 'medium' }}>
        Groups:
      </Typography>
      <List>
        {filteredGroups.length === 0 ? (
          <ListItemText primary="No groups found" sx={{ textAlign: 'center', color: 'text.secondary' }} />
        ) : (
          filteredGroups.map(group => (
            <GroupItem
              key={group._id}
              group={group}
              onClick={() => handleGroupClick(group)}
            />
          ))
        )}
      </List>
    </Box>
  );
}
