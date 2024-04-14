import styled from "@emotion/styled";
import { Box, Typography } from "@mui/material";
import React, { useContext } from "react";
import { format } from "../utils";
import { AccountContext } from "../../../context/AccountProvider";
import { download } from "../utils"; // Corrected import path
import { iconPDF } from "../../../constants/data";
import { Avatar } from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";

const Own = styled(Box)({
  position: "relative",
  background: "#4caf50", // Green background for own messages
  maxWidth: "70%", // Adjust as necessary
  marginLeft: "auto",
  marginRight: "10px",
  padding: "10px",
  width: "fit-content",
  display: "flex",
  color: "white", // White text color for own messages
  borderRadius: "10px", // Rounded corners
  wordBreak: "break-word",
  marginTop: "10px",

  // Positioning the arrow
  "::before": {
    content: "''",
    // zIndex: 3,
    position: "absolute",
    top: "50%",
    right: "-10px", // Adjust to position the arrow correctly
    transform: "translateY(-50%)",
    borderTop: "10px solid transparent",
    borderBottom: "10px solid transparent",
    borderLeft: "10px solid #4caf50",
  },
});
// console.log(message);
const Wrapper = styled(Box)({
  position: "relative",
  background: "#f44336", // Red background for other user's messages
  maxWidth: "50%", // Adjust as necessary
  padding: "10px",
  // marginLeft: "10px",
  width: "fit-content",
  display: "flex",
  borderRadius: "10px", // Rounded corners
  color: "white", // White text color for other user's messages
  wordBreak: "break-word",
  marginTop: "10px",

  // Positioning the arrow
  "::before": {
    content: "''",
    // zIndex: 3,
    position: "absolute",
    top: "50%",
    left: "-10px", // Adjust to position the arrow correctly
    transform: "translateY(-50%)",
    borderTop: "10px solid transparent",
    borderBottom: "10px solid transparent",
    borderRight: "10px solid #f44336", // Match background colo
  },
});

const Text = styled(Typography)({
  fontSize: "14px",
  padding: "0px 10px", // Adjust padding as necessary
});

const Time = styled(Typography)({
  fontSize: "10px",
  color: "#fff", // White text color for timestamp
  marginTop: "5px", // Adjust spacing between text and timestamp
  wordBreak: "keep-all",
});

export default function Message({ message }) {
  const { userDetails } = useContext(AccountContext);
  const isOwnMessage = userDetails._id === message.senderId._id;
  const isFileMessage = message.type === "file";
  console.log("your message", message.senderId.name);


  const Title=styled(Typography)({
    color:'orange',
    fontSize:'0.8rem',
    fontFamily:'TimesNewRoman',
    fontStyle:'inherit'
  })
  return (
    <>
      {/* {message.senderId.picture} */}
      {isOwnMessage ? (
        <Box style={{ display: "flex" }}>
          <Own>
            {/* {renderMessageContent()} */}
            {isFileMessage ? (
              <Imagemessage message={message} />
            ) : (
              <>
                <Text>{message.text}</Text>
                <Time>{format(message.createdAt)}</Time>
              </>
            )}
          </Own>
          {/* <div style={{align:'right'}}> */}
          <Box style={{ display: "flex", flexDirection: "column", marginRight: "8px" }}>
          <Avatar
           src={`data:image/svg+xml;base64,${userDetails.picture}`}
            sx={{ width: 24, height: 24, marginRight: "8px" }}
          />
          <Title>{"You"}</Title>
          </Box>
        </Box>
      ) : (
        // </>
        <>
         <Box style={{ display: "flex", alignItems: "center" }}>
  <Box style={{ display: "flex", flexDirection: "column", marginRight: "8px" }}>
    <Avatar
     src={`data:image/svg+xml;base64,${message.senderId.picture}`}
      // src={message.senderId.picture}
      sx={{ width: 24, height: 24 }}
    />
    <Title>{message.senderId.name}</Title> {/* Display name below the image */}
  </Box>

  <Wrapper>
    {isFileMessage ? (
      <Imagemessage message={message} />
    ) : (
      <>
        
          <Text>{message.text}</Text>
          <Time>{format(message.createdAt)}</Time>
       
      </>
    )}
  </Wrapper>
</Box>

        </>
      )}
    </>
  );
}

const Imagemessage = ({ message }) => {
  return (
    <div style={{ position: "relative" }}>
      {message?.text?.includes(".pdf") ? (
        <div style={{ display: "flex" }}>
          <img src={iconPDF} alt="pdf-icon" style={{ width: 80 }} />
          <Typography style={{ fontSize: 14 }}>
            {message.text.split("/").pop()}
          </Typography>
        </div>
      ) : (
        <img
          style={{ width: 300, height: "100%", objectFit: "cover" }}
          src={message.text}
          alt={message.text}
        />
      )}
      <Time style={{ position: "absolute", bottom: 0, right: 0 }}>
        <DownloadIcon
          onClick={(e) => download(e, message.text)}
          fontSize="small"
          style={{
            marginRight: 10,
            border: "1px solid grey",
            borderRadius: "50%",
          }}
        />
        {format(message.createdAt)}
      </Time>
    </div>
  );
};
