import React, { useContext, useEffect, useState } from 'react';
import { Modal, Box, Typography, Button, CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import { AccountContext } from '../context/AccountProvider';
import { addChat } from '../services/api';

const NewChatModal = ({ open, onClose, list,setList }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users1, setUsers1] = useState([]);
  const { userDetails } = useContext(AccountContext);
  
  const handleClick = async (user) => {
    console.log('Clicked on user:', user);

    try {
      setLoading(true);
      // Add chat logic
      const response = await addChat({ users: [user._id, userDetails._id] });
      console.log(response,'ww');
      console.log(response.message,'sss');
      if(response.message)
      {

      console.log('added');
      setList(prevList => [...prevList, user.name]);
      // ,ok got it_
      }
      
    } catch (error) {
      console.error('Error adding chat:', error);
      setError('Failed to add chat. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://wechatbackend-qlpp.onrender.com/api/users");
       
        // if (!response.message==="successful") {
        //   throw new Error("Failed to fetch user data");
        // }
        const userData = await response.json();
        console.log('lists ar',list)
        const filteredUsers = userData.users.filter(user => !list.includes(user.name) && user.name !== userDetails.name);
        setUsers1(filteredUsers);
        setError(null);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setList,list, userDetails]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        borderRadius: 4,
        boxShadow: 24,
        p: 4,
        '& .user-list': {
          maxHeight: 300,
          overflow: 'auto',
          margin: '0',
          padding: '0',
          listStyle: 'none',
        },
        '& .user-item': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px',
          borderBottom: '1px solid #ccc',
        },
        '& .user-name': {
          flexGrow: 1,
        },
        '& .add-button': {
          marginLeft: '8px',
        },
      }}>
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
          <React.Fragment>
            {users1.length === 0 ? (
              <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                No new users found
              </Typography>
            ) : (
              <List className="user-list">
                {users1.map(user => (
                  <ListItem key={user._id} className="user-item">
                    <ListItemText primary={user.name} className="user-name" />
                    <Button onClick={() => handleClick(user)} className="add-button">+</Button>
                  </ListItem>
                ))}
              </List>
            )}
          </React.Fragment>
        )}
        <Button variant="contained" color="primary" onClick={onClose} sx={{ mt: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default NewChatModal;
