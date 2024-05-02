import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';
import { Addpic } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { AccountContext } from '../context/AccountProvider';

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
    onSelect && onSelect(avatar);
  };

  const { userDetails, setUserDetails } = useContext(AccountContext);

  const setProfilePicture = async () => {
    if (selectedAvatar === null) {
      alert("Please select an avatar first.");
      return;
    }
    try {
      const result = await Addpic({ id: userDetails._id, picture: selectedAvatar });
      console.log(result.user,'result');
      setUserDetails(result.user);
      navigate('/');
    } catch (error) {
      console.error('Error setting profile picture:', error);
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigates back to the previous page
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ padding: '20px', borderRadius: '10px', backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Choose Your Avatar</h2>
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
                border: selectedAvatar === avatar ? '2px solid #007bff' : '2px solid transparent',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                transform: selectedAvatar === avatar ? 'scale(1.1)' : 'scale(1)'
              }}
              onClick={() => handleSelectAvatar(avatar)}
            />
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}> <button
          onClick={setProfilePicture}
          disabled={!selectedAvatar}
          className="submit-btn"
          style={{ marginTop: '20px', backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}
        >
          Set as Profile Picture
        </button>
        <button
          onClick={handleBack}
          style={{ marginTop: '20px', backgroundColor: '#ddd', color: '#333', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}
        >
          Go Back
        </button></div>
       
      </div>
    </div>
  );
};

export default AvatarSelector;
