import React, { useContext, useEffect, useState } from "react";
import { Box, InputBase, Fade } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import SendIcon from "@mui/icons-material/Send";
import styled from "@emotion/styled";
import Lottie from 'react-lottie';
import animationData from "../animations/typing.json";
import Picker from 'emoji-picker-react';
import { AccountContext } from "../../../context/AccountProvider";
import { uploadFile } from "../../../services/api";

const Container = styled(Box)`
  display: flex;
  align-items: center;
  padding: 10px 5px;
  background: #f0f0f0;
  width: 90%;
  margin:auto;
  margin-top:2px;
  border-radius:20px;
  bottom: 0;
  left: 0;
  height: 10vh;
`;

const EmojiContainer = styled(Box)`
  position: absolute;
  align-self: flex-end;
  margin-left: 1rem;
`;

const InputContainer = styled(Box)`
  border-radius: 18px;
  background-color: #ffffff;
  width: calc(100% - 150px);
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border: 1px solid #ccc;
  margin: 0 10px;
`;

const InputField = styled(InputBase)`
  flex: 1;
  color:grey; 
  font-weight: 700;
  font-size: 16px; /* Adjust font size as needed */
  font-family: 'Roboto', sans-serif; /* Specify your preferred font family */
  padding: 10px; /* Adjust padding to ensure comfortable input */
  border: none; /* Remove default border */
  outline: none; /* Remove default outline */
  &:focus {
    outline: 1px; /* Remove outline on focus */
  }
`;

const RotatedAttachIcon = styled(AttachFileIcon)`
  transform: rotate(45deg);
  color: #666;
  margin-left: 3rem;
`;

export default function Typing({
  sendText, isTyping, setFile, file, newMessage, typingHandler, setImage, setNewMessage
}) {
  const { selectedChat } = useContext(AccountContext) ?? {};
  const [showPicker, setShowPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
      const data = new FormData();
      data.append("name", file.name);
      data.append("file", file);
      const uploadImage = async () => {
        try {
          const response = await uploadFile(data);
          setImage(response);
          setIsLoading(false);
        } catch (error) {
          console.error("Error uploading file:", error);
          setIsLoading(false);
        }
      };
      uploadImage();
    }
  }, [file, setImage]);

  return (
    <Fade in={true} timeout={500}>
      <Container>
        <EmojiContainer>
          {showPicker && (
            <Picker 
              onEmojiClick={onEmojiClick}
              pickerStyle={{ position: 'absolute', bottom: '40px', right: '0',color:'yellow'  }}
            />
          )}
          
          <EmojiEmotionsOutlinedIcon 
            style={{ color: "yellow", cursor: "pointer", marginBottom: '13px' }}
            onClick={() => setShowPicker(val => !val)}
          />
        </EmojiContainer>
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
        {isLoading ? (
          <Lottie options={{ loop: true, autoplay: true, animationData: animationData }} width={40} />
        ) : (
          <></>
        )}
        {selectedChat?.isGroup && <MicIcon style={{ color: "#666", margin: "0 10px" }} />}
      </Container>
    </Fade>
  );
}
