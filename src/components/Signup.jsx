import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from '@emotion/styled';

const FormContainer = styled.div`
  height: 100vh;
  
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color:grey;

  .card {
    background-color: #131324;
    color: white;
    padding: 0.5rem 2rem;
    border-radius: 1rem;
    width:40vw;
    
  }

  
  

  

  .btn-danger {
    background-color: #ff4757;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 0.4rem;
    font-size: 1rem;
    cursor: pointer;
  }
`;

const Signup = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    picture: '', // Add picture field to state
  });

  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (formError) {
      toast.error(formError);
    }
  }, [formError]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials(prevCredentials => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8001/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const json = await response.json();

      if (response.ok) {
        localStorage.setItem('user_credentials', JSON.stringify(credentials));
        toast.success('Data updated successfully....');
        navigate('/auth/login');
      } else {
        setFormError(json.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormError('Internal server error. Please try again later.');
    }
  };

  return (
    <FormContainer>
      
        <form onSubmit={handleSubmit}>
        <div className='card'>
        <h1 className="center">Signup Page</h1>
        
          <div className="form">
            <input
              type="text"
              className="input"
              id="name"
              name="name"
              value={credentials.name}
              onChange={handleChange}
              placeholder='Name'
              required
            />
          </div>

          
            <input
              type="text"
              className="input"
              id="email"
              name="email"
              placeholder='Email'
              value={credentials.email}
              onChange={handleChange}
              required
            />
          

          
            <input
              type='password'
              className="input"
              id="password"
              name="password"
              placeholder='Password'
              value={credentials.password}
              onChange={handleChange}
              required
            />
         

          {/* Add picture input field */}
         
            <input
              type="text"
              className="input"
              id="picture"
              name="picture"
              placeholder='Picture URL'
              value={credentials.picture}
              onChange={handleChange}
            />
         

          <div className="text-center">
            <button type="submit" className=" button">Sign Up</button>
            <div className='center' style={{fontSize:'1.5rem',margin:'1rem'}}>
            Already have an account<Link to="/auth/login" style={{color:'orange', marginLeft:'.5rem'}}>Login</Link>
          </div>
          </div>
          </div>
        </form>
      
      <ToastContainer position="top-center" />
    </FormContainer>
  );
};

export default Signup;
