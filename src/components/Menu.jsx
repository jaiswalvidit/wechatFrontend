import React, { useContext, useState } from 'react';
import Header from './Header';
import SearchAppBar from './Search';
import { Box, Button } from '@mui/material';
import Conversations from './Conversations';
import { AccountContext } from '../context/AccountProvider';
import GroupList from './Groups/GroupList';
import GroupCreate from './Groups/GroupCreate';

export default function Menu() {
  const [text, setText] = useState('');
  const [showChats, setShowChats] = useState(true); // State to control whether to show chats or groups
  const { groups,isGroupCreate,setSelectedChat,selectedChat } = useContext(AccountContext);

  return (
    <>
      <Box style={{ color: '#131324', overflow: 'auto' }}> {/* Add overflow here */}
        <Header />

        {isGroupCreate===false  ?
        <> <SearchAppBar setText={setText} text={text} />
       
       <Box sx={{
  display: 'flex',
  flexDirection: 'column',
  margin:'0px auto', // Centers children horizontally in the container
  width: '70%' // Ensures the container takes full width
}}>
  <Button
    onClick={() => {
      setShowChats(!showChats);
      setSelectedChat({});
    }}
    variant="contained"
    color="primary"
    sx={{
      mt: 2, // Adds space at the top
      width: '100%' // Full width for better mobile responsiveness
    }}
  >
    {showChats ? 'Show Groups' : 'Show Chats'}
  </Button>
</Box>

       <div style={{height:'65vh'}}>
       
       {showChats || (selectedChat && selectedChat.isGroupChat==='true') ? <Conversations text={text} /> : <GroupList text={text} />}
       </div></>:<><GroupCreate/></>}
       
      </Box>
    </>
  );
}
