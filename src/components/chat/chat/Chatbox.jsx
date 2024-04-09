import React, { useContext, useEffect, useState } from 'react';
import { AccountContext } from '../../../context/AccountProvider';
import ChatHeader from './ChatHeader';
import EmptyChat from './EmptyChat';
import { Box } from '@mui/material';
import { getConversation } from '../../../services/api';
import Messages from './Messages';

export default function Chatbox() {
  const { person, userDetails,setSelectedChat} = useContext(AccountContext);
  const [conversation, setConversation] = useState({});

  
  return (
    <>
    
      {person && (
        <Box>
          <ChatHeader />
          <Messages  style={{height:'80%',backgroundColor:'black'}}  />
        </Box>
      )}
      {!person && <EmptyChat />}
    </>
  );
}
