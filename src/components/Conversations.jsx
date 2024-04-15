import React, { useContext, useEffect, useState } from 'react';
import { AccountContext } from '../context/AccountProvider';
import { Box, CircularProgress, Typography, styled, Button } from '@mui/material';
import Chat from './chat/Chat';
import { convoDetails } from '../services/api';
import NewChatModal from './NewChatModal';

const StyledBox = styled(Box)({
  padding: '20px',
});

const Conversations = ({ text }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [list, setList] = useState([]);
  const { userDetails, setSelectedChat } = useContext(AccountContext);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await convoDetails(userDetails._id);
        if (response.groups) {
          const userNames = response.groups
            .filter((group) => group.users.some((user) => user._id !== userDetails._id))
            .map((group) => group.users.map((user) => user.name));
          const updatedList = userNames.flatMap(user => user[0] === userDetails.name ? user[1] : user[0]);
          setList(updatedList);
          const filteredUsers = response.groups.filter((group) =>
            group.users.some(
              (user) =>
                user._id !== userDetails._id &&
                user.name.toLowerCase().includes(text.toLowerCase())
            )
          );
          setUsers(filteredUsers);
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
  }, [text, userDetails]);

  const handleClick = (user) => {
    setSelectedChat(user);
  };

  const handleNewChat = () => {
    setIsNewChatModalOpen(!isNewChatModalOpen);
  };

  return (
    <StyledBox>
      <Typography variant="h5" component="h2" mb={2}>
        Conversations
      </Typography>
      <Button variant="contained" color="primary" onClick={handleNewChat} sx={{ mb: 2 }}>
        {isNewChatModalOpen ? "Close Modal" : "Start New Chat"}
      </Button>
      <NewChatModal open={isNewChatModalOpen} onClose={handleNewChat} list={list}  setList={setList}/>
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
