import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:4000');

export const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('chat message', (msg) => {
      console.log(socket);
      console.log(msg);
      setMessages((messages) => [...messages, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const messageData = {
        msg: input,
        senderId: 'agent',
      };
      socket.emit('chat message', messageData);
      setInput('');
    }
  };

  return (
    <div className="container">
      <strong>Socket ID: {socket.id}</strong>
      <div>
        {messages.map((message, index) => (
          <p key={index} className={`${message.senderId}`}><strong>{message.senderId}:</strong> {message.msg}</p>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
