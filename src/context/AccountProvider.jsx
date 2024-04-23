import React, { useState, createContext, useEffect } from "react";
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
        socket,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider;
