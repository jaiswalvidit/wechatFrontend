import React from 'react';
import { emptyChatImage } from '../../../constants/data';
import { Box, Typography } from '@mui/material';
import styled from '@emotion/styled';

export default function EmptyChat() {
  const Component = styled(Box)({
    background: '#f8f9fa',
    padding: '30px 0px',
    textAlign: 'center',
    height: '100%',
  });

  const Container = styled(Box)({
    padding: '0px 200px',
  });

  const Image = styled('img')({
    width: '400px', // Added unit (px)
    marginTop: '100px', // Added unit (px)
  });

  return (
    <Component>
      <Container>
        <Image src={emptyChatImage} alt="No Messages" />
        <Typography variant="h5" color="text.secondary">
          Welcome to Your Chat App!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Select a chat to start messaging, or use the menu to create or join a group.
        </Typography>
      </Container>
    </Component>
  );
}
