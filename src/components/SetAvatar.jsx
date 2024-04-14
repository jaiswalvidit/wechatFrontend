import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';
import { Addpic } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import AccountProvider, { AccountContext } from '../context/AccountProvider';

const AvatarSelector = ({ onSelect }) => {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  useEffect(() => {
    const fetchAvatars = async () => {
      const api = 'https://api.multiavatar.com';
      const data = [];
      try {
        for (let i = 0; i < 4; i++) {
          const response = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
          const buffer = Buffer.from(response.data);
          data.push(buffer.toString('base64'));
        }
        setAvatars(data);
      } catch (error) {
        console.error('Error fetching avatars:', error);
      }
    };
    fetchAvatars();
  }, []);

  const handleSelectAvatar = (avatar) => {
    setSelectedAvatar(avatar);
    onSelect && onSelect(avatar); // Trigger callback if provided
  };
  const {userDetails,setUserDetails}=useContext(AccountContext);
  const setProfilePicture = async () => {
    if (selectedAvatar === null) {
      alert("Please select an avatar first.");
      return;
    }
    try {
      console.log(userDetails,'users');
      const result = await Addpic({id:userDetails._id,picture:selectedAvatar}); // Assuming Addpic is a defined async function elsewhere
      console.log(result.user);
      setUserDetails(result.user);
      navigate('/');
    } catch (error) {
      console.error('Error setting profile picture:', error);
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>
        <h2 style={{ textAlign: 'center' }}>Choose Your Avatar</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {avatars.map((avatar, index) => (
            <img
              key={index}
              src={`data:image/svg+xml;base64,${avatar}`}
              alt={`Avatar ${index}`}
              style={{
                width: '100px',
                height: '100px',
                margin: '10px',
                border: selectedAvatar === avatar ? '2px solid blue' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                transform: selectedAvatar === avatar ? 'scale(1.1)' : 'scale(1)'
              }}
              onClick={() => handleSelectAvatar(avatar)}
            />
          ))}
        </div>
        <button 
          onClick={setProfilePicture} 
          disabled={!selectedAvatar} // Disable button when no avatar is selected
          className="submit-btn"
        >
          Set as Profile Picture
        </button>
      </div>
    </div>
  );
};

export default AvatarSelector;
