import { Server, Socket } from 'socket.io';
import { getConversation } from './saveMessage';

export const handleConversationEvents = async(io: Server, socket: Socket) => {
  socket.on('getConversation', async() => {
    try {
      const userId = socket.data.userId; 
      const conversations = await getConversation(userId);
      io.emit('conversations', conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } 
  });

  // socket.on('deleteConversation', (conversationId) => {
  //   console.log(`Deleting conversation: ${conversationId}`);
  //   io.emit('conversationDeleted', conversationId);
  // });
};
