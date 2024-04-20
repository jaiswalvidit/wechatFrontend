import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from '@emotion/styled';
import { AccountContext } from '../context/AccountProvider';

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
`;

const Card = styled.div`
  background-color: #fff;
  color: #333;
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  background-color: #f9f9f9;
  color: #333;
  font-size: 1rem;
`;

const Button = styled.button`
  width: 100%;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 0.25rem;
  font-size: 1rem;
  cursor: pointer;
`;

const Center = styled.div`
  text-align: center;
`;

const Error = styled.div`
  color: red;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const SignupLink = styled(Link)`
  color: orange;
  margin-left: 0.5rem;
  text-decoration: none;
`;

const Login = () => {
  const navigate = useNavigate();
  const { setUserDetails } = useContext(AccountContext);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://wechatbackend-qlpp.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const json = await response.json();
      setUserDetails(json.user);

      navigate('/');
    } catch (err) {
      console.error('An error occurred:', err);
      setError(err.message || 'An error occurred while logging in');
    } finally {
      setLoading(false);
      setCredentials((prevState) => ({ ...prevState, password: '' }));
    }
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <Card>
          <Title>Login Page</Title>
          <div className="form">
            <Input
              type="text"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>
          <div className="form">
            <Input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
          {error && <Error>{error}</Error>}
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          <Center>
            Don't have an account? <SignupLink to="/auth/signin">Sign up</SignupLink>
          </Center>
        </Card>
      </form>
      <ToastContainer position="top-center" />
    </FormContainer>
  );
};

export default Login;
