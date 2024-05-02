import React, { useState, useEffect, useContext } from 'react';
import { specificUser } from '../../services/api';
import { AccountContext } from '../../context/AccountProvider';
import { format } from '../chat/utils';
import { Badge, Box, Typography, styled } from '@mui/material';

const Sender = styled(Box)({
  fontSize: '24px',
  color: 'red'
});

export default function GroupItem({ group, onClick }) {
  const [user, setUser] = useState(null);
  const { currentMessage, notification, userDetails } = useContext(AccountContext);
  const [groupedNotifications, setGroupedNotifications] = useState({});
  const notificationCount = groupedNotifications[group._id]?.length || 0;
console.log(group.messages);
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
      <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography>{group.group}</Typography>

      {notificationCount > 0 && (
        <Badge badgeContent={notificationCount} color="secondary">
          <Typography>Notifications</Typography>
        </Badge>
      )}
    </Box>
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
        <Box style={{ display: 'flex', flexDirection: 'space-between' }}>
          <Typography>
            <Sender>
              {groupedNotifications[group._id][groupedNotifications[group._id]?.length - 1].senderId._id === userDetails._id ? "You" : groupedNotifications[group._id][groupedNotifications[group._id]?.length - 1].senderId.name}
            </Sender>-
            {groupedNotifications[group._id][groupedNotifications[group._id]?.length - 1]?.text}
          </Typography>
          {format(groupedNotifications[group._id][groupedNotifications[group._id]?.length - 1].createdAt)}
        </Box>
      ) : (
        <>
          {currentMessage && currentMessage.messageId._id === group._id ? (
           <Box style={{ display: 'flex',justifyContent:'space-between' }}>
              <Typography style={styles.message}>
                {currentMessage.senderId._id === userDetails._id ? "You" : currentMessage.senderId.name}
                -{currentMessage.text}
              </Typography>
              <Typography style={styles.message}>{format(currentMessage.createdAt)}</Typography>
            </Box>
          ) : (
            group.messages ? (
              <Box style={{ display: 'flex',justifyContent:'space-between' }}>
                
                  <Typography>
                    {group.messages.senderId=== userDetails._id ? "You" : "Other"}
                  -
                  {group.messages.type === 'text' ? group.messages.text : 'Media'}
                </Typography>
                <Typography style={styles.message}>{format(group.messages.createdAt)}</Typography>
              </Box>
            ) : null
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    cursor: 'pointer',
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    marginBottom: '15px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    borderLeft: '4px solid #007bff', // Highlighted border for active group
  },
  heading: {
    marginBottom: '10px',
    color: '#333',
    fontSize: '18px', // Increase font size for group name
    fontWeight: 'bold', // Bold font weight for group name
  },
  infoContainer: {
    marginBottom: '10px',
    color: '#666', // Adjust text color for group info
  },
  label: {
    fontWeight: 'bold',
    marginRight: '5px',
    color: '#444',
  },
  participant: {
    marginRight: '5px',
    color: '#007bff',
  },
  messageContainer: {
    display: 'flex',
    flexDirection: 'column', // Adjust message container layout
    marginTop: '10px', // Add space between group info and messages
  },
  message: {
    marginBottom: '5px', // Add space between messages
    color: '#333', // Adjust message text color
  },
};
