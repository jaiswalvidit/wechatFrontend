import { Box, Typography, Avatar } from "@mui/material";
import React, { useContext } from "react";
import styled from "@emotion/styled";
import { AccountContext } from "../context/AccountProvider";

export default function Profile() {
  const { userDetails } = useContext(AccountContext);

  const ImageContainer = styled(Box)({
    display: 'flex', 
    justifyContent: 'center',
  });

  const BookWrapper = styled(Box)({
    background: '#FFFFFF',
    padding: '12px 30px 2px',
    boxShadow: '0px 1px 3px rgba(0,0,0,0.08)',
    fontSize: '13px',
    color: '#009688',
    fontWeight: '600',
  });

  const Description = styled(Box)({
    padding: '15px 20px 20px 30px',
    '& > p': {
      fontSize: '13px',
      color: '#8686ab',
    }
  });


  return (
    <>
      <ImageContainer>
        {userDetails?.picture && (
          <Avatar alt="Profile Picture" src={userDetails.picture} sx={{ width: 200, height: 200 }} />
        )}
      </ImageContainer>
      <BookWrapper>
        <Typography>Your Name: {userDetails?.name}</Typography>
      </BookWrapper>
      <Description>
        <Typography>This is not your username or password</Typography>
      </Description>
      <Box>
        <Typography>About:</Typography>
        <Typography>When opportunity gives you a chance, take it.</Typography>
      </Box>
    </>
  );
}