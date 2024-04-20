import React, { useEffect } from "react";
import ChatDialog from "./ChatDialog";
import { useContext } from "react";
import { AccountContext } from "../../context/AccountProvider";
import Login from "../Login";

export default function Messenger() {
  const { userDetails } = useContext(AccountContext);

  useEffect(() => {
    // Retrieve user details from localStorage
  }, []);

  return (
    <div style={{ color: 'pink' }}>
      {userDetails ? (
        <ChatDialog />
      ) : (
        <>
          <Login />
        </>
      )}
    </div>
  );
}
