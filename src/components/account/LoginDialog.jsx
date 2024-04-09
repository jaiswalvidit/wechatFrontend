import React from "react";
import { Dialog, Box, Typography, List, ListItem, styled } from "@mui/material";
import { qrCodeImage } from "../../constants/data";
// import { jwtDecode } from "jwt-decode";
// import { addUser } from "../../services/api";
// import ChatDialog from "../chat/ChatDialog";
import { Link } from "react-router-dom";
const dialogStyle = {
  height: "96%",
  marginTop: "12%",
  width: "60%",
  maxWidth: "100%",
  maxHeight: "100%",
  boxShadow: "none",
  overflow: "hidden",
};

const Component = styled(Box)({
  display: "flex",
});

const Title = styled(Typography)({
  fontSize: "20px",
  color: "#525252",
  fontWeight: "300",
  fontFamily: "inherit",
  marginBottom: "25px",
});

const Container = styled(Box)({
  padding: "56px 0px 56px 56px",
});

const Qr = styled("img")({
  height: "264px",
  width: "264px",
  margin: "50px 0 0 50px",
});

export default function LoginDialog() {
  // const onLoginError = (e) => {
  //   console.log(e);
  //   // Handle login error
  // };

  // const onLoginSuccess = async (res) => {
  //   const decodedString = jwtDecode(res.credentials);
  //   console.log(decodedString);
  //   await addUser(decodedString);
  //   // Save the token and user info to local
  // };

  return (
    <Dialog open={true} PaperProps={{ sx: dialogStyle }} hideBackdrop={true}>
      <Component>
        <Container>
          <Title>To use WhatsApp on your computer</Title>
          <List>
            <ListItem>1. Open WhatsApp Web in a browser</ListItem>
            <ListItem>2. Tap Menu on Android, or Settings on iPhone</ListItem>
            <ListItem>3. Tap Linked devices and then link a device</ListItem>
          </List>
        </Container>
        <Link to="/auth/login"> {/* Add Link component */}
          <Box style={{ position: "relative" }}>
            <Qr src={qrCodeImage} alt="qr code" />
          </Box>
        </Link>
      </Component>
    </Dialog>
  );
}
