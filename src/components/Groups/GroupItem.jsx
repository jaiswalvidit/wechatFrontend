import React, { useState, useEffect, useContext } from 'react';
import { specificUser } from '../../services/api';
import { AccountContext } from '../../context/AccountProvider';
import { format } from '../chat/utils';
import { Box, Typography } from '@mui/material';

export default function GroupItem({ group, onClick }) {
  const handleGroupClick = () => {
    onClick(); // Call the onClick handler passed from the parent component
  };

  const [user, setUser] = useState(null);
  const {currentMessage,setCurrentMessage}=useContext(AccountContext);

  useEffect(() => {
    const fetchUser = async (senderId) => {
      try {
        const userDetails = await specificUser(senderId);
        setUser(userDetails);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    if (group.messages) {
      fetchUser(group.messages.senderId);
    }
  }, [group.messages]);

  return (
    <div onClick={handleGroupClick} style={styles.container}>
      <h3 style={styles.heading}>{group.group}</h3>
      <div style={styles.infoContainer}>
        <div>
          <span style={styles.label}>Admin:</span> {group.admin.name}
        </div>
        <div>
          <span style={styles.label}>Members:</span>{' '}
          {group.users.map((participant, index) => (
            <span key={index} style={styles.participant}>
              {participant.name}
              {index !== group.users.length - 1 && ', '}
            </span>
          ))}
        </div>
      </div>
      {user && (
        <div style={styles.messageContainer}>
             {currentMessage !== undefined && currentMessage.messageId !== undefined && currentMessage.messageId._id === group._id ? (
            // Render text from currentMessage if it exists and its messageId matches user._id
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1">
              <strong>{currentMessage.senderId.name}:</strong> {currentMessage.text}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {format(currentMessage.createdAt)}
            </Typography>
          </Box>
          ) : (
            // Otherwise, render text from user.messages if it exists
            user.messages ? (
              <>
                {user.messages.text} {format(user.messages.createdAt)}
              </>
            ) : (
              // If user.messages doesn't exist or currentMessage doesn't match, render nothing
              <></>
            )
          )}
         
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    cursor: 'pointer',
    padding: '10px',
    backgroundColor: '#f0f0f0', // Light gray background
    borderRadius: '8px',
    marginBottom: '15px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Shadow for depth
  },
  heading: {
    fontSize: '1.5rem',
    marginBottom: '10px',
    color: '#333', // Dark gray text color
  },
  infoContainer: {
    marginBottom: '10px',
  },
  info: {
    fontSize: '1rem',
    color: '#666', // Medium gray text color
  },
  label: {
    fontWeight: 'bold',
    marginRight: '5px',
    color: '#444', // Darker gray for labels
  },
  participant: {
    marginRight: '5px',
    color: '#007bff', // Blue color for participant names
  },
  messageContainer: {
    borderLeft: '2px solid #007bff', // Left border for message container
    paddingLeft: '10px', // Add padding for the message content
  },
};
