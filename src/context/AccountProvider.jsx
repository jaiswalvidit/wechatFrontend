import React, { useState, createContext } from "react";


export const AccountContext = createContext(null);

const AccountProvider = ({ children }) => {
  const [person, setPerson] = useState({});
  const [userDetails, setUserDetails] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [flag, setFlag] = useState(false);
  const [groups, setGroups] = useState(false);
  // const [groupId, setGroupId] = useState(null);
  const [groupDetails, setGroupDetails] = useState({});
  const [incomingMessage, setIncomingMessage] = useState([]);
  const [notification,setNotification]=useState([]);
  const [selectedChat,setSelectedChat]=useState();
  // const [convoChat,setConvoChat]=useState({});
  const [isGroupCreate,setIsGroupCreate]=useState(false);
 
  return (
    <AccountContext.Provider
      value={{
        person,
        setPerson,
        userDetails,
        setUserDetails,
        activeUsers,
        setActiveUsers,
        
        flag,
        setFlag,
        groupDetails,
        selectedChat,setSelectedChat,
        groups,
        isGroupCreate,
        setIsGroupCreate,
        setGroups,
        setGroupDetails,
        incomingMessage,
        setIncomingMessage,
        notification,
        setNotification
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider;
