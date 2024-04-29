// import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Messenger from './components/chat/Messenger';
import AccountProvider from './context/AccountProvider';
import Login from './components/Login';
import Signup from './components/Signup';
import SetAvatar from './components/SetAvatar';
import Room from './components/chat/Room';

function App() {
  return (
    <>
    <AccountProvider >
        
        <Router>

          <Routes>
            <Route path="/picture" element={<SetAvatar/>}/>
            <Route path="/" element={<Messenger />} />
            <Route path="/room/:id" element={<Room/>} />

            <Route path="/auth/login" element={<Login />} />

            <Route path="/auth/signin" element={<Signup />} />
          

          </Routes>

        </Router>
      </AccountProvider>
     

    </>
  );
}

export default App;
