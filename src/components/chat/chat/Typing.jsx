import React, { useContext, useEffect} from "react";
import MicIcon from "@mui/icons-material/Mic";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import { Box, InputBase } from "@mui/material";
import styled from "@emotion/styled";
import { uploadFile } from "../../../services/api";
import SendIcon from "@mui/icons-material/Send";
import { AccountContext } from "../../../context/AccountProvider";
import Lottie from 'react-lottie'
import animationData from "../animations/typing.json"
const Container = styled(Box)`
  display: flex;
  align-items: center;
  padding: 0 15px;
  background: #f0f0f0; /* Changed background color */
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
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px; /* Added padding */
  border: 1px solid #ccc; /* Added border */
`;

const InputField = styled(InputBase)({
  marginLeft: "8px",
  flex: "1",
  color: "#333" /* Changed text color */,
  wordBreak: "break-all",
  overflow: "scroll",
  lineBreak: "auto",
});

const RotatedAttachIcon = styled(AttachFileIcon)({
  transform: "rotate(45deg)",
  color: "#666" /* Changed icon color */,
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
  // const [typing, setTyping] = useState(false);
  // const [socketConnected, setSocketConnected] = useState(false);
  const { selectedChat } = useContext(AccountContext) ?? {};

  const onFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    // console.log(selectedFile);
    setFile(selectedFile);
    setNewMessage(selectedFile?.name); // Clear input if no file selected
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


  console.log('typing is done',isTyping);

  const isGroupChat = !selectedChat?.members;
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <Container>
      <EmojiEmotionsOutlinedIcon style={{ color: "#666" }} />{" "}
      {/* Changed icon color */}
      <label htmlFor="fileInput">
        <RotatedAttachIcon />
      </label>
      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        onChange={(e) => onFileChange(e)}
      />
      <InputContainer>
      {isTyping ? <>
      <Lottie
      options={defaultOptions}
      width={70}
      style={{marginLeft:0 ,marginBotton:15}}
      
     
      
      /> </> : <></>}

        <InputField
          placeholder="Type a message"
          onChange={(e) => typingHandler(e)}
          onKeyDown={(e) => sendText(e)}
          value={newMessage}
          type="text"
        />
        <SendIcon
          style={{
            color: "#00aaff",
            cursor: "pointer",
          }} /* Changed icon color */
          onClick={(e) => {
            sendText(e);
            console.log("Send Button Clicked");
          }}
        />
      </InputContainer>
      {isGroupChat && <MicIcon style={{ color: "#666" }} />}{" "}
    </Container>
  );
}
