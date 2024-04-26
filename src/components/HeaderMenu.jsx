import React, { useState, useContext } from "react";
import styled from "@mui/system/styled";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AccountContext } from "../context/AccountProvider";

// Define a styled icon using the styled function from MUI
const StyledMoreVertIcon = styled(MoreVertIcon)`
  cursor: pointer;

  &:hover,
  &:active {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 50%;
  }
`;

// Define a styled MenuItem that is responsive
const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%', // Full width on screens smaller than 'sm' (600px)
  }
}));


export default function HeaderMenu({ setOpenDrawer }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const { socket, userDetails, setActiveUsers } = useContext(AccountContext);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    socket.emit("logout", userDetails._id, (newActiveUsers) => {
      setActiveUsers(newActiveUsers);
      console.log(newActiveUsers);
    });
    handleClose();
    navigate("/auth/login");
  };

  return (
    <>
      {/* Use the styled MoreVertIcon */}
      <StyledMoreVertIcon onClick={handleClick} />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <StyledMenuItem
          onClick={() => {
            handleClose();
            setOpenDrawer(true);
          }}
          sx={{ width: isSmallDevice ? '100%' : 'auto' }} // Ensure it takes full width only on small devices
        >
          Profile
        </StyledMenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
}
