import React, { useContext, useEffect, useState } from "react";
import MicIcon from "@mui/icons-material/Mic";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import { Box, InputBase } from "@mui/material";
import styled from "@emotion/styled";
import { uploadFile } from "../../../services/api";
import SendIcon from "@mui/icons-material/Send";
import Lottie from 'react-lottie';
import animationData from "../animations/typing.json";
import Picker from 'emoji-picker-react';
import { AccountContext } from "../../../context/AccountProvider";

const Container = styled(Box)`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background: #f0f0f0;
  width: 90%;
  // position: fixed;
  bottom: 0;
  left: 0;
`;

const InputContainer = styled(Box)`
  border-radius: 18px;
  background-color: #ffffff;
  width: calc(100% - 70px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  border: 1px solid #ccc;
`;

const InputField = styled(InputBase)`
  flex: 1;
  color: #333;
`;

const RotatedAttachIcon = styled(AttachFileIcon)`
  transform: rotate(45deg);
  color: #666;
`;

export default function Typing({
  sendText,
  isTyping,
  setFile,
  file,
  newMessage,
  typingHandler,
  setImage,
  setNewMessage
}) {
  const { selectedChat } = useContext(AccountContext) ?? {};
  const [showPicker, setShowPicker] = useState(false);

  const onEmojiClick = (event, emojiObject) => {
    const emoji = event?.emoji ?? '';
    setNewMessage(prevInput => prevInput + emoji);
    setShowPicker(false); 
  };

  const onFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile);
    setNewMessage(selectedFile?.name);
  };

  useEffect(() => {
    const getImage = async () => {
      if (file) {
        const data = new FormData();
        data.append("name", file.name);
        data.append("file", file);
        try {
          const response = await uploadFile(data);
          setImage(response.data);
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    };
    getImage();
  }, [file, setImage]);

  return (
    <><Container>
    <EmojiEmotionsOutlinedIcon 
      style={{ color: "#666", cursor: "pointer" }} 
      onClick={() => setShowPicker(val => !val)}
    />
    {showPicker && <Picker onEmojiClick={onEmojiClick} />}
    <label htmlFor="fileInput">
      <RotatedAttachIcon style={{ cursor: "pointer" }} />
    </label>
    <input
      type="file"
      id="fileInput"
      style={{ display: "none" }}
      onChange={onFileChange}
    />
    <InputContainer>
      {isTyping && <Lottie options={{ loop: true, autoplay: true, animationData }} width={70} />}
      <InputField
        placeholder="Type a message"
        onChange={typingHandler}
        onKeyDown={sendText}
        value={newMessage}
        type="text"
      />
      <SendIcon
        style={{ color: "#00aaff", cursor: "pointer" }}
        onClick={() => sendText({ key: 'Enter' })} 
      />
    </InputContainer>
    {selectedChat?.isGroup && <MicIcon style={{ color: "#666" }} />}
  </Container></>
    
  );
}
