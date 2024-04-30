import React, { useContext, useEffect, useState } from "react";
import { Box, InputBase } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import SendIcon from "@mui/icons-material/Send";
import styled from "@emotion/styled";
import { uploadFile } from "../../../services/api";
import Lottie from 'react-lottie';
import animationData from "../animations/typing.json";
import Picker from 'emoji-picker-react';
import { AccountContext } from "../../../context/AccountProvider";

const Container = styled(Box)`
  display: flex;
  align-items: center;
  padding: 10px 10px;
  background: #f0f0f0;
  width: 80%;
  margin:auto;
  margin-top:2px;
  border-radius:20px;
  bottom: 0;
  left: 0;
  // height: auto;
  height: 10vh;
`;

const EmojiContainer = styled(Box)`
  position: absolute;
  align-self: flex-end; // Adjust for any vertical misalignment
  marginLeft:20px;
`;

const InputContainer = styled(Box)`
  border-radius: 18px;
  background-color: #ffffff;
  width: calc(100% - 100px); // Adjust width for better responsiveness
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border: 1px solid #ccc;
  margin: 0 10px; // Add some margin for spacing
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
  sendText, isTyping, setFile, file, newMessage, typingHandler, setImage, setNewMessage
}) {
  const { selectedChat } = useContext(AccountContext) ?? {};
  const [showPicker, setShowPicker] = useState(false);

  const onEmojiClick = (event, emojiObject) => {
    const emoji = event.emoji;
    setNewMessage(prevInput => prevInput + emoji);
    setShowPicker(false); 
  };

  const onFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile);
    setNewMessage(selectedFile?.name);
  };

  useEffect(() => {
    if (file) {
      const data = new FormData();
      data.append("name", file.name);
      data.append("file", file);
      const uploadImage = async () => {
        try {
          const response = await uploadFile(data);
          setImage(response);
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      };
      uploadImage();
    }
  }, [file, setImage]);

  return (
    <Container >
      <EmojiContainer>
        {showPicker && (
          <Picker 
            onEmojiClick={onEmojiClick}
            pickerStyle={{ position: 'absolute', bottom: '40px', right: '0' }}
          />
        )}
        
        <EmojiEmotionsOutlinedIcon 
          style={{ color: "#666", cursor: "pointer",marginBottom:'13px' }}
          onClick={() => setShowPicker(val => !val)}
        />
      </EmojiContainer>
      <label htmlFor="fileInput">
       
       
        <RotatedAttachIcon style={{ cursor: "pointer",marginLeft:'30px'}} />
      </label>
      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        onChange={onFileChange}
      />
      <InputContainer>
        {/* {isTyping && <Lottie options={{ loop: true, autoplay: true, animationData }} width={70} />} */}
        <InputField
          placeholder="Type a message"
          onChange={typingHandler}
          onKeyDown={sendText}
          value={newMessage}
        />
        <SendIcon
          style={{ color: "#00aaff", cursor: "pointer" }}
          onClick={() => sendText({ key: 'Enter' })}
        />
      </InputContainer>
      {selectedChat?.isGroup && <MicIcon style={{ color: "#666", margin: "0 10px" }} />}
    </Container>
  );
}
