import React, { useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

export const AccountContext = createContext(null);

const AccountProvider = ({ children }) => {
  const [person, setPerson] = useState({});
  const [userDetails, setUserDetails] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [flag, setFlag] = useState(false);
  const [groups, setGroups] = useState(false);
  const [groupDetails, setGroupDetails] = useState({});
  const [incomingMessage, setIncomingMessage] = useState([]);
  const [notification, setNotification] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  const [isGroupCreate, setIsGroupCreate] = useState(false);
  const [currentMessage, setCurrentMessage] = useState();
  const [socket, setSocket] = useState(null);
const [incomingCall,setIncomingCall]=useState(null);
const navigate=useNavigate();
  useEffect(() => {
    const newSocket = io("https://wechatbackend-qlpp.onrender.com/", {
      cors: {
        origin: "https://your-frontend-url.com",
      },
    });
    

    newSocket.on("connect", () => {
      console.log("Connected to socket.io");
      if (userDetails) {
        newSocket.emit("login", userDetails._id); // Emit login event
      }
    });

    newSocket.on("activeUsers", (users) => {
      setActiveUsers(users);
      console.log(activeUsers);
      console.log(users,'users are');
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    newSocket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userDetails]);


  useEffect(() => {
    if (socket) {
      socket.on("incoming call", (callInfo) => {
        console.log("Incoming call:", callInfo);
        // Update the incoming call state with call information
        setIncomingCall(callInfo);
        navigate('/room/:callinfo');
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("message received", (newMessageReceived) => {
        console.log(newMessageReceived,'received');
        
        if (
          selectedChat._id!==newMessageReceived.messageId._id
        ) {
          if (!notification.includes(newMessageReceived)) {
            console.log('already have');
            // if (!newMessageReceived?.messageId?.isGroupChat)
              // toast.success(`Message received from sender ${newMessageReceived?.senderId?.name}`);
            // else
              // toast.success(`Message received from group ${newMessageReceived?.messageId?.group}`);
            setNotification([newMessageReceived, ...notification]);
          }
        } else {
          console.log('got it ');
          // setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
        }
      });
    }
  }, [socket, notification]);

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
        selectedChat,
        setSelectedChat,
        groups,
        isGroupCreate,
        setIsGroupCreate,
        setGroups,
        setGroupDetails,
        incomingMessage,
        setIncomingMessage,
        notification,
        setNotification,
        currentMessage,
        setCurrentMessage,
        socket,incomingCall,
        setIncomingCall
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider;