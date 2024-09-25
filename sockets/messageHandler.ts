// import { Server, Socket } from 'socket.io';
// import { getConversations, saveMessage } from './saveMessage';

// export const handleMessageEvents = (io: Server, socket: Socket) => {
//   socket.on('sendMessage', async(data) => {
//     try {
//       const { sender, recipient, content } = data;
//         const roomName = [sender, recipient].sort().join('-');
//         console.log({roomName, sender, recipient, content})
//         console.log(`Message received: ${data}`);
//         await saveMessage(data);
//         io.to(roomName).emit('message', data); 
//       } catch (error) {
//         console.error('Error saving message:', error);
//       }
//   });

//   socket.on('getConversations', async (io:Server, socket:Socket) => {
//     const {sender, recipient} = socket.data;
//     const conversations = await getConversations(sender, recipient);
    
//     socket.emit('conversationHistory', conversations);
//   });

//   socket.on('joinRoom', (io: Server, socket: Socket) => {
//     const { sender, recipient } = socket.data;
//     const roomName = [sender, recipient].sort().join('-');
//     socket.join(roomName);
//     console.log(`User ${sender} joined room: ${roomName}`);
//   });

import { Server, Socket } from 'socket.io';
import { getConversations, saveMessage } from './saveMessage';

export const handleMessageEvents = (io: Server, socket: Socket) => {
  // Handle message sending
  socket.on('sendMessage', async (data) => {
    
    try {
      const { sender, recipient, content } = data;
      const roomName = [sender, recipient].sort().join('-');

      const messageDetails = await saveMessage(data);

      io.to(roomName).emit('message', messageDetails);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  // Handle retrieving conversations
  socket.on('getConversations', async (data) => {
    try {
      console.log('getConversations event triggered');
      const { sender, recipient } = data;
      const conversations = await getConversations(sender, recipient);
      socket.emit('conversationHistory', conversations);
    } catch (error) {
      console.error('Error retrieving conversations:', error);
    }
  });

  // Handle room joining
  socket.on('joinRoom', (data) => {
    const { sender, recipient } = data;
    const roomName = [sender, recipient].sort().join('-');
    socket.join(roomName);
    
    console.log(`User ${sender} joined room: ${roomName}`);
    socket.emit('roomJoined', { roomName });
  });

};
