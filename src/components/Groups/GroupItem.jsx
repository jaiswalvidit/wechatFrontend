import React, { useState, useEffect, useContext } from 'react';
import { specificUser } from '../../services/api';
import { AccountContext } from '../../context/AccountProvider';
import { format } from '../chat/utils';
import { Box, Typography } from '@mui/material';

export default function GroupItem({ group, onClick }) {
  const [user, setUser] = useState(null);
  const { currentMessage } = useContext(AccountContext);
console.log(currentMessage,'lll');
  useEffect(() => {
    const fetchUser = async () => {
      if (!group.messages) return;  // Return early if no messages are defined
      try {
        const userDetails = await specificUser(group.messages.senderId);
        setUser(userDetails);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUser();
  }, [group.messages]);

  return (
    <div onClick={onClick} style={styles.container}> {/* Direct use of onClick */}
      <h3 style={styles.heading}>{group.group}</h3>
      <div style={styles.infoContainer}>
        <div>
          <span style={styles.label}>Admin:</span> {group.admin.name}
        </div>
        <div>
          <span style={styles.label}>Members:</span>{' '}
          {group.users.map((participant, index) => (
            <span key={index} style={styles.participant}>
              {participant.name}{index !== group.users.length - 1 && ', '}
            </span>
          ))}
        </div>
      </div>
       {/* Rendering logic for messages */}
       {currentMessage !== undefined && currentMessage.messageId !== undefined && currentMessage.messageId._id === group._id ? (
            // Render text from currentMessage if it exists and its messageId matches user._id
            <>
            {currentMessage.text} {format(currentMessage.createdAt)}
          </>
          ) :(
            // Check if user.messages exists before trying to render it
            group && group.messages ? (
              <Box style={{ display: 'flex', justifyContent: "space-between" }}>
                {/* Display the message text if it is of type 'text', otherwise display 'media' */}
                {group.messages.type === 'text' ? <>{group.messages.text}</> : 'media'}
                {/* Format and display the creation date of the message */}
                <span>{format(group.messages.createdAt)}</span>
              </Box>
            ): (
              // If user.messages doesn't exist or currentMessage doesn't match, render nothing
              <></>
            )
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
    fontSize: '1.5rem',
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
  messageContainer: {
    borderLeft: '2px solid #007bff',
    paddingLeft: '10px',
  },
};
