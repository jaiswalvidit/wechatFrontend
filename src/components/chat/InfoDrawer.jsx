import styled from "@emotion/styled";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Drawer, Typography } from "@mui/material";
import React from "react";
import Profile from "../Profile";

// Define drawer style outside the component
const drawerStyle = {
  left: "20px",
  top: "17px",
  height: "95%",
  width: "30%",
  boxShadow: "none",
  //   zIndex: 1500, // Define zIndex directly
};

export default function InfoDrawer({ open, setOpen }) {
  const handleClose = () => {
    setOpen(false);
  };

  const Header = styled(Box)({
    background: "#008069",
    height: "107px",
    color: "#FFFFFF",
    display: "flex",
    "& > svg, & > p": {
      marginTop: "auto",
      padding: "15px",
      fontWeight: "600",
    },
  });

  const Component = styled(Box)({
    background: "#ededed",
    height: "85%",
  });

  return (
    <>
      <Drawer
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: drawerStyle }}
        style={{ zIndex: 1500 }}
      >
        <Header>
          <ArrowBackIcon onClick={handleClose} /> {/* Corrected the onClick handler */}
          <Typography>Profile </Typography>
         

        </Header>
        <Component>
          <Profile  />
        </Component>
      </Drawer>
    </>
  );
}
