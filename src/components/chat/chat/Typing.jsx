import React, { useContext, useEffect, useState } from "react";
import MicIcon from "@mui/icons-material/Mic";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import { Box, InputBase } from "@mui/material";
import styled from "@emotion/styled";
import { uploadFile } from "../../../services/api";
import SendIcon from "@mui/icons-material/Send";
import { AccountContext } from "../../../context/AccountProvider";
import Lottie from 'react-lottie';
import animationData from "../animations/typing.json";
import Picker from 'emoji-picker-react';

const Container = styled(Box)`
  display: flex;
  align-items: center;
  padding: 0 15px;
  background: #f0f0f0;
  width: 100%;
  height: 10vh;
  & > * {
    margin: 5px;
    color: #919191;
  }
`;

const InputContainer = styled(Box)`
  border-radius: 18px;
  background-color: #ffffff;
  width: calc(94% - 100px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  border: 1px solid #ccc;
`;

const InputField = styled(InputBase)({
  marginLeft: "8px",
  flex: "1",
  color: "#333",
  wordBreak: "break-all",
  overflow: "scroll",
  lineBreak: "auto",
});

const RotatedAttachIcon = styled(AttachFileIcon)({
  transform: "rotate(45deg)",
  color: "#666",
});

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
    setNewMessage(prevInput => prevInput + emojiObject.emoji);
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
    <Container>
      <EmojiEmotionsOutlinedIcon style={{ color: "#666" }} onClick={() => setShowPicker(val => !val)} />
      <label htmlFor="fileInput">
        <RotatedAttachIcon />
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
          onClick={sendText}
        />
        {showPicker && <Picker onEmojiClick={onEmojiClick} />}
      </InputContainer>
      {selectedChat?.isGroup && <MicIcon style={{ color: "#666" }} />}
    </Container>
  );
}
