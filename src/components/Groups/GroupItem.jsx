import React from 'react';
// import { AccountContext } from '../../context/AccountProvider';

export default function GroupItem({ group, onClick }) {
  // const {socket}=useContext(AccountContext);
    const handleGroupClick = () => {
      // Emit an event to join the room corresponding to the clicked group
    
      onClick(); // Call the onClick handler passed from the parent component
    };

  return (
    <div onClick={handleGroupClick} style={styles.container}>
      <h3 style={styles.heading}>{group.group}</h3>
      {/* <p>{group.description || 'No description available'}</p> */}
      <p style={styles.info}>
        <span style={styles.label}>Admin:</span> {group.admin.name}
        <br />
        <span style={styles.label}>Members:</span>
        {group.users.map((participant, index) => (
          <span key={index} style={styles.participant}>
            {participant.name}
            {index !== group.users.length - 1 && ', '}
          </span>
        ))}
      </p>
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
};
