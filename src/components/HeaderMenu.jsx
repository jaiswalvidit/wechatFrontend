import React, { useState } from "react";
import styled from "@mui/system/styled";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";

// Define a styled icon using the styled function from MUI
const StyledMoreVertIcon = styled(MoreVertIcon)`
  cursor: pointer;

  &:hover,
  &:active {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 50%;
  }
`;

export default function HeaderMenu({ setOpenDrawer }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
        <MenuItem
          onClick={() => {
            handleClose();
            setOpenDrawer(true);
          }}
        >
          Profile
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            handleClose();
            navigate("/auth/login");
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
