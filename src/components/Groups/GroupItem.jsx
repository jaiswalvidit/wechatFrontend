import React, { useState, useEffect, useContext } from 'react';
import { specificUser } from '../../services/api';
import { AccountContext } from '../../context/AccountProvider';
import { format } from '../chat/utils';
import { Box, Typography, styled } from '@mui/material';
import { NotificationImportant } from '@mui/icons-material';

const StyledNotificationBadge = styled(NotificationImportant)`
  border-radius: 50%; /* Make badge circular */
  background-color: #007bff; /* Change badge background color */
  color: red; /* Change badge text color */
  padding: 5px; /* Increase padding for badge */
  font-size: 20px; /* Decrease font size for badge text */
  margin-left: 5px; /* Add space between badge and group info */
`;

const MessageContainer = styled(Box)`
  display: flex;
`;

const MessageText = styled(Typography)`
  margin-right: 10px;
`;

export default function GroupItem({ group, onClick }) {
  const [user, setUser] = useState(null);
  const { currentMessage, notification, userDetails } = useContext(AccountContext);
  const [groupedNotifications, setGroupedNotifications] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      if (!group.messages) return;
      try {
        const userDetails = await specificUser(group.messages.senderId);
        setUser(userDetails);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUser();
  }, [group.messages]);

  useEffect(() => {
    const groupNotificationsByMessageId = notifications => {
      return notifications.reduce((acc, notification) => {
        const groupId = notification.messageId?._id;
        acc[groupId] = acc[groupId] || [];
        acc[groupId].push(notification);
        return acc;
      }, {});
    };
    const groupedNotifs = groupNotificationsByMessageId(notification);
    setGroupedNotifications(groupedNotifs);
  }, [notification]);

  const hasNotifications = groupedNotifications[group._id]?.length > 0;

  return (
    <div onClick={onClick} style={styles.container}>
      <Typography variant="h5" style={styles.heading}>
        {group.group}
        {hasNotifications && (
          <StyledNotificationBadge>
            {groupedNotifications[group._id]?.length}
          </StyledNotificationBadge>
        )}
      </Typography>
      <Box style={styles.infoContainer}>
        <Typography>
          <span style={styles.label}>Admin:</span> {group.admin.name}
        </Typography>
        <Typography>
          <span style={styles.label}>Members:</span>
          {group.users.map((participant, index) => (
            <span key={index} style={styles.participant}>
              {participant.name}
              {index !== group.users.length - 1 ? ', ' : ''}
            </span>
          ))}
        </Typography>
      </Box>

      {groupedNotifications[group._id]?.length > 0 ? (
        <MessageContainer>
          <MessageText>
            {groupedNotifications[group._id][groupedNotifications[group._id]?.length - 1].senderId._id === userDetails._id ? "You" : groupedNotifications[group._id][groupedNotifications[group._id]?.length - 1].senderId.name}-
            {groupedNotifications[group._id][groupedNotifications[group._id]?.length - 1]?.text} 
          </MessageText>
          <Typography>{format(groupedNotifications[group._id][groupedNotifications[group._id]?.length - 1].createdAt)}</Typography>
        </MessageContainer>
      ) : (
        <>
          {currentMessage && currentMessage.messageId._id === group._id ? (
            <MessageContainer>
              <MessageText>
                {currentMessage.senderId._id === userDetails._id ? "You" : currentMessage.senderId.name}-
                {currentMessage.text}
              </MessageText>
              <Typography>{format(currentMessage.createdAt)}</Typography>
            </MessageContainer>
          ) : (
            group.messages ? (
              <MessageContainer>
                <MessageText>
                  {group.messages.senderId === userDetails._id ? "You" : group.messages.senderId.name}
                  {group.messages.type === 'text' ? group.messages.text : 'Media'}
                </MessageText>
                <Typography>{format(group.messages.createdAt)}</Typography>
              </MessageContainer>
            ) : null
          )}
        </>
      )}
    </div>
  );
}
