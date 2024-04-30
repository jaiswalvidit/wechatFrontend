import React, { useContext, useEffect, useState, useCallback } from "react";
import styled from "@emotion/styled";
import { Box, Typography, Tooltip, Avatar } from "@mui/material";
import { AccountContext } from "../../../context/AccountProvider";
import { deleteMessage, getMessage, newMessages, uploadFile } from "../../../services/api";
import Lottie from "react-lottie";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";

import Typing from "./Typing";
import ImageMessage from "./ImageMessage";
import MessageContainer from "./MessageContainer";
import { format } from "../utils";
import animationData from "../animations/typing.json";

const Wrapper = styled(Box)`
  background-size: 80%;
  object-fit: contain;
  height: 82vh;
  display: flex;
  flex-direction: column;
`;

const ConversationContainer = styled(Box)`
  flex: 1;
  overflow-y: auto;
  padding: 0px 1rem;
`;

export default function Messages() {
  const { userDetails, selectedChat, setActiveUsers, notification, setNotification, setCurrentMessage, setIncomingCall } = useContext(AccountContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const ENDPOINT = "https://wechatbackend-qlpp.onrender.com/";
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  
  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [ENDPOINT]);

  // Manage socket events
  useEffect(() => {
    if (!socket) return;

    const handleNewMessageReceived = newMessageReceived => {
      if (selectedChat?._id === newMessageReceived?.messageId?._id) {
        setMessages(prevMessages => [...prevMessages, newMessageReceived]);
      } else {
        toast.success(`New message in ${newMessageReceived?.messageId?.group}`);
        setNotification(prev => [newMessageReceived, ...prev]);
      }
    };

    socket.on("connect", () => socket.emit("setup", userDetails));
    socket.on("message received", handleNewMessageReceived);

    return () => {
      socket.off("connect");
      socket.off("message received", handleNewMessageReceived);
    };
  }, [socket, userDetails, selectedChat, notification, setNotification]);

  // Fetch messages for the selected chat
  useEffect(() => {
    if (!selectedChat) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getMessage(selectedChat._id);
        setMessages(data.message);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedChat]);

  // Scroll to the last message when messages update
  useEffect(() => {
    const conversationContainer = document.getElementById("conversation-container");
    if (conversationContainer) {
      conversationContainer.scrollTop = conversationContainer.scrollHeight;
    }
  }, [messages]);

  // Message sending handler
  const handleSendMessage = useCallback(async (messageContent, isFile = false) => {
    if (!messageContent) return;
    const messageData = {
      senderId: userDetails._id,
      messageId: selectedChat._id,
      type: isFile ? "file" : "text",
      text: messageContent,
      createdAt: Date.now(),
    };

    try {
      const sentMessage = await newMessages(messageData);
      setCurrentMessage(sentMessage);
      setMessages(prev => [...prev, sentMessage]);
      socket.emit("new message", sentMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [userDetails, selectedChat, setCurrentMessage, socket]);

  return (
    <Wrapper>
      <ConversationContainer id="conversation-container">
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <Box sx={{ overflowY: "auto" }}>
            {messages.map((message, index) => (
              <MessageContainer key={message._id} message={message} index={index} messages={messages} userDetails={userDetails} format={format} />
            ))}
          </Box>
        )}
        {isTyping && <Lottie options={{ loop: true, autoplay: true, animationData: animationData }} width={70} />}
      </ConversationContainer>
      <Typing onSendMessage={handleSendMessage} />
      <ToastContainer position="top-center" />
    </Wrapper>
  );
}
