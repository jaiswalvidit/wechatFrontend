import React, { useState, useEffect, useContext } from 'react';
import { TextField, Typography, CircularProgress, Modal, Box, Button, Select, MenuItem, Chip, Paper } from '@mui/material';
import { Add as AddIcon, CheckCircleOutline as CheckCircleOutlineIcon } from '@mui/icons-material';
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
  const [selectOpen, setSelectOpen] = useState(false); // State to control the Select component's open state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://wechatbackend-qlpp.onrender.com/api/users");
        if (!response.ok) throw new Error("Failed to fetch user data");
        const userData = await response.json();
        const filteredUserData = userData.users.filter(user => user._id !== userDetails._id);
        setUsers(filteredUserData);
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
      users: participants.map(participant => participant._id),
      admin: userDetails._id,
      isGroupChat: true
    };

    try {
      const response = await addChat(data);

      if (!response) {
        throw new Error('Failed to create group');
      }

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

  const handleChangeParticipants = (event) => {
    setParticipants(event.target.value);
  };

  const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Create a New Group
      </Typography>
      <Paper elevation={3} sx={{ p: 3, marginBottom: 2 }}>
        <TextField
          label="Group Name"
          variant="outlined"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          fullWidth
          error={!!error && !groupName.trim()}
          helperText={error && !groupName.trim() && error}
        />
      </Paper>
      <Paper elevation={3} sx={{ p: 3, marginBottom: 2 }}>
        <TextField
          label="Search Participants"
          variant="outlined"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setSelectOpen(!!e.target.value); // Open Select if there is text in the search field
          }}
          fullWidth
        />
        <Select
          multiple
          value={participants}
          onChange={handleChangeParticipants}
          open={selectOpen} // Control the open state of the Select component
          onClose={() => setSelectOpen(false)} // Close the Select when clicking outside
          fullWidth
          variant="outlined"
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              {selected.map((value) => (
                <Chip key={value._id} label={value.name} style={{ margin: 2 }} />
              ))}
            </Box>
          )}
        >
          {filteredUsers.map((user) => (
            <MenuItem key={user._id} value={user}>
              {user.name}
            </MenuItem>
          ))}
        </Select>
      </Paper>
      <Button
        variant="contained"
        onClick={() => setOpenModal(true)}
        startIcon={<AddIcon />}
      >
        Create Group
      </Button>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" id="modal-title" gutterBottom>
            Select Participants
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Select
                multiple
                value={participants}
                onChange={handleChangeParticipants}
                fullWidth
                variant="outlined"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    {selected.map((value) => (
                      <Chip key={value._id} label={value.name} style={{ margin: 2 }} />
                    ))}
                  </Box>
                )}
              >
                {filteredUsers.map((user) => (
                  <MenuItem key={user._id} value={user}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
              <Button variant="contained" onClick={handleCreateGroup} disabled={loading} startIcon={<CheckCircleOutlineIcon />}>
                Create Group
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
