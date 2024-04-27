import React, { useContext, useState, useEffect } from "react";
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Collapse,
  ListItemIcon,
  Typography,
  Button,
} from "@mui/material";
import { InfoOutlined, PersonOutline } from "@mui/icons-material"; 
import { AccountContext } from "../../context/AccountProvider";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { addMembers, deleteGroupUsers } from "../../services/api";
import { styled } from "@mui/system";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GroupHeaderWrapper = styled("div")({
  backgroundColor: "#f0f0f0",
  padding: "2px 20px",
  borderRadius: "8px",
  // height:'10vh',
  // marginBottom: "16px",
});

const GroupName = styled(Typography)({
  fontSize: "1.5rem",
  fontWeight: "bold",
  marginBottom: "8px",
  marginLeft:'40px',
  color: "#333",
});

const GroupInfo = styled("div")({
  display: "flex",
  alignItems: "center",
  marginBottom: "8px",
});

const GroupAdmin = styled("div")({
  display: "flex",
  alignItems: "center",
});

const InfoButton = styled(IconButton)({
  marginLeft: "auto",
});

const ButtonWrapper = styled("div")({
  marginTop: "16px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const GroupHeader = () => {
  const [showusers, setShowusers] = useState(false);
  const { selectedChat, userDetails, setSelectedChat } = useContext(
    AccountContext
  );
  const [selectedUsersForDeletion, setSelectedUsersForDeletion] = useState([]);
  const [selectedUsersForAddition, setSelectedUsersForAddition] = useState([]);
  const [clickedParticipantId, setClickedParticipantId] = useState(null);
  const [availableMembers, setAvailableMembers] = useState([]);

  useEffect(() => {
    
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://wechatbackend-qlpp.onrender.com/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await response.json();
        // console.log('data is',userData);
        // console.log(selectedChat.users);
        setAvailableMembers(
          userData.users.filter((user) => {
            const isAdmin = user._id === selectedChat.admin._id;
            if (isAdmin) {
              console.log(`User ${user.name} is the admin`);
              return false;
            }

            const isParticipant = selectedChat.users.some(
              (participant) => {
               
                return participant._id === user._id;
              }
            );
           
            return !isParticipant;
          })
        );
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUsers();
  }, [selectedChat, setSelectedChat]);

  const toggleusers = () => {
    setShowusers(!showusers);
  };

  const handleLeaveGroup = async () => {
    try {
      const response = await fetch("http://localhost:8001/api/group/leave", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userDetails._id,
          groupId: selectedChat._id,
        }),
      });
      const data = await response.json();
      console.log("Leave Group Response:", data);
      if (response.ok) {
        toast.success("Left the group successfully");
        console.log(response);
        // Handle any necessary state updates here
      } else {
        toast.error("Failed to leave the group");
      }
    } catch (error) {
      console.error("Error leaving group:", error);
      toast.error("An error occurred while leaving the group");
    }
  };

  const deleteUser = (participantId) => {
    if (!selectedUsersForDeletion.includes(participantId)) {
      setSelectedUsersForDeletion((prevUsers) => [...prevUsers, participantId]);
    }
    setSelectedUsersForAddition([]);
    setClickedParticipantId(participantId);
  };

  const handleDelete = async () => {
    try {
      const data = {
        group: selectedChat._id,
        users: selectedUsersForDeletion,
      };
      if (!data.users) {
        toast.error("Select users to delete");
        return;
      }
      const response = await deleteGroupUsers(data);
      // console.log("group is ", response.group);
      // console.log("response is", response);
      if (response.ok) {
        // console.log("success is", response.group);
        toast.success("Selected users are deleted");
      }
      setSelectedChat(response.group);
      setSelectedUsersForDeletion([]);
      setSelectedUsersForAddition([]);
      setClickedParticipantId();
      setShowusers(false);
    } catch (error) {
      console.log("Error occurred: ", error);
    }
  };

  const handleAddMember = (userId) => {
    setSelectedUsersForAddition((prevUsers) => [...prevUsers, userId]);
    setSelectedUsersForDeletion([]);
  };

  const handleAdd = async () => {
    // console.log("Add clicked");
    // console.log(selectedUsersForAddition);

    try {
      const response = await addMembers({
        groupId: selectedChat._id,
        usersToAdd: selectedUsersForAddition,
      });
      setSelectedUsersForDeletion([]);
      setSelectedUsersForAddition([]);
      console.log("added response ", response.group);
      console.log(response);
      if (!response.group) {
        throw new Error("Invalid response from server");
      }

      // console.log("group is ", response.group);
      setSelectedChat(response.group);
    } catch (error) {
      console.error("Error occurred while adding members:", error);
    }
  };

  // console.log("selected list addition", selectedUsersForAddition);
  // console.log("selected list for deletion ", selectedUsersForDeletion);
  return (
    <GroupHeaderWrapper>
      {selectedChat && (
        <>
          <GroupName variant="h3">{selectedChat.group}</GroupName>
          <GroupInfo>
            <GroupAdmin>
              <ListItemIcon>
                <PersonOutline />
              </ListItemIcon>
              <ListItemText primary={`Admin: ${selectedChat.admin.name}`} />
            </GroupAdmin>
            <InfoButton onClick={toggleusers}>
              <InfoOutlined />
            </InfoButton>
          </GroupInfo>
          <Collapse in={showusers} timeout="auto" unmountOnExit>
            <Typography variant="body1">
              Total Members: {selectedChat?.users?.length + 1}
            </Typography>
            <List>
              {selectedChat.users &&
                selectedChat.users.map((participant, index) => (
                  <ListItem
                    key={index}
                    className={
                      clickedParticipantId === participant._id
                        ? "highlight"
                        : ""
                    }
                  >
                    <ListItemText primary={participant.name} />
                    <IconButton onClick={() => deleteUser(participant._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
            </List>
            <ButtonWrapper>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDelete}
              >
                Delete Selected Users
              </Button>
              {availableMembers.length > 0 && (
                <>
                  <Typography variant="h6">Add More Members:</Typography>
                  <List>
                    {availableMembers.map((member) => (
                      <ListItem key={member._id}>
                        <ListItemText primary={member.name} />
                        <IconButton onClick={() => handleAddMember(member._id)}>
                          <PersonAddIcon />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAdd}
                  >
                    Add More
                  </Button>
                </>
              )}
              <Button
                variant="outlined"
                color="primary"
                onClick={handleLeaveGroup}
              >
                Leave Group
              </Button>
            </ButtonWrapper>
          </Collapse>
        </>
      )}
      <ToastContainer position="top-center" />
    </GroupHeaderWrapper>
  );
};

export default GroupHeader;
