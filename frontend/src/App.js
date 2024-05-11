import { Chatbot } from './Chatbot';
import './App.css';

import ChatButton  from './components/ChatButton.jsx';
import { useState, useEffect } from 'react';

function App() {
  // Local storage config variables
  const [chatbotEnabled, setChatbotEnabled] = useState('disabled');
  const [serverAddress, setServerAddress] = useState('localhost');
  const [variant, setVariant] = useState('completion');
  
  // Minimise chat state
  const [showChat, setShowChat] = useState(false);

  function openChat(){
    setShowChat(true);
  }

  function minimseChat(){
    setShowChat(false);
  }

  useEffect(() => {
    const enabled = localStorage.getItem('AI_CHATBOT_ENABLED');
    if (enabled) setChatbotEnabled(enabled);

    const ip = localStorage.getItem('AI_CHATBOT_SERVER_ADDRESS');
    if (ip) setServerAddress(ip);

    const chatbotVariant = localStorage.getItem('AI_CHATBOT_VARIANT');
    if (chatbotVariant) setVariant(chatbotVariant);
  }, []);

  if (chatbotEnabled) {
    // Chatbot variant options: assistant OR completion
    return (
      chatbotEnabled === 'enabled' ?
      <>
        <ChatButton openChat={openChat}  />
        <Chatbot variant={variant}  showChat={showChat} minimseChat={minimseChat} serverAddress={serverAddress}/>
      </>
      :
      <div>
        To enable the AI chatbot, you must:
        <ul>
          <li>Set the AI_CHATBOT_ENABLED field to 'enabled' in your browser's local storage.</li>
          <li>Set the AI_CHATBOT_SERVER_ADDRESS field to the IP (format: XXX.XXX.XX.XX) for the API server(s). It is localhost by default.</li>
          <li>Set the AI_CHATBOT_VARIANT field to either 'completion' OR 'assistant' to set the desired model.</li>
          <li>Refresh the page.</li>
        </ul>
      </div>
    );
  }
}

export default App;
