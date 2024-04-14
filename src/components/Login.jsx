import React, { useContext,  useState } from 'react';
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
  background-color: grey;

  .card {
    background-color: #131324;
    color: white;
    padding: 2rem;
    border-radius: 1rem;
    margin: 2rem;
    width: 40vw;
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

const Login = () => {
  const navigate = useNavigate();
  // const [socket, setSocket] = useState(null);
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
          <div>
            <h1 className="center">Login Page</h1>
          </div>
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

          <div className="text-center mx-auto">
            {loading && (
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
            {error && <div className="alert alert-danger">{error}</div>}
            <button
              type="submit"
              className="btn btn-primary mx-2 button"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <div className="center" style={{ fontSize: '1.5rem', margin: '1rem' }}>
              Don't have an account? <Link to="/auth/signin" style={{ color: 'orange', marginLeft: '.5rem' }}>Signin</Link>
            </div>
          </div>
        </div>
      </form>
      <ToastContainer position="top-center" />
    </FormContainer>
  );
};

export default Login;
