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
    width: '400px', // Add unit (e.g., px) to the width
    marginTop: '100px', // Add unit (e.g., px) to the marginTop
  });

  return (
    <Component>
      <Container>
        <Image src={emptyChatImage} alt="Empty chat" />
        <Typography variant="h5">
          Whatsapp Web
        </Typography>
        <Typography variant="body1">
          Use WhatsApp Web to receive and send messages.
        </Typography>
      </Container>
    </Component>
  );
}
