import {React, useRef, useState, useEffect} from 'react';
import io from 'socket.io-client';
import './Chatbot.css';
import Markdown from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links';
import { Header } from './components/Header';
import PreChat from './components/PreChat';

export const Chatbot = ({showChat, minimseChat, serverAddress, variant}) => {

  const [input, setInput] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);

  const [socket, setSocket] = useState(null);
  const [chatMode, setChatMode] = useState('ai');

  const containerRef = useRef(null);

  const baseUrl = `http://${serverAddress}:5000`;
  const socketUrl = `http://${serverAddress}:4000`;

  const [thread, setThread] = useState({});

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/thread`);
        let json = await response.json();
        console.log(json.response);
        setThread(json.response);
      } catch (error) {
        console.log("error", error);
      }
    };

    if (variant === "assistant"){
      fetchData();
    }
  }, []);

  const chatWithAssistant = async (input) => {
    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({'input': input}),
      };

      console.log('REQUST: ', requestOptions);
      const response = await fetch(`${baseUrl}/chat`, requestOptions);
      const responseData = await response.json();
      console.log('RESPONSE: ', responseData);
      
      return responseData.response;
    } catch (error) {
      console.error('Error during POST request:', error);
    }
  }

  const chatWithOpenAiAssistant = async (input) => {
    try {
      console.log({
        'input': input,
        'thread': thread
      })
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          'input': input,
          'thread': thread
        }),
      };

      console.log('REQUST: ', requestOptions);
      const response = await fetch(`${baseUrl}/chatnew`, requestOptions);
      const responseData = await response.json();
      console.log('RESPONSE: ', responseData);

      return responseData.response;
    } catch (error) {
      console.error('Error during POST request:', error);
    }
  }

  const transform = (response) => {
    return response.data.map(d => {
      return {
      'role': d.role,
      'content': d.content[0].text.value
    }})
  }

  const sendAiMessage = async () => {
    const userMessage = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const aiMessage = { role: 'assistant', content: '...' };
    setMessages((prevMessages) => [...prevMessages, aiMessage]);

    setInput('');
    setInputDisabled(true);

    if (!variant || variant !== "assistant") {
      console.log("using completions");
      const response = await chatWithAssistant(input);

      const newAiMessage = {role: 'assistant', content: response};
      setMessages((prevMessages) => [...prevMessages.slice(0, -1), newAiMessage]);
    }
    else if (variant === "assistant") {
      const response = await chatWithOpenAiAssistant(input);
      const transformedResponse = transform(response);

      setMessages((prev) => {
        let new_asst_msgs = 0;
        for (let i = 0; i < transformedResponse.length; i++) {
          if (transformedResponse[i].role === 'assistant') {
            new_asst_msgs++;
          }
          else {
            break;
          }
        }
        return [...prev.slice(0, -1), ...(transformedResponse.slice(0, new_asst_msgs).reverse())]
      });
      if (transformedResponse[0].content === "Sure, connecting you to a live agent now...") {
        setChatMode('agent');
        handleSocketConnect();
        setMessages((prevMessages) => [...prevMessages, {role: 'assistant', content: '**Connected with a Live Agent**'}]);
      }
    }

    setInputDisabled(false);

    console.log(messages);
  }

  const sendSocketMessage = async () => {
    const messageData = {
      msg: input,
      senderId: 'user',
    };
    socket.emit('chat message', messageData);
    setInput('');
  };

  const handleSocketConnect = () => {
    const newSocket = io.connect(socketUrl);
    setSocket(newSocket);
  }
  
  const handleSocketDisconnect = () => {
    if (socket) socket.close();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // TODO: Refactor this switching logic
    if (input.toLowerCase() === 'switch to ai' && chatMode === 'agent') {
      setChatMode('ai');
      handleSocketDisconnect();
      setInput('');
      setMessages((prevMessages) => [...prevMessages, {role: 'user', content: input}, {role: 'assistant', content: '**Connected with your AI Assistant**'}]);
      return;
    }

    if (input.toLowerCase() === 'switch to agent' && chatMode === 'ai') {
      setChatMode('agent');
      handleSocketConnect();
      setInput('');
      setMessages((prevMessages) => [...prevMessages, {role: 'user', content: input}, {role: 'assistant', content: 'Connecting to a live agent...'}]);
      await timeout(2500);
      setMessages((prevMessages) => [...prevMessages, {role: 'assistant', content: '**Connected with a Live Agent**'}]);
      return;
    }

    if (chatMode === 'ai') {
      await sendAiMessage();
    }

    if (chatMode === 'agent') {
      await sendSocketMessage();
    }
  };

  function timeout(delay) {
    return new Promise( res => setTimeout(res, delay) );
}

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (socket) {

      socket.on('chat message', (msg) => {
        console.log(`${socket.id} : ${msg.senderId} : ${msg.msg}`);

        if (msg.senderId === 'user') {
          const userMessage = { role: 'user', content: msg.msg };
          setMessages((prevMessages) => [...prevMessages, userMessage]);
        }

        if (msg.senderId === 'agent') {
          const agentMessage = { role: 'assistant', content: msg.msg };
          setMessages((prevMessages) => [...prevMessages, agentMessage]);
        }
      });

      return () => {
        socket.off('chat message');
      };
    }
  }, [socket]);


  return (
    <div className={showChat ? "chatbot-container show": "chatbot-container"}>
      <Header minimseChat={minimseChat} /> 
      <div className="chatbot-messages" ref={containerRef}>
      <PreChat />
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role}-message ai-message`}
          >
            <Markdown className="markdown-content" rehypePlugins={[[rehypeExternalLinks, {target: '_blank'}]]}>
              {message.content}
            </Markdown>
          </div>
        ))}
      </div>
      <form className="chatbot-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={inputDisabled}
          placeholder="Type your message..."
        />
        <button type="submit">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title/><path d="M22.984.638a.5.5,0,0,0-.718-.559L1.783,10.819a1.461,1.461,0,0,0-.1,2.527h0l4.56,2.882a.25.25,0,0,0,.3-.024L18.7,5.336a.249.249,0,0,1,.361.342L9.346,17.864a.25.25,0,0,0,.062.367L15.84,22.3a1.454,1.454,0,0,0,2.19-.895Z"/><path d="M7.885,19.182a.251.251,0,0,0-.385.211c0,1.056,0,3.585,0,3.585a1,1,0,0,0,1.707.707l2.018-2.017a.251.251,0,0,0-.043-.388Z"/></svg>
        </button>
      </form>
    </div>
  );
}