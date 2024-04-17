import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from '@emotion/styled';

const FormContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
`;

const Card = styled.div`
  background-color: #fff;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
`;

const Button = styled.button`
  width: 100%;
  background-color: #ff4757;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 0.25rem;
  font-size: 1rem;
  cursor: pointer;
`;

const Center = styled.div`
  text-align: center;
  margin-top: 1rem;
`;

const Signup = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
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
      const response = await fetch('https://wechatbackend-qlpp.onrender.com/api/users', {
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
      <Card>
        <Title>Signup Page</Title>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            id="name"
            name="name"
            value={credentials.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <Input
            type="text"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <Input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <Button type="submit">Sign Up</Button>
        </form>
        <Center>
          Already have an account? <Link to="/auth/login" style={{ color: 'orange' }}>Login</Link>
        </Center>
      </Card>
      <ToastContainer position="top-center" />
    </FormContainer>
  );
};

export default Signup;
