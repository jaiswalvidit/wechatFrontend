import React, { useContext, useEffect, useState } from "react";
import { AccountContext } from "../context/AccountProvider";
import { Box, CircularProgress, Typography, styled } from "@mui/material";
import Chat from "./chat/Chat";
import { addChat, convoDetails } from "../services/api";

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
        const response = await convoDetails(userDetails._id);

        console.log(response.groups,'data');
        // if (response.status!==200) throw new Error("Failed to fetch user data");
        const userData = response.groups;
        // const filteredData = userData.filter((group) => {
        //   const currentUserIndex = group.users.findIndex((user) => user._id === userDetails._id);
        //   return currentUserIndex === -1; // Return true if current user is not found in the group
        // });
        // );
        setUsers(userData);
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
console.log(users);
  const handleClick = async (user) => {
    // const users = [userDetails._id, user._id];

   
      setSelectedChat(user);
 
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
