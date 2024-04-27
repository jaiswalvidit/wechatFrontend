import React, { useState, useEffect, useContext } from 'react';
import {
  TextField, Typography, CircularProgress, Modal, Box, Button, Select,
  MenuItem, Chip, Paper
} from '@mui/material';
import { Add as AddIcon, CheckCircleOutline as CheckCircleOutlineIcon } from '@mui/icons-material';
import { addChat } from '../../services/api';
import { AccountContext } from '../../context/AccountProvider';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function GroupCreate() {
  const [groupName, setGroupName] = useState('');
  const [participants, setParticipants] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const { userDetails,setSelectedChat,setIsGroupCreate } = useContext(AccountContext);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://wechatbackend-qlpp.onrender.com/api/users");
        if (!response.ok) throw new Error("Failed to fetch user data");
        const userData = await response.json();
        setUsers(userData.users.filter(user => user._id !== userDetails._id));
        setError(null);
      } catch (error) {
        setError('Failed to fetch user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userDetails]);
  const navigate=useNavigate();
  const handleCreateGroup = async () => {
    if (!groupName.trim() || participants.length === 0) {
      setError('Group name and at least one participant are required.');
      return;
    }

    setLoading(true);
    const data = { group: groupName, users: participants.map(p => p._id), admin: userDetails._id, isGroupChat: true };

    try {
      const response = await addChat(data);
      if (!response) throw new Error('Failed to create group');
      console.log(response.newChat._id);
      setGroupName('');
      setParticipants([]);
      setError(null);
      setOpenModal(false);

      setSelectedChat(response.newChat);
      navigate('/');
      setIsGroupCreate(false);
      toast.success('Group created successfully');
    } catch (error) {
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
      <Typography variant="h5" gutterBottom>Create a New Group</Typography>
      <Paper elevation={3} sx={{ p: 3, marginBottom: 2 }}>
        <TextField
          label="Group Name"
          variant="outlined"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          fullWidth
          error={!!error && !groupName.trim()}
          helperText={error && !groupName.trim() ? error : ""}
        />
      </Paper>
      <Paper elevation={3} sx={{ p: 3, marginBottom: 2 }}>
        <TextField
          label="Search Participants"
          variant="outlined"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          fullWidth
        />
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
      </Paper>
      <Button
        variant="contained"
        onClick={() => setOpenModal(true)}
        startIcon={<AddIcon />}
        disabled={loading}
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
          <Typography id="modal-title" variant="h6" gutterBottom>Select Participants</Typography>
          {loading ? (
            <CircularProgress />
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
                {users.map((user) => (
                  <MenuItem key={user._id} value={user}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
              <Button
                variant="contained"
                onClick={handleCreateGroup}
                disabled={loading}
                startIcon={<CheckCircleOutlineIcon />}
              >
                Create Group
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
