import React, { useState, useEffect, useContext } from 'react';
import { TextField, Typography, CircularProgress, Modal, Box, Checkbox, FormControlLabel, Button, Select, MenuItem, Chip } from '@mui/material'; // Import Chip component
import { addChat } from '../../services/api';
import { AccountContext } from '../../context/AccountProvider';
import { toast } from 'react-toastify';

export default function GroupCreate() {
  const [groupName, setGroupName] = useState('');
  const [participants, setParticipants] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const { userDetails } = useContext(AccountContext);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://wechatbackend-qlpp.onrender.com/api/users");
        if (!response.ok) throw new Error("Failed to fetch user data");
        const userData = await response.json();
        console.log('userdata', userData);
        const filteredUserData = userData.users.filter(user => user._id !== userDetails._id); // Exclude admin
        setUsers(filteredUserData);
        console.log(filteredUserData);
        setError(null);
      } catch (error) {

        console.error('Error fetching user data:', error.message);
        setError('Failed to fetch user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userDetails]);

  const handleCreateGroup = async () => {
    if (!groupName.trim() || participants.length === 0) {
      setError('Group name and participants cannot be empty');
      return;
    }

    setLoading(true);

    const data = {
      group: groupName,
      users: participants.map(participant => participant._id), // Extract participant IDs
      admin: userDetails._id,
      isGroupChat:true
    };

    try {
      const response = await addChat(data);

      console.log(response);
      if (!response) {
        
        throw new Error('Failed to create group',error.message);
      }
      // setSelectedChat(response.newChat);
      setGroupName('');
      setParticipants([]);
      setError(null);
      setOpenModal(false);
      toast.success('Group created successfully');
    } catch (error) {
      console.error('Error creating group:', error);
      setError('Failed to create group. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleParticipant = (userId) => {
    const selectedUser = users.find(user => user._id === userId);
    if (participants.find(participant => participant._id === userId)) {
      setParticipants(participants.filter(participant => participant._id !== userId));
    } else {
      setParticipants([...participants, selectedUser]);
    }
  };

  const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchText.toLowerCase()));

  const handleUserClick = (userId) => {
    const selectedUser = users.find(user => user._id === userId);
    if (!participants.find(participant => participant._id === userId)) {
      setParticipants([...participants, selectedUser]);
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Create a New Group
      </Typography>
      <TextField
        label="Group Name"
        variant="outlined"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        fullWidth
        margin="normal"
        error={!!error && !groupName.trim()}
        helperText={!!error && !groupName.trim() ? error : ''}
      />
      <TextField
        label="Search Participants"
        variant="outlined"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        fullWidth
        margin="normal"
      />
      <ul>
        {filteredUsers.map((user) => (
          <li key={user._id}>
            <FormControlLabel
              control={<Checkbox checked={participants.find(participant => participant._id === user._id)} onChange={() => handleToggleParticipant(user._id)} />}
              label={user.name}
              onClick={() => handleUserClick(user._id)} // Add onClick handler
            />
          </li>
        ))}
      </ul>
      <Button variant="contained" onClick={() => setOpenModal(true)}>
        Create Group
      </Button>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" id="modal-title" gutterBottom>
            Select Participants
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Select
                multiple
                value={participants.map(participant => participant._id)}
                onChange={(e) => setParticipants(e.target.value)}
                fullWidth
                variant="outlined"
                label="Participants"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    {selected.map((value) => (
                      <Chip key={value} label={users.find(user => user._id === value)?.name} style={{ margin: 2 }} />
                    ))}
                  </Box>
                )}
              >
                {filteredUsers.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    <Checkbox checked={participants.some(participant => participant._id === user._id)} />
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
              <Button variant="contained" onClick={handleCreateGroup} disabled={loading}>
                Create Group
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}
