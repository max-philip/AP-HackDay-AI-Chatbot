const express = require('express');
const cors = require('cors');
const socketIo = require('socket.io');
const http = require('http');

const {chatWithAssistant} = require('./chat-completions.js');
const {createThread, deleteThread, chatWithOpenAiAssistant} = require('./openai-assistants.js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const aiPort = 5000;
const socketPort = 4000;

app.use(express.json());
app.use(cors());

io.on('connection', (socket) => {
  console.log(`User: ${socket.id} just connected!`);

  socket.on('chat message', (data) => {
    const { msg, senderId } = data;
    
    console.log(`${socket.id} : ${senderId} : ${msg}`);
    io.emit('chat message', { senderId, msg });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(socketPort, () => console.log(`Socket listening on port: ${socketPort}`));

app.listen(aiPort, () => {
  console.log(`Chatbot server running on port: ${aiPort}`);
});

app.post('/chat', async (req, res) => {
    console.log("req.body===>", JSON.stringify(req.body));
    const userInput = req.body.input;
    if (!userInput) {
      return res.status(400).send({ error: 'Input is required' });
    }
    try {
      const response = await chatWithAssistant(userInput);
      console.log("in /chat route try block", response);
      res.send({ response });
    } catch (error) {
      console.error('Error in chat endpoint:', error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  });

app.post('/chatnew', async (req, res) => {
    console.log("req.body===>", JSON.stringify(req.body));
    const userInput = req.body.input;
    if (!userInput) {
        return res.status(400).send({ error: 'Input is required' });
    }
    try {
        const response = await chatWithOpenAiAssistant(req.body);
        console.log("in /chatnew route try block", response);
        res.send({ response });
    } catch (error) {
        console.error('Error in chatnew endpoint:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.get('/thread', async (req, res) => {
    try {
        const response = await createThread();
        console.log("in /thread route try block", response);
        res.send({ response });
    } catch (error) {
        console.error('Error in thread endpoint:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.delete('/thread', async (req, res) => {
    try {
        const response = await deleteThread(req);
        console.log("in DEL /thread route try block", response);
        res.send({ response });
    } catch (error) {
        console.error('Error in DEL thread endpoint:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
