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
  const { groups,isGroupCreate,setSelectedChat } = useContext(AccountContext);

  return (
    <>
      <Box style={{ color: '#131324', overflow: 'auto' }}> {/* Add overflow here */}
        <Header />

        {isGroupCreate===false  ?
        <> <SearchAppBar setText={setText} text={text} />
       
       <Button onClick={() => {setShowChats(!showChats);
      setSelectedChat() }} variant="contained" color="primary" style={{ marginBottom: '10px' }}>
         {showChats ? 'Show Groups' : 'Show Chats'}
       </Button>
       <div style={{height:'65vh'}}>
       
       {showChats ? <Conversations text={text} /> : <GroupList text={text} />}
       </div></>:<><GroupCreate/></>}
       
      </Box>
    </>
  );
}
