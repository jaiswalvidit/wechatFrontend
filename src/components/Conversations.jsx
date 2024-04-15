import React, { useContext, useEffect, useState } from 'react';
import { AccountContext } from '../context/AccountProvider';
import { Box, CircularProgress, Typography, styled, Button } from '@mui/material';
import Chat from './chat/Chat';
import { convoDetails } from '../services/api';
import NewChatModal from './NewChatModal'; // Import the modal component

const StyledBox = styled(Box)({
  padding: '20px',
});

const Conversations = ({ text }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false); // State to manage modal open/close
  const [conversationUsers, setConversationUsers] = useState([]); // State to store user names in the conversation
  const { userDetails, setSelectedChat } = useContext(AccountContext);
  const [list, setList] = useState([]); // State to store the list of users for the modal

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await convoDetails(userDetails._id);
        if (response.groups) {
          const userNames = response.groups
            .filter((group) => group.users.some((user) => user._id !== userDetails._id))
            .map((group) => group.users.map((user) => user.name));

          const updatedList = [];
          userNames.forEach(user => {
            if (user[0] === userDetails.name)
              updatedList.push(user[1]);
            else
              updatedList.push(user[0]);
          });

          setList(updatedList); // Update list state immutably
          // setUsers(response.groups);
          const filteredUsers = response.groups.filter((group) =>
            group.users.some(
              (user) =>
                user._id !== userDetails._id &&
                user.name.toLowerCase().includes(text.toLowerCase())
            )
          );
          setUsers(filteredUsers);
          setConversationUsers(userNames.flat());
        }
        setError(null);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [text, userDetails._id]);

  const handleClick = (user) => {
    setSelectedChat(user);
  };

  const handleStartNewChat = () => {
    setIsNewChatModalOpen(true); // Open the modal when "Start New Chat" is clicked
  };

  const handleCloseNewChatModal = () => {
    setIsNewChatModalOpen(false); // Close the modal
  };

  return (
    <StyledBox>
      <Typography variant="h5" component="h2" mb={2}>
        Conversations
      </Typography>
      <Button variant="contained" color="primary" onClick={handleStartNewChat} sx={{ mb: 2 }}>
        Start New Chat
      </Button>
      <NewChatModal open={isNewChatModalOpen} onClose={handleCloseNewChatModal} list={list} />
      {/* Render the modal component */}
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" height={200}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Typography variant="body1" color="error" align="center">
          {error}
        </Typography>
      )}
      {!loading && !error && (
        <Box>
          {users.map((user) => (
            <Chat key={user._id} user={user} onClick={() => handleClick(user)} />
          ))}
        </Box>
      )}
    </StyledBox>
  );
};

export default Conversations;
