import React, { useContext, useEffect, useState, useRef } from "react";
import styled from "@emotion/styled";
import { Avatar, Box, IconButton, Tooltip, Typography } from "@mui/material";
import { AccountContext } from "../../../context/AccountProvider";
import Typing from "./Typing";
import { getMessage, newMessages, uploadFile } from "../../../services/api";
import Message from "./Message";
import { ArrowBack } from "@mui/icons-material";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser, otherMember } from "./miscelleanous";
import { io } from "socket.io-client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format,download } from "../utils";
import { GetApp as GetAppIcon } from '@mui/icons-material';
// import { download, formatDate } from '../../../utils';
import { iconPDF } from "../../../constants/data";
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

const MessageContainer = styled.div`
  display: flex;
  margin-bottom: ${(props) => (props.marginBottom ? "10px" : "0")};
`;

const Title = styled(Typography)({
  color: "orange",
  fontSize: "0.8rem",
  fontFamily: "TimesNewRoman",
  fontStyle: "inherit",
});

const Text = styled(Typography)({
  fontSize: "14px",
  padding: "5px 10px", // Adjust padding as necessary
});

const Time = styled(Typography)({
  fontSize: "10px",
  color: "#fff", // White text color for timestamp
  marginLeft: "5px", // Adjust spacing between text and timestamp
});

export default function Messages() {
  const {
    userDetails,
    groupDetails,
    selectedChat,
    setActiveUsers,
    notification,
    setNotification,
    currentMessage,
    setCurrentMessage
  } = useContext(AccountContext);
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false); // Track typing status
  const [newMessage, setNewMessage] = useState(""); // Track new message
  // const [file,setFile]
  const selectedChatCompare = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const ENDPOINT = "https://wechatbackend-qlpp.onrender.com/";
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [ENDPOINT]);
  console.log(messages,'message');
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
        console.log('not called')
        setIsTyping(false);
      });

      socket.on("message received", (newMessageReceived) => {
        console.log(newMessageReceived,'ok');
        if (
          !selectedChatCompare.current ||
          selectedChatCompare.current?._id !== newMessageReceived?.messageId?._id
        ) {
          if(!newMessageReceived?.messageId?.isGroupChat)
            toast.success(`Message received from sender ${newMessageReceived?.senderId?.name}`);
          else
            toast.success(`Message received from group ${newMessageReceived?.messageId?.group}`);

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

  const fetchData = async () => {
    try {
      const data = await getMessage(selectedChat?._id);
      setMessages(data?.message);
      console.log(data.message,'lists are');
      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      fetchData();
      socket?.emit("join chat", selectedChat?._id);
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
    console.log(e);
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat?._id);

      const isGroup = !selectedChat?.members;
      const message = {
        senderId: userDetails?._id,
        messageId: selectedChat?._id,
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
        setCurrentMessage(response?.message);
        if (response) {
          socket.emit("new message", response?.message);
          setMessages((prevMessages) => [...prevMessages, response?.message]);
        } else {
          console.log("failed");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };
  const ImageMessage = ({ message }) => {

    return (
        <div style={{ position: 'relative' }}>
          {message.text}
            {
                message?.text?.includes('.pdf') ?
                    <div style={{ display: 'flex' }}>
                        <img src={iconPDF} alt="pdf-icon" style={{ width: 80 }} />
                        <Typography style={{ fontSize: 14 }} >{message.text.split("/").pop()}</Typography>
                    </div>
                : 
                    <img style={{ width: 300, height: '30%', objectFit: 'cover' }} src={message.text} />
            }
            <Time style={{ position: 'absolute', bottom: 0, right: 0 }}>
                <GetAppIcon 
                    onClick={(e) => download(e, message.text)} 
                    fontSize='small' 
                    style={{ marginRight: 10, border: '1px solid grey', borderRadius: '50%' }} 
                />
              
            </Time>
        </div>
    )
}
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      console.log('here');
      socket?.emit("typing", selectedChat?._id);
    }

    let timer;
    const delay = 3000;

    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log('stopped');
      socket?.emit("stop typing", selectedChat?._id);
      setTyping(false);
    }, delay);
  };

  // const person = otherMember(selectedChat, userDetails);

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
            {/* {person ? person.name : groupDetails ? groupDetails.name : ""} */}
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
                {messages.length>0  &&
                messages.map((m, i) => (
                  <MessageContainer
                    key={m._id}
                    marginBottom={!isSameSender(messages, m, i, userDetails?._id)}
                  >
                    {(isSameSender(messages, m, i, userDetails?._id) ||
                      isLastMessage(messages, i, userDetails?._id)) && (
                      <Tooltip label={m.senderId.name} placement="bottom-start" hasArrow>
                        <Box
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            marginRight: "8px",
                          }}
                        >
                          <Avatar
                            src={`data:image/svg+xml;base64,${m.senderId.picture}`}
                            // src={message.senderId.picture}
                            sx={{ width: 24, height: 24 }}
                          />
                          <Title>{m.senderId.name}</Title>
                        </Box>
                      </Tooltip>
                    )}
                    <span
                      style={{
                        backgroundColor: `${
                          m.senderId._id === userDetails?._id ? "#BEE3F8" : "#B9F5D0"
                        }`,
                        marginLeft: isSameSenderMargin(messages, m, i, userDetails?._id),
                        marginTop: isSameUser(messages, m, i, userDetails?._id) ? 3 : 10,
                        borderRadius: "20px",
                        padding: "10px 15px",
                        maxWidth: "75%",
                      }}
                    > 
                      <div style={{display:'flex'}}>
                      <Text>
  {m.type === 'file' ? 
    <ImageMessage message={m}/>
    : m.text}
</Text>


                        <Time>{format(m.createdAt)}</Time>
                      </div>
                    </span>
                  </MessageContainer>
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
        setNewMessage={setNewMessage}
        file={file}
        setFile={setFile}
        image={image}
        setImage={setImage}
      />
      <ToastContainer position="top-center" />
    </Wrapper>
  );
}
