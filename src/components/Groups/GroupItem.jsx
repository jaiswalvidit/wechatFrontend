import React, { useState, useEffect, useContext } from 'react';
import { specificUser } from '../../services/api';
import { AccountContext } from '../../context/AccountProvider';
import { format } from '../chat/utils';
import { Badge, Box, Typography, styled } from '@mui/material';

const Sender = styled(Typography)({
  fontSize: '24px',
  color: 'red'
});

const GroupContainer = styled(Box)({
  cursor: 'pointer',
  padding: '15px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  marginBottom: '15px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  borderLeft: '4px solid #007bff',
});

const Heading = styled(Typography)({
  marginBottom: '10px',
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
});

const InfoContainer = styled(Box)({
  marginBottom: '10px',
  color: '#666',
});

const Label = styled.span({
  fontWeight: 'bold',
  marginRight: '5px',
  color: '#444',
});

const Participant = styled.span({
  marginRight: '5px',
  color: '#007bff',
});

const MessageContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  marginTop: '10px',
});

const Message = styled(Typography)({
  marginBottom: '5px',
  color: '#333',
});

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

  const notificationCount = groupedNotifications[group._id]?.length || 0;
  const hasNotifications = notificationCount > 0;

  return (
    <GroupContainer onClick={onClick}>
      <Heading>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>{group.group}</Typography>
          {hasNotifications && (
            <Badge badgeContent={notificationCount} color="secondary">
              <Typography>Notifications</Typography>
            </Badge>
          )}
        </Box>
      </Heading>
      <InfoContainer>
        <Typography>
          <Label>Admin:</Label> {group.admin.name}
        </Typography>
        <Typography>
          <Label>Members:</Label>
          {group.users.map((participant, index) => (
            <Participant key={index}>{participant.name}{index !== group.users.length - 1 ? ', ' : ''}</Participant>
          ))}
        </Typography>
      </InfoContainer>
      {hasNotifications ? (
        <MessageContainer>
          <Typography>
            <Sender>
              {groupedNotifications[group._id][groupedNotifications[group._id]?.length - 1].senderId._id === userDetails._id ? "You" : groupedNotifications[group._id][groupedNotifications[group._id]?.length - 1].senderId.name}
            </Sender>-
            {groupedNotifications[group._id][groupedNotifications[group._id]?.length - 1]?.text}
          </Typography>
          {format(groupedNotifications[group._id][groupedNotifications[group._id]?.length - 1].createdAt)}
        </MessageContainer>
      ) : (
        <>
          {currentMessage && currentMessage.messageId._id === group._id ? (
            <MessageContainer>
              <Typography>
                {currentMessage.senderId._id === userDetails._id ? "You" : currentMessage.senderId.name}
                -{currentMessage.text}
              </Typography>
              {format(currentMessage.createdAt)}
            </MessageContainer>
          ) : (
            group.messages ? (
              <MessageContainer>
                <Typography>
                  {group.messages.senderId === userDetails._id ? "You" : "Other"}
                  -{group.messages.type === 'text' ? group.messages.text : 'Media'}
                </Typography>
                {format(group.messages.createdAt)}
              </MessageContainer>
            ) : null
          )}
        </>
      )}
    </GroupContainer>
  );
}
