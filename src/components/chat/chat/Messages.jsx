import React, { useContext, useEffect, useState, useRef } from "react";
import styled from "@emotion/styled";
import { Box, IconButton, Typography } from "@mui/material";
import { AccountContext } from "../../../context/AccountProvider";
import Typing from "./Typing";
import { getMessage, newMessages, uploadFile } from "../../../services/api";
import Message from "./Message";
import { ArrowBack } from "@mui/icons-material";
import { otherMember } from "./miscelleanous";
import { io } from "socket.io-client";
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Wrapper = styled(Box)({
  backgroundSize: "80%",
  objectFit: "contain",
  height: "80vh",
  display: "flex",
  flexDirection: "column",
});

const ConversationContainer = styled(Box)({
  flex: 1,
  overflowY: "auto",
  padding: "0px 2rem",
  height: "100%",
});

export default function Messages() {
  const {
    userDetails,
    groupDetails,
    selectedChat,
    setActiveUsers,notification,
    setNotification
  } = useContext(AccountContext);
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false); // Track typing status
  const [newMessage, setNewMessage] = useState(""); // Track new message
  
  const selectedChatCompare = useRef(null);
  const [isTyping,setIsTyping]=useState(false);
  const ENDPOINT = "http://localhost:8001";
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  
  useEffect(() => {
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [ENDPOINT]);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("Connected to socket.io");
        socket.emit("setup", userDetails);
        setSocketConnected(true);
      });

      socket.on("typing", () => {
        console.log('received');
        setIsTyping(true);
      });

      socket.on("active users", (users) => {
        setActiveUsers(users);
      });

      socket.on("stop typing", () => {
        console.log('not callwed')
        setIsTyping(false);
      });

      socket.on("message received", (newMessageReceived) => {
        console.log(newMessageReceived,'ok');
        if (
          !selectedChatCompare.current ||
          selectedChatCompare.current._id !== newMessageReceived.messageId._id
        ) {
          if(!newMessageReceived.messageId.isGroupChat)
          toast.success(`Message received from sender ${newMessageReceived.senderId.name}`);
        else
        toast.success(`Message received from  group ${newMessageReceived.messageId.group}`);

          if (!notification.includes(newMessageReceived)) 
          {

            setNotification([newMessageReceived, ...notification]);
          }
        } else {
          setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
        }
      });
      

      return () => {
        socket.off("connect");
        socket.off("typing");
        socket.off("stop typing");
        socket.off("message received");
      };
    }
  }, [socket, userDetails, selectedChat, notification]);
console.log(notification,'llllllllllllllllllllllllll');
  const fetchData = async () => {
    try {
      const data = await getMessage(selectedChat?._id);
      setMessages(data?.message);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  

  useEffect(() => {
    if (selectedChat) {
      fetchData();
      socket?.emit("join chat", selectedChat._id);
      selectedChatCompare.current = selectedChat;
    }
  }, [selectedChat]);

  useEffect(() => {
    const conversationContainer = document.getElementById("conversation-container");
    if (conversationContainer) {
      conversationContainer.scrollTop = conversationContainer.scrollHeight;
    }
  }, [messages]);

  const sendText = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing",selectedChat._id);

      const isGroup = !selectedChat.members;
      const message = {
        senderId: userDetails?._id,
        messageId: selectedChat._id,
        type: file ? "file" : "text",
        text: file ? undefined : newMessage,
        mode: isGroup ? "group" : "individual",
        createdAt: Date.now(),
      };

      if (file) {
        try {
          const formData = new FormData();
          formData.append("file", file);
          const res = await uploadFile(formData);
          message.text = res;
          setImage(res);
        } catch (error) {
          console.error("Error uploading file:", error);
          return;
        }
      }

      setNewMessage("");
      setFile(null);

      try {
        const response = await newMessages(message);
        console.log(response);
        if (response) {
          socket.emit("new message", response.message);
          setMessages((prevMessages) => [...prevMessages, response.message]);
        } else {
          console.log("failed");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      console.log('here');
      socket?.emit("typing",selectedChat._id);
    }

    let timer;
    const delay = 3000;

    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log('stopped');
      socket?.emit("stop typing",selectedChat._id);
      setTyping(false);
    }, delay);
  };

  const person = otherMember(selectedChat, userDetails);

  return (
    <Wrapper>
      <ConversationContainer id="conversation-container">
        <Typography
          fontSize={{ base: "28px", md: "30px" }}
          pb={3}
          px={2}
          w="100%"
          fontFamily="Work sans"
          d="flex"
          justifyContent={{ base: "space-between" }}
          alignItems="center"
        >
          <IconButton
            sx={{ display: { base: "flex", md: "none" } }}
            // Add onClick handler for back button if needed
          >
            <ArrowBack />
          </IconButton>
          <Typography>
            {person ? person.name : groupDetails ? groupDetails.name : ""}
          </Typography>
        </Typography>
        <Box
          d="flex"
          flexDir="column"
          justifyContent="flex-end"
          p={3}
          // bg="#E8E8E8"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
        >
          {!selectedChat && loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <div style={{  overflowY: "auto" }}>
              <div>
                {messages.length > 0 &&
                  messages.map((msg, index) => (
                    <div key={index}>
                      <Message message={msg} />
                    </div>
                  ))}
              </div>
            </div>
          )}
        </Box>
      </ConversationContainer>
      <Typing
        isTyping={isTyping}
        newMessage={newMessage}
        typingHandler={typingHandler}
        sendText={sendText}
      />
        <ToastContainer position="top-center" />
    </Wrapper>
  );
}
