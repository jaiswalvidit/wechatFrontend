import React, { useContext, useEffect, useState } from 'react';
import { Modal, Box, Typography, Button, CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import { AccountContext } from '../context/AccountProvider';
import { addChat } from '../services/api';

const NewChatModal = ({ open, onClose, list }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const { userDetails } = useContext(AccountContext);
  
  const handleCLick = (user) => {
    console.log('clicked');

    const fetchData = async () => {
      setLoading(true);
      try {
        // Assuming addChat is a function that sends data to the backend to create a new chat
        const response = await addChat({ users: [user, userDetails] });
        if (!response.ok) throw new Error("Failed to add chat");
        const responseData = await response.json();
        console.log("New chat added:", responseData);
        // Handle any further logic based on the response from the backend
      } catch (error) {
        console.error('Error adding chat:', error);
        // Handle the error appropriately
      } finally {
        setLoading(false);
      }
    };

    fetchData(user);

  }

  useEffect(() => {
    console.log("Fetching data...");
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://wechatbackend-qlpp.onrender.com/api/users");
        if (!response.ok) throw new Error("Failed to fetch user data");
        const userData = await response.json();

        console.log("Fetched data:", userData);

        const filteredUsers = userData.users.filter(user => !list.includes(user.name) && user.name !== userDetails.name);
        console.log("Filtered users:", filteredUsers);

        setUsers(filteredUsers);
        setError(null);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [list, userDetails]);

  console.log("Users:", users);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position: 'absolute',top: '50%',left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', borderRadius: 4, boxShadow: 24, p: 4 }}>
        <Typography variant="h5" mb={2}>
          Start New Chat
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography variant="body1" color="error" align="center">
            {error}
          </Typography>
        ) : (
          <List sx={{ maxHeight: 300, overflow: 'auto' }}>
            {users.length===0}
            No new users found
            {users.length>0 && users.map(user => (
              <React.Fragment key={user._id}>
                <ListItem button onClick={() => onClose(user)}>
                  <ListItemText primary={user.name} />
                </ListItem>
                <Button onClick={handleCLick(user)}>+</Button>
              </React.Fragment>
            ))}
          </List>
        )}
        <Button variant="contained" color="primary" onClick={onClose} sx={{ mt: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default NewChatModal;
