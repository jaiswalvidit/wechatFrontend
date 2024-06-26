import { Box, List, ListItemText, Typography, CircularProgress } from '@mui/material';
import GroupItem from './GroupItem';
import { getGroups } from '../../services/api';
import { useContext, useEffect, useState } from 'react';
import { AccountContext } from '../../context/AccountProvider';

export default function GroupList({ text }) {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading indicator
  const { userDetails, setSelectedChat, notification, setNotification } = useContext(AccountContext);

  useEffect(() => {
    const fetchGroups = async () => {
      if (!userDetails || !userDetails._id) {
        console.log('User details are empty or incomplete.');
        setLoading(false); // Stop loading indicator if userDetails are not available
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
      } finally {
        setLoading(false); // Stop loading indicator after fetching groups
      }
    };

    fetchGroups();
  }, [userDetails, text]);

  const handleGroupClick = group => {
    setSelectedChat(group);
    setNotification(prev => prev.filter(n => n.messageId._id !== group._id));
  };

  return (
    <Box sx={{ width: '90%', bgcolor: 'background.paper', overflowY: 'auto', padding: 2 }}>
      <Typography variant="h6" sx={{ color: 'primary.main', padding: '8px', fontWeight: 'medium' }}>
        Groups:
      </Typography>
      {loading ? ( // Render loading indicator while fetching groups
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
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
      )}
    </Box>
  );
}
