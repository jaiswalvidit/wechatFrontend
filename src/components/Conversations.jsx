import React, { useContext, useEffect, useState } from "react";
import { AccountContext } from "../context/AccountProvider";
import { Box, CircularProgress, Typography, styled } from "@mui/material";
import Chat from "./chat/Chat";
import { addChat } from "../services/api";

const StyledBox = styled(Box)({
  padding: "20px",
});

const Conversations = ({ text }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userDetails, setSelectedChat } = useContext(AccountContext);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8001/api/users");
        if (!response.ok) throw new Error("Failed to fetch user data");
        const userData = await response.json();
        const filteredData = userData.users.filter((user) =>
          user.name.toLowerCase().includes(text.toLowerCase())
        );
        setUsers(filteredData);
        setError(null);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [text]);

  const handleClick = async (user) => {
    const users = [userDetails._id, user._id];

    try {
      const conversationData = await addChat({ users });
      setSelectedChat(conversationData.newChat);
    } catch (error) {
      console.error("Error handling chat:", error);
    }
  };

  return (
    <StyledBox>
      <Typography variant="h5" component="h2" mb={2}>
        Conversations
      </Typography>
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
            user._id !== userDetails._id && (
              <Chat key={user._id} user={user} onClick={() => handleClick(user)} />
            )
          ))}
        </Box>
      )}
    </StyledBox>
  );
};

export default Conversations;
