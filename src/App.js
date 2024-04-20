// import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Messenger from './components/chat/Messenger';
import AccountProvider from './context/AccountProvider';
import Login from './components/Login';
import Signup from './components/Signup';
import ChatDialog from './components/chat/ChatDialog';
import SetAvatar from './components/SetAvatar';

// Define your Google OAuth client ID
// const clientId = "pj441595@gmail.com";

function App() {
  return (
    <>
    <AccountProvider >
        {/* <Signup/> */}
        <Router>

          <Routes>
            <Route path="/picture" element={<SetAvatar/>}/>
            <Route path="/" element={<Messenger />} />


            <Route path="/auth/login" element={<Login />} />

            <Route path="/auth/signin" element={<Signup />} />
            {/* <Route path="/auth/message/" element={<ChatDialog />} /> */}

            {/* <Route element={<Error />} /> */}

          </Routes>

        </Router>
      </AccountProvider>
     

    </>
  );
}

export default App;
