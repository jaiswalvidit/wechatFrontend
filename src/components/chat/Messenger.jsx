import React, { useEffect } from "react";
import LoginDialog from "../account/LoginDialog";
import { AppBar, Toolbar, styled } from "@mui/material";
import Box from "@mui/material/Box";
import ChatDialog from "./ChatDialog";
import { useContext } from "react";
import { AccountContext } from "../../context/AccountProvider";
import Login from "../Login";

// Define custom styles for AppBar
const LoginHeader = styled(AppBar)({
  height: "200px",
  backgroundColor: "#00bfa5",
  boxShadow: "none",
});

const Header = styled(AppBar)({
  height: "125px",
  backgroundColor: "#00A884",
  boxShadow: "none",
});

const ComponentContainer = styled(Box)({
  height: "100vh",
  backgroundColor: "#DCDCDC",
  overflow: "scroll",
});

export default function Messenger() {
  const {userDetails}=useContext(AccountContext);
  // console.log(userDetails);W

  useEffect(() => {
    // Retrieve user details from localStorage
    
  }, []);

  return (
    <ComponentContainer>
      {/* console.log(userDetails); */}
      {userDetails ? (
        <>
          
          <ChatDialog />
        </>
      ) : (
        <>
         <Login/>
          {/* <LoginDialog /> */}
        </>
      )}
    </ComponentContainer>
  );
}
