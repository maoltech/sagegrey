import { Server, Socket } from 'socket.io';
import { handleMessageEvents } from './messageHandler';
import { handleConversationEvents } from './conversationHandler';

export const handleConnection = (io: Server, socket: Socket) => {
 

  socket.on('disconnect', () => {
    console.log(`User disconnected with socket ID: ${socket.id}`);
  });
  console.log('test')
  handleMessageEvents(io, socket);
  handleConversationEvents(io, socket);
};
