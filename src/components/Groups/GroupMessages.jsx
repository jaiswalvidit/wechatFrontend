import React from 'react';

const containerStyle = {
  height: '70%',
  background: '#333', // Dark background color
  overflowY: 'auto', // Enable scrolling if content exceeds container height
};

export default function GroupMessages({ messages }) {
  return (
    <div className="group-messages" style={containerStyle}>
      {messages?.map((message, index) => (
        <div key={index} className="message">
          <div className="sender">{message?.sender}</div>
          <div className="text">{message?.text}</div>
          <div className="timestamp">{message?.timestamp}</div>
        </div>
      ))}
    </div>
  );
}
