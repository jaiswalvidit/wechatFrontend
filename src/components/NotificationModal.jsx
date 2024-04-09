import React, { useContext } from 'react';
import { Box, Modal, Typography, List, Card, CardContent, Button, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AccountContext } from '../context/AccountProvider';
import { getGroupsById } from '../services/api';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  color: '#1a237e', // Changed color to a shade of blue
  bgcolor: '#eceff1', // Changed background color to a light gray
  boxShadow: 24,
  p: 4,
  overflowY: 'auto', // Enable scrolling for the modal content
  maxHeight: '80vh', // Set max height to prevent modal from being too tall
};

const groupNotificationsByMessageId = (notifications) => {
  return notifications.reduce((acc, notification) => {
    const groupId = notification.messageId._id;
    if (!acc[groupId]) {
      acc[groupId] = [];
    }
    acc[groupId].push(notification);
    return acc;
  }, {});
};

// Styled component for scrolling within the List
const ScrollableList = styled(List)({
  maxHeight: '300px',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '0.4em',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,.1)',
    borderRadius: '4px',
  },
});

const NotificationModal = ({ open, handleClose }) => {
  const { notification, setNotification, setSelectedChat } = useContext(AccountContext);
  const navigate = useNavigate();

  const groupedNotifications = groupNotificationsByMessageId(notification);

  const handleNotificationClick = async (groupId) => {
    try {
      const response = await getGroupsById(groupId._id);
      if (response) {
        setSelectedChat(response.data.groups);
        // Filter out the notifications related to the clicked group
        setNotification((prev) => prev.filter((n) => n.messageId._id !== groupId._id));
        // Close the modal after handling the notification
        handleClose();
      } else {
        throw new Error('Failed to fetch group data');
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography variant="h6" component="h2" textAlign="center" mb={2} color="primary" textTransform="capitalize">
          Notifications
        </Typography>
        <ScrollableList sx={{ pt: 2 }}>
          {Object.keys(groupedNotifications).length > 0 ? (
            Object.entries(groupedNotifications).map(([groupId, items]) => (
              <Card key={groupId} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" textAlign="center">
                    {items[0].messageId.isGroupChat ? 
                      `Group: ${items[0].messageId.group} (${items.length} ${items.length > 1 ? 'notifications' : 'notification'})` : 
                      `From: ${items[0].senderId.name} (${items.length} ${items.length > 1 ? 'notifications' : 'notification'})`}
                  </Typography>
                  {items.map((item) => (
                    <Typography key={item._id} textAlign="center">
                      {item.text} {item.messageId.isGroupChat ? `-: ${item.senderId.name}` : ''}
                    </Typography>
                  ))}
                  <Box textAlign="center" mt={2}>
                    <Button variant="outlined" onClick={() => handleNotificationClick(items[0].messageId)} color="primary">
                      Visit
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body2" textAlign="center">No new messages</Typography>
          )}
        </ScrollableList>
      </Box>
    </Modal>
  );
};

export default NotificationModal;
