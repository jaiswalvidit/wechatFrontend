import React, { useState, useEffect, useContext } from 'react';
import { specificUser } from '../../services/api';
import { AccountContext } from '../../context/AccountProvider';
import { format } from '../chat/utils';
import { Box, Typography } from '@mui/material';

export default function GroupItem({ group, onClick }) {
  const [user, setUser] = useState(null);
  const { currentMessage, notification,userDetails } = useContext(AccountContext);
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
// console.log('current',group);
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

      {hasNotifications && (
        <span style={styles.notificationBadge}>
          {groupedNotifications[group._id]?.length}
        </span>
      )}

{groupedNotifications[group._id]?.length}
{groupedNotifications[group._id]?.length>0 ? (
        <>
          <Typography>
            {groupedNotifications[group._id][groupedNotifications[group._id]?.length - 1]?.senderId.name}
          </Typography>
          <Typography>
          {groupedNotifications[group._id][groupedNotifications[group._id]?.length - 1].senderId._id === userDetails._id ? "You" : groupedNotifications[group._id][groupedNotifications[group._id]?.length - 1].senderId.name}
            {groupedNotifications[group._id][groupedNotifications[group._id]?.length - 1]?.text} 
            {format(groupedNotifications[group._id][groupedNotifications[group._id]?.length - 1].createdAt)}
          </Typography>
        </>
      ) : (
        <>
        {/* {currentMessage.messageId} */}
          {currentMessage && currentMessage.messageId._id === group._id ? (
            <Box style={styles.messageContainer}>
              <Typography>{currentMessage.senderId._id === userDetails._id ? "You" : currentMessage.senderId.name}
-{currentMessage.text}</Typography>
              <Typography>{format(currentMessage.createdAt)}</Typography>
            </Box>
          ) : (
            group.messages ? (
              <Box style={styles.messageContainer}>
                <Typography>
                {group.messages.senderId === userDetails._id ? "You" : group.messages.senderId.name}
                  {group.messages.type === 'text' ? group.messages.text : 'Media'}
                </Typography>
                <Typography>{format(group.messages.createdAt)}</Typography>
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
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    marginBottom: '15px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    marginBottom: '10px',
    color: '#333',
  },
  infoContainer: {
    marginBottom: '10px',
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
  notificationBadge: {
    borderRadius: '5px',
    backgroundColor: '#e5e5e5',
    padding: '5px',
  },
  messageContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
};
