import React, { useContext } from 'react';
import GroupHeader from './GroupHeader';
// import GroupMessages from './GroupMessages';
import { AccountContext } from '../../context/AccountProvider';
import EmptyChat from '../chat/chat/EmptyChat';
// import Typing from '../chat/chat/Typing';
import Messages from '../chat/chat/Messages';
// import Typing from '../chat/chat/Typing';

export default function GroupBox() {
  // const [isClicked, setIsClicked] = useState(false);
  const { groupDetails,selectedChat} = useContext(AccountContext);

 

  return (
    <>

{(!selectedChat || Object.keys(selectedChat).length === 0) ? (
        <Messages />
      ) : (
        <>
        {/* {selectedChat.isGroupChat} */}
          <GroupHeader />
          <Messages groupDetails={groupDetails} />
          
        
        </>
      )}
    </>
  );
}
