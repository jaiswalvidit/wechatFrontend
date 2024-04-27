import { Box, Typography, Avatar, Button } from "@mui/material";
import React, { useContext } from "react";
import styled from "@emotion/styled";
import { AccountContext } from "../context/AccountProvider";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { userDetails } = useContext(AccountContext);
  const navigate = useNavigate(); // Hook for navigation

  const ImageContainer = styled(Box)({
    display: 'flex', 
    justifyContent: 'center',
    marginBottom: '20px', 
  });

  const BookWrapper = styled(Box)({
    background: '#f5f5f5', // Changed background color
    padding: '12px 20px', // Adjusted padding
    border: '1px solid #e0e0e0', // Added border
    borderRadius: '8px', // Added border radius
    fontSize: '16px', // Increased font size
    color: '#000000', // Changed text color
    fontWeight: 'bold', // Changed font weight
  });

  const Description = styled(Box)({
    padding: '0 20px', // Adjusted padding
    '& > p': {
      fontSize: '14px', // Adjusted font size
      color: '#616161', // Changed text color
    }
  });

  function handleEditProfile() {
    navigate('/picture'); // Adjust the path as needed
  }

  return (
    <>
      <ImageContainer>
        {userDetails?.picture && (
          <Avatar alt="Profile Picture" src={`data:image/svg+xml;base64,${userDetails?.picture}`} sx={{ width: 150, height: 150 }} />
        )}
      </ImageContainer>
      <BookWrapper>
        <Typography>Your Name: {userDetails?.name}</Typography>
      </BookWrapper>
      <Description>
        <Typography>This is not your username or password</Typography>
      </Description>
      <Box sx={{ padding: '0 20px', marginBottom: '20px' }}> {/* Adjusted padding and added margin bottom */}
        <Typography>About:</Typography>
        <Typography>When opportunity gives you a chance, take it.</Typography>
      </Box>
      <Button variant="contained" onClick={handleEditProfile} sx={{ margin: '0 20px' }}> {/* Adjusted margin */}
        Edit Profile
      </Button>
    </>
  );
}
