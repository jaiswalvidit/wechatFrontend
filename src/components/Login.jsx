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

  .card {
    background-color: #131324;
    color: white;
    padding: 2rem;
    border-radius: 1rem;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }

  .input {
    width: 100%;
    padding: 0.5rem;
    // margin-bottom: 1rem;
    margin:1rem 2px;
    border: none;
    border-radius: 0.25rem;
    background-color: #1f1f2f;
    color: white;
    font-size: 1rem;
  }

  .btn-primary {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 0.4rem;
    font-size: 1rem;
    cursor: pointer;
    width: 100%;
  }

  .center {
    text-align: center;
  }

  .error {
    color: red;
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  .signup-link {
    color: orange;
    margin-left: 0.5rem;
    text-decoration: none;
  }
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
        <div className="card">
          <h1 className="center">Login Page</h1>
          <div className="form">
            <input
              type="text"
              className="input"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>
          <div className="form">
            <input
              type="password"
              className="input"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <div className="center" style={{ fontSize: '1.5rem', margin: '1rem' }}>
            Don't have an account? <Link to="/auth/signin" className="signup-link">Sign up</Link>
          </div>
        </div>
      </form>
      <ToastContainer position="top-center" />
    </FormContainer>
  );
};

export default Login;
